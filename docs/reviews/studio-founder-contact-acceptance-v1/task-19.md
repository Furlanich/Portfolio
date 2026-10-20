# Task 19 / PR 19 — Close knowledge and acceptance through the planning authority

**Status: documentation closeout complete on branch `codex/sfc-19-closeout`; PLAN-SFC-V1 moved to `docs/plans/completed/` against an owner-amended target. Reviewer R and the human merge of this PR are OPEN.** The target amendment is the owner's decision of 2026-10-20 (below). The compact tier, and the carried items in "What stays OPEN", are not closed by this document and are proposed as follow-up packets, not hidden.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Code desktop session; the session does not expose reasoning effort. Subagents 0/0 (none, `SINGLE_AGENT`). Self-review only; Reviewer R remains a separate session.

> **Update, later on 2026-10-20: this receipt's compact verdicts are superseded.** After the follow-up packets 25 to 27 merged, the owner said they had already tested the compact live scene, the screen-reader checks and the phone checks manually, and asked for the plan closure to continue. They chose to enable compact. [Task 25](task-25.md) did that, so `CONNECTED_LIVE_POLICY` is `{ wide: true, compact: true }`, and [Task 27](task-27.md) rows 5 to 11 are closed on the same attestation. The rows, rulings and follow-up list below are the state at the merge of PR #172 and are kept as history; the current state is in [index](index.md), [Task 25](task-25.md) and the plan's status note. Still OPEN: Firefox and WebKit timing, and Task 7 R1. The owner's testing is an attestation with no per-item figures, like the wide tier's acceptance. PR #175 (Task 25's first commits) had merged into this branch after #172 reached `main`, so those commits reached `main` only with the closing PR.

