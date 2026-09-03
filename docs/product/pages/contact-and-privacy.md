---
id: PAGE-CONTACT
type: page-spec
status: OPEN
related:
  - PAGE-PRIVACY
  - HOME-CTA
  - IA-SITE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-03
---

# Contact and privacy pages

## PAGE-CONTACT responsibility — APPROVED

Collect enough information to evaluate an inquiry while offering direct alternatives. Samuel decides whether and how to continue after reviewing the inquiry and, where appropriate, meeting the prospective client.

## Inquiry form — APPROVED

- `Nombre` — required.
- `Correo electrónico` — required.
- `Empresa` — optional.
- `¿Qué necesitás resolver?` — required message.

The form is the primary action. WhatsApp is secondary, followed by email and phone.

## Contact facts — APPROVED

- Email: `samuelfurlanich@gmail.com`
- Mobile/WhatsApp display: `+54 9 11 5011-7565`
- Phone URI: `tel:+5491150117565`
- WhatsApp URI: `https://wa.me/5491150117565`
- Location: Buenos Aires, Argentina; Chivilcoy may appear in contact or biography context.

Proposed WhatsApp prefilled message:

> Hola, Samuel. Me contacto desde el sitio de FURLANICH porque quisiera conversar sobre una solución para mi negocio.

## Response expectation — APPROVED

> Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.

This applies to inquiries, not an incident-support SLA.

## Homepage-foundation minimum destination — APPROVED

Before `HOME-HERO` is integrated, `/contacto/` and `/en/contact/` must be usable localized destinations. When the final form provider and privacy flow are not yet approved, the minimum route uses the approved direct contact channels and does not render a nonfunctional or misleading form.

### Spanish minimum

**H1**

> Contanos qué necesitás resolver.

**Introduction**

> Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.

Show the approved response expectation, location, and working actions for WhatsApp, email, and phone.

### English minimum

**H1**

> Tell us what you need to solve.

**Introduction**

> Samuel personally reviews every inquiry to determine whether it makes sense to continue with a conversation.

**Response expectation**

> Usual response time is within the same business day. In exceptional cases, it may take up to two business days.

**Actions:** `Write on WhatsApp`, `Send an email`, and `Call`.

This direct-channel minimum satisfies CTA integrity for foundation integration and an explicitly staged deployment. It does not satisfy the approved final conversion model. The structured form, real provider disclosure, and privacy treatment are **RELEASE BLOCKERS** for declaring `PAGE-CONTACT` or the complete business-site launch finished.

A “coming soon” page was rejected because it abandons the visitor after the hero CTA. Selecting a form provider inside this content decision was rejected because provider, data flow, retention, and consent require their own privacy-ready release decision.

## Required behavior

- Programmatically associated labels and fields.
- Clear required/optional indicators.
- Understandable inline validation.
- Loading, success, and failure states announced accessibly.
- No submitted information lost silently.
- Alternative contact route available when form submission fails.
- No marketing subscription implied by an inquiry.

## PAGE-PRIVACY responsibility — APPROVED

Explain in plain language what information is collected, why it is used, who processes it, how long it is retained, and how a person may request access, correction, or deletion.

## Privacy implementation — OPEN, RELEASE BLOCKER FOR THE COMPLETE BUSINESS LAUNCH

- Final form provider. The current implementation references Formspree, but that is not an approved target decision.
- Responsible legal/business identity.
- Consent wording and interaction.
- Retention period.
- Email and hosting providers that process information.
- Deletion/contact procedure.
- Final legal review under applicable Argentine requirements.

The contact form must not be publicly enabled without resolving the privacy notice and actual provider disclosure.

## Acceptance criteria

- The form contains the four approved fields.
- Primary and secondary channel hierarchy is clear.
- Email and phone/WhatsApp values are consistent throughout the site.
- Response copy is visible but not misrepresented as support coverage.
- Privacy content describes the real deployed data flow and providers.
- Consent is informed and not bundled with marketing.
