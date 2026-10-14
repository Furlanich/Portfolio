---
id: PLAN-SFC-V1
type: execution-plan
status: PROPOSED
plan_status: ACTIVE
execution_policy: ADE-AGENT-USAGE-V1
related:
  - DESIGN-SFC-V1
  - SPEC-SFC-V1
  - RFC-SFC-COMMERCIAL-ATLAS-V1
  - GOV-ENGINEERING-LIFECYCLE
  - GOV-AGENT-USAGE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - ADR-STATIC-LOCALIZED-ROUTING
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
  - TEST-VISUAL-REGRESSION
last_verified: 2026-10-14
---

# Studio, Founder, Contact and legal implementation plan

> **For implementers:** use `superpowers:executing-plans` inline, one primary agent per task, zero subagents. GOV-AGENT-USAGE overrides the writing-plans Skill's delegation suggestion. Each implementation task runs in its own top-level session and `codex/` branch/worktree. The master plan is authored by the planning authority, not Claude.

**Goal:** deliver the approved bilingual Atlas Studio/Founder/Contact experience, genuine public inquiry intake and subordinate original legal pages, with responsive, accessible, measured proximity/string interaction across five connected page pairs.

**Architecture:** extend the existing pure connected model/controller and one direct-Three.js host/engine through immutable route profiles. Keep semantic server pages, locale-owned typed copy, an isolated inquiry port/Formspree adapter and static export. Home's renderer stays separate. Commercial intake and each graph tier have independent release gates.

**Stack:** installed Next.js 16.3.2-compatible version, React 18.2, TypeScript, Tailwind 3, Three.js 0.186, React Hook Form 7, existing Node contract runner and Playwright/axe. No dependency, hosting, font or backend migration.

**Spec:** [DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md), written revision 1 approved in Q14 on 2026-10-14, including linked field-level copy and bounded supersessions; Q15 subsequently approved the controlled release order. Read the entire spec and the task's linked copy owners before execution.

## Status and stop boundary

**PROPOSED, revision 1 — execution NOT AUTHORIZED.** `plan_status: ACTIVE` locates this draft in the repository schema; no task has started. Discovery base: `main`/`origin/main` at `bd5cd66aa0282735245605f1063ad5912a60d3ed`; written package commit `9a90cf33`. Reconcile newer human-merged main before dispatch; do not reset user work or assume those hashes remain current.

After producing this plan, stop for **independent Claude Opus 5.5, High**, in a separate top-level, read-only session. It assesses architecture, design, 3D feasibility/performance, accessibility, TDD, decomposition, ownership, concurrency and ambiguity. It must return findings with severity/evidence; it must not rewrite this plan or contribute code. The planning authority records each finding as accepted/adapted/rejected with reasons, revises justified items and returns the final review-ready plan. No implementation starts before that gate and owner authorization close. No review has run in this planning session.

## Requirements, authority and fixed boundaries

The canonical design owns geometry, exact graph data/physics and behavior. [Studio/Founder](../../product/pages/studio-and-founder.md#atlas-redesign-copy-selection), [Contact/Privacy](../../product/pages/contact-and-privacy.md#atlas-commercial-interaction-copy), [Terms](../../product/pages/terms-and-conditions.md), and the Home/Services consistency sections own public text. Their draft legal wording is selected for professional review, not certified for publication. The [discovery recommendation register](../../reviews/studio-founder-contact-design-2026-10-14/index.md) records major Skill recommendations and conflicts.

| Area | Binding implementation constraint |
| --- | --- |
| Routes | Preserve all existing pairs; add only `/terminos/`, `/en/terms/`, ID `terms`. Commercial export has sixteen localized foundation documents. Retired project detail destinations remain actual 404s. |
| Identity | Existing brand/mark/palette, Instrument Sans/IBM Plex Mono, App Bar and Footer composition; opaque scoped Atlas plates. No portrait or new public claims. |
| Hierarchy | Studio: identity → accountability/collaborators → principles → location → Founder bridge → Contact. Founder: complete biography → professional links → experience → education → capabilities → evidence → Contact. Contact: intro/expectation → intake/privacy → alternatives → Founder. Legal: title/metadata → contents → all sections → contact/reciprocal link. |
| Responsive | 1180px inner container, 32/20px gutters, breakpoints 1024/768. Use spec's exact 68/48/42 Studio/Contact and 88/64/56 Founder H1 scales, section/body measures, padding and source order. Check 320/390/768/1024/1440, 200% zoom and mobile keyboard. |
| Facts | Preserve three biography paragraphs, both employment entries including internship, both education entries, all four capabilities, MPC educational/group/fictional limitations and approved source link; employer narrative only. Preserve and verify CV PDF/filename and approved LinkedIn/GitHub. |
| Graph | Five route pairs share one controlled runtime. New profiles use spec's exact anchors/edges/depth, node-ID words and small rings; Services/Projects retain topology, vocabulary, proportions, scroll growth/tracers. FOV 35°, camera z=12; prototype FOV 50° is not production authority. |
| Motion | Radius 280px, nearest five squared weights, node caps 34/24/14px; spring 42/10, mass 1; event-rate-normalized momentum. Pinned strings with five interior samples, tension 90, spring 32/7, caps 16/10/6px and Contact 4px; ≤12 curve segments, no per-edge tubes/draws. All equations/thresholds in spec apply. |
| Input/lifecycle | Pointer yields and inertial fade; touch native-scroll only. Contact nodes remain exactly fixed and form focus/submission suspends graph. New pages sleep at rest; Services/Projects retain 1.2°/s, ≤30/20fps ambient. Active ≤60fps. Pause/hidden/offscreen/Footer/fallback leave zero pending callbacks. |
| Fallback | Reduced motion, Save-Data, rejected WebGL2/software, session context loss: no optional Three request. Runtime changes dispose. Existing session preference keys only; Home flag read only. Forced colors removes decoration; no-JS retains readable HTML and direct channels. |
| Form | Four public fields, limits 100/254/120/4000 Unicode code points, 24KiB transport, 10s timeout, real trap, explicit valid submit only, synchronous request lock, stale-result/cancellation protection. Only 2xx JSON `ok:true` is acceptance; every failure preserves values, no auto retry/storage/logging. |
| Configuration | Exact owner endpoint `https://formspree.io/f/meaqwnbr`, explicit committed mode/release record plus validated build-time endpoint; no environment-only/public toggle. Missing/wrong endpoint fails commercial build. Ordinary CI always intercepts provider traffic. |
| Legal | Samuel Furlanich operating as FURLANICH; address/email as supplied in owner record. No invented corporation, registration, transfer mechanism, retention guarantee or effective date. Argentine professional review and actual provider/account facts are release blockers. Terms cover website use/inquiries only. |
| Performance | Optional closure ≤120KiB Brotli including transitive chunks; no critical-chunk evasion. Posters ≤150/80KiB; draw calls ≤28/18; DPR ≤1.5/1.25. Physical-hardware active frame-interval p95 ≤20ms; task <50ms; LCP ≤2.5s, INP ≤200ms, enhancement CLS exactly zero. |

No product code is changed by this plan. Existing accepted ADRs retain their historical text; Task 1 accepts bounded scope through governance and Task 2 records the new decision. Full public activation waits for matching legal/intake/consistency copy in one build. No CAPTCHA, analytics, CRM, uploads, paid upgrade, service-contract terms or broader Home restyling is authorized.

## Review focus

Five easily missed conditions receive explicit tests rather than implementer discretion:

1. Same physical pointer path sampled at 60/120Hz, or a long hidden-tab gap: equivalent displacement within 1.5px, no energy explosion or replay (Task 3).
2. Curved edge growth/tracers after node movement, including nearly coincident endpoints: pinned ends, finite bounded curve, no tracer on a stale chord (Task 7).
3. Two same-tick submits, navigation during a pending request, or a late provider field error: one request, abort/ignore after disposal, no newer-state overwrite (Task 4/9).
4. Emoji/supplementary characters and multiline input near limits: code-point semantics survive native controls and provider normalization without silent clipping (Task 4/9/11).
5. Mode/copy drift or a candidate artifact reaching deployment: fail build/release, keep demo zero transmission, and roll back the whole intake/legal release on a real delivery failure (Task 13/14).

## Providers and independent review

| Task shape | Exact implementation target | Reason |
| --- | --- | --- |
| Governance, typed content, semantic page/form integration, operational receipts | **OpenAI GPT-6 Luna — High** (`gpt-6-luna`, reasoning `high`) | Bounded, testable transformations with approved design and narrow write sets. |
| Shared seams/harness, physics, pooled renderer, host lifecycle, performance diagnosis, release integration/tier policy | **Anthropic Claude Sonnet 5 — High** | Coupled state, projection, allocation, scheduling or release-risk work requires sustained cross-module reasoning. |
| Master-plan review only | **Anthropic Claude Opus 5.5 — High** | Required independent design/architecture/decomposition gate; no authorship, implementation or rewrite. |

Preflight records actual provider, immutable/resolved model identifier and High effort in each receipt. Codex's enabled catalog supports `gpt-6-luna`/High. Claude CLI 2.1.286 is installed, but exact Sonnet 5 and Opus 5.5 identifiers/account availability have **not** been verified. Do not use floating `sonnet`/`opus` aliases: the previous governance probe resolved `sonnet` to Sonnet 5.5. Unavailable requested model means no dispatch; return the exact availability finding to the owner for explicit routing resolution. Do not silently use Sonnet 5.5, a different effort or a more costly model. No implementation/provider probe is invoked by plan authoring.

Each PR's **reviewer R** is a fresh independent top-level Codex review session through the repository's `codex` plugin under GOV-AGENT-USAGE; record the model it actually resolves. It has not authored that PR and performs Standards + Spec review, read only. This governed PR-review routing is separate from the owner's exact Opus master-plan gate. Human owner reviews/merges every PR. Security/privacy findings additionally require Samuel's operational sign-off; legal sufficiency requires professional Argentine review.

## Execution, isolation and checkpoint protocol

Use branches `codex/sfc-01-governance` through `codex/sfc-15-live-tiers` and one separate managed worktree per active task, based on the wave's human-merged main SHA. One task session owns the entire packet including its tests. No task spawns implementers/reviewers, no nesting, no two active sessions share a task, write set or dependency chain. Maximum three concurrent task sessions total here (also within the repository's three-per-provider cap). The coordination-only session maintains the dispatch ledger and never edits product files.

