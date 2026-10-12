// Dev-only: captures the four connected-studio static posters (PLAN-SPF-V1 Task 8).
//
//   node scripts/capture-connected-studio-posters.mjs
//
// Starts `next dev` (port 3120 unless PLAYWRIGHT_PORT is set; set CAPTURE_ORIGIN to reuse a server
// you started yourself with `--hostname 127.0.0.1`), opens each connected route in headless Chromium
// and lets the real engine render the scene. Headless Chromium renders WebGL with SwiftShader, which
// the capability gate declines by default, so the documented controlled-test hooks are set:
//   window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer: true, livePolicy: both tiers on }
// This is controlled test evidence for a still image. It never changes the shipped live policy,
// which stays `{ wide: false, compact: false }`, and it is never set in a measurement run.
//
// Frozen capture settings (one shared poster family; identical for Services and Projects):
//   - tier, viewport, device scale: wide 1920x1080 at 1x; compact 450x800 at 2x (900x1600 pixels,
//     and 450 CSS pixels select the compact tier).
//   - progress 0.60: the scene's stronger composition, with most connections grown and every node in
//     frame. Reached by scrolling, then corrected until the diagnostics read it within 0.003.
//   - idle angle 0.50 rad: the slow rotation integrates real time, so the script waits until the
//     diagnostics read just under the target and then pauses the scene through the page's own
//     Pause control. A paused scene stops drawing, so the pose cannot move during the capture.
//   - label treatment: none. The accessible vocabulary lives in the page's HTML legend; the DOM label
//     chips and the Next.js development overlay are hidden before the capture, so no text is rasterized.
//   - the capture is the viewport with everything but the Ground hidden (`visibility`, so nothing
//     reflows): the CSS chart plus the canvas, flattened and opaque. The CSS chart remains the final
//     fallback if a poster fails to load.
// Each still is encoded to WebP in the page, stepping the quality down until its byte ceiling holds.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { chromium } from 'playwright';
import { connectedMediaManifest } from '../lib/connected-studio/media-manifest.ts';

const root = process.cwd();
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3120);
const reuseOrigin = process.env.CAPTURE_ORIGIN;
const origin = reuseOrigin ?? `http://127.0.0.1:${port}`;
const outDir = path.join(root, 'public/brand/connected-studio');
const KIB = 1024;

const ROUTE_PATHS = { services: '/servicios/', projects: '/proyectos/' };
const VIEWPORTS = {
  wide: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
  compact: { viewport: { width: 450, height: 800 }, deviceScaleFactor: 2 },
};
const TARGET_PROGRESS = 0.6;
const PROGRESS_TOLERANCE = 0.003;
const TARGET_IDLE_ANGLE = 0.5;
const ANGLE_TOLERANCE = 0.01;
// The pause lands a few frames after the trigger (about 0.007 rad under SwiftShader), so trigger early.
const ANGLE_LEAD = 0.004;
const QUALITY_STEPS = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];

function isPortInUse(portNumber) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port: portNumber });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

let serverExit = null;
let serverStderr = '';

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    if (serverExit) {
      throw new Error(
        `next dev exited before it was ready (code ${serverExit.code}, signal ${serverExit.signal})` +
          (serverStderr.trim() ? `\nstderr:\n${serverStderr.trim()}` : ''),
      );
    }
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
  if (!server?.pid || server.exitCode !== null) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill('SIGTERM');
}

// --derivatives: resolution-only WebP derivatives of the two original project illustrations, written
// beside them. Needs Chromium only: no server, no engine. Each derivative keeps the whole 1599:900
// frame (the same drawing, scaled) and stays under the original's byte size scaled by width (a derivative
// that saves nothing is not responsive imagery); the originals are never touched. Run it once; the files are committed.
const ILLUSTRATIONS = [
  'public/projects/general-reservation-system/conceptual-workflow.webp',
  'public/projects/the-system/conceptual-access-model.webp',
];
const DERIVATIVE_WIDTHS = [640, 960, 1280];

