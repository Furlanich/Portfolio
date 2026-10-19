# Task 20 / PR 20 — Remove the Contact Pause-control layout shift

**Status: repaired and verified on the runtime candidate. When the control mounts, the Contact static label is already hidden, and the live Contact pages record no layout shift.** The planning authority's acceptance of this packet number, independent Reviewer R and the human merge are OPEN.

Agent usage: primary Claude Opus 5.5 (`claude-opus-5-5`), Claude Code desktop session started by the Task 15 wide-tier session; subagents 0/0 (none). Independent review stays a separate session.

Branch/worktree: `codex/sfc-20-contact-pause-shift` in a Claude Code worktree (`.claude/worktrees/busy-noether-f08e26`), cut from `origin/main` at `84c5c98a`, the merge of PR #158 (Tasks 1 to 17). Targets `main`.

## Packet

The plan's lock and remediation protocol sends a finding outside an active packet's write set to a new numbered Task N / PR N starting at 20. The planning authority must author that packet. This receipt records the repair against the finding below and proposes the number. Until the planning authority accepts it (or renumbers it with the same diff), this packet's numbering is **OPEN**. No receipt, branch or record uses 20 yet. Several earlier findings are proposed for "packet 20 or later" without a number: the Contact word binding and the Pause-control clip from [Task 12](task-12.md), and the host in every Atlas page and Contact's 0.35 opacity from [Task 14](task-14.md). This packet repairs none of them.

| Field | Value |
| --- | --- |
| Finding | [Task 15](task-15.md), "Wide-tier preparation on released main (2026-10-19)" on `codex/sfc-15-wide-qualification`: Contact's Pause control shifts on activation, so every valid Contact run fails the wide tier's `clsEnhancement` limit of 0 |
| Base / dependencies | `main` at `84c5c98a`; blocks Task 15's wide PASS and therefore Task 18 |
| Owned paths | `components/contact/contact.module.css`, `tests/e2e/sfc-runtime.spec.ts` (one added describe and one import), this receipt |
| Locks | Local browser/GPU on the implementer's desktop for the candidate browser runs and the probe; no deploy, no measurement lease (the probe is diagnostic, not a hardware run) |
| Not touched | The master plan, the hardware collector, the host (`ConnectedStudioEnhancement.tsx`), Studio, Founder and every other page |

## Finding and cause

On the runtime candidate (`prepare-sfc-candidate.mjs apply --kind=runtime`, patch `live-policy.patch` SHA-256 `336853b2950a8e9223b8dff8e40d8950883cab77ba91729c0c8d1c86d621db33`, the same patch as the Task 15 smoke runs), Contact goes live and shows one layout shift right after activation. Its only source is `button[data-connected-pause]` in `#connected-pause-contact`, which moves left at the same height.

Cause, confirmed in code and in the browser:

- The server renders the static-background label in the reserved slot (`components/contact/ContactPage.tsx`).
- The host portals the Pause control into the slot when the scene goes live. It hides the label from a `useEffect` (`components/connected-studio/ConnectedStudioEnhancement.tsx`, the effect commented "Contact has no such rule"). A passive effect runs after the commit, and a frame can paint in between. During that frame the button sits beside the label. When the effect hides the label, the button moves left by the label's width.
- Studio and Founder never show that frame. Their CSS hides the label as soon as the control is in the slot (`.pauseSlot:has([data-connected-pause]) .staticLabel { display: none; }` in `studio.module.css` and `founder.module.css`). `contact.module.css` had no such rule.
- Browser confirmation: the RED case below reads the label's computed `display` in the same task the control is inserted. Without the rule it is `block`.

## RED → GREEN

New case in `tests/e2e/sfc-runtime.spec.ts`, describe "the Contact Pause control mounts without a layout shift (Task 20)", one test per locale. Each test loads the live Contact page at 1440×900 and at 1280×720 and asserts four things:

- one visible, named Pause control
- the static label hidden, and exactly one rendered child in the slot
- the label's computed `display` is `none` at the moment the control is inserted (a `MutationObserver`, so no host effect has run yet)
- zero enhancement layout shift (`observeEnhancementShifts`, the shared helper the Services/Projects responsive spec uses)

Runs: `sfc-runtime-chromium` (SwiftShader, `next dev`), `SFC_TEST_MODE=candidate`, runtime candidate applied.

