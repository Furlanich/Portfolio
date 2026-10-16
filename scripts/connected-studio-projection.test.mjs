import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SFC-V1 Task 4. The pure projection seam is pinned three ways: against the camera equations written out
// here, against the runtime's existing legacy layout/poster/label math (which it extracts unchanged), and by
// randomized round trips. No DOM and no Three object is needed for the seam itself.

const projection = await import('../lib/connected-studio/projection.ts');
const { getConnectedGraph } = await import('../lib/connected-studio/model.ts');
const { CONNECTED_POSTER_CAPTURE } = await import('../lib/connected-studio/media-manifest.ts');
const { computeConnectedLayout, RING_RADIUS } = await import('../components/connected-studio/runtime/connected-geometry.ts');
const { resolveConnectedProjection } = await import('../components/connected-studio/runtime/connected-projection.ts');
const { projectConnectedLabels } = await import('../components/connected-studio/runtime/connected-labels.ts');

const { computeProjectionLayout, anchorToScene, sceneToAnchor, projectAnchor, unprojectCss, resolvePosterProjection } = projection;

const TAN_HALF_FOV = Math.tan((17.5 * Math.PI) / 180);
const VIEWPORTS = [
  { width: 1440, height: 900, tier: 'wide' },
  { width: 1920, height: 1080, tier: 'wide' },
  { width: 900, height: 1180, tier: 'tablet' },
  { width: 820, height: 1000, tier: 'tablet' },
  { width: 390, height: 844, tier: 'compact' },
  { width: 320, height: 640, tier: 'compact' },
];

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const quality = (tier) => (tier === 'compact' ? 'compact' : 'wide');
const legacyProfile = (tier) => ({ nodeStyle: 'legacy', graph: getConnectedGraph(quality(tier)) });
const atlasProfile = (restAnchors = undefined) => ({
  nodeStyle: 'atlas',
  graph: { quality: 'wide', nodes: [], edges: [] },
  restAnchors,
});

