---
id: ARCH-INDEX
type: architecture-index
status: APPROVED
related:
  - GOV-STATUS
  - ARCHITECTURE-MAP
  - ADR-STATIC-LOCALIZED-ROUTING
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PLAN-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-09-12
---

# Existing-system documentation

These documents describe the repository as it exists during Stage A. They are evidence for later decisions, not approval of the current implementation as the target architecture.

- [Current system](current-system.md): framework, routing, rendering, content, styling, localization, form, deployment, and repository structure.
- [Current quality findings](current-quality-findings.md): known accessibility, performance, SEO, content, and maintenance risks.
- [Architecture map](../../ARCHITECTURE.md): concise current architecture, approved product constraints, and proposed/open architecture context.
- [Stage B harness design](stage-b-agent-engineering-harness-design.md): approved scope for repository governance and deterministic validation.

The homepage-foundation localized-routing target is approved and delivered under [`ADR-STATIC-LOCALIZED-ROUTING`](../decisions/static-localized-routing.md). The current-system record separates retained legacy material from the merged localized foundation, commercial homepage, and completed Projects cleanup. The complete Services implementation and approved Projects/Evidence target fit that architecture. [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](../plans/completed/projects-evidence-experience.md) owns the completed fail-closed static public-content boundary, conditional route sequence, and legacy cleanup; no RFC or new ADR is required. Broader target architecture remains subject to the [engineering lifecycle](../governance/engineering-lifecycle.md).

## Preserved discovery recommendation — PROPOSED

Incrementally modernize this repository, remain static-first initially, reduce unnecessary client boundaries, and modernize CI later rather than adopt a greenfield rebuild. This is preserved discovery knowledge, not a target-architecture decision. It authorizes no architecture or CI change until a later architecture stage resolves it.

## Contact inquiry architecture — ACCEPTED DUAL MODE, EXECUTION ACTIVE

The current public mode is the zero-transmission demonstration recorded by [`ADR-CONTACT-INQUIRY-DEMO-MODE`](../decisions/contact-inquiry-demonstration-mode.md): `ContactForm -> submitInquiry() -> demo adapter -> local simulated outcome`. It preserves the complete form, validation, state, localization, and accessibility behavior without a provider, inbox, storage, or commercial-intake claim.

Governance PR #43 and [`ADR-CONTACT-INQUIRY-PIPELINE`](../decisions/contact-inquiry-pipeline.md) preserve `ContactForm -> submitInquiry() -> Formspree adapter -> Formspree HTTPS endpoint -> configured inbox` for a separately reviewed commercial activation. PR #45 merged that provider-neutral boundary without route integration. [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/active/contact-inquiry-pipeline.md) now owns demonstration delivery and deployed zero-transmission proof; real account/configuration, processor/transfer, professional review, inbox delivery, and deletion remain OPEN future gates.
