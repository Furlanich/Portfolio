import type { ServicesPageContent } from '../../../components/services/content-types';

export const servicesPageContent = {
  locale: 'es',
  routeId: 'services',
  introduction: {
    heading: 'Servicios para resolver necesidades concretas del negocio',
    description:
      'FURLANICH diseña soluciones web, automatizaciones e integraciones, y mejora sistemas existentes. El punto de partida no es una tecnología ni un paquete cerrado: es entender qué está frenando la operación, qué resultado necesitás y si conviene construir, integrar o modernizar.',
    qualification:
      'No hace falta que llegues con una solución definida. Una primera conversación sirve para ordenar el problema y evaluar el camino más razonable.',
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
      eyebrow: 'SERVICE-WEB',
      heading: 'Sitios y aplicaciones web comerciales',
      situation:
        'Tu negocio necesita algo más útil que una presencia web genérica: presentar bien la oferta, recibir pedidos o reservas, cobrar, dar acceso a clientes o trasladar a un sistema un proceso que hoy depende de mensajes, planillas y tareas manuales.',
      situationsHeading: 'Situaciones habituales',
      situations: [
        'El sitio actual quedó desactualizado, no explica bien la propuesta o no facilita una consulta.',
        'Los pedidos, turnos o reservas llegan por varios canales y después hay que reorganizarlos a mano.',
        'Clientes o personal necesitan consultar información, completar gestiones o seguir estados sin depender de una conversación individual.',
        'Un proceso propio del negocio no encaja bien en una herramienta genérica.',
      ],
      outcomeHeading: 'Qué resultado buscamos',
      outcome:
        'Una experiencia web clara y mantenible que ayude a presentar, vender o gestionar un proceso concreto. El resultado puede ser desde un sitio comercial profesional hasta una aplicación operativa a medida; el alcance, el riesgo y la inversión no son equivalentes.',
      levelsHeading: 'Distintos niveles de trabajo web',
      levels: [
        {
          title: 'Sitio comercial o catálogo',
          description:
            'Comunica la propuesta, organiza contenidos y productos, y facilita el próximo paso del visitante.',
        },
        {
          title: 'Flujo de pedidos, reservas o pagos',
          description:
            'Permite iniciar o completar una operación y puede conectarse con calendarios, medios de pago u otras herramientas.',
        },
        {
          title: 'Portal o aplicación web a medida',
          description:
            'Incorpora accesos, estados, reglas del negocio, administración e integraciones para sostener una operación específica.',
        },
      ],
      levelsNote:
        'Estas categorías orientan la conversación; no son planes cerrados ni niveles obligatorios.',
      examplesHeading: 'Ejemplos posibles',
      examples: [
        'Un sitio profesional para una empresa de servicios con consultas bien dirigidas.',
        'Un catálogo que deriva pedidos a un canal acordado o los registra en un sistema.',
        'Un flujo de turnos o reservas con disponibilidad, confirmaciones y administración.',
        'Un portal donde clientes consultan documentación, solicitudes o estados.',
        'Una aplicación web para un circuito interno o comercial que no resuelve un producto estándar.',
      ],
      engagementHeading: 'Un trabajo puede incluir',
      engagement: [
        'diagnóstico del objetivo, usuarios y proceso;',
        'definición de contenidos, recorridos y alcance funcional;',
        'diseño y desarrollo de la experiencia web acordada;',
        'integración con pagos, calendarios, correo, APIs o sistemas existentes cuando sea viable;',
        'pruebas, preparación para publicación y entrega de la documentación acordada.',
      ],
      boundariesHeading: 'No incluye automáticamente',
      boundaries: [
        'identidad de marca, redacción, fotografía, carga masiva o producción de contenido;',
        'hosting, dominio, correo, licencias o comisiones de terceros;',
        'un panel administrativo, aplicación móvil o integración que no figure en el alcance;',
        'mantenimiento continuo después de la entrega;',
        'resultados comerciales, posicionamiento en buscadores o disponibilidad sin interrupciones garantizados.',
      ],
      dependenciesHeading: 'Dependencias externas',
      dependencies:
        'La viabilidad puede depender del hosting, dominio, medios de pago, APIs, calendarios, sistemas existentes y accesos del cliente. Cada proveedor define sus propias condiciones, costos, disponibilidad y límites. La propuesta debe indicar qué integra FURLANICH, qué contrata o administra el cliente y qué supuestos necesitan validación.',
      fitHeading: 'Buen encaje',
      fit:
        'Es una buena opción cuando hay una necesidad comercial u operativa concreta, responsables disponibles para validar el proceso y una razón clara para adaptar la solución al negocio.',
      nonFitHeading: 'Cuándo conviene otra alternativa',
      nonFit:
        'Si un constructor de sitios, una tienda, una agenda o un software existente resuelve bien la necesidad con menor costo y riesgo, FURLANICH puede recomendar configurarlo o integrarlo en lugar de desarrollar desde cero. Si el problema principal es estabilizar un sistema que ya existe, corresponde evaluar Mantenimiento y consultoría de software.',
      evidenceHeading: 'Evidencia disponible',
      evidence:
        'El repositorio conserva un sistema general de reservas publicado por Samuel como evidencia de implementación. Su demostración funcional, sus limitaciones y su presentación comercial todavía están en revisión, por lo que no se presenta como caso de cliente, solución en producción ni resultado verificado.',
      action: {
        label: 'Contanos qué necesitás resolver en la web',
        routeId: 'contact',
      },
    },
    {
      id: 'whatsapp',
      eyebrow: 'SERVICE-WHATSAPP',
      heading: 'Automatización por WhatsApp e integraciones',
      situation:
        'WhatsApp ya es parte de la atención, pero muchas consultas se repiten, los pedidos o reservas quedan en conversaciones difíciles de seguir, y la información después debe copiarse a otra herramienta.',
      situationsHeading: 'Situaciones habituales',
      situations: [
        'El equipo responde las mismas preguntas y solicita los mismos datos una y otra vez.',
        'Pedidos, reservas o confirmaciones se pierden entre chats o dependen de una sola persona.',
        'Hace falta enviar avisos o estados sin sostener cada conversación manualmente.',
        'WhatsApp debería iniciar o consultar una operación registrada en otra herramienta del negocio.',
      ],
      outcomeHeading: 'Qué resultado buscamos',
      outcome:
        'Un recorrido conversacional claro que reduzca trabajo repetitivo, capture la información necesaria y conecte el canal con un proceso útil. Automatizar no significa eliminar toda intervención humana: el diseño debe indicar cuándo responde el sistema, cuándo deriva y qué sucede si no puede continuar.',
      levelsHeading: 'Niveles de alcance posibles',
      levels: [
        {
          title: 'Contacto básico',
          description:
            'Un enlace inicia una conversación; no hay automatización ni integración por el solo hecho de usar WhatsApp.',
        },
        {
          title: 'Flujo automatizado',
          description:
            'Respuestas, preguntas guiadas, registro de datos, confirmaciones o notificaciones dentro de lo permitido por la plataforma.',
        },
        {
          title: 'Interacción asistida por bot',
          description:
            'Una lógica conversacional ayuda a interpretar o resolver solicitudes acotadas y deriva cuando corresponde.',
        },
        {
          title: 'Integración oficial',
          description:
            'La API o un proveedor autorizado conecta WhatsApp con calendarios, pedidos, pagos iniciados externamente, CRM u otros sistemas, si la factibilidad está confirmada.',
        },
      ],
      examplesHeading: 'Ejemplos posibles',
      examples: [
        'responder consultas frecuentes y derivar casos especiales;',
        'tomar datos iniciales para un pedido o una reserva;',
        'confirmar, recordar o notificar estados cuando las reglas aplicables lo permitan;',
        'iniciar un pago mediante un enlace o flujo externo;',
        'consultar o registrar información en un sistema existente.',
      ],
      engagementHeading: 'Un trabajo puede incluir',
      engagement: [
        'análisis de conversaciones, excepciones y puntos de derivación;',
        'diseño del flujo, mensajes y datos necesarios;',
        'configuración o desarrollo de la automatización acordada;',
        'integración con un proveedor oficial y con sistemas del cliente cuando sea viable;',
        'pruebas de recorridos, errores, derivación humana y seguimiento operativo inicial.',
      ],
      boundariesHeading: 'No incluye automáticamente',
      boundaries: [
        'acceso ilimitado a funciones de WhatsApp ni independencia de Meta o del proveedor;',
        'aprobación de cuentas, números, plantillas, categorías o mensajes;',
        'costos de conversaciones, proveedor, infraestructura, IA u otros terceros;',
        'un CRM, sistema de pedidos, agenda o sistema administrativo completo;',
        'atención humana, operación diaria del canal o disponibilidad de soporte permanente;',
        'resultados de venta, tiempos de respuesta o entrega garantizados.',
      ],
      dependenciesHeading: 'Dependencias externas',
      dependencies:
        'Las capacidades reales dependen de las políticas vigentes de WhatsApp y Meta, las plantillas aprobadas cuando correspondan, el proveedor elegido, los costos de terceros, la calidad de los datos, los sistemas del cliente y la factibilidad de cada integración. Estas condiciones se validan antes de cerrar alcance; FURLANICH no controla su aprobación, continuidad ni cambios.',
      fitHeading: 'Buen encaje',
      fit:
        'Es una buena opción cuando existe un flujo repetible, datos definidos, volumen o fricción suficientes para justificar la automatización y una persona responsable de las excepciones y la operación.',
      nonFitHeading: 'Cuándo conviene otra alternativa',
      nonFit:
        'Un enlace directo o respuestas manuales pueden ser suficientes para un volumen bajo. Una función nativa del sistema actual puede ser mejor que una integración nueva. Si no hay un proceso estable, primero conviene ordenarlo; automatizar desorden suele trasladar el problema.',
      evidenceHeading: 'Evidencia disponible',
      evidence:
        'Hoy no hay un proyecto público de automatización por WhatsApp que cumpla los requisitos de verificación y publicación de FURLANICH. La oferta se explica por su alcance y sus límites, no mediante un caso, una certificación o un resultado que el repositorio no puede respaldar.',
      action: {
        label: 'Conversemos sobre tu flujo por WhatsApp',
        routeId: 'contact',
      },
    },
    {
      id: 'consulting',
      eyebrow: 'SERVICE-CONSULTING',
      heading: 'Mantenimiento y consultoría de software',
      situation:
        'Ya existe un sistema, pero falla, quedó desactualizado, cuesta modificarlo, rinde mal o depende de decisiones técnicas que nadie tiene claras. Antes de reemplazarlo, necesitás entender qué pasa, qué riesgo existe y qué conviene hacer.',
      situationsHeading: 'Situaciones habituales',
      situations: [
        'Un defecto reaparece o no se conoce su causa.',
        'Una actualización de framework, dependencia o plataforma quedó postergada y bloquea cambios.',
        'El sistema se volvió lento, inestable o difícil de desplegar y mantener.',
        'Una integración dejó de funcionar o hace falta conectar el sistema con otra herramienta.',
        'Hay deuda técnica, documentación insuficiente o dudas entre reparar, modernizar o reconstruir.',
      ],
      outcomeHeading: 'Qué resultado buscamos',
      outcome:
        'Un diagnóstico claro y una mejora proporcionada al problema: estabilizar lo crítico, reducir riesgos, recuperar capacidad de cambio o definir un camino de modernización. La consultoría puede terminar en recomendaciones, en una intervención técnica acordada o en continuidad por separado.',
      levels: [],
      examplesHeading: 'Ejemplos posibles',
      examples: [
        'investigar y corregir defectos reproducibles;',
        'estabilizar un sistema o una entrega;',
        'actualizar dependencias, frameworks o plataformas;',
        'mejorar rendimiento, confiabilidad, pruebas o despliegue;',
        'integrar APIs, servicios o fuentes de datos;',
        'revisar arquitectura y deuda técnica;',
        'planificar una modernización por etapas;',
        'brindar mantenimiento o apoyo técnico continuo mediante un acuerdo específico.',
      ],
      engagementHeading: 'Un trabajo puede incluir',
      engagement: [
        'relevamiento de síntomas, contexto, código, registros y entornos disponibles;',
        'reproducción y priorización de problemas;',
        'revisión de arquitectura, dependencias, riesgos y mantenibilidad;',
        'plan de estabilización o modernización con alternativas, ventajas y límites;',
        'implementación y validación de las correcciones o mejoras incluidas en el alcance;',
        'documentación, transferencia y continuidad acordadas.',
      ],
      boundariesHeading: 'No incluye automáticamente',
      boundaries: [
        'reconstruir el sistema completo o desarrollar uno nuevo;',
        'corregir problemas que no pueden observarse por falta de acceso o evidencia;',
        'soporte de guardia, respuesta a incidentes o un acuerdo de nivel de servicio (SLA);',
        'auditoría legal, certificación de seguridad o garantía de ausencia de defectos;',
        'licencias, infraestructura, servicios de terceros o trabajo de otros proveedores;',
        'mantenimiento posterior a la intervención.',
      ],
      dependenciesHeading: 'Dependencias externas',
      dependencies:
        'El diagnóstico depende del acceso autorizado a código, documentación, registros, entornos, datos adecuados y personas que conozcan la operación. Sistemas de terceros, licencias, versiones sin soporte, proveedores, infraestructura y restricciones contractuales pueden limitar las opciones. Antes de intervenir se acuerdan accesos, copias de seguridad, entornos y responsabilidades.',
      fitHeading: 'Buen encaje',
      fit:
        'Es una buena opción cuando existe un sistema identificable, hay acceso legítimo suficiente para investigarlo y el negocio necesita recuperar estabilidad, capacidad de cambio o una dirección técnica concreta.',
      nonFitHeading: 'Cuándo conviene otra alternativa',
      nonFit:
        'Si el producto estándar todavía tiene soporte, puede corresponder trabajar con su proveedor. Si la necesidad es menor y ya está cubierta por una herramienta existente, conviene configurarla antes que reemplazarla. Si no existe un sistema y el objetivo es crear uno nuevo, el trabajo debe tratarse como un proyecto de desarrollo, no como mantenimiento.',
      evidenceHeading: 'Evidencia disponible',
      evidence:
        'Hoy no hay una intervención pública de mantenimiento o consultoría con alcance, permiso y resultado verificables. FURLANICH no publica detalles confidenciales ni convierte experiencia general en un caso de éxito. Hasta contar con evidencia autorizada, esta sección se sostiene en un alcance explícito y una forma de trabajo verificable.',
      action: {
        label: 'Contanos qué pasa con tu sistema',
        routeId: 'contact',
      },
    },
  ],
  principles: {
    heading: 'Qué podés esperar de cualquier servicio',
    introduction: 'El servicio cambia; estas decisiones de trabajo no.',
    items: [
      {
        title: 'Entender antes de construir',
        description:
          'Primero se ordenan el problema, las personas involucradas y el resultado esperado.',
      },
      {
        title: 'Elegir entre construir, integrar o modernizar',
        description:
          'Una solución a medida se recomienda cuando aporta valor frente a una herramienta existente.',
      },
      {
        title: 'Definir un alcance comprobable',
        description:
          'Entregables, exclusiones, supuestos y criterios de validación quedan explícitos antes de comprometer el trabajo.',
      },
      {
        title: 'Validar de manera incremental',
        description:
          'Cuando el proyecto lo permite, los recorridos importantes se revisan antes de la entrega final.',
      },
      {
        title: 'Hacer visibles las dependencias',
        description:
          'Proveedores, accesos, datos, contenidos y decisiones del cliente forman parte de la factibilidad y del cronograma.',
      },
      {
        title: 'Cuidar la continuidad',
        description:
          'Se priorizan una implementación mantenible, documentación proporcional y responsabilidad técnica directa de Samuel.',
      },
    ],
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
    description:
      'No hace falta elegir un servicio antes de escribir. Explicanos qué está pasando, cómo funciona hoy y qué te gustaría mejorar. Samuel revisará personalmente la consulta para evaluar si FURLANICH puede ayudarte y cuál sería el próximo paso razonable.',
    responseStatement:
      'Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.',
    action: {
      label: 'Iniciar una consulta',
      routeId: 'contact',
    },
  },
} satisfies ServicesPageContent;
