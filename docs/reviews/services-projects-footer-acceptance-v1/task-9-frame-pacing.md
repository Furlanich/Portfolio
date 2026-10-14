Task 9 follow-up – frame pacing of the live scene
Implementer: Claude Sonnet 5.5 (`claude-sonnet-5-5`), a top-level Claude Code (desktop app) session; `SINGLE_AGENT` / `IMPLEMENTATION` / `Subagents Allowed: 0`. No subagent was spawned.   Reviewer: GPT-6.1 Sol in a separate session, plus the owner: **OPEN**.
Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`); subagents 0/0 (none).
Branch/worktree: codex/spf-9-frame-pacing at .worktrees/spf-9-pacing   Base: 1342232f (`main` with PR #138 merged)   Authorization: the owner asked for this fix on 2026-10-13 after PR #138 merged; that is the owner's authorization to touch the Task 7 host path `components/connected-studio/ConnectedStudioEnhancement.tsx`, which the plan's defect-fix rule requires (recorded defect, RED test, a transfer naming the path).
Owned paths touched: `lib/connected-studio/frame-scheduler.ts` (new), `components/connected-studio/ConnectedStudioEnhancement.tsx` (the scheduler moved out and the new one used), `scripts/connected-studio-frame-scheduler.test.mjs` (new), `lib/connected-studio/measurement.ts` and `scripts/connected-studio-measurement.test.mjs` (one helper), `scripts/measure-connected-studio-hardware.mjs` (uses it), this receipt and the hardware protocol document. The controller, the contracts in `types.ts`, the capability policy and every baseline are untouched. `CONNECTED_LIVE_POLICY` stays `{ wide: false, compact: false }`: the candidate edit that enabled the wide tier for the hardware runs was uncommitted, restored (no diff) and its build deleted.

## The defect and what was done

PR #138's hardware run measured an active-scroll frame interval p95 of **34.1 ms against the 20 ms limit** (median 17.5 ms) on an RTX 2060, while the same page scrolled with the scene paused held 16.8 ms. The host waited for the controller's due time with a timer and only then asked for an animation frame, so a timer that landed just after a vsync pushed that frame to the next refresh.

Systematic debugging, in order:

1. **Evidence for the mechanism, in isolation** (a scratch page, trivial work, the host's pattern against an animation-frame-aligned loop, new-headless and headed Chromium on the RTX 2060): the host pattern put 2.2% and 3.8% of intervals over 25 ms (p99 34.4 and 37.5 ms) and delivered only 525 to 559 frames in 10 s; the aligned loop had 0.0% over 25 ms (p99 18.1 and 18.3 ms) and 600 frames.
2. **Design.** The controller already anchors its due time at the start of the render (`lastRenderAt` is read before `render`), so the fix needs no controller or contract change: the host scheduler alone changes.
3. **Refactor first, behavior-preserving:** the scheduler moved to `lib/connected-studio/frame-scheduler.ts` behind injected browser primitives (511/511 Node tests before and after).
4. **RED**, `scripts/connected-studio-frame-scheduler.test.mjs`, a virtual 60 Hz display (vsync clock, timers truncated to whole milliseconds and fired late, 5% of them by 1 to 3 ms) driving the real controller: `active scrolling renders on every refresh and does not depend on how late a timer fires` failed with **20 of 281 active intervals (7.1%) taking two refreshes and p95 33.3 ms** (the hardware's 34.1 ms), and `a render that takes 4 ms does not push the next frame to the following refresh` failed with p95 33.3 ms. Five guard tests passed before and after: the ambient cap (30 fps wide, 20 fps compact) is reached and never exceeded, active cadence is capped at 60 fps on 120, 144 and 240 Hz displays, no callback runs earlier than one millisecond before its due time, a long wait sleeps on one timer, and a stopped scene holds no timer or animation frame.
5. **GREEN.** A short wait is watched from the next animation frame and runs on the first refresh at or within 1 ms (`EARLY_TOLERANCE_MS`) before its due time; a wait longer than 24 ms (`TIMER_LEAD_MS`) sleeps on one timer until 24 ms before it is due, then does the same. The due time stays absolute. Seven of seven pass; `npm test` 518/518, then 519/519 with the cadence helper.
6. **Verification on the hardware** (the same private wide-tier candidate and the same script as PR #138, headed, no override, GPU timers on):

| Run | Active p95 | Median | Renders over 3 traversals | Notes |
| --- | --- | --- | --- | --- |
| PR #138, before | 34.1 ms | 17.5 | 1690 | ambient 20.7 fps |
| PR #138, GPU timers off | 33.9 ms | 17.4 | | not an observer effect |
| after, run 1 | 33.3 ms | 16.8 | 2069 | ambient collapsed to 9 fps (an outlier, see below) |
| after, run 2 | **18.1 ms** | 16.7 | 2432 | |
| after, run 3 | **18.6 ms** | 16.7 | 2381 | |
| after, run 4 | 32.0 ms | 16.9 | 2174 | a 95 ms long task |

## Result: the scheduler defect is fixed, the hardware gate is not reliably met

The scheduler cause is real, reproduced, tested and fixed: the median interval fell from 17.5 to 16.7 ms and 22% to 44% more frames render in the same traversals. Two of four hardware runs now pass the 20 ms row (18.1 and 18.6 ms). **Two of four still fail at about 33 ms, so the wide tier is still not shown to meet the budget** and the policy stays off.

The remaining late frames are a second cause that this PR does not fix. What was established, each step with its evidence:

- **It is the scene, not the machine.** Interleaved in time and scrolled the same way, the live scene had 5.0, 10.6, 21.4, 16.3, 7.9 and 13.4% of intervals over 25 ms (median 10.6%); a trivial one-draw WebGL canvas had 0, 1.3, 0.1, 0, 0 and 0% (median 0). Run alone six times the trivial page held p95 17.0 to 19.8 ms.
- **It is not a one-time cost of the first scroll.** Over four up and four down passes in each of three runs, every pass sat at p95 30 to 33 ms (6 to 21% over 25 ms) with no long tasks (one of 53 ms) and no router requests after the first pass.
- **It is not the main thread.** A Chrome trace of four traversals: the animation-frame callback runs in 0.8 ms (p95 1.3 to 2.3 ms), layout, style recalculation and paint have p95 under 1 ms.
- **It is not any of these, tested one factor at a time across interleaved runs:** the label layer hidden (over-25 per run 60, 43.6, 13.5, 12 against baseline 10.7, 44.9, 47.4, 5.8); antialiasing off (28.4, 44.9, 12.6, 10.2); an opaque canvas (36.5, 45.1, 8.4, 10.9); `backdrop-filter` removed everywhere (15.4, 31.6, 6.6 against 1.2, 36.4, 7.0); a quarter of the pixels (median 8.9% at 800x500 against 10.4% at 1440x900, so not fill-rate bound); and the GPU adapter (only the RTX 2060 exists on this machine, and the scene's own context reports it, despite its `powerPreference: 'low-power'`).
- **The GPU frame time is suspicious.** Timer queries give a p95 of 16.2 to 17.6 ms in every run for a scene of 7 draw calls, about one refresh period, against 4 to 6 ms at ambient. This fits frames that the browser's GPU pipeline completes in more than a refresh; it does not say why.

**Not yet tested, in the order I would try them:** a trace of the GPU and compositor process (the `gpu`, `viz` and `cc` categories) to read frame submission against presentation for a late frame; bisecting by drawable in a scratch build (the seven drawables are points, skeleton, paths, rings, nodes, beads and tracers), because the dynamic ribbon and skeleton buffers are rewritten every frame and a buffer update that waits on the GPU would look like this; and the cost of the command stream on a four-core CPU. Any of these may lead to a change in the engine, which the plan's budget rule allows within the approved proportions (lower cadence, DPR or the far background points, never the 16/33 graph) but which needs the owner if it touches a gate or the live policy.

## Side effects of the fix, stated plainly

- **Ambient cadence rises to its designed cap.** It was 20.7 fps on this desktop (the old pattern skipped a refresh whenever a timer landed late); it is now 28.6 to 29.7 fps (a 60 s idle: mean interval 33.7 ms, median 33.3 ms, 15 of 1780 intervals under 32.3 ms from vsync jitter). The caps are 30 and 20; they are not exceeded. This is about 40% more idle frames, at a GPU p95 of 5 to 6 ms each.
- **One scheduler for all.** The timer lead (24 ms) and the early tolerance (1 ms) are constants in `frame-scheduler.ts`; on 120, 144 and 240 Hz displays an active frame comes at the first refresh at or after 15.67 ms, so never faster than 60 fps.

## Measurement correction found on the way

The hardware script divided the idle frame count by the observation window, but it also waits 400 ms for GPU queries before reading them, so it overstated the ambient cadence by about 1.3% (30.2 fps for a scene idling at 29.8) and one run failed the `≤ 30 fps` row on that. RED: `cadence is measured from the frame timestamps, not from a window that may be longer than the frames`. GREEN: `cadenceFps` takes the intervals over the span of the frame timestamps. This corrects a measurement; the limit is unchanged.

## The first run's outlier

Run 1 after the fix (ambient 9 fps, p95 33.3 ms, idle GPU p95 13.9 ms) was not reproduced in three later runs of the same configuration (ambient 28.6 to 30.2 fps) or in the isolated idle probe (29.7 fps). I did not find its cause: one run, no evidence beyond the numbers, so it is recorded as an unexplained outlier, not as environmental. The frame tail in the other bad runs is the second cause above.

## Validation

Fresh on this branch, root base path:

- `npm run validate` exit 0: docs 318 Markdown files / 109 IDs / 38 Skills; **519/519** Node tests (the seven scheduler tests and the cadence helper are new); lint 0 errors / 282 existing warnings; typecheck; build compiled.
- Production project (`PLAYWRIGHT_SERVE_EXPORT=1 npx playwright test --project=connected-production-chromium --workers=1`): **50 passed** against the new scheduler, including its live cases (Pause and Resume, a hidden tab, route changes, import races, failures).
- The connected runtime spec (`immersive-chromium`, SwiftShader, dev server) is where the new cadence is felt, because a software renderer pays for every frame. Results, stated with their limits:
  - **One worker, the full 60-test file:** baseline (the merged PR #138 head) 60/60 in 5.7 minutes; this branch 59/60 in 6.5 minutes and 59/60 in 8.2 minutes, with a different test failing each time (`one live renderer across the whole navigation journey`, then `the first scroll notch accelerates the scene…`). Each of those passes in isolation: 4 of 4 and 6 of 6 on the branch, 6 of 6 on the baseline.
  - **CI settings (`CI=1`: two workers, one retry), the full file:** baseline 4 failed, 1 flaky, 55 passed (14.7 minutes); this branch 3 failed, 3 flaky, 54 passed (16.6 minutes). Different tests fail on each run in both, and both are slow, so on this four-core machine the spec's load sensitivity swamps any difference; the earlier waves recorded the same SwiftShader load sensitivity and used one worker locally.
  - **What this does and does not show.** Two single-worker runs failed once each against one clean baseline run: a hint, from a small sample, that the new cadence adds load under a software renderer (the scene now renders about 40% more ambient frames and up to 60 fps while scrolling, and each software frame costs real CPU). It is not a measured regression, and production never uses a software renderer (the capability gate rejects it). **The pull request's CI run on Linux is the deciding evidence.** If the `immersive-chromium` cases flake there, the follow-up is in the test load handling, not in the pacing.
- No browser spec changed, and no baseline.

## Open items

- The wide tier still fails the active-interval row in two of four runs: the second cause above, to be investigated (owner: a bounded follow-up, Sonnet implements, Sol reviews, the owner merges).
- Separate-session independent review (GPT-6.1 Sol) and the owner's review of this PR, and PR CI.
- All device and screen-reader items of the Task 9 protocol are unchanged and OPEN; the hidden checkpoint still needs a manual run.
- An observation, not a finding of this work: the scene requests `powerPreference: 'low-power'`, which on a dual-GPU laptop selects the integrated GPU. It had no effect on this single-GPU machine and was not tested elsewhere.

## Rulings

1. **The fix lives in the host scheduler only.** The controller and the frozen contracts are unchanged, because the controller already anchors its due time at the start of a render. Cost if wrong: a later change to the controller.
2. **The early tolerance is 1 ms and applies to every wait.** Needed because on a 60 Hz display the next refresh lands within a fraction of a millisecond of the due time, either side; without it the frame is skipped about half the time. The caps hold to within a vsync's rounding. Cost if wrong: a cap exceeded by up to 1 ms per frame on an exotic refresh rate.
3. **Not claimed as closed.** The defect list entry for the active interval stays open for the second cause, and no policy changes. Cost if wrong: none.
4. **The scratch investigation scripts are not committed.** They are one-off probes of this machine (trace, bisection, interleaved controls); their results are recorded above. Cost if wrong: the experiments are not rerunnable from the repository.
