#!/usr/bin/env bash
# Handle PreCompact event - increment compactions counter

set -euo pipefail

# Read JSON input from stdin
input=$(cat)

# Extract session_id and cwd from JSON
session_id=$(echo "$input" | jq -r '.session_id')
cwd=$(echo "$input" | jq -r '.cwd')

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

# Read current compactions count
current_compactions=$(jq -r '.compactions // 0' "$session_file")

# Increment counter
new_compactions=$((current_compactions + 1))

# Update the session file
jq --arg count "$new_compactions" '.compactions = ($count | tonumber)' "$session_file" > "$session_file.tmp"
mv "$session_file.tmp" "$session_file"

echo "✓ Compaction #$new_compactions tracked for spec-dev session"
exit 0
