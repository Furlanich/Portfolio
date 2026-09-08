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
