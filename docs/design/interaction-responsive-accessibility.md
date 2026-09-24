---
id: DESIGN-IX-A11Y
type: design-spec
status: APPROVED
related:
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - RFC-MARKETING-NARRATIVE-CLOSURE
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
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
last_verified: 2026-09-24
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

- The shared site header remains a sticky app bar at the top of the viewport while scrolling in either direction. It stays in normal document flow, uses the approved Surface and Border treatment, and does not hide or translate on scroll. *The Surface/Border fill is superseded on every route by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved)'s atlas-plate chart-header material (D-22; RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 4). The sticky, normal-flow and no-hide/no-translate rules are retained unchanged, including on Home; the Home dock transition keyed to `scrollY` is the only scroll-linked change D-22 introduces.*
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
- Problems and Audiences use one column compact and two columns from medium upward. *Superseded on Home only by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) D-13's plotting-sheet cascade (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 12); Audiences content is already retired into Problems and Services per `PAGE-HOME`.*
- Services uses one column at compact and medium widths and three columns at wide widths. *Superseded on Home only by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) D-14's catalogue plates (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 12).*
- Process uses one column compact, two columns medium, and four columns wide. Decorative connectors disappear whenever the sequence wraps and are never required to understand the order. *Superseded on Home only by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) D-17's ecliptic composition (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 12).*
- Proof fallback remains one content panel at every width. A future approved project-card set uses one column compact, two columns medium, and up to three columns wide.
- Founder uses one column compact/medium and a two-part text-led layout wide. Heading, biography, primary action, then secondary action remain the reading order.
- Section and final-CTA action groups follow the existing CTA rule: full-width stacking below `480px`, then inline wrapping when space permits. Actions must not overlap or require horizontal scrolling.
- Homepage Problems, Services, and Audiences cards use equal content-driven grid tracks within each repeated group and grow together from the tallest card. Cards do not truncate public copy; no fixed pixel height, line clamping, clipping, or false reading order is introduced. *Superseded on Home only by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) D-13, D-14 and D-17 (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 12); non-Home grids are unaffected.*
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

## MKT-D07-IX-R1 — Marketing navigation and demo interactions — APPROVED

