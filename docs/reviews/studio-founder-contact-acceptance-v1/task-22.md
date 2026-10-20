# Task 22 / PR 22 — Contact words bound to the profile nodes, and the Pause control cleared of the scrim backing

**Status: repaired on the runtime candidate; rendered evidence collected on the implementer's GPU; the two Contact compact visual baselines are adopted on the owner's approval (below); one judgment call for the reviewer to confirm (the Pause fix).** Both Task 12 findings that were recorded as "OPEN, packet 20+ proposed" are fixed with failing-first cases. These two defects become public when Task 18 enables the wide live tier, which is why they are fixed first.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Code desktop session started by the Task 18 session; subagents 0/0 (none). Independent review stays a separate session.

Branch/worktree: `codex/sfc-22-contact-live` in a Claude Code worktree (`.claude/worktrees/quizzical-brattain-def9f8`), cut from `origin/main` at `0d01fa52` (the merge of PR #163). Targets `main`; opened for human review, never merged by the agent.

## Packet

The plan's remediation protocol numbers packets from 20; Tasks 20 and 21 are taken, so this receipt **assumes 22**. The planning authority must accept that number or renumber the packet with the same diff; until then the numbering is **OPEN**.

| Field | Value |
| --- | --- |
| Findings | [Task 12](task-12.md), "Findings outside this packet": Contact word binding, and the Contact Pause control clipped by the scrim backing |
| Base / dependencies | `main` at `0d01fa52`. Task 18 (`codex/sfc-18-enable-wide`) is prepared in parallel and touches none of these files |
| Owned paths | `app/(es)/_content/contact.ts`, `app/(en)/en/_content/contact.ts`, `components/contact/ContactPage.tsx`, `scripts/contact-content.test.mjs`, `tests/e2e/sfc-runtime.spec.ts` (only the two fixme markers and their comments), `docs/design/studio-founder-contact-v1.md` (one sentence), this receipt, the two resolution notes in `task-12.md` |
| Not touched | The master plan, `capability.ts`, `atlas-live-host.tsx`, `AtlasScrim`, `contact.module.css`, copy, any visual baseline |

## Defect 1: the Contact Pause control is painted over by the scrim backing

**Cause.** `ContactPage` rendered the Pause slot as a sibling after `AtlasScrim`, with `.pauseSlot { margin-top: 16px }`. `AtlasScrim`'s opaque `::before` extends its `clearance` (32 px for the Contact introduction) beyond the text on every side. The slot therefore started 16 px inside the backing, and the backing, which has `pointer-events: none` but paints, covered the top 16 px of the 44 px control: no top border, and a clipped top of the 3 px focus ring (3 px offset, so 6 px outside the border). `elementFromPoint` still reported the button, which is why the defect is visual only.

**Fix.** The Pause slot moves inside the introduction scrim, after the response expectation. Nothing else changes: the slot is still 16 px after the response expectation, as DESIGN-SFC-V1 states; no layout position of any element moves (the slot, the channels surface and everything below stay where they were); no copy or CSS changes. The scrim's opaque backing now also extends 32 px below the control, so the control sits fully on the backing, as Founder's slot sits inside its intro plate. The Task 20 `:has([data-connected-pause])` rule is unaffected.

**The judgment call.** The brief offered more spacing (at least 32 px plus the 6 px focus-ring offset, so about 38 px) or a stacking fix. The spec fixes the gap at 16 px, so more spacing would change the approved composition, and a stacking fix would leave the control straddling the backing edge, and cannot turn the geometric Task 12 case green without editing it. Moving the slot into the scrim satisfies both the spec's 16 px and the case. It does enlarge the backing by 60 px (the slot's 16 px margin and 44 px height) below the text, so the dark introduction plate is taller; the gap between that backing and the Bone channel surface shrinks from about 124 px to 64 px at 1440 wide and from about 84 px to 24 px at 390 (measured on the export: 64 and 24 after; the before values add the 60 px). If the owner prefers the other shape, the alternative is a one-line CSS change (`.pauseSlot { margin-top: 38px }` with the slot left outside the scrim, and the design sentence reverted) and the same test turns green; nothing else in this packet depends on the choice. **The owner should confirm this against the approved Contact composition.**

**RED to GREEN.** With the runtime candidate applied at `0d01fa52` and the fixme removed:

- `contact wide: every control outside a reading scrim is clear of its opaque backing` and `contact compact: ...` failed: `button "Pausar fondo" overlaps the 32px backing by 16px` in both.
- After the move: both pass, on the unmodified spec case.

## Defect 2: the three Contact words are bound to the wrong nodes

**Cause.** `app/(es)/_content/contact.ts` and `app/(en)/en/_content/contact.ts` bound the words to `n0`, `n5` and `n10`. DESIGN-SFC-V1 ("Composition data") and the Task 4 Contact profile bind them to `n0`, `n4` and `n8` (`n0, n4` on compact). The host resolves each label from the profile's `wordNodeIds`, so only the `n0` binding matched and one label element existed. The `commercial/contact.ts` variants carry no word bindings, so the Task 12 note's "four content files" is two. 

