---
id: REVIEW-SFC-TASKS-18-22-2026-10-19
type: independent-implementation-review
status: PROPOSED
related:
  - PLAN-SFC-V1
  - DESIGN-SFC-V1
  - REVIEW-SFC-ACCEPTANCE-V1
  - GOV-AGENT-USAGE
last_verified: 2026-10-19
---

# Independent review of SFC Tasks 18 and 22

**Recommendation: correct the two live-runtime specification gaps below before closing Task 18.** Task 22's word-binding and Pause-placement changes address its two stated defects. Standards: no additional actionable finding. Spec: two P2 findings, both **OPEN**. This review records findings; it changes no application behavior, baseline, approval, tier policy or plan status.

Reviewed [Task 18 / PR #164](https://github.com/Furlanich/Portfolio/pull/164) at `c1a44ccb35553c4dc4b1731712e72f2806d6944d` and [Task 22 / PR #165](https://github.com/Furlanich/Portfolio/pull/165) at `d588d35560f0f2abb5435d50fb886e01c344db72`. Both share base `0d01fa52205e359744d62d2b402293ef721a412b`; commands: `git diff 0d01fa52...<head>` and `git log 0d01fa52..<head> --oneline`. Task 18 has 18 changed files / 9 commits; Task 22 has 13 changed files / 6 commits. Both PRs are human-merged; the combined review target is `317467b23ccfc5b22f89aff99381eb5128ac9982`, which includes Task 22's merge before Task 18's merge.

This is a separate top-level OpenAI Codex review session with no contribution to either implementation. Agent usage: primary OpenAI Codex GPT-6 (exact provider model identifier and effort are not exposed); subagents 0/0 (none). PASS. Both implementer receipts declare Claude Sonnet 5.5 and subagents 0/0; no contrary evidence was found. The code-review skill ran its Standards and Spec axes inline, with degraded isolation under GOV-AGENT-USAGE I-10. The repository has no `docs/agents/issue-tracker.md`; the supplied PRs, task packets, receipts and owning design specification provide the review basis directly.

## Standards

No additional actionable documented-standard violation or baseline code smell was identified. The policy, seam, fixture and test updates have a coherent purpose. Task 18 explains its necessary write-set extensions; both PRs preserve static export, bilingual content, dependencies, Home source and the compact tier's disabled state. Task 22's compact baseline adoption has an explicit owner approval in its final receipt.

The [Task 15 owner acceptance](studio-founder-contact-acceptance-v1/task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19) waives the 30-run hardware collection for wide only. The [Task 18 receipt](studio-founder-contact-acceptance-v1/task-18.md#the-static-cost-of-the-host-blocks-the-pr-owner-decision) explicitly accepts the host's startup cost, including costs paid by visitors who remain static. These are accepted exceptions, not new review findings or measured qualification. They do not waive the Contact opacity requirement or runtime preference handling. Compact qualification and physical-device/manual checks remain OPEN in their owners; the existing intermittent compact label overlap stays with that disabled tier's follow-up.

## Spec

### SFC-18-22-01 / P2 — Apply Contact's required opacity before treating its live composition as complete

Activation targets: [Task 18's host seam](https://github.com/Furlanich/Portfolio/blob/c1a44ccb35553c4dc4b1731712e72f2806d6944d/components/connected-studio/atlas-live-host.tsx#L25) and [Task 22's corrected English bindings](https://github.com/Furlanich/Portfolio/blob/d588d35560f0f2abb5435d50fb886e01c344db72/app/(en)/en/_content/contact.ts#L7). [DESIGN-SFC-V1, Composition data](../design/studio-founder-contact-v1.md#composition-data) requires: "Contact multiplies scene/label opacity by 0.35."

The enabled Contact scene uses the shared full-strength Atlas materials, and [the label layer](https://github.com/Furlanich/Portfolio/blob/317467b23ccfc5b22f89aff99381eb5128ac9982/components/connected-studio/ConnectedStudioEnhancement.tsx#L342) assigns `0.62 + 0.38 * depthScale` without a Contact multiplier. Its canvas and label ancestors supply no compensating opacity. On the clean production export at 1440×900, the visible `n4/n8` labels have effective opacity **1** in both locales; `n0` is correctly hidden by the introduction mask at rest. Task 22 correctly restores the three labels, but those labels now paint at the same strength as the other Atlas routes. The scene therefore misses the approved quiet Contact treatment when Task 18 takes it live. This is an older candidate omission newly exposed by enablement, not a defect in the new node IDs.

The omission is already explicitly carried by [Task 14](studio-founder-contact-acceptance-v1/task-14.md) and the failing `todo` in `scripts/connected-studio-media.test.mjs`; a green Node exit does not resolve it. That receipt says both Contact posters must be recaptured with the correction. The later poster/baseline approvals do not record a waiver of the multiplier.

**Continuation for Claude Sonnet 5.5:** open a bounded remediation packet through the planning authority. Apply the multiplier exactly once to Contact's scene and decorative labels, preserve their occlusion/handoff behavior and other routes' appearance, and recapture both Contact poster variants consistently. Replace the `todo` with a meaningful regression that detects missing or double attenuation. Verify ES/EN live/static Contact at wide/compact widths and obtain the required approval for changed visual baselines. If the owner intends full brightness instead, obtain and persist that explicit design decision rather than treating the existing omission as approval.

### SFC-18-22-02 / P2 — Dispose the live scene when Save-Data changes at runtime

Activation target: [Task 18's wide policy](https://github.com/Furlanich/Portfolio/blob/c1a44ccb35553c4dc4b1731712e72f2806d6944d/lib/connected-studio/capability.ts#L11). Repair seam: `ConnectedStudioEnhancement`'s preference listeners. [DESIGN-SFC-V1, Touch, rest, masks and lifecycle](../design/studio-founder-contact-v1.md#touch-rest-masks-and-lifecycle) states: "A runtime preference change cancels and disposes live resources."

Save-Data is read before activation, but [the mounted host](https://github.com/Furlanich/Portfolio/blob/317467b23ccfc5b22f89aff99381eb5128ac9982/components/connected-studio/ConnectedStudioEnhancement.tsx#L918) subscribes only to reduced-motion and forced-colors changes. It never subscribes to the Network Information connection's `change` event. The [Save Data API specification](https://wicg.github.io/savedata/) requires that event when this preference changes. An already-live visitor who changes `saveData` to true therefore retains the renderer, labels and active Pause control. On Services/Projects this also retains their ambient rendering. Newly enabled public wide visitors encounter this omission on all five connected routes. Initial Save-Data gating and runtime reduced-motion fallback work; neither covers this transition.

**Reproduction:** before loading an eligible wide route, expose an `EventTarget` as `navigator.connection` with writable `saveData: false`. In a software-rendered functional run set only `allowSoftwareRenderer: true`, leaving the shipped tier policy unchanged. Wait for `[data-connected-live="true"]`, then set `navigator.connection.saveData = true` and dispatch its `change` event. After one second the live canvas remains. A positive control that subsequently enables reduced motion disposes it.

Fresh combined-export result: **10/10 route/locale pairs retain one live canvas after the Save-Data event; 10/10 dispose it after reduced motion is enabled**. Initial Save-Data and compact Contact controls both retain zero canvases. These are successful defect reproductions, not passes of the required Save-Data behavior.

**Continuation for Claude Sonnet 5.5:** add a failing browser case for that transition, then subscribe to the supported connection event and cancel activation/dispose live resources when Save-Data becomes true. Remove the listener on teardown. Preserve the complete poster fallback, the focused static-background control and the existing no-automatic-restart behavior. Cover a change during a delayed engine import as well as after attachment, and ensure later route/locale navigation remains static while Save-Data is true.

## Verification boundaries

The complete diffs, task packets, design requirements, receipts, updated policy tests, measurement gates and four changed compact baselines were inspected. Task 22's shared runtime-spec edit and Task 18's runtime-spec cleanup coexist in the combined source. No baseline was regenerated or adopted by this reviewer.

Remote GitHub evidence: both pinned PR heads have successful `validate` and all four Quality browser shards ([Task 18 run](https://github.com/Furlanich/Portfolio/actions/runs/39344018112), [Task 22 run](https://github.com/Furlanich/Portfolio/actions/runs/39344507370)). These are implementation CI results, not fresh reviewer runs. Ordinary CI runs the default browser family; it does not select the served-export or candidate-only SFC projects.

While this review ran, the implementer opened [PR #166](https://github.com/Furlanich/Portfolio/pull/166), head `80d4080bb53a91dd6f90a1897a54b835f9fb8dc4`, with a documentation-only deployed-smoke receipt. Its description reports all ten wide pages live, complete static fallbacks at entry and the visible Task 22 corrections. That evidence has not been independently repeated here, and PR #166 is outside this implementation diff review. It does not change the opacity or runtime Save-Data findings; the planning authority should consider it during acceptance rather than treating deployed evidence as absent.

Fresh reviewer runs on the combined target, in an app-managed isolated checkout, with Node 24.14.0 and Chromium 153.0.8010.12:

| Command / scope | Result |
| --- | --- |
| `npm ci --prefer-offline` | PASS; an additional offline locked install also passed |
| `npm run validate` | PASS, exit 0: docs 359 files / 121 IDs / 38 Skills; 977 Node tests, 976 pass, 0 fail, 1 existing opacity `todo`; lint 0 errors / 282 existing warnings; typecheck; root build |
| `npm run verify:static-export` | PASS, 16 routes at `/` |
| `PLAYWRIGHT_SERVE_EXPORT=1 PLAYWRIGHT_PORT=3478 npx playwright test --project=connected-production-chromium --project=sfc-production-chromium --project=sfc-production-firefox --project=sfc-production-webkit --workers=2` | PASS, 82 passed / 12 deliberately skipped / 0 failed, 2.4 minutes; Firefox/WebKit skip the six live-only cases each |
| `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build`, then `npm run verify:static-export` with the same base path | PASS, exit 0, 16 routes at `/Portfolio` |
| `NEXT_PUBLIC_BASE_PATH=/Portfolio PLAYWRIGHT_SERVE_EXPORT=1 PLAYWRIGHT_PORT=3479 npx playwright test --project=connected-production-chromium --project=sfc-production-chromium --workers=2 --grep 'shipped policy'` | PASS, 10/10, 33.9 seconds |
| Temporary reviewer browser diagnostic, clean root export, shipped policy and controlled software-renderer allowance | Reproduced both findings; all ten connected route/locale pairs tested; zero page errors; compact and initial Save-Data negative controls passed |
| `npm run docs:check` with the finished review and index in the clean checkout; review diff check | PASS, 360 Markdown files / 122 IDs / 38 Skills; no whitespace errors |

Visual judgment was limited to the four committed Contact compact baselines and fresh Contact first-screen captures: both languages at 1440×900 with keyboard-visible Pause focus, and Spanish at 390×844 under the shipped static policy. The focused wide control's border and ring are complete. The compact introduction backing matches the approved baseline shape, with no horizontal overflow. The live labels' computed opacity is deterministic evidence; composition observations are reviewer judgment, not owner approval. Screenshots, probe JSON, commands and logs remain local under `.worktrees/review-sfc-t18-t22-evidence/`.

Environment attempts, separate from product failures: the initial sandboxed Node run could not create temporary Git repositories; the identical unsandboxed Node run passed. The shared checkout's lint was stopped because it traversed unrelated nested Claude checkouts, and a shared-checkout build failed on stale `.next/dev/types` imports of retired project-detail routes. Verification was repeated in the clean pinned checkout without changing source or weakening checks. Notices include the existing module-type, color-environment and stale Browserslist warnings; installation reported 16 dependency advisories, outside this unchanged-dependency review.

Not rerun by this reviewer: the full default browser family, candidate-only `sfc-runtime` family, standalone axe scans, complete visual-comparison suite, closure/vitals/hardware measurements or the complete three-engine `/Portfolio` family. Controlled SwiftShader behavior is not hardware timing, physical-phone evidence, screen-reader assessment, owner's motion acceptance or a deployed-site smoke. The original plan's qualification history and accepted exceptions are preserved.

## Handoff and acceptance

| Item | Review result |
| --- | --- |
| Task 18 wide enabled, compact disabled; host attached through the seam | Implemented; accepted qualification/startup exceptions remain explicit |
| Task 22 `n0/n4/n8` bindings in both locales | Implemented |
| Task 22 Pause inside the introduction scrim; approved compact baselines | Implemented; no new placement defect identified |
| Contact's specified 0.35 scene/label treatment | FAIL — SFC-18-22-01 |
| Runtime Save-Data disposal | FAIL — SFC-18-22-02 |
| Hardware/manual acceptance and review of the newer deployed receipt | OPEN in the owning records; PR #166 supplies additional implementer evidence |
| Agent usage | PASS, reviewer 0/0 subagents; receipts declare implementer 0/0 |

The planning authority should assign the two findings to bounded packets and link their correction evidence here before Task 19 closes the live objective. Task 22's completed defect fixes can be retained. No automatic rollback, new tier activation, product approval or human merge is authorized by this report.

Standards: **0 findings**. Spec: **2 P2 findings**, Contact opacity and runtime Save-Data disposal. Human review and merge remain with Samuel.
