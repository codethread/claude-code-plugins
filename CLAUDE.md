# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a local Claude Code plugin marketplace repository. It contains plugin definitions that extend Claude Code with custom commands, agents, and skills. The primary plugin is `spec-dev`, which implements a multi-agent spec-driven development workflow.

## Plugin Architecture

### Marketplace Structure

- **`.claude-plugin/marketplace.json`** - Marketplace catalog that registers all available plugins
- **`plugins/`** - Directory containing individual plugin implementations
- Each plugin has its own README.md with detailed documentation

### Plugin Components

Plugins can contain any combination of:
- **Commands** (`.md` files in `commands/`) - Slash commands like `/prime-spec`
- **Agents** (`.md` files in `agents/`) - Specialized sub-agents for Task tool
- **Skills** (`.md` files in `skills/`) - Context that can be loaded into sessions
- **Documentation** (`docs/`, `spec-templates/`, etc.)

## Available Plugins

This marketplace provides several plugin categories:

### Development Workflow
- **spec-dev** - Multi-agent spec-driven development workflow
- **mcp-builder** - MCP server development guide
- **skill-creator** - Skill creation framework

### Document Processing
- **pdf** - PDF manipulation and form filling
- **xlsx** - Excel spreadsheet operations
- **pptx** - PowerPoint presentation creation
- **docx** - Word document editing with tracked changes

## Plugin Management Commands

```bash
# Register this marketplace locally
/plugin marketplace add ./

# Install plugins
/plugin install spec-dev@personal-configs-plugins
/plugin install mcp-builder@personal-configs-plugins
/plugin install skill-creator@personal-configs-plugins
/plugin install pdf@personal-configs-plugins
/plugin install xlsx@personal-configs-plugins
/plugin install pptx@personal-configs-plugins
/plugin install docx@personal-configs-plugins

# List installed plugins
/plugin list

# Remove plugin
/plugin uninstall <plugin-name>
```

## Plugin Details

### Spec-Dev Plugin

The `spec-dev` plugin implements a multi-agent architecture for systematic feature development.

### Key Commands

