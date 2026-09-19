import test from 'node:test';
import assert from 'node:assert/strict';

const { servicesPageContent: spanish } = await import('../app/(es)/_content/services.ts');
const { servicesPageContent: english } = await import('../app/(en)/en/_content/services.ts');

const expectedServiceIds = ['web', 'whatsapp', 'consulting'];
const expectedActionLabels = {
  es: ['Ver contacto', 'Ver contacto', 'Ver contacto', 'Iniciar una consulta'],
  en: ['Contact options', 'Contact options', 'Contact options', 'Start an enquiry'],
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
  assert.equal(page.principles.items, undefined);

  for (const service of page.services) {
    for (const field of [
      'id', 'heading', 'lead', 'workHeading', 'work', 'startingHeading',
      'startingPoint', 'fitHeading', 'fit', 'boundariesHeading', 'boundaries',
      'evidenceHeading', 'evidence', 'action',
    ]) {
      assert.ok(service[field], `${locale} ${service.id} is missing ${field}`);
    }
    assert.ok(service.work.length > 0);
    assert.equal(typeof service.boundaries, 'string');
    assert.equal(service.action.routeId, 'contact');
    assert.equal(Object.keys(service.action).sort().join(','), 'label,routeId');
    for (const field of ['situations', 'outcome', 'levels', 'examples', 'engagement', 'dependencies', 'nonFit']) {
      assert.equal(service[field], undefined);
    }
  }

  assert.equal(page.services[0].work.length, 3);
  assert.equal(page.services[1].work.length, 4);
  assert.equal(page.services[2].work.length, 3);
  assert.equal(page.finalCta.action.routeId, 'contact');
  assert.equal(Object.keys(page.finalCta.action).sort().join(','), 'label,routeId');
  assert.deepEqual(
    page.services.map((service) => service.action.label).concat(page.finalCta.action.label),
    expectedActionLabels[locale],
  );
  assert.equal(page.finalCta.responseStatement, undefined);

  const strings = collectStrings(page);
  assert.ok(strings.every((value) => value.trim().length > 0));
  assert.ok(!page.services.some((service) => service.id === 'ai'));
  assert.equal(strings.filter((value) => value.includes('IA no es un cuarto servicio') || value.includes('AI is not a fourth service')).length, 1);
}

test('exports the approved Spanish and English Services buyer-evaluation contracts', () => {
  assertServiceShape(spanish, 'es');
  assertServiceShape(english, 'en');
});

test('keeps the D05 replacement copy, anchors, and commercial CTA limits', () => {
  assert.equal(spanish.introduction.heading, 'Software para tu negocio');
  assert.equal(english.introduction.heading, 'Software for your business');
  assert.equal(spanish.introduction.description, 'Sitios web, automatización e integraciones, y mejoras para sistemas existentes. No hace falta tener una solución definida para entender las opciones.');
  assert.equal(english.introduction.description, 'Websites, automation and integrations, and improvements to existing systems. You do not need a solution worked out to explore the options.');
  assert.equal(spanish.introduction.qualification, undefined);
  assert.equal(english.introduction.qualification, undefined);
  assert.equal(spanish.introduction.indexLabel, 'Ir a un servicio');
  assert.equal(english.introduction.indexLabel, 'Jump to a service');
  assert.deepEqual(spanish.introduction.indexItems.map((item) => item.label), [
    'Sitios y aplicaciones web', 'WhatsApp e integraciones', 'Mantenimiento y consultoría',
  ]);
  assert.deepEqual(english.introduction.indexItems.map((item) => item.label), [
    'Websites and web applications', 'WhatsApp and integrations', 'Maintenance and consulting',
  ]);
  assert.equal(spanish.services[0].heading, 'Sitios y aplicaciones web');
  assert.equal(english.services[0].heading, 'Websites and web applications');
  assert.equal(spanish.services[1].heading, 'WhatsApp e integraciones');
  assert.equal(english.services[1].heading, 'WhatsApp and integrations');
  assert.equal(spanish.services[2].heading, 'Mejoras para sistemas existentes');
  assert.equal(english.services[2].heading, 'Improvements to existing systems');
  assert.equal(spanish.finalCta.description, 'Explorá el contacto y probá la demostración del formulario.');
  assert.equal(english.finalCta.description, 'Explore the contact options and try the form demonstration.');
  assert.equal(spanish.aiNote.heading, 'IA solo cuando aporta valor');
  assert.equal(english.aiNote.heading, 'AI only where it adds value');
  assert.equal(spanish.principles.workingAgreement, 'Antes de avanzar se acuerdan alcance, entregables, responsabilidades, validaciones y entrega. Samuel mantiene la responsabilidad técnica, con implementación mantenible y documentación proporcional. El trabajo depende de la participación del negocio y de los accesos necesarios. Costos externos, propiedad, licencias y continuidad se definen en el acuerdo correspondiente.');
  assert.equal(english.principles.workingAgreement, 'Scope, deliverables, responsibilities, validation and handover are agreed before proceeding. Samuel retains technical responsibility, with maintainable implementation and proportionate documentation. Work depends on business participation and the necessary access. External costs, ownership, licenses and ongoing support are defined in the relevant agreement.');
  for (const page of [spanish, english]) {
    assert.match(page.services[0].evidence, /General Reservation System|reservas de transporte/);
    assert.match(page.services[0].evidence, /no se presenta como trabajo de cliente|not presented as client work/);
    assert.match(page.services[1].evidence, /No hay un proyecto público de WhatsApp|Todavía no hay un proyecto público de WhatsApp|There is no public WhatsApp project/i);
    assert.match(page.services[2].evidence, /no hay una intervención pública autorizada|There is no authorized public intervention/i);
    assert.match(page.services[1].boundaries, /Meta|WhatsApp\/Meta/);
    assert.match(page.services[2].boundaries, /accesos autorizados|Authorized access/);
    assert.match(page.commercialBoundaries.description, /precio|Price/);
    assert.equal(page.commercialBoundaries.items.length, 5);
    assert.match(page.aiNote.description, /cuarto servicio|fourth service/);
    assert.ok(page.services[0].evidenceLink);
  }
});
