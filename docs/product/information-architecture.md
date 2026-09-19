---
id: IA-SITE
type: information-architecture
status: APPROVED
related:
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - CONTENT-LOCALIZATION
  - ADR-CONTACT-INQUIRY-DEMO-MODE
last_verified: 2026-09-19
---

# Information architecture

## Sitemap

Spanish is primary:

```text
/
├── servicios/
├── proyectos/
│   └── [project-slug]/
├── estudio/
│   └── samuel-furlanich/
├── contacto/
├── privacidad/
└── 404/
```

English is secondary:

```text
/en/
├── services/
├── work/
│   └── [project-slug]/
├── about/
│   └── samuel-furlanich/
├── contact/
├── privacy/
└── 404/
```

Project detail pages exist only when the disclosure level supports meaningful content. Restricted production summaries do not require a detail route.

## Primary navigation

### Spanish

- Brand → `/`
- Servicios → `/servicios/`
- Proyectos → `/proyectos/`
- Cómo trabajamos → `/#proceso`
- El estudio → `/estudio/`
- Primary CTA: `Contanos sobre tu proyecto` → `/contacto/`
- Language: `ES | EN`

### English

- Brand → `/en/`
- Services → `/en/services/`
- Work → `/en/work/`
- How we work → `/en/#process`
- About → `/en/about/`
- Primary CTA: `Tell us about your project` → `/en/contact/`
- Language: `ES | EN`

There is no separate Home item. The founder profile is reached through Studio/About and the footer, not the primary navigation.

## Footer

The footer provides:

- service, project, process, and studio navigation;
- email, WhatsApp, and phone;
- Buenos Aires, Argentina;
- founder profile, LinkedIn, and GitHub;
- privacy;
- language switching;
- copyright identity.

Exact footer grouping and visual layout remain part of future design work.

## Page responsibilities

- **PAGE-HOME:** Communicate value, relevance, selected services, evidence, process, founder accountability, and a clear path to inquiry.
- **PAGE-SERVICES:** Explain outcomes, examples, fit, boundaries, and dependencies for the three launch services.
- **PAGE-PROJECTS:** Present evidence with truthful maturity and disclosure labels.
- **PAGE-PROJECT-DETAIL:** Explain context, problem, delivered scope, demonstrated result, limitations, and relevance when disclosure permits.
- **PAGE-STUDIO:** Explain the founder-led operating model, principles, location, and direct responsibility.
- **PAGE-FOUNDER:** Preserve Samuel's biography, experience, skills, education, selected work, CV, and professional links.
- **PAGE-CONTACT:** Collect the structured inquiry and provide secondary contact channels and response expectations.
- **PAGE-PRIVACY:** Explain collected data, purpose, providers, retention, and applicable user rights in plain language.
- **PAGE-NOT-FOUND:** Restore navigation to Home, Services, Projects, or Contact in the active language.

## Launch exclusions

No top-level launch routes for Technology, Solutions, AI, Team, Blog, Pricing, Careers, or Portfolio. There are no individual service subpages initially. These exclusions reduce duplication and avoid unsupported breadth.

## Relationships

```text
PAGE-HOME
  -> PAGE-SERVICES
  -> PAGE-PROJECTS
  -> PAGE-STUDIO
  -> PAGE-CONTACT

PAGE-PROJECTS
  -> PAGE-PROJECT-DETAIL (only where disclosure permits)
  -> PAGE-CONTACT

PAGE-STUDIO
  -> PAGE-FOUNDER
  -> PAGE-CONTACT

PAGE-FOUNDER
  -> CV / LinkedIn / GitHub
  -> PAGE-CONTACT
```

## Localization behavior

- Equivalent routes switch context, for example `/servicios/` ↔ `/en/services/`.
- Project slugs remain stable between languages when they are project names.
- Root is the Spanish and `x-default` experience.
- No automatic locale redirect.
- URLs use trailing slashes to remain compatible with static export.

## Deployment host and mode — APPROVED

