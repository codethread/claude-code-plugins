# Claude Code Plugin Marketplace

A local plugin marketplace for Claude Code providing development workflows and document processing.

## What

Extends Claude Code with:

- **Development Workflows**: langs, bdfl, karen, workflow
- **Documentation**: doc-writer (technical writing best practices)
- **Claude Code Knowledge**: Documentation access and skill creation tools

## Why

- Language-specific patterns (langs: React, TypeScript)
- Write quality documentation (doc-writer)
- Opinionated project bootstrapping and migration (bdfl)
- Scope gatekeeper to prevent feature creep (karen)
- Official Claude Code docs at your fingertips (claude-code-knowledge)

## How

### Setup

1. **Configure environment variable** (add to your shell profile: `~/.zshrc`, `~/.bashrc`, etc.):

   ```bash
   export CT_PLUGINS_DIR=~/.claude/plugins/marketplaces/codethread-plugins/plugins
   ```

   After adding, reload your shell: `source ~/.zshrc` (or restart your terminal)

### Install

```bash
# Add marketplace
/plugin marketplace add git@github.com:codethread/claude-code-plugins.git

# Install plugins
/plugin install claude-code-knowledge@codethread-plugins
/plugin install doc-writer@codethread-plugins
/plugin install langs@codethread-plugins
/plugin install workflow@codethread-plugins
/plugin install bdfl@codethread-plugins
/plugin install karen@codethread-plugins
```

Then run `claude --init` (or `claude --init-only`) in any project to install dependencies and build plugins. Each plugin's Setup hook handles its own initialization automatically.

### Use

After installation, plugins provide slash commands, agents, and skills. See individual plugin READMEs for usage:

- `plugins/claude-code-knowledge/README.md` - Claude Code docs and skill creation
- `plugins/doc-writer/README.md` - Documentation writing guidance
- `plugins/langs/README.md` - Language-specific patterns
- `plugins/workflow/README.md` - Development workflow
- `plugins/bdfl/README.md` - Opinionated project bootstrapping and migration
- `plugins/karen/README.md` - Scope gatekeeper agent

### Ask Claude

For detailed information, ask Claude:

```
What can the langs plugin do?
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
  - Processes plugins in parallel (version bump in marketplace.json, CHANGELOG.md)
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

Skill creation scripts sourced from [Anthropic's skills repository](https://github.com/anthropics/skills).

## Reference

- [Official Plugin Marketplace Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
