---
id: PAGE-CONTACT
type: page-spec
status: OPEN
related:
  - RFC-MARKETING-NARRATIVE-CLOSURE
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
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - REF-CONTACT-DEMO-KIT
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-10-14
---

# Contact and privacy pages

## Initiative 6 decision closure — APPROVED dual demonstration/commercial posture

The complete commercial Contact experience remains the future conversion destination for FURLANICH. A prospective client must eventually be able to complete and submit an inquiry inside `/contacto/` or `/en/contact/`; that future primary flow must not open or require a local email application. A `mailto:` action remains an alternative direct channel and is **REJECTED** as the form implementation.

For the current public site, [`ADR-CONTACT-INQUIRY-DEMO-MODE`](../../decisions/contact-inquiry-demonstration-mode.md) approves a visibly labeled, local-only simulation on `https://furlanich.github.io/Portfolio/`. It keeps the same four fields, state model, validation, visual composition, accessibility behavior, bilingual experience, and direct alternatives, but it sends nothing and creates no commercial inquiry. The Formspree pipeline remains dormant future architecture.

The provider boundary is consequential because it processes personal information, controls delivery and storage, and may create an international transfer. The repository owner accepted [`RFC-CONTACT-INQUIRY-PIPELINE`](../../rfcs/contact-inquiry-pipeline.md) in Governance PR #43, and [`ADR-CONTACT-INQUIRY-PIPELINE`](../../decisions/contact-inquiry-pipeline.md) records Formspree behind the narrow provider-neutral adapter for a future commercial release. [`PLAN-CONTACT-INQUIRY-PIPELINE`](../../plans/completed/contact-inquiry-pipeline.md) records the completed demonstration implementation. Real transmission must not be enabled until the verified provider configuration, commercial Privacy page, professional legal review, deterministic and rendered checks, and labeled delivery/deletion evidence are complete.

The demonstration form may be publicly enabled because it uses [`REF-CONTACT-DEMO-PROVIDER`](../../references/contact-inquiry-demonstration/provider-profile.md), makes no request, does not use Formspree or an inbox, and tells the visitor exactly that.

## Current public demonstration mode — APPROVED

- The canonical public site is `https://furlanich.github.io/Portfolio/`; no custom domain is planned.
- The site is a portfolio and technical demonstration, not an operational commercial-intake system.
- Contact fields remain only in page memory. Simulated success resets them; validation or simulated failure preserves them; navigation or reload discards them.
- The deployed form does not use `fetch`, Formspree, email delivery, browser storage, logs, analytics, or an email application.
- `failure@example.invalid` is the reserved public QA value that demonstrates failure. Other valid addresses demonstrate success locally.
- WhatsApp, email, and phone remain working external examples in the approved order. Selecting them leaves the local simulation and invokes a visitor-selected third-party service.
- The dormant commercial copy and adapter remain source material for a separately reviewed activation. Demonstration evidence cannot close a commercial legal, processor, delivery, retention, transfer, or deletion gate.

### Spanish demonstration Contact copy — APPROVED

**Notice heading**

> Demostración interactiva

**Notice**

> Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.

**Failure-control helper**

> Para probar el estado de error, usá `failure@example.invalid` como correo electrónico.

**Submit:** `Simular envío`

**Submitting:** `Simulando…`

**Success**

> Demostración completada. No se enviaron datos ni se creó una consulta comercial.

**Failure**

> La simulación no pudo completarse. No se enviaron datos. Tus valores siguen disponibles en esta página para que puedas corregirlos o volver a probar.

**External alternatives note**

> WhatsApp, email y teléfono se muestran como alternativas funcionales. Al usarlas, salís de esta simulación y abrís un servicio externo; los valores del formulario no se copian allí.

### English demonstration Contact copy — APPROVED

**Notice heading**

> Interactive demonstration

**Notice**

> This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.

**Failure-control helper**

> To try the failure state, use `failure@example.invalid` as the email address.

**Submit:** `Simulate submission`

**Submitting:** `Simulating…`

**Success**

> Demonstration complete. No data was sent and no commercial inquiry was created.

**Failure**

> The simulation could not be completed. No data was sent. Your values remain available on this page so you can correct them or try again.

**External alternatives note**

> WhatsApp, email, and phone are shown as functional alternatives. Using one leaves this simulation and opens an external service; the form values are not copied there.

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

## Future commercial bilingual Contact copy — APPROVED but dormant

Exact real-submission form and state copy is retained here for the separately gated commercial mode. It is not rendered by the current demonstration. `CONTENT-LOCALIZATION` summarizes its approval without duplicating it.

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

