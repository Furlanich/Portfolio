import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// PLAN-SFC-V1 Task 2: the frozen W1 contracts that Node can see. The compile-time shapes (Ground props,
// optional capabilityIndex, primitive props) live in tests/types/sfc-ground.ts and are enforced by
// `npm run typecheck`. Nothing here renders JSX: rendered evidence belongs to the page packets.

const { connectedMediaManifest, getConnectedPoster } = await import('../lib/connected-studio/media-manifest.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFileSync(`${root}${file}`, 'utf8');
const KIB = 1024;

const legacyRoutes = ['services', 'projects'];
const newRoutes = ['studio', 'founder', 'contact'];
const qualities = ['wide', 'compact'];

test('the manifest declares six unpublished entries for the new routes beside the four published ones', () => {
  assert.equal(connectedMediaManifest.length, 10);
  for (const route of legacyRoutes) {
    for (const quality of qualities) assert.equal(getConnectedPoster(route, quality).published, true, `${route} ${quality} stays published`);
  }
  for (const route of newRoutes) {
    for (const quality of qualities) {
      const entry = getConnectedPoster(route, quality);
      assert.equal(entry.published, false, `${route} ${quality} is unpublished until its page packet captures it`);
      assert.equal(entry.src, `/brand/connected-studio/${route}-${quality}.webp`);
      assert.equal(entry.maxBytes, (quality === 'wide' ? 150 : 80) * KIB);
      assert.deepEqual({ width: entry.width, height: entry.height }, quality === 'wide' ? { width: 1920, height: 1080 } : { width: 900, height: 1600 });
    }
  }
  assert.equal(new Set(connectedMediaManifest.map((entry) => entry.src)).size, 10, 'every poster has its own file');
});

test('getConnectedPoster rejects an unknown route or quality instead of inventing an entry', () => {
  assert.throws(() => getConnectedPoster('terms', 'wide'), RangeError);
  assert.throws(() => getConnectedPoster('studio', 'tablet'), RangeError);
});

test('the Ground never references a poster before it is published and mounts the live leaf only by policy', () => {
  const ground = read('components/connected-studio/ConnectedStudioGround.tsx');
  assert.match(ground, /\.published\)/, 'poster custom properties are set only for published entries');
  assert.match(ground, /CONNECTED_LIVE_POLICY/, 'the Ground reads the live policy on the server');
  assert.doesNotMatch(ground, /['"]use client['"]/, 'the Ground stays a server component');
  assert.match(ground, /wordBindings/, 'new routes carry word bindings');
  assert.match(ground, /data-capability-words/, 'legacy routes keep the capability-words attribute');
});

test('the shared primitives are server-only and expose the frozen data attributes', () => {
  const plate = read('components/surfaces/AtlasPlate.tsx');
  assert.match(plate, /variant\?:\s*'default'\s*\|\s*'editorial-opaque'/);
  assert.match(plate, /data-connected-opaque-plate/, 'the editorial plate marks itself for cached hit testing');

  const scrim = read('components/surfaces/AtlasScrim.tsx');
  assert.match(scrim, /clearance:\s*24\s*\|\s*32/);
  assert.match(scrim, /data-connected-reading-mask/);
  assert.match(scrim, /data-connected-clearance/);

  const container = read('components/surfaces/AtlasEditorialContainer.tsx');
  assert.match(container, /AtlasEditorialContainer/);

  for (const source of [plate, scrim, container]) {
    assert.doesNotMatch(source, /['"]use client['"]/);
    assert.doesNotMatch(source, /\bon[A-Z][A-Za-z]*\s*=\s*\{/, 'no event handlers');
  }
});

test('the default AtlasPlate material is unchanged: blurred, ticked and translucent by default', () => {
  const plate = read('components/surfaces/AtlasPlate.tsx');
  assert.match(plate, /blur\s*=\s*true/);
  assert.match(plate, /sky-plate-material/);
  assert.match(plate, /atlasPlateTick/);
});

test('the editorial plate and scrim carry their approved material values in the shared stylesheet only', () => {
  const css = read('components/surfaces/surfaces.module.css');
  for (const value of ['#0A1E33', '#36536C', '16px', '#06121F', '8px', '1244px', '32px', '20px', '768px']) {
    assert.ok(css.includes(value), `surfaces.module.css carries ${value}`);
  }
  assert.doesNotMatch(css.slice(css.indexOf('editorialOpaque')), /backdrop-filter\s*:\s*blur/, 'the editorial plate has no blur');
});

// --- compiler discovery excludes ignored task worktrees ---------------------------------------------------

test('tsconfig discovery excludes a checkout under .worktrees but keeps real source', async () => {
  const { default: ts } = await import('typescript');
  const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const path = await import('node:path');

  const dir = mkdtempSync(path.join(tmpdir(), 'sfc-tsconfig-'));
  try {
    const files = ['app/page.ts', '.worktrees/sfc-99/app/page.ts', '.worktrees/sfc-99/node_modules/x/index.ts', 'node_modules/y/index.ts'];
    for (const file of files) {
      mkdirSync(path.join(dir, path.dirname(file)), { recursive: true });
      writeFileSync(path.join(dir, file), 'export {};\n');
    }
    const config = JSON.parse(read('tsconfig.json'));
    // TypeScript's wildcard include already skips dot-directories, so discovery below passes even without the
    // entry; the exclusion is still declared explicitly so it survives an include change (plan Task 2 ruling).
    assert.ok(config.exclude.some((entry) => entry === '.worktrees' || entry === '.worktrees/**'), 'tsconfig declares the .worktrees exclusion');
    const parsed = ts.parseJsonConfigFileContent(config, ts.sys, dir);
    const found = parsed.fileNames.map((name) => path.relative(dir, name).split(path.sep).join('/'));
    assert.deepEqual(found, ['app/page.ts'], 'only the real source is discovered');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
