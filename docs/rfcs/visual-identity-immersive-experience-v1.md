---
id: RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
type: request-for-comments
status: APPROVED
related:
  - ARCHITECTURE-MAP
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - ADR-STATIC-LOCALIZED-ROUTING
  - BRAND-POSITIONING
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-HOME
  - PAGE-FOUNDER
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
last_verified: 2026-09-19
---

# Visual identity and immersive homepage experience, v1

## Context

FURLANICH is a founder-led software-studio brand. The current site has a complete bilingual route structure, a static GitHub Pages deployment, truthful evidence boundaries, and an approved commercial narrative. The completed [`PLAN-MARKETING-PRESENTATION-EXCELLENCE`](../plans/completed/marketing-presentation-excellence-v1.md) improved information architecture and presentation without selecting a custom symbol, complete visual system, new typography, media pipeline, or immersive runtime.

The current approved design owners intentionally leave those broader decisions OPEN. The application uses the text wordmark `FURLANICH`, Inter, a cool light canvas and blue action color. It has no WebGL runtime, 3D scene, custom logo symbol, cinematic asset pipeline, or site-wide motion language. The runtime remains Next.js 16, React 18, Tailwind CSS and Framer Motion under the static localized architecture recorded by [`ADR-STATIC-LOCALIZED-ROUTING`](../decisions/static-localized-routing.md).

The owner wants the next visual initiative to make the studio more recognizable and demonstrate technical and design mastery without implying employees, scale, funding, client outcomes or commercial maturity that the repository cannot support. The owner supplied a family-symbol reference consisting of three azure upward chevrons and selected an abstract, newly constructed interpretation rather than reproduction of the raster reference.

The design exploration that precedes this RFC selected the following coherent direction for proposal:

- a contained three-chevron master symbol used with the existing `FURLANICH` wordmark;
- a bone-white and azure identity led by `#F9F6EE` and `#004589`;
- Instrument Sans with IBM Plex Mono for restrained technical labels;
- the “Precision Assembly” art direction;
- one signature homepage sequence that establishes the identity and explains connected systems;
- a protected master mark that never deconstructs;
- a separate derived three-layer sculpture that moves through Recognition, Fragmentation, Connection and Coordination;
- real-time WebGL as progressive enhancement, with complete static HTML/SVG and reduced-motion fallbacks;
- no additional WebGL canvases on Services, Projects, Studio, Founder or Contact in v1.

These choices are approved for RFC drafting and review. They do not become repository-approved requirements, authorize dependencies, or authorize implementation until this RFC is explicitly accepted.

## Problem

The current presentation is legible and restrained but lacks a distinctive visual identifier and a durable expressive system. The wordmark alone is difficult to recognize when text is unavailable, and repeated typography, borders and rectangular surfaces do not fully communicate the intended perception: precise, modern, ambitious, approachable and technically confident.

A visually ambitious response can create new problems if it is introduced without governance. A site-wide cinematic treatment could obscure the commercial message, degrade mobile performance, exclude motion-sensitive visitors, weaken static/no-JavaScript behavior, or turn visual spectacle into an unsupported claim of scale. Adding Three.js, React Three Fiber, generated footage or scroll orchestration without a clear boundary would also change the dependency and client-runtime architecture.

The initiative therefore needs one integrated decision that connects identity, composition, responsive behavior, accessibility, performance, runtime architecture and prototype evidence before production planning begins.

## Requirements

The accepted direction must:

- preserve FURLANICH as a founder-led software studio and preserve all approved evidence, demonstration, disclosure and commercial-claim boundaries;
- keep `FURLANICH` as the primary wordmark while adding one standalone identifier that remains recognizable at favicon size;
- derive the identifier from three equal-weight upward chevrons without publishing the supplied raster reference or claiming an exact historical heraldic reproduction;
- use the newly constructed vector geometry as the future canonical source after final optical refinement and approval;
- use bone white `#F9F6EE` and azure `#004589` as the recognizable color pair while adding only the neutral roles needed for readable hierarchy;
- provide natural Spanish and English typography with the required accents and glyph coverage;
- keep the homepage proposition and actions readable, interactive and meaningful without WebGL, motion or JavaScript;
- place all copy, links, headings and interaction semantics in ordinary HTML rather than inside a canvas;
- protect the canonical logo from deformation while allowing a separate derived sculpture to separate and reconnect;
- make scroll progression reversible and avoid scroll hijacking, custom scrollbars, forced cinematic waits, audio and autoplay introductions;
- provide a complete static composition when `prefers-reduced-motion` is active, WebGL is unsupported, initialization fails or a context is lost;
- adapt composition at 320, 390, 768, 1024 and 1440 CSS pixels without making mobile visitors traverse an artificially long pinned scene;
- preserve static export, trailing slashes, both locale trees, the optional `/Portfolio` base path and the current GitHub Pages deployment;
- limit WebGL to the homepage signature sequence in v1;
- use a throwaway prototype to close performance and activation questions before a production execution plan is written;
- add no production application change, runtime dependency, provider activation, evidence upgrade, legal/SEO expansion or hosting change in the Governance PR.

