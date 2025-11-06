# Spec-Driven Development Plugin

A comprehensive skill-based workflow for systematic software feature development - from requirements gathering through verified implementation.

## Overview

This plugin provides a **spec-architect skill** and simple commands that enable systematic, multi-agent software development. The skill guides you through exploration, specification creation, technical design, implementation coordination, and quality assurance.

## What's Included

### Skills

- **`spec-architect`** - Comprehensive skill containing the complete spec-driven development workflow, including:
  - Exploration and discovery guidance
  - Specification creation patterns
  - Technical design methodology
  - Implementation coordination protocols
  - Quality assurance standards
  - Agent communication protocols
  - All templates and reference documentation

### Commands

- **`/build`** - Build a new feature using the BUILD workflow (exploration → spec → design → implementation → QA)
- **`/iterate`** - Continue work on an existing specification or expand it with new features

### Agents

- **`spec-developer`** - Implements code following specifications, asks clarifying questions, presents alternatives, writes simple testable code
- **`spec-reviewer`** - Reviews for bugs, logic errors, security vulnerabilities, duplicate patterns, type safety issues, test quality, and architectural consistency
- **`spec-tester`** - Verifies implementations against specification requirements and acceptance criteria

### Scripts

- **`get-next-spec-id.sh`** - Helper script to determine next specification ID number

## Quick Start

### Building a New Feature

For new features that need systematic planning and implementation:

```bash
/build Add user authentication with OAuth2 support
```

The architect will:
1. **Explore** - Discover existing patterns, research best practices
2. **Specify** - Create comprehensive specification with acceptance criteria
3. **Design** - Break down implementation into testable tasks
4. **Implement** - Coordinate specialized agents to build the feature
5. **Verify** - Ensure quality through code review and specification testing

### Continuing Existing Work

To continue work on an existing specification:

```bash
/iterate specs/001-user-authentication/
```

The architect will:
1. Load existing spec files (`feature.md`, `tech.md`, `notes.md`)
2. Assess current state (completed vs incomplete tasks)
3. Determine next action and jump to appropriate workflow phase

## The Spec-Architect Skill

The `spec-architect` skill is the core of this plugin. It contains:

### Workflows

- **BUILD Workflow** - For new features
  - Phase 1: Exploration and Discovery
  - Phase 2: Specification Creation
  - Phase 3: Technical Design
  - Phase 4: Implementation Coordination
  - Phase 5: Quality Gates

- **ITERATE Workflow** - For existing specifications
  - Phase 1: Load and Assess
  - Phase 2: Execute Appropriate Workflow

### Core Philosophy

- **Clear specifications** before implementation
- **Specialized expertise** through dedicated agents
- **Quality verification** at every step (code review before QA)
- **Architectural coherence** through central coordination
- **Iterative refinement** through living documentation

### Core Principles

- **Pattern consistency** - Find and reuse existing patterns before creating new ones
- **Type safety** - Push logic into the type system; use discriminated unions over optional fields
- **Test quality** - Never remove or weaken tests without justification
- **Message passing over shared state** - Prefer immutable data and event-driven architectures
- **Simplicity** - Everything should be as simple as possible, but not simpler
- **Code review before QA** - Always review code for patterns, types, and test quality before specification testing

## Specification Structure

All specifications follow a directory-based structure:

```
specs/<numerical-id>-<kebab-cased-feature>/
├── feature.md      # WHAT needs to be built (FR-X, NFR-X)
├── notes.md        # Technical discoveries from spike work (optional)
└── tech.md         # HOW to build it (COMPONENT-N tasks)
```

### Example

```
specs/001-user-authentication/
├── feature.md      # Functional and non-functional requirements
├── notes.md        # OAuth2 research findings and POC results
└── tech.md         # Implementation tasks with checkboxes
```

## Multi-Agent Architecture

```
User Request
    ↓
┌─────────────────────────────────────┐
│  Architect (You)                    │
│  - Requirements analysis            │
│  - Task delegation                  │
│  - Quality oversight                │
└─────────────────────────────────────┘
    ↓           ↓           ↓
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Explore │ │Research │ │Implement│
│ Agent   │ │ Agent   │ │  Agent  │
└─────────┘ └─────────┘ └─────────┘
                  ↓
            ┌─────────────┐
            │Spec Review  │
            │   Agent     │
            └─────────────┘
                  ↓
            ┌─────────────┐
            │ Spec Tester │
            │   Agent     │
            └─────────────┘
```

### Agent Roles

- **Architect (Prime Agent)** - You, coordinating the entire workflow
- **Explore** - Fast codebase navigation and discovery
- **Researcher** - External knowledge acquisition and best practices
- **Spec Developer** - Code implementation following specifications
- **Spec Reviewer** - Reviews for duplicate patterns, type safety, test quality, and architectural consistency
- **Spec Tester** - Verification of implementations against acceptance criteria

