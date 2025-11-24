# @claude-plugins/lib - Shared Library

Shared utilities for plugins and hooks. Check here before building new functionality.

## Import Usage

```typescript
import { readSessionCache, writeSessionCache } from '@claude-plugins/lib/session-cache';
```

## Session Cache (`session-cache.ts`)

Session-scoped caching with time-based filtering for hooks.

**Cache Location:** `~/.local/cache/codethread-plugins/{plugin-name}/{normalized-cwd}/{session-id}.json`

**Used By:**
- `.claude/hooks/stop-doc-check.ts` - 3-minute delay between doc check prompts
- `plugins/doc-writer/hooks/doc-writer-suggest.ts` - Once-per-session suggestion
- `plugins/claude-code-knowledge/hooks/claude-code-prompt.ts` - Once-per-session skill suggestion

**When to Use:**
- Track state across hook invocations within a session
- Prevent hooks from triggering too frequently
- Store session-scoped metadata or flags

**When NOT to Use:**
- Persistent storage across sessions
- Global state (not session-scoped)
- Real-time synchronization between processes

## Adding Utilities

1. Create utility file in `lib/`
2. Add export to `package.json` exports field
3. Document in this file (cache location, used by, when to use)

**Conventions:**
- kebab-case filenames: `session-cache.ts`
- Named exports only
