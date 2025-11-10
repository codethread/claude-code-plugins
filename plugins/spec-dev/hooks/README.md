# Spec-Dev Hooks

Automatic session tracking and workflow resumption.

## How It Works

### Session Files

Location: `~/.local/cache/personal-configs-plugins/spec-dev/<normalized-cwd>/<session-id>.json`

Created when `spec-architect` skill loads. Contains status, compaction count, cwd, timestamp.

### Compaction Tracking

Each compaction increments the `compactions` counter in the session file.

### Workflow Resumption

On session start (startup/resume/post-compact), if session file exists with `status: "enabled"`:
- Loads `spec-architect` skill
- Follows ITERATE workflow
- Shows compaction count and latest spec

## Debugging

Find sessions:
```bash
cwd=$(pwd | sed 's|^/||' | sed 's|/|-|g')
ls -la ~/.local/cache/personal-configs-plugins/spec-dev/$cwd/
```

View session file:
```bash
session_id="your-session-id"
cwd=$(pwd | sed 's|^/||' | sed 's|/|-|g')
cat ~/.local/cache/personal-configs-plugins/spec-dev/$cwd/$session_id.json
```

Test hooks:
```bash
# PreToolUse
echo '{"tool_name":"Skill","tool_input":{"skill":"spec-architect"},"session_id":"test-123","cwd":"'$(pwd)'"}' | \
  ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/hooks/skill-pretooluse-handler.sh

# PreCompact
echo '{"session_id":"test-123","cwd":"'$(pwd)'"}' | \
  ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/hooks/precompact-handler.sh

# SessionStart
echo '{"session_id":"test-123","cwd":"'$(pwd)'","source":"startup"}' | \
  ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/hooks/sessionstart-handler.sh
```

## Files

```
hooks/
├── hooks.json                      # Hook registration
├── skill-pretooluse-handler.sh     # Initialize session when skill loads
├── precompact-handler.sh           # Increment compaction counter
├── sessionstart-handler.sh         # Inject context if session is active
└── README.md                       # This file
```
