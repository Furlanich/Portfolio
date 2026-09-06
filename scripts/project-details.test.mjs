import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const { publishedProjectManifest, getPublishedProjectDetail, getPublishedProjectDetails, validateProjectContent } =
  await import('../lib/projects/publication.ts');
const { projectPageContent: spanish } = await import('../app/(es)/_content/projects.ts');
const { projectPageContent: english } = await import('../app/(en)/en/_content/projects.ts');

const expectedSlugs = [
  'general-reservation-system',
  'the-system',
  'mpc-administracion',
];

const requiredDetailFields = [
  'headerSummary',
  'evidenceStatement',
  'context',
  'problem',
  'deliveredScope',
  'capabilities',
  'result',
  'evidence',
  'limitations',
  'relatedService',
  'publicationScope',
  'visual',
];

test('projects detail gate resolves exactly three paired detail destinations', () => {
  assert.deepEqual(
    publishedProjectManifest.map((entry) => entry.slug),
    expectedSlugs,
  );
  assert.ok(publishedProjectManifest.every((entry) => entry.destination.kind === 'detail'));
  assert.deepEqual(
    getPublishedProjectDetails(spanish, 'es').map((entry) => entry.slug),
    expectedSlugs,
  );
  assert.deepEqual(
    getPublishedProjectDetails(english, 'en').map((entry) => entry.slug),
    expectedSlugs,
  );
  assert.equal(getPublishedProjectDetail(spanish, 'unknown-project', 'es'), undefined);
  assert.equal(getPublishedProjectDetail(english, 'unknown-project', 'en'), undefined);
});

test('each locale supplies complete bounded detail content for every eligible project', () => {
  validateProjectContent(spanish, 'es');
  validateProjectContent(english, 'en');

  for (const [locale, page] of [['es', spanish], ['en', english]]) {
    for (const slug of expectedSlugs) {
      const id = publishedProjectManifest.find((entry) => entry.slug === slug).id;
      const detail = page.details[id];
      assert.ok(detail, `${locale} ${slug} detail must exist`);
      for (const field of requiredDetailFields) assert.ok(detail[field], `${locale} ${slug} ${field} must exist`);
      assert.equal(detail.evidence.links.length >= 1, true);
      const entry = publishedProjectManifest.find((candidate) => candidate.id === id);
      assert.equal(entry.visual.kind, 'illustration');
      assert.equal(entry.visual.src.endsWith('.webp'), true);
      assert.equal(detail.visual.alt.length > 0, true);
    }
  }
});

test('detail assets exist only at the three approved conceptual paths', async () => {
  const paths = [
    'public/projects/general-reservation-system/conceptual-workflow.webp',
    'public/projects/the-system/conceptual-access-model.webp',
    'public/projects/mpc-administracion/conceptual-operations-model.webp',
  ];
  await Promise.all(paths.map((path) => access(path)));
});

test('paired detail routes are static, closed to unknown params, and locale-owned', async () => {
  const routes = [
    ['app/(es)/proyectos/[projectSlug]/page.tsx', 'es'],
    ['app/(en)/en/work/[projectSlug]/page.tsx', 'en'],
  ];
  for (const [path, locale] of routes) {
    const source = await readFile(path, 'utf8');
    assert.match(source, /generateStaticParams/);
    assert.match(source, /dynamicParams\s*=\s*false/);
    assert.match(source, /ProjectDetailPage/);
    assert.match(source, new RegExp(`locale = '${locale}'`));
    assert.match(source, /getProjectDetailNavigationPaths/);
    assert.doesNotMatch(source, /next-intl|legacy|ProjectCard/);
  }
});

test('detail composition is a server-rendered accessible evidence boundary', async () => {
  const source = await readFile('components/projects/ProjectDetailPage.tsx', 'utf8');
  assert.doesNotMatch(source, /^['"]use client['"];?$/m);
  assert.match(source, /from 'next\/image'/);
  assert.match(source, /<main>/);
  assert.match(source, /<h1/);
  assert.match(source, /<ul/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noreferrer"/);
  assert.match(source, /min-h-11/);
  assert.doesNotMatch(source, /carousel|line-clamp|shadow-|functional-demonstration/i);
});
