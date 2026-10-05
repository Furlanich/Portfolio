---
id: PLAN-SKY-CHART-HOME-REDESIGN-V2
type: execution-plan
status: APPROVED
plan_status: COMPLETED
related:
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - ADR-STATIC-LOCALIZED-ROUTING
  - PAGE-HOME
  - PROJECT-EVIDENCE
  - GOV-ENGINEERING-LIFECYCLE
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
  - TEST-VISUAL-REGRESSION
  - PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1
  - REVIEW-ADAPTIVE-IMMERSIVE-HOMEPAGE-ACCEPTANCE-V1
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - REVIEW-SKY-CHART-ACCEPTANCE-V2
last_verified: 2026-10-05
---

# Sky Chart Home and App Bar redesign — implementation plan v2

> **APPROVED / COMPLETED — 2026-10-05, with manual QA DEFERRED.** Tasks 1–11 are merged, and Task 12 (the documentation synchronization that moves this plan to `completed/`) completes the plan when the owner merges its PR. Checkpoints W0–W3 are green and recorded in Progress. Every section 14 gate that automation can measure is within limits. The section 26 manual protocol (browsers, real devices, screen readers, preferences, content truth and the side-by-side design check) has **not been performed**, and the two hardware-GPU gates (scroll frame interval p95 and the interaction task) are not yet measured on hardware. The [acceptance record](../../reviews/sky-chart-acceptance-v2/index.md) lists each of those items as DEFERRED, never as PASS, with a checklist the owner fills in. Nothing in this move changes application behavior. *Updated 2026-10-05, after checkpoint W4: Tasks 1–12 are merged, and the W4 follow-up (the Founder atlas plate, the acceptance record APPROVED and the comment fixes) completes on the owner's merge. Checkpoints W0–W4 are green and recorded in Progress. The [acceptance record](../../reviews/sky-chart-acceptance-v2/index.md) is APPROVED (owner, 2026-10-05) with its deferrals. Criterion 1 of section 29 is met; the hardware-GPU gates and the manual parts remain DEFERRED, as the record's definition-of-done table states.*

