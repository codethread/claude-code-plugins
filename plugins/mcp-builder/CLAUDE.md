# MCP Builder Plugin - Maintainer Documentation

For end-user documentation, see [README.md](./README.md).

## Plugin Architecture

The MCP Builder plugin is a comprehensive skill-based plugin that guides Claude Code through creating high-quality Model Context Protocol (MCP) servers. It uses a single primary skill with extensive reference documentation.

### Design Principles

1. **Skill-driven architecture**: The plugin uses a single comprehensive skill (`mcp-builder`) rather than multiple commands
2. **Reference-heavy approach**: Extensive reference documentation is embedded in the skill rather than external files
3. **Phase-based workflow**: Guides users through a structured 4-phase development process
4. **Language-agnostic entry point**: Single skill serves both Python and TypeScript implementations

## Directory Structure

```
plugins/mcp-builder/
├── CLAUDE.md                    # This file - maintainer documentation
├── README.md                    # End-user installation and usage guide
├── LICENSE.txt                  # License information
├── .claude-plugin/
│   └── plugin.json             # Plugin metadata
└── skills/
    └── mcp-builder/
        └── SKILL.md            # Complete MCP development workflow and reference docs
```

## Component Responsibilities

### SKILL.md (skills/mcp-builder/SKILL.md)

The primary workflow file that contains:

1. **Agent-centric design principles** - How to design tools for AI agents
2. **Four-phase development workflow**:
   - Phase 1: Deep research and planning
   - Phase 2: Implementation
   - Phase 3: Review and refine
   - Phase 4: Create evaluations
3. **Embedded reference documentation**:
   - MCP best practices (universal guidelines)
   - Python implementation guide (FastMCP-specific patterns)
   - TypeScript implementation guide (MCP SDK-specific patterns)
   - Evaluation guide (testing methodology)
4. **External resource references**:
   - MCP protocol documentation (via WebFetch)
   - SDK documentation (via WebFetch)

### Why No Commands?

This plugin doesn't provide slash commands because:
- MCP server development is a complex, multi-phase process that doesn't fit into a simple command
- The skill provides comprehensive guidance that users can work through at their own pace
- Users load the skill manually when they need MCP development assistance

## Common Maintenance Tasks

### Updating the Skill

When updating the skill content:

1. Keep the phase-based structure intact - it provides clear mental model
2. Maintain the agent-centric design principles at the top - they're fundamental
3. Update SDK references if new versions change patterns
4. Keep reference documentation embedded rather than in separate files
5. Ensure WebFetch URLs are current and accessible

### Adding Language Support

To add support for a new language (e.g., Rust, Go):

1. Add a new language-specific implementation guide section in SKILL.md
2. Create an embedded reference section following the Python/TypeScript pattern
3. Update Phase 2.4 to include the new language
4. Add quality checklist items specific to the language
5. Update the README.md to mention the new language

### Updating External References

The skill references these external resources via WebFetch:

- `https://modelcontextprotocol.io/llms-full.txt` - MCP protocol spec
- `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md` - Python SDK
- `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md` - TypeScript SDK

If these URLs change:
1. Update the URLs in SKILL.md
2. Test that WebFetch can still access them
3. Update README.md if users need to know about the change

### Testing Changes

After modifying the skill:

1. Load the skill in a Claude Code session: invoke the `mcp-builder` skill
2. Walk through each phase to ensure instructions are clear
3. Verify all WebFetch URLs are accessible
4. Test with both Python and TypeScript MCP server creation
5. Ensure the evaluation phase produces valid XML output

## Architecture Rationale

### Why Embedded Reference Documentation?

The skill embeds extensive reference documentation (best practices, implementation guides, evaluation guide) directly rather than keeping them in separate files because:

1. **Context loading**: Claude Code loads the entire skill at once, so all guidance is immediately available
2. **Coherent workflow**: Users don't need to manually load multiple files
3. **Self-contained**: The skill is completely self-sufficient except for external SDK docs
4. **Version consistency**: All related guidance stays in sync within a single file

### Why WebFetch for SDK Documentation?

Rather than copying SDK documentation into the plugin, we use WebFetch to load it directly from the source repositories because:

1. **Always current**: Gets the latest SDK documentation without manual updates
2. **Authoritative source**: Official documentation from the MCP project
3. **Reduced maintenance**: Plugin doesn't need updates when SDKs change
4. **Smaller plugin size**: Doesn't duplicate large external documentation

### Why Single Comprehensive Skill?

We use one large skill rather than multiple smaller skills or commands because:

1. **Complex workflow**: MCP server development isn't a simple task - it requires comprehensive guidance
2. **Contextual continuity**: All phases reference concepts from earlier phases
3. **Reference integration**: Design principles and best practices need to be consulted throughout
4. **User control**: Users can work through phases at their own pace without rigid command structure

## Common Pitfalls

### Don't Fragment the Workflow

Resist the temptation to break this into multiple commands like `/mcp-plan`, `/mcp-implement`, etc. The phases are interconnected and benefit from being in a single comprehensive skill that users can reference throughout development.

### Don't Remove Agent-Centric Design Principles

The agent-centric design principles section (Phase 1.1) is crucial - it's what makes MCP servers actually useful for LLMs. Don't move it to external documentation or assume users already know this.

### Don't Copy/Paste SDK Documentation

Keep using WebFetch for SDK docs rather than copying them into the plugin. Manual copies will become outdated and maintaining them is error-prone.

### Keep Examples Concrete

When updating guidance, ensure examples are specific and actionable. Avoid generic advice like "implement error handling" - instead show exactly what good error handling looks like in context.
