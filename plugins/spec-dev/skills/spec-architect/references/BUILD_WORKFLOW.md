# BUILD Workflow - Feature Implementation

Use this workflow to implement a feature from an existing, validated technical specification.

**Prerequisites**: Specifications must exist and be validated (see `PLAN_WORKFLOW.md`):
- `specs/<id>-<feature>/feature.md` with numbered FR-X and NFR-X requirements
- `specs/<id>-<feature>/tech.md` with numbered implementation tasks

## Phase 1: Implementation Coordination

**Objective**: Build the feature by coordinating specialized agents

**FIRST STEP: Load Project Configuration**

Check if `specs/PROJECT.md` exists. If it does:
1. Read the entire file
2. Extract the "General Instructions" and "Architect Instructions" sections for your own use
3. Keep the agent-specific sections ready to inject into briefings:
   - "Developer Agent Instructions" → inject into spec-developer briefings
   - "Reviewer Agent Instructions" → inject into code-reviewer briefings
   - "Tester Agent Instructions" → inject into spec-tester briefings

When briefing agents, inject PROJECT.md sections into `Your_Responsibilities` as defined in COMMUNICATION_PROTOCOL.

**CRITICAL RULE: Implement and verify ONE task at a time. Never batch tasks.**

**For each task in `tech.md`, follow this exact sequence**:

### Step 1: Select One Task

Open `tech.md` and choose a single uncompleted task. For example:
- [ ] **LINK-1**: Create get-project-dirs-to-link function (delivers FR-2)

This is your target. Work ONLY on this task until completely done.

### Step 2: Implement the Single Task

Delegate to **spec-developer agent** with explicit boundaries and skill suggestions:

> "Implement ONLY task LINK-1 from the tech spec. Do not implement LINK-2 or any other tasks. Focus solely on creating the get-project-dirs-to-link function that delivers FR-2."

Provide full context per `COMMUNICATION_PROTOCOL`, including:
- **Relevant_Skills**: Suggest appropriate skills based on the tech stack
  - Language skills: typescript, python, go, ruby, etc.
  - Framework skills: react, vue, django, rails, etc.
  - Check what skills are available in the current repository
- The agent will load these skills before implementing to ensure proper conventions

### Step 3: Code Review (Static Analysis)

**CRITICAL**: Before functional testing, perform static code analysis for quality and consistency.

Delegate to **code-reviewer agent** for STATIC analysis (code review WITHOUT running code) per `COMMUNICATION_PROTOCOL`.

Example briefing:
> "Review the implementation of task LINK-1 through STATIC code analysis. Check for:
> - Similar patterns in the codebase (are we duplicating existing solutions?)
> - Type safety (should we use discriminated unions instead of optional fields?)
> - Test quality (are tests clear, comprehensive, and maintainable?)
> - Architectural consistency (does this follow project conventions?)
> - PROJECT REQUIREMENTS: [inject Reviewer Agent Instructions here if PROJECT.md exists]
> Focus ONLY on code quality for LINK-1. Do NOT test functionality - that's spec-tester's job."

**If code-reviewer finds blocking issues**:
- Use `cc-logs--extract-agents <session-id>` to find developer agent ID
- Resume developer agent once to fix: `Task({ resume: "<dev-agent-id>", prompt: "Code review found issues: [specific issues]. Please fix these." })`
- If further issues remain after resumption, spawn a new developer agent (resumption only works once)
- Only proceed to QA once code review passes

**If the reviewer suggests improvements (non-blocking)**:
- Note them for future refactoring
- Proceed to QA testing

### Step 4: Specification Testing (Functional Verification)

Delegate to **spec-tester agent** for FUNCTIONAL testing from user perspective:

Provide full context per `COMMUNICATION_PROTOCOL`, including:
- **User Perspective**: Identify who the "user" is (web UI user, API consumer, module user)
- **Testing Setup**: Direct them to the "Testing Setup" section in `feature.md`
- **Relevant_Skills**: Suggest testing skills based on what's being tested:
  - Web UI → `playwright-skill` (if available)
  - REST APIs → curl or API testing tools
  - Documents → `pdf`, `xlsx`, `docx`, `pptx` skills
  - CLI tools → bash testing skills
