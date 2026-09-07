---
id: PAGE-STUDIO
type: page-spec
status: APPROVED
related:
  - PAGE-FOUNDER
  - BRAND-POSITIONING
  - PAGE-CONTACT
  - PORTFOLIO-MIGRATION
  - IA-SITE
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-PROJECTS
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-07
---

# Studio and founder pages

## PAGE-STUDIO responsibility — APPROVED

Explain FURLANICH as a founder-led studio: direct technical accountability, collaborators when scope requires them, operating principles, location, and approach to maintainable software.

## Required Studio content

- FURLANICH identity and purpose.
- Samuel's direct leadership and accountability.
- Collaborator model without false team-size implications.
- Buenos Aires, Argentina, with national and international availability.
- Working principles: understand before building, scope clearly, validate incrementally, and maintain responsibly.
- Link to `PAGE-FOUNDER`.
- Link to `PAGE-CONTACT`.

The Initiative 5 closure below approves the exact Studio copy and visual structure.

## PAGE-FOUNDER responsibility — APPROVED

Preserve the professional depth of the personal portfolio without making it the business homepage. This is the appropriate location for detailed technology, experience, education, experimental work, GitHub, LinkedIn, and CV.

## Approved founder facts

- Samuel Furlanich is a full-stack software developer and founder of FURLANICH.
- Independent work began in 2024.
- Computer Science studies at the University of Buenos Aires were completed.
- Technical education was completed at E.E.S.T. N.º 1 in Chivilcoy.
- He began work as a Software Developer at Clever Soft SA in June 2026.
- His technical emphasis includes .NET backend development and React, Next.js, and Blazor interfaces.
- He leads FURLANICH projects and may incorporate specialist collaborators according to scope.

Clever Soft SA appears in narrative biography only, not as a résumé-style fact list or experience-timeline item.

## Approved detailed biography

> Samuel Furlanich es desarrollador de software full-stack y fundador de FURLANICH. Trabaja de forma independiente desde 2024, diseñando y manteniendo aplicaciones web y de escritorio, sistemas de gestión y automatizaciones. Completó sus estudios de Ciencias de la Computación en la Universidad de Buenos Aires y cuenta además con formación como Técnico Informático en la E.E.S.T. N.º 1 de Chivilcoy. Su práctica se especializa en backend con .NET y se complementa con interfaces construidas con React, Next.js y Blazor. También se desempeña como Software Developer en Clever Soft SA, experiencia que complementa su trabajo al frente de FURLANICH. Lidera personalmente cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.

### Approved English adaptation

> Samuel Furlanich is a full-stack software developer and the founder of FURLANICH. He has worked independently since 2024, designing and maintaining web and desktop applications, management systems, and automations. He completed his Computer Science studies at the University of Buenos Aires and also trained as an IT Technician at E.E.S.T. No. 1 in Chivilcoy. His practice focuses on .NET backend development, complemented by interfaces built with React, Next.js, and Blazor. He also works as a Software Developer at Clever Soft SA, experience that complements his work leading FURLANICH. He personally leads each project and brings in specialist collaborators when the scope requires them.

Both biographies are **APPROVED**. Clever Soft SA remains part of the narrative rather than a résumé-style timeline entry.

## Homepage-foundation minimum Founder destination — APPROVED

Before the personal homepage hero is removed, `/estudio/samuel-furlanich/` and `/en/about/samuel-furlanich/` must provide a coherent replacement rather than a biography-only placeholder.

The minimum localized profile contains:

1. Samuel's name and role as founder and full-stack software developer.
2. The approved biography in the active language.
3. Concise, fact-checked experience and education content migrated from the current portfolio; Clever Soft SA remains inside the biography only.
4. Business-relevant technical capabilities, with detailed technology kept secondary.
5. Downloadable CV access plus LinkedIn and GitHub links.
6. A path to the localized Contact destination.
7. A link to preserved project material when its target route is available; project cards do not need to be duplicated on the Founder page.

