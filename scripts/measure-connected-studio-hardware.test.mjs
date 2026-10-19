// PLAN-SFC-V1 Task 15: the pure qualification layer of the hardware collector. The browser protocol itself runs by hand on
// a named device; these tests pin what a run must record to count, what a row may claim, and how runs add up to a tier
// verdict, so that a failure, an unmeasured value or a software render can never read as a pass.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { FRAME_INTERVAL_SOURCE } from '../lib/connected-studio/measurement.ts';
import { foundationRoutes } from '../lib/site-routes.ts';
import {
  HARDWARE_ROUTES,
  PROTOCOL_MINIMA,
  QUIESCENCE_LIMITS,
  REQUIRED_VALID_RUNS,
  buildDossier,
  candidateDiffProblem,
  classifyRun,
  diagnosticReasons,
  hiddenRows,
  judgeRun,
  measureHiddenWindow,
  patchedFiles,
  planBatch,
  plainChromiumArguments,
  reachabilityProblem,
  validateCollectionOptions,
  validateDeviceRecord,
} from './measure-connected-studio-hardware.mjs';

const script = fileURLToPath(new URL('./measure-connected-studio-hardware.mjs', import.meta.url));
const ROUTES = ['studio', 'founder', 'contact', 'services', 'projects'];
const LOCALES = ['es', 'en'];
const ATLAS = new Set(['studio', 'founder', 'contact']);

const desktop = () => ({ kind: 'desktop', name: 'Owner desktop, Intel Core i3-8100, 24 GB', os: 'Windows 11 Pro 10.0.26300', browser: 'Chromium', browserVersion: '153.0.8010.12', gpu: 'NVIDIA GeForce RTX 2060', refreshHz: 60, operator: 'Samuel Furlanich' });
const android = () => ({ kind: 'android', name: 'Constrained Android phone, 4 cores', os: 'Android 14', browser: 'Chrome', browserVersion: '153.0.0.0', gpu: 'Adreno 610', refreshHz: 60, operator: 'Samuel Furlanich' });

let startCounter = 0;

/** A complete, valid, passing run. Every test below starts here and breaks exactly one thing. */
function goodRun({ tier = 'wide', route = 'studio', locale = 'es', n = 1 } = {}) {
  const wide = tier === 'wide';
  const atlas = ATLAS.has(route);
  return {
    schemaVersion: 1,
    kind: 'sfc-hardware-run',
    runId: `${tier}-${route}-${locale}-${n}`,
    tier,
    route,
    locale,
    startedAt: new Date(Date.UTC(2026, 9, 18, 12, 0, 0) + startCounter++ * 60_000).toISOString(),
    device: wide ? desktop() : android(),
    detected: { controlsAndroidOverCdp: !wide, hostPlatform: 'win32 10.0.26300', cpu: 'Intel(R) Core(TM) i3-8100 CPU @ 3.60GHz', browserVersion: '153.0.8010.12' },
    remote: wide
      ? { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', platform: 'Win32', maxTouchPoints: 0 }
      : { userAgent: 'Mozilla/5.0 (Linux; Android 14; Phone) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36', platform: 'Linux armv8l', maxTouchPoints: 5 },
    build: { head: '5d0b3a70a86c8cc71a3a60f9330f3b5a58b562c6', candidate: 'runtime', patchSha256: 'a'.repeat(64), basePath: '/', method: 'node scripts/measure-connected-studio-hardware.mjs' },
    protocol: { ...PROTOCOL_MINIMA, headed: true, hiddenMethod: 'window-minimized', diagnostic: false },
    machine: { cpuBusyBefore: 0.06, cpuBusyAfter: 0.08, gpuUtilizationBefore: wide ? 0.02 : null, gpuUtilizationAfter: wide ? 0.03 : null },
    renderer: wide ? 'ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 Direct3D11 vs_5_0 ps_5_0)' : 'Adreno (TM) 610',
    liveWithoutOverride: true,
    setsTestHook: false,
    forcesSoftwareRenderer: false,
    frameIntervalSource: FRAME_INTERVAL_SOURCE,
    samples: { activeRenders: 900, intervalsMeasured: 850, gpuTimedFrames: 880, layoutShiftObserved: true, lcpObserved: true, eventTimingObserved: true },
    metrics: {
      activeIntervalP95Ms: 17.2,
      renderCpuP95Ms: 0.4,
      renderGpuP95Ms: 6.1,
      interactionTaskMaxMs: 0,
      drawCallsMax: wide ? 12 : 9,
      pixelRatio: wide ? 1 : 1.25,
      ambientFps: atlas ? 0 : wide ? 20.7 : 14,
      pausedDraws: 0,
      pausedRafCalls: 0,
      hiddenDraws: 0,
      hiddenRafCalls: 0,
      footerDraws: 0,
      footerRafCalls: 0,
      maxContexts: 1,
      listenerGrowth: 0,
      closureBrotliKiB: 119.5,
      lcpMs: 900,
      inpMs: 56,
      clsEnhancement: 0,
      ...(atlas ? { restDraws: 0, restRafCalls: 0, settledTailDraws: 0, settledTailRafCalls: 0 } : {}),
      sustainedActiveIntervalP95Ms: 17.5,
      sustainedTaskMaxMs: 0,
      sustainedContexts: 1,
      labelViolations: 0,
      resumeFailures: 0,
      routeCycleFailures: 0,
    },
    failures: [],
  };
}

const fullSet = (tier, { perPair = REQUIRED_VALID_RUNS } = {}) =>
  ROUTES.flatMap((route) => LOCALES.flatMap((locale) => Array.from({ length: perPair }, (_, i) => goodRun({ tier, route, locale, n: i + 1 }))));

test('the five connected route pairs are declared once, from the site routes, with their Pause slots', () => {
  assert.deepEqual(Object.keys(HARDWARE_ROUTES).sort(), [...ROUTES].sort());
  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      assert.equal(HARDWARE_ROUTES[route][locale].pathname, foundationRoutes[route][locale], `${route}/${locale} pathname`);
      assert.equal(HARDWARE_ROUTES[route].pauseSlot, `connected-pause-${route}`);
    }
    assert.equal(HARDWARE_ROUTES[route].atlas, ATLAS.has(route), `${route} sleeps at rest only when it is an Atlas page`);
  }
});

