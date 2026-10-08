---
id: PLAN-SPF-V1
type: execution-plan
status: APPROVED
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
last_verified: 2026-10-07
---

# Services, Projects and Footer v1 Implementation Plan

> **For agentic workers:** Dispatch this plan task by task with `superpowers:subagent-driven-development` or `superpowers:executing-plans`. Those skills only provide dispatch mechanics. They do not override the named models, the [Skills contract](#skills-contract), exclusive ownership, merged-dependency gates or human merges. Every task ends in a Pull Request. Do not use the local-merge options of `superpowers:finishing-a-development-branch`.

**Goal:** Deliver the approved bilingual Atlas Services page, the complete inline Projects dossiers and the branded shared Footer. Add the Revision 5 connected background, and retire the six project-detail URLs definitively.

**Architecture:** Static server HTML and permitted evidence come first. A separate, optional connected-studio controller and Three engine enhance Services and Projects behind their readable content. Keep the current Home/App Bar behavior, the localized static export, the protected assets and the local simulated Contact. All implementation arrives through human-merged PRs.

**Tech stack:** Installed Next.js 16.3.2, React 18.2.0, TypeScript 5.5.4, Tailwind 3.4.7, Three 0.186.0, existing Framer Motion 11.2.10, the Node test runner and Playwright 1.63.0 with axe. The installed guides and type definitions govern code, not remembered APIs. No dependency changes are planned.

**Spec:** [DESIGN-SPF-V1](../../design/services-projects-footer-v1.md), approved 2026-09-30 with linked exact ES/EN copy. Also: [design exploration and Revision 5 media](../../reviews/services-projects-footer-design-2026-09-30/index.md), the [retirement audit](../../reviews/services-projects-footer-design-2026-09-30/route-retirement-audit.md), the [accepted RFC](../../rfcs/services-projects-footer-redesign-v1.md) and the [runtime ADR](../../decisions/connected-studio-page-runtime.md). The [reference media](#reference-media) section lists the exact files that define "matches Revision 5".

**Author/status:** Revision 5 is **APPROVED — 2026-10-05**, under the [owner's conditional authorization](../../reviews/services-projects-footer-plan-review-2026-09-30.md#owner-approval-2026-10-05), after a fresh independent GPT-6.1 Sol round 6 and correction verification returned zero unresolved findings. SPF-FINAL-01 to SPF-FINAL-04 are resolved. Prior authoring/review history and OD-1 to OD-4 remain in the [review record](../../reviews/services-projects-footer-plan-review-2026-09-30.md). Task 1 records the verified approval and packages the acceptance scaffold/receipt; the final-review Governance PR #104 merged on 2026-10-05 and its `validate` and browser CI jobs passed. Implementation stays locked behind the separate human-merged Task 1 Governance PR and W0. No production code changes in this planning session.

## Model routing

**APPROVED 2026-09-30:** The owner's model-routing instruction governs every dispatch for this plan. Overall plan approval and human merge gates remain separate.

- **Claude Sonnet 5.5** leads Tasks 2–7 and 9: complex reasoning, contracts, lifecycle and race analysis, the atomic migration, performance diagnosis, visual composition, 3D rendering and motion. It implements the approved Revision 5 design, exact copy, protected assets and budgets. Design judgment does not reopen those requirements.
- **GPT-6 Luna (`gpt-6-luna`, medium)** implements Tasks 1 and 10 and the mechanical portion of Task 8. A Luna assignment must meet all three conditions: low reasoning demand, low implementation risk, and no visual, interaction, motion or architectural design judgment. Supply frozen inputs, exact owned paths, a finite checklist and checkable expected outputs. Closed copy transcription, receipt assembly and predetermined asset operations are eligible. A task is not low demand merely because its specification is detailed.
- **Task 8 handoff:** Sonnet first freezes the capture poses and settings, label treatment, responsive asset matrix and picture/manifest wiring from the merged scene. Luna performs capture, encoding, resolution-only derivatives and exact wiring. Sonnet inspects static-to-live continuity and owns any design correction or nontrivial loading/fallback defect. Before either model edits, transfer that task's exclusive path locks serially and record the handoff. The task keeps one PR and its dependency wave.
- **GPT-6.1 Sol (`gpt-6.1-sol`, high; xhigh for Task 9)** independently reviews every PR, including governance, media, documentation closeout and follow-up fixes. The reviewer has not contributed to the PR and checks the complete final diff, receipts, design fidelity and required validation. Re-review after material corrections. Owner visual/manual acceptance and human merge are additional gates. Neither Sonnet nor Luna replaces Sol as PR reviewer.
- Within a Sonnet-led packet, a separable subtask that meets all three Luna conditions goes to Luna as a bounded checklist batch. Each batch receives a named subset of the packet's write set, acquired as a serial lock handoff, and returns it before Sonnet edits those paths again. Record each handoff and each model's contribution in the receipt. If a Luna checklist exposes ambiguity, a race, a failed budget, a design decision or a nontrivial defect, route that work back to Sonnet before continuing.
- Before dispatch, verify that the execution provider exposes the exact named model, and record the actual provider identifier and settings. Resolve Claude Sonnet 5.5 through a provider that supports it. Do not invent a Codex alias or assume a reasoning setting from another provider. If a required model is unavailable, record the routing failure and get owner authorization for a substitute before that work begins. Future Skills or default models cannot silently replace these assignments.
- **Orchestrator** (as in the Sky Chart precedent): the planning or harness session that dispatches tasks, holds the live lock ledger, runs the [wave checkpoints](#wave-checkpoints) on `main`, and updates this plan's Progress under `PLAN-RECORD`. It never implements or reviews a PR that it gates. Record its actual model and provider in Progress when it starts. The orchestrator is a coordination role, not an implementation assignment, so it does not alter the routing above.

### Provider execution notes

These notes apply to every dispatch and are repeated in each packet prompt.

- **Claude Sonnet sessions (Claude Code with Superpowers):**
  - The design gate is closed. Do not run `superpowers:brainstorming` or `superpowers:writing-plans`. Raise an unresolved product or design question to the owner as **OPEN** instead.
  - Do not invoke `impeccable` or any `impeccable-*` agent. Its shaping, polishing and redesign flows would reopen approved decisions. If a harness suggests it, decline and note that in the receipt.
  - Read every Skill in the packet's Skills line through the Skill tool. Where invocation is disabled, read the file directly.
  - Shell: these sessions use Git Bash on Windows, which rewrites `/Portfolio` in environment values. Run base-path commands in PowerShell (`$env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'`). In Git Bash, prefix them with `MSYS2_ENV_CONV_EXCL='NEXT_PUBLIC_BASE_PATH'`.
- **GPT-6 Luna sessions:** follow the packet checklist literally and change nothing outside the listed paths. Any instruction that needs interpretation goes back to Sonnet or the orchestrator. Luna never records PASS for evidence it did not run.
- **GPT-6.1 Sol reviews:** read-only. Use the [receipt template](#receipt-template), the packet's objective acceptance list and the [Skills contract](#skills-contract). A missing Skill stage, an unrecorded RED or an unexecuted command is a finding.

## Owner decisions and plan clarifications — 2026-10-05

The owner decided OD-1 to OD-4 on 2026-10-05, in response to the supplemental review. Clarifications PC-1 to PC-7 resolve plan-level ambiguities inside DESIGN-SPF-V1 without changing approved design. Approving this plan approves them; an owner objection returns the affected item to **OPEN** before W0.

| ID | Decision or clarification | Effect on execution |
| --- | --- | --- |
| OD-1 | **Home Founder plate is a non-goal.** PLAN-SPF-V1 does not change the Home Founder atlas plate. Any later change needs its own design. | No task edits `HomeFounder`, its plate or `home-sections` baselines. The three Sky Chart records that expected an SPF change carry a dated correction. |
| OD-2 | **Slow-but-capable phones are handled by global policy, not a runtime watchdog.** | `lib/connected-studio/capability.ts` exports `CONNECTED_LIVE_POLICY: { wide, compact }`. Task 9's physical-device evidence sets the shipped values. The controller has no frame-budget fallback. |
| OD-3 | **Home copy is a non-goal.** | No task edits `app/(es)/_content/home.ts` or `app/(en)/en/_content/home.ts`. Any Home/Services wording inconsistency found is recorded as OPEN in the receipt. |
| OD-4 | **Device and screen-reader gates:** the owner performs the physical Android, iPhone, NVDA-Firefox and VoiceOver-iOS checks. If they are not done when Task 9 is otherwise ready, Task 9 may merge with those items OPEN and `CONNECTED_LIVE_POLICY.compact = false`. `wide` stays `true` only if the owner's desktop hardware check passed; otherwise it is `false` too. | Turning a tier on later is a bounded follow-up PR (Sonnet implements, Sol reviews, owner merges) carrying the passing evidence. OPEN items never become PASS without evidence. |
| PC-1 | **Tablet tier.** Tablet (768–1023px) uses the wide graph (16 nodes, 33 connections) with a travel/depth scale below 1. | `ConnectedTier` and `getTravelScale(tier)` join the W1 contract. Sonnet tunes the tablet and compact values against the reference media and records them. |
| PC-2 | **Label visibility rule.** Clamp each label into the viewport. Hide it if it cannot fit, if it is out of view, or if it intersects an occluder (reading masks, captions, Pause, App Bar). Resolve label–label overlaps greedily by descending `depthScale`, then ascending node id. Never scale labels below ~11px. | The "twice wide / once compact" rule is about graph assignment. Rendered visibility can be lower where content occludes. The HTML legend always lists all eight words. A pure `resolveLabelVisibility` function belongs to Task 2. |
| PC-3 | **Catalogue pointer highlight** is a CSS-only static radial light, revealed on fine-pointer hover and `:focus-visible`. It does not track the pointer. | No pointer-tracking JavaScript. Pointer tracking would need owner approval. |
| PC-4 | **Footer composition follows `revision-footer-1440.png` and `revision-footer-390.png`** (see [Task 4](#task-4-pr-4-build-the-shared-protected-mark-azure-conclusion)). WhatsApp appears once, as the primary action. | Removes the duplicate-channel ambiguity. Footer direct-channel href order stays WhatsApp, email, phone. |
| PC-5 | **Home context-loss key is read-only for connected routes.** They read Home's existing `furlanich:sky-chart-context-lost` session flag, so a Home loss suppresses connected activation. They write only their own namespaced flag. | Home behavior is unchanged, consistent with the ADR's "context-loss suppression for the connected routes". |
| PC-6 | **`SceneSnapshot.targetFps` is a number:** 0 when stopped, ambient caps 30 (wide/tablet) and 20 (compact), active cadence ≤ 60. | Task 9 can lower cadence without a contract change. |
| PC-7 | **The prototype source is not authoritative.** `revision.html` (served at `127.0.0.1:4317`) is not in the repository. The committed [reference media](#reference-media) is the only rendered reference. | Constants the spec does not fix are Sonnet tuning, recorded in receipts and accepted only through owner visual review against those files. |

## Non-goals

An implementation agent must not expand scope into any of these. A change that seems necessary goes to the owner as OPEN.

- Home: hero, scene, chapters, sections, copy (OD-3), the Founder plate (OD-1), proof fallback and runtime. The only Home-visible change is the shared Footer.
- App Bar, Header, `BrandSignature`, navigation labels or menu behavior.
- Information architecture beyond the six approved retirements: no new pages, routes, top-level items, redirects, rewrites, sitemap or robots files, or SEO metadata work.
- New services, products, projects, Home-eligible projects, evidence permissions, claims, metrics or imagery beyond the two approved concept derivatives and the four posters.
- Contact transmission, the dormant inquiry pipeline, the rejected D03 notice/form redesign, analytics, backend, hosting, deployment and CI workflow changes.
- Legal and privacy text, except the existing Privacy link placement in the Footer.
- Global tokens, `app/globals.css`, fonts, Tailwind configuration, a design-system rewrite and unrelated refactors.
- New dependencies or version changes.

## Reference media

All paths are under `docs/reviews/services-projects-footer-design-2026-09-30/`. "Matches Revision 5" means matching these committed files and DESIGN-SPF-V1, nothing else.

| Purpose | Files |
| --- | --- |
| Services field and composition | `assets/revision5-services-1440-hero.png`, `assets/revision5-services-1440-chapter.png`, `assets/revision5-services-390-hero.png`, `assets/revision5-services-390-chapter.png` |
| Projects field and dossiers | `assets/revision5-projects-1440-hero.png`, `assets/revision5-projects-1440-chapter.png`, `assets/revision5-projects-390-hero.png`, `assets/revision5-projects-390-chapter.png` |
| Motion (idle, first scroll, reverse, Footer) | `assets/revision5-services-motion.webm`, `assets/revision5-projects-motion.webm` |
| Footer | `assets/revision-footer-1440.png`, `assets/revision-footer-390.png` |
| Observed prototype behavior (not acceptance) | `evidence/revision5-field-inspection.json`, `evidence/revision5-controls.json`, `evidence/revision5-accessibility.json` |

The spec does not fix these constants: scroll-impulse gain, maximum local node travel, orbit tilt, node layout and word-to-node assignment, fog distances, and the tablet/compact travel scales. They are Sonnet tuning in Tasks 2, 5 and 7, recorded with their values in the receipt. They are accepted only through owner visual review against the files above. The `probeGpu=1` lab override must not exist in production.

## Global constraints

- **Scope:** dedicated Services and Projects pages plus the shared Footer. On Founder, align only the MPC source action and context. The [Non-goals](#non-goals) apply.
- **Exact copy** stays in [Services SPF-V1](../../product/pages/services.md#spf-v1-proposed-services-copy), [Projects SPF-V1](../../product/pages/projects.md#spf-v1-proposed-projects-copy-and-inline-presentation) and [IA SPF-V1](../../product/information-architecture.md#spf-v1-proposed-footer-copy-and-route-retirement). Heading slugs keep their historical "proposed" wording; item-level APPROVED markers govern. Do not paraphrase commercial exclusions, AI/ERP scope, evidence, captions or relationship limitations.
- **Services** keeps three families and the service IDs `web`, `whatsapp`, `consulting`. Fragments stay `web`, `whatsapp`, ES `consultoria` / EN `consulting`, and ES `condiciones` / EN `working-boundaries`. Every compressed D05 service boundary and the complete commercial block stay visible as ordinary HTML. New scan copy is additive.
- **Projects** renders GRS first and The-System second, each with complete context, problem, implemented scope, source, evidence, limitations and permitted concepts. Do not invent clients, metrics, live demos, operational billing or a shared deployed architecture. MPC stays as 2021 educational/group/fictional context on Founder. Busesfy (blocked), Chrono (retired) and Documancer (private) stay excluded. Evidence permissions do not change.
- **Route retirement:** retire `/proyectos/{general-reservation-system,the-system,mpc-administracion}/` and `/en/work/{general-reservation-system,the-system,mpc-administracion}/` definitively. No redirect, compatibility page or wildcard destination. The stable index fragments are `general-reservation-system` and `the-system`. A locale switch with an unknown fragment lands on the equivalent index. Historical records and negative absence tests may keep the retired paths.
- **Imagery:** keep the original two 1599×900 conceptual WebPs (`public/projects/general-reservation-system/conceptual-workflow.webp`, `public/projects/the-system/conceptual-access-model.webp`) with their exact alt text, caption and meaning. Responsive derivatives may change resolution or compression only, never scene, crop or evidence. Delete MPC's unused `public/projects/mpc-administracion/conceptual-operations-model.webp` only after proving no active consumer. Keep its internal provenance. No generated visual counts as implementation proof.
- **Colors:** Abyss `#06121F`; opaque plate `#0A1E33`; plate border `#36536C`; Azure `#004589`; Bone `#F9F6EE`; Ink `#09243D`; accents `#6FA8E0`, `#9CC4EC`; secondary `#B9C3CC`. Use the existing self-hosted Instrument Sans and Plex Mono, a container of about 1180–1200px, and compact gutters of at least 20px. No global token rebrand.
- **Breakpoints:** wide ≥1024px, tablet 768–1023px, compact <768px. Use natural content height and native scroll. No pinned reading, hidden reveal, carousel or scroll interception.
- **Field:** 16 nodes and 33 connections on wide/tablet; 8 nodes and 13 connections on compact. Each of the eight localized capability words is assigned to two wide nodes and one compact node, with the same semantic legend. Desktop has a second orbit and a skeleton; compact has one ring and fewer points. Labels follow PC-2. Canvas and labels are decorative and pointer-inert; meaningful information is server HTML.
- **Motion:** slow stationary rotation of about 1–1.4°/s. The first nonzero scroll produces bounded, fast, fluid local movement and connection growth before any chapter: about 70ms progress damping and 240ms velocity decay. Reverse input reverses progress. Jumps, resize and back-forward restore the current geometry without replay. Stable camera; no pointer steering, roll or fly-through. All 33/13 connections reach growth 1 at the Footer handoff. The reading-line accent (about 48% of the viewport) is independent of graph progress.
- **Cadence:** ambient cap 30fps wide/tablet and 20fps compact; active up to 60fps, subject to the live policy (OD-2). Idle positions and words stay steady. Paused, hidden, failed, reduced-motion and Footer-dominated states have zero pending scheduled work and zero draws. Ambient cadence and per-render cost are separate measurements: a 20fps interval is intentionally 50ms, not a frame-cost failure. On hardware, active-scroll interval p95 ≤20ms and per-render work p95 ≤20ms. Record the measurement method and whether GPU timers are available.
- **Hover:** fine-pointer only. Catalogue lift and arrow ≤3px, with 160–220ms explicit-property transitions, plus the PC-3 radial light. Artwork scale ≤1.018 over about 260ms, with a fixed caption. Dossiers get border emphasis only. Reduced motion removes movement, zoom, highlights and hover transforms. No press-scale requirement or camera hover response.
- **Pause:** the hero Pause slot is reserved before activation, with a target of at least 44px and localized `aria-pressed`. Pause persists across connected routes and locales for the browsing session. Resume samples the current pose. On fallback, a focused button stays focused and reads "Fondo estático" / "Static background" with `aria-disabled`. It must not lose focus or overlap text.
- **Gates:** with reduced motion or Save-Data known at entry, fetch no engine. Reject absent WebGL2 or a software renderer by default. Also apply `CONNECTED_LIVE_POLICY` by tier (OD-2/OD-4). An optional-module or init failure stays static without an unhandled promise or retry. Context loss suppresses connected-route initialization for the session (PC-5). Hidden, offscreen or Footer states suspend. No-JS HTML and the CSS/static art stay complete. Forced colors removes the environment and watermark and uses system colors and focus.
- **Lifecycle:** one live renderer and context across the navigation journey. Release the probe context before creating the engine context. On route change, cancel async activation and release geometry, materials, textures, listeners and observers. Home keeps its existing loss key and controller unchanged.
- **Budgets:** optional engine/runtime closure ≤120KiB Brotli per cold route; draw calls ≤28 wide/tablet and ≤18 compact; DPR ≤1.5 wide/tablet and ≤1.25 compact; poster ≤150KiB wide and ≤80KiB compact; scene interaction task <50ms; zero enhancement CLS. Lab acceptance: LCP p75 ≤2.5s and INP p75 ≤200ms on the established Home desktop and mobile profiles. Report shared-cache reuse separately; do not subtract it from cold bytes.
- **Loading:** critical HTML, fonts and layout come before optional activation. The dynamic engine import sits inside the thin client leaf, after load, visibility, preferences, policy and a coarse probe — not behind a server `ssr:false` shortcut. Do not preload the engine or both below-fold project illustrations. Matched static art comes before the canvas, with no bright flash or shift. A failed poster falls back to the CSS chart.
- **Footer:** the whole protected Bone mark beside FURLANICH, plus a complete static watermark (about 0.085 opacity wide, 0.06 compact) with clear space and all text above it. No crop, split, rotation, morph, sculpture or protected-asset edit. No Footer WebGL. Keep the current global demo disclosure.
- **TDD:** strict behavioral **RED → verify intended failure → GREEN → verify pass → REFACTOR → verify again** in every applicable packet. Import, syntax and config errors do not count as RED. Pure layout, geometry and art use the spec, rendered inspection and approved stable baselines, never Tailwind or coordinate regular expressions.

## Skills contract

Skills are **required**, not suggested. Each packet's **Skills** line lists them in execution order. The receipt records each stage, when it ran and its outcome. A skipped stage is a review finding. Repository Skills live in `.agents/skills/`.

**Stage order for public UI packets (Tasks 3, 4, 6 and 7, and the UI portions of 2, 8 and 9):**

```text
read authority (AGENTS.md, DESIGN-SPF-V1, owning copy, this packet)
→ frontend-implementation (governs the whole packet)
→ design-taste-frontend-v1 preflight (constrained by DESIGN-SPF-V1; record conflicts, follow the spec)
→ test-driven-development: RED → verify failure → GREEN → verify pass → REFACTOR → verify again
→ playwright-qa (browser behavior, links, keyboard, console, axe via npm run test:a11y)
→ visual-qa (rendered judgment against the reference media, the packet's visual matrix)
→ design-taste-frontend-v1 post-implementation critique (recommendations accepted/adapted/rejected against the spec)
→ verification-before-completion (fresh command evidence)
→ pr-readiness (complete diff, readiness report, PR body)
```

**Special rules:**

| Skill | Rule |
| --- | --- |
| `design-taste-frontend-v1` | This exact install name. Never `design-taste-frontend` (v2) or `gpt-taste`. It ranks below DESIGN-SPF-V1. |
| `emil-design-eng` | Required wherever a packet implements hover, transitions or scene motion (Tasks 3, 6, 7). Spec values win over its defaults. |
| `review-animations` | Model invocation is disabled. Read `.agents/skills/review-animations/SKILL.md` and `STANDARDS.md` directly. Skip its scripted first reply. Apply its ten standards to the packet diff and record findings in the receipt. Spec values (160–220ms, ~260ms, ~1–1.4°/s, ~70ms/~240ms) outrank its default tables. |
| `brag`, `brag-slim` | **Forbidden.** The spec already adapted Brag's pacing. Pacing review compares recordings to `revision5-*-motion.webm`. Never install Hyperframes or render a video. |
| `impeccable`, `impeccable-*` agents | **Forbidden** in this plan (see the [provider notes](#provider-execution-notes)). |
| `superpowers:brainstorming` | **Forbidden.** The design is closed. |
| `systematic-debugging` | Required before changing code or expectations after **any** unexpected test, build or browser failure. |
| `find-docs` (Claude) or the installed `node_modules/three` types (any provider) | Required in Task 5 before using any Three 0.186 API. Do not rely on remembered APIs. |
| `superpowers:using-git-worktrees` | Required at the start of every task. Create the worktree at `.worktrees/spf-<n>`. |
| `project-knowledge-maintenance` | Required for every documentation write (Tasks 1 and 10, and the testing-doc rows in Tasks 2–9). |

## Prerequisites, workflow and locks

Read `docs/index.md`, `CONTEXT.md`, `ARCHITECTURE.md`, the lifecycle, the upstream owners and these installed Next guides: `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, `lazy-loading.md` and `01-app/03-api-reference/01-directives/use-client.md`. Current source is the delivered baseline; scoped accepted target supersessions govern. The repository baseline for this revision is `main` at `9138941` (revision 4 merged in PR #103). The orchestrator re-confirms it before W0.

The ADE v2 precedent is the [Sky Chart plan](../completed/sky-chart-home-redesign-v2.md) §§16–26 and Appendix D: task/PR packets, exact models, merged-dependency waves, exclusive ownership, lock transfers, checkpoints and receipts. This plan adopts those mechanics with the approved model routing above. Historical provider substitutions do not carry over.

1. The owner approves this reviewed plan, and Task 1's Governance PR is reviewed and **merged by the owner**. No code task runs before W0.
2. Each task gets an isolated worktree at `.worktrees/spf-<n>` on a short-lived `codex/spf-<n>-<purpose>` branch cut from current `main`, after all dependencies are merged and their checkpoint passes. No stacked PRs, no cherry-picking unmerged siblings, no editing in a shared checkout. Each worktree sets `PLAYWRIGHT_PORT = 3200 + 10 × n` (Task 3 uses 3230) to avoid the default 3100 and the 3000–3199 range used by earlier worktrees.
3. The orchestrator keeps the live dispatch/lock ledger outside every agent's write set, in its own session notes, and mirrors each acquisition, transfer and release into Progress at each merge or checkpoint. Only the orchestrator updates Progress, under `PLAN-RECORD`. Packet receipts live in separate `docs/reviews/services-projects-footer-acceptance-v1/task-N.md` files, which Task 1 sets up.
4. A PR rebases onto current `main` after any sibling merge and reruns its checks before the owner merges it. If a file outside the write set is unexpectedly needed, stop that edit and ask the orchestrator for a serialized ownership transfer. There is no "small fix" exception. A task never changes an unowned failing test to unblock itself. Instead it stops, records the failure, and the orchestrator assigns the file.
5. Frozen unless a packet explicitly owns a narrow change: `package.json`, the lockfile, global CSS and tokens, shared Header/`BrandSignature`/Home runtime/Contact, and `.github/workflows/*`. No new dependencies. Task 9 owns only two new measurement script entries in `package.json`. It cannot change versions or other scripts.
6. A PR is review-ready only when it has: the strict TDD receipt; every Skills stage recorded; fresh deterministic results; **green PR CI** (`validate` and `test:e2e` jobs); the packet's rendered acceptance; and its visual matrix. Then GPT-6.1 Sol reviews it. Automated green alone is never enough. The owner merges; no agent merges or pushes to `main`.
7. **Visual baselines** follow [visual regression policy](../../testing/visual-regression.md). Windows baselines are captured locally. Linux baselines are adopted from CI `actual` artifacts only after owner approval of the expected/actual/diff. When CI cannot produce them, the orchestrator uses a throwaway draft PR with a visual-only configuration, never merged. Every changed baseline file belongs to the packet that changes it ([inventory](#test-and-baseline-ownership-inventory)).
8. **Documentation stays synchronized per PR.** A packet that adds a Playwright project, spec family, support helper, script or baseline set updates the matching row in `docs/testing/playwright.md` or `docs/testing/visual-regression.md` in the same PR. Task 10 reconciles; it does not catch up.

**Shared locks:** `GOVERNANCE`, `PLAN-RECORD`, `HARNESS`, `ROUTE-CUTOVER`, `LOCALE-CONTROL`, `PUBLIC-EVIDENCE`, `FOOTER`, `SERVICES`, `CONNECTED-CONTRACTS`, `CONNECTED-GROUND`, `CONNECTED-ENGINE`, `CONNECTED-HOST`, `MEDIA`, `MEASUREMENT`, `VISUAL-BASELINES`, `SHARED-TESTS`, `ACCEPTANCE`. Path locks take precedence over label convenience. A lock transfers only after merge and checkpoint. `SHARED-TESTS` covers the named blocks in the inventory below.

## Interfaces and ownership map

The new paths below are planned, not existing. Function names and signatures are the handoff contract. Implementations stay minimal and private to their owners. All client-boundary props are serializable. Server content modules import no runtime, `window`, storage or Three.

| Produced by | Interface/files | Consumed by |
| --- | --- | --- |
| Task 2 | `lib/connected-studio/types.ts`: `ConnectedRoute`, `ConnectedQuality`, `ConnectedTier`, `ConnectedLivePolicy`, localized `CapabilityWords`, immutable `GraphDefinition`, `ScenePose`, `SceneGateInput`, `SceneSnapshot`, `SceneHandle`, label types | Tasks 3, 5, 6, 7, 8, 9 |
| Task 2 | `model.ts`: `getConnectedGraph(quality)`, `getTierForWidth(widthPx)`, `getQualityForTier(tier)`, `getTravelScale(tier)`, `measureConnectedProgress(...)`, `sampleConnectedPose(previous, input)`. Deterministic seeded geometry, no random reset | Engine, host and fake-clock tests |
| Task 2 | `labels.ts`: pure `resolveLabelVisibility(labels, occluders, viewport)` implementing PC-2 | Task 7 host |
| Task 2 | `controller.ts`: `createConnectedController({clock, scheduler, render, getLayout})` → `update`, `pause`, `resume`, `dispose`, `snapshot`. Injected scheduler/cancel and monotonic `now` in milliseconds; no browser globals or Three | Tasks 5 and 7 |
| Task 2 | `capability.ts`: fail-closed `chooseConnectedMode(input)` and `CONNECTED_LIVE_POLICY` (initially `{ wide: false, compact: false }`; Tasks 7 and 8 keep both false in every merged build; Task 9 enables a tier only with passing hardware evidence). `session.ts`: safe `readConnectedSession`, `setConnectedPaused`, `markConnectedContextLost`, with a memory fallback, a namespaced pause/loss key, and a read-only check of Home's `furlanich:sky-chart-context-lost` (PC-5). `media-manifest.ts`: typed route/quality static media | Tasks 7, 8, 9 |
| Task 2 | `content.ts`: the two exact localized capability tuples and the Pause/static labels from their owning approved blocks. `components/connected-studio/ConnectedStudioGround.tsx` + `connected-studio.module.css`: server CSS/static ground and the reserved mount contract, no engine | Static pages first; enhancement attached only in Task 7 |
| Task 2 | `tests/e2e/support/connected-studio-test-hooks.ts`: one test-injection mechanism, `window.__FURLANICH_CONNECTED_TEST__ = { allowSoftwareRenderer?: boolean; livePolicy?: ConnectedLivePolicy }`, set only through `page.addInitScript`. It mirrors Home's accepted `__SKY_CHART_ALLOW_SOFTWARE_RENDERER__`. Never read from query string, storage, UI or public configuration. Functional tests and poster capture may set it, labelled as controlled test evidence. Production measurements and owner hardware acceptance never set it | Tasks 7, 8, 9 |
| Tasks 3/6 | `main` carries `data-connected-page` plus route/locale, reading-mask elements `data-connected-reading-mask`, chapter IDs and the fixed hero Pause mount `connected-pause-<route>`. Ground receives `{route, locale, capabilityWords}`. The semantic legend appears once per page as ordinary HTML | Task 7 measures geometry/occlusion and portals the button into the reserved slot |
| Task 3 | `ProjectDossierSlug = 'general-reservation-system' \| 'the-system'`; `getProjectDossierHref(locale, slug)` in `lib/site-routes.ts`; `getPublishedProjectDossiers(content, locale)` in `lib/projects/publication.ts`; `PublicProjectDossierContent`/`ResolvedProjectDossier` replace the detail-route roles | Projects, Services evidence, locale control |
| Task 3 | `lib/project-dossier-navigation.ts`: pure `resolveDossierAlternateHref(currentPath, hash, alternateHref)` keeps only a known fragment on a Projects index; otherwise it returns the existing equivalent href, following the existing base-path convention | `LanguageSwitch` (used by Header and Footer) |
| Task 4 | `components/foundation/footer-content.ts`: `getFooterConclusionContent(locale)` from the exact IA table. The Footer derives its locale from the existing opposite `paths.alternateLocale` (two-locale invariant). Existing `SiteFooterProps`/`SiteFooterLabels` stay compatible; no route-shell edits. The Footer root gets `data-site-footer` | Task 7 Footer handoff; all fourteen retained host pages |
| Task 5 | `components/connected-studio/runtime/create-connected-scene.ts`: `createConnectedScene({mount, graph, quality, tier, words, onContextLost})` → `SceneHandle`. Takes a primitive/typed DOM boundary and runs no endless loop of its own | Task 7 only, dynamically imported |
| Task 7 | `ConnectedStudioEnhancement.tsx`, `ConnectedPauseControl.tsx`: a lightweight React lifecycle leaf using the existing global `createPortal` typing (no duplicate shim). Owns browser layout/visibility/fonts/session/cancellation; delegates clock and scheduling to the controller and the GPU to the engine. Exposes the non-production `__FURLANICH_CONNECTED__` diagnostics hook only when `process.env.NODE_ENV !== 'production'`, following Home's precedent | Ground enhancement mount; Task 9 tests and measurement |
| Task 8 | `scripts/capture-connected-studio-posters.mjs`; `public/brand/connected-studio/{services,projects}-{wide,compact}.webp`; responsive derivatives beside the two original project assets | Ground picture and project dossier picture |
| Task 9 | `scripts/measure-connected-studio-production.mjs`, `scripts/measure-connected-studio-vitals.mjs`, deterministic helper `lib/connected-studio/measurement.ts`; additive `measure:connected-studio` and `measure:connected-studio-vitals` script entries | Production acceptance and reproducible receipts |

The scene is shared between the two connected routes, not with Home. A session loss on either connected route suppresses both routes in both locales. A stored Home loss also prevents connected activation (PC-5). Pause persistence covers the connected routes and locales; Home's pause behavior does not change.

### Minimum typed declarations frozen at W1

Task 2 must produce and independently review at least these fields before the owner merges it. They are interfaces, not implementation bodies. Private geometry and math may vary within the reference media. Later parallel agents consume the merged declarations unchanged. A needed interface change goes back to the contract owner as a serialized follow-up PR before dependents proceed.

```ts
type Vec3 = readonly [number, number, number];
type ConnectedRoute = 'services' | 'projects';
type ConnectedQuality = 'wide' | 'compact';            // topology: 16/33 or 8/13
type ConnectedTier = 'wide' | 'tablet' | 'compact';    // >=1024, 768–1023, <768 CSS px
type ConnectedLivePolicy = { readonly wide: boolean; readonly compact: boolean }; // 'wide' covers wide+tablet
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
  tier: ConnectedTier; livePolicy: ConnectedLivePolicy;
};
type SceneSnapshot = {
  state: 'static' | 'live' | 'paused' | 'suspended' | 'disposed';
  pose: ScenePose; pendingCallbacks: number; renderCount: number;
  targetFps: number; // 0 when stopped; ambient cap 30 wide/tablet, 20 compact; active <= 60
};
type SceneLayout = { footerDocumentTop: number; viewportWidth: number; viewportHeight: number };
type SceneUpdate = { graph: GraphDefinition; tier: ConnectedTier; scrollY: number;
  velocityPxPerSecond: number; visible: boolean; footerDominant: boolean };
type SceneViewport = { width: number; height: number; pixelRatio: number; tier: ConnectedTier };
type LabelProjection = { id: string; capabilityIndex: CapabilityIndex;
  xPx: number; yPx: number; depthScale: number; inView: boolean };
type LabelBox = { id: string; left: number; top: number; width: number; height: number; depthScale: number };
type OccluderRect = { left: number; top: number; width: number; height: number };
type LabelVisibility = { id: string; visible: boolean; left: number; top: number };
type SceneDiagnostics = { drawCalls: number; renderCount: number; pixelRatio: number;
  geometries: number; materials: number; textures: number; drawables: number; disposed: boolean };
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

Function signatures:

- `getConnectedGraph(quality: ConnectedQuality): GraphDefinition`
- `getTierForWidth(widthPx: number): ConnectedTier`
- `getQualityForTier(tier: ConnectedTier): ConnectedQuality` — `'wide'` for wide and tablet
- `getTravelScale(tier: ConnectedTier): number` — finite, in (0, 1]; wide = 1
- `measureConnectedProgress(scrollY: number, footerDocumentTop: number, viewportHeight: number): number`
- `sampleConnectedPose(previous: ScenePose | undefined, input: { graph: GraphDefinition; tier: ConnectedTier; progress: number; velocityPxPerSecond: number; deltaSeconds: number }): ScenePose`
- `resolveLabelVisibility(labels: readonly LabelBox[], occluders: readonly OccluderRect[], viewport: { width: number; height: number }): readonly LabelVisibility[]`
- `chooseConnectedMode(input: SceneGateInput): 'static' | 'webgl'` — `'static'` whenever `livePolicy[getQualityForTier(tier)]` is false
- `createConnectedController(options: ControllerOptions): ConnectedController`

Session functions take an injected nullable storage boundary in pure tests and return `{paused: boolean, contextLost: boolean}`. Access failures fall back to the connected-module memory store.

**Units:** anchors, positions and rotations use scene units and radians. Label projections and boxes use CSS pixels. Edge growth, progress and reveal bounds are finite and normalized to 0–1. Velocity is pixels per second; elapsed pose time is seconds. Node IDs and edge endpoints stay stable across locale changes. Width and height are CSS pixels. A quality or tier change rebuilds batched graph resources through `resize` in the same renderer and context, and releases the old allocations.

**Footer handoff:** progress reaches 1 when the Footer top reaches 70% of the viewport (denominator `max(1, footerDocumentTop - 0.7 * viewportHeight)`). The scene suspends and hides when the Footer top reaches 18% of the viewport. Tests cover short documents, restored scroll and resized or localized geometry. Tuning must keep completion before hiding. Controller state does not decide import eligibility: the host checks the gate input before initialization, and uses suspension for a retained live handle when hidden.

## Test and baseline ownership inventory

Existing files that the plan changes or that depend on changed behavior. Ownership passes in the listed order, one owner at a time, through `SHARED-TESTS` or `VISUAL-BASELINES` transfers. Task 3's first step re-runs the inventory search. Any hit not listed here stops work until the orchestrator assigns it.

| File | Coupling | Owners, in order |
| --- | --- | --- |
| `tests/e2e/accessibility.spec.ts` | Lines 15–16 audit retired detail routes | Task 3: replace those two rows with the two dossier index routes only. Then Task 9: full file |
| `scripts/site-header.test.mjs` | Lines 152–166 assert `LanguageSwitch` class strings | Task 3 keeps those classes unchanged. If a class must change, Task 3 owns only that block |
| `tests/e2e/studio-founder.spec.ts` | MPC/Founder actions; Footer heading at lines 89–105 | Task 3 (MPC/Founder blocks) → Task 4 (Footer block) → Task 9 |
| `tests/e2e/marketing-services.spec.ts` | ES/EN `evidencePath` values (lines 38/71) and evidence href assertion (lines 108–111) depend on the retired GRS URLs | Task 3 (only those values/assertions, new index-plus-fragment destination) → Task 6 (whole file) |
| `tests/e2e/marketing-navigation.spec.ts` | Detail-route locale cases; Footer block at lines 83–105 | Task 3 (detail and locale cases) → Task 4 (Footer block) → Task 9 |
| `tests/e2e/privacy.spec.ts` | Footer Privacy link at lines 83–95 | Task 4 (that test only) |
| `tests/e2e/sky-chart-acceptance.spec.ts` | Footer stop in the Home traversal (lines 258–300) and the link scan (line 821) | Read-only for every task, and Task 4 must run it. If it fails because of Footer structure, Task 4 owns only the Footer-region lines, with a recorded transfer. Home runtime stays untouched |
| `scripts/projects-route.test.mjs`, `scripts/privacy-route.test.mjs` | Assert `<SiteFooter` presence | Task 3 (props stay compatible) |
| `scripts/site-footer.test.mjs` | Footer source assertions | Task 4 |
| `tests/e2e/visual/services-projects.visual.spec.ts` and snapshots | `main` of Services and Projects, both platforms | Task 3 (Projects) → Task 6 (Services) → Task 8 (both, posters) |
| `tests/e2e/visual/founder.visual.spec.ts` snapshots | Founder `main` changes with the MPC source action | Task 3 |
| `tests/e2e/visual/home-sections.visual.spec.ts` snapshots | Home sections; the Footer is outside the captured elements | No owner. Must stay unchanged (OD-1, OD-3) |
| `playwright.config.ts` | Project registration | Task 2 only |
| `docs/testing/playwright.md` | Project/spec and support-helper tables | Task 2 → Task 5 → Task 7 → Task 9 (rows for their own additions) |
| `docs/testing/visual-regression.md` | Baseline inventory | Task 3 → Task 4 → Task 6 → Task 8 (rows for their own baselines) |

### Playwright registration (Task 2)

Existing unanchored patterns already match two new specs: `/responsive\.spec\.ts/` and `/accessibility\.spec\.ts/`. That is intended and recorded below.

| Spec | Projects |
| --- | --- |
| `connected-studio-static.spec.ts` | chromium-desktop, firefox-desktop, webkit-desktop, mobile-chromium, mobile-webkit, tablet-portrait-chromium, tablet-chromium, compact-320-chromium |
| `connected-studio-services.spec.ts` | chromium-desktop, firefox-desktop, webkit-desktop, mobile-chromium, tablet-portrait-chromium, compact-320-chromium |
| `connected-studio-footer.spec.ts` | chromium-desktop, firefox-desktop, webkit-desktop, mobile-chromium, compact-320-chromium |
| `connected-studio-navigation.spec.ts` | chromium-desktop, firefox-desktop, webkit-desktop, mobile-chromium |
| `connected-studio-responsive.spec.ts` | Already matched on mobile-chromium, mobile-webkit, tablet-chromium, wide-chromium. Add compact-320-chromium and tablet-portrait-chromium explicitly |
| `connected-studio-runtime.spec.ts` | immersive-chromium only |
| `connected-studio-accessibility.spec.ts` | Already matched on accessibility-chromium; no further registration |
| `connected-studio-production.spec.ts` | New project `connected-production-chromium`, defined only when `PLAYWRIGHT_SERVE_EXPORT=1` |
| `tests/e2e/visual/connected-studio-*.visual.spec.ts` | Already matched by visual-chromium |

**Production serving:** when `PLAYWRIGHT_SERVE_EXPORT=1`, the config's `webServer` runs the new `scripts/serve-static-export.mjs` instead of `next dev`. That script serves `out/` under the current base path, with no rewrite of missing routes to an index. The `connected-production-chromium` project then exists and no other project does. Without the variable, the config is unchanged, so CI (`npm run test:e2e`) never sees the production project. Task 9 runs it locally after a clean build, for root and `/Portfolio`, and records both.

## Dependency DAG and concurrency waves

```text
1 governance / human approval
└─2 contracts + Ground + harness
  ├─3 atomic dossiers + route retirement ──┐
  │  └─4 shared Footer (after 3 merges)    │
  └─5 separate scene engine ───────────────┤
                    [3, 4, 5 merged + checkpoint]
                    └─6 Atlas Services
                      └─7 enhancement integration
                        └─8 final media
                          └─9 production hardening + measurements
                            └─10 documentation + acceptance record
```

| Wave | Tasks | Start gate / owner merge order | Independence proof |
| --- | --- | --- | --- |
| W0 | 1 | Reviewed plan approved by the owner; Governance PR merged | Documentation only |
| W1 | 2 | W0 checkpoint | Defines types, Ground and harness |
| W2 | 3 ∥ 5 | W1 checkpoint. Merge order 3, then 5; each rebases and rechecks | Task 3 owns cutover, pages, evidence, locale, Ground (first render) and the inventory blocks. Task 5 owns only new engine files and its own unit test. write(3) ∩ write(5) = ∅, and Task 5 reads only merged Task 2 |
| W3 | 4 | Task 3 merged (Task 5 may still be in review) | Task 4 owns the Footer and its inventory blocks after Task 3 releases them. write(4) ∩ write(5) = ∅ |
| W4 | 6 | Tasks 3, 4, 5 merged and W2/W3 checkpoints green | Services and Ground locks transfer from Task 3 |
| W5 | 7 | Task 6 merged | Integration owns the host and takes the page/Ground hooks |
| W6 | 8 | Task 7 merged | Media, Ground and dossier-picture transfers are serialized |
| W7 | 9 | Task 8 merged | All source/test ownership transfers are serialized |
| W8 | 10 | Task 9 merged; OD-4 recorded for every device/SR item (PASS with evidence, or OPEN with the corresponding policy) | Documentation closeout only |

Do not increase concurrency by splitting Task 3's deletion from its consumer migration. Task 4 never runs in parallel with Task 3.

### Wave checkpoints

The orchestrator runs each checkpoint on `main` in a clean worktree after a fresh `npm ci`, and records the commands, results and SHA in Progress. A red checkpoint opens a fix task owned by the task whose paths contain the defect. The next wave stays locked until the checkpoint is green.

| Checkpoint | Commands on `main` | Pass condition |
| --- | --- | --- |
| W0 | `npm run docs:check` | Plan APPROVED; review record final; Governance PR merged |
| W1 | `npm run validate`; `npx playwright test --list`; `npm run test:e2e -- --project=chromium-desktop --workers=1`; `npm run test:e2e -- --project=visual-chromium --workers=1`; root `npm run verify:static-export` | New patterns listed exactly as the registration table says; no rendered change on any page |
| W2 | `npm run validate`; `npm run test:e2e -- --workers=1`; `npm run test:a11y`; root and `/Portfolio` clean build + `verify:static-export` | Six retired paths absent; both dossiers complete; all projects green |
| W3 | All W2 commands, plus `npm run test:e2e -- --project=immersive-chromium --workers=1` (Home acceptance unchanged) | Footer on all fourteen hosts; Home acceptance green |
| W4 | All W3 commands | Services catalogue and boundaries complete; baselines owner-approved |
| W5 | All W3 commands, plus `npm run measure:immersive` (Home regression, read-only) | Connected runtime spec green; Home measurement unchanged within its recorded tolerance |
| W6 | All W5 commands, plus the poster byte check in `scripts/connected-studio-media.test.mjs` | Posters within byte ceilings at both base paths |
| W7 | All W5 commands, plus `npm run measure:connected-studio`, `npm run measure:connected-studio-vitals` and `npm run measure:home-vitals`, plus the production project for root and `/Portfolio` | Every budget within limits; `CONNECTED_LIVE_POLICY` matches the OD-4 evidence |
| W8 | `npm run docs:check`; `npm run validate` | Records match the implementation; plan moved to completed |

## Task 1 / PR 1 – Record plan approval and close governance prerequisites

**Implementer:** GPT-6 Luna (`gpt-6-luna`, medium). **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus the owner. **Dependencies:** owner approval of this plan after a Sol re-review with zero BLOCKING findings. **Wave:** W0. **Locks:** GOVERNANCE, PLAN-RECORD. **TDD:** N/A (documentation only).

**Skills:** `superpowers:using-git-worktrees` → `project-knowledge-maintenance` → `verification-before-completion` → `pr-readiness`.

**Context Luna must not redo:** commit `e9f051f` already put the governance package on `main`: DESIGN-SPF-V1, RFC-SPF-REDESIGN-V1 and ADR-CONNECTED-STUDIO-PAGE-RUNTIME are APPROVED, and the supersession links exist in the design, product and evidence records. The plan-revision branch already recorded the OD-1 corrections. Do not recreate, reword or move any of that.

**Write set (closed):**
- this plan's front matter `status`, current Author/status paragraph, current Review gate status paragraph and one Progress line;
- the SPF entry in `docs/plans/index.md`;
- the current SPF plan-status summary in `docs/governance/status-register.md`;
- the PLAN-SPF-V1 paragraph in `docs/index.md`;
- the front matter `status`, introductory current-status sentence and a new approval summary in `docs/reviews/services-projects-footer-plan-review-2026-09-30.md`; historical round entries stay unchanged;
- one dated note under `## Sitemap` in `docs/product/information-architecture.md`;
- new `docs/reviews/services-projects-footer-acceptance-v1/index.md`;
- new `docs/reviews/services-projects-footer-acceptance-v1/task-1.md`.

**Forbidden:** production code, config, tests, any other document, ADR bodies, completed plans and review history.

- [ ] Verify the two inputs and stop if either is missing: (a) the owner's approval message, with its date and link; (b) the latest Sol round in the review record shows `BLOCKING 0`.
- [ ] Plan front matter: `status: APPROVED`. Set Author/status to the approved revision/date and approval source; set the current Review gate status to PASSED with its independent-round link. Progress: add `- <date>: Owner approved PLAN-SPF-V1 revision 5 (<link>). Governance PR <number> opened.` If the final-review PR already records approval, verify those entries rather than duplicating them; Task 1 still assembles its acceptance scaffold and receipt before W0.
- [ ] Update the entire current PLAN-SPF-V1 summary in `docs/plans/index.md`, `docs/index.md` and `docs/governance/status-register.md` to `**APPROVED <date>** (<link>)`, revision 5 and the passing independent round; remove current waiting-for-review/approval wording. State that W1 starts only after Task 1's Governance PR merges and W0 passes. Preserve historical review outcomes and unrelated sentences.
- [ ] Review record: front matter `status: APPROVED`; update its introductory current-status sentence; append `Owner approved revision 5 on <date> (<link>).` Keep completed review rounds as historical entries, including their PROPOSED/REOPENED wording.
- [ ] Under `## Sitemap` in the IA document, append: `**Dated target note — <date>:** the [project-slug] detail routes are retired by [DESIGN-SPF-V1](../design/services-projects-footer-v1.md) (PLAN-SPF-V1 Task 3). Until that task merges, the tree above describes the current implementation.`
- [ ] Create the acceptance index with front matter `id: REVIEW-SPF-ACCEPTANCE-V1`, `type: acceptance-record`, `status: PROPOSED`, the related IDs from this plan, and `last_verified: <date>`. Body: a title, one paragraph linking this plan, a "Receipts" list with entries for tasks 1–10 (only task 1 linked), and a link to this plan's [receipt template](#receipt-template).
- [ ] Write `task-1.md` from the receipt template. Run `npm run docs:check` and `git diff --check`. Confirm that `git diff --name-only main` lists only the write set.

**Acceptance (objective):** every checklist line is done; `docs:check` passes; the diff touches only the write set; no current plan-status summary still says PROPOSED, REOPENED or awaiting approval for PLAN-SPF-V1; historical rounds keep their original statuses; the Governance PR cites RFC-SPF-REDESIGN-V1, DESIGN-SPF-V1 and ADR-CONNECTED-STUDIO-PAGE-RUNTIME, passes Sol review and is merged by the owner. Record the main SHA.

## Task 2 / PR 2 – Define connected-scene contracts, static Ground and browser harness

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high). Sonnet owns the numeric choreography, cancellation/session reasoning, test strategy and the static Ground design within the frozen signatures and the reference media. **Dependencies:** W0. **Wave:** W1. **Locks:** CONNECTED-CONTRACTS, HARNESS, CONNECTED-GROUND.

**Skills:** `superpowers:using-git-worktrees` → `frontend-implementation` (Ground) → `design-taste-frontend-v1` preflight (Ground only) → `test-driven-development` → `playwright-qa` (registration, listing, CI parity) → `visual-qa` (Ground, disposable inspection) → `systematic-debugging` on any failure → `project-knowledge-maintenance` (testing doc) → `verification-before-completion` → `pr-readiness`.

**Write set:**
- new `lib/connected-studio/{types,model,labels,controller,capability,session,content,media-manifest}.ts`;
- new `components/connected-studio/ConnectedStudioGround.tsx` and `connected-studio.module.css`;
- new `scripts/connected-studio-{model,labels,controller,session,capability,content}.test.mjs`;
- new `scripts/serve-static-export.mjs`;
- new `tests/e2e/support/connected-studio-test-hooks.ts`;
- `playwright.config.ts` (the registration table and the conditional production server only);
- `docs/testing/playwright.md` (new spec/project rows and the production-serving procedure);
- receipt `task-2.md`.

**Forbidden:** existing pages, content, routes, Footer, engine, Home files, existing specs, global CSS/tokens and packages.

**First RED:** `visible eligible controller rotates at rest and stops pending work when paused`, in the controller unit test. The scaffold is a `createConnectedController` that returns a constant snapshot and schedules nothing. Inject a no-op scheduler and a render stub. Assert that elapsed idle time changes node rotation while positions and progress stay steady, then that `pause()` cancels every pending callback and no further renders happen. The failure must be a wrong stationary output or a missing cancellation, not a missing import.

- [ ] Write that test and the scaffold. Run `node --test scripts/connected-studio-controller.test.mjs` and record the intended failure.
- [ ] GREEN the minimal pure model, controller and session. Before each new behavior, write a RED for it, in this order:
  1. 1px of scroll moves progress before any chapter
  2. reversible scroll
  3. finite result for a zero-height layout
  4. jumps and resize
  5. graph connectivity, counts and endpoints (16/33, 8/13)
  6. no invalid node IDs
  7. each word assigned to two wide nodes and one compact node
  8. cadence and activity decay; `targetFps` values per PC-6
  9. hidden and Footer suspension
  10. dispose is idempotent
  11. unknown quality or tier fails closed
  12. tier mapping at 767/768/1023/1024
  13. `getTravelScale` is finite and in (0, 1]
  14. `livePolicy` false → static, for each tier
  15. storage denied
  16. stored connected loss and read-only Home loss (PC-5)
  17. each PC-2 label rule step

  After a hidden tab resumes, clamp elapsed time rather than integrating unseen rotation.
- [ ] Provide the exact localized tuples and labels, and the SSR Ground contract. The pure CSS/chart static fallback needs no engine and no JS. Final poster URLs become concrete only in Task 8. Do not put eight-family marketing cards into types.
- [ ] Apply the Playwright registration table and production serving exactly. Run `npx playwright test --list` and record that each new spec appears under exactly the listed projects (specs that do not exist yet show no tests; record that). Never treat "no tests found" as a pass for a spec that exists.
- [ ] Ground rendered check: mount Ground in a disposable, uncommitted route `app/(es)/spf-inspect-2/page.tsx`. Run Taste preflight and `visual-qa` at 1440 and 390 against `revision5-*-hero.png`, then compare the static fallback colors and chart grid. Delete the route. Record `git status --porcelain` showing it gone, plus the screenshots' local paths, in the receipt. The first committed rendered acceptance of Ground happens in Task 3.
- [ ] REFACTOR the pure modules without behavior change. Rerun the focused unit tests, `npm run validate` and `npm run test:e2e -- --project=chromium-desktop --workers=1`. The reviewer freezes exported declarations, units and signatures before the owner merges. Dependents cannot consume a draft.

**Acceptance (objective):**
- All listed RED/GREEN cycles are recorded.
- `grep` finds no `window`, `document`, storage or `three` import in `lib/connected-studio/*` except the guarded storage boundary in `session.ts`.
- The `--list` output matches the registration table.
- `PLAYWRIGHT_SERVE_EXPORT` unset leaves the config's project list unchanged except for the added patterns.
- The visual-chromium run shows no changed baseline.
- The `docs/testing/playwright.md` rows are added.

## Task 3 / PR 3 – Publish complete dossiers and retire detail destinations atomically

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner visual and evidence review. Sonnet owns dossier composition and the complete dependency map and fail-closed migration. Migrate useful data first, then remove the old route machinery in the same PR. **Dependencies:** W1. **Wave:** W2 (parallel with Task 5). **Locks:** ROUTE-CUTOVER, LOCALE-CONTROL, PUBLIC-EVIDENCE, SERVICES (GRS href only), CONNECTED-GROUND (bounded static fixes), VISUAL-BASELINES (Projects and Founder subtrees), SHARED-TESTS (Task 3 blocks in the inventory).

**Skills:** `superpowers:using-git-worktrees` → `frontend-implementation` → `design-taste-frontend-v1` preflight → `test-driven-development` → `emil-design-eng` (dossier border and artwork hover) → `playwright-qa` → `visual-qa` → `design-taste-frontend-v1` post-critique → `review-animations` (hover, read directly) → `systematic-debugging` on any failure → `project-knowledge-maintenance` (visual-regression rows) → `verification-before-completion` → `pr-readiness`.

**Write set:**
- ES/EN `_content/projects.ts` and `_content/founder.ts`;
- `components/projects/{content-types.ts,ProjectsPage.tsx,ProjectCard.tsx,ProjectDetailPage.tsx}` and `lib/projects/publication.ts`;
- new `components/projects/ProjectDossier.tsx` and `projects.module.css`;
- both Projects index routes, and deletion of both `[projectSlug]/page.tsx`;
- `lib/site-routes.ts`, `lib/foundation-navigation.ts`, new `lib/project-dossier-navigation.ts`, `components/foundation/LanguageSwitch.tsx`;
- `components/founder/FounderPage.tsx`, `FounderProfessionalHistory`, founder types;
- `components/services/ServicesPage.tsx` (GRS href only);
- deletion of `public/projects/mpc-administracion/conceptual-operations-model.webp`;
- `ConnectedStudioGround.tsx` and its module CSS (static defects found at first render only, each recorded);
- `scripts/{site-routes,projects-publication,projects-route,project-details,foundation-content,privacy-route}.test.mjs`, new `scripts/project-dossier-navigation.test.mjs`, `scripts/verify-static-export.mjs`;
- `tests/e2e/{marketing-projects,marketing-navigation,studio-founder}.spec.ts` (Task 3 blocks), `tests/e2e/marketing-services.spec.ts` (only ES/EN evidence destination values and the href assertion; transfer to Task 6 after W2), `tests/e2e/accessibility.spec.ts` (lines 15–16 only), `scripts/site-header.test.mjs` (`LanguageSwitch` block, only if a class must change);
- new `tests/e2e/connected-studio-static.spec.ts` and `connected-studio-navigation.spec.ts`;
- `tests/e2e/visual/services-projects.visual.spec.ts` (Projects and detail cases) with their snapshots, and the `tests/e2e/visual/founder.visual.spec.ts` snapshots;
- the `docs/testing/visual-regression.md` rows;
- receipt `task-3.md`.

**Forbidden:** Footer, shared foundation content-types, `BrandSignature`; Services styling and content; engine, controller and host; Home and Contact; other baselines, the harness and packages.

**Step 0 — inventory:** run `rg -n "general-reservation-system/|the-system/|mpc-administracion|projectSlug|ProjectDetailPage|getProjectDetail|LanguageSwitch|SiteFooter" scripts tests components lib app`. Compare every hit with the write set and the inventory. Stop and ask the orchestrator about any unassigned hit.

**First RED:** `Projects index exposes both complete dossiers before JavaScript`, in `connected-studio-static.spec.ts`. With JS disabled on the current implementation, assert that a visible article, found by title, contains the approved context, scope, evidence, source, limitation and concept caption. The current summary-card index fails because the full article is absent. Run `npx playwright test tests/e2e/connected-studio-static.spec.ts --project=chromium-desktop` and capture the failure before changing UI.

- [ ] Add the first RED and focused contract cases. Keep the exclusions. Replace obsolete positive detail assertions with dated negative ones; do not delete their protection. Verify a failure before each new behavior: known dossier fragment kept across a locale switch, unknown fragment fallback, Founder MPC external source, retired artifact absence.
- [ ] Migrate the detail story fields into dossier types and content. `getPublishedProjectDossiers` validates exactly the two approved IDs, maturity, relationships, permission, image and caption. Remove MPC only from the commercial Projects projection, not from its evidence record. Keep the source/test/Docker/historical-CI wording, the GRS contributor and the The-System incomplete/non-operational billing distinctions.
- [ ] Render two complete semantic articles, jump links, ordinary limitations and source links, related Services/Founder links and the publication note. Add foreground plates (`#0A1E33`, 1px `#36536C`, 16px radius) carrying `data-connected-reading-mask`, Ground, the semantic capability legend and the reserved Pause slot. No hidden accordion, core story or project-detail action. Use the existing concepts at their intrinsic ratio with lazy loading; Task 8 adds responsive derivatives. Add the dossier border hover and the artwork scale hover (≤1.018 over about 260ms, fixed caption, fine pointer only, removed under reduced motion).
- [ ] Replace the GRS Services href with `getProjectDossierHref`. In the Task 3-owned Services test blocks, replace both retired `evidencePath` values with the locale index and append `#general-reservation-system` after `appPathname(index)`; leave unrelated Services assertions unchanged. Run the Services spec in every currently registered project, at root and `/Portfolio`, before transferring it to Task 6. Replace the MPC Founder slug/detail navigation with the approved external source action, "Ver código fuente" / "View source code", keeping all educational limitations. Add a native equivalent-route fallback plus a small client fragment enhancement in `LanguageSwitch`: known Projects hashes only, no client-only link. On ordinary pages, keep the existing alternate-route behavior.
- [ ] Delete both dynamic route entry files, the detail-only components, types, helpers and resolvers, and the MPC concept — after `rg` shows no active consumer. Relocate `ProjectMeta`, or delete `ProjectCard` only when it has no consumers. Remove route-only `details` naming and unused labels; keep the evidence data. Do not add sitemap, robots or redirect files.
- [ ] Update the export verifier: six negative artifact assertions on a clean build; no active links or generated route payload destinations to retired paths; both full dossier bodies, captions and source links; the GRS fragment; the Founder MPC source. Keep the private/blocked fail-closed checks. Build output must be fresh, never copied over a stale export.
- [ ] GREEN the focused contracts, browser tests, no-JS checks and both exports. REFACTOR obsolete branches and imports, then rerun the same tests and `npm run validate`. Run Taste post-critique, `visual-qa` and the `review-animations` read. Refresh the Projects and Founder baselines only after the owner inspects the render. Windows baselines are captured locally; Linux baselines follow workflow item 7. Delete obsolete detail snapshots as part of the reviewed removal. Leave the Services snapshots unchanged.

**Commands:**
- `node --test scripts/site-routes.test.mjs scripts/projects-publication.test.mjs scripts/projects-route.test.mjs scripts/project-details.test.mjs scripts/project-dossier-navigation.test.mjs scripts/site-header.test.mjs`
- `npx playwright test tests/e2e/marketing-projects.spec.ts tests/e2e/marketing-navigation.spec.ts tests/e2e/marketing-services.spec.ts tests/e2e/studio-founder.spec.ts tests/e2e/connected-studio-static.spec.ts tests/e2e/connected-studio-navigation.spec.ts --workers=1` (all registered projects)
- `npm run test:a11y`
- `npm run validate`
- clean root build + `npm run verify:static-export`
- clean `/Portfolio` build + `npm run verify:static-export` + `npm run test:e2e -- --workers=1`

**Visual matrix:** Projects in ES and EN at 320, 390, 768, 1024 and 1440; 1440 at 200% zoom; 844×390 landscape; reduced motion; JS disabled; forced colors. Founder in ES and EN at 390 and 1440.

**Acceptance (objective):**
- The six retired URLs return 404 on the clean static export, at both base paths. No file, link or route payload remains for them.
- Each dossier shows every approved field from the Projects SPF-V1 table verbatim.
- The jump links reach `#general-reservation-system` and `#the-system` below the App Bar.
- A locale switch keeps a known fragment and drops an unknown one.
- The Founder MPC action points to `https://github.com/Furlanich/MilkyPantsCheese-Administracion-`.
- There is no horizontal overflow at 320, and no text is clipped across the visual matrix.
- axe reports no serious or critical violations.
- The changed baselines are owner-approved on both platforms.
- The inventory search shows no unowned hits.

## Task 4 / PR 4 – Build the shared protected-mark Azure conclusion

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner rendered critique. Sonnet implements the composition PC-4 fixes, using the exact IA copy and channel values. **Dependencies:** Task 3 merged. **Wave:** W3. **Locks:** FOOTER, VISUAL-BASELINES (new Footer subtree), SHARED-TESTS (Task 4 blocks in the inventory, transferred from Task 3).

**Skills:** `superpowers:using-git-worktrees` → `frontend-implementation` → `design-taste-frontend-v1` preflight → `test-driven-development` → `playwright-qa` → `visual-qa` → `design-taste-frontend-v1` post-critique → `systematic-debugging` on any failure → `project-knowledge-maintenance` (visual-regression rows) → `verification-before-completion` → `pr-readiness`.

**Composition (PC-4), in DOM and visual order:**
1. Foreground mark and FURLANICH signature.
2. Invitation column: the conclusion headline (H2), the introduction, and the primary "Escribinos por WhatsApp" / "Write on WhatsApp" button.
3. "Contacto directo" / "Direct contact" column: email, phone, "Información de contacto" / "Contact information" (the localized Contact route), and the location/accountability line.
4. A divider, then "Explorar" / "Explore": Services, Projects, How we work, About/Studio (the existing labels).
5. "Responsabilidad directa" / "Direct accountability": Samuel Furlanich (Founder page), then the existing `founderLinks` values in their current order (the reference shows LinkedIn and GitHub). No link is added or removed.
6. A divider, then the utility row: `© {build year} FURLANICH`, Privacy, and the language control.

Compact layouts stack these groups in the same order. The watermark (the complete three-chevron mark, static) sits behind columns 3–5 at wide sizes and behind the direct-contact group at compact sizes, as in the references. It is hidden from assistive technology.

**Write set:**
- `components/foundation/SiteFooter.tsx`, new `components/foundation/footer-content.ts`, `site-footer.module.css`, new `FooterBrandSignature.tsx`;
- `scripts/site-footer.test.mjs`;
- new `tests/e2e/connected-studio-footer.spec.ts`;
- new `tests/e2e/visual/connected-studio-footer.visual.spec.ts` and its snapshots;
- the Task 4 blocks of `studio-founder.spec.ts`, `marketing-navigation.spec.ts` and `privacy.spec.ts`, plus the conditional Footer-region lines of `sky-chart-acceptance.spec.ts` (see the inventory);
- the `docs/testing/visual-regression.md` rows;
- receipt `task-4.md`.

**Forbidden:** every `app/**/page.tsx`; shared foundation content-types, `LanguageSwitch`, `BrandSignature` and protected assets; other tests; global styles; routes, helpers, publication and engine.

**First RED:** `shared footer exposes approved invitation and WhatsApp primary action in both locales`, in the Footer browser spec. The existing Footer lacks the invitation. Add a visible, semantic assertion and run `npx playwright test tests/e2e/connected-studio-footer.spec.ts --project=chromium-desktop` before any UI work.

- [ ] Write the first RED plus retained checks: exact direct-channel hrefs in the order wa.me, mailto, tel; navigation; locale; the demo disclosure. Replace the old Tailwind-string Footer assertions with content-data, semantic and browser checks — not new CSS regex tests. Update the inventory blocks for the approved headings ("Responsabilidad directa" replaces "Enlaces profesionales").
- [ ] Keep the existing compatible props and callsites. Derive the locale from the typed `alternateLocale` and resolve the new conclusion copy locally. Build the foreground full Bone logo with the exact canonical geometry, without the App Bar's `data-app-bar-brand` marker. Never use the shared `BrandSignature variant='on-dark'` in the Footer, because that marker participates in Home App Bar detection. Add the complete CSS/SVG watermark below the text with its clear space.
- [ ] Add `data-site-footer` to the root. Keep the demo disclosure where it is now and Contact's untouched simulation. No new scheduling, prefill or autoplay behavior.
- [ ] GREEN in both locales on all seven host roles (Home, Services, Projects, Studio, Founder, Contact, Privacy). REFACTOR the compatible helpers. Rerun the same tests, `npm run test:e2e -- --project=immersive-chromium --workers=1` (Home acceptance) and `npm run validate`. Run Taste post-critique and `visual-qa` against both Footer references, then refresh the owner-approved Footer baselines (wide and compact, ES), with Linux baselines per workflow item 7. Visit the Footer, scroll back up, and confirm the Home App Bar scroll state and readout are unchanged.

**Commands:** `node --test scripts/site-footer.test.mjs`; `npx playwright test tests/e2e/connected-studio-footer.spec.ts tests/e2e/studio-founder.spec.ts tests/e2e/marketing-navigation.spec.ts tests/e2e/privacy.spec.ts --workers=1`; the Home acceptance command above; `npm run test:a11y`; `npm run validate`; clean root and `/Portfolio` builds + `npm run verify:static-export` + a `/Portfolio` run of the Footer spec.

**Visual matrix:** the Footer on all seven host roles in ES and EN at 390 and 1440 (semantic and layout checks); the Services host Footer at 320, 390, 768, 1024 and 1440; 200% zoom; JS disabled; forced colors (watermark removed, system colors).

**Acceptance (objective):**
- DOM order matches PC-4 on every host, and approved IA copy appears verbatim.
- The mark's SVG geometry is identical to the canonical source, with no transform other than a uniform scale.
- Every text element over the watermark measures at least 4.5:1 contrast (3:1 for large text). The owner picks the final watermark opacity at rendered review, starting from 0.085 wide and 0.06 compact.
- The long email wraps without clipping at 320.
- Every Footer link resolves at both base paths.
- Home acceptance passes unchanged.
- axe reports no serious or critical violations.
- Baselines are owner-approved.

## Task 5 / PR 5 – Build the batched connected 3D engine

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner review of the rendered engine. Sonnet owns depth, lighting, path design, batching and resource/race reasoning within the controller separation and the scene budgets. Optimize geometry without weakening the visible density. **Dependencies:** W1. **Wave:** W2 (parallel with Task 3). **Locks:** CONNECTED-ENGINE.

**Skills:** `superpowers:using-git-worktrees` → `find-docs` or the installed `node_modules/three` types (Three 0.186 APIs, before use) → `test-driven-development` → `visual-qa` (disposable inspection against the reference media) → `systematic-debugging` on any failure → `verification-before-completion` → `pr-readiness`.

**Write set:** new `components/connected-studio/runtime/{create-connected-scene,connected-geometry,connected-labels,dispose-connected-scene}.ts`; `scripts/connected-studio-engine.test.mjs`; receipt `task-5.md`.

**Forbidden:** contracts, controller, session, Ground, public pages, route shells, Footer, shared tests, the harness, Home, packages, and any committed test route or fixture page.

**First RED:** `disposing a constructed connected scene releases every owned GPU resource once`, in a unit test using injected renderer and resource factories. A valid minimal `SceneHandle` scaffold initially keeps its resources. Assert that dispose clears geometries, materials, textures, render lists, listeners, the context and mount ownership, and that a repeated dispose is safe. Run `node --test scripts/connected-studio-engine.test.mjs` and record the resource-count failure.

- [ ] RED resource ownership, then a minimal GREEN scene handle. Before adding geometry, labels, resize or context-loss handling, add a failing handle/render test for each, using fakes at the browser/GPU boundary. Do not assert mesh coordinates or shader source strings as proof.
- [ ] Build faceted Azure bodies, light cores and rings with instancing, plus batched curved paths, tracers and distant points. Match depth, lighting and fog to `revision5-*-hero.png` and `revision5-*-chapter.png`. Graph edges follow their moving endpoints and grow reversibly. Apply `getTravelScale(tier)`. The engine never owns an animation loop; only the controller calls render.
- [ ] Return projected upright label positions and visibility flags. The host applies PC-2. Keep positions finite and DPR within its caps through the 767/768/1023/1024 transitions. Compact genuinely uses 8 nodes, 13 paths and one ring. No bloom, HDR, model, video or heavy font textures.
- [ ] Handle context-loss callbacks and disposal, init failure, and partially constructed resources without throwing into the reading UI. Report diagnostics (including `drawables`) for tests, never as visitor-visible debug panels.
- [ ] GREEN the focused resource tests. REFACTOR batching and disposal and rerun. `npm run validate` must show unchanged public rendering. For design iteration only, mount the engine in a disposable, uncommitted route `app/(es)/spf-inspect-5/page.tsx` at 1440×900 and 390×844, at progress 0, 0.5 and 1. Compare with the reference media, then delete the route and record `git status --porcelain` as clean. That inspection is design evidence only; it is never hardware or draw-call acceptance.

**Acceptance (objective):**
- The engine compiles against the merged contract unchanged.
- It schedules nothing on its own: tests count zero scheduler calls inside the engine.
- Disposal releases every counted resource exactly once.
- Diagnostics report `drawables` ≤28 for wide/tablet and ≤18 for compact. The real `drawCalls` ceiling is asserted in Task 7.
- The compact graph is 8/13 with one ring.
- The owner accepted the inspection screenshots against the reference media, as recorded in the receipt.
- The PR merges without a live page; the static pages stay valid.

## Task 6 / PR 6 – Deliver the Atlas Services composition and boundaries

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner visual and copy review. Sonnet implements the Atlas hierarchy, the asymmetric composition, the masks and responsive behavior, using exact copy, the existing commercial paragraphs and the three service IDs. **Dependencies:** Tasks 3, 4 and 5 merged, W3 checkpoint green. **Wave:** W4. **Locks:** SERVICES, CONNECTED-GROUND (bounded static fixes), VISUAL-BASELINES (Services subtree).

**Skills:** `superpowers:using-git-worktrees` → `frontend-implementation` → `design-taste-frontend-v1` preflight → `test-driven-development` → `emil-design-eng` (catalogue hover) → `playwright-qa` → `visual-qa` → `design-taste-frontend-v1` post-critique → `review-animations` (hover, read directly) → `systematic-debugging` on any failure → `project-knowledge-maintenance` (visual-regression rows) → `verification-before-completion` → `pr-readiness`.

**Write set:**
- ES/EN `_content/services.ts`;
- `components/services/{ServicesPage,ServicesIntroduction,ServiceSection,ServicesPrinciples,ServicesFinalCta}.tsx`, `components/services/content-types.ts`, new `ServiceCatalogue.tsx`, `services.module.css`;
- `ConnectedStudioGround.tsx` and its CSS (static defects only, each recorded);
- `scripts/{services-content,services-route}.test.mjs`;
- `tests/e2e/marketing-services.spec.ts` (whole-file ownership transferred from Task 3 after W2), new `tests/e2e/connected-studio-services.spec.ts`;
- the Services cases and snapshots in `tests/e2e/visual/services-projects.visual.spec.ts`;
- the `docs/testing/visual-regression.md` rows;
- receipt `task-6.md`.

**Forbidden:** Projects, Founder, route helpers, `LanguageSwitch`, Footer, engine, harness, global CSS, Home (including Home copy, OD-3) and Contact. The existing Services route props stay compatible; no shell edits.

**First RED:** `Services exposes three native catalogue anchors and the complete scoped boundaries before enhancement`, in the new Services browser spec. The existing composition lacks the catalogue. Assert three native href/heading destinations plus the visibility of each compressed boundary and the full commercial block. Run `npx playwright test tests/e2e/connected-studio-services.spec.ts --project=chromium-desktop` before any UI work.

- [ ] Add the first RED plus content cases for the exact new buyer copy, the capability tuple and the AI scope sentence, without changing the original boundary strings. Verify the intended failures before implementing.
- [ ] Compose: introduction → web-dominant asymmetric catalogue (one large card on the left, two stacked on the right at ≥1024px) → three alternating opaque chapters → complete working boundaries → Footer. Add the SSR Ground, legend, masks and reserved Pause mount from Task 2; no live engine yet. Keep the GRS index evidence link from Task 3.
- [ ] Make the catalogue cards native anchors with a sticky-header offset. In each chapter, all outcomes, delivery, engagement, evidence and actions plus the service-specific boundary come before the working-boundaries link, evidence and Contact. Keep the shared agreement, AI/ERP scope and commercial content verbatim and visible. Do not add a technology catalogue or invent proof for automation or support.
- [ ] Hover: fine pointer only, lift and arrow ≤3px over 160–220ms on explicit properties, a brighter border and the PC-3 static radial light. Keyboard and focus are native, with `:focus-visible` showing the same affordance. Below 768px, collapse to natural single-column flow; reflow at zoom; no hidden text or reveal. Background accents cannot show through paragraphs. Add semantic chapter hooks without changing scroll behavior.
- [ ] GREEN the browser, content, no-JS and axe checks. REFACTOR presentation only, then rerun the focused tests and `npm run validate`. Run Taste post-critique, `visual-qa` and the `review-animations` read, then refresh the owner-approved Services baselines (Linux per workflow item 7). Compare Home's Services wording; record any inconsistency as OPEN in the receipt, and change nothing on Home (OD-3).

**Commands:** `node --test scripts/services-content.test.mjs scripts/services-route.test.mjs`; `npx playwright test tests/e2e/marketing-services.spec.ts tests/e2e/connected-studio-services.spec.ts --workers=1`; `npm run test:a11y`; `npm run validate`; clean root and `/Portfolio` builds + `npm run verify:static-export` + a `/Portfolio` run of the Services spec.

**Visual matrix:** Services in ES and EN at 320, 390, 768, 1024 and 1440; 1440 at 200% zoom; 844×390 landscape; reduced motion; JS disabled; forced colors.

**Acceptance (objective):**
- At ≥1024px the web card is the single large left card, and the other two stack on the right.
- All three catalogue anchors land with their heading fully below the App Bar, at both base paths.
- Every compressed boundary and the five-item commercial block appear verbatim in no-JS HTML.
- There is no horizontal overflow at 320 or at 200% zoom.
- Hover moves at most 3px and the transitions measure 160–220ms. Reduced motion removes the transforms.
- axe reports no serious or critical violations.
- Baselines are owner-approved.
- The GRS evidence link reaches `#general-reservation-system`.

## Task 7 / PR 7 – Integrate optional live backgrounds and accessible lifecycle

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner motion and visual critique. Sonnet owns cancellation, session and focus reasoning, label collision and occlusion, motion integration and real navigation invariants. No new abstraction in Home. **Dependencies:** Task 6 merged (Tasks 2–5 already merged). **Wave:** W5. **Locks:** CONNECTED-HOST, CONNECTED-GROUND, SERVICES/PROJECTS page-hook transfers.

**Skills:** `superpowers:using-git-worktrees` → `frontend-implementation` → `design-taste-frontend-v1` preflight → `test-driven-development` → `emil-design-eng` (scene motion and Pause) → `playwright-qa` → `visual-qa` → `review-animations` (read directly) → `design-taste-frontend-v1` post-critique → `systematic-debugging` on any failure → `project-knowledge-maintenance` (testing doc) → `verification-before-completion` → `pr-readiness`.

**Write set:**
- new `ConnectedStudioEnhancement.tsx` and `ConnectedPauseControl.tsx`;
- Ground and its module CSS;
- `ServicesPage`/`ProjectsPage` (missing mount and mask semantics only);
- new `scripts/connected-studio-host.test.mjs`;
- new `tests/e2e/connected-studio-runtime.spec.ts`, `connected-studio-responsive.spec.ts`, `connected-studio-accessibility.spec.ts`;
- new `tests/e2e/support/connected-studio.ts`;
- the `docs/testing/playwright.md` helper rows;
- receipt `task-7.md`.

Engine and contract files change only through a post-merge transfer registered before the edit.

**Forbidden:** page copy, Footer, routing and locale helpers, Home, `BrandSignature`, Contact, harness, packages and global CSS.

**First RED:** `eligible connected page starts a gently rotating scene with an accessible Pause control`, in the runtime browser spec. Use `connected-studio-test-hooks.ts` (`allowSoftwareRenderer` and `livePolicy: { wide: true, compact: true }`) with ordinary server content. This controlled opt-in never changes the shipped policy. The current CSS-only Ground has no active scene or control. Assert an active decorative canvas and a localized Pause control, then that idle orientation changes while positions stay steady. The intended failure is the missing enhancement, not an undefined helper or import. Run `npx playwright test tests/e2e/connected-studio-runtime.spec.ts --project=immersive-chromium`. After that minimal GREEN, write the next RED: reduced motion and Save-Data request no engine. Its request observation must cover the actual optional closure.

- [ ] Add a failing cycle before each behavior:
  1. delayed activation, and cancel before the import resolves
  2. probe disposal
  3. session preference and loss, including the read-only Home loss (PC-5)
  4. `livePolicy` false per tier (via the test hook)
  5. normal software rejection
  6. module and render failure
  7. one live renderer
  8. hidden and Footer suspension
  9. Pause across connected routes and locales
  10. focused dynamic fallback
  11. fonts, resize and current-geometry restoration
  12. reduced-motion hover removal
  13. **real draw calls ≤28/18 from diagnostics at 1440 and 390**
  14. 33/13 edges at growth 1 at the handoff
- [ ] Keep the merged `CONNECTED_LIVE_POLICY` at `{ wide: false, compact: false }`. Assert ordinary no-hook pages stay static and make no engine request; functional live tests opt in through the hook. Before the actual engine import in the client leaf, check: load, visibility, preferences, `CONNECTED_LIVE_POLICY`, and a coarse WebGL2/hardware probe. Release the probe first. Avoid duplicate contexts during React mount, unmount and async resolution. The default software path is static. The test hook never becomes public runtime configuration.
- [ ] Bind native scroll, layout resize, `visualViewport`, fonts and visibility to the controller. Read layout in batches, outside per-scroll writes. Start from the actual restored scroll; compute whole-page progress through the Footer handoff and the chapter accent separately. Zero optional-init shift. Fully static if init fails or preferences forbid it. Never hide core content while waiting for fonts or the engine.
- [ ] Render a decorative, pointer-inert portal canvas with DOM labels behind the masks and the current foreground. Apply `resolveLabelVisibility` with occluders from the reading masks, captions, Pause and the App Bar. Labels never rotate, never cross viewport edges and never shrink below about 11px. Nodes rotate gently at rest with stationary positions; the first scroll accelerates movement and path growth. Keyboard and user scroll stay native.
- [ ] Reserve and present a localized Pause control of at least 44px. Persist it through the safe session store, freeze on pause and resume from the current progress. Keep the focused fallback control. Hidden, offscreen and Footer states cancel pending timers and animation frames. Route unmount cancels async callbacks, observers, listeners and GPU resources. If Home's previous renderer is still mounted, defer the new activation rather than create a second context. Verify the real transition without editing Home's runtime.
- [ ] GREEN the targeted runtime, static and axe checks. REFACTOR the lifecycle boundaries and rerun every prior case plus `npm run validate`. Record the motion at 1440×900 and 390×844 in ES and EN: idle 5 seconds, first 12px of scroll, middle, reverse, anchor jump, Footer, Pause/resume. Compare it side by side with `revision5-services-motion.webm` and `revision5-projects-motion.webm`. Then run the `review-animations` read, Taste post-critique and `visual-qa`. Add no autoplay or audio dependency.

**Commands:** `node --test scripts/connected-studio-host.test.mjs`; `npx playwright test tests/e2e/connected-studio-runtime.spec.ts --project=immersive-chromium --workers=1`; `npx playwright test tests/e2e/connected-studio-responsive.spec.ts tests/e2e/connected-studio-accessibility.spec.ts tests/e2e/connected-studio-static.spec.ts --workers=1`; `npm run test:e2e -- --project=immersive-chromium --workers=1` (Home acceptance); `npm run test:a11y`; `npm run validate`; clean root and `/Portfolio` builds + `npm run verify:static-export` + a `/Portfolio` runtime run.

**Visual matrix:** both pages in ES and EN at 320, 390, 768, 1024 and 1440, static and (under the hook) live; 200% zoom; reduced motion; forced colors; context-loss fallback with Pause focused.

**Acceptance (objective):**
- All fourteen cycles are green.
- Diagnostics show draw calls ≤28 at 1440 and ≤18 at 390, and DPR ≤1.5/≤1.25.
- At the handoff progress all 33/13 edges have growth 1, and at 18% the scene is suspended with zero pending callbacks.
- No label overlaps another or any occluder, in the recorded poses at all five widths.
- CLS from enhancement is 0.
- The focused fallback keeps focus with "Fondo estático" / "Static background" and `aria-disabled`.
- Home acceptance passes unchanged.
- The owner accepted the controlled-test recordings against the reference `.webm` files, as recorded in the receipt. Both live tiers stay disabled in this PR and deployment until Task 9 supplies passing hardware evidence.
- SwiftShader proves functional behavior only. Hardware acceptance happens in Task 9.

## Task 8 / PR 8 – Produce matched posters and truthful responsive imagery

**Implementer:** GPT-6 Luna (`gpt-6-luna`, medium) for the frozen mechanical asset production and wiring; Claude Sonnet 5.5 for the capture-design preflight, visual continuity, complex corrections and opening the PR. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus owner visual inspection. Sonnet supplies exact poses and settings, the asset and wiring matrix, byte ceilings, paths and captions. Luna follows that closed handoff under serialized locks, with no reinterpretation of the illustrations. **Dependencies:** Task 7 merged. **Wave:** W6. **Locks:** MEDIA, CONNECTED-GROUND, VISUAL-BASELINES (Services/Projects subtree and the new poster subtree); serialized `media-manifest`/Ground/`ProjectDossier` transfers.

**Skills:**
- Sonnet: `superpowers:using-git-worktrees` → `frontend-implementation` → `visual-qa`.
- Luna: `test-driven-development` → `playwright-qa`.
- PR lead (Sonnet): `systematic-debugging` on any failure → `project-knowledge-maintenance` (visual-regression rows) → `verification-before-completion` → `pr-readiness`.

**Write set:**
- `scripts/capture-connected-studio-posters.mjs` (following the `scripts/render-sky-chart-posters.mjs` precedent) and the four poster WebPs;
- `lib/connected-studio/media-manifest.ts`, Ground picture selection, `ProjectDossier` picture selection;
- additive `conceptual-workflow-{640,960,1280}.webp` and `conceptual-access-model-{640,960,1280}.webp` beside the originals;
- new `scripts/connected-studio-media.test.mjs`;
- new `tests/e2e/visual/connected-studio-static.visual.spec.ts` with its snapshots, and the `services-projects.visual.spec.ts` snapshots;
- the `docs/testing/visual-regression.md` rows;
- receipt `task-8.md`.

**Forbidden:** the original protected mark and concept files; copy, evidence, scheduler, routes, global CSS and dependencies. Use existing image tooling only.

**First RED:** `compact static media selects an existing ≤80KiB matched poster without engine`, in the media contract test. Start from the merged Ground's CSS-only fallback. The required compact poster selection and existence assertion fails because the artwork is missing, not because of an import error. Run `node --test scripts/connected-studio-media.test.mjs`.

- [ ] Sonnet freezes and records, from merged Task 7: the browser and renderer used for capture (and whether it is hardware or SwiftShader, with software/live-policy overrides only in the capture script); viewport, DPR and progress per poster; the label treatment; and the asset/picture/manifest matrix. Include checkable cases for selection, intrinsic size, lazy loading, failure and base path. Any unresolved design or integration issue stays Sonnet's work under serialized locks.
- [ ] Luna verifies RED for the supplied cases, then captures the exact-pose wide and compact Services and Projects posters from the merged scene, using the frozen label treatment. Do not rasterize semantic content; keep the accessible vocabulary in HTML.
- [ ] Luna encodes under 150KiB (wide) and 80KiB (compact), and generates resolution-only concept derivatives that keep the entire 1599:900 source, the alt text, caption and source provenance. Sonnet inspects depth, node and path continuity at the static-to-live transition, and makes any design correction after a lock transfer. Both original reusable assets stay intact.
- [ ] GREEN the responsive picture choice, intrinsic allocation and the CSS fallback on image 404, with no engine fetch. No eager preload of both dossier images or of poster variants. Every poster and derivative URL resolves under `/Portfolio`. REFACTOR the media metadata, then rerun the unit and browser tests, `npm run validate`, and clean root and `/Portfolio` exports.
- [ ] The owner reviews the four posters and representative wide/compact paused, reduced-motion and no-JS states. Capture stable controlled Chromium baselines with reduced motion (Linux per workflow item 7). Do not remove meaningful labels or captions to shrink screenshot differences. Compare expected, actual and diff before baseline approval.

**Commands:** `node --test scripts/connected-studio-media.test.mjs`; `npx playwright test tests/e2e/connected-studio-static.spec.ts --workers=1`; `npm run test:e2e -- --project=visual-chromium --workers=1`; `npm run validate`; clean root and `/Portfolio` builds + `npm run verify:static-export` + a `/Portfolio` run of the static spec.

**Visual matrix:** both pages in ES and EN at 390 and 1440 for poster selection, plus 320, 768 and 1024 for intrinsic allocation; reduced motion; JS disabled; image 404 (route-blocked) fallback.

**Acceptance (objective):**
- Four posters within their byte ceilings, recorded in the test; the merged live policy remains `{ wide: false, compact: false }`.
- `<picture>` selects the wide or compact poster at the 768px boundary.
- Zero image-induced layout shift.
- Derivatives have identical aspect ratios and full-frame content (owner-checked).
- Captions and the legend stay localized HTML.
- The CSS fallback renders on image failure with the dossier still complete.
- All URLs resolve at both base paths.
- Baselines are owner-approved.

## Task 9 / PR 9 – Harden production journeys, budgets and cross-page regressions

**Implementer:** Claude Sonnet 5.5. **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, xhigh) plus owner manual and performance review. Sonnet owns integrated failure investigations, the whole optional dependency closure, budget optimization and the live-policy evidence. No gate is relaxed and nothing unrelated is redesigned. **Dependencies:** Task 8 merged. **Wave:** W7. **Locks:** ACCEPTANCE, MEASUREMENT, SHARED-TESTS (Task 9 blocks); explicit sequential lock transfers for any fixed path.

**Skills:** `superpowers:using-git-worktrees` → `systematic-debugging` (every defect) → `test-driven-development` (RED per defect) → `playwright-qa` → `visual-qa` → `review-animations` (read directly) → `design-taste-frontend-v1` post-critique → `project-knowledge-maintenance` (testing doc) → `verification-before-completion` → `pr-readiness`.

**Write set:**
- the two new measurement scripts, `lib/connected-studio/measurement.ts` and `scripts/connected-studio-measurement.test.mjs`;
- `package.json` (two new script entries only);
- new `tests/e2e/connected-studio-production.spec.ts`;
- `tests/e2e/{accessibility,marketing-navigation,app-bar,home-sections}.spec.ts` (assertions only);
- `tests/e2e/support/paths.ts` (only if fragment handling needs normalization);
- `scripts/verify-static-export.mjs`;
- the `CONNECTED_LIVE_POLICY` values in `lib/connected-studio/capability.ts` (after transfer);
- the `docs/testing/playwright.md` production-measurement rows;
- receipt `task-9.md` and the production report artifacts.

**Defect fixes:** any SPF-owned path may be fixed only after (a) a recorded defect, (b) a RED test reproducing it, and (c) an orchestrator lock transfer naming that exact path. Never concurrently. There is no broad source glob, and no "refinement" outside a recorded defect.

**Forbidden:** Home runtime, state, model, proof and copy (OD-3); Header and brand; Contact and Privacy behavior; dependencies and versions; unrelated page design; new claims.

**First RED:** `optional scene budget counts the complete nested chunk closure once`, in `scripts/connected-studio-measurement.test.mjs`. A valid fixture contains an entry plus nested shared dependencies whose combined Brotli size exceeds 120KiB. The initial helper counts only the entry and wrongly passes. Assert the violation and the complete deduplicated byte total. Run the focused Node test, record the wrong total as the intended failure, then implement correct closure accounting. Write a RED for each real cross-route, back-forward, race or focus defect before fixing it. Do not rerun already-passing implementation tests as fictitious TDD.

- [ ] Build route-neutral production measurement: requests plus the emitted chunk dependency/manifest cross-check. Count every optional engine/runtime dependency absent from the matched static-preference route requests, cold and warm separately, for both pages and both locales. Report bytes (raw and Brotli) and paths, and fail if any route exceeds 120KiB. Confirm that static routes and preference paths never fetch the optional closure.
- [ ] Extend the established gzip lab server and throttling method to the four page/locale destinations, without editing `scripts/measure-home-web-vitals.mjs` or `tests/e2e/support/production-instrumentation.mjs`. Import their exported helpers, or copy the profile constants verbatim with a comment naming the source. Run ten journeys per locale and profile: cold navigation plus meaningful Pause and link interactions. Aggregate p75 LCP ≤2500ms and INP ≤200ms; this is lab data, not field data. Report enhancement shifts separately, with observer attribution, method and limitations.
- [ ] Functional production journey, served from `out/` (`PLAYWRIGHT_SERVE_EXPORT=1`), at root and `/Portfolio`:
  - Home → Services → Projects → locale switch → Founder → Contact, then back and forward;
  - recognized and unknown fragments;
  - Pause persistence, session loss, a delayed import race;
  - no duplicate contexts, stale words or leaked listeners; focus preserved;
  - full content without JS;
  - Save-Data, reduced motion, no WebGL, software renderer, module failure, image failure, a dynamic preference change with focus, forced colors.
- [ ] Cross-browser: Chromium, Firefox and desktop WebKit for fallback, layout and links; live mode where the browser supports hardware WebGL2. Controlled SwiftShader runtime counts as functional evidence only. Check 320, 390, 768, 1024 and 1440, 200% zoom, and all fourteen Footer hosts with axe plus keyboard, manual contrast, headings and landmarks. Contact's success and error simulation still sends zero inquiry requests and keeps its disclosure.
- [ ] **Hardware protocol (owner-executed, OD-4):** Sonnet prepares a step-by-step protocol and recording sheet. The owner runs it on: their desktop (CPU, GPU, OS and browser recorded); a named Android phone with ≤4 cores where available, in Chrome; an iPhone in Safari; NVDA with Firefox; and VoiceOver on iOS. The protocol: three full up/down traversals, at least 2 minutes of visible idle, and Pause, hidden and Footer checkpoints. Use the isolated candidate procedure below to sample render work and active frame interval p95, long tasks, draw calls and DPR, label continuity, heat and memory, and disposal across routes. No software override. Measure the 30/20 ambient cap separately; paused states show zero scheduled callbacks and draws. Record GPU query availability and disjoint rejection; CPU-only estimates are never called GPU measurements.
- [ ] **Candidate then shipped verification:** follow the isolated candidate procedure below. Keep candidate live reports distinct from final shipped-policy reports; check a disabled tier as static, and keep unmeasured live hardware metrics OPEN, never a zero-valued PASS. Emitted optional dependency closure and poster byte ceilings remain mandatory for every tier.
- [ ] **Set `CONNECTED_LIVE_POLICY` from the evidence (OD-2/OD-4):** `wide: true` only if the desktop hardware gates passed; `compact: true` only if the Android and iPhone gates passed. Otherwise set `false` and record the item OPEN with its reason. RED the policy expectation in the capability test before changing the constant.
- [ ] If budgets fail: RED the defect, then optimize within the approved proportions and counts first. Lower cadence, DPR or distant points (the far background points only, never the 16/33 or 8/13 graph) as needed, then repeat the affected evidence. Dropping graph density, raising the 120KiB/20ms/CWV gates, or changing the live policy against the evidence requires an owner decision. Never pass by weakening assertions.
- [ ] GREEN the measurement, unit and browser matrix and the real gates. REFACTOR only proven hotspots and race ownership, then rerun the affected failures and the final commands. Run the `review-animations` read and Taste post-critique against the reference media. Explain accepted, adapted and rejected feedback without overruling the spec. Verify there is no unsupported "roadmap" chronology or product-maturity implication.

**Commands and checkpoints:**
- `npm run validate`
- `npm run test:e2e -- --workers=1` (avoids the known `next dev` concurrency race without changing assertions)
- `npm run test:a11y`
- `npx playwright test --list`
- clean root and `/Portfolio` build, export and production project (`PLAYWRIGHT_SERVE_EXPORT=1 npx playwright test --project=connected-production-chromium`)
- `npm run measure:connected-studio`
- `npm run measure:connected-studio-vitals`
- read-only Home regression: `npm run measure:immersive` and `npm run measure:home-vitals`

Home's existing accepted exceptions and status are reported independently. The new routes inherit no headroom exception.

**Acceptance (objective):**
- Every automated gate passes with honest artifacts.
- The old public URLs return 404 on a clean static preview, with no residual files or active links.
- Fail-closed evidence remains.
- The Home, Header and Footer host journeys and the zero-transmission Contact regressions pass.
- Each hardware and screen-reader item is either PASS with recorded evidence, or OPEN with `CONNECTED_LIVE_POLICY` set as OD-4 requires.
- Nothing is relabelled.

## Task 10 / PR 10 – Synchronize implementation facts and record acceptance

**Implementer:** GPT-6 Luna (`gpt-6-luna`, medium). **Reviewer:** GPT-6.1 Sol (`gpt-6.1-sol`, high) plus the owner's final review. **Dependencies:** Task 9 merged; every OD-4 item recorded as PASS or OPEN with its policy. **Wave:** W8. **Locks:** ACCEPTANCE, PLAN-RECORD, GOVERNANCE. **TDD:** N/A (documentation only). A behavior correction goes back to its source owner with TDD, in a separate bounded PR.

**Skills:** `superpowers:using-git-worktrees` → `project-knowledge-maintenance` → `verification-before-completion` → `pr-readiness`.

**Inputs the orchestrator supplies (closed):**
- every merged receipt;
- the measurement reports;
- the OD-4 sheet;
- the final `CONNECTED_LIVE_POLICY` values;
- PR numbers and merge SHAs;
- the exact fact list below with the values filled in.

Luna transcribes and links. It writes no new characterization.

**Fact list to record:**
1. Projects has two index dossiers and no detail paths; the six URLs are retired.
2. The scene has a separate controller and engine, and the typed publication module.
3. Responsive concept derivatives and four posters, with their byte sizes.
4. The shared Footer and its host list.
5. Static export behavior at root and base path.
6. The live-policy values and their evidence.
7. OPEN items, each with its owner.

**Write set:**
- `ARCHITECTURE.md` and `docs/architecture/current-system.md` (facts 1–5 only);
- the dated acceptance/supersession links in the records Task 1 touched;
- `docs/testing/{strategy,playwright,visual-regression}.md` (reconciliation only);
- `docs/index.md`, this plan and its index entry;
- `docs/reviews/services-projects-footer-acceptance-v1/index.md`;
- receipt `task-10.md`.

Move the plan to `completed/` only when every gate is PASS, or OPEN with its policy, and every merge is done. **Forbidden:** production code, config and tests; immutable ADR rationale; unrelated plan histories; confidential or internal evidence.

- [ ] Fill the acceptance index with a requirement → task → test/render/device → PR table covering the [coverage map](#review-focus-and-traceability), copying verdicts from the receipts exactly. List the measured values, devices, browsers, base paths and main SHA. Keep prototype evidence, software regression results and hardware acceptance as separate columns. If an input is missing or contradictory, stop and send it back to the orchestrator; never infer PASS.
- [ ] Write facts 1–7 into the listed records, each sentence linking its receipt. Add dated acceptance links to historical baseline summaries without rewriting approvals.
- [ ] Record the owner's manual production review against the reference media and spec — marketing hierarchy, evidence truth, the field at idle, first scroll, depth and connections, touch, reduced motion, no-JS and fallback, the Footer mark and contacts, keyboard and zoom — as approval or as exact rejected discrepancies. A discrepancy is fixed and retested on its owning implementation PR before closeout.
- [ ] Run `npm run docs:check`, `npm run validate` and `git diff --check`. Review the full diff. All receipts, independent reviews and owner merges are complete, with no outstanding blocking acceptance finding.

**Acceptance (objective):**
- Every fact in the list appears with a receipt link.
- No PASS without evidence.
- The owner's manual review is recorded.
- `docs:check` and `validate` pass.
- The PR is merged by the owner.
- Only then is the plan marked COMPLETED.

## Verification commands, artifact hygiene and manual procedure

Run commands sequentially in each task's own worktree.

**Cleaning build output on Windows:** resolve `.next` and `out` under that worktree's verified absolute root. Check that neither resolves outside it or through an unexpected link, then remove them with PowerShell `Remove-Item -LiteralPath` only. Never delete source, another worktree or an unchecked computed path. Stop managed dev servers before changing the base path. Use the per-task `PLAYWRIGHT_PORT`.

**Root production:** clear the base-path variable for this shell, clean the outputs, then run `npm run validate` and `npm run verify:static-export`.

**Base-path production:** in PowerShell run `$env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'`. In Git Bash use `MSYS2_ENV_CONV_EXCL='NEXT_PUBLIC_BASE_PATH' NEXT_PUBLIC_BASE_PATH=/Portfolio <command>`. Clean the outputs, then run `npm run build`, `npm run verify:static-export` and `npm run test:e2e -- --workers=1`. Restore the environment afterwards. Keep root and base-path reports separate, and verify that the build actually used the chosen value. A root-only hardcoded Home measurement is not a base-path proof.

**Isolated candidate evaluation (Task 9):** merged builds through Task 8 retain `{ wide: false, compact: false }`. In Task 9's private worktree, after a capability-path lock transfer, temporarily enable only candidate tiers and build a clean root or `/Portfolio` export. Record the source SHA, exact uncommitted policy-only diff, build/base path and candidate report filenames. Serve the export through the local static preview for the owner's real-hardware protocol and production measurement scripts. Never commit or push the temporary setting, deploy the candidate, or set software/live-policy test overrides in these runs. If hardware is unavailable, record that tier's hardware/live results OPEN rather than fabricate an enhanced measurement. Restore both values to false after evaluation, then use Task 9's RED/GREEN policy test to enable only tiers with passing evidence. Rebuild clean outputs and rerun root and `/Portfolio` shipped-policy journeys and applicable measurements, distinguishing candidate and shipped artifacts. Static CWV/content/failure checks remain mandatory even when both tiers are disabled. Passing candidate results support enablement only while engine, media, host and measurement source still match; material corrections require repeated evidence. Confirm the final diff contains no unevidenced true value. Later enablement uses this same procedure in a bounded follow-up PR.

**Production specs** serve the exported `out/` through `scripts/serve-static-export.mjs` (`PLAYWRIGHT_SERVE_EXPORT=1`), never `next dev`. Absence tests check the 404 response and missing content, links in both HTML and navigation payloads, and actual directory absence. The static server never rewrites missing routes to an index. The existing `appUrl` helper appends a trailing slash: compose `appUrl(index) + '#slug'`. Never put a hash inside its route argument until a tested helper enhancement is merged.

**Visual baselines** use the visual-chromium project's platform-specific naming, reduced motion and a static pose, settled self-hosted fonts and a deterministic copyright year. The owner approves the rendered design and each changed expected/actual/diff. Linux baselines are adopted per workflow item 7. Never bulk-update baselines to make CI green. Screenshots, videos, traces and reports are local or CI artifacts by default; commit only reviewed baselines and intentionally curated acceptance evidence. New scene runtime screenshots freeze the pose through the test hook, never by enabling software rendering in production.

**Manual final checklist** (the owner executes the device and screen-reader rows, OD-4):
- source order, one H1, landmarks;
- all story and boundary text;
- keyboard, focus and Pause announcements;
- anchors and locale hash;
- exact concept captions;
- both node vocabularies, upright labels and occlusion;
- idle → first scroll → reverse → Footer;
- reduced motion, no-JS, Save-Data, failure and forced colors;
- five widths, zoom, landscape, mobile chrome and touch;
- all Footer hosts and channels;
- NVDA with Firefox and VoiceOver on iOS;
- physical desktop, Android and iPhone metrics, and heat during sustained use;
- clean root and `/Portfolio` exports.

Each item gets PASS, FAIL or OPEN with evidence, the person who checked it and the date. Never claim conformance from axe alone.

## Review focus and traceability

These input classes need named tests in their owner packets, not a generic "handle edge cases" instruction.

| Risk/input | Required assertion/inspection | Owner |
| --- | --- | --- |
| Empty, unknown or private dossier data or hash; arbitrary slug; duplicated IDs | Fail-closed publication; exactly two dossiers; known hash kept, unknown dropped; no retired routes | 3 |
| Zero or short page; long localized copy; resize, mobile chrome, restored scroll, anchor jump | Finite, clamped progress; first-pixel response; recomputed Footer endpoint and current pose; steady camera; upright labels | 2, 7, 9 |
| Async import, font or probe finishing after unmount; rapid route, locale or back-forward changes | No late canvas, duplicate context, listener leak or stale words; focus preserved | 5, 7, 9 |
| Preference change, context loss or storage denied while Pause has focus | No engine for known static paths; frames cancelled; safe session fallback; static button inactive and focused | 2, 7, 9 |
| Dense or long labels, or image/module failure, at 320, zoom or forced colors | No overflow, occluded copy or tiny labels; complete HTML/CSS fallback; exact captions; real actions | 3, 4, 6, 7, 8, 9 |
| Ambient versus active timing; shared chunk cache; software versus hardware | Cadence cap separate from cost; complete closure within the cold limit; physical-device report; no inherited exception; live policy matches evidence | 5, 9 |

**Coverage map:**
- hierarchy, copy and boundaries → 6
- dossier truth, routes and MPC → 3
- Footer, logo and contacts → 4
- graph, capability, progress, session and labels → 2
- depth, batching and resources → 5
- live behavior, labels, interaction, accessibility and fallback → 7
- imagery and posters → 8
- full cross-browser, responsive, CWV, base path, live policy and manual regression → 9
- owning records and human acceptance → 1, 10

Skill findings stay in each receipt as recommendation → accepted/adapted/rejected against the approved spec.

## Receipts, independent review and final gate

Every behavioral receipt includes:
- task, model, provider identifier and settings, and each model's subtask contribution and serialized handoffs;
- the independent GPT-6.1 Sol reviewer;
- branch, worktree and base SHA;
- exact owned paths and locks;
- every Skills stage with its outcome;
- **the RED command, test and intended failure**; GREEN with the same command passing; the REFACTOR change and the repeated pass;
- fresh full checks and PR CI status;
- visual, accessibility, responsive, motion and performance evidence;
- deviations and independent findings;
- the owner's PR merge and its merge SHA.

Documentation and generated-art exceptions are explicit; generated-art loading and selection behavior is not exempt. A test added after the behavior is a recorded TDD deviation, never retroactively called RED.

### Receipt template

```text
Task N / PR N – <title>
Implementer(s): <model, provider id, settings; per-subtask contribution>   Reviewer: GPT-6.1 Sol (<settings>)
Branch/worktree: codex/spf-<n>-<purpose> at .worktrees/spf-<n>   Base: <main SHA>   PLAYWRIGHT_PORT: <port>
Owned paths touched: <list>  (must be a subset of the packet write set)
Locks held/transferred/released: <list with times>
Skills stages: <skill → when → outcome>, in contract order; skipped stage = finding
RED:      <command> → <failing test names + intended-reason excerpt>
GREEN:    <command> → <passing summary>
REFACTOR: <what changed> → <command> still passing
Validation (fresh): npm run validate → <result>; <Playwright commands> → <result>;
          verify:static-export root → <result>; /Portfolio → <result>; PR CI → <result>
Accessibility: <axe results + manual checks>
Visual matrix: <widths × locales × states actually checked>   Reference media compared: <files>
Tuned constants: <name = value, reason>   (reference-media items only)
Baseline changes: <none | files + owner approval link, win32 and linux>
Deviations: <none | description + reason>
Open items: <none | item, owner>
Documentation impact: <records updated in this PR>
```

**Independent plan review:** a fresh **GPT-6.1 Sol (`gpt-6.1-sol`, high)** agent, distinct from the plan author and contributors, reviews read-only against this plan, the spec and the source. It must try to find missing requirements, overlap, concurrency and unmerged-dependency problems, weak acceptance, visual/3D ambiguity, TDD gaps, responsive/accessibility/performance cases and provider mismatches, including every assignment against the approved model-routing criteria. Findings use `BLOCKING / HIGH / MEDIUM / LOW`, with a target task, a concrete risk and a recommended correction. The reviewer never rewrites the plan. The plan author revises, independent review repeats after material corrections, and every BLOCKING finding is resolved before the owner approves. Every later PR also gets an independent Sol review.

**Review gate status: PASSED (2026-10-05), revision 5.** Fresh independent GPT-6.1 Sol [round 6](../../reviews/services-projects-footer-plan-review-2026-09-30.md#round-6-independent-review-of-revision-5) verified SPF-FINAL-01 to SPF-FINAL-04 resolved at `d16d909`: BLOCKING 0, HIGH 0, MEDIUM 0, LOW 0. The [owner's conditional approval](../../reviews/services-projects-footer-plan-review-2026-09-30.md#owner-approval-2026-10-05) is recorded. Historical review rounds remain unchanged; PR #104 merged on 2026-10-05 and its `validate` and browser CI jobs passed. The separate Task 1 Governance PR, its human merge and W0 still precede code execution.

## Risks and rollback

- Physical phones and screen readers depend on the owner's availability (OD-4). An OPEN item turns the matching live tier off; it never blocks content or relabels evidence.
- The shared Footer may expose previously unseen host-page layout or contrast regressions. Its compatible API, the host grid and the Home acceptance run catch them. Unexpected global changes need a lock transfer and bounded review.
- Route removal is deliberately final. A defective runtime, host or media PR can be reverted on its own, back to complete static reading. Revert the retirement only together with its consumer, content and export changes, and only with owner authorization. Never restore just the six route files against the new publication contracts. Keep clean-output deployment discipline so stale deleted files cannot survive.
- A runtime budget failure goes static for the rejected tier, then is optimized and retested. Degrading the live design or changing a ceiling goes back to the owner and governance. No automatic dependency installs. Provider availability and substitutions follow the approved model-routing policy.

## Progress

- 2026-09-30: The owner approved the Revision 5 written design and copy and authorized ADE v2 planning plus independent review. Codex authored this PROPOSED plan. Production unchanged. Governance merge and W0 not performed.
- 2026-09-30: Independent GPT-6 Luna round 1 found two MEDIUM issues; the original author revised paths and contracts. Round 2 verified the fixes with no remaining findings. Documentation and diff validation passed; no implementation started.
- 2026-09-30: The owner approved the model routing (Claude Sonnet 5.5 for complex and design work, GPT-6 Luna only for low-demand, low-risk, no-design implementation, independent GPT-6.1 Sol review for every PR). Tasks 2–7 and 9 were reassigned, Tasks 1, 8 and 10 bounded for Luna, and the Sonnet/Luna media handoff and provider checks added. Sol round 3 found no issues. The plan stayed PROPOSED.
- 2026-10-05: A supplemental independent review against `main` at `5270e32` returned NOT READY (4 BLOCKING, 14 HIGH, 16 MEDIUM, 6 LOW). The owner decided OD-1 to OD-4. Revision 4 serializes Task 4 after Task 3; adds the Skills contract, Non-goals, reference media, the test/baseline ownership inventory, wave checkpoints, the orchestrator role, production serving, the live policy, tier and label contracts, objective acceptance and the receipt template; and rewrites Task 1 for repository state. The OD-1 corrections went into the visual-language, status-register and Sky Chart acceptance records. The review gate is reopened for Sol round 5. Execution has not started.

- 2026-10-05: Revision 5 corrects SPF-FINAL-01 to SPF-FINAL-03. Task 3 owns the Services evidence-test migration until W2; merged live defaults stay false pending hardware evidence from isolated candidate exports; Task 1 can synchronize current status summaries without changing historical rounds. Fresh independent review is pending. No implementation started.

- 2026-10-05: Fresh independent GPT-6.1 Sol round 6 verified all four final-review findings resolved at `d16d909`, with zero unresolved findings. The [owner's conditional approval](../../reviews/services-projects-footer-plan-review-2026-09-30.md#owner-approval-2026-10-05) is fulfilled; revision 5 is APPROVED. The final-review Governance approval [PR #104](https://github.com/Furlanich/Portfolio/pull/104) is open for human review. Task 1's remaining packaging and W0 have not run; no implementation started.

- 2026-10-05: Task 1 execution started from `main` at `7787d17` after the owner merged [PR #104](https://github.com/Furlanich/Portfolio/pull/104). The OpenAI Codex primary session is the orchestrator (exact session model identifier is not exposed by the harness). Task 1 is dispatched to `gpt-6-luna`, medium, in `.worktrees/spf-1` on `codex/spf-1-governance`; GOVERNANCE and the Task 1 acceptance paths are acquired for Luna, while the orchestrator retains PLAN-RECORD Progress ownership. A read-only Claude Code provider check resolved `sonnet` to `claude-sonnet-5-5` on `firstParty`. The acceptance scaffold/receipt Governance PR, independent Sol review, human merge and W0 remain pending; no production implementation started.

- 2026-10-06: Task 1's Governance [PR #105](https://github.com/Furlanich/Portfolio/pull/105) merged at `f9f740d`; GOVERNANCE and the Task 1 acceptance paths are released. **W0 checkpoint PASSED** on `main` at `f9f740d` in a fresh worktree after `npm ci` (exit 0): `npm run docs:check` passed (294 Markdown files, 99 document IDs, 38 Skills); the plan and REVIEW-SPF-PLAN-2026-09-30 are APPROVED, and the Governance PR is merged. The Task 2 implementer session ran this checkpoint at the owner's request, as recorded in the [Task 2 receipt](../../reviews/services-projects-footer-acceptance-v1/task-2.md).

- 2026-10-06: Task 2 ([PR #106](https://github.com/Furlanich/Portfolio/pull/106), Claude Sonnet 5.5, `claude-sonnet-5-5`, firstParty) merged at `944a350`; PR CI `validate` and `browser` passed. CONNECTED-CONTRACTS, HARNESS (including the owner-granted transfer of `scripts/connected-studio-harness.test.mjs`) and CONNECTED-GROUND are released. The W1 frozen declarations are now the merged contract.

- 2026-10-06: A new orchestrator session started: Claude Opus 5.5 (`claude-opus-5-5`), firstParty, in the Claude Code desktop app. **W1 checkpoint PASSED** on `main` at `944a350`, root base path, in a clean detached worktree after `npm ci` (exit 0), with `PLAYWRIGHT_PORT=3300`:
  - `npm run validate` passed: docs:check 295 Markdown files, 99 document IDs, 38 Skills; `npm test` 359/359; lint, typecheck and build passed.
  - `npx playwright test --list`: 1385 tests in 22 files. The new connected-studio patterns are registered exactly as the registration table says; none of those specs exist yet, so they list no tests.
  - `test:e2e --project=chromium-desktop --workers=1`: 193 passed, 2 skipped.
  - `test:e2e --project=visual-chromium --workers=1`: 64 passed; no baseline changed.
  - `verify:static-export`: 20 routes, base path `/`.
  - The only working-tree change was the `next dev`-regenerated `next-env.d.ts`, so there is no rendered change.

- 2026-10-06: W2 dispatched from `944a350`. Both tasks are Claude Sonnet 5.5 subagents dispatched by the orchestrator.
  - Task 3: `.worktrees/spf-3` on `codex/spf-3-dossiers-route-retirement`, port 3230. Acquired ROUTE-CUTOVER, LOCALE-CONTROL, PUBLIC-EVIDENCE, SERVICES (GRS href only), CONNECTED-GROUND (bounded static fixes), VISUAL-BASELINES (Projects and Founder subtrees) and SHARED-TESTS (Task 3 blocks).
  - Task 5: `.worktrees/spf-5` on `codex/spf-5-connected-engine`, port 3250. Acquired CONNECTED-ENGINE.
  - Task 5 was started at the owner's request; write(3) ∩ write(5) = ∅.
  - Both sessions were interrupted by a provider rate limit and resumed with their context intact.
  - Each PR passed `validate` and `browser` CI on its own branch: [PR #107](https://github.com/Furlanich/Portfolio/pull/107) (Task 5) at `da87bae` and [PR #108](https://github.com/Furlanich/Portfolio/pull/108) (Task 3) at `a1a4211`.
  - The owner merged PR #107 at 2026-10-06T22:08:21Z (`f426043`), then PR #108 at 22:08:33Z (`025b447`). That reverses the planned order (Task 3, then Task 5) and skips the rebase-and-recheck step; see the deviations below.
  - The W2 checkpoint has not run; the W2 locks are released only when it passes.
- 2026-10-07: Task 7 of [PLAN-ADE-AGENT-USAGE-V1](../completed/ade-agent-usage-optimization-v1.md) records the ADE agent-usage adoption decision for the remaining tasks (see [Important implementation decisions](#important-implementation-decisions)). No packet, lock, routing, Skills or gate text was changed.

- 2026-10-07: The owner authorized review and correction of Tasks 3/5 after ledger [PR #109](https://github.com/Furlanich/Portfolio/pull/109) merged at `1514860`. The bounded correction branch `codex/spf-task-3-5-corrections` uses that combined baseline. Claude Sonnet 5.5 (`claude-sonnet-5-5`, firstParty, high) implemented scene ownership/failure containment, the second wide/tablet orbit, native locale navigation and regression fixtures; GPT-6 Luna handled serialized mechanical receipt/index corrections. Independent read-only GPT-6.1 Sol Standards and Spec reviews have zero unresolved source or factual-receipt findings. A LOW workflow deviation (no recorded pre-implementation Taste preflight) is disclosed, with a retrospective authority/design audit rather than a retroactive stage claim. Fresh parent gates passed: `validate` 417 tests, root and `/Portfolio` exports 14 routes each, 24 affected development checks and 216 production-export checks; the preceding broader scoped development matrix passed 316 before the final test-only setup refactor. Exact results and historical failures are retained in the [correction receipt](../../reviews/services-projects-footer-acceptance-v1/task-3-5-corrections.md). Final committed-diff review precedes draft publication; PR CI remains pending. Full Task 3/5 acceptance, owner rendered/hardware approval and W2 on merged `main` remain OPEN, and W2 locks are not released by this correction record. Both live-policy values remain false; no later task, wave checkpoint or human merge is recorded.

- 2026-10-07: Draft [PR #110](https://github.com/Furlanich/Portfolio/pull/110) published the correction at `88757d1`. Its run 37639870554 passed validate but failed browser CI (2 failed, 1552 passed, 89 skipped, 32 did not run); both named WebKit failures came from the shared native-middle-click control before the primary journey bodies ran. The orchestrator reassigned only the navigation fixture and append-only evidence to Claude Sonnet 5.5 (firstParty, high). Separate GPT-6.1 Sol (high) Standards and Spec reviews identified and verified corrections to scenario ownership; GPT-6 Luna (medium) performed frozen, serialized receipt wording and testing-document updates, releasing those path locks between batches. Fresh parent gates passed: `validate` 417 tests, root and `/Portfolio` exports 14 routes each, the complete affected development navigation matrix 280 checks and focused production-export navigation 42 checks. Commands, historical failures, limits and routing remain in the [correction receipt](../../reviews/services-projects-footer-acceptance-v1/task-3-5-corrections.md). Final assembled-diff review precedes pushing the follow-up; a fresh complete PR CI run is required before any review-ready claim. No green CI is inferred from Windows results. The disclosed LOW preflight omission, full owner acceptance and W2 on merged main remain OPEN; both live-policy values stay false and no human merge or wave checkpoint is recorded.

- 2026-10-07: PR #110's navigation repair passed all 70 navigation cases in each desktop engine on Linux (210 completed cases), including the two reported WebKit failures. Run 37670667717 attempt 2 was nevertheless canceled at its 30-minute job limit after about 20.5 minutes of Ubuntu dependency installation; its partial log has 619 completed PASS markers, zero failed-case markers and no complete summary. The orchestrator explicitly assigned a narrow CI-support packet outside the original Tasks 3/5 product scope: Claude Sonnet 5.5 (firstParty, high) owned only `.github/workflows/ci.yml`, the testing record and an append-only receipt. The browser job now uses the official Playwright 1.63.0 Noble image matching the locked package; Node 24, the full suite, two workers, the deadline, retries, assertions, baselines and artifacts are preserved. Current main `70e324c` was merged without conflicts. Fresh integrated `validate` passed 435 tests; the unchanged browser inventory remains 1691 tests in 24 files. Separate read-only Standards and Spec source checks found no new findings; final assembled-diff review and fresh complete container CI precede any readiness claim. The [correction receipt](../../reviews/services-projects-footer-acceptance-v1/task-3-5-corrections.md) records the serial lock release, evidence and unverified container risks. The existing LOW preflight omission, full owner acceptance and W2 remain OPEN; both live policies stay false and human merge authority is unchanged.

- 2026-10-07: Container CI run 37678206635 at `6adc24f` passed validate and started tests within 52 seconds, then exceeded the overall 30-minute browser-job limit. Its incomplete log contains 1553 completed PASS markers, 89 SKIP markers and zero failed-case markers; all 280 navigation cases passed on Linux, including the reported WebKit cases, but 49 scheduled cases remained and there is no complete reporter summary. The orchestrator explicitly assigned a further narrow CI-support packet to Claude Sonnet 5.5 (firstParty, high), with exclusive ownership of the workflow, testing record and append-only receipt; those locks are now released. The overall browser-job resource budget changes from 30 to 35 minutes only. Per-test/hook 30-second and assertion 5-second deadlines, two workers, one retry, all cases, assertions, baselines and artifacts remain unchanged. The Standards scope assessment found no new governance approval or RFC/ADR requirement. Parent semantic-diff and documentation checks, separate final Standards/Spec reviews and a complete new-head remote CI run precede any readiness claim; the adequacy of 35 minutes is unverified. Exact evidence remains in the [correction receipt](../../reviews/services-projects-footer-acceptance-v1/task-3-5-corrections.md). The LOW preflight omission, full owner acceptance and W2 remain OPEN; both live policies stay false and human merge authority is unchanged.

## Important implementation decisions

The owner decisions and plan clarifications of 2026-10-05 are recorded in [OD-1 to OD-4 and PC-1 to PC-7](#owner-decisions-and-plan-clarifications-2026-10-05). Later decisions made during execution are added here with their date, owner and link.

- 2026-10-07, owner (D1, D4 and the D6 amendment of [PLAN-ADE-AGENT-USAGE-V1](../completed/ade-agent-usage-optimization-v1.md), recorded by its Task 7): **ADE-AGENT-USAGE adoption.** The remaining tasks (4 and 6–10) follow [GOV-AGENT-USAGE](../../governance/agent-usage.md). Approved packets are not rewritten. The model routing for implementers, exclusive ownership, locks, the Skills contract, strict TDD, wave checkpoints, receipts, owner visual acceptance and human merges are unchanged.
  - **Legacy exemption.** PLAN-SPF-V1 stays exempt from the docs validator by ID and its packets carry no `**Execution**` blocks. Under I-1 an absent block means `SINGLE_AGENT`, work class `IMPLEMENTATION`, `Subagents Allowed: 0`. Tasks 4, 6, 7, 9 and 10 run that way.
  - **Orchestration (D1).** The orchestrator is coordination-only: it holds the lock ledger, runs the wave checkpoints and updates Progress. It no longer dispatches implementers as subagents, as it did for Tasks 3 and 5 in W2 (that history stands). Each remaining task starts as its own top-level session in its own worktree. At most 3 task sessions per provider run at once (I-9).
  - **Header.** The recommendation of `superpowers:subagent-driven-development` is superseded by `AGENTS.md`. Execute each task with `superpowers:executing-plans`.
  - **Task 8 handoff (D4).** The serial Sonnet→helper handoff stays as the one recorded `BOUNDED_MULTI_AGENT` exception:
    - Execution Mode `BOUNDED_MULTI_AGENT`, Work Class `IMPLEMENTATION`, Subagents Allowed 1.
    - Single-agent insufficiency: the capture, encoding, resolution-only derivatives and exact wiring are a closed, finite checklist, and doing them in the Sonnet lead's context costs more than a cheaper model working from the frozen handoff.
    - Cost justification: the helper reads only the frozen handoff and the named write-set paths, and it is cheaper per token than the lead.
    - Responsibility 1: mechanical asset production and exact wiring, at medium effort.
    - Isolation: the paths named in the packet move by serial lock handoff and are returned before Sonnet edits them again. Nesting is forbidden.
    - The Task 8 session names the helper model from models its runtime can spawn. GPT-6 Luna is not required (D6 amendment). If no suitable helper can be spawned, the Sonnet session does the mechanical part itself and records a degraded run.
  - **Other Luna handoffs.** The Model routing clause that sends a separable subtask to Luna is no longer a standing permission. Each use needs a recorded per-use owner approval and a valid `BOUNDED_MULTI_AGENT` block; otherwise the Sonnet lead completes the work.
  - **Independent review (D6 amendment).** Every PR keeps an independent review by a separate top-level session that has not contributed to it, plus owner visual/manual acceptance and the human merge. The reviewer need not be GPT-6.1 Sol (including Task 9's xhigh assignment): a fresh session started through the `codex` plugin at its default model suffices, and the owner may name a stronger reviewer for a task at dispatch. Implementer assignments, including Luna for Task 10 and the mechanical part of Task 8, are unchanged where the provider exposes the model, as the provider-check clause in Model routing already requires.

## Deviations discovered during execution

Corrections from independent review are recorded in the review artifact, not treated as implementation deviations.

- 2026-10-06: The W0 checkpoint was run by the Task 2 implementer session instead of an orchestrator, at the owner's request; its result is unaffected.
- 2026-10-06: PR #107 (Task 5) merged before PR #108 (Task 3), the reverse of the W2 merge order. PR #108 was not rebased and rechecked on top of Task 5. The write sets do not overlap, but no CI run has covered the combined `main` at `025b447`, so the W2 checkpoint on that SHA is the first combined verification.
