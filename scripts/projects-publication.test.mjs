import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';

const {
  publishedProjectManifest,
  getPublishedProjectDossiers,
  validateProjectContent,
  validateProjectManifest,
} = await import('../lib/projects/publication.ts');
const { projectPageContent: spanish } = await import('../app/(es)/_content/projects.ts');
const { projectPageContent: english } = await import('../app/(en)/en/_content/projects.ts');

// PLAN-SPF-V1 Task 3: the Projects index publishes exactly two complete dossiers. The owning table in
// docs/product/pages/projects.md is the oracle for every approved string (the same approach as
// scripts/connected-studio-content.test.mjs), so the copy cannot drift from its approved source.

const approvedEntries = [
  ['PROJECT-GRS', 'general-reservation-system', 'prototype', 'https://github.com/Furlanich/GeneralReservationSystem', '/projects/general-reservation-system/conceptual-workflow.webp'],
  ['PROJECT-THE-SYSTEM', 'the-system', 'lab', 'https://github.com/Furlanich/The-System', '/projects/the-system/conceptual-access-model.webp'],
];

function tableRows(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  assert.notEqual(start, -1, `heading not found: ${heading}`);
  const rows = [];
  let inTable = false;
  for (const line of lines.slice(start + 1)) {
    if (line.trim().startsWith('|')) {
      inTable = true;
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
      if (!cells.every((cell) => /^-+$/.test(cell))) rows.push(cells);
    } else if (inTable) {
      break;
    }
  }
  return rows.slice(1);
}

const approvedRows = tableRows(
  await readFile('docs/product/pages/projects.md', 'utf8'),
  '## SPF-V1 proposed Projects copy and inline presentation',
);

function approved(field, locale) {
  const row = approvedRows.find((cells) => cells[0] === field);
  assert.ok(row, `approved row not found: ${field}`);
  return row[locale === 'es' ? 1 : 2];
}

