---
id: DESIGN-IX-A11Y
type: design-spec
status: APPROVED
related:
  - IA-SITE
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PROJECTS-EXPERIENCE-CLOSURE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-12
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

## Projects interaction and responsive baseline — APPROVED

- Projects cards use two columns wide and at 1024px, two at medium only when bilingual copy remains readable, and one compact. Content growth determines height; no clipping, line clamp, fixed height, horizontal carousel, or layout-dependent reading order is allowed.
- Use semantic page regions and logical heading levels. Peer card groups use list semantics when useful, and card titles are headings.
- Do not make the entire card clickable when it contains or competes with another link. Use one explicit title or CTA link with a destination-specific accessible name; never nest interactive controls.
- Maturity, disclosure, evidence, and limitation meaning is present in text and does not depend on color, icon, side-by-side position, hover, or imagery.
- Informative screenshots receive workflow-specific alternative text. Decorative or redundant visuals use empty alt text and do not repeat adjacent content.
- Keyboard focus remains visible, primary action targets meet the approved minimum size, and no essential evidence or limitation is hover-only, tooltip-only, or collapsed by default.
- Reduced-motion behavior applies to all optional project transitions. Tilt, scaling hover, animated depth, and motion-dependent evidence are not used.
- The index and eligible details remain usable at 200% text zoom and reflow without horizontal scrolling at 320 CSS px.

### Projects verification boundary

Verify both locales at `320x800`, `375x812`, `768x1024`, `1024x768`, and `1440x900`, plus root and optional `/Portfolio` base paths. Check card alignment, natural-height growth, translated-copy expansion, image containment and legibility, no horizontal overflow, heading/list/link semantics, CTA order, correct card/detail destinations, visible focus, keyboard-only traversal, evidence-label readability, 200% text zoom, reduced motion, JavaScript-independent content, and an automated accessibility scan. Detail pages require compact and wide evidence. Passing these checks does not establish whole-site conformance.

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

## OPEN decisions beyond the commercial homepage, Services page, Projects experience, Studio, Founder, and Contact

- Whole-site conformance claims, audit scope, and any certification remain unresolved; only the commercial-homepage target above is approved.
- Breakpoints and container behavior for pages and components outside the approved homepage, Services, Projects, Studio, Founder, and Contact baselines.
- Motion language outside the commercial homepage, Services, Projects, Studio, Founder, Contact, and basic control-state transitions.
- Touch, tablet, and landscape-specific layouts outside the approved homepage, Services, Projects, Studio, Founder, and Contact baselines.
- Formal browser/device support matrix.
- Whole-site automated and manual accessibility validation strategy.


## Studio and Founder interaction and responsive baseline — APPROVED

These requirements extend the applicable WCAG 2.2 Level AA target to PAGE-STUDIO and PAGE-FOUNDER without claiming audited whole-site conformance.

### Required viewport matrix

Verify both localized page pairs at:

- 320x800;
- approximately 390x844;
- 768x1024 tablet;
- 1024x768;
- 1440x900;
- the same relevant routes under the optional /Portfolio base path.

At every size, verify no horizontal overflow, complete content growth, correct source/reading order, heading and list semantics, CTA wrapping, visible focus, keyboard traversal, target sizing, 200% text zoom, reduced motion, JavaScript-independent content, and an automated accessibility scan.

### Studio reflow

- Below 768px, every section is one column. In STUDIO-INTRO, text and actions precede the operating-model panel. Accountability copy precedes collaborator wording. Founder copy precedes its action.
- From 768px, the four principles use a two-by-two grid while all copy remains natural height. Location remains a normal text band.
- At 1024px and above, the intro uses the approved approximately 7/12 and 5/12 split. Other editorial splits may align to the 12-column grid without changing DOM order.
- At 1440px the content remains inside the 1200px container; line length does not expand to fill the viewport.
- CTA groups stack full-width below 480px and wrap inline from 480px when space permits. The operating-model list and location copy never become horizontal rails.
- Long Spanish and English words and labels wrap safely. No panel, heading, or action uses clipping, line clamping, or fixed height.

### Founder reflow

- The text-led header keeps one source order and uses the available content width below 1024px. At wide sizes it remains near an eight-column reading measure; no absent portrait column reserves space.
- Professional actions stack full-width below 480px and wrap from 480px. Download CV remains first. LinkedIn and GitHub remain distinct reachable targets.
- Experience entries keep period, role, context, and summary in the same list item. Below 1024px the period appears immediately above the role; at 1024px and above a narrow period column may sit beside the wide content column.
- Education uses one column compact and may use two from 768px when both entries remain clearly associated.
- Capability groups use one column below 768px and two columns from 768px. Technology names, URLs, and English compound words wrap without overflow.
- The Projects bridge and final CTA remain one-column reading blocks at compact sizes. A portrait, if approved later, can never displace the H1, biography, or professional actions.

### Semantics and accessibility

