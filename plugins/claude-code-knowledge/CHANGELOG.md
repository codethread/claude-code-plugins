# Changelog

## v1.3.0 - 2026-03-29

- Added `audit-config` command and `knowledge-auditor` agent to audit project Claude Code config
- Orchestrator fetches official schemas upfront so subagents can validate front matter without Guide access
- Fixed self-consistency issues: missing `disable-model-invocation`, invalid `name` field in examples, `mcpServers` caveat for plugin agents
- Removed `refactor-hooks` skill (replaced by the audit command)

## v1.2.0 - 2026-03-27

- Simplified to thin opinionated layer on top of built-in Claude Code Guide subagent
- Removed hooks, scripts, references, skill-rules, and docs cache (all replaced by Guide subagent)
- Added refactor-hooks companion skill
- Updated plugin description and keywords to reflect new scope

## v1.1.0 - 2025-11-13

- Fixed UserPromptSubmit hook to use "ESSENTIAL SKILL" directive for automatic skill loading
- Refactored hook to use shared `@claude-plugins/lib/session-cache` utility for consistency
- Added package.json files for proper dependency management (hooks and scripts)
- Session cache now marketplace-scoped for consistency with other plugins

## v1.0.0 - 2025-11-13

- Initial changelog
- Official Claude Code documentation access via skill
- Automatic documentation sync via PreToolUse hook
- Comprehensive skill creation guide with helper scripts
