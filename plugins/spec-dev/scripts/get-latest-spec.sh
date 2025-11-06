#!/bin/bash

# get-latest-spec.sh
# Finds the most recently modified specification directory
# Returns the full directory path (e.g., specs/003-feature-name)

get_latest_spec() {
    local specs_dir="${1:-specs}"

    # Find all spec directories matching the pattern XXX-*
    # Sort by modification time and get the most recent
    local latest_spec=$(find "$specs_dir" -maxdepth 1 -type d -name "[0-9][0-9][0-9]-*" 2>/dev/null | xargs ls -td 2>/dev/null | head -1)

    if [[ -z "$latest_spec" ]]; then
        echo "No spec directories found" >&2
        return 1
    fi

    echo "$latest_spec"
}

# If script is executed directly (not sourced), call the function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    get_latest_spec "$@"
fi
