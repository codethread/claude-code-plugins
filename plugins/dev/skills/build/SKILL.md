---
description: |
  Implement the next pending task from a feature plan.
  One task per invocation — user loops externally.
  Triggers on: "dev/build", "build next task", "implement next"
argument-hint: [feature-name-or-path]
---

# Build

Implements exactly one task per invocation. The user runs this in a loop externally — each call gets a fresh context window.

## Variables

### Inputs

- `FEATURE`: `$ARGUMENTS` — optional feature name or path

### Agents

- `WORKTREE_MANAGER_AGENT`: `worktree-manager`

### Skills

- `PLANNING_SKILL`: `dev/what`
- `DECOMPOSE_SKILL`: `dev/how`

## Protocol

### 1. Resolve the Feature

Resolve the target feature directory under `.dev/`.

- If the user supplied a feature name or path, first normalize it by stripping an optional `.dev/` prefix and trailing slash, then match it against `.dev/*/` directories that contain `tasks.yml`.
- If no feature was supplied and exactly one `.dev/*/tasks.yml` exists, use that feature.
- If no feature was supplied and multiple candidates exist, stop and require the user to name the feature explicitly.

If no matching `.dev/<feature>/tasks.yml` exists, stop and tell the user to run `$DECOMPOSE_SKILL <feature>` first.

### 2. Assess Build Safety via `$WORKTREE_MANAGER_AGENT`

Before implementing anything, ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for **build** using the resolved feature.

Use its report as the source of truth for checkout safety:

- If it reports the checkout is safe for build, continue.
- If it reports the checkout is noisy or unsafe for build, stop and relay the reasoning clearly.
- If the user wants help creating or switching to an isolated branch/worktree, ask `$WORKTREE_MANAGER_AGENT` in `prepare-isolated-checkout` mode rather than embedding git/worktree logic here.

Do not build in a checkout that `$WORKTREE_MANAGER_AGENT` judged unsafe.

### 3. Read State

Read `.dev/<feature>/tasks.yml` and `.dev/<feature>/progress.md` (if it exists).

If `.dev/<feature>/progress.md` exists, read the **Codebase Patterns** section at the top — these are consolidated learnings from previous iterations for this feature.

### 4. Check Requirements

Run each requirement's `check` command from `.dev/<feature>/tasks.yml`. If any fail, report the failures and stop — status: `blocked`.

### 5. Pick Task

First, check if any task has `status: blocked` or `status: fatal`. If so, stop immediately — report the blocking task and its notes. The user must resolve it before the loop continues.

Then select the first task with `status: pending`. If no pending tasks remain, report completion and stop.

Update the task's status to `in_progress` in `.dev/<feature>/tasks.yml`.

### 6. Implement

Implement the task according to its description, respecting:

- Only touch files listed in the task's `files` section (create or modify)
- Meet every acceptance criterion
- Follow existing project conventions (read nearby code first)

If you discover the task is impossible or the plan is wrong, do not hack around it. Set status to `fatal` in `.dev/<feature>/tasks.yml`, explain why in the task's `notes`, and stop. The user must go back to `$PLANNING_SKILL <feature>` or `$DECOMPOSE_SKILL <feature>` to fix the plan.

### 7. Quality Checks

Run these in order. All must pass before proceeding.

1. **Typecheck**: run the project's typecheck command
2. **Lint**: run the project's lint command
3. **Tests**: run the project's test command

If checks fail, fix the issues. Maximum 3 attempts per check type — if still failing after 3 attempts, set status to `blocked`, explain in notes, and stop.

### 8. Code Review

Run `code-review` with a prompt describing what was implemented and why:

```bash
code-review "Implemented [task title] for <feature>: [brief description of what was done and the intent behind it, referencing task ID from tasks.yml]"
```

`code-review` is a long-running CLI — use an extended timeout.

If review returns actionable feedback, address it and re-run. Maximum 3 review cycles — if still getting material feedback, address what you can and note remaining items.

See `references/build-protocol.md` for the full code review integration.

### 9. Update State

1. Set task status to `done` in `.dev/<feature>/tasks.yml`
2. Populate the task's `notes` field with anything the next iteration should know
3. Append to `.dev/<feature>/progress.md` (see `references/build-protocol.md` for format)

### 10. Commit

Stage all changes for this iteration — implementation files plus `.dev/<feature>/tasks.yml` and `.dev/<feature>/progress.md` — in a single commit:

```text
feat: [task-id] - [task title]
```

The tree must be clean after this step.

### 11. Signal Result

End your response with a clear signal:

- **Task complete**: state which feature/task was finished and what's next in the queue
- **All tasks done**: all tasks for this feature have `status: done`
- **Blocked**: environmental issue described, user must fix before re-running
- **Fatal**: plan is wrong, must revisit `$PLANNING_SKILL <feature>` or `$DECOMPOSE_SKILL <feature>`

## Rules

- Never implement more than one task per invocation
- Never modify files outside the task's `files` list without updating `.dev/<feature>/tasks.yml` first
- Never skip quality checks or code review
- If a task's acceptance criteria conflict with reality, mark `fatal` — don't improvise
- Always read `.dev/<feature>/progress.md`'s Codebase Patterns section before implementing
- Always append learnings after completing a task
- If more than one buildable feature exists, do not guess — require explicit feature selection when ambiguity remains
- Leave the git tree clean — state files and implementation go in the same commit
