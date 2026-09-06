import type { ProjectsPageContent } from '../../../components/projects/content-types';

export const projectPageContent = {
  locale: 'es',
  routeId: 'projects',
  heading: 'Proyectos seleccionados',
  introduction:
    'Publicamos trabajo solo cuando podemos explicar con claridad su contexto, alcance, estado actual y permiso de publicación. Cada proyecto distingue qué está en producción, qué puede demostrarse y qué debe permanecer reservado.',
  taxonomy: {
    production: 'Soluciones en producción',
    lab: 'Laboratorio FURLANICH',
    prototype: 'Prototipos funcionales',
  },
  confidentiality: {
    heading: 'Alcance de publicación',
    description:
      'La descripción pública está limitada por permisos de publicación y compromisos de confidencialidad. Algunos detalles de implementación no se muestran.',
  },
  finalCta: {
    heading: '¿Necesitás resolver algo parecido?',
    description:
      'Contanos el contexto, el proceso o el sistema que necesitás mejorar. Te respondemos con una evaluación directa del próximo paso.',
    action: {
      label: 'Hablar sobre tu proyecto',
      routeId: 'contact',
    },
  },
  cards: {
    'PROJECT-GRS': {
      title: 'Gestión de reservas para transporte de pasajeros',
      context: 'Transporte de pasajeros',
      maturityLabel: 'Prototipo de reservas',
      summary:
        'Implementación de referencia para gestionar recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros. Se publica como evidencia de implementación; no se afirma uso en producción ni un resultado comercial medido.',
      capabilities: ['Reservas', 'Disponibilidad de asientos', 'Portal de pasajeros'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver proyecto',
    },
    'PROJECT-THE-SYSTEM': {
      title: 'Gestión multiusuario de campañas de rol',
      context: 'Laboratorio FURLANICH · Operaciones para juegos de rol',
      maturityLabel: 'Laboratorio FURLANICH',
      summary:
        'Laboratorio de aplicación web con identidad y acceso, campañas, membresías e invitaciones y límites de suscripción modelados en el código. Se publica como evidencia de implementación; las áreas aún planificadas no se presentan como entregadas.',
      capabilities: ['Identidad y acceso', 'Permisos multiusuario', 'Gestión de campañas'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver proyecto',
    },
    'PROJECT-MPC-ADMIN': {
      title: 'Gestión educativa de producción y stock',
      context: 'Proyecto educativo grupal · Operaciones de manufactura ficticias',
      maturityLabel: 'Prototipo educativo',
      summary:
        'Trabajo grupal de 2021 para una organización ficticia, con flujos de administración de producción, stock, usuarios, registros y datos de maduración. Se publica como evidencia educativa de implementación, no como trabajo de cliente ni sistema en producción.',
      capabilities: ['Producción', 'Inventario', 'Administración'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver proyecto',
    },
  },
  details: {
    'PROJECT-GRS': {
      headerSummary: 'Implementación de referencia para coordinar reservas de transporte de pasajeros. La página documenta alcance e implementación, no uso en producción.',
      evidenceStatement: 'Evidencia de implementación basada en el repositorio público y su historial técnico disponible. La demostración actual no fue revalidada.',
      context: 'El proyecto explora operaciones de recorridos, estaciones, asientos y autogestión para transporte de pasajeros.',
      problem: 'El alcance aborda la coordinación de disponibilidad y reservas que suele repartirse entre operaciones, administración y pasajeros. Esto describe la oportunidad modelada, no un problema confirmado de un cliente.',
      deliveredScope: ['Acceso de cuentas', 'Gestión de recorridos y estaciones', 'Disponibilidad de asientos', 'Creación y cancelación de reservas', 'Autogestión de pasajeros', 'Administración', 'Intercambio de estaciones mediante CSV'],
      capabilities: ['Reservas', 'Disponibilidad de asientos', 'Portal de pasajeros'],
      result: 'Resultado público: evidencia de implementación. No se afirma comportamiento funcional actual, uso en producción, adopción, pagos, uptime ni resultado comercial medido.',
      evidence: {
        links: [{ label: 'Repositorio público aprobado', href: 'https://github.com/Furlanich/GeneralReservationSystem', kind: 'repository' }],
      },
      limitations: 'La demo documentada devolvía 404; el arranque local y los flujos no fueron revalidados; la interfaz de pagos no debe presentarse como implementada.',
      relatedService: { label: 'Sitios y aplicaciones web comerciales', serviceId: 'web' },
      publicationScope: 'La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
      visual: {
        label: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros.',
      },
    },
    'PROJECT-THE-SYSTEM': {
      headerSummary: 'Laboratorio de aplicación web para organizar campañas de rol con identidad, membresías y permisos multiusuario. La página distingue el código existente de las áreas planificadas.',
      evidenceStatement: 'Evidencia de implementación basada en el repositorio público, sus pruebas y su configuración de desarrollo. No se verificó una ejecución actual.',
      context: 'El laboratorio explora operaciones de campañas de rol y los límites de acceso necesarios cuando participan varias personas.',
      problem: 'El alcance modela cómo separar identidad, membresías, invitaciones y permisos alrededor de una campaña. Esto describe una exploración de producto, no una necesidad confirmada de un cliente.',
      deliveredScope: ['Autenticación y verificación de email', 'Recuperación de contraseña', 'Límites de autenticación externa', 'CRUD de campañas', 'Membresías e invitaciones', 'Abstracciones de suscripción/facturación', 'Base de cliente Next.js', 'Pruebas en capas del backend y frontend'],
      capabilities: ['Identidad y acceso', 'Permisos multiusuario', 'Gestión de campañas'],
      result: 'Resultado público: evidencia de implementación. No se afirma ejecución actual, uso en producción, colaboración completa, escenas, activos, notas ni resultado comercial.',
      evidence: {
        links: [{ label: 'Repositorio público aprobado', href: 'https://github.com/Furlanich/The-System', kind: 'repository' }],
      },
      limitations: 'No hay demo pública ni verificación de ejecución actual; varias áreas del blueprint siguen planificadas o scaffolded.',
      relatedService: { label: 'Sitios y aplicaciones web comerciales', serviceId: 'web' },
      publicationScope: 'La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
      visual: {
        label: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción.',
      },
    },
    'PROJECT-MPC-ADMIN': {
      headerSummary: 'Prototipo educativo grupal de administración de producción y stock para una organización ficticia. La página conserva explícitamente su contexto académico.',
      evidenceStatement: 'Evidencia de implementación basada en el repositorio público y el contexto de la competencia técnica de 2021. No se verificó una ejecución actual.',
      context: 'El trabajo modela operaciones administrativas de una fábrica de quesos ficticia dentro de una actividad educativa grupal.',
      problem: 'La consigna exploraba cómo organizar producción, stock, usuarios, registros y datos de maduración en un sistema administrativo. No representa un problema confirmado de una empresa real.',
      deliveredScope: ['Flujos de administración de producción y stock', 'Usuarios', 'Registros', 'Datos de maduración', 'Estructura de la organización ficticia'],
      capabilities: ['Producción', 'Inventario', 'Administración'],
      result: 'Resultado público: evidencia educativa de implementación. No se afirma autoría individual, uso real, despliegue, resultado comercial ni funcionamiento actual.',
      evidence: {
        links: [{ label: 'Repositorio público aprobado', href: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-', kind: 'repository' }],
      },
      limitations: 'El proyecto es trabajo grupal de 2021 para una organización ficticia; no hay verificación actual de ejecución ni material visual autorizado del sistema original.',
      relatedService: { label: 'Sitios y aplicaciones web comerciales', serviceId: 'web' },
      publicationScope: 'La descripción pública está limitada por el contexto educativo y los permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
      visual: {
        label: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual de producción, stock, administración de usuarios, registros y datos de maduración para una organización ficticia.',
      },
    },
  },
} satisfies ProjectsPageContent;
