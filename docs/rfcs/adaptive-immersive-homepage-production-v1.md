---
id: RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
type: request-for-comments
status: APPROVED
related:
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-HOME
  - PROJECT-EVIDENCE
  - ADR-STATIC-LOCALIZED-ROUTING
last_verified: 2026-09-20
---

# Adaptive immersive homepage production direction, v1

## Context

The approved [Visual Identity & Immersive Experience v1 RFC](visual-identity-immersive-experience-v1.md) established the Contained Master, bone/azure Precision Assembly, Instrument Sans and IBM Plex Mono, one homepage-only four-beat sequence, and a static-first enhancement boundary. [ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE](../decisions/progressive-immersive-homepage.md) recorded React Three Fiber 8 as the React 18 prototype candidate and excluded generated video until evidence existed.

The authorized throwaway prototype is summarized in [REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19](../reviews/immersive-homepage-prototype-2026-09-19/index.md). It demonstrated reversible Recognition, Fragmentation, Connection and Coordination states across both locales and all five target widths, with complete static and failure paths. It also found:

- React Three Fiber 8.18.0 failed during module evaluation under Next.js 16.3.2 and React 18; direct Three.js 0.186.0 completed the prototype without changing the React major.
- The first System Instrument placed copy, a state rail and the scene in three competing columns. It was technically distinctive but compressed the proposition and created responsive complexity without enough buyer value.

After reviewing that evidence and a live media-led scroll reference, the owner selected **C2 — Adaptive System Instrument** for this production proposal. C2 is not approval of the tested Variant C. It replaces the three-column treatment with a two-zone editorial composition, integrates the phase spine into the media boundary and permits one governed authored-video surface inside the real-time system.

The owner approved the conceptual hybrid architecture, art direction, four-state sequence, responsive system, budgets, accessibility, failure handling and content governance for written review. Those approvals authorize this RFC draft. They do not approve the written proposal, revise authoritative owners, supersede the current ADR, authorize dependencies or authorize implementation.

## Problem

The prototype closed basic feasibility but did not produce a production-ready visual or runtime decision.

The tested System Instrument behaved like an isolated technical demonstration. Arrow fragments and decorative signals changed inside a bordered canvas while the surrounding composition remained largely static. Compact layouts rearranged the same parts instead of changing the choreography.

The approved ADR also names a renderer candidate that failed in the repository runtime. Direct Three.js proved feasible but reached 119,707 incremental Brotli bytes (116.9 KiB), nearly the proposed ceiling before production media control and instrumentation. Adding authored video without governance would increase transfer, autoplay, motion, evidence and accessibility risk.

A production plan cannot begin until the repository decides the evolved art direction, hybrid-media boundary, renderer, responsive choreography, budgets, failure behavior and ADR supersession path.

## Requirements

The accepted direction must:

- preserve RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1 except where this RFC explicitly proposes a change;
- preserve the protected Contained Master and animate only a separate derived sculpture;
- keep approved bilingual copy, actions, trust statements and destinations as semantic HTML;
- use native reversible scroll without hijacking, custom scrollbars or forced cinematic waits;
- make the proposition dominant before visitors interpret motion;
- connect the states to recognizable operational inputs instead of unexplained geometry;
- change choreography and media density at 320, 390, 768, 1024 and 1440 CSS pixels;
- remain complete under reduced motion, Save-Data, no JavaScript, unavailable WebGL, initialization failure, context loss and blocked media;
- preserve static export, locale routes, trailing slashes, GitHub Pages and the optional base path;
- keep Home as the only WebGL route in v1;
- distinguish brand motion, demonstration media and approved project evidence;
- add no unsupported client, product, outcome, scale or platform claim;
- meet explicit JavaScript, image, video, layout-stability and interaction budgets;
- require real-device evidence before activation is accepted;
- keep production code, dependencies, provider activation, release/legal/SEO work and the execution plan outside this Governance PR.

## Proposed approach

### Decision summary

