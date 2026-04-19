# Dev Workflow Specification

**Status:** Implemented
**Last Updated:** 2026-04-08

## 1. Overview

### Purpose

Phase-based development workflow plugin for Claude Code. Decomposes feature work into three sequential phases — What (research/planning), How (task decomposition), Build (implementation) — and mirrors that artifact-driven approach for reverse-spec work with Systems (reverse backlog planning) and Reverse (spec execution). The user drives phase transitions manually; each phase produces committed artifacts that serve as the sole handoff to the next phase.

### Goals

- Eliminate mid-build course corrections by front-loading research and planning
- Maintain fresh context per task via isolated `dev/build` invocations
- Allow multiple planned features to coexist under `.dev/` without forcing an immediate worktree per idea
- Accumulate architectural knowledge in persistent domain specs that survive across features
- Support queue-based reverse-spec work via `dev/systems` → `specs/systems.yml` → `/dev:reverse`
- Automate feature completion (spec writing, alignment checking, squash merge) via `/dev:done`
- Preserve ad hoc reverse-engineering for one-off or narrow investigations via `/dev:reverse <loose target>`

### Non-Goals

- No orchestrator script or loop runner (wave 1 — user loops `dev/build [feature]` manually)
- No hooks or `DEVFLOW_STAGE` env var enforcement (planned for wave 2)
- Not a project management tool — no cross-feature tracking, no team coordination
- Does not handle multi-repo workflows

## 2. Architecture

Two-layer knowledge model with five skills, four commands, and two agents:

```text
specs/  ──read──→  /dev:plan or /dev:iterate  ──invoke──→  dev/what  →  .dev/<feature>/prd.md  →  dev/how [feature]  →  .dev/<feature>/tasks.yml
  ↑                                                                                                                           │
  │                                                                                                      │
  │                                                                                          create/switch feature
  │                                                                                          branch or worktree
  │                                                                                                      │
  │                                                                                                      ▼
  │                                                                                        dev/build [feature]
  │                                                                                                      │
  │                                                                                                commits
  │                                                                                                      │
  │                                                                                                  /dev:done
  │                                                                                                      │
  │                                                                                          dev/specs + alignment
  │                                                                                                      │
  │                                                                                          squash merge + remove
  │                                                                                         .dev/<feature>/ only
  │
  └──── persistent specs + reverse backlog
```

### Component Relationships

**Skills** (composable workflow building blocks, each runs in its own context window):

| Skill | Input | Output | Location |
|---|---|---|---|
| `dev/what` | Feature idea + existing `specs/` | `.dev/<feature>/prd.md` (+ optional research, learning tests) | `plugins/dev/skills/what/SKILL.md` |
| `dev/how` | `.dev/<feature>/prd.md` | `.dev/<feature>/tasks.yml` | `plugins/dev/skills/how/SKILL.md` |
| `dev/build` | `.dev/<feature>/tasks.yml` + `.dev/<feature>/progress.md` | Commits + updated state files | `plugins/dev/skills/build/SKILL.md` |
| `dev/systems` | Repo/subtree + existing `specs/` | `specs/systems.yml` | `plugins/dev/skills/systems/SKILL.md` |
| `dev/specs` | Code + optional PRD context | `specs/<domain>.md` + `specs/README.md` | `plugins/dev/skills/specs/SKILL.md` |

**Commands** (slash commands; orchestration layer):

| Command | Purpose | Location |
|---|---|---|
| `/dev:plan <idea>` | Orchestrate blank-slate feature planning, then invoke `dev/what` | `plugins/dev/commands/plan.md` |
| `/dev:iterate <feature>` | Orchestrate PRD revision for an existing feature, then invoke `dev/what` | `plugins/dev/commands/iterate.md` |
| `/dev:done <feature>` | Orchestrate feature completion: verify tasks, write specs, check alignment, squash merge | `plugins/dev/commands/done.md` |
| `/dev:reverse <target>` | Reverse-engineer domain specs from existing code, from either a backlog item or a loose target | `plugins/dev/commands/reverse.md` |

**Agents** (spawned by skills or commands, not invoked directly):

