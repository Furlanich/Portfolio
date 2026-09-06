import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(projectRoot, '..', 'out');
const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const artifacts = [
  { route: '/', file: 'index.html', lang: 'es-AR' },
  { route: '/servicios/', file: 'servicios/index.html', lang: 'es-AR' },
  { route: '/proyectos/', file: 'proyectos/index.html', lang: 'es-AR' },
  { route: '/proyectos/general-reservation-system/', file: 'proyectos/general-reservation-system/index.html', lang: 'es-AR' },
  { route: '/proyectos/the-system/', file: 'proyectos/the-system/index.html', lang: 'es-AR' },
  { route: '/proyectos/mpc-administracion/', file: 'proyectos/mpc-administracion/index.html', lang: 'es-AR' },
  { route: '/contacto/', file: 'contacto/index.html', lang: 'es-AR' },
  { route: '/estudio/samuel-furlanich/', file: 'estudio/samuel-furlanich/index.html', lang: 'es-AR' },
  { route: '/en/', file: 'en/index.html', lang: 'en' },
  { route: '/en/services/', file: 'en/services/index.html', lang: 'en' },
  { route: '/en/work/', file: 'en/work/index.html', lang: 'en' },
  { route: '/en/work/general-reservation-system/', file: 'en/work/general-reservation-system/index.html', lang: 'en' },
  { route: '/en/work/the-system/', file: 'en/work/the-system/index.html', lang: 'en' },
  { route: '/en/work/mpc-administracion/', file: 'en/work/mpc-administracion/index.html', lang: 'en' },
  { route: '/en/contact/', file: 'en/contact/index.html', lang: 'en' },
  { route: '/en/about/samuel-furlanich/', file: 'en/about/samuel-furlanich/index.html', lang: 'en' },
];

const homepageRequirements = {
  'index.html': {
    sections: [
      ['problems', 'problems-heading', 'Cuando lo manual empieza a frenar el negocio'],
      ['services', 'services-heading', 'Servicios para necesidades concretas'],
      ['audiences', 'audiences-heading', 'Pensado para negocios con operaciones reales'],
      ['proof', 'proof-heading', 'Credibilidad sin promesas infladas'],
      ['proceso', 'proceso-heading', 'De una necesidad concreta a una solución mantenible'],
      ['founder', 'founder-heading', 'Responsabilidad técnica directa'],
      ['cta', 'cta-heading', '¿Tenés una necesidad concreta o un sistema que necesita atención?'],
    ],
    requiredReferences: [
      '/servicios/',
      '/contacto/',
      '/estudio/samuel-furlanich/',
      '/#proceso',
      'https://wa.me/5491150117565',
    ],
  },
  'en/index.html': {
    sections: [
      ['problems', 'problems-heading', 'When manual work starts holding the business back'],
      ['services', 'services-heading', 'Services for concrete business needs'],
      ['audiences', 'audiences-heading', 'Built for businesses with real operations'],
      ['proof', 'proof-heading', 'Credibility without inflated claims'],
      ['process', 'process-heading', 'From a concrete need to a maintainable solution'],
      ['founder', 'founder-heading', 'Direct technical responsibility'],
      ['cta', 'cta-heading', 'Do you have a concrete need or a system that needs attention?'],
    ],
    requiredReferences: [
      '/en/services/',
      '/en/contact/',
      '/en/about/samuel-furlanich/',
      '/en/#process',
      'https://wa.me/5491150117565',
    ],
  },
};

