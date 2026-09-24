---
id: ADR-SKY-CHART-HOMEPAGE-RUNTIME
type: architecture-decision-record
status: APPROVED
date: 2026-09-24
related:
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-HOME
  - PROJECT-EVIDENCE
  - ADR-STATIC-LOCALIZED-ROUTING
supersedes: ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
last_verified: 2026-09-24
---

# Sky Chart homepage runtime

## Context

[`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](adaptive-immersive-homepage.md) recorded the semantic-first, homepage-only adaptive hybrid-media architecture: static chapter posters first, a direct-Three.js two-zone C2 instrument scene, the existing Framer Motion progress boundary, demand rendering, one-shot initialization, session-scoped context-loss handling and one optional governed Connection-video surface.

On 2026-09-23 the repository owner reviewed three prototyped Home/App-Bar directions and chose Direction A · Sky Chart, recorded in [`REVIEW-SKY-CHART-DIRECTION-2026-09-23`](../reviews/sky-chart-direction-2026-09-23/index.md). [`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](../rfcs/sky-chart-visual-system-v2.md) carried that direction, eighteen bounded supersessions of approved `DESIGN-VISUAL`, `DESIGN-IX-A11Y`, `VISUAL-IDENTITY-V1`, `IMMERSIVE-HOME-V1.1`, `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` and `PAGE-HOME` boundaries, and the runtime-change summary below to gate G1. The owner approved and merged that RFC as Governance PR #77 (merge commit `70168e9`), explicitly accepting the redesign, the removal of the derived Azure sculpture from the Home scene, the addition of `HOME-IMPACT`, and the withdrawal of the ADR's permission for one optional Connection film. This ADR is [`PLAN-SKY-CHART-HOME-REDESIGN-V2`](../plans/active/sky-chart-home-redesign-v2.md) Task 2's deliverable, recording that accepted runtime decision.

## Decision

Use a semantic-first, homepage-only **Sky Chart environmental runtime**, replacing the C2 two-zone instrument with a full-viewport environment behind Home's content.

~~~text
Server-rendered homepage
├── localized semantic HTML, actions and captions
├── protected SVG identity (App Bar and brand assets only)
└── environment ground, scrim and locale-neutral static poster pair
    └── eligible progressive enhancement
        └── direct Three.js sky-chart scene, portaled to document.body
~~~

### Retained boundaries

These boundaries carry over unchanged from `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` and are not superseded by this ADR or by `RFC-SKY-CHART-VISUAL-SYSTEM-V2`:

- Essential copy, headings, links, actions, landmarks, chapter meaning and captions remain ordinary server-rendered HTML.
- Home is the only WebGL route.
- Direct Three.js (`three@0.186.0`) is the accepted renderer; React Three Fiber remains out of scope.
- Framer Motion remains the scroll-progress and reduced-motion boundary; no new orchestration runtime is added.
- Rendering is demand-driven: each animation frame damps toward the target and stops when settled (plan T-06). There is no idle render loop.
- Initialization is attempted once, after the existing capability gates in order: reduced motion, Save-Data, WebGL2, the session context-loss flag, near-viewport, then `load`.
- Context loss marks the session flag, disposes every geometry/material/texture and the renderer, and reverts to the static path for the remainder of the session.
- Reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure and context loss all retain a complete static fallback with no interrupting error.
- Static export, locale routes, trailing slashes, GitHub Pages and the optional base path remain unchanged.
- Native scroll stays reversible and is never captured or replaced.
- The page paints semantic content and a stable static fallback before loading Three.js — now the D-23 environment poster pair rather than the four chapter posters, but the ordering guarantee itself is unchanged.
- Every authored asset follows the approved media manifest and is classified as brand motion, demonstration or project evidence.
- Generated media is brand motion by default and cannot imply client work, a proprietary platform, outcomes or operating scale.
- React-major migration, React Three Fiber 9, GSAP, Drei, post-processing, model downloads and additional WebGL routes all require separate evidence and governance.

### Added boundaries

- **Full-viewport fixed canvas.** The canvas is created once by `ImmersiveEnhancement` after the existing gates and portaled to `document.body` via `createPortal`, fixed at `z-index: -2`, full viewport, `aria-hidden`, `tabIndex=-1` and `pointer-events: none` (plan D-01, T-04). It replaces the framed two-zone instrument stage.
- **CanvasTexture sprite text labels with explicit font loading.** Scene labels use `THREE.CanvasTexture` sprites (plan T-02) rather than SDF text, `TextGeometry` or DOM-projected labels. Before building label textures, the runtime awaits `document.fonts.load(...)` for the Plex Mono and Instrument Sans families read from the `next/font` CSS custom properties; if loading fails, labels still render in the fallback face and the failure is not surfaced to the visitor (plan T-03).
- **Recede and suspend.** Once the visitor scrolls past the chapters, the canvas and scrim opacity follow a recede factor `k` that reaches 1 over the last 0.5 viewport-heights of the chapter span; rendering is suspended entirely while `k = 1` (plan D-24).
- **Locale-neutral static poster pair.** `environment-wide.webp` (1920×1080, ≤150 KiB) and `environment-compact.webp` (900×1600, ≤80 KiB) replace the four locale-bound chapter posters as the complete static, reduced-motion, no-JS, WebGL-failure and context-loss composition (plan D-23).

