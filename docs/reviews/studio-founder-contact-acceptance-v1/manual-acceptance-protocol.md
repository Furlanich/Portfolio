# Manual acceptance protocol (PLAN-SFC-V1 Task 27)

Status: **protocol and result sheets written; no manual check has been performed.** This file tells a person how to run the checks the plan left undone and gives them the sheets to fill. Every cell is blank, which means **NOT RUN**. The [Task 27 receipt](task-27.md) records what was automated and what is still OPEN; it does not turn a blank cell into a result.

What this is for: the wide interactive tier is live on the public site by owner acceptance ([Task 15](task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19), [Task 18](task-18.md)), and the [Task 19 closeout](task-19.md#what-stays-open) left four things open that only a person with the right device can settle: screen-reader passes, a physical phone pass, Firefox and Safari behavior on real hardware, and Firefox/WebKit timing. This protocol packages them for the owner or a named operator. It is **evidence only**: nobody changes code, tests, workflows or fixtures while following it, and a failure is recorded, not repaired here (a failure starts a numbered remediation packet, as in the [hardware protocol](hardware-protocol.md) section 8).

## Rules that do not bend

- **Listening is the test.** Axe, Playwright accessibility-tree dumps and the DOM listing in Appendix A show what *should* be exposed. They never replace a person hearing what a screen reader says. Appendix A is the answer key, not a result.
- **Record what you heard, not what you expected.** In the Notes column write the speech verbatim for anything that differs, sounds odd, is missing, repeats, or is announced when nothing was activated. A short honest FAIL is worth more than an unexplained PASS.
- **A browser engine is not a browser.** Playwright's WebKit, Firefox and Chromium builds (the automated Task 27 evidence) are not Safari, your installed Firefox or your installed Chrome or Edge, and no result from one stands in for the other.
- **A simulator is not a device.** An iOS Simulator, a desktop browser's mobile emulation or a screen-reader speech viewer on a desktop stand in for nothing in section 6.
- **Blank means NOT RUN.** Use only `PASS`, `FAIL`, `N/A` (the item does not exist on that page or state) or `BLOCKED` (you could not reach it; say why). Never fill a cell for a page you did not open.
- **No real contact.** Activating WhatsApp, email and phone links is allowed only up to the app's own compose or confirm screen. Do not send a message, place a call or open a conversation with the owner's number. The site has no form, so there is nothing to submit.
- **No fix in the same sitting.** If something fails, finish the sheet, then report it. Do not edit the site, a browser setting that caused the failure, or the sheet's earlier answers.
- **Each result is a cohort.** Results are for the build that was deployed when you ran them. Write the deployed commit or the visible build date in the session record; if the site is redeployed during a session, start a new session sheet.

## 1. Before you start

The live graph only runs for a visitor who meets every condition below (`lib/connected-studio/capability.ts` and `components/connected-studio/ConnectedStudioEnhancement.tsx`). If one is off you get the complete **static** page, which is correct behavior and is checked separately:

| Condition for the live graph | How it can silently switch you to static |
| --- | --- |
| Viewport at least 768 CSS px wide (the tablet and wide tiers share the live policy; compact is static) | A phone, a narrow browser window, a high browser zoom |
| `prefers-reduced-motion` is not set | Windows "Show animations in Windows" off, macOS or iOS "Reduce Motion" on, Android "Remove animations" on. Many screen-reader users have this set |
| Save-Data is off | Data saver in Chrome or Edge |
| Forced colors are not active | Windows contrast themes or "Increase contrast" |
| WebGL2 exists and the renderer is not a software renderer | A remote desktop, a virtual machine, a driver reset |

For the **live** rows, turn those settings off, reload, and confirm the Pause control exists on a connected page before you listen (it is the only visible proof; the scene is decorative). For the **static** rows (the last two rows of each session table), turn reduce motion **on**, reload, and confirm the Pause control is absent and on Studio, Founder and Contact a plain `Static background` / `Fondo estático` line is where the control would be (Services and Projects show nothing there). Put the state of each setting in the session record.

Fixed setup for every session:

1. A current build of the deployed site: <https://furlanich.github.io/Portfolio/>. Note the date and time; the footer has no version, so the date is the cohort.
2. Window or viewport about 1440×900 for desktop sessions. Do not zoom the page.
3. Keyboard and screen reader only for the item checks; a mouse is allowed to reach the first page.
4. A quiet machine for the timing section (section 7). Screen-reader sessions do not need one.
5. One operator name per session sheet. A second person may run a second session, not edit the first.

## 2. Pages to open

All deployed URLs, Spanish and English pairs. The base path is `/Portfolio/`.

| Page | Spanish | English | Live graph on a wide window |
| --- | --- | --- | --- |
| Studio | <https://furlanich.github.io/Portfolio/estudio/> | <https://furlanich.github.io/Portfolio/en/about/> | yes |
| Founder | <https://furlanich.github.io/Portfolio/estudio/samuel-furlanich/> | <https://furlanich.github.io/Portfolio/en/about/samuel-furlanich/> | yes |
| Contact | <https://furlanich.github.io/Portfolio/contacto/> | <https://furlanich.github.io/Portfolio/en/contact/> | yes |
| Services | <https://furlanich.github.io/Portfolio/servicios/> | <https://furlanich.github.io/Portfolio/en/services/> | yes |
| Projects | <https://furlanich.github.io/Portfolio/proyectos/> | <https://furlanich.github.io/Portfolio/en/work/> | yes |
| Privacy | <https://furlanich.github.io/Portfolio/privacidad/> | <https://furlanich.github.io/Portfolio/en/privacy/> | no (reading page, static backdrop) |
| Terms | <https://furlanich.github.io/Portfolio/terminos/> | <https://furlanich.github.io/Portfolio/en/terms/> | no (reading page, static backdrop) |
| Home (not in scope, start page) | <https://furlanich.github.io/Portfolio/> | <https://furlanich.github.io/Portfolio/en/> | yes |

The language switch in the App Bar is `View site in Spanish` / `Ver sitio en inglés`; it should land on the same page in the other language.

## 3. The items (what each column on the sheets means)

Run these on each page, in this order. `A` = Appendix A for that page.

| Column | Item | Listen for / do | PASS when |
| --- | --- | --- | --- |
| **T** | Page title and language | Load the page and let the reader speak. Note the title it announces and whether the voice matches the language (`es-AR` pages should be read with a Spanish voice, `en` pages with English). | A title is announced; the language is right. Record the title. **The deployed titles are mostly the bare brand `FURLANICH`** (see Appendix A); mark FAIL only if the announced title is empty or in the wrong language, and write the text you heard so the planning authority can judge distinctness. |
| **L** | Landmarks | Open the landmark list (NVDA Elements list, VoiceOver rotor, or the tool's landmark navigation: `D` in browse or scan mode). | A banner, a navigation named `Primary navigation` / `Navegación principal`, exactly one main, the page-specific navigation or header named in A, and a footer with a navigation named `Explore` / `Explorar`. At a 1440 px window only **one** primary navigation is visible; a second, empty or duplicated one is a FAIL. |
| **H** | Headings | Open the headings list, then step through with `H`. | One H1 first; the H2 and H3 outline matches A in order and names; no skipped levels; nothing read as a heading that is not one. |
| **K** | Links and order | Open the links list, then Tab through the page from the top. | The sequence matches A; every name makes sense out of context; the language switch says which language; the service-index cards on Services read as one understandable link each (their accessible name is the number, title, tagline and `Explore the service` joined, so note how it sounds). External links (LinkedIn, GitHub, WhatsApp, email, phone) say what they are. |
| **P** | Pause control (connected pages, live state only) | Tab to the control. Record exactly what is spoken on arrival, then press `Enter`, then `Space`. Record each announcement and what the focus does. | Reached in the position A gives; announced as a button, name `Pause background` / `Pausar fondo`; state not pressed. After activation the name changes to `Resume background` / `Reanudar fondo` **and** the pressed state turns on (the component sets both: the visible name states the next action and `aria-pressed` states the current one, so a reader may say something like "Resume background, toggle button, pressed"). Record the exact words and whether you find them contradictory. Focus stays on the button. No other announcement. Press again: back to the first name and not pressed. |
| **N** | Nothing announced that should not be | Listen to: page load; 30 seconds of doing nothing; scrolling by arrow and page keys; Pause and Resume; following an internal link. | No form, edit field, combo box, "busy", "loading", "alert", "status" or live announcement of any kind, no "canvas", "graphic", "image" or unlabeled object, and no speech you did not cause. (Measured on the DOM on 2026-10-20: zero form controls and zero `aria-live`, `role=status`, `role=alert` and `aria-busy` elements on all 14 pages. This item checks that what a reader does with that matches.) |
| **D** | Decorative layer is silent | In browse or scan mode and with the element lists, look for the scene words (the graph labels): Studio `Accountability`, `Scope`, `Specialists`, `Review` (`Responsabilidad`, `Alcance`, `Especialistas`, `Revisión`); Founder `.NET`, `React`, `Next.js`, `Blazor`; Contact `Context`, `Inquiry`, `Conversation` (`Contexto`, `Consulta`, `Conversación`); Services and Projects `Websites`, `Apps`, `Chatbots`, `Agents`, `Automation`, `Consulting`, `Support`, `Modernization` (`Sitios web`, `Apps`, `Chatbots`, `Agentes`, `Automatización`, `Consultoría`, `Soporte`, `Modernización`). Some of these words also appear in the real page text; the check is for the *extra* copy in the graph layer, so a word that is heard once from a heading or paragraph is fine and a word heard in a separate, label-like fragment is not. | They never appear in any list, in reading order, or by touch exploration. They are `aria-hidden` and belong to the decorative layer only. |
| **C** | Contents navigation (Privacy and Terms only) | Find the navigation named `Contents` / `Contenido`. Read it, then activate three entries including the first and last. | An ordered list of 6 (Privacy) or 7 (Terms) links whose count is announced; each entry moves reading to that section's H2, which is visible below the sticky App Bar; reading can continue from there; the reciprocal link (Privacy to Terms, Terms to Privacy) is reachable at the end of the article. Record whether the cursor or focus actually moved. |

The place of the Pause control in the order differs by page and is given in A: after the intro links on Studio and Founder, first in the content on Contact, first on Services (before the service index) and after the two dossier shortcut links on Projects.

## 4. Sessions

Six sessions, one sheet each. Run the ones the owner names; each is independent and a missing session stays OPEN in the receipt. Sheet columns are the items in section 3. The two static rows at the end of each table repeat the rest of the items with reduce motion on; `P` is blank there because the control is absent, so write `PASS` only if you confirmed no button is present and, on Studio, Founder and Contact, that the `Static background` / `Fondo estático` line is read as plain text. Services and Projects have no such line in the static state (their slot is empty); mark that part N/A there.

| Session | Combination | Notes |
| --- | --- | --- |
| A1 | NVDA with Firefox, Windows | Use the current NVDA and Firefox releases; note both versions. |
| A2 | NVDA with Chromium, Windows | Chrome or Edge, whichever you have; name it. |
| A3 | Narrator with Edge, Windows | Narrator in scan mode. Note the Windows build. |
| A4 | VoiceOver with Safari, macOS | Use the VoiceOver rotor. Safari does not Tab to every link by default; either turn on `Press Tab to highlight each item on a webpage` in Safari Settings, Advanced, or use VO navigation, and record which. |
| A5 | VoiceOver with Safari, physical iPhone | See section 6. Compact: the scene is static, no Pause control. |
| A6 | TalkBack with Chrome, physical Android phone | See section 6. Compact: static, no Pause control. Optional if no Android phone is available. |

### A1 — NVDA + Firefox (Windows)

| Field | Record |
| --- | --- |
| Operator (name) | |
| Date and time | |
| Screen reader and version | |
| Browser and version | |
| OS and version | |
| Device (model, for a phone) | |
| Voice, speech rate, punctuation and verbosity level | |
| Window or viewport width in CSS px | |
| Reduce motion, contrast themes / increase contrast, Save-Data: all OFF for the live rows? | |
| Pause control present on a connected page (scene live)? | |

| Page | T | L | H | K | P | N | D | C | Notes (item, verbatim speech) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Studio ES | | | | |  | |  | N/A | |
| Studio EN | | | | |  | |  | N/A | |
| Founder ES | | | | |  | |  | N/A | |
| Founder EN | | | | |  | |  | N/A | |
| Contact ES | | | | |  | |  | N/A | |
| Contact EN | | | | |  | |  | N/A | |
| Services ES | | | | |  | |  | N/A | |
| Services EN | | | | |  | |  | N/A | |
| Projects ES | | | | |  | |  | N/A | |
| Projects EN | | | | |  | |  | N/A | |
| Privacy ES | | | | | N/A | | N/A |  | |
| Privacy EN | | | | | N/A | | N/A |  | |
| Terms ES | | | | | N/A | | N/A |  | |
| Terms EN | | | | | N/A | | N/A |  | |
| Studio EN, **static state** (reduce motion ON) | | | | | | | | N/A | |
| Contact ES, **static state** (reduce motion ON) | | | | | | | | N/A | |

### A2 — NVDA + Chromium (Chrome or Edge) (Windows)

| Field | Record |
| --- | --- |
| Operator (name) | |
| Date and time | |
| Screen reader and version | |
| Browser and version | |
| OS and version | |
| Device (model, for a phone) | |
| Voice, speech rate, punctuation and verbosity level | |
| Window or viewport width in CSS px | |
| Reduce motion, contrast themes / increase contrast, Save-Data: all OFF for the live rows? | |
| Pause control present on a connected page (scene live)? | |

| Page | T | L | H | K | P | N | D | C | Notes (item, verbatim speech) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Studio ES | | | | |  | |  | N/A | |
| Studio EN | | | | |  | |  | N/A | |
| Founder ES | | | | |  | |  | N/A | |
| Founder EN | | | | |  | |  | N/A | |
| Contact ES | | | | |  | |  | N/A | |
| Contact EN | | | | |  | |  | N/A | |
| Services ES | | | | |  | |  | N/A | |
| Services EN | | | | |  | |  | N/A | |
| Projects ES | | | | |  | |  | N/A | |
| Projects EN | | | | |  | |  | N/A | |
| Privacy ES | | | | | N/A | | N/A |  | |
| Privacy EN | | | | | N/A | | N/A |  | |
| Terms ES | | | | | N/A | | N/A |  | |
| Terms EN | | | | | N/A | | N/A |  | |
| Studio EN, **static state** (reduce motion ON) | | | | | | | | N/A | |
| Contact ES, **static state** (reduce motion ON) | | | | | | | | N/A | |

### A3 — Narrator + Edge (Windows)

| Field | Record |
| --- | --- |
| Operator (name) | |
| Date and time | |
| Screen reader and version | |
| Browser and version | |
| OS and version | |
| Device (model, for a phone) | |
| Voice, speech rate, punctuation and verbosity level | |
| Window or viewport width in CSS px | |
| Reduce motion, contrast themes / increase contrast, Save-Data: all OFF for the live rows? | |
| Pause control present on a connected page (scene live)? | |

| Page | T | L | H | K | P | N | D | C | Notes (item, verbatim speech) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Studio ES | | | | |  | |  | N/A | |
| Studio EN | | | | |  | |  | N/A | |
| Founder ES | | | | |  | |  | N/A | |
| Founder EN | | | | |  | |  | N/A | |
| Contact ES | | | | |  | |  | N/A | |
| Contact EN | | | | |  | |  | N/A | |
| Services ES | | | | |  | |  | N/A | |
| Services EN | | | | |  | |  | N/A | |
| Projects ES | | | | |  | |  | N/A | |
| Projects EN | | | | |  | |  | N/A | |
| Privacy ES | | | | | N/A | | N/A |  | |
| Privacy EN | | | | | N/A | | N/A |  | |
| Terms ES | | | | | N/A | | N/A |  | |
| Terms EN | | | | | N/A | | N/A |  | |
| Studio EN, **static state** (reduce motion ON) | | | | | | | | N/A | |
| Contact ES, **static state** (reduce motion ON) | | | | | | | | N/A | |

### A4 — VoiceOver + Safari (macOS)

| Field | Record |
| --- | --- |
| Operator (name) | |
| Date and time | |
| Screen reader and version | |
| Browser and version | |
| OS and version | |
| Device (model, for a phone) | |
| Voice, speech rate, punctuation and verbosity level | |
| Window or viewport width in CSS px | |
| Reduce motion, contrast themes / increase contrast, Save-Data: all OFF for the live rows? | |
| Pause control present on a connected page (scene live)? | |

| Page | T | L | H | K | P | N | D | C | Notes (item, verbatim speech) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Studio ES | | | | |  | |  | N/A | |
| Studio EN | | | | |  | |  | N/A | |
| Founder ES | | | | |  | |  | N/A | |
| Founder EN | | | | |  | |  | N/A | |
| Contact ES | | | | |  | |  | N/A | |
| Contact EN | | | | |  | |  | N/A | |
| Services ES | | | | |  | |  | N/A | |
| Services EN | | | | |  | |  | N/A | |
| Projects ES | | | | |  | |  | N/A | |
| Projects EN | | | | |  | |  | N/A | |
| Privacy ES | | | | | N/A | | N/A |  | |
| Privacy EN | | | | | N/A | | N/A |  | |
| Terms ES | | | | | N/A | | N/A |  | |
| Terms EN | | | | | N/A | | N/A |  | |
| Studio EN, **static state** (reduce motion ON) | | | | | | | | N/A | |
| Contact ES, **static state** (reduce motion ON) | | | | | | | | N/A | |

### A5 — VoiceOver + Safari on a physical iPhone (iOS)

| Field | Record |
| --- | --- |
| Operator (name) | |
| Date and time | |
| Screen reader and version | |
| Browser and version | |
| OS and version | |
| Device (model, for a phone) | |
| Voice, speech rate, punctuation and verbosity level | |
| Window or viewport width in CSS px | |
| Reduce motion, contrast themes / increase contrast, Save-Data: all OFF for the live rows? | |
| Pause control present on a connected page (scene live)? | |

A phone is below 768 CSS px wide and the compact tier is static by policy, so the Pause control is expected to be **absent**; mark P as N/A (static) and use the rows below for the static composition. An iPad or any window of 768 px or more is live and is recorded in the notes, not here.

| Page | T | L | H | K | P | N | D | C | Notes (item, verbatim speech) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Studio ES | | | | | N/A | |  | N/A | |
| Studio EN | | | | | N/A | |  | N/A | |
| Founder ES | | | | | N/A | |  | N/A | |
| Founder EN | | | | | N/A | |  | N/A | |
| Contact ES | | | | | N/A | |  | N/A | |
| Contact EN | | | | | N/A | |  | N/A | |
| Services ES | | | | | N/A | |  | N/A | |
| Services EN | | | | | N/A | |  | N/A | |
| Projects ES | | | | | N/A | |  | N/A | |
| Projects EN | | | | | N/A | |  | N/A | |
| Privacy ES | | | | | N/A | | N/A |  | |
| Privacy EN | | | | | N/A | | N/A |  | |
| Terms ES | | | | | N/A | | N/A |  | |
| Terms EN | | | | | N/A | | N/A |  | |
| Studio EN, **static state** (reduce motion ON) | | | | | | | | N/A | |
| Contact ES, **static state** (reduce motion ON) | | | | | | | | N/A | |

### A6 — TalkBack + Chrome on a physical Android phone (Android)

| Field | Record |
| --- | --- |
| Operator (name) | |
| Date and time | |
| Screen reader and version | |
| Browser and version | |
| OS and version | |
| Device (model, for a phone) | |
| Voice, speech rate, punctuation and verbosity level | |
| Window or viewport width in CSS px | |
| Reduce motion, contrast themes / increase contrast, Save-Data: all OFF for the live rows? | |
| Pause control present on a connected page (scene live)? | |

A phone is below 768 CSS px wide and the compact tier is static by policy, so the Pause control is expected to be **absent**; mark P as N/A (static) and use the rows below for the static composition. An iPad or any window of 768 px or more is live and is recorded in the notes, not here.

| Page | T | L | H | K | P | N | D | C | Notes (item, verbatim speech) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Studio ES | | | | | N/A | |  | N/A | |
| Studio EN | | | | | N/A | |  | N/A | |
| Founder ES | | | | | N/A | |  | N/A | |
| Founder EN | | | | | N/A | |  | N/A | |
| Contact ES | | | | | N/A | |  | N/A | |
| Contact EN | | | | | N/A | |  | N/A | |
| Services ES | | | | | N/A | |  | N/A | |
| Services EN | | | | | N/A | |  | N/A | |
| Projects ES | | | | | N/A | |  | N/A | |
| Projects EN | | | | | N/A | |  | N/A | |
| Privacy ES | | | | | N/A | | N/A |  | |
| Privacy EN | | | | | N/A | | N/A |  | |
| Terms ES | | | | | N/A | | N/A |  | |
| Terms EN | | | | | N/A | | N/A |  | |
| Studio EN, **static state** (reduce motion ON) | | | | | | | | N/A | |
| Contact ES, **static state** (reduce motion ON) | | | | | | | | N/A | |

### Session notes (anything that does not fit a cell)

Write one line per finding: session, page, item, what you heard, what you expected.

```text

```

## 5. Reporting back

1. Save the filled sheets. Either edit a copy of this file named `manual-acceptance-results-<operator>-<YYYY-MM-DD>.md` or send the filled tables to the planning authority. Do not edit the empty protocol in place.
2. Keep any recording or screenshot outside Git unless the owner asks otherwise, and name it by session and page.
3. The receipt for these results is a new section in [task-27.md](task-27.md) added by whoever transcribes them: each session becomes DONE (with the operator, tool, version and date) or stays OPEN. A session with any blank cell is reported with the blanks named.
4. A `FAIL` is a finding for the planning authority. It does not reopen the owner's wide-tier acceptance by itself; it adds a numbered remediation packet if the owner chooses to act on it.

## 6. Physical phone pass

Compact was static by policy when this protocol was written; since PLAN-SFC-V1 Task 25 `CONNECTED_LIVE_POLICY.compact` is `true`, so an eligible phone below 768 CSS px now runs the live scene with its Pause control, and the static page is what a reduced-motion, Save-Data or software-renderer visitor sees. This pass checks the complete static page on a real device. The owner has attested to having tested the compact live scene and the screen-reader and phone checks manually (see the [Task 27](task-27.md) update); this protocol is kept for per-item sheets if the owner or an operator wants them.

Use a real iPhone and, if one exists, a real Android phone, with the site opened from the browser's address bar (not a desktop emulation). For each device run the pages below in both languages, portrait first, then landscape for Studio and Contact.

| ID | Check | PASS when |
| --- | --- | --- |
| F1 | Static composition renders | The poster and text are complete; there is no canvas and no Pause control; the page reads like the Appendix A outline. |
| F2 | No horizontal scroll | The page does not scroll sideways at the device width, portrait and landscape. |
| F3 | App Bar menu | The menu button opens and closes the links; Escape is not available on touch, so check the button toggles it and a link closes it. |
| F4 | Contact links | `Write on WhatsApp`, `Send an email` and `Call` hand off to the right app and show the right number or address on its first screen. **Stop there.** |
| F5 | Language switch | `Ver sitio en inglés` / `View site in Spanish` lands on the same page in the other language. |
| F6 | Text size | With the system text size at the largest setting, or browser text zoom at 200%, nothing is clipped or overlapped and every link is still reachable. |
| F7 | Scrolling | Scrolling is smooth and does not stall or feel heavy; note any visible jank, heat or battery drop over about five minutes of use. |
| F8 | Reduced motion | Nothing changes unexpectedly when Reduce Motion is toggled; the static page stays complete. |

| Device (model, OS, browser, versions) | Operator | Date | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | |
| | | | | | | | | | | | |

If a tablet of 768 CSS px or wider is available, load Studio, Contact and Services on it. The scene goes live there (tablet shares the wide quality) and Pause appears; record that in the notes as an extra, not as a qualification. The wide-tier acceptance covers desktop only.

Screen-reader work on the phone (A5 and A6) uses the same items T, L, H, K, N, D, C with swipe navigation and the rotor; mark P `N/A` because no Pause control exists on a phone.

## 7. Firefox and Safari timing on real hardware

The Task 15 collector and its rows are Chromium-only; Task 18 recorded Firefox and WebKit for **functional activation only**, and the [Task 27 receipt](task-27.md) adds a headless, software-conditions run that proves nothing about timing. No Firefox or Safari timing budget exists in the plan, so **every timing row stays OPEN until the planning authority sets a threshold**. This section collects the numbers; it does not judge them.

Run on a physical desktop, windowed, with the live scene confirmed (Pause present), and a quiet machine: sample CPU (and GPU where you can) for 3 seconds before and after each run and stop if either exceeds 30%, the same rule as [hardware protocol](hardware-protocol.md). Close everything else, plug in power, leave the display at its normal refresh rate and record it.

| Browser | Hardware to name |
| --- | --- |
| Firefox (current) on Windows or macOS | CPU, GPU and driver, OS, refresh rate |
| Safari (current) on macOS | Mac model, chip, macOS, refresh rate |

For each of Studio, Founder, Contact, Services and Projects, in both languages (10 pairs), three loads each (the Task 15 rule for a counted pair; fewer is a labelled smoke run):

1. Open the page fresh. Wait until Pause appears.
2. Open the browser console and paste the sampler in Appendix B. It reports the animation-frame interval while you scroll.
3. Scroll the whole page down and back by hand at an ordinary reading pace for about 20 seconds with the trackpad or wheel. Do not touch Pause.
4. Copy the `result` line. Then paste the same sampler on a blank tab (`about:blank`) for the same time without scrolling, to record the control cadence of that browser on that machine.
5. Leave the page alone for 10 seconds and watch the fans or the CPU gauge: the Studio, Founder and Contact scenes sleep at rest; Services and Projects keep a capped ambient cadence. Note anything that keeps the CPU or GPU busy at rest.
6. Hide the tab for 10 seconds (switch tab) and note CPU and GPU in the same way.

Sheet (one row per load; copy the `result` line verbatim in Notes):

| Browser | Page/locale | Run | CPU before/after | p50 ms | p95 ms | max ms | frames | Control p50/p95 | Rest busy? | Hidden busy? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | |
| | | | | | | | | | | | |
| | | | | | | | | | | | |

The sampler measures how often the browser asks the page for a frame while you scroll. It cannot see GPU time, draw counts or whether the scene drew on every frame, so it says nothing about the scene's own cost. A low or noisy interval with a clean control is a finding to report, not a verdict.

## Appendix A — Expected structure (the answer key)

Everything here was read from the **deployed** DOM on 2026-10-20 at a 1440×900 window with the scene live (headless Firefox 155 on Windows, page by page, [Task 27 receipt](task-27.md)). It is what the markup exposes, **not** what any screen reader says. A page you open in static state has the same landmarks, headings and links minus the Pause button, with `Static background` / `Fondo estático` as plain text in its place.

Common to every page:

- The App Bar is a `banner` with a `navigation` named `Primary navigation` / `Navegación principal`. In Tab order: the brand link `FURLANICH`, the language switch (`View site in Spanish` / `Ver sitio en inglés`), then `Services`, `Work`, `How we work`, `About`, `Contact options` (Spanish: `Servicios`, `Proyectos`, `Cómo trabajamos`, `El estudio`, `Ver contacto`). At 1440 px only this inline navigation is visible; a second `Primary navigation` exists inside a closed disclosure and is hidden from assistive technology at this width (it is the menu on windows narrower than 1024 px).
- One `main`, one H1 (zero `form` elements on every page).
- The Footer is a `footer` landmark with a navigation named `Explore` / `Explorar`. Its links in order: the brand, WhatsApp, the email address, the phone number, `Contact information`, `Services`, `Work`, `How we work`, `About`, `Samuel Furlanich`, `LinkedIn`, `GitHub`, `Privacy`, `Terms and Conditions`, and the language switch last. The scene's graph canvas and its words are in an `aria-hidden` ground layer; the canvas has `tabindex="-1"`.
- Titles: Studio `El estudio | FURLANICH` / `About | FURLANICH` and Terms `Términos y condiciones | FURLANICH` / `Terms and Conditions | FURLANICH`; **Founder, Contact, Services, Projects and Privacy are all just `FURLANICH`** in both languages.
- Tab order was confirmed by pressing Tab in headless Firefox on Studio (both locales), Founder EN, Contact (both locales); the other lists are DOM order, which is the Tab order because the pages set no positive `tabindex`.

**Footer on every page.** EN: H2 `Give your project a next step.`, H3 `Direct contact`, H3 `Explore`, H3 `Direct accountability`. ES: H2 `Dale un próximo paso a tu proyecto.`, H3 `Contacto directo`, H3 `Explorar`, H3 `Responsabilidad directa`.

#### Studio ES — https://furlanich.github.io/Portfolio/estudio/

- Title: `El estudio | FURLANICH`; `lang="es-AR"`; one H1: `Software a medida con responsabilidad técnica directa.`.
- Level-2 headings (5), in order: `Dirección técnica de principio a fin`, `Principios para trabajar con claridad`, `Base en Buenos Aires, disponibilidad nacional e internacional`, `La persona detrás de la dirección técnica`, `Conversemos sobre lo que hoy frena a tu negocio`; 5 level-3 headings beneath them.
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): "Contanos qué necesitás resolver" → "Conocer a Samuel" → **button "Pausar fondo" (not pressed)** → "Conocer a Samuel" → "Iniciar una consulta".

#### Studio EN — https://furlanich.github.io/Portfolio/en/about/

- Title: `About | FURLANICH`; `lang="en"`; one H1: `Custom software with direct technical accountability.`.
- Level-2 headings (5), in order: `Technical direction from start to finish`, `Principles for clear delivery`, `Based in Buenos Aires, available nationally and internationally`, `The person behind the technical direction`, `Let's talk about what's holding your business back`; 5 level-3 headings beneath them.
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): "Tell us what you need to solve" → "Meet Samuel" → **button "Pause background" (not pressed)** → "Meet Samuel" → "Start an enquiry".

