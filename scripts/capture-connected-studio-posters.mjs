// Dev-only: captures the connected-studio static posters (PLAN-SPF-V1 Task 8; PLAN-SFC-V1 Task 14).
//
//   node scripts/capture-connected-studio-posters.mjs [--routes=studio,founder,contact] [--out=<dir>] [--allow-legacy]
//   node scripts/capture-connected-studio-posters.mjs --verify-handoff [--routes=...] [--posters=<dir>]
//
// --verify-handoff captures nothing. At each real viewport it holds time on the live scene's first frame and compares
// that drawn frame with the published poster painted by the Ground's own CSS cover crop: the lit pixels (strings, rings,
// dots) of one must lie within two CSS pixels of the lit pixels of the other, in both directions. It is the measured
// form of "the poster matches the first live paint" (PLAN-SFC-V1 Task 14).
//
// Default: the three Atlas routes (Studio, Founder, Contact), six posters. The published Services and Projects
// posters are the approved legacy family and are never recaptured by accident: naming either needs `--allow-legacy`
// (PLAN-SFC-V1 Task 14 preserves them; a required legacy recapture returns with its own packet and owner review).
//
// The three Atlas pages mount their live host through the Atlas seam (attached by PLAN-SFC-V1 Task 18; both live tiers have
// been enabled in committed source since Task 25), so no candidate patch is needed any more. If the host never mounts the
// script stops with an instruction instead of writing a CSS-only image. Send the files to a task checkout with
// `--out=<task checkout>/public/brand/connected-studio`.
//
// Starts `next dev` (port 3120 unless PLAYWRIGHT_PORT is set; set CAPTURE_ORIGIN to reuse a server
// you started yourself with `--hostname 127.0.0.1`), opens each connected route in headless Chromium
// and lets the real engine render the scene. Headless Chromium renders WebGL with SwiftShader, which
// the capability gate declines by default, so the documented controlled-test hooks are set:
//   window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer: true, livePolicy: both tiers on }
// This is controlled test evidence for a still image. It never changes the shipped live policy,
// which is `{ wide: true, compact: true }` since PLAN-SFC-V1 Tasks 18 and 25, and it is never set in a measurement run.
//
// Frozen capture settings (one shared poster family; identical for Services and Projects):
//   - tier, viewport, device scale: wide 1920x1080 at 1x; compact 450x800 at 2x (900x1600 pixels,
//     and 450 CSS pixels select the compact tier).
//   - the pose is the live scene's own first frame. The controller starts on `CONNECTED_POSTER_POSE` (progress
//     0.60: most connections grown and every node in frame; idle angle 0.50 rad), so the poster is that frame by
//     construction. The script holds time with Playwright's fake clock, lets the page run until the scene has
//     drawn, and reads the pose back from the diagnostics (progress and angle within 1e-6). Time is held, so a
//     second frame (the page re-measuring its layout) draws the same pose and nothing drifts during the capture.
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
import { CONNECTED_POSTER_CAPTURE, CONNECTED_POSTER_POSE, connectedMediaManifest } from '../lib/connected-studio/media-manifest.ts';
import { getConnectedProfile } from '../lib/connected-studio/profiles.ts';
import { computeProjectionLayout, projectAnchor } from '../lib/connected-studio/projection.ts';

const root = process.cwd();
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3120);
const reuseOrigin = process.env.CAPTURE_ORIGIN;
const origin = reuseOrigin ?? `http://127.0.0.1:${port}`;
const argument = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const outDir = path.resolve(argument('out') ?? path.join(root, 'public/brand/connected-studio'));
const KIB = 1024;

