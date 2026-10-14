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
  - REVIEW-SFC-PLAN-2026-10-14
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

> Implement with `superpowers:executing-plans`, one primary top-level session per packet, zero subagents. GOV-AGENT-USAGE overrides delegation requested by Skills. Separate worktrees/branches are mandatory. Claude implements/reviews only; the planning authority authors the master plan.

**Goal:** deliver the approved bilingual Atlas Studio/Founder/Contact/legal experience, genuine public inquiries, and measured yielding nodes/pinned strings on the five connected page pairs.

**Architecture:** extend the existing pure model/controller and single direct-Three.js host/engine with route profiles and one pure projection seam. Preserve semantic server pages, typed locale copy, the provider-neutral inquiry port/Formspree adapter, static export and `/Portfolio`. Home remains a separate runtime. Commercial release does not depend on hardware tier qualification.

**Stack:** installed Next.js 16.3.2-compatible version, React 18.2, TypeScript, Tailwind 3, Three.js 0.186, React Hook Form 7, Node tests, Playwright 1.63/axe. No new dependency, backend, font or hosting system.

**Authority:** [DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md) written revision 1/copy/bounded scope was owner-approved in Q14. Q15 approved the provider-probe → coordinated deployment → immediate deployed receipts/rollback sequence. Q16 approves **Sonnet 5.5 High and GPT-6 Luna High**; Q17 approves **a nondeployed integration branch and one coordinated main release**; Q18 approves the corrected Studio H1 and acceptance-only Contact success text. Technical/visual clarifications added for this review are explicitly identified in the spec; acceptance of this revised plan closes those target clarifications, not legal sufficiency.

## Status and independent review

