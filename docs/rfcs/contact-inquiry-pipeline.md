---
id: RFC-CONTACT-INQUIRY-PIPELINE
type: request-for-comments
status: APPROVED
related:
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - ARCHITECTURE-MAP
  - ARCH-CURRENT
  - ADR-STATIC-LOCALIZED-ROUTING
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
last_verified: 2026-09-12
---

# Contact inquiry submission pipeline

## Context

`PAGE-CONTACT` approves a bilingual, four-field inquiry form that submits inside FURLANICH, reports success or failure in place, and delivers a readable notification to Samuel's configured business inbox. The browser must not open an email client and must not contain a Gmail password, SMTP credential, private email API key, secret webhook value, or recipient-routing secret.

The deployed site is a Next.js static export on GitHub Pages with explicit Spanish-root and English-`/en/` routes. `ADR-STATIC-LOCALIZED-ROUTING` accepts that architecture. A contact form alone is not evidence for moving the complete site or introducing a general-purpose application backend.

Provider selection is nevertheless consequential: inquiry data is personal information; the selected service controls acceptance, abuse handling, storage, delivery, international transfers, and operational failure modes. This RFC therefore proposes the launch architecture before any production form implementation.

Provider behavior, limits, and legal documents linked below were checked against official sources on 2026-09-10. They must be checked again during provisioning and release because service plans and terms can change.

## Problem

Static HTML and browser JavaScript cannot safely authenticate to SMTP or Gmail. The product needs a narrow remote submission boundary that can accept a public browser request, validate and filter it, notify the configured inbox, and return a machine-readable response for localized in-page state.

The choice must balance data-processing transparency and abuse resistance against the operational cost of owning a new service solely for lead collection.

## Requirements

### Visitor and hosting behavior

- Submit from `/contacto/` or `/en/contact/` without leaving the page or launching an email client.
- Render localized pending, accepted, field-error, and delivery-not-confirmed states in the existing Contact UI state model.
- Preserve the Next.js static export, GitHub Pages deployment, trailing slashes, and optional base path.
- Treat provider acceptance as `SUCCESS`; do not claim inbox delivery from an HTTP acceptance response.
- Keep WhatsApp, direct email, and phone available as ordered fallbacks when submission is unavailable.

### Public data contract

The business payload is limited to:

| Field | Requirement |
| --- | --- |
| `name` | Required, trimmed text, maximum 100 characters. |
| `email` | Required, trimmed email syntax, maximum 254 characters. |
| `company` | Optional, trimmed text, omitted when empty, maximum 120 characters. |
| `message` | Required, non-empty after trimming, maximum 4,000 characters. |
| `locale` | Approved non-sensitive system metadata: `es-AR` or `en`. |
| `source` | Approved non-sensitive system metadata: the canonical localized Contact route. |

Use the processor's receipt time as the trustworthy submission timestamp; do not add a client timestamp to the payload. A provider-defined empty honeypot field is a transport control, not inquiry content.

The browser and adapter must not attach analytics identifiers, cookies, advertising identifiers, fingerprints, IP-derived profiles, referrer chains, or unrelated page state. The provider may independently process ordinary network metadata for security and delivery; that behavior must be disclosed rather than represented as application-supplied data.

### Delivery and security

- The target inbox is provider-side account configuration, never request data.
- The notification sender uses the provider's authenticated sending identity. The visitor address is `Reply-To`, never a spoofed `From` address.
- The subject is fixed in provider configuration and identifies a FURLANICH website inquiry; user input must not control mail headers.
- The body uses clearly labeled name, email, optional company, message, locale, source, and provider receipt time.
- Both the UI boundary and remote endpoint validate required fields, types, and length limits. The endpoint rejects unsupported business fields and all file content.
- The adapter accepts JSON only and emits no more than 24 KiB of UTF-8 request data; the approved character limits keep a valid inquiry below that ceiling. The provider schema remains the authority for direct requests that bypass the UI.
- No private credential or private endpoint token may enter source, a `NEXT_PUBLIC_*` value, static output, tests, logs, URLs, or analytics.

### Operational and privacy constraints

