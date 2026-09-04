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

function expectedHref(route) {
  return `${configuredBasePath}${route}`;
}

function getInternalReferences(html) {
  return [...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((value) => value.startsWith('/') && !value.startsWith('//'));
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
