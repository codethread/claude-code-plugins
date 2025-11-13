# Claude Code Plugin Marketplace

A local plugin marketplace for Claude Code providing development workflows and document processing.

## What

Extends Claude Code with:

- **Development Workflows**: spec-dev, mcp-builder, doc-writer, langs
- **Claude Code Knowledge**: Documentation access and skill creation tools

## Why

- Systematic development with specifications and reviews (spec-dev)
- Build MCP servers with best practices (mcp-builder)
- Write quality documentation (doc-writer)
- Language-specific patterns (langs: React, TypeScript)
- Official Claude Code docs at your fingertips (claude-code-knowledge)

## How

### Install

```bash
# Add marketplace
/plugin marketplace add git@github.com:codethread/claude-code-plugins.git

# Install dependencies (run once after adding marketplace)
cd ~/.claude/plugins/marketplaces/codethread-plugins
bun install

# Install plugins
/plugin install spec-dev@codethread-plugins
/plugin install doc-writer@codethread-plugins
/plugin install claude-code-knowledge@codethread-plugins
/plugin install mcp-builder@codethread-plugins
/plugin install langs@codethread-plugins
```

**Note:** The `bun install` command installs all dependencies needed by plugin scripts and hooks. You only need to run this once after adding the marketplace.

### Use

After installation, plugins provide slash commands, agents, and skills. See individual plugin READMEs for usage:

- `plugins/spec-dev/README.md` - Spec-driven development workflows
- `plugins/doc-writer/README.md` - Documentation writing guidance
- `plugins/claude-code-knowledge/README.md` - Claude Code docs and skill creation
- `plugins/mcp-builder/README.md` - MCP server development
- `plugins/langs/README.md` - Language-specific patterns

### Ask Claude

For detailed information, ask Claude:

```
What can the spec-dev plugin do?
How do I create a new plugin?
Show me the plugin directory structure
```

Claude will reference CLAUDE.md files for comprehensive architecture details.

## Development

### Repository maintenance

Project-level slash commands for maintaining this repository:

- `/release` - Prepare plugin releases with version bumps, changelog updates, and git tags
  - Safety checks for accidental commits (`.env`, `node_modules`, hidden files)
  - Detects and squashes WIP commits
  - Processes plugins in parallel (version bump, SKILL.md updates, CHANGELOG.md)
  - Creates single conventional commit: `type(plugin1,plugin2): description`
  - Creates git tags: `<plugin-name>-v<version>`
  - Does NOT push (review with `git show` first)

## Plugin Suggestions

Plugins provide automatic suggestions via hooks using structured XML tags. All plugin suggestions follow the pattern `<plugin-PLUGINNAME-suggestion>`, allowing you to control Claude's attention to these recommendations in your project's `CLAUDE.md`.

**Example 1: Emphasize all plugin suggestions**

```markdown
# CLAUDE.md

ALWAYS follow `<plugin-*-suggestion>` tags closely. These provide
context-specific recommendations from installed plugins.
```

**Example 2: Emphasize specific plugins**

```markdown
# CLAUDE.md

- ALWAYS follow `<plugin-doc-writer-suggestion>` recommendations when
  writing documentation
- ALWAYS follow `<plugin-langs-suggestion>` when test files are detected
- Consider `<plugin-claude-code-knowledge-suggestion>` for Claude Code questions
```

**Example 3: Ignore specific suggestions**

```markdown
# CLAUDE.md

Follow all `<plugin-*-suggestion>` tags except `<plugin-langs-suggestion>`
(I prefer to manage test files manually).
```

The XML tag format ensures Claude treats these suggestions as structured prompts rather than visual formatting, improving reliability with Anthropic models.

## Attribution

Several plugins sourced from [Anthropic's skills repository](https://github.com/anthropics/skills):

- MCP builder guidance
- Skill creation scripts

## Reference

- [Official Plugin Marketplace Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
