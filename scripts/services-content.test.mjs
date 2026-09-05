import test from 'node:test';
import assert from 'node:assert/strict';

const { servicesPageContent: spanish } = await import('../app/(es)/_content/services.ts');
const { servicesPageContent: english } = await import('../app/(en)/en/_content/services.ts');

const expectedServiceIds = ['web', 'whatsapp', 'consulting'];
const expectedActionLabels = {
  es: [
    'Contanos qué necesitás resolver en la web',
    'Conversemos sobre tu flujo por WhatsApp',
    'Contanos qué pasa con tu sistema',
    'Iniciar una consulta',
  ],
  en: [
    'Tell us what you need to solve on the web',
    'Discuss your WhatsApp workflow',
    'Tell us what is happening with your system',
    'Start an enquiry',
  ],
};

function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

function assertServiceShape(page, locale) {
  assert.equal(page.locale, locale);
  assert.equal(page.routeId, 'services');
  assert.ok(page.introduction);
  assert.ok(page.principles);
  assert.ok(page.commercialBoundaries);
  assert.ok(page.aiNote);
  assert.ok(page.finalCta);
  assert.deepEqual(page.services.map((service) => service.id), expectedServiceIds);
  assert.equal(page.services.length, 3);
  assert.equal(page.principles.items.length, 6);

  for (const service of page.services) {
    for (const field of [
      'id', 'eyebrow', 'heading', 'situation', 'situations', 'outcome', 'levels',
      'examples', 'engagement', 'boundaries', 'dependencies', 'fit', 'nonFit',
      'evidence', 'action',
    ]) {
      assert.ok(service[field], locale + ' ' + service.id + ' is missing ' + field);
    }
    assert.ok(service.situations.length > 0);
    assert.ok(service.examples.length > 0);
    assert.ok(service.engagement.length > 0);
    assert.ok(service.boundaries.length > 0);
    assert.ok(service.dependencies.length > 0);
    assert.ok(service.fit);
    assert.ok(service.nonFit);
    assert.equal(service.action.routeId, 'contact');
    assert.equal(Object.keys(service.action).sort().join(','), 'label,routeId');
  }

  assert.equal(page.services[0].levels.length, 3);
  assert.equal(page.services[1].levels.length, 4);
  assert.equal(page.services[2].levels.length, 0);
  assert.equal(page.finalCta.action.routeId, 'contact');
  assert.equal(Object.keys(page.finalCta.action).sort().join(','), 'label,routeId');
  assert.deepEqual(
    page.services.map((service) => service.action.label).concat(page.finalCta.action.label),
    expectedActionLabels[locale],
  );

  const strings = collectStrings(page);
  assert.ok(strings.every((value) => value.trim().length > 0));
  assert.ok(!page.services.some((service) => service.id === 'ai'));
  assert.equal(strings.filter((value) => value.includes('IA solo cuando aporta valor') || value.includes('AI only where it adds value')).length, 1);
}

test('exports complete Spanish and English Services page contracts', () => {
  assertServiceShape(spanish, 'es');
  assertServiceShape(english, 'en');
});

test('keeps approved headings, index labels, response statements, and AI notes', () => {
  assert.equal(spanish.introduction.heading, 'Servicios para resolver necesidades concretas del negocio');
  assert.equal(english.introduction.heading, 'Services for concrete business needs');
  assert.equal(spanish.introduction.indexLabel, 'Ir a un servicio');
  assert.equal(english.introduction.indexLabel, 'Jump to a service');
  assert.deepEqual(spanish.introduction.indexItems.map((item) => item.label), [
    'Sitios y aplicaciones web', 'WhatsApp e integraciones', 'Mantenimiento y consultoría',
  ]);
  assert.deepEqual(english.introduction.indexItems.map((item) => item.label), [
    'Websites and web applications', 'WhatsApp and integrations', 'Maintenance and consulting',
  ]);
  assert.equal(spanish.aiNote.heading, 'IA solo cuando aporta valor');
  assert.equal(english.aiNote.heading, 'AI only where it adds value');
  assert.match(spanish.finalCta.responseStatement, /mismo día hábil/);
  assert.match(english.finalCta.responseStatement, /same business day/);
});

test('preserves evidence-safe and commercial-boundary decisions', () => {
  for (const page of [spanish, english]) {
    const [web, whatsapp, consulting] = page.services;
    assert.match(web.evidence, /reservas|reservation system/i);
    assert.match(web.evidence, /no se presenta como caso de cliente|not presented as client work/i);
    assert.match(whatsapp.evidence, /no hay un proyecto público|no public WhatsApp automation project/i);
    assert.match(consulting.evidence, /no hay una intervención pública|no public maintenance or consulting intervention/i);
    assert.match(whatsapp.boundaries.join(' '), /Meta|provider/);
    assert.match(whatsapp.dependencies, /Meta|policies/);
    assert.match(consulting.examples.join(' '), /arquitectura|architecture/);
    assert.match(consulting.examples.join(' '), /mantenimiento|maintenance/);
    assert.match(page.aiNote.description, /cuarto servicio|fourth service/);
    assert.match(page.commercialBoundaries.description, /precio|Price/);
  }
});
