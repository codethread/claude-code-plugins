# Doc Writer Plugin

Write clear, effective technical documentation using industry-proven patterns while countering common LLM documentation issues.

## When to Use

Use this plugin when:
- Writing READMEs, API docs, tutorials, or guides
- Creating Claude Code documentation (SKILL.md, CLAUDE.md, commands, agents)
- You need to verify APIs before documenting
- You want ruthlessly simplified documentation

## Installation

```bash
/plugin install doc-writer@personal-configs-plugins
```

## What You Get

### Skill: `writing-documentation`

```bash
/skill writing-documentation
```

Provides:
- **API verification workflow** - Uses researcher agent and Context7 MCP to verify unfamiliar APIs
- **Claude Code documentation best practices** - Test base knowledge with `claude --print --model haiku` first, document only unique patterns
- **Security verification** - Concrete patterns (parameterized queries, safe YAML, env vars)
- **Production-ready code examples** - All imports, error handling, context explaining "why"

Based on research from React, Rust, Django, Vue, Stripe, Twilio, Slack, Vercel docs and authoritative style guides (Diátaxis, Google Developer Docs, Write the Docs, Microsoft Style Guide).

### Agent: `docs-reviewer`

Ruthlessly simplifies documentation by challenging every element's necessity.

Use after writing any documentation:
```
Use docs-reviewer agent to review this
```

Especially critical for CLAUDE.md, SKILL.md, slash commands, and agent files.

Eliminates:
- Motivational language
- Redundant examples
- Unnecessary context that doesn't change behavior
- Hedge words and filler

## Quick Example

```
/skill writing-documentation

I need to document this API endpoint for user authentication.
```

Claude will:
1. Use researcher agent to verify any unfamiliar APIs
2. Create complete, secure code examples with all imports
3. Include error handling and explain "why" decisions were made
4. State version requirements explicitly

For Claude Code docs, it will:
1. Test what Claude already knows with `claude --print --model haiku`
2. Document only unique/opinionated patterns
3. Apply docs-reviewer agent for ruthless simplification

## Research Foundation

See `skills/writing-documentation/references/` for detailed research:
- `exemplary-projects.md` - Analysis of well-documented projects
- `best-practices.md` - Authoritative style guide synthesis
- `llm-pitfalls.md` - LLM-specific quality issues and countermeasures

## Related Plugins

- **spec-dev** - Technical specifications and requirements
- **skill-creator** - Creating Claude Code skills
