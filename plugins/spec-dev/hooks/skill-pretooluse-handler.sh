#!/usr/bin/env bash
# Handle PreToolUse for Skill tool - initialize session when spec-architect is loaded

set -euo pipefail

# Read JSON input from stdin
input=$(cat)

# Extract tool name and skill parameter
tool_name=$(echo "$input" | jq -r '.tool_name')
skill=$(echo "$input" | jq -r '.tool_input.skill // ""')

# Only proceed if this is a Skill tool call for spec-dev:spec-architect
if [ "$tool_name" != "Skill" ] || [ "$skill" != "spec-dev:spec-architect" ]; then
  exit 0
fi

# Extract session_id and cwd
session_id=$(echo "$input" | jq -r '.session_id')
cwd=$(echo "$input" | jq -r '.cwd')

# Normalize CWD for filesystem (replace / with -)
normalized_cwd=$(echo "$cwd" | sed 's|^/||' | sed 's|/|-|g')

# Create cache directory path
cache_dir="$HOME/.local/cache/personal-configs-plugins/spec-dev/$normalized_cwd"
session_file="$cache_dir/$session_id.json"

# Check if session file already exists
if [ -f "$session_file" ]; then
  # Session already initialized
  exit 0
fi

# Create directory if it doesn't exist
mkdir -p "$cache_dir"

# Create initial session file
cat > "$session_file" <<EOF
{
  "status": "enabled",
  "compactions": 0,
  "cwd": "$cwd",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "✓ Spec-dev session tracking initialized"
exit 0
