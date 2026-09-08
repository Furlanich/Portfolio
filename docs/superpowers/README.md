---
id: SUPERPOWERS-README
type: engineering-methodology
status: APPROVED
related:
  - SPEC-FRONTEND-TESTING-CAPABILITY-HARDENING
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-08
---

# Project-local engineering process Skills

Executable, portable Skills live under `.agents/skills/`. Upstream files are vendored unchanged and protected by `.agents/skills/vendor-lock.json`; `npm run skills:check` verifies their paths, provenance fields, and SHA-256 hashes.

| Skill | Source and exact revision | License | Local path | Purpose |
| --- | --- | --- | --- | --- |
| `test-driven-development` | [obra/superpowers](https://github.com/obra/superpowers), v6.3.0 content commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (annotated tag object `86babb696875227929e85420f287d6309374b93f`) | MIT | `.agents/skills/test-driven-development/` | Observed RED-GREEN-REFACTOR discipline |
| `systematic-debugging` | Same source and revision | MIT | `.agents/skills/systematic-debugging/` | Evidence-first diagnosis before fixes |
| `verification-before-completion` | Same source and revision | MIT | `.agents/skills/verification-before-completion/` | Fresh command evidence before completion claims |
| `design-taste-frontend-v1` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), commit `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`, upstream `skills/taste-skill-v1/SKILL.md` | MIT | `.agents/skills/design-taste-frontend-v1/` | Stable v1 design critique below repository authority |

Taste was installed project-locally with `npx skills add` and is also pinned in `skills-lock.json`. Experimental v2 is deliberately not the default.

`requesting-code-review` and `receiving-code-review` were evaluated but not vendored. The repository already owns final review and human-PR routing in `pr-readiness`; adding generic review Skills would overlap without strengthening the required implementation path. Re-evaluate only if a distinct project need emerges.

Do not casually edit vendored content. Upgrade by reviewing a new licensed upstream revision, updating only justified files, regenerating hashes, and recording the change. Project-specific deviations belong in project-authored Skills or testing documentation.

Substantial Superpowers design artifacts live under `docs/superpowers/specs/`; executable plans live under `docs/superpowers/plans/`. Create artifacts only when real work requires them—do not add empty folder hierarchies.
