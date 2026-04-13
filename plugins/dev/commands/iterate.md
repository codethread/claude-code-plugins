---
description: Revise an existing feature PRD, typically after a fatal build or when continuing research
argument-hint: <feature-name-or-path>
allowed-tools: Bash(bash:*), Read, Glob, Agent, Skill
disable-model-invocation: true
---

# dev/iterate

Coordinator for revising an existing feature plan.

## Variables

### Inputs

- `FEATURE`: `$ARGUMENTS` — feature name or path such as `priority-filter` or `.dev/priority-filter`

### Commands

- `PLAN_COMMAND`: `/dev:plan`

### Agents

- `WORKTREE_MANAGER_AGENT`: `worktree-manager`

### Skills

- `PLANNING_SKILL`: `dev/what`

## Instructions

### 1. Resolve the Existing Feature

Resolve `FEATURE` against `.dev/*/` directories that contain `prd.md`.

Resolution order:

1. exact `.dev/<feature>/prd.md`
2. exact feature slug
3. unique case-insensitive substring match
4. otherwise stop and require the user to name the feature explicitly

If no matching PRD exists, stop and tell the user to use `$PLAN_COMMAND <idea>` first.

### 2. Load Existing Planning Context

Read `.dev/<feature>/prd.md`.

If `.dev/<feature>/tasks.yml` exists, inspect it for `fatal` tasks.

- If fatal tasks exist, collect their `notes` and use them as revision context.
- If no fatal tasks exist, this command still remains valid — treat it as an intentional PRD revision pass.

### 3. Assess Checkout Safety

Ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for `planning` using the resolved feature.

- If it reports `clean` or `light`, continue.
- If it reports `noisy`, warn the user and continue only if revising the PRD here is unlikely to get mixed into unrelated work.
- If it reports `unsafe`, stop and relay the reasoning.

If the user explicitly wants early isolation, ask `$WORKTREE_MANAGER_AGENT` in `prepare-isolated-checkout` mode rather than embedding git/worktree logic here.

### 4. Invoke the Planning Skill

Invoke `$PLANNING_SKILL` for the resolved feature.

Use the existing PRD and any fatal-task notes as starting context so the skill revises the plan in place rather than treating this as a blank slate.

### 5. Report

Summarise:

- feature slug
- PRD path revised
- whether fatal notes informed the revision
- whether checkout isolation was needed
