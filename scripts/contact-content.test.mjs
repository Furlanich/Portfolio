import test from 'node:test';
import assert from 'node:assert/strict';
for (const [locale, path] of [
  ['es', '../app/(es)/_content/contact.ts'],
  ['en', '../app/(en)/en/_content/contact.ts'],
]) {
  test(locale + ' Contact offers direct channels without an intake form or simulation', async () => {
    const { contactContent: content } = await import(path);
    assert.equal(content.locale, locale);
    assert.equal('form' in content, false, 'Contact must not collect form values');
    assert.equal('mode' in content, false, 'Direct channels do not select an inquiry adapter');
    assert.deepEqual(content.actions.map(({ kind, href }) => [kind, href]), [
      ['whatsapp', 'https://wa.me/5491150117565'],
      ['email', 'mailto:samuelfurlanich@gmail.com'],
      ['phone', 'tel:+5491150117565'],
    ]);
    assert.ok(content.channels.heading);
    assert.ok(content.channels.note);
    assert.ok(content.privacyLabel);
    assert.equal(content.founderContextAction.routeId, 'founder');
    assert.doesNotMatch(JSON.stringify(content), /Formspree|simula|demonstration|formulario|\bform\b|accepted for sending/i);
  });
}

// PLAN-SFC-V1 Task 22: DESIGN-SFC-V1 ("Composition data") and the Contact scene profile draw the three decorative
// words at n0, n4 and n8 (n0 and n4 on compact). The host follows the profile, so a binding on any other node id
// is never drawn.
const contactWords = {
  es: ['Contexto', 'Consulta', 'Conversación'],
  en: ['Context', 'Inquiry', 'Conversation'],
};
for (const [locale, path] of [
  ['es', '../app/(es)/_content/contact.ts'],
  ['en', '../app/(en)/en/_content/contact.ts'],
]) {
  test(locale + ' Contact binds its three decorative words to the nodes of its scene profile', async () => {
    const { contactContent: content } = await import(path);
    assert.deepEqual(
      content.wordBindings,
      ['n0', 'n4', 'n8'].map((nodeId, index) => ({ nodeId, word: contactWords[locale][index] })),
    );
  });
}
