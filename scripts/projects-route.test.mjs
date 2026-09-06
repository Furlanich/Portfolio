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
  assert.match(page, /grid-cols-1 gap-6 lg:grid-cols-2/);
  assert.match(page, /hasLimitedPublication/);
  assert.match(card, /<article/);
  assert.match(card, /<ul/);
  assert.match(card, /target="_blank"/);
  assert.match(card, /rel="noreferrer"/);
  assert.match(card, /min-h-11/);
  assert.match(card, /<Link/);
  assert.match(page, /key={card\.slug}/);
  assert.doesNotMatch(card, /line-clamp|shadow-|h-\[/);
});
