# Hooks Documentation

This directory contains Claude Code hooks for the plugin marketplace project.

## Available Hooks

### Stop Hook: Documentation Check

**File:** `stop-doc-check.ts`
**Event:** `Stop`
**Behavior:** Blocks (runs once per session)

#### Purpose

Ensures all relevant documentation is updated before ending a Claude Code session. When you attempt to stop, the hook:

1. Checks if it has already run this session (via `stop_hook_active` flag)
2. Checks if enough time has elapsed since last trigger (3-minute delay prevents excessive interruptions)
3. If time elapsed, identifies all modified files in the git working directory
4. For each modified file, finds all `README.md` and `CLAUDE.md` files from that file's directory up to the project root
5. Blocks the stop and presents a checklist of documentation to verify

#### How It Works

**Detection:**
- Runs `git status --short` to identify modified files
- Parses both staged and unstaged changes
- Includes untracked files (marked with `??`)

**Traversal:**
- For each modified file, starts at the file's directory
- Walks up the directory tree to the project root
- Collects all `README.md` and `CLAUDE.md` files found
- Deduplicates the results

**Output:**
- Lists all modified files
- Lists all documentation files to check
- Provides clear instructions for verification
- Blocks the stop event until Claude confirms review

#### Example Output

```
<project-stop-doc-check-suggestion>
📚 Documentation Check

Before stopping: Review documentation for any files you modified this session.

Files changed in repo (3):
  - plugins/spec-dev/commands/build.md
  - plugins/spec-dev/skills/spec-architect/SKILL.md
  - plugins/spec-dev/README.md

Documentation files (4):
  - CLAUDE.md
  - README.md
  - plugins/spec-dev/CLAUDE.md
  - plugins/spec-dev/README.md

Action required:
• Identify which files you changed this session (ignore pre-existing changes)
• Update relevant docs above to reflect your changes only
• Once docs match your changes, you may stop
</project-stop-doc-check-suggestion>
```

#### Behavior Details

**Time-Based Filtering:**
The hook implements a 3-minute delay to prevent excessive interruptions while ensuring documentation is reviewed.

**How Time Filtering Works:**
- Uses shared session cache utility from `utils/session-cache.ts` (see `utils/CLAUDE.md` for details)
- Calls `shouldTriggerBasedOnTime()` to check if 3 minutes have elapsed
- Calls `markTriggered()` to record timestamp and metadata after each trigger
- Cache persists for the session but is scoped per working directory

**Smart Detection:**
- Only triggers if files are actually modified
- Gracefully handles non-git directories
- Ignores errors (fails open if git unavailable)

**Scope:**
The hook checks documentation at all levels:
- Project root (`README.md`, `CLAUDE.md`)
- Plugin directories (`plugins/*/README.md`, `plugins/*/CLAUDE.md`)
- Nested subdirectories (any level of nesting)

#### Testing

To test the hook manually:

```bash
# Test with sample input (Stop event)
cd hooks
cat <<'EOF' | bun stop-doc-check.ts
{
  "session_id": "test-session",
  "transcript_path": "/tmp/test",
  "cwd": "/Users/codethread/dev/learn/claude-plugins",
  "permission_mode": "auto",
  "hook_event_name": "Stop"
}
EOF
```

Expected behavior:
- If files are modified: outputs blocking decision with documentation list
- If no files modified: exits silently (allows stop)
- If `stop_hook_active=true`: exits silently (allows stop)

To test in a real session:
1. Make some file changes (edit any plugin file)
2. Attempt to stop Claude Code session
3. Hook should block and show documentation checklist
4. Review/update documentation as needed
5. Attempt to stop again - should succeed without blocking

#### Configuration

The hook is registered in `hooks.json`:

