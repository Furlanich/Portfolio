---
id: PAGE-CONTACT
type: page-spec
status: OPEN
related:
  - PAGE-PRIVACY
  - HOME-CTA
  - IA-SITE
  - PAGE-FOUNDER
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ARCHITECTURE-MAP
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-12
---

# Contact and privacy pages

## Initiative 6 decision closure — APPROVED product, content, design, and provider architecture; deployment gates OPEN

The completed Contact experience is the primary conversion destination for FURLANICH. A prospective client must be able to complete and submit the inquiry inside `/contacto/` or `/en/contact/`; the primary flow must not open or require a local email application. A `mailto:` action remains an alternative direct channel and is **REJECTED** as the form implementation.

This Work closure approves the form purpose, fields, page hierarchy, bilingual copy, state model, validation behavior, visual composition, accessibility behavior, spam requirements, notification content, privacy requirements, and testing boundary below. Provider architecture was subsequently accepted through the Contact RFC and ADR; the page specification still does not approve a server-side runtime, private browser credential, hosting change, or unverified deployment fact.

The provider boundary is consequential because it processes personal information, controls delivery and storage, and may create an international transfer. The repository owner accepted [`RFC-CONTACT-INQUIRY-PIPELINE`](../../rfcs/contact-inquiry-pipeline.md) in Governance PR #43, and [`ADR-CONTACT-INQUIRY-PIPELINE`](../../decisions/contact-inquiry-pipeline.md) records Formspree behind the narrow provider-neutral adapter for the static release. [`PLAN-CONTACT-INQUIRY-PIPELINE`](../../plans/active/contact-inquiry-pipeline.md) owns implementation. The form must not be publicly enabled until the verified provider configuration, Privacy page, professional legal review, deterministic and rendered checks, and labeled delivery/deletion evidence are complete.

## Completed Contact hierarchy — APPROVED

Use one source and reading order in both locales:

```text
CONTACT-INTRO
CONTACT-RESPONSE-EXPECTATION
CONTACT-INQUIRY-FORM
CONTACT-ALTERNATIVES
CONTACT-FOUNDER-CONTEXT
```

The form is the visually dominant action. WhatsApp, email, and phone remain available after it in that order. They do not appear above the form or compete with its primary button. The Founder link is subdued and last.

At wide sizes, the introduction and response expectation span the readable page measure before a 12-column content area. The single-column form occupies approximately eight columns on the left; alternatives and location occupy approximately four columns on the right. The response expectation is not duplicated in the side column. Below the wide range, everything stacks in the source order above: intro, response expectation, form, alternatives/location, then Founder context.

## Approved bilingual Contact copy

Exact form and state copy is owned here. `CONTENT-LOCALIZATION` summarizes its approval without duplicating it.

### Spanish — APPROVED

**H1**

> Contanos qué necesitás resolver.

**Introduction**

> Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.

**Response expectation**

> Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.

**Form heading**

> Iniciar una consulta

**Form introduction**

> Completá los datos y contanos brevemente el problema, cómo funciona hoy y qué te gustaría mejorar.

**Required-fields note**

> Los campos indicados como obligatorios son necesarios.

**Fields**

- `Nombre` — `Obligatorio`
- `Correo electrónico` — `Obligatorio`
- `Empresa` — `Opcional`
- `¿Qué necesitás resolver?` — `Obligatorio`

**Email helper**

> Lo usaremos únicamente para responder esta consulta.

**Message helper**

> No incluyas contraseñas, credenciales ni datos sensibles.

**Privacy context**

> Usaremos tus datos para evaluar y responder tu consulta. Antes de enviar, consultá cómo los tratamos en nuestra Política de privacidad.

`Política de privacidad` links to `/privacidad/`.

**Validation messages**

- Empty name: `Ingresá tu nombre.`
- Name over 100 characters: `El nombre no puede superar los 100 caracteres.`
- Empty email: `Ingresá tu correo electrónico.`
- Invalid email: `Ingresá un correo electrónico válido.`
- Email over 254 characters: `El correo electrónico no puede superar los 254 caracteres.`
- Company over 120 characters: `El nombre de la empresa no puede superar los 120 caracteres.`
- Empty message: `Contanos qué necesitás resolver.`
- Message over 4,000 characters: `El mensaje no puede superar los 4.000 caracteres.`

**Submit label:** `Enviar consulta`

**Submitting label:** `Enviando...`

**Success**

> Consulta enviada.
>
> Gracias por escribirnos. Samuel revisará personalmente tu mensaje.

