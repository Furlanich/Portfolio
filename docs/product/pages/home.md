---
id: PAGE-HOME
type: page-spec
status: APPROVED
related:
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - BRAND-POSITIONING
  - AUDIENCES-SERVICES
  - IA-SITE
  - PROJECT-EVIDENCE
  - PAGE-CONTACT
  - PAGE-SERVICES
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-16
---

# Spanish homepage

## Responsibility

The homepage qualifies and builds trust with prospective clients. Within approximately 30 seconds it should communicate what FURLANICH solves, who it serves, why its evidence is credible, how it works, and how to inquire.

**Primary audience:** Argentine small-business owners and operational decision-makers, initially in Buenos Aires Province and CABA.

**Primary CTA:** `Contanos sobre tu proyecto` → `/contacto/`

**Secondary CTA:** `Ver servicios` → `/servicios/`

The full inquiry form lives on `PAGE-CONTACT`, not the homepage.

## Section order

```text
HOME-HERO
HOME-PROBLEMS
HOME-SERVICES
HOME-AUDIENCES
HOME-PROOF
HOME-PROCESS
HOME-FOUNDER
HOME-CTA
```

There is no dedicated AI section.

## Initiative 2 decision closure — APPROVED

The sections below `HOME-HERO` are approved as one commercial sequence. Their exact Spanish copy, natural English adaptations, CTA destinations, evidence boundaries, and implementation-readiness status are owned here. The later-section visual, responsive, interaction, and accessibility rules are owned by [`DESIGN-VISUAL`](../../design/visual-language.md#commercial-homepage-section-baseline-approved) and [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#commercial-homepage-section-baseline-approved).

The complete sequence fits the accepted localized App Router architecture: each locale may continue to own its content and pass it to shared, locale-agnostic semantic components. No new routing, localization, hosting, dependency, CMS, backend, or design-system architecture is required. A later implementation plan may decide file boundaries within those accepted constraints; it must not turn the sections into a new frontend framework or generalized content platform.

`HOME-PROOF` has no project card that currently passes the approved evidence and permission gates. Its approved launch treatment is therefore the honest credibility fallback defined in that section. Project cards remain a later evidence-driven enhancement, not an implementation blocker for the commercial homepage.

## HOME-HERO

**Objective:** Explain the commercial value and direct-accountability model immediately.

**Eyebrow**

> Desarrollo de software a medida para pymes

**H1**

> Software práctico para vender, atender y operar mejor.

**Description**

> FURLANICH diseña y desarrolla sitios y aplicaciones web comerciales, automatizaciones por WhatsApp e integraciones, y mejora sistemas existentes para organizaciones con necesidades concretas.

**Primary CTA:** `Contanos sobre tu proyecto`

**Secondary CTA:** `Ver servicios`

**Trust line**

> Atención técnica directa · Buenos Aires, Argentina · Proyectos en español e inglés

**Availability**

> Disponible para proyectos en toda la Argentina y el exterior.

**Evidence:** Approved service scope, founder accountability, location, languages, and response capability. No unsupported client count or result metric.

**Required source material:** The minimum wordmark and visual direction are approved in `DESIGN-VISUAL`. Canonical-domain selection is a release dependency, not a hero implementation dependency. No hero image is required.

### HOME-HERO approved English adaptation

The English hero at `/en/` uses the following adaptation. It preserves the Spanish meaning while favoring natural business English over literal syntax.

**Eyebrow**

> Custom software development for small and medium-sized businesses

**H1**

> Practical software to help you sell, serve customers, and run your business better.

**Description**

> FURLANICH designs and builds business websites and web applications, WhatsApp automations and integrations, and improvements to existing systems for organizations with concrete needs.

**Primary CTA:** `Tell us about your project` → `/en/contact/`

**Secondary CTA:** `View services` → `/en/services/`

**Trust line**

> Direct technical contact · Buenos Aires, Argentina · Projects in Spanish and English

**Availability**

> Available for projects across Argentina and internationally.

The literal H1 “Practical software to sell, serve, and operate better” was rejected because “operate” is unnatural without a business object. A more abstract “digital transformation” headline was rejected because it weakens the concrete commercial promise.

### Homepage-foundation integration boundary

- The hero may be implemented once technical governance approves the localized route structure.
- It may be integrated only when the localized minimum Services and Contact destinations are usable and the Founder destination preserves the personal-portfolio material required by `PORTFOLIO-MIGRATION`.
- The canonical domain does not block component or route implementation; it blocks final production metadata and release sign-off.
- The complete homepage below `HOME-HERO`, project evidence, founder photography, and a custom logo symbol are outside this foundation slice.

## HOME-PROBLEMS

**Status:** **APPROVED** in Spanish and English. No project evidence is required because these are target-problem relevance statements, not claims of prior outcomes or sector specialization.

**Objective:** Let visitors recognize an operational problem before interpreting service categories.

**Heading**

> Cuando lo manual empieza a frenar el negocio

**Introduction**

> Una solución digital tiene sentido cuando reduce trabajo repetitivo, evita errores o permite atender mejor. Estos son algunos de los problemas que FURLANICH puede ayudarte a resolver.

**Situations**

- **Pedidos y reservas desordenados:** Consultas distribuidas entre mensajes, llamadas, planillas y anotaciones difíciles de mantener.
- **Procesos que consumen demasiado tiempo:** Tareas administrativas o de atención que podrían integrarse, simplificarse o automatizarse.
- **Una presencia web que no acompaña al negocio:** Sitios que informan, pero no permiten reservar, comprar, pedir o iniciar una gestión.
- **Software difícil de mantener:** Sistemas inestables, desactualizados o sin una dirección técnica clara.

**CTA:** `Ver cómo podemos ayudarte` → `/servicios/`

**Evidence:** Relevance statements, not case-study claims.

**Required source material:** Ongoing validation that these situations match the inquiries FURLANICH wants to receive.

That validation is a non-blocking post-launch content-learning activity. It does not prevent implementation of the approved section.

### HOME-PROBLEMS approved English adaptation

**Heading**

> When manual work starts holding the business back

**Introduction**

> A digital solution makes sense when it reduces repetitive work, prevents errors, or helps you serve customers better. These are some of the problems FURLANICH can help you solve.

**Situations**

- **Scattered orders and bookings:** Enquiries spread across messages, calls, spreadsheets, and notes that are difficult to keep up to date.
- **Processes that take too much time:** Administrative or customer-service work that could be connected, simplified, or automated.
- **A web presence that does not support the business:** Sites that provide information but do not let customers book, buy, place an order, or start a request.
- **Software that is difficult to maintain:** Unstable or outdated systems without a clear technical direction.

**CTA:** `See how we can help` → `/en/services/`

## HOME-SERVICES

**Status:** **APPROVED** in Spanish and English. The service scope is supported by [`AUDIENCES-SERVICES`](../audiences-and-services.md); service-specific project proof is not required to describe the offer truthfully.

**Objective:** Explain the three launch services as useful business outcomes.

**Heading**

> Servicios para necesidades concretas

**Introduction**

> No imponemos una plataforma genérica. Primero entendemos el proceso y después evaluamos si conviene construir, integrar o modernizar.

### SERVICE-WEB

**Title:** Sitios y aplicaciones web comerciales

> Soluciones web para presentar, vender o gestionar servicios: sitios profesionales, catálogos, pedidos, reservas, portales para clientes e integraciones con medios de pago.

### SERVICE-WHATSAPP

**Title:** Automatización por WhatsApp e integraciones

> Flujos para responder consultas, registrar pedidos, gestionar reservas, enviar confirmaciones y conectar WhatsApp con otras herramientas del negocio.

### SERVICE-CONSULTING

**Title:** Mantenimiento y consultoría de software

> Diagnóstico y mejora de sistemas existentes para resolver problemas, reducir riesgos y definir un camino técnico mantenible.

**Section CTA:** `Ver todos los servicios` → `/servicios/`

Individual service-card CTAs are **REJECTED** for this homepage version because the cards are informational and three actions would compete with the section action. The section retains one CTA to the Services page root. `PAGE-SERVICES` now approves stable fragments for in-page navigation and other genuinely contextual links; that later decision does not make the homepage cards interactive or change this CTA.

**Evidence:** Each service should eventually connect to at least one relevant evidence item. Missing evidence remains visible in `PROJECT-EVIDENCE`.

**Required source material:** Included/excluded scope, typical starting point, provider dependencies, and approved evidence for each service.

The homepage summary is implementation-ready without duplicating the detailed boundaries owned by `PAGE-SERVICES`. Missing public evidence for WhatsApp and consulting remains visible in `PROJECT-EVIDENCE` and must not be filled with implied case-study claims.

### HOME-SERVICES approved English adaptation

**Heading**

> Services for concrete business needs

**Introduction**

> We do not force a generic platform. First we understand the process, then decide whether building, integrating, or modernizing is the right approach.

#### HOME-SERVICES English SERVICE-WEB

**Title:** Business websites and web applications

> Web solutions that help businesses present, sell, or manage services: professional websites, catalogues, ordering, bookings, customer portals, and payment integrations.

#### HOME-SERVICES English SERVICE-WHATSAPP

**Title:** WhatsApp automation and integrations

> Flows for answering common questions, capturing orders, managing bookings, sending confirmations, and connecting WhatsApp with other business tools.

#### HOME-SERVICES English SERVICE-CONSULTING

**Title:** Software maintenance and IT consulting

> Diagnosis and improvement of existing systems to solve problems, reduce risk, and define a maintainable technical path.

**Section CTA:** `View all services` → `/en/services/`

## HOME-AUDIENCES

**Status:** **APPROVED** in Spanish and English. These are target operating contexts. They must not be labeled as sectors in which FURLANICH is a specialist or has proven experience unless future project evidence supports that stronger claim.

**Objective:** Demonstrate relevance without claiming unsupported vertical specialization.

**Heading**

> Pensado para negocios con operaciones reales

- **Comercios y tiendas:** Catálogos, pedidos, consultas, pagos y herramientas para organizar la operación.
- **Gastronomía:** Menús, pedidos, reservas, confirmaciones y canales de atención.
- **Transporte y logística:** Solicitudes, coordinación, seguimiento e información para pasajeros o clientes.
- **Servicios profesionales y consultoras:** Portales, automatizaciones, integraciones y capacidad técnica para proyectos o sistemas existentes.

**Closing line**

> Si tu sector no aparece en esta lista, el punto de partida sigue siendo el mismo: entender el proceso, el problema y el resultado que necesitás.

**CTA:** `Contanos cómo funciona tu negocio` → `/contacto/`

**Evidence:** Target relevance only. “Experience in” and “specialist” require project evidence.

**Required source material:** Item-level industry experience and approved sector descriptions.

Item-level experience is required only for stronger experience claims or future evidence cards; it does not block the approved relevance framing.

### HOME-AUDIENCES approved English adaptation

**Heading**

> Built for businesses with real operations

- **Retailers and shops:** Catalogues, orders, enquiries, payments, and tools for organizing day-to-day operations.
- **Restaurants and food-service businesses:** Menus, orders, bookings, confirmations, and customer-service channels.
- **Transport and logistics:** Requests, coordination, tracking, and information for passengers or customers.
- **Professional services and consultancies:** Portals, automations, integrations, and technical capacity for projects or existing systems.

**Closing line**

> If your sector is not listed, the starting point is still the same: understand the process, the problem, and the outcome you need.

**CTA:** `Tell us how your business works` → `/en/contact/`

## HOME-PROOF

**Status:** **APPROVED** for the honest launch fallback below. The project-card variant is **OPEN** and must not be implemented until at least one candidate reaches `ready` in [`PROJECT-EVIDENCE`](../project-evidence.md).

Initiative 4 re-evaluated every current candidate and the newly discovered repository inventory. No item reached `READY` or `READY-SUMMARY-ONLY`; the fallback therefore remains the approved treatment and no homepage project card is added.

**Objective:** Explain why the visitor can trust the commercial claims without presenting unverified work as client evidence.

**Heading**

> Credibilidad sin promesas infladas

**Introduction**

> FURLANICH solo presenta un trabajo cuando su contexto, estado y permiso de publicación están claros. No convertimos prototipos en historias de clientes ni publicamos métricas sin una fuente verificable.

**Credibility commitments**

- **Responsabilidad directa:** Samuel mantiene la responsabilidad técnica de cada proyecto de FURLANICH.
- **Afirmaciones verificables:** El estado, el alcance y las limitaciones de un trabajo se explican antes de usarlo como evidencia.
- **Confidencialidad respetada:** La identidad, las capturas y los resultados de clientes se publican únicamente con permiso explícito.

**CTA:** `Conocer la trayectoria de Samuel` → `/estudio/samuel-furlanich/`

**Evidence:** Approved founder-accountability facts plus the approved evidence-integrity and confidentiality rules. This section does not imply completed client work, results, metrics, testimonials, or a larger team.

### HOME-PROOF approved English adaptation

**Heading**

> Credibility without inflated claims

**Introduction**

> FURLANICH only presents work when its context, status, and publication permission are clear. We do not turn prototypes into client stories or publish metrics without a verifiable source.

**Credibility commitments**

- **Direct accountability:** Samuel retains technical responsibility for every FURLANICH project.
- **Verifiable claims:** A project's status, scope, and limitations are explained before it is used as evidence.
- **Confidentiality respected:** Client identities, screenshots, and results are published only with explicit permission.

**CTA:** `View Samuel's background` → `/en/about/samuel-furlanich/`

### Future project-card variant — OPEN

When at least one project reaches the `ready` publication state, this fallback may be replaced by up to three project cards ordered by commercial relevance. The section may then use the Spanish heading `Proyectos seleccionados` and English heading `Selected work`. Each card must satisfy `PROJECT-EVIDENCE`; the section must not link to `/proyectos/` or `/en/work/` until those localized destinations exist and are useful.

## HOME-PROCESS

**Status:** **APPROVED** in Spanish and English. Detailed commercial terms remain outside the homepage and do not block this process summary.

**Anchor:** `proceso`

**Objective:** Reduce uncertainty and show a controlled, collaborative delivery path.

**Heading**

> De una necesidad concreta a una solución mantenible

1. **Entender y diagnosticar:** Relevamos el negocio, el problema, los usuarios y las restricciones. Si todavía no está claro qué construir, primero ordenamos la necesidad.
2. **Definir el alcance:** Documentamos objetivos, entregables, límites, riesgos, responsabilidades y una propuesta de trabajo comprensible.
3. **Construir y validar:** Avanzamos mediante entregas revisables, pruebas y validaciones para detectar desvíos antes de llegar a producción.
4. **Implementar y acompañar:** Preparamos la publicación, la documentación y la continuidad acordada para que la solución pueda utilizarse y mantenerse.

**Quality statement**

> Antes de una puesta en producción, cada entrega pasa por revisión técnica, pruebas funcionales y validación de los recorridos principales. Los controles específicos se definen según el tipo de solución y su nivel de riesgo.

**CTA:** `Empezar una consulta` → `/contacto/`

**Evidence:** Actual proposals, discovery notes, review checkpoints, acceptance records, and handoff material may support the process privately. No methodology certification is claimed.

**Dependencies:** Detailed commercial terms remain PROPOSED/OPEN in the status register.

### HOME-PROCESS approved English adaptation

**Anchor:** `process`

**Heading**

> From a concrete need to a maintainable solution

1. **Understand and diagnose:** We learn how the business works, what the problem is, who uses the process, and which constraints matter. If it is not yet clear what to build, we first clarify the need.
2. **Define the scope:** We document objectives, deliverables, boundaries, risks, responsibilities, and a clear proposal for the work.
3. **Build and validate:** We work through reviewable deliveries, testing, and validation so issues are found before production.
4. **Launch and support:** We prepare the release, documentation, and agreed follow-up so the solution can be used and maintained.

**Quality statement**

> Before a production release, each delivery goes through technical review, functional testing, and validation of its main user journeys. The exact controls depend on the type of solution and its level of risk.

**CTA:** `Start an inquiry` → `/en/contact/`

## HOME-FOUNDER

**Status:** **APPROVED** in Spanish and English. A founder photograph remains optional future work and is not an implementation or release dependency for this section.

**Objective:** Establish personal trust and explain founder accountability without simulating a large agency.

**Heading**

> Responsabilidad técnica directa

**Homepage biography**

> FURLANICH está liderado por Samuel Furlanich, desarrollador de software full-stack con estudios completos en Ciencias de la Computación en la Universidad de Buenos Aires. Samuel mantiene la responsabilidad técnica directa en cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.

This concise homepage copy is **APPROVED**. The detailed biography remains owned by [`PAGE-FOUNDER`](studio-and-founder.md).

**Primary CTA:** `Hablemos de tu proyecto` → `/contacto/`

**Secondary CTA:** `Conocer a Samuel` → `/estudio/samuel-furlanich/`

**Evidence:** Approved founder facts and professional links.

**Required source material:** The approved founder facts and existing localized Founder destinations. No photograph is required.

### HOME-FOUNDER approved English adaptation

**Heading**

> Direct technical responsibility

**Homepage biography**

> FURLANICH is led by Samuel Furlanich, a full-stack software developer who completed his Computer Science studies at the University of Buenos Aires. Samuel retains direct technical responsibility for every project and brings in specialist collaborators when the scope requires them.

**Primary CTA:** `Let's talk about your project` → `/en/contact/`

**Secondary CTA:** `Meet Samuel` → `/en/about/samuel-furlanich/`

## HOME-CTA

**Status:** **APPROVED** in Spanish and English for the current direct-contact destination. The structured inquiry form and privacy flow remain release blockers for the complete business-site launch, not blockers for this homepage section while the Contact page offers working direct channels.

**Objective:** Give a qualified visitor an immediate, low-ambiguity next step.

**Heading**

> ¿Tenés una necesidad concreta o un sistema que necesita atención?

**Copy**

> Contanos brevemente qué querés resolver. Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.

**Response statement**

> Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.

**Primary CTA:** `Contanos sobre tu proyecto` → `/contacto/`

**Secondary CTA:** `Escribir por WhatsApp` → confirmed WhatsApp link

**Evidence:** The response statement is an operating commitment and should be reviewed after launch.

**Dependencies:** Working localized Contact routes and the confirmed WhatsApp destination. These exist and are sufficient for this homepage CTA. Enabling the structured form still requires the provider and privacy decisions owned by `PAGE-CONTACT`.

### HOME-CTA approved English adaptation

**Heading**

> Do you have a concrete need or a system that needs attention?

**Copy**

> Tell us briefly what you need to solve. Samuel will personally review your inquiry to determine whether it makes sense to continue with a conversation.

**Response statement**

> Usual response time is within the same business day. In exceptional cases, it may take up to two business days.

**Primary CTA:** `Tell us about your project` → `/en/contact/`

**Secondary CTA:** `Write on WhatsApp` → `https://wa.me/5491150117565`

## Conversion narrative review — APPROVED

- `HOME-HERO` states the offer and keeps the page's strongest primary CTA.
- `HOME-PROBLEMS` creates recognition before service terminology appears.
- `HOME-SERVICES` maps those situations to three offers with one section-level CTA; repeated card CTAs are intentionally omitted.
- `HOME-AUDIENCES` qualifies fit without implying sector specialization.
- `HOME-PROOF` earns trust through explicit evidence standards until approved project evidence exists; it does not imitate a case-study gallery.
- `HOME-PROCESS` explains engagement only after relevance and credibility have been established.
- `HOME-FOUNDER` identifies the accountable person without adding a résumé timeline or technology catalogue.
- `HOME-CTA` closes with one primary inquiry path and one direct-channel alternative.

Across the page, technology names remain outside the first-pass hierarchy, no result metric or client history is implied, and repeated CTA labels are limited to deliberate conversion points. The page must not add skills grids, employment timelines, recruiter language, or GitHub-first project presentation.

## Implementation readiness matrix

| Section | Product | English | Design | Evidence | Ready? |
| --- | --- | --- | --- | --- | --- |
| `HOME-PROBLEMS` | **APPROVED** | **APPROVED** | **APPROVED** | Relevance statements; project evidence not required | **YES** |
| `HOME-SERVICES` | **APPROVED** | **APPROVED** | **APPROVED** | Offer scope approved; no case-study claim | **YES** |
| `HOME-AUDIENCES` | **APPROVED** | **APPROVED** | **APPROVED** | Target contexts only; specialization claims forbidden | **YES** |
| `HOME-PROOF` | **APPROVED** fallback; project cards **OPEN** | **APPROVED** fallback | **APPROVED** fallback | Founder accountability and integrity rules only; no approved project card | **YES — fallback only** |
| `HOME-PROCESS` | **APPROVED** | **APPROVED** | **APPROVED** | Approved operating process; no certification claim | **YES** |
| `HOME-FOUNDER` | **APPROVED** | **APPROVED** | **APPROVED** | Approved founder facts and destinations | **YES** |
| `HOME-CTA` | **APPROVED** | **APPROVED** | **APPROVED** | Approved response commitment and working direct channels | **YES** |

The complete homepage may proceed to implementation planning using the fallback version of `HOME-PROOF`. A plan that requires project cards, the Projects routes, a contact form, new imagery, or new architecture is not authorized by this closure.

## Page-level acceptance criteria

- One clear H1 communicates a business outcome.
- The primary CTA consistently routes to `PAGE-CONTACT`.
- No section presents unsupported clients, metrics, sectors, or production maturity.
- Technology does not dominate the first-pass hierarchy.
- The founder profile remains secondary but discoverable.
- Spanish copy uses correct Argentine voseo and accents.
- The page remains understandable without motion or JavaScript-dependent reveals.
- Keyboard and mobile users can reach all navigation and CTAs.
- Project cards comply with disclosure permissions.

## MKT-D02 — Hero and actions — APPROVED revision 1

**Revision 1: APPROVED. Human disposition D02: APPROVED.** Human reviewer: project owner (user). Date: 2026-09-16. Source: explicit disposition in the decision-review task. The user supplied “D02 - APPROVED”. This accepts the bilingual hero and action wording as a pair. D03 is rejected, so its proposed route-wide notice and Contact presentation are not adopted; the existing demonstration boundary remains authoritative.

Current text below is an excerpt from the deployed baseline audited on 2026-09-15. Accepted wording targets D01 territory B. Global demonstration notice and Contact contract are owned by [D03](contact-and-privacy.md#mkt-d03-demonstration-presentation-contract-rejected-revision-1); the notice appears on every route before the hero. No response promise belongs beside the current demo CTA.

| Field | Current ES / EN | Accepted Spanish | Accepted English | Reason / permission |
| --- | --- | --- | --- | --- |
| Eyebrow | Desarrollo de software a medida para pymes / Custom software development for small and medium-sized businesses | Estudio de software a medida | Custom software studio | Accepted under D01; concise durable category |
| H1 | Software práctico para vender, atender y operar mejor. / Practical software to help you sell, serve customers, and run your business better. | Conectá tus sistemas. Simplificá el trabajo diario. | Connect your systems. Simplify everyday work. | Priority situation; intended service value, not a verified outcome |
| Support | Full three-service catalogue ending necesidades concretas / concrete needs | Sitios y aplicaciones web, automatización por WhatsApp e integraciones para coordinar pedidos, reservas y tareas. También mejoramos sistemas existentes. | Websites, web applications, WhatsApp automation and integrations for orders, bookings and everyday tasks. We also improve existing systems. | Preserve all three services; boundaries remain on Services and global demo notice |
| Primary | Contanos sobre tu proyecto / Tell us about your project | Ver contacto | Contact options | Opens Contact; never means WhatsApp or submitted inquiry; D03 baseline preserved |
| Secondary | Ver servicios / View services | Ver servicios | Explore services | Opens localized Services |
| Accountability | Atención técnica directa / Direct technical contact plus geographic/language fragments | Samuel Furlanich, responsable técnico del estudio. | Samuel Furlanich, the studio’s technical lead. | Named accountability, not team-size or seniority claim |
| Availability | Separate geographic and language lines | Buenos Aires, Argentina. Disponibilidad en español e inglés para Argentina y el exterior. | Based in Buenos Aires, Argentina. Available in Spanish and English for work in Argentina and internationally. | Availability only, under explicit inactive-service demonstration notice; no client-history claim |

**D02 acceptance recorded:** ES and EN hero/action wording is approved as a pair. The existing demonstration context remains authoritative under rejected D03; its proposed notice and Contact replacements are not adopted. No manual line breaks, hidden qualifiers or smaller mobile type force the candidate to fit. The operational H1 remains within accepted D01 territory.

## MKT-D05-HOME — Consolidated narrative — APPROVED revision 1

**Revision 1: APPROVED under D05.** Human reviewer: project owner (user). Date: 2026-09-16. Source: explicit disposition in the decision-review task. The user supplied “D05 - APPROVED”. This accepts the Home consolidation and bilingual content structure, subject to the D04 evidence boundary and the D03 rejection.

Accepted source order under D05: global demo notice → HOME-HERO → HOME-PROBLEMS (with audience context) → HOME-SERVICES → HOME-PROOF → HOME-PROCESS → HOME-FOUNDER → HOME-CTA. Retire only the standalone HOME-AUDIENCES presentation; preserve its relevant audience meaning in Problems and Services. Retain stable process fragments. No project card or project name is added to Home.

| Section / current ES and EN | Accepted Spanish | Accepted English | Role / retained boundary |
| --- | --- | --- | --- |
| Problems introduction: Estos son algunos de los problemas… / These are some of the problems… | Cuando el trabajo queda repartido entre herramientas | When work is spread across tools | Three plain situation rows; consolidate duplicated audience cards |
| New merged audience sentence, replacing standalone sector list | Para pymes que coordinan pedidos, reservas o atención al cliente, o necesitan mejorar un sistema existente. | For small and medium-sized businesses managing orders, bookings or customer service, or improving an existing system. | Target contexts, not sector experience |
| Problems rows, replacing four repeated cards | Pedidos y reservas que se reorganizan a mano. / Consultas repetidas que interrumpen el trabajo. / Sistemas que no comparten información o necesitan mejoras. | Orders and bookings reorganized by hand. / Repeated questions that interrupt work. / Systems that do not share information or need improvement. | Plain list; service examples retain website relevance |
| Services intro: No imponemos una plataforma genérica. / We do not force a generic platform. | Construir, conectar o mejorar, según el problema. | Build, connect or improve, depending on the problem. | Services labels and summaries remain the three approved offers; one Services CTA |
| Proof heading: Credibilidad sin promesas infladas / Credibility without inflated claims | Una responsabilidad técnica clara | Clear technical accountability | Founder/process evidence only; no evidence-strength upgrade |
| Proof commitments replace publication-policy lead | Samuel participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. El alcance y las validaciones se acuerdan según cada necesidad. | Samuel is involved in defining the problem, technical decisions and review of the work. Scope and validation are agreed around each need. | Intended operating model; no past-delivery guarantee |
| Proof secondary link: founder-only bridge | Ver proyectos y sus límites | Explore projects and their limitations | Accepted generic Projects-index bridge under D04; no featured item/card/media |
| Process opening and step descriptions | Cómo trabajamos / Entender: revisar el proceso y el problema. / Definir: acordar alcance, responsabilidades y entregables. / Construir y revisar: comprobar los recorridos importantes. / Entregar: documentar el uso y acordar los pasos siguientes. | How we work / Understand: review the process and the problem. / Define: agree scope, responsibilities and deliverables. / Build and review: check important user journeys. / Hand over: document use and agree next steps. | Four ordered steps; preserves proportional validation, not certification or SLA |
| Founder long biography bridge | Samuel Furlanich dirige FURLANICH. Conocé su experiencia y formación. | Samuel Furlanich leads FURLANICH. Explore his experience and background. | Link to Founder; no duplicated education/history or employer claim |
| Final conditional inquiry/response paragraph | Explorá las opciones de contacto y probá el formulario de demostración. No se envían consultas desde el formulario. | Explore the contact options and try the demonstration form. The form does not send inquiries. | Current demo mode; primary label from D02, no response-time line |

Services card text not listed for replacement remains approved. Other copy within a removed block is retired from that location only. Accepted Home keeps seven semantic sections after consolidation, with distinct relevance, offer, trust, process, person and next-action roles. The low-fidelity study uses these roles; it does not approve final spacing or type changes.
