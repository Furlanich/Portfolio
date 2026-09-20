---
id: REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
type: prototype-review
status: APPROVED
related:
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-20
---

# Immersive homepage throwaway prototype review

## Boundary

This record summarizes the isolated throwaway prototype created under RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1 and ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE.

- Prototype branch: `codex/prototype-immersive-home-v1`
- Prototype commit: `5ba0d75`
- Measured: 2026-09-19
- Production authority: none
- Merge instruction: do not merge the prototype implementation into production

The prototype tested feasibility. It did not approve an art direction, runtime dependency, media pipeline, budget or implementation plan.

## Question and verdict

The prototype asked whether Precision Assembly could support a reversible four-beat homepage sequence in Spanish and English at 320, 390, 768, 1024 and 1440 CSS pixels while preserving meaningful static, reduced-motion and failure paths.

**Verdict: conditional yes.**

The state model, static-first boundary and demand-render policy are viable. Renderer compatibility, payload headroom, real-device behavior and final art direction required a follow-up governance review.

## Variants

| Variant | Tested composition | Prototype finding |
| --- | --- | --- |
| A — Precision Split | Copy and actions beside the scene; horizontal beat rail | Strongest immediate commercial hierarchy |
| B — Azure Monument | Full azure field with larger bone scene plane | Strong brand moment; sustained density competes with copy |
| C — System Instrument | Copy, vertical state rail and scene in three columns | Distinctive premise; original composition compressed copy and increased responsive complexity |

The prototype recommended A and proposed closing C as implemented. The owner later selected **C2 — Adaptive System Instrument** for the follow-up RFC. C2 removes the middle column, integrates the phase spine, changes compact choreography and adds a governed hybrid-media proposal. It is not the tested Variant C.

## Deterministic coverage

| Coverage | Result |
| --- | --- |
| Spanish and English | PASS |
| 320, 390, 768, 1024 and 1440 px | PASS |
| Four beats forward and backward in all 10 locale/width combinations | PASS |
| Horizontal overflow | 0 px in all 10 cases |
| Chromium full matrix | PASS |
| Firefox and WebKit smoke | PASS |
| Keyboard variant switching | PASS |
| Axe critical/serious checks for A, B and C | PASS |
| Static export | PASS |

Forty-seven screenshots and the raw results remain on the throwaway branch.

## Fallback evidence

| Condition | Result |
| --- | --- |
| Reduced motion | Static poster; no canvas; H1 and actions preserved |
| WebGL unavailable | Static poster; no canvas; no interruption |
| Forced initialization failure | Static poster and semantic content preserved |
| Forced context loss | Canvas removed and poster restored |
| Poster-only mode | Static poster and semantic content preserved |

Compact layouts moved the approved accountability and availability statements after the immersive sequence so they remained visible.

## Performance evidence

Measurements used a production static export served locally without HTTP compression and Chromium 153.0.8010.12 in headless mode.

| Metric | Result | Limit |
| --- | ---: | --- |
| Renderer activation | 324.7–330.2 ms | Local initialization |
| First frame | 306.7–325.4 ms | Not a mobile-network result |
| Three.js submission p95 | 1.0 ms maximum | Headless SwiftShader |
| Animation-frame interval p95 | 17.6–18.1 ms | Automated stepped scroll |
| Added decoded JavaScript | 575,961 B / 562.5 KiB | Material parse/memory cost |
| Added gzip JavaScript | 145,847 B / 142.4 KiB | Estimate |
| Added Brotli JavaScript | 119,707 B / 116.9 KiB | Near proposed ceiling |
| Added uncompressed transfer | 640,531 B / 625.5 KiB | Local comparison |
| Added font transfer | about 45.6 KiB | Fonts loaded globally |

These measurements support continued exploration. They do not predict constrained-phone thermal, memory, scroll or media-decoding behavior.

## Renderer finding

React Three Fiber 8.18.0 was tested first because the approved ADR named it as the React 18 candidate. It crashed under Next.js 16.3.2 while `react-reconciler` attempted to access `ReactCurrentOwner`.

The prototype removed React Three Fiber and used direct Three.js 0.186.0. The scene initialized, rendered on demand, reversed cleanly and restored its poster after context loss.

This is evidence against retaining React Three Fiber 8. It does not approve direct Three.js by itself and does not evaluate React 19 with React Three Fiber 9.

## Visual findings

Retain:

- protected identity separate from the derived sculpture;
- the four semantic states;
- bone, azure, ink, muted and tint roles;
- Instrument Sans with restrained IBM Plex Mono;
- intentional static posters;
- demand rendering and semantic HTML.

Correct:

- connect geometry to operational inputs;
- prevent instrument labels from competing with the proposition;
- change layout and media framing with each chapter;
- use width-specific choreography;
- preserve commercial hierarchy;
- enforce payload and real-device gates.

## Reference-site study

The follow-up discussion inspected [Creative Coefficient](https://creativecoefficient.net/) as a non-authoritative composition reference on 2026-09-19.

Useful principles were a stable editorial anchor beside changing media, consistent media frames, distinct chapter surfaces, a deliberate release from long sequences and sequential compact layouts.

The site was not treated as a template or quality authority. Observed limitations included large medium-width whitespace, a tall fixed mobile header/promotion area, an isolated low-contrast transition, desktop offscreen video playback, incomplete reduced-motion behavior and one video resource measured near 17.9 MB. No copy, branding or implementation was reproduced.

## Human review carried into the RFC

The owner selected the C/System Instrument territory, rejected its cramped treatment and approved these sections for written review:

- C2 hybrid architecture;
- two-zone composition and art direction;
- four-state sequence;
- responsive system;
- loading and budgets;
- accessibility and motion control;
- failure handling;
- media and evidence governance.

Those approvals define RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1. They do not approve the written RFC or supersede an ADR.

## Remaining evidence

Before production activation:

- test one constrained Android device;
- measure repeated traversal for memory and thermal behavior;
- validate actual poster and video encodes;
- verify both locales, five widths and 200 percent zoom;
- test Save-Data, reduced motion, no JavaScript, blocked media and context loss;
- demonstrate the final JavaScript and media budgets;
- review the static experience independently.

## Reproduction

The throwaway branch provides:

~~~powershell
npm.cmd run build
node scripts/measure-immersive-prototype.mjs
npx.cmd playwright test tests/e2e/immersive-prototype.spec.ts --project=chromium-desktop
npx.cmd playwright test tests/e2e/immersive-prototype.spec.ts --project=firefox-desktop --project=webkit-desktop
~~~

## Status

**APPROVED REVIEW RECORD — 2026-09-20.** The repository owner approved this durable evidence summary with the follow-up RFC. It records prototype facts and creates no production implementation authority.