## Proposed approach

### Identity system

Create a **Contained Master** symbol composed of three broad, parallel, upward chevrons on one central axis. The three forms use equal visual weight and equal negative space with sharp mitred peaks. All endpoints remain visible in the canonical mark.

The primary lockup is `symbol + FURLANICH`. The symbol may appear alone only when the surrounding context already identifies FURLANICH, such as a favicon, social avatar or repeated navigation context. Required future assets are:

- primary horizontal lockup;
- azure-on-bone and bone-on-azure variants;
- icon-only mark;
- favicon sizes;
- documented clear space, minimum size and invalid uses.

The protected master mark is a DOM/SVG identity asset. It does not enter the WebGL scene, deform, rotate, separate or morph. The provided `arrow-stripes.png` remains design reference only and is not a production asset.

### Color and typography

Use the following proposed core roles:

| Role | Value | Intended use |
| --- | --- | --- |
| Bone | `#F9F6EE` | Primary page canvas and identity ground |
| Azure | `#004589` | Symbol, primary actions, active states and sculpture |
| Ink | `#09243D` | Long-form text and high-contrast headings |
| Muted | `#526473` | Secondary text and metadata |
| Tint | `#E7EEF5` | Quiet states and restrained separation |

Azure on bone provides strong text contrast, but every final token pairing and state still requires deterministic contrast verification. Full-azure surfaces are reserved for deliberate emphasis rather than alternating every section. UI gradients, neon and glass effects remain excluded. Physically plausible lighting may create tonal variation on the 3D azure material.

