---
id: TEST-STRATEGY
type: testing-guidance
status: APPROVED
related:
  - DESIGN-IX-A11Y
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-ENGINEERING-LIFECYCLE
  - GOV-AGENT-USAGE
last_verified: 2026-10-14
---

# Frontend testing strategy

Use the lowest stable layer that proves the behavior, then add higher layers only for risks they uniquely cover.

| Layer | Use for | Command |
| --- | --- | --- |
| Node/unit/contract | Route maps, content and publication contracts, pure utilities, documentation and build-time rules | `npm test` |
| Documentation validation | Front matter, IDs, links, anchors, Skills, and the per-task `**Execution**` block of every new active plan ([GOV-AGENT-USAGE](../governance/agent-usage.md)); `PLAN-SPF-V1` is exempt by ID | `npm run docs:check` |
| Playwright browser | Localized navigation, links, menus, keyboard behavior, responsive layouts, visible structure, and browser errors | `npm run test:e2e` |
| Playwright plus axe | Automatically detectable accessibility issues on representative routes | `npm run test:a11y` |
| Visual review | Typography, hierarchy, composition, clipping, imagery, and rendered states against approved design | Follow `visual-qa` and [visual regression policy](visual-regression.md) |
| Static artifact | Generated routes, trailing slashes, internal links, and `NEXT_PUBLIC_BASE_PATH` output | `npm run verify:static-export` after build |
| Production export (connected pages) | The served clean export: the six retired URLs are real 404s, the Home to Contact journey, Pause and session behavior, import races and failures, preference and capability gates, loading rules, and the pages without JavaScript, at the root and at `/Portfolio` | `PLAYWRIGHT_SERVE_EXPORT=1 npx playwright test --project=connected-production-chromium` after a clean build |
| Connected-studio budgets | The optional engine closure (120 KiB Brotli per cold route), the posters, and synthetic lab LCP and INP with the enhancement layout shift, observed under the build's own policy with no test hook | `npm run measure:connected-studio` and `npm run measure:connected-studio-vitals` (each serves `out/`) |
| Immersive homepage budgets | ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE JavaScript, poster, frame, long-task, layout-shift, video and lifecycle gates; synthetic lab LCP/INP p75 | `npm run measure:immersive` and `npm run measure:home-vitals` (each builds and serves `out/`) |

The `immersive-chromium` Playwright project renders WebGL through SwiftShader. Its runtime and acceptance specs (Home, and the connected Services and Projects runtime spec) are regression evidence, not real-device evidence; the constrained Android record stays manual. Hardware evidence for a connected live tier comes only from the owner-executed [protocol](../reviews/services-projects-footer-acceptance-v1/task-9-hardware-protocol.md), whose desktop candidate run is automated by `scripts/measure-connected-studio-hardware.mjs` (run by hand against a private candidate build, never committed); software-rendered numbers are never labelled hardware.

Browser QA never replaces static-export verification. Axe and browser automation never establish WCAG conformance; manually review semantics, source order, keyboard use, focus visibility, reflow, target size, contrast, reduced motion, and content meaning.

## TDD default

Behavior-changing work follows `test-driven-development`:

```text
RED: write a focused test and observe the intended missing-behavior failure
GREEN: implement the minimum behavior and observe the focused test pass
REFACTOR: improve structure without adding behavior, then rerun tests
```

Do not write testable production behavior first and add coverage later. Explicit exceptions are pure documentation, generated files, unavoidable configuration, and purely visual details unsuitable for stable automation. Record meaningful RED/GREEN command evidence in the Pull Request.

## Local selection

- Fast repository contract: `npm test`
- Focused browser case: `npx playwright test tests/e2e/<file> --project=<project>`
- Accessibility baseline: `npm run test:a11y`
- Complete browser matrix: `npm run test:e2e`
- Complete frontend stack: `npm run test:frontend`
- Full deterministic quality gate: `npm run validate`

Use [Playwright QA](playwright.md) for projects, base paths, artifacts, and UI/headed commands. Generated reports and traces are local or CI failure artifacts, not evidence to commit by default.
