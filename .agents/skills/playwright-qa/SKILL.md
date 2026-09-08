---
name: playwright-qa
description: Use when a FURLANICH frontend change requires repeatable browser-level validation of routes, interactions, responsive behavior, accessibility automation, or failure evidence.
---

# Playwright QA

## Purpose

Use the repository Playwright harness for reproducible browser behavior and automated accessibility checks. This Skill does not provide design approval or replace `visual-qa`, static-export verification, or manual accessibility assessment.

## Workflow

1. Read `AGENTS.md`, the applicable requirements and architecture, `playwright.config.ts`, and the existing tests under `tests/e2e/`. Test only approved current behavior.
2. Select the smallest relevant routes and projects. Use desktop Chromium, Firefox, and WebKit for important smoke flows; use `mobile-chromium`, `mobile-webkit`, `tablet-chromium`, and `wide-chromium` only for responsive behavior in scope. Keep pixel-sensitive comparisons on deterministic Chromium unless policy changes.
3. Let `npm run test:e2e` own local server startup and cleanup. Do not start a duplicate server. To verify static hosting under a subpath, set `NEXT_PUBLIC_BASE_PATH` before the command; path helpers normalize it. Use `PLAYWRIGHT_BASE_URL` only for an intentionally managed external server.
4. Write or adjust the focused test before production behavior. Use `test-driven-development`: observe the intended RED, implement minimum GREEN, then refactor. Prefer roles, labels, visible user outcomes, stable route contracts, and existing support helpers over brittle DOM structure.
5. Check navigation, localized equivalents, link destinations, user-visible interactions, console errors, and page errors. For keyboard behavior, verify focus order, activation, dismissal, and visible focus where applicable.
6. At relevant viewports, check reflow, horizontal overflow, compact/wide state, clipping, and asset loading. Browser assertions establish behavior; use `visual-qa` for human judgment about hierarchy, typography, and composition.
7. Run `npm run test:a11y` for representative changed pages and add focused axe coverage when necessary. Block critical/serious automatically detectable violations; manually assess semantics, keyboard use, focus, contrast, and content meaning.
8. Reproduce failures with the narrowest project/test. Use retained screenshots and video, and inspect the trace from the first CI retry. Apply `systematic-debugging` before changing code or expectations.
9. Run the proportionate matrix, then `npm run test:e2e` before completion. Keep `npm test`, production build, and `npm run verify:static-export` as separate required layers.
10. Confirm Playwright stopped its owned server and that `playwright-report/`, `test-results/`, `.playwright/`, traces, videos, and ad hoc screenshots remain ignored and uncommitted unless a reviewed baseline is intentionally in scope.

## Handoff

Report commands, projects, routes, viewports, interactions, base path, pass/fail counts, axe scope, manual checks, and artifact locations that actually exist. State tool or environment limitations; never infer that an unrun browser passed.