const servicesRequirements = {
  'servicios/index.html': {
    route: '/servicios/',
    lang: 'es-AR',
    heading: 'Servicios para resolver necesidades concretas del negocio',
    indexLabel: 'Ir a un servicio',
    index: [
      ['/servicios/#web', 'Sitios y aplicaciones web'],
      ['/servicios/#whatsapp', 'WhatsApp e integraciones'],
      ['/servicios/#consultoria', 'Mantenimiento y consultoría'],
    ],
    services: [
      ['web', 'Sitios y aplicaciones web comerciales'],
      ['whatsapp', 'Automatización por WhatsApp e integraciones'],
      ['consultoria', 'Mantenimiento y consultoría de software'],
    ],
    groups: [
      'Situaciones habituales', 'Qué resultado buscamos', 'Distintos niveles de trabajo web',
      'Ejemplos posibles', 'Un trabajo puede incluir', 'No incluye automáticamente',
      'Dependencias externas', 'Buen encaje', 'Cuándo conviene otra alternativa', 'Evidencia disponible',
    ],
    principlesHeading: 'Qué podés esperar de cualquier servicio',
    finalHeading: 'Contanos qué necesitás resolver',
    actions: [
      'Contanos qué necesitás resolver en la web',
      'Conversemos sobre tu flujo por WhatsApp',
      'Contanos qué pasa con tu sistema',
      'Iniciar una consulta',
    ],
    evidence: [
      'El repositorio conserva un sistema general de reservas publicado por Samuel como evidencia de implementación.',
      'Hoy no hay un proyecto público de automatización por WhatsApp',
      'Hoy no hay una intervención pública de mantenimiento o consultoría',
    ],
  },
  'en/services/index.html': {
    route: '/en/services/',
    lang: 'en',
    heading: 'Services for concrete business needs',
    indexLabel: 'Jump to a service',
    index: [
      ['/en/services/#web', 'Websites and web applications'],
      ['/en/services/#whatsapp', 'WhatsApp and integrations'],
      ['/en/services/#consulting', 'Maintenance and consulting'],
    ],
    services: [
      ['web', 'Business websites and web applications'],
      ['whatsapp', 'WhatsApp automation and integrations'],
      ['consulting', 'Software maintenance and IT consulting'],
    ],
    groups: [
      'Common situations', 'The outcome we work towards', 'Different levels of web work',
      'Representative examples', 'An engagement may include', 'Not automatically included',
      'External dependencies', 'A good fit', 'When another option may be better', 'Available evidence',
    ],
    principlesHeading: 'What you can expect from every service',
    finalHeading: 'Tell us what you need to solve',
    actions: [
      'Tell us what you need to solve on the web',
      'Discuss your WhatsApp workflow',
      'Tell us what is happening with your system',
      'Start an enquiry',
    ],
    evidence: [
      'The repository contains a general reservation system published by Samuel as implementation evidence.',
      'There is currently no public WhatsApp automation project',
      'There is currently no public maintenance or consulting intervention',
    ],
  },
};

const projectsRequirements = {
  'proyectos/index.html': {
    heading: 'Proyectos seleccionados',
    introduction: 'Publicamos trabajo solo cuando podemos explicar con claridad',
    cards: [
      ['Gestión de reservas para transporte de pasajeros', 'Ver proyecto', '/proyectos/general-reservation-system/'],
      ['Gestión multiusuario de campañas de rol', 'Ver proyecto', '/proyectos/the-system/'],
      ['Gestión educativa de producción y stock', 'Ver proyecto', '/proyectos/mpc-administracion/'],
    ],
    scopeHeading: 'Alcance de publicación',
    finalHeading: '¿Necesitás resolver algo parecido?',
    finalAction: 'Hablar sobre tu proyecto',
    forbiddenTaxonomy: ['Soluciones en producción', 'Laboratorio FURLANICH', 'Prototipos funcionales'],
  },
  'en/work/index.html': {
    heading: 'Selected work',
    introduction: 'We publish work only when we can clearly explain',
    cards: [
      ['Passenger transport reservation management', 'View project', '/en/work/general-reservation-system/'],
      ['Multi-user role-playing campaign management', 'View project', '/en/work/the-system/'],
      ['Educational production and inventory management', 'View project', '/en/work/mpc-administracion/'],
    ],
    scopeHeading: 'Publication scope',
    finalHeading: 'Need to solve something similar?',
    finalAction: 'Discuss your project',
    forbiddenTaxonomy: ['Production solutions', 'FURLANICH Lab', 'Functional prototypes'],
  },
};

