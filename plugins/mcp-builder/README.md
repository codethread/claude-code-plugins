# MCP Builder

A Claude Code plugin that guides you through creating high-quality Model Context Protocol (MCP) servers that enable LLMs to interact with external services.

## What It Does

The MCP Builder plugin provides comprehensive guidance for building MCP servers in Python (FastMCP) or TypeScript (MCP SDK). It teaches you how to:

- Design tools that work effectively with AI agents
- Implement clean, maintainable MCP servers
- Optimize responses for limited context windows
- Create evaluation tests to validate your server's effectiveness

## Installation

```bash
/plugin marketplace add /Users/codethread/dev/learn/claude-plugins
/plugin install mcp-builder@personal-configs-plugins
```

## Quick Start

Load the MCP builder skill when you want to create or improve an MCP server:

```bash
# Load the skill to get started
invoke mcp-builder skill
```

The skill will guide you through a structured 4-phase process:

1. **Research and Planning** - Understanding MCP protocol, API documentation, and tool design
2. **Implementation** - Building your server with proper structure and utilities
3. **Review and Refine** - Code quality checks, testing, and validation
4. **Create Evaluations** - Building test scenarios to validate effectiveness

## When to Use

Use this plugin when you need to:

- Build an MCP server to integrate an external API or service
- Learn best practices for MCP server development
- Design tools that work effectively with AI agents
- Create evaluation tests for your MCP server
- Improve an existing MCP server implementation

## Key Features

### Agent-Centric Design Principles

Learn how to design tools for AI agents, not just wrap API endpoints:

- Build workflow-focused tools that accomplish complete tasks
- Optimize for limited context windows
- Provide actionable error messages that guide agents
- Follow natural task subdivisions

### Language Support

- **Python**: Full guidance for FastMCP implementation
- **TypeScript**: Complete Node/TypeScript MCP SDK guide

### Comprehensive Workflow

The skill provides structured guidance through every phase:

- API research and documentation study
- Tool selection and prioritization
- Input validation with Pydantic/Zod
- Response formatting (JSON and Markdown)
- Error handling strategies
- Evaluation creation

### Embedded Reference Documentation

The skill includes complete reference documentation for:

- MCP best practices (naming, formatting, pagination, character limits)
- Python implementation patterns (Pydantic models, async/await, tool registration)
- TypeScript implementation patterns (Zod schemas, type safety, build process)
- Evaluation creation (question design, answer verification, XML format)

### External Resource Integration

The skill automatically fetches the latest documentation from:

- MCP protocol specification
- Python SDK documentation
- TypeScript SDK documentation

## Example Workflow

Here's what a typical session looks like:

```
1. You: "I want to build an MCP server for the GitHub API"

2. Load the skill:
   invoke mcp-builder skill

3. Follow Phase 1 - Research and Planning:
   - Claude fetches MCP protocol documentation
   - Studies GitHub API documentation
   - Creates comprehensive implementation plan
   - Selects priority tools to implement

4. Follow Phase 2 - Implementation:
   - Sets up project structure
   - Implements shared utilities
   - Creates tools with proper validation
   - Follows language-specific best practices

5. Follow Phase 3 - Review and Refine:
   - Reviews code quality
   - Tests the server
   - Validates against quality checklist

6. Follow Phase 4 - Create Evaluations:
   - Generates 10 complex test questions
   - Verifies answers are correct
   - Creates evaluation XML file
```

## Design Philosophy

This plugin teaches you to build MCP servers that are:

- **Agent-friendly**: Tools designed for how LLMs actually work
- **Workflow-focused**: Complete tasks, not just API wrappers
- **Context-optimized**: Responses that respect token budgets
- **Well-tested**: Evaluation-driven development ensures effectiveness
- **High-quality**: Following best practices and conventions

## What Gets Created

When you use this plugin to build an MCP server, you'll create:

**For Python:**
```
your-mcp-server/
├── server.py           # Main server implementation
├── requirements.txt    # Dependencies
└── evaluation.xml      # Test scenarios
```

**For TypeScript:**
```
your-mcp-server/
├── src/
│   └── index.ts       # Main server implementation
├── dist/              # Compiled output
│   └── index.js
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript config
└── evaluation.xml     # Test scenarios
```

## Examples

### Building a GitHub MCP Server

```
invoke mcp-builder skill

"I want to build an MCP server for GitHub that lets LLMs:
- Search repositories
- Read file contents
- List issues and PRs
- Search code across repos"
```

Claude will guide you through:
- Studying GitHub's REST API documentation
- Designing workflow-focused tools
- Implementing with proper pagination and error handling
- Creating evaluations to test effectiveness

### Building a Notion MCP Server

```
invoke mcp-builder skill

"I need an MCP server for Notion API that supports:
- Searching pages and databases
- Reading page content
- Querying databases with filters
- Getting page hierarchy"
```

Claude will help you:
- Understand Notion's API structure
- Design tools that work with Notion's block-based content
- Handle authentication properly
- Optimize responses for large pages

## Troubleshooting

### Server Hangs When Testing

MCP servers are long-running processes that wait for requests. Don't run them directly in your main process:

**Safe testing methods:**
- Use the evaluation harness (recommended)
- Run in tmux/screen
- Use timeout: `timeout 5s python server.py`

### WebFetch Errors

If the skill can't fetch external documentation:
- Check your internet connection
- Verify the URLs are accessible
- The skill will continue with embedded reference docs

### Build Errors

**Python:**
```bash
# Verify syntax
python -m py_compile server.py
```

**TypeScript:**
```bash
# Build and check for errors
npm run build
```

## Learn More

For plugin architecture and maintenance documentation, see [CLAUDE.md](./CLAUDE.md).

For the complete skill implementation, see [skills/mcp-builder/SKILL.md](./skills/mcp-builder/SKILL.md).

## License

See [LICENSE.txt](./LICENSE.txt) for complete license information.
