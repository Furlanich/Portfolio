# FURLANICH agent guide

FURLANICH is a Next.js site being migrated from a personal portfolio to a bilingual, founder-led software-studio website. Repository documentation is the system of record; current application code describes the existing system, not necessarily the intended product.

## Read in this order

- [Project knowledge](docs/index.md) and the [domain glossary](CONTEXT.md) define the product, design, terminology, and decision statuses.
- [Architecture map](ARCHITECTURE.md) records current implementation facts and separates them from proposed or open architecture.
- [Engineering lifecycle](docs/governance/engineering-lifecycle.md) classifies work, governs RFCs/ADRs/plans, and defines escalation and PR boundaries.
- [RFC index](docs/rfcs/index.md), [ADR index](docs/decisions/index.md), and [plan index](docs/plans/index.md) provide the durable engineering record.

## Work contract

- Run the relevant checks from `package.json`: `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`. `npm run validate` composes them.
- Keep product, design, architecture, governance, and implementation documentation synchronized with material changes. Update the owning record rather than duplicating a requirement.
- Preserve approved requirements and ADR history. Keep unresolved choices **OPEN** and route consequential proposals through the lifecycle.
- Keep secrets and local environment values out of source, documentation, test fixtures, and Pull Requests.
- Autonomous work uses a short-lived `codex/` branch, focused commits, validation, self-review, and a human-reviewed Pull Request. `main` remains human-controlled.

## Done

Work is done when its approved scope, documentation, deterministic validation, and diff review are complete and the branch is ready for human review. Detailed autonomy and completion rules live in the [engineering lifecycle](docs/governance/engineering-lifecycle.md).
