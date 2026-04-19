---
description: |
  Decompose a feature PRD into an ordered task list.
  Mechanical phase — pure agent.
  Triggers on: "dev/how", "decompose", "break this down", "create tasks"
argument-hint: [feature-name-or-path]
---

# How Do We Build It?

Produce `.dev/<feature>/tasks.yml` from `.dev/<feature>/prd.md`. Mechanical decomposition — no research, no conversation, pure planning.

## Variables

### Inputs

- `FEATURE`: `$ARGUMENTS` — optional feature name or path

### Skills

- `PLANNING_SKILL`: `dev/what`
- `BUILD_SKILL`: `dev/build`

## Prerequisites

- `.dev/<feature>/prd.md` exists — if not, stop and tell the user to run `$PLANNING_SKILL` first
- PRD's Open Questions section is empty — if not, stop and resolve them with the user before proceeding

## Knowledge

### Feature Resolution

Resolve the target feature directory under `.dev/`:

- If the user supplied a name/path, normalize by stripping optional `.dev/` prefix and trailing slash, then match against `.dev/*/` directories containing `prd.md`
- If no feature supplied and exactly one `.dev/*/prd.md` exists, use it
- If no feature supplied and multiple candidates exist, stop and require explicit selection

### Task Sizing

See `references/task-planning.md` for sizing rules and right-sized vs too-big examples.

### Task Ordering Convention

See `references/task-planning.md` for the dependency-first ordering convention.

### QA Criteria Split

Pull criteria from the PRD's QA section. Split into:

- `agent`: checks the build agent runs after each task
- `human`: checks requiring human judgement (deferred to end)

## Procedures

### 1. Resolve the Feature

Apply the feature resolution rules from Knowledge.

### 2. Read the PRD

Read `.dev/<feature>/prd.md` in full. This is the sole input — in a fresh context window, the PRD is what loads user stories, QA criteria, open questions, and all planning context. Verify the Open Questions section is empty before proceeding (see Prerequisites).

### 3. Decompose into Tasks

Break the PRD's user stories into implementation tasks. Each task must be:

- **Self-contained**: has everything needed to implement (description, files, criteria)
- **One context window**: completable in a single `$BUILD_SKILL <feature>` invocation
- **Verifiable**: acceptance criteria are specific and testable
- **File-aware**: lists files that will be created or modified

Apply the sizing rules from `references/task-planning.md`.

### 4. Order Tasks

Apply the ordering convention from `references/task-planning.md`. Respect file dependencies — never reference files that don't exist yet.

### 5. Define System Requirements

List everything that must be true before `$BUILD_SKILL <feature>` starts (for example database running, env vars set). Each requirement must include a `check` command that verifies it.

### 6. Define QA Criteria

Apply the QA criteria split from Knowledge.

### 7. Save `tasks.yml`

Save the plan to `.dev/<feature>/tasks.yml`. See `references/tasks-schema.md` for the format.

### 8. Commit Plan

Stage and commit only this feature's plan so other `.dev/*/` directories are untouched:

```text
chore: dev/how — [short feature name]
```

## Constraints

- Do not proceed unless both prerequisites are satisfied
- Every task must have acceptance criteria — no exceptions
- Always include `Typecheck passes` in each task's criteria
- Task order must respect dependencies — never reference files that don't exist yet
- The `prd` field must point to `.dev/<feature>/prd.md`
- If decomposition reveals the PRD is incomplete or contradictory, stop and send the user back to `$PLANNING_SKILL <feature>` rather than guessing
- If multiple feature PRDs exist, do not guess — require explicit feature selection
- Leave the git tree clean — commit this feature's `tasks.yml` before finishing

## Validation

Verify all of the following before reporting success:

- [ ] `.dev/<feature>/tasks.yml` exists and follows the schema in `references/tasks-schema.md`
- [ ] Every task has acceptance criteria including "Typecheck passes"
- [ ] Task dependencies are correctly ordered — no task references files created by a later task
- [ ] System requirements each have a `check` command
- [ ] QA criteria are split into agent and human categories
- [ ] `prd` field points to `.dev/<feature>/prd.md`
- [ ] `git status --porcelain` shows a clean tree (plan committed)
