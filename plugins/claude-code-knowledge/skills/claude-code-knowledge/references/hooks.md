# Hooks Quick Reference

**Read this FIRST for Hooks questions. For additional details, see [docs/hooks.md](../docs/hooks.md) and [docs/hooks-guide.md](../docs/hooks-guide.md)**

## What Are Hooks?

- User-defined shell commands that execute at lifecycle events
- Provide deterministic control vs relying on LLM choices
- Configured in settings files (`~/.claude/settings.json`, `.claude/settings.json`)

## Hook Types

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern", // Optional for some events
        "hooks": [
          {
            "type": "command", // or "prompt" for LLM-based
            "command": "your-command-here",
            "timeout": 60 // Optional, seconds
          }
        ]
      }
    ]
  }
}
```

### Hook Execution Types

| Type        | How It Works                     | Use For                                      |
| ----------- | -------------------------------- | -------------------------------------------- |
| **command** | Executes bash command            | Deterministic rules, fast operations         |
| **prompt**  | Queries LLM (Haiku) for decision | Context-aware decisions (Stop, SubagentStop) |

## Hook Events

| Event                 | When It Runs              | Can Block?               | Matcher                                   |
| --------------------- | ------------------------- | ------------------------ | ----------------------------------------- |
| **PreToolUse**        | Before tool call          | ✅ Yes                   | Tool name (e.g., `Bash`, `Edit`, `Write`) |
| **PermissionRequest** | Permission dialog shown   | ✅ Yes                   | Tool name                                 |
| **PostToolUse**       | After tool completes      | ❌ No (already ran)      | Tool name                                 |
| **UserPromptSubmit**  | User submits prompt       | ✅ Yes                   | None                                      |
| **Notification**      | Claude sends notification | ❌ No                    | Notification type                         |
| **Stop**              | Main agent finishes       | ✅ Yes (forces continue) | None                                      |
| **SubagentStop**      | Subagent finishes         | ✅ Yes (forces continue) | None                                      |
| **PreCompact**        | Before compacting         | ❌ No                    | `manual` or `auto`                        |
| **SessionStart**      | Session starts/resumes    | ❌ No                    | `startup`, `resume`, `clear`, `compact`   |
| **SessionEnd**        | Session ends              | ❌ No                    | None                                      |

## Matchers

```json
"matcher": "Write"           // Exact match
"matcher": "Edit|Write"      // Regex OR
"matcher": "Notebook.*"      // Regex pattern
"matcher": "*"               // All tools
"matcher": ""                // All (empty string)
```

**Case-sensitive!** `Write` ≠ `write`

## Hook Input (stdin)

All hooks receive JSON via stdin:

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/session.jsonl",
  "cwd": "/current/working/dir",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",           // Event-specific
  "tool_input": { ... }           // Event-specific
}
```

## Hook Output (stdout/stderr)

### Simple: Exit Codes

| Exit Code | Meaning            | Behavior                                                                                        |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| **0**     | Success            | stdout shown to user (transcript mode), except UserPromptSubmit/SessionStart (added to context) |
| **2**     | Block              | stderr shown to Claude (see event-specific behavior)                                            |
| **Other** | Non-blocking error | stderr shown to user, execution continues                                                       |

### Advanced: JSON Output

```json
{
  "continue": true,              // false stops Claude
  "stopReason": "...",           // Message when continue=false
  "suppressOutput": true,        // Hide from transcript
  "systemMessage": "...",        // Warning to user
  "hookSpecificOutput": { ... }  // Event-specific fields
}
```

## Event-Specific Control

### PreToolUse - Permission Control

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow", // "allow", "deny", "ask"
    "permissionDecisionReason": "...",
    "updatedInput": {
      // Optional: modify tool input
      "field": "new value"
    }
  }
}
```

### PostToolUse - Feedback

```json
{
  "decision": "block", // undefined = no action
  "reason": "...", // Shown to Claude
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "..." // Extra info for Claude
  }
}
```

### UserPromptSubmit - Validation & Context

```json
{
  "decision": "block", // Prevents prompt processing
  "reason": "...", // Shown to user only
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "..." // Added to context
  }
}
```

### Stop/SubagentStop - Force Continue

```json
{
  "decision": "block", // Prevents stopping
  "reason": "..." // Claude needs this to know what to do
}
```

### SessionStart - Load Context

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "..."
  }
}
```

## Environment Variables

