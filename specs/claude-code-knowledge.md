# Claude Code Knowledge Specification

**Status:** Implemented
**Last Updated:** 2026-04-03

## 1. Overview

### Purpose

Opinionated Claude Code configuration guidance plugin that layers repo-specific conventions on top of the built-in Claude Code Guide subagent. Provides two skills (configuration guidance and behaviour testing), two slash commands (config auditing and hook smoke testing), and one agent (config auditor). The plugin is entirely markdown-driven — no runtime code, no hooks, no scripts.

### Goals

- Provide opinionated rules for hooks, skills, commands, agents, MCPs, and plugins that the official Guide doesn't cover (progressive disclosure, inline-vs-script hooks, no-silent-failures, agent context isolation)
- Maintain curated reference files for prompt design, skill authoring, subagent design, and plugin bootstrapping — kept current with Claude 4.6 model behaviour
- Automated config auditing: discover project config files, compare against conventions, fix in place
- Hook smoke testing: discover, classify, generate, execute, and report on project hook health
- Headless subprocess testing infrastructure for verifying Claude Code behaviour end-to-end

### Non-Goals

- Replacing the Claude Code Guide — this plugin assumes the Guide handles official schema, feature support, and field names
- Caching or mirroring official documentation — removed in v1.2.0 in favour of delegating to the Guide
- Enforcing conventions via hooks — the plugin is advisory (audit command) and educational (skills), not blocking
- Cross-project or global config auditing — audit-config scopes strictly to project-local `.claude/` and plugin directories
- Automated test suite management — smoke tests are ad-hoc verification, not a CI-integrated test framework

## 2. Architecture

### Component Map

```
plugins/claude-code-knowledge/
├── .claude-plugin/plugin.json              # Plugin manifest
├── skills/
│   ├── claude-code-knowledge/              # Main guidance skill
│   │   ├── SKILL.md                        # Opinionated rules + reference routing
│   │   └── references/
│   │       ├── prompt-design.md            # Claude 4.6 prompting patterns
│   │       ├── skill-authoring.md          # SKILL.md structure, progressive disclosure
│   │       ├── subagent-design.md          # Agent isolation, tools, parallelisation
│   │       └── plugin-bootstrapping.md     # SessionStart dependency pattern
│   └── introspection/                      # Testing/verification skill
│       ├── SKILL.md                        # Headless harness overview + rules
│       └── references/
│           ├── headless-test-harness.md    # Subprocess env, flags, output parsing
│           └── smoke-examples.md           # 5 test templates for common hook types
├── commands/
│   ├── audit-config.md                     # Config audit orchestrator
│   └── claude-smoke.md                     # Hook smoke test runner
├── agents/
│   └── knowledge-auditor.md                # Per-concern config auditor (sonnet)
├── README.md
├── CHANGELOG.md
├── package.json
└── tsconfig.json
```

### Progressive Disclosure Architecture

Both skills use a three-layer design that controls token cost:

```
Front matter (description — triggers skill loading)
    ↓
SKILL.md body (rules + reference map — always in context)
    ↓
references/*.md (detailed guidance — loaded on demand)
```

The main skill keeps repo-specific opinions inline (always visible to the model) and delegates detailed patterns to focused reference files. The introspection skill follows the same pattern with testing-specific references.

### Orchestration Patterns

**Audit flow** (`/audit-config`):

```
audit-config command (orchestrator, user-invoked)
  ├─→ claude-code-guide agent (once) → fetch official frontmatter schemas
  └─→ knowledge-auditor agent (×5, sequential)
      ├─→ hooks
      ├─→ skills   ← receives schema
      ├─→ commands  ← receives schema
      ├─→ agents   ← receives schema
      └─→ settings
```

Sequential execution is enforced — auditors may edit shared files (e.g., `settings.json`), so concurrent runs would race.

**Smoke test flow** (`/claude-smoke`):

