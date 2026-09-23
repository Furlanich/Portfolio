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
    pauseLabel: 'Pausar movimiento',
    resumeLabel: 'Reanudar movimiento',
    chapters: [
      {
        id: 'recognition',
        sequence: '01',
        heading: 'Reconocer el sistema real',
        description:
          'Pedidos, reservas, mensajes y tareas ya conviven en un mismo negocio. El primer paso es entender cómo se relacionan.',
        artworkId: 'recognition-poster',
      },
      {
        id: 'fragmentation',
        sequence: '02',
        heading: 'Ver dónde se fragmenta',
        description:
          'Cuando la información cambia de canal y se repite, la operación depende de más controles manuales.',
        artworkId: 'fragmentation-poster',
      },
      {
        id: 'connection',
        sequence: '03',
        heading: 'Conectar lo que importa',
        description:
          'Una solución bien definida reúne datos, reglas y acciones sin sumar complejidad innecesaria.',
        artworkId: 'connection-poster',
      },
      {
        id: 'coordination',
        sequence: '04',
        heading: 'Coordinar el trabajo',
        description:
          'El sistema acompaña el proceso real y deja una base que puede mantenerse y adaptarse cuando cambia el negocio.',
        artworkId: 'coordination-poster',
      },
    ],
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
    heading: 'Servicios para necesidades concretas',
    introduction: 'Construir, conectar o mejorar, según el problema.',
    services: [
      {
        title: 'Sitios y aplicaciones web comerciales',
        description:
          'Soluciones web para presentar, vender o gestionar servicios: sitios profesionales, catálogos, pedidos, reservas, portales para clientes e integraciones con medios de pago.',
      },
      {
        title: 'Automatización por WhatsApp e integraciones',
        description:
          'Flujos para responder consultas, registrar pedidos, gestionar reservas, enviar confirmaciones y conectar WhatsApp con otras herramientas del negocio.',
      },
      {
        title: 'Mantenimiento y consultoría de software',
        description:
          'Diagnóstico y mejora de sistemas existentes para resolver problemas, reducir riesgos y definir un camino técnico mantenible.',
      },
    ],
    action: {
      label: 'Ver todos los servicios',
      routeId: 'services',
    },
  },
  proof: {
    heading: 'Una responsabilidad técnica clara',
    introduction:
      'Samuel participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. El alcance y las validaciones se acuerdan según cada necesidad.',
    action: {
      label: 'Ver proyectos y sus límites',
      routeId: 'projects',
    },
  },
  process: {
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
} satisfies HomePageContent;
