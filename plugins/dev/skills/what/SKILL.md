---
description: |
  Define what to build through structured research and experimentation.
  Produces or revises .dev/<feature>/prd.md. Usually invoked by
  the plan or iterate command.
  Triggers on: "what should we build", "let's plan", "new feature",
  "I want to build", "dev/what"
argument-hint: [feature idea or existing feature]
---

# What Are We Building?

Human-heavy, interactive phase. No implementation happens here — only understanding.

## Variables

### Inputs

- `FEATURE_CONTEXT`: `$ARGUMENTS` — feature idea or existing feature

### Commands

- `PLAN_COMMAND`: `/dev:plan`
- `ITERATE_COMMAND`: `/dev:iterate`
- `DONE_COMMAND`: `/dev:done`

### Agents

- `WORKTREE_MANAGER_AGENT`: `worktree-manager`

### Skills

- `DECOMPOSE_SKILL`: `dev/how`

**Hard gate**: nothing proceeds to `$DECOMPOSE_SKILL` until `.dev/<feature>/prd.md` is saved and approved.

### Context Isolation

Each phase runs in a fresh context window with no conversation history from previous phases. The only handoff between What and How is the feature artifact directory under `.dev/<feature>/`. If a discovery, decision, or constraint isn't captured in a file there, it doesn't exist for the next phase. Write every insight into a file — never rely on the conversation to carry knowledge forward.

## Workflow

### 1. Resolve the Feature Directory

Derive or reuse a short, kebab-case feature slug (for example `priority-filter`). Use `.dev/<feature>/` as the working directory for all artifacts in this phase.

The caller decides whether this is a fresh plan or an iteration on an existing PRD. Do not own that orchestration here.

- If `.dev/<feature>/prd.md` already exists, treat it as input context to revise.
- If the feature directory is new, create it as needed.
- Other feature directories under `.dev/` do not matter unless the caller says otherwise.

### 2. Read Existing Specs

Before planning anything, check if the project has persistent domain specs.

1. If `specs/README.md` exists, read the index to understand what domains are already documented.
2. Identify which specs relate to the feature area and read them.
3. Note any goals, non-goals, invariants, or design decisions that constrain this feature.
4. Feed this context into the PRD — the feature should build on existing architectural knowledge, not contradict it.

If no `specs/` directory exists, skip this step. Specs will be created after the feature is built (via `$DONE_COMMAND`).

### 3. Checkout Context

What and How are allowed to happen on trunk or any other branch. Do not require a worktree just to plan.

Checkout/worktree orchestration normally belongs to commands such as `$PLAN_COMMAND` or `$ITERATE_COMMAND`. If the caller already assessed checkout safety, trust that context and continue.

If you are invoked directly and checkout safety is unclear, ask `$WORKTREE_MANAGER_AGENT` to assess the current checkout for planning before you write artifacts.

### 4. Understand the Feature

Ask the user what they want to build. Listen for:

- The core problem being solved
- Who it's for
- What success looks like
- Constraints and non-goals

Don't rush this. Ask clarifying questions. Challenge vague requirements.

### 5. Identify Unknowns

Before any planning, surface what you don't know:

- External APIs or CLIs you haven't used
- Libraries with sparse or misleading docs
- Behaviour that can only be verified by running code
- Taste decisions that need human judgement

Be honest about uncertainty. Assume docs are wrong until proven otherwise.

#### Classify Dependencies by Inspectability

For every external dependency, determine how you can verify its behaviour:

| Category | Example | Verification path |
|---|---|---|
| **In-repo code** | Project modules, workspace packages | Read the source directly — truth is in the code |
| **Inspectable package** | npm module in `node_modules`, open-source library | Read exported types, source files, or vendored code |
| **Black-box / binary** | CLI tools, closed-source APIs, SaaS endpoints | Cannot inspect — must verify through execution (learning tests) |

This classification drives whether you research by reading (step 6) or by running (step 7). For black-box dependencies, reading docs alone is never sufficient — you must execute against the real thing.

