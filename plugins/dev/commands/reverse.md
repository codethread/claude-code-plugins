---
description: Write persistent domain specs from existing code, lifting scattered documentation into a single source of truth
argument-hint: <system-id-or-target>
allowed-tools: Bash(bash:*), Read, Glob, Grep, Agent
---

# dev/reverse

Reverse-engineer persistent domain specs from existing code. Unlike `dev/done` (which specs what was just built), this documents code that already exists — possibly code that was never formally specced.

## Arguments

- `TARGET`: $ARGUMENTS — either a system ID/domain from `specs/systems.yml`, or a loose domain name, directory path, or plain-language description of the area to spec (e.g. `001`, `project-hooks`, `the dev plugin`, `auth system`, `plugins/karen`)

## Instructions

### 1. Resolve the Target

If `specs/systems.yml` exists, read it before interpreting `TARGET`. Treat it as the reverse backlog created by `dev/systems`.

Resolution order:

1. Exact `systems[].id` match
2. Exact `systems[].domain` match
3. Exact alias match in `systems[].aliases`
4. Fallback to loose freeform target mode

If `TARGET` resolves to a backlog item:

- Use the item's `target` as the reverse scope
- Treat `domain`, `spec`, `action`, and `code` as planning hints, not as constraints stronger than the code
- Mark the item `in_progress` before substantial reverse work

If no backlog item matches, continue in loose mode. `/dev:reverse` must still support ad hoc reverse-spec work in repos that do not use `dev/systems`.

### 2. Scope the Target

Interpret `TARGET` to identify which code to read. It might be:

- A directory path (`plugins/dev`, `src/auth`)
- A domain name (`task-engine`, `auth-system`)
- A plain-language description (`the dev plugin`, `the build skill`)

If ambiguous, ask the user to clarify. Prefer scoping too narrowly — it is better to produce one tight spec than to bloat context with loosely related code.

If running from a backlog item, prefer the resolved item's `target` over the raw user input once resolution is complete.

### 3. Check Existing Specs

Read `specs/README.md` if it exists. Determine:

- Does a spec already exist for this domain? → you are **updating**
- No existing spec? → you are **creating**
- No `specs/` directory at all? → you are **bootstrapping**

If `specs/systems.yml` exists and you resolved a backlog item, also note the item's current `status` and `action`.

### 4. Wide Survey (Wave 1)

Spawn a single Explore agent to map the landscape: file structure, documentation, entry points, and component boundaries across the codebase. The target may be a single directory or scattered across many — the agent should follow the code wherever it leads.

**Wait for Wave 1 to return before proceeding.** Its output determines what to explore in depth.

### 5. Deep Dives (Wave 2)

Based on what Wave 1 found, spawn **multiple parallel Explore agents** — one per distinct component or area identified. Each agent reads its area thoroughly: types, flows, integration boundaries, error handling, tests, system-level comments.

The number and scope of agents is determined by what Wave 1 discovered.

### 6. Invoke `dev/specs`

With the code and harvested documentation as context, invoke the `dev/specs` skill for each domain identified. The skill provides its own spec template and handles writing `specs/<domain>.md`, updating the index, and committing.

If the target spans multiple domains, write one spec per domain. Ask the user before creating more than two specs in a single invocation.

If a backlog item expected one domain but the reverse work clearly reveals multiple stable domains, stop and update `specs/systems.yml`:

- mark the original item `split`
- add narrower replacement items
- do not force a bloated spec just to satisfy the backlog

### 7. Consolidate Documentation

The spec is now the single source of truth for this domain's internals. **Delete internal documentation that has been absorbed into the spec** from the target area:

- **CLAUDE.md files**: Remove any notes about this domain's architecture, design decisions, or internal workings. Delete the entire file if nothing remains.
- **README.md files**: Remove internal/architectural content that now lives in the spec. **Keep user-facing content** (What/Why/How, usage examples, setup instructions) — READMEs serve users, specs serve maintainers.
- **Agent/skill/command definitions**: These are operational files — do not delete them. But remove any large architectural preambles or design rationale that duplicates what the spec now covers.

**Scoping rules:**
- Only delete content **about the domain being specced**. Notes about other domains or unrelated concerns stay untouched.
- When in doubt, leave it. A missed deletion is harmless; a wrong deletion loses information.
- Commit deletions separately: `docs: consolidate <domain> docs into spec`

### 8. Alignment Check

Spawn the `spec-reviewer` agent in `reverse` mode. Pass it:

- **Root path**: repo root (current working directory)
- **Domain specs**: list of specs created/updated in step 5
- **Mode**: `reverse`

The agent reads the specs and code, then reports **ALIGNED** or **DIVERGED**.

If **diverged**, fix the spec based on the reviewer's citations and re-run the check. Repeat until aligned.

### 9. Update Backlog State

If this run came from `specs/systems.yml`, update the matching item:

- `done` if the spec is aligned
- `blocked` if external issues prevented completion
- `split` if the domain had to be decomposed into narrower backlog items

Update `notes` with short, durable context only if it will help the next reverse pass.

If that file no longer has any actionable `systems[]` items after the update, delete `specs/systems.yml` as cleanup now that the backlog has been fully consumed.

### 10. Report

Summarise:

- Mode used: `systems backlog` or `freeform`
- Domain(s) specced
- Specs created or updated (file paths)
- Documentation consolidated (list files trimmed and what was removed)
- Backlog status changes (if any)
- Alignment verdict
