import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DataTexture,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Quaternion,
  RGBAFormat,
  RingGeometry,
  UnsignedByteType,
  Vector3,
} from 'three';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { CAMERA_FOV_DEGREES, CAMERA_NEAR, CAMERA_Z, HALF_FOV_TAN, RING_RADIUS, anchorToScene, computeProjectionLayout } from '../../../lib/connected-studio/projection.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { PATH_SEGMENTS, createEdgePath } from './connected-paths.ts';
import type { ResourceTracker } from './dispose-connected-scene';
import type { ConnectedNodeStyle } from '../../../lib/connected-studio/profiles';
import type { ConnectedProjectionLayout, ConnectedQuality, ConnectedTier, GraphDefinition, ScenePose } from '../../../lib/connected-studio/types';

// --- layout: one fixed camera, a field spread to the viewport --------------------------------------
// Scene units: x right, y up, z toward the camera. The camera never moves, rolls or zooms. The camera constants,
// the legacy spread-to-viewport fit, the poster blend and every conversion live in the pure projection seam
// (lib/connected-studio/projection.ts); this module only draws what that seam resolves.

export { CAMERA_FOV_DEGREES, CAMERA_NEAR, CAMERA_Z, HALF_FOV_TAN, RING_RADIUS };
export const CAMERA_FAR = 40;

/**
 * The node look (owner direction, 2026-10-12, superseding DESIGN-SPF-V1's sphere-and-orbit proportions): a
 * simple white dot inside one thin outer ring, flat and turned to face the camera, as on Home. A proposed bead (owner approval OPEN, Task 8 receipt Ruling 7)
 * rides the ring and turns with the slow idle rotation, which is how "nodes/rings rotate slowly at rest" stays
 * visible on a flat node. Scene units at node scale 1; the ring is the label anchor (connected-labels.ts).
 */
export const NODE_RADIUS = 0.14;
const RING_THICKNESS = 0.03;
const BEAD_RADIUS = 0.05;

export type ConnectedViewport = { width: number; height: number; tier: ConnectedTier };

/** The resolved projection frame: structurally the pure model's `ConnectedProjectionLayout`. */
export type ConnectedLayout = ConnectedProjectionLayout;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/** The native frame for a viewport, from the pure seam. Legacy unless the scene draws an Atlas profile. */
export function computeConnectedLayout(viewport: ConnectedViewport, graph: GraphDefinition, nodeStyle: ConnectedNodeStyle = 'legacy'): ConnectedLayout {
  return computeProjectionLayout({ nodeStyle, graph }, viewport);
}

/** Maps a pose position (anchor space) to scene space: the legacy spread and tier depth, applied once, by the pure seam. */
export function toScenePosition(layout: ConnectedLayout, x: number, y: number, z: number, out: Vector3): Vector3 {
  const [sx, sy, sz] = anchorToScene([x, y, z], layout);
  return out.set(sx, sy, sz);
}

type PosedNode = ScenePose['nodes'][number];

export type PoseLookup = {
  node(index: number, id: string): PosedNode | undefined;
  growth(index: number, id: string): number | undefined;
  /** The seven string points of a connection, or undefined when the pose carries none for it. */
  samples(index: number, id: string): NonNullable<ScenePose['edgeSamples']>[number]['points'] | undefined;
  /** The pose's excitation of a node or connection, clamped to 0..1; 0 when the pose has none for the id. */
  excitation(id: string): number;
};

/**
 * Finds a graph item's pose entry. Poses are built in graph order, so the positional match is the
 * fast path and allocates nothing; an entry out of order, missing or unknown falls back to an id map
 * built once on first need. Matching is always by id, never by position alone.
 */
