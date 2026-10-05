---
id: TEST-PLAYWRIGHT
type: testing-guidance
status: APPROVED
related:
  - TEST-STRATEGY
  - TEST-VISUAL-REGRESSION
  - DESIGN-IX-A11Y
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-ACCEPTANCE-V2
last_verified: 2026-10-05
---

# Playwright QA

`playwright.config.ts` owns a fixed local origin, Next.js development-server startup, normalized optional base path, conservative parallelism, CI-only retry, and failure evidence. Install matching browser binaries after `npm ci` with `npx playwright install chromium firefox webkit`; CI uses `--with-deps`.

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

Mobile WebKit link tabbing depends on host Safari Full Keyboard Access, so exact first-link Tab order is asserted in mobile Chromium. Both mobile engines verify disclosure activation and dismissal by keyboard.

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
- Under two or more local workers, the `next dev` parallel-compile race and load-sensitive journeys can fail and then pass serially. `--workers=1` is the safe local setting. CI uses two workers and one retry, and its browser job has a 30-minute timeout.
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
| `production-instrumentation.mjs` | Browser-level instrumentation for the production measurements (draw calls, label textures, idle frames, backdrop surfaces and layout-shift attribution); shared by `measure:immersive` and `measure:home-vitals`, which cannot use the dev-only debug hook |
