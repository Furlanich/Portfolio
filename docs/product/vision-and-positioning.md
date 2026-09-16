---
id: BRAND-POSITIONING
type: product-foundation
status: PROPOSED
related:
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - AUDIENCES-SERVICES
  - CONTENT-LOCALIZATION
  - PAGE-HOME
  - PAGE-CONTACT
  - ADR-CONTACT-INQUIRY-DEMO-MODE
last_verified: 2026-09-16
---

# Vision and positioning

## Product purpose — APPROVED

The existing personal portfolio will become the commercial website for **FURLANICH**. The business site is the primary experience. Samuel Furlanich's professional history and selected personal work remain as secondary credibility content inside the same website.

The site must help a prospective client understand:

1. what FURLANICH can solve;
2. whether the offer is relevant to their business;
3. what evidence supports the offer;
4. how the work is approached;
5. how to start an inquiry.

The site is not primarily intended to optimize Samuel's presentation to recruiters.

## Current deployment posture — APPROVED

The intended long-term product remains the founder-led commercial website described above, but the current public deployment is a **portfolio and technical demonstration only**. It does not offer, accept, quote, or operate commercial services through site capabilities while development remains incomplete.

The canonical demonstration URL is `https://furlanich.github.io/Portfolio/`. Commercially oriented copy and service structures demonstrate the intended product direction; they are not evidence that the corresponding commercial operation is active. Contact and Privacy must make this boundary explicit. The public Contact form may demonstrate fields, validation, loading, success, failure, preservation, retry, and fallbacks only through the zero-transmission mode accepted by [`ADR-CONTACT-INQUIRY-DEMO-MODE`](../decisions/contact-inquiry-demonstration-mode.md).

Changing from demonstration to commercial operation is a future product, legal, privacy, operational, and release decision. It requires repository synchronization and a human-reviewed activation plan rather than an environment-only switch.

## Commercial identity

- **APPROVED:** Commercial name: **FURLANICH**.
- **APPROVED:** Founder-led model with Samuel as the face and directly accountable technical lead.
- **APPROVED:** Collaborators may participate when scope requires specialized capacity; their existence or identities should not change the client's understanding of accountability.
- **PROPOSED:** Public descriptor: “Estudio de desarrollo de software a medida.”
- **REJECTED:** Presenting the permanent size or composition of a team as a primary trust signal.

## Positioning

### Market position — APPROVED

FURLANICH addresses concrete business problems through commercial web experiences, WhatsApp automation and integrations, and the diagnosis or improvement of existing software.

The value proposition must lead with business usefulness rather than a technology stack. Technical depth supports credibility but is secondary to the client problem and intended result.

### Availability — APPROVED

- Primary market: Argentina, initially Buenos Aires Province and CABA.
- Other Argentine provinces are in scope.
- International projects are in scope.
- Spanish for Argentina is primary; English is secondary.
- Availability must not be rewritten as an unsupported claim of existing international clients.

### Durable public descriptor — PROPOSED

> Estudio de desarrollo de software a medida