**Revision 1: APPROVED. Human disposition D07: APPROVED.** Human reviewer: project owner (user). Date: 2026-09-16. Source: explicit disposition in [the decision-review task](codex://threads/01a0a5e6-85b2-7122-90e8-ba0e0ccf09a2), following the R1 packet published in [PR #52](https://github.com/Furlanich/Portfolio/pull/52). The user wrote “DO7: APPROVED”; DO7 is recorded as D07, accepting both VIS-R1 and IX-R1. Approval selects these design treatments, not the still-OPEN content, evidence-placement or IA decisions D02–D06. No implementation is performed or authorized by this documentation task.

Compared with DESIGN-IX-A11Y at main revision 2be0286 (approved baseline last verified 2026-09-12). Preserve static localized routes, source-order parity, semantic landmarks, visible focus, 44px minimum targets, 48px primary actions, reduced-motion behavior and zero-transmission Contact. No animation, scroll-linked scene, forced focus trap or modal menu is introduced.

| Interaction | Accepted interaction treatment | Acceptance evidence after implementation |
| --- | --- | --- |
| Global demo notice | In normal flow, visible on direct entry, not dismissible; plain status text, not role=alert; explanation link to Contact | All route families / ES+EN, no-JS, screen-reader landmark/reading-order check |
| Mobile disclosure selection | With enhancement available, selecting a destination closes the menu. Same-page selection lands with heading visible below sticky bar; move focus to the destination heading without leaving it in hidden menu content | Keyboard Enter, touch/click, same-page and cross-page paths; no scroll/focus race |
| Escape in open menu | Close and return focus to disclosure trigger; no trap. Closed-state Escape does nothing | Keyboard in ES/EN; viewport 320/390/768 |
| Native fallback | Disclosure and ordinary links remain usable without JavaScript; selecting an anchor may leave native disclosure open, but user can close with the trigger | No-JS journey remains available; do not claim enhanced closure without JS |
| Fragment offsets | Account for sticky app bar only; the notice is not sticky. Respect reduced motion. Existing process/service fragments stay stable; proposed shared-boundary fragments are additive | Heading visible at settled scroll position at all widths |
| Language switch | Equivalent semantic route; no client-only locale state or loss of project detail | All existing pairs including MPC |
| Founder groups | Use stable unique whitespace-free IDs; localized title never becomes a raw aria-labelledby token list | DOM reference validation, axe incomplete follow-up, keyboard/screen-reader spot check |
| Contact order | Intro, form disclosure, four fields/helpers, local state/button, external examples, Founder link; no response-time block in current mode | Same order visually/DOM at all five widths; unchanged failure preservation and successful reset |
| Form errors/states | Existing first-invalid/status focus behavior and no-send confirmations; no new data collection, persistence or real channel activation | Existing contract tests plus browser interaction and request/storage checks |
| Cards/links | Noninteractive content remains noninteractive. No whole-card pseudo-action, hover-only content or hidden essential limits | Keyboard order, touch and no-JS review |

**D07 acceptance recorded:** VIS-R1 and IX-R1 are APPROVED without wording exceptions. The global notice and revised Contact order require D03; new shared-boundary fragments require D05/D06. Existing routes and language pairs remain unchanged. Earlier interaction clauses are superseded only for the accepted enhanced-menu dismissal/Escape/focus behavior and the named treatments whose content dependencies are subsequently accepted. No notice copy, response-block removal, added fragment or IA change is approved through D07 alone. Existing valid-ID and unobscured-anchor requirements already authorize later correctness repairs through a separate implementation PR; this documentation task performs none. Reduced motion removes nonessential transitions; no new transitions are proposed.

## IMMERSIVE-HOME-V1 — Progressive WebGL interaction — APPROVED

**Approved 2026-09-19.** This section records the responsive, interaction and accessibility requirements accepted in [RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1](../rfcs/visual-identity-immersive-experience-v1.md) and the architecture boundary in [ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE](../decisions/progressive-immersive-homepage.md). It supersedes the earlier homepage prohibition on scroll-linked motion only for the signature scene described here. All other page-motion restrictions and the existing semantic, keyboard, focus, target-size, Contact and evidence requirements remain authoritative.

### Progressive structure

The localized homepage must be complete before enhancement:

- one server-rendered HTML proposition, description and CTA sequence;
- the protected SVG identity;
- a resolved static poster occupying the final scene dimensions;
- a lazy capability gate that may replace or cover the poster with the decorative real-time scene.

No heading, paragraph, CTA, navigation destination, evidence state or disclosure exists only inside canvas. The canvas is decorative, is excluded from the accessibility tree, receives no focus and never intercepts page scrolling or ordinary pointer interaction. The same semantic/source order is used at every width and in both locales.

The poster remains when reduced motion is requested, WebGL is unavailable or unsuitable, initialization fails or the context is lost. Failure is quiet: no error panel interrupts the visitor, layout dimensions remain stable, and all copy/actions continue to work.

### Scroll behavior and motion

Native document scroll maps normalized progress to four reversible states: Recognition, Fragmentation, Connection and Coordination. Scrolling backward reverses the state progression without jumps or a second narrative. The site does not hijack scrolling, change the scrollbar, require a cinematic wait, autoplay audio or hide essential content pending animation.

The scene may animate camera, transform, opacity and material properties. It must not animate document layout. Rendering settles when progress stops; continuous idle animation is outside v1. The existing Framer Motion boundary is the first orchestration candidate. GSAP or another scroll runtime requires prototype evidence that the existing dependency cannot produce smooth reversible progression.

Under `prefers-reduced-motion: reduce`, the resolved poster is shown and the narrative remains understandable without scrub motion. Reduced motion is a complete composition, not a slowed version of the effect.

### Responsive composition

| Width | Required composition |
| ---: | --- |
| 1440 px | Full split editorial stage with complete depth and camera travel inside the 1200px content boundary |
| 1024 px | Compressed split with shorter camera movement and unchanged semantic order |
| 768 px | Stacked or locally overlaid stage with reduced scene detail |
| 390 px | Copy and actions first; compact local scene without a long pinned viewport |
| 320 px | Same reading order with tighter measure, simplified detail and full-width actions |

Rendering quality is capability-aware rather than selected by width alone. Long Spanish and English content must grow without clipping or horizontal overflow. The compact layouts cannot make visitors traverse an artificially long pinned stage. At 200% text zoom, the semantic content reflows and the decorative scene must not obscure it.

### Capability and verification boundary

Prototype and implementation evidence must cover:

- both locales and all five representative widths;
- forward and reverse scroll progression;
- keyboard traversal and visible focus independent of canvas;
- reduced motion, unavailable WebGL, forced initialization failure and context loss;
- no-JavaScript semantic content and poster;
- layout stability before, during and after lazy activation;
- root and optional `/Portfolio` base-path behavior;
- representative loading cost, JavaScript transfer, frame time and mobile quality reduction.

The [prototype review](../reviews/immersive-homepage-prototype-2026-09-19/index.md) closes the first feasibility questions. The accepted production interaction, responsive, media and budget requirements are recorded in the V1.1 revision below.


## IMMERSIVE-HOME-V1.1 — Adaptive hybrid interaction — APPROVED

**Approved 2026-09-20.** This revision implements the accepted requirements in [RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1](../rfcs/adaptive-immersive-homepage-production-v1.md) and [ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE](../decisions/adaptive-immersive-homepage.md). It supersedes the earlier React Three Fiber candidate, single-poster reduced-motion detail, responsive composition table and OPEN performance thresholds. The semantic-first and native-scroll requirements remain.

*The C2 two-zone composition, the four static chapter posters and the phase spine are superseded on Home by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 3); the optional Connection video is separately withdrawn (item 17, marked below). The chapters, their meaning, the "Progressive structure and media lifecycle" section's HTML-before-Three.js painting order, one-shot initialization and context-loss handling, and the "Scroll and motion control" section's no-idle-loop rendering and reversible native scroll are NOT superseded and remain in force; see `ADR-SKY-CHART-HOMEPAGE-RUNTIME` for the retained runtime boundaries.*

