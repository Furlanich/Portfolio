import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// PLAN-SPF-V1 Task 8: the matched static posters and the truthful responsive project imagery. The
// manifest, the files on disk, the byte ceilings and the wiring contracts are asserted here; the
// browser specs (connected-studio-static.spec.ts and the static visual spec) cover what renders.

const { connectedMediaManifest, getConnectedPoster } = await import('../lib/connected-studio/media-manifest.ts');
const { CONNECTED_LIVE_POLICY } = await import('../lib/connected-studio/capability.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const KIB = 1024;
const routes = ['services', 'projects'];
const atlasRoutes = ['studio', 'founder', 'contact'];

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

test('the ten published posters are one family: distinct files, one folder, the same naming rule', () => {
  // PLAN-SFC-V1 Task 14 publishes the six Atlas posters beside the four legacy ones.
  const published = connectedMediaManifest.filter((entry) => entry.published);
  assert.equal(published.length, 10);
  assert.deepEqual(new Set(published.map((entry) => entry.route)), new Set([...routes, ...atlasRoutes]));
  assert.equal(new Set(published.map((entry) => entry.src)).size, 10);
  for (const entry of connectedMediaManifest) {
    assert.equal(entry.src, `/brand/connected-studio/${entry.route}-${entry.quality}.webp`);
  }
});

// --- PLAN-SFC-V1 Task 14: six matched, label-free Atlas posters ------------------------------------------------

test('every Atlas route publishes a wide and a compact poster inside its byte ceiling at its intrinsic size', () => {
  for (const route of atlasRoutes) {
    for (const [quality, ceilingKiB, size] of [
      ['wide', 150, { width: 1920, height: 1080 }],
      ['compact', 80, { width: 900, height: 1600 }],
    ]) {
      const poster = getConnectedPoster(route, quality);
      assert.equal(poster.published, true, `${route} ${quality} poster is published in the manifest`);
      assert.ok(existsSync(publicFile(poster.src)), `${route} ${quality} poster file exists at ${poster.src}`);
      const bytes = statSync(publicFile(poster.src)).size;
      assert.ok(bytes <= ceilingKiB * KIB && bytes <= poster.maxBytes, `${route} ${quality} poster is ${bytes} bytes, over the ${ceilingKiB}KiB ceiling`);
      assert.ok(bytes > 4 * KIB, `${route} ${quality} poster is ${bytes} bytes: too small to be a rendered scene`);
      assert.deepEqual(webpSize(publicFile(poster.src)), size, `${route} ${quality} poster has its encoded size`);
    }
  }
});

test('a poster differs from another exactly when its rest composition differs, and none repeats a legacy poster', async () => {
  // DESIGN-SFC-V1 gives all three Atlas pages ONE compact composition (eight anchors, ten edges), so the label-free
  // compact posters are the same rendered scene; the three wide compositions differ. A poster must follow its
  // composition: never a fabricated difference, never a copy where the geometry differs.
  const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
  const { CONNECTED_POSTER_CAPTURE } = await import('../lib/connected-studio/media-manifest.ts');
  const composition = (route, quality) => {
    const { width, height } = CONNECTED_POSTER_CAPTURE[quality];
    const profile = getConnectedProfile(route, quality, { width, height });
    return JSON.stringify({ nodes: profile.graph.nodes.map((node) => [node.id, node.anchor, node.seed]), edges: profile.graph.edges.map((edge) => [edge.from, edge.to]), style: profile.nodeStyle });
  };
  const hash = (route, quality) => createHash('sha256').update(readFileSync(publicFile(getConnectedPoster(route, quality).src))).digest('hex');
  for (const quality of ['wide', 'compact']) {
    for (const [index, a] of atlasRoutes.entries()) {
      for (const b of atlasRoutes.slice(index + 1)) {
        assert.equal(hash(a, quality) === hash(b, quality), composition(a, quality) === composition(b, quality), `${a} and ${b} ${quality}: the images are identical exactly when their compositions are`);
      }
    }
  }
  assert.equal(new Set(atlasRoutes.map((route) => hash(route, 'wide'))).size, 3, 'the three wide posters are three different images');
  const legacy = new Set(routes.flatMap((route) => ['wide', 'compact'].map((quality) => hash(route, quality))));
  for (const route of atlasRoutes) {
    for (const quality of ['wide', 'compact']) assert.equal(legacy.has(hash(route, quality)), false, `${route} ${quality} repeats a legacy poster`);
  }
});

// Held, named owner: DESIGN-SFC-V1 says Contact multiplies scene opacity by 0.35, and no host or runtime applies it
// (Task 14 finding). The Contact posters are the scene as drawn; when the multiplier lands they must be recaptured so
// the first live paint still matches. Remove `todo` with that remediation packet.
test('the Contact poster carries the 0.35 scene multiplier the live scene applies', { todo: 'no host or runtime applies the specified Contact 0.35 scene opacity (Task 14 finding; packet 20+)' }, () => {
  assert.fail('not applicable until the live Contact scene applies its multiplier');
});

test('the capture script defaults to the Atlas routes and refuses the legacy posters unless asked for them by name', () => {
  const capture = readFileSync(`${root}scripts/capture-connected-studio-posters.mjs`, 'utf8');
  assert.match(capture, /ATLAS_ROUTES/, 'the capture script names the Atlas routes');
  assert.match(capture, /--routes=/, 'a route list can be chosen');
  assert.match(capture, /--allow-legacy/, 'a legacy recapture needs an explicit flag');
  assert.match(capture, /--verify-handoff/, 'the first live frame can be compared with the published poster');
  assert.match(capture, /HANDOFF_CONTROL_SHIFT_PX/, 'the comparison proves it would see an offset');
  for (const [route, pathname] of [
    ['studio', '/estudio/'],
    ['founder', '/estudio/samuel-furlanich/'],
    ['contact', '/contacto/'],
  ]) {
    assert.ok(capture.includes(`${route}: '${pathname}'`), `${route} is captured from ${pathname}`);
  }
});

test('an unpublished entry never claims a file: only published entries must exist on disk', () => {
  for (const entry of connectedMediaManifest) {
    assert.equal(existsSync(publicFile(entry.src)), entry.published, `${entry.src}: file presence matches published=${entry.published}`);
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
        if (entry.published) assert.ok(existsSync(publicFile(url.slice(base.length))), `${url} resolves to a committed file`);
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

test('the first live frame lands on the poster: every Atlas node sits where the cover-cropped capture draws its rest position', async () => {
  const { CONNECTED_POSTER_CAPTURE } = await import('../lib/connected-studio/media-manifest.ts');
  const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
  const { computeProjectionLayout, resolvePosterProjection, projectAnchor } = await import('../lib/connected-studio/projection.ts');
  const viewports = [
    { width: 1920, height: 1080, tier: 'wide' },
    { width: 1440, height: 900, tier: 'wide' },
    { width: 1024, height: 768, tier: 'wide' },
    { width: 450, height: 800, tier: 'compact' },
    { width: 390, height: 844, tier: 'compact' },
    { width: 320, height: 568, tier: 'compact' },
  ];
  for (const route of atlasRoutes) {
    for (const viewport of viewports) {
      const profile = getConnectedProfile(route, viewport.tier, viewport);
      const native = computeProjectionLayout(profile, viewport);
      const capture = CONNECTED_POSTER_CAPTURE[viewport.tier];
      const scale = Math.max(viewport.width / capture.width, viewport.height / capture.height);
      const crop = {
        x: (capture.width * scale - viewport.width) * CONNECTED_POSTER_CAPTURE.position.x,
        y: (capture.height * scale - viewport.height) * CONNECTED_POSTER_CAPTURE.position.y,
      };
      const rest = {
        progress: 0.6,
        idleAngleRadians: 0.5,
        scrollActivity: 0,
        posterBlend: 1,
        edges: [],
        nodes: profile.graph.nodes.map((node) => ({ id: node.id, position: node.anchor, rotation: [0, 0, 0] })),
      };
      const framed = resolvePosterProjection(profile, rest, native);
      for (const anchor of profile.restAnchors) {
        const node = framed.pose.nodes.find((candidate) => candidate.id === anchor.id);
        const at = projectAnchor(node.position, framed.layout);
        const label = `${route} ${viewport.width}x${viewport.height} ${anchor.id}`;
        assert.ok(Math.abs(at.xPx - (anchor.u * capture.width * scale - crop.x)) < 0.05, `${label}: x lands on the poster`);
        assert.ok(Math.abs(at.yPx - (anchor.v * capture.height * scale - crop.y)) < 0.05, `${label}: y lands on the poster`);
      }
    }
  }
});

test('at the capture size itself the poster frame is the native frame, so the poster is the production rest profile with no crop', async () => {
  const { CONNECTED_POSTER_CAPTURE } = await import('../lib/connected-studio/media-manifest.ts');
  const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
  const { computeProjectionLayout, resolvePosterProjection, projectAnchor } = await import('../lib/connected-studio/projection.ts');
  for (const route of atlasRoutes) {
    for (const tier of ['wide', 'compact']) {
      const { width, height } = CONNECTED_POSTER_CAPTURE[tier];
      const profile = getConnectedProfile(route, tier, { width, height });
      const native = computeProjectionLayout(profile, { width, height, tier });
      const pose = {
        progress: 0.6, idleAngleRadians: 0.5, scrollActivity: 0, posterBlend: 1, edges: [],
        nodes: profile.graph.nodes.map((node) => ({ id: node.id, position: node.anchor, rotation: [0, 0, 0] })),
      };
      const framed = resolvePosterProjection(profile, pose, native);
      assert.deepEqual({ x: framed.layout.crop.x, y: framed.layout.crop.y }, { x: 0, y: 0 }, `${route} ${tier}: no crop at the capture size`);
      for (const anchor of profile.restAnchors) {
        const at = projectAnchor(framed.pose.nodes.find((node) => node.id === anchor.id).position, native);
        assert.ok(Math.hypot(at.xPx - anchor.u * width, at.yPx - anchor.v * height) < 0.05, `${route} ${tier} ${anchor.id} sits on its (u, v)`);
      }
    }
  }
});
