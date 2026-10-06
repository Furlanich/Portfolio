import test from 'node:test';
import assert from 'node:assert/strict';

const {
  getConnectedGraph,
  getQualityForTier,
  getTierForWidth,
  getTravelScale,
  isConnectedQuality,
  isConnectedTier,
  isFooterDominant,
  measureConnectedProgress,
  sampleConnectedPose,
} = await import('../lib/connected-studio/model.ts');

// A hand-built graph keeps the pose contract independent of the seeded production graphs.
const GRAPH = Object.freeze({
  quality: 'wide',
  nodes: Object.freeze([
    Object.freeze({ id: 'a', capabilityIndex: 0, anchor: [-1, 0.5, 0], seed: 0.25, depthScale: 1 }),
    Object.freeze({ id: 'b', capabilityIndex: 1, anchor: [1, -0.5, -0.4], seed: 0.75, depthScale: 0.8 }),
  ]),
  edges: Object.freeze([Object.freeze({ id: 'a-b', from: 'a', to: 'b', revealStart: 0, revealEnd: 1 })]),
});

function sample(previous, overrides = {}) {
  return sampleConnectedPose(previous, {
    graph: GRAPH,
    tier: 'wide',
    progress: 0,
    velocityPxPerSecond: 0,
    deltaSeconds: 0,
    ...overrides,
  });
}

test('1px of scroll moves progress before any chapter', () => {
  const progress = measureConnectedProgress(1, 5000, 900);
  assert.ok(progress > 0, `expected progress > 0 after 1px, got ${progress}`);
  assert.ok(progress < 0.001, `1px must be a tiny share of the document, got ${progress}`);
});

test('progress stays finite and clamped for zero-height, short and invalid layouts', () => {
  const cases = [
    [0, 0, 0],
    [0, 0, 900],
    [500, 0, 0],
    [500, 300, 900],
    [Number.NaN, 5000, 900],
    [100, Number.NaN, 900],
    [100, 5000, Number.NaN],
    [Number.POSITIVE_INFINITY, 5000, 900],
    [-50, 5000, 900],
    [100, Number.NEGATIVE_INFINITY, 900],
    [100, 5000, -900],
  ];
  for (const [scrollY, footerTop, viewportHeight] of cases) {
    const progress = measureConnectedProgress(scrollY, footerTop, viewportHeight);
    assert.ok(
      Number.isFinite(progress) && progress >= 0 && progress <= 1,
      `(${scrollY}, ${footerTop}, ${viewportHeight}) must give finite progress in 0..1, got ${progress}`,
    );
  }
  assert.equal(measureConnectedProgress(0, 0, 0), 0, 'a zero-height layout at the top has no progress');
});

test('small progress changes ease with about 70ms damping and a first sample never replays from zero', () => {
  const first = sample(undefined, { progress: 0.4 });
  assert.equal(first.progress, 0.4, 'the first sample (restore, resize, back-forward) lands on the current geometry');

  const start = sample(undefined, { progress: 0.1 });
  const next = sample(start, { progress: 0.2, deltaSeconds: 0.07 });
  const covered = (next.progress - 0.1) / 0.1;
  assert.ok(covered > 0.55 && covered < 0.7, `one 70ms time constant should cover about 63% of the gap, got ${covered}`);
  assert.ok(next.progress < 0.2, 'damping must not reach the target in one step');
});

test('a progress jump snaps to the current geometry instead of replaying earlier chapters', () => {
  const start = sample(undefined, { progress: 0.1 });
  const jumped = sample(start, { progress: 0.9, deltaSeconds: 1 / 60, velocityPxPerSecond: 40000 });
  assert.equal(jumped.progress, 0.9, 'an anchor jump or restored scroll must land on the target pose');
  assert.equal(jumped.edges[0].growth, 0.9, 'connection growth must match the landed progress');
  assert.equal(jumped.scrollActivity, 0, 'a jump is not scroll activity');

  const reverse = sample(jumped, { progress: 0.05, deltaSeconds: 1 / 60 });
  assert.equal(reverse.progress, 0.05, 'a reverse jump snaps too');
});

const TOPOLOGY = { wide: { nodes: 16, edges: 33 }, compact: { nodes: 8, edges: 13 } };