**Revision 2 — PROPOSED; execution NOT AUTHORIZED.** ACTIVE is the repository location/status schema, not evidence of dispatch. Discovery base: main/origin at `bd5cd66aa0282735245605f1063ad5912a60d3ed`. Revision 1 reviewed head: `bedbed0604deec73384e50c573bfeaf91ea27737`, [PR #141](https://github.com/Furlanich/Portfolio/pull/141). Reconcile newer human-merged changes before execution without resetting owner work.

Independent **Claude Opus 5.5 High**, separate top-level/read-only session, returned **REVISION REQUIRED**: four blocking, eleven high, thirteen medium, seven low. The [review disposition record](../../reviews/studio-founder-contact-plan-review-2026-10-14.md) preserves every finding, verified evidence, accepted/adapted/rejected reasoning and old/new packet mapping. The reviewer did not write this revision. Return revision 2 for independent re-review; the planning authority handles justified amendments. Owner approval, Governance PR and human merges remain required. No product implementation follows this draft automatically.

## Scope, requirements and fixed decisions

Exact geometry, graph anchors/edges/depth, equations and full public copy remain in the spec/page owners. This plan supplies interfaces, sequencing, ownership, operational evidence and tests, rather than duplicating those large tables.

| Area | Binding target |
| --- | --- |
| Routes | Existing Studio, Founder, Contact, Privacy pairs; new `/terminos/`, `/en/terms/`, ID `terms`. Sixteen final localized foundation documents. Preserve actual 404s for retired project details and all service/process/dossier fragments. |
| Hierarchy | Studio identity → accountability/collaborators → principles → location → Founder bridge → Contact. Founder complete biography → professional links → experience → education → capabilities → evidence → Contact. Contact introduction/expectation → form/privacy → alternatives → Founder. Legal title/update/contents → all sections → contact/reciprocal link. |
| Visual | Owner-approved 1180px inner editorial container; 32/20px gutters; 1024/768 breakpoints; H1 Studio/Contact 68/48/42, Founder 88/64/56, weight 600; body 18/1.6. These are intentional page-type variants, not changes to Services/Projects/Home. Shared W1 primitive owns the values; no three copies of plate/scrim CSS. |
| Reading surfaces | Editorial opaque plate `#0A1E33`, border `#36536C` 1px, radius 16px, padding 40/32/24; no blur/shadow/ticks in this variant. Scrim: opaque Abyss, radius 8px, no feather/border/shadow, 24px clearance, Contact intro 32px. Existing default AtlasPlate/Home material unchanged. |
| Exact decisions | Studio retains both intro actions, then reserved Pause; Founder Pause follows professional links within intro plate; Contact Pause follows response expectation before intake. Static mode shows quiet static-background text in the 44px slot. Contact tablet padding 32px, splits at **820px**, stacks below; gap 32px until 1024, then 64px/40px padding. |
| Content | Three biography paragraphs, two employment entries/internship, both education entries, four capability groups, complete MPC educational/group/fictional limitations/source; employer narrative only. Preserve actual CV/source/professional destinations. Portrait deferred. |
| Shared graph | New profiles: spec's 16-node Studio/Founder/Contact meanings and compact eight-node composition. Services/Projects keep 16/33 and 8/13, existing vocabulary/proportions/growth/tracers. FOV 35°, camera z=12. New normalized anchors are inverse-projected once; no legacy spread/depth scaling on Atlas profiles. |
| Motion | Radius 280px, nearest five squared weights, caps 34/24/14px; spring 42/10, normalized momentum, ≤1/120s steps/50ms gap. Seven string samples, pinned ends/five interiors, tension 90, stiffness/damping 32/7, caps 16/10/6px, Contact 4px, ≤12 curve segments. All spec pressure/decay/rest equations apply. |
| Eligibility | No new excitation over controls/forms, opaque plates +8px, or text scrims expanded by their 24/32px clearance +8px. Cached rectangles only. Existing tails damp; no hidden-pointer momentum on re-entry. Touch native scrolling only; no taps/drag, textarea scroll or history/anchor/resize replay. |
| Lifecycle | New pages sleep at rest; SPF retains 1.2°/s, ≤30/20fps ambient; active ≤60fps. Contact nodes fixed; focus/submission clears stimulation/suspends drawing. Pause/hidden/offscreen/Footer/dispose zero callbacks. Reduced motion/Save-Data/denied/software/context-loss: no optional engine import. Existing session keys only; Home flag read only. |
| Contact | Four public fields, 100/254/120/4000 code points, 24KiB transport, 10s timeout; native maxlength retained at **200/508/240/8000 UTF-16 units**. Real trap, synchronous lock, request identities/cancellation; accepted only 2xx JSON `ok:true`; failures preserve values, explicit retry, no storage/logs/autosend. |
| Focus | Valid submit transfers focus to submit **before** disabling only the fields. Busy submit remains focusable with `aria-disabled`, lock blocks duplicate activation. Initial unhydrated submit natively disabled. Busy live status is unfocused; success/global failure goes to a nonlive named/described result region; field rejection focuses first invalid field. No focus + live-result double announcement. |
| Intake configuration | Exact public endpoint `https://formspree.io/f/meaqwnbr`; committed mode/release record plus allowlisted build-time endpoint; no public/environment-only mode switch. Missing commercial endpoint fails build; unavailable runtime never simulates success. Ordinary tests intercept provider traffic. |
| Legal | Original ES/EN language; Samuel/owner-supplied address/email only; Terms website use/initial inquiries only. Professional Argentine review/actual processors/transfers/retention/rights are blockers. No invented corporation, date, registration, deletion guarantee, consent checkbox or service contract. |
| Graph budgets | Optional closure ≤120KiB Brotli with no critical-chunk evasion; posters ≤150/80KiB, draws ≤28/18, DPR ≤1.5/1.25; physical active frame-interval p95 ≤20ms, scene task <50ms; LCP ≤2.5s, INP ≤200ms, enhancement CLS zero. Disabled-tier release can proceed without hardware qualification, not claim the interactive objective complete. |
| Critical route budgets | Relative to Task 3's same-version/base-path cold baseline: added first-load JS Brotli ≤12KiB Studio/Founder, ≤16KiB Contact, ≤2KiB legal (Terms compared to Privacy). Added startup evaluation/hydration CPU p95 ≤25ms; no added ≥50ms task. Five cold journeys/profile, exclude network/idle/optional engine, retain raw trace/method. No host hydration in policy-disabled builds; verify emitted requests rather than assume tree shaking. |

Preserve brand/fonts/palette/mark, shared App Bar and Footer composition. No analytics/CRM/files/challenge/video/new social metadata initiative. WhatsApp retains its current destination with **no new prefill**; the unapproved Spanish proposal is deferred. Social previews are knowingly deferred to a separate bounded proposal; Terms title/description and ordinary metadata are specified now.

## Provider and reviewer routing

Each packet declares its target explicitly. **OpenAI GPT-6 Luna High: `gpt-6-luna`, reasoning `high`**, as originally requested and reaffirmed Q16. **Anthropic Claude Sonnet 5.5 High: `claude-sonnet-5-5`, effort `high`**, explicitly authorized Q16; no floating `sonnet` alias or Sonnet 5 target remains. Record actual resolved identifiers/effort at session start; a mismatch/unavailable authorized target stops dispatch for explicit resolution. This is a capability check, not an unresolved model selection. Luna owns bounded content/page/form/evidence work after W1 design seams freeze; Sonnet owns coupled contracts/physics/engine/lifecycle/measurement/release work.

**Reviewer R:** separate top-level Codex review through the repository plugin, actual resolved model recorded, no source writes, no contribution to that PR. For inquiry Tasks **5 and 10**, additionally require **fresh independent Claude Sonnet 5.5 High** review for transport/focus/privacy risk; it is read-only, not an implementer subagent or master-plan author. The plan-specific supplemental review is recorded in Governance PR 1 under I-8. Every PR gets human review/merge. Counsel decides legal sufficiency; Samuel attests authenticated operations. The independent Opus master-plan gate is separate from these PR reviews.

## Branches, worktrees and release strategy

Q17 chooses coordinated release. PR 1 targets `main` (governance/docs only). After its human merge, create short-lived **`codex/sfc-integration`** at that accepted SHA. PRs 2–14 target this branch; each human-reviewed wave merge becomes the next frozen base. They **do not deploy**. PR 16 targets `main` from a release branch forked from the accepted integration head and contains the combined reviewed implementation plus atomic commercial selection. No cherry-pick of a partial page into main. PR 17 (receipts), PR 18 (qualified flags), PR 19 (closeout) target released main. PR 15 qualification targets integration if collected before release, otherwise main; coordinator records that base before dispatch. Its result is not a prerequisite of PR 16. Preserve integration history until final review; retire the branch/worktrees only after needed evidence is safe.

Use `superpowers:using-git-worktrees`: inspect attachments/isolation first; reuse only the current task's suitable checkout. Prefer native managed worktrees named `sfc-NN`, with the exact frozen base SHA and `codex/sfc-NN-<purpose>` branch. Record returned absolute path. Keep checkout root ≤100 characters. If native setup is unavailable or cannot satisfy that bound, verified fallback is **`D:/Projects/NextJS/Portfolio/.worktrees/sfc-NN`**, confirmed ignored, created with `git worktree add -b <task branch> <absolute path> <base SHA>`. `npm ci` in each checkout; never share node_modules/build outputs. Task 2 excludes `.worktrees/**` from TypeScript discovery (ESLint already excludes it). Permission/path failure does not authorize a shared-checkout fallback: user-mandated isolation overrides that Skill fallback.

After merge and clean-status/evidence checks, archive native worktrees via app tooling; manual fallback uses `git worktree remove` only after resolving/verifying the exact absolute target under `.worktrees/`. Preserve needed ignored traces first. Never recursively sweep a computed Windows parent path. No global Git/Node setting change is authorized to conceal path failures.

One task = one primary, no subagents/nesting. At most three concurrent implementation sessions total, within provider caps. No two active agents share a packet, write set or dependency chain. All unlisted paths are forbidden; package/lockfiles, global tokens/CSS, Home runtime, protected mark, App Bar, vendored Skills and provider control files are forbidden unless expressly listed. Source/authority is read-only to other owners. A task receipt exclusively owns `docs/reviews/studio-founder-contact-acceptance-v1/task-NN.md`. Coordinator updates its ledger only at quiescent checkpoints. Only the planning authority changes master-plan substance; Task 19 owns bounded documentation closeout after transfer from the coordinator.

### Lock protocol and remediation

Ignored operational state: `.worktrees/.sfc-control/requests/task-NN.json` (requester-owned) and `leases/<resource>.json` (coordinator-owned). Only one coordinator grants leases, using atomic create-new and atomic updates; no implicit lock by prose. Lease fields: schemaVersion, machine, resource, task, checkout, head, holder PID/CI run, leaseId, grantedAt, heartbeatAt, expiresAt. Browser/GPU, measurement, deploy/live-probe and shared-contract resources use the names listed per packet. Worktree-local build/cache/server ownership is recorded separately.

Request a grant before use; after five minutes without grant record WAITING_RESOURCE and continue independent editing or stop, not spin. Lease expires after 90 minutes, heartbeat every five minutes during long work. Expiry never permits stealing: coordinator verifies the holder/process/run stopped before marking stale and regranting. Release only after server/capture/measurement processes stop; record outcome/release timestamp. Browser/capture/benchmark locks are machine-specific; CI shards are separate machines. Physical benchmarks additionally exclude other builds/heavy tests. Samuel holds `SFC-DEPLOY` and `SFC-FORMSPREE-LIVE`; ordinary CI never acquires the live-probe lock.

W4.5 Task 12 owns actual form/host integration. Any later finding outside an active packet's write set creates a **new numbered Task N / PR N (starting at 20)** authored by the planning authority, naming finding, exact provider, base/dependencies/wave, transferred paths, locks, RED, acceptance, verification and independent reviewer. Prior owner exits first. Coordinator holds dependent checkpoints; the repair is reviewed/merged and the original failing check rerun before release. No closed task, coordinator or release implementer silently widens ownership. Material design/processor/budget changes reopen governance/owner approval.

### Waves and dependencies

| Wave | Packets / prerequisite | Checkpoint |
| --- | --- | --- |
| W0 | 1, after revised-plan independent/human approval | Accepted governance; staging branch created; external legal/account work starts. |
| W1 | 2 ←1 | Contracts, shared visual primitives, export/test partition, CI/candidate harness. |
| W1.5 | 3 ←2 | Existing performance/critical-JS baseline and early diagnosis; no counsel dependency. |
| W2 | 4,5,6 ←2,3 | Pure graph; inquiry boundary; Studio, disjoint. |
| W3 | 7 ←2,3; 8 ←4; 9 ←2 | Founder; engine; legal template, disjoint. Early closure checkpoint after 8. |
| W4 | 10 ←5,9; 11 ←4,6,7,8 | Contact and host independently use frozen form signal. |
| W4.5 | 12 ←10,11 | Combined actual-page behavior and rendered five-profile evidence with owned repairs. |
| W5 | 13 ←9,10 + human facts; 14 ←4,6,7,8,10,11,12 | Final legal/account copy versus posters/static-release measurement; independent writes; collection/build locks serialize measurement. |
| W6-H | 15 ←12,14 | Hardware qualification lane; can defer collection until after 17. No active agent waits for missing hardware; no release dependency on its verdict. |
| W7 | 16 ←1–14 (not 15) | Coherent commercial/visual release and rollback approval. |
| W8 | 17 ←16 deployment | Immediate deployed ES/EN delivery/deletion receipt. |
| W9 | 18 ←15 qualified tier(s),16,17 PASS | Separate bounded live-policy enablement; unresolved tier remains OPEN. |
| W10 | 19 ←all required acceptance/approved amended target | Planning-authority documentation closeout; no premature interactive completion. |

Merged prerequisites mean human-reviewed code at the declared checkpoint, not a completion message. All old writer sessions stop before transfers. Rebase remaining sibling PRs after each human merge and rerun affected checks. Hardware collection never overlaps release builds/browser QA on the same machine; if its operator/device is missing, keep the session inactive and proceed with independently ready static/commercial release.

## W1 interfaces and harness decisions

| Owner / seam | Frozen interface and units |
| --- | --- |
| 2: visual primitives | Existing `AtlasPlate` gains `variant?:'default'|'editorial-opaque'`; default markup/material unchanged. New `AtlasScrim({children,clearance:24|32})` and `AtlasEditorialContainer({children})` server-only, values above, no layout-shifting expansion. Primitives emit `data-connected-opaque-plate` or `data-connected-reading-mask` with `data-connected-clearance="24"`/`"32"`; exact clearances feed cached host hit testing. New page main emits `data-connected-page`, `data-connected-route` and `data-connected-locale`; Pause slots are `connected-pause-<route>`. |
| 2: connected types/Ground | ConnectedRoute adds studio/founder/contact. `ConnectedWordBinding={nodeId:string;word:string}`. Ground discriminates legacy route + CapabilityWords eight-tuple vs new route + readonly wordBindings. New GraphNode/LabelProjection capabilityIndex optional. New pages never fabricate eight services. Policy-disabled server Ground omits the live client leaf. |
| 4: pure projection | `computeProjectionLayout(profile,viewport):ConnectedProjectionLayout`; `anchorToScene(position:Vec3,layout):Vec3`/`sceneToAnchor(position:Vec3,layout):Vec3`; `projectAnchor(position:Vec3,layout):{xPx,yPx,inView}`; `unprojectCss({xPx,yPx,zScene},layout):Vec3`; `resolvePosterProjection(profile,pose,nativeLayout):{layout,pose}` in `lib/connected-studio/projection.ts`. Types frozen by2 carry existing width/height/tier/aspect/spreadX/spreadY/depthScale/nodeScale/pathRadius/tracerRadius, optional pointScale and crop. Extract existing legacy spread/depth/fit/crop formulas unchanged. Atlas has spreadX=spreadY=depthScale=1: profile depth/tier factors already applied. Camera 35°/z=12/near1; perspective pxPerUnit=height/(2*tan(17.5°)*max(1,12−zScene)), x=width/2+xScene*pxPerUnit−(crop?.x??0), y=height/2−yScene*pxPerUnit−(crop?.y??0). Width/height are the full interpolated projection; crop.width/height are the visible CSS viewport. Inverse includes crop and inverse legacy scaling once. CSS dimensions/offsets only; DPR affects backing store, never projection/input/caps. |
| 4: pure rest path | `evaluateRestEdge({nodeStyle,edgeIndex,from:Vec3,to:Vec3,layout:ConnectedProjectionLayout},s:number):Vec3` in `lib/connected-studio/rest-path.ts`, returns anchor-space position. Atlas linearly interpolates endpoints. Legacy transforms endpoints once to scene space; bow sign `((((edgeIndex+1)*2654435761)>>>0)%2===0)?1:-1`; chord length L, normalized perpendicular `(-dy,dx,0)` (fallback `(0,1,0)` when squared length<1e-12), quadratic control midpoint + perpendicular×0.16×L×sign and z +=0.16×L×0.35×sign. Evaluate the quadratic and invert scene scaling once. Physics adds displacement to seven samples at s=j/6 of this moving-endpoint rest path. Runtime evaluates the same analytic rest path plus a smooth cubic interpolation of the seven final-point-minus-rest residuals, clamps rendered CSS residual to the specified cap, and uses that path for growth/tracers. No second bow, straight legacy fallback or seven-sample approximation of the original rest curve. |
| 4: profile/interaction | `getConnectedProfile(route,tier,{width,height}):ConnectedSceneProfile` contains route/tier/graph, Atlas `restAnchors?:readonly {id,u,v,zScene}[]`, ambient legacy/sleep, nodeStyle legacy/atlas, input yield/edges, poster pose. `createConnectedInteraction(profile)` exposes `step({nowMs,deltaMs,base,layout,pointer,scrollDeltaPx}):ScenePose`, clear/isSettled. Pointer null or CSS x/y, vx/vy px/s, ageSeconds. ScenePose edgeSamples are ID-keyed seven Vec3 anchor-space points; excitation records 0–1. Controller resolves native/poster frame once before interaction and returns `projectionLayout?:ConnectedProjectionLayout` in the final pose. Renderer/labels consume that resolved frame, not a second poster/spread transform; old poses without it use the pure legacy fallback. |
| 4: controller | Existing update/pause/resume/snapshot/dispose remain; options accept profile/interaction; update optionally accepts pointer, classified ordinary scroll and inputEnabled. Controller owns cadence/sleep; host never creates a second physics loop. Legacy defaults preserve old calls. |
| 8: runtime | Existing createConnectedScene/SceneHandle; optional profile, optional unused legacy words. Reexports pure profile/interaction/controller factories through the one gated entry. Geometry, labels and poster projection delegate to the pure projection seam; no second camera conversion. New physics stays in measured optional closure. |
| 5: inquiry | `SubmitInquiry(payload,context?:{honeypot?:string;signal?:AbortSignal}):Promise<InquirySubmissionResult>`. Payload unchanged. `createInquirySubmissionController({submit,dispatch})` exposes `submit(values,locale:'es-AR'|'en',honeypot:string):Promise<void>`/dispose. Export InquiryAction: local validation without request ID allowed only outside submitting; provider failures require matching ID. Synchronous lock, monotonic sequence and abort/ignore own races. |
| 5/16: configuration | `INQUIRY_RELEASE:{mode:'demonstration'|'commercial';releaseId:string}` initially demonstration; getInquiryConfiguration validates the exact endpoint or throws for commercial; createConfiguredSubmitInquiry selects port/adapter. No public toggle. |
| 10/11: form signal | `form[data-inquiry-phase]` exposes reducer phase plus data-contact-hydrated; no values/event bus. Delegated focus and phase observation suspend/clear the graph. Next eligible background input resumes after focusout. |
| 9/13: legal | `LegalPageContent` locale, privacy/terms ID, heading/introduction, update label/date, contents label, section IDs/headings/paragraphs/links, contact/reciprocal labels. Legacy demo may omit date/Terms link; final reviewed commercial data cannot. Server LegalPage renders all sections. Canonical final public strings live in bounded `SFC-PUBLIC-COPY-ES/EN` JSON fences in Markdown owners; tests compare full typed public data to those blocks. |
| 2: export partition | `scripts/export-requirements/{studio,founder,contact,privacy,home,services}.mjs` owns each existing declarative requirement map; verifier imports them. Page-owner root tests `{studio,founder,contact}-export.test.mjs` drive real verifier fixtures using shared `export-test-support.mjs`. No page PR needs to edit another page's requirements or the shared verifier. |

Task 2 partitions mixed Studio/Founder browser/Node source assertions without losing cases, including page.tsx shell assertions in foundation-content. Future `studio.spec.ts`, `founder.spec.ts`, each responsive counterpart, legal/contact-commercial/sfc-runtime/sfc-accessibility and production families have explicit owners below. Never treat a JSX Node-source assertion as a rendered visual test.

### Reproducible candidate/CI and baseline workflow

Commit `tests/fixtures/sfc/{commercial-release,live-policy}.patch` and `scripts/prepare-sfc-candidate.mjs` in 2: commercial patch sets release.ts to commercial/`QA-CANDIDATE-NOT-FOR-DEPLOYMENT`; runtime patch sets private policy flags true, enabling the server-omitted new-route host for controlled tests. Script verifies clean expected head/diff, applies with git apply --check/apply, records head/patch hashes and restores with git apply -R --check/-R. Unit fixtures test missing/mismatched targets; real commercial patch becomes usable after 5 creates the frozen release declaration. Command: `node scripts/prepare-sfc-candidate.mjs apply --kind=commercial` (or runtime, or combined), set exact endpoint and `SFC_TEST_MODE=candidate`, build/run mocks; restore with the same kind. Candidate worktree is isolated/never deployable; workflow verifier rejects QA markers/policy patches. 8 owns an analogous **runtime-closure patch** binding frozen optional factories on existing SPF pages so early measurement includes them, without claiming five-page rendered interaction.

Before committed commercial mode, contact-commercial projects exist **only** with SFC_TEST_MODE=candidate; new-route sfc-runtime cases likewise require the runtime/combined candidate. Default CI retains legacy runtime cases and demo/static tests, not a selected skipped commercial family. From 10 onward a dedicated candidate job applies fixtures in its disposable checkout, blocks unmocked provider traffic, runs nonzero implemented ES/EN commercial/runtime cases and restores in always cleanup. Reviewer R uses the same commands/fixture at the exact head. After 16 committed commercial tests need no mode patch, while runtime candidate tests still apply only the policy fixture until qualification. SFC_TEST_MODE selects tests, never application mode. Do not bypass server omission with a public host-mount test switch.

Current evidence: **2749 tests/31 files** from playwright test --list; PR #141 browser job succeeded in **51m59s** ([run](https://github.com/Furlanich/Portfolio/actions/runs/38623461245)), not an unmeasured >45-minute job. Task 2 adds four CI shards --shard=1/4…4/4 --workers=2, per-job target≤25min/hard35min; candidate job target≤20/hard30min. Measure real durations/counts at each wave; planning envelope default list≤3200, candidate≤180. Do not drop unique coverage or extend timeout to conceal failure; deduplicate equivalent assertions/shard based on evidence or amend the packet. Preserve existing engine coverage; new Firefox/WebKit cases use tagged cross-browser behavior smoke, Chromium owns exhaustive state permutations. All new page types/locales still cover real three-engine form/navigation/focus behavior.

Shared CI must trigger main **and** codex/sfc-integration PRs. Bootstrap PR2 with workflow_dispatch at its immutable head if necessary; human merge requires actual recorded checks. Upload shard/candidate reports and traces with `if:always()` and unique run/shard names, retention7 days. Local browser port `3200+task`, reviewer `3300+task`; own outputs per checkout, no reused server in export runs.

Baseline procedure for 6/7/9/10/14/16: keep deterministic visual-Chromium/reduced-motion capture and subjects defined in visual policy; capture/inspect Windows expected/actual/diff, obtain owner approval. Trigger CI at the **same head**; a missing Linux golden is an explicitly identified baseline-bootstrap failure, not GREEN acceptance. Download only corresponding `*-actual.png` from that run's named shard artifact, inspect each against approved rendering and commit under its exact Linux snapshot name. Rerun Windows/CI without bulk update; merge only when clean. Record hashes/run/head/owner decision. If any nonbaseline test also fails, repair it first. No renamed Windows image or image from another head. Live motion uses recordings/behavior, not unstable pixel goldens.

## Task 1 / PR 1 – Accept bounded governance and coordinated release

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high). **Dependencies:** revised independent plan review and owner execution authorization. **Concurrency wave:** W0.
- **Owned write paths:** `docs/rfcs/{studio-founder-contact-commercial-atlas-v1,index}.md`, target annotations in `docs/design/{visual-language,interaction-responsive-accessibility}.md`, `docs/product/pages/{studio-and-founder,contact-and-privacy,terms-and-conditions,home,services}.md`, `docs/product/{information-architecture,content-and-localization}.md`, `docs/governance/status-register.md`, acceptance `index.md`, `task-01.md`.
- **Forbidden/shared paths:** product/tests/deployment, immutable ADR bodies, master-plan substance. **Exclusive locks:** SFC-GOVERNANCE; no account/deploy action.
- **RED:** N/A, documentation only. No manufactured behavior test for prose.
- [ ] Accept the RFC via Governance PR to main, including Q16–18, staging strategy and supplemental inquiry reviewer; retain historical constraints until gated replacement.
- [ ] After human merge, create integration branch at that accepted SHA; record branch/CI bootstrap/merge rules. Start Samuel/counsel checklist immediately, without keeping an agent idle on external evidence.
- [ ] Verify docs/diff/traceability, obtain R/human merge; receipt names immutable base/branch and external gate owners.
- **Acceptance criteria:** governance and release targets accepted, no deployment fiction or secret; original ADRs immutable. **Verification:** docs:check, diff check, review. **Reviewer:** R + Samuel scope.

