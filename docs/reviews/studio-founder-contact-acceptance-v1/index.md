---
id: REVIEW-SFC-ACCEPTANCE-V1
type: acceptance-record
status: APPROVED
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
last_verified: 2026-10-20
---

# Studio, Founder, Contact and legal Atlas v1 acceptance

Acceptance evidence for [PLAN-SFC-V1](../../plans/completed/studio-founder-contact-v1.md). Each task owns exactly one receipt in this directory. A verdict here is copied from its receipt: where a receipt says OPEN or PENDING, this record says so, and no result of one kind (software, mock, hardware, deployed) stands in for another.

## State — closed 2026-10-20 on the owner's acceptance

- **Execution authorized, 2026-10-15.** The owner authorized execution in the Claude Code session, waiving the independent re-review gate of plan revision 2 and the Luna assignment of Task 1. See the [Task 1 receipt](task-01.md).
- **Delivered.** Tasks 1 to 18 and the remediation packets 20 to 23 are human-merged into `main` (PRs #142 to #171); `codex/sfc-integration` has no commit that `main` lacks. The [Task 19 receipt](task-19.md) holds the PR and merge table, the criteria verdicts, the rulings and the follow-up packets.
- **Owner acceptance, both tiers.** The wide tier is live and is **PASS by owner acceptance, the 30-run hardware collection waived; it is not a measured qualification** ([Task 15](task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19)). On 2026-10-20 the owner first amended the interactive target to the wide tier only (the [Task 19 receipt](task-19.md) keeps that step as history), then said they had manually tested the compact live scene on a phone, with screen readers, and asked for compact to be enabled. [Task 25](task-25.md) did so: `CONNECTED_LIVE_POLICY` is `{ wide: true, compact: true }`. That is an **owner attestation** with no tool, device, date or per-item result recorded; no constrained-phone run was collected and no sheet of the [manual protocol](manual-acceptance-protocol.md) was filled.
- **Direct contact.** The 2026-10-18 amendment removed the form and the Formspree and counsel gates. Those gates are NOT APPLICABLE, not PASS. Contact keeps full scene and label brightness (owner decision, 2026-10-20).
- **Reviewer R and the human merge of the Task 19 PR are OPEN.**

## Receipts

- [Task 1 — Accept bounded governance and coordinated release](task-01.md)
- [Task 2 — Freeze interfaces, shared surfaces, export ownership and CI](task-02.md)
- [Task 3 — Establish early performance and critical-route baselines](task-03.md), with [risk baseline](risk-baseline.md)
- [Task 4 — Pure projection, profiles and inertial physics](task-04.md)
- [Task 5 — Harden inquiry transport (dormant)](task-05.md)
- [Task 6 — Studio Atlas](task-06.md)
- [Task 7 — Founder Atlas](task-07.md)
- [Task 8 — Pooled flexible paths and early closure](task-08.md)
- [Task 9 — Legal template and canonical drafts](task-09.md)
- [Task 10 — Contact behavior](task-10.md)
- [Task 11 — Cached input, projection and lifecycle](task-11.md)
- [Task 12 — Contact integration and five rendered profiles](task-12.md)
- [Task 13 — Direct contact](task-13.md)
- [Task 14 — Static posters and release costs](task-14.md)
- [Task 15 — Hardware qualification tooling and the wide-tier record](task-15.md), with the [hardware protocol](hardware-protocol.md)
- [Task 16 — Coherent redesign and direct-contact legal pages](task-16.md)
- [Task 17 — Deployed direct contact and disclosures](task-17.md), with [release checkpoint](release-checkpoint.md) and [operations](operations.md)
- [Task 18 — Enable the wide tier](task-18.md)
- [Task 19 — Close knowledge and acceptance](task-19.md)
- [Task 20 — Contact Pause-control layout shift](task-20.md)
- [Task 21 — Decorative labels out of reading masks](task-21.md)
- [Task 22 — Contact words and Pause clearance](task-22.md)
- [Task 23 — Runtime Save-Data disposal](task-23.md)
- [Task 25 — Contact label repair; compact tier enabled on the owner's acceptance](task-25.md)
- [Task 26 — Candidate CI job](task-26.md)
- [Task 27 — Manual acceptance round: protocol and automatable evidence](task-27.md), with the [manual acceptance protocol](manual-acceptance-protocol.md)

Historical, retired by the 2026-10-18 amendment: [legal review](legal-review.md) and [processor readiness](processor-readiness.md).

Independent reviews: [Tasks 18 and 22](../studio-founder-contact-tasks-18-22-review-2026-10-19.md) and [Task 23 with the Contact brightness decision](../studio-founder-contact-task-23-brightness-review-2026-10-20.md). Task 24 was never created (see Task 23).

## Delivery

The complete pull request, merge commit and receipt table is in the [Task 19 receipt](task-19.md#delivery). The release PRs are #157 (Task 16, merge `5d8055a3`) and #164 (Task 18, merge `317467b2`).

## External gates and owners

| Gate | Owner | State |
| --- | --- | --- |
| Coordinated release and read-only deployed routes/links/disclosure check | Samuel and reviewer | PASS (Tasks 16, 17); no real send or call |
| Physical desktop qualification | Named operator/device | PASS by owner acceptance (waived collection); not a measurement |
| Constrained Android qualification | Owner | Enabled on the owner's manual-testing attestation (2026-10-20, Task 25); **no measured run exists** |
| Screen-reader and phone checks | Owner | Closed on the owner's attestation (Task 27 rows 5 to 11); no sheet filled |
| Formspree, counsel, provider probe, delivery and deletion receipts | — | NOT APPLICABLE (2026-10-18 amendment) |
| Ordinary review and human merge | Reviewer R and owner | Done for Tasks 1 to 23 and 26 to 27; OPEN for the closeout PRs |

## Open items

The follow-up packets proposed in the [Task 19 receipt](task-19.md#follow-up-packets-proposed-none-authorized-or-started) were all started at the owner's request: Task 25 (compact), Task 26 (candidate CI job, merged) and Task 27 (manual acceptance protocol, merged).

- **Firefox and WebKit timing: OPEN.** Only functional activation and a headless, loaded-machine interval run exist ([Task 27](task-27.md)); the owner's statement did not cover timing.
- **No measured evidence for the compact tier or the screen-reader and phone checks.** They rest on the owner's attestation. A measured collection would need rework of `scripts/measure-connected-studio-hardware.mjs`, which still expects a runtime candidate (the live-policy candidate was retired by Task 25).
- Task 7 R1: a PDF MIME mapping in `scripts/serve-static-export.mjs`, outside that packet's owned paths, merged through human-reviewed PR #148. Recorded as a deviation; the owner may close it at the merge of the Task 19 PR.
- Plan revision 2 never had its independent re-review; the owner waived the gate on 2026-10-15, which does not turn the Opus review's open points into approved ones.
- Legal sufficiency is never inferred from this record.
