# [Feature Name] - Implementation Guide

User Sign off: [REQUIRED - DO NOT BUILD WITHOUT THIS]

## Implementation Context

### What We're Building

[1-2 sentence summary linking to feature.md requirements]

### Why This Approach

[High-level rationale for technical direction taken]

## Discovery Findings

### Similar Implementations

[Reference existing features that solve similar problems - use Explore agent findings]

**Pattern: [Pattern Name]**
- Implementation: `relative-to-cwd/path/to/existing.ext:startLine:endLine`
- Follow this pattern for: [what aspects]
- Note: [Key observations about the pattern]

**Pattern: [Another Pattern]**
- Example: `relative-to-cwd/path/to/another.ext:line:col`
- Key learning: [What to replicate or avoid]

### Key Integration Points

[Where this feature connects to existing code - from Explore agent discoveries]

- **[System/Service]**: Uses `ServiceName` from `relative-to-cwd/path/to/service.ext:line:col`
  - Purpose: [Why we integrate here]
- **[Another Integration]**: Add to `relative-to-cwd/path/to/file.ext:line:col`
  - Purpose: [Why we integrate here]

### Constraints & Gotchas

[Technical constraints, edge cases, and discoveries from exploration]

- [Constraint or gotcha discovered]
- [Performance limitation or consideration]
- [Security requirement or compliance need]

## Technology Decisions

### [Decision Area]

**Options Considered:**
- **Option A**: [Brief description]
  - Pros: [Key benefits]
  - Cons: [Key drawbacks]
- **Option B**: [Brief description]
  - Pros: [Key benefits]
  - Cons: [Key drawbacks]

**Selected: Option [X]**
- Rationale: [Why this choice best serves requirements]
- Documentation: [Link to official docs if helpful]
- Example usage: `relative-to-cwd/path/to/similar-usage.ext:line:col`

## File Map

### Files to Create

- `relative-to-cwd/path/to/new/file.ext:1:1` - [Component purpose and responsibility]
- `relative-to-cwd/path/to/another/new.ext:1:1` - [Component purpose]

### Files to Modify

- `relative-to-cwd/path/to/existing.ext:line:col` - [What needs to change and why]
- `relative-to-cwd/path/to/another.ext:line:col` - [What needs to change]

### Files to Reference

[Files that provide patterns, types, or examples to follow]

- `relative-to-cwd/path/to/pattern.ext` - [What pattern/approach to follow]
- `relative-to-cwd/path/to/types.ext` - [Type patterns to replicate]

## Component Architecture

### Component: [Component Name]

**Responsibility**: [What this component does - high level, not implementation details]

**Interfaces With:**
- Uses: `relative-to-cwd/path/to/dependency.ext:line:col` - [Why and how it's used]
- Provides: [What other components will consume from this]

**Key Constraints:**
- [Performance requirements from NFRs]
- [Security requirements from NFRs]
- [Other constraints discovered during planning]

**Testing Approach:**
- Follow pattern: `relative-to-cwd/path/to/similar/test.ext:line:col`
- Use: [Testing tools/skills - playwright-skill, API helpers, etc.]
- Focus: [What aspects are critical to test]

### Component: [Another Component]

[Repeat structure above for each major component]

## Implementation Tasks

### Component: [Component Name]

Location: `relative-to-cwd/path/to/component/directory`

- [ ] **COMP-1**: [Task description] (delivers FR-X, NFR-Y) [TESTABLE]
  - Create: `relative-to-cwd/path/to/new/file.ext:1:1`
  - Reference pattern: `relative-to-cwd/path/to/existing/similar.ext:line:col`
  - Integration: Uses [ServiceName] from `relative-to-cwd/path/to/service.ext:line:col`

- [ ] **COMP-2**: [Task description] (delivers FR-X) [TESTABLE]
  - Modify: `relative-to-cwd/path/to/existing/file.ext:line:col`
  - Follow pattern from COMP-1
  - Dependencies: COMP-1 must be complete

### Component: [Another Component] [TEST AFTER COMPONENT]

Location: `relative-to-cwd/to/another/component`

- [ ] **AUTH-1**: [Task description] (delivers FR-1, NFR-3)
  - Create: `relative-to-cwd/to/auth/service.ts:1:1`
  - Reference: `relative-to-cwd/to/existing/auth-pattern.ts:23:67`

- [ ] **AUTH-2**: [Task description] (delivers FR-2)
  - Update: `relative-to-cwd/to/session/manager.ts:45:12`
  - Dependencies: AUTH-1 must be complete before AUTH-2

Note: Test AUTH-1 and AUTH-2 together after both are implemented

## Testing Guidance

### Testing Setup

[Reference to Testing Setup section in feature.md - spec-tester will use this]

See feature.md "Testing Setup" section for system startup, environment requirements, test data, access points, and cleanup procedures.

### Testing Patterns to Follow

**Unit tests:**
- Pattern: `relative-to-cwd/path/to/unit.test.ext:line:col`
- Focus: [What to test at unit level]

**Integration tests:**
- Pattern: `relative-to-cwd/path/to/integration.test.ext:line:col`
- Focus: [What to test at integration level]

**E2E tests:**
- Tools: [playwright-skill / API helpers / etc.]
- Pattern: `relative-to-cwd/path/to/e2e.test.ext:line:col`

### Testing Tools Available

[List testing tools, scripts, or helpers available for this feature]

- Jest/Vitest for unit and integration tests
- playwright-skill for UI testing (spec-tester can load this)
- API test helpers: `scripts/test-api.sh`
- [Other tools discovered during exploration]

## Implementation Notes

### Discovered During Planning

[Technical discoveries, constraints, gotchas from Explore/researcher agents]

- [Finding from exploration that affects implementation]
- [Constraint discovered that wasn't obvious initially]
- [Best practice from similar implementations]

### Migration Strategy

[If this involves breaking changes to PUBLIC APIs]

- [How existing consumers will be supported]
- [Deprecation timeline if applicable]
- [Communication plan for breaking changes]

Note: Internal APIs can be refactored freely without migration strategy.

### Performance Considerations

[Specific NFRs and validation approach]

- NFR-X requires: [Specific performance target]
- Validate with: [How to measure/verify]

### Security Considerations

[Authentication, authorization, data protection, compliance]

- [Specific security requirements from NFRs]
- [Compliance requirements if applicable]
- [Security patterns to follow from similar features]

## References

### Codebase Documentation

[Links to relevant documentation within the repository]

- [Internal docs about patterns/architecture]
- [ADRs (Architecture Decision Records) if applicable]

### External Documentation

[Links to API docs, library docs, frameworks]

- [Library/framework documentation]
- [API documentation for external services]

### Related Specifications

[Links to related feature.md files in specs/]

- `specs/XXX-related-feature/feature.md` - [How it relates]

## Technical Debt Considerations

[Known compromises and future refactoring needs identified during planning]

- [Known shortcut or compromise with rationale]
- [Future improvement opportunity]

## Dependencies and Prerequisites

[External services, libraries, infrastructure requirements]

- [External service dependencies]
- [Library/framework versions required]
- [Infrastructure or environment requirements]

## Regressions or Missed Requirements

None found

<!-- Section for documenting missed requirements discovered during implementation and their resolution, with the intention being to prevent future mistakes -->
