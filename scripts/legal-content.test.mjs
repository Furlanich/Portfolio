import test from 'node:test';
import assert from 'node:assert/strict';
test('both legal copy pairs are owned direct-contact text without processor or counsel activation gates', async () => {
  for (const root of ['../app/(es)', '../app/(en)/en']) {
    for (const route of ['privacy', 'terms']) {
      const { legalContent: content } = await import(root + '/_content/commercial/' + route + '.ts');
      assert.equal('publication' in content, false, 'legal copy has no special processor/counsel activation gate');
      assert.equal(content.routeId, route);
      assert.ok(content.sections.length >= 6);
      assert.doesNotMatch(JSON.stringify(content), /Formspree|professional-review|nonpublishable|formulario|\bform\b/i);
    }
  }
});
test('Terms publication remains assigned to the coordinated release', async () => {
  const { access } = await import('node:fs/promises');
  for (const path of ['../app/(es)/terminos/page.tsx', '../app/(en)/en/terms/page.tsx']) await assert.rejects(access(new URL(path, import.meta.url)));
});
