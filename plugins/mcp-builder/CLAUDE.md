# MCP Builder Plugin - Maintainer Documentation

For end-user documentation, see [README.md](./README.md).

## Plugin Architecture

The MCP Builder plugin is a comprehensive skill-based plugin that guides Claude Code through creating high-quality Model Context Protocol (MCP) servers. It uses a single primary skill with extensive reference documentation.

### Design Principles

1. **Skill-driven architecture**: The plugin uses a single comprehensive skill (`mcp-builder`) rather than multiple commands
2. **Reference file architecture**: Extensive reference documentation lives in separate markdown files under `reference/` for maintainability
3. **Phase-based workflow**: Guides users through a structured 4-phase development process
4. **Language-agnostic entry point**: Single skill serves both Python and TypeScript implementations
5. **Evaluation-driven development**: Includes testing scripts for validating MCP server quality

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
        ├── SKILL.md            # Main workflow coordinator (loads references)
        ├── reference/          # External reference documentation
        │   ├── mcp_best_practices.md     # Universal MCP guidelines (~28KB)
        │   ├── python_mcp_server.md      # Python/FastMCP patterns (~26KB)
        │   ├── node_mcp_server.md        # TypeScript/Node patterns (~26KB)
        │   └── evaluation.md             # Evaluation creation guide (~21KB)
        └── scripts/            # Evaluation testing scripts
            ├── evaluation.py           # Main evaluation harness
            ├── connections.py          # MCP connection helpers
            ├── example_evaluation.xml  # Example output format
            └── requirements.txt        # Python dependencies
```

## Component Responsibilities

### SKILL.md (skills/mcp-builder/SKILL.md)

The workflow coordinator that:

1. **Provides agent-centric design principles** - How to design tools for AI agents
2. **Defines four-phase development workflow**:
   - Phase 1: Deep research and planning
   - Phase 2: Implementation
   - Phase 3: Review and refine
   - Phase 4: Create evaluations
3. **Links to reference documentation** in `reference/` directory:
   - MCP best practices (universal guidelines)
   - Python implementation guide (FastMCP-specific patterns)
   - TypeScript implementation guide (MCP SDK-specific patterns)
   - Evaluation guide (testing methodology)
4. **References external resources**:
   - MCP protocol documentation (via WebFetch)
   - SDK documentation (via WebFetch)

### reference/ Directory (skills/mcp-builder/reference/)

Contains detailed implementation guides:

**mcp_best_practices.md** (~28KB):
- Universal MCP guidelines (naming, formatting, pagination, limits)
- Tool design patterns for AI agents
- Error handling and validation
- Security best practices

**python_mcp_server.md** (~26KB):
- FastMCP-specific patterns
- Pydantic models and type safety
- Async/await patterns
- Tool registration and lifecycle

**node_mcp_server.md** (~26KB):
- MCP SDK TypeScript patterns
- Zod schemas and type safety
- Build process and packaging
- Error handling patterns

**evaluation.md** (~21KB):
- Evaluation creation methodology
- Question design principles
- XML format specification
- Verification strategies

### scripts/ Directory (skills/mcp-builder/scripts/)

Provides evaluation testing infrastructure:

**evaluation.py**:
- Automated testing harness that loads evaluation XML files
- Connects to MCP servers (stdio, SSE, or direct transport)
- Runs questions against Claude with MCP server tools
- Validates answers and generates results

**connections.py**:
- Helper utilities for creating MCP client connections
- Handles different transport types
- Connection lifecycle management

**example_evaluation.xml**:
- Sample evaluation file showing proper XML format
- Example questions and expected answers

**requirements.txt**:
- Python dependencies (anthropic SDK, etc.)

**Usage**: Users run scripts after completing Phase 4 to test their MCP servers.

### Why No Commands?

This plugin doesn't provide slash commands because:
- MCP server development is a complex, multi-phase process that doesn't fit into a simple command
- The skill provides comprehensive guidance that users can work through at their own pace
- Users load the skill manually when they need MCP development assistance

## Common Maintenance Tasks

### Updating the Skill

When updating SKILL.md content:

1. Keep the phase-based structure intact - it provides clear mental model
2. Maintain the agent-centric design principles at the top - they're fundamental
3. Update SDK references if new versions change patterns
4. Ensure links to `reference/` files remain valid when moving/renaming
5. Ensure WebFetch URLs are current and accessible

### Updating Reference Files

When modifying documentation in `skills/mcp-builder/reference/`:

1. **mcp_best_practices.md**: Update for MCP protocol changes or new universal patterns
2. **python_mcp_server.md**: Update for FastMCP API changes or new Python patterns
3. **node_mcp_server.md**: Update for MCP SDK API changes or new TypeScript patterns
4. **evaluation.md**: Update for new evaluation requirements or testing patterns
5. Ensure SKILL.md links remain valid (check for broken `./reference/` paths)
6. Test that all reference links work when skill is loaded

### Updating Evaluation Scripts

When modifying scripts in `skills/mcp-builder/scripts/`:

1. **evaluation.py**: Update for new MCP transport types or testing features
2. **connections.py**: Update for MCP SDK connection API changes
3. **requirements.txt**: Keep anthropic SDK version current, add new dependencies
4. Update evaluation.md if script usage changes
5. Test scripts with sample MCP servers before releasing

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
6. Test evaluation scripts:
   - Install dependencies: `pip install -r skills/mcp-builder/scripts/requirements.txt`
   - Run against sample MCP server
   - Verify connections.py works with all transport types
   - Check example_evaluation.xml format matches evaluation.md spec

## Architecture Rationale

### Why Separate Reference Files?

Rather than embedding all documentation in SKILL.md, reference materials are in separate files because:

1. **Maintainability**: Each reference file can be updated independently without touching workflow logic
2. **Modularity**: Users only load reference files relevant to their current phase
3. **Size management**: Keeps SKILL.md focused on workflow, reference files focused on details
4. **Clear separation**: Workflow instructions separate from implementation specifics
5. **Easier updates**: Language-specific guides can evolve independently

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
