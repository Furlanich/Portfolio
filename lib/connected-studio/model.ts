import type {
  CapabilityIndex,
  ConnectedQuality,
  ConnectedTier,
  GraphDefinition,
  GraphEdge,
  GraphNode,
  ScenePose,
  Vec3,
} from './types';

const IDLE_RADIANS_PER_SECOND = (1.2 * Math.PI) / 180;
const TAU = Math.PI * 2;

/** About 70ms progress damping (DESIGN-SPF-V1, Motion). */
export const PROGRESS_DAMPING_SECONDS = 0.07;

/** Longest elapsed time one sample integrates: a hidden tab resumes without replaying unseen rotation. */
export const MAX_DELTA_SECONDS = 0.25;

/** Scroll speed that counts as full activity, in pixels per second. */
export const ACTIVITY_REFERENCE_VELOCITY = 1200;

/** About 240ms scroll-impulse decay (DESIGN-SPF-V1, Motion); activity rises with the progress damping. */
export const ACTIVITY_DECAY_SECONDS = 0.24;

/** At full activity, node rotation runs this many times faster on top of the resting rate. */
const ACTIVITY_ROTATION_GAIN = 5;

/** Furthest a node strays from its anchor on the wide tier, in scene units (Sonnet tuning, PC-7). */
export const MAX_NODE_TRAVEL = 0.6;

/** Page-long travel cycles a node completes between the top and the Footer handoff. */
const TRAVEL_CYCLES = 3;

/** How much faster the scroll-activity wobble turns than the idle angle. */
const ACTIVITY_WOBBLE_RATE = 6;

/** A target further than this from the current pose is a jump (anchor, restore, resize): it snaps. */
export const PROGRESS_JUMP_THRESHOLD = 0.3;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function edgeGrowth(edge: GraphEdge, progress: number): number {
  const span = edge.revealEnd - edge.revealStart;
  return span > 0 ? clamp01((progress - edge.revealStart) / span) : progress >= edge.revealEnd ? 1 : 0;
}

export type PoseSampleInput = {
  graph: GraphDefinition;
  tier: ConnectedTier;
  /** Target progress, 0..1; the sampled pose eases toward it. */
  progress: number;
  velocityPxPerSecond: number;
  deltaSeconds: number;
};

/**
 * Local travel: a bounded offset from the anchor driven by page progress (so it is reversible and
 * steady at rest) plus a scroll-activity wobble that fades as the impulse decays. Each axis term is
 * in -1..1 and the axis weights keep the whole vector within MAX_NODE_TRAVEL x tier scale x depth.
 */
function travelPosition(node: GraphNode, progress: number, activity: number, idleAngle: number, scale: number): Vec3 {
  const axis = (phase: number, weight: number): number => {
    const base = Math.sin(TAU * phase);
    const progressTerm = (Math.sin(TAU * (TRAVEL_CYCLES * progress + phase)) - base) / 2;
    const activityTerm = activity * Math.sin(TAU * phase + idleAngle * ACTIVITY_WOBBLE_RATE);
    // Both terms are in -1..1, so half their sum is too.
    return (weight * (progressTerm + activityTerm)) / 2;
  };
  const amplitude = MAX_NODE_TRAVEL * scale * node.depthScale;
  const [x, y, z] = node.anchor;
  return [
    x + amplitude * axis(node.seed, 0.7),
    y + amplitude * axis(node.seed + 1 / 3, 0.6),
    z + amplitude * axis(node.seed + 2 / 3, 0.35),
  ];
}

function sampleActivity(previousActivity: number, velocityPxPerSecond: number, deltaSeconds: number): number {
  const target = Number.isFinite(velocityPxPerSecond) ? clamp01(Math.abs(velocityPxPerSecond) / ACTIVITY_REFERENCE_VELOCITY) : 0;
  return target > previousActivity
    ? previousActivity + (target - previousActivity) * (1 - Math.exp(-deltaSeconds / PROGRESS_DAMPING_SECONDS))
    : target + (previousActivity - target) * Math.exp(-deltaSeconds / ACTIVITY_DECAY_SECONDS);
}

