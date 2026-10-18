# Hardware qualification protocol (PLAN-SFC-V1 Task 15)

Status: **the tooling exists; no qualifying run has been collected.** The collector, the judge and this protocol are implemented and tested ([receipt](task-15.md)). The only runs made so far were smoke runs on the owner's desktop while a game was running, and every one of them is INVALID by the collector's own rules, so no tier has a PASS, a FAIL or a figure. Both tiers stay **OPEN**, and `CONNECTED_LIVE_POLICY` stays `{ wide: false, compact: false }`.

This protocol qualifies the wide tier (a physical desktop) and the compact tier (a physical, constrained Android phone) for the five connected route pairs: Studio, Founder, Contact, Services and Projects, Spanish and English. It supersedes the Services/Projects-only [Task 9 protocol](../services-projects-footer-acceptance-v1/task-9-hardware-protocol.md) for these pages and keeps its rules. A qualifier PASS is required by Task 18 (enabling a tier) and never by Task 16 (the coordinated release, which ships with both tiers off).

## Rules that do not bend

- **Hardware only.** No connected test hook, no software-renderer flag. A software renderer (SwiftShader, llvmpipe, Basic Render) makes the run invalid; so does a page that does not go live by itself.
- **A desktop never stands in for the phone, and a phone never qualifies the wide tier.** The device record names the physical device and the tier decides which kind it must be, but the record is not trusted alone: the run also keeps the target's own user agent and touch points, and a compact run is valid only when an Android target was driven over `--connect-cdp`. A desktop 390 px viewport (`--diagnostic`) is allowed for developing the script and never counts.
- **Quiet machine.** "All other heavy work stopped" is checked, not assumed: the host CPU in use and, where `nvidia-smi` exists, the GPU utilization are sampled for three seconds before the run and after it (browser closed). More than 30 % of the CPU either time, or of the GPU either time, makes the run invalid. A game, a build, a video call, an antivirus scan or a sync client all count.
- **Unmeasured is OPEN, never zero.** A zero only counts when the thing that would have reported a non-zero value was running (the layout-shift observer, the event-timing observer, the timer-query extension).
- **One cohort at a time.** Runs add up only for one build and device: the same head, candidate patch SHA-256, base path and device name. A tier verdict never mixes cohorts, so older passing data cannot qualify a changed build and older failing data cannot poison a repaired one. The dossier names its cohort and lists the runs it left out.
- **Diagnostics and copies never count.** A run made with `--trace-pipeline`, `--frames-out`, `--no-gpu-timers` or `--diagnostic` is labelled a diagnostic and kept; so is a copy of another report. A run id is used once, two reports that share one are both rejected, and two runs cannot start at the same instant.
- **No cherry-picking.** Every run file is kept: valid, invalid and failing. A tier verdict adds up all valid runs; one failing valid run fails the pair.
- **No weakening.** Fidelity, caps and budgets do not change to make a row pass. A measured defect gets a new remediation packet (number 20 or later) with its own RED, reviewer and a recollection at its head.

## 1. Candidate build (disposable checkout, never committed, never pushed)

1. Fork a disposable checkout from the exact head under test: `git worktree add --detach .worktrees/sfc-15-candidate <head>`; then `npm ci`.
2. Apply the committed live-policy patch with the plan's tool: `node scripts/prepare-sfc-candidate.mjs apply --kind=runtime --expect-head=<head>`. It changes only `lib/connected-studio/capability.ts` (both tiers `true`) and records the head and the patch SHA-256 in the Git directory; the collector reads them and refuses to run on a checkout that is not a runtime candidate at its own head, or whose diff is anything but that one file.
3. Build the export: `npm run build` (root), or `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` from PowerShell for the subpath. `out/` is what the collector serves; it never uses a dev server.
4. Afterwards: `node scripts/prepare-sfc-candidate.mjs restore --kind=runtime`, then remove the worktree. The candidate is evidence for a decision, not the decision.

## 2. The device record

Create one JSON file per physical device before collecting anything (kept with the runs, outside Git until the owner decides where):

```json
{
  "kind": "desktop",
  "name": "Model, CPU, memory",
  "os": "OS and build",
  "browser": "Chromium (Playwright-managed)",
  "browserVersion": "153.0.8010.12",
  "gpu": "GPU name and driver",
  "refreshHz": 60,
  "operator": "Who ran it"
}
```

`kind` is `desktop` for the wide tier and `android` for the compact tier; every field is required, and the refresh rate is the display's real setting (the run also records the page's own measured animation-frame rate as a cross-check). The collector adds the detected browser version, CPU, memory and renderer string next to it.

## 3. What one run is

One run is one route, one locale, one tier, one device, one page load, collected by one command from the candidate checkout:

```bash
node <worktree>/scripts/measure-connected-studio-hardware.mjs --route=studio --locale=es --tier=wide --headed \
  --device=<device.json> --run-id=wide-studio-es-1 --out=<runs-dir>/wide-studio-es-1.json
```

