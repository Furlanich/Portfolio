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
  - REVIEW-ADAPTIVE-IMMERSIVE-HOMEPAGE-ACCEPTANCE-V1
last_verified: 2026-09-23
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

### Task 1.1 — rebase the failing contract onto the merged MKT-D05 structure

- [x] Rebased the original pre-D02 task assumptions onto the later APPROVED MKT-D05 seven-section Home contract already present on `main`.
- [x] Extended `scripts/homepage-content.test.mjs` to protect the exact D02 hero/actions/accountability/availability, the distinct approved HOME-PROBLEMS heading plus D05 introduction, the merged audience and three situation rows, and the D05 demo-only final paragraph with the D02 primary label.
- [x] Ran `node --test scripts/homepage-content.test.mjs`; both locale contracts failed first against the former hero copy.
- [x] Commit: `test(home): capture approved marketing narrative`.

### Task 1.2 — copy the remaining approved D02/D05 wording and preserve the consolidated sequence

- [x] Copied the exact approved Spanish and English D02 hero strings and remaining D05 final-CTA strings into the two route-owned `home.ts` modules.
- [x] Preserved the approved MKT-D05 consolidation: audience meaning stays folded into Problems, Problems has three rows, proof uses the technical-accountability Projects bridge and the retired standalone audience section was not restored.
- [x] Removed the superseded conditional-inquiry `description` field and rendering so the current demo statement is the final CTA's only explanatory paragraph.
- [x] Ran `node --test scripts/homepage-content.test.mjs` and `npm.cmd run typecheck`; both passed.
- [x] Commit: `fix(home): reconcile approved commercial narrative`.

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

- [x] Added tests for both mark variants, stable `viewBox`, no scripts/external resources/raster data/text elements, the exact G0 centerlines and stroke construction, favicon PNG/ICO signatures and dimensions, and both OFL notices.
- [x] Added tests that reject `next/font/google`, Inter fallbacks and unapproved faces or weights. The font test reads each WOFF2 `name`, `OS/2`, `fvar` and `cmap` table, requires every file's SHA-256 in `DESIGN-VISUAL`, and checks every Spanish/English content character against the primary face.
- [x] Added contrast tests for Bone, Azure, Ink, Muted and Tint in every text/control pairing the shared roles use.
- [x] Ran `node --test scripts/brand-assets.test.mjs scripts/design-tokens.test.mjs`; both failed because assets, fonts and tokens did not yet exist.
- [x] Commit: `test(brand): define identity asset and token contracts`.

### Task 2.2 — add the protected master and self-hosted type

- [x] Exported only the G0-approved geometry as stroked polylines with no IDs, classes or motion hooks. Lockup wordmarks are outlined paths, not `<text>`.
- [x] Sourced the font binaries from the official Instrument Sans commit and IBM Plex `@ibm/plex-mono@2.5.0` tag. `DESIGN-VISUAL` records the source, processing and SHA-256 values, and both license texts are retained.
- [x] Configured `app/fonts.ts` with `next/font/local`: Instrument Sans variable (400–700) as `--font-sans`, Plex Mono 400/600 as `--font-mono`, `display: swap`, with only the primary face preloaded.
- [x] Imported the font variables from both locale layouts. The static export emits each of the three files once; only Instrument Sans carries the preload marker.
- [x] Ran the focused tests and a static build.
- [x] Commit: `feat(brand): add protected mark and self-hosted typography`.

### Task 2.3 — migrate semantic tokens and shared chrome

- [x] Replaced the launch values with the approved Bone/Azure/Ink/Muted/Tint roles. Derived surface (`#FFFFFF`) and rule (`#D3D4D2`) roles are recorded with their basis in `DESIGN-VISUAL`.
- [x] Added `font-mono` (`--font-mono`) without applying it yet. Body, actions and navigation stay in Instrument Sans.
- [x] Implemented `BrandSignature` as a decorative 40 px protected mark (inline canonical SVG; see deviation) beside the live 16 px `FURLANICH` wordmark, so the accessible name stays `FURLANICH`.
- [x] Updated Header/Footer/disclosure/language switch without changing route labels, order, demo contract or focus behavior. The app bar keeps the approved Surface role.
- [x] Regenerated favicons from the approved master. 32 px is crisp; 16 px keeps three distinct chevrons with softened edges and needs human confirmation in a real browser tab.
- [x] Ran `node --test scripts/brand-assets.test.mjs scripts/design-tokens.test.mjs scripts/site-header.test.mjs scripts/site-footer.test.mjs`: 22/22 pass.
- [x] Commit: `feat(brand): apply identity foundation to shared chrome`.