```
claude-smoke command (7 phases, single session)
  1. DISCOVER  → read .claude/settings.json, settings.local.json, agent frontmatter
  2. CLASSIFY  → live-testable | headless-required | manual
  3. FILTER    → narrow by optional argument
  4. GENERATE  → match against smoke-examples templates, or reason autonomously
  5. EXECUTE   → live tests in-session, headless via claude -p subprocess
  6. REPORT    → summary table with PASS/FAIL/ERROR per hook
  7. CLEANUP   → restore all modified files, delete temp files (non-optional)
```

### Reference Map (Main Skill)

The main skill routes to the smallest matching reference:

| Reference | Triggers on |
|---|---|
| `prompt-design.md` | System prompts, slash commands, agent prompts, hook suggestions, long-context structure |
| `skill-authoring.md` | SKILL.md structure, descriptions, trigger design, examples, progressive disclosure |
| `subagent-design.md` | Agent descriptions, tool scoping, isolation, effort, parallelisation |
| `plugin-bootstrapping.md` | SessionStart dependency installation into `${CLAUDE_PLUGIN_DATA}` |

## 3. Interfaces

### User-Facing Entry Points

| Entry Point | Type | Invocation |
|---|---|---|
| `claude-code-knowledge` | Skill | Mandatory when configuring any Claude Code feature; auto-triggered by model |
| `introspection` | Skill | When building integration tests or verifying Claude Code behaviour |
| `/audit-config` | Command | User-invoked only (`disable-model-invocation: true`) |
| `/claude-smoke` | Command | User or model-invoked; optional `[hook filter]` argument |
| `knowledge-auditor` | Agent | Spawned by audit-config, not invoked directly |

### Plugin Registration

Marketplace entry in `.claude-plugin/marketplace.json`:
```json
{
  "name": "claude-code-knowledge",
  "version": "1.5.0",
  "source": "./plugins/claude-code-knowledge",
  "category": "development-tools"
}
```

### Knowledge Auditor Agent

