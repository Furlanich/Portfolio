---
id: REVIEW-SPF-ACCEPTANCE-V1
type: acceptance-record
status: PROPOSED
related:
  - REVIEW-SPF-TASK-8-2026-10-12
  - REVIEW-SPF-PLAN-2026-09-30
  - DESIGN-SPF-V1
  - RFC-SPF-REDESIGN-V1
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - REVIEW-SPF-DESIGN-2026-09-30
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-FOUNDER
  - IA-SITE
  - PROJECT-EVIDENCE
  - TEST-STRATEGY
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-10-12
---

# Services, Projects and Footer v1 acceptance

Acceptance evidence for [PLAN-SPF-V1](../../plans/active/services-projects-footer-v1.md) is recorded by task. This record remains PROPOSED until its approved acceptance and human-merge gates are met.

## Receipts

- [Task 1 — governance packaging](task-1.md)
- [Task 2 — shared contracts](task-2.md)
- [Task 3 — project dossier cutover](task-3.md)
- [Task 4 — shared Footer and corrections](task-4.md)
- [Task 5 — connected engine](task-5.md)
- [Task 6 — Atlas Services composition, owner-approved transfers and review correction](task-6.md)
- [Task 7 — connected enhancement (merged; W5 passed on a rerun)](task-7.md)
- [Task 8 — matched static posters and responsive project imagery (PR open, owner approvals pending)](task-8.md)
- [Task 8 — corrections following independent review #133 (re-review and owner approval OPEN)](task-8-review-corrections.md)
- [Task 8 — diagnosis and fix of the seven non-baseline CI failures (2026-10-13)](task-8-ci-failures.md)
- Task 9
- Task 10

Follow-up record: [Task 3/5 receipt corrections](task-3-5-corrections.md). The task receipts remain subject to their stated owner approvals; this follow-up does not record final acceptance.

## Independent implementation reviews

- [Task 8 / PR #132, reviewed head 07d1c927](../services-projects-footer-task-8-review-2026-10-12/index.md): **request corrections**; one Standards P2 and two Spec P2 findings remain OPEN. The review records reproducible live-composition and projection defects, pending bead approval, and fresh validation. Task 8 owner/baseline/CI/W6 gates remain OPEN.

## Next session

The [W3 handoff](w3-handoff.md) is the historical Task 4 startup record. Task 4 and its correction are now human-merged; the [W3 receipt](w3-checkpoint.md) records PASS on `ddc78aed`, failed attempts/reruns and serial lock releases. Task 6 then merged through PR #124, and the [W4 receipt](w4-checkpoint.md) records PASS on `9279838f`, one cold-start failed attempt and the serial lock releases. Task 7 then merged through PR #126, and the [W5 receipt](w5-checkpoint.md) records the checkpoint as **RED** on `4da0720e` (the `#site-top` link change broke `measure:immersive` and two Home specs outside Task 7's write set), then a fresh rerun on `986217fb` that **passes with disclosed load-sensitive failures**, after [PR #128](https://github.com/Furlanich/Portfolio/pull/128) fixed the expectations and the owner accepted the resulting Home baseline change (Finding 4) on 2026-10-11. Task 8 implementation and review corrections remain open in [PR #132](https://github.com/Furlanich/Portfolio/pull/132); the [correction receipt](task-8-review-corrections.md) records self-verification and the fresh re-review boundary. W6 follows human merge under the existing packet. Overall acceptance stays PROPOSED, with existing manual/final gates OPEN.

[Receipt template](../../plans/active/services-projects-footer-v1.md#receipt-template)
