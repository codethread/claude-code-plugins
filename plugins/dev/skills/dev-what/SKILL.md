---
description: |
  Define what to build through structured research and experimentation.
  Produces prd.md. Use at the start of any feature work.
  Triggers on: "what should we build", "let's plan", "new feature",
  "I want to build", "dev what"
disable-model-invocation: true
argument-hint: [feature idea]
---

# What Are We Building?

Human-heavy, interactive phase. No implementation happens here — only understanding.

**Hard gate**: nothing proceeds to `/dev-how` until `prd.md` is saved and approved.

## Conversation Flow

### 1. Create Worktree

Before anything else, set up an isolated workspace for this feature.

1. Derive a short, kebab-case branch name from the feature idea (e.g. `dev/priority-filter`)
2. Check for uncommitted changes — if present, **warn the user** but don't block
3. Create the worktree using nushell:

```bash
nu -c 'use ct/git/worktree; wk add dev/<feature-name>'
```

This creates a sibling worktree, fetches origin, and handles existing branches automatically. All subsequent work (research, learning tests, prototyping, prd.md) happens in this worktree.

### 2. Understand the Feature

Ask the user what they want to build. Listen for:

- The core problem being solved
- Who it's for
- What success looks like
- Constraints and non-goals

Don't rush this. Ask clarifying questions. Challenge vague requirements.

### 3. Identify Unknowns

Before any planning, surface what you don't know:

- External APIs or CLIs you haven't used
- Libraries with sparse or misleading docs
- Behaviour that can only be verified by running code
- Taste decisions that need human judgement

Be honest about uncertainty. Assume docs are wrong until proven otherwise.

### 4. Research (optional)

When external dependencies are involved, investigate before planning.

- Read official docs, source code, changelogs
- Use subagents for API research when appropriate
- Document findings in `research.md`

See `references/research.md` for the research protocol.

### 5. Learning Tests (optional but strongly recommended)

When unknowns involve black-box tools, CLIs, or APIs — write small executable tests that validate your assumptions before building against them.

**This is the most important technique in this phase.** Plans built on untested assumptions fail at build time. Learning tests fail cheaply.

See `references/learning-tests.md` for the full pattern.

### 6. Prototype (optional)

When the feature involves taste, UX, or architectural decisions that can't be resolved through conversation alone.

Two strategies:

- **Breadth-first**: map the full surface area quickly (multiple rough approaches)
- **Depth-first**: dig deep into one specific aspect

All prototype code is throwaway. It exists to close understanding gaps, not to ship.

### 7. Refine (always runs)

Take everything gathered — research, learning test results, prototype learnings, conversation — and distill into `prd.md`.

Walk through the PRD section by section with the user:

1. Overview and goals
2. Research summary (if applicable)
3. Learning test results (if applicable)
4. Prototype learnings (if applicable)
5. User stories with acceptance criteria
6. Non-goals (explicitly state what this is NOT)
7. Technical considerations
8. QA criteria — split into agent-verifiable and human-verifiable
9. Open questions (must be empty before proceeding to How)

See `references/prd-schema.md` for the output format.

## Rules

- Never skip Refine — even trivial features get a short PRD
- Open questions must be resolved before saving — they don't carry forward
- If research or prototyping reveals the feature is fundamentally different from what was imagined, restart the conversation rather than patching
- Prototype code is always deleted before saving prd.md
- Save artifacts to project root: `prd.md`, optionally `research.md`
