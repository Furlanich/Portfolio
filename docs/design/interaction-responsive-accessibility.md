---
id: DESIGN-IX-A11Y
type: design-spec
status: APPROVED
related:
  - IA-SITE
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-CONTACT
  - PAGE-PROJECTS
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-05
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

## Global app-bar behavior — APPROVED

- The shared site header remains a sticky app bar at the top of the viewport while scrolling in either direction. It stays in normal document flow, uses the approved Surface and Border treatment, and does not hide or translate on scroll.
- At compact and medium widths below `1024px`, the primary navigation links and CTA collapse behind a native disclosure control with an accessible name and an associated navigation panel. The disclosure remains keyboard operable and does not require client-side JavaScript.
- At wide widths of `1024px` and above, the same navigation links and CTA render inline beside the brand and language switch.
- The disclosure trigger and every navigation action remain at least `44px` in both dimensions; the primary CTA remains at least `48px` high. Focus indication uses the approved visible treatment.
- The navigation panel is a normal list of links, not a tablist or modal. Opening it must not introduce horizontal overflow, duplicate the page content, or change the source order of the navigation actions.
- The compact navigation panel is centered against the viewport rather than the hamburger trigger or an inner content column, while retaining a minimum `20px` gutter on each side.
- Sticky positioning must not obscure approved fragment destinations; anchored sections retain adequate scroll margin below the app bar.

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

## Commercial homepage section baseline — APPROVED

These requirements extend the foundation baseline to `HOME-PROBLEMS` through `HOME-CTA`. They preserve the applicable WCAG 2.2 Level AA target without claiming audited conformance.

### Reflow and responsive behavior

- The entire localized homepage remains usable without horizontal scrolling at `320px` CSS viewport width.
- Every section keeps one DOM/source order at every width. CSS grid placement must not reorder cards, steps, copy, or actions for assistive technology.
- Problems and Audiences use one column compact and two columns from medium upward.
- Services uses one column at compact and medium widths and three columns at wide widths.
- Process uses one column compact, two columns medium, and four columns wide. Decorative connectors disappear whenever the sequence wraps and are never required to understand the order.
- Proof fallback remains one content panel at every width. A future approved project-card set uses one column compact, two columns medium, and up to three columns wide.
- Founder uses one column compact/medium and a two-part text-led layout wide. Heading, biography, primary action, then secondary action remain the reading order.
- Section and final-CTA action groups follow the existing CTA rule: full-width stacking below `480px`, then inline wrapping when space permits. Actions must not overlap or require horizontal scrolling.
- Homepage Problems, Services, and Audiences cards use equal content-driven grid tracks within each repeated group and grow together from the tallest card. Cards do not truncate public copy; no fixed pixel height, line clamping, clipping, or false reading order is introduced.
- Long Spanish and English words, URLs, and translated CTA labels must wrap safely inside their containers.

### Semantics and reading hierarchy

- Keep one `main` landmark and the existing single meaningful H1. Each later homepage section is a labelled `section` with one visible H2 and a stable unique heading ID.
- Situation, service, audience, proof-commitment, and future project-card groups use list semantics when they are presented as peer items. Card titles are H3 elements where each item needs its own heading.
- Process is an ordered list. Its visible numerals are not a substitute for `ol` semantics.
- The approved process anchors are `proceso` in Spanish and `process` in English. Anchor navigation must land on the labelled section without hiding its heading.
- The final CTA remains a labelled section, not a second `main`, form, or navigation landmark.
- Non-interactive cards are not links, buttons, or keyboard focus targets. If a future project card has one primary destination, the accessible link name must describe that destination; nested interactive controls must be avoided.
- Maturity, disclosure, limitations, and evidence state must be present in text. They may not depend on color, iconography, hover, or imagery.

### Keyboard, focus, and targets

- DOM order and visual order match. Keyboard users encounter the same CTA hierarchy described by `PAGE-HOME`.
- Every interactive target is at least `44px` in both dimensions; primary and secondary CTA controls remain at least `48px` high.
- Reuse the approved visible focus treatment on Canvas, Surface, and Action-tint backgrounds. Focus must not be clipped by card or section overflow.
- The final Action-tint section uses the existing Canvas/Surface separation and Action-blue-strong outer focus ring; no dark-background focus variant is needed.
- Hover styling is supplementary. Link purpose, card meaning, and disclosure remain understandable on touch screens and by keyboard.

### Motion and media

- Later homepage sections have no scroll-triggered entrance reveal, stagger, parallax, autoplay media, or essential content that begins hidden.
- The approved `160ms ease-out` color/background/border transition may be reused for interactive controls only. Cards do not translate, scale, tilt, or elevate on hover.
- Under `prefers-reduced-motion: reduce`, nonessential transitions and smooth scrolling are removed.
- All content and CTA destinations remain available when JavaScript or CSS motion is unavailable.
- Informative future imagery needs purpose-based alternative text. Decorative icons and connectors are hidden from assistive technology. No image is required to understand any approved launch section.

### Commercial-homepage verification boundary

Implementation must verify the new sections at the existing compact, medium, and wide viewport samples, including `320px`, in both languages. Keyboard traversal, visible focus, source order, anchor navigation, touch-target sizing, reduced motion, JavaScript-disabled content, and an automated accessibility scan are required evidence. Passing those checks supports the implementation review but does not by itself establish whole-site WCAG conformance.

