# Dev Workflow Specification

**Status:** Implemented
**Last Updated:** 2026-04-18

## 1. Overview

### Purpose

`dev` is a phase-based development workflow for Claude Code. It separates feature work into planning, decomposition, implementation, and completion artifacts so each phase can run in a fresh context window. It also supports reverse-spec work through a backlog-driven survey flow.

### Goals

- Reduce mid-build course corrections by front-loading research and planning
- Keep each phase’s handoff explicit and file-based
- Allow multiple planned features to coexist under `.dev/`
- Accumulate durable architectural knowledge in `specs/`
- Support both backlog-driven and ad hoc reverse-spec work
- Keep checkout/worktree decisions centralized in `worktree-manager`

### Non-Goals

- No automated workflow loop or orchestrator script
- No environment-variable enforcement for phase gating
- No project-management or cross-repo coordination

## 2. Architecture

`dev` is a set of small skills, slash commands, and two specialist agents. Commands orchestrate; skills do the phase work; agents handle checkout safety and spec alignment.

| Kind | Name | Responsibility | Output |
|---|---|---|---|
| Skill | `dev/what` | Plan or revise a feature PRD | `.dev/<feature>/prd.md` |
| Skill | `dev/how` | Decompose a PRD into tasks | `.dev/<feature>/tasks.yml` |
| Skill | `dev/build` | Implement one task | commits + state files |
| Skill | `dev/systems` | Survey durable domains for reverse work | `specs/systems.yml` |
| Skill | `dev/specs` | Write or refresh persistent specs | `specs/<domain>.md`, `specs/README.md` |
| Command | `/dev:plan` | Blank-slate planning entry point | invokes `dev/what` |
| Command | `/dev:iterate` | Revise an existing PRD | invokes `dev/what` |
| Command | `/dev:done` | Finish, spec, align, and merge | invokes `dev/specs` + agents |
| Command | `/dev:reverse` | Reverse-engineer code into specs | invokes `dev/specs` + agents |
| Agent | `spec-reviewer` | Compare specs with code, and PRD when present | alignment verdict |
| Agent | `worktree-manager` | Assess checkout safety and perform cleanup/merge | checkout report or merge result |

### Artifact Model

- `.dev/<feature>/` is the transient planning namespace for feature work.
- `prd.md` is the self-contained feature definition.
- `tasks.yml` is the implementation plan.
- `progress.md` records build learnings and codebase patterns.
- `specs/README.md` indexes completed persistent specs.
- `specs/systems.yml` is the reverse backlog, not the spec index.

### Resolution Rules

Feature-aware workflows resolve a feature in this order:

1. exact feature path
2. exact feature slug
3. unique case-insensitive substring match
4. implicit selection only when exactly one candidate contains the required artifact
5. otherwise stop and require explicit naming

The required artifact depends on the phase:

- `dev/how` → `prd.md`
- `dev/build` → `tasks.yml`
- `/dev:done` → `tasks.yml` in the checkout resolved by `worktree-manager`

## 3. Interfaces

### User-Facing Skills

- `dev/what [idea|feature]` — produce or revise a PRD from research, conversation, and existing specs
- `dev/how [feature]` — turn a PRD into an ordered task plan
- `dev/build [feature]` — implement the next pending task and commit the state changes
- `dev/systems [scope]` — create a reverse backlog for stable domains
- `dev/specs [domain]` — write or update a persistent domain spec

### User-Facing Commands

- `/dev:plan <idea>` — resolve a new feature slug, check planning safety, then call `dev/what`
- `/dev:iterate <feature>` — load an existing PRD plus fatal-task notes, check planning safety, then call `dev/what`
- `/dev:done <feature>` — verify tasks, write specs, run alignment review, then delegate cleanup and squash merge
- `/dev:reverse <target>` — resolve a backlog item or loose target, then write/update specs and reconcile docs

### Agent Interfaces

- `spec-reviewer` receives the root path, domain spec list, review mode, and optional PRD path
- `worktree-manager` receives purpose/mode plus feature and checkout context, then returns either a checkout assessment or a finish result

## 4. Design Decisions

- **Phase handoff is file-based.** The next phase receives artifacts, not conversation history.
- **Feature state is scoped under `.dev/<feature>/`.** This allows multiple planned features to coexist.
- **Feature selection must fail closed when ambiguous.** The workflow would rather stop than mutate the wrong plan.
- **Commands orchestrate; skills execute.** This keeps workflow branching out of the phase prompts.
- **Planning can happen on trunk.** `worktree-manager` decides whether a checkout is safe enough for the requested purpose.
- **Reverse work uses `specs/systems.yml` as a queue.** `specs/README.md` stays the index of completed knowledge.
- **`dev/specs` is standalone.** Specs can be written outside the normal What/How/Build path.
- **`dev/reverse` supports backlog-driven and freeform targets.**
- **`spec-reviewer` and `worktree-manager` own specialist concerns.** Checkout safety and spec alignment stay out of the generic prompts.

## 5. Testing

There is no automated runtime test suite for the plugin itself. Verification is behavioral: use the workflow on real features, and use `spec-reviewer` to check that specs match the code they describe.

## 6. Open Questions

None.

---

**Knowledge Sources:**
- `plugins/dev/README.md`
- `plugins/dev/CHANGELOG.md`
- `plugins/dev/commands/*.md`
- `plugins/dev/agents/*.md`
- `plugins/dev/skills/*/SKILL.md`
- `plugins/dev/skills/*/references/*.md`
