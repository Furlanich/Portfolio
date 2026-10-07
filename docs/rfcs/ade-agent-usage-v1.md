---
id: RFC-ADE-AGENT-USAGE-V1
type: request-for-comments
status: APPROVED
related:
  - GOV-ENGINEERING-LIFECYCLE
  - PLAN-ADE-AGENT-USAGE-V1
  - PLAN-TEMPLATE
  - PLAN-SPF-V1
  - ADR-ADE-AGENT-USAGE
  - GOV-AGENT-USAGE
last_verified: 2026-10-07
---

# ADE agent usage v1: one task, one primary agent

## Context

The FURLANICH ADE runs work through Claude Code and Codex. It uses repository Skills, vendored third-party Skills, user-level plugins and the ADE v2 plan mechanics: task/PR packets, waves, locks, receipts and independent review. Those mechanics come from the [Sky Chart plan](../plans/completed/sky-chart-home-redesign-v2.md#24-sequential-integration-procedure) and [PLAN-SPF-V1](../plans/active/services-projects-footer-v1.md#model-routing). The [current-state findings](../plans/completed/ade-agent-usage-optimization-v1.md#current-state-findings) map every layer.

## Problem

No repository record governs agent delegation. Several things decide how much fan-out happens instead:

- Skills: Impeccable critique requires two subagents, Impeccable craft spawns producers "one per card", and `improve-animations` fans out up to 8.
- User plugins: superpowers subagent-driven-development, and the "proactive" `codex:codex-rescue`.
- Harness defaults: Claude allows nesting depth 3 and 20 concurrent subagents. Codex subagents inherit `gpt-6.1-sol` at high effort.

Plans also delegate within tasks. The SPF orchestrator spawned its implementers as subagents, and its packets permit a mid-task handoff to Luna. Neither project config limits depth, concurrency or subagent model. The result is avoidable token and credit spend, and that spend buys no gain in quality.

## Requirements

- Default: one task = one primary agent, `SINGLE_AGENT`, 0 subagents.
- Exception: `BOUNDED_MULTI_AGENT`, 1–3 subagents counted over the whole task. It needs a subagent count, why single-agent is insufficient, independent responsibilities, file/workstream boundaries and a cost justification. A missing field means `SINGLE_AGENT`.
- No recursive delegation. The primary agent integrates and runs the final validation.
- Work classes: `IMPLEMENTATION` (strictest), `RESEARCH`, `REVIEW`.
- Parallelism happens at the task/PR level, in separate top-level sessions and worktrees.
- Prefer configuration-level enforcement over instructions where the tools support it.
- Preserve strict TDD, acceptance criteria, file-scope isolation, validation gates, independent review, RFC/ADR governance and human merges.

## Proposed approach

Adopt invariants I-1 to I-10 and the execution-block schema as written in the [plan's target policy](../plans/completed/ade-agent-usage-optimization-v1.md#target-policy-and-invariants). Then put them into effect through seven single-agent PRs:

1. This Governance PR.
2. One owning governance record, `GOV-AGENT-USAGE`, an ADR, and short pointers in `AGENTS.md` and the lifecycle.
3. A plan template that defaults to `SINGLE_AGENT`, and docs-validator enforcement for new active plans. PLAN-SPF-V1 is exempt by ID.
4. Claude Code project controls: spawn depth 1, 3 concurrent subagents, default subagent model `sonnet`, `ask` on every `Agent` spawn, denies for the Opus/Fable tiers and `codex:codex-rescue`, and a read-only specialist agent.
5. Codex project controls: 3 concurrent threads, no nested delegation, and a role file with an explicit model.
6. Repository-owned Skill alignment: `architecture-governance` selects the execution mode, and `pr-readiness` audits agent usage.
7. A dated PLAN-SPF-V1 adoption decision for its remaining tasks.

The independent PR reviewer is a separate session. It is a gate, not a subagent of the implementer, and does not count against the allowance. Vendored Skills are not edited. The owning record overrides their delegation instructions.

## Alternatives considered

- **Instructions only.** Cheapest to write. Rejected, because Skills that say "MUST spawn" and harness defaults would still win in practice.
- **Disable multi-agent tooling entirely.** The strongest control. Rejected as the default, because research and review sometimes benefit from independent perspectives, and the Codex desktop app may offer no opt-in path. D2 keeps it open as a fallback.
- **Edit vendored Skills.** Rejected. It breaks `npm run skills:check` hash locks and upstream provenance.
- **Keep orchestrator-spawned implementers (D1 option B).** Rejected. Depth would have to be 2, which defeats the no-nesting control, and the orchestrator's context would grow with every task.

## Trade-offs

- An `ask` gate on every Claude spawn adds human friction, and it may stall unattended runs. That is intended: a blocked spawn is recorded as OPEN, never bypassed.
- Neither tool caps total spawns, only concurrent ones. Sequential fan-out is caught by the receipt's "Agent usage" line and by review, not by configuration.
- Starting each task as its own session moves launch effort to the owner or a launcher. In exchange, each session has its own limits and contexts stay small.

## Migration and implementation impact

- Completed plans stay unchanged.
- PLAN-SPF-V1 is exempt from the new validator by ID and receives a dated adoption decision. Its approved packets, model routing, locks and independent review gate are preserved.
- New active plans must carry `execution_policy: ADE-AGENT-USAGE-V1` and per-task execution blocks.
- Configuration applies per checkout. Worktrees cut before Tasks 4 and 5 merge keep the old behavior until they rebase.
- User-level `~/.claude` and `~/.codex` files are not changed. The owning record documents optional operator settings.
- No product, design, runtime, dependency or deployment change.

## Risks

See the [plan's risks](../plans/completed/ade-agent-usage-optimization-v1.md#risks). The main ones:

- Configuration keys have been confirmed in documentation but not yet live-probed. Tasks 4 and 5 probe them and record OPEN for any key that is not honored.
- Codex is an alpha build.
- The desktop apps may behave differently from the CLIs.
- User-level plugins remain active outside the repository.

## Unresolved questions

None at the decision level. The owner decided D1–D6 on 2026-10-07; see the status below. The open technical facts are the semantics of Codex `max_depth`, whether the `ask` rule prompts in auto/bypass modes, and whether each setting is honored in the desktop apps. Tasks 4 and 5 resolve them by measurement.

## Recommendation

Approve this RFC and [PLAN-ADE-AGENT-USAGE-V1](../plans/completed/ade-agent-usage-optimization-v1.md) with the owner decisions below. Then record the accepted policy as `ADR-ADE-AGENT-USAGE` and `GOV-AGENT-USAGE` in Task 2.

## Status

The owner accepted the plan's recommendations for every [decision D1–D6](../plans/completed/ade-agent-usage-optimization-v1.md#owner-decisions-d1d6):

| ID | Decision |
| --- | --- |
| D1 | Coordination-only orchestrator; each task is its own top-level session |
| D2 | Codex caps only (concurrency 3, no nesting); revisit disabling by default if a desktop opt-in path is proven |
| D3 | Claude `ask: ["Agent"]` plus denies for `Agent(model:opus)`, `Agent(model:fable)` and `Agent(codex:codex-rescue)` |
| D4 | SPF Task 8's serial Sonnet→Luna handoff stays as a recorded `BOUNDED_MULTI_AGENT` exception |
| D5 | Claude default subagent model `sonnet` without `_FORCE`; Codex models set per role file |
| D6 | Amended 2026-10-07: Claude Sonnet implements Tasks 2–7, and a fresh independent session reviews every PR through the `codex` plugin at its default model. GPT-6 Luna and GPT-6.1 Sol are no longer required, because the plugin cannot call them. (Original D6: docs tasks Luna or Sonnet, Tasks 3–6 Sonnet, reviewer GPT-6.1 Sol.) |

**APPROVED, 2026-10-07**, when the owner merged the Governance PR (#111). Task 2 records the decision as [ADR-ADE-AGENT-USAGE](../decisions/ade-agent-usage.md) and the owning policy as [GOV-AGENT-USAGE](../governance/agent-usage.md).
