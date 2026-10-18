// Hardware qualification collector and judge for the connected-studio live tiers (PLAN-SFC-V1 Task 15; the Task 9 script of
// PLAN-SPF-V1 is its ancestor). Two commands, both documented in docs/reviews/studio-founder-contact-acceptance-v1/hardware-protocol.md:
//
//   Collect ONE run: one route, one locale, one tier, one device. Run from a disposable runtime candidate checkout (never committed):
//     node <worktree>/scripts/measure-connected-studio-hardware.mjs --route=studio|founder|contact|services|projects --locale=es|en
//       --tier=wide|compact --device=<device.json> --run-id=<id> --out=<runs-dir>/<id>.json [--headed] [--browser=chromium|firefox]
//       [--idle-seconds=120] [--traversals=3] [--sustained-seconds=300] [--route-cycles=5] [--base-path=/Portfolio]
//       [--connect-cdp=http://127.0.0.1:9222] [--extras] [--trace-pipeline=<file>] [--frames-out=<file>] [--no-gpu-timers]
//
//   Add the runs up: node scripts/measure-connected-studio-hardware.mjs --qualify=<runs-dir> --tier=wide|compact [--out=dossier.json]
//     Exits 0 only when every one of the ten route and locale pairs has three valid passing runs; OPEN and FAIL exit 1.
//
// This script sets no connected test hook and passes no software-renderer flag. The candidate build enables the tier under test in
// CONNECTED_LIVE_POLICY; the page must go live by itself on hardware WebGL2 or the run is invalid (fail closed). Shorter windows than the
// protocol minima are accepted for a smoke run and recorded, and such a run never counts. Every run is written, valid or not.
//
// What it is and is not:
//   - It observes through the browser's own APIs and by wrapping WebGL2 calls (the Home production instrumentation precedent): frame
//     intervals between renders, the CPU time a render takes to submit its draw calls (a CPU-only estimate), and GPU time from
//     EXT_disjoint_timer_query_webgl2 when the extension exists. If the extension is missing, GPU time is "not measured" (OPEN).
//   - It runs on the device it drives. It is evidence for the owner's decision, not the owner's acceptance. The compact tier needs a
//     constrained Android phone (--connect-cdp over adb); that path is written but has not been run on a phone.
//   - The 200% / 400% check (--extras) is the viewport-equivalent of browser zoom, not Ctrl-plus. The accessibility tree is a proxy for
//     assistive technology, never an NVDA or VoiceOver result.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import zlib from 'node:zlib';
import { chromium, firefox } from 'playwright';
import { activeFrameIntervals, attributeShifts, buildRouteClosure, cadenceFps, chunkImports, classifyLateFrames, crossCheckClosure, findOptionalCodeInCriticalChunks, FRAME_INTERVAL_SOURCE, gateExit, judgeHardware, judgeMetric, OPTIONAL_ENGINE_MARKERS } from '../lib/connected-studio/measurement.ts';
import { foundationRoutes } from '../lib/site-routes.ts';
import { createExportServer, normalizeBasePath } from './serve-static-export.mjs';

// ---- PLAN-SFC-V1 Task 15: the pure qualification layer -----------------------------------------------------------------
// A run is one collection on one device for one route, locale and tier. Everything below is data in, verdict out, so a
// failure, an unmeasured value or a software render cannot read as a pass. The browser protocol further down only fills
// a run report; `--qualify=<dir>` adds the reports up.

/** At least this many valid active runs per route, locale and tier before a pair can pass. */
export const REQUIRED_VALID_RUNS = 3;
/** Anything shorter than these is a smoke run: it is kept and labelled invalid, never counted. */
export const PROTOCOL_MINIMA = Object.freeze({ idleSeconds: 120, traversals: 3, sustainedSeconds: 300, routeCycles: 5 });

/** "All other heavy work stopped": the host CPU, and the GPU when it can be queried, must be quiet before and after a run. */
export const QUIESCENCE_LIMITS = Object.freeze({ cpuBusy: 0.3, gpuUtilization: 0.3 });

/** Options that make a run a diagnostic: it is kept and labelled, and never counts toward a qualification (tracing adds overhead; the others change what is measured). */
export function diagnosticReasons(argv) {
  const reasons = [];
  const has = (name) => argv.some((value) => value === `--${name}` || value.startsWith(`--${name}=`));
  if (has('trace-pipeline')) reasons.push('--trace-pipeline adds tracing overhead');
  if (has('frames-out')) reasons.push('--frames-out records every frame');
  if (has('no-gpu-timers')) reasons.push('--no-gpu-timers is a control without the timer queries');
  if (has('diagnostic')) reasons.push('--diagnostic was requested');
  return reasons;
}

/** What the options may combine: the compact tier is an Android phone over CDP with a fixed served port; a desktop viewport is a diagnostic only. */
export function validateCollectionOptions({ tier, connectCdp, servePort, diagnostic }) {
  const problems = [];
  if (tier === 'wide' && connectCdp) problems.push('the wide tier is collected on a desktop browser, not on an Android target (--connect-cdp).');
  if (tier === 'compact' && !connectCdp && !diagnostic) problems.push('the compact tier needs a physical Android phone: use --connect-cdp (a desktop 390 px viewport is a diagnostic only, with --diagnostic).');
  if (connectCdp && servePort === undefined) problems.push('--connect-cdp needs --serve-port=<port>, and `adb reverse tcp:<port> tcp:<port>` so the phone can reach the export.');
  if (servePort !== undefined && !(Number.isInteger(servePort) && servePort >= 1 && servePort <= 65535)) problems.push(`--serve-port must be a port from 1 to 65535, got "${servePort}".`);
  return problems;
}

/** The first thing the target must do is fetch the export; a phone that cannot is stopped before a 12-minute protocol. */
export function reachabilityProblem({ status, body, error }) {
  if (error) return `the target could not reach the export server (${error}); for a phone run adb reverse tcp:<port> tcp:<port> with the same --serve-port`;
  if (status !== 200) return `the target reached a server that answered ${status}, not the export`;
  if (!String(body ?? '').includes('/_next/')) return 'the target did not receive the static export (no /_next/ assets in the page): the wrong server or a captive portal?';
  return null;
}

const ROUTE_IDS = ['studio', 'founder', 'contact', 'services', 'projects'];
const LOCALES = ['es', 'en'];
const ATLAS_ROUTES = new Set(['studio', 'founder', 'contact']);
const PAUSE_LABELS = { es: { pause: 'Pausar fondo', resume: 'Reanudar fondo' }, en: { pause: 'Pause background', resume: 'Resume background' } };

/** The five connected route pairs. Pathnames come from the site routes so a renamed page cannot drift from the protocol. */
export const HARDWARE_ROUTES = Object.freeze(
  Object.fromEntries(
    ROUTE_IDS.map((route) => [
      route,
      Object.freeze({
        atlas: ATLAS_ROUTES.has(route),
        pauseSlot: `connected-pause-${route}`,
        ...Object.fromEntries(LOCALES.map((locale) => [locale, Object.freeze({ pathname: foundationRoutes[route][locale], ...PAUSE_LABELS[locale] })])),
      }),
    ]),
  ),
);

const TIER_DEVICE_KIND = { wide: 'desktop', compact: 'android' };
const DEVICE_TEXT_FIELDS = ['name', 'os', 'browser', 'browserVersion', 'gpu', 'operator'];
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|softpipe|microsoft basic/i;
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

/** The plan asks for the physical device's names before any collection; the tier asks for its own kind of device. */
export function validateDeviceRecord(device, tier) {
  if (!device || typeof device !== 'object') return { ok: false, problems: ['the device record is missing'] };
  const problems = DEVICE_TEXT_FIELDS.filter((field) => !isText(device[field])).map((field) => `device.${field} is required`);
  if (!isFiniteNumber(device.refreshHz) || device.refreshHz <= 0) problems.push('device.refreshHz must be a positive number');
  const expected = TIER_DEVICE_KIND[tier];
  if (!expected) problems.push(`the tier "${tier}" is not wide or compact`);
  else if (device.kind !== expected) problems.push(`the ${tier} tier needs ${expected === 'android' ? 'an android' : 'a desktop'} device, not "${device.kind ?? 'none'}": no substitution`);
  return { ok: problems.length === 0, problems };
}

/**
 * Whether a run may count at all. An invalid run is retained with its reasons; it is neither a pass nor a fail, and it can
 * neither supply the third pass nor hide a failure it would have shown.
 */
