---
id: REVIEW-SPF-W5-2026-10-11
type: checkpoint-receipt
status: PROPOSED
related:
  - PLAN-SPF-V1
  - REVIEW-SPF-ACCEPTANCE-V1
  - REVIEW-SPF-W4-2026-10-10
  - DESIGN-SPF-V1
  - GOV-AGENT-USAGE
last_verified: 2026-10-12
---

# W5 checkpoint — 2026-10-11

**Checkpoint result: the first run on `4da0720e` was RED; the fresh rerun on `986217fb` (merged `main` with #127 and #128) is PASS with disclosed load-sensitive failures (see [Fresh rerun](#fresh-rerun-on-986217fb)).** The rest of this section and Findings 1–4 record the first run. Fresh post-merge evidence for the [W5 checkpoint](../../plans/active/services-projects-footer-v1.md#wave-checkpoints) shows one cause with three consequences (Findings 1–3) and, once the first was worked around in a separate fix branch, a fourth finding the cause had hidden: a Home measurement regression (Finding 4). [PR #126](https://github.com/Furlanich/Portfolio/pull/126) made the localized Services and Projects links end in `#site-top`, and three checks that live outside Task 7's write set still expect the bare path. Everything else passed. Per the plan, a red checkpoint opens a fix task owned by the task whose paths contain the defect, and the next wave (W6 / Task 8) stays locked until a fresh green W5. No source, assertion, timeout, retry or baseline was changed to obtain a result. This receipt stays PROPOSED pending its independent review and human merge.

## Source and execution

Source: merged `main` / `origin/main` at `4da0720ed846965d44a5520de6f86e2954228165`, fetched before execution and again after it (unchanged). [Task 7 PR #126](https://github.com/Furlanich/Portfolio/pull/126) merged at that commit on 2026-10-11T12:19:32Z. Its `validate` check passed on head `e21e210a`; its `browser` check is recorded as `CANCELLED` and never completed, so the browser matrix was not green before merge. (`gh pr checks` printed `fail` for that check after 45 minutes; the status rollup says `CANCELLED`. This receipt does not claim a cause.)

A new clean detached worktree was created from that commit at `.worktrees/spf-w5-checkpoint`. Tracked status was empty before a fresh locked `npm ci`. Conditions: Windows, root base path for everything except the `/Portfolio` export, `PLAYWRIGHT_PORT=3305`, no external server, no export-serving override and no CI retry setting. After the matrix the only tracked change was `next-env.d.ts`, which `next dev` regenerates.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`); subagents 0/0. `SINGLE_AGENT`, run with `superpowers:executing-plans`. This session did not implement or review Task 7; it ran the checkpoint at the owner's request.

## Fresh checkpoint commands

Logs stay under the ignored `.superpowers/` workspace.

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0 |
| `npm run validate` | Exit 0: docs 309 Markdown files / 106 IDs / 38 Skills; 472/472 Node tests; lint 0 errors / 282 existing warnings; typecheck and clean root build PASS |
| Root `npm run verify:static-export` | Exit 0; 14 routes at `/` |
| `npm run test:a11y` | Exit 0; 24 passed (W4: 14; Task 7 added its connected-studio accessibility spec) |
| `npm run test:e2e -- --project=immersive-chromium --workers=1` | Exit 0; 225 passed, 15.8 minutes (W4: 176; the difference is Task 7's connected-runtime coverage in this project) |
| `npm run measure:immersive` | **Exit 1** (see Finding 1). No Home metric was produced |
| Clean `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` | Exit 0 after removing only this worktree's `.next` and `out` |
| `/Portfolio` `npm run verify:static-export` | Exit 0; 14 routes at `/Portfolio` |
| `npm run test:e2e -- --workers=1` | **Exit 1**: 2140 passed / 130 skipped / **20 failed** (2.6 hours) |
| Isolated rerun of the 20 failing specs (all six projects that ran them, `--workers=1`) | 154 passed / **8 failed** (10.1 minutes). The 12 other originals passed (Finding 3) |

Pass condition from the plan: "Connected runtime spec green; Home measurement unchanged within its recorded tolerance." The connected-runtime spec passed in `immersive-chromium` (225/225). The one full-matrix failure in it (`connected-studio-runtime.spec.ts:531`, label overlap at 1440px) passed in isolation and in the 225/225 run. **The Home measurement did not run**, so the second half of the condition is unverified, not met.

## Findings

**Finding 1 — `measure:immersive` cannot complete (stale script expectation).** `scripts/measure-immersive-production.mjs:245` clicks the header "Servicios" link and then calls `page.waitForURL('**/servicios/')`. The link now resolves to `/servicios/#site-top`, so the wait times out after 30 seconds (`TimeoutError`, log `w5-measure-immersive.log`). Cause: `lib/foundation-navigation.ts:22` appends `#site-top` to the Services and Projects links (commits `0cb28c8f`, `e21e210a` in PR #126). The script was last changed in sky-chart Task 11 and is outside Task 7's write set and under the MEASUREMENT lock.

**Finding 2 — two Home specs assert the old Home links (8 deterministic failures).** `tests/e2e/immersive-home-static.spec.ts:154` (Spanish and English, `chromium-desktop`) and `tests/e2e/smoke.spec.ts:91` (Spanish and English, `chromium-desktop`, `firefox-desktop`, `webkit-desktop`) expect Home's links to be `/servicios/`, `/proyectos/`, `/en/services/` and `/en/work/`, and receive the same paths with `#site-top`. They failed in the full matrix and again, identically, in the isolated rerun. Neither spec file contains `site-top`. Both files are outside Task 7's write set.

**Finding 3 — 12 failures were load-induced and passed in isolation.** `webkit-desktop`: `connected-studio-footer.spec.ts:359` (30-second timeout) and `:461`, `connected-studio-navigation.spec.ts:415` (two cases), `home-sections.spec.ts:229`, `smoke.spec.ts:104` and `:115`. `mobile-chromium`: `connected-studio-navigation.spec.ts:20`. `mobile-webkit`: `contact.spec.ts:103` (two cases) and `:118`. `immersive-chromium`: `connected-studio-runtime.spec.ts:531`. All passed in the isolated rerun. W4 had 0 failures in its full matrix, so a recurrence of WebKit timeouts at this volume deserves attention. No cause beyond the observed pattern (single-worker, 2.6-hour run, pass in isolation) is claimed.

Notices, distinct from failures: existing vendored-script lint warnings, the module-type warning, a stale Browserslist notice, reduced-motion and software-renderer console notices.

**Finding 4 — with the wait corrected, `measure:immersive` shows a Home regression (found after the checkpoint run, on the fix branch).** The same script, on the same machine, at pre-Task-7 `9279838f` (two runs, with the corrected wait applied temporarily to that detached worktree and restored afterwards) and at `4da0720e` plus the PR #128 change (three runs):

| | `9279838f`, 2 runs | `4da0720e` + PR #128, 3 runs |
| --- | --- | --- |
| Lazy runtime Brotli (gate ≤ 120 KiB) | 108.1 KiB, one chunk | 112.1 KiB, two chunks (2.4 + 109.7), all 3 runs |
| Headroom (working target 15 KiB, owner-accepted floor 6 KiB) | 11.9 KiB | 7.9 KiB, all 3 runs |
| Listeners after traversal → after remounts (gate: growth ≤ 2) | 520 → 522, 520 → 522: pass, pass | 525 → 529, 525 → 529, 528 → 529: fail, fail, pass |

Headroom fell by 4.0 KiB deterministically; the 120 KiB gate and the 6 KiB floor still pass. The listener count settles at 529 in every current run (no monotonic growth), but higher than before (522) and later: whether the gate passes depends on how many of the new listeners exist when the traversal sample is taken. A later measurement on the fix branch (nine remounts) found the count reads 528 after the first Services visit and 529, flat, from the second: the growth is the one-time establishment of the connected host's listeners, not a per-visit leak, and the gate's single warm-up sampled it too early. The remount loop now visits Services, which carries Task 7's host, whereas at `9279838f` it did not. Per the plan's pass condition ("Home measurement unchanged within its recorded tolerance") this is a failure: the headroom changed and the listener gate is unstable. Logs: `w5-measure-immersive.log` (checkpoint run, wait timeout) and, under the same ignored workspace, `fix-measure.log`, `cur-measure1.log`, `cur-measure2.log`, `base-measure1.log`, `base-measure2.log`.

## Required fix task

### Stale expectations (fix PR open)

Owner: Task 7 (its change introduced the new link shape). [PR #128](https://github.com/Furlanich/Portfolio/pull/128) (draft, `codex/spf-7-site-top-expectations`) updates only the three expectations, under the owner's 2026-10-11 choice of a separate fix PR for them:

- `scripts/measure-immersive-production.mjs` (the `waitForURL` at line 245 only);
- `tests/e2e/smoke.spec.ts` (the Home link assertion at line 91);
- `tests/e2e/immersive-home-static.spec.ts` (the Home link assertion at line 154).

Verified on that branch with the unchanged tests as the RED: both Home specs on every project that runs them, `--workers=1`, 82 passed; `npm run validate` exit 0 (472/472, lint 0 errors). The branch is not merged and does not make W5 green (Finding 4).

### Home regression (baseline accepted by the owner)

Finding 4 was resolved by owner decision, not by a code fix: the owner accepted the new baseline (see Owner decisions), and PR #128 changes only the gate's warm-up. No root-cause task is open; the 6 KiB headroom floor and the growth threshold were not touched.

After both, W5 must be rerun fresh on merged `main`: `npm run measure:immersive` passing (its Home figures compared with the values recorded in the [sky-chart acceptance record](../sky-chart-acceptance-v2/index.md) and the script's own gates), the two Home specs on all projects, and the full matrix, since the failures above were found only there. Until then the Task 7 locks (CONNECTED-HOST, CONNECTED-GROUND) are not released and Task 8 stays locked.

## Serial lock ledger

At the first run no lock was released. After the passing rerun (see below) the dispositions are in that section.

## Acceptance

Source/isolation, the agent-usage audit and the evidence below the RED finding are accurate as recorded. The first run's checkpoint was not accepted; the rerun below supersedes it. Still OPEN: the screen-reader, real-zoom and physical-device checks the owner performs under OD-4; independent acceptance of the Task 6 correction and of Task 7; the OD-3 Home/Services wording difference; full Task 3/5 owner acceptance; and final SPF acceptance. Both live tiers stay false. Publish as draft until independent review and human merge.

## Owner decisions on 2026-10-11

- **Home baseline accepted (Finding 4).** In answer to the readiness evaluation the owner accepted the new baseline: the lazy runtime at 112.1 KiB Brotli in two chunks (2.4 KiB and 109.7 KiB), headroom 7.9 KiB (above the owner-accepted 6 KiB floor), and a listener count that settles at 529 where it settled at 522 at `9279838f`. Later checkpoints and Task 9 compare Home against these figures, not the `9279838f` ones. The 120 KiB gate, the 6 KiB floor and the growth threshold of 2 are unchanged.
- **Gate warm-up.** Accepting the baseline leaves the relative listener gate flaky (2 of 3 runs failed) unless its method changes. The count reads 528 after the first Services visit and 529, flat, from the second (nine remounts measured at `4da0720e`), and the gate warmed up with one remount. [PR #128](https://github.com/Furlanich/Portfolio/pull/128) warms up three. That is a measurement-method change in a frozen script, made under this acceptance; the growth threshold of 2 is untouched. Evidence on that branch: 4 of 4 runs pass (529 → 529), and a listener injected on every remount (temporary mutation, reverted) still fails the gate (532 → 537). A first attempt that waited for the count to settle before sampling did not work and was dropped.
- **Task 7 visual acceptance** was given and is recorded in the [Task 7 receipt](task-7.md#owner-visual-acceptance-on-2026-10-11).

This does not make W5 green. W5 stays RED until a fresh run on merged `main` (after #127 and #128) passes every command, including `measure:immersive` against the accepted baseline. The browser CI job's 45-minute limit (it was cancelled on #126, #127 and #128, the last two being test- and docs-only) is not addressed here and still needs an owner-authorized `ci.yml` decision before Task 8's Linux baselines can be adopted from CI actuals.

## Fresh rerun on 986217fb

**Rerun result: PASS with disclosed load-sensitive failures, accepted by the owner as it stands on 2026-10-12.** Source: `origin/main` at `986217fb5679fc2cac617a82385372b9b82720e5`, which is `main` after [PR #127](https://github.com/Furlanich/Portfolio/pull/127) and [PR #128](https://github.com/Furlanich/Portfolio/pull/128) merged (the owner merged them, then asked for this run). Note: commit `7ab34de2` (the owner's baseline and visual acceptance, pushed after #127's head) was not in that merge; [PR #129](https://github.com/Furlanich/Portfolio/pull/129) carries it and this section. Clean detached worktree `.worktrees/spf-w5-rerun`, fresh locked `npm ci`, `PLAYWRIGHT_PORT=3307`, started 2026-10-11T22:20:51-03:00, full matrix ended 2026-10-12T00:16:18-03:00. Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`), subagents 0/0, `SINGLE_AGENT`.

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0 |
| `npm run validate` | Exit 0: 472/472 Node tests; lint 0 errors / 282 existing warnings; typecheck and clean root build PASS |
| Root `npm run verify:static-export` | Exit 0; 14 routes at `/` |
| `npm run test:a11y` | **Exit 1: 22 passed / 2 failed** (first attempt). Isolated reruns below |
| `npm run test:e2e -- --project=immersive-chromium --workers=1` | Exit 0; 225 passed, 17.2 minutes |
| `npm run measure:immersive` | **Exit 0; "Immersive production gates passed."** Listeners 529 → 529, headroom 7.9 KiB: the owner-accepted baseline |
| Clean `/Portfolio` build and `verify:static-export` | Exit 0 / exit 0; 14 routes at `/Portfolio` |
| `npm run test:e2e -- --workers=1` | **Exit 1: 2157 passed / 130 skipped / 3 failed** (1.5 hours; the first run had 20 failures) |

**The five failures, and how each resolved.**
- *a11y, two live-scene cases* (`connected-studio-accessibility.spec.ts:59`, Services ES and Projects EN): the first attempt hit a 53-second dev-server recompile (`[Fast Refresh] done in 53422ms`) and a 30-second scene-attach timeout. A second run, started straight after the full matrix, failed the same two cases at the 150-second test timeout (5.2 minutes for the project). A third run, with nothing changed, passed **24/24 in 2.4 minutes**.
- *Full matrix, three cases*: `mobile-chromium` `connected-studio-navigation.spec.ts:20` (English Projects link, a 30-second wait), and `immersive-chromium` `connected-studio-runtime.spec.ts:222` and `:303`. A first isolated rerun, again straight after the matrix, failed two of the three (`:20` and `:303`, the latter a 60-second context teardown). A second isolated rerun, with nothing changed, passed **14/14 in 50 seconds**.
- *Control:* the a11y project at `4da0720e` in the first checkpoint worktree passed 24/24 (2.0 minutes) at the same time of day, on the same machine. The two commits differ only in docs, the measurement script and two Home specs, none of which these cases touch.

Reading: every failure is a SwiftShader live-scene or navigation case with a wait that is tight when the machine is slow (about 20% background CPU from other applications; the runs straight after the 1.5-hour matrix were two to three times slower). They pass cleanly on a quiet machine, and the Task 7 receipt already notes that the live cases take about a minute each under SwiftShader. No cause beyond that observed timing is claimed, and nothing was changed to obtain the green results. Disclosed risk: these specs are load-sensitive, so a loaded CI runner or workstation can fail them. The owner was offered one unchanged full-matrix run with zero failures instead (about 1.5 hours) and chose to accept the rerun as it stands on 2026-10-12.

**Pass condition.** "Connected runtime spec green": `connected-studio-runtime.spec.ts` passed in `immersive-chromium` (225/225) and in isolation, with the two load-sensitive cases above. "Home measurement unchanged within its recorded tolerance": `measure:immersive` passes against the owner-accepted baseline recorded in Owner decisions; against `9279838f` it is changed, by the owner's acceptance.

**Serial lock ledger after the rerun.** Releases take effect at this passing rerun, which the owner accepted as it stands on 2026-10-12. Task 7 releases CONNECTED-HOST and CONNECTED-GROUND. The owner-authorized limited transfers of PR #128 are released: the Services wait in `scripts/measure-immersive-production.mjs` and the warm-up count in the same script, the Home Projects link assertion in `tests/e2e/smoke.spec.ts`, and the Home Services link assertion in `tests/e2e/immersive-home-static.spec.ts`. The SERVICES and PROJECTS page-hook transfers were never exercised. Released paths are not blanket later-task permission.

**Next boundary.** W6 / Task 8 has Task 7 merged and a passing W5. On 2026-10-12 the owner cleared the three items that bore on it: (1) approved raising the browser CI job's limit (cancelled at 45 minutes on #126, #127 and #128), done in [PR #130](https://github.com/Furlanich/Portfolio/pull/130), whose own run will measure the real duration; (2) stated that GPT-6.1 Sol reviewed Task 7 in PR #126, recorded in the [Task 7 receipt](task-7.md#independent-review-recorded-on-2026-10-12); (3) allowed Task 8 to invoke Luna as a helper worker, or a Sonnet 5.5 worker if Luna cannot be invoked. This receipt creates and messages no session.
