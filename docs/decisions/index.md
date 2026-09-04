---
id: ADR-INDEX
type: adr-index
status: APPROVED
related:
  - GOV-ENGINEERING-LIFECYCLE
  - ADR-STATIC-LOCALIZED-ROUTING
last_verified: 2026-09-04
---

# Architecture decision records

An ADR records a consequential architectural decision after it is accepted. Use [the template](template.md). Accepted ADRs use `APPROVED` status and remain immutable historical records. A changed decision gets a new ADR whose `supersedes` metadata identifies the earlier record; do not rewrite the earlier decision.

## Approved

- [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md): explicit Spanish-root and English-`/en/` static route trees, locale-owned layouts/content, typed route equivalence, and GitHub Pages/base-path compatibility for the homepage foundation.