#### Founder ES — https://furlanich.github.io/Portfolio/estudio/samuel-furlanich/

- Title: `FURLANICH`; `lang="es-AR"`; one H1: `Samuel Furlanich`.
- Level-2 headings (7), in order: `Biografía profesional`, `Perfil profesional`, `Experiencia profesional`, `Formación`, `Capacidades para construir y mejorar sistemas`, `Trabajo y evidencia técnica`, `¿Querés conversar sobre una necesidad de tu negocio?`; 9 level-3 headings beneath them.
- Extra landmarks: header "Samuel Furlanich".
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): "Descargar CV" → "LinkedIn" → "GitHub" → **button "Pausar fondo" (not pressed)** → "Ver código fuente" → "Ver proyectos seleccionados" → "Iniciar una consulta".

#### Founder EN — https://furlanich.github.io/Portfolio/en/about/samuel-furlanich/

- Title: `FURLANICH`; `lang="en"`; one H1: `Samuel Furlanich`.
- Level-2 headings (7), in order: `Professional biography`, `Professional profile`, `Professional experience`, `Education`, `Capabilities for building and improving systems`, `Work and technical evidence`, `Want to discuss a business need?`; 9 level-3 headings beneath them.
- Extra landmarks: header "Samuel Furlanich".
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): "Download CV" → "LinkedIn" → "GitHub" → **button "Pause background" (not pressed)** → "View source code" → "View selected work" → "Start an enquiry".