- Use the lowest-friction adequate abuse controls: provider filtering, exact production-domain restriction, a non-focusable honeypot, server-side validation, request limits, and one active UI submission.
- Do not enable an interactive CAPTCHA at launch. Escalation requires observed abuse plus privacy and accessibility review.
- Do not perform automatic browser retries. Preserve form values on every non-acceptance result.
- Routine CI must never send real inquiry email.
- `PAGE-PRIVACY` must name the deployed processors, stored copies, relevant automatically collected metadata, retention, request route, and international-transfer treatment before the form is enabled.

## Accepted approach

Select **Formspree for the current static-site release**, subject to the provisioning/release gates below.

```text
ContactForm
  -> submitInquiry(payload)
      -> Formspree adapter
          -> public Formspree HTTPS form endpoint
              -> Formspree validation and Formshield
              -> provider-configured email notification
                  -> Samuel's configured Gmail inbox
```

### Integration boundary

The future implementation should use one small typed function and one provider adapter, not a reusable integration framework:

```ts
type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  locale: "es-AR" | "en";
  source: "/contacto/" | "/en/contact/";
};

type InquirySubmissionResult =
  | { status: "accepted" }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | {
      status: "failed";
      reason: "rate-limited" | "misconfigured" | "unavailable" | "unknown";
    };
```

`ContactForm` owns UI state, client validation, focus/status behavior, and localized copy. `submitInquiry()` accepts only the provider-neutral payload. The adapter trims and allowlists values, omits empty `company`, adds only the provider honeypot transport field, sends the AJAX request, and maps provider responses to the typed result. Raw provider messages do not reach the UI. A direct `fetch` implementation is sufficient; adding a provider SDK is not required unless implementation evidence shows a concrete benefit.

The public form ID/endpoint may be build-time public configuration. It is an address, not a secret. The adapter remains the only application module that knows its shape or Formspree's response format, so replacing the provider changes one boundary rather than form state or localized presentation.

### Provider configuration

Provision a dedicated FURLANICH form in a Samuel-controlled Formspree account with multi-factor authentication and least-privilege account access. Configure:

- an explicit server-side field schema for `name`, `email`, `company`, `message`, `locale`, and `source`, including the approved required/type/maximum-length rules;
- rejection of undeclared fields and file uploads, verified with a staging probe before release;
- the verified FURLANICH target address in the provider account, not in browser payload;
- a fixed subject such as `[FURLANICH] Website inquiry`;
- the submitted `email` field as `Reply-To`;
- a plain, labeled notification containing the approved fields and provider receipt time;
- Formshield/standard spam filtering, the provider honeypot, and domain restriction for every real production hostname used by the static site;
- reCAPTCHA and Turnstile disabled at launch; and
- quota and submission-history review by Samuel as operational owner.

Formspree documents AJAX submission and custom success/error handling on all plans, email `Reply-To` from a field named `email`, a configurable subject, Workflow validation rules and AJAX validation errors, honeypot filtering, domain restriction, Formshield filtering, and optional CAPTCHA controls. Its CLI configuration also documents an explicit allowed-field schema with field types and length validation. These capabilities fit the static host without exposing a private mail credential.

### Acceptance and failure semantics

The adapter returns `accepted` only when Formspree returns its documented successful AJAX response. That means the processor accepted the submission for its workflow; it does not prove that Gmail received the notification.

Map documented field-validation failures to `invalid` only when their field identifiers are in the approved contract. Map rate limits, inactive/missing form configuration, quota exhaustion, other non-success statuses, network errors, timeouts, unreadable JSON, and unrecognized responses to `failed`. Log no inquiry content. Production diagnostics may record only coarse event category, time, locale, source, and an application-generated correlation value that cannot reconstruct visitor data.

Disable the submit control for the complete in-flight request. Do not automatically retry from the browser. After an error, preserve every field and let the visitor explicitly retry or choose a direct channel. If a response is lost after provider acceptance, an explicit retry can produce a duplicate; the error copy must not claim non-receipt, and Samuel may deduplicate matching inquiries during triage. No Formspree idempotency facility is documented for this public endpoint, so this RFC does not invent a client token or claim exactly-once delivery.

