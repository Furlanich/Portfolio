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

function assertSituationRows(rows, expected) {
  assert.deepEqual(rows, expected);
}

function assertHomepageContent(content, expected) {
  for (const field of requiredHeroFields) {
    assert.ok(field in content);
  }

  assert.equal(content.locale, expected.locale);
  assert.equal(content.routeId, 'home');

  assert.equal(content.problems.heading, expected.problems.heading);
  assert.equal(content.problems.introduction, expected.problems.introduction);
  assert.equal(content.problems.audienceStatement, expected.problems.audienceStatement);
  assertSituationRows(content.problems.situations, expected.problems.situations);
  assertAction(content.problems.action, 'services', expected.problems.action);

  assert.equal(content.servicesSection.heading, expected.services.heading);
  assert.equal(content.servicesSection.introduction, expected.services.introduction);
  assertItems(content.servicesSection.services, 3);
  assertAction(content.servicesSection.action, 'services', expected.services.action);
  for (const service of content.servicesSection.services) {
    assert.equal('action' in service, false);
    assert.equal('href' in service, false);
  }

  assert.equal(content.proof.heading, expected.proof.heading);
  assert.equal(content.proof.introduction, expected.proof.introduction);
  assertAction(content.proof.action, 'projects', expected.proof.action);
  assert.equal('commitments' in content.proof, false);
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
  assert.deepEqual(content.process.steps, expected.process.steps);
  assert.equal(content.process.qualityStatement, expected.process.qualityStatement);
  assertAction(content.process.action, 'contact', expected.process.action);

  assert.equal(content.founderSection.heading, expected.founder.heading);
  assert.equal(content.founderSection.biography, expected.founder.biography);
  assertAction(content.founderSection.action, 'founder', expected.founder.action);
  assert.equal('primaryAction' in content.founderSection, false);
  assert.equal('secondaryAction' in content.founderSection, false);

  assert.equal(content.cta.heading, expected.cta.heading);
  assert.equal(content.cta.description, expected.cta.description);
  assert.equal(content.cta.demoStatement, expected.cta.demoStatement);
  assertAction(content.cta.primaryAction, 'contact', expected.cta.primaryAction);
  assert.deepEqual(content.cta.secondaryAction, {
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
      heading: 'Cuando el trabajo queda repartido entre herramientas',
      introduction: 'Cuando el trabajo queda repartido entre herramientas',
      audienceStatement:
        'Para pymes que coordinan pedidos, reservas o atención al cliente, o necesitan mejorar un sistema existente.',
      situations: [
        'Pedidos y reservas que se reorganizan a mano.',
        'Consultas repetidas que interrumpen el trabajo.',
        'Sistemas que no comparten información o necesitan mejoras.',
      ],
      action: 'Ver cómo podemos ayudarte',
    },
    services: {
      heading: 'Servicios para necesidades concretas',
      introduction: 'Construir, conectar o mejorar, según el problema.',
      action: 'Ver todos los servicios',
    },
    proof: {
      heading: 'Una responsabilidad técnica clara',
      introduction:
        'Samuel participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. El alcance y las validaciones se acuerdan según cada necesidad.',
      action: 'Ver proyectos y sus límites',
    },
    process: {
      heading: 'Cómo trabajamos',
      steps: [
        { title: 'Entender', description: 'Revisar el proceso y el problema.' },
        { title: 'Definir', description: 'Acordar alcance, responsabilidades y entregables.' },
        { title: 'Construir y revisar', description: 'Comprobar los recorridos importantes.' },
        { title: 'Entregar', description: 'Documentar el uso y acordar los pasos siguientes.' },
      ],
      qualityStatement:
        'Antes de una puesta en producción, cada entrega pasa por revisión técnica, pruebas funcionales y validación de los recorridos principales. Los controles específicos se definen según el tipo de solución y su nivel de riesgo.',
      action: 'Empezar una consulta',
    },
    founder: {
      heading: 'Responsabilidad técnica directa',
      biography: 'Samuel Furlanich dirige FURLANICH. Conocé su experiencia y formación.',
      action: 'Conocer a Samuel',
    },
    cta: {
      heading: '¿Tenés una necesidad concreta o un sistema que necesita atención?',
      description:
        'Contanos brevemente qué querés resolver. Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.',
      demoStatement: 'Explorá las opciones de contacto y probá el formulario de demostración. No se envían consultas desde el formulario.',
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
      heading: 'When work is spread across tools',
      introduction: 'When work is spread across tools',
      audienceStatement:
        'For small and medium-sized businesses managing orders, bookings or customer service, or improving an existing system.',
      situations: [
        'Orders and bookings reorganized by hand.',
        'Repeated questions that interrupt work.',
        'Systems that do not share information or need improvement.',
      ],
      action: 'See how we can help',
    },
    services: {
      heading: 'Services for concrete business needs',
      introduction: 'Build, connect or improve, depending on the problem.',
      action: 'View all services',
    },
    proof: {
      heading: 'Clear technical accountability',
      introduction:
        'Samuel is involved in defining the problem, technical decisions and review of the work. Scope and validation are agreed around each need.',
      action: 'Explore projects and their limitations',
    },
    process: {
      heading: 'How we work',
      steps: [
        { title: 'Understand', description: 'Review the process and the problem.' },
        { title: 'Define', description: 'Agree scope, responsibilities and deliverables.' },
        { title: 'Build and review', description: 'Check important user journeys.' },
        { title: 'Hand over', description: 'Document use and agree next steps.' },
      ],
      qualityStatement:
        'Before a production release, each delivery goes through technical review, functional testing, and validation of its main user journeys. The exact controls depend on the type of solution and its level of risk.',
      action: 'Start an inquiry',
    },
    founder: {
      heading: 'Direct technical responsibility',
      biography: "Samuel Furlanich leads FURLANICH. Explore his experience and background.",
      action: 'Meet Samuel',
    },
    cta: {
      heading: 'Do you have a concrete need or a system that needs attention?',
      description:
        'Tell us briefly what you need to solve. Samuel will personally review your inquiry to determine whether it makes sense to continue with a conversation.',
      demoStatement: 'Explore the contact options and try the demonstration form. The form does not send inquiries.',
      primaryAction: 'Tell us about your project',
      secondaryAction: 'Write on WhatsApp',
    },
    primaryAction: 'Tell us about your project',
    secondaryAction: 'View services',
  });
});
