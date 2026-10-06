import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative, resolve } from 'node:path';

// PLAN-SPF-V1 Task 3: the dossier bodies are verified against the same typed content the pages render.
const { projectPageContent: spanishProjects } = await import('../app/(es)/_content/projects.ts');
const { projectPageContent: englishProjects } = await import('../app/(en)/en/_content/projects.ts');
const { getPublishedProjectDossiers } = await import('../lib/projects/publication.ts');

const projectRoot = dirname(fileURLToPath(import.meta.url));
// STATIC_EXPORT_DIR lets `scripts/verify-static-export.test.mjs` run this verifier against a fixture
// export; it is unset for `npm run verify:static-export`, which always checks the real `out/`.
const outputRoot = process.env.STATIC_EXPORT_DIR ? resolve(process.env.STATIC_EXPORT_DIR) : join(projectRoot, '..', 'out');
const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const artifacts = [
  { route: '/', file: 'index.html', lang: 'es-AR' },
  { route: '/servicios/', file: 'servicios/index.html', lang: 'es-AR' },
  { route: '/proyectos/', file: 'proyectos/index.html', lang: 'es-AR' },
  { route: '/contacto/', file: 'contacto/index.html', lang: 'es-AR' },
  { route: '/privacidad/', file: 'privacidad/index.html', lang: 'es-AR' },
  { route: '/estudio/', file: 'estudio/index.html', lang: 'es-AR' },
  { route: '/estudio/samuel-furlanich/', file: 'estudio/samuel-furlanich/index.html', lang: 'es-AR' },
  { route: '/en/', file: 'en/index.html', lang: 'en' },
  { route: '/en/services/', file: 'en/services/index.html', lang: 'en' },
  { route: '/en/work/', file: 'en/work/index.html', lang: 'en' },
  { route: '/en/contact/', file: 'en/contact/index.html', lang: 'en' },
  { route: '/en/privacy/', file: 'en/privacy/index.html', lang: 'en' },
  { route: '/en/about/', file: 'en/about/index.html', lang: 'en' },
  { route: '/en/about/samuel-furlanich/', file: 'en/about/samuel-furlanich/index.html', lang: 'en' },
];

// PLAN-SPF-V1 Task 3 (2026-10-06): the six project-detail destinations and the MPC concept illustration
// are retired. A clean export must contain none of them, and nothing may link to them. Their paths
// appear here only so their absence stays verified.
const retiredRoutes = [
  'proyectos/general-reservation-system',
  'proyectos/the-system',
  'proyectos/mpc-administracion',
  'en/work/general-reservation-system',
  'en/work/the-system',
  'en/work/mpc-administracion',
];
const retiredArtifacts = [
  ...retiredRoutes.map((route) => route + '/index.html'),
  'projects/mpc-administracion/conceptual-operations-model.webp',
];
const retiredDestination = /(?:\/proyectos\/|\/en\/work\/)(?:general-reservation-system|the-system|mpc-administracion)(?![\w-])/;

const studioRequirements = {
  'estudio/index.html': {
    heading: 'Software a medida con responsabilidad técnica directa.',
    sections: [
      'Dirección técnica de principio a fin',
      'Principios para trabajar con claridad',
      'Base en Buenos Aires, disponibilidad nacional e internacional',
      'La persona detrás de la dirección técnica',
      'Conversemos sobre lo que hoy frena a tu negocio',
    ],
    references: ['/contacto/', '/estudio/samuel-furlanich/', '/en/about/'],
  },
  'en/about/index.html': {
    heading: 'Custom software with direct technical accountability.',
    sections: [
      'Technical direction from start to finish',
      'Principles for clear delivery',
      'Based in Buenos Aires, available nationally and internationally',
      'The person behind the technical direction',
      "Let's talk about what's holding your business back",
    ],
    references: ['/en/contact/', '/en/about/samuel-furlanich/', '/estudio/'],
  },
};

