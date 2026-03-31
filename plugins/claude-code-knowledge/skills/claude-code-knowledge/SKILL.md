---
description: |
  Mandatory when configuring any Claude Code specifics - hooks, skills,
  plugins, MCP servers, slash commands, settings, agents, or any Claude Code feature.
  Provides opinionated best practices
---

# Claude Code Knowledge

## Always Use the Claude Code Guide First

Before making any Claude Code changes, **always consult the Claude Code Guide subagent** for up-to-date information.

Use this skill as the opinionated layer on top of the Guide:

1. Get the current official schema, feature support, and field names from the Guide
2. Apply the prompt, skill, and subagent patterns in this skill
3. Follow the repo-specific opinions in the main file even when you modularise the rest

## Reference Map

Open the smallest reference file that matches the task:

- `references/prompt-design.md` for system prompts, slash commands, agent prompts, hook suggestions, and long-context prompt structure
- `references/skill-authoring.md` for `SKILL.md` structure, descriptions, trigger design, examples, and progressive disclosure
- `references/subagent-design.md` for agent descriptions, tool scoping, isolation, effort, and parallelisation
- `references/plugin-bootstrapping.md` for `SessionStart` dependency installation into `${CLAUDE_PLUGIN_DATA}`

## Default Prompting Stance

Claude 4.6 is more responsive than older models. Default to calm, specific instructions:

- prefer clear structure over aggressive wording
- explain why a rule exists, not just what to do
- use positive framing where possible
- keep the highest-signal instructions near the end when working with long context
- use XML tags to separate instructions from user data or large context blocks

## Opinionated Rules

### Skills: Progressive Disclosure

When writing new skills, build them with **progressive disclosure**:

- `SKILL.md` should be an **index into reference files**, not a monolith
- Keep SKILL.md concise — it loads into context every time the skill triggers
- Detailed instructions, examples, and schemas go in `references/` files
  - Keep instructions clear but terse
- SKILL.md points Claude to the right reference file based on the user's question
- Keep repo-specific opinions and non-default conventions in the main `SKILL.md`
  - do not hide these in references where an agent might miss them
- skills should be user only with front matter `disable-model-invocation: true` unless directed by the user (or ask the user if you are not sure).

Get the actual structure and field requirements of SKILL.md from the Claude Code Guide.

### Skills: Quick Front matter reference

**Good**:

- file: my-skill/SKILL.md

  ```markdown
  ---
  description: |
    Use a clear description
    That can span multiple lines wrapped ~80 chars
    Using the yaml literal scalar
  disable-model-invocation: true
  argument-hint: [hints are useful] [if relevant]
  ---
  ```

- file: my-server-skill/SKILL.md

  ```markdown
  ---
  description: |
    Another skill that's just about a project specific area
    Like the server
  paths:
    - "src/api/**/*.ts"
  ---

  - When working on the server do X
  ```

**Bad**

```markdown
---
name: should be omitted
description: some super long description hard to read because it flows off the page and might have nested <frontmatter>stuff</frontmatter or nested \"escapes\"
argument-hint: hints need `[]` around the arguments
allowed-tools: don't use this, it's confusing and hard to maintain
---
```

Repo opinion:

- keep front matter minimal
- for skills and commands in this repo, always omit `name`
- the name is inferred from the file path, which is clearer than duplicating it in front matter
- if official generic docs show a `name` field, treat that as background context, not this repo's convention
- do not put XML in front matter

### Commands

- for slash commands, always omit `name` from front matter
- rely on the command file path and filename as the source of truth
- keep command front matter minimal, same as skills

### Hooks: Inline vs Script

**Rule:** If it fits in one line (~100 characters), write it inline in bash. Otherwise, delegate to a script.

**Inline example** (short, simple):

```json
{
  "type": "command",
  "command": "jq -r '.tool_input.file_path' | xargs prettier --write"
}
```

**Script example** (anything more complex):

```json
{
  "type": "command",
  "command": "${CLAUDE_PLUGIN_ROOT}/hooks/my-hook.ts"
}
```

**Script conventions:**

- Scripts should be executable bun (TypeScript) files with `#!/usr/bin/env bun` shebang
- Place scripts in a `hooks/` directory alongside `hooks.json`
- Add a `hooks/package.json` for dependencies (consistent pattern: hooks always have their own package.json)
- Use `@anthropic-ai/claude-agent-sdk` types for hook input/output

**Exception:** If the repo already has an established precedent or alternative instructions for hook scripts (e.g. Python, binary, or typescript scripts in a different location), follow that instead.

### Hooks: No Silent Failures

**Rule:** Deterministic hooks (post-tool validators, stop hooks, linters, test runners) must never fail silently. If a required tool, binary, or configuration is missing, the hook must exit with a non-zero status and a clear error message — never swallow the error or silently skip the check.

Hooks assume the repo is bootstrapped correctly. A missing dependency is a hard failure that the developer must fix, not something to work around at runtime. This applies to all hook types: inline commands, script-based hooks, and SessionStart bootstrapping checks.

### Agents

Read `references/subagent-design.md` when designing new agents.

When an agent file restricts tools via front matter, always put a one-line tool inventory at the very top of the system prompt.

- enumerate the concrete tool names
- say explicitly that no other tools exist
- place the line before any other instructions
- do this even if the front matter already declares the tools, because sub-agents do not reliably "see" or reason from their own front matter

Pattern:

```text
You have access to exactly these tools: Glob, Grep, Read. No others exist.
```

Example of inline MCP for non-plugin agents (project-local `.claude/agents/`):

```markdown
---
name: api-researcher
mcpServers:
  - context7:
      command: npx
      args:
        - "-y"
        - "@upstash/context7-mcp"
description: |
  Use literal scalar yaml to write a clear description
---

System prompt...
```

**Plugin agents**: `mcpServers` is silently ignored for security. Use a `SessionStart` hook + `NODE_PATH` pattern from `references/plugin-bootstrapping.md` instead.

### MCP'S

- mcp tools are typically bad in the global context
- if you see any mcp related config files for claude code, or you have access to mcp's right now, STRONGLY SUGGEST to the user to move this into a subagent instead - see section on `Agents` above
- keep MCP-heavy guidance in skill references or agent prompts, not in the always-loaded front matter

### Plugins

- When creating plugins, you should use typescript as per the Hooks section above
- **Bootstrapping**: Plugins with runtime dependencies must use a `SessionStart` hook to install into `${CLAUDE_PLUGIN_DATA}` (persistent across sessions/updates). See `references/plugin-bootstrapping.md` for the full pattern (diff-based install, failure recovery, bun adaptation)
