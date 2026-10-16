import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerifier } from './export-test-support.mjs';
import { studioRequirements } from './export-requirements/studio.mjs';

// PLAN-SFC-V1 Task 6: the Studio pair's export expectations, owned by scripts/export-requirements/studio.mjs
// and enforced by the shared verifier. These tests drive the real verifier against a small fixture export
// (STATIC_EXPORT_DIR), so they need no build. The verifier reports every other missing route as well; each
// test asserts only on the Studio messages.

const modules = {
  'estudio/index.html': { path: '../app/(es)/_content/studio.ts', lang: 'es-AR', contact: '/contacto/', founder: '/estudio/samuel-furlanich/', other: '/en/about/' },
  'en/about/index.html': { path: '../app/(en)/en/_content/studio.ts', lang: 'en', contact: '/en/contact/', founder: '/en/about/samuel-furlanich/', other: '/estudio/' },
};

const contents = {};
for (const [file, definition] of Object.entries(modules)) {
  contents[file] = (await import(definition.path)).studioPageContent;
}

/** The headings and text the export must prove, in the Studio reading order. */
function expectedSections(content) {
  return [
    content.intro.positioning,
    content.sceneCaption,
    content.accountability.heading,
    content.collaboratorModel.heading,
    content.principles.heading,
    content.location.heading,
    content.founderBridge.heading,
    content.finalCta.heading,
  ];
}

function studioHtml(file, { sections = requirementSections(file), image = false } = {}) {
  const definition = modules[file];
  const requirement = studioRequirements[file];
  const links = requirement.references.map((route) => `<a href="${route}">link</a>`).join('');
  return [
    `<!doctype html><html lang="${definition.lang}"><body>`,
    `<main data-connected-page data-connected-route="studio"><h1>${requirement.heading}</h1>`,
    sections.map((text) => `<h2>${text}</h2>`).join(''),
    links,
    image ? '<img src="/x.png" alt="">' : '',
    '</main></body></html>',
  ].join('');
}

const requirementSections = (file) => studioRequirements[file].sections;

// The shared verifier also reports shell checks (header, footer, language) that a bare fixture does not model,
// so only the messages that Studio's own requirements produce are compared.
const studioOwned = /main landmark|approved visible H1|Studio sections|Studio reference|Studio image/;

function studioMessages(files) {
  const { output } = runVerifier({ files });
  return output
    .split('\n')
    .filter((line) => /^- (estudio\/index\.html|en\/about\/index\.html): /.test(line) && studioOwned.test(line));
}

for (const [file, definition] of Object.entries(modules)) {
  test(`${file} requirements follow the approved Studio sequence from the content module`, () => {
    const content = contents[file];
    const requirement = studioRequirements[file];

    assert.equal(requirement.heading, content.intro.heading);
    assert.deepEqual(requirement.sections, expectedSections(content));
    assert.deepEqual(
      requirement.references.slice().sort(),
      [definition.contact, definition.founder, definition.other].sort(),
    );
  });

  test(`${file} accepts a Studio page that follows the approved sequence`, () => {
    assert.deepEqual(studioMessages({ [file]: studioHtml(file) }), []);
  });

  test(`${file} rejects a Studio page that lost its graph caption`, () => {
    const sections = requirementSections(file).filter((text) => text !== contents[file].sceneCaption);
    const messages = studioMessages({ [file]: studioHtml(file, { sections }) });
    assert.ok(messages.some((line) => line.includes('Studio sections are missing or out of approved order')), messages.join('\n'));
  });

  test(`${file} rejects a Studio page that moves the collaborator subsection before accountability`, () => {
    const sections = requirementSections(file).slice();
    const [accountability, collaborator] = [sections.indexOf(contents[file].accountability.heading), sections.indexOf(contents[file].collaboratorModel.heading)];
    [sections[accountability], sections[collaborator]] = [sections[collaborator], sections[accountability]];
    const messages = studioMessages({ [file]: studioHtml(file, { sections }) });
    assert.ok(messages.some((line) => line.includes('out of approved order')), messages.join('\n'));
  });

  test(`${file} rejects a Studio page that renders an image`, () => {
    const messages = studioMessages({ [file]: studioHtml(file, { image: true }) });
    assert.ok(messages.some((line) => line.includes('unexpected Studio image')), messages.join('\n'));
  });
}