export function classifyRun(run) {
  const reasons = [];
  if (run?.kind !== 'sfc-hardware-run' || run?.schemaVersion !== 1) return { valid: false, reasons: ['not a schema 1 hardware run report'] };
  if (!isText(run.runId)) reasons.push('no run id was recorded');
  if (!(typeof run.startedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(run.startedAt) && !Number.isNaN(Date.parse(run.startedAt)))) reasons.push('no valid start time was recorded');
  if (!TIER_DEVICE_KIND[run.tier]) reasons.push(`the tier "${run.tier}" is not wide or compact`);
  if (!HARDWARE_ROUTES[run.route] || !LOCALES.includes(run.locale)) reasons.push(`the route "${run.route}" / locale "${run.locale}" is not one of the five connected pairs`);
  for (const problem of validateDeviceRecord(run.device, run.tier).problems) reasons.push(`device record: ${problem}`);
  const machine = run.machine;
  if (!isFiniteNumber(machine?.cpuBusyBefore) || !isFiniteNumber(machine?.cpuBusyAfter)) reasons.push('no machine load was recorded before and after the run: quiescence is unproven');
  else {
    if (machine.cpuBusyBefore > QUIESCENCE_LIMITS.cpuBusy) reasons.push(`the machine was busy before the run (CPU ${Math.round(machine.cpuBusyBefore * 100)}% in use): other heavy work was running`);
    if (machine.cpuBusyAfter > QUIESCENCE_LIMITS.cpuBusy) reasons.push(`the machine was busy after the run (CPU ${Math.round(machine.cpuBusyAfter * 100)}% in use): other heavy work was running`);
  }
  if (isFiniteNumber(machine?.gpuUtilizationBefore) && machine.gpuUtilizationBefore > QUIESCENCE_LIMITS.gpuUtilization) reasons.push(`the GPU was in use by something else before the run (${Math.round(machine.gpuUtilizationBefore * 100)}%)`);
  if (isFiniteNumber(machine?.gpuUtilizationAfter) && machine.gpuUtilizationAfter > QUIESCENCE_LIMITS.gpuUtilization) reasons.push(`the GPU was in use by something else after the run (${Math.round(machine.gpuUtilizationAfter * 100)}%)`);
  const remote = run.remote;
  const androidTarget = /Android/i.test(remote?.userAgent ?? '');
  if (!remote) reasons.push('no remote target record (user agent, touch points) was kept: what was measured is unproven');
  else if (run.tier === 'compact') {
    if (run.detected?.controlsAndroidOverCdp !== true) reasons.push('compact evidence must come from a physical Android phone driven over --connect-cdp: this run did not');
    if (!androidTarget) reasons.push(`the target's user agent is not Android: "${remote.userAgent}"`);
    if (!(remote.maxTouchPoints >= 1)) reasons.push('the target reports no touch points: it is not a phone');
  } else if (run.tier === 'wide' && (run.detected?.controlsAndroidOverCdp === true || androidTarget)) reasons.push('wide evidence must come from a desktop browser, not an Android target');
  if (!isText(run.renderer)) reasons.push('no renderer was recorded: the run cannot be shown to be hardware');
  else if (SOFTWARE_RENDERER.test(run.renderer)) reasons.push(`software renderer "${run.renderer}": this run measures nothing`);
  if (run.liveWithoutOverride !== true) reasons.push('the page did not go live by itself on hardware WebGL2');
  if (run.setsTestHook !== false) reasons.push('a connected test hook was set or not declared absent');
  if (run.forcesSoftwareRenderer !== false) reasons.push('a software renderer was forced or not declared absent');
  if (run.frameIntervalSource !== FRAME_INTERVAL_SOURCE) reasons.push(`the active frame interval source is "${run.frameIntervalSource}", not ${FRAME_INTERVAL_SOURCE}`);
  if (!(run.samples?.activeRenders >= 1)) reasons.push('zero samples: no active renders were recorded');
  if (!(run.samples?.intervalsMeasured >= 1)) reasons.push('zero samples: no active frame interval was measured');
  const protocol = run.protocol ?? {};
  if (!(protocol.idleSeconds >= PROTOCOL_MINIMA.idleSeconds)) reasons.push(`the idle window (${protocol.idleSeconds} s) is shorter than the protocol's ${PROTOCOL_MINIMA.idleSeconds} s`);
  if (!(protocol.traversals >= PROTOCOL_MINIMA.traversals)) reasons.push(`${protocol.traversals} traversals is fewer than the protocol's ${PROTOCOL_MINIMA.traversals}`);
  if (!(protocol.sustainedSeconds >= PROTOCOL_MINIMA.sustainedSeconds)) reasons.push(`the sustained window (${protocol.sustainedSeconds} s) is shorter than the protocol's ${PROTOCOL_MINIMA.sustainedSeconds} s`);
  if (!(protocol.routeCycles >= PROTOCOL_MINIMA.routeCycles)) reasons.push(`${protocol.routeCycles} route cycles is fewer than the protocol's ${PROTOCOL_MINIMA.routeCycles}`);
  if (protocol.diagnostic !== false) reasons.push('this report is not declared a non-diagnostic collection: a diagnostic run is retained but never counts');
  if (/--(trace-pipeline|frames-out|no-gpu-timers|diagnostic)\b/.test(run.build?.method ?? '')) reasons.push('the collection method used a diagnostic option (trace, frames, no timers): a diagnostic run never counts');
  if (!/^[0-9a-f]{40}$/.test(run.build?.head ?? '')) reasons.push('no 40-character build head was recorded');
  if (!/^[0-9a-f]{64}$/.test(run.build?.patchSha256 ?? '')) reasons.push('no candidate patch SHA-256 was recorded');
  if (!isText(run.build?.method)) reasons.push('no collection method was recorded');
  if (Array.isArray(run.failures) && run.failures.length) reasons.push(`the run recorded failures: ${run.failures.join('; ')}`);
  return { valid: reasons.length === 0, reasons };
}

const NOT_APPLICABLE = Object.freeze([
  Object.freeze({
    item: 'form focus and busy states',
    reason: 'Contact has no form since Task 13 replaced intake with direct channels (ADR-CONTACT-DIRECT-CHANNELS); there is no surface to measure, so nothing is recorded as measured and nothing counts toward a pass.',
  }),
]);

/** Rows beyond judgeHardware's thirteen: [limit, 'max' | 'below', the observer that must have run for a zero to be a measurement]. */
const EXTRA_ROWS = {
  closureBrotliKiB: [120, 'max', null],
  lcpMs: [2500, 'max', 'lcpObserved'],
  inpMs: [200, 'max', 'eventTimingObserved'],
  clsEnhancement: [0, 'max', 'layoutShiftObserved'],
  sustainedActiveIntervalP95Ms: [20, 'max', null],
  sustainedTaskMaxMs: [50, 'below', null],
  sustainedContexts: [1, 'max', null],
  // Counts of observed defects (a label tilted, too small, interactive or over reading text; Resume that drew nothing; a scene
  // that did not come back after a route change). Zero is a measurement here because the protocol step ran or the run is invalid.
  labelViolations: [0, 'max', null],
  resumeFailures: [0, 'max', null],
  routeCycleFailures: [0, 'max', null],
  // Scheduled callbacks, not only draws: a loop that keeps scheduling without drawing is not a quiet page.
  hiddenRafCalls: [0, 'max', null],
  footerRafCalls: [0, 'max', null],
};
/** A sleeping (Atlas) page owes zero draws and zero callbacks once settled, at rest and after the tail of an input. */
const ATLAS_ROWS = { restDraws: [0, 'max', null], restRafCalls: [0, 'max', null], settledTailDraws: [0, 'max', null], settledTailRafCalls: [0, 'max', null] };

/** Every row of one run. A value without its observer is OPEN (a zero from a missing observer is not a zero). */
export function judgeRun(run) {
  const metrics = run.metrics ?? {};
  const rows = { ...judgeHardware(metrics, run.tier).rows };
  const extra = { ...EXTRA_ROWS };
  if (HARDWARE_ROUTES[run.route]?.atlas) Object.assign(extra, ATLAS_ROWS);
  for (const [key, [limit, direction, observer]] of Object.entries(extra)) {
    const observed = observer === null || run.samples?.[observer] === true;
    rows[key] = { value: metrics[key], limit, verdict: observed ? judgeMetric(metrics[key], limit, direction) : 'OPEN' };
  }
  const verdicts = Object.values(rows).map((row) => row.verdict);
  return { verdict: verdicts.includes('FAIL') ? 'FAIL' : verdicts.includes('OPEN') ? 'OPEN' : 'PASS', rows, notApplicable: NOT_APPLICABLE.map((item) => ({ ...item })) };
}

const cohortOf = (run) => ({ head: run.build?.head, patchSha256: run.build?.patchSha256, basePath: run.build?.basePath, deviceName: run.device?.name });
const cohortKey = (run) => JSON.stringify(Object.values(cohortOf(run)));
const COHORT_FIELDS = ['head', 'patchSha256', 'basePath', 'deviceName'];

/**
 * The tier dossier: every run of the tier is retained, but runs add up only inside ONE cohort (one build, patch, base path and
 * device), so older data can neither qualify a changed build nor poison a repaired one. A pair fails if any valid run fails (no
 * choosing the good ones), stays OPEN below three valid runs or while any valid run has an unmeasured row, and passes only when
 * all valid runs pass. Copies of one report, and reports that share a run id or a start time, never count twice.
 */
