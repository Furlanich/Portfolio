import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, PointsMaterial } from 'three';
import type { SkyChartGroupId, SkyChartNodeDefinition } from '@/lib/immersive-home/sky-chart-model';

const DEG2RAD = Math.PI / 180;

export type Direction = { x: number; y: number; z: number };

/** Unit direction for a yaw/pitch pair already in radians (plan section 10 `dir(yaw, pitch)`). */
export function directionFromRadians(yaw: number, pitch: number): Direction {
  return {
    x: Math.cos(pitch) * Math.sin(yaw),
    y: Math.sin(pitch),
    z: -Math.cos(pitch) * Math.cos(yaw),
  };
}

/** Unit direction for a yaw/pitch pair in degrees (Appendix B and the camera frame). */
export function directionFromDegrees(yawDeg: number, pitchDeg: number): Direction {
  return directionFromRadians(yawDeg * DEG2RAD, pitchDeg * DEG2RAD);
}

// Section 10: "Graticule: meridians every 15 degrees, parallels -60 to 60 every 15 degrees,
// radius 42, #6FA8E0 at opacity 0.07." Each line is subdivided into short segments so it
// still follows the sphere's curvature once drawn as straight `LineSegments`.
const GRATICULE_RADIUS = 42;
const MERIDIAN_STEP_DEG = 15;
const MERIDIAN_LAT_SPAN = 75;
const MERIDIAN_LAT_STEP_DEG = 3;
const PARALLEL_MIN_LAT_DEG = -60;
const PARALLEL_MAX_LAT_DEG = 60;
const PARALLEL_STEP_DEG = 15;
const PARALLEL_LON_STEP_DEG = 3;
export const GRATICULE_COLOR = 0x6fa8e0;
export const GRATICULE_OPACITY = 0.07;

function pushSegment(positions: number[], radius: number, aYawDeg: number, aPitchDeg: number, bYawDeg: number, bPitchDeg: number) {
  const a = directionFromDegrees(aYawDeg, aPitchDeg);
  const b = directionFromDegrees(bYawDeg, bPitchDeg);
  positions.push(a.x * radius, a.y * radius, a.z * radius, b.x * radius, b.y * radius, b.z * radius);
}

/** One `LineSegments` geometry for the atlas graticule: meridians, then parallels. */
export function createGraticuleGeometry(): BufferGeometry {
  const positions: number[] = [];
  for (let lon = 0; lon < 360; lon += MERIDIAN_STEP_DEG) {
    for (let lat = -MERIDIAN_LAT_SPAN; lat < MERIDIAN_LAT_SPAN; lat += MERIDIAN_LAT_STEP_DEG) {
      pushSegment(positions, GRATICULE_RADIUS, lon, lat, lon, lat + MERIDIAN_LAT_STEP_DEG);
    }
  }
  for (let lat = PARALLEL_MIN_LAT_DEG; lat <= PARALLEL_MAX_LAT_DEG; lat += PARALLEL_STEP_DEG) {
    for (let lon = 0; lon < 360; lon += PARALLEL_LON_STEP_DEG) {
      pushSegment(positions, GRATICULE_RADIUS, lon, lat, lon + PARALLEL_LON_STEP_DEG, lat);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
}

export function createGraticuleMaterial(): LineBasicMaterial {
  return new LineBasicMaterial({ color: GRATICULE_COLOR, transparent: true, opacity: GRATICULE_OPACITY });
}

// Section 10: "Field stars: seeded LCG (seed 7, multiplier 16807, modulus 2147483647), radius
// 44, PointsMaterial size 1.4, sizeAttenuation false, #B9C3CC at 0.55."
const FIELD_STAR_RADIUS = 44;
const LCG_SEED = 7;
const LCG_MULTIPLIER = 16807;
const LCG_MODULUS = 2147483647;
export const FIELD_STAR_COLOR = 0xb9c3cc;
export const FIELD_STAR_OPACITY = 0.55;
export const FIELD_STAR_SIZE = 1.4;

/** The same seeded LCG as the reference prototype: deterministic star placement per session. */
function createSeededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * LCG_MULTIPLIER) % LCG_MODULUS;
    return value / LCG_MODULUS;
  };
}

export function createFieldStarsGeometry(count: number): BufferGeometry {
  const random = createSeededRandom(LCG_SEED);
  const positions: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const yaw = random() * Math.PI * 2;
    const pitch = Math.asin(random() * 2 - 1);
    const direction = directionFromRadians(yaw, pitch);
    positions.push(direction.x * FIELD_STAR_RADIUS, direction.y * FIELD_STAR_RADIUS, direction.z * FIELD_STAR_RADIUS);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
}

export function createFieldStarsMaterial(): PointsMaterial {
  return new PointsMaterial({
    color: FIELD_STAR_COLOR,
    size: FIELD_STAR_SIZE,
    sizeAttenuation: false,
    transparent: true,
    opacity: FIELD_STAR_OPACITY,
  });
}

// Section 10 links, in order: (1) each input -> Understand, (2) each tier-3 activity -> its
// phase anchor, (3) Understand -> Define -> Build & review -> Hand over.
export const LINK_PHASE_GROUPS: readonly SkyChartGroupId[] = ['understand', 'define', 'build-review', 'hand-over'];
export const LINK_COLOR = 0x6fa8e0;
export const LINK_OPACITY = 0.75;

export function buildLinkPairs(
  nodes: readonly SkyChartNodeDefinition[],
): readonly (readonly [SkyChartNodeDefinition, SkyChartNodeDefinition])[] {
  const anchors = new Map(
    LINK_PHASE_GROUPS.map((group) => [group, nodes.find((node) => node.group === group && node.tier === 1)!]),
  );
  const understand = anchors.get('understand')!;
  const pairs: (readonly [SkyChartNodeDefinition, SkyChartNodeDefinition])[] = [];

  nodes.filter((node) => node.group === 'inputs').forEach((node) => pairs.push([node, understand]));
  for (const group of LINK_PHASE_GROUPS) {
    const anchor = anchors.get(group)!;
    nodes.filter((node) => node.group === group && node.tier === 3).forEach((node) => pairs.push([node, anchor]));
  }
  for (let i = 0; i < LINK_PHASE_GROUPS.length - 1; i += 1) {
    pairs.push([anchors.get(LINK_PHASE_GROUPS[i])!, anchors.get(LINK_PHASE_GROUPS[i + 1])!]);
  }
  return pairs;
}

export type LinkSegments = { geometry: BufferGeometry; vertexCount: number };

/** One `LineSegments` geometry for every constellation link, at the fixed node radius. */
export function createLinkSegmentsGeometry(nodes: readonly SkyChartNodeDefinition[], nodeRadius: number): LinkSegments {
  const pairs = buildLinkPairs(nodes);
  const positions: number[] = [];
  for (const [from, to] of pairs) {
    const a = directionFromDegrees(from.yaw, from.pitch);
    const b = directionFromDegrees(to.yaw, to.pitch);
    positions.push(a.x * nodeRadius, a.y * nodeRadius, a.z * nodeRadius, b.x * nodeRadius, b.y * nodeRadius, b.z * nodeRadius);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return { geometry, vertexCount: pairs.length * 2 };
}

export function createLinkMaterial(): LineBasicMaterial {
  return new LineBasicMaterial({ color: LINK_COLOR, transparent: true, opacity: LINK_OPACITY });
}
