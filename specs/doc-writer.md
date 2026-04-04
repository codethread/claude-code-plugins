# Doc-Writer Specification

**Status:** Implemented
**Last Updated:** 2026-04-03

## 1. Overview

### Purpose

Documentation expertise plugin that provides research-backed writing patterns, auto-detection of markdown edits, and a ruthless simplification agent. Built on the Diataxis framework and grounded in analysis of exemplary projects (React, Rust, Stripe, Twilio) and authoritative style guides (Google, Microsoft, Write the Docs).

### Goals

- Provide actionable documentation patterns as persistent session context (skill)
- Auto-detect markdown edits and suggest the skill once per session (hook)
- Ruthlessly simplify documentation via a dedicated review agent
- Enforce API verification, security checks, and production-ready code examples
- Teach Claude to test its own base knowledge before documenting (`claude --print --model haiku`)
- Maintain a research foundation (reference files) independent of the operational skill

### Non-Goals

- Generating documentation autonomously — the skill provides patterns, the user drives the writing
- Replacing style guides — references synthesize existing guides, they don't create a new one
- Linting or automated quality enforcement — the docs-reviewer agent is advisory, not blocking
- Cross-session state — hook suggestion fires once per session only, no persistence beyond that

## 2. Architecture

### Component Map

```
plugins/doc-writer/
├── .claude-plugin/plugin.json          # Plugin manifest (name, description, keywords)
├── hooks/
│   ├── hooks.json                      # Hook registration (Setup + PostToolUse)
│   ├── package.json                    # Hook dependencies (@claude-plugins/lib)
│   └── doc-writer-suggest.ts           # Auto-detection hook
├── agents/
│   └── docs-reviewer.md                # Simplification agent (model: sonnet)
└── skills/
    └── writing-documentation/
        ├── SKILL.md                    # Operational context (~170 lines)
        └── references/
            ├── best-practices.md       # Style guide synthesis (~430 lines)
            ├── exemplary-projects.md   # Project analysis (~220 lines)
            └── llm-pitfalls.md         # LLM quality issues (~775 lines)
```

### Three-Tier Knowledge Architecture

```
SKILL.md (Active Context — loaded into session)
    ↓ cites
    ├── best-practices.md       (Authoritative guidelines — read on demand)
    ├── exemplary-projects.md   (Real-world evidence — read on demand)
    └── llm-pitfalls.md         (Countermeasures — read on demand)
```

Only SKILL.md is loaded into context. Reference files are available but not auto-loaded — this keeps token usage low while providing depth when needed. References have different update cycles: projects change frequently, style guides are stable.

### Data Flow

1. User edits a `.md` file via Write/Edit/MultiEdit
2. PostToolUse hook fires → detects markdown → checks session cache
3. If first time this session: injects `<plugin-doc-writer-suggestion>` context with skill and agent recommendations
4. User (or Claude proactively) loads `/skill writing-documentation`
5. SKILL.md persists in context for remainder of session
6. After writing docs, user invokes `docs-reviewer` agent for simplification pass

### Hook Mechanics

**Trigger:** PostToolUse event, matcher `Write|Edit|MultiEdit`

**Detection logic:**
- Write/Edit: checks `tool_input.file_path` ends with `.md` (case-insensitive)
- MultiEdit: iterates `tool_input.edits[]`, breaks on first `.md` match

**Session cache:** Uses `@claude-plugins/lib/session-cache` with key tuple `("doc-writer", cwd, sessionId)`. Cache shape:

```typescript
interface SessionCache {
  doc_writer_suggested: boolean;   // always true when written
  first_triggered: string;         // ISO 8601 timestamp
  triggered_by: string;            // file path that triggered
}
```

**Output format:** `SyncHookJSONOutput` with `hookSpecificOutput.additionalContext` containing:

```xml
<plugin-doc-writer-suggestion>
Detected markdown file modification: {filePath}

ESSENTIAL SKILL:
  → doc-writer:writing-documentation

RECOMMENDED AGENT:
  → doc-writer:docs-reviewer
</plugin-doc-writer-suggestion>
```

**Error handling:** All errors caught, logged to stderr, exit 1. Non-matching tools and already-suggested sessions exit 0 silently.

### Agent: docs-reviewer

