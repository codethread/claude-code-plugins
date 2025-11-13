# PLAN Workflow - Feature Specification and Design

Use this workflow to create specifications for a new feature from a user briefing.

**Outcome**: Complete, reviewed specifications (`feature.md` and `tech.md`) ready for implementation.

## Phase 1: Exploration and Discovery

**Objective**: Understand the problem space before proposing solutions

**FIRST STEP: Load Project Configuration**

Check if `specs/PROJECT.md` exists. If it does:

1. Read the entire file
2. Check the version metadata at the bottom:
   - Extract `template_version` and compare with current PROJECT_TEMPLATE.md version
   - If PROJECT_TEMPLATE.md has a newer version, offer to show the user what's new:
     "Your PROJECT.md was created from template version X.X.X, but version Y.Y.Y is now available. Would you like me to show you the changes so you can decide if you want to adopt any new features?"
   - If user wants to see changes, read PROJECT_TEMPLATE.md and explain the differences
3. Extract the "General Instructions" and "Architect Instructions" sections for your own use
4. Keep the agent-specific sections (Developer, Reviewer, Tester) ready to inject into agent briefings later

**Actions**:

1. **Problem Understanding**:
   - What specific problem are we solving?
   - Who are the users and their pain points?
   - What does success look like?
   - What are edge cases and failure modes?
   - What is the migration strategy for PUBLIC API breaking changes?

2. **Technical Discovery**:
   - Use **Explore agent** to find similar implementations in the codebase
   - Use **researcher agent** to investigate industry best practices
   - Resume agents as needed for follow-up research

3. **Spike Work** (Small POCs):
   - Create minimal proof-of-concepts to validate feasibility
   - Test critical assumptions about external dependencies
   - Verify API behaviors and integration points
   - Document findings in `notes.md`

**Outputs**: Understanding of problem domain, existing patterns, technical constraints

## Phase 2: Specification Creation

**Objective**: Document WHAT needs to be built with measurable acceptance criteria

**IMPORTANT**: This is DISCOVERY and SPECIFICATION only - no implementation yet. It is your responsibility to identify any breaking changes to PUBLIC APIs and ask for clarification on migration strategy unless explicitly stated. Internal APIs can be refactored freely.

**Actions**:

1. **Create Spec Directory**:
   - The next spec ID is provided in the command Context
   - Create `specs/<id>-<feature>/` directory
   - Create `feature.md` from `references/SPEC_TEMPLATE.md`

2. **Create `interview.md` in spec directory**:
   - Document the user's original prompt verbatim in "Original Brief" section
   - Record ALL Q&A exchanges, clarifications, and decisions
   - Format:

     ```markdown
     # Feature Interview

     ## Original Brief

     [User's exact prompt]

     ## Discovery Q&A

     ### Q: [Question]

     A: [Answer]

     ## Key Decisions

     - [Decision with rationale]
     ```

3. **Document Requirements**:
   - Problem statement and value proposition
   - Functional requirements (FR-1, FR-2, ...) with testable ACs
   - Non-functional requirements (NFR-1, NFR-2, ...)
   - Interface definitions and data models
   - **Testing Setup** - CRITICAL: Document how to start systems, environment setup, test data, access points, and cleanup
     - This enables the spec-tester agent to successfully verify the feature
     - Include exact bash commands to start servers, clients, databases, etc.
     - Specify URLs, ports, credentials for accessing the system
     - Note any testing tools available (playwright-skill, API scripts, etc.)
   - Clear acceptance criteria for each requirement
   - External dependency validation (pre-flight checks)
   - Follow PROJECT.md guidelines if loaded earlier

4. **User Review and Approval**:
   - Present draft specification for review
   - Highlight assumptions and technical discoveries
   - Ask structured review questions:
     - "Does this capture your intended user workflow?"
     - "Are these acceptance criteria measurable enough?"
     - "Have I missed any critical edge cases?"
     - "Is the migration strategy appropriate for PUBLIC API changes?"
   - Iterate based on feedback
   - Get explicit user approval

5. **Final Architectural Review**:
   - Think deeply about edge cases
   - Identify implicit assumptions
   - Verify specification completeness

**Outputs**:

- `specs/<id>-<feature>/feature.md` with numbered requirements
- `specs/<id>-<feature>/interview.md` with user's original prompt and Q&A
- `specs/<id>-<feature>/notes.md` if spike work was performed

## Phase 3: Technical Design

**Objective**: Document HOW to build what was specified

