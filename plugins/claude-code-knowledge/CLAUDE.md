# Claude Code Knowledge - Development Guide

Opinionated Claude Code configuration skill. Delegates to the built-in Claude Code Guide subagent for official documentation, then layers repo-specific prompting, skill-authoring, and subagent guidance on top.

## Architecture

The plugin is a thin opinionated layer on top of the Claude Code Guide subagent (which Anthropic now provides natively), plus a small set of reference files for current prompt and subagent patterns.

### What It Does

1. **SKILL.md** tells Claude to always consult the Claude Code Guide subagent first
2. **Opinionated rules** stay inline in the main skill so agents always see them
3. **Reference files** hold the deeper guidance on prompt design, skill authoring, and subagent design

### What Was Removed

The plugin previously cached large amounts of documentation locally via hooks. That infrastructure was removed because the Claude Code Guide subagent replaces the need for a local doc mirror. The remaining references are curated guidance, not a cached copy of upstream docs.

## File Structure

```
claude-code-knowledge/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── claude-code-knowledge/
│   │   ├── SKILL.md            # Main index + inline repo opinions
│   │   └── references/
│   │       ├── plugin-bootstrapping.md  # SessionStart hook pattern for dependency management
│   │       ├── prompt-design.md         # Current prompt-writing guidance for Claude Code surfaces
│   │       ├── skill-authoring.md       # SKILL.md structure, triggering, and progressive disclosure
│   │       └── subagent-design.md       # Agent descriptions, scope, tools, and parallelisation
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
2. **Reference map** — points Claude to the smallest supporting file for the task
3. **Opinionated rules** — stays inline so it is always present in context

### `skills/claude-code-knowledge/references/*.md`

Curated supporting references:

- `prompt-design.md` — prompt structure for Claude 4.6 era behaviour
- `skill-authoring.md` — how to design concise, high-signal skills
- `subagent-design.md` — how to write focused subagents that delegate well
- `plugin-bootstrapping.md` — runtime dependency bootstrapping pattern

### `skills/refactor-hooks/SKILL.md`

Companion skill that loads the `claude-code-knowledge` skill and applies its patterns to refactor existing `.claude/` hook files. Invoked as `/claude-code-knowledge:refactor-hooks`.

## Maintenance

### Updating Opinionated Rules

Edit `SKILL.md` directly. Rules live inline (not in references) so they're always visible when the skill loads.

### Updating Supporting Guidance

Edit the relevant file in `skills/claude-code-knowledge/references/`.

Guideline:

- keep current Anthropic or Claude Code behaviour in references
- keep repo-specific opinions and sharp rules in the main `SKILL.md`
