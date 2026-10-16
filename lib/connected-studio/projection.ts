// PLAN-SFC-V1 Task 4: the one pure projection authority. The fixed 35 degree, z = 12 camera, the legacy spread /
// depth / fit factors, the poster cover crop, and the CSS <-> anchor conversions live here and nowhere else in the
// pure model. Independent of the DOM and of Three. CSS dimensions only: the device pixel ratio never enters it.
//
// The legacy layout and poster formulas are extracted unchanged from the runtime (`connected-geometry.ts`,
// `connected-projection.ts`); scripts/connected-studio-projection.test.mjs pins them equal until the runtime delegates
// here (PLAN-SFC-V1 Task 8).
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { MAX_NODE_TRAVEL, getTravelScale, isConnectedTier } from './model.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { CONNECTED_POSTER_CAPTURE } from './media-manifest.ts';
import type { ConnectedProjectionLayout, ConnectedTier, ScenePose, Vec3 } from './types';
import type { ConnectedSceneProfile } from './profiles';

export const CAMERA_Z = 12;
export const CAMERA_FOV_DEGREES = 35;
export const CAMERA_NEAR = 1;
export const HALF_FOV_TAN = Math.tan((CAMERA_FOV_DEGREES * Math.PI) / 360);

/** Ring radius in scene units at node scale 1: the same flat ring the runtime draws (label anchor). */
export const RING_RADIUS = 0.39;

/** Legacy ring diameter in CSS px at the reference viewport height (Sonnet tuning, SPF PC-7). */
const RING_DIAMETER_PX: Record<ConnectedTier, { px: number; referenceHeight: number }> = {
  wide: { px: 44, referenceHeight: 900 },
  tablet: { px: 38, referenceHeight: 1024 },
  compact: { px: 30, referenceHeight: 844 },
};
const PATH_RADIUS_PX: Record<ConnectedTier, number> = { wide: 1.7, tablet: 1.5, compact: 1.4 };
const TRACER_RADIUS_PX: Record<ConnectedTier, number> = { wide: 2.8, tablet: 2.5, compact: 2.3 };
const FIT_X: Record<ConnectedTier, number> = { wide: 0.96, tablet: 0.94, compact: 0.88 };
const FIT_Y: Record<ConnectedTier, number> = { wide: 0.9, tablet: 0.9, compact: 0.9 };
const SPREAD_MIN = 0.5;
const SPREAD_MAX = 2.2;

/** Atlas ring diameter, dot excluded, in CSS px (DESIGN-SFC-V1): 18 wide, 16 tablet, 14 compact, at any height. */
const ATLAS_RING_DIAMETER_PX: Record<ConnectedTier, number> = { wide: 18, tablet: 16, compact: 14 };
/** Atlas edge weight is about one CSS px (radius 0.5). The tracer bead is a Sonnet tuning ruling (Task 4 receipt). */
const ATLAS_PATH_RADIUS_PX = 0.5;
const ATLAS_TRACER_RADIUS_PX = 1.5;

export type ProjectionProfile = Pick<ConnectedSceneProfile, 'nodeStyle' | 'graph' | 'restAnchors'>;
export type ProjectionViewport = { readonly width: number; readonly height: number; readonly tier: ConnectedTier };

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

function pxPerUnitAt(layout: ConnectedProjectionLayout, zScene: number): number {
  return layout.height / 2 / (HALF_FOV_TAN * Math.max(CAMERA_NEAR, CAMERA_Z - zScene));
}

function usable(viewport: ProjectionViewport): boolean {
  return (
    isConnectedTier(viewport.tier) &&
    Number.isFinite(viewport.width) &&
    Number.isFinite(viewport.height) &&
    viewport.width > 0 &&
    viewport.height > 0
  );
}

/**
 * The native projection frame for a viewport. Legacy profiles reproduce the existing spread-to-viewport fit; Atlas
 * profiles have identity spread and depth (their depth and tier factors are already applied to the rest anchors).
 */
