---
id: TEST-TASTE-AUDIT
type: testing-evidence
status: APPROVED
related:
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - SPEC-FRONTEND-TESTING-CAPABILITY-HARDENING
last_verified: 2026-09-08
---

# Taste v1 existing-homepage audit

This was an audit of the current Spanish homepage only. It did not authorize or make UI changes.

## Evidence

On 2026-09-08, Playwright 1.63.0 Chromium captured full-page renders of `/` at 390×844, 1024×768, and 1440×900. Screenshots were inspected from ignored `.playwright/` evidence and intentionally not committed. The Next.js development indicator visible near the lower-left viewport edge was excluded from product judgment.

Observed across the three viewports:

- the business-first H1, lead, CTA order, and direct-accountability language retain clear hierarchy;
- the approved text-led hero, intentional wide whitespace, alternating Canvas/Surface sections, and Action-tint closing band remain coherent;
- cards grow naturally, reflow from one to approved multi-column layouts, and show no visible clipping or horizontal overflow;
- the 1024px navigation transition is dense but legible and remains inside the approved container;
- the long mobile page remains scannable through headings, surface alternation, restrained borders, and consistent actions.

Taste v1 usefully reinforces concrete copy, one accent color, left-aligned hierarchy, no neon/gradient decoration, purposeful whitespace, stable mobile collapse, and avoiding gratuitous cards. Future audits should continue watching repetition and ensure every bordered group serves comparison or hierarchy.

## Repository overrides

The approved repository design overrides the following Taste v1 defaults:

| Taste v1 default | FURLANICH authority |
| --- | --- |
| Design variance 8 and forced asymmetry | Restrained editorial grid and approved section-specific compositions |
| Motion intensity 6, staggered reveals, perpetual motion, magnetic or transformed controls | No entrance or perpetual motion; controls use only approved 160ms color/background/border transitions and never translate or scale |
| Ban Inter | Inter with system fallback is approved |
| 1400px or `max-w-7xl` container | 1200px maximum with approved gutters |
| Image-led or split-screen hero | Typography-led hero with no required image |
| Ban three-column card layouts | Services explicitly use three cards at wide sizes |
| Large-radius/shadowed Bento and glass treatments | Flat Canvas/Surface, 10px controls, 16px cards, restrained borders, and no decorative shadow |
| Mandatory alternative icon packages | Existing Lucide dependency; most approved sections require no icon |
| Active-state transforms and spring physics | Approved controls do not move or scale |

Authority remains: approved product requirements → `DESIGN-VISUAL` and `DESIGN-IX-A11Y` → accepted architecture → Taste v1 → agent aesthetic judgment. Taste is critique, not product authority.
