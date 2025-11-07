---
name: writing-documentation
description: Write clear, effective technical documentation following industry-proven patterns from exemplary projects and authoritative style guides, with built-in countermeasures for common LLM documentation issues
---

# Writing Documentation Skill

## Documentation Types (Diátaxis Framework)

- **Tutorial** - Learning-oriented, step-by-step
- **How-to** - Task-oriented, specific problems
- **Reference** - Technical specifications
- **Explanation** - Clarifies concepts

Details in `references/best-practices.md`.

## Writing for Claude Code

**CRITICAL**: When writing documentation that Claude reads (SKILL.md, CLAUDE.md, commands, agents):

### 1. Test Claude's Base Knowledge First

Verify what Claude already knows:

```bash
# Use haiku for cost-effective testing (gives same quality answers as sonnet)
claude --print --model haiku "Do NOT use any skills. How would you [perform task]?"
claude --print --model haiku "Do NOT use any skills. When should you [make decision]?"
```

### 2. Document ONLY Unique Patterns

Include only what Claude wouldn't naturally do:

- ✓ Opinionated architectural choices
- ✓ Counter-intuitive decisions
- ✓ Project-specific conventions
- ✓ Non-default patterns

Remove redundant content:
- ✗ Standard library usage
- ✗ Common best practices
- ✗ Well-known patterns
- ✗ Basic language features

### 3. Example: React Skill Reduction

Testing revealed Claude knows TanStack Query/Zustand/RTL patterns but doesn't default to:
- "Test stores, not components" (counter-cultural)
- "NO useState for complex logic" (prescriptive)
- "Inline actions unless repeated 2+" (specific rule)

Result: 328→125 lines (-62%) by documenting only unique opinions.

## Verifying Technical Accuracy

### API Verification Workflow

When documenting unfamiliar APIs or libraries:

**1. Launch researcher agent:**

```
Use Task tool to launch researcher agent to verify [API/library] documentation
```

Researcher agent uses Context7 MCP to fetch official API docs and verify method signatures.

**2. Read the codebase:**

For internal/project APIs:

```
Read relevant source files to verify method signatures exist
```

**3. State version requirements:**
- Specify versions when certain: `# Using pandas 2.0+ DataFrame.merge()`
- Add verification note when uncertain: `# Verify this API exists in your version`

**4. Direct to official docs:**
Add link to authoritative source.

### Security Verification

**Required checks before documenting code:**

1. **SQL**: Parameterized queries, never string concatenation
2. **YAML**: `yaml.safe_load()`, never `yaml.load()`
3. **Credentials**: Environment variables, never hard-coded
4. **Input**: Always validate before processing
5. **Errors**: Handle network/file operations

Use researcher agent if uncertain about security best practices.

## Code Example Requirements

### Every Example Must Include

1. **All imports and dependencies**
2. **Complete, copy-paste ready code** (no ellipsis or pseudo-code)
3. **Expected output** when relevant
4. **Error handling** for production use
5. **Context explaining "why"**

Example:

```python
# Process in batches of 1000 to avoid memory exhaustion.
# Testing: smaller (100) = 3x overhead, larger (10000) = OOM on 8GB systems.
BATCH_SIZE = 1000

for batch in chunks(items, BATCH_SIZE):
    process_batch(batch)
```

### Production-Ready Requirements

Include when relevant:
- Authentication/authorization
- Logging for debugging
- Rate limiting and retries
- Timeout handling
- Resource cleanup

See `references/best-practices.md` for complete production-ready examples.

## Using docs-reviewer Agent

After writing documentation:

```
Use docs-reviewer agent to ruthlessly simplify
```

The agent challenges every element's necessity, asking "Would the documentation still be clear without this?"

**Critical for**:
- CLAUDE.md, SKILL.md files
- Slash commands and agents
- Any Claude Code documentation

Eliminates:
- Motivational language
- Redundant examples
- Unnecessary context that doesn't change behavior

## LLM Self-Checklist

Before publishing:

**Verification:**
- [ ] Verified APIs exist (researcher agent, codebase read, or official docs)
- [ ] Code is complete and secure (all imports, parameterized queries, error handling)
- [ ] Examples are production-ready (auth, logging, retries, timeouts)

**Content Quality:**
- [ ] Context and "why" explained, not just "what"
- [ ] Specific details, not generic (40ms not "significant", name technologies not "various aspects")
- [ ] Consistent terminology throughout
- [ ] Appropriate hedging (direct for facts, hedge only when uncertain)

**Claude Code Docs:**
- [ ] Tested base knowledge with `claude --print`
- [ ] Documented only unique patterns
- [ ] Applied docs-reviewer agent for ruthless simplification

## References

Research foundation in `references/`:
- `exemplary-projects.md` - Analysis of well-documented projects
- `best-practices.md` - Authoritative style guide synthesis
- `llm-pitfalls.md` - LLM-specific quality issues