**IMPORTANT**: This is TECHNICAL DESIGN - defining implementation approach but not building yet. Tasks must be broken down to enable tight build-test cycles during implementation.

**Actions**:

1. **Load Context**:
   - Read `feature.md` and `notes.md` from spec directory
   - Review related specifications and technical docs
   - Use **Explore agent** to analyze existing system patterns
   - Use **researcher agent** for technology stack research

2. **Architecture Review**:
   - Component breakdown and responsibilities
   - Service boundaries and interfaces
   - Data flow and state management
   - Integration patterns and protocols

3. **Technology Stack Decisions**:
   - Use researcher for framework comparisons
   - Use Explore for existing patterns analysis
   - Document rationale for all technology choices

4. **Implementation Strategy**:
   - Development sequence and dependencies
   - Migration strategy (backwards compatibility vs in-place updates)
   - Testing strategy (unit, integration, e2e)

5. **Create Technical Specification**:
   - Use `references/TECH_SPEC_TEMPLATE.md` as starting point
   - Create `tech.md` in spec directory

   **CRITICAL: Focus on GUIDANCE, not IMPLEMENTATION**

   The tech spec should be a MAP that enables the developer to implement effectively, NOT a BLUEPRINT that prescribes exact implementation.

   **Think:**
   - "Where should they look?" (file references to similar code)
   - "What patterns should they follow?" (existing implementations)
   - "What decisions have been made?" (technology choices with rationale)
   - "What constraints exist?" (NFRs, gotchas discovered)

   **Don't:**
   - Write exact function signatures
   - Design complete API schemas with all fields
   - Specify detailed algorithms or step-by-step logic
   - Write pseudo-code implementations

   **Use discoveries from Explore/researcher agents:**
   - Document similar implementations found (file:line:col references)
   - Reference existing patterns to follow
   - Note integration points discovered
   - Capture gotchas and constraints learned

   **Quality check:**
   If a developer could copy-paste from tech.md to create the implementation, you've over-specified.
   The developer should still need to make design decisions, just informed ones.
   - Structure tasks for testability:

**CRITICAL: Task Decomposition for Testability**

When creating the `tech.md`, structure tasks to enable tight build-test cycles:

**Pattern A: Task-Level Testing (Preferred)**

```markdown
### Component: User Validation

- [ ] **VAL-1**: Create email validation function (delivers FR-1) [TESTABLE]
- [ ] **VAL-2**: Add password strength checker (delivers FR-2) [TESTABLE]
- [ ] **VAL-3**: Create validation error messages (delivers NFR-1) [TESTABLE]
```

**Pattern B: Component-Level Testing (When Tasks are Interdependent)**

```markdown
### Component: OAuth Integration [TEST AFTER COMPONENT]

- [ ] **OAUTH-1**: Setup OAuth client configuration (delivers FR-3)
- [ ] **OAUTH-2**: Implement token exchange (delivers FR-3)
- [ ] **OAUTH-3**: Add refresh token logic (delivers FR-3)
      Note: These tasks are interdependent. QA should test after all three are complete.
```

**Task Sizing Guidelines**:

- Task completable in 1-2 hours
- Clear deliverable (function, endpoint, component)
- If larger, break down further
- Each task references FR-X or NFR-X it delivers

**Avoid These Anti-Patterns**:

- ❌ "Implement entire authentication system" (too large)
- ❌ "Add a comment" (too trivial)
- ❌ Tasks with no clear testable outcome
- ❌ Tasks requiring extensive mocking to test

6. **Technical Review and Refinement**:
   - Validate with user for technical feasibility
   - Discuss trade-offs and alternatives
   - Confirm resource availability
   - Get final technical approval

7. **Final Architectural Review**:
   - Ensure comprehensive coverage of `feature.md`
   - Verify work is broken down into manageable chunks
   - Identify concurrent work streams where appropriate

8. **Specification Review (Pre-Implementation Quality Gate)**:

Delegate to **spec-signoff agent**:

> "Review the specifications in specs/<id>-<feature>/ for design quality before implementation begins"

**If spec-signoff finds issues**:

- Address all gaps and ambiguities
- Re-review until specifications are complete
- Do NOT proceed to implementation with incomplete specs

This review ensures implementation can proceed smoothly without constant backtracking to clarify requirements.

**Outputs**: Validated `specs/<id>-<feature>/tech.md` with numbered implementation tasks, ready for BUILD workflow

## Next Step

Once specifications are complete and reviewed, proceed to `BUILD_WORKFLOW.md` for implementation.