export function sampleConnectedPose(previous: ScenePose | undefined, input: PoseSampleInput): ScenePose {
  const deltaSeconds = Number.isFinite(input.deltaSeconds) ? Math.min(MAX_DELTA_SECONDS, Math.max(0, input.deltaSeconds)) : 0;
  const jumped = !previous || Math.abs(input.progress - previous.progress) > PROGRESS_JUMP_THRESHOLD;
  const progress = jumped
    ? input.progress
    : previous.progress + (input.progress - previous.progress) * (1 - Math.exp(-deltaSeconds / PROGRESS_DAMPING_SECONDS));
  // A jump (anchor, restore, resize) is not scroll activity.
  const scrollActivity = jumped ? 0 : sampleActivity(previous.scrollActivity, input.velocityPxPerSecond, deltaSeconds);
  const idleAngleRadians =
    (previous?.idleAngleRadians ?? 0) +
    deltaSeconds * IDLE_RADIANS_PER_SECOND * (1 + ACTIVITY_ROTATION_GAIN * scrollActivity);
  // Resolved once, and before any node: an unknown tier fails closed even for an empty graph.
  const travelScale = getTravelScale(input.tier);
  return {
    progress,
    idleAngleRadians,
    scrollActivity,
    nodes: input.graph.nodes.map((node) => ({
      id: node.id,
      position: travelPosition(node, progress, scrollActivity, idleAngleRadians, travelScale),
      rotation: [0, idleAngleRadians + node.seed * TAU, 0] as const,
      scale: node.depthScale,
    })),
    edges: input.graph.edges.map((edge) => ({ id: edge.id, growth: edgeGrowth(edge, progress) })),
  };
}

/** Progress reaches 1 when the Footer top reaches this share of the viewport. */
export const FOOTER_COMPLETE_VIEWPORT_FRACTION = 0.7;

export function measureConnectedProgress(scrollY: number, footerDocumentTop: number, viewportHeight: number): number {
  // A layout that cannot be measured yields no progress rather than a non-finite pose.
  if (!Number.isFinite(scrollY) || !Number.isFinite(footerDocumentTop) || !Number.isFinite(viewportHeight)) return 0;
  const distance = Math.max(1, footerDocumentTop - FOOTER_COMPLETE_VIEWPORT_FRACTION * Math.max(0, viewportHeight));
  return clamp01(scrollY / distance);
}

// --- Seeded graphs -----------------------------------------------------------------------------
// Anchors are scene units: x right, y up, z toward the camera. The wide field spreads across a
// landscape viewport; the compact field is one portrait ring. Node layout, word assignment, reveal
// order and span are Sonnet-tuned constants (PC-7), recorded in the Task 2 receipt.

const ANCHOR_PRECISION = 1e4;
const REVEAL_SPAN = 0.22;
const GRAPH_SEED = 0x5eed2026;
const Z_MIN = -1.9;
const Z_MAX = 0.9;

function round(value: number): number {
  return Math.round(value * ANCHOR_PRECISION) / ANCHOR_PRECISION;
}

