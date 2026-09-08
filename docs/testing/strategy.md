---
id: TEST-STRATEGY
type: testing-guidance
status: APPROVED
related:
  - DESIGN-IX-A11Y
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-08
---

# Frontend testing strategy

Use the lowest stable layer that proves the behavior, then add higher layers only for risks they uniquely cover.

| Layer | Use for | Command |
| --- | --- | --- |
| Node/unit/contract | Route maps, content and publication contracts, pure utilities, documentation and build-time rules | `npm test` |
| Playwright browser | Localized navigation, links, menus, keyboard behavior, responsive layouts, visible structure, and browser errors | `npm run test:e2e` |
| Playwright plus axe | Automatically detectable accessibility issues on representative routes | `npm run test:a11y` |
| Visual review | Typography, hierarchy, composition, clipping, imagery, and rendered states against approved design | Follow `visual-qa` and [visual regression policy](visual-regression.md) |
| Static artifact | Generated routes, trailing slashes, internal links, and `NEXT_PUBLIC_BASE_PATH` output | `npm run verify:static-export` after build |

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
