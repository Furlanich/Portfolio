---
id: CONTENT-LOCALIZATION
type: content-strategy
status: PROPOSED
related:
  - BRAND-POSITIONING
  - IA-SITE
  - PAGE-HOME
  - PAGE-SERVICES
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-05
---

# Content and localization

## Language priority — APPROVED

- Primary locale: Spanish for Argentina (`es-AR`) at root routes.
- Secondary locale: English under `/en/`.
- Spanish uses professional, natural voseo: `Contanos`, `Hablemos`, `¿Qué necesitás resolver?`.
- English copy must be adapted for clarity, not mechanically translated.

## Homepage-foundation English scope — APPROVED

- Exact English `HOME-HERO` copy is owned by [PAGE-HOME](pages/home.md#home-hero-approved-english-adaptation).
- The minimum English Services destination is owned by [PAGE-SERVICES](pages/services.md#homepage-foundation-minimum-destination-approved).
- The minimum English Contact destination is owned by [PAGE-CONTACT](pages/contact-and-privacy.md#homepage-foundation-minimum-destination-approved).
- The approved English founder biography and minimum Founder destination are owned by [PAGE-FOUNDER](pages/studio-and-founder.md#approved-detailed-biography).

At the time of the foundation slice, English adaptations outside that minimum were **OPEN**. Initiative 2 closes the complete commercial homepage below; other pages and future project evidence still require separate adaptations.

## Complete commercial homepage English scope — APPROVED

- Exact natural English adaptations for `HOME-PROBLEMS`, `HOME-SERVICES`, `HOME-AUDIENCES`, the `HOME-PROOF` launch fallback, `HOME-PROCESS`, `HOME-FOUNDER`, and `HOME-CTA` are owned by [`PAGE-HOME`](pages/home.md).
- These adaptations are approved for implementation. They preserve the Spanish commercial meaning without forcing Spanish syntax or literal vocabulary into English.
- Existing Spanish text is not blanket approval for English publication. Any future project card, page, or claim still needs its own reviewed English adaptation.
- The project-card variant of `HOME-PROOF` remains **OPEN** because no project is currently publication-ready in `PROJECT-EVIDENCE`.

## Complete Services English scope — APPROVED

- Exact natural English copy for the `/en/services/` introduction, all three service sections, fit and non-fit guidance, provider and commercial boundaries, evidence status, contextual CTAs, cross-service principles, AI note, and final CTA is owned by [`PAGE-SERVICES`](pages/services.md#english-content-approved).
- The English adaptation preserves the approved Spanish product meaning while using natural business phrasing such as `enquiry`, `booking`, `handover`, and `existing system` where appropriate. It does not translate voseo mechanically or turn internal stable IDs into visible technical language.
- Spanish and English use equivalent content order and disclosure meaning. Different sentence structure is acceptable; different promises, inclusions, exclusions, evidence strength, or provider responsibility are not.
- The stable equivalent fragments are `#web` ↔ `#web`, `#whatsapp` ↔ `#whatsapp`, and `#consultoria` ↔ `#consulting`.
- English content for other unfinished pages and future project evidence remains subject to separate approval.

## Voice — APPROVED

- Lead with business problems and useful outcomes.
- Use technical terminology only where it helps a prospective client evaluate fit or credibility.
- Keep Samuel visible as the accountable founder without turning business pages into a first-person résumé.
- Prefer the brand as a grammatical subject: “FURLANICH desarrolla…”
- Describe national and international availability without implying unsupported client history.
- Avoid empty language such as “innovative solutions that transform businesses.”

## Content hierarchy — APPROVED

1. Client situation or desired outcome.
2. Relevant service or solution.
3. Evidence and disclosure status.
4. Working process and trust.
5. Technical detail where it supports evaluation.
6. Clear inquiry action.

Technology stacks do not lead homepage or project cards. They may appear lower in founder or project-detail content.

## Terminology

Canonical product terminology is defined in [`CONTEXT.md`](../../CONTEXT.md).

Public project labels are **PROPOSED**:

- `Solución en producción`
- `Laboratorio FURLANICH`
- `Prototipo funcional`

Avoid “Productive Solutions” in English; it can imply productivity software. The proposed English label is `Production solution`.

## Metadata and discoverability — PROPOSED

Each localized page should provide:

- a unique localized title and description;
- a self-referencing canonical URL;
- Spanish/English `hreflang` alternates;
- the correct document language;
- Open Graph locale data;
- sitemap language alternates;
- stable social-preview imagery that does not misrepresent client work.

Proposed Spanish homepage metadata:

> **Title:** FURLANICH | Software a medida para pymes

> **Description:** Sitios y aplicaciones web, automatización por WhatsApp, integraciones y mantenimiento de software para pymes de Argentina. Atención técnica directa.

## Canonical domain — OPEN, RELEASE BLOCKER

The canonical production domain does not block component implementation, localized route implementation, or integration testing. It blocks final production metadata and release sign-off.

Before the business homepage is declared production-ready, approve either a custom domain or the current deployment URL as canonical, then use that value consistently for canonical URLs, language alternates, sitemap entries, and social metadata. Do not invent a production origin during implementation.

## Claims and evidence

- Approved client confidentiality limits govern all copy.
- Metrics require a documented source and permission.
- “In production” requires confirmation of real operational use.
- “Functional” requires a working implementation that can be demonstrated or reproduced.
- Generated visuals require a conceptual disclosure and cannot serve as production evidence.
- Testimonials and endorsements require permission and attributable source material.
- Do not invent clients, metrics, testimonials, team size, production outcomes, ownership, or disclosure permission.
- Do not convert private/client work into a public case study without explicit item-level permission.
- Do not present a prototype, repository, screenshot, or generated visual as client or production evidence.

These non-fabrication rules are **APPROVED**.

## Source-material requirements

Before final public content is complete, the repository needs:

- approved item-level project records;
- client logo and description permissions;
- founder photograph;
- final form/privacy provider details;
- final English adaptations outside the approved complete homepage, complete Services page, and existing minimum destination slices;
- verified public URLs and repositories.

The founder photograph and unresolved project evidence do not block the approved text-led commercial homepage. They remain dependencies for later visual or project-card variants only.
