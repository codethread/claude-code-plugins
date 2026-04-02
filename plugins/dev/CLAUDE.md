# dev plugin

## Architecture

Three skills and one command implementing a phase-based development workflow:

```
dev/what  →  .dev/prd.md  →  dev/how  →  .dev/tasks.yml  →  dev/build  →  commits  →  /dev:done
```

Skills-only plugin (wave 1) — no hooks, no orchestrator script. The user drives phase transitions manually and loops `dev/build` themselves.

## Commands

### `done` (`/dev:done <feature>`)

Finishes a feature once all tasks are complete:

1. Finds the worktree matching the given feature name (case-insensitive substring match against `dev/<feature>` paths from `git worktree list`)
2. Verifies every task in `.dev/tasks.yml` has `status: done` — stops if any are incomplete
3. Deletes `.dev/` and commits the removal in the worktree
4. Squash merges the feature branch into trunk using the `project` field from `tasks.yml` as the commit message
5. Removes the worktree and deletes the branch

The squash merge keeps feature history contained within a single trunk commit named after the feature.

## Design Principles

- **Automate don't prompt**: if behaviour can be enforced by script or hook, it must not be delegated to prompt. Wave 1 temporarily puts some things in prompts (quality checks, code-review invocation) that will graduate to hooks in wave 2.
- **The plan is the product**: agents can't course-correct mid-build. The plan must be solid or you go back to What/How.
- **Fresh context per task**: each `dev/build` invocation is a clean context window. Memory persists via `tasks.yml`, `progress.md`, and git history.
- **Progressive disclosure**: SKILL.md files are indexes into `references/` — detailed schemas and protocols live there.

## Artifacts

Artifacts are transient planning files committed to the feature branch. Git commits are the permanent record. **Every phase must leave the git tree clean** — artifacts are committed before the phase ends.

| File | Phase | Purpose |
|---|---|---|
| `.dev/prd.md` | What | Product requirements document |
| `.dev/research.md` | What (optional) | Research findings |
| `.dev/tasks.yml` | How | Task decomposition with status tracking |
| `.dev/progress.md` | Build | Append-only learnings log |

The `.dev/` directory is not gitignored — it's committed to the feature branch. `dev/what` will refuse to start if `.dev/` is non-empty (user must clear it or finish the WIP first).

## Future Waves

- **Wave 2**: Quality gate stop hook, `DEVFLOW_STAGE` env var, stage-aware write guard (PreToolUse hook)
- **Wave 3**: `cc-devflow build` loop runner (replaces user's manual while loop), stats.json, structured logging
