---
id: ARCH-STAGE-B-HARNESS-DESIGN
type: architecture-design
status: APPROVED
related:
  - ARCH-INDEX
  - GOV-KNOWLEDGE
  - DOCS-INDEX
last_verified: 2026-09-02
---

# Stage B agent engineering harness design

## Objective

Establish a small, repository-native operating environment in which an agent can discover authoritative knowledge, classify work, implement within approved scope, run deterministic checks, and prepare a Pull Request for human review. The repository remains the system of record and humans retain merge authority.

This design governs Stage B implementation. It does not approve or implement the FURLANICH website migration described by the product documentation.

## Repository evidence

The design is based on the merged Stage A repository:

- Next.js 16 App Router with one client-rendered route;
- React 18, TypeScript 5.5, Tailwind CSS 3.4, `next-intl`, Framer Motion, React Hook Form, and Lucide React;
- static export with trailing slashes, unoptimized images, and an optional GitHub Pages base path;
- content split between JSON data, localized message files, and React components;
- GitHub Pages deployment from `main` using Node 24;
- lint and build commands, but no explicit type-check command, test suite, formatting configuration, Pull Request CI, agent instructions, or repository-scoped Skills;
- Stage A product and design documentation that intentionally describes a target product different from the current application.

The current application is evidence, not authority for target product behavior. No current implementation accident becomes a durable constraint unless an approved requirement or later architectural decision adopts it.

## Design principles

1. **Progressive discovery:** root files route agents to deeper authoritative documents.
2. **Single ownership:** product, design, architecture, governance, and execution records each have a clear owner.
3. **Proportional governance:** routine work proceeds directly; consequential decisions use an RFC and accepted architecture is recorded in an ADR.
4. **Deterministic verification:** tools decide compilation, lint, tests, build, and documentation-integrity facts.
5. **Human Pull Request boundary:** agents may prepare work and open a PR, but may not merge or bypass review.
6. **Minimal structure:** no empty status directories, nested instruction files, or duplicate process documents.

## Knowledge hierarchy

The repository will expose this hierarchy:

```text
AGENTS.md
  -> docs/index.md and CONTEXT.md
  -> ARCHITECTURE.md
  -> docs/governance/engineering-lifecycle.md
  -> docs/rfcs/index.md
  -> docs/decisions/index.md
  -> docs/plans/index.md
  -> .agents/skills/*/SKILL.md when a repeatable procedure applies
```

`AGENTS.md` is a concise router and operating contract. It will identify authoritative locations, durable safety constraints, validation commands, documentation responsibilities, decision classification, autonomy boundaries, and the definition of done. Detailed governance remains in linked documents.

`ARCHITECTURE.md` is the concise current architecture map. It will distinguish:

- **CURRENT:** observed repository structure and deployment behavior;
- **TARGET:** only architecture already approved through repository governance;
- **PROPOSED:** preserved recommendations that are not implementation authority;
- **OPEN:** architectural questions requiring a governance decision.

The Stage A product and design documents remain independent of Codex-specific operating instructions.

## Governance artifacts

### Engineering lifecycle

`docs/governance/engineering-lifecycle.md` will own:

- change classification;
- Governance PR versus Implementation PR rules;
- autonomy and human-approval boundaries;
- Git and Pull Request expectations;
- requirements traceability;
- branch-protection recommendations;
- completion and escalation criteria.

This single guide avoids separate policy files for closely related concerns.

### RFCs

`docs/rfcs/index.md` will define when a consequential proposal requires an RFC and how active, accepted, and rejected RFCs are represented. `docs/rfcs/template.md` will require context, problem, requirements, proposal, alternatives, trade-offs, migration impact, risks, unresolved questions, recommendation, and status.

No empty `active/`, `accepted/`, or `rejected/` directory will be created. A status directory is added only when it contains a real RFC.

### ADRs

`docs/decisions/index.md` will define accepted architectural-decision history and supersession rules. `docs/decisions/template.md` will require context, decision, rationale, consequences, rejected alternatives, related RFC and requirements, date, and status.

No ADR will be invented for Stage B. This design records the approved harness scope; ADRs begin when a consequential architectural choice passes the governance process.

### Execution plans

`docs/plans/index.md` will distinguish lightweight in-task planning from versioned plans. `docs/plans/template.md` will include objective, implemented requirements, affected architecture, related ADRs, scope, non-goals, phases, affected areas, validation, risks, progress, implementation decisions, and deviations.

Stage B will create a real versioned plan and retain it under `docs/plans/completed/` when execution finishes. No empty active-plan directory will remain in the Pull Request.

## Requirements traceability

Traceability uses Markdown links and existing stable IDs:

```text
Product requirement
  -> design requirement
  -> RFC when consequential agreement is needed
  -> ADR after acceptance
  -> execution plan when work is substantial
  -> implementation
  -> test or validation evidence
  -> Pull Request
```

RFC, ADR, and plan templates will require relevant upstream links. Implementation and Pull Requests will cite the requirement IDs they satisfy. The repository will not introduce a database or separate requirements-management system.

## Repository-scoped Skills

Current Codex conventions discover repository Skills under `.agents/skills/<skill-name>/SKILL.md`. Skills will be instruction-only unless deterministic automation is materially better expressed as a repository script.

