import { readFile as readText } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const specifications = [
  { locale: 'es', routeId: 'privacy', document: '../docs/product/pages/contact-and-privacy.md', module: '../app/(es)/_content/commercial/privacy.ts' },
  { locale: 'en', routeId: 'privacy', document: '../docs/product/pages/contact-and-privacy.md', module: '../app/(en)/en/_content/commercial/privacy.ts' },
  { locale: 'es', routeId: 'terms', document: '../docs/product/pages/terms-and-conditions.md', module: '../app/(es)/_content/commercial/terms.ts' },
  { locale: 'en', routeId: 'terms', document: '../docs/product/pages/terms-and-conditions.md', module: '../app/(en)/en/_content/commercial/terms.ts' },
];

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function readFence(source, locale) {
  const start = '<!-- SFC-PUBLIC-COPY-' + locale.toUpperCase() + ':START -->';
  const end = '<!-- SFC-PUBLIC-COPY-' + locale.toUpperCase() + ':END -->';
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) return undefined;
  const bounded = source.slice(startIndex + start.length, endIndex);
  const json = bounded.match(/```json\s*([\s\S]*?)\s*```/);
  if (!json) return undefined;
  try { return JSON.parse(json[1]); } catch { return undefined; }
}

export async function checkSfcCopyContracts({ readFile = readText } = {}) {
  const checked = [];
  const mismatches = [];
  for (const specification of specifications) {
    const documentPath = new URL(specification.document, import.meta.url);
    const source = await readFile(documentPath, 'utf8');
    const canonical = readFence(source, specification.locale);
    let typed;
    try {
      const moduleUrl = new URL(specification.module, import.meta.url);
      typed = (await import(moduleUrl.href)).legalContent;
    } catch (error) {
      mismatches.push({ locale: specification.locale, routeId: specification.routeId, reason: 'typed source missing: ' + error.message });
      continue;
    }
    checked.push(specification.locale + '/' + specification.routeId);
    if (!canonical) {
      mismatches.push({ locale: specification.locale, routeId: specification.routeId, reason: 'bounded canonical JSON fence missing or invalid' });
    } else if (JSON.stringify(canonicalize(canonical)) !== JSON.stringify(canonicalize(typed))) {
      mismatches.push({ locale: specification.locale, routeId: specification.routeId, reason: 'canonical JSON and typed source differ' });
    }
  }
  return { checked, mismatches };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const result = await checkSfcCopyContracts();
  if (result.mismatches.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
  } else console.log('Checked canonical/typed SFC copy for ' + result.checked.join(', '));
}
