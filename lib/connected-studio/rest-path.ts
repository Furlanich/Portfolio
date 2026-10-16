// PLAN-SFC-V1 Task 4: the analytic rest path of one connection, shared by the physics and the renderer. Legacy
// (Services/Projects) connections keep the SPF quadratic bow with its deterministic edge signs; Atlas connections
// are straight. There is no second bow and no straight fallback for the legacy style.
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { anchorToScene, sceneToAnchor } from './projection.ts';
import type { ConnectedProjectionLayout, Vec3 } from './types';
import type { ConnectedNodeStyle } from './profiles';

/** Curvature of a legacy connection: the control point leaves the chord by this share of its length. */
const PATH_BOW = 0.16;
/** Share of the bow that also moves the control point toward or away from the camera. */
const PATH_BOW_DEPTH = 0.35;

export type RestEdgeInput = {
  readonly nodeStyle: ConnectedNodeStyle;
  /** The connection's index in graph order: it alone decides the legacy bow's side. */
  readonly edgeIndex: number;
  /** Anchor-space endpoints: the current, possibly displaced, node positions. */
  readonly from: Vec3;
  readonly to: Vec3;
  readonly layout: ConnectedProjectionLayout;
};

/** The side a legacy connection bows toward: a fixed hash of its index, so the shape never changes between loads. */
function bowSign(edgeIndex: number): 1 | -1 {
  return ((((edgeIndex + 1) * 2654435761) >>> 0) % 2) === 0 ? 1 : -1;
}

/**
 * Position at `s` (0 = `from`, 1 = `to`, clamped) on the rest path, in anchor space. Legacy endpoints are
 * transformed to scene space once, bowed and evaluated there, and the result is inverted once. Atlas endpoints
 * interpolate linearly. The ends are the endpoints themselves, so a pinned string stays attached to its nodes.
 */
export function evaluateRestEdge(input: RestEdgeInput, s: number): Vec3 {
  const t = Number.isFinite(s) ? Math.min(1, Math.max(0, s)) : 0;
  const { from, to } = input;
  if (input.nodeStyle === 'atlas') {
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, from[2] + (to[2] - from[2]) * t];
  }
  const a = anchorToScene(from, input.layout);
  const b = anchorToScene(to, input.layout);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const length = Math.hypot(dx, dy, dz);
  // The chord's perpendicular in the picture plane; a chord along the view axis has none, so it bows straight up.
  let nx = -dy;
  let ny = dx;
  if (nx * nx + ny * ny < 1e-12) {
    nx = 0;
    ny = 1;
  }
  const normalLength = Math.hypot(nx, ny);
  nx /= normalLength;
  ny /= normalLength;
  const sign = bowSign(input.edgeIndex);
  const cx = (a[0] + b[0]) * 0.5 + nx * PATH_BOW * length * sign;
  const cy = (a[1] + b[1]) * 0.5 + ny * PATH_BOW * length * sign;
  const cz = (a[2] + b[2]) * 0.5 + PATH_BOW * length * PATH_BOW_DEPTH * sign;
  const k0 = (1 - t) * (1 - t);
  const k1 = 2 * (1 - t) * t;
  const k2 = t * t;
  return sceneToAnchor([k0 * a[0] + k1 * cx + k2 * b[0], k0 * a[1] + k1 * cy + k2 * b[1], k0 * a[2] + k1 * cz + k2 * b[2]], input.layout);
}
