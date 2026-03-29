# Claude Code Knowledge

Opinionated Claude Code configuration guidance.

## What

**Skill**: `claude-code-knowledge` - Mandatory when configuring Claude Code specifics (hooks, skills, plugins, MCP, settings)
**Approach**: Delegates to the built-in Claude Code Guide subagent for official docs, then applies repo opinions plus focused references for prompting, skills, and subagents

## Why

- Claude Code Guide handles official documentation — no need to duplicate it
- Adds opinionated conventions: progressive disclosure for skills, inline-vs-script rules for hooks
- Adds current guidance for prompt design and subagent design without bloating the main skill

## How

### Install

```bash
/plugin install claude-code-knowledge@codethread-plugins
```

### Use

The skill loads automatically when configuring Claude Code features. It directs Claude to:

1. Consult the Claude Code Guide subagent for official information
2. Apply opinionated rules from the main skill
3. Open the smallest supporting reference for prompt, skill, agent, or plugin work
