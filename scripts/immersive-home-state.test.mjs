import test from 'node:test';
import assert from 'node:assert/strict';

const { mapProgressToInstrumentState, progressFromChapterRects, isMaterialChange } = await import('../lib/immersive-home/state.ts');
const { chooseImmersiveMode, chooseRenderQuality } = await import('../lib/immersive-home/capability.ts');

const CHAPTERS = ['recognition', 'fragmentation', 'connection', 'coordination'];

test('clamps progress into the four-chapter range', () => {
  for (const [input, chapter, local] of [
    [-1, 'recognition', 0],
    [Number.NaN, 'recognition', 0],
    [Number.POSITIVE_INFINITY, 'coordination', 1],
    [2, 'coordination', 1],
  ]) {
    const state = mapProgressToInstrumentState(input);
    assert.equal(state.chapter, chapter, String(input));
    assert.equal(state.localProgress, local, String(input));
  }
});

test('switches chapter exactly on the quarter boundaries', () => {
  for (const [progress, chapter, local] of [
    [0, 'recognition', 0],
    [0.2499, 'recognition', 0.9996],
    [0.25, 'fragmentation', 0],
    [0.5, 'connection', 0],
    [0.75, 'coordination', 0],
    [1, 'coordination', 1],
  ]) {
    const state = mapProgressToInstrumentState(progress);
    assert.equal(state.chapter, chapter, String(progress));
    assert.ok(Math.abs(state.localProgress - local) < 1e-9, `${progress}: ${state.localProgress}`);
  }
});

test('maps each chapter to its approved composition', () => {
  const at = (chapter) => mapProgressToInstrumentState(CHAPTERS.indexOf(chapter) / 4 + 0.125);
  assert.deepEqual(
    { spread: at('recognition').layerSpread, connection: at('recognition').connectionStrength, coordination: at('recognition').coordination },
    { spread: 0, connection: 0, coordination: 0 },
    'Recognition is intact and unconnected',
  );
  assert.equal(at('fragmentation').layerSpread, 1, 'Fragmentation separates the layers');
  assert.equal(at('connection').connectionStrength, 1, 'Connection activates the routes');
  assert.ok(at('connection').layerSpread < at('fragmentation').layerSpread, 'Connection regroups the layers');
  assert.deepEqual(
    { spread: at('coordination').layerSpread, coordination: at('coordination').coordination },
    { spread: 0, coordination: 1 },
    'Coordination resolves into one aligned system',
  );
});

test('is monotonic in chapter order and identical forward and reverse', () => {
  const steps = Array.from({ length: 201 }, (_, index) => index / 200);
  const forward = steps.map((progress) => mapProgressToInstrumentState(progress));
  const reverse = [...steps].reverse().map((progress) => mapProgressToInstrumentState(progress)).reverse();
  assert.deepEqual(reverse, forward, 'the same position always yields the same state');

  let previous = -1;
  for (const state of forward) {
    const index = CHAPTERS.indexOf(state.chapter);
    assert.ok(index >= previous, 'chapters never move backwards while progress increases');
    previous = index;
    for (const value of [state.layerSpread, state.connectionStrength, state.coordination, state.localProgress]) {
      assert.ok(value >= 0 && value <= 1, `state values stay within 0..1 (${value})`);
    }
  }
});

test('recalculates progress from the current chapter geometry after resize', () => {
  // Wide layout: four 700px rows. The viewport centre (450px) sits 30% into Connection.
  const wide = progressFromChapterRects(
    [{ top: -1160, height: 700 }, { top: -460, height: 700 }, { top: 240, height: 700 }, { top: 940, height: 700 }],
    900,
  );
  // After a resize to a compact flow the same chapter is under the centre, now 30% into a 400px block.
  const compact = progressFromChapterRects(
    [{ top: -1500, height: 500 }, { top: -1000, height: 500 }, { top: 330, height: 400 }, { top: 730, height: 500 }],
    900,
  );
  assert.equal(mapProgressToInstrumentState(wide).chapter, 'connection');
  assert.equal(mapProgressToInstrumentState(compact).chapter, 'connection');
  assert.ok(Math.abs(wide - (2 + 0.3) / 4) < 1e-9, `wide ${wide}`);
  assert.ok(Math.abs(compact - (2 + 0.3) / 4) < 1e-9, `compact ${compact}`);

  assert.equal(progressFromChapterRects([{ top: 800, height: 500 }], 900), 0, 'before the sequence');
  assert.equal(progressFromChapterRects([{ top: -2000, height: 500 }, { top: -1500, height: 500 }, { top: -1000, height: 500 }, { top: -500, height: 400 }], 900), 1, 'after the sequence');
});

test('invalidates a frame only for a material state change', () => {
  const base = mapProgressToInstrumentState(0.4);
  assert.equal(isMaterialChange(base, mapProgressToInstrumentState(0.4)), false);
  assert.equal(isMaterialChange(base, mapProgressToInstrumentState(0.4001)), false);
  assert.equal(isMaterialChange(base, mapProgressToInstrumentState(0.45)), true);
  assert.equal(isMaterialChange(undefined, base), true);
});

test('keeps the static path whenever any capability gate fails', () => {
  const eligible = { reducedMotion: false, saveData: false, webglAvailable: true, nearViewport: true, sessionContextLost: false };
  assert.equal(chooseImmersiveMode(eligible), 'webgl');
  for (const [gate, value] of [
    ['reducedMotion', true],
    ['saveData', true],
    ['webglAvailable', false],
    ['sessionContextLost', true],
    ['nearViewport', false],
  ]) {
    assert.equal(chooseImmersiveMode({ ...eligible, [gate]: value }), 'static', gate);
  }
});

test('caps device-pixel ratio and reduces detail by width and capability', () => {
  const wide = chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 3, hardwareConcurrency: 8 });
  const compact = chooseRenderQuality({ viewportWidth: 390, devicePixelRatio: 3, hardwareConcurrency: 8 });
  const constrained = chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 2, hardwareConcurrency: 2 });
  assert.equal(wide.pixelRatio, 1.5);
  assert.equal(compact.pixelRatio, 1.25);
  assert.equal(chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 1, hardwareConcurrency: 8 }).pixelRatio, 1);
  assert.ok(compact.signalCount < wide.signalCount, 'compact renders fewer signals');
  assert.ok(constrained.signalCount < wide.signalCount, 'low concurrency renders fewer signals at any width');
  assert.equal(constrained.pixelRatio, 1.25, 'low concurrency also lowers resolution');
});
