---
id: DOCS-INDEX
type: documentation-index
status: APPROVED
related:
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
last_verified: 2026-09-04
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

Stage A preserves product and design knowledge, and Stage B adds the lightweight engineering harness. Stage C has accepted the homepage-foundation localized-routing architecture in [`ADR-STATIC-LOCALIZED-ROUTING`](decisions/static-localized-routing.md) and tracks its delivery in [`PLAN-HOMEPAGE-FOUNDATION`](plans/active/homepage-foundation.md). The application remains on the documented legacy implementation until that active plan is executed.
