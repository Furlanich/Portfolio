---
id: REVIEW-SPF-ACCEPTANCE-V1
type: acceptance-record
status: PROPOSED
related:
  - REVIEW-SPF-TASK-8-2026-10-12
  - REVIEW-SPF-W6-2026-10-13
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
last_verified: 2026-10-14
---

# Services, Projects and Footer v1 acceptance

Acceptance evidence for [PLAN-SPF-V1](../../plans/active/services-projects-footer-v1.md), assembled by Task 10 from the receipts. Every verdict below is copied from the receipt it links; where a receipt says OPEN, this record says OPEN, and no result of one kind (prototype, software regression, hardware) stands in for another. This record stays **PROPOSED** until the owner's final acceptance is recorded (see [Closeout](#closeout)).

## State at closeout

- **Delivered.** Tasks 1 to 9 are human-merged. The ten PR-sized packets, their corrections and the checkpoint records are listed under [Delivery](#delivery). The last code change merged is [PR #139](https://github.com/Furlanich/Portfolio/pull/139).
- **Checkpoints.** W0 to W6 passed (W5 on a rerun, with disclosed load-sensitive failures). W7 ran on merged `main` at `77ccb9f1` and **passed** ([W7 receipt](w7-checkpoint.md)); its figures are in [Measured values](#measured-values-and-the-w7-checkpoint).
- **Live policy.** `CONNECTED_LIVE_POLICY` is `{ wide: false, compact: false }`. Both tiers are off, so every connected page is the static page. The wide tier is not enabled because the desktop candidate run did not reliably meet the active-scroll frame-interval budget (see [OD-4 sheet](#od-4-sheet)). No hardware or screen-reader PASS exists.
- **Not accepted yet.** The owner's manual production review and the owner acceptance items listed under [Open items](#open-items-and-owners) are OPEN. Nothing in this record infers them.

## Receipts

- [Task 1 — governance packaging](task-1.md)
- [Task 2 — shared contracts](task-2.md)
- [Task 3 — project dossier cutover](task-3.md), with the [Task 3/5 receipt corrections](task-3-5-corrections.md)
- [Task 4 — shared Footer and corrections](task-4.md)
- [Task 5 — connected engine](task-5.md)
- [Task 6 — Atlas Services composition, owner-approved transfers and review correction](task-6.md)
- [Task 7 — connected enhancement](task-7.md)
- [Task 8 — matched static posters and responsive project imagery](task-8.md); [corrections following independent review #133](task-8-review-corrections.md); [diagnosis and fix of the seven non-baseline CI failures](task-8-ci-failures.md)
- [Task 9 — production journeys, budgets and cross-page regressions](task-9.md); [hardware and screen-reader protocol with the desktop candidate run](task-9-hardware-protocol.md); [frame-pacing follow-up](task-9-frame-pacing.md)
- [Task 10 — closeout](task-10.md)
- Checkpoints: [W3 handoff](w3-handoff.md) (historical Task 4 startup record), [W3](w3-checkpoint.md), [W4](w4-checkpoint.md), [W5](w5-checkpoint.md), [W6](w6-checkpoint.md); [W7](w7-checkpoint.md), the last checkpoint before the closeout.

## Delivery

| Task | Pull request | Merge commit | Notes |
| --- | --- | --- | --- |
| 1 Governance | [#105](https://github.com/Furlanich/Portfolio/pull/105) | `f9f740d2` | W0 passed. Plan approval [#104](https://github.com/Furlanich/Portfolio/pull/104) |
| 2 Contracts, Ground, harness | [#106](https://github.com/Furlanich/Portfolio/pull/106) | `944a3501` | W1 passed |
| 3 Dossiers and route retirement | [#108](https://github.com/Furlanich/Portfolio/pull/108) | `025b447f` | Correction [#110](https://github.com/Furlanich/Portfolio/pull/110) (`6319c85b`); W2 passed |
| 5 Connected engine | [#107](https://github.com/Furlanich/Portfolio/pull/107) | `f4260439` | Merged before Task 3, against the planned order (recorded in Progress) |
| 4 Shared Footer | [#121](https://github.com/Furlanich/Portfolio/pull/121), correction [#122](https://github.com/Furlanich/Portfolio/pull/122) | `1cfecffb`, `ddc78aed` | W3 passed |
| 6 Atlas Services | [#124](https://github.com/Furlanich/Portfolio/pull/124) | `9279838f` | W4 passed |
| 7 Connected enhancement | [#126](https://github.com/Furlanich/Portfolio/pull/126), expectations [#128](https://github.com/Furlanich/Portfolio/pull/128), job limit [#130](https://github.com/Furlanich/Portfolio/pull/130) | `4da0720e`, `986217fb`, `db816f25` | W5 first RED, then passed on a rerun |
| 8 Posters and responsive imagery | [#132](https://github.com/Furlanich/Portfolio/pull/132), review corrections [#133](https://github.com/Furlanich/Portfolio/pull/133), CI fixes and Linux baselines [#135](https://github.com/Furlanich/Portfolio/pull/135) | `3f880976`, `e5005f0f`, `4d8d726d` | W6 passed |
| 9 Production hardening | [#138](https://github.com/Furlanich/Portfolio/pull/138), frame pacing [#139](https://github.com/Furlanich/Portfolio/pull/139) | `1342232f`, `77ccb9f1` | W7: see below |
| 10 Closeout | the Task 10 documentation PR | recorded in [Task 10](task-10.md) | W8 |

## Requirement to evidence

Columns keep prototype evidence, software regression and hardware acceptance apart. "Software regression" is every automated result (Node tests, Playwright, axe, static-export checks, production measurements); the live-scene specs run on a software renderer (SwiftShader) and prove functional behavior only.

| Requirement area | Task and PR | Software regression evidence | Prototype or inspection evidence | Hardware, device and screen-reader | Verdict, as the receipts state it |
| --- | --- | --- | --- | --- | --- |
| Hierarchy, copy and boundaries (Services) | 6 · [#124](https://github.com/Furlanich/Portfolio/pull/124) | Services spec with JavaScript off (catalogue, three chapters, the complete boundaries including the D05 AI/ERP paragraph), anchors below the App Bar, 320 px / 200% zoom / landscape reflow, hover limits; `services-content.test.mjs`; the W4 and W6 browser matrices ([W4](w4-checkpoint.md), [W6](w6-checkpoint.md)) | The [Task 7 receipt](task-7.md) lists a chapter-composition difference from the Revision 5 reference as an open item for the Task 6 and 8 owner | NVDA with Firefox, VoiceOver on iOS, real browser zoom and physical devices: **OPEN** (OD-4) | Delivered and merged. The owner approved the corrected Windows and Linux Services and Footer captures on 2026-10-10 ([Progress](../../plans/active/services-projects-footer-v1.md#progress)). The Home/Services family-name difference is **OPEN under OD-3**, nothing changed on Home |
| Dossier truth, routes and MPC | 3 · [#108](https://github.com/Furlanich/Portfolio/pull/108), [#110](https://github.com/Furlanich/Portfolio/pull/110) | Fail-closed publication tests; two complete dossiers on each index; the six retired URLs absent from a clean export and **404 on the served export** at root and at `/Portfolio` ([Task 9](task-9.md), production project 50 of 50 at each base path); `verify:static-export` fails on any retired artifact or payload link; fragments and the locale switch | Rendered comparison with the references by the owner is not recorded | Not applicable | Delivered and merged. **Owner acceptance of the Projects and Founder baselines and the Task 3/5 acceptance remain OPEN** ([Task 3](task-3.md) and [corrections](task-3-5-corrections.md), W4 to W6 receipts) |
| Footer, logo and contacts | 4 · [#121](https://github.com/Furlanich/Portfolio/pull/121), [#122](https://github.com/Furlanich/Portfolio/pull/122) | Footer spec and baselines on the Services host; on all fourteen hosts, one banner, one main and one Footer, an ordered heading outline and a keyboard-ordered Footer with visible focus, axe, and the App Bar console scan ([Task 9](task-9.md)); the Home acceptance run unchanged | The owner's rendered approval against both Footer references is in the [Task 4 receipt](task-4.md) | Screen-reader and device checks: **OPEN** | Delivered and merged. The owner's rendered and baseline approval is recorded in the [Task 4 receipt](task-4.md) (2026-10-09) |
| Graph, capability, progress, session and labels | 2 · [#106](https://github.com/Furlanich/Portfolio/pull/106) | The model, labels, controller, session, capability and content suites; the harness registration test; the contracts are the merged declarations | Not applicable | Not applicable | Delivered and merged. Task 8 later extended the controller and types (the live scene's start pose) at the owner's direction; that is recorded in the [Task 8 receipt](task-8.md) |
| Depth, batching and resources | 5 · [#107](https://github.com/Furlanich/Portfolio/pull/107), [#110](https://github.com/Furlanich/Portfolio/pull/110) | The engine suite (batching, disposal, resource counts, projection); the second wide/tablet orbit was added in the correction | SwiftShader inspection screenshots: design evidence only ([Task 5](task-5.md)) | Draw-call and frame acceptance belong to hardware: see Task 9 below | Delivered and merged. **Owner acceptance of the inspection screenshots and tuned constants is OPEN** in the receipt; the owner's later approvals cover the live look (below), not that item |
| Live behavior, labels, interaction, accessibility and fallback | 7 · [#126](https://github.com/Furlanich/Portfolio/pull/126), [#128](https://github.com/Furlanich/Portfolio/pull/128), [#135](https://github.com/Furlanich/Portfolio/pull/135) | The connected runtime, responsive and accessibility specs on SwiftShader; reduced motion, Save-Data, forced colors, no WebGL2, software renderer, module and image failure, context loss, hidden tab, Pause persistence, route changes ([Task 7](task-7.md), [W5](w5-checkpoint.md)); the production project at both base paths | Owner visual acceptance recorded on 2026-10-11, which closes the receipt's open item (b), the motion recordings against `revision5-*-motion.webm` | NVDA/Firefox, VoiceOver/iOS, real zoom and physical devices: **OPEN** (OD-4) | Delivered and merged. **Owner visual acceptance of Task 7 given 2026-10-11**; the Home baseline change was accepted the same day ([W5](w5-checkpoint.md)) |
| Imagery and posters | 8 · [#132](https://github.com/Furlanich/Portfolio/pull/132), [#133](https://github.com/Furlanich/Portfolio/pull/133), [#135](https://github.com/Furlanich/Portfolio/pull/135) | Poster and derivative contract tests, static media cases at six widths and both base paths, eleven visual baselines (Windows approved, Linux adopted from CI) ([Task 8](task-8.md), [CI fixes](task-8-ci-failures.md), [W6](w6-checkpoint.md)) | The live look, start pose and bead | Not applicable | Delivered and merged. **The owner approved the four posters and the eleven Windows baselines, and the live nodes, start pose and bead, on 2026-10-13**; the separate-session review of the #133 corrections is recorded as the owner stated it ([independent reviews](#independent-implementation-reviews)) |
| Cross-browser, responsive, web vitals, base path, live policy and manual regression | 9 · [#138](https://github.com/Furlanich/Portfolio/pull/138), [#139](https://github.com/Furlanich/Portfolio/pull/139) | Production project 50 of 50 at root and `/Portfolio`; the closure, vitals and poster measurements below; the Footer-host regressions; zero-transmission Contact in the browser matrix ([Task 9](task-9.md)); the W7 matrix below | Not applicable | Desktop hardware candidate: the wide tier did **not** reliably meet the active-interval row ([protocol](task-9-hardware-protocol.md), [frame pacing](task-9-frame-pacing.md)); phones, iPhone, NVDA, VoiceOver, hardware WebKit, the compact tier and the hidden-tab checkpoint: **OPEN** | Delivered and merged. The live policy matches the evidence: both tiers off. Manual contrast and real browser zoom were not done in this task (computed contrast and viewport-equivalent zoom are recorded as such) |
| Owning records and human acceptance | 1 and 10 | `docs:check`, `validate` | Not applicable | Not applicable | Task 1: governance merged ([#105](https://github.com/Furlanich/Portfolio/pull/105)). Task 10: this record; the owner's final acceptance is **OPEN** ([Closeout](#closeout)) |

## Measured values and the W7 checkpoint

Lab data from one machine, never field data. Reports are local artifacts and are not committed.

The [W7 receipt](w7-checkpoint.md) records the checkpoint on merged `main` at `77ccb9f1` (every task, including PR #138 and PR #139): **PASS**, with one disclosed first-attempt accessibility failure (two cold-start timeouts; 39 of 39 on an unchanged warm rerun). Software regression evidence, same run:

| Measure | Result |
| --- | --- |
| `npm run validate` | exit 0; 519/519 Node tests; lint 0 errors / 282 existing warnings; 318 Markdown files, 109 IDs, 38 Skills (before Task 10) |
| Static export | 14 routes at `/` and at `/Portfolio`, no project-detail artifact |
| Production project (`connected-production-chromium`) | 50 of 50 at `/` and 50 of 50 at `/Portfolio` |
| Full browser matrix, one worker | 2619 passed, 130 skipped, 0 failed (2749 scheduled); `immersive-chromium` 236 of 236; accessibility 39 of 39 |
| Optional engine closure | 114.4 KiB Brotli (two chunks) on every page and locale, ceiling 120 KiB; none fetched by the shipped policy or any static-preference path |
| Posters | 85.1 KiB wide, 49.3 KiB compact (ceilings 150 and 80 KiB), 87,164 and 50,434 bytes |
| Lab vitals, shipped policy, ten journeys per locale and profile (root) | Services LCP p75 2248 / 548 ms and INP p75 72 / 48 ms (mobile / desktop); Projects 2200 / 824 ms and 64 / 56 ms; layout shift from the enhancement 0 |
| Home regression | lazy runtime 112.1 KiB in two chunks, headroom 7.9 KiB, listeners 529 to 529; whole-page layout shift at most 0.0437 |

**Machine and browsers.** Windows 11 on an Intel Core i3-8100 (four cores) with an NVIDIA GeForce RTX 2060; Playwright Chromium (including the SwiftShader project), Firefox and WebKit for the functional matrix. **Base paths:** `/` and `/Portfolio`, built clean. **Main SHA:** `77ccb9f1`. **Devices:** none beyond this desktop; see the OD-4 sheet.

## OD-4 sheet

Each device and screen-reader item is OPEN with the live policy that OD-4 requires, because the owner deferred hardware evidence on 2026-10-13 and the one desktop candidate run did not pass. The owner also stated on 2026-10-13 that the manual device checks were performed and successful, without a per-item sheet; as the plan's decision of that date directs, that statement is cited here and is not converted into a per-item PASS. The [protocol](task-9-hardware-protocol.md) holds the steps and the recording sheet; its section 7 holds the per-item status.

| Item | Status | Policy consequence |
| --- | --- | --- |
| Desktop hardware, wide and tablet tier | **Not reliably met** on the Core i3-8100 / RTX 2060 candidate: after the pacing fix two of four runs pass the active-scroll frame-interval row (18.1 and 18.6 ms) and two fail (33.3 and 32.0 ms); a second cause in the live scene remains unidentified; the hidden-tab checkpoint needs a manual run | `wide: false` |
| Android phone with four cores or fewer, Chrome (compact tier) | OPEN, not run | `compact: false` |
| iPhone, Safari (compact tier) | OPEN, not run | `compact: false` |
| NVDA with Firefox | OPEN, not run (NVDA is not installed on the machine used); the accessibility-tree dump is a proxy, never a screen-reader result | none |
| VoiceOver on iOS | OPEN, not run | none |
| Live behavior under real browser zoom | OPEN; only a viewport-equivalent layout check was made, and only on the static page | none |
| Hardware live WebKit | OPEN | none |

Measured on the desktop candidate and recorded as evidence, not as acceptance: live-tier lab vitals on the hardware (all 40 journeys live, Pause and Resume completed; Services LCP p75 504 ms and INP p75 32 ms, Projects LCP p75 784 ms and INP p75 40 ms; enhancement shift 0), the warm-cache reuse of the engine chunks, and 362 rendered-pixel contrast samples with the lowest at 5.5:1. See the [protocol](task-9-hardware-protocol.md) for method and limits.

## Owner decisions on record

- OD-1 to OD-4 and PC-1 to PC-7 (2026-10-05): [PLAN-SPF-V1](../../plans/active/services-projects-footer-v1.md#owner-decisions-and-plan-clarifications-2026-10-05).
- 2026-10-10: the corrected Atlas Services and Footer captures approved, both platforms.
- 2026-10-11: Task 7 visual acceptance; the Home baseline change (lazy runtime 112.1 KiB in two chunks, headroom 7.9 KiB, listener count 529).
- 2026-10-12: the browser job limit raised to 75 minutes; Task 8's helper arrangement.
- 2026-10-13: the Task 8 posters and eleven Windows baselines, the live nodes, start pose and bead approved; the #133 corrections reported re-reviewed; manual device checks reported successful and Task 9's hardware evidence deferred; [PR #138](https://github.com/Furlanich/Portfolio/pull/138) merged.
- 2026-10-14: [PR #139](https://github.com/Furlanich/Portfolio/pull/139) merged; the owner decided to leave the second late-frame cause as it is and to proceed to Task 10 and the end of the plan.

## Independent implementation reviews

Recorded as each source states it; a receipt that says "pending" has no review record in this repository unless one is listed here.

- [Task 8 / PR #132, reviewed head `07d1c927`](../services-projects-footer-task-8-review-2026-10-12/index.md): requested corrections (one Standards P2, two Spec P2); the corrections merged as [#133](https://github.com/Furlanich/Portfolio/pull/133). The owner reports GPT-6.1 Sol re-reviewed them (recorded as stated, no separate record supplied).
- Task 7 / PR #126: the owner stated on 2026-10-12 that GPT-6.1 Sol reviewed it (recorded in the [Task 7 receipt](task-7.md#independent-review-recorded-on-2026-10-12) as stated, noting that the pull request shows no GitHub review).
- Task 9 / PR #138: a separate-session review (GPT-6.1 Sol per its own report) returned five P2 findings (one Standards, four Spec), all checked and valid and corrected on the branch; its comments and the replies are on the pull request. A re-review of the corrected head is not recorded.
- Task 9 / PR #139 (frame pacing): **no independent review is recorded**; it merged on its CI result and the owner's decision.
- Tasks 2, 3, 4, 5 and 6 and the Task 3/5 correction: their receipts name review rounds or a pending review; no separate review record other than those receipts is held here.

## Open items and owners

Nothing below is closed by merge, by a passing automated run, or by this record.

| Item | Owner | What closes it |
| --- | --- | --- |
| The owner's manual production review against the reference media and the spec (hierarchy, evidence truth, the field at idle, first scroll, depth and connections, touch, reduced motion, no-JS and fallback, the Footer mark and contacts, keyboard and zoom) | Owner | A recorded approval or the exact rejected discrepancies, each fixed on its owning PR before closeout |
| Task 3 and Task 5 owner acceptance (Projects and Founder baselines and the six Linux adoptions; the inspection screenshots and tuned constants) and the disclosed LOW preflight omission | Owner | An explicit statement per item |
| The Home/Services family-name difference (OD-3: Home copy is a non-goal) | Owner | A decision on wording, as its own change |
| The second late-frame cause in the live scene (a 5% to 21% late-frame rate while scrolling, against about 0% for a trivial canvas) and its fix | Owner decides how deep; Sonnet implements, Sol reviews, the owner merges | A bounded follow-up with a hardware re-run that meets the active-interval row on every run |
| Enabling a live tier | Owner | The [protocol](task-9-hardware-protocol.md) filled on the desktop, the Android phone and the iPhone, then a bounded PR that carries the evidence |
| NVDA with Firefox, VoiceOver on iOS, real zoom, hardware WebKit, the hidden-tab checkpoint | Owner | The protocol's recording sheet |
| Independent review of PR #139 and a re-review of the corrected PR #138 head | Owner | A separate-session review record |

## Closeout

Task 10 records the state above and moves nothing to PASS. [PLAN-SPF-V1](../../plans/active/services-projects-footer-v1.md) is marked COMPLETED and moved to `completed/` only when its gates are PASS or OPEN with their policy and the owner's manual production review is recorded; until then it stays ACTIVE. See [Task 10](task-10.md) for what was checked and what remains.

[Receipt template](../../plans/active/services-projects-footer-v1.md#receipt-template)
