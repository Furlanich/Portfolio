---
id: ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
type: architecture-decision-record
status: APPROVED
date: 2026-09-19
related:
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - ADR-STATIC-LOCALIZED-ROUTING
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-HOME
last_verified: 2026-09-19
---

# Progressively enhanced immersive homepage

## Context

FURLANICH has accepted a complete visual-identity direction and one signature homepage sequence through [`RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1`](../rfcs/visual-identity-immersive-experience-v1.md). The sequence must establish the Contained Master visual world and explain the movement from fragmented operational inputs to coordinated systems. It must also preserve the existing static localized route architecture, GitHub Pages export, `/Portfolio` base path, bilingual server-rendered content, Contact demonstration contract, evidence permissions and accessibility requirements.

The current application uses React 18 and Framer Motion. It has no WebGL dependency or canvas runtime. The accepted direction therefore needs a durable boundary between essential content and optional rendering before prototype or production work begins.

## Decision

Use a progressively enhanced, homepage-only WebGL architecture:

```text
Server-rendered homepage stage
├── localized semantic HTML proposition and actions
├── protected SVG identity
└── resolved static poster
    └── capability gate
        ├── eligible -> lazy real-time scene
        └── reduced motion / unsupported / failure -> poster remains
```

The durable boundaries are:

- Essential copy, headings, actions, links, landmarks and meaning remain ordinary server-rendered HTML.
- The canonical Contained Master mark remains a DOM/SVG asset and never enters, deforms or depends on the canvas.
- A separate derived three-layer sculpture provides the four reversible states: Recognition, Fragmentation, Connection and Coordination.
- The initial production candidate uses Three.js through React Three Fiber 8 because the repository remains on React 18.
- The existing Framer Motion boundary supplies normalized scroll progress and reduced-motion integration unless prototype evidence proves it inadequate.
- The scene loads lazily after a capability gate; it is limited to the localized homepage pair in v1.
- The poster owns the final stage dimensions before enhancement so canvas loading cannot remove meaning or create an empty hero.
- `prefers-reduced-motion: reduce`, unsuitable or missing WebGL, initialization failure and WebGL context loss retain the resolved poster without an interrupting error.
- Scroll remains native and reversible. The canvas never owns scrolling, captures keyboard focus or becomes the only source of information.
- Rendering is demand-driven and settles when progression stops; continuous idle animation is outside v1.
- Static export, trailing-slash URLs, the Spanish-root and English-`/en/` route trees, GitHub Pages and the optional base path remain unchanged.
- GSAP, Drei, post-processing, generated video and model downloads are outside the accepted runtime. A later dependency requires measured prototype evidence and the appropriate governance update.

Exact mobile activation thresholds, device-pixel-ratio caps, frame-time and JavaScript budgets remain prototype outputs. The architecture requires measurable gates but does not invent their values before evidence exists.

## Rationale

This boundary lets the site demonstrate technical craft while keeping the commercial proposition fast, indexable, accessible and useful when enhancement cannot run. It protects the brand mark from motion-state inconsistency and confines GPU cost and failure handling to one expressive surface. Reusing the existing scroll runtime minimizes dependency growth until the prototype demonstrates a concrete need for another orchestrator.

## Consequences

- The homepage needs a stable static poster that is a complete final composition, not a loading placeholder.
- The implementation will have explicit eligible, reduced-motion, unsupported, loading, initialized, failed and context-lost paths.
- Both locale routes share geometry and state mapping while keeping localized HTML outside the scene.
- Browser and visual verification must cover 320, 390, 768, 1024 and 1440 CSS-pixel layouts, reverse scrolling, reduced motion, no WebGL, forced initialization failure, context loss and the optional `/Portfolio` base path.
- The scene must be measured on representative desktop and mobile capability classes before activation thresholds and budgets become production gates.
- Other public pages inherit the static identity system, typography and editorial composition without additional WebGL canvases in v1.
- Production implementation remains unauthorized until the isolated prototype verdict is reviewed and a versioned execution plan is approved.

## Alternatives rejected

### Canvas-owned hero content

Rejected because placing copy, controls or essential meaning inside WebGL would weaken semantics, keyboard access, localization, static rendering and failure recovery.

### Transform the canonical logo

Rejected because the protected mark must remain recognizable and stable. The derived sculpture may separate and reconnect without making the identity depend on animation state.

### Site-wide WebGL

Rejected because multiple canvases would multiply runtime, accessibility, performance and QA cost while weakening the homepage hierarchy.

### Pre-rendered scroll video as the default

Rejected because video introduces encoding, download and seeking constraints and makes responsive timing changes expensive. Rendered media remains a later prototype-dependent option only if it demonstrates material value.

### Add GSAP or Drei immediately

Rejected because the application already has Framer Motion and the v1 procedural scene has no accepted helper-library requirement. A new orchestration or helper dependency needs prototype evidence.

## Related RFC

The decision was proposed in [`RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1`](../rfcs/visual-identity-immersive-experience-v1.md) and accepted when [Governance PR #61](https://github.com/Furlanich/Portfolio/pull/61) was approved and merged by the repository owner on 2026-09-19.

## Related product requirements

- [`DESIGN-VISUAL`](../design/visual-language.md) owns the Contained Master, Precision Assembly palette, typography and page-composition requirements.
- [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md) owns responsive composition, progressive enhancement, motion, fallback and verification behavior.
- [`PAGE-HOME`](../product/pages/home.md) owns the localized proposition, section sequence and CTA destinations.
- [`PAGE-FOUNDER`](../product/pages/studio-and-founder.md) owns the public professional descriptor and factual biography boundary.
- [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md) remains authoritative for routes, static export, locale ownership and base-path behavior.

## Date and status

**APPROVED — 2026-09-19.** Recorded after the repository owner approved and merged Governance PR #61. This ADR authorizes the isolated prototype described by the RFC. It does not authorize production dependencies or implementation before prototype review and an approved execution plan.
