import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// PLAN-SPF-V1 Task 9: the deterministic helper behind the production measurement scripts. It decides
// what the optional engine/runtime closure of a connected route costs, from the emitted chunk graph
// (path, sizes and the chunks each one pulls in). Browser I/O stays in the scripts.

const {
  activeFrameIntervals,
  attributeShifts,
  classifyLateFrames,
  buildRouteClosure,
  cadenceFps,
  chunkImports,
  COLD_BASELINE_JOURNEYS,
  contrastRatio,
  crossCheckClosure,
  judgeHardware,
  judgeMetric,
  measureOptionalClosure,
  missingInteractions,
  mainThreadStartupCost,
  OPTIONAL_CLOSURE_LIMIT_BYTES,
  percentileOf,
  summarizeColdBaseline,
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
  assert.deepEqual(validateVitalsOptions(base), { journeys: 10, profiles: ['mobile', 'desktop'], expectMode: 'static', routes: [] });
  assert.deepEqual(validateVitalsOptions({ ...base, profile: 'mobile', journeys: '3', expectMode: 'live' }), { journeys: 3, profiles: ['mobile'], expectMode: 'live', routes: [] });
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
  for (const args of [['--journeys=0'], ['--journeys=-1'], ['--journeys=abc'], ['--profile=tablet'], ['--expect-mode=hybrid'], ['--routes=blog'], ['--routes=']]) {
    const run = spawnSync(process.execPath, [script, '--skip-build', ...args], { encoding: 'utf8', timeout: 30_000 });
    assert.notEqual(run.status, 0, `${args.join(' ')} must not pass: ${run.stdout.slice(-200)}`);
    assert.doesNotMatch(run.stdout, /gates passed/, args.join(' '));
    assert.match(run.stderr, /--journeys|--profile|--expect-mode|--routes/, `${args.join(' ')} names the bad argument`);
  }
});

