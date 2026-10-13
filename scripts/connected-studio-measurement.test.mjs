import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// PLAN-SPF-V1 Task 9: the deterministic helper behind the production measurement scripts. It decides
// what the optional engine/runtime closure of a connected route costs, from the emitted chunk graph
// (path, sizes and the chunks each one pulls in). Browser I/O stays in the scripts.

const {
  attributeShifts,
  buildRouteClosure,
  chunkImports,
  contrastRatio,
  crossCheckClosure,
  judgeHardware,
  judgeMetric,
  measureOptionalClosure,
  missingInteractions,
  OPTIONAL_CLOSURE_LIMIT_BYTES,
  validateVitalsOptions,
  worstContrast,
} = await import('../lib/connected-studio/measurement.ts');

const KIB = 1024;
const chunk = (path, brotliKiB, imports = [], rawKiB = brotliKiB * 3) => ({
  path,
  brotliBytes: brotliKiB * KIB,
  rawBytes: rawKiB * KIB,
  imports,
});

// An entry plus nested shared dependencies: the entry alone is small, the closure is not. `util` is
// reachable by two paths and must be counted once.
const nestedClosure = [
  chunk('chunks/scene-entry.js', 20, ['chunks/three.js', 'chunks/shared-geometry.js']),
  chunk('chunks/three.js', 90, ['chunks/shared-geometry.js', 'chunks/util.js']),
  chunk('chunks/shared-geometry.js', 15, ['chunks/util.js']),
  chunk('chunks/util.js', 5),
];

test('optional scene budget counts the complete nested chunk closure once', () => {
  const report = measureOptionalClosure({ entries: ['chunks/scene-entry.js'], chunks: nestedClosure });

  assert.equal(OPTIONAL_CLOSURE_LIMIT_BYTES, 120 * KIB, 'the cold-route ceiling is 120KiB Brotli');
  assert.equal(report.brotliBytes, 130 * KIB, 'entry 20 + three 90 + geometry 15 + util 5 (counted once)');
  assert.equal(report.rawBytes, 130 * 3 * KIB);
  assert.deepEqual(report.chunks.map((item) => item.path).sort(), [
    'chunks/scene-entry.js',
    'chunks/shared-geometry.js',
    'chunks/three.js',
    'chunks/util.js',
  ]);
  assert.equal(report.withinLimit, false, 'the closure is over the ceiling even though the entry alone is not');
  assert.equal(report.violations.length, 1);
  assert.match(report.violations[0], /133120 .*Brotli.*exceeds.*122880/);
});

test('chunks the matched static route already loads are not counted against the optional closure', () => {
  const report = measureOptionalClosure({
    entries: ['chunks/scene-entry.js'],
    chunks: nestedClosure,
    alreadyLoaded: ['chunks/shared-geometry.js', 'chunks/util.js'],
  });

  assert.deepEqual(report.chunks.map((item) => item.path).sort(), ['chunks/scene-entry.js', 'chunks/three.js']);
  assert.equal(report.brotliBytes, 110 * KIB, 'only the entry and three are absent from the static route');
  assert.equal(report.withinLimit, true);
  assert.deepEqual(report.violations, []);
});

test('a dependency that is missing from the emitted chunk graph is a violation, never a silent undercount', () => {
  const report = measureOptionalClosure({
    entries: ['chunks/scene-entry.js'],
    chunks: [chunk('chunks/scene-entry.js', 10, ['chunks/not-emitted.js'])],
  });

  assert.equal(report.withinLimit, false);
  assert.equal(report.violations.length, 1);
  assert.match(report.violations[0], /chunks\/not-emitted\.js.*not in the emitted chunk graph/);
});

test('the requested optional scripts and the emitted closure must match exactly', () => {
  const closure = measureOptionalClosure({ entries: ['chunks/scene-entry.js'], chunks: nestedClosure });

  assert.deepEqual(crossCheckClosure({ requested: closure.chunks.map((item) => item.path), closure }), { missingFromRequests: [], unexpectedRequests: [] });

  const drift = crossCheckClosure({
    requested: ['chunks/scene-entry.js', 'chunks/three.js', 'chunks/shared-geometry.js', 'chunks/surprise.js'],
    closure,
  });
  assert.deepEqual(drift.missingFromRequests, ['chunks/util.js'], 'an emitted dependency the browser never fetched');
  assert.deepEqual(drift.unexpectedRequests, ['chunks/surprise.js'], 'a fetched script the emitted graph does not explain');
});

