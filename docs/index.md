---
id: DOCS-INDEX
type: documentation-index
status: APPROVED
related:
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PLAN-STUDIO-FOUNDER-COMPLETION
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PROJECT-EVIDENCE
  - TEST-STRATEGY
  - SUPERPOWERS-README
last_verified: 2026-09-10
---

# FURLANICH project knowledge

This directory is the authoritative source for durable FURLANICH product, content, design, and known-system knowledge. It is written to remain useful independently of any chat, coding agent, or vendor.

When documentation and conversation history disagree, this documentation wins. When approved documentation and the current application disagree, the documentation describes the intended product and the application describes the current implementation.

## Status vocabulary

- **APPROVED** — explicitly agreed or clearly established as the current direction.
- **PROPOSED** — a serious candidate that has not received definitive approval.
- **OPEN** — requires a future decision or missing evidence.
- **REJECTED** — considered and intentionally not selected.

Front matter records the overall governance status of a document. In mixed-status documents, explicit item-level **APPROVED**, **PROPOSED**, **OPEN**, and **REJECTED** markers are authoritative.

## Start here

- [Knowledge management](governance/knowledge-management.md): authority, status, maintenance, and update rules.
- [Status register](governance/status-register.md): approved, proposed, open, and rejected decisions in one place.
- [Product index](product/index.md): business purpose, audiences, services, information architecture, page specifications, and migration requirements.
- [Design index](design/index.md): approved homepage-foundation visual/interaction baseline, existing-system context, and broader unsettled design areas.
- [Architecture index](architecture/index.md): current implementation facts and known quality findings; it is not a target-architecture decision.
- [Architecture map](../ARCHITECTURE.md): concise current-system entry point, approved product constraints, and proposed/open architecture context.
- [Engineering lifecycle](governance/engineering-lifecycle.md): change classification, autonomy boundaries, traceability, and PR rules.
- [RFCs](rfcs/index.md), [ADRs](decisions/index.md), and [execution plans](plans/index.md): consequential proposals, accepted architecture history, and substantial-work records.
- [Testing strategy](testing/strategy.md): TDD, deterministic, browser, accessibility, visual, and static-export verification layers.
- [Project-local process Skills](superpowers/README.md): pinned Taste/Superpowers provenance and methodology artifact locations.
- [Research references](references/market-and-design-references.md): external sources that informed earlier positioning and evidence discussions.
- [Domain glossary](../CONTEXT.md): canonical project-specific terminology.

## Current documentation stage

Stage A preserves product and design knowledge, and Stage B adds the lightweight engineering harness. Stage C accepted the homepage-foundation localized-routing architecture in [`ADR-STATIC-LOCALIZED-ROUTING`](decisions/static-localized-routing.md); [`PLAN-HOMEPAGE-FOUNDATION`](plans/completed/homepage-foundation.md) records its completed four-PR delivery.

Initiative 2 closes the commercial homepage sections below `HOME-HERO` in [`PAGE-HOME`](product/pages/home.md), including complete Spanish/English copy, minimum later-section design rules, a readiness matrix, and an approved evidence-safe `HOME-PROOF` fallback. [`PROJECT-EVIDENCE`](product/project-evidence.md) records that no current project is eligible for a homepage card. [`PLAN-HOMEPAGE-COMPLETION`](plans/completed/homepage-completion.md) records the completed behavior-neutral content/anchor contract and atomic bilingual rendered integration; project cards and other release/full-site concerns remain OPEN in their owners.

Initiative 3 delivered the complete Services experience specified by [`PAGE-SERVICES`](product/pages/services.md): the retained hierarchy, full Spanish and English content, stable service anchors, contextual inquiry paths, provider and commercial boundaries, AI posture, honest asymmetric evidence treatment, and page-specific visual/accessibility extensions. [`AUDIENCES-SERVICES`](product/audiences-and-services.md) owns the service definitions and [`PROJECT-EVIDENCE`](product/project-evidence.md) owns the item-level publication limits. The implementation fits the accepted localized architecture and is recorded by [`PLAN-SERVICES-EXPERIENCE`](plans/completed/services-experience.md); richer evidence and final contractual/legal terms remain deferred in their owners.

Initiative 4 closes the Projects/Evidence product and design decisions in [`PAGE-PROJECTS`](product/pages/projects.md), [`PROJECT-EVIDENCE`](product/project-evidence.md), the [item-level inventory](product/projects/index.md), and the [experience specification](product/projects/experience.md). It approves the public taxonomy, hybrid inventory-sensitive IA, card/detail/imagery rules, bilingual system language, confidentiality treatment, accessibility, performance, and visual-QA criteria. [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](plans/completed/projects-evidence-experience.md) records the completed work within the accepted static localized architecture: Task 2 publishes the index, Task 3 publishes exactly three paired summary-only detail pages with labeled conceptual visuals, and Task 4 retires the verified-unused legacy project paths. Homepage eligibility remains deferred; launch filters and empty groups remain rejected, and the approved homepage proof fallback is unchanged.


Initiative 5 closes the distinct Studio and Founder experiences in [PAGE-STUDIO / PAGE-FOUNDER](product/pages/studio-and-founder.md): exact Spanish and English content, route/navigation responsibilities, direct-accountability and collaborator language, operating principles, location/availability, professional history, education, grouped capabilities, Projects and Contact bridges, CV/professional-link treatment, portrait deferral, duplication boundaries, visual compositions, responsive behavior, accessibility, and implementation readiness. The corresponding page extensions are approved in [DESIGN-VISUAL](design/visual-language.md#studio-and-founder-visual-baseline-approved) and [DESIGN-IX-A11Y](design/interaction-responsive-accessibility.md#studio-and-founder-interaction-and-responsive-baseline-approved). Implementation is classified as substantial approved work and is recorded by [`PLAN-STUDIO-FOUNDER-COMPLETION`](plans/completed/studio-founder-completion.md), a completed four-PR, test-first sequence within ADR-STATIC-LOCALIZED-ROUTING. No RFC or new ADR is required.

## Initiative 6 — Contact and inquiry decision closure

[`PAGE-CONTACT / PAGE-PRIVACY`](product/pages/contact-and-privacy.md) now owns the approved in-site, four-field primary inquiry experience, bilingual copy, state model, failure fallbacks, notification contract, abuse baseline, factual privacy scope, retention target, and verification boundary. [`DESIGN-VISUAL`](design/visual-language.md) and [`DESIGN-IX-A11Y`](design/interaction-responsive-accessibility.md) own the approved Contact-specific visual, responsive, semantic, focus, and status behavior.

[`RFC-CONTACT-INQUIRY-PIPELINE`](rfcs/contact-inquiry-pipeline.md) now proposes Formspree behind a narrow `submitInquiry()` adapter for the static-site release after comparing Cloudflare Worker + Resend and EmailJS. It defines the exact payload, security, stored-copy disclosure, retention gate, abuse model, failure behavior, tests, operations, and migration path. The proposal is not provider approval or implementation authority: the Contact form remains blocked until human acceptance, verified provisioning and retention behavior, the professional legal/privacy review, a deployed-reality Privacy page, and a labeled inbox-delivery/deletion smoke test. A `mailto:` action remains a fallback and is rejected as the primary form implementation.
