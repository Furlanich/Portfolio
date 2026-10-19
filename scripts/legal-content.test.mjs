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
// The release publishes both documents with their actual update date (the owner-approved text was
// finalized on 2026-10-18); this is the only place the expected value is restated on purpose.
const releaseDate = { es: '18 de octubre de 2026', en: 'October 18, 2026' };

test('Terms publication is part of the coordinated release', async () => {
  const { access } = await import('node:fs/promises');
  for (const path of ['../app/(es)/terminos/page.tsx', '../app/(en)/en/terms/page.tsx']) await access(new URL(path, import.meta.url));
});

for (const [locale, root] of [['es', '../app/(es)'], ['en', '../app/(en)/en']]) {
  test(locale + ' Privacy renders the canonical sections, update date and reciprocal Terms link', async () => {
    const { legalContent: canonical } = await import(root + '/_content/commercial/privacy.ts');
    const { privacyContent } = await import(root + '/_content/privacy.ts');
    assert.deepEqual(privacyContent.sections, canonical.sections, 'one source of section copy');
    assert.equal(privacyContent.heading, canonical.title);
    assert.equal(privacyContent.updatedLabel, canonical.chrome.updateLabel);
    assert.equal(privacyContent.updatedAt, releaseDate[locale]);
    assert.deepEqual(privacyContent.termsLink, { label: canonical.chrome.reciprocalLabel, href: canonical.chrome.reciprocalHref });
  });

  test(locale + ' Terms page declares the canonical update date and localized Privacy reciprocal link', async () => {
    const { readFile } = await import('node:fs/promises');
    const { legalContent: canonical } = await import(root + '/_content/commercial/terms.ts');
    const page = await readFile(new URL(root + (locale === 'es' ? '/terminos' : '/terms') + '/page.tsx', import.meta.url), 'utf8');
    assert.ok(page.includes(JSON.stringify(releaseDate[locale])) || page.includes("'" + releaseDate[locale] + "'"), 'page owns the actual update date');
    assert.match(page, /updatedLabel: legalContent\.chrome\.updateLabel/);
    assert.match(page, /withBasePath\(legalContent\.chrome\.reciprocalHref\)/);
    assert.match(page, /label: legalContent\.chrome\.reciprocalLabel/);
    assert.match(canonical.chrome.reciprocalHref, locale === 'es' ? /^\/privacidad\/$/ : /^\/en\/privacy\/$/);
  });
}