export function createPoseLookup(pose: ScenePose): PoseLookup {
  let nodesById: Map<string, PosedNode> | undefined;
  let growthById: Map<string, number> | undefined;
  let samplesById: Map<string, NonNullable<ScenePose['edgeSamples']>[number]['points']> | undefined;
  let excitationById: Map<string, number> | undefined;
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
    samples(index, id) {
      const list = pose.edgeSamples;
      if (!list || list.length === 0) return undefined;
      const positional = list[index];
      if (positional?.id === id) return positional.points;
      samplesById ??= new Map(list.map((entry) => [entry.id, entry.points]));
      return samplesById.get(id);
    },
    excitation(id) {
      const list = pose.excitation;
      if (!list || list.length === 0) return 0;
      excitationById ??= new Map(list.map((entry) => [entry.id, Number.isFinite(entry.value) ? Math.min(1, Math.max(0, entry.value)) : 0]));
      return excitationById.get(id) ?? 0;
    },
  };
}

// --- resources --------------------------------------------------------------------------------------

const PATH_SIDES = 5;
/** Largest CSS-px distance a drawn string may leave its rest path when no profile says otherwise (the widest cap). */
export const DEFAULT_EDGE_CAP_PX = 16;
const SKELETON_SEGMENTS = 14;
const PATH_TAIL_COLOR = new Color(0x6fa8e0).multiplyScalar(0.7);
const PATH_HEAD_COLOR = new Color(0xd3e6f7);

// New-profile appearance (DESIGN-SFC-V1, Composition data): lines are chart lit (sky.lit) with opacity up to 0.55 and
// nodes have opacity up to 0.88. Both are material caps; the pose's excitation never raises either. Emphasis is drawn as
// colour: a connection lifts from chart lit toward the pale head colour, and a dot, ring and bead lift from their rest
// level to full brightness. The rest level is a tuned constant awaiting owner review of the rendered scene.
const ATLAS_LINE_COLOR = new Color(0x6fa8e0);
const ATLAS_LINE_OPACITY = 0.55;
const ATLAS_NODE_OPACITY = 0.88;
const ATLAS_NODE_REST = 0.8;

/** What each drawable is, for diagnostics and tests. Never shown to a visitor. */
export type ConnectedRole = 'nodes' | 'rings' | 'beads' | 'paths' | 'skeleton' | 'tracers' | 'points';

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
  /** Changes how connections are drawn (rest style, string cap) without touching any resource. */
  configure(options: ConnectedPathOptions): void;
};

/** How a batch draws its connections; both follow the route's profile and tier. */
export type ConnectedPathOptions = {
  /** Atlas rest edges are straight; legacy edges keep the SPF bow. Defaults to legacy. */
  nodeStyle?: ConnectedNodeStyle;
  /** The profile's string cap in CSS px; defaults to the widest cap. */
  edgeCapPx?: number;
};

function instanced(
  tracker: ResourceTracker,
  geometry: BufferGeometry,
  material: MeshBasicMaterial,
  count: number,
  role: ConnectedRole,
): InstancedMesh {
  const mesh = tracker.instanced(new InstancedMesh(tracker.geometry(geometry), tracker.material(material), count));
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  return tag(mesh, role);
}

/**
 * Builds everything the graph draws into a handful of batched drawables: three instanced meshes for
 * the white node dots, their rings and the beads that ride them, one dynamic tube batch for the grown paths and one
 * line batch for the faint skeleton. Connections are never one object each.
 */
