import test from 'node:test';
import assert from 'node:assert/strict';

async function loadContent(modulePath) {
  try {
    return (await import(modulePath)).contactContent;
  } catch (error) {
    assert.fail('Contact content module is missing: ' + modulePath + ' (' + error.code + ')');
  }
}

const expectedFields = [
  ['name', 200, true],
  ['email', 508, true],
  ['company', 240, false],
  ['message', 8000, true],
];

test('owns the exact approved Spanish demonstration Contact content', async () => {
  const content = await loadContent('../app/(es)/_content/contact.ts');
  assert.equal(content.locale, 'es');
  assert.equal(content.routeId, 'contact');
  assert.equal(content.heading, 'Contanos qué necesitás resolver.');
  assert.equal(content.notice, undefined);
  assert.equal(content.form.submit, 'Simular envío');
  assert.equal(content.form.submitting, 'Simulando…');
  assert.deepEqual(content.form.fields.map(({ name, maxLength, required }) => [name, maxLength, required]), expectedFields);
  assert.equal(content.form.success.body, 'Demostración completada. No se enviaron datos ni se creó una consulta comercial.');
 assert.equal(content.form.failure.body, 'La simulación no pudo completarse. No se enviaron datos. Tus valores siguen disponibles en esta página para que puedas corregirlos o volver a probar.');
  assert.deepEqual(content.founderContextAction, { label: 'Conocer la trayectoria de Samuel', routeId: 'founder' });
 assert.equal(content.alternatives.note, 'WhatsApp, email y teléfono se muestran como alternativas funcionales. Al usarlas, salís de esta simulación y abrís un servicio externo; los valores del formulario no se copian allí.');
  assert.deepEqual(content.alternatives.actions.map(({ kind }) => kind), ['whatsapp', 'email', 'phone']);
});

test('owns the exact approved English demonstration Contact content', async () => {
  const content = await loadContent('../app/(en)/en/_content/contact.ts');
  assert.equal(content.locale, 'en');
  assert.equal(content.routeId, 'contact');
  assert.equal(content.heading, 'Tell us what you need to solve.');
  assert.equal(content.notice, undefined);
  assert.equal(content.form.submit, 'Simulate submission');
  assert.equal(content.form.submitting, 'Simulating…');
  assert.deepEqual(content.form.fields.map(({ name, maxLength, required }) => [name, maxLength, required]), expectedFields);
  assert.equal(content.form.success.body, 'Demonstration complete. No data was sent and no commercial inquiry was created.');
 assert.equal(content.form.failure.body, 'The simulation could not be completed. No data was sent. Your values remain available on this page so you can correct them or try again.');
  assert.deepEqual(content.founderContextAction, { label: "View Samuel's background", routeId: 'founder' });
 assert.equal(content.alternatives.note, 'WhatsApp, email, and phone are shown as functional alternatives. Using one leaves this simulation and opens an external service; the form values are not copied there.');
  assert.deepEqual(content.alternatives.actions.map(({ kind }) => kind), ['whatsapp', 'email', 'phone']);
});

test('does not render dormant delivery language or provider-specific copy', async () => {
  for (const modulePath of ['../app/(es)/_content/contact.ts', '../app/(en)/en/_content/contact.ts']) {
    const content = await loadContent(modulePath);
    const text = JSON.stringify(content);
    assert.doesNotMatch(text, /inquiry sent|consulta enviada|we will use your information to send|enviaremos tu consulta/i);
    assert.doesNotMatch(text, /Formspree|endpoint|provider|proveedor/i);
  }
});

const commercialContentCases = [
  {
    locale: 'es',
    path: '../app/(es)/_content/commercial/contact.ts',
    fields: [
      ['name', 'Nombre', 200],
      ['email', 'Correo electrónico', 508],
      ['company', 'Empresa', 240],
      ['message', '¿Qué necesitás resolver?', 8000],
    ],
    terms: 'Términos y condiciones',
    success: ['Mensaje aceptado.', 'Tu consulta fue aceptada para su envío. Si necesitás confirmar que Samuel la recibió, usá una opción de contacto directo.'],
    uncertainty: ['No pudimos confirmar el envío.', 'Tus datos siguen en el formulario. Podés reintentar o escribirnos por WhatsApp. Si el primer envío fue recibido, un reintento puede generar otra copia de la consulta.'],
    rateLimited: ['El envío está temporalmente limitado.', 'Tus datos siguen en el formulario. Intentá más tarde o escribinos por WhatsApp.'],
    unavailable: ['El formulario no está disponible.', 'Podés escribirnos por WhatsApp, correo o teléfono. Los datos que completaste siguen en esta página.'],
  },
  {
    locale: 'en',
    path: '../app/(en)/en/_content/commercial/contact.ts',
    fields: [
      ['name', 'Name', 200],
      ['email', 'Email', 508],
      ['company', 'Company', 240],
      ['message', 'What do you need to solve?', 8000],
    ],
    terms: 'Terms and Conditions',
    success: ['Message accepted.', 'Your inquiry was accepted for sending. If you need to confirm Samuel received it, use a direct contact option.'],
    uncertainty: ["We couldn't confirm your submission.", 'Your information is still in the form. You can try again or contact us on WhatsApp. If the first submission was received, retrying may create another copy of your inquiry.'],
    rateLimited: ['Submissions are temporarily limited.', 'Your information is still in the form. Try later or contact us on WhatsApp.'],
    unavailable: ['The form is unavailable.', 'You can contact us on WhatsApp, by email or by phone. The information you entered remains on this page.'],
  },
];

for (const expected of commercialContentCases) {
  test(`owns the approved ${expected.locale} commercial Contact fields, outcomes, and independent channels`, async () => {
    const { commercialContactContent: content } = await import(expected.path);
    assert.equal(content.mode, 'commercial');
    assert.equal(content.locale, expected.locale);
    assert.equal(content.routeId, 'contact');
    assert.deepEqual(content.form.fields.map(({ name, label, maxLength }) => [name, label, maxLength]), expected.fields);
    assert.equal(content.termsLabel, expected.terms);
    assert.deepEqual([content.form.success.heading, content.form.success.body], expected.success);
    assert.deepEqual([content.form.outcomes.uncertain.heading, content.form.outcomes.uncertain.body], expected.uncertainty);
    assert.deepEqual([content.form.outcomes.rateLimited.heading, content.form.outcomes.rateLimited.body], expected.rateLimited);
    assert.deepEqual([content.form.outcomes.unavailable.heading, content.form.outcomes.unavailable.body], expected.unavailable);
    assert.deepEqual(content.alternatives.actions.map(({ kind, href }) => [kind, href]), [
      ['whatsapp', 'https://wa.me/5491150117565'],
      ['email', 'mailto:samuelfurlanich@gmail.com'],
      ['phone', 'tel:+5491150117565'],
    ]);
    assert.equal(content.form.fields.length, 4);
    assert.equal(content.preHydrationFallback.length > 0, true);
  });
}