### PR2 verification

- [x] `npm.cmd run validate`
- [x] `npm.cmd run test:e2e -- --project=chromium-desktop --project=mobile-chromium` (after the smoke deviation below), plus the 320, tablet, wide and accessibility Chromium projects (330 passed, 40 skipped) and the Firefox, WebKit and mobile WebKit projects (193 passed, 20 skipped), all against a warmed dev server.
- [x] Keyboard-checked brand → language switch → menu or first link at 320/390/1024/1440 in both locales. Escape closes the disclosure and returns focus to its summary.
- [x] Visual QA of the header/footer in both locales at 320/390/1024/1440, reduced motion and a 200% zoom approximation. No horizontal overflow and no console errors.
- [x] Added font transfer: 73,784 bytes total, of which 38,368 bytes are the preloaded primary face.

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

- [x] Added browser assertions first for unchanged H2 order, service-index names, CTA destinations, one explicit link per noninteractive card, sequence labels, a bounded limitations panel, Action-tint endings and short-only Plex Mono (`3a599a5`). The six new cases failed; the existing fifteen passed.
- [x] Captured visual baselines only after the art direction was implemented (`0750a4a`): Services, Projects and the GRS detail at 1440 and 390 px. Windows baselines were captured locally; Linux baselines were adopted from PR #67's Ubuntu CI actuals after owner approval.
- [x] Replaced the alternating bordered-panel and left-rule rhythm with ink-ruled numbered sections and ruled label/content rows. The Projects evidence cards and the limitations panel keep their real boundaries.
- [x] Used Plex Mono only for two-digit sequence labels and project metadata; the browser contract caps mono text at 64 characters.
- [x] Kept project imagery, labels and permissions unchanged. MPC stays Founder-only, the Lab item stays secondary and every limitation remains visible.
- [x] Verified both locales at 320/390/768/1024/1440 on Services, Projects and all project details, including long titles and detail endings. There is no horizontal overflow at any size.
- [x] Committed implementation as `feat(services): apply precision assembly presentation` (`6a880ee`) and `feat(projects): apply evidence-led editorial presentation` (`464eefe`).

### PR3 verification

- [x] `node --test scripts/commercial-primitives.test.mjs scripts/services-content.test.mjs scripts/projects-publication.test.mjs scripts/project-details.test.mjs`
- [x] `npx.cmd playwright test tests/e2e/marketing-services.spec.ts tests/e2e/marketing-projects.spec.ts`
- [x] `npm.cmd run validate`
- [x] Visual QA at 320, 390, 768, 1024 and 1440 px: cards, proof labels, media crops, CTA prominence and endings.

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

- [x] Strengthened behavior assertions before the presentation changes (`21e2c67`): exact Studio and Founder H2 order, Studio sequence labels, the Founder section H2 scale and mono periods, Contact field-boundary contrast, fallback order, notice-before-fields and keyboard-only completion. The existing specs already cover the descriptor, employer title, CV/GitHub/LinkedIn destinations, zero transmission and Privacy content. Six cases failed first: Studio markers were missing, Founder H2s rendered at 30px and field boundaries measured 1.49:1.
- [x] Applied editorial variation without changing facts or hiding biography or limits: numbered Studio sections, unnumbered Founder history, and a ruled Contact form area.
- [x] Kept Studio as the operating model and Founder as professional background. MPC remains educational group work only.
- [x] Kept Contact frictionless and visibly demonstrative, with no transport, storage, analytics or consent added. The existing approved response expectation is unchanged (see deviation).
- [x] Preserved field labels, errors, live regions, textarea resizing, first-invalid focus and local reset; the existing Contact suite passes unchanged.
- [x] Added no additional brand-geometry motif. The header and footer signature already carry the mark, and repeating it inside the pages did not improve hierarchy.
- [x] Committed by page family: `feat(studio-founder): apply founder-led editorial presentation` (`080c4a1`) and `feat(contact): apply identity presentation without changing demo behavior` (`327d062`).

### PR4 verification

