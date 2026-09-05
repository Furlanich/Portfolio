import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(projectRoot, '..', 'out');
const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const artifacts = [
  { route: '/', file: 'index.html', lang: 'es-AR' },
  { route: '/servicios/', file: 'servicios/index.html', lang: 'es-AR' },
  { route: '/contacto/', file: 'contacto/index.html', lang: 'es-AR' },
  { route: '/estudio/samuel-furlanich/', file: 'estudio/samuel-furlanich/index.html', lang: 'es-AR' },
  { route: '/en/', file: 'en/index.html', lang: 'en' },
  { route: '/en/services/', file: 'en/services/index.html', lang: 'en' },
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
    /href="[^\"]*(?:proyectos|projects|work)(?:\/|\")/i,
    /https?:\/\/[^\"]*(?:general.?reservation|reservation.?system)/i,
    /Busesfy|ChronoApp|MPC Administración|Documancer/i,
    /<img\b/i,
    /project-card|case-study|testimonial|client-logo|metric-card/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(html)) failures.push(`${artifact.file}: forbidden public evidence or route content matched ${pattern}`);
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

const failures = [];
const allHtml = [];

for (const artifact of artifacts) {
  const filePath = join(outputRoot, artifact.file);

  try {
    const html = await readFile(filePath, 'utf8');
    allHtml.push({ artifact, html });

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

const internalReferences = allHtml.flatMap(({ artifact, html }) =>
  getInternalReferences(html).map((value) => ({ artifact: artifact.file, value })),
);

for (const { artifact, html } of allHtml) {
  assertServicesArtifact(artifact, html);
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
