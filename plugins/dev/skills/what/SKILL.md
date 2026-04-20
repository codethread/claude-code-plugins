---
description: |
  Define what to build through structured research and experimentation.
  Produces or revises `.dev/<feature>/prd.md`.
  Triggers on: "what should we build", "let's plan", "new feature",
  "I want to build", "dev/what"
argument-hint: [feature idea or existing feature]
---

# What Are We Building?

Human-heavy planning phase. No implementation here — only understanding.

## Variables

- `FEATURE_CONTEXT`: `$ARGUMENTS` — feature idea or existing feature
- `PLAN_COMMAND`: `/dev:plan`
- `ITERATE_COMMAND`: `/dev:iterate`
- `DONE_COMMAND`: `/dev:done`
- `WORKTREE_MANAGER_AGENT`: `worktree-manager`
- `DECOMPOSE_SKILL`: `dev/how`

## Prerequisites

- If this was invoked directly, the conversation determines whether it is a fresh plan or a revision.
- If checkout safety is unclear, ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for planning before writing artifacts.
- `FEATURE_CONTEXT` may be empty or vague; use conversation to elicit the actual feature.

## Knowledge

### Feature Resolution

Resolve features in this order:

1. exact `.dev/<feature>/prd.md`
2. exact feature slug
3. unique case-insensitive substring match
4. otherwise stop and require explicit selection

If the feature directory does not exist yet, create it as needed.

### Context Isolation

Each phase runs in a fresh context window. The next phase only receives `.dev/<feature>/` artifacts, not the conversation. If it is not written to a file, it is lost.

### Hard Gate

Do not proceed to `$DECOMPOSE_SKILL` until `.dev/<feature>/prd.md` exists and has been approved.

### Dependency Inspectability

Classify each external dependency before planning:

| Category | Example | Verification path |
|---|---|---|
| In-repo code | Project modules, workspace packages | Read the source directly |
| Inspectable package | npm module, open-source library | Read exported types, source, or vendored code |
| Black-box / binary | CLI tools, closed-source APIs, SaaS endpoints | Verify through execution |

For black-box dependencies, docs are never enough — write learning tests. Use `references/research.md` for inspectable-dependency research techniques and `references/learning-tests.md` for the learning-test protocol.

### Artifact Layout

All artifacts live under `.dev/<feature>/`:

- `.dev/<feature>/prd.md` — required, self-contained spec
- `.dev/<feature>/research.md` — optional research notes
- `.dev/<feature>/lt-*.ts` / `.dev/<feature>/lt-*.sh` — optional learning tests
- other reference files as needed

`prd.md` must stay self-contained. Use `references/prd-schema.md` for the full section template and field rules.

### Planning Safety

What and How may happen on trunk or another branch. Do not require a worktree just to plan; orchestration normally belongs to `$PLAN_COMMAND` or `$ITERATE_COMMAND`.

## Procedures

1. Resolve or reuse a short kebab-case feature slug and use `.dev/<feature>/` for all artifacts.
2. Read `specs/README.md` if it exists, then read the relevant persistent specs for the feature area.
3. Understand the feature with the user: problem, audience, success, constraints, and non-goals.
4. Surface unknowns, especially external APIs, sparse docs, black-box behaviour, and taste decisions.
5. Research inspectable dependencies using `references/research.md`; for black-box dependencies, immediately write and run learning tests using `references/learning-tests.md`.
6. Prototype only when needed to resolve taste, UX, or architectural questions.
7. Refine everything into files under `.dev/<feature>/`, following `references/prd-schema.md` for the PRD structure.
8. Commit only this feature's planning artifacts.

## Constraints

- Never skip refinement, even for trivial features.
- Open questions must be resolved before saving `prd.md`.
- Prototype code must be deleted before saving.
- Do not rely on conversation history as handoff material.
- No unverified black-box claims in the PRD.
- Leave the git tree clean by committing the planning artifacts before finishing.

## Validation

- `.dev/<feature>/prd.md` exists and has no open questions
- All black-box claims are backed by passing learning tests
- No prototype code remains
- All artifacts are under `.dev/<feature>/`
- `git status --porcelain` is clean after the commit
- The PRD is understandable without this conversation
