---
id: DESIGN-VISUAL
type: design-spec
status: OPEN
related:
  - BRAND-POSITIONING
  - PROJECT-EVIDENCE
last_verified: 2026-09-01
---

# Visual language

## Approved communication principles

- The business site should feel professional, confident, direct, and appropriate for prospective clients rather than recruiters.
- Visual hierarchy must prioritize business problems, service outcomes, evidence, and contact actions.
- The founder should be visible without making the homepage a résumé.
- Project visuals must respect disclosure permissions.
- The design should remain simple enough for a small commercial site and should not imitate enterprise complexity.

These principles do not approve a particular aesthetic, palette, font, or component library.

## Existing implementation baseline — CURRENT, NOT TARGET

### Color

- Blue brand scale from `#EEF3FB` to `#041735`, with primary dark blue `#0B3D91`.
- Ink neutrals `#0F1115`, `#2B2F38`, and `#4E5562`.
- Paper neutrals white, `#F5F7FA`, and `#E4E8F0`.
- Light-only color scheme and a vertical white/gray page gradient.

### Typography

- Inter loaded through Next.js with IBM Plex Sans, Poppins, and generic sans-serif fallbacks.
- Uppercase, widely tracked section labels.
- Semibold headings and compact body copy.

### Layout and components

- `max-w-6xl` centered container with 24px horizontal padding.
- Sections generally use 64px mobile and 96px medium-screen vertical padding.
- Rounded cards and pill-shaped buttons.
- Thin neutral borders, translucent white surfaces, soft shadows, and blue focus/interaction states.
- Project grid expands from one column to two and three columns.

### Imagery and iconography

- Lucide interface icons.
- Custom SVG technology and social icons.
- Large SVG project previews, several of which embed raster data.

### Motion

- Section reveal motion fades from opacity zero and moves 12px over 0.6 seconds.
- Cards lift approximately 4px on hover.
- Technology icons scale on hover.
- Reduced-motion preference is partially considered.

This baseline describes the existing personal portfolio. None of these tokens or treatments are approved for the business redesign merely because they exist.

## Project imagery rules

### APPROVED

- Client logos require permission.
- Restricted client UI and internal workings must not be shown.
- Placeholder logos may exist only in development/testing and must not ship.

### PROPOSED

- Use neutral FURLANICH-branded graphics for restricted production summaries.
- Label generated or conceptual imagery so it cannot be mistaken for a real implementation.
- Prefer real product evidence for Laboratory/prototype work when available.

## OPEN target decisions

- Logo and wordmark system.
- Color palette and contrast pairs.
- Typography and type scale.
- Spacing scale and content density.
- Grid, container widths, and breakpoint strategy.
- Border radii, borders, shadows, and elevation.
- Button, card, navigation, form, and badge treatment.
- Photography, illustration, screenshot, and abstract-graphic direction.
- Icon set and custom icon requirements.
- Light-only versus theme support.
- Motion language.

## Reference posture

Global Fan, Simple Solutions, and WAPP were named as confidence/professionalism references. Their exact reusable qualities have not been defined, and no reference should be copied wholesale. See the research document for available links and unresolved identity.
