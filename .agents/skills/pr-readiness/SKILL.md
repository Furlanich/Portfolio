---
name: pr-readiness
description: Use when a FURLANICH change is ready for final acceptance review, deterministic validation, self-review, and Pull Request preparation.
---

# PR Readiness

## Purpose

Use this Skill to prepare a FURLANICH task branch for human review at a Pull Request boundary. It produces an evidence-based readiness report; it does not merge work or bypass repository governance.

## Inputs

- The requested acceptance criteria and linked product/design requirements.
- The current branch and its merge-base with `main`.
- Relevant RFCs, accepted ADRs, execution plans, and owning product/design documents.
- The repository validation commands in `package.json` and the applicable `AGENTS.md` instructions.

## Procedure

1. Read the root `AGENTS.md`, [engineering lifecycle](../../../docs/governance/engineering-lifecycle.md), relevant plan, requirements, design records, and architecture map. Confirm the work is within an approved scope; escalate a consequential unapproved change through a governance PR instead of silently approving it.
2. Inspect the complete branch diff against `main`. Review changed files for scope creep, accidental application behavior changes, generated files, secrets, unrelated formatting, and missing tests or documentation.
3. Check traceability from the requirement or design record through the plan, implementation, and validation evidence. Confirm material product, design, architecture, or status changes update their authoritative owner rather than duplicating it.
4. Run the repository's deterministic gates appropriate to the change. Prefer `npm run validate` when it covers the scope; otherwise run the relevant commands individually, including `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` as applicable. Record exact commands, exit results, warnings, and environment notices separately.
5. Review acceptance criteria and unresolved questions. Verify status markers and document links remain coherent, and ensure OPEN decisions remain OPEN. Perform visual QA only when the change affects rendered UI, and label visual observations as judgment-based evidence rather than replacing deterministic gates.
6. Review the autonomy boundary: the agent may commit, push a task branch, and open a PR, but must not push directly to `main`, merge a PR, weaken checks, expose secrets, or silently alter approved requirements or supersede an ADR.
7. Prepare a concise readiness report containing scope, requirement/decision traceability, changed-file review, deterministic validation, visual/judgment-based review (if applicable), risks and unresolved questions, and the recommended PR title/body. Leave the branch ready for human review and do not merge.

## Expected outputs

- A final acceptance checklist with each criterion marked PASS, FAIL, or OPEN and supporting evidence.
- A diff-scope and documentation-synchronization summary.
- Exact validation commands and results, with warnings/notices distinguished from errors.
- Risks, unresolved questions, and any escalation required before opening the PR.
- A PR-ready summary/body that states the autonomy boundary and explicitly leaves merge authority with a human.

## Validation

- Re-run the deterministic commands needed for the scoped change after any fix.
- Re-check the complete `main...HEAD` diff and working-tree status.
- Confirm no generated or secret files are included and that the branch is not `main`.
- If a PR is opened, verify its base is `main`, its head is the task branch, and it remains open for human review.

## Failure and escalation

- Stop and report FAIL when deterministic validation fails, the diff contains unrelated or unsafe changes, required traceability is missing, or secrets are exposed. Fix only within scope; never weaken a gate to make it pass.
- Keep unresolved product, design, legal, accessibility, or architecture questions as OPEN and identify the owning record or governance PR needed.
- Escalate to the human at the PR boundary for consequential decisions, failed checks that cannot be resolved safely, missing approval, branch protection changes, merge, or any request to push to `main`.
