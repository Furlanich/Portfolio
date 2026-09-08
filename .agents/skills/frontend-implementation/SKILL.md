---
name: frontend-implementation
description: Use when implementing or substantially modifying public FURLANICH user interface routes, components, responsive behavior, or visual presentation.
---

# Frontend implementation

## Purpose

Route public UI work through repository authority, test-first implementation, browser evidence, and final readiness review. This Skill does not approve product or design changes.

Do not use it for documentation-only changes, pure Node utilities, dependency maintenance without public UI behavior, or audit-only visual critique.

## Authority

Apply this precedence without exception:

```text
Approved product requirements
        ↓
Approved DESIGN-VISUAL and DESIGN-IX-A11Y
        ↓
Accepted architecture
        ↓
design-taste-frontend-v1
        ↓
Agent aesthetic judgment
```

Taste is critique and implementation guidance. It cannot change approved palette, typography, spacing, content hierarchy, accessibility, motion posture, business positioning, or any other repository-owned decision. Preserve unresolved items as **OPEN**.

## Required workflow

1. Read [project knowledge](../../../docs/index.md) and the owning product/page requirements for the affected route or component.
2. Read [`DESIGN-VISUAL`](../../../docs/design/visual-language.md).
3. Read [`DESIGN-IX-A11Y`](../../../docs/design/interaction-responsive-accessibility.md).
4. Read [the architecture map](../../../ARCHITECTURE.md) and applicable accepted ADR, RFC, or execution plan. Use `architecture-governance` if the requested change crosses an unresolved or consequential boundary.
5. Use `design-taste-frontend-v1` for a preflight critique constrained by the authority order above. Record conflicts and follow repository design.
6. Decide the smallest stable automated tests that define the behavior before writing production code. Identify purely visual or configuration exceptions explicitly.
7. **REQUIRED SUB-SKILL:** Use `test-driven-development` for testable behavior. Observe RED for the intended missing behavior, implement the minimum GREEN change, then refactor while green. Preserve meaningful RED/GREEN evidence.
8. Preserve the accepted static/localized architecture: explicit Spanish-root and English-`/en/` routes, locale-owned content, shared locale-agnostic components, trailing slashes, static export, and `NEXT_PUBLIC_BASE_PATH`.
9. Run focused Node or browser tests continuously; keep failures local and use `systematic-debugging` before proposing fixes.
10. **REQUIRED SUB-SKILL:** Use `playwright-qa` for browser verification of affected routes, engines, viewports, interactions, keyboard behavior, links, console output, and base paths.
11. Run the applicable axe baseline and manual semantic, keyboard, focus, reflow, and contrast checks. Automated scans do not establish WCAG conformance.
12. Use `design-taste-frontend-v1` and `visual-qa` for the post-implementation design audit. Judge against approved design, not Taste defaults.
13. **REQUIRED SUB-SKILL:** Use `verification-before-completion`. Run the complete applicable deterministic validation, including production build and `verify:static-export`; browser QA does not replace either.
14. Finish with `pr-readiness`, complete-diff review, and a human-reviewed Pull Request. Do not merge or push to `main`.

## Expected handoff

Report authoritative records used, RED/GREEN evidence, changed routes/components, browser and accessibility evidence, visual findings, deterministic command results, exceptions, and unresolved items. Separate automated evidence from judgment-based visual review.
