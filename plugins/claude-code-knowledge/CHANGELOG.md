# Changelog

## v1.5.0 - 2026-04-02

- Added `/claude-smoke` command: smoke tests hooks in the current project (discover, classify, generate, execute, report, cleanup)
- Added `skills/introspection/references/smoke-examples.md`: template library for common hook patterns (formatter, linter-clean, linter-violation, type-checker-stop, pre-tool-blocker)
- Documented subagent context isolation: subagents don't inherit CLAUDE.md, skills, or parent session state

## v1.4.1 - 2026-03-31

- Fixed `claude-code-knowledge` and `introspection` skills to enable model invocation by removing `disable-model-invocation` flag

## v1.4.0 - 2026-03-31

- Added `introspection` skill with headless test harness for verifying Claude Code behaviour
- Added `no-silent-failures` hook rule enforcing explicit error output
- Expanded skill suite for testing and validating Claude Code integration patterns

## v1.3.1 - 2026-03-29

- Fixed Edit tool scoping in knowledge-auditor agent to use glob pattern (`Edit(.claude/**)`)
- Updated tool inventory line to reflect scoped Edit

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
