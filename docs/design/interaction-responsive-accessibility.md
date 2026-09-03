---
id: DESIGN-IX-A11Y
type: design-spec
status: APPROVED
related:
  - IA-SITE
  - PAGE-HOME
  - PAGE-CONTACT
  - PAGE-PROJECTS
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-03
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

## Homepage foundation interaction and responsive baseline — APPROVED

These requirements close the minimum behavior needed for `HOME-HERO`; they do not claim whole-site accessibility conformance.

### Responsive ranges

- Compact: below `768px`.
- Medium: `768px` through `1023px`.
- Wide: `1024px` and above.
- The implementation must remain usable without horizontal scrolling at `320px` CSS viewport width.
- Hero content keeps one semantic/source order at every width. Layout changes must not duplicate or reorder the message for assistive technology.
- At compact and medium widths, hero copy uses the full available content width. At wide widths it occupies the approved partial grid from `DESIGN-VISUAL`.
- CTAs stack at full content width below `480px`; from `480px` upward they sit inline when space permits and wrap without overlap.
- Trust and availability copy may wrap onto separate lines. It must not use a horizontally scrolling rail.

### Accessibility

- The homepage foundation targets the applicable WCAG 2.2 Level AA criteria for semantics, keyboard access, focus visibility, contrast, reflow, target size, and reduced motion.
- Render exactly one meaningful H1 on each localized homepage.
- Keep primary CTA before secondary CTA in DOM and visual order.
- CTA controls are at least `48px` high and no interactive target is smaller than `44px` in either dimension.
- Focus indication must remain visible against Canvas, Surface, and action colors.
- The hero remains complete and understandable when CSS motion is unavailable and when JavaScript does not run.

### Motion

- The first hero implementation has no entrance reveal, parallax, scroll-linked motion, autoplay media, or content that begins hidden.
- Hover, focus, and active state transitions may use a single `160ms ease-out` timing for color, background, and border changes.
- Controls do not translate or scale on interaction.
- Under `prefers-reduced-motion: reduce`, nonessential transitions are removed.

### Alternatives and trade-offs

| Decision | Alternatives considered | Approved choice and reason |
| --- | --- | --- |
| Responsive model | Shrink the desktop composition; maintain separate mobile content; one source-order reflow | One source-order reflow. It preserves meaning and accessibility while minimizing duplicate content. |
| Hero motion | Scroll/entrance reveal; subtle initial fade; no entrance motion | No entrance motion. It removes the current fail-closed risk and lets visual polish be revisited without blocking implementation. |

## Existing implementation context — CURRENT, NOT TARGET

The existing navigation, localization, form, motion, and interaction behavior is recorded in [`ARCH-CURRENT`](../architecture/current-system.md). Existing accessibility and quality risks, including dated browser observations, are recorded in [`ARCH-FINDINGS`](../architecture/current-quality-findings.md). These are current-state facts, not implementation authority or target behavior.

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

## OPEN decisions beyond the homepage foundation

- Whole-site conformance claims, audit scope, and any certification remain unresolved; only the homepage-foundation target above is approved.
- Breakpoints and container behavior for pages and components outside the homepage foundation.
- Header behavior while scrolling.
- Motion language outside the hero and basic control-state transitions.
- Project-card interaction model.
- Touch, tablet, and landscape-specific layouts for later page sections.
- Formal browser/device support matrix.
- Whole-site automated and manual accessibility validation strategy.
