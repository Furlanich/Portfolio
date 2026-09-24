---
id: ADR-INDEX
type: adr-index
status: APPROVED
related:
  - GOV-ENGINEERING-LIFECYCLE
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-09-24
---

# Architecture decision records

An ADR records a consequential architectural decision after it is accepted. Use [the template](template.md). Accepted ADRs use `APPROVED` status and remain immutable historical records. A changed decision gets a new ADR whose `supersedes` metadata identifies the earlier record; do not rewrite the earlier decision.

## Approved

- [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](sky-chart-homepage-runtime.md): the Sky Chart star-atlas environment restyle of the Home runtime — full-viewport fixed canvas portaled to `document.body`, `CanvasTexture` sprite text labels with explicit font loading, recede/suspend, and a locale-neutral static poster pair, keeping direct demand-rendered Three.js, the Framer Motion progress boundary and every retained production gate. It removes the derived Azure sculpture from the scene and withdraws the ADR's optional Connection-video permission. It supersedes ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE.

- [`ADR-CONTACT-INQUIRY-DEMO-MODE`](contact-inquiry-demonstration-mode.md): deploy the complete Contact/Privacy experience as a truthful, local-only simulation on the default GitHub Pages project site while retaining the Formspree boundary for separately gated commercial activation.
- [`ADR-CONTACT-INQUIRY-PIPELINE`](contact-inquiry-pipeline.md): Formspree behind a narrow provider-neutral `submitInquiry()` boundary for the static Contact release, with explicit configuration, privacy, abuse, deterministic-test, live-delivery, and rollback gates.
- [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md): explicit Spanish-root and English-`/en/` static route trees, locale-owned layouts/content, typed route equivalence, and GitHub Pages/base-path compatibility for the homepage foundation.

## Superseded

- [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](adaptive-immersive-homepage.md): semantic HTML and static chapter posters first, direct demand-rendered Three.js, the existing Framer Motion progress boundary and one governed native Connection-video surface. It superseded ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE; it is superseded by ADR-SKY-CHART-HOMEPAGE-RUNTIME.
- [`ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE`](progressive-immersive-homepage.md): preserved historical prototype boundary and React Three Fiber 8 candidate; superseded by ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE after prototype review.
