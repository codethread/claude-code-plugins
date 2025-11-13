# Utils - Shared Utilities

This directory contains shared utilities used across plugins and hooks in the marketplace.

**IMPORTANT**: Before building new functionality, check if a utility already exists here to avoid duplication.

## Available Utilities

### Session Cache Utility (`session-cache.ts`)

Provides consistent session cache management for marketplace plugins and hooks.

**Purpose:**
- Centralized session caching for plugins and hooks
- Time-based filtering for hooks (prevent excessive triggers)
- Consistent cache directory structure across all plugins

**Cache Location:**
`~/.local/cache/codethread-plugins/{plugin-name}/{normalized-cwd}/{session-id}.json`

**Key Functions:**

- `getPluginCacheDir(pluginName, cwd)` - Get cache directory for a plugin
- `getSessionCachePath(pluginName, cwd, sessionId)` - Get full path to session cache file
- `readSessionCache<T>(pluginName, cwd, sessionId)` - Read typed session data (returns null if doesn't exist)
- `writeSessionCache<T>(pluginName, cwd, sessionId, data)` - Write typed session data (creates directory if needed)
- `updateSessionCache<T>(pluginName, cwd, sessionId, updates)` - Merge updates into existing cache
- `shouldTriggerBasedOnTime(pluginName, cwd, sessionId, delayMinutes)` - Check if delay has elapsed
- `markTriggered(pluginName, cwd, sessionId, metadata?)` - Record trigger timestamp with optional metadata

**Usage Example:**

```typescript
import { shouldTriggerBasedOnTime, markTriggered } from '../../utils/session-cache';

// Check if 3 minutes have elapsed
if (!shouldTriggerBasedOnTime('my-plugin', cwd, sessionId, 3)) {
  process.exit(0); // Not enough time elapsed
}

// Do work...

// Mark trigger with metadata
markTriggered('my-plugin', cwd, sessionId, {
  files_processed: 5,
  action: 'some-action',
});
```

**Used By:**
- `.claude/hooks/stop-doc-check.ts` - 3-minute delay between doc check prompts
- `plugins/doc-writer/hooks/doc-writer-suggest.ts` - Once-per-session suggestion tracking

**When to Use:**

Use this utility when you need to:
- Track state across hook invocations within a session
- Prevent hooks from triggering too frequently (time-based filtering)
- Store session-scoped metadata or flags
- Share session data between different hooks/plugins

**When NOT to Use:**

Don't use this utility when you need:
- Persistent storage across sessions (use a database or file system)
- Global state (not session-scoped)
- Real-time synchronization between processes

## Adding New Utilities

When adding a new shared utility:

1. **Check for existing solutions first** - Don't duplicate functionality
2. **Create the utility file** with clear, focused responsibility
3. **Add TypeScript types** - All utilities should be fully typed
4. **Document in this CLAUDE.md** - Add a section similar to the session-cache example above
5. **Include usage examples** - Show how to import and use the utility
6. **List consumers** - Document which hooks/plugins use the utility
7. **Test the utility** - Ensure it works in isolation before integrating

**Naming conventions:**
- Use kebab-case for filenames: `session-cache.ts`, `path-utils.ts`
- Export named functions, not default exports
- Use descriptive function names that indicate what they do

**Example structure for new utility documentation:**

```markdown
### Utility Name (`filename.ts`)

Brief description of what this utility does.

**Purpose:**
- Bullet list of specific purposes

**Key Functions:**
- `functionName(params)` - Description

**Usage Example:**
```typescript
// Code example
```

**Used By:**
- List of consumers

**When to Use:**
- Scenarios where this is appropriate

**When NOT to Use:**
- Scenarios where this is not appropriate
```

## Related Documentation

- **Repository root CLAUDE.md:** Overall project guidance
- **Plugin-specific CLAUDE.md files:** Plugin architecture details
