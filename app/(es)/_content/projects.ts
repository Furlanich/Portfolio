import type { ProjectsPageContent } from '../../../components/projects/content-types';

// Exact approved copy: docs/product/pages/projects.md#spf-v1-proposed-projects-copy-and-inline-presentation
// (APPROVED 2026-09-30). `scripts/projects-publication.test.mjs` compares every string below with that table.
export const projectPageContent = {
  locale: 'es',
  routeId: 'projects',
  heading: 'Trabajo que podés examinar.',
  introduction:
    'Código e implementación con su contexto y sus límites. Cada proyecto declara qué se hizo y qué evidencia está disponible.',
  sourceAction: 'Ver código fuente',
  relatedServiceAction: 'Sitios y aplicaciones web',
  founderAction: {
    label: 'Conocer a Samuel',
    routeId: 'founder',
  },
  disclosure: {
    heading: 'El contexto importa.',
    description:
      'Cada dossier mantiene su madurez, relación y límites de publicación. Las ilustraciones explican el alcance; no son capturas del producto ni pruebas de operación.',
  },
  sceneCaption: 'Capacidades conectadas · modelo ilustrativo',
  dossiers: {
    'PROJECT-GRS': {
      jumpLabel: 'Reservas de transporte',
      title: 'Gestión de reservas para transporte de pasajeros',
      maturityLabel: 'Prototipo de reservas',
      summary: 'Coordinar recorridos, estaciones, asientos y autogestión de pasajeros.',
      relationship:
        'Repositorio publicado por el fundador con otro colaborador. No se presenta como trabajo para un cliente.',
      visual: {
        caption: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros.',
      },
      opportunity: {
        heading: 'La oportunidad modelada',
        content:
          'El alcance modela una oportunidad de coordinación en transporte de pasajeros; no es un problema confirmado de un cliente.',
      },
      scope: {
        heading: 'Alcance implementado',
        items: [
          'Acceso de cuentas y administración',
          'Recorridos, estaciones y disponibilidad de asientos',
          'Creación y cancelación de reservas',
          'Autogestión de pasajeros e intercambio de estaciones mediante CSV',
        ],
      },
      evidence: {
        heading: 'Qué podés comprobar',
        content:
          'El resultado público es evidencia de implementación: código, proyectos de pruebas, configuración Docker e historial técnico disponible. Un historial exitoso de CI no demuestra operación actual.',
      },
      limits: {
        heading: 'Límites de la evidencia',
        content:
          'La demo documentada no está disponible y la ejecución actual no fue revalidada. No se afirma uso en producción, pagos implementados, adopción, uptime ni un resultado comercial medido.',
      },
    },
    'PROJECT-THE-SYSTEM': {
      jumpLabel: 'Campañas multiusuario',
      title: 'Gestión multiusuario de campañas de rol',
      maturityLabel: 'Laboratorio FURLANICH',
      summary: 'Organizar campañas de rol con identidad, membresías e invitaciones.',
      relationship:
        'Exploración de laboratorio publicada por el fundador. El dominio es la gestión de campañas de rol.',
      visual: {
        caption: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción.',
      },
      opportunity: {
        heading: 'La oportunidad modelada',
        content:
          'El laboratorio explora límites de acceso y organización multiusuario. No se presenta como una necesidad confirmada de un cliente.',
      },
      scope: {
        heading: 'Alcance implementado',
        items: [
          'Identidad, autenticación y recuperación de cuentas',
          'Campañas, membresías e invitaciones',
          'Permisos multiusuario',
          'Abstracciones de suscripción/facturación y base de cliente web',
        ],
      },
      evidence: {
        heading: 'Qué podés comprobar',
        content:
          'El resultado público es evidencia de implementación: repositorio, pruebas en capas de backend y frontend y configuración de desarrollo.',
      },
      limits: {
        heading: 'Límites de la evidencia',
        content:
          'No hay demo pública ni verificación de ejecución actual. La suscripción está modelada en el código; no se presenta como facturación operativa. Escenas, activos, notas y colaboración completa no se presentan como entregados. No se afirma uso en producción.',
      },
    },
  },
} satisfies ProjectsPageContent;