function approvedDossier(prefix, locale) {
  return {
    jumpLabel: approved(`${prefix}: jump link`, locale),
    title: approved(`${prefix}: public title`, locale),
    maturityLabel: approved(`${prefix}: maturity`, locale),
    summary: approved(`${prefix}: summary`, locale),
    relationship: approved(`${prefix}: relationship`, locale),
    visual: { caption: approved(`${prefix}: image caption`, locale), alt: approved(`${prefix}: image alt`, locale) },
    opportunity: { heading: approved(`${prefix}: section 1 heading`, locale), content: approved(`${prefix}: section 1 content`, locale) },
    scope: { heading: approved(`${prefix}: section 2 heading`, locale), items: approved(`${prefix}: section 2 content`, locale).split('; ') },
    evidence: { heading: approved(`${prefix}: section 3 heading`, locale), content: approved(`${prefix}: section 3 content`, locale) },
    limits: { heading: approved(`${prefix}: section 4 heading`, locale), content: approved(`${prefix}: section 4 content`, locale) },
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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

test('publishes exactly the two approved dossiers in editorial order, with their evidence boundaries', () => {
  assert.deepEqual(
    publishedProjectManifest.map((entry) => [entry.id, entry.slug, entry.maturity, entry.sourceHref, entry.visual.src]),
    approvedEntries,
  );
  assert.ok(publishedProjectManifest.every((entry) => entry.publicationScope === 'limited'));
  assert.ok(publishedProjectManifest.every((entry) => entry.services.length === 1 && entry.services[0] === 'web'));
  assert.ok(publishedProjectManifest.every((entry) => entry.visual.kind === 'illustration' && entry.visual.width === 1599 && entry.visual.height === 900));
  assert.doesNotThrow(() => validateProjectManifest(publishedProjectManifest));
});

// Dated negative (2026-10-06): MPC leaves the commercial Projects projection. Its evidence record
// (docs/product/project-evidence.md) and its Founder context are unchanged.
test('keeps MPC out of the commercial Projects projection in both locales', () => {
  assert.equal(publishedProjectManifest.some((entry) => /mpc/i.test(`${entry.id} ${entry.slug}`)), false);
  for (const page of [spanish, english]) {
    assert.equal(Object.keys(page.dossiers).some((id) => /MPC/i.test(id)), false);
    assert.doesNotMatch(JSON.stringify(page), /MPC|MilkyPants|mpc-administracion/);
  }
});

for (const [locale, page] of [['es', spanish], ['en', english]]) {
  test(`${locale} page copy equals the approved SPF-V1 table`, () => {
    assert.equal(page.locale, locale);
    assert.equal(page.routeId, 'projects');
    assert.equal(page.heading, approved('H1', locale));
    assert.equal(page.introduction, approved('Introduction', locale));
    assert.equal(page.sourceAction, approved('Source action', locale));
    assert.equal(page.relatedServiceAction, approved('Related service action', locale));
    assert.deepEqual(page.founderAction, { label: approved('Founder context action', locale), routeId: 'founder' });
    assert.deepEqual(page.disclosure, { heading: approved('Disclosure heading', locale), description: approved('Disclosure copy', locale) });
    assert.equal(page.sceneCaption, approved('Scene caption', locale));
    assert.deepEqual(Object.keys(page.dossiers), ['PROJECT-GRS', 'PROJECT-THE-SYSTEM']);
    assert.deepEqual(page.dossiers['PROJECT-GRS'], approvedDossier('GRS', locale));
    assert.deepEqual(page.dossiers['PROJECT-THE-SYSTEM'], approvedDossier('The-System', locale));
  });

  test(`${locale} page content passes the fail-closed validation`, () => {
    assert.doesNotThrow(() => validateProjectContent(page, locale));
  });

  test(`${locale} resolves each dossier with its source, related service, Founder context and image`, () => {
    const dossiers = getPublishedProjectDossiers(page, locale);
    assert.deepEqual(dossiers.map((dossier) => dossier.id), ['PROJECT-GRS', 'PROJECT-THE-SYSTEM']);
    assert.deepEqual(dossiers.map((dossier) => dossier.slug), ['general-reservation-system', 'the-system']);
    assert.deepEqual(dossiers.map((dossier) => dossier.sourceHref), approvedEntries.map((entry) => entry[3]));
    assert.deepEqual(dossiers.map((dossier) => dossier.maturity), ['prototype', 'lab']);
    assert.ok(dossiers.every((dossier) => dossier.publicationPermission === 'limited'));
    assert.ok(dossiers.every((dossier) => dossier.relatedServiceHref === (locale === 'es' ? '/servicios/#web' : '/en/services/#web')));
    assert.ok(dossiers.every((dossier) => dossier.founderHref === (locale === 'es' ? '/estudio/samuel-furlanich/' : '/en/about/samuel-furlanich/')));
    for (const [index, dossier] of dossiers.entries()) {
      assert.deepEqual(dossier.visual, {
        kind: 'illustration',
        src: approvedEntries[index][4],
        width: 1599,
        height: 900,
        caption: approvedDossier(index === 0 ? 'GRS' : 'The-System', locale).visual.caption,
        alt: approvedDossier(index === 0 ? 'GRS' : 'The-System', locale).visual.alt,
      });
      assert.equal(dossier.title, approvedDossier(index === 0 ? 'GRS' : 'The-System', locale).title);
    }
  });
}

test('rejects content that is missing, extra, blank or outside the approved pair', () => {
  const mutate = (change) => {
    const page = clone(spanish);
    change(page);
    return page;
  };
  const cases = {
    'a missing dossier': (page) => { delete page.dossiers['PROJECT-THE-SYSTEM']; },
    'an extra synthetic dossier': (page) => { page.dossiers['PROJECT-SYNTHETIC'] = clone(page.dossiers['PROJECT-GRS']); },
    'the retired MPC record': (page) => { page.dossiers['PROJECT-MPC-ADMIN'] = clone(page.dossiers['PROJECT-GRS']); },
    'a blank relationship': (page) => { page.dossiers['PROJECT-GRS'].relationship = '  '; },
    'a blank title': (page) => { page.dossiers['PROJECT-THE-SYSTEM'].title = ''; },
    'a blank maturity label': (page) => { page.dossiers['PROJECT-GRS'].maturityLabel = ''; },
    'a missing image caption': (page) => { page.dossiers['PROJECT-GRS'].visual.caption = ''; },
    'a missing image alt': (page) => { page.dossiers['PROJECT-THE-SYSTEM'].visual.alt = ' '; },
    'an empty scope list': (page) => { page.dossiers['PROJECT-GRS'].scope.items = []; },
    'a blank scope item': (page) => { page.dossiers['PROJECT-GRS'].scope.items = ['Acceso', '']; },
    'blank limits': (page) => { page.dossiers['PROJECT-THE-SYSTEM'].limits.content = ''; },
    'blank evidence': (page) => { page.dossiers['PROJECT-THE-SYSTEM'].evidence.content = ''; },
    'a blank source action': (page) => { page.sourceAction = ''; },
    'a blank disclosure': (page) => { page.disclosure.description = ''; },
    'a Founder action to another route': (page) => { page.founderAction.routeId = 'contact'; },
  };
  for (const [name, change] of Object.entries(cases)) {
    assert.throws(() => validateProjectContent(mutate(change), 'es'), Error, name);
    assert.throws(() => getPublishedProjectDossiers(mutate(change), 'es'), Error, name);
  }
});

test('rejects a manifest outside the approved IDs, maturity, permission, image and source', () => {
  const entries = () => clone(publishedProjectManifest);
  const cases = {
    'a third record': (list) => [...list, { ...clone(list[0]), id: 'PROJECT-MPC-ADMIN', slug: 'mpc-administracion' }],
    'a missing record': (list) => list.slice(0, 1),
    'a swapped order': (list) => [list[1], list[0]],
    'a production maturity': (list) => { list[0].maturity = 'production'; return list; },
    'an open publication scope': (list) => { list[0].publicationScope = 'open'; return list; },
    'a different image': (list) => { list[1].visual.src = '/projects/the-system/other.webp'; return list; },
    'a screenshot kind': (list) => { list[1].visual.kind = 'screenshot'; return list; },
    'a resized image': (list) => { list[0].visual.width = 800; return list; },
    'a non-https source': (list) => { list[0].sourceHref = 'http://github.com/Furlanich/GeneralReservationSystem'; return list; },
    'an unapproved source': (list) => { list[1].sourceHref = 'https://example.com/The-System'; return list; },
    'an unknown slug': (list) => { list[0].slug = 'mpc-administracion'; return list; },
  };
  for (const [name, change] of Object.entries(cases)) {
    assert.throws(() => validateProjectManifest(change(entries())), Error, name);
  }
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

test('removes obsolete project sources and assets after consumer verification', async () => {
  const legacyPaths = [
    'data/projects.json',
    'components/core/Card.tsx',
    'public/projects/Busesfy.svg',
    'public/projects/MPC-Administracion.svg',
    'public/projects/AI-Scheduler.svg',
    'public/projects/GRS.svg',
    'public/projects/Documancer.svg',
    'public/projects/atlas.svg',
    'public/projects/pulse.svg',
    'public/projects/vertex.svg',
    // Dated 2026-10-06 (PLAN-SPF-V1 Task 3): MPC's unused detail-only concept is retired too.
    'public/projects/mpc-administracion/conceptual-operations-model.webp',
  ];

  for (const path of legacyPaths) {
    await assert.rejects(access(path), { code: 'ENOENT' }, path);
  }

  assert.deepEqual(
    (await collectFiles('public/projects')).sort(),
    [
      'public/projects/general-reservation-system/conceptual-workflow.webp',
      'public/projects/the-system/conceptual-access-model.webp',
    ],
  );
});

test('removes legacy project imports and types from active application sources', async () => {
  const sourceFiles = (await Promise.all(['app', 'components', 'lib'].map((directory) => collectFiles(directory))))
    .flat()
    .filter((path) => /\.(mjs|ts|tsx)$/.test(path));
  const source = (await Promise.all(sourceFiles.map((path) => readFile(path, 'utf8')))).join('\n');

  for (const forbidden of [
    'data/projects.json',
    'projectsData',
    'components/core/Card',
    'Busesfy.svg',
    'MPC-Administracion.svg',
    'AI-Scheduler.svg',
    'GRS.svg',
    'Documancer.svg',
    'atlas.svg',
    'pulse.svg',
    'vertex.svg',
  ]) {
    assert.equal(source.includes(forbidden), false, `legacy application source: ${forbidden}`);
  }
  assert.doesNotMatch(source, /interface Project\s*{/);
});