#### Contact ES — https://furlanich.github.io/Portfolio/contacto/

- Title: `FURLANICH`; `lang="es-AR"`; one H1: `Contanos qué necesitás resolver.`.
- Level-2 headings (1), in order: `Hablemos de tu proyecto.`.
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): **button "Pausar fondo" (not pressed)** → "Escribir por WhatsApp" → "Enviar un correo" → "Llamar" → "Cómo tratamos tus datos" → "Conocer la trayectoria de Samuel".

#### Contact EN — https://furlanich.github.io/Portfolio/en/contact/

- Title: `FURLANICH`; `lang="en"`; one H1: `Tell us what you need to solve.`.
- Level-2 headings (1), in order: `Let's talk about your project.`.
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): **button "Pause background" (not pressed)** → "Write on WhatsApp" → "Send an email" → "Call" → "How we handle your information" → "View Samuel's background".

#### Services ES — https://furlanich.github.io/Portfolio/servicios/

- Title: `FURLANICH`; `lang="es-AR"`; one H1: `Software para que el trabajo avance.`.
- Level-2 headings (5), in order: `Una interfaz clara para el negocio.`, `Las herramientas dejan de trabajar aisladas.`, `Un sistema que puede seguir evolucionando.`, `Alcance claro. Entregas revisables.`, `Contanos qué necesitás resolver`; 21 level-3 headings beneath them.
- Extra landmarks: navigation "Encontrá tu punto de partida".
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): **button "Pausar fondo" (not pressed)** → "01Sitios y aplicaciones webUna presencia clara. Una operación más simple.Explorar el servicio" → "02Integraciones y automatizaciónMenos traspasos manuales.Explorar el servicio" → "03Mejora de software existenteMejorá lo que ya tenés.Explorar el servicio" → "Ver condiciones de trabajo" → "Examinar el prototipo de reservas" → "Contanos qué necesitás resolver" → "Ver condiciones de trabajo" → "Contanos qué necesitás resolver" → "Ver condiciones de trabajo" → "Contanos qué necesitás resolver" → "Iniciar una consulta".

