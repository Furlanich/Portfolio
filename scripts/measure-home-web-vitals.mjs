// Synthetic (lab) LCP and INP for the immersive homepage: PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1
// Task 8.3 and the ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE p75 gates. These are throttled Chromium journeys,
// not field data.
// Usage: npm run measure:home-vitals [-- --skip-build] [--journeys=10] [--out=path.json]
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'out');
const argument = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.split('=')[1];
const JOURNEYS_PER_LOCALE = Number(argument('journeys') ?? 10);
const GATES = { lcpP75Ms: 2500, inpP75Ms: 200 };

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

async function journey(browser, profile, locale) {
  const context = await browser.newContext({
    ...profile.context,
    extraHTTPHeaders: { 'x-lab-rtt': String(profile.network.latency), 'x-lab-down': String(profile.network.downloadThroughput) },
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, ...profile.network });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
  await page.addInitScript(() => {
    const vitals = { lcp: [], events: [], shifts: 0 };
    window.__vitals = vitals;
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => vitals.lcp.push({ time: entry.startTime, element: entry.element?.tagName ?? null, size: entry.size }))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (entry.interactionId) vitals.events.push({ id: entry.interactionId, name: entry.name, duration: entry.duration }); })).observe({ type: 'event', durationThreshold: 16, buffered: true });
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) vitals.shifts += entry.value; })).observe({ type: 'layout-shift', buffered: true });
  });

  const copy = LOCALES[locale];
  await page.goto(`${origin}${copy.route}`, { waitUntil: 'load', timeout: 60_000 });
  // Let activation (or the static decision) settle; LCP is final at the first input.
  const mode = await page.waitForFunction(() => {
    const element = document.querySelector('[data-instrument]');
    return element?.dataset.immersiveMode === 'webgl' && element.dataset.immersiveMode;
  }, null, { timeout: 30_000 }).then((handle) => handle.jsonValue()).catch(() => page.locator('[data-instrument]').getAttribute('data-immersive-mode'));
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
  if (await pause.count()) {
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
  const { events, shifts } = await page.evaluate(() => window.__vitals);
  await context.close();

  const byInteraction = new Map();
  for (const event of events) byInteraction.set(event.id, Math.max(byInteraction.get(event.id) ?? 0, event.duration));
  const lcp = lcpEntries.at(-1);
  return {
    locale,
    mode,
    ttfbMs: Math.round(navigation.ttfb),
    fcpMs: navigation.fcp === null ? null : Math.round(navigation.fcp),
    lcpMs: lcp ? Math.round(lcp.time) : null,
    lcpElement: lcp?.element ?? null,
    interactions: byInteraction.size,
    inpMs: Math.round(Math.max(0, ...byInteraction.values())),
    cls: +shifts.toFixed(4),
  };
}

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { kind: 'synthetic lab measurement (not field data)', journeysPerLocale: JOURNEYS_PER_LOCALE, gates: GATES, profiles: {} };
const failures = [];
try {
  for (const [name, profile] of Object.entries(PROFILES)) {
    const journeys = [];
    for (let run = 0; run < JOURNEYS_PER_LOCALE; run += 1) {
      for (const locale of Object.keys(LOCALES)) journeys.push(await journey(browser, profile, locale));
    }
    const lcpValues = journeys.map((item) => item.lcpMs).filter((value) => value !== null);
    const summary = {
      label: profile.label,
      journeys: journeys.length,
      modes: journeys.reduce((counts, item) => ({ ...counts, [item.mode]: (counts[item.mode] ?? 0) + 1 }), {}),
      lcpP75Ms: percentile(lcpValues, 75),
      inpP75Ms: percentile(journeys.map((item) => item.inpMs), 75),
      fcpP75Ms: percentile(journeys.map((item) => item.fcpMs ?? 0), 75),
      ttfbP75Ms: percentile(journeys.map((item) => item.ttfbMs), 75),
      clsMax: Math.max(...journeys.map((item) => item.cls)),
      lcpElements: [...new Set(journeys.map((item) => item.lcpElement))],
    };
    report.profiles[name] = { summary, journeys };
    if (lcpValues.length < journeys.length) failures.push(`${name}: ${journeys.length - lcpValues.length} journeys reported no LCP`);
    if (summary.lcpP75Ms > GATES.lcpP75Ms) failures.push(`${name}: LCP p75 ${summary.lcpP75Ms} ms exceeds ${GATES.lcpP75Ms} ms`);
    if (summary.inpP75Ms > GATES.inpP75Ms) failures.push(`${name}: INP p75 ${summary.inpP75Ms} ms exceeds ${GATES.inpP75Ms} ms`);
  }
} finally {
  await browser.close();
  server.close();
}

const output = JSON.stringify(report, null, 2);
const outFile = argument('out');
if (outFile) fs.writeFileSync(outFile, `${output}\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.profiles).map(([name, value]) => [name, value.summary])), null, 2));
if (failures.length) {
  console.error('\nHome web-vitals gates failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nHome web-vitals gates passed (synthetic lab p75).');
