---
description: |
  Survey a codebase and produce a reverse-spec backlog in specs/systems.yml.
  Use when you want a queue of stable system domains to reverse-engineer over time.
  Triggers on: "dev/systems", "what systems should we spec", "plan reverse specs"
disable-model-invocation: true
argument-hint: [repo root, subtree, or area to survey]
---

# What Systems Exist?

Consumes a repo or subtree, produces `specs/systems.yml`. This is the reverse-engineering planning phase: identify stable system domains worth speccing, then let the human run `/dev:reverse` on each item over time.

## Process

### 1. Scope the Survey

Interpret the argument as the survey scope. Default to the repo root if none is provided.

Valid scopes:

- repo root (`.`)
- subtree (`plugins/`, `src/auth/`)
- plain-language area (`the plugin layer`, `the build system`)

Prefer stable architectural seams. Do not generate backlog items for one-off files, tiny utilities, or transient feature work.

### 2. Check Existing Specs

Read `specs/README.md` if it exists. Determine which domains are already covered.

For each discovered system, classify it:

- **covered** — existing spec is already the right domain boundary
- **update** — spec exists but likely needs a refresh
- **candidate** — no spec yet, worth reverse-engineering
- **fold** — too small; should be absorbed into a neighboring domain
- **skip** — not worth a spec

### 3. Run a Wide Survey

Spawn a single Explore agent to map the scoped area:

- directories and packages
- entry points and integration seams
- shared libraries and infrastructure
- existing docs that imply architectural boundaries

Wait for this survey before deciding the backlog shape.

### 4. Normalize into Stable Domains

Convert the survey into candidate system domains. A backlog item should represent a stable boundary that could survive multiple rounds of work.

Good:

- `auth-system`
- `plugin-marketplace`
- `project-hooks`
- `shared-lib`

Bad:

- `fix-readme-copy`
- `spec-003`
- `add-hooks-docs`

If one area clearly contains multiple durable subsystems, split them now. If a candidate is too small to justify its own spec, mark it `fold` and name the neighboring domain it belongs to.

### 5. Define Reverse Targets

For each actionable item, write the exact target that `/dev:reverse` should consume later. Reuse the most natural form:

- domain name
- directory path
- plain-language target

Each actionable item must be independently runnable in a future `/dev:reverse` invocation.

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
- Use `target` values that `/dev:reverse` can consume directly

### 8. Commit the Plan

Stage and commit the backlog so the tree is clean for future reverse work:

```
docs: dev/systems — [short scope]
```

## Rules

- `specs/systems.yml` is a reverse backlog, not a second spec index
- Favor fewer, durable domains over many narrow backlog items
- Do not create backlog items for tiny or obvious code that does not need a spec
- If a domain already exists in `specs/README.md`, prefer `update` over creating a duplicate
- If the survey reveals too much uncertainty to define good boundaries, narrow the scope rather than guessing
- Leave the git tree clean — commit `specs/systems.yml` before finishing