const founderRequirements = {
  'estudio/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Perfil profesional', 'Experiencia profesional', 'Biografía profesional', 'Formación', 'Sistemas que podemos construir', 'Trabajo y evidencia técnica', '¿Querés conversar sobre una necesidad de tu negocio?'],
    projects: '/proyectos/',
    contact: '/contacto/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcAction: 'Ver código fuente',
  },
  'en/about/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Professional profile', 'Professional experience', 'Professional biography', 'Education', 'Systems we can engineer', 'Work and technical evidence', 'Want to discuss a business need?'],
    projects: '/en/work/',
    contact: '/en/contact/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcAction: 'View source code',
  },
};
const homepageRequirements = {
  'index.html': {
    illustrativeTag: 'Escenario ilustrativo',
    chapters: [
      ['Reconocer el sistema real', 'Pedidos, reservas, mensajes y tareas ya conviven en un mismo negocio. El primer paso es entender cómo se relacionan.'],
      ['Ver dónde se fragmenta', 'Cuando la información cambia de canal y se repite, la operación depende de más controles manuales.'],
      ['Conectar lo que importa', 'Una solución bien definida reúne datos, reglas y acciones sin sumar complejidad innecesaria.'],
      ['Coordinar el trabajo', 'El sistema acompaña el proceso real y deja una base que puede mantenerse y adaptarse cuando cambia el negocio.'],
    ],
    sections: [
      ['problems', 'problems-heading', 'Cuando el trabajo queda repartido entre herramientas'],
      ['services', 'services-heading', 'Servicios para necesidades concretas'],
      ['impact', 'impact-heading', 'Menos lugares que revisar para saber en qué estado está un pedido'],
      ['proof', 'proof-heading', 'Una responsabilidad técnica clara'],
      ['proceso', 'proceso-heading', 'Cómo trabajamos'],
      ['founder', 'founder-heading', 'Responsabilidad técnica directa'],
      ['cta', 'cta-heading', '¿Tenés una necesidad concreta o un sistema que necesita atención?'],
    ],
    requiredReferences: [
      '/servicios/',
      '/contacto/',
      '/proyectos/',
      '/estudio/samuel-furlanich/',
      '/#proceso',
      'https://wa.me/5491150117565',
    ],
    forbidden: [
      /id="audiences"|audiences-heading/i,
      /Pensado para negocios con operaciones reales|MKT-D05/i,
      /Busesfy|ChronoApp|MPC Administración|Documancer/i,
      /project-card|case-study|testimonial|client-logo|metric-card/i,
    ],
  },
  'en/index.html': {
    illustrativeTag: 'Illustrative scenario',
    chapters: [
      ['Recognize the real system', 'Orders, bookings, messages, and tasks already coexist in one business. The first step is understanding how they relate.'],
      ['See where it fragments', 'When information changes channels and is repeated, operations depend on more manual checks.'],
      ['Connect what matters', 'A well-defined solution brings data, rules, and actions together without adding unnecessary complexity.'],
      ['Coordinate the work', 'The system supports the real process and creates a foundation that can be maintained and adapted as the business changes.'],
    ],
    sections: [
      ['problems', 'problems-heading', 'When work is spread across tools'],
      ['services', 'services-heading', 'Services for concrete business needs'],
      ['impact', 'impact-heading', 'Fewer places to check before you know where an order stands'],
      ['proof', 'proof-heading', 'Clear technical accountability'],
      ['process', 'process-heading', 'How we work'],
      ['founder', 'founder-heading', 'Direct technical responsibility'],
      ['cta', 'cta-heading', 'Do you have a concrete need or a system that needs attention?'],
    ],
    requiredReferences: [
      '/en/services/',
      '/en/contact/',
      '/en/work/',
      '/en/about/samuel-furlanich/',
      '/en/#process',
      'https://wa.me/5491150117565',
    ],
    forbidden: [
      /id="audiences"|audiences-heading/i,
      /Built for businesses with real operations|MKT-D05/i,
      /Busesfy|ChronoApp|MPC Administración|Documancer/i,
      /project-card|case-study|testimonial|client-logo|metric-card/i,
    ],
  },
};

const servicesRequirements = {
  'servicios/index.html': {
    route: '/servicios/',
    lang: 'es-AR',
    heading: 'Software para tu negocio',
    indexLabel: 'Ir a un servicio',
    index: [
      ['/servicios/#web', 'Sitios y aplicaciones web'],
      ['/servicios/#whatsapp', 'WhatsApp e integraciones'],
      ['/servicios/#consultoria', 'Mantenimiento y consultoría'],
    ],
    services: [
      ['web', 'Sitios y aplicaciones web'],
      ['whatsapp', 'WhatsApp e integraciones'],
      ['consultoria', 'Mejoras para sistemas existentes'],
    ],
    groups: [
      'Tipos de trabajo', 'Punto de partida', 'Buen encaje', 'Límites del servicio',
      'Evidencia disponible', 'Acuerdo de trabajo', 'Límites comerciales',
      'IA solo cuando aporta valor',
    ],
    principlesHeading: 'Qué podés esperar de cualquier servicio',
    principlesAnchor: 'condiciones',
    finalHeading: 'Contanos qué necesitás resolver',
    actions: [
      'Ver contacto',
      'Iniciar una consulta',
    ],
    evidence: [
      'General Reservation System contiene código para reservas de transporte de pasajeros.',
      'Todavía no hay un proyecto público de WhatsApp que podamos mostrar.',
      'El enfoque se apoya en la experiencia técnica de Samuel.',
    ],
    evidenceLink: ['/proyectos/#general-reservation-system', 'Ver el proyecto y sus límites'],
  },
  'en/services/index.html': {
    route: '/en/services/',
    lang: 'en',
    heading: 'Software for your business',
    indexLabel: 'Jump to a service',
    index: [
      ['/en/services/#web', 'Websites and web applications'],
      ['/en/services/#whatsapp', 'WhatsApp and integrations'],
      ['/en/services/#consulting', 'Maintenance and consulting'],
    ],
    services: [
      ['web', 'Websites and web applications'],
      ['whatsapp', 'WhatsApp and integrations'],
      ['consulting', 'Improvements to existing systems'],
    ],
    groups: [
      'Ways of working', 'Starting point', 'A good fit', 'Service boundaries',
      'Available evidence', 'Working agreement', 'Commercial boundaries',
      'AI only where it adds value',
    ],
    principlesHeading: 'What you can expect from every service',
    principlesAnchor: 'working-boundaries',
    finalHeading: 'Tell us what you need to solve',
    actions: [
      'Contact options',
      'Start an enquiry',
    ],
    evidence: [
      'General Reservation System contains code for passenger transport reservations.',
      'There is no public WhatsApp project to show yet.',
      'The approach draws on Samuel’s technical background.',
    ],
    evidenceLink: ['/en/work/#general-reservation-system', 'View the project and its limitations'],
  },
};

