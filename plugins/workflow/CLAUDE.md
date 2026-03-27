# Workflow Plugin — Maintainer Guide

## Architecture Overview

Workflow is a skill-only plugin with no hooks, commands, agents, or TypeScript. It provides a single skill that defines a structured plan-then-build development process using beads (`bd` CLI).

## Directory Structure

```
plugins/workflow/
├── .claude-plugin/
│   └── plugin.json      # Plugin manifest
├── CLAUDE.md             # This file (maintainer guide)
├── README.md             # User quick start
└── skills/
    └── workflow/
        └── SKILL.md      # Full workflow definition
```

## Component Responsibilities

### `skills/workflow/SKILL.md`

Defines a two-phase development workflow:

1. **Planning phase** — freeform exploration, experimentation, and plan document creation. No beads or task tracking.
2. **Execution phase** — beads-driven loop with architect/worker agent roles, quality gates, and git integration.

Key concepts:
- **Worker agents**: stateless, pick up tasks from `bd ready`, complete them
- **Architect agent**: stateful, reviews work, manages epic evolution, creates task batches
- **Quality gate**: architect reviews before committing; rework sent back to workers
- **Epic evolution**: plan adapts when implementation reveals new information

## Common Maintenance Tasks

### Updating the workflow

Edit `skills/workflow/SKILL.md` directly. The entire workflow definition lives in this single file.

### Changing the beads CLI interface

If `bd` CLI commands change, update the relevant references in SKILL.md (e.g., `bd create --type=epic`, `bd ready`, `bd show`).

## Architecture Rationale

- **Skill-only**: heavyweight operation that only makes sense when explicitly invoked
- **Single file**: workflow is a cohesive process, not decomposable into separate references
- **No hooks**: workflow is user-initiated, not auto-detected

## Common Pitfalls

- The planning phase must produce a plan document before execution begins — don't skip to beads
- Tasks are created ad hoc in small batches (2-3), not all upfront
- The architect agent should escalate to the user only for fundamental requirement conflicts, not implementation details
- Epic descriptions can evolve; original requirements should not
