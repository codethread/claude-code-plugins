---
description: Verify all tasks complete, squash merge feature branch into trunk, and remove the worktree
argument-hint: <feature-name-or-path>
allowed-tools: Bash(bash:*), Read, Glob
---

# dev/done

Finish a feature: verify tasks, squash merge into trunk, clean up.

## Arguments

- `FEATURE`: $ARGUMENTS — feature name, partial path, or full worktree path (e.g. `claude-smoke`, `dev/claude-smoke`)

## Instructions

### 1. Find the worktree

Run from the current repo root:

```bash
git worktree list --porcelain
```

Match `FEATURE` against the listed paths using case-insensitive substring matching (e.g. `ClaudeSmoke` should match `dev/claude-smoke`). If no match or multiple ambiguous matches, report the full list and stop.

Extract:
- `WORKTREE_PATH` — absolute path to the matched worktree
- `WORKTREE_BRANCH` — branch name (e.g. `dev/claude-smoke`)

Do not match the main worktree (the one with no branch, or `(bare)`).

### 2. Verify all tasks are done

Read `<WORKTREE_PATH>/.dev/tasks.yml`.

Check every entry in `tasks[].status`. If any task has a status other than `done`, stop with:

> Cannot finish: N task(s) not done:
> - 001 "Task title" (in_progress)
> - 003 "Task title" (blocked)

Do not proceed until all tasks are `done`.

### 3. Get the feature name

Extract the `project` field from `tasks.yml`. This becomes the squash commit message.

### 4. Determine trunk

```bash
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
```

If that returns nothing, check `git branch --list main master` and use whichever exists.

### 5. Delete `.dev/` and commit in the worktree

First, run `git status` in the worktree. If anything other than `.dev/` is modified or untracked, stop and report those files — the worktree must be clean before finishing.

Then remove `.dev/` and commit only that deletion using `git add -u` (stages only tracked file removals, not untracked files):

```bash
cd <WORKTREE_PATH> && rm -rf .dev && git add -u && git commit -m "chore: remove dev artifacts"
```

### 6. Squash merge into trunk

Switch to trunk from the main worktree root, then squash merge:

```bash
git checkout <TRUNK>
git merge --squash <WORKTREE_BRANCH>
git commit -m "<project field from tasks.yml>"
```

### 7. Remove the worktree and branch

```bash
git worktree remove <WORKTREE_PATH>
git branch -D <WORKTREE_BRANCH>
```

### 8. Report

Summarise:
- Feature name (from `project` field)
- Commit hash on trunk
- Branch and worktree removed