export function computeProjectionLayout(profile: ProjectionProfile, viewport: ProjectionViewport): ConnectedProjectionLayout {
  if (!usable(viewport)) throw new RangeError('connected-studio: the viewport is not a usable size and tier');
  const { width, height, tier } = viewport;
  const aspect = width / height;
  const halfHeight = CAMERA_Z * HALF_FOV_TAN;
  const unitsPerPx = (2 * halfHeight) / height;
  if (profile.nodeStyle === 'atlas') {
    return {
      width,
      height,
      tier,
      aspect,
      spreadX: 1,
      spreadY: 1,
      depthScale: 1,
      nodeScale: (ATLAS_RING_DIAMETER_PX[tier] * unitsPerPx) / (2 * RING_RADIUS),
      pathRadius: ATLAS_PATH_RADIUS_PX * unitsPerPx,
      tracerRadius: ATLAS_TRACER_RADIUS_PX * unitsPerPx,
    };
  }
  const halfWidth = halfHeight * aspect;
  const depthScale = getTravelScale(tier);
  const margin = MAX_NODE_TRAVEL * depthScale;
  let needX = 0;
  let needY = 0;
  for (const node of profile.graph.nodes) {
    const perspective = perspectiveAt(node.anchor[2] * depthScale);
    needX = Math.max(needX, ((Math.abs(node.anchor[0]) + margin) * perspective) / halfWidth);
    needY = Math.max(needY, ((Math.abs(node.anchor[1]) + margin) * perspective) / halfHeight);
  }
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

/** Anchor space (pose positions) to scene space: the legacy spread and tier depth, applied once. Identity on Atlas. */
export function anchorToScene(position: Vec3, layout: ConnectedProjectionLayout): Vec3 {
  return [position[0] * layout.spreadX, position[1] * layout.spreadY, position[2] * layout.depthScale];
}

/** The inverse of `anchorToScene`, applied once. A degenerate factor leaves its axis unscaled. */
export function sceneToAnchor(position: Vec3, layout: ConnectedProjectionLayout): Vec3 {
  return [
    layout.spreadX > 0 ? position[0] / layout.spreadX : position[0],
    layout.spreadY > 0 ? position[1] / layout.spreadY : position[1],
    layout.depthScale > 0 ? position[2] / layout.depthScale : position[2],
  ];
}

/**
 * Projects an anchor-space position to CSS px within the visible viewport: the crop offset is subtracted, and
 * `inView` is false behind the near plane or outside the visible crop (or the frame when there is no crop).
 */
export function projectAnchor(position: Vec3, layout: ConnectedProjectionLayout): { xPx: number; yPx: number; inView: boolean } {
  const [x, y, z] = anchorToScene(position, layout);
  const inFront = CAMERA_Z - z >= CAMERA_NEAR;
  const scale = pxPerUnitAt(layout, z);
  const xPx = layout.width / 2 + x * scale - (layout.crop?.x ?? 0);
  const yPx = layout.height / 2 - y * scale - (layout.crop?.y ?? 0);
  return {
    xPx,
    yPx,
    inView:
      inFront &&
      xPx >= 0 &&
      xPx <= (layout.crop?.width ?? layout.width) &&
      yPx >= 0 &&
      yPx <= (layout.crop?.height ?? layout.height),
  };
}

/** CSS px at a scene depth back to an anchor-space position: crop and the legacy scaling are inverted once. */
export function unprojectCss(input: { xPx: number; yPx: number; zScene: number }, layout: ConnectedProjectionLayout): Vec3 {
  const scale = pxPerUnitAt(layout, input.zScene);
  return sceneToAnchor(
    [
      (input.xPx + (layout.crop?.x ?? 0) - layout.width / 2) / scale,
      (layout.height / 2 - (input.yPx + (layout.crop?.y ?? 0))) / scale,
      input.zScene,
    ],
    layout,
  );
}

/**
 * Reproduces the poster's CSS cover crop first, then eases to the normal responsive field. Legacy profiles keep the
 * exact runtime blend of the fit factors and travel scale. Atlas profiles carry rest positions normalized to the
 * (cover-scaled, cropped) frame, so each node keeps its normalized place in the poster at blend 1, and any
 * displacement the pose already carries is preserved in CSS px across the frame change.
 */
export function resolvePosterProjection(
  profile: ProjectionProfile,
  pose: ScenePose,
  nativeLayout: ConnectedProjectionLayout,
): { layout: ConnectedProjectionLayout; pose: ScenePose } {
  const blend = typeof pose.posterBlend === 'number' && Number.isFinite(pose.posterBlend) ? Math.min(1, Math.max(0, pose.posterBlend)) : 0;
  if (blend === 0) return { layout: nativeLayout, pose };
  const graph = profile.graph;
  const capture = CONNECTED_POSTER_CAPTURE[graph.quality];
  const tier = graph.quality; // Tablet shares the wide poster, including its depth and travel.
  const source = computeProjectionLayout(profile, { ...capture, tier });
  const scale = Math.max(nativeLayout.width / capture.width, nativeLayout.height / capture.height);
  const mix = (normal: number, poster: number) => normal + (poster - normal) * blend;
  const width = mix(nativeLayout.width, capture.width * scale);
  const height = mix(nativeLayout.height, capture.height * scale);
  const layout: ConnectedProjectionLayout = {
    ...nativeLayout,
    width,
    height,
    aspect: width / height,
    spreadX: mix(nativeLayout.spreadX, source.spreadX),
    spreadY: mix(nativeLayout.spreadY, source.spreadY),
    depthScale: mix(nativeLayout.depthScale, source.depthScale),
    nodeScale: mix(nativeLayout.nodeScale, source.nodeScale),
    pathRadius: mix(nativeLayout.pathRadius, source.pathRadius),
    tracerRadius: mix(nativeLayout.tracerRadius, source.tracerRadius),
    pointScale: mix(1, scale),
    crop: {
      x: (width - nativeLayout.width) * CONNECTED_POSTER_CAPTURE.position.x,
      y: (height - nativeLayout.height) * CONNECTED_POSTER_CAPTURE.position.y,
      width: nativeLayout.width,
      height: nativeLayout.height,
    },
  };
  if (profile.nodeStyle === 'atlas') return { layout, pose: rebaseAtlasPose(profile, pose, nativeLayout, layout) };
  const travel = mix(1, getTravelScale(tier) / getTravelScale(nativeLayout.tier));
  if (travel === 1) return { layout, pose };
  const anchors = new Map(graph.nodes.map((node) => [node.id, node.anchor]));
  return {
    layout,
    pose: {
      ...pose,
      nodes: pose.nodes.map((node) => {
        const anchor = anchors.get(node.id);
        if (!anchor) return node;
        return {
          ...node,
          position: node.position.map((value, axis) => anchor[axis] + (value - anchor[axis]) * travel) as unknown as Vec3,
        };
      }),
    },
  };
}

function rebaseAtlasPose(
  profile: ProjectionProfile,
  pose: ScenePose,
  native: ConnectedProjectionLayout,
  frame: ConnectedProjectionLayout,
): ScenePose {
  const rests = new Map((profile.restAnchors ?? []).map((rest) => [rest.id, rest]));
  const crop = frame.crop ?? { x: 0, y: 0, width: frame.width, height: frame.height };
  // Strings were expressed in the native frame; the controller derives them after this seam, so none survive it.
  const { edgeSamples: _discarded, ...rest } = pose;
  void _discarded;
  return {
    ...rest,
    nodes: pose.nodes.map((node) => {
      const anchor = rests.get(node.id);
      if (!anchor) return node;
      const here = projectAnchor(node.position, native);
      const xPx = finiteOr(here.xPx, anchor.u * native.width) + (anchor.u * frame.width - crop.x) - anchor.u * native.width;
      const yPx = finiteOr(here.yPx, anchor.v * native.height) + (anchor.v * frame.height - crop.y) - anchor.v * native.height;
      return { ...node, position: unprojectCss({ xPx, yPx, zScene: anchorToScene(node.position, native)[2] }, frame) };
    }),
  };
}
