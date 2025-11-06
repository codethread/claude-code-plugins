---
description: Build a new feature using systematic spec-driven development workflow
argument-hint: [feature briefing or description]
allowed-tools: Bash(bash:*)
---

# Build Feature with Spec-Driven Development

Use the Skill tool to load the `spec-architect` skill and execute the **BUILD workflow** to create a new feature from exploration through implementation.

## Context

- Next available spec ID: !`bash ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/scripts/get-next-spec-id.sh specs`

## Arguments

- `FEATURE_BRIEF`: $ARGUMENTS

## Instructions

1. **Load the spec-architect skill** using the Skill tool:

   ```
   Skill({ command: "spec-architect" })
   ```

2. **Follow the BUILD Workflow** described in the loaded skill

3. **Use the `FEATURE_BRIEF` as your starting point** for the workflow

4. **Use the next available spec ID from Context** when creating the specification directory

5. **Execute all phases systematically**:
   - Phase 1: Exploration and Discovery
   - Phase 2: Specification Creation (use the spec ID from context)
   - Phase 3: Technical Design
   - Phase 4: Implementation Coordination
   - Phase 5: Quality Gates

## Workflow Summary

You will guide the user through:

1. **Exploration** - Understand the problem, discover existing patterns, research best practices
2. **Specification** - Create comprehensive feature specification with acceptance criteria
3. **Technical Design** - Break down implementation approach with numbered tasks
4. **Implementation** - Coordinate specialized agents to build the feature
5. **Quality Assurance** - Verify through code review and specification testing

## Important Notes

- This is for NEW features (no existing spec)
- The skill contains all the detailed guidance you need
- Follow the agent communication protocols defined in the skill
- Always use agent resumption to maintain context and reduce costs

## Quality Standards

Before marking complete, ensure:

- ✅ Code review passed (no blocking issues)
- ✅ All acceptance criteria verified by QA
- ✅ Code follows project conventions
- ✅ Type safety maximized
- ✅ Test quality maintained
- ✅ No duplicate patterns without justification

---

**Remember**: Your role as architect is to orchestrate specialized agents, not to write code directly. Trust the agents while maintaining oversight of the overall implementation.
