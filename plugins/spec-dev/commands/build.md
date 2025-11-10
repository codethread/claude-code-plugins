---
description: Build a new feature using systematic spec-driven development workflow
argument-hint: [feature briefing or description]
allowed-tools: Bash(bash:*)
---

# Build Feature with Spec-Driven Development

Use the Skill tool to load the `spec-architect` skill and execute the **BUILD workflow**.

## Context

- Next available spec ID: !`bash ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/scripts/get-next-spec-id.sh`

## Arguments

- `FEATURE_BRIEF`: $ARGUMENTS

## Instructions

1. Load the `spec-dev:spec-architect` skill

2. Follow the **PLAN Workflow** first to create and validate specifications

3. Use the `FEATURE_BRIEF` as your starting point for planning

4. Use the next available spec ID from Context when creating the specification directory

5. Once specifications are complete and validated, proceed to the **BUILD Workflow** for implementation
