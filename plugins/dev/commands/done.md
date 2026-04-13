---
description: Verify all tasks complete, write specs, check alignment, then delegate checkout/worktree cleanup and squash merge to worktree-manager
argument-hint: <feature-name-or-path>
allowed-tools: Bash(bash:*), Read, Glob, Agent, Skill
disable-model-invocation: true
---

# dev/done

Coordinator that finishes a feature by orchestrating verification, spec writing, alignment review, and checkout cleanup.

## Variables

### Inputs

- `FEATURE`: `$ARGUMENTS` — feature name, feature path, partial worktree path, or branch hint (for example `claude-smoke`, `.dev/claude-smoke`, `dev/claude-smoke`)

### Agents

- `WORKTREE_MANAGER_AGENT`: `worktree-manager`
- `SPEC_REVIEWER_AGENT`: `spec-reviewer`

### Skills

- `SPECS_SKILL`: `dev/specs`

## Instructions

### 1. Resolve Finish Context via `$WORKTREE_MANAGER_AGENT`

Spawn `$WORKTREE_MANAGER_AGENT` in `assess` mode with:

- **PURPOSE**: `finish`
- **FEATURE_HINT**: `FEATURE`
- **CHECKOUT_PATH**: current working directory

Require the agent to return at least:

- `CHECKOUT_PATH`
- `REPO_ROOT`
- `CURRENT_BRANCH`
- `TRUNK`
- `CHECKOUT_KIND`
- `FEATURE_DIR`
- `TASKS_PATH`
- `PRD_PATH`
- `SAFE_FOR_PURPOSE`

If the agent cannot resolve the feature or reports the finish context is unsafe, stop and report its reasoning.

### 2. Verify All Tasks Done

Read `TASKS_PATH`.

Check every entry in `tasks[].status`. If any task has a status other than `done`, stop with:

> Cannot finish feature `<FEATURE_DIR>`: N task(s) not done:
> - 001 "Task title" (in_progress)
> - 003 "Task title" (blocked)

Extract the `project` field — this becomes the squash merge commit message.

### 3. Write Specs

All steps in this phase run inside `CHECKOUT_PATH`.

Invoke the `$SPECS_SKILL` skill to write or update persistent domain specs from what was built.

1. Review what changed on this branch:

```bash
cd <CHECKOUT_PATH> && git diff --stat <TRUNK>...HEAD
```

The triple-dot (`...`) compares from the merge-base, so only branch-introduced changes are shown.

2. Use the changed files and implementation to identify which domain(s) were affected.
3. For each domain, invoke `$SPECS_SKILL` — it reads the code in the checkout and writes `specs/<domain>.md`.
4. `PRD_PATH` provides intent context, but specs are written from code reality.

Commit spec changes in the feature checkout before proceeding.

### 4. Alignment Check

Spawn the `$SPEC_REVIEWER_AGENT` agent in `post-build` mode. Pass it:

- **Root path**: `<CHECKOUT_PATH>`
- **Domain specs**: list of specs created or updated in step 3
- **Mode**: `post-build`
- **PRD path**: `PRD_PATH`

The agent reads the PRD, specs, and code (following code locations from the specs), then reports either **ALIGNED** or **DIVERGED** with specific citations.

If aligned, proceed to step 5.

If diverged, report the divergences and stop. Do not merge. The user decides how to handle the divergence.

### 5. Finish the Feature via `$WORKTREE_MANAGER_AGENT`

Spawn `$WORKTREE_MANAGER_AGENT` in `finish-feature` mode. Pass it:

- **CHECKOUT_PATH**: `<CHECKOUT_PATH>`
- **FEATURE_DIR**: `<FEATURE_DIR>`
- **COMMIT_MESSAGE**: the `project` field from `tasks.yml`
- **TRUNK**: `<TRUNK>`

The agent removes only `.dev/<FEATURE_DIR>/`, squashes the feature branch into trunk, and cleans up the linked worktree if one exists.

### 6. Report

Summarise:

- Feature name (`FEATURE_DIR` and `project`)
- Specs created or updated (list domain names)
- Commit hash on trunk
- Whether a linked worktree was removed
- Whether the feature branch was removed
- `.dev/<FEATURE_DIR>/` removed
