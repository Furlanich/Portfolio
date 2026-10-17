import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerifier } from './export-test-support.mjs';
import { contactRequirements } from './export-requirements/contact.mjs';

const modules = {
  es: {
    file: 'contacto/index.html',
    lang: 'es-AR',
    simulation: 'Simular envío',
    removedNotice: [
      'Demostración interactiva',
      'Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.',
      'Para probar el estado de error, usá failure@example.invalid como correo electrónico.',
    ],
  },
  en: {
    file: 'en/contact/index.html',
    lang: 'en',
    simulation: 'Simulate submission',
    removedNotice: [
      'Interactive demonstration',
      'This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.',
      'To try the failure state, use failure@example.invalid as the email address.',
    ],
  },
};

function contactHtml(locale, { basePath = '', extraMarkup = '' } = {}) {
  const definition = modules[locale];
  const requirement = contactRequirements[definition.file];
  const link = (route) => `${basePath}${route}`;
  return [
    `<!doctype html><html lang="${definition.lang}"><body><main>`,
    `<h1>${requirement.heading}</h1>`,
    extraMarkup,
    `<section><form><fieldset>${requirement.fields.map((field) => `<label>${field}</label>`).join('')}</fieldset><button>${definition.simulation}</button></form></section>`,
    `<p>${requirement.fallback}</p>`,
    `<a href="${link(requirement.privacy)}">Privacy</a><a href="${link(requirement.founder)}">Founder</a>`,
    '</main></body></html>',
  ].join('');
}

function contactMessages(files, basePath = '') {
  const contactOwned = /Contact|live provider or delivery wording|main landmark|approved visible H1/;
  return runVerifier({ files, basePath }).output
    .split('\n')
    .filter((line) => Object.values(modules).some(({ file }) => line.startsWith(`- ${file}:`) && contactOwned.test(line)));
}

for (const locale of Object.keys(modules)) {
  const file = modules[locale].file;

  test(`${locale} Contact static export preserves the current truthful demonstration`, () => {
    assert.deepEqual(contactMessages({ [file]: contactHtml(locale) }), []);
  });

  test(`${locale} Contact static export rejects the removed form-panel demonstration notice`, () => {
    const [heading, body, helper] = modules[locale].removedNotice;
    const messages = contactMessages({
      [file]: contactHtml(locale, { extraMarkup: `<aside><h2>${heading}</h2><p>${body}</p><p>${helper}</p></aside>` }),
    });
    assert.ok(messages.some((line) => line.includes('retired Contact copy')), messages.join('\n'));
  });

  test(`${locale} Contact static export rejects live provider and delivery language`, () => {
    const messages = contactMessages({
      [file]: contactHtml(locale).replace('</form>', 'Formspree inquiry sent</form>'),
    });
    assert.ok(messages.some((line) => line.includes('contains live provider or delivery wording')), messages.join('\n'));
  });

  test(`${locale} Contact export links retain the /Portfolio base path`, () => {
    assert.deepEqual(contactMessages({ [file]: contactHtml(locale, { basePath: '/Portfolio' }) }, '/Portfolio'), []);
  });
}