**Model:** sonnet | **Tools:** Read, Edit, Edit(.claude/**), Write, Glob, Grep, Bash, Skill | **Skills:** claude-code-knowledge

Input: concern area (hooks|skills|commands|agents|settings) + official schema (for skills/commands/agents).
Output: concise summary — files audited, changes made (one line per change), skipped items.

Scope constraints:
- One concern area per invocation
- Project-local only (never `~/.claude/` or global config)
- Preserves behaviour — restructures/reformats, does not change semantics
- Does not create new files (except splitting inline hook → script)

### Headless Test Harness (Introspection)

Core subprocess pattern used by claude-smoke and available for ad-hoc testing:

```bash
claude -p --model claude-haiku-4-5-20251001 --verbose \
  --output-format stream-json --dangerously-skip-permissions \
  --max-turns 5 "prompt"
```

Key environment requirement: strip `CLAUDECODE` from subprocess env (nested Claude Code refuses to run otherwise).

Stream event types: `system:init`, `system:hook_started`/`system:hook_response`, `assistant`, `user`, `result`.

Caveat: only SessionStart and Stop hooks emit stream events. PostToolUse hooks run silently — verify via file state side effects.

### Smoke Test Templates

Five templates in `smoke-examples.md`:

| Template | Hook Event | Verifies |
|---|---|---|
| `formatter` | PostToolUse (Edit/Write) | File reformatted after deliberate bad formatting |
| `linter-clean` | PostToolUse (Edit/Write) | No false positive lint errors on clean edit |
| `linter-violation` | PostToolUse (Edit/Write) | Lint error surfaced for deliberate violation |
| `type-checker-stop` | Stop | Type error reported via headless subprocess |
| `pre-tool-blocker` | PreToolUse | Tool blocked (exit 2) or input modified (exit 0 + JSON) |

## 4. Opinionated Rules (Main Skill)

These rules are kept inline in SKILL.md (always visible) rather than in references:

**Skills:**
- Progressive disclosure: SKILL.md is an index into references, not a monolith
- Keep SKILL.md concise — it loads into context on every trigger
- Repo opinions stay in SKILL.md body; detailed patterns go to references
- Default to `disable-model-invocation: true` unless user directs otherwise
- Omit `name` from frontmatter — inferred from file path
- No XML in frontmatter

**Commands:**
- Omit `name` from frontmatter; rely on file path
- Keep frontmatter minimal

**Hooks:**
- Inline if ~100 chars, else delegate to script
- Scripts: executable bun (TypeScript) with `#!/usr/bin/env bun` shebang
- Place scripts in `hooks/` alongside `hooks.json` with own `package.json`
- Use `@anthropic-ai/claude-agent-sdk` types for hook I/O
- No silent failures: deterministic hooks must exit non-zero with clear error on missing dependency

**Agents:**
- Context-isolated: subagents do not inherit CLAUDE.md, parent skills, or conversation history
- Preload context via `skills` frontmatter
- When tool-restricting via frontmatter, add tool inventory line at top of system prompt: `You have access to exactly these tools: X, Y, Z. No others exist.`

**MCPs:**
- Strongly suggest moving MCP-heavy logic into subagents rather than global context

**Plugins:**
- Use bun/TypeScript for hook scripts
- Runtime dependencies: SessionStart hook installs into `${CLAUDE_PLUGIN_DATA}` via diff-based pattern

## 5. Design Decisions

- **Thin layer on Guide, not replacement**: The built-in Claude Code Guide handles official schema and feature docs. This plugin adds only opinionated conventions that the Guide doesn't cover. This split was established in v1.2.0 when local doc caching was removed.
- **Markdown-only plugin**: No TypeScript hooks, scripts, or runtime code. All functionality is delivered through skills (persistent context), commands (orchestration prompts), and agents (focused subprocesses). This eliminates SessionStart bootstrap complexity and dependency management.
- **Sequential audit execution**: The audit-config orchestrator runs one knowledge-auditor at a time because multiple concern areas may touch the same files (e.g., settings.json). Parallel execution would risk race conditions.
- **Schema pre-fetch in audit flow**: The orchestrator fetches official frontmatter schemas from the Claude Code Guide once and passes them to each auditor. Auditors cannot access the Guide directly (it's an external subagent), so this decouples doc retrieval from auditing.
- **Sonnet for auditor, haiku for smoke tests**: The auditor needs reasoning capability to judge convention compliance and make fixes. Smoke tests use haiku (~$0.01-0.03 per invocation) because the subprocess only needs to perform simple read/edit actions to trigger hooks.
- **Tool inventory lines in agent prompts**: Subagents don't reliably reason from their own frontmatter tool restrictions. Repeating the concrete tool list in the system prompt body is a pragmatic workaround.
- **Smoke test templates over generated tests**: Templates provide consistent, tested patterns for common hook types (formatters, linters, type-checkers, blockers). Autonomous reasoning is the fallback for hooks that don't match any template.
- **No dot-directory test files**: Linters and type-checkers commonly exclude dot-directories. Smoke tests place temp files in known-linted/typed directories to ensure hooks see them.

## 6. Open Questions

- **Auditor coverage of plugin hooks**: The audit flow discovers `.claude/**/hooks.json` but doesn't audit plugin-level `hooks/hooks.json` files. If repo conventions should apply to plugin hooks, the discovery glob needs expanding.
- **Smoke test cost at scale**: Each headless test invocation costs $0.01-0.03. Projects with many Stop/SessionStart hooks could accumulate non-trivial cost. No budget cap or batching mechanism exists.
- **Reference staleness**: Prompt design guidance is tuned for Claude 4.6 behaviour. No mechanism flags when model updates change prompting best practices.
- **Edit scope in auditor**: The `Edit(.claude/**)` scope in the auditor's tool list restricts edits to `.claude/` paths, but plugin files live under `plugins/`. The general `Edit` tool (also listed) covers those, but the scoping intent is ambiguous.
