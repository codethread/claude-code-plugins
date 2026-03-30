# PRD Schema

## Output: prd.md

```markdown
# PRD: [Feature Name]

## Overview
One paragraph describing what this feature does and why it matters.

## Goals
- Goal 1
- Goal 2

## Research Summary
_Optional. Include if research phase was run._

Key findings from `research.md` that influence design decisions.
Reference learning test results where relevant.

## Prototype Learnings
_Optional. Include if prototyping was done._

What was tried, what worked, what was discarded, and why.

## User Stories

### US-001: [Title]
**As a** [who], **I want** [what], **so that** [why].

**Acceptance criteria:**
- [ ] Criterion 1 (specific, verifiable)
- [ ] Criterion 2
- [ ] Typecheck passes

### US-002: [Title]
...

## Non-Goals
Explicitly state what this feature is NOT. Prevents scope creep during Build.

- Not doing X because Y
- Out of scope: Z

## Technical Considerations
Architecture decisions, constraints, dependencies, migration needs.

## QA Criteria

### Agent-Verifiable
Checks an agent can run autonomously:
- [ ] All tests pass
- [ ] Typecheck clean
- [ ] Lint clean
- [ ] [Feature-specific functional checks]

### Human-Verifiable
Checks requiring human judgement:
- [ ] UI looks correct on desktop/mobile
- [ ] Copy reads naturally
- [ ] Interaction feels responsive

## Success Metrics
How we know the feature is working after ship.

## Open Questions
_Must be empty before proceeding to How._
```

## Rules

- Every user story needs at least one acceptance criterion
- Acceptance criteria must be specific enough to verify (not "works correctly")
- Always include "Typecheck passes" as a criterion
- QA split is mandatory — forces thinking about what can and can't be automated
- Open questions section must be resolved before the PRD is approved