All unlisted paths are forbidden. Shared read-only authority includes this plan/spec, existing ADRs, `AGENTS.md`, `CONTEXT.md`, testing/Skills and package/lockfiles. `package.json`, lockfiles, global CSS/tokens, Home runtime, protected mark, shared App Bar and `.claude`/`.codex` controls are forbidden in every packet unless expressly owned below. A necessary new write/dependency requires a reviewed packet amendment before editing, not opportunistic scope expansion.

Task receipts live at `docs/reviews/studio-founder-contact-acceptance-v1/task-NN.md` (each task exclusively owns its file). Task 1 creates the acceptance index; only the coordinator updates that index and this plan's Progress at **quiescent** wave checkpoints after writers stop. Do not have every implementer touch the plan or shared status register. Current requirement/architecture owners are synchronized by the specifically assigned serial tasks. Receipts record `Agent usage: SINGLE_AGENT; 0 subagents`, model/effort, base/head, RED expected/actual failure, GREEN/refactor runs, design evidence, review disposition, PR and human merge. No raw inquiries, credentials or private account screenshots in Git.

**Skills contract:** use repository `architecture-governance`/`project-knowledge-maintenance` for accepted target/current-fact synchronization; `test-driven-development` for each behavior; `frontend-implementation` and `playwright-qa` for public UI; `visual-qa` for rendered judgment; `verification-before-completion` and `pr-readiness` at every packet boundary. Design-bearing tasks use the repository's Taste v1 contract, Impeccable and Emil instructions as assigned below. Record recommendation/disposition and a degraded inline run if a Skill requests delegation. Generic font/library/AIDA/perpetual-motion advice does not override DESIGN-SFC-V1. Read the relevant installed Next guide under `node_modules/next/dist/docs/` before Next-sensitive changes; honor actual installed APIs, not recalled conventions. No new skill/plugin installation or vendored Skill edits are part of execution.

Reviewer R uses a separate checkout/artifact directory at the reviewed immutable head, with its own build output and port `3300+task number`; it never shares the implementer's active build/cache or writes source. Review browser runs also acquire the machine browser/GPU lock. Coordinate reviews/dispatch within provider caps rather than treating the independent review as a free concurrent worker.

| Wave | Tasks (dependencies) | Disjoint work / release condition |
| --- | --- | --- |
| W0 | 1 (independent plan review + owner execution authorization) | Governance only; human merge before product code. Start external owner/counsel work. |
| W1 | 2 (1) | Shared types, static ground and test partition; freeze interfaces. |
| W2 | 3, 4, 5 (each 2) | Pure graph model; inquiry boundary/state; Studio. No mutual dependencies. |
| W3 | 6 (2), 7 (3), 8 (2) | Founder; runtime geometry; legal template/private copy. Prior wave sessions stopped. |
| W4 | 9 (4,8), 10 (3,5,6,7) | Contact UI and connected host use W1-frozen form signal; no shared writes. Real combined behavior checked after both merge. |
| W5 | 11 (8,9,10 + human account/counsel facts) | Finalize private legal/commercial copy and readiness receipts; no active agent waits on humans. |
| W6 | 12 (3,5,6,7,9,10,11) | Posters, diagnosis, production metrics and physical hardware. Exclusive browser/GPU collection; all other task sessions idle. |
| W7 | 13 (1–12 complete) | Atomic commercial release candidate, all route/copy/config changes and full integration QA; hold human merge until release operator and rollback are ready. |
| W8 | 14 (13 human merge/deployment) | Immediate live release evidence and independent operational audit; failed receipt follows rollback protocol. |
| W9 | 15 (12,13,14) | Separately reviewed live-tier enablement and final acceptance. No tier enabled by an earlier packet. |

A dependency means the declared code and verification checkpoint is human-merged, not merely an agent reporting completion. W2/W3/W4 have proven disjoint paths; later serial ownership transfers occur only after old writers exit. If one task needs a sibling's unfinished output, stop that dependency and serialize/replan; do not merge a partial shared branch. Rebase remaining sibling PRs after each human merge and rerun their relevant checks before merging.

Exclusive resources: each worktree owns `.next`, `out`, caches, build log, `test-results`, `playwright-report` and `tsbuildinfo`. Use `PLAYWRIGHT_PORT=3200+task number` (3201…3215), no server reuse across worktrees; production serving uses `reuseExistingServer:false`. Browser-heavy tests, screenshot capture, trace capture and hardware measurement share a machine-wide `SFC-BROWSER-GPU` lock and run serially even across disjoint tasks. Tasks may overlap editing/Node tests while that lock is held. `SFC-DEPLOY` protects main-to-Pages release; `SFC-FORMSPREE-LIVE` protects the finite live submission allowance; both held only by Samuel/release operator. No live requests in ordinary automated tests.

### W1 interface freeze and file map

Task 2 declares connected types and compatibility adapters, not physics/transport bodies. The inquiry/legal signatures below are agreed interfaces whose types and bodies are implemented by their owning tasks. Tests precede any adapter behavior. Later tasks consume these names; a required change returns to the checkpoint before siblings start. Page owners reserve `id="connected-pause-studio"`, `connected-pause-founder` or `connected-pause-contact` and annotate unplated text with existing `data-connected-reading-mask`; the host uses these exact selectors. Their scoped reading scrims block scene paint with 24px clearance (Contact intro 32px), while cached host rectangles suppress decorative labels. Opaque plates/form already block scene paint; do not introduce a new shader/clipping engine just to obtain readable text.

| Boundary / owning task | Frozen public seam |
| --- | --- |
| `lib/connected-studio/types.ts` / 2 | `ConnectedRoute = 'services'|'projects'|'studio'|'founder'|'contact'`; `ConnectedWordBinding = {readonly nodeId:string; readonly word:string}`. Keep `CapabilityWords` eight-tuple for legacy pages. New-profile nodes/projections make `capabilityIndex` optional; hosts bind new words by node ID, never fabricate a service index. |
| Ground / 2 then 10 | Discriminated props: `{route:'services'|'projects';locale;capabilityWords:CapabilityWords}` or `{route:'studio'|'founder'|'contact';locale;wordBindings:readonly ConnectedWordBinding[]}`. Existing calls stay source-compatible. New routes initially get static CSS/unpublished poster only; 10 mounts the live host after profiles/engine exist. |
| `profiles.ts` / 3 | `getConnectedProfile(route:ConnectedRoute,tier:ConnectedTier,viewport:{width:number;height:number}):ConnectedSceneProfile`. Profile contains route/tier/graph, `ambient:'legacy'|'sleep'`, `nodeStyle:'legacy'|'atlas'`, `input:'yield'|'edges'`, `posterPose:{progress:number;idleAngleRadians:number}`. Existing `getConnectedGraph(quality)` remains the legacy topology source. |
| `interaction.ts` / 3 | `createConnectedInteraction(profile:ConnectedSceneProfile):ConnectedInteraction`; `step({nowMs,deltaMs,base:ScenePose,viewport:{width:number;height:number},pointer,scrollDeltaPx}):ScenePose`; `clear():void`; `isSettled():boolean`. Pointer is null or `{xPx,yPx,vxPxPerSecond,vyPxPerSecond,ageSeconds}`; scrollDelta is already classified ordinary user scroll. ScenePose adds `edgeSamples?:readonly {id:string;points:readonly [Vec3,Vec3,Vec3,Vec3,Vec3,Vec3,Vec3]}[]`, plus `nodeExcitation?:Readonly<Record<string,number>>` and `edgeExcitation?:Readonly<Record<string,number>>` (0–1). Points use scene units; CSS-pixel caps are applied through pure projection/inverse projection. Absence means legacy straight path. |
| Controller / 3 | Existing `createConnectedController(options)`/update/pause/resume/snapshot/dispose remain. `ControllerOptions` accepts profile and interaction; update accepts optional pointer, scroll delta and `inputEnabled`. Optional legacy defaults preserve old tests/callers. Controller owns clock/cadence/sleep; host never runs a second physics loop. |
| Runtime / 7 | Existing `createConnectedScene` and SceneHandle remain; options add `profile?:ConnectedSceneProfile`, and the unused legacy `words:CapabilityWords` option becomes optional for source compatibility. New profiles do not invent an eight-word tuple; labels live in the host. The existing optional entry also reexports `getConnectedProfile`, `createConnectedInteraction` and `createConnectedController` from their pure owners; 10 obtains these factories only after capability gates. New physics/profile bodies must be in this measured optional closure, not hidden in critical page code. Geometry consumes final pose nodes/edge samples/profile style with finite straight fallback. Rendering/projection share coordinates; no DOM/events in geometry. |
| Inquiry / 4 | `SubmitInquiry(payload:InquiryPayload,context?:InquirySubmissionContext):Promise<InquirySubmissionResult>`; context `{honeypot?:string;signal?:AbortSignal}`. Public payload shape unchanged. `createInquirySubmissionController({submit:SubmitInquiry,dispatch:(action:InquiryAction)=>void})` returns `submit(values:InquiryValues,locale:'es-AR'|'en',honeypot:string):Promise<void>` and `dispose():void`; export InquiryAction. `VALIDATION_FAILED` accepts optional requestId for source compatibility: local failures without ID apply only outside submitting; provider failures require matching current ID. Controller owns synchronous lock/sequence/cancellation, reducer stays pure. |
| Configuration / 4 then 13 | `lib/inquiry/release.ts`: `INQUIRY_RELEASE:{mode:'demonstration'|'commercial';releaseId:string}` initially demonstration; `getInquiryConfiguration(release,endpoint)` returns mode + validated endpoint or throws on invalid commercial build. Exact endpoint validated by `configuration.ts`; `createConfiguredSubmitInquiry(config)` selects adapter, unavailable on runtime misconfiguration. Endpoint is public, never an API secret. |
| Contact/host / 9 and 10 | Contact form DOM root exposes `data-inquiry-phase` with reducer phase and `data-contact-hydrated`; server initial phase idle. Host uses delegated focusin/focusout on `form[data-inquiry-phase]` plus phase observation; no custom event bus, inquiry values or React dependency shared with graph. Host waits for next eligible background input after focusout. |
| Legal / 8 then 11/13 | `components/legal/content-types.ts`: `LegalPageContent` with locale, routeId `privacy|terms`, heading, introduction, `update?:{label:string;date:string}`, contents label, sections `{id,heading,paragraphs,links?}[]`, responsible-party/contact and reciprocal legal-link labels. `LegalPage({content,locale,reciprocalHref?:string})` renders all content server-side. Legacy demo may omit date/reciprocal link rather than invent one or link to an absent Terms route; final commercial data must include reviewed metadata and both destinations. Existing Privacy wrapper supports the current demo contract until 13 replaces its data. |