const projectsRequirements = {
  'proyectos/index.html': { content: spanishProjects, locale: 'es', services: '/servicios/', founder: '/estudio/samuel-furlanich/' },
  'en/work/index.html': { content: englishProjects, locale: 'en', services: '/en/services/', founder: '/en/about/samuel-furlanich/' },
};

const approvedSources = {
  'general-reservation-system': 'https://github.com/Furlanich/GeneralReservationSystem',
  'the-system': 'https://github.com/Furlanich/The-System',
};
const mpcSource = 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-';

const privacyRequirements = {
  'privacidad/index.html': {
    heading: 'Privacidad de esta demostración',
    introduction:
      'Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.',
    sections: [
      'Qué ocurre con los datos del formulario',
      'Alojamiento y datos técnicos',
      'Alternativas externas',
      'Información sensible',
      'Conservación y consultas',
      'Activación comercial futura',
    ],
    githubLabel: 'Ver la declaración de privacidad de GitHub',
  },
  'en/privacy/index.html': {
    heading: 'Privacy in this demonstration',
    introduction:
      'This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.',
    sections: [
      'What happens to form data',
      'Hosting and technical data',
      'External alternatives',
      'Sensitive information',
      'Retention and questions',
      'Future commercial activation',
    ],
    githubLabel: "View GitHub's privacy statement",
  },
};

const contactRequirements = {
  'contacto/index.html': {
    heading: 'Contanos qué necesitás resolver.',
    notice: 'Demostración interactiva',
    noticeBody: 'Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.',
    fields: ['Nombre', 'Correo electrónico', 'Empresa', '¿Qué necesitás resolver?'],
    fallback: 'WhatsApp, email y teléfono se muestran como alternativas funcionales.',
    privacy: '/privacidad/',
    founder: '/estudio/samuel-furlanich/',
  },
  'en/contact/index.html': {
    heading: 'Tell us what you need to solve.',
    notice: 'Interactive demonstration',
    noticeBody: 'This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.',
    fields: ['Name', 'Email', 'Company', 'What do you need to solve?'],
    fallback: 'WhatsApp, email, and phone are shown as functional alternatives.',
    privacy: '/en/privacy/',
    founder: '/en/about/samuel-furlanich/',
  },
};

function getCapabilityLegend(locale) {
  return {
    es: 'Sitios web · Apps · Chatbots · Agentes · Automatización · Consultoría · Soporte · Modernización',
    en: 'Websites · Apps · Chatbots · Agents · Automation · Consulting · Support · Modernization',
  }[locale];
}

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function hasHeading(html, level, text) {
  return new RegExp(`<${level}\\b[^>]*>${escapeRegExp(text)}</${level}>`).test(html);
}

const chromeRequirements = {
  'es-AR': {
    navigation: 'Navegación principal',
    menu: 'Abrir navegación principal',
    subjects: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio'],
    primary: 'Ver contacto',
    footerLabels: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio', 'Contacto', 'Privacidad'],
  },
  en: {
    navigation: 'Primary navigation',
    menu: 'Open primary navigation',
    subjects: ['Services', 'Work', 'How we work', 'About'],
    primary: 'Contact options',
    footerLabels: ['Services', 'Work', 'How we work', 'About', 'Contact', 'Privacy'],
  },
};

