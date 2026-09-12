---
id: ADR-CONTACT-INQUIRY-DEMO-MODE
type: architecture-decision-record
status: APPROVED
date: 2026-09-12
related:
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-STATIC-LOCALIZED-ROUTING
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - REF-CONTACT-DEMO-KIT
last_verified: 2026-09-12
---

# Contact inquiry demonstration mode

## Context

The current FURLANICH site will remain a portfolio and technical demonstration for an extended development period. It is not ready to offer, accept, or operate commercial services. Its stable public deployment is the default GitHub Pages project site at `https://furlanich.github.io/Portfolio/`.

The previously accepted Contact architecture remains useful future work: `ADR-CONTACT-INQUIRY-PIPELINE` selects Formspree behind the provider-neutral inquiry port for a later commercial release. The adapter and its deterministic tests are already present, but real processing cannot be enabled accurately without the missing provider-chain facts, professional privacy/legal review, operational ownership, and release evidence.

The complete Contact interface still needs to be built and reviewed without discarding its four fields, validation, state model, accessibility behavior, bilingual presentation, direct alternatives, static-export support, or test coverage.

## Decision

Deploy the complete Contact and Privacy experiences in an explicitly labeled **demonstration mode** on the default GitHub Pages project URL.

The demonstration submission path is:

```text
ContactForm
  -> validateInquiry(InquiryValues)
      -> createDemoSubmitInquiry()
          -> bounded local delay
          -> simulated accepted or failure result
          -> no network request, provider submission, email, inbox copy, or storage
```

The demonstration adapter implements the existing `SubmitInquiry` port but never imports or calls the Formspree adapter, reads `NEXT_PUBLIC_FORMSPREE_ENDPOINT`, invokes `fetch`, opens a mail application, sends an email, or writes inquiry values to storage, logs, analytics, URLs, or browser persistence. Valid values remain only in the form's in-memory React state. They reset after simulated success, remain available after simulated failure, and disappear on navigation or reload.

Any valid four-field submission simulates success except the reserved QA address `failure@example.invalid`, which deterministically simulates the provider-neutral `unavailable` failure. The `.invalid` top-level domain makes the control non-deliverable. Both outcomes wait through an injected delay boundary so loading and duplicate-prevention behavior remain real and testable without relying on wall-clock sleeps.

Public copy must say that the form is a simulation, no inquiry is sent, no commercial request is created, and no inbox receives the values. Simulated success must never use delivery language. The visible Privacy page may use the approved demonstration disclosure because its described data path is the deployed data path; it must not present the synthetic legal-review example as legal approval.

WhatsApp, email, and phone remain functional fallback demonstrations in the approved order. Copy must explain that activating them leaves the site and invokes an external communication service. Their presence does not convert the local form simulation into commercial intake or authorize a commercial-service claim.

The GitHub Actions deployment must not supply the Formspree endpoint to the demonstration build. The dormant Formspree adapter and tests remain in the repository to preserve the accepted future migration boundary. The deployed form must remain local-only even if a developer has a Formspree environment value locally.

## Rationale

This mode allows the real interface, validation, state transitions, failure recovery, localization, responsive behavior, accessibility work, and browser coverage to be completed and publicly demonstrated without collecting personal inquiry data or fabricating processor/legal facts. It keeps the accepted provider-neutral boundary useful while making the current deployed behavior truthful.

Using the default GitHub Pages project URL resolves the current deployment-host choice without adding a domain, runtime, backend, credential, or provider dependency.

## Consequences

- `https://furlanich.github.io/Portfolio/` is the approved canonical deployment URL for the demonstration site, with `/Portfolio` retained as the base path.
- The Privacy page must disclose GitHub Pages hosting and ordinary hosting metadata accurately, while stating that Contact field values stay in browser memory and are not transmitted by the form.
- Formspree acceptance, inbox delivery, `Reply-To`, domain restriction, provider retention, deletion, transfer, and professional legal-review proof are **not applicable** to demonstration completion and cannot be claimed as passed.
- The user-visible form retains all four fields, validation, loading, simulated success/failure, value preservation, duplicate prevention, and fallback channels.
- Automated and manual tests must prove zero cross-origin request on submit and must never rely on the real endpoint.
- The deployed demonstration may merge to `main`; it is not a commercial launch or evidence that the future Formspree pipeline is production-ready.
- Activating real submission is a consequential later change. It requires a new or reactivated versioned plan, verified current processor facts, professional review, exact production disclosure, configured host restriction for `furlanich.github.io`, staging inbox/deletion proof, and a human-reviewed release PR.

## Alternatives rejected

### Publish a real Formspree form with mock disclosure

Rejected because the browser would process real visitor data while the disclosed controller, processor chain, retention, transfer, and legal basis remained unverified.

### Hide all Contact and Privacy work until commercial readiness

Rejected because it prevents implementation and rendered QA of already-approved form behavior during a long demonstration phase.

### Publish mock wording that implies legal review or delivery

Rejected because synthetic evidence cannot establish legal approval, provider behavior, or inbox receipt.

### Remove the Formspree boundary

Rejected because the tested adapter is valid retained architecture for a later commercial activation and costs no deployed processing when it is not imported or configured.

## Related architecture

This ADR scopes the current deployed mode; it does not rewrite or supersede [`ADR-CONTACT-INQUIRY-PIPELINE`](contact-inquiry-pipeline.md). The earlier ADR remains the accepted transport architecture if a later commercial activation satisfies its gates. [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md) continues to own static export, localized routes, trailing slashes, GitHub Pages, and base-path behavior.

## Related requirements

- [`PAGE-CONTACT` and `PAGE-PRIVACY`](../product/pages/contact-and-privacy.md) own the exact demonstration and dormant commercial copy/behavior.
- [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/active/contact-inquiry-pipeline.md) sequences demonstration implementation and preserves the future commercial activation gates.
- [`REF-CONTACT-DEMO-KIT`](../references/contact-inquiry-demonstration/index.md) contains the approved synthetic operational and review resources.

## Date and status

**APPROVED — 2026-09-12.** The repository owner explicitly selected the default GitHub Pages deployment as the lasting showcase host and authorized the mock resources to ship on `main`, provided the site performs no commercial inquiry processing.