test('a device record needs every name the plan asks for, and the tier needs its own kind of device', () => {
  assert.deepEqual(validateDeviceRecord(desktop(), 'wide'), { ok: true, problems: [] });
  assert.deepEqual(validateDeviceRecord(android(), 'compact'), { ok: true, problems: [] });
  const missing = validateDeviceRecord({ ...desktop(), gpu: '', refreshHz: undefined }, 'wide');
  assert.equal(missing.ok, false);
  assert.ok(missing.problems.some((p) => /gpu/.test(p)), missing.problems.join('|'));
  assert.ok(missing.problems.some((p) => /refreshHz/.test(p)), missing.problems.join('|'));
  const substitute = validateDeviceRecord(desktop(), 'compact');
  assert.equal(substitute.ok, false, 'a desktop never stands in for the constrained Android phone');
  assert.ok(substitute.problems.some((p) => /android/i.test(p)));
  assert.equal(validateDeviceRecord(android(), 'wide').ok, false, 'a phone does not qualify the wide tier');
});

test('a clean run is valid', () => {
  assert.deepEqual(classifyRun(goodRun()), { valid: true, reasons: [] });
});

for (const [label, change, pattern] of [
  ['a software renderer', (run) => { run.renderer = 'Google SwiftShader'; }, /software/i],
  ['an absent renderer', (run) => { run.renderer = null; }, /renderer/i],
  ['a page that did not go live by itself', (run) => { run.liveWithoutOverride = false; }, /live/i],
  ['a connected test hook', (run) => { run.setsTestHook = true; }, /hook/i],
  ['a forced software renderer', (run) => { run.forcesSoftwareRenderer = true; }, /software/i],
  ['a frame interval taken from CPU submit time', (run) => { run.frameIntervalSource = 'cpu-submit-time'; }, /interval/i],
  ['zero active renders', (run) => { run.samples.activeRenders = 0; }, /sample/i],
  ['zero measured intervals', (run) => { run.samples.intervalsMeasured = 0; }, /sample/i],
  ['an idle window shorter than the protocol', (run) => { run.protocol.idleSeconds = PROTOCOL_MINIMA.idleSeconds - 1; }, /idle/i],
  ['fewer traversals than the protocol', (run) => { run.protocol.traversals = PROTOCOL_MINIMA.traversals - 1; }, /traversal/i],
  ['a sustained window shorter than the protocol', (run) => { run.protocol.sustainedSeconds = PROTOCOL_MINIMA.sustainedSeconds - 1; }, /sustained/i],
  ['fewer route cycles than the protocol', (run) => { run.protocol.routeCycles = PROTOCOL_MINIMA.routeCycles - 1; }, /cycle/i],
  ['an incomplete device record', (run) => { run.device.os = ''; }, /device/i],
  ['no head', (run) => { run.build.head = 'main'; }, /head/i],
  ['no patch hash', (run) => { run.build.patchSha256 = ''; }, /patch/i],
  ['a machine that was busy before the run', (run) => { run.machine.cpuBusyBefore = QUIESCENCE_LIMITS.cpuBusy + 0.01; }, /busy|quiescen/i],
  ['a machine that was busy after the run', (run) => { run.machine.cpuBusyAfter = QUIESCENCE_LIMITS.cpuBusy + 0.01; }, /busy|quiescen/i],
  ['a GPU that was in use by something else', (run) => { run.machine.gpuUtilizationBefore = QUIESCENCE_LIMITS.gpuUtilization + 0.01; }, /gpu/i],
  ['no machine load record', (run) => { delete run.machine; }, /quiescen|machine/i],
  ['a failure recorded by the run itself', (run) => { run.failures = ['the run stopped: timeout']; }, /failure|stopped/i],
]) {
  test(`${label} makes the run invalid, not a pass and not a fail`, () => {
    const run = goodRun();
    change(run);
    const verdict = classifyRun(run);
    assert.equal(verdict.valid, false);
    assert.ok(verdict.reasons.some((reason) => pattern.test(reason)), verdict.reasons.join('|'));
  });
}

test('a GPU that cannot be queried is recorded as such and does not by itself invalidate a run', () => {
  const run = goodRun();
  run.machine.gpuUtilizationBefore = null;
  assert.deepEqual(classifyRun(run), { valid: true, reasons: [] });
});

test('a phone run recorded on a desktop device is invalid for the compact tier', () => {
  const run = goodRun({ tier: 'compact' });
  run.device = desktop();
  const verdict = classifyRun(run);
  assert.equal(verdict.valid, false);
  assert.ok(verdict.reasons.some((reason) => /android/i.test(reason)));
});

