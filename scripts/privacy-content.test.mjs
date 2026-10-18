import test from 'node:test';
import assert from 'node:assert/strict';
import { privacyRequirements } from './export-requirements/privacy.mjs';
for (const [locale, root, file] of [['es', '../app/(es)', 'privacidad/index.html'], ['en', '../app/(en)/en', 'en/privacy/index.html']]) {
  test(locale + ' Privacy describes direct messages and current hosting without a form activation gate', async () => {
    const { privacyContent: content } = await import(root + '/_content/privacy.ts');
    assert.equal(content.locale, locale);
    assert.equal(content.sections[0].id, 'responsible-party');
    assert.match(JSON.stringify(content), /Samuel Furlanich/);
    assert.match(JSON.stringify(content), /Gmail/);
    assert.match(JSON.stringify(content), /WhatsApp/);
    assert.match(JSON.stringify(content), /GitHub Pages/);
    assert.doesNotMatch(JSON.stringify(content), /Formspree|simula|demonstration|professional review|revisión profesional|30 días|30 days|12 meses|12 months/i);
    assert.deepEqual(privacyRequirements[file].sectionIds, content.sections.map(s => s.id));
    assert.deepEqual(privacyRequirements[file].sections, content.sections.map(s => s.heading));
  });
}
