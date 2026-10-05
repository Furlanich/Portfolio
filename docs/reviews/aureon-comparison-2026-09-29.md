---
id: REVIEW-AUREON-COMPARISON-2026-09-29
type: design-review
status: PROPOSED
related:
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PROJECT-EVIDENCE
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - ADR-CONTACT-INQUIRY-DEMO-MODE
last_verified: 2026-09-29
---

# Aureon and FURLANICH: product, UX and visual comparison

**Inspection date:** September 29, 2026. **Disposition:** advisory analysis; recommendations do not approve implementation or supersede existing decisions.

## Executive assessment

**Keep FURLANICH’s Sky Chart identity and focused service offer. Borrow Aureon’s ability to make a service feel concrete: what gets mapped, built, reviewed and handed over.** Adding services, a portal or a blog would not address FURLANICH’s most important persuasion gap: the distance between a compelling promise and evidence a buyer can evaluate.

Three findings change the priorities:

1. **The local checkout and deployed website differ materially.** Local `main` at `db25420` still composes the earlier light homepage; the public site already renders dark Sky Chart, asymmetric service plates, Position fix and an accountability log. These are not missing live features. Reconcile the implementation baseline before assigning work.
2. **The deployed FURLANICH hero is more immediately useful on mobile.** At 390×844, its main actions begin approximately 532px and 592px down the viewport. Aureon’s begin around 891px and 963px. Neither site showed document-level horizontal overflow at the sampled narrow widths, but Aureon delays its main action beyond the initial screen.
3. **Trust includes working behavior.** FURLANICH’s demonstration form attempts a native GET with field values in the URL when JavaScript is disabled. This was reproduced with synthetic values and the outgoing request blocked. Correct this before treating the zero-transmission promise as complete.

Recommendations distinguish **existing approved work**, **new proposals**, and **commercial activation dependencies**. None was implemented during this review.

## Evidence, scope and method

### Three FURLANICH baselines

