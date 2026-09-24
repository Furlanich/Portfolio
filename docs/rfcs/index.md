---
id: RFC-INDEX
type: rfc-index
status: APPROVED
related:
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - GOV-ENGINEERING-LIFECYCLE
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - ADR-STATIC-LOCALIZED-ROUTING
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
last_verified: 2026-09-23
---

# RFCs

An RFC is a consequential product or architectural proposal that requires agreement before implementation. Keep the RFC in this directory and use [the template](template.md). Give it a stable ID, an explicit `PROPOSED`, `APPROVED`, or `REJECTED` status, and links to the affected requirements.

## Approved

- [`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](adaptive-immersive-homepage-production-v1.md): approved C2 Adaptive System Instrument, direct Three.js, one governed Connection-video surface, responsive choreography and measured production gates after review of the throwaway prototype. [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../decisions/adaptive-immersive-homepage.md) records the accepted runtime.
- [`RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1`](visual-identity-immersive-experience-v1.md): approved in [Governance PR #61](https://github.com/Furlanich/Portfolio/pull/61). It selects the Contained Master identity, Precision Assembly visual system, Instrument Sans/Plex Mono typography and one progressively enhanced four-beat homepage scene, with prototype evidence required before production planning.
- [`RFC-CONTACT-INQUIRY-PIPELINE`](contact-inquiry-pipeline.md): approved in [Governance PR #43](https://github.com/Furlanich/Portfolio/pull/43). It selects Formspree behind a narrow `submitInquiry()` adapter for the static-site release after comparing Cloudflare Worker + Resend and EmailJS; [`ADR-CONTACT-INQUIRY-PIPELINE`](../decisions/contact-inquiry-pipeline.md) records the decision and the active plan preserves provisioning, privacy/legal, delivery, and deletion gates.
- [`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](homepage-hero-implementation-boundary.md): approved homepage-foundation delivery boundary. Its minimum product, content, visual, responsive, destination, and migration prerequisites are resolved; canonical-domain selection remains release-blocking, and longer-term hosting and broader design work are deferred.
- [`RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING`](homepage-foundation-static-localized-routing.md): approved in [Governance PR #6](https://github.com/Furlanich/Portfolio/pull/6). It selects explicit locale route trees and locale-specific root layouts for static Spanish root routes and English `/en/` routes while preserving GitHub Pages and build-time base-path compatibility.

Do not create status directories until the number of RFCs or their lifecycle makes the additional structure useful.

## Proposed Sky Chart visual system

- [RFC-SKY-CHART-VISUAL-SYSTEM-V2](sky-chart-visual-system-v2.md): proposed Sky Chart Home and App Bar redesign (a navigator's star atlas environment, atlas-plate and plotting-sheet materials, a floating chart-header App Bar, and the new HOME-IMPACT section). It lists nine PROPOSED supersessions of DESIGN-VISUAL, DESIGN-IX-A11Y and IMMERSIVE-HOME-V1.1 boundaries and requests the owner's gate G1 decision from [PLAN-SKY-CHART-HOME-REDESIGN-V2](../plans/active/sky-chart-home-redesign-v2.md). Direction evidence: [REVIEW-SKY-CHART-DIRECTION-2026-09-23](../reviews/sky-chart-direction-2026-09-23/index.md). No implementation is authorized by this RFC.

## Proposed marketing decision closure

- [RFC-MARKETING-NARRATIVE-CLOSURE](marketing-narrative-closure.md): proposed cross-page narrative, evidence discovery and demonstration presentation. D01, D02, D04, D05, D06 and D07 have explicit human approval recorded in their owners; D03 is REJECTED, so its baseline remains effective and this RFC stays PROPOSED. The original review authorized no implementation, plan or new ADR. The owner subsequently authorized the completed [PLAN-MARKETING-PRESENTATION-EXCELLENCE](../plans/completed/marketing-presentation-excellence-v1.md) for accepted groups under Route B; no new RFC/ADR is needed. D03 dependencies stay excluded and RFC status does not change.