| Agent | Role | Tools | Location |
|---|---|---|---|
| `spec-reviewer` | Compare specs against code (+ PRD in post-build mode) | Read, Glob, Grep | `plugins/dev/agents/spec-reviewer.md` |
| `worktree-manager` | Assess checkout noise/safety, create or switch isolated checkouts when asked, and finish features via squash merge + cleanup | Bash, Read, Glob | `plugins/dev/agents/worktree-manager.md` |

### Knowledge Layers

- **`specs/`** (persistent) — domain specs on trunk, accumulate across features. Organized by stable system domain. Index at `specs/README.md`. Also contains `systems.yml`, the reverse-spec backlog when using `dev/systems`; once a `/dev:reverse` pass consumes the last actionable backlog item and the final spec(s) are aligned, delete `systems.yml` as cleanup.
- **`.dev/`** (feature-scoped planning namespace) — container for multiple transient feature workspaces. Each feature gets its own directory such as `.dev/priority-filter/` containing `prd.md`, `tasks.yml`, `progress.md`, research, and learning tests. These directories may live on trunk during planning. Each feature directory is deleted individually when shipped or abandoned; `.dev/` itself is removed only when it becomes empty.

### Feature Resolution Rules

Skills and commands that consume artifacts resolve a feature in this order:

1. Exact feature path (for example `.dev/priority-filter`)
2. Exact feature slug (`priority-filter`)
3. Unique case-insensitive substring match
4. Implicit selection only when exactly one candidate feature directory contains the required artifact for that phase
5. Otherwise stop and require the user to name the feature explicitly

The required artifact depends on phase:

- `dev/how` → `prd.md`
- `dev/build` → `tasks.yml`
- `/dev:done` → `tasks.yml` inside the checkout resolved by `worktree-manager`

### Reference Documents

Skills use progressive disclosure — SKILL.md files are concise, with detailed schemas and protocols in `references/` subdirectories:

| Reference | Parent Skill | Purpose |
|---|---|---|
| `skills/what/references/prd-schema.md` | `dev/what` | PRD template and field rules |
| `skills/what/references/learning-tests.md` | `dev/what` | Learning test protocol for black-box deps |
| `skills/what/references/research.md` | `dev/what` | Research protocol and output format |
| `skills/how/references/tasks-schema.md` | `dev/how` | `tasks.yml` YAML schema and field reference |
| `skills/how/references/task-planning.md` | `dev/how` | Task sizing rules and ordering convention |
| `skills/build/references/build-protocol.md` | `dev/build` | Code review integration and `progress.md` format |
| `skills/systems/references/systems-schema.md` | `dev/systems` | `specs/systems.yml` backlog schema and status model |
| `skills/specs/references/spec-schema.md` | `dev/specs` | Domain spec template and `specs/README.md` index format |

## 3. Data Model

### Feature Artifact Layout

```text
.dev/
  priority-filter/
    prd.md
    tasks.yml
    progress.md
    research.md
    lt-gh-flags.sh
  backlog-export/
    prd.md
```

The feature directory name is the canonical key that ties What, How, Build, and Done together.

### tasks.yml

```yaml
project: "project-name"                  # squash merge commit message
prd: ".dev/priority-filter/prd.md"       # path to PRD
description: "Brief summary"

requirements:                             # pre-conditions with check commands
  - name: "Database running"
    check: "pg_isready -h localhost"

tasks:
  - id: "001"                            # zero-padded unique ID
    title: "Task title"
    description: "What to implement"
    status: "pending"                    # pending | in_progress | done | blocked | fatal
    files:
      create: ["path/to/new.ts"]
      modify: ["path/to/existing.ts"]
    acceptance:
      - "Criterion 1"
      - "Typecheck passes"
    notes: ""                            # populated during build

qa:
  agent: ["All tests pass"]              # agent-verifiable checks
  human: ["UI looks correct"]            # human-verifiable checks
```

Task statuses: `pending` → `in_progress` → `done`. Exceptional: `blocked` (env issue, user fixes) or `fatal` (plan is wrong, return to What/How).

### prd.md

Stored at `.dev/<feature>/prd.md`.

Sections: Overview, Goals, Research Summary (optional), Prototype Learnings (optional), User Stories with acceptance criteria, Non-Goals, Technical Considerations, QA Criteria (agent + human split), Success Metrics, Open Questions (must be empty before proceeding to How). Full template at `skills/what/references/prd-schema.md`.

### progress.md

Stored at `.dev/<feature>/progress.md`.

