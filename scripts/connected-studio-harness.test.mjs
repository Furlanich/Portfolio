import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { createExportServer } = await import('./serve-static-export.mjs');
const { setConnectedTestHook } = await import('../tests/e2e/support/connected-studio-test-hooks.ts');

const root = fileURLToPath(new URL('..', import.meta.url));

// --- scripts/serve-static-export.mjs ---------------------------------------------------------

function createExport() {
  const dir = mkdtempSync(path.join(tmpdir(), 'connected-export-'));
  const files = {
    'index.html': '<!doctype html><title>home</title>',
    '404.html': '<!doctype html><title>not found</title>',
    'servicios/index.html': '<!doctype html><title>servicios</title>',
    'proyectos/index.html': '<!doctype html><title>proyectos</title>',
    '_next/static/app.js': 'console.log("chunk");',
    'brand/poster.webp': 'webp',
  };
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  writeFileSync(path.join(path.dirname(dir), `${path.basename(dir)}-secret.txt`), 'outside the export');
  return dir;
}

async function withServer(basePath, run) {
  const dir = createExport();
  const server = createExportServer({ root: dir, basePath });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    await run((pathname, init) => fetch(`${origin}${pathname}`, { redirect: 'manual', ...init }), dir);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    rmSync(dir, { recursive: true, force: true });
    rmSync(`${dir}-secret.txt`, { force: true });
  }
}

test('the static export server serves real files under the base path and maps routes to their index', async () => {
  await withServer('/Portfolio', async (get) => {
    const home = await get('/Portfolio/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /<title>home<\/title>/);
    assert.match(home.headers.get('content-type'), /text\/html/);

    const services = await get('/Portfolio/servicios/');
    assert.equal(services.status, 200);
    assert.match(await services.text(), /<title>servicios<\/title>/);

    const chunk = await get('/Portfolio/_next/static/app.js');
    assert.equal(chunk.status, 200);
    assert.match(chunk.headers.get('content-type'), /javascript/);
    assert.equal(await chunk.text(), 'console.log("chunk");');

    assert.match((await get('/Portfolio/brand/poster.webp')).headers.get('content-type'), /image\/webp/);

    const head = await get('/Portfolio/servicios/', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  });
});

test('a missing route is a real 404 with the export 404 page and never falls back to an index', async () => {
  await withServer('/Portfolio', async (get) => {
    for (const missing of [
      '/Portfolio/proyectos/general-reservation-system/',
      '/Portfolio/en/work/the-system/',
      '/Portfolio/nope/',
      '/Portfolio/missing.js',
    ]) {
      const response = await get(missing);
      assert.equal(response.status, 404, missing);
      const body = await response.text();
      assert.match(body, /<title>not found<\/title>/, `${missing} serves the export's 404 page`);
      assert.doesNotMatch(body, /<title>(home|proyectos|servicios)<\/title>/, `${missing} must not be rewritten to an index`);
    }
  });
});

test('paths outside the base path and traversal attempts are 404, and a directory without a slash redirects', async () => {
  await withServer('/Portfolio', async (get, dir) => {
    for (const outside of ['/', '/servicios/', '/Portfoliox/', '/Portfolio/../secret.txt', '/Portfolio/%2e%2e/secret.txt', `/Portfolio/..%2f${path.basename(dir)}-secret.txt`]) {
      const response = await get(outside);
      assert.equal(response.status, 404, outside);
      assert.doesNotMatch(await response.text(), /outside the export/);
    }
    const redirect = await get('/Portfolio/servicios');
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), '/Portfolio/servicios/');
    assert.equal((await get('/Portfolio', {})).status, 301, 'the bare base path redirects to its index');
  });
});

test('only GET and HEAD are served', async () => {
  await withServer('', async (get) => {
    assert.equal((await get('/', { method: 'POST' })).status, 405);
    assert.equal((await get('/', { method: 'DELETE' })).status, 405);
  });
});

test('a root export (no base path) serves from the origin root', async () => {
  await withServer('', async (get) => {
    assert.equal((await get('/')).status, 200);
    assert.equal((await get('/proyectos/')).status, 200);
    assert.equal((await get('/proyectos/the-system/')).status, 404);
    assert.equal((await get('/Portfolio/')).status, 404, 'no base path means no /Portfolio prefix');
  });
});

// --- tests/e2e/support/connected-studio-test-hooks.ts ----------------------------------------

function fakePage() {
  const calls = [];
  return { calls, addInitScript: async (script, argument) => void calls.push({ script, argument }) };
}

