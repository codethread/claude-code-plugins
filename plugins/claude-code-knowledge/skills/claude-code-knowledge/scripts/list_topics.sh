#!/bin/bash
# List available documentation topics
# This script lists all .md files in the docs directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/../docs"

if [[ ! -d "$DOCS_DIR" ]]; then
    echo "Error: Documentation directory not found at $DOCS_DIR"
    echo "Run sync_docs.sh first to fetch documentation."
    exit 1
fi

echo "Available Claude Code documentation topics:"
echo ""

# List all .md files, remove extension, sort
ls -1 "$DOCS_DIR"/*.md 2>/dev/null | \
    xargs -n1 basename | \
    sed 's/\.md$//' | \
    sort | \
    sed 's/^/  • /'

# Count topics
TOPIC_COUNT=$(ls -1 "$DOCS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "Total: $TOPIC_COUNT topics"
echo ""
echo "Usage: cat docs/<topic>.md"
echo "Example: cat docs/hooks.md"
