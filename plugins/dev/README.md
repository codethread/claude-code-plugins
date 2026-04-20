# dev

Phase-based development workflow for Claude Code.

## What

- `dev/what` — figure out what to build and write `.dev/<feature>/prd.md`
- `dev/how` — turn a PRD into `.dev/<feature>/tasks.yml`
- `dev/build` — implement one task per invocation
- `dev/systems` — survey a repo and queue reverse-spec work
- `dev/specs` — write or refresh persistent domain specs

## Why

The workflow keeps planning, decomposition, implementation, and reverse-spec work in separate artifacts so each phase can run in a fresh context window.
Multiple planned features can coexist under `.dev/` without forcing an immediate worktree per idea.
`worktree-manager` owns checkout safety and finish cleanup.

## How

Use the slash commands for orchestration:

- `/dev:plan <idea>` — start a new feature plan
- `/dev:iterate <feature>` — revise an existing PRD
- `/dev:done <feature>` — verify, spec, align, squash merge, and clean up
- `/dev:reverse <target>` — reverse-engineer persistent specs from existing code

Direct skill invocation still works when you want lower-level control.
Feature artifacts live in `.dev/<feature>/` and are removed individually when the feature ships or is abandoned.
Reverse backlog planning lives in `specs/systems.yml`; `specs/README.md` remains the index of completed specs.
