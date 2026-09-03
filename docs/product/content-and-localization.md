---
id: CONTENT-LOCALIZATION
type: content-strategy
status: PROPOSED
related:
  - BRAND-POSITIONING
  - IA-SITE
  - PAGE-HOME
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-03
---

# Content and localization

## Language priority — APPROVED

- Primary locale: Spanish for Argentina (`es-AR`) at root routes.
- Secondary locale: English under `/en/`.
- Spanish uses professional, natural voseo: `Contanos`, `Hablemos`, `¿Qué necesitás resolver?`.
- English copy must be adapted for clarity, not mechanically translated.

## Homepage-foundation English scope — APPROVED

- Exact English `HOME-HERO` copy is owned by [PAGE-HOME](pages/home.md#approved-english-adaptation).
- The minimum English Services destination is owned by [PAGE-SERVICES](pages/services.md#homepage-foundation-minimum-destination-approved).
- The minimum English Contact destination is owned by [PAGE-CONTACT](pages/contact-and-privacy.md#homepage-foundation-minimum-destination-approved).
- The approved English founder biography and minimum Founder destination are owned by [PAGE-FOUNDER](pages/studio-and-founder.md#approved-detailed-biography).

English adaptations outside that minimum slice remain **OPEN** and do not block homepage-foundation technical planning.

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

The broader non-fabrication policy remains **PROPOSED** in the status register because the project owner has not adopted it as an **APPROVED** standalone rule.

## Source-material requirements

Before final public content is complete, the repository needs:

- approved item-level project records;
- client logo and description permissions;
- founder photograph;
- final approved biography wording;
- final form/privacy provider details;
- final English adaptations outside the approved homepage-foundation slice;
- verified public URLs and repositories.
