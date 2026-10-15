// Declarative static-export requirements for Services (PLAN-SFC-V1 Task 2: one owner per page, data only).
// The shared verifier (scripts/verify-static-export.mjs) imports this map and owns the assertion logic.
export const servicesRequirements = {
  'servicios/index.html': {
    route: '/servicios/',
    lang: 'es-AR',
    heading: 'Software para que el trabajo avance.',
    indexLabel: 'Encontrá tu punto de partida',
    index: [
      ['/servicios/#web', 'Sitios y aplicaciones web'],
      ['/servicios/#whatsapp', 'Integraciones y automatización'],
      ['/servicios/#consultoria', 'Mejora de software existente'],
    ],
    services: [
      ['web', 'Una interfaz clara para el negocio.'],
      ['whatsapp', 'Las herramientas dejan de trabajar aisladas.'],
      ['consultoria', 'Un sistema que puede seguir evolucionando.'],
    ],
    groups: [
      'Qué recibís', 'Situaciones habituales', 'Punto de partida', 'Alcance acordado',
      'Límites del servicio', 'Evidencia', 'Acuerdo de trabajo', 'Límites comerciales',
      'IA solo cuando aporta valor',
    ],
    principlesHeading: 'Alcance claro. Entregas revisables.',
    principlesAnchor: 'condiciones',
    finalHeading: 'Contanos qué necesitás resolver',
    actions: [
      'Contanos qué necesitás resolver',
      'Iniciar una consulta',
    ],
    evidence: [
      'Evidencia disponible: prototipo de reservas, con código público y ejecución actual no revalidada.',
      'No se publica actualmente un caso verificado de este servicio. El modelo de fondo es ilustrativo.',
      'Chatbots y agentes se evalúan con alcance, datos, proveedores, costos, límites y supervisión humana acordados.',
    ],
    evidenceLink: ['/proyectos/#general-reservation-system', 'Examinar el prototipo de reservas'],
  },
  'en/services/index.html': {
    route: '/en/services/',
    lang: 'en',
    heading: 'Software that moves work forward.',
    indexLabel: 'Find your starting point',
    index: [
      ['/en/services/#web', 'Websites and web applications'],
      ['/en/services/#whatsapp', 'Integrations and automation'],
      ['/en/services/#consulting', 'Improve existing software'],
    ],
    services: [
      ['web', 'A clear interface for the business.'],
      ['whatsapp', 'Tools stop working in isolation.'],
      ['consulting', 'A system that can keep evolving.'],
    ],
    groups: [
      'What you receive', 'Common situations', 'Starting point', 'Agreed scope',
      'Service boundaries', 'Evidence', 'Working agreement', 'Commercial boundaries',
      'AI only where it adds value',
    ],
    principlesHeading: 'Clear scope. Reviewable delivery.',
    principlesAnchor: 'working-boundaries',
    finalHeading: 'Tell us what you need to solve',
    actions: [
      'Tell us what you need to solve',
      'Start an enquiry',
    ],
    evidence: [
      'Available evidence: reservation prototype, with public code and current execution not revalidated.',
      'No verified case is currently published for this service. The background model is illustrative.',
      'Chatbots and agents are evaluated with agreed scope, data, providers, costs, limits and human oversight.',
    ],
    evidenceLink: ['/en/work/#general-reservation-system', 'Examine the reservation prototype'],
  },
};
