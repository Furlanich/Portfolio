---
id: TEST-SKILL-VALIDATION
type: testing-guidance
status: APPROVED
related:
  - SPEC-FRONTEND-TESTING-CAPABILITY-HARDENING
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-08
---

# Frontend Skill validation

This record tests discovery and boundaries for project-authored frontend Skills. Vendored upstream content is validated separately by `npm run skills:check` and the Skill quick validator.

## Method and limitation

The repository Skill-writing method calls for baseline and forward scenarios. Independent subagent pressure tests were unavailable in this execution environment, so no such run is claimed. RED evidence uses the checked-in pre-Skill instructions; GREEN evidence uses manual scenario execution plus deterministic metadata, link, and provenance checks.

## Frontend implementation baseline — RED

Scenario: “Substantially revise a public FURLANICH homepage section while preserving approved design and localization.”

Before `frontend-implementation`, agents could separately discover:

- `architecture-governance` for classification;
- `visual-qa` for rendered judgment;
- `pr-readiness` for the final Pull Request boundary.

No repository Skill connected the complete required path: read authoritative product and design records, apply Taste below repository authority, select tests before production code, enforce observed RED/GREEN TDD, preserve static localized architecture, run Playwright and axe checks, perform a post-implementation Taste/visual audit, run complete verification, and finish through `pr-readiness`. That omission is the baseline failure this Skill must correct.

## Playwright QA baseline — RED

Scenario: “Verify a responsive navigation change across the approved browser matrix, including `/Portfolio` base-path behavior, keyboard operation, axe, console errors, screenshots, traces, and cleanup.”

Before `playwright-qa`, the repository had executable browser scripts but no discoverable project Skill routing an agent through route selection, server ownership, base-path setup, proportionate projects, failure evidence, and cleanup. `visual-qa` covered human inspection, but it neither owned automated browser behavior nor defined the Playwright boundary.

## Visual QA upgrade baseline — RED

Scenario: “Judge a rendered existing route against `DESIGN-VISUAL` after its browser checks pass.”

The existing `visual-qa` Skill allowed any reliable browser tool and correctly required honest evidence, but it did not prefer the now-standard Playwright harness or explicitly state that repeatable behavior checks and design judgment are separate required concerns. The upgrade must add that boundary without turning visual QA into an E2E procedure.

## Scenario matrix

| Scenario | Expected discovery | Boundary |
| --- | --- | --- |
| Implement a new approved public route | `frontend-implementation` | `architecture-governance` still classifies unresolved or consequential architecture first. |
| Substantially redesign a public component | `frontend-implementation` | Repository design overrides Taste; visual approval is not inferred. |
| Change responsive primary navigation behavior | `frontend-implementation` and `playwright-qa` | `visual-qa` remains responsible for judgment against approved design. |
| Audit an existing route without changing it | `visual-qa`; Taste may support critique | Do not invoke the implementation workflow or authorize redesign. |
| Change only product or design documentation | `project-knowledge-maintenance` | No frontend implementation workflow. |
| Change a pure Node utility with no public UI effect | `test-driven-development` | No frontend-specific Skill. |
| Update a development dependency with no UI behavior | applicable governance/testing guidance | No frontend implementation workflow solely because the repository is a frontend project. |

## Forward results

Forward results are recorded after each project-authored Skill is created or modified. A result must state which authoritative records and sibling Skills were discovered, what stayed out of scope, and which commands verified structure.

### `frontend-implementation` — GREEN

Manual execution of the baseline scenario now routes first to the owning product record, `DESIGN-VISUAL`, `DESIGN-IX-A11Y`, the architecture map and accepted decisions. It places `design-taste-frontend-v1` below those authorities, requires test selection before production code and observed RED/GREEN TDD, preserves static/localized constraints, invokes Playwright and accessibility checks, separates post-implementation Taste/visual judgment, applies verification-before-completion, and ends at `pr-readiness`.

The Skill does not activate for the documented audit-only, knowledge-only, Node-only, or dependency-only scenarios. Its role is orchestration; it does not duplicate TDD, Playwright, visual QA, debugging, verification, or PR-readiness procedures.

### `playwright-qa` — GREEN

Manual execution of the responsive-navigation scenario now discovers the repository scripts and named projects, normalizes `NEXT_PUBLIC_BASE_PATH`, assigns server ownership and cleanup, selects a proportionate engine/viewport matrix, requires keyboard and console checks, separates axe automation from manual assessment, and routes screenshots, video, and traces into ignored failure evidence. It delegates RED/GREEN discipline and failure diagnosis to their dedicated Skills instead of reproducing them.

Its trigger excludes audit-only visual judgment, Node-only tests, documentation-only changes, and static-artifact verification. `visual-qa` remains the design-judgment owner; `verify:static-export` remains the generated-artifact owner.

### `visual-qa` upgrade — GREEN

Manual execution of the existing-route audit scenario now prefers Playwright for reproducible browser state and evidence while retaining comparison against approved requirements as its sole decision boundary. It explicitly distinguishes automated browser behavior from visual judgment and states that neither result substitutes for the other.

Both Skills passed the repository quick validator and `npm run docs:check`. Independent subagent discovery was unavailable and remains unclaimed.
