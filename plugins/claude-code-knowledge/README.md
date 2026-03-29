# Claude Code Knowledge

Opinionated Claude Code configuration guidance.

## What

- **Skill**: `claude-code-knowledge` — mandatory when configuring Claude Code specifics (hooks, skills, plugins, MCP, settings)
- **Command**: `/claude-code-knowledge:audit-config` — audits and updates all Claude Code config in a project to match conventions
- **Agent**: `knowledge-auditor` — used by the command; audits one concern area per invocation

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

The skill loads when configuring Claude Code features. To audit an existing project:

```
/claude-code-knowledge:audit-config
```

This runs the `knowledge-auditor` agent sequentially across hooks, skills, commands, agents, and settings.