- [x] `node --test scripts/studio-content.test.mjs scripts/contact-content.test.mjs scripts/contact-state.test.mjs scripts/privacy-content.test.mjs`
- [x] `npx.cmd playwright test tests/e2e/studio-founder.spec.ts tests/e2e/studio-founder-responsive.spec.ts tests/e2e/contact.spec.ts tests/e2e/privacy.spec.ts`
- [x] `npm.cmd run test:a11y` (16/16)
- [x] `npm.cmd run validate`
- [x] Visual QA of Studio, Founder, Contact and Privacy in both locales at 320/390/768/1024/1440, plus a 200% zoom approximation on Contact and Founder, with no horizontal overflow. Keyboard-only Contact completion is automated; the no-JavaScript Contact fallback remains covered by the existing spec.

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

- [x] Added failing tests for the exact approved G1 copy, fixed chapter order and IDs, unique headings, the media manifest and the four static artwork files.
- [x] Required every manifest entry to be `brand-motion`, locale-neutral, decorative, without evidence claims and within budget. The first poster budget is 150 KiB (actual: 2,258 bytes). Posters must be text-free and must not reuse the protected mark geometry.
- [x] Extended static-export verification to require every chapter heading and description, in order and before Problems, plus all four poster URLs. The former blanket homepage `<img>` prohibition is replaced by "only the four decorative posters, each with `alt=""`". Verified in root and `/Portfolio` builds.
- [x] Ran the focused tests and confirmed red: content, manifest and export verification all failed.
- [x] Commit: `test(home): define adaptive instrument static contract` (`39b839a`).

### Task 5.2 — render the semantic document first

- [x] Integrated the approved hero proposition and actions into `ImmersiveEditorialAnchor`, keeping one H1 and the existing CTA destinations.
- [x] Rendered four document chapters in source order, each with visible sequence, phase status, heading and description, and an 800×1000 static poster.
- [x] Kept the artwork decorative (`alt=""`), since the adjacent HTML carries the full meaning. No image repeats a text name.
- [x] Used the protected mark beside the instrument label in the editorial area; the chapter artwork uses the separate derived slab geometry.
- [x] Kept the six approved homepage sections and anchors after the sequence.
- [x] Ran the content, static-export and type tests.
- [x] Commit: `feat(home): add semantic adaptive instrument sequence` (`a23acfb`).

### Task 5.3 — implement width-specific static choreography

- [x] At 1440, composed the editorial anchor, the static phase spine and a continuous 4:5 stage without JavaScript.
- [x] At 1024, kept two zones and visually hid the phase status for fewer simultaneous labels.
- [x] At 768, used sequential copy and artwork with no sticky behavior.
- [x] At 390, presented four normal-flow chapters with inline 1:1 artwork and no pinning.
- [x] At 320, condensed the instrument label and status, keeping headings and full-width actions.
- [x] At 200% zoom (720 CSS px) the page collapses to sequential flow. `responsive.spec.ts` fails if any poster overlays chapter copy at the mobile, tablet, wide and 320 projects.
- [x] Created ten deterministic reduced-motion baselines (both locales × five widths), stable over two reruns.
- [x] Commit: `feat(home): compose static instrument across five widths` (`1ee3186`).

### PR5 verification

- [x] `node --test scripts/homepage-content.test.mjs scripts/immersive-media-manifest.test.mjs`
- [x] `npx.cmd playwright test tests/e2e/immersive-home-static.spec.ts tests/e2e/responsive.spec.ts`
- [x] `npm.cmd run build`
- [x] `npm.cmd run verify:static-export`
- [x] Repeated the build, export verification and homepage/smoke browser suites with `NEXT_PUBLIC_BASE_PATH=/Portfolio` (25/25); posters resolve under `/Portfolio/brand/immersive/`.
- [x] Disabled JavaScript: both locales keep the complete chapter sequence, links and loaded posters (automated).
- [x] Visual QA of the initial viewport, chapter progression, handoff into Problems and ending at 1440/1024/768/390/320.

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

- [x] Added table-driven tests for clamped progress, exact chapter boundaries, the per-chapter composition, deterministic forward/reverse mapping, progress recalculated from chapter geometry after resize, material-change detection, static-mode precedence (reduced motion, Save-Data, missing WebGL, lost context, off-viewport) and the DPR/detail caps.
- [x] Ran `node --test scripts/immersive-home-state.test.mjs`; it failed because the modules were missing.
- [x] Implemented only the pure state and capability functions; 8/8 green.
- [x] Commits: `test(immersive): define capability and state model` (`51ddfed`) then `feat(immersive): implement reversible state mapping` (`61f58b8`).