test('the vitals routes option keeps only known routes and never turns a typo into zero journeys', () => {
  const known = ['services', 'projects', 'studio', 'founder', 'contact'];
  const base = { journeys: '5', profiles: ['mobile', 'desktop'], knownRoutes: known };
  assert.deepEqual(validateVitalsOptions({ ...base }).routes, known, 'no option measures every route');
  assert.deepEqual(validateVitalsOptions({ ...base, routes: 'studio,contact' }).routes, ['studio', 'contact']);
  assert.throws(() => validateVitalsOptions({ ...base, routes: 'studio,blog' }), /--routes.*blog/);
  assert.throws(() => validateVitalsOptions({ ...base, routes: '' }), /--routes/);
  assert.throws(() => validateVitalsOptions({ ...base, routes: 'studio,studio' }), /--routes.*more than once/);
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

test('cadence is measured from the frame timestamps, not from a window that may be longer than the frames', () => {
  const at30 = Array.from({ length: 91 }, (_, i) => i * (1000 / 30));
  assert.ok(Math.abs(cadenceFps(at30) - 30) < 1e-9, 'ninety intervals of 33.33 ms are exactly 30 fps');
  // 907 frames at 30 fps are 30.2 s of rendering: dividing the count by a 30 s window would say 30.23 fps.
  const long = Array.from({ length: 907 }, (_, i) => i * (1000 / 30));
  assert.ok(Math.abs(cadenceFps(long) - 30) < 1e-9, 'the span of the frames decides, not the length of the observation window');
  assert.equal(cadenceFps([100]), null, 'one frame has no cadence');
  assert.equal(cadenceFps([]), null);
  assert.equal(cadenceFps([5, 5]), null, 'no elapsed time, no cadence');
});

// --- PLAN-SFC-V1 Task 3: collector fields for the early baselines -------------------------------------

const baseline = (overrides = {}) => ({
  route: 'studio',
  locale: 'es',
  profile: 'desktop',
  basePath: '/',
  firstLoadJsBrotliBytes: 118 * KIB,
  criticalJsBrotliBytes: 104 * KIB,
  samples: Array.from({ length: 5 }, (_, i) => ({ startupCpuMs: 40 + i, longestTaskMs: 22 + i })),
  method: 'CDP trace of the main thread from navigation start to load plus two seconds, one cold context per journey',
  tracePaths: Array.from({ length: 5 }, (_, i) => `traces/studio-es-desktop-${i + 1}.json`),
  ...overrides,
});

test('a percentile over no samples is an error, never a zero', () => {
  assert.throws(() => percentileOf([], 95), /zero samples/);
  assert.equal(percentileOf([4, 1, 3, 2, 5], 95), 5, 'nearest rank: the p95 of five samples is the largest');
  assert.equal(percentileOf([4, 1, 3, 2, 5], 50), 3);
  assert.throws(() => percentileOf([1, Number.NaN], 95), /finite/);
});

test('the cold baseline reports the p95 of five cold journeys with the method and traces retained', () => {
  assert.equal(COLD_BASELINE_JOURNEYS, 5, 'the plan asks for five cold journeys per profile');
  const summary = summarizeColdBaseline(baseline());
  assert.equal(summary.journeys, 5);
  assert.equal(summary.startupCpuP95Ms, 44);
  assert.equal(summary.longestTaskMs, 26, 'the longest task over all journeys, not an average');
  assert.equal(summary.firstLoadJsBrotliBytes, 118 * KIB);
  assert.equal(summary.criticalJsBrotliBytes, 104 * KIB, 'the scripts needed before the load event, apart from what is fetched after it');
  assert.equal(summary.profile, 'desktop');
  assert.equal(summary.tracePaths.length, 5);
});

test('a cold baseline with absent samples, profile, method or traces is rejected instead of passing', () => {
  assert.throws(() => summarizeColdBaseline(baseline({ samples: [] })), /samples/);
  assert.throws(() => summarizeColdBaseline(baseline({ samples: baseline().samples.slice(0, 4), tracePaths: baseline().tracePaths.slice(0, 4) })), /5 cold journeys/);
  for (const profile of ['', '   ', undefined]) {
    assert.throws(() => summarizeColdBaseline(baseline({ profile })), /profile/, `profile=${JSON.stringify(profile)}`);
  }
  assert.throws(() => summarizeColdBaseline(baseline({ method: '' })), /method/);
  assert.throws(() => summarizeColdBaseline(baseline({ tracePaths: [] })), /trace/);
  assert.throws(() => summarizeColdBaseline(baseline({ tracePaths: baseline().tracePaths.slice(0, 3) })), /trace/, 'one retained trace per journey');
  assert.throws(() => summarizeColdBaseline(baseline({ firstLoadJsBrotliBytes: 0 })), /first-load/);
  assert.throws(() => summarizeColdBaseline(baseline({ firstLoadJsBrotliBytes: undefined })), /first-load/);
  for (const critical of [0, -1, Number.NaN, undefined]) {
    assert.throws(() => summarizeColdBaseline(baseline({ criticalJsBrotliBytes: critical })), /critical/, `critical=${critical}`);
  }
  assert.throws(() => summarizeColdBaseline(baseline({ criticalJsBrotliBytes: 119 * KIB })), /critical.*exceed/, 'the part cannot be larger than the whole');
  for (const bad of [Number.NaN, -1, Infinity, undefined, null]) {
    assert.throws(() => summarizeColdBaseline(baseline({ samples: [{ startupCpuMs: bad, longestTaskMs: 10 }, ...baseline().samples.slice(1)] })), /startupCpuMs/, `startupCpuMs=${bad}`);
    assert.throws(() => summarizeColdBaseline(baseline({ samples: [{ startupCpuMs: 10, longestTaskMs: bad }, ...baseline().samples.slice(1)] })), /longestTaskMs/, `longestTaskMs=${bad}`);
  }
});

test('a frame interval comes only from frame timestamps, never from CPU, GPU or task durations', () => {
  const at60 = Array.from({ length: 61 }, (_, i) => i * (1000 / 60));
  const intervals = activeFrameIntervals({ source: 'frame-timestamps', timestampsMs: at60 });
  assert.equal(intervals.length, 60);
  assert.ok(intervals.every((gap) => Math.abs(gap - 1000 / 60) < 1e-9));
  // Render submit time is 0.4 ms: read as an interval it would pass the 20 ms row on any scene.
  for (const source of ['render-cpu-submit', 'gpu-timer-query', 'task-duration', 'long-task', '', undefined]) {
    assert.throws(() => activeFrameIntervals({ source, timestampsMs: at60 }), /frame-timestamps/, `source=${JSON.stringify(source)}`);
  }
});

test('frame interval evidence with absent, short or impossible timestamps is rejected', () => {
  const source = 'frame-timestamps';
  assert.throws(() => activeFrameIntervals({ source, timestampsMs: [] }), /at least two/);
  assert.throws(() => activeFrameIntervals({ source, timestampsMs: [100] }), /at least two/);
  assert.throws(() => activeFrameIntervals({ source, timestampsMs: [0, 16, Number.NaN, 48] }), /finite/);
  assert.throws(() => activeFrameIntervals({ source, timestampsMs: [0, 16, 15, 48] }), /monotonic/);
  assert.throws(() => activeFrameIntervals({ source, timestampsMs: [0, 400, 800] }), /no frame interval/, 'every gap is a pause between scroll bursts: nothing to measure');
});

test('a gap of 250 ms or more is a pause between scroll bursts, not a frame interval', () => {
  const intervals = activeFrameIntervals({ source: 'frame-timestamps', timestampsMs: [0, 16, 32, 600, 616, 632] });
  assert.deepEqual(intervals, [16, 16, 16, 16], 'the 568 ms pause is dropped, the rest kept');
  assert.deepEqual(activeFrameIntervals({ source: 'frame-timestamps', timestampsMs: [0, 100, 200, 460], maxGapMs: 120 }), [100, 100]);
});

// --- PLAN-SFC-V1 Task 3: startup cost from a Chromium trace ------------------------------------------

const MS = 1000; // trace timestamps and durations are microseconds
const DOCUMENT = 'http://127.0.0.1:3203/estudio/';
const threadName = (pid, tid, name) => ({ pid, tid, ts: 0, ph: 'M', name: 'thread_name', args: { name } });
const navigation = (pid, ts, url) => ({ pid, tid: 1, ts, ph: 'R', name: 'navigationStart', args: { data: { documentLoaderURL: url, isLoadingMainFrame: true } } });
const span = (pid, tid, name, startMs, durMs) => ({ pid, tid, ts: startMs * MS, ph: 'X', name, dur: durMs * MS });

const traceFixture = () => [
  threadName(100, 1, 'CrRendererMain'),
  threadName(100, 2, 'Compositor'),
  threadName(200, 1, 'CrRendererMain'),
  navigation(200, 500 * MS, 'about:blank'),
  navigation(100, 1000 * MS, DOCUMENT),
  span(100, 1, 'RunTask', 900, 40), // before this document's navigation: not counted
  span(100, 2, 'RunTask', 1010, 30), // compositor thread: not the main thread
  span(200, 1, 'RunTask', 1010, 30), // another renderer: not this page
  span(100, 1, 'RunTask', 1000.5, 10),
  span(100, 1, 'RunTask', 1020, 60),
  span(100, 1, 'RunTask', 1100, 5),
  span(100, 1, 'EvaluateScript', 1001, 4),
  span(100, 1, 'FunctionCall', 1002, 1), // nested inside the evaluation: counted once
  span(100, 1, 'v8.compile', 1025, 3),
  span(100, 1, 'FunctionCall', 1030, 20),
  span(100, 1, 'RunMicrotasks', 1100.5, 2),
  span(100, 1, 'Layout', 1060, 8), // main-thread work that is not script
];

test('the startup cost is the main-thread tasks and top-level script work of this document after its navigation', () => {
  const cost = mainThreadStartupCost({ events: traceFixture(), documentUrl: DOCUMENT });
  assert.equal(cost.taskCpuMs, 75, 'ten, sixty and five milliseconds on this page main thread only');
  assert.equal(cost.longestTaskMs, 60);
  assert.equal(cost.tasks, 3);
  assert.equal(cost.scriptCpuMs, 29, 'evaluation 4 + compile 3 + call 20 + microtasks 2; the nested call is not counted twice');
  assert.equal(cost.evaluationCpuMs, 7, 'script evaluation and compile only (4 + 3): the steady part, apart from calls and microtasks (hydration and scheduling)');
  assert.deepEqual([cost.pid, cost.tid], [100, 1]);
});

test('a trace that cannot be tied to the document, its main thread or any task is rejected, not read as zero', () => {
  const events = traceFixture();
  assert.throws(() => mainThreadStartupCost({ events, documentUrl: 'http://127.0.0.1:3203/other/' }), /navigationStart/);
  assert.throws(() => mainThreadStartupCost({ events: events.filter((event) => !(event.name === 'thread_name' && event.pid === 100 && event.tid === 1)), documentUrl: DOCUMENT }), /CrRendererMain/);
  assert.throws(() => mainThreadStartupCost({ events: events.filter((event) => event.name !== 'RunTask'), documentUrl: DOCUMENT }), /no main-thread tasks/);
  assert.throws(() => mainThreadStartupCost({ events: [], documentUrl: DOCUMENT }), /navigationStart/);
});

// --- PLAN-SFC-V1 Task 3: what a late frame was waiting for --------------------------------------------

test('a late frame is attributed to the render CPU, the GPU, or to neither (scheduler or presentation), and an unmeasured GPU is never read as innocent', () => {
  const frame = (t, cpuMs = 0.3, gpuMs = 4) => ({ t, cpuMs, gpuMs });
  const frames = [
    frame(0), frame(16.7), frame(50.1), // 33.4 ms gap, the frame before it was cheap: neither explains it
    frame(66.8, 0.3, 20.5), frame(100.2), // the frame before the gap took 20.5 ms on the GPU
    frame(116.9, 9), frame(150.3), // the frame before the gap spent 9 ms submitting on the CPU
    frame(167, 0.3, null), frame(200.4), // the GPU time of the frame before the gap was never measured
    frame(217.1), frame(817.1), frame(833.8), // a 600 ms pause between scroll bursts is not a frame interval
  ];
  assert.deepEqual(classifyLateFrames({ frames }), {
    intervals: 10, // twelve frames, eleven gaps, one of them the 600 ms pause
    late: 4,
    renderCpu: 1,
    gpu: 1,
    schedulerOrPresentation: 1,
    unmeasured: 1,
  });
  assert.equal(classifyLateFrames({ frames, lateMs: 40 }).late, 0, 'the lateness threshold is a parameter');
});

test('late-frame attribution rejects frames that cannot be ordered or measured', () => {
  assert.throws(() => classifyLateFrames({ frames: [{ t: 0, cpuMs: 0.3, gpuMs: 4 }] }), /at least two/);
  assert.throws(() => classifyLateFrames({ frames: [{ t: 0, cpuMs: 0.3, gpuMs: 4 }, { t: 0, cpuMs: 0.3, gpuMs: 4 }] }), /monotonic/);
  assert.throws(() => classifyLateFrames({ frames: [{ t: 0, cpuMs: Number.NaN, gpuMs: 4 }, { t: 16, cpuMs: 0.3, gpuMs: 4 }] }), /cpuMs/);
  assert.throws(() => classifyLateFrames({ frames: [{ t: 0, cpuMs: 0.3, gpuMs: -1 }, { t: 16, cpuMs: 0.3, gpuMs: 4 }] }), /gpuMs/);
});

// --- PLAN-SFC-V1 Task 14: the static release costs of the new routes against the Task 3 baseline -----------------

const staticRelease = await import('../lib/connected-studio/measurement.ts');
const { judgeStaticRouteCost, findOptionalCodeInCriticalChunks, readBaselineEntry, STATIC_ROUTE_BUDGETS } = staticRelease;

const figures = (overrides = {}) => ({
  route: 'studio',
  locale: 'es',
  profile: 'desktop',
  basePath: '/',
  journeys: 5,
  criticalJsBrotliBytes: 120 * KIB,
  firstLoadJsBrotliBytes: 150 * KIB,
  staticHtmlJsBrotliBytes: 152 * KIB,
  startupCpuP95Ms: 170,
  startupCpuSpreadMs: 60,
  longestTaskMs: 40,
  ...overrides,
});

test('the added first-load JS budgets are the plan numbers: 12 KiB Studio and Founder, 16 KiB Contact, 2 KiB legal', () => {
  assert.deepEqual({ ...STATIC_ROUTE_BUDGETS.addedJsKiB }, { studio: 12, founder: 12, contact: 16, legal: 2 });
  assert.equal(STATIC_ROUTE_BUDGETS.addedStartupCpuP95Ms, 25);
  assert.equal(STATIC_ROUTE_BUDGETS.longTaskMs, 50);
});

test('added critical and static-HTML JS inside the route budget pass and beyond it fail, each on its own row', () => {
  const baseline = figures();
  const pass = judgeStaticRouteCost({
    kind: 'studio',
    baseline,
    current: figures({ criticalJsBrotliBytes: baseline.criticalJsBrotliBytes + 12 * KIB, staticHtmlJsBrotliBytes: baseline.staticHtmlJsBrotliBytes + 12 * KIB }),
  });
  assert.equal(pass.rows.find((row) => row.metric === 'critical-js').verdict, 'PASS');
  assert.equal(pass.rows.find((row) => row.metric === 'static-html-js').verdict, 'PASS');
  const fail = judgeStaticRouteCost({
    kind: 'studio',
    baseline,
    current: figures({ criticalJsBrotliBytes: baseline.criticalJsBrotliBytes + 12 * KIB + 1, staticHtmlJsBrotliBytes: baseline.staticHtmlJsBrotliBytes + 1 }),
  });
  assert.equal(fail.rows.find((row) => row.metric === 'critical-js').verdict, 'FAIL');
  assert.equal(fail.rows.find((row) => row.metric === 'static-html-js').verdict, 'PASS');
  assert.equal(fail.verdict, 'FAIL');
  const contact = judgeStaticRouteCost({
    kind: 'contact',
    baseline: figures({ route: 'contact' }),
    current: figures({ route: 'contact', criticalJsBrotliBytes: 120 * KIB + 16 * KIB }),
  });
  assert.equal(contact.rows.find((row) => row.metric === 'critical-js').verdict, 'PASS');
  const legal = judgeStaticRouteCost({
    kind: 'legal',
    baseline: figures({ route: 'privacy' }),
    current: figures({ route: 'terms', criticalJsBrotliBytes: 120 * KIB + 2 * KIB + 1 }),
  });
  assert.equal(legal.rows.find((row) => row.metric === 'critical-js').verdict, 'FAIL');
});

test('a route that got smaller passes with a negative added figure, never a clipped zero', () => {
  const result = judgeStaticRouteCost({
    kind: 'contact',
    baseline: figures({ route: 'contact', criticalJsBrotliBytes: 126.8 * KIB }),
    current: figures({ route: 'contact', criticalJsBrotliBytes: 117 * KIB }),
  });
  const row = result.rows.find((item) => item.metric === 'critical-js');
  assert.equal(row.verdict, 'PASS');
  assert.ok(row.added < 0, `added ${row.added}`);
});

test('the startup CPU gate is PASS within 25 ms, OPEN inside the baseline own journey spread, FAIL beyond both', () => {
  const baseline = figures({ startupCpuP95Ms: 170, startupCpuSpreadMs: 60 });
  const verdict = (cpu) => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ startupCpuP95Ms: cpu }) }).rows.find((row) => row.metric === 'startup-cpu-p95');
  assert.equal(verdict(195).verdict, 'PASS', 'exactly the 25 ms allowance passes');
  assert.equal(verdict(120).verdict, 'PASS', 'a faster route passes');
  const open = verdict(230);
  assert.equal(open.verdict, 'OPEN', 'added 60 ms is within the 60 ms spread the unchanged baseline route showed: noise cannot be told from cost');
  assert.match(open.note, /spread/);
  assert.equal(verdict(260).verdict, 'FAIL', 'added 90 ms is beyond the allowance and the spread');
});