| Variable             | Available In      | Purpose                                   |
| -------------------- | ----------------- | ----------------------------------------- |
| `CLAUDE_PROJECT_DIR` | All hooks         | Absolute path to project root             |
| `CLAUDE_ENV_FILE`    | SessionStart only | File to persist environment variables     |
| `CLAUDE_CODE_REMOTE` | All hooks         | `"true"` if web environment, empty if CLI |
| `CLAUDE_PLUGIN_ROOT` | Plugin hooks      | Absolute path to plugin directory         |

## Plugin Hooks

```json
{
  "description": "Auto code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh"
          }
        ]
      }
    ]
  }
}
```

**Plugin hooks:**

- Defined in plugin's `hooks/hooks.json`
- Use `${CLAUDE_PLUGIN_ROOT}` for plugin paths
- Merge with user/project hooks
- Run in parallel with other hooks

## Providing Feedback to Claude

Hooks can provide feedback to Claude in two ways: **blocking** (forces action) or **suggestive** (adds context).

### Blocking Feedback Pattern

**Use when:** You need Claude to take immediate action (fix issues, review docs, etc.)

**How:** Return JSON with `decision: "block"` and provide detailed `reason`

**Example: Stop hook that blocks until docs are updated**

```typescript
#!/usr/bin/env bun
import type {
  StopHookInput,
  SyncHookJSONOutput,
} from "@anthropic-ai/claude-agent-sdk";

const input = await Bun.stdin.text();
const hookInput: StopHookInput = JSON.parse(input);

// Build detailed feedback message
const additionalContext = `<project-stop-doc-check-suggestion>
Before stopping: Review documentation for any files you modified this session.
Files changed in repo (3):
  - plugins/spec-dev/SKILL.md
  - plugins/spec-dev/README.md
  - plugins/spec-dev/commands/build.md
Documentation files to review (2):
  - plugins/spec-dev/CLAUDE.md
  - plugins/spec-dev/README.md
Action required:
• Update relevant docs to reflect your changes
• Once docs match your changes, you may stop
</project-stop-doc-check-suggestion>`;

// Block the stop and provide feedback
const output: SyncHookJSONOutput = {
  decision: "block", // Prevents stopping
  reason: additionalContext, // Claude sees this and acts on it
};

console.log(JSON.stringify(output));
process.exit(0);
```

**What happens:**

1. Hook detects files were modified
2. Returns `decision: "block"` to prevent stopping
3. Claude receives `reason` and acts on the instructions
4. User sees Claude reviewing/updating docs
5. Once done, Claude can stop successfully

### Suggestive Feedback Pattern

**Use when:** You want to add context without forcing action (suggestions, tips, optional context)

**How:** Return JSON with `hookSpecificOutput.additionalContext` (no `decision` field)

**Example: PostToolUse hook that suggests skill after markdown edits**

```typescript
#!/usr/bin/env bun
import type {
  PostToolUseHookInput,
  SyncHookJSONOutput,
} from "@anthropic-ai/claude-agent-sdk";

const input = await Bun.stdin.text();
const data: PostToolUseHookInput = JSON.parse(input);

// Detect markdown file modification
const filePath = data.tool_input?.file_path as string;
if (!filePath?.toLowerCase().endsWith(".md")) {
  process.exit(0); // Not markdown, exit silently
}

// Build suggestion context
let context = "<plugin-doc-writer-suggestion>\n";
context += `Detected markdown file modification: ${filePath}\n\n`;
context += "ESSENTIAL SKILL:\n";
context += "  → doc-writer:writing-documentation\n\n";
context += "RECOMMENDED AGENT:\n";
context += "  → doc-writer:docs-reviewer\n";
context += "</plugin-doc-writer-suggestion>";

// Add suggestive feedback (no blocking)
const output: SyncHookJSONOutput = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: context, // Claude sees this as context
  },
  // Note: No "decision" field - this is suggestive, not blocking
};

console.log(JSON.stringify(output));
process.exit(0);
```

**What happens:**

1. Hook detects markdown file was edited
2. Adds suggestion context (no blocking)
3. Claude receives context and can choose to use it
4. User doesn't see interruption - context is seamlessly integrated
5. Claude may proactively apply doc-writer patterns

### Blocking vs Suggestive Comparison

| Aspect             | Blocking                  | Suggestive                             |
| ------------------ | ------------------------- | -------------------------------------- |
| **JSON field**     | `decision: "block"`       | `hookSpecificOutput.additionalContext` |
| **User impact**    | Interrupts flow           | Seamless                               |
| **Claude action**  | Must address `reason`     | May use context                        |
| **Use when**       | Must fix/review something | Optional guidance/tips                 |
| **Example events** | Stop, PreToolUse          | PostToolUse, UserPromptSubmit          |