### Task 6.2 — implement one-shot activation and explicit lifecycle

- [x] Installed `three@0.186.0` and `@types/three@0.186.0` exactly, the ADR evidence version; no other prototype dependency.
- [x] The canvas is created only after the page-load, near-viewport and capability gates pass. Posters stay mounted beneath it and are hidden only after the first frame.
- [x] DPR is capped at 1.5 wide and 1.25 compact (also 1.25 when there are four or fewer cores); signal count drops with width and capability.
- [x] Initialization is attempted once. Import and renderer failures dispose everything, remove the canvas and keep the posters.
- [x] `webglcontextlost` does not call `preventDefault` (the scene is never restored); it disposes and removes the runtime and sets a session flag (module variable plus `sessionStorage`). There is no retry.
- [x] Unmount cancels queued frames, disconnects observers and listeners, disposes geometry, materials and the renderer, and removes the canvas. There is no media to pause.
- [x] The canvas is `aria-hidden`, has `tabindex="-1"` and `pointer-events: none`.
- [x] Commit: `feat(immersive): add demand-rendered three runtime with scroll and pause` (`0d28169`), covering Tasks 6.2 and 6.3 (see deviation).

### Task 6.3 — connect scroll and Pause motion without changing layout

- [x] Native scroll (Framer Motion `useScroll`) maps to the four states, and a frame renders only on a material change.
- [x] Resize and orientation changes recompute the chapter from the current document geometry without replaying from Recognition (automated 1440 → 390 → 1024).
- [x] `PauseMotionControl` is an ordinary HTML button beside the instrument status, rendered only while the enhancement is active. Its label states the next action (`Pausar/Reanudar movimiento`), it exposes `data-state`, and it has the standard visible focus ring.
- [x] Pause freezes the rendered chapter; Resume recalculates from the current document position.
- [x] Reduced motion never requests the runtime or creates a canvas.
- [x] Landed in the same commit as Task 6.2 (see deviation).

### Task 6.4 — automate failures and budgets

- [x] Playwright covers forward and reverse chapters, Pause/Resume, resize, reduced motion, Save-Data, missing WebGL, renderer failure after the capability probe, failed runtime import, context loss and no JavaScript. It uses init-script and request-interception seams, with no public test modes.
- [x] Chromium coverage runs both locales at 1440/1024/768/390/320 in the new SwiftShader `immersive-chromium` project; the Firefox and WebKit smoke checks content, either mode and absence of errors.
- [x] `measure:immersive` builds, serves `out/` and drives SwiftShader Chromium. It reports incremental JS against the recorded `main` Home baseline, poster bytes, activation marks, rAF p95, activation and interaction long tasks, CLS, playing videos, and canvas/listener counts across 20 traversals and 5 remounts.
- [x] It fails on >120 KiB Brotli, headroom below the accepted exception, a poster over 150 KiB, frame p95 over 20 ms, an interaction task of 50 ms or more, nonzero CLS, more than one playing video, more than one canvas or listener growth.
- [x] Headroom: measured at 6.0 KiB, below the 15 KiB working target. Work stopped and returned to the repository owner, who accepted the build (see deviation).
- [x] Commit: `test(immersive): cover failures and production budgets` (`139ba8f`).

### PR6 verification

- [x] `npm.cmd run validate` (140/140 Node tests)
- [x] `npm.cmd run test:e2e` (all projects, warmed server): everything passed except one known cold-cache dev-server flake on `/en/work/the-system/`, which passed on rerun.
- [x] `npm.cmd run verify:static-export`
- [x] `npm.cmd run measure:immersive`: 114.0 KiB incremental (106.7 KiB lazy runtime), 2.2 KiB first poster, 725 ms to first frame, 16.8 ms rAF p95, no interaction long task, one 50 ms activation task, CLS 0, no video, 1 canvas and stable listeners (380 → 381) after 20 traversals and 5 remounts.
- [x] Repeated the build, static verification and the immersive suite (20/20) under `/Portfolio`.
- [x] CDP heap and listener metrics after forced GC: 15 remount cycles plateau (344 → 345) exactly like pages without the instrument; one canvas throughout.
- [x] Visual QA: slab meaning per chapter, stage and copy hierarchy, reversibility, the spine next to the stage, and the handoff into Problems at 1440 and 390.

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

