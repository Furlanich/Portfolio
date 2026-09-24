---
id: SUPERPOWERS-README
type: engineering-methodology
status: APPROVED
related:
  - SPEC-FRONTEND-TESTING-CAPABILITY-HARDENING
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-23
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

## Vendored design and motion Skills

These optional design Skills were installed with `npx skills add` (tracked in `skills-lock.json`) and are integrity-locked in `vendor-lock.json`. Each local file matched the pinned upstream revision byte-for-byte, ignoring line endings, when it was locked. They do not change the implementation path in `AGENTS.md`; approved visual and interaction specifications still outrank them. Local directory names follow the upstream `name` field; the upstream directory appears in parentheses where it differs.

| Source and exact revision | License | Skills |
| --- | --- | --- |
| [emilkowalski/skill](https://github.com/emilkowalski/skill), commit `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128`, upstream `skills/<name>/` | MIT | `animate`, `animate-expo`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `pick-ui-library`, `prototype`, `review-animations`, `write-swift` |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), commit `c184364c58658b2f131b4ae8bd3d206cabb3deee`, upstream `skills/<directory>/` | MIT | `brandkit`, `design-taste-frontend` (`taste-skill`), `full-output-enforcement` (`output-skill`), `gpt-taste` (`gpt-tasteskill`), `high-end-visual-design` (`soft-skill`), `image-to-code` (`image-to-code-skill`), `imagegen-frontend-mobile`, `imagegen-frontend-web`, `industrial-brutalist-ui` (`brutalist-skill`), `minimalist-ui` (`minimalist-skill`), `redesign-existing-projects` (`redesign-skill`), `stitch-design-taste` (`stitch-skill`) |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable), tag `skill-v4.3.1` at commit `cd12f8660e2dde57b9615c8a6b8ea674101f9cfc`, upstream `.agents/skills/impeccable/` | Apache-2.0 | `impeccable` (all 56 text files) |

Upstream `SKILL.md` metadata is preserved as-is, so these descriptions need not begin with `Use when` and the nested `metadata:` map in `impeccable` is not held to repository front-matter conventions. `npm run docs:check` grants that exemption only to Skills named in `vendor-lock.json`; project-authored Skills keep the full metadata rule. `impeccable/scripts/bin/windows-x64/impeccable.exe` is a platform binary that the Impeccable launcher downloads on first run. It is absent from the upstream Git revision, so it is not hash-locked.

`requesting-code-review` and `receiving-code-review` were evaluated but not vendored. The repository already owns final review and human-PR routing in `pr-readiness`; adding generic review Skills would overlap without strengthening the required implementation path. Re-evaluate only if a distinct project need emerges.

Do not casually edit vendored content. Upgrade by reviewing a new licensed upstream revision, updating only justified files, regenerating hashes, and recording the change. Project-specific deviations belong in project-authored Skills or testing documentation.

Substantial Superpowers design artifacts live under `docs/superpowers/specs/`; executable plans live under `docs/superpowers/plans/`. Create artifacts only when real work requires them—do not add empty folder hierarchies.
