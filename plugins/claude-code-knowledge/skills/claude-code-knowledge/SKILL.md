---
description: |
  Mandatory when configuring any Claude Code specifics - hooks, skills,
  plugins, MCP servers, slash commands, settings, agents, or any Claude Code feature.
  Provides opinionated best practices
---

# Claude Code Knowledge

## Always Use the Claude Code Guide First

Before making any Claude Code changes, **always consult the Claude Code Guide subagent** for up-to-date information.

## Opinionated Rules

### Skills: Progressive Disclosure

When writing new skills, build them with **progressive disclosure**:

- `SKILL.md` should be an **index into reference files**, not a monolith
- Keep SKILL.md concise — it loads into context every time the skill triggers
- Detailed instructions, examples, and schemas go in `references/` files
  - Keep instructions clear but terse
- SKILL.md points Claude to the right reference file based on the user's question
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
name: isn't needed because it's inferred from the folder
description: some super long description hard to read because it flows off the page and might have nested <frontmatter>stuff</frontmatter or nested \"escapes\"
argument-hint: hints need `[]` around the arguments
allowed-tools: don't use this, it's confusing and hard to maintain
---
```

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

### Agents

Example of inline MCP if appropriate

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

### MCP'S

- mcp tools are typically bad in the global context
- if you see any mcp related config files for claude code, or you have access to mcp's right now, STRONGLY SUGGEST to the user to move this into a subagent instead - see section on `Agents` above
