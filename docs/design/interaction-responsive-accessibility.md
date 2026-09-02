---
id: DESIGN-IX-A11Y
type: design-spec
status: OPEN
related:
  - IA-SITE
  - PAGE-HOME
  - PAGE-CONTACT
  - PAGE-PROJECTS
last_verified: 2026-09-02
---

# Interaction, responsive behavior, and accessibility

## Approved target behavior

- Primary navigation works on desktop and mobile.
- The brand returns to the localized homepage.
- Language switching preserves equivalent page/project context.
- The complete site is usable by keyboard.
- Forms provide programmatically associated labels and fields, validation, submission state, and accessible feedback. Detailed contact-form behavior is owned by `PAGE-CONTACT`.
- Project maturity and disclosure do not depend on hover to become understandable.
- The business hierarchy remains clear on narrow screens.
- Motion must not prevent access to content.

## Existing implementation context — CURRENT, NOT TARGET

The existing navigation, localization, form, motion, and interaction behavior is recorded in [`ARCH-CURRENT`](../architecture/current-system.md). Existing accessibility and quality risks, including dated browser observations, are recorded in [`ARCH-FINDINGS`](../architecture/current-quality-findings.md). These are current-state facts, not Stage A implementation tasks or target behavior.

## Proposed target requirements

- Content renders visible by default; motion enhances rather than reveals essential content.
- Respect `prefers-reduced-motion` across all animation.
- Keep focus indicators visible and consistent.
- Ensure controls meet suitable pointer target sizes.
- Do not place keyboard focus on non-interactive cards.
- Keep project actions visible or otherwise clearly discoverable on touch and keyboard devices.
- Use semantic landmarks and a single meaningful H1 per page.
- Provide descriptive alternative text based on the image's purpose.
- Validate color contrast after the palette is selected.

## Responsive principles — PROPOSED

- Start with content priority rather than desktop compression.
- Preserve CTA visibility without duplicating competing actions.
- Stack complex grids into a readable single-column sequence.
- Keep form controls full-width on narrow screens.
- Avoid horizontal carousels for essential service or project information.
- Keep line lengths comfortable on wide screens.

## OPEN decisions

- Accessibility conformance target, such as WCAG 2.2 AA.
- Final breakpoints and container widths.
- Header behavior while scrolling.
- Motion durations, easing, and permitted properties.
- Project-card interaction model.
- Touch, tablet, and landscape-specific layouts.
- Formal browser/device support matrix.
- Automated and manual accessibility validation strategy.
