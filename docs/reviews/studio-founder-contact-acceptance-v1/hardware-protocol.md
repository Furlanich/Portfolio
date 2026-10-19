# Hardware qualification protocol (PLAN-SFC-V1 Task 15)

Status: **the tooling exists; no qualifying run has been collected.** The collector, the judge and this protocol are implemented and tested ([receipt](task-15.md)). The only runs made so far were smoke runs on the owner's desktop while other work was running, and every one of them is INVALID by the collector's own rules, so no tier has a PASS, a FAIL or a figure. Both tiers stay **OPEN**, and `CONNECTED_LIVE_POLICY` stays `{ wide: false, compact: false }`. Since the 2026-10-19 wide-tier preparation the desktop hidden checkpoint is measured automatically and the wide tier can be collected unattended with [`--batch`](#5a-collecting-the-wide-tier-unattended); before collecting, read [the open Contact layout shift](task-15.md#wide-tier-preparation-on-released-main-2026-10-19), which fails every Contact run until it is repaired.

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
2. Apply the committed live-policy patch with the plan's tool: `node scripts/prepare-sfc-candidate.mjs apply --kind=runtime --expect-head=<head>`. It sets both tiers `true` in `lib/connected-studio/capability.ts` and, since Task 16, attaches the live host through `components/connected-studio/atlas-live-host.tsx`; it records the head and the patch SHA-256 in the Git directory. The collector reads them and refuses to run on a checkout that is not a runtime candidate at its own head, or whose diff is anything but the files the applied patch names (read back from `tests/fixtures/sfc/` and matched against the recorded SHA-256).
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

`--route` is `studio`, `founder`, `contact`, `services` or `projects`; `--locale` is `es` or `en`. Defaults are the protocol minima: 120 s visible idle, three up/down scroll traversals (and three pointer passes with a 4 s still tail on the wide tier), a 300 s sustained window and five route cycles. Shorter values are accepted for a smoke run and recorded, and such a run is invalid by definition. A run takes about 12 minutes; the 30 runs of one tier (five routes, two locales, three runs) take about six hours, so collect in blocks (or with [`--batch`](#5a-collecting-the-wide-tier-unattended)) and keep each run's file. `--headed` is required for the wide tier so the page is composited like a visitor's; `--base-path=/Portfolio` for the subpath export. The export is served on `127.0.0.1`; a phone needs a fixed port (`--serve-port=<port>`) reversed to it, see section 6. The first navigation is a reachability check: a target that cannot fetch the export stops the run at once.

What the run does, in order, on the one page:

1. Page load in a fresh browser context (cold cache) on the device's real renderer; confirm it went live without any override. Vitals observers (LCP, layout shift with enhancement attribution, event timing) run from the first byte.
2. A few real interactions (Tab, Pause, Resume) so the event-timing observer has interactions to measure.
3. **Visible idle** for the idle window. Services and Projects keep their ambient cadence (1.2°/s, at most 30 fps wide and 20 fps compact); an Atlas page (Studio, Founder, Contact) must be asleep, and its draws over the last 30 s are the **rest** row.
4. **Scroll traversals** (top to Footer and back, natural wheel steps), then, on the wide tier, **pointer passes** across the scene with a still tail. Frame intervals come from render timestamps only; a gap of 250 ms or more is a pause between bursts. Per-render CPU submit time, GPU time from timer queries, draw calls, canvas pixel ratio, labels and long tasks are taken from the same frames. Each late interval is attributed to the frame before it (render CPU, GPU, or neither: scheduler or presentation).
5. **Page-only control**: the same scroll with the scene paused, so the page's own cost is visible.
6. **Pause**: zero draws and zero page animation-frame callbacks over 4 s; **Resume** draws again after an ordinary scroll.
7. **Hidden**: on a headed desktop run this checkpoint runs last, after the measurement browser has closed and before the after-run load sample. The same Chromium executable is started plainly (a fresh profile, a debugging port and the tier's window size; no automation, headless, anti-backgrounding or software-rendering switch) and attached with `noDefaults`, so its page carries no focus emulation. The page loads and goes live, the pointer moves the scene, and a second tab in the same window comes to the front for 10 s. Draws and animation-frame callbacks are counted from the page's own visibility log; the rows count only over a hidden window of at least 4 s on a scene that drew in the second before it hid, and are OPEN otherwise. On a phone, or with `--hidden=manual`, the operator locks the screen or minimizes the window while the collector keeps the scene moving. See [why](#6-what-this-protocol-cannot-claim).
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

## 5a. Collecting the wide tier unattended

From the candidate checkout (section 1), with the device record (section 2) and the runs directory outside Git:

```bash
node <worktree>/scripts/measure-connected-studio-hardware.mjs --batch=<runs-dir> --device=<device.json>
```

The batch runs the ordinary one-run command at the protocol minima, one run at a time in its own process, headed, with run ids `wide-<route>-<locale>-<n>`; it adds nothing to a run and never shortens one. Before each run it waits for two quiet samples ten seconds apart (the same limits as the validity rule), and if the machine stays busy for `--quiet-wait-minutes` (default 30) it stops without spending an attempt. What it collects next comes from the runs already in the directory, counted the way `--qualify` counts them, for this candidate's cohort only: the pairs with the fewest valid runs go first, so the rounds interleave across routes; an invalid run is kept and retried, up to `--max-attempts` (default 6) runs per pair; a pair with a valid failing run is never recollected (section 8 names a cause first); a pair with three valid runs and an OPEN row needs a fix, not more runs. It ends by writing the cohort's dossier to `--out` or to `<runs-dir>.dossier.json` and exits as `--qualify` does. Running the same command again resumes. It collects the wide tier only: a compact run needs an operator at the phone.

Before starting: restart the machine; close games, launchers, video calls, other browsers, remote-desktop clients, chat and sync clients and updaters; keep the charger in and a fixed power plan; leave the desktop alone for about six hours (the headed windows take focus).

## 6. What this protocol cannot claim

- **The hidden checkpoint does not run in the measurement browser.** Playwright sends `Emulation.setFocusEmulationEnabled` to every page it creates (it skips this only for the default context of a browser attached with `noDefaults`), and that keeps the tab visible: in Task 15 the page stayed `visible` when minimized or covered under every launch tried, including a plain process attached over CDP without `noDefaults`. Turning the emulation off from a second CDP session does not help, because each session holds its own. The 2026-10-19 preparation confirmed the cause and the remedy on this desktop: under Playwright's launch a minimized page kept drawing animation frames, while the same executable started plainly and attached with `noDefaults` reported `hidden` both when minimized and behind a second tab, with its animation frames stopped. The checkpoint therefore runs in that plain browser after the measurement browser has closed (section 3, step 7); it is a separate page load of the same build, which is why it waits for the scene to be drawing before it hides it. Over CDP on a phone the operator still locks the screen.
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
Hidden checkpoint: <automatic (desktop) | screen locked by the operator (phone)>      Rows OPEN in any run: <none|run ids>
Notes: <text>
```

## 8. If a valid run fails (systematic debugging)

1. Keep the run and its figures; do not recollect until a cause is named. Separate the stages: the attribution in `lateFrames` (render CPU, GPU, neither), the page-only control, `--frames-out=<file>` (every traversal frame) and `--trace-pipeline=<file>` (a Chromium trace of the traversal window; tracing adds overhead, so a traced run is a diagnostic, not a measurement).
2. Use the [Task 3 risk baseline](risk-baseline.md) method for a late-frame tail: hypotheses H1 to H7 there already refute render CPU and GPU time on the reference desktop and leave a producer-side scheduling or presentation miss unresolved.
3. Report the measured options to the owner without lowering fidelity or caps. A repair is a new numbered packet with its own RED, reviewer and recollection at its head.
