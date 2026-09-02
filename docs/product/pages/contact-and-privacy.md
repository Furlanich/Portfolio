---
id: PAGE-CONTACT
type: page-spec
status: OPEN
related:
  - PAGE-PRIVACY
  - HOME-CTA
  - IA-SITE
last_verified: 2026-09-01
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

## Privacy implementation — OPEN

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
