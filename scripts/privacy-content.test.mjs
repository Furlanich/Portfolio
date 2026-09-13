import test from 'node:test';
import assert from 'node:assert/strict';

async function loadContent(modulePath) {
  try {
    return (await import(modulePath)).privacyContent;
  } catch (error) {
    assert.fail('Privacy content module is missing: ' + modulePath + ' (' + error.code + ')');
  }
}

test('owns the exact approved Spanish demonstration Privacy content', () => {
  return loadContent('../app/(es)/_content/privacy.ts').then((spanish) => {
  assert.equal(spanish.locale, 'es');
  assert.equal(spanish.routeId, 'privacy');
  assert.equal(spanish.heading, 'Privacidad de esta demostración');
  assert.equal(spanish.introduction, 'Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.');
  assert.deepEqual(spanish.sections.map(({ id, heading }) => [id, heading]), [
    ['form-data', 'Qué ocurre con los datos del formulario'],
    ['hosting', 'Alojamiento y datos técnicos'],
    ['external-alternatives', 'Alternativas externas'],
    ['sensitive-information', 'Información sensible'],
    ['retention-questions', 'Conservación y consultas'],
    ['future-commercial-activation', 'Activación comercial futura'],
  ]);
  assert.ok(spanish.sections[0].paragraphs[0].includes('no los envía a FURLANICH, Formspree, Gmail ni a ninguna bandeja de entrada.'));
  assert.ok(spanish.sections[1].paragraphs[0].includes('https://furlanich.github.io/Portfolio/'));
  assert.equal(spanish.githubLink.label, 'Ver la declaración de privacidad de GitHub');
  });
});

test('owns the exact approved English demonstration Privacy content', () => {
  return loadContent('../app/(en)/en/_content/privacy.ts').then((english) => {
  assert.equal(english.locale, 'en');
  assert.equal(english.routeId, 'privacy');
  assert.equal(english.heading, 'Privacy in this demonstration');
  assert.equal(english.introduction, 'This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.');
  assert.deepEqual(english.sections.map(({ id, heading }) => [id, heading]), [
    ['form-data', 'What happens to form data'],
    ['hosting', 'Hosting and technical data'],
    ['external-alternatives', 'External alternatives'],
    ['sensitive-information', 'Sensitive information'],
    ['retention-questions', 'Retention and questions'],
    ['future-commercial-activation', 'Future commercial activation'],
  ]);
  assert.ok(english.sections[0].paragraphs[0].includes('does not send them to FURLANICH, Formspree, Gmail, or any inbox.'));
  assert.ok(english.sections[1].paragraphs[0].includes('https://furlanich.github.io/Portfolio/'));
  assert.equal(english.githubLink.label, "View GitHub's privacy statement");
  });
});

test('keeps Privacy content declarative and free of live-processing claims', () => {
  return Promise.all([
    loadContent('../app/(es)/_content/privacy.ts'),
    loadContent('../app/(en)/en/_content/privacy.ts'),
  ]).then((contents) => {
    for (const content of contents) {
      const text = JSON.stringify(content);
      assert.doesNotMatch(text, /we (collect|store|process|send) your inquiry/i);
      assert.doesNotMatch(text, /consulta enviada|inquiry sent/i);
      assert.doesNotMatch(text, /DPA|subprocessor|subprocesador/i);
    }
  });
});