if (process.argv.includes('--derivatives')) {
  let derivativeBrowser;
  let derivativeFailed = false;
  try {
    derivativeBrowser = await chromium.launch();
    const page = await derivativeBrowser.newPage();
    for (const original of ILLUSTRATIONS) {
      const source = fs.readFileSync(path.join(root, original));
      for (const width of DERIVATIVE_WIDTHS) {
        const height = Math.round((width * 900) / 1599);
        const result = await page.evaluate(
          async ({ base64, targetWidth, targetHeight, ceiling, steps }) => {
            const bitmap = await createImageBitmap(await (await fetch(`data:image/webp;base64,${base64}`)).blob());
            const canvas = new OffscreenCanvas(targetWidth, targetHeight);
            const context = canvas.getContext('2d');
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
            for (const quality of steps) {
              const encoded = await canvas.convertToBlob({ type: 'image/webp', quality });
              if (encoded.size < ceiling) {
                const buffer = new Uint8Array(await encoded.arrayBuffer());
                let binary = '';
                for (let index = 0; index < buffer.length; index += 0x8000) binary += String.fromCharCode(...buffer.subarray(index, index + 0x8000));
                return { quality, base64: btoa(binary), sourceWidth: bitmap.width, sourceHeight: bitmap.height };
              }
            }
            return null;
          },
          { base64: source.toString('base64'), targetWidth: width, targetHeight: height, ceiling: Math.floor((source.length * width) / 1599), steps: QUALITY_STEPS },
        );
        if (!result) throw new Error(`${original} at ${width}px: no quality step stayed under ${Math.floor((source.length * width) / 1599)} bytes (the original's ${source.length} scaled by width)`);
        if (result.sourceWidth !== 1599 || result.sourceHeight !== 900) throw new Error(`${original} is ${result.sourceWidth}x${result.sourceHeight}, expected 1599x900`);
        const target = original.replace(/\.webp$/, `-${width}.webp`);
        const bytes = Buffer.from(result.base64, 'base64');
        fs.writeFileSync(path.join(root, target), bytes);
        console.log(`${target}: ${width}x${height}, q=${result.quality}, ${bytes.length} bytes (original ${source.length})`);
      }
    }
  } catch (error) {
    derivativeFailed = true;
    console.error(error);
  } finally {
    await derivativeBrowser?.close();
  }
  process.exit(derivativeFailed ? 1 : 0);
}

let server = null;
if (!reuseOrigin) {
  // Never reuse whatever already answers: a stale server or another project's dev server would
  // silently produce the wrong render.
  if (await isPortInUse(port)) {
    console.error(`Port ${port} is already in use. Stop that server, set PLAYWRIGHT_PORT, or set CAPTURE_ORIGIN to reuse one on purpose.`);
    process.exit(1);
  }
  const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
  server = spawn(process.execPath, [nextBin, 'dev', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'pipe'],
    // NODE_ENV is forced: the diagnostics hook the pose logic reads exists only outside production.
    env: { ...process.env, NODE_ENV: 'development', NEXT_PUBLIC_BASE_PATH: '', JITI_CACHE: process.env.JITI_CACHE ?? 'false' },
  });
  server.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
    serverStderr = (serverStderr + chunk.toString()).slice(-4000);
  });
  server.on('exit', (code, signal) => {
    serverExit = { code, signal };
  });
}
process.on('exit', () => stopServer(server));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(130));

const readDiagnostics = (page) => page.evaluate(() => window.__FURLANICH_CONNECTED__?.read() ?? null);

/** Scrolls until the diagnostics report the target progress, correcting from what they read. */
async function scrollToProgress(page, target) {
  const layout = (await readDiagnostics(page)).layout;
  let scrollY = Math.round(target * (layout.footerDocumentTop - layout.viewportHeight));
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(1800);
    const { progress } = await readDiagnostics(page);
    if (Math.abs(progress - target) <= PROGRESS_TOLERANCE) return { scrollY, progress };
    // Progress is linear in the scroll position; rescale from the reading.
    scrollY = Math.round(scrollY * (target / Math.max(progress, 0.01)));
  }
  throw new Error(`could not reach progress ${target} within ${PROGRESS_TOLERANCE}`);
}

/** Waits for the slow idle rotation to reach the target angle, then pauses through the page's own control. */
async function pauseAtAngle(page, targetAngle) {
  const deadline = Date.now() + 120_000;
  for (;;) {
    const reading = await readDiagnostics(page);
    if (reading.idleAngleRadians >= targetAngle - ANGLE_LEAD) break;
    if (Date.now() > deadline) throw new Error(`the idle angle did not reach ${targetAngle} (read ${reading.idleAngleRadians})`);
    await page.waitForTimeout(40);
  }
  // A DOM click does not scroll, unlike Playwright's own, which would change the progress.
  await page.evaluate(() => document.querySelector('[data-connected-pause]').click());
  await page.waitForFunction(() => window.__FURLANICH_CONNECTED__.read().schedulerPending === 0, null, { timeout: 10_000 });
  return readDiagnostics(page);
}