test('a clean run passes every row, and form focus and busy states are recorded as not applicable, not as a pass', () => {
  const judged = judgeRun(goodRun());
  assert.equal(judged.verdict, 'PASS');
  assert.ok(Object.values(judged.rows).every((row) => row.verdict === 'PASS'));
  assert.equal(judged.notApplicable.length, 1);
  assert.match(judged.notApplicable[0].item, /form/i);
  assert.match(judged.notApplicable[0].reason, /ADR-CONTACT-DIRECT-CHANNELS/);
  assert.equal('formFocusBusy' in judged.rows, false, 'no row stands in for a surface that does not exist');
});

test('only an Atlas page owes a settled rest with zero draws', () => {
  assert.ok('restDraws' in judgeRun(goodRun({ route: 'founder' })).rows);
  assert.equal('restDraws' in judgeRun(goodRun({ route: 'services' })).rows, false);
  const noRest = goodRun({ route: 'studio' });
  delete noRest.metrics.restDraws;
  const judged = judgeRun(noRest);
  assert.equal(judged.rows.restDraws.verdict, 'OPEN');
  assert.equal(judged.verdict, 'OPEN');
  const drawing = goodRun({ route: 'contact' });
  drawing.metrics.restDraws = 3;
  assert.equal(judgeRun(drawing).rows.restDraws.verdict, 'FAIL');
});

for (const [metric, value, verdict] of [
  ['activeIntervalP95Ms', 20.01, 'FAIL'],
  ['activeIntervalP95Ms', 20, 'PASS'],
  ['interactionTaskMaxMs', 50, 'FAIL'],
  ['closureBrotliKiB', 120.01, 'FAIL'],
  ['closureBrotliKiB', 120, 'PASS'],
  ['lcpMs', 2501, 'FAIL'],
  ['inpMs', 201, 'FAIL'],
  ['clsEnhancement', 0.0001, 'FAIL'],
  ['sustainedActiveIntervalP95Ms', 20.5, 'FAIL'],
  ['sustainedTaskMaxMs', 50, 'FAIL'],
  ['pausedDraws', 1, 'FAIL'],
  ['hiddenDraws', 1, 'FAIL'],
  ['footerDraws', 1, 'FAIL'],
  ['listenerGrowth', 3, 'FAIL'],
  ['hiddenRafCalls', 1000, 'FAIL'],
  ['footerRafCalls', 1000, 'FAIL'],
  ['labelViolations', 1, 'FAIL'],
  ['resumeFailures', 1, 'FAIL'],
  ['routeCycleFailures', 1, 'FAIL'],
]) {
  test(`${metric} = ${value} is ${verdict}`, () => {
    const run = goodRun();
    run.metrics[metric] = value;
    assert.equal(judgeRun(run).rows[metric].verdict, verdict);
  });
}

test('the compact tier uses the compact draw and pixel-ratio limits', () => {
  const run = goodRun({ tier: 'compact' });
  run.metrics.drawCallsMax = 19;
  run.metrics.pixelRatio = 1.26;
  const rows = judgeRun(run).rows;
  assert.equal(rows.drawCallsMax.verdict, 'FAIL');
  assert.equal(rows.pixelRatio.verdict, 'FAIL');
  assert.equal(judgeRun(goodRun({ tier: 'wide' })).rows.drawCallsMax.limit, 28);
});

test('an unmeasured metric is OPEN, never a passing zero', () => {
  for (const metric of Object.keys(goodRun().metrics)) {
    const run = goodRun();
    run.metrics[metric] = null;
    const judged = judgeRun(run);
    assert.equal(judged.rows[metric].verdict, 'OPEN', `${metric} null`);
    assert.equal(judged.verdict, 'OPEN', `${metric} null leaves the run OPEN`);
  }
});

test('a zero layout shift only counts when the observer actually ran', () => {
  const run = goodRun();
  run.samples.layoutShiftObserved = false;
  run.metrics.clsEnhancement = 0;
  assert.equal(judgeRun(run).rows.clsEnhancement.verdict, 'OPEN');
  const lcp = goodRun();
  lcp.samples.lcpObserved = false;
  assert.equal(judgeRun(lcp).rows.lcpMs.verdict, 'OPEN');
  const inp = goodRun();
  inp.samples.eventTimingObserved = false;
  assert.equal(judgeRun(inp).rows.inpMs.verdict, 'OPEN');
});

test('a failing row beats an unmeasured one in the run verdict', () => {
  const run = goodRun();
  run.metrics.activeIntervalP95Ms = 33;
  run.metrics.hiddenDraws = null;
  assert.equal(judgeRun(run).verdict, 'FAIL');
});

test('a tier passes only when all ten route and locale pairs have enough valid passing runs', () => {
  const dossier = buildDossier({ tier: 'wide', runs: fullSet('wide') });
  assert.equal(dossier.verdict, 'PASS');
  assert.equal(Object.keys(dossier.pairs).length, 10);
  for (const pair of Object.values(dossier.pairs)) {
    assert.equal(pair.validRuns, REQUIRED_VALID_RUNS);
    assert.equal(pair.verdict, 'PASS');
  }
});