**Disposition (2026-09-23):** omitted. No Connection film was produced or reviewed, and the repository owner moved from PR6 directly to PR8. Optional asset absent; static chapter closes without an empty frame. The unchecked items above stay unexecuted, and the film's asset decisions remain OPEN for a later governed PR.

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

- [x] Both locales: initial viewport, four chapters forward and reverse, resize/orientation, handoff into Problems, final page CTA. `tests/e2e/immersive-home-acceptance.spec.ts` in `immersive-chromium`.
- [x] Widths: 320×800, 390×844, 768×1024, 1024×768 and 1440×900.
- [x] Modes: normal, reduced motion, Save-Data, no JavaScript, unsupported WebGL, initialization failure, context loss and absent video (no film exists; see the G2 disposition).
- [ ] Input/accessibility: keyboard only, Pause/Resume, visible focus, 200% zoom, source order, color-independent state and representative axe scan pass. **OPEN:** the real screen-reader spot check needs the owner; the agent checked the enhanced accessibility tree only.
- [x] Deployment: root and `/Portfolio`; static export; direct entry and language switch; no console errors, missing assets or broken fragments. The complete suite ran against both served exports (see PR8 verification).

### Task 8.2 — record constrained Android evidence

**OPEN — owner action.** No Android device or `adb` bridge was available to the agent. The [acceptance record](../../reviews/adaptive-immersive-homepage-acceptance-v1/index.md) holds the fields to complete.

- [ ] Use one named lower/mid-range Android device and current Chrome. Record model, OS, browser, memory class, viewport, DPR, network profile and whether battery saver is active.
- [ ] Cold-load each locale, traverse forward/reverse 20 times, rotate during Connection, background/foreground the tab and leave it idle for five minutes.
- [ ] Record activation, first-frame, frame interval p95, long tasks, memory trend, thermal observation, video decoder count, input responsiveness and any quality reduction.
- [x] Default 768 and compact layouts to sequential flow. Add a short 768 local sticky interval only if this evidence shows no blank-scroll, focus, thermal or comprehension regression; otherwise record the decision to remain sequential. Recorded: sequential retained in v1; reconsider only with the Android evidence.
- [ ] Do not claim universal mobile performance from one device. Treat this as the required constrained-device acceptance sample.

### Task 8.3 — verify production budgets and close documentation

- [x] Run at least 20 repeatable throttled Chromium journeys, compute lab p75 LCP and INP and label them synthetic rather than field data. Require LCP p75 ≤2.5 s and INP p75 ≤200 ms. `measure:home-vitals`: 20 mobile and 20 desktop journeys; LCP p75 1,700/440 ms and INP p75 40/24 ms.
- [x] Re-run `measure:immersive` against the final asset set and attach raw JSON plus summarized results to the acceptance record.
- [x] Run the entire repository gate: `npm.cmd run validate`, `npm.cmd run test:e2e`, `npm.cmd run test:a11y`, `npm.cmd run verify:static-export`, base-path build/verification and `npm.cmd run measure:immersive`.
- [x] Update `ARCHITECTURE.md` with only current implementation facts. Record any deviation that changes architecture in governance before merging. No deviation changes architecture.
- [ ] Mark the plan `APPROVED / COMPLETED` and move it only after every required PR is human-merged and acceptance passes. If PR7 is omitted, record “optional asset absent; static chapter closes without an empty frame.”
- [x] Commit: `docs(immersive): record production acceptance`.

### PR8 verification

