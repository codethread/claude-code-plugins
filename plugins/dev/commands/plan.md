---
description: Plan a new feature from a blank slate and produce `.dev/<feature>/prd.md`
argument-hint: <feature idea>
allowed-tools: Bash(bash:*), Read, Glob, Agent, Skill
disable-model-invocation: true
---

# dev/plan

Coordinator for new-feature planning.

## Variables

### Inputs

- `FEATURE_IDEA`: `$ARGUMENTS` — a new feature idea to plan from scratch

### Commands

- `ITERATE_COMMAND`: `/dev:iterate`

### Agents

- `WORKTREE_MANAGER_AGENT`: `worktree-manager`

### Skills

- `PLANNING_SKILL`: `dev/what`

## Instructions

### 1. Derive the Feature Slug

Derive a short, kebab-case feature slug from `$FEATURE_IDEA`.

### 2. Ensure This Is a Blank-Slate Plan

Check whether `.dev/<feature>/` already exists and contains files.

- If it does not exist, continue.
- If it exists and already has a `prd.md`, stop and tell the user:

> `.dev/<feature>/` already exists. Use `$ITERATE_COMMAND <feature>` to revise that feature, or choose a different feature name.

- If it exists but is empty, continue.

Other `.dev/<other-feature>/` directories do not block this command.

### 3. Assess Checkout Safety

Ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for `planning` using the derived feature slug.

- If it reports `clean` or `light`, continue.
- If it reports `noisy`, warn the user and continue only if the planning artifacts are unlikely to get mixed into unrelated work.
- If it reports `unsafe`, stop and relay the reasoning.

If the user explicitly wants early isolation, ask `$WORKTREE_MANAGER_AGENT` in `prepare-isolated-checkout` mode rather than embedding git/worktree logic here.

### 4. Invoke the Planning Skill

Invoke `$PLANNING_SKILL` with `$FEATURE_IDEA`.

`$PLANNING_SKILL` should now focus only on understanding the feature, researching unknowns, refining artifacts, and producing `.dev/<feature>/prd.md`.

### 5. Report

Summarise:

- feature slug
- PRD path
- whether checkout isolation was needed
