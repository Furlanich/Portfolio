import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

// PLAN-SFC-V1 Task 2: the Founder source and content assertions that used to share foundation-content.test.mjs
// with Studio, Home, Services and Contact. Task 7 owns this file from here on, so rebuilding the Founder page
// never edits another page's test. Cases moved verbatim; nothing was dropped (see the Task 2 receipt inventory).

const modules = [
  { locale: 'es', routeId: 'founder', path: '../app/(es)/_content/founder.ts', exportName: 'founderContent' },
  { locale: 'en', routeId: 'founder', path: '../app/(en)/en/_content/founder.ts', exportName: 'founderContent' },
];

const expectedProfessionalLinks = {
  linkedin: 'https://www.linkedin.com/in/samuel-furlanich/',
  github: 'https://github.com/Furlanich',
};

const approvedBiographies = {
  es: [
    'Samuel Furlanich es ingeniero de software y fundador de FURLANICH. Trabaja de forma independiente desde 2023, diseñando y manteniendo aplicaciones web y de escritorio, sistemas de gestión y automatizaciones.',
    'Completó sus estudios de Ciencias de la Computación en la Universidad de Buenos Aires y cuenta además con formación como Técnico Informático en la E.E.S.T. N.º 1 de Chivilcoy. Su práctica se especializa en backend con .NET y se complementa con interfaces construidas con React, Next.js y Blazor.',
    'También se desempeña como Software Developer en CleverSoft S.A., experiencia que complementa su trabajo al frente de FURLANICH. Lidera personalmente cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
  ],
  en: [
    'Samuel Furlanich is a Software Engineer and the founder of FURLANICH. He has worked independently since 2023, designing and maintaining web and desktop applications, management systems, and automations.',
    'He completed his Computer Science studies at the University of Buenos Aires and also trained as an IT Technician at E.E.S.T. No. 1 in Chivilcoy. His practice focuses on .NET backend development, complemented by interfaces built with React, Next.js, and Blazor.',
    'He also works as a Software Developer at CleverSoft S.A., experience that complements his work leading FURLANICH. He personally leads each project and brings in specialist collaborators when the scope requires them.',
  ],
};

// PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE (2026-10-20 owner amendment): literal, independent of production content.
const localizedCv = {
  es: { path: '/Samuel-Furlanich-CV-ES.pdf', downloadName: 'Samuel-Furlanich-CV-ES.pdf', asset: 'public/Samuel-Furlanich-CV-ES.pdf' },
  en: { path: '/Samuel-Furlanich-CV-EN.pdf', downloadName: 'Samuel-Furlanich-CV-EN.pdf', asset: 'public/Samuel-Furlanich-CV-EN.pdf' },
};

const cleverSoftEntries = {
  es: {
    period: 'Desde junio de 2026',
    role: 'Software Developer',
    context: 'CleverSoft S.A.',
    summary:
      'Ingreso como analista de soporte (Support Analyst) y posterior paso a Software Developer. Mantenimiento y desarrollo de soluciones ERP y de software para la resolución de pagos.',
  },
  en: {
    period: 'Since June 2026',
    role: 'Software Developer',
    context: 'CleverSoft S.A.',
    summary:
      'Joined as a Support Analyst and later moved into the Software Developer role. Maintenance and development of ERP and payment-resolution software.',
  },
};

const existingEntries = {
  es: [
    {
      period: 'Desde 2023',
      role: 'Desarrollo de software independiente',
      context: 'Práctica profesional',
      summary:
        'Diseño, desarrollo y mantenimiento de aplicaciones web y de escritorio, sistemas de gestión y automatizaciones. El trabajo abarca backend con .NET, interfaces web, integraciones, mejora de rendimiento y soporte técnico acordado.',
    },
    {
      period: '2021',
      role: 'Pasantía profesional como Técnico Informático',
      context: 'E.E.S.T. N.º 1, Chivilcoy',
      summary:
        'Desarrollo y soporte de aplicaciones de gestión con .NET y ASP.NET Razor Pages, junto con mantenimiento de entornos de desarrollo, redes locales, cuentas y permisos.',
    },
  ],
  en: [
    {
      period: 'Since 2023',
      role: 'Independent software development',
      context: 'Professional practice',
      summary:
        'Designing, building, and maintaining web and desktop applications, management systems, and automations. The work spans .NET backends, web interfaces, integrations, performance improvements, and agreed technical support.',
    },
    {
      period: '2021',
      role: 'IT Technician professional internship',
      context: 'E.E.S.T. No. 1, Chivilcoy',
      summary:
        'Developed and supported management applications with .NET and ASP.NET Razor Pages, while also maintaining development environments, local networks, user accounts, and permissions.',
    },
  ],
};