A portrait is not required for this minimum. The existing CV asset and professional URLs must be verified during integration before the current personal hero is removed. Failed verification is an **INTEGRATION BLOCKER**; redesigning the CV or adding photography is not.

A biography-only page was rejected because it would strand the existing CV, experience, education, capabilities, and professional links. Requiring the final visual design and complete project catalogue was rejected because those are not necessary to preserve founder discoverability.

## Founder-profile content

- portrait;
- narrative biography;
- selected professional experience;
- education;
- business-relevant capabilities;
- selected projects and Laboratory/experimental work;
- GitHub and LinkedIn;
- downloadable CV;
- contact CTA.

Entertainment and game-development work may appear here or in Laboratory, not in the main commercial navigation.

## Open decisions

- Founder photograph is **DEFERRED**. No approved portrait exists in the repository, and the completed Founder page remains text-led without a placeholder or empty media column.
- A later CV redesign or content revision beyond verification of the current asset.
- Exact Chivilcoy wording outside the detailed biography/contact context.

## Acceptance criteria

- Studio content establishes business trust without simulating a large agency.
- Founder content remains factual and clearly secondary to the commercial journey.
- Professional employment is not presented as an endorsement of FURLANICH.
- Detailed technology content does not leak back into the primary homepage hierarchy.


## Initiative 5 decision closure — APPROVED

This closure completes the product, content, information-architecture, visual-composition, responsive, and accessibility decisions for Studio and Founder. It does not authorize application implementation in this documentation task.

The two pages remain distinct:

- **Studio** explains how FURLANICH is structured, how responsibility works, and why the operating model is credible.
- **Founder** explains who Samuel is and provides the professional depth behind that responsibility.

Homepage remains the short commercial orientation, Services owns the offer, Projects owns evidence, and Contact owns inquiry. Studio does not become a second homepage or a résumé. Founder does not become a generic About page or duplicate the Projects index.

### Routes, navigation, and contextual reachability

The existing approved localized routes remain:

- Spanish Studio: /estudio/
- Spanish Founder: /estudio/samuel-furlanich/
- English Studio: /en/about/
- English Founder: /en/about/samuel-furlanich/

Primary navigation uses “El estudio” / “About” for the Studio route. The Founder profile is not a primary-navigation destination.

The Founder profile is reached through:

- the Studio founder bridge;
- a direct “Samuel Furlanich” link in the footer professional group, beside LinkedIn and GitHub;
- a subdued contextual link on Contact after the primary direct-contact choices when Samuel's personal review is explained;
- a subdued contextual link from a project detail only when its evidence text explicitly relies on founder-published source or Samuel's professional context.

The Projects index does not gain a general Founder CTA, and project final CTAs remain commercial. Contextual Founder links never displace Contact or become equal primary buttons.

Current implementation differs from the approved IA: /estudio/ and /en/about/ have no page entry points, and the shared header/footer currently label the Founder route as “El estudio” / “About.” Implementation planning must add Studio as its own semantic localized route pair, preserve Founder equivalence, and route the primary navigation to Studio.

## PAGE-STUDIO approved hierarchy and content

The approved order is:

1. STUDIO-INTRO
2. STUDIO-ACCOUNTABILITY, including the collaborator model
3. STUDIO-PRINCIPLES
4. STUDIO-LOCATION
5. STUDIO-FOUNDER-BRIDGE
6. STUDIO-FINAL-CTA

### STUDIO-INTRO copy comparison

| Option | Spanish H1 | Natural English adaptation | Decision |
| --- | --- | --- | --- |
| A | Software a medida con responsabilidad técnica directa. | Custom software with direct technical accountability. | **APPROVED**. It states both the offer and the differentiating operating model without duplicating the homepage outcome headline. |
| B | Un estudio de software para necesidades concretas de negocio. | A software studio for concrete business needs. | **REJECTED** for this page. Clear, but less distinctive and too close to existing business-needs language. |
| C | Sistemas mantenibles, construidos con responsabilidad clara. | Maintainable systems, built with clear accountability. | **REJECTED** for the H1. Strong supporting language, but it describes a quality before identifying the custom-software offer. |

