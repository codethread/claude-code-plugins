# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a local Claude Code plugin marketplace repository. It contains plugin definitions that extend Claude Code with custom commands, agents, and skills.

## Plugin Architecture

### Marketplace Structure

- **`.claude-plugin/marketplace.json`** - Marketplace catalog that registers all available plugins
- **`plugins/`** - Directory containing individual plugin implementations
- Each plugin has its own README.md and CLAUDE.md with detailed documentation

### Plugin Components

Plugins can contain any combination of:

- **Commands** (`.md` files in `commands/`) - Slash commands like `/prime-spec`
- **Agents** (`.md` files in `agents/`) - Specialized sub-agents for Task tool
- **Skills** (`.md` files in `skills/`) - Context that can be loaded into sessions
- **Documentation** (`docs/`, `spec-templates/`, etc.)

## Available Plugins

### Development Workflow

- **spec-dev** - Multi-agent spec-driven development workflow (see `plugins/spec-dev/CLAUDE.md`)
- **mcp-builder** - MCP server development guide (see `plugins/mcp-builder/CLAUDE.md`)
- **skill-creator** - Skill creation framework (see `plugins/skill-creator/CLAUDE.md`)

### Document Processing

See `plugins/document-skills/CLAUDE.md` for overview of document processing plugins:

- **pdf** - PDF manipulation and form filling
- **xlsx** - Excel spreadsheet operations
- **pptx** - PowerPoint presentation creation
- **docx** - Word document editing with tracked changes

## Plugin Management Commands

```bash
# Register this marketplace locally
/plugin marketplace add ./

# Install plugins
/plugin install spec-dev@personal-configs-plugins
/plugin install mcp-builder@personal-configs-plugins
/plugin install skill-creator@personal-configs-plugins
/plugin install pdf@personal-configs-plugins
/plugin install xlsx@personal-configs-plugins
/plugin install pptx@personal-configs-plugins
/plugin install docx@personal-configs-plugins

# List installed plugins
/plugin list

# Remove plugin
/plugin uninstall <plugin-name>
```

## Creating New Plugins

1. Create plugin directory structure:

   ```bash
   mkdir -p plugins/my-plugin/{commands,agents,skills}
   ```

2. Add plugin metadata (no `plugin.json` needed - marketplace.json is sufficient)

3. Register in `.claude-plugin/marketplace.json`:

   ```json
   {
     "name": "my-plugin",
     "description": "What it does",
     "version": "1.0.0",
     "author": { "name": "Your Name" },
     "keywords": ["tag1", "tag2"],
     "source": "./plugins/my-plugin"
   }
   ```

4. Add commands/agents as markdown files in respective directories
5. Create CLAUDE.md in your plugin directory with plugin-specific guidance

### Writing Slash Commands

When creating slash command files (`.md` files in `commands/`), follow this pattern:

**Command Structure:**

```markdown
---
description: Brief description of what the command does
argument-hint: [argument description]
---

# Command Name

Brief overview of the command.

## Arguments

- `VARIABLE_NAME`: $ARGUMENTS (optional description or example)

## Instructions

1. Step one using `VARIABLE_NAME`
2. Step two
3. etc.
```

**Key Points:**

- **Arguments section**: Define named variables that capture `$ARGUMENTS` at the top
- **Reference variables**: Use the named variables (e.g., `FEATURE_BRIEF`, `SPEC_DIR`) throughout the rest of the document
- **Write as instructions**: The command is written from Claude's perspective, assuming arguments are already replaced
- **Don't repeat syntax**: Only define the arguments once in the Arguments section
- **Plugin script paths**: When executing bash scripts from plugin directories, use the full marketplace path:
  - Pattern: `~/.claude/plugins/marketplaces/<marketplace-name>/plugins/<plugin-name>/scripts/<script.sh>`
  - Example: `~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/scripts/get-next-spec-id.sh`

**Example:**

```markdown
---
description: Build a new feature using spec-driven development
argument-hint: [feature briefing]
allowed-tools: Bash(bash:*)
---

# Build Feature

## Context

- Next spec ID: !`bash ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/scripts/get-next-spec-id.sh specs`

## Arguments

- `FEATURE_BRIEF`: $ARGUMENTS

## Instructions

1. Use the next spec ID from Context when creating the specification directory
2. Use the `FEATURE_BRIEF` to understand requirements
3. Create specification based on the brief
```

This pattern ensures:

- Arguments are clearly defined once and referenced consistently
- Bash scripts use the full marketplace plugin path
- Context from script execution is available throughout the command

## Plugin Documentation Standards

When working with Claude Code plugins (in `plugins/` directory), follow these documentation standards:

### README.md - For End Users

**Audience**: Developers using the plugin (humans, not Claude)

**Purpose**: Explain what the plugin does and how to use it

**Should contain**:

- What the plugin does (high-level overview)
- How to install it
- How to use the slash commands with examples
- What files/structure gets created
- Example workflows
- Troubleshooting tips
- Clear, user-friendly language

**Should NOT contain**:

- Instructions written for Claude Code
- Internal architecture details for maintainers
- "You are the architect..." type language
- Detailed multi-agent coordination protocols
- Agent resumption technical details

**Example structure**:

```markdown
# Plugin Name

What it does in one sentence.

## Installation

`/plugin install ...`

## Quick Start

/command example

## What Gets Created

Directory structure diagram

## Commands Reference

List of commands with examples

## Examples

Real-world usage scenarios
```

### CLAUDE.md - For Plugin Maintainers

**Audience**: Developers maintaining/developing the plugin itself

**Purpose**: Document plugin architecture and how to modify it

**Should contain**:

- Plugin architecture and design principles
- Directory structure explanation
- Component responsibilities (commands, skills, agents, scripts)
- How to add/modify components
- Common maintenance tasks
- Testing procedures
- Architecture rationale
- Common pitfalls to avoid

**Should NOT contain**:

- How end users should use the plugin (that's in README.md)
- How Claude Code should use the plugin (that's in commands/skills)

**Example structure**:

```markdown
# Plugin Name - Maintainer Documentation

For end-user docs, see README.md.

## Plugin Architecture

Design principles

## Directory Structure

Component explanation

## Component Responsibilities

Commands, skills, agents, scripts

## Common Maintenance Tasks

Step-by-step guides

## Architecture Rationale

Why decisions were made

## Common Pitfalls

What to avoid
```

### Workflow Context Files (Skills, Commands, Agents)

**Purpose**: Provide Claude Code with operational instructions

**Commands** (`commands/*.md`):

- Provide context (script outputs, arguments)
- Load skills
- Direct to workflows
- Keep under 50 lines

**Skills** (`skills/*/SKILL.md`):

- Contain all workflow intelligence
- Coordinate agents
- Reference templates and documentation
- Comprehensive and self-contained

**Agents** (`agents/*.md`):

- Specialized execution instructions
- Concise descriptions (<50 words)
- Detailed system prompts in body

**Key principle**: All Claude Code operational context lives in commands/skills/agents, NOT in README.md or CLAUDE.md
