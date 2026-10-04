---
id: PLAN-SPF-V1
type: execution-plan
status: PROPOSED
plan_status: ACTIVE
related:
  - REVIEW-SPF-PLAN-2026-09-30
  - DESIGN-SPF-V1
  - RFC-SPF-REDESIGN-V1
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - REVIEW-SPF-DESIGN-2026-09-30
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-FOUNDER
  - IA-SITE
  - PROJECT-EVIDENCE
  - TEST-STRATEGY
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-30
---

# Services, Projects and Footer v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkboxes. These skills do not override the named implementation models, exclusive ownership, merged-dependency gates or human PR merges below.

**Goal:** Deliver the approved bilingual Atlas Services, complete inline Projects dossiers and branded shared Footer, with the Revision 5 connected background and definitive retirement of six project-detail URLs.

**Architecture:** Static server HTML and permitted evidence first. A separate, optional connected-studio controller/Three engine enhances Services/Projects behind their readable content. Keep current Home/App Bar behavior, localized static export, protected assets and local simulated Contact. All implementation arrives through human-merged PRs.

**Tech stack:** Installed Next.js 16.3.2, React 18.2.0, TypeScript 5.5.4, Tailwind 3.4.7, Three 0.186.0, existing Framer Motion 11.2.10, Node test runner and Playwright 1.63.0/axe. Exact installed guides, not remembered Next APIs, govern code. No dependency changes are planned.

**Spec:** [DESIGN-SPF-V1](../../design/services-projects-footer-v1.md), approved 2026-09-30 with linked exact ES/EN copy. [Exploration and Revision 5 media](../../reviews/services-projects-footer-design-2026-09-30/index.md), [retirement audit](../../reviews/services-projects-footer-design-2026-09-30/route-retirement-audit.md), [accepted RFC](../../rfcs/services-projects-footer-redesign-v1.md), [new ADR](../../decisions/connected-studio-page-runtime.md). The disposable prototype is a rendered reference, not production code to copy wholesale.

**Author/status:** Codex authored this plan after explicit design approval and planning authorization. This plan is PROPOSED for human approval. Independent plan review is a separate gate recorded below; neither that review nor this document authorizes implementation. No production code is changed in the planning session.

## Model routing

**APPROVED 2026-09-30:** The owner's model-routing instruction governs all dispatches for this plan. It approves these assignments; overall plan approval and human merge gates remain separate.

- **Claude Sonnet 5.5** leads Tasks 2–7 and 9: complex reasoning, contracts, lifecycle/race analysis, atomic migration, performance diagnosis, visual composition, 3D rendering and motion. It develops the strongest implementation within the approved Revision 5 design, exact copy, protected assets and budgets; design judgment does not reopen those requirements.
- **GPT-6 Luna (`gpt-6-luna`, medium)** implements Tasks 1 and 10 and the mechanical portion of Task 8. A Luna assignment must meet all three conditions: low reasoning demand, low implementation risk, and no visual, interaction, motion or architectural design judgment. Supply frozen inputs, exact owned paths, a finite checklist and checkable expected outputs. Closed copy transcription, receipt assembly and predetermined asset operations are eligible; a task is not low demand merely because its specification is detailed.
- **Task 8 handoff:** Sonnet first freezes capture poses/settings, label treatment, responsive asset matrix and picture/manifest wiring instructions from the merged scene. Luna performs capture, encoding, resolution-only derivatives and exact wiring. Sonnet inspects static-to-live continuity and owns any design correction or nontrivial loading/fallback defect. For either model to edit, transfer the same task's exclusive path locks serially and record the handoff; retain one PR and the existing dependency wave.
- **GPT-6.1 Sol (`gpt-6.1-sol`, high; xhigh for Task 9)** independently reviews every PR, including governance, media, documentation closeout and follow-up fixes. The reviewer is distinct from all contributors to that PR and checks the complete final diff, receipts, design fidelity and required validation. Re-review after material corrections. Owner visual/manual acceptance and human merge remain additional gates; neither Sonnet nor Luna replaces Sol as PR reviewer.
- Within a Sonnet-led packet, route every separable implementation subtask that meets all three Luna conditions to Luna as a bounded checklist batch. The packet lead keeps design, integration and complex test strategy. Preserve the declared write set, serialize overlapping edits and record each model's actual contribution in the receipt. If a Luna checklist exposes ambiguity, a race, a failed budget, a design decision or a nontrivial defect, route that work to Sonnet before continuing.
- Before dispatch, verify that the execution provider exposes the exact named model and record its actual provider identifier/settings. Resolve Claude Sonnet 5.5 through a provider that supports it; do not invent a Codex alias or assume a reasoning setting from another provider. If any required model is unavailable, record the routing failure and obtain owner authorization for substitution before that work begins. Future Skills/default models cannot silently replace these assignments.

## Global constraints

