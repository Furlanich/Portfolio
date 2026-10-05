---
id: REVIEW-SPF-PLAN-2026-09-30
type: independent-plan-review
status: APPROVED
related:
  - PLAN-SPF-V1
  - DESIGN-SPF-V1
  - RFC-SPF-REDESIGN-V1
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
last_verified: 2026-10-05
---

# Independent ADE v2 plan review — Services, Projects and Footer

The owner approved the Revision 5 written design/copy, then explicitly authorized ADE v2 planning and independent review. Codex authored [PLAN-SPF-V1](../plans/active/services-projects-footer-v1.md). A fresh **GPT-6 Luna (`gpt-6-luna`, high reasoning)** agent reviewed it independently under a read-only instruction, without authoring or editing the plan. It read the full plan, approved spec and repository source/testing/governance. The original Codex author alone incorporated corrections. This record preserves historical review evidence. Current revision 5 is APPROVED on 2026-10-05 under the [owner authorization below](#owner-approval-2026-10-05), after the independent round 6 passed; production remains unchanged.

## Round 1 — findings

**Recommendation:** Revise before human approval. **Counts:** BLOCKING 0, HIGH 0, MEDIUM 2, LOW 0.

| ID / severity | Target | Concrete finding | Author disposition |
| --- | --- | --- | --- |
| SPF-PLAN-01 / MEDIUM | Tasks 3, 4, 6, 8 visual write sets | Spec paths used `visual/...` rather than repository paths `tests/e2e/visual/...`. Exact ownership could cause files in the wrong location or tests outside the configured visual project. Reviewer verified existing inventory and `playwright.config.ts` testDir/matches. | **RESOLVED by author:** all four visual write sets now use full repository-relative paths. Existing platform-specific baseline policy retained. |
| SPF-PLAN-02 / MEDIUM | Interface table / Task 2 | Names/signatures were described as an exact handoff but GraphDefinition, ScenePose, SceneGateInput, SceneSnapshot and SceneHandle lacked field-level shapes. Parallel consumers could interpret the contract differently. | **RESOLVED by author:** added minimum typed fields/method arguments/results, explicit units, scheduler/layout/label/diagnostic types, responsive topology resize in one renderer and reference Footer handoff geometry. Task 2 requires independent declaration review/freeze before human merge/W1; dependent agents consume merged types only. |

The reviewer confirmed that the draft covers approved route retirement, protected Footer mark, Home-controller boundary, accessibility/fallback states, performance gates and repeated verified RED → GREEN → REFACTOR evidence. No BLOCKING or HIGH finding was returned. The author also made Task 3 source ownership explicit and removed ambiguous requirement-copy write permission; these are clarifications within the original scope.

## Round 2 — correction verification

The same independent GPT-6 Luna agent inspected the revised full plan, verified both fixes and challenged new risks introduced by the typed declarations. It confirmed the full visual paths, concrete W1 contracts, explicit Footer completion/suspension thresholds and responsive changes within one renderer. It found no new material risks.

**Final recommendation:** Ready for human plan approval. **Unresolved findings:** BLOCKING 0, HIGH 0, MEDIUM 0, LOW 0. Both prior MEDIUM findings are independently verified as resolved. The reviewer made no plan or source edits; the original author incorporated all revisions.

## Round 3 — Sonnet/Luna/Sol routing review

On 2026-09-30 the owner required Claude Sonnet 5.5 for complex reasoning/design, GPT-6 Luna only for low-demand/low-risk/no-design implementation, and GPT-6.1 Sol review for every PR. The author revised the plan and dependent summaries. Rounds 1–2 above remain the historical Luna review of the prior revision.

A fresh **GPT-6.1 Sol (`gpt-6.1-sol`, high reasoning)** agent independently reviewed the full revised plan, approved DESIGN-SPF-V1, historical review, repository instructions/lifecycle, relevant shared-component/Playwright contracts and documentation diff against planning baseline `16ed6132baa73cc1686509bdcd2be8cddd4b8f71`. It made no plan, source or documentation edits.

The reviewer verified Sonnet ownership of Tasks 2–7/9; closed Luna checklists in Tasks 1/10; Sonnet's frozen media-design handoff, mechanical Luna work and serialized lock transfers in Task 8; mandatory Luna routing for separable eligible implementation batches; independent Sol review of every PR/follow-up; and exact-provider verification without an invented Sonnet identifier or availability claim. Dependency waves, ownership/write sets, strict TDD, approved copy/assets, acceptance gates and human merge boundaries remain intact. Overall plan status remains PROPOSED.

**Recommendation:** Ready for human plan approval. **Findings:** BLOCKING 0, HIGH 0, MEDIUM 0, LOW 0. No corrective findings. This is execution-readiness review only; the reviewer performed no UI, hardware, implementation or shell-validation tests. Human approval and W0 still precede execution.

## Round 4 — supplemental review and plan revision 4

On 2026-10-05 the owner asked for a supplemental independent review of revision 3. A fresh **Claude Opus 5.5** session reviewed it read-only against `main` at `5270e32`. It read the full plan, DESIGN-SPF-V1, the IA copy, the lifecycle, the repository Skills, `playwright.config.ts`, the test and baseline inventory and the Sky Chart precedent. The reviewer did not author or edit the plan during the review. This review is supplemental: it does not satisfy the plan's GPT-6.1 Sol gate.

**Recommendation:** NOT READY. **Counts:** BLOCKING 4, HIGH 14, MEDIUM 16, LOW 6.

On 2026-10-05 the owner then decided four open questions (OD-1 Home Founder plate is a non-goal; OD-2 slow-phone handling is a global policy; OD-3 Home copy is a non-goal; OD-4 device and screen-reader gates are owner-executed, with phones static until they pass) and asked for the plan to be reworked. The same session produced revision 4. Because the reviewer then also became a contributor, round 5 must use a fresh GPT-6.1 Sol reviewer.

| ID / severity | Finding | Disposition in revision 4 |
| --- | --- | --- |
| PLAN-REV-001 / BLOCKING | Route retirement breaks the unowned `tests/e2e/accessibility.spec.ts` (retired rows) and possibly `scripts/site-header.test.mjs` (`LanguageSwitch` classes) | Test and baseline ownership inventory; Task 3 owns the retired rows and keeps the classes; Task 3 step 0 inventory search |
| PLAN-REV-002 / BLOCKING | Tasks 3 and 4 were parallel, but the approved Footer copy breaks the Footer assertions in Task 3-owned specs, plus unowned `privacy.spec.ts` and `sky-chart-acceptance.spec.ts` | Task 4 moved to W3 after Task 3; Footer blocks transferred to Task 4; Home acceptance run required |
| PLAN-REV-003 / BLOCKING | Sky Chart records expected SPF to change the Home Founder plate; the plan was silent and stale | OD-1 non-goal; dated corrections in the three records; `last_verified` 2026-10-05 |
| PLAN-REV-004 / BLOCKING | The Skills AGENTS.md requires were absent or deferred to Task 10 | Skills contract with ordered stages; a Skills line in every packet |
| PLAN-REV-005 / HIGH | Task 1 premise was stale (governance package already on `main`) | Task 1 rewritten as a closed list of the remaining edits |
| PLAN-REV-006 / HIGH | Taste preflight placed after GREEN; Taste Skill unnamed | `design-taste-frontend-v1` named; preflight before RED in every UI packet |
| PLAN-REV-007 / HIGH | `review-animations` cannot be model-invoked; Brag misapplied; `emil-design-eng` missing | Direct-read rule; Brag forbidden; comparison against the reference `.webm` files; `emil-design-eng` required |
| PLAN-REV-008 / HIGH | Sonnet prompts ignored Superpowers and Impeccable auto-triggers | Provider execution notes forbid `brainstorming` and `impeccable`; "premium/refinement" wording removed |
| PLAN-REV-009 / HIGH | Prototype source not in the repository | PC-7 and the reference-media table; tuned constants recorded per receipt |
| PLAN-REV-010 / HIGH | Contract could not express the tablet tier | PC-1: `ConnectedTier` and `getTravelScale` |
| PLAN-REV-011 / HIGH | Slow-but-capable phone handling undefined | OD-2: `CONNECTED_LIVE_POLICY` set from evidence |
| PLAN-REV-012 / HIGH | Production spec could not serve `out/` | Task 2 production serving under `PLAYWRIGHT_SERVE_EXPORT=1` |
| PLAN-REV-013 / HIGH | Task 8 needed baselines it did not own | Task 8 owns the Services/Projects snapshots after Task 6 |
| PLAN-REV-014 / HIGH | No defined way to run the Task 5 engine in a browser | Disposable uncommitted inspection route for design only; real draw-call assertion moved to Task 7 |
| PLAN-REV-015 / HIGH | Home copy edits without approved strings | OD-3 non-goal |
| PLAN-REV-016 / HIGH | Wave checkpoints and orchestrator undefined | Checkpoint table W0–W8; orchestrator role and ledger rules |
| PLAN-REV-017 / HIGH | Device and screen-reader gates had no human executor | OD-4: owner executes; Sonnet prepares the protocol; the policy follows the evidence |
| PLAN-REV-018 / HIGH | Base path missing from most tasks | `/Portfolio` builds and runs in Tasks 3, 4, 6, 7, 8 and 9 |
| PLAN-REV-019 to -034 / MEDIUM | Subjective acceptance; label priority; pointer highlight; registration matrix; Ground ownership; Home loss key; Task 9 write breadth; doc sync per PR; Linux baselines and CI; per-task axe; visual matrices; Git Bash base path; `targetFps`; Luna synthesis and in-packet handoffs; Non-goals and Three docs; Footer grouping | Objective acceptance lists; PC-2 to PC-6; registration table; Ground lock chain 2 → 3 → 6 → 7 → 8; read-only Home key; defect-gated fixes; workflow items 6–8; per-task matrices; provider notes; closed fact list for Task 10; Non-goals; `find-docs` in Task 5; PC-4 Footer order |
| PLAN-REV-035 to -040 / LOW | Typos; receipt template; worktree and port rules; poster precedent; watermark opacity owner; review-gate status | Fixed; receipt template added; `.worktrees/spf-<n>` and ports 3200+10n; precedent cited; owner picks opacity; gate reopened |

**Status after revision 4:** the review gate is reopened. A fresh GPT-6.1 Sol round 5 must review revision 4 and find zero BLOCKING issues before the owner approves the plan. `npm run docs:check` passed for the revision.

## Round 5 — final review of revision 4

On 2026-10-05 the owner requested a final review after the Opus revision. Codex inspected revision 4 at `5204592`, the full approved spec/RFC/ADR, current source/test consumers, lifecycle/Skills, governance summaries and deployment triggers. The review made no repository edits.

**Recommendation:** NOT READY. **Counts:** BLOCKING 2, HIGH 0, MEDIUM 1, LOW 0.

| ID / severity | Target | Finding | Correction in revision 5 |
| --- | --- | --- | --- |
| SPF-FINAL-01 / BLOCKING | Task 3 | Services' GRS destination changes, but `marketing-services.spec.ts` retains old ES/EN detail URLs and belongs only to Task 6. | Assign both destination values and the href assertion to Task 3, require root/base-path Services runs, then transfer the whole file to Task 6 after W2. |
| SPF-FINAL-02 / BLOCKING | Live policy, Tasks 7–9 | Initial true values deploy Task 7's live runtime before Task 9 hardware evidence. | Both merged values remain false through Task 8; Task 9 evaluates isolated undeployed candidates without test overrides, restores defaults, enables only evidenced tiers, and rechecks shipped-policy exports. |
| SPF-FINAL-03 / MEDIUM | Task 1 | Status-only edits leave current PROPOSED/REOPENED prose; removing all historical occurrences would rewrite history. | Permit all current status summaries to be synchronized, preserving completed review rounds. |

Fresh `npm run docs:check` and `git diff --check` passed; no implemented behavior or hardware result was claimed. The owner then requested correction, another review, and approval/PR creation only if the plan passes. This correcting session is a contributor, so revision 5 requires a fresh independent reviewer.

## Round 6 — independent review of revision 5

A fresh **GPT-6.1 Sol (`gpt-6.1-sol`, high reasoning)** reviewer inspected the full plan at `f03f3ec` against `main` at `9138941`, its complete five-file correction diff, review history, approved specification/copy/RFC/ADR, Skills/lifecycle, ownership/dependencies, source/test consumers, Playwright registration, measurement precedents and deployment trigger. It made no repository changes and did not contribute to the corrections.

**Initial recommendation:** REVISE BEFORE APPROVAL. **Counts:** BLOCKING 0, HIGH 0, MEDIUM 1, LOW 0. SPF-FINAL-01, SPF-FINAL-02 and SPF-FINAL-03 were independently verified RESOLVED.

| ID / severity | Target | Finding | Author correction |
| --- | --- | --- | --- |
| SPF-FINAL-04 / MEDIUM | Current architecture summaries | `ARCHITECTURE.md` and `docs/architecture/current-system.md` still expected SPF to change the Home Founder plate, contradicting OD-1 and leaving the correction outside the closed packet write sets. | Correct both current sentences with a dated OD-1 link, preserving delivered plate facts and historical approvals. |

Fresh reviewer `npm run docs:check` and base-to-head `git diff --check` passed. Implementation visual/runtime/hardware/phone/screen-reader behavior was excluded because it has not been implemented; absent hardware evidence remains a future gate. Future Sonnet availability remains a dispatch gate, not a verified fact. The same independent reviewer re-reviewed the bounded correction at `d16d909` and verified SPF-FINAL-04 RESOLVED, with no new scope, status or link issue. **Final recommendation:** READY FOR HUMAN PLAN APPROVAL. **Final unresolved counts:** BLOCKING 0, HIGH 0, MEDIUM 0, LOW 0. Fresh reviewer `npm run docs:check` and `git diff --check origin/main..HEAD` passed; the working tree was clean. The reviewer made no file, index or HEAD changes. SPF-FINAL-01 through SPF-FINAL-03 remain resolved.

## Owner approval — 2026-10-05

The owner supplied this conditional authorization in the current Codex chat on 2026-10-05:

> Correct the BLOCKING and MEDIUM issues, and review the plan again. If the plan then passes the review, change it's status to APPROVED and open a PR.

The fresh independent round 6 and its bounded correction verification passed with zero unresolved findings. The stated condition is fulfilled: **PLAN-SPF-V1 revision 5 is APPROVED — 2026-10-05**. This paragraph is the durable approval-source record for Task 1. The final-review PR records approval and corrections; Task 1 still verifies these records, assembles its acceptance scaffold/receipt and obtains the human Governance PR merge before W0. No implementation, W0 checkpoint, hardware acceptance or PR merge is claimed here. Human control of `main` remains unchanged.

## Boundaries and verification

- Independent review evaluates execution readiness, not implemented behavior. No production code, route removal, runtime, baseline update or hardware acceptance was performed in this planning session.
- Required physical-device/cross-browser/screen-reader/production-budget evidence remains an explicit implementation gate in Tasks 9–10. A planned future gate is not an unresolved design decision or a prototype-derived PASS.
- Human plan approval precedes W0; Governance PR and every implementation PR require human merge. This review does not approve the plan on the owner's behalf.
- Final PR review: the independent GPT-6.1 Sol reviewer checked the approval diff at `9cb03ab` read-only and returned BLOCKING 0, HIGH 0, MEDIUM 0, LOW 0. Current APPROVED/PASSED summaries and the owner authorization are synchronized; historical outcomes and implementation gates remain intact.
- Final validation — 2026-10-05: `npm run validate` passed at `9cb03ab` in the clean `.worktrees/spf-final-validation` checkout after a physical `npm ci --prefer-offline`: documentation checks, 291/291 Node tests, ESLint, TypeScript no-emit and the production static build. ESLint had zero errors and 282 existing vendored-script warnings; Node module-type and stale Browserslist notices were non-fatal. The primary-checkout lint attempt scanned unrelated generated `.claude/worktrees`; the clean checkout excludes that local contamination without changing any gate. The initial dependency-junction build attempt was replaced with physical dependencies because Turbopack rejects links outside its project root.
- Final diff scope: seven documentation files only; no app/component/lib/public/script/test/package/config changes. `npm run docs:check` and `git diff --check` pass. Existing application build success is not acceptance of the future SPF implementation; no browser, visual, hardware or screen-reader acceptance is claimed.
