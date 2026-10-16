# PLAN-SFC-V1 Task 7 — Founder Atlas

## Status

Implementation is ready for review on `codex/sfc-07-founder-atlas`, based on merged Task 6 / PR #147 at `3334979a60e42a8685a137c2d59e0676e93651ee`. The user authorized Task 7 only; the master plan remains `PROPOSED`. Acceptance remains open for independent reviewer R, owner visual/baseline approval, and controlled Linux baseline adoption after approval.

## Delivered

- Rebuilt the Spanish and English Founder pages as a complete, text-led atlas. The first opaque plate contains the full three-paragraph biography, professional links, then the static Pause slot. A second continuous plate contains experience, education and the bounded MPC account, four capability groups, and the evidence bridge.
- Kept the first plate left aligned and the second plate right aligned at wide viewports; both share a left edge below 1024px. The layout contains no portrait, image column, clamped copy, ratings, employer timeline, or duplicated project catalogue.
- Bound `.NET`, `React`, `Next.js`, and `Blazor` to `n0`, `n4`, `n8`, and `n12`. Preserved the approved facts, professional destinations, CV PDF, and demo-dependent ending.
- Added ordered content/export assertions, browser coverage, responsive/no-JavaScript/text-spacing checks, accessibility checks, and stable visual capture fixtures. Added PDF MIME handling to the local static-export test server so the Task 7 HTTP content-type check exercises the exported CV correctly.

## RED → GREEN and verification

- **RED:** the new content/export assertions failed against the old capability heading and the old page sequence (3 failing assertions before implementation).
- **GREEN:** `npm run validate` passed: `docs:check`, 737 Node tests, lint (0 errors; 282 repository warnings), typecheck, and the Next.js 16.3.2 Turbopack production build (14 static routes). `npm run verify:static-export` passed for `/` and `/Portfolio`; the base-path build also passed.
- Focused Founder Playwright suite: 14 passed. Responsive suite: 8 passed, covering 320, 390, 768, 1024, and 1440px; the 720×450 CSS viewport equivalent to 200% zoom; 200% text/line-height growth with glyph bounds checked inside the plates; WCAG text spacing; and JavaScript-disabled content at 320px. Founder axe suite: 4 passed in Spanish and English.
- Root and `/Portfolio` CV responses: HTTP 200, `application/pdf`, `%PDF-` signature, 194201 bytes, and download name `Samuel-Furlanich-CV.pdf`.
- The visual Chromium captures use reduced motion and wait for fonts. The current candidate render was inspected at 1440px and 390px against the approved SFC design. Existing platform baselines still describe the superseded layout, so comparison against them currently fails in all four locale/width cases as expected. Candidate actuals are in ignored `test-results/`; no unapproved snapshot was committed.

## Taste and Impeccable audit

- **Taste v1, pre-build and rendered:** compared 1440px and 390px Founder compositions with `DESIGN-SFC-V1` (`docs/design/studio-founder-contact-v1.md`). The 1440px plate pair preserves the specified left/right editorial balance; at 390px, the complete text naturally stacks with the equal left edge. Rejected portrait/media, decorative capability cards, and line clamping because they conflict with the approved text-led hierarchy and content completeness. No new layout concept was introduced.
- **Impeccable adapt:** the browser assertion checks five required widths (320, 390, 768, 1024, 1440), the 720×450 zoom-equivalent viewport, page overflow, text bounds within both plates, content order, and plate alignment. 200% font and line-height growth and the 1.5 line-height / 0.12em letter / 0.16em word spacing override pass without horizontal overflow. Keyboard order remains biography → CV → LinkedIn → GitHub → following content; the Spanish/English axe checks pass.
- **Rendered baseline judgment:** candidate screenshots have been inspected, but they are not owner-approved baselines. Windows candidate SHA-256 values captured for this review are recorded below. Linux captures must come from this exact PR head's controlled CI actual artifacts and only after owner approval. No candidate hash is represented as accepted baseline evidence.

| Candidate capture | SHA-256 |
| --- | --- |
| Spanish wide (1440px) | `8FA5AB2C822E4D0447B5A50F89577797C2AFC610D588405DE6F4D5873F7234E0` |
| Spanish compact (390px) | `EFA2D6E91DEAA564D2E336FB01F9570ECBAC2CBA6A459F947CA314362A486BEA` |
| English wide (1440px) | `4B1BAA17CF8EF63B4082BE09F226C6858F5D4D1A3E02680DB08DBFAEED2367C5` |
| English compact (390px) | `19E5EFBC7A2A928F9A32911E27FA8CB1A55E1BBD5AC40D0994ED0548F60F7F16` |

## Review and open acceptance

- Repository policy allows zero subagents. The primary author completed the self-review inline; this is a degraded review run. Independent reviewer R is still required as a separate session.
- The owner must approve the rendered design and Windows candidate captures. After approval, trigger CI at the approved head, inspect the four controlled Linux actual artifacts, commit them under their platform-specific names, and rerun the visual suite and CI without snapshot update mode.
- Visual approval, CI run/head/artifact references, and the final accepted baseline hashes are intentionally not fabricated here. Until those gates are closed, Task 7 is not marked complete in the plan.
