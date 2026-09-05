---
id: DOCS-INDEX
type: documentation-index
status: APPROVED
related:
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PAGE-HOME
  - PAGE-SERVICES
  - PROJECT-EVIDENCE
last_verified: 2026-09-05
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
- [Research references](references/market-and-design-references.md): external sources that informed earlier positioning and evidence discussions.
- [Domain glossary](../CONTEXT.md): canonical project-specific terminology.

## Current documentation stage

Stage A preserves product and design knowledge, and Stage B adds the lightweight engineering harness. Stage C accepted the homepage-foundation localized-routing architecture in [`ADR-STATIC-LOCALIZED-ROUTING`](decisions/static-localized-routing.md); [`PLAN-HOMEPAGE-FOUNDATION`](plans/completed/homepage-foundation.md) records its completed four-PR delivery.

Initiative 2 closes the commercial homepage sections below `HOME-HERO` in [`PAGE-HOME`](product/pages/home.md), including complete Spanish/English copy, minimum later-section design rules, a readiness matrix, and an approved evidence-safe `HOME-PROOF` fallback. [`PROJECT-EVIDENCE`](product/project-evidence.md) records that no current project is eligible for a homepage card. [`PLAN-HOMEPAGE-COMPLETION`](plans/completed/homepage-completion.md) records the completed behavior-neutral content/anchor contract and atomic bilingual rendered integration; project cards and other release/full-site concerns remain OPEN in their owners.

Initiative 3 delivered the complete Services experience specified by [`PAGE-SERVICES`](product/pages/services.md): the retained hierarchy, full Spanish and English content, stable service anchors, contextual inquiry paths, provider and commercial boundaries, AI posture, honest asymmetric evidence treatment, and page-specific visual/accessibility extensions. [`AUDIENCES-SERVICES`](product/audiences-and-services.md) owns the service definitions and [`PROJECT-EVIDENCE`](product/project-evidence.md) owns the item-level publication limits. The implementation fits the accepted localized architecture and is recorded by [`PLAN-SERVICES-EXPERIENCE`](plans/completed/services-experience.md); richer evidence and final contractual/legal terms remain deferred in their owners.
