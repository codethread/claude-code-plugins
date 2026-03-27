# Claude Code Knowledge

Opinionated Claude Code configuration guidance.

## What

**Skill**: `claude-code-knowledge` - Mandatory when configuring Claude Code specifics (hooks, skills, plugins, MCP, settings)
**Approach**: Delegates to the built-in Claude Code Guide subagent for official docs, adds opinionated rules on top

## Why

- Claude Code Guide handles official documentation — no need to duplicate it
- Adds opinionated conventions: progressive disclosure for skills, inline-vs-script rules for hooks

## How

### Install

```bash
/plugin install claude-code-knowledge@codethread-plugins
```

### Use

The skill loads automatically when configuring Claude Code features. It directs Claude to:

1. Consult the Claude Code Guide subagent for official information
2. Apply opinionated rules for skills and hooks
