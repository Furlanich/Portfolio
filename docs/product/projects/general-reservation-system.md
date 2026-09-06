---
id: PROJECT-GRS
type: project-evidence-record
status: APPROVED
related:
  - PROJECT-EVIDENCE
  - SERVICE-WEB
last_verified: 2026-09-06
---

# General Reservation System

## Identity and decision

| Field | Decision |
| --- | --- |
| Internal ID / slug | `PROJECT-GRS` / `general-reservation-system` |
| Internal/original name | General Reservation System |
| Public name ES / EN | Not approved while blocked |
| Relationship | Unknown; the public repository is founder-published and shows another contributor, but ownership/delivery context is not recorded |
| Maturity | Prototype |
| Lifecycle/publication | `BLOCKED-FUNCTIONAL-VERIFICATION` |
| Disclosure / evidence | Summary-only / implementation-evidence |

## Commercial relevance

The implementation addresses reservation operations for passenger transport. The source demonstrates the intended scope of account access, trip and station management, seat availability, reservation creation/cancellation, customer self-service, administration, and CSV station exchange. It is relevant to buyers considering `SERVICE-WEB` for reservation, portal, and operational workflows.

The verified claim is limited to implementation evidence: source, automated test projects, Docker configuration, and a historical successful GitHub Actions run on 2025-12-02 that built, tested, published images, migrated staging, and deployed staging. The exact test count is unavailable because the job logs have expired. This does not establish current runnable behavior, a working public demo, production use, payments, uptime, adoption, support levels, or business outcomes.

## Current condition and limitations

- The documented demo previously returned `404`; it was not restored or reverified in this audit.
- Local startup requires environment configuration, certificates for the HTTPS path, database services, and compose overlays. The documented setup was inspected but not executed successfully in the current audit environment.
- The repository contains unit and integration coverage for authentication, users, trips, stations, reservations, services, and health behavior, but source presence is not a current passing test result.
- Payment UI is commented out; do not claim online payments.
- Seeded/demo credentials and marketing statements in the repository must not be copied into public evidence.
- The stored portfolio SVG has unknown capture date, represented version, and publication provenance. It is not approved.

The broken demo should either be restored and verified end to end or removed from public-facing repository documentation. FURLANICH must not link it while broken.

## Permission matrix

| Publication field | Status | Grantor/date | Restriction |
| --- | --- | --- | --- |
| Project name; public description | UNKNOWN | Unknown | Public repository does not itself grant portfolio publication permission. |
| Client/company name; logo; client identity | NOT APPLICABLE/UNKNOWN | Unknown | No client relationship is established; do not imply one. |
| Industry | PENDING | Unknown | May be described generically only after relationship/copy approval. |
| Screenshots; video | UNKNOWN | Unknown | Fresh sanitized capture and provenance required. |
| Workflow/features | PENDING | Unknown | Limit to behavior reverified at the audited commit. |
| Architecture details; technology stack | PENDING | Unknown | May support a detail page later; technology remains secondary. |
| Metrics; testimonial | NOT AVAILABLE | — | Do not publish. |
| Live URL | BLOCKED | — | Broken/unverified; do not link. |
| Repository | UNKNOWN | Unknown | Public visibility is not publication permission; no license is recorded. |
| Employee/employer relationship | UNKNOWN | Unknown | Do not state or imply. |

## Required to advance

Record authorship and project relationship; run the documented stack from a clean checkout; run and record tests; verify reservation creation, availability changes, cancellation, self-service, and administration; restore or intentionally remove the demo; capture a fresh sanitized screenshot or video; and approve the permission matrix and bilingual copy. Only then may evidence be upgraded to `functional-demonstration`. A detail page additionally requires enough permitted context beyond the repository summary.
