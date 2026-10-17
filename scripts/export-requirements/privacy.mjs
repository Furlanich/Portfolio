// Declarative static-export requirements for Privacy (PLAN-SFC-V1 Tasks 2 and 9: one owner per page, data only).
// Privacy now uses the shared legal reading template. The verifier continues to own route/content assertions;
// these navigation fields are also consumed by the focused browser contract in tests/e2e/legal.spec.ts.
export const privacyRequirements = {
  'privacidad/index.html': {
    heading: 'Privacidad de esta demostración',
    introduction:
      'Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.',
    sections: [
      'Qué ocurre con los datos del formulario',
      'Alojamiento y datos técnicos',
      'Alternativas externas',
      'Información sensible',
      'Conservación y consultas',
      'Activación comercial futura',
    ],
    contentsLabel: 'Contenido',
    sectionIds: ['form-data', 'hosting', 'external-alternatives', 'sensitive-information', 'retention-questions', 'future-commercial-activation'],
    githubLabel: 'Ver la declaración de privacidad de GitHub',
  },
  'en/privacy/index.html': {
    heading: 'Privacy in this demonstration',
    introduction:
      'This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.',
    sections: [
      'What happens to form data',
      'Hosting and technical data',
      'External alternatives',
      'Sensitive information',
      'Retention and questions',
      'Future commercial activation',
    ],
    contentsLabel: 'Contents',
    sectionIds: ['form-data', 'hosting', 'external-alternatives', 'sensitive-information', 'retention-questions', 'future-commercial-activation'],
    githubLabel: "View GitHub's privacy statement",
  },
};