## Task 2 / PR 2 – Freeze interfaces, shared surfaces, export ownership and CI

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 1. **Concurrency wave:** W1.
- **Owned write paths:** `lib/connected-studio/{types,media-manifest}.ts`, `components/connected-studio/ConnectedStudioGround.tsx` and compatibility-only `components/connected-studio/{ConnectedStudioEnhancement.tsx,runtime/connected-labels.ts}`; `components/surfaces/{AtlasPlate.tsx,surfaces.module.css,AtlasScrim.tsx,AtlasEditorialContainer.tsx}`; `playwright.config.ts`, `.github/workflows/ci.yml`, `tsconfig.json` exclusion only; `tests/types/sfc-ground.ts`, `tests/e2e/support/{paths,connected-studio-test-hooks}.ts`, `tests/e2e/{studio-founder,studio-founder-responsive,studio,studio-responsive,founder,founder-responsive}.spec.ts`; `scripts/{foundation-content,founder-content,connected-studio-media,connected-studio-harness,sfc-contracts,sfc-ci-budget}.test.mjs`, `scripts/verify-static-export.mjs`, `scripts/verify-static-export.test.mjs` only fixture infrastructure, `scripts/export-requirements/{studio,founder,contact,privacy,home,services}.mjs`, `scripts/export-test-support.mjs`, `scripts/prepare-sfc-candidate.mjs`, `tests/fixtures/sfc/{commercial-release,live-policy}.patch`; `docs/testing/{playwright,visual-regression}.md`, new `docs/decisions/studio-founder-contact-commercial-atlas.md`/index, `task-02.md`.
- **Forbidden/shared paths:** no physics/transport/route layout, published image or live flag. Shared material default unchanged. **Exclusive locks:** SFC-CONTRACTS, SFC-CI; browser lock for discovery.
- **RED:** pure `getConnectedPoster('studio','wide')` must produce unpublished correct-path entry; typed new-route props must compile. No Node JSX render assertion. Harness must discover partitioned specs/projects; current config fails. Compiler discovery must exclude an ignored worktree fixture; current tsconfig lacks that exclusion.
- [ ] Observe contract/discovery REDs, declare frozen types/static adapters and six unpublished entries. Build shared visual variants from approved/accepted spec; styling judged by later renderings, not CSS-string tests.
- [ ] Extract exact verifier maps, preserving shared checks/current behavior. Move page-specific source/structure cases into their owner files; inventory old/new cases and prove no deletion. Preserve unrelated Home tests.
- [ ] Implement candidate fixture/scripts and CI project selection/shards/artifact/bootstrap rules. Test apply/restore/mismatch/QA-marker behavior first; no automatic live request. Record projected list counts and real first sharded durations.
- [ ] Record accepted RFC in **ADR-SFC-COMMERCIAL-ATLAS-V1** after PR1 acceptance; run validate, discovery, current root/base export verifier and focused tests. Commit/review into integration.
- **Acceptance criteria:** frozen interfaces/primitives; feasible test ownership; reproducible candidate; CI within budget; static new Ground contract safe; no claims of new-page rendered evidence yet. **Verification:** Node owned suites, typecheck, --list, npm run validate + clean root/base export. **Reviewer:** R.

