# Workflow Plugin

Structured plan-then-build development workflow using beads (`bd` CLI) for task management and multi-agent execution.

## What

- Two-phase workflow: freeform planning followed by beads-driven execution
- Architect/worker agent loop with quality gates
- Git integration with task-referenced commits

## Why

- Prevents premature implementation — forces thorough problem understanding first
- Autonomous execution with minimal user intervention
- Traceable history: git commits map to approved tasks

## How

### Install

```
/plugin install workflow@codethread-plugins
```

### Use

```
/skill workflow
```

### Prerequisites

- `bd` CLI installed and available on `$PATH`
- Git repository with a base branch
