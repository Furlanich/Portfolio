import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SFC-V1 Task 4. The interaction model is a deterministic function of its inputs: elapsed time, CSS pointer
// samples and ordinary scroll distance. These tests restate the DESIGN-SFC-V1 equations independently of the
// implementation (influence radius, nearest five, squared falloff, caps, spring, momentum, string pins and caps) and
// drive it with synthetic clocks. No DOM, no Three, no browser.

const { createConnectedInteraction } = await import('../lib/connected-studio/interaction.ts');
const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
const { computeProjectionLayout, projectAnchor, unprojectCss } = await import('../lib/connected-studio/projection.ts');
const { evaluateRestEdge } = await import('../lib/connected-studio/rest-path.ts');

const VIEWS = {
  wide: { width: 1440, height: 900, tier: 'wide' },
  tablet: { width: 900, height: 1180, tier: 'tablet' },
  compact: { width: 390, height: 844, tier: 'compact' },
};
const STEP_MS = 1000 / 60;

function near(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? 'value'}: ${actual} vs ${expected} (tolerance ${tolerance})`);
}

function restPose(graph) {
  return {
    progress: 0.6,
    idleAngleRadians: 0,
    scrollActivity: 0,
    nodes: graph.nodes.map((node) => ({ id: node.id, position: node.anchor, rotation: [0, 0, 0], scale: 1 })),
    edges: graph.edges.map((edge) => ({ id: edge.id, growth: 1 })),
  };
}

function finish(profile, viewport) {
  const layout = computeProjectionLayout(profile, viewport);
  const base = restPose(profile.graph);
  const restCss = profile.graph.nodes.map((node) => {
    const css = projectAnchor(node.anchor, layout);
    return { x: css.xPx, y: css.yPx };
  });
  return { profile, viewport, layout, base, restCss, interaction: createConnectedInteraction(profile), now: 0 };
}

function setup(route, tier) {
  const viewport = VIEWS[tier];
  return finish(getConnectedProfile(route, tier, viewport), viewport);
}

const INPUT = { yieldNodes: true, bendEdges: true, radiusPx: 280, nodeTravelCapPx: 34, edgeCapPx: 16, scrollStrength: 1 };

/** A hand-built Atlas profile whose nodes sit at exact CSS positions in a 1000x700 viewport. */
function custom(nodes, pairs = [], input = {}) {
  const viewport = { width: 1000, height: 700, tier: 'wide' };
  const shell = { nodeStyle: 'atlas', graph: { quality: 'wide', nodes: [], edges: [] } };
  const layout = computeProjectionLayout(shell, viewport);
  const graph = {
    quality: 'wide',
    nodes: nodes.map(([id, x, y]) => ({ id, anchor: unprojectCss({ xPx: x, yPx: y, zScene: 0 }, layout), seed: 0, depthScale: 1 })),
    edges: pairs.map(([from, to]) => ({ id: `${from}-${to}`, from, to, revealStart: 0, revealEnd: 0 })),
  };
  return finish({ nodeStyle: 'atlas', ambient: 'sleep', graph, input: { ...INPUT, ...input } }, viewport);
}

function pointerAt(x, y, extra = {}) {
  return { x, y, vx: 0, vy: 0, ageSeconds: 0, ...extra };
}

function step(s, { dtMs = STEP_MS, pointer = null, scroll = 0, base = s.base, layout = s.layout } = {}) {
  s.now += dtMs;
  return s.interaction.step({ nowMs: s.now, deltaMs: dtMs, base, layout, pointer, scrollDeltaPx: scroll });
}

function run(s, frames, inputAt) {
  let pose;
  for (let frame = 0; frame < frames; frame += 1) pose = step(s, inputAt(frame, frame * STEP_MS));
  return pose;
}

function offsets(s, pose) {
  return pose.nodes.map((node, index) => {
    const css = projectAnchor(node.position, s.layout);
    return { id: node.id, dx: css.xPx - s.restCss[index].x, dy: css.yPx - s.restCss[index].y };
  });
}

const magnitude = ({ dx, dy }) => Math.hypot(dx, dy);

/** Residual of every interior string sample from the rest path of the displaced endpoints, in CSS px. */
function stringResiduals(s, pose) {
  const byId = new Map(pose.nodes.map((node) => [node.id, node.position]));
  const out = [];
  for (const sample of pose.edgeSamples ?? []) {
    const edgeIndex = s.profile.graph.edges.findIndex((edge) => edge.id === sample.id);
    const edge = s.profile.graph.edges[edgeIndex];
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    sample.points.forEach((point, j) => {
      const rest = evaluateRestEdge({ nodeStyle: s.profile.nodeStyle, edgeIndex, from, to, layout: s.layout }, j / 6);
      const a = projectAnchor(point, s.layout);
      const b = projectAnchor(rest, s.layout);
      out.push({ id: sample.id, j, x: a.xPx - b.xPx, y: a.yPx - b.yPx, size: Math.hypot(a.xPx - b.xPx, a.yPx - b.yPx) });
    });
  }
  return out;
}

function allFinite(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(allFinite);
  if (value && typeof value === 'object') return Object.values(value).every(allFinite);
  return true;
}

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

/** The steady offsets the specification prescribes for a pointer held at one place (restated, not imported). */
function expectedSteady(s, pointer, age = 0) {
  const { radiusPx, nodeTravelCapPx: cap } = s.profile.input;
  const pressure = 0.16 + 0.84 * Math.exp(-age / 0.28);
  const items = s.profile.graph.nodes.map((node, index) => {
    const dx = s.restCss[index].x - pointer.x;
    const dy = s.restCss[index].y - pointer.y;
    return { id: node.id, dx, dy, d: Math.hypot(dx, dy) };
  });
  const nearest = [...items].sort((a, b) => a.d - b.d || (a.id < b.id ? -1 : 1)).slice(0, 5);
  const direct = new Map();
  for (const item of nearest) {
    const weight = Math.max(0, 1 - item.d / radiusPx) ** 2;
    if (weight <= 0) continue;
    const k = (0.85 * cap * weight * pressure) / Math.max(1, item.d);
    direct.set(item.id, [item.dx * k, item.dy * k]);
  }
  const share = new Map();
  for (const edge of s.profile.graph.edges) {
    for (const [from, to] of [[edge.from, edge.to], [edge.to, edge.from]]) {
      const target = direct.get(from);
      if (!target) continue;
      const current = share.get(to) ?? [0, 0];
      share.set(to, [current[0] + 0.1 * target[0], current[1] + 0.1 * target[1]]);
    }
  }
  return items.map((item) => {
    const own = direct.get(item.id) ?? [0, 0];
    const extra = share.get(item.id) ?? [0, 0];
    let x = own[0] + extra[0];
    let y = own[1] + extra[1];
    const size = Math.hypot(x, y);
    if (size > cap) {
      x = (x * cap) / size;
      y = (y * cap) / size;
    }
    return [x, y];
  });
}

test('at rest nothing moves: the pose is the base pose in the resolved frame and the field is settled', () => {
  const s = setup('studio', 'wide');
  assert.equal(s.interaction.isSettled(), true);
  const pose = step(s);
  assert.deepEqual(pose.nodes, s.base.nodes);
  assert.equal(pose.projectionLayout, s.layout, 'the final pose carries the frame it was resolved in');
  assert.equal(s.interaction.isSettled(), true);
  assert.deepEqual(stringResiduals(s, pose).filter((entry) => entry.size > 0), []);
});

test('a held pointer settles on exactly the specified yield: radius, nearest five, squared falloff, 0.85 x cap, neighbor share', () => {
  const cases = [
    ['studio', 'wide', pointerAt(760, 340)],
    ['studio', 'wide', pointerAt(300, 650)],
    ['founder', 'tablet', pointerAt(480, 560)],
    ['studio', 'compact', pointerAt(150, 330)],
    ['founder', 'wide', pointerAt(1130, 420)],
  ];
  for (const [route, tier, pointer] of cases) {
    const s = setup(route, tier);
    const pose = run(s, 6 * 60, () => ({ pointer }));
    const expected = expectedSteady(s, pointer);
    assert.ok(expected.some(([x, y]) => Math.hypot(x, y) > 1), `${route} ${tier}: the case actually moves something`);
    offsets(s, pose).forEach((offset, index) => {
      near(offset.dx, expected[index][0], 0.05, `${route} ${tier} ${offset.id} dx`);
      near(offset.dy, expected[index][1], 0.05, `${route} ${tier} ${offset.id} dy`);
    });
  }
});

test('a held pointer relaxes to the 0.16 resting share of the pressure after it stops moving', () => {
  const s = setup('studio', 'wide');
  const pointer = pointerAt(760, 340);
  const age = 5;
  const pose = run(s, 8 * 60, () => ({ pointer: { ...pointer, ageSeconds: age } }));
  const expected = expectedSteady(s, pointer, age);
  const full = expectedSteady(s, pointer, 0);
  offsets(s, pose).forEach((offset, index) => {
    near(offset.dx, expected[index][0], 0.05);
    near(offset.dy, expected[index][1], 0.05);
  });
  const strongest = Math.max(...full.map(([x, y]) => Math.hypot(x, y)));
  const resting = Math.max(...expected.map(([x, y]) => Math.hypot(x, y)));
  near(resting / strongest, 0.16 + 0.84 * Math.exp(-age / 0.28), 0.02, 'the resting pressure ratio');
});

test('influence reaches 280px and no further', () => {
  const far = custom([['a', 500, 350]]);
  const pose = run(far, 120, () => ({ pointer: pointerAt(500 + 281, 350) }));
  assert.equal(magnitude(offsets(far, pose)[0]), 0);
  assert.equal(far.interaction.isSettled(), true, 'out of range is a settled field');
  const inside = custom([['a', 500, 350]]);
  const moved = run(inside, 6 * 60, () => ({ pointer: pointerAt(500 - 200, 350) }));
  near(offsets(inside, moved)[0].dx, 0.85 * 34 * (1 - 200 / 280) ** 2, 0.05, 'squared falloff at 200px');
  const edge = custom([['a', 500, 350]]);
  const faint = run(edge, 6 * 60, () => ({ pointer: pointerAt(500 - 270, 350) }));
  assert.ok(offsets(edge, faint)[0].dx > 0.01, 'a node at 270px still yields a little');
});

test('only the five nearest nodes respond directly; equal distances break the tie by id', () => {
  // Seven nodes at exactly 100px from the pointer; no connections, so nothing is shared.
  // Ids run against index order (g first), so only the id decides which two of the seven tie-losers are left out.
  const ring = [['g', 600, 350], ['f', 400, 350], ['e', 500, 450], ['d', 500, 250], ['c', 560, 430], ['b', 440, 430], ['a', 560, 270]];
  const s = custom(ring);
  const pose = run(s, 6 * 60, () => ({ pointer: pointerAt(500, 350) }));
  const moved = Object.fromEntries(offsets(s, pose).map((offset) => [offset.id, magnitude(offset) > 1]));
  assert.deepEqual(moved, { g: false, f: false, e: true, d: true, c: true, b: true, a: true });
  near(magnitude(offsets(s, pose)[2]), 0.85 * 34 * (1 - 100 / 280) ** 2, 0.05);
});

test('the neighbor share is one non-recursive 0.10 of the original target', () => {
  const s = custom([['a', 300, 350], ['b', 500, 350], ['c', 700, 350], ['d', 900, 350]], [['a', 'b'], ['b', 'c'], ['c', 'd']]);
  const pointer = pointerAt(200, 350);
  const pose = run(s, 6 * 60, () => ({ pointer }));
  const [a, b, c, d] = offsets(s, pose);
  const target = 0.85 * 34 * (1 - 100 / 280) ** 2;
  near(a.dx, target + 0, 0.05, 'direct');
  near(b.dx, 0.1 * target, 0.05, 'one hop');
  assert.ok(Math.abs(c.dx) < 1e-6 && Math.abs(c.dy) < 1e-6, 'two hops get nothing');
  assert.ok(Math.abs(d.dx) < 1e-6);
});

test('node travel never exceeds 34 / 24 / 14 CSS px, and a hard sweep gets close to it', () => {
  for (const tier of ['wide', 'tablet', 'compact']) {
    const s = setup('studio', tier);
    const cap = s.profile.input.nodeTravelCapPx;
    const { width, height } = s.viewport;
    let peak = 0;
    for (let frame = 0; frame < 8 * 60; frame += 1) {
      const t = (frame * STEP_MS) / 1000;
      const pose = step(s, {
        pointer: pointerAt(width / 2 + width * 0.45 * Math.sin(t * 5), height / 2 + height * 0.35 * Math.sin(t * 3.1), {
          vx: width * 0.45 * 5 * Math.cos(t * 5),
          vy: height * 0.35 * 3.1 * Math.cos(t * 3.1),
        }),
      });
      for (const offset of offsets(s, pose)) peak = Math.max(peak, magnitude(offset));
    }
    assert.ok(peak <= cap + 1e-6, `${tier}: peak ${peak} within the ${cap}px cap`);
    assert.ok(peak > cap * 0.6, `${tier}: the sweep really exercises the cap (${peak})`);
  }
});

test('displaced nodes stay inside the visible viewport', () => {
  const s = custom([['a', 6, 350], ['b', 994, 20]]);
  const pose = run(s, 4 * 60, () => ({ pointer: pointerAt(60, 350, { vx: -1400, vy: 0 }) }));
  for (const node of pose.nodes) {
    const css = projectAnchor(node.position, s.layout);
    assert.ok(css.xPx >= -1e-6 && css.xPx <= 1000 + 1e-6 && css.yPx >= -1e-6 && css.yPx <= 700 + 1e-6, `${node.id} inside the viewport`);
  }
});

test('Contact node offsets are exactly zero while its strings bend within 4px', () => {
  const s = setup('contact', 'wide');
  const { width, height } = s.viewport;
  let stringPeak = 0;
  for (let frame = 0; frame < 6 * 60; frame += 1) {
    const t = (frame * STEP_MS) / 1000;
    const pose = step(s, {
      pointer: pointerAt(width * (0.55 + 0.4 * Math.sin(t * 2)), height * (0.5 + 0.3 * Math.sin(t * 3)), { vx: 900 * Math.cos(t * 2), vy: 700 * Math.cos(t * 3) }),
      scroll: 60,
    });
    assert.deepEqual(pose.nodes, s.base.nodes, 'node positions never change on Contact');
    for (const entry of stringResiduals(s, pose)) stringPeak = Math.max(stringPeak, entry.size);
  }
  assert.ok(stringPeak <= 4 + 1e-6, `string peak ${stringPeak} within 4px`);
  assert.ok(stringPeak > 0.2, `Contact strings respond (${stringPeak})`);
});

test('strings are seven pinned samples with caps 16 / 10 / 6 CSS px', () => {
  for (const tier of ['wide', 'tablet', 'compact']) {
    const s = setup('studio', tier);
    const cap = s.profile.input.edgeCapPx;
    const { width, height } = s.viewport;
    let peak = 0;
    for (let frame = 0; frame < 6 * 60; frame += 1) {
      const t = (frame * STEP_MS) / 1000;
      const pose = step(s, {
        pointer: pointerAt(width * (0.5 + 0.4 * Math.sin(t * 4)), height * (0.5 + 0.3 * Math.sin(t * 2.3)), { vx: 1000 * Math.cos(t * 4), vy: 600 * Math.cos(t * 2.3) }),
      });
      assert.equal(pose.edgeSamples.length, s.profile.graph.edges.length, 'every edge has a string while the field is awake');
      const byId = new Map(pose.nodes.map((node) => [node.id, node.position]));
      for (const sample of pose.edgeSamples) {
        assert.equal(sample.points.length, 7);
        const edge = s.profile.graph.edges.find((candidate) => candidate.id === sample.id);
        assert.deepEqual(sample.points[0], byId.get(edge.from), 'pinned to the from node exactly');
        assert.deepEqual(sample.points[6], byId.get(edge.to), 'pinned to the to node exactly');
      }
      for (const entry of stringResiduals(s, pose)) {
        peak = Math.max(peak, entry.size);
        if (entry.j === 0 || entry.j === 6) assert.equal(entry.size < 1e-9, true, 'pinned residual is zero');
      }
    }
    assert.ok(peak <= cap + 1e-6, `${tier}: string peak ${peak} within ${cap}px`);
    assert.ok(peak > 0, `${tier}: strings respond to the sweep`);
  }
});

test('a pointer held beside a short connection bends it a visible share of every cap (16 / 10 / 6 / 4px)', () => {
  for (const cap of [16, 10, 6, 4]) {
    const s = custom([['a', 430, 350], ['b', 570, 350]], [['a', 'b']], { yieldNodes: false, edgeCapPx: cap });
    const pose = run(s, 3 * 60, () => ({ pointer: pointerAt(500, 340) }));
    const peak = Math.max(...stringResiduals(s, pose).map((entry) => entry.size));
    assert.ok(peak >= cap * 0.4, `cap ${cap}: peak ${peak} reaches a visible share`);
    assert.ok(peak <= cap + 1e-6, `cap ${cap}: peak ${peak} stays within the cap`);
  }
});

test('a hard push on a very short connection bends it strongly and never past its cap', () => {
  for (const cap of [16, 10, 6, 4]) {
    const s = custom([['a', 490, 350], ['b', 510, 350]], [['a', 'b']], { yieldNodes: false, edgeCapPx: cap });
    let peak = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      // 12px beside a 20px connection every sample is driven to the cap.
      const pose = step(s, { pointer: pointerAt(500, 338) });
      for (const entry of stringResiduals(s, pose)) peak = Math.max(peak, entry.size);
    }
    assert.ok(peak <= cap + 1e-9, `cap ${cap}: peak ${peak} never exceeds the cap`);
    // Tension and damping hold the settled peak near 0.8 of the drive; the integration clamp is a defensive bound on the contract.
    assert.ok(peak >= cap * 0.6, `cap ${cap}: peak ${peak} is a strong bend`);
  }
});

test('a pointer near the middle of a connection bends that string without moving its nodes', () => {
  const s = custom([['a', 200, 350], ['b', 800, 350]], [['a', 'b']]);
  const pointer = pointerAt(500, 330);
  const pose = run(s, 3 * 60, () => ({ pointer }));
  assert.equal(magnitude(offsets(s, pose)[0]), 0);
  assert.equal(magnitude(offsets(s, pose)[1]), 0);
  const residuals = stringResiduals(s, pose);
  const sizes = residuals.map((entry) => entry.size);
  assert.ok(sizes[3] > 2, `the middle sample bends (${sizes[3]})`);
  assert.ok(sizes[3] > sizes[2] && sizes[3] > sizes[4], 'the bend peaks under the pointer');
  assert.ok(sizes[2] > sizes[1] && sizes[1] > 1e-3, 'neighbor tension carries a wave outward');
  // The string yields away from the pointer (the pointer is above the line, so the string moves down).
  assert.ok(residuals[3].y > 0 && Math.abs(residuals[3].x) < 1e-6);
  assert.deepEqual([sizes[0] < 1e-9, sizes[6] < 1e-9], [true, true]);
});

test('an endpoint moving across a string drags a small lag on it: -0.06 x transverse velocity x sin(pi s)', () => {
  // The pointer sits below-left of node a and outside the string's 150px reach, so only a's motion acts on it.
  const s = custom([['a', 200, 350], ['b', 800, 350]], [['a', 'b']]);
  let lag = 0;
  for (let frame = 0; frame < 30; frame += 1) {
    const pose = step(s, { pointer: pointerAt(160, 420) });
    const sample = stringResiduals(s, pose).find((entry) => entry.j === 1);
    lag = Math.max(lag, Math.abs(sample.y));
    if (frame > 3) assert.ok(sample.y >= -1e-9, 'a moves up (y falls), so the string lags downward');
  }
  assert.ok(lag > 0.02, `endpoint lag is visible (${lag})`);
});

test('a moving pointer leaves momentum: the node keeps going after the pointer stops tracking it', () => {
  const peakAfterExit = (velocity) => {
    const s = custom([['a', 500, 350]]);
    let pose;
    let x = 100;
    for (let frame = 0; frame < 24; frame += 1) {
      x += 800 / 60;
      pose = step(s, { pointer: pointerAt(x, 350, { vx: velocity, vy: 0 }) });
    }
    const atExit = offsets(s, pose)[0].dx;
    let peak = atExit;
    for (let frame = 0; frame < 120; frame += 1) {
      pose = step(s, { pointer: null });
      peak = Math.max(peak, offsets(s, pose)[0].dx);
    }
    return { atExit, peak };
  };
  const withMomentum = peakAfterExit(800);
  const withoutMomentum = peakAfterExit(0);
  assert.ok(withMomentum.peak > withMomentum.atExit + 0.05, 'keeps moving after the pointer exits');
  assert.ok(withMomentum.peak > withoutMomentum.peak + 1, `momentum carries further (${withMomentum.peak} vs ${withoutMomentum.peak})`);
});

test('a pointer that stops moving but stays keeps the momentum it already gave, without adding more', () => {
  const s = custom([['a', 500, 350]]);
  let x = 100;
  let pose;
  for (let frame = 0; frame < 24; frame += 1) {
    x += 800 / 60;
    pose = step(s, { pointer: pointerAt(x, 350, { vx: 800, vy: 0 }) });
  }
  const atStop = offsets(s, pose)[0].dx;
  let peak = atStop;
  for (let frame = 0; frame < 30; frame += 1) {
    pose = step(s, { pointer: pointerAt(x, 350, { vx: 0, vy: 0, ageSeconds: (frame * STEP_MS) / 1000 }) });
    peak = Math.max(peak, offsets(s, pose)[0].dx);
  }
  assert.ok(peak > atStop + 0.05, `the node coasts on after the pointer stops (${atStop} -> ${peak})`);
  const held = custom([['a', 500, 350]]);
  let hx = 100;
  for (let frame = 0; frame < 24; frame += 1) {
    hx += 800 / 60;
    step(held, { pointer: pointerAt(hx, 350, { vx: 0, vy: 0 }) });
  }
  let heldPeak = offsets(held, step(held, { pointer: pointerAt(hx, 350) }))[0].dx;
  for (let frame = 0; frame < 30; frame += 1) heldPeak = Math.max(heldPeak, offsets(held, step(held, { pointer: pointerAt(hx, 350, { ageSeconds: (frame * STEP_MS) / 1000 }) }))[0].dx);
  assert.ok(peak > heldPeak + 0.5, 'and it coasts further than the same path with no reported velocity');
});

test('pointer exit damps motion down instead of snapping it, and the field comes to rest', () => {
  const s = custom([['a', 500, 350]]);
  const held = pointerAt(380, 350);
  const before = offsets(s, run(s, 4 * 60, () => ({ pointer: held })))[0].dx;
  assert.ok(before > 5);
  const next = offsets(s, step(s, { pointer: null }))[0].dx;
  assert.ok(next > before * 0.9, `one frame after exit it has barely moved (${next} of ${before})`);
  const later = offsets(s, run(s, 6, () => ({ pointer: null })))[0].dx;
  assert.ok(later > 0.4 * before, `a tenth of a second later it is still displaced (${later})`);
  const pose = run(s, 12 * 60, () => ({ pointer: null }));
  assert.deepEqual(pose.nodes, s.base.nodes, 'resting exactly on the rest pose');
  assert.equal(s.interaction.isSettled(), true);
});

test('a stationary pointer applies no repeated impulse, whatever stale velocity the host still reports', () => {
  const trace = (extra) => {
    const s = custom([['a', 500, 350]]);
    const samples = [];
    for (let frame = 0; frame < 180; frame += 1) {
      const pose = step(s, { pointer: pointerAt(400, 350, { ageSeconds: frame * STEP_MS / 1000 + 0.2, ...extra }) });
      samples.push(offsets(s, pose)[0].dx);
    }
    return samples;
  };
  const quiet = trace({ vx: 0, vy: 0 });
  const stale = trace({ vx: 1400, vy: 0 });
  stale.forEach((value, index) => near(value, quiet[index], 1e-9, `frame ${index}`));
  // A host that keeps reporting a fresh age and velocity over a pointer that has not moved is not a gesture either.
  const s = custom([['a', 500, 350]]);
  const liar = [];
  for (let frame = 0; frame < 180; frame += 1) {
    liar.push(offsets(s, step(s, { pointer: pointerAt(400, 350, { vx: 1400, vy: 0, ageSeconds: 0 }) }))[0].dx);
  }
  const reference = custom([['a', 500, 350]]);
  const still = [];
  for (let frame = 0; frame < 180; frame += 1) {
    still.push(offsets(reference, step(reference, { pointer: pointerAt(400, 350, { vx: 0, vy: 0, ageSeconds: 0 }) }))[0].dx);
  }
  liar.forEach((value, index) => near(value, still[index], 1e-9, `fresh-but-still frame ${index}`));
});

test('the first sample after entry, or after a gap with no pointer, invents no prior velocity', () => {
  const entry = (velocity) => {
    const s = custom([['a', 500, 350]]);
    return offsets(s, step(s, { pointer: pointerAt(400, 350, { vx: velocity, vy: 0 }) }));
  };
  assert.deepEqual(entry(1400), entry(0));
  const reenter = (velocity) => {
    const s = custom([['a', 500, 350]]);
    run(s, 30, () => ({ pointer: pointerAt(420, 350) }));
    run(s, 30, () => ({ pointer: null }));
    return offsets(s, step(s, { pointer: pointerAt(300, 350, { vx: velocity, vy: 0 }) }));
  };
  assert.deepEqual(reenter(1400), reenter(0));
  // The very next moving sample does apply momentum.
  const second = (velocity) => {
    const s = custom([['a', 500, 350]]);
    step(s, { pointer: pointerAt(300, 350, { vx: velocity }) });
    return offsets(s, step(s, { pointer: pointerAt(313, 350, { vx: velocity }) }))[0].dx;
  };
  assert.ok(second(1400) > second(0));
});

test('pointer velocity is clamped to 1400 px/s per axis and non-finite samples are ignored', () => {
  // The pointer really travels at 3000 px/s, faster than the clamp, so the clamp (not the path) bounds the impulse.
  const trace = (vx, vy) => {
    const s = custom([['a', 500, 350]]);
    let x = -100;
    let pose;
    for (let frame = 0; frame < 24; frame += 1) {
      x += 3000 / 60;
      pose = step(s, { pointer: pointerAt(x, 330, { vx, vy }) });
    }
    return offsets(s, pose)[0];
  };
  assert.deepEqual(trace(5000, 0), trace(1400, 0));
  assert.deepEqual(trace(-5000, 0), trace(-1400, 0));
  assert.notDeepEqual(trace(1400, 0), trace(700, 0), 'the velocity itself matters below the clamp');
  assert.deepEqual(trace(Number.POSITIVE_INFINITY, Number.NaN), trace(0, 0));
  assert.deepEqual(trace(Number.NEGATIVE_INFINITY, 700), trace(0, 700));
  assert.deepEqual(trace(Number.NaN, Number.NaN), trace(0, 0));
});

test('60Hz and 120Hz streams along one trajectory differ by at most 1.5px at every checkpoint', () => {
  const trajectory = (t) => ({
    x: 250 + 500 * t,
    y: 420 + 120 * Math.sin(2.5 * t),
    vx: 500,
    vy: 300 * Math.cos(2.5 * t),
  });
  const stream = (hz) => {
    const s = setup('studio', 'wide');
    const checkpoints = [];
    const dtMs = 1000 / hz;
    const total = Math.round(1.2 * hz);
    for (let k = 0; k <= total; k += 1) {
      const t = k / hz;
      const p = trajectory(t);
      const pose = step(s, { dtMs: k === 0 ? 0 : dtMs, pointer: pointerAt(p.x, p.y, { vx: p.vx, vy: p.vy }) });
      if (k % (hz / 10) === 0) checkpoints.push(offsets(s, pose));
    }
    return checkpoints;
  };
  const slow = stream(60);
  const fast = stream(120);
  assert.equal(slow.length, fast.length);
  let worst = 0;
  let moving = 0;
  slow.forEach((frame, index) => {
    frame.forEach((offset, node) => {
      worst = Math.max(worst, Math.hypot(offset.dx - fast[index][node].dx, offset.dy - fast[index][node].dy));
      moving = Math.max(moving, magnitude(offset));
    });
  });
  assert.ok(moving > 8, `the trajectory really moves nodes (${moving})`);
  assert.ok(worst <= 1.5, `60/120Hz worst difference ${worst}px`);
});

test('at most 50ms of a long gap integrates: a hidden tab is not replayed', () => {
  const gap = (deltaMs) => {
    const s = custom([['a', 500, 350]]);
    run(s, 20, () => ({ pointer: pointerAt(380, 350, { vx: 400 }) }));
    s.now += 100;
    return step(s, { dtMs: deltaMs, pointer: pointerAt(385, 350, { vx: 400 }) });
  };
  assert.deepEqual(gap(5000).nodes, gap(50).nodes);
  assert.notDeepEqual(gap(50).nodes, gap(5).nodes, 'the 50ms cap is not simply "no time"');
});

test('time that is not monotonic or not finite integrates nothing', () => {
  const s = custom([['a', 500, 350]]);
  run(s, 30, () => ({ pointer: pointerAt(380, 350) }));
  const before = s.interaction.step({ nowMs: s.now, deltaMs: 0, base: s.base, layout: s.layout, pointer: pointerAt(380, 350), scrollDeltaPx: 0 });
  for (const deltaMs of [Number.NaN, -16, Number.POSITIVE_INFINITY, undefined]) {
    const pose = s.interaction.step({ nowMs: s.now, deltaMs, base: s.base, layout: s.layout, pointer: pointerAt(380, 350), scrollDeltaPx: 0 });
    assert.ok(allFinite(pose));
    if (deltaMs === undefined || Number.isNaN(deltaMs) || deltaMs < 0) assert.deepEqual(pose.nodes, before.nodes, `delta ${deltaMs}`);
  }
  // A clock that runs backwards integrates nothing either.
  const backwards = s.interaction.step({ nowMs: s.now - 5000, deltaMs: 16, base: s.base, layout: s.layout, pointer: pointerAt(380, 350), scrollDeltaPx: 0 });
  assert.deepEqual(backwards.nodes, before.nodes);
});

test('ordinary scroll nudges nodes in alternating local directions, bounded, and compact scrolls at 0.38 strength', () => {
  const s = setup('studio', 'wide');
  let pose;
  for (let frame = 0; frame < 60; frame += 1) pose = step(s, { scroll: 40 });
  const moved = offsets(s, pose);
  assert.ok(moved.some((offset) => magnitude(offset) > 0.5), 'scrolling moves nodes');
  assert.ok(moved.every((offset) => magnitude(offset) <= 34 + 1e-6));
  const signs = moved.map((offset) => Math.sign(Math.round(offset.dy * 1000)));
  assert.ok(signs[0] !== 0 && signs[0] === -signs[1], 'neighboring nodes move in opposite directions');
  assert.ok(signs[0] === signs[2]);
  const peakFor = (scrollStrength) => {
    const probe = custom([['a', 500, 350], ['b', 600, 350]], [], { scrollStrength });
    let peak = 0;
    for (let frame = 0; frame < 30; frame += 1) {
      for (const offset of offsets(probe, step(probe, { scroll: 10 }))) peak = Math.max(peak, magnitude(offset));
    }
    return peak;
  };
  near(peakFor(0.38) / peakFor(1), 0.38, 0.01, 'compact strength');
  // Contact does not move on scroll at all.
  const contact = setup('contact', 'wide');
  for (let frame = 0; frame < 60; frame += 1) assert.deepEqual(step(contact, { scroll: 120 }).nodes, contact.base.nodes);
  assert.equal(contact.interaction.isSettled(), true);
});

test('a scroll jump is clamped to the 120px impulse, in both directions', () => {
  const impulse = (delta) => {
    const s = custom([['a', 500, 350], ['b', 600, 350]]);
    return step(s, { scroll: delta }).nodes;
  };
  assert.deepEqual(impulse(5000), impulse(120));
  assert.deepEqual(impulse(-5000), impulse(-120));
  assert.deepEqual(impulse(Number.NaN), impulse(0));
  assert.deepEqual(impulse(Number.POSITIVE_INFINITY), impulse(0));
  assert.notDeepEqual(impulse(120), impulse(0));
});

test('a resize is a state update: offsets keep their CSS size, nothing is replayed', () => {
  const s = setup('studio', 'wide');
  const pointer = pointerAt(760, 340);
  let pose = run(s, 120, () => ({ pointer }));
  const before = offsets(s, pose);
  const smaller = { width: 1100, height: 700, tier: 'wide' };
  const layout = computeProjectionLayout(s.profile, smaller);
  const restCss = s.profile.graph.nodes.map((node) => {
    const css = projectAnchor(node.anchor, layout);
    return { x: css.xPx, y: css.yPx };
  });
  pose = step(s, { pointer, layout });
  assert.ok(allFinite(pose));
  assert.equal(pose.projectionLayout, layout);
  pose.nodes.forEach((node, index) => {
    const css = projectAnchor(node.position, layout);
    const dx = css.xPx - restCss[index].x;
    const dy = css.yPx - restCss[index].y;
    assert.ok(Math.hypot(dx - before[index].dx, dy - before[index].dy) < 3, `${node.id} keeps its displacement across the resize`);
  });
});

test('excitation records are normalized and fade out; Contact reports strings only', () => {
  const s = setup('studio', 'wide');
  const pose = step(s, { pointer: pointerAt(760, 340) });
  assert.ok(pose.excitation.length > 0);
  for (const record of pose.excitation) assert.ok(record.value > 0 && record.value <= 1, `${record.id} in 0..1`);
  const nodeIds = new Set(s.profile.graph.nodes.map((node) => node.id));
  const edgeIds = new Set(s.profile.graph.edges.map((edge) => edge.id));
  assert.ok(pose.excitation.some((record) => nodeIds.has(record.id)));
  assert.ok(pose.excitation.some((record) => edgeIds.has(record.id)));
  const rested = run(s, 12 * 60, () => ({ pointer: null }));
  assert.equal(rested.excitation, undefined);
  assert.equal(rested.edgeSamples, undefined);

  const contact = setup('contact', 'wide');
  const touched = run(contact, 20, () => ({ pointer: pointerAt(900, 300, { vx: 200, ageSeconds: 0 }) }));
  assert.ok(touched.excitation.length > 0);
  assert.ok(touched.excitation.every((record) => edgeIds.has(record.id) || contact.profile.graph.edges.some((edge) => edge.id === record.id)));
  assert.ok(touched.excitation.every((record) => !contact.profile.graph.nodes.some((node) => node.id === record.id)), 'no node emphasis on Contact');
});

test('a pointer that stops moving lets the field fall asleep with a small steady yield and no jitter', () => {
  const s = custom([['a', 500, 350], ['b', 560, 330]], [['a', 'b']]);
  let asleepAt;
  let pose;
  for (let frame = 0; frame < 8 * 60; frame += 1) {
    pose = step(s, { pointer: pointerAt(420, 350, { ageSeconds: (frame * STEP_MS) / 1000 + 0.3 }) });
    if (s.interaction.isSettled()) {
      asleepAt = frame;
      break;
    }
  }
  assert.ok(asleepAt !== undefined && asleepAt * STEP_MS < 5000, `asleep within five seconds (frame ${asleepAt})`);
  const rest = offsets(s, pose).map(magnitude);
  assert.ok(rest[0] > 0.1, 'a small steady yield remains while the pointer stays near');
  const later = run(s, 60, () => ({ pointer: pointerAt(420, 350, { ageSeconds: 6 }) }));
  offsets(s, later).forEach((offset, index) => near(magnitude(offset), rest[index], 0.02, `no jitter on node ${index}`));
});

test('a rested field and a cleared field carry no residue into the next gesture', () => {
  const gesture = (s) => {
    let pose;
    for (let frame = 0; frame < 20; frame += 1) {
      pose = step(s, { pointer: pointerAt(500 + frame * 5, 330, { vx: 300 }), scroll: frame % 5 === 0 ? 20 : 0 });
    }
    return { nodes: offsets(s, pose), strings: stringResiduals(s, pose) };
  };
  const fresh = gesture(setup('studio', 'wide'));
  const rested = setup('studio', 'wide');
  run(rested, 60, (frame) => ({ pointer: pointerAt(600 + frame * 3, 340, { vx: 180 }) }));
  run(rested, 12 * 60, () => ({ pointer: null }));
  assert.equal(rested.interaction.isSettled(), true);
  const afterRest = gesture(rested);
  const cleared = setup('studio', 'wide');
  run(cleared, 60, (frame) => ({ pointer: pointerAt(600 + frame * 3, 340, { vx: 180 }), scroll: 30 }));
  cleared.interaction.clear();
  const afterClear = gesture(cleared);
  for (const [name, result] of [['rested', afterRest], ['cleared', afterClear]]) {
    result.nodes.forEach((offset, index) => {
      near(offset.dx, fresh.nodes[index].dx, 1e-9, `${name} ${offset.id} dx`);
      near(offset.dy, fresh.nodes[index].dy, 1e-9, `${name} ${offset.id} dy`);
    });
    result.strings.forEach((entry, index) => {
      near(entry.x, fresh.strings[index].x, 1e-9, `${name} string ${entry.id}/${entry.j} x`);
      near(entry.y, fresh.strings[index].y, 1e-9, `${name} string ${entry.id}/${entry.j} y`);
    });
  }
});

test('clear() returns every offset, velocity and excitation to rest at once', () => {
  const s = setup('studio', 'wide');
  run(s, 60, (frame) => ({ pointer: pointerAt(700 + frame * 4, 340, { vx: 600 }), scroll: 30 }));
  assert.equal(s.interaction.isSettled(), false);
  s.interaction.clear();
  assert.equal(s.interaction.isSettled(), true);
  const pose = step(s);
  assert.deepEqual(pose.nodes, s.base.nodes);
  assert.equal(pose.excitation, undefined);
  assert.equal(pose.edgeSamples, undefined);
});

test('the model is deterministic and interactions do not share state', () => {
  const play = () => {
    const s = setup('founder', 'wide');
    let pose;
    for (let frame = 0; frame < 120; frame += 1) {
      const t = frame / 60;
      pose = step(s, { pointer: pointerAt(300 + 600 * t, 400 + 100 * Math.sin(t * 3), { vx: 600, vy: 300 * Math.cos(t * 3) }), scroll: frame % 7 === 0 ? 25 : 0 });
    }
    return pose;
  };
  const first = play();
  const interleaved = setup('founder', 'wide');
  step(interleaved, { pointer: pointerAt(100, 100, { vx: 1400 }) });
  assert.deepEqual(play(), first);
});

test('degenerate geometry stays finite: coincident endpoints, non-finite base positions, jumpy input', () => {
  const s = custom([['a', 500, 350], ['b', 500, 350], ['c', 700, 350]], [['a', 'b'], ['b', 'c']]);
  const pose = run(s, 60, () => ({ pointer: pointerAt(500, 350, { vx: 100 }) }));
  assert.ok(allFinite(pose), 'coincident endpoints and a pointer exactly on a node');
  const broken = {
    ...s.base,
    nodes: s.base.nodes.map((node, index) => (index === 0 ? { ...node, position: [Number.NaN, 1, 1] } : node)),
  };
  for (let frame = 0; frame < 30; frame += 1) assert.ok(allFinite(step(s, { base: broken, pointer: pointerAt(480, 340, { vx: 50 }) })), 'a non-finite base position');
});

test('randomized abuse never produces a non-finite pose or breaks a cap', () => {
  const random = mulberry32(0xc0de);
  const hostile = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 1e12, -1e12, 0, -0, 1e-12];
  const pick = (scale) => (random() < 0.15 ? hostile[Math.floor(random() * hostile.length)] : (random() - 0.5) * scale);
  for (const [route, tier] of [['studio', 'wide'], ['contact', 'tablet'], ['founder', 'compact'], ['services', 'wide']]) {
    const s = setup(route, tier);
    const nodeCap = s.profile.input.nodeTravelCapPx;
    const edgeCap = s.profile.input.edgeCapPx;
    for (let frame = 0; frame < 400; frame += 1) {
      const pointer = random() < 0.2 ? null : { x: pick(3000) + 700, y: pick(2000) + 400, vx: pick(8000), vy: pick(8000), ageSeconds: random() < 0.1 ? hostile[Math.floor(random() * hostile.length)] : random() * 3 };
      const pose = s.interaction.step({
        nowMs: s.now += 16,
        deltaMs: random() < 0.1 ? [Number.NaN, -50, 1e9, 0][Math.floor(random() * 4)] : random() * 40,
        base: s.base,
        layout: s.layout,
        pointer,
        scrollDeltaPx: pick(600),
      });
      assert.ok(allFinite(pose), `${route} frame ${frame}`);
      for (const offset of offsets(s, pose)) assert.ok(magnitude(offset) <= nodeCap + 1e-6, `${route} node cap at frame ${frame}`);
      for (const entry of stringResiduals(s, pose)) assert.ok(entry.size <= edgeCap + 1e-6, `${route} string cap at frame ${frame}`);
    }
  }
});

test('Services and Projects get the shared response on their legacy rest strings', () => {
  const s = setup('services', 'wide');
  const pose = run(s, 120, () => ({ pointer: pointerAt(720, 450, { vx: 300 }) }));
  const moved = offsets(s, pose);
  assert.ok(moved.some((offset) => magnitude(offset) > 1));
  assert.equal(pose.edgeSamples.length, 33);
  const byId = new Map(pose.nodes.map((node) => [node.id, node.position]));
  const first = pose.edgeSamples[0];
  const edgeIndex = s.profile.graph.edges.findIndex((edge) => edge.id === first.id);
  const edge = s.profile.graph.edges[edgeIndex];
  const rest = evaluateRestEdge({ nodeStyle: 'legacy', edgeIndex, from: byId.get(edge.from), to: byId.get(edge.to), layout: s.layout }, 0.5);
  const quiet = first.points[3];
  const gap = Math.hypot(...quiet.map((value, axis) => value - rest[axis]));
  assert.ok(gap < 1, 'the middle of a legacy string rides the analytic bowed rest path, not a straight chord');
});
