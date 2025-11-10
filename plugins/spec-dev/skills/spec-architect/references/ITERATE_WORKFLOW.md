# ITERATE Workflow - Continuing Existing Work

Use this workflow when continuing work on an existing specification.

## Phase 1: Load and Assess

**Actions**:

1. **Load Project Configuration**: Check for `specs/PROJECT.md`. If exists, read and extract sections per COMMUNICATION_PROTOCOL.

2. **Load Specification**:
   - Read `feature.md` from provided spec directory
   - Read `tech.md` if it exists
   - Read `notes.md` if it exists

3. **Assess Current State**:
   - Review what's been completed (marked checkboxes in `tech.md`)
   - Identify incomplete tasks
   - Check for any new requirements or changes needed
   - Follow PROJECT.md guidelines if loaded earlier

4. **Determine Next Action**:
   - Continue incomplete implementation → Use BUILD workflow
   - Expand/refine specifications → Use PLAN workflow
   - Create initial specifications → Use PLAN workflow

## Phase 2: Execute Appropriate Workflow

Based on your assessment, choose the appropriate workflow:

### If continuing implementation
**Use `BUILD_WORKFLOW.md`**
- Specifications already exist and are validated
- Continue with task-by-task implementation
- Use existing `tech.md` checklist to track progress
- Follow Phase 1 (Implementation Coordination) through Phase 2 (Quality Gates)

### If expanding or refining specifications
**Use `PLAN_WORKFLOW.md`**
- Start at appropriate phase based on what needs updating:
  - **Phase 2** (Specification Creation) - Adding new FR-X/NFR-X requirements to existing `feature.md`
  - **Phase 3** (Technical Design) - Updating `tech.md` with revised implementation approach
- Get user approval for changes
- Ensure spec review (Phase 3, Step 8) validates updated specs
- Then proceed to `BUILD_WORKFLOW.md` for implementation

### If no specifications exist yet
**Use `PLAN_WORKFLOW.md` from Phase 1**
- Create complete specifications from scratch
- Validate before implementation
- Then proceed to `BUILD_WORKFLOW.md`

## Key Principle

**The ITERATE workflow doesn't duplicate content** - it's simply an assessment entry point that routes to the appropriate workflow (PLAN or BUILD) based on the current state of the specification.