### 6. Research (optional, but see note on inspectable deps)

When external dependencies are involved, investigate before planning.

- Read official docs, source code, changelogs
- Use subagents for API research when appropriate
- Document findings in `.dev/<feature>/research.md`

**For inspectable dependencies** — go beyond docs. These are your highest-confidence sources:

- **npm packages**: read `node_modules/<pkg>/` — exported types, source, `README.md`. The actual type signatures are ground truth, not the website docs.
- **Open-source tools**: if behaviour is unclear, clone or browse the upstream repo. Read the code that implements the feature you depend on.
- **Vendoring**: for complex or critical dependencies, consider vendoring the source into a temp directory so you can search and cross-reference without network lookups.

Research alone is sufficient only for inspectable dependencies where you can read the implementation. For black-box dependencies, research informs your learning tests but does not replace them.

See `references/research.md` for the research protocol.

### 7. Learning Tests (mandatory for black-box deps, recommended otherwise)

When unknowns involve black-box tools, CLIs, or APIs — write small executable tests that validate your assumptions before building against them.

**This is the most important technique in this phase.** Plans built on untested assumptions fail at build time. Learning tests fail cheaply.

**Hard rule**: if the dependency is a binary CLI, closed-source API, or anything you cannot read the source of, you must write learning tests before proceeding to Refine. Do not add claims about external tool behaviour to the PRD that haven't been verified by execution. Docs lie. Flags get removed. APIs drift. Run the tool and observe what actually happens.

**Autonomy expectation**: don't wait for the user to suggest testing. As soon as research surfaces a dependency you can't inspect, immediately write and run learning tests. This is the agent's responsibility — be proactive, not passive.

See `references/learning-tests.md` for the full pattern.

### 8. Prototype (optional)

When the feature involves taste, UX, or architectural decisions that can't be resolved through conversation alone.

Two strategies:

- **Breadth-first**: map the full surface area quickly (multiple rough approaches)
- **Depth-first**: dig deep into one specific aspect

All prototype code is throwaway. It exists to close understanding gaps, not to ship.

### 9. Refine (always runs)

Take everything gathered — research, learning test results, prototype learnings, conversation — and distill it into artifacts. The PRD is the primary artifact; it may reference additional files for detail that would bloat the main document.

**Remember: the next phase gets only `.dev/<feature>/`, not this conversation.** Every decision, constraint, discovery, and verified behaviour must be written down.

#### Artifact structure

All artifacts are saved under `.dev/<feature>/` (create the directory if it doesn't exist):

- `.dev/<feature>/prd.md` — always produced. The self-contained specification. References other artifacts where needed.
- `.dev/<feature>/research.md` — optional. Detailed research findings referenced from the PRD's Research Summary.
- `.dev/<feature>/lt-*.ts`, `.dev/<feature>/lt-*.sh` — optional. Executable proof of verified behaviour, referenced from the PRD.
- Additional reference files under `.dev/<feature>/` — optional. Interface sketches, diagrams, prototype screenshots, API response samples. Anything the PRD cites that's better as a separate file.

The PRD must be understandable on its own. Reference files provide depth, not missing context.

#### Walkthrough

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

### 10. Commit Artifacts

Stage and commit only this feature's planning artifacts so other `.dev/<other-feature>/` directories are untouched:

```text
chore: dev/what — [short feature name]
```

Prototype code must already be deleted (see Rules).

## Rules

- Never skip Refine — even trivial features get a short PRD
- Open questions must be resolved before saving — they don't carry forward
- If research or prototyping reveals the feature is fundamentally different from what was imagined, restart the conversation rather than patching
- Prototype code is always deleted before saving `prd.md`
- Save all artifacts under `.dev/<feature>/`
- Conversation is not an artifact — if it was discussed but not written to a file, it doesn't survive to the next phase
- No unverified black-box claims in the PRD — every behavioural claim about a binary, CLI, or closed API must be backed by a passing learning test
- Leave the git tree clean — commit this feature's artifacts before finishing