test('a long task is new only when the baseline had none of 50 ms or more', () => {
  const task = (baselineMs, currentMs) =>
    judgeStaticRouteCost({ kind: 'studio', baseline: figures({ longestTaskMs: baselineMs }), current: figures({ longestTaskMs: currentMs }) }).rows.find((row) => row.metric === 'long-task');
  assert.equal(task(40, 49.9).verdict, 'PASS');
  assert.equal(task(40, 50).verdict, 'FAIL', 'a new 50 ms task is added');
  assert.equal(task(56, 50).verdict, 'PASS', 'the baseline already had a longer task and this one is no longer');
  assert.equal(task(56, 70).verdict, 'OPEN', 'a longer long task than a baseline that already had one cannot be attributed');
  assert.equal(task(50, 55).verdict, 'OPEN', 'a baseline task of exactly 50 ms is already a long task');
  assert.equal(task(56, 56).verdict, 'PASS', 'the same long task is not an added one');
});

test('the verdict is FAIL if any row fails, OPEN if none fails and one is open, else PASS', () => {
  const baseline = figures();
  assert.equal(judgeStaticRouteCost({ kind: 'studio', baseline, current: figures() }).verdict, 'PASS');
  assert.equal(judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ startupCpuP95Ms: 235 }) }).verdict, 'OPEN');
  assert.equal(judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ startupCpuP95Ms: 235, criticalJsBrotliBytes: 200 * KIB }) }).verdict, 'FAIL');
});

