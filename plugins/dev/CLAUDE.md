# dev plugin

## Architecture

Four skills, two commands, and two agents implementing a phase-based development workflow with persistent architectural knowledge:

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

Two layers of knowledge:
- **`specs/`** — persistent domain specs that survive across features, organized by system domain
- **`.dev/`** — transient scratchpad for the current feature, cleared after merge

Skills-only plugin (wave 1) — no hooks, no orchestrator script. The user drives phase transitions manually and loops `dev/build` themselves.

## Commands

### `done` (`/dev:done <feature>`)

Coordinator that orchestrates feature completion by delegating to specialists:

1. Resolves worktree and trunk from `FEATURE` argument
2. Verifies every task in `.dev/tasks.yml` has `status: done`
3. Invokes `dev/specs` skill to write/update persistent domain specs
4. Spawns `spec-reviewer` agent — stops if PRD/specs/code diverge
5. Spawns `worktree-merger` agent — removes `.dev/`, squash merges, cleans up

The command itself does resolution and verification; all git operations and review are delegated to agents.

### `reverse` (`/dev:reverse <domain-or-area>`)

Reverse-engineers persistent domain specs from existing code. Unlike `done` (which specs what was just built), this documents code that already exists.

1. Scopes the target from the argument (directory, domain name, or description)
2. Checks existing specs in `specs/README.md`
3. Reads implementation code thoroughly
4. Harvests scattered documentation (READMEs, CLAUDE.md, agent/skill/command definitions, inline system-level comments, reference docs) — consolidates into the spec as single source of truth
5. Invokes `dev/specs` skill to write/update `specs/<domain>.md` and index
6. Spawns `spec-reviewer` agent in `reverse` mode — fixes divergences until aligned

## Skills (additional)

### `specs` (`dev/specs`)

Standalone skill for writing persistent domain specs. Decoupled from the dev flow — can be invoked independently to spec any part of a codebase. Reads code, writes `specs/<domain>.md`, updates `specs/README.md` index.

Called by `dev/done` after build, and by `dev/reverse` for existing code. Also usable for:
- Manually updating specs after refactors

## Agents

### `spec-reviewer`

Read-only agent that compares specs against code (and optionally a PRD). Two modes: `post-build` (PRD + specs + code) and `reverse` (specs + code only). Reports ALIGNED or DIVERGED with specific citations. Tools: Read, Glob, Grep.

### `worktree-merger`

Handles the git mechanics of finishing a feature: verifies clean state, deletes `.dev/`, squash merges into trunk, removes worktree and branch. Spawned by `dev/done` after alignment passes. Tools: Bash, Read, Glob.

## Design Principles

- **Automate don't prompt**: if behaviour can be enforced by script or hook, it must not be delegated to prompt. Wave 1 temporarily puts some things in prompts (quality checks, code-review invocation) that will graduate to hooks in wave 2.
- **The plan is the product**: agents can't course-correct mid-build. The plan must be solid or you go back to What/How.
- **Fresh context per task**: each `dev/build` invocation is a clean context window. Memory persists via `tasks.yml`, `progress.md`, and git history.
- **Progressive disclosure**: SKILL.md files are indexes into `references/` — detailed schemas and protocols live there.
- **Double bookkeeping**: say what you'll build (PRD), build it, then check you built what you said. Specs capture the durable outcome; `.dev/` is the scratchpad that gets cleared.

## Artifacts

### Transient (`.dev/`)

Planning files committed to the feature branch, cleared after merge. **Every phase must leave the git tree clean.**

| File | Phase | Purpose |
|---|---|---|
| `.dev/prd.md` | What | Product requirements document |
| `.dev/research.md` | What (optional) | Research findings |
| `.dev/tasks.yml` | How | Task decomposition with status tracking |
| `.dev/progress.md` | Build | Append-only learnings log |

The `.dev/` directory is not gitignored — it's committed to the feature branch. `dev/what` will refuse to start if `.dev/` is non-empty (user must clear it or finish the WIP first).

### Persistent (`specs/`)

Domain specs that live on trunk and accumulate across features.

| File | Purpose |
|---|---|
| `specs/README.md` | Index mapping domain specs to code locations |
| `specs/<domain>.md` | Persistent domain specification |

Specs are organized by **stable system domain**, not by feature or chronology. `dev/what` reads them before planning; `dev/done` writes/updates them after building. See `dev/specs` skill and `references/spec-schema.md` for structure.

## Future Waves

- **Wave 2**: Quality gate stop hook, `DEVFLOW_STAGE` env var, stage-aware write guard (PreToolUse hook)
- **Wave 3**: `cc-devflow build` loop runner (replaces user's manual while loop), stats.json, structured logging