const ROUTE_PATHS = {
  services: '/servicios/',
  projects: '/proyectos/',
  studio: '/estudio/',
  founder: '/estudio/samuel-furlanich/',
  contact: '/contacto/',
};
const ATLAS_ROUTES = ['studio', 'founder', 'contact'];
const LEGACY_ROUTES = ['services', 'projects'];
const requestedRoutes = (argument('routes')?.split(',').map((route) => route.trim()).filter(Boolean)) ?? ATLAS_ROUTES;
for (const route of requestedRoutes) {
  if (!Object.hasOwn(ROUTE_PATHS, route)) {
    console.error(`Unknown route "${route}". Choose from ${Object.keys(ROUTE_PATHS).join(', ')}.`);
    process.exit(1);
  }
}
if (requestedRoutes.some((route) => LEGACY_ROUTES.includes(route)) && !process.argv.includes('--allow-legacy')) {
  console.error('Services and Projects have approved, published posters. Recapturing them needs --allow-legacy and its own packet and owner review.');
  process.exit(1);
}
const VIEWPORTS = {
  wide: { viewport: CONNECTED_POSTER_CAPTURE.wide, deviceScaleFactor: 1 },
  compact: { viewport: CONNECTED_POSTER_CAPTURE.compact, deviceScaleFactor: 2 },
};
// The pose is one definition shared with the live scene (its first frame), so the poster and the canvas agree.
const TARGET_PROGRESS = CONNECTED_POSTER_POSE.progress;
const TARGET_IDLE_ANGLE = CONNECTED_POSTER_POSE.idleAngleRadians;
/** How exactly the first frame must equal the pose: it is the same arithmetic, so only float rounding is allowed. */
const POSE_TOLERANCE = 1e-6;
/** Rest positions are inverse-projected once; only float rounding may separate a drawn node from its (u, v). */
const REST_TOLERANCE_PX = 0.05;
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

/**
 * Lets the page run, with time held by the fake clock, until the live scene has drawn its first frame. Activation
 * waits for `load` and a 250 ms timer, which the clock steps through; the dynamic import and the first draw are
 * asynchronous work, not timers, so they finish between the steps. The clock is never stepped again after that,
 * so the controller's next tick (a timer) cannot fire and the pose cannot move.
 */
async function drawFirstFrame(page) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    await page.clock.runFor(250);
    const reading = await readDiagnostics(page);
    if (reading && reading.imports > 0) break;
    await page.waitForTimeout(100);
  }
  await page.waitForFunction(() => (window.__FURLANICH_CONNECTED__?.read().renderCount ?? 0) > 0, null, { timeout: 120_000 });
  return readDiagnostics(page);
}

/**
 * An Atlas poster is the production rest profile at zero excitation: no pointer, no bent string, no suspended or
 * stimulated state, and every node exactly on its specified (u, v) rest position of the capture frame.
 */
function assertAtlasRest(file, entry, pose) {
  if (pose.profile?.route !== entry.route || pose.profile.nodeStyle !== 'atlas') throw new Error(`${file}: the page runs profile ${JSON.stringify(pose.profile)}, expected the ${entry.route} Atlas profile`);
  if (pose.pointerActive || pose.formSuspended) throw new Error(`${file}: the scene was stimulated or suspended at capture (pointerActive ${pose.pointerActive}, formSuspended ${pose.formSuspended})`);
  if (pose.edgeSamples.length) throw new Error(`${file}: ${pose.edgeSamples.length} strings were bent at capture; a poster is the rest pose`);
  const { width, height } = CONNECTED_POSTER_CAPTURE[entry.quality];
  const profile = getConnectedProfile(entry.route, entry.quality, { width, height });
  const layout = computeProjectionLayout(profile, { width, height, tier: entry.quality });
  if (pose.nodes.length !== profile.restAnchors.length) throw new Error(`${file}: ${pose.nodes.length} nodes drawn, expected ${profile.restAnchors.length}`);
  for (const rest of profile.restAnchors) {
    const node = pose.nodes.find((candidate) => candidate.id === rest.id);
    if (!node) throw new Error(`${file}: node ${rest.id} is missing from the pose`);
    const at = projectAnchor(node.position, layout);
    const miss = Math.hypot(at.xPx - rest.u * width, at.yPx - rest.v * height);
    if (!(miss <= REST_TOLERANCE_PX)) throw new Error(`${file}: node ${rest.id} sits ${miss.toFixed(3)} CSS px from its rest position`);
  }
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

const VERIFY = process.argv.includes('--verify-handoff');
/** Real viewports a visitor's first live frame is compared at: the capture sizes themselves and common page sizes. */
const HANDOFF_VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 450, height: 800 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
];
/** Both directions must agree on at least this share of lit pixels within the tolerance. */
const HANDOFF_MIN_AGREEMENT = 0.9;
/** A poster shifted by this many CSS px must fail the same test: proof that the measure can see a real offset. */
const HANDOFF_CONTROL_SHIFT_PX = 4;
const HANDOFF_TOLERANCE_PX = 2;

