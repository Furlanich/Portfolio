# PLAN-SFC-V1 Task 7 — Founder Atlas

## Status

Task 7 is under revision on PR #148 (`codex/sfc-07-founder-atlas`), based on merged Task 6 / PR #147 at `3334979a60e42a8685a137c2d59e0676e93651ee`. Reviewer R first reviewed head `190749bcf5788eb5ec9709d60a38404a6f84997e` and returned REVISION REQUIRED with R1 (shared-path ownership) and R2 (tablet plate width). R2 is fixed in PR code at `e8cd959bb9975b1bfd0fe5f3cfd35187d8c106c3`; Reviewer R's re-review at `1d385f3c69702498c56ed0b4b92c01cfe61bce5d` confirms R2 addressed and R1 still open. The user authorized Task 7 only; the master plan remains `PROPOSED`. The owner approved the four rendered Founder compositions and Windows baselines in this conversation on 2026-10-16. Exact-head CI and controlled Linux baseline adoption remain open.

## Delivered

- Rebuilt the Spanish and English Founder pages as a complete, text-led atlas. The first opaque plate contains the full three-paragraph biography, professional links, then the static Pause slot. A second continuous plate contains experience, education and the bounded MPC account, four capability groups, and the evidence bridge.
- Kept the first plate left aligned and the second plate right aligned at wide viewports; both fill the container and share a left edge below 1024px. The layout contains no portrait, image column, clamped copy, ratings, employer timeline, or duplicated project catalogue.
- Bound `.NET`, `React`, `Next.js`, and `Blazor` to `n0`, `n4`, `n8`, and `n12`. Preserved the approved facts, professional destinations, CV PDF, and demo-dependent ending.
- Added ordered content/export assertions, browser coverage, responsive/no-JavaScript/text-spacing checks, accessibility checks, and stable visual capture fixtures. Added PDF MIME handling to the local static-export test server so the Task 7 HTTP content-type check exercises the exported CV correctly.

## RED → GREEN and verification

- **RED:** the new content/export assertions failed against the old capability heading and the old page sequence (3 failing assertions before implementation).
- **GREEN:** `npm run validate` passed: `docs:check`, 737 Node tests, lint (0 errors; 282 repository warnings), typecheck, and the Next.js 16.3.2 Turbopack production build (14 static routes). `npm run verify:static-export` passed for `/` and `/Portfolio`; the base-path build also passed.
- Focused Founder Playwright suite: 14 passed. The initial responsive suite: 8 passed, covering 320, 390, 768, 1024, and 1440px; the 720×450 CSS viewport equivalent to 200% zoom; 200% text/line-height growth with glyph bounds checked inside the plates; WCAG text spacing; and JavaScript-disabled content at 320px. Founder axe suite: 4 passed in Spanish and English.
- **Reviewer R R2 / RED → GREEN:** added the 900px tablet sample to the existing Spanish/English plate-width assertion. RED reproduced both failures: expected container width 836px, received 800px. Set both plate wrappers to `width: 100%` through 1023px while retaining the wide 800px cap. GREEN: `PLAYWRIGHT_PORT=3207 npm run test:e2e -- tests/e2e/founder-responsive.spec.ts --project=tablet-portrait-chromium` passed 8/8 across Spanish and English, including 900px and the existing viewport/zoom/content checks. The Windows linked worktree's shared `node_modules` junction required a temporary `turbopack.root` test override to its parent directory; `next.config.js` was restored immediately afterward.
- Root and `/Portfolio` CV responses: HTTP 200, `application/pdf`, `%PDF-` signature, 194201 bytes, and download name `Samuel-Furlanich-CV.pdf`.
- The visual Chromium captures use reduced motion and wait for fonts. Before owner approval, the candidate render was inspected at 1440px and 390px against the approved SFC design; the old platform baselines described the superseded layout, so comparison failed in all four locale/width cases as expected. No baseline was committed before approval.
- Following owner approval on 2026-10-16, regenerated and visually inspected the four Windows baselines. The snapshot-update run passed 4/4, then the normal comparison run passed 4/4 without update mode. Linux baselines remain the superseded captures until replaced from the exact PR head's controlled CI actual artifacts.

