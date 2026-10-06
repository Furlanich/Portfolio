import test from 'node:test';
import assert from 'node:assert/strict';

const { resolveLabelVisibility } = await import('../lib/connected-studio/labels.ts');

const VIEWPORT = Object.freeze({ width: 1000, height: 600 });

function box(id, left, top, overrides = {}) {
  return { id, left, top, width: 100, height: 24, depthScale: 1, ...overrides };
}

function resolve(labels, occluders = []) {
  return resolveLabelVisibility(labels, occluders, VIEWPORT);
}

function byId(result) {
  return Object.fromEntries(result.map((entry) => [entry.id, entry]));
}

test('a label fully inside the viewport and clear of everything stays where it is', () => {
  const [result] = resolve([box('a', 200, 100)]);
  assert.deepEqual(result, { id: 'a', visible: true, left: 200, top: 100 });
});

test('a partly outside label is clamped into the viewport at its full size', () => {
  const results = byId(resolve([box('right', 950, 100), box('left', -40, 100), box('top', 400, -10), box('bottom', 400, 590)]));
  assert.deepEqual(results.right, { id: 'right', visible: true, left: 900, top: 100 });
  assert.deepEqual(results.left, { id: 'left', visible: true, left: 0, top: 100 });
  assert.deepEqual(results.top, { id: 'top', visible: true, left: 400, top: 0 });
  assert.deepEqual(results.bottom, { id: 'bottom', visible: true, left: 400, top: 576 });
});

test('a label that cannot fit the viewport is hidden', () => {
  const results = byId(resolve([box('wide', 100, 100, { width: 1200 }), box('tall', 100, 100, { height: 700 })]));
  assert.equal(results.wide.visible, false);
  assert.equal(results.tall.visible, false);
});

test('a label entirely out of view is hidden instead of being dragged onto the screen', () => {
  const results = byId(resolve([box('right', 1100, 100), box('left', -300, 100), box('above', 400, -200), box('below', 400, 800)]));
  for (const id of ['right', 'left', 'above', 'below']) assert.equal(results[id].visible, false, id);
});

test('a label that intersects a reading mask, caption, Pause or App Bar is hidden', () => {
  const occluders = [{ left: 300, top: 90, width: 200, height: 60 }];
  const results = byId(resolve([box('over', 350, 100), box('edge', 500, 100), box('clear', 600, 100), box('above', 350, 66)], occluders));
  assert.equal(results.over.visible, false, 'overlapping the occluder hides the label');
  assert.equal(results.edge.visible, true, 'touching the occluder edge is not an intersection');
  assert.equal(results.clear.visible, true);
  assert.equal(results.above.visible, true, 'ending exactly at the occluder top is not an intersection');
});

test('the occlusion test uses the clamped position the label would be drawn at', () => {
  const occluders = [{ left: 880, top: 90, width: 120, height: 60 }];
  const [result] = resolve([box('edge', 960, 100)], occluders);
  assert.equal(result.visible, false, 'clamped to 900..1000 it overlaps the occluder');

  // Clamped into an occluder that its raw box missed: drawn at 0..100, so it is hidden.
  const [intoOccluder] = resolve([box('left', -60, 100)], [{ left: 50, top: 90, width: 40, height: 60 }]);
  assert.equal(intoOccluder.visible, false, 'the clamped box 0..100 overlaps an occluder the raw box -60..40 does not');

  // Clamped out of an occluder that its raw box overlapped: drawn at 900..1000, clear of 1010..1100.
  const [outOfOccluder] = resolve([box('right', 950, 100)], [{ left: 1010, top: 90, width: 90, height: 60 }]);
  assert.equal(outOfOccluder.visible, true, 'the clamped box 900..1000 is clear of an occluder the raw box 950..1050 overlaps');
  assert.equal(outOfOccluder.left, 900);
});