### Progressive structure and media lifecycle

The server-rendered page owns localized copy, actions, chapter descriptions, captions, protected identity and stable static artwork. Direct Three.js and one optional native Connection video are progressive enhancements.

The page paints meaningful HTML and the Recognition poster before loading Three.js. The Connection film is requested only as its chapter approaches the viewport, pauses when inactive and retains its poster. No more than one video decodes or plays. Save-Data, reduced motion, no JavaScript, unsupported WebGL and initialization failure use the static path. Context loss removes the canvas for the session. Initialization is attempted once. *The Connection-film sentences are WITHDRAWN by [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](../decisions/sky-chart-homepage-runtime.md) (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 17, accepted at gate G1): the sky-chart runtime carries no video surface. The rule that the page paints HTML before loading Three.js stays in force; the thing painted first is now the D-23 environment poster pair, not the Recognition poster. Save-Data/reduced-motion/no-JS/unsupported-WebGL/initialization-failure behavior, context loss and one-shot initialization also remain in force unchanged.*

### Scroll and motion control

Native progress maps to four stable reversible chapters: Recognition, Fragmentation, Connection and Coordination. Reverse scrolling follows the same paths. Geometry, video and surface transitions settle when scrolling stops; no idle render loop continues.

A visible **Pause motion** control beside instrument status pauses WebGL updates and active video without changing the chapter. It is keyboard operable, exposes its state, has a visible focus indicator and supplements rather than replaces `prefers-reduced-motion`. *Superseded on Home by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) D-25 (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 16): the control moves to a fixed viewport corner, shown only while the chapter span is in view, with the phase readout hidden below 768px instead of shown beside a duplicated status. Its keyboard operability, `aria-pressed` state and supplementary role beside `prefers-reduced-motion` are retained.*

Reduced motion presents static chapter compositions with immediate state changes and no autoplay. No audio autoplays.

### Responsive choreography

