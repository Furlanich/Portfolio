import type { HomePageContent } from '../../../components/homepage/content-types';

export const homeContent = {
  locale: 'es',
  routeId: 'home',
  eyebrow: 'Desarrollo de software a medida para pymes',
  heading: 'Software práctico para vender, atender y operar mejor.',
  description:
    'FURLANICH diseña y desarrolla sitios y aplicaciones web comerciales, automatizaciones por WhatsApp e integraciones, y mejora sistemas existentes para organizaciones con necesidades concretas.',
  primaryAction: {
    label: 'Contanos sobre tu proyecto',
    routeId: 'contact',
  },
  secondaryAction: {
    label: 'Ver servicios',
    routeId: 'services',
  },
  trustLine: 'Atención técnica directa · Buenos Aires, Argentina · Proyectos en español e inglés',
  availability: 'Disponible para proyectos en toda la Argentina y el exterior.',
  problems: {
    heading: 'Cuando lo manual empieza a frenar el negocio',
    introduction:
      'Una solución digital tiene sentido cuando reduce trabajo repetitivo, evita errores o permite atender mejor. Estos son algunos de los problemas que FURLANICH puede ayudarte a resolver.',
    situations: [
      {
        title: 'Pedidos y reservas desordenados',
        description:
          'Consultas distribuidas entre mensajes, llamadas, planillas y anotaciones difíciles de mantener.',
      },
      {
        title: 'Procesos que consumen demasiado tiempo',
        description:
          'Tareas administrativas o de atención que podrían integrarse, simplificarse o automatizarse.',
      },
      {
        title: 'Una presencia web que no acompaña al negocio',
        description:
          'Sitios que informan, pero no permiten reservar, comprar, pedir o iniciar una gestión.',
      },
      {
        title: 'Software difícil de mantener',
        description:
          'Sistemas inestables, desactualizados o sin una dirección técnica clara.',
      },
    ],
    action: {
      label: 'Ver cómo podemos ayudarte',
      routeId: 'services',
    },
  },
  servicesSection: {
    heading: 'Servicios para necesidades concretas',
    introduction:
      'No imponemos una plataforma genérica. Primero entendemos el proceso y después evaluamos si conviene construir, integrar o modernizar.',
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
  audiences: {
    heading: 'Pensado para negocios con operaciones reales',
    audiences: [
      {
        title: 'Comercios y tiendas',
        description:
          'Catálogos, pedidos, consultas, pagos y herramientas para organizar la operación.',
      },
      {
        title: 'Gastronomía',
        description: 'Menús, pedidos, reservas, confirmaciones y canales de atención.',
      },
      {
        title: 'Transporte y logística',
        description:
          'Solicitudes, coordinación, seguimiento e información para pasajeros o clientes.',
      },
      {
        title: 'Servicios profesionales y consultoras',
        description:
          'Portales, automatizaciones, integraciones y capacidad técnica para proyectos o sistemas existentes.',
      },
    ],
    closing:
      'Si tu sector no aparece en esta lista, el punto de partida sigue siendo el mismo: entender el proceso, el problema y el resultado que necesitás.',
    action: {
      label: 'Contanos cómo funciona tu negocio',
      routeId: 'contact',
    },
  },
  proof: {
    heading: 'Credibilidad sin promesas infladas',
    introduction:
      'FURLANICH solo presenta un trabajo cuando su contexto, estado y permiso de publicación están claros. No convertimos prototipos en historias de clientes ni publicamos métricas sin una fuente verificable.',
    commitments: [
      {
        title: 'Responsabilidad directa',
        description: 'Samuel mantiene la responsabilidad técnica de cada proyecto de FURLANICH.',
      },
      {
        title: 'Afirmaciones verificables',
        description:
          'El estado, el alcance y las limitaciones de un trabajo se explican antes de usarlo como evidencia.',
      },
      {
        title: 'Confidencialidad respetada',
        description:
          'La identidad, las capturas y los resultados de clientes se publican únicamente con permiso explícito.',
      },
    ],
    action: {
      label: 'Conocer la trayectoria de Samuel',
      routeId: 'founder',
    },
  },
  process: {
    heading: 'De una necesidad concreta a una solución mantenible',
    steps: [
      {
        title: 'Entender y diagnosticar',
        description:
          'Relevamos el negocio, el problema, los usuarios y las restricciones. Si todavía no está claro qué construir, primero ordenamos la necesidad.',
      },
      {
        title: 'Definir el alcance',
        description:
          'Documentamos objetivos, entregables, límites, riesgos, responsabilidades y una propuesta de trabajo comprensible.',
      },
      {
        title: 'Construir y validar',
        description:
          'Avanzamos mediante entregas revisables, pruebas y validaciones para detectar desvíos antes de llegar a producción.',
      },
      {
        title: 'Implementar y acompañar',
        description:
          'Preparamos la publicación, la documentación y la continuidad acordada para que la solución pueda utilizarse y mantenerse.',
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
    biography:
      'FURLANICH está liderado por Samuel Furlanich, desarrollador de software full-stack con estudios completos en Ciencias de la Computación en la Universidad de Buenos Aires. Samuel mantiene la responsabilidad técnica directa en cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
    primaryAction: {
      label: 'Hablemos de tu proyecto',
      routeId: 'contact',
    },
    secondaryAction: {
      label: 'Conocer a Samuel',
      routeId: 'founder',
    },
  },
  cta: {
    heading: '¿Tenés una necesidad concreta o un sistema que necesita atención?',
    description:
      'Contanos brevemente qué querés resolver. Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.',
    responseStatement:
      'Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.',
    primaryAction: {
      label: 'Contanos sobre tu proyecto',
      routeId: 'contact',
    },
    secondaryAction: {
      label: 'Escribir por WhatsApp',
      kind: 'whatsapp',
      href: 'https://wa.me/5491150117565',
    },
  },
} satisfies HomePageContent;
