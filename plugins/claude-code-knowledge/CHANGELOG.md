# Changelog

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
