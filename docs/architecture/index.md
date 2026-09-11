---
id: ARCH-INDEX
type: architecture-index
status: APPROVED
related:
  - GOV-STATUS
  - ARCHITECTURE-MAP
  - ADR-STATIC-LOCALIZED-ROUTING
  - ADR-CONTACT-INQUIRY-PIPELINE
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PLAN-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-09-11
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

## Contact inquiry architecture — ACCEPTED, EXECUTION PLANNED

Initiative 6 approves an in-page form that delivers to the configured business inbox while preserving the current static-export/GitHub Pages architecture. Governance PR #43 accepted `ContactForm -> InquirySubmissionPort / submitInquiry() -> Formspree adapter -> Formspree HTTPS endpoint -> configured FURLANICH target email`. It keeps provider details at one narrow boundary and avoids a bespoke backend or generic integration framework.

[`ADR-CONTACT-INQUIRY-PIPELINE`](../decisions/contact-inquiry-pipeline.md) records the accepted architecture and [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/active/contact-inquiry-pipeline.md) owns delivery. Verified account/configuration, storage, retention enforcement, processor and transfer facts, professional legal/privacy review, staged inbox delivery, deletion, and production smoke evidence remain explicit gates. A first-party/serverless endpoint with Resend and EmailJS remain rejected launch alternatives and migration candidates only through new governance.
