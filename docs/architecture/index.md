---
id: ARCH-INDEX
type: architecture-index
status: APPROVED
related:
  - GOV-STATUS
  - ARCHITECTURE-MAP
  - ADR-STATIC-LOCALIZED-ROUTING
last_verified: 2026-09-04
---

# Existing-system documentation

These documents describe the repository as it exists during Stage A. They are evidence for later decisions, not approval of the current implementation as the target architecture.

- [Current system](current-system.md): framework, routing, rendering, content, styling, localization, form, deployment, and repository structure.
- [Current quality findings](current-quality-findings.md): known accessibility, performance, SEO, content, and maintenance risks.
- [Architecture map](../../ARCHITECTURE.md): concise current architecture, approved product constraints, and proposed/open architecture context.
- [Stage B harness design](stage-b-agent-engineering-harness-design.md): approved scope for repository governance and deterministic validation.

The homepage-foundation localized-routing target is approved in [`ADR-STATIC-LOCALIZED-ROUTING`](../decisions/static-localized-routing.md). The current-system records remain legacy implementation evidence until that architecture is delivered. Broader target architecture remains subject to the [engineering lifecycle](../governance/engineering-lifecycle.md).

## Preserved discovery recommendation — PROPOSED

Incrementally modernize this repository, remain static-first initially, reduce unnecessary client boundaries, and modernize CI later rather than adopt a greenfield rebuild. This is preserved discovery knowledge, not a target-architecture decision. It authorizes no architecture or CI change until a later architecture stage resolves it.
