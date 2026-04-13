---
description: |
  Decompose a feature PRD into an ordered task list.
  Mechanical phase — pure agent.
  Triggers on: "dev/how", "decompose", "break this down", "create tasks"
argument-hint: [feature-name-or-path]
---

# Workflow

Produce `.dev/<feature>/tasks.yml` from `.dev/<feature>/prd.md`. This is a pure agent workflow, but it is blocked until the prerequisites below are satisfied.

## Variables

### Inputs

- `FEATURE`: `$ARGUMENTS` — optional feature name or path

### Skills

- `PLANNING_SKILL`: `dev/what`
- `BUILD_SKILL`: `dev/build`

## Process

### 1. Resolve the Feature

Resolve the target feature directory under `.dev/`.

- If the user supplied a feature name or path, first normalize it by stripping an optional `.dev/` prefix and trailing slash, then match it against `.dev/*/` directories that contain `prd.md`.
- If no feature was supplied and exactly one `.dev/*/prd.md` exists, use that feature.
- If no feature was supplied and multiple candidates exist, stop and require the user to name the feature explicitly.

If no matching `.dev/<feature>/prd.md` exists, stop and tell the user to run `$PLANNING_SKILL` for that feature first.

### 2. Prerequisite: PRD Exists

Read `.dev/<feature>/prd.md`.

### 3. Prerequisite: Open Questions Resolved

The PRD's Open Questions section must be empty. If it isn't, stop and resolve them with the user before proceeding.

### 4. Decompose into Tasks

Break the PRD's user stories into implementation tasks. Each task must be:

- **Self-contained**: has everything needed to implement (description, files, criteria)
- **One context window**: completable in a single `$BUILD_SKILL <feature>` invocation
- **Verifiable**: acceptance criteria are specific and testable
- **File-aware**: lists files that will be created or modified

### 5. Size Tasks

Rules of thumb — a task is too big if:

- It touches more than 3-4 files
- It has more than 5 acceptance criteria
- It requires understanding the output of a previous task that hasn't been built yet
- You can't describe what "done" looks like in 2-3 sentences

**Right-sized examples:**

- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

**Too big:**

- "Build the entire dashboard"
- "Add authentication"
- "Refactor the API layer"

### 6. Order Tasks

Dependencies first:

1. Schema / data model changes
2. Backend / business logic
3. UI components
4. Integration / aggregation
5. Polish / edge cases

If task B reads from a table that task A creates, A comes first.

### 7. Define System Requirements

List everything that must be true before `$BUILD_SKILL <feature>` starts (for example database running, env vars set). Each requirement must include a `check` command that verifies it.

### 8. Define QA Criteria

Pull criteria from the PRD's QA section. Split them into:

- `agent`: checks the build agent runs after each task
- `human`: checks requiring human judgement (deferred to end)

### 9. Save `tasks.yml`

Save the plan to `.dev/<feature>/tasks.yml`. See `references/tasks-schema.md` for the format.

### 10. Commit Plan

Stage and commit only this feature's plan so other `.dev/*/` directories are untouched:

```text
chore: dev/how — [short feature name]
```

## Rules

- Do not proceed unless both prerequisites are satisfied
- Every task must have acceptance criteria — no exceptions
- Always include `Typecheck passes` in each task's criteria
- Task order must respect dependencies — never reference files that don't exist yet
- The `prd` field must point to `.dev/<feature>/prd.md`
- If decomposition reveals the PRD is incomplete or contradictory, stop and send the user back to `$PLANNING_SKILL <feature>` rather than guessing
- If multiple feature PRDs exist, do not guess — require explicit feature selection when ambiguity remains
- Leave the git tree clean — commit this feature's `tasks.yml` before finishing