**Failure**

> No pudimos enviar la consulta.
>
> Tus datos siguen en el formulario. Intentá nuevamente o escribinos por WhatsApp.

**Retry label:** `Intentar nuevamente`

**Alternative-channel heading:** `¿Preferís otro canal?`

**Alternative actions, in order:** `Escribir por WhatsApp`, `Enviar un correo`, `Llamar`.

**Founder-context link:** `Conocer la trayectoria de Samuel` → `/estudio/samuel-furlanich/`.

### English — APPROVED

**H1**

> Tell us what you need to solve.

**Introduction**

> Samuel personally reviews every inquiry to determine whether it makes sense to continue with a conversation.

**Response expectation**

> Usual response time is within the same business day. In exceptional cases, it may take up to two business days.

**Form heading**

> Start an inquiry

**Form introduction**

> Share your details and briefly explain the problem, how it works today, and what you would like to improve.

**Required-fields note**

> Fields marked as required must be completed.

**Fields**

- `Name` — `Required`
- `Email` — `Required`
- `Company` — `Optional`
- `What do you need to solve?` — `Required`

**Email helper**

> We will use it only to respond to this inquiry.

**Message helper**

> Do not include passwords, credentials, or sensitive information.

**Privacy context**

> We will use your information to review and respond to your inquiry. Before sending, read how we handle it in our Privacy Policy.

`Privacy Policy` links to `/en/privacy/`.

**Validation messages**

- Empty name: `Enter your name.`
- Name over 100 characters: `Name must be 100 characters or fewer.`
- Empty email: `Enter your email address.`
- Invalid email: `Enter a valid email address.`
- Email over 254 characters: `Email must be 254 characters or fewer.`
- Company over 120 characters: `Company must be 120 characters or fewer.`
- Empty message: `Tell us what you need to solve.`
- Message over 4,000 characters: `Your message must be 4,000 characters or fewer.`

**Submit label:** `Send inquiry`

**Submitting label:** `Sending...`

**Success**

> Inquiry sent.
>
> Thanks for getting in touch. Samuel will personally review your message.

**Failure**

> We couldn't send your inquiry.
>
> Your information is still in the form. Try again or contact us on WhatsApp.

**Retry label:** `Try again`

**Alternative-channel heading:** `Prefer another way to get in touch?`

**Alternative actions, in order:** `Write on WhatsApp`, `Send an email`, `Call`.

**Founder-context link:** `View Samuel's background` → `/en/about/samuel-furlanich/`.

The success message confirms only that the selected provider accepted the submission. It does not claim that Samuel has read it. The failure message never exposes a raw provider response or error identifier.

## Form fields and limits — APPROVED

The minimal form remains unchanged:

| Field | Required | Input expectation | Maximum |
| --- | --- | --- | --- |
| Name | Yes | Person's name; surrounding whitespace normalized | 100 characters |
| Email | Yes | Email syntax suitable for response and provider `Reply-To` | 254 characters |
| Company | No | Organization name when useful | 120 characters |
| What do you need to solve? | Yes | Plain-text problem and context description | 4,000 characters |

Do not add phone, budget, deadline, project type, service selection, marketing consent, or file upload. The message has no minimum length beyond being non-empty after trimming. Validation must run in the browser for immediate feedback and at the provider/endpoint boundary for malformed or bypassed requests.

## Inquiry state model — APPROVED

```text
IDLE
  -> VALIDATING
      -> IDLE        (validation failed; focus first invalid field)
      -> SUBMITTING  (valid payload captured)
          -> SUCCESS (provider confirmed acceptance)
          -> ERROR   (network, timeout, provider rejection, or malformed response)

ERROR -> VALIDATING  (retry)
SUCCESS -> IDLE      (visitor begins a new inquiry)
```

- **IDLE:** fields are editable and entered values remain the source of truth.
- **VALIDATING:** trim and validate the approved fields and limits. Display every relevant field error, associate it with its control, preserve values, and focus the first invalid control. The small form does not require a separate error-summary block when this behavior is implemented correctly.
- **SUBMITTING:** capture the validated payload, set the form busy, keep every label and submitted value visible, disable the field group and primary submit action for the active request, and show the localized submitting label. Do not launch a second request from clicks, Enter, or programmatic submission. Do not report success while the request is merely in flight.
- **SUCCESS:** enter only after the selected provider returns its documented successful acceptance response. Announce and programmatically focus the success status, then reset fields. Keep WhatsApp, email, and phone visible. A provider acceptance is not a claim that the message has been read.
- **ERROR:** use for network failure, timeout, provider failure/rejection, or an unrecognized response. Restore all controls, preserve every value exactly as entered, announce and focus the failure status, offer retry, and keep WhatsApp as the strongest fallback followed by email and phone.

