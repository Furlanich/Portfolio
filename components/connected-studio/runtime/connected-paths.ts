// PLAN-SFC-V1 Task 8: the renderer's flexible path of one connection. It is the shared analytic rest path (the SPF
// quadratic bow on Services/Projects, a straight line on Atlas routes) of the possibly displaced endpoints, plus a
// smooth cubic interpolation of the seven string residuals the pure model reports, clamped to the profile's CSS cap.
// Pure of the GPU and of time: no Three import, and no allocation that outlives a call.
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { anchorToScene, projectAnchor } from '../../../lib/connected-studio/projection.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { evaluateRestEdge } from '../../../lib/connected-studio/rest-path.ts';
import type { ConnectedProjectionLayout, EdgeSamplePoints, Vec3 } from '../../../lib/connected-studio/types';
import type { ConnectedNodeStyle } from '../../../lib/connected-studio/profiles';

/**
 * Tube rings per connection, minus one. Twelve is the plan's ceiling and puts a ring exactly on each of the seven
 * string samples (the even rings, s = j/6), so the drawn tube passes through the physics without resampling.
 */
export const PATH_SEGMENTS = 12;

const SAMPLE_COUNT = 7;
const LAST_SEGMENT = SAMPLE_COUNT - 2;
/** The clamp is solved against the picture-plane projection; two refinements are far below a thousandth of a pixel. */
const CLAMP_REFINEMENTS = 2;

export type EdgePathInput = {
  readonly nodeStyle: ConnectedNodeStyle;
  /** The connection's index in graph order: it alone decides the legacy bow's side. */
  readonly edgeIndex: number;
  /** Anchor-space endpoints: the current, possibly displaced, node positions. */
  readonly from: Vec3;
  readonly to: Vec3;
  readonly layout: ConnectedProjectionLayout;
  /** ID-matched string points in anchor space (seven, at s = j/6). Absent: the path is the rest path. */
  readonly samples?: EdgeSamplePoints;
  /** Cap on the rendered distance from the rest path, in CSS px. */
  readonly capPx: number;
};

export type EdgePath = {
  /** Fixes the connection every later `pointAt` describes. Replaces the previous one completely. */
  prepare(input: EdgePathInput): void;
  /** Writes the scene-space point at `u` (0 = from node, 1 = to node, clamped) into `out` at `offset`. */
  pointAt(u: number, out: { [index: number]: number }, offset?: number): void;
};

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/** Creates a reusable evaluator: `prepare` once per connection per frame, then `pointAt` as often as needed. */
export function createEdgePath(): EdgePath {
  // Residuals of the seven samples against the rest path, anchor space; the two ends are always zero (pinned).
  const residual = new Float64Array(SAMPLE_COUNT * 3);
  const blended = new Float64Array(3);
  let input: EdgePathInput | undefined;
  let sceneFrom: Vec3 = [0, 0, 0];
  let sceneTo: Vec3 = [0, 0, 0];
  let hasResidual = false;
  let cap = 0;

  /** Catmull-Rom through the seven residuals at knots j/6; the first and last knots repeat, and both ends are zero. */
  function cubicResidual(s: number): void {
    const scaled = s * LAST_SEGMENT + s; // s * (SAMPLE_COUNT - 1)
    const segment = Math.min(LAST_SEGMENT, Math.floor(scaled));
    const f = scaled - segment;
    const f2 = f * f;
    const f3 = f2 * f;
    const before = Math.max(segment - 1, 0) * 3;
    const start = segment * 3;
    const end = (segment + 1) * 3;
    const after = Math.min(segment + 2, SAMPLE_COUNT - 1) * 3;
    for (let axis = 0; axis < 3; axis += 1) {
      const p0 = residual[before + axis];
      const p1 = residual[start + axis];
      const p2 = residual[end + axis];
      const p3 = residual[after + axis];
      blended[axis] = 0.5 * (2 * p1 + (p2 - p0) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f2 + (3 * p1 - p0 - 3 * p2 + p3) * f3);
    }
  }

  return {
    prepare(next) {
      input = next;
      sceneFrom = anchorToScene(next.from, next.layout);
      sceneTo = anchorToScene(next.to, next.layout);
      cap = Number.isNaN(next.capPx) ? 0 : Math.max(0, next.capPx);
      residual.fill(0);
      hasResidual = false;
      if (!next.samples) return;
      for (let j = 1; j < SAMPLE_COUNT - 1; j += 1) {
        const rest = evaluateRestEdge(next, j / (SAMPLE_COUNT - 1));
        const sample = next.samples[j];
        for (let axis = 0; axis < 3; axis += 1) {
          const value = finiteOrZero(sample[axis] - rest[axis]);
          residual[j * 3 + axis] = value;
          if (value !== 0) hasResidual = true;
        }
      }
    },
    pointAt(u, out, offset = 0) {
      if (!input) throw new Error('connected-studio: pointAt called before prepare');
      const s = Number.isFinite(u) ? Math.min(1, Math.max(0, u)) : 0;
      if (s === 0 || s === 1) {
        const end = s === 0 ? sceneFrom : sceneTo;
        out[offset] = end[0];
        out[offset + 1] = end[1];
        out[offset + 2] = end[2];
        return;
      }
      const rest = evaluateRestEdge(input, s);
      let x = rest[0];
      let y = rest[1];
      let z = rest[2];
      if (hasResidual) {
        cubicResidual(s);
        let rx = blended[0];
        let ry = blended[1];
        let rz = blended[2];
        const at = projectAnchor(rest, input.layout);
        for (let pass = 0; pass <= CLAMP_REFINEMENTS; pass += 1) {
          const moved = projectAnchor([rest[0] + rx, rest[1] + ry, rest[2] + rz], input.layout);
          const length = Math.hypot(moved.xPx - at.xPx, moved.yPx - at.yPx);
          if (!(length > cap)) break;
          const ratio = length > 0 ? cap / length : 0;
          rx *= ratio;
          ry *= ratio;
          rz *= ratio;
        }
        x += rx;
        y += ry;
        z += rz;
      }
      const scene = anchorToScene([x, y, z], input.layout);
      out[offset] = scene[0];
      out[offset + 1] = scene[1];
      out[offset + 2] = scene[2];
    },
  };
}
