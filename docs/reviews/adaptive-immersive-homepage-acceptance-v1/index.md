---
id: REVIEW-ADAPTIVE-IMMERSIVE-HOMEPAGE-ACCEPTANCE-V1
type: acceptance-review
status: APPROVED
related:
  - PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - DESIGN-IX-A11Y
  - DESIGN-VISUAL
  - PAGE-HOME
last_verified: 2026-09-23
---

# Adaptive immersive homepage acceptance v1

## Boundary

This record is the PR8 evidence for [PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1](../../plans/completed/visual-identity-adaptive-immersive-v1.md) Tasks 8.1–8.3. It measures the merged implementation (PRs #65–#72) against the production gates in [ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE](../../decisions/adaptive-immersive-homepage.md) and the acceptance list in [DESIGN-IX-A11Y](../../design/interaction-responsive-accessibility.md#immersive-home-v11-adaptive-hybrid-interaction-approved). It changes no application behavior.

**Status: APPROVED as the v1 closure record, with deferrals.** The automated desktop/responsive matrix, both base paths, static export, budgets and synthetic lab vitals pass. On 2026-09-23, after [PR #73](https://github.com/Furlanich/Portfolio/pull/73) merged, the repository owner closed this plan and moved the remaining corrections and improvements to a new execution plan: the constrained Android evidence, a real screen-reader spot check and the compact Pause-control placement. These items were not collected or changed here and are not recorded as PASS.

## Environment

| Item | Value |
| --- | --- |
| Source | `main` at `9ea1f1c` (PR #72 merge) plus this branch's test and measurement additions |
| Host | Windows 11 Pro 10.0.26200, Node 24.14.0 |
| Browsers | Playwright 1.63.0: Chromium 153.0.8010.12 headless shell, Firefox 155.0, WebKit 26.6 |
| WebGL in automation | Chromium uses SwiftShader (`--use-angle=swiftshader`); Firefox and WebKit reach WebGL on this host without flags |
| Static serving | `out/` served locally at the root and mounted under `/Portfolio`, with `PLAYWRIGHT_BASE_URL` pointing Playwright at it |

Headless and software-rendered Chromium is regression evidence. It is not mobile acceptance evidence (RFC validation section).

## Task 8.1 — desktop and responsive matrix

`tests/e2e/immersive-home-acceptance.spec.ts` adds the journey-level checks to the existing runtime contracts in `immersive-home.spec.ts`. Both run in the `immersive-chromium` project.

| Requirement | Evidence | Result |
| --- | --- | --- |
| Both locales, initial viewport, four chapters forward and reverse, handoff into Problems, final CTA | One journey per locale at 320×800, 390×844, 768×1024, 1024×768 and 1440×900: H1 in the first viewport, WebGL activation, each chapter forward then back, Problems heading clear of the stage, final `#cta` link to the localized Contact page, no horizontal overflow, no failed asset and no console error | PASS (10/10) |
| Resize and orientation | 1440 → 390 → 1024 keeps the chapter (existing); 390×844 → 844×390 → 390×844 during Connection keeps Connection and one canvas in both locales | PASS |
| Normal, reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, failed import, context loss | Existing `immersive-home.spec.ts` fallbacks plus `immersive-home-static.spec.ts` | PASS |
| Blocked or absent video | No Connection film exists (see G2 below). With the enhancement active at 390 px, Connection requests no media, renders no `<video>` and its frame is covered by the canvas or its poster, never empty | PASS |
| Keyboard only, Pause/Resume, visible focus | From the secondary hero action, Tab reaches Pause next; the focus ring is drawn; Space pauses and Enter resumes on the same focused control; the next Tab stop is outside the stage and never the canvas | PASS (both locales) |
| 200% zoom | 720×450 CSS viewport (1440×900 at 200%): all four chapters render, headings and descriptions stay clear of the stage, no horizontal overflow, Pause visible | PASS (both locales) |
| Source order and screen-reader spot check | Enhanced accessibility tree: one H1 then the four chapter H2s, the Pause button present, no image or canvas exposed | PASS as an automated tree check. A real screen reader was not available to the agent: **DEFERRED** to the follow-up plan |
| Color-independent state | Chapter state is text (`ETAPA 0n DE 04` / `PHASE 0n OF 04`) and Pause state is the button's visible name; `data-state` is supplementary | PASS |
| Representative axe scan | Enhanced Home in both locales, playing and paused, WCAG 2.0/2.1/2.2 A/AA tags: no critical or serious violation. `test:a11y` also scans the static Home pair | PASS |
| Root and `/Portfolio`, static export, direct entry, language switch, fragments | `verify:static-export` passes for 20 routes at both base paths. Direct entry, header language switch with reactivation, and every same-document fragment on Home resolve at both base paths | PASS |

### Complete suite against the static exports

The whole Playwright configuration was run against each served export (828 tests; 80 are project-skipped by design).

| Base path | Passed | Failed | Disposition |
| --- | ---: | ---: | --- |
| Root | 730 | 18 | All 18 are the Contact zero-transmission case (below) |
| `/Portfolio` | 728 | 20 | The same 18, plus two Firefox `browserContext.close` protocol errors that passed on rerun (4/4) |

Every immersive, smoke, navigation, responsive, accessibility and visual test passed at both base paths.

### Cross-engine

Firefox and WebKit activate WebGL on both Home routes with one canvas and no page error, and pass the existing `immersive-home-smoke.spec.ts`. The full forward/reverse matrix runs on Chromium only. Safari on iOS and Firefox on Android were not tested.

## Task 8.2 — constrained Android evidence

**DEFERRED to the follow-up execution plan.** No Android device or `adb` bridge was available to the agent, and the RFC does not accept emulation as a substitute. The fields below are the template for that plan: one lower/mid-range device on current Chrome.

| Field | Value |
| --- | --- |
| Device model, OS, Chrome version | _pending_ |
| Memory class, viewport, DPR | _pending_ |
| Network profile, battery saver | _pending_ |
| Cold load, each locale: activation and first frame (`immersive:*` marks) | _pending_ |
| 20 forward/reverse traversals: frame-interval p95, long tasks, input responsiveness | _pending_ |
| Rotation during Connection | _pending_ |
| Background/foreground, then five minutes idle: memory trend, thermal observation | _pending_ |
| Video decoder count and any quality reduction | _pending_ (no video in v1) |

Suggested method: USB debugging with `chrome://inspect` on the deployed `/Portfolio/` site, a Performance recording for traversal and a Memory timeline for the idle period. One device is a constrained sample, not a universal mobile claim.

### 768 px sticky verdict

The sequential 768 px composition remains in v1, and no local sticky interval is added. The plan allows one only after real-device evidence shows no regression, and none exists yet. Visual QA at 768×1024 showed the sequential chapters reading cleanly with the stage below each description.

## Task 8.3 — production budgets

### `measure:immersive`

Raw output: `measure-immersive.json` in this folder.

| Gate | Limit | Measured | Result |
| --- | ---: | ---: | --- |
| Incremental immersive JavaScript | ≤120 KiB Brotli (owner-accepted 6 KiB headroom) | 114.0 KiB (lazy runtime 106.7 KiB), headroom 6.0 KiB | PASS |
| First poster | ≤150 KiB | 2.21 KiB | PASS |
| Scroll frame interval p95 | ≤20 ms | 16.7 ms | PASS |
| Main-thread interaction task | <50 ms | none | PASS |
| Layout shift | 0 | 0 | PASS |
| Playing videos | ≤1 | 0 | PASS |
| Canvases and listeners after 20 traversals and 5 remounts | 1 canvas, no growth | 1 canvas, 380 → 381 listeners | PASS |

Activation reached the first frame at 744 ms. The two activation tasks (55 and 73 ms, SwiftShader shader compilation) are reported but not gated, as recorded in the plan's PR6 measurement definitions.

### Synthetic LCP and INP (lab, not field data)

`npm run measure:home-vitals` runs 10 cold journeys per locale per profile against the gzip-served export with WebGL active: load, settle, Pause and Resume, two Tab presses and scrolling. INP is the slowest interaction in each journey. Raw output: `home-web-vitals.json` in this folder.

| Profile | Journeys | LCP p75 | INP p75 | CLS max | LCP element |
| --- | ---: | ---: | ---: | ---: | --- |
| Mobile: 390×844, DPR 3, 4× CPU, Lighthouse Slow 4G applied (562.5 ms, 1.47 Mbps) | 20 | 1,700 ms | 40 ms | 0 | H1 |
| Desktop: 1440×900, 1× CPU, Lighthouse desktop applied (150 ms, 9.2 Mbps) | 20 | 440 ms | 24 ms | 0 | H1 |

Both pass the ≤2.5 s LCP and ≤200 ms INP ceilings. Chrome's CDP throttling does not delay the navigation document, so the lab server charges it one request latency plus transfer time. A stricter trial that also charged three extra handshake round trips on mobile (4 journeys) measured LCP p75 2,892 ms. That double-counts setup already folded into the applied latency, but it shows the mobile margin depends on network assumptions. The LCP element is the H1 in every journey, so the immersive runtime (loaded after `load`) does not influence LCP.

### Repository gate

| Command | Result |
| --- | --- |
| `npm run validate` | PASS: documentation check, 140/140 Node tests, lint, typecheck, build |
| `npm run test:e2e` (dev server) | PASS: 748 passed, 80 skipped by project, 0 failed |
| `npm run test:a11y` | PASS: 16/16 |
| `npm run verify:static-export`, root and `/Portfolio` | PASS: 20 routes each |
| `npm run measure:immersive` | PASS (above) |
| `npm run measure:home-vitals` | PASS (above) |

## G2 / PR7 disposition

No Connection film was produced or reviewed, so PR7 is omitted: optional asset absent; static chapter closes without an empty frame. The Connection chapter shows its poster or the canvas, requests no media and holds no video element. The film's asset, shot list, tool, codec and renditions remain OPEN for a later governed PR.

## Visual QA

This section records judgment, not approval. Screenshots of both locales at the five widths, with WebGL active, covered the first view, Fragmentation, Connection, Coordination and the Problems handoff.

- The first view leads with the proposition and actions at every width. The stage never displaces the H1 or the primary action.
- At 1440 and 1024 the sticky 4:5 stage sits beside the spine and releases before Problems with clear ground. From 768 down the stage follows each chapter's description in normal flow.
- The derived slabs read as a sculpture of the mark, not the protected master: extruded, uncontained and separated by chapter. Recognition and Coordination are the closest to the mark's silhouette, as the approved PR5 poster direction intends.
- **Observation (minor, deferred to the follow-up plan):** below 1024 px the Pause control sits over the lower-left of the canvas and covers part of the sculpture (signal nodes in Coordination at 320/390). No copy is covered and the control stays legible. Moving it outside the frame would be a presentation change and belongs to a later PR if wanted.

## Findings outside this PR

- **Windows export layout for segment prefetches.** A local Windows `next build` writes router segment files as nested directories (`__next.!KGVzKQ/__PAGE__.txt`), while the client requests dotted names (`__next.!KGVzKQ.__PAGE__.txt`). The deployed GitHub Pages build (Linux) serves the dotted names with 200 and the nested form with 404, so production is unaffected. Local export previews on Windows need the mapping that `measure-home-web-vitals.mjs` applies.
- **Contact zero-transmission test and production prefetch.** `contact.spec.ts` treats every `fetch` as a possible inquiry transmission. Against a production export, Next's same-origin route prefetches (`GET …/__next.*.txt`, the header's route documents) are fetches, so the case fails although no inquiry value leaves the page. Under the dev-server harness it passes. The test should exclude same-origin router prefetches or assert on inquiry values; that is a Contact harness change, not a PR8 change. **Resolved in [PR #74](https://github.com/Furlanich/Portfolio/pull/74):** the case now asserts zero inquiry transmission and passes under the dev server and against both served exports.
- **Dev-server acceptance runs.** The first acceptance run against `next dev` spent 25 s in Fast Refresh during the axe and language-switch cases. Those two cases are marked `test.slow()`; the evidence above uses the static exports.

## Acceptance checklist

| Criterion | State |
| --- | --- |
| Both locales, five widths, forward/reverse, resize/orientation, handoff, final CTA | PASS |
| Reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, context loss, absent video | PASS |
| Keyboard, Pause/Resume, visible focus, 200% zoom, source order, color-independent state, axe | PASS |
| Real screen-reader spot check | DEFERRED (follow-up plan) |
| Root and `/Portfolio`, static export, direct entry, language switch, assets, fragments | PASS |
| `measure:immersive` gates | PASS |
| Synthetic LCP p75 ≤2.5 s and INP p75 ≤200 ms over ≥20 journeys | PASS (lab) |
| Constrained Android device evidence | DEFERRED (follow-up plan) |
| 768 px sticky verdict | Sequential retained; revisit only with Android evidence |
| G2 / PR7 disposition | Omitted |
