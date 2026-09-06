---
id: GOV-STATUS
type: decision-register
status: APPROVED
related:
  - GOV-KNOWLEDGE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
  - RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PAGE-HOME
  - PAGE-SERVICES
  - PROJECT-EVIDENCE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-06
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
- Explicit Spanish-root and English-`/en/` static route trees with locale-specific root layouts are approved in [`RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING`](../rfcs/homepage-foundation-static-localized-routing.md) and recorded by [`ADR-STATIC-LOCALIZED-ROUTING`](../decisions/static-localized-routing.md). Delivery is tracked by [`PLAN-HOMEPAGE-FOUNDATION`](../plans/completed/homepage-foundation.md).

### Homepage and process

- The approved homepage sequence, Spanish copy, natural English adaptations, CTA destinations, evidence boundaries, conversion narrative, and implementation-readiness matrix are owned by [`PAGE-HOME`](../product/pages/home.md).
- The approved [`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](../rfcs/homepage-hero-implementation-boundary.md) requires the homepage-foundation prerequisites to be resolved and planned before application implementation begins; it does not approve the remaining OPEN product or architecture choices.
- The public process is Understand/Diagnose, Define Scope, Build/Validate, and Implement/Support.
- AI is not a standalone homepage marketing section.

### Commercial homepage completion decision closure

- `HOME-PROBLEMS`, `HOME-SERVICES`, `HOME-AUDIENCES`, `HOME-PROCESS`, `HOME-FOUNDER`, and `HOME-CTA` are product-, content-, design-, and evidence-ready in Spanish and English.
- `HOME-SERVICES` uses informational cards and one section-level Services CTA; three duplicate card CTAs are rejected.
- `HOME-PROOF` uses the approved credibility fallback based on direct founder accountability, verifiable claims, and confidentiality because no current project passes every publication gate.
- The complete homepage implementation is recorded by [`PLAN-HOMEPAGE-COMPLETION`](../plans/completed/homepage-completion.md), using that fallback. Project cards, Projects routes, a contact form, new imagery, and new architecture are outside this plan.
- The later-section spacing, surfaces, type hierarchy, cards, section treatments, icon posture, and final CTA treatment are approved in [`DESIGN-VISUAL`](../design/visual-language.md#commercial-homepage-section-baseline-approved).
- The later-section reflow, semantics, list structure, targets, focus, keyboard, anchor, reduced-motion, and verification rules are approved in [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md#commercial-homepage-section-baseline-approved).
- No new routing, localization, hosting, dependency, CMS, backend, or design-system architecture is required for these sections.

### Services experience decision closure

- The complete bilingual `/servicios/` and `/en/services/` structure, exact copy, contextual service CTAs, final CTA, evidence treatment, conversion review, and readiness matrix are approved in [`PAGE-SERVICES`](../product/pages/services.md).
- The six-part page hierarchy is retained. A compact non-sticky service index is approved within the introduction; FAQ, pricing, a technology catalogue, testimonials, service subpages, and a fourth AI service are not added.
- `SERVICE-WEB` distinguishes commercial sites/catalogues, transactional ordering/booking/payment flows, and portals/custom web applications without presenting packages or tiers.
- `SERVICE-WHATSAPP` distinguishes basic contact, automated flows, bot-assisted interaction, official provider/API integration, and client-system integration. Meta/WhatsApp policy, templates where applicable, providers, fees, client systems, and feasibility remain explicit dependencies.
- `SERVICE-CONSULTING` is approved as work on an identifiable existing system: diagnosis, defect investigation, stabilization, updates, integrations, performance, technical debt, modernization planning, and continuity by agreement. A new system is a development engagement, and no support SLA is implied.
- Stable service anchors are approved: Spanish `#web`, `#whatsapp`, and `#consultoria`; English `#web`, `#whatsapp`, and `#consulting`. The homepage keeps its single Services-page-root CTA.
- Each service section uses one contextual CTA to the localized Contact page; the final CTA remains general. No CTA implies a quote, free diagnosis, package, or guaranteed acceptance.
- The Services page is evidence-ready with honest asymmetric status copy: limited text-only acknowledgement of General Reservation System for Web, and explicit absence of publishable WhatsApp and consulting evidence. No service project card, logo, metric, testimonial, certification, or simulated case study is approved.
- The Services visual, responsive, semantic, anchor, keyboard, focus, target, motion, and verification extensions are approved in [`DESIGN-VISUAL`](../design/visual-language.md#services-page-visual-baseline-approved) and [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md#services-page-interaction-and-responsive-baseline-approved).
- The complete Services experience fits `ADR-STATIC-LOCALIZED-ROUTING`. It requires a versioned execution plan, not an RFC, new ADR, route, dependency, CMS, backend, hosting change, or new design-system architecture.
- The three-PR implementation history is recorded by the completed [`PLAN-SERVICES-EXPERIENCE`](../plans/completed/services-experience.md). The complete bilingual Services routes now render the approved experience within the accepted static localized architecture.

### Homepage foundation decision closure

- The English `HOME-HERO` adaptation is approved in [`PAGE-HOME`](../product/pages/home.md#home-hero-approved-english-adaptation).
- The minimum wordmark, launch palette, typography, spacing/grid, CTA, surface, light-theme, and imagery decisions are approved in [`DESIGN-VISUAL`](../design/visual-language.md#homepage-foundation-visual-baseline-approved).
- The homepage-foundation responsive ranges, WCAG 2.2 AA target, CTA reflow, and no-entrance-motion posture are approved in [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md#homepage-foundation-interaction-and-responsive-baseline-approved).
- The first hero is typography-led and does not require imagery.
- Minimum localized Services and Contact destinations, and the minimum Founder migration destination, are approved in their page specifications.
- A custom logo symbol, complete design system, founder photograph, service fragments, and English content outside the minimum destination slice do not block homepage-foundation technical planning.

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
- The three-axis maturity/disclosure/evidence model, fail-closed publication lifecycle, internal record, public-card hierarchy, detail hierarchy, prototype eligibility gate, and editorial rules are approved in [`PROJECT-EVIDENCE`](../product/project-evidence.md).
- Clients, metrics, testimonials, team size, production outcomes, ownership, and permission must not be invented or inferred from a legacy record, public URL, screenshot, or source repository.
- MPC Administración is a 2021 educational assignment for a fictional organization, not client production evidence.
- No current project is approved for a business-homepage project card. The current launch uses the approved `HOME-PROOF` credibility fallback.

### Projects / Evidence experience decision closure

- The accepted public taxonomy is “Soluciones en producción / Production solutions,” “Laboratorio FURLANICH / FURLANICH Lab,” and “Prototipos funcionales / Functional prototypes.” Group labels render only for populated categories, and the prototype label requires verified functional behavior.
- The accepted index structure is hybrid and inventory-sensitive: selected evidence first; maturity groups only with at least four public items across two populated groups; no empty groups.
- Filters are rejected for launch and may be reconsidered only at eight or more public records with buyer-useful category populations.
- Card, imagery, confidentiality, detail-page eligibility, detail composition, bilingual system language, accessibility, performance, and visual-QA rules are approved in [Projects and evidence experience](../product/projects/experience.md).
- The [item-level inventory](../product/projects/index.md) records explicit decisions and permission matrices: Busesfy `BLOCKED-PERMISSION`; General Reservation System `BLOCKED-FUNCTIONAL-VERIFICATION`; MPC Administración `FOUNDER-ONLY`; ChronoApp `RETIRED`; Documancer `PRIVATE`; and newly discovered The-System `BLOCKED-PERMISSION`.
- No candidate is `READY` or `READY-SUMMARY-ONLY`. Therefore Projects-route implementation and every project card/detail page are blocked; do not launch an empty route or expose blocked candidates.
- `HOME-PROOF` keeps its approved fallback. Homepage redesign remains outside this initiative.
- The experience fits `ADR-STATIC-LOCALIZED-ROUTING`. A future implementation uses typed static localized records and requires a versioned execution plan, not a CMS, database, backend, project API, admin panel, search engine, filtering framework, RFC, or new ADR.

## PROPOSED

- Public descriptor: “Estudio de desarrollo de software a medida.”
- Internal commercial defaults including milestone payment percentages, a 30-day defect warranty, and detailed ownership terms; these require business/legal review.
- Incremental/static-first architecture recommendation — **PROPOSED** preserved knowledge owned by [`ARCH-INDEX`](../architecture/index.md); it authorizes no architecture or CI change.
- Use conceptual or AI-generated imagery only when clearly identified and never as false evidence of an implemented client solution.

## OPEN

- Extended visual identity and design-system decisions beyond the approved commercial homepage and Services-page baselines: custom mark, additional semantic colors, full component variants, and broader imagery.
- Confirmed commercial domain and canonical production URL. This is a **RELEASE BLOCKER**, not an implementation or integration blocker.
- Final form provider, privacy wording, consent treatment, data retention period, and third-party disclosures. These are **RELEASE BLOCKERS** for the completed inquiry experience, not blockers for hero implementation.
- Final legal and contractual review of commercial boundaries.
- Founder photograph and any later CV redesign; both are non-blocking for the commercial homepage.
- Permission, functional verification, approved bilingual item copy, and visual provenance required to advance currently blocked project records.
- Richer public evidence for WhatsApp automation and maintenance/consulting. Its absence is explicit and does not block the approved Services page.
- Busesfy's ownership/client relationship, maturity, public-description permission, screenshot permission, and client identity permission.
- General Reservation System functional-demonstration status and future homepage eligibility; its recorded demo currently returns 404.
- The-System relationship/permission record and current clean-checkout functional verification.
- Whether any individual service pages will be needed after launch performance is observed.
- Long-term hosting after the current static-export/GitHub Pages migration slice; changing hosting remains a future architecture decision and does not block the foundation.
- Whole-site responsive behavior, accessibility audit/conformance claims, and performance budgets beyond the approved homepage, Services, and Projects baselines.
- English copy outside the approved complete homepage, complete Services page, Projects system language, and minimum Contact and Founder destinations, plus item-specific copy for future publication-ready evidence.

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
- Publishing any current inventory item as a homepage project card before it reaches the approved `ready` state.
- Launching an empty Projects route, empty maturity group, or empty project-detail page.
- Adding launch filters for the current small inventory.
- Presenting MPC Administración as client or production work.
- Repeating three service-card CTAs that all lead to the Services page root.