New files have one purpose: `profiles.ts` data/projection policy, `interaction.ts` pure integration, `connected-paths.ts` pooled curve rendering, `connected-input.ts` cached DOM/input lifecycle, `configuration.ts` inquiry validation/factory, `submission-controller.ts` cancellation/identity, and `LegalPage.tsx` reading template. Do not copy the standalone prototype into product code or split Home into this runtime.

### Test partition and candidate procedure

Task 2 moves the existing mixed `studio-founder.spec.ts` and `studio-founder-responsive.spec.ts` assertions, without losing coverage, into `studio.spec.ts`/`founder.spec.ts` and `studio-responsive.spec.ts`/`founder-responsive.spec.ts`. Move Founder-only Node assertions from `foundation-content.test.mjs` into `founder-content.test.mjs`. General route/Footer assertions stay general. Register `studio`, `founder`, `contact-commercial` and `legal` in all three desktop engines; their relevant responsive cases in mobile Chromium/WebKit, tablet, wide, compact-320 and tablet-portrait projects. `sfc-runtime` runs in `immersive-chromium`, `sfc-accessibility` in `accessibility-chromium`; existing connected responsive/navigation cases remain registered. Register future patterns now, not from concurrent page tasks. Preserve existing projects and add `sfc-production-chromium`, `sfc-production-firefox`, `sfc-production-webkit` for `sfc-production.spec.ts` when `PLAYWRIGHT_SERVE_EXPORT=1`. Unit harness tests assert discovery; `--list` and actual selected counts are evidence. Empty future families are not behavior passes; each becomes mandatory/nonzero when its owning task supplies tests.

Before commercial activation, browser tests use an **isolated local candidate worktree**, sequentially owned by the current task, at its reviewed head. Apply a tiny uncommitted `release.ts` patch to commercial with release ID `QA-CANDIDATE-NOT-FOR-DEPLOYMENT`, supply the exact endpoint, and intercept **every** Formspree request before navigation. Save base/head, full patch and build hash with results; restore/remove the candidate after collection. No new public route, query/storage flag, production test submitter or environment-only mode override is introduced. `SFC_TEST_MODE` may select test expectations only; it must not affect application behavior. Task 13 rejects the candidate release ID in deployable builds. For a graph hardware candidate, patch only live policy flags in a similarly isolated worktree, record the patch, use real hardware without the software/test hook, and never deploy that output. Reverify final release deltas in 13/15.

## Task 1 / PR 1 – Accept bounded governance and start external readiness

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High. **Dependencies:** independent Opus plan findings resolved and owner execution authorization. **Concurrency wave:** W0.
- **Owned write paths:** `docs/rfcs/studio-founder-contact-commercial-atlas-v1.md`, `docs/rfcs/index.md`, approved-target annotations in `docs/design/visual-language.md`, `docs/design/interaction-responsive-accessibility.md`, `docs/product/pages/{studio-and-founder,contact-and-privacy,terms-and-conditions,home,services}.md`, `docs/product/{information-architecture,content-and-localization}.md`, `docs/governance/status-register.md`, `docs/reviews/studio-founder-contact-acceptance-v1/index.md`, `task-01.md`.
- **Forbidden/shared paths:** all application/tests/config and immutable ADR bodies; master plan authored only by planning authority. **Exclusive locks:** `SFC-GOVERNANCE`; no deployment/account mutation.
- **RED:** N/A for documentation-only acceptance. Run `npm run docs:check` on base; preserve historical IDs and testable demo restrictions until named replacement checkpoints. Do not manufacture a failing product test for prose.
- [ ] Record RFC acceptance through a Governance PR, with Q14/Q15 scope, explicit effective-at-activation portions, unchanged history and live-policy gates. Mark the exact owning target sections approved; distinguish professional legal review from owner design approval.
- [ ] Open the acceptance ledger with all external evidence OPEN; give Samuel the existing Formspree checklist and professional-review brief in Task 11 immediately. External work proceeds while code tasks run; no paid upgrade/new form or infrastructure is implied.
- [ ] Run docs validation/diff review; commit the bounded documentation, obtain reviewer R and human merge. Record accepted main SHA before Task 2.
- **Acceptance/verification:** correct RFC/requirement statuses and bounded supersession map, no current implementation fiction, owner/counsel actions assigned; `npm run docs:check`, `git diff --check`, independent review. **Reviewer:** R + Samuel for scope; no agent legal opinion.

## Task 2 / PR 2 – Freeze shared contracts, static ground and test isolation

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 1. **Concurrency wave:** W1.
- **Owned write paths:** `lib/connected-studio/{types,media-manifest}.ts`, `components/connected-studio/ConnectedStudioGround.tsx`, compatibility-only optional-index handling in `components/connected-studio/{ConnectedStudioEnhancement.tsx,runtime/connected-labels.ts}`, `playwright.config.ts`, `tests/e2e/support/{paths,connected-studio-test-hooks}.ts`, `tests/e2e/{studio-founder,studio-founder-responsive,studio,studio-responsive,founder,founder-responsive}.spec.ts`, `scripts/{foundation-content,founder-content,connected-studio-media,connected-studio-harness}.test.mjs`, new `scripts/sfc-contracts.test.mjs`, `docs/testing/playwright.md`, new `docs/decisions/studio-founder-contact-commercial-atlas.md`, `docs/decisions/index.md`, `task-02.md`.
- **Forbidden/shared paths:** no physics, renderer behavior, inquiry implementation, page layout, published poster or live-policy change. Later host writer 10 is inactive. **Exclusive locks:** `SFC-CONTRACTS`, `SFC-PLAYWRIGHT-CONFIG`; browser lock during discovery checks.
- **RED:** add a Ground render/manifest test expecting a new Studio route to remain static without an image request while its two posters are unpublished; base fails on missing new-route entries/support. Add a harness regression requiring both independent page files across Chromium/Firefox/WebKit and production family discovery; current config fails that assertion. Retain existing Services/Projects Ground output.
- [ ] Run the specific failing tests and verify assertions, then add frozen type declarations/compatibility behavior only; six unpublished poster entries, no broken asset URLs. Declare profile/interaction types for subsequent tasks without implementing them.
- [ ] Move mixed tests without dropping assertions; prove pre/post test-case inventory, update project patterns and add a passing harness/discovery case for each new family. New empty families are not counted as behavior passes until their owner supplies tests.
- [ ] Record the accepted RFC in the new ADR (`ADR-SFC-COMMERCIAL-ATLAS-V1`), explicitly naming partial supersessions and gated effective dates. Preserve old ADR rationales; index links point forward.
- [ ] GREEN/refactor, run `node --test scripts/sfc-contracts.test.mjs scripts/connected-studio-media.test.mjs scripts/connected-studio-harness.test.mjs scripts/foundation-content.test.mjs scripts/founder-content.test.mjs`, relevant moved Playwright specs, `npm run validate`; commit, independent review/human merge.
- **Acceptance/verification:** connected type declarations and Ground adapters match the W1 table; later-owned interfaces remain explicitly frozen specifications, not pretend implementations. Legacy route behavior unchanged; new Ground safe/static; no test loss; no optional runtime for new pages yet; nonzero discovery per registered implemented family. **Reviewer:** R, focusing on API compatibility, genuine test partition and ADR scope.

## Task 3 / PR 3 – Implement route profiles and deterministic yielding/string physics

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 2. **Concurrency wave:** W2.
- **Owned write paths:** new `lib/connected-studio/{profiles,interaction}.ts`, `lib/connected-studio/{model,controller,frame-scheduler}.ts`, `scripts/{connected-studio-model,connected-studio-controller,connected-studio-frame-scheduler}.test.mjs`, new `scripts/{connected-studio-profiles,connected-studio-interaction}.test.mjs`, `task-03.md`.
- **Forbidden/shared paths:** frozen types, host/engine, pages, inquiry, policy/assets and Playwright configuration. **Exclusive locks:** `SFC-PURE-MODEL`; none shared with 4/5.
- **RED:** use existing injected clock/scheduler and add tests before each behavior. Assert exact profile edge/anchor counts and projected rest/depth; nearest-five radius influence, 34/24/14px travel caps, Contact zero offsets; pinned seven-sample strings and 16/10/6/4px flex; 60/120Hz path difference ≤1.5px. A moving then stationary/absent pointer must retain velocity and decay; current passive model cannot pass these assertions.
- **Pinned test cases:** `"equivalent 60/120Hz travel preserves yielding"` asserts `assert.ok(maxCheckpointDifferencePx <= 1.5)`; `"Contact holds every node while strings bend"` asserts every projected node offset equals zero and `maxInteriorFlexPx <= 4`; `"settled Atlas sleeps but legacy remains ambient"` asserts `snapshot.pendingCallbacks === 0` for Studio and `snapshot.targetFps === 30` for wide Services. Fixtures exercise actual clock/poses, not source text.
- [ ] Capture correct REDs; implement profiles from the spec tables (legacy topology untouched) and pure input integration in separate small increments. New profiles use their fixed projected rest positions and fully visible rest edges, without inheriting legacy chapter-driven node translation; the finite matched-poster handoff is separate. Services/Projects keep their existing chapter pose/growth. Use spec's pressure/impulse/tension/decay, ≤1/120s substeps and ≤50ms gap integration; clamp non-finite input and rendered curve, not just sample points.
- [ ] Add REDs for pointer exit/interruption, direct edge proximity, bounds, co-located endpoints, resize, first input without invented velocity, navigation scroll jumps and hidden-time discard. Touch scroll uses ±120 delta, 0.18 gain and 0.38 compact strength; no tap channel.
- [ ] Add REDs for new-profile rest with zero callbacks, legacy 30/20fps ambient, active ≤60fps, strings keeping the controller awake, clear/Pause/suspension/disposal and generation-safe stale callbacks. Minimal GREEN then refactor using frozen public seams; no DOM/Three imports or frame React state.
- [ ] Run `node --test scripts/connected-studio-profiles.test.mjs scripts/connected-studio-interaction.test.mjs scripts/connected-studio-model.test.mjs scripts/connected-studio-controller.test.mjs scripts/connected-studio-frame-scheduler.test.mjs`, then `npm run validate`; commit and review.
- **Acceptance/verification:** deterministic, finite, event-rate-independent caps and inertia, explicit ambient/sleep distinction, all prior pure-model contracts retained. Numerical tests compare tolerances/observable scheduling, not exact integration implementation. **Reviewer:** R, focusing on units, stability, elapsed-time normalization and sleep.

