import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';

// PLAN-SPF-V1 Task 3 (dated 2026-10-06): the six project-detail destinations are retired, and the
// complete stories live in two dossiers on the Projects index. This file used to prove the detail
// routes; it now proves their absence and keeps the protection that mattered (a closed, fail-closed
// publication set, and a server-rendered, accessible evidence boundary), moved to the dossiers.

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else files.push(path);
  }
  return files;
}

const retiredSources = [
  'app/(es)/proyectos/[projectSlug]/page.tsx',
  'app/(en)/en/work/[projectSlug]/page.tsx',
  'components/projects/ProjectDetailPage.tsx',
  'components/projects/ProjectCard.tsx',
];

test('the retired detail route entries and detail-only components are gone', async () => {
  for (const path of retiredSources) {
    await assert.rejects(access(path), { code: 'ENOENT' }, path);
  }
  // The dynamic-route directories must not survive as empty shells either.
  for (const directory of ['app/(es)/proyectos/[projectSlug]', 'app/(en)/en/work/[projectSlug]']) {
    await assert.rejects(access(directory), { code: 'ENOENT' }, directory);
  }
});

test('no active source still names a detail-only symbol or generates a project route', async () => {
  const files = (await Promise.all(['app', 'components', 'lib'].map((directory) => collectFiles(directory))))
    .flat()
    .filter((path) => /\.(mjs|ts|tsx|css)$/.test(path));
  const offenders = [];
  for (const path of files) {
    const source = await readFile(path, 'utf8');
    for (const forbidden of [
      /ProjectDetailPage/, /ProjectDetailLabels/, /getPublishedProjectDetails?\b/, /getProjectDetailPath/,
      /getProjectDetailNavigationPaths/, /ResolvedProjectDetail/, /PublicProjectDetailContent/,
      /projectSlug/, /\bProjectCard\b/, /ProjectMeta/, /data-detail-/, /\bdetails:\s*\{/,
    ]) {
      if (forbidden.test(source)) offenders.push(`${path}: ${forbidden}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('active routes and links never name a retired detail destination', async () => {
  const files = (await Promise.all(['app', 'components', 'lib'].map((directory) => collectFiles(directory))))
    .flat()
    .filter((path) => /\.(mjs|ts|tsx|css)$/.test(path));
  const retired = /(?:proyectos|work)\/(?:general-reservation-system|the-system|mpc-administracion)\//;
  const offenders = [];
  for (const path of files) {
    if (retired.test(await readFile(path, 'utf8'))) offenders.push(path);
  }
  assert.deepEqual(offenders, []);
});

test('the dossier is a server-rendered, accessible evidence boundary with no hidden story', async () => {
  const source = await readFile('components/projects/ProjectDossier.tsx', 'utf8');
  assert.doesNotMatch(source, /^['"]use client['"];?$/m);
  assert.match(source, /<article/);
  assert.match(source, /aria-labelledby/);
  assert.match(source, /<h2/);
  assert.match(source, /<h3/);
  assert.match(source, /<ul/);
  assert.match(source, /from 'next\/image'/);
  assert.match(source, /loading="lazy"/);
  assert.doesNotMatch(source, /priority/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noreferrer"/);
  assert.match(source, /data-connected-reading-mask/);
  assert.doesNotMatch(source, /<details|<summary|aria-expanded/);
  assert.doesNotMatch(source, /carousel|line-clamp|shadow-|Ver proyecto|View project/i);
});

test('the Projects page carries the connected-page contract and no detail action', async () => {
  const source = await readFile('components/projects/ProjectsPage.tsx', 'utf8');
  assert.doesNotMatch(source, /^['"]use client['"];?$/m);
  assert.match(source, /<main/);
  assert.match(source, /data-connected-page/);
  assert.match(source, /<ConnectedStudioGround/);
  assert.match(source, /connected-pause-projects/);
  assert.match(source, /formatCapabilityLegend/);
  assert.match(source, /data-connected-reading-mask/);
  assert.match(source, /<h1/);
  assert.doesNotMatch(source, /Ver proyecto|View project|ProjectCard|details/);
});
