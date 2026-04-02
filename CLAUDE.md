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

### NixOS Development

A `flake.nix` provides a dev shell with `bun`, `biome`, and `typescript`. All project hooks in `.claude/settings.json` use `.claude/hooks/with-nix.sh` to automatically enter the nix shell when `flake.nix` is present.

### Developer commands

This repo is primarily markdown files, but all scripts are written with `bun`

```bash
make # Runs: bun install && bun run build
claude --init # Runs Setup hooks (bun install + build), then starts interactive session
claude --init-only # Runs Setup hooks then exits (for CI)
claude --maintenance # Runs Setup hooks + verify (lint + typecheck)
bun run verify # Runs: lint && typecheck
bun run typecheck # Uses: tsc --build (with project references)
bun run lint # Uses: biome lint --fix --unsafe .
```

**Setup Hooks (in `.claude/settings.json`):**
- `--init` / `--init-only`: Runs `bun install && bun run build` — installs deps and compiles all workspaces
- `--maintenance`: Runs `bun install && bun run build && bun run verify` — full rebuild plus lint and typecheck

**Build Process:**
- `bun run build` runs `tsc --build` (project references)

## Domain Knowledge

Internal architecture, design decisions, and component details are documented as persistent domain specs in [`specs/README.md`](./specs/README.md). Read the relevant spec before working on a domain.

## Plugin Architecture

### Marketplace Structure

- `.claude-plugin/marketplace.json` - Marketplace catalog that registers all available plugins
- `plugins/` - Directory containing individual plugin implementations
- `lib/` - Shared library package for plugin and hook development (see `lib/CLAUDE.md`)
- Each plugin has:
  - `README.md` (user guide - VERY brief, "What", "Why", "How")
  - `CLAUDE.md` (maintainer pointers - links to spec, plus notes not captured elsewhere)

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
     "author": {
       "name": "Your Name"
     },
     "keywords": ["tag1", "tag2", "tag3"]
   }
   ```

   **Note:** Do not put `version` here — version is tracked in `marketplace.json` (see step 5).

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
       "description": "Marketplace description"
     },
     "plugins": [
       {
         "name": "my-plugin",
         "version": "1.0.0",
         "source": "./plugins/my-plugin",
         "category": "development-tools"
       }
     ]
   }
   ```

   Each plugin entry has a `version` field — this is the single source of truth for plugin versions (not in `plugin.json`). For relative-path plugins, `plugin.json` version would silently override, so we keep it only here.

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
  - Example: `$CT_PLUGINS_DIR/langs/scripts/some-script.sh`
  - Note: Users must set `CT_PLUGINS_DIR=~/.claude/plugins/marketplaces/codethread-plugins/plugins` (see README.md)

## Plugin Documentation Standards

Three-layer documentation model:

### README.md (User Quick Start)

**Audience**: Developers using the plugin. Usage, not internals.

**Structure**: What / Why / How. ~30-50 lines.

### CLAUDE.md (Maintainer Pointers)

**Audience**: Maintainers and Claude

Points to the domain spec in `specs/` for architecture and internals. Contains only:
- Link to the relevant spec
- Maintainer-specific notes not captured in the spec (e.g. future waves, gotchas)

**Key principle**: All Claude Code operational context lives in the plugin files (commands, agents, skills), NOT in README.md or CLAUDE.md. Internal architecture lives in `specs/`.

### specs/<domain>.md (Single Source of Truth)

**Audience**: Maintainers, Claude, and other specs

Architecture, design decisions, data model, interfaces, component details. See `specs/README.md` for the index.

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

- **Plugin hooks**: `<plugin-PLUGINNAME-suggestion>` (e.g., `<plugin-langs-suggestion>`)
- **Project hooks**: `<project-HOOKNAME-suggestion>` (e.g., `<project-stop-doc-check-suggestion>`)

**Why XML tags?** Anthropic models treat XML as structural elements, users can control with wildcard rules (`<plugin-*-suggestion>`), and they're parseable for future tooling.

### Example

```typescript
const context =
  "<plugin-langs-suggestion>\n" +
  "Detected TypeScript file: FILENAME\n\n" +
  "RECOMMENDED SKILL:\n" +
  "  → langs:lang-typescript\n" +
  "</plugin-langs-suggestion>";

const output = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: context,
  },
};
```
