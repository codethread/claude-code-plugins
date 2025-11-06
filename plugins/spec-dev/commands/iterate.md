---
description: Continue work on an existing specification or expand it with new features
argument-hint: [specs/<spec-dir>]
allowed-tools: Bash(bash:*)
---

# Iterate on Existing Specification

Use the Skill tool to load the `spec-architect` skill and execute the **ITERATE workflow** to continue work on an existing specification.

## Context

- Most recent spec: !`bash ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/scripts/get-latest-spec.sh specs`

## Arguments

- `SPEC`: $ARGUMENTS (path to spec directory, e.g., `003-feature-B`, `003`, `feature-B`, `last`, `recent` may all refer to `specs/003-feature-B/*` assuming no other specs with higher number)

## Instructions

1. **Determine which spec to use**:
   - If `SPEC` is provided (not empty), use that spec
   - Otherwise, use the most recent spec from Context

2. **Load the spec-architect skill** using the Skill tool:

   ```
   Skill({ command: "spec-architect" })
   ```

3. **Follow the ITERATE Workflow** described in the loaded skill

4. **Use the determined spec directory** to load existing specification files

5. **The workflow will automatically**:
   - Load `feature.md`, `tech.md`, and `notes.md` from the spec directory
   - Assess what's been completed (checkboxes in `tech.md`)
   - Determine next action:
     - **Continue incomplete implementation** → Jump to Implementation Phase
     - **Expand specification with new features** → Jump to Specification Phase
     - **Refine technical approach** → Jump to Technical Design Phase

## Workflow Summary

You will:

1. **Load and Assess** - Read existing spec files and determine current state
2. **Execute Appropriate Phase** - Jump to the right workflow phase based on what's needed

## Use Cases

This command is for:

- ✅ Continuing implementation of incomplete tasks
- ✅ Adding new features to an existing specification
- ✅ Refining technical design after discovering new requirements
- ✅ Resuming work after a break or context switch
- ✅ Growing a specification incrementally

## Important Notes

- This is for EXISTING specs (spec directory already exists)
- The skill contains all the detailed guidance you need
- Follow the agent communication protocols defined in the skill
- Always use agent resumption to maintain context and reduce costs

## Quality Standards

Before marking any work complete, ensure:

- ✅ Code review passed (no blocking issues)
- ✅ All acceptance criteria verified by QA
- ✅ Code follows project conventions
- ✅ Type safety maximized
- ✅ Test quality maintained
- ✅ No duplicate patterns without justification
- ✅ Checkboxes in `tech.md` are updated as tasks complete

---

**Remember**: Your role as architect is to orchestrate specialized agents, not to write code directly. Trust the agents while maintaining oversight of the overall implementation.
