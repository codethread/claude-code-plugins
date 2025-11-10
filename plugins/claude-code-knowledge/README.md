# Claude Code Documentation

Official Claude Code documentation access with skill creation tools.

## What

**Skill**: `claude-code-knowledge` - 45+ documentation topics (hooks, MCP, skills, settings, CLI, plugins)
**Hook**: Auto-suggests skill when you ask Claude Code questions
**Scripts**: Skill creation helpers (init, validate, package)

## Why

- Official documentation at your fingertips
- Claude automatically uses it when you ask about Claude Code
- No guessing - authoritative answers
- Skill creation tools included
- Fast local access, no network delay

## How

### Install

```bash
/plugin install claude-code-knowledge@personal-configs-plugins

# Install dependencies (one-time)
cd ~/.claude/plugins/claude-code-knowledge/hooks && bun install
cd ~/.claude/plugins/claude-code-knowledge/skills/claude-code-knowledge/scripts && bun install
```

### Use

**Just ask:**
```
How do I create a hook?
How do I create a skill?
What MCP servers are available?
```

Claude automatically loads the skill and uses official docs.

**Ask Claude for details:**
```
What documentation topics are available?
Show me the skill creation workflow
How does the auto-suggestion hook work?
```
