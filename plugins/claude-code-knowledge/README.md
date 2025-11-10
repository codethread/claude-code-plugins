# Claude Code Knowledge Plugin

Official Claude Code documentation access with automatic sync. Model-invoked skill for instant reference to hooks, MCP, skills, settings, and all Claude Code features. Also includes comprehensive skill creation guide with helper scripts.

## When to Use

Claude automatically uses this when you:
- Ask about Claude Code features or capabilities
- Mention: hooks, MCP, skills, settings, security, plugins
- Want to create a new skill or update an existing skill
- Ask "how do I..." questions related to Claude Code
- Need verification of Claude Code functionality

You don't need to explicitly invoke it - Claude decides when to use it.

## Installation

```bash
/plugin install claude-code-knowledge@personal-configs-plugins
```

## What You Get

### Skill: `claude-code-knowledge`

**Model-invoked** - Claude automatically uses it when detecting Claude Code questions.

Provides:
- **45+ documentation topics** covering all Claude Code features
- **Fast local access** - No network delay
- **Search capability** - Search across all documentation
- **Official source** - Synced from docs.anthropic.com

### Hook: `claude-code-prompt`

**Auto-suggestion hook** - Proactively reminds Claude to use the skill when you mention Claude Code topics.

### Skill Rules: `skill-rules.json`

**Pattern-based triggers** - Framework-level skill suggestion based on prompt patterns.

Works alongside the hook and model-invoked skill for comprehensive coverage.

**Triggers on:**
- Mentions of "Claude Code", "claude-code", or "claudecode"
- Questions about Claude ("How does Claude...", "Can Claude...")
- Claude Code features: hooks, MCP servers, skills, slash commands, settings
- Related keywords: plugin, sub-agent, checkpointing, memory

**Smart detection:**
- ✅ Triggers: "How do I create a hook?"
- ✅ Triggers: "Can Claude use MCP servers?"
- ✅ Triggers: "What are Claude Code skills?"
- ❌ Won't trigger: "I prefer Claude Sonnet over Claude Opus"

This hook injects a prompt suggestion into Claude's context, reminding it to load the skill before responding to your question.

### Documentation Coverage

- **Core**: Setup, CLI, workflows, interactive mode
- **Extensibility**: Hooks, MCP servers, skills, slash commands, plugins
- **Skill Creation**: Comprehensive guide with helper scripts for creating effective skills
- **Advanced**: Sub-agents, memory, checkpointing, analytics
- **Integrations**: GitHub Actions, VS Code, JetBrains, GitLab CI/CD
- **Cloud**: Amazon Bedrock, Google Vertex AI
- **Security**: Security features, sandboxing, data usage
- **Operations**: Troubleshooting, headless mode, changelog

## Quick Example

Just ask naturally:

```
How do I create a hook?
What MCP servers are available?
How do I configure settings?
How do I create a skill?
```

Claude will automatically use this skill to provide accurate answers from official documentation.

## Hook Setup

### Installation

The plugin includes a UserPromptSubmit hook that auto-suggests the skill. To enable it:

1. **Install hook dependencies** (one-time setup):
```bash
cd ~/.claude/plugins/claude-code-knowledge/hooks
bun install
```

2. **Add hook to your settings.json**:
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/claude-code-prompt.ts",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

The `${CLAUDE_PLUGIN_ROOT}` variable automatically resolves to the plugin's installation directory, so no hardcoded paths needed!

3. **Restart Claude Code** to apply changes

### How It Works

When you submit a prompt, the hook:
1. Analyzes your prompt for Claude Code related keywords
2. Detects questions about Claude or its features
3. If matched, injects a suggestion into Claude's context
4. Claude sees the suggestion and loads the skill before responding

This ensures Claude always has access to the latest official documentation when answering your questions.

## Complete Setup Checklist

✅ Plugin installed via `/plugin install`
✅ Hook dependencies installed: `cd ~/.claude/plugins/claude-code-knowledge/hooks && bun install`
✅ Script dependencies installed: `cd ~/.claude/plugins/claude-code-knowledge/skills/claude-code-knowledge/scripts && bun install`
✅ Hook enabled in settings.json (optional but recommended)

## Manual Documentation Access

Then use the scripts:

```bash
# List all topics
bun skills/claude-code-knowledge/scripts/list_topics.ts

# Sync latest docs
bun skills/claude-code-knowledge/scripts/sync_docs.ts

# Read specific topic
cat skills/claude-code-knowledge/docs/hooks.md

# Skill creation helper scripts
bun skills/claude-code-knowledge/scripts/skill-creator/init_skill.ts my-skill --path ./output
bun skills/claude-code-knowledge/scripts/skill-creator/package_skill.ts path/to/skill
bun skills/claude-code-knowledge/scripts/skill-creator/quick_validate.ts path/to/skill
```

## Related

- See `skills/claude-code-knowledge/reference.md` for complete topic list
- See `CLAUDE.md` for maintainer documentation