No automatic background retry is approved at launch because it may create duplicate inquiries. Editing a field after an error clears only that field's stale validation error; it does not erase the other fields or conceal the submission failure before the visitor acts.

## Email notification and delivery contract — APPROVED requirement

The selected provider must deliver a useful notification to Samuel's configured business inbox. The notification contains:

- visitor name;
- visitor email, used as `Reply-To` where the provider supports it;
- company only when supplied;
- inquiry message;
- provider-received submission time or another trustworthy server-side timestamp where supported;
- source route and language (`/contacto/`, `es-AR`; or `/en/contact/`, `en`) when supported and useful.

The target inbox and provider-side recipient configuration are operational configuration, not browser payload or public source. Gmail passwords, SMTP credentials, private API keys, secret webhook values, and equivalent credentials must never be shipped in frontend JavaScript, public environment variables, repository files, test fixtures, logs, URLs, or analytics. A public Formspree form ID/endpoint or EmailJS public key is not treated as a secret, but its exposure does not remove the need for origin restrictions, validation, spam controls, and quota monitoring.

Before release, a labeled production smoke inquiry must be accepted by the provider, arrive in Samuel's configured inbox with every field intact, expose the visitor address as `Reply-To` where supported, and be removable under the approved retention/deletion process. Deterministic tests mock the adapter boundary and do not send real inquiries.

## Spam and abuse handling — APPROVED launch requirements

- Enable the selected provider's standard spam filtering and restrict accepted origins/domains where supported.
- Include a non-focusable honeypot that is absent from the accessibility tree and never announced as a visitor field when the provider supports one.
- Prevent duplicate submission in the UI for the complete active request. If the selected endpoint supports idempotency, the RFC must decide whether to use it; do not invent a client-only token that exposes inquiry data.
- Enforce the approved field types and maximum lengths on both sides of the network boundary. Reject missing required fields, malformed email, over-limit content, unexpected file content, and unsupported fields with a safe response.
- Treat rate limits, quota failures, timeouts, non-success status codes, invalid JSON, and unexpected provider responses as `ERROR`; preserve content and show the approved visitor-facing failure copy.
- Do not enable an interactive CAPTCHA by default when provider filtering, domain restriction, honeypot, and reasonable limits are sufficient.
- If observed abuse makes an additional challenge necessary, compare privacy, accessibility, keyboard, localization, script, and failure-mode effects before adoption. A later CAPTCHA/Turnstile/hCaptcha/reCAPTCHA choice must update `PAGE-PRIVACY` with the additional processor and data flow and must not ship as an unreviewed implementation detail.

## Provider requirements and candidate evaluation — APPROVED architecture; deployment facts OPEN

The provider decision uses these ordered criteria:

1. preserve static export and GitHub Pages unless a stronger reason justifies change;
2. ship no private credential to the browser;
3. deliver inquiry notifications reliably to email;
4. support AJAX/in-page submission;
5. support proportionate spam mitigation;
6. permit the custom accessible state model and copy above;
7. provide reviewable privacy, processing, storage, and deletion terms;
8. keep operational burden low;
9. support straightforward deterministic and live-smoke testing;
10. remain replaceable behind one narrow application boundary.

| Candidate | Fit and trade-offs | Current status |
| --- | --- | --- |
| Formspree | Preserves the current static host; accepts in-page JavaScript submissions through a public form ID; sends target-email notifications; supports `Reply-To`, server-side validation, provider spam filtering, honeypot, domain restriction, and optional challenge controls; and exposes custom success/failure handling. It also processes and normally stores submissions outside the site, so storage mode, plan limits, retention enforcement, subprocessors, international transfer, and notification delivery must be verified and disclosed. | **APPROVED launch processor** under `ADR-CONTACT-INQUIRY-PIPELINE`; verified provisioning and legal/privacy review remain release gates. |
| First-party/serverless endpoint + Resend | Keeps the Resend API key server-side and offers the strongest control over validation, rate limiting, message construction, storage minimization, idempotency, and observability. It requires a separately hosted serverless boundary or a hosting change, verified sending-domain/DNS work, custom abuse/security handling, monitoring, and greater operational/test burden. | Considered alternative; not recommended solely for a four-field launch form. Adoption would require explicit backend/deployment architecture approval. |
| EmailJS or an equivalent browser-oriented email service | Can preserve static hosting and trigger predefined templates through intentionally public browser identifiers. Origin allowlisting, rate limiting, and optional CAPTCHA reduce abuse, but the browser remains more directly coupled to the email template/service configuration and public quota surface, and the same processor/privacy review remains necessary. | Considered alternative; lower preference than Formspree for the narrow, replaceable launch boundary. |

