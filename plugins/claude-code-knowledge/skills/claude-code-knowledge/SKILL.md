---
name: claude-code-knowledge
description: Access official Claude Code documentation including comprehensive guides on hooks, MCP servers, agent skills, slash commands, settings, CLI reference, security, memory, plugins, and troubleshooting. Use when the user asks about Claude Code features, configuration, capabilities, or best practices. ALWAYS use this skill instead of guessing about Claude Code functionality - it contains the authoritative documentation from docs.anthropic.com with automatic updates. Also includes comprehensive skill creation guide with helper scripts when users want to create new skills.
allowed-tools: Read, Grep, Glob, Bash, Bash(bun:*)
---

# Claude Code Knowledge

Official Claude Code documentation, automatically synced from docs.anthropic.com.

## When to Use

Use this skill for any Claude Code-related question: features, configuration, hooks, MCP, skills, slash commands, settings, security, memory, plugins, or skill creation.

NEVER guess about Claude Code functionality - always check the docs.

Documentation is located at [docs](docs)

## Workflow

### For Skills Questions

> User: "How do I create a skill?"

1. **Read [references/skills.md](references/skills.md) FIRST** - condensed key points
2. If more details needed, read [docs/skills.md](docs/skills.md) for comprehensive information
3. Respond with citations (e.g., "From references/skills.md...")

### For Hooks Questions

> User: "Help me create a hook that..."

1. **Read [references/hooks.md](references/hooks.md) FIRST** - condensed key points
2. If more details needed, read [docs/hooks.md](docs/hooks.md) and [docs/hooks-guide.md](docs/hooks-guide.md)
3. Respond with citations (e.g., "From references/hooks.md...")

### For Other Topics

> User: "How do I configure MCP servers?"

1. List files in `docs`
2. Read relevant markdown files
3. Respond with citations (e.g., "From docs/mcp.md...")

## Overlap

Many claude code topics work orthogonally, so always load related topics as appropriate.

### Example

> User: "Help me create a claude code plugin that has a typescript Skill"

1. Follow original workflow to understand claude code topics such as plugins AND Skills
2. Implement as per user instructions

> User: "Ok, now add a hook to suggest typescript Skill when reading typescript files"

1. Consider if this introduces new claude code concepts (in this case hooks)
2. Follow original workflow to understand claude code hooks
3. Implement as per user instructions

## Additional Skills

**IMPORTANT:** many claude code concepts require markdown updates or script additions, so always consider if additional Skills (not part of this Skill) are relavent, such as documentation or programming language specific Skills