test('a missing baseline, a mismatched baseline or an unmeasured value is rejected instead of judged', () => {
  const baseline = figures();
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline: undefined, current: figures() }), /baseline/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ locale: 'en' }) }), /same locale/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ profile: 'mobile' }) }), /same profile/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ basePath: '/Portfolio' }) }), /same base path/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ criticalJsBrotliBytes: Number.NaN }) }), /criticalJsBrotliBytes/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ startupCpuP95Ms: undefined }) }), /startupCpuP95Ms/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'studio', baseline, current: figures({ journeys: 4 }) }), /five cold journeys/);
  assert.throws(() => judgeStaticRouteCost({ kind: 'blog', baseline, current: figures() }), /kind/);
});

test('a Task 3 report entry becomes baseline figures with its own journey spread, and a missing entry is an error', () => {
  const report = {
    basePath: '/',
    profiles: {
      desktop: {
        routes: {
          'studio/es': {
            route: 'studio',
            locale: 'es',
            profile: 'desktop',
            basePath: '/',
            journeys: 5,
            criticalJsBrotliBytes: 120462,
            firstLoadJsBrotliBytes: 156971,
            startupCpuP95Ms: 170.4,
            longestTaskMs: 56.3,
            journeysDetail: [{ startupCpuMs: 112.9 }, { startupCpuMs: 170.4 }, { startupCpuMs: 100.2 }, { startupCpuMs: 120 }, { startupCpuMs: 111 }],
          },
        },
      },
    },
  };
  const entry = readBaselineEntry({ report, route: 'studio', locale: 'es', profile: 'desktop' });
  assert.equal(entry.criticalJsBrotliBytes, 120462);
  assert.ok(Math.abs(entry.startupCpuSpreadMs - 70.2) < 1e-9);
  assert.equal(entry.staticHtmlJsBrotliBytes, undefined);
  assert.throws(() => readBaselineEntry({ report, route: 'founder', locale: 'es', profile: 'desktop' }), /no baseline entry/);
  assert.throws(() => readBaselineEntry({ report: {}, route: 'studio', locale: 'es', profile: 'desktop' }), /no baseline entry/);
});

