---
name: claude-code-knowledge
description: Access official Claude Code documentation including comprehensive guides on hooks, MCP servers, agent skills, slash commands, settings, CLI reference, security, memory, plugins, and troubleshooting. Use when the user asks about Claude Code features, configuration, capabilities, or best practices. ALWAYS use this skill instead of guessing about Claude Code functionality - it contains the authoritative documentation from docs.anthropic.com with automatic updates. Also includes comprehensive skill creation guide with helper scripts when users want to create new skills.
allowed-tools: Read, Grep, Glob, Bash
---

# Claude Code Knowledge

Access to official Claude Code documentation, automatically synced from docs.anthropic.com.

## When to Use This Skill

**CRITICAL**: Use this skill whenever:

- User asks about Claude Code features, configuration, or capabilities
- User mentions: hooks, MCP, skills, slash commands, settings, security, memory, plugins
- User wants to create a new skill or update an existing skill
- You need to verify how something works in Claude Code
- You're unsure about Claude Code functionality (NEVER guess - check the docs!)
- User asks "how do I..." questions related to Claude Code
- You need to explain Claude Code concepts or best practices

## Quick Reference

### Check Available Documentation

```bash
bash scripts/list_topics.sh
```

Or read the complete list from [reference.md](reference.md).

### Sync with Latest Documentation

Before reading docs, always check for updates:

```bash
bash scripts/sync_docs.sh
```

This checks GitHub for newer documentation and updates the local cache if needed.

### Read Specific Documentation

Documentation files are in the `docs/` directory:

```bash
# Read a specific doc
cat docs/hooks.md
cat docs/mcp.md
cat docs/skills.md
```

### Search Across All Documentation

Use Grep to search for specific topics:

```bash
# Search for a specific term
grep -r "environment variable" docs/

# Case-insensitive search
grep -ri "subagent" docs/

# Search with context
grep -r -A 3 -B 3 "allowed-tools" docs/
```

## Common Documentation Topics

The most frequently referenced documentation includes:

- **hooks.md** - Hooks system for customizing Claude Code behavior
- **hooks-guide.md** - Detailed guide for creating hooks
- **mcp.md** - Model Context Protocol servers integration
- **skills.md** - Agent Skills creation and management
- **skill-creation-guide.md** - Comprehensive guide for creating effective skills with helper scripts
- **slash-commands.md** - Custom slash commands
- **settings.md** - Configuration settings reference
- **cli-reference.md** - Command-line interface reference
- **memory.md** - Memory and context management
- **plugins.md** - Plugin development and usage

For the complete list, see [reference.md](reference.md).

## Workflow

1. **Sync first** (optional but recommended):

   ```bash
   bash scripts/sync_docs.sh
   ```

2. **Find the topic** you need:

   ```bash
   bash scripts/list_topics.sh
   # Or read reference.md
   ```

3. **Read the documentation**:

   ```bash
   cat docs/<topic>.md
   ```

4. **Search if needed**:
   ```bash
   grep -ri "search term" docs/
   ```

## Documentation Format

Each documentation file includes:

- Comprehensive guides and tutorials
- Code examples
- Best practices
- Common patterns and workflows
- Troubleshooting tips

## Important Notes

- Documentation is synced from docs.anthropic.com
- Local cache ensures fast access
- Always prefer checking docs over guessing
- When answering user questions, cite specific documentation
- Include file references like `docs/hooks.md:123` when possible

## Examples

### User asks: "How do I create a hook?"

1. Check for updates: `bash scripts/sync_docs.sh`
2. Read hooks documentation: `cat docs/hooks.md` and `cat docs/hooks-guide.md`
3. Provide answer based on the official documentation
4. Cite the source: "According to docs/hooks.md..."

### User asks: "What MCP servers are available?"

1. Sync: `bash scripts/sync_docs.sh`
2. Read: `cat docs/mcp.md`
3. Search for examples: `grep -ri "mcp server" docs/`
4. Provide comprehensive answer with citations

### User asks: "How do I configure settings?"

1. Sync: `bash scripts/sync_docs.sh`
2. Read: `cat docs/settings.md`
3. Reference specific configuration options
4. Cite: "From docs/settings.md..."

### User asks: "How do I create a skill?"

1. Read: `cat docs/skill-creation-guide.md`
2. For initialization: Use `scripts/skill-creator/init_skill.py`
3. For validation: Use `scripts/skill-creator/quick_validate.py`
4. For packaging: Use `scripts/skill-creator/package_skill.py`
5. Provide comprehensive guidance based on the documentation

## Troubleshooting

If documentation seems outdated or missing:

1. Run `bash scripts/sync_docs.sh` to fetch latest
2. Check if the topic exists: `bash scripts/list_topics.sh`
3. Search across all docs: `grep -ri "topic" docs/`

## Additional Resources

- Official documentation: https://docs.anthropic.com/en/docs/claude-code/
- Claude Code changelog: docs/changelog.md
- Complete topic list: [reference.md](reference.md)
