// Declarative static-export requirements for the Studio pair (PLAN-SFC-V1 Task 2: one owner per page, data only).
// The shared verifier (scripts/verify-static-export.mjs) imports this map and owns the assertion logic.
export const studioRequirements = {
  'estudio/index.html': {
    heading: 'Software a medida con responsabilidad técnica directa.',
    sections: [
      'Dirección técnica de principio a fin',
      'Principios para trabajar con claridad',
      'Base en Buenos Aires, disponibilidad nacional e internacional',
      'La persona detrás de la dirección técnica',
      'Conversemos sobre lo que hoy frena a tu negocio',
    ],
    references: ['/contacto/', '/estudio/samuel-furlanich/', '/en/about/'],
  },
  'en/about/index.html': {
    heading: 'Custom software with direct technical accountability.',
    sections: [
      'Technical direction from start to finish',
      'Principles for clear delivery',
      'Based in Buenos Aires, available nationally and internationally',
      'The person behind the technical direction',
      "Let's talk about what's holding your business back",
    ],
    references: ['/en/contact/', '/en/about/samuel-furlanich/', '/estudio/'],
  },
};
