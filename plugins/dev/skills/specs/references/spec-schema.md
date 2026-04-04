# Spec Schema

## specs/README.md — The Index

The index is the navigation layer for both humans and agents. It maps domains to specs and specs to code.

### Format

```markdown
# Specifications

Persistent domain specifications. Organized by system area, not feature chronology.

**Rule:** specs describe intent, code describes reality. Always check the codebase before assuming a spec is fully implemented.

## [Category Name]

| Spec | Purpose | Code |
|---|---|---|
| [domain.md](./domain.md) | One-line purpose | `src/domain/` |
| [other.md](./other.md) | One-line purpose | `src/other/`, `src/shared/other-utils.ts` |

## [Another Category]

| Spec | Purpose | Code |
|---|---|---|
| ... | ... | ... |
```

### Index Rules

- Group specs by **system area** (e.g. "Core", "API", "Infrastructure"), not alphabetically
- Code column can list multiple paths — whatever is relevant
- Update the index every time a spec is created, renamed, or its code location changes
- If a spec is deprecated, move it to a "Deprecated" section rather than deleting

## Domain Spec — Template

```markdown
# <Domain> Specification

**Status:** Draft | Implemented | Partial | Deprecated
**Last Updated:** YYYY-MM-DD

## 1. Overview

### Purpose

What this system does and why it exists. One paragraph.

### Goals

- Goal 1
- Goal 2

### Non-Goals

- Explicitly not doing X because Y
- Out of scope: Z

## 2. Architecture

How the system is structured. Include:

- Component relationships
- Data flow direction
- Key abstractions

Code references use relative paths from repo root.

## 3. Data Model

Core types, schemas, or entities. Use actual type signatures or schema definitions from the code — not prose descriptions of what the types "should" be.

## 4. Interfaces

Public API surface — what other systems interact with. Include:

- Exported functions/classes
- API endpoints
- Event contracts
- CLI commands

## 5. Design Decisions

Decisions that aren't obvious from reading the code. Each entry:

- **Decision**: what was decided
- **Rationale**: why
- **Alternatives considered**: what was rejected (optional, only if non-obvious)

## 6. Testing

What's tested and how. Not a test plan — a description of the testing approach and coverage boundaries.

## 7. Open Questions

Unresolved design questions. Empty if the system is well-understood.
```

### Template Scaling

Not every section is needed for every spec. Scale to the domain:

**Lightweight** (small subsystem):
- Sections 1, 2, 4 only
- Skip Data Model if types are self-documenting
- Skip Design Decisions if there are none

**Medium** (moderate subsystem):
- All sections
- Types and interfaces are concrete (actual code)

**Heavyweight** (large domain):
- All sections, plus additional sections as needed:
  - Security Considerations
  - Failure Modes / Error Handling
  - Migration / Rollout Notes
  - Performance Characteristics

### Status Values

- **Draft** — initial write-up, may not reflect code accurately yet
- **Implemented** — spec matches the code
- **Partial** — some sections implemented, others are planned
- **Deprecated** — system is being replaced or removed

## Naming Conventions

Spec files: `<domain>.md` in kebab-case.

Good: `auth-system.md`, `task-engine.md`, `notification-pipeline.md`
Bad: `spec-001.md`, `add-auth-feature.md`, `v2-redesign.md`

The name should survive multiple waves of work on the same domain.
