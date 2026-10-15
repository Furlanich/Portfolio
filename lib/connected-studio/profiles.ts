// PLAN-SFC-V1 Task 4: immutable route-scene profiles. Studio, Founder and Contact carry the Atlas compositions of
// DESIGN-SFC-V1 (normalized rest positions inverse-projected once through the fixed camera); Services and Projects
// keep their existing seeded graphs and vocabulary. No DOM, no Three.
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getConnectedGraph, getQualityForTier, isConnectedTier } from './model.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { CONNECTED_POSTER_POSE } from './media-manifest.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { computeProjectionLayout, unprojectCss } from './projection.ts';
import type { ConnectedQuality, ConnectedRoute, ConnectedTier, GraphDefinition, GraphEdge, GraphNode } from './types';

export type ConnectedNodeStyle = 'legacy' | 'atlas';
export type ConnectedAmbientPolicy = 'legacy' | 'sleep';

/** Normalized rest position of an Atlas node: (u, v) from the left/top of the viewport, zScene in scene units. */
export type ConnectedRestAnchor = { readonly id: string; readonly u: number; readonly v: number; readonly zScene: number };

export type ConnectedInputPolicy = {
  /** Nodes yield to the pointer and the scroll impulse. False on Contact: node offsets stay exactly zero. */
  readonly yieldNodes: boolean;
  /** Strings bend near the pointer. */
  readonly bendEdges: boolean;
  readonly radiusPx: number;
  /** Node displacement cap in CSS px. */
  readonly nodeTravelCapPx: number;
  /** Interior string displacement cap in CSS px. */
  readonly edgeCapPx: number;
  /** Multiplier on the scroll impulse (1 wide/tablet, 0.38 compact). */
  readonly scrollStrength: number;
};

export type ConnectedSceneProfile = {
  readonly route: ConnectedRoute;
  readonly tier: ConnectedTier;
  readonly quality: ConnectedQuality;
  readonly graph: GraphDefinition;
  /** Atlas only: the normalized rest positions the graph anchors were inverse-projected from. */
  readonly restAnchors?: readonly ConnectedRestAnchor[];
  /** Atlas only: the node ids the decorative words bind to, in the owners' word order. Legacy routes bind none. */
  readonly wordNodeIds: readonly string[];
  readonly ambient: ConnectedAmbientPolicy;
  readonly nodeStyle: ConnectedNodeStyle;
  readonly input: ConnectedInputPolicy;
  readonly posterPose: Readonly<{ progress: number; idleAngleRadians: number }>;
};

type Anchor = readonly [number, number];
type Pair = readonly [number, number];

// DESIGN-SFC-V1, "Composition data": target rest positions (u, v) and undirected edges by node index.
const ATLAS_ANCHORS = {
  studio: [[.06,.18],[.29,.11],[.54,.17],[.79,.13],[.94,.25],[.12,.43],[.58,.40],[.66,.38],[.86,.46],[.06,.70],[.27,.62],[.51,.69],[.73,.65],[.94,.73],[.39,.86],[.83,.85]],
  founder: [[.06,.18],[.30,.12],[.55,.18],[.79,.15],[.94,.26],[.12,.43],[.51,.35],[.79,.38],[.94,.47],[.06,.70],[.49,.63],[.79,.61],[.94,.70],[.27,.84],[.56,.85],[.79,.84]],
  contact: [[.06,.20],[.28,.12],[.51,.18],[.80,.18],[.94,.26],[.12,.40],[.39,.36],[.83,.40],[.94,.47],[.06,.70],[.27,.63],[.53,.68],[.85,.63],[.94,.74],[.39,.85],[.82,.85]],
} as const satisfies Record<ProfileRoute, readonly Anchor[]>;

