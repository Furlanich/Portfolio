---
id: DESIGN-VISUAL
type: design-spec
status: APPROVED
related:
  - BRAND-POSITIONING
  - PROJECT-EVIDENCE
  - PAGE-HOME
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-04
---

# Visual language

## Approved communication principles

- The business site should feel professional, confident, direct, and appropriate for prospective clients rather than recruiters.
- Visual hierarchy must prioritize business problems, service outcomes, evidence, and contact actions.
- The founder should be visible without making the homepage a résumé.
- Project visuals must respect disclosure permissions.
- The design should remain simple enough for a small commercial site and should not imitate enterprise complexity.

These principles do not approve a particular aesthetic, palette, font, or component library.

## Homepage foundation visual baseline — APPROVED

This is the minimum visual system required to implement `HOME-HERO` and its immediate navigation/CTA context. It does not finalize the complete site design system.

### Direction

The launch foundation is restrained, editorial, and business-oriented: clear typography, generous whitespace, a light neutral canvas, dark navy text, and one accessible blue action color. The hero is not placed inside a decorative card and does not imitate a large-enterprise or high-gloss startup site.

The first implementation is light-only. A dark theme is not required for implementation or release of the homepage foundation.

### Wordmark

- Use the exact text `FURLANICH` as the initial wordmark.
- Set it in the primary typeface at weight 700, uppercase, with `0.08em` tracking.
- Use the dark text color on light backgrounds and white only on a sufficiently dark approved background.
- Do not add a tagline inside the wordmark.
- A custom symbol, monogram, or redrawn lettering is deferred and must not block the foundation.
- Existing favicon or portfolio icon assets are not automatically approved as the business mark.

### Launch colors

| Role | Value | Intended use |
| --- | --- | --- |
| Canvas | `#F6F7F9` | Default page and hero background |
| Surface | `#FFFFFF` | Navigation and raised content surfaces |
| Ink | `#0B1F33` | Headings and primary text |
| Muted ink | `#4C5D6F` | Supporting copy and trust text |
| Action blue | `#0B57D0` | Primary actions, links, and focus indicators |
| Action blue strong | `#0842A0` | Primary-action hover/active state |
| Action tint | `#EAF1FF` | Secondary-action hover state and restrained accents |
| Border | `#D7DEE7` | Decorative separators and surface boundaries |

Approved text contrast on the launch backgrounds:

- Ink on Canvas: `15.57:1`.
- Muted ink on Canvas: `6.31:1`.
- Action blue on white: `6.39:1`.
- White on Action blue: `6.39:1`.
- White on Action blue strong: `9.14:1`.

The Border color is decorative and must not be the sole indicator of a control or state. Form-control and validation colors remain outside this minimum palette until their interaction requirements are resolved.

### Typography

- Use one sans-serif family for the foundation: Inter with a system sans-serif fallback.
- Font loading and self-hosting are technical implementation decisions; the visual requirement is compatible metrics and the same hierarchy if Inter is unavailable.
- Use weights 400 for body copy, 600 for labels/actions, and 700 for the wordmark and H1.
- Hero H1: `64/68px` wide, `48/52px` medium, and `36/40px` compact.
- Hero description: `20/32px` wide and `18/28px` compact/medium.
- Eyebrow and trust text: `14/20px`, weight 600 for the eyebrow and 400–600 as appropriate for trust text.
- Keep the H1 measure at approximately 16–18 characters per line where space permits; never force manual line breaks that produce awkward localization.

### Spacing and grid