## Task 4 / PR 4 – Harden inquiry configuration, transport and request coordination

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High. **Dependencies:** 2. **Concurrency wave:** W2.
- **Owned write paths:** `lib/inquiry/{contracts,validation,formspree,demo}.ts`, new `lib/inquiry/{configuration,release,submission-controller}.ts`, `components/contact/state.ts`, `scripts/{inquiry-validation,formspree-adapter,demo-inquiry-adapter,contact-state}.test.mjs`, new `scripts/{inquiry-configuration,inquiry-submission-controller}.test.mjs`, `task-04.md`.
- **Forbidden/shared paths:** Contact markup/content, host/model/pages, workflow and public mode activation. `release.ts` stays demonstration. **Exclusive locks:** `SFC-INQUIRY-PORT`; no live endpoint calls.
- **RED:** configuration rejects missing/wrong form/host, credentials/query/fragment/nonstandard port for commercial while demo needs no endpoint. Assert an actual nonempty trap maps to `_gotcha`, cancellation reaches fetch, timer bounds include response-body parsing, and only 2xx JSON `ok:true` accepts. Retain ordinary demo zero transmission and reserved failure behavior.
- **Pinned test cases:** `"same-tick valid submissions call the port once"` asserts `calls.length === 1` before resolving the deferred port; `"actual trap reaches the adapter"` asserts `JSON.parse(recordedInit.body)._gotcha === 'flagged'`; `"late provider errors cannot replace a newer request"` deep-compares the newer reducer state before/after the stale action; `"malformed accepted response preserves failure"` expects `{status:'failed',reason:'unknown'}` for 204/no JSON or 200/`ok:false`.
- [ ] Verify each RED against current adapter, then minimally implement context + exact endpoint validation and injectable factory. Count the full serialized transport, including trap, within 24KiB; reject excessive transport safely without a request. Keep code-point validation authoritative and map documented required/type/max-length codes only.
- [ ] Use a deferred mocked submitter to RED two same-tick submissions: call count exactly one; all old success/field-error/failure results after disposal/new request ignored; abort signal set on disposal. Export action type and request-ID field failures, then implement coordinator lock/sequence and safe reducer updates. Do not treat React render state as the lock.
- [ ] RED accepted-only reset responsibility, edit-after-success clearing, failures preserving payload snapshot, unknown provider text never displayed, 429/config/5xx/network/timeout/malformed bodies, a rejected submitter promise releasing the lock safely, and explicit retry. Keep abort semantics honest: ignore result, do not claim server nonreceipt. No browser persistence/logging/automatic resend.
- [ ] GREEN/refactor; run the inquiry/state test files, `npm run validate`, inspect accidental network activity/secrets, commit/review. Use mocks for every provider test.
- **Acceptance/verification:** frozen signatures work with existing demo caller; zero public activation, synchronous protection, complete classified errors, Unicode/byte/timeout boundaries and safe teardown. **Reviewer:** R, focusing on stale field errors, false acceptance, configuration and transport privacy.

## Task 5 / PR 5 – Redesign bilingual Studio as the accountability Atlas

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High. **Dependencies:** 2. **Concurrency wave:** W2.
- **Owned write paths:** `components/studio/{StudioPage,StudioIntroduction,StudioAccountability,StudioPrinciples,StudioFounderBridge,StudioFinalCta}.tsx`, `components/studio/content-types.ts`, new `components/studio/studio.module.css`, `app/(es)/{estudio/page.tsx,_content/studio.ts}`, `app/(en)/en/{about/page.tsx,_content/studio.ts}`, `scripts/studio-content.test.mjs`, `tests/e2e/{studio,studio-responsive}.spec.ts`, `tests/e2e/visual/studio.visual.spec.ts` and its own snapshot directory, `task-05.md`.
- **Forbidden/shared paths:** Founder, shared materials/App Bar/Footer, graph model/host and mixed tests already partitioned by 2. **Exclusive locks:** `SFC-STUDIO`; browser/capture lock when used.
- **RED:** semantic browser test expects the approved sequence, complete accountability/collaborators/principles/location, one Founder bridge and localized Contact actions; current source order/copy fails. Content tests pin selected strings and decorative word bindings `n0,n4,n8,n12`, not CSS classes.
- [ ] Verify behavioral/content REDs, then implement complete owner-selected copy and semantic order. Mount the W1 static Ground, reserve Pause area, apply scoped opaque plates/grid/rhythm from spec. Eliminate obsolete duplicate checklist presentation; do not shorten content or turn Studio into a résumé.
- [ ] Render both languages at all five widths and 200% zoom. Use visual QA/Taste preflight/postflight and Impeccable adapt/clarify inline; compare to approved full-copy references. Verify no-JS navigation/content and focus/contrast, natural wraps and no overflow.
- [ ] Run Node content tests, `npm run test:e2e -- studio.spec.ts studio-responsive.spec.ts` across registered projects, targeted visual test and `npm run validate`. Present actual/diff images for intentional baseline approval; preserve platform provenance. Commit/review.
- **Acceptance/verification:** exact Studio role/hierarchy, complete copy, responsive typography and opaque reading surfaces; safe CSS ground without missing poster requests, no runtime requirement for reading. Pure styling is assessed from renderings, not fabricated CSS RED tests. **Reviewer:** R + owner visual approval of intentional baselines.

## Task 6 / PR 6 – Redesign the complete text-led Founder experience

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High. **Dependencies:** 2. **Concurrency wave:** W3.
- **Owned write paths:** `components/founder/{FounderPage,FounderHeader,FounderProfessionalLinks,FounderProfessionalHistory,FounderCapabilities,FounderProjectsBridge,FounderFinalCta}.tsx`, `components/founder/content-types.ts`, new `components/founder/founder.module.css`, `app/(es)/{estudio/samuel-furlanich/page.tsx,_content/founder.ts}`, `app/(en)/en/{about/samuel-furlanich/page.tsx,_content/founder.ts}`, `scripts/founder-content.test.mjs`, `tests/e2e/{founder,founder-responsive}.spec.ts`, `tests/e2e/visual/founder.visual.spec.ts` and its snapshot directory, `task-06.md`.
- **Forbidden/shared paths:** Studio, CV binary/content rewrite, shared navigation/materials and graph model/host. **Exclusive locks:** `SFC-FOUNDER`; browser/capture lock.
- **RED:** semantic sequence puts all three biography paragraphs before professional links, then both jobs/education/capabilities/evidence. Assert the 2021 internship, narrative-only employer, complete MPC caveats/source, four capability groups and exact existing professional/CV URLs. Current order fails the new sequence; do not delete factual tests to pass.
- [ ] Capture RED and implement the two continuous, at-most-800px reading plates, right alignment below the intro at wide sizes and single alignment below 1024px. Preserve complete facts, role descriptor, employer-specific title and qualifications; no portrait, biography clamp or fabricated career timeline.
- [ ] Supply new-profile decorative words `.NET`, `React`, `Next.js`, `Blazor` by node ID; mount W1 Ground and reserved Pause region. Check full content at 320/390/768/1024/1440 and zoom, including professional-link wrapping and keyboard focus.
- [ ] Verify actual CV download from root and `/Portfolio`: HTTP success, PDF content type/signature and expected filename; approved external destinations stay unchanged even behind sign-in. Run Founder Node/browser specs on all three engines and responsive projects, visual QA/Taste/Impeccable, `npm run validate`; commit/review baselines.
- **Acceptance/verification:** professional depth and commercial bridge remain distinct from Studio; all approved evidence/links preserved and readable without JavaScript. **Reviewer:** R + owner rendered/baseline approval.