`--route` is `studio`, `founder`, `contact`, `services` or `projects`; `--locale` is `es` or `en`. Defaults are the protocol minima: 120 s visible idle, three up/down scroll traversals (and three pointer passes with a 4 s still tail on the wide tier), a 300 s sustained window and five route cycles. Shorter values are accepted for a smoke run and recorded, and such a run is invalid by definition. A run takes about 12 minutes; the 30 runs of one tier (five routes, two locales, three runs) take about six hours, so collect in blocks and keep each run's file. `--headed` is required for the wide tier so the page is composited like a visitor's; `--base-path=/Portfolio` for the subpath export. The export is served on `127.0.0.1`; a phone needs a fixed port (`--serve-port=<port>`) reversed to it, see section 6. The first navigation is a reachability check: a target that cannot fetch the export stops the run at once.

What the run does, in order, on the one page:

1. Page load in a fresh browser context (cold cache) on the device's real renderer; confirm it went live without any override. Vitals observers (LCP, layout shift with enhancement attribution, event timing) run from the first byte.
2. A few real interactions (Tab, Pause, Resume) so the event-timing observer has interactions to measure.
3. **Visible idle** for the idle window. Services and Projects keep their ambient cadence (1.2°/s, at most 30 fps wide and 20 fps compact); an Atlas page (Studio, Founder, Contact) must be asleep, and its draws over the last 30 s are the **rest** row.
4. **Scroll traversals** (top to Footer and back, natural wheel steps), then, on the wide tier, **pointer passes** across the scene with a still tail. Frame intervals come from render timestamps only; a gap of 250 ms or more is a pause between bursts. Per-render CPU submit time, GPU time from timer queries, draw calls, canvas pixel ratio, labels and long tasks are taken from the same frames. Each late interval is attributed to the frame before it (render CPU, GPU, or neither: scheduler or presentation).
5. **Page-only control**: the same scroll with the scene paused, so the page's own cost is visible.
6. **Pause**: zero draws and zero page animation-frame callbacks over 4 s; **Resume** draws again after an ordinary scroll.
7. **Hidden**: the headed window is minimized and restored; draws are counted from the page's own visibility log. See [limits](#6-what-this-protocol-cannot-claim): on Playwright-driven Chromium the page never reports `hidden`, so the row stays OPEN.
8. **Footer**: zero draws over 4 s.
9. First-load **vitals** are read here: LCP, the worst interaction (INP), and layout shift from the enhancement (the zero gate compares the unrounded sum).
10. **Route cycles**: out through a Footer link to the next connected route and back, client side, five times after a warm-up; listener growth is compared before and after, contexts alive are recorded, one canvas must come back each time. A hard load instead of a client navigation makes the listener row OPEN, not zero. The locale switch is exercised once.
11. **Sustained use**: bursts of scroll and pointer with quiet stretches for the sustained window; active frame interval and long tasks over it, contexts alive, heap start and end.
12. **Cold and warm**: the route's optional closure from the emitted export at Brotli quality 11 (counted once, the same accounting as `measure:connected-studio`), cross-checked against what the cold load actually fetched, then a second route from the shared cache. Engine code in a critical chunk invalidates the run.

Form focus and busy states are **not applicable**: since Task 13 (ADR-CONTACT-DIRECT-CHANNELS) Contact has no form. The dossier lists them as not applicable and counts nothing for them.

## 4. Rows and limits

A run is first classified valid or invalid, then every row is judged. Limits come from the plan and DESIGN-SFC-V1; the first thirteen are the Task 9 rows (`judgeHardware`), shared with the production scripts.

| Row | Limit (wide / compact) | Note |
| --- | --- | --- |
| `activeIntervalP95Ms` | ≤ 20 ms | scroll and pointer frames, render timestamps only |
| `renderCpuP95Ms` | ≤ 20 ms | CPU-only estimate of draw submission; never called GPU time |
| `renderGpuP95Ms` | ≤ 20 ms | needs `EXT_disjoint_timer_query_webgl2`; else OPEN |
| `interactionTaskMaxMs` | < 50 ms | Long Tasks API reports only tasks of 50 ms or more |
| `drawCallsMax` | ≤ 28 / ≤ 18 | |
| `pixelRatio` | ≤ 1.5 / ≤ 1.25 | canvas backing store over CSS width |
| `ambientFps` | ≤ 30 / ≤ 20 | |
| `pausedDraws`, `pausedRafCalls`, `hiddenDraws`, `hiddenRafCalls`, `footerDraws`, `footerRafCalls` | 0 | draws and scheduled animation-frame callbacks; hidden callbacks come from the page's own log |
| `maxContexts`, `listenerGrowth` | ≤ 1, ≤ 2 | across the route cycles |
| `closureBrotliKiB` | ≤ 120 KiB | optional closure, cold |
| `lcpMs`, `inpMs` | ≤ 2500, ≤ 200 | first load, this device |
| `clsEnhancement` | 0 | needs the layout-shift observer to have run |
| `restDraws`, `restRafCalls` | 0 | Atlas pages only; the last 30 s of the idle window |
| `settledTailDraws`, `settledTailRafCalls` | 0 | Atlas pages only; 3 s window 5 s after the last input (pointer pass or scroll) |
| `sustainedActiveIntervalP95Ms`, `sustainedTaskMaxMs`, `sustainedContexts` | ≤ 20 ms, < 50 ms, ≤ 1 | the sustained window |
| `labelViolations`, `resumeFailures`, `routeCycleFailures` | 0 | counted defects |