export function createGraphBatch(graph: GraphDefinition, tracker: ResourceTracker, options: ConnectedPathOptions = {}): ConnectedGraphBatch {
  const group = new Group();
  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;

  // The dot is the node: flat, white, drawn over the paths that end at it (the polygon offset beats the tube at the same depth).
  const nodeMaterial = new MeshBasicMaterial({ color: 0xf9f6ee, fog: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const nodes = instanced(tracker, new CircleGeometry(NODE_RADIUS, 32), nodeMaterial, nodeCount, 'nodes');
  // Nearer nodes read a little brighter (their depthScale is larger), with a seeded wobble so they are not clones.
  // Atlas dots are uniform instead; the rest level of each dot is what an excitation lifts from.
  const legacyTint = graph.nodes.map((node) => Math.min(1, 0.84 + ((node.depthScale - 0.7) / 0.3) * 0.16 + (node.seed - 0.5) * 0.06));
  const tint = new Color();
  graph.nodes.forEach((_, index) => nodes.setColorAt(index, tint.setScalar(legacyTint[index])));
  // One thin outer ring per node on every tier: flat, light, with no second orbit.
  const ringMaterial = new MeshBasicMaterial({ color: 0xcfe2f5 });
  const rings = instanced(
    tracker,
    new RingGeometry(RING_RADIUS - RING_THICKNESS / 2, RING_RADIUS + RING_THICKNESS / 2, 64),
    ringMaterial,
    nodeCount,
    'rings',
  );
  // The bead rides the ring at the node's rotation angle, so the idle rotation stays visible on a flat node.
  const beadMaterial = new MeshBasicMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const beads = instanced(tracker, new CircleGeometry(BEAD_RADIUS, 16), beadMaterial, nodeCount, 'beads');
  graph.nodes.forEach((_, index) => {
    rings.setColorAt(index, tint.setScalar(1));
    beads.setColorAt(index, tint.setScalar(1));
  });

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
  const pathMaterial = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide });
  const paths = tag(
    new Mesh(pathGeometry, tracker.material(pathMaterial)),
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

  const drawables = [points, skeleton, paths, rings, nodes, beads, tracers] as const;
  for (const drawable of drawables) group.add(drawable);

  // Static per-graph facts, resolved once so a render never searches by id.
  const nodeIndex = new Map(graph.nodes.map((node, index) => [node.id, index]));
  const edgeEnds = graph.edges.map((edge) => [nodeIndex.get(edge.from), nodeIndex.get(edge.to)] as const);
  if (edgeEnds.some(([from, to]) => from === undefined || to === undefined)) {
    throw new Error('connected-studio: a connection names a node the graph does not contain');
  }
  // How connections are drawn: the rest curve of the route's style, and how far a string may leave it. Both follow
  // the profile (they change with the tier), so the batch can be reconfigured without rebuilding any resource.
  let nodeStyle: ConnectedNodeStyle = options.nodeStyle ?? 'legacy';
  let edgeCapPx = options.edgeCapPx ?? DEFAULT_EDGE_CAP_PX;
  // The excitation last written for each dot (NaN forces a write), so colours upload only when something changed.
  const writtenLevel = new Float64Array(nodeCount).fill(Number.NaN);

  /**
   * Materials and draw order for the route's look. Atlas lines and nodes are translucent with the approved caps and
   * keep the legacy draw order explicitly (translucent objects are otherwise sorted by distance); the faint skeleton
   * would add light past the 0.55 line cap, so Atlas does not draw it. Legacy is the unchanged opaque look.
   */
  function applyStyle(style: ConnectedNodeStyle): void {
    const atlas = style === 'atlas';
    const looks = [
      [pathMaterial, ATLAS_LINE_OPACITY],
      [nodeMaterial, ATLAS_NODE_OPACITY],
      [ringMaterial, ATLAS_NODE_OPACITY],
      [beadMaterial, ATLAS_NODE_OPACITY],
    ] as const;
    for (const [material, opacity] of looks) {
      if (material.transparent !== atlas) material.needsUpdate = true;
      material.transparent = atlas;
      material.opacity = atlas ? opacity : 1;
    }
    pathMaterial.depthWrite = !atlas;
    skeleton.visible = !atlas;
    [points, skeleton, paths, rings, nodes, beads, tracers].forEach((drawable, order) => {
      drawable.renderOrder = atlas ? order : 0;
    });
    writtenLevel.fill(Number.NaN);
  }
  applyStyle(nodeStyle);
  // Finite anchor-space node positions of the current pose: the one place the pose is sanitised.
  const anchorPositions = new Float64Array(nodeCount * 3);
  const edgePath = createEdgePath();
  // Pooled scratch: the tube's centreline points, and one skeleton polyline. Nothing is allocated per frame here.
  const centreline = new Float64Array((PATH_SEGMENTS + 1) * 3);
  const polyline = new Float64Array((SKELETON_SEGMENTS + 1) * 3);

  const matrix = new Matrix4();
  const quaternion = new Quaternion();
  const facing = new Vector3();
  const position = new Vector3();
  const scale = new Vector3();
  const beadOffset = new Vector3();
  const forward = new Vector3(0, 0, 1);
  const point = new Vector3();
  const tangent = new Vector3();
  const lastTangent = new Vector3();
  const normal = new Vector3();
  const binormal = new Vector3();
  const upAxis = new Vector3(0, 0, 1);
  const sideAxis = new Vector3(0, 1, 0);
  const color = new Color();

  function update(pose: ScenePose, layout: ConnectedLayout): void {
    const lookup = createPoseLookup(pose);
    let colourDirty = false;
    graph.nodes.forEach((node, index) => {
      const posed = lookup.node(index, node.id);
      const source = posed?.position ?? node.anchor;
      anchorPositions[index * 3] = finiteOr(source[0], node.anchor[0]);
      anchorPositions[index * 3 + 1] = finiteOr(source[1], node.anchor[1]);
      anchorPositions[index * 3 + 2] = finiteOr(source[2], node.anchor[2]);
      toScenePosition(layout, anchorPositions[index * 3], anchorPositions[index * 3 + 1], anchorPositions[index * 3 + 2], position);
      const radius = layout.nodeScale * finiteOr(posed?.scale ?? node.depthScale, node.depthScale);
      // Dot, ring and bead turn to face the camera, so a ring reads as a circle across the whole viewport.
      facing.set(-position.x, -position.y, CAMERA_Z - position.z).normalize();
      quaternion.setFromUnitVectors(forward, facing);
      scale.setScalar(radius);
      nodes.setMatrixAt(index, matrix.compose(position, quaternion, scale));
      rings.setMatrixAt(index, matrix.compose(position, quaternion, scale));

      // The bead's angle is the node's slow rotation about the vertical axis, the same value the model advances at rest.
      const angle = finiteOr((posed?.rotation ?? [0, 0, 0])[1], 0);
      beadOffset
        .set(Math.cos(angle) * RING_RADIUS * radius, Math.sin(angle) * RING_RADIUS * radius, 0)
        .applyQuaternion(quaternion)
        .add(position);
      beads.setMatrixAt(index, matrix.compose(beadOffset, quaternion, scale));

      // Excitation lifts the dot, its ring and its bead from the style's rest level to full brightness.
      const excitation = lookup.excitation(node.id);
      if (writtenLevel[index] !== excitation) {
        writtenLevel[index] = excitation;
        const rest = nodeStyle === 'atlas' ? ATLAS_NODE_REST : 1;
        const dotRest = nodeStyle === 'atlas' ? ATLAS_NODE_REST : legacyTint[index];
        nodes.setColorAt(index, tint.setScalar(dotRest + (1 - dotRest) * excitation));
        rings.setColorAt(index, tint.setScalar(rest + (1 - rest) * excitation));
        beads.setColorAt(index, tint.setScalar(rest + (1 - rest) * excitation));
        colourDirty = true;
      }
    });
    if (colourDirty) {
      for (const mesh of [nodes, rings, beads]) if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    nodes.instanceMatrix.needsUpdate = true;
    rings.instanceMatrix.needsUpdate = true;
    beads.instanceMatrix.needsUpdate = true;

    let activeTracers = 0;
    graph.edges.forEach((edge, index) => {
      const [fromIndex, toIndex] = edgeEnds[index] as readonly [number, number];
      // One flexible path per connection: the shared rest path of the displaced endpoints plus the bounded string
      // residual. Growth, the tube, the skeleton and the tracer are all read from it, so none can disagree.
      edgePath.prepare({
        nodeStyle,
        edgeIndex: index,
        from: [anchorPositions[fromIndex * 3], anchorPositions[fromIndex * 3 + 1], anchorPositions[fromIndex * 3 + 2]],
        to: [anchorPositions[toIndex * 3], anchorPositions[toIndex * 3 + 1], anchorPositions[toIndex * 3 + 2]],
        layout,
        samples: lookup.samples(index, edge.id),
        capPx: edgeCapPx,
      });

      // The faint skeleton is a legacy look; Atlas hides it, so its buffer is not rewritten.
      if (skeleton.visible) {
        for (let step = 0; step <= SKELETON_SEGMENTS; step += 1) edgePath.pointAt(step / SKELETON_SEGMENTS, polyline, step * 3);
        for (let step = 0; step < SKELETON_SEGMENTS; step += 1) {
          const offset = (index * SKELETON_SEGMENTS + step) * 2 * 3;
          for (let axis = 0; axis < 6; axis += 1) skeletonPositions.array[offset + axis] = polyline[step * 3 + axis];
        }
      }

      const growth = clamp(finiteOr(lookup.growth(index, edge.id) ?? 0, 0), 0, 1);
      const emphasis = lookup.excitation(edge.id);
      for (let ring = 0; ring <= PATH_SEGMENTS; ring += 1) edgePath.pointAt(Math.min(ring / PATH_SEGMENTS, growth), centreline, ring * 3);
      lastTangent.set(1, 0, 0);
      for (let ring = 0; ring <= PATH_SEGMENTS; ring += 1) {
        const t = ring / PATH_SEGMENTS;
        const u = Math.min(t, growth);
        // Rings beyond the grown length collapse onto its tip with no radius, so the path ends in a point.
        const radius = t <= growth ? layout.pathRadius : 0;
        const before = Math.max(ring - 1, 0) * 3;
        const after = Math.min(ring + 1, PATH_SEGMENTS) * 3;
        tangent.set(centreline[after] - centreline[before], centreline[after + 1] - centreline[before + 1], centreline[after + 2] - centreline[before + 2]);
        // A coincident or collapsed neighbourhood has no direction of its own: keep the last one rather than invent one.
        if (tangent.lengthSq() > 1e-18) lastTangent.copy(tangent).normalize();
        tangent.copy(lastTangent);
        normal.copy(tangent).cross(upAxis);
        if (normal.lengthSq() < 1e-8) normal.copy(tangent).cross(sideAxis);
        normal.normalize();
        binormal.copy(tangent).cross(normal);
        const brightness = growth > 0 ? Math.min(1, u / growth) ** 2 : 0;
        // Atlas lines are one chart-lit colour; legacy lines brighten along their grown length. Emphasis lifts either.
        if (nodeStyle === 'atlas') color.copy(ATLAS_LINE_COLOR);
        else color.copy(PATH_TAIL_COLOR).lerp(PATH_HEAD_COLOR, brightness);
        if (emphasis > 0) color.lerp(PATH_HEAD_COLOR, emphasis);
        for (let side = 0; side < PATH_SIDES; side += 1) {
          const angle = (side / PATH_SIDES) * Math.PI * 2;
          const vertex = (index * (PATH_SEGMENTS + 1) + ring) * PATH_SIDES + side;
          pathPositions.setXYZ(
            vertex,
            centreline[ring * 3] + radius * (Math.cos(angle) * normal.x + Math.sin(angle) * binormal.x),
            centreline[ring * 3 + 1] + radius * (Math.cos(angle) * normal.y + Math.sin(angle) * binormal.y),
            centreline[ring * 3 + 2] + radius * (Math.cos(angle) * normal.z + Math.sin(angle) * binormal.z),
          );
          pathColors.setXYZ(vertex, color.r, color.g, color.b);
        }
      }

      if (growth > 0 && growth < 1) {
        edgePath.pointAt(growth, polyline, 0);
        point.set(polyline[0], polyline[1], polyline[2]);
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

  function configure(next: ConnectedPathOptions): void {
    const style = next.nodeStyle ?? nodeStyle;
    if (style !== nodeStyle) {
      nodeStyle = style;
      applyStyle(style);
    }
    edgeCapPx = next.edgeCapPx ?? edgeCapPx;
  }

  return { group, drawables, update, fit: distant.fit, configure };
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
      material.size = (quality === 'wide' ? 2.2 : 2) * (layout.pointScale ?? 1);
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
