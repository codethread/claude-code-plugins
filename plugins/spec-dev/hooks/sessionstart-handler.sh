#!/usr/bin/env bash
# Handle SessionStart event - inject context if spec-dev session is active

set -euo pipefail

# Read JSON input from stdin
input=$(cat)

# Extract session_id and cwd from JSON
session_id=$(echo "$input" | jq -r '.session_id')
cwd=$(echo "$input" | jq -r '.cwd')
source=$(echo "$input" | jq -r '.source')

# Normalize CWD for filesystem (replace / with -)
normalized_cwd=$(echo "$cwd" | sed 's|^/||' | sed 's|/|-|g')

# Locate session file
cache_dir="$HOME/.local/cache/codethread-plugins/spec-dev/$normalized_cwd"
session_file="$cache_dir/$session_id.json"

# Check if session file exists
if [ ! -f "$session_file" ]; then
  # Not a spec-dev session, exit silently
  exit 0
fi

# Read session status
status=$(jq -r '.status' "$session_file")
compactions=$(jq -r '.compactions // 0' "$session_file")

# Only inject context if status is enabled
if [ "$status" != "enabled" ]; then
  exit 0
fi

# Get the most recent spec
latest_spec=$("${CLAUDE_PLUGIN_ROOT}/scripts/get-latest-spec.sh" "$cwd/specs" 2>/dev/null || echo "")

# Build additional context message
context_msg="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 SPEC-DEV MODE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This session is in spec-driven development mode.

**CRITICAL**: You MUST load the \`spec-dev:spec-architect\` skill immediately

**Workflow**: Follow the ITERATE workflow
**Compactions**: This session has been compacted $compactions time(s)
**Latest Spec**: $latest_spec

After loading the skill, follow the ITERATE workflow to assess the current state and route to either PLAN or BUILD workflow as appropriate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Output JSON with additionalContext
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $(echo "$context_msg" | jq -Rs .)
  },
  "suppressOutput": true
}
EOF

exit 0
