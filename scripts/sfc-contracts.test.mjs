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

// --- reproducible QA candidate (scripts/prepare-sfc-candidate.mjs) -------------------------------------------

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync as mkdir, mkdtempSync as mkdtemp, readFileSync as readText, rmSync as rm, writeFileSync as write } from 'node:fs';
import { tmpdir as osTmpdir } from 'node:os';
import nodePath from 'node:path';

const candidate = await import('../scripts/prepare-sfc-candidate.mjs');

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const sha256 = (file) => createHash('sha256').update(readText(file)).digest('hex');
const text = (dir, file) => readText(nodePath.join(dir, file), 'utf8');

/** The frozen declaration PLAN-SFC-V1 Task 5 must create byte-for-byte; the commercial patch is cut against it. */
const FROZEN_RELEASE = `export type InquiryReleaseRecord = { readonly mode: 'demonstration' | 'commercial'; readonly releaseId: string };

export const INQUIRY_RELEASE: InquiryReleaseRecord = {
  mode: 'demonstration',
  releaseId: 'DEMONSTRATION',
};
`;

function makeRepo(files) {
  const dir = mkdtemp(nodePath.join(osTmpdir(), 'sfc-candidate-'));
  git(dir, 'init', '-q');
  git(dir, 'config', 'user.email', 'qa@example.test');
  git(dir, 'config', 'user.name', 'QA');
  git(dir, 'config', 'core.autocrlf', 'false');
  for (const [name, content] of Object.entries(files)) {
    mkdir(nodePath.dirname(nodePath.join(dir, name)), { recursive: true });
    write(nodePath.join(dir, name), content);
  }
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'base');
  return dir;
}

/** Cuts a patch by editing a file, diffing and restoring it. */
function cutPatch(dir, patchPath, file, edit) {
  write(nodePath.join(dir, file), edit(text(dir, file)));
  const patch = git(dir, 'diff', '-U1', '--', file);
  git(dir, 'checkout', '--', file);
  mkdir(nodePath.dirname(patchPath), { recursive: true });
  write(patchPath, patch);
}

function fixture() {
  const dir = makeRepo({
    'lib/inquiry/release.ts': FROZEN_RELEASE,
    'lib/connected-studio/capability.ts': 'export const CONNECTED_LIVE_POLICY = Object.freeze({ wide: false, compact: false });\n',
    'app/page.ts': 'export {};\n',
  });
  const patchDir = nodePath.join(dir, '.patches');
  cutPatch(dir, nodePath.join(patchDir, 'commercial-release.patch'), 'lib/inquiry/release.ts', (source) =>
    source.replace("mode: 'demonstration'", "mode: 'commercial'").replace("releaseId: 'DEMONSTRATION'", `releaseId: '${candidate.QA_MARKER}'`));
  cutPatch(dir, nodePath.join(patchDir, 'live-policy.patch'), 'lib/connected-studio/capability.ts', (source) => source.replace(/false/g, 'true'));
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'patches');
  return { dir, patchDir, run: (command, kind, extra = {}) => candidate.runCandidate({ command, kind, repoRoot: dir, patchDir, ...extra }) };
}

test('apply records the head and patch hashes, and restore returns a clean tree', () => {
  const { dir, patchDir, run } = fixture();
  try {
    const head = git(dir, 'rev-parse', 'HEAD').trim();
    const applied = run('apply', 'commercial');
    assert.equal(applied.ok, true, applied.message);
    assert.match(text(dir, 'lib/inquiry/release.ts'), /mode: 'commercial'/);
    assert.match(text(dir, 'lib/inquiry/release.ts'), new RegExp(candidate.QA_MARKER));
    assert.equal(applied.record.head, head);
    assert.deepEqual(applied.record.patches, [{ name: 'commercial-release.patch', sha256: sha256(nodePath.join(patchDir, 'commercial-release.patch')) }]);

    assert.equal(run('apply', 'commercial').ok, false, 'a second apply is refused while one is active');
    const restored = run('restore', 'commercial');
    assert.equal(restored.ok, true, restored.message);
    assert.equal(git(dir, 'status', '--porcelain', '--untracked-files=no'), '', 'restore leaves no diff');
    assert.equal(run('restore', 'commercial').ok, false, 'restore without an active candidate is refused');
  } finally {
    rm(dir, { recursive: true, force: true });
  }
});

test('the combined kind applies both patches and restore reverses both', () => {
  const { dir, run } = fixture();
  try {
    assert.equal(run('apply', 'combined').ok, true);
    assert.match(text(dir, 'lib/connected-studio/capability.ts'), /wide: true, compact: true/);
    assert.match(text(dir, 'lib/inquiry/release.ts'), /commercial/);
    assert.equal(run('restore', 'runtime').ok, false, 'restore must name the kind that was applied');
    assert.equal(run('restore', 'combined').ok, true);
    assert.equal(git(dir, 'status', '--porcelain', '--untracked-files=no'), '');
  } finally {
    rm(dir, { recursive: true, force: true });
  }
});

