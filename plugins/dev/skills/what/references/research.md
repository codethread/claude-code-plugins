# Research Protocol

## When to Research

- External API or service you haven't integrated before
- CLI tool with flags that may not behave as documented
- Library upgrade with breaking changes
- Unfamiliar framework or pattern the project needs to adopt

## Process

1. **Read primary sources first**: official docs, source code, changelogs — not blog posts or tutorials
2. **Note version numbers**: pin every finding to a specific version
3. **Flag contradictions**: where docs say one thing but source code suggests another
4. **Test claims**: never trust capability claims without verification (see `learning-tests.md`)
5. **Exploit inspectability**: for npm packages, read `node_modules/<pkg>/` — types and source are ground truth. For open-source tools, clone or browse the upstream repo. Consider vendoring critical dependencies into a temp directory for deep exploration.

### Research vs Execution

Research can be **conclusive** for inspectable dependencies — if you read the TypeScript types and the implementation, you know the truth. For black-box dependencies (binaries, closed APIs), research is **preliminary only**. It tells you what to test, not what to trust. Always follow up with learning tests for anything you can't read the source of.

## Output: research.md

```markdown
# Research: [topic]

## Context
Why this research was needed.

## Findings

### [Area 1]
- What we learned
- Version: x.y.z
- Confidence: high/medium/low
- Source: [link or file path]

### [Area 2]
...

## Contradictions / Surprises
Things that didn't match expectations or documentation.

## Implications for Design
How findings affect what we should build.
```

## Using Subagents

For API research, launch a researcher subagent:

```
Use the api-researcher agent to investigate [specific API/library] —
check version compatibility, method signatures, and known gotchas.
```

Don't duplicate the subagent's work. Let it research, then read its findings.
