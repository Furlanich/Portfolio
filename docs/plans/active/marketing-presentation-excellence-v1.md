---
id: PLAN-MARKETING-PRESENTATION-EXCELLENCE
type: execution-plan
status: APPROVED
plan_status: ACTIVE
related:
  - REVIEW-MARKETING-DECISIONS
  - REVIEW-MARKETING-PRESENTATION
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - ADR-STATIC-LOCALIZED-ROUTING
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PROJECT-EVIDENCE
  - IA-SITE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - TEST-STRATEGY
last_verified: 2026-09-19
---

# FURLANICH — Marketing & Presentation Excellence, v1

## Objetivo, clasificación y autoridad

Ejecutar las correcciones de marketing y presentación aceptadas dentro de la arquitectura estática localizada. **Route B: plan de ejecución versionado**, conforme al [ciclo de ingeniería](../../governance/engineering-lifecycle.md). No requiere nuevo RFC ni ADR. Este es el único plan de la iniciativa; no crear otro en Superpowers.

Autorización: instrucción expresa del propietario del 2026-09-17 para preparar este plan APPROVED/ACTIVE y su PR documental. El [registro de decisiones y propietarios](../../reviews/marketing-decision-closure-2026-09-15/index.md#decision-register), con [disposición humana del 2026-09-16](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/reviews/marketing-decision-closure-2026-09-15/index.md#human-disposition-record--2026-09-16), es el punto de partida. Implementar D01, D02, D04, D05, D06 y solo las partes aplicables de D07. El [RFC de marketing](../../rfcs/marketing-narrative-closure.md) conserva status PROPOSED y aceptación parcial; **D03 permanece REJECTED**.

Arquitectura: Next.js App Router, React, TypeScript y Tailwind existentes; rutas ES raíz / EN bajo `/en/`, contenido localizado propietario, componentes servidor y export estático. Preservar los ADR de [routing](../../decisions/static-localized-routing.md), [Contact demo](../../decisions/contact-inquiry-demonstration-mode.md) y [pipeline comercial dormido](../../decisions/contact-inquiry-pipeline.md). No cambiar rutas, slugs, localización ni `submitInquiry()`.

Baseline verificado: `git fetch origin main` y `git rev-parse main origin/main` confirmaron `7062bda4773b1b6dc42b89886f10238e728311fe`; árbol limpio. Rama de planificación `codex/marketing-presentation-plan-v1`, creada desde `origin/main`. Cada PR de implementación será bilingüe, revisable por separado y creado desde el `main` vigente **después del merge humano de su predecesor**. El único siguiente PR de implementación es **PR 1 — Navegación y footer predecibles**. Este PR documental no implementa producto ni hace merge.

## Límites y dependencias reconciliadas

Avisos globales en tablas, motivos de copy, outlines, HTML o capturas R1 son dependencias del candidato D03 rechazado, no autorización. Se conservan como historia. No implementar aviso global, sustitución de helpers/feedback de Contact, eliminación de su bloque de respuesta, VIS-R1.7 ni filas IX-R1 dependientes de D03. Sí aplicar sustituciones expresamente aprobadas por Home, Services, Projects y Studio/Founder. VIS-R1.1 aplica padding, no aviso; VIS-R1.8 aplica agrupación/footer y cierres con copy de cada propietario. D06-LANGUAGE no permite reescribir Contact, Privacy, CV ni términos comerciales literales.

Contact conserva cuatro campos, simulación local, estados, helpers, feedback y cero transmisión: sin solicitudes, almacenamiento, analytics, logging de valores, correo ni activación Formspree. Canales externos solo por acción expresa del visitante, sin transportar valores del formulario. Preservar error/reintento, foco/anuncios, prevención de duplicados, valores en error y reset solo después de éxito simulado.

| Hallazgos | Tratamiento obligatorio y estado admisible al cierre |
| --- | --- |
| MKT-POS-002, MKT-CONTACT-001, MKT-CONTACT-002, MKT-CONTACT-003 | Pendientes por decisión: D03 rechazado; no declarar resolución. |
| MKT-PROOF-003 | PR 2 aplica encuadre editorial; ejecución actual y nuevas pruebas funcionales de los proyectos fuente siguen pendientes. |
| MKT-TRUST-001 | Carencias de evidencia visibles; nueva demostración autorizada fuera del alcance. |
| MKT-VIS-002 | Motivo 2D, retrato y nueva media OPEN; ningún asset inventado. |
| MKT-CONV-001 | Contexto transportado a Contact diferido; sin parámetros, campos ni persistencia nuevos. |
| MKT-VIS-004 | Solo agrupación, espaciado y alineación aprobados; efectos futuros diferidos. |

Sin fuentes, imágenes, librerías ni movimiento nuevos; tampoco Three.js, React Three Fiber, WebGL, shaders, física, pipelines 3D o escenas ligadas al scroll. [FUTURE-IMMERSIVE-DESIGN](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/reviews/marketing-presentation-2026-09-15/index.md#future-immersive-design--deferred) permanece diferido, sin promover propuestas. No ampliar legal, SEO, release, hosting, permisos, pagos, clientes, métricas ni resultados.

## Registro de copy propietario

Cada tarea consume las columnas ES/EN exactas de las filas indicadas en su revisión R1 aceptada. Los nombres de fila son identificadores, no texto para renderizar. No crear paráfrasis ni una segunda fuente de copy. El texto no sustituido se conserva desde los apartados baseline enlazados. Si hace falta texto nuevo, registrar desviación y resolverla en su propietario. Los permalinks fijan el apartado exacto del baseline 7062bda; comprobar también su propietario vigente al iniciar cada PR. Las anclas GitHub de títulos con raya larga se enlazan por permalink porque el validador local normaliza esos títulos de otra forma; no se modifica el validador.

| Clave | Propietario, revisión y filas exactas | Baseline que se conserva |
| --- | --- | --- |
| C-NAV | [D06-IA R1, Accepted navigation](../../product/information-architecture.md#accepted-navigation): Brand, Service navigation, Evidence navigation, Process navigation, Studio navigation, Primary action, Language. [D02 R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/home.md#mkt-d02--hero-and-actions--approved-revision-1): Primary. [Footer D06](../../product/information-architecture.md#accepted-footer-treatment): grupos, valores y copyright con año de build. | Labels externos de [Contact ES](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/contact-and-privacy.md#spanish-demonstration-contact-copy--approved) / [EN](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/contact-and-privacy.md#english-demonstration-contact-copy--approved), no candidatos D03. URLs de canales, Founder, Privacy y profesionales; labels no reemplazados. |
| C-HERO | [D01 R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/vision-and-positioning.md#mkt-d01--durable-category-and-buying-problem--approved-revision-1), [audiencia D01](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/audiences-and-services.md#mkt-d01-audience-emphasis--approved-revision-1); [D02 R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/home.md#mkt-d02--hero-and-actions--approved-revision-1): Eyebrow, H1, Support, Primary, Secondary, Accountability, Availability, completas. | Identidad y destinos; Availability no implica historial internacional. H1 exacto se toma de esa fila, no se redefine aquí. |
| C-HOME | [D05-HOME R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/home.md#mkt-d05-home--consolidated-narrative--approved-revision-1): Problems introduction; New merged audience sentence; Problems rows; Services intro; Proof heading; Proof commitments; Proof secondary link; Process opening and step descriptions; Founder long biography bridge; Final conditional inquiry/response paragraph. | Tres labels/resúmenes de [HOME-SERVICES ES](../../product/pages/home.md#home-services) / [EN](../../product/pages/home.md#home-services-approved-english-adaptation); cuatro pasos y fragmentos de [HOME-PROCESS](../../product/pages/home.md#home-process), con descripciones R1. Acciones no sustituidas conservan label/destino. |
| C-PROJECTS | [PAGE-PROJECTS D04 R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/projects.md#mkt-d04--projects-narrative-and-detail-outline--approved-revision-1): Intro; Evidence action; Index disclosure; GRS and Lab final Contact invitation; Detail final copy. [PROJECT-EVIDENCE D04](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/project-evidence.md#mkt-d04--homepage-bridge-and-selection-boundary--approved-revision-1), [inventario R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/projects/index.md#mkt-d04--evidence-placement--approved-revision-1) y [experience R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/projects/experience.md#mkt-d04-experience-delta--approved-revision-1) gobiernan ubicación/grupos. | Nombres propios, madurez, headings y acciones no reemplazadas. Home sin nombres/cards/media de proyectos. |
| C-ITEMS | [GRS R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/projects/general-reservation-system.md#mkt-d04-grs--editorial-candidate--approved-revision-1), [Lab R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/projects/the-system.md#mkt-d04-lab--editorial-candidate--approved-revision-1), [MPC R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/projects/mpc-administracion.md#mkt-d04-mpc--editorial-candidate--approved-revision-1): Card/detail summary, Relationship scattered across copy, Detail limitations repeated across bands de cada ítem. Teaser MPC usa summary y relationship. | En cada propietario: Approved bilingual public card (limitación concisa incluida), Approved bilingual detail content for PR 3 (campos no reemplazados y Publication scope), Approved conceptual visual asset (asset/caption/alt exactos), URLs y restricciones de resultados. `limited` interno nunca sustituye Publication scope. |
| C-SERVICES | [D05-SERVICES R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/services.md#mkt-d05-services--buyer-scan-layer--approved-revision-1), tabla [Accepted replacement scan copy](../../product/pages/services.md#accepted-replacement-scan-copy): todas las filas Page H1, Intro, Web heading/lead/deliverable examples/starting point/fit/evidence/evidence link; WhatsApp heading/lead/levels/starting point-fit/evidence; Consulting heading/lead/work examples/starting point-fit/evidence; Each service action; Final CTA. [Essential visible boundaries](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/services.md#essential-visible-boundaries--accepted-compressed-copy): Web, WhatsApp, Consulting, Shared working agreement, AI / ERP. | Bloque completo y literal Límites comerciales de [Spanish cross-service principles and commercial boundaries](../../product/pages/services.md#spanish-cross-service-principles-and-commercial-boundaries) y Commercial boundaries de [English cross-service principles and commercial boundaries](../../product/pages/services.md#english-cross-service-principles-and-commercial-boundaries), sin modernizar su ortografía. Restricciones de [AUDIENCES-SERVICES](../../product/audiences-and-services.md). |
| C-STUDIO | [D06-STUDIO-FOUNDER R1, Studio](../../product/pages/studio-and-founder.md#accepted-studio-outline-and-changed-copy): Intro, Accountability, Collaborators, Location, Founder bridge, Founder link, Closing inquiry/response promise. | Cuatro principios de [STUDIO-PRINCIPLES ES](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#studio-principles-spanish--approved) / [EN](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#studio-principles-english--approved). Sin nueva plantilla permanente, oficinas o aval de empleador. |
| C-FOUNDER | [D06-STUDIO-FOUNDER R1, Founder](../../product/pages/studio-and-founder.md#accepted-founder-outline-and-changed-copy): Opening, Capability lead, Projects bridge, Projects action, Final commercial invitation; C-ITEMS para MPC; [D06-LANGUAGE R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/content-and-localization.md#mkt-d06-language--editorial-conventions--approved-revision-1). | [Biografía ES/EN](../../product/pages/studio-and-founder.md#approved-detailed-biography), [hechos](../../product/pages/studio-and-founder.md#approved-founder-facts), [experiencia ES](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#founder-experience-spanish--approved) / [EN](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#founder-experience-english--approved), [educación](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#founder-education--approved), [capacidades ES](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#founder-capabilities-spanish--approved) / [EN](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#founder-capabilities-english--approved), [CV y URLs](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/product/pages/studio-and-founder.md#founder-professional-links--approved). Fechas, instituciones, estudios y empleo narrativo completos, sin añadir empleo al timeline por inferencia. |

Contrastar destinos con [D06-IA, Complete accepted CTA destination contract](../../product/information-architecture.md#complete-accepted-cta-destination-contract), excluyendo Global notice explanation y dependencias D03. Primary action y Process navigation son labels literales, no invitaciones particulares de página ni WhatsApp.

## Contrato común de ejecución

Leer este plan junto a sus propietarios. Aplicar `superpowers:executing-plans` sobre este único documento al ejecutar. En cada PR público aplicar [frontend-implementation](../../../.agents/skills/frontend-implementation/SKILL.md), [test-driven-development](../../../.agents/skills/test-driven-development/SKILL.md), [playwright-qa](../../../.agents/skills/playwright-qa/SKILL.md), [design-taste-frontend-v1](../../../.agents/skills/design-taste-frontend-v1/SKILL.md) y [visual-qa](../../../.agents/skills/visual-qa/SKILL.md). Ante defectos: [systematic-debugging](../../../.agents/skills/systematic-debugging/SKILL.md). Antes de afirmar cierre: [verification-before-completion](../../../.agents/skills/verification-before-completion/SKILL.md); terminar cada PR con [pr-readiness](../../../.agents/skills/pr-readiness/SKILL.md). Sincronizar propietarios con [project-knowledge-maintenance](../../../.agents/skills/project-knowledge-maintenance/SKILL.md). Leer las guías Next.js pertinentes en `node_modules/next/dist/docs/` antes de escribir código.

Cada tarea: test de comportamiento → ejecutar y observar RED pertinente → implementación mínima → ejecutar GREEN → refactorizar/verificar → QA visual/manual → gates completos → diff/commit enfocado → PR humano. Los detalles puramente visuales usan specs/render real, sin assertions de clases Tailwind. No debilitar restricciones para pasar pruebas.

Interfaces permitidas: view models locales, selección editorial, campos diferenciados permiso/prosa, IDs semánticos y props del chrome. Servidor por defecto; JS nuevo solo en mejora pequeña del disclosure. Preservar manifiesto fail-closed, equivalencias y contenido completo sin JS. Revalidar los archivos listados desde el nuevo main de cada PR; no son permiso para reestructurar áreas ajenas.

## T0 — PR de planificación y sincronización factual

**Hallazgo:** MKT-DOC-001. **Dependencias:** autorización, R1 y main remoto verificado. **Copy/visual:** sin cambio público; C-NAV a C-FOUNDER preparan las tareas futuras.

- [x] Verificar remoto/árbol y crear rama desde main vigente.
- [x] Reproducir fallo docs:check; corregir solo description TypeSafe a YAML de una línea iniciada en Use when. Commit separado `b29040e`; cuerpo, licencia y procedencia conservados.
- [x] Crear este plan y enlaces desde DOCS-INDEX, PLAN-INDEX, GOV-STATUS; reconciliar referencias RFC/review sin cambiar disposiciones.
- [x] Sincronizar MKT-DOC-001 en `ARCHITECTURE.md`, `docs/architecture/current-system.md`, `docs/product/audiences-and-services.md`, `docs/product/information-architecture.md`: Studio implementado, detalles/visuales conceptuales autorizados, Founder-as-Studio histórico. Preservar historia/aprobaciones.
- [x] Aclarar D03 en índice y layouts del review R1 sin editar capturas históricas.
- [x] Ejecutar `npm run validate`, `npm run skills:check`, `npm run verify:static-export` del build generado y `git diff --check`; revisar diff completo, solo docs y metadatos TypeSafe.
- [x] Abrir PR hacia main: `docs: plan approved marketing and presentation corrections`; Route B, decisiones, D03 preservado, pendientes, PR 1 único siguiente paso. No merge.

**Aceptación:** enlaces/IDs válidos, un plan ACTIVE, RFC PROPOSED, ADR/Skills protegidas intactos; sin aplicación/config/validador/assets. MKT-DOC-001 se contrasta otra vez en T6.

## T1 — PR 1: Navegación y footer predecibles

**Hallazgos:** MKT-NAV-001, MKT-NAV-002, MKT-NAV-003, MKT-FOOTER-001; consistencia compartida MKT-COPY-001, MKT-COPY-002, MKT-VIS-004.

**Dependencia:** merge humano T0. **Autoridad/copy:** C-NAV, IA-SITE/D06-IA, PAGE-HOME/D02; [DESIGN-VISUAL R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/design/visual-language.md#mkt-d07-vis-r1--restrained-marketing-composition--approved), VIS-R1.8; [DESIGN-IX-A11Y R1](https://github.com/Furlanich/Portfolio/blob/7062bda4773b1b6dc42b89886f10238e728311fe/docs/design/interaction-responsive-accessibility.md#mkt-d07-ix-r1--marketing-navigation-and-demo-interactions--approved), filas Mobile disclosure selection, Escape in open menu, Native fallback, Fragment offsets, Language switch. C-NAV identifica texto exacto y retenido.

**Archivos:** `components/foundation/SiteHeader.tsx`, `SiteFooter.tsx`, `LanguageSwitch.tsx`, `content-types.ts`; nueva `components/foundation/NavigationDisclosure.tsx` para eventos si corresponde; `lib/foundation-navigation.ts`; consumidores header/footer bajo `app/(es)/`, `app/(en)/` y `components/projects/ProjectDetailPage.tsx`; `app/globals.css` para offset si hace falta. Tests: `scripts/site-header.test.mjs`, `foundation-content.test.mjs`, `site-routes.test.mjs`, `verify-static-export.mjs`; nueva `tests/e2e/marketing-navigation.spec.ts` registrada en `playwright.config.ts`; acotar selectores de idioma existentes a header/footer.

- [x] RED: label/destino Contact en veinte rutas, cuatro asuntos de navegación y CTA único sin Contact duplicado en header; footer con equivalencia en seis detalles. Fallo pertinente, no selector ambiguo.
- [x] GREEN: desacoplar label de `contactContent.actions[0]` e invitaciones locales; prop C-NAV estable. Header servidor, frontera cliente pequeña, sin modal.
- [x] RED → GREEN: selección cierra menú; Process de la misma página enfoca heading visible bajo header; Escape devuelve foco al trigger, cerrado no hace nada. Cubrir click/touch/Enter, otras rutas, reduced motion, no-JS.
- [x] Footer con dos grupos compactos y fila idioma/copyright con año de build, valores email/teléfono legibles, orden WhatsApp → email → teléfono. Retirar solo Contact duplicado del header, conservar enlace footer.
- [x] Refactor verde, matriz/gates, bytes JS incremental, evidencia/diff y PR.

**Visual/aceptación:** label/destino coherentes en veinte rutas; sin overflow a 1024 ni letra reducida; targets conservados, footer envuelve en ambos idiomas, anclas visibles tras asentarse scroll, sin focus trap/foco oculto. Sin JS, `<details>` y links siguen útiles; no exigir cierre mejorado al fallback. Focal: `node --test scripts/site-header.test.mjs scripts/foundation-content.test.mjs scripts/site-routes.test.mjs`; `npx playwright test tests/e2e/marketing-navigation.spec.ts --project=chromium-desktop`, luego motores/perfiles de la matriz.

## T2 — PR 2: Evidencia seleccionada y acceso educativo a MPC

**Hallazgos:** MKT-PROOF-001, MKT-PROOF-002, MKT-PROOF-003, MKT-PROOF-004, MKT-PROOF-005, MKT-VIS-003; partes de MKT-VIS-001, MKT-VIS-004, MKT-COPY-001, MKT-COPY-002.

**Dependencia:** merge humano T1. **Autoridad/copy:** C-PROJECTS/C-ITEMS; PAGE-PROJECTS, PAGE-PROJECT-DETAIL, PROJECT-EVIDENCE, PROJECT-INVENTORY, PROJECTS-EXPERIENCE-CLOSURE; D06 educación; DESIGN-VISUAL VIS-R1.3/R1.5, DESIGN-IX-A11Y links/equivalencias. No adelantar resto de T5.

**Archivos:** `components/projects/{ProjectsPage,ProjectCard,ProjectDetailPage}.tsx`, `content-types.ts`, `lib/projects/publication.ts`, ambos `_content/projects.ts` y `_content/founder.ts`; `components/founder/FounderProfessionalHistory.tsx`, `content-types.ts`; rutas detalle existentes. Tests: `scripts/projects-publication.test.mjs`, `project-details.test.mjs`, `projects-route.test.mjs`, `verify-static-export.mjs`; nueva `tests/e2e/marketing-projects.spec.ts`, ampliar `accessibility.spec.ts` y perfiles.

- [x] RED: índice selecciona GRS/Lab, pero conserva tres registros públicos y seis detalles/equivalencias, MPC alcanzable desde educación; permisos fail-closed.
- [x] RED: `getPublishedProjectDetail(content, slug, locale)` conserva Publication scope localizado. El spread actual finaliza con `publicationScope: entry.publicationScope` y sobrescribe prosa con enum.
- [x] GREEN: separar campo interno de permiso del texto en `ResolvedProjectDetail` y renderer, preservando firma/validación; selección editorial independiente de `publishedProjectManifest`. Test de párrafo completo ES/EN y ausencia de `limited` como prosa.
- [x] Aplicar C-PROJECTS/C-ITEMS; GRS principal, Lab secundario/RPG visible. Añadir teaser MPC en el mismo PR que retira su card del índice; conservar año, grupo, fábrica ficticia y no autoría exclusiva; MPC nunca PRIVATE/RETIRED para ocultarlo.
- [x] Agrupar detalles en contexto, alcance, evidencia/limitaciones, siguientes destinos. Conservar captions/alt/media conceptual. MPC vuelve a Founder, relación interna Web solo procedencia, sin puente comercial renderizado.
- [x] GREEN/refactor, QA/gates/diff; MKT-PROOF-003 parcialmente resuelto, sin atribuir runtime verification a los repositorios fuente.

**Visual/aceptación:** GRS aproximadamente 7/12–5/12 en ancho; Lab fila compacta; mobile apilado. Limitaciones junto a claims y limitación concisa junto al teaser. Seis detalles/equivalencias intactos; sin imágenes en Home/índice ni nuevos claims de ejecución/clientes/pagos/resultados. Focal: `node --test scripts/projects-publication.test.mjs scripts/project-details.test.mjs scripts/projects-route.test.mjs`; `npx playwright test tests/e2e/marketing-projects.spec.ts --project=chromium-desktop`, luego matriz.

## T3 — PR 3: Posicionamiento y primera impresión de Home

**Hallazgos:** MKT-POS-001, MKT-HOME-001, MKT-HOME-002, MKT-HOME-003, MKT-CONV-002; partes de MKT-STUDIO-002, MKT-VIS-001, MKT-VIS-004, MKT-COPY-001, MKT-COPY-002.

**Dependencia:** merge humano T2. **Autoridad/copy:** C-HERO/C-HOME, D01/D02/D05-HOME/D04; PAGE-HOME, BRAND-POSITIONING, AUDIENCES-SERVICES, PROJECT-EVIDENCE; DESIGN-VISUAL VIS-R1.1/R1.2/R1.3 y cierre aplicable R1.8; DESIGN-IX-A11Y Process. H1 literal desde fila H1 D02.

**Archivos:** ambos `_content/home.ts`, `components/foundation/HomeHero.tsx`, `components/homepage/{CommercialHomepage,HomeProblems,HomeServices,HomeProof,HomeProcess,HomeFounder,HomeCta}.tsx`, `content-types.ts`; se retiró `HomeAudiences.tsx` después de probar ausencia de consumidores. Tests: `scripts/homepage-content.test.mjs`, `foundation-content.test.mjs`, `verify-static-export.mjs`; `tests/e2e/smoke.spec.ts`, `responsive.spec.ts`, `accessibility.spec.ts` y perfiles.

- [x] RED: siete roles narrativos, hero D02 completo, audiencia integrada, único puente genérico a Projects desde proof; sin nombres/cards/media de proyectos; tres resúmenes de servicio y cuatro pasos/fragmentos conservados.
- [x] GREEN: todas las filas C-HERO/C-HOME bilingües; retirar sección independiente Audiences y simplificar puente Founder. Cierre demo solo desde PAGE-HOME.
- [x] Hero padding 48/64/96px; tres situaciones sin cards; servicios como comparación; proof sin panel. Cierre corto a izquierda, sin aviso global.
- [x] GREEN/refactor, recorridos Services/Projects/Founder/Contact, QA visual/manual, gates, evidencia y PR.

**Visual/aceptación:** siete secciones incluyendo hero con roles distintos; oferta/problema prioritario comprensibles; wrapping natural ES/EN sin saltos manuales ni reducción tipográfica. No inventar imagen para llenar espacio. Focal: `node --test scripts/homepage-content.test.mjs scripts/foundation-content.test.mjs`; `npx playwright test tests/e2e/smoke.spec.ts tests/e2e/responsive.spec.ts --project=chromium-desktop --project=mobile-chromium`, completando cinco tamaños efectivos/matriz.

## T4 — PR 4: Services orientado a la evaluación del comprador

**Hallazgos:** MKT-SVC-001, MKT-SVC-002, MKT-SVC-003, MKT-SVC-004; partes de MKT-VIS-001, MKT-VIS-004, MKT-COPY-001, MKT-COPY-002.

**Dependencia:** merge humano T3. **Autoridad/copy:** C-SERVICES completo; PAGE-SERVICES/D05-SERVICES, AUDIENCES-SERVICES, D04, DESIGN-VISUAL VIS-R1.4/R1.3, DESIGN-IX-A11Y fragmentos. Todas las filas de ambas tablas y bloque comercial retenido obligatorios.

**Archivos:** ambos `_content/services.ts`, `components/services/{ServicesPage,ServicesIntroduction,ServiceSection,ServicesPrinciples,ServicesFinalCta}.tsx`, `content-types.ts`; `lib/site-routes.ts` solo si necesita modelar fragmentos adicionales. Tests: `scripts/services-content.test.mjs`, `services-route.test.mjs`, `verify-static-export.mjs`; nueva `tests/e2e/marketing-services.spec.ts`, axe y perfiles.

- [x] RED observado: los contratos y componentes pre-D05 fallaron por H1/copy/shape, tarjetas de niveles, principios en cards y response promise; el RED focal fue reproducible.
- [x] GREEN: copy propietario; principios/condiciones consolidados sin accordions ni paquetes; distinción diagnóstico/mejoras/soporte; ausencia pública de evidencia WhatsApp/mantenimiento.
- [x] RED → GREEN: enlace textual GRS y anchors localizados #condiciones / #working-boundaries; se conservaron #web, #whatsapp, #consultoria / #consulting; headings visibles, destinos correctos, sin contexto transportado a Contact.
- [x] Refactor, escaneo ES/EN, límites completos, gates/evidencia/diff completados en el commit de implementación. Objetivo 900–1200 palabras orientativo; jamás se recortaron restricciones para cumplirlo.

**Visual/aceptación:** tipos de trabajo en listas, límites visibles y un bloque compartido completo; acciones escaneables, sin promesas de resultados/precios/plazos/evaluación gratuita. Focal: `node --test scripts/services-content.test.mjs scripts/services-route.test.mjs`; `npx playwright test tests/e2e/marketing-services.spec.ts --project=chromium-desktop`, luego matriz.

## T5 — PR 5: Studio y Founder como respaldo profesional

**Hallazgos:** MKT-STUDIO-001, MKT-STUDIO-002, MKT-FOUNDER-001, MKT-FOUNDER-002, MKT-A11Y-001; partes de MKT-VIS-001, MKT-VIS-004, MKT-COPY-001, MKT-COPY-002.

**Dependencia:** merge humano T4; teaser MPC T2 conservado. **Autoridad/copy:** C-STUDIO/C-FOUNDER, PAGE-STUDIO/PAGE-FOUNDER/D06-STUDIO-FOUNDER, D06-LANGUAGE, D04-MPC; DESIGN-VISUAL VIS-R1.6, DESIGN-IX-A11Y Founder groups.

**Archivos:** ambos `_content/studio.ts` / `_content/founder.ts`; `components/studio/`, `components/founder/` (composición, tipos, apertura, biografía, experiencia, capacidades, links, cierres). `data/` como fuente factual a preservar; CV sin reescritura. Tests: `scripts/studio-content.test.mjs`, `scripts/foundation-content.test.mjs`, `verify-static-export.mjs`; `tests/e2e/studio-founder.spec.ts`, `studio-founder-responsive.spec.ts`, `accessibility.spec.ts`, visuales existentes y perfiles.

- [x] RED: inventario de hechos ES/EN, fechas, instituciones, estudios, empleo narrativo, biografía y destinos; orden/persistencia MPC. IDs únicos y referencias accesibles resueltas, independientes de títulos traducidos.
- [x] GREEN: Studio textual con responsabilidad/collaboradores, cuatro principios conservados, ubicación/puente combinados. Founder: apertura → experiencia → biografía completa en párrafos → educación/MPC → capacidades → links profesionales → Projects → cierre aprobado.
- [x] IDs semánticos estables para capacidades y referencias aria-labelledby al heading; labels/contenido preservados. CV/LinkedIn/GitHub secundarios, accesibles, mismos destinos.
- [x] GREEN/refactor, axe ES/EN con seguimiento de incomplete, teclado/revisión automatizada; CV/links en ambos base paths; QA visual automatizado, gates/evidencia/diff completados y PR pendiente de apertura.

**Visual/aceptación:** todos los hechos visibles sin disclosures, responsabilidad explicada una vez; CV menos prominente comercialmente y accesible. Disponibilidad internacional no implica clientes; sin retrato nuevo. Focal: `node --test scripts/studio-content.test.mjs`; `npx playwright test tests/e2e/studio-founder.spec.ts tests/e2e/studio-founder-responsive.spec.ts --project=chromium-desktop --project=compact-320-chromium --project=tablet-portrait-chromium`, completando motores/tamaños mediante testMatch actualizado.

## T6 — PR 6: Integración y auditoría final de marketing

**Hallazgos:** MKT-POS-001, MKT-POS-002, MKT-HOME-001, MKT-HOME-002, MKT-HOME-003, MKT-SVC-001, MKT-SVC-002, MKT-SVC-003, MKT-SVC-004, MKT-PROOF-001, MKT-PROOF-002, MKT-PROOF-003, MKT-PROOF-004, MKT-PROOF-005, MKT-STUDIO-001, MKT-STUDIO-002, MKT-FOUNDER-001, MKT-FOUNDER-002, MKT-CONTACT-001, MKT-CONTACT-002, MKT-CONTACT-003, MKT-NAV-001, MKT-NAV-002, MKT-NAV-003, MKT-VIS-001, MKT-VIS-002, MKT-VIS-003, MKT-VIS-004, MKT-TRUST-001, MKT-CONV-001, MKT-CONV-002, MKT-COPY-001, MKT-COPY-002, MKT-FOOTER-001, MKT-DOC-001, MKT-A11Y-001. Reconciliar con el [registro original](../../reviews/marketing-presentation-2026-09-15/findings.md), sin omisiones.

**Dependencia:** merge humano T5. **Autoridad/copy:** todos los propietarios C-NAV a C-FOUNDER y D03 baseline; ninguna nueva fuente. **Archivos:** este plan, índices/estado, propietarios factuales, nueva comparación `docs/reviews/marketing-presentation-excellence-v1/index.md`, pruebas afectadas. Cada ajuste final de producto debe identificar MKT completo y requisito ya aprobado.

- [ ] Auditar veinte rutas ES/EN contra informe original y propietarios actuales. Repuntuar posicionamiento, Home, Services, evidencia, Studio, Founder, Contact, navegación, calidad visual, confianza, conversión, mobile y copy ES/EN con razones observables.
- [ ] Conservar informe original; publicar comparación por hallazgo: resuelto, parcialmente resuelto, pendiente por decisión o diferido, enlazando PR/evidencia. Confirmar MKT-DOC-001 y pendientes de la tabla de límites.
- [ ] Matriz completa root y `/Portfolio` secuencial; repetir cero transmisión/estados Contact, CV, links profesionales, seis detalles y restricciones de evidencia. Ajustes finales solo desviaciones de requisitos aceptados, con RED/GREEN si cambia comportamiento.
- [ ] Registrar revisión visual/manual, resultados/limitaciones y diff; pr-readiness y revisión humana. No puntuación artificial ni perfección inferida de tests verdes; alcance aprobado puede completarse con pendientes Contact/evidencia explícitos.

**Visual/aceptación:** coherencia entre páginas, cierres y chrome; límites/evidencia legibles, sin contradicciones de copy/permisos. Comparación auditable de mejoras/pendientes. Tras aceptación humana final mover este mismo plan a completed con historia intacta, actualizar enlaces/plan_status; no crear otro plan.

## QA y rendimiento para cada implementación

[TEST-STRATEGY](../../testing/strategy.md), [TEST-PLAYWRIGHT](../../testing/playwright.md), [TEST-VISUAL-REGRESSION](../../testing/visual-regression.md) gobiernan las capas.

| Capa | Cobertura obligatoria |
| --- | --- |
| Chromium, Firefox, WebKit desktop | Rutas modificadas ES/EN, navegación, equivalencia, destinos y errores de navegador. Chrome compartido: veinte rutas. |
| Chromium responsive | 320×800, 390×844, 768×1024, 1024×768, 1440×900; páginas afectadas en ambos idiomas. |
| Mobile WebKit | Menú, navegación y reflow representativos; registrar viewport efectivo del perfil. |
| Axe | Páginas cambiadas ES/EN y detalles actualmente ausentes cuando corresponda; revisar incomplete además de violations. |
| Comparación visual | Chromium controlado, inspección antes/después; sin producto cartesiano motores × tamaños. |
| Manual | Teclado/foco/headings/referencias/targets, contraste y color independiente, 200% de texto, reflow, reduced motion, alternativas de imágenes. Axe no sustituye revisión manual. |

`playwright.config.ts` tiene testMatch explícitos: 320/768 hoy limitan cobertura a Studio/Founder, Privacy y Contact; Firefox/WebKit no incluyen toda suite Studio/Founder; detalles carecen de matriz completa. Registrar suites nuevas/ampliadas en cada perfil aplicable, verificar selección con `npx playwright test --list` y registrar rutas/engines/viewports efectivamente ejecutados. Al añadir idioma en footer acotar selectores por header/footer, evitando matches ambiguos.

Taste preflight: sitio actual, corrección aprobada y posicionamiento. Postflight sobre render real ES/EN: primer viewport, narrativa, transiciones, acciones, alineación, tipografía, whitespace, wrapping, orden mobile y consistencia. Registrar cards excesivas, jerarquía plana, simetría, repetición, espaciado y apariencia genérica. Mantener Inter, paleta, container 1200px, gutters 20/32/48px, escalas, targets y motion aprobados aunque Taste sugiera alternativas.

Rendimiento: antes/después registrar commit, Node, modo de build/base path, bytes HTML/CSS/JS y recursos cargados en builds comparables; no comparar dev con producción. T1 mide JS incremental del menú y comprueba contenido completo sin JS. No nuevas fuentes/imágenes/librerías/movimiento ni presupuesto global inventado mientras permanece OPEN.

### Gates y contextos

Después de pruebas focalizadas, cada implementación ejecuta con exit codes independientes:

```text
npm test
npm run test:e2e
npm run test:a11y
npm run docs:check
npm run skills:check
npm run lint
npm run typecheck
npm run build
npm run verify:static-export
git diff --check
```

Export y recorridos relevantes root y `/Portfolio`, secuenciales. En PowerShell establecer `$env:NEXT_PUBLIC_BASE_PATH = ''` para root y luego `$env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'` antes del build/tests del segundo contexto; restaurar valor previo al terminar. Playwright gestiona servidor: no duplicarlo ni reutilizar proceso de otro contexto. Usar modo CI cuando corresponda para forzar `reuseExistingServer: false`. No builds concurrentes sobre `.next`/`out`. T6 repite matriz completa en ambos contextos.

Veinte rutas: `/`, `/en/`, `/servicios/`, `/en/services/`, `/proyectos/`, `/en/work/`, `/estudio/`, `/en/about/`, `/estudio/samuel-furlanich/`, `/en/about/samuel-furlanich/`, `/contacto/`, `/en/contact/`, `/privacidad/`, `/en/privacy/`; pares `/proyectos/{slug}/` / `/en/work/{slug}/` para `general-reservation-system`, `the-system`, `mpc-administracion`. Revisar además recuperación not-found si chrome la afecta; no inventar rutas.

## Riesgos, evidencia y progreso

| Riesgo | Control |
| --- | --- |
| D03 reaparece al seguir bocetos | Contrastar límites; conservar Contact y copiar filas propietarias. |
| MPC pierde acceso o se confunde selección/permiso | Teaser/retiro atómicos; tres registros/seis detalles/equivalencias. |
| Prosa se pierde por enum o recorte | Campos diferenciados; párrafo completo; límites junto a claims. |
| Menú rompe fallback/anclas | Frontera cliente pequeña; no-JS; foco/scroll asentado; bytes JS. |
| Simplificación elimina condiciones/hechos | Preservación C-SERVICES/C-FOUNDER, comparación literal donde corresponde. |
| Matriz nominal oculta suites sin ejecutar | testMatch/--list y registro de rutas/tamaños; jamás PASS para navegador no ejecutado. |
| Tests verdes se confunden con resultado comercial/runtime fuente | Evidencia funcional, juicio visual y marketing separados; pendientes explícitos. |

Completar para cada tarea en este mismo plan: PR/commit/base, archivos, MKT y propietario/fila, comandos/exit codes, RED esperado/observado y GREEN, rutas/engines/viewports/idioma/base path, revisión visual/manual con evidencia existente, bytes/recursos comparables, advertencias, desviaciones/estado final. Capturas ordinarias, trazas/reportes fuera de Git; solo baselines intencionales revisados y aprobados se versionan.

| Tarea | Estado inicial | Dependencia / evidencia |
| --- | --- | --- |
| T0 | PR listo para revisión humana | [PR #54](https://github.com/Furlanich/Portfolio/pull/54), base main 7062bda, TypeSafe `b29040e`, plan/sincronización `1351961`; sin merge. |
| T1 | Completada en PR #55 | PR #55 mergeado en `4d0280b`; navegación/footer y sus pruebas quedaron en `7dee240`. |
| T2 | Completada en PR #55 | PR #55 mergeado en `4d0280b`; evidencia/proyectos y sus pruebas quedaron en `7dee240`. |
| T3 | Completada en PR #56 | PR #56 mergeado en `667ca419`; Home bilingüe y pruebas/gates ejecutados. |
| T4 | Completada en PR #57 | PR #57 mergeado en `a45a213`; implementación `b998cdc`, base `667ca419`; Services buyer-evaluation, pruebas/gates ejecutados y registro detallado abajo. |
| T5 | Implementada; PR pendiente de apertura | `ba2a06a`, rama `codex/marketing-presentation-pr5-studio-founder`, base `a45a213`; Studio/Founder bilingüe, pruebas/gates ejecutados y registro detallado abajo. |
| T6 | No iniciada | Merge humano T5; pendientes explícitos al cierre. |

### Ejecución T4 y estado de T1/T2/T3

T4 se implementó en b998cdcd672b4ab734f70e9b72964257dad68eef (feat(marketing): simplify services buyer evaluation), rama codex/marketing-presentation-pr4-services, base 667ca419d67d1e6768672631b378d8c3bdc09168 (main posterior al merge humano de PR #56). Archivos: ambos contenidos Services, tipos y composición Services, contrato de export estático, contrato foundation sincronizado, nueva suite E2E de Services y ampliación de perfiles Playwright. El modelo comprador quedó en lead → tipos de trabajo → punto de partida → buen encaje → límites → evidencia → acción; se eliminó el modelo de paquetes/cards y la promesa de respuesta. Se añadieron el enlace textual al detalle GRS y los anchors localizados condiciones/working-boundaries.

PR #57 se abrió contra main en el commit c98a43666d7adac504fcf9214113577a83f1c154, con base 667ca419d67d1e6768672631b378d8c3bdc09168. Queda abierto para revisión humana; no se hace merge autónomo.

El RED focal observado fue node --test scripts/services-content.test.mjs scripts/services-route.test.mjs con exit 1: el contrato pre-D05 mantenía seis principios, H1/copy anteriores, grupos narrativos, cards y responseStatement. El GREEN posterior pasó con exit 0; tras el ajuste de anchors, el focal ampliado pasó con exit 0 en 11 pruebas. La validación ejecutada quedó así:

| Comando / contexto | Resultado observado |
| --- | --- |
| npm test | Exit 0: 107 pruebas. |
| npm run lint | Exit 0. |
| npm run typecheck | Exit 0. |
| npm run build | Exit 0: 22 páginas estáticas. |
| npm run verify:static-export | Exit 0: 20 rutas, base root. |
| npm run test:e2e | Exit 0: 561 passed, 80 skipped; matriz completa configurada. |
| npm run test:a11y | Exit 0: 16 pruebas. |
| npm run docs:check | Exit 0: 92 Markdown, 74 IDs, 11 Skills. |
| npm run skills:check | Exit 0: 4 Skills, 8 archivos íntegros. |
| git diff --check | Exit 0; solo advertencias normales de LF/CRLF. |
| focused Services Chromium | Exit 0: 4 pruebas bilingües, anchors, destinos, overflow y errores de navegador. |
| Services browser/profile matrix | Exit 0: 32 pruebas en Chromium, Firefox, WebKit, mobile, tablet, wide, compact 320 y portrait 768. |

Rutas y comportamiento: Services ES /servicios/ y EN /en/services/, anchors web/whatsapp/consultoria y web/whatsapp/consulting, Contact contextual y evidencia GRS en su detalle localizado. Se mantuvieron restricciones completas de Web, WhatsApp, Consulting, acuerdo compartido, límites comerciales y AI/ERP; no se añadieron rutas, dependencias, requests, campos ni paquetes.

QA visual/manual: se capturó el render español completo mediante Playwright fuera de Git y las assertions de render, reflow, overflow, semántica y axe pasaron. La inspección visual manual no pudo completarse porque el helper de imagen y el kernel CUA fallaron con helper_unknown_error: setup refresh had errors. No se declara PASS manual para esa capa; la captura queda fuera de Git para revisión humana. Advertencias no bloqueantes: warnings existentes de NO_COLOR, Browserslist, LCP de imágenes de Projects y smooth-scroll; no se cambió configuración para silenciarlos.

T1 y T2 quedaron incorporadas en el PR humano #55, mergeado sobre 4d0280b desde 7dee240. T3 se implementó en fb3ef88 y el PR #56 se mergeó sobre el main que ahora fija 667ca419; no se reescribe la historia de esos PRs.

### Ejecución T5 y cierre de T4

T4 se considera satisfecha por el merge humano de PR #57 en `a45a213b51a68b42a6a4c11ac903f146256fd60d`, posterior a la base `667ca419`; no se reescribe su implementación `b998cdc`. T5 se implementó en `ba2a06a` (`feat(marketing): clarify studio and founder credibility`), rama `codex/marketing-presentation-pr5-studio-founder`, con base `a45a213b51a68b42a6a4c11ac903f146256fd60d`.

Archivos y alcance: contenido Studio ES/EN con responsabilidad técnica, colaboración condicionada, disponibilidad geográfica y puente Founder según D06; contenido Founder ES/EN con apertura breve, experiencia, biografía completa en párrafos, educación/MPC, cuatro grupos de capacidades, enlaces profesionales, Projects y CTA en el orden aprobado; composición Founder y ritmo de superficies sincronizados con VIS-R1.6; IDs literales estables (`management-systems`, `web-applications`, `automation-integrations`, `evolving-systems`) enlazados por `aria-labelledby`; contratos de contenido/export, suites Node/E2E responsive y baselines visuales actualizados. No se añadió retrato, dependencia, ruta, request, campo ni reescritura del CV.

El RED focal observado fue `node --test scripts/studio-content.test.mjs scripts/foundation-content.test.mjs` con exit 1: 6 pruebas pasaron y 3 fallaron por el opening Founder ausente y el copy Studio pre-D06 de responsabilidad. El GREEN posterior pasó con exit 0 y 9/9 pruebas. La sincronización de navegación se diagnosticó además bajo dos workers: los cambios a `page.waitForURL(...)` concurrente con el click corrigieron los dos fallos reproducibles del cambio de idioma en Contact y Studio.

| Comando / contexto | Resultado observado |
| --- | --- |
| `npm test` | Exit 0: 107 pruebas. |
| `npm run docs:check` | Exit 0: 92 Markdown, 74 IDs, 11 Skills. |
| `npm run skills:check` | Exit 0: 4 Skills, 8 archivos íntegros. |
| `npm run lint` | Exit 0. |
| `npm run typecheck` | Exit 0. |
| `npm run build` | Exit 0: 22 páginas estáticas, base root. |
| `npm run verify:static-export` | Exit 0: 20 rutas, base `/`. |
| `npm run test:a11y` | Exit 0: 16 pruebas axe/foco. |
| `npm run test:e2e` | Exit 0: 572 passed, 1 flaky Firefox Contact recuperada en retry, 80 skipped; la matriz completa incluye desktop Chromium/Firefox/WebKit, responsive, axe y visual. |
| Focal Studio/Founder Chromium + responsive | Exit 0: 36 pruebas root; 28 pruebas bajo `NEXT_PUBLIC_BASE_PATH=/Portfolio`. |
| Build/export `NEXT_PUBLIC_BASE_PATH=/Portfolio` | Exit 0: 22 páginas generadas; `verify:static-export` confirma 20 rutas y base `/Portfolio`. |
| `git diff --check` | Exit 0; solo advertencias normales de normalización LF/CRLF. |

Rutas y contextos: Studio `/estudio/` y `/en/about/`; Founder `/estudio/samuel-furlanich/` y `/en/about/samuel-furlanich/`; Contact/Projects usados para verificar destinos; root y `/Portfolio`; idiomas ES/EN; viewports 320×800, 390×844, 768×1024, 1024×768 y 1440×900 mediante los perfiles configurados. CV, LinkedIn y GitHub conservaron sus destinos y fueron verificados con ambos base paths.

QA visual: las seis capturas Playwright existentes de Studio/Founder se regeneraron para el navegador Windows local y el proyecto visual pasó. La inspección visual manual no pudo declararse PASS porque el helper de imagen/CUA falló con `helper_unknown_error: setup refresh had errors`; queda expresamente para revisión humana. El entorno local tampoco pudo iniciar el runtime Linux de Docker/WSL (virtualización deshabilitada), por lo que las baselines `-linux` no se regeneraron localmente; no se debilitaron assertions ni se copiaron baselines entre plataformas. Advertencias no bloqueantes: `NO_COLOR`/`FORCE_COLOR`, Browserslist desactualizado, hints LCP de imágenes existentes, `scroll-behavior: smooth`, `MODULE_TYPELESS_PACKAGE_JSON` y 8 vulnerabilidades del `npm ci`; no se modificaron para silenciarlas.

El plan permanece `ACTIVE`; PR5 queda pendiente de apertura y revisión humana. No se hace merge autónomo.

### Ejecución T1/T2 confirmada y handoff de T3

T1 y T2 quedaron incorporadas en el PR humano [#55](https://github.com/Furlanich/Portfolio/pull/55), mergeado sobre el main vigente en `4d0280b` desde `7dee240`. El PR cubrió navegación/footer y evidencia seleccionada/proyectos; por eso la dependencia de T3 se considera satisfecha. No se reescribe la historia de esos PRs.

T3 se implementó en `fb3ef88` (`feat(marketing): refine homepage positioning`), rama `codex/marketing-presentation-pr3-home`, base `4d0280b`, y se abrió el [PR #56](https://github.com/Furlanich/Portfolio/pull/56). Archivos: ambos contenidos Home, `HomeHero`, composición y secciones Home, tipos, pruebas de contenido/primitivas/export estático y smoke/responsive; `HomeAudiences.tsx` fue eliminado tras `rg` sin consumidores en `app/` ni `components/`. Hallazgos y autoridad: MKT-POS-001, MKT-HOME-001/002/003, MKT-CONV-002; partes MKT-STUDIO-002, MKT-VIS-001/004 y MKT-COPY-001/002; C-HERO/C-HOME, D01/D02/D05-HOME/D04, PAGE-HOME, R1.1/R1.2/R1.3/R1.8 y Process de accesibilidad.

El RED focal observado fue `node --test scripts/homepage-content.test.mjs` con exit 1 y dos fallos de headings anteriores; el GREEN posterior pasó con exit 0 y dos pruebas. La validación completa quedó así:

| Comando / contexto | Resultado observado |
| --- | --- |
| `npm test` | Exit 0: 107 pruebas. |
| `npm run lint` | Exit 0. |
| `npm run typecheck` | Exit 0. |
| `npm run build` | Exit 0: 22 páginas estáticas. |
| `npm run verify:static-export` | Exit 0: 20 rutas, base `/`. |
| `npm run test:e2e` | Exit 0: 525 passed, 80 skipped; matriz completa configurada, incluyendo Chromium/Firefox/WebKit, responsive y axe/visual existentes. |
| `npm run test:a11y` | Exit 0: 16 pruebas. |
| `npm run docs:check` | Exit 0: 92 Markdown, 74 IDs, 11 Skills. |
| `npm run skills:check` | Exit 0: 4 Skills, 8 archivos íntegros. |
| `git diff --check` | Exit 0. |
| `set NEXT_PUBLIC_BASE_PATH=/Portfolio && npm run build` | Exit 0: 22 páginas estáticas. |
| `set NEXT_PUBLIC_BASE_PATH=/Portfolio && npm run verify:static-export` | Exit 0: 20 rutas, base `/Portfolio`. |
| smoke/responsive focal | Exit 0: 18 pruebas en Chromium desktop y mobile Chromium. |

Rutas y comportamiento: Home ES `/` y EN `/en/`, recorridos visibles a Services, Projects, Founder y Contact, export root y `/Portfolio`; la suite E2E se ejecutó en su servidor root y cubrió los perfiles configurados. El render mantiene siete secciones con roles distintos, wrapping natural bilingüe, tres situaciones sin cards, servicios comparables, proof sin panel, puente único a Projects y cierre demo solo de Home. No se añadieron imágenes, fuentes, librerías, rutas, requests, campos ni destinos nuevos.

QA visual/manual: se capturaron renders ES/EN ancho y estrecho mediante Playwright fuera de Git y pasaron las capturas automatizadas existentes; la inspección visual manual no pudo completarse porque el helper de pantalla falló repetidamente con `helper_unknown_error: setup refresh had errors`. No se declara PASS manual para esa capa; la limitación queda abierta para revisión humana. No hubo desviaciones de copy: el proof commitment aprobado se expresa en el intro editorial D05, sin panel, conforme a VIS-R1.3/R1.8. Advertencias no bloqueantes: warnings existentes de `NO_COLOR`, LCP de imágenes de detalles y normalización LF/CRLF; no se cambió configuración para silenciarlos.

### Validación del PR de planificación

Baseline observado en Plan Mode: 99/99 Node, cuatro Skills/ocho archivos íntegros, docs:check fallando por TypeSafe. Es evidencia histórica, no ejecución de este plan. En esta ejecución se reprodujeron errores de description/front matter; tras corregir metadata, docs:check pasó (108 Markdown, 73 IDs, 11 Skills) y skills:check pasó (4 Skills, 8 archivos). El commit separado solo afecta description.

Validación ejecutada el 2026-09-17 en Windows, Node v24.14.0 / npm 11.9.0:

| Comando / revisión | Resultado |
| --- | --- |
| `npm run validate` | Exit 0: docs, 99/99 Node, lint, typecheck, build; 22 páginas generadas incluyendo artefactos framework. |
| `npm run skills:check` | Exit 0: 4 Skills protegidas / 8 archivos íntegros. |
| `npm run verify:static-export` | Exit 0: 20 rutas, base path `/`, sobre el build generado. |
| `npm run docs:check` después de corregir enlaces | Exit 0: 109 Markdown, 74 IDs, 11 Skills. |
| `npm run typecheck` después de restaurar next-env.d.ts | Exit 0; el import root-params generado por build se retiró para preservar alcance. |
| `git diff --check` | Exit 0. |
| Cobertura de hallazgos / TypeSafe | 35/35 IDs originales presentes; cuerpo TypeSafe comparado con origin/main e idéntico; licencia MIT y procedencia conservadas. |
| Diff / aceptación documental | PASS: un plan, índices/estado, sincronización factual y metadatos separados; ninguna aplicación, dependencia, config, validador, ADR o Skill protegida cambiada. |
| Remoto antes del PR | `git ls-remote origin refs/heads/main`, exit 0; main sigue en 7062bda4773b1b6dc42b89886f10238e728311fe. |

Avisos no bloqueantes: Node MODULE_TYPELESS_PACKAGE_JSON y normalización Git LF/CRLF. No se alteró configuración para silenciarlos. El RED inicial de metadata se observó en los diagnósticos de docs:check; su exit code no se capturó por separado en ese comando compuesto. Un control posterior detectó incompatibilidad entre anchors GitHub y el normalizador local (docs:check exit 1); se corrigieron los enlaces nuevos con permalinks del baseline, sin tocar el validador, y el rerun pasó. Log completo de validate conservado fuera de Git en `%TEMP%/furlanich-marketing-plan-validate.log`.

 Matriz de navegador, QA visual y mediciones de rendimiento de implementación: **NO EJECUTADAS** en este PR documental, no declaradas PASS.

### Handoff de planificación

[PR #54](https://github.com/Furlanich/Portfolio/pull/54) abierto el 2026-09-17 con el título solicitado, base main y head codex/marketing-presentation-plan-v1, draft false, merged false. La corrección TypeSafe está separada del commit documental. T1–T6 siguen sin iniciar; el plan continúa ACTIVE. El siguiente paso después del merge humano es exclusivamente PR 1 — Navegación y footer. La apertura y este registro no autorizan merge ni implementación en la tarea documental.

### Desviaciones

- Terminal/edición aisladas fallaron al inicializar con `helper_unknown_error: setup refresh had errors`, antes de ejecutar comandos. Se usó ejecución escalada autorizada para repositorio/validación, sin cambiar sandbox/políticas.
- Formato/ubicación de writing-plans adaptados a instrucción expresa: único plan Route B en active, copy por referencia, seis PR secuenciales; ningún plan Superpowers.
- Sin desviaciones de producto autorizadas. Cada PR posterior registra aquí desviación y resolución propietaria antes de declararse listo.