[Instrument Sans](https://github.com/Instrument/instrument-sans) is the proposed primary family for headings, body copy, navigation and actions. [IBM Plex Mono](https://github.com/IBM/plex) is limited to short technical labels, sequence numbering and compact metadata; it must not become paragraph text or a developer-console aesthetic. Both families are available under the SIL Open Font License from their official projects. Production implementation must self-host only the required subsets/weights through the established Next.js font boundary and retain the required license notices.

### Precision Assembly composition

The homepage uses warm editorial space, controlled asymmetry, exact rules and one dimensional azure sculpture. The scene is visually substantial but remains secondary to the proposition and actions.

The approved narrative has four reversible beats:

1. **Recognition:** the complete derived sculpture establishes the three-layer visual world beside the proposition and actions.
2. **Fragmentation:** the layers separate while restrained operational inputs such as orders, bookings and messages appear without a shared flow.
3. **Connection:** signals find deliberate paths and the layers move toward coordination.
4. **Coordination:** the sculpture resolves into one system and hands the visitor into concrete business problems and services.

The scene explains a general service idea. It is not project evidence, a client workflow, a proprietary platform, a production outcome or a claim that FURLANICH owns an operational product.

### Responsive composition

The same narrative is composed differently rather than uniformly scaled:

| Width | Proposed composition |
| ---: | --- |
| 1440 px | Full split editorial stage with complete depth and camera travel |
| 1024 px | Compressed split with shorter camera movement |
| 768 px | Stacked or locally overlaid stage with reduced scene detail |
| 390 px | Copy and actions first; compact local scene without a long pinned viewport |
| 320 px | Same semantic order with tighter measure, simplified detail and full-width actions |

Rendering quality is capability-aware rather than inferred only from width. Reduced motion always produces the resolved static composition. Mobile WebGL activation and exact quality thresholds remain prototype questions.

### Site-wide application

Home receives the real-time scene. Other public pages adopt the identity through the symbol, typography, spacing, section numbering, controlled azure fields, editorial composition, project-media framing and restrained two-dimensional details. They receive no additional WebGL canvas in v1.

Cards remain appropriate for real comparisons, bounded evidence and controls. Typography, whitespace, rules, diagrams and imagery should carry ordinary hierarchy. The later design-owner revision must define page-level migrations without weakening existing evidence or Contact constraints.

Samuel's public professional descriptor becomes **Software Engineer** in English and **Ingeniero de software** in Spanish. Academic qualifications and the recorded Clever Soft SA title remain distinct, exact facts. This is an identity/content-owner revision, not permission to rewrite employment history or imply an engineering degree that the source record does not establish.

### Progressive WebGL architecture

The homepage remains server-rendered and complete before enhancement:

```text
Server-rendered hero
├── accessible HTML proposition and actions
├── protected SVG identity
└── resolved static poster
    └── capability gate
        ├── eligible -> lazy real-time scene
        └── reduced motion / unsupported / failure -> poster remains
```

Proposed component boundaries are:

- `ImmersiveHero`: semantic layout, localized content and fallback artwork;
- `ImmersiveSceneGate`: reduced-motion and WebGL eligibility plus lazy loading;
- `PrecisionAssemblyScene`: derived geometry, camera, lighting and operational signals only;
- a pure scroll-state mapper that converts normalized progress into the four narrative states.

Use Three.js through React Three Fiber 8 because the current application uses React 18; the [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction) documents v8 for React 18 and v9 for React 19. Use the existing Framer Motion dependency and its [scroll-linked animation boundary](https://motion.dev/docs/react-scroll-animations) to supply progress and reduced-motion integration. Do not add GSAP in v1 unless the prototype demonstrates that the existing dependency cannot deliver smooth, reversible orchestration. Do not add Drei unless one concrete prototype requirement justifies it.

The v1 sculpture uses procedural geometry and needs no downloaded model. Blender and Higgsfield may support offline look development or later campaign media but are not runtime dependencies and do not control page behavior.

### Motion, failure and accessibility

Scroll may change transform, camera, opacity and material properties. It must not animate document layout or make the canvas the scrolling mechanism. The scene settles when interaction stops and consumes no continuous idle animation budget.

The static poster remains the fallback for:

- `prefers-reduced-motion: reduce`, following the [W3C reduced-motion technique](https://www.w3.org/WAI/WCAG21/Techniques/css/C39.html);
- missing or unsuitable WebGL support;
- canvas initialization failure;
- WebGL context loss;
- a prototype-defined capability/performance gate.

Failure is quiet: copy and actions remain present, no error message interrupts the visitor, and the poster preserves the resolved visual meaning. Keyboard operation, focus, landmarks, headings and CTA destinations are independent of the canvas. Decorative canvas content is not exposed as duplicate assistive content; its meaning is provided by adjacent HTML.

### Prototype and decision closure

After this RFC is accepted and the resulting architecture ADR is recorded, build a throwaway prototype on an isolated branch. It is not merged into production. The prototype must exercise:

- both approved locale variants of the hero;
- all four scroll beats and reverse scrolling;
- the five representative widths;
- protected SVG identity and procedural 3D sculpture;
- reduced-motion, no-WebGL and forced context-failure paths;
- mobile quality reduction;
- representative loading, bundle, frame-time and layout-stability measurements.

The prototype verdict must answer:

1. whether existing Framer Motion produces sufficiently smooth reversible progress;
2. which capability and mobile activation thresholds are defensible;
3. whether procedural geometry reaches the accepted visual quality;
4. whether any rendered media remains justified;
5. the measured budgets and implementation gates for the final plan.

Only after human review of that verdict may a versioned production execution plan be written.

### Existing implementation reconciliation

The current production source still contains previously approved marketing-contract gaps: the pre-D02 bilingual hero, a duplicated Problems heading/introduction, and Founder professional links before the D06 substantive background. The visual-identity work must not redefine those accepted decisions. The later execution plan should isolate their correction, plus the approved professional-descriptor update, from the immersive runtime work so review can distinguish correctness from new design.

## Alternatives considered

### Keep only the text wordmark

This retains the simplest existing identity but does not create a compact recognizable identifier or a geometry capable of supporting the proposed visual system.

### Reproduce the supplied family reference literally

This is closer to the source image but couples the identity to a cropped field and to raster-specific proportions. The contained abstract construction is more reliable across favicons, navigation, print and motion while retaining the three-chevron idea.

### Transform the actual logo during scroll

This can create a memorable morph but weakens consistency and makes the identity dependent on motion state. The proposal protects the master mark and animates a separate derived sculpture.

### Use site-wide WebGL scenes

This maximizes spectacle but multiplies rendering, accessibility, QA and maintenance cost while making ordinary pages compete with their content. One signature homepage scene creates a clearer hierarchy.

### Use scroll-scrubbed rendered video

Blender or Higgsfield can provide cinematic fidelity, but video adds encoding, download and seeking constraints and makes geometry/timing changes expensive. It remains a prototype fallback only if live geometry cannot meet the approved quality.

### Use a hybrid live-scene and video runtime

This offers the richest atmosphere but creates two runtime optimization pipelines. The proposal keeps Higgsfield and Blender offline for v1 and avoids the additional complexity.

### Add GSAP ScrollTrigger immediately

ScrollTrigger is capable and well documented, but the repository already includes Framer Motion. The prototype should first test the existing dependency; add another orchestration runtime only with measured justification.

### Retain Inter and the current palette

This avoids font and token migration but leaves the visual identity close to the existing restrained foundation. Instrument Sans, Plex Mono, bone and azure create a more recognizable voice while preserving clarity.

## Trade-offs

- A custom symbol, two font families and revised tokens increase design-system and asset-governance work.
- WebGL adds client JavaScript and GPU use even when limited to one route; lazy enhancement and a complete poster reduce but do not remove that cost.
- Procedural geometry is efficient and responsive but provides less immediate cinematic richness than rendered footage.
- One protected mark plus one derived sculpture requires documentation so future work does not confuse the two assets.
- Capability-aware activation creates more test paths than a universally static hero.
- Instrument Sans plus Plex Mono is more distinctive than Inter but requires careful subsetting and loading to prevent a typography improvement from becoming a performance regression.
- Limiting WebGL to Home gives the site a clear focal point, while other pages rely on composition and static identity for continuity.

## Migration and implementation impact

This Governance PR changes documentation only. It does not add fonts, SVG production assets, Three.js, React Three Fiber, routes, canvases, media, generated imagery, runtime detection or application code.

If accepted, the next records are:

1. approved revisions in [`DESIGN-VISUAL`](../design/visual-language.md), [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md) and the Founder content owner;
2. one immutable ADR recording the progressively enhanced React Three Fiber homepage architecture;
3. an isolated throwaway prototype and measured verdict;
4. a versioned execution plan only after prototype review.

A separate visual ADR would duplicate the design owners and is not recommended. The runtime boundary is the consequential architecture decision that requires an ADR.

The final execution plan should separate at least:

- existing marketing-contract reconciliation and professional descriptor;
- identity assets, fonts and tokens;
- static responsive composition and site-wide editorial migration;
- immersive homepage enhancement and fallback paths;
- performance, accessibility, browser and visual acceptance.

The plan cannot authorize Contact activation, hosting changes, evidence upgrades or additional WebGL pages.

## Risks

- The chevrons can resemble generic growth, outdoor or military insignia if optical refinement and surrounding identity are weak.
- Excessive monospaced labels can turn the studio into a developer-tool aesthetic.
- Canvas initialization can delay interaction or create layout shift if the static stage does not own dimensions.
- High device pixel ratio, post-processing or continuous rendering can make mobile performance unacceptable.
- Scroll-linked motion can cause discomfort or confusion if reduced-motion behavior is incomplete.
- Generated or cinematic material can be mistaken for project evidence unless it is clearly brand illustration.
- A broad redesign can reintroduce card fatigue or reduce copy clarity if individual pages are migrated without owner-level acceptance criteria.
- The public “Software Engineer” descriptor can be misread as an academic degree if biography and education wording are not kept distinct.
- Implementing against the current inconsistent hero/Founder baseline could preserve already-known correctness defects inside the redesign.

## Unresolved questions

The following remain **OPEN** until the prototype verdict or later owner review:

- exact optical geometry, clear space and minimum sizes for the canonical vector symbol;
- mobile WebGL activation thresholds, pixel-ratio limits and frame-time budget;
- measured JavaScript and loading budgets for the enhanced homepage;
- whether Framer Motion alone meets reversible-scrub quality;
- whether rendered media provides enough incremental value to justify a later separate pipeline;
- the exact production PR sequence and rollback checkpoints;
- whether later campaigns need animated/video identity assets outside the website runtime.

The following remain outside this RFC and keep their current repository status: commercial Contact activation, legal/SEO/release expansion, project-evidence permissions, new client claims, founder portrait, dark theme, additional WebGL pages, custom hosting and any change to the demonstration ADR.

## Recommendation

Approve the integrated v1 direction for prototype validation: the Contained Master identity, bone/azure Precision Assembly visual system, Instrument Sans plus restrained Plex Mono, one four-beat homepage sculpture, and progressively enhanced React Three Fiber 8 using the existing Framer Motion boundary. Preserve complete server-rendered meaning and a static resolved poster, and require measured prototype evidence before production planning.

## Status

**APPROVED — 2026-09-19.** The repository owner explicitly approved this RFC and merged [Governance PR #61](https://github.com/Furlanich/Portfolio/pull/61). The approval authorizes the design-owner revisions, architecture ADR and isolated prototype described here. It does not authorize production implementation, runtime dependencies, generated media, provider activation, evidence upgrades, release/legal/SEO expansion or a versioned execution plan before the prototype verdict receives human review.