function assertChromeArtifact(artifact, html) {
  const requirement = chromeRequirements[artifact.lang];
  if (!requirement) return;

  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0];
  if (!header) {
    failures.push(`${artifact.file}: missing site header`);
    return;
  }
  if (!footer) {
    failures.push(`${artifact.file}: missing site footer`);
    return;
  }

  if (!header.includes(`aria-label="${requirement.navigation}"`)) {
    failures.push(`${artifact.file}: missing labelled primary navigation`);
  }
  if (!header.includes(`aria-label="${requirement.menu}"`)) {
    failures.push(`${artifact.file}: missing native mobile navigation label`);
  }
  for (const label of [...requirement.subjects, requirement.primary]) {
    if (!header.includes(`>${label}<`)) {
      failures.push(`${artifact.file}: missing approved header label "${label}"`);
    }
  }

  for (const label of requirement.footerLabels) {
    if (!footer.includes(`>${label}<`)) {
      failures.push(`${artifact.file}: missing approved footer label "${label}"`);
    }
  }
  if (!footer.includes('hrefLang="')) {
    failures.push(`${artifact.file}: missing footer language switch`);
  }
  if (!/©[\s\S]*\d{4}[\s\S]*FURLANICH/.test(footer)) {
    failures.push(`${artifact.file}: missing current-year footer utility`);
  }

  const directChannelHrefs = [...footer.matchAll(/href="(https:\/\/wa\.me[^"]+|mailto:[^"]+|tel:[^"]+)"/g)]
    .map((match) => match[1]);
  const expectedDirectChannelHrefs = [
    'https://wa.me/5491150117565',
    'mailto:samuelfurlanich@gmail.com',
    'tel:+5491150117565',
  ];
  if (JSON.stringify(directChannelHrefs) !== JSON.stringify(expectedDirectChannelHrefs)) {
    failures.push(`${artifact.file}: direct footer channels are missing or out of order`);
  }
}

function assertServicesArtifact(artifact, html) {
  const requirement = servicesRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(`${artifact.file}: expected exactly one main landmark`);
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }
  if (!html.includes(`<nav aria-label="${requirement.indexLabel}"`)) {
    failures.push(`${artifact.file}: missing labelled service index`);
  }
  if (!html.includes('<nav') || !html.includes('<ul')) {
    failures.push(`${artifact.file}: service index must use nav and ul semantics`);
  }

  for (const [route, label] of requirement.index) {
    const expected = expectedHref(route);
    if (!html.includes(`href="${expected}"`) || !html.includes(label)) {
      failures.push(`${artifact.file}: missing service index link ${expected}`);
    }
  }

  let previousSectionPosition = -1;
  for (const [id, heading] of requirement.services) {
    const sectionPosition = html.search(new RegExp(`<section\\b[^>]*\\bid="${escapeRegExp(id)}"`));
    if (sectionPosition === -1) {
      failures.push(`${artifact.file}: missing Services section id "${id}"`);
    } else if (sectionPosition <= previousSectionPosition) {
      failures.push(`${artifact.file}: Services section "${id}" is out of order`);
    }
    previousSectionPosition = sectionPosition;
    if (!hasHeading(html, 'h2', heading)) {
      failures.push(`${artifact.file}: missing visible Services heading "${heading}"`);
    }
  }

  for (const group of requirement.groups) {
    if (!hasHeading(html, 'h3', group)) {
      failures.push(`${artifact.file}: missing internal group heading "${group}"`);
    }
  }
  if (!html.includes('id="' + requirement.principlesAnchor + '"')) {
    failures.push(artifact.file + ': missing principles anchor');
  }
  if (!hasHeading(html, 'h2', requirement.principlesHeading)) {
    failures.push(`${artifact.file}: missing principles heading`);
  }
  if (!hasHeading(html, 'h2', requirement.finalHeading)) {
    failures.push(`${artifact.file}: missing final CTA heading`);
  }
  for (const action of requirement.actions) {
    if (!html.includes(action)) failures.push(`${artifact.file}: missing CTA label "${action}"`);
  }
  for (const evidence of requirement.evidence) {
    if (!html.includes(evidence)) failures.push(`${artifact.file}: missing evidence text "${evidence}"`);
  }

  if (requirement.evidenceLink) {
    const [route, label] = requirement.evidenceLink;
    if (!html.includes('href="' + expectedHref(route) + '"') || !html.includes(label)) {
      failures.push(artifact.file + ': missing evidence link ' + expectedHref(route));
    }
  }

  const forbidden = [
    /https?:\/\/[^\"]*(?:general.?reservation|reservation.?system)/i,
    /Busesfy|ChronoApp|MPC Administración|Documancer/i,
    /<img\b/i,
    /project-card|case-study|testimonial|client-logo|metric-card/i,
    /mismo día hábil|same business day|responseStatement/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(html)) failures.push(`${artifact.file}: forbidden public evidence or route content matched ${pattern}`);
  }
}

