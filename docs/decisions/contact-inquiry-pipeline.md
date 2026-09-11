---
id: ADR-CONTACT-INQUIRY-PIPELINE
type: architecture-decision-record
status: APPROVED
date: 2026-09-10
related:
  - RFC-CONTACT-INQUIRY-PIPELINE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
last_verified: 2026-09-11
---

# Contact inquiry submission pipeline

## Context

`PAGE-CONTACT` requires a bilingual, four-field inquiry form that submits inside FURLANICH, reports its state accessibly, and sends a useful notification to Samuel's configured business inbox without opening or depending on the visitor's email application. The site is a Next.js static export deployed to GitHub Pages under `ADR-STATIC-LOCALIZED-ROUTING`, so it cannot safely host SMTP credentials, a Gmail password, a private email API key, or a request-time application endpoint.

Inquiry data is personal information. The submission boundary therefore controls more than transport: validation, abuse handling, stored copies, email delivery, international processing, operational limits, failure semantics, and the facts that `PAGE-PRIVACY` must disclose.

## Decision

Use Formspree as the launch inquiry processor behind one narrow provider-neutral application boundary:

```text
ContactForm
  -> submitInquiry(InquiryPayload)
      -> Formspree adapter
          -> public Formspree HTTPS form endpoint
              -> configured validation and abuse controls
              -> provider-configured notification
                  -> Samuel's configured business inbox
```

The accepted application contract is:

```ts
type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  locale: 'es-AR' | 'en';
  source: '/contacto/' | '/en/contact/';
};

type InquirySubmissionResult =
  | { status: 'accepted' }
  | { status: 'invalid'; fieldErrors: Record<string, string> }
  | {
      status: 'failed';
      reason: 'rate-limited' | 'misconfigured' | 'unavailable' | 'unknown';
    };
```

The Contact UI owns localized content, client validation, the approved state model, focus, announcements, retry, duplicate prevention, value preservation, and reset-after-acceptance. The adapter owns only payload normalization and allowlisting, omission of an empty company, the provider honeypot transport value, the AJAX request, a bounded timeout, and conversion of documented provider responses into the provider-neutral result. Raw provider messages never reach the UI.

The six-field business payload is limited to name, email, optional company, message, locale, and source. It contains no files, marketing fields, analytics identifiers, cookies, fingerprints, referrer chains, client timestamp, recipient address, mail header, or private credential. The public Formspree form ID or endpoint may be supplied as build-time `NEXT_PUBLIC_FORMSPREE_ENDPOINT` configuration because it is an address rather than a secret; the target inbox and all delivery credentials remain provider-side.

A direct `fetch` adapter is the accepted initial implementation. Do not add a provider SDK, generic integration framework, provider registry, workflow engine, CRM synchronization, serverless backend, or hosting migration unless implementation evidence establishes a separate approved need.

The Formspree account and dedicated form must be controlled by Samuel, protected with multi-factor authentication, and configured before release with:

- the exact approved field schema, types, required rules, length limits, and no-file/unknown-field rejection;
- the verified target inbox, fixed FURLANICH inquiry subject, provider-authenticated sender, visitor email as `Reply-To`, and a plain labeled message body;
- Formshield or equivalent standard filtering, the non-focusable `_gotcha` honeypot, and exact production-domain restriction;
- one active browser submission, no automatic browser retry, and provider quota monitoring; and
- interactive CAPTCHA disabled at launch.

The UI may enter `SUCCESS` only after the adapter recognizes Formspree's documented acceptance response. This means the provider accepted the submission for processing; it does not prove mailbox receipt or that Samuel read the message. Validation-safe provider field errors map only to approved fields. Rate/quota, inactive or missing configuration, non-success, network, timeout, malformed JSON, and unknown response shapes map to the localized failure state without inquiry-content logging.

Deterministic tests never contact Formspree or send email. A labeled, non-prospect staging submission must prove provider acceptance, field integrity, inbox delivery, authenticated sender, visitor `Reply-To`, source/language, spam behavior, and deletion before the release PR may merge. A production smoke and deletion check then confirm the final hostname and deployed configuration before the plan is closed.

`PAGE-PRIVACY` must name the verified deployed parties and processing facts before the form is enabled, including GitHub Pages/GitHub, Formspree, its confirmed material infrastructure and email-delivery subprocessors, Google/Gmail, stored copies, ordinary network metadata, processing locations and safeguards, the request route, and retention/deletion operations. Provider copies are disabled when practical or deleted within the approved 30-day target; non-converted mailbox inquiries use the approved 12-month target unless they enter another governed business or legal record. Professional Argentine legal review remains a release gate and may change the public wording or operational targets before release.

