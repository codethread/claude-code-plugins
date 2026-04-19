---
description: |
  Survey a codebase and produce a reverse-spec backlog in specs/systems.yml.
  Use when you want a queue of stable system domains to reverse-engineer over time.
  Triggers on: "dev/systems", "what systems should we spec", "plan reverse specs"
argument-hint: [repo root, subtree, or area to survey]
---

# What Systems Exist?

Consumes a repo or subtree, produces `specs/systems.yml`. Planning phase for reverse-engineering: identify stable system domains worth speccing, then let the human run the reverse command on each item over time.

## Variables

### Inputs

- `SURVEY_SCOPE`: `$ARGUMENTS` — optional repo root, subtree, or area to survey (defaults to `.`)

### Commands

- `REVERSE_COMMAND`: `/dev:reverse`

## Prerequisites

- Survey scope exists and is accessible
- If `specs/README.md` exists, it has been read to understand existing coverage

## Knowledge

### Valid Survey Scopes

- Repo root (`.`)
- Subtree (`plugins/`, `src/auth/`)
- Plain-language area (`the plugin layer`, `the build system`)

### Domain Classification

When evaluating discovered systems against existing specs:

| Classification | Meaning |
|---|---|
| **covered** | Existing spec already matches the right domain boundary |
| **update** | Spec exists but likely needs a refresh |
| **candidate** | No spec yet, worth reverse-engineering |
| **fold** | Too small; should be absorbed into a neighboring domain |
| **skip** | Not worth a spec |

### Domain Naming

Good domain names represent stable architectural seams:

- `auth-system` — enduring, covers auth as a concept
- `plugin-marketplace` — a subsystem with stable interfaces
- `project-hooks` — an architectural boundary

Bad domain names are tied to features, chronology, or tasks:

- `fix-readme-copy` — a task, not a domain
- `spec-003` — chronological numbering fragments knowledge
- `add-hooks-docs` — a one-off action

### Backlog vs Index

`specs/systems.yml` is a reverse backlog, not a second spec index. `specs/README.md` is the index of completed persistent knowledge; the backlog tracks _possible future_ specs with status.

## Procedures

### 1. Scope the Survey

Interpret the argument as the survey scope using valid scope types from Knowledge. Default to repo root if none provided.

Prefer stable architectural seams. Do not generate backlog items for one-off files, tiny utilities, or transient feature work.

### 2. Check Existing Specs

Read `specs/README.md` if it exists. Classify each discovered system using the domain classification scheme from Knowledge.

### 3. Run a Wide Survey

Spawn a single Explore agent to map the scoped area:

- directories and packages
- entry points and integration seams
- shared libraries and infrastructure
- existing docs that imply architectural boundaries

Wait for this survey before deciding the backlog shape.

### 4. Normalize into Stable Domains

Convert the survey into candidate system domains using the domain naming guidelines from Knowledge.

If one area clearly contains multiple durable subsystems, split them now. If a candidate is too small to justify its own spec, mark it `fold` and name the neighboring domain it belongs to.

### 5. Define Reverse Targets

For each actionable item, write the exact target that `$REVERSE_COMMAND` should consume later. Reuse the most natural form (domain name, directory path, or plain-language target).

Each item must be independently runnable in a future `$REVERSE_COMMAND` invocation.

### 6. Present the Queue

Walk the user through:

- covered systems
- candidate/update systems that will go into `specs/systems.yml`
- fold/skip decisions

Get explicit approval before saving.

### 7. Save `specs/systems.yml`

Write the backlog to `specs/systems.yml`. See `references/systems-schema.md` for the format.

Guidelines:

- Include only actionable `candidate` and `update` items in `systems:`
- Put already-documented areas in `covered:`
- Keep IDs zero-padded and stable
- Default new actionable items to `pending`
- Use `target` values that `$REVERSE_COMMAND` can consume directly

### 8. Commit the Plan

Stage and commit the backlog:

```
docs: dev/systems — [short scope]
```

## Constraints

- Favor fewer, durable domains over many narrow backlog items
- Do not create backlog items for tiny or obvious code that does not need a spec
- If a domain already exists in `specs/README.md`, prefer `update` over creating a duplicate
- If the survey reveals too much uncertainty to define good boundaries, narrow the scope rather than guessing
- Leave the git tree clean — commit `specs/systems.yml` before finishing

## Validation

Verify all of the following before reporting success:

- [ ] `specs/systems.yml` exists and follows the schema in `references/systems-schema.md`
- [ ] Every actionable item has a target consumable by `$REVERSE_COMMAND`
- [ ] No items for trivial code that doesn't warrant a spec
- [ ] Existing specs are in `covered:`, not duplicated in `systems:`
- [ ] IDs are zero-padded and unique
- [ ] User approved the queue before saving
- [ ] `git status --porcelain` shows a clean tree (backlog committed)
