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