Provider-side retries inside Formspree's notification workflow are distinct from browser retries and may continue after HTTP acceptance. A labeled pre-release smoke test is required to prove actual inbox delivery and `Reply-To` behavior.

### Spam and abuse model

Launch with layered, low-friction controls:

1. Formspree Formshield/standard spam filtering.
2. Exact allowed production domains in Formspree. Because Formspree documents that this check uses the `Referer` header, the deployed referrer policy must remain compatible and the restriction must be exercised from both locale routes.
3. Formspree's `_gotcha` honeypot, visually hidden, non-focusable, and absent from the accessibility tree. A filled honeypot is intentionally accepted-and-discarded by the provider and must not become a user-visible validation field.
4. The provider-side allowed-field and validation schema, with no files, the approved length limits, and an application request ceiling of 24 KiB.
5. One in-flight browser request, a bounded request timeout, and no automatic client retries.
6. Formspree's documented system limit of 20 posts per minute as an outer provider control; an HTTP `429` becomes the generic localized failure state.

Do not launch reCAPTCHA or Turnstile. If real traffic shows that the layers above do not protect inbox quality or monthly quota, open a focused change that records the abuse evidence, accessibility behavior, additional processor/metadata flow, Privacy-page update, and tests. Formspree currently supports Cloudflare Turnstile; it is preferable to adding a bespoke Worker solely for a challenge, but it is not pre-approved by this RFC.

### Privacy and data flow

The deployed launch flow would be:

```text
Visitor
  -> GitHub Pages serves the static Contact route
  -> browser sends the approved inquiry payload directly to Formspree over HTTPS
  -> Formspree validates, filters, stores the submission, and invokes email delivery
  -> Formspree's mail-delivery infrastructure sends the notification
  -> Google/Gmail stores the message in Samuel's configured inbox
  -> Samuel evaluates and responds to the inquiry
```

The material parties and processing facts that affect `PAGE-PRIVACY` are:

| Party | Role and data relevant to the notice |
| --- | --- |
| FURLANICH / Samuel | Responsible party/controller; receives and uses the inquiry only to evaluate and respond to the prospective engagement. Exact legal identity remains a release-gate item for professional review. |
| GitHub Pages / GitHub | Static-site host. It serves the Contact page and may receive ordinary hosting request metadata, but the direct browser-to-Formspree request means GitHub Pages does not receive the inquiry fields. |
| Formspree | Form processor. It receives the six-field payload and honeypot value and, under its privacy policy, may also process IP address, browser, domain, access time, and referring-site metadata. It stores submissions in the account history and processes them in the United States/other documented locations. |
| Amazon Web Services | Hosting infrastructure identified by Formspree's security documentation for Formspree's US-hosted service. |
| Formspree mail-delivery provider | Formspree's current documentation/status materials identify SendGrid for mail sending/custom email-domain delivery. Provisioning must confirm the actual delivery path and current subprocessor disclosures rather than treating this RFC as an exhaustive subprocessor list. |
| Google / Gmail | Recipient mailbox processor. It stores the delivered inquiry and associated email metadata in Samuel's configured account. |

The Privacy page must not say that inquiries go “directly to email only.” Formspree's form-building documentation says submissions are stored in the Formspree account, and its account limits currently say that the Free plan stores 30 days of submission history. That plan is the launch choice while its current 50-submission monthly limit is adequate. However, dashboard-history duration is not by itself proof of deletion from backups, security logs, or every subprocessor: provisioning must confirm through the applicable agreement or provider response how submission content is deleted after the 30-day window and what exceptions remain. If that cannot be demonstrated, Formspree does not pass the release gate. Samuel must review the submission count before exhaustion. If volume requires a paid plan, the migration may not extend retention silently: establish and document a supported deletion procedure that removes provider copies no later than the approved 30-day target before changing plans.

Non-converted mailbox inquiries follow the approved operational target of deletion within 12 months after the last substantive contact, unless the information has entered a separately governed proposal, contract, accounting, legal, or active-client record. Access, correction, and deletion requests use the published FURLANICH business email with proportional identity verification and lawful exceptions.

