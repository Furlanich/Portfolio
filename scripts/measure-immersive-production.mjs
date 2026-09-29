// Measures the production Home against the section 14 gates of PLAN-SKY-CHART-HOME-REDESIGN-V2
// and ADR-SKY-CHART-HOMEPAGE-RUNTIME (amended 2026-09-28).
// Usage: npm run measure:immersive [-- --skip-build]   (builds, serves out/ locally, drives Chromium)
//
// What is gated here, and how:
//   - Incremental immersive JavaScript. The ADR's definition is "runtime chunk plus three": the
//     chunk(s) the dynamic `import('./runtime/create-sky-chart-scene')` loads, at <=120 KiB Brotli.
//     They are identified from Resource Timing (scripts that started between the runtime's
//     `immersive:import-start` and `immersive:import-end` marks and are not referenced by the
//     exported Home HTML), and the script fails if none of them contains three (`webglcontextlost`).
//     The old whole-page delta (Home JS minus the ff6eadf baseline) is still reported, but only as
//     a figure: it also counts AppBarBehavior and PositionFixToggle, which the ADR budgets
//     separately (<=6 KiB combined), and every other Home script added since the baseline.
//   - Draw calls per frame (<=28), label textures (<=20, each <=1024x64), idle rendering (0 frames
//     after settle, and while fully receded), backdrop-filter surfaces per viewport at each section (<=3;
//     the half-viewport sweep between sections is reported, plan PR 11 escalation E1), canvas
//     pixel ratio caps (<=1.5 wide, <=1.25 compact). The dev-only debug hook is compiled out of
//     production, so tests/e2e/support/production-instrumentation.mjs observes the WebGL calls
//     and the DOM instead.
//   - Layout shift *from the enhancement* = 0. Shifts are attributed to the enhancement when they
//     happen at or after `immersive:import-start` (and not within 500 ms of a web font finishing), or
//     have a source inside the canvas, scrim or Pause pill. The whole-page total (the font-swap reflow of the App Bar and hero text at first
//     paint, before the runtime import) is reported and judged under `measure:home-vitals` against
//     the web-vitals CLS threshold.
//   - Canvas and listener lifecycle counts across remounts.
//   - Frame-interval p95 and interaction long tasks are ADVISORY here: they are gated on
//     hardware-accelerated GPUs only (amended ADR); this script runs SwiftShader through the
//     explicit test-only software-renderer override.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';
import {
  installInstrumentation,
  kib,
  measureIdleFrames,
  readCanvasPixelRatio,
  readLayoutShifts,
  readWebglMetrics,
  sweepBackdropSurfaces,
} from '../tests/e2e/support/production-instrumentation.mjs';

const root = process.cwd();
const outDir = path.join(root, 'out');
const KIB = 1024;
const GATES = {
  immersiveBrotliKiB: 120,
  workingHeadroomKiB: 15,
  firstPosterKiB: 150,
  frameIntervalP95Ms: 20,
  longTaskMs: 50,
  layoutShiftFromEnhancement: 0,
  playingVideos: 1,
  drawCallsPerFrame: 28,
  labelTextures: 20,
  labelTextureMax: [1024, 64],
  idleFrames: 0,
  backdropSurfaces: 3,
  pixelRatioWide: 1.5,
  pixelRatioCompact: 1.25,
};
// Owner-accepted exception recorded in the plan (PR6 JavaScript budget deviation).
const ACCEPTED_HEADROOM_KiB = Number(process.env.IMMERSIVE_ACCEPTED_HEADROOM_KIB ?? 6);
// Home JavaScript (Brotli, quality 11) on main before the enhancement, at ff6eadf. The whole-page
// delta against it is a reported figure only (see the header); re-measure it whenever shared
// chunks change.
const BASELINE_HOME_JS_BROTLI = Number(process.env.IMMERSIVE_BASELINE_HOME_JS_BROTLI ?? 158093);

