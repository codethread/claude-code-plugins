# Specifications

Persistent domain specifications. Organized by system area, not feature chronology.

**Rule:** specs describe intent, code describes reality. Always check the codebase before assuming a spec is fully implemented.

## Infrastructure

| Spec | Code | Purpose |
|---|---|---|
| [shared-lib.md](./shared-lib.md) | `lib/` | Session-scoped caching infrastructure for hooks across the plugin marketplace |

## Plugins

| Spec | Code | Purpose |
|---|---|---|
| [dev-workflow.md](./dev-workflow.md) | `plugins/dev/` | Phase-based development workflow: What, How, Build, with persistent domain specs |
| [dev-enhancements.md](./dev-enhancements.md) | `plugins/dev/` | Planned enhancements: quality gate hooks, stage enforcement, build loop runner |
| [bdfl.md](./bdfl.md) | `plugins/bdfl/` | Opinionated project architecture bootstrapping and incremental migration |