function componentCount(graph) {
  const parent = new Map(graph.nodes.map((node) => [node.id, node.id]));
  const find = (id) => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root);
    return root;
  };
  for (const edge of graph.edges) parent.set(find(edge.from), find(edge.to));
  return new Set(graph.nodes.map((node) => find(node.id))).size;
}

test('graph counts, connectivity and endpoints: 16 nodes/33 connections wide, 8/13 compact', () => {
  for (const quality of ['wide', 'compact']) {
    const graph = getConnectedGraph(quality);
    assert.equal(graph.quality, quality);
    assert.equal(graph.nodes.length, TOPOLOGY[quality].nodes, `${quality} node count`);
    assert.equal(graph.edges.length, TOPOLOGY[quality].edges, `${quality} connection count`);
    assert.equal(componentCount(graph), 1, `${quality} graph must be one connected network`);

    const pairs = new Set();
    for (const edge of graph.edges) {
      assert.notEqual(edge.from, edge.to, `${edge.id} must not loop`);
      const key = [edge.from, edge.to].sort().join('|');
      assert.ok(!pairs.has(key), `${edge.id} duplicates another connection`);
      pairs.add(key);
    }
    const complete = (graph.nodes.length * (graph.nodes.length - 1)) / 2;
    assert.ok(graph.edges.length < complete / 2, 'density stays well short of all-to-all wiring');
  }
});

test('node and edge ids are unique, stable strings and every endpoint names an existing node', () => {
  for (const quality of ['wide', 'compact']) {
    const graph = getConnectedGraph(quality);
    assert.ok(graph.nodes.length > 0, `${quality} graph must have nodes`);
    const nodeIds = graph.nodes.map((node) => node.id);
    assert.equal(new Set(nodeIds).size, nodeIds.length, 'node ids are unique');
    const edgeIds = graph.edges.map((edge) => edge.id);
    assert.equal(new Set(edgeIds).size, edgeIds.length, 'edge ids are unique');
    for (const id of [...nodeIds, ...edgeIds]) assert.ok(typeof id === 'string' && /^[a-z0-9-]+$/.test(id), `id ${id} must be a stable slug`);
    const known = new Set(nodeIds);
    for (const edge of graph.edges) {
      assert.ok(known.has(edge.from) && known.has(edge.to), `${edge.id} endpoints must exist`);
    }
    for (const node of graph.nodes) {
      assert.ok(node.anchor.length === 3 && node.anchor.every(Number.isFinite), `${node.id} anchor must be finite`);
      assert.ok(node.seed >= 0 && node.seed < 1, `${node.id} seed must be in 0..1`);
      assert.ok(node.depthScale > 0 && node.depthScale <= 1, `${node.id} depthScale must be in (0, 1]`);
    }
    assert.notEqual(nodeIds[0].slice(0, 1), '', 'ids are non-empty');
  }
  assert.equal(
    getConnectedGraph('wide').nodes.some((node) => getConnectedGraph('compact').nodes.some((other) => other.id === node.id)),
    false,
    'wide and compact graphs keep distinct node ids',
  );
});

test('each capability word is assigned to two wide nodes and one compact node', () => {
  for (const [quality, perWord] of [['wide', 2], ['compact', 1]]) {
    const graph = getConnectedGraph(quality);
    assert.equal(graph.nodes.length, 8 * perWord, `${quality} node count`);
    for (let index = 0; index < 8; index += 1) {
      const holders = graph.nodes.filter((node) => node.capabilityIndex === index);
      assert.equal(holders.length, perWord, `${quality} capability ${index} holder count`);
      if (perWord === 2) {
        const [first, second] = holders;
        const adjacent = graph.edges.some(
          (edge) => (edge.from === first.id && edge.to === second.id) || (edge.from === second.id && edge.to === first.id),
        );
        assert.equal(adjacent, false, `the two ${index} nodes must not be directly connected`);
      }
    }
  }
});

