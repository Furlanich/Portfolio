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
        'Código para gestionar recorridos, estaciones, asientos y reservas de transporte de pasajeros.',
      relationship: 'Prototipo publicado por Samuel; hay otro colaborador en el repositorio. No es un trabajo de cliente ni una entrega en producción.',
      limitation: 'Demostración pública no disponible; el comportamiento actual no fue revalidado.',
      capabilities: ['Reservas', 'Disponibilidad de asientos', 'Portal de pasajeros'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver proyecto',
    },
    'PROJECT-THE-SYSTEM': {
      title: 'Gestión multiusuario de campañas de rol',
      context: 'Laboratorio FURLANICH · Operaciones para juegos de rol',
      maturityLabel: 'Laboratorio FURLANICH',
      summary:
        'Laboratorio de campañas de rol con código para cuentas, membresías, invitaciones y permisos.',
      relationship: 'Laboratorio publicado por Samuel, sin relación de cliente ni entrega en producción.',
      limitation: 'No hay demo pública ni verificación actual de ejecución; no se afirma uso en producción.',
      capabilities: ['Identidad y acceso', 'Permisos multiusuario', 'Gestión de campañas'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver proyecto',
    },
    'PROJECT-MPC-ADMIN': {
      title: 'Gestión educativa de producción y stock',
      context: 'Proyecto educativo grupal · Operaciones de manufactura ficticias',
      maturityLabel: 'Prototipo educativo',
      summary:
        'Proyecto educativo grupal de 2021 para administrar producción y stock de una fábrica de quesos ficticia.',
      relationship: 'Trabajo educativo grupal; no representa un cliente, un empleo ni una entrega de FURLANICH.',
      limitation: 'Sin verificación actual de ejecución; no se afirma autoría individual, uso real ni resultado comercial.',
      capabilities: ['Producción', 'Inventario', 'Administración'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver proyecto',
    },
  },
  details: {
    'PROJECT-GRS': {
      founderAction: {
        label: 'Conocer a Samuel',
        routeId: 'founder',
      },
      headerSummary: 'Código para gestionar recorridos, estaciones, asientos y reservas de transporte de pasajeros.',
      evidenceStatement: 'Evidencia de implementación basada en el repositorio público y su historial técnico disponible. La demostración actual no fue revalidada.',
      relationship: 'Prototipo publicado por Samuel; hay otro colaborador en el repositorio. No es un trabajo de cliente ni una entrega en producción.',
      context: 'El proyecto explora operaciones de recorridos, estaciones, asientos y autogestión para transporte de pasajeros.',
      problem: 'El alcance aborda la coordinación de disponibilidad y reservas que suele repartirse entre operaciones, administración y pasajeros. Esto describe la oportunidad modelada, no un problema confirmado de un cliente.',
      deliveredScope: ['Acceso de cuentas', 'Gestión de recorridos y estaciones', 'Disponibilidad de asientos', 'Creación y cancelación de reservas', 'Autogestión de pasajeros', 'Administración', 'Intercambio de estaciones mediante CSV'],
      capabilities: ['Reservas', 'Disponibilidad de asientos', 'Portal de pasajeros'],
      result: 'Resultado público: evidencia de implementación. No se afirma comportamiento funcional actual, uso en producción, adopción, pagos, uptime ni resultado comercial medido.',
      evidence: {
        links: [{ label: 'Repositorio público aprobado', href: 'https://github.com/Furlanich/GeneralReservationSystem', kind: 'repository' }],
      },
      limitations: 'No hay una demostración pública verificada. El funcionamiento actual no fue revalidado y la interfaz de pagos no se presenta como implementada. No se afirman adopción, disponibilidad ni resultados comerciales.',
      relatedService: { label: 'Sitios y aplicaciones web comerciales', serviceId: 'web', visibility: 'public' },
      publicationScope: 'La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
      visual: {
        label: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros.',
      },
    },
    'PROJECT-THE-SYSTEM': {
      founderAction: {
        label: 'Conocer a Samuel',
        routeId: 'founder',
      },
      headerSummary: 'Laboratorio de campañas de rol con código para cuentas, membresías, invitaciones y permisos.',
      evidenceStatement: 'Evidencia de implementación basada en el repositorio público, sus pruebas y su configuración de desarrollo. No se verificó una ejecución actual.',
      relationship: 'Laboratorio publicado por Samuel, sin relación de cliente ni entrega en producción.',
      context: 'El laboratorio explora operaciones de campañas de rol y los límites de acceso necesarios cuando participan varias personas.',
      problem: 'El alcance modela cómo separar identidad, membresías, invitaciones y permisos alrededor de una campaña. Esto describe una exploración de producto, no una necesidad confirmada de un cliente.',
      deliveredScope: ['Autenticación y verificación de email', 'Recuperación de contraseña', 'Límites de autenticación externa', 'CRUD de campañas', 'Membresías e invitaciones', 'Abstracciones de suscripción/facturación', 'Base de cliente Next.js', 'Pruebas en capas del backend y frontend'],
      capabilities: ['Identidad y acceso', 'Permisos multiusuario', 'Gestión de campañas'],
      result: 'Resultado público: evidencia de implementación. No se afirma ejecución actual, uso en producción, colaboración completa, escenas, activos, notas ni resultado comercial.',
      evidence: {
        links: [{ label: 'Repositorio público aprobado', href: 'https://github.com/Furlanich/The-System', kind: 'repository' }],
      },
      limitations: 'No hay demostración pública ni ejecución actual verificada. La suscripción está modelada en el código; no se presenta como facturación operativa. Escenas, activos, notas y colaboración completa no se presentan como entregados.',
      relatedService: { label: 'Sitios y aplicaciones web comerciales', serviceId: 'web', visibility: 'public' },
      publicationScope: 'La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
      visual: {
        label: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción.',
      },
    },
    'PROJECT-MPC-ADMIN': {
      founderAction: {
        label: 'Conocer la trayectoria de Samuel',
        routeId: 'founder',
      },
      headerSummary: 'Proyecto educativo grupal de 2021 para administrar producción y stock de una fábrica de quesos ficticia.',
      evidenceStatement: 'Evidencia de implementación basada en el repositorio público y el contexto de la competencia técnica de 2021. No se verificó una ejecución actual.',
      relationship: 'Trabajo educativo grupal; no representa un cliente, un empleo ni una entrega de FURLANICH.',
      context: 'El trabajo modela operaciones administrativas de una fábrica de quesos ficticia dentro de una actividad educativa grupal.',
      problem: 'La consigna exploraba cómo organizar producción, stock, usuarios, registros y datos de maduración en un sistema administrativo. No representa un problema confirmado de una empresa real.',
      deliveredScope: ['Flujos de administración de producción y stock', 'Usuarios', 'Registros', 'Datos de maduración', 'Estructura de la organización ficticia'],
      capabilities: ['Producción', 'Inventario', 'Administración'],
      result: 'Resultado público: evidencia educativa de implementación. No se afirma autoría individual, uso real, despliegue, resultado comercial ni funcionamiento actual.',
      evidence: {
        links: [{ label: 'Repositorio público aprobado', href: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-', kind: 'repository' }],
      },
      limitations: 'No se verificó su funcionamiento actual. No se afirma autoría individual, uso real, despliegue ni resultado comercial. No hay material visual autorizado del sistema original.',
      relatedService: { label: 'Sitios y aplicaciones web comerciales', serviceId: 'web', visibility: 'internal' },
      publicationScope: 'La descripción pública está limitada por el contexto educativo y los permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
      visual: {
        label: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual de producción, stock, administración de usuarios, registros y datos de maduración para una organización ficticia.',
      },
    },
  },
} satisfies ProjectsPageContent;
