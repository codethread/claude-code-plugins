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

## Prerequisites

- `.dev/<feature>/tasks.yml` exists — if not, stop and tell the user to run `$DECOMPOSE_SKILL` first
- Current checkout judged safe for build by `$WORKTREE_MANAGER_AGENT`

## Knowledge

### Feature Resolution

Resolve the target feature directory under `.dev/`:

- If the user supplied a name/path, normalize by stripping optional `.dev/` prefix and trailing slash, then match against `.dev/*/` directories containing `tasks.yml`
- If no feature supplied and exactly one `.dev/*/tasks.yml` exists, use it
- If no feature supplied and multiple candidates exist, stop and require explicit selection

### Retry Limits

- **Quality checks**: maximum 3 fix attempts per check type (typecheck, lint, tests). If still failing after 3, mark task `blocked`.
- **Code review**: maximum 3 review cycles. If still getting material feedback after 3, address what you can and note remaining items.

### Code Review Invocation

See `references/build-protocol.md` for invocation pattern, feedback classification, and handling. Key point: `code-review` is a long-running CLI — use an extended timeout.

## Decisions

Entry state: RESOLVE_FEATURE

### RESOLVE_FEATURE

- guard: feature found → ASSESS_SAFETY
- guard: no matching `tasks.yml` → STOP with error: run `$DECOMPOSE_SKILL` first

### ASSESS_SAFETY

- action: ask `$WORKTREE_MANAGER_AGENT` to assess current checkout for build
- guard: safe for build → READ_STATE
- guard: unsafe or noisy → STOP with error: relay reasoning from agent
- note: if user wants isolation, ask `$WORKTREE_MANAGER_AGENT` in `prepare-isolated-checkout` mode

### READ_STATE

- action: read `.dev/<feature>/tasks.yml` and `.dev/<feature>/progress.md` (if exists)
- note: if `progress.md` exists, read the Codebase Patterns section — consolidated learnings from previous iterations
- always → CHECK_REQUIREMENTS

### CHECK_REQUIREMENTS

- action: run each requirement's `check` command from `tasks.yml`
- guard: all pass → PICK_TASK
- guard: any fail → STOP with status `blocked`, report failures

### PICK_TASK

- guard: any task has status `blocked` or `fatal` → STOP with error: report blocking task and its notes
- guard: a task with status `pending` exists → set it to `in_progress`, proceed to IMPLEMENT
- guard: no pending tasks remain → STOP: report all tasks complete

### IMPLEMENT

- action: implement the task (see Procedures)
- guard: implementation succeeds → QUALITY_CHECKS
- guard: task is impossible or plan is wrong → set status `fatal` in `tasks.yml`, explain in notes → STOP

### QUALITY_CHECKS

- action: run typecheck, lint, tests in order (see Procedures)
- guard: all pass → CODE_REVIEW
- guard: still failing after retry limit → set status `blocked`, explain in notes → STOP

### CODE_REVIEW

- action: run code-review (see Knowledge)
- guard: approved or retry limit reached → UPDATE_STATE
- note: if review returns feedback, address and re-run up to retry limit

### UPDATE_STATE

- action: set task `done`, populate notes, append to `progress.md`
- always → COMMIT

### COMMIT

- action: stage all changes in single commit
- always → SIGNAL

### SIGNAL

- terminal state: report which outcome occurred (task complete, all done, blocked, or fatal)

## Procedures

### IMPLEMENT

1. Read nearby code first — follow existing project conventions
2. Only touch files listed in the task's `files` section (create or modify)
3. Meet every acceptance criterion
4. If the task is impossible or the plan is wrong, do not hack around it — transition to fatal

### QUALITY_CHECKS

Run in order. All must pass before proceeding.

1. **Typecheck**: run the project's typecheck command
2. **Lint**: run the project's lint command
3. **Tests**: run the project's test command

If a check fails, fix the issues and re-run. Apply retry limits from Knowledge.

### UPDATE_STATE

1. Set task status to `done` in `.dev/<feature>/tasks.yml`
2. Populate the task's `notes` field with anything the next iteration should know
3. Append to `.dev/<feature>/progress.md` (see `references/build-protocol.md` for format)

### COMMIT

Stage all changes — implementation files plus `.dev/<feature>/tasks.yml` and `.dev/<feature>/progress.md` — in a single commit:

```text
feat: [task-id] - [task title]
```

## Constraints

- Never implement more than one task per invocation
- Never modify files outside the task's `files` list without updating `.dev/<feature>/tasks.yml` first
- Never skip quality checks or code review
- If a task's acceptance criteria conflict with reality, mark `fatal` — don't improvise
- Always read `.dev/<feature>/progress.md`'s Codebase Patterns section before implementing
- Always append learnings after completing a task
- If more than one buildable feature exists, do not guess — require explicit feature selection
- Do not build in a checkout that `$WORKTREE_MANAGER_AGENT` judged unsafe
- Leave the git tree clean — state files and implementation go in the same commit

## Validation

Verify all of the following before reporting success:

- [ ] Exactly one task was implemented (not zero, not more than one)
- [ ] All acceptance criteria for the task are met
- [ ] Typecheck, lint, and tests all pass
- [ ] Code review completed (approved or retry limit documented)
- [ ] Task status is `done` in `.dev/<feature>/tasks.yml` with notes populated
- [ ] `.dev/<feature>/progress.md` has an entry for this task
- [ ] `git status --porcelain` shows a clean tree (single commit made)