test('two valid runs on a pair leave the tier OPEN', () => {
  const runs = fullSet('wide').filter((run) => !(run.route === 'founder' && run.locale === 'en' && run.runId.endsWith('-3')));
  const dossier = buildDossier({ tier: 'wide', runs });
  assert.equal(dossier.verdict, 'OPEN');
  assert.equal(dossier.pairs['founder/en'].validRuns, 2);
  assert.equal(dossier.pairs['founder/en'].verdict, 'OPEN');
});

test('a pair with no runs at all is named and leaves the tier OPEN', () => {
  const runs = fullSet('wide').filter((run) => !(run.route === 'contact' && run.locale === 'es'));
  const dossier = buildDossier({ tier: 'wide', runs });
  assert.equal(dossier.verdict, 'OPEN');
  assert.equal(dossier.pairs['contact/es'].validRuns, 0);
  assert.deepEqual(dossier.missingPairs, ['contact/es']);
});

test('one failing valid run fails its pair and the tier, even beside passing runs: no cherry-picking', () => {
  const runs = fullSet('wide', { perPair: 4 });
  const bad = runs.find((run) => run.route === 'studio' && run.locale === 'en' && run.runId.endsWith('-4'));
  bad.metrics.activeIntervalP95Ms = 33.3;
  const dossier = buildDossier({ tier: 'wide', runs });
  assert.equal(dossier.pairs['studio/en'].validRuns, 4);
  assert.equal(dossier.pairs['studio/en'].verdict, 'FAIL');
  assert.equal(dossier.verdict, 'FAIL');
  assert.ok(dossier.pairs['studio/en'].runs.some((run) => run.runId === bad.runId && run.verdict === 'FAIL'), 'the failing run stays in the dossier');
});

test('invalid runs are kept with their reasons and never count toward the three', () => {
  const runs = fullSet('wide');
  const swiftShader = runs.find((run) => run.route === 'projects' && run.locale === 'es' && run.runId.endsWith('-1'));
  swiftShader.renderer = 'Google SwiftShader';
  const dossier = buildDossier({ tier: 'wide', runs });
  assert.equal(dossier.pairs['projects/es'].validRuns, 2);
  assert.equal(dossier.pairs['projects/es'].invalidRuns, 1);
  assert.equal(dossier.pairs['projects/es'].verdict, 'OPEN');
  const invalid = dossier.pairs['projects/es'].runs.find((run) => run.runId === swiftShader.runId);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.reasons.some((reason) => /software/i.test(reason)));
  assert.equal(dossier.verdict, 'OPEN');
});

test('an invalid run that would have failed cannot hide a failure, and one that would have passed cannot supply a pass', () => {
  const runs = fullSet('wide', { perPair: 2 });
  for (const n of [3, 4, 5]) {
    const run = goodRun({ route: 'studio', locale: 'es', n });
    run.renderer = 'llvmpipe';
    runs.push(run);
  }
  assert.equal(buildDossier({ tier: 'wide', runs }).pairs['studio/es'].verdict, 'OPEN');
});

test('runs of the other tier are ignored by this tier', () => {
  const dossier = buildDossier({ tier: 'compact', runs: fullSet('wide') });
  assert.equal(dossier.verdict, 'OPEN');
  assert.equal(Object.values(dossier.pairs).every((pair) => pair.validRuns === 0), true);
});

test('an OPEN valid run keeps its pair OPEN even with three of them', () => {
  const runs = fullSet('wide');
  const open = runs.find((run) => run.route === 'founder' && run.locale === 'es' && run.runId.endsWith('-2'));
  open.metrics.hiddenDraws = null;
  const dossier = buildDossier({ tier: 'wide', runs });
  assert.equal(dossier.pairs['founder/es'].validRuns, 3);
  assert.equal(dossier.pairs['founder/es'].verdict, 'OPEN');
  assert.equal(dossier.verdict, 'OPEN');
});