Branch: `codex/sfc-19-closeout`, cut from `origin/main` at `971f9594` (the merge of PR #171). Targets `main`. Documentation only: no product code, test, workflow, fixture or deployment file changed.

## The owner decision

The owner's instruction at the start of this packet: "We must finish everything that is left in the plan and close it. All the previous Tasks implementations in codex/sfc-integration must be already merged into main and the plan criteria must be met."

The plan's Task 19 says that if an intended interactive tier is missing, the plan stays ACTIVE with the exact OPEN gate, unless an owner-amended target is explicitly reviewed. The compact tier is missing (no constrained Android device or operator, so [Task 15](task-15.md) has no compact evidence), so I asked rather than assume. The owner chose, from three options, **"Amend target, then close"**: the plan's interactive target becomes the wide tier only, with compact deferred to a follow-up listed as OPEN. That is the only amendment. Nothing else in the plan's text was rewritten, and no old deferral was retroactively accepted.

## Preconditions, verified against git on 2026-10-20

| Check | Result |
| --- | --- |
| `codex/sfc-integration` merged into `main` | `git merge-base --is-ancestor` true; `git rev-list --count origin/main..origin/codex/sfc-integration` is **0** |
| Every `origin/codex/sfc-*` and review branch | 0 commits ahead of `main`, except `origin/codex/sfc-21-label-occlusion` (1 ahead): `git cherry` marks `d08b90de` as patch-equivalent to `9b0574b5`, which `main` carries through PR #163. Nothing unmerged |
| Merge list | PRs #142 to #171 are all merge commits on `main`; see the delivery table |
| Live policy | `CONNECTED_LIVE_POLICY` is `{ wide: true, compact: false }` ([Task 18](task-18.md), merged at `317467b2`, deployed read-only smoke PASS) |

## Delivery

| Task | Pull request | Merge commit | Receipt |
| --- | --- | --- | --- |
| 1 Governance | [#142](https://github.com/Furlanich/Portfolio/pull/142) | `cd8c0d45` | [task-01](task-01.md) |
| 2 Contracts, CI | [#143](https://github.com/Furlanich/Portfolio/pull/143) | `7fc2a6c6` | [task-02](task-02.md) |
| 3 Baselines | [#144](https://github.com/Furlanich/Portfolio/pull/144) | `327f01a1` | [task-03](task-03.md) |
| 4 Pure model | [#145](https://github.com/Furlanich/Portfolio/pull/145) | `312f4068` | [task-04](task-04.md) |
| 5 Inquiry port (dormant) | [#146](https://github.com/Furlanich/Portfolio/pull/146) | `652b80cf` | [task-05](task-05.md) |
| 6 Studio Atlas | [#147](https://github.com/Furlanich/Portfolio/pull/147) | `3334979a` | [task-06](task-06.md) |
| 7 Founder Atlas | [#148](https://github.com/Furlanich/Portfolio/pull/148) | `644c2e78` | [task-07](task-07.md) |
| 8 Engine paths | [#149](https://github.com/Furlanich/Portfolio/pull/149) | `2cc22b06` | [task-08](task-08.md) |
| 9 Legal template | [#150](https://github.com/Furlanich/Portfolio/pull/150) | `5f57ad70` | [task-09](task-09.md) |
| 10 Contact UI | [#151](https://github.com/Furlanich/Portfolio/pull/151) | `cfc8997d` | [task-10](task-10.md) |
| 11 Host lifecycle | [#152](https://github.com/Furlanich/Portfolio/pull/152) | `e98d6aaf` | [task-11](task-11.md) |
| 12 Integration verification | [#153](https://github.com/Furlanich/Portfolio/pull/153) | `60b76daa` | [task-12](task-12.md) |
| 13 Direct contact | [#154](https://github.com/Furlanich/Portfolio/pull/154) | `fdde3a48` | [task-13](task-13.md) |
| 14 Static posters | [#155](https://github.com/Furlanich/Portfolio/pull/155) | `5d0b3a70` | [task-14](task-14.md) |
| 15 Qualification tooling | [#156](https://github.com/Furlanich/Portfolio/pull/156), wide record [#162](https://github.com/Furlanich/Portfolio/pull/162) | `647444ae`, `7942cb76` | [task-15](task-15.md) |
| 16 Coordinated release | [#157](https://github.com/Furlanich/Portfolio/pull/157) | `5d8055a3` | [task-16](task-16.md) |
| 17 Deployed direct contact | [#158](https://github.com/Furlanich/Portfolio/pull/158) | `84c5c98a` | [task-17](task-17.md) |
| 18 Enable wide tier | [#164](https://github.com/Furlanich/Portfolio/pull/164), receipt [#166](https://github.com/Furlanich/Portfolio/pull/166) | `317467b2`, `e1de0c45` | [task-18](task-18.md) |
| 20 Contact Pause shift | [#159](https://github.com/Furlanich/Portfolio/pull/159) | `ab177ea2` | [task-20](task-20.md) |
| 21 Label occlusion | [#160](https://github.com/Furlanich/Portfolio/pull/160), [#161](https://github.com/Furlanich/Portfolio/pull/161), test floor [#163](https://github.com/Furlanich/Portfolio/pull/163) | `26c4653e`, `eb6f51a7`, `0d01fa52` | [task-21](task-21.md) |
| 22 Contact words and Pause | [#165](https://github.com/Furlanich/Portfolio/pull/165) | `ed57bc06` | [task-22](task-22.md) |
| 23 Save-Data disposal | [#168](https://github.com/Furlanich/Portfolio/pull/168), brightness [#169](https://github.com/Furlanich/Portfolio/pull/169) | `416f8fb3`, `8c86d4d5` | [task-23](task-23.md) |
| Independent reviews | [#167](https://github.com/Furlanich/Portfolio/pull/167), [#170](https://github.com/Furlanich/Portfolio/pull/170) (+ [#171](https://github.com/Furlanich/Portfolio/pull/171) date refresh) | `e42beb2f`, `ab104e31`, `971f9594` | [Tasks 18/22 review](../studio-founder-contact-tasks-18-22-review-2026-10-19.md), [Task 23 and brightness review](../studio-founder-contact-task-23-brightness-review-2026-10-20.md) |

Task 24 was never created; the owner's full-brightness decision retired the requirement it would have implemented ([Task 23](task-23.md)).

## Criteria, one by one

| Plan criterion | Verdict |
| --- | --- |
| Commercial release (W7): Studio, Founder, Contact, Privacy and Terms redesign, sixteen static routes, actual 404s for retired project details | **MET.** Task 16, deployed |
| Direct contact (W5/W8): native WhatsApp/email/phone links, no form, no provider request, localized disclosures | **MET.** Task 13 implementation; Task 17 read-only deployed PASS |
| Static release performance | **MET with an owner exception.** Desktop paired startup PASS in Task 16; the mobile poster cost and, after Task 18, the host's startup cost (desktop +80 to +93 ms median) exceed the +25 ms allowance and were **accepted by the owner** ([Task 16](task-16.md), [Task 18](task-18.md)) |
| Interactive objective, **wide tier** (amended target) | **MET by owner acceptance, not by measurement.** The 30-run quiet-desktop collection was waived by the owner on 2026-10-19; Reviewer R's objection is recorded in [Task 15](task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19). Task 18 enabled it and the deployed smoke passed |
| Interactive objective, **compact tier** | **NOT MET. OPEN.** Stays static. See follow-up Task 25 |
| Legal/account/counsel/provider gates | **NOT APPLICABLE** (owner amendment of 2026-10-18); reported as N/A, never PASS |
| Role conflict | None: this packet changed documentation only; the planning-authority role (the plan assigns it to Luna) ran on Sonnet 5.5 at the owner's direction, see the first ruling |

## What changed

Owned paths edited: [ARCHITECTURE.md](../../../ARCHITECTURE.md) (current facts), [docs/design/index.md](../../design/index.md) and [studio-founder-contact-v1.md](../../design/studio-founder-contact-v1.md) (current status), [docs/testing/playwright.md](../../testing/playwright.md) and [visual-regression.md](../../testing/visual-regression.md), [site-feature-catalogue.md](../../product/site-feature-catalogue.md), [status-register.md](../../governance/status-register.md), [docs/index.md](../../index.md), [docs/plans/index.md](../../plans/index.md), the acceptance [index](index.md), this receipt, and the plan's front matter, status note, progress table and one deviations entry. The plan moved to `docs/plans/completed/studio-founder-contact-v1.md` and every inbound link was rewritten (below).

Corrections found while reconciling, all recorded in their owners:

- Playwright list counts were stale: 3195 default cases in 37 files and 90 candidate cases in 2 files (envelopes 3200 and 180).
- The docs said `lib/inquiry/release.ts` "does not exist yet" (it exists; the commercial patch applies).
- The docs promised a dedicated candidate CI job at Task 10. **It was never added.** See follow-up Task 26.
- `tests/fixtures/sfc/runtime-closure.patch` no longer applies (Task 18 attached the host) and nothing references it.
- The visual-regression Founder row said the Linux files "still show the superseded layout"; they were adopted at Task 7 and verified by run `38935916203`.
- Text saying "execution NOT AUTHORIZED", "PROPOSED revision 2", "live-policy flags remain false" and "pending Governance PR acceptance" in the status owners was brought to the merged state. The RFC's own governance record and every ADR and review body were left as written.
- The Task 7 receipt lived at the repository root; it moved to this directory (`git mv`, no content change; it has no relative links).

## Rulings

- Ruling: **the plan is COMPLETED against an owner-amended target (wide tier only), not against its original two-tier target.** Why: the owner chose that option when asked, in chat on 2026-10-20; the plan's own rule allows an explicitly reviewed owner amendment. Cost if wrong: the plan returns to `active/` and Task 25 becomes a blocker; one `git mv` and a status edit.
- Ruling: **this session ran on Sonnet 5.5, not on the Luna model the plan assigns to this role.** Why: the owner started the session on this model and directed the work; the plan's Q16 routing allows no silent substitution, so this is a disclosed deviation, not an equivalence claim. Cost if wrong: a Luna session repeats the reconciliation.
- Ruling: **the owner's closure instruction stands as "owner final acceptance" for the plan as a whole, and I did not itemize it.** Several older receipts still say Reviewer R, an owner acceptance or a human merge is PENDING. Those are history. I did not edit them, and I did not turn them into PASS. The carried list below is the itemized state, and the owner reads it at the merge of this PR. Cost if wrong: the owner names an item that needs a separate acceptance.
- Ruling: **packet numbers 20, 21, 22 and 23, assumed by their implementers, are accepted as they are.** Why: they were merged under those numbers and cited in code-adjacent records. Cost if wrong: a renumbering touches receipts only.
- Ruling: **link-only edits to 12 files outside the Task 19 owned list** (an ADR, the RFC and its index, the spec, two design owners, one product page, three acceptance records and two reviews) rewrite `plans/active/studio-founder-contact-v1` to `plans/completed/...`. Why: the plan says to fix dependent links, and leaving them would break `docs:check`. No sentence in those files changed; immutable ADR and review histories are intact. Cost if wrong: revert those one-line path edits and add redirects.
- Ruling: **the older design prose (the form-based Contact goals, "submit a genuine initial inquiry", the Q14 gate wording) stays as written**, under the new dated status note, which says the dated amendments govern. Why: rewriting approved target text is plan-substance work this packet may not do. Cost if wrong: a reader meets a stale sentence before the note.
- Ruling: **the `executing-plans` workspace/ledger scripts were not used, and the whole-branch reviewer subagent was not dispatched.** Why: the scripts parse subagent-style task briefs and this plan's Task 19 is a checklist; AGENTS.md and GOV-AGENT-USAGE forbid review subagents. The final self-review is the author's own and weaker than a fresh reviewer; Reviewer R is the independent check. Cost if wrong: a reviewer finds what a fresh context would have.

## What stays OPEN

The plan's completion is not a claim that these are done.

| Item | State | Owner / where |
| --- | --- | --- |
| Compact (constrained Android) tier | OPEN, static. No device, no operator, no Task 15 evidence. The intermittent Contact compact label overlap ([Task 18](task-18.md)) belongs here | Owner; follow-up Task 25 |
| Wide tier measured qualification | Waived by the owner; it is PASS by acceptance. A later measured run would not contradict it, only strengthen it | Owner, optional |
| Firefox and WebKit timing | Functional activation only; every performance row OPEN in those engines | Follow-up Task 27 |
| Manual screen-reader passes (NVDA, VoiceOver, Narrator) and physical phones | Not performed. Axe is not a substitute | Owner; follow-up Task 27 |
| Dedicated candidate CI job | Never added; candidate families run locally and at a reviewer's head | Follow-up Task 26 |
| Task 7 R1 (a PDF MIME mapping in `scripts/serve-static-export.mjs`, outside the packet's owned paths) | Merged through human-reviewed PR #148. This packet may not accept an old deferral retroactively, so it stays recorded as a deviation | Owner may close at merge |
| Task 21 Services/es catalogue-card hover lift (up to 3 px, 1 frame in 1 of 7 runs) | Accepted by the owner on 2026-10-19 ([Task 18](task-18.md)) | Closed by decision |
| Host startup cost on Studio, Founder and Contact | Accepted by the owner as an exception; the lazy-gate option remains available | Closed by decision; reopen only on owner request |
| Reviewer R re-reviews listed PENDING in older receipts, and R on this PR | The independent reviews of #164/#165 and #168/#169 exist ([review 1](../studio-founder-contact-tasks-18-22-review-2026-10-19.md), [review 2](../studio-founder-contact-task-23-brightness-review-2026-10-20.md)); the rest were not re-run | Reviewer R |
| Deferred minors | Contact links to Privacy only (Terms is in every Footer); `runtime-closure.patch` is stale | Task 26 for the patch; the rest stays deferred |
| Legal sufficiency | Never inferred. Privacy and Terms are factual disclosures approved by the owner, not professional review | Owner |

## Follow-up packets (proposed; none authorized or started)

Numbers start at 25 because 24 was prospective and is retired. Each needs the owner's authorization and the plan's remediation protocol (exact provider, base, locks, RED, acceptance, reviewer).

- **Task 25 — Qualify and enable the compact tier.** Needs a named constrained Android device and operator, the [hardware protocol](hardware-protocol.md), the `--batch` collector and the human hidden-tab measurement; then a minimal flip of `compact` in `lib/connected-studio/capability.ts` (the committed `live-policy.patch` already does exactly that for candidates), with the intermittent compact label overlap repaired first, failing-first. Claude Sonnet 5.5 High.
- **Task 26 — Add the candidate CI job.** Edits `.github/workflows/ci.yml` only (the file Task 10 was forbidden to touch), plus deleting the stale `runtime-closure.patch`: a job that applies the commercial and live-policy candidates in a disposable checkout, runs the 90 candidate cases, blocks unmocked provider traffic and always restores; target ≤20 minutes, hard 30. Software-only, no hardware. Sonnet 5.5 High.
- **Task 27 — Manual acceptance round.** Owner or named operator: NVDA with Firefox/Chromium, VoiceOver with Safari, Narrator, a real phone pass, and Firefox/WebKit timing on the wide tier. Evidence only, no code.

## Verification

Run on this branch after the last edit:

- `npm run docs:check`: **passed**, 398 Markdown files, 123 document IDs, 38 Skills (after the plan move and the 12 link rewrites).
- `npm test` on this branch: **982 pass, 0 fail, 0 todo** (the Task 23 receipt's one `todo` was retired by PR #169). `git diff --cached --check`: no whitespace errors. Diff: 25 files, two renames (the plan at 96% similarity, the Task 7 receipt at 100%), one new file.
- Source verification is **not re-run**: the plan says prose needs no redundant benchmark. The fresh evidence is each task's own receipt and `npm run validate` in [Task 23](task-23.md) (983 tests, 982 pass, 1 todo that PR #169 retired, 0 fail) at `673d5120`.

## Self-review

I checked each claim in the owner documents against git or a receipt: merges against `git log` and `git cherry`, counts against `playwright test --list`, the stale patch against `git apply --check`, the policy against the Task 18 receipt. I did not check the deployed site again; the deployed statements quote the Task 17, 18 and 23 receipts and say so.
