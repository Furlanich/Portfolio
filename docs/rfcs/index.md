---
id: RFC-INDEX
type: rfc-index
status: APPROVED
related:
  - GOV-ENGINEERING-LIFECYCLE
  - ADR-STATIC-LOCALIZED-ROUTING
last_verified: 2026-09-04
---

# RFCs

An RFC is a consequential product or architectural proposal that requires agreement before implementation. Keep the RFC in this directory and use [the template](template.md). Give it a stable ID, an explicit `PROPOSED`, `APPROVED`, or `REJECTED` status, and links to the affected requirements.

## Approved

- [`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](homepage-hero-implementation-boundary.md): approved homepage-foundation delivery boundary. Its minimum product, content, visual, responsive, destination, and migration prerequisites are resolved; canonical-domain selection remains release-blocking, and longer-term hosting and broader design work are deferred.
- [`RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING`](homepage-foundation-static-localized-routing.md): approved in [Governance PR #6](https://github.com/Furlanich/Portfolio/pull/6). It selects explicit locale route trees and locale-specific root layouts for static Spanish root routes and English `/en/` routes while preserving GitHub Pages and build-time base-path compatibility.

Do not create status directories until the number of RFCs or their lifecycle makes the additional structure useful.
