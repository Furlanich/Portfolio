# Task 13 / PR 13 — Replace inquiry intake with direct contact

**Status: IMPLEMENTED; all affected visual baseline transfers APPROVED. Local CI repair checks PASS; independent/human PR review OPEN. Latest full Linux CI: [PR #154 checks](https://github.com/Furlanich/Portfolio/pull/154/checks).** Base: reviewed Task 12 merge 60b76daa07ed15b8b4a5432dc96043ee80ad689b (PR #153), Branch: codex/sfc-13-direct-contact, targeting codex/sfc-integration. On 2026-10-18 the owner explicitly replaced the form with email/WhatsApp and existing contact channels, requested the corresponding plan/documentation change, and removed Formspree/counsel decisions as prerequisites. [ADR-CONTACT-DIRECT-CHANNELS](../../decisions/contact-direct-channels.md) records the scoped supersession; prior ADRs and completed receipts are unchanged.

Agent usage: primary GPT-6 (resolved version/effort unavailable; previously authorized current-runtime exception); subagents 0/0 (none). Independent review remains a separate session. The execution/development Skills ran inline; no reviewer or implementer subagent was spawned.

Draft implementation PR: [#154](https://github.com/Furlanich/Portfolio/pull/154), open against codex/sfc-integration. Implementation commit: 4ee9322f. No merge or deployment has occurred.

## Delivered scope

- Both Contact routes import one locale-owned direct-contact source and the shared Server Component. The form component, form-specific types/styles, simulation/commercial outcomes and inquiry mode selection are removed. WhatsApp, email and phone use their existing native destinations without message prefill; Privacy and Founder links remain localized.
- Privacy describes actual direct communications, GitHub Pages and graphics session preferences. Canonical Privacy/Terms text equals typed modules and has no special processor/counsel publication gate. Terms publication remains Task 16. No unverified retention/deletion guarantee or legal certification is added.
- Incoming Home/Services/Studio copy no longer invites visitors to try a form. Product/design/architecture/glossary/index documents and future Tasks 16/17 are synchronized. Historical deep links remain under explicitly retired headings.
- Formspree account checks, counsel disposition, live probes, dashboard/Gmail/deletion receipts and readiness.json are NOT APPLICABLE. None was supplied or inferred; no real message/call/account mutation occurred. Dormant pure inquiry libraries and their tests remain outside the public Contact import path and cannot reactivate it through an environment value.

## Verification

- RED: both Contact objects retained form values and the routes selected inquiry mode; three intended assertion failures. GREEN: direct Contact content/routes, 4/4; export/route/content group 8/8.
- RED: old Privacy sections and counsel-gated legal metadata; three intended failures. Canonical/legal/privacy group then passed 6/6. A further RED/GREEN removed the special publication gate entirely; canonical/legal 4/4 passed.
- Full Node suite: 828 passed. Lint: 0 errors, 282 existing warnings. Typecheck passed after correcting the Privacy helper call and retaining the axe import used by the unchanged runtime checks.
- Production root build passed; static export verified all 14 current foundation routes. Terms remain unpublished until Task 16. Emitted HTML/JS contained no Formspree endpoint or simulated-submit wording.
- Served-export browser matrix at root: 105 distinct cases in Contact, Privacy, legal, homepage smoke and Services referrals across Chromium/Firefox/WebKit. Initial 103 PASS and two WebKit keyboard expectation failures; both corrected cases then PASS. The host does not Tab to links by default, as already documented in Playwright QA. Exact Tab order is verified in Chromium/Firefox; WebKit verifies native focus, activation, source destinations and accessibility without overriding host settings.
- Both Contact locales cover genuine hrefs, no form controls/provider requests, visible focus, no-JavaScript behavior, locale/Privacy navigation, 320/390/768/820/1024/1440px reflow, enlarged text/spacing, forced colors and no serious/critical axe violations. No message or call was sent.

## Rendered review and baseline boundary

Contact and Privacy captures were produced in reduced-motion Windows Chromium at 1440×1000 and 390×844, both languages. The eight existing visual comparisons FAIL on the intentional removed form and changed Privacy copy. Approved baselines were not replaced. Owner design approval is required before baseline replacement under [visual regression policy](../../testing/visual-regression.md); Linux images must come from the matching CI environment. Related Home/Services/Studio referral subjects also need review when their affected goldens are refreshed. This is an open visual acceptance item, not a passing screenshot suite.

Current local review images are in the task's authorized visualization directory under task13-artifacts; test logs/reports remain ignored. Visual judgment checks typography, hierarchy, Bone contact surface, native action prominence, readable locale copy and unclipped reflow separately from automated assertions. All eight locale/viewport captures were inspected: approved Atlas typography/ground and opaque legal/Bone surfaces remain readable; no clipped text or horizontal overflow was observed. Contact links follow the explanatory block on compact and remain visible when scrolled; full compact captures confirm all three actions and Privacy/Founder links. Existing old goldens and produced differences establish the intentional form/Privacy change. No new golden is approved by this author.

## Environment and remaining review

Clean npm installation could not complete with the environment's registry access. Dependencies are an independent file copy of an existing installation with the byte-identical lockfile; npm ls confirms declared versions. No node_modules junction or temporary Next configuration is used. An accidental dependency install in the primary checkout was stopped and its ignored dependencies restored from the matching installation; npm ls passed and primary tracked files stayed clean.

Final npm run validate passed (828 Node tests, lint 0 errors/282 existing warnings, typecheck and Turbopack production build). Both root and /Portfolio builds and static-export verifiers passed for all 14 current foundation routes. The /Portfolio served-export browser matrix passed 105/105 in Chromium/Firefox/WebKit after the documented WebKit harness correction; combined with root, all 210 route/profile cases are verified. Complete compact screenshots were also captured, 2/2.

Complete-diff self-review passed for scope, native links, narrow client boundary removal, canonical/public disclosure consistency, removed-state test coverage, preserved graph/historical ADR boundaries and absence of credentials/generated source. The independent Reviewer R and human merge are still OPEN; the PR is a draft while intentional visual baseline approval is pending. Existing Task 12 graph/Contact Pause findings are not claimed resolved by removing the form. No hardware qualification or deployment is claimed.

## Owner follow-up — channel icons and alignment, 2026-10-18

The owner requested WhatsApp, mail and phone icons at the left of the corresponding Contact buttons, with all buttons aligned. Both locales now share server-rendered decorative 20px SVGs, the same left inset, centered labels and equal button widths/heights. Matching side columns preserve label centering, and equal list rows accommodate wrapped text. PAGE-CONTACT owns the detailed contract; DESIGN-SFC-V1 references it. No dependency, client boundary or contact destination changed.

- RED: the two locale alignment cases failed against the preceding export because no SVG was present. Initial GREEN checking exposed a WebKit nested-grid resize defect: the wrapped label's row grew while its button retained its previous height, shifting the icon by 11.195px. A focused geometry reproduction confirmed the cause. Using a flex wrapper for each grid link corrected both growth and shrinkage; no assertion tolerance or coverage was weakened.
- Final `npm run validate` PASS: 828 Node tests, lint 0 errors/282 existing warnings, typecheck and `/Portfolio` production build. `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run verify:static-export` PASS for 14 routes. The existing Browserslist age, Node module-type and terminal color notices are environment warnings.
- Final served-export Contact matrix PASS, 33/33 in Chromium/Firefox/WebKit. The six locale/engine geometry cases cover 320/390/768/820/1024/1440px, enlarged text/spacing and forced colors: equal button edges/heights, identical 20px icon slots/left insets, vertical icon centering, centered labels and contained content. Native links, focus/navigation, no-JavaScript availability and axe checks also pass. The graph-candidate Contact spec uses the same alignment helper; that candidate runtime was not rerun for this follow-up.
- Reduced-motion Windows Chromium captures PASS, 6/6, both locales at 320/390/1440px. All six actual Contact panels were visually inspected: icons are recognizable, consistently colored and aligned; labels remain readable and centered, including the two-line WhatsApp labels at 320px. Review images are `task13-artifacts/contact-icons-{es,en}-{320,390,1440}.png` in the authorized visualization directory, with full compact captures alongside them. Automated geometry and visual judgment are separate evidence.
- Follow-up diff/React self-review PASS: server-compatible icons, decorative accessibility, unchanged native destinations, scoped CSS, shared browser assertions and synchronized owners. Agent usage remains primary GPT-6; subagents 0/0. Approved visual baselines remain unchanged; independent/human review and visual baseline approval remain OPEN on draft PR #154.

## Owner visual baseline approval — 2026-10-18

The owner explicitly stated, “Excellent, I approve the visual baseline,” following the bilingual Contact icon/alignment delivery. Approval applies to the direct-contact presentation at implementation head `532a612b7b1629ba1acc1b6350d5cd7e757d4396`, including WhatsApp/mail/phone icons, equal button dimensions and centered labels. This closes the earlier OPEN Contact design/baseline approval in this receipt. Privacy/referral visual review and independent Reviewer R remain OPEN.

The four Windows Contact PNGs were regenerated with `NEXT_PUBLIC_BASE_PATH=/Portfolio`, `PLAYWRIGHT_SERVE_EXPORT=1` and the existing focused visual profile: `node node_modules/@playwright/test/cli.js test contact.visual.spec.ts --config .playwright/direct-visual.config.ts --update-snapshots --workers=2`. The identical command without `--update-snapshots` then passed 4/4. Both runs use the repository Contact visual spec and its `visual-chromium` snapshot naming, reduced motion, device scale 1, `es-AR` browser locale and UTC timezone. Application code and capture expectations remain at the approved implementation head.

All four previous expected images, approved actuals and exact pixel diffs were inspected. Changes are confined to the form replacement and Contact surface; header/introduction/background retain their approved rendering. Full compact panels and all three icons were inspected in the preceding follow-up evidence because compact viewport snapshots capture the top of the Contact surface. Local comparison triptychs live under `task13-artifacts/baseline-approval/` in the authorized visualization directory.

| Windows Contact baseline | SHA-256 |
| --- | --- |
| `contact-es-wide-visual-chromium-win32.png` | `A2C4BF1E780955B7543DA5423CA1773D4D255129142B3B80D067568D583C8A36` |
| `contact-es-compact-visual-chromium-win32.png` | `389515A3C89686B7174D381D836ECAD618EC9BF956E0C9E27B1D4FBBBF65538F` |
| `contact-en-wide-visual-chromium-win32.png` | `50A5209ADE177099A966EB92951A96D7208EAA1D7E161E2723A629D15F4BE947` |
| `contact-en-compact-visual-chromium-win32.png` | `64487D6B92B446933B3E12FA0B000A2BA0A0DBFA5D97A652E44145ACF5D3B48B` |

Linux Contact refresh is PENDING controlled same-head captures from [Quality run `39096372107`](https://github.com/Furlanich/Portfolio/actions/runs/39096372107), at the approved implementation SHA above. Its validate job passed; its browser jobs were still running when this approval was recorded. The existing Linux form images remain historical until the matching actuals can be inspected/adopted and verified without snapshot update mode. Draft PR #154 retains the remaining review items. Agent usage: primary GPT-6; subagents 0/0 (none).

## PR #154 browser CI repair — 2026-10-18

The owner requested investigation and repair after [Quality run `39096779995`](https://github.com/Furlanich/Portfolio/actions/runs/39096779995) at head `2d7dc3945c4a51eb87fdbdb4fa967b4fb68f4999` failed all four browser shards. The validate job passed. Browser totals were 2,762 passed, 25 failed and 130 skipped: five executions of one stale shared Footer assertion, plus 20 Linux screenshot mismatches. No runtime/navigation/accessibility defect appeared in those failures.

The shared assertion still required the removed Home demonstration invitation and simulated Contact submission buttons. It reproduced locally in Chromium at `/Portfolio`. It now requires each locale's approved Home referral and Contact destination, exactly three visible native channel links with their expected hrefs, absence of form controls and simulation copy, and the existing Footer claim boundary. The corrected case passed in all five failing projects: Chromium, Firefox, WebKit, mobile Chromium and compact-320 Chromium.

The screenshot mismatches are the approved form removal and Privacy/referral text changes. Linux sources are the exact `*-actual.png` files in `playwright-report-shard-4-39096779995-1`, artifact ID `12124249987`, generated at the head above in `mcr.microsoft.com/playwright:v1.63.0-noble`. All 20 subjects are byte-identical between their initial attempt and retry. Windows normal comparison reproduced the remaining 16 stale subjects while the four previously refreshed Contact subjects passed.

Automatic approval review initially rejected the 32 non-Contact baseline replacements because only Contact approval was recorded. After expected/actual/diff comparisons were prepared and inspected, the owner explicitly answered, “Approve all 16 cases on both platforms.” This closes the preceding Privacy/referral visual-approval items and authorizes the exact Home CTA (6), Privacy (4), Services (4) and Studio (2) cases on Windows and Linux. Contact's four Linux replacements use the existing Contact approval. Review images are under `task13-artifacts/ci-baseline-review/`; original CI and Windows RED reports are archived beside them. The application, screenshot tolerances, workflow, time limits and test selection are unchanged by this repair.


### Local repair verification

- `npm run validate` PASS: 828 Node tests, lint 0 errors/282 existing warnings, typecheck and production build at `/Portfolio`. Clean-candidate verification and `npm run verify:static-export` PASS for all 14 current foundation routes.
- The corrected shared case passed 5/5 using the unchanged repository Playwright config and its five failing projects. The local RED and CI assertions identify the same obsolete demonstration invitation.
- The five affected visual specs ran through the unchanged `visual-chromium` project at `/Portfolio`, filtered to the 20 named cases, with `--repeat-each=2 --workers=2`. Normal comparison PASS 40/40, with no snapshot update mode. All 36 replacement PNGs match their reviewed source hashes; the four previously approved Windows Contact PNGs remain the same.
- The repair diff contains the shared assertion, the 36 approved PNG replacements and approval/provenance records. Review confirms positive bilingual native-link coverage, no added skips, no weakened pixel thresholds and no application/workflow/dependency changes. Generated Next dev type references are restored before commit. Agent usage: primary GPT-6; subagents 0/0 (none).
- Full Linux CI at the repair head is required before declaring the CI issue resolved. The latest result is owned by [PR #154's checks](https://github.com/Furlanich/Portfolio/pull/154/checks); its description records the immutable verification run/head and per-shard result. Independent review and human merge remain OPEN.

### CI repair baseline hashes

Each case names `<case>-visual-chromium-{win32,linux}.png` under its existing visual spec snapshot directory. Windows Contact hashes retain the preceding approval; the remaining 36 PNGs are the bounded CI repair.

| Case | Windows SHA-256 | Linux SHA-256 |
| --- | --- | --- |
| `contact-en-compact` | `64487D6B92B446933B3E12FA0B000A2BA0A0DBFA5D97A652E44145ACF5D3B48B` | `AB35A87AC00F237AD869AB419D9BFE351BD3B910333DABEA8C64BE0EB4822D6E` |
| `contact-en-wide` | `50A5209ADE177099A966EB92951A96D7208EAA1D7E161E2723A629D15F4BE947` | `9E15A899B0C4E1D7222D46480B54032E6A5673DC0A4780A786A5C7BC68B0B754` |
| `contact-es-compact` | `389515A3C89686B7174D381D836ECAD618EC9BF956E0C9E27B1D4FBBBF65538F` | `155564C920F5F6E4F3FD9A7B314201FEC138BFFD1965ECF3F9B9CE18FF2B6C95` |
| `contact-es-wide` | `A2C4BF1E780955B7543DA5423CA1773D4D255129142B3B80D067568D583C8A36` | `DDB17ED7BAA9E01121E4ABEEC154FD164B9409173F344E78AD54AD9E6C2E0BF0` |
| `home-cta-english-1440` | `564596D5F65C6403E63A0CC880E61A0D4C1077B2D8D9482E62F71D8776D6645B` | `AE2628A595DC380411F2E50A16A282C27D8B61AF55E81AF6144C92392DDEC455` |
| `home-cta-english-390` | `6FFA4B01D1543E6356D01EA2CE8EE43BC00D62C95280A8058A5AFC8F0B9F2A25` | `9DDFE41FAADF2B09A08EDC3D4E3645F6B863A91EEDD11BED829E3501C6CBF286` |
| `home-cta-english-768` | `129BF96FEEE30364DDA105CDE268AB1785CA91A8E83FC8CBA2E0BA8EFAADCCC4` | `62E18F04B6F4ECBFDDC433050A104CDFDB30D1D6C126876D740417E1822D7F6B` |
| `home-cta-spanish-1440` | `9313AF69D65753ABCCCC3CBABBA03ACF1D702A6902B0E313FF7FD095C24692D6` | `1BB0C48CE01EE66A5DD38C6A3E28496B0C277A336A3D5AF216CABF86F88C80C7` |
| `home-cta-spanish-390` | `CC7876271A5F9B437CCB38EE0B8D7BC98DB973B58A0A6EE77EC808A7360AD8B3` | `0D0E38F3E0E1654963D4813E90ECFD29E09738DF8417D5CEE392076D4CD13C7C` |
| `home-cta-spanish-768` | `305CAB16A10E861E1D6323213D5C94C59C73D1DC815A34468C691B27B9C008AA` | `4ACE6F85C7D9958EE12EF6BF8C8CE62F30FD84DA3BFCDB9D3E6FCE701A5F5F10` |
| `privacy-en-compact` | `A8C0FE07389241944D38CA1B6BFD05952D8153B90682DB724981CA73355C308C` | `1E09B44A9438F00E0CB74E72A713271B203F02E16F36A126D3C92D2910D2F453` |
| `privacy-en-wide` | `CCDB528476C1080213546D394E674C2DDBBB51CD1C9BCC5519B18D91A73BBCD3` | `236E58AAC65DABDE30B6ECEC4DA2E7C1B7543D0A7026DADF20462683C2179818` |
| `privacy-es-compact` | `446F99D75CBBD568A552E9856028BC546808DAC07405A017B0C0825BE5CDA94C` | `DA838C92E1886BBF1979E13CE5654601B230F822F5562E9D75ECA2E605F28816` |
| `privacy-es-wide` | `47988E79023AFD3C1AF353DAB755F6BCEAF8909C9D11715EFA96D80A37E170F8` | `7614577A5793F16A128C517F90876151BE6674B115D26D85B0CA5E15C7484A07` |
| `services-compact` | `77340949257BD80FE4ECDACFDE1B60EB002EBAFD671A361CE2134E63E7D492EF` | `9951F0B741AA8BCB3FE20E3775D84D9C91B1405C9E329192126CC5140DED7386` |
| `services-english-compact` | `8131F7B3EACDA5337FEE832EE6F6D43AE2D539BCEB1AB1D8C25A050A7B6B1EBC` | `F0AF41037EB1993466350CD7DB9AE13CC086809168233A76907EBEBF33C75D4B` |
| `services-english-wide` | `1CF3191CE9FB310794F7DDA901AB45B577695D8725ADB8B1F8DF1D1C77185474` | `F28D5ADD7894D2A2F1966D985E38E3EC2F36DD2ABAFB18CE3AEB7A95F2F6339D` |
| `services-wide` | `F5945B7A209F47879AFBE394814E7E2C084B5698F61BCE7BAA26FA3FA69DE85E` | `D80A342D5C99AD7CD07AC8F92F011A9642D97CFA420B550862EF924FED17E969` |
| `studio-compact` | `95A2A0D021C9E43B72635E63FF4AF8EBE9824FF6C8EA0E1AF6671622998C3CB9` | `FE53E76A9D17CA5B18F15272FAA4A18D0708D4753A9A1614F8D484A37DFF8333` |
| `studio-wide` | `D7E07EB18C197CF738BB4ACD20B218A51AF5589F30BFF46FEA6FFA03FF87857C` | `15499FF042FFB5C96280F4590CE36095CF755DDA79CF5229BE49218F42A4A027` |
