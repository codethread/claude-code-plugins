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

### 3. Wide Survey (parallel)

Start broad before going deep. Launch parallel exploration agents to survey the full landscape of the target area simultaneously:

- **File tree**: Glob the target directory for all files — build a mental map of the structure
- **Documentation scan**: Read all `README.md`, `CLAUDE.md`, agent definitions, skill definitions, command definitions, and reference docs in the target area in parallel
- **Entry points**: Identify public interfaces, exports, and main files

The goal is a complete birds-eye view before reading any implementation detail. Every doc and structural file should be loaded in this step.

### 4. Deep Dive (parallel per component)

With the landscape mapped, read the implementation in parallel per component/subsystem:

- Data model / types / schemas
- Key flows and state transitions
- Integration boundaries (what talks to what)
- Error handling patterns
- Test coverage (what's tested tells you what matters)
- Large inline comments that describe system-level design (not function-level jsdoc)

Maximise use of parallel agent spawns — each independent subsystem or file cluster can be read concurrently.

### 5. Invoke `dev/specs`

With the code and harvested documentation as context, write the spec following the `dev/specs` skill:

1. Identify the domain name (stable system boundary, not a feature)
2. Write `specs/<domain>.md` using the template in `references/spec-schema.md`
3. Update `specs/README.md` index
4. Commit with: `docs: spec <domain> — created from existing code`

If the target spans multiple domains, write one spec per domain. Ask the user before creating more than two specs in a single invocation.

### 6. Consolidate Documentation

The spec is now the single source of truth for this domain's internals. **Delete internal documentation that has been absorbed into the spec** from the target area:

- **CLAUDE.md files**: Remove any notes about this domain's architecture, design decisions, or internal workings. Delete the entire file if nothing remains.
- **README.md files**: Remove internal/architectural content that now lives in the spec. **Keep user-facing content** (What/Why/How, usage examples, setup instructions) — READMEs serve users, specs serve maintainers.
- **Agent/skill/command definitions**: These are operational files — do not delete them. But remove any large architectural preambles or design rationale that duplicates what the spec now covers.

**Scoping rules:**
- Only delete content **about the domain being specced**. Notes about other domains or unrelated concerns stay untouched.
- When in doubt, leave it. A missed deletion is harmless; a wrong deletion loses information.
- Commit deletions separately: `docs: consolidate <domain> docs into spec`

### 7. Alignment Check

Spawn the `spec-reviewer` agent in `reverse` mode. Pass it:

- **Root path**: repo root (current working directory)
- **Domain specs**: list of specs created/updated in step 5
- **Mode**: `reverse`

The agent reads the specs and code, then reports **ALIGNED** or **DIVERGED**.

If **diverged**, fix the spec based on the reviewer's citations and re-run the check. Repeat until aligned.

### 8. Report

Summarise:

- Domain(s) specced
- Specs created or updated (file paths)
- Documentation consolidated (list files trimmed and what was removed)
- Alignment verdict
