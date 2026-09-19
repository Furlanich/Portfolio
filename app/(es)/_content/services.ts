import type { ServicesPageContent } from '../../../components/services/content-types';

export const servicesPageContent = {
  locale: 'es',
  routeId: 'services',
  introduction: {
    heading: 'Software para tu negocio',
    description:
      'Sitios web, automatización e integraciones, y mejoras para sistemas existentes. No hace falta tener una solución definida para entender las opciones.',
    indexLabel: 'Ir a un servicio',
    indexItems: [
      { id: 'web', label: 'Sitios y aplicaciones web' },
      { id: 'whatsapp', label: 'WhatsApp e integraciones' },
      { id: 'consulting', label: 'Mantenimiento y consultoría' },
    ],
  },
  services: [
    {
      id: 'web',
      heading: 'Sitios y aplicaciones web',
      lead:
        'Desde presentar tu negocio hasta coordinar pedidos, reservas o acceso de clientes. El alcance depende del proceso que necesitás resolver.',
      workHeading: 'Tipos de trabajo',
      work: [
        'Sitio o catálogo: presentar la oferta.',
        'Pedidos o reservas: organizar solicitudes e integrar proveedores cuando sea viable.',
        'Portal o aplicación: dar acceso y gestionar un proceso específico.',
      ],
      startingHeading: 'Punto de partida',
      startingPoint:
        'Revisar contenido, recorridos y sistemas existentes para acordar qué conviene construir o integrar.',
      fitHeading: 'Buen encaje',
      fit:
        'Un sitio o una herramienta existente puede ser suficiente. El desarrollo a medida tiene sentido cuando el proceso necesita algo que esas opciones no resuelven.',
      boundariesHeading: 'Límites del servicio',
      boundaries:
        'Diseño, contenido, integraciones, administración y pruebas se acuerdan según el proyecto. Marca, producción de contenido, alojamiento, cargos de proveedores, aplicaciones móviles y mantenimiento no están incluidos salvo acuerdo. Los resultados comerciales no se garantizan.',
      evidenceHeading: 'Evidencia disponible',
      evidence:
        'General Reservation System contiene código para reservas de transporte de pasajeros. Su funcionamiento actual no está verificado y no se presenta como trabajo de cliente.',
      evidenceLink: {
        label: 'Ver el proyecto y sus límites',
        slug: 'general-reservation-system',
      },
      action: {
        label: 'Ver contacto',
        routeId: 'contact',
      },
    },
    {
      id: 'whatsapp',
      heading: 'WhatsApp e integraciones',
      lead:
        'Organizá consultas repetidas, solicitudes y avisos, con una persona a cargo cuando el flujo necesita atención.',
      workHeading: 'Tipos de trabajo',
      work: [
        'Un enlace abre una conversación.',
        'Un flujo automatizado organiza pasos.',
        'Un bot ayuda con respuestas definidas.',
        'Una integración conecta sistemas cuando la plataforma y los proveedores lo permiten.',
      ],
      startingHeading: 'Punto de partida',
      startingPoint:
        'Revisar volumen, datos, excepciones y quién atiende cada caso.',
      fitHeading: 'Buen encaje',
      fit:
        'Con pocas consultas, un enlace o respuestas manuales pueden ser suficientes.',
      boundariesHeading: 'Límites del servicio',
      boundaries:
        'La viabilidad depende de las políticas de WhatsApp/Meta, aprobaciones de cuentas y plantillas cuando correspondan, proveedores, costos, datos y sistemas disponibles. FURLANICH no controla esas aprobaciones, disponibilidad, entrega de mensajes ni cambios de precios. Los pagos dependen del proveedor; no se procesan necesariamente dentro de WhatsApp.',
      evidenceHeading: 'Evidencia disponible',
      evidence:
        'Todavía no hay un proyecto público de WhatsApp que podamos mostrar.',
      action: {
        label: 'Ver contacto',
        routeId: 'contact',
      },
    },
    {
      id: 'consulting',
      heading: 'Mejoras para sistemas existentes',
      lead:
        'Investigá fallas, conectá herramientas y evaluá mejoras antes de decidir una reconstrucción.',
      workHeading: 'Tipos de trabajo',
      work: [
        'Diagnóstico y corrección de fallas.',
        'Actualizaciones e integraciones.',
        'Revisión de rendimiento y plan de modernización.',
      ],
      startingHeading: 'Punto de partida',
      startingPoint:
        'Primero se revisa el sistema y los accesos autorizados.',
      fitHeading: 'Buen encaje',
      fit:
        'El diagnóstico define las opciones; las mejoras y el soporte continuo se acuerdan por separado.',
      boundariesHeading: 'Límites del servicio',
      boundaries:
        'Se necesitan accesos autorizados al código, entornos, registros, documentación y personas que conocen el sistema. No incluye por defecto reconstrucción, sistema nuevo, guardias, SLA, certificación, licencias, infraestructura ni tareas de otro proveedor.',
      evidenceHeading: 'Evidencia disponible',
      evidence:
        'El enfoque se apoya en la experiencia técnica de Samuel. Todavía no hay una intervención pública autorizada para mostrar.',
      action: {
        label: 'Ver contacto',
        routeId: 'contact',
      },
    },
  ],
  principles: {
    heading: 'Qué podés esperar de cualquier servicio',
    introduction: 'El servicio cambia; estas decisiones de trabajo no.',
    workingHeading: 'Acuerdo de trabajo',
    workingAgreement:
      'Antes de avanzar se acuerdan alcance, entregables, responsabilidades, validaciones y entrega. Samuel mantiene la responsabilidad técnica, con implementación mantenible y documentación proporcional. El trabajo depende de la participación del negocio y de los accesos necesarios. Costos externos, propiedad, licencias y continuidad se definen en el acuerdo correspondiente.',
  },
  commercialBoundaries: {
    heading: 'Límites comerciales',
    description:
      'El precio y el plazo se definen después de entender y acotar el trabajo. Ninguna descripción de esta página garantiza una métrica de negocio, un plazo fijo, disponibilidad continua ni un resultado que dependa de adopción, contenidos, proveedores o sistemas externos.',
    items: [
      'Hosting, dominios, licencias, medios de pago, mensajería, APIs y suscripciones de terceros se cotizan o contratan por separado salvo inclusión expresa.',
      'El cliente aporta o autoriza contenidos, datos, accesos, cuentas, decisiones y validaciones necesarios para el alcance acordado.',
      'El mantenimiento posterior, los cambios de alcance y el soporte continuo son acuerdos separados.',
      'Un tiempo de respuesta para consultas comerciales no es un SLA de soporte. Cualquier guardia, prioridad o nivel de servicio requiere un acuerdo específico.',
      'Los términos definitivos de pago, aceptación, propiedad, garantía y responsabilidad pertenecen a cada propuesta o contrato y siguen sujetos a revisión comercial y legal.',
    ],
  },
  aiNote: {
    heading: 'IA solo cuando aporta valor',
    description:
      'La IA no es un cuarto servicio ni se incorpora por defecto. Puede formar parte de una automatización o sistema a medida —por ejemplo, para procesar documentos, asistir un flujo interno o interpretar una solicitud acotada— solo cuando aporta valor, puede evaluarse responsablemente y sus proveedores, datos, costos, límites y supervisión quedan explícitos.',
  },
  finalCta: {
    heading: 'Contanos qué necesitás resolver',
    description: 'Explorá el contacto y probá la demostración del formulario.',
    action: {
      label: 'Iniciar una consulta',
      routeId: 'contact',
    },
  },
} satisfies ServicesPageContent;
