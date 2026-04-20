---
description: Plan a new feature from a blank slate and produce `.dev/<feature>/prd.md`
argument-hint: <feature idea>
allowed-tools: Bash(bash:*), Read, Glob, Agent, Skill
disable-model-invocation: true
---

# dev/plan

Coordinator for new-feature planning.

## Variables

- `FEATURE_IDEA`: `$ARGUMENTS` — the feature idea to plan
- `ITERATE_COMMAND`: `/dev:iterate`
- `WORKTREE_MANAGER_AGENT`: `worktree-manager`
- `PLANNING_SKILL`: `dev/what`

## Instructions

1. Derive a short kebab-case slug from `FEATURE_IDEA`.
2. Treat this as a blank-slate plan. If `.dev/<feature>/prd.md` already exists, stop and direct the user to `$ITERATE_COMMAND <feature>`.
3. Check whether `.dev/<feature>/` already exists. If it is empty or absent, continue; if it contains other files but no PRD, continue; other feature directories do not block this command.
4. Ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for `planning`, using the derived feature slug as context.
   - If the agent says `clean` or `light`, continue.
   - If it says `noisy`, warn the user and continue only if the planning artifacts are unlikely to mix with unrelated work.
   - If it says `unsafe`, stop and relay the reason.
5. If the user explicitly wants early isolation, ask `$WORKTREE_MANAGER_AGENT` in `prepare-isolated-checkout` mode instead of embedding git or worktree logic here.
6. Invoke `$PLANNING_SKILL` with `FEATURE_IDEA`. The skill handles the research, refinement, and `.dev/<feature>/prd.md` output.
7. Report the feature slug, PRD path, and whether checkout isolation was needed.