- Each localized page has one main landmark and exactly one meaningful H1.
- Every major page section is a labelled section with one visible H2 and a stable unique heading ID. Collaborator wording and capability-group labels may use H3 beneath their owning H2.
- Principle, experience, education, capability-group, and capability-item peers use list semantics where presented as groups. Visual cards or columns do not replace list structure.
- Heading levels do not skip for styling. DOM order and visual order match at every breakpoint.
- Link labels describe their destination: “Conocer a Samuel / Meet Samuel,” “Ver proyectos seleccionados / View selected work,” and the approved Contact labels remain explicit.
- The CV is a same-origin file action and must work at root and configured base path. LinkedIn and GitHub use consistent accessible external-link behavior. If implementation opens them in a new tab, visible or assistive text communicates that behavior and rel attributes prevent opener access; opening in the same tab is also acceptable.
- An informative future portrait requires concise purpose-based alt text. A decorative portrait uses empty alt. No image is required to understand either page.
- All controls are keyboard reachable, targets are at least 44px in both dimensions, CTA controls are at least 48px high, and focus uses the approved visible treatment without clipping on Canvas, Surface, or Action tint.
- No accountability, collaborator, evidence, location, experience, education, capability, or link meaning is hidden behind hover, a tooltip, animation, icon, or color.
- Text remains readable and operable at 200% zoom. Layouts reflow rather than introducing two-dimensional scrolling.
- Section entrance motion, parallax, animated timeline drawing, and floating icons are absent. Under prefers-reduced-motion: reduce, nonessential control transitions and optional smooth scrolling are removed.

## Contact interaction, responsive, and accessibility baseline — APPROVED

These requirements implement the `PAGE-CONTACT` state model without claiming audited whole-site conformance.

### Form semantics and validation

- Use one semantic form with an accessible name, one visible label per control, stable control/error IDs, native `required` where applicable, and localized visible required/optional text.
- Associate helper and error text through `aria-describedby`; set `aria-invalid="true"` only while a control is invalid. Do not remove a helper when an error appears if both remain relevant.
- Name, email, and company use appropriate `autocomplete` tokens (`name`, `email`, and `organization`); email uses the email input type and mobile keyboard hint. The message remains a normal multiline text control.
- On validation failure, show every relevant inline error, preserve every value, and focus the first invalid control. Four fields do not require an error summary when this focus and association contract is met.
- Errors include explicit text and are not communicated by color, border, icon, placeholder, tooltip, or motion alone.

### Submission states and focus

- `SUBMITTING` sets the form busy, disables the field group and submit control for the active request, preserves visible labels and values, exposes localized progress through a polite live region, and prevents duplicate click, Enter, or programmatic submission.
- Enter submits from single-line controls according to native form behavior. The textarea keeps newline behavior. Every action remains keyboard operable with a visible unclipped focus indicator and at least 44px target dimensions; primary controls remain at least 48px high.
- In demonstration mode, `SUCCESS` occurs only after the injected local adapter completes the simulated accepted scenario. Announce and programmatically focus a `role="status"` message with `tabindex="-1"`, reset the fields, and state explicitly that no data was sent or inquiry created. In a future commercial mode, `SUCCESS` retains the stricter provider-acceptance meaning.
- `ERROR` covers the deterministic demonstration failure and, in a future commercial mode, validation-safe provider rejection, rate/quota failure, timeout/network failure, and malformed or unknown responses. Restore controls, preserve every entered value, announce and focus an alert/error status, offer retry, and keep WhatsApp strongest, then email and phone. Never expose raw adapter/provider errors.
- No automatic retry is approved. Reduced-motion preferences remove nonessential transitions; no state meaning depends on animation or a spinner.

### Reflow and progressive availability

- Below 1024px, source and visual order is intro, form, response expectation/alternatives, Founder context. At 1024px and above, the form may occupy approximately eight columns and the supporting block four without CSS ordering that changes reading or focus order.
- All fields are full width and single column. At 320px, approximately 390px, 768px, 1024px, and 1440px, verify translated-copy/error expansion, textarea resizing, 200% zoom, landscape/tablet use, and no clipping or horizontal overflow.
- If client-side JavaScript fails, the localized Contact content and WhatsApp, email, and phone alternatives remain usable. Do not replace the primary in-page form with a `mailto:` action, provider-hosted success page, or false success state.
- The demonstration notice remains visible without JavaScript. Submission in demonstration mode must not initiate `fetch`, XHR, beacon, document navigation, mail activation, storage, logging, or analytics; external fallback links act only after the visitor activates them.

### Verification boundary

Verify both locale routes at `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x900`, including root and optional `/Portfolio` base paths. Cover keyboard-only completion and retry; focus/error association; all state announcements; duplicate prevention; preserved values; reset after simulated success only; textarea resize; translated copy; 200% zoom; reduced motion; no raw adapter response; fallback order; representative axe scans; manual contrast, semantics, reading-order, and assistive-technology checks; and zero inquiry-value network traffic. A labeled live delivery smoke is required only by a later commercial activation and never runs automatically in public CI.
