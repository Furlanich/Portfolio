---
id: REVIEW-SPF-W4-2026-10-10
type: checkpoint-receipt
status: PROPOSED
related:
  - PLAN-SPF-V1
  - REVIEW-SPF-ACCEPTANCE-V1
  - REVIEW-SPF-W3-2026-10-09
  - DESIGN-SPF-V1
  - GOV-AGENT-USAGE
last_verified: 2026-10-10
---

# W4 checkpoint — 2026-10-10

**Checkpoint result: PASS**, completed at 2026-10-10T20:15:19-03:00 (the end of the final full-matrix command). This is fresh post-merge evidence for the [W4 checkpoint](../../plans/active/services-projects-footer-v1.md#wave-checkpoints), not final SPF acceptance or a new design approval. The receipt stays PROPOSED pending this documentation PR's independent review and human merge.

## Source and execution

Source: merged `main` / `origin/main` at `9279838f76fb42ba3ab2004ab208ac9dd9179a36`, fetched before execution and again after the full matrix (unchanged). [Task 6 PR #124](https://github.com/Furlanich/Portfolio/pull/124) merged at that commit on 2026-10-10T20:53:47Z after `validate` and `browser` CI both passed on head `2c5e57a8`. The merged PR includes the owner-approved ownership transfers and the independent reviewer's correction (`5cc741c2`), both recorded append-only in the [Task 6 receipt](task-6.md), and the owner-approved Windows and Linux Services baselines (`2c5e57a8`).

A new clean detached worktree was created from that commit at `.worktrees/spf-w4-checkpoint`. Tracked status was empty before a fresh locked `npm ci`. Conditions: Windows, root base path, `PLAYWRIGHT_PORT=3304`, no external server, no export-serving override and no CI retry setting. After the matrix the only tracked change was `next-env.d.ts`, which `next dev` regenerates; it is not a rendered change.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`); subagents 0/0 (none). `SINGLE_AGENT`. **Role note:** the plan keeps checkpoints with the coordination-only orchestrator, which never implements or reviews a PR it gates. The owner explicitly asked the Task 6 implementer session to run this checkpoint and the lock release, as the Task 2 session did for W0 and W1. That session therefore gated its own PR here; the evidence below is mechanical command output on merged `main`, and the independent review of this documentation PR is the check on it.

## Fresh checkpoint commands

Every command ran against the same merged source. Local logs stay under the ignored `.superpowers/` workspace.

| Command | Final result |
| --- | --- |
| `npm ci` | Exit 0; 406 packages installed |
| `npm run validate` | Exit 0: docs 307 Markdown files / 105 IDs / 38 Skills; 453/453 Node tests; lint 0 errors / 282 existing warnings; typecheck and clean root build PASS |
| Root `npm run verify:static-export` | Exit 0; 14 routes at `/` |
| `npm run test:e2e -- --workers=1` | Exit 0; **1974 passed / 95 skipped / 0 failed**, 1.3 hours; all projects, including every visual comparison |
| `npm run test:a11y` | Exit 0; 14 passed, 59.9 seconds |
| `npm run test:e2e -- --project=immersive-chromium --workers=1` | Exit 0; 176 passed, 16.8 minutes; unchanged Home acceptance |
| Clean `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` | Exit 0 after removing only this worktree's `.next` and `out` |
| `/Portfolio` `npm run verify:static-export` | Exit 0; 14 routes at `/Portfolio` |

Pass condition from the plan: the Services catalogue and boundaries are complete (the Task 6 browser spec and the export verifier assert the three native anchors, every compressed boundary, the shared agreement, the AI/ERP paragraph and scope sentence, and the full commercial block, with JavaScript disabled, in both locales, at both base paths); baselines are owner-approved (the owner approved the Windows Services and Footer captures and the matching Linux CI captures, recorded in the Task 6 receipt). Home acceptance is unchanged at 176 passes.

### Failed attempt

The first full `npm run test:e2e -- --workers=1` ended with exit 1 after about two minutes and **ran no test**: `Error: Timed out waiting 120000ms from config.webServer`, the development server's cold-start budget, with a "slow filesystem" notice. It is a startup failure, not a result, and the Home acceptance run that immediately followed started the same server normally. The complete matrix was rerun unchanged and passed, so no source, assertion, timeout, retry or baseline changed to obtain green. A recurrence of the cold-start timeout needs investigation; no cause beyond the observed timing is claimed.

Notices, distinct from failures: existing vendored-script lint warnings, the module-type warning, a stale Browserslist notice, LCP-image and software-renderer extension notices. The Task 6 review also reproduced Windows production-export RSC-prefetch 404s on both the PR head and its base commit, attributed to the installed Next exporter's handling of Windows path separators. That pre-existing issue is outside Task 6 and is carried to Task 9's production hardening, not fixed here.

## Serial lock ledger

Transfers are mirrored from the append-only [Task 6 receipt](task-6.md), retaining owner authorization. Releases take effect after the merged PR and green W4 at 2026-10-10T20:15:19-03:00; no acquisition time or whole-file permission is invented.

| Boundary | Acquisition/transfer provenance | W4 disposition |
| --- | --- | --- |
| SERVICES | Released at W2 by Task 3; acquired by Task 6 at session start, 2026-10-10, under its packet | Task 6 releases. Services page content, components and CSS are available to Task 7 only for the packet's page/Ground hooks |
| CONNECTED-GROUND | Released at W2; Task 6 acquired it for bounded static fixes | Task 6 made no Ground change and releases it. Available to Task 7 under its packet |
| VISUAL-BASELINES, Services | Task 3 → Task 6: `services-{wide,compact}` and the new `services-english-{wide,compact}`, Windows and Linux | Task 6 releases. Owner-approved files preserved; Task 8 owns the next change (posters) |
| SHARED-TESTS, whole file | Task 3 → Task 6 after W2: `tests/e2e/marketing-services.spec.ts` | Task 6 releases; available to Task 9 per the inventory |
| New Services browser spec and Node tests | New `tests/e2e/connected-studio-services.spec.ts`; `scripts/services-content.test.mjs` and `scripts/services-route.test.mjs` | Task 6 releases; later tasks extend only their own blocks |
| Footer visual capture | Owner-authorized 2026-10-10 transfer from Task 4 to Task 6 of only the capture setup in `tests/e2e/visual/connected-studio-footer.visual.spec.ts` (hide the host `main`) and the regenerated `footer-wide` win32 and linux baselines; compact baselines unchanged | Released after W4 green; the Footer itself stays Task 4's finished work |
| Foundation test | Owner-authorized 2026-10-10 transfer of only the two Services H1 assertions in `scripts/foundation-content.test.mjs` | Released |
| Export verifier | Owner-authorized 2026-10-10 transfer of only `servicesRequirements` and the catalogue-navigation check in `scripts/verify-static-export.mjs` | Released after both exports PASS; the rest of the script stays protected |
| Home static spec | Owner-authorized 2026-10-10 transfer of only the `html keeps the Bone canvas on non-Home routes` test in `tests/e2e/immersive-home-static.spec.ts` (now visits Studio) | Released; the Home acceptance run is unchanged and green |
| Baseline inventory | Services rows of `docs/testing/visual-regression.md` and one paragraph of `docs/testing/playwright.md` | Task 6 releases; Task 8 owns the next rows |
| Reviewer correction | After separate-session review of PR #124, an owner-requested Codex GPT-6 correction restored the D05 AI/ERP paragraph (`aiNote.managementScope`) and the catalogue spacing inside the same Task 6 paths | Included in the merged PR; its separate-session independent acceptance stays OPEN |
| PLAN-RECORD / checkpoint docs | This session, at the owner's request, 2026-10-10 | Retains Progress coordination; the docs-only branch mirrors the ledger for human review |

Releases are not blanket later-task permission.

## Next boundary and acceptance

W5 / Task 7 has its dependencies merged (Tasks 2–6) and a green W4. It may start as a separate top-level Claude Sonnet 5.5 session after provider verification and serial path acquisition. This checkpoint creates and messages no session and implements no Task 7 work. The W5 checkpoint adds `npm run measure:immersive` (read-only Home regression) to the W3 commands.

Both live tiers remain false. Still OPEN in their owners: the Task 6 screen-reader (NVDA with Firefox, VoiceOver on iOS), real browser zoom and physical-device checks, which the owner performs under OD-4 and which no automated result here supplies; separate-session independent acceptance of the Task 6 correction; the OD-3 Home/Services family-name difference (Home still says "Sitios y aplicaciones web comerciales", "Automatización por WhatsApp e integraciones" and "Mantenimiento y consultoría de software", Services now says "Sitios y aplicaciones web", "Integraciones y automatización" and "Mejora de software existente"); full Task 3/5 owner acceptance and their disclosed LOW preflight omission; and final SPF acceptance. Task 10 retains final implementation-fact reconciliation.

Acceptance: source/isolation, all W4 commands, unchanged Home, lock traceability and agent-usage audit PASS. Approval statuses and public requirements are preserved. New PR CI, separate independent review and human merge remain OPEN; publish as draft until those gates pass.