// --- Review corrections (PR #138, Sol round 1) ------------------------------------------------------

test('the vitals options reject any argument that would produce no samples', () => {
  const profiles = ['mobile', 'desktop'];
  const base = { journeys: '10', profile: undefined, profiles };
  assert.deepEqual(validateVitalsOptions(base), { journeys: 10, profiles: ['mobile', 'desktop'], expectMode: 'static' });
  assert.deepEqual(validateVitalsOptions({ ...base, profile: 'mobile', journeys: '3', expectMode: 'live' }), { journeys: 3, profiles: ['mobile'], expectMode: 'live' });
  for (const journeys of ['0', '-2', 'NaN', 'abc', '1.5', '', undefined]) {
    assert.throws(() => validateVitalsOptions({ ...base, journeys }), /journeys/, `journeys=${journeys}`);
  }
  assert.throws(() => validateVitalsOptions({ ...base, profile: 'tablet' }), /profile.*tablet/);
  assert.throws(() => validateVitalsOptions({ ...base, expectMode: 'hybrid' }), /expect-mode/);
});

test('a journey is complete only when every required interaction completed for its mode', () => {
  const staticDone = ['fragment-link', 'keyboard-focus', 'scroll', 'route-link'];
  assert.deepEqual(missingInteractions({ mode: 'static', completed: staticDone }), []);
  assert.deepEqual(missingInteractions({ mode: 'static', completed: staticDone.filter((item) => item !== 'route-link') }), ['route-link']);
  assert.deepEqual(missingInteractions({ mode: 'live', completed: staticDone }), ['pause', 'resume'], 'a live page also needs Pause and Resume');
  assert.deepEqual(missingInteractions({ mode: 'live', completed: [...staticDone, 'pause', 'resume'] }), []);
});

test('the zero enhancement-shift gate sees a shift that rounding to four decimals would hide', () => {
  const result = attributeShifts({
    shifts: [
      { value: 0.00004, time: 1200, enhancement: true },
      { value: 0.0002, time: 300, enhancement: false },
    ],
    fontLoads: [],
    activationAt: 1000,
  });
  assert.equal(result.fromEnhancement, 0.00004, 'the raw sum is kept for the gate');
  assert.ok(result.fromEnhancement > 0, 'a positive shift fails the exact-zero gate');
  assert.equal(result.wholePage, 0.00024);
  assert.equal(result.enhancementDetail.length, 1);
  // A shift while a web font loads (or within 500 ms of it finishing) is a font swap, not the enhancement.
  const swap = attributeShifts({ shifts: [{ value: 0.01, time: 1300, enhancement: false }], fontLoads: [[1100, 1200]], activationAt: 1000 });
  assert.equal(swap.fromEnhancement, 0);
});

test('the route closure is found from the loader names in the route chunks, minus the chunks the route itself loads', () => {
  const chunks = [
    chunk('chunks/page.js', 8, ['chunks/scene-entry.js', 'chunks/static-sibling.js']),
    chunk('chunks/static-sibling.js', 12),
    ...nestedClosure,
  ];
  const route = buildRouteClosure({ referenced: ['chunks/page.js', 'chunks/static-sibling.js'], chunks });
  assert.deepEqual(route.entries, ['chunks/scene-entry.js']);
  assert.equal(route.closure.brotliBytes, 130 * KIB);
  assert.equal(route.closure.withinLimit, false);
  assert.deepEqual(buildRouteClosure({ referenced: ['chunks/static-sibling.js'], chunks }).entries, [], 'no optional entry means an empty, reported closure');
});

test('the vitals script exits non-zero before building or launching anything when its arguments would yield no samples', () => {
  const script = fileURLToPath(new URL('./measure-connected-studio-vitals.mjs', import.meta.url));
  for (const args of [['--journeys=0'], ['--journeys=-1'], ['--journeys=abc'], ['--profile=tablet'], ['--expect-mode=hybrid']]) {
    const run = spawnSync(process.execPath, [script, '--skip-build', ...args], { encoding: 'utf8', timeout: 30_000 });
    assert.notEqual(run.status, 0, `${args.join(' ')} must not pass: ${run.stdout.slice(-200)}`);
    assert.doesNotMatch(run.stdout, /gates passed/, args.join(' '));
    assert.match(run.stderr, /--journeys|--profile|--expect-mode/, `${args.join(' ')} names the bad argument`);
  }
});