#### Services EN — https://furlanich.github.io/Portfolio/en/services/

- Title: `FURLANICH`; `lang="en"`; one H1: `Software that moves work forward.`.
- Level-2 headings (5), in order: `A clear interface for the business.`, `Tools stop working in isolation.`, `A system that can keep evolving.`, `Clear scope. Reviewable delivery.`, `Tell us what you need to solve`; 21 level-3 headings beneath them.
- Extra landmarks: navigation "Find your starting point".
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): **button "Pause background" (not pressed)** → "01Websites and web applicationsA clear presence. Simpler operations.Explore the service" → "02Integrations and automationFewer manual handoffs.Explore the service" → "03Improve existing softwareBuild on what you already have.Explore the service" → "Read working boundaries" → "Examine the reservation prototype" → "Tell us what you need to solve" → "Read working boundaries" → "Tell us what you need to solve" → "Read working boundaries" → "Tell us what you need to solve" → "Start an enquiry".

#### Projects ES — https://furlanich.github.io/Portfolio/proyectos/

- Title: `FURLANICH`; `lang="es-AR"`; one H1: `Trabajo que podés examinar.`.
- Level-2 headings (3), in order: `Gestión de reservas para transporte de pasajeros`, `Gestión multiusuario de campañas de rol`, `El contexto importa.`; 8 level-3 headings beneath them.
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): "Reservas de transporte" → "Campañas multiusuario" → **button "Pausar fondo" (not pressed)** → "Ver código fuente" → "Sitios y aplicaciones web" → "Conocer a Samuel" → "Ver código fuente" → "Sitios y aplicaciones web" → "Conocer a Samuel".