| Area | Proposed decision |
| --- | --- |
| Art direction | C2 — Adaptive System Instrument |
| Wide composition | Editorial anchor plus one instrument viewport; phase spine integrated at their boundary |
| Compact composition | Normal document chapters with inline media; no prolonged pinned sequence |
| Runtime | Semantic HTML and posters first; direct Three.js enhancement; existing Framer Motion progress boundary |
| Authored media | One optional governed video surface in Connection |
| Rendering | Demand-rendered WebGL; no idle loop; one actively decoding video maximum |
| Motion control | Native reversible scroll, reduced-motion preference and explicit Pause motion control |
| Failure | Quiet static fallback preserving dimensions, meaning and actions |
| Evidence | Media manifest classifies brand motion, demonstration and project evidence |
| Authority | None until RFC approval, owner revisions, a superseding ADR and a versioned plan |

### C2 composition

Precision Assembly remains the visual language: bone editorial space, controlled asymmetry, exact rules, Instrument Sans for the commercial voice, restrained IBM Plex Mono for instrument labels and concentrated azure for active system state.

Wide layouts have two dominant zones:

- an editorial anchor occupying approximately 42–46 percent of the stage;
- one large 4:5 instrument viewport occupying the remaining space.

The phase spine belongs to the stage boundary and does not form an independent information column. One scene has primary emphasis at a time. Labels attach to meaningful channels or states instead of floating as decorative telemetry.

The nested-arrow geometry establishes alignment, direction, cropping and transitions. The scene avoids generic dashboard cards, HUD clutter, particle fields, neon, continuous rotation, elastic motion and ornamental glass. Useful depth, restrained shadows and material variation are permitted inside the scene.

The exploratory concept image clarified hierarchy and spatial intent but is not a production asset, copy owner, layout specification or source of evidence.

### Four-state narrative

| State | Progress | Composition and meaning |
| --- | ---: | --- |
| Recognition | 0–22% | Bone surface, intact derived sculpture, proposition and primary action immediately available; poster owns initial dimensions |
| Fragmentation | 22–47% | Layers separate into operational planes; orders, bookings, messages and manual tasks appear as distinct channels |
| Connection | 47–76% | Channels acquire deliberate routes; azure becomes active; one authored demonstration window may activate |
| Coordination | 76–100% | Inputs resolve into an ordered system; the composition calms and hands into services, approved evidence and contact |

Each state has a legible resting composition. Reverse scrolling follows the same paths. Geometry, media and page color settle when interaction stops.

### Hybrid media architecture

~~~text
Semantic document
├── localized HTML proposition, chapters, actions and captions
├── protected SVG identity
└── static chapter posters
    └── scroll conductor
        ├── direct Three.js instrument scene
        └── one optional authored-video window
~~~

- **Semantic document:** owns meaning, source order, localization, controls and destinations.
- **Scroll conductor:** maps native progress to chapter state. Framer Motion remains the first boundary because the prototype did not justify GSAP.
- **Direct Three.js:** owns derived geometry, camera, lighting and operational channels. It demand-renders and is decorative to assistive technology.
- **Video window:** owns the approved clip for the active chapter, using native video without a player framework.
- **Static posters:** own initial dimensions and every fallback state.

Direct Three.js is proposed because it worked under the current runtime while React Three Fiber 8 did not. React 19 plus React Three Fiber 9 remains deferred to a separate framework decision.

Acceptance requires a new ADR superseding ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE. The current ADR remains authoritative until this RFC and the new record are reviewed.

### Media and truth boundary

Every authored asset receives a manifest entry with:

- identifier, source and owner;
- brand motion, demonstration or project-evidence classification;
- approval status, routes and locales;
- evidence restrictions and public caption;
- poster, reduced-motion frame and failure fallback;
- duration, dimensions, codecs and encoded size;
- caption or transcript requirement;
- replacement or expiry notes.

Higgsfield, Blender and other generated output is **brand motion** by default. Generated interfaces cannot imply client work or a proprietary FURLANICH platform. Demonstrations are identified when they could be mistaken for client work. Project evidence remains governed by PROJECT-EVIDENCE.

