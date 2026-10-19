import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SFC-V1 Task 8. The renderer's flexible path is the shared analytic rest path of a connection plus a smooth
// cubic interpolation of the seven string residuals, clamped to the profile's CSS cap. These cases pin that path
// without any GPU: endpoints stay pinned, the five interior samples are honoured, overshoot is bounded, and a path
// with no strings is exactly the legacy quadratic.

const { createEdgePath, PATH_SEGMENTS } = await import('../components/connected-studio/runtime/connected-paths.ts');
const { evaluateRestEdge } = await import('../lib/connected-studio/rest-path.ts');
const { anchorToScene, computeProjectionLayout, projectAnchor } = await import('../lib/connected-studio/projection.ts');
const { getConnectedGraph } = await import('../lib/connected-studio/model.ts');

const ATLAS_LAYOUT = computeProjectionLayout({ nodeStyle: 'atlas', graph: getConnectedGraph('wide') }, { width: 1440, height: 900, tier: 'wide' });
const LEGACY_LAYOUT = computeProjectionLayout({ nodeStyle: 'legacy', graph: getConnectedGraph('wide') }, { width: 1440, height: 900, tier: 'wide' });

const FROM = [-3, 1.2, 0.3];
const TO = [2.5, -1.4, -0.4];

function near(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} vs ${expected} (tolerance ${tolerance})`);
}

function sceneAt(path, u) {
  const out = [0, 0, 0];
  path.pointAt(u, out);
  return out;
}

/** The seven samples a string at rest would carry: the rest path itself. */
function restSamples(input) {
  return Array.from({ length: 7 }, (_, j) => evaluateRestEdge(input, j / 6));
}

function atlasInput(overrides = {}) {
  return { nodeStyle: 'atlas', edgeIndex: 3, from: FROM, to: TO, layout: ATLAS_LAYOUT, capPx: 16, ...overrides };
}

/** CSS-pixel distance, in the picture plane, between a path point and the rest path at the same parameter. */
function cssDeviation(input, path, u) {
  const rest = projectAnchor(evaluateRestEdge(input, u), input.layout);
  const [sx, sy, sz] = sceneAt(path, u);
  // Back to anchor space through the same layout, then to CSS.
  const actual = projectAnchor(
    [sx / input.layout.spreadX, sy / input.layout.spreadY, sz / input.layout.depthScale],
    input.layout,
  );
  return Math.hypot(actual.xPx - rest.xPx, actual.yPx - rest.yPx);
}

test('the tube is at most twelve segments', () => {
  assert.ok(PATH_SEGMENTS <= 12 && PATH_SEGMENTS >= 6 && PATH_SEGMENTS % 2 === 0, `got ${PATH_SEGMENTS}`);
  assert.equal(PATH_SEGMENTS, 12, 'a tube ring lands exactly on each of the seven string samples at the even rings');
});

test('the endpoints stay pinned to their nodes whatever the string does', () => {
  const base = atlasInput();
  const path = createEdgePath();
  const samples = restSamples(base).map((point, j) => (j === 0 || j === 6 ? point : [point[0] + 0.4, point[1] - 0.3, point[2]]));
  path.prepare({ ...base, samples });
  assert.deepEqual(sceneAt(path, 0), anchorToScene(FROM, ATLAS_LAYOUT), 'the first point is exactly the from node');
  assert.deepEqual(sceneAt(path, 1), anchorToScene(TO, ATLAS_LAYOUT), 'the last point is exactly the to node');
});

test('the endpoints are pinned even when the reported end samples drift', () => {
  const base = atlasInput();
  const path = createEdgePath();
  const samples = restSamples(base).map((point, j) => (j === 0 || j === 6 ? [point[0] + 1, point[1] + 1, point[2]] : point));
  path.prepare({ ...base, samples });
  assert.deepEqual(sceneAt(path, 0), anchorToScene(FROM, ATLAS_LAYOUT));
  assert.deepEqual(sceneAt(path, 1), anchorToScene(TO, ATLAS_LAYOUT));
});

test('all five interior string samples are honoured at s = j/6 when they are inside the cap', () => {
  const base = atlasInput({ capPx: 40 });
  const path = createEdgePath();
  const rest = restSamples(base);
  const bent = rest.map((point, j) => (j === 0 || j === 6 ? point : [point[0] + 0.02 * j, point[1] - 0.015 * (7 - j), point[2] + 0.001 * j]));
  path.prepare({ ...base, samples: bent });
  for (let j = 1; j <= 5; j += 1) {
    const expected = anchorToScene(bent[j], ATLAS_LAYOUT);
    const actual = sceneAt(path, j / 6);
    expected.forEach((value, axis) => near(actual[axis], value, 1e-9, `sample ${j} axis ${axis}`));
  }
});

test('with no strings the path is exactly the shared rest evaluator, straight on Atlas and the legacy quadratic otherwise', () => {
  for (const [style, layout] of [['atlas', ATLAS_LAYOUT], ['legacy', LEGACY_LAYOUT]]) {
    for (const edgeIndex of [0, 1, 2, 3, 4, 5, 6, 7]) {
      const input = { nodeStyle: style, edgeIndex, from: FROM, to: TO, layout, capPx: 16 };
      const path = createEdgePath();
      path.prepare(input);
      for (let step = 0; step <= 24; step += 1) {
        const u = step / 24;
        const expected = anchorToScene(evaluateRestEdge(input, u), layout);
        const actual = sceneAt(path, u);
        expected.forEach((value, axis) => near(actual[axis], value, 1e-12, `${style} edge ${edgeIndex} u=${u} axis ${axis}`));
      }
    }
  }
});

test('strings that equal the rest path add no residual: the path is the rest path', () => {
  for (const [style, layout] of [['atlas', ATLAS_LAYOUT], ['legacy', LEGACY_LAYOUT]]) {
    const input = { nodeStyle: style, edgeIndex: 5, from: FROM, to: TO, layout, capPx: 16 };
    const stringless = createEdgePath();
    stringless.prepare(input);
    const stringed = createEdgePath();
    stringed.prepare({ ...input, samples: restSamples(input) });
    for (let step = 0; step <= 24; step += 1) {
      const u = step / 24;
      sceneAt(stringed, u).forEach((value, axis) => near(value, sceneAt(stringless, u)[axis], 1e-9, `u=${u} axis ${axis}`));
    }
  }
});

test('the Atlas rest edge is straight: the midpoint is the linear midpoint', () => {
  const path = createEdgePath();
  path.prepare(atlasInput());
  const midpoint = sceneAt(path, 0.5);
  [(FROM[0] + TO[0]) / 2, (FROM[1] + TO[1]) / 2, (FROM[2] + TO[2]) / 2].forEach((value, axis) => near(midpoint[axis], value, 1e-12, `axis ${axis}`));
});

test('the legacy rest keeps the SPF bow: the midpoint leaves the chord', () => {
  const input = { nodeStyle: 'legacy', edgeIndex: 2, from: FROM, to: TO, layout: LEGACY_LAYOUT, capPx: 16 };
  const path = createEdgePath();
  path.prepare(input);
  const chordMidpoint = anchorToScene([(FROM[0] + TO[0]) / 2, (FROM[1] + TO[1]) / 2, (FROM[2] + TO[2]) / 2], LEGACY_LAYOUT);
  const midpoint = sceneAt(path, 0.5);
  assert.ok(Math.hypot(midpoint[0] - chordMidpoint[0], midpoint[1] - chordMidpoint[1], midpoint[2] - chordMidpoint[2]) > 0.2, 'a bowed connection is not straight');
});

test('the rendered residual never exceeds the CSS cap, even where the cubic would overshoot', () => {
  for (const capPx of [4, 6, 10, 16]) {
    const base = atlasInput({ capPx });
    const rest = restSamples(base);
    // A sharp alternating push: the cubic through these overshoots between the samples.
    const sign = [0, 1, -1, 1, -1, 1, 0];
    const samples = rest.map((point, j) => {
      // Move the sample exactly `capPx` CSS px along y in the picture plane.
      const scale = (ATLAS_LAYOUT.height / 2) / (Math.tan((35 * Math.PI) / 360) * (12 - point[2]));
      return [point[0], point[1] - (sign[j] * capPx) / scale, point[2]];
    });
    const path = createEdgePath();
    path.prepare({ ...base, samples });
    let worst = 0;
    for (let step = 0; step <= 120; step += 1) worst = Math.max(worst, cssDeviation(base, path, step / 120));
    assert.ok(worst <= capPx + 1e-3, `cap ${capPx}px: the worst rendered deviation was ${worst}px`);
    assert.ok(worst >= capPx * 0.95, `cap ${capPx}px: a push of exactly the cap should be reached, got ${worst}px`);
  }
});

test('a residual inside the cap is never reduced by the clamp', () => {
  const base = atlasInput({ capPx: 16 });
  const rest = restSamples(base);
  const scale = (ATLAS_LAYOUT.height / 2) / (Math.tan((35 * Math.PI) / 360) * (12 - rest[3][2]));
  const samples = rest.map((point, j) => (j === 3 ? [point[0], point[1] - 5 / scale, point[2]] : point));
  const path = createEdgePath();
  path.prepare({ ...base, samples });
  near(cssDeviation(base, path, 0.5), 5, 1e-6, 'a 5px bend under a 16px cap is rendered at 5px');
});

test('the deformed path is smooth: neighbouring points never jump', () => {
  const base = atlasInput({ capPx: 16 });
  const rest = restSamples(base);
  const scale = (ATLAS_LAYOUT.height / 2) / (Math.tan((35 * Math.PI) / 360) * (12 - rest[2][2]));
  const samples = rest.map((point, j) => (j === 2 || j === 4 ? [point[0], point[1] - 9 / scale, point[2]] : point));
  const path = createEdgePath();
  path.prepare({ ...base, samples });
  let previous = sceneAt(path, 0);
  const chord = Math.hypot(TO[0] - FROM[0], TO[1] - FROM[1], TO[2] - FROM[2]);
  for (let step = 1; step <= 240; step += 1) {
    const next = sceneAt(path, step / 240);
    const jump = Math.hypot(next[0] - previous[0], next[1] - previous[1], next[2] - previous[2]);
    assert.ok(jump < (chord / 240) * 3, `step ${step} jumps ${jump}`);
    previous = next;
  }
});

test('coincident endpoints give finite points everywhere', () => {
  for (const [style, layout] of [['atlas', ATLAS_LAYOUT], ['legacy', LEGACY_LAYOUT]]) {
    const same = [0.4, -0.2, 0.1];
    const input = { nodeStyle: style, edgeIndex: 4, from: same, to: same, layout, capPx: 16 };
    for (const samples of [undefined, restSamples(input), Array.from({ length: 7 }, () => same)]) {
      const path = createEdgePath();
      path.prepare({ ...input, samples });
      for (let step = 0; step <= 12; step += 1) {
        for (const value of sceneAt(path, step / 12)) assert.ok(Number.isFinite(value), `${style} u=${step / 12} is finite`);
      }
      assert.deepEqual(sceneAt(path, 0), anchorToScene(same, layout));
      assert.deepEqual(sceneAt(path, 1), anchorToScene(same, layout));
    }
  }
});

test('non-finite sample components and caps never produce non-finite points', () => {
  const base = atlasInput();
  const rest = restSamples(base);
  const hostile = rest.map((point, j) => (j === 2 ? [Number.NaN, Number.POSITIVE_INFINITY, point[2]] : point));
  for (const capPx of [16, Number.NaN, -3, Number.POSITIVE_INFINITY]) {
    const path = createEdgePath();
    path.prepare({ ...base, samples: hostile, capPx });
    for (let step = 0; step <= 24; step += 1) {
      for (const value of sceneAt(path, step / 24)) assert.ok(Number.isFinite(value), `cap ${capPx} u=${step / 24}`);
    }
  }
});

test('a parameter outside 0..1 or not a number clamps to an end', () => {
  const path = createEdgePath();
  path.prepare(atlasInput());
  assert.deepEqual(sceneAt(path, -2), sceneAt(path, 0));
  assert.deepEqual(sceneAt(path, 7), sceneAt(path, 1));
  assert.deepEqual(sceneAt(path, Number.NaN), sceneAt(path, 0));
});

test('preparing again replaces the previous edge completely: no state leaks between connections', () => {
  const path = createEdgePath();
  const bent = atlasInput({ capPx: 40 });
  const rest = restSamples(bent);
  path.prepare({ ...bent, samples: rest.map((point, j) => (j === 3 ? [point[0], point[1] + 1, point[2]] : point)) });
  const fresh = createEdgePath();
  const second = atlasInput({ edgeIndex: 9, from: [1, 1, 0], to: [4, 2, 0.5] });
  path.prepare(second);
  fresh.prepare(second);
  for (let step = 0; step <= 12; step += 1) assert.deepEqual(sceneAt(path, step / 12), sceneAt(fresh, step / 12));
});

test('the same input always gives the same points', () => {
  const base = atlasInput({ capPx: 12 });
  const rest = restSamples(base);
  const samples = rest.map((point, j) => (j % 2 ? [point[0] + 0.1, point[1], point[2]] : point));
  const a = createEdgePath();
  const b = createEdgePath();
  a.prepare({ ...base, samples });
  b.prepare({ ...base, samples });
  for (let step = 0; step <= 36; step += 1) assert.deepEqual(sceneAt(a, step / 36), sceneAt(b, step / 36));
});

test('a drifting end sample never pulls the path off its pinned node', () => {
  const base = atlasInput({ capPx: 16 });
  const rest = restSamples(base);
  const samples = rest.map((point, j) => (j === 0 || j === 6 ? [point[0] + 1, point[1] + 1, point[2]] : point));
  const path = createEdgePath();
  path.prepare({ ...base, samples });
  assert.ok(cssDeviation(base, path, 0.01) < 1, `just past the from node: ${cssDeviation(base, path, 0.01)}px`);
  assert.ok(cssDeviation(base, path, 0.99) < 1, `just before the to node: ${cssDeviation(base, path, 0.99)}px`);
});

test('the path has no corner at a string sample: the tangent is continuous through every knot', () => {
  const base = atlasInput({ capPx: 40 });
  const rest = restSamples(base);
  const scale = (ATLAS_LAYOUT.height / 2) / (Math.tan((35 * Math.PI) / 360) * (12 - rest[2][2]));
  const samples = rest.map((point, j) => (j === 2 ? [point[0], point[1] - 12 / scale, point[2]] : j === 4 ? [point[0], point[1] + 12 / scale, point[2]] : point));
  const path = createEdgePath();
  path.prepare({ ...base, samples });
  const h = 1e-4;
  for (let knot = 1; knot <= 5; knot += 1) {
    const u = knot / 6;
    const before = sceneAt(path, u - 2 * h).map((value, axis) => sceneAt(path, u - h)[axis] - value);
    const after = sceneAt(path, u + h).map((value, axis) => sceneAt(path, u + 2 * h)[axis] - value);
    const cosine = (before[0] * after[0] + before[1] * after[1] + before[2] * after[2]) / (Math.hypot(...before) * Math.hypot(...after));
    assert.ok(cosine > 0.9999, `knot ${knot} turns the path: cosine ${cosine}`);
  }
});

test('the cap holds in the picture plane when a sample also moves toward the camera', () => {
  const capPx = 6;
  const base = atlasInput({ capPx });
  const rest = restSamples(base);
  const samples = rest.map((point, j) => (j === 0 || j === 6 ? point : [point[0] + 0.9 * (j % 2 ? 1 : -1), point[1] + 0.9, point[2] + 4 * (j % 2 ? 1 : -1)]));
  const path = createEdgePath();
  path.prepare({ ...base, samples });
  let worst = 0;
  for (let step = 0; step <= 240; step += 1) worst = Math.max(worst, cssDeviation(base, path, step / 240));
  assert.ok(worst <= capPx + 1e-3, `the worst rendered deviation was ${worst}px`);
});
