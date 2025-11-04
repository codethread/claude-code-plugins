# Claude Code Plugin Marketplace

A local plugin marketplace providing development workflow tools and document processing capabilities. Several plugins in this marketplace originated from [Anthropic's official skills repository](https://github.com/anthropics/skills).

## Quick Start

### 1. Add the Marketplace

In Claude Code, run:
```bash
/plugin marketplace add ./
```

This registers the local marketplace from this repository.

### 2. Install Plugins

```bash
# Development workflow plugins
/plugin install spec-dev@personal-configs-plugins
/plugin install mcp-builder@personal-configs-plugins
/plugin install skill-creator@personal-configs-plugins

# Document processing plugins
/plugin install pdf@personal-configs-plugins
/plugin install xlsx@personal-configs-plugins
/plugin install pptx@personal-configs-plugins
/plugin install docx@personal-configs-plugins
```

### 3. Use the Plugins

After installation, use slash commands, agents, and skills provided by each plugin. See plugin details below.

## Available Plugins

### Development Workflow

#### spec-dev

Multi-agent architecture for systematic feature development with test-driven development, code review, and QA validation.

**Provides:**
- Commands: `/prime-simple`, `/prime-spec`, `/prime-tech`, `/prime-build`, `/refine-spec`
- Agents: `tdd-developer`, `code-reviewer`, `qa-spec-tester`

**Typical workflow:**
1. `/prime-spec` - Requirements gathering and specification
2. `/prime-tech` - Technical design and task breakdown
3. `/prime-build` - Coordinated implementation with review and QA

See `plugins/spec-dev/README.md` for detailed documentation.

#### mcp-builder

Comprehensive guidance for creating high-quality Model Context Protocol (MCP) servers.

**Source:** Adapted from [anthropics/skills](https://github.com/anthropics/skills)

**Use when:**
- Building MCP servers for external APIs
- Working with Python (FastMCP) or Node/TypeScript (MCP SDK)
- Designing agent-centric workflow tools

#### skill-creator

Framework for creating effective skills that extend Claude's capabilities.

**Source:** From [anthropics/skills](https://github.com/anthropics/skills)

**Use when:**
- Creating new skills for specialized domains
- Packaging reusable knowledge for Claude
- Designing skills with SKILL.md and bundled resources

### Document Processing

All document processing plugins are from [anthropics/skills](https://github.com/anthropics/skills).

#### pdf

PDF manipulation: extract text/tables, create documents, merge/split, fill forms, OCR scanned documents.

**Key tools:** pypdf, pdfplumber, reportlab, pytesseract

#### xlsx

Excel operations: create spreadsheets with formulas, analyze data, modify while preserving formulas, financial modeling.

**Key features:** Formula-first approach, financial standards, LibreOffice integration

#### pptx

PowerPoint automation: create from scratch/templates, modify content, work with layouts, extract content.

**Key workflows:** HTML conversion, template-based generation, OOXML manipulation

#### docx

Word document processing: create documents, tracked changes (redlining), comments, OOXML manipulation.

**Key workflows:** docx-js for creation, Document library for editing, comprehensive redlining

## Managing Plugins

```bash
# List marketplaces
/plugin marketplace list

# List installed plugins
/plugin list

# Uninstall a plugin
/plugin uninstall spec-dev

# Remove marketplace
/plugin marketplace remove personal-configs-plugins
```

## Directory Structure

```
.claude-plugin/
└── marketplace.json          # Marketplace catalog

plugins/
├── spec-dev/
│   ├── README.md             # Detailed documentation
│   ├── commands/
│   │   ├── prime-simple.md
│   │   ├── prime-spec.md
│   │   ├── prime-tech.md
│   │   ├── prime-build.md
│   │   └── refine-spec.md
│   ├── agents/
│   │   ├── tdd-developer.md
│   │   ├── code-reviewer.md
│   │   └── qa-spec-tester.md
│   ├── spec-templates/       # Specification templates
│   └── docs/                 # Workflow documentation
├── mcp-builder/
│   └── skills/
│       └── mcp-builder.md
├── skill-creator/
│   └── skills/
│       └── skill-creator.md
├── pdf/
│   └── skills/
│       └── pdf.md
├── xlsx/
│   └── skills/
│       └── xlsx.md
├── pptx/
│   └── skills/
│       └── pptx.md
└── docx/
    └── skills/
        └── docx.md
```

## Creating Your Own Plugin

1. **Create plugin directory structure:**
   ```bash
   mkdir -p plugins/my-plugin/{commands,agents,skills}
   ```

2. **Add plugin metadata** (optional `plugin.json` - marketplace.json registration is sufficient):
   ```json
   {
     "name": "my-plugin",
     "description": "What it does",
     "version": "1.0.0",
     "author": { "name": "Your Name" },
     "keywords": ["tag1", "tag2"]
   }
   ```

3. **Create components** (commands, agents, or skills as markdown files):

   **Command** (`commands/my-command.md`):
   ```markdown
   # My Command

   What this command does and how to use it.
   ```

   **Agent** (`agents/my-agent.md`):
   ```markdown
   # My Agent

   Specialized agent for specific tasks.
   ```

   **Skill** (`skills/my-skill.md`):
   ```markdown
   # My Skill

   Context and knowledge for specific domain.
   ```

4. **Register in `.claude-plugin/marketplace.json`:**
   ```json
   {
     "name": "personal-configs-plugins",
     "plugins": [
       {
         "name": "my-plugin",
         "description": "What it does",
         "version": "1.0.0",
         "author": { "name": "Your Name" },
         "keywords": ["tag1", "tag2"],
         "source": "./plugins/my-plugin"
       }
     ]
   }
   ```

5. **Install and use:**
   ```bash
   /plugin install my-plugin@personal-configs-plugins
   ```

## Attribution

Several plugins in this marketplace are sourced from or adapted from [Anthropic's official skills repository](https://github.com/anthropics/skills):
- **Document processing plugins** (pdf, xlsx, pptx, docx): From anthropics/skills
- **mcp-builder**: Adapted from anthropics/skills
- **skill-creator**: From anthropics/skills

## Reference

- [Official Plugin Marketplace Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [Anthropic Skills Repository](https://github.com/anthropics/skills) - Source for document processing and skill creation tools
