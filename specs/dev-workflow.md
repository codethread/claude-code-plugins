# Dev Workflow Specification

**Status:** Implemented
**Last Updated:** 2026-04-02

## 1. Overview

### Purpose

Phase-based development workflow plugin for Claude Code. Decomposes feature work into three sequential phases — What (research/planning), How (task decomposition), Build (implementation) — with persistent architectural knowledge captured as domain specs. The user drives phase transitions manually; each phase produces committed artifacts that serve as the sole handoff to the next phase.

### Goals

- Eliminate mid-build course corrections by front-loading research and planning
- Maintain fresh context per task via isolated `dev/build` invocations
- Accumulate architectural knowledge in persistent domain specs that survive across features
- Automate feature completion (spec writing, alignment checking, squash merge) via `/dev:done`
- Enable reverse-engineering specs from existing undocumented code via `/dev:reverse`

### Non-Goals

- No orchestrator script or loop runner (wave 1 — user loops `dev/build` manually)
- No hooks or `DEVFLOW_STAGE` env var enforcement (planned for wave 2)
- Not a project management tool — no cross-feature tracking, no team coordination
- Does not handle multi-repo workflows

## 2. Architecture

Two-layer knowledge model with four skills, two commands, and two agents:

```
specs/  ──read──→  dev/what  →  .dev/prd.md  →  dev/how  →  .dev/tasks.yml  →  dev/build  →  commits
  ↑                                                                                              │
  │                                                                                        /dev:done
  │                                                                                              │
  │                                                                                 dev/specs (write/update)
  │                                                                                              │
  │                                                                                 alignment check
  │                                                                                 (PRD vs specs vs code)
  │                                                                                              │
  │                                                                                 squash merge + cleanup
  │
  └──── /dev:reverse ← existing code + scattered docs → dev/specs → alignment check (reverse)
```

### Component Relationships

**Skills** (user-invoked, each runs in its own context window):

| Skill | Input | Output | Location |
|---|---|---|---|
| `dev/what` | Feature idea + existing `specs/` | `.dev/prd.md` (+ optional research, learning tests) | `plugins/dev/skills/what/SKILL.md` |
| `dev/how` | `.dev/prd.md` | `.dev/tasks.yml` | `plugins/dev/skills/how/SKILL.md` |
| `dev/build` | `.dev/tasks.yml` + `.dev/progress.md` | Commits + updated state files | `plugins/dev/skills/build/SKILL.md` |
| `dev/specs` | Code + optional PRD context | `specs/<domain>.md` + `specs/README.md` | `plugins/dev/skills/specs/SKILL.md` |

**Commands** (slash commands):

| Command | Purpose | Location |
|---|---|---|
| `/dev:done <feature>` | Orchestrate feature completion: verify tasks, write specs, check alignment, squash merge | `plugins/dev/commands/done.md` |
| `/dev:reverse <target>` | Reverse-engineer domain specs from existing code | `plugins/dev/commands/reverse.md` |

**Agents** (spawned by commands, not invoked directly):

| Agent | Role | Tools | Location |
|---|---|---|---|
| `spec-reviewer` | Compare specs against code (+ PRD in post-build mode) | Read, Glob, Grep | `plugins/dev/agents/spec-reviewer.md` |
| `worktree-merger` | Remove `.dev/`, squash merge, clean up worktree + branch | Bash, Read, Glob | `plugins/dev/agents/worktree-merger.md` |

### Knowledge Layers

- **`specs/`** (persistent) — domain specs on trunk, accumulate across features. Organized by stable system domain. Index at `specs/README.md`.
- **`.dev/`** (transient) — feature scratchpad on feature branch. Contains `prd.md`, `tasks.yml`, `progress.md`, research, learning tests. Deleted during squash merge by `worktree-merger`.

### Reference Documents

Skills use progressive disclosure — SKILL.md files are concise, with detailed schemas and protocols in `references/` subdirectories:

| Reference | Parent Skill | Purpose |
|---|---|---|
| `skills/what/references/prd-schema.md` | `dev/what` | PRD template and field rules |
| `skills/what/references/learning-tests.md` | `dev/what` | Learning test protocol for black-box deps |
| `skills/what/references/research.md` | `dev/what` | Research protocol and output format |
| `skills/how/references/tasks-schema.md` | `dev/how` | `tasks.yml` YAML schema and field reference |
| `skills/build/references/build-protocol.md` | `dev/build` | Code review integration and `progress.md` format |
| `skills/specs/references/spec-schema.md` | `dev/specs` | Domain spec template and `specs/README.md` index format |

## 3. Data Model

### tasks.yml

```yaml
project: "project-name"          # squash merge commit message
prd: ".dev/prd.md"               # path to PRD
description: "Brief summary"

requirements:                     # pre-conditions with check commands
  - name: "Database running"
    check: "pg_isready -h localhost"

tasks:
  - id: "001"                    # zero-padded unique ID
    title: "Task title"
    description: "What to implement"
    status: "pending"            # pending | in_progress | done | blocked | fatal
    files:
      create: ["path/to/new.ts"]
      modify: ["path/to/existing.ts"]
    acceptance:
      - "Criterion 1"
      - "Typecheck passes"
    notes: ""                    # populated during build

qa:
  agent: ["All tests pass"]     # agent-verifiable checks
  human: ["UI looks correct"]   # human-verifiable checks
```

