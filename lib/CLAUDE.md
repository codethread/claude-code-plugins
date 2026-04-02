# @claude-plugins/lib - Shared Library

Shared utilities for plugins and hooks. Check here before building new functionality.

**Spec:** [`specs/shared-lib.md`](../specs/shared-lib.md) — architecture, API surface, design decisions

## Import Usage

```typescript
import { readSessionCache, writeSessionCache } from '@claude-plugins/lib/session-cache';
```

## Adding Utilities

1. Create utility file in `lib/`
2. Add export to `package.json` exports field
3. Update the spec with the new module's purpose and API

**Conventions:**
- kebab-case filenames: `session-cache.ts`
- Named exports only
