# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a local Claude Code plugin marketplace repository. It contains plugin definitions that extend Claude Code with custom commands, agents, and skills.

**Progressive Disclosure**: Each plugin has its own `CLAUDE.md` with detailed plugin-specific guidance. This root file covers marketplace-level architecture and plugin creation patterns only.

**IMPORTANT**: load the `doc-writer:writing-documentation` and `claude-code-knowledge:claude-code-knowledge` Skills to work on this repo

## Plugin Architecture

### Marketplace Structure

- **`.claude-plugin/marketplace.json`** - Marketplace catalog that registers all available plugins
- **`plugins/`** - Directory containing individual plugin implementations
- **Each plugin has its own `README.md` (user guide - VERY brief) and `CLAUDE.md` (maintainer guide)**

### Plugin Components

Plugins can contain any combination of:

- **Commands** (`.md` files in `commands/`) - Slash commands like `/prime-spec`
- **Agents** (`.md` files in `agents/`) - Specialized sub-agents for Task tool
- **Skills** (`.md` files in `skills/`) - Context that can be loaded into sessions
- **Scripts** (in `scripts/`) - Shell scripts invoked by commands
- **Documentation** (`docs/`, `spec-templates/`, etc.)

## Available Plugins

When working within a specific plugin, **refer to that plugin's `CLAUDE.md`** for detailed architecture and maintenance guidance.

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
     "category": "development-tools",
     "source": "./plugins/my-plugin"
   }
   ```

4. Add commands/agents/skills as markdown files in respective directories
5. **Create both `README.md` (user guide) and `CLAUDE.md` (maintainer guide)** in your plugin directory

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

Two-layer documentation model for reduced maintenance:

### README.md (User Quick Start)

**Audience**: Developers using the plugin

**Structure**: What / Why / How

- **What**: Brief description of what the plugin provides (1-2 sentences)
- **Why**: Key benefits (3-5 bullet points)
- **How**: Installation and basic usage
- **Ask Claude**: Directive to ask Claude for details

**Keep it minimal**: ~30-50 lines. Direct users to ask Claude for comprehensive information.

**Example**:

```markdown
# Plugin Name

Brief description.

## What

- Bullet list of what it provides

## Why

- Key benefits

## How

### Install

/plugin install name@personal-configs-plugins

### Use

Basic usage example

**Ask Claude for details:**
What can this plugin do?
Show me advanced workflows
```

### CLAUDE.md (Comprehensive Documentation)

**Audience**: Maintainers AND Claude (when asked by users)

**Should contain**:

- Plugin architecture and design principles
- Directory structure with detailed component descriptions
- Component responsibilities (commands, skills, agents, scripts, hooks)
- Hook implementation details and testing procedures
- How to add/modify components
- Common maintenance tasks
- Architecture rationale
- Common pitfalls to avoid

### Workflow Context Files (Skills, Commands, Agents)

**Audience**: Claude Code during execution

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
