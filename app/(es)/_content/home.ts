import type { HomePageContent } from '../../../components/homepage/content-types';

export const homeContent = {
  locale: 'es',
  routeId: 'home',
  eyebrow: 'Estudio de software a medida',
  heading: 'Conectá tus sistemas. Simplificá el trabajo diario.',
  description:
    'Sitios y aplicaciones web, automatización por WhatsApp e integraciones para coordinar pedidos, reservas y tareas. También mejoramos sistemas existentes.',
  primaryAction: {
    label: 'Ver contacto',
    routeId: 'contact',
  },
  secondaryAction: {
    label: 'Ver servicios',
    routeId: 'services',
  },
  trustLine: 'Samuel Furlanich, responsable técnico del estudio.',
  availability: 'Buenos Aires, Argentina. Disponibilidad en español e inglés para Argentina y el exterior.',
  instrument: {
    label: 'FURLANICH · Del proceso al sistema',
    statusLabel: 'ETAPA {current} DE 04',
    plateLabel: 'Lámina {current}/04',
    coordinates: '34°36’S · 58°22’W',
    pauseLabel: 'Pausar movimiento',
    resumeLabel: 'Reanudar movimiento',
    chapters: [
      {
        id: 'recognition',
        sequence: '01',
        kicker: 'Reconocer',
        heading: 'Reconocer el sistema real',
        description:
          'Pedidos, reservas, mensajes y tareas ya conviven en un mismo negocio. El primer paso es entender cómo se relacionan.',
        artworkId: 'recognition-poster',
      },
      {
        id: 'fragmentation',
        sequence: '02',
        kicker: 'Fragmentar',
        heading: 'Ver dónde se fragmenta',
        description:
          'Cuando la información cambia de canal y se repite, la operación depende de más controles manuales.',
        artworkId: 'fragmentation-poster',
      },
      {
        id: 'connection',
        sequence: '03',
        kicker: 'Conectar',
        heading: 'Conectar lo que importa',
        description:
          'Una solución bien definida reúne datos, reglas y acciones sin sumar complejidad innecesaria.',
        artworkId: 'connection-poster',
      },
      {
        id: 'coordination',
        sequence: '04',
        kicker: 'Coordinar',
        heading: 'Coordinar el trabajo',
        description:
          'El sistema acompaña el proceso real y deja una base que puede mantenerse y adaptarse cuando cambia el negocio.',
        artworkId: 'coordination-poster',
      },
    ],
    nodes: {
      orders: 'Pedidos',
      bookings: 'Reservas',
      messages: 'Mensajes',
      tasks: 'Tareas',
      understand: 'Entender',
      process: 'Proceso',
      constraints: 'Restricciones',
      diagnosis: 'Diagnóstico',
      define: 'Definir',
      scope: 'Alcance',
      responsibilities: 'Responsabilidades',
      'validation-criteria': 'Criterios de validación',
      'build-review': 'Construir y revisar',
      integrate: 'Integrar',
      'technical-review': 'Revisión técnica',
      'functional-tests': 'Pruebas funcionales',
      'hand-over': 'Entregar',
      documentation: 'Documentación',
      'journeys-validated': 'Recorridos validados',
      maintain: 'Mantener',
    },
  },
  problems: {
    heading: 'Cuando lo manual empieza a frenar el negocio',
    introduction: 'Cuando el trabajo queda repartido entre herramientas',
    audienceStatement:
      'Para pymes que coordinan pedidos, reservas o atención al cliente, o necesitan mejorar un sistema existente.',
    situations: [
      'Pedidos y reservas que se reorganizan a mano.',
      'Consultas repetidas que interrumpen el trabajo.',
      'Sistemas que no comparten información o necesitan mejoras.',
    ],
    action: {
      label: 'Ver cómo podemos ayudarte',
      routeId: 'services',
    },
  },
  servicesSection: {
    kicker: 'Servicios',
    heading: 'Servicios para necesidades concretas',
    introduction: 'Construir, conectar o mejorar, según el problema.',
    services: [
      {
        title: 'Sitios y aplicaciones web comerciales',
        description:
          'Soluciones web para presentar, vender o gestionar servicios: sitios profesionales, catálogos, pedidos, reservas, portales para clientes e integraciones con medios de pago.',
        category: 'Construir',
      },
      {
        title: 'Automatización por WhatsApp e integraciones',
        description:
          'Flujos para responder consultas, registrar pedidos, gestionar reservas, enviar confirmaciones y conectar WhatsApp con otras herramientas del negocio.',
        category: 'Conectar',
      },
      {
        title: 'Mantenimiento y consultoría de software',
        description:
          'Diagnóstico y mejora de sistemas existentes para resolver problemas, reducir riesgos y definir un camino técnico mantenible.',
        category: 'Mejorar',
      },
    ],
    action: {
      label: 'Ver todos los servicios',
      routeId: 'services',
    },
  },
  impact: {
    kicker: 'Fijar la posición',
    heading: 'Menos lugares que revisar para saber en qué estado está un pedido',
    introduction:
      'Un escenario ilustrativo, no un resultado de clientes. Un navegante fija su posición con varias marcaciones; cuando las fuentes no coinciden, la posición se vuelve una zona de duda.',
    illustrativeTag: 'Escenario ilustrativo',
    toggle: {
      groupLabel: 'Escenario',
      separateLabel: 'Fuentes separadas',
      connectedLabel: 'Registro conectado',
      announcement: 'Mostrando: {state}',
    },
    figure: {
      title: 'Dónde está un pedido, según sus fuentes',
      separateDescription:
        'Cinco marcaciones desde un chat de WhatsApp, un cuaderno de pedidos, una planilla, un correo y una llamada se cruzan en lugares distintos y dejan una zona de duda.',
      connectedDescription:
        'Todas las fuentes leen un mismo registro conectado, así que todas las marcaciones coinciden en un punto exacto.',
      doubtLabel: 'Zona de duda',
      fixLabel: 'Posición exacta',
    },
    sources: [
      { id: 'whatsapp', name: 'Chat de WhatsApp', note: '“Confirmado” en el chat' },
      { id: 'book', name: 'Cuaderno de pedidos', note: 'Anotado, todavía sin pagar' },
      { id: 'spreadsheet', name: 'Planilla', note: 'Actualizada ayer a la tarde' },
      { id: 'email', name: 'Correo', note: 'El cliente pidió cambiar la fecha' },
      { id: 'call', name: 'Llamada', note: 'Prometido para el viernes' },
    ],
    connectedNoteTemplate: '{source}: lee el registro conectado',
    counts: {
      title: 'Lugares revisados para confirmar un pedido',
      separateLabel: 'Fuentes separadas',
      connectedLabel: 'Registro conectado',
      caption:
        'Los números salen de este ejemplo: un chat de WhatsApp, un cuaderno de pedidos, una planilla, un correo y una llamada. No son mediciones.',
    },
  },
  proof: {
    kicker: 'Responsabilidad técnica',
    heading: 'Una responsabilidad técnica clara',
    introduction:
      'Samuel participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. El alcance y las validaciones se acuerdan según cada necesidad.',
    logLabel: 'Dónde se aplica la responsabilidad',
    log: [
      { term: 'Definir', text: 'Problema y alcance acordados' },
      { term: 'Decidir', text: 'Decisiones técnicas a cargo de Samuel' },
      { term: 'Revisar', text: 'Trabajo revisado antes de la entrega' },
    ],
    action: {
      label: 'Ver proyectos y sus límites',
      routeId: 'projects',
    },
  },
  process: {
    kicker: 'Proceso',
    heading: 'Cómo trabajamos',
    steps: [
      {
        title: 'Entender',
        description: 'Revisar el proceso y el problema.',
      },
      {
        title: 'Definir',
        description: 'Acordar alcance, responsabilidades y entregables.',
      },
      {
        title: 'Construir y revisar',
        description: 'Comprobar los recorridos importantes.',
      },
      {
        title: 'Entregar',
        description: 'Documentar el uso y acordar los pasos siguientes.',
      },
    ],
    qualityStatement:
      'Antes de una puesta en producción, cada entrega pasa por revisión técnica, pruebas funcionales y validación de los recorridos principales. Los controles específicos se definen según el tipo de solución y su nivel de riesgo.',
    action: {
      label: 'Empezar una consulta',
      routeId: 'contact',
    },
  },
  founderSection: {
    kicker: 'Fundador',
    heading: 'Responsabilidad técnica directa',
    biography: 'Samuel Furlanich dirige FURLANICH. Conocé su experiencia y formación.',
    action: {
      label: 'Conocer a Samuel',
      routeId: 'founder',
    },
  },
  cta: {
    heading: '¿Tenés una necesidad concreta o un sistema que necesita atención?',
    demoStatement: 'Explorá las opciones de contacto y probá el formulario de demostración. No se envían consultas desde el formulario.',
    primaryAction: {
      label: 'Ver contacto',
      routeId: 'contact',
    },
    secondaryAction: {
      label: 'Escribir por WhatsApp',
      kind: 'whatsapp',
      href: 'https://wa.me/5491150117565',
    },
  },
  readout: {
    home: 'Inicio',
    problems: 'Problemas',
    services: 'Servicios',
    impact: 'Posición',
    proof: 'Responsabilidad',
    process: 'Proceso',
    founder: 'Fundador',
    contact: 'Contacto',
  },
} satisfies HomePageContent;