- **What to verify**: Which FR-X/NFR-X requirements this task delivers

> "Verify task LINK-1 from the user's perspective as a web UI user.
>
> **Setup**: Follow the 'Testing Setup' section in feature.md to start the necessary systems.
>
> **Testing**: If playwright-skill is available, load it and test the actual feature in the browser. Does it work as specified in FR-2? Test happy path and error cases.
>
> **Cleanup**: Use the cleanup procedures from the Testing Setup section when done."

Check the `tech.md` for testing timing:

**If task is marked [TESTABLE]** or has no special marking:
- Test immediately after code review passes
- Test only this specific task

**If component is marked [TEST AFTER COMPONENT]**:
- Complete all tasks in that component first (with code review for each)
- Then test the entire component as a unit

**IMPORTANT**: Tester performs FUNCTIONAL verification (actually runs/uses the feature), NOT static code analysis.

### Step 5: Fix Any Issues

If QA finds problems:
- Use `cc-logs--extract-agents <session-id>` to find developer agent ID
- Resume developer agent once: `Task({ resume: "<dev-agent-id>", prompt: "QA testing found failures: [specific failures]. Please fix." })`
- Code review the fixes (spawn new reviewer agent - each agent only resumes once)
- Re-test with QA (spawn new tester agent)
- If more fixes needed after first resumption, spawn new developer agent
- Do not proceed until this task fully passes

### Step 6: Architect Review

Once code review and QA both pass, perform final architectural review:
- Check follows project conventions from CLAUDE.md
- Verify matches patterns established in `tech.md`
- Ensure integration points are correct
- Confirm implementation delivers what the task promised

### Step 7: Mark Task Complete in tech.md

**THIS IS MANDATORY**: Update the `tech.md` immediately:
- Use Edit tool to change checkbox from [ ] to [x]
- Example: `- [ ] **LINK-1**:` to `- [x] **LINK-1**:`
- This provides clear audit trail of progress
- Never proceed to next task without updating checkbox

### Step 8: Optional Commit

If this represents a logical checkpoint, create a commit. Otherwise, continue to next task.

### Step 9: Repeat for Next Task

Only NOW select the next task and repeat this entire process.

**ENFORCEMENT RULES**:
- If you find yourself saying "implement tasks LINK-1 through LINK-3", STOP. Implement only one at a time.
- Mandatory sequence: Implement → Code Review → Fix Review Issues → QA Test → Fix QA Issues → Architect Review → Mark Complete
- **Use `resume` strategically** - Each agent can only be resumed once, best used after initial review/testing to fix issues
- For [TESTABLE] tasks: Code review and test immediately. Do not proceed without both passing.
- For [TEST AFTER COMPONENT] groups: Complete all tasks (with code review for each), then QA test as unit
- **code-reviewer** is NEVER optional - it catches pattern duplication, type safety issues, and test problems before QA
- Always update `tech.md` checkbox after a task passes all gates
- The `tech.md` is your progress tracker - it should show exactly which tasks are done at any point

## Phase 2: Quality Gates

Before marking any feature complete:

- ✅ Code review passed (no blocking issues from code-reviewer)
- ✅ No duplicate patterns without justification
- ✅ Type safety maximized (discriminated unions over optional fields)
- ✅ Test quality maintained (no test regressions)
- ✅ All acceptance criteria verified by spec-tester
- ✅ Code follows project conventions (check CLAUDE.md)
- ✅ Error handling implemented and tested
- ✅ Performance requirements met
- ✅ Security considerations addressed
- ✅ Tests pass (if test suite exists)
- ✅ Linting/type checking passes

## Implementation Patterns

### Sequential Tasks (dependent)
```
Implementation → Code Review → QA Testing → Refinement
```

### Parallel Tasks (independent)
```
Auth Module (spec-developer) + Payment Module (spec-developer) → Integration Testing (qa)
```

### Iterative Refinement
```
Implement → Code Review → Fix → QA Test → Fix → Re-test → Complete
```
