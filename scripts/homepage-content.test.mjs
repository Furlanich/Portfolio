import test from 'node:test';
import assert from 'node:assert/strict';

const { homeContent: spanish } = await import('../app/(es)/_content/home.ts');
const { homeContent: english } = await import('../app/(en)/en/_content/home.ts');

const whatsappHref = 'https://wa.me/5491150117565';

const requiredHeroFields = [
  'locale',
  'routeId',
  'eyebrow',
  'heading',
  'description',
  'primaryAction',
  'secondaryAction',
  'trustLine',
  'availability',
];

function assertAction(action, routeId, label) {
  assert.equal(action.label, label);
  assert.equal(action.routeId, routeId);
  assert.equal('href' in action, false);
}

function assertItems(items, expectedCount) {
  assert.equal(items.length, expectedCount);
  for (const item of items) {
    assert.equal(typeof item.title, 'string');
    assert.ok(item.title.trim().length > 0);
    assert.equal(typeof item.description, 'string');
    assert.ok(item.description.trim().length > 0);
  }
}

function assertHomepageContent(content, expected) {
  for (const field of requiredHeroFields) {
    assert.ok(field in content);
  }

  assert.equal(content.locale, expected.locale);
  assert.equal(content.routeId, 'home');

  assert.equal(content.problems.heading, expected.problems.heading);
  assert.equal(content.problems.introduction, expected.problems.introduction);
  assertItems(content.problems.situations, 4);
  assertAction(content.problems.action, 'services', expected.problems.action);

  assert.equal(content.servicesSection.heading, expected.services.heading);
  assert.equal(content.servicesSection.introduction, expected.services.introduction);
  assertItems(content.servicesSection.services, 3);
  assertAction(content.servicesSection.action, 'services', expected.services.action);
  for (const service of content.servicesSection.services) {
    assert.equal('action' in service, false);
    assert.equal('href' in service, false);
  }

  assert.equal(content.audiences.heading, expected.audiences.heading);
  assertItems(content.audiences.audiences, 4);
  assert.equal(content.audiences.closing, expected.audiences.closing);
  assertAction(content.audiences.action, 'contact', expected.audiences.action);

  assert.equal(content.proof.heading, expected.proof.heading);
  assert.equal(content.proof.introduction, expected.proof.introduction);
  assertItems(content.proof.commitments, 3);
  assertAction(content.proof.action, 'founder', expected.proof.action);
  for (const forbidden of [
    'projects',
    'project',
    'clients',
    'metrics',
    'screenshot',
    'logo',
    'testimonial',
    'maturity',
  ]) {
    assert.equal(forbidden in content.proof, false);
  }

  assert.equal(content.process.heading, expected.process.heading);
  assertItems(content.process.steps, 4);
  assert.equal(content.process.qualityStatement, expected.process.qualityStatement);
  assertAction(content.process.action, 'contact', expected.process.action);

  assert.equal(content.founderSection.heading, expected.founder.heading);
  assert.equal(content.founderSection.biography, expected.founder.biography);
  assertAction(content.founderSection.primaryAction, 'contact', expected.founder.primaryAction);
  assertAction(content.founderSection.secondaryAction, 'founder', expected.founder.secondaryAction);

  assert.equal(content.cta.heading, expected.cta.heading);
  assert.equal(content.cta.description, expected.cta.description);
  assert.equal(content.cta.responseStatement, expected.cta.responseStatement);
  assertAction(content.cta.primaryAction, 'contact', expected.cta.primaryAction);
  assert.equal(content.cta.secondaryAction, {
    label: expected.cta.secondaryAction,
    kind: 'whatsapp',
    href: whatsappHref,
  });

  assert.deepEqual(content.primaryAction, {
    label: expected.primaryAction,
    routeId: 'contact',
  });
  assert.deepEqual(content.secondaryAction, {
    label: expected.secondaryAction,
    routeId: 'services',
  });
}