## Task 7 / PR 7 – Render pinned flexible paths in pooled Three.js batches

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 3. **Concurrency wave:** W3.
- **Owned write paths:** `components/connected-studio/runtime/{create-connected-scene,connected-geometry,connected-labels,connected-projection,dispose-connected-scene}.ts`, new `components/connected-studio/runtime/connected-paths.ts`, `scripts/connected-studio-engine.test.mjs`, new `scripts/connected-studio-paths.test.mjs`, `tests/e2e/sfc-runtime.spec.ts` engine cases only, `task-07.md`.
- **Forbidden/shared paths:** profiles/controller/types, host/input/session, pages, assets/policy and Playwright config. **Exclusive locks:** `SFC-ENGINE`; browser/GPU lock for rendered evidence.
- **RED:** injectable renderer/geometry probes expect the pinned endpoints and five interior samples to drive final path vertices, bounded cubic interpolation, growth and tracer position. Assert a bent edge's tracer lies on its deformed path, nearly coincident endpoints remain finite and absent samples retain the legacy straight path. Existing rigid path update fails these assertions.
- [ ] Run correct REDs, then update preallocated indexed/batched buffers with ≤12 segments per edge. Reexport the W1 pure profile/interaction/controller factories through the existing optional runtime entry, with no second engine import. Retain Services/Projects path thickness/growth/tracers and old node proportions; implement new small camera-facing dots/rings/beads and Contact opacity from profile. Keep FOV/camera fixed and rest projection inverse-correct.
- [ ] Add allocation/disposal REDs: repeated render keeps resource counts/drawables stable, graph/tier resize replaces only necessary buffers, repeated dispose is safe, projected labels use the final moving nodes, and cap applies between samples as well as at them. GREEN/refactor; no per-frame material/mesh/curve or per-edge draw growth.
- [ ] Exercise all five route profiles through controlled SwiftShader tests, labeled functional evidence only. Capture stationary/active/inertial curve states at wide/compact and compare A.2 intent; run engine/path tests, targeted immersive Playwright, `npm run validate`. Commit with no hardware-performance claim.
- **Acceptance/verification:** strings remain attached, smooth and visibly inertial, no straight-chord tracer regression; batched representation fits ≤28/18 draw calls in controlled diagnostics and fully disposes. Hardware frame proof belongs to 12. **Reviewer:** R, focusing on projection consistency, allocations, curve/growth fidelity and disposal.

## Task 8 / PR 8 – Build the quiet legal template and private bilingual drafts

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High. **Dependencies:** 2. **Concurrency wave:** W3.
- **Owned write paths:** new `components/legal/{LegalPage.tsx,content-types.ts,legal.module.css}`, `components/privacy/{PrivacyPage.tsx,content-types.ts}`, new `app/(es)/_content/commercial/{privacy,terms}.ts`, `app/(en)/en/_content/commercial/{privacy,terms}.ts`, new `scripts/legal-content.test.mjs`, existing `scripts/{privacy-content,privacy-route}.test.mjs`, `tests/e2e/privacy.spec.ts`, new `tests/e2e/legal.spec.ts` current-Privacy/template cases, new `tests/e2e/visual/legal.visual.spec.ts` and its snapshot directory, `task-08.md`.
- **Forbidden/shared paths:** no new public Terms routes, route registry/Footer edits, mode switch or replacing current demo disclosures. `components/foundation/content-types.ts` remains untouched; adapt the existing Privacy data at its wrapper. **Exclusive locks:** `SFC-LEGAL-TEMPLATE`; browser/capture lock.
- **RED:** current Privacy browser test requires complete visible contents navigation, unique section anchors, App-Bar-aware focus/scroll and reciprocal link support. A template/data test requires both original candidate languages and the intended section inventory while demonstrating draft data has no public route/import. Current template lacks that behavior.
- [ ] Verify RED, implement server-only LegalPage and Privacy compatibility wrapper using the existing honest demo content. Render all sections without JS, ordinary contents anchors, Bone reading measure and single/two-column contents from spec; no canvas/accordion/sticky tab.
- [ ] Transcribe the original source drafts into **unrouted** commercial modules with explicit nonpublishable source metadata. Do not invent missing legal facts/date or strip the review gates. Existing public Privacy remains truthful demonstration wording. The commercial fields stay private until 11 finalizes and 13 imports them into public routes.
- [ ] GREEN/refactor; run legal/privacy Node tests, Privacy/template Playwright in three engines and responsive/no-JS/keyboard cases, axe, visual QA/Impeccable clarify and `npm run validate`. Record which legal visuals await final reviewed wording; commit/review.
- **Acceptance/verification:** quiet complete reading template, exact draft ownership, no exposure of draft data or processor claims on current routes. Professional sufficiency is not an agent acceptance criterion. **Reviewer:** R; final text deferred to Samuel/counsel in 11.

## Task 9 / PR 9 – Integrate the accessible Contact form and quiet intake layout

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High. **Dependencies:** 4, 8. **Concurrency wave:** W4.
- **Owned write paths:** `components/contact/{ContactPage,ContactForm}.tsx`, `components/contact/content-types.ts`, new `components/contact/contact.module.css`, `app/(es)/{contacto/page.tsx,_content/contact.ts}`, `app/(en)/en/{contact/page.tsx,_content/contact.ts}`, new `app/(es)/_content/commercial/contact.ts`, `app/(en)/en/_content/commercial/contact.ts`, `scripts/{contact-content,contact-route}.test.mjs` (only page/client boundary assertions; deployment assertion remains until 13), `tests/e2e/contact.spec.ts`, new `tests/e2e/contact-commercial.spec.ts`, new `tests/e2e/visual/contact.visual.spec.ts` and its snapshot directory, `task-09.md`.
- **Forbidden/shared paths:** `state.ts`/inquiry ports are frozen from 4, legal/template data, graph host/input and deployment workflow. No mode activation. **Exclusive locks:** `SFC-CONTACT-UI`; candidate worktree and browser/capture lock.
- **RED:** mocked browser tests pin two same-tick clicks/Enter to one request, actual trap in transport, first-invalid focus, accepted-only reset/status focus and failure-preserved values. Existing form lacks commercial behavior, cancellation and a real trap. A supplementary-character boundary test fails its current native maxlength clipping. Test no-JS/unhydrated submit disabled with direct alternatives and no transmission.
- [ ] Run correct REDs and consume the configured submitter/coordinator, retaining the existing demo path. Use 2× code-point native maxlength if retaining native bounds; validator remains exact. Hide trap from tab/a11y/autofill and pass its actual value separately. No action to an external endpoint in unhydrated markup; enable submit only after hydration.
- [ ] Add the frozen `data-inquiry-phase` signal and hydration marker. Implement persistent status containers with restrained announcements, associated field errors, disabled busy fieldset, localized reason-specific error/uncertainty/retry text, edit-after-success reset and abort cleanup. No automatic retry/focus decorations or receipt-as-delivery claim.
- [ ] Implement the approved hierarchy, single-column fields, 7/4 Bone intake grid and stacking rule, expectation before form, privacy/quiet Terms link in commercial mode, subdued alternatives and Founder bridge. Contact routes select mode-matched data from the committed release configuration, whose public default remains demo with honest notices and no link to an absent Terms route. Private commercial copy has every owned state. The QA candidate can test commercial Contact while legal routing is staged; it is not a complete public release. Reserved graph/Pause region uses W1 static Ground, not a second runtime.
- [ ] In the isolated candidate, intercept all provider calls and test success/field/429/config/5xx/network/timeout/malformed/stale/unmount in ES/EN. Inspect request body/source/locale and no storage/URL/log leakage; Terms destination existence is tested after route addition in 13. Run demo tests separately, commercial browser matrix, responsive/keyboard/no-JS/axe, visual QA/Taste/Impeccable harden, targeted Node tests and `npm run validate`; restore candidate and commit/review.
- **Acceptance/verification:** complete real-flow behavior is tested but not activated; demo remains locally testable and deployed truthfully. Form input/focus remains native and fixed. **Reviewer:** R + owner visual/state wording review; never use the real endpoint in this packet.

## Task 10 / PR 10 – Integrate cached input, preferences and five-page host lifecycle

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 3, 5, 6, 7. **Concurrency wave:** W4.
- **Owned write paths:** `components/connected-studio/{ConnectedStudioEnhancement,ConnectedStudioGround,ConnectedPauseControl}.tsx`, `components/connected-studio/connected-studio.module.css`, new `components/connected-studio/connected-input.ts`, `lib/connected-studio/{labels,session}.ts`, `scripts/{connected-studio-host,connected-studio-labels,connected-studio-session}.test.mjs`, `tests/e2e/{connected-studio-runtime,connected-studio-navigation,connected-studio-responsive,sfc-runtime}.spec.ts`, new `tests/e2e/sfc-accessibility.spec.ts`, `task-10.md`.
- **Forbidden/shared paths:** Contact markup/state/copy, engine/model/types, policy/assets, Home runtime and shared App Bar/Footer. Use the W1 form-signal fixture for parallel work; actual Contact integration follows both W4 merges. **Exclusive locks:** `SFC-HOST`; browser/GPU lock.
- **RED:** tests expect eligible pointer proximity to drive the controller through cached coordinates, exit/control-entry to clear new excitation, and input during form focus/submitting to produce zero frames/stimuli until next background input after focusout. Fixture uses the exact W1 DOM signal. Assert touch scroll only, no tap/drag, anchor/restore/resize jumps not replayed.
- [ ] Verify REDs and integrate profile/word-ID bindings with the single engine/controller. Batch passive input and cached viewport/occluders after resize/fonts/content/locale; reuse cache while scrolling. Mask unplated text by 24px, Contact intro 32px; opaque form blocks scene. No per-node elementFromPoint, layout reads per input, per-frame React state or extra rAF loop.
- [ ] RED reduced-motion/Save-Data/session-loss/denied/software paths before optional import; runtime preference change disposes. Obtain profile/physics/controller factories from the already gated optional entry, removing the old host's static controller import and avoiding new static profile/physics imports. Measure the resulting full closure and critical-host delta in 12. Extend session/Pause across all five routes/locales without new keys or writing Home's flag. Focused fallback Pause remains in DOM, correctly labeled/aria-disabled; reserved area prevents CLS.
- [ ] RED hidden/offscreen/Footer/pause/dispose zero callbacks, one renderer through Home and five-route/locale cycles, no late imports reviving disposed scenes, no leaked listeners/resources/labels and no hidden-time replay. Preserve poster first-draw matching/three-second settle/160ms successful-draw handoff. GREEN/refactor with pooled buffers/clear inputs.
- [ ] Run host/session/label tests, controlled runtime/navigation/responsive/accessibility Playwright, legacy Services/Projects regressions and `npm run validate`. Supply Emil/review-animations assessment inline, owner motion review against A.2 and reduced-motion evidence. Commit/review with both live flags still false.
- **Acceptance/verification:** wider, responsive, inertial strings across all five meanings; safe native reading/form behavior, one host/renderer, static preference paths and correct sleep. Fixture success alone is insufficient: checkpoint W4 reruns actual Contact focus/submission after 9 merges. **Reviewer:** R, focusing on imports, lifecycle races, masks, focus and input/scheduler ownership.

