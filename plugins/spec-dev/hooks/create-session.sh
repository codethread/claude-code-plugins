#!/usr/bin/env bash
# Create and initialize spec-dev session tracking file

set -euo pipefail

# Read JSON input from stdin
input=$(cat)

# Extract session_id and cwd from JSON
session_id=$(echo "$input" | jq -r '.session_id')
cwd=$(echo "$input" | jq -r '.cwd')

# Normalize CWD for filesystem (replace / with -)
normalized_cwd=$(echo "$cwd" | sed 's|^/||' | sed 's|/|-|g')

# Create cache directory path
cache_dir="$HOME/.local/cache/personal-configs-plugins/spec-dev/$normalized_cwd"
session_file="$cache_dir/$session_id.json"

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

echo "✓ Session tracking initialized: $session_file"
exit 0
