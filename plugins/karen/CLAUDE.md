# Karen Plugin — Maintainer Guide

## Architecture Overview

Karen is an agent-only plugin with no hooks, commands, skills, or TypeScript. It provides a single agent that acts as a scope gatekeeper for any project.

## Directory Structure

```
plugins/karen/
├── .claude-plugin/
│   └── plugin.json      # Plugin manifest
├── agents/
│   └── karen.md         # Scope gatekeeper agent
├── CLAUDE.md            # This file (maintainer guide)
└── README.md            # User quick start
```

## Component Responsibilities

### `agents/karen.md`

Called by a primary agent (or via CLAUDE.md instructions) before implementing new features. Expects the caller to front-load context: proposed feature, concrete problem, relevant files, existing similar functionality, and API surfaces. Gives a verdict: REJECT, JUSTIFY FURTHER, APPROVE WITH REDUCTION, or APPROVE.

Key behaviors:
- Challenges necessity with pointed questions
- Detects optimistic bias from the calling agent
- Demands the simplest possible solution
- Holds the line across multiple rounds of justification
- Uses `opus` model for thorough critical analysis

## Usage Patterns

### From CLAUDE.md (recommended)

Add to any project's CLAUDE.md to enforce scope gating:

```markdown
### Mandatory scope gating (Karen)

Before implementing ANY new feature, addition, or expansion, first consult the `karen` agent.
Front-load Karen with: the proposed feature, the concrete problem, relevant file paths,
existing similar functionality, and API surfaces involved.
Do NOT proceed with implementation until Karen has approved or the user has explicitly overridden.
```

### Direct delegation

A primary agent can delegate to Karen mid-conversation when a feature request comes up.

## Common Pitfalls

- Do not call Karen without context — she will reject the request and demand the caller do discovery work first
- Karen is designed for back-and-forth; resume the agent across rounds rather than starting fresh
- Karen's verdicts are advisory — the user can always override