test('Spanish home content contains the approved complete homepage contract', () => {
  assertHomepageContent(spanish, {
    locale: 'es',
    problems: {
      heading: 'Cuando lo manual empieza a frenar el negocio',
      introduction:
        'Una solución digital tiene sentido cuando reduce trabajo repetitivo, evita errores o permite atender mejor. Estos son algunos de los problemas que FURLANICH puede ayudarte a resolver.',
      action: 'Ver cómo podemos ayudarte',
    },
    services: {
      heading: 'Servicios para necesidades concretas',
      introduction:
        'No imponemos una plataforma genérica. Primero entendemos el proceso y después evaluamos si conviene construir, integrar o modernizar.',
      action: 'Ver todos los servicios',
    },
    audiences: {
      heading: 'Pensado para negocios con operaciones reales',
      closing:
        'Si tu sector no aparece en esta lista, el punto de partida sigue siendo el mismo: entender el proceso, el problema y el resultado que necesitás.',
      action: 'Contanos cómo funciona tu negocio',
    },
    proof: {
      heading: 'Credibilidad sin promesas infladas',
      action: 'Conocer la trayectoria de Samuel',
    },
    process: {
      heading: 'De una necesidad concreta a una solución mantenible',
      qualityStatement:
        'Antes de una puesta en producción, cada entrega pasa por revisión técnica, pruebas funcionales y validación de los recorridos principales. Los controles específicos se definen según el tipo de solución y su nivel de riesgo.',
      action: 'Empezar una consulta',
    },
    founder: {
      heading: 'Responsabilidad técnica directa',
      biography:
        'FURLANICH está liderado por Samuel Furlanich, desarrollador de software full-stack con estudios completos en Ciencias de la Computación en la Universidad de Buenos Aires. Samuel mantiene la responsabilidad técnica directa en cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
      primaryAction: 'Hablemos de tu proyecto',
      secondaryAction: 'Conocer a Samuel',
    },
    cta: {
      heading: '¿Tenés una necesidad concreta o un sistema que necesita atención?',
      description:
        'Contanos brevemente qué querés resolver. Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.',
      responseStatement:
        'Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.',
      primaryAction: 'Contanos sobre tu proyecto',
      secondaryAction: 'Escribir por WhatsApp',
    },
    primaryAction: 'Contanos sobre tu proyecto',
    secondaryAction: 'Ver servicios',
  });
});

test('English home content contains the approved natural adaptation', () => {
  assertHomepageContent(english, {
    locale: 'en',
    problems: {
      heading: 'When manual work starts holding the business back',
      introduction:
        'A digital solution makes sense when it reduces repetitive work, prevents errors, or helps you serve customers better. These are some of the problems FURLANICH can help you solve.',
      action: 'See how we can help',
    },
    services: {
      heading: 'Services for concrete business needs',
      introduction:
        'We do not force a generic platform. First we understand the process, then decide whether building, integrating, or modernizing is the right approach.',
      action: 'View all services',
    },
    audiences: {
      heading: 'Built for businesses with real operations',
      closing:
        'If your sector is not listed, the starting point is still the same: understand the process, the problem, and the outcome you need.',
      action: 'Tell us how your business works',
    },
    proof: {
      heading: 'Credibility without inflated claims',
      action: "View Samuel's background",
    },
    process: {
      heading: 'From a concrete need to a maintainable solution',
      qualityStatement:
        'Before a production release, each delivery goes through technical review, functional testing, and validation of its main user journeys. The exact controls depend on the type of solution and its level of risk.',
      action: 'Start an inquiry',
    },
    founder: {
      heading: 'Direct technical responsibility',
      biography:
        'FURLANICH is led by Samuel Furlanich, a full-stack software developer who completed his Computer Science studies at the University of Buenos Aires. Samuel retains direct technical responsibility for every project and brings in specialist collaborators when the scope requires them.',
      primaryAction: "Let's talk about your project",
      secondaryAction: 'Meet Samuel',
    },
    cta: {
      heading: 'Do you have a concrete need or a system that needs attention?',
      description:
        'Tell us briefly what you need to solve. Samuel will personally review your inquiry to determine whether it makes sense to continue with a conversation.',
      responseStatement:
        'Usual response time is within the same business day. In exceptional cases, it may take up to two business days.',
      primaryAction: 'Tell us about your project',
      secondaryAction: 'Write on WhatsApp',
    },
    primaryAction: 'Tell us about your project',
    secondaryAction: 'View services',
  });
});
