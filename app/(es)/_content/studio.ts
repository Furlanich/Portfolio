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
      'Samuel Furlanich participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. La responsabilidad tiene un nombre y se mantiene durante el proyecto.',
    ],
  },
  collaboratorModel: {
    heading: 'Colaboración según el alcance',
    paragraphs: ['Cuando el alcance requiere otra especialidad, se acuerda la participación de colaboradores y sus responsabilidades. Samuel mantiene la dirección técnica.'],
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
    description: 'Desde Buenos Aires, Argentina, con disponibilidad para proyectos en el país y el exterior. Comunicación en español e inglés.',
  },
  founderBridge: {
    heading: 'La persona detrás de la dirección técnica',
    description: 'Conocé la experiencia y formación de quien dirige el trabajo.',
    action: { label: 'Conocer a Samuel', routeId: 'founder' },
  },
  finalCta: {
    heading: 'Conversemos sobre lo que hoy frena a tu negocio',
    description: 'Explorá las opciones de contacto y la demostración del formulario.',
    action: { label: 'Iniciar una consulta', routeId: 'contact' },
  },
} satisfies StudioPageContent;
