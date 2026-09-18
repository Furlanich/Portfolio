import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = [
  ['app/(es)/proyectos/page.tsx', 'es', '/proyectos/', 'Proyectos', 'Ver código fuente'],
  ['app/(en)/en/work/page.tsx', 'en', '/en/work/', 'Work', 'View source'],
];

test('defines both localized Projects routes with their own content and shared composition', async () => {
  for (const [path, locale, route, label, action] of routes) {
    const source = await readFile(path, 'utf8');
    assert.match(source, /ProjectsPage/);
    assert.match(source, /getPublishedProjectCards/);
    assert.match(source, /validateProjectContent/);
    assert.match(source, new RegExp(`locale: '${locale}'`));
    assert.match(source, /routeId: 'projects'/);
    assert.match(source, /<SiteHeader/);
    assert.match(source, /<SiteFooter/);
    assert.match(source, new RegExp(`projects: '${label}'`));
    assert.doesNotMatch(source, /next-intl|legacy|ProjectDetail|generateStaticParams/);
    assert.ok(route.endsWith('/'));
    assert.ok(action.length > 0);
  }
});

test('keeps the Projects components server-renderable and structurally accessible', async () => {
  const page = await readFile('components/projects/ProjectsPage.tsx', 'utf8');
  const card = await readFile('components/projects/ProjectCard.tsx', 'utf8');
  assert.doesNotMatch(page, /^['"]use client['"];?$/m);
  assert.doesNotMatch(card, /^['"]use client['"];?$/m);
  assert.match(page, /<main>/);
  assert.match(page, /<h1/);
  assert.match(page, /grid-cols-1 gap-6 lg:grid-cols-12/);
  assert.match(page, /lg:col-span-7/);
  assert.match(page, /lg:col-span-5/);
  assert.match(page, /hasLimitedPublication/);
  assert.match(card, /<article/);
  assert.match(card, /data-project-presentation/);
  assert.match(card, /<ul/);
  assert.match(card, /target="_blank"/);
  assert.match(card, /rel="noreferrer"/);
  assert.match(card, /min-h-11/);
  assert.match(card, /<Link/);
  assert.match(page, /key={card\.slug}/);
  assert.doesNotMatch(card, /line-clamp|shadow-|h-\[/);
});

test('Founder education owns the localized MPC teaser and existing detail destination', async () => {
  const [spanish, english, history] = await Promise.all([
    readFile('app/(es)/_content/founder.ts', 'utf8'),
    readFile('app/(en)/en/_content/founder.ts', 'utf8'),
    readFile('components/founder/FounderProfessionalHistory.tsx', 'utf8'),
  ]);

  for (const source of [spanish, english]) {
    assert.match(source, /project:/);
    assert.match(source, /mpc-administracion/);
    assert.match(source, /2021/);
    assert.match(source, /fictic|ficticio|fictional/i);
    assert.match(source, /grupo|group/i);
    assert.match(source, /no representa|does not represent/i);
  }
  assert.match(history, /education\.project/);
  assert.match(history, /data-founder-education-project/);
  assert.match(history, /projectHref/);
});