### STUDIO-INTRO Spanish — APPROVED

**Eyebrow**

> Estudio de software liderado por su fundador

**H1**

> Software a medida con responsabilidad técnica directa.

**Positioning**

> FURLANICH diseña, desarrolla y mejora software a medida para negocios que necesitan resolver procesos concretos. Samuel Furlanich conduce el relevamiento, la dirección técnica y la entrega, con decisiones explícitas y sistemas pensados para mantenerse.

**Supporting statement**

> Cuando el alcance requiere especialidades adicionales, se incorporan colaboradores de forma explícita.

**Primary action:** “Contanos qué necesitás resolver” → /contacto/

**Secondary action:** “Conocer a Samuel” → /estudio/samuel-furlanich/

**Operating-model panel label:** “Modelo de trabajo”

- Liderado por su fundador
- Responsabilidad técnica directa
- Buenos Aires, Argentina
- Español e inglés
- Colaboradores especializados según el alcance

### STUDIO-INTRO English — APPROVED

**Eyebrow**

> Founder-led software studio

**H1**

> Custom software with direct technical accountability.

**Positioning**

> FURLANICH designs, builds, and improves custom software for businesses with concrete operational needs. Samuel Furlanich leads discovery, technical direction, and delivery, keeping decisions explicit and systems maintainable.

**Supporting statement**

> When the scope calls for additional expertise, specialist collaborators are brought in explicitly.

**Primary action:** “Tell us what you need to solve” → /en/contact/

**Secondary action:** “Meet Samuel” → /en/about/samuel-furlanich/

**Operating-model panel label:** “Operating model”

- Founder-led
- Direct technical accountability
- Buenos Aires, Argentina
- Spanish and English
- Specialist collaborators when the scope calls for them

The panel is factual, not statistical. It contains no team, client, project, tenure, satisfaction, or performance metric.

### STUDIO-ACCOUNTABILITY Spanish — APPROVED

**H2**

> Dirección técnica de principio a fin

> Samuel lidera el relevamiento inicial, define la dirección técnica y permanece involucrado durante la entrega. La conversación comercial y las decisiones técnicas no quedan separadas por capas de venta o gestión que oculten quién responde por el trabajo.

> Esta continuidad reduce pérdidas de contexto, permite explicar los compromisos con claridad y mantiene visible la responsabilidad sobre lo que se decide, se construye y se entrega.

**H3**

> Colaboración según el alcance

> FURLANICH está liderado por Samuel. Cuando un proyecto requiere experiencia fuera del alcance principal de entrega, pueden incorporarse colaboradores especializados de forma explícita. Su participación depende de las necesidades del proyecto y no cambia quién conduce la dirección técnica ni quién responde por la entrega.

### STUDIO-ACCOUNTABILITY English — APPROVED

**H2**

> Technical direction from start to finish

> Samuel leads the initial discovery, sets the technical direction, and remains involved throughout delivery. Commercial conversations and technical decisions are not separated by sales or project-management layers that obscure who is accountable for the work.

> That continuity reduces lost context, makes trade-offs easier to explain, and keeps responsibility visible across what is decided, built, and delivered.

**H3**

> Collaboration shaped by the scope

> FURLANICH is led by Samuel. When a project requires expertise beyond the core delivery scope, specialist collaborators may be brought in explicitly. Their involvement depends on the needs of the project and does not change who leads the technical direction or remains accountable for delivery.

This wording makes no permanent-team, subcontracting, staffing, availability, or contractual promise.

### STUDIO-PRINCIPLES Spanish — APPROVED

**H2**

> Principios para trabajar con claridad

**Introduction**

> No reemplazan el proceso de cada proyecto: explican los criterios que orientan las decisiones y reducen riesgo para el negocio.

