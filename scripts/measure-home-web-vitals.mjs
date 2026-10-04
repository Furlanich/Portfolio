// Synthetic (lab) LCP and INP for the immersive homepage: PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1
// Task 8.3 and the ADR-SKY-CHART-HOMEPAGE-RUNTIME p75 gates. These are throttled Chromium journeys,
// not field data.
// Usage: npm run measure:home-vitals [-- --skip-build] [--journeys=10] [--enhanced-journeys=5] [--out=path.json]
//
// Two variants run per profile and locale:
//   - static   : SwiftShader with no override. The amended ADR sends software renderers to the
//                static composition, so this is what a visitor without a hardware GPU gets. It
//                gates LCP and INP.
//   - enhanced : SwiftShader with the explicit test-only software-renderer override, so the
//                runtime activates. LCP gates here too (the H1 paints before the runtime loads).
//                INP is reported but ADVISORY: a software rasterizer compositing a full-viewport
//                WebGL layer is not representative of INP on a hardware GPU (amended ADR
//                2026-09-28); the hardware-GPU figure comes from the section 26 device protocol.
//
// Layout shift is judged here as a whole-page metric and GATED at the web-vitals "good" line
// (<=0.1), including any font-swap reflow of the App Bar and hero text when the web fonts arrive
// after first paint on a throttled network. The fallback faces in app/fonts.ts are metric-matched so
// the swap is nearly width-neutral (plan PR 11, owner decision E2, 2026-10-04: 0.178 before). The
// ADR's gate, "layout shift from the enhancement = 0", is measured separately: only shifts at or
// after the runtime's `immersive:import-start` mark that are not while a web font is loading (or
// within 500 ms of it finishing), or with a source inside the canvas, scrim or Pause pill, count
// toward it (on a throttled network the fonts arrive after the import has started). The enhanced
// variant also reports the runtime's draw calls per frame, label textures and idle frames, and the
// backdrop-filter surface count, all observed in the production build through
// tests/e2e/support/production-instrumentation.mjs.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';
import {
  installInstrumentation,
  measureIdleFrames,
  readLayoutShifts,
  readWebglMetrics,
  sweepBackdropSurfaces,
} from '../tests/e2e/support/production-instrumentation.mjs';

const root = process.cwd();
const outDir = path.join(root, 'out');
const argument = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.split('=')[1];
const JOURNEYS_PER_LOCALE = Number(argument('journeys') ?? 10);
const ONLY_PROFILE = argument('profile'); // e.g. --profile=mobile
const ENHANCED_JOURNEYS_PER_LOCALE = Number(argument('enhanced-journeys') ?? 5);
// clsWholePage is the web-vitals "good" CLS threshold (a gate); clsFromEnhancement is the ADR gate.
const GATES = { lcpP75Ms: 2500, inpP75Ms: 200, clsWholePage: 0.1, clsFromEnhancement: 0, drawCallsPerFrame: 28, labelTextures: 20, idleFrames: 0, backdropSurfaces: 3 };

// Lighthouse "devtools" (applied) throttling presets. Their request latency already includes the
// 3.75x RTT multiplier that stands in for connection setup, so every request, including the
// document, pays it once.
const PROFILES = {
  mobile: {
    label: 'Mobile: 390x844, DPR 3, touch, 4x CPU slowdown, Slow 4G applied (562.5 ms request latency, 1.47 Mbps down)',
    context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    cpu: 4,
    network: { latency: 562.5, downloadThroughput: (1474.56 * 1024) / 8, uploadThroughput: (675 * 1024) / 8 },
  },
  desktop: {
    label: 'Desktop: 1440x900, DPR 1, 1x CPU, desktop applied (150 ms request latency, 9.2 Mbps down)',
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    cpu: 1,
    network: { latency: 150, downloadThroughput: (9216 * 1024) / 8, uploadThroughput: (9216 * 1024) / 8 },
  },
};
const LOCALES = { es: { route: '/', pause: 'Pausar movimiento', resume: 'Reanudar movimiento' }, en: { route: '/en/', pause: 'Pause motion', resume: 'Resume motion' } };

if (!process.argv.includes('--skip-build')) {
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '' } });
}