No generated logo, client name, testimonial, metric or outcome is permitted. Essential bilingual copy remains HTML.

### Responsive choreography

| Width | Required composition | Media treatment |
| ---: | --- | --- |
| 1440 px | Editorial anchor, integrated phase spine and persistent 4:5 stage | Complete depth and restrained camera travel |
| 1024 px | Compact two-zone composition | Shorter travel and fewer simultaneous layers |
| 768 px | Sequential copy and media; short local sticky interval only if testing proves useful | Simplified geometry and one active surface |
| 390 px | Four document chapters with inline 1:1 media | No prolonged sticky stage; near-viewport media only |
| 320 px | Condensed headings, full-width actions and static-first media | Minimal depth; nonessential annotations removed |

Resize preserves the active chapter and document position. It cannot restart media, jump the page, clip either locale or leave a desktop state after reflow. The source order is stable. At 200 percent text zoom, decorative media yields space to content.

Quality may respond to measured capability and user preferences, but width alone is not a capability proxy.

### Loading and activation

1. Server-render content, controls, identity and Recognition poster.
2. Paint stable dimensions without waiting for WebGL or video.
3. Load Three.js after meaningful content renders.
4. Request video only as Connection approaches the viewport.
5. Keep one video decoding and pause it when inactive.
6. Remove the canvas for the session after context loss.

The system makes one initialization attempt. Save-Data, reduced motion, unsupported WebGL and initialization failure remain on the static path.

### Accessibility and failure

The canvas is decorative, excluded from the accessibility tree, never focusable and never owns scrolling. State meaning appears in HTML headings, descriptions and captions.

A keyboard-operable **Pause motion** control beside instrument status pauses WebGL changes and active video without changing the chapter. It supplements the operating-system preference. Meaningful video receives an adjacent caption and transcript. Decorative film has no essential information. No audio autoplays. Color is never the only state indicator. Text and controls meet WCAG AA contrast.

Reduced motion uses immediate static state changes without autoplay or replacement animation.

| Condition | Result |
| --- | --- |
| JavaScript unavailable | Complete semantic page with static Recognition composition |
| Dynamic import failure | Current static composition remains |
| WebGL unsupported | Static chapter compositions |
| Context loss | Canvas removed for the session; current poster remains |
| Video blocked or fails | Poster and HTML caption remain |
| Slow connection | Poster remains without interruption |
| Resize during transition | State recalculates from document position |
| Optional asset absent | Chapter closes without an empty frame |

### Production budgets

| Area | Proposed gate |
| --- | ---: |
| Incremental immersive JavaScript | ≤120 KiB Brotli |
| First poster | ≤150 KiB |
| Mobile Connection-video rendition | ≤1.2 MB |
| Desktop Connection-video rendition | ≤2.5 MB |
| Simultaneously playing videos | 1 |
| Canvas device-pixel ratio | ≤1.5 wide; ≤1.25 compact |
| Scroll frame interval p95 | ≤20 ms |
| Main-thread interaction task | <50 ms |
| Media-attributable layout shift | 0 |
| LCP p75 | ≤2.5 seconds |
| INP p75 | ≤200 ms |

The JavaScript figure is a ceiling. The prototype measured 119,707 incremental Brotli bytes, so implementation must reduce payload, avoid extra runtimes or return to governance with evidence for a revised limit. Video remains outside the critical path and uses separate compact and wide renditions.

### Validation

Acceptance must cover:

- both locales and all five widths;
- forward and reverse traversal;
- mid-sequence resize and orientation change;
- keyboard navigation, visible focus and 200 percent zoom;
- reduced motion, Save-Data, no JavaScript, unavailable WebGL, initialization failure, context loss and blocked video;
- root and optional `/Portfolio` base paths;
- static export and layout stability;
- one constrained Android device on a throttled connection;
- repeated traversal for memory and thermal behavior;
- independent review of the static experience.

Headless Chromium is regression evidence, not mobile acceptance evidence.

