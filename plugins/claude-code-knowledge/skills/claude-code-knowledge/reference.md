# Claude Code Documentation Reference

This file lists all available Claude Code documentation topics. Each topic is available as a markdown file in the `docs/` directory.

## Available Documentation Topics

### Core Features

- **overview.md** - Claude Code overview and introduction
- **quickstart.md** - Quick start guide for Claude Code
- **setup.md** - Initial setup and configuration
- **cli-reference.md** - Complete command-line interface reference
- **common-workflows.md** - Common workflows and usage patterns
- **interactive-mode.md** - Interactive mode usage and features

### Configuration & Settings

- **settings.md** - Configuration settings reference
- **model-config.md** - Model configuration and selection
- **network-config.md** - Network and proxy configuration
- **terminal-config.md** - Terminal configuration options
- **output-styles.md** - Customizing output appearance
- **statusline.md** - Status line configuration

### Extensibility

- **hooks.md** - Hooks system overview
- **hooks-guide.md** - Detailed guide for creating hooks
- **mcp.md** - Model Context Protocol (MCP) servers
- **skills.md** - Agent Skills creation and management
- **slash-commands.md** - Custom slash commands
- **plugins.md** - Plugin development and usage
- **plugins-reference.md** - Plugin API reference
- **plugin-marketplaces.md** - Plugin marketplace information

### Advanced Features

- **sub-agents.md** - Sub-agents and delegation
- **memory.md** - Memory and context management
- **checkpointing.md** - Checkpointing and session management
- **analytics.md** - Analytics and telemetry
- **monitoring-usage.md** - Usage monitoring and cost tracking
- **costs.md** - Cost management and optimization

### Integrations

- **github-actions.md** - GitHub Actions integration
- **gitlab-ci-cd.md** - GitLab CI/CD integration
- **vs-code.md** - VS Code integration
- **jetbrains.md** - JetBrains IDE integration
- **devcontainer.md** - Dev Container support
- **claude-code-on-the-web.md** - Web-based Claude Code
- **third-party-integrations.md** - Third-party tool integrations

### Cloud Platforms

- **amazon-bedrock.md** - Amazon Bedrock integration
- **google-vertex-ai.md** - Google Vertex AI integration
- **llm-gateway.md** - LLM Gateway configuration
- **iam.md** - Identity and Access Management

### Security & Compliance

- **security.md** - Security features and best practices
- **sandboxing.md** - Sandboxing and isolation
- **data-usage.md** - Data usage and privacy
- **legal-and-compliance.md** - Legal and compliance information

### Operations

- **headless.md** - Running Claude Code in headless mode
- **troubleshooting.md** - Troubleshooting common issues
- **sdk__migration-guide.md** - SDK migration guide
- **changelog.md** - Claude Code release notes and version history

## Usage

To read any documentation topic:

```bash
cat docs/<topic>.md
```

To search across all documentation:

```bash
grep -ri "search term" docs/
```

To list all topics:

```bash
bash scripts/list_topics.sh
```

## Documentation Source

All documentation is synced from the official Claude Code documentation at:
- https://docs.anthropic.com/en/docs/claude-code/ (via code.claude.com)

The changelog is fetched directly from:
- https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md

## Last Updated

Check the `docs/docs_manifest.json` file for the last update timestamp and per-file update information.
