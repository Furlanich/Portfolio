---
id: REF-CONTACT-DEMO-REVIEW
type: reference
status: APPROVED
related:
  - REF-CONTACT-DEMO-KIT
  - REF-CONTACT-DEMO-PROVIDER
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PLAN-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-09-12
---

# Demonstration review and evidence examples

> **MOCK RECORDS — NOT PROFESSIONAL LEGAL REVIEW, PROVIDER PROOF, OR RELEASE CERTIFICATION.**

These examples define the evidence shape available to implementation PRs. Reviewers record observed PASS/FAIL results in PR descriptions or the active plan without committing field values, screenshots containing personal data, endpoints, cookies, credentials, or private account material.

## Mock privacy/legal review record

| Review item | Demonstration disposition | Commercial activation disposition |
| --- | --- | --- |
| Reviewer | Repository owner reviewing truthful demonstration copy | **OPEN:** qualified Argentine privacy/legal professional |
| Responsible party identity/address | Not asserted as a legal conclusion; public page provides the existing Samuel contact route | **OPEN:** verify legally required identity and domicile wording |
| Form data collection | None; values remain in browser memory | **OPEN:** Article 6 notice and lawful processing basis |
| Form processor | None | **OPEN:** current Formspree agreement, DPA, roles, and material subprocessors |
| International transfer by form | None | **OPEN:** Article 12 mechanism and safeguards |
| Form retention/deletion | No provider or mailbox copy exists | **OPEN:** provider, logs/backups, mailbox, and business-record rules |
| Consent control | No submission occurs; no consent checkbox is represented as legally required or sufficient | **OPEN:** professional determination for real collection |
| Marketing/analytics | No inquiry content or result analytics | Re-review before adding any secondary use |
| External fallbacks | Clearly disclosed as visitor-initiated third-party actions | Verify providers and wording for commercial release |
| Outcome | Demonstration disclosure is approved as product copy, not legal advice | **OPEN:** no commercial release approval |

This record intentionally has no fabricated lawyer name, opinion, registration conclusion, controller address, DPA acceptance, or transfer determination.

## Deterministic evidence sheet

| Check | Required evidence |
| --- | --- |
| Validator | Exact/minimum/maximum cases, all errors at once, normalized payload, optional company, Unicode byte ceiling |
| Demo adapter | Default/injected delay, accepted path, reserved failure path, one resolution, no endpoint/fetch/storage/log dependency |
| Form state | `IDLE -> VALIDATING -> SUBMITTING -> SUCCESS | ERROR`, duplicate prevention, failure preservation, success reset |
| Localization | Spanish `es-AR` and natural English labels, helpers, errors, demo disclosure, status text, fallback note |
| Privacy | Both routes describe local-only values, GitHub Pages hosting metadata, external fallback boundary, no Formspree/inbox claim |
| Static export | Root and `/Portfolio` artifacts, trailing slashes, route equivalence, internal links, no deployment endpoint variable |

## Playwright evidence sheet

Run success and failure in Chromium and the proportionate cross-engine/viewport matrix required by `TEST-PLAYWRIGHT` and `DESIGN-IX-A11Y`.

| Scenario | Expected observation |
| --- | --- |
| Valid success | Busy state appears, duplicate activation is blocked, demonstration-complete status receives focus, fields reset, no request contains values |
| Reserved failure | Use `failure@example.invalid`; alert receives focus, every value remains, retry is available, no request contains values |
| Validation failure | All applicable inline errors render, first invalid field receives focus, values remain |
| JavaScript unavailable | Direct WhatsApp/email/phone alternatives and demonstration disclosure remain readable; no false form success |
| Network guard | Fail the test if submit initiates `fetch`, XHR, beacon, document navigation, or a Formspree request |
| Privacy routes | Correct language, one H1/main, readable section hierarchy, footer links, no live-processing representation |

## Accessibility evidence sheet

- Labels, required/optional text, helpers, and errors are programmatically associated.
- `aria-invalid` is present only for invalid controls.
- Submitting uses a polite progress announcement and blocks duplicate activation.
- Simulated success uses a focused `role="status"`; simulated failure uses a focused alert.
- Keyboard order matches visual order; focus remains visible and unclipped.
- All actions meet the approved target sizes and remain usable at 200% zoom.
- Both locales pass representative axe scans with no critical or serious violations.
- Manual semantics, error identification, contrast, reflow, reduced motion, and assistive-technology announcements are recorded separately from axe.

## Visual evidence sheet

Inspect both locales at `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x900` for idle, validation errors, submitting, simulated success, and simulated failure. Check natural content height, long-copy wrapping, textarea resize, no horizontal overflow, hierarchy of the demonstration notice, form prominence, fallback ordering, and Privacy readability. Store transient screenshots only in ignored QA output; do not commit new baselines unless separately approved.

## Deployed demonstration proof

After the implementation PRs merge and GitHub Pages deploys `main`, record:

```text
Host: https://furlanich.github.io/Portfolio/
Mode: demonstration / local-only
Spanish Contact: PASS | FAIL
English Contact: PASS | FAIL
Spanish Privacy: PASS | FAIL
English Privacy: PASS | FAIL
Simulated success: PASS | FAIL
Reserved simulated failure: PASS | FAIL
Values preserved after failure: PASS | FAIL
No cross-origin submission request: PASS | FAIL
No Formspree endpoint supplied to deployment: PASS | FAIL
Fallback disclosure and links: PASS | FAIL
Keyboard/focus/status behavior: PASS | FAIL
Responsive/zoom/reduced-motion checks: PASS | FAIL
Console errors: PASS | FAIL
Checked at: ISO-8601 timestamp
Checked by: reviewer identity
```

Inbox receipt, `Reply-To`, provider deletion, Formspree domain restriction, DPA, subprocessors, transfer mechanism, and professional legal opinion are marked **NOT APPLICABLE TO DEMONSTRATION**, not PASS.
