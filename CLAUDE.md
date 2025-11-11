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

Follow this pattern for minimal, focused manifests where each file has a clear role:

### 1. Create plugin directory structure

```bash
mkdir -p plugins/my-plugin/{.claude-plugin,commands,agents,skills}
```

### 2. Create plugin manifest

**File**: `plugins/my-plugin/.claude-plugin/plugin.json`

**Role**: Core plugin metadata that travels with the plugin

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

**Contains**: Only essential plugin identity and metadata

### 3. Register in marketplace

**File**: `.claude-plugin/marketplace.json`

**Role**: Marketplace catalog that tells Claude Code where to find plugins

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

**Contains**: Only marketplace-specific fields (`source`, `category`) - plugin metadata comes from plugin.json

### 4. Add plugin components

- Add commands as `.md` files in `commands/`
- Add agents as `.md` files in `agents/`
- Add skills in `skills/<skill-name>/SKILL.md`
- **Create both `README.md` (user guide) and `CLAUDE.md` (maintainer guide)** in your plugin directory

### Best Practices

**Minimal duplication**:
- ✅ Plugin.json: Core metadata (name, description, version, author, keywords)
- ✅ Marketplace.json: Source path + marketplace additions (category)
- ❌ Don't repeat description, version, author in both files

**When to duplicate**:
- Marketplace can override plugin.json if you need different descriptions for different marketplaces
- Most plugins don't need this - keep it simple

**Alternative: `strict: false`** (not recommended):
```json
// In marketplace.json - defines everything, no plugin.json needed
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin",
  "description": "What it does",
  "version": "1.0.0",
  "author": { "name": "Your Name" },
  "strict": false  // Makes plugin.json optional
}
```

Why not recommended: Plugin.json keeps metadata with the plugin, making it portable across marketplaces.

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

## Writing Hook Suggestions

When creating hooks that provide suggestions via `additionalContext` or `reason` fields, **ALWAYS use XML tags with minimal, concise content**.

### TypeScript Types for Hooks

**ALWAYS use official SDK types** from `@anthropic-ai/claude-agent-sdk` for hook development:

```typescript
import type {
  PostToolUseHookInput,
  SyncHookJSONOutput,
} from '@anthropic-ai/claude-agent-sdk';

const input = await Bun.stdin.text();
const hookInput: PostToolUseHookInput = JSON.parse(input);

const output: SyncHookJSONOutput = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: "..."
  }
};
```

**Benefits:**
- Full TypeScript type safety
- Auto-complete in IDEs
- Guaranteed compatibility with Claude Code
- No need to manually maintain type definitions

**Available types:**
- `StopHookInput`, `SubagentStopHookInput`
- `PreToolUseHookInput`, `PostToolUseHookInput`
- `UserPromptSubmitHookInput`, `SessionStartHookInput`, `SessionEndHookInput`
- `NotificationHookInput`, `PreCompactHookInput`
- `SyncHookJSONOutput`, `AsyncHookJSONOutput`

### Standard Pattern: Concise XML Tags

**Use structured XML tags with plain text (no emojis, no fancy formatting):**

```typescript
// ✅ CORRECT: Concise XML tag pattern
let context = "<plugin-PLUGINNAME-suggestion>\n";
context += "Detected [what triggered the hook]\n\n";
context += "RECOMMENDED SKILL:\n";
context += "  → skill-name:skill-name\n";
context += "</plugin-PLUGINNAME-suggestion>";
```

**Don't use emojis or visual formatting:**

```typescript
// ❌ INCORRECT: Emojis and visual decorations
let context = "<plugin-PLUGINNAME-suggestion>\n";
context += "📝 SUGGESTION TITLE\n\n";
context += "💡 Key information\n\n";
context += "✅ Detailed explanation...\n";
context += "</plugin-PLUGINNAME-suggestion>";

// ❌ INCORRECT: Box-drawing characters
let context = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
context += "📝 SUGGESTION TITLE\n";
context += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
```

### Naming Convention

Follow this pattern for tag names:

- **Plugin hooks**: `<plugin-PLUGINNAME-suggestion>` (e.g., `<plugin-doc-writer-suggestion>`)
- **Project hooks**: `<project-HOOKNAME-suggestion>` (e.g., `<project-stop-doc-check-suggestion>`)

### Benefits

1. **Anthropic model attention**: XML tags are treated as structural elements, ensuring Claude pays proper attention
2. **User control**: Users can write precise CLAUDE.md rules like `"ALWAYS follow <plugin-*-suggestion> tags"`
3. **Wildcard matching**: Pattern `<plugin-*-suggestion>` allows users to control all plugin suggestions at once
4. **Parseable**: Future tooling can extract and process structured suggestions
5. **Referenceable**: Clear boundaries make suggestions easier to cite and follow
6. **Concise**: Claude already has context about skills/agents/tools - just nudge, don't explain

### Examples

**Plugin hook (PostToolUse):**
```typescript
const context = "<plugin-doc-writer-suggestion>\n" +
  "Detected markdown file modification: FILENAME\n\n" +
  "ESSENTIAL SKILL:\n" +
  "  → doc-writer:writing-documentation\n\n" +
  "RECOMMENDED AGENT:\n" +
  "  → doc-writer:docs-reviewer\n" +
  "</plugin-doc-writer-suggestion>";

const output = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: context
  }
};
```

**Project hook (Stop with blocking):**
```typescript
const context = "<project-stop-doc-check-suggestion>\n" +
  "Before stopping: Review documentation for any files you modified this session.\n" +
  "Files changed in repo (N):\n" +
  "  - file1.ts\n" +
  "  - file2.md\n" +
  "Documentation files (N):\n" +
  "  - README.md\n" +
  "  - CLAUDE.md\n" +
  "Action required:\n" +
  "• Identify which files you changed this session (ignore pre-existing changes)\n" +
  "• Update relevant docs above to reflect your changes only\n" +
  "• Once docs match your changes, you may stop\n" +
  "</project-stop-doc-check-suggestion>";

const output = {
  decision: "block",
  reason: context.trim()
};
```

### User CLAUDE.md Integration

Users can control suggestions in their project CLAUDE.md:

```markdown
# CLAUDE.md

# Emphasize all plugin suggestions
ALWAYS follow `<plugin-*-suggestion>` tags closely.

# Or be selective
- ALWAYS follow `<plugin-doc-writer-suggestion>` recommendations
- Consider `<plugin-langs-suggestion>` when appropriate
```
