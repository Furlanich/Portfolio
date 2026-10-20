# Early performance and critical-route baselines (PLAN-SFC-V1 Task 3)

Status: **recorded, not a verdict.** This is the W1.5 baseline that the later budget gates compare against. It qualifies nothing, passes nothing and changes no policy. Where a metric was not measured it says OPEN. The collectors, their fixtures and this document are the whole deliverable of [Task 3](task-03.md); the plan text is [PLAN-SFC-V1 Task 3](../../plans/completed/studio-founder-contact-v1.md).

## Summary

| Question | Answer |
| --- | --- |
| Optional engine closure today | **114.4 KiB Brotli** (559.7 KiB raw, two chunks), identical on Services and Projects in both locales, root and `/Portfolio`. Headroom to the 120 KiB ceiling: **5.6 KiB**. Below the 118 KiB warning line. |
| Cold JS of the routes the redesign changes | **Critical JS (requested before the load event): 117.6 KiB** on Studio, Founder and Privacy, **126.8 KiB on Contact** (the form chunk). Every route settles at 153.3 KiB (desktop) after prefetch. Same figures at `/Portfolio` (126.7 KiB for Contact). |
| Startup CPU of those routes | Desktop script CPU median 98–175 ms, p95 113–189 ms. Mobile profile (4x CPU) 420–580 ms. **Journey-to-journey spread of one unchanged route is up to 76 ms on desktop** (Studio, Founder; 15–28 ms on Contact and Privacy), against the plan's 25 ms added-CPU budget (see Risk 1). |
| Existing SPF presentation tail | **Not reproduced today**: six of six full runs pass the 20 ms active-interval row (17.7 to 19.0 ms). Three diagnostic runs show 2.5–3.9% of intervals late, 92% of them isolated single skipped refreshes, none explained by render CPU and one by GPU time. The cause is narrowed to the scheduling/presentation side and the next trace is specified below. |
| Physical desktop | One named desktop measured; hidden-tab, compact tier, phones and screen readers remain OPEN. |

## Method and environment

