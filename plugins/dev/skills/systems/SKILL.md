---
description: |
  Survey a codebase and produce a reverse-spec backlog in `specs/systems.yml`.
  Use when you want a queue of stable system domains to reverse-engineer over time.
  Triggers on: "dev/systems", "what systems should we spec", "plan reverse specs"
argument-hint: [repo root, subtree, or area to survey]
---

# What Systems Exist?

Survey code and produce `specs/systems.yml`: a reverse backlog of durable system domains worth spec'ing later.

## Variables

- `SURVEY_SCOPE`: `$ARGUMENTS` — repo root, subtree, or plain-language area to survey
- `REVERSE_COMMAND`: `/dev:reverse`

## Prerequisites

- The survey scope exists and is accessible.
- If `specs/README.md` exists, read it first.

## Knowledge

### Valid Survey Scopes

Use `.` for the repo root, a subtree such as `plugins/`, or a plain-language area such as `the build system`.

### Domain Classification

- `covered` — already documented by an existing spec
- `update` — existing spec likely needs a refresh
- `candidate` — no spec yet, worth reverse-engineering
- `fold` — too small; absorb into a neighboring domain
- `skip` — not worth a spec

### Backlog vs Index

`specs/systems.yml` is the reverse backlog. `specs/README.md` remains the index of completed specs. Use `references/systems-schema.md` for the exact YAML shape, status values, and queue rules.

## Workflow

1. Read `specs/README.md` if it exists and classify already-documented areas as `covered`.
2. Run a wide survey of the requested scope to map directories, entry points, shared libraries, and docs.
3. Normalize discoveries into stable domains and split or fold them when the boundary is clear.
4. Define a concrete `$REVERSE_COMMAND` target for each actionable item.
5. Present the queue to the user before saving.
6. Write `specs/systems.yml` with only actionable `candidate` and `update` items in `systems:` and existing specs in `covered:`.
7. Commit the backlog.

## Constraints

- Favor fewer durable domains over many narrow items.
- Do not create backlog items for tiny or obvious code.
- If a domain already exists in `specs/README.md`, prefer `update` over duplication.
- If the survey is too uncertain, narrow the scope instead of guessing.
- Leave the git tree clean after the commit.

## Validation

- `specs/systems.yml` follows `references/systems-schema.md`
- Every actionable item has a consumable `target`
- No trivial code is queued for reverse work
- Existing specs are in `covered:`
- IDs are zero-padded and unique
- The user approved the queue before saving
- `git status --porcelain` is clean
