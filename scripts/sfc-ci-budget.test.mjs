import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// PLAN-SFC-V1 Task 2: the Playwright project partition and the CI shape. Discovery is asked of Playwright
// itself (`--list`), so these tests fail when a spec family is renamed without its project, and they do not
// run a browser. Wall-clock durations are measured from real CI runs and recorded in the Task 2 receipt.

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFileSync(`${root}${file}`, 'utf8');

/** Lists the tests Playwright would run for an environment, as `{ projects, byProject }`. */
function listTests(env = {}, { allowMissingExport = false } = {}) {
  const result = spawnSync('npx', ['playwright', 'test', '--list', '--reporter=json'], {
    cwd: root,
    env: { ...process.env, SFC_TEST_MODE: '', PLAYWRIGHT_SERVE_EXPORT: '', ...env },
    encoding: 'utf8',
    shell: true,
    maxBuffer: 1 << 28,
  });
  // A family with no spec file yet lists nothing and Playwright exits 1 with "No tests found" in the report;
  // any other error is a real configuration failure.
  let json;
  try {
    json = JSON.parse(result.stdout);
  } catch {
    assert.fail(`playwright --list produced no report: ${result.stderr.slice(0, 500)}`);
  }
  // Export mode: the existing production spec reads `out/` when it loads, and no export is built here. The
  // project list is read from the config before any spec loads, so that one missing-directory error is allowed.
  const allowed = allowMissingExport ? /No tests found|ENOENT.*[\\/]out[\\/]/ : /No tests found/;
  const unexpected = (json.errors ?? []).filter((error) => !allowed.test(error.message ?? ''));
  assert.deepEqual(unexpected, [], 'playwright --list reported a configuration error');
  const byProject = new Map();
  const files = new Set();
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests ?? []) {
        const entry = byProject.get(t.projectName) ?? new Set();
        entry.add(suite.file ?? spec.file);
        byProject.set(t.projectName, entry);
        files.add(spec.file);
      }
    }
    for (const child of suite.suites ?? []) walk(child);
  };
  for (const suite of json.suites) walk(suite);
  const total = json.suites.reduce((sum, suite) => {
    const count = (s) => (s.specs ?? []).reduce((n, spec) => n + (spec.tests ?? []).length, 0) + (s.suites ?? []).reduce((n, c) => n + count(c), 0);
    return sum + count(suite);
  }, 0);
  return { projects: json.config.projects.map((project) => project.name), byProject, total, files };
}

const defaultList = listTests();

test('the Studio and Founder families are discovered as separate page-owned spec files', () => {
  const allFiles = [...defaultList.files];
  assert.ok(!allFiles.some((file) => /studio-founder/.test(file)), 'the mixed studio-founder specs are gone');
  for (const file of ['studio.spec.ts', 'founder.spec.ts', 'studio-responsive.spec.ts', 'founder-responsive.spec.ts']) {
    assert.ok(allFiles.some((candidate) => candidate.endsWith(file)), `${file} is discovered`);
  }
  const desktop = [...defaultList.byProject.get('chromium-desktop')].map((file) => file.split('/').pop());
  assert.ok(desktop.includes('studio.spec.ts') && desktop.includes('founder.spec.ts'), 'both run on chromium-desktop');
  for (const project of ['compact-320-chromium', 'tablet-portrait-chromium']) {
    const files = [...defaultList.byProject.get(project)].map((file) => file.split('/').pop());
    assert.ok(files.includes('studio-responsive.spec.ts') && files.includes('founder-responsive.spec.ts'), `${project} runs both responsive counterparts`);
  }
});

test('the default list keeps every existing case and stays inside the planning envelope', () => {
  // 2749 cases in 31 files before the partition (PR #141 baseline); moving cases may not drop any.
  assert.ok(defaultList.total >= 2749, `default list has ${defaultList.total} cases, fewer than the 2749 baseline`);
  assert.ok(defaultList.total <= 3200, `default list has ${defaultList.total} cases, over the 3200 planning envelope`);
});

test('commercial and new-route runtime projects exist only in candidate mode', () => {
  const candidateOnly = ['contact-commercial-chromium', 'contact-commercial-firefox', 'contact-commercial-webkit', 'sfc-runtime-chromium'];
  for (const project of candidateOnly) assert.ok(!defaultList.projects.includes(project), `${project} is absent from the default run`);

  const candidate = listTests({ SFC_TEST_MODE: 'candidate' });
  for (const project of candidateOnly) assert.ok(candidate.projects.includes(project), `${project} exists in candidate mode`);
  assert.ok(candidate.total <= 180, `the candidate list has ${candidate.total} cases, over the 180 planning envelope`);
});

test('production export mode defines the connected and the SFC production projects', () => {
  const exported = listTests({ PLAYWRIGHT_SERVE_EXPORT: '1' }, { allowMissingExport: true });
  for (const project of ['connected-production-chromium', 'sfc-production-chromium', 'sfc-production-firefox', 'sfc-production-webkit']) {
    assert.ok(exported.projects.includes(project), `${project} exists in export mode`);
  }
});

test('the Playwright config selects test families only; it never reads a mode switch for the application', () => {
  const config = read('playwright.config.ts');
  assert.match(config, /SFC_TEST_MODE/);
  assert.doesNotMatch(config, /NEXT_PUBLIC_INQUIRY|INQUIRY_RELEASE|CONNECTED_LIVE_POLICY/, 'application mode is not read by the harness');
});

// --- CI shape ---------------------------------------------------------------------------------------------------

test('CI runs for main and the integration branch, with a manual bootstrap trigger', () => {
  const workflow = read('.github/workflows/ci.yml');
  assert.match(workflow, /pull_request:[\s\S]*?branches:\s*\[main, codex\/sfc-integration\]/);
  assert.match(workflow, /workflow_dispatch:/);
});

test('the browser job runs four shards at two workers with bounded duration and always-uploaded unique artifacts', () => {
  const workflow = read('.github/workflows/ci.yml');
  assert.match(workflow, /shard:\s*\[1, 2, 3, 4\]/);
  assert.match(workflow, /fail-fast:\s*false/);
  assert.match(workflow, /--shard=\$\{\{ matrix\.shard \}\}\/4/);
  assert.match(workflow, /--workers=2/);
  const browser = workflow.slice(workflow.indexOf('  browser:'));
  assert.match(browser, /timeout-minutes:\s*35\b/, 'hard limit 35 minutes per shard');
  assert.match(browser, /if:\s*always\(\)/, 'artifacts upload even when a shard fails');
  assert.match(browser, /name:\s*playwright-report-shard-\$\{\{ matrix\.shard \}\}-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/, 'unique per run, attempt and shard');
  assert.match(browser, /retention-days:\s*7/);
  assert.doesNotMatch(workflow, /continue-on-error/);
});

test('the validate job rejects a QA marker or an unrestored candidate before anything is deployed', () => {
  const workflow = read('.github/workflows/ci.yml');
  const validate = workflow.slice(workflow.indexOf('  validate:'), workflow.indexOf('  browser:'));
  assert.match(validate, /node scripts\/prepare-sfc-candidate\.mjs verify-clean/);
});
