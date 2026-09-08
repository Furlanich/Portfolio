# FURLANICH agent guide

FURLANICH is a Next.js site being migrated from a personal portfolio to a bilingual, founder-led software-studio website. Repository documentation is the system of record; current application code describes the existing system, not necessarily the intended product.

## Read in this order

- [Project knowledge](docs/index.md) and the [domain glossary](CONTEXT.md) define the product, design, terminology, and decision statuses.
- [Architecture map](ARCHITECTURE.md) records current implementation facts and separates them from proposed or open architecture.
- [Engineering lifecycle](docs/governance/engineering-lifecycle.md) classifies work, governs RFCs/ADRs/plans, and defines escalation and PR boundaries.
- [RFC index](docs/rfcs/index.md), [ADR index](docs/decisions/index.md), and [plan index](docs/plans/index.md) provide the durable engineering record.

## Frontend and testing routes

- Approved [visual](docs/design/visual-language.md) and [interaction/accessibility](docs/design/interaction-responsive-accessibility.md) specifications outrank Taste and agent judgment.
- Public UI implementation uses [`frontend-implementation`](.agents/skills/frontend-implementation/SKILL.md), [`test-driven-development`](.agents/skills/test-driven-development/SKILL.md), and [`playwright-qa`](.agents/skills/playwright-qa/SKILL.md).
- Rendered design judgment uses [`visual-qa`](.agents/skills/visual-qa/SKILL.md); repeatable browser behavior and visual judgment remain separate.
- [Testing strategy](docs/testing/strategy.md), [Playwright QA](docs/testing/playwright.md), and [visual regression policy](docs/testing/visual-regression.md) own the detailed procedures.
- Completion uses [`verification-before-completion`](.agents/skills/verification-before-completion/SKILL.md) and ends with [`pr-readiness`](.agents/skills/pr-readiness/SKILL.md).

## Work contract

- Run the relevant checks from `package.json`: `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`. `npm run validate` composes them.
- Keep product, design, architecture, governance, and implementation documentation synchronized with material changes. Update the owning record rather than duplicating a requirement.
- Preserve approved requirements and ADR history. Keep unresolved choices **OPEN** and route consequential proposals through the lifecycle.
- Keep secrets and local environment values out of source, documentation, test fixtures, and Pull Requests.
- Autonomous work uses a short-lived `codex/` branch, focused commits, validation, self-review, and a human-reviewed Pull Request. `main` remains human-controlled.

## Done

Work is done when its approved scope, documentation, deterministic validation, and diff review are complete and the branch is ready for human review. Detailed autonomy and completion rules live in the [engineering lifecycle](docs/governance/engineering-lifecycle.md).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
