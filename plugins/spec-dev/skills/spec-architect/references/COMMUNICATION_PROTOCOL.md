# Agent Communication Protocol for Claude Code Workflows

This protocol defines the communication standards for multi-agent workflows in Claude Code, optimized for resumable agent interactions.

## Protocol Goals

Resumable agents, clear boundaries, architect distributes PROJECT.md content.

## Agent Resumption Protocol

**IMPORTANT: Agent resumption is limited - each agent can only be resumed ONCE. Use strategically.**

### Resumption Limitations

Agents can be resumed only one time after their initial execution. This means:

- First execution: Agent does initial work
- First resumption: Agent can fix issues or continue work
- After that: Must spawn new agents for additional work

### Best Use Case for Resumption

Resume the developer agent after initial review/testing to fix issues. This is the most valuable use of the single resumption opportunity.

Typical flow:

1. Developer implements feature
2. Reviewer/tester finds issues
3. **Resume developer to fix** (using the one allowed resumption)
4. After that, spawn new agents if further work is needed

### Finding Previous Agent IDs

Use `cc-logs--extract-agents <session-id>` to get agent IDs from the current session when you need to resume.

Example:

```bash
# Get session ID (shown at session start)
# "Initialized agent context session: 9e3db88b-75cb-416b-a0a7-73e4bd0e5a2b"

cc-logs--extract-agents 9e3db88b-75cb-416b-a0a7-73e4bd0e5a2b

# Output shows agent IDs and details for resumption
```

Resume using the Task tool:

```
Task({
  resume: "<agent-id>",
  prompt: "Based on the code review feedback, please fix issues X, Y, and Z"
})
```

## File Reference Standard

All file references MUST use the vimgrep format:

```
/full/path/from/cwd/file.ext:line:column
```

Examples:

- `/path/to/project/src/auth.ts:45:12`
- `/path/to/project/config/settings.json:102:3`

When referencing ranges, use:

```
/path/to/file.ext:startLine:startCol-endLine:endCol
```

## Project Configuration

If `specs/PROJECT.md` exists, architect loads it once at workflow start and injects relevant sections into `Your_Responsibilities`:

- **General Instructions** → All agents
- **Architect Instructions** → Architect only (not passed to agents)
- **Developer Agent Instructions** → spec-developer
- **Reviewer Agent Instructions** → code-reviewer and spec-signoff
- **Tester Agent Instructions** → spec-tester

Agents never read PROJECT.md directly.

## Agent Briefing Protocol

When delegating to any agent, provide this structured context:

```yaml
Context:
  Workflow: [PLAN|BUILD|ITERATE]
  Phase: [exploration|specification|technical-design|implementation|code-review|testing]
  Role: "You are working on [phase] of [feature]"
  Workflow_Position: "Previous phase: [x] | Your phase: [y] | Next phase: [z]"

Inputs:
  Spec_Directory: specs/XXX-feature-name/
  Primary_Spec: specs/XXX-feature-name/feature.md
  Technical_Spec: specs/XXX-feature-name/tech.md # if exists
  Technical_Notes: specs/XXX-feature-name/notes.md # if exists
  Related_Docs:
    - /full/path/to/related.md

Relevant_Skills: # Suggested skills for this work (load as needed)
  - [skill-name] # Language: typescript, python, go, ruby, etc.
  - [skill-name] # Framework: react, vue, django, rails, etc.
  - [skill-name] # Testing: playwright-skill, pdf, xlsx, etc.
  # These are EXAMPLES - adapt to skills available in the current repository
  # Agents may load additional skills at their discretion beyond suggestions

Your_Responsibilities:
  - [Specific task 1]
  - [Specific task 2]
  - [
      Project-specific instructions from PROJECT.md if applicable,
      injected by architect,
    ]

NOT_Your_Responsibilities:
  - [Explicitly excluded task 1]
  - [Explicitly excluded task 2]

Deliverables:
  Format: [Description of expected output format]
  References: "Use pattern: file:line:col for all code references"
  Checklist_Items:
    [List specific items to complete, e.g., "AUTH-1, AUTH-2, AUTH-3"]
```

