import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Points,
  PointsMaterial,
  Quaternion,
  RGBAFormat,
  TorusGeometry,
  UnsignedByteType,
  Vector3,
} from 'three';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { MAX_NODE_TRAVEL, getTravelScale } from '../../../lib/connected-studio/model.ts';
import type { ResourceTracker } from './dispose-connected-scene';
import type { ConnectedQuality, ConnectedTier, GraphDefinition, ScenePose } from '../../../lib/connected-studio/types';

// --- layout: one fixed camera, a field spread to the viewport --------------------------------------
// Scene units: x right, y up, z toward the camera. The camera never moves, rolls or zooms; the
// field is spread to the viewport instead, so the graph fills any aspect ratio without a fly-through.

export const CAMERA_Z = 12;
export const CAMERA_FOV_DEGREES = 35;
export const CAMERA_NEAR = 1;
export const CAMERA_FAR = 40;
export const HALF_FOV_TAN = Math.tan((CAMERA_FOV_DEGREES * Math.PI) / 360);

/** Proportions from DESIGN-SPF-V1 (Scene integration): node 0.22, primary ring 0.39, path 0.025. */
export const NODE_RADIUS = 0.22;
export const RING_RADIUS = 0.39;
const CORE_RADIUS = 0.05;
/** Where the light core sits on the node body, toward the key light (unit-ish, times the body radius). */
const CORE_OFFSET = new Vector3(0.45, 0.42, 0.78);

/** Target on-screen ring diameter in CSS px at the reference viewport height (Sonnet tuning, PC-7). */
const RING_DIAMETER_PX: Record<ConnectedTier, { px: number; referenceHeight: number }> = {
  wide: { px: 80, referenceHeight: 900 },
  tablet: { px: 66, referenceHeight: 1024 },
  compact: { px: 46, referenceHeight: 844 },
};
/** Path tube radius in CSS px, so connections read the same at any viewport size. */
const PATH_RADIUS_PX: Record<ConnectedTier, number> = { wide: 1.7, tablet: 1.5, compact: 1.4 };
/** Tracer bead radius in CSS px. */
const TRACER_RADIUS_PX: Record<ConnectedTier, number> = { wide: 2.8, tablet: 2.5, compact: 2.3 };
/** How far toward the viewport edge the farthest node (plus its travel) may reach, per axis. */
const FIT_X: Record<ConnectedTier, number> = { wide: 0.96, tablet: 0.94, compact: 0.88 };
const FIT_Y: Record<ConnectedTier, number> = { wide: 0.9, tablet: 0.9, compact: 0.9 };
const SPREAD_MIN = 0.5;
const SPREAD_MAX = 2.2;
/** Curvature of a connection: the control point leaves the chord by this share of its length. */
const PATH_BOW = 0.16;

export type ConnectedViewport = { width: number; height: number; tier: ConnectedTier };

