# Skill Authoring

Use this reference when creating or revising a skill.

## Progressive Disclosure

Design skills in three layers:

1. Front matter: enough to trigger the skill correctly
2. `SKILL.md` body: the core workflow and decision points
3. `references/`, `scripts/`, and `assets/`: details loaded only when needed

Default structure:

- front matter says what the skill does and when to use it
- main body says how to execute the workflow
- references hold examples, schemas, edge cases, and deep explanation

For this repo:

- keep the main `SKILL.md` short
- keep opinionated project conventions in the main `SKILL.md`
- move bulky examples and research synthesis into `references/`

## Front Matter

Start with the Guide for the exact supported fields in Claude Code.

Practical rules:

- keep it minimal
- write a precise `description`
- include trigger phrases users would naturally say
- mention relevant file types or surfaces when useful
- avoid XML in front matter

Description formula:

`[What it does] + [When to use it] + [important trigger phrases]`

Example:

```yaml
---
description: |
  Refactors Claude Code hook configs and scripts into simpler,
  repo-approved patterns. Use when editing hooks.json, hook scripts,
  or Claude Code hook setup.
disable-model-invocation: true
---
```

## Main Body Structure

Recommended order:

1. What to consult first
2. The core workflow
3. Decision rules
4. Reference map
5. Examples only if they materially change behaviour

Keep the main body biased toward action, not explanation.

## Instructions

Write instructions that are:

- specific
- sequential when order matters
- explicit about non-goals
- clear about completion criteria

Good:

```text
1. Read the existing hook config and script.
2. Keep inline hooks inline only if they stay under the repo's simplicity threshold.
3. Move longer logic into an executable bun script in hooks/.
4. Preserve existing behaviour unless the user asked to change it.
```

## Examples

Use examples when they lock in:

- output format
- naming
- scope boundaries
- common edge cases

Do not add examples that just restate obvious instructions.

## Troubleshooting

If a skill is misbehaving, check:

- the description is specific enough to trigger correctly
- the main file is not overloaded with detail
- the references are easy to discover
- the skill does not overlap too broadly with another skill

## Testing a Skill

Before expanding a skill, test whether Claude already knows the behaviour.

Useful pattern from this repo:

```bash
claude --print --model haiku "Do NOT use any skills. How would you [perform task]?"
```

Document only what Claude does not already do reliably:

- repo-specific conventions
- counter-intuitive defaults
- strong opinions
- repetitive workflows that benefit from structure

## Keep It Small

Practical limits:

- keep `SKILL.md` comfortably below 5k words
- prefer one focused reference per topic
- open the smallest relevant reference file instead of everything

## When to Use Scripts

If correct behaviour depends on deterministic validation, prefer a script over prose instructions.

Examples:

- format validation
- schema checks
- file classification
- safety checks before tool use
