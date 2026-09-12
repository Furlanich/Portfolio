---
id: REF-CONTACT-DEMO-PROVIDER
type: reference
status: APPROVED
related:
  - REF-CONTACT-DEMO-KIT
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PAGE-CONTACT
  - PLAN-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-09-12
---

# Demonstration provider profile

> **SYNTHETIC PROFILE — SAFE FOR PUBLIC DEMONSTRATION; NOT A REAL PROCESSOR CONFIGURATION.**

## Deployment facts

| Property | Approved demonstration value |
| --- | --- |
| Public origin | `https://furlanich.github.io` |
| Repository base path | `/Portfolio` |
| Canonical deployment URL | `https://furlanich.github.io/Portfolio/` |
| Site purpose | Portfolio and technical demonstration; no commercial inquiry intake |
| Submission transport | Local in-memory demonstration adapter |
| External form processor | None |
| Target inbox | None |
| Email notification | None |
| Formspree endpoint in deployment | Absent |
| Browser persistence | None created by the Contact implementation |
| Application logs or analytics | None for form values or results |
| CAPTCHA or challenge processor | None |

GitHub Pages remains the static host. It may process ordinary hosting metadata such as visitor IP addresses for security under GitHub's own published terms. It does not receive the four Contact field values from a submission because the demonstration adapter makes no request.

## Demonstration data contract

The visible form keeps exactly these values:

| Field | Requirement | Maximum |
| --- | --- | --- |
| `name` | Required | 120 characters |
| `email` | Required and syntactically valid | 254 characters |
| `company` | Optional | 160 characters |
| `message` | Required | 4,000 characters |

Locale and source remain non-sensitive application context for the state demonstration. The existing 24 KiB normalized request ceiling remains validated even though the demonstration adapter creates no request.

## Deterministic outcome controls

```ts
type DemoSubmissionOptions = {
  delayMs?: number;
  wait?: (milliseconds: number) => Promise<void>;
};

declare function createDemoSubmitInquiry(
  options?: DemoSubmissionOptions,
): SubmitInquiry;
```

- Default delay: `650` milliseconds.
- Injected tests use a zero-time `wait` double and assert the requested delay instead of sleeping.
- A valid payload whose normalized email is `failure@example.invalid` resolves to `{ status: 'failed', reason: 'unavailable' }`.
- Every other valid payload resolves to `{ status: 'accepted' }` as a simulated scenario result.
- The adapter never calls `fetch`, reads an endpoint, opens another application, stores values, logs content, or retries.
- The UI receives `mode="demonstration"` and therefore interprets `accepted` only as completed simulation, never provider acceptance or inbox delivery.

## Retention model

| State | Value lifetime |
| --- | --- |
| Validation error | Preserved in React form state until edited, reset, navigation, or reload |
| Simulated submission failure | Preserved in React form state until retry, edit, reset, navigation, or reload |
| Simulated success | Reset immediately after the localized success state is established |
| Browser navigation or reload | Discarded by the Contact implementation |
| Provider/dashboard/mailbox | Not applicable; no copy exists |

Browser autofill, browser history, extensions, assistive technologies, and operating-system features remain under the visitor's environment rather than FURLANICH's form implementation.

## External fallback boundary

The demonstrated WhatsApp, email, and phone actions remain real external links. Selecting one leaves or invokes functionality outside the local form simulation and may give data to the visitor's chosen communications provider. The site does not prefill Contact field values into those actions and does not claim that Samuel accepts commercial work through them during the demonstration phase.

## Future commercial mapping

| Demonstration behavior | Preserved commercial behavior |
| --- | --- |
| `createDemoSubmitInquiry()` | Replace route injection with the tested `createFormspreeSubmitInquiry()` only after a new release plan passes |
| Local simulated acceptance | Formspree documented acceptance response |
| Reserved `.invalid` failure | Provider/network/rate/configuration failure mapping |
| No storage or email | Verified provider history plus configured inbox notification |
| Demo disclosure | Professionally reviewed deployed-processor Privacy disclosure |
| No host restriction | Formspree restriction set to `furlanich.github.io` and exercised from `/Portfolio/contacto/` and `/Portfolio/en/contact/` |

The mapping preserves interface and UI investment without representing mock facts as completed commercial evidence.
