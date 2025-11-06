# Skill Creator Plugin

A Claude Code plugin for creating effective skills that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

## What It Does

This plugin guides you through creating high-quality skills for Claude Code. Skills are modular packages that transform Claude from a general-purpose agent into a specialized expert equipped with domain-specific knowledge, workflows, and tools.

Whether you're building skills for PDF manipulation, financial analysis, or company-specific workflows, this plugin provides a proven framework for creating skills that work effectively.

## Installation

```bash
# Add the marketplace (if not already added)
/plugin marketplace add <path-to-this-repo>

# Install the plugin
/plugin install skill-creator@personal-configs-plugins
```

## Quick Start

Load the skill-creator skill when you need to create a new skill:

```bash
/skill-creator
```

Then describe what you want the skill to do:

```
Create a skill for working with financial spreadsheets that need to follow company accounting standards
```

Claude will guide you through the complete skill creation process.

## What Gets Created

The plugin creates a complete skill package with proper structure:

```
my-skill/
├── SKILL.md              # Required: Core skill instructions
└── Bundled Resources (optional)
    ├── scripts/          # Executable code (Python/Bash)
    ├── references/       # Documentation to load as needed
    └── assets/           # Files used in output (templates, icons)
```

### Example: PDF Skill

```
pdf/
├── SKILL.md                    # Instructions for PDF manipulation
├── scripts/
│   ├── rotate_pdf.py          # Deterministic PDF rotation
│   └── merge_pdfs.py          # PDF merging utility
├── references/
│   └── forms.md               # Form field documentation
└── assets/
    └── template.pdf           # Blank PDF template
```

## Skill Creation Process

The plugin guides you through six phases:

### 1. Understanding the Skill

Claude gathers concrete examples of how the skill will be used:
- "What functionality should this skill support?"
- "Can you give examples of how users will use it?"
- "What would trigger this skill?"

### 2. Planning Reusable Contents

Identify what resources the skill needs:
- **Scripts** - For deterministic operations (rotating PDFs, parsing data)
- **References** - For documentation that's loaded as needed (schemas, policies)
- **Assets** - For templates and files used in output (boilerplate, logos)

### 3. Initializing the Skill

The plugin runs `init_skill.py` to create the skill structure with proper templates.

### 4. Editing the Skill

Claude helps you write:
- Clear SKILL.md with focused instructions
- Bundled scripts for repetitive operations
- Reference documentation for domain knowledge
- Asset files for templates and resources

### 5. Packaging the Skill

The plugin validates and packages your skill into a distributable `.zip` file using `package_skill.py`.

### 6. Iterating

Test the skill and refine based on real usage patterns.

## Skills Scripts

The plugin includes three helper scripts for skill development:

### `init_skill.py`

Creates a new skill with proper template structure.

```bash
scripts/init_skill.py my-skill --path ./output-directory
```

Creates:
- `SKILL.md` with proper frontmatter and TODO placeholders
- Example directories: `scripts/`, `references/`, `assets/`
- Example files showing the structure

### `package_skill.py`

Validates and packages a skill for distribution.

```bash
scripts/package_skill.py path/to/my-skill
scripts/package_skill.py path/to/my-skill ./dist  # Custom output
```

Automatically:
- Validates YAML frontmatter and structure
- Checks naming conventions
- Verifies file organization
- Creates a `.zip` file for distribution

### `quick_validate.py`

Validates a skill without packaging.

```bash
scripts/quick_validate.py path/to/my-skill
```

## Examples

### Creating a Financial Analysis Skill

```bash
/skill-creator
```

```
I need a skill for financial analysis that:
- Uses our company's chart of accounts
- Follows GAAP standards
- Generates monthly reports
```

Claude creates:
- `SKILL.md` with financial analysis workflows
- `references/chart_of_accounts.md` with your account schema
- `references/gaap_standards.md` with relevant standards
- `scripts/generate_report.py` for deterministic report generation
- `assets/report_template.xlsx` for Excel output

### Creating a Brand Guidelines Skill

```bash
/skill-creator
```

```
Create a skill that helps maintain our brand guidelines when creating documents
```

Claude creates:
- `SKILL.md` with brand application instructions
- `references/brand_guidelines.md` with detailed rules
- `assets/logo.png` with brand logo
- `assets/fonts/` with brand typography
- `assets/color_palette.json` with brand colors

## Best Practices

### Skill Design

1. **Focus on one domain** - Don't create mega-skills that do everything
2. **Start with examples** - Understand concrete use cases first
3. **Progressive disclosure** - Keep SKILL.md lean, details in references
4. **Test in reality** - Iterate based on actual usage

### Writing SKILL.md

1. **Clear metadata** - Write specific descriptions that help Claude decide when to use the skill
2. **Imperative form** - Write instructions, not conversations ("To accomplish X, do Y")
3. **Reference resources** - Tell Claude about bundled scripts, references, and assets
4. **Keep it lean** - Move detailed docs to `references/`

### Bundled Resources

1. **Scripts** - For operations that get rewritten repeatedly
2. **References** - For documentation Claude should load selectively
3. **Assets** - For files that go into final output
4. **Avoid duplication** - Each piece of info lives in exactly one place

## Understanding Progressive Disclosure

Skills use a three-level loading system:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - Loaded when skill triggers (<5k words)
3. **Bundled resources** - Loaded as needed by Claude (unlimited)

This keeps context efficient while providing comprehensive capabilities.

## Troubleshooting

**Q: When should I create a skill vs. just prompting Claude?**
A: Create a skill when you find yourself repeatedly explaining the same workflow, domain knowledge, or providing the same resources.

**Q: How do I know what goes in SKILL.md vs. references?**
A: SKILL.md has essential workflows and instructions. References have detailed documentation that Claude loads selectively.

**Q: Can I include Python packages or dependencies?**
A: Scripts can use standard library or expect common packages. Document requirements in SKILL.md.

**Q: How do I update an existing skill?**
A: Load `/skill-creator` and tell Claude which skill to update and what changes you need.

**Q: Where do I share completed skills?**
A: Package them with `package_skill.py` and distribute the `.zip` file to other Claude Code users.

## Advanced Usage

### Manual Skill Development

You can manually create skills without the skill-creator plugin:

1. Create directory with `SKILL.md` containing proper frontmatter
2. Add optional `scripts/`, `references/`, `assets/` directories
3. Validate with `scripts/quick_validate.py`
4. Package with `scripts/package_skill.py`

### Custom Validation

The validation scripts check:
- YAML frontmatter format
- Required fields (name, description)
- Directory structure conventions
- File organization

Review validation errors and fix before packaging.

## Examples of Great Skills

**PDF Skill**: Manipulation, form filling, rotation - scripts for deterministic operations, references for form specs

**XLSX Skill**: Spreadsheet operations - scripts for Excel manipulation, assets for templates

**MCP Builder Skill**: MCP server development - references for best practices and patterns, no scripts needed

**Brand Guidelines Skill**: Document creation - assets for logos/fonts, references for guidelines

## Learn More

- **Skill Templates**: See generated `SKILL.md` after running `init_skill.py`
- **Plugin Development**: See `CLAUDE.md` for maintainer documentation
- **Helper Scripts**: Located in `skills/skill-creator/scripts/`

---

**Philosophy**: Skills are onboarding guides for specific domains. They transform Claude from general-purpose to specialized by providing procedural knowledge, tools, and resources that no model can fully possess.