The recommended architecture for the RFC to evaluate is:

```text
ContactForm
    -> InquirySubmissionPort / submitInquiry()
        -> Formspree adapter
            -> public Formspree HTTPS endpoint
                -> configured FURLANICH target email
```

Only the form/client boundary and one provider adapter should know Formspree response details. The UI consumes a small typed outcome sufficient for `SUCCESS`, field validation, or `ERROR`. Do not build a plugin system, provider registry, generic workflow engine, CRM abstraction, or bespoke backend around this form.

The existing deployment reference to `NEXT_PUBLIC_FORMSPREE_ENDPOINT` and the retired pre-cutover Formspree form are **CURRENT/LEGACY evidence only**. They do not approve the provider or prove the current account configuration, recipient, storage, retention, spam, privacy, or delivery behavior.

On 2026-09-12, a current Formspree endpoint and account configuration were reported outside the repository, with the plan, schema/settings, origin probes, synthetic delivery, and deletion checks reported as PASS. This is sanitized progress evidence only: no endpoint or form identifier is stored here, no final production host has been selected, and professional legal/privacy review remains OPEN.

Provider capabilities and terms were rechecked against first-party [Formspree AJAX](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax), [Formspree spam](https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam), [Formspree privacy](https://formspree.io/legal/privacy-policy/), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), and [EmailJS security](https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/) documentation on 2026-09-10. The RFC and release review must recheck them because plans, privacy terms, retention controls, and APIs may change.

## Privacy and deployed data-path requirements — APPROVED requirements; legal wording OPEN

The Privacy page must describe the real deployed path before the form is enabled. For the proposed Formspree path, the expected flow to verify and disclose is:

```text
Visitor browser
  -> GitHub Pages serves the static Contact page
  -> visitor submits name, email, optional company, message, source, and language over HTTPS
  -> Formspree validates, filters abuse, processes, and stores or forwards according to the approved account configuration
  -> Formspree's documented email-delivery provider sends a notification
  -> Samuel's configured Google/Gmail business inbox receives and stores the email
  -> Samuel uses the information only to evaluate and respond to the inquiry
```

GitHub Pages does not receive the inquiry fields when the browser posts directly to the form processor, but GitHub and the selected processor may process ordinary request metadata for hosting, security, and operations. The final notice must name the actual responsible legal/business identity and every material processor in the deployed configuration; it must not guess at Formspree subprocessors, storage settings, CAPTCHA providers, or mailbox behavior.

The notice and operational configuration must cover:

- **Data collected:** name, email, optional company, inquiry message, source/language, trustworthy submission time, and any IP address, browser, referrer, access log, anti-abuse token, or other metadata actually processed by the selected services.
- **Purpose:** evaluate the prospective client's need, determine whether and how to continue, respond to the inquiry, protect the form from abuse, and maintain proportionate operational records. Inquiry data is not approved for marketing, advertising, enrichment, training, or unrelated analytics.
- **Processors and recipients:** static host, form processor, its material email/security subprocessors, Samuel/FURLANICH as recipient/controller or other role confirmed by counsel, and the configured mailbox provider.
- **Provider storage:** whether submission storage is enabled, where it is processed, who can access it, how it is deleted, what backup/log exceptions exist, and what happens if an email notification is delayed or lost.
- **Operational retention target:** provider/dashboard copies are disabled when reliable delivery and recovery do not require them, or otherwise deleted within 30 days after successful receipt and triage. Inquiries remaining only in the business mailbox are deleted within 12 months after the last substantive contact when no engagement proceeds. If an inquiry becomes a proposal, contract, client record, dispute, security record, or legally required record, it moves to the separately governed business record and its applicable retention rule. Legal review may require this target to change before release.
- **Requests:** visitors can request access, correction, or deletion through the published business email. Samuel must verify the requester proportionately, action the request across active provider/dashboard and mailbox copies where applicable, and explain any lawful retention exception rather than promising unconditional deletion.
- **Consent and notice:** product design does not require a separate consent checkbox for this single-purpose inquiry and rejects a marketing checkbox. The visible privacy context and submit action provide the intended low-friction notice. Whether Argentine law or the selected international-transfer mechanism requires explicit consent, different wording, database registration, contractual safeguards, or a checkbox remains **OPEN pending professional legal review**.
- **Third-party disclosure:** identify international processing locations, transfer safeguards, relevant provider terms, and any challenge/security service. Do not describe the provider as a mere transport if it stores, filters, logs, or otherwise processes the submission.
- **Sensitive information:** the form does not request sensitive data, credentials, client production data, or attachments; the message helper warns against submitting them.

Professional Argentine legal review is a **RELEASE BLOCKER** and must address the then-current [Ley 25.326](https://www.argentina.gob.ar/normativa/nacional/ley-25326-64790/actualizacion) and regulations, the responsible party and database obligations, Article 6 notice content, access/correction/deletion handling, lawful basis and consent presentation, processor contracts, and [Article 12/international-transfer safeguards](https://www.argentina.gob.ar/transferencias-internacionales). This document approves facts and product behavior, not a legal conclusion.

## Analytics and secondary-use restraint — APPROVED

- Do not add a marketing subscription, CRM synchronization, lead enrichment, advertising pixel, or content-bearing analytics event in this initiative.
- Inquiry fields, success/failure payloads, provider error bodies, email addresses, messages, and company names never enter analytics, logs intended for product telemetry, URL paths, fragments, or query strings.
- A future content-free event such as `inquiry_submission_succeeded` requires separate analytics/privacy approval and may contain only an allowlisted locale/source identifier and non-identifying state. It is not part of launch scope.

## Implementation and verification boundary — APPROVED requirements

Implementation follows `PLAN-CONTACT-INQUIRY-PIPELINE`, `frontend-implementation`, test-first behavior, `playwright-qa`, `visual-qa`, `verification-before-completion`, and `pr-readiness` under the accepted provider ADR. At minimum, future tests and review must cover:

- pure validation and state transitions, including trimming and every field limit;
- the narrow submission port and provider adapter mapping for accepted, field-error, rejected, timeout/network, invalid-response, and duplicate-submit cases;
- both locales' labels, helper text, errors, loading, success, failure, privacy link, alternative ordering, and Founder link;
- value preservation on validation and submission failure, reset only after confirmed success, retry, and no raw provider error exposure;
- form semantics, label/control association, required indication, `aria-describedby`, `aria-invalid`, busy state, live announcements, focus movement, keyboard-only completion, Enter submission, and duplicate prevention;
- responsive and visual states at `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x900`, including 200% text zoom, textarea resizing, error expansion, no clipping/overflow, and optional `/Portfolio` base path;
- representative axe scans plus manual semantics, keyboard, focus, contrast, error-identification, reflow, and assistive-technology checks;
- a production-configured, labeled live smoke submission confirming provider acceptance, inbox delivery, field integrity, `Reply-To`, source/language, spam behavior, and deletion/retention operations.

Provider/network behavior is mocked in deterministic tests. Live production smoke inquiries must be clearly labeled, must not contain real prospect information, and must not run automatically in public CI.

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

## Privacy implementation closure — APPROVED factual requirements; architecture and legal wording OPEN

The factual notice scope, purpose limits, processor/storage/retention disclosures, request method, and operational retention target are approved above. Formspree is the accepted launch provider; its exact configuration and material subprocessor chain, the responsible legal/business identity, international-transfer mechanism, legally sufficient notice/consent wording, and professional Argentine legal review remain OPEN release blockers.

The Contact form must not be publicly enabled until PAGE-PRIVACY names the real deployed processors, storage behavior, retention operations, request route, and transfer treatment and every release gate in `PLAN-CONTACT-INQUIRY-PIPELINE` has passed.

## Acceptance criteria

- The form contains the four approved fields.
- Primary and secondary channel hierarchy is clear.
- Email and phone/WhatsApp values are consistent throughout the site.
- Response copy is visible but not misrepresented as support coverage.
- Privacy content describes the real deployed data flow and providers.
- Consent is informed and not bundled with marketing.


## Founder-context link — APPROVED

After the primary direct-contact choices and response expectation, Contact may include one subdued internal text link where the copy explains that Samuel personally reviews the inquiry:

- Spanish: “Conocer la trayectoria de Samuel” → /estudio/samuel-furlanich/
- English: “View Samuel's background” → /en/about/samuel-furlanich/

This link provides relevant professional context. It is not a primary or secondary contact button, does not precede the inquiry/direct-channel actions, and does not duplicate the Studio or Founder narrative.