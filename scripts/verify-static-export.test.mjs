import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 11 / L-04: `verify-static-export.mjs` must require the
// HOME-IMPACT section ("Position fix", id `impact`) between Services and Proof, with its exact
// approved heading. These tests drive the real verifier against a fixture export
// (`STATIC_EXPORT_DIR`) so they need no build. The verifier reports every other missing route as
// well; each test asserts only on the Home messages it cares about.

const { homeContent: spanish } = await import('../app/(es)/_content/home.ts');
const { homeContent: english } = await import('../app/(en)/en/_content/home.ts');

const verifier = path.join(process.cwd(), 'scripts/verify-static-export.mjs');

const locales = {
  es: { content: spanish, file: 'index.html', lang: 'es-AR', processId: 'proceso' },
  en: { content: english, file: 'en/index.html', lang: 'en', processId: 'process' },
};

/** Home sections in the approved order, as [sectionId, headingId, heading]. */
function homeSections({ content, processId }) {
  return [
    ['problems', 'problems-heading', content.problems.heading],
    ['services', 'services-heading', content.servicesSection.heading],
    ['impact', 'impact-heading', content.impact.heading],
    ['proof', 'proof-heading', content.proof.heading],
    [processId, `${processId}-heading`, content.process.heading],
    ['founder', 'founder-heading', content.founderSection.heading],
    ['cta', 'cta-heading', content.cta.heading],
  ];
}

function homeHtml(locale, transform = (sections) => sections) {
  const { content, lang } = locale;
  const chapters = content.instrument.chapters
    .map((chapter) => `<section data-instrument-chapter="${chapter.id}"><h2>${chapter.heading}</h2><p>${chapter.description}</p></section>`)
    .join('');
  const sections = transform(homeSections(locale))
    .map(([id, headingId, heading]) => `<section id="${id}" aria-labelledby="${headingId}"><h2 id="${headingId}">${heading}</h2></section>`)
    .join('');
  return [
    `<!doctype html><html lang="${lang}"><body>`,
    '<div data-environment-ground style="background-image:url(&quot;/brand/sky-chart/environment-wide.webp&quot;),url(&quot;/brand/sky-chart/environment-compact.webp&quot;)"></div>',
    `<main>${chapters}${sections}</main>`,
    '</body></html>',
  ].join('');
}

function runVerifier(transform) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-static-export-'));
  try {
    for (const locale of Object.values(locales)) {
      const target = path.join(directory, locale.file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, homeHtml(locale, transform));
    }
    const result = spawnSync(process.execPath, [verifier], {
      env: { ...process.env, STATIC_EXPORT_DIR: directory, NEXT_PUBLIC_BASE_PATH: '' },
      encoding: 'utf8',
    });
    return `${result.stdout}\n${result.stderr}`;
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

const withoutImpact = (sections) => sections.filter(([id]) => id !== 'impact');

for (const [name, locale] of Object.entries(locales)) {
  test(`${name} Home export without the impact section fails verification`, () => {
    const output = runVerifier(withoutImpact);
    assert.match(output, new RegExp(`${locale.file.replace('.', '\\.')}: missing homepage section id "impact"`));
    assert.match(output, new RegExp(`${locale.file.replace('.', '\\.')}: missing homepage heading id "impact-heading"`));
  });
}

test('Home export with the impact section in the approved position passes the impact checks', () => {
  const output = runVerifier();
  assert.doesNotMatch(output, /"impact"|impact-heading/);
  assert.doesNotMatch(output, /homepage section ".*" is out of order/);
});

test('Home export with impact after Proof reports the order violation', () => {
  const output = runVerifier((sections) => {
    const rest = sections.filter(([id]) => id !== 'impact');
    const impact = sections.find(([id]) => id === 'impact');
    const proofIndex = rest.findIndex(([id]) => id === 'proof');
    return [...rest.slice(0, proofIndex + 1), impact, ...rest.slice(proofIndex + 1)];
  });
  assert.match(output, /homepage section "(?:impact|proof)" is out of order/);
});

test('Home export whose impact heading text differs from the approved copy fails', () => {
  const output = runVerifier((sections) => sections.map((entry) => (entry[0] === 'impact' ? [entry[0], entry[1], 'Impacto medido'] : entry)));
  assert.match(output, /missing visible homepage heading "(?:Menos lugares|Fewer places)/);
});