export type ConnectedLayout = {
  width: number;
  height: number;
  tier: ConnectedTier;
  aspect: number;
  spreadX: number;
  spreadY: number;
  /** `getTravelScale(tier)`: restrains depth on tablet and compact. */
  depthScale: number;
  nodeScale: number;
  pathRadius: number;
  tracerRadius: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Perspective factor of a point at scene depth `z`, relative to the plane the camera frames. */
function perspectiveAt(z: number): number {
  return CAMERA_Z / Math.max(CAMERA_NEAR, CAMERA_Z - z);
}

export function computeConnectedLayout(viewport: ConnectedViewport, graph: GraphDefinition): ConnectedLayout {
  const { width, height, tier } = viewport;
  const aspect = width / height;
  const halfHeight = CAMERA_Z * HALF_FOV_TAN;
  const halfWidth = halfHeight * aspect;
  const depthScale = getTravelScale(tier);
  const margin = MAX_NODE_TRAVEL * depthScale;
  let needX = 0;
  let needY = 0;
  for (const node of graph.nodes) {
    const perspective = perspectiveAt(node.anchor[2] * depthScale);
    needX = Math.max(needX, ((Math.abs(node.anchor[0]) + margin) * perspective) / halfWidth);
    needY = Math.max(needY, ((Math.abs(node.anchor[1]) + margin) * perspective) / halfHeight);
  }
  const unitsPerPx = (2 * halfHeight) / height;
  const ring = RING_DIAMETER_PX[tier];
  const ringPx = ring.px * clamp(height / ring.referenceHeight, 0.85, 1.35);
  return {
    width,
    height,
    tier,
    aspect,
    spreadX: needX > 0 ? clamp(FIT_X[tier] / needX, SPREAD_MIN, SPREAD_MAX) : 1,
    spreadY: needY > 0 ? clamp(FIT_Y[tier] / needY, SPREAD_MIN, SPREAD_MAX) : 1,
    depthScale,
    nodeScale: (ringPx * unitsPerPx) / (2 * RING_RADIUS),
    pathRadius: PATH_RADIUS_PX[tier] * unitsPerPx,
    tracerRadius: TRACER_RADIUS_PX[tier] * unitsPerPx,
  };
}

/** Maps a pose position (anchor space) to scene space: the field spread to the viewport, depth restrained by tier. */
export function toScenePosition(layout: ConnectedLayout, x: number, y: number, z: number, out: Vector3): Vector3 {
  return out.set(x * layout.spreadX, y * layout.spreadY, z * layout.depthScale);
}

type PosedNode = ScenePose['nodes'][number];

export type PoseLookup = {
  node(index: number, id: string): PosedNode | undefined;
  growth(index: number, id: string): number | undefined;
};

/**
 * Finds a graph item's pose entry. Poses are built in graph order, so the positional match is the
 * fast path and allocates nothing; an entry out of order, missing or unknown falls back to an id map
 * built once on first need. Matching is always by id, never by position alone.
 */
export function createPoseLookup(pose: ScenePose): PoseLookup {
  let nodesById: Map<string, PosedNode> | undefined;
  let growthById: Map<string, number> | undefined;
  return {
    node(index, id) {
      const positional = pose.nodes[index];
      if (positional?.id === id) return positional;
      nodesById ??= new Map(pose.nodes.map((node) => [node.id, node]));
      return nodesById.get(id);
    },
    growth(index, id) {
      const positional = pose.edges[index];
      if (positional?.id === id) return positional.growth;
      growthById ??= new Map(pose.edges.map((edge) => [edge.id, edge.growth]));
      return growthById.get(id);
    },
  };
}

// --- resources --------------------------------------------------------------------------------------

const PATH_SEGMENTS = 16;
const PATH_SIDES = 5;
const SKELETON_SEGMENTS = 14;
const PATH_TAIL_COLOR = new Color(0x6fa8e0).multiplyScalar(0.7);
const PATH_HEAD_COLOR = new Color(0xd3e6f7);

/** What each drawable is, for diagnostics and tests. Never shown to a visitor. */
export type ConnectedRole = 'nodes' | 'cores' | 'rings' | 'paths' | 'skeleton' | 'tracers' | 'points';

function tag<T extends { userData: Record<string, unknown> }>(object: T, role: ConnectedRole, extra: Record<string, unknown> = {}): T {
  object.userData.connectedRole = role;
  Object.assign(object.userData, extra);
  return object;
}

export type ConnectedGraphBatch = {
  group: Group;
  /** Every drawable the batch owns, in draw order. */
  drawables: readonly (Mesh | LineSegments | InstancedMesh | Points)[];
  /** Writes the pose into the batched buffers. Pure of time: the same pose always gives the same buffers. */
  update(pose: ScenePose, layout: ConnectedLayout): void;
  /** Spreads the distant points over the viewport. Needed only when the layout changes. */
  fit(layout: ConnectedLayout): void;
};

function instanced(
  tracker: ResourceTracker,
  geometry: BufferGeometry,
  material: MeshBasicMaterial | MeshLambertMaterial,
  count: number,
  role: ConnectedRole,
): InstancedMesh {
  const mesh = tracker.instanced(new InstancedMesh(tracker.geometry(geometry), tracker.material(material), count));
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  return tag(mesh, role);
}

type NodeState = { tiltX: number; tiltZ: number };

/**
 * Builds everything the graph draws into a handful of batched drawables: three instanced meshes for
 * the nodes, cores and rings, one dynamic tube batch for the grown paths and one line batch for the
 * faint skeleton. Connections are never one object each.
 */
export function createGraphBatch(graph: GraphDefinition, tracker: ResourceTracker): ConnectedGraphBatch {
  const group = new Group();
  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;

  const nodes = instanced(
    tracker,
    new IcosahedronGeometry(NODE_RADIUS, 1),
    new MeshLambertMaterial({ color: 0x004589, flatShading: true }),
    nodeCount,
    'nodes',
  );
  // Nearer nodes read a little brighter (their depthScale is larger), with a seeded wobble so they are not clones.
  const tint = new Color();
  graph.nodes.forEach((node, index) => {
    const brightness = 0.82 + ((node.depthScale - 0.7) / 0.3) * 0.38 + (node.seed - 0.5) * 0.1;
    nodes.setColorAt(index, tint.setScalar(brightness));
  });
  if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
  const cores = instanced(tracker, new IcosahedronGeometry(1, 0), new MeshBasicMaterial({ color: 0xf9f6ee, fog: false }), nodeCount, 'cores');
  const rings = instanced(
    tracker,
    new TorusGeometry(RING_RADIUS, 0.02, 6, 48),
    new MeshBasicMaterial({ color: 0x9cc4ec }),
    nodeCount,
    'rings',
  );

  const verticesPerEdge = (PATH_SEGMENTS + 1) * PATH_SIDES;
  const tubeVertices = edgeCount * verticesPerEdge;
  const pathGeometry = tracker.geometry(new BufferGeometry());
  const pathPositions = new BufferAttribute(new Float32Array(tubeVertices * 3), 3).setUsage(DynamicDrawUsage);
  const pathColors = new BufferAttribute(new Float32Array(tubeVertices * 3), 3).setUsage(DynamicDrawUsage);
  pathGeometry.setAttribute('position', pathPositions);
  pathGeometry.setAttribute('color', pathColors);
  const indices: number[] = [];
  for (let edge = 0; edge < edgeCount; edge += 1) {
    const base = edge * verticesPerEdge;
    for (let segment = 0; segment < PATH_SEGMENTS; segment += 1) {
      for (let side = 0; side < PATH_SIDES; side += 1) {
        const a = base + segment * PATH_SIDES + side;
        const b = base + segment * PATH_SIDES + ((side + 1) % PATH_SIDES);
        indices.push(a, b, a + PATH_SIDES, b, b + PATH_SIDES, a + PATH_SIDES);
      }
    }
  }
  pathGeometry.setIndex(indices);
  const paths = tag(
    new Mesh(pathGeometry, tracker.material(new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }))),
    'paths',
    { connections: edgeCount },
  );
  paths.frustumCulled = false;

  const skeletonGeometry = tracker.geometry(new BufferGeometry());
  const skeletonPositions = new BufferAttribute(new Float32Array(edgeCount * SKELETON_SEGMENTS * 2 * 3), 3).setUsage(DynamicDrawUsage);
  skeletonGeometry.setAttribute('position', skeletonPositions);
  const skeleton = tag(
    new LineSegments(
      skeletonGeometry,
      tracker.material(new LineBasicMaterial({ color: 0x6fa8e0, transparent: true, opacity: 0.16, depthWrite: false })),
    ),
    'skeleton',
    { connections: edgeCount },
  );
  skeleton.frustumCulled = false;

  // One bead per connection at most. Only the growing connections are drawn: the count is packed from the front.
  const tracers = instanced(tracker, new IcosahedronGeometry(1, 0), new MeshBasicMaterial({ color: 0xf9f6ee }), edgeCount, 'tracers');
  tracers.count = 0;

  const distant = createDistantPoints(graph.quality, tracker);
  const points = distant.points;

  const drawables = [points, skeleton, paths, nodes, rings, cores, tracers] as const;
  for (const drawable of drawables) group.add(drawable);

  // Static per-graph facts, resolved once so a render never searches by id.
  const nodeIndex = new Map(graph.nodes.map((node, index) => [node.id, index]));
  const edgeEnds = graph.edges.map((edge) => [nodeIndex.get(edge.from), nodeIndex.get(edge.to)] as const);
  if (edgeEnds.some(([from, to]) => from === undefined || to === undefined)) {
    throw new Error('connected-studio: a connection names a node the graph does not contain');
  }
  const nodeStates: NodeState[] = graph.nodes.map((node) => ({ tiltX: 0.5 + node.seed, tiltZ: (node.seed - 0.5) * 1.2 }));
  const bowSigns = graph.edges.map((_, index) => (((index + 1) * 2654435761) >>> 0) % 2 === 0 ? 1 : -1);
  const worldPositions = new Float64Array(nodeCount * 3);

  const matrix = new Matrix4();
  const quaternion = new Quaternion();
  const euler = new Euler();
  const position = new Vector3();
  const scale = new Vector3();
  const coreOffset = new Vector3();
  const from = new Vector3();
  const to = new Vector3();
  const control = new Vector3();
  const point = new Vector3();
  const tangent = new Vector3();
  const normal = new Vector3();
  const binormal = new Vector3();
  const upAxis = new Vector3(0, 0, 1);
  const sideAxis = new Vector3(0, 1, 0);
  const color = new Color();

  function bezier(u: number, out: Vector3): Vector3 {
    const k0 = (1 - u) * (1 - u);
    const k1 = 2 * (1 - u) * u;
    const k2 = u * u;
    return out.set(
      k0 * from.x + k1 * control.x + k2 * to.x,
      k0 * from.y + k1 * control.y + k2 * to.y,
      k0 * from.z + k1 * control.z + k2 * to.z,
    );
  }

  function bezierTangent(u: number, out: Vector3): Vector3 {
    const k0 = 2 * (1 - u);
    const k1 = 2 * u;
    out.set(
      k0 * (control.x - from.x) + k1 * (to.x - control.x),
      k0 * (control.y - from.y) + k1 * (to.y - control.y),
      k0 * (control.z - from.z) + k1 * (to.z - control.z),
    );
    return out.lengthSq() > 1e-12 ? out.normalize() : out.set(1, 0, 0);
  }

  function update(pose: ScenePose, layout: ConnectedLayout): void {
    const lookup = createPoseLookup(pose);
    graph.nodes.forEach((node, index) => {
      const posed = lookup.node(index, node.id);
      const source = posed?.position ?? node.anchor;
      toScenePosition(
        layout,
        finiteOr(source[0], node.anchor[0]),
        finiteOr(source[1], node.anchor[1]),
        finiteOr(source[2], node.anchor[2]),
        position,
      );
      worldPositions.set([position.x, position.y, position.z], index * 3);
      const rotation = posed?.rotation ?? [0, 0, 0];
      const radius = layout.nodeScale * finiteOr(posed?.scale ?? node.depthScale, node.depthScale);
      const rotX = finiteOr(rotation[0], 0);
      const rotY = finiteOr(rotation[1], 0);
      const rotZ = finiteOr(rotation[2], 0);

      scale.setScalar(radius);
      quaternion.setFromEuler(euler.set(rotX, rotY, rotZ, 'YXZ'));
      nodes.setMatrixAt(index, matrix.compose(position, quaternion, scale));

      quaternion.setFromEuler(euler.set(rotX + nodeStates[index].tiltX, rotY, rotZ + nodeStates[index].tiltZ, 'YXZ'));
      rings.setMatrixAt(index, matrix.compose(position, quaternion, scale));

      coreOffset.copy(CORE_OFFSET).multiplyScalar(NODE_RADIUS * radius).add(position);
      scale.setScalar(CORE_RADIUS * radius);
      cores.setMatrixAt(index, matrix.compose(coreOffset, quaternion.identity(), scale));
    });
    nodes.instanceMatrix.needsUpdate = true;
    rings.instanceMatrix.needsUpdate = true;
    cores.instanceMatrix.needsUpdate = true;

    let activeTracers = 0;
    graph.edges.forEach((edge, index) => {
      const [fromIndex, toIndex] = edgeEnds[index] as readonly [number, number];
      from.fromArray(worldPositions, fromIndex * 3);
      to.fromArray(worldPositions, toIndex * 3);
      // A curved path: the control point leaves the chord sideways by a share of its length.
      const chord = point.copy(to).sub(from);
      const length = chord.length();
      normal.set(-chord.y, chord.x, 0);
      if (normal.lengthSq() < 1e-12) normal.set(0, 1, 0);
      normal.normalize();
      control
        .copy(from)
        .add(to)
        .multiplyScalar(0.5)
        .addScaledVector(normal, PATH_BOW * length * bowSigns[index]);
      control.z += PATH_BOW * length * 0.35 * bowSigns[index];

      for (let step = 0; step < SKELETON_SEGMENTS; step += 1) {
        const offset = (index * SKELETON_SEGMENTS + step) * 2 * 3;
        bezier(step / SKELETON_SEGMENTS, point).toArray(skeletonPositions.array as Float32Array, offset);
        bezier((step + 1) / SKELETON_SEGMENTS, point).toArray(skeletonPositions.array as Float32Array, offset + 3);
      }

      const growth = clamp(finiteOr(lookup.growth(index, edge.id) ?? 0, 0), 0, 1);
      for (let ring = 0; ring <= PATH_SEGMENTS; ring += 1) {
        const t = ring / PATH_SEGMENTS;
        const u = Math.min(t, growth);
        // Rings beyond the grown length collapse onto its tip with no radius, so the path ends in a point.
        const radius = t <= growth ? layout.pathRadius : 0;
        bezier(u, point);
        bezierTangent(u, tangent);
        normal.copy(tangent).cross(upAxis);
        if (normal.lengthSq() < 1e-8) normal.copy(tangent).cross(sideAxis);
        normal.normalize();
        binormal.copy(tangent).cross(normal);
        const brightness = growth > 0 ? Math.min(1, u / growth) ** 2 : 0;
        color.copy(PATH_TAIL_COLOR).lerp(PATH_HEAD_COLOR, brightness);
        for (let side = 0; side < PATH_SIDES; side += 1) {
          const angle = (side / PATH_SIDES) * Math.PI * 2;
          const vertex = (index * (PATH_SEGMENTS + 1) + ring) * PATH_SIDES + side;
          pathPositions.setXYZ(
            vertex,
            point.x + radius * (Math.cos(angle) * normal.x + Math.sin(angle) * binormal.x),
            point.y + radius * (Math.cos(angle) * normal.y + Math.sin(angle) * binormal.y),
            point.z + radius * (Math.cos(angle) * normal.z + Math.sin(angle) * binormal.z),
          );
          pathColors.setXYZ(vertex, color.r, color.g, color.b);
        }
      }

      if (growth > 0 && growth < 1) {
        bezier(growth, point);
        scale.setScalar(layout.tracerRadius);
        tracers.setMatrixAt(activeTracers, matrix.compose(point, quaternion.identity(), scale));
        activeTracers += 1;
      }
    });
    tracers.count = activeTracers;
    tracers.instanceMatrix.needsUpdate = true;
    pathPositions.needsUpdate = true;
    pathColors.needsUpdate = true;
    skeletonPositions.needsUpdate = true;
  }

  return { group, drawables, update, fit: distant.fit };
}

