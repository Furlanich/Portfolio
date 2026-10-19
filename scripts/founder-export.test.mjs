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
const modules = {
  es: { file: 'estudio/samuel-furlanich/index.html', path: '../app/(es)/_content/founder.ts', lang: 'es-AR' },
  en: { file: 'en/about/samuel-furlanich/index.html', path: '../app/(en)/en/_content/founder.ts', lang: 'en' },
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

function founderHtml(locale, { sections = founderRequirements[modules[locale].file].sections, image = false } = {}) {
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
    `<a href="${requirement.projects}#site-top">Projects</a>`,
    `<a href="${requirement.contact}">Contact</a>`,
    `<a href="${requirement.cv}">CV</a>`,
    '<a href="https://www.linkedin.com/in/samuel-furlanich/">LinkedIn</a>',
    '<a href="https://github.com/Furlanich">GitHub</a>',
    `<a href="https://github.com/Furlanich/MilkyPantsCheese-Administracion-">${requirement.mpcAction}</a>`,
  ].join('');

  return [
    `<!doctype html><html lang="${lang}"><body><main>`,
    `<h1>${requirement.heading}</h1>`,
    sections.map((heading) => `<h2>${heading}</h2>`).join(''),
    `<p>Biography includes Clever Soft SA.</p><ol><li data-founder-experience-entry>${experience}</li><li data-founder-experience-entry>${experience}</li></ol>`,
    `<p>${education}</p><h3>${requirement.mpc}</h3>`,
    `<p>${capabilities}</p>${capabilityGroups}<p>${projects}</p><p>${final}</p>`,
    requiredLinks,
    image ? '<img src="/portrait.png" alt="Samuel Furlanich">' : '',
    '</main></body></html>',
  ].join('');
}

const founderOwned = /Founder|portrait|main landmark|approved visible H1/;

function founderMessages(files) {
  return runVerifier({ files }).output
    .split('\n')
    .filter((line) => line.startsWith('- ') && Object.values(modules).some(({ file }) => line.startsWith(`- ${file}:`)) && founderOwned.test(line));
}

for (const [locale, definition] of Object.entries(modules)) {
  test(`${locale} Founder export requirements follow the approved content sequence`, () => {
    assert.equal(founderRequirements[definition.file].heading, contents[locale].header.name);
    assert.deepEqual(founderRequirements[definition.file].sections, expectedSections(contents[locale]));
  });

  test(`${locale} Founder export accepts the complete approved profile`, () => {
    assert.deepEqual(founderMessages({ [definition.file]: founderHtml(locale) }), []);
  });

  test(`${locale} Founder export rejects professional links before the complete biography`, () => {
    const approved = expectedSections(contents[locale]);
    const oldOrder = approved.slice();
    [oldOrder[0], oldOrder[1]] = [oldOrder[1], oldOrder[0]];
    const messages = founderMessages({ [definition.file]: founderHtml(locale, { sections: oldOrder }) });
    assert.ok(messages.some((line) => line.includes('Founder sections are missing or out of approved order')), messages.join('\n'));
  });

  test(`${locale} Founder export rejects a portrait or other page image`, () => {
    const messages = founderMessages({ [definition.file]: founderHtml(locale, { image: true }) });
    assert.ok(messages.some((line) => line.includes('unexpected Founder portrait or media')), messages.join('\n'));
  });
}

test('the static export server serves the Founder CV with the PDF content type', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'sfc-founder-cv-'));
  const pdfPath = path.join(directory, 'Samuel-Furlanich-CV.pdf');
  writeFileSync(pdfPath, Buffer.from('%PDF-1.7\nFounder CV fixture'));
  const server = createExportServer({ root: directory, basePath: '/Portfolio' });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/Portfolio/Samuel-Furlanich-CV.pdf`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') ?? '', /application\/pdf/i);
    assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0, 5).toString(), '%PDF-');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    rmSync(directory, { recursive: true, force: true });
  }
});
