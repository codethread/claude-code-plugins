# Claude Code Plugin Marketplace

A local plugin marketplace for Claude Code providing development workflows and document processing.

## What

Extends Claude Code with:
- **Development Workflows**: spec-dev, mcp-builder, doc-writer, langs
- **Claude Code Knowledge**: Documentation access and skill creation tools
- **Document Processing**: PDF, Excel, PowerPoint, Word

## Why

- Systematic development with specifications and reviews (spec-dev)
- Build MCP servers with best practices (mcp-builder)
- Write quality documentation (doc-writer)
- Language-specific patterns (langs: React, TypeScript)
- Official Claude Code docs at your fingertips (claude-code-knowledge)
- Process documents programmatically (pdf, xlsx, pptx, docx)

## How

### Install

```bash
# Add marketplace
/plugin marketplace add git@github.com:codethread/claude-code-plugins.git

# Install plugins
/plugin install spec-dev@personal-configs-plugins
/plugin install doc-writer@personal-configs-plugins
/plugin install claude-code-knowledge@personal-configs-plugins
/plugin install mcp-builder@personal-configs-plugins
/plugin install langs@personal-configs-plugins

# Document processing (optional)
/plugin install pdf@personal-configs-plugins
/plugin install xlsx@personal-configs-plugins
/plugin install pptx@personal-configs-plugins
/plugin install docx@personal-configs-plugins
```

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
- Document processing (pdf, xlsx, pptx, docx)
- MCP builder guidance
- Skill creation scripts

## Reference

- [Official Plugin Marketplace Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