test('optional engine code found inside a critical chunk is reported by path, whatever its size', () => {
  const found = findOptionalCodeInCriticalChunks({
    chunks: [
      { path: 'chunks/app.js', text: 'function a(){return 1}' },
      { path: 'chunks/hidden.js', text: 'x;addEventListener("webglcontextlost",y);' },
      { path: 'chunks/renderer.js', text: 'new WebGLRenderer({})' },
    ],
  });
  assert.deepEqual(found, [
    { path: 'chunks/hidden.js', marker: 'webglcontextlost' },
    { path: 'chunks/renderer.js', marker: 'WebGLRenderer' },
  ]);
  assert.deepEqual(findOptionalCodeInCriticalChunks({ chunks: [{ path: 'chunks/app.js', text: 'ok' }] }), []);
  assert.throws(() => findOptionalCodeInCriticalChunks({ chunks: [] }), /no critical chunks/);
});

test('a page without in-page fragment links owes no fragment-link interaction, a page with them still does', () => {
  assert.deepEqual(missingInteractions({ mode: 'static', completed: ['keyboard-focus', 'scroll', 'route-link'], fragmentLink: false }), []);
  assert.deepEqual(missingInteractions({ mode: 'static', completed: ['keyboard-focus', 'scroll', 'route-link'] }), ['fragment-link']);
  assert.deepEqual(missingInteractions({ mode: 'live', completed: ['keyboard-focus', 'scroll', 'route-link'], fragmentLink: false }), ['pause', 'resume']);
});

