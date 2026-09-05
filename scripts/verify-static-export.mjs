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