/** Encodes PNG bytes to WebP in the page, stepping the quality down until the ceiling holds. */
async function encodeWebp(page, png, budget) {
  const result = await page.evaluate(
    async ({ base64, budgetBytes, steps }) => {
      const blob = await (await fetch(`data:image/png;base64,${base64}`)).blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      canvas.getContext('2d').drawImage(bitmap, 0, 0);
      for (const quality of steps) {
        const encoded = await canvas.convertToBlob({ type: 'image/webp', quality });
        if (encoded.size <= budgetBytes) {
          const buffer = new Uint8Array(await encoded.arrayBuffer());
          let binary = '';
          for (let index = 0; index < buffer.length; index += 0x8000) binary += String.fromCharCode(...buffer.subarray(index, index + 0x8000));
          return { quality, base64: btoa(binary), width: bitmap.width, height: bitmap.height };
        }
      }
      return null;
    },
    { base64: png.toString('base64'), budgetBytes: budget, steps: QUALITY_STEPS },
  );
  if (!result) throw new Error(`no quality step met the ${budget}-byte ceiling`);
  return { ...result, bytes: Buffer.from(result.base64, 'base64') };
}

let browser;
let failed = false;
try {
  await waitForServer(`${origin}${ROUTE_PATHS.services}`, 120_000);
  fs.mkdirSync(outDir, { recursive: true });
  browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

  for (const entry of connectedMediaManifest) {
    const { viewport, deviceScaleFactor } = VIEWPORTS[entry.quality];
    const file = path.basename(entry.src);
    const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: 'no-preference', locale: 'es-AR' });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer: true, livePolicy: { wide: true, compact: true } };
    });
    await page.goto(`${origin}${ROUTE_PATHS[entry.route]}`, { waitUntil: 'load' });
    await page.waitForFunction(
      () => {
        const reading = window.__FURLANICH_CONNECTED__?.read();
        return reading?.mode === 'live' && reading.renderCount > 0;
      },
      null,
      { timeout: 120_000 },
    );
    const tier = (await readDiagnostics(page)).tier;
    if (tier !== entry.quality) throw new Error(`${file}: the page selected tier "${tier}", expected "${entry.quality}"`);

    const scrolled = await scrollToProgress(page, TARGET_PROGRESS);
    const pose = await pauseAtAngle(page, TARGET_IDLE_ANGLE);
    if (Math.abs(pose.progress - TARGET_PROGRESS) > PROGRESS_TOLERANCE) throw new Error(`${file}: progress drifted to ${pose.progress}`);
    if (Math.abs(pose.idleAngleRadians - TARGET_IDLE_ANGLE) > ANGLE_TOLERANCE) throw new Error(`${file}: idle angle read ${pose.idleAngleRadians}`);

    // Everything but the Ground is hidden without changing layout, and no text is rasterized.
    await page.addStyleTag({
      content:
        'body *:not([data-connected-ground]):not([data-connected-ground] *) { visibility: hidden !important; }' +
        '[data-connected-ground], [data-connected-ground] canvas { visibility: visible !important; }' +
        '[data-connected-labels], nextjs-portal, #__next-build-watcher { display: none !important; }',
    });
    await page.locator('nextjs-portal').evaluateAll((nodes) => nodes.forEach((node) => node.remove()));
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    const png = await page.screenshot({ type: 'png' });
    const encoded = await encodeWebp(page, png, entry.maxBytes);
    if (encoded.width !== entry.width || encoded.height !== entry.height) {
      throw new Error(`${file}: captured ${encoded.width}x${encoded.height}, expected ${entry.width}x${entry.height}`);
    }
    fs.writeFileSync(path.join(outDir, file), encoded.bytes);
    console.log(
      `${file}: ${entry.width}x${entry.height}, q=${encoded.quality}, ${encoded.bytes.length} bytes ` +
        `(${(encoded.bytes.length / KIB).toFixed(1)} KiB of ${(entry.maxBytes / KIB).toFixed(0)} KiB); ` +
        `tier=${tier} progress=${pose.progress.toFixed(4)} idleAngle=${pose.idleAngleRadians.toFixed(4)} scrollY=${scrolled.scrollY}`,
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