const ATLAS_EDGES = {
  studio: [[0,1],[1,6],[2,6],[3,4],[3,6],[5,6],[6,7],[6,8],[6,10],[6,11],[6,12],[9,10],[10,14],[11,14],[12,13],[12,15],[14,15],[1,2],[7,8],[11,12]],
  founder: [[3,7],[7,11],[11,15],[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[9,10],[10,11],[11,12],[13,14],[14,15],[1,6],[6,10],[10,14]],
  contact: [[0,3],[1,3],[2,3],[3,4],[3,7],[5,7],[6,7],[7,8],[7,12],[9,12],[10,12],[11,12],[12,13],[12,15],[14,15]],
} as const satisfies Record<ProfileRoute, readonly Pair[]>;

/** All three new profiles share the lower-density phone composition. */
const COMPACT_ANCHORS: readonly Anchor[] = [[.09,.16],[.59,.12],[.91,.30],[.24,.39],[.76,.54],[.08,.66],[.39,.86],[.89,.82]];
const COMPACT_EDGES: readonly Pair[] = [[0,1],[1,2],[1,3],[2,4],[3,4],[3,5],[4,6],[4,7],[5,6],[6,7]];

type ProfileRoute = 'studio' | 'founder' | 'contact';

/** Decorative words bind to these nodes in the page owners' order; compact keeps the first two. */
const WORD_NODES: Record<ProfileRoute, readonly string[]> = {
  studio: ['n0', 'n4', 'n8', 'n12'],
  founder: ['n0', 'n4', 'n8', 'n12'],
  contact: ['n0', 'n4', 'n8'],
};
const COMPACT_WORD_COUNT = 2;

/** Depth multiplier per tier on the profile depth law z_i = 0.85 sin(1.7 i): applied once, to the rest anchors. */
const TIER_DEPTH: Record<ConnectedTier, number> = { wide: 1, tablet: 0.7, compact: 0.45 };

const INPUT_RADIUS_PX = 280;
const NODE_TRAVEL_CAP_PX: Record<ConnectedTier, number> = { wide: 34, tablet: 24, compact: 14 };
const EDGE_CAP_PX: Record<ConnectedTier, number> = { wide: 16, tablet: 10, compact: 6 };
const CONTACT_EDGE_CAP_PX = 4;
const COMPACT_SCROLL_STRENGTH = 0.38;

const GOLDEN = 0.6180339887498949;

const ROUTES: readonly ConnectedRoute[] = ['services', 'projects', 'studio', 'founder', 'contact'];

function isProfileRoute(route: ConnectedRoute): route is ProfileRoute {
  return route === 'studio' || route === 'founder' || route === 'contact';
}

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function inputPolicy(route: ConnectedRoute, tier: ConnectedTier): ConnectedInputPolicy {
  return {
    // Contact nodes never move: only its quiet strings respond.
    yieldNodes: route !== 'contact',
    bendEdges: true,
    radiusPx: INPUT_RADIUS_PX,
    nodeTravelCapPx: NODE_TRAVEL_CAP_PX[tier],
    edgeCapPx: route === 'contact' ? CONTACT_EDGE_CAP_PX : EDGE_CAP_PX[tier],
    scrollStrength: tier === 'compact' ? COMPACT_SCROLL_STRENGTH : 1,
  };
}

function buildAtlasProfile(route: ProfileRoute, tier: ConnectedTier, viewport: { width: number; height: number }): ConnectedSceneProfile {
  const compact = tier === 'compact';
  const quality = getQualityForTier(tier);
  const anchors: readonly Anchor[] = compact ? COMPACT_ANCHORS : ATLAS_ANCHORS[route];
  const pairs: readonly Pair[] = compact ? COMPACT_EDGES : ATLAS_EDGES[route];
  const restAnchors: ConnectedRestAnchor[] = anchors.map(([u, v], index) => ({
    id: `n${index}`,
    u,
    v,
    zScene: 0.85 * Math.sin(1.7 * index) * TIER_DEPTH[tier],
  }));
  // Identity scaling: the rest positions are inverse-projected once, so the anchor is the scene position.
  const layout = computeProjectionLayout(
    { nodeStyle: 'atlas', graph: { quality, nodes: [], edges: [] }, restAnchors },
    { width: viewport.width, height: viewport.height, tier },
  );
  const nodes: GraphNode[] = restAnchors.map((rest, index) => ({
    id: rest.id,
    anchor: unprojectCss({ xPx: rest.u * viewport.width, yPx: rest.v * viewport.height, zScene: rest.zScene }, layout),
    seed: Math.round(((index + 1) * GOLDEN % 1) * 1e4) / 1e4,
    depthScale: 1,
  }));
  // Fixed rest, full edges: a zero reveal span is fully grown at every progress.
  const edges: GraphEdge[] = pairs.map(([from, to]) => ({
    id: `n${from}-n${to}`,
    from: `n${from}`,
    to: `n${to}`,
    revealStart: 0,
    revealEnd: 0,
  }));
  return deepFreeze({
    route,
    tier,
    quality,
    graph: { quality, nodes, edges },
    restAnchors,
    wordNodeIds: compact ? WORD_NODES[route].slice(0, COMPACT_WORD_COUNT) : WORD_NODES[route],
    ambient: 'sleep',
    nodeStyle: 'atlas',
    input: inputPolicy(route, tier),
    posterPose: CONNECTED_POSTER_POSE,
  });
}

const legacyProfiles = new Map<string, ConnectedSceneProfile>();

function legacyProfile(route: ConnectedRoute, tier: ConnectedTier): ConnectedSceneProfile {
  const key = `${route}:${tier}`;
  let profile = legacyProfiles.get(key);
  if (!profile) {
    const quality = getQualityForTier(tier);
    // The seeded graph is already deeply frozen and shared by identity with the existing runtime.
    profile = Object.freeze({
      route,
      tier,
      quality,
      graph: getConnectedGraph(quality),
      wordNodeIds: Object.freeze([] as string[]),
      ambient: 'legacy' as const,
      nodeStyle: 'legacy' as const,
      input: Object.freeze(inputPolicy(route, tier)),
      posterPose: CONNECTED_POSTER_POSE,
    });
    legacyProfiles.set(key, profile);
  }
  return profile;
}

/**
 * The immutable profile of one route at one tier. Atlas profiles depend on the viewport, because their rest
 * anchors are normalized to it; Services and Projects ignore it. An unknown route or tier, or an unusable viewport
 * for an Atlas profile, fails closed.
 */
export function getConnectedProfile(
  route: ConnectedRoute,
  tier: ConnectedTier,
  viewport: { readonly width: number; readonly height: number },
): ConnectedSceneProfile {
  if (!ROUTES.includes(route)) throw new RangeError(`Unknown connected route: ${String(route)}`);
  if (!isConnectedTier(tier)) throw new RangeError(`Unknown connected tier: ${String(tier)}`);
  if (!isProfileRoute(route)) return legacyProfile(route, tier);
  if (!Number.isFinite(viewport.width) || !Number.isFinite(viewport.height) || viewport.width <= 0 || viewport.height <= 0) {
    throw new RangeError('connected-studio: the viewport is not a usable size');
  }
  return buildAtlasProfile(route, tier, viewport);
}
