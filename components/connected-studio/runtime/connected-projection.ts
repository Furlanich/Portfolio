import type { GraphDefinition, ScenePose } from '../../../lib/connected-studio/types';
import type { ConnectedLayout } from './connected-geometry';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { computeConnectedLayout } from './connected-geometry.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getTravelScale } from '../../../lib/connected-studio/model.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { CONNECTED_POSTER_CAPTURE } from '../../../lib/connected-studio/media-manifest.ts';

/** Reproduce the poster's CSS cover crop first, then ease to the normal responsive field. */
export function resolveConnectedProjection(graph: GraphDefinition, pose: ScenePose, native: ConnectedLayout): { layout: ConnectedLayout; pose: ScenePose } {
  const blend = typeof pose.posterBlend === 'number' && Number.isFinite(pose.posterBlend) ? Math.min(1, Math.max(0, pose.posterBlend)) : 0;
  if (blend === 0) return { layout: native, pose };
  const capture = CONNECTED_POSTER_CAPTURE[graph.quality];
  const tier = graph.quality; // Tablet shares the wide poster, including its depth and travel.
  const source = computeConnectedLayout({ ...capture, tier }, graph);
  const scale = Math.max(native.width / capture.width, native.height / capture.height);
  const mix = (normal: number, poster: number) => normal + (poster - normal) * blend;
  const width = mix(native.width, capture.width * scale);
  const height = mix(native.height, capture.height * scale);
  const layout: ConnectedLayout = {
    ...native,
    width, height, aspect: width / height,
    spreadX: mix(native.spreadX, source.spreadX), spreadY: mix(native.spreadY, source.spreadY),
    depthScale: mix(native.depthScale, source.depthScale), nodeScale: mix(native.nodeScale, source.nodeScale),
    pathRadius: mix(native.pathRadius, source.pathRadius), tracerRadius: mix(native.tracerRadius, source.tracerRadius),
    pointScale: mix(1, scale),
    crop: {
      x: (width - native.width) * CONNECTED_POSTER_CAPTURE.position.x,
      y: (height - native.height) * CONNECTED_POSTER_CAPTURE.position.y, width: native.width, height: native.height,
    },
  };
  const travel = mix(1, getTravelScale(tier) / getTravelScale(native.tier));
  if (travel === 1) return { layout, pose };
  const anchors = new Map(graph.nodes.map(node => [node.id, node.anchor]));
  return {
    layout,
    pose: {
      ...pose,
      nodes: pose.nodes.map(node => {
        const anchor = anchors.get(node.id);
        if (!anchor) return node;
        return {
          ...node,
          position: node.position.map((value, axis) => anchor[axis] + (value - anchor[axis]) * travel) as [number, number, number],
        };
      }),
    },
  };
}