/** mulberry32: a tiny deterministic PRNG, so geometry never resets or differs between loads. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type OrbitSpec = { rx: number; ry: number; tilt: number; jitter: number };

function orbitNode(
  random: () => number,
  id: string,
  capabilityIndex: CapabilityIndex,
  angle: number,
  orbit: OrbitSpec,
): GraphNode {
  const localX = Math.cos(angle) * orbit.rx + (random() - 0.5) * 2 * orbit.jitter;
  const localY = Math.sin(angle) * orbit.ry + (random() - 0.5) * 2 * orbit.jitter;
  const x = localX * Math.cos(orbit.tilt) - localY * Math.sin(orbit.tilt);
  const y = localX * Math.sin(orbit.tilt) + localY * Math.cos(orbit.tilt);
  const z = Math.min(Z_MAX, Math.max(Z_MIN, 1.4 * Math.sin(angle * 1.5 + random() * TAU) - 0.5));
  const depthScale = 0.7 + (0.3 * (z - Z_MIN)) / (Z_MAX - Z_MIN);
  return {
    id,
    capabilityIndex,
    anchor: [round(x), round(y), round(z)] as const,
    seed: round(random()),
    depthScale: round(depthScale),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function buildEdges(nodes: readonly GraphNode[], pairs: readonly (readonly [number, number])[]): readonly GraphEdge[] {
  const random = createRandom(GRAPH_SEED ^ nodes.length);
  const order = pairs.map((_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }
  const last = pairs.length - 1;
  return order.map((pairIndex, position) => {
    const [from, to] = pairs[pairIndex];
    const revealStart = round((position / last) * (1 - REVEAL_SPAN));
    return {
      id: `${nodes[from].id}-${nodes[to].id}`,
      from: nodes[from].id,
      to: nodes[to].id,
      revealStart,
      revealEnd: Math.min(1, round(revealStart + REVEAL_SPAN)),
    };
  });
}

function buildWideGraph(): GraphDefinition {
  const random = createRandom(GRAPH_SEED);
  const outer: OrbitSpec = { rx: 4.6, ry: 2.5, tilt: (-8 * Math.PI) / 180, jitter: 0.25 };
  const inner: OrbitSpec = { rx: 2.5, ry: 1.35, tilt: (24 * Math.PI) / 180, jitter: 0.2 };
  // Even nodes sit on the outer orbit, odd nodes on the tilted inner one. Node n and n + 8 share a
  // capability word and sit on opposite sides of the same orbit.
  const nodes = Array.from({ length: 16 }, (_, n) =>
    orbitNode(random, `w${pad(n)}`, (n % 8) as CapabilityIndex, (n / 16) * TAU, n % 2 === 0 ? outer : inner),
  );
  const pairs: [number, number][] = [];
  for (let k = 0; k < 8; k += 1) {
    pairs.push([2 * k, 2 * ((k + 1) % 8)]); // outer ring
    pairs.push([2 * k + 1, 2 * ((k + 1) % 8) + 1]); // inner ring
    pairs.push([2 * k, 2 * k + 1]); // spoke to the inner node after
    pairs.push([2 * k, 2 * ((k + 7) % 8) + 1]); // spoke to the inner node before
  }
  pairs.push([0, 6]); // one long chord across the field
  return { quality: 'wide', nodes, edges: buildEdges(nodes, pairs) };
}

function buildCompactGraph(): GraphDefinition {
  const random = createRandom(GRAPH_SEED ^ 0xc0);
  const ring: OrbitSpec = { rx: 1.45, ry: 3, tilt: 0, jitter: 0.18 };
  const nodes = Array.from({ length: 8 }, (_, n) =>
    orbitNode(random, `c${n}`, n as CapabilityIndex, (n / 8) * TAU + 0.3, ring),
  );
  const pairs: [number, number][] = [];
  for (let n = 0; n < 8; n += 1) pairs.push([n, (n + 1) % 8]);
  pairs.push([0, 3], [1, 5], [2, 6], [3, 7], [4, 7]);
  return { quality: 'compact', nodes, edges: buildEdges(nodes, pairs) };
}

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

const graphCache = new Map<ConnectedQuality, GraphDefinition>();

export function getConnectedGraph(quality: ConnectedQuality): GraphDefinition {
  if (!isConnectedQuality(quality)) throw new RangeError(`Unknown connected quality: ${String(quality)}`);
  let graph = graphCache.get(quality);
  if (!graph) {
    graph = deepFreeze(quality === 'wide' ? buildWideGraph() : buildCompactGraph());
    graphCache.set(quality, graph);
  }
  return graph;
}

/** The scene hides when the Footer top reaches this share of the viewport. */
export const FOOTER_HIDE_VIEWPORT_FRACTION = 0.18;

export function isFooterDominant(scrollY: number, footerDocumentTop: number, viewportHeight: number): boolean {
  if (!Number.isFinite(scrollY) || !Number.isFinite(footerDocumentTop) || !Number.isFinite(viewportHeight)) return false;
  return footerDocumentTop - scrollY <= FOOTER_HIDE_VIEWPORT_FRACTION * Math.max(0, viewportHeight);
}

/** Wide >= 1024 CSS px, tablet 768-1023, compact below 768. An unusable width is the lightest tier. */
export function getTierForWidth(widthPx: number): ConnectedTier {
  if (!Number.isFinite(widthPx) || widthPx < 768) return 'compact';
  return widthPx < 1024 ? 'tablet' : 'wide';
}

/** Tablet shares the wide graph (16 nodes, 33 connections); only compact simplifies it. */
export function getQualityForTier(tier: ConnectedTier): ConnectedQuality {
  if (!isConnectedTier(tier)) throw new RangeError(`Unknown connected tier: ${String(tier)}`);
  return tier === 'compact' ? 'compact' : 'wide';
}

/** Travel and depth scale per tier (PC-1): wide 1, tablet and compact restrained. Sonnet tuning. */
export function getTravelScale(tier: ConnectedTier): number {
  if (!isConnectedTier(tier)) throw new RangeError(`Unknown connected tier: ${String(tier)}`);
  return tier === 'wide' ? 1 : tier === 'tablet' ? 0.72 : 0.55;
}

export function isConnectedTier(value: unknown): value is ConnectedTier {
  return value === 'wide' || value === 'tablet' || value === 'compact';
}

export function isConnectedQuality(value: unknown): value is ConnectedQuality {
  return value === 'wide' || value === 'compact';
}
