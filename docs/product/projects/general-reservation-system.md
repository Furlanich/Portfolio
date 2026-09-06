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
| Public name ES / EN | `Gestión de reservas para transporte de pasajeros` / `Passenger transport reservation management` |
| Relationship | Founder-published repository with another contributor; no client, employment, sole-ownership, or production-delivery claim |
| Maturity | Prototype |
| Lifecycle/publication | `READY` |
| Disclosure / evidence | Summary-only / implementation-evidence |
| Primary service | `SERVICE-WEB` |
| Public card / detail / homepage | Yes / No / No |
| Editorial order | 1 |

## Commercial relevance

The implementation addresses reservation operations for passenger transport. The source demonstrates the intended scope of account access, trip and station management, seat availability, reservation creation/cancellation, customer self-service, administration, and CSV station exchange. It is relevant to buyers considering `SERVICE-WEB` for reservation, portal, and operational workflows.

The verified claim is limited to implementation evidence: source, automated test projects, Docker configuration, and a historical successful GitHub Actions run on 2025-12-02 that built, tested, published images, migrated staging, and deployed staging. The exact test count is unavailable because the job logs have expired. This does not establish current runnable behavior, a working public demo, production use, payments, uptime, adoption, support levels, or business outcomes.

`READY` authorizes the limited public card below. It does not upgrade the record to `functional-demonstration` or approve a detail page, visual, demo, production claim, or homepage use.

## Approved bilingual public card

| Field | Spanish | English |
| --- | --- | --- |
| Title | Gestión de reservas para transporte de pasajeros | Passenger transport reservation management |
| Context | Transporte de pasajeros | Passenger transport |
| Maturity label | Prototipo de reservas | Reservation prototype |
| Summary | Implementación de referencia para gestionar recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros. Se publica como evidencia de implementación; no se afirma uso en producción ni un resultado comercial medido. | Reference implementation for managing routes, stations, seat availability, reservations, and passenger self-service. It is published as implementation evidence; no production use or measured business outcome is claimed. |
| Capabilities | Reservas; Disponibilidad de asientos; Portal de pasajeros | Reservations; Seat availability; Passenger portal |
| Evidence signal | Código fuente público | Public source |
| CTA | Ver código fuente | View source |
| Limitation | Demostración pública no disponible; el comportamiento actual no fue revalidado. | No current public demo; current behavior has not been revalidated. |

Approved destination: <https://github.com/Furlanich/GeneralReservationSystem>

## Current condition and limitations

- The documented demo previously returned `404`; it was not restored or reverified in this audit and must not be linked.
- Local startup requires environment configuration, certificates for the HTTPS path, database services, and compose overlays. The documented setup was inspected but not executed successfully in the current audit environment.
- The repository contains unit and integration coverage for authentication, users, trips, stations, reservations, services, and health behavior, but source presence is not a current passing test result.
- Payment UI is commented out; do not claim online payments.
- Seeded/demo credentials and marketing statements in the repository must not be copied into public evidence.
- The stored portfolio SVG has unknown capture date, represented version, and publication provenance. It is not approved.

## Permission matrix

| Publication field | Status | Grantor/date | Restriction |
| --- | --- | --- | --- |
| Approved public title and description | APPROVED | Initiative owner / 2026-09-06 | Exact card scope above; no client, employment, ownership, delivery, or production inference. |
| Client/company name; logo; client identity | NOT APPLICABLE | — | No client relationship is established; do not imply one. |
| Generic industry | APPROVED | Initiative owner / 2026-09-06 | `Passenger transport` only. |
| Screenshots; video | NOT APPROVED | — | Fresh sanitized capture and provenance required. |
| Approved workflow/features | APPROVED | Initiative owner / 2026-09-06 | Limited to the source-backed capability labels and summary above; not current functional verification. |
| Architecture details; technology stack | NOT APPROVED | — | Not needed for the card. |
| Metrics; testimonial | NOT AVAILABLE | — | Do not publish. |
| Live URL | BLOCKED | — | Broken/unverified; do not link. |
| Repository | APPROVED | Initiative owner / 2026-09-06 | Link to the public repository only; no repository-license or ownership inference. |
| Employee/employer relationship | NOT APPROVED | — | Do not state or imply. |

## Approved READY scope and remaining limitations

Publish only the image-free bilingual card above, linking to the public source. A detail page, homepage placement, screenshot, demo, and `functional-demonstration` label remain unapproved. Reconsider those uses only after a clean current run, recorded tests, verified workflows, and authorized current media.