## 5. Adding runs up

```bash
node scripts/measure-connected-studio-hardware.mjs --qualify=<runs-dir> --tier=wide --out=<dossier.json>
```

The dossier keeps every run with its reasons. When the directory holds runs from more than one build or device, nothing is added: the dossier lists the cohorts, is OPEN, and asks for one (`--head=<sha>`, `--patch=<sha256>`, `--base-path=<path>`, `--device-name=<name>`; a single cohort is adopted without flags). Runs outside the chosen cohort are listed as excluded. For each of the ten route and locale pairs: any valid run with a FAIL row fails the pair; fewer than three valid runs, or a valid run with an OPEN row, leaves it OPEN; otherwise it passes. The tier fails if any pair fails, passes only when all ten pass, and is otherwise OPEN. The command exits 0 only for PASS, so an unresolved tier cannot satisfy a release gate by accident. Runs from the other tier in the directory are ignored; invalid runs never supply a pass and never hide what a valid one shows.

## 6. What this protocol cannot claim

- **The hidden checkpoint is not automatable here.** In Task 15 the page kept `document.visibilityState === "visible"` when its window was minimized or covered, with Playwright's default launch, with its three backgrounding switches removed, with focus emulation off, with every default argument dropped, and attached over CDP to a plain Chromium process. The row therefore stays OPEN. A genuinely hidden page can be measured with a normally launched browser and Chrome DevTools (Performance, tab hidden for 10 s: no animation-frame callbacks, no draws); that is a manual finding for the dossier notes, and it becomes a PASS only if the owner records it so, as for Task 9. `--hidden=manual` waits for the operator to hide the window or lock the phone and uses the page's log, in case a real hidden transition does arrive.
- **The Android path is written, not run.** Set it up with USB debugging on, Chrome open on the phone and nothing else running: `adb forward tcp:9222 localabstract:chrome_devtools_remote` for the debugging socket, and `adb reverse tcp:3515 tcp:3515` so that the phone's `127.0.0.1:3515` reaches the export server the script starts on the computer (use any free port, the same one in `--serve-port`). Then run with `--tier=compact --connect-cdp=http://127.0.0.1:9222 --serve-port=3515`; clean up with `adb reverse --remove tcp:3515` and `adb forward --remove tcp:9222`. The script drives the page on the phone itself, records the phone's user agent and touch points (a non-Android or touchless target makes the run invalid), and has the operator lock the screen for the hidden row. None of this has been exercised on a device; a first real phone run is also the test of the code. The phone's own load and temperature are recorded by the operator below, because the host cannot see them.
- **No screen reader, no Safari, no iPhone.** NVDA, VoiceOver and Narrator results, Safari/WebKit timing and an iPhone run are separate human protocols. The accessibility tree dump (`--extras`) is a proxy. Firefox is a functional activation check with no timing; every row stays OPEN.
- **One machine, lab data.** The vitals are synthetic lab figures from one device, not field data. Reduced-motion, Save-Data and denied-capability behavior are covered by the browser specs of Tasks 8, 11 and 12, not here.

## 7. Operator sheet (one block per device)

```text
Device: <model / CPU / GPU / OS / browser and version>      Operator: <name>      Date: <yyyy-mm-dd>
Candidate: head <sha>, patch SHA-256 <hash>, base path <root|/Portfolio>, runs directory <path>
Quiet before: closed <games, browsers, sync, updaters>      Power plan / charger / battery: <...>      Brightness (phone): <...>
GPU timer queries available: <yes|no>      Refresh rate set in the OS: <Hz>
Heat after the sustained window: <none|warm|hot>      Slowdown noticed: <none|text>      Memory trend: <flat|growing>
Hidden checkpoint (DevTools, tab hidden 10 s): callbacks <n>, draws <n>      <PASS|FAIL|OPEN>      Evidence: <file>
Notes: <text>
```

## 8. If a valid run fails (systematic debugging)

1. Keep the run and its figures; do not recollect until a cause is named. Separate the stages: the attribution in `lateFrames` (render CPU, GPU, neither), the page-only control, `--frames-out=<file>` (every traversal frame) and `--trace-pipeline=<file>` (a Chromium trace of the traversal window; tracing adds overhead, so a traced run is a diagnostic, not a measurement).
2. Use the [Task 3 risk baseline](risk-baseline.md) method for a late-frame tail: hypotheses H1 to H7 there already refute render CPU and GPU time on the reference desktop and leave a producer-side scheduling or presentation miss unresolved.
3. Report the measured options to the owner without lowering fidelity or caps. A repair is a new numbered packet with its own RED, reviewer and recollection at its head.
