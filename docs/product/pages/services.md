---
id: PAGE-SERVICES
type: page-spec
status: APPROVED
related:
  - AUDIENCES-SERVICES
  - SERVICE-WEB
  - SERVICE-WHATSAPP
  - SERVICE-CONSULTING
  - PAGE-CONTACT
  - PROJECT-EVIDENCE
  - CONTENT-LOCALIZATION
  - DELIVERY-BOUNDARIES
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-SERVICES-EXPERIENCE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-05
---

# Services page

## Responsibility

Explain the three launch services in enough detail for a non-technical business decision-maker to recognize a problem, understand the relevant service and likely outcome, evaluate fit and limitations, see the available evidence honestly, and continue to an inquiry. The page does not promise a packaged solution before discovery and does not lead with technology.

## Initiative 3 decision closure — APPROVED

The complete Services experience is approved in Spanish and English. Exact public copy, section order, contextual CTAs, evidence treatment, anchors, commercial boundaries, AI posture, and implementation-readiness status are owned here. Service definitions are owned by [`AUDIENCES-SERVICES`](../audiences-and-services.md); evidence eligibility is owned by [`PROJECT-EVIDENCE`](../project-evidence.md); visual and interaction rules are owned by [`DESIGN-VISUAL`](../../design/visual-language.md#services-page-visual-baseline-approved) and [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#services-page-interaction-and-responsive-baseline-approved).

The page fits the accepted localized App Router architecture. Each locale may continue to own typed content and pass it to shared locale-agnostic Server Components. No new route, service subpage, runtime localization mechanism, dependency, CMS, backend, hosting change, generalized content platform, or new design-system architecture is required. Implementation is substantial and should proceed through a versioned execution plan under `ADR-STATIC-LOCALIZED-ROUTING`; no RFC or new ADR is required.

## Page-level information architecture — APPROVED

1. Services-page introduction focused on business needs, including a compact in-page service index.
2. `SERVICE-WEB`.
3. `SERVICE-WHATSAPP`.
4. `SERVICE-CONSULTING`.
5. Cross-service working principles and boundaries.
6. Contact CTA.

The service order is retained because it moves from the broadest, most familiar customer-facing need to a more provider-constrained channel and then to work on an existing system. It does not imply relative maturity, price, or priority.

The compact service index is part of the introduction rather than a new marketing section. It solves scanning, keyboard navigation, shareability, and return navigation on a long page. It is non-sticky and wraps normally; a sticky rail was rejected because it would add persistent interface weight and mobile complexity without improving comprehension. FAQ, pricing, technology catalogue, testimonials, individual service pages, and a fourth AI service are not added because current evidence and product strategy do not justify them.

## Stable service anchors — APPROVED

| Service | Spanish | English |
| --- | --- | --- |
| `SERVICE-WEB` | `/servicios/#web` | `/en/services/#web` |
| `SERVICE-WHATSAPP` | `/servicios/#whatsapp` | `/en/services/#whatsapp` |
| `SERVICE-CONSULTING` | `/servicios/#consultoria` | `/en/services/#consulting` |

These identifiers remain stable if a visible heading changes. They support the in-page index, direct sharing, and future contextual links without creating new routes. Equivalent-language switching from an anchored service should preserve the corresponding service fragment when implementation makes that context available; route-level switching remains a valid fallback.

The approved homepage keeps its single section-level Services CTA to the page root. This initiative does not make homepage service cards interactive or add three competing deep links. Future links from another relevant context may use the fragments when their link purpose is explicit.

## Repeated service-section content order — APPROVED

1. Recognizable client situation.
2. Intended outcome.
3. Representative use cases.
4. What a typical engagement may include.
5. Boundaries and third-party dependencies.
6. Fit and non-fit.
7. Evidence status.
8. Contextual CTA to `PAGE-CONTACT`.

This consistency helps comparison without presenting artificial packages. Lists describe possibilities, not an automatic bundle.

## Homepage-foundation minimum destination — APPROVED

Before `HOME-HERO` is integrated, `/servicios/` and `/en/services/` must be real, localized, and useful routes rather than placeholders. They do not need the complete evidence catalogue, FAQ, service-specific detail pages, or final commercial terms.

The minimum Spanish route uses the approved `HOME-SERVICES` heading, introduction, three service titles, and summaries, followed by `Contanos qué necesitás resolver` → `/contacto/`.

The minimum English route uses:

**H1**

> Services for concrete business needs

**Introduction**

> We do not force a generic platform. First we understand the process, then decide whether building, integrating, or modernizing is the right approach.

**Business websites and web applications**

> Web solutions that help businesses present, sell, or manage services: professional websites, catalogues, ordering, bookings, customer portals, and payment integrations.

**WhatsApp automation and integrations**

> Flows for answering common questions, capturing orders, managing bookings, sending confirmations, and connecting WhatsApp with other business tools.

**Software maintenance and IT consulting**

> Diagnosis and improvement of existing systems to solve problems, reduce risk, and define a maintainable technical path.

**CTA:** `Tell us what you need to solve` → `/en/contact/`

A bare “coming soon” destination was rejected because it would make the hero CTA formally valid but commercially useless. Requiring the complete Services specification was rejected because evidence, FAQs, and detailed commercial terms are not needed to explain the three approved services.

## Complete public content

The minimum destination copy above remains the current implementation baseline. The following bilingual specification replaces it when the complete Services experience is implemented.

## Spanish content — APPROVED

### Spanish page introduction

**H1**

> Servicios para resolver necesidades concretas del negocio

**Introduction**

> FURLANICH diseña soluciones web, automatizaciones e integraciones, y mejora sistemas existentes. El punto de partida no es una tecnología ni un paquete cerrado: es entender qué está frenando la operación, qué resultado necesitás y si conviene construir, integrar o modernizar.

**Qualification line**

> No hace falta que llegues con una solución definida. Una primera conversación sirve para ordenar el problema y evaluar el camino más razonable.

**Service index label:** `Ir a un servicio`

- `Sitios y aplicaciones web` → `#web`
- `WhatsApp e integraciones` → `#whatsapp`
- `Mantenimiento y consultoría` → `#consultoria`

### Spanish SERVICE-WEB — `#web`

**H2**

> Sitios y aplicaciones web comerciales

**Client situation**

> Tu negocio necesita algo más útil que una presencia web genérica: presentar bien la oferta, recibir pedidos o reservas, cobrar, dar acceso a clientes o trasladar a un sistema un proceso que hoy depende de mensajes, planillas y tareas manuales.

**Heading:** `Situaciones habituales`

- El sitio actual quedó desactualizado, no explica bien la propuesta o no facilita una consulta.
- Los pedidos, turnos o reservas llegan por varios canales y después hay que reorganizarlos a mano.
- Clientes o personal necesitan consultar información, completar gestiones o seguir estados sin depender de una conversación individual.
- Un proceso propio del negocio no encaja bien en una herramienta genérica.

**Heading:** `Qué resultado buscamos`

> Una experiencia web clara y mantenible que ayude a presentar, vender o gestionar un proceso concreto. El resultado puede ser desde un sitio comercial profesional hasta una aplicación operativa a medida; el alcance, el riesgo y la inversión no son equivalentes.

**Heading:** `Distintos niveles de trabajo web`

- **Sitio comercial o catálogo:** comunica la propuesta, organiza contenidos y productos, y facilita el próximo paso del visitante.
- **Flujo de pedidos, reservas o pagos:** permite iniciar o completar una operación y puede conectarse con calendarios, medios de pago u otras herramientas.
- **Portal o aplicación web a medida:** incorpora accesos, estados, reglas del negocio, administración e integraciones para sostener una operación específica.

> Estas categorías orientan la conversación; no son planes cerrados ni niveles obligatorios.

**Heading:** `Ejemplos posibles`

- Un sitio profesional para una empresa de servicios con consultas bien dirigidas.
- Un catálogo que deriva pedidos a un canal acordado o los registra en un sistema.
- Un flujo de turnos o reservas con disponibilidad, confirmaciones y administración.
- Un portal donde clientes consultan documentación, solicitudes o estados.
- Una aplicación web para un circuito interno o comercial que no resuelve un producto estándar.

**Heading:** `Un trabajo puede incluir`

- diagnóstico del objetivo, usuarios y proceso;
- definición de contenidos, recorridos y alcance funcional;
- diseño y desarrollo de la experiencia web acordada;
- integración con pagos, calendarios, correo, APIs o sistemas existentes cuando sea viable;
- pruebas, preparación para publicación y entrega de la documentación acordada.

**Heading:** `No incluye automáticamente`

- identidad de marca, redacción, fotografía, carga masiva o producción de contenido;
- hosting, dominio, correo, licencias o comisiones de terceros;
- un panel administrativo, aplicación móvil o integración que no figure en el alcance;
- mantenimiento continuo después de la entrega;
- resultados comerciales, posicionamiento en buscadores o disponibilidad sin interrupciones garantizados.

**Heading:** `Dependencias externas`

> La viabilidad puede depender del hosting, dominio, medios de pago, APIs, calendarios, sistemas existentes y accesos del cliente. Cada proveedor define sus propias condiciones, costos, disponibilidad y límites. La propuesta debe indicar qué integra FURLANICH, qué contrata o administra el cliente y qué supuestos necesitan validación.

**Heading:** `Buen encaje`

> Es una buena opción cuando hay una necesidad comercial u operativa concreta, responsables disponibles para validar el proceso y una razón clara para adaptar la solución al negocio.

**Heading:** `Cuándo conviene otra alternativa`

> Si un constructor de sitios, una tienda, una agenda o un software existente resuelve bien la necesidad con menor costo y riesgo, FURLANICH puede recomendar configurarlo o integrarlo en lugar de desarrollar desde cero. Si el problema principal es estabilizar un sistema que ya existe, corresponde evaluar Mantenimiento y consultoría de software.

**Heading:** `Evidencia disponible`

> El repositorio conserva un sistema general de reservas publicado por Samuel como evidencia de implementación. Su demostración funcional, sus limitaciones y su presentación comercial todavía están en revisión, por lo que no se presenta como caso de cliente, solución en producción ni resultado verificado.

**CTA:** `Contanos qué necesitás resolver en la web` → `/contacto/`

### Spanish SERVICE-WHATSAPP — `#whatsapp`

**H2**

> Automatización por WhatsApp e integraciones

**Client situation**

> WhatsApp ya es parte de la atención, pero muchas consultas se repiten, los pedidos o reservas quedan en conversaciones difíciles de seguir, y la información después debe copiarse a otra herramienta.

**Heading:** `Situaciones habituales`

- El equipo responde las mismas preguntas y solicita los mismos datos una y otra vez.
- Pedidos, reservas o confirmaciones se pierden entre chats o dependen de una sola persona.
- Hace falta enviar avisos o estados sin sostener cada conversación manualmente.
- WhatsApp debería iniciar o consultar una operación registrada en otra herramienta del negocio.

**Heading:** `Qué resultado buscamos`

> Un recorrido conversacional claro que reduzca trabajo repetitivo, capture la información necesaria y conecte el canal con un proceso útil. Automatizar no significa eliminar toda intervención humana: el diseño debe indicar cuándo responde el sistema, cuándo deriva y qué sucede si no puede continuar.

**Heading:** `Niveles de alcance posibles`

- **Contacto básico:** un enlace inicia una conversación; no hay automatización ni integración por el solo hecho de usar WhatsApp.
- **Flujo automatizado:** respuestas, preguntas guiadas, registro de datos, confirmaciones o notificaciones dentro de lo permitido por la plataforma.
- **Interacción asistida por bot:** una lógica conversacional ayuda a interpretar o resolver solicitudes acotadas y deriva cuando corresponde.
- **Integración oficial:** la API o un proveedor autorizado conecta WhatsApp con calendarios, pedidos, pagos iniciados externamente, CRM u otros sistemas, si la factibilidad está confirmada.

**Heading:** `Ejemplos posibles`

- responder consultas frecuentes y derivar casos especiales;
- tomar datos iniciales para un pedido o una reserva;
- confirmar, recordar o notificar estados cuando las reglas aplicables lo permitan;
- iniciar un pago mediante un enlace o flujo externo;
- consultar o registrar información en un sistema existente.

**Heading:** `Un trabajo puede incluir`

- análisis de conversaciones, excepciones y puntos de derivación;
- diseño del flujo, mensajes y datos necesarios;
- configuración o desarrollo de la automatización acordada;
- integración con un proveedor oficial y con sistemas del cliente cuando sea viable;
- pruebas de recorridos, errores, derivación humana y seguimiento operativo inicial.

**Heading:** `No incluye automáticamente`

- acceso ilimitado a funciones de WhatsApp ni independencia de Meta o del proveedor;
- aprobación de cuentas, números, plantillas, categorías o mensajes;
- costos de conversaciones, proveedor, infraestructura, IA u otros terceros;
- un CRM, sistema de pedidos, agenda o sistema administrativo completo;
- atención humana, operación diaria del canal o disponibilidad de soporte permanente;
- resultados de venta, tiempos de respuesta o entrega garantizados.

**Heading:** `Dependencias externas`

> Las capacidades reales dependen de las políticas vigentes de WhatsApp y Meta, las plantillas aprobadas cuando correspondan, el proveedor elegido, los costos de terceros, la calidad de los datos, los sistemas del cliente y la factibilidad de cada integración. Estas condiciones se validan antes de cerrar alcance; FURLANICH no controla su aprobación, continuidad ni cambios.

**Heading:** `Buen encaje`

> Es una buena opción cuando existe un flujo repetible, datos definidos, volumen o fricción suficientes para justificar la automatización y una persona responsable de las excepciones y la operación.

**Heading:** `Cuándo conviene otra alternativa`

> Un enlace directo o respuestas manuales pueden ser suficientes para un volumen bajo. Una función nativa del sistema actual puede ser mejor que una integración nueva. Si no hay un proceso estable, primero conviene ordenarlo; automatizar desorden suele trasladar el problema.

**Heading:** `Evidencia disponible`

> Hoy no hay un proyecto público de automatización por WhatsApp que cumpla los requisitos de verificación y publicación de FURLANICH. La oferta se explica por su alcance y sus límites, no mediante un caso, una certificación o un resultado que el repositorio no puede respaldar.

**CTA:** `Conversemos sobre tu flujo por WhatsApp` → `/contacto/`

### Spanish SERVICE-CONSULTING — `#consultoria`

**H2**

> Mantenimiento y consultoría de software

**Client situation**

> Ya existe un sistema, pero falla, quedó desactualizado, cuesta modificarlo, rinde mal o depende de decisiones técnicas que nadie tiene claras. Antes de reemplazarlo, necesitás entender qué pasa, qué riesgo existe y qué conviene hacer.

**Heading:** `Situaciones habituales`

- Un defecto reaparece o no se conoce su causa.
- Una actualización de framework, dependencia o plataforma quedó postergada y bloquea cambios.
- El sistema se volvió lento, inestable o difícil de desplegar y mantener.
- Una integración dejó de funcionar o hace falta conectar el sistema con otra herramienta.
- Hay deuda técnica, documentación insuficiente o dudas entre reparar, modernizar o reconstruir.

**Heading:** `Qué resultado buscamos`

> Un diagnóstico claro y una mejora proporcionada al problema: estabilizar lo crítico, reducir riesgos, recuperar capacidad de cambio o definir un camino de modernización. La consultoría puede terminar en recomendaciones, en una intervención técnica acordada o en continuidad por separado.

**Heading:** `Ejemplos posibles`

- investigar y corregir defectos reproducibles;
- estabilizar un sistema o una entrega;
- actualizar dependencias, frameworks o plataformas;
- mejorar rendimiento, confiabilidad, pruebas o despliegue;
- integrar APIs, servicios o fuentes de datos;
- revisar arquitectura y deuda técnica;
- planificar una modernización por etapas;
- brindar mantenimiento o apoyo técnico continuo mediante un acuerdo específico.

**Heading:** `Un trabajo puede incluir`

- relevamiento de síntomas, contexto, código, registros y entornos disponibles;
- reproducción y priorización de problemas;
- revisión de arquitectura, dependencias, riesgos y mantenibilidad;
- plan de estabilización o modernización con alternativas, ventajas y límites;
- implementación y validación de las correcciones o mejoras incluidas en el alcance;
- documentación, transferencia y continuidad acordadas.

**Heading:** `No incluye automáticamente`

- reconstruir el sistema completo o desarrollar uno nuevo;
- corregir problemas que no pueden observarse por falta de acceso o evidencia;
- soporte de guardia, respuesta a incidentes o un acuerdo de nivel de servicio (SLA);
- auditoría legal, certificación de seguridad o garantía de ausencia de defectos;
- licencias, infraestructura, servicios de terceros o trabajo de otros proveedores;
- mantenimiento posterior a la intervención.

**Heading:** `Dependencias externas`

> El diagnóstico depende del acceso autorizado a código, documentación, registros, entornos, datos adecuados y personas que conozcan la operación. Sistemas de terceros, licencias, versiones sin soporte, proveedores, infraestructura y restricciones contractuales pueden limitar las opciones. Antes de intervenir se acuerdan accesos, copias de seguridad, entornos y responsabilidades.

**Heading:** `Buen encaje`

> Es una buena opción cuando existe un sistema identificable, hay acceso legítimo suficiente para investigarlo y el negocio necesita recuperar estabilidad, capacidad de cambio o una dirección técnica concreta.

**Heading:** `Cuándo conviene otra alternativa`

> Si el producto estándar todavía tiene soporte, puede corresponder trabajar con su proveedor. Si la necesidad es menor y ya está cubierta por una herramienta existente, conviene configurarla antes que reemplazarla. Si no existe un sistema y el objetivo es crear uno nuevo, el trabajo debe tratarse como un proyecto de desarrollo, no como mantenimiento.

**Heading:** `Evidencia disponible`

> Hoy no hay una intervención pública de mantenimiento o consultoría con alcance, permiso y resultado verificables. FURLANICH no publica detalles confidenciales ni convierte experiencia general en un caso de éxito. Hasta contar con evidencia autorizada, esta sección se sostiene en un alcance explícito y una forma de trabajo verificable.

**CTA:** `Contanos qué pasa con tu sistema` → `/contacto/`

### Spanish cross-service principles and commercial boundaries

**H2**

> Qué podés esperar de cualquier servicio

**Introduction**

> El servicio cambia; estas decisiones de trabajo no.

**Principles**

- **Entender antes de construir:** primero se ordenan el problema, las personas involucradas y el resultado esperado.
- **Elegir entre construir, integrar o modernizar:** una solución a medida se recomienda cuando aporta valor frente a una herramienta existente.
- **Definir un alcance comprobable:** entregables, exclusiones, supuestos y criterios de validación quedan explícitos antes de comprometer el trabajo.
- **Validar de manera incremental:** cuando el proyecto lo permite, los recorridos importantes se revisan antes de la entrega final.
- **Hacer visibles las dependencias:** proveedores, accesos, datos, contenidos y decisiones del cliente forman parte de la factibilidad y del cronograma.
- **Cuidar la continuidad:** se priorizan una implementación mantenible, documentación proporcional y responsabilidad técnica directa de Samuel.

**Heading:** `Límites comerciales`

> El precio y el plazo se definen después de entender y acotar el trabajo. Ninguna descripción de esta página garantiza una métrica de negocio, un plazo fijo, disponibilidad continua ni un resultado que dependa de adopción, contenidos, proveedores o sistemas externos.

- Hosting, dominios, licencias, medios de pago, mensajería, APIs y suscripciones de terceros se cotizan o contratan por separado salvo inclusión expresa.
- El cliente aporta o autoriza contenidos, datos, accesos, cuentas, decisiones y validaciones necesarios para el alcance acordado.
- El mantenimiento posterior, los cambios de alcance y el soporte continuo son acuerdos separados.
- Un tiempo de respuesta para consultas comerciales no es un SLA de soporte. Cualquier guardia, prioridad o nivel de servicio requiere un acuerdo específico.
- Los términos definitivos de pago, aceptación, propiedad, garantía y responsabilidad pertenecen a cada propuesta o contrato y siguen sujetos a revisión comercial y legal.

**AI note**

**Heading:** `IA solo cuando aporta valor`

> La IA no es un cuarto servicio ni se incorpora por defecto. Puede formar parte de una automatización o sistema a medida —por ejemplo, para procesar documentos, asistir un flujo interno o interpretar una solicitud acotada— solo cuando aporta valor, puede evaluarse responsablemente y sus proveedores, datos, costos, límites y supervisión quedan explícitos.

### Spanish final CTA

**H2**

> Contanos qué necesitás resolver

**Description**

> No hace falta elegir un servicio antes de escribir. Explicanos qué está pasando, cómo funciona hoy y qué te gustaría mejorar. Samuel revisará personalmente la consulta para evaluar si FURLANICH puede ayudarte y cuál sería el próximo paso razonable.

**CTA:** `Iniciar una consulta` → `/contacto/`

**Response line**

> Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.

## English content — APPROVED

### English page introduction

**H1**

> Services for concrete business needs

**Introduction**

> FURLANICH designs web solutions, automations, and integrations, and improves existing systems. We do not begin with a technology or a fixed package. We begin by understanding what is holding the operation back, the outcome you need, and whether it makes more sense to build, integrate, or modernize.

**Qualification line**

> You do not need to arrive with the solution already defined. An initial conversation can clarify the problem and identify the most sensible path.

**Service index label:** `Jump to a service`

- `Websites and web applications` → `#web`
- `WhatsApp and integrations` → `#whatsapp`
- `Maintenance and consulting` → `#consulting`

### English SERVICE-WEB — `#web`

**H2**

> Business websites and web applications

**Client situation**

> Your business needs something more useful than a generic web presence: a better way to present its offer, receive orders or bookings, take payments, give customers access, or move a process out of messages, spreadsheets, and manual work.

**Heading:** `Common situations`

- The current site is outdated, does not explain the offer clearly, or makes it difficult to enquire.
- Orders, appointments, or bookings arrive through several channels and have to be reorganized by hand.
- Customers or staff need to check information, complete requests, or follow progress without relying on an individual conversation.
- A business-specific process does not fit a generic tool well.

**Heading:** `The outcome we work towards`

> A clear, maintainable web experience that helps the business present, sell, or manage a specific process. The result may range from a professional commercial site to a custom operational application; those engagements do not have the same scope, risk, or investment.

**Heading:** `Different levels of web work`

- **Commercial website or catalogue:** communicates the offer, organizes content or products, and makes the visitor's next step clear.
- **Ordering, booking, or payment flow:** lets someone start or complete a transaction and may connect to calendars, payment providers, or other tools.
- **Custom portal or web application:** adds access control, statuses, business rules, administration, and integrations for a specific operation.

> These categories help frame the conversation. They are not fixed packages or mandatory tiers.

**Heading:** `Representative examples`

- A professional site for a service business with well-directed enquiries.
- A catalogue that sends orders to an agreed channel or records them in a system.
- An appointment or booking flow with availability, confirmations, and administration.
- A portal where customers can view documents, requests, or statuses.
- A web application for an internal or commercial workflow that standard software does not handle well.

**Heading:** `An engagement may include`

- diagnosing the objective, users, and process;
- defining content, journeys, and functional scope;
- designing and building the agreed web experience;
- integrating payments, calendars, email, APIs, or existing systems where feasible;
- testing, preparing for launch, and delivering the agreed documentation.

**Heading:** `Not automatically included`

- brand identity, copywriting, photography, bulk data entry, or content production;
- hosting, domains, email, licences, or third-party charges;
- an admin area, mobile app, or integration that is not in scope;
- ongoing maintenance after delivery;
- guaranteed commercial results, search rankings, or uninterrupted availability.

**Heading:** `External dependencies`

> Feasibility may depend on hosting, domains, payment providers, APIs, calendars, existing systems, and client access. Each provider sets its own terms, costs, availability, and limits. The proposal must state what FURLANICH integrates, what the client contracts or manages, and which assumptions still need validation.

**Heading:** `A good fit`

> This is a good fit when there is a concrete commercial or operational need, responsible people are available to validate the process, and there is a clear reason to adapt the solution to the business.

**Heading:** `When another option may be better`

> If a website builder, online store, booking tool, or existing product solves the need well with less cost and risk, FURLANICH may recommend configuring or integrating it instead of building from scratch. If the main issue is stabilizing an existing system, Software maintenance and IT consulting is the more relevant starting point.

**Heading:** `Available evidence`

> The repository contains a general reservation system published by Samuel as implementation evidence. Its functional demonstration, limitations, and commercial presentation are still under review, so it is not presented as client work, a production solution, or a verified outcome.

**CTA:** `Tell us what you need to solve on the web` → `/en/contact/`

### English SERVICE-WHATSAPP — `#whatsapp`

**H2**

> WhatsApp automation and integrations

**Client situation**

> WhatsApp is already part of customer service, but many questions repeat, orders or bookings become difficult to track across conversations, and information has to be copied into another tool afterwards.

**Heading:** `Common situations`

- The team answers the same questions and asks for the same details repeatedly.
- Orders, bookings, or confirmations get lost among chats or depend on one person.
- The business needs to send updates or statuses without handling every conversation manually.
- WhatsApp should start or retrieve an operation recorded in another business tool.

**Heading:** `The outcome we work towards`

> A clear conversational journey that reduces repetitive work, captures the information the process needs, and connects the channel to a useful workflow. Automation does not mean removing people from every interaction: the design must make clear when the system responds, when it hands over, and what happens when it cannot continue.

**Heading:** `Possible levels of scope`

- **Basic contact:** a link starts a conversation; using WhatsApp alone does not create automation or integration.
- **Automated workflow:** replies, guided questions, data capture, confirmations, or notifications within the platform's permitted capabilities.
- **Bot-assisted interaction:** conversational logic helps interpret or resolve a bounded request and hands over when appropriate.
- **Official integration:** an API or authorized provider connects WhatsApp to calendars, orders, externally initiated payments, CRM, or other systems once feasibility is confirmed.

**Heading:** `Representative examples`

- Answering common questions and handing special cases to a person.
- Capturing the initial details for an order or booking.
- Sending confirmations, reminders, or status updates when applicable rules permit it.
- Starting a payment through an external link or flow.
- Looking up or recording information in an existing system.

**Heading:** `An engagement may include`

- analysing conversations, exceptions, and handover points;
- designing the flow, messages, and required data;
- configuring or building the agreed automation;
- integrating an official provider and client systems where feasible;
- testing journeys, errors, human handover, and the initial operational follow-through.

**Heading:** `Not automatically included`

- unlimited access to WhatsApp features or independence from Meta or the provider;
- approval of accounts, numbers, templates, categories, or messages;
- conversation, provider, infrastructure, AI, or other third-party fees;
- a complete CRM, ordering system, booking platform, or back office;
- human customer service, daily channel operation, or permanent support availability;
- guaranteed sales results, response times, or message delivery.

**Heading:** `External dependencies`

> Actual capabilities depend on current WhatsApp and Meta policies, approved templates where applicable, the selected provider, third-party fees, data quality, client systems, and the feasibility of each integration. These conditions are validated before scope is finalized; FURLANICH does not control their approval, continuity, or changes.

**Heading:** `A good fit`

> This is a good fit when the workflow is repeatable, the required data is understood, the volume or friction justifies automation, and someone remains responsible for exceptions and day-to-day operation.

**Heading:** `When another option may be better`

> A direct link or manual replies may be enough at low volume. A native feature in the current system may be better than a new integration. If the process itself is unstable, it should be clarified first; automating disorder usually moves the problem rather than solving it.

**Heading:** `Available evidence`

> There is currently no public WhatsApp automation project that meets FURLANICH's verification and publication requirements. The offer is presented through its scope and limitations, not through a case study, certification, or outcome the repository cannot support.

**CTA:** `Discuss your WhatsApp workflow` → `/en/contact/`

### English SERVICE-CONSULTING — `#consulting`

**H2**

> Software maintenance and IT consulting

**Client situation**

> A system already exists, but it is failing, outdated, difficult to change, performing poorly, or dependent on technical decisions no one can explain clearly. Before replacing it, you need to understand what is happening, what is at risk, and what is worth doing.

**Heading:** `Common situations`

- A defect keeps returning or its cause is unknown.
- A framework, dependency, or platform update has been postponed and now blocks other changes.
- The system has become slow, unstable, or difficult to deploy and maintain.
- An integration has stopped working, or the system needs to connect to another tool.
- Technical debt, missing documentation, or uncertainty makes it hard to choose between repair, modernization, and replacement.

**Heading:** `The outcome we work towards`

> A clear diagnosis and an improvement proportionate to the problem: stabilize what matters, reduce risk, restore the ability to change the system, or define a modernization path. Consulting may end with recommendations, an agreed technical intervention, or separately contracted continuity.

**Heading:** `Representative examples`

- Investigating and fixing reproducible defects.
- Stabilizing a system or delivery process.
- Updating dependencies, frameworks, or platforms.
- Improving performance, reliability, testing, or deployment.
- Integrating APIs, services, or data sources.
- Reviewing architecture and technical debt.
- Planning modernization in stages.
- Providing ongoing maintenance or technical support under a specific agreement.

**Heading:** `An engagement may include`

- gathering symptoms, context, code, logs, and available environment information;
- reproducing and prioritizing problems;
- reviewing architecture, dependencies, risks, and maintainability;
- preparing a stabilization or modernization plan with alternatives and trade-offs;
- implementing and validating the fixes or improvements included in scope;
- providing the agreed documentation, handover, and continuity.

**Heading:** `Not automatically included`

- rebuilding the entire system or developing a new one;
- fixing issues that cannot be observed because access or evidence is unavailable;
- on-call support, incident response, or a service-level agreement (SLA);
- legal audit, security certification, or a guarantee that the system has no defects;
- licences, infrastructure, third-party services, or work owned by other providers;
- maintenance after the agreed intervention.

**Heading:** `External dependencies`

> Diagnosis depends on authorized access to code, documentation, logs, environments, appropriate data, and people who understand the operation. Third-party systems, licences, unsupported versions, providers, infrastructure, and contractual restrictions may limit the available options. Access, backups, environments, and responsibilities are agreed before intervention.

**Heading:** `A good fit`

> This is a good fit when there is an identifiable existing system, legitimate access is sufficient to investigate it, and the business needs to restore stability, capacity for change, or a clear technical direction.

**Heading:** `When another option may be better`

> If a standard product is still supported, working with its vendor may be the right path. If a smaller need is already covered by an existing tool, configuring it may be better than replacing it. If no system exists and the goal is to create one, the work should be treated as a development project rather than maintenance.

**Heading:** `Available evidence`

> There is currently no public maintenance or consulting intervention with verifiable scope, permission, and outcome. FURLANICH does not publish confidential details or turn general experience into a success story. Until authorized evidence is available, this section is supported by explicit scope and a verifiable working approach.

**CTA:** `Tell us what is happening with your system` → `/en/contact/`

### English cross-service principles and commercial boundaries

**H2**

> What you can expect from every service

**Introduction**

> The service changes; these working decisions do not.

**Principles**

- **Understand before building:** clarify the problem, the people involved, and the expected outcome first.
- **Choose between building, integrating, and modernizing:** recommend custom work only when it adds value compared with an existing tool.
- **Define testable scope:** make deliverables, exclusions, assumptions, and validation criteria explicit before committing to the work.
- **Validate incrementally:** where the project allows, review important journeys before final delivery.
- **Make dependencies visible:** providers, access, data, content, and client decisions are part of feasibility and timing.
- **Plan for continuity:** prioritize maintainable implementation, proportionate documentation, and Samuel's direct technical accountability.

**Heading:** `Commercial boundaries`

> Price and timing are defined after the work has been understood and scoped. Nothing on this page guarantees a business metric, a fixed delivery date, continuous availability, or an outcome that depends on adoption, content, providers, or external systems.

- Hosting, domains, licences, payment services, messaging, APIs, and third-party subscriptions are quoted or contracted separately unless expressly included.
- The client provides or authorizes the content, data, access, accounts, decisions, and validation required by the agreed scope.
- Post-delivery maintenance, scope changes, and ongoing support are separate agreements.
- A response target for commercial enquiries is not a support SLA. Any on-call coverage, priority, or service level requires a specific agreement.
- Final payment, acceptance, ownership, warranty, and liability terms belong in each proposal or contract and remain subject to commercial and legal review.

**AI note**

**Heading:** `AI only where it adds value`

> AI is not a fourth service and is not included by default. It may be one capability inside a tailored automation or system — for example, document processing, an AI-assisted internal workflow, or interpretation of a bounded request — only when it adds value and its providers, data, costs, limitations, evaluation, and human oversight are explicit.

### English final CTA

**H2**

> Tell us what you need to solve

**Description**

> You do not need to choose a service before getting in touch. Tell us what is happening, how it works today, and what you would like to improve. Samuel will review the enquiry personally to determine whether FURLANICH can help and what a sensible next step would be.

**CTA:** `Start an enquiry` → `/en/contact/`

**Response line**

> Usual response time is within the same business day. In exceptional cases, it may take up to two business days.

## CTA policy — APPROVED

Every service uses one contextual CTA because the wording confirms what the visitor may discuss while preserving a single destination and inquiry model. The final CTA stays general so visitors who are unsure of the service can continue. No CTA implies a quote, booking, free diagnosis, fixed package, or guaranteed acceptance. All service and final CTAs lead to the localized `PAGE-CONTACT`; WhatsApp remains a secondary channel on that page rather than a competing primary action throughout Services.

## Evidence policy for this page — APPROVED

- `SERVICE-WEB` may state the existence and current limits of the founder-published General Reservation System repository, but it must not display it as a project card, client engagement, production system, working demo, or verified outcome. Busesfy remains internal to `PROJECT-EVIDENCE` and is not named or linked in public Services content while relationship and identity permission are open.
- `SERVICE-WHATSAPP` has no publishable project evidence. The page says so directly and shows no logo, screenshot, metric, testimonial, certification, or simulated case study.
- `SERVICE-CONSULTING` has no publishable intervention story. General founder experience is not converted into a project claim. Confidentiality and a clear engagement method are supporting trust signals, not substitutes presented as outcomes.
- The page does not link to unavailable Projects routes. Evidence enhancements remain gated by `PROJECT-EVIDENCE` publication readiness and item-level permission.

This treatment is intentionally asymmetric. The launch offer may be described truthfully even when public proof is still developing; lack of evidence must not be disguised by equal-looking project cards.

## Conversion and editorial review — APPROVED

The final journey follows:

```text
Recognize a concrete problem
-> identify the relevant service
-> understand the likely outcome and examples
-> understand possible scope
-> see boundaries and dependencies
-> determine fit
-> see the truthful evidence status
-> start an inquiry
```

The copy intentionally removes generic transformation language, technology catalogues, duplicated homepage process copy, artificial service tiers, implied packages, unsupported outcomes, and provider-independent automation claims. Repeated headings are retained because they make three long sections comparable. The homepage carries the shorter brand and process narrative; this page carries service-specific qualification and limitations.

## Implementation-readiness matrix

| Area | Status | Decision or owner |
| --- | --- | --- |
| Page introduction | **READY** | Approved bilingual copy and in-page index in `PAGE-SERVICES`. |
| `SERVICE-WEB` | **READY** | Situation, outcomes, examples, scope, boundaries, dependencies, fit, evidence limit, and CTA approved. |
| `SERVICE-WHATSAPP` | **READY** | Automation levels and Meta/provider/client-system constraints approved; absence of public proof is explicit. |
| `SERVICE-CONSULTING` | **READY** | Existing-system focus, intervention scope, new-build distinction, support boundary, evidence limit, and CTA approved. |
| Cross-service principles | **READY** | Six concise service-specific expectations plus bounded commercial wording approved. |
| Service anchors | **READY** | `#web`, `#whatsapp`, `#consultoria`, and `#consulting` approved; homepage deep links remain unnecessary. |
| Evidence | **READY** | Honest launch treatment approved. Richer project proof is **DEFERRED** to item readiness in `PROJECT-EVIDENCE`. |
| Final CTA | **READY** | Localized general inquiry CTA and approved response expectation. The Contact route is already usable. |
| Spanish content | **READY** | Natural Argentine voseo and exact page copy approved. |
| English content | **READY** | Natural professional adaptation and exact page copy approved. |
| Responsive/design behavior | **READY** | Page-specific baselines approved in `DESIGN-VISUAL` and `DESIGN-IX-A11Y`. |
| Final prices, payment, ownership, warranty, liability, and legal terms | **DEFERRED** | `DELIVERY-BOUNDARIES`; bounded informational copy is approved and implementation is not blocked. |
| Structured inquiry form and privacy flow | **BLOCKED** for complete business-site release, not for this page | `PAGE-CONTACT` and `PAGE-PRIVACY`; the working direct-contact destination remains sufficient for Services implementation. |

## Acceptance criteria

- A non-technical decision-maker can distinguish the three services and different levels of web or WhatsApp work.
- Every service begins with recognizable business situations and explains outcomes before scope or technology.
- Examples remain examples, not packaged products or claims of prior delivery.
- Typical-scope lists are explicitly conditional; exclusions and external dependencies remain visible.
- Building a new system is clearly separated from improving an existing one.
- WhatsApp capabilities are not presented as unlimited or provider-independent.
- AI is optional supporting capability, never a fourth service or universal ingredient.
- Fit and non-fit guidance permits recommending an existing product, vendor, manual process, or preliminary diagnosis.
- Evidence is accurate, asymmetric, and consistent with `PROJECT-EVIDENCE`.
- Stable anchors work without hiding the section heading, and the service index remains usable without sticky behavior.
- Each service has one contextual inquiry path and the page ends with one general inquiry path.
- Exact Spanish and English copy preserves the same product meaning without mechanical translation.
- No application implementation code is authorized by this specification alone; a versioned execution plan is the next engineering artifact.
