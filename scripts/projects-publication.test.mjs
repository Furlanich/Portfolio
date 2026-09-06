import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { publishedProjectManifest, getPublishedProjectCards, getPublishedProjectDetails, validateProjectContent } =
  await import('../lib/projects/publication.ts');
const { projectPageContent: spanish } = await import('../app/(es)/_content/projects.ts');
const { projectPageContent: english } = await import('../app/(en)/en/_content/projects.ts');

const allowedMaturities = new Set(['production', 'lab', 'prototype']);
const allowedServices = new Set(['web', 'whatsapp', 'consulting']);
const allowedScopes = new Set(['open', 'limited']);
const allowedDestinationKinds = new Set(['detail', 'contact', 'service', 'external']);
const allowedVisualKinds = new Set(['screenshot', 'diagram', 'illustration']);

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

function assertPublicCard(card, locale, id) {
  for (const field of ['title', 'context', 'maturityLabel', 'summary', 'evidenceSignal', 'actionLabel']) {
    assert.equal(typeof card[field], 'string', `${locale} ${id} ${field} must be a string`);
    assert.ok(card[field].trim(), `${locale} ${id} ${field} must not be empty`);
  }

  assert.ok(Array.isArray(card.capabilities), `${locale} ${id} capabilities must be an array`);
  assert.ok(card.capabilities.length === 2 || card.capabilities.length === 3);
  assert.ok(card.capabilities.every((capability) => typeof capability === 'string' && capability.trim()));
  if ('visualAlt' in card) {
    assert.equal(typeof card.visualAlt, 'string');
    assert.ok(card.visualAlt.trim());
  }
}

function assertPageShell(page, locale) {
  assert.equal(page.locale, locale);
  assert.equal(page.routeId, 'projects');
  assert.ok(page.heading.trim());
  assert.ok(page.introduction.trim());
  assert.deepEqual(Object.keys(page.taxonomy).sort(), ['lab', 'production', 'prototype']);
  assert.equal(
    page.confidentiality.heading,
    locale === 'es' ? 'Alcance de publicación' : 'Publication scope',
  );
  assert.equal(page.confidentiality.description.length > 0, true);
  assert.equal(page.finalCta.action.routeId, 'contact');
  assert.ok(page.finalCta.action.label.trim());
  assert.deepEqual(Object.keys(page.cards), []);
  assert.deepEqual(Object.keys(page.details), []);
}

test('starts with an empty, unique, fail-closed public manifest', () => {
  assert.deepEqual(publishedProjectManifest, []);
  assertUnique(publishedProjectManifest.map((entry) => entry.id), 'manifest IDs');
  assertUnique(publishedProjectManifest.map((entry) => entry.slug), 'manifest slugs');

  for (const entry of publishedProjectManifest) {
    assert.ok(entry.id.trim());
    assert.ok(entry.slug.trim());
    assert.ok(allowedMaturities.has(entry.maturity));
    assert.ok(entry.services.length > 0);
    assert.ok(entry.services.every((serviceId) => allowedServices.has(serviceId)));
    assert.ok(allowedScopes.has(entry.publicationScope));
    assert.ok(allowedDestinationKinds.has(entry.destination.kind));

    if (entry.destination.kind === 'service') {
      assert.ok(allowedServices.has(entry.destination.serviceId));
    }
    if (entry.destination.kind === 'external') {
      assert.match(entry.destination.href, /^https:\/\//);
    }
    if (entry.visual) {
      assert.ok(allowedVisualKinds.has(entry.visual.kind));
      assert.ok(entry.visual.src.trim());
      assert.ok(Number.isInteger(entry.visual.width) && entry.visual.width > 0);
      assert.ok(Number.isInteger(entry.visual.height) && entry.visual.height > 0);
    }
  }
});

test('keeps Spanish and English public content maps exactly aligned to the manifest', () => {
  assertPageShell(spanish, 'es');
  assertPageShell(english, 'en');
  validateProjectContent(spanish, 'es');
  validateProjectContent(english, 'en');

  const manifestIds = publishedProjectManifest.map((entry) => entry.id).sort();
  assert.deepEqual(Object.keys(spanish.cards).sort(), manifestIds);
  assert.deepEqual(Object.keys(english.cards).sort(), manifestIds);
  assert.deepEqual(Object.keys(spanish.details).sort(), manifestIds.filter((id) =>
    publishedProjectManifest.find((entry) => entry.id === id)?.destination.kind === 'detail'));
  assert.deepEqual(Object.keys(english.details).sort(), Object.keys(spanish.details).sort());

  for (const entry of publishedProjectManifest) {
    assertPublicCard(spanish.cards[entry.id], 'es', entry.id);
    assertPublicCard(english.cards[entry.id], 'en', entry.id);
    if (entry.visual) {
      assert.ok(spanish.cards[entry.id].visualAlt);
      assert.ok(english.cards[entry.id].visualAlt);
    }
  }
});

test('rejects extra localized content and never resolves an unlisted record', () => {
  const extraContent = {
    cards: {
      synthetic: {
        title: 'Synthetic record',
        context: 'Unlisted context',
        maturityLabel: 'Unlisted maturity',
        summary: 'This record must never become public.',
        capabilities: ['One', 'Two'],
        evidenceSignal: 'No evidence',
        actionLabel: 'Do not publish',
      },
    },
    details: {},
  };

  assert.deepEqual(getPublishedProjectCards(extraContent, 'es'), []);
  assert.deepEqual(getPublishedProjectDetails(extraContent, 'es'), []);
  assert.throws(() => validateProjectContent(extraContent, 'es'), /outside the publication manifest/);
});

test('resolves only approved destination shapes and detail destinations', () => {
  const entryBase = {
    id: 'synthetic',
    slug: 'synthetic',
    maturity: 'lab',
    services: ['web'],
    publicationScope: 'open',
  };
  const content = {
    cards: {
      synthetic: {
        title: 'Synthetic record',
        context: 'Unlisted context',
        maturityLabel: 'Laboratorio FURLANICH',
        summary: 'This record is used only to exercise the contract.',
        capabilities: ['One', 'Two'],
        evidenceSignal: 'Authorized description',
        actionLabel: 'View project',
      },
    },
    details: {},
  };

  assert.deepEqual(getPublishedProjectCards(content, 'es'), []);
  assert.equal(entryBase.id, 'synthetic');
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
    'permissionMatrix',
    'grantor',
    'permissionDate',
    'restrictions',
    'homepageEligible',
    'BLOCKED-',
    'PRIVATE',
    'FOUNDER-ONLY',
    'RETIRED',
    'data/projects.json',
    'lib/data',
    'docs/product/projects',
  ]) {
    assert.equal(source.includes(forbidden), false, `forbidden source text: ${forbidden}`);
  }
});