test('--qualify exits 0 only for a PASS tier; OPEN and FAIL exit 1 and still print the dossier', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sfc-hw-'));
  try {
    const write = (runs) => {
      for (const file of runs) writeFileSync(path.join(dir, `${file.runId}.json`), JSON.stringify(file));
    };
    const run = (...args) => spawnSync(process.execPath, [script, `--qualify=${dir}`, '--tier=wide', ...args], { encoding: 'utf8' });
    write(fullSet('wide'));
    const pass = run();
    assert.equal(pass.status, 0, pass.stderr + pass.stdout);
    assert.match(pass.stdout, /"verdict": "PASS"/);
    const bad = goodRun({ route: 'studio', locale: 'es', n: 9 });
    bad.metrics.activeIntervalP95Ms = 40;
    write([bad]);
    const fail = run();
    assert.equal(fail.status, 1);
    assert.match(fail.stdout, /"verdict": "FAIL"/);
    rmSync(dir, { recursive: true });
    const empty = mkdtempSync(path.join(tmpdir(), 'sfc-hw-'));
    const none = spawnSync(process.execPath, [script, `--qualify=${empty}`, '--tier=wide'], { encoding: 'utf8' });
    rmSync(empty, { recursive: true });
    assert.equal(none.status, 1, 'no runs at all is OPEN, not a pass');
    assert.match(none.stdout, /"verdict": "OPEN"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---- Reviewer R corrections on PR #156 ----

test('R1: a GPU in use after the run invalidates it, at the boundary and beyond; an unqueryable GPU after the run does not', () => {
  const after = goodRun();
  after.machine.gpuUtilizationAfter = 1;
  const verdict = classifyRun(after);
  assert.equal(verdict.valid, false);
  assert.ok(verdict.reasons.some((reason) => /gpu/i.test(reason) && /after/i.test(reason)), verdict.reasons.join('|'));
  const edge = goodRun();
  edge.machine.gpuUtilizationAfter = QUIESCENCE_LIMITS.gpuUtilization;
  assert.equal(classifyRun(edge).valid, true, 'exactly the limit is quiet enough');
  const unqueryable = goodRun();
  unqueryable.machine.gpuUtilizationAfter = null;
  assert.equal(classifyRun(unqueryable).valid, true);
});

test('R2: a diagnostic run is retained but never counts', () => {
  for (const argv of [['--trace-pipeline=t.json'], ['--frames-out=f.json'], ['--no-gpu-timers'], ['--diagnostic']]) {
    assert.ok(diagnosticReasons(argv).length > 0, argv.join(' '));
  }
  assert.deepEqual(diagnosticReasons(['--route=studio', '--locale=es', '--tier=wide', '--headed', '--extras']), []);
  const flagged = goodRun();
  flagged.protocol.diagnostic = true;
  assert.ok(classifyRun(flagged).reasons.some((reason) => /diagnostic/i.test(reason)));
  const unflagged = goodRun();
  delete unflagged.protocol.diagnostic;
  assert.ok(classifyRun(unflagged).reasons.some((reason) => /diagnostic/i.test(reason)), 'a report that does not say it is not a diagnostic is not trusted');
  const traced = goodRun();
  traced.build.method += ' --trace-pipeline=trace.json';
  assert.ok(classifyRun(traced).reasons.some((reason) => /diagnostic|trace/i.test(reason)), 'the method line alone also gives it away');
});

test('R3: a tier is qualified for one build and device cohort, never across several', () => {
  const runs = fullSet('wide');
  runs.forEach((run, index) => {
    const variant = index % 3;
    run.build.head = String(variant + 1).repeat(40);
    run.build.patchSha256 = String(variant + 4).repeat(64);
    run.device.name = `${run.device.name} #${variant}`;
  });
  const mixed = buildDossier({ tier: 'wide', runs });
  assert.notEqual(mixed.verdict, 'PASS', 'three different builds never add up to three runs');
  assert.ok(mixed.cohorts.length > 1);
  assert.equal(mixed.needsCohort, true);
  assert.deepEqual(mixed.pairs, {}, 'nothing is aggregated across cohorts');
});

test('R3: an explicit cohort counts only its own runs, keeps the others as excluded, and is named in the dossier', () => {
  const fresh = fullSet('wide');
  const stale = fullSet('wide').map((run) => {
    run.build.head = 'b'.repeat(40);
    run.metrics.activeIntervalP95Ms = 33;
    run.runId = `old-${run.runId}`;
    return run;
  });
  const cohort = { head: fresh[0].build.head, patchSha256: fresh[0].build.patchSha256, basePath: '/', deviceName: fresh[0].device.name };
  const dossier = buildDossier({ tier: 'wide', runs: [...stale, ...fresh], cohort });
  assert.equal(dossier.verdict, 'PASS', 'older failing data does not poison the repaired build');
  assert.deepEqual(dossier.cohort, { ...cohort, device: { name: fresh[0].device.name, os: fresh[0].device.os, gpu: fresh[0].device.gpu, browser: fresh[0].device.browser, browserVersion: fresh[0].device.browserVersion } });
  assert.equal(dossier.excludedRuns.length, stale.length);
  assert.match(dossier.excludedRuns[0].reason, /cohort/i);
});

test('R3: a single cohort among the runs is adopted and named without being asked for', () => {
  const dossier = buildDossier({ tier: 'wide', runs: fullSet('wide') });
  assert.equal(dossier.verdict, 'PASS');
  assert.equal(dossier.cohort.head, '5d0b3a70a86c8cc71a3a60f9330f3b5a58b562c6');
  assert.equal(dossier.cohort.device.name, desktop().name);
});

test('R4: copies of one report never add up to three runs', () => {
  const clones = fullSet('wide', { perPair: 1 }).flatMap((run) => [run, structuredClone(run), structuredClone(run)]);
  const dossier = buildDossier({ tier: 'wide', runs: clones });
  assert.notEqual(dossier.verdict, 'PASS');
  for (const pair of Object.values(dossier.pairs)) {
    assert.equal(pair.validRuns, 1);
    assert.ok(pair.runs.filter((run) => !run.valid).every((run) => run.reasons.some((reason) => /duplicate/i.test(reason))));
  }
});

test('R4: reports that share a run id but differ are all rejected', () => {
  const runs = fullSet('wide', { perPair: 2 });
  const a = goodRun({ route: 'studio', locale: 'es', n: 9 });
  const b = goodRun({ route: 'studio', locale: 'es', n: 9 });
  b.metrics.activeIntervalP95Ms = 12;
  a.runId = 'shared-id';
  b.runId = 'shared-id';
  const dossier = buildDossier({ tier: 'wide', runs: [...runs, a, b] });
  const shared = dossier.pairs['studio/es'].runs.filter((run) => run.runId === 'shared-id');
  assert.equal(shared.length, 2);
  assert.ok(shared.every((run) => !run.valid && run.reasons.some((reason) => /conflict/i.test(reason))));
  assert.equal(dossier.pairs['studio/es'].validRuns, 2);
});

test('R4: a run needs its own identity and start time, and two runs of one pair cannot start at the same instant', () => {
  const noId = goodRun();
  noId.runId = '';
  assert.ok(classifyRun(noId).reasons.some((reason) => /run id/i.test(reason)));
  const noStart = goodRun();
  noStart.startedAt = 'yesterday';
  assert.ok(classifyRun(noStart).reasons.some((reason) => /start/i.test(reason)));
  const runs = fullSet('wide', { perPair: 2 });
  const twin = goodRun({ route: 'studio', locale: 'es', n: 3 });
  twin.startedAt = runs.find((run) => run.route === 'studio' && run.locale === 'es').startedAt;
  const dossier = buildDossier({ tier: 'wide', runs: [...runs, twin] });
  assert.equal(dossier.pairs['studio/es'].validRuns, 2);
  assert.ok(dossier.pairs['studio/es'].runs.some((run) => !run.valid && run.reasons.some((reason) => /same start|duplicate/i.test(reason))));
});

test('R5: compact evidence must come from an Android target reached over CDP, and wide evidence must not', () => {
  const desktopCompact = goodRun({ tier: 'compact' });
  desktopCompact.detected.controlsAndroidOverCdp = false;
  assert.ok(classifyRun(desktopCompact).reasons.some((reason) => /android/i.test(reason)));
  const notAndroid = goodRun({ tier: 'compact' });
  notAndroid.remote.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/153.0.0.0';
  assert.ok(classifyRun(notAndroid).reasons.some((reason) => /android/i.test(reason)));
  const noTouch = goodRun({ tier: 'compact' });
  noTouch.remote.maxTouchPoints = 0;
  assert.ok(classifyRun(noTouch).reasons.some((reason) => /touch/i.test(reason)));
  const missing = goodRun({ tier: 'compact' });
  delete missing.remote;
  assert.ok(classifyRun(missing).reasons.some((reason) => /remote/i.test(reason)));
  const phoneOnWide = goodRun({ tier: 'wide' });
  phoneOnWide.detected.controlsAndroidOverCdp = true;
  assert.ok(classifyRun(phoneOnWide).reasons.some((reason) => /desktop|android/i.test(reason)));
  assert.equal(classifyRun(goodRun({ tier: 'compact' })).valid, true);
});

test('R5/R6: the collection options refuse a desktop compact run and an Android run that cannot be served', () => {
  const problems = (options) => validateCollectionOptions({ tier: 'wide', connectCdp: undefined, servePort: undefined, diagnostic: false, ...options });
  assert.deepEqual(problems({}), []);
  assert.ok(problems({ tier: 'compact' }).some((p) => /android|--connect-cdp/i.test(p)), 'compact without a phone');
  assert.deepEqual(problems({ tier: 'compact', diagnostic: true }), [], 'a desktop compact viewport is allowed only as a diagnostic');
  assert.ok(problems({ tier: 'compact', connectCdp: 'http://127.0.0.1:9222' }).some((p) => /--serve-port/.test(p)), 'the phone needs a fixed port to reverse');
  assert.deepEqual(problems({ tier: 'compact', connectCdp: 'http://127.0.0.1:9222', servePort: 3515 }), []);
  assert.ok(problems({ tier: 'wide', connectCdp: 'http://127.0.0.1:9222', servePort: 3515 }).some((p) => /wide|desktop/i.test(p)));
  assert.ok(problems({ servePort: 70000 }).some((p) => /port/i.test(p)));
});

test('R6: a phone that cannot fetch the export is caught before the long protocol', () => {
  assert.equal(reachabilityProblem({ status: 200, body: '<script src="/_next/static/chunks/a.js"></script>' }), null);
  assert.match(reachabilityProblem({ status: 404, body: '' }), /404|reach/i);
  assert.match(reachabilityProblem({ status: 200, body: '<html>captive portal</html>' }), /_next|export/i);
  assert.match(reachabilityProblem({ error: 'Failed to fetch' }), /adb reverse|reach/i);
});

test('R7: callbacks in the quiet states are rows of their own, and an Atlas page owes them at rest and after an input tail', () => {
  const atlas = judgeRun(goodRun({ route: 'contact' })).rows;
  for (const key of ['restRafCalls', 'settledTailDraws', 'settledTailRafCalls', 'hiddenRafCalls', 'footerRafCalls']) assert.ok(key in atlas, key);
  const legacy = judgeRun(goodRun({ route: 'services' })).rows;
  assert.ok('hiddenRafCalls' in legacy && 'footerRafCalls' in legacy);
  for (const key of ['restRafCalls', 'settledTailDraws', 'settledTailRafCalls']) assert.equal(key in legacy, false, `${key} belongs to a sleeping page`);
  const spinning = goodRun({ route: 'studio' });
  Object.assign(spinning.metrics, { restRafCalls: 1000, settledTailRafCalls: 1000 });
  const judged = judgeRun(spinning);
  assert.equal(judged.rows.restRafCalls.verdict, 'FAIL');
  assert.equal(judged.rows.settledTailRafCalls.verdict, 'FAIL');
  assert.equal(judged.verdict, 'FAIL', 'a loop that schedules without drawing cannot qualify');
  const absent = goodRun({ route: 'studio' });
  delete absent.metrics.footerRafCalls;
  assert.equal(judgeRun(absent).rows.footerRafCalls.verdict, 'OPEN');
});

test('--qualify refuses copies and mixed cohorts at the command line, and takes the cohort from flags', () => {
  const qualifyIn = (runs, ...args) => {
    const dir = mkdtempSync(path.join(tmpdir(), 'sfc-hw-'));
    try {
      runs.forEach(([name, run]) => writeFileSync(path.join(dir, name), JSON.stringify(run)));
      return spawnSync(process.execPath, [script, `--qualify=${dir}`, '--tier=wide', ...args], { encoding: 'utf8' });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };
  const copies = qualifyIn(fullSet('wide', { perPair: 1 }).flatMap((run) => [1, 2, 3].map((copy) => [`${run.runId}-copy${copy}.json`, run])));
  assert.equal(copies.status, 1, copies.stdout);
  assert.doesNotMatch(copies.stdout, /^ {2}"verdict": "PASS"/m);
  const fresh = fullSet('wide');
  const other = fullSet('wide').map((run) => ({ ...run, build: { ...run.build, head: 'c'.repeat(40) }, runId: `x-${run.runId}` }));
  const mixed = [...fresh, ...other].map((run) => [`${run.runId}.json`, run]);
  const unchosen = qualifyIn(mixed);
  assert.equal(unchosen.status, 1);
  assert.match(unchosen.stdout, /"needsCohort": true/);
  const chosen = qualifyIn(mixed, `--head=${fresh[0].build.head}`);
  assert.equal(chosen.status, 0, chosen.stderr + chosen.stdout);
});

// ---- Wide-tier collection on released main: a real hidden window and an unattended batch ----

const LIVE_PATCH = [
  'diff --git a/components/connected-studio/atlas-live-host.tsx b/components/connected-studio/atlas-live-host.tsx',
  '--- a/components/connected-studio/atlas-live-host.tsx',
  '+++ b/components/connected-studio/atlas-live-host.tsx',
  '@@ -1 +1 @@',
  'diff --git a/lib/connected-studio/capability.ts b/lib/connected-studio/capability.ts',
  '--- a/lib/connected-studio/capability.ts',
  '+++ b/lib/connected-studio/capability.ts',
  '@@ -1 +1 @@',
].join('\n');

test('C1: the candidate may change exactly the files its applied patch names, since Task 16 also attaches the live host', () => {
  assert.deepEqual(patchedFiles(LIVE_PATCH), ['components/connected-studio/atlas-live-host.tsx', 'lib/connected-studio/capability.ts']);
  const expected = patchedFiles(LIVE_PATCH);
  assert.equal(candidateDiffProblem({ changed: ['lib/connected-studio/capability.ts', 'components/connected-studio/atlas-live-host.tsx'], expected }), null);
  assert.match(candidateDiffProblem({ changed: ['lib/connected-studio/capability.ts'], expected }), /atlas-live-host\.tsx/);
  assert.match(candidateDiffProblem({ changed: [...expected, 'scripts/measure-connected-studio-hardware.mjs'], expected }), /measure-connected-studio-hardware\.mjs/);
  assert.match(candidateDiffProblem({ changed: [], expected }), /nothing/);
  assert.match(candidateDiffProblem({ changed: expected, expected: [] }), /no patch/);
});

test('H1: the hidden window is read from the page log, starting 100 ms after it hid and ending when it showed again', () => {
  const frames = [500, 900, 1050, 5000, 9000, 11500].map((t) => ({ t }));
  const rafLog = [800, 950, 1080, 6000, 11600];
  const visibility = [[1000, 'hidden'], [11000, 'visible']];
  assert.deepEqual(measureHiddenWindow({ visibility, frames, rafLog }), { hiddenMs: 10000, draws: 2, rafCalls: 1, drawsBefore: 2 });
});

test('H1: a page that never hid, or never showed again, has no hidden window', () => {
  assert.equal(measureHiddenWindow({ visibility: [], frames: [{ t: 1 }], rafLog: [1] }), null);
  assert.equal(measureHiddenWindow({ visibility: [[10, 'visible']], frames: [], rafLog: [] }), null);
  assert.equal(measureHiddenWindow({ visibility: [[1000, 'hidden']], frames: [], rafLog: [] }), null);
});

test('H2: the hidden rows are measured only over a window of at least 4 s on a scene that was drawing when it hid', () => {
  assert.deepEqual(hiddenRows({ hiddenMs: 10000, draws: 0, rafCalls: 0, drawsBefore: 6 }), { hiddenDraws: 0, hiddenRafCalls: 0 });
  assert.deepEqual(hiddenRows({ hiddenMs: 10000, draws: 3, rafCalls: 4, drawsBefore: 6 }), { hiddenDraws: 3, hiddenRafCalls: 4 });
  assert.deepEqual(hiddenRows({ hiddenMs: 3999, draws: 0, rafCalls: 0, drawsBefore: 6 }), { hiddenDraws: null, hiddenRafCalls: null }, 'too short a window proves nothing');
  assert.deepEqual(hiddenRows({ hiddenMs: 10000, draws: 0, rafCalls: 0, drawsBefore: 0 }), { hiddenDraws: null, hiddenRafCalls: null }, 'a scene that was already still cannot show that hiding stopped it');
  assert.deepEqual(hiddenRows(null), { hiddenDraws: null, hiddenRafCalls: null });
});

test('H3: the hidden-window browser is the plain executable with no automation or anti-backgrounding switch', () => {
  const args = plainChromiumArguments({ userDataDir: 'C:/tmp/profile', width: 1440, height: 900 });
  for (const expected of ['--remote-debugging-port=0', '--user-data-dir=C:/tmp/profile', '--window-size=1440,900', '--no-first-run']) assert.ok(args.includes(expected), expected);
  for (const forbidden of [/^--enable-automation/, /^--headless/, /backgrounding/, /background-timer-throttling/, /occlu/, /^--use-gl=swiftshader/, /^--disable-gpu/]) {
    assert.ok(!args.some((arg) => forbidden.test(arg)), `no argument matches ${forbidden}`);
  }
});

const COHORT = { head: '5d0b3a70a86c8cc71a3a60f9330f3b5a58b562c6', patchSha256: 'a'.repeat(64), basePath: '/', deviceName: desktop().name };

test('B1: an empty runs directory schedules the first pair, three runs per pair for all ten pairs', () => {
  const plan = planBatch({ tier: 'wide', runs: [], cohort: COHORT });
  assert.deepEqual(plan.next, { route: 'studio', locale: 'es', runId: 'wide-studio-es-1' });
  assert.equal(plan.pending.length, 10);
  assert.ok(plan.pending.every((pair) => pair.needed === 3));
  assert.equal(plan.complete, false);
});

test('B1: a full passing set needs nothing more', () => {
  const plan = planBatch({ tier: 'wide', runs: fullSet('wide'), cohort: COHORT });
  assert.equal(plan.next, null);
  assert.equal(plan.complete, true);
});

test('B2: pairs with the fewest valid runs go first, so the rounds interleave across routes', () => {
  const runs = [goodRun({ route: 'studio', locale: 'es', n: 1 })];
  assert.deepEqual(planBatch({ tier: 'wide', runs, cohort: COHORT }).next, { route: 'studio', locale: 'en', runId: 'wide-studio-en-1' });
});

test('B3: an invalid run does not count but keeps its id, and runs of another cohort neither count nor collide', () => {
  const busy = goodRun({ route: 'studio', locale: 'es', n: 1 });
  busy.machine.cpuBusyBefore = 0.8;
  const otherBuild = { ...goodRun({ route: 'studio', locale: 'es', n: 2 }), build: { ...goodRun().build, head: 'c'.repeat(40) } };
  const plan = planBatch({ tier: 'wide', runs: [busy, otherBuild], cohort: COHORT });
  const studio = plan.pending.find((pair) => pair.route === 'studio' && pair.locale === 'es');
  assert.equal(studio.validRuns, 0);
  assert.equal(studio.attempts, 1);
  assert.deepEqual(plan.next, { route: 'studio', locale: 'es', runId: 'wide-studio-es-3' });
});

test('B3: the next run id follows the highest one used, so a gap can never lead to a reused id', () => {
  const runs = [2, 3].map((n) => {
    const run = goodRun({ route: 'studio', locale: 'es', n });
    run.machine.cpuBusyBefore = 0.8;
    return run;
  });
  assert.equal(planBatch({ tier: 'wide', runs, cohort: COHORT }).next.runId, 'wide-studio-es-4');
});

test('B4: a valid failing run stops its pair (no recollection until a cause is named); the other pairs continue', () => {
  const failing = goodRun({ route: 'studio', locale: 'es', n: 1 });
  failing.metrics.activeIntervalP95Ms = 40;
  const plan = planBatch({ tier: 'wide', runs: [failing], cohort: COHORT });
  assert.deepEqual(plan.failedPairs, ['studio/es']);
  assert.ok(!plan.pending.some((pair) => pair.route === 'studio' && pair.locale === 'es'));
  assert.deepEqual(plan.next, { route: 'studio', locale: 'en', runId: 'wide-studio-en-1' });
  assert.equal(plan.complete, false, 'a failed pair is not a complete collection');
});

test('B5: three valid runs with an OPEN row need a fix, not more runs; a pair out of attempts is reported, not retried', () => {
  const runs = fullSet('wide');
  runs.find((run) => run.route === 'founder' && run.locale === 'en').metrics.hiddenDraws = null;
  const busy = [1, 2].map((n) => {
    const run = goodRun({ route: 'projects', locale: 'en', n: 10 + n });
    run.machine.cpuBusyAfter = 0.9;
    return run;
  });
  const withoutProjectsEn = runs.filter((run) => !(run.route === 'projects' && run.locale === 'en'));
  const plan = planBatch({ tier: 'wide', runs: [...withoutProjectsEn, ...busy], cohort: COHORT, maxAttempts: 2 });
  assert.deepEqual(plan.openPairs, ['founder/en']);
  assert.deepEqual(plan.exhaustedPairs, ['projects/en']);
  assert.equal(plan.next, null);
  assert.equal(plan.complete, false);
});

test('B6: the batch collects the wide tier only, and needs a device record', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sfc-hw-'));
  try {
    const compact = spawnSync(process.execPath, [script, `--batch=${dir}`, '--tier=compact', '--device=x.json'], { encoding: 'utf8' });
    assert.equal(compact.status, 1);
    assert.match(compact.stderr, /--batch collects the wide tier only/);
    const noDevice = spawnSync(process.execPath, [script, `--batch=${dir}`, '--tier=wide'], { encoding: 'utf8' });
    assert.equal(noDevice.status, 1);
    assert.match(noDevice.stderr, /--device=<file\.json> is required/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