## Services page interaction and responsive baseline — APPROVED

These requirements extend the existing applicable WCAG 2.2 Level AA target to the complete `PAGE-SERVICES` experience without claiming audited whole-site conformance.

### Reflow and reading order

- The page remains usable without horizontal scrolling at `320px` CSS viewport width in both languages. Long headings, provider names, URLs, and CTA labels wrap without clipping.
- Every service and internal group keeps one DOM/source order at every width. Layout must not move boundaries, dependencies, fit guidance, evidence, or CTAs ahead of the situation and outcome for assistive technology.
- Web's three level cards reflow from one column compact to two medium and three wide. WhatsApp's four level cards use one column compact and two columns medium/wide. Scope/boundary and fit/non-fit pairs stack compact and may use two columns from medium when content remains readable.
- Principles use one column compact and two columns medium/wide. Within each repeated Services card group, all cards stretch to equal, content-driven grid tracks based on the tallest card in that group. The tracks grow together for translations and text zoom; no fixed pixel height, clipping, line clamping, truncation, horizontal carousel, or essential accordion is used.
- Every service CTA remains reachable immediately after that service's evidence content. The final CTA remains the last page section.

### Structure and semantics

- Keep one `main` landmark and one meaningful H1. `SERVICE-WEB`, `SERVICE-WHATSAPP`, `SERVICE-CONSULTING`, cross-service principles, and the final CTA are labelled sections with visible H2 elements and stable unique heading IDs. Internal group headings are H3 elements; styling must not skip or flatten the heading hierarchy.
- Situations, work/scope levels, representative examples, engagement scope, exclusions, principles, and commercial boundaries use list semantics when presented as peer items. Visual cards do not replace `ul` semantics.
- The service index is a `nav` with a localized accessible name and a `ul` of ordinary fragment links. It is not a tablist, menu, landmark duplicated at every section, or horizontally scrolling control.
- Fit, non-fit, dependency, limitation, and evidence status remain explicit text. Meaning does not depend on side-by-side position, color, icon, hover, or imagery.
- Non-interactive cards and panels are not focus targets and do not receive pointer or button semantics.

### Anchors, keyboard, and focus

- Approved fragments are `#web`, `#whatsapp`, and `#consultoria` in Spanish, and `#web`, `#whatsapp`, and `#consulting` in English. IDs are unique within each document.
- Fragment navigation lands on the corresponding labelled service without hiding its H2 beneath the header. Use adequate scroll margin rather than inserting an empty anchor target.
- In-page links, language switching, and all CTAs are keyboard operable in logical source order and use the approved visible focus treatment without clipping.
- Service-index and CTA targets are at least `44px` in both dimensions; primary CTA controls remain at least `48px` high. Wrapped index links keep distinct hit areas and visible focus.
- Equivalent-language switching should preserve the matching service fragment when the current URL contains an approved service anchor; falling back to the equivalent page root must never produce a broken fragment.
- `:target` styling, if present, is supplementary and must not flash, animate, or provide the only indication of location.

### Motion and disclosure

- Service content does not use entrance reveals, sticky scroll effects, animated counters, accordions required to access limitations, or motion-dependent anchor cues.
- Smooth scrolling is optional and disabled under `prefers-reduced-motion: reduce`. Content and fragment destinations remain usable without JavaScript.
- Provider caveats, commercial boundaries, and evidence status are not collapsed by default or hidden behind hover, tooltips, or `Read more` controls.

### Services-page verification boundary

Implementation must verify `/servicios/` and `/en/services/` at `320x800`, `375x812`, `768x1024`, `1024x768`, and `1440x900`, plus the optional `/Portfolio` base path. Required evidence covers no horizontal overflow, complete content growth, source and heading order, list/landmark semantics, every fragment from direct load and in-page navigation, unobscured anchor headings, language-switch fragment mapping or safe fallback, keyboard traversal, visible focus, target sizing, touch behavior, reduced motion, JavaScript-disabled content, and an automated accessibility scan. Passing these checks supports review but does not establish whole-site conformance.

## Existing implementation context — CURRENT, NOT TARGET

The existing navigation, localization, form, motion, and interaction behavior is recorded in [`ARCH-CURRENT`](../architecture/current-system.md). Existing accessibility and quality risks, including dated browser observations, are recorded in [`ARCH-FINDINGS`](../architecture/current-quality-findings.md). These are current-state facts, not implementation authority or target behavior.

## Proposed target requirements

- Provide descriptive alternative text based on the image's purpose.

## Responsive principles — PROPOSED

- Start with content priority rather than desktop compression.
- Preserve CTA visibility without duplicating competing actions.
- Keep form controls full-width on narrow screens.
- Avoid horizontal carousels for essential service or project information.
- Keep line lengths comfortable on wide screens.

## OPEN decisions beyond the commercial homepage and Services page

- Whole-site conformance claims, audit scope, and any certification remain unresolved; only the commercial-homepage target above is approved.
- Breakpoints and container behavior for pages and components outside the approved homepage and Services baselines.
- Motion language outside the commercial homepage and basic control-state transitions.
- Project-card interaction beyond the approved homepage constraints.
- Touch, tablet, and landscape-specific layouts outside the approved homepage and Services baselines.
- Formal browser/device support matrix.
- Whole-site automated and manual accessibility validation strategy.
