---
id: ADR-SFC-COMMERCIAL-ATLAS-V1
type: architecture-decision-record
status: APPROVED
date: 2026-10-15
related:
  - RFC-SFC-COMMERCIAL-ATLAS-V1
  - DESIGN-SFC-V1
  - PLAN-SFC-V1
  - REVIEW-SFC-ACCEPTANCE-V1
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-STATIC-LOCALIZED-ROUTING
  - TEST-PLAYWRIGHT
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-10-15
---

# Commercial Atlas for Studio, Founder, Contact and legal pages

## Context

[RFC-SFC-COMMERCIAL-ATLAS-V1](../rfcs/studio-founder-contact-commercial-atlas-v1.md) was approved with Governance PR 1 ([#142](https://github.com/Furlanich/Portfolio/pull/142)). It accepts ten bounded supersessions of earlier requirements and records that the earlier ADRs stay immutable and effective until a new ADR names what replaces them. This is that ADR. [DESIGN-SFC-V1](../design/studio-founder-contact-v1.md) owns the design, and [PLAN-SFC-V1](../plans/active/studio-founder-contact-v1.md) owns the sequencing.

## Decision

1. **Extend the existing connected runtime to Studio, Founder and Contact.** Keep the single direct-Three.js host and engine, extended through immutable route profiles and one pure projection seam. No new runtime library, physics dependency, backend or hosting change. Home stays a separate runtime.
2. **Apply yielding nodes and pinned flexible strings on all five connected routes.** Services and Projects keep their topology, scroll pose, chapter growth, tracers and ambient cadence. Studio, Founder and Contact have no ambient loop and sleep at rest; Contact nodes are fixed.
3. **Activate genuine public inquiry through the retained provider-neutral port and Formspree adapter**, only through a committed commercial release record and an allowlisted build-time endpoint. There is no public or environment-only mode switch. A missing endpoint fails the commercial build; an unavailable runtime never simulates success. Ordinary tests intercept provider traffic.
4. **Add the Terms route pair** (`/terminos/`, `/en/terms/`, ID `terms`) and original professionally reviewed Privacy and Terms disclosures of the actual release. Static export, trailing slashes, the `/Portfolio` base path and the actual 404s of retired project-detail URLs are unchanged.
5. **Stage and release in one step.** Reviewed implementation PRs target the nondeployed `codex/sfc-integration`; one coordinated PR publishes the complete commercial change to `main`. Static commercial release does not depend on hardware tier qualification. The live graph policy stays false until a qualified tier passes its own reviewed enablement.
6. **Freeze the W1 seams in PLAN-SFC-V1 Task 2:** the route and word-binding types, the Ground props, six unpublished poster entries, the editorial plate, scrim and container, the per-page export-requirement modules, the Playwright project partition, sharded CI and a reproducible QA candidate (`scripts/prepare-sfc-candidate.mjs`). Details: [Playwright QA](../testing/playwright.md#plan-sfc-v1-harness-and-qa-candidate).

## Scope of supersession

This ADR supersedes, only within the RFC's bounded table and only as each reviewed checkpoint lands:

- the **demonstration-only** inquiry decision in [ADR-CONTACT-INQUIRY-DEMO-MODE](contact-inquiry-demonstration-mode.md), by a separately gated commercial mode. The testable demo adapter, the zero-transmission test of the demo mode and the no-secret-in-client rule are kept;
- the **two-route limit** and the passive-proximity and rigid-path behavior of [ADR-CONNECTED-STUDIO-PAGE-RUNTIME](connected-studio-page-runtime.md), by the profile extension and the motion change above. Its gates, one renderer per active route, cancellable activation, Pause and context-loss rules, and static fallback are kept.

[ADR-CONTACT-INQUIRY-PIPELINE](contact-inquiry-pipeline.md) (Formspree behind a narrow port) and [ADR-STATIC-LOCALIZED-ROUTING](static-localized-routing.md) are unchanged. The prior ADR files are not edited. Until a checkpoint lands, the deployed site is still the demonstration with both live tiers off.

## Rationale and consequences

The extension reuses measured seams instead of adding a second engine or a backend. Staging on an integration branch lets many human-reviewed PRs merge without publishing a half-finished public contact flow. Consequences: the legal, account, provider-probe, deployment-receipt and hardware gates stay open and owned by the people named in the [acceptance index](../reviews/studio-founder-contact-acceptance-v1/index.md#external-gates-and-owners); the optional engine closure has under 6KiB of headroom against the 120KiB ceiling, so any profile or physics growth is measured early (Tasks 3 and 8); the CI browser job moves from one 52-minute job to four shards.

## Alternatives rejected

Keeping the local demonstration indefinitely, `mailto:` as the form, a custom backend or hosting migration, a new universal runtime or physics library, and a static-only permanent redesign were rejected in the RFC. A static-only result remains a valid fallback release but is not completion of the interactive objective.

## Related RFC

[RFC-SFC-COMMERCIAL-ATLAS-V1](../rfcs/studio-founder-contact-commercial-atlas-v1.md).

## Related product requirements

[PAGE-STUDIO](../product/pages/studio-and-founder.md), [PAGE-CONTACT](../product/pages/contact-and-privacy.md), [PAGE-TERMS](../product/pages/terms-and-conditions.md), [IA-SITE](../product/information-architecture.md).
