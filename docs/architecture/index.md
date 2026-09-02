---
id: ARCH-INDEX
type: architecture-index
status: APPROVED
related:
  - GOV-STATUS
  - ARCHITECTURE-MAP
last_verified: 2026-09-02
---

# Existing-system documentation

These documents describe the repository as it exists during Stage A. They are evidence for later decisions, not approval of the current implementation as the target architecture.

- [Current system](current-system.md): framework, routing, rendering, content, styling, localization, form, deployment, and repository structure.
- [Current quality findings](current-quality-findings.md): known accessibility, performance, SEO, content, and maintenance risks.
- [Architecture map](../../ARCHITECTURE.md): concise current architecture, approved product constraints, and proposed/open architecture context.
- [Stage B harness design](stage-b-agent-engineering-harness-design.md): approved scope for repository governance and deterministic validation.

Target architecture remains unapproved. The [engineering lifecycle](../governance/engineering-lifecycle.md) governs consequential architecture decisions.

## Preserved discovery recommendation — PROPOSED

Incrementally modernize this repository, remain static-first initially, reduce unnecessary client boundaries, and modernize CI later rather than adopt a greenfield rebuild. This is preserved discovery knowledge, not a target-architecture decision. It authorizes no architecture or CI change until a later architecture stage resolves it.
