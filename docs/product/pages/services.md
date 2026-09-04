---
id: PAGE-SERVICES
type: page-spec
status: APPROVED
related:
  - AUDIENCES-SERVICES
  - SERVICE-WEB
  - SERVICE-WHATSAPP
  - SERVICE-CONSULTING
  - PAGE-CONTACT
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-04
---

# Services page

## Responsibility

Explain the three launch services in enough detail for a prospective client to recognize fit, understand representative outcomes and boundaries, and continue to an inquiry. The page does not promise a fixed packaged solution before discovery.

## Required hierarchy

1. Page introduction focused on business needs.
2. `SERVICE-WEB`.
3. `SERVICE-WHATSAPP`.
4. `SERVICE-CONSULTING`.
5. Cross-service working principles and boundaries.
6. Contact CTA.

## Required content for each service

- client situation or problem;
- intended outcomes;
- representative use cases;
- what a typical engagement may include;
- what is not implied or guaranteed;
- relevant third-party dependencies;
- who the service is and is not a fit for;
- truthful related evidence;
- CTA to `PAGE-CONTACT`.

## Homepage-foundation minimum destination — APPROVED

Before `HOME-HERO` is integrated, `/servicios/` and `/en/services/` must be real, localized, and useful routes rather than placeholders. They do not need the complete evidence catalogue, FAQ, service-specific detail pages, or final commercial terms.

The minimum Spanish route uses the approved `HOME-SERVICES` heading, introduction, three service titles, and summaries, followed by `Contanos qué necesitás resolver` → `/contacto/`.

The minimum English route uses:

**H1**

> Services for concrete business needs

**Introduction**

> We do not force a generic platform. First we understand the process, then decide whether building, integrating, or modernizing is the right approach.

**Business websites and web applications**

> Web solutions that help businesses present, sell, or manage services: professional websites, catalogues, ordering, bookings, customer portals, and payment integrations.

**WhatsApp automation and integrations**

> Flows for answering common questions, capturing orders, managing bookings, sending confirmations, and connecting WhatsApp with other business tools.

**Software maintenance and IT consulting**

> Diagnosis and improvement of existing systems to solve problems, reduce risk, and define a maintainable technical path.

**CTA:** `Tell us what you need to solve` → `/en/contact/`

A bare “coming soon” destination was rejected because it would make the hero CTA formally valid but commercially useless. Requiring the complete Services specification was rejected because evidence, FAQs, and detailed commercial terms are not needed to explain the three approved services.

## Service-section fragments and CTAs — OPEN, NON-BLOCKING

The approved Services route is `/servicios/`. Exact fragment identifiers for the three service sections, including potential `#web`, `#whatsapp`, and `#consultoria` identifiers, are **OPEN**. Whether any homepage or in-page CTA must target a service-specific fragment is also **OPEN**. This does not block the homepage foundation: all foundation service CTAs route to the page root.

For the complete commercial homepage, `PAGE-HOME` now **REJECTS** three duplicate service-card CTAs and **APPROVES** one section-level CTA to the Services page root in each language. Future Services-page fragment decisions therefore do not block homepage implementation and must not be introduced into the homepage plan without a later content decision.

## Service-specific requirements

### SERVICE-WEB

Cover professional sites, catalogues, orders, bookings, portals, and payment-provider integrations. Distinguish a commercial site from a purely presentational landing page where useful.

### SERVICE-WHATSAPP

Cover attention, ordering, booking, confirmation, payment initiation, and integration flows. Explain that provider rules, templates, fees, and integration capabilities constrain the final solution.

### SERVICE-CONSULTING

Cover diagnosis, defect investigation, stabilization, integration, dependency updates, performance, modernization planning, and ongoing support by agreement. Do not promise support response SLAs without a separate agreement.

## Boundaries

- ERP and advanced AI solutions require tailored discovery.
- Existing products or integration may be recommended instead of custom construction.
- No fixed price, timeline, or guaranteed business metric appears without a defined scope.
- Technology stacks remain supporting detail.

## CTA

Primary: `Contanos qué necesitás resolver` → `/contacto/`

## Dependencies and open content

- Approved evidence for WhatsApp and maintenance/consulting.
- Final commercial model wording.
- Final provider and platform disclosures.
- Whether frequently asked questions belong on this page after launch.

## Acceptance criteria

- A non-technical decision-maker can distinguish all three services.
- Each service begins with a recognizable situation or outcome.
- Tailored work is not described as a ready-made product.
- External-service constraints are not hidden.
- Each section provides a direct inquiry path.
