import test from 'node:test';
import assert from 'node:assert/strict';

const modules = [
  { locale: 'es', routeId: 'home', path: '../app/(es)/_content/home.ts', exportName: 'homeContent' },
  { locale: 'es', routeId: 'services', path: '../app/(es)/_content/services.ts', exportName: 'servicesContent' },
  { locale: 'es', routeId: 'contact', path: '../app/(es)/_content/contact.ts', exportName: 'contactContent' },
  { locale: 'es', routeId: 'founder', path: '../app/(es)/_content/founder.ts', exportName: 'founderContent' },
  { locale: 'en', routeId: 'home', path: '../app/(en)/en/_content/home.ts', exportName: 'homeContent' },
  { locale: 'en', routeId: 'services', path: '../app/(en)/en/_content/services.ts', exportName: 'servicesContent' },
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
    ].includes(value)),
    [],
  );
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
  const validRouteIds = new Set(['home', 'services', 'contact', 'founder']);

  for (const definition of modules) {
    const content = (await import(definition.path))[definition.exportName];
    const actions = [
      content.primaryAction,
      content.secondaryAction,
      content.action,
      content.contactAction,
    ].filter(Boolean);

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

test('preserves the minimum founder migration inputs in both locales', async () => {
  for (const locale of ['es', 'en']) {
    const definition = modules.find((item) => item.locale === locale && item.routeId === 'founder');
    const content = (await import(definition.path))[definition.exportName];

    assert.match(content.name, /Samuel Furlanich/);
    assert.match(content.role, /founder|fundador/i);
    assert.match(content.biography, /2024/);
    assert.match(content.biography, /Clever Soft SA/);
    assert.ok(content.experience.length > 0);
    assert.ok(content.education.length > 0);
    assert.ok(content.capabilities.length > 0);
    assert.equal(content.cv.path, '/Samuel-Furlanich-CV.pdf');
    assert.equal(content.linkedin.href, expectedProfessionalLinks.linkedin);
    assert.equal(content.github.href, expectedProfessionalLinks.github);
    assert.equal(content.contactAction.routeId, 'contact');

    assert.equal(content.experience.some(({ title }) => /Clever Soft/i.test(title)), false);
  }
});

test('keeps the approved minimum homepage and services copy', async () => {
  const spanishHome = (await import('../app/(es)/_content/home.ts')).homeContent;
  const englishHome = (await import('../app/(en)/en/_content/home.ts')).homeContent;
  const spanishServices = (await import('../app/(es)/_content/services.ts')).servicesContent;
  const englishServices = (await import('../app/(en)/en/_content/services.ts')).servicesContent;

  assert.equal(spanishHome.eyebrow, 'Desarrollo de software a medida para pymes');
  assert.equal(spanishHome.heading, 'Software práctico para vender, atender y operar mejor.');
  assert.equal(englishHome.heading, 'Practical software to help you sell, serve customers, and run your business better.');
  assert.equal(spanishHome.primaryAction.routeId, 'contact');
  assert.equal(spanishHome.secondaryAction.routeId, 'services');
  assert.equal(englishHome.primaryAction.routeId, 'contact');
  assert.equal(englishHome.secondaryAction.routeId, 'services');
  assert.equal(spanishServices.heading, 'Servicios para necesidades concretas');
  assert.equal(englishServices.heading, 'Services for concrete business needs');
  assert.equal(spanishServices.services.length, 3);
  assert.equal(englishServices.services.length, 3);
  assert.equal(spanishServices.action.routeId, 'contact');
  assert.equal(englishServices.action.routeId, 'contact');
});
