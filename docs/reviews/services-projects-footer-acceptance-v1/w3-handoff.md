---
id: HANDOFF-SPF-W3
type: execution-handoff
status: APPROVED
related:
  - PLAN-SPF-V1
  - REVIEW-SPF-ACCEPTANCE-V1
  - DESIGN-SPF-V1
  - IA-SITE
  - GOV-AGENT-USAGE
last_verified: 2026-10-09
---

# Wave 3 preparation and Task 4 handoff

The owner authorized a documentation-only W3 handoff PR on 2026-10-09, followed by Task 4 in a separate Claude Sonnet 5.5 session after its human merge. This is the historical preparation record; startup observations and receipt below retain their original provenance. The [Task 4 packet](../../plans/active/services-projects-footer-v1.md#task-4-pr-4-build-the-shared-protected-mark-azure-conclusion) owns implementation and acceptance. At preparation, Task 4 and W3 were pending. Current status: PRs #121/#122 are merged and the [W3 checkpoint passed](w3-checkpoint.md) on `ddc78aed`; its receipt owns the releases and next-wave boundary.

## Verified start state

- Preparation base: `main` / `origin/main` at `39c56466c86b8a572da35a1aa6e8139110f187f6`, verified by fetch on 2026-10-09. [PR #119](https://github.com/Furlanich/Portfolio/pull/119) is merged; its `validate` and `browser` checks passed in run `37782845160`. No open PR was listed at this check.
- Tasks 3 and 5 and their correction are merged. [W2 passed](../../plans/active/services-projects-footer-v1.md#progress) on `6c7f309` and released Task 4's test and baseline paths. Its recorded results include 439 Node tests, 1602 browser passes / 89 skips, 14 accessibility passes and both 14-route exports. These are prior W2 evidence, not fresh W3 results.
- Task 4 is **not started**. `.worktrees/spf-4` was absent from the worktree inventory. Create it from current merged `main` after this handoff PR merges; do not use the preparation branch as the implementation base.
- Full Task 3/5 owner acceptance, their disclosed LOW preflight omission and owner rendered/hardware approval remain OPEN in the existing receipts. `CONNECTED_LIVE_POLICY` is still `{ wide: false, compact: false }`; Task 4 cannot change it.
- The Sonnet provider was historically resolved to `claude-sonnet-5-5` on `firstParty` (Task 1 and later receipts). The new session must verify and record its actual model/provider/settings before implementation. No new provider verification or substitute authorization is claimed here.

## Ownership at startup

The orchestrator holds PLAN-RECORD. This preparation acquired only the plan's Progress, documentation summaries and this handoff; it acquired no implementation path. After merge, the Task 4 session records acquisition of FOOTER, VISUAL-BASELINES (new Footer subtree) and SHARED-TESTS (the Task 4 blocks) in `task-4.md`. Progress mirroring remains with the orchestrator. No Task 3 or Task 5 implementation session should resume editing these released paths.

Use the packet's complete [write set](../../plans/active/services-projects-footer-v1.md#task-4-pr-4-build-the-shared-protected-mark-azure-conclusion):

| Boundary | Permitted paths or blocks |
| --- | --- |
| Footer | `components/foundation/SiteFooter.tsx`; new `components/foundation/footer-content.ts`, `components/foundation/site-footer.module.css`, `components/foundation/FooterBrandSignature.tsx` |
| Contract tests | `scripts/site-footer.test.mjs` |
| New browser and visual coverage | `tests/e2e/connected-studio-footer.spec.ts`; `tests/e2e/visual/connected-studio-footer.visual.spec.ts` and its snapshots |
| Existing shared browser tests | Footer language/direct-channel block in `marketing-navigation.spec.ts`; Footer heading/professional-link block and its associated label values in `studio-founder.spec.ts`; localized Footer Privacy-link test in `privacy.spec.ts` |
| Conditional transfer | `sky-chart-acceptance.spec.ts` is read-only initially. If Footer structure causes a failure, record the orchestrator's narrow transfer of Footer-region lines before editing; Home runtime and unrelated assertions stay protected |
| Documentation | Footer baseline rows in `docs/testing/visual-regression.md`; new receipt `docs/reviews/services-projects-footer-acceptance-v1/task-4.md` |

These are boundaries, not permission to modify whole shared spec files. The inventory's historical line numbers have drifted; use the named test blocks. Any new consumer or required unowned file needs an orchestrator assignment before editing.

## Implementation preflight observations

- All fourteen retained localized page files already call `SiteFooter` with compatible `contactActions`, `founderLinks`, `labels` and `paths`. Preserve these props and callsites; no `app/**/page.tsx` edit is allowed.
- Derive the active locale as the opposite of typed `paths.alternateLocale`. [Exact public copy](../../product/information-architecture.md#spf-v1-proposed-footer-copy-and-route-retirement) belongs in `getFooterConclusionContent(locale)`; do not copy or paraphrase it in this handoff.
- The existing Footer has no conclusion invitation or `data-site-footer`. Its first semantic invitation test must fail before UI implementation. Replace legacy source/class assertions with the packet's content-data, semantic and browser checks, not CSS regex tests.
- The canonical Bone mark is `public/brand/furlanich-mark-bone-on-azure.svg`. Inspect it alongside `components/brand/BrandSignature.tsx`; keep assets and the shared component untouched. The dedicated Footer signature must not emit `data-app-bar-brand` or use the shared `on-dark` variant.
- Existing Footer direct-channel checks expect WhatsApp, email and phone in that DOM order. PC-4 puts WhatsApp once in the invitation, then email/phone in direct contact. Use the existing content-owned channel values and existing `founderLinks` order.
- `studio-founder.spec.ts` still expects the old professional-group heading. Update only the Footer heading/label block for the approved direct-accountability heading.
- The current demonstration statement is rendered by `components/homepage/HomeCta.tsx` from locale Home content; Contact has its own demonstration content. Preserve both in place. No disclosure is currently part of `SiteFooter`, and this packet does not authorize moving or rewriting it.
- Playwright already registers the new Footer browser pattern in Chromium, Firefox, WebKit, mobile Chromium and 320px Chromium. `visual-chromium` already matches the new visual spec. No configuration edit is needed or owned.

## Session launch after human merge

From the repository checkout, fetch current `main`, confirm that it contains the merged handoff, and check the worktree inventory. If `.worktrees/spf-4` already exists, inspect its branch, base and local changes before reusing it; never reset an existing checkout blindly. Otherwise:

```powershell
git fetch origin
git worktree add .worktrees/spf-4 -b codex/spf-4-footer origin/main
Set-Location .worktrees/spf-4
$env:PLAYWRIGHT_PORT = '3240'
Remove-Item Env:NEXT_PUBLIC_BASE_PATH -ErrorAction SilentlyContinue
npm ci
```

Open that worktree in a new top-level Claude Sonnet 5.5 session. This preparation does not create or message that session. Use this startup prompt:

```text
Execute Task 4 only of docs/plans/active/services-projects-footer-v1.md.
Read docs/reviews/services-projects-footer-acceptance-v1/w3-handoff.md first.
Confirm this handoff PR is human-merged and your branch starts from current
merged main. Record the actual Claude Sonnet 5.5 provider identifier and
settings before implementing; do not silently substitute another model.

Run SINGLE_AGENT / IMPLEMENTATION / Subagents Allowed: 0 in .worktrees/spf-4
on codex/spf-4-footer with PLAYWRIGHT_PORT=3240. Use
superpowers:executing-plans inline. Never spawn an implementer or reviewer.
Follow AGENTS.md's reading order, the Task 4 packet, its exact write set,
Skills contract, strict RED/GREEN/REFACTOR and PC-4. Read the installed Next
guides. The approved design and copy are closed: no brainstorming, new
planning, Impeccable, Brag, v2 Taste or unrelated Home/App Bar changes.

Read both approved Footer reference images before composition. Run the
first semantic RED before UI work. Implement the compatible shared Footer,
then complete the packet's tests, visual matrix, both base paths, Home
regression and owner baseline/contrast gates. Keep the live policy false.
Record actual evidence and OPEN items in task-4.md; do not claim unrun
manual checks. Ask the orchestrator for any unowned failing path transfer.

Self-review the complete diff, validate, commit and open the Task 4 PR for
separate-session independent review and human merge. Keep it draft until
required CI and rendered/owner gates pass. Do not edit plan Progress or
record W3 passed: the orchestrator runs W3 after the Footer PR merges.
```

## Completion and next-wave boundary

Task 4 must run every command, host/locale/responsive state and objective gate in its packet, including the unchanged `immersive-chromium` Home acceptance, axe, root and `/Portfolio` clean builds/exports and a `/Portfolio` Footer-spec run. Its reference images are `revision-footer-1440.png` and `revision-footer-390.png` under the [approved media package](../services-projects-footer-design-2026-09-30/index.md). Baseline approval on Windows and Linux and rendered watermark contrast are owner gates; automation cannot approve them.

After the human merges the Task 4 PR, the orchestrator runs the plan's [W3 commands](../../plans/active/services-projects-footer-v1.md#wave-checkpoints) in a clean worktree on merged `main` after fresh `npm ci`, records the source SHA/results and releases locks. W4 / Task 6 remains gated on that green checkpoint and merged Tasks 3, 4 and 5.

## Preparation receipt

- Agent usage: primary OpenAI Codex GPT-6 (exact provider model identifier/settings not exposed); subagents 0/0 (none).
- Execution: SINGLE_AGENT / documentation preparation. No production code, test expectations, visual baselines or runtime policy changed. TDD and rendered QA are N/A for this PR; Task 4 must perform them.
- Skills: `superpowers:executing-plans` used for coordination and ledger discipline; `superpowers:using-git-worktrees` for isolation; `project-knowledge-maintenance` for owning-record synchronization; `writing-for-agents` for the startup prompt; `systematic-debugging` for sandbox failures; `verification-before-completion` and `pr-readiness` for validation and complete-diff self-review. Delegated review mechanics are degraded under GOV-AGENT-USAGE; independent review remains a separate session.
- Worktree/branch: `.worktrees/spf-w3-handoff`, `codex/spf-w3-handoff`; base `39c56466`. The Task 4 worktree and its locks remain unacquired.
- Fresh local validation on 2026-10-09: locked `npm ci` and `npm run validate` exited 0; docs:check passed (304 Markdown files, 104 IDs, 38 Skills), Node tests passed 439/439, lint passed with 0 errors / 282 warnings in unchanged vendored Impeccable scripts, typecheck and root production build passed. Root `npm run verify:static-export` passed for 14 routes. Final documentation edits are checked again before commit. Node module-type and stale Browserslist notices are environment/baseline notices, not errors.
- The initial sandboxed `npm ci` failed with filesystem EPERM and the initial sandboxed validation failed in the static-server tests with localhost EACCES. Both commands succeeded outside the sandbox; no source or expectation was changed to resolve those environment restrictions. Logs stay local and ignored.
- Complete-diff self-review: documentation-only scope, linked authority, preserved approvals/OPEN items and no implementation ownership expansion. PR CI and separate-session independent review remain OPEN at publication; this PR stays draft while required gates are pending. Earlier W2 results above retain their original provenance; no browser or W3 checkpoint run is claimed by this preparation.
- Independent review and human merge of this preparation PR: OPEN. This record authorizes no merge and claims no implementation or W3 checkpoint completion.
