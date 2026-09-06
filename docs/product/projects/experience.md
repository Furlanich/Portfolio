---
id: PROJECTS-EXPERIENCE-CLOSURE
type: product-design-spec
status: APPROVED
related:
  - PROJECT-EVIDENCE
  - PAGE-PROJECTS
  - PAGE-PROJECT-DETAIL
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-06
---

# Projects and evidence experience

This record closes the product, content, layout, imagery, filtering, detail-page, accessibility, and performance decisions for the Projects experience. The inventory authorizes a public bilingual Projects index with three limited, image-free cards and three paired summary-only detail pages. The fail-closed content contract remains the publication boundary; only item records explicitly marked `READY` or `READY-SUMMARY-ONLY` may enter its public manifest.

## Buyer questions and content principle

The experience must explain what was built, the operating context, maturity, relationship, business need, delivered scope, demonstrated result, available evidence, disclosure limits, relevance to a similar buyer, inspectable links, and related service. Commercial relevance and disclosure honesty lead; technology is supporting detail.

No legacy claim is public merely because it exists in application data. Every rendered field must come from a typed, localized, publication-approved record.

## Approved bilingual index copy

This copy is implementation-ready for the three-item launch inventory. It must not be used to launch an otherwise empty route.

**Spanish**

- H1: `Proyectos seleccionados`
- Introduction: `Publicamos trabajo solo cuando podemos explicar con claridad su contexto, alcance, estado actual y permiso de publicación. Cada proyecto distingue qué está en producción, qué puede demostrarse y qué debe permanecer reservado.`
- Final CTA heading: `¿Necesitás resolver algo parecido?`
- Final CTA body: `Contanos el contexto, el proceso o el sistema que necesitás mejorar. Te respondemos con una evaluación directa del próximo paso.`
- Final CTA label: `Hablar sobre tu proyecto`

**English**

- H1: `Selected work`
- Introduction: `We publish work only when we can clearly explain its context, scope, current status, and publication permission. Each project distinguishes what is in production, what can be demonstrated, and what must remain private.`
- Final CTA heading: `Need to solve something similar?`
- Final CTA body: `Tell us about the context, process, or system you need to improve. We will respond with a direct assessment of the next step.`
- Final CTA label: `Discuss your project`

## Taxonomy decision

| Option | Spanish | English | Decision |
| --- | --- | --- | --- |
| A | Soluciones en producción; Laboratorio FURLANICH; Prototipos funcionales | Production solutions; FURLANICH Lab; Functional prototypes | APPROVED: clearest maturity language without implying client ownership. |
| B | Trabajo en producción; Exploraciones aplicadas; Demostraciones funcionales | Production work; Applied explorations; Functional demonstrations | Rejected: less buyer-oriented and weakens the maturity distinction. |
| C | Sistemas en uso; Laboratorio FURLANICH; Prototipos verificados | Systems in use; FURLANICH Lab; Verified prototypes | Rejected: can overstate current usage and verification. |

The labels are conditional section headings, not grades. Never show an empty category. A prototype may appear under `Prototipos funcionales / Functional prototypes` only after behavior meets `functional-demonstration`; otherwise it remains internal.

## Index information architecture

The approved approach is hybrid and inventory-sensitive.

1. Short introduction explaining evidence transparency.
2. Selected evidence ordered editorially.
3. Maturity groups only when at least four public records span at least two populated groups.
4. Visible confidentiality/publication note when any displayed record is restricted.
5. Final inquiry CTA using the existing Action-tint pattern.

With one item, render one substantial evidence story. With two or three, render one ungrouped editorial grid with maturity in each card. With zero, do not launch an empty Projects route or blocked-project teaser; retain the current homepage fallback and direct visitors through Services and Contact.

Filters are rejected for launch. Reconsider at eight or more public records only when service, industry, or maturity dimensions have meaningful populations and improve buyer browsing. Technology filters remain rejected.

## Editorial ordering

Order by commercial relevance, evidence strength, service coverage, disclosure completeness, visual quality, and diversity of demonstrated capability. Do not sort by chronology, repository recency, stack size, code volume, project complexity, or personal preference.

## Project card specification

### Content anatomy

