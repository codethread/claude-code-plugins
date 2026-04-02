# dev

Phase-based development workflow for Claude Code.

## Phases

| Skill | Purpose | Input | Output |
|---|---|---|---|
| `dev/what` | Define what to build through research and experimentation | idea | `prd.md` |
| `dev/how` | Decompose PRD into ordered tasks | `prd.md` | `tasks.yml` |
| `dev/build` | Implement one task (user loops externally) | `tasks.yml` | commits + updated `tasks.yml` |

## Commands

| Command | Purpose |
|---|---|
| `/dev:done <feature>` | Verify all tasks done, squash merge into trunk, remove worktree |

## Usage

```
dev/what [feature idea]
# ... interactive research, learning tests, prototyping, PRD refinement ...

dev/how
# ... mechanical decomposition into tasks.yml ...

# user runs build in a loop:
while true; do claude --print "dev/build"; done

/dev:done my-feature
# verifies tasks, squash merges, cleans up
```

Artifacts (`prd.md`, `tasks.yml`, `progress.md`) live in `.dev/` on the feature branch and are transient — git history is the permanent record.