test('the imports of a chunk are the other chunk files its async loaders name, each once and never itself', () => {
  const source = 'e.v(t=>Promise.all(["static/chunks/a.js","static/chunks/b.css","static/chunks/self.js","static/chunks/a.js"].map(t=>e.l(t))))' +
    ' and a media file "static/media/font.woff2" and a note about static/chunks without a file';
  assert.deepEqual(chunkImports(source, 'chunks/self.js'), ['chunks/a.js', 'chunks/b.css']);
  assert.deepEqual(chunkImports('no loaders here', 'chunks/self.js'), []);
});

// --- Hardware candidate evidence (verdicts and contrast) ---------------------------------------------

test('contrast ratios follow WCAG 2 and the worst background decides', () => {
  assert.equal(Math.round(contrastRatio([0, 0, 0], [255, 255, 255])), 21);
  assert.equal(contrastRatio([255, 255, 255], [0, 0, 0]), contrastRatio([0, 0, 0], [255, 255, 255]), 'symmetric');
  // #777777 on white is the classic 4.48:1 near-miss.
  assert.equal(+contrastRatio([0x77, 0x77, 0x77], [255, 255, 255]).toFixed(2), 4.48);
  // Light text over a mostly dark field with one bright patch: the bright patch is the worst case.
  const worst = worstContrast([249, 246, 238], [[6, 18, 31], [10, 30, 51], [200, 200, 200]]);
  assert.equal(+worst.toFixed(2), +contrastRatio([249, 246, 238], [200, 200, 200]).toFixed(2));
  assert.throws(() => worstContrast([0, 0, 0], []), /background/);
});

test('a metric that was not measured is OPEN, never a passing zero', () => {
  assert.equal(judgeMetric(12, 20), 'PASS');
  assert.equal(judgeMetric(20, 20), 'PASS', 'a max limit is inclusive');
  assert.equal(judgeMetric(21, 20), 'FAIL');
  assert.equal(judgeMetric(0, 20), 'PASS', 'a measured zero is a real zero');
  for (const missing of [null, undefined, Number.NaN]) assert.equal(judgeMetric(missing, 20), 'OPEN');
  assert.equal(judgeMetric(49.9, 50, 'below'), 'PASS');
  assert.equal(judgeMetric(50, 50, 'below'), 'FAIL', 'the scene interaction task must stay strictly under 50 ms');
});

test('the hardware verdict is PASS only when every row passes, FAIL if any fails and OPEN if any is unmeasured', () => {
  const passing = {
    activeIntervalP95Ms: 16.7, renderCpuP95Ms: 3, renderGpuP95Ms: 2, interactionTaskMaxMs: 30, drawCallsMax: 20,
    pixelRatio: 1, ambientFps: 30, pausedDraws: 0, pausedRafCalls: 0, hiddenDraws: 0, footerDraws: 0, maxContexts: 1, listenerGrowth: 0,
  };
  assert.equal(judgeHardware(passing, 'wide').verdict, 'PASS');
  assert.equal(judgeHardware({ ...passing, drawCallsMax: 29 }, 'wide').verdict, 'FAIL');
  assert.equal(judgeHardware({ ...passing, drawCallsMax: 20 }, 'compact').verdict, 'FAIL', 'compact allows 18 draw calls');
  assert.equal(judgeHardware({ ...passing, ambientFps: 30 }, 'compact').verdict, 'FAIL', 'compact ambient cadence is 20 fps');
  assert.equal(judgeHardware({ ...passing, renderGpuP95Ms: null }, 'wide').verdict, 'OPEN', 'no GPU timer, no GPU claim');
  assert.equal(judgeHardware({ ...passing, renderGpuP95Ms: null, drawCallsMax: 99 }, 'wide').verdict, 'FAIL', 'a failure outranks an unmeasured row');
  assert.equal(judgeHardware({ ...passing, pausedDraws: 3 }, 'wide').rows.pausedDraws.verdict, 'FAIL');
});
