import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SFC-V1 Task 4. Profile data is asserted against the tables in DESIGN-SFC-V1 ("Page-specific graph
// specification"), restated here independently of the implementation: exact topology, projected rest positions,
// depth law, input policy and the preserved legacy profiles.

const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
const { computeProjectionLayout, projectAnchor, anchorToScene } = await import('../lib/connected-studio/projection.ts');
const { getConnectedGraph } = await import('../lib/connected-studio/model.ts');
const { CONNECTED_POSTER_POSE } = await import('../lib/connected-studio/media-manifest.ts');

const SPEC_ANCHORS = {
  studio: [[.06,.18],[.29,.11],[.54,.17],[.79,.13],[.94,.25],[.12,.43],[.58,.40],[.66,.38],[.86,.46],[.06,.70],[.27,.62],[.51,.69],[.73,.65],[.94,.73],[.39,.86],[.83,.85]],
  founder: [[.06,.18],[.30,.12],[.55,.18],[.79,.15],[.94,.26],[.12,.43],[.51,.35],[.79,.38],[.94,.47],[.06,.70],[.49,.63],[.79,.61],[.94,.70],[.27,.84],[.56,.85],[.79,.84]],
  contact: [[.06,.20],[.28,.12],[.51,.18],[.80,.18],[.94,.26],[.12,.40],[.39,.36],[.83,.40],[.94,.47],[.06,.70],[.27,.63],[.53,.68],[.85,.63],[.94,.74],[.39,.85],[.82,.85]],
};
const SPEC_EDGES = {
  studio: '0–1,1–6,2–6,3–4,3–6,5–6,6–7,6–8,6–10,6–11,6–12,9–10,10–14,11–14,12–13,12–15,14–15,1–2,7–8,11–12',
  founder: '3–7,7–11,11–15,0–1,1–2,2–3,3–4,5–6,6–7,7–8,9–10,10–11,11–12,13–14,14–15,1–6,6–10,10–14',
  contact: '0–3,1–3,2–3,3–4,3–7,5–7,6–7,7–8,7–12,9–12,10–12,11–12,12–13,12–15,14–15',
};
const COMPACT_ANCHORS = [[.09,.16],[.59,.12],[.91,.30],[.24,.39],[.76,.54],[.08,.66],[.39,.86],[.89,.82]];
const COMPACT_EDGES = '0–1,1–2,1–3,2–4,3–4,3–5,4–6,4–7,5–6,6–7';
const parseEdges = (text) => text.split(',').map((pair) => pair.split('–').map(Number));
const DEPTH = { wide: 1, tablet: 0.7, compact: 0.45 };
const VIEWPORTS = [
  { width: 1440, height: 900, tier: 'wide' },
  { width: 1024, height: 768, tier: 'wide' },
  { width: 900, height: 1180, tier: 'tablet' },
  { width: 390, height: 844, tier: 'compact' },
];

function near(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? 'value'}: ${actual} vs ${expected} (tolerance ${tolerance})`);
}

function deepFrozen(value) {
  if (typeof value !== 'object' || value === null) return true;
  return Object.isFrozen(value) && Object.values(value).every(deepFrozen);
}

test('Studio, Founder and Contact have the exact node and edge topology, per tier', () => {
  for (const route of ['studio', 'founder', 'contact']) {
    for (const viewport of VIEWPORTS) {
      const profile = getConnectedProfile(route, viewport.tier, viewport);
      const compact = viewport.tier === 'compact';
      const expectedEdges = parseEdges(compact ? COMPACT_EDGES : SPEC_EDGES[route]);
      const nodeCount = compact ? 8 : 16;
      assert.deepEqual(profile.graph.nodes.map((node) => node.id), Array.from({ length: nodeCount }, (_, index) => `n${index}`));
      assert.equal(profile.graph.quality, compact ? 'compact' : 'wide');
      assert.equal(profile.graph.edges.length, expectedEdges.length);
      assert.deepEqual(
        profile.graph.edges.map((edge) => [edge.from, edge.to]),
        expectedEdges.map(([from, to]) => [`n${from}`, `n${to}`]),
      );
      assert.deepEqual(profile.graph.edges.map((edge) => edge.id), expectedEdges.map(([from, to]) => `n${from}-n${to}`));
      assert.equal(new Set(profile.graph.edges.map((edge) => edge.id)).size, expectedEdges.length, 'edge ids are unique');
    }
  }
  assert.deepEqual(['studio', 'founder', 'contact'].map((route) => getConnectedProfile(route, 'wide', VIEWPORTS[0]).graph.edges.length), [20, 18, 15]);
  assert.deepEqual(['studio', 'founder', 'contact'].map((route) => getConnectedProfile(route, 'compact', VIEWPORTS[3]).graph.edges.length), [10, 10, 10]);
});

test('every node rests at its specified normalized position after inverse projection, in any viewport', () => {
  for (const route of ['studio', 'founder', 'contact']) {
    for (const viewport of VIEWPORTS) {
      const profile = getConnectedProfile(route, viewport.tier, viewport);
      const anchors = viewport.tier === 'compact' ? COMPACT_ANCHORS : SPEC_ANCHORS[route];
      const layout = computeProjectionLayout(profile, viewport);
      profile.graph.nodes.forEach((node, index) => {
        const projected = projectAnchor(node.anchor, layout);
        near(projected.xPx, anchors[index][0] * viewport.width, 1e-6, `${route} ${viewport.tier} n${index} x`);
        near(projected.yPx, anchors[index][1] * viewport.height, 1e-6, `${route} ${viewport.tier} n${index} y`);
        assert.equal(projected.inView, true);
      });
      assert.deepEqual(
        profile.restAnchors.map((rest) => [rest.id, rest.u, rest.v]),
        anchors.map(([u, v], index) => [`n${index}`, u, v]),
      );
    }
  }
});

test('depth follows z_i = 0.85 sin(1.7 i), multiplied once by 1 / 0.7 / 0.45 for wide / tablet / compact', () => {
  for (const route of ['studio', 'founder', 'contact']) {
    for (const viewport of VIEWPORTS) {
      const profile = getConnectedProfile(route, viewport.tier, viewport);
      profile.restAnchors.forEach((rest, index) => {
        near(rest.zScene, 0.85 * Math.sin(1.7 * index) * DEPTH[viewport.tier], 1e-12, `${route} ${viewport.tier} n${index}`);
        // Identity scaling on Atlas: the anchor depth is the scene depth, applied once.
        near(profile.graph.nodes[index].anchor[2], rest.zScene, 1e-12);
      });
    }
  }
});

test('Atlas layouts carry identity spread and depth, and the camera is not moved by the profile', () => {
  for (const viewport of VIEWPORTS) {
    const profile = getConnectedProfile('studio', viewport.tier, viewport);
    const layout = computeProjectionLayout(profile, viewport);
    assert.deepEqual([layout.spreadX, layout.spreadY, layout.depthScale], [1, 1, 1]);
    assert.deepEqual(anchorToScene(profile.graph.nodes[3].anchor, layout), profile.graph.nodes[3].anchor);
  }
});

test('Atlas edges are fixed and fully grown at every progress; nodes are uniform flat dots', () => {
  const profile = getConnectedProfile('studio', 'wide', VIEWPORTS[0]);
  for (const edge of profile.graph.edges) {
    assert.equal(edge.revealStart, 0);
    assert.equal(edge.revealEnd, 0, 'a zero reveal span grows fully at progress 0');
  }
  for (const node of profile.graph.nodes) {
    assert.equal(node.depthScale, 1);
    assert.equal(node.capabilityIndex, undefined, 'the new routes never fabricate the eight services');
    assert.ok(Number.isFinite(node.seed) && node.seed >= 0 && node.seed < 1);
  }
  assert.equal(new Set(profile.graph.nodes.map((node) => node.seed)).size, 16, 'seeds differ so nodes are not clones');
});

test('profile style, ambient policy and poster pose', () => {
  for (const route of ['studio', 'founder', 'contact']) {
    const profile = getConnectedProfile(route, 'wide', VIEWPORTS[0]);
    assert.equal(profile.route, route);
    assert.equal(profile.nodeStyle, 'atlas');
    assert.equal(profile.ambient, 'sleep');
    assert.deepEqual(profile.posterPose, CONNECTED_POSTER_POSE);
  }
  for (const route of ['services', 'projects']) {
    const profile = getConnectedProfile(route, 'wide', VIEWPORTS[0]);
    assert.equal(profile.nodeStyle, 'legacy');
    assert.equal(profile.ambient, 'legacy');
    assert.equal(profile.restAnchors, undefined);
    assert.deepEqual(profile.posterPose, CONNECTED_POSTER_POSE);
  }
});

test('decorative words bind to nodes n0, n4, n8, n12 (Studio, Founder) and n0, n4, n8 (Contact); compact keeps two', () => {
  for (const route of ['studio', 'founder']) {
    assert.deepEqual(getConnectedProfile(route, 'wide', VIEWPORTS[0]).wordNodeIds, ['n0', 'n4', 'n8', 'n12']);
    assert.deepEqual(getConnectedProfile(route, 'tablet', VIEWPORTS[2]).wordNodeIds, ['n0', 'n4', 'n8', 'n12']);
    assert.deepEqual(getConnectedProfile(route, 'compact', VIEWPORTS[3]).wordNodeIds, ['n0', 'n4']);
  }
  assert.deepEqual(getConnectedProfile('contact', 'wide', VIEWPORTS[0]).wordNodeIds, ['n0', 'n4', 'n8']);
  assert.deepEqual(getConnectedProfile('contact', 'compact', VIEWPORTS[3]).wordNodeIds, ['n0', 'n4']);
  for (const route of ['services', 'projects']) {
    assert.deepEqual(getConnectedProfile(route, 'wide', VIEWPORTS[0]).wordNodeIds, [], 'legacy routes keep their capability words');
  }
});

test('input policy: 280px radius, 34/24/14 node travel, 16/10/6 string caps (4 on Contact), scroll strength 1/1/0.38', () => {
  const nodeCap = { wide: 34, tablet: 24, compact: 14 };
  const edgeCap = { wide: 16, tablet: 10, compact: 6 };
  for (const route of ['studio', 'founder', 'contact', 'services', 'projects']) {
    for (const viewport of VIEWPORTS) {
      const { input } = getConnectedProfile(route, viewport.tier, viewport);
      assert.equal(input.radiusPx, 280);
      assert.equal(input.nodeTravelCapPx, nodeCap[viewport.tier]);
      assert.equal(input.edgeCapPx, route === 'contact' ? 4 : edgeCap[viewport.tier]);
      assert.equal(input.scrollStrength, viewport.tier === 'compact' ? 0.38 : 1);
      assert.equal(input.bendEdges, true);
      assert.equal(input.yieldNodes, route !== 'contact', 'Contact nodes never move');
    }
  }
});

test('Services and Projects keep their existing 16/33 and 8/13 graphs by identity', () => {
  for (const route of ['services', 'projects']) {
    for (const viewport of VIEWPORTS) {
      const profile = getConnectedProfile(route, viewport.tier, viewport);
      const graph = getConnectedGraph(viewport.tier === 'compact' ? 'compact' : 'wide');
      assert.equal(profile.graph, graph);
      assert.deepEqual([profile.graph.nodes.length, profile.graph.edges.length], viewport.tier === 'compact' ? [8, 13] : [16, 33]);
      assert.equal(profile.quality, graph.quality);
    }
  }
});

test('profiles are deeply immutable and a legacy profile is shared, not rebuilt', () => {
  for (const route of ['studio', 'contact', 'services']) {
    assert.equal(deepFrozen(getConnectedProfile(route, 'wide', VIEWPORTS[0])), true, route);
  }
  assert.equal(getConnectedProfile('services', 'wide', VIEWPORTS[0]), getConnectedProfile('services', 'wide', VIEWPORTS[1]));
});

test('an unknown route or tier and an unusable viewport fail closed', () => {
  assert.throws(() => getConnectedProfile('home', 'wide', VIEWPORTS[0]), RangeError);
  assert.throws(() => getConnectedProfile('studio', 'huge', VIEWPORTS[0]), RangeError);
  for (const bad of [{ width: 0, height: 800 }, { width: 800, height: -1 }, { width: Number.NaN, height: 800 }, { width: 800, height: Number.POSITIVE_INFINITY }]) {
    assert.throws(() => getConnectedProfile('studio', 'wide', bad), RangeError);
  }
});