## Quality Gates

The spec-architect skill enforces comprehensive quality gates before marking features complete. Key requirements include code review, QA verification, pattern consistency, type safety, and test quality. See the spec-architect skill for complete quality gate requirements.

## Best Practices

### Do's

- ✅ Use agents proactively based on their strengths
- ✅ Maintain living documentation that evolves
- ✅ Always code review before QA testing (catches patterns, types, test issues)
- ✅ Verify everything through QA before marking complete
- ✅ Use agent resumption to maintain context and reduce costs
- ✅ Commit after each major milestone
- ✅ Break complex tasks into small, testable pieces

### Don'ts

- ❌ Skip code review to save time (prevents technical debt accumulation)
- ❌ Skip QA verification to save time
- ❌ Batch multiple tasks together (implement one at a time)
- ❌ Not use agent resumption (wastes context and costs)
- ❌ Let the architect write code directly (delegate to developers)
- ❌ Proceed without clear specifications
- ❌ Allow direct communication between agents (route through architect)

## Agent Resumption

**CRITICAL**: The spec-architect skill requires checking for existing agents before spawning new ones. Always use agent resumption to maintain context and reduce costs. See the spec-architect skill for the complete agent check and resumption protocol.

## Project Setup

### Required Directory Structure

Create a `specs/` directory in your project root:

```bash
mkdir specs
```

### Copy Helper Script (Optional)

Copy the spec ID helper script to your project:

```bash
cp ~/.claude/plugins/spec-dev/scripts/get-next-spec-id.sh ./specs/
```

## Success Metrics

Track these to measure system effectiveness:

- **Specification Completeness**: % of features with full specs
- **First-Time Pass Rate**: % of implementations passing QA initially
- **Rework Rate**: Average iterations needed per feature
- **Time to Implementation**: From spec to verified code
- **Technical Debt Accumulation**: Items added vs resolved

## Examples

### Example 1: Building a New Feature

```bash
/build Build a user dashboard with metrics tracking and export functionality
```

The architect will:
1. Ask clarifying questions about requirements
2. Use Explore agent to find existing dashboard patterns
3. Use researcher agent for metrics visualization best practices
4. Create `specs/001-user-dashboard/feature.md` with requirements
5. Get your approval on the specification
6. Create `specs/001-user-dashboard/tech.md` with implementation tasks
7. Coordinate spec-developer to implement each task
8. Review each task with spec-reviewer before QA
9. Verify each task with spec-tester
10. Mark tasks complete in tech.md as they pass all gates

### Example 2: Iterating on Existing Spec

```bash
/iterate specs/001-user-dashboard/
```

The architect will:
1. Read `feature.md` and `tech.md` from the directory
2. Check which tasks are complete (checkboxes marked [x])
3. Continue implementing incomplete tasks
4. Or add new features if you request them

## Philosophy

This plugin prioritizes:

1. **Clear specifications** before implementation
2. **Specialized expertise** through dedicated agents
3. **Quality verification** at every step
4. **Architectural coherence** through central coordination
5. **Continuous improvement** through living documentation

The key to success is maintaining discipline in following the process while remaining flexible enough to adapt when requirements don't match reality.

## Advanced Usage

### Accessing the Skill Directly

You can load the spec-architect skill directly in any conversation:

```bash
/spec-architect
```

This gives you access to all the workflow guidance, templates, and reference documentation.

### Skill References

The spec-architect skill includes comprehensive reference documentation:

- **SPEC_PATTERNS.md** - Directory structure and file naming conventions
- **COMMUNICATION_PROTOCOL.md** - Agent briefing format and handover requirements
- **SPEC_TEMPLATE.md** - Feature specification template
- **TECH_SPEC_TEMPLATE.md** - Technical specification template
- **ways-of-working.md** - Complete multi-agent architecture and workflows
- **writing-specs.md** - Core principles for effective technical specifications

These are loaded as needed during the workflow.

## Getting Help

For more information:

- Load the `spec-architect` skill to see the full workflow guidance
- Check `CLAUDE.md` in this directory for Claude Code-specific instructions
- Review the reference documentation in `skills/spec-architect/references/`

## Evolution

This system should evolve based on:

1. **Usage Patterns** - Which agents are most/least effective
2. **Bottlenecks** - Where does the process slow down
3. **Quality Metrics** - Where do defects originate
4. **Team Feedback** - What's working and what's not

---

**Remember**: The architect (you) orchestrates specialized agents to ensure quality. Trust the agents while maintaining oversight of the overall implementation.
