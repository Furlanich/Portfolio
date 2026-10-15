import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const modules = [
  { locale: 'es', routeId: 'home', path: '../app/(es)/_content/home.ts', exportName: 'homeContent' },
  { locale: 'es', routeId: 'services', path: '../app/(es)/_content/services.ts', exportName: 'servicesPageContent' },
  { locale: 'es', routeId: 'contact', path: '../app/(es)/_content/contact.ts', exportName: 'contactContent' },
  { locale: 'es', routeId: 'founder', path: '../app/(es)/_content/founder.ts', exportName: 'founderContent' },
  { locale: 'en', routeId: 'home', path: '../app/(en)/en/_content/home.ts', exportName: 'homeContent' },
  { locale: 'en', routeId: 'services', path: '../app/(en)/en/_content/services.ts', exportName: 'servicesPageContent' },
  { locale: 'en', routeId: 'contact', path: '../app/(en)/en/_content/contact.ts', exportName: 'contactContent' },
  { locale: 'en', routeId: 'founder', path: '../app/(en)/en/_content/founder.ts', exportName: 'founderContent' },
];

const expectedContactActions = {
  es: {
    whatsapp: 'https://wa.me/5491150117565',
    email: 'mailto:samuelfurlanich@gmail.com',
    phone: 'tel:+5491150117565',
  },
  en: {
    whatsapp: 'https://wa.me/5491150117565',
    email: 'mailto:samuelfurlanich@gmail.com',
    phone: 'tel:+5491150117565',
  },
};

const expectedProfessionalLinks = {
  linkedin: 'https://www.linkedin.com/in/samuel-furlanich/',
  github: 'https://github.com/Furlanich',
};

function collectStrings(value, strings = []) {
  if (typeof value === 'string') strings.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, strings));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, strings));
  }
  return strings;
}

function assertNoUnsafeStrings(content) {
  const strings = collectStrings(content);
  assert.equal(strings.some((value) => /coming\s+soon/i.test(value)), false);

  const absoluteUrls = strings.filter((value) => /^https?:\/\//i.test(value));
  assert.deepEqual(
    absoluteUrls.filter((value) => ![
      'https://wa.me/5491150117565',
      expectedProfessionalLinks.linkedin,
      expectedProfessionalLinks.github,
      'https://github.com/Furlanich/MilkyPantsCheese-Administracion-', // Founder's MPC source action (2026-10-06)
    ].includes(value)),
    [],
  );
}

function collectSemanticActions(value, actions = []) {
  if (Array.isArray(value)) value.forEach((item) => collectSemanticActions(item, actions));
  else if (value && typeof value === 'object') {
    if (typeof value.label === 'string' && typeof value.routeId === 'string') actions.push(value);
    else Object.values(value).forEach((item) => collectSemanticActions(item, actions));
  }
  return actions;
}

test('exports one typed foundation content model for every locale and route', async () => {
  for (const definition of modules) {
    const loaded = await import(definition.path);
    const content = loaded[definition.exportName];

    assert.ok(content, `${definition.path} should export ${definition.exportName}`);
    assert.equal(content.locale, definition.locale);
    assert.equal(content.routeId, definition.routeId);
    assertNoUnsafeStrings(content);
  }
});

test('uses semantic route ids for every internal action', async () => {
  const validRouteIds = new Set(['home', 'services', 'projects', 'contact', 'studio', 'founder']);

  for (const definition of modules) {
    const content = (await import(definition.path))[definition.exportName];
    const actions = collectSemanticActions(content);

    for (const action of actions) {
      assert.equal(typeof action.routeId, 'string');
      assert.equal(validRouteIds.has(action.routeId), true);
      assert.equal(typeof action.href, 'undefined');
    }
  }
});

test('exposes only the approved direct contact channels', async () => {
  for (const locale of ['es', 'en']) {
    const definition = modules.find((item) => item.locale === locale && item.routeId === 'contact');
    const content = (await import(definition.path))[definition.exportName];

    assert.deepEqual(
      content.actions.map(({ kind, href }) => ({ kind, href })),
      [
        { kind: 'whatsapp', href: expectedContactActions[locale].whatsapp },
        { kind: 'email', href: expectedContactActions[locale].email },
        { kind: 'phone', href: expectedContactActions[locale].phone },
      ],
    );
  }
});

test('keeps the approved minimum homepage and services copy', async () => {
  const spanishHome = (await import('../app/(es)/_content/home.ts')).homeContent;
  const englishHome = (await import('../app/(en)/en/_content/home.ts')).homeContent;
  const spanishServices = (await import('../app/(es)/_content/services.ts')).servicesPageContent;
  const englishServices = (await import('../app/(en)/en/_content/services.ts')).servicesPageContent;

  assert.equal(spanishHome.eyebrow, 'Estudio de software a medida');
  assert.equal(englishHome.eyebrow, 'Custom software studio');
  assert.equal(spanishHome.heading, 'Conectá tus sistemas. Simplificá el trabajo diario.');
  assert.equal(englishHome.heading, 'Connect your systems. Simplify everyday work.');
  assert.equal(spanishHome.primaryAction.routeId, 'contact');
  assert.equal(spanishHome.secondaryAction.routeId, 'services');
  assert.equal(englishHome.primaryAction.routeId, 'contact');
  assert.equal(englishHome.secondaryAction.routeId, 'services');
  assert.equal(spanishServices.introduction.heading, 'Software para que el trabajo avance.');
  assert.equal(englishServices.introduction.heading, 'Software that moves work forward.');
  assert.equal(spanishServices.services.length, 3);
  assert.equal(englishServices.services.length, 3);
  assert.equal(spanishServices.finalCta.action.routeId, 'contact');
  assert.equal(englishServices.finalCta.action.routeId, 'contact');
});

test('exposes the subdued Founder context action after direct contact channels', async () => {
  for (const locale of ['es', 'en']) {
    const definition = modules.find((item) => item.locale === locale && item.routeId === 'contact');
    const content = (await import(definition.path))[definition.exportName];

    assert.deepEqual(content.founderContextAction, {
      label: locale === 'es' ? 'Conocer la trayectoria de Samuel' : "View Samuel's background",
      routeId: 'founder',
    });
  }
});

test('uses the stable C-NAV Contact action in every localized shell', () => {
  const pagePaths = [
    'app/(es)/page.tsx',
    'app/(es)/servicios/page.tsx',
    'app/(es)/proyectos/page.tsx',
    'app/(es)/contacto/page.tsx',
    'app/(es)/privacidad/page.tsx',
    'app/(es)/estudio/page.tsx',
    'app/(en)/en/page.tsx',
    'app/(en)/en/services/page.tsx',
    'app/(en)/en/work/page.tsx',
    'app/(en)/en/contact/page.tsx',
    'app/(en)/en/privacy/page.tsx',
    'app/(en)/en/about/page.tsx',
  ];

  for (const relativePath of pagePaths) {
    const source = fs.readFileSync(relativePath, 'utf8');
    const expectedLabel = relativePath.startsWith('app/(es)') ? 'Ver contacto' : 'Contact options';

    assert.match(source, new RegExp("primaryAction: ['\"]" + expectedLabel + "['\"]"), relativePath);
    assert.doesNotMatch(
      source,
      /primaryAction:\s*(?:homeContent|contactContent|founderContent|studioPageContent)\.[^\n]+/,
      relativePath,
    );
  }
});