#### Projects EN — https://furlanich.github.io/Portfolio/en/work/

- Title: `FURLANICH`; `lang="en"`; one H1: `Work you can examine.`.
- Level-2 headings (3), in order: `Passenger transport reservation management`, `Multi-user role-playing campaign management`, `Context matters.`; 8 level-3 headings beneath them.
- Controls between the App Bar and the Footer, in DOM order (Pause present only when the scene is live): "Transport reservations" → "Multi-user campaigns" → **button "Pause background" (not pressed)** → "View source code" → "Websites and web applications" → "Meet Samuel" → "View source code" → "Websites and web applications" → "Meet Samuel".

#### Privacy ES — https://furlanich.github.io/Portfolio/privacidad/

- Title: `FURLANICH`; `lang="es-AR"`; one H1: `Privacidad y contacto`.
- Level-2 headings (7), in order: `Contenido`, `Responsable y contacto`, `Contacto directo`, `Alojamiento y datos técnicos`, `Preferencias de navegación`, `Información que compartís`, `Mensajes y solicitudes sobre tus datos`.
- Extra landmarks: navigation "Contenido".
- Controls between the App Bar and the Footer, in DOM order: "Responsable y contacto" → "Contacto directo" → "Alojamiento y datos técnicos" → "Preferencias de navegación" → "Información que compartís" → "Mensajes y solicitudes sobre tus datos" → "Ver los términos y condiciones" → "Ver la declaración de privacidad de GitHub".

