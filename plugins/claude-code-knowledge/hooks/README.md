# Claude Code Knowledge Hook

This hook automatically injects context about the `claude-code-knowledge` skill when users ask questions about Claude Code topics.

## How It Works

### Hook Event: UserPromptSubmit

The hook runs on the `UserPromptSubmit` event, which fires when a user submits a prompt before Claude processes it.

### Context Injection Mechanism

For `UserPromptSubmit` hooks, there are two ways to inject context:

1. **Simple Method (stdout)**: Print context to stdout and exit with code 0
   - Claude automatically adds stdout to the conversation context
   - This is what our hook uses

2. **JSON Method**: Return structured JSON with `hookSpecificOutput.additionalContext`
   - More explicit but same effect
   - Allows additional control fields

### Detection Logic

The hook (`claude-code-prompt.ts`) detects Claude Code-related questions using:

1. **Exact keywords**: `"claude code"`, `"claudecode"`, `"claude-code"`

2. **Standalone "claude" patterns**: Questions like:
   - `"how do/does/can claude..."`
   - `"can claude..."`
   - `"is claude..."`
   - But NOT when followed by model names (opus, sonnet, haiku)

3. **Claude Code feature patterns**:
   - `"hook"`, `"mcp server"`, `"skill"`, `"slash command"`
   - `"claude" + "setting/config/feature/capability"`
   - Questions about implementing hooks/mcp/skills

### When Match Found

If a match is detected, the hook prints a formatted context message to stdout:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CLAUDE CODE DOCUMENTATION CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Detection: [reason for match]

📖 RECOMMENDED SKILL:
  → claude-code-knowledge:claude-code-knowledge

This skill provides:
  • Official Claude Code documentation
  • 45+ topics covering all features
  • Hooks, MCP, skills, settings, CLI
  • Auto-synced from docs.anthropic.com

IMPORTANT: Use the Skill tool to load claude-code-knowledge
before answering questions about Claude Code features.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This context is automatically added to the conversation, prompting Claude to:
1. Recognize a Claude Code question was asked
2. Load the `claude-code-knowledge` skill
3. Use official documentation to answer

## Configuration

The hook is registered in `hooks.json`:

```json
{
  "description": "Auto-suggests claude-code-knowledge skill when user mentions Claude Code topics",
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/claude-code-prompt.ts",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Key Configuration Points

- **Event**: `UserPromptSubmit` - runs before Claude processes the prompt
- **Type**: `command` - executes a bash command
- **Command**: `${CLAUDE_PLUGIN_ROOT}/hooks/claude-code-prompt.ts` - the hook script
- **Timeout**: 30 seconds - maximum execution time
- **No matcher**: UserPromptSubmit doesn't use matchers (runs on all prompts)

## Plugin Integration

When the `claude-code-knowledge` plugin is installed:

1. `hooks.json` is automatically merged with user/project hooks
2. Hook runs on every user prompt submission
3. Detection logic identifies Claude Code questions
4. Context is injected seamlessly into the conversation

## Exit Codes

- **Exit 0**: Success - stdout is added to context (for UserPromptSubmit)
- **Exit 1**: Error - hook failed (error logged)
- **Exit 2**: Blocking error - would block prompt (but we don't use this)

## Testing the Hook

To test if the hook is working:

1. Ask a Claude Code question:
   ```
   How do I create a hook in Claude Code?
   ```

2. Check if Claude:
   - Loads the `claude-code-knowledge` skill
   - References documentation from the skill
   - Provides accurate answers with citations

3. View the injected context in transcript mode (`Ctrl+R`)

## Customization

To modify detection patterns, edit `claude-code-prompt.ts`:

```typescript
// Add to claudeCodeKeywords for exact matches
const claudeCodeKeywords = ["claude code", "claudecode", "claude-code", "your-keyword"];

// Add to standaloneClaudePatterns for regex matching
const standaloneClaudePatterns = [
  /your\s+pattern/i,
];

// Add to claudeCodePatterns for feature detection
const claudeCodePatterns = [
  /your\s+feature/i,
];
```

## Benefits

1. **Automatic documentation access**: No need to manually load the skill
2. **Improved accuracy**: Claude uses official docs instead of guessing
3. **Better UX**: Users don't need to know about the skill
4. **Consistent answers**: Always references authoritative documentation
5. **Zero friction**: Works transparently in the background

## Implementation Details

### Technology Stack

- **Runtime**: Bun (TypeScript)
- **Input**: JSON via stdin (hook input data)
- **Output**: Plain text to stdout (context injection)
- **Error handling**: Errors logged to stderr

### Hook Input Schema

The hook receives this JSON structure via stdin:

```typescript
{
  session_id: string
  transcript_path: string
  cwd: string
  permission_mode: string
  hook_event_name: "UserPromptSubmit"
  prompt: string  // The user's submitted prompt
}
```

### Performance

- **Execution time**: <100ms (pattern matching only)
- **Memory**: Minimal (no file I/O or external calls)
- **Impact**: Negligible on user experience

## Troubleshooting

### Hook not running

1. Check if plugin is installed: `/plugin list`
2. Verify hooks.json is valid JSON
3. Check hook script is executable: `ls -la hooks/claude-code-prompt.ts`
4. Enable debug mode: `claude --debug`

### Context not appearing

1. Verify exit code is 0 (success)
2. Check stdout is being printed
3. Review pattern matching logic
4. Test with explicit keywords: "claude code hooks"

### False positives

If hook triggers too often:
1. Make patterns more specific
2. Add negative lookaheads to exclude common phrases
3. Adjust keyword matching logic

## References

- [Hooks Reference](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Hooks Guide](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)
- [UserPromptSubmit Hook Documentation](https://docs.anthropic.com/en/docs/claude-code/hooks#userpromptsubmit)
- [Plugin Hooks Documentation](https://docs.anthropic.com/en/docs/claude-code/hooks#plugin-hooks)
