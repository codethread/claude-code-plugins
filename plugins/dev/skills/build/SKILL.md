---
description: |
  Implement the next pending task from tasks.yml.
  One task per invocation — user loops externally.
  Triggers on: "dev/build", "build next task", "implement next"
disable-model-invocation: true
---

# Build

Implements exactly ONE task per invocation. The user runs this in a loop externally — each call gets a fresh context window.

## Protocol

### 1. Read State

Read `tasks.yml` and `progress.md` (if it exists) from the project root.

If `tasks.yml` doesn't exist, stop and tell the user to run `dev/how` first.

If `progress.md` exists, read the **Codebase Patterns** section at the top — these are consolidated learnings from previous iterations.

### 2. Check Requirements

Run each requirement's `check` command from `tasks.yml`. If any fail, report the failures and stop — status: `blocked`.

### 3. Pick Task

First, check if any task has `status: blocked` or `status: fatal`. If so, **stop immediately** — report the blocking task and its notes. The user must resolve it before the loop continues.

Then select the first task with `status: pending`. If no pending tasks remain, report completion and stop.

Update the task's status to `in_progress` in `tasks.yml`.

### 4. Implement

Implement the task according to its description, respecting:

- Only touch files listed in the task's `files` section (create or modify)
- Meet every acceptance criterion
- Follow existing project conventions (read nearby code first)

If you discover the task is impossible or the plan is wrong, do not hack around it. Set status to `fatal` in `tasks.yml`, explain why in the task's `notes`, and stop. The user must go back to `dev/what` or `dev/how` to fix the plan.

### 5. Quality Checks

Run these in order. All must pass before proceeding.

1. **Typecheck**: run the project's typecheck command
2. **Lint**: run the project's lint command
3. **Tests**: run the project's test command

If checks fail, fix the issues. Maximum 3 attempts per check type — if still failing after 3 attempts, set status to `blocked`, explain in notes, and stop.

### 6. Code Review

Run `code-review` with a prompt describing what was implemented and why:

```bash
code-review "Implemented [task title]: [brief description of what was done and the intent behind it, referencing task ID from tasks.yml]"
```

`code-review` is a long-running CLI — use an extended timeout.

If review returns actionable feedback, address it and re-run. Maximum 3 review cycles — if still getting material feedback, address what you can and note remaining items.

See `references/build-protocol.md` for the full code review integration.

### 7. Commit

Stage and commit with format:

```
feat: [task-id] - [task title]
```

### 8. Update State

1. Set task status to `done` in `tasks.yml`
2. Populate the task's `notes` field with anything the next iteration should know
3. Append to `progress.md` (see `references/build-protocol.md` for format)

### 9. Signal Result

End your response with a clear signal:

- **Task complete**: state which task was finished and what's next in the queue
- **All tasks done**: all tasks have `status: done`
- **Blocked**: environmental issue described, user must fix before re-running
- **Fatal**: plan is wrong, must revisit `dev/what` or `dev/how`

## Rules

- Never implement more than one task per invocation
- Never modify files outside the task's `files` list without updating `tasks.yml` first
- Never skip quality checks or code review
- If a task's acceptance criteria conflict with reality, mark `fatal` — don't improvise
- Always read progress.md's Codebase Patterns section before implementing
- Always append learnings after completing a task