// --- PLAN-SFC-V1 Task 14: paired, interleaved startup runs adjudicate what the committed baseline cannot ---------

const { judgePairedStartup } = await import('../lib/connected-studio/measurement.ts');
const run = (center, spread = 4) => Array.from({ length: 10 }, (_, index) => center + ((index % 5) - 2) * spread);

test('a paired startup comparison passes only when both the median and the p95 added stay inside 25 ms', () => {
  const pass = judgePairedStartup({ baseline: run(110), current: run(130) });
  assert.equal(pass.verdict, 'PASS');
  assert.ok(Math.abs(pass.addedMedianMs - 20) < 1e-9);
  assert.ok(Math.abs(pass.addedP95Ms - 20) < 1e-9);
  assert.equal(judgePairedStartup({ baseline: run(110), current: run(135) }).verdict, 'PASS', 'exactly 25 ms passes');
});

test('a paired startup comparison fails when the median and the p95 both exceed 25 ms, and is OPEN when only one does', () => {
  assert.equal(judgePairedStartup({ baseline: run(110), current: run(150) }).verdict, 'FAIL');
  // One slow current journey lifts the p95 delta but not the median delta.
  const spike = [...run(110).slice(0, 9), 200];
  const open = judgePairedStartup({ baseline: run(110), current: spike });
  assert.equal(open.verdict, 'OPEN');
  assert.match(open.note, /median|p95/);
  assert.equal(judgePairedStartup({ baseline: run(150), current: run(110) }).verdict, 'PASS', 'a faster current passes');
});

