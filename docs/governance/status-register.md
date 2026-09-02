---
id: GOV-STATUS
type: decision-register
status: APPROVED
related:
  - GOV-KNOWLEDGE
last_verified: 2026-09-01
---

# Product knowledge status register

This register summarizes status. Detailed requirements remain authoritative in their owning documents.

## APPROVED

### Business

- The commercial name is **FURLANICH**.
- The business is founder-led. Samuel Furlanich is the public face and has direct technical responsibility.
- Collaborators may be added when scope requires them; their existence or identities are not central client-facing claims.
- The primary audience is small and medium-sized businesses and operational decision-makers, initially in Argentina with emphasis on Buenos Aires Province and CABA.
- FURLANICH is available for projects elsewhere in Argentina and internationally, in Spanish and English. This is availability, not a claim of prior international client work.
- Primary Spanish is Argentine Spanish. English is secondary.
- The three launch service areas are commercial websites/web applications, WhatsApp automation and integrations, and software maintenance/IT consulting.
- ERP and advanced AI work are tailored engagements, not packaged instant products.
- Entertainment, game-development, and RPG-management work remains secondary and rare.
- Deployment follows testing and quality assurance appropriate to the agreed scope and risk; this is not a promise of zero defects.

### Conversion and contact

- The primary conversion is a structured inquiry containing name, email, optional business name, and message/problem description.
- Email, WhatsApp, and phone are secondary channels.
- The usual response target is the same business day; exceptional delay is up to two business days.
- Public contact facts are `samuelfurlanich@gmail.com` and mobile/WhatsApp `+54 9 11 5011-7565`.

### Information architecture

- The business experience is primary; the personal portfolio becomes a secondary founder profile within the same site.
- Spanish routes live at the root and English routes under `/en/`.
- The accepted page set is Home, Services, Projects, Project Detail where disclosure permits, Studio/About, Founder Profile, Contact, Privacy, and Not Found.
- Process remains a homepage section, not a standalone launch page.
- There is no top-level AI page at launch.
- The brand links home; navigation does not need a separate Home item.
- Language switching preserves page context and does not use query-string or client-only locale state.
- Automatic locale redirection is not used for the static site.

### Homepage and process

- The approved homepage sequence and Spanish copy are owned by [`PAGE-HOME`](../product/pages/home.md).
- The public process is Understand/Diagnose, Define Scope, Build/Validate, and Implement/Support.
- AI is not a standalone homepage marketing section.

### Founder facts

- Samuel completed his Computer Science studies at the University of Buenos Aires.
- He has worked independently since 2024.
- He began working at Clever Soft SA as a Software Developer in June 2026; this belongs in narrative biography rather than a résumé-style fact list or experience timeline.
- Chivilcoy may appear in contact information or biography but should not narrow the general market-positioning copy.

### Project disclosure

- Project knowledge is conceptually grouped into production work, laboratory work, and prototypes.
- For restricted client work, only the solution type and approved brief description may be shared unless broader permission is granted.
- Client UI and internal workings must not be exposed when forbidden.
- Client logos require permission. Placeholders are limited to development/testing and must not reach public deployment.

## PROPOSED

- Public descriptor: “Estudio de desarrollo de software a medida.”
- Public project labels: “Soluciones en producción,” “Laboratorio FURLANICH,” and “Prototipos funcionales.”
- A hybrid evidence ladder combining full approved cases, anonymized summaries, restricted production summaries, laboratory demonstrations, and prototypes.
- Exact project-by-project classifications and homepage selections in the project evidence inventory.
- Internal commercial defaults including milestone payment percentages, a 30-day defect warranty, and detailed ownership terms; these require business/legal review.
- Current architecture recommendation from discovery: modernize this repository incrementally, remain static-first initially, reduce unnecessary client boundaries, and modernize CI later.
- Use conceptual or AI-generated imagery only when clearly identified and never as false evidence of an implemented client solution.
- Do not invent clients, metrics, testimonials, team size, or production outcomes. This integrity rule has been strongly recommended but was not separately recorded as an explicit user approval.

## OPEN

- Final visual identity, palette, type system, spacing, grid, component treatment, imagery direction, and motion language.
- Confirmed commercial domain and canonical production URL.
- Final form provider, privacy wording, consent treatment, data retention period, and third-party disclosures.
- Final legal and contractual review of commercial boundaries.
- Founder photograph and final approved biography wording.
- Item-level project inventory, maturity classification, permission scope, metrics, working links, and homepage selection.
- Public evidence for WhatsApp automation and maintenance/consulting.
- Whether Busesfy and MPC are client production work, owned products, or prototypes for publication purposes.
- Whether any individual service pages will be needed after launch performance is observed.
- Target hosting after launch; GitHub Pages is the current platform and a proposed launch platform, not an irreversible decision.
- Detailed target responsive behavior, accessibility conformance level, and performance budgets.
- Final English copy and translated project evidence.

## REJECTED

- Keeping the personal résumé/portfolio as the primary homepage.
- Deleting the valuable personal portfolio history instead of migrating it.
- A separate Home navigation item when the brand already links home.
- Top-level launch pages for Technology, Solutions, AI, Team, Blog, Pricing, Careers, or Portfolio.
- Individual service subpages in the initial sitemap.
- Query-string or client-state-only localization and automatic locale redirection.
- Presenting ERP or AI automation as a single ready-made instant product.
- Interpreting “current technology” as a refusal to maintain or modernize an existing legacy system.
- Publishing placeholders as client logos.
- Publishing forbidden client UI or internal workings.
