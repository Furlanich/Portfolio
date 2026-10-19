---
id: REVIEW-SFC-ACCEPTANCE-V1
type: acceptance-record
status: PROPOSED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - PLAN-SFC-V1
  - DESIGN-SFC-V1
  - RFC-SFC-COMMERCIAL-ATLAS-V1
  - REVIEW-SFC-PLAN-2026-10-14
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PAGE-TERMS
  - GOV-ENGINEERING-LIFECYCLE
  - GOV-AGENT-USAGE
last_verified: 2026-10-18
---

# Studio, Founder, Contact and legal Atlas v1 acceptance

Acceptance evidence for [PLAN-SFC-V1](../../plans/active/studio-founder-contact-v1.md). Each task owns exactly one receipt in this directory. A verdict here is copied from its receipt: where a receipt says OPEN or PENDING, this record says so, and no result of one kind (software, mock, hardware, deployed) stands in for another. The coordinator updates this index only at quiescent checkpoints.

## State

- **Execution authorized, 2026-10-15.** The owner authorized execution in the Claude Code session, waiving the independent re-review gate of plan revision 2 and the Luna assignment of Task 1. See the [Task 1 receipt](task-01.md) for the exact wording, what it does and does not waive, and the rulings.
- **Task 1 (W0) is in review.** Governance PR 1 is [#142](https://github.com/Furlanich/Portfolio/pull/142), open against `main`. Independent review (Reviewer R) posted two findings on 2026-10-15; both were verified and corrected in a follow-up commit (see the receipt). CI and the human merge are pending. Nothing downstream starts until a human merges it and `codex/sfc-integration` is created at the merged SHA.
- **Historical Task 1 checkpoint.** No product code, account, deployment or live setting has changed. The inquiry form stays a local demonstration and the live graph policy stays disabled.

## Current amendment

Task 13 replaces the waiting account/counsel packet with direct contact under the explicit 2026-10-18 owner decision. All older status text is the dated Task 1 checkpoint, not current integration status.

## Receipts

- [Task 1 — Accept bounded governance and coordinated release](task-01.md)
- [Task 16 — Release the coherent redesign and direct-contact legal pages](task-16.md) — Terms pair and host-import fix implemented and verified on the candidate; mobile startup CPU not PASS on some rows (poster cost accepted by the owner), baselines adopted

Receipts for Tasks 2 to 19 are added by their owners.

## Delivery

| Task | Pull request | Merge commit | Notes |
| --- | --- | --- | --- |
| 1 Governance | [#142](https://github.com/Furlanich/Portfolio/pull/142) (open, review corrections pushed; CI and human merge pending) | PENDING | Targets `main`; W0 passes on human merge |
| 16 Release | [#157](https://github.com/Furlanich/Portfolio/pull/157) — draft | PENDING | Targets `main`; desktop startup gate PASS, mobile residual is the owner-accepted poster cost; Windows and Linux baselines adopted; independent review and human merge OPEN; see the Task 16 receipt |
| 13 Direct contact | [#154](https://github.com/Furlanich/Portfolio/pull/154) — draft | PENDING | All affected visual transfers owner-approved on 2026-10-18; local CI repair checks PASS (5 behavior, 40 normal visual comparisons). Full Linux CI: [latest checks](https://github.com/Furlanich/Portfolio/pull/154/checks). Independent review OPEN; see the Task 13 receipt. |

## External gates and owners

The 2026-10-18 owner amendment removes the form and its external prerequisites. [Task 13](task-13.md) records direct-channel implementation. Formspree account checks, counsel decision, provider probe and inbox/deletion receipts are NOT APPLICABLE, not PASS. Earlier Task 1 checklist initiation remains history.

| Gate | Owner | Plan task | Requirement |
| --- | --- | --- | --- |
| Coordinated release and read-only deployed routes/links/disclosure check | Samuel and reviewer | 16,17 | Amended PLAN-SFC-V1; no real send or call |
| Physical desktop/constrained Android qualification | Named operator/device | 15,18 | DESIGN-SFC-V1; missing evidence stays OPEN |
| Ordinary review and human merge | Reviewer R and owner | Each PR | Engineering lifecycle |


## Open items

- Plan revision 2 has had no independent re-review. The owner waived the gate; the waiver does not turn the Opus review's open points into approved ones.
- The plan file still states "execution NOT AUTHORIZED" in its status block and progress table. Only the planning authority may change plan substance; the plan's status text needs that update at the next coordinator checkpoint.
- [DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md) still says the RFC is "pending Governance PR acceptance". Task 1 does not own that file; Task 19 closes it unless the planning authority amends it sooner.