test('a paired startup comparison needs ten finite journeys per side, two interleaved rounds of five', () => {
  assert.throws(() => judgePairedStartup({ baseline: run(110).slice(0, 9), current: run(110) }), /ten/);
  assert.throws(() => judgePairedStartup({ baseline: run(110), current: [...run(110).slice(0, 9), Number.NaN] }), /finite/);
  assert.throws(() => judgePairedStartup({ baseline: undefined, current: run(110) }), /baseline/);
});

test('connected host code found in a script a policy-disabled page loads is reported, not only the engine', () => {
  const { CONNECTED_HOST_MARKERS } = staticRelease;
  assert.ok(CONNECTED_HOST_MARKERS.includes('furlanich:connected-studio'));
  const found = findOptionalCodeInCriticalChunks({
    chunks: [
      { path: 'chunks/host.js', text: 'sessionStorage.getItem("furlanich:connected-studio-paused")' },
      { path: 'chunks/diagnostics.js', text: 'window.__FURLANICH_CONNECTED__={read(){}}' },
      { path: 'chunks/app.js', text: 'plain application code' },
    ],
  });
  assert.deepEqual(found, [
    { path: 'chunks/host.js', marker: 'furlanich:connected-studio' },
    { path: 'chunks/diagnostics.js', marker: '__FURLANICH_CONNECTED' },
  ]);
});

// --- Reviewer R findings on PR #155: an unresolved or incomplete comparison must never satisfy a release gate -------

const { gateExit, collectPairedStartup } = await import('../lib/connected-studio/measurement.ts');
const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
const { tmpdir } = await import('node:os');
const pathModule = await import('node:path');

const reportOf = (profile, samplesByKey) => ({
  profiles: {
    [profile]: {
      routes: Object.fromEntries(Object.entries(samplesByKey).map(([key, samples]) => [key, { journeysDetail: samples.map((startupCpuMs) => ({ startupCpuMs })) }])),
    },
  },
});
const ATLAS_KEYS = ['studio/es', 'studio/en', 'founder/es', 'founder/en', 'contact/es', 'contact/en'];
const allKeys = (samples) => Object.fromEntries(ATLAS_KEYS.map((key) => [key, samples]));

test('a gate exits successfully only when every verdict is PASS, and an empty set is no pass', () => {
  assert.equal(gateExit(['PASS', 'PASS']).ok, true);
  assert.equal(gateExit(['PASS', 'OPEN']).ok, false, 'an unresolved row cannot satisfy a release gate');
  assert.equal(gateExit(['OPEN', 'OPEN']).ok, false);
  assert.equal(gateExit(['PASS', 'FAIL']).ok, false);
  assert.equal(gateExit([]).ok, false, 'no verdict is not a pass');
  assert.match(gateExit(['PASS', 'OPEN', 'OPEN']).message, /OPEN.*2|2.*OPEN/);
});

test('a paired set needs both rounds of both sides and every expected route and locale on both sides', () => {
  const round = (samples) => reportOf('desktop', allKeys(samples));
  const complete = { base: [round([100, 101, 102, 103, 104]), round([100, 101, 102, 103, 104])], cur: [round([110, 111, 112, 113, 114]), round([110, 111, 112, 113, 114])] };
  const collected = collectPairedStartup({ profile: 'desktop', keys: ATLAS_KEYS, reports: complete });
  assert.equal(collected['studio/es'].baseline.length, 10);
  assert.equal(collected['contact/en'].current.length, 10);
  assert.throws(() => collectPairedStartup({ profile: 'desktop', keys: ATLAS_KEYS, reports: { ...complete, cur: [complete.cur[0], undefined] } }), /current.*round 2/);
  assert.throws(() => collectPairedStartup({ profile: 'desktop', keys: ATLAS_KEYS, reports: { ...complete, base: [undefined, complete.base[1]] } }), /baseline.*round 1/);
  const withoutContactEn = reportOf('desktop', Object.fromEntries(ATLAS_KEYS.filter((key) => key !== 'contact/en').map((key) => [key, [110, 111, 112, 113, 114]])));
  assert.throws(() => collectPairedStartup({ profile: 'desktop', keys: ATLAS_KEYS, reports: { ...complete, cur: [complete.cur[0], withoutContactEn] } }), /current round 2 report has no contact\/en/);
  const short = reportOf('desktop', { ...allKeys([110, 111, 112, 113, 114]), 'studio/es': [110, 111, 112] });
  assert.throws(() => collectPairedStartup({ profile: 'desktop', keys: ATLAS_KEYS, reports: { ...complete, cur: [short, complete.cur[1]] } }), /studio\/es.*five|studio\/es.*3/);
  assert.throws(() => collectPairedStartup({ profile: 'mobile', keys: ATLAS_KEYS, reports: complete }), /mobile/);
});

