---
description: Revise an existing feature PRD, typically after a fatal build or when continuing research
argument-hint: <feature-name-or-path>
allowed-tools: Bash(bash:*), Read, Glob, Agent, Skill
disable-model-invocation: true
---

# dev/iterate

Coordinator for revising an existing feature plan.

## Variables

- `FEATURE`: `$ARGUMENTS` — feature name or path such as `priority-filter` or `.dev/priority-filter`
- `PLAN_COMMAND`: `/dev:plan`
- `WORKTREE_MANAGER_AGENT`: `worktree-manager`
- `PLANNING_SKILL`: `dev/what`

## Instructions

1. Resolve `FEATURE` using the feature-resolution rules from `dev/what`.
2. If no matching PRD exists, stop and tell the user to use `$PLAN_COMMAND <idea>` first.
3. Read `.dev/<feature>/prd.md`.
4. If `.dev/<feature>/tasks.yml` exists, inspect it for `fatal` tasks and collect their `notes` for revision context. If there are no fatal tasks, this is still a valid PRD revision pass.
5. Ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for `planning`, using the resolved feature as context.
   - If the agent says `clean` or `light`, continue.
   - If it says `noisy`, warn the user and continue only if revising the PRD here is unlikely to mix with unrelated work.
   - If it says `unsafe`, stop and relay the reason.
6. If the user explicitly wants early isolation, ask `$WORKTREE_MANAGER_AGENT` in `prepare-isolated-checkout` mode instead of embedding git or worktree logic here.
7. Invoke `$PLANNING_SKILL` for the resolved feature, using the existing PRD and any fatal-task notes as starting context so the skill revises the plan in place.
8. Report the feature slug, revised PRD path, whether fatal notes informed the revision, and whether checkout isolation was needed.
