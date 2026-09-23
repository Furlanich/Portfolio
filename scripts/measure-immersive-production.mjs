// Measures the production immersive homepage against ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE gates.
// Usage: npm run measure:immersive   (builds, serves out/ locally, drives Chromium)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'out');
const KIB = 1024;
const GATES = {
  immersiveBrotliKiB: 120,
  workingHeadroomKiB: 15,
  firstPosterKiB: 150,
  frameIntervalP95Ms: 20,
  longTaskMs: 50,
  cls: 0,
  playingVideos: 1,
};
// Owner-accepted exception recorded in the plan (PR6 JavaScript budget deviation).
const ACCEPTED_HEADROOM_KiB = Number(process.env.IMMERSIVE_ACCEPTED_HEADROOM_KIB ?? 6);
// Home JavaScript (Brotli, quality 11) on main before the enhancement, at ff6eadf. Incremental
// cost is measured against this whole-page baseline because chunk boundaries move between
// builds; re-measure it whenever shared chunks change.
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
const scriptFiles = (urls) => [...new Set(urls.filter((url) => url.startsWith(origin) && url.endsWith('.js')).map((url) => path.join(outDir, new URL(url).pathname)))];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const failures = [];
const report = {};

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const homeUrls = [];
  page.on('request', (request) => homeUrls.push(request.url()));
  await page.addInitScript(() => {
    window.__immersive = { longTasks: [], shifts: [], frames: [] };
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => window.__immersive.longTasks.push({ start: entry.startTime, duration: entry.duration }))).observe({ type: 'longtask', buffered: true });
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) window.__immersive.shifts.push({ value: entry.value, time: entry.startTime }); })).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(`${origin}/`, { waitUntil: 'load' });
  const activatedAt = await page.waitForFunction(() => document.querySelector('[data-instrument]')?.dataset.immersiveMode === 'webgl' && performance.now(), null, { timeout: 30_000 }).then((handle) => handle.jsonValue());
  await page.waitForTimeout(500);

  // Same method as the baseline: chunks referenced by the exported Home HTML plus the lazy runtime.
  const homeHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
  const referenced = [...new Set([...homeHtml.matchAll(/\/_next\/static\/chunks\/([^"'\s]+\.js)/g)].map((match) => path.join(outDir, '_next/static/chunks', match[1])))];
  const lazy = scriptFiles(homeUrls).filter((file) => !referenced.includes(file) && fs.readFileSync(file, 'utf8').includes('webglcontextlost'));
  const homeScripts = [...referenced, ...lazy];
  const totals = homeScripts.map(sizes).reduce((sum, item) => ({ raw: sum.raw + item.raw, gzip: sum.gzip + item.gzip, brotli: sum.brotli + item.brotli }), { raw: 0, gzip: 0, brotli: 0 });
  const runtime = lazy.map(sizes)[0] ?? { raw: 0, gzip: 0, brotli: 0 };
  report.immersiveJs = {
    homeTotalBrotliKiB: +(totals.brotli / KIB).toFixed(1),
    baselineHomeBrotliKiB: +(BASELINE_HOME_JS_BROTLI / KIB).toFixed(1),
    brotliKiB: +((totals.brotli - BASELINE_HOME_JS_BROTLI) / KIB).toFixed(1),
    lazyRuntime: { rawKiB: +(runtime.raw / KIB).toFixed(1), gzipKiB: +(runtime.gzip / KIB).toFixed(1), brotliKiB: +(runtime.brotli / KIB).toFixed(1) },
  };
  report.activationMarks = await page.evaluate(() => Object.fromEntries(performance.getEntriesByType('mark').filter((mark) => mark.name.startsWith('immersive:')).map((mark) => [mark.name, Math.round(mark.startTime)])));
  report.firstPosterKiB = +(fs.statSync(path.join(outDir, 'brand/immersive/recognition.svg')).size / KIB).toFixed(2);
  report.activationToFirstFrameMs = Math.round(activatedAt);

  // Scripted native scroll through the sequence and back, sampling animation frames.
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
      shifts: window.__immersive.shifts,
      playingVideos: [...document.querySelectorAll('video')].filter((video) => !video.paused).length,
      canvases: document.querySelectorAll('canvas').length,
    };
  });
  report.frameIntervalP95Ms = +metrics.p95.toFixed(1);
  const activationEnd = activatedAt + 500;
  report.activationLongTasksMs = metrics.longTasks.filter((task) => task.start < activationEnd).map((task) => Math.round(task.duration));
  report.interactionLongTasksMs = metrics.longTasks.filter((task) => task.start >= activationEnd).map((task) => Math.round(task.duration));
  report.cls = +metrics.shifts.reduce((sum, shift) => sum + shift.value, 0).toFixed(4);
  report.playingVideos = metrics.playingVideos;

  // Repeated entry/exit through client navigation must not accumulate canvases or listeners.
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
    await page.waitForFunction(() => document.querySelector('[data-instrument]')?.dataset.immersiveMode === 'webgl', null, { timeout: 30_000 });
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

  const headroom = GATES.immersiveBrotliKiB - report.immersiveJs.brotliKiB;
  report.headroomKiB = +headroom.toFixed(1);
  if (report.immersiveJs.brotliKiB > GATES.immersiveBrotliKiB) failures.push(`immersive JS ${report.immersiveJs.brotliKiB} KiB Brotli exceeds ${GATES.immersiveBrotliKiB} KiB`);
  if (headroom < Math.min(GATES.workingHeadroomKiB, ACCEPTED_HEADROOM_KiB)) failures.push(`headroom ${report.headroomKiB} KiB is below the accepted ${ACCEPTED_HEADROOM_KiB} KiB`);
  if (report.firstPosterKiB > GATES.firstPosterKiB) failures.push(`first poster ${report.firstPosterKiB} KiB exceeds ${GATES.firstPosterKiB} KiB`);
  if (report.frameIntervalP95Ms > GATES.frameIntervalP95Ms) failures.push(`frame interval p95 ${report.frameIntervalP95Ms} ms exceeds ${GATES.frameIntervalP95Ms} ms`);
  const longestInteraction = Math.max(0, ...report.interactionLongTasksMs);
  if (longestInteraction >= GATES.longTaskMs) failures.push(`interaction main-thread task of ${longestInteraction} ms reaches ${GATES.longTaskMs} ms`);
  if (report.cls > GATES.cls) failures.push(`layout shift ${report.cls} during activation/scroll`);
  if (report.playingVideos > GATES.playingVideos) failures.push(`${report.playingVideos} videos playing`);
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