## Task 3 / PR 3 – Establish early performance and critical-route baselines

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 2. **Concurrency wave:** W1.5.
- **Owned write paths:** `scripts/{measure-connected-studio-production,measure-connected-studio-vitals,measure-connected-studio-hardware}.mjs`, `lib/connected-studio/measurement.ts`, `scripts/connected-studio-measurement.test.mjs`, `docs/reviews/studio-founder-contact-acceptance-v1/risk-baseline.md`, `task-03.md`.
- **Forbidden/shared paths:** product model/engine/host, form/legal activation; no inferred hardware PASS or tail fix. **Exclusive locks:** SFC-MEASUREMENT, SFC-BROWSER-GPU; named operator/device evidence only.
- **RED:** any new collector fields must reject absent samples/profile and CPU-time-as-frame-interval fixtures before implementation. Documentation/diagnosis itself N/A.
- [ ] Record existing 114.4KiB/headroom, all valid historical failed runs, and current cold JS/evaluation/hydration baseline for new reading/intake/legal routes at root/base with the same dependency versions.
- [ ] Apply systematic-debugging to the existing SPF presentation tail now: isolate scheduler/CPU/GPU/presentation timing with injected evidence/current scripts, retain hypotheses/traces and identify the next disambiguating trace. No blind scheduler rewrite.
- [ ] Run a named physical desktop baseline if available; missing device/metric remains OPEN. Assign any demonstrated corrective behavior to the later exact owner or a new remediation packet, with RED. No counsel prerequisite, no business-release blockage from missing hardware.
- **Acceptance criteria:** reproducible baseline/method, risk and earliest actionable diagnosis recorded; not a qualification verdict. **Verification:** collector fixtures, existing measurement scripts, docs:check/validate as scoped. **Reviewer:** R; owner attests device metadata.

## Task 4 / PR 4 – Implement the pure projection, profiles and inertial physics

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 2,3. **Concurrency wave:** W2.
- **Owned write paths:** new `lib/connected-studio/{projection,rest-path,profiles,interaction}.ts`, `lib/connected-studio/{model,controller,frame-scheduler}.ts`; `scripts/{connected-studio-model,connected-studio-controller,connected-studio-frame-scheduler,connected-studio-projection,connected-studio-rest-path,connected-studio-profiles,connected-studio-interaction}.test.mjs`, `task-04.md`.
- **Forbidden/shared paths:** types/host/runtime/page/copy/policy/assets; no DOM/Three import. **Exclusive locks:** SFC-PURE-MODEL.
- **RED:** randomized CSS↔anchor round trips/camera/crop across tiers and DPR1/1.5/2 must agree; current shared pure seam absent. Pin Atlas identity scaling and unchanged legacy fit/depth. Physics fixtures assert exact topology, projected anchors, radius/nearest-five, 34/24/14 travel, zero Contact node offsets, pinned seven-sample strings/caps 16/10/6/4 and 60/120Hz max checkpoint difference≤1.5px.
- [ ] Obtain assertion REDs using compiling declared interfaces, then extract pure camera/layout/rest-path math and implement profile data exactly. Pin legacy quadratic samples/control/signs across tiers/crop, Atlas straight rest and identical endpoints at s=0/1. No copied second projection or bow. Controller resolves poster/native frame once, interaction applies CSS caps in that frame, final pose carries it to runtime/labels.
- [ ] RED pointer stop/exit/interruption retaining momentum, no repeated stationary impulse, direct edge bend, nonrecursive neighbor share, rendered interpolation cap, bounds/nonfinite/coincident endpoints/resize/jumps and ≤50ms hidden gap. New profiles use fixed rest/full edges; legacy chapter pose/growth remains base.
- [ ] RED string/node settling and clock/scheduler counts: new Atlas pendingCallbacks0 at rest; legacy targetFps30/20 ambient; active≤60; pause/suspend/dispose no callbacks/stale generation. Minimal GREEN, then refactor allocation/time invariance.
- **Acceptance criteria:** one pure projection/inverse/crop authority, stable finite pinned strings and caps, preserved legacy behavior, deterministic sleep/inertia. **Verification:** owned Node suites, npm run validate; no browser/hardware claim. **Reviewer:** R, units/timing/projection.

## Task 5 / PR 5 – Harden inquiry transport, configuration and request identity

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high). **Dependencies:** 2,3. **Concurrency wave:** W2.
- **Owned write paths:** `lib/inquiry/{contracts,validation,formspree,demo}.ts`, new `lib/inquiry/{configuration,release,submission-controller}.ts`, `components/contact/state.ts`, `scripts/{inquiry-validation,formspree-adapter,demo-inquiry-adapter,contact-state,inquiry-configuration,inquiry-submission-controller}.test.mjs`, `task-05.md`.
- **Forbidden/shared paths:** form markup/copy, host/physics/workflow/public mode. release.ts remains demonstration and matches the frozen candidate fixture. **Exclusive locks:** SFC-INQUIRY-PORT; no live requests.
- **RED:** commercial rejects missing/wrong endpoint, credentials/query/fragment/nonstandard port; demo needs no endpoint. Actual trap reaches `_gotcha`; entire JSON body≤24KiB; timeout includes JSON parsing; only 2xx/ok:true accepts. Deferred calls: same-tick submit calls.length1; stale success/failure/field error cannot replace a newer request; disposal aborts/ignores.
- [ ] Run correct REDs; implement the exact configuration/context/port/controller seam with synchronous lock/sequence and cancellation; retain demo zero transmission/reserved failure. Do not expose a mode toggle or enable from environment alone.
- [ ] RED Unicode/multiline code-point limits, provider field/code allowlists, 429/config/5xx/network/timeout/malformed response, thrown submitter, explicit retry and accepted-only reset contract. Never display provider HTML/prose or lose values/lock on rejection. Abort is not proof of server nonreceipt.
- [ ] GREEN/refactor; run all inquiry/state suites and validate. Confirm candidate apply/restore against the real frozen release file now. Commit/review into integration.
- **Acceptance criteria:** no false acceptance/autosend/log/storage; exact endpoint and race-safe transport; demo remains independently testable. **Verification:** Node mocks only, npm run validate. **Reviewer:** R + independent Sonnet 5.5 High supplemental inquiry review.

## Task 6 / PR 6 – Build the accountability Studio Atlas

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high). **Dependencies:** 2,3. **Concurrency wave:** W2.
- **Owned write paths:** `components/studio/{StudioPage,StudioIntroduction,StudioAccountability,StudioPrinciples,StudioFounderBridge,StudioFinalCta}.tsx`, `components/studio/content-types.ts`, new `components/studio/studio.module.css`; `app/(es)/{estudio/page.tsx,_content/studio.ts}`, `app/(en)/en/{about/page.tsx,_content/studio.ts}`; `scripts/{studio-content,studio-export}.test.mjs`, `scripts/export-requirements/studio.mjs`; `tests/e2e/{studio,studio-responsive}.spec.ts`, `tests/e2e/visual/studio.visual.spec.ts`/its snapshot directory, `task-06.md`.
- **Forbidden/shared paths:** Founder/shared surfaces/defaults/host/verifier body/global materials/navigation. **Exclusive locks:** SFC-STUDIO, browser/capture as needed.
- **RED:** semantic sequence/full content/one Founder bridge and localized actions; exact Q18 software H1, word bindings n0/n4/n8/n12. Existing page order and duplicated operating presentation fail. Update only Studio's extracted export expectations and fixture failures before production behavior.
- [ ] Implement selected complete copy/source order using W1 editorial container/plate/scrim; keep both intro actions and the exact Pause slot/static label. Static Ground rendered check belongs here: no missing-image requests while unpublished, no-JS complete HTML and links.
- [ ] Keep demo-dependent final sentence/action wording until atomic selection in 16, even on the nondeployed staging build. No résumé/process catalogue, abbreviated content or invented claims.
- [ ] Verify both locales at five widths/zoom/text spacing, focus/contrast and approved references; run defined Taste/Impeccable audits. Apply baseline workflow, then semantic/browser/Node and **clean root/base build + verify:static-export** before review.
- **Acceptance criteria:** deliberate Studio hierarchy/complete accountability, opaque readable surfaces, exact shared geometry, honest stage copy and passing whole-export checks. **Verification:** owned suites, cross-browser smoke/responsive/visual evidence, npm run validate and export checks. **Reviewer:** R + owner visual/baseline approval.

## Task 7 / PR 7 – Build the complete text-led Founder Atlas

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high). **Dependencies:** 2,3. **Concurrency wave:** W3.
- **Owned write paths:** `components/founder/{FounderPage,FounderHeader,FounderProfessionalLinks,FounderProfessionalHistory,FounderCapabilities,FounderProjectsBridge,FounderFinalCta}.tsx`, content-types/new founder.module.css; `app/(es)/{estudio/samuel-furlanich/page.tsx,_content/founder.ts}`, `app/(en)/en/{about/samuel-furlanich/page.tsx,_content/founder.ts}`; `scripts/{founder-content,founder-export}.test.mjs`, `scripts/export-requirements/founder.mjs`; `tests/e2e/{founder,founder-responsive}.spec.ts`, Founder visual spec/snapshot directory, `task-07.md`.
- **Forbidden/shared paths:** Studio/shared surface implementation/host, CV binary rewrite, general foundation assertions/verifier. **Exclusive locks:** SFC-FOUNDER and browser/capture.
- **RED:** complete three-paragraph bio before CV/LinkedIn/GitHub, then both jobs/internship/education/MPC/four capabilities/evidence. Current order/old capability heading fails; separate Founder export/source tests now own those assertions.
- [ ] Use shared primitives for the two ≤800px continuous plates, right-aligned later plate at wide and equal edge below1024; professional links follow bio, Pause follows links in that plate. No portrait/empty image column, clamping, ratings, employer timeline or duplicated project catalogue.
- [ ] Bind .NET/React/Next.js/Blazor by node ID; preserve approved facts/URLs and demo-dependent ending until16. Verify natural link/name wrapping and full content at all five widths/zoom/text spacing/no-JS.
- [ ] Verify CV response/PDF signature/content type/download filename in root/base export and external URLs without replacing sign-in destinations. Follow audit/baseline workflow; validate, browser/content/export suites and clean root/base verifier.
- **Acceptance criteria:** complete professional depth, clear commercial bridge, preserved evidence/privacy boundaries; no export red interval. **Verification:** exact owned suites plus full deterministic/export checks. **Reviewer:** R + owner visual/baseline approval.