const detailRequirements = {
  'proyectos/general-reservation-system/index.html': {
    route: '/proyectos/general-reservation-system/',
    title: 'Gestión de reservas para transporte de pasajeros',
    headerSummary: 'Implementación de referencia para coordinar reservas de transporte de pasajeros.',
    evidenceStatement: 'Evidencia de implementación basada en el repositorio público',
    visual: '/projects/general-reservation-system/conceptual-workflow.webp',
    alt: 'Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros.',
    source: 'https://github.com/Furlanich/GeneralReservationSystem',
    limitation: 'La demo documentada devolvía 404;',
    relatedService: '/servicios/#web',
    contact: '/contacto/',
    alternate: '/en/work/general-reservation-system/',
    headings: ['Evidencia del proyecto', 'Alcance implementado', 'Capacidades', 'Resultado y estado', 'Evidencia pública', 'Limitaciones y alcance', 'Servicio relacionado'],
  },
  'proyectos/the-system/index.html': {
    route: '/proyectos/the-system/',
    title: 'Gestión multiusuario de campañas de rol',
    headerSummary: 'Laboratorio de aplicación web para organizar campañas de rol',
    evidenceStatement: 'Evidencia de implementación basada en el repositorio público',
    visual: '/projects/the-system/conceptual-access-model.webp',
    alt: 'Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción.',
    source: 'https://github.com/Furlanich/The-System',
    limitation: 'No hay demo pública ni verificación de ejecución actual;',
    relatedService: '/servicios/#web',
    contact: '/contacto/',
    alternate: '/en/work/the-system/',
    headings: ['Evidencia del proyecto', 'Alcance implementado', 'Capacidades', 'Resultado y estado', 'Evidencia pública', 'Limitaciones y alcance', 'Servicio relacionado'],
  },
  'proyectos/mpc-administracion/index.html': {
    route: '/proyectos/mpc-administracion/',
    title: 'Gestión educativa de producción y stock',
    headerSummary: 'Prototipo educativo grupal de administración de producción y stock',
    evidenceStatement: 'Evidencia de implementación basada en el repositorio público',
    visual: '/projects/mpc-administracion/conceptual-operations-model.webp',
    alt: 'Diagrama conceptual de producción, stock, administración de usuarios, registros y datos de maduración para una organización ficticia.',
    source: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-',
    limitation: 'El proyecto es trabajo grupal de 2021',
    relatedService: '/servicios/#web',
    contact: '/contacto/',
    alternate: '/en/work/mpc-administracion/',
    headings: ['Evidencia del proyecto', 'Alcance implementado', 'Capacidades', 'Resultado y estado', 'Evidencia pública', 'Limitaciones y alcance', 'Servicio relacionado'],
  },
  'en/work/general-reservation-system/index.html': {
    route: '/en/work/general-reservation-system/',
    title: 'Passenger transport reservation management',
    headerSummary: 'Reference implementation for coordinating passenger transport reservations.',
    evidenceStatement: 'Implementation evidence based on the public repository',
    visual: '/projects/general-reservation-system/conceptual-workflow.webp',
    alt: 'Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service.',
    source: 'https://github.com/Furlanich/GeneralReservationSystem',
    limitation: 'The documented demo returned 404;',
    relatedService: '/en/services/#web',
    contact: '/en/contact/',
    alternate: '/proyectos/general-reservation-system/',
    headings: ['Project evidence', 'Implemented scope', 'Capabilities', 'Result and current state', 'Public evidence', 'Limitations and scope', 'Related service'],
  },
  'en/work/the-system/index.html': {
    route: '/en/work/the-system/',
    title: 'Multi-user role-playing campaign management',
    headerSummary: 'Web-application laboratory for organizing role-playing campaigns',
    evidenceStatement: 'Implementation evidence based on the public repository',
    visual: '/projects/the-system/conceptual-access-model.webp',
    alt: 'Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries.',
    source: 'https://github.com/Furlanich/The-System',
    limitation: 'There is no public demo or current runtime verification;',
    relatedService: '/en/services/#web',
    contact: '/en/contact/',
    alternate: '/proyectos/the-system/',
    headings: ['Project evidence', 'Implemented scope', 'Capabilities', 'Result and current state', 'Public evidence', 'Limitations and scope', 'Related service'],
  },
  'en/work/mpc-administracion/index.html': {
    route: '/en/work/mpc-administracion/',
    title: 'Educational production and inventory management',
    headerSummary: 'Educational group prototype for production and inventory administration',
    evidenceStatement: 'Implementation evidence based on the public repository',
    visual: '/projects/mpc-administracion/conceptual-operations-model.webp',
    alt: 'Conceptual diagram of production, inventory, user administration, logs, and curing data for a fictional organization.',
    source: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-',
    limitation: 'The project is 2021 group work',
    relatedService: '/en/services/#web',
    contact: '/en/contact/',
    alternate: '/proyectos/mpc-administracion/',
    headings: ['Project evidence', 'Implemented scope', 'Capabilities', 'Result and current state', 'Public evidence', 'Limitations and scope', 'Related service'],
  },
};

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function hasHeading(html, level, text) {
  return new RegExp(`<${level}\\b[^>]*>${escapeRegExp(text)}</${level}>`).test(html);
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

  const forbidden = [
    /https?:\/\/[^\"]*(?:general.?reservation|reservation.?system)/i,
    /Busesfy|ChronoApp|MPC Administración|Documancer/i,
    /<img\b/i,
    /project-card|case-study|testimonial|client-logo|metric-card/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(html)) failures.push(`${artifact.file}: forbidden public evidence or route content matched ${pattern}`);
  }
}

