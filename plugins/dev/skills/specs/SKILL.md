---
description: |
  Write or update persistent domain specs from existing code.
  Reads implementation, produces specs/<domain>.md and updates specs/README.md index.
  Triggers on: "dev/specs", "write spec", "update specs", "spec this"
argument-hint: [domain or area to spec]
---

# Specs

Writes persistent domain specifications from code reality. Specs describe stable system domains — not features, not chronological tasks. They survive implementation cycles and accumulate architectural knowledge over time.

This skill is **general purpose** — it can be invoked standalone to spec any part of a codebase, or called by a command flow such as `/dev:done` as part of a larger workflow.

## Variables

### Inputs

- `TARGET_DOMAIN`: `$ARGUMENTS` — optional domain or area to spec

### Commands

- `DONE_COMMAND`: `/dev:done`

## Core Principle

**Specs describe intent informed by reality.** Code is truth, but specs capture the _why_ and _boundaries_ that code alone cannot express. When writing a spec, read the code first, then articulate the design it embodies — plus goals, non-goals, and invariants that aren't visible in the implementation.

## Process

### 1. Identify the Domain

Determine what domain this spec covers. A domain is a **stable system boundary** — not a feature, not a task, not a ticket.

Good domain names:

- `auth-system` — enduring, covers auth as a concept
- `task-engine` — a subsystem with stable interfaces
- `data-pipeline` — an architectural seam

Bad domain names:

- `add-priority-filter` — that's a feature, not a domain
- `spec-003` — chronological numbering fragments knowledge
- `phase-2-redesign` — tied to a moment in time

If the user provides a feature name, identify which domain(s) it belongs to.

### 2. Check Existing Specs

Read `specs/README.md` if it exists. Determine whether:

- **Existing spec** — this domain already has a spec → you're updating it
- **New spec** — no spec for this domain → you're creating one
- **No specs/ directory** — first spec in the project → bootstrap the structure

### 3. Read the Code

This is the most important step. Read the actual implementation thoroughly:

- Entry points and public interfaces
- Data model / types / schemas
- Key flows and state transitions
- Integration boundaries (what talks to what)
- Error handling patterns
- Test coverage (what's tested tells you what matters)

Do not write a spec from memory or from a PRD alone. The code is the source of truth for _what exists_. The spec adds _why it exists_ and _what its boundaries are_.

### 4. Write the Spec

Use the spec-schema reference (loaded with this skill). Scale the spec to the domain:

- **Lightweight** (small subsystem, <50 lines): overview, architecture sketch, interfaces, non-goals
- **Medium** (moderate subsystem): full template, concrete types/schemas, design decisions
- **Heavyweight** (large domain, security/data implications): full template plus security section, failure modes, rollout notes

Every spec must have at minimum:

- Overview with purpose statement
- Goals and Non-Goals
- Architecture section
- Code location mapping

### 5. Update the Index

`specs/README.md` is the control plane. Every spec must be registered here with:

- Spec file link
- Code location(s)
- One-line purpose

If `specs/README.md` doesn't exist, create it. See the spec-schema reference for the index format.

### 6. Commit

Stage and commit spec changes:

```
docs: spec <domain> — [created|updated] [brief reason]
```

## When Invoked by `$DONE_COMMAND`

When called as part of the done flow, you receive context about what was built (the squash merge diff). In this mode:

1. Read the diff to understand what changed
2. Identify which domain(s) are affected
3. For each domain: read existing spec (if any), read the code, write/update the spec
4. If a caller provides feature planning context (for example `.dev/<feature>/prd.md`), use it as intent context — but write the spec from code reality, not PRD aspirations

## Rules

- Specs are organized by **stable domain**, never by feature or chronology
- Always read the code before writing — never spec from imagination
- Keep specs honest: if something is partially implemented, say so (use Status metadata)
- Don't over-spec small things — a 10-line utility doesn't need a spec
- Non-Goals are mandatory — they prevent scope creep across future iterations
- Update `specs/README.md` every time a spec is created or its code location changes
- Numbered sections (## 1. Overview, ## 2. Architecture) enable precise citation from implementation plans