// GitHub Pages serves text assets gzip-compressed, so the lab server does too.
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain' };
const compressible = new Set(['.html', '.js', '.css', '.svg', '.txt']);
const resolveFile = (pathname) => {
  let file = path.join(outDir, pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  // Windows exports nest segment prefetch files; Linux builds (GitHub Pages) use dotted names.
  const segment = !fs.existsSync(file) && path.basename(file).match(/^__next\.(.+)\.txt$/);
  if (segment) {
    const [group, ...rest] = segment[1].split('.');
    const nested = path.join(path.dirname(file), `__next.${group}`, ...rest) + '.txt';
    if (fs.existsSync(nested)) file = nested;
  }
  return fs.existsSync(file) ? file : null;
};
// Chrome's CDP throttling does not delay the navigation document, so the server charges the
// profile's request latency and transfer time for it (x-lab-* headers).
const server = http.createServer(async (request, response) => {
  const file = resolveFile(decodeURIComponent(new URL(request.url, 'http://x').pathname));
  if (!file) { response.writeHead(404); response.end(); return; }
  const extension = path.extname(file);
  const headers = { 'content-type': types[extension] ?? 'application/octet-stream', 'cache-control': 'no-store' };
  if (compressible.has(extension) && /gzip/.test(request.headers['accept-encoding'] ?? '')) {
    const body = zlib.gzipSync(fs.readFileSync(file));
    const rtt = Number(request.headers['x-lab-rtt'] ?? 0);
    if (extension === '.html' && rtt) {
      const bytesPerMs = Number(request.headers['x-lab-down'] ?? Infinity) / 1000;
      await new Promise((resolve) => setTimeout(resolve, rtt + body.length / bytesPerMs));
    }
    response.writeHead(200, { ...headers, 'content-encoding': 'gzip' });
    response.end(body);
    return;
  }
  response.writeHead(200, headers);
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)] ?? 0;
};