function assertProjectsArtifact(artifact, html) {
  const requirement = projectsRequirements[artifact.file];
  if (!requirement) return;
  if (countMatches(html, /<main\b/g) !== 1) failures.push(`${artifact.file}: expected exactly one main landmark`);
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }
  if (!html.includes(requirement.introduction)) failures.push(`${artifact.file}: missing approved introduction`);
  let previousCardPosition = -1;
  for (const [title, action, href] of requirement.cards) {
    const cardPosition = html.indexOf(title);
    if (cardPosition === -1 || cardPosition <= previousCardPosition) {
      failures.push(`${artifact.file}: cards are missing or out of approved order`);
    }
    previousCardPosition = cardPosition;
    if (!html.includes(action)) failures.push(`${artifact.file}: missing card action ${action}`);
    const expectedReference = href.startsWith('/') ? expectedHref(href) : href;
    if (!html.includes(`href="${expectedReference}"`)) failures.push(`${artifact.file}: missing project link ${expectedReference}`);
  }
  if (countMatches(html, /<article\b/g) !== 3) failures.push(`${artifact.file}: expected exactly three project cards`);
  if (!hasHeading(html, 'h2', requirement.scopeHeading)) failures.push(`${artifact.file}: missing publication scope heading`);
  if (!hasHeading(html, 'h2', requirement.finalHeading)) failures.push(`${artifact.file}: missing final CTA heading`);
  if (!html.includes(requirement.finalAction)) failures.push(`${artifact.file}: missing final CTA action`);
  for (const taxonomy of requirement.forbiddenTaxonomy) {
    if (new RegExp(`<h3\\b[^>]*>${escapeRegExp(taxonomy)}</h3>`).test(html)) {
      failures.push(`${artifact.file}: empty taxonomy group rendered: ${taxonomy}`);
    }
  }
  if (countMatches(html, /<img\b/gi) > 0) failures.push(`${artifact.file}: unexpected image in image-free index`);
  const firstArticle = html.indexOf('<article');
  const firstArticleClose = html.indexOf('</article>', firstArticle);
  const nestedArticle = firstArticle !== -1 && html.indexOf('<article', firstArticle + 1) < firstArticleClose;
  if (nestedArticle) failures.push(`${artifact.file}: nested project cards`);
}

