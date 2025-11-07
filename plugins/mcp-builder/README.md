# MCP Builder Plugin

Guide for creating high-quality Model Context Protocol (MCP) servers that enable LLMs to interact with external services.

## When to Use

Use this plugin when:
- Building MCP server for external API integration
- Learning MCP server development best practices
- Designing tools for AI agents (not just API wrappers)
- Creating evaluation tests for MCP servers
- Improving existing MCP server implementation

## Installation

```bash
/plugin install mcp-builder@personal-configs-plugins
```

## What You Get

### Skill: `mcp-builder`

```bash
invoke mcp-builder skill
```

Provides structured 4-phase process:

1. **Research and Planning** - MCP protocol, API docs, tool design
2. **Implementation** - Server structure with validation and error handling
3. **Review and Refine** - Code quality, testing, validation
4. **Create Evaluations** - Test scenarios to validate effectiveness

### Agent-Centric Design Principles

Learn to design tools for AI agents:
- Workflow-focused tools (complete tasks, not just API wrappers)
- Optimized for limited context windows
- Actionable error messages that guide agents
- Natural task subdivisions

### Language Support

- **Python** - FastMCP implementation guide
- **TypeScript** - Node/TypeScript MCP SDK guide

### Embedded References

Complete reference documentation for:
- MCP best practices (naming, formatting, pagination, limits)
- Python patterns (Pydantic models, async/await, tool registration)
- TypeScript patterns (Zod schemas, type safety, build process)
- Evaluation creation (question design, verification, XML format)

## Quick Example

```bash
invoke mcp-builder skill

"I want to build an MCP server for GitHub that lets LLMs:
- Search repositories
- Read file contents
- List issues and PRs"
```

Claude guides through:
- Studying GitHub's REST API
- Designing workflow-focused tools
- Implementing with proper pagination and error handling
- Creating evaluations to test effectiveness

## What Gets Created

**Python:**
```
your-mcp-server/
├── server.py
├── requirements.txt
└── evaluation.xml
```

**TypeScript:**
```
your-mcp-server/
├── src/index.ts
├── dist/index.js
├── package.json
├── tsconfig.json
└── evaluation.xml
```

## Design Philosophy

Build MCP servers that are:
- **Agent-friendly** - Designed for how LLMs work
- **Workflow-focused** - Complete tasks, not just API calls
- **Context-optimized** - Respect token budgets
- **Well-tested** - Evaluation-driven development
- **High-quality** - Follow best practices

## Related

See `CLAUDE.md` for plugin architecture and maintainer documentation.