1. One restrained meta row: public maturity plus sector or operating context; add one evidence phrase only when it remains readable.
2. Outcome-oriented title. A proper project name may follow as secondary context but does not lead when it obscures buyer value.
3. Two-to-four concise lines covering business situation and delivered value. Do not line-clamp translated copy.
4. Two or three non-interactive capability tags, such as Reservations, Customer portal, Process automation, Integration, or System modernization.
5. Plain-language evidence signal.
6. One explicit CTA appropriate to disclosure and destination.

Technology does not appear in the primary tag row unless it is itself commercially material. Do not use “Proven”, “Successful”, or “Enterprise-grade” without approved evidence.

### Public evidence language

| Purpose | Spanish | English |
| --- | --- | --- |
| Live evidence | Sitio público | Public site |
| Source evidence | Código fuente público | Public source |
| Demonstration | Demostración funcional | Functional demo |
| Authorized text | Descripción autorizada | Authorized description |
| Restricted production | Resumen de producción anonimizado | Anonymized production summary |
| Missing demo | Demostración pública no disponible | No current public demo |
| Withheld detail | Detalles de producción reservados | Production details withheld |

Internal values such as `implementation-evidence` do not appear verbatim. A typical card meta treatment is `Prototipo funcional · Transporte de pasajeros`; the capability row may read `Reservas · Portal de clientes · Automatización`. Do not create five-to-eight badges.

### CTA rules

Use `Ver solución / View solution` for an eligible production detail, `Ver proyecto / View project` for a general eligible detail, `Ver demostración / View demo` for a verified direct demonstration, `Ver código fuente / View source` for an approved public repository, or `Consultar por una solución similar / Ask about a similar solution` when disclosure only supports inquiry. A summary-only card with no meaningful detail may route to its approved evidence destination, Contact, or its related Services anchor, never an empty project page.

### Visual and responsive composition

- Base card: Surface background, 1px Border, 16px radius, no decorative shadow, content-driven height.
- Wide and 1024px layouts: two equal grid columns for substantial cards. A three-column variant is allowed only for shorter evidence cards whose content remains readable.
- Medium: two columns only when titles and bilingual summaries remain comfortable; otherwise one.
- Compact, including 320px: one column.
- Repeated cards may equalize to the tallest card in a row, but no fixed height or clipping is allowed. The CTA sits after evidence at the natural card end.
- Text measure: title and summary stay within a readable card column; no truncation or fixed line count.
- Do not make the entire card clickable. Use an explicit title or CTA link and avoid nested interactive elements.
- Hover may change border or link emphasis without scale, tilt, motion depth, gradient, glass, or 3D effects.

## Imagery policy

An image is optional. Choose, in priority order: authorized current screenshot, public-site screenshot with established provenance and permission, verified demo capture, neutral FURLANICH capability diagram, clearly labeled conceptual illustration, or no image.

- Never fabricate restricted client UI.
- Existing legacy SVG captures are not approved: their capture date, represented version, sensitive-data review, and publication permission are unknown.
- General Reservation System, The-System, and MPC Administración launch as READY image-free cards. Their paired detail pages may use the newly generated, labeled conceptual WebP diagrams recorded in the item records; these are not screenshots or functional evidence. Busesfy, ChronoApp, and Documancer remain non-public and use no public image.
- A future General Reservation System screenshot must be a fresh capture from a verified run. The approved The-System and MPC visuals distinguish real implementation from concept, and any future Documancer visual must do the same.
- Restricted production work may use a neutral branded capability diagram or permitted summary graphic.

Evidence screenshots use a 16:9 frame, neutral border/background, and `object-fit: contain` so interface evidence is not cropped. Decorative illustrations may use `cover` when the meaningful subject remains visible. On compact layouts the visual becomes full card width above text. Avoid mock-browser chrome unless it explains the evidence.

Alt text describes the meaningful workflow and visible state, not the project title alone. Decorative diagrams use empty alt text. Generated or conceptual visuals must be visibly labeled in nearby copy.

## Detail-page eligibility

A detail page requires a meaningful information gain over the card, at least one permitted evidence asset or evidence link, and enough approved material to cover at least five of: context, problem, delivered scope, capabilities/workflows, demonstrated or verified result, evidence, limitations, links, and visual material. A `summary-only` project without this depth has no detail route.

## Detail-page hierarchy and composition

