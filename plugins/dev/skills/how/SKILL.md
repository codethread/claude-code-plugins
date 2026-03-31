---
description: |
  Decompose prd.md into an ordered task list (tasks.yml).
  Mechanical phase — human reviews but agent drives.
  Triggers on: "dev/how", "decompose", "break this down", "create tasks"
disable-model-invocation: true
---

# How Are We Building It?

Consumes `.dev/prd.md`, produces `.dev/tasks.yml`. Interactive — the human reviews and adjusts the plan before it's finalised.

## Process

### 1. Read PRD

Read `.dev/prd.md`. If it doesn't exist, tell the user to run `dev/what` first.

### 2. Resolve Open Questions

The PRD's open questions section must be empty. If it's not, resolve them with the user before proceeding.

### 3. Decompose into Tasks

Break user stories into implementation tasks. Each task must be:

- **Self-contained**: has everything needed to implement (description, files, criteria)
- **One context window**: completable in a single `dev/build` invocation
- **Verifiable**: acceptance criteria are specific and testable
- **File-aware**: lists files that will be created or modified

### 4. Size Tasks

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

### 5. Order Tasks

Dependencies first:

1. Schema / data model changes
2. Backend / business logic
3. UI components
4. Integration / aggregation
5. Polish / edge cases

If task B reads from a table that task A creates, A comes first.

### 6. Define System Requirements

Things that must be true before Build starts (e.g. database running, env vars set). Each requirement gets a `check` command that can verify it.

### 7. Define QA Criteria

Pull from the PRD's QA section. Split into:

- `agent`: checks the build agent runs after each task
- `human`: checks requiring human judgement (deferred to end)

### 8. Present Plan

Walk through the full plan with the user:

- System requirements and their check commands
- Each task in order: title, description, files, acceptance criteria
- QA criteria

Get explicit approval before saving.

### 9. Save tasks.yml

Save to `.dev/tasks.yml`. See `references/tasks-schema.md` for the format.

### 10. Commit Plan

Stage and commit `.dev/tasks.yml` so the tree is clean for `dev/build`:

```
chore: dev/how — [short feature name]
```

## Rules

- Every task must have acceptance criteria — no exceptions
- Always include "Typecheck passes" in each task's criteria
- Task order must respect dependencies — never reference files that don't exist yet
- The `prd` field must point to the PRD file used
- If decomposition reveals the PRD is incomplete or contradictory, go back to `dev/what` rather than guessing
- **Leave the git tree clean** — commit `.dev/tasks.yml` before finishing