if (!process.argv.includes('--skip-build')) {
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '' } });
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain' };
const server = http.createServer((request, response) => {
  let file = path.join(outDir, decodeURIComponent(new URL(request.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const sizes = (file) => {
  const buffer = fs.readFileSync(file);
  return {
    raw: buffer.length,
    gzip: zlib.gzipSync(buffer, { level: 9 }).length,
    brotli: zlib.brotliCompressSync(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
  };
};
const chunkFileFor = (url) => path.join(outDir, new URL(url).pathname);

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const failures = [];
const report = {};

/** A page with the test-only software-renderer override and the production instrumentation installed. */
async function instrumentedPage(options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  // B1 (amended ADR 2026-09-28): SwiftShader is a software renderer and fails the capability gate
  // on its own. This measurement is explicitly about SwiftShader (the only renderer available
  // here), so it sets the same test-only override the Playwright specs use.
  await page.addInitScript(() => {
    window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
  });
  await page.addInitScript(installInstrumentation);
  await page.addInitScript(() => {
    window.__immersive = { longTasks: [], frames: [] };
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => window.__immersive.longTasks.push({ start: entry.startTime, duration: entry.duration }))).observe({ type: 'longtask', buffered: true });
  });
  return { context, page };
}

const waitForWebgl = (page) =>
  page.waitForFunction(() => document.querySelector('[data-instrument]')?.dataset.immersiveMode === 'webgl' && performance.now(), null, { timeout: 30_000 }).then((handle) => handle.jsonValue());

try {
  const { context, page } = await instrumentedPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  await page.goto(`${origin}/`, { waitUntil: 'load' });
  const activatedAt = await waitForWebgl(page);
  await page.waitForTimeout(500);

  // --- JavaScript: the ADR's definition, plus the whole-page delta as a reported figure. -------
  const homeHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
  const referenced = [...new Set([...homeHtml.matchAll(/\/_next\/static\/chunks\/([^"'\s]+\.js)/g)].map((match) => path.join(outDir, '_next/static/chunks', match[1])))];
  const importWindow = await page.evaluate(() => ({
    start: performance.getEntriesByName('immersive:import-start')[0]?.startTime ?? null,
    end: performance.getEntriesByName('immersive:import-end')[0]?.startTime ?? null,
    scripts: performance.getEntriesByType('resource').filter((entry) => /\.js(?:\?|$)/.test(entry.name)).map((entry) => ({ url: entry.name, startTime: entry.startTime })),
  }));
  if (importWindow.start === null || importWindow.end === null) failures.push('the runtime import marks (immersive:import-start/end) were not recorded');
  const lazyFiles = [...new Set(
    importWindow.scripts
      .filter((script) => script.url.startsWith(origin) && script.startTime >= (importWindow.start ?? Infinity) - 1 && script.startTime <= (importWindow.end ?? -Infinity))
      .map((script) => chunkFileFor(script.url)),
  )].filter((file) => !referenced.includes(file));
  const lazyChunks = lazyFiles.map((file) => ({ file: path.basename(file), ...sizes(file), source: fs.readFileSync(file, 'utf8') }));
  if (!lazyChunks.some((chunk) => chunk.source.includes('webglcontextlost'))) failures.push('the lazy runtime chunk set does not contain three (no "webglcontextlost" marker)');
  const lazyTotal = lazyChunks.reduce((sum, chunk) => ({ raw: sum.raw + chunk.raw, gzip: sum.gzip + chunk.gzip, brotli: sum.brotli + chunk.brotli }), { raw: 0, gzip: 0, brotli: 0 });
  const wholePage = [...referenced, ...lazyFiles].map(sizes).reduce((sum, item) => sum + item.brotli, 0);
  const wholePageDelta = wholePage - BASELINE_HOME_JS_BROTLI;
  report.immersiveJs = {
    definition: 'incremental immersive JavaScript = the lazy runtime chunk(s) including three (ADR-SKY-CHART-HOMEPAGE-RUNTIME)',
    lazyChunks: lazyChunks.map((chunk) => ({ file: chunk.file, rawKiB: kib(chunk.raw), gzipKiB: kib(chunk.gzip), brotliKiB: kib(chunk.brotli) })),
    brotliKiB: +(lazyTotal.brotli / KIB).toFixed(1),
    wholePageReported: {
      homeTotalBrotliKiB: +(wholePage / KIB).toFixed(1),
      baselineHomeBrotliKiB: +(BASELINE_HOME_JS_BROTLI / KIB).toFixed(1),
      deltaKiB: +(wholePageDelta / KIB).toFixed(1),
      note: 'reported only, not gated: the delta also counts AppBarBehavior and PositionFixToggle (budgeted separately, <=6 KiB combined) and other Home JavaScript added since ff6eadf',
    },
  };
  report.activationMarks = await page.evaluate(() => Object.fromEntries(performance.getEntriesByType('mark').filter((mark) => mark.name.startsWith('immersive:')).map((mark) => [mark.name, Math.round(mark.startTime)])));
  report.firstPosterKiB = +(fs.statSync(path.join(outDir, 'brand/sky-chart/environment-wide.webp')).size / KIB).toFixed(2);
  report.activationToFirstFrameMs = Math.round(activatedAt);

  // --- Scripted native scroll through the sequence and back, sampling animation frames. --------
  await page.evaluate(() => {
    const frames = window.__immersive.frames;
    let last = performance.now();
    const sample = (now) => { frames.push(now - last); last = now; if (frames.length < 100000) requestAnimationFrame(sample); };
    requestAnimationFrame(sample);
  });
  const sequenceHeight = await page.evaluate(() => document.querySelector('[data-instrument]').getBoundingClientRect().height);
  for (let pass = 0; pass < 20; pass += 1) {
    const direction = pass % 2 === 0 ? 1 : -1;
    for (let step = 0; step < Math.ceil(sequenceHeight / 120); step += 1) {
      await page.mouse.wheel(0, 120 * direction);
      await page.waitForTimeout(16);
    }
  }
  const metrics = await page.evaluate(() => {
    const intervals = window.__immersive.frames.slice(5).sort((a, b) => a - b);
    const p95 = intervals[Math.floor(intervals.length * 0.95)] ?? 0;
    return {
      p95,
      longTasks: window.__immersive.longTasks,
      playingVideos: [...document.querySelectorAll('video')].filter((video) => !video.paused).length,
      canvases: document.querySelectorAll('canvas').length,
    };
  });
  report.frameIntervalP95Ms = +metrics.p95.toFixed(1);
  const activationEnd = activatedAt + 500;
  report.activationLongTasksMs = metrics.longTasks.filter((task) => task.start < activationEnd).map((task) => Math.round(task.duration));
  report.interactionLongTasksMs = metrics.longTasks.filter((task) => task.start >= activationEnd).map((task) => Math.round(task.duration));
  report.playingVideos = metrics.playingVideos;

  // --- Draw calls, label textures and idle rendering (observed at the WebGL API). ---------------
  // Idle: scroll into Connect, wait until rendering has been quiet for 1.5 s, then count frames in
  // the next 2 s; repeat while fully receded (rendering is suspended at k = 1).
  await page.evaluate(() => {
    const chapter = document.querySelector('section[data-instrument-chapter="connection"]').getBoundingClientRect();
    window.scrollBy({ top: chapter.top + chapter.height / 2 - window.innerHeight / 2, behavior: 'instant' });
  });
  const idleInChapter = await measureIdleFrames(page, { reacted: { attribute: 'data-rendered-chapter', value: 'connection' } });
  await page.evaluate(() => {
    const services = document.getElementById('services').getBoundingClientRect();
    window.scrollBy({ top: services.top - 96, behavior: 'instant' });
  });
  const idleReceded = await measureIdleFrames(page, { reacted: { attribute: 'data-recede', value: '1' } });
  const webgl = await readWebglMetrics(page);
  report.webgl = {
    ...webgl,
    idle: { settledInChapter: idleInChapter, fullyReceded: idleReceded },
    note: 'draw calls are WebGL2 draw* calls between two clear calls (one renderer.render); label textures are distinct textures uploaded from a canvas source',
  };

  // --- Backdrop-filter surfaces per viewport (App Bar excluded): gated at each section, swept (reported) over the page. ---
  report.backdropSurfaces = {};
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 800 }]) {
    await page.setViewportSize(viewport);
    report.backdropSurfaces[viewport.width] = await sweepBackdropSurfaces(page);
  }
  await page.setViewportSize({ width: 1440, height: 900 });

  // --- Layout shift: attributed to the enhancement (gated) and whole-page (reported). ----------
  report.layoutShift = await readLayoutShifts(page);

  // --- Canvas pixel ratio caps on a 3x display. ------------------------------------------------
  report.pixelRatio = {};
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const dense = await instrumentedPage({ viewport, deviceScaleFactor: 3 });
    await dense.page.goto(`${origin}/`, { waitUntil: 'load' });
    await waitForWebgl(dense.page);
    await dense.page.waitForTimeout(300);
    report.pixelRatio[viewport.width] = await readCanvasPixelRatio(dense.page);
    await dense.context.close();
  }

  // --- Repeated entry/exit through client navigation must not accumulate canvases or listeners.
  const readCounts = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const { metrics: values } = await cdp.send('Performance.getMetrics');
    const value = (name) => values.find((metric) => metric.name === name)?.value ?? 0;
    return { canvases: await page.locator('canvas').count(), listeners: value('JSEventListeners'), nodes: value('Nodes') };
  };
  const remount = async () => {
    await page.locator('header').getByRole('link', { name: 'Servicios', exact: true }).first().click();
    await page.waitForURL('**/servicios/');
    await page.goBack();
    await page.evaluate(() => window.scrollTo(0, 0));
    // N3 lock transfer: Next's own back-navigation scroll restoration can still land *after*
    // this first scrollTo(0, 0) (it is not guaranteed to have applied by the time goBack()'s
    // promise resolves), pulling the page back down and away from [data-instrument] again. The
    // wait predicate re-issues scrollTo(0, 0) on every poll while scrollY > 0, so it keeps
    // winning that race until the runtime's near-viewport gate can actually see the root.
    await page.waitForFunction(() => {
      if (window.scrollY > 0) window.scrollTo(0, 0);
      return document.querySelector('[data-instrument]')?.dataset.immersiveMode === 'webgl';
    }, null, { timeout: 30_000 });
    await page.waitForTimeout(800);
  };
  // One warm-up remount so router and prefetch listeners are already established.
  await remount();
  const afterTraversal = await readCounts();
  for (let cycle = 0; cycle < 5; cycle += 1) {
    await remount();
  }
  const afterRemounts = await readCounts();
  report.resources = { afterTraversal: { ...afterTraversal, traversals: 20 }, afterRemounts: { ...afterRemounts, remounts: 5 } };

  // --- Gates. ----------------------------------------------------------------------------------
  const headroom = GATES.immersiveBrotliKiB - report.immersiveJs.brotliKiB;
  report.headroomKiB = +headroom.toFixed(1);
  if (report.immersiveJs.brotliKiB > GATES.immersiveBrotliKiB) failures.push(`immersive JS (runtime chunk plus three) ${report.immersiveJs.brotliKiB} KiB Brotli exceeds ${GATES.immersiveBrotliKiB} KiB`);
  if (headroom < Math.min(GATES.workingHeadroomKiB, ACCEPTED_HEADROOM_KiB)) failures.push(`headroom ${report.headroomKiB} KiB is below the accepted ${ACCEPTED_HEADROOM_KiB} KiB`);
  if (report.firstPosterKiB > GATES.firstPosterKiB) failures.push(`first poster ${report.firstPosterKiB} KiB exceeds ${GATES.firstPosterKiB} KiB`);
  if (report.layoutShift.fromEnhancement > GATES.layoutShiftFromEnhancement) failures.push(`layout shift from the enhancement ${report.layoutShift.fromEnhancement} exceeds ${GATES.layoutShiftFromEnhancement}`);
  if (report.playingVideos > GATES.playingVideos) failures.push(`${report.playingVideos} videos playing`);
  if (webgl.renderedFrames === 0) failures.push('no WebGL frames were observed');
  if (webgl.drawCallsPerFrame.max > GATES.drawCallsPerFrame) failures.push(`${webgl.drawCallsPerFrame.max} draw calls in one frame exceeds ${GATES.drawCallsPerFrame}`);
  if (webgl.labelTextures.count > GATES.labelTextures) failures.push(`${webgl.labelTextures.count} label textures exceeds ${GATES.labelTextures}`);
  if (webgl.labelTextures.largest[0] > GATES.labelTextureMax[0] || webgl.labelTextures.largest[1] > GATES.labelTextureMax[1]) failures.push(`a label texture is ${webgl.labelTextures.largest.join('x')}, above ${GATES.labelTextureMax.join('x')}`);
  for (const [name, idle] of Object.entries(report.webgl.idle)) {
    if (idle.framesInWindow > GATES.idleFrames) failures.push(`${idle.framesInWindow} frames rendered while idle (${name})`);
  }
  for (const [width, sweep] of Object.entries(report.backdropSurfaces)) {
    if (sweep.max > GATES.backdropSurfaces) failures.push(`${sweep.max} backdrop-filter surfaces intersect the ${width}px viewport at a section, above ${GATES.backdropSurfaces}`);
  }
  for (const [width, ratio] of Object.entries(report.pixelRatio)) {
    const cap = Number(width) >= 1024 ? GATES.pixelRatioWide : GATES.pixelRatioCompact;
    if (!ratio) failures.push(`no canvas at ${width}px for the pixel-ratio check`);
    else if (Math.max(ratio.ratioX, ratio.ratioY) > cap + 0.01) failures.push(`canvas pixel ratio ${Math.max(ratio.ratioX, ratio.ratioY)} at ${width}px exceeds ${cap}`);
  }
  // N3 / amended ADR 2026-09-28: frame-interval p95 and main-thread interaction-task numbers
  // are acceptance gates on hardware-accelerated GPUs only (the plan's real-device protocol, or
  // a hardware-GPU runner) -- not here, under SwiftShader. Reported as advisory, never failures.
  const longestInteraction = Math.max(0, ...report.interactionLongTasksMs);
  report.advisory = {
    note: 'frameIntervalP95Ms and the interaction long-task numbers are advisory under SwiftShader (amended ADR 2026-09-28); they gate only on hardware-accelerated GPUs.',
    frameIntervalP95Ms: report.frameIntervalP95Ms,
    longestInteractionTaskMs: longestInteraction,
  };
  if (afterRemounts.canvases > 1) failures.push(`${afterRemounts.canvases} canvases after remounts`);
  if (afterRemounts.listeners > afterTraversal.listeners + 2) failures.push(`event listeners grew from ${afterTraversal.listeners} to ${afterRemounts.listeners}`);
  report.headroomNote = headroom < GATES.workingHeadroomKiB
    ? `below the ${GATES.workingHeadroomKiB} KiB working target; owner-accepted exception of ${ACCEPTED_HEADROOM_KiB} KiB applies`
    : 'meets the working target';
} finally {
  await browser.close();
  server.close();
}

console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error('\nImmersive production gates failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nImmersive production gates passed.');