## Taste and Impeccable audit

- **Taste v1, pre-build and rendered:** compared 1440px and 390px Founder compositions with `DESIGN-SFC-V1` (`docs/design/studio-founder-contact-v1.md`). The 1440px plate pair preserves the specified left/right editorial balance; at 390px, the complete text naturally stacks with the equal left edge. Rejected portrait/media, decorative capability cards, and line clamping because they conflict with the approved text-led hierarchy and content completeness. No new layout concept was introduced.
- **Impeccable adapt:** the browser assertion checks 320, 390, 768, 900, 1024, and 1440px; the 720×450 zoom-equivalent viewport; page overflow; text bounds within both plates; content order; and plate alignment. 200% font and line-height growth and the 1.5 line-height / 0.12em letter / 0.16em word spacing override pass without horizontal overflow. Keyboard order remains biography → CV → LinkedIn → GitHub → following content; the Spanish/English axe checks pass.
- **Rendered baseline judgment:** owner approved the four reviewed Founder renderings on 2026-10-16 and instructed us to proceed. The approved Windows baselines were regenerated and passed the normal visual comparison. Their SHA-256 values are recorded below. Linux captures must come from this exact PR head's controlled CI actual artifacts; the current Linux files still describe the superseded layout and are not accepted baselines.

| Owner-approved Windows baseline | SHA-256 |
| --- | --- |
| Spanish wide (1440px) | `A465EB9DBEC11EE7C23E9BF9D821C8D77B314EBA9947B04BE3324FBD344B1D6B` |
| Spanish compact (390px) | `EFA2D6E91DEAA564D2E336FB01F9570ECBAC2CBA6A459F947CA314362A486BEA` |
| English wide (1440px) | `A0A5D51CBCF4E73AF22EED31E85087C24B4485C1FADD6445D7BE5CB5BD03C1E2` |
| English compact (390px) | `19E5EFBC7A2A928F9A32911E27FA8CB1A55E1BBD5AC40D0994ED0548F60F7F16` |

## Review and open acceptance

- Repository policy allows zero subagents. The primary author completed the self-review inline; independent Reviewer R reviewed in a separate session and posted REVISION REQUIRED at original head `190749bcf5788eb5ec9709d60a38404a6f84997e`, then re-reviewed at `1d385f3c69702498c56ed0b4b92c01cfe61bce5d` with the same overall verdict.
- **R1 [P2] — confirmed; OPEN.** `scripts/serve-static-export.mjs` is outside Task 7's owned write paths. Its PDF MIME mapping supports Task 7's required exported-CV content-type verification, but a Task 7 receipt cannot grant ownership or amend the master plan. Keep the mapping and PDF verification intact; wait for the planning authority's bounded disposition or a separately owned remediation packet. No out-of-scope source edit was made to resolve this finding.
- **R2 [P2] — confirmed, fixed, and accepted in re-review.** Both plates now fill the container below 1024px; the new 900px sample failed before the CSS fix (800px versus 836px) and the focused Spanish/English responsive suite passed after it. The fix is published on PR #148 at `e8cd959bb9975b1bfd0fe5f3cfd35187d8c106c3`; Reviewer R confirmed it is addressed on the code-identical source at `1d385f3c69702498c56ed0b4b92c01cfe61bce5d`. That head's only follow-up was this receipt update.
- Owner visual/baseline approval: **CLOSED 2026-10-16**. R1's planning-authority disposition and exact-head CI/Linux artifact adoption remain open. Once Linux images are adopted, rerun the visual suite and CI without snapshot update mode.
- **Publication status:** The owner asked to keep the four approved Windows PNGs local. Automatic approval review rejected exporting them after the owner requested a PR, so this PR omits the PNG modifications; the approved captures and hashes remain in the local worktree. Linux baseline adoption remains pending.
- CI run/head/artifact references and Linux baseline hashes will be added after the current PR head's controlled CI run. Until R1 and exact-head baseline/nonbaseline gates are closed, Task 7 is not marked complete in the plan.
