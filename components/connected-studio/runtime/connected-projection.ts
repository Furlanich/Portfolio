// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { resolvePosterProjection } from '../../../lib/connected-studio/projection.ts';
import type { ConnectedProjectionLayout, GraphDefinition, ScenePose } from '../../../lib/connected-studio/types';
import type { ConnectedSceneProfile } from '../../../lib/connected-studio/profiles';
import type { ConnectedLayout } from './connected-geometry';

/** What the pure poster seam needs to know about the scene it resolves. */
export type ConnectedProjectionProfile = Pick<ConnectedSceneProfile, 'nodeStyle' | 'restAnchors'>;

function usableLayout(layout: ConnectedProjectionLayout): boolean {
  const numbers = [layout.width, layout.height, layout.aspect, layout.spreadX, layout.spreadY, layout.depthScale, layout.nodeScale, layout.pathRadius, layout.tracerRadius];
  if (!numbers.every((value) => Number.isFinite(value)) || layout.width <= 0 || layout.height <= 0 || layout.aspect <= 0) return false;
  const crop = layout.crop;
  return crop === undefined || (Object.values(crop).every((value) => Number.isFinite(value)) && crop.width > 0 && crop.height > 0);
}

/**
 * The frame to draw a pose in. A pose that carries the frame the controller resolved is drawn in exactly that frame:
 * the poster blend was applied once, before interaction, and must not be applied again. A pose without one (a legacy
 * caller) gets the pure poster seam's fallback; it reproduces the poster's CSS cover crop and eases to `native`.
 */
export function resolveConnectedProjection(
  graph: GraphDefinition,
  pose: ScenePose,
  native: ConnectedLayout,
  profile: ConnectedProjectionProfile = { nodeStyle: 'legacy' },
): { layout: ConnectedLayout; pose: ScenePose } {
  if (pose.projectionLayout && usableLayout(pose.projectionLayout)) return { layout: pose.projectionLayout, pose };
  return resolvePosterProjection({ nodeStyle: profile.nodeStyle, restAnchors: profile.restAnchors, graph }, pose, native);
}
