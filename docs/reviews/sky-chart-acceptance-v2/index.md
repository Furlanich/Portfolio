---
id: REVIEW-SKY-CHART-ACCEPTANCE-V2
type: acceptance-review
status: APPROVED
related:
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
  - REVIEW-ADAPTIVE-IMMERSIVE-HOMEPAGE-ACCEPTANCE-V1
  - DESIGN-IX-A11Y
  - DESIGN-VISUAL
  - PAGE-HOME
  - TEST-PLAYWRIGHT
  - TEST-VISUAL-REGRESSION
last_verified: 2026-10-05
---

# Sky Chart Home and App Bar acceptance v2

## Boundary

This record is the Task 12 evidence for [PLAN-SKY-CHART-HOME-REDESIGN-V2](../../plans/completed/sky-chart-home-redesign-v2.md). It measures nothing new. It collects the automated evidence that the plan's checkpoints and PR #92 recorded for the merged implementation (`main` at `edf8330`, the W3 checkpoint), and it records the plan's section 26 manual protocol item by item. It changes no application behavior.

The plan's acceptance rule governs every line here: **no claim exceeds the recorded evidence.** Three states are used, and nothing is marked PASS without a recorded result:

- **PASS** — a recorded measurement or test result within the limit.
- **FAIL** — a recorded result outside the limit.
- **DEFERRED** — not yet performed. The item stays open and carries a checklist for the owner to fill in.

**Status: APPROVED on 2026-10-05, with manual QA DEFERRED.** The repository owner decided on 2026-10-05 to approve this record at the merge of the W4 follow-up PR ("Make it as APPROVED at merge"). That approval accepts the record **with its deferrals**. It is not a manual pass, and it does not turn any DEFERRED item into PASS. The automated evidence is final. No section 26 manual result existed on 2026-10-05, so **all six manual items and both hardware-GPU gates are DEFERRED**. That includes the real-device and screen-reader results that the previous immersive plan also deferred. The plan is marked COMPLETED with this deferral stated, as the previous plan was; the owner closes the remaining items by filling in the checklists below and updating this record. Before the approval, the owner also decided that Founder renders on an atlas plate, and the W4 follow-up implemented it (see "Checkpoint W4 and the owner's follow-up decisions" below).

## Summary