- Dedicated Services/Projects plus shared Footer; Founder alignment is MPC source/context. Home changes are permitted only for demonstrated wording/link consistency. No new Home-eligible project, Home scene rewrite, App Bar redesign, Contact transmission, backend, analytics or hosting change.
- Exact copy stays in [Services SPF-V1](../../product/pages/services.md#spf-v1-proposed-services-copy), [Projects SPF-V1](../../product/pages/projects.md#spf-v1-proposed-projects-copy-and-inline-presentation) and [IA SPF-V1](../../product/information-architecture.md#spf-v1-proposed-footer-copy-and-route-retirement). Heading slugs retain their historical “proposed” wording; item-level APPROVED markers govern. Do not paraphrase commercial exclusions, AI/ERP scope, evidence, captions or relationship limitations.
- Services retains three families and service IDs `web`, `whatsapp`, `consulting`. Fragments remain `web`, `whatsapp`, ES `consultoria` / EN `consulting`, ES `condiciones` / EN `working-boundaries`. Every compressed D05 service boundary and the complete commercial block remain visible ordinary HTML; new scan copy is additive.
- Projects renders exactly GRS first and The-System second, with complete context/problem/implemented scope/source/evidence/limitations and permitted concepts. No invented clients, metrics, live demos, operational billing or shared deployed architecture. MPC stays 2021 educational/group/fictional context on Founder. Busesfy blocked, Chrono retired, Documancer private remain excluded; no evidence permission changes.
- Retire `/proyectos/{general-reservation-system,the-system,mpc-administracion}/` and `/en/work/{general-reservation-system,the-system,mpc-administracion}/` definitively. No redirect, compatibility page or wildcard destination. Stable index fragments are `general-reservation-system` and `the-system`; unknown fragment locale switches land at the equivalent index. Historical records and negative absence tests may retain retired paths.
- Preserve the original two 1599×900 conceptual WebPs, exact alt/caption and meaning. Responsive derivatives may change resolution/compression only, never scene/crop/evidence. Delete MPC's unused public concept only after active-consumer absence; retain internal provenance. No generated visual is implementation proof.
- Colors: Abyss `#06121F`; opaque plate `#0A1E33`; plate border `#36536C`; Azure `#004589`; Bone `#F9F6EE`; Ink `#09243D`; accents `#6FA8E0`, `#9CC4EC`; secondary `#B9C3CC`. Existing self-hosted Instrument Sans/Plex Mono, approximately 1180–1200px container and ≥20px compact gutters. No global token rebrand.
- Wide ≥1024px; tablet 768–1023px; compact <768px. Required inspection widths 320, 390, 768, 1024, 1440; 200% zoom, landscape, touch, mobile chrome and long localized copy. Natural content height and native scroll; no pinned reading, hidden reveal, carousel or scroll interception.
- Field: 16 nodes/33 connections wide/tablet; eight/13 compact. Each of the eight exact localized capability words appears twice wide and once compact, with the same semantic legend. Desktop second orbit/skeleton; compact one ring/fewer points. Labels remain upright, viewport-clamped, collision-managed and occluded behind reading plates. Canvas/labels are decorative and pointer-inert; meaningful information is server HTML.
- Slow stationary rotation ~1–1.4°/s. The first nonzero scroll produces bounded, rapid fluid local movement and connection growth before any chapter; ~70ms progress damping, ~240ms velocity decay. Reverse input reverses progress; jumps/resize/back-forward restore current geometry without replay. Stable camera, no pointer steering/roll/fly-through. All paths complete at Footer handoff. Reading-line accent (~48% viewport) is independent of graph progress.
- Cadence: ambient cap 30fps wide/tablet, 20fps compact; active up to60fps subject to hardware gates. Idle positions/words stay steady. Paused/hidden/failed/reduced/Footer-dominated states have zero pending scheduled work/draws. Ambient cadence and per-render cost are separate measurements: a 20fps interval is intentionally 50ms, not a frame-cost failure. Active-scroll interval p95 ≤20ms and per-render work p95 ≤20ms are assessed on hardware; record the measurement method and GPU timer availability.
- Fine-pointer catalogue lift/arrow ≤3px, 160–220ms explicit transitions; artwork scale ≤1.018/~260ms, fixed caption; dossier border emphasis only. Reduced motion removes movement/zoom/highlights/hover transforms. No press-scale requirement or camera hover response.
- Hero Pause slot is reserved before activation, target ≥44px, localized `aria-pressed`. Pause persists between connected routes/locales in the browsing session. Resume samples current pose. Fallback preserves a focused button as “Fondo estático” / “Static background” with `aria-disabled`; it must not remove focus or overlap text.
- Reduced motion/Save-Data known at entry fetch no engine. Reject absent WebGL2/software renderer by default. Optional-module/init failure stays static without an unhandled promise or retry. Context loss suppresses connected-route initialization for the session. Hidden/offscreen/Footer suspend; no-JS HTML and CSS/static art stay complete. Forced colors removes environment/watermark and uses system colors/focus.
- One live renderer/context across the navigation journey. Probe context must be released before engine context; cancel async activation and release geometry/materials/textures/listeners/observers on route change. Home retains its existing loss key/controller; the new connected routes honor that existing stored loss flag and their own memory fallback without modifying Home. New memory fallback covers connected routes if sessionStorage is unavailable; do not claim a new Home memory contract.
- Optional engine/runtime closure ≤120KiB Brotli per cold route; draw calls ≤28 wide/tablet/18 compact; DPR ≤1.5 wide/tablet/1.25 compact; poster ≤150KiB wide/80KiB compact; scene interaction task <50ms; enhancement CLS zero; lab acceptance LCP p75 ≤2.5s, INP p75 ≤200ms using the established Home desktop/mobile profiles. Shared-cache reuse is reported separately, not subtracted from cold bytes.
- Critical HTML/fonts/layout precede optional activation. Dynamic engine import belongs inside the thin client leaf after load/visibility/preferences/coarse probe, not a server `ssr:false` shortcut. No preloading engine or both below-fold project illustrations. Matched static art precedes canvas with no bright flash/shift; failed poster has CSS chart fallback.
- Footer uses the whole protected Bone mark beside FURLANICH plus complete static watermark (~0.085 wide/.06 compact), clear space and all text above it. No crop/split/rotation/morph/sculpture or protected-asset edits. WhatsApp first, existing email/phone/Contact/Founder/profiles/navigation/locale/privacy/copyright; current global demo disclosure retained. No footer WebGL.
- Strict behavioral TDD: **RED → verify intended failure → GREEN → verify pass → REFACTOR → verify again** in every applicable packet. Import/syntax/config errors are invalid RED. Pure layout/geometry/art uses spec/rendered inspection and approved stable baselines, never Tailwind/coordinate regexes.

## Prerequisites, workflow and locks

Read `docs/index.md`, `CONTEXT.md`, `ARCHITECTURE.md`, lifecycle, upstream owners and relevant installed Next guides in `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, `lazy-loading.md` and `01-app/03-api-reference/01-directives/use-client.md`. Current source is a delivered baseline; scoped accepted target supersessions govern.

The ADE v2 repository precedent is [Sky Chart plan §§16–25](sky-chart-home-redesign-v2.md): task/PR packets, exact models, merged-dependency waves, exclusive ownership, lock transfers and receipts. This plan adopts those mechanics with the approved model routing above and provider verification before dispatch; historical provider substitutions do not automatically apply.

1. Human approves this reviewed plan; Task 1 Governance PR is reviewed and **human merged**. A code task cannot run before W0. The existing design branch contains research history; curate the governance package from current `main`, without unrelated Brag/research commits or production changes.
2. Each task gets an isolated worktree/short-lived `codex/spf-<n>-<purpose>` branch from current `main` after all dependencies are merged and their checkpoint passes. No stacked PRs, cherry-picking unmerged siblings or shared checkout editing. Pre-existing active Home work is not a dependency; inspect current main and preserve its acceptance status.
3. Orchestrator holds a single dispatch/lock ledger outside agent write sets. Acquire the named exclusive locks plus each listed path before work; if unavailable, wait. Only the orchestrator updates plan Progress after human merge, under `PLAN-RECORD`. Packet receipts live in separate `docs/reviews/services-projects-footer-acceptance-v1/task-N.md` files.
4. Even disjoint PRs rebase onto current `main` after a sibling merge and rerun their checks before human merge. If a shared file is unexpectedly needed, stop that edit and request a serialized ownership transfer; no “small fix” exception. A task never changes an unowned failing test to unblock itself.
5. Freeze `package.json`, lockfile, global CSS/tokens, shared Header/BrandSignature/Home runtime/Contact unless a packet explicitly owns a narrow change. No new dependencies. Task 9 owns only the two new measurement script entries in `package.json`; it cannot change versions or unrelated scripts.
6. Full code-task gate is `npm run validate` plus packet browser/export/visual/manual checks. A task is review-ready only with its strict TDD receipt, fresh deterministic results, rendered acceptance and independent GPT-6.1 Sol PR review; automated green alone is insufficient. The owner merges. No agent merges or pushes to `main`.

Shared locks: `GOVERNANCE`, `PLAN-RECORD`, `HARNESS`, `ROUTE-CUTOVER`, `LOCALE-CONTROL`, `PUBLIC-EVIDENCE`, `FOOTER`, `SERVICES`, `CONNECTED-CONTRACTS`, `CONNECTED-ENGINE`, `CONNECTED-HOST`, `MEDIA`, `MEASUREMENT`, `VISUAL-BASELINES`, `ACCEPTANCE`. Path locks take precedence over label convenience. A lock transfers only after merge/checkpoint.

## Interfaces and ownership map

New paths below are planned, not existing. Function names/signatures are the handoff contract; implementations stay minimal and private to their owners. All client-boundary props are serializable. No runtime, `window`, storage or Three import in server content modules.

| Produced by | Interface/files | Consumed by |
| --- | --- | --- |
| Task 2 | `lib/connected-studio/types.ts`: `ConnectedRoute = 'services' \| 'projects'`, `ConnectedQuality = 'wide' \| 'compact'`, localized `CapabilityWords` tuple, immutable `GraphDefinition`, `ScenePose`, `SceneGateInput`, `SceneSnapshot`, `SceneHandle` | Tasks 3, 5, 6, 7, 8, 9 |
| Task 2 | `model.ts`: `getConnectedGraph(quality)`, `measureConnectedProgress(scrollY, footerTop, viewportHeight)` normalized/clamped 0–1, `sampleConnectedPose(previous, input)` with elapsed seconds/scroll activity and current layout; deterministic seeded geometry, no random reset | Engine and fake-clock/geometry tests |
| Task 2 | `controller.ts`: `createConnectedController({clock, scheduler, render, getLayout})` → `update(input)`, `pause()`, `resume()`, `dispose()`, `snapshot()`; injected scheduler/cancel and monotonic `now` in milliseconds, no browser globals/Three | Task 5 and Task 7 lifecycle |
| Task 2 | `capability.ts`: `chooseConnectedMode(input)` fail-closed; `session.ts`: safe `readConnectedSession`, `setConnectedPaused`, `markConnectedContextLost`; memory fallback plus namespaced pause and stored Home loss compatibility; `media-manifest.ts`: typed route/quality static media interface | Task 7 activation, Task 8 final posters |
| Task 2 | `content.ts`: exact two localized capability tuples and Pause/static labels from owning approved blocks; `components/connected-studio/ConnectedStudioGround.tsx` + `connected-studio.module.css`: server CSS/static ground and reserved mount contract, no engine | Static pages first; enhancement attached only Task 7 |
| Tasks 3/6 | Main `data-connected-page` plus route/locale, reading-mask elements `data-connected-reading-mask`, chapter IDs and fixed hero Pause mount `connected-pause-<route>`. Ground gets `{route, locale, capabilityWords}`. Semantic legend remains ordinary HTML once per page | Task 7 measures geometry/occlusion and portals button into reserved slot |
| Task 3 | `ProjectDossierSlug = 'general-reservation-system' \| 'the-system'`; `getProjectDossierHref(locale, slug)` in `lib/site-routes.ts`; `getPublishedProjectDossiers(content, locale)` from `publication.ts`; `PublicProjectDossierContent`/`ResolvedProjectDossier` in project types replace detail-route roles, retain useful story fields | Projects, Services evidence and locale control |
| Task 3 | `lib/project-dossier-navigation.ts`: pure `resolveDossierAlternateHref(currentPath, hash, alternateHref)` preserves only a known fragment on a Projects index; otherwise returns existing equivalent href, preserving existing base-path convention | Shared `LanguageSwitch`, Header and Footer |
| Task 4 | `footer-content.ts`: `getFooterConclusionContent(locale)` from exact IA table; Footer derives current locale from the existing opposite `paths.alternateLocale` (two-locale invariant). Existing `SiteFooterProps`/`SiteFooterLabels` remain compatible; no route-shell edits. Footer adds `data-site-footer` on its root | Task 7 Footer handoff, all fourteen retained host pages |
| Task 5 | `runtime/create-connected-scene.ts`: `createConnectedScene({mount, graph, quality, words, onContextLost})` → `SceneHandle` (`render(pose)`, `resize(viewport, graph)`, `projectLabels(pose)`, `dispose()`, `diagnostics()`). Accepts primitive/typed DOM boundary, does not start its own endless loop | Task 7 only, dynamically imported |
| Task 7 | `ConnectedStudioEnhancement.tsx`, `ConnectedPauseControl.tsx`: lightweight React lifecycle leaf; uses existing global createPortal typing, no duplicate shim. Owns browser layout/visibility/fonts/session/cancellation, delegates clock/render scheduling to controller and GPU to engine | Ground enhancement mount, Task 9 tests/measurement |
| Task 8 | `scripts/capture-connected-studio-posters.mjs`; `public/brand/connected-studio/{services,projects}-{wide,compact}.webp`; responsive derivatives beside the two original project assets | Ground responsive picture and project dossier picture |
| Task 9 | `scripts/measure-connected-studio-production.mjs`, `measure-connected-studio-vitals.mjs`, deterministic helper `lib/connected-studio/measurement.ts`; additive `measure:connected-studio` / `measure:connected-studio-vitals` script entries | Production acceptance and reproducible receipts |

The scene is shared between the two routes, not Home. Session loss on either connected route suppresses both/new locale; stored Home loss also prevents connected activation. Writing Home's existing loss flag makes normal sessionStorage Home navigation honor a new loss without changing Home code. Storage-denied connected memory suppression is tested, while Home's pre-existing private fallback remains its own contract. Pause persistence is for connected routes/locales; no Home pause behavior is changed.

### Minimum typed declarations frozen at W1

Task 2 must produce and independently review these minimum fields before human merge. These are interfaces, not implementation bodies. Private geometry/math may vary within the approved visual target. Later parallel agents consume the merged declarations unchanged; a needed interface change returns to the contract owner in a serialized follow-up PR before dependents proceed.

```ts
type Vec3 = readonly [number, number, number];
type CapabilityIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type CapabilityWords = readonly [string, string, string, string, string, string, string, string];
type GraphDefinition = {
  quality: ConnectedQuality;
  nodes: readonly { id: string; capabilityIndex: CapabilityIndex; anchor: Vec3;
    seed: number; depthScale: number }[];
  edges: readonly { id: string; from: string; to: string;
    revealStart: number; revealEnd: number }[];
};
type ScenePose = {
  progress: number; idleAngleRadians: number; scrollActivity: number;
  nodes: readonly { id: string; position: Vec3; rotation: Vec3; scale: number }[];
  edges: readonly { id: string; growth: number }[];
};
type SceneGateInput = {
  reducedMotion: boolean; saveData: boolean; webgl2: boolean;
  softwareRenderer: boolean; sessionContextLost: boolean;
  loaded: boolean; visible: boolean;
};
type SceneSnapshot = {
  state: 'static' | 'live' | 'paused' | 'suspended' | 'disposed';
  pose: ScenePose; pendingCallbacks: number; renderCount: number;
  targetFps: 0 | 20 | 30 | 60;
};
type SceneLayout = { footerDocumentTop: number; viewportWidth: number; viewportHeight: number };
type SceneUpdate = { graph: GraphDefinition; scrollY: number;
  velocityPxPerSecond: number; visible: boolean; footerDominant: boolean };
type SceneViewport = { width: number; height: number; pixelRatio: number };
type LabelProjection = { id: string; capabilityIndex: CapabilityIndex;
  xPx: number; yPx: number; depthScale: number; inView: boolean };
type SceneDiagnostics = { drawCalls: number; renderCount: number; pixelRatio: number;
  geometries: number; materials: number; textures: number; disposed: boolean };
type SceneHandle = {
  render(pose: ScenePose): void;
  resize(viewport: SceneViewport, graph: GraphDefinition): void;
  projectLabels(pose: ScenePose): readonly LabelProjection[];
  diagnostics(): SceneDiagnostics;
  dispose(): void;
};
type ControllerOptions = {
  clock: { now(): number }; // monotonic milliseconds
  scheduler: { schedule(callback: () => void, delayMs: number): number; cancel(id: number): void };
  render(pose: ScenePose): void;
  getLayout(): SceneLayout;
};
type ConnectedController = {
  update(input: SceneUpdate): void; pause(): void; resume(): void;
  snapshot(): SceneSnapshot; dispose(): void;
};
```

`getConnectedGraph(quality: ConnectedQuality): GraphDefinition`; `measureConnectedProgress(scrollY: number, footerDocumentTop: number, viewportHeight: number): number`; `sampleConnectedPose(previous: ScenePose | undefined, input: { graph: GraphDefinition; progress: number; velocityPxPerSecond: number; deltaSeconds: number }): ScenePose`; `chooseConnectedMode(input: SceneGateInput): 'static' | 'webgl'`; `createConnectedController(options: ControllerOptions): ConnectedController`. Session functions take an injected nullable storage boundary in pure tests and return `{paused: boolean, contextLost: boolean}`; access failures preserve the connected-module memory fallback.

Anchors/positions/rotation use scene units/radians; label projections use CSS pixels; edge growth/progress/reveal bounds are finite normalized 0–1; velocity is pixels/second and elapsed pose time seconds. Node IDs and edge endpoints must remain stable across locale changes. Width/height are CSS pixels; quality changes rebuild batched graph resources via `resize` in the same renderer/context and release old allocations. Labels are noninteractive projections; collision/foreground occlusion uses host-measured DOM bounds, not a scene claim.

Revision 5 reference handoff: progress reaches1 when Footer top reaches70% of viewport (`max(1, footerDocumentTop - 0.7 * viewportHeight)` denominator); suspend/hide when Footer top reaches18% of viewport. These thresholds separate completed graph from suspension and match the inspected prototype. Tests cover short documents, restored scroll and resized/localized geometry; tuning them must preserve completion before hiding. Controller state does not govern import eligibility; the host checks gate input before initialization and uses suspension for a retained live handle when hidden.

Task 2 registers named new test patterns in all applicable projects once. Later tasks own distinct specs and cannot change `playwright.config.ts`. The production software-renderer rejection remains default; any existing-style test override is isolated to test injection, never activated by query string, storage, UI or public configuration.

## Dependency DAG and concurrency waves

```text
1 governance/human approval
└─2 contracts + harness
  ├─3 atomic dossier + route retirement
  ├─4 shared Footer (compatible props)
  └─5 separate scene engine
     [all 3,4,5 merged + checkpoint]
     └─6 Atlas Services
       └─7 enhancement integration
         └─8 final media
           └─9 production hardening + measurements
             └─10 documentation + manual acceptance
```

| Wave | Tasks | Start gate / human merge order | Independence proof |
| --- | --- | --- | --- |
| W0 | 1 | Reviewed-plan human approval; governance PR human merge | Documentation only, no implementation |
| W1 | 2 | W0 → merge 2; validate/registration checkpoint | Serial prerequisites define types and harness |
| W2 | 3, 4, 5 | W1 → human merge 3, then 4, then 5; each rebase/check | 3 owns cutover/page/evidence/navigation; 4 only Footer/new compatible module/new dedicated tests; 5 only new engine/new tests. All consume only merged Task 2. No shell/type/global test sharing |
| W3 | 6 | All W2 merged and checkpoint green | Services file lock transfers from Task 3 only now |
| W4 | 7 | Task 6 merged | Integration exclusively owns host and transfers page/ground paths after static pages merge |
| W5 | 8 | Task 7 merged | Final captures depend on merged actual engine/host; media/component transfers serialized |
| W6 | 9 | Task 8 merged | All source/test ownership transfers serialized; no runtime/media agents still writing |
| W7 | 10 | Task 9 merged + hardware/manual gates satisfied | Documentation closeout; no production writes |

Do not increase concurrency by splitting Task 3 deletion from its consumer migration. Task 4 may run in W2 only because its existing props/callsites remain unchanged and its own signature component does not touch shared BrandSignature. If that constraint proves infeasible, serialize it after Task 3; never silently expand its W2 write set.

## Task 1 / PR 1 – Persist accepted design and governance prerequisites

**Exact implementation model:** GPT-6 Luna (`gpt-6-luna`, medium). **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner. Luna receives closed approval evidence and a finite record checklist; unresolved approval interpretation returns to Sonnet. **Dependencies:** human approval of this independently reviewed plan. **Locks:** GOVERNANCE, PLAN-RECORD. **TDD:** N/A, documentation/approval recording only.

**Write set:** This plan/index; accepted SPF design/RFC/review and indexes; new runtime ADR/index; SPF blocks in Services/Projects/IA/Founder; dated target supersession links in `docs/design/visual-language.md`, `docs/design/interaction-responsive-accessibility.md`, `docs/product/project-evidence.md`, `docs/product/projects/{experience,index,general-reservation-system,the-system,mpc-administracion}.md`, `docs/product/content-and-localization.md`, `docs/governance/status-register.md`, `docs/index.md`; receipt `task-1.md`. **Forbidden:** production/config/tests, older ADR bodies/completed-plan/review history, current-implementation claims.

- [ ] Curate the planning-session documentation package on a fresh current-main branch. Confirm design/copy approval source and partial extension, do not promote this plan until explicit plan approval exists.
- [ ] Add dated bounded supersession links to current owner records; preserve protected mark/evidence/Contact history. Record target and unimplemented facts separately; do not claim clean export retirement yet.
- [ ] Record plan independent-review findings/dispositions and human plan approval link/date; mark APPROVED only then. Link final review from this plan/index.
- [ ] Run `npm run docs:check` and `git diff --check`; inspect full diff and receipt for accidental source changes. Governance PR cites RFC-SPF-REDESIGN-V1, DESIGN-SPF-V1 and ADR-CONNECTED-STUDIO-PAGE-RUNTIME. Independent reviewer and human merge are required.

**Acceptance/W0:** All authoritative targets agree, immutable history preserved, reviewed plan APPROVED and Governance PR merged by owner. Capture main SHA. No other task unlocks earlier. The planning session may author these docs now, but does not simulate this merge.

## Task 2 / PR 2 – Define connected-scene contracts and browser harness

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high). Sonnet owns numeric choreography, cancellation/session reasoning, test strategy and static Ground design within the frozen signatures/invariants and approved reference. **Dependencies:** 1 merged/W0. **Locks:** CONNECTED-CONTRACTS, HARNESS. **Write set:** new `lib/connected-studio/{types,model,controller,capability,session,content,media-manifest}.ts`; new server Ground and its module CSS; new `scripts/connected-studio-{model,controller,session,content}.test.mjs`; `playwright.config.ts` only additive pattern registration; receipt `task-2.md`. **Forbidden:** existing page/content/routes, Footer, engine, Home files, shared export/browser suites, global CSS/tokens/packages.

**First RED:** `visible eligible controller rotates at rest and stops pending work when paused` in controller unit tests. Inject valid no-op scheduler/render stubs; initial minimal controller returns a frozen snapshot. Assert elapsed idle time changes mesh orientation while positions/progress stay steady, then Pause cancels every pending callback and produces no further draws. Failure must be wrong stationary output/cancellation, not missing import.

- [ ] Write that test plus failing behavior scaffold; run `node --test scripts/connected-studio-controller.test.mjs` and record intended failure.
- [ ] GREEN minimal pure model/controller/session. Add RED cycles before each new behavior: first 1px progress before chapter, reversible scroll, finite zero-height layout, jumps/resize, graph connectivity/count/endpoints, no invalid node IDs, cadence/activity decay, hidden/Footer suspension, dispose idempotence, unknown-quality fail-closed, storage denied and stored context loss. Clamp elapsed time after hidden-tab resume rather than integrating unseen rotation.
- [ ] Provide exact localized tuples/labels and SSR Ground contract. Pure CSS/chart static fallback needs no engine/JS; final poster URLs become concrete only Task 8. Do not put eight-family marketing cards into types.
- [ ] Register `connected-studio-static.spec.ts`, `connected-studio-services.spec.ts`, `connected-studio-footer.spec.ts`, `connected-studio-navigation.spec.ts`, `connected-studio-responsive.spec.ts`, `connected-studio-runtime.spec.ts`, `connected-studio-accessibility.spec.ts`, `connected-studio-production.spec.ts` with applicable desktop/mobile/tablet/320/browser/axe projects. Register runtime spec on immersive-chromium; basic fallback smoke runs on Firefox/WebKit. Existing visual regexp discovers new visual specs. Run `npx playwright test --list` now and repeat discovery as each later spec appears; never treat “no tests found” as pass.
- [ ] REFACTOR pure modules without behavior change; rerun focused unit tests, `npm run validate` and current browser smoke. Independent reviewer freezes exported declarations, units and signatures before human merge/W1; dependents cannot consume a draft. No rendered baseline change is expected because Ground is not wired yet.

**Acceptance:** Fake-clock suite demonstrates cadence/cancellation/progress/session contracts; no browser globals/Three imports in pure/server modules; harness additions retain old test coverage; current pages unchanged. Manual code review of numeric contracts and no-JS architecture accompanies automated checks.

## Task 3 / PR 3 – Publish complete dossiers and retire detail destinations atomically

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner visual/evidence review. Sonnet owns dossier composition and the whole dependency map/fail-closed migration; migrate useful data first, then remove old route machinery in the same PR. **Dependencies:** 2 merged/W1. **Locks:** ROUTE-CUTOVER, LOCALE-CONTROL, PUBLIC-EVIDENCE, SERVICES (GRS destination only), VISUAL-BASELINES (Services/Projects spec only).

**Write set:** ES/EN `_content/projects.ts`, `_content/founder.ts`; `components/projects/{content-types.ts,ProjectsPage.tsx,ProjectCard.tsx,ProjectDetailPage.tsx}`, `lib/projects/publication.ts`; new `components/projects/ProjectDossier.tsx`, `projects.module.css`; both Projects index routes and both `[projectSlug]/page.tsx` deletions; `lib/site-routes.ts`, `foundation-navigation.ts`, new `project-dossier-navigation.ts`, shared `LanguageSwitch.tsx`; FounderPage/FounderProfessionalHistory/founder types; ServicesPage GRS destination only; MPC public concept deletion; `scripts/{site-routes,projects-publication,projects-route,project-details,foundation-content,privacy-route}.test.mjs`, new `project-dossier-navigation.test.mjs`, `verify-static-export.mjs`; `tests/e2e/{marketing-projects,marketing-navigation,studio-founder}.spec.ts`, new connected-studio static/navigation specs; `tests/e2e/visual/services-projects.visual.spec.ts` and only its Projects/detail snapshots. Implementation evidence is recorded in receipt `task-3.md`; owning requirement copy is unchanged. **Forbidden:** Footer/shared foundation types/brand; Services styling/content; engine/controller/host; Home/Contact; other visual baselines/harness/packages.

**First RED:** `Projects index exposes both complete dossiers before JavaScript` in `connected-studio-static.spec.ts`. On existing implementation with JS disabled, assert visible article by title contains approved context/scope/evidence/source/limitation/concept caption. Current summary-card index fails on the absent full article, proving the intended behavior. Run `npx playwright test tests/e2e/connected-studio-static.spec.ts --project=chromium-desktop` and capture failure before changing UI.

- [ ] Add first RED and focused contract cases. Preserve exclusions; replace obsolete positive detail assertions under the approved dated retirement, not by deleting their protection. Before each new behavior verify failures: recognized dossier fragment locale persistence, unknown fragment fallback, Founder MPC external source, retired artifact absence.
- [ ] Migrate detail story fields into dossier types/content; `getPublishedProjectDossiers` validates exactly the two approved IDs/maturity/relationships/permission/image/caption. Remove MPC only from commercial Projects projection, not its evidence record. Preserve source/test/Docker/historical-CI wording, GRS contributor and The-System incomplete/non-operational billing distinctions.
- [ ] Render two complete semantic articles, jump links, ordinary limitations/source links, related Services/Founder and publication note with Atlas-compatible foreground masks/Ground/semantic capability legend/reserved Pause slot. No hidden accordion/core story or project-detail action. Use existing concepts at their intrinsic ratio/lazy loading; Task 8 adds responsive derivatives.
- [ ] Replace GRS Services href with `getProjectDossierHref`. Replace MPC Founder slug/detail navigation with explicit approved external source action and preserve all educational limitations. Add native equivalent-route fallback plus small client fragment enhancement in LanguageSwitch; known Projects hashes only, no client-only link. On ordinary pages keep existing alternate route behavior.
- [ ] Delete both dynamic route entry files, detail-only component/types/helpers/resolvers and MPC concept after `rg` active-consumer proof. Relocate ProjectMeta or delete ProjectCard only when no consumers remain. Remove route-only `details` naming and unused labels; retain evidence data. Do not introduce sitemap/robots/redirect files that do not exist.
- [ ] Update export verifier: clean-build six negative artifact assertions, no active links/generated route payload destinations to retired paths, both full dossier bodies/captions/source links, GRS fragment and Founder MPC source; retain private/blocked fail-closed checks. A negative test may name old paths; archival docs are exempt from active-link scan. Build output must be fresh, not copied over a stale export.
- [ ] GREEN focused contracts/browser/no-JS and root/base-path exports. REFACTOR obsolete branches/imports; rerun the same tests plus `npm run validate`. Refresh Projects baselines only after rendered owner inspection; delete obsolete detail snapshots as part of reviewed removal. Retain Services snapshots unchanged.

**Commands:** `node --test scripts/site-routes.test.mjs scripts/projects-publication.test.mjs scripts/projects-route.test.mjs scripts/project-details.test.mjs scripts/project-dossier-navigation.test.mjs`; `npx playwright test tests/e2e/marketing-projects.spec.ts tests/e2e/marketing-navigation.spec.ts tests/e2e/studio-founder.spec.ts tests/e2e/connected-studio-static.spec.ts tests/e2e/connected-studio-navigation.spec.ts --project=chromium-desktop`; cross-browser Projects/locale on Firefox/WebKit; `npm run validate`, clean root and `/Portfolio` builds + `npm run verify:static-export`.

**Acceptance:** All six URLs absent with no supported alias, two complete readable dossiers and accurate Founder context, source/anchor destinations valid in both locales/base paths, no unused detail runtime. At 320/390/768/1024/1440 and no-JS inspect all limitations, captions, labels, natural article flow and known/unknown locale hashes. Existing Header/Footer language controls remain usable.

## Task 4 / PR 4 – Build the shared protected-mark Azure conclusion

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner rendered critique. Sonnet owns premium hierarchy, protected-mark composition and responsive host behavior using exact IA copy/channel values; approved copy remains verbatim. **Dependencies:** 2 merged/W1; can run alongside 3/5. **Locks:** FOOTER; own dedicated Footer visual baseline subtree.

**Write set:** `components/foundation/SiteFooter.tsx`, new `footer-content.ts`, `site-footer.module.css`, new `FooterBrandSignature.tsx`; `scripts/site-footer.test.mjs`; `tests/e2e/connected-studio-footer.spec.ts`, `tests/e2e/visual/connected-studio-footer.visual.spec.ts` and its snapshots; receipt `task-4.md`. **Forbidden:** every `app/**/page.tsx`, shared foundation content-types/LanguageSwitch/BrandSignature/protected assets, other tests/global styles, route/helpers/publication/engine. If any forbidden change is necessary, serialize/transfer rather than collide.

**First RED:** `shared footer exposes approved invitation and WhatsApp primary action in both locales` in Footer browser spec: existing footer lacks the invitation. Add a semantic visible assertion and run `npx playwright test tests/e2e/connected-studio-footer.spec.ts --project=chromium-desktop` before UI work.

- [ ] Write first RED plus retained exact direct-channel/navigation/locale/demo checks. Replace old Tailwind-string Footer assertions with content-data/semantic/browser checks, not new CSS regex tests.
- [ ] Keep existing compatible props/callsites; derive locale from typed alternateLocale and resolve new conclusion copy locally. Build foreground full Bone logo with exact canonical geometry, avoiding AppBar's `data-app-bar-brand` marker. Never use shared `BrandSignature variant='on-dark'` in Footer because that marker participates in Home AppBar detection. Add a complete CSS/SVG watermark below text with clear space; all decoration hidden to AT.
- [ ] Render WhatsApp/email/phone/Contact/Founder/profiles/nav/locale/privacy/copyright in approved hierarchy. Add `data-site-footer` for handoff. Preserve demo disclosure elsewhere and Contact's untouched simulation. No new scheduled meeting/prefill/autoplay behavior.
- [ ] GREEN both locales on all seven retained host page roles, long email wrap/keyboard/forced colors/no-JS/320. REFACTOR compatible helpers; rerun same tests and `npm run validate`. Perform Taste preflight/post critique against spec, targeted screenshot/contrast/clear-space inspection and owner-approved Footer baselines. Inspect Home App Bar scroll/readout after visiting Footer.

**Acceptance:** Premium conclusion matches approved reference, mark complete/unaltered, no CTA clipping or duplicated client behavior; all actual channels/equivalent links work. Host grid: Home, Services, Projects, Studio, Founder, Contact, Privacy × ES/EN; baseline only representative wide/compact Footer, remaining hosts use semantic/layout/manual checks.

## Task 5 / PR 5 – Build the batched connected 3D engine

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus rendered engine review by owner. Sonnet owns depth/lighting/path design, batching and resource/race reasoning within controller separation and scene budgets; optimize geometry without weakening visible density. **Dependencies:** 2 merged/W1; can run alongside 3/4. **Locks:** CONNECTED-ENGINE.

**Write set:** new `components/connected-studio/runtime/{create-connected-scene,connected-geometry,connected-labels,dispose-connected-scene}.ts`; `scripts/connected-studio-engine.test.mjs`; new `tests/e2e/support/connected-studio-engine-fixture.ts` for isolated test construction; receipt `task-5.md`. **Forbidden:** contract files/controller/session/Ground CSS, public pages/route shells/Footer/global tests/harness/Home/packages. Test fixture is test-only; do not publish a new route or enable a production software override.

**First RED:** `disposing a constructed connected scene releases every owned GPU resource once` in unit test using injected renderer/resource factories. A valid minimal SceneHandle scaffold initially retains resources; assert dispose clears geometries/materials/textures/render lists/listeners/context/mount ownership and repeated dispose is safe. Run `node --test scripts/connected-studio-engine.test.mjs` for the intended resource-count failure.

- [ ] RED resource ownership, then minimal GREEN scene handle. Before adding geometry/labels/resize/context-loss handling, add meaningful failing handle/render tests using fakes at the browser/GPU boundary. Avoid asserting mesh coordinates/shader source strings as proof.
- [ ] Build faceted Azure bodies/light cores/rings with instancing and batched curved paths/tracers/distant points; depth/lighting/fog match Revision 5. Graph edges follow moving endpoints and grow reversibly. Engine never owns a separate animation loop; controller alone calls render.
- [ ] Return projected upright label positions/visible flags; host handles measured DOM boxes/foreground masks. Keep robust finite positions and DPR caps through 767/768/1023/1024 transitions; compact really uses eight/13/one ring. No bloom/HDR/model/video/fonts-as-heavy-textures.
- [ ] Handle context loss callback/disposal, init failure and partially constructed resources without throwing into reading UI. Record renderer draw-call/resource diagnostics suitable for tests, not visitor-visible debug panels.
- [ ] GREEN/focused resource tests, REFACTOR batching/disposal and rerun. `npm run validate` retains unchanged public rendering. Use an isolated test fixture/disposable visual workspace to inspect actual engine at wide/compact and initial/mid/complete poses; its use never proves hardware acceptance.

**Acceptance:** Typed engine plugs into merged contract, owns no perpetual scheduler, releases resources, meets ≤28/18 draw-call ceilings in fixture, strong depth/node/path rendering and legible upright projected positions. This PR can merge without a live page because the complete current static pages remain valid; integration requires Task 7.

## Task 6 / PR 6 – Deliver the Atlas Services composition and boundaries

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner visual/copy review. Sonnet owns Atlas hierarchy, asymmetric composition, masks and responsive refinement using exact copy, existing commercial paragraphs and three service IDs. **Dependencies:** 3,4,5 all merged/W2 checkpoint. **Locks:** SERVICES; Services portion of VISUAL-BASELINES.

**Write set:** ES/EN `_content/services.ts`; `components/services/{ServicesPage,ServicesIntroduction,ServiceSection,ServicesPrinciples,ServicesFinalCta}.tsx`, `components/services/content-types.ts`, new `ServiceCatalogue.tsx`, `services.module.css`; `scripts/{services-content,services-route}.test.mjs`; `tests/e2e/marketing-services.spec.ts`, `connected-studio-services.spec.ts`; Services assertions/snapshots only in `tests/e2e/visual/services-projects.visual.spec.ts`; receipt `task-6.md`. **Forbidden:** Projects/Founder/route helpers/LanguageSwitch/Footer/ground/engine/harness/global CSS/Home/Contact. Existing Services route props remain compatible; no shell edits needed.

**First RED:** `Services exposes three native catalogue anchors and the complete scoped boundaries before enhancement` in new Services browser spec. Existing composition lacks the catalogue. Assert three native href/heading destinations plus visibility of each compressed boundary and the full commercial block; run `npx playwright test tests/e2e/connected-studio-services.spec.ts --project=chromium-desktop` before UI work.

- [ ] Add first RED plus content cases for exact new buyer copy/capability tuple/AI scope sentence without changing original boundary strings. Verify intended failures before implementation.
- [ ] Compose introduction → web-dominant asymmetric catalogue → three alternating opaque chapters → complete working boundaries → Footer. Add SSR Ground/legend/masks and reserved Pause mount contract from Task 2; no live engine yet. Retain GRS index evidence link from merged Task 3.
- [ ] Make catalogue native anchors with sticky-header offset; all chapter outcomes/delivery/engagement/evidence/actions and service-specific boundary precede working-boundaries link/evidence/Contact. Keep shared agreement/AIERP/commercial content verbatim and visible. Do not copy a technology catalogue or invent proof for automation/support.
- [ ] Implement CSS fine-pointer feedback only and native keyboard/focus. Collapse natural flow under768, reflow at zoom, no hidden text/reveal. Background accents cannot leak through paragraphs; add semantic chapter hooks without changing scroll behavior.
- [ ] GREEN browser/content/no-JS/axe-relevant semantics; REFACTOR presentation only, rerun focused tests plus `npm run validate`. Run approved-design visual QA and Taste pre/post critique in ES/EN at five widths, then owner-approved Services baseline refresh.

**Acceptance:** Three-family hierarchy is clearly dominant and commercial boundary coverage remains complete, readable and truthful. Anchors land below current App Bar, no overflow/scroll traps at320/zoom, honest evidence reaches complete GRS. Home wording is compared for family consistency; no new Home capability/links are added speculatively. Any required exact alignment transfers to Task 9's named Home copy allowance.

## Task 7 / PR 7 – Integrate optional live backgrounds and accessible lifecycle

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner motion/visual critique. Sonnet owns cancellation/session/focus reasoning, label collision/occlusion, motion integration and real navigation invariants; no new abstraction in Home. **Dependencies:** 6 merged plus 2–5 merged. **Locks:** CONNECTED-HOST; serialized transfers for Ground module and page hooks.

**Write set:** new `ConnectedStudioEnhancement.tsx`, `ConnectedPauseControl.tsx`; Ground/module CSS; ServicesPage/ProjectsPage only missing mount/mask semantics; new `scripts/connected-studio-host.test.mjs`; `tests/e2e/connected-studio-runtime.spec.ts`, `connected-studio-responsive.spec.ts`, `connected-studio-accessibility.spec.ts`; new `tests/e2e/support/connected-studio.ts`; receipt `task-7.md`. Engine/contracts may change only via explicit post-merge transfer registered before edit; no parallel owner exists now. **Forbidden:** page copy, Footer, routing/locale helpers, Home/BrandSignature/Contact, harness/packages/global CSS.

**First RED:** `eligible connected page starts a gently rotating scene with an accessible Pause control` in runtime browser spec. Use the existing-style test-only software injection with ordinary server content; current CSS-only Ground has no active scene/control. Assert an active decorative canvas and localized Pause, then measured idle orientation changes while positions stay steady. The intended failure is absent enhancement, not an undefined helper/import. Run `npx playwright test tests/e2e/connected-studio-runtime.spec.ts --project=immersive-chromium`. After that minimal GREEN, write the next RED for reduced-motion/Save-Data no-engine requests before implementing preference gates; request observation must cover the actual optional closure.

- [ ] Test first RED; add failing cycles before each behavior: delayed activation/cancel-before-import-resolution, probe disposal, session preference/loss, normal software rejection, module/render failure, one live renderer, hidden/Footer suspension, Pause across connected routes/locales, focused dynamic fallback, fonts/resize/current geometry restoration and reduced-motion hover removal.
- [ ] Gate load/visibility/preferences/coarse WebGL2/hardware probe before actual engine import in the client leaf. Release probe first; avoid duplicate contexts during React mount/unmount/async resolution. Default software path is static; test injection cannot become public runtime configuration.
- [ ] Bind native scroll/layout resize/visualViewport/fonts/visibility to controller; measure layout in batched reads outside per-scroll writes. Start from actual restored scroll, compute whole-page progress through Footer handoff and chapter accent separately. Zero optional init shift; fully static if init fails or preferences forbid. Never hide core content waiting for fonts/engine.
- [ ] Render decorative pointer-inert portal canvas/labels behind masks and current foreground; collision/occlusion boxes protect text, captions and Pause. Label words never rotate, cross viewport edges or shrink below~11px. Nodes rotate gently at rest with stationary positions; first scroll accelerates movement/path growth. Keyboard/user scroll stays native.
- [ ] Reserve/present ≥44px localized Pause, persist via safe session store, freeze on pause, resume current progress; preserve focused fallback control. Hidden/offscreen/Footer cancels pending timers/RAF; route unmount cancels async callbacks, observers/listeners and GPU resources. If Home's previous renderer is still mounted, defer new activation rather than create a second context; verify actual transition without editing Home runtime.
- [ ] GREEN targeted runtime/static/axes, REFACTOR lifecycle boundaries and rerun all prior focus/failure cases plus `npm run validate`. Review animated recording against Revision 5 (idle, first12px, middle, reverse, jump, Footer, interruption) in ES/EN wide/compact; run `review-animations`, Brag pacing critique and visual QA. No new autoplay/audio dependency.

**Acceptance:** Approved field exists across viewport at rest, immediate fluid first-scroll response and enough full connections at handoff; all listed preference/failure/session/cancellation paths work, one live context, no reading/focus/CLS loss. SwiftShader proves only functional regressions. Named physical-device performance must pass Task 9 before final live-runtime acceptance.

## Task 8 / PR 8 – Produce matched posters and truthful responsive imagery

**Exact implementation model:** GPT-6 Luna (`gpt-6-luna`, medium) for frozen mechanical asset production/wiring; Claude Sonnet 5.5 for capture-design preflight, visual continuity and complex corrections. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner visual inspection. Sonnet supplies exact poses/settings, asset/wiring matrix, byte ceilings/paths/captions; Luna follows that closed handoff with serialized locks and no illustration reinterpretation. **Dependencies:** 7 merged. **Locks:** MEDIA; serialized media-manifest/Ground/ProjectDossier transfers; intentional poster baseline subtree.

**Write set:** capture script, four specified poster WebPs, `lib/connected-studio/media-manifest.ts`, Ground/picture selection, ProjectDossier picture selection; additive `conceptual-workflow-{640,960,1280}.webp`, `conceptual-access-model-{640,960,1280}.webp` beside originals; new `scripts/connected-studio-media.test.mjs`; `tests/e2e/visual/connected-studio-static.visual.spec.ts`/snapshots; receipt `task-8.md`. **Forbidden:** original protected mark/original concept files, copy/evidence/scheduler/route/global CSS/dependencies. Use existing available image tooling; if tooling missing, use workspace dependency discovery rather than add a public dependency.

**First RED:** `compact static media selects an existing ≤80KiB matched poster without engine` in media contract + browser check. Start from merged Ground's CSS-only fallback; a required compact poster selection/existence assertion fails for missing intended artwork, not an import error. Run `node --test scripts/connected-studio-media.test.mjs`.

- [ ] Sonnet freezes and records exact wide/compact capture poses/settings, label treatment and the asset/picture/manifest matrix from merged Task 7 before Luna starts. Include checkable selection/intrinsic/lazy-loading/failure cases; any unresolved design or integration issue remains Sonnet's work under serialized task locks.
- [ ] Luna verifies RED for the supplied selection/loading cases, then captures exact-pose wide/compact Services/Projects posters from the merged scene using the frozen label treatment. No UI text rasterization required for semantic content; retain accessible vocabulary.
- [ ] Luna encodes under150/80KiB and generates resolution-only concept derivatives retaining entire1599:900 source, alt/caption and source provenance. Sonnet inspects depth/node/path continuity at the initial static→live transition and makes any required design correction after lock transfer. Keep both original reusable assets intact.
- [ ] GREEN responsive picture choice/intrinsic allocation and image404 CSS fallback with no engine fetch; no eager preload of both dossier images/poster variants. REFACTOR media metadata; rerun unit/browser/`npm run validate`/clean export. Generated binaries are a visual-only exception, but selection/loading behavior follows TDD.
- [ ] Owner reviews four posters and representative wide/compact paused/reduced/no-JS states. Capture stable controlled Chromium baselines with reduced motion; remove no meaningful labels/captions to reduce screenshot differences. Compare expected/actual/diff before baseline approval.

**Acceptance:** Correct responsive art, byte limits, zero image-induced shift, no invented evidence/cropped concepts, clear CSS fallback, both locales use same permitted images while captions/legend stay localized HTML. Entire dossier remains readable when images fail.

## Task 9 / PR 9 – Harden production journeys, budgets and cross-page regressions

**Exact implementation model:** Claude Sonnet 5.5. **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, xhigh) plus owner manual/performance review. Sonnet owns integrated failure investigations, whole optional dependency closure, budget optimization and final design/motion refinement; no gate relaxation or unrelated redesign. **Dependencies:** 8 merged/all earlier merges. **Locks:** ACCEPTANCE, MEASUREMENT; explicit sequential lock transfers for affected implementation/test paths.

**Write set:** two new measurement scripts and pure measurement helper/test; `package.json` only two new command entries; new `connected-studio-production.spec.ts`; shared `tests/e2e/{accessibility,marketing-navigation,app-bar,home-sections}.spec.ts`, `tests/e2e/support/paths.ts` only if fragment handling needs normalization, `scripts/verify-static-export.mjs`; all SPF-owned modules/page composition/LanguageSwitch and their task-owned tests may receive bounded bug fixes after recorded transfer (never concurrently). Targeted Home copy alignment only in ES/EN `_content/home.ts`; if no discrepancy, leave untouched. Receipt `task-9.md` and production report artifacts. **Forbidden:** Home runtime/state/model/proof, Header/brand, Contact/Privacy behavior, dependencies/versions, unrelated page design/new claims; no broad source glob as an implicit write allowance.

**First RED:** `optional scene budget counts the complete nested chunk closure once` in `scripts/connected-studio-measurement.test.mjs`. Valid fixture contains entry plus nested shared dependencies whose combined Brotli exceeds120KiB; the initial helper counts only entry and falsely passes. Assert violation and complete deduplicated byte total. Run focused Node test, record wrong total as intended failure, then implement correct closure accounting. Also RED real cross-route/back-forward race/focus defects before fixes; do not repeat already-passing implementation tests as fictitious TDD.

- [ ] Build route-neutral production measurement with requests + emitted chunk dependency/manifest cross-check; count every optional engine/runtime dependency absent from matched static preference route requests, cold and warm separately, both pages/locales. Report bytes/raw/Brotli/paths and fail if any route exceeds120KiB. Confirm static routes/preference paths never fetch the optional closure.
- [ ] Extend established gzip lab server/throttling method to four page/locale destinations; desktop/mobile profile values come from `measure-home-web-vitals.mjs` unchanged. Ten journeys per locale/profile, cold navigation plus meaningful Pause/link interactions, aggregate p75 LCP≤2500ms/INP≤200ms; not field data. Report enhancement shifts separately, observer attribution/method and limitations.
- [ ] Functional production browser journey: root/base path, Home→Services→Projects→locale→Founder→Contact→back/forward, recognized/unknown fragments, pause persistence, session loss, delayed import race, no duplicate contexts/stale words/listeners, screenshot/UI focus. Full content without JS, Save-Data/reduced/no-WebGL/software/module failure, image failure, dynamic preference with focus and forced colors.
- [ ] Cross-browser: Chromium/Firefox/desktop WebKit fallback/layout/links plus live where hardware browser supports; controlled SwiftShader runtime only as functional evidence. Real Android Chrome and iOS Safari cover touch/chrome/landscape/phone live capability and fallback. 320/390/768/1024/1440,200% zoom and all14 Footer hosts; axe plus keyboard/manual contrast/headings/landmarks/NVDA-Firefox/VoiceOver-iOS. Test Contact success/error simulation still sends zero inquiry requests and keeps disclosure.
- [ ] Hardware protocol: identify actual desktop CPU/GPU/OS/browser and named constrained Android (≤4 cores where available) plus iPhone profile BEFORE acceptance. Three full up/down traversals, ≥2min visible idle and pause/hidden/Footer checkpoints; sample render work/active frame interval p95, long tasks, draw calls/DPR, label continuity, heat/memory and disposal across routes. No software override. Ambient cadence30/20 cap is measured separately; paused states zero scheduled callbacks/draws. Record GPU query availability/disjoint rejection; CPU-only estimates cannot be called GPU measurements.
- [ ] If budgets fail, RED the defect and optimize within approved proportions/counts first; lower cadence/DPR/distant geometry or static capability fallback where necessary, then repeat affected evidence. Dropping meaningful node/path density globally, raising120KiB/20ms/CWV gates or replacing capable-phone live mode requires owner decision; do not pass by weakening assertions. Unavailable physical/SR/browser evidence stays OPEN and blocks runtime final acceptance, not relabelled automated PASS.
- [ ] GREEN measurement/unit/browser matrix and real gates. REFACTOR only proven hotspots/race ownership and rerun affected failures plus final commands. Independent Taste post-implementation and `review-animations` critique against approved reference; explain accepted/adapted/rejected feedback without overruling spec. Verify no unsupported “roadmap” chronology/product maturity implication.

**Commands/checkpoints:** `npm run validate`; `npm run test:e2e -- --workers=1` (avoid known dev-server concurrency race without changing assertions); `npm run test:a11y`; `npx playwright test --list`; clean root and `/Portfolio` build/export/browser matrix; `npm run measure:connected-studio`; `npm run measure:connected-studio-vitals`; read-only Home regression `npm run measure:immersive` and `npm run measure:home-vitals`. Home's existing accepted exceptions/status are reported independently; new routes receive no inherited headroom exception.

**Acceptance:** Production semantic/export/browser/a11y/visual/motion/budget/hardware gates all pass with honest artifacts. Actual old public URLs return404 on a clean static preview, no residual files/active links, fail-closed evidence remains. Home/Header/Footer host journey and zero-transmission Contact regressions pass. No assumption that this work completes unverified old Home acceptance tasks.

## Task 10 / PR 10 – Synchronize implementation facts and record human acceptance

**Exact implementation model:** GPT-6 Luna (`gpt-6-luna`, medium). **Reviewer:** independent GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner final review. Supply merged receipts/measurements, explicit acceptance verdicts and exact owner list; Luna reconciles/summarizes facts only. Missing or ambiguous evidence and any investigation return to Sonnet; Luna never infers PASS. **Dependencies:** 9 merged and required manual/device gates met. **Locks:** ACCEPTANCE, PLAN-RECORD, GOVERNANCE. **TDD:** N/A documentation/manual review only; any behavior correction returns to its source owner with TDD and a separate bounded PR.

**Write set:** `ARCHITECTURE.md`, `docs/architecture/current-system.md`, docs/design/product owners already named in Task1, `docs/testing/{strategy,playwright,visual-regression}.md` only new procedures, `docs/index.md`, plan/index, new `docs/reviews/services-projects-footer-acceptance-v1/index.md`, task10 receipt and evidence index. Move this plan to completed only when all gates/merges truly complete. **Forbidden:** production/config/tests, immutable ADR rationale/completed unrelated plan histories, confidential/internal evidence publication.

- [ ] Reconcile the supplied requirement→task→test/render/device→PR checklist and explicit Sonnet/Sol/owner verdicts; list exact measured values/device/browser/base/mainSHA and distinguish prototype, software regression and hardware acceptance. Return gaps or contradictory evidence to Sonnet for investigation and Sol for review; preserve OPEN and leave the task incomplete until resolved.
- [ ] Update current implementation maps to two indexes/no detail paths, separate scene controller/typed publication, responsive assets, shared Footer and static base-path behavior. Add dated supersession/acceptance links to historical baseline summaries without rewriting approvals.
- [ ] Owner manually inspects complete ES/EN production journey against Revision5 media/spec: marketing hierarchy, evidence truth, field at idle/first-scroll/depth/connections, touch/reduced/noJS/fallback, Footer mark/contacts, keyboard/zoom. Record approval or exact rejected discrepancies; fix and retest on owning implementation PR before closeout.
- [ ] Run `npm run docs:check`, `npm run validate`, `git diff --check`; full diff/self-review plus `verification-before-completion` and `pr-readiness`. All task receipts/independent reviews/human merges complete; no outstanding blocking acceptance finding.

**Acceptance:** Truthful synchronized records, human production-design/manual acceptance, final scoped PR human merged. Only then plan COMPLETED. No task is done merely because automated tests pass.

## Verification commands, artifact hygiene and manual procedure

Run commands sequentially in each task's own worktree. Before clean builds on Windows, resolve `.next` and `out` under that worktree's verified absolute root, check neither resolves outside it/through an unexpected link, then remove with native PowerShell `Remove-Item -LiteralPath` only. Never delete source, another worktree or an unchecked computed path. Stop managed dev servers before changing base path; reserve per-worktree ports via `PLAYWRIGHT_PORT` to avoid concurrent harness reuse.

Root production: clear base-path env for this shell, clean local outputs, `npm run validate`, `npm run verify:static-export`. Then separately set `$env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'`, clean outputs, `npm run build`, `npm run verify:static-export`, `npm run test:e2e -- --workers=1`; restore env afterward. Keep root/base reports distinct and verify build configuration actually uses the chosen value. Do not call a root-only hardcoded Home measurement a base-path proof.

New production specs must serve exported `out/`, not only `next dev`. Measurement scripts serve it locally. Production absence tests check404/content absence, both HTML/navigation payload links and actual directory absence; generic static server must not rewrite missing routes to index. Existing `appUrl` helper appends a trailing slash: compose `appUrl(index) + '#slug'`, never put a hash inside its route argument until a tested helper enhancement is merged.

Visual baselines use controlled visual-chromium platform-specific naming, reduced motion/static pose, self-hosted fonts settled, deterministic copyright. Owner approves rendered design and each changed expected/actual/diff; no blanket update to make CI green. Screenshots/videos/traces/reports are local/CI artifacts by default; commit only reviewed baselines and intentionally curated acceptance evidence. New scene runtime screenshots freeze pose through test controls without enabling software in production.

Manual final checklist: source order/oneH1/landmarks; all story/boundary text; keyboard/focus/Pause announcements; anchors/locale hash; exact concept captions; both node vocabularies/upright/occlusion; idle→first-scroll→reverse→Footer; reduced/noJS/SaveData/failure/forced colors; five widths/zoom/landscape/chrome/touch; all Footer hosts/channels; NVDA-Firefox/VoiceOver-iOS; physical desktop/Android/iPhone metrics and sustained-use heat; clean root/Portfolio exports. Each has PASS/FAIL/OPEN with evidence, reviewer/date and no conformance claim from axe alone.

## Review focus and traceability

These input classes require named tests in their owner packets, not a generic “handle edge cases” instruction.

| Risk/input | Required assertion/inspection | Owner |
| --- | --- | --- |
| Empty/unknown/private dossier data or hash, arbitrary slug, duplicated IDs | Fail-closed publication, only2dossiers, known hash preservation/unknown fallback, no retired routes | 3 |
| Zero/short page, long locale copy, resize/mobile chrome/restored scroll/anchor jump | finiteclamped progress, firstpixel response, recomputedFooter endpoint/current pose, steadycamera/uprightlabels | 2,7,9 |
| Async import/font/probe finishing after unmount, rapid route/locale/back-forward | no latecanvas/duplicatecontext/listenerleak/stale words; focus preserved | 5,7,9 |
| Preference/context loss/storage denied while Pause focused | noengineknownstatic, cancelframes, safe session fallback, static button inactive/focused | 2,7,9 |
| Dense/longlabels or image/module failure at320/zoom/forcedcolors | nooverflow/occludedcopy/tinylabels; complete HTML/CSSfallback, exactcaptions, realactions | 3,4,6,7,8,9 |
| Ambient versus active timing/sharedchunkcache/software versus hardware | cadence cap separatecost; completeclosure/coldlimit; physical device report; no inherited exception | 5,9 |

Coverage map: hierarchy/copy/boundaries→6; dossier truth/route/MPC→3; Footer/logo/contacts→4; graph/capability/progress/session→2; depth/batching/resources→5; live/labels/interaction/accessibility/fallback→7; imagery/posters→8; full crossbrowser/responsive/CWV/base-path/manualregression→9; owning records/humanacceptance→1,10. Skill findings remain in the design review; later critiques record recommendation→accepted/adapted/rejected against approved spec.

## Receipts, independent review and final gate

Every behavioral receipt includes task/model/provider identifier/settings, each model's subtask contribution and serialized handoffs, independent GPT-6.1 Sol reviewer, branch/worktree/baseSHA, exact owned paths and locks, **RED command/test/intended failure**, GREEN same command/pass, REFACTOR change and repeated pass, fresh full checks, visual/a11y/responsive/motion/performance evidence, deviations, independent findings and human PR/mergeSHA. Documentation/generated-art exceptions are explicit; generated-art loading/selection behavior is not exempt. A test added after behavior is a recorded TDD deviation, not retrospectively called RED.

Independent plan review: use a fresh **GPT-6.1 Sol (`gpt-6.1-sol`, high)** agent, distinct from the plan author/contributors, read-only with this plan/spec/source. It must attempt to find missing requirements, overlap/concurrency/unmerged dependencies, weak acceptance, visual/3D ambiguity, TDD gaps, responsive/accessibility/performance cases and provider mismatch, including every assignment against the approved model-routing criteria. Findings have `BLOCKING / HIGH / MEDIUM / LOW`, target/task, concrete risk and recommended correction. Reviewer never rewrites the plan. Original author revises; repeat independent review after material corrections and resolve all blocking acceptance findings before human approval. Every subsequent PR also requires independent Sol review.

**Current model-routing revision review gate: PASSED GPT-6.1 Sol.** [Independent Sol round3](../../reviews/services-projects-footer-plan-review-2026-09-30.md) reviewed the full revised plan, approved spec, historical review and documentation diff with **0 BLOCKING, 0 HIGH, 0 MEDIUM, 0 LOW** findings. Recommendation: ready for human plan approval. Historical Luna rounds1–2 remain evidence for the earlier revision and its resolved full-path/typed-contract findings. The plan remains PROPOSED; neither routing approval nor review completion authorizes implementation.

## Risks and rollback

- Physical constrained-phone/browser/SR availability is an execution evidence gate, not a reopened design question. Do not silently defer required checks. New typed lifecycle/controller needs independent scrutiny even though prototype motion was approved.
- Shared Footer may expose previously unseen host-page layout/contrast regressions; its compatible API and all-host checks prevent hidden shell overlap. Unexpected global changes require lock transfer and bounded review.
- Route removal is deliberately final. Revert a defective runtime/host/media PR independently to complete static reading. Revert retirement only together with its consumer/content/export changes and owner authorization; never restore only six route files against new publication contracts. Preserve clean-output deployment discipline to prevent stale deleted files.
- A runtime budget failure returns static for rejected capability, then optimized retest; general capability/live design degradation or ceiling change returns to owner/governance. No automatic dependency install. Provider availability and substitutions follow the approved model-routing policy above.

## Progress

- 2026-09-30: Owner approved Revision5 written design/copy and authorized ADE v2 planning + independent review. Codex authored this PROPOSED plan; production remains unchanged. Governance merge/execution W0 not performed.
- 2026-09-30: Independent GPT-6 Luna round1 found two MEDIUM issues; original author revised paths/contracts. Round2 verified resolution with no remaining findings and recommended human plan approval. Documentation/diff validation passed; no implementation started.
- 2026-09-30: Owner approved model routing: Claude Sonnet 5.5 for complex/design work, GPT-6 Luna only for low-demand/low-risk/no-design implementation, and independent GPT-6.1 Sol review for every PR. Reassigned Tasks 2–7/9, bounded Luna Tasks 1/8/10, and added serialized Sonnet/Luna media handoff and provider checks. Independent Sol round3 found no issues and recommended human plan approval; overall plan remains PROPOSED and execution has not started.

## Deviations discovered during execution

None; execution has not started. Independent review corrections are recorded in the review artifact, not treated as implementation deviations.
