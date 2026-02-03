# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT**: load the `doc-writer:writing-documentation` and `claude-code-knowledge:claude-code-knowledge` Skills to work on this repo

## Repository Overview

This is a local Claude Code plugin marketplace repository. It contains plugin definitions that extend Claude Code with custom commands, agents, and skills.

### Workspace Structure

This repo uses bun workspaces with each plugin having its own `package.json`:
- Root workspace: `lib`, `plugins/*`, `.claude/hooks`
- Plugin packages: `@claude-plugins/<plugin-name>`
- Shared library: `@claude-plugins/lib`
- Project hooks: `claude-project-hooks` (in `.claude/hooks`)
- TypeScript project references for proper dependency tracking

**TypeScript Configuration:**
- `tsconfig.base.json` - Shared compiler options
- Root `tsconfig.json` - Project references to all workspaces
- Each workspace has its own `tsconfig.json` extending the base
- `lib` emits declaration files for other workspaces to consume

### Developer commands

This repo is primarily markdown files, but all scripts are written with `bun`

```bash
make # Runs: bun install && bun run build
bun run verify # Runs: lint && typecheck
bun run typecheck # Uses: tsc --build (with project references)
bun run lint # Uses: biome lint --fix --unsafe .
```

**Build Process:**
- `bun run build` compiles all workspace packages
- `postbuild` automatically cleans bun build artifacts (`.*.bun-build` files) from all workspaces
- Cleanup script: `scripts/clean-build-artifacts.ts` (uses concurrent operations)

## Plugin Architecture

### Marketplace Structure

- `.claude-plugin/marketplace.json` - Marketplace catalog that registers all available plugins
- `plugins/` - Directory containing individual plugin implementations
- `lib/` - Shared library package for plugin and hook development (see `lib/CLAUDE.md`)
- Each plugin has:
  - `README.md` (user guide - VERY brief, "What", "Why", "How")
  - `CLAUDE.md` (maintainer guide - comprehensive, **KEEP UPDATED WITH EACH CHANGE**)

### Shared Library (@claude-plugins/lib)

**IMPORTANT**: Before building new functionality, check `lib/` for existing utilities to avoid duplication.

The `@claude-plugins/lib` package provides shared utilities that can be imported by plugins and hooks:

```typescript
import { readSessionCache, writeSessionCache } from '@claude-plugins/lib/session-cache';
```

See `lib/CLAUDE.md` for detailed documentation of available utilities including:
- Session cache management (time-based filtering, session state tracking)
- Future shared utilities as they're added

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

   **Important about hooks:** Do NOT add a `"hooks"` field that references `./hooks/hooks.json` or `hooks/hooks.json`. Claude Code automatically loads `hooks/hooks.json` from the standard location. The manifest's `hooks` field should only reference ADDITIONAL hook files beyond the standard location (e.g., `"hooks": "./hooks/custom-hooks.json"`). Referencing the standard location will cause a duplicate registration error.

3. **Create plugin package.json** `plugins/my-plugin/package.json`

   Required for workspace configuration. Include if plugin has TypeScript files:

   ```json
   {
     "name": "@claude-plugins/my-plugin",
     "version": "1.0.0",
     "description": "Brief description",
     "private": true,
     "type": "module",
     "scripts": {
       "typecheck": "tsc --noEmit"
     },
     "devDependencies": {
       "@anthropic-ai/claude-agent-sdk": "^0.1.37",
       "@types/bun": "^1.3.2",
       "typescript": "^5.7.2"
     },
     "author": "Your Name",
     "license": "MIT"
   }
   ```

   **Nested package.json files**: If your plugin has TypeScript hooks or scripts, create package.json in those directories (e.g., `hooks/package.json`) with minimal dependencies and add `@claude-plugins/lib` as a workspace dependency if using shared utilities.

4. **Create TypeScript configuration** `plugins/my-plugin/tsconfig.json` (if plugin has TypeScript)

   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "composite": true,
       "outDir": "dist"
     },
     "include": ["**/*.ts"],
     "exclude": ["node_modules", "dist"],
     "references": [
       { "path": "../../lib" }
     ]
   }
   ```

   Then add the plugin to root `tsconfig.json` references array.

5. **Register in marketplace** `.claude-plugin/marketplace.json`

   Marketplace catalog that tells Claude Code where to find plugins.

   ```json
   {
     "name": "marketplace-name",
     "owner": {
       "name": "Owner Name",
       "email": "[email protected]"
     },
     "metadata": {
       "description": "Marketplace description",
       "version": "1.0.0"
     },
     "plugins": [
       {
         "name": "my-plugin",
         "source": "./plugins/my-plugin",
         "category": "development-tools"
       }
     ]
   }
   ```

   The `metadata.version` field tracks the marketplace version, which receives a minor bump with every release (handled by `/release` command).

6. **Add plugin components**
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

- injected context: !`bash $CT_PLUGINS_DIR/<plugin>/scripts/<script>.sh arg`

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
- **Plugin script paths**: When executing bash scripts from plugin directories, use the `CT_PLUGINS_DIR` environment variable:
  - Pattern: `$CT_PLUGINS_DIR/<plugin-name>/scripts/<script>.sh`
  - Example: `$CT_PLUGINS_DIR/spec-dev/scripts/get-next-spec-id.sh`
  - Note: Users must set `CT_PLUGINS_DIR=~/.claude/plugins/marketplaces/codethread-plugins/plugins` (see README.md)

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

/plugin install name@codethread-plugins

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