function assertProjectsArtifact(artifact, html) {
  const requirement = projectsRequirements[artifact.file];
  if (!requirement) return;
  const { content, locale } = requirement;
  const dossiers = getPublishedProjectDossiers(content, locale);
  const file = artifact.file;
  const mainStart = html.indexOf('<main');
  const mainHtml = html.slice(mainStart, html.indexOf('</main>', mainStart));

  if (countMatches(html, /<main\b/g) !== 1) failures.push(file + ': expected exactly one main landmark');
  const mainTag = html.match(/<main\b[^>]*>/)?.[0] ?? '';
  if (!/\bdata-connected-page\b/.test(mainTag) || !/\bdata-connected-route="projects"/.test(mainTag)) {
    failures.push(file + ': main must carry the connected-page contract');
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !hasHeading(html, 'h1', content.heading)) {
    failures.push(file + ': expected one approved visible H1');
  }
  if (!html.includes(content.introduction)) failures.push(file + ': missing approved introduction');

  // The decorative ground, the reserved Pause mount and the semantic legend are server HTML.
  if (!/\bdata-connected-ground\b/.test(html) || !/\bdata-connected-mount\b/.test(html)) failures.push(file + ': missing the static connected ground');
  if (!/\bid="connected-pause-projects"/.test(html)) failures.push(file + ': missing the reserved Pause mount');
  if (!html.includes(content.sceneCaption)) failures.push(file + ': missing the scene caption');
  if (countMatches(html, /<canvas\b/g) !== 0) failures.push(file + ': a canvas must not be server-rendered');

  // Exactly two complete articles, GRS first, with every approved field and the original concept.
  if (countMatches(html, /<article\b/g) !== dossiers.length) {
    failures.push(file + ': expected exactly ' + dossiers.length + ' complete dossiers');
  }
  let previousPosition = -1;
  for (const dossier of dossiers) {
    const articleStart = html.search(new RegExp('<article\\b[^>]*\\bid="' + escapeRegExp(dossier.slug) + '"'));
    if (articleStart === -1 || articleStart <= previousPosition) {
      failures.push(file + ': dossier #' + dossier.slug + ' is missing or out of approved order');
      continue;
    }
    previousPosition = articleStart;
    const article = html.slice(articleStart, html.indexOf('</article>', articleStart));
    const fields = [
      dossier.title, dossier.maturityLabel, dossier.summary, dossier.relationship,
      dossier.opportunity.heading, dossier.opportunity.content,
      dossier.scope.heading, ...dossier.scope.items,
      dossier.evidence.heading, dossier.evidence.content,
      dossier.limits.heading, dossier.limits.content,
      dossier.visual.caption, content.sourceAction, content.relatedServiceAction, content.founderAction.label,
    ];
    for (const field of fields) {
      if (!article.includes(field)) failures.push(file + ': dossier #' + dossier.slug + ' is missing approved text "' + field + '"');
    }
    if (!hasHeading(article, 'h2', dossier.title)) failures.push(file + ': dossier #' + dossier.slug + ' needs its title as an H2');
    if (countMatches(article, /<h3\b/g) !== 4) failures.push(file + ': dossier #' + dossier.slug + ' needs four section headings');
    if (countMatches(article, /<li\b/g) !== dossier.scope.items.length) failures.push(file + ': dossier #' + dossier.slug + ' scope list is incomplete');

    const images = article.match(/<img\b[^>]*>/gi) ?? [];
    const expectedSrc = expectedHref(dossier.visual.src);
    if (images.length !== 1 || !images[0].includes('alt="' + dossier.visual.alt + '"') || !images[0].includes(expectedSrc) || !/width="1599"/.test(images[0]) || !/height="900"/.test(images[0]) || !/loading="lazy"/.test(images[0])) {
      failures.push(file + ': dossier #' + dossier.slug + ' needs its original 1599x900 lazy concept with the approved alt text');
    }
    if (!article.includes('href="' + approvedSources[dossier.slug] + '"')) failures.push(file + ': dossier #' + dossier.slug + ' is missing its approved source link');
    if (!article.includes('href="' + expectedHref(requirement.services) + '#web"')) failures.push(file + ': dossier #' + dossier.slug + ' is missing its Services link');
    if (!article.includes('href="' + expectedHref(requirement.founder) + '"')) failures.push(file + ': dossier #' + dossier.slug + ' is missing its Founder context link');
    if (!html.includes('href="#' + dossier.slug + '"') || !html.includes(dossier.jumpLabel)) failures.push(file + ': missing the #' + dossier.slug + ' jump link');
  }
  if (countMatches(html, /<img\b/gi) !== dossiers.length) failures.push(file + ': expected exactly the two approved concept images');

  if (!hasHeading(html, 'h2', content.disclosure.heading) || !html.includes(content.disclosure.description)) {
    failures.push(file + ': missing the publication note');
  }
  const legend = getCapabilityLegend(locale);
  if (!html.includes(legend)) failures.push(file + ': the semantic capability legend must read as one ordinary line');

  // Nothing hidden, and no detail action, card or MPC record left behind.
  if (/<details\b|<summary\b|aria-expanded/.test(mainHtml)) failures.push(file + ': no story may sit behind a disclosure');
  if (/Ver proyecto|View project|MPC Administración|MilkyPantsCheese|data-project-presentation/.test(html)) failures.push(file + ': a retired card, detail action or MPC record is still present');
}

