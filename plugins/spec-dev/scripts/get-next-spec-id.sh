#!/bin/bash

# get-next-spec-id.sh
# Determines the next available specification ID number by scanning existing spec directories
# Creates specs/ directory if it doesn't exist
# Returns a 3-digit padded ID (001, 002, etc.)

get_next_spec_id() {
    local specs_dir="${1:-specs}"

    # Create specs directory if it doesn't exist
    if [[ ! -d "$specs_dir" ]]; then
        mkdir -p "$specs_dir" 2>/dev/null
        echo "001"
        return 0
    fi

    # Find all spec directories matching the pattern XXX-*
    # Extract the numerical IDs from directory names
    local highest_id=0
    local found_specs=false

    # Use find to get spec directories, then extract IDs
    while IFS= read -r -d '' dir; do
        found_specs=true
        local dirname=$(basename "$dir")

        # Match directories with pattern: 3 digits, dash, then anything
        if [[ "$dirname" =~ ^[0-9]{3}-.*$ ]]; then
            # Extract the 3-digit ID from the beginning of the directory name
            local id="${dirname:0:3}"

            # Convert to integer for comparison (remove leading zeros)
            local id_int=$((10#$id))

            if [[ $id_int -gt $highest_id ]]; then
                highest_id=$id_int
            fi
        fi
    done < <(find "$specs_dir" -maxdepth 1 -type d -name "[0-9][0-9][0-9]-*" -print0 2>/dev/null)

    # If no specs found, return 001
    if [[ "$found_specs" == false ]]; then
        echo "001"
        return 0
    fi

    # Calculate next ID and format with leading zeros
    local next_id=$((highest_id + 1))
    printf "%03d" $next_id
}

# If script is executed directly (not sourced), call the function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    get_next_spec_id "$@"
fi
