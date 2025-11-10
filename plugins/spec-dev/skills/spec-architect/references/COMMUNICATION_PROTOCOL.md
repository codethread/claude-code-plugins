# Agent Communication Protocol for Claude Code Workflows

This protocol defines the communication standards for multi-agent workflows in Claude Code, optimized for resumable agent interactions.

## Why This Protocol Exists

1. **Resumable Architecture**: Agents can be resumed to continue previous work, maintaining full context and enabling iterative refinement
2. **Context Preservation**: Resumed agents retain all prior knowledge, enabling efficient follow-up work without re-gathering information
3. **Precision Requirements**: Clear initial briefings enable focused work, while resumption allows for clarification and iteration
4. **Traceability**: Multiple agents working on interconnected tasks need clear reference points for coordination
5. **Boundary Definition**: Agents must understand both their responsibilities AND explicit non-responsibilities to prevent scope creep

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

## Specification Structure Requirements

### Feature Specification (SPEC)

Feature specifications MUST use numbered sections for reference:

```markdown
## Functional Requirements

### FR-1: User Authentication

The system SHALL provide email-based authentication

### FR-2: Session Management

The system SHALL maintain user sessions for 24 hours

## Non-Functional Requirements

### NFR-1: Performance

Authentication SHALL complete within 2 seconds

### NFR-2: Security

Passwords SHALL be hashed using bcrypt with minimum 10 rounds
```

### Technical Specification (TECH_SPEC)

Technical specifications MUST contain implementation checklists that reference feature requirements:

```markdown
## Implementation Tasks

### Component: Authentication Service

Location: `src/services/auth.ts`

- [ ] **AUTH-1**: Implement email validation (delivers FR-1)
  - Validates email format per RFC 5322
  - Returns error for invalid formats
  - File: Create at `src/validators/email.ts`

- [ ] **AUTH-2**: Implement password hashing (delivers NFR-2)
  - Uses bcrypt library with 12 rounds
  - Interfaces with: `src/lib/crypto.ts:15:1`

- [ ] **AUTH-3**: Create login endpoint (delivers FR-1, NFR-1)
  - POST /api/auth/login
  - Response time < 2000ms
  - Updates: `src/routes/auth.ts:28:1`
```

## Agent Briefing Protocol

When delegating to any agent, provide this structured context:

```yaml
Context:
  Phase: [specification|design|implementation|verification]
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
  - [skill-name]  # Language: typescript, python, go, ruby, etc.
  - [skill-name]  # Framework: react, vue, django, rails, etc.
  - [skill-name]  # Testing: playwright-skill, pdf, xlsx, etc.
  # These are EXAMPLES - adapt to skills available in the current repository
  # Agents may load additional skills at their discretion beyond suggestions

Your_Responsibilities:
  - [Specific task 1]
  - [Specific task 2]

NOT_Your_Responsibilities:
  - [Explicitly excluded task 1]
  - [Explicitly excluded task 2]

Deliverables:
  Format: [Description of expected output format]
  References: "Use pattern: file:line:col for all code references"
  Checklist_Items: [List specific items to complete, e.g., "AUTH-1, AUTH-2, AUTH-3"]
```

## Handover Requirements

### From Specification to Design

The specification phase MUST provide:

- Complete feature specification with numbered requirements (FR-X, NFR-X)
- Technical notes if spike work was performed
- Clear success criteria for each requirement

### From Design to Implementation

The design phase MUST provide:

- Technical specification with numbered tasks (COMPONENT-N)
- Each task explicitly linked to feature requirements
- File paths for all components to be created/modified
- Interface definitions with exact file:line:col references

### From Implementation to Verification

The implementation phase MUST provide:

- Completed checklist items with file:line:col references to changes
- List of any deviations from technical specification
- Known limitations or incomplete items

### Verification Reporting

The verification phase MUST provide:

- Status for each numbered requirement (FR-X, NFR-X)
- Status for each implementation task (COMPONENT-N)
- Specific file:line:col references for any issues found
- Clear PASS/FAIL status with evidence

## Example Agent Invocation

```markdown
Context:
Phase: implementation
Role: "You are implementing the authentication service for a user management feature"
Workflow_Position: "Previous phase: technical design | Your phase: implementation | Next phase: QA verification"

Inputs:
Spec_Directory: specs/001-user-auth/
Primary_Spec: specs/001-user-auth/feature.md
Technical_Spec: specs/001-user-auth/tech.md
Technical_Notes: specs/001-user-auth/notes.md
Related_Docs:
  - spec-templates/SPEC_PATTERNS.md

Relevant_Skills:
- typescript  # Example: Project uses TypeScript
- react       # Example: Building React components
# Check available skills in repository and load as needed

Your_Responsibilities:

- Implement tasks AUTH-1, AUTH-2, and AUTH-3 from the technical spec
- Ensure all code follows project conventions in CLAUDE.md
- Create unit tests for each component

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
