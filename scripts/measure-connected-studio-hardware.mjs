// Hardware-candidate evidence for a connected-studio live tier (PLAN-SPF-V1 Task 9, OD-4 and the plan's
// "Isolated candidate evaluation"). Usage, against a private candidate export in `out/` (never committed):
//   node scripts/measure-connected-studio-hardware.mjs [--tier=wide|compact] [--browser=chromium|firefox]
//     [--headed] [--idle-seconds=120] [--traversals=3] [--base-path=/Portfolio] [--out=report.json]
//
// This script sets no connected test hook and passes no software-renderer flag. The candidate build enables
// the tier under test in `CONNECTED_LIVE_POLICY`; the page must go live by itself on hardware WebGL2, or every
// row stays OPEN (fail closed). It automates the plan's protocol on the machine that runs it: three full
// up/down traversals, a visible idle, Pause, hidden and Footer checkpoints, five route changes, plus a
// computed 200% / 400% viewport check, a rendered-pixel contrast measurement and an accessibility-tree dump.
//
// What it is and is not:
//   - It observes through the browser's own APIs and by wrapping WebGL2 calls (the Home production
//     instrumentation precedent): frame intervals between renders, the CPU time a render takes to submit its
//     draw calls (a CPU-only estimate), and GPU time from EXT_disjoint_timer_query_webgl2 when the extension
//     exists, with disjoint rejections counted. If the extension is missing, GPU time is "not measured".
//   - It runs on one machine. It is evidence for the owner's decision, not the owner's acceptance, and it says
//     nothing about phones: the compact tier needs the Android and iPhone runs of the protocol.
//   - The 200% / 400% check is the viewport-equivalent of browser zoom (720x450 and 320x256 CSS px at DPR 2 and
//     4), the same method as the Home acceptance spec; it is not Ctrl-plus in the browser UI.
//   - The accessibility tree is a proxy for assistive technology, never an NVDA or VoiceOver result.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium, firefox } from 'playwright';
import { buildRouteClosure, chunkImports, contrastRatio, judgeHardware } from '../lib/connected-studio/measurement.ts';
import { createExportServer, normalizeBasePath } from './serve-static-export.mjs';

const root = process.cwd();
const outDir = path.join(root, 'out');
const argument = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const fail = (message) => {
  console.error(`measure-connected-studio-hardware: ${message}`);
  process.exit(1);
};
const positive = (name, fallback) => {
  const raw = argument(name) ?? String(fallback);
  if (!/^[0-9]+$/.test(raw) || Number(raw) < 1) fail(`--${name} must be a positive integer, got "${raw}"`);
  return Number(raw);
};
const TIER = argument('tier') ?? 'wide';
if (!['wide', 'compact'].includes(TIER)) fail(`--tier must be wide or compact, got "${TIER}"`);
const BROWSER = argument('browser') ?? 'chromium';
if (!['chromium', 'firefox'].includes(BROWSER)) fail(`--browser must be chromium or firefox, got "${BROWSER}"`);
const IDLE_SECONDS = positive('idle-seconds', 120);
const TRAVERSALS = positive('traversals', 3);
const HEADED = process.argv.includes('--headed');
const GPU_TIMERS = !process.argv.includes('--no-gpu-timers'); // a control: without the timer queries, is the frame interval the same?
const basePath = normalizeBasePath(argument('base-path') ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '');
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) fail(`The base path "${basePath}" is not a plain /segment. Run from PowerShell.`);
if (!fs.existsSync(path.join(outDir, 'index.html'))) fail('No export in out/. Build the candidate first.');
if (!fs.readFileSync(path.join(outDir, 'index.html'), 'utf8').includes(`${basePath}/_next/`)) fail(`out/ was not exported with base path "${basePath || '/'}".`);

const VIEWPORT = TIER === 'wide' ? { width: 1440, height: 900 } : { width: 390, height: 844 };
const PAGES = {
  services: { es: { pathname: '/servicios/', other: '/proyectos/', pause: 'Pausar fondo', resume: 'Reanudar fondo' }, en: { pathname: '/en/services/', other: '/en/work/', pause: 'Pause background', resume: 'Resume background' } },
  projects: { es: { pathname: '/proyectos/', other: '/servicios/', pause: 'Pausar fondo', resume: 'Reanudar fondo' }, en: { pathname: '/en/work/', other: '/en/services/', pause: 'Pause background', resume: 'Resume background' } },
};

