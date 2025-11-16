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

> User: "Help me create a claude hook that does ..."

1. list files in `docs`
2. read all relavent markdown files
3. respond as appropriate, referencing speci specific files (e.g., "From docs/hooks.md...")

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