Formspree's public privacy and security materials describe US processing, security controls, and Standard Contractual Clauses, but the public privacy policy also describes retention while an account is active, legal exceptions, and longer-lived security logs. This review did not find a public, canonical exhaustive subprocessor list or a public self-service no-storage mode for ordinary form submissions. Before launch, Samuel must obtain or verify the applicable Data Processing Agreement, content-retention behavior, and subprocessor information, and have the responsible-party, Argentine notice, consent, database-registration, and international-transfer treatment reviewed professionally. This RFC makes no legal conclusion and does not clear that release gate.

### Cost, limits, and operations

Formspree's current account documentation lists 50 submissions per month, two notification email addresses, and 30 days of submission history for the Free plan. Its system-limits documentation lists 20 posts per minute. Those limits are suitable for a low-volume launch only. Approaching quota is an operational trigger to compare a paid Formspree plan with the Worker + Resend migration path; it is not permission to drop inquiries, lengthen retention, or change processors without updating governance and privacy records.

Samuel owns account recovery, multi-factor authentication, recipient verification, domain restrictions, schema/workflow configuration, quota checks, spam review, deletion checks, provider-status review, and the labeled release smoke test. Provider configuration should be captured in an implementation/release checklist without committing account secrets or real prospect data. The public endpoint may be recorded as deployment configuration, but production inquiry samples must not appear in screenshots or fixtures.

## Alternatives considered

### Option A — Formspree

| Dimension | Evaluation |
| --- | --- |
| Static site and AJAX | Purpose-built public HTTPS form endpoint; documented AJAX submissions and custom UI results preserve GitHub Pages. |
| Credential boundary | Only a public form identifier appears in the browser. Recipient routing and mail credentials remain provider-side. |
| Email and `Reply-To` | Target-email notifications, a fixed subject, provider-authenticated sender, and visitor `email` as `Reply-To` are documented. |
| Abuse controls | Formshield, honeypot, domain restriction, 20-post/minute provider limit, validation, and optional reCAPTCHA/Turnstile. Domain restriction relies on `Referer` and is defense in depth, not authentication. |
| Retention and privacy | Formspree stores submissions. Free-plan submission history is documented as 30 days, while the privacy policy states broader retention and log exceptions; the provider may process network metadata and use US infrastructure/mail delivery. The Privacy page, DPA/transfer review, content-deletion confirmation, and deletion operations must match the configured plan. |
| Failure semantics | AJAX exposes accepted, validation, and non-success results, but acceptance is not proof of inbox delivery and ambiguous network failures can lead to a manual duplicate. |
| Testing | The narrow adapter is deterministic under mocked responses. A separate staging/manual smoke proves the account, domain, delivery, `Reply-To`, and deletion configuration. |
| Cost and dependence | Free plan currently fits low launch volume; 50/month is a hard constraint. The public endpoint and dashboard/workflow are vendor dependencies, contained behind one replaceable adapter. |

This is the recommended current-release option.

### Option B — Cloudflare Worker + Resend

```text
Browser
  -> Cloudflare Worker
      -> CORS + schema validation + request-size limit + rate limiting
      -> optional Turnstile verification
      -> Resend API using a Worker secret
          -> Samuel's configured inbox
```

This option preserves GitHub Pages for the site while adding a separately deployed backend. It offers the strongest control: exact CORS allowlists, explicit rejection of extra fields, body-size limits, tailored rate limiting, server-only Resend credentials, safe notification construction, coarse structured logs, and Resend's 24-hour idempotency-key support. The sender must be an address on a verified domain with SPF/DKIM; the visitor remains `Reply-To`. A Worker should return `400` for invalid input, `403` for disallowed origins, `413` for oversize bodies, `429` for rate limits, and a non-success gateway/service result when Resend does not accept the email. A successful Resend API response still proves provider acceptance, not inbox delivery.