- **Entender antes de construir.** Primero se ordenan el problema, las personas involucradas, las restricciones y el resultado esperado, para evitar invertir en la solución equivocada.
- **Definir el alcance con claridad.** Objetivos, entregables, límites, responsabilidades y criterios de validación quedan explícitos para que ambas partes sepan qué se va a resolver.
- **Validar de forma incremental.** Los recorridos importantes se revisan mediante entregas verificables para detectar desvíos temprano y reducir riesgo.
- **Construir para mantener.** La arquitectura, las pruebas y la documentación se ajustan al alcance para que la solución pueda evolucionar sin depender de decisiones opacas.

### STUDIO-PRINCIPLES English — APPROVED

**H2**

> Principles for clear delivery

**Introduction**

> These do not replace each project's delivery process. They are the criteria used to guide decisions and reduce business risk.

- **Understand before building.** We first clarify the problem, the people involved, the constraints, and the intended outcome, so the business does not invest in the wrong solution.
- **Define the scope clearly.** Objectives, deliverables, boundaries, responsibilities, and validation criteria are made explicit so both sides know what the work is meant to solve.
- **Validate incrementally.** Important journeys are reviewed through verifiable deliveries so issues can be found early and risk can be reduced.
- **Build for maintainability.** Architecture, testing, and documentation are proportionate to the scope so the solution can evolve without depending on opaque decisions.

These are unnumbered operating principles. They do not repeat the Homepage Process sequence or the Services six-principle catalogue.

### STUDIO-LOCATION Spanish — APPROVED

**H2**

> Base en Buenos Aires, disponibilidad nacional e internacional

> FURLANICH trabaja desde Buenos Aires, Argentina, con proyectos en todo el país y disponibilidad para colaboraciones internacionales. La comunicación puede desarrollarse en español o en inglés.

### STUDIO-LOCATION English — APPROVED

**H2**

> Based in Buenos Aires, available nationally and internationally

> FURLANICH works from Buenos Aires, Argentina, with projects across the country and availability for international engagements. Communication is available in Spanish and English.

Availability is not evidence of previous international client work. The public section uses no map, client-location graphic, flag wall, or unsupported footprint claim.

### STUDIO-FOUNDER-BRIDGE Spanish — APPROVED

**H2**

> La persona detrás de la dirección técnica

> Samuel Furlanich es el fundador y responsable técnico directo de FURLANICH. Su experiencia combina desarrollo backend con .NET, interfaces web, sistemas de gestión, automatizaciones y mantenimiento de software. En su perfil profesional podés consultar la biografía completa, experiencia, formación, capacidades, trabajo seleccionado, CV y enlaces profesionales.

**Action:** “Conocer a Samuel” → /estudio/samuel-furlanich/

### STUDIO-FOUNDER-BRIDGE English — APPROVED

**H2**

> The person behind the technical direction

> Samuel Furlanich is the founder and directly accountable technical lead of FURLANICH. His background spans .NET backend development, web interfaces, management systems, automation, and software maintenance. His professional profile provides the full biography, experience, education, capabilities, selected work, CV, and professional links.

**Action:** “Meet Samuel” → /en/about/samuel-furlanich/

The bridge is intentionally shorter than the approved detailed biography and contains no education timeline, experience entries, capability catalogue, or repeated CV controls.

### STUDIO-FINAL-CTA Spanish — APPROVED

**H2**

> Conversemos sobre lo que hoy frena a tu negocio

> Contanos qué necesitás resolver y cómo funciona hoy. Samuel revisará personalmente la consulta para evaluar el próximo paso razonable.

**Primary action:** “Iniciar una consulta” → /contacto/

### STUDIO-FINAL-CTA English — APPROVED

**H2**

> Let's talk about what's holding your business back

> Tell us what you need to solve and how it works today. Samuel will personally review your enquiry to assess the most sensible next step.

**Primary action:** “Start an enquiry” → /en/contact/

There is no form or competing Founder action in this final band.

## PAGE-FOUNDER approved hierarchy and content