function assertStudioArtifact(artifact, html) {
  const requirement = studioRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(`${artifact.file}: expected exactly one main landmark`);
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }

  let previousHeadingPosition = -1;
  for (const heading of requirement.sections) {
    const position = html.indexOf(heading);
    if (position === -1 || position <= previousHeadingPosition) {
      failures.push(`${artifact.file}: Studio sections are missing or out of approved order`);
    }
    previousHeadingPosition = position;
  }

  for (const route of requirement.references) {
    const expected = expectedHref(route);
    if (!html.includes(`href="${expected}"`)) {
      failures.push(`${artifact.file}: missing Studio reference ${expected}`);
    }
  }

  if (countMatches(html, /<img\b/gi) > 0) {
    failures.push(`${artifact.file}: unexpected Studio image`);
  }
}

function assertFounderArtifact(artifact, html) {
  const requirement = founderRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(artifact.file + ': expected exactly one main landmark');
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(artifact.file + ': expected one approved Founder H1');
  }

  let previousHeadingPosition = -1;
  for (const heading of requirement.sections) {
    const position = html.indexOf(heading);
    if (position === -1 || position <= previousHeadingPosition) {
      failures.push(artifact.file + ': Founder sections are missing or out of approved order');
    }
    previousHeadingPosition = position;
  }

  for (const route of [requirement.projects, requirement.contact, requirement.cv]) {
    const expected = expectedHref(route);
    if (!html.includes('href="' + expected + '"')) {
      failures.push(artifact.file + ': missing Founder reference ' + expected);
    }
  }

  for (const link of ['https://www.linkedin.com/in/samuel-furlanich/', 'https://github.com/Furlanich']) {
    if (!html.includes('href="' + link + '"')) {
      failures.push(artifact.file + ': missing professional link ' + link);
    }
  }

  if (countMatches(html, /<li\b[^>]*data-founder-experience-entry/g) !== 2) {
    failures.push(artifact.file + ': expected exactly two Founder experience entries');
  }
  if (countMatches(html, /<section\b[^>]*data-founder-capability-group/g) !== 4) {
    failures.push(artifact.file + ': expected exactly four Founder capability groups');
  }
  const capabilityReferences = [...html.matchAll(/<section\b[^>]*data-founder-capability-group[^>]*aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
  if (capabilityReferences.length !== 4 || new Set(capabilityReferences).size !== 4 || capabilityReferences.some((reference) => /\s/.test(reference))) {
    failures.push(artifact.file + ': Founder capability groups must use unique whitespace-free aria-labelledby references');
  }
  if (!html.includes('Clever Soft SA') || /<h[1-6]\b[^>]*>[^<]*Clever Soft SA/i.test(html)) {
    failures.push(artifact.file + ': Clever Soft SA must remain narrative-only');
  }
  if (!html.includes(requirement.mpc) || !html.includes('href="' + mpcSource + '"') || !html.includes('>' + requirement.mpcAction + '<')) {
    failures.push(artifact.file + ': missing Founder-owned MPC source action');
  }
  if (/href="[^"]*mpc-administracion/i.test(html)) {
    failures.push(artifact.file + ': Founder must not link to a retired MPC destination');
  }
  if (countMatches(html, /<img\b/gi) > 0) {
    failures.push(artifact.file + ': unexpected Founder portrait or media');
  }
}
function assertPrivacyArtifact(artifact, html) {
  const requirement = privacyRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(artifact.file + ': expected exactly one main landmark');
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(artifact.file + ': expected one approved visible Privacy H1');
  }
  if (!html.includes(requirement.introduction)) {
    failures.push(artifact.file + ': missing approved Privacy introduction');
  }

  let previousHeadingPosition = -1;
  for (const heading of requirement.sections) {
    const position = html.search(new RegExp('<h2\\b[^>]*>' + escapeRegExp(heading) + '</h2>'));
    if (position === -1 || position <= previousHeadingPosition) {
      failures.push(artifact.file + ': Privacy sections are missing or out of approved order');
    }
    previousHeadingPosition = position;
  }

  const githubHref = 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement';
  if (!html.includes('href="' + githubHref + '"') || !html.includes(requirement.githubLabel)) {
    failures.push(artifact.file + ': missing GitHub privacy statement reference');
  }
  if (/DPA|subprocessor|(?:consulta enviada|inquiry sent)/i.test(html)) {
    failures.push(artifact.file + ': live-processing or commercial inquiry claim leaked into Privacy artifact');
  }
}

