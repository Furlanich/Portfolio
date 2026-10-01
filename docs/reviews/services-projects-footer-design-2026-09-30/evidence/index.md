---
id: REVIEW-SPF-PROTOTYPE-CHECKS-2026-09-30
type: verification-evidence
status: PROPOSED
related:
  - REVIEW-SPF-DESIGN-2026-09-30
  - DESIGN-SPF-V1
last_verified: 2026-09-30
---

# Prototype check evidence

The adjacent JSON files contain raw observations from isolated headless Chromium. The [review](../index.md) distinguishes these checks from production acceptance. Software rendering was enabled only for visual feasibility inspection. None of these records establishes hardware/CWV, cross-browser, real screen-reader, production export or whole-site acceptance.

## Revision 5 field and motion

`revision5-field-inspection.json`: current candidate, ES/EN × Services/Projects × 1440/390/320px. All 12 cases pass layout/one H1/no detected broken loaded assets, eight capability words, 16-node/33-path wide or eight-node/13-path compact density, slow idle rotation, node motion/connection growth after a 12px scroll, all connections completed before Footer, zero paused frames and Footer stop. Observed draw calls are eight wide and six compact, at probe DPR 1. Ambient drawing is intentional here; the earlier zero-idle test is superseded.

`revision5-controls.json`: a normal Pause click stops rendering; a paused page-selector change renders one frozen initial frame and does not loop; a synthetic hidden-document event stops rendering; reduced motion disposes the canvas and retains focused inactive control. Hero/action/content rectangles do not move on optional initialization, caption does not intersect Pause, and service-specific/commercial disclosures remain visible. Synthetic event checks do not prove actual mobile/background-tab behavior.

`revision5-accessibility.json`: eight current page/language/1440-or-320px axe inspections, zero detected WCAG 2/2.1 A/AA violations. `revision5-resilience.json`: updated static/preference/failure/context-loss/no-JavaScript observations, with complete content and no 320px overflow. Full manual/device/browser/export acceptance remains required.

## Rendered matrix

`inspection.json`: three initial directions × two pages × two languages × 1440/390/320px, 36 renders. `revision-inspection.json`: final selected combination across two pages × two languages × the same three widths, 12 renders. Both final matrices have zero detected page errors, missing images or horizontal overflow. Revised desktop draw calls: Services 27, Projects 25; compact 7. Revised idle and paused checks observe zero additional frames; preference/static paths preserve content.

## Accessibility

`revision-accessibility.json`: axe WCAG 2/2.1 A/AA inside the candidate page, both pages/languages at 1440 and 320px, eight inspections with zero detected violations. Lab controls excluded. Manual accessibility remains required.

## Resilience

`revision-resilience.json`: keyboard anchors, bounded hover, decorative canvas exclusion from focus, one-context switching, dynamic reduced motion, Save-Data, no-WebGL, module failure, default software-GPU rejection and context loss. Complete no-JavaScript snapshots contain all three services/two dossiers in both languages without 320px overflow. Context-loss suppression is document-session prototype behavior; production requires browsing-session behavior.

## Fluidity

`revision4-fluidity.json`: actual-node scene observations and a four-pixel crossing of the previous service lane boundary. Continuous phase and world position replace the abrupt discrete switch. Scene-unit coordinates support continuity inspection, not a CSS/geometry implementation test or hardware timing guarantee.

## Control focus and layout

`revision-final-controls.json`: measured hero/action/content rectangles do not move when optional enhancement initializes. Dynamic reduced motion disposes the canvas while retaining keyboard focus on the inactive “Static background” button. Visible disclosure check confirms three service-specific paragraphs and five commercial-boundary list items. The initial failure and correction are recorded in the parent review; no production CLS/conformance claim is inferred.