const server = createExportServer({ root: outDir, basePath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = (pathname) => `${origin}${basePath}${pathname}`;

const percentile = (values, p) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
};
const round = (value, digits = 2) => (value === null || value === undefined ? value : +value.toFixed(digits));

/** Installed before any page script. Self-contained: it is serialized into the page. */
function installProbe(options) {
  const hw = { frames: [], current: null, rafCalls: 0, timeoutCalls: 0, longTasks: [], contexts: { alive: 0, max: 0, creates: 0 }, timerExt: undefined, disjoint: 0, pending: [], visibility: [] };
  window.__hw = hw;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (callback) => { hw.rafCalls += 1; return raf(callback); };
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

const launchOptions = BROWSER === 'chromium' ? (HEADED ? { headless: false } : { channel: 'chromium' }) : {};
const browser = await (BROWSER === 'firefox' ? firefox : chromium).launch(launchOptions);
const failures = [];
const report = {
  kind: 'hardware candidate evidence (one machine; not the owner acceptance, not field data)',
  tier: TIER,
  browser: BROWSER,
  headed: HEADED,
  gpuTimersEnabled: GPU_TIMERS,
  basePath: basePath || '/',
  machine: { cpu: os.cpus()[0]?.model, logicalCores: os.cpus().length, memoryGiB: round(os.totalmem() / 1024 ** 3, 1), platform: `${os.platform()} ${os.release()}` },
  setsTestHook: false,
  forcesSoftwareRenderer: false,
  limitations: [
    'Software-rendered numbers are never reported as hardware: a software renderer ends the run with every row OPEN.',
    'The render CPU time is a CPU-only estimate of draw submission; GPU time comes from timer queries when the extension exists.',
    'Idle, traversal, Pause, hidden and Footer windows are measured on this machine only; phones need their own runs.',
    'The 200% and 400% checks are viewport-equivalent, not browser-UI zoom. The accessibility tree is a proxy, not a screen reader.',
  ],
};

async function openPage(viewport, deviceScaleFactor = 1) {
  const context = await browser.newContext({ viewport, deviceScaleFactor });
  const page = await context.newPage();
  await page.addInitScript(installProbe, { gpuTimers: GPU_TIMERS });
  return { context, page };
}
async function waitLive(page, timeout = 60_000) {
  return page.waitForFunction(() => document.querySelector('main [data-connected-ground]')?.getAttribute('data-connected-live') === 'true', null, { timeout }).then(() => true, () => false);
}
const rendererOf = (page) =>
  page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return { renderer: null, timerQueries: false };
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const timerQueries = Boolean(gl.getExtension('EXT_disjoint_timer_query_webgl2'));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { renderer, timerQueries };
  });
const isSoftware = (renderer) => !renderer || /swiftshader|llvmpipe|software|softpipe|microsoft basic/i.test(renderer);
const framesSince = async (page, from) => {
  await page.evaluate(() => window.__hw.flush());
  await page.waitForTimeout(400); // let the last GPU queries resolve
  return page.evaluate((index) => window.__hw.frames.slice(index).map((frame) => ({ ...frame })), from);
};
const frameCount = (page) => page.evaluate(() => window.__hw.frames.length);
const counters = (page) => page.evaluate(() => ({ frames: window.__hw.frames.length + (window.__hw.current ? 1 : 0), raf: window.__hw.rafCalls, timeouts: window.__hw.timeoutCalls }));

async function scrollThrough(page, direction) {
  await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height / 2);
  for (let guard = 0; guard < 400; guard += 1) {
    const done = await page.evaluate((dir) => (dir > 0 ? window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 : window.scrollY <= 0), direction);
    if (done) return;
    await page.mouse.wheel(0, 100 * direction);
    await page.waitForTimeout(80);
  }
}