Append-only log with two sections:
- **Codebase Patterns** (top, consolidated) — reusable patterns read by every `dev/build` invocation for that feature
- **Task Entries** (appended per task) — what was done, learnings, files changed

### systems.yml

```yaml
version: 1
generated: "2026-04-02"
scope: "."

systems:
  - id: "001"
    domain: "project-hooks"
    aliases: [".claude/hooks", "hooks"]
    target: ".claude/hooks"
    spec: "specs/project-hooks.md"
    status: "pending"            # pending | in_progress | done | blocked | split | skipped
    action: "create"             # create | update
    code:
      - ".claude/settings.json"
      - ".claude/hooks/"
    rationale: "Project hook runtime and stop-doc-check flow"
    notes: ""

covered:
  - domain: "dev-workflow"
    spec: "specs/dev-workflow.md"
    code: ["plugins/dev/"]
    rationale: "Already documented"
```

`systems:` is the actionable reverse backlog. `covered:` is informational only and should not be looped over.

### specs/<domain>.md

Sections: Overview (purpose, goals, non-goals), Architecture, Data Model, Interfaces, Design Decisions, Testing, Open Questions. Scaled by domain size (lightweight/medium/heavyweight). Full template at `skills/specs/references/spec-schema.md`.

## 4. Interfaces

### User-Facing Skills

Skills are composable building blocks. Commands orchestrate when to call them; direct invocation remains possible when the user wants lower-level control.

- **`dev/what [idea|feature]`** — focused planning skill. Produces or revises `.dev/<feature>/prd.md` from research, conversations, and existing context prepared by the caller.
- **`dev/how [feature]`** — consumes `.dev/<feature>/prd.md`, produces `.dev/<feature>/tasks.yml`, and requires an explicit feature name when more than one candidate PRD exists.
- **`dev/build [feature]`** — asks `worktree-manager` whether the current checkout is safe for build, then picks the next pending task from `.dev/<feature>/tasks.yml`, implements it, runs quality checks + code review, and commits. It requires an explicit feature name when more than one buildable feature exists.
- **`dev/systems [scope]`** — surveys a repo or subtree, identifies durable domains worth reverse-speccing, and writes `specs/systems.yml`.
- **`dev/specs [domain]`** — standalone spec writer. Reads code, writes `specs/<domain>.md`, updates index. Called by commands such as `done` and `reverse`, also usable independently.

### User-Facing Commands

All commands use `disable-model-invocation: true` and act as orchestration entry points.

- **`/dev:plan <idea>`** — blank-slate planner. Resolves a fresh feature slug, checks that `.dev/<feature>/` is not already in use, asks `worktree-manager` about planning safety, then invokes `dev/what`.
- **`/dev:iterate <feature>`** — planning revision pass. Resolves an existing `.dev/<feature>/prd.md`, loads existing PRD plus any fatal-task notes, asks `worktree-manager` about planning safety, then invokes `dev/what` to revise the plan in place.
- **`/dev:done <feature>`** — asks `worktree-manager` to resolve the finish context, verifies all tasks done, invokes `dev/specs`, spawns `spec-reviewer` (post-build mode), then asks `worktree-manager` to remove only `.dev/<feature>/`, squash merge, and clean up checkout state.
- **`/dev:reverse <target>`** — resolves `target` as either a `systems.yml` item (`id`, `domain`, alias) or a loose freeform scope, then scopes target, runs survey/deep dives, invokes `dev/specs`, consolidates scattered docs into spec (deleting absorbed internal content), spawns `spec-reviewer` (reverse mode), fixes divergences until aligned, and updates backlog status if running from `systems.yml`.

### Agent Interfaces

- **`spec-reviewer`** — receives: root path, domain spec list, mode (post-build/reverse), and PRD path in post-build mode. Returns: ALIGNED or DIVERGED with citations.
- **`worktree-manager`** — receives: mode (`assess`, `prepare-isolated-checkout`, or `finish-feature`) plus feature/checkout context. Returns: checkout assessment, isolation result, or finish summary depending on mode.

## 5. Design Decisions

- **Decision**: Context isolation between phases — each phase gets only committed artifacts, not conversation history.
  **Rationale**: Claude Code invocations have finite context windows. Artifacts as the sole handoff mechanism forces completeness in documentation and prevents knowledge loss.

