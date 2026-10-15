---
id: ADR-INDEX
type: adr-index
status: APPROVED
related:
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - GOV-ENGINEERING-LIFECYCLE
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - ADR-ADE-AGENT-USAGE
  - ADR-SFC-COMMERCIAL-ATLAS-V1
last_verified: 2026-10-15
---

# Architecture decision records

An ADR records a consequential architectural decision after it is accepted. Use [the template](template.md). Accepted ADRs use `APPROVED` status and remain immutable historical records. A changed decision gets a new ADR whose `supersedes` metadata identifies the earlier record; do not rewrite the earlier decision.

## Approved

- [ADR-SFC-COMMERCIAL-ATLAS-V1](studio-founder-contact-commercial-atlas.md): **APPROVED — 2026-10-15.** Records [RFC-SFC-COMMERCIAL-ATLAS-V1](../rfcs/studio-founder-contact-commercial-atlas-v1.md): the connected runtime extended to Studio, Founder and Contact through route profiles, yielding nodes and pinned strings on all five connected routes, genuine public inquiry through the retained Formspree port only by a committed commercial release record, the Terms route pair, and staging on a nondeployed integration branch with one coordinated release. Partially supersedes the demonstration-only decision in `ADR-CONTACT-INQUIRY-DEMO-MODE` and the two-route limit of `ADR-CONNECTED-STUDIO-PAGE-RUNTIME`, each only as its reviewed checkpoint lands; those files are unchanged. Live-graph tiers, legal sufficiency, provider and deployment receipts stay separate open gates.

- [ADR-ADE-AGENT-USAGE](ade-agent-usage.md): **APPROVED — 2026-10-07.** One task = one primary agent; `SINGLE_AGENT` with 0 subagents by default; up to 3 justified, bounded subagents with no nesting; independent review as a separate session; hard limits in Claude Code and Codex project configuration. Records owner decisions D1–D6, including the D6 amendment that drops the GPT-6 Luna and GPT-6.1 Sol requirements. Owning record: [GOV-AGENT-USAGE](../governance/agent-usage.md). No product or runtime change.

- [ADR-CONNECTED-STUDIO-PAGE-RUNTIME](connected-studio-page-runtime.md): **APPROVED decision intent — 2026-09-30**, after Revision 5 design/copy approval. Separate optional connected backgrounds on Services/Projects, complete index dossiers, six detail URLs retired and protected-mark Azure Footer. Partially extends Home-only WebGL scope; Home's own demand-only contract remains unchanged. Production is unimplemented; human governance/plan/PR gates remain required.

- [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](sky-chart-homepage-runtime.md): the Sky Chart star-atlas environment restyle of the Home runtime — full-viewport fixed canvas portaled to `document.body`, `CanvasTexture` sprite text labels with explicit font loading, recede/suspend, and a locale-neutral static poster pair, keeping direct demand-rendered Three.js, the Framer Motion progress boundary and every retained production gate. It removes the derived Azure sculpture from the scene and withdraws the ADR's optional Connection-video permission. Amended 2026-09-28 (software renderers fail the capability gate; frame timing is measured on hardware GPUs) and 2026-10-05 (how the gates were measured); no limit changed. It supersedes ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE.

- [`ADR-CONTACT-INQUIRY-DEMO-MODE`](contact-inquiry-demonstration-mode.md): deploy the complete Contact/Privacy experience as a truthful, local-only simulation on the default GitHub Pages project site while retaining the Formspree boundary for separately gated commercial activation.
- [`ADR-CONTACT-INQUIRY-PIPELINE`](contact-inquiry-pipeline.md): Formspree behind a narrow provider-neutral `submitInquiry()` boundary for the static Contact release, with explicit configuration, privacy, abuse, deterministic-test, live-delivery, and rollback gates.
- [`ADR-STATIC-LOCALIZED-ROUTING`](static-localized-routing.md): explicit Spanish-root and English-`/en/` static route trees, locale-owned layouts/content, typed route equivalence, and GitHub Pages/base-path compatibility for the homepage foundation.

## Superseded

- [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](adaptive-immersive-homepage.md): semantic HTML and static chapter posters first, direct demand-rendered Three.js, the existing Framer Motion progress boundary and one governed native Connection-video surface. It superseded ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE; it is superseded by ADR-SKY-CHART-HOMEPAGE-RUNTIME.
- [`ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE`](progressive-immersive-homepage.md): preserved historical prototype boundary and React Three Fiber 8 candidate; superseded by ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE after prototype review.