- **RED** at `cf7980e7` (test only): 2 failed, both for the stated reason, `Expected: "none"`, `Received: "block"` at 1440×900.
- **GREEN** at the fix (`4e13ca23`): the two Task 20 cases and the six existing "goes live with a named Pause control" cases (Studio, Founder, Contact × es/en): 8/8 passed.

## Probe on the real GPU (production export of the candidate)

Root export of the runtime candidate served by `scripts/serve-static-export.mjs`. The probe was a diagnostic script kept outside the repository. It used headless Chromium 1.63 (Playwright) with `--use-angle=d3d11`, and the renderer read "ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 … Direct3D11)", so this is hardware WebGL, not SwiftShader. It recorded every `layout-shift` entry without recent input, with its sources, for 4 s after load. The desktop was not quiet, so these numbers are diagnostic evidence, not a Task 15 run.

| Build | Loads (es/en × 1440×900/1280×720) | Went live | Result |
| --- | --- | --- | --- |
| Before the fix (`cf7980e7`) | 8 (2 each) | 8 | One shift per load, about 5 ms after the control mounted (mount at 520 to 960 ms after navigation start). Only source: `button[data-connected-pause] in #connected-pause-contact`, dx −95 px (es) or −118 px (en), dy 0. Values: es 0.00049 / 0.00078, en 0.00077 / 0.00122 (1440×900 / 1280×720). Within 3 % of the Task 15 finding (es 0.00050 / 0.00080, en 0.00079 / 0.00125) and its smoke runs' 0.0007882 on Contact/en |
| After the fix (`4e13ca23`) | 12 (3 each) | 12 | **No layout-shift entry at all**, whole page, every load |

## Validation

- Candidate browser family at the fix, full `sfc-runtime-chromium` list (73 cases, one worker, 13.9 min): 63 passed, 3 skipped, 7 failed. None of the seven is caused by this packet:
  - `input on the Atlas routes › studio: an ordinary wheel scroll …` and `labels stay clear … › contact wide …` passed on an isolated rerun at the same head (load flakes; the wheel case's history is in [Task 12](task-12.md)).
  - The three `contact form signal` cases and the two `direct Contact with the live graph (Task 13)` cases fail **identically without the fix** (rerun with `contact.module.css` restored to `main`): 5 failed. The form cases wait for `form[data-inquiry-phase]`, which [ADR-CONTACT-DIRECT-CHANNELS](../../decisions/contact-direct-channels.md) removed. `openActualContact` never calls `enableLiveForTest`, so SwiftShader is refused and no canvas appears. [Task 14](task-14.md) already recorded the same five failures on its integration head.
- The candidate list is 92 cases in two files (90 before, envelope 180).
- `prepare-sfc-candidate.mjs restore --kind=runtime`, then `verify-clean`: "No QA candidate is applied and no QA marker is in application source."
- `npm run validate` with this receipt in place: exit 0. docs:check passed on 361 Markdown files, 121 document IDs and 38 Skills. `npm test` ran 954 tests: 953 pass, 0 fail, and 1 `todo` (the Task 14 Contact-opacity placeholder). Lint reported 0 errors and 282 warnings (the baseline). Typecheck and build passed.

## Not done, by design or by limit

- **No Task 15 hardware run.** Next, a fresh runtime candidate is built at the `main` head that contains this repair, a smoke run confirms `clsEnhancement` 0 on Contact, and the owner runs the wide `--batch` on a quiet desktop (Task 15 receipt, "Next steps").
- **The host's comment is now stale.** `ConnectedStudioEnhancement.tsx` says "Contact has no such rule". The effect stays correct (it still covers the fallback hold and gives the label back on unmount), but the comment belongs to the host's owner and is outside this write set.
- **Stale candidate cases (pre-existing, carried from Task 14).** The three `contact form signal` cases test a form that no longer exists, and the two Task 13 direct-Contact cases do not enable the live hook. They are not repaired here.
- **The Task 12 Pause-control clip is untouched.** It is in the same slot: `.pauseSlot`'s 16 px top margin sits under the scrim's 32 px opaque backing. It remains held by its `test.fixme` and needs its own spacing or stacking decision. This packet adds one rule and changes no spacing.
- **No visual baseline changes.** The static page is unchanged, because the rule matches only once the control exists. Live captures do not exist in the default matrix.
