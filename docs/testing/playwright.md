---
id: TEST-PLAYWRIGHT
type: testing-guidance
status: APPROVED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - TEST-STRATEGY
  - TEST-VISUAL-REGRESSION
  - DESIGN-IX-A11Y
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-ACCEPTANCE-V2
  - PLAN-SPF-V1
  - DESIGN-SPF-V1
last_verified: 2026-10-20
---

# Playwright QA

`playwright.config.ts` owns a fixed local origin, Next.js development-server startup, normalized optional base path, conservative parallelism, CI-only retry, and failure evidence. Install matching browser binaries after `npm ci` with `npx playwright install chromium firefox webkit`. CI instead runs its browser job in the official `mcr.microsoft.com/playwright:v1.63.0-noble` container, so it installs no browsers or system libraries per run; the image tag must equal the locked `@playwright/test` version and be changed with it, `npm ci` still runs, and the full `npm run test:e2e` is unchanged ([Playwright CI containers](https://playwright.dev/docs/ci#via-containers), [Docker](https://playwright.dev/docs/docker)).

## Direct-contact amendment — APPROVED 2026-10-18

[ADR-CONTACT-DIRECT-CHANNELS](../decisions/contact-direct-channels.md) removes the embedded form from both Contact routes. Its old field, validation, submit/state, simulation and processor/counsel activation requirements are superseded for the current release. Native WhatsApp/email/phone links, no-JavaScript behavior and ordinary keyboard/focus/reflow checks govern Contact. The historical candidate project name contact-commercial now exercises direct channels; only the runtime candidate needs live-policy patches.

## Commands

- `npm run test:e2e` — complete matrix.
- `npm run test:e2e:ui` — local Playwright UI mode.
- `npm run test:e2e:headed` — headed browsers.
- `npm run test:a11y` — accessibility project only.
- `npx playwright show-report` — inspect the latest HTML report.

Set `NEXT_PUBLIC_BASE_PATH=/Portfolio` to reproduce GitHub Pages routing. The config includes that prefix in its `baseURL`, passes it to the owned server, and test helpers create relative URLs. `PLAYWRIGHT_BASE_URL` is reserved for an intentionally managed external server; the ordinary workflow lets Playwright start and stop the server.

## Project matrix

| Project | Scope |
| --- | --- |
| `chromium-desktop` | Important localized routes and navigation at 1440×900 |
| `firefox-desktop` | Same functional smoke |
| `webkit-desktop` | Same functional smoke |
| `mobile-chromium` | Responsive behavior at 390×844, including exact link-focus progression |
| `mobile-webkit` | Representative Mobile Safari/WebKit profile and keyboard disclosure activation |
| `tablet-chromium` | 1024×768 breakpoint behavior |
| `wide-chromium` | 1440×900 responsive composition |
| `accessibility-chromium` | Axe and representative structural/keyboard assertions |
| `immersive-chromium` | `immersive-home.spec.ts`, `immersive-home-acceptance.spec.ts` and `sky-chart-acceptance.spec.ts` (the Home acceptance matrix, described below), at 1440×900 on the SwiftShader software backend (`--use-angle=swiftshader --enable-unsafe-swiftshader`) |
| `visual-chromium` | Reduced-motion element baselines under `tests/e2e/visual/`, including `home-sections.visual.spec.ts` (see [visual regression](visual-regression.md)) |
| `connected-production-chromium`, `sfc-production-{chromium,firefox,webkit}` | Only when `PLAYWRIGHT_SERVE_EXPORT=1`: `connected-studio-production.spec.ts` (Chromium) and `sfc-production.spec.ts` (three engines) at 1440×900 against the served clean static export. In that mode they are the only projects (see [Production serving](#production-serving)). |
| `contact-commercial-{chromium,firefox,webkit}`, `sfc-runtime-chromium` | Only with `SFC_TEST_MODE=candidate`: the commercial inquiry and new-route runtime families against the QA candidate patches (see [PLAN-SFC-V1 harness](#plan-sfc-v1-harness-and-qa-candidate)). In that mode they are the only projects. |

Mobile WebKit link tabbing depends on host Safari Full Keyboard Access, so exact first-link Tab order is asserted in mobile Chromium. Both mobile engines verify disclosure activation and dismissal by keyboard.

## Connected studio specs (PLAN-SPF-V1)

PR #126 correction coverage also checks initially hidden activation, both disabled-tier resize directions, and a retained Home renderer beyond the bounded deferral. The Node host suite executes the actual React effect with a deferred optional-module promise to test changed preferences/session/policy/visibility, cancellation, eligible attachment and import rejection. Navigation regressions use the shipped smooth-scroll CSS: ordinary Services/Projects links from Header, Footer and page content use the existing `#site-top` target and land at the top in both locales. The render-nothing `PageTopNavigation` leaf finishes an explicit click after Next's layout scroll/focus; modified clicks and browser history do not request this reset. Intentional dossier and service-section fragments retain their anchor behavior.

`playwright.config.ts` registered the connected-studio spec families for Services, Projects and the shared Footer ahead of the specs themselves, so each task added its spec without a config change. All of them now exist (PLAN-SPF-V1 Tasks 3 to 9) and every row below lists tests; "no tests found" is never a pass for a spec that exists. `scripts/connected-studio-harness.test.mjs` asserts this table against the listed project configuration.

| Spec (`tests/e2e/`) | Projects |
| --- | --- |
| `connected-studio-static.spec.ts` | `chromium-desktop`, `firefox-desktop`, `webkit-desktop`, `mobile-chromium`, `mobile-webkit`, `tablet-portrait-chromium`, `tablet-chromium`, `compact-320-chromium` |
| `connected-studio-services.spec.ts` | `chromium-desktop`, `firefox-desktop`, `webkit-desktop`, `mobile-chromium`, `tablet-portrait-chromium`, `compact-320-chromium` |
| `connected-studio-footer.spec.ts` | `chromium-desktop`, `firefox-desktop`, `webkit-desktop`, `mobile-chromium`, `compact-320-chromium` |
| `connected-studio-navigation.spec.ts` | `chromium-desktop`, `firefox-desktop`, `webkit-desktop`, `mobile-chromium` |
| `connected-studio-responsive.spec.ts` | `mobile-chromium`, `mobile-webkit`, `tablet-chromium`, `wide-chromium` (matched by the existing unanchored `/responsive\.spec\.ts/`), plus `compact-320-chromium` and `tablet-portrait-chromium` (explicit) |
| `connected-studio-runtime.spec.ts` | `immersive-chromium` only |
| `connected-studio-accessibility.spec.ts` | `accessibility-chromium` (matched by the existing unanchored `/accessibility\.spec\.ts/`) |
| `connected-studio-production.spec.ts` | `connected-production-chromium`, defined only when `PLAYWRIGHT_SERVE_EXPORT=1` |
| `visual/connected-studio-*.visual.spec.ts` | `visual-chromium` (matched by the existing visual pattern) |

The Services spec (Task 6) asserts the catalogue, the chapters and the complete scoped boundaries with JavaScript disabled, including the approved D05 management-system/AI paragraph and the separate chatbot-and-agent scope sentence in both locales. `scripts/services-content.test.mjs` compares the management-system/AI paragraph directly with the owning Services copy table. Browser coverage then checks the wide composition (web as the single large left card), anchor landing below the App Bar, 320px / 200% zoom / landscape reflow, fine-pointer hover (lift and arrow ≤3px, 160–220ms explicit transitions), keyboard focus, reduced motion and axe. Hover cases skip, visibly, where the primary pointer is not a fine one. `marketing-services.spec.ts` keeps the buyer-evaluation flow and editorial order in every registered project.

The runtime, responsive and accessibility specs (Task 7) cover the optional live scene behind Services and Projects. WebGL runs on SwiftShader, so they prove functional behavior, never hardware performance (Task 9). Each live case opts in through `setConnectedTestHook` (`allowSoftwareRenderer` and `livePolicy`), which never changes the shipped policy (`{ wide: true, compact: false }` since PLAN-SFC-V1 Task 18); a plain page without the hook is static under SwiftShader (the software renderer is rejected), for the compact tier and for every failed gate, and live only for a wide visitor on hardware WebGL2. `connected-studio-runtime.spec.ts` runs the lifecycle cycles: delayed activation and cancel on leaving, probe disposal, stored Pause and context loss (Home's flag read-only), the per-tier policy, default software rejection, renderer failure and context loss, one live renderer across a real navigation journey, hidden and Footer suspension with zero scheduled work, Pause across routes and locales, the focused "Fondo estático" / "Static background" fallback, resize, fonts and restored scroll, the real draw-call and pixel-ratio budgets, 33/13 edges grown at the Footer handoff, the first-scroll impulse, reverse growth, anchor jumps, and the projected labels (upright, 11px or more, clear of every reading mask, the App Bar, each other and the viewport at 320, 390, 768, 1024 and 1440px, and, from PLAN-SFC-V1 Task 21, on every frame of a smooth scroll gesture down the page and back, read both inside an animation-frame callback and as painted; `sfc-runtime.spec.ts` runs the same per-frame case on Studio). `connected-studio-responsive.spec.ts` runs its static cases in every registered project and its live cases once on `wide-chromium` in a SwiftShader browser of their own: no overflow, a 44px Pause control clear of text, zero enhancement layout shift, an unmoved introduction and a 200% zoom equivalent. `connected-studio-accessibility.spec.ts` adds axe with the scene absent and present, keyboard operation and focus ring of the Pause control, reduced-motion hover removal and the forced-colors gate. Screen-reader, real-zoom and physical-device checks stay with the owner (OD-4). Under `next dev`, Turbopack lists the engine chunk in every connected page's HTML, so the specs witness the optional import with a development-only `window.__FURLANICH_CONNECTED__` counter instead of network requests; the request-level proof belongs to the clean production export (Task 9). `scripts/connected-studio-host.test.mjs` asserts the host's structural contracts in Node.

The static media cases (Task 8) extend `connected-studio-static.spec.ts`. The shipped wide policy rejects SwiftShader and the compact tier is off, so under this project every page is the static page. They assert, for each page and locale, that only the poster matching the viewport is requested (320, 390 and 767px request the compact file, 768, 1024 and 1440px the wide one, at the served base path) with no canvas and, under `next dev`, no engine import (the dev-only counter; Turbopack lists the engine chunk on every connected page, so request-level proof stays with the production check). They also cover reduced motion, JavaScript off, and a 404 on the poster, which leaves the CSS chart as the Ground and the page complete. For the project illustrations they assert the reserved 1599:900 box before the image loads at 320, 768 and 1024px, the full candidate list in `srcset` (640, 960, 1280 and the original) at the base path, that the browser's choice is never smaller than the smallest sufficient candidate (read from `currentSrc`, because `naturalWidth` is density-corrected for `w` descriptors), and that nothing preloads the artwork and both images are `loading="lazy"`. When a lazy image is fetched is the browser's own distance threshold, so the moment is not asserted. `scripts/connected-studio-media.test.mjs` covers the manifest, byte ceilings, intrinsic sizes, derivatives and wiring contracts; `scripts/capture-connected-studio-posters.mjs` produces the four posters (and, with `--derivatives`, the six illustration derivatives) from the merged scene as controlled test evidence.

Two runtime cases (Task 8, by the owner's 2026-10-12 direction) prove the start pose in `connected-studio-runtime.spec.ts`: with Playwright's fake clock held by `pauseAt` and stepped by `runFor`, the first reading of the live scene is the poster pose (progress and idle angle within six decimals), half a second later it is between that pose and the page top, and after four seconds it has settled on the scroll pose. `expectSettled` in the support helpers waits for the settle, because the scene eases for about three seconds before "at rest" starts. `clock.install()` alone leaves time flowing, and a held clock never fires `requestAnimationFrame`. The [Task 8 review corrections](../reviews/services-projects-footer-acceptance-v1/task-8-review-corrections.md) add real camera/geometry projection checks against the captured poster’s CSS cover crop (nodes, rings, beads and path vertices at 1440×900, 768×1024, 390×844 and 320×800). Browser regressions check that both routes remove the poster after a live draw, keep it hidden after reversing to zero growth/Pause, and restore it when reduced motion disposes the scene; existing failure cases also require the poster to be visible. These checks prove geometric continuity and fallback behavior, separately from visual approval.

Timing rules for the live cases ([diagnosis, 2026-10-13](../reviews/services-projects-footer-acceptance-v1/task-8-ci-failures.md)): a case that asserts a page stayed static first waits for the hydrated diagnostics hook (`expectStatic`), since a loaded runner can hydrate well after `load`; a case that waits for the bounded Home deferral polls the development-only `deferralsExhausted` counter instead of sleeping; a case that needs a scroll impulse delivers a short run of wheel steps, because the scene reads speed from the gap between scroll events; and positions at rest are compared within 1e-6, not for bit equality, because the start-pose settle closes its last fraction through the normal damping.

The navigation spec measures ordinary-anchor middle-click behavior in bounded setup only for middle-click journeys. Its observer regressions cover a canceled current-tab navigation followed by a new tab and rejection of a wrong destination. Journey destination assertions retain exact locale paths and fragments.

### Production serving

Set `PLAYWRIGHT_SERVE_EXPORT=1` to test the exported site instead of the development server. The config then runs `scripts/serve-static-export.mjs` for `webServer`, defines only `connected-production-chromium`, and never reuses a server already on the port, so a leftover `next dev` cannot stand in for the export. Without the variable the config is unchanged, and `npm run test:e2e` (including CI) never sees the production project.

- Build a clean export first (fresh `out/`, never a copy over a stale one), then run `PLAYWRIGHT_SERVE_EXPORT=1 npx playwright test --project=connected-production-chromium`. For the subpath export, build and run with `NEXT_PUBLIC_BASE_PATH=/Portfolio` (the shell notes below apply). The server reads `PLAYWRIGHT_PORT`, `NEXT_PUBLIC_BASE_PATH`, `HOST` and `EXPORT_DIR`.
- The server mirrors GitHub Pages: files and `<dir>/index.html` under the base path, a 301 from a directory URL to its trailing-slash form, `max-age=600`, GET and HEAD only, and the export's own `404.html` with a real 404 status for everything else. It **never rewrites a missing route to an index**, which is what lets a spec prove a retired route is absent. Paths outside the base path and traversal attempts are 404.
- A Windows export nests the segment-prefetch files that Linux builds (GitHub Pages) name with dots: the router requests `__next.<group>.<a>.<b>.txt` and Windows writes `__next.<group>/<a>/<b>.txt`. The server maps the dotted request to the nested file when no file has that name, and still answers 404 for a name with no file. Without that mapping every client navigation on Windows logged five 404 console errors that CI never sees.
- `connected-studio-production.spec.ts` (Task 9) drives the export: the six retired URLs are real 404s with no residual file or link; recognized and unknown fragments and the locale switch; the Home → Services → Projects → locale switch → Founder → Contact journey, following the rendered Founder link and Contact action, with back and forward through that real history, the scene disposed on each route change and at most one WebGL context at a time; Pause persistence across routes and locales; labels in the current locale only; no listener growth over repeated route changes; a lost context, a delayed or failed engine import and a failed poster; reduced motion, forced colors, Save-Data, no WebGL2, the shipped policy and a rejected software renderer, none of which request the engine; the loading rules (no preload hints, lazy illustrations); a functional cross-check that a live load requests exactly the closure the emitted export names, and that a second route reuses it from the HTTP cache; and the no-JavaScript pages. Production builds compile the diagnostics hook out, so the spec observes the DOM, the network and the WebGL API. Engine chunk names are read from the emitted export, since the file names are hashed. Live cases use the controlled test hook on SwiftShader and are functional evidence only.
- Compose URLs as `appUrl(index) + '#slug'`: `appUrl` appends a trailing slash, so a hash must not be placed inside its route argument.
- Clean-build, base-path and measurement procedure: [PLAN-SPF-V1, Verification commands](../plans/completed/services-projects-footer-v1.md#verification-commands-artifact-hygiene-and-manual-procedure).

### Production measurements (PLAN-SPF-V1 Task 9)

Both scripts serve the clean export they find in `out/`, never `next dev`. They never set the connected test hook and never force a software renderer: they observe the build's own policy, as the plan requires ("Production measurements ... never set it"). They build first unless `--skip-build` is given, and both check that `out/` was exported with the chosen base path (`--base-path=/Portfolio`, run from PowerShell, since Git Bash rewrites the argument). Run them once per base path and keep the reports apart. `--out=<file>` writes the full JSON report; reports are local artifacts, not committed.

| Command | What it measures and gates |
| --- | --- |
| `npm run measure:connected-studio` | For Services and Projects in both locales: the emitted chunk graph (raw and Brotli quality 11), the route's optional entries and their complete nested closure, counted once and minus what the static route already loads, at 120 KiB Brotli per cold route. The shipped policy and each static-preference path (reduced motion, Save-Data, forced colors, a stored context loss) of the shipped build must request none of the closure. Sharing across the four destinations is reported from the emitted graph; warm-cache reuse is derived from it, not observed, and is never subtracted from the cold figure (the functional spec observes it). The four posters are checked against 150 KiB (wide) and 80 KiB (compact). The pure accounting lives in `lib/connected-studio/measurement.ts`, tested by `scripts/connected-studio-measurement.test.mjs` |
| `npm run measure:connected-studio-vitals` | Synthetic lab LCP and INP over ten cold journeys per locale, destination and profile (the Home desktop and mobile profiles and gzip lab server, copied verbatim from `measure-home-web-vitals.mjs`) under the build's own policy. Arguments are validated before anything starts (a positive integer `--journeys`, a known `--profile` and `--expect-mode`), and an empty result group fails. Every journey must complete its required interactions: an in-page fragment link, keyboard focus, scrolling and a link to the other connected route, which must land and render its H1 (plus Pause and Resume when live). A missing control, a navigation timeout or a mode other than `--expect-mode` (default `static`) fails the run. Gates LCP p75 ≤ 2500 ms, INP p75 ≤ 200 ms and the unrounded enhancement layout shift at 0; whole-page shift is reported. The shipped policy keeps both tiers off, so the figures are for the static pages; live-tier figures stay OPEN until a hardware run of the private candidate with `--expect-mode=live` and no override |

`scripts/measure-connected-studio-hardware.mjs` is the third script, run by hand (it has no npm entry) against a private candidate export in which the tier under test is enabled. It sets no hook and no renderer flag, observes WebGL2 by wrapping its calls, uses GPU timer queries when the extension exists and otherwise reports "not measured", and leaves every row OPEN if the renderer is software or the page does not go live by itself. It runs the plan's owner protocol on the machine that runs it (traversals, idle, Pause, hidden, Footer, route changes, a paused-scene control, cold and warm engine cost), plus a viewport-equivalent 200% and 400% check, a rendered-pixel contrast pass and an accessibility-tree dump, and returns per-row PASS, FAIL or OPEN through `judgeHardware`. `--browser=firefox` only checks that the page goes live; `--headed` is needed for any real-window behavior. `measure-connected-studio-vitals.mjs --hardware --expect-mode=live` measures the live LCP, INP and enhancement shift on the same candidate. Their results are candidate evidence for the owner, never the owner's acceptance, and say nothing about phones.

Neither script touches `measure-home-web-vitals.mjs` or `production-instrumentation.mjs`. Hardware figures (render and active-interval p95, GPU timers, heat, memory) come only from the owner's device protocol; software-rendered numbers are never labelled as hardware.

## Failures and evidence

On failure, Playwright retains a screenshot and video. CI retries once and records a trace on the first retry. The HTML report, `test-results/`, and `.playwright/` are ignored; CI uploads reports and results only on failure. Reproduce the narrowest test/project first and use `systematic-debugging` before changing code or expectations.

Check console errors, page errors, visible outcomes, keyboard activation/focus, relevant viewports, and base-path behavior. Apply axe to representative stable pages and block critical/serious violations, while keeping manual accessibility review explicit.

## Sky Chart Home acceptance (`sky-chart-acceptance.spec.ts`)

`tests/e2e/sky-chart-acceptance.spec.ts` is the integrated Home matrix for `PLAN-SKY-CHART-HOME-REDESIGN-V2` (142 tests). It runs in `immersive-chromium` against the integrated Home in Spanish and English at 320, 390, 768, 1024 and 1440 pixels. SwiftShader is a software renderer, so the runtime's capability gate would keep these pages static. The spec therefore sets the explicit test-only override `window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__` before navigation wherever it expects WebGL mode, and one test asserts that a software renderer without the override stays static.

| Group | What it asserts |
| --- | --- |
| Hero top versus header top | The hero top and the header top differ by at most 1px, at five widths with the runtime, and at 1440 and 390 without JavaScript |
| Journey matrix | Activation, label tiers by width, forward and reverse through the four chapters, recede round trip, layout shift from the enhancement = 0, no console error |
| Backdrop-filter budget | At most three surfaces at each section (the gate), plus an informational half-viewport sweep capped at 5 |
| Keyboard | Tab order to the footer at 1440 and 390 with visible focus never under the App Bar, and Pause right after the chapters and before the Problems action |
| Resize, rotation and multi-viewport | One canvas, no scene recreation, the chapter and label tiers kept, rotation during Connect |
| Canvas pixel ratio and idle rendering | The 1.5 and 1.25 caps on a 3x display and a 2-core device; zero frames once settled |
| 200% zoom | 720×450, 512×384 and 384×512: the hero grows, nothing clips, the runtime still activates |
| Reduced motion, Save-Data, no JavaScript | The static composition, the poster, the instant scrim recede and a document that fits |
| Capability and failure paths | No WebGL, a renderer that fails after the probe, a failed import, forced context loss (still static after reload), a software renderer |
| Reduced transparency | Plates and sheets turn opaque and lose their blur, with the runtime on |
| Base path | Every link, poster and chunk resolves and the runtime activates; run it with `NEXT_PUBLIC_BASE_PATH=/Portfolio` for the prefixed build |
| axe and console | WCAG 2.x A/AA serious and critical violations with the enhancement off, on-playing and on-paused; no console or page errors while scrolling the whole page |
| Web-font swap | With fonts held then released, mono text in the App Bar and hero moves by 1px or less and whole-page CLS stays under 0.1 |

Run it with `npx playwright test --project=immersive-chromium tests/e2e/sky-chart-acceptance.spec.ts`, and add `NEXT_PUBLIC_BASE_PATH=/Portfolio` for the base-path group. Notes learned while running it:

- The file sets a top-level `video: 'off'`. With the page-video recorder on, two full-page navigations at once can hang under SwiftShader.
- Under two or more local workers, the `next dev` parallel-compile race and load-sensitive journeys can fail and then pass serially. `--workers=1` is the safe local setting. CI uses two workers and one retry, and its browser job has a 75-minute overall budget (a runner-resource limit), including setup, failure evidence and cache cleanup. PR #122's complete matrix passed in 34 minutes but exhausted the previous 35-minute job limit during cleanup; the Task 4 receipt records that capacity finding. After Task 7 added roughly 220 tests the job was cancelled at the 45-minute limit on PRs #126, #127 and #128, so the budget was raised to 75 with the owner's approval on 2026-10-12; tighten it from the first completed run. The per-test and hook 30-second timeouts and the 5-second `expect` timeout are unchanged.
- From Git Bash on Windows, set `MSYS2_ENV_CONV_EXCL='NEXT_PUBLIC_BASE_PATH'`, or run from PowerShell, so the base path is not rewritten into a Windows path.
- Firefox and WebKit never activate the runtime in headless automation, so a real canvas in those engines is covered only by the manual protocol in the [acceptance record](../reviews/sky-chart-acceptance-v2/index.md).

### Shared helpers (`tests/e2e/support/`)

| File | Purpose |
| --- | --- |
| `paths.ts` | `stableRoutes`, `appUrl`, `appPathname` and `normalizeBasePath`, so specs and `playwright.config.ts` agree on the optional base path |
| `sky-chart.ts` | The Sky Chart DOM contract: debug-hook types, the software-renderer override and the polling and axe helpers shared by the runtime specs and the acceptance spec |
| `navigation.ts` | `gotoResilient`: retries a 5xx from the `next dev` race, and returns every other outcome untouched so a genuine failure still fails |
| `console-errors.ts` | `observeUnexpectedBrowserErrors`: collects console errors and page errors and asserts none |
| `editorial.ts` | Mono-text and sequence-marker assertions for the editorial pages |
| `connected-studio-test-hooks.ts` | `setConnectedTestHook(page, hook)`: the one test-injection mechanism for the connected routes. It sets `window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer?, livePolicy? }` only through `page.addInitScript`, mirroring Home's `__SKY_CHART_ALLOW_SOFTWARE_RENDERER__`, and rejects any other field or a non-boolean value. Functional tests and poster capture may use it and label the result controlled test evidence. Production measurements and owner hardware acceptance never set it. The only production-adjacent use is the functional production spec, which labels its live cases controlled test evidence |
| `connected-studio.ts` | The runtime-spec helpers: `enableLiveForTest` (the controlled opt-in), `gotoConnected`, `expectLive`, `expectStatic`, `expectFellBack`, `expectStopped`, the `readConnected` reader of the development-only diagnostics hook (its `ConnectedDiagnostics` type lives with the component), `trackWebglContexts` (create and `WEBGL_lose_context` events, never two live), `holdPageLoad`, `controlVisibility`, `seedSession`/`readSession`, `navigateInApp` (a real client-side navigation using the shipped scroll behavior), `readLabelGeometry`/`overlaps` (the label oracle read from the DOM), `observeEnhancementShifts` (layout shift after activation) and `isConnectedEngineRequest`/`observeEngineRequests` (the request-level observer, used against the production export) |
| `production-instrumentation.mjs` | Browser-level instrumentation for the production measurements (draw calls, label textures, idle frames, backdrop surfaces and layout-shift attribution); shared by `measure:immersive` and `measure:home-vitals`, which cannot use the dev-only debug hook. The connected-studio scripts carry their own observers and do not import it |

## PLAN-SFC-V1 harness and QA candidate

PLAN-SFC-V1 Task 2 partitioned the Playwright specs by page owner and added the candidate and production families. The partition moved cases without changing them: the default list is **2749 cases in 33 files** (was 2749 in 31), with the same case title in the same project for every case. The planning envelope is at most 3200 default cases and at most 180 candidate cases. **At the PLAN-SFC-V1 closeout (2026-10-20, `main` at `971f9594`) `playwright test --list` reports 3195 default cases in 37 files and `SFC_TEST_MODE=candidate` reports 90 in 2 files**, both inside the envelope.

### Spec families and owners

| Family | Files | Projects | Owner |
| --- | --- | --- | --- |
| Studio | `studio.spec.ts`, `studio-responsive.spec.ts` | `chromium-desktop`; responsive on `compact-320-chromium`, `tablet-portrait-chromium` and the projects that match `/responsive\.spec\.ts/` | Task 6 |
| Founder | `founder.spec.ts`, `founder-responsive.spec.ts` | same as Studio | Task 7 |
| Legal | `legal.spec.ts` | every project that runs `privacy.spec.ts` | Task 9 |
| Contact commercial | `contact-commercial.spec.ts` | `contact-commercial-{chromium,firefox,webkit}`, **candidate mode only** | Task 10 |
| New-route runtime | `sfc-runtime.spec.ts` | `sfc-runtime-chromium` (SwiftShader), **candidate mode only** | Tasks 11 (host) and 12 (integration) |
| New-route accessibility | `sfc-accessibility.spec.ts` | `accessibility-chromium` (the unanchored `/accessibility\.spec\.ts/` pattern already matches it) | Tasks 11 and 12 |
| New-route production | `sfc-production.spec.ts` | `sfc-production-{chromium,firefox,webkit}`, only with `PLAYWRIGHT_SERVE_EXPORT=1` | Tasks 16 and 18 |

Founder coverage (Task 7) checks the complete bilingual profile order, preserved professional URLs and CV download, the four fixed word bindings, and the retained Projects/Contact bridges. Its responsive cases inspect the two plates at 320, 390, 768, 1024, and 1440px; check the 720×450 CSS viewport equivalent to 200% zoom; verify glyph bounds under 200% font/line-height growth and the WCAG text-spacing override; and confirm the complete compact page when JavaScript is disabled. Pixel baselines remain a separate owner-approval gate.

A family with no spec file yet lists nothing; `playwright test --list` then exits 1 with "No tests found" in its report. Chromium owns the exhaustive state permutations. Firefox and WebKit run only cases tagged `@cross-browser`, for the real form, navigation and focus behavior, not duplicate pixel or permutation coverage. Tag a case with `test('submits and recovers', { tag: '@cross-browser' }, async ({ page }) => { ... })`; the two candidate projects filter on that tag (`grep` in `playwright.config.ts`), so an untagged case is Chromium-only and cannot duplicate the matrix against the 180-case candidate envelope. `scripts/sfc-ci-budget.test.mjs` proves the filter with a throwaway tagged and untagged fixture.

`SFC_TEST_MODE=candidate` selects the candidate families and replaces the default project set. It selects tests only. The application's own mode comes from committed release records, never from this variable or any environment value.

### QA candidate workflow

The commercial inquiry mode and the compact live tier are off in committed source (the wide tier has been on since PLAN-SFC-V1 Task 18), so their browser tests run against a disposable checkout with a committed patch applied. Never use the shared checkout, and never deploy from a candidate.

```bash
node scripts/prepare-sfc-candidate.mjs apply --kind=commercial   # or runtime, or combined
SFC_TEST_MODE=candidate PLAYWRIGHT_PORT=3200 npx playwright test
node scripts/prepare-sfc-candidate.mjs restore --kind=commercial
```

- `apply` requires a clean tracked tree, an optional `--expect-head=<sha>` match, and `git apply --check` of every patch. It applies all or none, records the head and the SHA-256 of each patch in the git directory, and refuses a second candidate.
- `restore` refuses a patch that changed since it was applied or a target that drifted, then reverses the patches with `git apply -R`.
- `verify-clean` runs in the CI `validate` job. It fails when `QA-CANDIDATE-NOT-FOR-DEPLOYMENT` appears in `app`, `components`, `lib`, `data` or `public`, or when a candidate is still applied. It does not reject `CONNECTED_LIVE_POLICY` being true: PLAN-SFC-V1 Task 18 changed it for the wide tier in its own reviewed PR.
- `tests/fixtures/sfc/runtime-closure.patch` (Task 8's early-measurement fixture) was deleted by PLAN-SFC-V1 Task 26: Task 18 attached the host for real, so `git apply --check` failed on `components/connected-studio/ConnectedStudioEnhancement.tsx` at `main`, and no script or test referenced it. The two patches in `tests/fixtures/sfc/` are the only ones; `scripts/sfc-ci-budget.test.mjs` fails if the stale file returns.
- Patches are read and applied as LF text, so a Windows checkout that converts them to CRLF still works.
- `tests/fixtures/sfc/live-policy.patch` sets the compact tier true in `lib/connected-studio/capability.ts` and nothing else: the wide tier and the Atlas host seam are in committed source since Task 18. `tests/fixtures/sfc/commercial-release.patch` sets the release mode to `commercial` and the release id to the QA marker in `lib/inquiry/release.ts`. Task 5 created that file with exactly this declaration, and the patch still applies on `main` (checked with `git apply --check` at the closeout). Contact is direct-link only, so no public route reads it.

```ts
export type InquiryReleaseRecord = { readonly mode: 'demonstration' | 'commercial'; readonly releaseId: string };

export const INQUIRY_RELEASE: InquiryReleaseRecord = {
  mode: 'demonstration',
  releaseId: 'DEMONSTRATION',
};
```

Reviewer R uses the same commands and fixtures at the exact head. After the coordinated release (Task 16), committed commercial tests need no mode patch; the runtime candidate tests keep applying only the live-policy patch (the compact tier) until the compact tier is qualified.

### Export requirements and fixtures

Each page owns one declarative export requirement map in `scripts/export-requirements/<page>.mjs` (`studio`, `founder`, `contact`, `privacy`, `home`, `services`), imported by `scripts/verify-static-export.mjs`, which keeps the assertion logic. A page owner's `<page>-export.test.mjs` builds a small fixture with `createExportFixture` and runs the real verifier through `runVerifier` from `scripts/export-test-support.mjs`; the verifier reports every missing route, so assert only on your own pair. No page packet edits another page's requirements.

### Continuous integration

- The workflow runs for pull requests to `main` and to `codex/sfc-integration`, and by `workflow_dispatch`. Use the manual trigger at a PR's immutable head to bootstrap a PR that changes the workflow itself; record the run.
- The `browser` job runs four shards, `--shard=N/4 --workers=2`, with `fail-fast: false` and a 35-minute hard limit (target 25). The last single-job run took 51m59s ([run 38623461245](https://github.com/Furlanich/Portfolio/actions/runs/38623461245)). The first four-shard run ([run 38735223527](https://github.com/Furlanich/Portfolio/actions/runs/38735223527), PR #143, all green) took 12m37s, 16m17s, 8m54s and 17m35s per shard, from GitHub's started and completed timestamps; the shards are unbalanced, so each wave re-measures. Do not extend the limit or drop unique coverage to hide a failure.
- Every shard uploads its report and traces with `if: always()`, named by shard, run and attempt, kept 7 days.
- The `candidate` job (PLAN-SFC-V1 Task 26) runs the candidate-mode families, `contact-commercial-*` and `sfc-runtime-chromium` (90 cases in 2 files, re-measured with `SFC_TEST_MODE=candidate npx playwright test --list`), which never ran in CI before. It uses the same Playwright image and `--user 1001 --init --ipc=host` options as `browser`, plus `--add-host formspree.io:127.0.0.1` and `www.formspree.io`, so an unmocked request to the inquiry provider cannot leave the container (a step proves the hosts resolve to loopback before the run). In order it: runs `verify-clean`, applies the **combined** candidate with `node scripts/prepare-sfc-candidate.mjs apply --kind=combined --expect-head=<github.sha>`, runs `npx playwright test --workers=2` with `SFC_TEST_MODE=candidate`, then, under `if: always()`, restores the candidate (only if one is still applied) and re-runs `verify-clean`, and uploads `playwright-report/` and `test-results/` as `playwright-report-candidate-<run>-<attempt>` with `if: always()`, kept 7 days. It is never deployable: no build, no publish step, no secret and the workflow's read-only token. Budget: target 20 minutes, hard limit 30 (`timeout-minutes: 30`); never extend it or drop a case to hide a failure. `scripts/sfc-ci-budget.test.mjs` pins this structure. The first measured run is recorded in the [Task 26 receipt](../reviews/studio-founder-contact-acceptance-v1/task-26.md).
- Local ports: owner sessions use `3200 + task number`, reviewers `3300 + task number`; each checkout has its own `.next` and `out`, and export runs never reuse a server.
