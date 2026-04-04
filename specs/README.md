# Specifications

Persistent domain specifications. Organized by system area, not feature chronology.

**Rule:** specs describe intent, code describes reality. Always check the codebase before assuming a spec is fully implemented.

## Infrastructure

| Spec | Purpose | Code |
|---|---|---|
| [shared-lib.md](./shared-lib.md) | Session-scoped caching infrastructure for hooks across the plugin marketplace | `lib/` |
| [plugin-marketplace.md](./plugin-marketplace.md) | Plugin registration, versioning, and discovery via static JSON catalog | `.claude-plugin/marketplace.json`, `plugins/*/.claude-plugin/plugin.json` |
| [project-hooks.md](./project-hooks.md) | Project-level hook infrastructure: workspace lifecycle, doc hygiene, Nix wrapper | `.claude/settings.json`, `.claude/hooks/` |

## Plugins

| Spec | Purpose | Code |
|---|---|---|
| [doc-writer.md](./doc-writer.md) | Documentation expertise: research-backed writing patterns, auto-detection hook, ruthless simplification agent | `plugins/doc-writer/` |
| [claude-code-knowledge.md](./claude-code-knowledge.md) | Opinionated Claude Code config guidance, automated auditing, and hook smoke testing | `plugins/claude-code-knowledge/` |
| [langs.md](./langs.md) | Language-specific expertise (React, TypeScript) with test file detection hook | `plugins/langs/` |
| [dev-workflow.md](./dev-workflow.md) | Phase-based development workflow: What, How, Build, with persistent domain specs | `plugins/dev/` |
| [dev-enhancements.md](./dev-enhancements.md) | Planned enhancements: quality gate hooks, stage enforcement, build loop runner | `plugins/dev/` |
| [bdfl.md](./bdfl.md) | Opinionated project architecture bootstrapping and incremental migration | `plugins/bdfl/` |