export function buildDossier({ tier, runs, cohort }) {
  const base = { tier, requiredValidRuns: REQUIRED_VALID_RUNS, notApplicable: NOT_APPLICABLE.map((item) => ({ ...item })) };
  const tierRuns = runs.filter((run) => run.tier === tier);
  const wanted = COHORT_FIELDS.filter((field) => cohort?.[field] !== undefined);
  const excludedRuns = [];
  const selected = tierRuns.filter((run) => {
    if (wanted.every((field) => cohortOf(run)[field] === cohort[field])) return true;
    excludedRuns.push({ runId: run.runId, cohort: cohortOf(run), reason: 'outside the selected cohort (build, patch, base path or device differ)' });
    return false;
  });
  const groups = new Map();
  for (const run of selected) groups.set(cohortKey(run), { ...cohortOf(run), runs: (groups.get(cohortKey(run))?.runs ?? 0) + 1 });
  if (groups.size > 1) {
    return { ...base, verdict: 'OPEN', needsCohort: true, message: 'the runs span several builds or devices: choose one cohort (--head, --patch, --base-path, --device-name); nothing is added across cohorts', cohorts: [...groups.values()], pairs: {}, missingPairs: [], excludedRuns };
  }
  const first = selected[0];
  const identity = first ? { ...cohortOf(first), device: { name: first.device?.name, os: first.device?.os, gpu: first.device?.gpu, browser: first.device?.browser, browserVersion: first.device?.browserVersion } } : null;

  // Duplicates are decided across the whole cohort before any pair is judged.
  const rejection = new Map();
  const byId = new Map();
  selected.forEach((run, index) => {
    if (isText(run.runId)) byId.set(run.runId, [...(byId.get(run.runId) ?? []), index]);
  });
  for (const [runId, indexes] of byId) {
    if (indexes.length < 2) continue;
    const identical = indexes.every((index) => JSON.stringify(selected[index]) === JSON.stringify(selected[indexes[0]]));
    indexes.forEach((index, position) => {
      if (!identical) rejection.set(index, `conflicting reports share the run id "${runId}"`);
      else if (position > 0) rejection.set(index, `duplicate report of run id "${runId}" (an identical copy)`);
    });
  }
  const seenStart = new Map();
  selected.forEach((run, index) => {
    if (rejection.has(index) || typeof run.startedAt !== 'string') return;
    if (seenStart.has(run.startedAt)) rejection.set(index, `duplicate: the same start time as run "${selected[seenStart.get(run.startedAt)].runId}"`);
    else seenStart.set(run.startedAt, index);
  });

  const pairs = {};
  const missingPairs = [];
  for (const route of ROUTE_IDS) {
    for (const locale of LOCALES) {
      const key = `${route}/${locale}`;
      const mine = selected.map((run, index) => ({ run, index })).filter(({ run }) => run.route === route && run.locale === locale);
      const entries = mine.map(({ run, index }) => {
        const classified = classifyRun(run);
        const reasons = rejection.has(index) ? [...classified.reasons, rejection.get(index)] : classified.reasons;
        const valid = reasons.length === 0;
        const judged = valid ? judgeRun(run) : null;
        return { runId: run.runId, valid, reasons, verdict: judged?.verdict ?? null, rows: judged?.rows ?? null };
      });
      const validEntries = entries.filter((entry) => entry.valid);
      const verdicts = validEntries.map((entry) => entry.verdict);
      const verdict = verdicts.includes('FAIL') ? 'FAIL' : validEntries.length < REQUIRED_VALID_RUNS || verdicts.includes('OPEN') ? 'OPEN' : 'PASS';
      if (!mine.length) missingPairs.push(key);
      pairs[key] = { verdict, validRuns: validEntries.length, invalidRuns: entries.length - validEntries.length, runs: entries };
    }
  }
  const pairVerdicts = Object.values(pairs).map((pair) => pair.verdict);
  return { ...base, verdict: pairVerdicts.includes('FAIL') ? 'FAIL' : pairVerdicts.every((v) => v === 'PASS') ? 'PASS' : 'OPEN', cohort: identity, pairs, missingPairs, excludedRuns };
}

function qualify({ directory, tier, out, cohort }) {
  if (!['wide', 'compact'].includes(tier)) return { exit: 1, message: `--tier must be wide or compact, got "${tier}"` };
  const runs = fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort().map((name) => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
  const dossier = buildDossier({ tier, runs, cohort });
  if (out) fs.writeFileSync(out, `${JSON.stringify(dossier, null, 2)}\n`);
  console.log(JSON.stringify(dossier, null, 2));
  const gate = gateExit([dossier.verdict]);
  console.error(`Hardware qualification, ${tier} tier: ${dossier.verdict}. ${gate.message}`);
  return { exit: gate.ok ? 0 : 1 };
}

// ---- The browser protocol: one route, one locale, one tier, one device, one run report --------------------------------------

const argumentOf = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const percentile = (values, p) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
};
const round = (value, digits = 2) => (value === null || value === undefined ? value : +value.toFixed(digits));
const KIB = 1024;
const brotliSize = (buffer) => zlib.brotliCompressSync(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const sha256Text = (text) => createHash('sha256').update(text).digest('hex');

/** Installed before any page script. Self-contained: it is serialized into the page. */
function installProbe(options) {
  const hw = { frames: [], rafLog: [], current: null, rafCalls: 0, timeoutCalls: 0, longTasks: [], contexts: { alive: 0, max: 0, creates: 0 }, timerExt: undefined, disjoint: 0, pending: [], visibility: [] };
  window.__hw = hw;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (callback) => { hw.rafCalls += 1; hw.rafLog.push(performance.now()); return raf(callback); };
  const timeout = window.setTimeout.bind(window);
  window.setTimeout = (...args) => { hw.timeoutCalls += 1; return timeout(...args); };
  let sampling = false;
  let lastSample = 0;
  hw.rafSamples = [];
  const sampleLoop = (now) => {
    if (!sampling) return;
    if (lastSample) hw.rafSamples.push(now - lastSample);
    lastSample = now;
    raf(sampleLoop);
  };
  hw.startSampler = () => { hw.rafSamples = []; lastSample = 0; sampling = true; raf(sampleLoop); };
  hw.stopSampler = () => { sampling = false; return hw.rafSamples; };
  document.addEventListener('visibilitychange', () => hw.visibility.push([performance.now(), document.visibilityState]));
  new PerformanceObserver((list) => list.getEntries().forEach((entry) => hw.longTasks.push({ start: entry.startTime, duration: entry.duration }))).observe({ type: 'longtask', buffered: true });

  // Web vitals, observed from the first byte: the same attribution as measure-connected-studio-vitals.mjs (a shift with a source in
  // the connected ground, or one at or after activation that is not a font swap, belongs to the enhancement).
  const vitals = { lcp: [], events: [], shifts: [], fontLoads: [], activationAt: null, supported: PerformanceObserver.supportedEntryTypes ?? [] };
  hw.vitals = vitals;
  const observe = (type, extra, handle) => {
    try {
      new PerformanceObserver((list) => list.getEntries().forEach(handle)).observe({ type, buffered: true, ...extra });
    } catch {
      // an unsupported entry type stays unobserved, and the row for it stays OPEN
    }
  };
  observe('largest-contentful-paint', {}, (entry) => vitals.lcp.push(entry.startTime));
  observe('event', { durationThreshold: 16 }, (entry) => { if (entry.interactionId) vitals.events.push({ id: entry.interactionId, duration: entry.duration }); });
  document.fonts?.addEventListener('loading', () => vitals.fontLoads.push([performance.now(), null]));
  document.fonts?.addEventListener('loadingdone', () => {
    const open = vitals.fontLoads.findLast((load) => load[1] === null);
    if (open) open[1] = performance.now();
  });
  const describe = (node) => {
    const element = node instanceof Element ? node : (node?.parentElement ?? null);
    return { enhancement: Boolean(element && (element.tagName === 'CANVAS' || element.closest('[data-connected-ground]'))) };
  };
  observe('layout-shift', {}, (entry) => {
    if (entry.hadRecentInput) return;
    vitals.shifts.push({ value: entry.value, time: entry.startTime, enhancement: (entry.sources ?? []).some((source) => describe(source.node).enhancement) });
  });
  new MutationObserver((records) => {
    if (vitals.activationAt !== null) return;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element && (node.matches('canvas, [data-connected-pause], [data-connected-labels]') || node.querySelector('canvas, [data-connected-pause]'))) {
          vitals.activationAt = performance.now();
          return;
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });

  const finish = () => {
    const frame = hw.current;
    if (!frame) return;
    frame.cpu = frame.lastDraw - frame.t;
    if (frame.query) {
      frame.gl.endQuery(hw.timerExt.TIME_ELAPSED_EXT);
      hw.pending.push({ frame, gl: frame.gl, query: frame.query });
    }
    delete frame.lastDraw;
    delete frame.query;
    delete frame.gl;
    hw.frames.push(frame);
    hw.current = null;
  };
  const proto = window.WebGL2RenderingContext.prototype;
  const wrap = (name, before) => {
    const original = proto[name];
    proto[name] = function (...args) {
      before.call(this, args);
      return original.apply(this, args);
    };
  };
  wrap('clear', function () {
    finish();
    if (hw.timerExt === undefined) hw.timerExt = options.gpuTimers ? this.getExtension('EXT_disjoint_timer_query_webgl2') || null : null;
    const now = performance.now();
    hw.current = { t: now, lastDraw: now, draws: 0, gpuMs: null, query: null, gl: this };
    if (hw.timerExt) {
      hw.current.query = this.createQuery();
      this.beginQuery(hw.timerExt.TIME_ELAPSED_EXT, hw.current.query);
    }
  });
  for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements']) {
    wrap(name, () => {
      if (!hw.current) return;
      hw.current.draws += 1;
      hw.current.lastDraw = performance.now();
    });
  }
  hw.flush = finish;
  window.setInterval(() => {
    hw.pending = hw.pending.filter((entry) => {
      const { gl, query, frame } = entry;
      if (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) return true;
      if (gl.getParameter(hw.timerExt.GPU_DISJOINT_EXT)) hw.disjoint += 1;
      else frame.gpuMs = gl.getQueryParameter(query, gl.QUERY_RESULT) / 1e6;
      gl.deleteQuery(query);
      return false;
    });
  }, 100);

  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const released = new WeakSet();
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const context = originalGetContext.call(this, type, ...rest);
    if (context && type === 'webgl2' && !context.__hwSeen) {
      Object.defineProperty(context, '__hwSeen', { value: true });
      hw.contexts.creates += 1;
      hw.contexts.alive += 1;
      hw.contexts.max = Math.max(hw.contexts.max, hw.contexts.alive);
      const getExtension = context.getExtension.bind(context);
      context.getExtension = (name) => {
        const extension = getExtension(name);
        if (name !== 'WEBGL_lose_context' || !extension) return extension;
        return new Proxy(extension, {
          get(target, property) {
            if (property !== 'loseContext') return Reflect.get(target, property);
            return () => {
              if (!released.has(context)) {
                released.add(context);
                hw.contexts.alive -= 1;
              }
              target.loseContext();
            };
          },
        });
      };
    }
    return context;
  };
}