## Task 11 / PR 11 – Close owner, processor and Argentine legal readiness

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High, compiling verified facts only. **Dependencies:** 8, 9, 10 and external evidence initiated in 1. **Concurrency wave:** W5. Samuel owns authenticated account actions and live probes; professional Argentine counsel owns legal judgment. No agent session remains active waiting for them.
- **Owned write paths:** `docs/product/pages/{contact-and-privacy,terms-and-conditions}.md` final legal/operations sections, `app/(es)/_content/commercial/{contact,privacy,terms}.ts`, `app/(en)/en/_content/commercial/{contact,privacy,terms}.ts`, `scripts/legal-content.test.mjs`, new `docs/reviews/studio-founder-contact-acceptance-v1/{processor-readiness,legal-review}.md` and `readiness.json`, `task-11.md`.
- **Forbidden/shared paths:** no production mode, route/component/workflow edits; no account credentials in repo; no agent-issued legal certification. **Exclusive locks:** `SFC-LEGAL-COPY`, Samuel's `SFC-FORMSPREE-LIVE` for labeled probes only.
- **RED:** documentation/evidence collection itself is N/A. For factual public copy changes, add content-contract failures first against the received, approved corrections; ensure all draft markers/missing operational facts prevent publish readiness. Do not invent expected facts to turn the gate green.
- [ ] Samuel signs in to the existing form `/f/meaqwnbr`, confirms control/active form and verified Gmail recipient. Workflow: one email notification to `samuelfurlanich@gmail.com`, submitter email as Reply-To, no unapproved integrations/autoresponders/marketing. Record date and redacted facts, not private account screenshots.
- [ ] Samuel sets Project Settings → Restrict to Domain to `furlanich.github.io` (no scheme/path); records compatible browser referrer behavior. Workflow → Validation: required name text ≤100, required email ≤254, optional company text ≤120, required message ≤4000; preserve locale/source. If Free lacks a required control or counts Unicode differently, record the actual limitation and return the specific policy issue; no silent downgrade/new paid plan.
- [ ] Samuel records Spam/reCAPTCHA posture; baseline is provider filtering + real `_gotcha` + domain filter without challenge script/redirect. Confirm current configuration supports that flow. A required challenge/processor change reopens design/accessibility/privacy before proceeding. Verify Inbox/Spam/Over Limit, remaining account-wide quota/reset and deletion controls. Do not exhaust the real Free quota in tests.
- [ ] Samuel and counsel verify actual material providers/subprocessors/processing countries, Argentine transfer treatment, responsible-party/address sufficiency, notice/consent requirements, rights/authority wording, retention operations/exceptions and Terms scope. Validate the 30-day provider/12-month nonconverted mailbox targets against real controls; no history-window-as-erasure claim. Resolve all marked legal paragraphs in both languages, with factual translation review and an actually approved update/effective date. Preserve original draft/history and counsel's approval reference; sensitive advice may be held privately with a dated redacted disposition in Git.
- [ ] After legal/account gates pass, prepare Samuel's bounded **predeployment provider probe** instructions in `processor-readiness.md`: open the existing `https://furlanich.github.io/Portfolio/contacto/` page, use that browser's developer console to run one reviewed manual `fetch` JSON POST to the exact form endpoint with Accept/Content-Type application/json, four labeled synthetic values, `locale:'es-AR'`, `source:'/contacto/'` and `_gotcha:''`. The probe runs from the actual approved browser origin, not a forged Node referrer or the demo submit button. The Reply-To test address is entered privately by Samuel; no inquiry body/credentials are committed. Confirm accepted response, dashboard/Gmail/Reply-To, Unicode/multiline and deletion in active copies. Additional flagged/length probes are bounded and individually owner-authorized; use provider configuration/support for quota behavior rather than exhausting allowance. This is not the newly deployed form receipt; actual ES/EN checks occur in 14 under Q15.
- [ ] Apply counsel/owner corrections to private code/copy with RED→GREEN tests. Create `readiness.json` with schemaVersion 1, real releaseId, owner approval date, dated legal/account/provider-probe receipt paths and SHA-256 hashes of the six final commercial content modules. This is an owner-attested release manifest, not cryptographic proof of legal compliance. No true status without the corresponding verified receipt. Run `node --test scripts/legal-content.test.mjs`, `npm run docs:check`, `npm run validate`; obtain R plus Samuel/counsel sign-offs and human merge.
- **Acceptance/verification:** no unresolved publication-critical legal/account/retention/challenge/validation fact; complete redacted predeployment receipts and final original ES/EN text. Business-day quota/Inbox/Spam/Over Limit monitoring, first-75%-notice response and retention/deletion owner/runbook confirmed by Samuel. No automation/paid purchase created. **Reviewer:** R for faithful data/code translation; Samuel and counsel for facts/legal wording. Missing human evidence blocks this task and release, not a reason for AI guesses.

## Task 12 / PR 12 – Capture matched posters and prove runtime feasibility on hardware

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 3, 5, 6, 7, 9, 10, 11. **Concurrency wave:** W6, all other task sessions idle during measurements.
- **Owned write paths:** `scripts/{capture-connected-studio-posters,measure-connected-studio-production,measure-connected-studio-vitals,measure-connected-studio-hardware}.mjs`, `lib/connected-studio/{media-manifest,measurement}.ts`, `scripts/{connected-studio-media,connected-studio-measurement}.test.mjs`, `tests/e2e/{connected-studio-production,sfc-production,connected-studio-static}.spec.ts`, `tests/e2e/visual/{connected-studio-static,sfc-static}.visual.spec.ts` and those snapshot directories, six new assets `public/brand/connected-studio/{studio,founder,contact}-{wide,compact}.webp`, new `docs/reviews/studio-founder-contact-acceptance-v1/hardware-protocol.md`, `task-12.md`. **Conditional diagnostic write transfer:** `lib/connected-studio/{controller,frame-scheduler}.ts`, `components/connected-studio/{ConnectedStudioEnhancement.tsx,connected-input.ts,runtime/connected-geometry.ts,runtime/connected-paths.ts,runtime/create-connected-scene.ts}` and their already named owner tests, only after prior owners exit and the receipt names the measured defect/targeted RED.
- **Forbidden/shared paths:** no live-policy enablement, new fidelity/budget/geometry-density decision, broad Home refactor, legal/form changes or dependency additions. **Exclusive locks:** `SFC-BROWSER-GPU`, `SFC-MEASUREMENT`, asset publication; candidate worktree isolated and never deployable.
- **RED:** measurement fixtures reject missing route/locale/tier rows, frame-interval values confused with callback time, absent hardware profile and zero/hidden sample sets. Static browser/media tests fail for six missing posters; publication remains false until bytes/files/projection match. For the existing presentation tail, reproduce/trace the actual failure and RED its diagnosed scheduling/allocation behavior before touching production logic; do not presume its cause.
- [ ] Extend measurement/capture to all five route pairs and current physical-device protocol. Diagnose the historical late-frame cause with CPU/GPU/presentation evidence; implement only measured, test-backed fixes preserving approved appearance. No blind second scheduler rewrite, arbitrary DPR reduction or gate weakening.
- [ ] Capture label-free posters from each production profile's zero-input rest pose with pinned unexcited strings; CSS capture sizes 1920×1080/450×800 and existing cover alignment. Verify output image dimensions against manifest, ≤150/80KiB, only the correct responsive image requested, matched first live paint and failure CSS ground. Publish only actual files, not placeholders or identical art for all meanings. Inspect/approve static baseline diffs on each supported platform.
- [ ] In a private policy-enabled hardware candidate, record named physical desktop and constrained Android, OS/browser/GPU/refresh, build/patch and collection method. Run all five ES/EN pairs, active pointer traversals/stationary tails, scroll, focus/submit, Pause/visibility/Footer, route/locale cycles and sustained use. Collect at least three valid active runs per route/tier/device; retain all runs. Controlled SwiftShader/throttled desktop cannot stand in for phone/GPU receipts. Unavailable GPU metric remains OPEN.
- [ ] Prove closure ≤120KiB, draw/DPR/poster limits, frame-interval p95 ≤20ms, task <50ms, LCP/INP/zero enhancement CLS, legacy ambient/new rest/paused zero-frame behavior, one renderer and stable resources. Report raw values, method, variability and failed runs; no rounded-zero CLS or selective passing two runs.
- [ ] Run capture/media/measurement contracts, controlled production browser suites, `npm run measure:connected-studio`, `npm run measure:connected-studio-vitals`, the extended hardware protocol and `npm run validate`; restore policy-disabled source, commit/review. Final release deltas remeasured in 13/15.
- **Acceptance/verification:** six distinct matched images and complete passing production/hardware gates for the intended tiers across all five routes. If a device/metric is missing or budgets fail, record OPEN/FAIL and stop before 13/15; return measured fidelity/performance options to owner. A static interim release requires an explicit amended checkpoint and cannot complete the interactive objective. **Reviewer:** R + owner rendered/performance acceptance; actual device operator attests measurements.

