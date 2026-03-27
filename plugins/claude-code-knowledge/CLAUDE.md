# Claude Code Knowledge - Development Guide

Opinionated Claude Code configuration skill. Delegates to the built-in Claude Code Guide subagent for official documentation.

## Architecture

The plugin was simplified from a documentation-caching system to a thin opinionated layer on top of the Claude Code Guide subagent (which Anthropic now provides natively).

### What It Does

1. **SKILL.md** tells Claude to always consult the Claude Code Guide subagent first
2. **Opinionated rules** add project-specific conventions (progressive disclosure for skills, inline-vs-script for hooks)

### What Was Removed

The plugin previously cached 45+ documentation files locally via hooks. This infrastructure was removed because the Claude Code Guide subagent replaces it:
- `sync-docs-on-skill-load.ts` (PreToolUse hook for doc fetching)
- `claude-code-prompt.ts` (UserPromptSubmit hook for auto-suggesting skill)
- `skill-rules.json` (pattern-based skill suggestion)
- `references/` directory (hooks and skills quick references)
- `docs/` directory (cached documentation)
- `list_topics.ts` (topic listing from manifest)
- `scripts/skill-creator/` (init, validate, package scripts — removed as unnecessary)

## File Structure

```
claude-code-knowledge/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── claude-code-knowledge/
│   │   └── SKILL.md            # Skill instructions (Guide + opinionated rules)
│   └── refactor-hooks/
│       └── SKILL.md            # Refactor existing hooks to match knowledge skill patterns
├── README.md
├── CLAUDE.md                   # This file
├── CHANGELOG.md
├── package.json
└── tsconfig.json
```

## Key Components

### `skills/claude-code-knowledge/SKILL.md`

Contains two sections:
1. **Claude Code Guide directive** — always consult the subagent first
2. **Opinionated rules** — skills (progressive disclosure), hooks (inline bash <100 chars, else bun script)

### `skills/refactor-hooks/SKILL.md`

Companion skill that loads the `claude-code-knowledge` skill and applies its patterns to refactor existing `.claude/` hook files. Invoked as `/claude-code-knowledge:refactor-hooks`.

## Maintenance

### Updating Opinionated Rules

Edit `SKILL.md` directly. Rules live inline (not in references) so they're always visible when the skill loads.
