---
id: DESIGN-IX-A11Y
type: design-spec
status: OPEN
related:
  - IA-SITE
  - PAGE-HOME
  - PAGE-CONTACT
  - PAGE-PROJECTS
last_verified: 2026-09-01
---

# Interaction, responsive behavior, and accessibility

## Approved target behavior

- Primary navigation works on desktop and mobile.
- The brand returns to the localized homepage.
- Language switching preserves equivalent page/project context.
- The complete site is usable by keyboard.
- Forms provide labels, validation, submission state, and accessible feedback.
- Project maturity and disclosure do not depend on hover to become understandable.
- The business hierarchy remains clear on narrow screens.
- Motion must not prevent access to content.

## Existing behavior — CURRENT, NOT TARGET

- Fixed translucent navigation with a desktop link row and mobile disclosure menu.
- Single-page anchor navigation.
- Client-state English/Spanish toggle; English is initially loaded.
- Smooth scrolling.
- Scroll-triggered reveals and card/icon hover animation.
- Project external links become visible on hover or focus-within.
- Contact form submits JSON to an environment-configured Formspree endpoint.
- Copy-email button provides temporary copied state.

The existing live site was previously inspected at desktop and 375px width with no horizontal overflow, and the mobile menu worked. This does not validate the future multi-page layout.

## Known existing accessibility issues

- Contact labels are visually present but not programmatically associated with fields.
- Motion content starts at opacity zero, creating a fail-closed risk if JavaScript or hydration does not complete.
- Some project actions are visually hidden until hover/focus.
- Project cards add focusability to a non-interactive container.
- Undefined `ink-400` and `ink-600` utility tokens are referenced.
- Many content images use raw `<img>` elements without an explicit loading strategy.

These are current-state findings, not implementation tasks authorized by Stage A.

## Proposed target requirements

- Content renders visible by default; motion enhances rather than reveals essential content.
- Respect `prefers-reduced-motion` across all animation.
- Keep focus indicators visible and consistent.
- Ensure controls meet suitable pointer target sizes.
- Associate every form label, hint, error, and status programmatically.
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