## Task 13 / PR 13 – Assemble and verify the atomic commercial release

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 1–12 completed/human-merged; final legal/account probe receipts signed. **Concurrency wave:** W7.
- **Owned write paths:** `lib/{site-routes,foundation-navigation}.ts`, `lib/inquiry/{release,configuration}.ts`, `components/foundation/{SiteFooter.tsx,footer-content.ts,content-types.ts}`, `components/contact/{ContactPage,ContactForm}.tsx` only final legal-link/mode integration, `app/(es)/{contacto/page.tsx,privacidad/page.tsx,_content/contact.ts,_content/privacy.ts,_content/home.ts,_content/services.ts}`, corresponding `app/(en)/en/{contact/page.tsx,privacy/page.tsx,_content/contact.ts,_content/privacy.ts,_content/home.ts,_content/services.ts}`, new `app/(es)/terminos/page.tsx`, `app/(en)/en/terms/page.tsx`, `.github/workflows/deploy.yml`, `scripts/{verify-static-export.mjs,verify-static-export.test.mjs,site-routes.test.mjs,foundation-route.test.mjs,foundation-content.test.mjs,site-footer.test.mjs,contact-route.test.mjs,contact-content.test.mjs,privacy-route.test.mjs,privacy-content.test.mjs,homepage-content.test.mjs,services-content.test.mjs}`, new `scripts/{verify-inquiry-release.mjs,inquiry-release.test.mjs}`, `tests/e2e/support/paths.ts`, `tests/e2e/{smoke,marketing-services,marketing-navigation,connected-studio-services,connected-studio-footer,privacy,contact,contact-commercial,legal,sfc-production,accessibility,sfc-accessibility}.spec.ts`, `tests/e2e/visual/{contact,legal,connected-studio-footer}.visual.spec.ts` and those snapshot directories, `task-13.md`.
- **Forbidden/shared paths:** graph live flags, engine/model, global App Bar/materials, substantive reviewed legal rewriting or unrelated route cleanup. No new sitemap/robots/SEO initiative; verify existing route metadata rather than inventing missing product scope. **Exclusive locks:** `SFC-ROUTES-FOOTER`, `SFC-RELEASE-CONFIG`, browser/GPU; Samuel controls deploy/live locks.
- **RED:** route/export tests expect Terms pair, sixteen actual documents, correct localized metadata/alternates and no retired routes; current fourteen-route system fails. Mode integration tests fail if commercial mode has demo privacy/CTA text or missing/wrong endpoint, if demo mode transmits, or if QA-CANDIDATE can pass deploy verification. Add exact failure fixtures before changing release/config/workflow.
- **Pinned test cases:** `"Terms has both base-path-safe equivalents"` asserts `getFoundationPath('terms','es') === '/terminos/'` and the English equivalent `/en/terms/`; `"commercial export is coherent"` requires sixteen localized route documents, zero draft/demo zero-transmission strings on the commercial surfaces and actual retired-path HTTP 404; `"candidate release cannot deploy"` requires nonzero verifier exit for the QA marker, changed commercial-copy hash or absent receipt even when the endpoint is valid.
- [ ] Register Terms once in route equivalence/navigation helpers, shared Footer labels and test support; add two server routes using final reviewed LegalPage data. Keep Terms out of primary App Bar and Founder out of primary navigation. Preserve `#site-top`, process/service/dossier links and fragment-free canonical/locale alternates. Footer adds one Terms utility link alongside Privacy with correct focus order; obtain its localized label from `footer-content.ts` without requiring edits to every existing page's Footer prop object.
- [ ] Wire final commercial Contact/Privacy data and exact Home/Services consistency replacements in one build; retain pure demo adapter and its isolated tests. Replace old global demo-only assertions with explicit commercial expectations and retained demo-contract tests, not blanket deletions. Update Footer focus-order tests and whole-export verifier's old Founder section-order/demo strings intentionally.
- [ ] Commit commercial release selection with the real release ID matching `readiness.json`; public endpoint is supplied explicitly as `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in workflow build environment, not a secret. Run `verify-inquiry-release.mjs` before Next build: missing/wrong endpoint, absent receipt, mismatched content hash/release ID, draft legal readiness or QA marker exits nonzero. Its fixtures cover every rejection; it validates evidence linkage, never makes a legal judgment. Commercial route configuration also throws on missing endpoint during ordinary `npm run build`. Runtime missing configuration stays honestly unavailable. Workflow must never deploy a candidate artifact or reuse a local `out/`.
- [ ] Run full `npm run validate`; clean builds at root then `/Portfolio`, export verification and served-export Chromium/Firefox/WebKit integration. Delete only the resolved current worktree's `.next`/`out` after checking absolute boundaries; never sweep other worktrees. Verify real sixteen route files, HTML languages/title/alternates, CV signature/download, six posters, 404 responses and every legal/footer/locale link. Repeat final all-five-page optional closure/vitals and actual Contact focus/runtime regressions; ordinary provider traffic remains fully mocked.
- [ ] Perform the final review matrix below: responsive/zoom, keyboard/screen-reader, axe, forced colors, reduced motion, touch scroll/native keyboard and complete state/motion visual QA. Run Taste postflight, Impeccable harden/adapt/optimize and Emil/review-animations inline; record dispositions rather than letting a Skill override approved hierarchy. Fix genuine findings through the owning RED/verification cycle; material design/legal/performance changes return for approval.
- [ ] Prepare rollback before merge: identify pre-PR deployable SHA/export and test it in isolation with demo disclosure/mode and old route set. Samuel is present for deployment plus Task 14's immediate checks, has account access and adequate allowance; hold PR human merge otherwise. Reviewer R verifies the complete release diff and readiness; human merge activates this single coherent release. Tier flags remain false.
- **Acceptance/verification:** complete reviewed commercial candidate passes all deterministic/browser/design/legal/account prerequisites, no mixed public data-flow claims, deploy/rollback artifacts identified, actual postdeployment receipt explicitly pending until 14. Human merge requires explicit release sign-off; no agent pushes/merges main or treats Q14 planning approval as release approval. **Reviewer:** R + Samuel commercial release approval; counsel final wording reference.

## Task 14 / PR 14 – Verify the deployed inquiry and operational recovery

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna, High, recording evidence; Samuel performs authenticated/live actions. **Dependencies:** 13 human merge/deployment; operator and checklist prepared before that merge. **Concurrency wave:** W8.
- **Owned write paths:** new `docs/reviews/studio-founder-contact-acceptance-v1/{deployed-inquiry,operations,release-checkpoint}.md`, `task-14.md`; verified current-state sections of `ARCHITECTURE.md` and `docs/product/pages/contact-and-privacy.md`. Product correction requires a focused follow-up under the owning packet, not an unreviewed live edit.
- **Forbidden/shared paths:** no new submissions from automated CI, no private data/credentials/body contents in Git, no silent delivery/retention assertion, no graph enablement. **Exclusive locks:** Samuel holds `SFC-DEPLOY` and `SFC-FORMSPREE-LIVE` through the release checkpoint; browser lock during operator tests.
- **RED:** N/A for receipt-only documentation. The checklist records actual PASS/FAIL/OPEN; no synthetic green. A correction to production behavior restarts its real TDD cycle and independent PR review.
- [ ] Immediately after the controlled deployment, within a prepared 30-minute release observation window, Samuel submits one labeled synthetic inquiry from each actual localized `/Portfolio` page. Verify four values (including multiline/Unicode sample within limits), source/locale, provider acceptance, dashboard presence, Gmail delivery and Reply-To. Check that UI success describes acceptance rather than delivered/read. Ordinary tests remain mocked; these two intentional live sends are operator receipts only.
- [ ] Verify actual deletion from Formspree Inbox/Spam/Over Limit as applicable and Gmail active copies, recording what cannot be erased/verified in logs/backups and already approved exceptions. Confirm accessible Privacy/Terms/footer/locale links on the deployed build, correct matching notice, no false demo claim or public draft marker, and a no-JS direct-channel path. Do not label a provider-console probe as deployed-app E2E.
- [ ] If acceptance/delivery/field integrity/disclosure/deletion operations contradict readiness, **fail the release checkpoint**. Freeze further real probes; Samuel initiates the prepared rollback through a human-controlled revert/redeploy of the whole PR 13 release, restoring matching demo mode/disclosures/consistency text and removing the new Terms release together. Keep records of any already received data and handle it under the reviewed processing notice/rights process; rollback cannot erase receipt history. Confirm the previous honest public build is live and escalate the specific failure. No false local success or hot-swapped endpoint.
- [ ] On PASS, confirm Samuel's business-day monitoring of inbox/quota/Spam/Over Limit, 75% threshold decision and documented direct-contact recovery when unavailable. Record recipient/deletion owner, cadence and counsel-approved retention exceptions; no recurring automation or paid upgrade is created by this task.
- [ ] R independently checks public deployment, redacted outcomes and rollback readiness without sending another inquiry. Run docs validation/diff check and relevant deployed read-only smoke; commit, review and human merge the evidence PR. Architecture records actual facts only after observed deployment.
- **Acceptance/verification:** two real-locale delivery/deletion receipts, coherent deployed notices, operational owner/runbook and explicit release PASS. Missing evidence is OPEN; a failed checkpoint blocks 15 and overall completion. **Reviewer:** R + Samuel's authenticated operational attestation; counsel if observed facts require wording revision.

## Task 15 / PR 15 – Enable qualified graph tiers and close integrated acceptance

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Anthropic Claude Sonnet 5, High. **Dependencies:** 12, 13, 14 PASS plus all five route pairs meeting each proposed tier's final hardware gates. **Concurrency wave:** W9.
- **Owned write paths:** `lib/connected-studio/capability.ts`, `scripts/connected-studio-capability.test.mjs`, `tests/e2e/{connected-studio-production,sfc-production,sfc-runtime,sfc-accessibility}.spec.ts`, final receipt `task-15.md`, `docs/reviews/studio-founder-contact-acceptance-v1/index.md`, current-state sections of `ARCHITECTURE.md`, `docs/design/{index,studio-founder-contact-v1}.md`, `docs/testing/{playwright,visual-regression}.md`, `docs/product/site-feature-catalogue.md`, `docs/governance/status-register.md`, `docs/index.md`, `docs/plans/index.md`, progress/status and eventual move of this plan to `docs/plans/completed/studio-founder-contact-v1.md` after human acceptance.
- **Forbidden/shared paths:** no unmeasured tier, new scene fidelity change, performance threshold weakening, inquiry/processor/copy change or retrospective acceptance of deferred evidence. **Exclusive locks:** `SFC-LIVE-POLICY`, `SFC-BROWSER-GPU`, human `SFC-DEPLOY` for bounded enablement.
- **RED:** gate tests first expect the specifically qualified tier(s) true, ineligible tier false, while reduced motion/Save-Data/denied/software/context-loss remain static without optional engine request. Current all-false policy fails the eligible assertion. A tier assertion cannot be written as eligible until its named all-five-route evidence is accepted.
- [ ] Rebase to released main; repeat hardware candidate measurements for changed final release deltas and final route/locale cycles. Record which wide/compact tiers pass. All five routes within a tier must pass; no per-page silent exception. Enable only qualified flags with minimal GREEN; no policy query/environment shortcut. An unavailable/unqualified tier remains false and the interactive objective remains partially OPEN pending owner resolution.
- [ ] Run full `npm run validate`, root/base-path export verification, Chromium/Firefox/WebKit functional suites, responsive/axe/manual matrix, reduced-motion/no-import and one-renderer tests. Recheck final closure/poster/vitals, actual hardware frame interval and disposal; present the final live + static + contact/legal renderings for Taste/Impeccable/Emil postflight and owner visual acceptance. Live scenes have behavior/motion recordings, never unstable pixel goldens.
- [ ] Obtain independent R review of flag changes, full acceptance coverage and fresh verification-before-completion/pr-readiness. Samuel approves the bounded enablement PR; human merge only. Verify deployed static fallbacks and live-tier behavior without issuing another inquiry unless an actual changed intake behavior requires one.
- [ ] Synchronize current architecture/design/testing/status/feature catalog and acceptance ledger with actual measurements, review findings and PRs. Preserve historical deferrals in old records. Only mark this plan COMPLETED/move it after every required task, full interactive tiers/approved amended target, commercial receipts, final human acceptance and integration QA close. If evidence is missing, leave ACTIVE with the exact OPEN gate and do not claim completion.
- **Acceptance/verification:** genuine public inquiry plus approved distinct Studio/Founder/Contact/legal surfaces, interactive strings within retained budgets on qualified hardware, complete independent/human review and final green verification. **Reviewer:** R + owner final rendered/hardware acceptance. No model substitution, hidden gate waiver or review-by-implementer.

## Verification matrix and final release checkpoints

Every behavioral increment follows **RED → run/confirm intended assertion failure → minimal GREEN → refactor → rerun** before the next increment. A missing module/compile/setup failure alone does not prove a behavior RED: start with a compiling seam/test fixture and exercise the current behavior, or explicitly record why a new API has no executable predecessor, then obtain an assertion RED before implementing its behavior. Test receipts retain names, exact commands, failure reason and head, not just a screenshot of a red command. Pure visual changes use approved specs and rendered evidence; do not assert Tailwind classes, style strings or fixed line counts.

| Proof | Owning tasks / required evidence |
| --- | --- |
| Content/contracts | 2–6/8/9/11/13: exact locale strings/facts, sixteen commercial routes, correct code-point/byte/endpoint/trap semantics, demo zero transmission retained, no public draft. |
| Graph physics | 3: deterministic clock/scheduler, 60/120Hz invariance, finite/capped samples, pins/decay/inertia/interrupt/resize/gaps, touch scroll-only, fixed Contact nodes and legacy ambient vs new sleep. |
| Runtime | 7/10/12/15: curved growth/tracers/projection, cached masks/input, form suspension, one renderer, no optional import in gated states, context/session/locale changes, zero callbacks and stable resources. |
| Form browser | 9/13: ES/EN in Chromium/Firefox/WebKit, every result class mocked, duplicate lock/stale errors/unmount, value preservation, accepted-only clear, live status/field focus, no-JS, privacy/terms/alternatives. No ordinary live traffic. |
| Responsive | 5/6/8/9/13: both locales at 320/390/768/1024/1440, portrait/landscape, 200% browser zoom and text zoom, mobile keyboard/textarea resize, no content loss/overflow, 44px minimum targets. |
| Accessibility | 10/13/15: axe all redesigned routes/locales; manual keyboard/source order/landmarks/headings, App Bar-aware anchor focus, NVDA+Firefox or Chromium desktop and VoiceOver+Safari mobile spot checks, busy/error/success announcements exactly once, Pause/fallback continuity, forced colors and contrast on actual composited states. Record real tool/device/operator; missing screen reader/device remains OPEN. |
| Visual quality | Taste v1 preflight/postflight, Impeccable audit/adapt/clarify/harden/optimize where useful, Emil motion review. Inline degraded assessments where Skills demand subagents. Compare approved full-copy references; preserve hierarchy/brand if generic Skill advice conflicts. Owner reviews intended static baselines; Linux captures require actual CI artifacts at the same head, not renamed Windows files. |
| Export | 13/15: separate clean root and `/Portfolio` builds, actual sixteen HTML artifacts/languages/metadata/alternates, every local destination and CV, no retired artifacts/route resurrection, actual HTTP 404s, no hidden server dependency. `npm run verify:static-export` does not replace served-export browser proof. |
| Production performance | 12/13/15: optional closure/chunk requests cross-check, no critical-host bytes evasion, correct responsive poster, draw/DPR budgets, physical desktop + named constrained Android, ≥3 valid active runs/route/tier, frame-interval p95 distinct from callback/GPU time, task/vitals/zero CLS, full lifecycle. Retain failures and variability. |
| Live intake | 11 predeployment provider probe; 14 actual two-locale deployed acceptance/dashboard/Gmail/Reply-To/deletion. Different receipts, Q15 sequencing, reviewed legal/account gates before any deployment. |
| Completion | Fresh `npm run validate`, relevant browser/axe/export/measurement results, complete diff/self-review, verification-before-completion and pr-readiness, independent reviewer R and human merge. No prior run reused after relevant changes. |

Command convention in PowerShell: set `$env:PLAYWRIGHT_PORT='32NN'` and the intended base path before each run, then remove task env overrides after. `npm run test:e2e -- <owned spec files> --project=<actual project>` must report nonzero selected/passing tests; record any retry and its first failure. Production: build with the intended `NEXT_PUBLIC_BASE_PATH`, run `npm run verify:static-export`, set `PLAYWRIGHT_SERVE_EXPORT=1`, then run `sfc-production.spec.ts` against the registered production Chromium/Firefox/WebKit projects with the real `out/` and no reused dev server. Measurement scripts' `--skip-build` applies only to the exact recorded current export. Do not run multiple builds in one worktree or benchmark while another task compiles/captures.

**PR checkpoints:** W0 accepted governance; W1 frozen contracts/test partitions; W2–W4 disjoint implementation plus combined form/host regression; W5 no publication-critical legal/account facts open; W6 posters and actual performance pass; W7 complete candidate/release/rollback approval; W8 deployed delivery/deletion PASS; W9 qualified tier enablement and final integrated acceptance. At every checkpoint the coordinator records merged heads, task sessions stopped, locks released and next tasks' bases. A failed check blocks the dependent checkpoint; fixes keep their own TDD and review receipts.

## Risks, escalation and bounded alternatives

- Historical engine closure is 114.4KiB Brotli, desktop active-frame gate failed two of four runs, compact physical proof absent. Task 12 diagnoses rather than extrapolates the prototype. If pooling/cached input cannot preserve A.2 within budgets, return measured options; no silent static-only completion or increased ceiling.
- Formspree Free account settings/control availability, over-limit handling, actual transfer/retention and legal requirements remain external gates. The owner checklist is explicit; no implementer invents settings, legal facts, paid upgrades or an inaccessible CAPTCHA workaround.
- Static Pages deployment cannot supply a newly deployed-form receipt before publication. Q15 explicitly permits the predeployment provider probe + immediate deployed verification/rollback sequence. Legal/account gates are unchanged; human operator readiness is mandatory before merge.
- Any required processor/challenge/consent change, different motion/camera/density/fidelity, endpoint or provider-model substitution requires an explicit reviewed decision/plan amendment. Do useful independent work while awaiting a gate; never treat elapsed time as approval.
- The independent Opus plan review is separate from all implementation/PR reviews. No automatic subagent review, master-plan rewrite by Claude or execution dispatch follows this draft's creation.

## Progress and review ledger

| Gate | Current state |
| --- | --- |
| Discovery and three structural directions | Complete; evidence in discovery/gallery. |
| Written revision 1 / copy / bounded scope | Owner APPROVED Q14, 2026-10-14. |
| Controlled static-hosting release order | Owner APPROVED Q15, 2026-10-14. |
| ADE master plan | Revision 1 PROPOSED; no implementation task started. |
| Independent Claude Opus 5.5 High review | PENDING, separate read-only session; no findings received. |
| Findings dispositions and revised review-ready plan | PENDING findings; planning authority owns revision. |
| Owner execution authorization / Governance PR | PENDING. |
| Legal, account, provider/deployed receipts, physical hardware | OPEN; assigned to 11/12/14. |
| Task 1–15 PRs / main merges / live policy | NOT STARTED; current demo and disabled live flags remain effective. |

Planning self-review: checked spec coverage against every section, frozen interface names/units, all five Review Focus conditions, behavioral RED ownership, serial ownership transfers and wave write/resource separation. A local packet audit found all fifteen required field sets/execution blocks, no expanded explicit write-path intersections in W2/W3/W4 and an acyclic dependency/wave graph. Major Skill recommendations/dispositions remain in the discovery register. Fresh planning verification: docs validation passes (397 Markdown files, 117 IDs, 38 Skills); `npm test` passes 519/519 on a permitted-localhost rerun. The first sandboxed run failed six existing HTTP fixtures with `connect EACCES 127.0.0.1`; no code was changed to resolve it. Diff whitespace checks pass. These checks validate the documentation/current contracts, not the future implementation. No full product `npm run validate`, independent Opus verdict, legal sufficiency or hardware pass is claimed. Subsequent review findings receive an itemized disposition here or in a linked review owner; justified changes increment plan revision without deleting history.

## Deviations discovered during execution

None: execution has not begun. Q15 is an owner-approved planning clarification recorded in the spec, not an implementation deviation.
