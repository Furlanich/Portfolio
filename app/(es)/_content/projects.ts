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
      actionLabel: 'Ver código fuente',
    },
    'PROJECT-THE-SYSTEM': {
      title: 'Gestión multiusuario de campañas de rol',
      context: 'Laboratorio FURLANICH · Operaciones para juegos de rol',
      maturityLabel: 'Laboratorio FURLANICH',
      summary:
        'Laboratorio de aplicación web con identidad y acceso, campañas, membresías e invitaciones y límites de suscripción modelados en el código. Se publica como evidencia de implementación; las áreas aún planificadas no se presentan como entregadas.',
      capabilities: ['Identidad y acceso', 'Permisos multiusuario', 'Gestión de campañas'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver código fuente',
    },
    'PROJECT-MPC-ADMIN': {
      title: 'Gestión educativa de producción y stock',
      context: 'Proyecto educativo grupal · Operaciones de manufactura ficticias',
      maturityLabel: 'Prototipo educativo',
      summary:
        'Trabajo grupal de 2021 para una organización ficticia, con flujos de administración de producción, stock, usuarios, registros y datos de maduración. Se publica como evidencia educativa de implementación, no como trabajo de cliente ni sistema en producción.',
      capabilities: ['Producción', 'Inventario', 'Administración'],
      evidenceSignal: 'Código fuente público',
      actionLabel: 'Ver código fuente',
    },
  },
  details: {},
} satisfies ProjectsPageContent;