## Rationale

Formspree supplies a public static-site-compatible form endpoint, AJAX responses, target-email notification, validation, spam filtering, honeypot handling, domain restriction, and `Reply-To` behavior without exposing a private mail credential. The narrow adapter contains vendor response details and keeps the localized Contact experience stable if the provider changes.

This option has less request-level control and observability than a first-party Worker with Resend, but adds substantially less deployment, security, monitoring, DNS, and operational surface for one low-volume form. It is a better-aligned boundary than EmailJS's browser SDK and template identifiers while carrying the same need for processor, storage, transfer, and privacy review.

## Consequences

- Static export, trailing-slash routes, GitHub Pages, and optional `NEXT_PUBLIC_BASE_PATH` remain unchanged.
- Formspree availability, quota, filtering, account configuration, stored history, and email workflow become launch dependencies.
- Provider acceptance and inbox delivery remain distinct facts; copy, automated tests, and manual evidence preserve that distinction.
- An ambiguous network failure may lead to a duplicate after an explicit retry. The browser does not retry automatically or claim exactly-once delivery.
- The public endpoint can be exercised outside the UI. Provider schema, domain restriction, honeypot, filtering, request limits, and quota review are layered controls rather than authentication.
- The deployment must fail closed to the existing direct WhatsApp, email, and phone alternatives when the endpoint is absent or invalid.
- Provider plan, API, subprocessor, retention, legal, or delivery changes require re-verification. A processor migration updates this ADR through a new superseding ADR rather than rewriting this record.
- Observed abuse may justify a later challenge, but CAPTCHA or Turnstile requires its own privacy, accessibility, localization, failure-mode, and governance review.

## Alternatives rejected

### Cloudflare Worker plus Resend for launch

Rejected for the initial four-field form because it adds a separately deployed backend, secret and DNS management, CORS, validation, rate limiting, monitoring, sender-domain configuration, and two processor boundaries. It remains the preferred migration candidate if Formspree's limits, abuse controls, retention behavior, validation, or delivery diagnostics become materially inadequate.

### EmailJS or another browser-oriented email service

Rejected because public service/template identifiers and quota are exercised more directly by untrusted clients, validation and message construction are split across browser and provider template configuration, and the UI becomes more coupled to provider SDK concepts without removing the privacy or delivery-proof burden.

### `mailto:` as the form implementation

Rejected because it opens and depends on a visitor-configured email application, cannot provide the approved in-page state model or confirmed provider acceptance, and abandons visitors without a working local client. Direct email remains an ordered fallback.

### Browser-side SMTP, Gmail, or private mail API credentials

Rejected because every shipped browser value is public and static export has no private request-time execution boundary.

## Related RFC

The complete comparison, operational model, risk analysis, official references, and migration triggers were proposed in [`RFC-CONTACT-INQUIRY-PIPELINE`](../rfcs/contact-inquiry-pipeline.md). The repository owner accepted the proposal by merging [Governance PR #43](https://github.com/Furlanich/Portfolio/pull/43) on 2026-09-10.

Delivery is governed by [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/active/contact-inquiry-pipeline.md). The plan keeps unresolved professional legal wording, verified provider configuration, final-host domain restriction, delivery, and deletion evidence as explicit gates rather than treating architectural approval as release approval.

## Related requirements

- [`PAGE-CONTACT` and `PAGE-PRIVACY`](../product/pages/contact-and-privacy.md) own the exact form fields, bilingual copy, state behavior, notification requirement, privacy facts, retention target, fallbacks, and release gates.
- [`DESIGN-VISUAL`](../design/visual-language.md#contact-visual-baseline-approved) owns the Contact composition, fields, state surfaces, and visual limits.
- [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md#contact-interaction-responsive-and-accessibility-baseline-approved) owns form semantics, focus, announcements, keyboard behavior, reflow, progressive availability, and the exact QA matrix.
- [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md) owns the static localized App Router and GitHub Pages constraints.
- [`TEST-STRATEGY`](../testing/strategy.md) and [`TEST-PLAYWRIGHT`](../testing/playwright.md) own deterministic, browser, axe, visual, and static-export verification boundaries.

## Date and status

**APPROVED — 2026-09-10.** Recorded after the repository owner merged Governance PR #43. This ADR approves Formspree behind the narrow provider-neutral boundary; it does not waive provisioning, privacy/legal, manual delivery, deletion, or human Pull Request gates.