### Additional Feedback Patterns

#### 1. Block with structured instructions

```typescript
const output: SyncHookJSONOutput = {
  decision: "block",
  reason: `Found 3 issues:
• Type error in user.ts:45
• Missing test for handleSubmit()
• TODO comment in api/routes.ts

Fix these before continuing.`,
};
```

#### 2. Suggest with XML tags for parsing

```typescript
const output: SyncHookJSONOutput = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: `<code-quality-tip>
Consider adding error handling to the new API endpoint.
Example: try/catch with proper error responses.
</code-quality-tip>`,
  },
};
```

#### 3. PreToolUse auto-approve with feedback

```typescript
const output: SyncHookJSONOutput = {
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow",
    permissionDecisionReason: "Documentation file auto-approved",
  },
  suppressOutput: true, // Don't show in transcript
};
```

## Common Use Cases

### 1. Auto-format code

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    {
      "type": "command",
      "command": "jq -r '.tool_input.file_path' | { read f; [[ $f == *.ts ]] && npx prettier --write \"$f\"; }"
    }
  ]
}
```

### 2. Block sensitive files (exit code 2)

```typescript
#!/usr/bin/env bun
const data = await Bun.stdin.json();
const filePath = data.tool_input?.file_path ?? "";

if (filePath.includes(".env")) {
  console.error("Blocked: Never commit .env files");
  process.exit(2); // Exit 2 blocks tool, stderr shown to Claude
}
```

### 3. Desktop notifications

```json
{
  "matcher": "idle_prompt",
  "hooks": [
    {
      "type": "command",
      "command": "notify-send 'Claude Code' 'Awaiting input'"
    }
  ]
}
```

### 4. Log commands

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "jq -r '.tool_input.command' >> ~/.claude/command-log.txt"
    }
  ]
}
```

## Prompt-Based Hooks

For intelligent, context-aware decisions:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if Claude should stop. Context: $ARGUMENTS\n\nCheck if all tasks are complete.\n\nRespond: {\"decision\": \"approve\" or \"block\", \"reason\": \"...\"}"
          }
        ]
      }
    ]
  }
}
```

**LLM response schema:**

```json
{
  "decision": "approve", // or "block"
  "reason": "...",
  "continue": false, // Optional: stops Claude
  "stopReason": "...", // Optional: custom message
  "systemMessage": "..." // Optional: shown to user
}
```

## Security Best Practices

⚠️ **Hooks run automatically with your credentials - review carefully!**

1. **Validate inputs** - Never trust hook data blindly
2. **Quote variables** - Use `"$VAR"` not `$VAR`
3. **Block path traversal** - Check for `..` in paths
4. **Absolute paths** - Use `$CLAUDE_PROJECT_DIR` for project scripts
5. **Skip sensitive files** - Avoid `.env`, `.git/`, keys

## Debugging

### Check Configuration

```bash
# Via Claude Code
/hooks

# Direct file
cat ~/.claude/settings.json
cat .claude/settings.json
```

### Debug Mode

```bash
claude --debug
```

Shows:

- Hook matching
- Command execution
- Output/errors
- Timing

### Test Hooks Manually

```bash
cat <<'EOF' | bun your-hook-script.ts
{"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"default","hook_event_name":"PreToolUse","tool_name":"Write","tool_input":{"file_path":"test.txt"}}
EOF
```

## Common Issues

| Problem                  | Check                                      |
| ------------------------ | ------------------------------------------ |
| Hook not running         | Matcher case-sensitive? Event correct?     |
| Command not found        | Use absolute path or `$CLAUDE_PROJECT_DIR` |
| Invalid JSON             | Escape quotes: `\"` in JSON strings        |
| Hook times out           | Increase timeout or optimize command       |
| Hook blocks unexpectedly | Check exit code (2 = block)                |

## MCP Tool Hooks

MCP tools follow pattern: `mcp__<server>__<tool>`

```json
{
  "matcher": "mcp__memory__.*", // All memory operations
  "matcher": "mcp__.*__write.*", // All write operations
  "matcher": "mcp__github__.*" // All GitHub operations
}
```

## Hook Execution Details

- **Timeout**: 60s default, configurable per hook
- **Parallelization**: All matching hooks run in parallel
- **Deduplication**: Identical commands run once
- **Environment**: Inherits Claude Code's environment
- **Snapshots**: Hook config captured at startup (requires `/hooks` review to apply changes)

## More Information

See full documentation:

- [docs/hooks.md](../docs/hooks.md) - Complete reference
- [docs/hooks-guide.md](../docs/hooks-guide.md) - Quickstart and examples
