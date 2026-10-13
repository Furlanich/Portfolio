# Task 9 — hardware and screen-reader protocol (owner-executed, OD-4)

Status: **prepared, not run.** The owner stated on 2026-10-13 that Task 9's hardware evidence is not necessary for now ([plan Progress](../../plans/active/services-projects-footer-v1.md#progress)). Under OD-4 the items below therefore stay **OPEN** and both `CONNECTED_LIVE_POLICY` tiers stay `false`. Nothing here is a result. Run it when a tier is to be turned on; that turn-on is a bounded follow-up PR (Claude Sonnet 5.5 implements, GPT-6.1 Sol reviews, the owner merges) that carries the filled sheet.

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

## 6. Current status of every item

| Item | Status | Reason |
| --- | --- | --- |
| Desktop hardware (wide and tablet tier) | OPEN | not run; the owner deferred hardware evidence on 2026-10-13 |
| Android phone, ≤ 4 cores, Chrome (compact tier) | OPEN | same |
| iPhone, Safari (compact tier) | OPEN | same |
| NVDA with Firefox | OPEN | same |
| VoiceOver on iOS | OPEN | same |
| `CONNECTED_LIVE_POLICY` | `{ wide: false, compact: false }` | OD-4: a tier is enabled only with passing evidence |

The owner also stated on 2026-10-13 that the manual device checks of Task 8 were successful. That statement is recorded in the Task 8 and W6 receipts as the owner gave it; this repository holds no per-device sheet for it, so it is not repeated here as a PASS for any row above.
