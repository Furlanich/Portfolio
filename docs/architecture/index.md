---
id: ARCH-INDEX
type: architecture-index
status: APPROVED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
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
last_verified: 2026-10-18
---

# Existing-system documentation

These documents describe the repository as it exists during Stage A. They are evidence for later decisions, not approval of the current implementation as the target architecture.

- [Current system](current-system.md): framework, routing, rendering, content, styling, localization, form, deployment, and repository structure.
- [Current quality findings](current-quality-findings.md): known accessibility, performance, SEO, content, and maintenance risks.
- [Architecture map](../../ARCHITECTURE.md): concise current architecture, approved product constraints, and proposed/open architecture context.
- [Stage B harness design](stage-b-agent-engineering-harness-design.md): approved scope for repository governance and deterministic validation.

The homepage-foundation localized-routing target is approved and delivered under [`ADR-STATIC-LOCALIZED-ROUTING`](../decisions/static-localized-routing.md). The current-system record separates retained legacy material from the merged localized foundation, commercial homepage, and completed Projects cleanup. The complete Services implementation and approved Projects/Evidence target fit that architecture. [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](../plans/completed/projects-evidence-experience.md) owns the completed fail-closed static public-content boundary, conditional route sequence, and legacy cleanup; no RFC or new ADR is required. Broader target architecture remains subject to the [engineering lifecycle](../governance/engineering-lifecycle.md).

## Direct-contact update — 2026-10-18

Task 13 replaces ContactForm with a server-rendered direct-channel surface; no public Contact import reaches the dormant inquiry library/configuration. [ADR-CONTACT-DIRECT-CHANNELS](../decisions/contact-direct-channels.md) supersedes the form/demo/provider activation sections below. No Formspree/counsel gate remains for this release.

## Preserved discovery recommendation — PROPOSED

Incrementally modernize this repository, remain static-first initially, reduce unnecessary client boundaries, and modernize CI later rather than adopt a greenfield rebuild. This is preserved discovery knowledge, not a target-architecture decision. It authorizes no architecture or CI change until a later architecture stage resolves it.

## Direct-contact architecture — APPROVED

The Contact pair uses a shared server-rendered direct-channel surface with no form component or inquiry-mode dependency. Both locales expose the existing WhatsApp/mailto/tel links and localized Privacy/Founder references.

Governance PR #43 and the older inquiry ADRs preserve the historical transport design. Its pure modules/tests remain dormant and are not imported by public Contact. [ADR-CONTACT-DIRECT-CHANNELS](../decisions/contact-direct-channels.md) supersedes their form activation and provider/counsel prerequisites for the current release.