## Task 8 / PR 8 – Render pooled flexible paths and measure closure early

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 4. **Concurrency wave:** W3.
- **Owned write paths:** `components/connected-studio/runtime/{create-connected-scene,connected-geometry,connected-labels,connected-projection,dispose-connected-scene,connected-paths}.ts`; `scripts/{connected-studio-engine,connected-studio-paths}.test.mjs`, `tests/fixtures/sfc/runtime-closure.patch`, `task-08.md`.
- **Forbidden/shared paths:** pure projection/profiles/controller, host/input/page/policy/media or new test routes. **Exclusive locks:** SFC-ENGINE; measurement lock for early closure candidate.
- **RED:** injected renderer/buffer probes require pinned endpoints/five interior samples, bounded cubic residuals, growth/tracer on deformed path, finite coincident endpoints, identical legacy quadratic rest when residuals are absent, stable resources/draw counts and idempotent teardown. Runtime's current independent projection/rigid path fails.
- [ ] GREEN batched ≤12-segment paths; preserve SPF proportions/thickness/tracers and its existing rest bow (PATH_BOW0.16) through the shared pure rest evaluator, adding only bounded cubic residuals. Atlas uses straight rest edges. Consume final projectionLayout/pure fallback for paths/labels; no duplicate scaling/bow. Reexport optional pure factories.
- [ ] RED repeated resize/render/dispose retaining only needed resources; refactor pooled buffers, no per-frame meshes/materials/tubes or per-edge draw expansion. This packet's acceptance is **Node engine/path probes**; no five-page live browser evidence before the host exists.
- [ ] Apply committed early closure fixture in isolated candidate: complete profiles/interaction/controller/paths included through frozen entry. Run emitted closure/current production script. **>118KiB is a headroom warning**, requiring an explicit measured mitigation/ownership decision before further performance-sensitive changes; it is not a new owner-approved ceiling. >120KiB is live-qualification FAIL; preserve ≤120 final, no critical-chunk evasion. Open a bounded remediation packet for demonstrated excess. Code/diagnostic acceptance and safely policy-disabled form/static work can proceed; the warning cannot recreate a hardware/optional gate on commercial release. Record assumptions instead of blind fidelity expansion.
- **Acceptance criteria:** correct deterministic buffers/projection/resource contracts and explicit early closure decision; no infeasible rendered requirement. **Verification:** engine/path suites, validate, early isolated build/closure (software/runtime metrics not hardware). **Reviewer:** R.

## Task 9 / PR 9 – Build the quiet legal template and canonical draft contracts

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high). **Dependencies:** 2. **Concurrency wave:** W3.
- **Owned write paths:** new `components/legal/{LegalPage.tsx,content-types.ts,legal.module.css}`, `components/privacy/{PrivacyPage.tsx,content-types.ts}`; `app/(es)/_content/commercial/{privacy,terms}.ts`, corresponding `app/(en)/en/_content/commercial/{privacy,terms}.ts`; `scripts/{legal-content,privacy-content,privacy-route}.test.mjs`, new `scripts/sfc-copy-contracts.mjs`/test; `scripts/export-requirements/privacy.mjs`; `tests/e2e/{privacy,legal}.spec.ts`, `tests/e2e/visual/legal.visual.spec.ts`/snapshot directory; canonical-public-copy sections only of `docs/product/pages/{contact-and-privacy,terms-and-conditions}.md`, `task-09.md`.
- **Forbidden/shared paths:** no public Terms routes, Footer/route registry/mode, professionally unreviewed legal publication. Current Privacy remains honest demo data. **Exclusive locks:** SFC-LEGAL-TEMPLATE; browser/capture.
- **RED:** real current Privacy must gain ordinary TOC/unique anchors/complete no-JS sections/App-Bar-aware navigation. Canonical-copy contracts fail missing/different typed public field, paragraph, link/order; no Node JSX claim.
- [ ] Implement shared quiet Bone legal template, exact chrome copy from owners, compatibility wrapper with no invented demo date/absent Terms link. Stage original legal drafts privately with explicit nonpublishable metadata.
- [ ] Define bounded public-copy JSON fences in each Markdown owner; encode selected text faithfully, not a new legal authority. Compare complete typed exports to canonical structured strings; preserve order/punctuation/links, normalize CRLF only. Final professionally reviewed public fences replace draft status in13; original draft history remains traceable.
- [ ] Update only Privacy export requirements for current template, preserve no-transmission facts. Run three-engine TOC/no-JS/locale/keyboard, responsive/axe/visual audits, baseline workflow, validate/root/base export.
- **Acceptance criteria:** complete server reading surface, original gated bilingual drafts and exact canonical-to-code equivalence; no accidental new processor claim. **Verification:** legal/copy/privacy suites, actual export/browser checks. **Reviewer:** R; counsel review in13.

## Task 10 / PR 10 – Integrate native, accessible real-flow Contact behavior

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high). **Dependencies:** 5,9. **Concurrency wave:** W4.
- **Owned write paths:** `components/contact/{ContactPage,ContactForm}.tsx`, content-types/new contact.module.css; `app/(es)/{contacto/page.tsx,_content/contact.ts,_content/commercial/contact.ts}`, corresponding English contact files; `scripts/{contact-content,contact-route,contact-export}.test.mjs`, `scripts/export-requirements/contact.mjs`; `tests/e2e/{contact,contact-commercial}.spec.ts`, Contact visual spec/snapshot directory, `task-10.md`.
- **Forbidden/shared paths:** state/ports/config factories from5, shared primitives/legal data/host/workflow/mode activation. **Exclusive locks:** SFC-CONTACT-UI, isolated candidate and browser/capture.
- **RED:** same-tick Enter/click one port call, actual trap, code-point input surviving native200/508/240/8000 bounds, first-invalid focus, accepted-only reset, failure value retention, cancellation/stale field errors. Valid keyboard submission must retain focus on busy submit, not body; global outcomes focus nonlive region once; invalid fields receive associated error focus.
- [ ] Observe REDs then consume coordinator/configured factory with actual hidden trap. Initial no-JS submit disabled/direct alternatives; after hydration fields-only disabled during busy, focusable aria-disabled submit/lock. Use the exact busy/result/field-error pattern specified above; no role=alert/live duplicate outcome or progress focus decoration.
- [ ] Implement exact state strings including Q18 success, request-too-large and classified uncertainty/retry; expose phase marker, preserve failure snapshots, abort unmount. Route selects mode-matched data; stage/default demo retains truthful notice/no absent Terms link; no public mode switch or extra field.
- [ ] Use W1 surfaces/820px tablet split/source order/Pause/static label. Run repeatable combined candidate (all Formspree requests blocked unless fulfilled) for each result class/locales; Node handles transport permutations, Chromium full DOM states, Firefox/WebKit essential validation/success/duplicate/failure/retry/focus/no-JS. Keep direct-channel URLs unprefilled.
- [ ] Validate actual Contact export requirements now, all responsive/keyboard/axe/visual audits and baselines; run clean root/base verifier, candidate CI and npm run validate, restore candidate.
- **Acceptance criteria:** accessible, truthful, race-safe tested commercial flow not publicly activated; no loss of input/focus, no real CI transmission. **Verification:** owned Node/browser/candidate suites, explicit screen-reader check, full deterministic/export checks. **Reviewer:** R + independent Sonnet 5.5 High supplemental inquiry review + owner visual/copy.

## Task 11 / PR 11 – Integrate cached input, projection and five-page lifecycle

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 4,6,7,8. **Concurrency wave:** W4.
- **Owned write paths:** `components/connected-studio/{ConnectedStudioEnhancement,ConnectedStudioGround,ConnectedPauseControl}.tsx`, connected-studio.module.css/new connected-input.ts; `lib/connected-studio/{labels,session}.ts`; `scripts/{connected-studio-host,connected-studio-labels,connected-studio-session}.test.mjs`; `tests/e2e/{connected-studio-runtime,connected-studio-navigation,connected-studio-responsive,sfc-runtime,sfc-accessibility}.spec.ts`, `task-11.md`.
- **Forbidden/shared paths:** Contact markup/state, model/projection/runtime bodies/media/policy, Home/shared App Bar. **Exclusive locks:** SFC-HOST, browser/GPU.
- **RED:** cached projected eligible proximity vs plate/scrim+8px exclusions; first re-entry no hidden velocity; form-signal fixture focus/busy→zero new stimulus/callbacks; no tap/textarea/anchor/history/resize replay. Frozen DOM fixture lets this packet run independently of10; actual Contact is verified by12.
- [ ] Integrate one gated optional entry and pure factories, route/node-ID labels, cached viewport/reading/plate boxes. No layout/elementFromPoint per node/input/frame, React frame state, second loop or static physics import. Server omits host on new policy-disabled routes; controlled candidate policy fixture supplies the host for tests, never a public test switch.
- [ ] RED preference/import races, reduced-motion/Save-Data/denied/software/session loss before import, runtime disposal, one renderer across Home/five routes/locales, zero hidden/Footer/offscreen callbacks, stable resources/listeners/labels and no hidden-time replay. Pause uses existing session keys/read-only Home flag and retains focused fallback control.
- [ ] Consume shared pure poster/native frame for input and labels/rendering; first draw matched, finite three-second settle/160ms fade only on success. New sleep vs SPF ambient, touch native scroll and exact masks remain intact.
- [ ] Run controlled runtime candidate and legacy regressions, unit/validate/export checks and defined Emil motion audit; preliminary rendered graph evidence here, complete all-five/actual Contact evidence in12. Both committed flags remain false.
- **Acceptance criteria:** single renderer/projection/time authority, low-cost cached eligibility, correct preference/session/mask/sleep and race-safe input; no fixture-only integration claim. **Verification:** unit/runtime/navigation/responsive/axe, critical-JS delta to3, npm run validate/export. **Reviewer:** R.

