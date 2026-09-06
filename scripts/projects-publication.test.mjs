import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { publishedProjectManifest, getPublishedProjectCards, getPublishedProjectDetails, validateProjectContent } =
  await import('../lib/projects/publication.ts');
const { projectPageContent: spanish } = await import('../app/(es)/_content/projects.ts');
const { projectPageContent: english } = await import('../app/(en)/en/_content/projects.ts');

const expectedEntries = [
  ['PROJECT-GRS', 'general-reservation-system', 'prototype', 'https://github.com/Furlanich/GeneralReservationSystem'],
  ['PROJECT-THE-SYSTEM', 'the-system', 'lab', 'https://github.com/Furlanich/The-System'],
  ['PROJECT-MPC-ADMIN', 'mpc-administracion', 'prototype', 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-'],
];

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

function assertPublicCard(card, locale, id) {
  for (const field of ['title', 'context', 'maturityLabel', 'summary', 'evidenceSignal', 'actionLabel']) {
    assert.equal(typeof card[field], 'string', `${locale} ${id} ${field} must be a string`);
    assert.ok(card[field].trim(), `${locale} ${id} ${field} must not be empty`);
  }
  assert.ok(Array.isArray(card.capabilities));
  assert.ok(card.capabilities.length === 2 || card.capabilities.length === 3);
  assert.ok(card.capabilities.every((capability) => typeof capability === 'string' && capability.trim()));
}

function assertPageShell(page, locale) {
  assert.equal(page.locale, locale);
  assert.equal(page.routeId, 'projects');
  assert.ok(page.heading.trim());
  assert.ok(page.introduction.trim());
  assert.deepEqual(Object.keys(page.taxonomy).sort(), ['lab', 'production', 'prototype']);
  assert.equal(page.confidentiality.heading, locale === 'es' ? 'Alcance de publicación' : 'Publication scope');
  assert.ok(page.confidentiality.description.trim());
  assert.equal(page.finalCta.action.routeId, 'contact');
  assert.ok(page.finalCta.action.label.trim());
}

test('publishes exactly the three READY records in approved editorial order', () => {
  assert.equal(publishedProjectManifest.length, expectedEntries.length);
  assertUnique(publishedProjectManifest.map((entry) => entry.id), 'manifest IDs');
  assertUnique(publishedProjectManifest.map((entry) => entry.slug), 'manifest slugs');
  assert.deepEqual(
    publishedProjectManifest.map((entry) => [entry.id, entry.slug, entry.maturity, entry.destination.href]),
    expectedEntries,
  );
  assert.ok(publishedProjectManifest.every((entry) => entry.publicationScope === 'limited'));
  assert.ok(publishedProjectManifest.every((entry) => entry.services.length === 1 && entry.services[0] === 'web'));
  assert.ok(publishedProjectManifest.every((entry) => entry.destination.kind === 'external'));
  assert.ok(publishedProjectManifest.every((entry) => entry.visual === undefined));
});

test('keeps Spanish and English public content maps exactly aligned to the manifest', () => {
  assertPageShell(spanish, 'es');
  assertPageShell(english, 'en');
  validateProjectContent(spanish, 'es');
  validateProjectContent(english, 'en');

  const manifestIds = publishedProjectManifest.map((entry) => entry.id).sort();
  assert.deepEqual(Object.keys(spanish.cards).sort(), manifestIds);
  assert.deepEqual(Object.keys(english.cards).sort(), manifestIds);
  assert.deepEqual(Object.keys(spanish.details), []);
  assert.deepEqual(Object.keys(english.details), []);
  for (const entry of publishedProjectManifest) {
    assertPublicCard(spanish.cards[entry.id], 'es', entry.id);
    assertPublicCard(english.cards[entry.id], 'en', entry.id);
  }
});

test('resolves only manifest cards to explicit external source links and no details', () => {
  const spanishCards = getPublishedProjectCards(spanish, 'es');
  const englishCards = getPublishedProjectCards(english, 'en');
  assert.deepEqual(spanishCards.map((card) => card.id), ['PROJECT-GRS', 'PROJECT-THE-SYSTEM', 'PROJECT-MPC-ADMIN']);
  assert.deepEqual(englishCards.map((card) => card.id), ['PROJECT-GRS', 'PROJECT-THE-SYSTEM', 'PROJECT-MPC-ADMIN']);
  assert.deepEqual(spanishCards.map((card) => card.action.href), expectedEntries.map((entry) => entry[3]));
  assert.deepEqual(englishCards.map((card) => card.action.href), expectedEntries.map((entry) => entry[3]));
  assert.deepEqual(getPublishedProjectDetails(spanish, 'es'), []);
  assert.deepEqual(getPublishedProjectDetails(english, 'en'), []);
});

test('rejects extra localized content outside the publication manifest', () => {
  const extraContent = {
    cards: { synthetic: { title: 'Synthetic record' } },
    details: {},
  };
  assert.throws(() => validateProjectContent(extraContent, 'es'), /outside the publication manifest/);
});

test('keeps internal evidence and permission data out of application project sources', async () => {
  const sourcePaths = [
    'components/projects/content-types.ts',
    'lib/projects/publication.ts',
    'app/(es)/_content/projects.ts',
    'app/(en)/en/_content/projects.ts',
  ];
  const source = (await Promise.all(sourcePaths.map((path) => readFile(path, 'utf8')))).join('\n');
  for (const forbidden of [
    'permissionMatrix', 'grantor', 'permissionDate', 'restrictions', 'homepageEligible',
    'BLOCKED-', 'PRIVATE', 'FOUNDER-ONLY', 'RETIRED', 'data/projects.json', 'lib/data',
    'docs/product/projects',
  ]) {
    assert.equal(source.includes(forbidden), false, `forbidden source text: ${forbidden}`);
  }
});