async function labelGeometry(page) {
  return page.evaluate(() => {
    const rect = (element) => element.getBoundingClientRect();
    const labels = [...document.querySelectorAll('[data-connected-label]')].map((element) => {
      const style = getComputedStyle(element);
      const matrix = style.transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(style.transform);
      return { text: element.textContent, visible: parseFloat(style.opacity) > 0.01, fontSize: parseFloat(style.fontSize), upright: Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6, pointerEvents: style.pointerEvents, box: rect(element).toJSON() };
    });
    const shown = labels.filter((label) => label.visible);
    const occluders = [...document.querySelectorAll('[data-connected-reading-mask], [data-app-bar]')].map((element) => rect(element).toJSON());
    const overlaps = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
    return {
      total: labels.length,
      visible: shown.length,
      smallest: shown.length ? Math.min(...shown.map((label) => label.fontSize)) : null,
      allUpright: shown.every((label) => label.upright),
      allInert: labels.every((label) => label.pointerEvents === 'none'),
      overlappingMasks: shown.filter((label) => occluders.some((box) => overlaps(label.box, box))).length,
    };
  });
}

// =================================================================================================
try {
  // ---- 0. Is the page live on hardware, with no override? ----
  const first = await openPage(VIEWPORT);
  await first.page.goto(url(PAGES.services.es.pathname), { waitUntil: 'load' });
  const renderer = await rendererOf(first.page);
  report.renderer = renderer.renderer;
  report.gpuTimerQueries = renderer.timerQueries && GPU_TIMERS;
  const hardware = !isSoftware(renderer.renderer);
  const live = hardware && (await waitLive(first.page, BROWSER === 'firefox' ? 30_000 : 60_000));
  report.liveWithoutOverride = live;
  if (!hardware) failures.push(`the renderer "${renderer.renderer}" is a software renderer: this run measures nothing (every row OPEN)`);
  else if (!live) failures.push('the page did not go live by itself on hardware WebGL2 (is the tier enabled in the candidate build?): every row OPEN');

  if (live && BROWSER === 'firefox') {
    report.firefox = {
      note: 'functional activation check only: no timing or GPU metrics are taken in Firefox',
      canvases: await first.page.locator('canvas').count(),
      pauseButton: await first.page.locator('#connected-pause-services button').count(),
    };
    if (report.firefox.canvases !== 1 || report.firefox.pauseButton !== 1) failures.push('Firefox went live but without exactly one canvas and one Pause control');
  } else if (live) {
    const page = first.page;
    const context = first.context;
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    const cdpMetric = async (name) => {
      await cdp.send('HeapProfiler.collectGarbage');
      const { metrics } = await cdp.send('Performance.getMetrics');
      return metrics.find((metric) => metric.name === name)?.value ?? null;
    };
    await page.waitForTimeout(5_000); // the start-pose settle takes about three seconds
    const metrics = {};

    // ---- 1. Idle: cadence and cost with nothing happening ----
    const heapStart = await cdpMetric('JSHeapUsedSize');
    const idleFrom = await frameCount(page);
    await page.waitForTimeout(IDLE_SECONDS * 1000);
    const idle = await framesSince(page, idleFrom);
    const heapIdleEnd = await cdpMetric('JSHeapUsedSize');
    metrics.ambientFps = round(idle.length / IDLE_SECONDS, 1);
    report.idle = { seconds: IDLE_SECONDS, renders: idle.length, fps: metrics.ambientFps, gpuP95Ms: round(percentile(idle.map((f) => f.gpuMs).filter((v) => v !== null), 95), 3), heapStartMiB: round(heapStart / 1048576, 1), heapEndMiB: round(heapIdleEnd / 1048576, 1) };

    // ---- 2. Traversals: active cadence, render cost, draw calls, labels, long tasks ----
    const active = [];
    const labelSamples = [];
    const heroLabels = await labelGeometry(page);
    const traversalStart = await page.evaluate(() => performance.now());
    for (let pass = 0; pass < TRAVERSALS; pass += 1) {
      for (const direction of [1, -1]) {
        const from = await frameCount(page);
        const scrolling = scrollThrough(page, direction);
        await page.waitForTimeout(1500);
        labelSamples.push(await labelGeometry(page));
        await scrolling;
        active.push(...(await framesSince(page, from)));
      }
    }
    const traversalEnd = await page.evaluate(() => performance.now());
    const intervals = [];
    for (let i = 1; i < active.length; i += 1) {
      const gap = active[i].t - active[i - 1].t;
      if (gap < 250) intervals.push(gap); // a gap that long is a pause between scroll bursts, not a frame interval
    }
    const gpuValues = active.map((f) => f.gpuMs).filter((v) => v !== null);
    const longTasks = await page.evaluate(([a, b]) => window.__hw.longTasks.filter((task) => task.start >= a && task.start <= b).map((task) => Math.round(task.duration)), [traversalStart, traversalEnd]);
    metrics.activeIntervalP95Ms = round(percentile(intervals, 95), 2);
    metrics.renderCpuP95Ms = round(percentile(active.map((f) => f.cpu), 95), 3);
    metrics.renderGpuP95Ms = report.gpuTimerQueries && gpuValues.length ? round(percentile(gpuValues, 95), 3) : null;
    metrics.drawCallsMax = Math.max(0, ...active.map((f) => f.draws));
    metrics.interactionTaskMaxMs = longTasks.length ? Math.max(...longTasks) : 0; // the Long Tasks API only reports tasks of 50 ms or more
    metrics.pixelRatio = round(await page.evaluate(() => document.querySelector('canvas')?.width / window.innerWidth), 3);
    report.traversals = { count: TRAVERSALS, renders: active.length, intervalsMeasured: intervals.length, intervalP50Ms: round(percentile(intervals, 50), 2), gpuTimedFrames: gpuValues.length, disjointRejections: await page.evaluate(() => window.__hw.disjoint), longTasksMs: longTasks, labels: { samples: labelSamples.length, minVisible: Math.min(...labelSamples.map((s) => s.visible)), maxVisible: Math.max(...labelSamples.map((s) => s.visible)), smallestFontPx: Math.min(...labelSamples.map((s) => s.smallest ?? 99)), allUpright: labelSamples.every((s) => s.allUpright), allInert: labelSamples.every((s) => s.allInert), overlappingMasks: labelSamples.reduce((sum, s) => sum + s.overlappingMasks, 0) } };
    report.traversals.labels.atHero = heroLabels;
    const allLabelSamples = [heroLabels, ...labelSamples];
    const smallestFont = Math.min(...allLabelSamples.map((s) => s.smallest ?? 99));
    // Labels hide under a reading plate by design (PC-2); the rule is that the hero shows them, and that no shown label is too small, tilted, interactive or over reading text anywhere.
    const labelsOk = heroLabels.visible > 0 && smallestFont >= 11 && allLabelSamples.every((s) => s.allUpright && s.allInert) && allLabelSamples.reduce((sum, s) => sum + s.overlappingMasks, 0) === 0;

    // ---- 2b. Control: the same traversal with the scene paused, so the page's own scroll cost is visible ----
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1500);
    await page.locator('#connected-pause-services').getByRole('button', { name: PAGES.services.es.pause, exact: true }).click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.__hw.startSampler());
    await scrollThrough(page, 1);
    await scrollThrough(page, -1);
    const controlSamples = await page.evaluate(() => window.__hw.stopSampler());
    await page.locator('#connected-pause-services').getByRole('button', { name: PAGES.services.es.resume, exact: true }).click();
    const controlIntervals = controlSamples.filter((gap) => gap < 250);
    report.pageOnlyControl = { note: 'requestAnimationFrame intervals while the page scrolls with the scene paused (no scene draws): the cost of the page itself', samples: controlIntervals.length, intervalP50Ms: round(percentile(controlIntervals, 50), 2), intervalP95Ms: round(percentile(controlIntervals, 95), 2) };

    // ---- 3. Pause: zero draws, zero page animation-frame callbacks ----
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1500);
    const slot = page.locator('#connected-pause-services');
    await slot.getByRole('button', { name: PAGES.services.es.pause, exact: true }).click();
    await page.waitForTimeout(1500);
    const pausedBefore = await counters(page);
    await page.waitForTimeout(4000);
    const pausedAfter = await counters(page);
    metrics.pausedDraws = pausedAfter.frames - pausedBefore.frames;
    metrics.pausedRafCalls = pausedAfter.raf - pausedBefore.raf;
    report.paused = { windowSeconds: 4, draws: metrics.pausedDraws, rafCalls: metrics.pausedRafCalls, timeoutCalls: pausedAfter.timeouts - pausedBefore.timeouts, note: 'timeout calls come from the whole page and are reported, not gated' };
    await slot.getByRole('button', { name: PAGES.services.es.resume, exact: true }).click();
    const resumedFrom = await counters(page);
    await page.waitForTimeout(2000);
    report.paused.resumedDraws = (await counters(page)).frames - resumedFrom.frames;
    if (report.paused.resumedDraws <= 0) failures.push('Resume did not draw again');

    // ---- 4. Hidden: a second tab hides the first (headed Chromium only) ----
    let windowControl = null;
    let hiddenFrames = 0;
    if (HEADED) {
      const session = await context.newCDPSession(page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      windowControl = { session, windowId };
      await session.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } });
    }
    await page.waitForTimeout(1000);
    const visibility = await page.evaluate(() => document.visibilityState);
    if (visibility === 'hidden') {
      const hiddenBefore = await counters(page);
      await page.waitForTimeout(4000);
      hiddenFrames = (await counters(page)).frames;
      metrics.hiddenDraws = hiddenFrames - hiddenBefore.frames;
    } else {
      metrics.hiddenDraws = null; // not hidden in this mode: the checkpoint stays OPEN rather than being faked
    }
    report.hidden = { visibilityState: visibility, draws: metrics.hiddenDraws ?? 'not measured (the page was not hidden: run with --headed so the window can be minimized)', via: HEADED ? 'the real browser window was minimized (CDP Browser.setWindowBounds), then restored' : 'not attempted' };
    if (windowControl) await windowControl.session.send('Browser.setWindowBounds', { windowId: windowControl.windowId, bounds: { windowState: 'normal' } });
    await page.bringToFront();
    await page.waitForTimeout(1500);
    report.hidden.resumedAfterShow = (await counters(page)).frames > hiddenFrames;

    // ---- 5. Footer: the scene is suspended ----
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(2500);
    const footerBefore = await counters(page);
    await page.waitForTimeout(4000);
    metrics.footerDraws = (await counters(page)).frames - footerBefore.frames;
    report.footer = { windowSeconds: 4, draws: metrics.footerDraws };
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    // ---- 6. Five route changes: one context, no listener growth ----
    const nav = async (target) => {
      const pathname = `${basePath}${PAGES[target].es.pathname}`;
      await page.locator(`a[data-app-bar-nav-link]:is([href="${pathname}"], [href="${pathname}#site-top"]):visible`).first().click();
      await page.waitForURL((u) => u.pathname === pathname);
      if (!(await waitLive(page))) failures.push(`${target}: the scene did not come back after a route change`);
      if ((await page.locator('canvas').count()) !== 1) failures.push(`${target}: not exactly one canvas after a route change`);
    };
    for (const target of ['projects', 'services', 'projects']) await nav(target); // warm-up
    const listenersBefore = await cdpMetric('JSEventListeners');
    const heapBefore = await cdpMetric('JSHeapUsedSize');
    for (const target of ['services', 'projects', 'services', 'projects', 'services']) await nav(target);
    const listenersAfter = await cdpMetric('JSEventListeners');
    const heapAfter = await cdpMetric('JSHeapUsedSize');
    metrics.listenerGrowth = listenersAfter - listenersBefore;
    metrics.maxContexts = await page.evaluate(() => window.__hw.contexts.max);
    report.routeChanges = { count: 5, listeners: [listenersBefore, listenersAfter], heapMiB: [round(heapBefore / 1048576, 1), round(heapAfter / 1048576, 1)], contextsCreatedInDocument: await page.evaluate(() => window.__hw.contexts.creates) };

    // ---- 7. Cold and warm: bytes on the first load, and a second route from the shared HTTP cache ----
    const emittedDir = path.join(outDir, '_next', 'static', 'chunks');
    const emitted = fs.readdirSync(emittedDir).filter((name) => /\.(js|css)$/.test(name)).map((name) => ({ path: 'chunks/' + name, rawBytes: 0, brotliBytes: 0, imports: chunkImports(fs.readFileSync(path.join(emittedDir, name), 'utf8'), 'chunks/' + name) }));
    const engineNames = (pathname) => {
      const html = fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
      const referenced = [...new Set([...html.matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)].map((match) => match[1]))];
      return buildRouteClosure({ referenced, chunks: emitted }).closure.chunks.map((item) => item.path.split('/').pop());
    };
    const engine = new Set(engineNames(PAGES.services.es.pathname));
    const cacheContext = await browser.newContext({ viewport: VIEWPORT });
    const cachePage = await cacheContext.newPage();
    const resources = async () => cachePage.evaluate(() => performance.getEntriesByType('resource').filter((entry) => /\/_next\/static\/chunks\/.+\.js$/.test(entry.name)).map((entry) => ({ name: entry.name.split('/').pop(), transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize })));
    await cachePage.goto(url(PAGES.services.es.pathname), { waitUntil: 'load' });
    await waitLive(cachePage);
    const cold = await resources();
    await cachePage.goto(url(PAGES.projects.es.pathname), { waitUntil: 'load' });
    await waitLive(cachePage);
    const warm = await resources();
    const engineCold = cold.filter((entry) => engine.has(entry.name));
    const engineWarm = warm.filter((entry) => engine.has(entry.name));
    report.cache = {
      engineChunks: [...engine],
      engineColdTransferKiB: round(engineCold.reduce((sum, entry) => sum + entry.transferSize, 0) / 1024, 1),
      engineColdRequested: engineCold.length,
      engineWarmServedFromCache: engineWarm.filter((entry) => entry.transferSize === 0 && entry.encodedBodySize > 0).length,
      engineWarmNewDownloads: engineWarm.filter((entry) => entry.transferSize > 0).map((entry) => entry.name),
      allChunksColdRequests: cold.length,
      allChunksWarmFromCache: warm.filter((entry) => entry.transferSize === 0 && entry.encodedBodySize > 0).length,
      note: 'transfer sizes are uncompressed, as the local server sends them; the Brotli size of the closure is gated by measure:connected-studio. Cache reuse is reported apart and never subtracts from the cold figure.',
    };
    await cacheContext.close();

    const judged = judgeHardware({ ...metrics }, TIER);
    report.metrics = metrics;
    report.labelsOk = labelsOk;
    report.hardwareVerdict = { verdict: judged.verdict, rows: Object.fromEntries(Object.entries(judged.rows).map(([key, row]) => [key, `${row.verdict} (${row.value ?? 'not measured'} vs ${row.limit})`])) };
    if (!labelsOk) failures.push('labels failed continuity: hidden, too small, tilted, interactive or over reading text');
  }
  await first.context.close();

  // ---- 8. 200% and 400% viewport-equivalent, live (this tier) ----
  if (live && BROWSER === 'chromium') {
    report.zoom = [];
    for (const [label, viewport, dpr] of [['200%', { width: 720, height: 450 }, 2], ['400%', { width: 320, height: 256 }, 4]]) {
      for (const route of ['services', 'projects']) {
        for (const locale of ['es', 'en']) {
          const { context, page } = await openPage(viewport, dpr);
          await page.goto(url(PAGES[route][locale].pathname), { waitUntil: 'load' });
          const wentLive = await waitLive(page, 8_000); // at 720 and 320 CSS px the tier is compact, which a wide-only candidate keeps off: static is the honest result there
          await page.waitForTimeout(1500);
          const checks = await page.evaluate(() => {
            const width = window.innerWidth;
            const overflowing = [...document.querySelectorAll('main *, [data-app-bar] *, [data-site-footer] *')].filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && rect.right > width + 1 && getComputedStyle(element).position !== 'fixed' && !element.closest('[data-connected-ground]');
            }).length;
            const h1 = document.querySelector('main h1');
            const h1Rect = h1?.getBoundingClientRect();
            const pause = document.querySelector('[data-connected-pause]')?.getBoundingClientRect();
            return {
              innerWidth: width,
              devicePixelRatio: window.devicePixelRatio,
              horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
              overflowingElements: overflowing,
              h1Visible: Boolean(h1Rect && h1Rect.width > 0 && h1Rect.right <= width + 1),
              pause: pause ? { width: Math.round(pause.width), height: Math.round(pause.height), inViewport: pause.left >= 0 && pause.right <= width + 1 } : null,
              footerPresent: Boolean(document.querySelector('[data-site-footer]')),
            };
          });
          const labels = wentLive ? await labelGeometry(page) : null;
          await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await page.waitForTimeout(500);
          const footerVisible = await page.locator('[data-site-footer]').isVisible();
          const entry = { zoom: label, route, locale, wentLive, ...checks, footerReachable: footerVisible, labels };
          entry.ok = !entry.horizontalScroll && entry.overflowingElements === 0 && entry.h1Visible && entry.footerReachable && (!entry.pause || (entry.pause.height >= 44 && entry.pause.inViewport)) && (!labels || (labels.allUpright && labels.overlappingMasks === 0));
          if (!entry.ok) failures.push(`${label} ${route}/${locale}: layout check failed (${JSON.stringify({ horizontalScroll: entry.horizontalScroll, overflowing: entry.overflowingElements, h1Visible: entry.h1Visible, pause: entry.pause, footer: entry.footerReachable })})`);
          report.zoom.push(entry);
          await context.close();
        }
      }
    }
  }

  // ---- 9. Rendered-pixel contrast, live and static, with the text hidden to see what is behind it ----
  if (BROWSER === 'chromium') {
    report.contrast = { method: 'each text element is hidden, the viewport is screenshotted, and the WCAG contrast between the computed text colour (alpha blended) and the pixels behind its box is recorded: the gate is the 5th percentile over the box (the single worst pixel is reported too), and text covered by another element is skipped; large text is 24 px, or 18.66 px bold, and needs 3:1, everything else 4.5:1', samples: [], failures: [] };
    const decoder = await (await browser.newContext()).newPage();
    await decoder.goto('about:blank');
    for (const mode of ['static', 'live']) {
      if (mode === 'live' && !live) continue;
      const { context, page } = await openPage(VIEWPORT);
      if (mode === 'static') {
        await page.emulateMedia({ reducedMotion: 'reduce' });
      }
      for (const route of ['services', 'projects']) {
        await page.goto(url(PAGES[route].es.pathname), { waitUntil: 'load' });
        if (mode === 'live') await waitLive(page);
        await page.waitForTimeout(4000);
        const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        for (const y of [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(total * fraction))) {
          await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
          await page.waitForTimeout(700);
          const targets = await page.evaluate(() => {
            const out = [];
            for (const element of document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main dt, main dd, [data-site-footer] a, [data-site-footer] p, [data-site-footer] li, [data-app-bar] a')) {
              const own = [...element.childNodes].filter((node) => node.nodeType === 3 && node.textContent.trim()).length;
              if (!own) continue;
              const rect = element.getBoundingClientRect();
              if (rect.width < 4 || rect.height < 4 || rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth) continue;
              const style = getComputedStyle(element);
              if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) < 0.05) continue;
              // Skip text something else covers (the sticky App Bar over a scrolled element, for one): the pixels there are not its background.
              const probe = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
              if (!probe || !(element === probe || element.contains(probe) || probe.contains(element))) continue;
              out.push({ index: out.length, text: element.textContent.trim().slice(0, 40), color: style.color, fontSize: parseFloat(style.fontSize), weight: Number(style.fontWeight) || 400, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } });
              element.setAttribute('data-contrast-target', String(out.length - 1));
            }
            document.head.insertAdjacentHTML('beforeend', '<style id="contrast-hide">[data-contrast-target]{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important}</style>');
            return out;
          });
          await page.waitForTimeout(150);
          const png = await page.screenshot({ type: 'png' });
          await page.evaluate(() => {
            document.getElementById('contrast-hide')?.remove();
            document.querySelectorAll('[data-contrast-target]').forEach((element) => element.removeAttribute('data-contrast-target'));
          });
          const pixels = await decoder.evaluate(async ({ base64, rects }) => {
            const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
            const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const context2d = canvas.getContext('2d', { willReadFrequently: true });
            context2d.drawImage(bitmap, 0, 0);
            return rects.map((rect) => {
              const x = Math.max(0, Math.floor(rect.left));
              const yy = Math.max(0, Math.floor(rect.top));
              const w = Math.max(1, Math.min(bitmap.width - x, Math.ceil(rect.width)));
              const h = Math.max(1, Math.min(bitmap.height - yy, Math.ceil(rect.height)));
              const data = context2d.getImageData(x, yy, w, h).data;
              const step = Math.max(1, Math.floor((w * h) / 300));
              const samples = [];
              for (let i = 0; i < w * h; i += step) samples.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
              return samples;
            });
          }, { base64: png.toString('base64'), rects: targets.map((target) => target.rect) });
          targets.forEach((target, i) => {
            const match = target.color.match(/rgba?\(([^)]+)\)/);
            if (!match) return;
            const [r, g, b, a = 1] = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
            let worst = Infinity;
            let worstBackground = null;
            const ratios = [];
            for (const bg of pixels[i]) {
              const blended = [r, g, b].map((channel, k) => Math.round(a * channel + (1 - a) * bg[k]));
              const ratio = contrastRatio(blended, bg);
              ratios.push(ratio);
              if (ratio < worst) {
                worst = ratio;
                worstBackground = bg;
              }
            }
            // Gate on the 5th percentile: a thin underline, a border or a lone node pixel inside the element's box is not the
            // background of its glyphs. The single worst pixel is still reported.
            const gated = percentile(ratios, 5);
            const large = target.fontSize >= 24 || (target.fontSize >= 18.66 && target.weight >= 700);
            const required = large ? 3 : 4.5;
            const sample = { mode, route, scrollY: y, text: target.text, fontSize: target.fontSize, ratio: round(gated, 2), worstPixelRatio: round(worst, 2), required, textColor: target.color, worstBackground: worstBackground?.join(','), rect: target.rect };
            report.contrast.samples.push(sample);
            if (gated < required) report.contrast.failures.push(sample);
          });
        }
      }
      await context.close();
    }
    report.contrast.measured = report.contrast.samples.length;
    report.contrast.lowest = report.contrast.samples.reduce((low, sample) => (low === null || sample.ratio - sample.required < low.ratio - low.required ? sample : low), null);
    if (!report.contrast.measured) failures.push('the contrast pass measured no text');
    if (report.contrast.failures.length) failures.push(`${report.contrast.failures.length} text samples are below their required contrast`);
  }

  // ---- 10. Accessibility tree (a proxy for assistive technology, not a screen-reader result) ----
  if (BROWSER === 'chromium') {
    report.accessibilityTree = {};
    for (const mode of ['static', ...(live ? ['live'] : [])]) {
      const { context, page } = await openPage(VIEWPORT);
      if (mode === 'static') await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url(PAGES.services.es.pathname), { waitUntil: 'load' });
      if (mode === 'live') await waitLive(page);
      await page.waitForTimeout(1500);
      const tree = await page.locator('body').ariaSnapshot();
      const pauseButtons = (tree.match(/button "(Pausar fondo|Reanudar fondo)"/g) ?? []).length;
      report.accessibilityTree[mode] = {
        lines: tree.split('\n').length,
        h1: (tree.match(/heading "[^"]*" \[level=1\]/g) ?? []).length,
        pauseButtons,
        exposesCanvasOrLabels: /canvas/i.test(tree),
        sample: tree.split('\n').slice(0, 60).join('\n'),
      };
      if (report.accessibilityTree[mode].h1 !== 1) failures.push(`${mode}: the accessibility tree has ${report.accessibilityTree[mode].h1} level-1 headings`);
      if (mode === 'live' && pauseButtons !== 1) failures.push(`live: the accessibility tree exposes ${pauseButtons} Pause buttons`);
      if (mode === 'static' && pauseButtons !== 0) failures.push(`static: the accessibility tree exposes a Pause button`);
      if (report.accessibilityTree[mode].exposesCanvasOrLabels) failures.push(`${mode}: the canvas is exposed to assistive technology`);
      await context.close();
    }
  }
} catch (error) {
  failures.push(`the run stopped: ${error.message}`);
} finally {
  await browser.close();
  server.close();
}

report.failures = failures;
const outFile = argument('out');
if (outFile) fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
const printable = { ...report, accessibilityTree: report.accessibilityTree ? Object.fromEntries(Object.entries(report.accessibilityTree).map(([k, v]) => [k, { ...v, sample: undefined }])) : undefined, contrast: report.contrast ? { ...report.contrast, samples: undefined, failures: report.contrast.failures } : undefined };
console.log(JSON.stringify(printable, null, 2));
if (failures.length) {
  console.error('\nHardware candidate checks failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`\nHardware candidate verdict for the ${TIER} tier: ${report.hardwareVerdict?.verdict ?? 'OPEN'} (a candidate run, not the owner's acceptance).`);