Stage B will create four non-overlapping Skills:

1. **project-knowledge-maintenance** — synchronize product, design, architecture, status, indexes, and cross-links after a material knowledge change.
2. **architecture-governance** — classify a requested change as direct work, versioned-plan work, RFC work, or ADR recording.
3. **visual-qa** — run the site and inspect relevant user journeys at appropriate viewports with available browser tooling, recording evidence and escalation conditions.
4. **pr-readiness** — perform final acceptance-criteria review, deterministic validation, documentation synchronization, diff review, and PR preparation.

`frontend-implementation` is deliberately deferred. The target routing, styling, component, and hosting architecture remains unresolved; creating a project-specific implementation Skill now would either duplicate `AGENTS.md` and package scripts or turn the legacy application into a permanent rule. Stage C will supply evidence for whether a distinct frontend procedure is repeatable and valuable.

Each created Skill will define its trigger, purpose, inputs, procedure, outputs, validation, and failure or escalation conditions. Each will be baseline-tested before authoring and forward-tested after authoring. Skill metadata will remain concise and implicitly discoverable.

## Deterministic quality gates

Stage B will add repository scripts for:

- documentation integrity;
- Skill front-matter and scaffold validation;
- Node-based tests for the documentation validator;
- ESLint;
- TypeScript checking without emit or incremental state;
- production static build.

The documentation validator will check repository-local Markdown links and anchors, unique document IDs, resolvable `related` IDs, allowed governance statuses, duplicate headings, and valid repository Skill structure. External-link availability remains a judgment-based or separately requested check because it is time-dependent and network-dependent.

The validator will be implemented with Node built-ins and no new dependency. Tests will use Node's built-in test runner and temporary fixtures. Formatting, browser automation, and accessibility packages will not be introduced without demonstrated value.

`package.json` will expose focused commands plus a composed validation command. GitHub Actions will run the same deterministic commands rather than reimplementing their logic in workflow YAML.

## Pull Request CI and deployment

A stable GitHub Actions workflow will validate Pull Requests targeting `main` with read-only repository permissions and Node 24:

1. checkout;
2. `npm ci`;
3. documentation and Skill integrity checks;
4. validator tests;
5. ESLint;
6. TypeScript checking;
7. production static build with the GitHub Pages base path.

The existing deployment workflow remains responsible for building and publishing `main`. Stage B will not adopt GitHub Agentic Workflows, preview orchestration, autonomous merge, or an experimental CI platform.

## Failure handling and escalation

- A deterministic failure blocks PR readiness until fixed or explicitly reported as an external/environmental limitation.
- Agents may not weaken or skip a gate to obtain a passing result.
- Product ambiguity remains OPEN and is not resolved through implementation.
- Consequential unresolved architecture or product choices move to a Governance PR.
- Routine implementation choices use repository evidence, accepted decisions, and existing conventions without interrupting the human.
- Secrets and local environment values are never copied into documentation, logs, fixtures, or Pull Request text.

## Git and human authority

Autonomous work uses short-lived `codex/` branches based on current `main`, focused commits, and Pull Requests. Agents may inspect, plan, implement approved scope, test, document, commit, push, and open a PR. Agents may not push directly to `main`, merge a PR, bypass failing CI, weaken protections, silently change approved product requirements, or silently supersede an ADR.

Stage B will document recommended protection for `main`: require Pull Requests, require deterministic status checks, require resolved conversations where appropriate, disallow force pushes and deletion, retain human merge review, and apply protections to administrators where practical. It will not change repository protection settings automatically.

## Expected repository changes

The implementation is expected to add or update:

- `AGENTS.md` and `ARCHITECTURE.md`;
- documentation indexes and current-system records affected by the new harness;
- `docs/governance/engineering-lifecycle.md`;
- RFC, ADR, and execution-plan indexes and templates;
- one completed Stage B execution plan;
- four repository-scoped Skills;
- a documentation and Skill integrity validator with tests;
- package validation commands;
- one stable Pull Request CI workflow.

Application components, routes, styling, dependencies, data, locale content, public assets, product decisions, and target product architecture are outside scope.

## Validation strategy

Stage B completion requires:

- validator tests observed failing before implementation and passing afterward;
- each Skill tested without and with its instructions;
- documentation and Skill integrity checks passing;
- ESLint passing, with pre-existing warnings reported accurately;
- TypeScript checking passing;
- production static build passing with `NEXT_PUBLIC_BASE_PATH=/Portfolio`;
- the generated `next-env.d.ts` restored if the build rewrites it;
- a clean worktree after commits;
- full diff inspection against `origin/main`;
- confirmation that no application behavior or dependency changed;
- independent review for unnecessary bureaucracy, overlapping Skills, ambiguous governance, and broken traceability.

## Stage C pilot recommendation

The first lifecycle pilot should programmatically associate the existing contact-form labels, fields, validation messages, and accessible descriptions. This is a bounded implementation of approved `PAGE-CONTACT` behavior, exercises requirement-to-PR traceability and visual accessibility review, and does not decide the OPEN form-provider or privacy-policy questions.

Stage C is not implemented in Stage B.
