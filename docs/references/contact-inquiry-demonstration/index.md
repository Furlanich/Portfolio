---
id: REF-CONTACT-DEMO-KIT
type: reference
status: APPROVED
related:
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - REF-CONTACT-DEMO-PROVIDER
  - REF-CONTACT-DEMO-REVIEW
last_verified: 2026-09-12
---

# Contact inquiry demonstration resource kit

> **DEMONSTRATION RESOURCE — NOT LEGAL ADVICE OR COMMERCIAL-RELEASE EVIDENCE.**

These resources are approved for implementation tests, rendered QA, and the public demonstration deployed at `https://furlanich.github.io/Portfolio/`. They describe a local-only simulation that does not send form values. They must not be reused to activate Formspree, claim inbox delivery, claim professional legal review, or represent a commercial inquiry service as operational.

## Resources

- [`REF-CONTACT-DEMO-PROVIDER`](provider-profile.md) defines the exact synthetic adapter behavior, deployment host, processor boundary, state retention, and safe QA controls.
- [`REF-CONTACT-DEMO-REVIEW`](review-and-evidence.md) provides a mock review record and repeatable evidence sheets for deterministic, browser, accessibility, visual, static-export, and deployed verification.
- [`PAGE-CONTACT` and `PAGE-PRIVACY`](../../product/pages/contact-and-privacy.md) own the exact public Spanish and English demonstration copy. This kit links to that owner instead of duplicating public copy.

## Safe-use rules

1. The demonstration build does not receive `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
2. The Contact route imports the demonstration adapter, never the Formspree adapter.
3. Submission makes no `fetch`, beacon, navigation, mail, storage, analytics, or logging call with field values.
4. `failure@example.invalid` is the only public deterministic failure control. Every other syntactically valid email follows the simulated-success path.
5. Success copy says only that the demonstration completed and explicitly says that nothing was sent.
6. Failure copy preserves all four field values and says that nothing was sent.
7. WhatsApp, email, and phone are visibly described as external fallback demonstrations.
8. No mock review record closes a future commercial privacy, processor, transfer, retention, deletion, host-restriction, or delivery gate.

## Replacement rule

A future commercial activation does not silently edit these fixtures into production facts. It starts a human-reviewed versioned plan that consumes the dormant Formspree ADR, replaces the deployed demonstration adapter and copy, re-verifies current provider materials, and supplies the missing real evidence. These reference files remain as historical demonstration fixtures or are retired in that plan after consumer checks.

## Research basis checked 2026-09-12

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) documents static hosting and visitor IP logging for security.
- [Formspree Terms](https://formspree.io/legal/terms-of-service/) describe the real service as accepting, storing, and processing submissions; that is why the demonstration build does not contact it.
- [Formspree Privacy](https://formspree.io/legal/privacy-policy/) describes collection of form and network metadata, US/international processing, and non-fixed retention exceptions; none are represented as current demonstration-form processing.
- [Argentine Law 25.326](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion) Article 6 lists notice elements for personal-data collection. The deployed demonstration avoids collection by the form and explicitly describes its actual local-only behavior.
- [AAIP international-transfer guidance](https://www.argentina.gob.ar/transferencias-internacionales) remains relevant only if future commercial activation sends inquiry data outside Argentina.

Research is context, not legal approval. Recheck time-sensitive sources before any commercial activation.