/** Distant points: fewer on compact (DESIGN-SPF-V1, Responsive scene). Counts are Sonnet tuning (PC-7). */
const POINT_GRID: Record<ConnectedQuality, { columns: number; rows: number }> = {
  wide: { columns: 12, rows: 10 },
  compact: { columns: 6, rows: 8 },
};
const POINT_SPRITE_SIZE = 16;

/** mulberry32: deterministic, so the same points appear on every load. */
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

/** One tiny soft-edged disc, generated in memory: no canvas, image or font texture. */
function createPointSprite(): DataTexture {
  const data = new Uint8Array(POINT_SPRITE_SIZE * POINT_SPRITE_SIZE * 4);
  const centre = (POINT_SPRITE_SIZE - 1) / 2;
  for (let y = 0; y < POINT_SPRITE_SIZE; y += 1) {
    for (let x = 0; x < POINT_SPRITE_SIZE; x += 1) {
      const distance = Math.hypot(x - centre, y - centre) / (POINT_SPRITE_SIZE / 2);
      const alpha = Math.max(0, Math.min(1, (1 - distance) * 2.2));
      data.set([255, 255, 255, Math.round(alpha * 255)], (y * POINT_SPRITE_SIZE + x) * 4);
    }
  }
  const texture = new DataTexture(data, POINT_SPRITE_SIZE, POINT_SPRITE_SIZE, RGBAFormat, UnsignedByteType);
  texture.needsUpdate = true;
  return texture;
}

