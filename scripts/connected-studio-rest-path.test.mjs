import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SFC-V1 Task 4. The rest path is the analytic curve of one connection: the legacy quadratic bow that the
// runtime already draws (pinned here against the geometry it actually writes) and the straight Atlas edge.

const { evaluateRestEdge } = await import('../lib/connected-studio/rest-path.ts');
const { anchorToScene, computeProjectionLayout, resolvePosterProjection } = await import('../lib/connected-studio/projection.ts');
const { getConnectedGraph } = await import('../lib/connected-studio/model.ts');
const { createGraphBatch, computeConnectedLayout } = await import('../components/connected-studio/runtime/connected-geometry.ts');
const { resolveConnectedProjection } = await import('../components/connected-studio/runtime/connected-projection.ts');
const { createResourceTracker } = await import('../components/connected-studio/runtime/dispose-connected-scene.ts');

const SKELETON_SEGMENTS = 14;
const IDENTITY = Object.freeze({
  width: 1000, height: 600, tier: 'wide', aspect: 1000 / 600,
  spreadX: 1, spreadY: 1, depthScale: 1, nodeScale: 1, pathRadius: 0.01, tracerRadius: 0.02,
});

function near(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? 'value'}: ${actual} vs ${expected} (tolerance ${tolerance})`);
}

function nearVec(actual, expected, tolerance, message) {
  expected.forEach((value, axis) => near(actual[axis], value, tolerance, `${message ?? 'vec'} axis ${axis}`));
}

const bowSign = (edgeIndex) => (((((edgeIndex + 1) * 2654435761) >>> 0) % 2) === 0 ? 1 : -1);

test('legacy rest samples are the runtime skeleton curve across tiers, poster blends and crop', () => {
  for (const [width, height, tier] of [[1440, 900, 'wide'], [900, 1180, 'tablet'], [390, 844, 'compact']]) {
    const graph = getConnectedGraph(tier === 'compact' ? 'compact' : 'wide');
    const viewport = { width, height, tier };
    const runtimeNative = computeConnectedLayout(viewport, graph);
    const native = computeProjectionLayout({ nodeStyle: 'legacy', graph }, viewport);
    for (const posterBlend of [0, 0.5, 1]) {
      const basePose = {
        posterBlend,
        progress: 0.6,
        idleAngleRadians: 0.5,
        scrollActivity: 0,
        nodes: graph.nodes.map((node, index) => ({
          id: node.id,
          position: [node.anchor[0] + 0.07 * Math.sin(index), node.anchor[1] - 0.05 * Math.cos(index), node.anchor[2] + 0.03 * index * 0.1],
          rotation: [0, 0, 0],
          scale: node.depthScale,
        })),
        edges: graph.edges.map((edge) => ({ id: edge.id, growth: 1 })),
      };
      // The geometry the runtime really writes for this pose.
      const runtime = resolveConnectedProjection(graph, basePose, runtimeNative);
      const tracker = createResourceTracker();
      const batch = createGraphBatch(graph, tracker);
      batch.update(runtime.pose, runtime.layout);
      const skeleton = batch.drawables.find((drawable) => drawable.userData.connectedRole === 'skeleton');
      const written = skeleton.geometry.getAttribute('position').array;
      // The pure seam resolves the same frame and pose.
      const pure = resolvePosterProjection({ nodeStyle: 'legacy', graph }, basePose, native);
      const byId = new Map(pure.pose.nodes.map((node) => [node.id, node.position]));
      graph.edges.forEach((edge, edgeIndex) => {
        for (let step = 0; step < SKELETON_SEGMENTS; step += 1) {
          const at = (edgeIndex * SKELETON_SEGMENTS + step) * 2 * 3;
          for (const [offset, s] of [[0, step / SKELETON_SEGMENTS], [3, (step + 1) / SKELETON_SEGMENTS]]) {
            const rest = evaluateRestEdge(
              { nodeStyle: 'legacy', edgeIndex, from: byId.get(edge.from), to: byId.get(edge.to), layout: pure.layout },
              s,
            );
            const scene = anchorToScene(rest, pure.layout);
            // The runtime stores float32.
            nearVec([written[at + offset], written[at + offset + 1], written[at + offset + 2]], scene, 2e-5, `${tier} blend ${posterBlend} ${edge.id} s=${s}`);
          }
        }
      });
      tracker.release();
    }
  }
});

test('legacy bow: the deterministic edge sign, 0.16 control offset and 0.35 depth share are pinned', () => {
  const from = [-1.2, 0.4, 0.1];
  const to = [1.6, -0.9, -0.5];
  const chord = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
  const length = Math.hypot(...chord);
  const perpendicular = [-chord[1], chord[0], 0];
  const perpendicularLength = Math.hypot(...perpendicular);
  for (let edgeIndex = 0; edgeIndex < 12; edgeIndex += 1) {
    const sign = bowSign(edgeIndex);
    const control = [
      (from[0] + to[0]) / 2 + (perpendicular[0] / perpendicularLength) * 0.16 * length * sign,
      (from[1] + to[1]) / 2 + (perpendicular[1] / perpendicularLength) * 0.16 * length * sign,
      (from[2] + to[2]) / 2 + 0.16 * length * 0.35 * sign,
    ];
    const middle = evaluateRestEdge({ nodeStyle: 'legacy', edgeIndex, from, to, layout: IDENTITY }, 0.5);
    nearVec(middle, control.map((value, axis) => 0.25 * from[axis] + 0.5 * value + 0.25 * to[axis]), 1e-12, `edge ${edgeIndex} midpoint`);
    nearVec(evaluateRestEdge({ nodeStyle: 'legacy', edgeIndex, from, to, layout: IDENTITY }, 0.25), control.map((value, axis) => 0.5625 * from[axis] + 0.375 * value + 0.0625 * to[axis]), 1e-12, `edge ${edgeIndex} quarter`);
  }
  assert.notEqual(bowSign(0), bowSign(1), 'consecutive edges alternate for these indices, so the sign is not constant');
});

test('endpoints are exact at s = 0 and s = 1 for both styles and any layout', () => {
  const layout = computeProjectionLayout({ nodeStyle: 'legacy', graph: getConnectedGraph('wide') }, { width: 1440, height: 900, tier: 'wide' });
  const from = [1.1, -0.4, 0.3];
  const to = [-2.2, 0.9, -0.6];
  for (const [nodeStyle, used] of [['legacy', layout], ['atlas', IDENTITY]]) {
    for (const edgeIndex of [0, 3, 7]) {
      const input = { nodeStyle, edgeIndex, from, to, layout: used };
      nearVec(evaluateRestEdge(input, 0), from, 1e-12, `${nodeStyle} start`);
      nearVec(evaluateRestEdge(input, 1), to, 1e-12, `${nodeStyle} end`);
    }
  }
});

test('Atlas rest edges are straight: linear interpolation of the endpoints', () => {
  const from = [-3, 1, 0.4];
  const to = [2, -1.5, -0.2];
  for (const s of [0, 1 / 6, 0.25, 0.5, 5 / 6, 1]) {
    nearVec(
      evaluateRestEdge({ nodeStyle: 'atlas', edgeIndex: 5, from, to, layout: IDENTITY }, s),
      from.map((value, axis) => value + (to[axis] - value) * s),
      1e-12,
      `s=${s}`,
    );
  }
});

test('s outside 0..1 is clamped to the endpoints', () => {
  const input = { nodeStyle: 'atlas', edgeIndex: 0, from: [0, 0, 0], to: [1, 1, 0], layout: IDENTITY };
  nearVec(evaluateRestEdge(input, -2), [0, 0, 0], 1e-12);
  nearVec(evaluateRestEdge(input, 3), [1, 1, 0], 1e-12);
  nearVec(evaluateRestEdge({ ...input, nodeStyle: 'legacy' }, -2), [0, 0, 0], 1e-12);
  nearVec(evaluateRestEdge({ ...input, nodeStyle: 'legacy' }, 3), [1, 1, 0], 1e-12);
});

test('coincident endpoints and a pure depth chord stay finite and follow the documented fallback normal', () => {
  const point = [0.5, -0.5, 0.2];
  for (const nodeStyle of ['legacy', 'atlas']) {
    for (const s of [0, 0.3, 1]) {
      const rest = evaluateRestEdge({ nodeStyle, edgeIndex: 2, from: point, to: point, layout: IDENTITY }, s);
      nearVec(rest, point, 1e-12, `${nodeStyle} coincident s=${s}`);
    }
  }
  // Perpendicular (-dy, dx, 0) vanishes for a chord along z, so the fallback normal is (0, 1, 0).
  const from = [0, 0, 0];
  const to = [0, 0, 2];
  const sign = bowSign(4);
  const middle = evaluateRestEdge({ nodeStyle: 'legacy', edgeIndex: 4, from, to, layout: IDENTITY }, 0.5);
  nearVec(
    middle,
    // z: 0.25 * 0 + 0.5 * (1 + 0.16 * 2 * 0.35 * sign) + 0.25 * 2.
    [0, 0.5 * 0.16 * 2 * sign, 1 + 0.5 * 0.16 * 2 * 0.35 * sign],
    1e-12,
    'depth chord midpoint',
  );
});
