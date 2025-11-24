# Skills Quick Reference

## What Are Skills?

- **Model-invoked** capabilities - Claude decides when to use them based on description
- Different from slash commands (user-invoked with `/command`)
- Package expertise into discoverable, reusable capabilities

## Skill Types

| Type         | Location             | Use For                           |
| ------------ | -------------------- | --------------------------------- |
| **Personal** | `~/.claude/skills/`  | Individual workflows, experiments |
| **Project**  | `.claude/skills/`    | Team workflows, shared via git    |
| **Plugin**   | Bundled with plugins | Plugin-provided capabilities      |

## SKILL.md Structure

```yaml
---
name: skill-name # lowercase, hyphens only, max 64 chars
description: Brief description of what this does and when to use it
allowed-tools: Read, Bash # Optional: restrict available tools
---
# Skill Name

Instructions for Claude...
```

## Key Fields

- **name**: Skill identifier (lowercase, hyphens, numbers only)
- **description**: **CRITICAL** - tells Claude when to use this Skill
  - Include both WHAT it does and WHEN to use it
  - Add trigger keywords users might mention
- **allowed-tools**: Optional whitelist (e.g., `Read, Grep, Glob` for read-only)

## File Organization

```
skill-name/
├── SKILL.md              # Required: metadata + instructions
├── scripts/              # Optional: executable code (deterministic tasks)
│   └── helper.ts
├── references/           # Optional: docs loaded as needed
│   └── schema.md
└── assets/               # Optional: output resources (templates, etc.)
    └── template.txt
```

### Bundled Resources (Optional)

| Directory | Purpose | When to Use | Examples |
|-----------|---------|-------------|----------|
| **scripts/** | Executable code (TypeScript with Bun) | Deterministic tasks, repeatedly rewritten code | `rotate_pdf.ts`, `format_data.ts` |
| **references/** | Documentation for Claude | Detailed specs, schemas, policies | `api_docs.md`, `database_schema.md` |
| **assets/** | Output resources | Files used in final output | `logo.png`, `template.html`, boilerplate |

**Progressive Disclosure**: Skills load in 3 levels to manage context:
1. **Metadata** (name + description) - Always loaded (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (scripts can execute without reading)

## Discovery

**Skills auto-discover from:**

1. Personal: `~/.claude/skills/`
2. Project: `.claude/skills/`
3. Plugins: installed plugins

Ask Claude: "What Skills are available?" or "List all available Skills"

## Testing

Skills activate automatically based on description matching. Test by asking questions that match your description.

**Example:**

```yaml
description: Extract text from PDF files. Use when working with PDFs.
```

Test: "Can you extract text from this PDF?"

## Debugging Checklist

- [ ] Is description specific enough? (Include WHAT and WHEN)
- [ ] Is file path correct? (`~/.claude/skills/NAME/SKILL.md` or `.claude/skills/NAME/SKILL.md`)
- [ ] Is YAML valid? (check frontmatter with `head -n 10 SKILL.md`)
- [ ] Run `claude --debug` to see Skill loading errors

## Best Practices

1. **Keep focused** - One Skill = One capability
2. **Write clear descriptions** - Include trigger words and use cases
3. **Use allowed-tools** - Restrict capabilities when appropriate (read-only, limited scope)
4. **Progressive disclosure** - Reference additional files when needed
5. **Test with team** - Verify Skills activate as expected

## Sharing Skills

**Recommended:** Use [plugins](/en/plugins) for distribution

**Direct sharing via git:**

1. Create project Skill: `mkdir -p .claude/skills/skill-name`
2. Commit: `git add .claude/skills/ && git commit && git push`
3. Team pulls changes: `git pull` (Skills immediately available)

## Common Patterns

### Read-only Skill

```yaml
allowed-tools: Read, Grep, Glob
```

### Skill with dependencies

```yaml
description: Process Excel files. Requires openpyxl package.
```

### Skill with scripts

```markdown
Run helper:
```bash
bun scripts/helper.ts input.txt
```
```

### Skill with bundled resources

```
pdf-editor/
├── SKILL.md
├── scripts/
│   └── rotate_pdf.ts      # Deterministic PDF rotation (Bun TypeScript)
└── references/
    └── pdf_operations.md  # Detailed PDF manipulation guide
```

## Skill Creation Tools

Helper scripts available in this skill:

```bash
# Initialize new skill with template
bun scripts/skill-creator/init_skill.ts <skill-name> --path <output-dir>

# Validate skill structure
bun scripts/skill-creator/quick_validate.ts <path/to/skill>

# Package skill into distributable zip (validates first)
bun scripts/skill-creator/package_skill.ts <path/to/skill> [output-dir]
```

**Workflow**: Understand examples → Plan resources → Initialize → Edit → Package → Iterate

## More Information

See [docs/skills.md](../docs/skills.md) for:

- Complete authoring guide
- Validation rules
- Tool permissions
- Advanced examples
- Troubleshooting steps