```json
{
  "description": "Checks that documentation is updated before stopping session",
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/stop-doc-check.ts",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

**Timeout:** 60 seconds (should complete in <1 second typically)

#### Troubleshooting

**Hook doesn't fire:**
- Verify `hooks.json` is valid JSON
- Check script has execute permissions: `chmod +x hooks/stop-doc-check.ts`
- Ensure Bun is installed and available in PATH
- Check Claude Code recognizes the hook: hooks should be in project or plugin root

**Hook fires too frequently:**
- Check the 3-minute delay is working by verifying session cache exists
- Session cache location: `~/.local/cache/codethread-plugins/stop-doc-check/<normalized-cwd>/<session-id>.json`
- Cache should contain `last_triggered` timestamp
- If cache is missing or invalid, hook will trigger immediately

**No documentation listed:**
- Verify files are actually modified: `git status`
- Check you're in a git repository
- Ensure `README.md` or `CLAUDE.md` files exist in relevant directories

**Hook blocks but shouldn't:**
- If you want to skip the check, you can:
  - Review the documentation (hook won't block again after first Claude response)
  - Commit or stash your changes
  - Temporarily remove the hook from `hooks.json`

#### Design Rationale

**Why block on Stop?**
- Most natural point to ensure work is complete
- Encourages documentation hygiene
- Doesn't interrupt flow during active development

**Why only run once?**
- Avoids annoying repeated prompts
- Trusts Claude to review documentation thoroughly
- Balances safety with usability

**Why traverse from leaf to root?**
- Ensures all relevant documentation is checked
- Captures both local (plugin-specific) and global (project-level) docs
- Follows the principle that changes cascade up the hierarchy

## Hook Development

### Adding New Hooks

1. Create a TypeScript script in `hooks/` directory
2. Add shebang: `#!/usr/bin/env bun`
3. Import SDK types: `import type { HookInput, SyncHookJSONOutput } from '@anthropic-ai/claude-agent-sdk'`
4. Make executable: `chmod +x hooks/your-hook.ts`
5. Register in `hooks.json`
6. Test with sample input
7. Document in this README.md

### Hook Input Format

All hooks receive JSON via stdin. Use official SDK types from `@anthropic-ai/claude-agent-sdk`:

```typescript
import type {
  StopHookInput,
  PreToolUseHookInput,
  PostToolUseHookInput,
  UserPromptSubmitHookInput,
  // ... other hook input types
} from '@anthropic-ai/claude-agent-sdk';

// Example for Stop hook:
const input = await Bun.stdin.text();
const hookInput: StopHookInput = JSON.parse(input);
```

**Available SDK types:**
- `StopHookInput` - For Stop events
- `SubagentStopHookInput` - For SubagentStop events
- `PreToolUseHookInput` - For PreToolUse events
- `PostToolUseHookInput` - For PostToolUse events
- `UserPromptSubmitHookInput` - For UserPromptSubmit events
- `SessionStartHookInput` - For SessionStart events
- `SessionEndHookInput` - For SessionEnd events
- `NotificationHookInput` - For Notification events
- `PreCompactHookInput` - For PreCompact events

### Hook Output Format

Hooks should output JSON to stdout using SDK types:

```typescript
import type { SyncHookJSONOutput } from '@anthropic-ai/claude-agent-sdk';

const output: SyncHookJSONOutput = {
  decision: "block",
  reason: "Explanation for Claude",
  hookSpecificOutput: {
    hookEventName: "Stop",
    additionalContext: "Additional context for Claude"
  }
};

console.log(JSON.stringify(output));
```

**Exit codes:**
- `0`: Success (hook completed normally)
- Non-zero: Error (Claude Code may show error message)

### Best Practices

1. **Fail gracefully:** If something goes wrong, exit 0 (don't block)
2. **Be fast:** Keep execution under 1-2 seconds when possible
3. **Clear output:** Use formatted messages with clear instructions
4. **Idempotent:** Hook should be safe to run multiple times
5. **Testable:** Support manual testing via stdin

### Testing Hooks

```bash
# Create test input
cat <<'EOF' > test-input.json
{
  "session_id": "test",
  "transcript_path": "/tmp/test",
  "cwd": "/path/to/project",
  "permission_mode": "auto",
  "hook_event_name": "EventName"
}
EOF

# Run hook
cat test-input.json | bun hooks/your-hook.ts

# Check exit code
echo $?
```

## Related Documentation

- **Project root CLAUDE.md:** Overall project guidance and hook documentation standards
- **Claude Code Hooks Documentation:** Official hook reference (load `claude-code-knowledge` skill)
