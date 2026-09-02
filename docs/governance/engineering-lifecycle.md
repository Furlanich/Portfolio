---
id: GOV-ENGINEERING-LIFECYCLE
type: engineering-governance
status: APPROVED
related:
  - GOV-KNOWLEDGE
  - ARCHITECTURE-MAP
  - RFC-INDEX
  - ADR-INDEX
  - PLAN-INDEX
last_verified: 2026-09-02
---

# Engineering lifecycle

## Classify before changing

| Change | Required path |
| --- | --- |
| Small, reversible, convention-following | Direct implementation with lightweight in-task plan |
| Substantial, multi-file, risky, or multi-phase | Versioned execution plan |
| Consequential unresolved architecture/product choice | Governance PR containing an RFC before implementation |
| Consequential architecture already accepted | ADR record plus implementation plan as needed |

Consequential choices include routing or hosting architecture, a major UI/styling system, CMS, authentication, server-side backend, major information architecture, design-system architecture, and security-sensitive structural work. Routine implementation does not need an RFC or ADR.

## Pull Request paths

A **Governance PR** contains an RFC and supporting documentation when human agreement is needed before a consequential change. It does not implement that consequential change unless the decision was already approved.

An **Implementation PR** implements approved requirements and architecture. It may add an ADR that records a decision accepted through a prior Governance PR. Every PR remains a human review boundary.

## Traceability

Use existing stable IDs and Markdown links. A substantial change should trace:

```text
Product requirement -> design requirement -> RFC when needed -> ADR when accepted
-> execution plan -> implementation -> test or validation -> Pull Request
```

RFCs, ADRs, plans, commits, test evidence, and PR descriptions should cite the relevant upstream IDs. Link to the owning requirement instead of copying it.

## Autonomy and escalation

Agents may inspect, research, classify, plan, implement approved scope, test, document, self-review, commit, push a task branch, and open a Pull Request. They preserve approved product requirements and immutable ADR history.

Agents escalate through a Governance PR when a consequential product or architecture choice is unresolved. They keep ambiguous product questions **OPEN**. Agents do not merge Pull Requests, push to `main`, bypass a failing gate, weaken a quality gate to pass, silently supersede an ADR, or expose secrets.

## Git and completion

Start from current `main` on a short-lived `codex/` branch. Keep commits focused. Before a Pull Request, review the complete diff, synchronize affected documentation, and run the relevant deterministic checks. A change is ready when approved scope is complete, validation evidence is recorded, no unrelated behavior changed, and the branch is ready for human review.

Recommended `main` protection: require Pull Requests and human review, require deterministic status checks, require conversation resolution where useful, prevent force pushes and deletion, and apply protections to administrators where practical. Repository administrators enable these settings; this document does not change them.
