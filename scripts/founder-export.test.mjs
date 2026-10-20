import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runVerifier } from './export-test-support.mjs';
import { founderRequirements } from './export-requirements/founder.mjs';
import { createExportServer } from './serve-static-export.mjs';

// PLAN-SFC-V1 Task 7: drive the real static-export verifier against a fixture so Founder source and order
// stay owned here without changing the shared verifier. The real root/base exports remain a separate gate.
// PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE: the localized CV downloads, the three-entry experience list and the
// legacy-CV removal are asserted against literal values so a content or verifier regression cannot hide.
const modules = {
  es: { file: 'estudio/samuel-furlanich/index.html', path: '../app/(es)/_content/founder.ts', lang: 'es-AR' },
  en: { file: 'en/about/samuel-furlanich/index.html', path: '../app/(en)/en/_content/founder.ts', lang: 'en' },
};

const literalCv = {
  es: { path: '/Samuel-Furlanich-CV-ES.pdf', downloadName: 'Samuel-Furlanich-CV-ES.pdf', file: 'Samuel-Furlanich-CV-ES.pdf' },
  en: { path: '/Samuel-Furlanich-CV-EN.pdf', downloadName: 'Samuel-Furlanich-CV-EN.pdf', file: 'Samuel-Furlanich-CV-EN.pdf' },
};
const employer = 'CleverSoft S.A.';

const pdfBytes = {
  es: Buffer.from('%PDF-1.7\nSpanish Founder CV fixture'),
  en: Buffer.from('%PDF-1.7\nEnglish Founder CV fixture'),
};

const contents = {};
for (const [locale, definition] of Object.entries(modules)) {
  contents[locale] = (await import(definition.path)).founderContent;
}

function expectedSections(content) {
  return [
    content.biography.heading,
    content.professionalLinks.heading,
    content.experience.heading,
    content.education.heading,
    content.capabilities.heading,
    content.projectsBridge.heading,
    content.finalCta.heading,
  ];
}

function experienceEntry({ period, role, context, summary }) {
  return `<li data-founder-experience-entry><p data-founder-period>${period}</p><div><h3>${role}</h3><p>${context}</p><p>${summary}</p></div></li>`;
}

const approvedEntries = [
  { period: 'Since June 2026', role: 'Software Developer', context: employer, summary: 'Joined as a Support Analyst.' },
  { period: 'Since 2024', role: 'Independent software development', context: 'Professional practice', summary: 'Independent work.' },
  { period: '2021', role: 'IT Technician professional internship', context: 'E.E.S.T. No. 1, Chivilcoy', summary: 'Internship.' },
];

function founderHtml(
  locale,
  {
    sections = founderRequirements[modules[locale].file].sections,
    image = false,
    basePath = '',
    cvAnchor,
    entries = approvedEntries.map(experienceEntry),
    biography = `Biography includes ${employer}.`,
  } = {},
) {
  const { file, lang } = modules[locale];
  const requirement = founderRequirements[file];
  const experience = sections[2];
  const education = sections[3];
  const capabilities = sections[4];
  const projects = sections[5];
  const final = sections[6];
  const capabilityGroups = Array.from({ length: 4 }, (_, index) =>
    `<section data-founder-capability-group aria-labelledby="founder-capability-${index}"><h3 id="founder-capability-${index}">Group ${index}</h3></section>`,
  ).join('');
  const requiredLinks = [
    `<a href="${basePath}${requirement.projects}#site-top">Projects</a>`,
    `<a href="${basePath}${requirement.contact}">Contact</a>`,
    cvAnchor ?? `<a href="${basePath}${literalCv[locale].path}" download="${literalCv[locale].downloadName}">CV</a>`,
    '<a href="https://www.linkedin.com/in/samuel-furlanich/">LinkedIn</a>',
    '<a href="https://github.com/Furlanich">GitHub</a>',
    `<a href="https://github.com/Furlanich/MilkyPantsCheese-Administracion-">${requirement.mpcAction}</a>`,
  ].join('');

  return [
    `<!doctype html><html lang="${lang}"><body><main>`,
    `<h1>${requirement.heading}</h1>`,
    sections.map((heading) => `<h2>${heading}</h2>`).join(''),
    `<p>${biography}</p><ol>${entries.join('')}</ol>`,
    `<p>${experience}</p><p>${education}</p><h3>${requirement.mpc}</h3>`,
    `<p>${capabilities}</p>${capabilityGroups}<p>${projects}</p><p>${final}</p>`,
    requiredLinks,
    image ? '<img src="/portrait.png" alt="Samuel Furlanich">' : '',
    '</main></body></html>',
  ].join('');
}