## Handover Requirements

### PLAN Workflow Outputs

**After Specification Creation (Phase 2)**:
- Complete feature specification with numbered requirements (FR-X, NFR-X)
- `interview.md` capturing user's original request and Q&A
- Technical notes (`notes.md`) if spike work was performed
- Clear success criteria for each requirement
- Testing setup instructions

**After Technical Design (Phase 3)**:
- Technical specification with numbered tasks (e.g., AUTH-1, COMP-1, API-1)
- Each task explicitly linked to feature requirements
- File paths for similar patterns and integration points (file:line:col references)
- Guidance on approach (not detailed implementation)
- Spec-signoff validation passed

### BUILD Workflow Inputs and Outputs

**Required Inputs**:
- Validated `feature.md` with FR-X and NFR-X requirements
- Validated `tech.md` with numbered implementation tasks

**During Implementation (Phase 1)**:
- Completed checklist items with file:line:col references to changes
- List of any deviations from technical specification
- Known limitations or incomplete items

**Code Review Deliverables**:
- Pattern consistency analysis (duplication check)
- Type safety review (discriminated unions vs optional fields)
- Test quality assessment
- Architectural consistency validation
- PASS/FAIL with specific file:line:col references for issues

**Testing Deliverables**:
- Status for each numbered requirement (FR-X, NFR-X)
- Status for each implementation task (e.g., AUTH-1, COMP-1, API-1)
- Specific file:line:col references for any issues found
- Clear PASS/FAIL status with evidence from user perspective

## Example Agent Invocation

```markdown
Context:
Workflow: BUILD
Phase: implementation
Role: "You are implementing the authentication service for a user management feature"
Workflow_Position: "Previous phase: technical-design | Your phase: implementation | Next phase: code-review"

Inputs:
Spec_Directory: specs/001-user-auth/
Primary_Spec: specs/001-user-auth/feature.md
Technical_Spec: specs/001-user-auth/tech.md
Technical_Notes: specs/001-user-auth/notes.md

Relevant_Skills:

- typescript # Example: Project uses TypeScript
- react # Example: Building React components

# Check available skills in repository and load as needed

Your_Responsibilities:

- Implement tasks AUTH-1, AUTH-2, and AUTH-3 from the technical spec
- Ensure all code follows project conventions in CLAUDE.md
- Create unit tests for each component
- PROJECT REQUIREMENTS (from specs/PROJECT.md):
  - Always run tests after completing work: `yarn test <files-changed>`
  - Use the project's logger (don't use console.log): `import { logger } from '@/lib/logger'`
  - All error messages should be actionable and include next steps

NOT_Your_Responsibilities:

- Do not implement tasks AUTH-4 through AUTH-6 (assigned to parallel stream)
- Do not modify database schema (completed in previous sprint)
- Do not deploy or configure production environment

Deliverables:
Format: Working code with all specified tasks completed
References: "Use pattern: /full/path/file.ts:line:col for all code references"
Checklist_Items: "Complete and mark done: AUTH-1, AUTH-2, AUTH-3"
```

## Validation Rules

1. **Never use relative paths** - Always use full paths from project root
2. **Always include line numbers** - Even for new files (use :1:1)
3. **Reference specific items** - Use requirement IDs (FR-1) not descriptions
4. **Maintain checklist state** - Mark items complete immediately upon finishing
5. **Document deviations** - Any variance from spec must be explicitly noted with rationale

## Protocol Versioning

Protocol Version: 2.0.0
Last Updated: 2025-01-19
Compatibility: Claude Code with resumable agents (Task tool with `resume` parameter)

Changes to this protocol require updating all prime-\* commands that reference it.

### Version History

- **2.0.0** (2025-01-19): Added agent resumption protocol, folder-based spec structure
- **1.0.0** (2025-01-19): Initial protocol for multi-agent workflows
