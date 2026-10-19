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

test('the manifest declares six entries for the new routes beside the four legacy ones; Task 14 publishes them with their captured files', () => {
  assert.equal(connectedMediaManifest.length, 10);
  for (const route of legacyRoutes) {
    for (const quality of qualities) assert.equal(getConnectedPoster(route, quality).published, true, `${route} ${quality} stays published`);
  }
  for (const route of newRoutes) {
    for (const quality of qualities) {
      const entry = getConnectedPoster(route, quality);
      assert.equal(entry.published, true, `${route} ${quality} is published by PLAN-SFC-V1 Task 14 with its captured file (scripts/connected-studio-media.test.mjs asserts the file)`);
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

test('the Ground layer never references a poster before it is published; each Ground carries its own words and live leaf', () => {
  const layer = read('components/connected-studio/ConnectedStudioGroundLayer.tsx');
  const legacy = read('components/connected-studio/ConnectedStudioGround.tsx');
  const atlas = read('components/connected-studio/ConnectedStudioAtlasGround.tsx');
  const seam = read('components/connected-studio/atlas-live-host.tsx');
  assert.match(layer, /\.published\)/, 'poster custom properties are set only for published entries');
  for (const source of [layer, legacy, atlas, seam]) assert.doesNotMatch(source, /['"]use client['"]/, 'the Ground files stay server components');
  assert.match(atlas, /data-word-bindings/, 'new routes carry word bindings');
  assert.match(legacy, /data-capability-words/, 'legacy routes keep the capability-words attribute');
  // The shipped seam imports nothing: it is the only place a qualified enablement attaches the host to an Atlas page.
  assert.doesNotMatch(seam, /^import(?!\s+type)/m, 'the shipped live-host seam has no runtime import');
  assert.match(seam, /return null/, 'the shipped seam renders nothing');
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
  const editorialRules = [...css.matchAll(/\.editorialPlate[^{]*\{[^}]*\}/g)].map((match) => match[0]).join('\n');
  assert.ok(editorialRules.includes('#0A1E33'), 'the editorial plate rules exist and carry the Deep fill');
  assert.doesNotMatch(editorialRules, /backdrop-filter|box-shadow/, 'the editorial plate has no blur or shadow');
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
/** Patch text as LF, like the script reads it: a Windows checkout may hold the committed file as CRLF. */
const lf = (file) => readText(file, 'utf8').replace(/\r\n/g, '\n');
const sha256 = (file) => createHash('sha256').update(lf(file)).digest('hex');
const applyPatch = (cwd, patchFile, ...flags) => execFileSync('git', ['apply', ...flags, '-'], { cwd, input: lf(patchFile) });
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
  applyPatch(root, livePolicy, '--check');
  assert.match(readText(livePolicy, 'utf8'), /\+export const CONNECTED_LIVE_POLICY: ConnectedLivePolicy = Object\.freeze\(\{ wide: true, compact: true \}\);/);

  // Commercial patch: cut against the frozen declaration, which Task 5 creates identically.
  const dir = makeRepo({ 'lib/inquiry/release.ts': FROZEN_RELEASE });
  try {
    const patch = nodePath.join(root, 'tests/fixtures/sfc/commercial-release.patch');
    applyPatch(dir, patch);
    const patched = text(dir, 'lib/inquiry/release.ts');
    assert.equal(
      patched,
      FROZEN_RELEASE.replace("  mode: 'demonstration',", "  mode: 'commercial',").replace("  releaseId: 'DEMONSTRATION',", `  releaseId: '${candidate.QA_MARKER}',`),
      'the patch changes exactly the mode and release id lines',
    );
    applyPatch(dir, patch, '-R');
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

// --- export requirement partition (PLAN-SFC-V1 Task 2) ----------------------------------------------------------

const partition = [
  { name: 'studio', exportName: 'studioRequirements', routes: ['estudio/index.html', 'en/about/index.html'] },
  { name: 'founder', exportName: 'founderRequirements', routes: ['estudio/samuel-furlanich/index.html', 'en/about/samuel-furlanich/index.html'] },
  { name: 'contact', exportName: 'contactRequirements', routes: ['contacto/index.html', 'en/contact/index.html'] },
  { name: 'privacy', exportName: 'privacyRequirements', routes: ['privacidad/index.html', 'en/privacy/index.html'] },
  { name: 'home', exportName: 'homepageRequirements', routes: ['index.html', 'en/index.html'] },
  { name: 'services', exportName: 'servicesRequirements', routes: ['servicios/index.html', 'en/services/index.html'] },
];

test('each page owns one declarative requirement map and the shared verifier only imports them', async () => {
  const verifier = read('scripts/verify-static-export.mjs');
  for (const { name, exportName, routes } of partition) {
    assert.doesNotMatch(verifier, new RegExp(`const ${exportName}\\s*=\\s*\\{`), `${exportName} is no longer declared inline`);
    assert.match(verifier, new RegExp(`from '\\./export-requirements/${name}\\.mjs'`), `the verifier imports ${name}`);
    const requirements = await import(`./export-requirements/${name}.mjs`);
    assert.deepEqual(Object.keys(requirements[exportName]), routes, `${name} requires exactly its two localized routes`);
  }
});

test('requirement maps are plain data that import neither each other nor the verifier', () => {
  for (const { name } of partition) {
    const source = read(`scripts/export-requirements/${name}.mjs`);
    assert.doesNotMatch(source, /^\s*import\b|await import\(/m, `${name}.mjs declares data only, so no page packet edits another page's requirements`);
  }
});

test('export-test-support runs the real verifier against a fixture export', async () => {
  const { createExportFixture, runVerifier } = await import('./export-test-support.mjs');
  const empty = runVerifier({ files: {} });
  assert.notEqual(empty.status, 0, 'an empty export fails verification');
  assert.match(empty.output, /estudio\/index\.html/, 'the verifier reports the missing Studio route');

  const fixture = createExportFixture({ 'estudio/index.html': '<!doctype html><title>x</title>' });
  try {
    assert.ok(existsSync(nodePath.join(fixture.directory, 'estudio/index.html')));
    const result = runVerifier({ directory: fixture.directory, basePath: '/Portfolio' });
    assert.notEqual(result.status, 0);
    assert.match(result.output, /estudio\/index\.html/);
  } finally {
    fixture.cleanup();
  }
  assert.equal(existsSync(fixture.directory), false, 'cleanup removes the fixture directory');
});

// --- ADR metadata (ADR-INDEX: a changed decision names its predecessor in `supersedes`) ----------------------------

test('the commercial Atlas ADR names both partially superseded predecessors in supersedes metadata', () => {
  const lines = read('docs/decisions/studio-founder-contact-commercial-atlas.md').split(/\r?\n/);
  const end = lines.indexOf('---', 1);
  const front = lines.slice(1, end);
  const start = front.indexOf('supersedes:');
  assert.ok(start >= 0, 'supersedes metadata is declared');
  const superseded = [];
  for (const line of front.slice(start + 1)) {
    if (!line.startsWith('  - ')) break;
    superseded.push(line.slice(4).trim());
  }
  assert.deepEqual(superseded.sort(), ['ADR-CONNECTED-STUDIO-PAGE-RUNTIME', 'ADR-CONTACT-INQUIRY-DEMO-MODE']);
  // Retained dependencies stay `related`, not superseded.
  assert.ok(front.includes('  - ADR-CONTACT-INQUIRY-PIPELINE') && !superseded.includes('ADR-CONTACT-INQUIRY-PIPELINE'));
});

// --- Host reachability (PLAN-SFC-V1 Task 16, the Task 14 "host ships in every Atlas page" finding) -----------------
// Next ships a client component's chunk with every page whose server module graph can reach it, rendered or not
// (measured: Studio, Founder and Contact loaded the host in a policy-disabled build, +27 to +144 ms startup CPU).
// Reachability is therefore the contract, and a source import graph proves it without a build.

function reachableFiles(entry) {
  const seen = new Set();
  const pending = [entry];
  while (pending.length > 0) {
    const file = pending.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const source = readFileSync(`${root}${file}`, 'utf8');
    for (const match of source.matchAll(/(?:import|export)\s[^;]*?from\s+'([^']+)'|import\s+'([^']+)'/g)) {
      const specifier = match[1] ?? match[2];
      const base = specifier.startsWith('@/') ? specifier.slice(2) : specifier.startsWith('.') ? posixJoin(file, specifier) : undefined;
      if (!base) continue;
      const found = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'].map((suffix) => base + suffix).find((candidate) => existsSync(`${root}${candidate}`) && !candidate.endsWith('.css'));
      if (found && /\.(ts|tsx)$/.test(found)) pending.push(found);
    }
  }
  return seen;
}

function posixJoin(from, specifier) {
  const parts = from.split('/').slice(0, -1);
  for (const part of specifier.split('/')) {
    if (part === '..') parts.pop();
    else if (part !== '.') parts.push(part);
  }
  return parts.join('/');
}

const HOST = 'components/connected-studio/ConnectedStudioEnhancement.tsx';

test('Studio, Founder and Contact cannot reach the connected host, so a policy-disabled build never ships it', () => {
  for (const page of ['components/studio/StudioPage.tsx', 'components/founder/FounderPage.tsx', 'components/contact/ContactPage.tsx']) {
    assert.equal(reachableFiles(page).has(HOST), false, `${page} must not import the host, even behind a policy branch`);
  }
});

test('Services and Projects keep the host: they always mount the leaf, which gates itself', () => {
  for (const page of ['components/services/ServicesPage.tsx', 'components/projects/ProjectsPage.tsx']) {
    assert.equal(reachableFiles(page).has(HOST), true, `${page} still mounts the host`);
  }
});