async function journey(browser, profile, locale, variant) {
  const context = await browser.newContext({
    ...profile.context,
    extraHTTPHeaders: { 'x-lab-rtt': String(profile.network.latency), 'x-lab-down': String(profile.network.downloadThroughput) },
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, ...profile.network });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
  if (variant === 'enhanced') {
    // Explicit test-only override of the software-renderer gate (amended ADR 2026-09-28).
    await page.addInitScript(() => {
      window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
    });
  }
  await page.addInitScript(installInstrumentation);
  await page.addInitScript(() => {
    const vitals = { lcp: [], events: [] };
    window.__vitals = vitals;
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => vitals.lcp.push({ time: entry.startTime, element: entry.element?.tagName ?? null, size: entry.size }))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (entry.interactionId) vitals.events.push({ id: entry.interactionId, name: entry.name, duration: entry.duration }); })).observe({ type: 'event', durationThreshold: 16, buffered: true });
  });

  const copy = LOCALES[locale];
  await page.goto(`${origin}${copy.route}`, { waitUntil: 'load', timeout: 60_000 });
  // Let activation (or the static decision) settle; LCP is final at the first input.
  const readMode = () => page.locator('[data-instrument]').getAttribute('data-immersive-mode');
  let mode;
  if (variant === 'enhanced') {
    mode = await page.waitForFunction(() => document.querySelector('[data-instrument]')?.dataset.immersiveMode === 'webgl' && 'webgl', null, { timeout: 30_000 }).then((handle) => handle.jsonValue()).catch(readMode);
  } else {
    await page.waitForTimeout(1_500); // every gate declines quietly; nothing to wait for
    mode = await readMode();
  }
  await page.waitForTimeout(1_000);
  const lcpEntries = await page.evaluate(() => window.__vitals.lcp);
  const navigation = await page.evaluate(() => {
    const [entry] = performance.getEntriesByType('navigation');
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return { ttfb: entry.responseStart, fcp: fcp?.startTime ?? null };
  });

  // Representative interactions: Pause, Resume, keyboard focus movement and scrolling.
  const tap = (locator) => (profile.context.hasTouch ? locator.tap() : locator.click());
  const pause = page.getByRole('button', { name: copy.pause });
  if (mode === 'webgl') {
    // D-25 hides the Pause pill over the hero, so reach the first chapter before using it.
    await page.evaluate(() => {
      const rect = document.querySelector('section[data-instrument-chapter]').getBoundingClientRect();
      window.scrollBy({ top: rect.top, behavior: 'instant' });
    });
    await pause.waitFor({ state: 'visible', timeout: 15_000 });
    await tap(pause);
    await tap(page.getByRole('button', { name: copy.resume }));
  }
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  for (let step = 0; step < 12; step += 1) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(500);
  const { events } = await page.evaluate(() => window.__vitals);
  const layoutShift = await readLayoutShifts(page);
  // Backdrop-filter surfaces (App Bar excluded) over the whole page, and -- when the runtime is
  // active -- its draw calls, label textures and idle frames, observed at the WebGL API.
  const backdrop = await sweepBackdropSurfaces(page);
  let webgl = null;
  if (variant === 'enhanced' && mode === 'webgl') {
    await page.evaluate(() => {
      const chapter = document.querySelector('section[data-instrument-chapter="connection"]').getBoundingClientRect();
      window.scrollBy({ top: chapter.top + chapter.height / 2 - window.innerHeight / 2, behavior: 'instant' });
    });
    const idle = await measureIdleFrames(page, { timeout: 60_000, reacted: { attribute: 'data-rendered-chapter', value: 'connection' } });
    webgl = { ...(await readWebglMetrics(page)), idleFramesInWindow: idle.framesInWindow };
  }
  await context.close();

  const byInteraction = new Map();
  for (const event of events) byInteraction.set(event.id, Math.max(byInteraction.get(event.id) ?? 0, event.duration));
  const lcp = lcpEntries.at(-1);
  return {
    locale,
    variant,
    mode,
    ttfbMs: Math.round(navigation.ttfb),
    fcpMs: navigation.fcp === null ? null : Math.round(navigation.fcp),
    lcpMs: lcp ? Math.round(lcp.time) : null,
    lcpElement: lcp?.element ?? null,
    interactions: byInteraction.size,
    inpMs: Math.round(Math.max(0, ...byInteraction.values())),
    clsWholePage: layoutShift.wholePage,
    clsFromEnhancement: layoutShift.fromEnhancement,
    clsNotFromEnhancement: layoutShift.notFromEnhancement,
    clsEnhancementDetail: layoutShift.enhancementDetail,
    backdropMax: backdrop.max,
    backdropSweepMax: backdrop.sweep.max,
    webgl,
  };
}

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { kind: 'synthetic lab measurement (not field data)', journeysPerLocale: { static: JOURNEYS_PER_LOCALE, enhanced: ENHANCED_JOURNEYS_PER_LOCALE }, gates: GATES, profiles: {} };
const failures = [];
const max = (values) => Math.max(0, ...values);
try {
  for (const [name, profile] of Object.entries(PROFILES)) {
    if (ONLY_PROFILE && ONLY_PROFILE !== name) continue;
    report.profiles[name] = {};
    for (const variant of ['static', 'enhanced']) {
      const runs = variant === 'static' ? JOURNEYS_PER_LOCALE : ENHANCED_JOURNEYS_PER_LOCALE;
      const journeys = [];
      for (let run = 0; run < runs; run += 1) {
        for (const locale of Object.keys(LOCALES)) journeys.push(await journey(browser, profile, locale, variant));
      }
      const lcpValues = journeys.map((item) => item.lcpMs).filter((value) => value !== null);
      const webglRuns = journeys.filter((item) => item.webgl);
      const summary = {
        label: profile.label,
        variant,
        journeys: journeys.length,
        modes: journeys.reduce((counts, item) => ({ ...counts, [item.mode]: (counts[item.mode] ?? 0) + 1 }), {}),
        lcpP75Ms: percentile(lcpValues, 75),
        inpP75Ms: percentile(journeys.map((item) => item.inpMs), 75),
        inpGate: variant === 'static' ? 'gated' : 'advisory under SwiftShader (amended ADR 2026-09-28)',
        fcpP75Ms: percentile(journeys.map((item) => item.fcpMs ?? 0), 75),
        ttfbP75Ms: percentile(journeys.map((item) => item.ttfbMs), 75),
        clsWholePageMax: max(journeys.map((item) => item.clsWholePage)),
        clsFromEnhancementMax: max(journeys.map((item) => item.clsFromEnhancement)),
        clsFontSwapSources: [...new Set(journeys.flatMap((item) => item.clsNotFromEnhancement.flatMap((shift) => shift.sources)))],
        backdropSurfacesAtSectionsMax: max(journeys.map((item) => item.backdropMax)),
        backdropSurfacesSweepMax: max(journeys.map((item) => item.backdropSweepMax)),
        lcpElements: [...new Set(journeys.map((item) => item.lcpElement))],
        ...(variant === 'enhanced' && {
          webgl: {
            journeysWithRuntime: webglRuns.length,
            drawCallsPerFrameMax: max(webglRuns.map((item) => item.webgl.drawCallsPerFrame.max)),
            labelTextures: max(webglRuns.map((item) => item.webgl.labelTextures.count)),
            largestLabelTexture: webglRuns.map((item) => item.webgl.labelTextures.largest).sort((a, b) => b[0] - a[0])[0] ?? null,
            idleFramesInWindowMax: max(webglRuns.map((item) => item.webgl.idleFramesInWindow)),
          },
        }),
      };
      report.profiles[name][variant] = { summary, journeys };
      const tag = `${name}/${variant}`;
      if (lcpValues.length < journeys.length) failures.push(`${tag}: ${journeys.length - lcpValues.length} journeys reported no LCP`);
      if (summary.lcpP75Ms > GATES.lcpP75Ms) failures.push(`${tag}: LCP p75 ${summary.lcpP75Ms} ms exceeds ${GATES.lcpP75Ms} ms`);
      if (journeys.some((item) => item.lcpElement !== 'H1')) failures.push(`${tag}: the LCP element is not the H1 (${summary.lcpElements.join(', ')})`);
      if (variant === 'static' && summary.inpP75Ms > GATES.inpP75Ms) failures.push(`${tag}: INP p75 ${summary.inpP75Ms} ms exceeds ${GATES.inpP75Ms} ms`);
      summary.clsWholePageRating = summary.clsWholePageMax <= GATES.clsWholePage ? 'good' : summary.clsWholePageMax <= 0.25 ? 'needs improvement' : 'poor';
      if (summary.clsWholePageMax > GATES.clsWholePage) failures.push(`${tag}: whole-page CLS ${summary.clsWholePageMax} exceeds the web-vitals "good" threshold ${GATES.clsWholePage} (font-swap sources: ${summary.clsFontSwapSources.join(', ')})`);
      if (summary.clsFromEnhancementMax > GATES.clsFromEnhancement) failures.push(`${tag}: layout shift from the enhancement ${summary.clsFromEnhancementMax} exceeds ${GATES.clsFromEnhancement}`);
      if (summary.backdropSurfacesAtSectionsMax > GATES.backdropSurfaces) failures.push(`${tag}: ${summary.backdropSurfacesAtSectionsMax} backdrop-filter surfaces at a section exceeds ${GATES.backdropSurfaces}`);
      if (variant === 'enhanced') {
        if (!summary.webgl.journeysWithRuntime) failures.push(`${tag}: the runtime never activated, so its draw calls and idle frames were not measured`);
        if (summary.webgl.drawCallsPerFrameMax > GATES.drawCallsPerFrame) failures.push(`${tag}: ${summary.webgl.drawCallsPerFrameMax} draw calls per frame exceeds ${GATES.drawCallsPerFrame}`);
        if (summary.webgl.labelTextures > GATES.labelTextures) failures.push(`${tag}: ${summary.webgl.labelTextures} label textures exceeds ${GATES.labelTextures}`);
        if (summary.webgl.idleFramesInWindowMax > GATES.idleFrames) failures.push(`${tag}: ${summary.webgl.idleFramesInWindowMax} idle frames after settle`);
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

const output = JSON.stringify(report, null, 2);
const outFile = argument('out');
if (outFile) fs.writeFileSync(outFile, `${output}\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.profiles).map(([name, variants]) => [name, Object.fromEntries(Object.entries(variants).map(([variant, value]) => [variant, value.summary]))])), null, 2));
if (failures.length) {
  console.error('\nHome web-vitals gates failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nHome web-vitals gates passed (synthetic lab p75).');