The cost is ownership of a new production service: Worker repository/configuration, separate deployment credentials, secret rotation, exact CORS/preflight behavior, abuse tuning, logs/alerts, incident response, dependency/API updates, and verified-domain DNS. Turnstile tokens require mandatory server-side Siteverify validation, are single-use, and expire after five minutes; adding it also adds challenge-specific privacy/accessibility work. Inquiry bodies must never enter Worker logs.

The current public limits are generous for this use case—Workers Free documents 100,000 requests/day, Resend Free documents 3,000 emails/month and 100/day, and Turnstile Free documents a free tier—but raw volume is not the deciding cost. Resend currently stores Free-plan email data for 30 days and sells no-storage as a restricted paid add-on, so the Worker does not eliminate processor storage. The deployed processors would include Cloudflare, Resend and its subprocessors, and Google/Gmail, with their DPAs/transfers and retention disclosed. This architecture is justified later if Formspree limits, validation behavior, abuse, delivery diagnostics, or workflow control become materially inadequate; it is disproportionate for the initial four-field form.

### Option C — EmailJS or equivalent browser email service

EmailJS can preserve static hosting. Its browser SDK intentionally exposes a public key plus service and template identifiers, then invokes a predefined email template rather than exposing the connected mailbox credential. It supports an origin allowlist, IP-oriented abuse limits, optional reCAPTCHA, Promise-based status handling, and a documented one-request-per-second SDK rate limit.

The security boundary is still more browser- and template-centric than Formspree: public identifiers and quota are directly exercised by untrusted clients, validation and message construction are split between frontend/template configuration, and the UI becomes coupled to provider SDK/service/template concepts. Operational visibility is provider-dashboard dependent and successful SDK resolution is still not proof of inbox delivery. The current Free plan advertises 200 requests/month, a 50 KB request limit, and seven days of history; paid tiers extend quota/history. Its privacy materials describe request history/metadata, US AWS hosting, and named subprocessors, so it does not remove the data-processing or disclosure burden.

EmailJS is viable but offers no material launch advantage over Formspree's static-form-specific field validation, form spam controls, and narrower conceptual boundary. It is not recommended.

## Trade-offs

Selecting Formspree preserves the accepted site architecture and minimizes bespoke operations while still keeping private mail credentials off the client. The trade is deliberate reliance on a third-party processor whose public endpoint, quota, storage, spam decisions, mail workflow, dashboard configuration, and availability FURLANICH does not control.

Compared with a Worker, FURLANICH has less control over CORS semantics, request-level observability, idempotency, log shape, and delivery retry policy. Compared with EmailJS, it has a boundary better aligned with an HTML/AJAX form and avoids introducing service/template SDK concepts into the UI. The adapter makes switching inexpensive, but privacy notice, operational configuration, and live verification still make a provider migration real work.

## Migration and implementation impact

This accepted RFC is recorded by [`ADR-CONTACT-INQUIRY-PIPELINE`](../decisions/contact-inquiry-pipeline.md). [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/active/contact-inquiry-pipeline.md) sequences the following work before release:

1. provision and verify the dedicated Formspree form without committing secrets or real data;
2. configure and staging-test the exact field schema, max lengths, file/unknown-field rejection, recipient, subject, `Reply-To`, Formshield, honeypot, domain restriction, CAPTCHA-off posture, and 30-day retention behavior;
3. update `PAGE-PRIVACY` with the verified deployed facts and complete the professional legal/privacy release review;
4. add the provider-neutral payload/result contract and Formspree adapter with test-first unit/contract coverage;
5. implement the already-approved localized Contact UI and state behavior in a separate application PR sequence;
6. run deterministic validation plus mocked browser success/failure tests; and
7. perform one labeled manual/staging submission that verifies acceptance, inbox delivery, intact labeled fields, authenticated sender, visitor `Reply-To`, spam behavior, and deletion.

No production form, provider account value, dependency, application code, deployment secret, or live submission is part of this RFC PR.

Migration away from Formspree retains `InquiryPayload`, `InquirySubmissionResult`, UI state, validation, and localized copy. Replace the adapter and public endpoint configuration, remove Formspree-specific configuration, test the new boundary, update the ADR and Privacy page, complete processor/legal review, run a labeled delivery/deletion smoke test, then cut over. The rollback is to disable submission and retain direct contact alternatives; never fall back to exposing SMTP/API credentials or silently discarding requests.

