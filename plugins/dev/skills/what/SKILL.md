---
description: |
  Define what to build through structured research and experimentation.
  Produces .dev/prd.md. Use at the start of any feature work.
  Triggers on: "what should we build", "let's plan", "new feature",
  "I want to build", "dev/what"
disable-model-invocation: true
argument-hint: [feature idea]
---

# What Are We Building?

Human-heavy, interactive phase. No implementation happens here — only understanding.

**Hard gate**: nothing proceeds to `dev/how` until `.dev/prd.md` is saved and approved.

### Context Isolation

Each phase runs in a fresh context window with no conversation history from previous phases. The **only** handoff between What and How is `.dev/prd.md` plus any artifacts it references. If a discovery, decision, or constraint isn't captured in an artifact file, it doesn't exist for the next phase. Write every insight into a file — never rely on the conversation to carry knowledge forward.

## Conversation Flow

### 1. Check for WIP

Before anything else, check if `.dev/` exists and contains files. If it does, check `.dev/tasks.yml` for any task with `status: fatal` — that indicates a planned recovery back to this phase.

- **Fatal task found**: this is an expected re-entry. Read the fatal task's `notes` to understand what went wrong, then proceed to step 4 (skip worktree creation — you're already in one). Use the existing `.dev/prd.md` as the starting point for revision.
- **No fatal task**: **stop immediately** and tell the user:

> `.dev/` is not empty — there's work-in-progress from a previous run. Either finish the existing feature (`dev/how` or `dev/build`) or clear it (`rm -rf .dev/`) before starting a new one.

List the contents so the user can see what's there. Do not proceed until `.dev/` is empty or absent.

### 2. Read Existing Specs

Before planning anything, check if the project has persistent domain specs.

1. If `specs/README.md` exists, read the index to understand what domains are already documented
2. Identify which specs relate to the feature area — read those specs
3. Note any goals, non-goals, invariants, or design decisions that constrain this feature
4. Feed this context into the PRD — the feature should build on existing architectural knowledge, not contradict it

If no `specs/` directory exists, skip this step. Specs will be created after the feature is built (via `dev/done`).

### 3. Create Worktree

Set up an isolated workspace for this feature.

1. Derive a short, kebab-case branch name from the feature idea (e.g. `dev/priority-filter`)
2. Check for uncommitted changes — if present, **warn the user** but don't block
3. Create the worktree using nushell:

```bash
nu -c 'use ct/git/worktree *; wk add dev/<feature-name>'
```

This creates a sibling worktree, fetches origin, and handles existing branches automatically. All subsequent work (research, learning tests, prototyping, prd.md) happens in this worktree.

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
| **Inspectable package** | npm module in `node_modules`, open-source library | Read exported types, source files, or vendored code. Can explore `node_modules/<pkg>/` or clone the upstream repo to read implementation |
| **Black-box / binary** | CLI tools, closed-source APIs, SaaS endpoints | Cannot inspect — **must** verify through execution (learning tests) |

This classification drives whether you research by reading (step 6) or by running (step 7). For black-box dependencies, reading docs alone is never sufficient — you must execute against the real thing.

### 6. Research (optional, but see note on inspectable deps)

When external dependencies are involved, investigate before planning.

- Read official docs, source code, changelogs
- Use subagents for API research when appropriate
- Document findings in `.dev/research.md`

**For inspectable dependencies** — go beyond docs. These are your highest-confidence sources:

- **npm packages**: read `node_modules/<pkg>/` — exported types, source, `README.md`. The actual type signatures are ground truth, not the website docs.
- **Open-source tools**: if behaviour is unclear, clone or browse the upstream repo. Read the code that implements the feature you depend on.
- **Vendoring**: for complex or critical dependencies, consider vendoring the source into a temp directory so you can search and cross-reference without network lookups.

Research alone is sufficient **only** for inspectable dependencies where you can read the implementation. For black-box dependencies, research informs your learning tests but does not replace them.

See `references/research.md` for the research protocol.

### 7. Learning Tests (mandatory for black-box deps, recommended otherwise)

When unknowns involve black-box tools, CLIs, or APIs — write small executable tests that validate your assumptions before building against them.

**This is the most important technique in this phase.** Plans built on untested assumptions fail at build time. Learning tests fail cheaply.

**Hard rule**: if the dependency is a binary CLI, closed-source API, or anything you cannot read the source of, you **must** write learning tests before proceeding to Refine. Do not add claims about external tool behaviour to the PRD that haven't been verified by execution. Docs lie. Flags get removed. APIs drift. Run the tool and observe what actually happens.

**Autonomy expectation**: don't wait for the user to suggest testing. As soon as research surfaces a dependency you can't inspect, immediately write and run learning tests. This is the agent's responsibility — be proactive, not passive. If you read docs that say a CLI flag exists, write a test that exercises it before recording it as a fact in the PRD.

See `references/learning-tests.md` for the full pattern.

### 8. Prototype (optional)

When the feature involves taste, UX, or architectural decisions that can't be resolved through conversation alone.

Two strategies:

- **Breadth-first**: map the full surface area quickly (multiple rough approaches)
- **Depth-first**: dig deep into one specific aspect

All prototype code is throwaway. It exists to close understanding gaps, not to ship.

### 9. Refine (always runs)

Take everything gathered — research, learning test results, prototype learnings, conversation — and distill into artifacts. The PRD is the primary artifact; it may reference additional files for detail that would bloat the main document.

**Remember: the next phase gets only these files, not this conversation.** Every decision, constraint, discovery, and verified behaviour must be written down. If you discussed something important with the user but didn't write it into an artifact, it's lost.

#### Artifact structure

All artifacts are saved to the `.dev/` directory (create it if it doesn't exist):

- `.dev/prd.md` — always produced. The self-contained specification. References other artifacts where needed.
- `.dev/research.md` — optional. Detailed research findings referenced from PRD's Research Summary.
- `.dev/lt-*.ts`, `.dev/lt-*.sh` — optional. Executable proof of verified behaviour, referenced from PRD.
- Additional reference files in `.dev/` — optional. Interface sketches, diagrams, prototype screenshots, API response samples. Anything the PRD cites that's better as a separate file.

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

Stage and commit the `.dev/` directory so the worktree is clean for `dev/how`:

```
chore: dev/what — [short feature name]
```

Prototype code must already be deleted (see Rules).

## Rules

- Never skip Refine — even trivial features get a short PRD
- Open questions must be resolved before saving — they don't carry forward
- If research or prototyping reveals the feature is fundamentally different from what was imagined, restart the conversation rather than patching
- Prototype code is always deleted before saving prd.md
- Save all artifacts to `.dev/`: `prd.md`, optionally `research.md`, learning tests, and reference files
- **Conversation is not an artifact** — if it was discussed but not written to a file, it doesn't survive to the next phase
- **No unverified black-box claims in the PRD** — every behavioural claim about a binary, CLI, or closed API must be backed by a passing learning test. If you can't run it, you can't plan against it.
- **Leave the git tree clean** — every phase must commit its artifacts before finishing