function near(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? 'value'}: ${actual} vs ${expected} (tolerance ${tolerance})`);
}

function pxPerUnit(layout, zScene) {
  return layout.height / (2 * TAN_HALF_FOV * Math.max(1, 12 - zScene));
}

test('legacy layout is the runtime layout, extracted unchanged, for every tier and viewport', () => {
  for (const viewport of VIEWPORTS) {
    const graph = getConnectedGraph(quality(viewport.tier));
    const expected = computeConnectedLayout(viewport, graph);
    const actual = computeProjectionLayout({ nodeStyle: 'legacy', graph }, viewport);
    assert.deepEqual(actual, expected, `${viewport.tier} ${viewport.width}x${viewport.height}`);
  }
});

test('the device pixel ratio never enters the projection: DPR 1, 1.5 and 2 give identical layouts', () => {
  for (const viewport of VIEWPORTS) {
    for (const profile of [legacyProfile(viewport.tier), atlasProfile()]) {
      const base = computeProjectionLayout(profile, viewport);
      for (const pixelRatio of [1, 1.5, 2]) {
        assert.deepEqual(computeProjectionLayout(profile, { ...viewport, pixelRatio }), base);
      }
    }
  }
});

test('Atlas layouts use identity scaling and the specified fixed ring, path and tracer sizes', () => {
  const ringPx = { wide: 18, tablet: 16, compact: 14 };
  for (const viewport of VIEWPORTS) {
    const layout = computeProjectionLayout(atlasProfile(), viewport);
    assert.equal(layout.spreadX, 1);
    assert.equal(layout.spreadY, 1);
    assert.equal(layout.depthScale, 1);
    assert.equal(layout.width, viewport.width);
    assert.equal(layout.height, viewport.height);
    assert.equal(layout.crop, undefined);
    // At zScene 0 the ring diameter is the specified CSS size, independent of the viewport height.
    const diameterPx = 2 * RING_RADIUS * layout.nodeScale * pxPerUnit(layout, 0);
    near(diameterPx, ringPx[viewport.tier], 1e-9, `${viewport.tier} ring diameter`);
    near(layout.pathRadius * pxPerUnit(layout, 0), 0.5, 1e-9, 'a one-pixel edge weight');
    assert.ok(layout.tracerRadius > layout.pathRadius);
  }
});

test('anchor and scene space convert once, in both directions, with the legacy spread and depth factors', () => {
  const layout = computeProjectionLayout(legacyProfile('wide'), VIEWPORTS[0]);
  assert.notEqual(layout.spreadX, 1);
  const [sx, sy, sz] = anchorToScene([1, -2, 0.5], layout);
  near(sx, layout.spreadX, 1e-12);
  near(sy, -2 * layout.spreadY, 1e-12);
  near(sz, 0.5 * layout.depthScale, 1e-12);
  const [ax, ay, az] = sceneToAnchor([sx, sy, sz], layout);
  near(ax, 1, 1e-12);
  near(ay, -2, 1e-12);
  near(az, 0.5, 1e-12);
  const atlas = computeProjectionLayout(atlasProfile(), VIEWPORTS[0]);
  assert.deepEqual(anchorToScene([1, -2, 0.5], atlas), [1, -2, 0.5]);
  assert.deepEqual(sceneToAnchor([1, -2, 0.5], atlas), [1, -2, 0.5]);
});

test('projectAnchor is the 35 degree, z=12 perspective camera', () => {
  for (const viewport of VIEWPORTS) {
    const layout = computeProjectionLayout(atlasProfile(), viewport);
    const centre = projectAnchor([0, 0, 0], layout);
    near(centre.xPx, viewport.width / 2, 1e-9);
    near(centre.yPx, viewport.height / 2, 1e-9);
    assert.equal(centre.inView, true);
    const point = projectAnchor([1.5, -0.75, 0.6], layout);
    const scale = pxPerUnit(layout, 0.6);
    near(point.xPx, viewport.width / 2 + 1.5 * scale, 1e-9);
    near(point.yPx, viewport.height / 2 + 0.75 * scale, 1e-9);
  }
});

test('depth clamps at the near plane and a point behind the camera is not in view', () => {
  const layout = computeProjectionLayout(atlasProfile(), VIEWPORTS[0]);
  const behind = projectAnchor([1, 1, 13], layout);
  assert.equal(behind.inView, false);
  assert.ok(Number.isFinite(behind.xPx) && Number.isFinite(behind.yPx));
  const edge = projectAnchor([100, 0, 0], layout);
  assert.equal(edge.inView, false);
});

test('projectAnchor matches the runtime label projection for the legacy graph', () => {
  for (const viewport of VIEWPORTS) {
    const graph = getConnectedGraph(quality(viewport.tier));
    const runtimeLayout = computeConnectedLayout(viewport, graph);
    const layout = computeProjectionLayout({ nodeStyle: 'legacy', graph }, viewport);
    const pose = {
      progress: 0,
      idleAngleRadians: 0,
      scrollActivity: 0,
      nodes: graph.nodes.map((node) => ({ id: node.id, position: node.anchor, rotation: [0, 0, 0], scale: node.depthScale })),
      edges: [],
    };
    const labels = projectConnectedLabels(graph, pose, runtimeLayout);
    graph.nodes.forEach((node, index) => {
      const projected = projectAnchor(node.anchor, layout);
      const label = labels[index];
      near(projected.xPx, label.xPx, 1e-9, `${node.id} x`);
      const ringOffset = RING_RADIUS * layout.nodeScale * node.depthScale * pxPerUnit(layout, node.anchor[2] * layout.depthScale) + 6;
      near(projected.yPx + ringOffset, label.yPx, 1e-9, `${node.id} y`);
      assert.equal(projected.inView, label.inView);
    });
  }
});

test('the crop shifts the projected point and bounds the visible viewport', () => {
  const base = computeProjectionLayout(atlasProfile(), { width: 1000, height: 600, tier: 'wide' });
  const layout = { ...base, width: 1400, height: 840, aspect: 1400 / 840, crop: { x: 120, y: 60, width: 1000, height: 600 } };
  const point = projectAnchor([0, 0, 0], layout);
  near(point.xPx, 700 - 120, 1e-9);
  near(point.yPx, 420 - 60, 1e-9);
  assert.equal(point.inView, true);
  const outside = unprojectCss({ xPx: 1100, yPx: 300, zScene: 0 }, layout);
  assert.equal(projectAnchor(outside, layout).inView, false, 'beyond the visible crop width');
});

test('CSS to anchor round trips agree across tiers, depth, crop and legacy/Atlas styles (randomized, seeded)', () => {
  const random = mulberry32(0x5fc4);
  let checked = 0;
  for (const viewport of VIEWPORTS) {
    for (const profile of [legacyProfile(viewport.tier), atlasProfile()]) {
      const native = computeProjectionLayout(profile, viewport);
      const cover = Math.max(1, random() * 0.6 + 1);
      const wide = { ...native, width: viewport.width * cover, height: viewport.height * cover, aspect: viewport.width / viewport.height };
      const cropped = {
        ...wide,
        crop: { x: (wide.width - viewport.width) * 0.7, y: (wide.height - viewport.height) * 0.3, width: viewport.width, height: viewport.height },
      };
      for (const layout of [native, cropped]) {
        for (let run = 0; run < 40; run += 1) {
          const css = { xPx: random() * viewport.width, yPx: random() * viewport.height, zScene: random() * 2.4 - 1.4 };
          const anchor = unprojectCss(css, layout);
          const back = projectAnchor(anchor, layout);
          near(back.xPx, css.xPx, 1e-7, 'x round trip');
          near(back.yPx, css.yPx, 1e-7, 'y round trip');
          near(anchorToScene(anchor, layout)[2], css.zScene, 1e-12, 'depth is the requested scene depth');
          checked += 1;
        }
        for (let run = 0; run < 40; run += 1) {
          const anchor = [random() * 8 - 4, random() * 5 - 2.5, random() * 2.4 - 1.4];
          const css = projectAnchor(anchor, layout);
          const again = unprojectCss({ xPx: css.xPx, yPx: css.yPx, zScene: anchorToScene(anchor, layout)[2] }, layout);
          anchor.forEach((value, axis) => near(again[axis], value, 1e-7, `anchor axis ${axis}`));
          checked += 1;
        }
      }
    }
  }
  assert.equal(checked, VIEWPORTS.length * 2 * 2 * 80);
});

test('legacy poster projection is the runtime poster projection, unchanged, at every blend', () => {
  for (const viewport of VIEWPORTS) {
    const graph = getConnectedGraph(quality(viewport.tier));
    const nativeRuntime = computeConnectedLayout(viewport, graph);
    const native = computeProjectionLayout({ nodeStyle: 'legacy', graph }, viewport);
    const pose = {
      progress: 0.6,
      idleAngleRadians: 0.5,
      scrollActivity: 0,
      nodes: graph.nodes.map((node) => ({ id: node.id, position: [node.anchor[0] + 0.1, node.anchor[1] - 0.05, node.anchor[2]], rotation: [0, 0.5, 0], scale: node.depthScale })),
      edges: graph.edges.map((edge) => ({ id: edge.id, growth: 0.5 })),
    };
    for (const posterBlend of [0, 0.25, 0.5, 1]) {
      const expected = resolveConnectedProjection(graph, { ...pose, posterBlend }, nativeRuntime);
      const actual = resolvePosterProjection({ nodeStyle: 'legacy', graph }, { ...pose, posterBlend }, native);
      assert.deepEqual(actual.layout, expected.layout, `${viewport.tier} blend ${posterBlend} layout`);
      assert.deepEqual(actual.pose.nodes, expected.pose.nodes, `${viewport.tier} blend ${posterBlend} nodes`);
    }
    // No blend: the native frame and the very same pose come back.
    assert.equal(resolvePosterProjection({ nodeStyle: 'legacy', graph }, pose, native).layout, native);
  }
});

function atlasFixture(viewport) {
  const restAnchors = [
    { id: 'a', u: 0.25, v: 0.4, zScene: 0.3 },
    { id: 'b', u: 0.8, v: 0.7, zScene: -0.5 },
  ];
  const profile = atlasProfile(restAnchors);
  const native = computeProjectionLayout(profile, viewport);
  const nodes = restAnchors.map((rest) => {
    const position = unprojectCss({ xPx: rest.u * viewport.width, yPx: rest.v * viewport.height, zScene: rest.zScene }, native);
    return { id: rest.id, position, rotation: [0, 0, 0], scale: 1 };
  });
  const graph = {
    quality: viewport.tier === 'compact' ? 'compact' : 'wide',
    nodes: nodes.map((node) => ({ id: node.id, anchor: node.position, seed: 0, depthScale: 1 })),
    edges: [],
  };
  const pose = { progress: 0.6, idleAngleRadians: 0.5, scrollActivity: 0, nodes, edges: [] };
  return { profile: { ...profile, graph }, native, pose, restAnchors };
}

test('Atlas poster projection places each rest node at its normalized position in the cover-cropped poster frame', () => {
  for (const viewport of VIEWPORTS) {
    const { profile, native, pose, restAnchors } = atlasFixture(viewport);
    const capture = CONNECTED_POSTER_CAPTURE[quality(viewport.tier)];
    const scale = Math.max(viewport.width / capture.width, viewport.height / capture.height);
    for (const posterBlend of [0.25, 1]) {
      const { layout, pose: framed } = resolvePosterProjection(profile, { ...pose, posterBlend }, native);
      const mix = (normal, poster) => normal + (poster - normal) * posterBlend;
      const width = mix(viewport.width, capture.width * scale);
      const height = mix(viewport.height, capture.height * scale);
      near(layout.width, width, 1e-9);
      near(layout.height, height, 1e-9);
      near(layout.crop.x, (width - viewport.width) * CONNECTED_POSTER_CAPTURE.position.x, 1e-9);
      near(layout.crop.y, (height - viewport.height) * CONNECTED_POSTER_CAPTURE.position.y, 1e-9);
      assert.equal(layout.spreadX, 1);
      assert.equal(layout.depthScale, 1);
      for (const rest of restAnchors) {
        const projected = projectAnchor(framed.nodes.find((node) => node.id === rest.id).position, layout);
        near(projected.xPx, rest.u * width - layout.crop.x, 1e-7, `${rest.id} x at blend ${posterBlend}`);
        near(projected.yPx, rest.v * height - layout.crop.y, 1e-7, `${rest.id} y at blend ${posterBlend}`);
      }
    }
    const idle = resolvePosterProjection(profile, { ...pose, posterBlend: 0 }, native);
    assert.equal(idle.layout, native);
    assert.equal(idle.pose.nodes, pose.nodes);
  }
});

test('Atlas poster projection keeps a node displacement in CSS pixels while the frame changes', () => {
  const viewport = VIEWPORTS[0];
  const { profile, native, pose } = atlasFixture(viewport);
  const displaced = {
    ...pose,
    posterBlend: 0.5,
    nodes: pose.nodes.map((node) => {
      const css = projectAnchor(node.position, native);
      return { ...node, position: unprojectCss({ xPx: css.xPx + 9, yPx: css.yPx - 4, zScene: node.position[2] }, native) };
    }),
  };
  const rest = resolvePosterProjection(profile, { ...pose, posterBlend: 0.5 }, native);
  const moved = resolvePosterProjection(profile, displaced, native);
  for (const node of moved.pose.nodes) {
    const here = projectAnchor(node.position, moved.layout);
    const from = projectAnchor(rest.pose.nodes.find((candidate) => candidate.id === node.id).position, rest.layout);
    near(here.xPx - from.xPx, 9, 1e-7);
    near(here.yPx - from.yPx, -4, 1e-7);
  }
});
