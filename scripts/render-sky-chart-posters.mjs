// Dev-only: renders the SKY-CHART-V2 D-23 environment posters.
//
//   node scripts/render-sky-chart-posters.mjs
//
// Starts `next dev` (port 3110 unless PLAYWRIGHT_PORT is set), opens Home in headless Chromium
// with the query-free test hook `window.__FURLANICH_SKY_CHART_POSTER__ = true`, and lets the
// real runtime render the resolved scene (t = 1, no labels, DPR 1, readable drawing buffer;
// the scene honours the hook only when NODE_ENV !== 'production'). The scrim is a DOM layer, so
// it is not in the canvas. The canvas is transparent where there is no scene, so the poster
// composites over the D-02 ground gradient exactly as the live canvas does. Each still is read
// back with `canvas.toDataURL('image/webp', q)`, stepping q down until its byte budget is met.
//
// Headless Chromium renders WebGL with SwiftShader, which the runtime's capability gate sends
// to the static path, so the documented test-only override is set as well.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3110);
const origin = `http://127.0.0.1:${port}`;
const outDir = path.join(root, 'public/brand/sky-chart');
const KIB = 1024;

// Keep in step with lib/immersive-home/media-manifest.ts.
const POSTERS = [
  { file: 'environment-wide.webp', width: 1920, height: 1080, budget: 150 * KIB },
  { file: 'environment-compact.webp', width: 900, height: 1600, budget: 80 * KIB },
];
const QUALITY_STEPS = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    if (Date.now() > deadline) throw new Error(`dev server did not respond at ${url} within ${timeoutMs} ms`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

function stopServer(server) {
  if (!server.pid || server.exitCode !== null) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill('SIGTERM');
}

const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const server = spawn(process.execPath, [nextBin, 'dev', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: root,
  stdio: ['ignore', 'ignore', 'inherit'],
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '', JITI_CACHE: process.env.JITI_CACHE ?? 'false' },
});
process.on('exit', () => stopServer(server));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(130));

let browser;
let failed = false;
try {
  await waitForServer(`${origin}/`, 120_000);
  fs.mkdirSync(outDir, { recursive: true });
  browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

  for (const poster of POSTERS) {
    const context = await browser.newContext({
      viewport: { width: poster.width, height: poster.height },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__FURLANICH_SKY_CHART_POSTER__ = true;
      window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
    });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-instrument]')?.dataset.immersiveMode === 'webgl', null, { timeout: 60_000 });
    // Let the first frame settle and any resize re-render finish before reading the buffer.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(500);

    const canvasSize = await page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-sky-chart-canvas]');
      return canvas ? { width: canvas.width, height: canvas.height } : null;
    });
    if (!canvasSize || canvasSize.width !== poster.width || canvasSize.height !== poster.height) {
      throw new Error(`${poster.file}: canvas is ${JSON.stringify(canvasSize)}, expected ${poster.width}x${poster.height}`);
    }

    let written = null;
    for (const quality of QUALITY_STEPS) {
      const dataUrl = await page.evaluate((q) => document.querySelector('canvas[data-sky-chart-canvas]').toDataURL('image/webp', q), quality);
      if (!dataUrl.startsWith('data:image/webp;base64,')) throw new Error(`${poster.file}: the browser did not encode WebP`);
      const bytes = Buffer.from(dataUrl.slice('data:image/webp;base64,'.length), 'base64');
      if (bytes.length <= poster.budget) {
        written = { quality, bytes };
        break;
      }
    }
    if (!written) throw new Error(`${poster.file}: no quality step met the ${poster.budget}-byte budget`);

    fs.writeFileSync(path.join(outDir, poster.file), written.bytes);
    console.log(
      `${poster.file}: ${poster.width}x${poster.height}, q=${written.quality}, ${written.bytes.length} bytes ` +
        `(${(written.bytes.length / KIB).toFixed(1)} KiB of ${(poster.budget / KIB).toFixed(0)} KiB)`,
    );
    await context.close();
  }
} catch (error) {
  failed = true;
  console.error(error);
} finally {
  await browser?.close();
  stopServer(server);
}
process.exit(failed ? 1 : 0);
