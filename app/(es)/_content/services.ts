import type { ServicesPageContent } from '../../../components/services/content-types';

// PLAN-SPF-V1 Task 6. Exact copy from docs/product/pages/services.md: the "SPF-V1 proposed Services
// copy" table (APPROVED 2026-09-30), the D05 compressed boundaries, the shared working agreement, the
// complete Límites comerciales block and the AI note, which stay verbatim. `scripts/services-content.test.mjs`
// reads that record and compares every field.
export const servicesPageContent = {
  locale: 'es',
  routeId: 'services',
  introduction: {
    heading: 'Software para que el trabajo avance.',
    description:
      'Sitios, aplicaciones e integraciones para resolver necesidades concretas. Empezamos por el problema y acordamos qué construir, conectar o mejorar.',
    catalogueLabel: 'Encontrá tu punto de partida',
    catalogueAction: 'Explorar el servicio',
  },
  sceneCaption: 'Capacidades conectadas · modelo ilustrativo',
  services: [
    {
      id: 'web',
      family: 'Sitios y aplicaciones web',
      headline: 'Una interfaz clara para el negocio.',
      catalogueSummary: 'Una presencia clara. Una operación más simple.',
      outcome: 'Un sitio comercial, un portal o una aplicación según el problema.',
      deliveryHeading: 'Qué recibís',
      delivery: 'Un sitio o aplicación, recorridos acordados y documentación proporcional al alcance.',
      situationsHeading: 'Situaciones habituales',
      situations: 'Publicar una oferta; gestionar reservas o pedidos; coordinar información en una aplicación.',
      startingHeading: 'Punto de partida',
      startingPoint: 'El objetivo, los recorridos principales y los datos necesarios.',
      scopeHeading: 'Alcance acordado',
      scope: 'Hosting, licencias e integraciones se definen según lo que el proyecto necesita.',
      boundariesHeading: 'Límites del servicio',
      boundaries:
        'Diseño, contenido, integraciones, administración y pruebas se acuerdan según el proyecto. Marca, producción de contenido, alojamiento, cargos de proveedores, aplicaciones móviles y mantenimiento no están incluidos salvo acuerdo. Los resultados comerciales no se garantizan.',
      evidenceHeading: 'Evidencia',
      evidence: 'Evidencia disponible: prototipo de reservas, con código público y ejecución actual no revalidada.',
      evidenceLink: {
        label: 'Examinar el prototipo de reservas',
        slug: 'general-reservation-system',
      },
      action: {
        label: 'Contanos qué necesitás resolver',
        routeId: 'contact',
      },
    },
    {
      id: 'whatsapp',
      family: 'Integraciones y automatización',
      headline: 'Las herramientas dejan de trabajar aisladas.',
      catalogueSummary: 'Menos traspasos manuales.',
      outcome: 'Flujos y datos conectados para reducir traspasos manuales.',
      deliveryHeading: 'Qué recibís',
      delivery: 'Un flujo integrado, sus límites y una forma acordada de comprobarlo.',
      situationsHeading: 'Situaciones habituales',
      situations: 'Información que se copia entre herramientas; pedidos o consultas que se pierden entre mensajes.',
      startingHeading: 'Punto de partida',
      startingPoint: 'Mapear el flujo actual y comprobar acceso a herramientas, APIs y datos.',
      scopeHeading: 'Alcance acordado',
      scope:
        'WhatsApp requiere un proveedor habilitado y aprobaciones. Definimos qué se automatiza y dónde interviene una persona.',
      boundariesHeading: 'Límites del servicio',
      boundaries:
        'La viabilidad depende de las políticas de WhatsApp/Meta, aprobaciones de cuentas y plantillas cuando correspondan, proveedores, costos, datos y sistemas disponibles. FURLANICH no controla esas aprobaciones, disponibilidad, entrega de mensajes ni cambios de precios. Los pagos dependen del proveedor; no se procesan necesariamente dentro de WhatsApp.',
      evidenceHeading: 'Evidencia',
      evidence: 'No se publica actualmente un caso verificado de este servicio. El modelo de fondo es ilustrativo.',
      action: {
        label: 'Contanos qué necesitás resolver',
        routeId: 'contact',
      },
    },
    {
      id: 'consulting',
      family: 'Mejora de software existente',
      headline: 'Un sistema que puede seguir evolucionando.',
      catalogueSummary: 'Mejorá lo que ya tenés.',
      outcome: 'Diagnóstico, mantenimiento y modernización con prioridades claras.',
      deliveryHeading: 'Qué recibís',
      delivery: 'Un diagnóstico acotado, mejoras priorizadas y próximos pasos acordados.',
      situationsHeading: 'Situaciones habituales',
      situations: 'Errores recurrentes, tareas lentas, software heredado o una integración que necesita continuidad.',
      startingHeading: 'Punto de partida',
      startingPoint: 'Revisar el código, el entorno y el problema. Acordar primero una intervención acotada.',
      scopeHeading: 'Alcance acordado',
      scope: 'Definimos prioridades, responsabilidades y una modalidad de soporte o mantenimiento adecuada.',
      boundariesHeading: 'Límites del servicio',
      boundaries:
        'Se necesitan accesos autorizados al código, entornos, registros, documentación y personas que conocen el sistema. No incluye por defecto reconstrucción, sistema nuevo, guardias, SLA, certificación, licencias, infraestructura ni tareas de otro proveedor.',
      evidenceHeading: 'Evidencia',
      evidence: 'No se publica actualmente un caso verificado de este servicio. El modelo de fondo es ilustrativo.',
      action: {
        label: 'Contanos qué necesitás resolver',
        routeId: 'contact',
      },
    },
  ],
  workingBoundariesLabel: 'Ver condiciones de trabajo',
  principles: {
    heading: 'Alcance claro. Entregas revisables.',
    statements: [
      'Definimos responsabilidades, recorridos y criterios de aceptación antes de construir.',
      'La documentación y el traspaso son proporcionales al alcance. Mantenimiento y soporte se acuerdan de forma explícita.',
      'IA cuando aporta una función concreta, con sus límites y supervisión definidos. No es una promesa de automatización total.',
    ],
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
    scope: 'Chatbots y agentes se evalúan con alcance, datos, proveedores, costos, límites y supervisión humana acordados.',
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