const capabilityHeadings = {
  es: 'Capacidades para construir y mejorar sistemas',
  en: 'Capabilities for building and improving systems',
};

const projectsDescriptions = {
  es: 'Los proyectos públicos permiten explorar código, contexto y límites.',
  en: 'The public projects let you explore code, context and limitations.',
};

test('exports the complete approved Founder profile in both locales', async () => {
  for (const locale of ['es', 'en']) {
    const definition = modules.find((item) => item.locale === locale && item.routeId === 'founder');
    const content = (await import(definition.path))[definition.exportName];

    assert.equal(content.header.name, 'Samuel Furlanich');
    assert.match(content.header.context, /founder|fundador/i);
    assert.equal('opening' in content.header, false);
    assert.ok(content.biography.heading);
    assert.deepEqual(content.biography.paragraphs, approvedBiographies[locale]);
    assert.match(content.header.context, locale === 'es' ? /Ingeniero de software/ : /Software Engineer/);
    assert.match(content.biography.paragraphs[0], locale === 'es' ? /es ingeniero de software/ : /is a Software Engineer/);
    assert.equal(content.professionalLinks.cv.path, localizedCv[locale].path);
    assert.equal(content.professionalLinks.cv.downloadName, localizedCv[locale].downloadName);
    assert.equal(content.professionalLinks.linkedin.href, expectedProfessionalLinks.linkedin);
    assert.equal(content.professionalLinks.github.href, expectedProfessionalLinks.github);

    assert.equal(content.experience.entries.length, 3);
    for (const entry of content.experience.entries) {
      assert.ok(entry.period);
      assert.ok(entry.role);
      assert.ok(entry.context);
      assert.ok(entry.summary);
    }
    // 2026-10-20 amendment: CleverSoft S.A. is the first entry; the two existing entries follow unchanged.
    assert.deepEqual(content.experience.entries, [cleverSoftEntries[locale], ...existingEntries[locale]]);
    assert.equal(content.experience.entries[0].context, 'CleverSoft S.A.');
    assert.equal(JSON.stringify(content).includes('Clever Soft SA'), false);

    assert.equal(content.education.entries.length, 2);
    // Dated 2026-10-06 (PLAN-SPF-V1 Task 3): the MPC detail route is retired; Founder's action is the approved public source.
    assert.equal(content.education.project.sourceHref, 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-');
    assert.equal(content.education.project.actionLabel, locale === 'es' ? 'Ver código fuente' : 'View source code');
    assert.equal('slug' in content.education.project, false);
    assert.match(content.education.project.summary, /2021/);
    assert.match(content.education.project.summary, /fictic|ficticio|fictional/i);
    assert.match(content.education.project.relationship, /grup|group/i);
    assert.match(content.education.project.limitation, /verific|claimed|afirma/i);
    assert.equal(content.capabilities.groups.length, 4);
    assert.equal(content.capabilities.heading, capabilityHeadings[locale]);
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
    assert.equal(content.projectsBridge.description, projectsDescriptions[locale]);
    assert.equal(content.projectsBridge.action.routeId, 'projects');
    assert.equal(content.finalCta.action.routeId, 'contact');
    assert.deepEqual(content.wordBindings, [
      { nodeId: 'n0', word: '.NET' },
      { nodeId: 'n4', word: 'React' },
      { nodeId: 'n8', word: 'Next.js' },
      { nodeId: 'n12', word: 'Blazor' },
    ]);
    assert.equal('portrait' in content, false);
  }
});

test('uses the stable C-NAV Contact action in both localized Founder shells', () => {
  const pagePaths = ['app/(es)/estudio/samuel-furlanich/page.tsx', 'app/(en)/en/about/samuel-furlanich/page.tsx'];

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

function sha256(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(relativePath)).digest('hex');
}

function listSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(full);
    return /.(?:tsx?|mjs|js|css|json)$/.test(entry.name) ? [full] : [];
  });
}

test('ships a genuine, distinct CV file for each Founder locale', () => {
  for (const { asset } of Object.values(localizedCv)) {
    assert.ok(fs.existsSync(asset), asset + ' must exist');
    assert.equal(fs.readFileSync(asset).subarray(0, 5).toString('latin1'), '%PDF-', asset);
  }
  assert.notEqual(sha256(localizedCv.es.asset), sha256(localizedCv.en.asset));
});

test('retires the legacy single CV and every current reference to it', () => {
  assert.equal(fs.existsSync('public/Samuel-Furlanich-CV.pdf'), false);
  const legacy = 'Samuel-Furlanich-CV.pdf';
  const offenders = ['app', 'components', 'lib'].flatMap(listSourceFiles).filter((file) => fs.readFileSync(file, 'utf8').includes(legacy));
  assert.deepEqual(offenders, []);
});