| Baseline | Inspected evidence | Interpretation |
| --- | --- | --- |
| Local implementation | Repository on `main`, HEAD `db25420`, September 24; current TSX, CSS, content, tokens and tests | Source facts apply to this checkout. No fetch, pull, checkout, build or application edit performed. |
| Public deployment | [FURLANICH](https://furlanich.github.io/Portfolio/), September 29 | Rendered facts apply to this deployment. Its exact Git commit was not verified. It contains work absent locally. |
| Approved direction | Sky Chart RFC, ADR, active plan and design owners | Defines intended product/design. Approval does not prove every item shipped or passed acceptance. |

Local `components/homepage/CommercialHomepage.tsx` does not render impact; the public homepage does. Local `components/foundation/SiteHeader.tsx` uses an opaque foundation header; the deployment has the floating chart App Bar. This discrepancy is directly observed.

### Inspection coverage and limitations

- **Aureon:** homepage, `/sistema-aureon`, `/servicios`, `/proyectos`, `/blog`, `/contacto`, `/portal/login`, `/identidad`; DOM, computed styles, links and screenshots. No contact, newsletter or authentication submission was made.
- **FURLANICH public:** Spanish Home, Services, Projects, Studio, Founder, Contact and English Home. Desktop 1440×900 and mobile 390×900 screenshots; 390×844 and 320×844 action-placement/reflow checks; selected lower sections inspected after scrolling.
- **Interactions:** menu activation, transition declarations, first/repeated invalid form submissions, and blocked no-JavaScript keyboard submission. Bounded Chromium inspection, not a full regression suite.
- **Local:** positioning, IA, evidence inventory, Contact ADR, design specifications, Sky Chart plan, components and tests. A committed screenshot corroborates the historical light composition; it is not presented as a fresh local render.
- **Figma:** capability discovery found the plugin missing. After user-confirmed installation, the [existing Sky Chart mirror](https://www.figma.com/design/V6FD6Sq3gqqxeMw5Si7Dnx) was inspected read-only. Metadata returned one top-level page, `Foundations` (`0:1`), containing frame `1:55`. Palette/type metadata and a screenshot export were obtained. Components/Home frames described in the September 23 record were not exposed by the current metadata response and remain unverified here. Repository decisions remain authoritative.

No conversion analytics, user interviews, authenticated portal access, delivery test, real-device pass, screen-reader pass, comprehensive contrast audit or field-performance measurements were available. No conversion uplift is claimed. Temporary browser evidence stayed outside the repository; this report is the only new repository artifact.

### Applied skills

| Capability | Application |
| --- | --- |
| [Taste](../../.agents/skills/design-taste-frontend/SKILL.md) | Evaluate buyer fit, product-specific identity and visual hierarchy; preserve the selected design direction. |
| [Emil Kowalski design engineering](../../.agents/skills/emil-design-eng/SKILL.md) | Assess response speed, purposeful motion, focus, disclosure behavior and repeated actions. |
| [Impeccable](../../.agents/skills/impeccable/SKILL.md) | Independent design and technical assessments; detector and rendered evidence kept distinct. |
| Figma | Read existing foundation structure and token roles; compare with code and approved requirements. No design mutations. |
| [Visual QA](../../.agents/skills/visual-qa/SKILL.md), [Playwright QA](../../.agents/skills/playwright-qa/SKILL.md) | Separate visual judgment from browser assertions; document actual routes, viewports and limitations. |
| [Verification](../../.agents/skills/verification-before-completion/SKILL.md), [PR readiness](../../.agents/skills/pr-readiness/SKILL.md) | Verify scope and documentation; preserve approvals, existing files and human review boundaries. |

**Design read:** a founder-led B2B software studio for buyers with fragmented operational workflows, using a precise navigational visual language. The benchmark is clarity plus distinctive authorship, not feature count.

Two independent subagents assessed design and technical source evidence. Assessment A completed before technical findings entered the synthesis. The user’s report-only scope overrides skill steps that would create extra context files, snapshots, overlays, code changes or a PR. Questions skipped: no clarification was needed to produce the requested report. Unrelated creation, deployment and media-generation skills were not invoked merely to increase tool usage.

## 1. High-level overview

### Aureon’s value proposition, layout and identity

[Aureon](https://aureon.ar/) presents a software and operational-systems company, combining product development, automation and technical operation. It directs readers toward an initial conversation while offering a technical exploration path.

The desktop sequence comprises navigation, a split hero, visual method, unequal service cards, principles, portal preview, internal-project examples, newsletter and a closing contact invitation. Dark grounds, warm white type, gold accents, fine rules and architectural imagery create a consistent technical identity.

Its useful strategic idea is **making delivery visible**. The [method page](https://aureon.ar/sistema-aureon) connects process, data, product, integration and operational control, then names outputs such as an operational map, data model and documentation. These artifacts help a buyer picture what a services engagement produces.

The public [portal login](https://aureon.ar/portal/login) reinforces continuity after delivery. Its presence does not verify authenticated functionality, security or adoption. Public project descriptions are also company claims; this review did not independently validate operating results.

### Strengths worth learning from

- **Offer-linked imagery:** layers, documents, nodes and status panels explain coordination more effectively than unrelated decorative imagery.
- **Concrete process outputs:** deliverables communicate more buying information than a sequence of verbs alone.
- **Expectation setting:** [Contact](https://aureon.ar/contacto) states a response expectation and clarifies that the initial conversation does not include detailed diagnosis or a fixed quote.
- **Consistent identity:** the [brand manual](https://aureon.ar/identidad) specifies symbol use, color roles and type. The useful result is consistency across surfaces, not simply publishing a manual.

### Patterns that should not be copied

**Inconsistent service categories.** Aureon’s homepage includes operational, legal and fiscal layers, while [Services](https://aureon.ar/servicios) organizes work around web, mobile, backend, automation, consulting and maintenance. The reader must translate between taxonomies. FURLANICH’s three families are easier to retain.

**Weak detail-link continuity.** All three homepage technical-detail links point to the same Projects index. The inspected [Projects page](https://aureon.ar/proyectos) describes monitoring and backups but provides no corresponding fintech detail in the inspected content. A specific card should predict a specific destination.

**Mobile affordance defect.** The menu button works, but its three line elements compute to transparent backgrounds. The hamburger is invisible in the sampled default state. Its accessible name is English on a Spanish page and `aria-expanded` is absent. FURLANICH’s visible outlined control is a stronger reference.

**Editorial breadth without clear buyer relevance.** The [Blog](https://aureon.ar/blog) addresses developers, while the commercial offer addresses operational buyers. Several cards advertise broad guides with reading estimates under a minute. Content volume does not establish expertise or commercial relevance. Newsletter availability is also hedged in its disclosure. Neither is automatically a FURLANICH priority.

### FURLANICH’s comparative position

FURLANICH has a more bounded offer: websites/applications, WhatsApp/integrations and improvement of existing software. Samuel is identified as the technical lead. Spanish and English are first-class routes, and evidence distinguishes laboratory work, prototypes and production.

The deployed Sky Chart gives the offer a recognizable visual explanation: scattered information becomes a coordinated system. Position fix makes this concrete through conflicting sources about one order. Its illustrative label is essential: five sources and one record are properties of the example, not measured customer results.

**Opportunity:** pair this visual specificity with equally concrete deliverable and evidence descriptions. Service breadth is not a prerequisite for credibility.

## 2. Feature and component matrix

**Local** = inspected checkout. **Live** = observed deployment. **Approved** = intended direction in repository records. A missing feature is not automatically a defect.

| Area / pattern | Aureon | FURLANICH project and deployment | Implication |
| --- | --- | --- | --- |
| Core promise | Broad operational software systems | Specific orders, bookings, messages and existing systems | Preserve concrete buyer vocabulary. |
| Main navigation | Six ordinary destinations plus contact | Four commercial destinations, locale switch and contact | Preserve the smaller IA; no parity-driven categories. |
| Hero actions | Conversation and technical exploration | Contact and Services | FURLANICH better accommodates undecided buyers. |
| Mobile hero | Main action below initial 844px screen | Both actions within initial screen | Preserve compact content/action order. |
| Header | Full-width dark bar, gold action | Local white sticky bar; Live floating chart App Bar | Live already achieves branded navigation. |
| Mobile navigation | Invisible default strokes; no expanded attribute observed | Local native disclosure; Live visible outlined control | Do not borrow Aureon’s affordance treatment. |
| Language | Spanish; no selector observed | Spanish root and English equivalents | Preserve semantic route equivalence. |
| Service taxonomy | Different homepage/detail groupings | Three consistent categories | FURLANICH is clearer. |
| Service composition | Unequal areas create emphasis | Local equal cards; Live dominant and secondary plates | Asymmetry is approved and already live. |
| Service-detail access | Long page with repeated inquiry links | Stable anchors, starting point, fit and limits | Improve direct paths into existing content. |
| Technical stack | Prominent throughout | Secondary to buyer problem | Retain technical detail where it answers a buyer question. |
| Method | Dedicated phases/layers/outputs page | Four chapters plus Process section | Add outputs, not another repetitive method page. |
| Value demonstration | Panels and technical visuals | Live Position fix; unused component scaffolding locally | Build on the existing scenario. |
| Homepage evidence | Internal-project promotion | Accountability fallback links to Projects | No project is currently homepage-eligible. |
| Project detail | Two internal systems on index | Three approved summary-only detail pairs with repository links | Preserve exact destinations and maturity labels. |
| Claims/metrics | Technical and illustrative panel numbers | Explicit limits; illustrative counts labeled | Avoid decorative uptime, savings or client claims. |
| Accountability | Organization/function labels | Named founder, Studio and professional profile | Preserve the accountable person; do not imply departments. |
| Post-delivery reassurance | Portal preview/login | Process, documentation and maintenance boundaries | Explain handover before building a portal product. |
| Contact form | Five visitor fields including service selection | Four-field demonstration; real adapter dormant | Avoid additional fields without intake need. |
| Contact expectations | Response window, hours and conversation scope | Direct channels, availability and demo explanation | Publish only supportable expectations. |
| FAQ | Four Contact disclosures | Relevant answers distributed across Services/Process | A short FAQ is a research-backed proposal, not automatic scope. |
| WhatsApp | Inline and floating launcher | Existing direct links, including final CTA | No floating bubble required for parity. |
| Blog/newsletter | Both present | Neither in inspected public IA | Defer pending ownership and buyer-focused content. |
| Brand system | Public manual and reusable assets | Protected mark, local fonts, role tokens, Figma foundation | Preserve the system; no need to expose internal governance. |
| Motion | 180ms header color transitions | 160ms transitions; progressive enhancement and static fallback in Local | Judge purpose and interruption, not effect count. |
| Form feedback | Delivery untested | First error focuses name; repeat leaves focus on submit | Correct repeated-action behavior. |
| Performance proof | No field data collected | Historical engineering gates; actual release unmeasured here | Do not claim comparative speed. |

### Navigation journeys

| Buyer task | Aureon | FURLANICH | Specific opportunity |
| --- | --- | --- | --- |
| Find service | Home → Services → inquiry | Home → Services → section → Contact | Each homepage service affordance should reach its matching anchor. |
| Assess credibility | Technical card → shared index | Accountability → Projects → specific detail → source | Preserve specificity; explain relevance and evidence scope. |
| Understand delivery | Method → outputs → Contact | Chapters → Process → service boundaries | Name the handover artifact without repeating the story. |
| Start conversation | Contact / WhatsApp | Demo form / direct channels | Make real contact and simulation distinct at the choice point. |
| Change language | No selector observed | Equivalent localized route | Preserve destination and meaning across languages. |

The [FURLANICH Services page](https://furlanich.github.io/Portfolio/servicios/) already contains valuable fit, starting-point and boundary guidance. Better scanning and entry paths will help more than additional generic service prose.

## 3. Visual and aesthetic gap analysis

### Typography

| Attribute | Aureon measured / observed | FURLANICH measured / approved | Assessment |
| --- | --- | --- | --- |
| Family | Space Grotesk on hero and major branded sections | Instrument Sans with IBM Plex Mono labels | Both deliberate; retain FURLANICH pairing. |
| Desktop hero | Visible spans 86.4px / 82.08px line height | Live H1 96px / 94.08px | FURLANICH needs no further enlargement. |
| Narrow hero | 48px / 45.6px | Approved display token bottoms at 44px | Aureon’s larger mobile type adds vertical pressure. |
| Desktop lead | 24px / 39px | Live 21px / 32.55px | FURLANICH delivers more specific content compactly. |
| Section consistency | Some later H2s use system sans at 48px; earlier headings use Space Grotesk around 69–72px | Shared tokens with composition-specific roles | Do not copy Aureon’s inconsistency. |
| Technical labels | Uppercase labels and tags | 12px mono, coordinates and plate IDs | Keep critical buying information in readable body text. |

Aureon’s H1 wrapper computes to 16px because child spans own the display size; the table measures the visible text rather than diagnosing a false hierarchy problem.

Preserve current fonts and display tokens. Focus on concise headings, ES/EN line breaks and legible metadata on translucent material. The specific Position fix heading deserves 320px and 200%-zoom validation before more decorative labels are added.

### Color hierarchy and materials

Aureon’s [identity page](https://aureon.ar/identidad) specifies black `#0B0B0D`, graphite `#111216`, gold `#D6A84B`, warm white `#F6F3EC`, muted gray `#9B9DA4` and functional turquoise `#56D6C9`. Gold creates warmth and identifies primary actions.

FURLANICH’s `tailwind.config.ts` and inspected Figma foundation distinguish these roles:

| Role | Value | Reason to preserve |
| --- | --- | --- |
| Brand/action fill | Azure `#004589` | Connects CTA and mark; not suitable as small text on dark sky. |
| Headings/light material | Bone `#F9F6EE` | Warm foreground and distinct plotting sheet. |
| Environmental depth | Abyss `#06121F`, Deep `#0A1E33` | Depth that recedes behind content. |
| Dark links/labels | Lit `#6FA8E0` | Readable signal distinct from brand fill. |
| Secondary plate text | `#B9C3CC` | More robust than Mist across translucent composites. |
| Atlas plate | `rgba(10,30,51,.74)` | Stable reading surface over the environment. |
| Plotting sheet | `rgba(249,246,238,.9)` | Meaningful contrast change for fragmented inputs and the example. |

The [direction review](sky-chart-direction-2026-09-23/index.md) already records Azure text on deepest sky at 1.99:1 and the contrast risks of translucent surfaces. These are existing design measurements, not newly measured here.

Local source mixes new tokens with older mounted composition. Live expresses the material contrast already. The remaining opportunity is semantic discipline: chart light should communicate connection/state and Azure should communicate action. Gold would dilute the identity without solving a hierarchy problem.

### Spacing and narrative pacing

At 1440×900, sampled homepage heights were approximately **8,597px for Aureon** and **9,868px for FURLANICH Live**. At 390×900 they were about **15,235px and 10,758px**. These are layout observations, not performance or engagement metrics; font loading and viewport height can change totals.

- Aureon’s mobile hero repeats branding, includes stack text and pushes actions down.
- FURLANICH’s mobile hero is more efficient, but the desktop narrative still asks the reader to traverse four chapters before standard commercial sections.
- FURLANICH’s plotting sheets interrupt the dark field usefully; Aureon maintains more uniform dark material across the page.
- Both repeat concepts: systems/control recur in Aureon; coordination recurs in FURLANICH’s chapters, Problems, Position fix and Process.

Test the task: “Find help for bookings split between WhatsApp and a spreadsheet, and explain what happens next.” Record pauses, backtracking and misunderstandings. Improve direct service entry points first. Cutting or reordering approved chapters is a product/design proposal, not incidental spacing work.

### Imagery and evidence

Aureon’s architectural imagery gives service cards weight; it does not prove a working customer result. FURLANICH’s atlas is more distinctive, and its project visuals are explicitly conceptual.

The most useful transferable device is an **explanatory artifact with a caption**: workflow, data handoff or reviewed delivery checklist. Use the atlas/plotting-sheet language and label whether material is illustrative, implemented, verified or a permitted real capture.

Do not replace evidence restrictions with a stock dashboard. The [inventory](../product/projects/index.md) approves three limited records and no homepage cards. General Reservation System, The-System and MPC Administración must not be reframed as customer case studies.

### Micro-interactions: Emil-informed review

| Before: current observation | After: proposed or preserved behavior | Why |
| --- | --- | --- |
| Aureon action uses 180ms color transitions; FURLANICH 160ms | Retain quick feedback and explicit focus styles | Baseline timing is appropriate; longer effects add no information. |
| Aureon toggle has transparent strokes and no expanded attribute | Visible control boundary and exposed menu state | Discoverability precedes polish. |
| Repeated FURLANICH invalid submission leaves focus on submit | Focus the first current error on every failed attempt | Repeated recovery deserves consistent guidance. |
| Local enhancement checks reduced motion at startup | Verify and honor preference changes while open | No reload should be needed to stop nonessential motion. Source concern, not a verified live-runtime defect. |
| Position fix exposes separate/connected states | Keep immediate labels and complete meaning without animation | This interaction explains the offer; motion should only clarify change. |
| No local bypass link found | Consider visible-on-focus “Skip to content” | Improves keyboard efficiency; absence alone is not a WCAG-failure finding. |

A scale-on-press effect is optional, not a universal requirement. Use it only where it fits approved design and reduced-motion behavior.

## 4. Actionable recommendations: impact versus effort

Effort is a relative planning estimate, not a delivery commitment: **S** = focused change, normally up to two engineering days; **M** = several components/content records, roughly three to five days; **L** = an initiative with infrastructure, decisions or substantial acceptance work. Bilingual review and repository gates matter; deployment provenance must be resolved before scheduling.

| Priority | Recommendation | Impact | Effort | Authority / dependency | Acceptance evidence |
| --- | --- | --- | --- | --- | --- |
| P1 | Close no-JS/pre-hydration form submission | High: protects explicit demonstration promise | S–M | Existing contact-demo ADR; corrective work | Enter/button activation cause no request or storage before hydration or without JS, in both locales. |
| P1 | Resolve checkout/deployment provenance | High: prevents duplicate/regressive work | S | Read-only release comparison, owner workflow | Identify deployed commit; map tasks to actual source. No reset/merge as part of this report. |
| P1 | Link service affordances to corresponding detailed sections | High: reduces searching | S–M | Proposed page/navigation adjustment | Correct ES/EN anchors, visible focus and unobscured destination headings. |
| P1 | Add concise process deliverable descriptions | High: makes engagement tangible | M | Proposed copy through owning page records | Buyer can identify what is agreed, reviewed and handed over without inferring a fixed package. |
| P2 | Strengthen allowed project-detail evidence | High credibility potential | M plus permissions | PROJECT-EVIDENCE and item-level records | Provenance, maturity, permission and verification for each claim; no default homepage promotion. |
| P2 | Fix repeat-validation focus | Medium; high for keyboard recovery | S | Existing Contact accessibility behavior | Every invalid attempt focuses first current error; values remain intact. |
| P2 | Clarify real-contact versus demonstration choice | Medium–high | S–M | Proposed copy/layout; demo ADR retained | Visitor identifies a real channel before investing in the simulated form. |
| P2 | Test narrative pacing | Medium–high; uncertain without users | M | Research; structural changes need owner review | Representative buyers complete service/evidence/contact tasks; record wrong turns and comprehension. |
| P2 | Verify dynamic reduced-motion behavior on actual release | Medium | S–M | Runtime owner and interaction constraints | Changing preference stops nonessential motion without losing content/controls. |
| P3 | Add compact Contact FAQ if research supports it | Medium | S–M | Proposed content; no invented commitments | Short answers resolve real intake doubts; disclosures work by keyboard. |
| Defer | Portal, newsletter, blog, extra service lines | Unproven for present goals | L | New product/architecture/editorial decisions | Recurring demand, ownership, maintenance plan and measurable purpose first. |

### 4.1 Components worth adapting

#### Deliverable rows inside the existing process

Aureon’s useful contribution is output specificity. Adapt it to FURLANICH’s four approved stages rather than introducing six new phases.

| Existing stage | Proposed artifact description for review | Qualification |
| --- | --- | --- |
| Entender / Understand | Short map of current workflow and problem | Depends on agreed diagnostic scope. |
| Definir / Define | Scope, responsibilities and acceptance criteria | No fixed price/timeframe implied before discovery. |
| Construir y revisar / Build and review | Reviewable increment and validation of agreed journeys | No unverified performance or business outcomes implied. |
| Entregar / Hand over | Proportionate usage/technical documentation and agreed next steps | Maintenance, hosting and ongoing support remain separate unless agreed. |

Use existing atlas plates and rules. One compact output line per stage is enough; no carousel, new icon family or new page is necessary. This wording is proposed, not approved public copy.

#### Service-to-scenario bridge

Preserve three families and connect each to its existing detailed destination:

- **Web:** booking/catalogue workflow → `/servicios/#web` and English equivalent.
- **Connect:** tools/WhatsApp handoff → `/servicios/#whatsapp` and equivalent.
- **Improve:** diagnosis of an existing system → `/servicios/#consultoria` and equivalent.

Live Position fix already explains integration. Connect service content to it if testing supports that route; do not create three redundant interactive demonstrations. Use ordinary links with meaningful labels and no hover-only content.

#### Evidence rows with explicit scope

On allowed detail pages use **problem → implemented scope → observable evidence → limitations**. Add a real capture, verification note or diagram only after its project record authorizes it. General Reservation System currently says its operation is not verified; retain that until new evidence exists.

Aureon suggests useful structure, but its infrastructure metrics are not transferable proof. FURLANICH’s stronger opportunity is traceable evidence of its own work.

#### Contact expectation panel

Place “What happens next” beside real contact options. Explain what information helps: current workflow, friction and constraints. Keep the local-simulation disclosure beside the demonstration action.

A one-business-day response promise requires Samuel’s operational commitment; it cannot be copied. Real delivery still requires provider, privacy, inbox and deletion gates. Visual work cannot satisfy them.

### 4.2 Retain, refine, decline

| Retain | Refine | Decline for now |
| --- | --- | --- |
| Azure/Bone, Instrument Sans/Plex Mono, protected mark | Fewer competing technical labels per reading region | Gold/black rebrand to resemble Aureon |
| Atlas plates, plotting sheets, live App Bar | Direct service paths and useful captions | Generic dashboards without evidence |
| Bilingual offer and founder accountability | Deliverables and authorized detail evidence | Implied departments or unsupported legal/fiscal capabilities |
| Native scrolling and progressive enhancement | Reading pace and motion interruption | Portal/authentication as marketing decoration |
| Clearly illustrative Position fix | Link between scenario and service | Blog/newsletter without a sustainable content purpose |

### 4.3 Authority and sequence

1. **Establish release provenance.** The source/deployment mismatch is not permission to pull, reset or reimplement features. Identify the intended working version first.
2. **Correct the form promise/behavior mismatch and repeated-error focus** in separately authorized implementation work. Preserve demonstration mode.
3. **Review bounded content/navigation proposals:** service anchors, process outputs and contact expectations. Update their owning records when approved.
4. **Gather permitted evidence.** Improve details before attempting homepage case studies. Preserve item-level restrictions.
5. **Test comprehension** in both languages and on mobile/desktop. Make structural changes only when the research identifies a problem.
6. **Reassess large features later.** Authentication, commercial form activation, CMS/blog and new services require separate decisions and operating capacity.

The next design iteration should answer: **After one minute, can a buyer explain which service fits, what they would receive, what evidence supports it and how to contact the responsible person?** This is more useful than matching Aureon’s section count.

## 5. Technical findings relevant to trust and UX

### F-01 — P1: demonstration form submits without JavaScript

**Reproduced on public Contact; corroborated by local source.**

`components/contact/ContactForm.tsx` renders enabled named controls and a submit button. Its JavaScript handler controls submission after hydration, but server-rendered HTML has no explicit action/method and defaults to a GET to the current route.

Reproduction:

1. Open `/Portfolio/contacto/` with JavaScript disabled.
2. Fill name, email and message with synthetic values.
3. Intercept and abort every subsequent request.
4. Press Enter in the email field.
5. Observe an attempted GET to `/Portfolio/contacto/?name=...&email=...&company=...&message=...`.

The request was blocked; no inquiry was sent. Without interception, native behavior places values in a URL request, contradicting the no-transmission disclosure. The test does not establish server retention or storage.

**Proposed correction:** fail closed before hydration, for example by rendering simulation controls/action disabled and enabling them only when the local handler is ready. Provide an accessible no-JS explanation and retain separate direct-contact links. Verify pointer, Enter and pre-hydration paths. The existing no-JS test checks readability, not filled native submission; expand this case when correction is authorized.

### F-02 — P2: repeated invalid submission loses error focus

**Reproduced publicly; supported by local effect logic.** First blank submission focuses `contact-name`. A second click on submit leaves focus on a `BUTTON` without an ID. The local effect depends on `state.focusField` and suppresses repeated focus for the same field.

**Proposed correction:** associate focus with each failed attempt, not only a changed field name. Verify both unchanged and changed first-error cases while preserving entered values.

### F-03 — P2 investigation: dynamic reduced motion

**Source concern in Local; unverified in newer public runtime.** The installed Framer Motion hook snapshots its initial preference; `components/homepage/immersive/ImmersiveEnhancement.tsx` uses a one-shot initialization guard. Initial reduced-motion fallback exists. Verify preference-change behavior against the deployed version before classifying it as a current public defect.

### F-04 — Aureon mobile-menu affordance

At 390px, the toggle measured 32×32px. Its three 24×2px strokes computed to transparent backgrounds and `aria-expanded` was absent. Clicking opened the menu after its transition. This is a discoverability/state issue, not a claim that navigation is impossible. Its English accessible name also differs from the page language.

A 32px control is below a comfortable 44px project target but is not automatically a WCAG 2.2 AA failure: AA defines a 24px target minimum with exceptions. Preserve FURLANICH’s larger visible control.

## 6. Modern benchmarks and evaluation criteria

| Benchmark | Application | Evidence to collect |
| --- | --- | --- |
| [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Use 44px as comfortable project target; distinguish from 24px AA and exceptions | Menu, locale, Position fix and contact controls at narrow widths |
| [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Floating App Bar must not entirely hide focused items | Keyboard routes, deep links, error focus after scrolling |
| [Information scent](https://www.nngroup.com/articles/information-scent/) | Action text should predict its exact destination | Service links reach corresponding anchors; project links reach the named project |
| [Core Web Vitals](https://web.dev/articles/vitals) | p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; preserve stricter existing gates | Field data where available plus separately labeled synthetic testing of actual release |
| Emil’s interaction guidance | Quick ordinary response; animate meaningful state changes | First/repeated action, interruption, keyboard and reduced motion |
| Repository evidence rules | Distinguish illustrative, implemented, verified and production material | Permission/provenance, adjacent labels and exact claim scope |
| Buyer comprehension | Audience, service fit, proof and next step should be understandable | Five representative buyers; qualitative results, not invented conversion uplift |

On translucent material, measure contrast against worst actual composites, not nominal fill alone. A screenshot does not prove animation performance/accessibility. A successful simulation does not prove delivery.

### Provisional heuristic synthesis

Scale: **0 severe problem; 1 major gap; 2 mixed; 3 good in inspected scope; 4 strong in inspected scope.** These are judgments, not conversion scores or whole-site accessibility grades. Unexercised workflows are left unscored.

| Heuristic | Aureon | FURLANICH Live | Basis |
| --- | --- | --- | --- |
| Visibility of state | 2 | 3 | Aureon menu lacks expanded state; FURLANICH has section context and form feedback. |
| Match to buyer language | 3 | 4 | Concrete daily operations recur consistently in FURLANICH. |
| User control / exit | 2 | 3 | Reference menu affordance weak; FURLANICH direct navigation/locale choice. Full keyboard coverage open. |
| Consistency | 2 | 3 | Aureon taxonomy/type differences; FURLANICH stronger content structure. |
| Error prevention | Unscored | 1 | Aureon submission untested; FURLANICH no-JS path contradicts form promise. |
| Recognition over recall | 3 | 3 | Visible categories; more specific service paths would reduce searching. |
| Efficiency | 2 | 3 | Aureon mobile actions delayed; both narratives need task-based evaluation. |
| Aesthetic restraint | 3 | 3 | Coherent worlds with repetition/metadata to manage. |
| Error recovery | Unscored | 2 | FURLANICH validation explains problems but repeat focus is inconsistent. |
| Help and guidance | 3 | 3 | Aureon FAQ; FURLANICH detailed fit and limits. |

Independent source-audit rubric: accessibility **3/4**, performance structure **3/4**, responsive structure **3/4**, token consistency **3/4**, implementation integrity **2/4**: **14/20, provisional source-only**. This describes implementation practices, not proven WCAG compliance, field speed or complete responsive quality. The form defect takes precedence over the aggregate score. The empty Impeccable detector result is not a clean bill of health.

## 7. Delivery and validation record

- Scope: one new report. No existing application, documentation, configuration or design file intentionally changed.
- Existing work preserved: modified `next-env.d.ts`, `skills-lock.json`, untracked `brag` skill directory and `.claude/settings.json`.
- No build/dev server started. Full validation/build/browser suites can write generated files and were unnecessary for this report-only deliverable.
- Impeccable component detector: completed successfully, `[]`.
- Browser evidence: Chromium, routes/viewports and observations documented above. Hidden-link and no-JS pointer-stability timeouts were inspection-harness failures; checks were narrowed to visible links and native keyboard submission, not reported as site failures.
- Documentation validation: `npm run docs:check` remains blocked by the pre-existing untracked `.agents/skills/brag/SKILL.md` description, which does not begin with the required "Use when". After correcting report source-reference formatting for Markdown-only link resolution, the validator reports no findings against this report. The unrelated skill was left untouched.
- New implementation proposals remain **OPEN**. Existing approvals remain unchanged. No branch change, commit, push, PR or merge performed for this research-only request.
- No index was edited because the user allowed only the report as new documentation. Temporary inspection scripts/screenshots remained outside the repository.

### Owning records

- [Project knowledge](../index.md), [glossary](../../CONTEXT.md), [architecture](../../ARCHITECTURE.md).
- [Positioning](../product/vision-and-positioning.md), [IA](../product/information-architecture.md), [Services](../product/pages/services.md).
- [Visual language](../design/visual-language.md), [interaction/accessibility](../design/interaction-responsive-accessibility.md).
- [Evidence policy](../product/project-evidence.md), [project inventory](../product/projects/index.md).
- [Sky Chart RFC](../rfcs/sky-chart-visual-system-v2.md), [runtime ADR](../decisions/sky-chart-homepage-runtime.md), [execution plan](../plans/completed/sky-chart-home-redesign-v2.md).
- [Demo Contact ADR](../decisions/contact-inquiry-demonstration-mode.md), [Contact/Privacy requirements](../product/pages/contact-and-privacy.md).

**Conclusion:** Aureon is a useful reference for tangible delivery and operational reassurance. FURLANICH Live already has a distinctive visual system, focused service language and stronger bilingual access. Its next gains should come from dependable contact behavior, clearer service-to-deliverable paths and stronger permitted evidence.