/**
 * Lit pixels are the bluish strings, rings and dots: blue clearly above red and bright enough to stand off the Abyss
 * ground. The sparse chart points are about 1% of them and appear in both images.
 */
async function measureAgreement(page, drawnPng, posterPng, shiftPx = 0) {
  return page.evaluate(
    async ({ drawn, poster, tolerance, shift }) => {
      const read = async (base64, offset = 0) => {
        const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${base64}`)).blob());
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, offset, offset);
        const { data, width, height } = context.getImageData(0, 0, bitmap.width, bitmap.height);
        const lit = new Uint8Array(width * height);
        let count = 0;
        for (let index = 0; index < lit.length; index += 1) {
          const red = data[index * 4];
          const blue = data[index * 4 + 2];
          if (blue - red >= 40 && blue >= 85) {
            lit[index] = 1;
            count += 1;
          }
        }
        return { lit, width, height, count };
      };
      const near = (mask, width, height) => {
        // Separable box dilation by the tolerance.
        const horizontal = new Uint8Array(mask.length);
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            let hit = 0;
            for (let dx = -tolerance; dx <= tolerance && !hit; dx += 1) {
              const xx = x + dx;
              if (xx >= 0 && xx < width && mask[y * width + xx]) hit = 1;
            }
            horizontal[y * width + x] = hit;
          }
        }
        const out = new Uint8Array(mask.length);
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            let hit = 0;
            for (let dy = -tolerance; dy <= tolerance && !hit; dy += 1) {
              const yy = y + dy;
              if (yy >= 0 && yy < height && horizontal[yy * width + x]) hit = 1;
            }
            out[y * width + x] = hit;
          }
        }
        return out;
      };
      const a = await read(drawn);
      const b = await read(poster, shift);
      if (a.width !== b.width || a.height !== b.height) return { error: `image sizes differ: ${a.width}x${a.height} against ${b.width}x${b.height}` };
      const aNear = near(a.lit, a.width, a.height);
      const bNear = near(b.lit, b.width, b.height);
      let drawnCovered = 0;
      let posterCovered = 0;
      for (let index = 0; index < a.lit.length; index += 1) {
        if (a.lit[index] && bNear[index]) drawnCovered += 1;
        if (b.lit[index] && aNear[index]) posterCovered += 1;
      }
      return { drawnLit: a.count, posterLit: b.count, drawnInPoster: a.count ? drawnCovered / a.count : 0, posterInDrawn: b.count ? posterCovered / b.count : 0 };
    },
    { drawn: drawnPng.toString('base64'), poster: posterPng.toString('base64'), tolerance: HANDOFF_TOLERANCE_PX, shift: shiftPx },
  );
}

async function verifyHandoff(browser) {
  const postersDir = path.resolve(argument('posters') ?? path.join(root, 'public/brand/connected-studio'));
  const rows = [];
  for (const route of requestedRoutes) {
    for (const viewport of HANDOFF_VIEWPORTS) {
      const quality = viewport.width < 768 ? 'compact' : 'wide';
      const label = `${route} ${viewport.width}x${viewport.height}`;
      const posterBase64 = fs.readFileSync(path.join(postersDir, `${route}-${quality}.webp`)).toString('base64');
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference', locale: 'es-AR' });
      try {
        const page = await context.newPage();
        const clockStart = new Date('2026-01-01T00:00:00Z');
        await page.clock.install({ time: clockStart });
        await page.clock.pauseAt(new Date(clockStart.getTime() + 1_000));
        await page.addInitScript(() => {
          window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer: true, livePolicy: { wide: true, compact: true } };
        });
        await page.goto(`${origin}${ROUTE_PATHS[route]}`, { waitUntil: 'load' });
        await page.waitForFunction(() => window.__FURLANICH_CONNECTED__ !== undefined, null, { timeout: 60_000 });
        const pose = await drawFirstFrame(page);
        if (pose.mode !== 'live') throw new Error(`${label}: the page did not draw (mode ${pose.mode})`);
        const hide =
          'body *:not([data-connected-ground]):not([data-connected-ground] *) { visibility: hidden !important; }' +
          '[data-connected-ground], [data-connected-ground] canvas, [data-connected-poster] { visibility: visible !important; }' +
          '[data-connected-labels], nextjs-portal, #__next-build-watcher { display: none !important; }';
        await page.addStyleTag({ content: hide });
        await page.locator('nextjs-portal').evaluateAll((nodes) => nodes.forEach((node) => node.remove()));
        // A: the drawn first frame alone (poster layer hidden, handoff transition removed).
        const drawnStyle = await page.addStyleTag({
          content: '[data-connected-poster] { display: none !important; } [data-connected-ground] canvas { opacity: 1 !important; transition: none !important; }',
        });
        const drawn = await page.screenshot({ type: 'png' });
        await drawnStyle.evaluate((node) => node.remove());
        // B: the published poster painted by the Ground's own CSS (cover, the shared alignment), canvas hidden.
        const posterUrl = `data:image/webp;base64,${posterBase64}`;
        await page.addStyleTag({
          content:
            `[data-connected-ground] { --connected-poster-wide: url("${posterUrl}"); --connected-poster-compact: url("${posterUrl}"); }` +
            '[data-connected-ground] canvas { display: none !important; } [data-connected-poster] { opacity: 1 !important; transition: none !important; }',
        });
        await page.waitForFunction(async (source) => {
          const image = new Image();
          image.src = source;
          await image.decode().catch(() => undefined);
          return image.naturalWidth > 0;
        }, posterUrl);
        const painted = await page.screenshot({ type: 'png' });
        const agreement = await measureAgreement(page, drawn, painted);
        if (agreement.error) throw new Error(`${label}: ${agreement.error}`);
        const control = await measureAgreement(page, drawn, painted, HANDOFF_CONTROL_SHIFT_PX);
        rows.push({ label, ...agreement, control: Math.min(control.drawnInPoster, control.posterInDrawn) });
      } finally {
        await context.close();
      }
    }
  }
  let bad = 0;
  for (const row of rows) {
    const pass = row.drawnLit > 200 && row.posterLit > 200 && row.drawnInPoster >= HANDOFF_MIN_AGREEMENT && row.posterInDrawn >= HANDOFF_MIN_AGREEMENT;
    // The control: the same poster moved four pixels must NOT pass, or the measure could not tell a real offset.
    const sensitive = row.control < HANDOFF_MIN_AGREEMENT;
    if (!pass || !sensitive) bad += 1;
    console.log(
      `${pass ? 'MATCH' : 'MISMATCH'} ${row.label}: drawn lit ${row.drawnLit}, poster lit ${row.posterLit}, ` +
        `drawn within ${HANDOFF_TOLERANCE_PX}px of poster ${(row.drawnInPoster * 100).toFixed(1)}%, poster within drawn ${(row.posterInDrawn * 100).toFixed(1)}%; ` +
        `control (poster moved ${HANDOFF_CONTROL_SHIFT_PX}px) ${(row.control * 100).toFixed(1)}%${sensitive ? '' : ' (TOO HIGH: the measure is blind to an offset)'}`,
    );
  }
  if (bad) throw new Error(`${bad} of ${rows.length} first frames do not match their poster (need at least ${HANDOFF_MIN_AGREEMENT * 100}% both ways)`);
}

let browser;
let failed = false;
try {
  await waitForServer(`${origin}${ROUTE_PATHS[requestedRoutes[0]]}`, 120_000);
  if (!VERIFY) fs.mkdirSync(outDir, { recursive: true });
  browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

  if (VERIFY) await verifyHandoff(browser);
  else for (const entry of connectedMediaManifest.filter((candidate) => requestedRoutes.includes(candidate.route))) {
    const { viewport, deviceScaleFactor } = VIEWPORTS[entry.quality];
    const file = path.basename(entry.src);
    const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: 'no-preference', locale: 'es-AR' });
    const page = await context.newPage();
    // `install` alone leaves time flowing; `pauseAt` holds it until `runFor` steps it.
    const clockStart = new Date('2026-01-01T00:00:00Z');
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(new Date(clockStart.getTime() + 1_000));
    await page.addInitScript(() => {
      window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer: true, livePolicy: { wide: true, compact: true } };
    });
    await page.goto(`${origin}${ROUTE_PATHS[entry.route]}`, { waitUntil: 'load' });
    // The diagnostics hook is installed by the host when it mounts. An Atlas page in a policy-disabled build has no
    // host at all, so stop here rather than photograph the CSS chart and call it a poster.
    await page
      .waitForFunction(() => window.__FURLANICH_CONNECTED__ !== undefined, null, { timeout: 60_000 })
      .catch(() => {
        throw new Error(`${file}: the live host never mounted on ${ROUTE_PATHS[entry.route]}. The Atlas seam should attach it in committed source (PLAN-SFC-V1 Task 18), so check that the dev server is this checkout's and that the live policy is enabled.`);
      });
    const pose = await drawFirstFrame(page);
    if (pose.mode !== 'live' || pose.renderCount < 1) throw new Error(`${file}: expected the live scene to have drawn, got mode ${pose.mode} and renderCount ${pose.renderCount}`);
    if (pose.tier !== entry.quality) throw new Error(`${file}: the page selected tier "${pose.tier}", expected "${entry.quality}"`);
    if (Math.abs(pose.progress - TARGET_PROGRESS) > POSE_TOLERANCE) throw new Error(`${file}: progress read ${pose.progress}, expected ${TARGET_PROGRESS}`);
    if (Math.abs(pose.idleAngleRadians - TARGET_IDLE_ANGLE) > POSE_TOLERANCE) throw new Error(`${file}: idle angle read ${pose.idleAngleRadians}, expected ${TARGET_IDLE_ANGLE}`);
    if (ATLAS_ROUTES.includes(entry.route)) assertAtlasRest(file, entry, pose);

    // Everything but the Ground is hidden without changing layout, and no text is rasterized.
    await page.addStyleTag({
      content:
        'body *:not([data-connected-ground]):not([data-connected-ground] *) { visibility: hidden !important; }' +
        '[data-connected-ground], [data-connected-ground] canvas { visibility: visible !important; }' +
        // Time is held: capture the successful first draw without its CSS handoff transition.
        '[data-connected-ground] canvas { opacity: 1 !important; transition: none !important; }' +
        '[data-connected-labels], nextjs-portal, #__next-build-watcher { display: none !important; }' +
        // Never capture the published poster, even during its handoff fade.
        '[data-connected-poster] { display: none !important; }',
    });
    await page.locator('nextjs-portal').evaluateAll((nodes) => nodes.forEach((node) => node.remove()));
    // No animation-frame wait: time is held, so frames never fire, and the screenshot forces its own paint.

    const png = await page.screenshot({ type: 'png' });
    const encoded = await encodeWebp(page, png, entry.maxBytes);
    if (encoded.width !== entry.width || encoded.height !== entry.height) {
      throw new Error(`${file}: captured ${encoded.width}x${encoded.height}, expected ${entry.width}x${entry.height}`);
    }
    fs.writeFileSync(path.join(outDir, file), encoded.bytes);
    console.log(
      `${file}: ${entry.width}x${entry.height}, q=${encoded.quality}, ${encoded.bytes.length} bytes ` +
        `(${(encoded.bytes.length / KIB).toFixed(1)} KiB of ${(entry.maxBytes / KIB).toFixed(0)} KiB); ` +
        `tier=${pose.tier} progress=${pose.progress.toFixed(6)} idleAngle=${pose.idleAngleRadians.toFixed(6)} renderCount=${pose.renderCount}`,
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