- **`/prime-simple`** - Quick feature development (for simple features that don't need extensive planning)
- **`/prime-spec`** - Requirements gathering and specification creation (for complex features)
- **`/prime-tech`** - Technical design and implementation blueprint
- **`/prime-build`** - Coordinated implementation of approved specifications
- **`/refine-spec`** - Improve the spec-driven workflow itself

### Agent Roles

- **`tdd-developer`** - Implements features using test-driven development approach
- **`code-reviewer`** - Reviews code for duplicate patterns, type safety, test quality, and architectural consistency
- **`qa-spec-tester`** - Verifies implementations against specification acceptance criteria

### Typical Workflow for Complex Features

1. **Requirements Phase**: `/prime-spec <feature description>`
   - Creates `specs/XXX-feature-name.md` with requirements and acceptance criteria
   - Architect agent asks clarifying questions, explores codebase patterns, researches best practices

2. **Technical Design Phase**: `/prime-tech specs/XXX-feature-name.md`
   - Creates `specs/XXX-feature-name.tech.md` with implementation tasks
   - Breaks down feature into numbered, implementable tasks with clear boundaries

3. **Implementation Phase**: `/prime-build specs/XXX-feature-name.md`
   - Architect coordinates `tdd-developer` for implementation
   - `code-reviewer` reviews each implementation for quality, patterns, and type safety
   - `qa-spec-tester` verifies each task against acceptance criteria
   - Progress tracked via checkboxes in tech spec

#### Specification Numbering

- Spec files use 3-digit IDs: `001-feature-name.md`, `002-another-feature.md`
- Technical specs add `.tech.md`: `001-feature-name.tech.md`
- Use `plugins/spec-dev/spec-templates/get-next-spec-id.sh` to get next available ID

### MCP Builder Plugin

The `mcp-builder` plugin provides comprehensive guidance for creating high-quality Model Context Protocol (MCP) servers.

**Use when:**
- Building MCP servers to integrate external APIs or services
- Working with Python (FastMCP) or Node/TypeScript (MCP SDK)
- Designing tools for AI agents to interact with external services

**Key features:**
- Agent-centric design principles
- Workflow-focused tool design (not just API wrappers)
- Response optimization for limited context
- Evaluation-driven development approach
- Language-specific implementation guides

**Workflow:**
1. Research and planning (MCP protocol, API documentation, tool selection)
2. Implementation (project structure, shared utilities, tool development)
3. Review and refine (code quality, testing, validation)
4. Create evaluations (10 complex questions to test LLM effectiveness)

### Skill Creator Plugin

The `skill-creator` plugin guides the creation of effective skills that extend Claude's capabilities.

**Use when:**
- Creating new skills for specialized domains or workflows
- Updating existing skills with new capabilities
- Designing reusable knowledge packages for Claude

**Key concepts:**
- **SKILL.md** - Required file with YAML frontmatter and markdown instructions
- **Bundled resources** - Optional scripts, references, and assets
- **Progressive disclosure** - Three-level loading system (metadata → SKILL.md → resources)

**Workflow:**
1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize skill structure using `init_skill.py`
4. Edit SKILL.md and bundled resources
5. Package skill using `package_skill.py`
6. Iterate based on real usage

### Document Processing Plugins

#### PDF Plugin

**Use when:**
- Extracting text and tables from PDFs
- Creating new PDFs with reportlab
- Merging, splitting, or rotating PDF documents
- Filling out PDF forms
- Processing scanned PDFs with OCR

**Key tools:** pypdf, pdfplumber, reportlab, pytesseract

#### XLSX Plugin

**Use when:**
- Creating spreadsheets with formulas and formatting
- Reading and analyzing spreadsheet data
- Modifying existing spreadsheets while preserving formulas
- Data analysis and visualization
- Recalculating formulas with LibreOffice

**Key features:**
- Formula-first approach (avoid hardcoding calculated values)
- Financial modeling standards (color coding, number formatting)
- Formula error detection and prevention
- Support for openpyxl and pandas

#### PPTX Plugin

**Use when:**
- Creating new presentations from scratch or templates
- Modifying existing presentation content
- Working with slide layouts and design
- Adding comments or speaker notes
- Extracting presentation content

**Key workflows:**
- **New without template:** HTML → html2pptx conversion with design system
- **New with template:** Duplicate/rearrange slides, replace text via JSON
- **Edit existing:** Unpack OOXML, edit XML, validate, repack

#### DOCX Plugin

**Use when:**
- Creating new Word documents
- Editing existing documents with tracked changes
- Working with comments and formatting
- Processing legal, academic, or business documents
- Extracting document content

**Key workflows:**
- **Create new:** Use docx-js library with JavaScript/TypeScript
- **Edit existing:** Document library (Python) for OOXML manipulation
- **Redlining:** Comprehensive tracked changes workflow with batching

## Directory Conventions

When working with spec-dev:
- **`specs/`** - Project-level directory for feature specifications (create if doesn't exist)
- Specs follow patterns defined in `plugins/spec-dev/spec-templates/SPEC_PATTERNS.md`
- Communication between agents follows `COMMUNICATION_PROTOCOL.md` standards

## Creating New Plugins

1. Create plugin directory structure:
   ```bash
   mkdir -p plugins/my-plugin/{commands,agents,skills}
   ```

2. Add plugin metadata (no `plugin.json` needed - marketplace.json is sufficient)

3. Register in `.claude-plugin/marketplace.json`:
   ```json
   {
     "name": "my-plugin",
     "description": "What it does",
     "version": "1.0.0",
     "author": { "name": "Your Name" },
     "keywords": ["tag1", "tag2"],
     "source": "./plugins/my-plugin"
   }
   ```

4. Add commands/agents as markdown files in respective directories

## Important Notes

- Always read `plugins/spec-dev/README.md` when working with the spec-dev plugin
- The spec-dev workflow emphasizes:
  - Clear specifications before implementation
  - Specialized agents for different development phases
  - Code review before QA testing (catches patterns, types, test issues)
  - Quality verification through dedicated QA testing
  - Systematic task breakdown and tracking
- Implementation flow: Implement → Code Review → Fix → QA Test → Fix → Complete
- Agents should communicate through the architect, not directly with each other
- Code review is never optional - it prevents technical debt accumulation
- Verify all acceptance criteria before marking features complete