*This five-width table is superseded on Home by [`SKY-CHART-V2`](#sky-chart-v2-sky-chart-home-and-app-bar-approved) (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 16): the plan's section 10 scene mapping and D-11–D-19 layout rules replace it.*

| Width | Required composition | Media behavior |
| ---: | --- | --- |
| 1440 px | Editorial anchor, integrated phase spine and persistent 4:5 stage | Complete depth and restrained camera travel |
| 1024 px | Compact two-zone composition | Shorter travel and fewer simultaneous layers |
| 768 px | Sequential copy and media | Short local sticky behavior only if real-device testing proves useful |
| 390 px | Four document chapters with inline 1:1 media | No prolonged pinning; near-viewport media only |
| 320 px | Condensed headings, full-width actions and static-first media | Minimal depth; nonessential labels removed |

Resize preserves the active chapter and document position. It cannot restart media, jump the page or retain a desktop intermediate state after reflow. Width does not stand in for capability. Both locales grow without clipping, and media yields to content at 200 percent zoom.

### Accessibility and failure contract

The canvas is decorative, excluded from the accessibility tree, unfocusable and unable to own scroll or pointer interaction. Chapter meaning appears in HTML. Meaningful video receives an adjacent caption and transcript *(moot on Home: WITHDRAWN by item 17, below)*; decorative brand film is hidden from assistive technology and contains no essential information. Color is never the only state signal.

| Condition | Required result |
| --- | --- |
| JavaScript unavailable | Complete semantic document and static chapter artwork |
| Dynamic import failure | Current static composition remains |
| WebGL unsupported | Static chapter compositions |
| Context loss | Canvas removed for the session; current poster remains |
| Video blocked or failed *(WITHDRAWN, item 17)* | Poster and HTML caption remain |
| Slow connection | Poster remains without interruption |
| Resize during transition | State recalculates from document position |
| Optional asset absent | Chapter closes without an empty frame |

*The video-specific caption/transcript sentence above and the "Video blocked or failed" row are WITHDRAWN by [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](../decisions/sky-chart-homepage-runtime.md) (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 17, accepted at gate G1): the sky-chart runtime carries no video surface, so no condition can produce a blocked or failed video. Every other row and the rest of this paragraph remain in force unchanged.*

### Production gates

| Gate | Limit |
| --- | ---: |
| Incremental immersive JavaScript | ≤120 KiB Brotli |
| First poster | ≤150 KiB |
| Compact Connection-video rendition *(WITHDRAWN, see below)* | ≤1.2 MB |
| Wide Connection-video rendition *(WITHDRAWN, see below)* | ≤2.5 MB |
| Simultaneously playing videos *(WITHDRAWN, see below)* | 1 |
| Canvas device-pixel ratio | ≤1.5 wide; ≤1.25 compact |
| Scroll frame interval p95 | ≤20 ms |
| Main-thread interaction task | <50 ms |
| Media-attributable layout shift | 0 |
| LCP p75 | ≤2.5 seconds |
| INP p75 | ≤200 ms |

*The three video rows above are WITHDRAWN by [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](../decisions/sky-chart-homepage-runtime.md) (RFC-SKY-CHART-VISUAL-SYSTEM-V2 supersession item 17, accepted at gate G1): the sky-chart runtime carries no video surface, so no Connection-video budget applies. Every other gate in this table is retained and restated, with its current values, in `ADR-SKY-CHART-HOMEPAGE-RUNTIME`'s production gates table.*

The prototype bundle is not accepted merely because it fell below the JavaScript ceiling by only 3,173 bytes (about 3.1 KiB). Production must create meaningful headroom or return to governance before exceeding the ceiling.

Acceptance evidence covers both locales, all five widths, forward/reverse traversal, resize and orientation change, keyboard/focus, 200 percent zoom, reduced motion, Save-Data, no JavaScript, unavailable WebGL, initialization failure, context loss, blocked media *(moot on Home: WITHDRAWN by item 17, above)*, root and optional base paths, static export, layout stability, a constrained Android device and repeated traversal for memory and thermal behavior.

## SKY-CHART-V2 — Sky Chart Home and App Bar — APPROVED

**APPROVED — 2026-09-24.** Recorded after the repository owner approved and merged [Governance PR #77](https://github.com/Furlanich/Portfolio/pull/77) (merge commit `70168e9`), accepting [`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](../rfcs/sky-chart-visual-system-v2.md). This section is the approved interaction, responsive and accessibility record for the Sky Chart App Bar (every route) and the Home environment. The complete normative specification is [`PLAN-SKY-CHART-HOME-REDESIGN-V2`](../plans/active/sky-chart-home-redesign-v2.md) sections 6 (D-22 to D-25, D-27), 11 (animation and motion architecture) and 13 (accessibility strategy); this section records the approved rules concisely and links to the plan for exact numeric values.

### App Bar behavior (D-22)

On every localized route the App Bar keeps the approved prohibition on hiding, translating or animating based on scroll direction, stays sticky at `top: 0` in normal document flow, and reuses the approved target-size, focus and disclosure rules (see the item 4 markers above). On Home only, it docks from a transparent top state to the atlas-plate fill once `scrollY > 24`; that is the sole scroll-linked change. At ≥1024px, Home shows a decorative mono readout naming the current section, and the Process link receives `aria-current="location"` while its fragment is in view; other routes receive ordinary `aria-current="page"`. Below 1024px the existing native disclosure panel is retained, restyled to the atlas-plate material, with unchanged open/close and Escape behavior.

### Environment fallback and recede (D-23, D-24)

The canvas, ground, scrim, glyphs, bearings, plate numbers, readout, decorative arc and Bayer letters are all `aria-hidden`; all meaning stays in HTML in the approved source order. The locale-neutral static poster pair (D-23) is the complete fallback for reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure and context loss, matching the existing `IMMERSIVE-HOME-V1.1` failure contract. The recede/suspend behavior (D-24) adds a new idle condition — rendering stops while fully receded, in addition to stopping when scroll progress settles — and is itself decorative; no focusable control or meaning depends on it.

### Pause control (D-25)

The Pause motion control (see the item 16 marker above) is fixed at the viewport corner, shown only while the chapter span is in view, and hidden with the `hidden` attribute during the hero and under the D-24 recede rule. Hiding it during the hero never removes a focusable control while motion is visible, because the canvas shows no chapter motion before Chapter 1. It remains keyboard operable, exposes `aria-pressed`, and keeps a visible focus indicator, supplementing rather than replacing `prefers-reduced-motion`.

### Compact hero label mask (D-27)

Below 768px, tier-2 scene input labels and their links render at opacity 0 while the hero's bottom edge is below 60% of the viewport, following the normal reveal once the hero has scrolled past that line. This is an addition (found at Gate F, where labels collided with the H1 and lede at 390px), not a supersession of an existing rule: at ≥768px the D-03 scrim already separates labels from hero text, so no mask applies there.

### Motion architecture (plan section 11)

Every Home animation uses only `opacity`, `filter` or `transform`: the scene's scroll-driven bearing sweep and reveals settle when input stops; the recede/scrim transition and the App Bar dock use short CSS transitions; the Position fix toggle crossfades; hover stays color-only at 160ms. Content has no entrance animation or scroll reveal. Under reduced motion, the scene is not initialized (the static poster shows), and every other transition becomes instant.

### Accessibility strategy (plan section 13)

Heading hierarchy and landmark count are unchanged. Keyboard tab order is App Bar, hero actions, Problems action, Services action, the Position fix toggle buttons, Proof action, Process action, Founder action, CTA actions, then the Pause control when present, in the approved source order; focus is always visible and the sticky bar never hides a focused element (`scroll-padding-top: 96px`). Every text pair introduced by `SKY-CHART-V2` (design-visual D-04 to D-06 and D-19) is asserted by `scripts/design-tokens.test.mjs`, including worst-case translucent composites. Forced colors and reduced transparency follow `DESIGN-VISUAL` D-07. Zoom and reflow: 320px with no horizontal scroll, and 200% text zoom with content growth; the hero exceeds `100svh` when needed rather than clipping content. Targets stay at least 44px, with 48px for the primary CTA. A real NVDA + Firefox check and a VoiceOver iOS spot check close the previous plan's deferred screen-reader item (Task 11 manual QA).

### Scope and supersession boundary

This section and its inline markers above supersede, only within the stated boundary: the `IMMERSIVE-HOME-V1.1` C2 two-zone composition, the four static chapter posters and the phase spine (item 3, Home only; see the header marker above); the Global app-bar Surface/Border fill (item 4, every route; sticky/normal-flow/no-hide retained); the Home column-count and equal-track rules for Problems, Services and Process (item 12, Home only); the optional Connection-video permission (item 17, withdrawn, marked below); and the Pause control's placement plus the `IMMERSIVE-HOME-V1.1` five-width responsive-choreography table (item 16, Home only; the control's keyboard operability, `aria-pressed` state and supplementary role are retained). Item 3 does **not** supersede "Progressive structure and media lifecycle"'s painting-before-Three.js order, one-shot initialization or context-loss handling; nor "Scroll and motion control"'s no-idle-loop rendering and reversible native scroll; nor the "Accessibility and failure contract" or "Production gates" sections outside the video-specific rows marked below. The chapters and their meaning are retained. D-27 is a new addition, not a supersession. Outside these named boundaries, this document's other approved sections remain authoritative unchanged, including for Services, Projects, Studio, Founder, Contact and Privacy.