- [x] `npm.cmd run validate`: documentation check, 140/140 Node tests, lint, typecheck and build.
- [x] `npm.cmd run test:e2e` (dev server warmed first; a cold start exceeded the 120 s `webServer` timeout once): 748 passed, 80 skipped by project, 0 failed.
- [x] `npm.cmd run test:a11y`: 16/16.
- [x] Complete Playwright suite against the root export: 730 passed, 18 failed, 80 skipped by project. All 18 are the Contact zero-transmission case (see deviations).
- [x] Complete Playwright suite against the `/Portfolio` export: 728 passed, the same 18 failures, and two Firefox `browserContext.close` protocol errors that passed on rerun (4/4).
- [x] `immersive-chromium` against both exports: 41/41 each.
- [x] `npm.cmd run verify:static-export` at both base paths: 20 routes each.
- [x] `npm.cmd run measure:immersive`: 114.0 KiB incremental (106.7 KiB lazy runtime), 2.21 KiB first poster, 744 ms to first frame, 16.7 ms rAF p95, no interaction long task, CLS 0, no video, 1 canvas and listeners 380 → 381.
- [x] Firefox 155 and WebKit 26.6 activate WebGL on both Home routes with one canvas and no page error.
- [x] Visual QA of both locales at the five widths with WebGL active; one minor OPEN observation (compact Pause control over the sculpture).
- [ ] Constrained Android evidence and the real screen-reader spot check (owner).

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
- [x] PR1 marketing-contract reconciliation merged ([PR #65](https://github.com/Furlanich/Portfolio/pull/65)).
- [x] PR2 identity foundation merged ([PR #66](https://github.com/Furlanich/Portfolio/pull/66)).
- [x] PR3 offer/evidence presentation merged ([PR #67](https://github.com/Furlanich/Portfolio/pull/67); baselines in [PR #68](https://github.com/Furlanich/Portfolio/pull/68)).
- [x] PR4 Studio/Founder/utility presentation merged ([PR #69](https://github.com/Furlanich/Portfolio/pull/69)).
- [x] PR5 semantic/static C2 homepage merged ([PR #71](https://github.com/Furlanich/Portfolio/pull/71)).
- [x] PR6 direct Three.js enhancement merged ([PR #72](https://github.com/Furlanich/Portfolio/pull/72)).
- [x] Optional G2/PR7 disposition recorded: omitted, no film.
- [ ] PR8 acceptance record merged and plan completed.

## Important implementation decisions

- Direct Three.js is adopted only in PR6; prototype dependencies are not copied wholesale.
- `next/font/local` is preferred over runtime font fetching or extra font packages so the exact shipped files, subsets and licenses remain reviewable.
- The static C2 experience is a shippable completion point. WebGL and video improve it but do not repair missing meaning.
- The optional Connection film is not on the critical path.
- Synthetic p75 Web Vitals are labeled as lab evidence; analytics and field measurement remain OPEN.

## Deviations discovered during execution

- **PR1 Tasks 1.1-1.2:** the task text assumed the pre-D02 homepage, but MKT-D05 was approved and merged before this plan received implementation approval. Evidence: `PAGE-HOME` defines the current seven-section contract, retired standalone audience section, three Problems rows and Projects proof bridge while D02 still owns the approved hero/action wording. Disposition: preserve the newer D05 structure, reconcile the remaining D02/D05 copy through a real red/green contract pair and do not restore obsolete sections. The first review caught and corrected an overbroad initial disposition that had treated all Home copy as already complete. No RFC or ADR is required.
- **PR1 browser contract:** `tests/e2e/studio-founder.spec.ts` still asserted the former general descriptor after the Node content contract was updated. Evidence: the focused Chromium run failed only on the two old opening strings, then passed 16/16 after updating them to the approved bilingual descriptor. Disposition: include the browser assertion update in PR1. No RFC or ADR is required.
- **PR2 smoke contract:** `tests/e2e/smoke.spec.ts` still expected the former Problems heading after PR1 moved that wording to the introduction. Evidence: `PAGE-HOME` and `scripts/homepage-content.test.mjs` both require `Cuando lo manual empieza a frenar el negocio` / `When manual work starts holding the business back`; only the two Chromium smoke cases failed. Disposition: correct the browser expectation in a separate PR2 commit. No RFC or ADR is required.
- **PR2 semantic roles:** the existing `foundation-*` role names are used across 57 components that PR3–PR5 will migrate. Disposition: keep the role names, map their values onto `identity` in `tailwind.config.ts`, and use Ink for `action-strong` rather than introduce an unapproved darker azure. Surface and rule roles are derived and recorded in `DESIGN-VISUAL`. No RFC or ADR is required.
- **PR2 chrome ground:** the approved Global app bar baseline specifies the Surface role, and VISUAL-IDENTITY-V1 does not supersede it. Disposition: header, compact panel, language switch and footer stay on Surface (`#FFFFFF`) while page grounds move to Bone. Any move of the chrome to Bone belongs to a later design decision.
- **PR2 chrome mark rendering:** the task names an image-backed mark, but `verify:static-export` counts every page image to protect the image-free indexes, the single conceptual project visual and the no-portrait Founder rule. An image element in the header and footer broke six of those contracts. Disposition: render the chrome mark as an inline, decorative SVG whose centerlines and stroke construction are asserted equal to the protected master, and leave the export gate unchanged. `public/brand/` remains the canonical file set. No RFC or ADR is required.
- **PR2 font processing:** Instrument publishes no Latin-only variable WOFF2. Disposition: pin `wdth` to 100, keep `wght` 400–700 and subset the official variable WOFF2 to Latin with fontTools; lockup outlines use the official static Bold TTF as an unshipped build input. Both inputs are hash-recorded in `DESIGN-VISUAL`.
- **PR2 visual baselines, found in PR3:** PR2 changed fonts and palette site-wide, but its verification did not run `visual-chromium`. The six Studio/Founder baselines therefore fail on `main` (PR #66 CI `browser`), while all functional browser projects passed. Disposition: on 2026-09-23 the repository owner approved refreshing them in PR3 to the PR2 identity already on `main`. The Linux baselines are the stable Ubuntu CI actuals from PR #67 run `35872633919` (first attempt and retry identical); the Windows baselines were regenerated locally. PR4 replaces them again after its own redesign.
- **PR3 primitive scope:** VIS-R1.4 already removed cards from Services, so `CommercialContentCard` and `equal-height-card-grid` are used only by the homepage Services group, which PR5 owns. Disposition: only `CommercialSectionHeading` gains an optional sequence label; the other two primitives are unchanged. No RFC or ADR is required.
- **PR3 Projects endings:** the Projects index and details ended on a full-azure band, contrary to PROJECTS-EXPERIENCE ("Existing Action-tint inquiry CTA") and VIS-R1.8. Disposition: both return to the Action-tint band used by Services, inside the page container.
- **PR3 metadata repetition:** The-System's context value restates its maturity ("Laboratorio FURLANICH · …"). Disposition: the metadata renderer splits values on ` · ` and shows adjacent duplicates once. The content record is unchanged.
- **PR4 Contact response expectation:** the plan says not to add a response promise, but the existing Contact introduction already shows the APPROVED `CONTACT-RESPONSE-EXPECTATION` ("Respuesta habitual dentro del mismo día hábil…"). The MKT-D03 proposal to omit it in demonstration mode was REJECTED. Disposition: PR4 adds nothing and leaves the approved copy unchanged. Whether a response expectation belongs on a demo-only form remains a product question for its owner.
- **PR4 visual baselines:** Windows Studio/Founder baselines were regenerated locally. The Linux ones are PR #69's Ubuntu CI actuals (run `35885447081`; first attempt and retry identical), adopted with the repository owner's approval on 2026-09-23. That CI run otherwise passed 667 tests with only these six baseline failures.
- **PR4 Founder numbering:** Studio sections are numbered like Services, but Founder is a professional history, where sequence labels would imply a process. Disposition: Founder uses Ink rules and the section H2 scale without numbering; mono is reserved for periods and education status metadata.
- **PR4 documentation regression, found in PR5:** the PR4 script that recorded Studio/Founder conventions in DESIGN-VISUAL dropped everything after its insertion point, deleting the approved Prototype verdict and IMMERSIVE-HOME-V1.1 sections from `main`. Disposition: restored verbatim from `cf5ffbc` in [PR #70](https://github.com/Furlanich/Portfolio/pull/70), on which PR5 builds; no other file was affected.
- **PR5 files outside the list:** `tests/e2e/smoke.spec.ts` pinned seven `<section>` elements, the six-H2 list and zero homepage images, all of which the approved sequence changes. It now expects the hero plus six sections, the four chapter H2s before Problems, and only the four decorative posters. `playwright.config.ts` registers `immersive-home-static.spec.ts` on chromium-desktop, since that project lists its specs explicitly. `app/(es)/page.tsx` and `app/(en)/en/page.tsx` drop the unused `paths` prop. No RFC or ADR is required.
- **PR5 hero migration:** `HomeHero` rendered the route path as screen-reader-only text (`<span class="sr-only">/</span>`), which no requirement asked for. Disposition: removed with `HomeHero`; the anchor keeps every approved string and destination.
- **PR5 wide stage:** from 1024px the Recognition poster is rendered once as the stage beside the anchor, and once inside chapter 01 for narrower widths (hidden at 1024px and wider). Both are decorative and share one URL, so there is one request and no duplicated accessible name. The export gate therefore allows five homepage images drawn from the four approved posters.
- **PR5 poster art and baselines:** the derived-slab poster art direction closes the plan's OPEN "final poster artwork" for the static posters; the repository owner approved it on 2026-09-23. The ten Linux homepage baselines are PR #71's Ubuntu CI actuals (run `35897239752`), adopted with owner approval. That run otherwise passed 691 tests.
- **PR5 pause control:** the G1 pause and resume labels are stored in the route content, but no control is rendered because the static sequence has no motion. PR6 renders it together with the WebGL enhancement.
- **PR6 JavaScript budget:** direct Three.js cannot reach the 15 KiB working headroom. The approved build measures 114.0 KiB Brotli (106.7 KiB of it the lazy Three.js runtime, whose `WebGLRenderer` core is the floor; tree-shaking already removes loaders, animation and geometry libraries). Replacing Framer Motion's scroll hooks would reach only 108.8 KiB and would amend the ADR. Work stopped as the plan requires. On 2026-09-23 the repository owner accepted a 114 KiB build with about 6 KiB headroom under the unchanged 120 KiB ADR ceiling. `measure:immersive` enforces that exception, and any further homepage JavaScript needs a new budget decision.
- **PR6 measurement definitions:** incremental JS is Home's total Brotli JavaScript (HTML-referenced chunks plus the lazy runtime) minus the recorded `main` Home baseline (158,093 bytes at `ff6eadf`). Comparing against a sibling route over-counts shared code that moves between chunks. The ADR gate is an *interaction* task under 50 ms; activation tasks are reported separately (one 50 ms task under SwiftShader after `compileAsync`) and are not gated.
- **PR6 commits and files:** Tasks 6.2 and 6.3 share one commit because scroll mapping and the pause control live in the same client boundary. Files outside the list: `PauseMotionControl` is shared by both layouts; `tests/e2e/immersive-home-smoke.spec.ts` carries the Firefox/WebKit smoke; `playwright.config.ts` adds the `immersive-chromium` project (SwiftShader flags) because headless Chromium otherwise has no WebGL; `tests/e2e/immersive-home-static.spec.ts` pins reduced motion so it keeps testing the static composition. The overlay is positioned without a React portal because `@types/react-dom` is not a dependency and the plan allows only `three`/`@types/three`.
- **PR8 files outside the list:** `tests/e2e/immersive-home-acceptance.spec.ts` (registered on `immersive-chromium` in `playwright.config.ts`), `scripts/measure-home-web-vitals.mjs` with the `measure:home-vitals` script, the raw JSON beside the acceptance record, and a `docs/testing/strategy.md` row for the two measurements. The plan requires the lab LCP/INP journeys but names no tool for them. No RFC or ADR is required.
- **PR8 lab vitals model:** Chrome's CDP throttling does not delay the navigation document, so `measure:home-vitals` charges it one Lighthouse applied request latency plus transfer time at the lab server. A stricter trial that also charged three handshake round trips measured mobile LCP p75 at 2,892 ms. That double-counts connection setup the applied latency already includes; it is recorded so the mobile margin is not overstated.
- **PR8 Contact zero-transmission case against a production export:** `contact.spec.ts` counts every `fetch` as a possible inquiry transmission. Against a served export, Next's same-origin route prefetches are fetches, so the case fails in every project although no inquiry value leaves the page; under the dev-server harness it passes. Disposition: not changed in PR8. The Contact harness should exclude router prefetches or assert on inquiry values in a separate PR.
- **PR8 Windows export layout:** a local Windows build writes router segment prefetches as nested directories, while the client and the Linux-built GitHub Pages deployment use dotted file names (200 on the deployed site). Local Windows previews therefore 404 those prefetches. Disposition: production is unaffected; `measure-home-web-vitals.mjs` maps the names locally.
- **Observed, pre-existing e2e harness flake:** on a cold `.next/dev` cache, parallel workers that first request a `[projectSlug]` detail route can receive `SyntaxError: Unexpected end of JSON input` from the dev server, and `marketing-navigation.spec.ts` then finds no header links. It reproduces on `origin/main` without PR2 and passes against a warmed server. Disposition: not changed in PR2. A later harness task should warm routes before the suite or run e2e against the static export.
- **Observed for PR4, pre-existing:** Contact inputs use the decorative rule role for their boundary (1.38:1 on white after PR2; 1.30:1 before). WCAG 1.4.11 expects 3:1 for control boundaries, so PR4 should give fields a compliant boundary rather than reuse the rule. **Resolved in PR4:** fields now use the Muted role (6.12:1), enforced by `tests/e2e/contact.spec.ts`.
