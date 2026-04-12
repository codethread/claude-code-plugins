---
description: |
  Audit and update Claude Code config in this project
  to match claude-code-knowledge conventions
disable-model-invocation: true
---

# Audit Claude Code Configuration

Audit the **project-local** Claude Code configuration (`.claude/` directory and any plugin directories in this repo) and update it to follow the conventions from the Claude Code Knowledge skill.

**Scope**: Only files in the current working directory. Never touch `~/.claude/` or any global/user-level config.

## Variables

### Agents

- `KNOWLEDGE_AUDITOR_AGENT`: `knowledge-auditor`
- `CLAUDE_CODE_GUIDE_AGENT`: `claude-code-guide`

### Skills

- `CLAUDE_CODE_KNOWLEDGE_SKILL`: `claude-code-knowledge:claude-code-knowledge`

## Concern Areas

Audit each area sequentially using the `$KNOWLEDGE_AUDITOR_AGENT` agent. Run **one agent at a time** to avoid concurrent edits to shared files.

1. **hooks** — hook configs, hook scripts, inline vs script decisions
2. **skills** — SKILL.md structure, front matter, progressive disclosure
3. **commands** — slash command files, front matter, argument patterns
4. **agents** — agent files, descriptions, tool inventory, prompt structure
5. **settings** — settings.json, MCP config

## Instructions

### Phase 1: Gather official schemas

Before spawning any auditors, use the `$CLAUDE_CODE_GUIDE_AGENT` agent to fetch the current official front matter schemas. Ask it:

> List all supported front matter fields (with types and descriptions) for each of these Claude Code file types:
> 1. Skills (SKILL.md)
> 2. Slash commands (.md in commands/)
> 3. Agents (.md in agents/)
>
> For each file type, list every field, whether it's required or optional, and valid values where applicable.

Save the response — you will pass it to each auditor.

### Phase 2: Sequential audits

For each concern area, in order:

1. Spawn the `$KNOWLEDGE_AUDITOR_AGENT` agent with:
   - Which concern area to audit
   - For skills, commands, and agents: include the official schema from Phase 1 so the auditor can validate front matter fields without needing the Guide
   - For hooks and settings: just the concern area (no schema needed)
2. Wait for it to complete before starting the next area
3. If the agent reports no files found for a concern area, skip to the next

After all areas are done, provide a combined summary of everything that changed.

## Notes

- The auditor preserves existing behaviour — it restructures and reformats, not rewrite logic
- Ambiguous changes are flagged but not applied
- Review the combined summary and verify the changes before committing
