import test from 'node:test';
import assert from 'node:assert/strict';

const modulePaths = [
  '../app/(es)/_content/commercial/privacy.ts',
  '../app/(es)/_content/commercial/terms.ts',
  '../app/(en)/en/_content/commercial/privacy.ts',
  '../app/(en)/en/_content/commercial/terms.ts',
];

test('commercial legal drafts stay typed, bilingual, and explicitly gated', async () => {
  const modules = await Promise.all(modulePaths.map((path) => import(path)));
  for (const [index, module] of modules.entries()) {
    const content = module.legalContent;
    assert.ok(content, modulePaths[index] + ' must export legalContent');
    assert.equal(content.publication.status, 'nonpublishable');
    assert.equal(content.publication.releaseGate, 'professional-review-and-factual-gates-open');
    assert.equal(content.locale, index < 2 ? 'es' : 'en');
    assert.ok(content.sections.length >= 7);
    assert.equal('updatedAt' in content, false, 'drafts must not invent an effective date');
    assert.ok(content.sections.every((section) => section.id && section.heading && section.paragraphs.length));
  }
  assert.deepEqual(modules.map(({ legalContent }) => legalContent.routeId), ['privacy', 'terms', 'privacy', 'terms']);
});

test('commercial legal content is not imported by public Privacy routes or exposed at Terms routes', async () => {
  const { readFile, access } = await import('node:fs/promises');
  for (const path of ['../app/(es)/privacidad/page.tsx', '../app/(en)/en/privacy/page.tsx']) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /_content\/commercial/);
  }
  for (const path of ['../app/(es)/terminos/page.tsx', '../app/(en)/en/terms/page.tsx']) {
    await assert.rejects(access(new URL(path, import.meta.url)));
  }
});
