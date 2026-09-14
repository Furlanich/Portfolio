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
  ['name', 100, true],
  ['email', 254, true],
  ['company', 120, false],
  ['message', 4000, true],
];

test('owns the exact approved Spanish demonstration Contact content', async () => {
  const content = await loadContent('../app/(es)/_content/contact.ts');
  assert.equal(content.locale, 'es');
  assert.equal(content.routeId, 'contact');
  assert.equal(content.heading, 'Contanos qué necesitás resolver.');
  assert.equal(content.notice.heading, 'Demostración interactiva');
  assert.equal(content.notice.body, 'Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.');
  assert.equal(content.notice.failureHelper, 'Para probar el estado de error, usá failure@example.invalid como correo electrónico.');
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
  assert.equal(content.notice.heading, 'Interactive demonstration');
  assert.equal(content.notice.body, 'This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.');
  assert.equal(content.notice.failureHelper, 'To try the failure state, use failure@example.invalid as the email address.');
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
