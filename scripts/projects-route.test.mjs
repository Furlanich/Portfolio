import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = [
  ['app/(es)/proyectos/page.tsx', 'es', 'Proyectos'],
  ['app/(en)/en/work/page.tsx', 'en', 'Work'],
];

test('defines both localized Projects routes with their own content and shared composition', async () => {
  for (const [path, locale, label] of routes) {
    const source = await readFile(path, 'utf8');
    assert.match(source, /ProjectsPage/);
    assert.match(source, /getPublishedProjectDossiers/);
    assert.match(source, /validateProjectContent/);
    assert.match(source, new RegExp(`locale: '${locale}'`));
    assert.match(source, /routeId: 'projects'/);
    assert.match(source, /<SiteHeader/);
    assert.match(source, /<SiteFooter/);
    assert.match(source, new RegExp(`projects: '${label}'`));
    assert.doesNotMatch(source, /next-intl|legacy|ProjectDetail|ProjectCard|getPublishedProjectCards|generateStaticParams/);
  }
});

test('the Projects page resolves its dossiers once, from the closed publication set', async () => {
  const page = await readFile('components/projects/ProjectsPage.tsx', 'utf8');
  assert.match(page, /dossiers/);
  assert.match(page, /ProjectDossier/);
  assert.match(page, /key={dossier\.slug}/);
  assert.match(page, /href={`#\$\{dossier\.slug\}`}/);
});

// Dated 2026-10-06 (PLAN-SPF-V1 Task 3): the MPC project-detail destination is retired. Founder keeps
// the 2021 educational context and its limitations, and its action is the approved public source.
test('Founder education owns the localized MPC context and the approved external source action', async () => {
  const [spanish, english, history, page, types] = await Promise.all([
    readFile('app/(es)/_content/founder.ts', 'utf8'),
    readFile('app/(en)/en/_content/founder.ts', 'utf8'),
    readFile('components/founder/FounderProfessionalHistory.tsx', 'utf8'),
    readFile('components/founder/FounderPage.tsx', 'utf8'),
    readFile('components/founder/content-types.ts', 'utf8'),
  ]);

  for (const [source, action] of [[spanish, 'Ver código fuente'], [english, 'View source code']]) {
    assert.match(source, /project:/);
    assert.match(source, /sourceHref: 'https:\/\/github\.com\/Furlanich\/MilkyPantsCheese-Administracion-'/);
    assert.ok(source.includes(`actionLabel: '${action}'`), action);
    assert.match(source, /2021/);
    assert.match(source, /fictic|ficticio|fictional/i);
    assert.match(source, /grupo|group/i);
    assert.match(source, /no representa|does not represent/i);
    assert.doesNotMatch(source, /mpc-administracion/);
    assert.doesNotMatch(source, /Ver proyecto educativo|View educational project/);
  }
  assert.match(history, /education\.project/);
  assert.match(history, /data-founder-education-project/);
  assert.match(history, /education\.project\.sourceHref/);
  assert.match(history, /target="_blank"/);
  assert.match(history, /rel="noreferrer"/);
  assert.doesNotMatch(history, /projectHref/);
  assert.doesNotMatch(page, /getProjectDetailPath|projectHref/);
  assert.match(types, /sourceHref/);
  assert.doesNotMatch(types, /slug/);
});
