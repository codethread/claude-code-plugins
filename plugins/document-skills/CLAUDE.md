# Document Processing Skills - Maintainer Documentation

For end-user documentation, see [README.md](README.md).

## Plugin Architecture

The document-skills plugin is a **parent container** for four independent sub-plugins, each focused on a specific document format. This architecture allows:

- **Independent installation** - Users install only the skills they need
- **Focused expertise** - Each skill has specialized knowledge for its format
- **Maintainable code** - Changes to one format don't affect others
- **Consistent patterns** - All skills follow similar structure and conventions

## Directory Structure

```
plugins/document-skills/
├── README.md                 # End-user documentation
├── CLAUDE.md                 # This file - maintainer documentation
├── pdf/                      # PDF manipulation skill
│   ├── .claude-plugin/       # Plugin metadata
│   ├── skills/pdf/           # Skill implementation
│   │   ├── SKILL.md          # Main skill logic
│   │   ├── reference.md      # Library reference
│   │   └── forms.md          # Form-specific workflows
│   ├── CLAUDE.md             # PDF skill maintainer docs
│   └── LICENSE.txt
├── xlsx/                     # Excel spreadsheet skill
│   ├── .claude-plugin/
│   ├── skills/xlsx/
│   │   └── SKILL.md
│   ├── CLAUDE.md
│   └── LICENSE.txt
├── pptx/                     # PowerPoint presentation skill
│   ├── .claude-plugin/
│   ├── skills/pptx/
│   │   ├── SKILL.md
│   │   ├── ooxml.md          # OOXML structure reference
│   │   └── html2pptx.md      # HTML conversion utilities
│   ├── CLAUDE.md
│   └── LICENSE.txt
└── docx/                     # Word document skill
    ├── .claude-plugin/
    ├── skills/docx/
    │   ├── SKILL.md
    │   ├── ooxml.md          # OOXML structure reference
    │   └── docx-js.md        # JavaScript library reference
    ├── CLAUDE.md
    └── LICENSE.txt
```

## Sub-Plugin Registration

Each sub-plugin is registered independently in `.claude-plugin/marketplace.json`:

```json
{
  "name": "pdf",
  "description": "PDF manipulation...",
  "source": "./plugins/document-skills/pdf",
  "category": "document-processing"
}
```

This allows users to install skills individually:
```
/plugin install pdf@personal-configs-plugins
/plugin install xlsx@personal-configs-plugins
```

## Component Responsibilities

### Parent Plugin (document-skills/)

- **README.md** - Overview of all document skills for end users
- **CLAUDE.md** - Architecture and maintenance documentation (this file)
- **No commands/skills** - This is a container only; actual skills live in sub-plugins

### Sub-Plugins (pdf/, xlsx/, pptx/, docx/)

Each sub-plugin contains:

- **.claude-plugin/** - Plugin metadata for Claude Code
- **skills/\*/SKILL.md** - Main skill implementation with workflows and best practices
- **skills/\*/reference.md** - Library documentation and API references
- **CLAUDE.md** - Maintainer documentation specific to that format
- **LICENSE.txt** - License information

### Skill Files (skills/\*/SKILL.md)

These files are loaded when users invoke the skill. They should contain:

- **Use When** section - When to use this skill
- **Key Tools** section - Libraries and their purposes
- **Common Workflows** - Step-by-step procedures
- **Best Practices** - Guidelines for quality work
- **Reference files** - Links to detailed documentation

## Common Maintenance Tasks

### Adding a New Document Format

1. Create new directory structure:
   ```bash
   mkdir -p plugins/document-skills/newformat/skills/newformat
   ```

2. Create plugin metadata:
   ```bash
   mkdir plugins/document-skills/newformat/.claude-plugin
   ```

3. Write SKILL.md following the pattern of existing skills

4. Register in marketplace.json:
   ```json
   {
     "name": "newformat",
     "description": "...",
     "source": "./plugins/document-skills/newformat",
     "category": "document-processing"
   }
   ```

5. Update parent README.md to include new format

### Updating a Skill

1. Locate the skill file: `plugins/document-skills/{format}/skills/{format}/SKILL.md`
2. Make changes following skill writing guidelines
3. Test by installing and using the skill: `/plugin install {format}@personal-configs-plugins`
4. Update version in marketplace.json if making breaking changes

### Adding Reference Documentation

Reference documentation (like library APIs, OOXML structures) should be:

- Placed in `skills/{format}/` directory alongside SKILL.md
- Named descriptively (e.g., `forms.md`, `ooxml.md`, `reference.md`)
- Referenced from SKILL.md for context loading
- Focused on technical details, not workflows

### Testing Changes

1. Install plugin locally:
   ```bash
   /plugin marketplace add /Users/codethread/dev/learn/claude-plugins
   /plugin install {format}@personal-configs-plugins
   ```

2. Invoke skill and test workflows:
   ```bash
   /{format}
   ```

3. Verify all referenced files load correctly

4. Test common use cases from README.md examples

## Architecture Rationale

### Why Separate Sub-Plugins?

- **Selective installation** - Users don't need all document formats
- **Smaller context** - Each skill loads only relevant documentation
- **Independent versioning** - Update one format without affecting others
- **Clear boundaries** - Each format has distinct tools and workflows

### Why No Commands?

Document skills use the **skill invocation pattern** rather than slash commands because:

- Skills are loaded on-demand when needed
- Document workflows often require back-and-forth with Claude
- Skills provide context without forcing specific command flows
- Users can integrate document operations into broader workflows

### Why Reference Files?

Large reference documentation (like OOXML specs, library APIs) are separated because:

- Keeps SKILL.md focused on workflows
- Loads additional context only when needed
- Easier to maintain and update
- Reduces token usage when reference isn't required

## Common Pitfalls

### Don't Mix User and Maintainer Documentation

- **WRONG** - Adding plugin installation to CLAUDE.md
- **RIGHT** - Installation goes in README.md, architecture goes in CLAUDE.md

### Don't Add Claude Instructions to README

- **WRONG** - "You are a PDF expert. When users ask you to..."
- **RIGHT** - "This skill provides PDF manipulation capabilities. Use `/pdf` to..."

### Don't Duplicate Content

- **WRONG** - Copying full workflows from SKILL.md into README.md
- **RIGHT** - README shows examples, SKILL.md has detailed procedures

### Don't Forget to Update Marketplace

When adding new skills or making breaking changes:
- Update version in `.claude-plugin/marketplace.json`
- Update parent README.md if adding new formats
- Test installation from marketplace

## Related Documentation

- Plugin standards: `/Users/codethread/CLAUDE.md` (Plugin Documentation Standards section)
- Marketplace configuration: `.claude-plugin/marketplace.json`
- Individual skill maintainer docs: `{format}/CLAUDE.md` files