- **Head and dependencies.** Task 3 branch `codex/sfc-03-baselines` cut from `codex/sfc-integration` at `7fc2a6c6` (PR #143 merged). `npm ci` from the committed lockfile: Next.js 16.3.2, React and React DOM 18.2.0, Three.js 0.186.0, Playwright 1.63.0, Chromium 153.0.8010.12 (the Playwright build; `channel: 'chromium'` for hardware runs). The same versions were used for every figure below.
- **Builds.** Clean `.next` and `out` under this checkout, `npm run build` at root, then again with `NEXT_PUBLIC_BASE_PATH=/Portfolio` (`MSYS_NO_PATHCONV=1` in Git Bash). The hardware candidate is a separate build with the committed `live-policy.patch` applied (`prepare-sfc-candidate.mjs apply --kind=runtime`), restored and verified clean afterwards (`verify-clean`), its build deleted.
- **Machine (named desktop; device metadata for the owner to attest).** Intel Core i3-8100 (4 cores, 3.6 GHz), 23.9 GiB, NVIDIA GeForce RTX 2060 (driver 32.0.16.1088, ANGLE Direct3D 11, `EXT_disjoint_timer_query_webgl2` available), one generic monitor at 60 Hz, Windows 11 Pro build 26300. This is the same machine as the earlier [Task 9 hardware evidence](../services-projects-footer-acceptance-v1/task-9-hardware-protocol.md). The Chromium and driver versions of those earlier runs were not recorded, so a version difference between then and now cannot be ruled out.
- **Closure and static first-load.** `node scripts/measure-connected-studio-production.mjs --skip-build` reads the emitted export: every chunk's raw size and Brotli quality 11 size, the chunks each names in its loaders, and the JS and CSS each route's own HTML references.
- **Cold startup.** `node scripts/measure-connected-studio-vitals.mjs --skip-build --startup-baseline` loads each route in a fresh browser context (cold: no cache, no storage) under the profile's CPU and network throttling and the gzip lab server, with no test hook and no forced renderer. Five journeys per route, locale and profile. Each journey is a Chromium trace (`devtools.timeline`, `disabled-by-default-devtools.timeline`, `v8.execute`, `toplevel`, `blink.user_timing`, `loading`) from before the navigation to two seconds after the load event.
  - **Startup CPU** is the top-level script work (EvaluateScript, v8.compile, FunctionCall, RunMicrotasks: evaluation and hydration, nested events counted once) of the document's `CrRendererMain` thread from its `navigationStart`. Network and idle time are not tasks and cost nothing. **Evaluation CPU** is the EvaluateScript and compile part alone. The **longest task** is the longest `RunTask`.
  - **Critical JS** is the Brotli size of the emitted files for the scripts the browser requested before the load event; **first-load JS** adds those requested before the two-second settle window ends.
  - The p95 of five journeys is the largest of the five (nearest rank).
- **Retention.** The compact reports (startup, production, hardware and diagnostic JSON, 2.2 MB) are committed in [task-03-artifacts](task-03-artifacts/README.md). The raw traces (one per journey, 80 for the root pass, 80 for `/Portfolio`) and the 408,632,652-byte pipeline trace (`diag1-pipeline.json`, SHA-256 `7531732a4b6fc04420d8d9b5c918407a5446ba0d7523e8ab38998391f97fa9aa`) are about 1.2 GB and one file exceeds GitHub's 100 MB limit, so they are archived in the git-ignored `.superpowers/reports/sfc-03/` of the main checkout, outside every worktree; every journey records its trace SHA-256 and all 160 were re-verified after the move. The archive is local to this computer, not backed up by the repository.

## Optional engine closure (existing)

| Destination | Brotli | Raw | Chunks | Headroom to 120 KiB |
| --- | ---: | ---: | ---: | ---: |
| Services ES, Services EN, Projects ES, Projects EN | 114.4 KiB | 559.7 KiB | 2 | 5.6 KiB |

Measured at root and at `/Portfolio` with the same result; the closure is the same two files for all four destinations. The shipped static policy requested none of it on any destination or under any static-preference path (reduced motion, Save-Data, forced colors, a stored context loss), and drew no canvas. All four posters are inside their ceilings. 114.4 KiB is below the 118 KiB warning line that Task 8 defines, so no mitigation decision is triggered by this baseline; the margin is small (5.6 KiB) and Tasks 4 and 8 add pure profile, interaction and path code to a closure that has nothing left over for fidelity growth.

## Cold JS and startup baseline of the reading, intake and legal routes

Terms does not exist yet; **Privacy is its baseline**, as the plan specifies. Every route settled to the same 13 scripts on desktop, so "added first-load JS" will be measured against the same shell for all of them.

### Root (`/`)

**Desktop** (1440x900, DPR 1, no CPU throttle, desktop network)

| Route | Critical JS (Brotli) | First-load JS, settle window | Script CPU median / p95 | Evaluation CPU p95 | Longest task |
| --- | ---: | ---: | ---: | ---: | ---: |
| studio/es | 117.6 KiB | 153.3 KiB (13 scripts) | 111.4 / 170.4 ms | 47.4 ms | 56.3 ms |
| studio/en | 117.6 KiB | 153.3 KiB (13 scripts) | 113.1 / 162.0 ms | 43.4 ms | 49.1 ms |
| founder/es | 117.6 KiB | 153.3 KiB (13 scripts) | 107.7 / 171.8 ms | 54.5 ms | 50.1 ms |
| founder/en | 117.6 KiB | 153.3 KiB (13 scripts) | 122.2 / 170.9 ms | 55.7 ms | 77.0 ms |
| contact/es | 126.8 KiB | 153.3 KiB (13 scripts) | 174.7 / 183.6 ms | 53.5 ms | 48.2 ms |
| contact/en | 126.8 KiB | 153.3 KiB (13 scripts) | 173.3 / 188.6 ms | 56.8 ms | 51.9 ms |
| privacy/es | 117.6 KiB | 153.3 KiB (13 scripts) | 107.3 / 127.4 ms | 66.5 ms | 60.3 ms |
| privacy/en | 117.6 KiB | 153.3 KiB (13 scripts) | 98.2 / 113.0 ms | 52.7 ms | 48.7 ms |

**Mobile** (390x844, DPR 3, touch, 4x CPU slowdown, Slow 4G applied)

| Route | Critical JS (Brotli) | First-load JS, settle window | Script CPU median / p95 | Evaluation CPU p95 | Longest task |
| --- | ---: | ---: | ---: | ---: | ---: |
| studio/es | 117.6 KiB | 141.8 KiB (11 scripts) | 490.6 / 505.7 ms | 224.0 ms | 630.5 ms |
| studio/en | 117.6 KiB | 141.8 KiB (11 scripts) | 534.4 / 542.9 ms | 242.2 ms | 451.1 ms |
| founder/es | 117.6 KiB | 132.7 KiB (10 scripts) | 501.6 / 529.3 ms | 237.4 ms | 520.7 ms |
| founder/en | 117.6 KiB | 132.7 KiB (10 scripts) | 480.1 / 504.9 ms | 239.6 ms | 553.7 ms |
| contact/es | 126.8 KiB | 141.8 KiB (11 scripts) | 532.4 / 542.3 ms | 231.6 ms | 553.3 ms |
| contact/en | 126.8 KiB | 141.8 KiB (11 scripts) | 521.0 / 548.9 ms | 255.8 ms | 560.6 ms |
| privacy/es | 117.6 KiB | 132.7 KiB (10 scripts) | 469.8 / 486.3 ms | 276.8 ms | 434.6 ms |
| privacy/en | 117.6 KiB | 132.7 KiB (10 scripts) | 461.5 / 488.6 ms | 295.3 ms | 447.8 ms |

### `/Portfolio`

**Desktop**

| Route | Critical JS (Brotli) | First-load JS, settle window | Script CPU median / p95 | Evaluation CPU p95 | Longest task |
| --- | ---: | ---: | ---: | ---: | ---: |
| studio/es | 117.6 KiB | 153.1 KiB | 125.9 / 181.5 ms | 59.1 ms | 54.9 ms |
| studio/en | 117.6 KiB | 153.1 KiB | 153.2 / 172.1 ms | 42.4 ms | 52.1 ms |
| founder/es | 117.6 KiB | 153.1 KiB | 115.4 / 176.9 ms | 48.5 ms | 44.9 ms |
| founder/en | 117.6 KiB | 153.1 KiB | 112.1 / 122.6 ms | 51.5 ms | 46.6 ms |
| contact/es | 126.7 KiB | 153.1 KiB | 173.8 / 187.6 ms | 67.9 ms | 64.1 ms |
| contact/en | 126.7 KiB | 153.1 KiB | 169.4 / 178.2 ms | 43.7 ms | 47.6 ms |
| privacy/es | 117.6 KiB | 153.1 KiB | 109.0 / 117.3 ms | 43.5 ms | 39.9 ms |
| privacy/en | 117.6 KiB | 153.1 KiB | 102.9 / 122.7 ms | 50.4 ms | 46.0 ms |

**Mobile**

| Route | Critical JS (Brotli) | First-load JS, settle window | Script CPU median / p95 | Evaluation CPU p95 | Longest task |
| --- | ---: | ---: | ---: | ---: | ---: |
| studio/es | 117.6 KiB | 141.7 KiB | 464.6 / 540.6 ms | 239.9 ms | 590.6 ms |
| studio/en | 117.6 KiB | 141.7 KiB | 504.1 / 579.5 ms | 240.8 ms | 623.3 ms |
| founder/es | 117.6 KiB | 132.6 KiB | 419.4 / 438.6 ms | 243.4 ms | 685.3 ms |
| founder/en | 117.6 KiB | 132.6 KiB | 430.7 / 468.5 ms | 227.3 ms | 587.0 ms |
| contact/es | 126.7 KiB | 141.7 KiB | 528.8 / 534.6 ms | 253.6 ms | 511.1 ms |
| contact/en | 126.7 KiB | 141.7 KiB | 525.7 / 529.9 ms | 259.3 ms | 528.0 ms |
| privacy/es | 117.6 KiB | 132.6 KiB | 452.5 / 457.4 ms | 257.8 ms | 492.1 ms |
| privacy/en | 117.6 KiB | 132.6 KiB | 466.3 / 518.5 ms | 241.1 ms | 460.6 ms |

Static analysis of the emitted HTML (`readingRoutes` in the production report) gives a different, smaller number: **152.0 KiB** across 9 JS chunks for Studio, Founder and Privacy and **161.1 KiB** across 10 for Contact (151.9 and 161.0 KiB at `/Portfolio`), plus 11.3 KiB of CSS. It differs from the browser-observed set because the HTML names one chunk the browser never requests at load, and the browser requests five chunks the HTML does not name (loaded by the runtime and after load).

### What the numbers show

1. **The routes share one shell.** All eight routes request the same scripts. The only route-specific critical difference is Contact's form chunk: +9.2 KiB (126.8 against 117.6 KiB). Studio, Founder and Privacy are indistinguishable in JS.
2. **"First-load JS" depends on when you stop counting.** On desktop every route reaches 153.3 KiB within two seconds, including a Contact chunk that other routes fetch after load; under the mobile profile three scripts are not yet requested and the settle figure is 132.7 to 141.8 KiB. **Critical JS (before the load event) is stable at 117.6 KiB across both profiles**, so it is the robust baseline for any "added first-load JS" budget; the settle-window figure moves with timing, and the static HTML figure is a third, different quantity.
3. **Evaluation CPU is steady on desktop** (40 to 57 ms per journey, with the occasional 60 to 68 ms), **hydration and scheduling are not.** Per-journey desktop script CPU ranges 91 to 189 ms. Within one route the spread is 63 to 76 ms for Studio and Founder and 15 to 28 ms for Contact and Privacy; Contact sits steadily about 65 ms above Privacy. In a Studio trace the swing is in FunctionCall and RunMicrotasks (React hydration and its scheduling) and in layout and style, while EvaluateScript stays near 45 ms and compilation near 1 ms. Under the mobile profile evaluation alone is 170 to 295 ms with a few outliers (58 and 75 ms) in otherwise steady sets.

## Risks the baseline exposes

1. **The startup-CPU gate cannot be adjudicated by this method on this machine.** The plan allows an added p95 of 25 ms over five cold journeys per profile. The journey-to-journey spread of one unchanged route is up to 76 ms on desktop (Studio ES 107 to 170 ms, Founder ES 96 to 172 ms), three times the allowance, and Studio and Founder are bimodal run to run. Contact and Privacy are steadier (15 to 28 ms) but sit about 65 ms apart. A comparison of two five-journey p95s would pass or fail on noise. Options for the planning authority, not applied here: pair and interleave baseline and candidate journeys on the same head and machine and compare medians with a stated tolerance; raise the journey count; gate the steady component (evaluation CPU and critical JS bytes) deterministically and report hydration CPU as evidence; or restate the gate. Task 14 owns the final collector and must not silently choose.
2. **"First-load JS" must be defined before it is gated.** The budgets are relative to this baseline, so the definition (critical before load; settle window; static HTML) must be fixed in the owner of the gate. The recommended definition, because it is stable across profiles and base paths, is **critical JS, Brotli quality 11, requested before the load event** (117.6 KiB; Contact 126.8 KiB), with the settle-window figure reported beside it.
3. **Closure headroom is 5.6 KiB.** Task 8 meets the early closure checkpoint with this headroom; any growth above 118 KiB is a warning and above 120 KiB fails qualification.
4. **Startup tracing adds overhead to every figure.** The method must be reused unchanged for any later comparison; untraced numbers are not comparable.
5. **One machine, one browser build.** Lab figures, not field data; Firefox and WebKit startup cost is OPEN.

## Valid historical failed runs

Every run of the connected scene's active-scroll frame interval that failed its row, from the recorded receipts ([hardware protocol](../services-projects-footer-acceptance-v1/task-9-hardware-protocol.md), [frame-pacing receipt](../services-projects-footer-acceptance-v1/task-9-frame-pacing.md)). All on the same desktop, hardware WebGL2, no test hook, wide-tier candidate. Passing runs are listed for completeness; none was dropped.

| Run | Active p95 | Median | Verdict | Notes |
| --- | ---: | ---: | --- | --- |
| Task 9, before the pacing fix | 34.1 ms | 17.5 ms | **FAIL** | 1690 renders; the same page with the scene paused held 16.8 ms |
| Task 9, GPU timers off (control) | 33.9 ms | 17.4 ms | **FAIL** | not an observer effect |
| Pacing fix, run 1 | 33.3 ms | 16.8 ms | **FAIL** | ambient cadence collapsed to 9 fps; unexplained outlier |
| Pacing fix, run 2 | 18.1 ms | 16.7 ms | PASS | |
| Pacing fix, run 3 | 18.6 ms | 16.7 ms | PASS | |
| Pacing fix, run 4 | 32.0 ms | 16.9 ms | **FAIL** | a 95 ms long task |

The relative listener-count gate flakiness and the SwiftShader live-scene failures recorded in the Services, Projects and Footer W5 checkpoint are not frame-interval runs: the first is a method issue fixed in PR #128, the second is a software renderer production never uses.

## Physical desktop runs, this task (2026-10-15)

The same candidate, the same script, no override. Active p95 against the 20 ms row; every other measured row passed in every run (CPU submit p95 0.3 to 0.4 ms, seven draw calls, canvas pixel ratio 1, Pause and Footer zero draws and zero animation-frame callbacks, one context, zero listener growth over five route changes).

| Run | Active p95 (ms) | Median (ms) | Renders | GPU p95 (ms) | CPU p95 (ms) | Ambient fps | Page-only p95 (ms) | Hidden |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| non-headed 1 | 18.9 | 16.7 | 2386 | 16.91 | 0.3 | 29.4 | 16.8 | OPEN |
| non-headed 2 | 17.8 | 16.7 | 2408 | 16.64 | 0.3 | 29.9 | 16.8 | OPEN |
| non-headed 3 | 17.9 | 16.7 | 2409 | 16.63 | 0.3 | 29.7 | 16.8 | OPEN |
| headed 1 | 19.0 | 16.7 | 2380 | 16.72 | 0.3 | 29.8 | 16.8 | OPEN |
| headed 2 | 17.7 | 16.7 | 2405 | 16.50 | 0.3 | 30.0 | 16.8 | OPEN |
| headed 3 | 17.8 | 16.7 | 2420 | 16.94 | 0.4 | 29.9 | 16.8 | OPEN |
| diagnostic 1, headed, traced | 18.2 | 16.6 | 2448 | 14.90 | 0.4 | 29.9 | 16.8 | OPEN |
| diagnostic 2, headed | 17.7 | 16.7 | 2373 | 14.45 | 0.3 | 29.9 | 16.8 | OPEN |
| diagnostic 3, non-headed | 18.4 | 16.7 | 2394 | 16.79 | 0.3 | 29.9 | 16.8 | OPEN |

Diagnostic runs shorten the idle window to 10 s (the ambient figure is over that window) and are not full protocol runs. **Verdict per run: OPEN**, not PASS, because the hidden-tab row could not be measured: the page stays `visible` even when the window is minimized (Playwright's launch flags disable occlusion handling, as the earlier receipt found). This is a candidate baseline, not a tier verdict, and it says nothing about the compact tier, phones or screen readers.

**Today's passes do not clear the history.** The row passes when fewer than 5% of intervals are late and flips when more are; the passing runs sit 1 to 2.3 ms under the limit, and earlier runs on the same machine failed in two of four and in the very first measurement. Six of six passing runs today, headed or not, do not show whether the defect is fixed or whether this day's conditions (browser build, driver, load) differ.

## Diagnosis of the SPF presentation tail

Systematic debugging, inline, with the collector evidence that now exists. Nothing in the engine, host or scheduler was changed, and no fix is proposed here.

### Evidence added to the tooling

- `classifyLateFrames` (pure, tested) takes the render CPU time, GPU time and timestamp of each frame and attributes every late interval (25 ms or more, under the 250 ms that separates scroll bursts) to the frame before it: **render CPU** (8 ms or more), **GPU** (20 ms or more), **neither** (scheduler or presentation), or **unmeasured** when the GPU time is missing, which never clears the GPU. The hardware script reports it as `lateFrames`.
- `--frames-out=<file>` records every traversal frame (timestamp, CPU submit, GPU time, draw calls); `--trace-pipeline=<file>` records a Chromium trace of the traversal window (`toplevel`, `cc`, `viz`, `gpu`, `benchmark`, `input`, `latencyInfo`, `blink.user_timing`, `disabled-by-default-cc.debug.scheduler`). Both are opt-in, Chromium only; tracing adds overhead, so a traced run is a diagnostic.

### Hypotheses and what the evidence says

| # | Hypothesis | Evidence | Status |
| --- | --- | --- | --- |
| H1 | Timer then animation frame misses a vsync (the Task 9 cause) | Fixed in the pacing PR (7.1% of intervals took two refreshes in its virtual-display test; GREEN after). Median interval 16.7 ms in every run here. | Fixed; **not the remaining cause** |
| H2 | The late frames come from the headed (windowed) presentation path | Headed runs 19.0, 17.7, 17.8 ms; non-headed 18.9, 17.8, 17.9 ms. Both pass; the late share is similar (2.5% headed, 3.9% non-headed). | **Not supported** today |
| H3 | "Late" frames are really the 30 fps ambient cadence counted inside the active window | In diagnostic 1, 77 of 82 late gaps are isolated (neither neighbour late), the median late gap is 31.9 ms (two refreshes) and 80 of 82 are within 2.5 ms of 33.3 ms. Ambient frames would come in runs. Across the three runs, 216 of 235 late gaps (92%) are isolated. | **Refuted**: they are single skipped refreshes amid 60 fps |
| H4 | The render before a late interval was expensive on the CPU | Render CPU p95 is 0.3 to 0.4 ms; **0 of 235** late intervals follow a frame with 8 ms or more of CPU submit. | **Refuted** |
| H5 | The render before a late interval held the GPU | 1 of 235 follows a frame with 20 ms or more of GPU time; the GPU p95 is 14.4 to 16.9 ms in every run, about one refresh period, for seven draw calls and a RTX 2060. | **Not the common cause**, but the figure is suspect (below) and the 6 unmeasured intervals cannot clear the GPU |
| H6 | The compositor pipeline or presentation is slow | Page renderer only, diagnostic 1 trace, 4,975 presented frames: swap-to-presentation is **15.07 ms median, 15.23 p95, 16.07 max** (steady: no variability); main-thread commit 1.81 ms median, 3.04 ms p95, with one 250.71 ms outlier; commit, activation, receive, draw and swap stages are each under 1.4 ms at p95. Presentation feedback is not a usable per-frame clock here: the trace holds about 115 pipeline reports per second at 60 Hz (two per refresh), so half of the gaps between reports are under 12 ms, and only 8 of them are 25 ms or more against 82 late page renders. | **Not shown** for any stage except the one in H8; this is why the next trace aligns page frames by marks |
| H8 | Submit back-pressure: a presented frame takes about one refresh to be acknowledged (15 to 16 ms), so a frame that overlaps the next BeginFrame waits for the previous frame's acknowledgement before it can be submitted | `EndActivateToSubmitCompositorFrame` is 0.24 ms median but **14.99 ms p95 and 15.21 ms p99** (max 16.06): at least one frame in twenty waits about one refresh between activation and submission, while every other stage is quick. Half of the trace is 30 fps ambient, where such a wait can be normal, so this does not by itself explain the 60 fps skips. | **Open, candidate**: it would show as case (b) or (c) in the next trace |
| H7 | A skipped refresh is a producer-side miss: the animation frame is not scheduled or the main frame is throttled for that vsync | Late frames are cheap on CPU and GPU (H4, H5), and 228 of 235 (97%) are "neither". The trace holds 5,661 `ShouldThrottleSendBeginMainFrame` instants and a 250.7 ms main-thread stall (compare the earlier 95 ms long task). Not yet correlated with the late frames in time. | **Open, leading candidate** |

Counts for H3 to H5, by run (late intervals, then attribution): diagnostic 1: 82 (render CPU 0, GPU 0, neither 80, unmeasured 2); diagnostic 2: 60 (0, 0, 58, 2); diagnostic 3: 93 (0, 1, 90, 2). Late share of intervals 3.4%, 2.5% and 3.9%; the row would fail at a late share above 5%, and the earlier failing runs had 6 to 21% over 25 ms.

**Why the GPU figure is suspect.** The timer query reads 16.5 to 16.9 ms in every full run while the ambient frames of the same scene read about 4 ms. A frame time equal to one refresh period for seven draw calls is what a measurement would show if the query included time blocked behind the swap chain, so the GPU row may be reporting presentation backpressure, not GPU work. This is a hypothesis, not a finding; it does not change the row's verdict, and a GPU capture (not available to Playwright) would settle it.

### The next disambiguating trace

The diagnosis is narrowed to "a refresh is skipped although the preceding render was cheap". The decisive observation is, for each skipped refresh, **whether the renderer was given a BeginMainFrame for that vsync and when the animation-frame callback ran**:

1. Re-run `--headed --trace-pipeline=<file> --frames-out=<file>` (add `devtools.timeline` to the categories so `FireAnimationFrame` and the renderer's `RunTask` appear) and have the probe call `performance.mark('sfc-render')` in its `clear` wrapper so each page render lands in the trace at its exact time (`blink.user_timing` is already captured). That aligns the page frames with the trace; today they are matched only by statistics.
2. For every isolated late gap, classify the missing vsync as: **(a)** BeginMainFrame sent and `FireAnimationFrame` ran late, so the main thread was the cause (look at the `RunTask` that contains it and its blocker); **(b)** no BeginMainFrame sent, with a `ShouldThrottleSendBeginMainFrame` instant in that interval, so the cc scheduler throttled the producer; **(c)** the animation frame ran on time and the WebGL work was submitted on time but presentation was late, so the compositor or display path was the cause.
3. Collect it on a run that actually fails the row. The tail did not reproduce in nine runs today, so capture a traced run every time and keep the trace of any run whose late share exceeds 5%; a passing trace characterizes the baseline only. If it never fails again, the first evidence of the cause will be the early failing run's trace, with the browser and driver versions recorded beside it.

**Ownership.** A demonstrated scheduler, controller or engine correction is not Task 3's: it belongs to Task 4 (controller and frame scheduler), Task 8 (engine) or Task 11 (host), or to a new remediation packet numbered 20 or later, each with a RED first. Nothing here assigns a fix.

## Reproduction

```bash
# Root and base-path exports, clean first (this checkout's absolute .next and out only)
npm run build
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build

# Closure headroom and static first-load of the reading routes
node scripts/measure-connected-studio-production.mjs --skip-build --out=production.json

# Cold startup baseline: five journeys per route, locale and profile, one trace each
node scripts/measure-connected-studio-vitals.mjs --skip-build --startup-baseline --out=startup.json

# Hardware candidate (policy fixture applied in a disposable state, restored afterwards)
node scripts/prepare-sfc-candidate.mjs apply --kind=runtime --expect-head=<head>
node scripts/measure-connected-studio-hardware.mjs --tier=wide [--headed] --out=hardware.json
node scripts/measure-connected-studio-hardware.mjs --tier=wide --headed --idle-seconds=10 --frames-out=frames.json --trace-pipeline=pipeline.json --out=diagnostic.json
node scripts/prepare-sfc-candidate.mjs restore --kind=runtime && node scripts/prepare-sfc-candidate.mjs verify-clean
```

## Open items

- **Hidden-tab row, compact tier, constrained Android, iPhone, screen readers and Firefox/WebKit timing: OPEN.** Nothing here measures them.
- **Device metadata attestation:** the owner confirms the machine, display and software facts above.
- **Gate and definition decisions for the planning authority:** Risks 1 and 2.
- **Raw traces are local to this computer.** They survive removal of the worktree, not loss of the machine; a trace needed elsewhere goes to storage the owner chooses, identified by the recorded hashes.
- **The SPF tail remains an unfixed, intermittently reproducible defect** with the next trace specified above; the wide tier stays disabled and nothing in this record qualifies it.
