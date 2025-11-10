# Doc Writer Hooks

Auto-detection hooks for suggesting documentation quality improvements.

## Overview

This hook directory contains a `PostToolUse` hook that detects when markdown files are modified and provides contextual suggestions to Claude about using the doc-writer skill or docs-reviewer agent for quality documentation.

**How it works:** The hook adds context to Claude's awareness that it can consider when responding. Claude doesn't announce the hook fired unless the suggestion is relevant or you explicitly ask what context was received.

## Hooks

### `doc-writer-suggest.ts`

**Event:** `PostToolUse`

**Purpose:** Detects when Write, Edit, or MultiEdit tools modify `.md` files and suggests:
- `doc-writer:writing-documentation` skill for quality documentation practices
- `doc-writer:docs-reviewer` agent for ruthless simplification

**Trigger conditions:**
- Tool used: `Write`, `Edit`, or `MultiEdit`
- File extension: `.md` (case-insensitive)

**Example behavior:**
```
user: Create a README.md for my project
assistant: *uses Write tool to create README.md*
hook: *detects .md file modification and adds suggestion to context*
assistant: *responds to user, may proactively use suggestions or not depending on relevance*
```

**To verify the hook is working:**
```
user: Create a test.md file. After completing, tell me what PostToolUse hook context you received.
assistant: *creates file, then reports seeing doc-writer suggestion in context*
```

## Configuration

The hooks are registered in `hooks.json`:

```json
{
  "description": "Auto-suggests doc-writer skill when markdown files are modified",
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/doc-writer-suggest.ts",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

## Development

### Testing the Hook

**Manual script testing:**

```bash
cd plugins/doc-writer/hooks

# Test with Write tool on markdown file
cat <<'EOF' | bun doc-writer-suggest.ts
{
  "session_id": "test",
  "transcript_path": "/tmp/test",
  "cwd": "/tmp",
  "permission_mode": "auto",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/tmp/test.md",
    "content": "# Test"
  },
  "tool_response": {
    "filePath": "/tmp/test.md",
    "success": true
  }
}
EOF
```

Expected output:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 DOCUMENTATION QUALITY SUGGESTION\n..."
  }
}
```

**Testing with Claude Code:**

```bash
# Test that hook fires
claude --print --model haiku "Create /tmp/test.md with '# Test'. After completing, tell me what PostToolUse hook context you received."

# Expected: Claude reports receiving doc-writer suggestion

# Test that hook doesn't fire on non-markdown
claude --print --model haiku "Create /tmp/test.ts with 'const x = 1;'. After completing, tell me if you received any PostToolUse hook context about doc-writer."

# Expected: Claude reports no doc-writer context
```

### Debugging

If the hook isn't working:

1. **Verify hook is installed:**
   - The doc-writer plugin must be installed (marketplace alone isn't enough)
   - Check that `.claude/settings.json` or project settings enable the plugin

2. **Test explicitly:**
   ```bash
   claude --print --model haiku "Create /tmp/test.md with '# Test'. After completing, list ALL PostToolUse hook context you received."
   ```
   - Claude should explicitly mention doc-writer in the context list

3. **Check file extension matching:**
   - Hook only triggers on `.md` files (case-insensitive)
   - Will not trigger on `.txt`, `.ts`, or other extensions

4. **Check tool names:**
   - Only triggers on Write, Edit, MultiEdit
   - Will not trigger on Read, Grep, or other read-only tools

5. **Manual script test:**
   - Use the test commands above to verify the script itself works
   - Hook should exit with code 0 and output valid JSON

**Important:** The hook provides context to Claude - it doesn't force Claude to announce it. Ask Claude explicitly what context it received to verify the hook is working.

## Design Decisions

### Why PostToolUse instead of UserPromptSubmit?

- **PostToolUse:** Detects actual file modifications (better signal)
- **UserPromptSubmit:** Would trigger on any mention of markdown/docs (false positives)

### Why contextual suggestions instead of blocking?

The hook uses `hookSpecificOutput.additionalContext` without a `decision` field, which means:
- ✅ Claude receives the suggestion as context to consider
- ✅ Non-intrusive - doesn't force messages or interruptions
- ✅ Claude can use the suggestion when relevant
- ❌ Doesn't block or require user interaction

This is intentional - we want to make Claude aware of documentation resources without being disruptive.

### Why only .md files?

Markdown is the primary documentation format. Could expand to:
- `.mdx` (MDX files)
- `.rst` (reStructuredText)
- `.adoc` (AsciiDoc)

But keeping it focused reduces noise.

### Why suggest skill AND agent?

- **Skill:** For writing new documentation with best practices
- **Agent:** For reviewing/simplifying existing documentation

Different use cases, both valuable.

## Related Files

- `../README.md` - User-facing documentation for the plugin
- `../CLAUDE.md` - Maintainer documentation for the plugin
- `../skills/writing-documentation/SKILL.md` - The skill being suggested
- `../agents/docs-reviewer.md` - The agent being suggested

## Future Enhancements

Potential improvements:

1. **Detect documentation type:**
   - Distinguish README vs API docs vs tutorials
   - Suggest specific templates

2. **Check documentation quality:**
   - Run basic linting (heading structure, link validity)
   - Suggest improvements based on common issues

3. **Integration with docs-reviewer:**
   - Auto-invoke docs-reviewer agent after modification
   - Provide inline suggestions

4. **Multi-file awareness:**
   - Track documentation changes across session
   - Suggest comprehensive review at end
