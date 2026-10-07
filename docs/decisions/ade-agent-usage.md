---
id: ADR-ADE-AGENT-USAGE
type: architecture-decision-record
status: APPROVED
date: 2026-10-07
related:
  - RFC-ADE-AGENT-USAGE-V1
  - PLAN-ADE-AGENT-USAGE-V1
  - GOV-AGENT-USAGE
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-10-07
---

# ADE agent usage: one task, one primary agent

## Context

No repository record governed delegation in the FURLANICH ADE, so Skills, user plugins and harness defaults decided how much fan-out happened. Claude Code allowed nesting depth 3 and 20 concurrent subagents, Codex subagents inherited the user's most capable model, and several Skills and plans required or encouraged subagents for work one agent could finish. The findings are in [the plan](../plans/active/ade-agent-usage-optimization-v1.md#current-state-findings). The proposal is [RFC-ADE-AGENT-USAGE-V1](../rfcs/ade-agent-usage-v1.md).

## Decision

Adopt invariants I-1 to I-10 and the execution-block schema owned by [GOV-AGENT-USAGE](../governance/agent-usage.md):

- One task = one primary agent. The default is `SINGLE_AGENT` with 0 subagents.
- `BOUNDED_MULTI_AGENT` allows 1–3 subagents counted over the whole task, only with every justification field, and never with nesting.
- Parallelism happens between tasks, in separate top-level sessions and worktrees, not inside a task.
- Independent review is a separate session and a gate, never a subagent of the implementer.
- Hard limits live in committed Claude Code and Codex project configuration where the tools support them; the rest is policy, the plan template, the docs validator and the PR receipt.
- This policy outranks any Skill, plugin or harness instruction to delegate. Vendored Skills are not edited.

The owner decided the open choices on 2026-10-07:

| ID | Decision |
| --- | --- |
| D1 | The orchestrator is a coordination-only session; each task starts as its own top-level session. |
| D2 | Codex uses caps only (concurrency 3, no nested delegation). Disabling multi-agent by default is revisited only if a desktop opt-in path is proven. |
| D3 | Claude uses `ask: ["Agent"]` plus denies for `Agent(model:opus)`, `Agent(model:fable)` and `Agent(codex:codex-rescue)`. |
| D4 | SPF Task 8's serial cheaper-model handoff stays as a recorded `BOUNDED_MULTI_AGENT` exception. |
| D5 | Claude subagents default to `sonnet` without `_FORCE`. Codex `default_subagent_model` stays unset and role files set models. |
| D6 | Amended the same day. Tasks 2–7 are implemented by Claude Sonnet. Each PR is reviewed by a fresh independent session, run through the `codex` plugin at its default model. GPT-6 Luna and GPT-6.1 Sol are no longer required, because the plugin cannot call them. |

## Rationale

Delegation multiplies token and credit cost, re-reads context in every agent and adds integration risk, and the work in this repository is mostly localized and sequential. Parallelism between task sessions keeps each context small and each limit meaningful. Treating review as a gate, not a helper, preserves independence without routine fan-out. Configuration is preferred over instruction because Skills that say "MUST spawn" would otherwise win in practice.

## Consequences

- New active plans must carry `execution_policy: ADE-AGENT-USAGE-V1` and per-task execution blocks. The template and validator changes land in Task 3.
- Claude and Codex project configuration lands in Tasks 4 and 5 and applies per checkout. Controls the tools do not honor are recorded OPEN.
- Neither tool caps total spawns, so sequential fan-out is caught only by the receipt's "Agent usage" line (Task 6) and by review.
- Starting each task as its own session moves launch effort to the owner or a launcher.
- Completed plans are unchanged. PLAN-SPF-V1 is exempt by ID and adopts the policy through a dated decision (Task 7).
- No product, design, runtime, dependency or deployment change.

## Alternatives rejected

- **Instructions only.** Skills and harness defaults would still win.
- **Disable multi-agent tooling entirely.** The strongest control, but research and review sometimes benefit from independent perspectives, and the Codex desktop app may offer no opt-in path.
- **Edit vendored Skills.** Breaks `npm run skills:check` hash locks and upstream provenance.
- **Orchestrator-spawned implementers (D1 option B).** Requires depth 2, which defeats the no-nesting control, and grows the orchestrator's context with every task.

## Related RFC

[RFC-ADE-AGENT-USAGE-V1](../rfcs/ade-agent-usage-v1.md), approved when the owner merged its Governance PR.

## Related product requirements

None. This is engineering governance only.

## Date and status

APPROVED on 2026-10-07. An ADR is immutable once recorded. A later change records a new ADR and adds supersession metadata without rewriting historical rationale.
