# Plugin Bootstrapping

Plugins that need runtime dependencies (node_modules, Python venvs, compiled binaries) must bootstrap them via a `SessionStart` hook. Dependencies install into `${CLAUDE_PLUGIN_DATA}` which persists across sessions and plugin updates.

## Key Environment Variables

- `${CLAUDE_PLUGIN_ROOT}` - read-only directory where the plugin is installed
- `${CLAUDE_PLUGIN_DATA}` - writable persistent directory at `~/.claude/plugins/data/{id}/`
  - `{id}` is the plugin identifier with non-alphanumeric chars (except `_`, `-`) replaced by `-`
  - e.g. `formatter@my-marketplace` -> `~/.claude/plugins/data/formatter-my-marketplace/`

## SessionStart Hook Pattern

The standard pattern: diff the bundled manifest against a cached copy in the data dir. Reinstall when they differ (covers first run + dependency updates). Clean up on failure so the next session retries.

### hooks/hooks.json

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "diff -q \"${CLAUDE_PLUGIN_ROOT}/hooks/package.json\" \"${CLAUDE_PLUGIN_DATA}/package.json\" >/dev/null 2>&1 || (cd \"${CLAUDE_PLUGIN_DATA}\" && cp \"${CLAUDE_PLUGIN_ROOT}/hooks/package.json\" . && cp -f \"${CLAUDE_PLUGIN_ROOT}/hooks/bun.lock\" . 2>/dev/null; bun install --frozen-lockfile) || rm -f \"${CLAUDE_PLUGIN_DATA}/package.json\""
          }
        ]
      }
    ]
  }
}
```

**How it works:**

1. `diff -q` exits nonzero when the stored copy is missing or differs
2. On mismatch: copies manifest and lockfile to data dir, runs install
3. On install failure: `rm` removes the copied manifest so next session retries

### Using Installed Dependencies

Scripts in `${CLAUDE_PLUGIN_ROOT}` reference the persisted node_modules:

```json
{
  "type": "command",
  "command": "NODE_PATH=\"${CLAUDE_PLUGIN_DATA}/node_modules\" bun \"${CLAUDE_PLUGIN_ROOT}/hooks/my-hook.ts\""
}
```

Or for MCP servers:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "bun",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server.ts"],
      "env": {
        "NODE_PATH": "${CLAUDE_PLUGIN_DATA}/node_modules"
      }
    }
  }
}
```

## Adapting for This Repo

This repo uses **bun** not npm. Adapt accordingly:

- Use `bun install --frozen-lockfile` instead of `npm install`
- Use `bun` to run TypeScript directly (no compile step needed)
- Hook scripts use `#!/usr/bin/env bun` shebang
- Dependencies go in `hooks/package.json` per the hooks convention

## When You Don't Need This

If a plugin is purely markdown (skills, commands, agents) with no TypeScript hooks or MCP servers that need dependencies, skip the SessionStart hook entirely. Most plugins in this repo are markdown-only.