test('the test hook is injected only through addInitScript as window.__FURLANICH_CONNECTED_TEST__', async () => {
  const page = fakePage();
  await setConnectedTestHook(page, { allowSoftwareRenderer: true, livePolicy: { wide: true, compact: false } });
  assert.equal(page.calls.length, 1, 'exactly one init script');
  const [{ script, argument }] = page.calls;
  assert.equal(typeof script, 'function');

  const previous = globalThis.window;
  globalThis.window = {};
  try {
    script(argument);
    assert.deepEqual({ ...globalThis.window.__FURLANICH_CONNECTED_TEST__ }, { allowSoftwareRenderer: true, livePolicy: { wide: true, compact: false } });
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});

test('the test hook accepts only its two documented fields with strict values', async () => {
  const page = fakePage();
  await setConnectedTestHook(page, {});
  await setConnectedTestHook(page, { allowSoftwareRenderer: false });
  assert.equal(page.calls.length, 2);

  for (const invalid of [
    { allowSoftwareRenderer: 'yes' },
    { allowSoftwareRenderer: 1 },
    { livePolicy: { wide: true } },
    { livePolicy: { wide: 'true', compact: false } },
    { livePolicy: null },
    { somethingElse: true },
    null,
    'allowSoftwareRenderer',
  ]) {
    await assert.rejects(() => setConnectedTestHook(page, invalid), TypeError, JSON.stringify(invalid));
  }
  assert.equal(page.calls.length, 2, 'a rejected hook installs nothing');
});

// --- playwright.config.ts registration ---------------------------------------------------------

function listProjects(environment) {
  let output;
  try {
    output = execFileSync(process.execPath, [path.join(root, 'node_modules/@playwright/test/cli.js'), 'test', '--list', '--reporter=json'], {
      cwd: root,
      env: { ...process.env, ...environment },
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    // `--list` exits 1 with "No tests found" while a project has no spec file yet; the JSON report is still complete.
    output = error.stdout;
    // Never rethrow the raw error: the JSON report echoes the web server's environment variables.
    if (!output) throw new Error(`playwright --list failed (exit ${error.status}): ${String(error.stderr).slice(0, 300)}`);
  }
  return JSON.parse(output).config.projects;
}

function matchingProjects(projects, specFile) {
  return projects
    .filter((project) => {
      const patterns = Array.isArray(project.testMatch) ? project.testMatch : [project.testMatch];
      // Playwright serializes a RegExp pattern as the string "/source/flags".
      return patterns.some((pattern) => {
        const regex = /^\/(.*)\/([a-z]*)$/.exec(pattern);
        return regex ? new RegExp(regex[1], regex[2]).test(specFile) : specFile.endsWith(pattern);
      });
    })
    .map((project) => project.name)
    .sort();
}

const REGISTRATION = {
  'connected-studio-static.spec.ts': ['chromium-desktop', 'compact-320-chromium', 'firefox-desktop', 'mobile-chromium', 'mobile-webkit', 'tablet-chromium', 'tablet-portrait-chromium', 'webkit-desktop'],
  'connected-studio-services.spec.ts': ['chromium-desktop', 'compact-320-chromium', 'firefox-desktop', 'mobile-chromium', 'tablet-portrait-chromium', 'webkit-desktop'],
  'connected-studio-footer.spec.ts': ['chromium-desktop', 'compact-320-chromium', 'firefox-desktop', 'mobile-chromium', 'webkit-desktop'],
  'connected-studio-navigation.spec.ts': ['chromium-desktop', 'firefox-desktop', 'mobile-chromium', 'webkit-desktop'],
  'connected-studio-responsive.spec.ts': ['compact-320-chromium', 'mobile-chromium', 'mobile-webkit', 'tablet-chromium', 'tablet-portrait-chromium', 'wide-chromium'],
  'connected-studio-runtime.spec.ts': ['immersive-chromium'],
  'connected-studio-accessibility.spec.ts': ['accessibility-chromium'],
  'connected-studio-production.spec.ts': [],
  'visual/connected-studio-footer.visual.spec.ts': ['visual-chromium'],
  'visual/connected-studio-services.visual.spec.ts': ['visual-chromium'],
};

test('every new connected-studio spec is registered under exactly the planned projects', () => {
  const projects = listProjects({ PLAYWRIGHT_SERVE_EXPORT: '' });
  for (const [spec, expected] of Object.entries(REGISTRATION)) {
    assert.deepEqual(matchingProjects(projects, `tests/e2e/${spec}`), expected, spec);
  }
  assert.ok(!projects.some((project) => project.name === 'connected-production-chromium'), 'the production project is absent without PLAYWRIGHT_SERVE_EXPORT=1');
});

test('PLAYWRIGHT_SERVE_EXPORT=1 defines only the connected production project', () => {
  const projects = listProjects({ PLAYWRIGHT_SERVE_EXPORT: '1' });
  assert.deepEqual(projects.map((project) => project.name), ['connected-production-chromium']);
  assert.deepEqual(matchingProjects(projects, 'tests/e2e/connected-studio-production.spec.ts'), ['connected-production-chromium']);
  assert.deepEqual(matchingProjects(projects, 'tests/e2e/connected-studio-static.spec.ts'), [], 'no other spec runs against the export');
});