### Owner and ADR sequence

If accepted, the next documentation PR must:

1. revise DESIGN-VISUAL with C2, the two-zone composition, phase spine, instrument window and media taxonomy;
2. revise DESIGN-IX-A11Y with the responsive matrix, Pause motion, lifecycle, budgets and failure contract;
3. create a new ADR superseding ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE and recording direct Three.js plus governed native video;
4. update architecture and status indexes;
5. preserve PAGE-HOME copy, CTA destinations, demonstration disclosures and PROJECT-EVIDENCE permissions;
6. write the versioned implementation plan only after those records are approved.

## Alternatives considered

- **Original Precision Split:** strongest commercial hierarchy, but insufficiently instrument-like for the selected identity.
- **Original System Instrument unchanged:** rejected because its middle rail compressed copy and created a mechanical compact stack.
- **Only real-time WebGL:** concentrates atmosphere, explanation and cinematic media in one runtime.
- **Only authored scroll video:** weakens responsive recomposition and reverse-scroll precision while increasing transfer and seeking cost.
- **React 19 and React Three Fiber 9:** larger framework decision requiring separate evidence.
- **React Three Fiber 8:** rejected as production candidate because it crashed in the authorized prototype.
- **GSAP, Drei or post-processing now:** rejected because evidence did not justify their cost or surface area.

## Trade-offs

- Hybrid delivery creates geometry and media pipelines, although v1 permits one authored-video surface.
- Direct Three.js needs explicit lifecycle, disposal and context-loss discipline.
- Width-specific choreography expands visual QA.
- Static chapter artwork becomes a first-class deliverable.
- Pause motion adds interface responsibility.
- Strict media budgets constrain duration and encoding.
- Selecting C2 over the prototype's A recommendation favors stronger identity and requires tighter protection of commercial hierarchy.
- Compact layouts receive less spectacle to protect content and performance.

## Migration and implementation impact

This Governance PR is documentation only. It adds no production code, route, dependency, font, canvas, media, generated asset or provider.

Approval authorizes owner revisions and a superseding ADR, not implementation or release. A later plan should separate identity/font readiness, semantic static C2 composition, direct Three.js lifecycle, governed media, responsive/accessibility behavior, real-device acceptance and unrelated correctness repairs.

Contact activation, evidence upgrades, hosting, release/legal/SEO, additional WebGL routes and React-major migration remain outside scope.

## Risks

The instrument may become technical decoration; generated media may resemble evidence; direct Three.js can leak GPU resources; the JavaScript budget has almost no prototype headroom; video can exceed budgets; medium-width sticky behavior can create empty space; Spanish expansion can disrupt hierarchy; and real-device thermal behavior remains unproven.

The semantic-first layout, one-video limit, posters, budgets, both-locale matrix, compact non-sticky composition, manifest and real-device gate mitigate these risks.

## Unresolved questions

The following remain **OPEN**:

- final optical geometry, clear space and minimum sizes for the Contained Master;
- exact brand-motion asset, shot list and production tool;
- whether 768 px benefits from a short local sticky interval after real-device testing;
- final codecs and rendition ladder within the budgets;
- analytics or conversion measurement.

These do not alter the proposed architecture. A choice outside the boundaries requires owner review or new governance.

## Recommendation

Approve C2 — Adaptive System Instrument. Use semantic HTML and static chapter posters as the complete baseline, direct Three.js as the homepage-only demand-rendered enhancement, the existing Framer Motion progress boundary, and at most one governed authored-video surface in Connection. Adopt the responsive matrix, accessibility contract, failure behavior and budgets.

After approval, revise the owners and record the superseding ADR. Only then write the versioned implementation plan.

## Status

**APPROVED — 2026-09-20.** The repository owner explicitly approved the complete written RFC. This approval authorizes the design-owner revisions, [ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE](../decisions/adaptive-immersive-homepage.md) and a versioned execution plan. It does not authorize production implementation, release, provider activation, evidence upgrades, legal/SEO work, additional WebGL routes or a React-major migration.