/** GPU utilization (0 to 1) from nvidia-smi when it exists, else null: another program drawing on the GPU voids a graphics measurement. */
function readGpuUtilization() {
  const result = spawnSync('nvidia-smi', ['--query-gpu=utilization.gpu', '--format=csv,noheader,nounits'], { encoding: 'utf8', timeout: 5000 });
  if (result.status !== 0) return null;
  const value = Number(String(result.stdout).trim().split(/\r?\n/)[0]);
  return Number.isFinite(value) ? value / 100 : null;
}

/** The host CPU busy fraction and the worst GPU utilization over a short window, to prove nothing else heavy was running. */
async function sampleMachine(seconds = 3) {
  const snapshot = () => os.cpus().map((cpu) => cpu.times);
  const before = snapshot();
  const gpu = [readGpuUtilization()];
  await new Promise((resolve) => setTimeout(resolve, (seconds * 1000) / 2));
  gpu.push(readGpuUtilization());
  await new Promise((resolve) => setTimeout(resolve, (seconds * 1000) / 2));
  gpu.push(readGpuUtilization());
  const after = snapshot();
  let idle = 0;
  let total = 0;
  after.forEach((times, index) => {
    idle += times.idle - before[index].idle;
    total += Object.keys(times).reduce((sum, key) => sum + (times[key] - before[index][key]), 0);
  });
  const measured = gpu.filter((value) => value !== null);
  return { cpuBusy: total > 0 ? round(1 - idle / total, 3) : null, gpuUtilization: measured.length ? Math.max(...measured) : null };
}

/** The candidate's own record: head, applied patch hashes and the working-tree files it changed. */
function readCandidate(root) {
  const git = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' }).stdout.trim();
  const head = git(['rev-parse', 'HEAD']);
  const stateFile = path.join(path.resolve(root, git(['rev-parse', '--git-dir'])), 'sfc-candidate.json');
  const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : null;
  const changed = git(['diff', '--name-only']).split('\n').filter(Boolean);
  const hashes = (state?.patches ?? []).map((patch) => patch.sha256);
  const policySource = fs.readFileSync(path.join(root, 'lib', 'connected-studio', 'capability.ts'), 'utf8');
  const policy = { wide: /wide:\s*true/.test(policySource), compact: /compact:\s*true/.test(policySource) };
  return { head, kind: state?.kind ?? null, stateHead: state?.head ?? null, patchSha256: hashes.length === 1 ? hashes[0] : hashes.length ? sha256Text(hashes.join('\n')) : '', changed, policy };
}

