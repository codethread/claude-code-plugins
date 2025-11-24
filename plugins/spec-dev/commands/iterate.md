---
description: Continue or expand work on existing specification with new requirements
argument-hint: [what to add/change/continue]
allowed-tools: Bash(bash:*)
---

# Iterate on Existing Specification

Use the Skill tool to load the `spec-architect` skill and execute the **ITERATE workflow**.

## Context

- Most recent spec: !`bash $CT_PLUGINS_DIR/spec-dev/scripts/get-latest-spec.sh specs`

## Arguments

- `ITERATION_BRIEF`: $ARGUMENTS

## Instructions

1. Determine which spec to use:
   - By default, use the most recent spec from Context
   - If `ITERATION_BRIEF` mentions a specific spec (e.g., "add PDF export to specs/002-dashboard"), use that spec instead
   - Pay attention to phrases like "in spec 002", "for the authentication feature", or explicit spec directory references

2. Load the `spec-dev:spec-architect` skill

3. Follow the **ITERATE Workflow** described in the loaded skill:
   - The workflow will assess the current state
   - Route to **PLAN Workflow** if specifications need creation/refinement
   - Route to **BUILD Workflow** if ready to implement from existing specs

4. Use the `ITERATION_BRIEF` to understand what the user wants (continue implementation, add features, refine design, etc.)