### Removed

- **The derived Azure chevron sculpture and its Ink channel tiles** are removed from the scene. The star-atlas environment's named-star vocabulary is the scene's identity element instead. The protected Contained Master mark stays out of the scene in both the prior and the current architecture; it now appears only in the App Bar and brand assets, in the approved bone-on-azure variant. This removal was surfaced to the owner as a distinct gate G1 decision (`RFC-SKY-CHART-VISUAL-SYSTEM-V2` supersession item 14) and was explicitly accepted.
- **The four static chapter posters, the framed instrument stage and `PhaseSpine`** are removed, replaced by the full-viewport environment, atlas-plate chapters and the poster pair above (`RFC-SKY-CHART-VISUAL-SYSTEM-V2` supersession item 3).
- **The ADR's permission for one optional authored Connection film is withdrawn.** The sky-chart runtime carries no video surface. Reintroducing video on Home requires a new governance decision; this ADR does not pre-authorize one (`RFC-SKY-CHART-VISUAL-SYSTEM-V2` supersession item 17).

### Production gates

Every gate below is a ceiling, restated unchanged from `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` and `PLAN-SKY-CHART-HOME-REDESIGN-V2` section 14, including the retained main-thread interaction task gate. They do not approve any particular implementation's measured numbers.

| Gate | Limit | Measured by |
| --- | ---: | --- |
| Incremental immersive JavaScript (runtime chunk plus three) | ≤120 KiB Brotli | `npm run measure:immersive` |
| Client JS added by `AppBarBehavior` and `PositionFixToggle` | ≤6 KiB Brotli combined | Build output comparison against `main` |
| Environment posters | ≤150 KiB wide, ≤80 KiB compact | `scripts/immersive-media-manifest.test.mjs` |
| Canvas device-pixel ratio | ≤1.5 wide; ≤1.25 compact or constrained | Unit test plus debug hook |
| Draw calls per frame | ≤28 (1 graticule + 1 stars + 1 links + ≤20 sprites + margin) | Debug hook `renderer.info.render.calls` |
| Label textures | ≤20, each ≤1024×64 | Debug hook |
| Scroll frame interval p95 | ≤20 ms | `measure:immersive` |
| LCP p75 (synthetic lab) | ≤2.5 s; the LCP element must be the H1 | `measure:home-vitals` |
| INP p75 | ≤200 ms | `measure:home-vitals` |
| Layout shift from the enhancement | 0 | Playwright `PerformanceObserver` |
| Backdrop-filter surfaces per viewport | ≤3 (App Bar excluded) | E2E DOM scan at each section |
| Idle rendering | 0 frames after settle | Debug hook frame counter |
| Main-thread interaction task (retained ADR gate) | <50 ms | `measure:immersive` long-task observer |

The budgets are acceptance ceilings for the implementation plan's Tasks 3–11. They do not themselves approve any prototype bundle, media encode or measured result; each task's PR records its own measurement against them.

## Rationale

The star-atlas environment is a bounded restyling of an already-accepted runtime, not a new architecture: it keeps the same renderer, the same scroll-orchestration dependency, the same demand-rendering discipline and the same fail-closed capability gates that `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` established and that production has already exercised. Moving the canvas to a full-viewport fixed portal and adding sprite-text labels are the smallest technical changes that deliver the owner-approved environmental direction without a new dependency, a new renderer or a new orchestration runtime.

Withdrawing the Connection-film permission removes a budget and governance surface (compact/wide renditions, one-active-video limit, captioning) that the resolved direction does not use; the star-atlas scene has no chapter that calls for authored video. Keeping the withdrawal explicit, rather than silently letting it lapse, preserves the rule that a later video surface needs its own governance decision instead of reviving an unused permission by omission.

Removing the derived sculpture records the owner's explicit gate G1 decision, made on the RFC's direct request (`RFC-SKY-CHART-VISUAL-SYSTEM-V2` supersession item 14): the RFC asked the owner to accept the sculpture's removal as a distinct part of the G1 decision, separate from the other supersessions, and the owner accepted it when approving and merging Governance PR #77. This ADR records that accepted removal; it does not supply a design rationale the owner was not asked to weigh.

## Consequences