#### Privacy EN — https://furlanich.github.io/Portfolio/en/privacy/

- Title: `FURLANICH`; `lang="en"`; one H1: `Privacy and contact`.
- Level-2 headings (7), in order: `Contents`, `Responsible party and contact`, `Direct contact`, `Hosting and technical data`, `Browsing preferences`, `Information you share`, `Messages and requests about your information`.
- Extra landmarks: navigation "Contents".
- Controls between the App Bar and the Footer, in DOM order: "Responsible party and contact" → "Direct contact" → "Hosting and technical data" → "Browsing preferences" → "Information you share" → "Messages and requests about your information" → "Read the Terms and Conditions" → "View GitHub's privacy statement".

#### Terms ES — https://furlanich.github.io/Portfolio/terminos/

- Title: `Términos y condiciones | FURLANICH`; `lang="es-AR"`; one H1: `Términos y condiciones`.
- Level-2 headings (8), in order: `Contenido`, `Responsable y alcance`, `Información del sitio`, `Consultas y contratación`, `Uso responsable`, `Materiales y licencias`, `Enlaces y disponibilidad`, `Privacidad y cambios`.
- Extra landmarks: navigation "Contenido".
- Controls between the App Bar and the Footer, in DOM order: "Responsable y alcance" → "Información del sitio" → "Consultas y contratación" → "Uso responsable" → "Materiales y licencias" → "Enlaces y disponibilidad" → "Privacidad y cambios" → "Ver la política de privacidad".