function assertContactArtifact(artifact, html) {
  const requirement = contactRequirements[artifact.file];
  if (!requirement) return;
  if (countMatches(html, /<main\b/g) !== 1) failures.push(artifact.file + ': expected exactly one Contact main landmark');
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(artifact.file + ': expected one approved Contact H1');
  }
  for (const text of [requirement.notice, requirement.noticeBody, requirement.fallback, ...requirement.fields]) {
    if (!html.includes(text)) failures.push(artifact.file + ': missing approved Contact text "' + text + '"');
  }
  for (const route of [requirement.privacy, requirement.founder]) {
    const expected = expectedHref(route);
    if (!html.includes('href="' + expected + '"')) failures.push(artifact.file + ': missing Contact reference ' + expected);
  }
  if (!html.includes('<form') || !html.includes('Simul') && !html.includes('Simulate')) {
    failures.push(artifact.file + ': missing local-only Contact form');
  }
  if (/NEXT_PUBLIC_FORMSPREE_ENDPOINT|formspree\.io|inquiry sent|consulta enviada/i.test(html)) {
    failures.push(artifact.file + ': contains live provider or delivery wording');
  }
}

function expectedHref(route) {
  return `${configuredBasePath}${route}`;
}

function getInternalReferences(html) {
  return [...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((value) => value.startsWith('/') && !value.startsWith('//'));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectTextFiles(path));
    else if (['.html', '.js', '.json', '.map', '.txt', '.css'].includes(extname(entry.name).toLowerCase())) files.push(path);
  }
  return files;
}

const failures = [];
const allHtml = [];

