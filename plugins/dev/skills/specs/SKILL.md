---
description: |
  Write or update persistent domain specs from existing code.
  Reads implementation, produces specs/<domain>.md and updates specs/README.md index.
  Triggers on: "dev/specs", "write spec", "update specs", "spec this"
argument-hint: [domain or area to spec]
---

# Specs

Writes persistent domain specifications from code reality. Specs describe stable system domains — not features, not chronological tasks. They survive implementation cycles and accumulate architectural knowledge over time.

This skill is **general purpose** — invocable standalone or called by command flows such as `/dev:done`.

## Variables

### Inputs

- `TARGET_DOMAIN`: `$ARGUMENTS` — optional domain or area to spec

### Commands

- `DONE_COMMAND`: `/dev:done`

## Prerequisites

- Target domain or area identified — either explicitly provided or derived from caller context
- Code for the domain exists and is readable

## Knowledge

### Core Principle

**Specs describe intent informed by reality.** Code is truth, but specs capture the _why_ and _boundaries_ that code alone cannot express. Read the code first, then articulate the design it embodies — plus goals, non-goals, and invariants that aren't visible in the implementation.

### Domain Naming

A domain is a **stable system boundary** — not a feature, not a task, not a ticket.

Good domain names:

- `auth-system` — enduring, covers auth as a concept
- `task-engine` — a subsystem with stable interfaces
- `data-pipeline` — an architectural seam

Bad domain names:

- `add-priority-filter` — that's a feature, not a domain
- `spec-003` — chronological numbering fragments knowledge
- `phase-2-redesign` — tied to a moment in time

If the user provides a feature name, identify which domain(s) it belongs to.

### Spec Sizing

See `references/spec-schema.md` § "Template Scaling" for lightweight/medium/heavyweight guidance. Every spec must have at minimum: Overview with purpose, Goals and Non-Goals, Architecture section, Code location mapping.

### Spec Status

See `references/spec-schema.md` § "Status Values" for the four status levels (Draft, Implemented, Partial, Deprecated). Specs should be honest about current state.

## Decisions

Entry state: IDENTIFY_DOMAIN

### IDENTIFY_DOMAIN

- guard: invoked by `$DONE_COMMAND` with diff context → IDENTIFY_FROM_DIFF
- guard: explicit domain provided → CHECK_EXISTING
- guard: no target provided → STOP with error: specify a domain

### IDENTIFY_FROM_DIFF

- action: read the squash merge diff to understand what changed; identify affected domain(s)
- note: if caller provides `.dev/<feature>/prd.md`, use as intent context — but write spec from code reality, not PRD aspirations
- always → CHECK_EXISTING (for each affected domain)

### CHECK_EXISTING

- guard: `specs/<domain>.md` exists → READ_EXISTING_SPEC (update mode)
- guard: no spec for domain but `specs/` exists → READ_CODE (create mode)
- guard: no `specs/` directory → READ_CODE (bootstrap mode — will create `specs/` and `specs/README.md`)

### READ_EXISTING_SPEC

- action: read `specs/README.md` index and `specs/<domain>.md` in full — note existing goals, non-goals, status, and design rationale that are not recoverable from code alone
- always → READ_CODE

### READ_CODE

- action: read implementation thoroughly (see Procedures)
- always → WRITE_SPEC

### WRITE_SPEC

- action: write or update the spec (see Procedures)
- always → UPDATE_INDEX

### UPDATE_INDEX

- action: update `specs/README.md`
- always → COMMIT

### COMMIT

- terminal state

## Procedures

### READ_CODE

This is the most important step. Read the actual implementation thoroughly:

- Entry points and public interfaces
- Data model / types / schemas
- Key flows and state transitions
- Integration boundaries (what talks to what)
- Error handling patterns
- Test coverage (what's tested tells you what matters)

Do not write a spec from memory or from a PRD alone. The code is the source of truth for _what exists_. The spec adds _why it exists_ and _what its boundaries are_.

### WRITE_SPEC

Use the spec-schema reference. Apply the sizing guidance from Knowledge.

See `references/spec-schema.md` for the template and field rules.

### UPDATE_INDEX

`specs/README.md` is the control plane. Every spec must be registered with:

- Spec file link
- Code location(s)
- One-line purpose

If `specs/README.md` doesn't exist, create it. See `references/spec-schema.md` for the index format.

### COMMIT

Stage and commit spec changes:

```
docs: spec <domain> — [created|updated] [brief reason]
```

## Constraints

- Specs are organized by **stable domain**, never by feature or chronology
- Always read the code before writing — never spec from imagination
- Don't over-spec small things — a 10-line utility doesn't need a spec
- Non-Goals are mandatory — they prevent scope creep across future iterations
- Update `specs/README.md` every time a spec is created or its code location changes
- Numbered sections (## 1. Overview, ## 2. Architecture) enable precise citation

## Validation

Verify all of the following before reporting success:

- [ ] `specs/<domain>.md` exists with at minimum: Overview, Goals, Non-Goals, Architecture, Code locations
- [ ] Spec content reflects actual code — not imagination, not outdated PRD claims
- [ ] `specs/README.md` index includes an entry for this spec
- [ ] Domain name follows stable naming conventions (not feature/chronology-based)
- [ ] `git status --porcelain` shows a clean tree (spec committed)
