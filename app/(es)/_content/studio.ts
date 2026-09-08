import type { StudioPageContent } from '../../../components/studio/content-types';

export const studioPageContent = {
  locale: 'es',
  routeId: 'studio',
  intro: {
    eyebrow: 'Estudio de software liderado por su fundador',
    heading: 'Software a medida con responsabilidad técnica directa.',
    positioning:
      'FURLANICH diseña, desarrolla y mejora software a medida para negocios que necesitan resolver procesos concretos. Samuel Furlanich conduce el relevamiento, la dirección técnica y la entrega, con decisiones explícitas y sistemas pensados para mantenerse.',
    supportingStatement:
      'Cuando el alcance requiere especialidades adicionales, se incorporan colaboradores de forma explícita.',
    primaryAction: { label: 'Contanos qué necesitás resolver', routeId: 'contact' },
    secondaryAction: { label: 'Conocer a Samuel', routeId: 'founder' },
  },
  operatingModel: {
    label: 'Modelo de trabajo',
    items: ['Liderado por su fundador', 'Responsabilidad técnica directa', 'Buenos Aires, Argentina', 'Español e inglés', 'Colaboradores especializados según el alcance'],
  },
  accountability: {
    heading: 'Dirección técnica de principio a fin',
    paragraphs: [
      'Samuel lidera el relevamiento inicial, define la dirección técnica y permanece involucrado durante la entrega. La conversación comercial y las decisiones técnicas no quedan separadas por capas de venta o gestión que oculten quién responde por el trabajo.',
      'Esta continuidad reduce pérdidas de contexto, permite explicar los compromisos con claridad y mantiene visible la responsabilidad sobre lo que se decide, se construye y se entrega.',
    ],
  },
  collaboratorModel: {
    heading: 'Colaboración según el alcance',
    paragraphs: ['FURLANICH está liderado por Samuel. Cuando un proyecto requiere experiencia fuera del alcance principal de entrega, pueden incorporarse colaboradores especializados de forma explícita. Su participación depende de las necesidades del proyecto y no cambia quién conduce la dirección técnica ni quién responde por la entrega.'],
  },
  principles: {
    heading: 'Principios para trabajar con claridad',
    introduction: 'No reemplazan el proceso de cada proyecto: explican los criterios que orientan las decisiones y reducen riesgo para el negocio.',
    items: [
      { title: 'Entender antes de construir.', description: 'Primero se ordenan el problema, las personas involucradas, las restricciones y el resultado esperado, para evitar invertir en la solución equivocada.' },
      { title: 'Definir el alcance con claridad.', description: 'Objetivos, entregables, límites, responsabilidades y criterios de validación quedan explícitos para que ambas partes sepan qué se va a resolver.' },
      { title: 'Validar de forma incremental.', description: 'Los recorridos importantes se revisan mediante entregas verificables para detectar desvíos temprano y reducir riesgo.' },
      { title: 'Construir para mantener.', description: 'La arquitectura, las pruebas y la documentación se ajustan al alcance para que la solución pueda evolucionar sin depender de decisiones opacas.' },
    ],
  },
  location: {
    heading: 'Base en Buenos Aires, disponibilidad nacional e internacional',
    description: 'FURLANICH trabaja desde Buenos Aires, Argentina, con proyectos en todo el país y disponibilidad para colaboraciones internacionales. La comunicación puede desarrollarse en español o en inglés.',
  },
  founderBridge: {
    heading: 'La persona detrás de la dirección técnica',
    description: 'Samuel Furlanich es el fundador y responsable técnico directo de FURLANICH. Su experiencia combina desarrollo backend con .NET, interfaces web, sistemas de gestión, automatizaciones y mantenimiento de software. En su perfil profesional podés consultar la biografía completa, experiencia, formación, capacidades, trabajo seleccionado, CV y enlaces profesionales.',
    action: { label: 'Conocer a Samuel', routeId: 'founder' },
  },
  finalCta: {
    heading: 'Conversemos sobre lo que hoy frena a tu negocio',
    description: 'Contanos qué necesitás resolver y cómo funciona hoy. Samuel revisará personalmente la consulta para evaluar el próximo paso razonable.',
    action: { label: 'Iniciar una consulta', routeId: 'contact' },
  },
} satisfies StudioPageContent;