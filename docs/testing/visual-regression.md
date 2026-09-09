---
id: TEST-VISUAL-REGRESSION
type: testing-guidance
status: APPROVED
related:
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
  - DESIGN-VISUAL
last_verified: 2026-09-08
---

# Visual regression policy

Do not snapshot every page. Use pixel-sensitive snapshots only for stable, important UI where a reviewed image baseline catches risk better than semantic assertions.

- Establish or replace a baseline only after human design approval.
- Run pixel comparisons in one controlled Chromium environment per supported CI platform. Keep platform-specific baselines when OS rasterization differs; use Firefox and WebKit for functional/layout smoke, not redundant pixel assertions.
- Keep dynamic content, timestamps, animation, caret state, network imagery, and development overlays out of baselines or stabilize them explicitly.
- Inspect expected, actual, and diff images in Playwright UI mode before accepting a change.
- Never update snapshots merely to make CI green. Explain the approved visual change and review the diff.
- Keep ordinary screenshots, traces, videos, and HTML reports uncommitted. Commit only intentional baseline files required by a reviewed regression test.

Playwright visual fixtures include the project and platform in their filename (for example, studio-wide-visual-chromium-linux.png). This keeps Linux CI comparisons deterministic without treating Windows font rasterization as the Linux contract; every committed platform baseline must be captured from the same controlled browser environment that executes it.

Visual snapshots are automated change detection, not design judgment. `visual-qa` still compares the rendered result with `DESIGN-VISUAL` and the owning product specification.
