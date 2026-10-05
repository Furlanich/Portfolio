---
id: TEST-VISUAL-REGRESSION
type: testing-guidance
status: APPROVED
related:
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
  - DESIGN-VISUAL
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-ACCEPTANCE-V2
last_verified: 2026-10-05
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

## Home sections (`home-sections.visual.spec.ts`)

`tests/e2e/visual/home-sections.visual.spec.ts` holds the reduced-motion element baselines for the seven Home sections after the instrument (Problems, Services, Position fix, Proof, Process, Founder and the Dawn CTA) at 1440, 768 and 390 pixels in both locales: 42 captures per platform. The hero and the four chapters stay with `immersive-home-static.visual.spec.ts`, which captures `[data-instrument]` at five widths in both locales (10 captures per platform).

- The `visual-chromium` project runs with reduced motion, so no canvas exists and every capture is the static composition. Canvas pixels are never compared.
- The sticky App Bar is hidden for these captures, because a section taller than the viewport is captured in tiles and the bar would land at a different offset in each tile. The bar has its own baselines and assertions.
- The fixed environment poster is hidden too (the ground gradient stays). These sections are transparent, so each capture would otherwise contain whichever slice of the viewport-fixed poster sits behind it, and a height change above one section would re-baseline every section below it. The poster keeps its own coverage in the instrument spec.
- A section taller than the viewport shows a colour seam where the viewport-fixed ground ends. That comes from element-screenshot mechanics, not from the page.
- The spec waits for `document.fonts.ready` and for the Position fix toggle to hydrate before capturing.
- Windows baselines are captured locally. Linux baselines are adopted from CI `actual` artifacts only after owner approval. When CI cannot produce them, for example when many new baselines push the browser job past its time limit, the orchestrator uses a throwaway draft PR with a visual-only configuration and never merges it. The Task 11 baselines were adopted after two pixel-identical runs.
- Both sets are owner-approved: the 42 Home-sections captures, and the 10 instrument captures refreshed when the header's layout box became exactly `--app-bar-height`.

The shared Playwright helpers that these specs import, such as `tests/e2e/support/paths.ts`, are listed in [Playwright QA](playwright.md#shared-helpers-testse2esupport).