test('overlapping labels resolve greedily by descending depthScale', () => {
  const results = byId(resolve([box('far', 200, 100, { depthScale: 0.7 }), box('near', 250, 105, { depthScale: 0.95 })]));
  assert.equal(results.near.visible, true, 'the nearer node keeps its label');
  assert.equal(results.far.visible, false);
});

test('equal depthScale overlaps resolve by ascending node id, independent of input order', () => {
  const first = byId(resolve([box('w02', 200, 100), box('w01', 250, 105)]));
  const second = byId(resolve([box('w01', 250, 105), box('w02', 200, 100)]));
  for (const results of [first, second]) {
    assert.equal(results.w01.visible, true);
    assert.equal(results.w02.visible, false);
  }
});

test('a hidden label never claims space: a chain keeps the labels that no visible label overlaps', () => {
  const results = byId(
    resolve([
      box('a', 100, 100, { depthScale: 0.95 }),
      box('b', 180, 100, { depthScale: 0.85 }), // overlaps a
      box('c', 260, 100, { depthScale: 0.75 }), // overlaps b only; b is hidden, so c is free
      box('d', 120, 300, { depthScale: 0.9 }),
    ]),
  );
  assert.deepEqual(
    ['a', 'b', 'c', 'd'].map((id) => results[id].visible),
    [true, false, true, true],
  );

  const pair = [box('first', 200, 100, { depthScale: 0.99 }), box('neighbour', 260, 105, { depthScale: 0.5 })];
  const both = byId(resolve(pair, [{ left: 190, top: 90, width: 120, height: 50 }]));
  assert.equal(both.first.visible, false);
  assert.equal(both.neighbour.visible, false, 'the neighbour is occluded by the same plate');
  const onlyFirst = byId(resolve(pair, [{ left: 190, top: 90, width: 60, height: 50 }]));
  assert.equal(onlyFirst.first.visible, false, 'the first label is occluded');
  assert.equal(onlyFirst.neighbour.visible, true, 'an occluded label does not suppress a lower-priority neighbour');
});

test('results keep the input order, one per label, and never mutate the input', () => {
  const labels = Object.freeze([box('c', 600, 300), box('a', 100, 100), box('b', 300, 200)].map((label) => Object.freeze(label)));
  const occluders = Object.freeze([Object.freeze({ left: 0, top: 0, width: 10, height: 10 })]);
  const results = resolveLabelVisibility(labels, occluders, VIEWPORT);
  assert.deepEqual(results.map((result) => result.id), ['c', 'a', 'b']);
  assert.deepEqual(resolveLabelVisibility(labels, occluders, VIEWPORT), results, 'the same input gives the same result');
  assert.deepEqual(resolveLabelVisibility([], [], VIEWPORT), []);
});

test('unusable boxes, occluders and viewports hide labels instead of throwing', () => {
  const invalid = byId(
    resolve([
      box('nan', Number.NaN, 100),
      box('negative', 100, 100, { width: -10 }),
      box('zero', 100, 100, { height: 0 }),
      box('infinite', 100, 100, { depthScale: Number.POSITIVE_INFINITY }),
    ]),
  );
  for (const id of ['nan', 'negative', 'zero', 'infinite']) assert.equal(invalid[id].visible, false, id);

  const ignored = resolve([box('a', 200, 100)], [{ left: 0, top: 0, width: 0, height: 0 }, { left: Number.NaN, top: 0, width: 50, height: 50 }]);
  assert.equal(ignored[0].visible, true, 'a zero-area or unusable occluder occludes nothing');

  const blank = resolveLabelVisibility([box('a', 200, 100)], [], { width: 0, height: 0 });
  assert.equal(blank[0].visible, false, 'a zero-size viewport shows no labels');
  const broken = resolveLabelVisibility([box('a', 200, 100)], [], { width: Number.NaN, height: 600 });
  assert.equal(broken[0].visible, false, 'an unusable viewport shows no labels');
});
