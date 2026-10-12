import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// PLAN-SPF-V1 Task 8: the matched static posters and the truthful responsive project imagery. The
// manifest, the files on disk, the byte ceilings and the wiring contracts are asserted here; the
// browser specs (connected-studio-static.spec.ts and the static visual spec) cover what renders.

const { connectedMediaManifest, getConnectedPoster } = await import('../lib/connected-studio/media-manifest.ts');
const { CONNECTED_LIVE_POLICY } = await import('../lib/connected-studio/capability.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const KIB = 1024;
const routes = ['services', 'projects'];

const publicFile = (publicPath) => `${root}public${publicPath}`;

/** Pixel size of a WebP file (lossy VP8, lossless VP8L or extended VP8X), read from its header. */
function webpSize(file) {
  const bytes = readFileSync(file);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', `${file} is a RIFF container`);
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', `${file} is a WebP file`);
  const format = bytes.toString('ascii', 12, 16);
  if (format === 'VP8 ') return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
  if (format === 'VP8L') {
    const bits = bytes.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (format === 'VP8X') return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 };
  assert.fail(`${file}: unknown WebP chunk ${format}`);
}

test('compact static media selects an existing ≤80KiB matched poster without engine', () => {
  for (const route of routes) {
    const poster = getConnectedPoster(route, 'compact');
    assert.equal(poster.published, true, `${route} compact poster is published in the manifest`);
    assert.ok(existsSync(publicFile(poster.src)), `${route} compact poster file exists at ${poster.src}`);
    const bytes = statSync(publicFile(poster.src)).size;
    assert.ok(bytes <= 80 * KIB && bytes <= poster.maxBytes, `${route} compact poster is ${bytes} bytes, over the 80KiB ceiling`);
    assert.deepEqual(webpSize(publicFile(poster.src)), { width: poster.width, height: poster.height }, `${route} compact poster has its intrinsic size`);
  }
  // Static selection is manifest data plus CSS: neither module imports the engine, Three or a client boundary.
  for (const file of ['lib/connected-studio/media-manifest.ts', 'components/connected-studio/ConnectedStudioGround.tsx']) {
    const source = readFileSync(`${root}${file}`, 'utf8');
    assert.doesNotMatch(source, /from ['"]three['"]|create-connected-scene|['"]use client['"]/, `${file} stays free of the engine`);
  }
});

test('wide static media selects an existing ≤150KiB matched poster at its intrinsic size', () => {
  for (const route of routes) {
    const poster = getConnectedPoster(route, 'wide');
    assert.equal(poster.published, true, `${route} wide poster is published in the manifest`);
    assert.ok(existsSync(publicFile(poster.src)), `${route} wide poster file exists at ${poster.src}`);
    const bytes = statSync(publicFile(poster.src)).size;
    assert.ok(bytes <= 150 * KIB && bytes <= poster.maxBytes, `${route} wide poster is ${bytes} bytes, over the 150KiB ceiling`);
    assert.deepEqual(webpSize(publicFile(poster.src)), { width: poster.width, height: poster.height }, `${route} wide poster has its intrinsic size`);
  }
});

test('the four posters are one family: distinct files, one folder, the same naming rule', () => {
  assert.equal(connectedMediaManifest.length, 4);
  assert.equal(new Set(connectedMediaManifest.map((entry) => entry.src)).size, 4);
  for (const entry of connectedMediaManifest) {
    assert.equal(entry.src, `/brand/connected-studio/${entry.route}-${entry.quality}.webp`);
  }
});

test('poster URLs resolve at the root and at the /Portfolio base path', async () => {
  const saved = process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    for (const base of ['', '/Portfolio']) {
      process.env.NEXT_PUBLIC_BASE_PATH = base;
      const { withBasePath } = await import(`../lib/paths.ts?base=${encodeURIComponent(base || 'root')}`);
      for (const entry of connectedMediaManifest) {
        const url = withBasePath(entry.src);
        assert.equal(url, `${base}${entry.src}`);
        assert.ok(existsSync(publicFile(url.slice(base.length))), `${url} resolves to a committed file`);
      }
    }
  } finally {
    if (saved === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = saved;
  }
});

test('merged builds keep both live tiers off while posters ship', () => {
  assert.deepEqual({ ...CONNECTED_LIVE_POLICY }, { wide: false, compact: false });
});

const illustrations = [
  { dir: 'general-reservation-system', base: 'conceptual-workflow', originalBytes: 47784 },
  { dir: 'the-system', base: 'conceptual-access-model', originalBytes: 46816 },
];

test('project illustration derivatives keep the whole 1599:900 frame at 640, 960 and 1280 wide', () => {
  for (const { dir, base } of illustrations) {
    for (const width of [640, 960, 1280]) {
      const file = publicFile(`/projects/${dir}/${base}-${width}.webp`);
      assert.ok(existsSync(file), `${base}-${width}.webp exists beside the original`);
      const size = webpSize(file);
      assert.equal(size.width, width);
      assert.ok(Math.abs(size.height - (width * 900) / 1599) <= 1, `${base}-${width}.webp keeps the 1599:900 ratio (got ${size.width}x${size.height})`);
    }
  }
});

test('both original illustrations stay intact beside their derivatives', () => {
  for (const { dir, base, originalBytes } of illustrations) {
    const file = publicFile(`/projects/${dir}/${base}.webp`);
    assert.equal(statSync(file).size, originalBytes, `${base}.webp is byte-for-byte the size it was`);
    assert.deepEqual(webpSize(file), { width: 1599, height: 900 });
  }
});

test('the dossier image offers every variant, sizes, its intrinsic size and lazy loading', async () => {
  const { getIllustrationVariants, buildIllustrationSrcSet } = await import('../lib/projects/illustration-variants.ts');
  for (const { dir, base } of illustrations) {
    const original = `/projects/${dir}/${base}.webp`;
    const variants = getIllustrationVariants(original);
    assert.deepEqual(variants.map((variant) => variant.width), [640, 960, 1280, 1599]);
    assert.equal(variants.at(-1).src, original, 'the original is the largest candidate');
    for (const variant of variants) assert.ok(existsSync(publicFile(variant.src)), `${variant.src} exists`);
    assert.equal(
      buildIllustrationSrcSet(original, (path) => `/Portfolio${path}`),
      variants.map((variant) => `/Portfolio${variant.src} ${variant.width}w`).join(', '),
    );
  }
  const dossier = readFileSync(`${root}components/projects/ProjectDossier.tsx`, 'utf8');
  assert.match(dossier, /srcSet=/, 'ProjectDossier passes a srcSet');
  assert.match(dossier, /sizes=/, 'ProjectDossier passes sizes');
  assert.match(dossier, /loading="lazy"/, 'below-fold artwork loads lazily');
  assert.match(dossier, /width=\{visual\.width\}/);
  assert.match(dossier, /height=\{visual\.height\}/);
});

test('no page preloads a poster or either project illustration', () => {
  for (const file of ['components/connected-studio/ConnectedStudioGround.tsx', 'components/projects/ProjectDossier.tsx', 'app/(es)/layout.tsx', 'app/(en)/layout.tsx']) {
    const source = readFileSync(`${root}${file}`, 'utf8');
    assert.doesNotMatch(source, /rel=["']preload["']|preload\(|fetchPriority=["']high["']|priority(?:=|\s|\})/, `${file} adds no preload or priority hint for artwork`);
  }
});

// --- the start pose (owner direction, 2026-10-12): the poster's pose is the live scene's first frame ---------

test("one pose is shared by the poster capture and the live scene's first frame", async () => {
  const { CONNECTED_POSTER_POSE } = await import('../lib/connected-studio/media-manifest.ts');
  assert.deepEqual({ ...CONNECTED_POSTER_POSE }, { progress: 0.6, idleAngleRadians: 0.5 });
  const capture = readFileSync(`${root}scripts/capture-connected-studio-posters.mjs`, 'utf8');
  assert.match(capture, /CONNECTED_POSTER_POSE/, 'the capture script reads the shared pose');
  assert.doesNotMatch(capture, /const TARGET_PROGRESS = 0\.6|const TARGET_IDLE_ANGLE = 0\.5/, 'and does not repeat its numbers');
  const host = readFileSync(`${root}components/connected-studio/ConnectedStudioEnhancement.tsx`, 'utf8');
  assert.match(host, /startPose:\s*CONNECTED_POSTER_POSE/, 'the host starts the controller on it');
});
