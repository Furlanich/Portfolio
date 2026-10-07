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

## ADE agent-usage alignment

[`GOV-AGENT-USAGE`](../governance/agent-usage.md) makes one primary agent the default and requires each task's execution mode and agent usage to be visible. Two repository-owned Skills must carry that policy: `architecture-governance` (classification) and `pr-readiness` (the receipt audit). Vendored Skills are not edited; the policy's override register covers them. Both scenarios run inline in one session with zero subagents, as the method above describes, so no independent-subagent run is claimed.

### Baseline — RED

Run on 2026-10-07 against both Skills as they stood on `main` at `d6fbbe2`, before any edit.

**S1.** Scenario: "Classify: implement one Services subsection." Following `architecture-governance` step by step, the output is the classification packet. The route is `DIRECT`, because the work is routine, bounded and inside accepted architecture. The packet fields are Route, Evidence, Requirements, Affected architecture, Required artifact, Implementation boundary, Validation, Unresolved questions and Approval. None of them is an execution mode, a work class or a subagent allowance, and no procedure step asks for one. An agent following the Skill has no prompt to settle that this is `SINGLE_AGENT` / `IMPLEMENTATION` / 0, so the default lives only in `AGENTS.md`. RED: the Skill output contains no execution mode.

**S2.** Scenario: "Check PR readiness on a branch whose receipt reads `Agent usage: primary claude-sonnet-5-5; subagents 4/0 (a1 sonnet research, a2 sonnet research, a3 sonnet implement, a4 opus review)`, for a task whose plan block says `SINGLE_AGENT` with `Subagents Allowed: 0`." Following `pr-readiness`, the procedure reads the diff, traceability, deterministic gates, acceptance criteria and the autonomy boundary. The autonomy boundary names only pushing to `main`, merging, weakening checks, exposing secrets and superseding an ADR. The Failure section lists failing validation, unrelated or unsafe changes, missing traceability and exposed secrets. None of them concerns agent usage, and the expected outputs contain no agent-usage line. With green gates, every criterion is marked PASS and the 4-against-0 overrun goes unreported. RED: the Skill does not report FAIL.

### `architecture-governance` and `pr-readiness` — GREEN

Run on 2026-10-07 after the edits, inline in the same session with zero subagents.

**S1.** Following the edited `architecture-governance` for "Classify: implement one Services subsection", step 5 now selects the Work Class and Execution Mode, and the packet carries a new `Execution` line. The work is bounded, sequential and in one area, so no I-4 field can be filled and the default holds: `Execution: SINGLE_AGENT / IMPLEMENTATION / Subagents Allowed 0`. GREEN.

**S2.** Following the edited `pr-readiness` for the 4-against-0 receipt, step 6 reads the task's block (`SINGLE_AGENT`, allowance 0) and the `Agent usage` line, and reports FAIL on two counts: 4 subagents exceed an allowance of 0, and `a4 opus review` is a reviewer spawned by the implementer. The readiness report carries `Agent usage: primary claude-sonnet-5-5; subagents 4/0 (…)` with FAIL, and the Failure section stops the PR. A receipt reading `subagents 0/0` passes. GREEN.

Both Skills keep descriptions that begin with "Use when". No vendored Skill changed: `npm run skills:check` hashes and `npm run docs:check` pass.