- Canonical public URL: `https://furlanich.github.io/Portfolio/`.
- Origin: `https://furlanich.github.io`.
- GitHub Pages project base path: `/Portfolio`.
- No custom domain or alternate production host is planned.
- The sitemap remains the bilingual product demonstration IA. Public presence of Home, Services, Projects, Studio, Founder, Contact, and Privacy does not mean their depicted commercial capabilities are operational.
- Contact may publish the full four-field interaction only in the zero-transmission demonstration mode recorded by `ADR-CONTACT-INQUIRY-DEMO-MODE`. A later real-processing activation changes product/deployment state and requires separate review.


## Studio and Founder route closure — APPROVED

Initiative 5 confirms that the existing sitemap is implementation-ready without changing its architecture:

- /estudio/ ↔ /en/about/ is the Studio/About business page pair and the “El estudio / About” primary-navigation target.
- /estudio/samuel-furlanich/ ↔ /en/about/samuel-furlanich/ is the nested Founder-profile pair.
- The Founder pair remains outside primary navigation and is reached from Studio, the footer professional group, and restrained Contact/project contexts defined by PAGE-STUDIO/PAGE-FOUNDER.
- Language switching preserves Studio-to-Studio and Founder-to-Founder context.
- The footer exposes Studio under site navigation and “Samuel Furlanich” under professional links; LinkedIn and GitHub do not substitute for the internal Founder destination.

Historical implementation gap: the route contract formerly used the Founder pair for “El estudio / About”. The [completed Studio/Founder plan](../plans/completed/studio-founder-completion.md) closed that gap; the current navigation points to the separate Studio pair. MKT-DOC-001 synchronizes this note without changing the approved IA.

## MKT-D06-IA — Navigation and action contract — APPROVED revision 1

**Revision 1: APPROVED under D06.** Human reviewer: project owner (user). Date: 2026-09-16. Source: explicit disposition in the decision-review task. The user supplied “D06 - APPROVED”. This accepts the navigation/action contract and stable route rules; D03’s rejected presentation copy remains unchanged.

The [RFC](../rfcs/marketing-narrative-closure.md) covers the Home consolidation and evidence discovery change. It does not change routing, hosting, base path, locale equivalence, detail slugs or generate a new page.

### Accepted navigation

Desktop: brand → language switch → Services → Projects → Process → Studio → primary Contact action. Below the existing 1024px breakpoint, brand/language/disclosure remain visible; the same links and Contact action are in the native menu. Use existing source-order constraints; final at-1024 fit must be checked with actual bilingual text. Do not compress targets to force an inline header.

| Role | Spanish | English | Destination ES / EN |
| --- | --- | --- | --- |
| Brand | FURLANICH | FURLANICH | / / /en/ |
| Service navigation | Servicios | Services | /servicios/ / /en/services/ |
| Evidence navigation | Proyectos | Work | /proyectos/ / /en/work/ |
| Process navigation | Cómo trabajamos | How we work | /#proceso / /en/#process |
| Studio navigation | El estudio | About | /estudio/ / /en/about/ |
| Primary action | Ver contacto | Contact options | /contacto/ / /en/contact/ |
| Language | EN from ES | ES from EN | Equivalent semantic route; preserve detail slug |

Remove the rendered redundant standalone Contact navigation link; the primary action provides that destination. This returns the count to the approved IA's four navigation subjects while replacing the current-mode CTA label explicitly. Founder remains secondary. The semantic sequence is preserved within expanded/compact navigation; visual language-switch placement must not create keyboard-order mismatch.

### Complete accepted CTA destination contract

Paths below are logical site paths; deployment prepends the existing /Portfolio base path. No submitted form values, personal data or service context are added to URLs. Every contextual Contact label has the same meaning: open the Contact page; never send a message or launch WhatsApp.