The approved homepage H1 and its surrounding copy are owned by [`HOME-HERO`](pages/home.md#home-hero). That page-level approval does not adopt the copy as permanent brand language. The general descriptor remains proposed until it is separately adopted as durable brand language.

## Differentiation

### Approved differentiation

- Direct technical responsibility from the founder.
- Solutions defined around each client's actual process and constraints.
- No ready-made claim for ERP or advanced AI work; these require discovery.
- Existing systems may be diagnosed, maintained, integrated, or modernized rather than discarded by default.
- Client experience and operational needs take precedence over novelty.
- Deployment follows testing and quality assurance appropriate to the agreed scope and risk; this does not imply a zero-defect guarantee.

“Current technology” describes maintainable choices for new work. It does not exclude maintenance or modernization of an existing legacy system; that work is an approved launch service.

### Proposed differentiation language

- The approved Spanish service introduction is owned by [`HOME-SERVICES`](pages/home.md#home-services). As durable positioning, an assessment-first approach before choosing to build, integrate, or modernize remains **PROPOSED**.
- Describe technology as current and maintainable rather than merely new.
- Describe quality through specific review and validation practices instead of “zero defects” or unsupported assurance claims.

## Brand tone

### Approved tone

- Professional, clear, confident, and business-oriented.
- Natural Argentine Spanish using restrained professional voseo.
- Concrete language about problems, workflows, and outcomes.
- Founder presence without turning the business homepage into a résumé.
- No unnecessary jargon where plain business language is available.

### Integrity guardrails — APPROVED

- Do not invent clients, metrics, testimonials, production outcomes, or team size.
- Do not present generated visuals as implemented systems.
- Do not call prototypes client work.
- Use client logos only with permission.

Public availability, a legacy portfolio entry, or a source repository does not by itself establish client permission, production maturity, a result, or FURLANICH ownership. The item-level evidence and publication rules are owned by [`PROJECT-EVIDENCE`](project-evidence.md).

## AI positioning

- **APPROVED:** AI is not a top-level launch page or standalone homepage section.
- **APPROVED:** ERP and AI automation are tailored possibilities, not instant standardized products.
- **APPROVED:** AI may be mentioned strategically where a real service or project justifies it.
- **PROPOSED:** If AI-assisted engineering is mentioned, responsibility for decisions and deliverables remains explicitly human.
- **OPEN:** Final public wording and any internal confidentiality policy for AI-assisted work.

The vendor-independent handling proposal is preserved in [Delivery and commercial boundaries](delivery-and-commercial-boundaries.md). It is not a certification claim.

## MKT-D01 — Durable category and buying problem — PROPOSED revision 1

**Candidate: PROPOSED. Human disposition: OPEN.** No approval is inferred from drafting, this task, or an unqualified PR merge. Existing APPROVED requirements remain operative until the owner explicitly accepts the named revision. Human reviewer, date, decision and approval reference: **OPEN**.

Governance: [marketing narrative RFC](../rfcs/marketing-narrative-closure.md). This revision selects a strategic direction for the intended studio; the current technical-demonstration posture above remains APPROVED and unchanged.

| Shortlisted territory | Category / priority | Advantage | Cost |
| --- | --- | --- | --- |
| A — General custom software studio | Custom development across web, automation and maintenance, with equal prominence | Familiar category; broad eligibility | Little distinction; buyers must choose a service before recognizing their situation |
| B — Operations-focused custom software studio — RECOMMENDED | Familiar custom-software category; lead with disconnected orders, bookings and daily workflows | Concrete buying trigger; connects integrations and improvement of existing software | Simple brochure-site work receives less hero emphasis; must remain visible in Services |

**Recommended selection: B.** The durable category remains familiar; the priority problem supplies differentiation. This is not a sector-specialist or proprietary-platform claim.

| Field | Existing status / wording | Proposed Spanish | Proposed English | Basis / permission |
| --- | --- | --- | --- | --- |
| Durable category | PROPOSED: Estudio de desarrollo de software a medida | Estudio de software a medida | Custom software studio | Existing founder-led model and three approved services; human adoption required |
| Priority buying situation | Several operating contexts, no ranked lead problem | Pedidos, reservas y tareas que dependen de mensajes, planillas y sistemas desconectados. | Orders, bookings and everyday tasks spread across messages, spreadsheets and disconnected systems. | Existing Home/Services situations; no claim of past client results |
| Differentiating mechanism, internal direction | Several repeated accountability statements | Samuel conecta la definición del problema con las decisiones técnicas y la revisión del trabajo. | Samuel connects problem definition, technical decisions and review of the work. | Founder responsibility is approved; revised public wording remains proposed |

Do not promise quantified savings, growth, automated exception handling, enterprise scale, instant ERP, proprietary products or an active commercial service. Availability remains Argentina/international, in Spanish/English; never convert it into project-history claims. The category is not a legal entity name.

**Approval unit D01:** choose A or B, then explicitly accept/revise the bilingual category and priority problem. Homepage wording is a separate D02 decision. If D01 remains OPEN, D02 can be reviewed but cannot become the new durable positioning by implication.