> **Status at approval, 2026-09-24: APPROVED.** Gate G1 was passed when the repository owner approved and merged [`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](../../rfcs/sky-chart-visual-system-v2.md) as Governance PR #77 (merge commit `70168e9`) on 2026-09-24. This Task 2 / PR 2 records the accepted decision in [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](../../decisions/sky-chart-homepage-runtime.md) and the approved `DESIGN-VISUAL`/`DESIGN-IX-A11Y`/`PAGE-HOME` sections, and sets this document's `status` to APPROVED. Implementation Wave 1 (Tasks 3, 4, 5) unlocks once this PR merges and checkpoint W0 (section 25) passes.

## 1. Plan metadata

| Field | Value |
| --- | --- |
| Plan ID | `PLAN-SKY-CHART-HOME-REDESIGN-V2` |
| Direction record | [`REVIEW-SKY-CHART-DIRECTION-2026-09-23`](../../reviews/sky-chart-direction-2026-09-23/index.md) |
| Normative visual reference | `docs/reviews/sky-chart-direction-2026-09-23/reference/sky-chart-reference.html` plus the numeric specification in sections 6 and 9–12 |
| Author | Planning session, Claude Opus 5.5, 2026-09-23 |
| Implementing providers | GPT-6 Luna and Claude Sonnet 5, assigned per task in section 18 |
| Orchestrator | The planning or harness session that dispatches tasks, owns this file's Progress section and runs the integration procedure in section 24 |
| Human authority | Repository owner: approves the RFC (G1), reviews and merges every PR, approves visual baselines |
| Branch model | One `codex/sky-chart-<task>` branch and one isolated worktree per task, based on the integration head named in its wave |
| Canonical gate | `npm run validate` (docs, Node tests, lint, typecheck, build), plus the task's listed Playwright projects and `npm run verify:static-export` |
| Scope | Home (`/` and `/en/`) and the global App Bar on every localized route |
| Stack boundary | Next.js 16 static export, React 18, Tailwind 3, Framer Motion 11, direct `three@0.186.0`. No new runtime dependency. |

## 2. Approved design direction

The owner chose **Direction A · Sky Chart** on 2026-09-23. C · Deployable Sheet's personalization applies to sections such as “When work is spread across tools”, and semi-transparent cards are preferred wherever they stay legible and original.

The resolved world is **a navigator's star atlas.**

- **Environment:** a full-viewport celestial sphere sits behind Home's content through the hero and the four chapters. Its named stars are FURLANICH's approved process vocabulary, and as the visitor scrolls they are revealed and joined into constellations. After the chapters the environment recedes to a dim ground.
- **Atlas plate:** a dark translucent surface with registration corner ticks and a plate number. It carries chapters, Services, Proof, Process and Founder.
- **Plotting sheet:** a translucent bone vellum with a plotting grid, a bearing label and a corner crease line. It carries Problems and the illustrative Position fix section. Problems uses a stepped three-sheet cascade, Direction C's gesture translated into navigation vocabulary. Each sheet has a “cocked hat” glyph: three bearings that fail to meet at one point.
- **Dawn:** the final CTA band moves from night to Bone, which returns the brand's canonical ground.
- **App Bar:** a floating “chart header” in atlas-plate material on every page. On Home it starts transparent and prints the current section as a mono readout.

## 3. Repository baseline

Facts verified on `main` at `36ab1bf`:

- **Routes and export:** the routes are fixed by [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md): Spanish at the root, English under `/en/`, trailing slashes, the optional `/Portfolio` base path, static export and GitHub Pages. `CommercialHomepage` composes `ImmersiveHomeSequence` followed by `HomeProblems`, `HomeServices`, `HomeProof`, `HomeProcess`, `HomeFounder` and `HomeCta`.
- **Immersive runtime** (per [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../../decisions/adaptive-immersive-homepage.md)): `components/homepage/immersive/ImmersiveEnhancement.tsx` is Home's only client boundary. It passes these gates in order: reduced motion, Save-Data, WebGL2, the session context-loss flag, near-viewport, then `load`. It then dynamically imports `runtime/create-instrument-scene.ts` and renders on demand from `lib/immersive-home/state.ts`. The fallback is four chapter posters in `public/brand/immersive/`, with a Pause control.
- **Tokens:** `tailwind.config.ts` exposes `identity` and `foundation` roles. Legacy `brand/ink/paper` scales are still used by four `components/core` primitives. Contrast is enforced by `scripts/design-tokens.test.mjs`.
- **App Bar:** `components/foundation/SiteHeader.tsx` is a sticky server component on a white Surface. Below 1024px, `NavigationDisclosure.tsx` provides a native `<details>` menu. `BrandSignature.tsx` renders the inline protected mark.
- **Tests:**
  - 34 `node --test` suites under `scripts/`.
  - Playwright projects in `playwright.config.ts`: three desktop engines; mobile Chromium and WebKit; 1024, 1440, 768 and 320 profiles; `accessibility-chromium`; `immersive-chromium` (SwiftShader); `visual-chromium`.
  - `scripts/verify-static-export.mjs`, which pins Home's chapter text, section order and poster files.
  - `measure:immersive` and `measure:home-vitals`.
- **Visual baselines** are element screenshots of `main` or `[data-instrument]`, per platform. Windows baselines are captured locally. Linux baselines are adopted from Ubuntu CI `actual` artifacts after owner approval, because Docker/WSL is unavailable on the owner's machine (precedent: PR #67).
- **Deferred items from the previous plan:** constrained-Android evidence, a real screen-reader spot check and the compact Pause-control placement. This plan closes all three (Tasks 7 and 11).
- **Prerequisite — resolved:** the canonical gate was red on `36ab1bf` (vendored-skill front matter from `f43938f`, and a stale Claude Code worktree scanned by the docs validator). The owner merged the fix as PR #76 (`d324e83`: “skip Claude Code worktree checkouts”, “integrity-lock vendored design Skills”). `npm run docs:check` and `npm run skills:check` now pass on `main`.
- **Figma mirror (Gate F) — completed 2026-09-23:** [FURLANICH · Sky Chart v2](https://www.figma.com/design/V6FD6Sq3gqqxeMw5Si7Dnx). Pages:
  - Foundations: 23 colour variables, 15 layout variables, 11 text styles.
  - Components: Button set, bone-on-azure mark tile, active star, three cocked-hat glyphs, Atlas plate, Plotting sheet, Pause pill, App bar set (Docked, Home top, Compact), compact menu panel.
  - Home: `Home · 1440 · EN` and `Home · 390 · ES`.

  The account is on the Figma Starter plan (about 20 MCP calls per month), so later Figma updates should be batched.

## 4. Goals

1. Replace the framed two-zone instrument with a full-viewport environmental Three.js layer behind Home's content, with textual process nodes.
2. Introduce two coherent translucent materials (atlas plate, plotting sheet), a validated environmental palette, and a larger display type scale on Home.
3. Personalize each Home section inside one world: plotting-sheet cascade for Problems, catalogue plates for Services, a Position fix figure, a log plate for Proof, an ecliptic for Process, and a dawn CTA.
4. Add one honest, illustrative business-impact visualization with no invented evidence.
5. Redesign the App Bar on every route as a floating chart header, with contextual docking on Home, active-location indication and an unchanged no-JS disclosure.
6. Preserve or improve semantics, keyboard use, contrast, motion preferences, static export, SEO text and performance budgets.

## 5. Non-goals

- Restyling Services, Projects, Studio, Founder, Contact or Privacy content. They receive only the new App Bar.
- A site-wide dark theme, theme switcher, CMS, backend, hosting change, React-major migration, React Three Fiber, Drei, GSAP, post-processing or any new npm dependency.
- The Connection film (still omitted), video, audio or generated imagery.
- Real client metrics, testimonials or case studies.
- Changing approved copy other than the additions listed in Appendix A.
- Changing routes, fragments (`#proceso`, `#process`, `#services`, `#problems`), the Contact demonstration or evidence rules.

## 6. Design decisions

These decisions are normative. Where the reference prototype and this section differ, this section wins.

**D-01 Layer model (Home only).** From back to front:

| z-index | Layer | Element |
| ---: | --- | --- |
| −3 | Environment ground | `EnvironmentGround` fixed layer: a radial gradient, plus the static poster when WebGL is not active |
| −2 | WebGL canvas | Fixed, full viewport, portaled to `document.body` |
| −1 | Contrast scrim | Fixed gradient |
| auto | Content | Transparent sections, plates, sheets |
| 50 | App Bar | Sticky |

No ancestor of the fixed layers may create a stacking context (no `transform`, `filter`, `opacity < 1`, `isolation` or positioned `z-index`) above `body`.

**D-02 Ground gradient.** `radial-gradient(120% 90% at 70% 10%, #0E2B4A 0%, #0A1E33 38%, #06121F 78%)`. The dawn CTA and the footer are opaque Bone and cover it.

**D-03 Scrim.**

- ≥768px: `linear-gradient(90deg, rgba(6,18,31,.78) 0%, rgba(6,18,31,.5) 34%, rgba(6,18,31,0) 62%)`.
- <768px: `linear-gradient(180deg, rgba(6,18,31,0) 0%, rgba(6,18,31,.55) 45%, rgba(6,18,31,.82) 100%)`.
- The scrim's opacity follows the canvas recede factor (D-24).

**D-04 Palette tokens.** These are added by Task 3. Measured contrast is recorded in the review and must be asserted by tests.

| Token | Value | Allowed use |
| --- | --- | --- |
| `sky.abyss` | `#06121F` | Ground vignette |
| `sky.deep` | `#0A1E33` | Primary ground |
| `sky.field` | `#0F2A45` | Raised ground |
| `sky.haze` | `#17385A` | Atmosphere only; never under text below 18.66px bold or 24px regular |
| `sky.lit` | `#6FA8E0` | Links, kickers and active lines on dark (≥4.5:1 on abyss, deep and field) |
| `sky.glow` | `#9CC4EC` | Focus ring and active glyph on dark |
| `sky.text-2` | `#B9C3CC` | Secondary text on dark and on atlas plates |
| `sky.mist` | `#8FA3B6` | Metadata on **opaque** dark only |
| `sky.plate` | `rgba(10,30,51,.74)` | Atlas plate fill |
| `sky.plate-line` | `rgba(249,246,238,.13)` | Atlas plate border and rules |
| `sky.sheet` | `rgba(249,246,238,.9)` | Plotting sheet fill |
| `sky.sheet-line` | `rgba(9,36,61,.12)` | Plotting sheet border |
| `sky.sheet-grid` | `rgba(0,69,137,.07)` | Plotting grid lines |
| `chart.context-dark` / `chart.signal-dark` | `#5E7185` / `#9CC4EC` | Chart pair on dark |
| `chart.context-light` / `chart.signal-light` | `#8FA3B6` / `#004589` | Chart pair on sheets; direct labels are mandatory |

Two rules apply to every pairing:

- Brand Azure `#004589` and Bone `#F9F6EE` keep their approved roles. Azure is never text on a `sky.*` ground.
- Primary actions stay Azure with Bone text (8.79:1). The hover state is `#0A55A3`.

**D-05 Atlas plate (`AtlasPlate`).**

- Fill `sky.plate` with `backdrop-filter: blur(14px) saturate(120%)`, a 1px `sky.plate-line` border and an 18px radius.
- Padding `clamp(24px, 3vw, 40px)`.
- Shadow `inset 0 1px 0 rgba(249,246,238,.06), 0 30px 60px -30px rgba(0,0,0,.6)`.
- Registration ticks: 14px corner brackets, top-left and bottom-right, 1px `rgba(156,196,236,.55)`, inset 10px.
- Optional plate number: top 18px, right 22px, mono 12px `sky.mist`, `aria-hidden`.
- Variant `blur={false}` sets fill `rgba(10,30,51,.88)` with no backdrop filter.
- Text on plates uses Bone for headings and `sky.text-2` for body. A plate is never interactive: no hover, cursor or focus.

**D-06 Plotting sheet (`PlottingSheet`).**

- Fill: `sky.sheet` under two `repeating-linear-gradient` grids (0° and 90°, 1px `sky.sheet-grid` every 24px).
- `backdrop-filter: blur(10px) saturate(110%)`, 1px `sky.sheet-line` border, 6px radius.
- Padding `clamp(22px, 2.6vw, 34px)`.
- Shadow `0 28px 60px -34px rgba(0,0,0,.75)`.
- Corner crease: a 56×56px top-right diagonal hairline, `linear-gradient(225deg, transparent 49.3%, rgba(0,69,137,.45) 50%, transparent 50.9%)`.
- Optional bearing label: top 10px, right 46px, mono 12px Azure, `aria-hidden`.
- Text is Ink for primary and Muted `#526473` for secondary. Focus inside a sheet uses the Ink ring.

**D-07 Material fallbacks** apply to both materials:

- `@supports not (backdrop-filter: blur(1px))`: plate fill `rgba(10,30,51,.92)`, sheet fill `rgba(249,246,238,.96)`.
- `@media (prefers-reduced-transparency: reduce)`: opaque plate `#0D243C`, opaque sheet `#F9F6EE`.
- `@media (forced-colors: active)`: `border: 1px solid CanvasText`, with no background images.

**D-08 Blur budget.** No viewport may intersect more than three content surfaces that use `backdrop-filter`; the App Bar is excluded. Process step plates therefore use `blur={false}`. *Amended 2026-10-04 (owner decision E1, see Deviations; recorded in DESIGN-VISUAL by Task 12):* the gate is **per section**. At each section (a viewport aligned to, and centred on, that section) at most three content surfaces use `backdrop-filter`. A half-viewport sweep between sections is informational only, with a regression cap of 5; it records brief overshoots (4 at 768 and 1440 in production) while a viewport straddles two sections.

**D-09 Typography.** The families (Instrument Sans, IBM Plex Mono) and the 64-character mono limit are unchanged. New Tailwind `fontSize` tokens:

| Token | Value |
| --- | --- |
| `display-1` | `clamp(44px, 7.2vw, 96px)` / 0.98 / −0.025em / 700 |
| `display-2` | `clamp(32px, 4.2vw, 56px)` / 1.04 / −0.02em / 700 |
| `display-3` | `clamp(28px, 3vw, 40px)` / 1.1 / −0.015em / 700 |
| `lead` | `clamp(18px, 1.6vw, 21px)` / 1.55 |
| `body-lg` | 19px / 1.6 |
| `label` | 12px mono, 0.08em tracking, uppercase |

Headings use `text-wrap: balance`. Greek Bayer letters and degree labels use mono without the uppercase transform. *(Amended by E5, 2026-10-04: the Bayer letters now use a serif Greek stack, see D-13. The degree labels are unchanged.)*

**D-10 Spacing.**

- Home section padding-block: `clamp(72px, 10vw, 140px)`.
- Chapter gap: 34vh at ≥1024, 28vh at 768–1023, 22vh below 768. Chapter span padding-block: `10vh 30vh`.
- Container and gutters: 1200px, 20/32/48px (unchanged).
- `--app-bar-height: 84px` (48px CTA + 2×8px inner padding + 2×10px outer padding). `scroll-padding-top: 96px`. *Clarified 2026-10-04 (Task 11, PR #92; recorded by Task 12):* `header[data-app-bar]` is exactly `--app-bar-height` (84px) tall at every width, set with `h-[var(--app-bar-height)]`, so the hero pulled up by that value meets the header's top edge. The bar surface inside it is 66px tall at ≥1024 and 62px below. Before this fix the header's layout box was 86px (≥1024) or 82px (below), and the hero sat 2px off.

**D-11 Hero.**

- Pulled under the App Bar with `margin-top: calc(-1 * var(--app-bar-height))`.
- `min-height: 100svh`, content bottom-aligned (`align-content: end`).
- Padding-block: `calc(var(--app-bar-height) + 36px) 72px`.
- Source order: coordinate line (mono `label`, `sky.lit`: the approved eyebrow, then `34°36'S · 58°22'W` with `aria-hidden`; the minute sign is the ASCII apostrophe U+0027, see Deviations), then H1 (`display-1`, max 13ch of Instrument Sans Bold, set as `8.866em`, Bone), lede (`lead`, `sky.text-2`, max 46ch of Instrument Sans Regular, set as `30.636em`), actions (primary then ghost, 12px gap, 32px top), trust row (40px top, 20px padding-top, 1px `sky.plate-line` top rule, 14px `sky.text-2`, trust line then availability, 28px gap).
- Below 480px the actions are full width.
- Content growth is never clipped; at 200% zoom the hero grows past 100svh.
- *Amended 2026-10-04 (owner decision, extends E2; recorded in DESIGN-VISUAL by Task 12):* the two caps are written in `em`, not `ch`, so the box is the same before and after the web-font swap. `ch` follows the face on screen, and in the fallback face the H1 cap was about 16% narrower. 8.866em and 30.636em are the exact Instrument Sans Bold and Regular equivalents of 13ch and 46ch, so the loaded layout is unchanged.

**D-12 Chapters.**

- A container `div[data-instrument-chapters]` holds, first, the instrument label (mono `label`, `sky.lit`), then four `section[data-instrument-chapter]` elements. Each chapter is an `AtlasPlate` with max width 520px (full width below 768px), left-aligned in the container.
- Inside each plate: plate number `Plate 0N/04` (Appendix A), kicker (chapter verb, mono `sky.lit`), H2 (`display-3`, existing heading IDs kept), description (18px/1.6, `sky.text-2`).
- Chapter posters, `[data-instrument-artwork]` frames and `PhaseSpine` are removed.

**D-13 Problems (plotting-sheet cascade).**

- ≥1024: a 5/7 grid with a 48px gap. The head column is sticky at `top: calc(var(--app-bar-height) + 36px)`.
- The head contains the kicker (the approved `problems.introduction`, mono `sky.lit`), then H2 `problems.heading` (`display-2`, id `problems-heading`), `audienceStatement` (`body-lg`, `sky.text-2`) and the ghost action.
- The cascade is the existing `<ul>` of situations, one `PlottingSheet` per `li`. Each `li` is a 56px glyph column plus a text column with an 18px gap.
- Sheet layout: horizontal offsets 0, 56 and 112px at ≥1024 (0 below); vertical overlap −14px; stacking order increases down the list.
- Contents of each sheet:
  - Bayer letter α, β or γ: mono 15px Azure, no uppercase, `aria-hidden`. *Amended 2026-10-04 (owner decision E5, see Deviations; recorded in DESIGN-VISUAL by Task 12):* the letters are set in a serif Greek stack, `Georgia, 'Times New Roman', 'Noto Serif', serif`, at 17px, Azure, no uppercase, `aria-hidden`. The Plex Mono subset has no Greek, so a mono declaration only ever rendered a fallback glyph.
  - Situation text: 19–23px (`clamp(19px, 1.7vw, 23px)`), Ink.
  - Bearing label 042°, 117° or 236°: `aria-hidden`.
  - Cocked-hat glyph: `aria-hidden` SVG using the path data in Appendix C.

**D-14 Services (catalogue plates).**

- ≥1024: a 7/5 grid with a 20px gap. The lead plate spans two rows, has a minimum height of 420px and bottom-aligns its content.
- Each plate: plate number `Cat. S·0N` (`aria-hidden`), category kicker (Appendix A), H3 (lead plate `clamp(28px, 3.2vw, 44px)`, others `clamp(22px, 2.2vw, 30px)`, 32px top margin), description (16px/1.6).
- Below 1024: a single column.
- The ghost action follows the grid.

**D-15 Position fix (new HOME-IMPACT section, between Services and Proof).**

- ≥1024: a 7/5 grid. The left `PlottingSheet` holds `PositionFixFigure`; the right `PlottingSheet` holds `ImpactCounts`. Below 1024 they stack.
- The section id is `impact` in both locales, heading id `impact-heading`.
- Details are in section 12.

**D-16 Proof (log plate).**

- ≥1024: a 7/5 grid with `align-items: end`. The left column has the kicker, H2 (existing), introduction and ghost action. The right column is an `AtlasPlate` with plate number `Log` and a `<ul>` of three log lines.
- Each log line is a 9ch mono `sky.lit` term column plus text, with 1px `sky.plate-line` top rules and mono 13px/1.5 `sky.text-2`.
- The list has an accessible name (Appendix A).

**D-17 Process (ecliptic).**

- Kicker, then H2 (existing id, `display-2`).
- ≥1024: a decorative SVG arc above the steps: path `M20 140 C 300 -20, 700 -20, 980 140`, `viewBox 0 0 1000 160`, `preserveAspectRatio="none"`, stroke `rgba(156,196,236,.45)`, dash `2 6`, `aria-hidden`.
- Steps stay an `<ol>` of four `AtlasPlate blur={false}` items with 24px padding. At ≥1024 they sit in four columns with top offsets 96, 36, 36 and 96px. Below 1024 they form one column with a 1px `rgba(156,196,236,.35)` left rule and 24px left padding.
- The quality statement follows (max 68ch, `sky.text-2`), then the primary action.

**D-18 Founder.** An 8/4 grid at ≥1024: kicker, H2 (existing) and biography, then the ghost action aligned to the end.

**D-19 Dawn CTA.**

- Background `linear-gradient(180deg, rgba(249,246,238,0) 0, #F9F6EE 200px)`, padding-top 220px, bottom 120px.
- H2 Ink, `demoStatement` Muted.
- Primary action (Azure) plus a ghost-on-light action (Azure border and text, Tint hover). The Ink focus ring applies.
- The footer is unchanged.

**D-20 Actions.**

- Primary: min-height 48px, radius 10px, Azure fill, Bone text, `inset 0 1px 0 rgba(249,246,238,.18)`, hover `#0A55A3`.
- Ghost on dark: 1px `rgba(156,196,236,.5)` border, Bone text, hover `rgba(111,168,224,.12)`.
- Hover changes colour only, over 160ms. There is no scale or translate; the approved rule stands and Emil Kowalski's press-scale recommendation is recorded as not adopted.

**D-21 Focus.** Dark contexts: `outline: 3px solid #9CC4EC; outline-offset: 3px`. Bone or sheet contexts: `outline: 3px solid #09243D`.

**D-22 App Bar** (every route).

- **Structure:** `div#site-top` is kept. `header[data-app-bar]` is sticky with `top: 0`, `z-index: 50`, 10px/12px outer padding, in normal flow. *Clarified 2026-10-04 (see D-10):* its layout box is exactly `--app-bar-height` (84px) at every width, with the 66px (≥1024) or 62px bar surface top-aligned inside it.
- **Inner container:** max 1200px, flex, 16px gap, padding `8px 8px 8px 16px`, radius 14px, 1px border.
- **Docked state** (the default, and the only state without JS): fill `rgba(10,30,51,.82)`, `backdrop-filter: blur(16px) saturate(125%)`, border `sky.plate-line`. Without backdrop-filter support the fill is `.94`.
- **Home undocked state:** only after JavaScript sets `data-docked="false"` while `scrollY ≤ 24`. The fill is transparent and the border transparent. Background and border transition over 240ms with `--ease-out`.
- **Brand:** `BrandSignature variant="on-dark"`, a 32px Azure tile (radius 7px) with the Bone protected mark at 22px (the approved bone-on-azure variant) and a Bone 16px/700/0.08em wordmark.
- **Readout** (Home only, ≥1024, `aria-hidden`): mono 12px `sky.lit`, 14px left padding with a `sky.plate-line` left rule, min width 18ch. Text is `{NN} · {name}`, taken from the `data-readout` of the last section whose top is above 40% of the viewport.
- **Links** (≥1024): 14px/600 `sky.text-2`, Bone on hover, 44px targets. The active link is Bone with a 7px four-point star `clip-path: polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)` in `sky.glow`, centred 4px from the bottom.
- **Language switch:** mono 12px, 1px `sky.plate-line` border, radius 8px, 44px.
- **CTA:** the primary action at 48px.
- **Below 1024:** brand, language switch and a 44×44 menu `<summary>` with a Bone icon. The panel keeps the approved centring and width `min(calc(100vw - 40px), 24rem)`, fill `rgba(10,30,51,.96)` without blur, radius 14px, padding 8px, 4px gap, 44px links and a full-width 48px CTA. It opens and closes instantly (no animation) and Escape behaviour is unchanged.
- **Active state:** a route link gets `aria-current="page"` when the normalized pathname matches. On Home, the Process link gets `aria-current="location"` while `#proceso` or `#process` crosses the 40% line.
- **Never:** hide, translate or auto-collapse on scroll.

**D-23 Environment static poster.** Locale-neutral WebP stills of the resolved scene state: graticule, field stars and all links, with **no labels**. Two sizes:

| File | Size | Budget |
| --- | --- | --- |
| `public/brand/sky-chart/environment-wide.webp` | 1920×1080 | ≤150 KiB |
| `public/brand/sky-chart/environment-compact.webp` | 900×1600 | ≤80 KiB |

They are shown by `EnvironmentGround` with `background-size: cover` and `background-position: 70% 30%` whenever `[data-immersive-mode="static"]`. This covers no JS, reduced motion, Save-Data, missing WebGL, failure and context loss.

**D-24 Recede.**

- `k = clamp((0.55·vh − chaptersBottom) / (0.5·vh), 0, 1)`.
- Canvas and scrim opacity: `1 − 0.84k`. Label opacity multiplier: `max(0, 1 − 2k)`.
- Rendering is suspended while `k = 1`, and the Pause control is hidden with the `hidden` attribute while `chaptersBottom < 0.3·vh`.

**D-25 Pause control** (closes the deferred placement item). It is fixed at `right: 16px; bottom: calc(16px + env(safe-area-inset-bottom))` at every width, inside a plate-material pill. The phase readout `Plate 0N of 04` shows at ≥768px only. The button is 44px high, uses `aria-pressed`, and swaps its Pause/Resume label.

Visibility: the pill is shown only while the chapter span is in view. It gets the `hidden` attribute while the hero's bottom edge is below 60% of the viewport, and again under the D-24 recede rule. At 390px the Figma mirror showed the pill covering the hero trust row. Hiding it during the hero never removes a focusable control while motion is visible: the canvas shows no chapter motion before Chapter 1.

**D-26 Copy.** Only the strings in Appendix A are new. Every other string is existing approved content.

**D-27 Compact hero label mask.** Below 768px, tier-2 input labels, their dots and their links render with opacity 0 while the hero's bottom edge is below 60% of the viewport. They follow the normal reveal once the hero has scrolled past that line. At ≥768px the D-03 left scrim already separates labels from hero text, so no mask applies. This rule comes from the Gate F mirror: at 390px, *Pedidos* and *Reservas* collided with the H1 and lede. It is implemented in `frameForProgress` (Task 4) as `inputOpacity × heroMask`, with `heroMask = width < 768 ? clamp((0.6·vh − heroBottom) / (0.2·vh), 0, 1) : 1`.

## 7. Technical decisions

- **T-01** No new dependencies. `package.json` and `package-lock.json` are locked (L-01).
- **T-02** Scene labels use `THREE.CanvasTexture` sprites. SDF text libraries, `TextGeometry` and DOM-projected labels are rejected (bundle, fonts, per-frame layout).
- **T-03** Before label textures are built, the runtime awaits `document.fonts.load('600 30px "<Plex family>"')` and `document.fonts.load('500 24px "<Instrument family>"')`. It uses the `next/font` CSS variable family names, read with `getComputedStyle(document.documentElement).getPropertyValue('--font-mono' | '--font-sans')`. If loading fails, labels still render in the fallback face and the failure is not surfaced to the user.
- **T-04** The canvas is created once by `ImmersiveEnhancement` after the existing gates, and portaled to `document.body` through `createPortal`. It is fixed and `aria-hidden`, with `tabIndex=-1` and `pointer-events: none`.
- **T-05** Progress keeps `progressFromChapterRects` from `lib/immersive-home/state.ts`. Scroll input keeps Framer Motion `useScroll` or `useMotionValueEvent` (ADR boundary retained).
- **T-06** Rendering is demand-driven. Each rAF moves `t += (target − t) × 0.12`, snaps when `|Δ| < 0.0005`, then stops. There is no idle loop, and no rendering while paused or fully receded.
- **T-07** DPR is capped at 1.5 on wide and 1.25 on compact or constrained devices (as today). Field stars: 520 wide, 260 compact, 160 when compact and constrained.
- **T-08** `EnvironmentGround` and the scrim are server-rendered and part of the static document.
- **T-09** `AppBarBehavior` is a `'use client'` leaf that renders `null` and binds to `closest('[data-app-bar]')`. `SiteHeader` stays a server component (the existing test is kept).
- **T-10** `PositionFixFigure` is server-rendered as two small-multiple figures. The `'use client'` leaf `PositionFixToggle` upgrades it to one figure with a segmented control.
- **T-11** Visual baselines: Windows baselines are captured locally. Linux baselines are adopted from the PR's Ubuntu CI `actual` artifact only after the owner approves in the PR. Snapshots are never updated just to make CI green ([`TEST-VISUAL-REGRESSION`](../../testing/visual-regression.md)).
- **T-12** Directory names stay: `components/homepage/immersive/` and `lib/immersive-home/`. “Sky Chart” is the design name, not a path rename.

## 8. Architecture impact

- **Superseded by a new ADR (Task 2):** `ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`'s C2 composition coupling, the four-poster fallback and the framed canvas stage. The new ADR (working id `ADR-SKY-CHART-HOMEPAGE-RUNTIME`) keeps its gates, budgets, direct Three.js, the Framer Motion boundary, demand rendering, one-shot initialization and session context-loss handling. It adds: the full-viewport fixed canvas portal, sprite text labels, recede and suspend, and the locale-neutral poster pair. It also records two removals: the derived Azure chevron sculpture is no longer part of the scene, and the permission for one optional Connection film is withdrawn. All budgets are retained, including the main-thread interaction task <50 ms.
- **Unchanged:** routing, static export, localization, content ownership (`app/**/_content/*.ts`), the Contact demonstration, evidence publication.
- **New client leaves:** `AppBarBehavior` (every route) and `PositionFixToggle` (Home). `ImmersiveEnhancement` stays Home's only WebGL boundary.

## 9. Design-system changes

| Area | Change | Owner |
| --- | --- | --- |
| Color | `sky.*` and `chart.*` tokens (D-04) in `tailwind.config.ts`, mirrored as CSS custom properties `--sky-*` in `app/globals.css` | Task 3 |
| Motion | `--ease-out: cubic-bezier(.23,1,.32,1)`, `--dur-1: 120ms`, `--dur-2: 160ms`, `--dur-3: 240ms` | Task 3 |
| Layout | `--app-bar-height: 84px`, `scroll-padding-top: 96px` | Task 3 |
| Type | D-09 `fontSize` tokens | Task 3 |
| Surfaces | `components/surfaces/AtlasPlate.tsx`, `PlottingSheet.tsx`, `surfaces.module.css` | Task 3 |
| Brand | `BrandSignature` `variant="on-dark"` | Task 6 |
| Graph primitives | `lib/impact/position-fix.ts` geometry, `PositionFixFigure`, `ImpactCounts` | Task 5 |
| Navigation | App Bar materials and states (D-22) | Task 6 |

Legacy `brand/ink/paper` scales are untouched (still consumed by `components/core`).

## 10. Three.js architecture

- **Module layout:**
  - `components/homepage/immersive/runtime/create-sky-chart-scene.ts` (factory)
  - `sky-chart-geometry.ts` (graticule, field stars, link segments)
  - `sky-chart-labels.ts` (CanvasTexture sprite builder)
  - `dispose-sky-chart-scene.ts`
  - The old `create-instrument-scene.ts`, `instrument-*.ts` and `dispose-instrument-scene.ts` are deleted in Task 7.
- **Handle interface:**

  ```ts
  type SkyChartSceneHandle = {
    canvas: HTMLCanvasElement;
    prepare(): Promise<void>;
    resize(w: number, h: number): void;
    render(frame: SkyChartFrame): void;
    setLabelOpacity(multiplier: number): void;
    dispose(): void;
  };
  ```

- **Scene contents:**
  - Camera at the origin inside a sphere of R = 40. FOV 55° at ≥1024, 70° below.
  - Graticule: meridians every 15°, parallels −60° to 60° every 15°, radius 42, `#6FA8E0` at opacity 0.07.
  - Field stars: seeded LCG (seed 7, multiplier 16807, modulus 2147483647), radius 44, `PointsMaterial` size 1.4, `sizeAttenuation: false`, `#B9C3CC` at 0.55.
- **Named nodes:** 20 nodes from Appendix B. Position is `dir(yaw, pitch) × 40`, with `dir(y, p) = (cos p·sin y, sin p, −cos p·cos y)`.
- **Label textures:** a 64px-high canvas, width = text width + 56.
  - Tier 1: `600 30px` Plex Mono, uppercase via `toLocaleUpperCase(locale)`, Bone, an 8px dot and a 14px ring stroke 2 in `rgba(156,196,236,.8)`, world height 2.1.
  - Tier 2: `500 26px` Instrument Sans, `#9CC4EC`, 5px dot, height 1.7.
  - Tier 3: `500 22px` Instrument Sans, `#B9C3CC`, 5px dot, height 1.7, opacity × 0.8.
  - Sprite `center = (14/w, 0.5)`, `depthWrite: false`, `colorSpace = SRGBColorSpace`.
- **Links:** one `LineSegments`, `#6FA8E0` at opacity 0.75, in this order:
  1. inputs → Understand
  2. each activity → its phase
  3. Understand → Define → Build & review → Hand over

  The draw range is `floor(count × clamp((t − 0.30) / 0.55)) / 2 × 2`.
- **Frame mapping (`SkyChartFrame`, pure, Task 4):** `t` is the progress.
  - `yaw = 34° + 146°·t − (wide ? 18° : 0)`
  - `pitch = 6° + 4°·sin(π·t)`
  - Group reveal: `clamp((t − g + 0.12) / 0.14)`, with g = 0 (inputs), 0.22 (Understand), 0.40 (Define), 0.58 (Build & review), 0.74 (Hand over).
  - Input label opacity: `max(0.9 − 0.4·t, 0.5)`.
  - Tier visibility: all tiers at ≥1024; tiers 1–2 at 360–1023; tier 1 only below 360.
- **Capability gate (amended 2026-09-28):** a software rasterizer (SwiftShader, llvmpipe, softpipe, Microsoft Basic Render Driver), identified from the WebGL2 renderer string, fails the gates like reduced motion does. Only an explicit test-only override bypasses it, for Playwright and `measure:immersive` under SwiftShader. See the Deviations entry of that date.
- **Lifecycle:** create once after the gates, `prepare()` via `compileAsync`, mount, resize, first render, then set `data-immersive-mode="webgl"` (the poster hides). Resize comes from a `ResizeObserver` on `documentElement` and recalculates from the document. Unmount calls `cancelAnimationFrame` and `dispose()`, which disposes every geometry, material and texture, calls `renderer.dispose()` and `forceContextLoss()`, and removes the canvas.
- **Failure paths:** context loss marks the session flag, disposes and reverts to static. An import or initialization error reverts to static quietly.
- **Testing seams:** pure mapping in `lib/immersive-home/state.ts`. DOM hooks: `data-immersive-mode`, `data-rendered-chapter`, `data-sky-chart-canvas`, `data-recede`. The `window.__FURLANICH_SKY_CHART__` debug hook is test-only, gated by `process.env.NODE_ENV !== 'production'`, and exposes `{frame, labelCount, disposeCount}`.

## 11. Animation and motion architecture

| Motion | Trigger | Spec | Reduced motion |
| --- | --- | --- | --- |
| Scene bearing, reveals, links | Scroll (Framer Motion) | Damped 0.12 per frame; stops when settled | Not initialized; static poster |
| Recede | Scroll | Opacity 1 → 0.16 over 0.5vh (canvas and scrim), CSS `transition: opacity 240ms linear` | Instant |
| App Bar dock | `scrollY > 24` (Home) | Background and border, 240ms `--ease-out` | Instant |
| Position fix toggle | Click or keyboard | Layer crossfade opacity plus `blur(2px)`, 240ms `--ease-out` | Instant, no blur |
| Hover | Pointer | Colour only, 160ms | Removed (global rule) |
| Menu panel | `<details>` | None | None |

Content has no entrance animation or scroll reveal. Every animation uses only `opacity`, `filter` or `transform`.

## 12. Business-visualization architecture

- **Geometry (`lib/impact/position-fix.ts`)**, in a 600×300 viewBox:
  - `SOURCES = [whatsapp (70,70), book (300,34), spreadsheet (540,80), email (560,250), call (60,250)]`
  - `MISSES = [(284,150), (318,142), (330,166), (296,178), (276,168)]`. Separate-state line ends extend each miss by 25% beyond the miss point.
  - `EXACT_FIX = (300,160)`
  - `DOUBT = ellipse(304, 160, 44, 30)`
  - `counts = { separate: SOURCES.length, connected: 1 }`
- **`PositionFixFigure` (server):** a `<figure>` containing two SVGs. Separate: `chart.context-light` lines 1.5px, Muted markers, a dashed doubt ellipse and the label “Area of doubt”. Connected: `chart.signal-light` lines to `EXACT_FIX`, an Azure fix marker and ring, and the label “Exact fix”. Each SVG has `role="img"` with a `<title>` and a `<desc>` from content. Below them is a visible `<ul>` of sources with their notes (the text equivalent). Label font size is 12 user units at ≥768 and 24 below, via CSS on `.fixLabel`. *Amended 2026-09-24 (see Deviations):* the in-SVG label size now follows a container-query ladder on the figure's rendered width: 24 / 18 / 15 / 12 user units at 300 / 400 / 500 / 600px. Below 300px each marker instead carries a numeral key (1–5), sized to render at 12px or more, and the visible source list becomes the matching numbered list. Labels stay direct at every width and never render below 12px.
- **`PositionFixToggle` (client):** after hydration it renders a segmented control (`role="group"`, accessible name, two `button`s with `aria-pressed`). It hides the inactive SVG with `hidden`, announces the new state in a polite live region using `announcement`, and adds pointer-only hover tooltips (not focusable; the list is the accessible equivalent). Without JS, both SVGs show stacked.
- **`ImpactCounts` (server):** a title, then two rows. Each row has a label, a decorative bar (`aria-hidden`; width proportional to the count; context-light for separate, signal-light for connected) and the count as text. A caption follows.
- **Honesty rules:** every visual carries a visible “Illustrative scenario” tag. Counts must be computed from `SOURCES`. No percentages, durations, currency or client names. The static-export forbidden patterns stay intact, so no `metric-card`, `case-study` or `testimonial` identifiers are used.

## 13. Accessibility strategy

- The canvas, ground, scrim, glyphs, bearings, plate numbers, readout, arc and Bayer letters are all `aria-hidden`. All meaning stays in HTML in the approved order.
- Heading hierarchy: one H1, chapter H2s, section H2s, H3s inside Services and Process. Landmark count is unchanged.
- Contrast: every text pair in D-04, D-05, D-06 and D-19 is asserted by `scripts/design-tokens.test.mjs`, including worst-case composites (plate over `#9CC4EC`; sheet over `sky.field`).
- Keyboard: tab order is App Bar, hero actions, then the Pause control when present (it comes right after the chapters' last focusable element; the chapters hold none, so it follows the hero actions and precedes the Problems action), Problems action, Services action, Position fix toggle buttons, Proof action, Process action, Founder action, then CTA actions. *Corrected 2026-10-05 (N12, see Deviations):* this sentence first put Pause last, after the CTA actions. D-25 hides Pause once the page has receded, which is always the case by the CTA, so that position was unreachable. Focus is always visible (D-21), and the sticky bar never hides a focused element (scroll-padding-top 96px).
- Motion: `prefers-reduced-motion` initializes no canvas. The Pause control supplements it.
- Transparency and forced colours: D-07.
- Zoom and reflow: 320px with no horizontal scroll, and 200% text zoom with content growth. The hero exceeds 100svh when needed.
- Targets: at least 44px, with 48px for the primary CTA.
- Screen readers: a real NVDA + Firefox check and a VoiceOver iOS spot check (Task 11 manual QA). The previous plan deferred this. *(2026-10-05: not performed. Section 26.3 is the protocol, and the [acceptance record](../../reviews/sky-chart-acceptance-v2/index.md) records it as DEFERRED.)*

## 14. Performance strategy

| Gate | Limit | Measured by |
| --- | --- | --- |
| Incremental immersive JavaScript (runtime chunk plus three) | ≤120 KiB Brotli | `npm run measure:immersive` |
| Client JS added by `AppBarBehavior` and `PositionFixToggle` | ≤6 KiB Brotli combined | Build output comparison against `main` |
| Environment posters | ≤150 KiB wide, ≤80 KiB compact | `scripts/immersive-media-manifest.test.mjs` |
| Canvas DPR | ≤1.5 wide, ≤1.25 compact or constrained | Unit test plus debug hook |
| Draw calls per frame | ≤28 (1 graticule + 1 stars + 1 links + ≤20 sprites + margin) | Debug hook `renderer.info.render.calls` |
| Label textures | ≤20, each ≤1024×64 | Debug hook |
| Scroll frame interval p95 | ≤20 ms | Hardware-accelerated GPU, via the section 26 device protocol or a hardware-GPU runner (amended 2026-09-28); advisory in `measure:immersive` under SwiftShader |
| LCP p75 (synthetic lab) | ≤2.5 s; the LCP element must be the H1 | `measure:home-vitals` |
| INP p75 | ≤200 ms | `measure:home-vitals` |
| Layout shift from the enhancement | 0 | Playwright `PerformanceObserver` |
| Backdrop-filter surfaces per viewport | ≤3 (App Bar excluded) | E2E DOM scan at each section |
| Idle rendering | 0 frames after settle | Debug hook frame counter |
| Main-thread interaction task (retained ADR gate) | <50 ms | Hardware-accelerated GPU, as the frame interval (amended 2026-09-28); advisory in `measure:immersive` under SwiftShader |

*Measurement notes, recorded 2026-10-05 from Task 11 (PR #92). No limit above changes.*

- Draw calls, label textures and idle frames are measured in production at the WebGL API, because the dev-only debug hook is compiled out of production builds.
- The JavaScript gate measures the lazy runtime chunk set (the runtime chunk plus `three`). The whole-page delta against the `ff6eadf` baseline is reported only.
- Layout shift is attributed to the enhancement: shifts after `immersive:import-start`, or from a source inside the canvas, scrim or Pause pill, excluding web-font loading. Whole-page CLS is gated at ≤0.1 in `measure:home-vitals`.
- The backdrop-filter gate applies at each section (D-08, E1). A half-viewport sweep between sections is reported as information only, with a regression cap of 5.
- The two hardware-GPU rows are measured only by the section 26 device protocol. SwiftShader numbers are advisory.

Loading order: HTML and CSS first, then fonts (Instrument preloaded). After `load`, near the viewport and past the gates, `three` and the runtime load in one dynamic chunk. The posters use CSS `background-image` and are not preloaded.

## 15. Testing strategy

| Layer | Tool | Scope |
| --- | --- | --- |
| Pure logic | `node --test` | Frame mapping, recede, tier visibility, vocabulary integrity, position-fix geometry and counts, token contrast, poster budgets |
| Source contracts | `node --test` on source text (existing pattern) | Server/client boundaries, `aria-hidden` on decorations, no forbidden identifiers, no hover styles on plates |
| Content | `scripts/homepage-content.test.mjs` | Appendix A parity (ES/EN keys, placeholders, 64-character mono limit) |
| Static export | `npm run verify:static-export` | Home order including `impact`, required text, posters, no forbidden patterns |
| Browser behaviour | Playwright projects (registered by Task 3) | App Bar, Home sections, the runtime and its fallbacks, keyboard, reduced motion, no JS, WebGL failure, context loss, console errors |
| Accessibility | `@axe-core/playwright` (`accessibility-chromium` plus acceptance) | Home ES/EN with enhancement on and off, App Bar open and closed on three routes |
| Visual | `visual-chromium` (reduced motion) | `[data-instrument]` at 5 widths × 2 locales (Task 8); Home sections `main` at 1440 and 390 × 2 locales (Task 11) |
| Performance | `measure:immersive`, `measure:home-vitals` | Section 14 gates |
| Manual | Section 26 | Real devices and screen readers |

Canvas pixels are never compared: the visual project runs with reduced motion and asserts the static poster state.

## 16. Task dependency DAG

```mermaid
graph TD
  T1[Task 1 Governance RFC] --> G1{G1 owner approval}
  GF[Gate F Figma library - optional] -.-> T2
  G1 --> T2[Task 2 Decision closure]
  T2 --> T3[Task 3 Tokens, surfaces, harness]
  T2 --> T4[Task 4 Content and scene-model contracts]
  T2 --> T5[Task 5 Position-fix visualization]
  T3 --> T6[Task 6 App Bar]
  T3 --> T7[Task 7 Sky-chart runtime]
  T4 --> T7
  T3 --> T8[Task 8 Immersive static composition]
  T4 --> T8
  T3 --> T9[Task 9 Home sections]
  T4 --> T9
  T5 --> T9
  T7 --> T10[Task 10 Environment posters]
  T8 --> T10
  T6 --> T11[Task 11 Integration hardening]
  T9 --> T11
  T10 --> T11
  T11 --> T12[Task 12 Documentation and acceptance]
```

## 17. Execution waves

| Wave | Tasks | Concurrency | Base | Unlock condition |
| --- | --- | --- | --- | --- |
| 0 | Prerequisite (met, PR #76). Gate F (done). Then Task 1, G1 and Task 2. | Sequential | `main` | Task 2 merged |
| 1 | Tasks 3, 4, 5 | Parallel (disjoint) | `main` after Task 2 | All three merged and checkpoint W1 passed |
| 2 | Tasks 6, 7, 8, 9 | Parallel (disjoint) | `main` after W1 | All four merged and checkpoint W2 passed |
| 3 | Task 10, then Task 11 | Sequential | `main` after W2, then after Task 10 | Task 11 merged and checkpoint W3 passed |
| 4 | Task 12 | Single | `main` after W3 | Definition of done |

## 18. Provider assignment matrix

| Task | Provider | Complexity | Justification |
| --- | --- | --- | --- |
| 1 Governance RFC | GPT-6 Luna | Low–moderate | Documentation with a fully specified supersession list (section 21) |
| 2 Decision closure | GPT-6 Luna | Low | Deterministic record updates after human approval |
| 3 Tokens, surfaces, harness | GPT-6 Luna | Moderate | Token and styling work with exact values and contrast tests |
| 4 Content and scene contracts | GPT-6 Luna | Moderate | Typed content plus pure functions with numeric specs |
| 5 Position-fix visualization | GPT-6 Luna | Moderate | Bounded component and geometry with a small client leaf |
| 6 App Bar | Claude Sonnet 5 | High | Global client and server boundary, scroll state, `aria-current` semantics, no-JS parity and baseline refresh across pages |
| 7 Sky-chart runtime | Claude Sonnet 5 | High | Performance-sensitive WebGL lifecycle, portal layering, font-loading races and failure paths |
| 8 Immersive static composition | GPT-6 Luna | Moderate | Specified server layout; Sonnet reviews stacking-context risk |
| 9 Home sections | GPT-6 Luna | Moderate | Server components with precise compositions |
| 10 Environment posters | GPT-6 Luna | Moderate | A scripted capture pipeline with byte budgets |
| 11 Integration hardening | Claude Sonnet 5 | High | Cross-component debugging, the full matrix, performance and a11y regressions after integration |
| 12 Docs and acceptance | GPT-6 Luna | Low | Record synchronization |

## 19. File and ownership matrix

A path is writable only by its owner task, or by the next listed owner after the previous owner has merged. Everything not listed is forbidden to every task.

| Path | Owner(s), in order |
| --- | --- |
| `docs/rfcs/sky-chart-visual-system-v2.md` (new), `docs/rfcs/index.md`, `docs/reviews/sky-chart-direction-2026-09-23/**` | Task 1 |
| `docs/decisions/sky-chart-homepage-runtime.md` (new), `docs/decisions/index.md`, `docs/decisions/adaptive-immersive-homepage.md` (status note only), `docs/design/visual-language.md`, `docs/design/interaction-responsive-accessibility.md`, `docs/product/pages/home.md`, `docs/governance/status-register.md` | Task 2, then Task 12 |
| `docs/plans/active/sky-chart-home-redesign-v2.md`, `docs/plans/index.md` | Task 1 (initial), Task 2 (status), orchestrator (Progress), Task 12 (completion move) |
| `tailwind.config.ts`, `app/globals.css`, `scripts/design-tokens.test.mjs`, `components/surfaces/**` (new), `scripts/surfaces.test.mjs` (new), `playwright.config.ts` | Task 3 |
| `components/homepage/content-types.ts`, `lib/immersive-home/types.ts`, `lib/immersive-home/state.ts`, `lib/immersive-home/sky-chart-model.ts` (new), `app/(es)/_content/home.ts`, `app/(en)/en/_content/home.ts`, `scripts/homepage-content.test.mjs`, `scripts/immersive-home-state.test.mjs`, `scripts/sky-chart-model.test.mjs` (new) | Task 4 |
| `lib/impact/position-fix.ts` (new), `components/homepage/impact/**` (new), `scripts/position-fix.test.mjs` (new) | Task 5 |
| `components/foundation/SiteHeader.tsx`, `components/foundation/NavigationDisclosure.tsx`, `components/foundation/LanguageSwitch.tsx`, `components/foundation/AppBarBehavior.tsx` (new), `components/brand/BrandSignature.tsx`, `scripts/site-header.test.mjs`, `scripts/brand-assets.test.mjs` (BrandSignature assertions only), `tests/e2e/app-bar.spec.ts` (new), `tests/e2e/marketing-navigation.spec.ts`, `tests/e2e/accessibility.spec.ts` (banner assertions only), snapshots under `tests/e2e/visual/{studio,founder,services-projects}.visual.spec.ts-snapshots/` | Task 6 |
| `components/homepage/immersive/runtime/**`, `components/homepage/immersive/ImmersiveEnhancement.tsx`, `components/homepage/immersive/PauseMotionControl.tsx`, `lib/immersive-home/capability.ts`, `scripts/sky-chart-runtime.test.mjs` (new), `tests/e2e/immersive-home.spec.ts`, `tests/e2e/immersive-home-acceptance.spec.ts`, `tests/e2e/immersive-home-smoke.spec.ts` | Task 7 |
| `components/homepage/immersive/ImmersiveHomeSequence.tsx`, `ImmersiveChapter.tsx`, `ImmersiveEditorialAnchor.tsx`, `PhaseSpine.tsx` (delete), `ImmersiveStaticArtwork.tsx` (delete), `EnvironmentGround.tsx` (new), `immersive-home.module.css`, `tests/e2e/immersive-home-static.spec.ts`, `tests/e2e/responsive.spec.ts`, `tests/e2e/visual/immersive-home-static.visual.spec.ts` plus its snapshots, `scripts/verify-static-export.mjs` | Task 8, then Task 10 (`EnvironmentGround.tsx`, `immersive-home.module.css`, `verify-static-export.mjs`), then Task 11 (`verify-static-export.mjs`) |
| `components/homepage/CommercialHomepage.tsx`, `HomeProblems.tsx`, `HomeServices.tsx`, `HomeProof.tsx`, `HomeProcess.tsx`, `HomeFounder.tsx`, `HomeCta.tsx`, `HomeImpact.tsx` (new), `tests/e2e/home-sections.spec.ts` (new), `tests/e2e/smoke.spec.ts` | Task 9 |
| `lib/immersive-home/media-manifest.ts`, `scripts/immersive-media-manifest.test.mjs`, `public/brand/sky-chart/**` (new), `public/brand/immersive/**` (delete), `scripts/render-sky-chart-posters.mjs` (new, dev-only) | Task 10 |
| `tests/e2e/sky-chart-acceptance.spec.ts` (new), `tests/e2e/visual/home-sections.visual.spec.ts` (new) plus snapshots, `scripts/measure-immersive-production.mjs`, `scripts/measure-home-web-vitals.mjs`, `tests/e2e/support/**` | Task 11 |
| `ARCHITECTURE.md`, `docs/architecture/current-system.md`, `docs/index.md`, `docs/reviews/sky-chart-acceptance-v2/**` (new), `docs/plans/completed/sky-chart-home-redesign-v2.md` | Task 12 |

**Always forbidden:** `package.json`, `package-lock.json`, `next.config.js`, `.github/**`, `app/**/layout.tsx` (no changes needed: the header renders from layouts unchanged), all non-Home page components, `data/**`, `public/` outside the paths listed above, and `.agents/**`.

## 20. Exclusive locks

| Lock | Resource | Holder |
| --- | --- | --- |
| L-01 | `package.json`, `package-lock.json` | Nobody (no dependency change) |
| L-02 | `tailwind.config.ts`, `app/globals.css` | Task 3 only; read-only afterwards |
| L-03 | `playwright.config.ts` | Task 3 only. It pre-registers `app-bar.spec.ts`, `home-sections.spec.ts` and `sky-chart-acceptance.spec.ts` (see Task 3). |
| L-04 | `scripts/verify-static-export.mjs` | Task 8, then Task 10, then Task 11, strictly sequential |
| L-05 | `components/homepage/immersive/immersive-home.module.css`, `EnvironmentGround.tsx` | Task 8, then Task 10 |
| L-06 | Home content files and `content-types.ts` | Task 4 only |
| L-07 | Visual baselines | Per-spec owner (Task 6: non-Home specs; Task 8: instrument spec; Task 11: new Home-sections spec) |
| L-08 | This plan file | Orchestrator, except the named status edits |

## 21. Task N / PR N packets

Every packet also inherits these rules:

- `AGENTS.md` and the skills [`frontend-implementation`](../../../.agents/skills/frontend-implementation/SKILL.md), [`test-driven-development`](../../../.agents/skills/test-driven-development/SKILL.md), [`playwright-qa`](../../../.agents/skills/playwright-qa/SKILL.md) (UI tasks), [`verification-before-completion`](../../../.agents/skills/verification-before-completion/SKILL.md) and [`pr-readiness`](../../../.agents/skills/pr-readiness/SKILL.md).
- A task never edits a path it does not own.
- A task never updates a snapshot without owner approval in its PR.
- Every PR body links this plan and its task ID, contains the completion receipt (Appendix D), and ends with the attribution the harness requires.

### Task 1 / PR 1 – Governance RFC for the Sky Chart visual system

- **Objective:** propose the redesign for approval without implementing it.
- **Rationale:** [`GOV-ENGINEERING-LIFECYCLE`](../../governance/engineering-lifecycle.md) classes the change as consequential, and APPROVED records conflict with it.
- **Scope:** create `docs/rfcs/sky-chart-visual-system-v2.md` (`id: RFC-SKY-CHART-VISUAL-SYSTEM-V2`, `status: PROPOSED`) with these sections: Context, Proposal (sections 2 and 6 of this plan, by reference), Supersession list, Runtime changes, New copy (Appendix A by reference), Alternatives (directions B and C with their verdicts), Risks, Decision requested. The supersession list must name each of these as PROPOSED to supersede:
  1. DESIGN-VISUAL “UI gradients, neon and glass remain excluded” (Home and App Bar only; neon remains excluded).
  2. Light-only and no dark theme (Home environment only; not a site theme).
  3. IMMERSIVE-HOME-V1.1 C2 composition, the four posters and the phase spine.
  4. DESIGN-VISUAL and DESIGN-IX-A11Y Global app bar Surface/Border treatment (sticky, normal flow and no-hide are retained).
  5. “Do not force a viewport-height hero” (Home only).
  6. The Home Canvas/Surface section alternation.
  7. The Home card rules for radius and shadow.
  8. The exclusion of “floating telemetry, particle fields” (textual process stars and ≤520 dim field stars are allowed; continuous rotation remains excluded).
  9. The new HOME-IMPACT section.
  10. The commercial homepage section baseline's “Do not introduce gradients, glass effects, decorative shadows, or additional accent colors for these sections”. Home sections use the two materials and the D-02, D-03, D-06 and D-19 gradients; no accent hue outside the D-04 blues is added.
  11. The Home section rhythm (64/80/96px) and the Home type scale (hero H1 and section H2 sizes). D-09 and D-10 replace them on Home only.
  12. The Home grid rules: equal content-driven card tracks and the per-section column counts in DESIGN-VISUAL and DESIGN-IX-A11Y. D-13, D-14 and D-17 replace them on Home.
  13. VISUAL-IDENTITY-V1's “cards remain reserved for genuine comparison, bounded evidence and controls”. On Home, chapters, Proof, Process and Founder use atlas plates.
  14. **The derived Azure sculpture as the scene's identity element** (VISUAL-IDENTITY-V1 Precision Assembly, IMMERSIVE-HOME-V1.1 WebGL enhancement, ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE). The star-atlas scene has no sculpture. The protected mark stays in the App Bar and brand assets. The RFC must ask the owner to accept this removal explicitly.
  15. The Action-tint final CTA band on Home. D-19's dawn band replaces it; other pages keep their Action-tint endings.
  16. The Pause control placed “beside instrument status” and the IMMERSIVE-HOME-V1.1 responsive choreography table. D-25 and the section 10 responsive rules replace them.
  17. The ADR's permission for one optional Connection film, which is withdrawn (section 5). All ADR budgets, including the main-thread interaction task <50 ms, are retained.
  18. PAGE-HOME's approved section order and narrative. `impact` is inserted between Services and Proof.

  The RFC must quote each rule accurately, from the record and section that actually own it. It must also state that the App Bar keeps the approved prohibition on hiding, translating or animating based on scroll direction; the Home dock transition, keyed to scroll position, is the only scroll-linked change. The RFC must not claim that nothing outside the list changes. It must name any further conflict it finds rather than assert completeness.

  Also: add the RFC to `docs/rfcs/index.md`, commit the review folder and this plan, and add the plan under Active in `docs/plans/index.md`.
- **Dependencies:** none. **Wave:** 0.
- **Provider:** GPT-6 Luna. **Complexity:** low–moderate.
- **Skills:** `project-knowledge-maintenance`, `architecture-governance`, `pr-readiness`.
- **Owned paths:** see section 19. **Forbidden:** all code.
- **Locks:** L-08 (initial commit).
- **Expected behaviour:** no runtime change.
- **TDD:** not applicable (documentation). `npm run docs:check` is the gate.
- **RED/GREEN/REFACTOR:** not applicable. Record “documentation-only” in the receipt.
- **Playwright, a11y, responsive, progressive-enhancement, performance:** not applicable.
- **Commands:** `npm run docs:check`, `npm run validate`.
- **Evidence:** the docs-check output, and a link to the reference prototype and screenshots.
- **Documentation impact:** RFC and plan indexes.
- **Reviewer:** Claude Sonnet 5 (supersession completeness), then the owner.
- **Acceptance:** the RFC lists all eighteen supersessions, each with an accurate citation, plus the runtime changes; it makes no blanket completeness claim; validate is green; the owner approves or requests changes (gate G1).
- **Receipt:** Appendix D, with the TDD block marked N/A.

### Gate F – Figma design library (non-PR, optional)

- **Precondition:** the owner signs in to the `plugin:figma:figma` connector with `/mcp`.
- **Owner:** the orchestrator (Claude Opus 5.5), using `figma:figma-use`, `figma:figma-generate-library` and `figma:figma-generate-design`.
- **Output:** a Figma file with variables for D-04, D-09 and D-10; components for the atlas plate, plotting sheet, App Bar (docked, undocked, compact open) and actions; and frames for Home at 1440 and 390 in both locales, built from the reference prototype.
- **Recording:** the file URL goes into the review record through Task 2.
- **Authority:** Figma is a mirror. If it disagrees with this plan, the plan wins. Implementation never waits on Gate F.

### Task 2 / PR 2 – Decision closure: ADR, approved design sections and Home copy

- **Objective:** turn the approved RFC into authoritative records.
- **Rationale:** implementation PRs must trace to APPROVED requirements.
- **Scope:**
  - Create `docs/decisions/sky-chart-homepage-runtime.md` (`id: ADR-SKY-CHART-HOMEPAGE-RUNTIME`, `supersedes: ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`), carrying section 8's retained and added boundaries and section 14's gates.
  - Add a status note to the superseded ADR.
  - Add APPROVED sections `SKY-CHART-V2` to DESIGN-VISUAL (D-01 to D-27) and DESIGN-IX-A11Y (D-22 to D-25 and D-27, plus sections 11 and 13).
  - Add `HOME-IMPACT` and Appendix A's strings to PAGE-HOME, and update its approved section order.
  - In DESIGN-VISUAL and DESIGN-IX-A11Y, mark every rule named anywhere in the supersession list (items 1–8, the item-3 C2 sections, and items 10–16) as superseded by `SKY-CHART-V2` within its stated boundary, keeping the original text as history. In the new ADR, record the sculpture removal and the withdrawn Connection-film permission (items 14 and 17).
  - Update the status register.
  - Set this plan's `status` to APPROVED.
  - Record the Figma URL if Gate F has run.
- **Dependencies:** G1. **Wave:** 0.
- **Provider:** GPT-6 Luna. **Complexity:** low.
- **Skills:** `project-knowledge-maintenance`, `architecture-governance`.
- **Owned paths:** see section 19. **Forbidden:** code. **Locks:** L-08 (status field).
- **TDD, Playwright and other validation:** not applicable (documentation).
- **Commands:** `npm run docs:check`, `npm run validate`.
- **Evidence:** diff summary.
- **Documentation impact:** as scoped.
- **Reviewer:** Claude Sonnet 5, then the owner.
- **Acceptance:** every record links the RFC; no APPROVED text outside the approved scope changes; validate is green.
- **Receipt:** Appendix D with TDD N/A.

### Task 3 / PR 3 – Environmental tokens, surface primitives and test harness registration

- **Objective:** deliver the shared design-system layer and register the future Playwright specs.
- **Rationale:** every Wave 2 task consumes these tokens, surfaces and project registrations, and none of them may touch the locked config.
- **Scope:**
  - D-04 tokens in `tailwind.config.ts` (`sky`, `chart`).
  - D-09 `fontSize` tokens.
  - In `app/globals.css`: `--sky-*` custom properties, motion variables, `--app-bar-height`, `scroll-padding-top: 96px`, and the D-07 media queries as reusable classes. Body colours stay unchanged.
  - `components/surfaces/AtlasPlate.tsx`. Props: `as?: 'article' | 'div' | 'li' | 'section'`, `plateNumber?: string`, `blur?: boolean` (default true), `className?`, `children`.
  - `components/surfaces/PlottingSheet.tsx`. Props: `as?`, `bearing?: string`, `className?`, `children`.
  - `components/surfaces/surfaces.module.css` implementing D-05 to D-08.
  - `playwright.config.ts`:
    - `app-bar.spec.ts` → chromium-desktop, firefox-desktop, webkit-desktop, mobile-chromium, mobile-webkit, tablet-chromium, compact-320-chromium, tablet-portrait-chromium.
    - `home-sections.spec.ts` → chromium-desktop, firefox-desktop, webkit-desktop, mobile-chromium, tablet-chromium, compact-320-chromium.
    - `sky-chart-acceptance.spec.ts` → immersive-chromium.
    - The visual regex already matches.
- **Dependencies:** Task 2. **Wave:** 1.
- **Provider:** GPT-6 Luna. **Complexity:** moderate.
- **Skills:** `frontend-implementation`, `test-driven-development`.
- **Owned paths:** see section 19. **Forbidden:** every component outside `components/surfaces/`. **Locks:** L-02, L-03.
- **Expected behaviour:** no visible change on any page (no consumer yet).
- **RED tests:**
  - `design-tokens.test.mjs` asserts these exact values and minimum ratios, which fail until the tokens exist: `sky.lit` ≥4.5 on abyss, deep and field; Bone ≥7 on `sky.plate` composited over `#9CC4EC`; `sky.text-2` ≥4.5 on that same composite; Ink ≥7 and Muted ≥4.5 on `sky.sheet` composited over `sky.field`; Bone ≥7 on `#0A55A3` *(corrected 2026-10-05 by Task 12, citing the 2026-09-24 Task 3 Deviation: the true ratio is 6.84:1, AA but not 7:1. The test asserts ≥6.5 and records the exact figure; see Deviations)*.
  - `surfaces.test.mjs` asserts: no `'use client'`; decorative spans are `aria-hidden`; no `hover:`, `cursor-pointer` or `onClick`; the D-07 `@supports`, `prefers-reduced-transparency` and `forced-colors` blocks exist; blur is absent when `blur={false}`.
  - A config assertion in `surfaces.test.mjs` checks that the three spec names are registered in the named projects.
- **GREEN:** minimal tokens, CSS and components.
- **REFACTOR:** one source of hex values (a `const sky` object) shared by the Tailwind config and the test.
- **Playwright:** none. Run `npm run test:e2e -- --project=chromium-desktop` to prove no regression.
- **Accessibility, responsive, progressive enhancement:** covered by the contrast assertions and the fallbacks.
- **Performance:** CSS only. Record the CSS size delta.
- **Commands:** `npm test`, `npm run lint`, `npm run typecheck`, `npm run validate`, `npm run verify:static-export`.
- **Evidence:** RED and GREEN test output.
- **Documentation impact:** none (Task 2 already recorded the design).
- **Reviewer:** Claude Sonnet 5.
- **Acceptance:** all tests green, no rendered change, config registrations present.
- **Receipt:** Appendix D.

### Task 4 / PR 4 – Home content and scene-model contracts

- **Objective:** add every approved string and the pure scene model.
- **Rationale:** a single owner for content and pure logic removes collisions in Wave 2.
- **Scope:**
  - Type changes in `components/homepage/content-types.ts`:
    - `HomeProblemsContent`: unchanged.
    - `HomeServicesSectionContent.services` becomes `(HomepageItem & { category: string })[]`, plus `kicker: string`.
    - `HomeProofContent`: add `kicker` and `log: { term: string; text: string }[]` (length 3) and `logLabel: string`.
    - `HomeProcessContent`: add `kicker`.
    - `HomeFounderSectionContent`: add `kicker`.
    - New `HomeImpactContent`, exactly as in section 12 plus Appendix A: `kicker`, `heading`, `introduction`, `illustrativeTag`, `toggle {groupLabel, separateLabel, connectedLabel, announcement}`, `figure {title, separateDescription, connectedDescription, doubtLabel, fixLabel}`, `sources: {id, name, note}[5]`, `connectedNoteTemplate`, `counts {title, separateLabel, connectedLabel, caption}`.
    - `HomePageContent`: add `impact` and `readout: Record<'home'|'problems'|'services'|'impact'|'proof'|'process'|'founder'|'contact', string>`.
  - In `lib/immersive-home/types.ts`: add `SkyChartNodeId` (the 20 ids in Appendix B) and, in `HomeInstrumentContent`, `plateLabel`, `coordinates`, `nodes: Record<SkyChartNodeId, string>` and per-chapter `kicker`. The `statusLabel` value changes per Appendix A.
  - Fill both locale files from Appendix A.
  - `lib/immersive-home/sky-chart-model.ts`: `SKY_CHART_NODES` (Appendix B: id, group, tier, yaw, pitch), `GROUP_REVEAL`, `frameForProgress(t, {wide, width})` returning `{yaw, pitch, groupOpacity, linkFraction, inputOpacity, visibleTiers}`, `recedeFactor(chaptersBottom, vh)`, `labelOpacityMultiplier(k)`.
  - Keep `mapProgressToInstrumentState` and `progressFromChapterRects` unchanged.
- **Dependencies:** Task 2. **Wave:** 1.
- **Provider:** GPT-6 Luna. **Complexity:** moderate.
- **Skills:** `test-driven-development`.
- **Owned paths:** see section 19. **Forbidden:** components. **Locks:** L-06.
- **Expected behaviour:** no rendered change. Existing components ignore the new fields; TypeScript must still compile.
- **RED tests:**
  - `sky-chart-model.test.mjs`: yaw at t = 0 is 16° wide / 34° compact; yaw at t = 1 is 162° wide; `groupOpacity.define` is 0 at t = 0.27 and 1 at t = 0.42; `linkFraction` is 0 at t ≤ 0.30 and 1 at t ≥ 0.85; `recedeFactor` is 0, 0.5 and 1 at bottoms of 0.55vh, 0.30vh and 0.05vh; `visibleTiers` is [1,2,3], [1,2] and [1] at 1440, 768 and 320; there are exactly 20 unique ids; each phase has 3 activities; the D-27 `heroMask` is 0 at width 390 with heroBottom = 0.8vh, 1 at width 390 with heroBottom = 0.4vh, and 1 at width 1440 for any heroBottom.
  - `homepage-content.test.mjs`: ES and EN have identical key sets; `impact.sources` has 5 entries in the fixed id order; the `{current}`, `{source}` and `{state}` placeholders are present in both locales; every mono label is ≤64 characters; no string contains `%`, `x faster` or a currency symbol.
- **GREEN:** minimal implementation.
- **REFACTOR:** derive reveal thresholds from one table.
- **Playwright:** none.
- **Commands:** `npm test`, `npm run typecheck`, `npm run validate`, `npm run verify:static-export`.
- **Evidence:** RED and GREEN output.
- **Documentation impact:** none.
- **Reviewer:** Claude Sonnet 5.
- **Acceptance:** tests green, no rendered diff.
- **Receipt:** Appendix D.

### Task 5 / PR 5 – Position-fix illustrative visualization

- **Objective:** build the section 12 geometry and components, independent of page placement.
- **Rationale:** an isolated, testable graph primitive.
- **Scope:**
  - `lib/impact/position-fix.ts`.
  - `components/homepage/impact/PositionFixFigure.tsx` (server). Its props type is declared locally and is structurally identical to `HomeImpactContent` minus `kicker`, `heading` and `introduction`.
  - `PositionFixToggle.tsx` (client).
  - `ImpactCounts.tsx` (server).
  - `position-fix.module.css`.
- **Dependencies:** Task 2. **Wave:** 1.
- **Provider:** GPT-6 Luna. **Complexity:** moderate.
- **Skills:** `frontend-implementation`, `test-driven-development`, `dataviz`.
- **Owned paths:** see section 19. **Forbidden:** content files and `HomeImpact.tsx`.
- **Expected behaviour:** the components are unused until Task 9.
- **RED tests** in `position-fix.test.mjs`:
  - `counts.separate === SOURCES.length === 5`.
  - Every miss point lies within the doubt ellipse.
  - All connected lines end at `EXACT_FIX`.
  - Every coordinate is inside `0..600 × 0..300` with a 20-unit margin for labels.
  - Source contract: `PositionFixToggle` is the only `'use client'` file; SVGs have `role="img"` with `<title>` and `<desc>`; the toggle buttons use `aria-pressed`; the live region is `aria-live="polite"`; no identifier matches `metric-card|case-study|testimonial`; the chart colours are the D-04 chart tokens.
- **GREEN:** minimal components.
- **REFACTOR:** share line and marker renderers between the two states.
- **Playwright:** deferred to Task 9's `home-sections.spec.ts` (the component needs a page).
- **Accessibility:** a visible source list; no information only in hover.
- **Progressive enhancement:** without JS both states render.
- **Commands:** `npm test`, `npm run lint`, `npm run typecheck`, `npm run validate`.
- **Evidence:** RED and GREEN output, and the dataviz validator output for both chart pairs.
- **Reviewer:** Claude Sonnet 5.
- **Acceptance:** tests green; the validator passes normal-vision and CVD separation.
- **Receipt:** Appendix D.

### Task 6 / PR 6 – App Bar chart header on every route

- **Objective:** implement D-22 on every localized route.
- **Rationale:** global navigation consistency with the Home world.
- **Scope:**
  - Restyle `SiteHeader` to D-22 and keep it a server component.
  - Add `BrandSignature` `variant="on-dark"`; the default variant is unchanged for any other consumer.
  - Restyle the `NavigationDisclosure` panel.
  - Restyle `LanguageSwitch`.
  - Add the `AppBarBehavior` client leaf: Home docking, readout from `[data-readout]`, `aria-current` (page and location), a rAF-throttled passive scroll listener and an IntersectionObserver, with full cleanup on unmount.
- **Dependencies:** Task 3. **Wave:** 2.
- **Provider:** Claude Sonnet 5. **Complexity:** high.
- **Skills:** `frontend-implementation`, `test-driven-development`, `playwright-qa`, `visual-qa`, `emil-design-eng`.
- **Owned paths:** see section 19. **Forbidden:** Home components, content and config. **Locks:** L-07 (non-Home baselines).
- **Expected behaviour:**
  - Docked dark chart header on every route without JS.
  - With JS on Home: transparent at the top, docked after 24px.
  - The readout updates on Home at ≥1024.
  - The correct `aria-current` value applies.
  - The disclosure works with and without JS.
- **RED tests:**
  - `site-header.test.mjs`: `data-app-bar`; no `window` or `document` in `SiteHeader`; `AppBarBehavior` has `'use client'` and returns `null`; `BrandSignature` `on-dark` keeps the canonical polylines and `aria-hidden`; the default rendered state is docked.
  - `app-bar.spec.ts`:
    1. A no-JS context on `/` and `/en/services/` shows the docked background.
    2. On Home, scrollY 0 gives `data-docked="false"` and scrollY 200 gives `"true"`.
    3. Readout text equals `03 · Position fix` when `#impact` crosses 40% (EN, 1440).
    4. The Process link has `aria-current="location"` at `#process`; the Services link has `aria-current="page"` on `/en/services/`.
    5. The compact panel is centred within the viewport with ≥20px gutters at 320 and 390; Escape closes it and focuses the summary.
    6. Targets are ≥44px and the CTA ≥48px.
    7. No horizontal overflow at 320.
    8. The header never translates (its `boundingClientRect.top` stays constant while scrolling).
    9. No console errors.
- **GREEN:** as scoped.
- **REFACTOR:** extract the normalized-path helper (base path and trailing slash) into `AppBarBehavior` with a unit test.
- **Playwright:** all projects registered for `app-bar.spec.ts`, plus `marketing-navigation.spec.ts` updated for the new styles without weakening assertions.
- **Accessibility:** axe on `/`, `/en/services/` and `/contacto/` with the menu open and closed. Banner assertions in `accessibility.spec.ts` are kept.
- **Responsive:** 320, 390, 768, 1024, 1440.
- **Progressive enhancement:** no-JS docked state; disclosure without JS.
- **Performance:** `AppBarBehavior` ≤3 KiB Brotli; no layout reads inside the scroll handler except `scrollY` and one cached `getBoundingClientRect` per rAF.
- **Visual:** refresh the studio, founder and services-projects baselines only if they diff. Windows baselines locally; Linux baselines from CI actuals after owner approval (T-11).
- **Commands:** `npm run validate`, `npx playwright test tests/e2e/app-bar.spec.ts tests/e2e/marketing-navigation.spec.ts`, `npm run test:a11y`, `npm run verify:static-export`.
- **Evidence:** RED and GREEN output; screenshots at 1440 and 390 on Home (top and docked) and on `/en/services/`.
- **Documentation impact:** none.
- **Reviewer:** GPT-6 Luna (spec conformance) plus an orchestrator visual check against the reference.
- **Acceptance:** all expected behaviour verified; no regression in existing navigation specs.
- **Receipt:** Appendix D.

### Task 7 / PR 7 – Sky-chart WebGL runtime and enhancement lifecycle

- **Objective:** replace the instrument scene with the section 10 runtime.
- **Rationale:** this is the core environmental experience.
- **Scope:**
  - New runtime modules; delete the old ones.
  - Rewrite `ImmersiveEnhancement`: same gates and one-shot activation; portal the canvas to `document.body` with z −2; read the node labels, locale and `plateLabel` from props that `ImmersiveHomeSequence` passes (Task 8 passes the Task 4 content); load fonts per T-03; wire `frameForProgress`, `recedeFactor` and `labelOpacityMultiplier`; suspend at `k = 1`; resize; handle context loss.
  - `PauseMotionControl` per D-25.
  - `capability.ts`: the star-count rule from T-07.
- **DOM contract** (consumed without editing Task 8 files): the root `[data-instrument]`; four `section[data-instrument-chapter]`; the container `[data-instrument-chapters]`; the root's `data-immersive-mode` is set by this task.
- **Dependencies:** Tasks 3 and 4. **Wave:** 2.
- **Provider:** Claude Sonnet 5. **Complexity:** high.
- **Skills:** `frontend-implementation`, `test-driven-development`, `playwright-qa`, `systematic-debugging`, `emil-design-eng`.
- **Owned paths:** see section 19. **Forbidden:** `ImmersiveHomeSequence.tsx` and CSS (Task 8).
- **Expected behaviour:**
  - The canvas exists only in webgl mode.
  - Labels are readable and in the correct locale.
  - The bearing sweep is reversible.
  - Links draw during Connect.
  - The environment recedes after the chapters; rendering stops once settled and while receded.
  - Pause freezes rendering; Resume recalculates.
  - Every failure path is quiet and static.
- **RED tests:**
  - `sky-chart-runtime.test.mjs`: the quality rule (520, 260, 160); the dispose contract (source asserts `.dispose()` for geometry, material and texture, plus `forceContextLoss`); the fonts are awaited before `new CanvasTexture`; the portal target is `document.body`; no `setAnimationLoop`.
  - `immersive-home.spec.ts` (immersive-chromium), updated:
    1. `data-sky-chart-canvas` is present and `data-immersive-mode="webgl"` after load.
    2. The debug hook shows 20 labels (≥1024) in the locale's text.
    3. Scrolling to each chapter gives the expected `data-rendered-chapter`, and reversing restores it.
    4. The frame counter stops increasing 1 s after scrolling stops.
    5. `data-recede="1"` and zero frames while at `#services`.
    6. Pause stops frames; Resume recalculates.
    7. Reduced motion, Save-Data, no WebGL2, a failing import, a failing renderer and forced context loss each give static mode with no canvas and no console error.
    8. Unmounting (client navigation to `/en/services/` and back) leaves one canvas and a dispose count of 1.
  - `immersive-home-acceptance.spec.ts`: keyboard reaches Pause after the chapters' last focusable element; Pause has the `hidden` attribute at scrollY 0 at 390 and 1440 (D-25) and when receded; at 390 the debug hook reports input-label opacity 0 at scrollY 0 (D-27); axe passes with the enhancement on.
- **GREEN:** as scoped.
- **REFACTOR:** a single `SkyChartController` class owning rAF, pause and suspend state.
- **Playwright:** `immersive-chromium`, `chromium-desktop` (smoke).
- **Accessibility:** canvas `aria-hidden`, `tabIndex -1`, no pointer events; the Pause control (D-25).
- **Responsive:** tier visibility verified at 1440, 768 and 320 through the debug hook.
- **Progressive enhancement:** all fallback paths above.
- **Performance:** `npm run build` then `npm run measure:immersive`: ≤120 KiB Brotli, p95 ≤20 ms, draw calls ≤28, DPR caps.
- **Commands:** `npm run validate`, `npx playwright test --project=immersive-chromium`, `npm run measure:immersive`, `npm run verify:static-export`.
- **Evidence:** RED and GREEN output, the measurement JSON, and a 1440 capture per chapter.
- **Documentation impact:** none (Task 12).
- **Reviewer:** GPT-6 Luna (lifecycle checklist) plus the orchestrator (visual fidelity against the reference).
- **Acceptance:** every expected behaviour and budget passes.
- **Receipt:** Appendix D.

### Task 8 / PR 8 – Immersive static composition: hero, chapters, ground and scrim

- **Objective:** implement D-01 to D-03, D-10 to D-12 and the static half of D-23 on Home's hero and chapters.
- **Rationale:** a complete static document that the enhancement layers onto.
- **Scope:**
  - `ImmersiveHomeSequence`: hero pulled up, chapter plates, instrument label; passes runtime props to `ImmersiveEnhancement` (the call-site signature is agreed in this packet: `labels`, `plateLabel`, `statusLabel`, `pauseLabel`, `resumeLabel`, `locale`, `sequences`).
  - `ImmersiveChapter` as an `AtlasPlate`.
  - `ImmersiveEditorialAnchor`: hero per D-11.
  - `EnvironmentGround`: ground gradient, a poster slot (empty until Task 10) and the scrim.
  - Delete `PhaseSpine` and `ImmersiveStaticArtwork`.
  - Rewrite `immersive-home.module.css`.
  - Add `data-readout` to the hero root and to each chapter (value `readout.home`).
  - `verify-static-export.mjs`: remove the four-poster requirement and add a check that `EnvironmentGround` is present.
  - Update `responsive.spec.ts` (chapter overlap assertions become plate/viewport assertions).
  - Rewrite `immersive-home-static.spec.ts`.
  - Refresh the instrument visual baselines.
- **Dependencies:** Tasks 3 and 4. **Wave:** 2.
- **Provider:** GPT-6 Luna. **Complexity:** moderate.
- **Skills:** `frontend-implementation`, `test-driven-development`, `playwright-qa`, `visual-qa`.
- **Owned paths:** see section 19. **Forbidden:** runtime files and `ImmersiveEnhancement.tsx`. **Locks:** L-04, L-05, L-07 (instrument baselines).
- **Expected behaviour:** without JS the hero sits under a docked App Bar over the dark ground; chapters are plates; there is no framed stage.
- **RED tests** (`immersive-home-static.spec.ts`, reduced motion, ES and EN):
  1. The hero top equals the header top (pulled up) at 1440 and 390.
  2. The H1 font-size is 96px at 1440 and ≥44px at 320.
  3. Four `section[data-instrument-chapter]` elements, each inside a plate, with no `[data-instrument-artwork]` present.
  4. Chapter plate width ≤520px at ≥768 and equal to the container at 390.
  5. `EnvironmentGround` is fixed, z-index −3, `aria-hidden`, and none of its ancestors create a stacking context (checked with `getComputedStyle`).
  6. The scrim uses the D-03 gradient at 1440 and at 390.
  7. No horizontal overflow at 320.
  8. JS disabled: the complete document renders and the H1 is the LCP candidate.
  9. At 200% zoom the hero grows beyond the viewport and no text is clipped.
- **GREEN:** as scoped.
- **REFACTOR:** remove dead poster props.
- **Playwright:** chromium-desktop, responsive projects, visual-chromium.
- **Accessibility:** heading order unchanged; axe on the static Home.
- **Responsive:** five widths.
- **Progressive enhancement:** static-first.
- **Performance:** no JS added.
- **Visual:** instrument baselines at 5 widths × 2 locales. Windows baselines locally, Linux baselines from CI actuals after owner approval.
- **Commands:** `npm run validate`, `npx playwright test tests/e2e/immersive-home-static.spec.ts tests/e2e/responsive.spec.ts`, `npx playwright test --project=visual-chromium`, `npm run verify:static-export`.
- **Evidence:** RED and GREEN output; baseline diff images attached to the PR.
- **Documentation impact:** none.
- **Reviewer:** Claude Sonnet 5 (stacking-context and fallback review).
- **Acceptance:** all tests green; the owner approves the baselines.
- **Receipt:** Appendix D.

### Task 9 / PR 9 – Home sections: Problems, Services, Position fix, Proof, Process, Founder, Dawn

- **Objective:** implement D-13 to D-20 and place `HomeImpact`.
- **Rationale:** personalized sections within one world.
- **Scope:**
  - Restyle the six existing section components (transparent backgrounds, materials, compositions) and keep all ids and `aria-labelledby` values.
  - New `HomeImpact.tsx` composing Task 5's components inside `PlottingSheet`s.
  - `CommercialHomepage`: insert `HomeImpact` after Services and add `data-readout` to every section.
  - `smoke.spec.ts`: the section count becomes 8.
  - New `home-sections.spec.ts`.
- **Dependencies:** Tasks 3, 4 and 5. **Wave:** 2.
- **Provider:** GPT-6 Luna. **Complexity:** moderate.
- **Skills:** `frontend-implementation`, `test-driven-development`, `playwright-qa`, `visual-qa`, `dataviz`.
- **Owned paths:** see section 19. **Forbidden:** `immersive/**`, content files, `verify-static-export.mjs` (the impact entry is added by Task 11).
- **Expected behaviour:** sections render per D-13 to D-19, in both locales, without JS, at five widths.
- **RED tests** (`home-sections.spec.ts`):
  1. Section order is problems, services, impact, proof, process or proceso, founder, cta.
  2. Problems: three `li` sheets; horizontal offsets 0, 56 and 112px at 1440 and 0 at 390; each has an `aria-hidden` glyph and Bayer letter; the situation text is exact.
  3. Services: the lead plate is ≥420px high and spans two rows at 1440.
  4. Impact: both SVGs are visible without JS. With JS the toggle switches `hidden`, `aria-pressed` and the live-region text. The source list shows 5 items. Rendered label font size is ≥12px at 390. The visible “Illustrative scenario” tag appears twice. The counts are 5 and 1.
  5. Proof: the log list has an accessible name and 3 items.
  6. Process: an `<ol>` of 4; the arc is visible only at ≥1024 and is `aria-hidden`.
  7. Dawn: the Ink focus ring.
  8. At most 3 intersecting backdrop-filter surfaces at each section (computed-style scan).
  9. Every `[data-readout]` value comes from content.
  10. Keyboard tab order matches section 13.
  11. No console errors.
  12. Forced colours: surfaces have a `CanvasText` border (Chromium `forcedColors: 'active'`).
- **GREEN:** as scoped.
- **REFACTOR:** a shared section shell (`HomeSection` with `id`, `readout` and `kicker`) inside `components/homepage/`.
- **Playwright:** the projects registered for `home-sections.spec.ts`, plus `smoke.spec.ts`.
- **Accessibility:** axe on Home in ES and EN (static); a manual check of the keyboard order.
- **Responsive:** five widths.
- **Progressive enhancement:** without JS the toggle is absent and both figures show.
- **Performance:** `PositionFixToggle` ≤3 KiB Brotli.
- **Commands:** `npm run validate`, `npx playwright test tests/e2e/home-sections.spec.ts tests/e2e/smoke.spec.ts`, `npm run test:a11y`, `npm run verify:static-export`.
- **Evidence:** RED and GREEN output; captures at 1440 and 390 per section.
- **Documentation impact:** none.
- **Reviewer:** Claude Sonnet 5 plus an orchestrator visual check against the reference.
- **Acceptance:** all tests green; the visual check matches the reference within D-13 to D-19.
- **Receipt:** Appendix D.

### Task 10 / PR 10 – Environment static posters and fallback wiring

- **Objective:** produce the D-23 posters and show them in every static path.
- **Rationale:** the fallback must be final art, not an empty gradient.
- **Scope:**
  - `scripts/render-sky-chart-posters.mjs`: a dev-only Playwright script that starts `next dev`, opens `/` with a query-free test hook `window.__FURLANICH_SKY_CHART_POSTER__ = true` set by `page.addInitScript`, renders the resolved state (t = 1, labels hidden, no scrim), and writes the WebP files through `canvas.toDataURL('image/webp', q)` with q stepping down until the budget is met.
  - The runtime honours that poster flag only when `NODE_ENV !== 'production'`. The runtime file is owned by Task 7, which has merged, so Task 10 receives a lock transfer for `create-sky-chart-scene.ts`, limited to the poster flag branch.
  - `media-manifest.ts`: replace the four entries with `environment-wide` and `environment-compact`, classification brand-motion, `evidence: false`, `decorative: true`, with byte budgets.
  - `EnvironmentGround` poster layer with `image-set` and a `(max-width: 767px)` source switch.
  - `verify-static-export.mjs`: require both posters and forbid the old poster paths.
  - Delete `public/brand/immersive/`.
- **Dependencies:** Tasks 7 and 8. **Wave:** 3.
- **Provider:** GPT-6 Luna. **Complexity:** moderate.
- **Skills:** `test-driven-development`, `playwright-qa`.
- **Owned paths:** see section 19, plus the lock transfer above. **Locks:** L-04, L-05.
- **Expected behaviour:** reduced motion, no JS, WebGL failure and context loss show the poster; webgl mode hides it after the first frame.
- **RED tests:**
  - `immersive-media-manifest.test.mjs`: two entries; files exist; byte sizes ≤150 and ≤80 KiB; dimensions are 1920×1080 and 900×1600 (read from the WebP header).
  - `immersive-home-static.spec.ts` gets one added test here, with a lock transfer from Task 8 for this file only: the computed `background-image` of the poster layer contains `environment-wide.webp` at 1440 and `environment-compact.webp` at 390 in static mode.
- **GREEN:** as scoped.
- **REFACTOR:** none expected.
- **Playwright:** chromium-desktop, mobile-chromium, immersive-chromium (fallback tests).
- **Accessibility:** the poster is a CSS background with no alt text needed (decorative).
- **Performance:** poster budgets; posters are not preloaded.
- **Commands:** `node scripts/render-sky-chart-posters.mjs`, `npm run validate`, `npm run verify:static-export`, `npx playwright test tests/e2e/immersive-home-static.spec.ts`.
- **Evidence:** the poster files, byte sizes, and the script log.
- **Reviewer:** Claude Sonnet 5.
- **Acceptance:** tests green; the owner approves the poster art in the PR.
- **Receipt:** Appendix D.

### Task 11 / PR 11 – Integration hardening: acceptance matrix, accessibility, performance, visual baselines

- **Objective:** prove the integrated Home and App Bar against every gate.
- **Rationale:** independently green branches are not proof of an integrated whole.
- **Scope:**
  - `sky-chart-acceptance.spec.ts`: ES and EN × 1440, 1024, 768, 390, 320. Forward and reverse traversal; resize and orientation; keyboard; 200% zoom; reduced motion; reduced transparency (Chromium emulation); Save-Data; no JS; WebGL failure; context loss; root and `/Portfolio` base paths; layout shift 0; axe with the enhancement on and off; no console errors.
  - `home-sections.visual.spec.ts`: reduced motion, `main` at 1440 and 390 × ES and EN.
  - `verify-static-export.mjs`: add the `impact` section to Home's required order with the exact headings.
  - `measure-immersive-production.mjs` and `measure-home-web-vitals.mjs`: add the draw-call, label-count, idle-frame and backdrop-count metrics.
  - Fix any integration defect, with a lock transfer from the original owner recorded in the PR.
- **Dependencies:** Tasks 6, 9 and 10. **Wave:** 3.
- **Provider:** Claude Sonnet 5. **Complexity:** high.
- **Skills:** `playwright-qa`, `visual-qa`, `systematic-debugging`, `verification-before-completion`, `design:accessibility-review`.
- **Owned paths:** see section 19. **Locks:** L-04, L-07 (new Home-sections baselines).
- **Expected behaviour:** everything in sections 13 and 14 holds together.
- **RED tests:**
  - The acceptance spec written against the integrated build first. Expect initial failures only where integration defects exist; each is fixed with a failing test first.
  - `verify-static-export.mjs` impact requirement: RED until the entry is added, run against a fixture HTML without the section, which must fail.
- **GREEN:** fixes.
- **REFACTOR:** consolidate test helpers into `tests/e2e/support/sky-chart.ts`.
- **Playwright:** the full `npm run test:e2e` matrix on both base paths (`NEXT_PUBLIC_BASE_PATH=/Portfolio`).
- **Accessibility:** axe plus the manual keyboard pass.
- **Responsive:** five widths × two locales.
- **Progressive enhancement:** all paths.
- **Performance:** all section 14 gates recorded in the PR.
- **Commands:** `npm run validate`, `npm run test:e2e`, `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run test:e2e`, `npm run test:a11y`, `npm run verify:static-export`, `npm run measure:immersive`, `npm run measure:home-vitals`.
- **Evidence:** the matrix report, measurement JSON, and baseline diffs for owner approval.
- **Reviewer:** GPT-6 Luna (checklist completeness) plus the owner.
- **Acceptance:** zero failing projects; all gates within limits; baselines approved.
- **Receipt:** Appendix D.

### Task 12 / PR 12 – Documentation synchronization and acceptance record

- **Objective:** make the repository describe what was built.
- **Scope:**
  - `ARCHITECTURE.md` CURRENT and APPROVED immersive sections.
  - `docs/architecture/current-system.md`.
  - `docs/index.md`.
  - `docs/reviews/sky-chart-acceptance-v2/index.md`: automated evidence plus the section 26 manual results, including real-device and screen-reader results (PASS/FAIL/DEFERRED, stated honestly).
  - Move this plan to `completed/` with Progress and Deviations filled in; update the plan index.
  - Mark DESIGN records IMPLEMENTED where the repo convention does so.
- **Dependencies:** Task 11. **Wave:** 4.
- **Provider:** GPT-6 Luna. **Complexity:** low.
- **Skills:** `project-knowledge-maintenance`, `pr-readiness`.
- **TDD:** not applicable. **Commands:** `npm run docs:check`, `npm run validate`.
- **Reviewer:** Claude Sonnet 5, then the owner.
- **Acceptance:** docs-check green; no claim exceeds the recorded evidence.
- **Receipt:** Appendix D with TDD N/A.

## 22. TDD evidence requirements

Every behaviour-bearing task (3–11) records three entries in its receipt:

1. **RED:** the exact command, the failing test names, and the failure message showing the expected reason (a missing token or element, a wrong value). A failure caused by a syntax, import or configuration error is not valid RED.
2. **GREEN:** the same command passing, with the minimal diff summary.
3. **REFACTOR:** what changed and the unchanged passing output.

Commits must show a test commit before or together with its implementation. A test added after the implementation is recorded as a deviation, never as TDD. Purely visual CSS values that no stable assertion can express are listed as “visual-only exceptions”, with a screenshot as evidence.

## 23. Independent review strategy

- An implementing provider never reviews its own task. Luna tasks are reviewed by Sonnet 5; Sonnet tasks are reviewed by Luna.
- The orchestrator performs a design-fidelity review against the reference prototype for Tasks 6, 7, 8, 9 and 10, using `visual-qa`.
- The reviewer checks: owned paths only, the RED/GREEN/REFACTOR receipt, the listed commands re-run fresh, the acceptance criteria, no weakened assertion, no unapproved snapshot change, and no new dependency.
- The owner reviews and merges every PR. Agents never merge or push to `main`.

## 24. Sequential integration procedure

For each wave:

1. The orchestrator dispatches the wave's tasks on branches cut from the current `main`, each in its own worktree.
2. Each PR passes its own checks and its independent review. Failures are fixed on the originating branch only.
3. The owner merges in this order: Wave 1 (3, 4, 5); Wave 2 (8, then 7, then 9, then 6: static composition before runtime, sections before the global bar); Wave 3 (10, then 11).
4. After each merge, the next PR in the wave is rebased onto the new `main` and re-runs `npm run validate` plus its Playwright command before its own merge.
5. After the wave's last merge, the orchestrator runs the wave checkpoint (section 25) on `main` and records it in Progress.
6. The next wave unlocks only after a green checkpoint. A red checkpoint opens a fix task owned by the task whose paths contain the defect.

## 25. Wave verification checkpoints

| Checkpoint | Commands on `main` | Pass condition |
| --- | --- | --- |
| W0 | `npm run docs:check` | RFC and ADR records resolve; plan APPROVED |
| W1 | `npm run validate`; `npm run test:e2e -- --project=chromium-desktop`; `npm run verify:static-export` | No rendered change to any page; new tests green |
| W2 | `npm run validate`; `npm run test:e2e`; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run test:e2e`; `npm run test:a11y`; `npm run measure:immersive` | All projects green; JS budget ≤120 KiB; manual 1440 and 390 look against the reference |
| W3 | All W2 commands plus `npm run measure:home-vitals` and the full acceptance spec | Every section 14 gate within limits; baselines approved |
| W4 | `npm run validate` | Documentation reflects implementation; plan moved to completed |

## 26. Manual QA protocol

Performed after W3. Results are recorded honestly in Task 12's acceptance record.

1. **Browsers:** Chrome, Firefox and Safari (macOS if available) at 1440 and 1024. A walk through Home in both locales: forward, reverse, Pause, Resume and the Position fix toggle.
2. **Real devices:** one constrained Android device (≤4 cores; closes the previous plan's deferral) and one iPhone. Check scroll smoothness, heat after three full traversals, label legibility, blur cost and the compact menu.
3. **Screen readers:** NVDA with Firefox (Windows) and VoiceOver on iOS. Check landmarks, heading list, Problems list, both Position fix figures (title and description), the live-region announcement, the Proof log list, and that the Pause button's state is announced.
4. **Preferences:** reduced motion, reduced transparency (macOS), forced colours (Windows High Contrast), 200% zoom, and a 320px viewport.
5. **Content truth:** every illustrative element shows its tag; no number is presented as a measurement.
6. **Design fidelity:** side-by-side with `sky-chart-reference.html` at 1440 and 390, section by section, using `visual-qa`. Record any deviation with its reason.

## 27. Documentation updates

| Record | Change | Task |
| --- | --- | --- |
| `docs/rfcs/` | New RFC and index entry | 1 |
| `docs/reviews/sky-chart-direction-2026-09-23/` | Committed evidence | 1 |
| `docs/decisions/` | New ADR, index entry, supersession note | 2 |
| DESIGN-VISUAL, DESIGN-IX-A11Y, PAGE-HOME, status register | Approved sections and copy | 2 |
| ARCHITECTURE, current-system, docs index, acceptance review, plan index and completion | Implementation facts | 12 |

## 28. Rollback and failure considerations

- **Per-PR revert:** each PR is independently revertible. Reverting in reverse merge order restores the previous state; Wave 1 PRs have no rendered effect.
- **Runtime failure in production:** the static poster path is always complete. A defective runtime can be neutralized by reverting Task 7 alone, which returns Home to the poster and ground without layout change.
- **Budget breach:** if `measure:immersive` exceeds 120 KiB, stop and return to governance (ADR rule). Do not raise the budget inside an implementation PR.
- **Accessibility or contrast regression:** a blocking defect; fix on the owning branch before merge.
- **Visual baseline disagreement:** the owner's decision in the PR is final. If rejected, the task revises the design within D-rules or escalates to an RFC amendment.
- **Governance rejection at G1:** the plan stays PROPOSED and no code task starts.

## 29. Definition of done

- Tasks 1–12 are merged by the owner, and checkpoints W0–W4 are green and recorded.
- Every section 14 gate is within limits on the production build, on both base paths.
- Home in ES and EN matches D-01 to D-27 at 320, 390, 768, 1024 and 1440, verified by automated tests and the manual protocol.
- The App Bar matches D-22 on every localized route, with and without JS.
- No invented evidence; every illustrative element is labelled.
- Records are synchronized (section 27); the plan is in `completed/` with Progress and Deviations.
- The acceptance record states the real-device and screen-reader results honestly.

## 30. Open risks and explicitly deferred items

- **OPEN — Real-device thermal behaviour** of a full-viewport canvas plus backdrop-filter on low-end Android. Mitigation: DPR caps, star counts, blur budget, recede suspension, and the manual protocol in section 26.
- **RISK — Figma drift.** The mirror is a snapshot of this plan (Gate F). If implementation changes a D-rule through an approved deviation, update Figma in one batched call, or record the drift in the acceptance review.
- **OPEN — Press-scale feedback** (Emil Kowalski recommendation). Not adopted, because it conflicts with the approved no-scale rule; it would need a separate design decision.
- **DEFERRED — Services, Projects, Studio, Founder, Contact and Privacy restyling** into the new materials. They get only the App Bar.
- **WITHDRAWN (proposed, decided at G1) — the Connection film and any video.** The runtime ADR's permission for one optional film is withdrawn (supersession item 17). Reintroducing video requires a new governance decision.
- **RISK — Linux baselines** depend on CI actuals and owner approval (T-11).
- **RISK — Spanish strings are ~30% longer.** Every layout test runs in both locales; if a string wraps badly, the fix is a layout change, never shrinking type below the D-09 minimums.

## Appendix A — New bilingual strings

*Corrected 2026-10-05: `instrument.coordinates` uses the ASCII apostrophe U+0027, not the prime U+2032 that this table first wrote, because the shipped Instrument Sans subset lacks U+2032 (see Deviations).* All other strings are existing approved content. Mono labels are ≤64 characters. Strings marked *(decorative)* are rendered `aria-hidden`.

| Key | English | Spanish |
| --- | --- | --- |
| `instrument.coordinates` *(decorative)* | 34°36'S · 58°22'W | 34°36'S · 58°22'W |
| `instrument.plateLabel` *(decorative)* | Plate {current}/04 | Lámina {current}/04 |
| `instrument.statusLabel` *(decorative)* | Plate {current} of 04 | Lámina {current} de 04 |
| `instrument.chapters[].kicker` | Recognize · Fragment · Connect · Coordinate | Reconocer · Fragmentar · Conectar · Coordinar |
| `servicesSection.kicker` | Services | Servicios |
| `servicesSection.services[].category` | Build · Connect · Improve | Construir · Conectar · Mejorar |
| `proof.kicker` | Accountability | Responsabilidad técnica |
| `proof.logLabel` | Where accountability applies | Dónde se aplica la responsabilidad |
| `proof.log` | Define: Problem and scope agreed · Decide: Technical decisions led by Samuel · Review: Work reviewed before handover | Definir: Problema y alcance acordados · Decidir: Decisiones técnicas a cargo de Samuel · Revisar: Trabajo revisado antes de la entrega |
| `process.kicker` | Process | Proceso |
| `founderSection.kicker` | Founder | Fundador |
| `readout` | Home · Problems · Services · Position fix · Accountability · Process · Founder · Contact | Inicio · Problemas · Servicios · Posición · Responsabilidad · Proceso · Fundador · Contacto |
| `impact.kicker` | Position fix | Fijar la posición |
| `impact.heading` | Fewer places to check before you know where an order stands | Menos lugares que revisar para saber en qué estado está un pedido |
| `impact.introduction` | An illustrative scenario, not a client result. A navigator fixes a position from several bearings; when the sources disagree, the fix becomes an area of doubt. | Un escenario ilustrativo, no un resultado de clientes. Un navegante fija su posición con varias marcaciones; cuando las fuentes no coinciden, la posición se vuelve una zona de duda. |
| `impact.illustrativeTag` | Illustrative scenario | Escenario ilustrativo |
| `impact.toggle.groupLabel` | Scenario | Escenario |
| `impact.toggle.separateLabel` | Separate sources | Fuentes separadas |
| `impact.toggle.connectedLabel` | Connected record | Registro conectado |
| `impact.toggle.announcement` | Showing: {state} | Mostrando: {state} |
| `impact.figure.title` | Where one order stands, according to its sources | Dónde está un pedido, según sus fuentes |
| `impact.figure.separateDescription` | Five bearings from a WhatsApp thread, a paper order book, a spreadsheet, an email and a phone call cross in different places, leaving an area of doubt. | Cinco marcaciones desde un chat de WhatsApp, un cuaderno de pedidos, una planilla, un correo y una llamada se cruzan en lugares distintos y dejan una zona de duda. |
| `impact.figure.connectedDescription` | Every source reads one connected record, so all bearings meet at one exact point. | Todas las fuentes leen un mismo registro conectado, así que todas las marcaciones coinciden en un punto exacto. |
| `impact.figure.doubtLabel` | Area of doubt | Zona de duda |
| `impact.figure.fixLabel` | Exact fix | Posición exacta |
| `impact.sources` (name: note) | WhatsApp thread: “Confirmed” in the chat · Paper order book: Written down, not yet paid · Spreadsheet: Updated yesterday evening · Email: Customer asked to change the date · Phone call: Promised for Friday | Chat de WhatsApp: “Confirmado” en el chat · Cuaderno de pedidos: Anotado, todavía sin pagar · Planilla: Actualizada ayer a la tarde · Correo: El cliente pidió cambiar la fecha · Llamada: Prometido para el viernes |
| `impact.connectedNoteTemplate` | {source}: reads the connected record | {source}: lee el registro conectado |
| `impact.counts.title` | Places checked to confirm one order | Lugares revisados para confirmar un pedido |
| `impact.counts.separateLabel` / `connectedLabel` | Separate sources / Connected record | Fuentes separadas / Registro conectado |
| `impact.counts.caption` | Counts come from this example: a WhatsApp thread, a paper order book, a spreadsheet, an email and a phone call. They are not measurements. | Los números salen de este ejemplo: un chat de WhatsApp, un cuaderno de pedidos, una planilla, un correo y una llamada. No son mediciones. |
| `instrument.nodes` | See Appendix B | See Appendix B |

The source ids, in fixed order, are `whatsapp`, `book`, `spreadsheet`, `email` and `call`.

## Appendix B — Scene nodes

Yaw and pitch are in degrees. Groups: `inputs` (reveal g = 0), `understand` (0.22), `define` (0.40), `build-review` (0.58), `hand-over` (0.74).

| id | Group | Tier | Yaw | Pitch | English | Spanish |
| --- | --- | ---: | ---: | ---: | --- | --- |
| orders | inputs | 2 | 28 | 14 | Orders | Pedidos |
| bookings | inputs | 2 | 40 | −6 | Bookings | Reservas |
| messages | inputs | 2 | 18 | −16 | Messages | Mensajes |
| tasks | inputs | 2 | 48 | 12 | Tasks | Tareas |
| understand | understand | 1 | 78 | 10 | Understand | Entender |
| process | understand | 3 | 70 | 20 | Process | Proceso |
| constraints | understand | 3 | 88 | 22 | Constraints | Restricciones |
| diagnosis | understand | 3 | 84 | −2 | Diagnosis | Diagnóstico |
| define | define | 1 | 112 | 4 | Define | Definir |
| scope | define | 3 | 104 | 16 | Scope | Alcance |
| responsibilities | define | 3 | 122 | 14 | Responsibilities | Responsabilidades |
| validation-criteria | define | 3 | 116 | −10 | Validation criteria | Criterios de validación |
| build-review | build-review | 1 | 146 | 8 | Build & review | Construir y revisar |
| integrate | build-review | 3 | 138 | 20 | Integrate | Integrar |
| technical-review | build-review | 3 | 156 | 20 | Technical review | Revisión técnica |
| functional-tests | build-review | 3 | 150 | −6 | Functional tests | Pruebas funcionales |
| hand-over | hand-over | 1 | 180 | 2 | Hand over | Entregar |
| documentation | hand-over | 3 | 172 | 14 | Documentation | Documentación |
| journeys-validated | hand-over | 3 | 190 | 14 | Journeys validated | Recorridos validados |
| maintain | hand-over | 3 | 186 | −10 | Maintain | Mantener |

**Sources and rejected terms.** The vocabulary comes from HOME-PROCESS, Studio principles, Services and the Process quality statement. Strategy, Observe, Deploy, Iterate, Prototype and AI are rejected: they are absent from the approved offer or conflict with the AI positioning.

## Appendix C — Cocked-hat glyph paths

Each glyph is a 56×56 `viewBox`, stroke Azure 1.5, no fill; the triangle is filled `rgba(0,69,137,.14)`.

| Sheet | Lines path | Triangle path |
| --- | --- | --- |
| α | `M6 44 50 20M10 12l32 38M4 30h48` | `M21 30 31 25 27 36Z` |
| β | `M4 40 52 24M14 6l24 46M8 14l40 30` | `M22 34 30 28 30 38Z` |
| γ | `M4 22h48M20 4l14 48M6 50 48 8` | `M24 22 29 22 26 31Z` |

## Appendix D — Completion receipt template

```text
Task N / PR N – <title>
Provider: <GPT-6 Luna | Claude Sonnet 5>    Reviewer: <other provider>
Branch/worktree: codex/sky-chart-<task>      Base: <main SHA>
Owned paths touched: <list>  (must be a subset of section 19)
Locks held/released: <list>
RED:      <command> → <failing test names + expected-reason excerpt>
GREEN:    <command> → <passing summary>
REFACTOR: <what changed> → <command> still passing
Validation (fresh): npm run validate → <result>; <Playwright commands> → <result>;
          verify:static-export → <result>; measure:* → <numbers, if applicable>
Accessibility: <axe results + manual checks>
Responsive: <widths checked>   Progressive enhancement: <paths checked>
Visual evidence: <paths>   Baseline changes: <none | files + owner approval link>
Deviations: <none | description + reason>
Documentation impact: <none | records>
```

## Progress

- 2026-09-23 — Plan authored after owner selection of Direction A with plotting-sheet personalization.
- 2026-09-23 — Prerequisite met: the owner merged PR #76 and the canonical gate is green.
- 2026-09-23 — Gate F complete: [Figma mirror](https://www.figma.com/design/V6FD6Sq3gqqxeMw5Si7Dnx), built with the Figma MCP (`figma-use`, `figma-generate-library`, `figma-generate-design`) in 7 write calls. Findings folded into the plan: D-25 (Pause hidden during the hero) and the new D-27 (compact hero label mask). Task 2 records the file URL in the review.
- 2026-09-24 — Task 1 complete and gate G1 passed. Governance PR #77 (`RFC-SKY-CHART-VISUAL-SYSTEM-V2`, 18 supersession items) went through two independent review rounds (CHANGES REQUESTED, then minor). The owner merged it as `70168e9`. That accepts the redesign and its three explicit decisions: removing the derived Azure sculpture, adding HOME-IMPACT, and withdrawing the optional Connection film. Checkpoint W0 is pending Task 2.
- 2026-09-24 — Task 2 complete. PR #78 (the runtime ADR, `SKY-CHART-V2` design sections with supersession markers, HOME-IMPACT, and approval records) passed two independent review rounds, and the owner merged it as `102ef5b`. **Checkpoint W0 passed** on `main`: `npm run docs:check` is green, and the plan, RFC and ADR are APPROVED. Wave 1 dispatched: Tasks 3, 4 and 5, in parallel worktrees from `102ef5b`.
- 2026-09-24 — Wave 1 complete. The owner merged PR #79 (Task 4, `4addced`), PR #80 (Task 5, `f31a881`) and PR #81 (Task 3, `db25420`). **Checkpoint W1 passed** on `main` at `db25420`, in a clean worktree with a fresh `npm ci`:
  - `npm run validate` is green: docs check (266 files, 87 IDs), 243/243 unit tests, lint with 0 errors, typecheck, and a build of 22 static pages.
  - `npm run test:e2e -- --project=chromium-desktop --workers=1` passes 116/116. The default parallel run fails 1 of 116 because of a known dev-server race (see Deviations); that race predates Wave 1.
  - `npm run verify:static-export` passes: 20 routes, base path `/`.
  - The “no rendered change” condition is verified directly: `--project=visual-chromium` passes 22/22 against the unchanged Windows baselines.

  Wave 2 dispatched: Tasks 6, 7, 8 and 9, in parallel worktrees cut from the orchestration commit on top of `db25420`, under the Wave 2 decisions below.
- 2026-09-27/28 — PRs #82 (Task 8), #83 (Task 7, stacked), #84 (Task 9, stacked) and #85 (the Task 7 branch into `main`) merged; `main` is `0fe74d9`. Tasks 7 and 9 reached `main` before the #83 review's blocking findings were fixed. The owner then chose a static-only hotfix and a performance-governance decision (see Deviations). Task 6 and the Task 7 follow-up remain; checkpoint W2 is not yet run.
- 2026-09-28 — Wave 2 complete. The owner merged the static-only hotfix #86, the Task 7 follow-up #87, the CI test fixes #88 (Task 7 specs), and Task 6 as #89 (`4f63afa`, with the owner-approved baselines). **Checkpoint W2 passed** on `main` at `4f63afa`, in a clean worktree with a fresh `npm ci`, subject to the follow-ups recorded under Deviations:
  - **`npm run validate`:** green. docs:check (266 files, 87 IDs), 282/282 unit tests, lint 0 errors, typecheck, and a build of 22 pages.
  - **`npm run test:e2e`, two workers:** 1068 passed, 5 failed, 101 skipped. All 5 pass on a serial re-run (immersive 34/34, navigation 30/30). One of them was the known `the-system` dev-server race; the others were load-sensitive immersive tests. PR #89's Linux CI, on the same tree, passed every project.
  - **`NEXT_PUBLIC_BASE_PATH=/Portfolio npm run test:e2e`:** 1070 passed, 3 failed, 101 skipped. All pass serially (immersive 34/34, navigation 30/30), except "keyboard reaches Pause", which also failed 2 of 20 times serially. That is a real test defect. The W2 checkpoint PR fixes it: 40/40 and 30/30 serial, and 30/30 with two workers.
  - **`npm run test:a11y`:** 16/16.
  - **`npm run measure:immersive`, three runs on a quiet machine:**
    - Lifecycle: 1 canvas; listeners 515 → 516 after five remounts; no remount timeouts.
    - Frame p95: 183 ms, which is advisory under SwiftShader per the amended ADR.
    - Headroom: the script reports 5.6 KiB, below the owner-accepted 6 KiB. That uses its whole-page method. By the ADR's definition ("runtime chunk plus three"), the lazy runtime chunk is **108.1 KiB Brotli, with 11.9 KiB of headroom**. See Deviations.
    - CLS: 0, 0.0012 and 0.0019. All of it comes from font-swap text reflow in the App Bar and hero at first paint, not from the enhancement. See Deviations.
  - **Manual look against the reference**, on the production build with the runtime active: 1440 and 390, covering the hero, a chapter, Position fix, Process and the Dawn CTA. The App Bar is transparent at the top with readout `00 · Home` and docks with `03 · Position fix` at `#impact`. The H1 and trust row are clear of labels, and the D-27 mask holds at 390. Plates, sheets, the ecliptic and the Pause pill match the reference. No deviation was found.
  
  Wave 3 can start: Task 10, then Task 11.
- 2026-09-29 — Task 10 complete. The owner merged PR #91 (`f7a8620`): the two environment posters (59.1 KiB wide, 29.0 KiB compact, owner-approved art), the poster-flag branch in the runtime (development only), the manifest swap, and the `verify-static-export.mjs` poster requirements.
- 2026-10-05 — Wave 3 complete. The owner merged Task 11 as PR #92 (`edf8330`), after #96 (CI browser budget) and #97 (`brag` skill description). The owner decisions E1–E5, the `em` hero caps and the cross-platform Instrument Sans fallback are recorded under Deviations. **Checkpoint W3 passed** on `main` at `edf8330`, in a clean worktree with a fresh `npm ci` (Windows, Git Bash with `MSYS2_ENV_CONV_EXCL='NEXT_PUBLIC_BASE_PATH'` per W2 follow-up 4, nothing else listening on 3000–3199):
  - **`npm run validate`:** green. docs:check (291 files, 97 IDs, 38 Skills), 291/291 unit tests, lint 0 errors, typecheck, and a build of 22 pages.
  - **`npm run test:e2e`, two workers:** 1272 passed, 0 failed, 101 skipped (29.2 min). This includes the 142 acceptance tests.
  - **`NEXT_PUBLIC_BASE_PATH=/Portfolio npm run test:e2e`, two workers:** 1271 passed, 1 failed, 101 skipped (28.5 min). The failure was webkit-desktop `contact.spec.ts` "es-AR Contact preserves values through failure and retry": the form had not hydrated within 5 s, and the failure screenshot shows the `next dev` "Compiling…" badge. The spec, run alone on webkit at `/Portfolio` with `--repeat-each=10` and two workers, passed 140/140. This is the dev-server load flake class from W2 follow-up 3, outside this plan's paths, not a regression.
  - **`npm run test:a11y`:** 16/16.
  - **The full acceptance spec, serial** (`sky-chart-acceptance.spec.ts`, `immersive-chromium`, `--workers=1`): 142/142 at the root and 142/142 under `/Portfolio`, where the base-path group resolves every link, poster and chunk and the runtime activates.
  - **`npm run verify:static-export`:** 20 routes at base path `/`, and 20 routes at `/Portfolio`.
  - **Section 14 gates.** `measure:immersive` ran three times and `measure:home-vitals` once; every run exits 0. Both scripts build the root base path only, so the `/Portfolio` build is covered by the acceptance spec and `verify:static-export`.

    | Gate | Limit | W3 measurement | Result |
    | --- | --- | --- | --- |
    | Incremental immersive JavaScript (lazy runtime chunk plus three) | ≤120 KiB Brotli | 108.1 KiB in 3/3 runs (11.9 KiB headroom); whole-page delta 114.4 KiB, reported only | Pass |
    | `AppBarBehavior` plus `PositionFixToggle` | ≤6 KiB Brotli | 1.33 KiB, Task 11's build comparison; neither leaf changed between `f7a8620` and `edf8330` | Pass |
    | Environment posters | ≤150 KiB wide, ≤80 KiB compact | 59.15 KiB, 29.04 KiB (`immersive-media-manifest.test.mjs` green) | Pass |
    | Canvas DPR | ≤1.5 wide, ≤1.25 compact or constrained | 1.25 at 1440 and 390 on a 3x profile (this 4-core host counts as constrained) | Pass |
    | Draw calls per frame | ≤28 | Max 15 (p95 15) in `measure:immersive`; max 16 desktop and 7 mobile in the vitals journeys | Pass |
    | Label textures | ≤20, each ≤1024×64 | 20, largest 398×64 | Pass |
    | Scroll frame interval p95 | ≤20 ms on a hardware GPU | 199.9–200 ms under SwiftShader, advisory | Pending: section 26 device protocol |
    | LCP p75 | ≤2.5 s, element H1 | Mobile 2040 ms static and 2028 ms enhanced; desktop 540 ms and 524 ms; H1 in all 60 journeys | Pass |
    | INP p75 | ≤200 ms | Static (gated): 24 ms mobile, 16 ms desktop. Enhanced (advisory under SwiftShader): 104 ms and 32 ms | Pass |
    | Layout shift from the enhancement | 0 | 0 in 3/3 `measure:immersive` runs and all 60 vitals journeys. Whole-page CLS (gated ≤0.1): 0 mobile, 0.0437 desktop, from the font swap at about 300–560 ms | Pass |
    | Backdrop-filter surfaces, at each section (E1) | ≤3 | 3 at 320, 390, 768, 1024 and 1440; the informational sweep reaches 4 at 768 and 1440 | Pass |
    | Idle rendering | 0 frames after settle | 0 settled in a chapter, 0 fully receded, 0 in the vitals journeys | Pass |
    | Main-thread interaction task | <50 ms on a hardware GPU | Longest 62–71 ms under SwiftShader, advisory | Pending: section 26 device protocol |

    Lifecycle: one canvas; listeners 516 → 518 over five remounts.
  - **Baselines:** `visual-chromium` passes inside both e2e runs against the committed, owner-approved baselines (E3, E5).
  - **Verdict.** Every section 14 gate that automation can measure is within limits. The two hardware-GPU gates are measured only by the section 26 protocol, as the amended ADR requires. They stay pending, and Task 12's acceptance record reports them as PASS, FAIL or DEFERRED from the manual results.

  Wave 4 dispatched: Task 12, from this checkpoint commit.
- 2026-10-05 — Task 12 implemented on `codex/sky-chart-task-12-docs` (Claude Sonnet 5; independent review and the owner's merge follow). It synchronizes `ARCHITECTURE.md`, `docs/architecture/current-system.md` and `docs/index.md` with what was built; adds the [acceptance record](../../reviews/sky-chart-acceptance-v2/index.md) (`REVIEW-SKY-CHART-ACCEPTANCE-V2`); applies the corrections that the Deviations assign to Task 12 (coordinates, the 6.84:1 hover contrast, the N12 Pause tab position, D-08, D-10/D-22, D-11, D-13, the section 14 and ADR measurement notes, the font notes); records the acceptance spec, the Home-sections visual spec and `tests/e2e/support/*` in the two testing records; and moves this plan to `completed/`. `npm run docs:check` and `npm run validate` pass on the branch (see the acceptance record for the numbers). **Manual QA is DEFERRED.** No section 26 result existed on 2026-10-05, so the acceptance record lists every manual item and both hardware-GPU gates as DEFERRED with a checklist for the owner. Nothing is recorded as PASS without recorded evidence. The plan is marked `plan_status: COMPLETED` with that deferral stated, as the previous immersive plan was.
- 2026-10-05 — Wave 4 complete. The owner merged Task 12 as PR #100 (`e8703ee`). **Checkpoint W4 passed** on `main` at `e8703ee`, in a clean worktree with a fresh `npm ci`. `npm run validate` was green: docs:check (292 files, 98 IDs, 38 Skills), 291/291 unit tests, lint 0 errors, typecheck, and a build of 22 pages. The documentation matched the implementation, except for the open Founder item, which the owner then decided (see Deviations, "Owner decisions after Task 12"). A follow-up branch, `codex/sky-chart-w4-founder-plate`, applies that decision and the two others: it puts Founder on an atlas plate, marks the acceptance record APPROVED and fixes the two stale code comments. **Criterion 1 of section 29 (Tasks 1–12 merged, W0–W4 recorded) is met once the owner merges that follow-up.** The section 14 hardware-GPU gates and the other manual parts listed in the acceptance record's definition-of-done table remain not met (DEFERRED), as the acceptance record's definition-of-done table states.

## Important implementation decisions

- **Isolated Playwright servers per worktree (2026-09-24).** `playwright.config.ts` reuses an existing server locally (`reuseExistingServer: !isCI`). A concurrent task could therefore test another worktree's dev server on the default port 3100. Every task that runs Playwright locally sets a unique `PLAYWRIGHT_PORT` (`3100 + task number`, e.g. `3103` for Task 3) and states it in its receipt.
- **Wave 2 integration contract (2026-09-24).** The four Wave 2 tasks share a page but not files. Four rules keep each PR independently mergeable in the section 24 order (8, 7, 9, 6):
  1. **Non-owned spec failures are escalated, never edited.** If a task's change breaks a spec it does not own, it stops and reports the spec, the assertion and the cause to the orchestrator. It never edits, skips or weakens that spec. The orchestrator then decides between a recorded transitional failure and a lock transfer.
  2. **The call-site prop change moves to Task 7** (see Deviations). Task 8 keeps the `<ImmersiveEnhancement>` element's four existing props.
  3. **Tasks 6 and 7 finish on a rebased branch.** Both develop in parallel from the orchestration commit. Each runs its final verification and opens its PR only after rebasing onto the Wave 2 PRs that merge before it: Task 7 after Task 8; Task 6 after Tasks 8, 7 and 9. Task 6's readout and `aria-current="location"` tests read Task 8 and Task 9 markup (`data-readout`, `#impact`), so they can only pass after that rebase. Until then they stay RED, which is valid RED evidence.
  4. **Local ports:** Task 6 uses 3106, Task 7 3107, Task 8 3108 and Task 9 3109.
- **Hero bottom edge for D-25 and D-27 (2026-09-25, Task 7 Phase A question).** The runtime measures “the hero's bottom edge” as `getBoundingClientRect().bottom` of the hero element `[data-instrument] > section[aria-labelledby="home-heading"]` (Task 8's markup). It does not use the top of `[data-instrument-chapters]` as a proxy, because any gap between hero and chapters would shift the D-27 mask and the D-25 hide line. The DOM contract gains this selector. `plateLabel` (`Plate {current}/04`) is the D-12 chapter plate number that Task 8 renders. The D-25 Pause readout (`Plate 0N of 04`) uses `statusLabel`. The runtime accepts `plateLabel` so that the agreed call-site signature stays unchanged.

## Deviations discovered during execution

- **Task 1 provider substitution (2026-09-23).** Task 1 was dispatched from a Claude Code orchestrator that cannot route work to GPT-6 Luna. Because the task is documentation-only and low-risk, Claude Sonnet 5 implements it. To keep implementation and review separate, the reviewer is an independent Claude Opus 5.5 agent with a fresh context, followed by the owner. The routing for Tasks 2–12 in section 18 is unchanged; the orchestrator re-evaluates the same constraint at each dispatch.
- **Supersession list incomplete (2026-09-24, found by the Task 1 independent review).** The plan's original nine-item list for Task 1 missed approved Home rules that the D-rules change. The biggest omission was the removal of the derived Azure sculpture. The RFC had turned that gap into a “nothing outside it changes” assurance. The orchestrator extended the Task 1 packet to eighteen items, banned completeness claims, and extended Task 2's scope and section 8 to match. It also restored the retained ADR main-thread gate in section 14, reordered D-26 before D-27, and removed a working-tree-dependent file count from section 3. Apart from one item, the plan now only states consequences it had left implicit. The exception is the withdrawal of the ADR's optional Connection-film permission (item 17). That is a real architecture decision, surfaced to the owner at G1 rather than taken by the plan. The second review round also aligned Task 2's scope with the whole supersession list and relabelled the film in section 30.
- **Task 2 provider substitution and RFC lock transfer (2026-09-24).** The GPT-6 Luna constraint still applies, so Claude Sonnet 5 implements Task 2 under the same Task 1 arrangement, and an independent Claude Opus 5.5 agent reviews it. Following repository convention for accepted RFCs, Task 2 also takes a lock transfer for `docs/rfcs/sky-chart-visual-system-v2.md`, `docs/rfcs/index.md` and `docs/reviews/sky-chart-direction-2026-09-23/index.md`, limited to recording acceptance (status APPROVED plus a dated approval line) and, for the review record, the Gate F Figma URL. Task 1 has merged.
- **Wave 1 provider substitution (2026-09-24).** The GPT-6 Luna constraint still applies. Tasks 3, 4 and 5 go to three independent Claude Sonnet 5 agents, each reviewed by an independent Claude Opus 5.5 agent and then the owner.
- **`instrument.statusLabel` value change moved from Task 4 to Task 8 (2026-09-24).** Appendix A changes the *rendered* `statusLabel` (`PHASE {current} OF 04` → `Plate {current} of 04`; `ETAPA {current} DE 04` → `Lámina {current} de 04`). Task 8 owns `ImmersiveChapter` and `tests/e2e/immersive-home-static.spec.ts`, which asserts the current value. Changing the value in Task 4 would break that test and contradict Task 4's “no rendered change” rule. So Task 4 adds every other Appendix A key and leaves the `statusLabel` values unchanged. After Task 4 merges, Task 8 takes a narrow lock transfer for the two `instrument.statusLabel` lines in `app/(es)/_content/home.ts` and `app/(en)/en/_content/home.ts`, and the matching assertions in `scripts/homepage-content.test.mjs`. It changes them together with its own spec.
- **Coordinates use the ASCII apostrophe (2026-09-24, Task 4).** Appendix A and PAGE-HOME write `34°36′S · 58°22′W` with the prime U+2032. The shipped Instrument Sans subset lacks U+2032, and `scripts/brand-assets.test.mjs` rejects uncovered content characters. The orchestrator chose U+0027 (`34°36'S · 58°22'W`), the standard plain-text substitute for the prime in degree-minute notation. The string is decorative and `aria-hidden`. Task 12 updates Appendix A and PAGE-HOME to match.
- **Chart-label legibility ladder (2026-09-24, Task 5 review S4).** Section 12's two-step rule (12 user units at ≥768, 24 below) renders labels at about 9.5px at 1024 and about 9.4px at 320. It is replaced by the container-query ladder now noted in section 12, which keeps rendered labels at 12px or more. Below 300px, where full names cannot fit legibly (about 236px of figure at a 320px viewport), each marker carries a numeral key and the source list below becomes the matching numbered list, so D-04's mandatory direct labelling survives as keyed labels. **This is a design decision, not only a spec fix** (Task 3 review S1 corrected the earlier wording). The orchestrator took it to unblock Task 5, and the owner confirms or overrides it when merging PR #80.
- **Hover-contrast figure corrected (2026-09-24, Task 3).** The Task 3 packet stated “Bone ≥7 on `#0A55A3`”. The true WCAG ratio for these approved values is 6.84:1: comfortably AA (4.5:1) for 16px semibold action labels, but not 7:1. The test asserts ≥6.5 and records the exact figure. No design value changes. Task 12 corrects any record that repeats the 7:1 claim.
- **Pre-existing dev-server race in parallel e2e runs (2026-09-24, W1 checkpoint).** Under parallel workers, `next dev` sometimes fails to compile one project-detail route with `SyntaxError: Unexpected end of JSON input`. This happens on `/proyectos/the-system/` or `/en/work/the-system/`, and the header navigation assertion in `marketing-navigation.spec.ts` then fails. It reproduces on the pre-Wave-1 base `102ef5b` and disappears with `--workers=1`. Task 3 hit it too (PR #81). This is not a Wave 1 regression and it does not block W1. CI uses 2 workers and 1 retry. Task 11 owns it if it appears on CI.
- **Local lint evidence needs a clean tree (2026-09-24, W1 checkpoint).** In the primary checkout, `npm run lint` reports 806 errors. They all come from untracked agent worktrees under `.claude/worktrees/`, which `eslint.config.mjs` does not ignore (it ignores `.worktrees/**`). Tracked files have 0 errors. Checkpoints therefore run in a clean worktree. The ignore-list fix is outside this plan's owned paths.
- **Wave 2 provider substitution (2026-09-24).** The GPT-6 Luna constraint still applies. Four independent Claude Sonnet 5 agents implement Tasks 6, 7, 8 and 9. Section 23 forbids a provider from reviewing its own task, and Sonnet 5 implements all four. So every Wave 2 review goes to an independent Claude Opus 5.5 agent, including Tasks 8 and 9, whose planned reviewer was Sonnet 5. Then the orchestrator's `visual-qa` fidelity check runs (Tasks 6–9), and finally the owner reviews.
- **`<ImmersiveEnhancement>` call-site props move from Task 8 to Task 7 (2026-09-24).** Task 8's packet has it pass the agreed runtime props (`labels`, `plateLabel`, `statusLabel`, `pauseLabel`, `resumeLabel`, `locale`, `sequences`). Only Task 7 can add those props to `ImmersiveEnhancementProps`, and Task 8 merges first. If Task 8 passed them, `npm run typecheck` would fail on its branch. So Task 8 leaves that one JSX element's props unchanged. After rebasing onto the merged Task 8, Task 7 takes a narrow lock transfer for that element's props in `ImmersiveHomeSequence.tsx` and adds the new props there. The agreed signature is unchanged.
- **Transitional old-runtime failures between PR 8 and PR 7 (2026-09-24).** Task 8 deletes static DOM that the *old* runtime and its Task-7-owned specs read: `[data-instrument-artwork]` (e.g. `immersive-home-acceptance.spec.ts`, the frame-coverage test) and the `enhancement*` classes in `immersive-home.module.css`. Task 7 replaces that runtime and those specs, and Task 8 must not edit them. PR 8 therefore lists each failure confined to a Task-7-owned spec as an expected transitional failure, with the removed element that causes it. Failures anywhere else block PR 8. The owner merges PR 7 directly after PR 8. W2 requires all projects to be green.
- **Instrument baseline lock transfer to Task 6 (2026-09-24).** `immersive-home-static.visual.spec.ts` captures `[data-instrument]` as an element screenshot. Task 8 pulls the hero up under the header (D-11), so the header's pixels fall inside that capture. Task 6's App Bar restyle therefore changes Task 8's baselines. Task 6 merges last. After rebasing, it takes L-07 for `tests/e2e/visual/immersive-home-static.visual.spec.ts-snapshots/`, limited to refreshing snapshots that diff, with owner approval in PR 6. The spec file stays Task 8's.
- **T-07 supersedes a Task 4 render-quality assertion (2026-09-25, Task 7).** `scripts/immersive-home-state.test.mjs` (the “caps device-pixel ratio and reduces detail by width and capability” test, Task 4's file, merged) asserts the old `signalCount`. It also asserts that a constrained device renders less detail “at any width”. T-07 replaces signals with field stars: 520 wide, 260 compact, and 160 when compact and constrained. A wide but constrained device therefore keeps 520 stars and only loses DPR (capped at 1.25). Task 7 takes a narrow lock transfer for that one test. It replaces the two `signalCount` assertions with exact `starCount` assertions (wide 520, compact 260, compact and constrained 160, wide and constrained 520) and keeps every DPR assertion. The only behaviour removed is the old rule that constrained devices get less detail at every width. The approved T-07 dropped that rule; this is not a weakened test.
- **`body` background lock transfer to Task 8 (2026-09-26).** `app/globals.css` gives both `html` and `body` the background `#F9F6EE`. When `body` paints its own background, that paint covers every negative-z layer of the root stacking context. D-01's ground (−3), canvas (−2) and scrim (−1) were therefore invisible. Task 8 first worked around this with `isolation: isolate` on `[data-instrument]`. The orchestrator rejected that fix for two reasons:
  1. It would hide Task 7's canvas, which T-04 portals to `document.body`.
  2. A non-positioned element with isolation paints as a z-index 0 layer, so the fixed ground would cover the later Home sections.

  Instead, Task 8 takes a narrow lock transfer on `app/globals.css` (L-02): it removes only the `body` background declaration. `html` keeps `#F9F6EE`, which becomes the canvas background, so every page renders unchanged. Negative-z layers then paint above it, as D-01 intends. Task 8 adds RED-first assertions that `body` is transparent and that the ground is visibly dark at 1440 and 390. It also re-runs the non-Home visual baselines to show that no other page changes. **This overrides L-02's “read-only after Task 3” rule, so the owner confirms it in PR 8.**
- **D-22 no-backdrop-filter fallback stays in Task 6's files (2026-09-26).** Task 6 first recorded the `.94` fallback fill as unimplementable, because `globals.css` is locked. It is implemented instead inside `SiteHeader` with Tailwind's `supports-[not_(backdrop-filter:blur(1px))]:` variant. The Home-top `data-docked="false"` override still wins.
- **Shared git stash incident (2026-09-25).** The git stash stack is shared by every worktree. A Wave 2 agent ran a bare `git stash pop` and applied another task's stash in its own worktree. This probably also explains why Task 9 files briefly showed up as uncommitted edits in Task 8's worktree; the orchestrator removed them there, with a backup. The orchestrator checked every recovered entry (`recovery/task6-mine-f6d9b15e`, `recovery/task7-stash-7e22a7ab`, `recovery/task8-stash-4d18af2e`) against the task commits: each is an older snapshot of work those tasks committed later, so nothing was lost. The owner decides when to delete those branches and stash entries. Rule from now on: agents never use bare `git stash`; they use WIP commits instead.
- **Home `html` background (2026-09-26, Task 8, PR #82 review N5).** On Home only, `:global(html):has(.ground)` sets `html` to `#0E2B4A`, the lightest D-02 ground stop, in `immersive-home.module.css`. There are two reasons:
  - If the fixed ground ever fails to paint, light Home text still sits on a dark colour.
  - Axe measures contrast against the root background, because the fixed ground is not an ancestor of the text. It now measures against the conservative, lightest ground colour.

  Other pages keep Bone. Without `:has()` support (Firefox < 121, Safari < 15.4), `html` stays Bone while the ground and scrim still paint, so the page degrades safely. The only side effect is navy overscroll below the Bone footer on Home. This is a design-level addition, and the owner confirms it in PR #82.
- **D-11 trust-row width (2026-09-27, orchestrator fidelity check on PR #82).** The approved availability sentence is longer than the reference prototype's placeholder. Inside the reference's 760px trust-row cap it wraps to a second line in both locales. The hero is bottom-aligned, so the extra line lifted the H1 about 50px, into the runtime's "Orders" label. D-11 does not specify that cap. Task 8 removed it, so both items share one row at 1440, and a test pins that. The runtime and copy are unchanged.
- **Hero top versus header top (2026-09-27, PR #82 review N3).** The Task 8 packet's RED 1 says “hero top equals header top”. That equality only holds with Task 6's 84px App Bar, and Task 6 merges last. Task 8 therefore asserts `margin-top: -84px` and hero top ≤ header bottom. **Task 11 asserts `|heroTop − headerTop| ≤ 1` after W2.**
- **Linux baselines adopted from CI under owner instruction (2026-09-27).** The owner told the orchestrator to fix PR #82's CI failures. Under T-11, the orchestrator adopted the Ubuntu `actual` images for the ten instrument captures (run 36290246239). After the trust-row fix, it re-adopted three of them (run 36337351854). Each image was byte-identical across attempt and retry, and was inspected against the approved Windows baseline.
- **Stacked Wave 2 PRs and deploy sequencing (2026-09-27, PR #82 review B1).** `deploy.yml` publishes every push to `main` and has no concurrency group. With #82 merged alone, the *old* runtime's canvas renders over the whole hero, because its `enhancement*` classes are gone. The old status span also fails axe on the dark ground. So PR 7 is opened as #83, **stacked on #82**, and PR 9 stacks on #83, which lets CI prove each combined state before any merge. The owner merges #82 only once #83 is green and reviewed. The owner then lets #82's deploy finish, or cancels it, and merges #83 immediately after. D-03's scrim-opacity animation (D-24) was left unimplemented by Task 8, so Task 7 implements it in its own `ImmersiveEnhancement`.
- **`measure:immersive` remount lock transfer to Task 7 (2026-09-27).** The script's `remount()` helper leaves Home through the header link while scrolled deep, then calls `page.goBack()`. That restores a scroll position where `[data-instrument]` is fully above the viewport. The runtime's near-viewport activation gate then correctly declines, and the helper times out waiting for `webgl`. The W2 checkpoint needs this script, but its owner, Task 11, comes later. So Task 7 takes a narrow lock transfer for `remount()` in `scripts/measure-immersive-production.mjs`: it scrolls to the top after `goBack()`, before waiting for `webgl`. Nothing else in the script changes, and no budget changes.
- **Gap for Task 11: Home sections at 768 (2026-09-27, Task 9).** `playwright.config.ts` (Task 3) does not register `home-sections.spec.ts` for `tablet-portrait-chromium`. The 768 width was therefore checked only by eye in Task 9. Task 11 covers 768 in its Home-sections visual spec, or through a registration it gets as a lock transfer.
- **Task 9 REFACTOR folded into GREEN (2026-09-27).** The `HomeSection` shell was written in the GREEN commit. There is no separate REFACTOR commit, and the receipt discloses this.
- **Stacked PRs got no CI and merged out of review order (2026-09-27/28).** `ci.yml` runs only on pull requests into `main`, so the stacked #83 and #84 never ran CI. The orchestrator's recorded premise, that stacking lets CI prove each combined state, was wrong. #82 merged and deployed alone at 19:01Z, which briefly shipped the old runtime's canvas over the hero (review B1). #83 then merged into the Task 8 branch rather than `main`, and later reached `main` through #85, together with #84, before its independent review (CHANGES REQUESTED) had been addressed. **From now on, every Wave PR targets `main` and merges only after its own CI and review pass. No stacked PRs.**
- **Static-only hotfix (2026-09-28, owner decision).** The #83 review found three blocking defects:
  - B2: the Pause pill's `hidden` attribute is overridden by Tailwind's `flex`, so it covers the hero trust row.
  - B3: Pause freezes the recede.
  - B1: the frame-time budget is breached under software rendering.

  An orchestrator hotfix PR (branch `codex/sky-chart-hotfix-static-home`) therefore stops `ImmersiveHomeSequence` from mounting `<ImmersiveEnhancement>`. Home in production is the reviewed static composition: ground, scrim, hero and plates, with no canvas. The runtime modules stay in the tree. The three runtime specs carry a `test.skip` with this reason, and a hotfix test asserts that Home stays static with motion allowed. It also refreshes five instrument baselines whose bottom pixel row changed when Task 9 made the following section transparent. **The Task 7 follow-up restores the element, removes the skips and the hotfix test, and fixes every blocking and should-fix item from the #83 review.**
- **Performance governance: software renderers go static, and frame timing is measured on hardware (2026-09-28, owner decision (d)+(a)).**
  - **The finding.** The #83 review measured, on a quiet machine, a frame-interval p95 of 100–117 ms and interaction long tasks of 56–279 ms, against gates of ≤20 ms and <50 ms. The old runtime measured 16.7 ms with the same method. Controlled experiments put the cost in compositing a full-viewport, per-frame-changing WebGL layer under the full-viewport scrim and backdrop-filter plates, inside SwiftShader. The runtime's JavaScript takes ≤2 ms per frame.
  - **The decision, keeping every budget unchanged (no budget is raised):**
    - (d) Software rasterizers fail the capability gate: SwiftShader, llvmpipe, and Microsoft Basic Render Driver, detected through the unmasked WebGL renderer string. Those visitors get the static composition.
    - (a) The ≤20 ms p95 and <50 ms long-task gates are measured on hardware-accelerated GPUs: the section 26 manual protocol on real devices, plus any hardware-GPU runner. They are no longer measured on SwiftShader.
  - **What `measure:immersive` still gates.** It keeps SwiftShader and still enforces the JS budget (≤120 KiB), CLS, and the canvas and listener lifecycle counts. It reaches the runtime through an explicit test-only override of the software gate. It records its frame numbers as advisory only.
  - **Records and implementation.** The Task 7 follow-up amends `ADR-SKY-CHART-HOMEPAGE-RUNTIME` (capability gates and performance measurement) and sections 10 and 14 of this plan. It then implements the gate and the harness override, test-first.
- **Task 7 follow-up scope and decisions (2026-09-28, from the PR #83 review).** The follow-up branch `codex/sky-chart-task-7-followup` starts from the hotfix. It reverts the hotfix (restoring the element and removing the skips and hotfix tests), then fixes the following, each test-first:
  - **Blocking:**
    - B2: `hidden` must actually hide the Pause pill. Assert `toBeHidden`/`toBeVisible`, and check keyboard reachability at scrollY 0.
    - B3: while paused, keep measuring, recede and pill visibility running; skip only the camera target.
    - B1: the software-renderer gate and test-only override from the amended ADR.
  - **Should-fix:**
    - N1: the webkit smoke test must poll until mode and canvas agree.
    - N2: the lifecycle test timeout.
    - N5: create the WebGL2 context directly, return quietly when it is null, and restore the console-error assertions.
    - N7: expose draw calls, pixel ratio and label-texture sizes on the debug hook.
    - N8: route recede-band label renders through the controller.
    - N9: stop activation if context loss happens during `prepare()`.
    - N10: observe `documentElement` for resize.
    - N11: release the probe context.
    - N4: correct the claim that the `react-dom` shim is scoped. The shim is global. Keep it and record that it must be deleted once `@types/react-dom` is approved; adding that package is an L-01 owner decision.
  - The follow-up also records every fix commit that had no RED test first as a deviation.
  - **Decisions taken here, for the owner to confirm in the follow-up PR:**
    - **(N12) Pause tab position.** DESIGN-IX-A11Y and section 13 put Pause last, after the CTA actions. But D-25 hides Pause whenever the page has receded, which is always the case by the CTA, so a last position is unreachable. Pause therefore stays right after the chapters' last focusable element, which is the only position consistent with D-25. Task 12 corrects the tab-order sentence in both records.
    - **(N13) Recede without the canvas.** Section 11 says recede is instant under reduced motion. But only the runtime writes scrim opacity, so no static path ever recedes. In every static path that has JavaScript (reduced motion, Save-Data, no WebGL2, the software gate and failures), `ImmersiveEnhancement` applies the D-24 scrim recede instantly, with no canvas and no transition. Without JavaScript the scrim stays static.
    - **(N14) Hero text exclusion.** At ≥768px, tier-2 labels whose projected rectangle intersects the hero's text column fade to opacity 0 while the hero is in view. This extends D-27's mask from "below 768" to "wherever a label would overlap hero text". The reference itself places Messages against the trust row.
    - **(N6) Coverage removed by the rewrite.** The rewrite dropped several checks. Task 7 restores the cheap ones in its own specs: axe in the paused state; language-switch reactivation with console and asset checks; the no-video check; the smoke `h2` count. Task 11 restores the multi-viewport journey, rotation during Connect and 200% zoom in `sky-chart-acceptance.spec.ts`.
  - **Lock transfer.** `scripts/measure-immersive-production.mjs` is extended to cover three things: setting the software-renderer override through `addInitScript`; the `remount()` race fix (re-issuing `scrollTo(0, 0)` inside the wait predicate while `scrollY > 0`); and reporting frame and long-task numbers as advisory, not failures. The JS-budget, CLS and lifecycle gates are unchanged.
- **OpenAI reviewers run on GPT-5.6 (2026-09-28, owner decision).** The owner asked for GPT-6 Sol and GPT-6 Luna through the Codex plugin. With a ChatGPT-account login, Codex rejects `gpt-6-luna` ("not supported when using Codex with a ChatGPT account"), and the refreshed model list offers only `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5` and `gpt-reserve`. The owner chose GPT-5.6 Luna and GPT-5.6 Sol. GPT-5.6 Luna reviewed PR #89 over two rounds: CHANGES REQUESTED, then APPROVE WITH CONDITIONS, with the condition met by a controlled A/B. Codex's local sandbox helper was missing, so its reviews read GitHub and ran no commands. Wherever the plan names GPT-6 Luna or Sol, the substitution stands until GPT-6 is available on this login.
- **Non-Home visual baselines change with the App Bar's backdrop-filter (2026-09-28, PR #89).** Task 6 left the studio, founder and services-projects specs untouched, yet all twelve failed on Windows and on Linux. The actuals keep the same dimensions and a zero vertical shift; only glyph antialiasing differs, across the whole `main` capture. A same-machine A/B settles the cause: removing only `[data-app-bar-surface]`'s `backdrop-filter` restores `main`'s baselines (0–2 differing pixels, against 85k–173k with it). The owner approved adopting 22 Linux baselines from CI actuals (run 36477273757 then passed) and regenerating the twelve win32 baselines.
- **W2 follow-ups for Task 11 (2026-09-28).**
  1. **`measure:immersive` counts separately budgeted Home JavaScript.** "Immersive JS" is computed as the whole Home page's JavaScript minus a fixed baseline from `ff6eadf`. The ADR budgets `PositionFixToggle` and `AppBarBehavior` separately (≤6 KiB combined), but the script also counts them, and the other Home JavaScript added since, against the 120 KiB runtime gate: 114.4 KiB instead of the runtime chunk's 108.1 KiB. Task 11 makes the script gate the ADR's definition, the lazy runtime chunk plus `three`. It keeps the whole-page delta as a reported figure, and re-baselines whenever shared chunks change. **No budget changes.**
  2. **CLS is attributed to the whole page, not to the enhancement.** Its only source is one font-swap layout shift at about 265–335 ms, before the runtime import starts. That shift reflows the App Bar navigation group, the hero coordinate line, the trust row and a hero action. The ADR gate is "layout shift *from the enhancement*: 0", which holds. Task 11 attributes shifts to the enhancement, for example by counting only shifts after `immersive:import-start` or by excluding font-swap sources. It also records the font-swap shift under `measure:home-vitals`, where CLS is a whole-page metric; the value is ≤0.0019, far inside the 0.1 "good" line. Any font-fallback metric tuning touches `app/**/layout.tsx`, which is forbidden to every task, so it needs an owner decision.
  3. **Local parallel flakes.** Under two local workers, the `the-system` dev-server race and load-sensitive immersive tests (resize, language switch) fail occasionally and pass serially. CI's Linux run with one retry is green. Task 11 hardens these tests, or documents serial local runs.
  4. **Checkpoint procedure on Windows Git Bash.** MSYS path conversion rewrites `NEXT_PUBLIC_BASE_PATH=/Portfolio` into a Windows path, and `next dev` then fails with "Missing parameter name". Set `MSYS2_ENV_CONV_EXCL='NEXT_PUBLIC_BASE_PATH'`, or run from PowerShell.
- **Task 11 owner decisions (2026-10-04, PR #92).**
  - **E1: D-08 is measured per section.** The plan gate ("≤3 backdrop-filter surfaces per viewport, E2E DOM scan at each section") passes everywhere. A half-viewport sweep finds brief overshoots of 4, and once 5 at 768 EN, while a viewport straddles two sections (Problems and Services, or Services and Position fix). The owner reworded D-08 to the per-section gate. The acceptance spec gates ≤3 at each section, and keeps the sweep as an informational regression guard capped at 5. Task 12 updates DESIGN-VISUAL D-08.
  - **E2: the web-font swap is fixed under a narrow exception to the `app/**/layout.tsx` ban.** On the throttled mobile lab profile, whole-page CLS was 0.178. The cause: `next/font/local` falls back to Arial scaled to IBM Plex Mono's average width (131%), so the mono text wrapped differently before and after the swap. The owner allowed a change limited to the font setup. Only `app/fonts.ts` changed: Plex Mono gets `adjustFontFallback: false` and a metric-compatible `Courier New`, `Liberation Mono`, `monospace` fallback. The layouts were not touched.
    - Results: throttled-mobile CLS fell to 0, and desktop is 0.0436 (the Instrument Sans `ch`-width swap).
    - `measure:home-vitals` now fails whole-page CLS above 0.1.
    - This supersedes the W2 follow-up note that font tuning needed an owner decision.
  - **E3: baselines.** The owner approved the 42 new Home-sections baselines, and the 10 instrument baselines refreshed by Task 11's header-height fix. That fix makes `header[data-app-bar]` exactly `--app-bar-height` tall; the hero sat 2px off before.
    - CI could not produce their Linux actuals: 52 missing baselines pushed the browser job past its 20-minute limit. With owner approval, the orchestrator used a throwaway draft PR (#95: this branch plus a visual-chromium-only config, never merged). Its two runs produced pixel-identical captures for all 52.
  - **E5: the Bayer letters are set in a serif Greek stack, which amends D-13.** The Plex Mono subset has no Greek. After E2, α, β and γ fell back to a small Courier glyph. The owner chose a dedicated stack: `Georgia, 'Times New Roman', 'Noto Serif', serif` at 17px, Azure, no uppercase, `aria-hidden`. Printed star atlases set Bayer letters this way. D-13's "mono 15px" changes accordingly. The change is a narrow lock transfer on Task 9's `HomeProblems.tsx` (that span only), with a RED test in `home-sections.spec.ts`. The six Problems baselines are regenerated. Task 12 updates DESIGN-VISUAL D-13.
  - **Hero caps in em, not ch (owner decision, 2026-10-04, extends E2).** With E2 in place, Linux CI still measured font-swap CLS 0.152 at EN 1440. D-11's caps were set in `ch`, which follows the face on screen, so in the fallback face the H1 cap was about 16% narrower (716px against 851px at 1440) and the headline re-wrapped when Instrument Sans arrived. The H1 cap is now 8.866em and the lede cap 30.636em, the exact Instrument Sans Bold and Regular equivalents measured in the browser. The loaded layout is unchanged, and no baseline changed. A RED test asserts that both computed caps stay within 0.5px across the swap. The change is a narrow lock transfer on `immersive-home.module.css`, limited to those two declarations. Task 12 records D-11 in DESIGN-VISUAL as "13ch/46ch of Instrument Sans, set in em".
  - **Brag skill description (2026-10-04).** `docs:check` requires non-vendored skill descriptions to begin with "Use when". `.agents/skills/brag/SKILL.md` (`abdfb15`) reached `main` without that, which broke `npm run validate` everywhere. The owner approved a one-line fix, PR #97.
  - **CI browser budget (2026-10-04).** With the acceptance matrix, the full Playwright run takes about 20–23 minutes. The owner raised the browser job's `timeout-minutes` from 20 to 30 (PR #96).
  - **Cross-platform fallback for Instrument Sans (owner decision 2026-10-05, extends E2 and L-02 narrowly).** Even with the `em` hero caps, Linux CI still measured font-swap CLS 0.152 at EN 1440. A diagnosis run with source rectangles (throwaway draft PR #98, never merged) showed the cause: the hero content block shrank from 747px to 604px tall on the swap, and the App Bar navigation group narrowed.
    - **Why:** `next/font`'s adjusted fallback is a single `@font-face` on `local(Arial)`. Linux, Android and ChromeOS have no Arial for `local()` to match, so the hero fell to an unadjusted, wider system sans until Instrument Sans loaded. The Windows-based lab profiles could not see this. It very likely affects real Android visitors.
    - **Fix:** `app/fonts.ts` adds `Instrument Sans Metric Fallback` after `next/font`'s own fallback. `app/globals.css` declares that family over `local()` Liberation Sans, Arimo, Roboto, Helvetica and Arial, with `next/font`'s overrides: `size-adjust` 103.22%, `ascent-override` 93.97%, `descent-override` 24.22%, `line-gap-override` 0%.
    - **Evidence:** `scripts/font-fallback.test.mjs` (RED first). Windows is unchanged: font swap 10/10, visual 64/64, no baseline change. The Linux font-swap group passes 10/10 (run 37304538202).
    - **Still open:** Roboto and Helvetica are approximate rather than metric clones. The section 26 real-Android check must confirm there is no visible hero jump on a slow load.
- **Task 12 provider substitution and base (2026-10-05, W3).** At its last use (PR #89, see "OpenAI reviewers run on GPT-5.6"), the Codex route could not run local commands, and Task 12 must run `npm run docs:check` and `npm run validate`. So Claude Sonnet 5 implements Task 12 under the Wave 1 arrangement, and an independent Claude Opus 5.5 agent reviews it, then the owner. Task 12's branch starts from the W3 checkpoint commit, which carries the W3 record that the plan's move to `completed/` must preserve. Its PR targets `main` and opens only after the W3 checkpoint PR merges. It is not stacked.
- **Task 12 record corrections (2026-10-05).** Each item below was assigned to Task 12 by an earlier Deviations entry or by PR #92. Where a record lived in a path Task 12 does not own, the correction is only a link or a dated note.
  - **Coordinates:** Appendix A, D-11 and PAGE-HOME now write `34°36'S · 58°22'W` with the ASCII apostrophe (Task 4 entry).
  - **Hover contrast:** the Task 3 packet's "Bone ≥7 on `#0A55A3`" carries a correction note, and DESIGN-VISUAL D-04 records 6.84:1. No other record repeated the 7:1 claim.
  - **N12:** the Pause tab-order sentence is corrected in section 13 and in DESIGN-IX-A11Y. Pause follows the chapters' last focusable element, so it sits after the hero actions and before the Problems action.
  - **E1, E5 and the `em` caps:** D-08, D-13 and D-11 carry dated amendment notes here and the matching text in DESIGN-VISUAL. D-10 and D-22 record the exact 84px header box and the 66px (≥1024) or 62px bar surface inside it.
  - **Section 14 and the ADR:** this plan's section 14 and the ADR's gate table carry the measurement notes from PR #92. The ADR note is a dated amendment, and no budget changes.
  - **Fonts:** DESIGN-VISUAL records that Plex Mono uses a real monospace fallback (`Courier New`, `Liberation Mono`, `monospace`, `adjustFontFallback: false`), that Instrument Sans keeps `next/font`'s adjusted fallback plus the `Instrument Sans Metric Fallback` family, and that the Plex Mono subset has no Greek.
  - **Testing records:** `docs/testing/playwright.md` and `docs/testing/visual-regression.md` gained entries for `sky-chart-acceptance.spec.ts`, `home-sections.visual.spec.ts` and `tests/e2e/support/*`, under a lock transfer from the orchestrator limited to those entries.
  - **DESIGN records are not marked IMPLEMENTED.** The status vocabulary is APPROVED, PROPOSED, OPEN and REJECTED. Earlier delivered plans left their DESIGN records APPROVED, and only `docs/index.md` carries an "IMPLEMENTED" heading. Task 12 follows that: the `SKY-CHART-V2` sections stay APPROVED and `docs/index.md` gains a "Sky Chart Home and App Bar v2 — IMPLEMENTED, manual QA DEFERRED" section.
  - **Left for the owner:** two code comments still name the old plan path (`components/homepage/impact/position-fix.module.css` and `lib/impact/position-fix.ts`: `docs/plans/active/sky-chart-home-redesign-v2.md`). Both files are outside Task 12's paths, so the comments now point at a moved file. A later code change can update them. *Resolved 2026-10-05: see "Owner decisions after Task 12" below.*
- **Task 11 findings recorded at close (2026-10-05).** These were in PR #92's description, not in this section.
  - **Hero top versus header top, closed.** The 2px gap (N3) was real at every width and in every mode. `header[data-app-bar]` is now exactly `--app-bar-height` tall (RED `fb7e722`, GREEN `04c6d01`), and `sky-chart-acceptance.spec.ts` asserts `|heroTop − headerTop| ≤ 1` at five widths with the runtime, and at 1440 and 390 without JavaScript. The ten instrument baselines moved by 2px at the header and the fixed poster edge, and the owner approved them (E3).
  - **Gap for Task 11, closed.** Home sections at 768 are covered by `home-sections.visual.spec.ts` (1440, 768 and 390, both locales).
  - **N6 coverage, restored** in `sky-chart-acceptance.spec.ts`: the multi-viewport journey, rotation during Connect, and 200% zoom (720×450, 512×384 and 384×512).
  - **W2 follow-ups.** 1 is closed: `measure:immersive` gates the lazy runtime chunk plus `three` (108.1 KiB) and reports the whole-page delta (114.4 KiB). 2 is closed: shifts are attributed to the enhancement, whole-page CLS is gated at ≤0.1 in `measure:home-vitals`, and the font-swap cause was fixed under E2, which supersedes the note that font tuning needed an owner decision. 3 is mitigated, not eliminated: `gotoResilient` retries a 5xx from the `next dev` race, slow journeys use `test.slow()` and eased polls use a 20 s budget. Local two-worker runs can still flake under load; the W3 `/Portfolio` run had one such webkit contact failure. 4 stands as written.
  - **Page-video recorder hang.** Two full-page navigations at once hang when Playwright records video while SwiftShader composites the canvas. `immersive-home.spec.ts` and `sky-chart-acceptance.spec.ts` therefore set a top-level `video: 'off'`. They still record screenshots and first-retry traces. `playwright.config.ts` is untouched.
  - **Windows socket flake.** One local run saw `net::ERR_NO_BUFFER_SPACE` (socket buffer exhaustion) as a console error in the rotation test. It passed on the next run.
  - **Greek in the Plex Mono subset.** The subset has no Greek, which is what E5 works around. Adding Greek glyphs to the subset is an asset change that stayed outside this plan.
- **Owner decisions after Task 12 (2026-10-05).** After Task 12 and checkpoint W4, the repository owner decided the three items that Task 12 had left open. The follow-up branch `codex/sky-chart-w4-founder-plate` applies them.
  1. **Founder gets its atlas plate.** The owner's words: "Add the plate in the code in order to complete the implementation of the current plan. This will be later changed once the services-projects-footer-v1 execution plan is implemented." The code now matches D-05, D-18, supersession item 13 and plan section 2.
     - **Implementation:** `HomeFounder.tsx` wraps the whole 8fr/4fr grid, action included, in `<AtlasPlate as="div">` (default `blur`, no plate number). The kicker, the H2 (`id="founder-heading"`), the biography and the end-aligned ghost action are unchanged. The action keeps `ghostActionOnDarkClassName`, so it keeps the D-21 `sky.glow` ring.
     - **TDD:** RED `4cafc66` (`home-sections.spec.ts`, ES and EN: the kicker, H2, biography and action sit inside one `.sky-plate-material` element; it failed because `#founder` held no plate), then GREEN `7e7b35e`.
     - **Blur budget (D-08, per section):** the Founder section went from 0 to 1 backdrop-filter surface at 320, 390, 768, 1024 and 1440 (limit 3). The half-viewport sweep is unchanged, with a maximum of 4 at 768 and 1440 (informational cap 5), so the plate keeps the default blur.
     - **`HomeSection.tsx`:** only the doc comment above `homeDarkFocusRingClassName` changed. It said these actions are never inside an `AtlasPlate`, and it now names the Founder case.
     - **Baselines:** the six win32 Founder baselines (`home-founder-{spanish,english}-{1440,768,390}`) were regenerated. The taller Founder section also moves the Dawn CTA down the page by a fractional amount (112.4px at 1440). Two things follow: the ground gradient behind the CTA's transparent top 200px changes with its position, and the fractional page offset changes the capture's sub-pixel rounding (`home-cta-english-1440` went from 689 to 688px tall, and a footer-border row appears or disappears). So four win32 Dawn CTA baselines (`home-cta-spanish-390`, `home-cta-english-1440`, `-768` and `-390`) changed as well and were regenerated in a separate commit. The two Spanish CTA baselines at 1440 and 768 still pass unchanged. The Linux baselines are not changed here. The controller adopts them from CI after the owner approves.
     - **Expected to change again:** the Founder plate is a stopgap for this plan. It is expected to change under the `services-projects-footer-v1` execution plan.
  2. **The acceptance record is APPROVED at merge.** The owner's words: "Make it as APPROVED at merge." `REVIEW-SKY-CHART-ACCEPTANCE-V2` becomes `status: APPROVED`. This records the owner's acceptance of the record **with its deferrals**. It is not a manual pass: every section 26 item and both hardware-GPU gates stay DEFERRED.
  3. **The stale code comments are fixed in this follow-up.** The owner's words: "Fix them during a follow-up." `lib/impact/position-fix.ts` and `components/homepage/impact/position-fix.module.css` now cite `docs/plans/completed/sky-chart-home-redesign-v2.md`. Only the cited path changed.
  - **Lock transfers (L-07 and the file matrix), limited to this follow-up:** `components/homepage/HomeFounder.tsx`, the doc comment in `components/homepage/HomeSection.tsx`, and `tests/e2e/home-sections.spec.ts`, plus the six Founder and four Dawn CTA win32 baselines under `tests/e2e/visual/home-sections.visual.spec.ts-snapshots/`, all from Task 9 and Task 11; and the two comment lines in `lib/impact/position-fix.ts` and `components/homepage/impact/position-fix.module.css`, from Task 5. All locks are released when the follow-up merges.
- **Open after Task 12.** These are explicit, not hidden by the move to `completed/`:
  - **Owner decision: Founder has no atlas plate.** The implementation differs from approved D-05, supersession item 13 and D-18: `HomeFounder.tsx` renders the 8/4 grid without an `AtlasPlate`, although plan section 2, item 13, the RFC and DESIGN-VISUAL place Founder on an atlas plate. No owner decision is recorded. The owner either adds the plate (a code task) or amends the design through governance. *Resolved 2026-10-05: the owner chose to add the plate in code (see "Owner decisions after Task 12"). `HomeFounder.tsx` now renders on an `AtlasPlate`, and the services-projects-footer-v1 plan may change it again.*
  - **Resolved 2026-10-05: stale plan path in two code comments.** `lib/impact/position-fix.ts` and `components/homepage/impact/position-fix.module.css` now cite the plan under `docs/plans/completed/`.
  - The section 26 manual protocol (browsers, real devices, screen readers, preferences, content truth and design fidelity) is not performed. Section 3 promised that this plan would close the previous plan's three deferrals. The compact Pause placement is closed by D-25 and its tests, but the constrained-Android evidence and the real screen-reader check are still open.
  - The hardware-GPU gates (scroll frame interval p95 ≤20 ms and the interaction task <50 ms) have only advisory SwiftShader numbers.
  - The Instrument Sans fallback on Android uses Roboto and Helvetica, which approximate Arial's metrics rather than match them. The manual Android pass must confirm there is no visible hero jump on a slow load.
  - Firefox and WebKit never activate the runtime in headless automation (E4), so a real canvas in those engines is covered only by the manual checklist.
  - Real-device thermal behaviour and the press-scale question (section 30) remain OPEN.