test('apply refuses a dirty tree, a different expected head, an unknown kind and a missing or mismatched target', () => {
  const { dir, run } = fixture();
  try {
    write(nodePath.join(dir, 'app/page.ts'), 'export const changed = true;\n');
    assert.equal(run('apply', 'runtime').ok, false, 'a dirty tree is refused');
    git(dir, 'checkout', '--', 'app/page.ts');

    assert.equal(run('apply', 'runtime', { expectHead: '0'.repeat(40) }).ok, false, 'an unexpected head is refused');
    assert.equal(run('apply', 'bogus').ok, false, 'an unknown kind is refused');

    // Mismatch: the target moved on after the patch was cut.
    write(nodePath.join(dir, 'lib/inquiry/release.ts'), FROZEN_RELEASE.replace("releaseId: 'DEMONSTRATION'", "releaseId: 'SOMETHING-ELSE'"));
    git(dir, 'commit', '-q', '-am', 'drift');
    const mismatched = run('apply', 'combined');
    assert.equal(mismatched.ok, false, 'a patch whose context no longer matches is refused');
    assert.equal(git(dir, 'status', '--porcelain', '--untracked-files=no'), '', 'nothing stays applied when one patch fails');
    assert.match(text(dir, 'lib/connected-studio/capability.ts'), /wide: false/, 'the runtime patch did not stay applied');

    rm(nodePath.join(dir, 'lib/inquiry/release.ts'));
    git(dir, 'commit', '-q', '-am', 'missing');
    assert.equal(run('apply', 'commercial').ok, false, 'a missing target is refused');
  } finally {
    rm(dir, { recursive: true, force: true });
  }
});

test('restore refuses a patch file that changed since apply and a tree that drifted', () => {
  const { dir, patchDir, run } = fixture();
  try {
    assert.equal(run('apply', 'runtime').ok, true);
    const patchFile = nodePath.join(patchDir, 'live-policy.patch');
    const original = readText(patchFile, 'utf8');
    write(patchFile, `${original}\n`);
    assert.equal(run('restore', 'runtime').ok, false, 'a patch with a different hash is not trusted');
    write(patchFile, original);
    write(nodePath.join(dir, 'lib/connected-studio/capability.ts'), 'export const CONNECTED_LIVE_POLICY = "drifted";\n');
    assert.equal(run('restore', 'runtime').ok, false, 'a drifted target cannot be reversed');
  } finally {
    rm(dir, { recursive: true, force: true });
  }
});

test('verify-clean rejects the QA marker in application source and an unrestored candidate', () => {
  const { dir, run } = fixture();
  try {
    assert.equal(run('verify-clean').ok, true, 'the committed fixture tree is clean');
    assert.equal(run('apply', 'commercial').ok, true);
    const dirty = run('verify-clean');
    assert.equal(dirty.ok, false);
    assert.match(dirty.message, /candidate|QA-CANDIDATE-NOT-FOR-DEPLOYMENT/);
    assert.equal(run('restore', 'commercial').ok, true);
    assert.equal(run('verify-clean').ok, true);

    write(nodePath.join(dir, 'app/page.ts'), `export const releaseId = '${candidate.QA_MARKER}';\n`);
    git(dir, 'commit', '-q', '-am', 'leak');
    assert.equal(run('verify-clean').ok, false, 'a committed QA marker is rejected');
  } finally {
    rm(dir, { recursive: true, force: true });
  }
});

test('the committed fixtures apply to the real live-policy target and to the frozen release declaration', () => {
  // Runtime patch: the real repository file (read-only check; nothing is applied).
  const livePolicy = nodePath.join(root, 'tests/fixtures/sfc/live-policy.patch');
  execFileSync('git', ['apply', '--check', livePolicy], { cwd: root });
  assert.match(readText(livePolicy, 'utf8'), /\+export const CONNECTED_LIVE_POLICY: ConnectedLivePolicy = Object\.freeze\(\{ wide: true, compact: true \}\);/);

  // Commercial patch: cut against the frozen declaration, which Task 5 creates identically.
  const dir = makeRepo({ 'lib/inquiry/release.ts': FROZEN_RELEASE });
  try {
    const patch = nodePath.join(root, 'tests/fixtures/sfc/commercial-release.patch');
    execFileSync('git', ['apply', patch], { cwd: dir });
    const patched = text(dir, 'lib/inquiry/release.ts');
    assert.equal(
      patched,
      FROZEN_RELEASE.replace("  mode: 'demonstration',", "  mode: 'commercial',").replace("  releaseId: 'DEMONSTRATION',", `  releaseId: '${candidate.QA_MARKER}',`),
      'the patch changes exactly the mode and release id lines',
    );
    execFileSync('git', ['apply', '-R', patch], { cwd: dir });
    assert.equal(text(dir, 'lib/inquiry/release.ts'), FROZEN_RELEASE);
  } finally {
    rm(dir, { recursive: true, force: true });
  }
});

test('the candidate CLI exits nonzero with a message for a bad request and performs no request', () => {
  const result = spawnSync(process.execPath, ['scripts/prepare-sfc-candidate.mjs', 'apply', '--kind=bogus'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /kind/i);
  assert.doesNotMatch(read('scripts/prepare-sfc-candidate.mjs'), /fetch\(|https?:\/\//, 'the script performs no request and embeds no URL');
  assert.ok(existsSync(nodePath.join(root, 'tests/fixtures/sfc/commercial-release.patch')));
});