// One fixture export: the page under test plus both localized PDFs, so only the deliberate defect fails.
function founderFiles(locale, options = {}, extra = {}) {
  return {
    [modules[locale].file]: founderHtml(locale, options),
    [literalCv.es.file]: pdfBytes.es,
    [literalCv.en.file]: pdfBytes.en,
    ...extra,
  };
}

const founderOwned = /Founder|portrait|main landmark|approved visible H1/;

function founderMessages(files, basePath = '') {
  return runVerifier({ files, basePath }).output
    .split('\n')
    .filter((line) => line.startsWith('- ') && Object.values(modules).some(({ file }) => line.startsWith(`- ${file}:`)) && founderOwned.test(line));
}

function assertRejects(messages, fragment) {
  assert.ok(messages.some((line) => line.includes(fragment)), `expected "${fragment}" in:\n${messages.join('\n')}`);
}

for (const [locale, definition] of Object.entries(modules)) {
  const cv = literalCv[locale];

  test(`${locale} Founder export requirements follow the approved content sequence`, () => {
    assert.equal(founderRequirements[definition.file].heading, contents[locale].header.name);
    assert.deepEqual(founderRequirements[definition.file].sections, expectedSections(contents[locale]));
  });

  test(`${locale} Founder export requirements name the localized CV and the employer`, () => {
    const requirement = founderRequirements[definition.file];
    assert.equal(requirement.cv, cv.path);
    assert.equal(requirement.cvDownloadName, cv.downloadName);
    assert.equal(requirement.employer, employer);
  });

  test(`${locale} Founder export accepts the complete approved profile`, () => {
    assert.deepEqual(founderMessages(founderFiles(locale)), []);
  });

  test(`${locale} Founder export accepts the complete approved profile under the /Portfolio base path`, () => {
    assert.deepEqual(founderMessages(founderFiles(locale, { basePath: '/Portfolio' }), '/Portfolio'), []);
  });

  test(`${locale} Founder export rejects a doubled /Portfolio prefix on the CV link`, () => {
    const cvAnchor = `<a href="/Portfolio/Portfolio${cv.path}" download="${cv.downloadName}">CV</a>`;
    const messages = founderMessages(founderFiles(locale, { basePath: '/Portfolio', cvAnchor }), '/Portfolio');
    assertRejects(messages, 'missing Founder reference');
  });

  test(`${locale} Founder export rejects professional links before the complete biography`, () => {
    const approved = expectedSections(contents[locale]);
    const oldOrder = approved.slice();
    [oldOrder[0], oldOrder[1]] = [oldOrder[1], oldOrder[0]];
    const messages = founderMessages(founderFiles(locale, { sections: oldOrder }));
    assert.ok(messages.some((line) => line.includes('Founder sections are missing or out of approved order')), messages.join('\n'));
  });

  test(`${locale} Founder export rejects a portrait or other page image`, () => {
    const messages = founderMessages(founderFiles(locale, { image: true }));
    assert.ok(messages.some((line) => line.includes('unexpected Founder portrait or media')), messages.join('\n'));
  });

  test(`${locale} Founder export rejects a CV link with a wrong download name`, () => {
    const cvAnchor = `<a href="${cv.path}" download="Samuel-Furlanich-CV.pdf">CV</a>`;
    assertRejects(founderMessages(founderFiles(locale, { cvAnchor })), 'Founder CV link must pair');
  });

  test(`${locale} Founder export rejects a CV link without a download attribute`, () => {
    const cvAnchor = `<a href="${cv.path}">CV</a>`;
    assertRejects(founderMessages(founderFiles(locale, { cvAnchor })), 'Founder CV link must pair');
  });

  test(`${locale} Founder export rejects a download attribute on a different element than the CV href`, () => {
    const cvAnchor = `<a href="${cv.path}">CV</a><a href="https://github.com/Furlanich" download="${cv.downloadName}">GitHub copy</a>`;
    assertRejects(founderMessages(founderFiles(locale, { cvAnchor })), 'Founder CV link must pair');
  });

  test(`${locale} Founder export rejects a missing CV file`, () => {
    const files = founderFiles(locale);
    delete files[cv.file];
    assertRejects(founderMessages(files), 'Founder CV file is missing from the export');
  });

  test(`${locale} Founder export rejects a CV file that is not a PDF`, () => {
    const files = founderFiles(locale, {}, { [cv.file]: Buffer.from('<html>not a pdf</html>') });
    assertRejects(founderMessages(files), 'Founder CV file is not a PDF');
  });

  test(`${locale} Founder export rejects the same CV bytes behind both locales`, () => {
    const files = founderFiles(locale, {}, { [literalCv.es.file]: pdfBytes.es, [literalCv.en.file]: pdfBytes.es });
    assertRejects(founderMessages(files), 'Founder CV files must differ between locales');
  });

  test(`${locale} Founder export rejects a surviving legacy CV file`, () => {
    const files = founderFiles(locale, {}, { 'Samuel-Furlanich-CV.pdf': Buffer.from('%PDF-1.7\nlegacy') });
    assertRejects(founderMessages(files), 'Founder legacy CV file must not be exported');
  });

  test(`${locale} Founder export rejects a reference to the legacy CV path`, () => {
    const files = founderFiles(locale, {}, { 'legacy-reference.txt': 'see /Samuel-Furlanich-CV.pdf' });
    assertRejects(founderMessages(files), 'Founder legacy CV path must not be referenced');
  });

  test(`${locale} Founder export rejects the legacy employer spelling`, () => {
    const biography = 'Biography includes Clever Soft SA.';
    assertRejects(founderMessages(founderFiles(locale, { biography })), 'Founder employer must be spelled CleverSoft S.A.');
  });

  test(`${locale} Founder export rejects fewer than three experience entries`, () => {
    const entries = approvedEntries.slice(1).map(experienceEntry);
    assertRejects(founderMessages(founderFiles(locale, { entries })), 'expected exactly three Founder experience entries');
  });

  test(`${locale} Founder export rejects the employer outside the first experience entry`, () => {
    const [first, second, third] = approvedEntries;
    const entries = [{ ...first, context: 'Another employer' }, { ...second, context: employer }, third].map(experienceEntry);
    assertRejects(founderMessages(founderFiles(locale, { entries })), 'Founder employer must appear inside the first experience entry');
  });

  test(`${locale} Founder export rejects the employer as a heading`, () => {
    const entries = approvedEntries.map((entry, index) => experienceEntry(index === 0 ? { ...entry, role: employer } : entry));
    assertRejects(founderMessages(founderFiles(locale, { entries })), 'Founder employer must not be a heading');
  });
}

test('the static export server serves each localized Founder CV with the PDF content type', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'sfc-founder-cv-'));
  for (const locale of ['es', 'en']) writeFileSync(path.join(directory, literalCv[locale].file), pdfBytes[locale]);
  const server = createExportServer({ root: directory, basePath: '/Portfolio' });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  try {
    for (const locale of ['es', 'en']) {
      const response = await fetch(`http://127.0.0.1:${address.port}/Portfolio${literalCv[locale].path}`);
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type') ?? '', /application\/pdf/i);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), pdfBytes[locale]);
    }
    const legacy = await fetch(`http://127.0.0.1:${address.port}/Portfolio/Samuel-Furlanich-CV.pdf`);
    assert.equal(legacy.status, 404);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    rmSync(directory, { recursive: true, force: true });
  }
});