function assertProjectDetailArtifact(artifact, html) {
  const requirement = detailRequirements[artifact.file];
  if (!requirement) return;
  if (countMatches(html, /<main\b/g) !== 1) failures.push(`${artifact.file}: expected exactly one main landmark`);
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.title)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }
  for (const text of [requirement.headerSummary, requirement.evidenceStatement, requirement.limitation]) {
    if (!html.includes(text)) failures.push(`${artifact.file}: missing approved detail text "${text}"`);
  }
  let previousHeadingPosition = -1;
  for (const heading of requirement.headings) {
    const position = html.indexOf(heading);
    if (position === -1 || position <= previousHeadingPosition) failures.push(`${artifact.file}: detail sections are missing or out of order`);
    previousHeadingPosition = position;
  }
  const expectedImage = expectedHref(requirement.visual);
  if (!html.includes(expectedImage) || !html.includes(`alt="${requirement.alt}"`)) {
    failures.push(`${artifact.file}: missing approved conceptual visual or alt text`);
  }
  if (!html.includes(`href="${requirement.source}"`) || !html.includes(requirement.source)) {
    failures.push(`${artifact.file}: missing approved public repository evidence link`);
  }
  for (const route of [requirement.relatedService, requirement.contact, requirement.alternate]) {
    const expected = expectedHref(route);
    if (!html.includes(`href="${expected}"`)) failures.push(`${artifact.file}: missing internal detail reference ${expected}`);
  }
  if (countMatches(html, /<img\b/gi) !== 1) failures.push(`${artifact.file}: expected exactly one conceptual visual`);
  if (/Busesfy|ChronoApp|Documancer|PRIVATE|FOUNDER-ONLY|BLOCKED-|functional-demonstration/i.test(html)) {
    failures.push(`${artifact.file}: forbidden non-public or unsupported evidence matched`);
  }
  if (/public\/projects\/.*\.svg|projects\/(?:Busesfy|MPC-Administracion|GRS)\.svg/i.test(html)) {
    failures.push(`${artifact.file}: legacy project asset referenced`);
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

const exportedTextFiles = await collectTextFiles(outputRoot);
for (const filePath of exportedTextFiles) {
  const source = await readFile(filePath, 'utf8');
  const file = relative(outputRoot, filePath);
  if (/Busesfy|ChronoApp|Documancer|FOUNDER-ONLY|BLOCKED-|PROJECT-(?:GRS|THE-SYSTEM|MPC-ADMIN)/i.test(source)) {
    failures.push(`${file}: blocked, private, retired, or internal project identity leaked into exported payload`);
  }
  if (/(?:Busesfy|MPC-Administracion|AI-Scheduler|GRS|Documancer|atlas|pulse|vertex)\.svg/i.test(source)) {
    failures.push(`${file}: retired legacy project asset name leaked into exported payload`);
  }
}

const internalReferences = allHtml.flatMap(({ artifact, html }) =>
  getInternalReferences(html).map((value) => ({ artifact: artifact.file, value })),
);

for (const { artifact, html } of allHtml) {
  assertServicesArtifact(artifact, html);
  assertProjectsArtifact(artifact, html);
  assertProjectDetailArtifact(artifact, html);
  const requirement = homepageRequirements[artifact.file];
  if (!requirement) continue;

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

  for (const reference of requirement.requiredReferences) {
    const expectedReference = reference.startsWith('/') ? expectedHref(reference) : reference;
    if (!html.includes(`href="${expectedReference}"`)) {
      failures.push(`${artifact.file}: missing required homepage reference ${expectedReference}`);
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
