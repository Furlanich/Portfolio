---
id: ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
type: architecture-decision-record
status: APPROVED
date: 2026-09-20
related:
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-HOME
  - PROJECT-EVIDENCE
  - ADR-STATIC-LOCALIZED-ROUTING
supersedes: ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
last_verified: 2026-09-20
---

# Adaptive immersive homepage runtime

## Context

RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1 and ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE established a semantic-first, homepage-only progressive scene and named React Three Fiber 8 as the React 18 prototype candidate.

The authorized throwaway prototype validated the reversible four-state model, direct scroll mapping, demand rendering, static posters and quiet failure paths. React Three Fiber 8.18.0 failed during module evaluation under the repository's Next.js 16.3.2 and React 18 runtime. Direct Three.js 0.186.0 completed the bilingual five-width matrix and fallback tests, although its incremental 119,707-byte (116.9 KiB) Brotli payload left almost no budget headroom.

After reviewing that evidence, the repository owner approved [RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1](../rfcs/adaptive-immersive-homepage-production-v1.md). The accepted C2 direction also permits one governed authored-video surface inside the Connection chapter. This changes the renderer candidate and the earlier exclusion of video, so a superseding decision is required.

## Decision

Use a semantic-first, homepage-only **adaptive hybrid-media architecture**.

~~~text
Server-rendered homepage
├── localized semantic HTML, actions and captions
├── protected SVG identity
└── static chapter posters
    └── eligible progressive enhancement
        ├── direct Three.js instrument scene
        └── one optional native-video window in Connection
~~~

The durable boundaries are:

- Essential copy, headings, links, actions, landmarks, chapter meaning, media captions and the Pause motion control remain ordinary HTML.
- The canonical Contained Master remains a protected DOM/SVG asset. Only the separate derived sculpture enters the scene.
- Home is the only WebGL route in v1.
- Direct Three.js is the accepted renderer under the current React 18 runtime. React Three Fiber 8 is no longer the production candidate.
- Framer Motion remains the scroll-progress and reduced-motion boundary. GSAP is not added.
- WebGL rendering is demand-driven and stops when progress settles. Continuous idle rendering is outside v1.
- One optional authored video may appear inside the Connection instrument window. It uses native video delivery; no player framework is added.
- No more than one video actively decodes or plays.
- Every authored asset follows the approved media manifest and is classified as brand motion, demonstration or project evidence.
- Generated media is brand motion by default and cannot imply client work, a proprietary platform, outcomes or operating scale.
- The page paints semantic content and a stable poster before loading Three.js or video.
- Reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, context loss and blocked media retain the static path.
- Context loss removes the canvas for the session. Initialization is attempted once.
- Native scroll remains reversible and is never captured or replaced.
- Static export, locale routes, trailing slashes, GitHub Pages and optional base-path behavior remain unchanged.
- React-major migration, React Three Fiber 9, GSAP, Drei, post-processing, model downloads and additional WebGL routes require separate evidence and governance.

The runtime must meet these production gates:

| Gate | Limit |
| --- | ---: |
| Incremental immersive JavaScript | ≤120 KiB Brotli |
| First poster | ≤150 KiB |
| Compact Connection-video rendition | ≤1.2 MB |
| Wide Connection-video rendition | ≤2.5 MB |
| Simultaneously playing videos | 1 |
| Canvas device-pixel ratio | ≤1.5 wide; ≤1.25 compact |
| Scroll frame interval p95 | ≤20 ms |
| Main-thread interaction task | <50 ms |
| Media-attributable layout shift | 0 |
| LCP p75 | ≤2.5 seconds |
| INP p75 | ≤200 ms |

The budgets are acceptance ceilings. They do not approve the prototype bundle or any particular media encode.

## Rationale

Direct Three.js is the smallest renderer change supported by the actual prototype evidence. It avoids a React-major migration and removes the incompatible reconciler boundary while preserving the accepted state model.

Keeping Framer Motion avoids another orchestration runtime because the prototype produced reversible progress without GSAP. Native video is sufficient for one governed film and avoids a player dependency.

Semantic HTML and static chapter posters retain a complete, indexable and accessible experience before enhancement. The hybrid boundary allows cinematic material where it adds value without asking WebGL to provide every visual or letting video control page structure.

Explicit budgets and a real-device gate are required because the prototype exhausted nearly the entire JavaScript allowance and did not measure constrained-phone thermal or memory behavior.

## Consequences

- Production code must explicitly create, resize, invalidate, dispose and remove the Three.js renderer and scene resources.
- Context-loss and initialization paths require deterministic tests.
- Static posters are final design assets, not loading placeholders.
- The Connection film needs compact and wide renditions, poster, classification, caption decision and failure fallback.
- A visible keyboard-operable Pause motion control coordinates WebGL and video.
- Compact layouts use normal document chapters and cannot depend on a long pinned scene.
- Implementation acceptance requires both locales, five widths, reverse scrolling, 200 percent zoom, reduced motion, Save-Data, no JavaScript, failure paths and a constrained Android device.
- The implementation plan must preserve the 120 KiB ceiling or return to governance before exceeding it.
- Other public pages receive the approved static identity system without WebGL.
- ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE remains historical and is superseded by this record.

## Alternatives rejected

### Retain React Three Fiber 8

Rejected because the authorized prototype crashed under the repository runtime during module evaluation.

### Upgrade React and use React Three Fiber 9

Rejected for this initiative because a React-major migration is a broader framework decision and is unnecessary to deliver the accepted homepage architecture.

### Use only real-time WebGL

Rejected because a single renderer would own brand atmosphere, operational explanation and cinematic presentation while increasing asset and shader complexity.

### Use only authored scroll video

Rejected because it weakens responsive recomposition, reverse-scroll precision and iterative control while increasing download and seeking costs.

### Add GSAP, Drei or post-processing

Rejected because the prototype did not demonstrate a need and the JavaScript budget has no material headroom.

### Keep video outside the runtime

Rejected because the accepted C2 design permits one governed Connection film when it materially improves presentation. The strict media manifest, one-video limit and static fallback contain the risk.

## Related RFC

The decision was accepted through [RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1](../rfcs/adaptive-immersive-homepage-production-v1.md) after review of [REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19](../reviews/immersive-homepage-prototype-2026-09-19/index.md).

## Related product requirements

- [DESIGN-VISUAL](../design/visual-language.md) owns C2 composition, media framing, color, typography and truth boundaries.
- [DESIGN-IX-A11Y](../design/interaction-responsive-accessibility.md) owns responsive choreography, progressive activation, Pause motion, failure behavior, budgets and validation.
- [PAGE-HOME](../product/pages/home.md) owns localized commercial copy, section order and CTA destinations.
- [PROJECT-EVIDENCE](../product/project-evidence.md) owns project-media permissions.
- [ADR-STATIC-LOCALIZED-ROUTING](static-localized-routing.md) remains authoritative for static export, routes and base-path behavior.

## Date and status

**APPROVED — 2026-09-20.** The repository owner explicitly approved the complete written RFC. This ADR records that accepted decision and supersedes ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE. It authorizes a versioned implementation plan, not production implementation, release, provider activation, evidence upgrades, legal/SEO work, additional WebGL routes or a React-major migration.
