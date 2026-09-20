---
id: PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1
type: execution-plan
status: APPROVED
plan_status: ACTIVE
related:
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
  - REVIEW-VISUAL-IDENTITY-G0-G1-2026-09-20
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-HOME
  - PAGE-FOUNDER
  - PROJECT-EVIDENCE
  - ADR-STATIC-LOCALIZED-ROUTING
last_verified: 2026-09-20
---

# Visual Identity and Adaptive Immersive Experience v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Also use the repository `frontend-implementation`, `test-driven-development`, `playwright-qa`, `visual-qa`, `verification-before-completion`, and `pr-readiness` Skills at their named boundaries. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic presentation with the approved FURLANICH identity and C2 Adaptive System Instrument while preserving the complete bilingual commercial narrative, evidence boundaries, static export, accessibility and reliable compact-device behavior.

**Architecture:** Keep localized Server Components and static HTML as the complete product. Add a protected SVG identity and final static chapter artwork first. A narrow homepage Client Component observes native scroll and capability state, then dynamically imports a direct Three.js runtime only when eligible. The runtime paints a decorative derived sculpture on demand and never owns copy, actions, document layout or scrolling. One optional governed native video may later enhance Connection without becoming a completion dependency.

**Tech Stack:** Next.js 16.3 App Router, React 18, TypeScript 5.5, Tailwind CSS 3.4, Framer Motion 11, direct Three.js 0.186, self-hosted Instrument Sans and IBM Plex Mono through `next/font/local`, Node contract tests, Playwright, static export and GitHub Pages with optional `basePath`.

