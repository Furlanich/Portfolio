// Declarative static-export requirements for Home (PLAN-SFC-V1 Task 2: one owner per page, data only).
// The shared verifier (scripts/verify-static-export.mjs) imports this map and owns the assertion logic.
export const homepageRequirements = {
  'index.html': {
    illustrativeTag: 'Escenario ilustrativo',
    chapters: [
      ['Reconocer el sistema real', 'Pedidos, reservas, mensajes y tareas ya conviven en un mismo negocio. El primer paso es entender cómo se relacionan.'],
      ['Ver dónde se fragmenta', 'Cuando la información cambia de canal y se repite, la operación depende de más controles manuales.'],
      ['Conectar lo que importa', 'Una solución bien definida reúne datos, reglas y acciones sin sumar complejidad innecesaria.'],
      ['Coordinar el trabajo', 'El sistema acompaña el proceso real y deja una base que puede mantenerse y adaptarse cuando cambia el negocio.'],
    ],
    sections: [
      ['problems', 'problems-heading', 'Cuando el trabajo queda repartido entre herramientas'],
      ['services', 'services-heading', 'Servicios para necesidades concretas'],
      ['impact', 'impact-heading', 'Menos lugares que revisar para saber en qué estado está un pedido'],
      ['proof', 'proof-heading', 'Una responsabilidad técnica clara'],
      ['proceso', 'proceso-heading', 'Cómo trabajamos'],
      ['founder', 'founder-heading', 'Responsabilidad técnica directa'],
      ['cta', 'cta-heading', '¿Tenés una necesidad concreta o un sistema que necesita atención?'],
    ],
    requiredReferences: [
      '/servicios/',
      '/contacto/',
      '/proyectos/',
      '/estudio/samuel-furlanich/',
      '/#proceso',
      'https://wa.me/5491150117565',
    ],
    forbidden: [
      /id="audiences"|audiences-heading/i,
      /Pensado para negocios con operaciones reales|MKT-D05/i,
      /Busesfy|ChronoApp|MPC Administración|Documancer/i,
      /project-card|case-study|testimonial|client-logo|metric-card/i,
    ],
  },
  'en/index.html': {
    illustrativeTag: 'Illustrative scenario',
    chapters: [
      ['Recognize the real system', 'Orders, bookings, messages, and tasks already coexist in one business. The first step is understanding how they relate.'],
      ['See where it fragments', 'When information changes channels and is repeated, operations depend on more manual checks.'],
      ['Connect what matters', 'A well-defined solution brings data, rules, and actions together without adding unnecessary complexity.'],
      ['Coordinate the work', 'The system supports the real process and creates a foundation that can be maintained and adapted as the business changes.'],
    ],
    sections: [
      ['problems', 'problems-heading', 'When work is spread across tools'],
      ['services', 'services-heading', 'Services for concrete business needs'],
      ['impact', 'impact-heading', 'Fewer places to check before you know where an order stands'],
      ['proof', 'proof-heading', 'Clear technical accountability'],
      ['process', 'process-heading', 'How we work'],
      ['founder', 'founder-heading', 'Direct technical responsibility'],
      ['cta', 'cta-heading', 'Do you have a concrete need or a system that needs attention?'],
    ],
    requiredReferences: [
      '/en/services/',
      '/en/contact/',
      '/en/work/',
      '/en/about/samuel-furlanich/',
      '/en/#process',
      'https://wa.me/5491150117565',
    ],
    forbidden: [
      /id="audiences"|audiences-heading/i,
      /Built for businesses with real operations|MKT-D05/i,
      /Busesfy|ChronoApp|MPC Administración|Documancer/i,
      /project-card|case-study|testimonial|client-logo|metric-card/i,
    ],
  },
};