/** The optional closure of a route read from the emitted export, with Brotli sizes, as measure-connected-studio-production counts it. */
function analyzeClosure(outDir, pathname) {
  const chunksDir = path.join(outDir, '_next', 'static', 'chunks');
  const chunks = fs.readdirSync(chunksDir).filter((name) => /\.(js|css)$/.test(name)).map((name) => {
    const buffer = fs.readFileSync(path.join(chunksDir, name));
    return { path: `chunks/${name}`, rawBytes: buffer.length, brotliBytes: brotliSize(buffer), imports: chunkImports(buffer.toString('utf8'), `chunks/${name}`) };
  });
  const html = fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
  const referenced = [...new Set([...html.matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)].map((match) => match[1]))];
  const { entries, closure } = buildRouteClosure({ referenced, chunks });
  const critical = referenced.filter((name) => name.endsWith('.js')).map((name) => ({ path: name, text: fs.readFileSync(path.join(chunksDir, name.replace(/^chunks\//, '')), 'utf8') }));
  return { referenced, entries, closure, evasion: findOptionalCodeInCriticalChunks({ chunks: critical, markers: OPTIONAL_ENGINE_MARKERS }) };
}

async function main() {
  const qualifyDirectory = argumentOf('qualify');
  if (qualifyDirectory) {
    const cohort = Object.fromEntries([['head', argumentOf('head')], ['patchSha256', argumentOf('patch')], ['basePath', argumentOf('base-path')], ['deviceName', argumentOf('device-name')]].filter(([, value]) => value !== undefined));
    const result = qualify({ directory: qualifyDirectory, tier: argumentOf('tier') ?? 'wide', out: argumentOf('out'), cohort });
    if (result.message) console.error(`measure-connected-studio-hardware: ${result.message}`);
    process.exit(result.exit);
  }
  const root = process.cwd();
  const outDir = path.join(root, 'out');
  const fail = (message) => {
    console.error(`measure-connected-studio-hardware: ${message}`);
    process.exit(1);
  };
  const positive = (name, fallback) => {
    const raw = argumentOf(name) ?? String(fallback);
    if (!/^[0-9]+$/.test(raw) || Number(raw) < 1) fail(`--${name} must be a positive integer, got "${raw}"`);
    return Number(raw);
  };
  const ROUTE = argumentOf('route');
  if (!HARDWARE_ROUTES[ROUTE]) fail(`--route must be one of ${Object.keys(HARDWARE_ROUTES).join(', ')}, got "${ROUTE}"`);
  const LOCALE = argumentOf('locale') ?? 'es';
  if (!LOCALES.includes(LOCALE)) fail(`--locale must be es or en, got "${LOCALE}"`);
  const TIER = argumentOf('tier') ?? 'wide';
  if (!TIER_DEVICE_KIND[TIER]) fail(`--tier must be wide or compact, got "${TIER}"`);
  const BROWSER = argumentOf('browser') ?? 'chromium';
  if (!['chromium', 'firefox'].includes(BROWSER)) fail(`--browser must be chromium or firefox, got "${BROWSER}"`);
  const CDP_URL = argumentOf('connect-cdp'); // an Android Chrome reached with `adb forward`; the page is then driven on the phone itself
  if (CDP_URL && BROWSER !== 'chromium') fail('--connect-cdp needs --browser=chromium');
  const IDLE_SECONDS = positive('idle-seconds', PROTOCOL_MINIMA.idleSeconds);
  const TRAVERSALS = positive('traversals', PROTOCOL_MINIMA.traversals);
  const SUSTAINED_SECONDS = positive('sustained-seconds', PROTOCOL_MINIMA.sustainedSeconds);
  const ROUTE_CYCLES = positive('route-cycles', PROTOCOL_MINIMA.routeCycles);
  const HEADED = process.argv.includes('--headed');
  const HIDDEN_MODE = argumentOf('hidden'); // auto (headed window minimized through the browser) or manual (the operator hides it; always manual over CDP)
  if (HIDDEN_MODE && !['auto', 'manual'].includes(HIDDEN_MODE)) fail('--hidden must be auto or manual');
  const EXTRAS = process.argv.includes('--extras'); // 200% / 400% viewport checks, rendered-pixel contrast, accessibility tree (Task 9 extras)
  // Opt-in evidence for a late-frame diagnosis (PLAN-SFC-V1 Task 3). Tracing adds overhead, so a traced run is a diagnostic, not a measurement.
  const TRACE_PIPELINE = argumentOf('trace-pipeline');
  const FRAMES_OUT = argumentOf('frames-out');
  if ((TRACE_PIPELINE || FRAMES_OUT) && BROWSER !== 'chromium') fail('--trace-pipeline and --frames-out need --browser=chromium');
  const GPU_TIMERS = !process.argv.includes('--no-gpu-timers'); // a control: without the timer queries, is the frame interval the same?
  const SERVE_PORT = argumentOf('serve-port') === undefined ? undefined : Number(argumentOf('serve-port'));
  const DIAGNOSTIC_REASONS = diagnosticReasons(process.argv.slice(2));
  const optionProblems = validateCollectionOptions({ tier: TIER, connectCdp: CDP_URL, servePort: SERVE_PORT, diagnostic: DIAGNOSTIC_REASONS.length > 0 });
  if (optionProblems.length) fail(optionProblems.join(' '));
  const basePath = normalizeBasePath(argumentOf('base-path') ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '');
  if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) fail(`The base path "${basePath}" is not a plain /segment. Run from PowerShell.`);
  if (!fs.existsSync(path.join(outDir, 'index.html'))) fail('No export in out/. Build the candidate first.');
  if (!fs.readFileSync(path.join(outDir, 'index.html'), 'utf8').includes(`${basePath}/_next/`)) fail(`out/ was not exported with base path "${basePath || '/'}".`);
  const deviceFile = argumentOf('device');
  if (!deviceFile) fail('--device=<file.json> is required: the plan records the physical device before anything is collected.');
  const device = JSON.parse(fs.readFileSync(deviceFile, 'utf8'));
  const candidate = readCandidate(root);
  if (candidate.kind !== 'runtime') fail('This checkout is not a runtime candidate (node scripts/prepare-sfc-candidate.mjs apply --kind=runtime). Never run it against a committed build.');
  if (candidate.stateHead !== candidate.head) fail(`The candidate was applied at ${candidate.stateHead}, not at this head ${candidate.head}.`);
  if (candidate.changed.length !== 1 || candidate.changed[0] !== 'lib/connected-studio/capability.ts') fail(`The candidate diff must be exactly lib/connected-studio/capability.ts, got: ${candidate.changed.join(', ') || 'nothing'}.`);
  if (!candidate.policy[TIER]) fail(`The candidate does not enable the ${TIER} tier in CONNECTED_LIVE_POLICY.`);

  const target = HARDWARE_ROUTES[ROUTE];
  const pageInfo = target[LOCALE];
  const ATLAS = target.atlas;
  const RUN_ID = argumentOf('run-id') ?? `${TIER}-${ROUTE}-${LOCALE}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const NEXT_ROUTE = ROUTE_IDS[(ROUTE_IDS.indexOf(ROUTE) + 1) % ROUTE_IDS.length]; // a route cycle goes here and back through the Footer links

  const loadBefore = await sampleMachine();
  const server = createExportServer({ root: outDir, basePath });
  await new Promise((resolve) => server.listen(SERVE_PORT ?? 0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = (pathname) => `${origin}${basePath}${pathname}`;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const launchOptions = BROWSER === 'chromium' ? (HEADED ? { headless: false } : { channel: 'chromium' }) : {};
  const browser = CDP_URL ? await chromium.connectOverCDP(CDP_URL) : await (BROWSER === 'firefox' ? firefox : chromium).launch(launchOptions);
  const failures = [];
  const findings = [];
  const report = {
    schemaVersion: 1,
    kind: 'sfc-hardware-run',
    runId: RUN_ID,
    tier: TIER,
    route: ROUTE,
    locale: LOCALE,
    startedAt: new Date().toISOString(),
    device,
    detected: { browserVersion: browser.version(), cpu: os.cpus()[0]?.model, logicalCores: os.cpus().length, memoryGiB: round(os.totalmem() / 1024 ** 3, 1), hostPlatform: `${os.platform()} ${os.release()}`, controlsAndroidOverCdp: Boolean(CDP_URL) },
    build: { head: candidate.head, candidate: candidate.kind, patchSha256: candidate.patchSha256, policy: candidate.policy, basePath: basePath || '/', method: `node scripts/measure-connected-studio-hardware.mjs ${process.argv.slice(2).join(' ')}` },
    protocol: { idleSeconds: IDLE_SECONDS, traversals: TRAVERSALS, sustainedSeconds: SUSTAINED_SECONDS, routeCycles: ROUTE_CYCLES, headed: HEADED, extras: EXTRAS, gpuTimersRequested: GPU_TIMERS, browser: BROWSER, hiddenMethod: null, diagnostic: DIAGNOSTIC_REASONS.length > 0, diagnosticReasons: DIAGNOSTIC_REASONS, servePort: SERVE_PORT ?? null },
    setsTestHook: false,
    forcesSoftwareRenderer: false,
    frameIntervalSource: FRAME_INTERVAL_SOURCE,
    limitations: [
      'A software renderer ends the run as invalid: nothing from it is a hardware figure.',
      'The render CPU time is a CPU-only estimate of draw submission; GPU time comes from timer queries when the extension exists.',
      'One device per run. A desktop never stands in for the constrained Android phone, and a run that measures neither is OPEN.',
      'Form focus and busy states are not applicable: Contact has no form (ADR-CONTACT-DIRECT-CHANNELS).',
      'Screen-reader behavior is a separate human protocol; the accessibility tree is only a proxy.',
    ],
  };

  async function openPage(viewport, deviceScaleFactor = 1) {
    if (CDP_URL) {
      const context = browser.contexts()[0];
      const page = await context.newPage();
      await page.addInitScript(installProbe, { gpuTimers: GPU_TIMERS });
      return { context, page, close: () => page.close() };
    }
    const context = await browser.newContext({ viewport, deviceScaleFactor });
    const page = await context.newPage();
    await page.addInitScript(installProbe, { gpuTimers: GPU_TIMERS });
    return { context, page, close: () => context.close() };
  }
  const waitLive = (page, timeout = 60_000) =>
    page.waitForFunction(() => document.querySelector('[data-connected-ground]')?.getAttribute('data-connected-live') === 'true', null, { timeout }).then(() => true, () => false);
  // Read on a blank page without the probe: the probe's own context must not count toward the contexts alive on the page under test.
  const rendererOf = async (page) => {
    const blank = await page.context().newPage();
    try {
      return await blank.evaluate(() => {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return { renderer: null, timerQueries: false };
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        const timerQueries = Boolean(gl.getExtension('EXT_disjoint_timer_query_webgl2'));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return { renderer, timerQueries };
      });
    } finally {
      await blank.close();
    }
  };
  const framesSince = async (page, from) => {
    await page.evaluate(() => window.__hw.flush());
    await page.waitForTimeout(400); // let the last GPU queries resolve
    return page.evaluate((index) => window.__hw.frames.slice(index).map((frame) => ({ ...frame })), from);
  };
  const frameCount = (page) => page.evaluate(() => window.__hw.frames.length);
  const counters = (page) => page.evaluate(() => ({ frames: window.__hw.frames.length + (window.__hw.current ? 1 : 0), raf: window.__hw.rafCalls, timeouts: window.__hw.timeoutCalls }));
  const viewportOf = (page) => page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio }));

  async function scrollThrough(page, direction, viewport) {
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    for (let guard = 0; guard < 400; guard += 1) {
      const done = await page.evaluate((dir) => (dir > 0 ? window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 : window.scrollY <= 0), direction);
      if (done) return;
      await page.mouse.wheel(0, 100 * direction);
      await page.waitForTimeout(80);
    }
  }
  /** A pointer pass over the scene: a slow sine across the viewport, then still, so the stationary tail is visible. Mouse devices only. */
  async function pointerSweep(page, viewport) {
    const steps = 90;
    for (let i = 0; i <= steps; i += 1) {
      const x = 40 + ((viewport.width - 80) * i) / steps;
      const y = viewport.height / 2 + Math.sin(i / 7) * viewport.height * 0.3;
      await page.mouse.move(x, y, { steps: 2 });
      await page.waitForTimeout(16);
    }
  }
  async function labelGeometry(page) {
    return page.evaluate(() => {
      const rect = (element) => element.getBoundingClientRect();
      const labels = [...document.querySelectorAll('[data-connected-label]')].map((element) => {
        const style = getComputedStyle(element);
        const matrix = style.transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(style.transform);
        return { visible: parseFloat(style.opacity) > 0.01, fontSize: parseFloat(style.fontSize), upright: Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6, pointerEvents: style.pointerEvents, box: rect(element).toJSON() };
      });
      const shown = labels.filter((label) => label.visible);
      const occluders = [...document.querySelectorAll('[data-connected-reading-mask], [data-app-bar]')].map((element) => rect(element).toJSON());
      const overlaps = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
      return {
        total: labels.length,
        visible: shown.length,
        smallest: shown.length ? Math.min(...shown.map((label) => label.fontSize)) : null,
        violations: shown.filter((label) => label.fontSize < 11 || !label.upright || label.pointerEvents !== 'none' || occluders.some((box) => overlaps(label.box, box))).length,
      };
    });
  }
  /** A client-side navigation through any link to the pathname (Footer links are on every page). A hard load is reported and breaks the baseline. */
  async function navigate(page, pathname) {
    const href = `${basePath}${pathname}`;
    const link = page.locator(`a[href="${href}"], a[href="${href}#site-top"]`).first();
    if (await link.count()) {
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await page.waitForURL((u) => u.pathname === href);
      return 'client';
    }
    await page.goto(url(pathname), { waitUntil: 'load' });
    return 'hard';
  }

  try {
    // ---- 0. Is the page live on hardware, with no override? ----
    const first = await openPage({ width: TIER === 'wide' ? 1440 : 390, height: TIER === 'wide' ? 900 : 844 });
    const page = first.page;
    let navigation = null;
    let navigationError = null;
    try {
      navigation = await page.goto(url(pageInfo.pathname), { waitUntil: 'load' });
    } catch (error) {
      navigationError = error.message;
    }
    // The first thing any target does is fetch the export: a phone that cannot reach it is stopped here, not twelve minutes in.
    const unreachable = reachabilityProblem(navigationError ? { error: navigationError } : { status: navigation?.status(), body: await page.content() });
    if (unreachable) throw new Error(unreachable);
    report.remote = await page.evaluate(() => ({ userAgent: navigator.userAgent, platform: navigator.platform, maxTouchPoints: navigator.maxTouchPoints, hardwareConcurrency: navigator.hardwareConcurrency, deviceMemoryGiB: navigator.deviceMemory ?? null, screen: { width: screen.width, height: screen.height } }));
    const viewport = await viewportOf(page);
    report.viewport = viewport;
    const renderer = await rendererOf(page);
    report.renderer = renderer.renderer;
    report.gpuTimerQueries = renderer.timerQueries && GPU_TIMERS;
    const hardware = isText(renderer.renderer) && !SOFTWARE_RENDERER.test(renderer.renderer);
    const live = hardware && (await waitLive(page, BROWSER === 'firefox' ? 30_000 : 60_000));
    report.liveWithoutOverride = live;
    if (!hardware) failures.push(`the renderer "${renderer.renderer}" is a software renderer: this run measures nothing`);
    else if (!live) failures.push('the page did not go live by itself on hardware WebGL2 (is the tier enabled in the candidate build?)');
    const expectedCompact = viewport.width < 768;
    if ((TIER === 'compact') !== expectedCompact) failures.push(`the viewport ${viewport.width}x${viewport.height} is not the ${TIER} tier`);

    report.metrics = {};
    report.samples = { activeRenders: 0, intervalsMeasured: 0, gpuTimedFrames: 0, layoutShiftObserved: false, lcpObserved: false, eventTimingObserved: false };

    if (live && BROWSER === 'firefox') {
      // Firefox: activation only. No timing or GPU figures are taken, so every row stays OPEN and the run cannot qualify a tier.
      report.firefox = { note: 'functional activation check only: no timing or GPU metrics are taken in Firefox', canvases: await page.locator('canvas').count(), pauseButton: await page.locator(`#${target.pauseSlot} button`).count() };
      if (report.firefox.canvases !== 1 || report.firefox.pauseButton !== 1) failures.push('Firefox went live but without exactly one canvas and one Pause control');
    } else if (live) {
      const context = first.context;
      const cdp = await context.newCDPSession(page);
      await cdp.send('Performance.enable');
      const cdpMetric = async (name) => {
        await cdp.send('HeapProfiler.collectGarbage');
        const { metrics } = await cdp.send('Performance.getMetrics');
        return metrics.find((metric) => metric.name === name)?.value ?? null;
      };
      const metrics = report.metrics;
      const slot = page.locator(`#${target.pauseSlot}`);
      await page.waitForTimeout(5_000); // the start-pose settle takes about three seconds

      // A few real interactions at the start give the event-timing observer something to measure (INP is the worst interaction).
      for (let i = 0; i < 3; i += 1) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(150);
      }
      await slot.getByRole('button', { name: pageInfo.pause, exact: true }).click();
      await page.waitForTimeout(500);
      await slot.getByRole('button', { name: pageInfo.resume, exact: true }).click();
      await page.waitForTimeout(3_000);

      // ---- 1. Idle: cadence and cost with nothing happening (an Atlas page must be asleep) ----
      const heapStart = await cdpMetric('JSHeapUsedSize');
      const idleFrom = await frameCount(page);
      const restWindowMs = Math.min(30, IDLE_SECONDS) * 1000;
      await page.waitForTimeout(IDLE_SECONDS * 1000 - restWindowMs);
      const restBefore = await counters(page); // the last 30 s of the idle window are the settled rest window
      await page.waitForTimeout(restWindowMs);
      const restAfter = await counters(page);
      const idle = await framesSince(page, idleFrom);
      const heapIdleEnd = await cdpMetric('JSHeapUsedSize');
      metrics.ambientFps = idle.length >= 2 ? round(cadenceFps(idle.map((frame) => frame.t)), 1) : 0;
      const idleEnd = idle.length ? idle[idle.length - 1].t : 0;
      const nowMs = await page.evaluate(() => performance.now());
      if (ATLAS) {
        metrics.restDraws = restAfter.frames - restBefore.frames;
        metrics.restRafCalls = restAfter.raf - restBefore.raf;
      }
      report.idle = { seconds: IDLE_SECONDS, renders: idle.length, fps: metrics.ambientFps, lastRenderAgoMs: idle.length ? round(nowMs - idleEnd, 0) : null, restWindowSeconds: restWindowMs / 1000, gpuP95Ms: round(percentile(idle.map((f) => f.gpuMs).filter((v) => v !== null), 95), 3), heapStartMiB: round(heapStart / 1048576, 1), heapEndMiB: round(heapIdleEnd / 1048576, 1) };

      // ---- 2. Traversals (scroll) and pointer passes with stationary tails: active cadence, render cost, draw calls, labels, long tasks ----
      const active = [];
      const scrollFrames = [];
      const pointerFrames = [];
      const labelSamples = [await labelGeometry(page)];
      const traversalStart = await page.evaluate(() => performance.now());
      if (TRACE_PIPELINE) await browser.startTracing(page, { path: TRACE_PIPELINE, categories: ['toplevel', 'cc', 'viz', 'gpu', 'benchmark', 'input', 'latencyInfo', 'blink.user_timing', 'disabled-by-default-cc.debug.scheduler'] });
      for (let pass = 0; pass < TRAVERSALS; pass += 1) {
        for (const direction of [1, -1]) {
          const from = await frameCount(page);
          const scrolling = scrollThrough(page, direction, viewport);
          await page.waitForTimeout(1500);
          labelSamples.push(await labelGeometry(page));
          await scrolling;
          const frames = await framesSince(page, from);
          scrollFrames.push(...frames);
          active.push(...frames);
        }
      }
      report.pointerPasses = [];
      if (TIER === 'wide') {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(1500);
        for (let pass = 0; pass < TRAVERSALS; pass += 1) {
          const from = await frameCount(page);
          await pointerSweep(page, viewport);
          const sweptAt = await page.evaluate(() => performance.now());
          await page.waitForTimeout(4000); // the stationary tail: the pointer is still
          const frames = await framesSince(page, from);
          const tail = frames.filter((frame) => frame.t > sweptAt);
          pointerFrames.push(...frames);
          active.push(...frames.filter((frame) => frame.t <= sweptAt + 250));
          report.pointerPasses.push({ renders: frames.length, tailRenders: tail.length, tailLastRenderAfterStopMs: tail.length ? round(tail[tail.length - 1].t - sweptAt, 0) : 0 });
          await page.mouse.move(2, 2);
          await page.waitForTimeout(1000);
        }
      } else {
        report.pointerPasses.push({ note: 'compact tier: touch only, no pointer pass (native scrolling only)' });
      }
      const traversalEnd = await page.evaluate(() => performance.now());
      if (TRACE_PIPELINE) await browser.stopTracing();
      if (FRAMES_OUT) fs.writeFileSync(FRAMES_OUT, `${JSON.stringify({ unit: 'ms, page performance.now()', frames: active.map((f) => ({ t: round(f.t, 3), cpuMs: round(f.cpu, 3), gpuMs: round(f.gpuMs, 3), draws: f.draws })) })}\n`);
      // Frame intervals come from the render timestamps only (never the CPU submit time or the GPU query); a gap of 250 ms or more
      // is a pause between bursts. No usable interval leaves the row OPEN and the run invalid instead of ending the run.
      // A sleeping page owes zero draws and zero callbacks once the tail of the last input has died away.
      if (ATLAS) {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(5000);
        const tailBefore = await counters(page);
        await page.waitForTimeout(3000);
        const tailAfter = await counters(page);
        metrics.settledTailDraws = tailAfter.frames - tailBefore.frames;
        metrics.settledTailRafCalls = tailAfter.raf - tailBefore.raf;
        report.settledTail = { afterInput: TIER === 'wide' ? 'pointer pass, then a scroll back to the top' : 'scroll traversal, then a scroll back to the top', waitedSeconds: 5, windowSeconds: 3, draws: metrics.settledTailDraws, rafCalls: metrics.settledTailRafCalls };
      }
      const intervalsOf = (frames) => {
        try {
          return activeFrameIntervals({ source: FRAME_INTERVAL_SOURCE, timestampsMs: frames.map((frame) => frame.t) });
        } catch (error) {
          report.activeIntervalError = error.message;
          return [];
        }
      };
      const intervals = intervalsOf(active);
      try {
        report.lateFrames = classifyLateFrames({ frames: active.map((f) => ({ t: f.t, cpuMs: f.cpu, gpuMs: f.gpuMs })) });
      } catch (error) {
        report.lateFramesError = error.message;
      }
      const gpuValues = active.map((f) => f.gpuMs).filter((v) => v !== null);
      const longTasks = await page.evaluate(([a, b]) => window.__hw.longTasks.filter((task) => task.start >= a && task.start <= b).map((task) => Math.round(task.duration)), [traversalStart, traversalEnd]);
      metrics.activeIntervalP95Ms = intervals.length ? round(percentile(intervals, 95), 2) : null;
      metrics.renderCpuP95Ms = active.length ? round(percentile(active.map((f) => f.cpu), 95), 3) : null;
      metrics.renderGpuP95Ms = report.gpuTimerQueries && gpuValues.length ? round(percentile(gpuValues, 95), 3) : null;
      metrics.drawCallsMax = active.length ? Math.max(...active.map((f) => f.draws)) : null;
      // The Long Tasks API only reports tasks of 50 ms or more, so none seen is a measured zero only where the API exists.
      const longTasksSupported = (await page.evaluate(() => window.__hw.vitals.supported)).includes('longtask');
      metrics.interactionTaskMaxMs = !longTasksSupported ? null : longTasks.length ? Math.max(...longTasks) : 0;
      metrics.pixelRatio = round(await page.evaluate(() => (document.querySelector('canvas') ? document.querySelector('canvas').width / window.innerWidth : null)), 3);
      metrics.labelViolations = labelSamples.reduce((sum, sample) => sum + sample.violations, 0);
      report.samples.activeRenders = active.length;
      report.samples.intervalsMeasured = intervals.length;
      report.samples.gpuTimedFrames = gpuValues.length;
      report.traversals = { count: TRAVERSALS, scrollRenders: scrollFrames.length, pointerRenders: pointerFrames.length, intervalP50Ms: round(percentile(intervals, 50), 2), scrollIntervalP95Ms: round(percentile(intervalsOf(scrollFrames), 95), 2), pointerIntervalP95Ms: round(percentile(intervalsOf(pointerFrames), 95), 2), disjointRejections: await page.evaluate(() => window.__hw.disjoint), longTasksMs: longTasks, labels: { samples: labelSamples.length, maxVisible: Math.max(...labelSamples.map((s) => s.visible)), smallestFontPx: Math.min(...labelSamples.map((s) => s.smallest ?? 99)), violations: metrics.labelViolations } };

      // ---- 2b. Control: the same traversal with the scene paused, so the page's own scroll cost is visible ----
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1500);
      await slot.getByRole('button', { name: pageInfo.pause, exact: true }).click();
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.__hw.startSampler());
      await scrollThrough(page, 1, viewport);
      await scrollThrough(page, -1, viewport);
      const controlSamples = await page.evaluate(() => window.__hw.stopSampler());
      await slot.getByRole('button', { name: pageInfo.resume, exact: true }).click();
      const controlIntervals = controlSamples.filter((gap) => gap < 250);
      report.pageOnlyControl = { note: 'requestAnimationFrame intervals while the page scrolls with the scene paused (no scene draws): the cost of the page itself', samples: controlIntervals.length, intervalP50Ms: round(percentile(controlIntervals, 50), 2), intervalP95Ms: round(percentile(controlIntervals, 95), 2), medianHz: controlIntervals.length ? round(1000 / percentile(controlIntervals, 50), 1) : null };

      // ---- 3. Pause: zero draws, zero page animation-frame callbacks; Resume draws again ----
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1500);
      await slot.getByRole('button', { name: pageInfo.pause, exact: true }).click();
      await page.waitForTimeout(1500);
      const pausedBefore = await counters(page);
      await page.waitForTimeout(4000);
      const pausedAfter = await counters(page);
      metrics.pausedDraws = pausedAfter.frames - pausedBefore.frames;
      metrics.pausedRafCalls = pausedAfter.raf - pausedBefore.raf;
      report.paused = { windowSeconds: 4, draws: metrics.pausedDraws, rafCalls: metrics.pausedRafCalls, timeoutCalls: pausedAfter.timeouts - pausedBefore.timeouts, note: 'timeout calls come from the whole page and are reported, not gated' };
      await slot.getByRole('button', { name: pageInfo.resume, exact: true }).click();
      // Resume draws again only when something moves the scene or the start pose is replayed; nudge with the pointer on a mouse device.
      const resumedFrom = await counters(page);
      await page.mouse.wheel(0, 160); // an ordinary scroll wakes a sleeping Atlas page on any device
      await page.waitForTimeout(300);
      await page.mouse.wheel(0, -160);
      if (TIER === 'wide') await pointerSweep(page, viewport);
      await page.waitForTimeout(2000);
      report.paused.resumedDraws = (await counters(page)).frames - resumedFrom.frames;
      metrics.resumeFailures = report.paused.resumedDraws > 0 ? 0 : 1;
      if (metrics.resumeFailures) findings.push('Resume did not draw again');

      // ---- 4. Hidden: a second tab hides the first; on a phone the operator locks the screen. Draws are counted from the page's own log. ----
      const hideAndCount = async (mode) => {
        const logFrom = await page.evaluate(() => window.__hw.visibility.length);
        if (mode === 'manual') {
          console.error(CDP_URL ? '\nLOCK THE PHONE SCREEN NOW for at least 10 seconds, then unlock it (waiting up to 120 s).' : '\nMINIMIZE THE BROWSER WINDOW NOW for at least 10 seconds, then restore it (waiting up to 120 s).');
          await page.waitForFunction((n) => window.__hw.visibility.length >= n + 2, logFrom, { timeout: 120_000 }).catch(() => {});
        } else {
          // The real window is minimized through the browser's own window API, then restored; no emulation of visibility is involved.
          const windowSession = await context.newCDPSession(page);
          const { windowId } = await windowSession.send('Browser.getWindowForTarget');
          await windowSession.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } });
          await sleep(6_000);
          await windowSession.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } });
          await page.bringToFront();
          await page.waitForTimeout(1500);
        }
        return page.evaluate((from) => {
          const log = window.__hw.visibility.slice(from);
          const hiddenAt = log.find((entry) => entry[1] === 'hidden')?.[0];
          const shownAt = log.find((entry) => entry[1] === 'visible' && entry[0] > (hiddenAt ?? Infinity))?.[0];
          if (hiddenAt === undefined || shownAt === undefined) return null;
          return { hiddenMs: shownAt - hiddenAt, draws: window.__hw.frames.filter((frame) => frame.t > hiddenAt + 100 && frame.t < shownAt).length, rafCalls: window.__hw.rafLog.filter((at) => at > hiddenAt + 100 && at < shownAt).length };
        }, logFrom);
      };
      const hiddenMode = HIDDEN_MODE ?? (CDP_URL ? 'manual' : HEADED ? 'auto' : null);
      const hidden = hiddenMode ? await hideAndCount(hiddenMode) : null;
      report.protocol.hiddenMethod = hidden ? (hiddenMode === 'manual' ? (CDP_URL ? 'phone screen locked by the operator' : 'window minimized by the operator') : 'headed window minimized through the browser window API') : null;
      metrics.hiddenDraws = hidden && hidden.hiddenMs >= 4_000 ? hidden.draws : null; // a window shorter than 4 s proves nothing: stays OPEN
      metrics.hiddenRafCalls = hidden && hidden.hiddenMs >= 4_000 ? hidden.rafCalls : null;
      report.hidden = hidden ?? { note: 'not measured: the page never reported hidden. Playwright-driven Chromium keeps document.visibilityState visible when its window is minimized or covered by another tab (checked in Task 15 with the default launch, with the backgrounding switches removed, with focus emulation off and with every default argument dropped), so the row stays OPEN until a real hidden window is observed' };
      await page.bringToFront();
      await page.waitForTimeout(1500);

      // ---- 5. Footer: the scene is suspended ----
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(2500);
      const footerBefore = await counters(page);
      await page.waitForTimeout(4000);
      const footerAfter = await counters(page);
      metrics.footerDraws = footerAfter.frames - footerBefore.frames;
      metrics.footerRafCalls = footerAfter.raf - footerBefore.raf;
      report.footer = { windowSeconds: 4, draws: metrics.footerDraws, rafCalls: metrics.footerRafCalls };
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

      // The first-load vitals are read here, before any route change replaces the page.
      const vitalsState = await page.evaluate(() => ({ ...window.__hw.vitals }));
      report.samples.lcpObserved = vitalsState.supported.includes('largest-contentful-paint') && vitalsState.lcp.length > 0;
      report.samples.layoutShiftObserved = vitalsState.supported.includes('layout-shift');
      report.samples.eventTimingObserved = vitalsState.supported.includes('event') && vitalsState.events.length > 0;
      metrics.lcpMs = report.samples.lcpObserved ? round(Math.max(...vitalsState.lcp), 0) : null;
      metrics.inpMs = report.samples.eventTimingObserved ? round(Math.max(...vitalsState.events.map((event) => event.duration)), 0) : null;
      const shifts = attributeShifts({ shifts: vitalsState.shifts, fontLoads: vitalsState.fontLoads, activationAt: vitalsState.activationAt });
      metrics.clsEnhancement = report.samples.layoutShiftObserved ? shifts.fromEnhancement : null; // unrounded: any positive value fails the zero gate
      report.vitals = { lcpMs: metrics.lcpMs, inpMs: metrics.inpMs, interactions: vitalsState.events.length, clsWholePage: shifts.wholePage, clsFromEnhancement: shifts.fromEnhancement, enhancementShifts: shifts.enhancementDetail.map((shift) => ({ value: shift.value, atMs: Math.round(shift.time) })), activationAtMs: vitalsState.activationAt === null ? null : Math.round(vitalsState.activationAt) };

      // ---- 6. Route cycles: out through a Footer link and back, client side, ROUTE_CYCLES times: one context, no listener growth ----
      metrics.routeCycleFailures = 0;
      let hardNavigations = 0;
      const cycle = async () => {
        for (const pathname of [HARDWARE_ROUTES[NEXT_ROUTE][LOCALE].pathname, pageInfo.pathname]) {
          if ((await navigate(page, pathname)) === 'hard') hardNavigations += 1;
          if (!(await waitLive(page))) {
            metrics.routeCycleFailures += 1;
            findings.push(`${pathname}: the scene did not come back after a route change`);
          } else if ((await page.locator('canvas').count()) !== 1) {
            metrics.routeCycleFailures += 1;
            findings.push(`${pathname}: not exactly one canvas after a route change`);
          }
        }
      };
      await cycle(); // warm-up
      const listenersBefore = await cdpMetric('JSEventListeners');
      const heapBefore = await cdpMetric('JSHeapUsedSize');
      for (let i = 0; i < ROUTE_CYCLES; i += 1) await cycle();
      const listenersAfter = await cdpMetric('JSEventListeners');
      const heapAfter = await cdpMetric('JSHeapUsedSize');
      // A hard load replaces the document and the counters with it: the growth is then not comparable and the row stays OPEN.
      metrics.listenerGrowth = hardNavigations ? null : listenersAfter - listenersBefore;
      metrics.maxContexts = await page.evaluate(() => window.__hw.contexts.max);
      report.routeCycles = { count: ROUTE_CYCLES, via: `Footer links to ${NEXT_ROUTE} and back`, hardNavigations, listeners: [listenersBefore, listenersAfter], heapMiB: [round(heapBefore / 1048576, 1), round(heapAfter / 1048576, 1)], contextsCreatedInDocument: await page.evaluate(() => window.__hw.contexts.creates) };
      // The locale switch, once: the other language comes up live with one canvas.
      const other = LOCALES.find((locale) => locale !== LOCALE);
      const switched = await navigate(page, target[other].pathname);
      const switchedLive = await waitLive(page);
      const switchedWords = await page.evaluate(() => document.documentElement.lang);
      report.localeSwitch = { to: other, via: switched, live: switchedLive, lang: switchedWords, canvases: await page.locator('canvas').count() };
      if (!switchedLive || report.localeSwitch.canvases !== 1) {
        metrics.routeCycleFailures += 1;
        findings.push('the locale switch did not leave exactly one live canvas');
      }
      await navigate(page, pageInfo.pathname);
      await waitLive(page);
      await page.waitForTimeout(6_000); // the scene's start-pose settle must not be billed to the sustained window

      // ---- 7. Sustained use: mixed scrolling, pointer and idle for SUSTAINED_SECONDS on the same page ----
      const sustainedStartedAt = Date.now();
      const sustainedFrom = await page.evaluate(() => performance.now());
      const heapSustainedStart = await cdpMetric('JSHeapUsedSize');
      const sustainedFrames = [];
      let bursts = 0;
      while (Date.now() - sustainedStartedAt < SUSTAINED_SECONDS * 1000) {
        const from = await frameCount(page);
        await scrollThrough(page, 1, viewport);
        if (TIER === 'wide') await pointerSweep(page, viewport);
        await scrollThrough(page, -1, viewport);
        sustainedFrames.push(...(await framesSince(page, from)));
        bursts += 1;
        const remaining = SUSTAINED_SECONDS * 1000 - (Date.now() - sustainedStartedAt);
        if (remaining > 0) await page.waitForTimeout(Math.min(20_000, remaining)); // a quiet stretch between bursts
      }
      const sustainedTo = await page.evaluate(() => performance.now());
      const sustainedIntervals = intervalsOf(sustainedFrames);
      const sustainedTasks = await page.evaluate(([a, b]) => window.__hw.longTasks.filter((task) => task.start >= a && task.start <= b).map((task) => Math.round(task.duration)), [sustainedFrom, sustainedTo]);
      const heapSustainedEnd = await cdpMetric('JSHeapUsedSize');
      metrics.sustainedActiveIntervalP95Ms = sustainedIntervals.length ? round(percentile(sustainedIntervals, 95), 2) : null;
      metrics.sustainedTaskMaxMs = !longTasksSupported ? null : sustainedTasks.length ? Math.max(...sustainedTasks) : 0;
      metrics.sustainedContexts = await page.evaluate(() => window.__hw.contexts.alive);
      report.sustained = { seconds: Math.round((Date.now() - sustainedStartedAt) / 1000), bursts, renders: sustainedFrames.length, intervalsMeasured: sustainedIntervals.length, longTasksMs: sustainedTasks, heapMiB: [round(heapSustainedStart / 1048576, 1), round(heapSustainedEnd / 1048576, 1)], heapTrend: heapSustainedEnd > heapSustainedStart * 1.25 ? 'growing' : 'flat', note: 'heat and the device temperature are recorded by the operator on the protocol sheet' };

      // ---- 8. Cold and warm: the optional closure on the first load, and a second route from the shared HTTP cache ----
      const analysis = analyzeClosure(outDir, pageInfo.pathname);
      const cacheContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } }).catch(() => null);
      if (cacheContext) {
        const cachePage = await cacheContext.newPage();
        const requested = async () => cachePage.evaluate(() => performance.getEntriesByType('resource').filter((entry) => /\/_next\/static\/chunks\/.+\.(js|css)$/.test(entry.name)).map((entry) => ({ path: 'chunks/' + entry.name.split('/').pop(), transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize })));
        await cachePage.goto(url(pageInfo.pathname), { waitUntil: 'load' });
        await waitLive(cachePage);
        const cold = await requested();
        await cachePage.goto(url(HARDWARE_ROUTES[NEXT_ROUTE][LOCALE].pathname), { waitUntil: 'load' });
        await waitLive(cachePage);
        const warm = await requested();
        const closurePaths = new Set(analysis.closure.chunks.map((chunk) => chunk.path));
        const critical = new Set(analysis.referenced);
        const optionalRequested = cold.map((entry) => entry.path).filter((name) => !critical.has(name));
        const cross = crossCheckClosure({ requested: optionalRequested, closure: analysis.closure });
        report.closure = {
          brotliKiB: round(analysis.closure.brotliBytes / KIB, 2),
          rawKiB: round(analysis.closure.rawBytes / KIB, 1),
          limitKiB: analysis.closure.limitBytes / KIB,
          entries: analysis.entries,
          chunks: analysis.closure.chunks.map((chunk) => ({ path: chunk.path, rawKiB: round(chunk.rawBytes / KIB, 1), brotliKiB: round(chunk.brotliBytes / KIB, 1) })),
          violations: analysis.closure.violations,
          missingFromRequests: cross.missingFromRequests,
          unexpectedRequestsNote: 'optional scripts the cold load fetched that are not in the closure (another route\'s prefetch is allowed, as in Task 14): ' + cross.unexpectedRequests.length,
          unexpectedRequests: cross.unexpectedRequests,
          warmFromCache: warm.filter((entry) => closurePaths.has(entry.path) && entry.transferSize === 0 && entry.encodedBodySize > 0).length,
          warmNewDownloads: warm.filter((entry) => entry.transferSize > 0).map((entry) => entry.path),
          note: 'Brotli quality 11 of the emitted chunks, counted once; cache reuse is reported apart and never subtracts from the cold figure.',
        };
        metrics.closureBrotliKiB = analysis.entries.length ? report.closure.brotliKiB : null; // nothing to measure is OPEN, never zero
        if (analysis.evasion.length) failures.push(`engine code found in critical chunks: ${analysis.evasion.map((item) => `${item.path} (${item.marker})`).join(', ')}`);
        if (cross.missingFromRequests.length) failures.push(`closure chunks the cold load never fetched: ${cross.missingFromRequests.join(', ')}`);
        await cacheContext.close();
      } else {
        report.closure = { note: 'a second context cannot be opened on this connection (an Android Chrome over CDP): the cold figure comes from the static analysis only', brotliKiB: round(analysis.closure.brotliBytes / KIB, 2), entries: analysis.entries };
        metrics.closureBrotliKiB = analysis.entries.length ? round(analysis.closure.brotliBytes / KIB, 2) : null;
      }

      // The thirteen-row verdict of the earlier hardware script is kept as a cross-check of the shared rows.
      report.legacyHardwareVerdict = judgeHardware({ ...metrics }, TIER).verdict;
    }
    await first.close();

    // ---- Optional extras (Task 9): 200% / 400% viewport-equivalent, rendered-pixel contrast, accessibility tree ----
    if (EXTRAS && live && BROWSER === 'chromium' && !CDP_URL) {
      report.extras = { zoom: [], contrast: { samples: 0, failures: [] }, accessibilityTree: {} };
      for (const [label, zoomViewport, dpr] of [['200%', { width: 720, height: 450 }, 2], ['400%', { width: 320, height: 256 }, 4]]) {
        const { page: zoomPage, close } = await openPage(zoomViewport, dpr);
        await zoomPage.goto(url(pageInfo.pathname), { waitUntil: 'load' });
        const wentLive = await waitLive(zoomPage, 8_000);
        await zoomPage.waitForTimeout(1500);
        const checks = await zoomPage.evaluate(() => {
          const width = window.innerWidth;
          const overflowing = [...document.querySelectorAll('main *, [data-app-bar] *, [data-site-footer] *')].filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.right > width + 1 && getComputedStyle(element).position !== 'fixed' && !element.closest('[data-connected-ground]');
          }).length;
          const h1Rect = document.querySelector('main h1')?.getBoundingClientRect();
          const pause = document.querySelector('[data-connected-pause]')?.getBoundingClientRect();
          return { horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth, overflowingElements: overflowing, h1Visible: Boolean(h1Rect && h1Rect.width > 0 && h1Rect.right <= width + 1), pause: pause ? { height: Math.round(pause.height), inViewport: pause.left >= 0 && pause.right <= width + 1 } : null };
        });
        await zoomPage.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
        await zoomPage.waitForTimeout(500);
        const entry = { zoom: label, wentLive, ...checks, footerReachable: await zoomPage.locator('[data-site-footer]').isVisible() };
        entry.ok = !entry.horizontalScroll && entry.overflowingElements === 0 && entry.h1Visible && entry.footerReachable && (!entry.pause || (entry.pause.height >= 44 && entry.pause.inViewport));
        if (!entry.ok) findings.push(`${label}: layout check failed`);
        report.extras.zoom.push(entry);
        await close();
      }
      const { page: treePage, close: closeTree } = await openPage({ width: TIER === 'wide' ? 1440 : 390, height: TIER === 'wide' ? 900 : 844 });
      await treePage.goto(url(pageInfo.pathname), { waitUntil: 'load' });
      await waitLive(treePage);
      await treePage.waitForTimeout(1500);
      const tree = await treePage.locator('body').ariaSnapshot();
      const pauseButtons = (tree.match(new RegExp(`button "(${pageInfo.pause}|${pageInfo.resume})"`, 'g')) ?? []).length;
      report.extras.accessibilityTree = { lines: tree.split('\n').length, h1: (tree.match(/heading "[^"]*" \[level=1\]/g) ?? []).length, pauseButtons, exposesCanvasOrLabels: /canvas/i.test(tree) };
      if (report.extras.accessibilityTree.h1 !== 1) findings.push(`the accessibility tree has ${report.extras.accessibilityTree.h1} level-1 headings`);
      if (pauseButtons !== 1) findings.push(`the accessibility tree exposes ${pauseButtons} Pause buttons`);
      if (report.extras.accessibilityTree.exposesCanvasOrLabels) findings.push('the canvas is exposed to assistive technology');
      await closeTree();
    }
  } catch (error) {
    failures.push(`the run stopped: ${error.message}`);
  } finally {
    await browser.close().catch(() => {});
    server.close();
    const loadAfter = await sampleMachine();
    report.machine = { cpuBusyBefore: loadBefore.cpuBusy, cpuBusyAfter: loadAfter.cpuBusy, gpuUtilizationBefore: loadBefore.gpuUtilization, gpuUtilizationAfter: loadAfter.gpuUtilization, limits: QUIESCENCE_LIMITS, note: 'host CPU in use over 3 s, and nvidia-smi GPU utilization when it exists; measured with the browser closed' };
  }

  report.failures = failures;
  report.findings = findings;
  const classification = classifyRun(report);
  report.valid = classification.valid;
  report.invalidReasons = classification.reasons;
  report.judgement = judgeRun(report);
  const outFile = argumentOf('out');
  if (outFile) {
    fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
    fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
  }
  const printable = { ...report, extras: report.extras ? { ...report.extras, contrast: undefined } : undefined, judgement: { verdict: report.judgement.verdict, rows: Object.fromEntries(Object.entries(report.judgement.rows).map(([key, row]) => [key, `${row.verdict} (${row.value ?? 'not measured'} vs ${row.limit})`])) } };
  console.log(JSON.stringify(printable, null, 2));
  if (!report.valid) {
    console.error(`\nThis run is INVALID and does not count toward the three:\n- ${report.invalidReasons.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`\nRun ${RUN_ID} (${TIER}, ${ROUTE}/${LOCALE}): valid; verdict ${report.judgement.verdict}${findings.length ? `; findings: ${findings.join('; ')}` : ''}.`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
