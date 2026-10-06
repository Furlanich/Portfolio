import type { GraphDefinition, LabelProjection, ScenePose } from '../../../lib/connected-studio/types';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { CAMERA_FOV_DEGREES, CAMERA_NEAR, CAMERA_Z, RING_RADIUS } from './connected-geometry.ts';
import type { ConnectedLayout } from './connected-geometry';

const HALF_FOV_TAN = Math.tan((CAMERA_FOV_DEGREES * Math.PI) / 360);
/** CSS px between the bottom of a node's ring and the top of its label. */
const LABEL_GAP_PX = 6;

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * Projects every node to the CSS-pixel anchor of its upright label: `xPx` is the label's horizontal
 * centre and `yPx` its top edge, just under the node's ring. Labels never rotate, so the pose's
 * rotation and idle angle do not enter. The camera is fixed and on-axis, so the projection is plain
 * perspective and matches what the renderer draws. A host applies PC-2 (clamping, occlusion,
 * overlap) on top of these anchors; positions here are always finite.
 */
export function projectConnectedLabels(graph: GraphDefinition, pose: ScenePose, layout: ConnectedLayout): LabelProjection[] {
  const poseNodes = new Map(pose.nodes.map((node) => [node.id, node]));
  return graph.nodes.map((node, index) => {
    const posed = pose.nodes[index]?.id === node.id ? pose.nodes[index] : poseNodes.get(node.id);
    const source = posed?.position ?? node.anchor;
    const x = finiteOr(source[0], node.anchor[0]) * layout.spreadX;
    const y = finiteOr(source[1], node.anchor[1]) * layout.spreadY;
    const z = finiteOr(source[2], node.anchor[2]) * layout.depthScale;
    const depth = CAMERA_Z - z;
    const inFront = depth >= CAMERA_NEAR;
    const pxPerUnit = layout.height / 2 / (HALF_FOV_TAN * Math.max(CAMERA_NEAR, depth));
    const scale = finiteOr(posed?.scale, node.depthScale);
    const centreX = layout.width / 2 + x * pxPerUnit;
    const centreY = layout.height / 2 - y * pxPerUnit;
    return {
      id: node.id,
      capabilityIndex: node.capabilityIndex,
      xPx: centreX,
      yPx: centreY + RING_RADIUS * layout.nodeScale * scale * pxPerUnit + LABEL_GAP_PX,
      depthScale: node.depthScale,
      inView: inFront && centreX >= 0 && centreX <= layout.width && centreY >= 0 && centreY <= layout.height,
    };
  });
}
