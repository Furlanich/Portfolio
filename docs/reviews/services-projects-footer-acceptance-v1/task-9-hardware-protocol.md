# Task 9 — hardware and screen-reader protocol (owner-executed, OD-4)

Status: **partly run.** The owner deferred hardware evidence on 2026-10-13 ([plan Progress](../../plans/active/services-projects-footer-v1.md#progress)) and then asked for the open items to be addressed. What one desktop could provide is in section 6; **the wide tier does not pass** (one failed row), the compact tier and every phone, iPhone and screen-reader item remain **OPEN**, and both `CONNECTED_LIVE_POLICY` tiers stay `false`. A candidate run is evidence for the owner's decision, not the owner's acceptance. A tier still turns on only through a bounded follow-up PR carrying the filled sheet.

Rules that do not bend:

- No software override. Never set `window.__FURLANICH_CONNECTED_TEST__` on a device run, and use hardware WebGL2 only. A software renderer is rejected by the page and the run then measures the static page.
- CPU-only estimates are never called GPU measurements. Record whether GPU timer queries were available (`EXT_disjoint_timer_query_webgl2`) and every disjoint rejection; if they were not, write "GPU time: not measured".
- An unmeasured metric stays OPEN. Never write a zero as a pass.

## 1. Candidate build (private worktree, never committed)

1. In a private worktree off current `main`, edit only the `CONNECTED_LIVE_POLICY` values in `lib/connected-studio/capability.ts` for the tier under test (`wide: true` covers wide and tablet; `compact: true` covers compact). Record the source SHA and keep `git diff` of that edit.
2. Clean `.next` and `out` (see the plan's [cleaning note](../../plans/active/services-projects-footer-v1.md#verification-commands-artifact-hygiene-and-manual-procedure)), then `npm run build`. For the subpath export, build with `NEXT_PUBLIC_BASE_PATH=/Portfolio` from PowerShell.
3. Serve it on the local network: `HOST=0.0.0.0 PLAYWRIGHT_PORT=3290 node scripts/serve-static-export.mjs`. Open `http://<desktop-ip>:3290/servicios/` on each device.
4. Afterwards restore both values to `false`, delete the candidate build and do not push the candidate.

## 2. What to run on each device

Per device and per page (Services and Projects, Spanish and English at least once each):

1. Three full up/down traversals at a natural scroll speed, from the top to the Footer and back.
2. At least 2 minutes of visible idle at the top, untouched.
3. Pause, then wait 10 seconds, then Resume. Hide the tab (or lock the phone) for 10 seconds and return. Scroll into the Footer and out again.
4. Navigate Services → Projects → Services five times through the App Bar, then the locale switch once. Watch for a second canvas, labels from the previous locale, a stuck frame or a growing page.
5. Sustain 5 minutes of mixed scrolling and idle; note heat and any slowdown.

Measure with the browser's own tools: Chrome DevTools Performance on the desktop and over `chrome://inspect` for the Android phone; Safari Web Inspector on the iPhone through a Mac. On the machine that serves the candidate you may also run `node scripts/measure-connected-studio-vitals.mjs --skip-build --expect-mode=live --profile=desktop` (no override: the script fails if the page does not go live by itself, and it requires Pause and Resume to complete); its lab figures are supplementary to the device traces below. Record the 30 fps (wide/tablet) and 20 fps (compact) ambient cap separately from active scrolling. In a paused state the Performance trace must show no animation-frame callbacks and no draws.

## 3. Pass criteria (from the plan)

| Metric | Limit |
| --- | --- |
| Active-scroll frame interval p95 | ≤ 20 ms |
| Per-render work p95 (the animation-frame task that draws) | ≤ 20 ms |
| Scene interaction task | < 50 ms |
| Draw calls per frame | ≤ 28 wide and tablet, ≤ 18 compact |
| Device pixel ratio of the canvas | ≤ 1.5 wide and tablet, ≤ 1.25 compact |
| Ambient cadence | ≤ 30 fps wide and tablet, ≤ 20 fps compact |
| Paused, hidden and Footer states | zero scheduled callbacks and zero draws |
| Labels | upright, never below about 11 px, no overlap with text; the same word set as the page language |
| Disposal | one canvas, one context, no growth after the five route changes |

A tier turns on only if every row passes on its devices: `wide: true` needs the desktop, `compact: true` needs both the Android phone and the iPhone.

## 4. Screen readers

| Check | Expected |
| --- | --- |
| NVDA with Firefox, Services and Projects, both locales | One H1; the capability legend and the catalogue read as ordinary text; the canvas and labels are silent; the Pause button announces its name and pressed state; on a fallback the focused button reads "Fondo estático" / "Static background" and is announced as unavailable; no focus loss |
| VoiceOver on iOS, Safari, both pages | Same as above, plus swipe order follows the visible reading order and the Footer channels are reachable |

## 5. Recording sheet

Copy one block per device. Each item gets PASS, FAIL or OPEN with the person who checked it, the date and the evidence (trace file or screenshot name).

```text
Device: <model / CPU / GPU / OS / browser and version>        Checked by: <name>   Date: <yyyy-mm-dd>
Candidate: source SHA <sha>, tier(s) enabled <wide|compact>, base path <root|/Portfolio>, diff saved as <file>
GPU timer queries available: <yes|no>   Disjoint rejections: <count>   GPU time: <value | not measured>

Active-scroll interval p95 ......... <ms>   <PASS|FAIL|OPEN>
Per-render work p95 ................ <ms>   <PASS|FAIL|OPEN>
Scene interaction task ............. <ms>   <PASS|FAIL|OPEN>
Draw calls (max) ................... <n>    <PASS|FAIL|OPEN>
Canvas pixel ratio ................. <n>    <PASS|FAIL|OPEN>
Ambient cadence .................... <fps>  <PASS|FAIL|OPEN>
Paused / hidden / Footer: callbacks <n>, draws <n>   <PASS|FAIL|OPEN>
Labels (continuity, size, language) ........ <PASS|FAIL|OPEN>
Disposal across five route changes ......... <PASS|FAIL|OPEN>
Heat after 5 minutes: <none|warm|hot>   Memory trend: <flat|growing>   Notes: <text>
Screen reader (if applicable): <NVDA + Firefox | VoiceOver iOS> ....... <PASS|FAIL|OPEN>
```

## 6. Candidate run on the desktop, 2026-10-13 (automated by `scripts/measure-connected-studio-hardware.mjs`)

Machine: Intel Core i3-8100 (4 cores, 3.6 GHz), 24 GB, NVIDIA GeForce RTX 2060, Windows 11; Chromium (new headless and headed) through ANGLE/Direct3D 11, `EXT_disjoint_timer_query_webgl2` available, 0 disjoint rejections. Source: the Task 9 branch with only `CONNECTED_LIVE_POLICY = { wide: true, compact: false }` changed, uncommitted, clean root export (diff saved as `candidate-policy.diff`, SHA as `candidate-source-sha.txt`, both in the git-ignored `.superpowers/reports/`). The script sets no test hook and passes no software-renderer flag; the page went live by itself. The candidate was deleted afterwards and `capability.ts` restored (no diff).

| Row (wide tier) | Limit | Measured | Verdict |
| --- | --- | --- | --- |
| Active-scroll frame interval p95 | ≤ 20 ms | **34.1 ms** (median 17.5 ms; 1690 renders over 3 up/down traversals) | **FAIL** |
| Per-render CPU submit time p95 (CPU-only estimate) | ≤ 20 ms | 0.4 ms | PASS |
| Per-render GPU time p95 (timer queries) | ≤ 20 ms | 17.6 ms (idle p95 4.2 ms) | PASS, close to the limit |
| Scene interaction task | < 50 ms | no task reached 50 ms (the Long Tasks API reports only tasks of 50 ms or more) | PASS |
| Draw calls per frame (max) | ≤ 28 | 7 | PASS |
| Canvas pixel ratio | ≤ 1.5 | 0.99 | PASS |
| Ambient cadence, 120 s visible idle | ≤ 30 fps | 20.7 fps (2486 renders) | PASS |
| Paused: draws and page animation-frame callbacks over 4 s | 0 | 0 and 0; Resume drew again | PASS |
| Footer: draws over 4 s | 0 | 0 | PASS |
| Hidden: draws | 0 | **not measured**: the page stayed `visible` even when the window was minimized (Playwright's launch flags disable occlusion handling) | **OPEN** |
| Contexts alive after 5 route changes | ≤ 1 | 1 (19 created over the run, each released) | PASS |
| Listener growth over 5 route changes | ≤ 2 | 0 (528 to 528); heap 8.4 to 8.9 MiB | PASS |
| Labels | the hero shows them; none smaller than 11 px, tilted, interactive or over reading text | 4 of 16 visible at the hero, smallest 12 px, all upright and inert, 0 over masks (labels hide under reading plates by design, PC-2) | PASS |

**The failed row is real and it is the scene, not the page.** Scrolling the same page with the scene paused gives a `requestAnimationFrame` interval p95 of 16.8 ms (p50 16.7); with the scene live it is 34.1 ms. A control run with the GPU timer queries switched off gives 33.9 ms, so the measurement is not the cause. Reading `lib/connected-studio/controller.ts` and the host scheduler (`createBrowserScheduler` in `ConnectedStudioEnhancement.tsx`) points at a probable cause, **a hypothesis not yet proven by a fix**: the active cadence is "due at the last render plus 16.67 ms", the host waits for that time with a timer and only then requests an animation frame, so a timer that lands just after a vsync pushes the frame to the next one and some frames take two refreshes (a 17.5 ms median with a 34 ms tail fits that pattern). Under the plan's budget rule this is a recorded defect: RED it, fix it within the approved design (for example by driving the 60 fps active cadence from the animation frame itself, not from a timer), and repeat the run. That touches the Task 7 host, so it needed the lock transfer the plan requires. **Follow-up, same day:** the owner asked for the fix after PR #138 merged, and [the frame-pacing receipt](task-9-frame-pacing.md) records it. The scheduler cause was confirmed and fixed (a virtual-display test failed with 7.1% of active intervals taking two refreshes and p95 33.3 ms, then passed), and on the hardware the median interval fell from 17.5 to 16.7 ms with 22% to 44% more frames, but only two of four later runs pass the 20 ms row (18.1 and 18.6 ms); two still fail at 32 to 33 ms. A second, unidentified cause in the live scene remains.

Other figures from the same run:

- **Live-tier vitals on the hardware** (`measure-connected-studio-vitals.mjs --hardware --expect-mode=live --profile=desktop`, ten journeys per locale, no override, Pause and Resume required): all 40 journeys went live by themselves; Services LCP p75 504 ms, INP p75 32 ms; Projects LCP p75 784 ms, INP p75 40 ms; enhancement layout shift 0 (unrounded); whole-page shift 0.
- **Cold and warm engine cost:** the two engine chunks are 560.3 KiB raw as the local server sends them (the Brotli size, 114.4 KiB, is gated by `measure:connected-studio`). A second connected route, loaded as a full navigation in the same context, served both engine chunks (2 of 2) and all 15 page chunks from the HTTP cache with no new download. Cache reuse is reported apart and never reduces the cold figure.
- **200% and 400% zoom (viewport-equivalent: 720x450 at DPR 2 and 320x256 at DPR 4, both pages, both locales):** no horizontal scroll, no overflowing element, the H1 inside the viewport and the Footer reachable in all 8 cases. Both widths fall in the compact tier, which this candidate keeps off, so the pages were static there: **live behavior under zoom is OPEN** until a compact candidate exists. This is not Ctrl-plus in the browser UI.
- **Contrast, measured from rendered pixels** (the text is hidden, the viewport screenshotted, and the WCAG ratio of the text colour against the pixels behind its box taken; the gate is the 5th percentile over the box, the single worst pixel is also recorded; text covered by another element is skipped): 362 samples across both pages, static and live, 0 below their requirement; lowest 5.5:1 against 4.5:1. This replaces the axe-only claim with a computed one; it is not a human review of the design, which the owner may still do.
- **Accessibility tree** (a proxy for assistive technology, not a screen-reader result): exactly one level-1 heading in both modes; one Pause button when live and none when static; the canvas and labels are not exposed.
- **Firefox:** with the same candidate, the page went live by itself with exactly one canvas and one Pause control. Firefox masks its renderer string ("GeForce GTX 980 … or similar" on this RTX 2060 machine), so this shows a non-software renderer, not a precise GPU. No timing or GPU figures were taken in Firefox. WebKit was not tried: it needs a hardware path that the owner's Safari provides.

## 7. Current status of every item

| Item | Status | Reason |
| --- | --- | --- |
| Desktop hardware (wide and tablet tier) | **NOT RELIABLY MET (candidate evidence), hidden OPEN** | before the pacing fix the active-scroll frame interval p95 was 34.1 ms against 20 ms on the RTX 2060 (section 6); after it, two of four runs pass (18.1, 18.6 ms) and two fail (33.3, 32.0 ms), see [the frame-pacing receipt](task-9-frame-pacing.md); every other measured row passes; the hidden checkpoint could not be reached by automation and needs a manual run |
| Android phone, ≤ 4 cores, Chrome (compact tier) | OPEN | not run; needs the phone |
| iPhone, Safari (compact tier) | OPEN | not run; needs the phone |
| NVDA with Firefox | OPEN | NVDA is not installed here and installing it is not part of this work; the accessibility-tree dump is a proxy only |
| VoiceOver on iOS | OPEN | needs the iPhone |
| Live behavior under real 200% zoom | OPEN | only the viewport-equivalent layout was checked, and only static (the compact tier is off) |
| Hardware live Firefox | partly done | live activation observed; no timings |
| Hardware live WebKit | OPEN | not run |
| Contrast | computed PASS, human review optional | 362 rendered-pixel samples, lowest 5.5:1 |
| Live-tier vitals | PASS on the desktop candidate | section 6; the compact tier has none |
| Warm-cache figures from a real live run | done on the desktop candidate | section 6 |
| `CONNECTED_LIVE_POLICY` | `{ wide: false, compact: false }` | OD-4: a tier is enabled only with passing evidence, and the wide tier fails the active-interval row in half of the runs |

The owner also stated on 2026-10-13 that the manual device checks of Task 8 were successful. That statement is recorded in the Task 8 and W6 receipts as the owner gave it; this repository holds no per-device sheet for it, so it is not repeated here as a PASS for any row above.