**Fix.** `n5` becomes `n4` and `n10` becomes `n8` in both files. The three words stay the same (Contexto, Consulta, Conversación; Context, Inquiry, Conversation).

**RED to GREEN.**

- `sfc-runtime.spec.ts` `contact: its three words are bound to n0, n4 and n8` (fixme removed) failed with `Expected: 3, Received: 1` label elements.
- New content assertion in `scripts/contact-content.test.mjs` (both locales) failed on `n5` against `n4` and `n10` against `n8`. No other test asserted the old ids: the host and label tests use their own bindings.
- After the fix both pass.

## Rendered check (headed Chromium on the real GPU, runtime candidate export of this head)

Probes: the Task 18 evidence scripts `pause-probe.mjs` and `label-probe.mjs`, plus a local probe that lists labels and photographs the focus ring. Screenshots are local, not committed: `D:/Projects/NextJS/Portfolio/.worktrees/sfc-18-evidence/sfc22/` (`contact-{es,en}-{wide,compact}-top.png`, `contact-{es,en}-{wide,compact}-pause-focus.png`).

- **Pause control, 1440 and 390, es and en:** the full border is drawn and `elementFromPoint` at the four corners and centre is the button. Focused with the keyboard, the 3 px ring is complete on all four sides (viewed at 1440 en and 390 es).
- **Labels, wide, es and en:** all three label elements exist (`n0`, `n4`, `n8`). At rest, `n4` and `n8` (Consulta/Inquiry and Conversación/Conversation) are visible in the right margin and under no mask; `n0` is hidden at rest, because its position at the left margin falls inside the introduction backing, which the host does by design. While scrolling the full page, all three reach full opacity at some position (es and en). Before this packet Contact showed no label at all.
- **Labels, compact (390):** two elements (`n0`, `n4`), both reach full opacity during a full scroll, es and en. On this candidate compact was also live, as the runtime patch enables it; Task 18 enables wide only.
- **Label occlusion:** `label-probe.mjs contact:en,contact:es`: 351 and 349 frames sampled, **0 violating label-frames** in both, with the words now present.

## Visual baselines

The first CI run on the PR head `84d9104a` ([Quality run 39328465311](https://github.com/Furlanich/Portfolio/actions/runs/39328465311)) passed `validate` and browser shards 1 to 3; shard 4 reported **2 failed, 753 passed**: exactly `Spanish Contact compact visual baseline` and `English Contact compact visual baseline` (`tests/e2e/visual/contact.visual.spec.ts`), failing on both attempts with byte-identical actuals. The wide cases passed. The changed pixels are the intended change: the static "Static background" / "Fondo estático" label now sits inside the taller dark introduction backing at 390 wide, and the page is otherwise as before.

**Owner approval, 2026-10-19**, relayed by the Task 18 session that started this one: "I approve the new Contact compact baselines in PR #165. Have the Task 22 session adopt them and push." Adopted: `contact-es-compact` and `contact-en-compact`, Windows and Linux (four files). Nothing else was updated.

- Linux: the `contact-{es,en}-compact-actual.png` files of that run's artifact `playwright-report-shard-4-39328465311-1` (artifact ID 12223758266), downloaded into a new empty directory, committed under the exact Linux snapshot names. The two retries of each case were byte-identical; the size stays 390 by 844.
- Windows: regenerated locally with `--update-snapshots` for the two cases only (`-g "Contact compact visual baseline"`), then the whole Contact visual spec ran in compare mode with no update flag: 4 of 4 passed.

| Baseline | SHA-256 (first 16) |
| --- | --- |
| `contact-en-compact` Linux | `EA0EA76478B47D64` |
| `contact-es-compact` Linux | `C3558E15109BBB0E` |
| `contact-en-compact` Windows | `4E6D84E109163C8D` |
| `contact-es-compact` Windows | `28DEF695749943AC` |

## Validation

- `node --test scripts/contact-content.test.mjs`: passes (6 tests, both new assertions green).
- `sfc-runtime-chromium` with `SFC_TEST_MODE=candidate` at this head (runtime candidate applied, then restored; `prepare-sfc-candidate.mjs verify-clean` is part of validate): **69 passed, 5 failed (16.7 min)**. The five failures are the ones [Task 20](task-20.md) recorded as pre-existing and identical without its fix: three stale `contact form signal` cases and two `direct Contact with the live graph (Task 13)` cases whose `openActualContact` never calls `enableLiveForTest` (the trace for the one I read ends in `expectLive` inside `openActualContact`). I did not re-run them on `main`, and none of them touches the Pause slot or word ids. All three Task 22 cases, every Task 12 label case and both Task 12 scrim cases for Contact pass.
- `npm run validate` (docs:check, 976 node tests with 0 failing, lint with 0 errors, typecheck, build): exit 0 at the head before this receipt commit.

## Open items

- The numbering 22 and the Pause-fix shape (above) are for the planning authority and the owner.
- Only the two Contact compact visual baselines changed (next section); the two wide baselines are unchanged and pass.
- Phones, a screen reader pass and the owner's motion acceptance remain with the owner.