Task statuses: `pending` → `in_progress` → `done`. Exceptional: `blocked` (env issue, user fixes) or `fatal` (plan is wrong, return to What/How).

### prd.md

Sections: Overview, Goals, Research Summary (optional), Prototype Learnings (optional), User Stories with acceptance criteria, Non-Goals, Technical Considerations, QA Criteria (agent + human split), Success Metrics, Open Questions (must be empty before proceeding to How). Full template at `skills/what/references/prd-schema.md`.

### progress.md

Append-only log with two sections:
- **Codebase Patterns** (top, consolidated) — reusable patterns read by every `dev/build` invocation
- **Task Entries** (appended per task) — what was done, learnings, files changed

### specs/<domain>.md

Sections: Overview (purpose, goals, non-goals), Architecture, Data Model, Interfaces, Design Decisions, Testing, Open Questions. Scaled by domain size (lightweight/medium/heavyweight). Full template at `skills/specs/references/spec-schema.md`.

## 4. Interfaces

### User-Facing Skills

All skills use `disable-model-invocation: true` — they are prompt-driven, not auto-triggered.

- **`dev/what [idea]`** — starts research/planning phase. Checks for WIP in `.dev/`, reads existing `specs/`, creates worktree, drives interactive research/prototyping, produces `.dev/prd.md`.
- **`dev/how`** — consumes `.dev/prd.md`, produces `.dev/tasks.yml` through interactive task decomposition.
- **`dev/build`** — picks next pending task from `.dev/tasks.yml`, implements it, runs quality checks + code review, commits. One task per invocation.
- **`dev/specs [domain]`** — standalone spec writer. Reads code, writes `specs/<domain>.md`, updates index. Called by `done` and `reverse`, also usable independently.

### User-Facing Commands

- **`/dev:done <feature>`** — resolves worktree from feature name, verifies all tasks done, invokes `dev/specs`, spawns `spec-reviewer` (post-build mode), spawns `worktree-merger`.
- **`/dev:reverse <target>`** — scopes target, reads code + scattered docs, invokes `dev/specs`, spawns `spec-reviewer` (reverse mode), fixes divergences until aligned.

### Agent Interfaces

- **`spec-reviewer`** — receives: root path, domain spec list, mode (post-build/reverse). Returns: ALIGNED or DIVERGED with citations.
- **`worktree-merger`** — receives: worktree path, branch name, trunk name, commit message. Returns: commit hash, cleanup confirmation.

## 5. Design Decisions

- **Decision**: Context isolation between phases — each phase gets only committed artifacts, not conversation history.
  **Rationale**: Claude Code invocations have finite context windows. Artifacts as the sole handoff mechanism forces completeness in documentation and prevents knowledge loss.

- **Decision**: User drives phase transitions manually (wave 1).
  **Rationale**: Avoids complex orchestration before the core workflow is proven. The user's manual loop also provides natural checkpoints for course correction.

- **Decision**: `fatal` status returns to What/How instead of hacking around plan issues.
  **Rationale**: The plan is the product. A bad plan patched downstream creates fragile features. Fixing upstream is cheaper than debugging downstream.

- **Decision**: Learning tests are mandatory for black-box dependencies.
  **Rationale**: Docs lie, flags get removed, APIs drift. Execution is the only reliable verification for dependencies whose source cannot be inspected.

- **Decision**: Specs organized by stable system domain, not by feature or chronology.
  **Rationale**: Features are transient; domains are enduring. Domain-organized specs accumulate knowledge without fragmentation.

- **Decision**: `dev/specs` is a standalone skill decoupled from the dev flow.
  **Rationale**: Specs need to be writable outside the What/How/Build cycle — after refactors, for existing undocumented code, or for manual updates.

- **Decision**: Agents (`spec-reviewer`, `worktree-merger`) handle specialist concerns instead of inlining logic in commands.
  **Rationale**: Separation of concerns — commands coordinate, agents execute. Agents can use cheaper models (sonnet) for well-scoped tasks.

## 6. Testing

No automated test suite. The plugin is pure markdown (skills, commands, agents, reference docs) with no TypeScript runtime code. Verification is behavioral — the workflow is tested by using it on real features. The `spec-reviewer` agent serves as a built-in verification mechanism that checks spec-to-code alignment.

## 7. Open Questions

None — the system is well-understood. Future waves (quality gate hooks, stage env var, loop runner) are documented in CLAUDE.md but are planned extensions, not open design questions.

---

**Knowledge Sources:**
- `plugins/dev/README.md` — high-level overview
- `plugins/dev/CLAUDE.md` — architecture, design principles, future waves
- `plugins/dev/CHANGELOG.md` — development history
- `plugins/dev/commands/done.md` — done command spec
- `plugins/dev/commands/reverse.md` — reverse command spec
- `plugins/dev/agents/spec-reviewer.md` — reviewer agent definition
- `plugins/dev/agents/worktree-merger.md` — merger agent definition
- `plugins/dev/skills/what/SKILL.md` — What phase skill
- `plugins/dev/skills/how/SKILL.md` — How phase skill
- `plugins/dev/skills/build/SKILL.md` — Build phase skill
- `plugins/dev/skills/specs/SKILL.md` — Specs skill
- `plugins/dev/skills/*/references/*.md` — all reference documents
