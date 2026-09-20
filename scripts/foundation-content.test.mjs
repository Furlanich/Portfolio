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

test('exports the complete approved Founder profile in both locales', async () => {
  for (const locale of ['es', 'en']) {
    const definition = modules.find((item) => item.locale === locale && item.routeId === 'founder');
    const content = (await import(definition.path))[definition.exportName];

    assert.equal(content.header.name, 'Samuel Furlanich');
    assert.match(content.header.context, /founder|fundador/i);
    assert.equal(
      content.header.opening,
      locale === 'es'
        ? 'Ingeniero de software y fundador de FURLANICH. Su trabajo abarca aplicaciones web, sistemas de gestión, integraciones y mantenimiento.'
        : 'Software Engineer and founder of FURLANICH. His work spans web applications, management systems, integrations and maintenance.',
    );
    assert.equal('biography' in content.header, false);
    assert.ok(content.biography.heading);
    assert.ok(content.biography.paragraphs.length >= 2);
    assert.match(content.biography.paragraphs.join(' '), /2024/);
    assert.match(content.biography.paragraphs.join(' '), /Clever Soft SA/);
    assert.match(content.header.context, locale === 'es' ? /Ingeniero de software/ : /Software Engineer/);
    assert.match(content.biography.paragraphs[0], locale === 'es' ? /es ingeniero de software/ : /is a Software Engineer/);
    assert.match(content.biography.paragraphs.join(' '), /Software Developer/);
    assert.match(content.biography.paragraphs.join(' '), locale === 'es' ? /Ciencias de la Computación/ : /Computer Science studies/);
    assert.equal(content.professionalLinks.cv.path, '/Samuel-Furlanich-CV.pdf');
    assert.equal(content.professionalLinks.linkedin.href, expectedProfessionalLinks.linkedin);
    assert.equal(content.professionalLinks.github.href, expectedProfessionalLinks.github);

    assert.equal(content.experience.entries.length, 2);
    for (const entry of content.experience.entries) {
      assert.ok(entry.period);
      assert.ok(entry.role);
      assert.ok(entry.context);
      assert.ok(entry.summary);
    }
    assert.equal(content.experience.entries.some(({ role }) => /Clever Soft/i.test(role)), false);

    assert.equal(content.education.entries.length, 2);
    assert.equal(content.education.project.slug, 'mpc-administracion');
    assert.match(content.education.project.summary, /2021/);
    assert.match(content.education.project.summary, /fictic|ficticio|fictional/i);
    assert.match(content.education.project.relationship, /grup|group/i);
    assert.match(content.education.project.limitation, /verific|claimed|afirma/i);
    assert.equal(content.capabilities.groups.length, 4);
    assert.match(content.capabilities.heading, /systems|sistemas/i);
    assert.match(content.capabilities.introduction, /problem|problema|system|sistema/i);
    assert.deepEqual(
      content.capabilities.groups.map(({ id }) => id),
      ['management-systems', 'web-applications', 'automation-integrations', 'evolving-systems'],
    );
    assert.equal(
        content.capabilities.groups.some(({ items }) =>
            items.some((item) => /\.NET|ASP\.NET|React|Next\.js|Blazor|Docker|CI\/CD|API/i.test(item)),
        ),
        false,
    );
    assert.ok(content.projectsBridge.description);
    assert.equal(content.projectsBridge.action.routeId, 'projects');
    assert.equal(content.finalCta.action.routeId, 'contact');
    assert.equal('portrait' in content, false);
  }
});
test('keeps the approved minimum homepage and services copy', async () => {
  const spanishHome = (await import('../app/(es)/_content/home.ts')).homeContent;
  const englishHome = (await import('../app/(en)/en/_content/home.ts')).homeContent;
  const spanishServices = (await import('../app/(es)/_content/services.ts')).servicesPageContent;
  const englishServices = (await import('../app/(en)/en/_content/services.ts')).servicesPageContent;

  assert.equal(spanishHome.eyebrow, 'Desarrollo de software a medida para pymes');
  assert.equal(spanishHome.heading, 'Software práctico para vender, atender y operar mejor.');
  assert.equal(englishHome.heading, 'Practical software to help you sell, serve customers, and run your business better.');
  assert.equal(spanishHome.primaryAction.routeId, 'contact');
  assert.equal(spanishHome.secondaryAction.routeId, 'services');
  assert.equal(englishHome.primaryAction.routeId, 'contact');
  assert.equal(englishHome.secondaryAction.routeId, 'services');
  assert.equal(spanishServices.introduction.heading, 'Software para tu negocio');
  assert.equal(englishServices.introduction.heading, 'Software for your business');
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
    'app/(es)/proyectos/[projectSlug]/page.tsx',
    'app/(es)/contacto/page.tsx',
    'app/(es)/privacidad/page.tsx',
    'app/(es)/estudio/page.tsx',
    'app/(es)/estudio/samuel-furlanich/page.tsx',
    'app/(en)/en/page.tsx',
    'app/(en)/en/services/page.tsx',
    'app/(en)/en/work/page.tsx',
    'app/(en)/en/work/[projectSlug]/page.tsx',
    'app/(en)/en/contact/page.tsx',
    'app/(en)/en/privacy/page.tsx',
    'app/(en)/en/about/page.tsx',
    'app/(en)/en/about/samuel-furlanich/page.tsx',
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
