# BDFL Plugin — Maintainer Guide

## Architecture Overview

BDFL (Benevolent Dictator For Life) is a skill-only plugin with no hooks, commands, or TypeScript. It provides two user-invokable skills that share a single architecture reference document.

## Directory Structure

```
plugins/bdfl/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── CLAUDE.md                 # This file (maintainer guide)
├── README.md                 # User quick start
└── skills/
    ├── init/
    │   ├── SKILL.md          # Bootstrap skill
    │   └── references/
    │       └── architecture.md   # Canonical architecture spec (single source of truth)
    └── migrate/
        ├── SKILL.md          # Migration skill
        └── references/
            └── architecture.md   # Symlink → ../../init/references/architecture.md
```

## Component Responsibilities

### `skills/init/SKILL.md`

Scaffolds a new project from scratch. Takes `$ARGUMENTS` as a project outline describing what to build and which components are needed. Walks through the full architecture reference to set up everything from package manager to Claude Code hooks.

### `skills/migrate/SKILL.md`

Analyses an existing project, compares it against the architecture reference, produces a gap list ordered by migration difficulty, and proposes the single easiest next step. Uses `EnterPlanMode` so the user reviews before execution. Designed to be run repeatedly — each invocation tackles one migration.

### `skills/init/references/architecture.md`

The single source of truth for all technology choices: runtime, package manager, TypeScript config, Effect.ts, component frameworks, containerisation, tooling (linting, formatting, type-checking), and Claude Code hooks. Both skills reference this file.

### `skills/migrate/references/architecture.md` (symlink)

Symlink to `../../init/references/architecture.md`. Ensures both skills always read the same architecture spec without duplication.

## How It Works

1. User invokes `/bdfl:init <outline>` or `/bdfl:migrate`
2. Claude loads the SKILL.md which references `architecture.md`
3. The skill instructions guide Claude through the scaffolding or analysis process
4. No hooks or agents are involved — these are purely user-driven skills

## Common Maintenance Tasks

### Updating the architecture

Edit `skills/init/references/architecture.md` only. The migrate skill picks up changes automatically via the symlink.

### Adding a new skill

1. Create `skills/<name>/SKILL.md`
2. If it needs the architecture reference, symlink it: `ln -s ../../init/references/architecture.md skills/<name>/references/architecture.md`
3. Update this CLAUDE.md

## Architecture Rationale

- **Symlink over copy**: Single source of truth for architecture decisions. Editing one file updates both skills.
- **No hooks/commands**: These skills are heavyweight operations (project creation / migration planning) that only make sense when explicitly invoked by a user.
- **Migrate is incremental**: Big-bang migrations fail. One step at a time with verification keeps projects stable.
- **EnterPlanMode in migrate**: Migrations modify existing code, so the user must review and approve before execution.

## Common Pitfalls

- Do not duplicate `architecture.md` — always maintain the symlink
- The init skill expects `$ARGUMENTS` — invoking it without a project outline will produce a generic scaffold
- The migrate skill should always propose exactly one migration step, not attempt multiple changes at once
- Skills are invoked as `/bdfl:init` and `/bdfl:migrate` (namespaced), not `/init` or `/migrate`