The approved order is:

1. FOUNDER-HEADER
2. FOUNDER-PROFESSIONAL-LINKS
3. FOUNDER-EXPERIENCE
4. FOUNDER-EDUCATION
5. FOUNDER-CAPABILITIES
6. FOUNDER-PROJECTS-BRIDGE
7. FOUNDER-FINAL-CTA

The approved detailed Spanish and English biographies earlier in this document remain unchanged and are the exact FOUNDER-HEADER biographies.

### FOUNDER-HEADER — APPROVED

**Spanish context:** “Fundador de FURLANICH · Desarrollador de software full-stack”

**English context:** “Founder of FURLANICH · Full-stack software developer”

**H1 in both languages:** “Samuel Furlanich”

The context line, H1, and approved detailed biography form the complete text-led header. No approved Founder photograph exists in the repository. Photography is therefore **DEFERRED**, not blocked: implementation uses an approximately eight-column reading measure at wide sizes and creates no placeholder, silhouette, generated portrait, or empty media column.

### FOUNDER-PROFESSIONAL-LINKS — APPROVED

**Spanish H2:** “Perfil profesional”

**English H2:** “Professional profile”

Use one strong action followed by two secondary actions:

- “Descargar CV” / “Download CV” → /Samuel-Furlanich-CV.pdf
- “LinkedIn” → https://www.linkedin.com/in/samuel-furlanich/
- “GitHub” → https://github.com/Furlanich

The CV action is visually primary. LinkedIn and GitHub share a quieter secondary treatment. Contact does not appear in this group and remains the commercial final CTA.

The asset exists at public/Samuel-Furlanich-CV.pdf. The Homepage Foundation record reports PDF-signature and pdfinfo validation, successful normal and /Portfolio static builds, and HTTP 200 for GitHub on 2026-09-04. The owner supplied and confirmed the LinkedIn destination; anonymous automated access reaches LinkedIn's authentication wall, so implementation must recheck the intended profile in an interactive browser without changing the URL merely to satisfy automation.

The current CV's content currency has not been approved in this initiative. A CV content audit or redesign is **DEFERRED** as separate work. Implementation preserves the existing asset and download name, verifies both root and configured base-path downloads, and does not silently rewrite the document.

### FOUNDER-EXPERIENCE Spanish — APPROVED

**H2**

> Experiencia profesional

**Entry 1**

- Periodo: “Desde 2024”
- Rol: “Desarrollo de software independiente”
- Contexto: “Práctica profesional”
- Resumen: “Diseño, desarrollo y mantenimiento de aplicaciones web y de escritorio, sistemas de gestión y automatizaciones. El trabajo abarca backend con .NET, interfaces web, integraciones, mejora de rendimiento y soporte técnico acordado.”

**Entry 2**

- Periodo: “2021”
- Rol: “Pasantía profesional como Técnico Informático”
- Contexto: “E.E.S.T. N.º 1, Chivilcoy”
- Resumen: “Desarrollo y soporte de aplicaciones de gestión con .NET y ASP.NET Razor Pages, junto con mantenimiento de entornos de desarrollo, redes locales, cuentas y permisos.”

### FOUNDER-EXPERIENCE English — APPROVED

**H2**

> Professional experience

**Entry 1**

- Period: “Since 2024”
- Role: “Independent software development”
- Context: “Professional practice”
- Summary: “Designing, building, and maintaining web and desktop applications, management systems, and automations. The work spans .NET backends, web interfaces, integrations, performance improvements, and agreed technical support.”

**Entry 2**

- Period: “2021”
- Role: “IT Technician professional internship”
- Context: “E.E.S.T. No. 1, Chivilcoy”
- Summary: “Developed and supported management applications with .NET and ASP.NET Razor Pages, while also maintaining development environments, local networks, user accounts, and permissions.”

Clever Soft SA remains only in the approved narrative biography. It is not a timeline entry, logo, endorsement, client relationship, or FURLANICH proof point.

