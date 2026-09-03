---
id: PAGE-HOME
type: page-spec
status: APPROVED
related:
  - BRAND-POSITIONING
  - AUDIENCES-SERVICES
  - IA-SITE
  - PROJECT-EVIDENCE
  - PAGE-CONTACT
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-03
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

### Approved English adaptation

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

## HOME-SERVICES

**Objective:** Explain the three launch services as useful business outcomes.

**Heading**

> Servicios para necesidades concretas

**Introduction**

> No imponemos una plataforma genérica. Primero entendemos el proceso y después evaluamos si conviene construir, integrar o modernizar.

### SERVICE-WEB

**Title:** Sitios y aplicaciones web comerciales

> Soluciones web para presentar, vender o gestionar servicios: sitios profesionales, catálogos, pedidos, reservas, portales para clientes e integraciones con medios de pago.

**CTA:** `Explorar soluciones web` → `/servicios/`

**Fragment target:** **OPEN.** The exact service-section fragment identifier and whether this CTA must target a fragment remain unresolved.

### SERVICE-WHATSAPP

**Title:** Automatización por WhatsApp e integraciones

> Flujos para responder consultas, registrar pedidos, gestionar reservas, enviar confirmaciones y conectar WhatsApp con otras herramientas del negocio.

**CTA:** `Explorar automatizaciones` → `/servicios/`

**Fragment target:** **OPEN.** The exact service-section fragment identifier and whether this CTA must target a fragment remain unresolved.

### SERVICE-CONSULTING

**Title:** Mantenimiento y consultoría de software

> Diagnóstico y mejora de sistemas existentes para resolver problemas, reducir riesgos y definir un camino técnico mantenible.

**CTA:** `Explorar mantenimiento y consultoría` → `/servicios/`

**Fragment target:** **OPEN.** The exact service-section fragment identifier and whether this CTA must target a fragment remain unresolved.

**Section CTA:** `Ver todos los servicios` → `/servicios/`

**Evidence:** Each service should eventually connect to at least one relevant evidence item. Missing evidence remains visible in `PROJECT-EVIDENCE`.

**Required source material:** Included/excluded scope, typical starting point, provider dependencies, and approved evidence for each service.

## HOME-AUDIENCES

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

## HOME-PROOF

**Objective:** Provide credible, client-oriented proof with transparent maturity and disclosure.

**Heading**

> Soluciones, laboratorio y prototipos

**Introduction**

> Una selección de trabajos que muestran cómo FURLANICH analiza y construye soluciones. Cada proyecto indica claramente su contexto y estado.

**CTA:** `Ver todos los proyectos` → `/proyectos/`

**Evidence and source material:** Governed by `PROJECT-EVIDENCE`. Exact cards and public category labels remain OPEN/PROPOSED. At most three items should appear; they are ordered by commercial relevance rather than chronology.

## HOME-PROCESS

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

## HOME-FOUNDER

**Objective:** Establish personal trust and explain founder accountability without simulating a large agency.

**Heading**

> Responsabilidad técnica directa

**Homepage biography — PROPOSED**

> FURLANICH es un estudio de software liderado por Samuel Furlanich, desarrollador full-stack con formación completa en Ciencias de la Computación en la Universidad de Buenos Aires. Samuel dirige cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.

The founder facts are **APPROVED**; this exact homepage biography wording remains **PROPOSED**. See [`PAGE-FOUNDER`](studio-and-founder.md) for the founder-profile biography status.

**Primary CTA:** `Hablemos de tu proyecto` → `/contacto/`

**Secondary CTA:** `Conocer a Samuel` → `/estudio/samuel-furlanich/`

**Evidence:** Approved founder facts and professional links.

**Required source material:** Founder photograph and final confirmation of exact biography wording.

## HOME-CTA

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

**Required source material:** Final working contact routes and privacy-ready inquiry flow.

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