| Location / action | Destination ES | Destination EN | Meaning / decision dependency |
| --- | --- | --- | --- |
| Global notice explanation | /contacto/ | /en/contact/ | Explain current demo; D03 |
| Header, Home primary/final, each Services action/final, Projects/detail ending, Studio and Founder ending | /contacto/ | /en/contact/ | Stable Contact action; D02/D03 |
| Home secondary, Problems/Services action | /servicios/ | /en/services/ | Explore intended offer |
| Home proof index bridge | /proyectos/ | /en/work/ | Inspect current source-backed selection; placement accepted under D04 |
| Home Founder bridge; Studio Founder link | /estudio/samuel-furlanich/ | /en/about/samuel-furlanich/ | Background of accountable lead |
| Process nav/footer | /#proceso | /en/#process | Same localized Home process; headings unobscured |
| Services index | #web, #whatsapp, #consultoria | #web, #whatsapp, #consulting | In-page exploration; existing fragments |
| Accepted shared service boundaries link | #condiciones | #working-boundaries | New same-page anchors under D05; no new routes |
| Web evidence | /proyectos/general-reservation-system/ | /en/work/general-reservation-system/ | Existing approved limited detail; D04 |
| GRS / The-System index entries | /proyectos/general-reservation-system/; /proyectos/the-system/ | /en/work/general-reservation-system/; /en/work/the-system/ | Same approved detail scope |
| GRS / The-System related service | /servicios/#web | /en/services/#web | Web relevance, no feature/result guarantee |
| Founder education MPC entry | /proyectos/mpc-administracion/ | /en/work/mpc-administracion/ | Historical educational group evidence; D04 |
| MPC return/background | /estudio/samuel-furlanich/ | /en/about/samuel-furlanich/ | Replaces commercial related-service emphasis; existing detail routes preserved |
| Founder Projects bridge | /proyectos/ | /en/work/ | Selected public evidence |
| Contact Privacy link; footer Privacy | /privacidad/ | /en/privacy/ | Current demonstration disclosure |
| Contact form submit/retry | No navigation or network | No navigation or network | Local simulated outcome only; existing adapter |
| Contact/footer WhatsApp | https://wa.me/5491150117565 | Same | Open WhatsApp; no form-value prefill |
| Contact/footer email | mailto:samuelfurlanich@gmail.com | Same | Visitor-selected external email action |
| Contact/footer phone | tel:+5491150117565 | Same | Visitor-selected phone action |
| Project source links | Existing exact URL in each item owner | Same | Inspect source, not a verified running product |
| CV / GitHub / LinkedIn | Existing approved Founder destinations | Same | Secondary background verification; no asset/profile revision |
| Not-found actions | Existing Home/Services/Projects/Contact equivalents | Existing equivalents | Preserve recovery; Contact action adopts stable meaning |

### Accepted footer treatment

Two compact groups after brand/location: (1) site links — Services, Work, How we work, About, Contact, Privacy; (2) person/channels — Samuel Furlanich, LinkedIn, GitHub, WhatsApp, email, phone. At wide sizes these may share rows; compact layouts wrap in the same reading order, without a full card per group or fixed height. Keep actual email/phone values readable for scanning. Contact retains WhatsApp/email/phone order; footer groups do not reorder that channel sequence.

Include equivalent-language control and the existing brand-only copyright requirement in a final utility row. Proposed literal identity: © {current year} FURLANICH, with the build year supplied normally; no corporate suffix, registration, tax statement or address is added. Copyright identity presentation is not verification of legal status. A footer Contact link is useful navigation even when the header has a primary action.

Exact direct-channel action wording is owned by D03. Other navigation labels above apply consistently to header/footer. No new page or top-level Founder/Lab item. Every non-Contact CTA not listed for replacement retains its approved label/destination; no context-carrying form feature is proposed.


## Execution dependency clarification — 2026-09-17

The [completed PLAN-MARKETING-PRESENTATION-EXCELLENCE](../plans/completed/marketing-presentation-excellence-v1.md) records the T1–T6 delivery of accepted D06-IA work. D03 remains REJECTED: the Global notice explanation row is not executable, and direct-channel wording remains the existing Contact baseline. Stable navigation labels, footer grouping, locale equivalence and owner-approved page endings do not adopt the rejected global notice or Contact replacements.
