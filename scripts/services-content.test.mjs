import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { servicesPageContent: spanish } = await import('../app/(es)/_content/services.ts');
const { servicesPageContent: english } = await import('../app/(en)/en/_content/services.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const servicesDoc = readFileSync(`${root}docs/product/pages/services.md`, 'utf8');
const lines = servicesDoc.split(/\r?\n/);

const expectedServiceIds = ['web', 'whatsapp', 'consulting'];
const locales = { es: spanish, en: english };

// PLAN-SPF-V1 Task 6: the oracle is the owning page record, read at test time, so a content edit that
// drifts from the approved copy fails here instead of passing its own restatement.

/** Data rows of the first markdown table after the line equal to `marker`, as trimmed cell arrays. */
function tableRowsAfter(marker) {
  const start = lines.findIndex((line) => line.trim() === marker);
  assert.notEqual(start, -1, `marker not found: ${marker}`);
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

const copyRows = tableRowsAfter('## SPF-V1 proposed Services copy');
function approved(field, locale) {
  const row = copyRows.find((cells) => cells[0] === field);
  assert.ok(row, `approved SPF-V1 row not found: ${field}`);
  return row[locale === 'es' ? 1 : 2];
}

const boundaryRows = tableRowsAfter('### Essential visible boundaries — accepted compressed copy');
function boundary(name, locale) {
  const row = boundaryRows.find((cells) => cells[0] === name);
  assert.ok(row, `D05 boundary row not found: ${name}`);
  return row[locale === 'es' ? 1 : 2];
}

/** The commercial block and AI note of one locale's "cross-service principles" section. */
function crossServiceBlock(locale) {
  const heading = locale === 'es'
    ? '### Spanish cross-service principles and commercial boundaries'
    : '### English cross-service principles and commercial boundaries';
  const start = lines.findIndex((line) => line.trim() === heading);
  assert.notEqual(start, -1, heading);
  const end = lines.findIndex((line, index) => index > start && line.startsWith('### '));
  const block = lines.slice(start + 1, end);
  const commercialAt = block.findIndex((line) => line.startsWith('**Heading:** `') && /Límites comerciales|Commercial boundaries/.test(line));
  const aiAt = block.findIndex((line) => line.trim() === '**AI note**');
  const quote = (from) => block.slice(from).find((line) => line.startsWith('> ')).slice(2).trim();
  return {
    commercialHeading: block[commercialAt].match(/`([^`]+)`/)[1],
    commercialDescription: quote(commercialAt),
    commercialItems: block.slice(commercialAt, aiAt).filter((line) => line.startsWith('- ')).map((line) => line.slice(2).trim()),
    aiHeading: block[aiAt + 2].match(/`([^`]+)`/)[1],
    aiDescription: quote(aiAt + 2),
  };
}

const aiScopeRows = tableRowsAfter('Retain the existing AI/ERP note and add this explicit scope sentence visibly in shared working boundaries:');

function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

test('exports the Services contract with three service families, stable IDs and no fourth AI service', () => {
  for (const [locale, page] of Object.entries(locales)) {
    assert.equal(page.locale, locale);
    assert.equal(page.routeId, 'services');
    assert.deepEqual(page.services.map((service) => service.id), expectedServiceIds);
    assert.equal(page.services.length, 3);
    assert.ok(!page.services.some((service) => service.id === 'ai'));
    assert.equal(page.principles.items, undefined, 'the six old principle cards stay consolidated');
    assert.equal(page.principles.statements.length, 3);
    assert.equal(page.finalCta.responseStatement, undefined);
    assert.ok(collectStrings(page).every((value) => value.trim().length > 0), `${locale} has no blank strings`);
    for (const service of page.services) {
      for (const field of [
        'id', 'family', 'headline', 'catalogueSummary', 'outcome', 'deliveryHeading', 'delivery',
        'situationsHeading', 'situations', 'startingHeading', 'startingPoint', 'scopeHeading', 'scope',
        'boundariesHeading', 'boundaries', 'evidenceHeading', 'evidence', 'action',
      ]) {
        assert.ok(service[field], `${locale} ${service.id} is missing ${field}`);
      }
      assert.equal(service.action.routeId, 'contact');
      assert.equal(Object.keys(service.action).sort().join(','), 'label,routeId');
      // The superseded D05 scan rows are not carried alongside the approved ones.
      for (const field of ['lead', 'work', 'workHeading', 'fit', 'fitHeading']) assert.equal(service[field], undefined, `${field} is superseded`);
    }
    assert.equal(page.finalCta.action.routeId, 'contact');
    assert.equal(Object.keys(page.finalCta.action).sort().join(','), 'label,routeId');
  }
});

test('the introduction, catalogue, service chapters and principles equal the approved SPF-V1 copy table', () => {
  for (const [locale, page] of Object.entries(locales)) {
    assert.equal(page.introduction.heading, approved('H1', locale));
    assert.equal(page.introduction.description, approved('Introduction', locale));
    assert.equal(page.introduction.catalogueLabel, approved('Service-index action', locale));
    assert.equal(page.introduction.catalogueAction, approved('Catalogue action', locale));
    assert.equal(page.sceneCaption, approved('Scene caption', locale));
    assert.equal(page.principles.heading, approved('Working principles heading', locale));
    assert.deepEqual(page.principles.statements, [1, 2, 3].map((n) => approved(`Working principle ${n}`, locale)));

    page.services.forEach((service, index) => {
      const n = index + 1;
      assert.equal(service.family, approved(`Service ${n}: family`, locale));
      assert.equal(service.headline, approved(`Service ${n}: chapter headline`, locale));
      assert.equal(service.catalogueSummary, approved(`Service ${n}: catalogue summary`, locale));
      assert.equal(service.outcome, approved(`Service ${n}: outcome`, locale));
      assert.equal(service.deliveryHeading, approved('Delivery label', locale));
      assert.equal(service.delivery, approved(`Service ${n}: delivery`, locale));
      assert.equal(service.situations, approved(`Service ${n}: Situaciones habituales`, locale));
      assert.equal(service.startingPoint, approved(`Service ${n}: Punto de partida`, locale));
      assert.equal(service.scope, approved(`Service ${n}: Alcance acordado`, locale));
      assert.equal(service.evidence, approved(`Service ${n}: evidence`, locale));
      assert.equal(service.action.label, approved(`Service ${n}: Contact action`, locale));
    });
  }
});

test('the Spanish row labels equal the approved field names; English labels are the recorded Task 6 rulings', () => {
  for (const service of spanish.services) {
    assert.equal(service.situationsHeading, 'Situaciones habituales');
    assert.equal(service.startingHeading, 'Punto de partida');
    assert.equal(service.scopeHeading, 'Alcance acordado');
  }
  for (const service of english.services) {
    assert.equal(service.situationsHeading, 'Common situations');
    assert.equal(service.startingHeading, 'Starting point');
    assert.equal(service.scopeHeading, 'Agreed scope');
  }
});

test('every D05 compressed service boundary, the shared agreement and the AI/ERP scope stay verbatim', () => {
  for (const [locale, page] of Object.entries(locales)) {
    assert.equal(page.services[0].boundaries, boundary('Web', locale));
    assert.equal(page.services[1].boundaries, boundary('WhatsApp', locale));
    assert.equal(page.services[2].boundaries, boundary('Consulting', locale));
    assert.equal(page.principles.workingAgreement, boundary('Shared working agreement', locale));
    assert.equal(page.aiNote.managementScope, boundary('AI / ERP', locale));
    assert.equal(page.aiNote.scope, aiScopeRows[0][locale === 'es' ? 0 : 1]);
  }
});

test('the complete commercial block and the existing AI/ERP note equal the owning page record', () => {
  for (const [locale, page] of Object.entries(locales)) {
    const block = crossServiceBlock(locale);
    assert.equal(page.commercialBoundaries.heading, block.commercialHeading);
    assert.equal(page.commercialBoundaries.description, block.commercialDescription);
    assert.deepEqual(page.commercialBoundaries.items, block.commercialItems);
    assert.equal(page.commercialBoundaries.items.length, 5);
    assert.equal(page.aiNote.heading, block.aiHeading);
    assert.equal(page.aiNote.description, block.aiDescription);
    // The AI/ERP note still says AI is not a fourth service, once, and the new scope sentence is separate.
    assert.equal(collectStrings(page).filter((value) => /IA no es un cuarto servicio|AI is not a fourth service/.test(value)).length, 1);
  }
});

test('the GRS evidence action reaches the dossier fragment and no other service borrows the proof', () => {
  assert.equal(spanish.services[0].evidenceLink.label, approved('GRS evidence action', 'es'));
  assert.equal(english.services[0].evidenceLink.label, approved('GRS evidence action', 'en'));
  for (const page of [spanish, english]) {
    assert.equal(page.services[0].evidenceLink.slug, 'general-reservation-system');
    assert.equal(page.services[1].evidenceLink, undefined);
    assert.equal(page.services[2].evidenceLink, undefined);
  }
});

test('the working-boundaries link label equals the approved wording and the final call to action is unchanged', () => {
  const approvedLabel = /“Ver condiciones de trabajo” \/ “Read working boundaries”/;
  assert.match(servicesDoc, approvedLabel);
  assert.equal(spanish.workingBoundariesLabel, 'Ver condiciones de trabajo');
  assert.equal(english.workingBoundariesLabel, 'Read working boundaries');
  assert.equal(spanish.finalCta.heading, 'Contanos qué necesitás resolver');
  assert.equal(english.finalCta.heading, 'Tell us what you need to solve');
  assert.equal(spanish.finalCta.description, 'Explorá el contacto y probá la demostración del formulario.');
  assert.equal(english.finalCta.description, 'Explore the contact options and try the form demonstration.');
  assert.equal(spanish.finalCta.action.label, 'Iniciar una consulta');
  assert.equal(english.finalCta.action.label, 'Start an enquiry');
});

test('the copy avoids fixed prices, response promises, support SLAs and invented proof', () => {
  const forbidden = /\bUS?\$\s?\d|€\s?\d|\bgratis\b|\bfree (?:assessment|diagnosis|audit)\b|mismo día hábil|same business day|24\/7|garantizad[oa] en|guaranteed within/i;
  for (const [locale, page] of Object.entries(locales)) {
    for (const value of collectStrings(page)) assert.doesNotMatch(value, forbidden, `${locale}: ${value}`);
  }
  for (const page of [spanish, english]) {
    assert.match(page.services[1].evidence, /No se publica actualmente|No verified case/);
    assert.match(page.services[2].evidence, /No se publica actualmente|No verified case/);
  }
});