test('reveal windows start at the first scroll, stay normalized and complete every connection at the Footer handoff', () => {
  for (const quality of ['wide', 'compact']) {
    const graph = getConnectedGraph(quality);
    assert.ok(graph.edges.length > 0, `${quality} graph must have connections`);
    assert.equal(Math.min(...graph.edges.map((edge) => edge.revealStart)), 0, 'growth starts with the first scroll');
    for (const edge of graph.edges) {
      assert.ok(edge.revealStart >= 0 && edge.revealEnd <= 1 && edge.revealEnd > edge.revealStart, `${edge.id} window is normalized`);
    }
    const start = sampleConnectedPose(undefined, { graph, tier: 'wide', progress: 0, velocityPxPerSecond: 0, deltaSeconds: 0 });
    assert.ok(start.edges.every((edge) => edge.growth === 0), 'no connection is grown at rest at the top');
    const first = sampleConnectedPose(undefined, { graph, tier: 'wide', progress: 0.0005, velocityPxPerSecond: 0, deltaSeconds: 0 });
    assert.ok(first.edges.some((edge) => edge.growth > 0), 'the first pixels of scroll start growing a connection');
    const end = sampleConnectedPose(undefined, { graph, tier: 'wide', progress: 1, velocityPxPerSecond: 0, deltaSeconds: 0 });
    assert.ok(end.edges.every((edge) => edge.growth === 1), `all ${graph.edges.length} connections reach growth 1 at progress 1`);
  }
});

test('connected graphs are immutable and referentially stable', () => {
  for (const quality of ['wide', 'compact']) {
    const graph = getConnectedGraph(quality);
    assert.equal(getConnectedGraph(quality), graph, 'the same frozen graph is returned every time');
    assert.ok(Object.isFrozen(graph) && Object.isFrozen(graph.nodes) && Object.isFrozen(graph.edges));
    assert.ok(graph.nodes.length > 0 && graph.nodes.every((node) => Object.isFrozen(node) && Object.isFrozen(node.anchor)));
    assert.ok(graph.edges.length > 0 && graph.edges.every((edge) => Object.isFrozen(edge)));
  }
});

/** Steps the pose at 30fps for `seconds`, the way the controller does between renders. */
function run(previous, overrides, seconds) {
  let pose = previous;
  const steps = Math.round(seconds * 30);
  for (let step = 0; step < steps; step += 1) pose = sample(pose, { ...overrides, deltaSeconds: 1 / 30 });
  return pose;
}