### FOUNDER-EDUCATION — APPROVED

**Spanish H2:** “Formación”

- **Ciencias de la Computación** — Universidad de Buenos Aires — “Estudios completados”
- **Técnico Informático** — E.E.S.T. N.º 1, Chivilcoy — “Formación completada”

**English H2:** “Education”

- **Computer Science** — University of Buenos Aires — “Studies completed”
- **IT Technician** — E.E.S.T. No. 1, Chivilcoy — “Training completed”

Education is factual and secondary to experience. No institutional logos or decorative credential treatment are used.

### FOUNDER-CAPABILITIES Spanish — APPROVED

**H2**

> Capacidades técnicas aplicadas

**Introduction**

> La tecnología se presenta según el tipo de problema que permite resolver, no como una colección de logos o niveles de dominio.

**Backend y sistemas de negocio**

- Backend con .NET y ASP.NET
- APIs, lógica de negocio e integraciones
- Acceso a datos y sistemas de gestión
- Aplicaciones de escritorio cuando el contexto lo requiere

**Interfaces web**

- React y Next.js
- Blazor
- Interfaces accesibles y adaptables
- Flujos comerciales y operativos

**Integraciones y automatización**

- APIs de terceros
- Integraciones con pagos, calendarios y mensajería
- Automatización de procesos
- Conexión con sistemas existentes

**Ingeniería y entrega**

- Pruebas automatizadas y validación funcional
- Docker y CI/CD
- Diagnóstico, depuración y rendimiento
- Publicación, documentación y mantenibilidad

### FOUNDER-CAPABILITIES English — APPROVED

**H2**

> Applied technical capabilities

**Introduction**

> Technology is organized by the problems it helps solve, not as a collection of logos or proficiency scores.

**Backend and business systems**

- .NET and ASP.NET backends
- APIs, business logic, and integrations
- Data access and management systems
- Desktop applications when the context calls for them

**Web interfaces**

- React and Next.js
- Blazor
- Accessible, responsive interfaces
- Commercial and operational workflows

**Integrations and automation**

- Third-party APIs
- Payment, calendar, and messaging integrations
- Business-process automation
- Connections to existing systems

**Engineering and delivery**

- Automated testing and functional validation
- Docker and CI/CD
- Diagnosis, debugging, and performance
- Deployment, documentation, and maintainability

A separate technology-detail section is **REJECTED** for this completion scope. These groups already preserve useful exact technology names; a second catalogue would duplicate them and drift toward the legacy skills wall. Proficiency percentages, star ratings, self-assigned levels, marquees, and technology-logo walls are rejected.

### FOUNDER-PROJECTS-BRIDGE Spanish — APPROVED

**H2**

> Trabajo y evidencia técnica

> La selección pública de Proyectos reúne evidencia de implementación y trabajo clasificado por madurez, con sus límites explícitos. Ese índice concentra el contexto para evitar duplicar historias o confundir evidencia técnica con experiencia profesional.

**Action:** “Ver proyectos seleccionados” → /proyectos/

### FOUNDER-PROJECTS-BRIDGE English — APPROVED

**H2**

> Work and technical evidence

> The public Work selection brings together implementation evidence and work classified by maturity, with its limitations stated explicitly. Keeping that context in one index avoids duplicating stories or confusing technical evidence with professional experience.

**Action:** “View selected work” → /en/work/

The single bridge is approved instead of two or three duplicated project summaries. The current public inventory is small, includes different maturity and educational contexts, and is already explained more accurately by PAGE-PROJECTS and its detail pages.

### FOUNDER-FINAL-CTA Spanish — APPROVED

**H2**

> ¿Querés conversar sobre una necesidad de tu negocio?

> La experiencia de Samuel aporta contexto sobre quién conduce el trabajo. Para evaluar un proyecto, contanos qué necesitás resolver.

**Primary action:** “Iniciar una consulta” → /contacto/

### FOUNDER-FINAL-CTA English — APPROVED

