---
description: Continue or expand work on existing specification with new requirements
argument-hint: [what to add/change/continue]
allowed-tools: Bash(bash:*)
---

# Iterate on Existing Specification

Use the Skill tool to load the `spec-architect` skill and execute the **ITERATE workflow** to continue work on an existing specification.

## Context

- Most recent spec: !`bash ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/scripts/get-latest-spec.sh specs`

## Arguments

- `ITERATION_BRIEF`: $ARGUMENTS (what to add, change, or continue - e.g., "Add PDF export", "Continue implementing auth tasks", "Refactor error handling")

## Instructions

1. **Determine which spec to use**:
   - By default, use the most recent spec from Context
   - If the user's `ITERATION_BRIEF` mentions a specific spec (e.g., "add PDF export to specs/002-dashboard"), use that spec instead
   - Pay attention to phrases like "in spec 002", "for the authentication feature", or explicit spec directory references

2. **Load the spec-architect skill** using the Skill tool:

   ```
   Skill({ command: "spec-architect" })
   ```

3. **Follow the ITERATE Workflow** described in the loaded skill

4. **Use the `ITERATION_BRIEF` to understand what the user wants**:
   - Continue incomplete implementation
   - Add new features to existing spec
   - Refine technical approach
   - Fix issues or refactor

5. **The workflow will automatically**:
   - Load `feature.md`, `tech.md`, and `notes.md` from the spec directory
   - Assess what's been completed (checkboxes in `tech.md`)
   - Determine appropriate phase based on the `ITERATION_BRIEF`:
     - **Continue incomplete implementation** → Jump to Implementation Phase
     - **Expand specification with new features** → Jump to Specification Phase
     - **Refine technical approach** → Jump to Technical Design Phase

## Workflow Summary

You will:

1. **Load and Assess** - Read existing spec files and determine current state
2. **Understand Intent** - Use the `ITERATION_BRIEF` to understand what the user wants
3. **Execute Appropriate Phase** - Jump to the right workflow phase

## Use Cases

This command is for:

- ✅ Continuing implementation of incomplete tasks: `/iterate Continue building the authentication feature`
- ✅ Adding new features: `/iterate Add PDF export in addition to CSV`
- ✅ Refining technical design: `/iterate Refactor error handling to use discriminated unions`
- ✅ Resuming after a break: `/iterate` (with no arguments, continues most recent spec)
- ✅ Working on specific spec: `/iterate Add email notifications to specs/002-dashboard/`

## Important Notes

- **Default behavior**: Works on the most recent spec unless user specifies otherwise
- **No arguments**: Simply continue the most recent spec where it left off
- **With arguments**: Use the brief to understand what to do next
- **Specific spec**: If user mentions a spec directory or number, use that instead of most recent
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