// SKY-CHART-V2 D-23 / Task 10: the two environment posters are the static fallback art and must
// ship in the export; the chapter posters they replaced must not.
const requiredPosters = [
  { file: 'brand/sky-chart/environment-wide.webp', maxBytes: 150 * 1024 },
  { file: 'brand/sky-chart/environment-compact.webp', maxBytes: 80 * 1024 },
];
for (const poster of requiredPosters) {
  try {
    const bytes = await readFile(join(outputRoot, poster.file));
    if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
      failures.push(`${poster.file}: not a WebP file`);
    } else if (bytes.length > poster.maxBytes) {
      failures.push(`${poster.file}: ${bytes.length} bytes exceeds its ${poster.maxBytes}-byte budget`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    failures.push(`missing static poster: ${poster.file}`);
  }
}
try {
  await stat(join(outputRoot, 'brand/immersive'));
  failures.push('brand/immersive: the retired chapter posters must not be exported');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

for (const artifact of artifacts) {
  const filePath = join(outputRoot, artifact.file);

  try {
    const html = await readFile(filePath, 'utf8');
    allHtml.push({ artifact, html });

    if (/PROJECT-(?:GRS|THE-SYSTEM|MPC-ADMIN)/.test(html)) {
      failures.push(`${artifact.file}: internal project identifier leaked into the published artifact`);
    }

    const lang = html.match(/<html\b[^>]*\blang="([^"]+)"/i)?.[1];
    if (lang !== artifact.lang) {
      failures.push(`${artifact.file}: expected <html lang="${artifact.lang}">, found ${lang ?? 'none'}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      failures.push(`missing static artifact: ${artifact.file}`);
    } else {
      throw error;
    }
  }
}

// The six retired detail routes and the MPC concept must be absent from a clean export.
for (const retired of [...retiredArtifacts, ...retiredRoutes, 'projects/mpc-administracion']) {
  try {
    await stat(join(outputRoot, retired));
    failures.push(retired + ': a retired project-detail artifact is still exported');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const exportedTextFiles = await collectTextFiles(outputRoot);
for (const filePath of exportedTextFiles) {
  const source = await readFile(filePath, 'utf8');
  const file = relative(outputRoot, filePath);
  if (/Busesfy|ChronoApp|Documancer|FOUNDER-ONLY|BLOCKED-|PROJECT-(?:GRS|THE-SYSTEM|MPC-ADMIN)/i.test(source)) {
    failures.push(`${file}: blocked, private, retired, or internal project identity leaked into exported payload`);
  }
  if (retiredDestination.test(source) || /mpc-administracion/i.test(source)) {
    failures.push(file + ': an active link or route payload still names a retired project-detail destination');
  }
  if (/brand\/immersive\//.test(source)) {
    failures.push(`${file}: references the retired brand/immersive chapter posters`);
  }
  if (/(?:Busesfy|MPC-Administracion|AI-Scheduler|GRS|Documancer|atlas|pulse|vertex)\.svg/i.test(source)) {
    failures.push(`${file}: retired legacy project asset name leaked into exported payload`);
  }
}

const internalReferences = allHtml.flatMap(({ artifact, html }) =>
  getInternalReferences(html).map((value) => ({ artifact: artifact.file, value })),
);

for (const { artifact, html } of allHtml) {
  assertChromeArtifact(artifact, html);
  assertServicesArtifact(artifact, html);
  assertProjectsArtifact(artifact, html);
  assertStudioArtifact(artifact, html);
  assertFounderArtifact(artifact, html);
  assertPrivacyArtifact(artifact, html);
  assertContactArtifact(artifact, html);
  const requirement = homepageRequirements[artifact.file];
  if (!requirement) continue;

  let previousChapterPosition = -1;
  for (const [heading, description] of requirement.chapters) {
    const chapterPosition = html.search(new RegExp(`<h2\\b[^>]*>${escapeRegExp(heading)}</h2>`));
    if (chapterPosition === -1 || chapterPosition <= previousChapterPosition) {
      failures.push(`${artifact.file}: instrument chapter "${heading}" is missing or out of order`);
    }
    previousChapterPosition = chapterPosition;
    if (!html.includes(description)) {
      failures.push(`${artifact.file}: missing instrument chapter description for "${heading}"`);
    }
  }
  const problemsPosition = html.search(/<section\b[^>]*\bid="problems"/);
  if (previousChapterPosition !== -1 && problemsPosition !== -1 && problemsPosition < previousChapterPosition) {
    failures.push(`${artifact.file}: instrument chapters must precede Problems`);
  }

  // SKY-CHART-V2 Task 8: the four chapter posters are gone (D-12). The environment ground
  // (D-01/D-23) is the only decorative homepage layer, and it must be part of the document.
  if (!/\bdata-environment-ground(?:="[^"]*")?[\s>]/.test(html)) {
    failures.push(`${artifact.file}: missing EnvironmentGround (no data-environment-ground layer)`);
  }
  // D-23: the poster layer carries both WebP URLs, with the deployment base path applied.
  for (const poster of requiredPosters) {
    const posterUrl = new RegExp(`url\\((?:&quot;|")${escapeRegExp(configuredBasePath)}/${escapeRegExp(poster.file)}(?:&quot;|")\\)`);
    if (!posterUrl.test(html)) {
      failures.push(`${artifact.file}: the environment poster layer does not reference ${configuredBasePath}/${poster.file}`);
    }
  }
  for (const image of html.match(/<img\b[^>]*>/gi) ?? []) {
    const src = image.match(/\ssrc="([^"]+)"/)?.[1];
    failures.push(`${artifact.file}: unexpected homepage image ${src}`);
  }

  let previousSectionPosition = -1;
  for (const [sectionId, headingId, heading] of requirement.sections) {
    const sectionPosition = html.search(
      new RegExp(`<section\\b[^>]*\\bid="${escapeRegExp(sectionId)}"`),
    );
    if (sectionPosition === -1) {
      failures.push(`${artifact.file}: missing homepage section id "${sectionId}"`);
    } else if (sectionPosition <= previousSectionPosition) {
      failures.push(`${artifact.file}: homepage section "${sectionId}" is out of order`);
    }
    previousSectionPosition = sectionPosition;

    const headingPosition = html.search(
      new RegExp(`<h2\\b[^>]*\\bid="${escapeRegExp(headingId)}"[^>]*>`),
    );
    if (headingPosition === -1) {
      failures.push(`${artifact.file}: missing homepage heading id "${headingId}"`);
    } else if (!html.includes(heading)) {
      failures.push(`${artifact.file}: missing visible homepage heading "${heading}"`);
    }
  }

  // HOME-IMPACT honesty rule (plan section 12): the Position fix section shows its visible
  // "Illustrative scenario" tag twice (figure and counts). Counted inside the section itself,
  // because the RSC payload elsewhere in the document repeats every string.
  const impactSection = html.match(/<section\b[^>]*\bid="impact"[\s\S]*?<\/section>/)?.[0] ?? '';
  if (impactSection && countMatches(impactSection, new RegExp(escapeRegExp(requirement.illustrativeTag), 'g')) < 2) {
    failures.push(`${artifact.file}: impact section must show the illustrative-scenario tag twice`);
  }

  for (const reference of requirement.requiredReferences) {
    const expectedReference = reference.startsWith('/') ? expectedHref(reference) : reference;
    if (!html.includes(`href="${expectedReference}"`)) {
      failures.push(`${artifact.file}: missing required homepage reference ${expectedReference}`);
    }
  }

  for (const pattern of requirement.forbidden) {
    if (pattern.test(html)) {
      failures.push(`${artifact.file}: forbidden Home content or presentation matched ${pattern}`);
    }
  }
}

if (configuredBasePath) {
  const duplicatedPrefix = `${configuredBasePath}${configuredBasePath}`;

  for (const reference of internalReferences) {
    if (reference.value.startsWith(duplicatedPrefix)) {
      failures.push(`${reference.artifact}: duplicated base path in ${reference.value}`);
    }

    if (
      reference.value !== configuredBasePath &&
      !reference.value.startsWith(`${configuredBasePath}/`)
    ) {
      failures.push(`${reference.artifact}: missing base path in ${reference.value}`);
    }
  }
}

const normalizedReferences = new Set(
  internalReferences.map(({ value }) => value.split(/[?#]/, 1)[0]),
);

for (const artifact of artifacts) {
  const href = expectedHref(artifact.route);
  if (!normalizedReferences.has(href)) {
    failures.push(`missing internal route link: ${href}`);
  }
}

if (failures.length > 0) {
  console.error('Static export verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Static export verified: ${artifacts.length} routes, base path "${configuredBasePath || '/'}".`);
}
