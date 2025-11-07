#!/bin/bash
# Sync documentation from docs.anthropic.com
# This script fetches the latest Claude Code documentation

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/../docs"
MANIFEST="$DOCS_DIR/docs_manifest.json"

echo "Claude Code Knowledge - Documentation Sync"
echo "=========================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required but not found"
    exit 1
fi

# Check if requests module is available
if ! python3 -c "import requests" &> /dev/null; then
    echo "Installing required Python package: requests"
    python3 -m pip install --quiet requests || {
        echo "Error: Failed to install requests package"
        echo "Please install manually: pip install requests"
        exit 1
    }
fi

# Check if docs exist
if [[ ! -f "$MANIFEST" ]]; then
    echo "📥 No local documentation found. Fetching for the first time..."
    echo "This may take a minute..."
    echo ""
    python3 "$SCRIPT_DIR/fetch_docs.py"
    echo ""
    echo "✅ Documentation fetched successfully!"
    exit 0
fi

# Check last update time
LAST_UPDATE=$(jq -r '.last_updated // "unknown"' "$MANIFEST")
echo "📋 Last update: $LAST_UPDATE"
echo ""

# Check if we should update (if last update was more than 3 hours ago)
if [[ "$LAST_UPDATE" != "unknown" ]]; then
    LAST_UPDATE_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${LAST_UPDATE:0:19}" "+%s" 2>/dev/null || echo "0")
    CURRENT_EPOCH=$(date "+%s")
    HOURS_SINCE_UPDATE=$(( (CURRENT_EPOCH - LAST_UPDATE_EPOCH) / 3600 ))

    if [[ $HOURS_SINCE_UPDATE -lt 3 ]]; then
        echo "✅ Documentation is up to date (updated $HOURS_SINCE_UPDATE hour(s) ago)"
        echo "Sync runs automatically every 3 hours from docs.anthropic.com"
        exit 0
    fi

    echo "🔄 Documentation is $HOURS_SINCE_UPDATE hour(s) old. Checking for updates..."
else
    echo "🔄 Checking for updates..."
fi

echo ""

# Run fetch to update
python3 "$SCRIPT_DIR/fetch_docs.py"

echo ""
echo "✅ Sync complete!"
