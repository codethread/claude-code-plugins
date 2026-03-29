# Subagent Design

Use this reference when writing Claude Code subagents or deciding whether one is warranted.

## What Subagents Actually Get

Subagents run in isolated contexts.

They do not inherit:

- the main conversation history
- project `CLAUDE.md` by default
- sibling agent context
- the parent agent's already-loaded assumptions unless you restate or preload them

They do get:

- their own system prompt
- their own tool permissions
- any configured skills
- the task you delegate
- a fresh context window

They return:

- a summary back to the parent conversation, not their full internal transcript

Constraint:

- subagents cannot spawn nested subagents

Implication:

- preload important context with `skills`
- put critical constraints in the agent itself
- do not assume the parent agent's context will carry over

## Description Drives Delegation

The `description` field is the main trigger for delegation.

Good descriptions:

- name the job clearly
- include phrases users actually say
- say when to use the agent
- reduce overlap with other agents

Bad:

```text
A code agent
```

Better:

```text
Reviews changed code for regression risk, security issues, and missing verification. Use immediately after writing or modifying code.
```

## Write Function-First Prompts

Prefer job-focused instructions over seniority theatre.

Bad:

```text
You are a world-class senior staff engineer...
```

Better structure:

- purpose
- optimise for
- workflow
- rules / non-goals
- output
- definition of done

## Recommended Agent Body Shape

Pattern:

```markdown
## Purpose

What the agent exists to do.

## Optimise for

- the primary success criteria

## When invoked

1. ordered workflow

## Rules

- scope boundaries

## Output

- exact response shape

## Definition of done

- behavioural completion criteria
```

## Tools

Use least privilege.

Guidance:

- reviewers and researchers should usually be read-only
- only grant edit or write tools when the agent is expected to change files
- keep shell access tight if the agent only needs a narrow command set

## Tool Awareness in the Prompt Body

If an agent file restricts tools in front matter, repeat the concrete tool inventory in the first line of the system prompt.

Why:

- agents may not reliably reason from their own front matter
- without the explicit line, they can hallucinate tool calls based on training priors

Pattern:

```text
You have access to exactly these tools: Glob, Grep, Read. No others exist.
```

Rules:

- list the exact tool names, not categories
- say that no other tools exist
- put this before any other instruction
- update the line whenever the tool list changes
- use the actual tool names from the target agent format, whatever front matter key that format uses

## Skills

Use the `skills` field when the agent needs reusable domain context.

This is especially important because subagents do not inherit the parent's loaded skill context.

## Model, Effort, and Turns

Prefer the smallest capable setup:

- Sonnet for most focused code tasks
- Opus for ambiguous, long, or research-heavy tasks
- moderate `effort` for routine work
- higher `effort` only when reasoning depth clearly matters

## Parallelisation

Good candidates:

- independent investigations
- non-overlapping file ownership
- separate modules with no ordering dependency

Bad candidates:

- two agents editing the same file
- tasks where one result determines the next step
- work that needs user confirmation between phases

Decide foreground vs background based on dependency:

- foreground when the parent is blocked on the answer
- background when the work can run independently while other progress continues

## Common Failure Modes

- vague descriptions that never trigger
- overly broad descriptions that trigger constantly
- agent prompts that duplicate general coding advice instead of task-specific guidance
- missing non-goals, causing refactors and scope creep
- granting too many tools
- using subagents for work that a quick local read or grep could resolve faster

## Practical Rule

Spawn a subagent only when context isolation, permission scoping, or parallelism gives a real benefit.

If a local grep and two file reads will answer the question, do that instead.
