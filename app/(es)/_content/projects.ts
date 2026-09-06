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
  cards: {},
  details: {},
} satisfies ProjectsPageContent;