- Production code must create, resize, invalidate, dispose and remove the sky-chart renderer and scene resources exactly as `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` already required; the dispose contract additionally covers the CanvasTexture label textures.
- The portal target (`document.body`) and the fixed layer model (plan D-01) become a stacking-context constraint: no ancestor of the fixed layers may create a stacking context above `body`.
- Font loading before label-texture creation becomes a new, testable lifecycle step; a font-loading failure is a quiet degrade, not a visible error.
- The recede/suspend behavior adds a new idle condition (`k = 1`) alongside the existing "progress settled" idle condition; both must stop rendering.
- The environment poster pair becomes the final design asset for every fallback path, replacing the four chapter posters; `verify-static-export.mjs` and the media manifest change accordingly (plan Task 10).
- Any future proposal to add video, audio or generated imagery to Home must return to governance; it cannot cite the withdrawn Connection-film permission as prior authorization.
- Other public pages continue to receive only the approved static identity system, now through the restyled App Bar (`DESIGN-VISUAL`/`DESIGN-IX-A11Y` `SKY-CHART-V2`), without an additional WebGL canvas.
- `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` remains historical and is superseded by this record; `ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE` remains historical and superseded by `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` unchanged.
- This ADR authorizes Wave 1 of `PLAN-SKY-CHART-HOME-REDESIGN-V2` to begin once Task 2 merges and checkpoint W0 passes; it does not itself implement any code.

## Alternatives rejected

### Keep the two-zone C2 instrument and only restyle its materials

Rejected because the owner's chosen direction (a full-viewport celestial environment) is incompatible with a framed 4:5 instrument viewport; restyling alone could not deliver the approved D-01 layer model.

### Retain the derived Azure sculpture inside the new environment

Rejected because a navigator's star atlas has no chevron-slab identity object; combining both would duplicate the scene's identity element and was not part of what the owner approved. The RFC surfaced this removal as an explicit, separate gate G1 decision rather than folding it into the material restyle, and the owner accepted it.

### Keep the Connection-film permission dormant rather than withdrawing it

Rejected because the resolved Sky Chart direction has no chapter or governance rationale for authored video; leaving the permission nominally alive while unused risks a later implementation citing stale authorization instead of returning to governance for a fresh decision.

### Move to React Three Fiber or a newer React major for the environment change

Rejected as unnecessary. The environment restyle does not require reconciler capabilities beyond what direct Three.js already provides under the current React 18 runtime, and a React-major migration remains a separate, unrelated framework decision.

### Add GSAP, Drei or post-processing for the new environment

Rejected because the plan's frame mapping, recede behavior and label rendering are achieved with the existing Framer Motion boundary and direct Three.js primitives; no prototype evidence justifies a new dependency, and `package.json`/`package-lock.json` stay locked (plan T-01).

## Related RFC

The decision was accepted through [`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](../rfcs/sky-chart-visual-system-v2.md) after the repository owner reviewed [`REVIEW-SKY-CHART-DIRECTION-2026-09-23`](../reviews/sky-chart-direction-2026-09-23/index.md) and approved and merged Governance PR #77 (merge commit `70168e9`) on 2026-09-24.

## Related product requirements

- [`DESIGN-VISUAL`](../design/visual-language.md#sky-chart-v2-sky-chart-home-and-app-bar-approved) `SKY-CHART-V2` records the environment, material, typography, spacing and App Bar visual rules, including the complete D-04 token table and D-22 App Bar values. The remaining numeric detail of D-01 to D-27 is incorporated by reference from `PLAN-SKY-CHART-HOME-REDESIGN-V2` section 6, which stays the single normative source for exact dimensions.
- [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md#sky-chart-v2-sky-chart-home-and-app-bar-approved) `SKY-CHART-V2` records the App Bar, recede/suspend, poster-fallback and Pause-control interaction and accessibility rules (D-22 to D-25, D-27), on the same incorporated-by-reference basis.
- [`PAGE-HOME`](../product/pages/home.md) owns localized commercial copy, the approved section order including `HOME-IMPACT`, and CTA destinations.
- [`PROJECT-EVIDENCE`](../product/project-evidence.md) owns project-media permissions, unaffected by this ADR.
- [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md) remains authoritative for static export, routes and base-path behavior.

## Date and status

**APPROVED — 2026-09-24.** Recorded after the repository owner approved and merged Governance PR #77 (`RFC-SKY-CHART-VISUAL-SYSTEM-V2`, merge commit `70168e9`), which accepted the Sky Chart runtime-change summary, the removal of the derived Azure sculpture, and the withdrawal of the optional Connection-film permission. This ADR authorizes execution of `PLAN-SKY-CHART-HOME-REDESIGN-V2` (Waves 1–4), not release, provider activation, evidence upgrades, legal/SEO work, additional WebGL routes or a React-major migration.