## Testing strategy

Routine automated tests must remain provider-isolated:

- unit tests for trimming, omission of empty `company`, exact payload allowlisting, locale/source mapping, and length/type validation;
- adapter contract tests for documented accepted responses, provider field errors, generic rejection, `429`, quota/misconfiguration, `5xx`, timeout/network failure, malformed JSON, unexpected shapes, and abort behavior;
- reducer/state tests for `IDLE -> VALIDATING -> SUBMITTING -> SUCCESS | ERROR`, value preservation, explicit retry, reset only after acceptance, and one active request;
- Playwright tests that intercept the provider request and exercise Spanish and English success, field-error, generic-failure, timeout, retry, keyboard/focus, live-region, and duplicate-submit behavior without leaving the site;
- static-export verification for both locale routes and any optional GitHub Pages base path; and
- one explicit non-CI manual/staging integration test before release using labeled non-prospect data.

CI must never contact the production Formspree endpoint or generate inbox email. Tests should inject/mock `submitInquiry()` or intercept the HTTPS request at the browser boundary. Provider response fixtures contain synthetic values only and must not include the production form ID when a placeholder is sufficient.

## Risks

- A plan, limit, retention, API, mail provider, or legal-term change could invalidate this comparison. Mitigation: re-verify official sources at provisioning and release.
- Domain restriction depends on browser `Referer` behavior and can reject privacy-hardened clients or be bypassed as a sole control. Mitigation: preserve compatible policy, test it, and rely on layered filtering/validation rather than treating it as authentication.
- Provider acceptance may not result in prompt inbox delivery. Mitigation: honest success language, provider status/quota review, fallback channels, and labeled live smoke tests.
- Ambiguous network failure can produce a duplicate after manual retry. Mitigation: no automatic browser retry, preserved values, non-committal error copy, and human deduplication.
- Free-plan quota exhaustion can make a working UI fail. Mitigation: monitor counts and decide a paid plan or Worker migration before exhaustion.
- Dashboard configuration can drift from the documented schema. Mitigation: an implementation/release checklist and staging probes for every security-significant setting.
- Formspree and its infrastructure/mail subprocessors introduce US/international processing. Mitigation: accurate disclosure, DPA/subprocessor/content-deletion verification, limited fields, the 30-day provider target, mailbox retention, request handling, and professional legal review.
- The public endpoint can be discovered and exercised outside the UI. Mitigation: provider schema, domain restriction, honeypot, filtering, quota monitoring, and no sensitive configuration in the client.

## Unresolved questions

The following remain release gates, not reasons to expand this RFC PR into implementation:

- the exact responsible legal/business identity and professionally reviewed Argentine notice, consent, database-registration, and international-transfer position;
- the current Formspree DPA and complete subprocessor/delivery chain applicable to the provisioned account;
- the final production hostname(s), required for exact domain restriction and Privacy-page accuracy;
- verification that the provisioned Formspree schema rejects undeclared fields and files exactly as documented; and
- confirmation that the Free-plan quota remains adequate at launch or, if not, approval of a paid-plan retention procedure or migration.

## Recommendation

Approve Formspree for the current static-site release behind the narrow `submitInquiry()` adapter. It meets the in-page/AJAX, email notification, `Reply-To`, server-side validation, spam-control, static-host, and credential-boundary requirements with the least new operational surface. Keep CAPTCHA off initially, use the exact six-field payload plus an empty honeypot transport field, configure the recipient/subject/server validation in Formspree, disclose stored provider and mailbox copies accurately, and treat the Free plan's present 50/month and 30-day-history limits as explicit launch constraints.

Do not approve a full-site hosting migration, browser-side SMTP/Gmail/Resend secret, generic integration framework, production form implementation, or real-email CI as part of this decision.

## Approval resolution

