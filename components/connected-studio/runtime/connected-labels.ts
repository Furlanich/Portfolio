// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { RING_RADIUS, projectAnchor } from '../../../lib/connected-studio/projection.ts';
import type { GraphDefinition, LabelProjection, ScenePose, Vec3 } from '../../../lib/connected-studio/types';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { createPoseLookup } from './connected-geometry.ts';
import type { ConnectedLayout } from './connected-geometry';

/** CSS px between the bottom of a node's ring and the top of its label. */
const LABEL_GAP_PX = 6;

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * Projects every node to the CSS-pixel anchor of its upright label: `xPx` is the label's horizontal
 * centre and `yPx` its top edge, just under the node's ring. Labels never rotate, so the pose's
 * rotation and idle angle do not enter. Every conversion is the pure projection seam's: the node's centre and the
 * bottom of its ring are both projected by it, so the anchor matches what the renderer draws and no second camera
 * model exists. A host applies PC-2 (clamping, occlusion, overlap) on top of these anchors; positions here are
 * always finite.
 */
export function projectConnectedLabels(graph: GraphDefinition, pose: ScenePose, layout: ConnectedLayout): LabelProjection[] {
  const lookup = createPoseLookup(pose);
  return graph.nodes.map((node, index) => {
    const posed = lookup.node(index, node.id);
    const source = posed?.position ?? node.anchor;
    const position: Vec3 = [finiteOr(source[0], node.anchor[0]), finiteOr(source[1], node.anchor[1]), finiteOr(source[2], node.anchor[2])];
    const scale = finiteOr(posed?.scale, node.depthScale);
    const centre = projectAnchor(position, layout);
    // The ring's bottom, a ring radius below the centre in scene units; the spread converts it back to anchor space.
    const ringDrop = (RING_RADIUS * layout.nodeScale * scale) / (layout.spreadY > 0 ? layout.spreadY : 1);
    const bottom = projectAnchor([position[0], position[1] - ringDrop, position[2]], layout);
    return {
      id: node.id,
      capabilityIndex: node.capabilityIndex,
      xPx: centre.xPx,
      yPx: bottom.yPx + LABEL_GAP_PX,
      depthScale: node.depthScale,
      inView: centre.inView,
    };
  });
}