function assertClose(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: expected ${expected} +/- ${tolerance}, got ${actual}`);
}

test('scroll activity rises with the 70ms damping, decays over about 240ms and stays bounded', () => {
  const rest = sample(undefined, { progress: 0.2 });
  assert.equal(rest.scrollActivity, 0, 'activity starts at rest');

  const rising = sample(rest, { progress: 0.2, velocityPxPerSecond: 1500, deltaSeconds: 0.07 });
  assert.ok(rising.scrollActivity > 0.45 && rising.scrollActivity < 0.8, `activity rises quickly, got ${rising.scrollActivity}`);

  const reverse = sample(rest, { progress: 0.2, velocityPxPerSecond: -1500, deltaSeconds: 0.07 });
  assertClose(reverse.scrollActivity, rising.scrollActivity, 1e-9, 'reverse scroll is just as active');

  const decayed = sample(rising, { progress: 0.2, velocityPxPerSecond: 0, deltaSeconds: 0.24 });
  assertClose(decayed.scrollActivity, rising.scrollActivity * Math.exp(-1), 1e-9, 'one 240ms constant decays to 1/e');

  const flooded = run(rest, { progress: 0.2, velocityPxPerSecond: 1e9 }, 5);
  assert.ok(flooded.scrollActivity <= 1 && flooded.scrollActivity > 0.99, `activity never exceeds 1, got ${flooded.scrollActivity}`);

  for (const velocity of [Number.NaN, Number.POSITIVE_INFINITY]) {
    const invalid = sample(rest, { progress: 0.2, velocityPxPerSecond: velocity, deltaSeconds: 0.07 });
    assert.ok(Number.isFinite(invalid.scrollActivity) && invalid.scrollActivity >= 0 && invalid.scrollActivity <= 1, `velocity ${velocity} stays finite`);
  }
});

test('scroll activity speeds node rotation and returns to the gentle rate', () => {
  const rest = sample(undefined, { progress: 0.2 });
  const calm = run(rest, { progress: 0.2 }, 1);
  const calmStep = calm.idleAngleRadians - rest.idleAngleRadians;
  assertClose(calmStep, (1.2 * Math.PI) / 180, 1e-9, 'resting rotation is about 1.2 degrees per second');

  const busyBase = run(rest, { progress: 0.2, velocityPxPerSecond: 1e6 }, 2);
  const busy = run(busyBase, { progress: 0.2, velocityPxPerSecond: 1e6 }, 1);
  const busyStep = busy.idleAngleRadians - busyBase.idleAngleRadians;
  assert.ok(busyStep > calmStep * 2, `active scroll accelerates rotation (${busyStep} vs ${calmStep})`);

  const settled = run(busy, { progress: 0.2, velocityPxPerSecond: 0 }, 3);
  const resumed = run(settled, { progress: 0.2, velocityPxPerSecond: 0 }, 1);
  assertClose(resumed.idleAngleRadians - settled.idleAngleRadians, calmStep, calmStep * 0.01, 'rotation returns to the gentle rate');
});

test('elapsed time is clamped so a long gap never integrates unseen rotation or activity', () => {
  const rest = sample(undefined, { progress: 0.2 });
  const gap = sample(rest, { progress: 0.2, deltaSeconds: 60 });
  assert.ok(
    gap.idleAngleRadians - rest.idleAngleRadians <= 0.25 * ((1.2 * Math.PI) / 180) + 1e-12,
    `a 60s gap may integrate at most 250ms of rotation, got ${gap.idleAngleRadians - rest.idleAngleRadians} rad`,
  );
  const negative = sample(rest, { progress: 0.2, deltaSeconds: -5 });
  assert.equal(negative.idleAngleRadians, rest.idleAngleRadians, 'negative elapsed time never rewinds rotation');
  const invalid = sample(rest, { progress: 0.2, deltaSeconds: Number.NaN });
  assert.ok(Number.isFinite(invalid.idleAngleRadians) && Number.isFinite(invalid.progress), 'NaN elapsed time stays finite');
});

test('the Footer hides the scene at 18% of the viewport, always after every connection completed', () => {
  assert.equal(isFooterDominant(4100, 5000, 900), false, 'a Footer far below does not dominate');
  assert.equal(isFooterDominant(4838, 5000, 900), true, 'the Footer top exactly at 18% of the viewport dominates');
  assert.equal(isFooterDominant(4837, 5000, 900), false, 'one pixel earlier it does not');
  assert.equal(isFooterDominant(Number.NaN, 5000, 900), false, 'an unmeasurable layout never hides the scene');

  const layouts = [
    [5000, 900], // tall document
    [1200, 900], // short document
    [600, 900], // Footer inside the first viewport
    [400, 900],
    [20000, 400], // long document, short viewport (landscape phone)
    [2400, 320],
  ];
  for (const [footerTop, viewportHeight] of layouts) {
    for (let scrollY = 1; scrollY <= footerTop + viewportHeight; scrollY += 7) {
      if (isFooterDominant(scrollY, footerTop, viewportHeight)) {
        assert.equal(
          measureConnectedProgress(scrollY, footerTop, viewportHeight),
          1,
          `completion must precede hiding at scrollY ${scrollY} (Footer ${footerTop}, viewport ${viewportHeight})`,
        );
      }
    }
  }
});

test('tiers map at 767/768 and 1023/1024 CSS px and quality follows the tier', () => {
  for (const [width, tier] of [
    [0, 'compact'],
    [320, 'compact'],
    [767, 'compact'],
    [767.9, 'compact'],
    [768, 'tablet'],
    [1023, 'tablet'],
    [1023.9, 'tablet'],
    [1024, 'wide'],
    [1440, 'wide'],
    [3840, 'wide'],
  ]) {
    assert.equal(getTierForWidth(width), tier, `${width}px`);
  }
  for (const width of [Number.NaN, -1, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    assert.equal(getTierForWidth(width), 'compact', `an unusable width ${width} falls back to the lightest tier`);
  }
  assert.equal(getQualityForTier('wide'), 'wide');
  assert.equal(getQualityForTier('tablet'), 'wide', 'tablet uses the wide graph');
  assert.equal(getQualityForTier('compact'), 'compact');
});

function maxTravel(tier, overrides) {
  const graph = getConnectedGraph('wide');
  let furthest = 0;
  let pose;
  for (let progress = 0; progress <= 1.0001; progress += 0.02) {
    pose = sampleConnectedPose(pose, { graph, tier, progress, velocityPxPerSecond: 1500, deltaSeconds: 1 / 30, ...overrides });
    pose.nodes.forEach((node, index) => {
      const anchor = graph.nodes[index].anchor;
      furthest = Math.max(furthest, Math.hypot(node.position[0] - anchor[0], node.position[1] - anchor[1], node.position[2] - anchor[2]));
    });
  }
  return furthest;
}

test('travel scale is finite in (0, 1], 1 on wide and smaller on tablet and compact', () => {
  for (const tier of ['wide', 'tablet', 'compact']) {
    const scale = getTravelScale(tier);
    assert.ok(Number.isFinite(scale) && scale > 0 && scale <= 1, `${tier} travel scale must be in (0, 1], got ${scale}`);
  }
  assert.equal(getTravelScale('wide'), 1);
  assert.ok(getTravelScale('tablet') < 1, 'tablet travel is restrained');
  assert.ok(getTravelScale('compact') < getTravelScale('tablet'), 'compact travel is smaller than tablet');
});

test('nodes travel locally from the first scroll, stay bounded by the tier scale and rest on their anchors at the top', () => {
  const graph = getConnectedGraph('wide');
  const top = sampleConnectedPose(undefined, { graph, tier: 'wide', progress: 0, velocityPxPerSecond: 0, deltaSeconds: 0 });
  top.nodes.forEach((node, index) => assert.deepEqual(node.position, graph.nodes[index].anchor, `${node.id} rests on its anchor at the top`));

  const firstScroll = run(top, { graph, tier: 'wide', progress: 0.0005, velocityPxPerSecond: 1500 }, 0.2);
  const moved = firstScroll.nodes.filter((node, index) => node.position.some((value, axis) => value !== graph.nodes[index].anchor[axis]));
  assert.ok(moved.length >= graph.nodes.length / 2, `the first scroll must move the field locally, moved ${moved.length}`);

  const wide = maxTravel('wide');
  const tablet = maxTravel('tablet');
  const compact = maxTravel('compact');
  assert.ok(wide > 0.2 && wide <= 0.6 + 1e-9, `wide travel is visible but bounded, got ${wide}`);
  assert.ok(tablet < wide && compact < tablet, `travel shrinks by tier (${wide} > ${tablet} > ${compact})`);
  assert.ok(tablet <= wide * getTravelScale('tablet') + 1e-9 && compact <= wide * getTravelScale('compact') + 1e-9, 'travel is bounded by the scale');

  const down = sample(undefined, { graph, progress: 0.5 });
  const up = sample(sample(undefined, { graph, progress: 0.9 }), { graph, progress: 0.5, deltaSeconds: 1 });
  assert.deepEqual(
    up.nodes.map((node) => node.position),
    down.nodes.map((node) => node.position),
    'a pose depends on progress, not on the direction travelled',
  );
});

test('an unknown quality or tier fails closed instead of guessing', () => {
  for (const quality of ['huge', '', undefined, null, 'toString', '__proto__']) {
    assert.throws(() => getConnectedGraph(quality), RangeError, `quality ${String(quality)}`);
  }
  for (const tier of ['phablet', '', undefined, null, 'constructor', '__proto__']) {
    assert.throws(() => getQualityForTier(tier), RangeError, `getQualityForTier(${String(tier)})`);
    assert.throws(() => getTravelScale(tier), RangeError, `getTravelScale(${String(tier)})`);
    assert.throws(() => sample(undefined, { tier }), RangeError, `sampleConnectedPose(${String(tier)})`);
  }
  assert.equal(isConnectedTier('tablet'), true);
  assert.equal(isConnectedTier('phablet'), false);
  assert.equal(isConnectedTier(undefined), false);
  assert.equal(isConnectedQuality('compact'), true);
  assert.equal(isConnectedQuality('tablet'), false, 'tablet is a tier, not a graph quality');
});