The repository owner accepted Formspree behind the narrow `submitInquiry()` boundary when [Governance PR #43](https://github.com/Furlanich/Portfolio/pull/43) was merged on 2026-09-10. [`ADR-CONTACT-INQUIRY-PIPELINE`](../decisions/contact-inquiry-pipeline.md) records the durable decision, and [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/active/contact-inquiry-pipeline.md) owns its execution.

The merge resolves provider architecture, not the release gates. Verified account/schema/delivery/deletion behavior, the final production hostname, complete processor chain and transfer treatment, professional privacy/legal review, accurate deployed Privacy pages, deterministic checks, and labeled staging/production smoke evidence remain required.

## Status

**APPROVED.** The repository owner approved this architecture by merging [Governance PR #43](https://github.com/Furlanich/Portfolio/pull/43) on 2026-09-10. The original comparison, alternatives, and trade-offs remain above as decision history. Application delivery is governed by `ADR-CONTACT-INQUIRY-PIPELINE` and `PLAN-CONTACT-INQUIRY-PIPELINE`; keep the Contact form disabled until the configuration, Privacy page, legal review, deterministic tests, and labeled delivery/deletion smoke gates are complete.

## Subsequent demonstration-mode decision — 2026-09-12

[`ADR-CONTACT-INQUIRY-DEMO-MODE`](../decisions/contact-inquiry-demonstration-mode.md) scopes the current public site to a non-commercial demonstration at `https://furlanich.github.io/Portfolio/`. The deployed Contact form may use the same approved fields, state model, and provider-neutral port only through a local adapter that sends and stores nothing. This later decision does not alter the Formspree comparison or mark any provider/legal/delivery gate above as passed; it defers real processing to a separately reviewed commercial activation.

## Official references checked

### Formspree

- [AJAX form submission](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/)
- [HTML forms and stored submissions](https://help.formspree.io/articles/building-your-form/building-an-html-form/)
- [Workflow validation and delivery](https://help.formspree.io/articles/building-your-form/getting-started-with-workflow/)
- [`formspree.json` allowed fields and validation rules](https://help.formspree.io/articles/using-the-cli/the-formspree-json-file)
- [Email `Reply-To`](https://help.formspree.io/articles/building-your-form/email-reply-to-address)
- [Email subject](https://help.formspree.io/articles/building-your-form/email-subject-line)
- [Honeypot filtering](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering)
- [Spam prevention](https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam)
- [Domain restriction](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain)
- [System limits](https://help.formspree.io/articles/form-and-project-settings/system-limits)
- [Account limits and history](https://help.formspree.io/articles/account-management/account-limits)
- [Turnstile option](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile)
- [Privacy policy](https://formspree.io/legal/privacy-policy/), [terms](https://formspree.io/legal/terms-of-service/), [security](https://formspree.io/security/), and [service status](https://status.formspree.io/)

### Cloudflare and Resend

- [Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [pricing](https://developers.cloudflare.com/workers/platform/pricing/), [testing](https://developers.cloudflare.com/workers/testing/), and [logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/), [server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), and [testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Resend API](https://resend.com/docs/api-reference/introduction), [send-email fields and idempotency](https://resend.com/docs/api-reference/emails/send-email), [domain verification](https://resend.com/docs/dashboard/domains/introduction), [pricing](https://resend.com/pricing?product=transactional), and [no-storage option](https://resend.com/docs/knowledge-base/how-do-i-ensure-sensitive-data-isnt-stored-on-resend)
- [Resend privacy policy](https://resend.com/legal/privacy-policy), [DPA](https://resend.com/legal/dpa), and [subprocessors](https://resend.com/legal/subprocessors)

### EmailJS and law

- [EmailJS browser identifiers and security model](https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/), [SDK options](https://www.emailjs.com/docs/sdk/options/), [send API](https://www.emailjs.com/docs/sdk/send/), [origin allowlist](https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/), [pricing](https://www.emailjs.com/pricing/), [privacy policy](https://www.emailjs.com/legal/privacy-policy/), and [DPA](https://www.emailjs.com/legal/data-protection-agreement/)
- [Argentina, Ley 25.326 (official consolidated text)](https://www.argentina.gob.ar/normativa/nacional/ley-25326-64790/actualizacion)