**Spec:** [`RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1`](../../rfcs/visual-identity-immersive-experience-v1.md), [`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](../../rfcs/adaptive-immersive-homepage-production-v1.md), [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../../decisions/adaptive-immersive-homepage.md), [`DESIGN-VISUAL`](../../design/visual-language.md), [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md), [`PAGE-HOME`](../../product/pages/home.md), and [`PAGE-FOUNDER`](../../product/pages/studio-and-founder.md).

## Global Constraints

- This plan is **APPROVED — 2026-09-20** by the repository owner. Approval authorizes the sequenced implementation PRs below; it does not collapse their human-review and merge boundaries.
- Preserve the founder-led studio model, demonstration Contact contract, evidence permissions and all current route pairs. Do not imply a larger team, clients, outcomes, funding, a proprietary platform or commercial scale.
- Preserve static export, trailing slashes, Spanish root routes, English `/en/` routes, optional `/Portfolio` base path and GitHub Pages deployment.
- The protected Contained Master is a DOM/SVG brand asset. Never import its geometry into Three.js, deform it or use it as the animated sculpture.
- Home is the only WebGL route in v1. Do not add React Three Fiber, GSAP, Drei, post-processing, model downloads, a player framework or a React-major upgrade.
- Essential copy, headings, links, chapter meaning, captions and actions remain HTML. Canvas is decorative, `aria-hidden`, unfocusable and unable to capture pointer input or scrolling.
- Paint meaningful HTML and the first static poster before requesting Three.js or video. Reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, context loss and blocked media use the static path.
- Run no idle render loop. Render only on state, progress, resize or media-frame invalidation, then settle.
- Generated or rendered media is `brand-motion` by default. It cannot appear as project evidence or depict invented clients, dashboards, metrics or results.
- Use the concept image only as discussion evidence. It is not a production asset and does not approve its fabricated navigation, captions, glass, plinth or interface details.
- Keep every unresolved choice **OPEN** until its named gate closes. Do not fill an absent video with placeholder footage or an empty frame.
- Each implementation PR starts from current `main` in a short-lived `codex/` branch, has focused tests and commits, passes its listed gates and stops at a human-reviewed PR. Do not merge.

## Review Focus

Reviewers should prioritize:

1. commercial clarity before spectacle;
2. exact separation between the protected mark and derived sculpture;
3. natural Spanish and English composition at 320, 390, 768, 1024 and 1440 CSS pixels;
4. static, reduced-motion and failure experiences as complete designs;
5. payload headroom, frame timing, resource disposal and constrained-device behavior;
6. evidence and media classification;
7. focus order, zoom, no-JavaScript behavior and absence of scroll capture;
8. recognizability without generic chevron, military or outdoor-brand signals.

---

## Objective

Deliver the approved visual identity across the existing public site and make the homepage the single immersive focal point. The final experience must remain a credible commercial studio site when every enhancement is disabled.

## Governance classification

**Route:** approved consequential RFC and superseding ADR, followed by this versioned execution plan.

The runtime, renderer, media ceiling, responsive choreography and visual territory are closed by the related RFCs and ADR. The two pre-implementation definition gates are now closed by [`REVIEW-VISUAL-IDENTITY-G0-G1-2026-09-20`](../../reviews/contained-master-optical-closure-2026-09-20/index.md): Balanced Contained owns the exact protected geometry, and Operational Clarity owns the exact bilingual chapter interface copy. The exact optional Connection film, shot list, production tool, codec and rendition ladder remain OPEN and do not block the identity, static C2 or direct Three.js implementation.

## Requirements implemented

| Authority | Implementation responsibility |
| --- | --- |
| `PAGE-HOME` | Exact approved commercial copy, CTA destinations, section order and honest proof fallback |
| `PAGE-FOUNDER` | `Ingeniero de software` / `Software Engineer` as the general descriptor while preserving the exact Clever Soft SA employment title |
| `DESIGN-VISUAL` | Contained Master, bone/azure identity, typography, Precision Assembly, C2 composition and site-wide static presentation |
| `DESIGN-IX-A11Y` | Semantic-first enhancement, four reversible chapters, Pause motion, responsive choreography, failures and production budgets |
| `PROJECT-EVIDENCE` | Fail-closed classification for all project imagery and claims |
| `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE` | Direct Three.js, Framer Motion progress boundary, optional native video, demand rendering and lifecycle rules |
| `ADR-STATIC-LOCALIZED-ROUTING` | Static localized routes, route-owned content, trailing slashes and base-path behavior |

## Non-goals

- Contact provider activation, data transmission, new privacy behavior or response-time claims.
- New project evidence, permissions, testimonials, logos, clients, metrics or production outcomes.
- Release, legal, SEO, analytics, hosting, CMS or canonical-domain work.
- Additional WebGL routes, a dark theme, audio, custom scrollbars, scroll hijacking or autoplay introduction.
- React 19, React Three Fiber 9, GSAP, Drei, post-processing, downloaded 3D models or a generalized media platform.
- A founder portrait, CV redesign or fabricated device/product UI.

## Accepted and OPEN decisions

| Topic | State | Execution consequence |
| --- | --- | --- |
| C2 Adaptive System Instrument | APPROVED | Build the semantic/static composition before enhancement |
| Direct Three.js under React 18 | APPROVED | Add only `three` and `@types/three` in the runtime PR |
| Instrument Sans + IBM Plex Mono | APPROVED | Self-host required Latin files and licenses; mono remains limited to short labels |
| Bone `#F9F6EE` + azure `#004589` | APPROVED | Migrate semantic roles and verify every contrast/state pairing |
| General founder descriptor | APPROVED | Use `Ingeniero de software` / `Software Engineer`; preserve employer title |
| Exact master geometry | APPROVED — Balanced Contained | G0 is closed; PR2 must use the recorded coordinates and rules |
| Exact chapter microcopy | APPROVED — Operational Clarity | G1 is closed; PR5 must copy the PAGE-HOME strings exactly |
| Connection authored film | OPEN / optional | Gate G2 is conditional and cannot block v1 without video |
| 768 px local sticky interval | CONDITIONAL | Default to sequential flow; add short sticky only after real-device evidence |
| Analytics/conversion measurement | OPEN / out of scope | Do not add tracking in this plan |

---

## Pull Request sequence

| Order | Pull Request | Boundary | Blocks next |
| ---: | --- | --- | --- |
| G0 | Contained Master optical closure | Documentation and design assets only | PR2 |
| G1 | Immersive chapter copy closure | Documentation only | PR5 |
| 1 | Marketing-contract reconciliation | Approved copy/correctness only | No |
| 2 | Identity assets, fonts and tokens | Shared identity foundation | PR3–PR6 |
| 3 | Offer and evidence presentation | Services, Projects and project details | No |
| 4 | Studio, Founder and utility presentation | Studio, Founder, Contact and Privacy | No |
| 5 | Semantic static C2 homepage | Complete no-JS/static experience | PR6 |
| 6 | Direct Three.js enhancement | Homepage-only progressive runtime | PR8 |
| G2 / 7 | Optional Connection film | Conditional governed media PR | No |
| 8 | Cross-browser, real-device and acceptance closure | Final evidence and documentation | Completion |

PRs 3 and 4 may be developed independently after PR2 merges. PR5 depends on G1 and PR2. PR6 depends on PR5. PR7 is omitted when no asset passes G2.

---

## Gate G0 — close the Contained Master optical geometry

**Files:**

- Create: `docs/reviews/contained-master-optical-closure-2026-09-20/index.md`
- Create: `docs/reviews/contained-master-optical-closure-2026-09-20/assets/candidate-a.svg`
- Create: `docs/reviews/contained-master-optical-closure-2026-09-20/assets/candidate-b.svg`
- Create: `docs/reviews/contained-master-optical-closure-2026-09-20/assets/candidate-c.svg`
- Modify after human selection: `docs/design/visual-language.md`
- Modify after human selection: `docs/governance/status-register.md`

- [x] Construct three optical refinements from new vector geometry: equal-weight upward chevrons, equal negative space, visible endpoints and sharp mitred peaks. Do not trace or publish `arrow-stripes.png`.
- [x] Show every candidate at master size and the recommended candidate at 16, 32, 64 and 160 px, as icon-only and beside the `FURLANICH` wordmark, in azure-on-bone and bone-on-azure.
- [x] Record clear-space and minimum-size proposals, favicon legibility, monochrome behavior and resemblance risks.
- [x] Run `npm.cmd run docs:check` and inspect the SVGs for scripts, external resources, raster payloads, text elements and unnecessary metadata.
- [x] Stop for explicit selection. Record the chosen geometry and rejected alternatives in `DESIGN-VISUAL`; leave implementation unauthorized until this plan is separately approved.
- [x] Record G0 and G1 together in the approved gate-closure commit.

**Acceptance:** one exact vector geometry, clear-space rule, minimum sizes and invalid-use list are APPROVED. G0 contains no production application code.

## Gate G1 — close bilingual immersive chapter copy

**Files:**

- Modify: `docs/product/pages/home.md`
- Modify: `docs/design/visual-language.md`
- Modify: `docs/governance/status-register.md`

- [x] Propose concise Spanish and natural-English HTML copy for Recognition, Fragmentation, Connection and Coordination, plus the instrument label, status text, Pause motion and Resume motion labels.
- [x] Keep the existing approved hero proposition and CTA meaning. Do not introduce a platform name, outcome metric or implied case study.
- [x] Record whether each chapter visual is decorative or needs an adjacent explanatory caption. Static chapter meaning must remain clear without canvas.
- [x] Review 320 px Spanish wrapping and 1440 px English balance in low-fidelity layouts before approval.
- [x] Run `npm.cmd run docs:check`.
- [x] Stop for explicit bilingual copy approval and record the disposition in `PAGE-HOME`.
- [x] Commit: `docs(design): close visual identity gates`.

**Acceptance:** exact route-owned strings are APPROVED before PR5 copies them into code.

---

## PR1 — reconcile approved marketing copy and founder descriptor

This PR repairs known divergence only. It introduces no visual system or runtime dependency.

**Files:**

- Modify: `scripts/homepage-content.test.mjs`
- Modify: `scripts/studio-content.test.mjs`
- Modify: `scripts/foundation-content.test.mjs`
- Modify: `tests/e2e/studio-founder.spec.ts`
- Modify: `app/(es)/_content/home.ts`
- Modify: `app/(en)/en/_content/home.ts`
- Modify: `app/(es)/_content/founder.ts`
- Modify: `app/(en)/en/_content/founder.ts`
- Modify only if current route composition still diverges: `components/homepage/content-types.ts`
- Modify only if current route composition still diverges: `components/homepage/CommercialHomepage.tsx`
- Modify: `ARCHITECTURE.md`

### Task 1.1 — disposition: superseded by the merged MKT-D05 homepage contract

- [x] Compared the planned pre-D02 assertions with the later APPROVED `PAGE-HOME` MKT-D05 contract already present on `main`.
- [x] Confirmed `scripts/homepage-content.test.mjs` already protects the current seven-section sequence, distinct Problems heading/introduction and honest Projects proof bridge in both locales.
- [x] Did not fabricate a historical red test or commit for requirements superseded before this plan was approved.

### Task 1.2 — disposition: current route-owned content already satisfies MKT-D05

- [x] Confirmed the exact approved Spanish and English MKT-D05 strings remain in the two route-owned `home.ts` modules.
- [x] Preserved the approved consolidation: audience meaning is folded into Problems, Problems has three rows and proof uses the technical-accountability bridge to Projects; the retired standalone audience section was not restored.
- [x] Ran the homepage contract test and TypeScript check successfully without changing the current Home composition.

### Task 1.3 — apply the general professional descriptor without altering employment history

- [x] Added assertions that the Founder header/opening/biography use `Ingeniero de software` and `Software Engineer` for Samuel's general profession.
- [x] Added assertions that the Clever Soft SA sentence still uses the exact employer title `Software Developer` and that education still says completed Computer Science studies rather than an engineering degree.
- [x] Confirmed the focused descriptor contract red before editing content.
- [x] Updated only the general professional-label occurrences in the two Founder modules; the homepage Founder copy contains no profession label requiring a change.
- [x] Ran `node --test scripts/studio-content.test.mjs scripts/foundation-content.test.mjs scripts/homepage-content.test.mjs` successfully.
- [x] Updated the existing browser contract after its old descriptor assertions failed, then confirmed all 16 Studio/Founder Chromium checks pass.
- [x] Commit: `fix(founder): use approved software engineer descriptor`.

### PR1 verification

- [x] `npm.cmd run docs:check`
- [x] `npm.cmd test`
- [x] `npm.cmd run lint`
- [x] `npm.cmd run typecheck`
- [x] `npm.cmd run build`
- [x] `npm.cmd run verify:static-export`
- [x] Reviewed ES and EN Home and Founder at 320 and 1440 px for clipping and hierarchy; no redesign was introduced in this PR.

---

## PR2 — establish identity assets, self-hosted fonts and semantic tokens

**Dependency:** G0 approved.

**Files:**

- Create: `public/brand/furlanich-mark-azure-on-bone.svg`
- Create: `public/brand/furlanich-mark-bone-on-azure.svg`
- Create: `public/brand/furlanich-lockup-azure-on-bone.svg`
- Create: `public/brand/furlanich-lockup-bone-on-azure.svg`
- Replace from the approved geometry: `public/favicon.svg`, `public/favicon.png`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon.png`
- Create: `app/fonts/instrument-sans-variable-latin.woff2`
- Create: `app/fonts/ibm-plex-mono-regular-latin.woff2`
- Create: `app/fonts/ibm-plex-mono-semibold-latin.woff2`
- Create: `app/fonts/OFL-instrument-sans.txt`
- Create: `app/fonts/OFL-ibm-plex.txt`
- Create: `app/fonts.ts`
- Create: `components/brand/BrandSignature.tsx`
- Create: `scripts/brand-assets.test.mjs`
- Create: `scripts/design-tokens.test.mjs`
- Modify: `app/(es)/layout.tsx`
- Modify: `app/(en)/layout.tsx`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `components/foundation/SiteHeader.tsx`
- Modify: `components/foundation/SiteFooter.tsx`
- Modify: `components/foundation/NavigationDisclosure.tsx`
- Modify: `components/foundation/LanguageSwitch.tsx`
- Modify: `scripts/site-header.test.mjs`
- Modify: `scripts/site-footer.test.mjs`
- Modify: `docs/design/visual-language.md`

### Task 2.1 — lock asset and font provenance with failing tests

- [ ] Add tests for required mark variants, stable `viewBox`, no scripts/external resources/raster data/text elements, matching canonical geometry, favicon signatures/dimensions and required OFL notices.
- [ ] Add tests that reject `next/font/google`, Inter fallbacks and unapproved font weights after migration.
- [ ] Add contrast tests for Bone `#F9F6EE`, Azure `#004589`, Ink `#09243D`, Muted `#526473` and Tint `#E7EEF5` in every text/control pairing used by the new system.
- [ ] Run `node --test scripts/brand-assets.test.mjs scripts/design-tokens.test.mjs`; expect failure because assets and tokens do not yet exist.
- [ ] Commit: `test(brand): define identity asset and token contracts`.

### Task 2.2 — add the protected master and self-hosted type

- [ ] Export only the G0-approved geometry. Keep the source SVG free of motion hooks and scene-specific IDs.
- [ ] Source the exact Latin font binaries from the official Instrument Sans and IBM Plex repositories; record release/tag and SHA-256 values in `DESIGN-VISUAL` and retain both license texts.
- [ ] Configure `app/fonts.ts` with `next/font/local`: Instrument Sans variable as `--font-sans`; Plex Mono 400/600 as `--font-mono`; `display: swap`; preload only the primary face.
- [ ] Import the font variables from both locale layouts. Confirm identical files are emitted once rather than per locale.
- [ ] Run the focused tests and a static build.
- [ ] Commit: `feat(brand): add protected mark and self-hosted typography`.

### Task 2.3 — migrate semantic tokens and shared chrome

- [ ] Replace launch foundation roles with the approved Bone/Azure/Ink/Muted/Tint roles. Add a border/surface role only when deterministic contrast and separation require it.
- [ ] Add `font-mono` for short sequence labels only. Keep body, actions and navigation in Instrument Sans.
- [ ] Implement `BrandSignature` as an image-backed protected mark plus the accessible text wordmark. Use the icon alone only where surrounding context already names FURLANICH.
- [ ] Update Header/Footer/disclosure/language switch without changing route labels, order, demo contract or focus behavior.
- [ ] Regenerate favicons from the approved master and verify 16/32 px legibility manually.
- [ ] Run `node --test scripts/brand-assets.test.mjs scripts/design-tokens.test.mjs scripts/site-header.test.mjs scripts/site-footer.test.mjs`.
- [ ] Commit: `feat(brand): apply identity foundation to shared chrome`.

### PR2 verification

- [ ] `npm.cmd run validate`
- [ ] `npm.cmd run test:e2e -- --project=chromium-desktop --project=mobile-chromium`
- [ ] Keyboard-check the mobile disclosure, language switch and CTA at 320/390/1024/1440.
- [ ] Run visual QA on the header/footer in both locales, including high zoom and reduced motion.
- [ ] Measure added font transfer; record actual WOFF2 byte totals in the PR and reject unnecessary subsets or faces.

---

## PR3 — migrate Services and Projects to the static editorial system

**Files:**

- Modify: `components/commercial/CommercialSectionHeading.tsx`
- Modify: `components/commercial/CommercialContentCard.tsx`
- Modify: `components/commercial/equal-height-card-grid.ts`
- Modify: `components/services/ServicesPage.tsx`
- Modify: `components/services/ServicesIntroduction.tsx`
- Modify: `components/services/ServiceSection.tsx`
- Modify: `components/services/ServicesPrinciples.tsx`
- Modify: `components/services/ServicesFinalCta.tsx`
- Modify: `components/projects/ProjectsPage.tsx`
- Modify: `components/projects/ProjectCard.tsx`
- Modify: `components/projects/ProjectDetailPage.tsx`
- Modify: `tests/e2e/marketing-services.spec.ts`
- Modify: `tests/e2e/marketing-projects.spec.ts`
- Create: `tests/e2e/visual/services-projects.visual.spec.ts`

- [ ] Add browser assertions first for unchanged headings, evidence labels, limitation copy, CTA destinations, source order and noninteractive cards.
- [ ] Capture red visual baselines only after the expected art direction is implemented; do not bless current snapshots as the target.
- [ ] Replace repeated bordered-panel rhythm with approved editorial grouping, rules, typography, media framing and selective surfaces. Keep comparison/evidence cards where the boundary is real.
- [ ] Use Plex Mono only for short service/evidence metadata. Do not turn the pages into a developer console.
- [ ] Keep project imagery and labels within current permissions. Do not promote MPC or Lab items or remove limitations.
- [ ] Verify both locales at all five widths, including long English/Spanish wrapping and project-detail page endings.
- [ ] Commit implementation in two focused commits: `feat(services): apply precision assembly presentation` and `feat(projects): apply evidence-led editorial presentation`.

### PR3 verification

- [ ] `node --test scripts/commercial-primitives.test.mjs scripts/services-content.test.mjs scripts/projects-publication.test.mjs scripts/project-details.test.mjs`
- [ ] `npx.cmd playwright test tests/e2e/marketing-services.spec.ts tests/e2e/marketing-projects.spec.ts`
- [ ] `npm.cmd run validate`
- [ ] Visual QA at 320, 390, 768, 1024 and 1440 px; inspect cards, proof labels, media crops, CTA prominence and endings.

---

## PR4 — migrate Studio, Founder, Contact and Privacy to the static editorial system

**Files:**

- Modify: `components/studio/StudioPage.tsx`
- Modify: `components/studio/StudioIntroduction.tsx`
- Modify: `components/studio/StudioAccountability.tsx`
- Modify: `components/studio/StudioPrinciples.tsx`
- Modify: `components/studio/StudioFounderBridge.tsx`
- Modify: `components/studio/StudioFinalCta.tsx`
- Modify: `components/founder/FounderPage.tsx`
- Modify: `components/founder/FounderHeader.tsx`
- Modify: `components/founder/FounderProfessionalHistory.tsx`
- Modify: `components/founder/FounderCapabilities.tsx`
- Modify: `components/founder/FounderProfessionalLinks.tsx`
- Modify: `components/founder/FounderProjectsBridge.tsx`
- Modify: `components/founder/FounderFinalCta.tsx`
- Modify: `components/contact/ContactPage.tsx`
- Modify: `components/contact/ContactForm.tsx`
- Modify: `components/privacy/PrivacyPage.tsx`
- Modify: `tests/e2e/studio-founder.spec.ts`
- Modify: `tests/e2e/studio-founder-responsive.spec.ts`
- Modify: `tests/e2e/contact.spec.ts`
- Modify: `tests/e2e/privacy.spec.ts`
- Replace: `tests/e2e/visual/studio.visual.spec.ts` snapshots
- Replace: `tests/e2e/visual/founder.visual.spec.ts` snapshots

- [ ] Add or strengthen behavior assertions before presentation changes: exact Studio/Founder order, general professional descriptor, employer title, CV/GitHub/LinkedIn destinations, demo notice, zero-transmission Contact behavior, fallback channel order and Privacy content.
- [ ] Apply deliberate editorial variation without changing facts or hiding substantive biography/limits behind disclosure controls.
- [ ] Keep Studio as the operating model and Founder as professional background. Preserve MPC as educational group work only.
- [ ] Keep Contact frictionless and visibly demonstrative. Do not add submission transport, response promise, storage, analytics or consent for a nonexistent processor.
- [ ] Preserve field labels, errors, live-region behavior, textarea resizing, first-invalid focus and successful local reset.
- [ ] Use static brand geometry as a quiet identity motif only where it improves hierarchy; do not introduce another animated scene.
- [ ] Commit by page family: `feat(studio-founder): apply founder-led editorial presentation` and `feat(contact): apply identity presentation without changing demo behavior`.

### PR4 verification

- [ ] `node --test scripts/studio-content.test.mjs scripts/contact-content.test.mjs scripts/contact-state.test.mjs scripts/privacy-content.test.mjs`
- [ ] `npx.cmd playwright test tests/e2e/studio-founder.spec.ts tests/e2e/studio-founder-responsive.spec.ts tests/e2e/contact.spec.ts tests/e2e/privacy.spec.ts`
- [ ] `npm.cmd run test:a11y`
- [ ] `npm.cmd run validate`
- [ ] Visual QA at all five widths and 200% zoom; include keyboard-only Contact completion and no-JavaScript fallback links.

---

## PR5 — build the complete semantic/static C2 homepage

**Dependencies:** PR2 and G1 approved. This PR adds no Three.js dependency or canvas.

**Files:**

- Create: `public/brand/immersive/recognition.svg`
- Create: `public/brand/immersive/fragmentation.svg`
- Create: `public/brand/immersive/connection.svg`
- Create: `public/brand/immersive/coordination.svg`
- Create: `lib/immersive-home/types.ts`
- Create: `lib/immersive-home/media-manifest.ts`
- Create: `components/homepage/immersive/ImmersiveHomeSequence.tsx`
- Create: `components/homepage/immersive/ImmersiveEditorialAnchor.tsx`
- Create: `components/homepage/immersive/ImmersiveChapter.tsx`
- Create: `components/homepage/immersive/ImmersiveStaticArtwork.tsx`
- Create: `components/homepage/immersive/PhaseSpine.tsx`
- Create: `components/homepage/immersive/immersive-home.module.css`
- Create: `scripts/immersive-media-manifest.test.mjs`
- Modify: `components/homepage/content-types.ts`
- Modify: `components/homepage/CommercialHomepage.tsx`
- Modify or remove after migration: `components/foundation/HomeHero.tsx`
- Modify: `app/(es)/_content/home.ts`
- Modify: `app/(en)/en/_content/home.ts`
- Modify: `scripts/homepage-content.test.mjs`
- Modify: `scripts/verify-static-export.mjs`
- Modify: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/immersive-home-static.spec.ts`
- Create: `tests/e2e/visual/immersive-home-static.visual.spec.ts`

### Public content interface

```ts
export type InstrumentChapterId =
  | 'recognition'
  | 'fragmentation'
  | 'connection'
  | 'coordination';

export type InstrumentChapterContent = {
  id: InstrumentChapterId;
  sequence: string;
  heading: string;
  description: string;
  artworkId: string;
};

export type HomeInstrumentContent = {
  label: string;
  statusLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  chapters: readonly [
    InstrumentChapterContent,
    InstrumentChapterContent,
    InstrumentChapterContent,
    InstrumentChapterContent,
  ];
};
```

The route-owned `home.ts` modules own these strings. Shared components contain no locale branching or public prose.

### Task 5.1 — define the static contract before components

- [ ] Add failing tests for exact approved G1 copy, fixed chapter order/IDs, unique headings, media manifest entries and four static artwork files.
- [ ] Require every artwork manifest entry to be `brand-motion`, locale-neutral, free of evidence claims and within its byte budget. The first poster must be at most 150 KiB.
- [ ] Extend static-export verification to require all chapter headings/descriptions and poster URLs in root and `/Portfolio` builds.
- [ ] Run focused tests and confirm red.
- [ ] Commit: `test(home): define adaptive instrument static contract`.

### Task 5.2 — render the semantic document first

- [ ] Integrate the approved hero proposition/actions into `ImmersiveEditorialAnchor`; retain one H1 and existing CTA destinations.
- [ ] Render four document chapters in source order. Each has visible HTML meaning and a static artwork image with stable intrinsic dimensions.
- [ ] Keep artwork decorative when the adjacent HTML conveys the full meaning; otherwise use the exact G1 caption. Do not duplicate the same accessible name through image and text.
- [ ] Use the protected mark in the editorial identity area; use visibly related but separate geometry in chapter artwork.
- [ ] Keep the remaining approved homepage sections and anchors after the immersive sequence.
- [ ] Run content, static-export and type tests.
- [ ] Commit: `feat(home): add semantic adaptive instrument sequence`.

### Task 5.3 — implement width-specific static choreography

- [ ] At 1440, compose editorial anchor, integrated phase spine and a persistent-looking 4:5 artwork region without requiring JavaScript.
- [ ] At 1024, use a compact two-zone composition with fewer simultaneous labels.
- [ ] At 768, default to sequential copy and artwork. Do not add sticky behavior in this PR.
- [ ] At 390, present four normal-flow chapters with inline 1:1 artwork and no prolonged pin.
- [ ] At 320, condense nonessential metadata, preserve headings/actions and favor static artwork.
- [ ] Ensure 200% zoom collapses to readable flow and artwork never overlays copy.
- [ ] Create deterministic reduced-motion visual snapshots for both locales at all five widths.
- [ ] Commit: `feat(home): compose static instrument across five widths`.

### PR5 verification

- [ ] `node --test scripts/homepage-content.test.mjs scripts/immersive-media-manifest.test.mjs`
- [ ] `npx.cmd playwright test tests/e2e/immersive-home-static.spec.ts tests/e2e/responsive.spec.ts`
- [ ] `npm.cmd run build`
- [ ] `npm.cmd run verify:static-export`
- [ ] Repeat build and browser verification with `NEXT_PUBLIC_BASE_PATH=/Portfolio`.
- [ ] Disable JavaScript and confirm the complete bilingual chapter sequence, links and artwork remain usable.
- [ ] Run visual QA for initial viewport, first scroll, each chapter transition, handoff into Problems and final homepage ending at all five widths.

---

## PR6 — add the direct Three.js progressive enhancement

**Dependency:** PR5 merged. Add the renderer only in this PR so bundle and lifecycle cost remain attributable.

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `lib/immersive-home/state.ts`
- Create: `lib/immersive-home/capability.ts`
- Create: `components/homepage/immersive/ImmersiveEnhancement.tsx`
- Create: `components/homepage/immersive/PauseMotionControl.tsx`
- Create: `components/homepage/immersive/runtime/create-instrument-scene.ts`
- Create: `components/homepage/immersive/runtime/instrument-geometry.ts`
- Create: `components/homepage/immersive/runtime/instrument-materials.ts`
- Create: `components/homepage/immersive/runtime/instrument-signals.ts`
- Create: `components/homepage/immersive/runtime/dispose-instrument-scene.ts`
- Create: `scripts/immersive-home-state.test.mjs`
- Create: `scripts/measure-immersive-production.mjs`
- Modify: `components/homepage/immersive/ImmersiveHomeSequence.tsx`
- Create: `tests/e2e/immersive-home.spec.ts`
- Modify: `playwright.config.ts`
- Modify: `package.json` to add `measure:immersive`

### Runtime interface

```ts
export type ImmersiveMode = 'static' | 'webgl';

export type CapabilityInput = {
  reducedMotion: boolean;
  saveData: boolean;
  webglAvailable: boolean;
  nearViewport: boolean;
  sessionContextLost: boolean;
};

export type InstrumentState = {
  chapter: InstrumentChapterId;
  localProgress: number;
  layerSpread: number;
  connectionStrength: number;
  coordination: number;
};

export function chooseImmersiveMode(input: CapabilityInput): ImmersiveMode;
export function mapProgressToInstrumentState(progress: number): InstrumentState;
```

`ImmersiveEnhancement` is the only homepage client boundary. It uses Framer Motion `useScroll`, `useMotionValueEvent` and `useReducedMotion`, and performs a literal dynamic import of `./runtime/create-instrument-scene` only after near-viewport eligibility. The runtime module imports `three` so the renderer stays out of the initial route payload.

### Task 6.1 — test the pure mode and reversible-state model

- [ ] Add table-driven tests for clamped progress, exact chapter boundaries, monotonic forward/reverse mapping, resize recalculation and static-mode precedence for reduced motion, Save-Data, unsupported WebGL and lost context.
- [ ] Run `node --test scripts/immersive-home-state.test.mjs`; expect failure.
- [ ] Implement only the pure state and capability functions; rerun to green.
- [ ] Commit: `test(immersive): define capability and state model` then `feat(immersive): implement reversible state mapping`.

### Task 6.2 — implement one-shot activation and explicit lifecycle

- [ ] Install exact compatible versions of `three` and `@types/three`; do not copy the prototype's other dependencies.
- [ ] Create the canvas only after capability and near-viewport gates pass. Keep the static artwork mounted beneath it so failure never reveals an empty stage.
- [ ] Limit DPR to 1.5 wide and 1.25 compact. Reduce geometry/signals by capability as well as width.
- [ ] Initialize once. Catch dynamic-import and renderer failures, remove the canvas and leave the poster.
- [ ] Listen for `webglcontextlost`, prevent default only as required, dispose/remove the runtime and set a session-local lost flag. Do not retry.
- [ ] On unmount, disconnect observers/listeners; pause media; cancel queued frames; dispose geometry, materials, textures and renderer; remove the canvas.
- [ ] Keep the canvas `aria-hidden`, unfocusable and `pointer-events: none`.
- [ ] Commit: `feat(immersive): add demand-rendered three runtime`.

### Task 6.3 — connect scroll and Pause motion without changing layout

- [ ] Map native progress to the four states and invalidate a frame only when the mapped state materially changes.
- [ ] Preserve active chapter and document position across resize/orientation changes. Recompute from the document; do not replay from Recognition.
- [ ] Render `PauseMotionControl` as an ordinary HTML button beside instrument status only when enhancement is active. Expose pressed/state text and visible focus.
- [ ] Pause freezes WebGL updates and any future video at the current chapter; Resume recalculates from current document position.
- [ ] Reduced motion never initializes canvas and uses immediate static chapter changes only.
- [ ] Commit: `feat(immersive): connect native scroll and pause control`.

### Task 6.4 — automate failures and budgets

- [ ] In Playwright, cover forward and reverse chapters, Pause/Resume, resize, reduced motion, Save-Data, no WebGL, forced renderer-factory failure, context-loss event and no JavaScript. Use dependency seams or request interception; do not add public query-string test modes.
- [ ] Add Chromium coverage for both locales at 320, 390, 768, 1024 and 1440; add Firefox/WebKit smoke for semantic content, activation/fallback and console errors.
- [ ] Implement `measure:immersive` to build, serve locally, activate the scene and report: incremental loaded JS raw/gzip/Brotli, first-poster bytes, activation/first-frame time, rAF interval p95, long tasks, CLS during activation, peak playing-video count and repeated-mount resource counts.
- [ ] Fail the script when immersive Brotli exceeds 120 KiB, first poster exceeds 150 KiB, frame interval p95 exceeds 20 ms, a main-thread task reaches 50 ms, media CLS is nonzero or more than one video plays.
- [ ] Require at least 15 KiB Brotli headroom below the ceiling as the working target. If production cannot create meaningful headroom, stop and return to governance before accepting a ceiling-edge build.
- [ ] Commit: `test(immersive): cover failures and production budgets`.

### PR6 verification

- [ ] `npm.cmd run validate`
- [ ] `npm.cmd run test:e2e`
- [ ] `npm.cmd run verify:static-export`
- [ ] `npm.cmd run measure:immersive`
- [ ] Repeat build/static verification under `/Portfolio`.
- [ ] Use browser memory tools to confirm repeated entry/exit and 20 forward/reverse traversals do not grow live canvases, listeners, textures or renderers.
- [ ] Run visual QA separately from deterministic tests; inspect geometry meaning, hierarchy, reversibility, phase-spine competition and the handoff into Problems.

---

## Gate G2 / PR7 — add one optional governed Connection film

This PR is conditional. Omit it when no asset materially improves Connection or cannot meet the budgets. The static and Three.js experience must close cleanly without it.

**Files when accepted:**

- Create: `docs/reviews/connection-brand-motion-acceptance-v1/index.md`
- Create: `public/brand/immersive/connection/connection-compact.*`
- Create: `public/brand/immersive/connection/connection-wide.*`
- Create: `public/brand/immersive/connection-video-poster.webp`
- Modify: `lib/immersive-home/media-manifest.ts`
- Create: `components/homepage/immersive/ConnectionMedia.tsx`
- Modify: `components/homepage/immersive/ImmersiveHomeSequence.tsx`
- Modify: `components/homepage/immersive/ImmersiveEnhancement.tsx`
- Modify: `scripts/immersive-media-manifest.test.mjs`
- Modify: `scripts/measure-immersive-production.mjs`
- Modify: `tests/e2e/immersive-home.spec.ts`

- [ ] Review a shot list and representative frames before rendering final media. Reject UI, logos, people, facilities, metrics or outcomes that could be mistaken for evidence.
- [ ] Record tool provenance, prompts/source inputs, human edits, license, classification, duration, dimensions, frame rate, codecs, file sizes, caption decision and transcript decision.
- [ ] Classify it as `brand-motion` unless real evidence permissions justify another class; this plan does not provide those permissions.
- [ ] Require a compact rendition at most 1.2 MB and wide rendition at most 2.5 MB. Use no player dependency.
- [ ] Request video only near Connection, pause outside it, retain the poster and coordinate with Pause motion. Reduced motion and Save-Data do not autoplay or request the video.
- [ ] Test blocked/aborted media, slow load, resize during playback and optional-asset absence.
- [ ] Confirm one active decoder/player and zero media-attributable layout shift.
- [ ] Commit: `feat(immersive): add governed connection brand motion`.

**Human boundary:** approve the final asset in its review record and review the implementation PR. Tool choice such as Blender or Higgsfield does not confer approval or evidence status.

---

## PR8 — close cross-browser, real-device and implementation acceptance

**Files:**

- Create: `docs/reviews/adaptive-immersive-homepage-acceptance-v1/index.md`
- Modify: `ARCHITECTURE.md`
- Modify: `docs/governance/status-register.md`
- Modify: `docs/index.md`
- Modify: `docs/plans/index.md`
- Move after completion: `docs/plans/active/visual-identity-adaptive-immersive-v1.md` to `docs/plans/completed/visual-identity-adaptive-immersive-v1.md`
- Modify: the plan progress and deviation sections below

### Task 8.1 — run the complete desktop and responsive matrix

- [ ] Both locales: initial viewport, four chapters forward and reverse, resize/orientation, handoff into Problems, final page CTA.
- [ ] Widths: 320×800, 390×844, 768×1024, 1024×768 and 1440×900.
- [ ] Modes: normal, reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, context loss and blocked/absent video.
- [ ] Input/accessibility: keyboard only, Pause/Resume, visible focus, 200% zoom, source order, screen-reader spot check, color-independent state and representative axe scan.
- [ ] Deployment: root and `/Portfolio`; static export; direct entry and language switch; no console errors, missing assets or broken fragments.

### Task 8.2 — record constrained Android evidence

- [ ] Use one named lower/mid-range Android device and current Chrome. Record model, OS, browser, memory class, viewport, DPR, network profile and whether battery saver is active.
- [ ] Cold-load each locale, traverse forward/reverse 20 times, rotate during Connection, background/foreground the tab and leave it idle for five minutes.
- [ ] Record activation, first-frame, frame interval p95, long tasks, memory trend, thermal observation, video decoder count, input responsiveness and any quality reduction.
- [ ] Default 768 and compact layouts to sequential flow. Add a short 768 local sticky interval only if this evidence shows no blank-scroll, focus, thermal or comprehension regression; otherwise record the decision to remain sequential.
- [ ] Do not claim universal mobile performance from one device. Treat this as the required constrained-device acceptance sample.

### Task 8.3 — verify production budgets and close documentation

- [ ] Run at least 20 repeatable throttled Chromium journeys, compute lab p75 LCP and INP and label them synthetic rather than field data. Require LCP p75 ≤2.5 s and INP p75 ≤200 ms.
- [ ] Re-run `measure:immersive` against the final asset set and attach raw JSON plus summarized results to the acceptance record.
- [ ] Run the entire repository gate: `npm.cmd run validate`, `npm.cmd run test:e2e`, `npm.cmd run test:a11y`, `npm.cmd run verify:static-export`, base-path build/verification and `npm.cmd run measure:immersive`.
- [ ] Update `ARCHITECTURE.md` with only current implementation facts. Record any deviation that changes architecture in governance before merging.
- [ ] Mark the plan `APPROVED / COMPLETED` and move it only after every required PR is human-merged and acceptance passes. If PR7 is omitted, record “optional asset absent; static chapter closes without an empty frame.”
- [ ] Commit: `docs(immersive): record production acceptance`.

---

## Expected affected areas

- Shared brand assets, favicons, font loading and semantic design tokens.
- Shared header/footer and all public page presentation components.
- Exact approved Home and Founder localized content.
- Homepage semantic composition, static artwork and one client enhancement boundary.
- Direct Three.js runtime and optional native Connection media.
- Node content/asset/performance contracts, Playwright matrix and visual baselines.
- Architecture, status, review and plan records.

## Validation summary

Minimum deterministic completion gate:

```powershell
npm.cmd run docs:check
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run verify:static-export
npm.cmd run test:e2e
npm.cmd run test:a11y
npm.cmd run measure:immersive
```

Repeat build, static export verification and representative browser journeys with `NEXT_PUBLIC_BASE_PATH=/Portfolio`. Deterministic green checks do not replace `visual-qa` or the constrained Android record.

## Risks and controls

| Risk | Control |
| --- | --- |
| Mark resembles a generic growth/outdoor/military symbol | G0 optical comparison, wordmark lockup, minimum-size and invalid-use review |
| New identity harms readability | Semantic tokens, contrast tests, limited mono use and five-width visual QA |
| Spectacle displaces the offer | Static-first editorial anchor, one H1, unchanged CTA priority, homepage-only canvas |
| Three.js consumes the entire budget | Isolated dependency PR, dynamic import, working headroom target and hard measurement gate |
| GPU/resource leak | One-shot lifecycle, explicit disposal and repeated traversal checks |
| Compact layout becomes a long scroll trap | Normal-flow chapters at 320/390; sequential default at 768 |
| Generated film looks like client evidence | Manifest, brand-motion default, source/provenance record and human asset approval |
| Failure creates an empty stage | Posters remain mounted; all enhancement failures return quietly to static |
| Typography adds global transfer cost | Three local font files only, primary preload only and recorded byte totals |
| Visual rollout changes product facts | Copy/evidence tests run before and after presentation changes |

## Progress

- [x] RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1 approved.
- [x] Throwaway prototype completed and reviewed.
- [x] RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1 approved.
- [x] ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE recorded.
- [x] This execution plan approved by the repository owner on 2026-09-20.
- [x] G0 Contained Master optical closure approved: Balanced Contained.
- [x] G1 bilingual immersive chapter copy approved: Operational Clarity.
- [ ] PR1 marketing-contract reconciliation merged.
- [ ] PR2 identity foundation merged.
- [ ] PR3 offer/evidence presentation merged.
- [ ] PR4 Studio/Founder/utility presentation merged.
- [ ] PR5 semantic/static C2 homepage merged.
- [ ] PR6 direct Three.js enhancement merged.
- [ ] Optional G2/PR7 disposition recorded.
- [ ] PR8 acceptance record merged and plan completed.

## Important implementation decisions

- Direct Three.js is adopted only in PR6; prototype dependencies are not copied wholesale.
- `next/font/local` is preferred over runtime font fetching or extra font packages so the exact shipped files, subsets and licenses remain reviewable.
- The static C2 experience is a shippable completion point. WebGL and video improve it but do not repair missing meaning.
- The optional Connection film is not on the critical path.
- Synthetic p75 Web Vitals are labeled as lab evidence; analytics and field measurement remain OPEN.

## Deviations discovered during execution

- **PR1 Tasks 1.1-1.2:** the task text assumed the pre-D02 homepage, but MKT-D05 was approved and merged before this plan received implementation approval. Evidence: `PAGE-HOME` and `scripts/homepage-content.test.mjs` define the current seven-section contract, retired standalone audience section, three Problems rows and Projects proof bridge. Disposition: preserve the newer approved contract and do not recreate obsolete content or artificial red-history commits. No RFC or ADR is required.
- **PR1 browser contract:** `tests/e2e/studio-founder.spec.ts` still asserted the former general descriptor after the Node content contract was updated. Evidence: the focused Chromium run failed only on the two old opening strings, then passed 16/16 after updating them to the approved bilingual descriptor. Disposition: include the browser assertion update in PR1. No RFC or ADR is required.
