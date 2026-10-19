# Task 17 / PR 17 — Verify deployed direct contact and disclosures

**Status: PASS. The deployed Spanish and English Contact, Privacy and Terms pages match the reviewed build, the direct links are exact, and no form, provider request, simulation or draft wording is public. Read-only: no message was sent, no call placed, no account touched, nothing deployed or rolled back.** Independent Reviewer R and the human merge are OPEN.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`; the session does not expose reasoning effort, so "High" is not attested); subagents 0/0 (none). The plan assigns this packet to GPT-6 Luna High; see the first ruling. Independent review stays a separate session.

Branch/worktree: `codex/sfc-17-deployed-intake` at `D:/Projects/NextJS/Portfolio/.worktrees/sfc-17` (the plan's verified fallback), cut from `origin/main` at `5d8055a3`, the merge of [PR #157](https://github.com/Furlanich/Portfolio/pull/157). Task 17 targets `main`, as the plan's release strategy states for packets 17 to 19. The plan was read from that head, because the local `main` checkout predates the 2026-10-18 direct-contact amendment and still carries the form-based Task 17.

## What was verified

Observation date 2026-10-19, public site `https://furlanich.github.io/Portfolio/`. Details, the deployed identity and the decision are in [release-checkpoint.md](release-checkpoint.md); the recovery path is in [operations.md](operations.md).

| Check (plan Task 17 item) | Method | Result |
| --- | --- | --- |
| Deployed build is the reviewed build | `gh-pages` head `da2f6a58` is `deploy: 5d8055a3…`; [deploy run 39201533556](https://github.com/Furlanich/Portfolio/actions/runs/39201533556) succeeded on that merge | PASS |
| Live pages equal the deployed files | `curl` of six routes against the `gh-pages` tree of that commit, `cmp` | PASS, six of six byte-identical |
| Deployed artifact meets the repository's own contract | `verify-static-export.mjs` against an archive of the `gh-pages` tree, `NEXT_PUBLIC_BASE_PATH=/Portfolio` | PASS: "Static export verified: 16 routes, base path /Portfolio" |
| Contact ES and EN: one H1, one main, no form controls | Live DOM in the built-in browser | PASS: one H1 and one main on each; zero `form`, `input`, `textarea` or `select` |
| Exact destinations, no prefill | Live DOM and raw HTML | PASS: `https://wa.me/5491150117565`, `mailto:samuelfurlanich@gmail.com`, `tel:+5491150117565` on both locales, no query string or message text; the same three also appear in the Footer |
| No provider request, no storage | Resource timing and `sessionStorage`/`localStorage`/`document.cookie` on load | PASS: every request goes to `furlanich.github.io`; no Formspree string anywhere in the six documents; storage and cookies empty |
| Locale, Privacy, Terms, Footer links | Live DOM | PASS: ES↔EN Contact switch resolves both ways; Contact links Privacy; the Footer links Privacy and Terms in both locales with the `/Portfolio` base path; Privacy and Terms link each other |
| No-JavaScript usability | The six routes' raw server HTML (no script executed) | PASS: copy, three channel links, legal sections, contents anchors and reciprocal links are all in the document |
| Contact copy equals the page owner | Ten approved strings from PAGE-CONTACT searched in the raw HTML | PASS, each found exactly once |
| Privacy describes actual direct communications and technical preferences | Live headings and text against `_content/commercial/privacy.ts`; byte-identical to the deployed file | PASS: responsible party, direct contact (Gmail, WhatsApp, calls), GitHub Pages hosting and IP logging, session preferences, sensitive-information caution, data requests by email |
| Privacy's preference statement is true | Observed `sessionStorage` after load; code search for storage use | PASS: the only storage use in source is the Home graphics-failure flag and the connected pause session keys, both session scope; nothing stored on a plain load |
| Terms published with metadata | Live `<title>` and `<meta name="description">` | PASS: "Términos y condiciones \| FURLANICH" and "Terms and Conditions \| FURLANICH" with specific descriptions; update date 18 de octubre de 2026 / October 18, 2026; seven sections each |
| No draft, simulation or processor wording | Whole-page text of Contact, Privacy and Terms, both locales | PASS: my first pattern matched only "information", "informado" and "podemos"; a context dump of every match showed no form, demo, draft, simulation, Formspree or counsel wording |
| Retired routes stay 404 | `curl` status | PASS: `/proyectos/` and `/en/work/` detail routes (three each) and `/servicios/proceso/` return 404 |

## Validation

This packet changes only documentation. `npm run docs:check` exit 0 (355 Markdown files, 121 document IDs, 38 Skills); `git diff --check` clean. The Node suite, lint, typecheck and build were not rerun: no source, test or configuration file changed, and the deployed build they would exercise was verified directly above.

## Not done, by design or by limit

- **No message, call or inquiry probe.** The plan forbids it; the opened links were read, never activated.
- **No manual screen-reader pass.** NVDA and VoiceOver remain a human-operator item named in the plan's verification matrix; axe was not rerun against the live site (it ran on the identical export in Task 16, and the build is byte-identical).
- **No keyboard traversal of the live page.** Source order follows the DOM list captured above; focus behavior is covered by the Task 13 and 16 browser specs against the same code.
- **No counsel decision.** None is required by [ADR-CONTACT-DIRECT-CHANNELS](../../decisions/contact-direct-channels.md); this receipt certifies no legal sufficiency.
- **The graph tiers.** Both policy flags remain false; that is Task 15 and 18 territory and is not observed here beyond the absence of host code.

## Observations (not failures)

- Contact and Privacy still carry the layout default `<title>FURLANICH</title>` and no meta description, as they did before the redesign (`cd8c0d45` has no page metadata for either). The plan and design specify metadata only for Terms. Left unchanged; a product change would need its own task.
- No page emits `hreflang` alternates or a canonical link; the same on every route, and outside this scope.

## Rulings

- **Model.** The plan assigns Task 17 to OpenAI GPT-6 Luna High, and the routing rule says a mismatch "stops dispatch for explicit resolution". The owner started this session on Claude Sonnet 5.5 and told it to begin Task 17, which I took as that resolution, consistent with the exceptions already recorded for Tasks 1, 13 and 16. Cost if wrong: Reviewer R or the planning authority may have Luna repeat these read-only observations; the commands are listed above and take minutes.
- **Plan version.** The form-based Task 17 text in the local `main` checkout is superseded by the 2026-10-18 amendment on `origin/main`; I followed the amended text (read-only routes, links and disclosures) and wrote no `deployed-inquiry.md`, which the amended owned paths no longer list. Cost if wrong: none.
- **Index not edited.** `index.md` is a coordinator checkpoint file, outside this packet's owned paths, so the receipt list and delivery table there do not mention Task 17 yet. The coordinator adds it at the next quiescent checkpoint.
- **`operations.md` scope.** With the form gone there is no quota, inbox or deletion runbook; the file records the actual recovery path (deploy mechanism and the two rollback routes) and what is NOT APPLICABLE, without inventing a retention or response-time guarantee. Cost if wrong: Samuel may want operating notes (for example inbox habits), which are his to state.

## Open items

- Reviewer R and the human merge of this documentation PR.
- Task 18 may now proceed on the dependency "17 PASS", subject to its own gates (15 PASS for the proposed tier, which this packet does not decide).
- Plan text still says "execution NOT AUTHORIZED" in its status block; only the planning authority changes that.