type DistantPoints = { points: Points; fit(layout: ConnectedLayout): void };

/**
 * A jittered grid of normalized (-1..1) positions at a few depths behind the field, so the points
 * cover any viewport evenly without clumps. `fit` maps them onto the viewport at the current aspect.
 */
function createDistantPoints(quality: ConnectedQuality, tracker: ResourceTracker): DistantPoints {
  const { columns, rows } = POINT_GRID[quality];
  const random = createRandom(quality === 'wide' ? 0x7a11 : 0xc0a7);
  const field = new Float32Array(columns * rows * 3);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const at = (row * columns + column) * 3;
      field[at] = ((column + 0.1 + random() * 0.8) / columns) * 2 - 1;
      field[at + 1] = ((row + 0.1 + random() * 0.8) / rows) * 2 - 1;
      field[at + 2] = -1.5 - random() * 3;
    }
  }
  const positions = new Float32Array(field.length);
  const geometry = tracker.geometry(new BufferGeometry());
  const attribute = new BufferAttribute(positions, 3);
  geometry.setAttribute('position', attribute);
  const material = tracker.material(
    new PointsMaterial({
      color: 0x9cc4ec,
      size: quality === 'wide' ? 2.2 : 2,
      sizeAttenuation: false,
      map: tracker.texture(createPointSprite()),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      fog: false,
    }),
  );
  const points = tag(new Points(geometry, material), 'points');
  points.frustumCulled = false;
  return {
    points,
    fit(layout) {
      for (let at = 0; at < field.length; at += 3) {
        const halfHeight = (CAMERA_Z - field[at + 2]) * HALF_FOV_TAN;
        positions[at] = field[at] * halfHeight * layout.aspect;
        positions[at + 1] = field[at + 1] * halfHeight;
        positions[at + 2] = field[at + 2];
      }
      attribute.needsUpdate = true;
    },
  };
}
