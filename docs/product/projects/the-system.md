---
id: PROJECT-THE-SYSTEM
type: project-evidence-record
status: APPROVED
related:
  - PROJECT-EVIDENCE
  - SERVICE-WEB
last_verified: 2026-09-06
---

# The-System

## Identity and decision

| Field | Decision |
| --- | --- |
| Internal ID / slug | `PROJECT-THE-SYSTEM` / `the-system` |
| Internal/original name | The-System |
| Public name ES / EN | Not approved |
| Relationship | Unknown; repository ownership alone is not a relationship record |
| Maturity | Lab |
| Lifecycle/publication | `BLOCKED-PERMISSION` |
| Disclosure / evidence | Private / implementation-evidence |

This repository was created after the original project audit and is the most substantial newly discovered candidate. It describes a role-playing operations platform. The current source includes authentication and email verification, password recovery, external-auth boundaries, role-playing campaign CRUD, memberships and invitations, subscription/billing abstractions, a Next.js client foundation, tests across backend layers, frontend unit tests, and Docker development dependencies. Many blueprint areas—scene runtime, assets, notes, collaborative behavior, and full product experience—remain scaffolded or planned.

The repository contains tests, but no repository workflow result, current clean-checkout run, deployed demo, production use, business outcome, screenshot, or video was verified in this audit. It may eventually demonstrate `SERVICE-WEB` through authentication, multi-user permissions, workflow automation, and system integration, but it is not publication-ready.

## Permission matrix

| Publication field | Status | Grantor/date | Restriction |
| --- | --- | --- | --- |
| Project name; public description | UNKNOWN | Unknown | Confirm authorship/product relationship before publication. |
| Company/client identity; logo | NOT APPLICABLE/UNKNOWN | — | Do not imply client work. |
| Industry/context | PENDING | Unknown | Generic tabletop role-playing context only after approval. |
| Screenshots; video | NOT AVAILABLE | — | Fresh verified capture required. |
| Workflow/features | BLOCKED | — | Separate implemented behavior from scaffold and blueprint. |
| Architecture details; technology stack | PENDING | Unknown | May support a future detail page, but technology remains secondary. |
| Metrics; testimonial; production confirmation | NOT AVAILABLE | — | Do not publish. |
| Live URL | NOT AVAILABLE | — | None verified. |
| Repository | UNKNOWN | Unknown | Public visibility and account ownership are not sufficient permission evidence; no repository license is recorded. |
| Employee/employer relationship | UNKNOWN | Unknown | Do not state or imply. |

## Required to advance

First record authorship, relationship, and publication rights. If permission is resolved before runtime evidence, reclassify to `BLOCKED-FUNCTIONAL-VERIFICATION`. To clear that gate, run backend and frontend validation from a clean checkout, execute the documented Docker dependencies and migrations, verify one complete multi-user campaign workflow, and capture a sanitized current visual. Only after both gates pass may the item be considered for `READY` or `READY-SUMMARY-ONLY`, without claiming planned scene or collaboration features.
