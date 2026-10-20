import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// PLAN-SFC-V1 Task 2: the Playwright project partition and the CI shape. Discovery is asked of Playwright
// itself (`--list`), so these tests fail when a spec family is renamed without its project, and they do not
// run a browser. Wall-clock durations are measured from real CI runs and recorded in the Task 2 receipt.

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFileSync(`${root}${file}`, 'utf8').replace(/\r\n/g, '\n');

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
  const titlesByProject = new Map();
  const files = new Set();
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests ?? []) {
        const entry = byProject.get(t.projectName) ?? new Set();
        entry.add(suite.file ?? spec.file);
        byProject.set(t.projectName, entry);
        titlesByProject.set(t.projectName, [...(titlesByProject.get(t.projectName) ?? []), spec.title]);
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
  return { projects: json.config.projects.map((project) => project.name), byProject, titlesByProject, total, files };
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

test('Firefox and WebKit candidate projects select only @cross-browser cases while Chromium selects all', () => {
  // A throwaway spec in a fixture directory, with one tagged smoke case and one untagged exhaustive case. The
  // zero-case real candidate list cannot detect a missing tag filter, so this fixture does (and is removed).
  const directory = `${root}tests/e2e/__sfc_fixture__`;
  mkdirSync(directory, { recursive: true });
  try {
    writeFileSync(
      `${directory}/contact-commercial.spec.ts`,
      [
        "import { test } from '@playwright/test';",
        "test('fixture smoke journey', { tag: '@cross-browser' }, async () => {});",
        "test('fixture exhaustive permutation', async () => {});",
        '',
      ].join('\n'),
    );
    const listed = listTests({ SFC_TEST_MODE: 'candidate' });
    const titles = (project) => (listed.titlesByProject.get(project) ?? []).filter((title) => title.startsWith('fixture '));
    assert.deepEqual(titles('contact-commercial-chromium').sort(), ['fixture exhaustive permutation', 'fixture smoke journey']);
    for (const project of ['contact-commercial-firefox', 'contact-commercial-webkit']) {
      assert.deepEqual(titles(project), ['fixture smoke journey'], `${project} runs only the tagged smoke case`);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
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
  const browser = workflow.slice(workflow.indexOf('  browser:'), workflow.indexOf('  candidate:'));
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

// --- Candidate job (PLAN-SFC-V1 Task 26) -------------------------------------------------------------------------

/** The text of the `candidate` job: from its key to the end of the file (it is the last job). */
function candidateJob() {
  const workflow = read('.github/workflows/ci.yml');
  const start = workflow.indexOf('\n  candidate:');
  assert.notEqual(start, -1, 'ci.yml defines a candidate job');
  return workflow.slice(start);
}

/** Steps of the candidate job, as `{ name, text }`, split on the list marker at step indent. */
function candidateSteps() {
  const job = candidateJob();
  const stepsAt = job.indexOf('\n    steps:');
  assert.notEqual(stepsAt, -1, 'the candidate job has steps');
  return job
    .slice(stepsAt)
    .split(/\n      - /)
    .slice(1)
    .map((text) => ({ text, name: /name:\s*(.+)/.exec(text)?.[1]?.trim() ?? text.split('\n')[0].trim() }));
}

test('the candidate job runs the candidate families on the pinned Playwright image inside the 30-minute hard limit', () => {
  const job = candidateJob();
  assert.match(job, /timeout-minutes:\s*30\b/, 'hard limit 30 minutes (target 20)');
  const image = /image:\s*(mcr\.microsoft\.com\/playwright:v([\d.]+)-noble)/.exec(job);
  assert.ok(image, 'the candidate job uses the official Playwright image');
  const locked = JSON.parse(read('package.json')).devDependencies['@playwright/test'];
  assert.equal(image[2], locked, 'the image tag equals the locked @playwright/test version');
  assert.match(job, /SFC_TEST_MODE:\s*candidate/, 'candidate mode selects the families');
  assert.match(job, /npx playwright test\b/);
  assert.doesNotMatch(job, /--shard/, 'the candidate list is small enough for one job');
  assert.doesNotMatch(read('.github/workflows/ci.yml'), /continue-on-error/);
});

test('the candidate job applies both patches in its own checkout before the browser run', () => {
  const steps = candidateSteps();
  const apply = steps.findIndex((step) => /prepare-sfc-candidate\.mjs apply --kind=combined/.test(step.text));
  const run = steps.findIndex((step) => /npx playwright test/.test(step.text));
  assert.ok(apply >= 0, 'a step applies the combined (commercial + live-policy) candidate');
  assert.ok(run > apply, 'Playwright runs after the candidate is applied');
  assert.match(steps[apply].text, /--expect-head=\$\{\{ github\.sha \}\}/, 'the candidate is bound to the checked-out head');
  assert.ok(steps.findIndex((step) => /npm ci/.test(step.text)) < apply, 'dependencies are installed before the candidate is applied');
});

test('the candidate job blocks provider traffic at the network layer and checks the block', () => {
  const job = candidateJob();
  const options = /options:([\s\S]*?)\n    env:/.exec(job)?.[1] ?? '';
  assert.match(options, /--add-host formspree\.io:127\.0\.0\.1/, 'formspree.io resolves to loopback in the container');
  assert.match(options, /--add-host www\.formspree\.io:127\.0\.0\.1/);
  const steps = candidateSteps();
  const check = steps.findIndex((step) => /formspree\.io/.test(step.text) && /getent ahosts/.test(step.text));
  const run = steps.findIndex((step) => /npx playwright test/.test(step.text));
  assert.ok(check >= 0 && check < run, 'a step proves the provider host is blocked before the run');
});

test('the candidate job always restores the candidate, after the run, and proves the checkout is clean', () => {
  const steps = candidateSteps();
  const run = steps.findIndex((step) => /npx playwright test/.test(step.text));
  const cleanup = steps.findIndex((step) => /prepare-sfc-candidate\.mjs restore --kind=combined/.test(step.text));
  assert.ok(cleanup > run, 'the restore step comes after the browser run');
  assert.match(steps[cleanup].text, /if:\s*always\(\)/, 'the restore runs even when the run fails');
  assert.match(steps[cleanup].text, /prepare-sfc-candidate\.mjs verify-clean/, 'the cleanup ends by verifying the checkout is clean');
});

test('the candidate job uploads its report and traces always, uniquely named, kept 7 days', () => {
  const steps = candidateSteps();
  const upload = steps.find((step) => /actions\/upload-artifact@v4/.test(step.text));
  assert.ok(upload, 'an upload step exists');
  assert.match(upload.text, /if:\s*always\(\)/);
  assert.match(upload.text, /name:\s*playwright-report-candidate-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/, 'unique per run and attempt');
  assert.match(upload.text, /playwright-report\//);
  assert.match(upload.text, /test-results\//);
  assert.match(upload.text, /retention-days:\s*7/);
});

test('the candidate job is never deployable: read-only token, no secrets, no publish step', () => {
  const workflow = read('.github/workflows/ci.yml');
  assert.match(workflow, /^permissions:\n  contents: read\n/m, 'the workflow token is read-only');
  assert.doesNotMatch(workflow, /secrets\./, 'no secret reaches any job');
  assert.doesNotMatch(workflow, /gh-pages|npm run deploy|pages: write|id-token: write|actions\/deploy-pages|actions\/upload-pages-artifact/);
  const job = candidateJob();
  assert.doesNotMatch(job, /npm run build|next build|upload-pages-artifact/, 'the candidate job builds and publishes nothing');
});

test('the stale runtime-closure patch is gone and nothing in the tree executes it', () => {
  assert.equal(existsSync(`${root}tests/fixtures/sfc/runtime-closure.patch`), false, 'the stale Task 8 fixture is deleted');
  for (const name of ['commercial-release.patch', 'live-policy.patch']) {
    assert.ok(existsSync(`${root}tests/fixtures/sfc/${name}`), `${name} stays: the candidate job applies it`);
  }
});