#### Terms EN — https://furlanich.github.io/Portfolio/en/terms/

- Title: `Terms and Conditions | FURLANICH`; `lang="en"`; one H1: `Terms and Conditions`.
- Level-2 headings (8), in order: `Contents`, `Responsible party and scope`, `Website information`, `Inquiries and engagements`, `Responsible use`, `Materials and licenses`, `Links and availability`, `Privacy and changes`.
- Extra landmarks: navigation "Contents".
- Controls between the App Bar and the Footer, in DOM order: "Responsible party and scope" → "Website information" → "Inquiries and engagements" → "Responsible use" → "Materials and licenses" → "Links and availability" → "Privacy and changes" → "Read the Privacy Policy".

## Appendix B — Frame-interval sampler

Paste into the browser console on the page under test. It samples for 20 seconds and prints one line; start scrolling right after you paste. On `about:blank` it gives the control. It adds a temporary frame callback and nothing else; reload the page to remove it.

```js
(async () => {
  const frames = [];
  let last = performance.now();
  let running = true;
  const tick = (t) => { frames.push(t - last); last = t; if (running) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  await new Promise((r) => setTimeout(r, 20000));
  running = false;
  frames.shift();
  const s = [...frames].sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  const result = { frames: s.length, p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), max: +s[s.length - 1].toFixed(1), at: new Date().toISOString() };
  console.log('result', JSON.stringify(result));
})();
```
