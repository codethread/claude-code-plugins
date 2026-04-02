# Shared Library Specification

**Status:** Implemented
**Last Updated:** 2026-04-02

## 1. Overview

### Purpose

Session-scoped caching infrastructure for hooks across the plugin marketplace. Provides a filesystem-based cache keyed by plugin name, working directory, and session ID — allowing hooks to track state within a Claude Code session without cross-session persistence.

### Goals

- Isolate cache per plugin, per project, per session
- Provide time-gated triggering so hooks can rate-limit themselves
- Provide once-per-session flags so hooks fire only on first relevant event
- Zero external dependencies — Node.js built-ins only
- Single-file simplicity; add new utility files as the library grows

### Non-Goals

- Cross-session persistence — cache files are per-session and not cleaned up, but the library makes no guarantees about durability
- Global shared state between plugins — each plugin's cache is isolated by name
- Real-time synchronization between concurrent processes
- Runtime type validation of cached data — generics are advisory, not enforced

## 2. Architecture

### Cache Directory Layout

```
~/.local/cache/{marketplace-name}/{plugin-name}/{normalized-cwd}/{session-id}.json
```

- **marketplace-name**: Imported from `.claude-plugin/marketplace.json` at build time (`codethread-plugins`)
- **plugin-name**: Caller-supplied string identifying the hook/plugin
- **normalized-cwd**: Working directory with leading `/` stripped and all `/` replaced by `-`
- **session-id**: Claude Code session identifier, used as the JSON filename

### Components

Single source file: `lib/session-cache.ts` (≈125 LOC)

| Layer | Functions | Role |
|---|---|---|
| Path resolution | `getPluginCacheDir`, `getSessionCachePath` | Derive filesystem paths from (plugin, cwd, sessionId) tuple |
| Read/write | `readSessionCache<T>`, `writeSessionCache<T>`, `updateSessionCache<T>` | Generic JSON persistence with auto-mkdir and shallow merge |
| Time gating | `shouldTriggerBasedOnTime`, `markTriggered` | Rate-limit hooks by checking/writing `last_triggered` timestamps |

Internal helper `normalizePath` converts absolute paths to flat directory names (e.g. `/home/user/project` → `home-user-project`).

### Build

- `lib/tsconfig.json` extends `tsconfig.base.json` with `composite: true` and `emitDeclarationOnly: true`
- Outputs `.d.ts` files to `lib/dist/` for downstream workspace type resolution
- Package exports: `"./session-cache": "./session-cache.ts"` (Bun resolves TS directly)

## 3. Interfaces

### Exported API

```typescript
// Path resolution
getPluginCacheDir(pluginName: string, cwd: string): string
getSessionCachePath(pluginName: string, cwd: string, sessionId: string): string

// Generic read/write
readSessionCache<T>(pluginName: string, cwd: string, sessionId: string): T | null
writeSessionCache<T>(pluginName: string, cwd: string, sessionId: string, data: T): void
updateSessionCache<T extends Record<string, unknown>>(pluginName: string, cwd: string, sessionId: string, updates: Partial<T>): void

// Time-gated triggering
shouldTriggerBasedOnTime(pluginName: string, cwd: string, sessionId: string, delayMinutes: number): boolean
markTriggered(pluginName: string, cwd: string, sessionId: string, metadata?: Record<string, unknown>): void
```

### Consumer Import Pattern

```typescript
import { shouldTriggerBasedOnTime, markTriggered } from '@claude-plugins/lib/session-cache';
```

Consumers declare `"@claude-plugins/lib": "workspace:*"` in their `package.json` dependencies.

### Current Consumers

| Consumer | Hook Type | Functions Used | Pattern |
|---|---|---|---|
| `.claude/hooks/stop-doc-check.ts` | Stop | `shouldTriggerBasedOnTime`, `markTriggered` | 3-minute rate limit |
| `plugins/doc-writer/hooks/doc-writer-suggest.ts` | PostToolUse | `readSessionCache`, `writeSessionCache` | Once-per-session flag |

## 4. Design Decisions

- **Filesystem over in-memory**: Hooks run as short-lived subprocesses — no shared memory between invocations. Filesystem is the only persistence mechanism available without external services.
- **Marketplace name as cache root**: Importing `marketplace.json` at build time ties the cache namespace to the marketplace identity, preventing collisions if multiple marketplaces coexist on one machine.
- **Shallow merge in updateSessionCache**: Keeps the API simple. Consumers needing deep merge can read-modify-write manually.
- **Silent null on read failure**: `readSessionCache` returns `null` on missing files or parse errors rather than throwing. Hooks should degrade gracefully — a missing cache means "first invocation" not "error."
- **No cache cleanup**: Session cache files accumulate. Cleanup is left to the user or future tooling. The files are small JSON and the cost of orphaned caches is low.
- **Advisory generics**: `readSessionCache<T>` casts without runtime validation. Acceptable for an internal library where producers and consumers are co-located and type-checked together.

## 5. Open Questions

- **Cache garbage collection**: No mechanism exists to prune old session caches. If the cache directory grows large over time, a cleanup utility may be needed.
- **Invalid timestamp handling**: `shouldTriggerBasedOnTime` silently returns `false` if `last_triggered` contains an unparseable date string (NaN comparison). Unlikely in practice since `markTriggered` always writes valid ISO strings, but worth noting.
