---
id: TEST-PLAYWRIGHT
type: testing-guidance
status: APPROVED
related:
  - TEST-STRATEGY
  - TEST-VISUAL-REGRESSION
  - DESIGN-IX-A11Y
last_verified: 2026-09-08
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

Mobile WebKit link tabbing depends on host Safari Full Keyboard Access, so exact first-link Tab order is asserted in mobile Chromium. Both mobile engines verify disclosure activation and dismissal by keyboard.

## Failures and evidence

On failure, Playwright retains a screenshot and video. CI retries once and records a trace on the first retry. The HTML report, `test-results/`, and `.playwright/` are ignored; CI uploads reports and results only on failure. Reproduce the narrowest test/project first and use `systematic-debugging` before changing code or expectations.

Check console errors, page errors, visible outcomes, keyboard activation/focus, relevant viewports, and base-path behavior. Apply axe to representative stable pages and block critical/serious violations, while keeping manual accessibility review explicit.