**H2**

> Want to discuss a business need?

> Samuel's professional background shows who leads the work. To evaluate a project, tell us what you need to solve.

**Primary action:** “Start an enquiry” → /en/contact/

The page ends with the commercial bridge, not GitHub.

## Duplication audit — APPROVED

| Area | Distinct responsibility after closure | Content deliberately not repeated |
| --- | --- | --- |
| Homepage | Fast answer to who/what FURLANICH is, service relevance, trust, process, and inquiry | No Studio principles catalogue, full biography, experience, education, or capability groups |
| Studio | Business structure, accountability, collaborator model, operating principles, availability, Founder bridge | No full process sequence, service catalogue, project cards, or full Founder biography |
| Founder | Samuel's narrative, professional history, education, grouped capabilities, identity links, and evidence bridge | No service sales detail, Studio operating-model panel, or duplicated Projects index |
| Services | What FURLANICH can do, fit, boundaries, dependencies, and service-specific evidence status | No résumé or second four-step process |
| Projects | What evidence exists and what each item's maturity and limitations are | No professional-history timeline |
| Contact | How to start an inquiry and the available direct channels | No repeated Studio narrative; only one subdued Founder-context link where Samuel's personal review is explained |

Studio's four principles are criteria, not steps. Homepage Process remains the sequence. Services retains the broader six-principle and commercial-boundary treatment. Shared ideas may remain consistent, but their copy and purpose are not repeated verbatim.

## Implementation-readiness matrix

| Area | ES copy | EN copy | Design | Evidence/facts | Ready |
| --- | --- | --- | --- | --- | --- |
| Studio intro | READY | READY | READY | READY | READY |
| Accountability | READY | READY | READY | READY | READY |
| Collaborator model | READY | READY | READY | READY | READY |
| Principles | READY | READY | READY | READY | READY |
| Location | READY | READY | READY | READY | READY |
| Founder bridge | READY | READY | READY | READY | READY |
| Studio CTA | READY | READY | READY | READY | READY |
| Founder header | READY | READY | READY | READY | READY |
| Experience | READY | READY | READY | READY | READY |
| Education | READY | READY | READY | READY | READY |
| Capabilities | READY | READY | READY | READY | READY |
| Projects bridge | READY | READY | READY | READY | READY |
| CV / links | READY | READY | READY | READY with mandatory integration recheck | READY |
| Founder CTA | READY | READY | READY | READY | READY |

Portrait photography is **DEFERRED** and does not block any row. CV content refresh/redesign is **DEFERRED**; technical asset/link preservation and verification remain implementation requirements.

## Architecture and implementation boundary

This decision closure fits the accepted static localized App Router architecture:

- route-owned Spanish and English content;
- shared locale-agnostic semantic components;
- explicit equivalent route pairs;
- static export, trailing slashes, and optional GitHub Pages base path;
- existing design primitives and dependencies.

No RFC or new ADR is required. Implementation is substantial and must use a versioned execution plan under ADR-STATIC-LOCALIZED-ROUTING. Reclassify only if planning proposes a CMS, runtime localization, new routing/hosting model, new design-system architecture, or another consequential boundary not approved here.

## Completion acceptance criteria

- Each route has exactly one H1 and the approved section order.
- Both locales use the exact approved copy above.
- Studio navigation points to Studio, while Founder remains reachable through the approved professional contexts.
- Studio contains no invented metrics, team scale, client claims, stock team imagery, or duplicated résumé content.
- Founder preserves the approved biography, two source-backed experience entries, factual education, grouped capabilities, one Projects bridge, CV, LinkedIn, GitHub, and a final Contact bridge.
- No portrait placeholder or generated portrait is introduced.
- The page-specific visual, responsive, accessibility, and motion rules in DESIGN-VISUAL and DESIGN-IX-A11Y are satisfied.
- CV download and professional destinations are reverified in normal and /Portfolio modes before integration.
- No application implementation changes are part of this decision-closure task.
