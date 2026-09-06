---
id: PROJECT-INVENTORY
type: product-record
status: APPROVED
related:
  - PROJECT-EVIDENCE
  - PAGE-PROJECTS
  - PAGE-PROJECT-DETAIL
  - SERVICE-WEB
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
last_verified: 2026-09-06
---

# Project evidence inventory

This directory contains the item-level evidence records governed by [PROJECT-EVIDENCE](../project-evidence.md). A public repository, reachable URL, legacy portfolio entry, or stored screenshot is evidence to audit; none of those facts grants publication permission or proves production delivery by itself.

The approved page, card, detail, imagery, bilingual-language, accessibility, and performance decisions are recorded in [Projects and evidence experience](experience.md).

## Publication decisions

| Project | Relationship | Maturity | Disclosure | Evidence | Publication state | Public card | Detail page | Homepage eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Busesfy](busesfy.md) | unknown | unclassified | private | concept-only | `BLOCKED-PERMISSION` | No | No | No |
| [General Reservation System](general-reservation-system.md) | founder-published; contributor present; no client or production claim | prototype | summary-only | implementation-evidence | `READY` | Yes | No | No |
| [MPC Administración](mpc-administracion.md) | educational group work | prototype | summary-only | implementation-evidence | `READY` | Yes | No | No |
| [ChronoApp / Appointment & Operations](chronoapp.md) | unknown | prototype | private | concept-only | `RETIRED` | No | No | No |
| [Documancer](documancer.md) | unknown; founder-published source | lab | private | implementation-evidence | `PRIVATE` | No | No | No |
| [The-System](the-system.md) | founder-published Laboratory work; no client claim | lab | summary-only | implementation-evidence | `READY` | Yes | No | No |

`Unclassified` is an internal fail-closed state, not a fourth public maturity label. It is used only when the evidence does not support choosing production, lab, or prototype.

Three projects are `READY` for limited, image-free bilingual cards and paired summary-only detail pages: General Reservation System, The-System, and MPC Administración, in that editorial order. Their public scope is restricted to the exact item-level copy, approved conceptual visual, and public repository link recorded on 2026-09-06. `READY` does not upgrade their `implementation-evidence`, establish production or client work, or make them homepage-eligible. `HOME-PROOF` keeps its approved service-and-process fallback.

## Repository discovery disposition

The account-level repository pass also found the following records. They do not become business-facing project candidates merely because they are public.

| Repository | Disposition | Reason |
| --- | --- | --- |
| `Grupo1-Olimpiadas` | Supporting evidence for MPC Administración | Same 2021 educational context; not a separate client project. |
| `AstroLogger` | `FOUNDER-ONLY` | Early-stage logging library; no current functional or commercial evidence audit and authorship history requires confirmation. |
| `Magoria` | `FOUNDER-ONLY` | Early-stage rendering/game-engine work; secondary to the studio offer and dominated by planned capabilities. |
| `Cerridan-RPG-Memory` | `PRIVATE` | README-only, empty repository; concept-only. |
| `computer-science-notes`, `introduction-to-algorithms`, `Taller-Algebra-Lineal` | Excluded | Learning/reference repositories, not delivered solutions. |
| `Portfolio`, `samuelfurlanich.github.io` | Excluded | The current and legacy portfolio sites are not client evidence. |

Any excluded item must re-enter the same evidence and permission audit before publication.

## Current asset audit

| Asset | Size | Disposition |
| --- | ---: | --- |
| `Busesfy.svg` | 9,544,554 bytes | Not approved: permission, capture provenance, represented version, and sensitive-data review are unknown. |
| `MPC-Administracion.svg` | 4,299,449 bytes | Not approved: the detail page uses the separately generated conceptual WebP; original group-image rights and capture provenance remain unknown. |
| `AI-Scheduler.svg` | 3,131,444 bytes | Retire with ChronoApp evidence; it cannot prove the unsupported AI/SaaS claims. |
| `GRS.svg` | 1,693,672 bytes | Not approved: the detail page uses the separately generated conceptual WebP; replace with a fresh capture only after a verified current run. |
| `Documancer.svg` | 1,261,337 bytes | Not approved: represented functionality and capture provenance are unknown. |
| `atlas.svg`, `pulse.svg`, `vertex.svg` | 693, 693, 697 bytes | Unreferenced decorative placeholders with invented product identities; never publish as project evidence. |

The multi-megabyte embedded SVG captures also violate the approved delivery direction. A later implementation may remove unused assets only after its migration/rollback boundary verifies that no approved route depends on them.

## Editorial ordering policy

Ordering is editorial rather than chronological. The launch order is General Reservation System, The-System, then MPC Administración. Rank future additions by commercial relevance, evidence strength, service coverage, disclosure completeness, visual quality, and diversity of demonstrated capability, in that order. Do not rank by repository age, stack size, code volume, technical complexity, or personal preference.

## Launch threshold

- Zero publishable records: do not launch an empty Projects route or expose blocked candidates. Keep the approved homepage proof fallback and direct visitors to Services and Contact.
- One publishable record: lead with one substantial evidence story, followed by the transparency note and inquiry CTA.
- Two or three publishable records: use one editorial grid and show maturity on each card; do not create category sections.
- Four or more records across at least two populated maturity groups: use the approved hybrid structure in `PAGE-PROJECTS`.
- Do not render empty maturity groups.
- Reject filters for launch. Reconsider only at eight or more publishable records, with at least two buyer-useful dimensions that each have meaningful population.

## Experience readiness

| Area | Product | Content ES | Content EN | Design | Evidence | Ready |
| --- | --- | --- | --- | --- | --- | --- |
| Projects index | READY | READY | READY | READY | READY | READY |
| Project cards | READY | READY | READY | READY | READY | READY |
| Production group | READY | DEFERRED | DEFERRED | READY | READY | DEFERRED |
| Laboratory group | READY | DEFERRED | DEFERRED | READY | READY | DEFERRED |
| Prototype group | READY | DEFERRED | DEFERRED | READY | READY | DEFERRED |
| Detail pages | READY | READY | READY | READY | READY | READY |
| Confidential summaries | READY | READY | READY | READY | READY | READY |
| Final CTA | READY | READY | READY | READY | READY | READY |

The three READY item records now contain complete Spanish and English card and detail content, approved repository links, and labeled conceptual visuals. Maturity groups remain deferred because the approved two-or-three-item launch structure is one ungrouped editorial grid, not because evidence is blocked.

The active [Projects / Evidence execution plan](../../plans/active/projects-evidence-experience.md) has completed Task 2 / PR 2 and now satisfies the Task 3 / PR 3 detail gate for these three paired summary-only pages. Homepage integration remains outside that authorization.
