# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT**: load the `doc-writer:writing-documentation` and `claude-code-knowledge:claude-code-knowledge` Skills to work on this repo

## Repository Overview

This is a local Claude Code plugin marketplace repository. It contains plugin definitions that extend Claude Code with custom commands, agents, and skills.

### Developer commands

This repo is primarily markdown files, but all scripts are written with `bun`

```bash
bun run typecheck # alias: tsc --noEmit
bun run lint # alias: biome lint --fix --unsafe .
```

## Plugin Architecture

### Marketplace Structure

- `.claude-plugin/marketplace.json` - Marketplace catalog that registers all available plugins
- `plugins/` - Directory containing individual plugin implementations
- Each plugin has:
  - `README.md` (user guide - VERY brief, "What", "Why", "How")
  - `CLAUDE.md` (maintainer guide - comprehensive, **KEEP UPDATED WITH EACH CHANGE**)

## Creating New Plugins

1. **Create plugin directory structure**

   ```bash
   mkdir -p plugins/my-plugin/{.claude-plugin,commands,agents,skills}
   ```

2. **Create plugin manifest** `plugins/my-plugin/.claude-plugin/plugin.json`

   Core plugin metadata that travels with the plugin.

   ```json
   {
     "name": "my-plugin",
     "description": "Brief description of what this plugin does",
     "version": "1.0.0",
     "author": {
       "name": "Your Name"
     },
     "keywords": ["tag1", "tag2", "tag3"]
   }
   ```

3. **Register in marketplace** `.claude-plugin/marketplace.json`

   Marketplace catalog that tells Claude Code where to find plugins.

   ```json
   {
     "plugins": [
       {
         "name": "my-plugin",
         "source": "./plugins/my-plugin",
         "category": "development-tools"
       }
     ]
   }
   ```

4. **Add plugin components**
   - Add commands as `.md` files in `commands/`
   - Add agents as `.md` files in `agents/`
   - Add skills in `skills/<skill-name>/SKILL.md`
   - Create both `README.md` and `CLAUDE.md` in plugin directory

## Writing Slash Commands

When creating slash command files (`.md` files in `commands/`), follow this pattern:

**Command Structure:**

```markdown
---
description: Brief description of what the command does
argument-hint: [argument description]
allowed-tools: Bash(bash:*)
disable-model-invocation: true
---

# Command Name

Brief overview of the command.

## Context

- injected context: !`bash ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/<plugin>/scripts/<script>.sh arg`

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

## Plugin Documentation Standards

Two-layer documentation model for reduced maintenance:

### README.md (User Quick Start)

**Audience**: Developers using the plugin

**Structure**: What / Why / How

- **What**: Brief description of what the plugin provides (1-2 sentences)
- **Why**: Key benefits (3-5 bullet points)
- **How**: Installation and basic usage

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

**Key principle**: All Claude Code operational context lives in the plugin files such as commands, agents & skill, NOT in README.md or CLAUDE.md

## Writing Hook Suggestions

When creating hooks that provide suggestions via `additionalContext` or `reason` fields, use XML tags with minimal, concise content. Avoid emojis and decorative formatting.

### TypeScript Types

Use official SDK types from `@anthropic-ai/claude-agent-sdk`:

```typescript
import type {
  PostToolUseHookInput,
  SyncHookJSONOutput,
} from "@anthropic-ai/claude-agent-sdk";

const input = await Bun.stdin.text();
const hookInput: PostToolUseHookInput = JSON.parse(input);

const output: SyncHookJSONOutput = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: "...",
  },
};
```

### Naming Convention

- **Plugin hooks**: `<plugin-PLUGINNAME-suggestion>` (e.g., `<plugin-doc-writer-suggestion>`)
- **Project hooks**: `<project-HOOKNAME-suggestion>` (e.g., `<project-stop-doc-check-suggestion>`)

**Why XML tags?** Anthropic models treat XML as structural elements, users can control with wildcard rules (`<plugin-*-suggestion>`), and they're parseable for future tooling.

### Example

```typescript
const context =
  "<plugin-doc-writer-suggestion>\n" +
  "Detected markdown file modification: FILENAME\n\n" +
  "ESSENTIAL SKILL:\n" +
  "  → doc-writer:writing-documentation\n\n" +
  "RECOMMENDED AGENT:\n" +
  "  → doc-writer:docs-reviewer\n" +
  "</plugin-doc-writer-suggestion>";

const output = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: context,
  },
};
```
