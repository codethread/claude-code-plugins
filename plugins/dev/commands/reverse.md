---
description: Write persistent domain specs from existing code, lifting scattered documentation into a single source of truth
argument-hint: <domain-or-area-to-spec>
allowed-tools: Bash(bash:*), Read, Glob, Grep, Agent
---

# dev/reverse

Reverse-engineer persistent domain specs from existing code. Unlike `dev/done` (which specs what was just built), this documents code that already exists — possibly code that was never formally specced.

## Arguments

- `TARGET`: $ARGUMENTS — domain name, directory path, or plain-language description of the area to spec (e.g. `the dev plugin`, `auth system`, `plugins/karen`)

## Instructions

### 1. Scope the Target

Interpret `TARGET` to identify which code to read. It might be:

- A directory path (`plugins/dev`, `src/auth`)
- A domain name (`task-engine`, `auth-system`)
- A plain-language description (`the dev plugin`, `the build skill`)

If ambiguous, ask the user to clarify. Prefer scoping too narrowly — it is better to produce one tight spec than to bloat context with loosely related code.

### 2. Check Existing Specs

Read `specs/README.md` if it exists. Determine:

- Does a spec already exist for this domain? → you are **updating**
- No existing spec? → you are **creating**
- No `specs/` directory at all? → you are **bootstrapping**

### 3. Read the Code

Read the implementation thoroughly:

- Entry points and public interfaces
- Data model / types / schemas
- Key flows and state transitions
- Integration boundaries (what talks to what)
- Error handling patterns
- Test coverage (what's tested tells you what matters)

### 4. Harvest Documentation

Scan for documentation scattered across the target area:

- `README.md` files
- `CLAUDE.md` files
- Agent definitions (`.md` files in `agents/`)
- Skill definitions (`SKILL.md` files)
- Command definitions (`.md` files in `commands/`)
- Large inline comments that describe system-level design (not just function-level jsdoc)
- Reference documents (e.g. `references/*.md`)

These are **inputs to the spec**, not replacements for it. The spec becomes the single source of truth — consolidating what is currently fragmented across multiple files and formats. Document in the spec where knowledge was sourced from so the original files can later be trimmed if desired.

### 5. Invoke `dev/specs`

With the code and harvested documentation as context, write the spec following the `dev/specs` skill:

1. Identify the domain name (stable system boundary, not a feature)
2. Write `specs/<domain>.md` using the template in `references/spec-schema.md`
3. Update `specs/README.md` index
4. Commit with: `docs: spec <domain> — created from existing code`

If the target spans multiple domains, write one spec per domain. Ask the user before creating more than two specs in a single invocation.

### 6. Alignment Check

Spawn the `spec-reviewer` agent in `reverse` mode. Pass it:

- **Root path**: repo root (current working directory)
- **Domain specs**: list of specs created/updated in step 5
- **Mode**: `reverse`

The agent reads the specs and code, then reports **ALIGNED** or **DIVERGED**.

If **diverged**, fix the spec based on the reviewer's citations and re-run the check. Repeat until aligned.

### 7. Report

Summarise:

- Domain(s) specced
- Specs created or updated (file paths)
- Documentation sources harvested (list files that contributed knowledge)
- Alignment verdict
