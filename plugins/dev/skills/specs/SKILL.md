---
description: |
  Write or update persistent domain specs from existing code.
  Updates `specs/<domain>.md` and `specs/README.md`.
  Triggers on: "dev/specs", "write spec", "update specs", "spec this"
argument-hint: [domain or area to spec]
---

# Specs

Write persistent domain specifications from code reality. Specs describe stable system boundaries, not features or tasks.

## Variables

- `TARGET_DOMAIN`: `$ARGUMENTS` — optional domain or area to spec
- `DONE_COMMAND`: `/dev:done`

## Prerequisites

- A target domain or area is identified.
- The code for that domain exists and is readable.

## Knowledge

### Core Principle

Code is the source of truth for what exists; specs capture the why, boundaries, and design decisions that code alone does not explain.

### Domain Naming

Use stable system boundaries, not feature names or chronology.

### Spec Sizing

Follow `references/spec-schema.md` for the lightweight/medium/heavyweight guidance, numbered section template, status values, and index format. Every spec needs at least an overview, goals, non-goals, architecture, and code locations.

### Spec Status

Use the status values from `references/spec-schema.md` and be honest about current implementation state.

## Workflow

1. If invoked by `$DONE_COMMAND`, resolve the changed domain(s) from the diff and use the PRD only as intent context.
2. If a spec already exists, read it and the index before updating.
3. Read the code thoroughly: entry points, types, key flows, integration boundaries, error handling, and tests.
4. Write or update `specs/<domain>.md` using the spec schema.
5. Update `specs/README.md` every time a spec is created or its code location changes.
6. Commit the spec changes.

## Constraints

- Always read the code before writing.
- Do not spec tiny utilities or feature-only names.
- Non-goals are mandatory.
- Specs are organized by stable domain, never chronology.
- Leave the git tree clean after the commit.

## Validation

- `specs/<domain>.md` exists with at least overview, goals, non-goals, architecture, and code locations
- The spec reflects actual code, not imagination or stale PRD claims
- `specs/README.md` includes the entry
- The domain name is stable and appropriate
- `git status --porcelain` is clean
