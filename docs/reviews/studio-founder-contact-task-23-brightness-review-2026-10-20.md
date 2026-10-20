---
id: REVIEW-SFC-T23-BRIGHTNESS-2026-10-20
type: independent-implementation-review
status: PROPOSED
related:
  - PLAN-SFC-V1
  - DESIGN-SFC-V1
  - REVIEW-SFC-ACCEPTANCE-V1
  - GOV-KNOWLEDGE
  - GOV-AGENT-USAGE
last_verified: 2026-10-20
---

# Independent review of Task 23 and the Contact brightness decision

**Recommendation: approve the scoped runtime repair and brightness decision, with one nonblocking P3 documentation correction.** No new P1/P2 or specification finding was identified. The two findings from [review PR #167](https://github.com/Furlanich/Portfolio/pull/167) are addressed by different means: Save-Data disposal is repaired in code; Contact brightness is superseded by an explicit owner decision. Both reviewed PRs were OPEN when checked. This report does not imply that their changes have reached main or production.

Reviewed [Task 23 / PR #168](https://github.com/Furlanich/Portfolio/pull/168) at `673d51200f64b8466ce60a313014be5dfe5d3791` (5 files, 2 commits) and [brightness / PR #169](https://github.com/Furlanich/Portfolio/pull/169) at `325378480ee87cb2f41d6c7e21b489d1314b0f65` (3 files, 1 commit). Both share base `e1de0c455a62a0faac1adc1148c0b56bf5280bf0`. Review commands: `git diff e1de0c45...<head>` and `git log e1de0c45..<head> --oneline`. The exact PR #169 patch applies without conflicts to the PR #168 head; combined verification below used that disposable combination, not a merge into either source branch.

This is the independent Codex reviewer of PR #167, with no contribution to either implementation. Agent usage: primary OpenAI Codex GPT-6 (exact provider model identifier/effort not exposed); subagents 0/0 (none). PASS. Both implementer records declare Claude Sonnet 5.5 and zero subagents. Standards and Spec review axes ran inline with degraded isolation under GOV-AGENT-USAGE I-10. The supplied PRs, prior findings, task receipt and design owner replace the absent `docs/agents/issue-tracker.md` as the specification source.

## Standards

### SFC-T23-BRIGHTNESS-01 / P3 — Refresh verification dates in the changed owning records

Targets: [PR #169 design amendment](https://github.com/Furlanich/Portfolio/blob/325378480ee87cb2f41d6c7e21b489d1314b0f65/docs/design/studio-founder-contact-v1.md#L34) and [PR #168 current-system update](https://github.com/Furlanich/Portfolio/blob/673d51200f64b8466ce60a313014be5dfe5d3791/docs/architecture/current-system.md#L249). Both documents retain `last_verified: 2026-10-18`, despite adding the later owner decision or verified runtime behavior. [GOV-KNOWLEDGE, Change protocol](../governance/knowledge-management.md#change-protocol), step 4, requires updating `last_verified` for a material knowledge change; the project-knowledge-maintenance Skill makes the same requirement for changed records.

**Requested correction:** bring each changed record's verification date forward to its actual verification date. Preserve the dated earlier approval and the new 2026-10-20 brightness amendment. This is metadata housekeeping; it does not invalidate the decision or the runtime repair and need not block their human acceptance. No additional actionable documented-standard violation or baseline code smell was identified.

## Spec

No new actionable specification finding.

**SFC-18-22-02 — repair verified on PR #168.** The connection listener checks `saveData === true` and calls the existing `fallBack('static')` path, preserving its disposal, stopped-activation and focused-control semantics. Cleanup removes the same callback. The six new Node regressions execute the real effect for both legacy and profile hosts, including a pending import whose preference changes back before resolution; they fail against the base host and pass against the repair. The new browser cases use the shipped wide policy with only the software-renderer gate opened and exercise an actual App Router transition to another static route. No new engine, policy, storage, content or styling behavior is added.

Fresh served-export checks independently confirmed disposal, no restart and listener cleanup on all five routes in both locales. A focused English Contact Pause control remains focused, becomes `aria-disabled="true"` with "Static background", and is removed after blur. Delayed engine requests on Services/es and Contact/en cannot attach a scene after Save-Data turns on, even when it turns off again before the request completes. A missing `navigator.connection` is safely tolerated in Chromium, Firefox and WebKit under reduced motion. These checks support functional correctness, not hardware qualification.

**SFC-18-22-01 — valid owner supersession in PR #169.** The design owner records the exact owner direction, dates the amendment APPROVED 2026-10-20 and replaces the normative composition clause. Task 14 receives dated retirement notes rather than erasing its historical finding. "Full brightness" means the existing shared Atlas scene/label treatment, retaining its material caps; it does not require raising every material opacity to 1. The runtime, posters and approved visual baselines are untouched, so there is no brightness implementation or recapture to perform under this amendment.

The removed test is an unconditional `assert.fail` marked `todo`, tracking the now-retired multiplier requirement. It never checked rendered opacity or poster pixels and never failed the quality gate. Its removal retires an obsolete requirement marker; it does not discard an effective regression test. The remaining 16 media tests pass, including asset dimensions/ceilings, distinct composition and poster/live projection alignment. No replacement test is required for an unchanged runtime in this documentation decision.

## Continuation for Claude Sonnet 5.5 and the planning authority

1. Correct the two verification-date fields. Keep Task 23's numbering OPEN until the planning authority accepts or renumbers it; the owner's authorization to proceed is recorded, and this review does not assign a new packet number.
2. Correct the PR #169 description's statement that the master plan still contains the Contact opacity multiplier. At the reviewed base, the plan has no Contact-opacity clause. Its `0.35` at [line 127](https://github.com/Furlanich/Portfolio/blob/e1de0c455a62a0faac1adc1148c0b56bf5280bf0/docs/plans/completed/studio-founder-contact-v1.md#L127) is part of the legacy rest-path depth-bow equation and is unrelated. **Do not remove or change that coefficient.**
3. After human merges, update the Task 19 acceptance/status record with these two distinct dispositions and the exact merge SHAs. Preserve the earlier review as dated history; do not restore the opacity TODO or schedule the proposed multiplier/recapture Task 24. Task 23's earlier references to that prospective task should receive a dated disposition at closeout rather than being treated as a fresh implementation instruction.
4. Verify the deployed Save-Data transition on the released build. A source-level PASS and local browser reproduction are not a deployed receipt. Existing wide-tier acceptance/startup-cost exceptions, compact qualification and unrelated manual gates are unchanged.

## Verification

Tests used an app-managed isolated checkout. The PR branches were not modified. Temporary probes, the PR #169 patch and logs are local under `.worktrees/review-sfc-t23-evidence/`; they are not application changes in this review PR.

| Command / scope | Fresh reviewer result |
| --- | --- |
| `npm ci --offline --no-audit --no-fund` | PASS; lockfile/dependencies unchanged |
| `node --test scripts/connected-studio-host.test.mjs` with the new tests and the base host, then restoration to the exact PR #168 host | Intended RED: 60 pass / 6 fail, all six on the new disposal, pending-import or listener-cleanup assertions |
| `node --test scripts/connected-studio-host.test.mjs scripts/connected-studio-media.test.mjs` on unmodified PR #168 | GREEN: 82 pass / 0 fail / 1 existing opacity TODO; host suite 66/66 |
| `node --test scripts/connected-studio-media.test.mjs` after applying the exact PR #169 patch | PASS, 16/16, zero TODOs |
| `npm run validate` on the combined candidate | PASS, exit 0: docs 360 Markdown files / 121 IDs / 38 Skills; 982 tests pass, zero failures/TODOs; lint 0 errors / 282 existing warnings; typecheck and root build pass |
| `npm run verify:static-export` | PASS, 16 routes at `/` |
| Temporary served-export reviewer probe, Chromium 153.0.8010.12 / controlled SwiftShader | PASS: 10 route/locale disposal/navigation/cleanup journeys; one focused-control case; two delayed-import races; three API-absent engine smokes; zero page errors |
| `PLAYWRIGHT_PORT=3483 npx playwright test tests/e2e/connected-studio-runtime.spec.ts --project=immersive-chromium --workers=1 --grep 'Save-Data turns on at runtime\|focused Pause control keeps focus\|reduced motion turned on while live'` | PASS, 5/5, 1.3 minutes: both new cases plus the existing focus/context-loss/reduced-motion regressions |
| `npm run docs:check` with the completed review/index in the clean combined checkout; review diff check | PASS, 361 Markdown files / 122 IDs / 38 Skills; no whitespace errors |

All source, tests, owning-record and receipt hunks were read. No application correction, dependency change, visual-baseline update, threshold change or secret was included in this review branch. The existing module-type, color-environment and Browserslist notices and 282 lint warnings are separate from failures. The existing context-loss browser case also logged the SwiftShader `WEBGL_lose_context extension not supported` notice and passed.

Remote CI is implementation evidence, separate from these reviewer runs: [PR #168 run 39396818734](https://github.com/Furlanich/Portfolio/actions/runs/39396818734) and [PR #169 run 39397617608](https://github.com/Furlanich/Portfolio/actions/runs/39397617608) both passed validate and all four default browser shards at the final check. Both heads still matched the pinned SHAs above and both PRs remained OPEN. Those jobs use `/Portfolio`; they do not replace the reviewer checks above.

Review limits: no new visual approval or hardware timing, no real phone or screen-reader check, no deployed probe, no independent `/Portfolio` rebuild, and no independent rerun of the complete default browser, candidate runtime, axe or visual-baseline matrices. The brightness decision changes no rendered output; baseline adoption and poster recapture are not part of this review. Preserve the implementer's disclosed broader-suite timeout/rerun history as its evidence, not as this reviewer's fresh result.

## Acceptance boundary

| Item | Disposition |
| --- | --- |
| Runtime Save-Data finding | VERIFIED on PR #168; human merge and deployed verification remain separate |
| Contact brightness finding | SUPERSEDED by PR #169's recorded owner decision, subject to human merge of that owning record |
| Held placeholder removal | Appropriate for the retired requirement; effective media coverage remains |
| Verification-date metadata | OPEN P3; nonblocking correction requested |
| Task numbering, acceptance/status closeout and deployment | Planning authority / Samuel; not completed by this review |
| Agent usage | PASS, reviewer 0/0; implementer records 0/0 |

Standards: **1 P3 finding**, stale verification-date metadata. Spec: **0 new findings**. Human review and merge remain with Samuel.
