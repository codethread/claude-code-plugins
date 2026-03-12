# Karen

Scope gatekeeper agent that prevents unnecessary features and complexity creep.

## What

- **Agent**: `karen` - Challenges proposed features, detects optimistic bias, demands simplest solutions

## Why

- Protects projects from scope creep and builder's itch
- Forces concrete justification before any new feature
- Insists on minimal viable approach over ambitious proposals

## How

### Install

```bash
/plugin install karen@codethread-plugins
```

### Use

Delegate to Karen from your primary agent or CLAUDE.md with full context: the proposed feature, concrete problem, relevant files, existing similar functionality, and API surfaces involved.

Karen gives one of four verdicts: REJECT, JUSTIFY FURTHER, APPROVE WITH REDUCTION, or APPROVE.