## Task 12 / PR 12 – Verify actual Contact integration and five rendered profiles

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 10,11. **Concurrency wave:** W4.5.
- **Owned write paths:** integration-only attributes/focus/phase in `components/contact/{ContactForm,ContactPage}.tsx`; `components/connected-studio/{ConnectedStudioEnhancement.tsx,connected-input.ts,connected-studio.module.css}`, `lib/connected-studio/labels.ts`; integration cases in `scripts/connected-studio-host.test.mjs`, `tests/e2e/{sfc-runtime,sfc-accessibility,contact-commercial}.spec.ts`; `task-12.md`.
- **Forbidden/shared paths:** copy, standalone layout, inquiry ports/model/engine/shared primitives and all other page files. Prior10/11 writers exited. **Exclusive locks:** SFC-INTEGRATION, SFC-BROWSER-GPU.
- **RED:** exercise actual Contact form, not W1 fixture: entering every field/submitting/textarea scroll disables/clears graph, focusout waits for next background input; semantic mask dimensions/no hidden excitation; keyboard busy/result focus and one renderer after locale/navigation. Reproduce any combined failure before fixing.
- [ ] In combined candidate with blocked provider traffic, run complete five-profile stationary/active/inertial states at wide/compact, including real Studio/Founder/Contact DOM. Capture curve pins/caps/masking and no-jitter stop; software evidence explicitly functional, not hardware.
- [ ] Repair only the bounded transferred integration seams through RED→GREEN→refactor; failures in another owner create a new remediation packet20+ and hold this checkpoint. Coordinator cannot fix source.
- [ ] Run actual-page Node/browser/axe/keyboard and defined Emil/Impeccable audits. Record input eligibility over plates/scrims, touch native behavior, phase suspension/Pause, preference/import/no-JS and renderer/resource cycles. Reverify baseline/export/validate.
- **Acceptance criteria:** combined real pages pass, named repair owner exists, five-profile rendered intent matches spec and inaccessible focus/states absent. **Verification:** combined candidate suites, screenshots/recordings/manual focus, validate/export. **Reviewer:** R + owner motion acceptance; missing manual screen-reader check remains explicit release gate.

## Task 13 / PR 13 – Close processor and Argentine legal readiness

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high), compiling facts only. **Dependencies:** 9,10 + human account/counsel evidence initiated in1; no host/hardware prerequisite. **Concurrency wave:** W5.
- **Owned write paths:** legal/operational/public-copy blocks in `docs/product/pages/{contact-and-privacy,terms-and-conditions}.md`; `app/(es)/_content/commercial/{contact,privacy,terms}.ts` and English equivalents; `scripts/{legal-content,sfc-copy-contracts}.test.mjs`; acceptance `{processor-readiness,legal-review}.md`, `readiness.json`, `task-13.md`.
- **Forbidden/shared paths:** no public route/mode/component/workflow activation; no credentials/inquiry body in Git or AI legal certification. **Exclusive locks:** SFC-LEGAL-COPY; Samuel's SFC-FORMSPREE-LIVE for labeled probes.
- **RED:** evidence collection N/A. Received approved public-string corrections first fail canonical/code equivalence; final publish readiness rejects unresolved markers/date/facts. Do not invent the expectation.
- [ ] Samuel opens existing `/f/meaqwnbr`, verifies control/active form/verified Gmail; Workflow has one notification to `samuelfurlanich@gmail.com`, submitter email Reply-To, no unapproved actions/autoresponders/integrations.
- [ ] Project Settings domain `furlanich.github.io` (no scheme/path); verify actual referrer. Workflow Validation required name text≤100, required email≤254, optional company≤120, required message≤4000, source/locale retained; verify Unicode/multiline. If Free lacks a needed control/semantics, record actual limitation and return policy issue, no silent paid upgrade.
- [ ] Record Spam/reCAPTCHA posture matching filtering+actual trap/domain with no challenge script/redirect. Verify Inbox/Spam/Over Limit/quota/reset/deletion. Samuel confirms business-day monitoring and 75% notice decision. Challenge/processor change reopens design; never exhaust Free allowance in tests.
- [ ] Counsel verifies identity/address, actual providers/subprocessors/countries/transfers, notice/consent, rights/authority, retention/exceptions and website-use Terms. Test feasibility of existing 30-day provider/12-month nonconverted mailbox targets; no history-as-erasure claim. Final ES/EN public fences are canonical counsel/owner-approved text/date; typed modules must deep-equal them.
- [ ] After these gates, prepare one reviewed manual browser-console fetch from existing approved `/Portfolio/contacto/` origin to exact endpoint with labeled synthetic four values, source/locale/_gotcha and JSON headers. Samuel enters test Reply-To privately; no forged Node origin. Verify acceptance/dashboard/Gmail/Reply-To/Unicode/multiline/deletion; safe support/config evidence for spam/quota. Extra probes individually bounded/owner-authorized. **This is a provider probe, not the new deployed form.**
- [ ] Create owner-attested readiness.json: schemaVersion1/releaseId/approval dates/receipt paths, hashes of canonical public blocks and all six typed commercial modules; verifier requires equivalence as well as hashes. Sensitive counsel advice may remain private with a dated redacted disposition. Run copy/legal tests, docs/validate and review.
- **Acceptance criteria:** no publication-critical legal/account fact unresolved; original final bilingual text, explicit operations and distinct predeployment probe receipt. **Verification:** canonical equivalence/hashes, redacted owner/counsel receipts, Node/docs/validate. **Reviewer:** R for fidelity, Samuel/counsel for actual facts/sufficiency. Missing evidence leaves task inactive WAITING_HUMAN, not a guessing agent.

## Task 14 / PR 14 – Publish matched static posters and verify release costs

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 4,6,7,8,10,11,12; **not13**. **Concurrency wave:** W5.
- **Owned write paths:** `scripts/capture-connected-studio-posters.mjs`, production/vitals collectors transferred from3, `lib/connected-studio/{media-manifest,measurement}.ts`, `scripts/{connected-studio-media,connected-studio-measurement}.test.mjs`; `tests/e2e/{connected-studio-production,sfc-production,connected-studio-static}.spec.ts`; connected-static/sfc-static visual specs and their snapshot directories; six `public/brand/connected-studio/{studio,founder,contact}-{wide,compact}.webp`; `task-14.md`.
- **Forbidden/shared paths:** hardware qualifier/verdict, policy/physics/host/product/legal changes or identical page art. No13 data/receipt writes. **Exclusive locks:** SFC-POSTERS, SFC-MEASUREMENT, browser/GPU; other builds wait during collection.
- **RED:** media/static tests expect correct six unpublished files/bytes/dimensions/responsive requests and matched projection; publication false until actual assets exist. New-route cold-JS/hydration/vitals fixtures reject missing baseline/values or optional bytes hidden in critical code.
- [ ] Capture each actual production rest profile at zero excitation/displacement, label-free; CSS capture1920×1080/450×800, existing cover alignment, manifest dimensions match encoded output. New meanings differ. Preserve legacy rest path/projection/posters; a required legacy recapture returns with an explicit packet/owner review.
- [ ] Prove ≤150/80KiB, responsive variant only, CSS fallback on image failure, first-live paint match. Apply inspected Windows/Linux baseline workflow; no placeholder asset or premature manifest publication.
- [ ] Measure actual static release first-load JS/startup/vitals/CLS against3 for all new routes/locales, root/base. Record full optional closure and draw/DPR candidate metrics as qualification inputs, **not a hardware release prerequisite**. If inactive optional engine exceeds its live budget, it cannot qualify; static/commercial release is allowed only with policy-disabled new-route host/no optional request and passing static/critical budgets.
- [ ] Run capture/media/measurement contracts, served-export proof, validate and static/production measurement scripts. Record pass/fail/OPEN precisely; no actual account send or counsel wait.
- **Acceptance criteria:** six distinct matched images, static reading/intake performance and export gates PASS, optional readiness honestly reported. **Verification:** image files/bytes/requests, emitted closures, five cold journeys/profile, root/base browser/export/validate. **Reviewer:** R + owner poster/baseline approval. Physical hardware does not gate this packet.

## Task 15 / PR 15 – Qualify graph tiers on actual hardware independently

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high), measurement/evidence only. **Dependencies:** 12,14; no13/16 gate. **Concurrency wave:** W6-H; may collect after17 if external device/operator unavailable, with recorded released-main base.
- **Owned write paths:** `scripts/measure-connected-studio-hardware.mjs` and measurement fixtures only, `docs/reviews/studio-founder-contact-acceptance-v1/hardware-protocol.md`, `task-15.md`. No product correction is owned; a measured defect uses a new remediation packet.
- **Forbidden/shared paths:** product/flags/fidelity/budget change, legal/data-flow statements or reused invalid passing runs. **Exclusive locks:** SFC-MEASUREMENT + SFC-BROWSER-GPU; all other heavy work stopped, isolated hardware candidate/no software override.
- **RED:** new protocol/collector behavior first fails fixtures for absent rows/profiles, CPU-time mislabeled frame interval, zero samples, false zero CLS or software renderer. Pure receipt collection N/A.
- [ ] Record physical desktop/constrained Android names, OS/browser/GPU/refresh, head/build/patch/method before collecting all five ES/EN pairs. At least three valid active runs/route/tier; retain every run/failure, no cherry-picking or desktop-as-phone substitution.
- [ ] Measure traversals/stationary tails/scroll/form focus/busy/Pause/hidden/Footer, five route/locale cycles and sustained use. Judge closure≤120, draw/DPR, active frame-interval p95≤20ms, task<50ms, vitals/zero enhancement CLS, rest/ambient/zero callbacks and resource baseline. Unavailable metric is OPEN, not zero.
- [ ] Apply systematic-debugging to a failure, separating scheduling/CPU/GPU/presentation; report measured options without weakening fidelity/caps. A repair has a new exact owner/RED/reviewer then recollection at its head. Both intended tiers must qualify or remain explicit unfinished objectives.
- **Acceptance criteria:** honest tier-by-tier PASS/FAIL/OPEN dossier; qualifier PASS is required only for18, never16. Evidence PR may record failure; that does not satisfy live acceptance or complete the plan. **Verification:** protocol/fixtures, full raw valid runs/method, redacted receipt. **Reviewer:** R + named device operator/owner acceptance.

