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
2. If not run, identifies all modified files in the git working directory
3. For each modified file, finds all `README.md` and `CLAUDE.md` files from that file's directory up to the project root
4. Blocks the stop and presents a checklist of documentation to verify

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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 DOCUMENTATION CHECK REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Before stopping, verify all relevant documentation is updated.

MODIFIED FILES (3):
  - plugins/spec-dev/commands/build.md
  - plugins/spec-dev/skills/spec-architect/SKILL.md
  - plugins/spec-dev/README.md

DOCUMENTATION TO CHECK (3):
  - CLAUDE.md
  - README.md
  - plugins/spec-dev/CLAUDE.md
  - plugins/spec-dev/README.md

INSTRUCTIONS:
1. Review each documentation file listed above
2. Ensure it accurately reflects changes in modified files
3. Update any outdated information, examples, or instructions
4. Verify cross-references and links are still valid
5. Once all documentation is verified/updated, you may stop
```

#### Behavior Details

**Runs Once Per Session:**
The hook only blocks the first time you attempt to stop. After Claude reviews the documentation, subsequent stop attempts proceed without blocking.

**How "Once Per Session" Works:**
- Creates a marker file: `.stop-hook-{session_id}.marker` in the transcript directory
- File contains timestamp of when hook first ran
- Subsequent stops in same session detect marker file and exit silently
- Marker file is cleaned up when transcript is removed (typically after session ends)

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

**Hook fires every time:**
- The `stop_hook_active` environment variable may not persist between hook calls
- This is expected behavior - environment variables don't persist across hook invocations
- Current implementation blocks once by design

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
3. Make executable: `chmod +x hooks/your-hook.ts`
4. Register in `hooks.json`
5. Test with sample input
6. Document in this README.md

### Hook Input Format

All hooks receive JSON via stdin:

```typescript
interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: string;
  // Event-specific fields may be present
}
```

### Hook Output Format

Hooks should output JSON to stdout (or exit silently):

```typescript
interface HookOutput {
  decision?: "allow" | "block";
  hookSpecificOutput?: {
    additionalContext?: string;
    // Other optional fields
  };
}
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