- **Decision**: Transient state is feature-scoped under `.dev/<feature>/`, not a singleton `.dev/` workspace.
  **Rationale**: Multiple ideas can be planned concurrently on trunk or in shared branches without clobbering each other or forcing one worktree per idea.

- **Decision**: `dev/how`, `dev/build`, `/dev:iterate`, and `/dev:done` must require explicit feature selection when more than one candidate exists.
  **Rationale**: Ambiguity is dangerous once multiple feature directories coexist. Failing closed is safer than mutating the wrong plan.

- **Decision**: Skills are reusable building blocks; commands are the orchestration layer.
  **Rationale**: This keeps skills small and composable while moving branching workflow logic — such as blank-slate planning vs revising an existing PRD — into explicit command entry points.

- **Decision**: Planning (`dev/what`, `dev/how`) can happen on trunk; `worktree-manager` decides whether the current checkout is safe enough for planning, build, or finish.
  **Rationale**: Research and task decomposition benefit from low-friction iteration, but checkout safety is contextual. Centralizing that judgement in one agent prevents duplicated, drifting git logic across prompts.

- **Decision**: User drives phase transitions manually (wave 1).
  **Rationale**: Avoids complex orchestration before the core workflow is proven. The user's manual loop also provides natural checkpoints for course correction.

- **Decision**: Reverse-spec work gets its own backlog artifact (`specs/systems.yml`) instead of overloading `specs/README.md`.
  **Rationale**: `specs/README.md` is the index of completed persistent knowledge; a queue of possible future specs is a different concern and needs status tracking.

- **Decision**: `fatal` status returns to What/How instead of hacking around plan issues.
  **Rationale**: The plan is the product. A bad plan patched downstream creates fragile features. Fixing upstream is cheaper than debugging downstream.

- **Decision**: Learning tests are mandatory for black-box dependencies.
  **Rationale**: Docs lie, flags get removed, APIs drift. Execution is the only reliable verification for dependencies whose source cannot be inspected.

- **Decision**: Specs organized by stable system domain, not by feature or chronology.
  **Rationale**: Features are transient; domains are enduring. Domain-organized specs accumulate knowledge without fragmentation.

- **Decision**: `dev/specs` is a standalone skill decoupled from the dev flow.
  **Rationale**: Specs need to be writable outside the What/How/Build cycle — after refactors, for existing undocumented code, or for manual updates.

- **Decision**: `/dev:reverse` supports both backlog-driven and freeform target modes.
  **Rationale**: Some repos benefit from a full reverse backlog; others only need a one-off inspection of a narrow seam or vendored dependency.

- **Decision**: Agents (`spec-reviewer`, `worktree-manager`) handle specialist concerns instead of inlining logic in commands and skills.
  **Rationale**: Separation of concerns — workflow prompts focus on phase logic while `worktree-manager` owns git/worktree state discovery, safety judgement, and checkout mutation. Agents can use cheaper models (sonnet) for well-scoped tasks.

## 6. Testing

No automated test suite. The plugin is pure markdown (skills, commands, agents, reference docs) with no TypeScript runtime code. Verification is behavioral — the workflow is tested by using it on real features. The `spec-reviewer` agent serves as a built-in verification mechanism that checks spec-to-code alignment.

## 7. Open Questions

None.

---

**Knowledge Sources:**
- `plugins/dev/README.md` — high-level overview
- `plugins/dev/CHANGELOG.md` — development history
- `plugins/dev/commands/plan.md` — plan command spec
- `plugins/dev/commands/iterate.md` — iterate command spec
- `plugins/dev/commands/done.md` — done command spec
- `plugins/dev/commands/reverse.md` — reverse command spec
- `plugins/dev/agents/spec-reviewer.md` — reviewer agent definition
- `plugins/dev/agents/worktree-manager.md` — checkout/worktree manager definition
- `plugins/dev/skills/what/SKILL.md` — What phase skill
- `plugins/dev/skills/how/SKILL.md` — How phase skill
- `plugins/dev/skills/build/SKILL.md` — Build phase skill
- `plugins/dev/skills/systems/SKILL.md` — Systems phase skill
- `plugins/dev/skills/specs/SKILL.md` — Specs skill
- `plugins/dev/skills/*/references/*.md` — all reference documents
