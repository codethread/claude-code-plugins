---
description: Verify all tasks complete, write specs, check alignment, squash merge feature branch into trunk, and remove the worktree
argument-hint: <feature-name-or-path>
allowed-tools: Bash(bash:*), Read, Glob, Agent, Skill
---

# dev/done

Coordinator that finishes a feature by orchestrating verification, spec writing, alignment review, and merge.

## Arguments

- `FEATURE`: $ARGUMENTS — feature name, partial path, or full worktree path (e.g. `claude-smoke`, `dev/claude-smoke`)

## Instructions

### 1. Resolve Worktree

Run from the current repo root:

```bash
git worktree list --porcelain
```

Match `FEATURE` against the listed paths using case-insensitive substring matching. If no match or multiple ambiguous matches, report the full list and stop.

Extract:
- `WORKTREE_PATH` — absolute path to the matched worktree
- `WORKTREE_BRANCH` — branch name (e.g. `dev/claude-smoke`)

Do not match the main worktree (the one with no branch, or `(bare)`).

Determine trunk:

```bash
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
```

If that returns nothing, check `git branch --list main master` and use whichever exists.

### 2. Verify All Tasks Done

Read `<WORKTREE_PATH>/.dev/tasks.yml`.

Check every entry in `tasks[].status`. If any task has a status other than `done`, stop with:

> Cannot finish: N task(s) not done:
> - 001 "Task title" (in_progress)
> - 003 "Task title" (blocked)

Extract the `project` field — this becomes the squash merge commit message.

### 3. Write Specs

All steps in this phase run **inside the worktree** (`cd <WORKTREE_PATH>` before starting).

Invoke the `dev/specs` skill to write or update persistent domain specs from what was built.

1. Review what changed on this branch:

```bash
cd <WORKTREE_PATH> && git diff --stat <TRUNK>...HEAD
```

The triple-dot (`...`) compares from the merge-base, so only branch-introduced changes are shown.

2. Use the changed files and implementation to identify which domain(s) were affected
3. For each domain, invoke `dev/specs` — it reads the code in the worktree and writes `specs/<domain>.md`
4. The PRD at `<WORKTREE_PATH>/.dev/prd.md` provides intent context — but specs are written from code reality

Commit spec changes in the worktree before proceeding.

### 4. Alignment Check

Spawn the `spec-reviewer` agent in `post-build` mode. Pass it:

- **Root path**: `<WORKTREE_PATH>`
- **Domain specs**: list of specs created/updated in step 3

The agent reads the PRD, specs, and code (following code locations from the specs), then reports either **ALIGNED** or **DIVERGED** with specific citations.

If **aligned**, proceed to step 5.

If **diverged**, report the divergences and **stop**. Do not merge. The user decides how to handle the divergence.

### 5. Merge and Clean Up

Spawn the `worktree-merger` agent. Pass it:

- **WORKTREE_PATH**: `<WORKTREE_PATH>`
- **WORKTREE_BRANCH**: `<WORKTREE_BRANCH>`
- **TRUNK**: `<TRUNK>`
- **COMMIT_MESSAGE**: the `project` field from tasks.yml

The agent removes `.dev/`, squash merges into trunk, and cleans up the worktree and branch.

### 6. Report

Summarise:
- Feature name (from `project` field)
- Specs created/updated (list domain names)
- Commit hash on trunk
- Branch and worktree removed