On 2026-09-12, a current Formspree endpoint and account configuration were reported outside the repository, with the plan, schema/settings, origin probes, synthetic delivery, and deletion checks reported as PASS. This is sanitized historical progress only: no endpoint or form identifier is stored here, the approved demonstration build does not use it, and professional legal/privacy review remains OPEN for commercial activation.

Provider capabilities and terms were rechecked against first-party [Formspree AJAX](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax), [Formspree spam](https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam), [Formspree privacy](https://formspree.io/legal/privacy-policy/), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), and [EmailJS security](https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/) documentation on 2026-09-10. The RFC and release review must recheck them because plans, privacy terms, retention controls, and APIs may change.

## Exact public demonstration Privacy copy — APPROVED

The following copy describes the current deployed behavior and may be published while the site remains in demonstration mode. It is product disclosure, not a professional legal opinion and not reusable for real inquiry processing.

### Spanish demonstration Privacy page

**H1**

> Privacidad de esta demostración

**Introduction**

> Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.

**H2: Qué ocurre con los datos del formulario**

> Los valores que escribís en nombre, correo electrónico, empresa y mensaje permanecen temporalmente en la memoria de esta página. La simulación los valida y muestra estados de carga, éxito o error, pero no los envía a FURLANICH, Formspree, Gmail ni a ninguna bandeja de entrada.

> Después de un éxito simulado, los campos se limpian. Si hay un error de validación o una falla simulada, los valores permanecen visibles para que puedas corregirlos o volver a probar. Al recargar la página o salir de ella, la implementación de Contacto no los conserva.

**H2: Alojamiento y datos técnicos**

> GitHub Pages publica los archivos estáticos del sitio en `https://furlanich.github.io/Portfolio/`. GitHub informa que registra la dirección IP de quienes visitan sitios de GitHub Pages por motivos de seguridad. Ese tratamiento técnico se rige por la documentación y la declaración de privacidad de GitHub.

> FURLANICH no agrega analítica, publicidad, perfiles, CRM, almacenamiento del formulario ni eventos de conversión para esta demostración.

**H2: Alternativas externas**

> Los enlaces de WhatsApp, email y teléfono son ejemplos funcionales separados del formulario. Si elegís uno, tu dispositivo abre un servicio externo y cualquier dato que decidas comunicar queda sujeto a ese servicio. Los valores escritos en el formulario no se copian automáticamente.

**H2: Información sensible**

> No ingreses contraseñas, credenciales, datos de producción de clientes, información sensible ni archivos. El formulario no solicita ni necesita esos datos para demostrar su funcionamiento.

**H2: Conservación y consultas**

> La simulación no crea copias en un proveedor, una base de datos o una bandeja de entrada. Solo mantiene los valores en la página durante la interacción descrita arriba. Para preguntas sobre esta demostración, podés escribir a `samuelfurlanich@gmail.com` sin copiar datos sensibles.

**H2: Activación comercial futura**

> Antes de habilitar un envío real, FURLANICH deberá reemplazar esta explicación por información verificada sobre responsables, proveedores, finalidades, conservación, transferencias y derechos; completar una revisión profesional; y demostrar la entrega y eliminación de una consulta de prueba. Nada de eso se considera aprobado por esta demostración.

**GitHub link label:** `Ver la declaración de privacidad de GitHub`

### English demonstration Privacy page

**H1**

> Privacy in this demonstration

**Introduction**

> This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.

**H2: What happens to form data**

> Values entered in the name, email, company, and message fields remain temporarily in this page's memory. The simulation validates them and shows loading, success, or failure states, but does not send them to FURLANICH, Formspree, Gmail, or any inbox.

> After simulated success, the fields are cleared. After a validation error or simulated failure, the values remain visible so you can correct them or try again. Reloading or leaving the page causes the Contact implementation to discard them.

**H2: Hosting and technical data**

> GitHub Pages publishes the site's static files at `https://furlanich.github.io/Portfolio/`. GitHub states that it logs the IP addresses of visitors to GitHub Pages sites for security purposes. That technical processing is governed by GitHub's documentation and privacy statement.

> FURLANICH adds no analytics, advertising, profiling, CRM, form storage, or conversion events to this demonstration.

**H2: External alternatives**

> The WhatsApp, email, and phone links are functional examples separate from the form. Selecting one opens an external service on your device, and any information you choose to communicate is governed by that service. Values entered in the form are not copied automatically.

**H2: Sensitive information**

> Do not enter passwords, credentials, client production data, sensitive information, or files. The form neither requests nor needs that information to demonstrate its behavior.

**H2: Retention and questions**

> The simulation creates no provider, database, or inbox copy. It keeps values only on the page for the interaction described above. For questions about this demonstration, you may email `samuelfurlanich@gmail.com` without including sensitive information.

**H2: Future commercial activation**

> Before enabling real submission, FURLANICH must replace this explanation with verified information about responsible parties, providers, purposes, retention, transfers, and rights; complete professional review; and prove delivery and deletion of a test inquiry. This demonstration does not approve any of those items.

**GitHub link label:** `View GitHub's privacy statement`

## Commercial privacy and deployed data-path requirements — APPROVED requirements; legal wording OPEN

The Privacy page must describe the real deployed path before real transmission is enabled. For the future Formspree path, the expected flow to verify and disclose is:

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

The [original commercial Privacy draft](#original-commercial-privacy-draft-proposed-professional-review-required) below is a non-publishable candidate for the separately gated activation; it does not replace the current demonstration disclosure.

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
- for demonstration mode, a deployed GitHub Pages smoke proving simulated success/failure, preserved/reset values, exact disclosure, and zero form-value transmission;
- for any later commercial mode, a production-configured labeled smoke confirming provider acceptance, inbox delivery, field integrity, `Reply-To`, source/language, spam behavior, and deletion/retention operations.

Provider/network behavior is mocked in deterministic tests. The demonstration form itself uses the approved local adapter and must initiate no submission request. A later live commercial smoke must be clearly labeled, contain no real prospect information, and never run automatically in public CI.

## PAGE-CONTACT responsibility — APPROVED dual-mode responsibility

In the current deployment, demonstrate how a four-field inquiry would be validated and handled without sending or collecting the values. Preserve direct alternatives as explicitly external examples.

In a future commercial activation, collect enough information to evaluate an inquiry while offering direct alternatives. Samuel decides whether and how to continue after reviewing the inquiry and, where appropriate, meeting the prospective client.

## Inquiry form fields — APPROVED for demonstration and future commercial modes

- `Nombre` — required.
- `Correo electrónico` — required.
- `Empresa` — optional.
- `¿Qué necesitás resolver?` — required message.

The form is the primary interactive demonstration. WhatsApp is secondary, followed by email and phone. In commercial mode, the same hierarchy applies to real inquiry intake after all activation gates pass.

## Contact facts — APPROVED

- Email: `samuelfurlanich@gmail.com`
- Mobile/WhatsApp display: `+54 9 11 5011-7565`
- Phone URI: `tel:+5491150117565`
- WhatsApp URI: `https://wa.me/5491150117565`
- Location: Buenos Aires, Argentina; Chivilcoy may appear in contact or biography context.

### Owner facts for the proposed commercial activation — APPROVED 2026-10-14

The owner confirmed Samuel Furlanich as the responsible party operating under the FURLANICH brand and supplied `Chivilcoy 6620, Buenos Aires, Argentina` as the legal address to use in the draft. Do not infer a separate incorporated company, tax identifier, street, number, or registration. Whether the supplied locality/postcode satisfies the required address disclosure remains **OPEN pending professional Argentine legal review**.

The owner confirmed `samuelfurlanich@gmail.com` for inquiry notifications and privacy requests and supplied the existing public Formspree endpoint `https://formspree.io/f/meaqwnbr`. The owner also confirmed the account uses the basic Free plan. These are owner-supplied facts, not verified dashboard configuration, recipient verification, spam settings, storage, international-transfer safeguards, delivery or deletion.

The owner accepted provider filtering plus a real honeypot as the initial abuse posture, with an interactive challenge introduced only when verified abuse justifies it. Account actions below are still pending; no account settings have been changed during design discovery.

This initiative retains GitHub Pages and the `/Portfolio` base path. The [design discovery](../../reviews/studio-founder-contact-design-2026-10-14/index.md) records the chosen direction for refinement. It does not activate the form: the current demonstration decision remains effective until an accepted superseding decision and the existing commercial release gates are satisfied.

Proposed WhatsApp prefilled message:

> Hola, Samuel. Me contacto desde el sitio de FURLANICH porque quisiera conversar sobre una solución para mi negocio.

### Formspree Free readiness checklist — PROPOSED operational requirements

The owner approved this checklist as a required gate in Q14; its observed account facts remain OPEN until verified. The heading is retained for existing references. Q15 clarifies the release order: legal/account readiness and a labeled owner-run provider probe precede deployment; actual two-locale deployed-form delivery/deletion checks immediately follow the coordinated release, with rollback on failure. These are distinct receipts; the predeployment probe cannot be described as new deployed-form evidence.

This is an owner-action checklist for a later commercial activation, not an implementation plan or permission to enable transmission. The ADE plan must assign it a named human prerequisite and carry the receipts into the activation checkpoint. Samuel performs authenticated account actions; implementers must not guess that an unverified setting is enabled. If a dashboard label or capability differs, record the observed control and resolve the difference before release.

| Owner action | Exact intended configuration / evidence |
| --- | --- |
| Select the existing form | Sign in to Formspree, open the form whose Integration endpoint is `https://formspree.io/f/meaqwnbr`, and confirm owner access and active status. Do not create a second production form. |
| Confirm notifications | In the form's Workflow, retain one email notification action to the verified `samuelfurlanich@gmail.com` recipient. Confirm the submitter's `email` maps to Reply-To. Disable unapproved integrations, marketing actions and visitor autoresponders; no new processor is inferred. |
| Restrict the project origin | In Project Settings → Restrict to Domain, use `furlanich.github.io`, without protocol or `/Portfolio`. This is a referrer-based spam filter, not authentication or a path restriction. Keep localhost QA mocked; use the deployed `/Portfolio` routes for the labeled live receipt. Implementers must verify compatible referrer policy and test browser behavior. |
| Match server validation | In Workflow → Validation, add `name` as required text, maximum 100; `email` as required email, maximum 254; `company` as optional text, maximum 120; and `message` as required text, maximum 4000. Preserve `locale` and `source` metadata. These limits match the retained inquiry contract. Verify Unicode-length and multiline behavior against client validation; resolve a difference explicitly. |
| Confirm the challenge posture | Record the current Spam protection/reCAPTCHA setting. The proposed baseline uses automatic provider filtering, the implemented `_gotcha` input and domain restriction, without a CAPTCHA script or provider redirect. If disabling an existing challenge is needed, Samuel makes that explicit configuration decision at activation. A later challenge requires a reviewed accessible flow and matching Privacy/processor updates. |
| Verify storage and deletion | Inspect Inbox, Spam and Over Limit, plus any available storage controls. Verify deletion with labeled synthetic data in Formspree and Gmail; document provider log/backup exceptions. A Free-plan history window is not proof of full erasure. Apply the existing operational retention targets only after their feasibility and legal wording are verified. |
| Verify quota and monitoring | Check the account-wide remaining allowance and reset date. Proposed operation: inspect Inbox, Spam, Over Limit and quota each business day, and act on threshold notifications. At the first 75% notice, decide whether to upgrade or temporarily replace intake with an accurately labeled direct-contact state before capacity is exhausted. No paid upgrade is authorized by this checklist. |
| Close the activation receipt | After governance/legal/account gates pass, perform a labeled owner-run live provider probe before deployment. Then deploy the coordinated release and immediately submit one labeled inquiry from each actual localized page, verifying acceptance, dashboard, Gmail/Reply-To and deletion. Failed checks trigger the prepared rollback under Q15. Retain redacted outcomes/dates, never inquiry bodies, credentials or tokens. The predeployment probe is not a deployed-form receipt. |

Research checked 2026-10-14: [Free limits](https://help.formspree.io/articles/account-management/account-limits) document 50 submissions per month and 30 days of history. [Over-limit behavior](https://help.formspree.io/articles/form-and-project-settings/over-limit-submissions) can retain submissions while withholding notifications/plugins until reprocessing; a `2xx` acceptance must never imply confirmed inbox delivery. The static frontend cannot reliably infer account quota from every accepted response. Exact exhausted-quota behavior needs a provider receipt/support confirmation; do not send a batch of test submissions to exhaust a real account.

[Workflow validation](https://help.formspree.io/articles/building-your-form/getting-started-with-workflow/), [domain restriction](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain), [honeypot](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering) and [reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings) support the proposed checklist. Their documented capabilities do not establish this account's actual settings. The hidden honeypot must carry its actual value through the adapter; an always-empty constant is not a bot trap. Hide it from the accessibility tree, tab order and autofill, and test the flagged-payload/provider outcome without treating an undisclosed local drop as ordinary visitor success.

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

This direct-channel minimum satisfies CTA integrity for foundation integration. The structured local-only form plus exact demonstration disclosure supersedes it for the public showcase once Tasks 3 and 4 pass. Real provider disclosure and professional review remain blockers only for a later commercial activation.

A “coming soon” page was rejected because it abandons the visitor after the hero CTA. Selecting a form provider inside this content decision was rejected because provider, data flow, retention, and consent require their own privacy-ready release decision.

## Required behavior

- Programmatically associated labels and fields.
- Clear required/optional indicators.
- Understandable inline validation.
- Loading, success, and failure states announced accessibly.
- No submitted information lost silently.
- Alternative contact route available when form submission fails.
- No marketing subscription implied by an inquiry.

## PAGE-PRIVACY responsibility — APPROVED dual-mode responsibility

For demonstration mode, explain in plain language that form values are not transmitted, where they exist temporarily, how the simulation clears or preserves them, what ordinary hosting metadata GitHub Pages handles, and when external fallback services take over.

For future commercial mode, explain what information is collected, why it is used, who processes it, how long it is retained, and how a person may request access, correction, or deletion.

## Privacy implementation closure — demonstration approved; commercial wording OPEN

The exact bilingual demonstration disclosure above is approved for publication because it describes the zero-transmission deployment. It does not claim legal review, commercial processing, or Formspree use.

For future commercial activation, the factual notice scope, purpose limits, processor/storage/retention disclosures, request method, and operational retention target remain approved requirements. Formspree is the accepted provider; its exact configuration and material subprocessor chain, responsible legal/business identity, international-transfer mechanism, legally sufficient notice/consent wording, and professional Argentine legal review remain OPEN gates.

The Contact form must not transmit a real inquiry until `PAGE-PRIVACY` names the real deployed processors, storage behavior, retention operations, request route, and transfer treatment and every commercial activation gate has passed. The local-only demonstration form may be publicly enabled with the exact demonstration copy.

## Acceptance criteria

- The form contains the four approved fields.
- Primary and secondary channel hierarchy is clear.
- Email and phone/WhatsApp values are consistent throughout the site.
- Response copy is visible but not misrepresented as support coverage.
- Demonstration success and failure explicitly state that no information was sent or commercial inquiry created.
- Demonstration submission initiates no network request, email, storage, log, or analytics operation and preserves/reset values according to the approved state.
- Demonstration Privacy content describes GitHub Pages hosting metadata, temporary local form state, external fallback boundaries, and absence of form processors accurately.
- Commercial Privacy content and informed-consent treatment remain required before real processing and are not inferred from the demonstration copy.


## Founder-context link — APPROVED

After the primary direct-contact choices and response expectation, Contact may include one subdued internal text link where the copy explains that Samuel personally reviews the inquiry:

- Spanish: “Conocer la trayectoria de Samuel” → /estudio/samuel-furlanich/
- English: “View Samuel's background” → /en/about/samuel-furlanich/

This link provides relevant professional context. It is not a primary or secondary contact button, does not precede the inquiry/direct-channel actions, and does not duplicate the Studio or Founder narrative.

## MKT-D03 — Demonstration presentation contract — REJECTED revision 1

**Revision 1: REJECTED. Human disposition D03: REJECTED.** Human reviewer: project owner (user). Date: 2026-09-16. Source: explicit disposition in the decision-review task. The user supplied “D03 - REJECTED”. The proposed route-wide notice, revised Contact presentation and replacement demo copy are not adopted. Existing APPROVED Contact requirements, the deployed demonstration boundary and the Contact demonstration ADR remain authoritative.

This revision resolves MKT-CONTACT-001 and MKT-POS-002 while preserving ADR-CONTACT-INQUIRY-DEMO-MODE. It changes presentation only. No service acceptance, quote, commercial intake, provider configuration, data path or operational response commitment is activated.

### D03 mode and placement contract

- Every direct entry route, including project details, Founder, Privacy and localized not-found pages, shows the same short, non-dismissible demonstration notice in normal flow immediately after the shared header and before main content. It is not another sticky bar or alert dialog. The notice links to Contact for explanation and does not obscure anchors.
- Services and intended operating-model language are read under that explicit notice. On Home, it precedes the hero. Footer need not repeat the full notice; the Contact/Privacy links remain accessible. No real-inquiry promise survives in a demo-page ending.
- Contact leads with one short introduction, then a concise form disclosure. The response-expectation block is omitted in the current mode, including Home, Services, Studio, Founder and project endings. The existing same-business-day/two-business-day commitment remains dormant for a future activation; do not newly promise that timing for external demo links.
- Preserve four fields, required/optional rules, validation limits, 650ms local behavior, failure control, focus, retry, reset and zero-transmission adapter. Keep the failure-test instruction visible near the email field; no hidden critical disclosure or new accordion is proposed.
- External links remain functional examples after the form, ordered WhatsApp, email, phone. They open the selected service and do not inherit any form values. They do not create commercial intake through this demonstration.
- The existing exact public demonstration Privacy explanation remains unchanged. Do not shorten hosting/privacy facts into a claim that the entire website performs no network activity. Only the form's defined submission behavior is zero-transmission.

### D03 current-versus-proposed bilingual copy

| Key / current ES and EN | Proposed Spanish | Proposed English | Reason / permission |
| --- | --- | --- | --- |
| Global mode notice: absent from most entry pages | Demostración técnica. Los servicios comerciales aún no están activos. | Technical demonstration. Commercial services are not active yet. | Current deployment fact; persistent visible context on every route |
| Notice link: new | Acerca de esta demostración | About this demonstration | Localized Contact route; D06 CTA map |
| Contact H1: business-need invitation | Probá el formulario de contacto | Try the contact form | Sets correct demo expectation immediately |
| Introduction: Samuel will review the inquiry | Explorá cómo funciona el formulario. Esta prueba no envía una consulta a Samuel. | Explore how the form works. This test does not send an inquiry to Samuel. | No review or response promise |
| Form disclosure: long notice plus response block | La simulación ocurre en este navegador. No envía datos ni crea una consulta comercial. Usá datos de prueba. | The simulation runs in this browser. It sends no data and creates no commercial inquiry. Use sample details. | Current local adapter; no implication of real delivery |
| Email helper: Lo usaremos únicamente para responder esta consulta. / We will use it only to respond to this inquiry. | El correo se valida solo para esta prueba. Para probar un error, usá failure@example.invalid. | The email is validated only for this test. To try an error, use failure@example.invalid. | Eliminates unsupported use promise; keeps reserved QA value |
| Data-use helper: Usaremos tus datos para evaluar y responder tu consulta. / We will use your information to review and respond to your inquiry. | Los valores quedan temporalmente en esta página. Se borran al completar la simulación, salir o recargar. Si hay un error, se conservan para volver a probar. | Values stay temporarily on this page. They are cleared after a successful simulation, when you leave, or when you reload. After an error, they remain so you can try again. | Exact local lifecycle; no hosting-wide privacy claim |
| Privacy link: repeated phrase/link | Privacidad de esta demostración | Privacy in this demonstration | Existing localized Privacy route; no legal-policy approval |
| Submit: Simular envío / Simulate submission | Simular envío | Simulate submission | Retain approved meaning |
| Loading: Simulando… / Simulating… | Simulando… | Simulating… | Retain approved state |
| Success heading/body duplicate first sentence | Heading: Demostración completada. Body: No se enviaron datos ni se creó una consulta comercial. | Heading: Demonstration complete. Body: No data was sent and no commercial inquiry was created. | Separate heading/body; retain explicit outcome |
| Failure heading/body duplicate first sentence | Heading: No se pudo completar la simulación. Body: No se enviaron datos. Tus valores siguen en esta página para volver a probar. | Heading: The simulation could not be completed. Body: No data was sent. Your values remain on this page so you can try again. | Reassuring and shorter; retry behavior unchanged |
| Retry: Intentar nuevamente / Try again | Volver a probar | Try again | Consistent demonstration language |
| Alternatives heading: preference question | Ejemplos de contacto externo | External contact examples | Clear boundary after form |
| Alternatives explanatory paragraph | Estos enlaces abren WhatsApp, correo o teléfono. Son independientes de la prueba y no copian los valores del formulario. | These links open WhatsApp, email or phone. They are separate from the test and do not copy form values. | Functional external examples; no reply promise |
| Direct labels: Escribir por WhatsApp / Write on WhatsApp; email; phone | Abrir WhatsApp / Enviar un correo / Llamar | Open WhatsApp / Send an email / Call | Each action must open its named channel; approved destinations unchanged |
| Founder tail | Conocé a Samuel Furlanich | Meet Samuel Furlanich | Subdued Founder link after alternatives |

Names of the four fields, required/optional wording, individual validation errors and sensitive-information warning remain the existing approved bilingual copy. No silent rewrite is authorized outside the listed rows. Do not render the table's structural words Heading/Body to visitors.

### D03 dormant commercial distinction

Current public Contact remains a simulation. Existing dormant commercial fields, consent/data-use copy, provider acceptance language and response expectation remain in their original sections for future review. No public toggle, environment-only activation or dual-purpose submit button is proposed. Future provider/legal/operational work must revisit all mode-specific strings and prove actual delivery/deletion before any activation; this RFC does not perform or close those gates.

**Disposition D03:** the global notice, mode/placement contract and bilingual replacements are REJECTED together. Existing demonstration presentation and adapter/current-deployment boundaries remain in force. This rejection does not activate commercial intake or alter the ADR.

## Original commercial Privacy draft — PROPOSED, professional review required

**NOT PUBLISHABLE.** This original draft describes the intended public inquiry flow, not the currently deployed local simulation. It uses the owner-confirmed identity/contact facts and the retained inquiry architecture. Account-specific processor, storage, transfer, notice/consent and legal facts remain OPEN. Publication requires the accepted commercial supersession, a verified matching deployment and professional Argentine legal review.

### Editorial gates applying to both languages

| Topic | Known input | Still required before final copy |
| --- | --- | --- |
| Responsible party | Owner-confirmed person/brand and supplied locality/postcode | Counsel confirms complete required identification/address disclosure |
| Submission and notification | Owner-supplied Formspree endpoint and Gmail destination | Verify owner-controlled account, actual recipient, sender/Reply-To, validation, spam/CAPTCHA and delivery |
| Provider chain | GitHub Pages, Formspree and Google/Gmail are named in the intended architecture | Confirm material Formspree infrastructure/email/security subprocessors and actual processing locations |
| Retention | Existing operational targets: disable unnecessary provider copies or delete within 30 days after receipt/triage; mailbox-only non-converted inquiries within 12 months after last substantive contact | Verify dashboard, spam, notifications, backups/log exceptions, deletion operations and counsel approval; do not claim automatic enforcement |
| Transfers/consent/rights | Professional Argentine review is required by the owning requirement | Decide applicable transfer safeguard, notice/consent treatment, any registration/mandatory statement and response protocol |
| Cookies and metadata | No added marketing analytics/pixels or secondary inquiry use is approved | Inspect deployed requests and actual provider configuration before stating specific cookie/metadata practices |

Formspree's [current privacy policy](https://formspree.io/legal/privacy-policy/) describes US/international processing and technical metadata. It does not establish this form's complete processor chain or an Argentine transfer mechanism. The owner confirmed Free; actual settings remain unverified. The [readiness checklist](#formspree-free-readiness-checklist-proposed-operational-requirements) owns the operational follow-up. [AAIP obligations](https://www.argentina.gob.ar/aaip/datospersonales/responsables/obligaciones) and [international transfers](https://www.argentina.gob.ar/transferencias-internacionales) inform counsel's review, not an agent finding of compliance.

### Spanish candidate

#### Política de privacidad

**Responsable y contacto**

Samuel Furlanich, quien actúa bajo la marca FURLANICH, es el responsable del tratamiento de las consultas recibidas a través de este sitio. El domicilio informado es Chivilcoy 6620, Buenos Aires, Argentina. Para consultas sobre privacidad o para ejercer tus derechos, escribí a samuelfurlanich@gmail.com.

**Qué información solicita el formulario**

Solicitamos tu nombre, correo electrónico y una descripción de lo que necesitás resolver. El nombre de la empresa es opcional. El envío también identifica el idioma y la página desde la que se realiza. No solicitamos archivos adjuntos, contraseñas, credenciales ni datos sensibles.

**Para qué la usamos**

Usamos esta información para entender la consulta, evaluar si podemos ayudarte y responderte. También se aplican controles para prevenir spam y abuso. El formulario no te suscribe a comunicaciones comerciales ni autoriza un uso publicitario de tu mensaje.

**Cómo se procesa la consulta**

GitHub Pages aloja las páginas del sitio. Al enviar el formulario, tu navegador transmite la consulta a Formspree, que interviene en su procesamiento y en el envío de la notificación al correo de Samuel, gestionado mediante Gmail. Los proveedores pueden tratar información técnica necesaria para operar y proteger sus servicios.

**Preferencias del fondo gráfico**

El sitio puede guardar durante la sesión tu preferencia de pausa y una marca técnica de fallo gráfico para evitar nuevos intentos de animación. Estos valores no contienen los datos del formulario. Si el navegador no permite ese almacenamiento, la página mantiene una alternativa estática o una preferencia temporal en memoria.

**Proveedores y transferencias internacionales**

**[BLOQUE EDITORIAL — NO PUBLICAR: completar los proveedores materiales, países y mecanismo de transferencia verificados; revisión profesional argentina obligatoria. No afirmar que un contrato europeo resuelve por sí solo las exigencias argentinas.]**

**Conservación**

**[BLOQUE EDITORIAL — NO PUBLICAR: convertir los objetivos de 30 días / 12 meses de la tabla anterior en una cláusula pública únicamente después de verificar su operación, sus excepciones y la aprobación profesional. No prometer borrado automático ni desaparición inmediata de copias de respaldo.]**

**Tus solicitudes**

Podés solicitar acceso, rectificación, actualización o supresión de tus datos escribiendo al correo indicado. Para tramitar la solicitud, podremos pedir información proporcionada para comprobar tu identidad. Cualquier excepción de conservación que corresponda deberá explicarse al responder.

**[REVISIÓN PROFESIONAL: completar el texto y los plazos exigibles, la información sobre la autoridad de control y cualquier otra mención obligatoria.]**

**Otros canales y cambios**

Si elegís WhatsApp, correo o teléfono, usás un canal independiente del formulario y sujeto a los servicios que intervengan en esa comunicación. Los valores del formulario no se copian automáticamente a esos enlaces. La versión publicada de esta política indicará su fecha de actualización.

### English candidate

#### Privacy Policy

**Responsible party and contact**

Samuel Furlanich, operating under the FURLANICH brand, is responsible for handling inquiries received through this website. The supplied address is Chivilcoy 6620, Buenos Aires, Argentina. For privacy questions or to exercise your rights, contact samuelfurlanich@gmail.com.

**Information requested by the form**

We request your name, email address and a description of what you need to solve. Your company name is optional. The submission also identifies its language and source page. We do not request attachments, passwords, credentials or sensitive information.

**How we use it**

We use this information to understand your inquiry, assess whether we can help and respond to you. Controls also help prevent spam and abuse. The form does not subscribe you to marketing communications or authorize advertising use of your message.

**How an inquiry is processed**

GitHub Pages hosts the website pages. When you submit the form, your browser sends the inquiry to Formspree, which processes it and sends a notification to Samuel's email, managed through Gmail. Providers may process technical information needed to operate and protect their services.

**Graphic background preferences**

The site may store your pause preference and a technical graphics-failure flag for the browsing session to avoid repeated animation attempts. These values contain no form information. If browser storage is unavailable, the page uses a static alternative or a temporary preference held in memory.

**Providers and international transfers**

**[EDITORIAL BLOCK — DO NOT PUBLISH: complete the verified material providers, countries and transfer mechanism; professional Argentine legal review required. Do not assume European contractual terms alone establish the applicable Argentine safeguards.]**

**Retention**

**[EDITORIAL BLOCK — DO NOT PUBLISH: turn the table's 30-day / 12-month operational targets into public wording only after verifying their operation, exceptions and professional approval. Do not promise automatic erasure or immediate disappearance of backup copies.]**

**Your requests**

You can request access, correction, updating or deletion of your information by contacting the email address above. We may request proportionate information to verify your identity when handling a request. Any applicable retention exception must be explained in the response.

**[PROFESSIONAL REVIEW: complete applicable wording and time limits, supervisory-authority information and any other required statement.]**

**Other channels and changes**

If you choose WhatsApp, email or phone, you use a channel independent of the form and subject to the services involved in that communication. Form values are not automatically copied into those links. The published policy will show its update date.

## Atlas commercial interaction copy

**APPROVED Q14 — 2026-10-14**, as the written design's exact commercial state-copy selection. Publication still requires final professional legal/processor review and the activation gates; a required material wording/consent change returns for design review.

[DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md) retains the dormant commercial H1, introduction, response expectation, four field labels/helpers/errors, required-fields note, privacy context/link, submit/submitting labels, success heading/body and retry label exactly as recorded above. The success confirms provider acceptance, not inbox delivery or reading. A static page cannot detect every exhausted-quota acceptance; the owner checklist owns monitoring and recovery.

The following changes are exact candidate replacements for commercial activation. They do not alter the active demonstration's wording.

| State / field | Spanish | English |
| --- | --- | --- |
| Network, timeout or unrecognized response heading | No pudimos confirmar el envío. | We couldn't confirm your submission. |
| Network, timeout or unrecognized response body | Tus datos siguen en el formulario. Podés reintentar o escribirnos por WhatsApp. Si el primer envío fue recibido, un reintento puede generar otra copia de la consulta. | Your information is still in the form. You can try again or contact us on WhatsApp. If the first submission was received, retrying may create another copy of your inquiry. |
| Rate-limited heading | El envío está temporalmente limitado. | Submissions are temporarily limited. |
| Rate-limited body | Tus datos siguen en el formulario. Intentá más tarde o escribinos por WhatsApp. | Your information is still in the form. Try later or contact us on WhatsApp. |
| Unavailable configuration heading | El formulario no está disponible. | The form is unavailable. |
| Unavailable configuration body | Podés escribirnos por WhatsApp, correo o teléfono. Los datos que completaste siguen en esta página. | You can contact us on WhatsApp, by email or by phone. The information you entered remains on this page. |
| Alternative-channel note | WhatsApp, correo y teléfono son canales independientes. Los datos del formulario no se copian a esos enlaces. | WhatsApp, email and phone are independent channels. Form information is not copied into those links. |
| No-JavaScript / before-hydration fallback | Para enviar el formulario, activá JavaScript. También podés escribirnos por WhatsApp, correo o teléfono. | Enable JavaScript to submit the form. You can also contact us on WhatsApp, by email or by phone. |
| Quiet Terms link | Términos y condiciones | Terms and Conditions |

Use the existing approved bilingual Pause/Resume/Static-background labels from [IA-SITE](../information-architecture.md#spf-v1-proposed-footer-copy-and-route-retirement). Contact's decorative node words are `Contexto / Context`, `Consulta / Inquiry`, `Conversación / Conversation`; no public graph interaction instruction or hidden essential step is introduced.

In commercial mode, remove the demo notice, reserved failure-email helper and simulated labels together with the accepted mode transition. A missing/invalid endpoint produces the clearly unavailable state above and direct alternatives; it never silently selects the demo adapter or reports simulated success.
