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
  REQUIRED_VALID_RUNS,
  buildDossier,
  classifyRun,
  judgeRun,
  validateDeviceRecord,
} from './measure-connected-studio-hardware.mjs';

const script = fileURLToPath(new URL('./measure-connected-studio-hardware.mjs', import.meta.url));
const ROUTES = ['studio', 'founder', 'contact', 'services', 'projects'];
const LOCALES = ['es', 'en'];
const ATLAS = new Set(['studio', 'founder', 'contact']);

const desktop = () => ({ kind: 'desktop', name: 'Owner desktop, Intel Core i3-8100, 24 GB', os: 'Windows 11 Pro 10.0.26300', browser: 'Chromium', browserVersion: '153.0.8010.12', gpu: 'NVIDIA GeForce RTX 2060', refreshHz: 60, operator: 'Samuel Furlanich' });
const android = () => ({ kind: 'android', name: 'Constrained Android phone, 4 cores', os: 'Android 14', browser: 'Chrome', browserVersion: '153.0.0.0', gpu: 'Adreno 610', refreshHz: 60, operator: 'Samuel Furlanich' });

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
    device: wide ? desktop() : android(),
    build: { head: '5d0b3a70a86c8cc71a3a60f9330f3b5a58b562c6', candidate: 'runtime', patchSha256: 'a'.repeat(64), basePath: '/', method: 'node scripts/measure-connected-studio-hardware.mjs' },
    protocol: { ...PROTOCOL_MINIMA, headed: true, hiddenMethod: 'window-minimized' },
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
      footerDraws: 0,
      maxContexts: 1,
      listenerGrowth: 0,
      closureBrotliKiB: 119.5,
      lcpMs: 900,
      inpMs: 56,
      clsEnhancement: 0,
      ...(atlas ? { restDraws: 0 } : {}),
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