const runJudgePaired = (files, extra = []) => {
  const dir = mkdtempSync(pathModule.join(tmpdir(), 'sfc-paired-'));
  try {
    for (const [name, report] of Object.entries(files)) writeFileSync(pathModule.join(dir, name), JSON.stringify(report));
    const script = fileURLToPath(new URL('./measure-connected-studio-vitals.mjs', import.meta.url));
    return spawnSync(process.execPath, [script, `--judge-paired=${dir}`, '--profile=desktop', ...extra], { encoding: 'utf8', timeout: 60_000 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
const pairedFiles = (baseSamples, currentSamples) => ({
  'base-desktop-1.json': reportOf('desktop', allKeys(baseSamples)),
  'cur-desktop-1.json': reportOf('desktop', allKeys(currentSamples)),
  'cur-desktop-2.json': reportOf('desktop', allKeys(currentSamples)),
  'base-desktop-2.json': reportOf('desktop', allKeys(baseSamples)),
});

test('the paired judge command exits zero only for a complete, all-PASS matrix', () => {
  const pass = runJudgePaired(pairedFiles([100, 100, 100, 100, 100], [105, 105, 105, 105, 105]));
  assert.equal(pass.status, 0, pass.stdout + pass.stderr);
  assert.match(pass.stdout, /"PASS":6/);
});

test('the paired judge command fails for an all-OPEN matrix instead of passing it', () => {
  // The reviewer fixture: current median +10 ms but one 200 ms journey lifts the p95 delta past the allowance.
  const open = runJudgePaired(pairedFiles([100, 100, 100, 100, 100], [110, 110, 110, 110, 200]));
  assert.match(open.stdout, /"OPEN":6/);
  assert.notEqual(open.status, 0, 'an unresolved comparison cannot satisfy a release gate');
});

test('the paired judge command fails for a FAIL matrix', () => {
  const fail = runJudgePaired(pairedFiles([100, 100, 100, 100, 100], [200, 200, 200, 200, 200]));
  assert.notEqual(fail.status, 0);
});

test('the paired judge command rejects a set with a missing round, never judging pooled values', () => {
  const files = pairedFiles([100, 100, 100, 100, 100], [105, 105, 105, 105, 105]);
  delete files['cur-desktop-2.json'];
  delete files['base-desktop-2.json'];
  const incomplete = runJudgePaired(files);
  assert.notEqual(incomplete.status, 0, incomplete.stdout);
  assert.match(incomplete.stderr, /round 2/);
  assert.doesNotMatch(incomplete.stdout, /PASS/);
});

test('the paired judge command rejects a route missing only from the current side', () => {
  const files = pairedFiles([100, 100, 100, 100, 100], [105, 105, 105, 105, 105]);
  files['cur-desktop-2.json'] = reportOf('desktop', Object.fromEntries(ATLAS_KEYS.filter((key) => key !== 'contact/en').map((key) => [key, [105, 105, 105, 105, 105]])));
  const missing = runJudgePaired(files);
  assert.notEqual(missing.status, 0, missing.stdout);
  assert.match(missing.stderr, /contact\/en/);
});

test('the paired judge command requires every declared profile unless one is chosen', () => {
  const dir = mkdtempSync(pathModule.join(tmpdir(), 'sfc-paired-'));
  try {
    for (const [name, report] of Object.entries(pairedFiles([100, 100, 100, 100, 100], [105, 105, 105, 105, 105]))) writeFileSync(pathModule.join(dir, name), JSON.stringify(report));
    const script = fileURLToPath(new URL('./measure-connected-studio-vitals.mjs', import.meta.url));
    const both = spawnSync(process.execPath, [script, `--judge-paired=${dir}`], { encoding: 'utf8', timeout: 60_000 });
    assert.notEqual(both.status, 0, 'the mobile profile has no files');
    assert.match(both.stderr, /mobile/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