- Use a `4px` base with the launch spacing set `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.
- Content container maximum: `1200px`.
- Horizontal gutters: `20px` compact, `32px` medium, and `48px` wide.
- Layout grid: 4 columns compact with a `16px` gap, 8 columns medium with a `24px` gap, and 12 columns wide with a `24px` gap; implementation may use fewer explicit columns where the same alignment results.
- At wide sizes, the hero copy occupies approximately eight of twelve columns and the remaining space is intentional whitespace.
- Hero vertical padding: `80px` compact, `96px` medium, and `128px` wide, excluding the site header.
- Use `24px` between eyebrow, H1, and description; `32px` before the CTA group; and `32px` before trust/availability content.
- Do not force a viewport-height hero.

### Actions and surfaces

- Primary CTA: Action blue background, white text, no decorative shadow, `10px` corner radius, at least `48px` high, and `16/24px` semibold text with comfortable horizontal padding.
- Secondary CTA: transparent or Surface background, Action blue text and `1px` Action blue border, the same height, radius, and type weight as the primary CTA.
- Hover/active treatment changes color or background only; it does not move or scale the control.
- Focus uses a two-part indicator: `2px` Canvas/Surface separation plus a `3px` Action blue strong outer ring.
- Primary precedes secondary visually and in source order.
- General surfaces use Surface on Canvas, `1px` Border where separation is useful, and no shadow by default. Soft shadow is reserved for overlays or elevation that has a functional reason.

### Hero composition and imagery

The first hero is typography-led and left-aligned. It uses the approved eyebrow, H1, description, CTA group, trust line, and availability statement without a photograph, product screenshot, generated UI, stock illustration, or decorative hero image.

Imagery is therefore **not required** for homepage-foundation implementation. A later approved brand illustration or founder photograph may be added if it supports comprehension and does not displace the core copy or become necessary to understand the offer.

## Commercial homepage section baseline — APPROVED

This section extends the approved foundation only as far as the seven sections below `HOME-HERO`. It does not establish a whole-site component library or reopen the foundation palette, typography family, container, gutters, buttons, focus treatment, or light-theme direction.

### Section rhythm and surfaces

- Standard section padding is `64px` compact, `80px` medium, and `96px` wide.
- Use the existing `1200px` container and approved horizontal gutters. A section introduction has a comfortable maximum measure of `68ch`; it does not stretch to the full container on wide screens.
- Within a section, use `16px` between eyebrow or context text and heading, `24px` between heading and introduction, `32px` before the main content, and `32px` before a section CTA. Larger gaps may use the existing `48px` or `64px` tokens when separating distinct internal groups.
- Alternate only the approved Canvas and Surface backgrounds to clarify the long page: Problems uses Surface; Services uses Canvas; Audiences uses Surface; Proof uses Canvas; Process uses Surface; Founder uses Canvas; and the final CTA uses Action tint.
- Background changes must not be the only way section boundaries are conveyed. Every section has its own heading, and a Border divider may be added where adjacent light surfaces need more separation.
- Do not introduce gradients, glass effects, decorative shadows, or additional accent colors for these sections.

### Later-section typography

- Section H2: `32/38px` compact and `40/48px` medium/wide, weight 700, with a preferred maximum measure around `20ch`.
- Section introduction: `18/28px`, Muted ink, maximum `68ch`.
- Card or step H3: `20/28px`, weight 700.
- Card, list, quality, and supporting copy: `16/26px`; use Muted ink for secondary explanation and Ink for the primary statement.
- Do not reduce later sections to dense label-sized copy or introduce display typography that competes with the H1.

### Shared surface patterns

- A reusable content-card pattern is justified for Problems, Services, and Audiences and for future approved project cards: Surface background, `1px` Border, `16px` radius, no shadow, and `24px` compact or `32px` medium/wide internal padding.
- Cards in one group should align visually but do not need forced equal heights when that would create excessive empty space. Content remains top-aligned.
- The card surface itself is not an action. Do not add hover elevation, pointer cursors, or focus styles to non-interactive cards; only an actual link or button receives interaction treatment.
- A reusable section-shell pattern may provide the approved container, spacing, background, heading measure, and section CTA alignment. This is a design pattern, not a requirement to introduce a new application abstraction.
- Existing primary and secondary action styles are reused unchanged. Text links may use Action blue with an underline visible on hover and focus, but must not depend on color alone.

### Section-specific presentation

- **Problems:** Four situation cards. Use one column compact, two columns medium and wide. Lead with the situation title; no warning color or problem icon is required.
- **Services:** Three outcome cards. Use one column through medium widths and three columns wide. Cards contain only title and summary; the single section CTA follows the group.
- **Audiences:** Four relevance cards in one column compact and two columns medium/wide. The closing line and CTA follow the list instead of becoming a fifth card.
- **Proof launch fallback:** Use one restrained Surface panel inside the Canvas section. Present the introduction followed by three short credibility commitments. Do not use project screenshots, logos, metrics, maturity badges, or simulated case-study cards in the fallback.
- **Future proof cards:** If `PROJECT-EVIDENCE` later approves eligible items, use at most three content cards. Maturity/disclosure and business context lead; technology remains secondary. Visuals are optional and must follow the approved permission rules.
- **Process:** Present the four steps as an ordered sequence with visible two-digit numerals or plain integers. Use one column compact, two columns medium, and four columns wide. Any connecting rule is decorative and disappears when the layout wraps.
- **Founder:** Use a text-led split at wide sizes, with biography and heading taking the larger share and the action group taking the smaller share. Stack in reading order below wide. No portrait placeholder, skills cloud, employer logo, or résumé timeline appears.
- **Final CTA:** Use a full-width Action-tint band with a narrow text measure, the standard primary action, and the standard secondary action. Keep it left-aligned and visually distinct through spacing and background rather than a new color or oversized type treatment.

### Icons and imagery

- No icon is required in Problems, Services, Audiences, Process, Founder, or the final CTA.
- If a later implementation adds a familiar decorative icon, it uses the existing icon dependency, remains secondary to the text label, and is hidden from assistive technology. Do not create a new icon set or use technology logos as service illustrations.
- A founder photograph remains optional. If later approved, it must have a meaningful editorial purpose, truthful alternative text where informative, and a layout that remains complete without it.

## Alternatives and trade-offs

| Decision | Alternatives considered | Approved choice and reason |
| --- | --- | --- |
| Brand mark | Custom symbol or monogram; reuse existing portfolio icon; text wordmark | Text wordmark. It is truthful, fast to reproduce, and avoids making an unreviewed icon permanent. |
| Color direction | Monochrome consultancy; multi-accent technology palette; gradients | Navy/neutral foundation with one blue action color. It communicates technical confidence without visual noise. |
| Typography | Display/body font pairing; multiple current fallbacks; one sans-serif | Inter plus system fallback. One family reduces loading and hierarchy complexity while supporting Spanish and English. |
| Hero layout | Centered promotional block; split layout with image; left-aligned editorial block | Left-aligned typography-led block. It prioritizes the business proposition and works without unapproved imagery. |
| CTA shape | Full pills; sharp rectangles; medium-radius controls | `10px` radius. It is approachable without looking consumer-oriented or decorative. |
| Surface treatment | Gradient/glass effects; card-contained hero; restrained flat surfaces | Flat Canvas/Surface treatment with borders only when useful. It keeps attention on copy and conversion. |
| Theme | Light and dark at launch; dark-only; light-only foundation | Light-only foundation. Theme expansion adds no value to the first conversion path and is deferred. |

## Existing implementation context — CURRENT, NOT TARGET

The existing visual system, styling, assets, and motion implementation are recorded in [`ARCH-CURRENT`](../architecture/current-system.md); associated quality risks are recorded in [`ARCH-FINDINGS`](../architecture/current-quality-findings.md). They describe the legacy personal portfolio and do not approve any token, treatment, or redesign direction.

## Project imagery rules

### APPROVED

- Client logos require permission.
- Restricted client UI and internal workings must not be shown.
- Placeholder logos may exist only in development/testing and must not ship.

### PROPOSED

- Use neutral FURLANICH-branded graphics for restricted production summaries.
- Label generated or conceptual imagery so it cannot be mistaken for a real implementation.
- Prefer real product evidence for Laboratory/prototype work when available.

## OPEN target decisions beyond the commercial homepage

- Custom logo symbol, monogram, and extended brand-lockup system.
- Extended semantic colors, including form validation and project-evidence states.
- Complete type hierarchy beyond the commercial homepage.
- Page- and component-specific density outside the commercial homepage.
- Detailed navigation, form, and evidence-badge variants beyond the approved foundation actions and homepage surfaces.
- Photography, illustration, screenshot, and abstract-graphic direction.
- A broader icon system or custom icon requirements.
- Whether a dark theme is ever introduced.
- Motion language outside the commercial homepage and basic control-state transitions.

## Reference posture

Global Fan, Simple Solutions, and WAPP were named as confidence/professionalism references. Their exact reusable qualities have not been defined, and no reference should be copied wholesale. See the research document for available links and unresolved identity.