**Model:** sonnet | **Tools:** Read, Grep, Glob, Skill

Four-phase review process:
1. **Assess** — identify goal, audience (human vs Claude Code), critical info
2. **Challenge** — every paragraph, sentence, example, code block, list, emoji must justify its existence
3. **Extra scrutiny for Claude Code docs** — particularly brutal: eliminate motivational language, hedge words, redundant examples, filler transitions. Preserve precise specs, edge cases, actionable instructions.
4. **Simplify structure** — merge sections, flatten hierarchies, remove empty headings

Output categories: REMOVE (high), SIMPLIFY (medium), KEEP BUT QUESTION (low).

### Skill: writing-documentation

Core operational workflow in SKILL.md:

1. **Test base knowledge** — run `claude --print --model haiku` to verify what Claude already knows. Document only unique patterns (opinionated, counter-intuitive, project-specific).
2. **Verify technical accuracy** — use researcher agent + Context7 MCP for external APIs; read source for internal APIs. Mandatory security checks: parameterized SQL, `yaml.safe_load()`, env vars for credentials, input validation, error handling.
3. **Code examples** — must include all imports, be copy-paste ready, show expected output, include production error handling, explain "why."
4. **Apply docs-reviewer** — mandatory for CLAUDE.md, SKILL.md, commands, agents.
5. **Self-checklist** — 10 items across verification, content quality, and Claude Code docs.

## 3. Interfaces

### User-Facing Entry Points

| Entry Point | Type | Invocation |
|---|---|---|
| `writing-documentation` | Skill | `/skill writing-documentation` or auto-suggested by hook |
| `docs-reviewer` | Agent | Invoked via Task tool or direct agent reference |
| Auto-detection | Hook | Fires automatically on markdown Write/Edit/MultiEdit |

### Plugin Registration

Marketplace entry in `.claude-plugin/marketplace.json`:
```json
{
  "name": "doc-writer",
  "version": "1.0.1",
  "source": "./plugins/doc-writer",
  "category": "development-tools"
}
```

### Setup Hook

`hooks.json` registers a Setup hook (`matcher: "init"`) that runs `bun install` in the hooks directory to install `@claude-plugins/lib` workspace dependency.

### Dependencies

| Package | Purpose | Location |
|---|---|---|
| `@claude-plugins/lib` (workspace) | Session cache for once-per-session suggestion | `hooks/package.json` |
| `@anthropic-ai/claude-agent-sdk` | Hook input/output type definitions | `hooks/package.json` (dev) |

## 4. Design Decisions

- **Skill over command or agent**: Documentation writing is broad and session-spanning. A skill provides persistent context; a command would be too narrow, an agent too heavyweight for guidance that should be passively available.
- **Three-tier knowledge split**: SKILL.md stays under ~200 lines for token efficiency. References provide evidence depth without polluting active context. Each tier has independent update cycles and audiences.
- **Diataxis framework**: Chosen for widespread adoption (Python, Ubuntu, Gatsby), simple four-type model, and strong community support. Alternatives (ABOK, custom taxonomies) were rejected for lacking ecosystem validation.
- **Once-per-session suggestion**: The hook suggests the skill exactly once per session to avoid noise. Uses session cache rather than in-memory state because hooks run as short-lived subprocesses.
- **docs-reviewer on sonnet**: Sonnet balances cost and capability for a review task that requires judgment but not the full weight of opus. The agent is advisory — it produces categorized feedback, not automated edits.
- **Test-base-knowledge-first methodology**: The React skill case study (328→125 lines, -62%) validated that most documentation duplicates what Claude already knows. Testing with haiku is cost-effective and reveals the gap between base knowledge and project-specific patterns.

## 5. Open Questions

- **Reference file staleness**: The research in `llm-pitfalls.md` cites 2024-2025 studies. No mechanism exists to flag when research becomes outdated or new studies supersede existing findings.
- **Hook coverage gap**: The hook only detects `.md` file modifications via Write/Edit/MultiEdit. Documentation written inline (e.g. JSDoc, docstrings) or via other tools won't trigger the suggestion.
- **Agent invocation friction**: The docs-reviewer must be invoked manually or via skill instruction. There's no automated trigger after documentation is written — the user must remember or follow the skill's guidance.