| Area | State |
| --- | --- |
| Checkpoints W0, W1, W2 and W3 on `main` | PASS (recorded in the plan's Progress) |
| Section 14 gates that automation can measure (11 of 13) | PASS |
| Section 14 hardware-GPU gates: scroll frame interval p95 ≤20 ms, interaction task <50 ms (2 of 13) | **DEFERRED**: only advisory SwiftShader numbers exist |
| Section 26.1 browsers, 26.2 real devices, 26.3 screen readers, 26.4 preferences, 26.5 content truth, 26.6 design fidelity | **DEFERRED** (none performed) |
| Constrained-Android evidence and a real screen-reader check, deferred by the previous plan | **Still open** |
| Checkpoint W4 (`npm run validate` on `main` at `e8703ee`, documentation synchronized) | PASS: see "Checkpoint W4 and the owner's follow-up decisions" below |
| Record status | **APPROVED** by the owner on 2026-10-05, with every manual item and both hardware-GPU gates still DEFERRED |

## Environment of the automated evidence

| Item | Value |
| --- | --- |
| Source | `main` at `edf8330` (PR #92 merge), recorded by checkpoint W3 in a clean worktree after a fresh `npm ci` |
| Host | Windows 11, Git Bash with `MSYS2_ENV_CONV_EXCL='NEXT_PUBLIC_BASE_PATH'` (W2 follow-up 4), nothing else listening on ports 3000–3199. The host has 4 cores, which the T-07 rule counts as constrained |
| Browsers | Playwright Test 1.63.0: Chromium, Firefox and WebKit. The runtime project (`immersive-chromium`) uses Chromium on the SwiftShader software backend |
| WebGL in automation | Software rendering only. The runtime reaches SwiftShader through an explicit test-only override of the software-renderer capability gate, per the amended ADR |
| Static serving | The measurement scripts build and serve the production export at the root base path. The `/Portfolio` build is covered by the acceptance spec and `verify:static-export` |
| Linux baselines | Adopted from CI actuals after owner approval, through a throwaway draft PR that was never merged (PR #95). A second throwaway draft PR (#98) produced a font-swap diagnosis and no baselines |

Software-rendered, headless Chromium is regression evidence. It is not mobile acceptance evidence (RFC validation section), and it says nothing about Firefox or WebKit canvases, which never activate the runtime in headless automation.

## Automated evidence

### Checkpoints

| Checkpoint | Commit on `main` | Result |
| --- | --- | --- |
| W0 | `102ef5b` | `npm run docs:check` green; plan, RFC and ADR APPROVED |
| W1 | `db25420` | `validate` green; `chromium-desktop` 116/116 with one worker (the default parallel run failed 1 of 116 on the known dev-server race); `verify:static-export` 20 routes; no rendered change (`visual-chromium` 22/22 against the unchanged baselines) |
| W2 | `4f63afa` | `validate` green (282 unit tests); `test:e2e` 1068 passed and 5 failed, all 5 passing serially; `/Portfolio` run 1070 passed and 3 failed, all passing serially except one real Pause-keyboard test defect that PR #90 fixed; `test:a11y` 16/16; `measure:immersive` ran three times; a manual look at the production build against the reference at 1440 and 390 found no deviation |
| W3 | `edf8330` | See below |
| W4 | `e8703ee` | `validate` green: `docs:check` 292 files, 98 IDs, 38 Skills; 291/291 unit tests; lint 0 errors; typecheck; build of 22 pages. The documentation matched the implementation except for the Founder item, which the owner then decided (below) |

### Checkpoint W3, in full

Run on `main` at `edf8330` in a clean worktree after a fresh `npm ci`.

| Command | Result |
| --- | --- |
| `npm run validate` | Green. `docs:check` 291 files, 97 IDs, 38 Skills; 291/291 unit tests; lint 0 errors; typecheck; build of 22 pages |
| `npm run test:e2e`, two workers | 1272 passed, 0 failed, 101 skipped (29.2 min), including the 142 acceptance tests |
| `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run test:e2e`, two workers | 1271 passed, 1 failed, 101 skipped (28.5 min). The failure was webkit-desktop `contact.spec.ts` "es-AR Contact preserves values through failure and retry": the form had not hydrated within 5 s, and the failure screenshot shows the `next dev` "Compiling…" badge. The spec alone on webkit at `/Portfolio`, `--repeat-each=10` with two workers, passed 140/140. It is the dev-server load flake class (W2 follow-up 3), outside this plan's paths, not a regression |
| `npm run test:a11y` | 16/16 |
| `sky-chart-acceptance.spec.ts`, `immersive-chromium`, one worker | 142/142 at the root and 142/142 under `/Portfolio`, where the base-path group resolves every link, poster and chunk and the runtime activates |
| `npm run verify:static-export` | 20 routes at base path `/`, and 20 routes at `/Portfolio` |
| `visual-chromium` | Passes inside both e2e runs against the committed, owner-approved baselines |
| Lifecycle | One canvas; listeners 516 → 518 over five remounts |

### Section 14 gates

`measure:immersive` ran three times and `measure:home-vitals` once at W3. Every run exits 0. Both scripts build the root base path only.

| Gate | Limit | W3 measurement | Result |
| --- | --- | --- | --- |
| Incremental immersive JavaScript (lazy runtime chunk plus `three`) | ≤120 KiB Brotli | 108.1 KiB in 3/3 runs (11.9 KiB headroom); the whole-page delta of 114.4 KiB is reported only | PASS |
| `AppBarBehavior` plus `PositionFixToggle` | ≤6 KiB Brotli | 1.33 KiB, Task 11's build comparison; neither leaf changed between `f7a8620` and `edf8330` | PASS |
| Environment posters | ≤150 KiB wide, ≤80 KiB compact | 59.15 KiB and 29.04 KiB (`immersive-media-manifest.test.mjs` green) | PASS |
| Canvas DPR | ≤1.5 wide, ≤1.25 compact or constrained | 1.25 at 1440 and 390 on a 3x profile (this 4-core host counts as constrained) | PASS |
| Draw calls per frame | ≤28 | Max 15 (p95 15) in `measure:immersive`; max 16 desktop and 7 mobile in the vitals journeys | PASS |
| Label textures | ≤20, each ≤1024×64 | 20, largest 398×64 | PASS |
| Scroll frame interval p95 | ≤20 ms on a hardware GPU | 199.9–200 ms under SwiftShader (167–183 ms in PR #92's runs): advisory | **DEFERRED**: section 26.2 device protocol |
| LCP p75 | ≤2.5 s, element H1 | Mobile 2040 ms static and 2028 ms enhanced; desktop 540 ms and 524 ms; H1 in all 60 journeys | PASS |
| INP p75 | ≤200 ms | Static (gated): 24 ms mobile, 16 ms desktop. Enhanced (advisory under SwiftShader): 104 ms and 32 ms | PASS |
| Layout shift from the enhancement | 0 | 0 in 3/3 `measure:immersive` runs and all 60 vitals journeys. Whole-page CLS (gated ≤0.1): 0 mobile and 0.0437 desktop, from the font swap at about 300–560 ms | PASS |
| Backdrop-filter surfaces, at each section (E1) | ≤3 | 3 at 320, 390, 768, 1024 and 1440. The informational sweep between sections reaches 4 at 768 and 1440. After the W4 follow-up put Founder on an atlas plate, Founder counts 1 at every width (it counted 0), and the sweep is unchanged | PASS |
| Idle rendering | 0 frames after settle | 0 settled in a chapter, 0 fully receded, 0 in the vitals journeys | PASS |
| Main-thread interaction task | <50 ms on a hardware GPU | Longest 62–71 ms under SwiftShader (81–152 ms in PR #92's runs): advisory | **DEFERRED**: section 26.2 device protocol |

How each number was measured is recorded in the [ADR amendment of 2026-10-05](../../decisions/sky-chart-homepage-runtime.md#amendment-2026-10-05-how-the-production-gates-were-measured) and in plan section 14. The two DEFERRED rows are gates only on a hardware-accelerated GPU, as the 2026-09-28 amendment requires. Software rasterizers fail the capability gate in production and show the static composition.

### Task 11 additions

- **Acceptance matrix:** 142 tests in `immersive-chromium` over Spanish and English at 320, 390, 768, 1024 and 1440 (groups listed in [Playwright QA](../../testing/playwright.md#sky-chart-home-acceptance-sky-chart-acceptancespects)).
- **Hero top versus header top:** the 2px gap between the hero and the header was found and fixed, and the spec now asserts a difference of at most 1px in every mode (RED `fb7e722`, GREEN `04c6d01`).
- **Web-font swap (owner decisions E2 and the cross-platform fallback):** whole-page CLS on the throttled mobile lab profile went from 0.1782 to 0, and desktop is 0.0436 to 0.0437 (the Instrument Sans swap, below the 0.1 line). The Linux font-swap group passes 10/10 after the Instrument Sans metric fallback (run 37304538202), and Windows is unchanged.
- **Visual baselines:** 42 Home-sections baselines and 10 refreshed instrument baselines, per platform, owner-approved (E3); six Problems baselines regenerated for the serif Greek Bayer letters (E5).
- **Coverage restored (N6):** multi-viewport journey, rotation during Connect and 200% zoom.

### Accessibility, automated

- axe (WCAG 2.x A/AA and 2.2 AA, critical and serious): `test:a11y` 16/16, and the acceptance spec's 20 axe tests cover Home in both locales at five widths with the enhancement off, on and playing, and on and paused. No serious or critical violation was recorded.
- Keyboard: the acceptance spec follows the plan's section 13 tab order to the footer at 1440 and 390 in both locales, with a visible focus ring that never lands under the App Bar. Pause sits right after the chapters and before the Problems action, and it is hidden and unreachable at the top of the page and once the page has receded.
- These are automated checks. They do not establish whole-site conformance, and they are not a substitute for section 26.3.

## Section 26 manual protocol

Every item below is **DEFERRED**: no manual result exists. Each table is a checklist. To close an item, fill in the date, tester, device or browser and version, and a result (PASS or FAIL with notes), then update the Summary and the Acceptance checklist. Record any FAIL as a defect against the owning task, not as a silent change.

### 26.1 Browsers at 1440 and 1024: DEFERRED

Chrome, Firefox and Safari (macOS if available). In both locales, walk Home forward, in reverse, Pause, Resume, and the Position fix toggle.

Automated context: Chromium on SwiftShader runs the full matrix. Firefox and WebKit run the functional smoke and `app-bar` and `home-sections` specs, but never activate the WebGL runtime in headless automation, so a real canvas in those engines has no automated coverage.

| Browser | Width | Locale | Forward and reverse | Pause and Resume | Position fix toggle | Result | Tester, date, version, notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chrome | 1440 | ES | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Chrome | 1440 | EN | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Chrome | 1024 | ES | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Chrome | 1024 | EN | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Firefox | 1440 | ES | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Firefox | 1440 | EN | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Firefox | 1024 | ES | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Firefox | 1024 | EN | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Safari (macOS) | 1440 | ES | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Safari (macOS) | 1440 | EN | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Safari (macOS) | 1024 | ES | _pending_ | _pending_ | _pending_ | DEFERRED | |
| Safari (macOS) | 1024 | EN | _pending_ | _pending_ | _pending_ | DEFERRED | |

### 26.2 Real devices: DEFERRED

One constrained Android device (four cores or fewer; this closes the previous plan's deferral) and one iPhone. No device or emulation substitute was available to automation, and the RFC does not accept emulation as a substitute.

For each device, check scroll smoothness, heat after three full traversals, label legibility, blur cost and the compact menu. Because this is also the only protocol that measures the two hardware-GPU gates, record those numbers here.

| Field | Constrained Android | iPhone |
| --- | --- | --- |
| Device model, OS, browser and version | _pending_ | _pending_ |
| Cores, memory class, viewport, DPR | _pending_ | _pending_ |
| Network profile, battery saver | _pending_ | _pending_ |
| Cold load in each locale: runtime activation and first frame (`immersive:*` marks) | _pending_ | _pending_ |
| Scroll smoothness over three full forward and reverse traversals | _pending_ | _pending_ |
| **Scroll frame interval p95 (gate ≤20 ms)** | _pending_ | _pending_ |
| **Longest main-thread interaction task (gate <50 ms)** | _pending_ | _pending_ |
| Heat after three full traversals; memory trend over five idle minutes | _pending_ | _pending_ |
| Label legibility (12px minimum, direct labels) | _pending_ | _pending_ |
| Blur cost: stutter where plates or the App Bar blur over the canvas | _pending_ | _pending_ |
| Compact menu: open, close and Escape | _pending_ | _pending_ |
| Rotation during Connect: the chapter, labels and one canvas persist | _pending_ | _pending_ |
| Hero on a slow load: **no visible jump when the web font arrives** (Roboto and Helvetica are approximate metric twins of Arial) | _pending_ | _pending_ |
| Result | DEFERRED | DEFERRED |

Suggested method: USB debugging with `chrome://inspect` on the deployed `/Portfolio/` site, a Performance recording for traversals and a Memory timeline for the idle period; Safari Web Inspector from a Mac for the iPhone. One device is a constrained sample, not a universal mobile claim.

| Hardware-GPU gate (section 14) | Limit | Hardware measurement | Advisory SwiftShader figure | State |
| --- | --- | --- | --- | --- |
| Scroll frame interval p95 | ≤20 ms | _pending_ | 199.9–200 ms (W3); 167–183 ms (PR #92) | DEFERRED |
| Main-thread interaction task | <50 ms | _pending_ | 62–71 ms (W3); 81–152 ms (PR #92) | DEFERRED |

A hardware-GPU runner is an accepted alternative to a device for these two gates. Whichever is used, record it here.

### 26.3 Screen readers: DEFERRED

NVDA with Firefox on Windows, and VoiceOver on iOS. No screen reader was available to automation. The automated accessibility-tree and axe checks above do not replace this.

| Check | NVDA and Firefox | VoiceOver iOS |
| --- | --- | --- |
| Landmarks: banner, main, contentinfo and the navigation | _pending_ | _pending_ |
| Heading list: one H1, then the chapter H2s and the section H2s, with H3s in Services and Process | _pending_ | _pending_ |
| Problems list: three situations read as a list, with no decorative letters, bearings or glyphs read | _pending_ | _pending_ |
| Position fix: both figures announce their title and their description | _pending_ | _pending_ |
| Position fix: toggling announces "Showing: …" once, and nothing is announced on page load | _pending_ | _pending_ |
| Proof log: the labelled list of three lines reads cleanly | _pending_ | _pending_ |
| Pause button: its state is announced (the label swaps between Pause and Resume, and `aria-pressed` changes) | _pending_ | _pending_ |
| Decorative layers (canvas, coordinates, plate numbers, readout) are not announced | _pending_ | _pending_ |
| Result | DEFERRED | DEFERRED |

### 26.4 Preferences: DEFERRED

| Preference | Automated evidence (emulation only) | Real-environment result |
| --- | --- | --- |
| Reduced motion | Acceptance spec: static composition, poster, no canvas, instant scrim recede, five widths in both locales | DEFERRED |
| Reduced transparency (macOS) | Acceptance spec: plates turn opaque `#0D243C` and sheets `#F9F6EE`, blur gone, with the CDP media emulation. `app-bar.spec.ts` covers the App Bar | DEFERRED: no macOS setting was exercised |
| Forced colours (Windows High Contrast) | `app-bar.spec.ts` and `home-sections.spec.ts` emulate `forcedColors: 'active'` | DEFERRED: no Windows High Contrast theme was exercised |
| 200% zoom | Acceptance spec at 720×450, 512×384 and 384×512: the hero grows and nothing clips. A root-font-size text-zoom emulation was deliberately not encoded, because at `html{font-size:200%}` the rem-sized App Bar and the Process plates overflow horizontally and that emulation is not what a text-zoom user gets | DEFERRED: browser zoom and text-only zoom both need a look |
| 320px viewport | Acceptance spec (journeys and the no-JavaScript document at 320) and the `compact-320-chromium` project: no horizontal overflow | DEFERRED |

### 26.5 Content truth: DEFERRED

Every illustrative element shows its tag, and no number is presented as a measurement.

- **Automated:** `verify:static-export` requires the Position fix section and its twin "Illustrative scenario" tags in both locales, and `position-fix.test.mjs` derives the counts from the five fixed sources. `ImpactCounts` carries the caption "They are not measurements" (Spanish: "No son mediciones"). The static-export forbidden patterns still reject `metric-card`, `case-study` and `testimonial` identifiers.
- **Manual read-through of both locales:** DEFERRED. Check the figure and the counts for the tag, the example sources for an invented figure, percentage, duration, currency or client name, and Proof for any claim that reads as a result.

| Locale | Position fix figure tagged | Counts tagged and captioned | No invented number or client | Result |
| --- | --- | --- | --- | --- |
| ES | _pending_ | _pending_ | _pending_ | DEFERRED |
| EN | _pending_ | _pending_ | _pending_ | DEFERRED |

### 26.6 Design fidelity: DEFERRED

The protocol is a side-by-side comparison with `docs/reviews/sky-chart-direction-2026-09-23/reference/sky-chart-reference.html` at 1440 and 390, section by section, using the `visual-qa` Skill, recording any deviation with its reason.

Recorded partial evidence, which does not satisfy this item: at checkpoint W2 the orchestrator looked at the production build with the runtime active at 1440 and 390 (hero, a chapter, Position fix, Process and the Dawn CTA) and found no deviation; the orchestrator's fidelity check on PR #82 (which led to the trust-row width fix) and Task 9's by-eye check at 768 are also on record. Problems, Services, Proof, Founder, the docked App Bar and the compact menu are not recorded against the reference. Since then, E1, E5, the `em` caps and the header box changed some values (see "Known deviations from the plan's design" below).

| Section | 1440 | 390 | Deviation and reason |
| --- | --- | --- | --- |
| App Bar: Home top (transparent), docked, compact menu | _pending_ | _pending_ | |
| Hero | _pending_ | _pending_ | |
| Chapters (four plates) and the label field | _pending_ | _pending_ | |
| Problems cascade | _pending_ | _pending_ | |
| Services | _pending_ | _pending_ | |
| Position fix | _pending_ | _pending_ | |
| Proof log | _pending_ | _pending_ | |
| Process ecliptic | _pending_ | _pending_ | |
| Founder | _pending_ | _pending_ | |
| Dawn CTA and footer | _pending_ | _pending_ | |
| Pause pill | _pending_ | _pending_ | |
| Result | DEFERRED | DEFERRED | |

## Known deviations from the plan's design

These are owner-approved or orchestrator-recorded changes made during delivery. The one implementation difference with no recorded decision is listed under "Open items carried forward". The plan's section 6 and DESIGN-VISUAL carry the dated amendment markers.

- **E1:** D-08 is gated per section, with the between-section sweep informational.
- **E5:** the Bayer letters use a serif Greek stack at 17px, amending D-13.
- **`em` hero caps:** D-11's 13ch and 46ch are set as `8.866em` and `30.636em`.
- **Header box:** `header[data-app-bar]` is exactly 84px at every width (the bar surface is 66px at 1024px and wider, 62px below).
- **Hover contrast:** Bone on `#0A55A3` is 6.84:1 (AA), not 7:1.
- **Coordinates:** the minute sign is the ASCII apostrophe.
- **N12–N14:** Pause sits right after the chapters in tab order; the scrim recedes instantly in static-with-JavaScript paths; tier-2 labels fade where they would cross hero text.
- **Static-only on software renderers:** a visitor on a software rasterizer (SwiftShader, llvmpipe, softpipe, the Microsoft Basic Render Driver) sees the static composition.
- **Figma drift (plan section 30):** the [Figma mirror](https://www.figma.com/design/V6FD6Sq3gqqxeMw5Si7Dnx) was a snapshot of the plan at Gate F and has **not** been updated. It still shows the original D-13 (mono 15px Bayer letters), and it predates N12 (Pause tab order), N13, N14 and the amended D-08. The `em` caps, the header box and the coordinates apostrophe have no visible effect on the mirror. The drift is recorded here, as the plan allows, and no Figma update was made.

## Open items carried forward

- **OPEN:** the whole of section 26, above, including the constrained-Android and real screen-reader checks that the previous plan deferred.
- **OPEN:** hardware-GPU numbers for the frame-interval and interaction-task gates.
- **Resolved 2026-10-05 (owner decision): Founder now renders on an atlas plate.** `HomeFounder.tsx` had rendered the 8/4 editorial grid directly over the environment, which differed from approved D-05, supersession item 13 and D-18. The owner decided: "Add the plate in the code in order to complete the implementation of the current plan. This will be later changed once the services-projects-footer-v1 execution plan is implemented." The W4 follow-up wraps the whole grid, action included, in one `AtlasPlate` (default blur, no plate number). The approved design text is unchanged, and the plate is expected to change again under `PLAN-SPF-V1`.
- **Note: gate order.** The ADR lists the capability gates as reduced motion, Save-Data, WebGL2, the software-renderer check, the session context-lost flag, near-viewport, then `load`. `ImmersiveEnhancement` evaluates them in a different order: reduced motion first, then the near-viewport observer, then the `load` event, and only then Save-Data, the WebGL2 probe with the software-renderer check, and the session context-lost flag. There is no behavioural consequence, because every gate must pass before the runtime is imported.
- **OPEN:** the Roboto and Helvetica fallbacks for Instrument Sans are approximate, not metric clones. The Android pass must confirm there is no visible hero jump on a slow load.
- **OPEN (section 30):** real-device thermal behaviour of a full-viewport canvas plus backdrop-filter on low-end Android, and the press-scale feedback recommendation, which conflicts with the approved no-scale rule.
- **Limit:** Firefox and WebKit canvases are untested in automation.
- **Limit:** local two-worker runs can flake under `next dev` load. CI runs with one retry and a 30-minute browser budget.
- **Limit:** the Plex Mono subset has no Greek, so Greek in the mono face would fall back; the Bayer letters avoid that with the serif stack.
- **Resolved 2026-10-05: stale comments.** The two code comments that pointed at the plan's former path under `docs/plans/active/` (`components/homepage/impact/position-fix.module.css` and `lib/impact/position-fix.ts`) now cite `docs/plans/completed/sky-chart-home-redesign-v2.md`.

## Definition of done (plan section 29)

| Criterion | State |
| --- | --- |
| Tasks 1–12 merged by the owner; W0–W4 green and recorded | Tasks 1–12 merged and W0–W4 recorded. The remaining owner decisions (Founder plate, this record APPROVED, two comment fixes) land in the W4 follow-up PR, and the criterion is met when the owner merges it |
| Every section 14 gate within limits on the production build, on both base paths | PASS for the 11 automatable gates (the measurement scripts cover the root build; `/Portfolio` is covered by the acceptance spec and `verify:static-export`). **Not yet met** for the two hardware-GPU gates (DEFERRED) |
| Home in ES and EN matches D-01 to D-27 at 320, 390, 768, 1024 and 1440, verified by automated tests and the manual protocol | Automated: PASS (acceptance matrix, Home-sections and instrument baselines). Manual protocol: **DEFERRED** |
| The App Bar matches D-22 on every localized route, with and without JavaScript | Automated: PASS (`app-bar.spec.ts` in the W3 e2e runs, acceptance spec, baselines for the non-Home pages). Manual: DEFERRED |
| No invented evidence; every illustrative element labelled | Automated checks: PASS. Manual read-through: DEFERRED |
| Records synchronized (section 27) | Done by Task 12, and updated by the W4 follow-up for the Founder plate and this record's status |
| The acceptance record states the real-device and screen-reader results honestly | Done: both are DEFERRED, with checklists |

## Acceptance checklist

| Criterion | State |
| --- | --- |
| Both locales, five widths, forward and reverse, resize and orientation, handoff, final CTA | PASS (automated) |
| Reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, failed import, context loss, software renderer | PASS (automated) |
| Keyboard, Pause and Resume, visible focus, 200% zoom (viewport emulation), source order, axe | PASS (automated) |
| Root and `/Portfolio`, static export, direct entry, language switch, assets, fragments | PASS (automated) |
| `measure:immersive` and `measure:home-vitals` gates | PASS |
| Scroll frame interval p95 and interaction task on a hardware GPU | DEFERRED |
| Real screen-reader check (NVDA with Firefox, VoiceOver iOS) | DEFERRED |
| Constrained Android device and iPhone | DEFERRED |
| Chrome, Firefox and Safari walk-through at 1440 and 1024 | DEFERRED |
| Reduced transparency, forced colours and browser zoom in real environments | DEFERRED |
| Content-truth read-through | DEFERRED |
| Side-by-side design fidelity at 1440 and 390 | DEFERRED |
| G2 / Connection film | Withdrawn by the RFC (supersession item 17); no video exists |

## Checkpoint W4 and the owner's follow-up decisions

**Checkpoint W4** ran on `main` at `e8703ee` (PR #100, Task 12) in a clean worktree after a fresh `npm ci`. `npm run validate` was green: `docs:check` 292 files, 98 IDs, 38 Skills; 291/291 unit tests; lint 0 errors; typecheck; build of 22 pages. The documentation matched the implementation except for the Founder item, which was then open.

On 2026-10-05 the owner decided the three open items, and the follow-up branch `codex/sky-chart-w4-founder-plate` applies them:

- **Founder atlas plate (code, test first).** RED `4cafc66`, GREEN `7e7b35e` (`home-sections.spec.ts`, ES and EN). Founder's backdrop-filter surfaces go from 0 to 1 at every width, within the per-section limit of 3, and the sweep stays at a maximum of 4. The six win32 Founder baselines were regenerated. The taller Founder moves the Dawn CTA, so four win32 Dawn CTA baselines were regenerated as well, in a separate commit. The Linux baselines are not changed here.
- **This record is APPROVED**, with every section 26 item and both hardware-GPU gates still DEFERRED.
- **The two stale code comments** now cite the completed plan.

Verification of the follow-up, run fresh in its worktree on Windows with `PLAYWRIGHT_PORT=3140` (nothing else listening there):

| Command | Result |
| --- | --- |
| `npx playwright test tests/e2e/home-sections.spec.ts` (all projects that run it) | 198 passed, 18 skipped, 0 failed. The new Founder test passes in ES and EN in every project |
| `npx playwright test --project=visual-chromium` | 64/64 with one worker. The default parallel run failed 1 of 64 (the Spanish project-detail compact baseline), the known `next dev` compile race on `/proyectos/the-system/`, and it passed serially |
| `sky-chart-acceptance.spec.ts`, `immersive-chromium`, one worker | 142/142 at the root |
| `npm run test:a11y` | 16/16. The acceptance spec's 20 axe tests, with the enhancement off, on, playing and paused, are inside its 142 |
| `npm run measure:immersive` | Exit 0. `backdropSurfaces` at Founder: 1 aligned and 1 centred at 320, 390, 768, 1024 and 1440 (it was 0). Maximum at any section: 3. The sweep maximum is 3 at 320, 390 and 1024 and 4 at 768 and 1440, as before (informational cap 5). Lazy runtime chunk headroom 11.9 KiB |
| `npm run verify:static-export` | 20 routes at base path `/` |
| `npm run validate` | Green, run last on the final tree. `docs:check` 292 files, 98 IDs, 38 Skills; 291/291 unit tests; lint 0 errors (282 warnings, all in vendored Skill scripts); typecheck; build of 22 pages |

The follow-up changes no budget, no dependency and no application path outside `HomeFounder.tsx` and two comments. Section 26 stays DEFERRED.

## Task 12 documentation check

Recorded when the documentation was synchronized, on branch `codex/sky-chart-task-12-docs` cut from `dd94ec0`:

| Command | Result |
| --- | --- |
| `npm run docs:check` | Passed: 292 Markdown files, 98 document IDs, 38 Skills |
| `npm run validate` | Passed: documentation check as above; 291/291 Node tests; lint with 0 errors (282 warnings, all in the vendored `impeccable` Skill scripts under `.agents/`, `.claude/` and `.github/`); typecheck; build of 22 pages |

These are documentation-only changes: no code, test, configuration, snapshot or package file changed, so no Playwright, `verify:static-export` or `measure:*` command was re-run. The evidence above is the W3 record. After the owner merges Task 12, checkpoint W4 is the same `npm run validate` on `main`.