1. Project header with public title, concise context, maturity/evidence language, sector, related service, and optional approved visual.
2. Visible maturity/evidence/disclosure statement.
3. Business context.
4. Problem or opportunity.
5. Delivered scope.
6. Capabilities and workflows.
7. Demonstrated or verified result, explicitly naming whether it is a business result, production usage, functional behavior, or implementation evidence.
8. Evidence gallery or links labeled as live site, demo, repository, screenshot, or authorized summary.
9. Visible limitations/confidentiality panel.
10. Technical notes when useful and permitted.
11. Restrained related-service link.
12. Existing Action-tint inquiry CTA.

On wide screens, the header uses approximately 7/12 text and 5/12 evidence visual. Without a visual, text is constrained to an approximately eight-column readable measure. Context/problem uses Surface; delivered scope uses Canvas; capabilities may use a responsive two-to-three-column grid; evidence uses Surface; limitations use a neutral bordered panel; compact layouts stack in reading order. Technology badge clusters are not used.

## Confidentiality pattern

Use the heading `Alcance de publicación / Publication scope` and one of these approved statements:

- ES: `La descripción pública está limitada por permisos de publicación y compromisos de confidencialidad. Algunos detalles de implementación no se muestran.`
- EN: `The public description is limited by publication permissions and confidentiality commitments. Some implementation details are not shown.`

Do not claim an NDA unless an actual agreement is confirmed. Do not use “classified”, “secret project”, or “confidential client” as decorative trust language.

## Service and homepage relationships

Every public record links to at least one genuinely demonstrated service, normally `SERVICE-WEB`, `SERVICE-WHATSAPP`, or `SERVICE-CONSULTING`. The detail link is restrained and no cross-selling rail is introduced. The three READY cards relate to `SERVICE-WEB`, but none passes the separate `HOME-PROOF` evidence gate, so the approved homepage fallback remains unchanged.

## Accessibility acceptance

- Semantic page regions and a logical heading hierarchy.
- Meaningful link text and no nested interactive controls.
- Status meaning expressed in text, never color alone.
- Informative screenshots have workflow-specific alt text; decorative visuals are hidden from assistive technology.
- Visible keyboard focus, 44px touch targets for primary actions, and reading-order-consistent responsive layouts.
- No essential hover-only content; reduced-motion preference is honored.
- Copy and controls remain usable at 200% text zoom and reflow without horizontal scrolling at 320 CSS px.

## Performance and static delivery

- Capture evidence at a documented source size, normally 1600x900, and generate responsive 800, 1200, and 1600px derivatives in WebP or AVIF where browser support and the static exporter permit.
- Prefer a roughly 250KB maximum for a 1600px card/detail derivative, but preserve enough quality for interface text to remain legible; evidence readability wins over an arbitrary byte target.
- Eager-load only a true above-the-fold/LCP visual; lazy-load below-the-fold evidence.
- Do not ship multi-megabyte embedded SVG/PNG placeholders or full-resolution originals as card assets.
- Preserve static-export, trailing-slash, locale-route, and build-time base-path compatibility.

## Visual QA acceptance matrix

Verify both locales at 320x800, representative compact mobile around 375x812, tablet 768x1024, 1024x768, and wide desktop around 1440x900. Check card alignment and natural heights, copy expansion, image containment/crops, no horizontal scroll, visible focus, evidence-label readability, CTA order, correct card/detail destinations, and the no-empty-route rule. Eligible detail pages require compact and wide verification.

Also check keyboard-only traversal, screen-reader heading/link structure, 200% text zoom, reduced motion, and a built static export under both root and configured base-path routing.

## Architecture boundary

Use a typed static project content model with explicit localized fields, evidence/disclosure data, service relationships, and optional links/assets. Task 3 / PR 3 may extend the existing static locale route map for the three paired summary-only detail pages. Do not add a CMS, database, dynamic backend, project API, admin panel, search engine, or filter framework for the current inventory.

Internal relationship, permission, evidence-strength, lifecycle, restriction, and homepage-eligibility data remains in `PROJECT-EVIDENCE` and the item records. Public application modules contain only an explicit publication manifest and approved localized public content. The active implementation sequence and its evidence gates are owned by [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](../../plans/active/projects-evidence-experience.md).
