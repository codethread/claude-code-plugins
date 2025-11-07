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
- **Automatic sync** - Documentation stays up-to-date
- **Fast local access** - No network delay
- **Search capability** - Search across all documentation
- **Official source** - Synced from docs.anthropic.com

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

## Manual Documentation Access

```bash
# List all topics
bash skills/claude-code-knowledge/scripts/list_topics.sh

# Sync latest docs
bash skills/claude-code-knowledge/scripts/sync_docs.sh

# Read specific topic
cat skills/claude-code-knowledge/docs/hooks.md

# Skill creation helper scripts
skills/claude-code-knowledge/scripts/skill-creator/init_skill.py my-skill --path ./output
skills/claude-code-knowledge/scripts/skill-creator/package_skill.py path/to/skill
skills/claude-code-knowledge/scripts/skill-creator/quick_validate.py path/to/skill
```

## Related

- See `skills/claude-code-knowledge/reference.md` for complete topic list
- See `CLAUDE.md` for maintainer documentation