## Task 16 / PR 16 – Release the coherent commercial redesign atomically

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 1–14 human-merged integration/governance; **not15**. **Concurrency wave:** W7, no simultaneous local hardware collection.
- **Owned write paths:** `lib/{site-routes,foundation-navigation}.ts`, `lib/inquiry/{release,configuration}.ts`; `components/foundation/{SiteFooter.tsx,footer-content.ts,content-types.ts}`; Contact page/form only final mode/legal-link wiring; ES/EN Contact/Privacy routes/content and Home/Services consistency data; Studio/Founder ending data only `app/(es)/_content/{studio,founder}.ts`, English equivalents; new ES/EN Terms routes; `.github/workflows/deploy.yml`; shared verifier/global route/Footer/release tests, `scripts/export-requirements/{contact,privacy,home,services,terms}.mjs`; new verify-inquiry-release.mjs/inquiry-release.test.mjs; `tests/e2e/support/paths.ts`, smoke/navigation/Services/Footer/Contact/Privacy/legal/production/accessibility release cases and final Contact/legal/Footer visual specs/snapshot directories; `task-16.md`. Explicit full paths are listed in the ownership appendix below.
- **Forbidden/shared paths:** live flags, graph/model/engine, other page-layout repairs, substantive final legal rewriting or new social/sitemap initiative. Inherited staging changes are reviewed in this PR but not silently editable by16. **Exclusive locks:** SFC-RELEASE-CONFIG, SFC-ROUTES-FOOTER, browser; Samuel controls deploy/live locks.
- **RED:** expect Terms route/metadata/equivalents/sixteen actual docs and retired404s; commercial cannot retain demo Privacy/CTA strings or changed canonical/hash/receipt/QA marker. Current default14-route demo fails these assertions; retain explicit demo transport contract.
- [ ] Fork accepted integration head; wire final reviewed Contact/Privacy/Terms, exact Home/Services consistency and all Studio/Founder demo-dependent changes in **one** release commit/build. Add Terms Footer utility label without touching every old Footer prop object; preserve primary navigation/protected mark/fragments. Commercial is explicit committed release, not environment-only.
- [ ] Verify releaseId/readiness canonical blocks and typed hashes/equivalence; allow only exact public endpoint supplied via workflow `NEXT_PUBLIC_FORMSPREE_ENDPOINT`. Deployment rejects candidate marker/diff/policy patch, absent receipt, draft/unmatched public strings; ordinary commercial build rejects missing endpoint. No reused candidate out/ or public toggle; both policy flags false unless separately qualified via18.
- [ ] Run full validate, clean root and /Portfolio build/export, production Chromium/Firefox/WebKit journeys, responsive/zoom/text-spacing/forced-colors/prefers-contrast/reduced-motion/axe/manual screen readers and final visual/Skill audits. All real provider traffic mocked. Recheck static critical/vitals and complete Contact-host combined behavior; final optional/hardware facts remain classified under15/18.
- [ ] Prepare tested whole-release rollback to the prior coherent public SHA/export, matching demo mode/copy and previous Terms absence. Hold human merge until Samuel is ready for17's immediate receipt window/account access/allowance. R reviews **entire** combined main diff, producer receipts and all release gates; human merge deploys the complete redesign once.
- **Acceptance criteria:** coherent final commercial candidate and static public composition, final legal/account gates closed, no mixed notices/unfinished posters, rollback/operator ready. Hardware FAIL/OPEN does not block this release while graphs stay safely static. **Verification:** full deterministic/export/browser/manual/visual matrix; no deployed delivery claim before17. **Reviewer:** R + Samuel release authorization + counsel wording reference.

## Task 17 / PR 17 – Verify actual deployed intake and operational recovery

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high); Samuel does authenticated/live actions. **Dependencies:** 16 deployment; operator prepared before merge. **Concurrency wave:** W8.
- **Owned write paths:** acceptance `{deployed-inquiry,operations,release-checkpoint}.md`, `task-17.md`, verified current-state sections of `ARCHITECTURE.md`/`docs/product/pages/contact-and-privacy.md`.
- **Forbidden/shared paths:** product hotfix/account credentials/body content, CI real inquiries or graph policy. **Exclusive locks:** Samuel's SFC-DEPLOY/SFC-FORMSPREE-LIVE, browser for operator checks.
- **RED:** N/A receipts-only; record actual PASS/FAIL/OPEN. Product correction requires its own remediation/TDD/review.
- [ ] Within prepared30-minute observation window, Samuel submits one labeled synthetic inquiry from each actual deployed locale and checks acceptance/dashboard/Gmail/Reply-To, four-field Unicode/multiline integrity and source/locale. Success copy is Q18 acceptance-only. Provider probe13 is a different receipt.
- [ ] Verify active-copy deletion in Inbox/Spam/Over Limit/Gmail as applicable, approved exceptions/log-backup limitations, matching public Privacy/Terms/locales/direct channels/no-JS and no draft/demo falsehood. Record dates/outcomes, not messages/credentials.
- [ ] On contradicting acceptance/delivery/integrity/disclosure/deletion failure, freeze probes and execute prepared **human-controlled whole PR16 rollback**. Restore coherent demo/disclosures/previous Terms state; do not erase already-received-data history or claim rollback deletes it. Confirm previous public build and assign root issue/remediation. Checkpoint FAIL blocks18/overall completion.
- [ ] On PASS confirm Samuel's business-day quota/Spam/Over Limit/inbox monitoring, 75% response and approved retention runbook. R independently checks public read-only facts without an extra inquiry; docs/diff/receipt PR to main.
- **Acceptance criteria:** two genuine deployed-locale delivery/deletion receipts and operational owner/recovery; no local/console probe mislabeled E2E. **Verification:** redacted live/manual observations + deployed read-only smoke/docs. **Reviewer:** R + Samuel; counsel if actual facts change disclosure.

## Task 18 / PR 18 – Enable qualified graph tiers and verify final behavior

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** Claude Sonnet 5.5 High (`claude-sonnet-5-5`, high). **Dependencies:** 15 PASS for proposed tier(s),16,17 PASS. **Concurrency wave:** W9.
- **Owned write paths:** `lib/connected-studio/capability.ts`, capability tests, final production/runtime/accessibility policy cases, `task-18.md`; exact test paths in appendix. No master-plan/index/status write transfer to Claude.
- **Forbidden/shared paths:** unqualified tier, fidelity/threshold change, inquiry/copy/provider changes or old-evidence acceptance. **Exclusive locks:** SFC-LIVE-POLICY, browser/measurement; human SFC-DEPLOY.
- **RED:** only after named all-five-route final evidence passes, assert eligible flag true, unqualified flag false; preference/denied/software/context-loss remains static/no optional request. Current false policy fails eligible assertion.
- [ ] Rebase released main and requalify any changed final-code/static-cost delta, actual input/rest/Pause/form preference/navigation/resource behavior. Enable only proven tier flags minimal GREEN; no environment/query hook in production. Any remaining target tier stays OPEN; a later enablement has a new numbered packet20+ rather than sharing this closed packet.
- [ ] Run full validate/root/base export/three-engine behavior/responsive/axe/manual matrix, actual hardware/vitals/closure, Motion/Taste/Impeccable final audits and owner rendered acceptance. Confirm server now mounts only qualified new-route host, no regression in static paths.
- [ ] R/human bounded enablement merge; deployed read-only graph/fallback smoke, no additional inquiry unless actual intake behavior changed. Supply complete evidence to planning authority19; do not edit the master plan or declare static fallback completion.
- **Acceptance criteria:** qualified tier(s) correctly live with measured approved strings/input and complete fallback; unfinished tier/objective explicitly OPEN. **Verification:** fresh full suite/measurements/manual/visual receipts, verification-before-completion/pr-readiness. **Reviewer:** R + owner hardware/rendered acceptance.

## Task 19 / PR 19 – Close knowledge and acceptance through the planning authority

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

- **Provider/model:** OpenAI GPT-6 Luna High (`gpt-6-luna`, high), **planning-authority documentation role only**. **Dependencies:** all required commercial/interactive acceptance,16/17/18 and any20+ remediation; or explicitly reviewed owner-amended target. **Concurrency wave:** W10, all source writers stopped.
- **Owned write paths:** acceptance index/task-19, `ARCHITECTURE.md` current facts, `docs/design/{index,studio-founder-contact-v1}.md` current status, `docs/testing/{playwright,visual-regression}.md`, `docs/product/site-feature-catalogue.md`, `docs/governance/status-register.md`, `docs/index.md`, `docs/plans/index.md`; master-plan **progress/status only** and eventual move to `docs/plans/completed/studio-founder-contact-v1.md`.
- **Forbidden/shared paths:** product code, legal sufficiency invention, plan substance rewrite or retroactive old deferral acceptance. Coordinator transfers only these metadata paths at quiescence; Claude never authors master-plan closure.
- **Exclusive locks:** SFC-KNOWLEDGE-CLOSEOUT. **RED:** N/A documentation only; no fabricated green result.
- [ ] Reconcile every PR/head/receipt and independent/human acceptance; synchronize actual current architecture/design/testing/status/feature facts. Preserve immutable ADR/review histories and prior OPEN items.
- [ ] If any intended interactive tier, legal/data-flow receipt or manual acceptance is missing, leave plan ACTIVE with exact OPEN gate and author a needed follow-up packet; do not complete it for static-only success.
- [ ] After full acceptance, update progress/status and move completed plan, fix dependent links, docs/diff check and review the complete branch. Human final documentation merge; no source deployment change.
- **Acceptance criteria:** accurate durable closure, complete traceability and no role conflict; conditional prerequisites genuinely satisfied. **Verification:** docs:check/diff/full acceptance checklist; existing fresh source verification references, no redundant benchmark for prose. **Reviewer:** R + owner final acceptance.

## Ownership appendix for shorthand packet paths

Directory-local shorthand above is closed, not permission to edit a whole family. Exact expansions:

- Task7: `components/founder/content-types.ts`, `components/founder/founder.module.css`, `tests/e2e/visual/founder.visual.spec.ts`, `tests/e2e/visual/founder.visual.spec.ts-snapshots/**`.
- Task10: `components/contact/content-types.ts`, `components/contact/contact.module.css`, `app/(en)/en/{contact/page.tsx,_content/contact.ts,_content/commercial/contact.ts}`, `tests/e2e/visual/contact.visual.spec.ts`, its `-snapshots/**` directory.
- Task9: `app/(en)/en/_content/commercial/{privacy,terms}.ts`; Task13: both locale `_content/commercial/{contact,privacy,terms}.ts` paths. Any named acceptance basename/task-NN is under `docs/reviews/studio-founder-contact-acceptance-v1/`.
- Task14: `scripts/{measure-connected-studio-production,measure-connected-studio-vitals}.mjs`, `tests/e2e/visual/{connected-studio-static,sfc-static}.visual.spec.ts`, only their respective `-snapshots/**` directories.
- Task16: `components/contact/{ContactPage,ContactForm}.tsx`; `app/(es)/{contacto/page.tsx,privacidad/page.tsx,_content/contact.ts,_content/privacy.ts,_content/home.ts,_content/services.ts,_content/studio.ts,_content/founder.ts,terminos/page.tsx}`; `app/(en)/en/{contact/page.tsx,privacy/page.tsx,_content/contact.ts,_content/privacy.ts,_content/home.ts,_content/services.ts,_content/studio.ts,_content/founder.ts,terms/page.tsx}`; `scripts/{verify-static-export.mjs,verify-static-export.test.mjs,site-routes.test.mjs,foundation-route.test.mjs,foundation-content.test.mjs,site-footer.test.mjs,contact-route.test.mjs,contact-content.test.mjs,privacy-route.test.mjs,privacy-content.test.mjs,homepage-content.test.mjs,services-content.test.mjs,verify-inquiry-release.mjs,inquiry-release.test.mjs}`; `tests/e2e/{smoke,marketing-services,marketing-navigation,connected-studio-services,connected-studio-footer,privacy,contact,contact-commercial,legal,sfc-production,accessibility,sfc-accessibility}.spec.ts`; `tests/e2e/visual/{contact,legal,connected-studio-footer}.visual.spec.ts` and only corresponding snapshot directories.
- Task18: `scripts/connected-studio-capability.test.mjs`, `tests/e2e/{connected-studio-production,sfc-production,sfc-runtime,sfc-accessibility}.spec.ts`.
- Task6/9 visuals own only their named visual spec and matching `-snapshots/**`; no shared/all-image baseline write permission. Task2 acceptance ADR index is exactly `docs/decisions/index.md`.

## Skills wired to concrete questions and receipts

Skills guide work under repository authority; they do not invent product decisions. Use architecture-governance/knowledge-maintenance for target/current-fact updates; frontend-implementation/TDD/Playwright/visual-qa for relevant public work; verification-before-completion/pr-readiness at each packet. Read installed Next guides before Next-sensitive code. Every behavior: **RED → confirm intended assertion failure → minimal GREEN → refactor → rerun**. A missing module/setup error alone is not a behavior RED; provide a compiling seam and assertion before implementation. Pure styling uses approved specs/rendered evidence, never Tailwind/class/line-count assertions.

| Skill / timing | Question / mandatory receipt output |
| --- | --- |
| Taste v1, before visual construction6/7/9/10 and after rendered QA12/16/18 | Does hierarchy/material/spacing/readability serve this page under approved tokens? Record viewport/element/reference, severity, proposed correction, accepted/adapted/rejected and governing authority. These pre/post audits are the **repository frontend-implementation procedure**, not a vendored Taste command. Historical taste-audit overrides are superseded by current design owners. |
| Impeccable adapt,6/7/10 | Does the same hierarchy work at five widths/zoom/keyboard? Receipt: width, clipping/overflow/order/target evidence and disposition; no new layout concept. |
| Impeccable clarify,9/10/16 | Can readers understand contents/legal links/form result and recovery without processor jargon? Receipt: exact copy/state/reading evidence, approved correction or counsel gate. |
| Impeccable harden,10/12/16 | Are errors, no-JS, focus, forced colors/contrast and storage/transport boundaries complete? Receipt: state/input, behavior test/manual result and fix owner. |
| Impeccable optimize,3/8/11/14/15/18 | Which measured CPU/bundle/layout/allocation cost prevents the target? Receipt: method/head, before/after, preserved fidelity, RED/fix owner. No speculative animation/dependency rewrite. |
| Emil/review-animations,12/16/18 | Purpose, interruption, stationary tail/rest and native interaction remain clear? Receipt: wide/touch/reduced-motion recording, pointer60/120 checks, interruption/settling/caps/field exclusion, verdict and justified correction. |
| Systematic-debugging,3/15 and every failure | Which actual stage causes the observed failure? Receipt: reproduction, hypothesis, disambiguating trace, root cause/confidence, targeted RED and verification; never presume the late-frame cause. |
| Playwright/visual-qa | Repeatable user behavior versus rendered judgment: record engines/viewports/head/cases/retries and separate screenshots/reference judgment; zero selected required cases fails. |
| Figma/Three.js/Brag | Figma was connected Starter/View, no writes; HTML/screenshots remain approved evidence. No dedicated Three skill was found: frozen seam/library version/tests govern. Brag's narrative advice was adapted in discovery, video workflow rejected; no implementation-time video/Figma obligation. |

If a Skill requests subagent producers/critics, run inline with a degraded-run receipt under GOV-AGENT-USAGE. Protected brand/default materials and complete facts outrank generic asymmetry/font/AIDA/perpetual-motion advice. Provider fitness of Luna page packets relies on these **already frozen** specs/primitives; a material unresolved design choice returns to planning rather than being improvised by a higher model.

## Final verification matrix and checkpoints

| Evidence | Owner and required proof |
| --- | --- |
| Contracts/content/export | 2/4–10/13/16: exact field/fact preservation, pure shared projection/caps, canonical legal equivalence, trap/endpoint/bytes/timeout/races; each page's current root/base export remains green; final sixteen documents/locale metadata/Terms/Footer and actual retired404s. |
| Form behavior | 5/10/12/16: every classified result mocked, same-tick lock, late provider errors/unmount, Unicode/maxlength, value retention/accepted-only clear, native busy focus/result pattern, no-JS/direct channels/no URL/storage/log leakage. Candidate CI and reviewer use committed identical patch; no live ordinary CI. |
| Responsive/a11y | 6/7/9/10/12/16/18: ES/EN320/390/768/820/1024/1440, portrait/landscape/mobile keyboard/textarea,200% browser/text zoom, 44px targets and source order; axe plus manual keyboard/headings/landmarks/anchor scroll/contrast. WCAG1.4.12 override line-height≥1.5, paragraph gap2em, letter0.12em, word0.16em causes no loss/clipping. Test prefers-contrast:more and forced colors separately; graph decoration suppressed where required. |
| Screen readers | 10/12/16: actual NVDA+Firefox/Chromium and VoiceOver+Safari, named versions/operator/date; busy then success/global failure announces each phase once, first invalid associated error, no body focus/drop or unexpected repeated result. Missing human tool/device remains OPEN; axe cannot substitute. |
| Runtime/motion | 4/8/11/12/15/18: one projection/renderer/controller, flexible growth/tracer path/pins, elapsed-time invariance/caps, pointer occlusion rules/touch-only scroll, form suspension, session/preferences/import races, zero inactive callbacks, resource/listener baseline, matched poster handoff. Node engine proof8 precedes feasible real-page rendered proof12. |
| Visual | Existing Studio/Founder and bounded Contact/legal/static-poster subjects, deterministic reduced-motion Chromium; platform-matched owner-approved baseline workflow. Firefox/WebKit behavior/layout smoke, no duplicate pixels. Skill receipts name actual questions/findings/dispositions. Live motion recorded, no animated pixel golden. |
| Static release performance | 3/14/16: baseline/current emitted route JS+startup CPU, five cold journeys/profile, correct responsive image and no disabled new-route host hydration/optional request; LCP2.5/INP200/zero enhancement CLS. This gate is independent of qualification15. |
| Live qualification | Early risk/closure3/8 then physical15/18: all five route pairs per tier, full optional/transitive closure≤120, draw/DPR/active frame interval/tasks/vitals/zeroCLS and sustained lifecycle. At least three valid runs, named physical desktop/constrained Android, no missing-as-zero/cherry-pick/software-as-hardware. |
| Real intake | 13 legal/account/provider probe **before deployment**;17 actual deployed ES/EN acceptance/dashboard/Gmail/Reply-To/deletion with rollback. Distinct receipts under Q15. |
| Completion | Fresh npm run validate, appropriate Node/three-engine/axe/root/base/export/measurement/manual/visual runs, full diff/self-review, independent R and human merges. Hardware/software/console/static evidence never substitutes for another layer. Plan remains ACTIVE for an unmet interactive target. |

Command recipe: each task sets its declared PLAYWRIGHT_PORT and NEXT_PUBLIC_BASE_PATH, runs owned specs/projects with nonzero required cases and clears overrides after. Production uses a clean build then verify:static-export and `PLAYWRIGHT_SERVE_EXPORT=1` with `sfc-production-{chromium,firefox,webkit}`; never reuse next dev. Measurement --skip-build only for recorded exact export/head. Windows cleanup resolves/checks `.next`/`out` under **that task's** absolute checkout before deletion. Per-checkout generated outputs remain ignored; only approved baselines/reference receipts commit.

PR boundaries: W0 accepted governance; W1 frozen interfaces/CI/export ownership; W1.5 early measured risk; W3 early closure; W4.5 owned real integration; W5 canonical legal/account gate and independent static-release gate; W7 coordinated release; W8 actual deployed receipt; W9 qualified live tiers; W10 truthful documentation closure. FAIL blocks **its declared dependent checkpoint**, not unrelated commercial work. Resource locks may serialize measured work despite disjoint source dependencies.

## Progress, risks and review history

| Gate | Current state |
| --- | --- |
| Discovery/A–B–C/A.2 and written revision1 | Complete; owner Q14 approved exact package. |
| Controlled release order | Q15 approved; legal/account prerequisites unchanged. |
| Model/staging/copy corrections | Q16–18 approved2026-10-14, recorded in owners and disposition record. |
| Independent revision1 review | Opus5.5 High, reviewed bedbed06; REVISION REQUIRED,35 findings preserved. |
| Master plan revision2 | PROPOSED,19 packets; finding dispositions prepared by planning authority, re-review/owner acceptance pending. |
| Execution/governance/new ADR/live release | NOT STARTED; current demonstration/disabled policies effective. |
| Legal/account/actual receipts/hardware | OPEN, owned by13/15/17; do not invent to unblock. |

Known risk: narrow engine headroom and historical desktop failures/absent compact evidence. Early measurements now precede host integration, and hardware qualification cannot block a safely static commercial release. If live fidelity cannot fit the retained budget, return measured options to owner; never call the interactive redesign complete merely because static works. Model IDs and staging strategy are resolved; real session availability remains an honest preflight. Shared/sibling fixes always receive a new exact packet, not silent write expansion. Final metadata closure belongs to the planning authority, not Claude's flag implementer.

Planning verification will be recorded in the review owner after this revision's fresh docs/contract/diff and packet/DAG/write-resource audits. Those checks cannot claim future implementation, professional legal approval, hardware success or independent re-review. Historical revision1 checks/results remain preserved there.

## Deviations discovered during execution

None: execution has not started. This is a planning-authority revision responding to independent review, with Q16–18 owner decisions.
