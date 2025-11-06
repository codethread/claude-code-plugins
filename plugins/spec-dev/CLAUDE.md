# Spec-Dev Plugin

Skill-based systematic feature development using multi-agent coordination.

## Plugin Structure

This plugin is built around the **spec-architect skill**, which contains the complete spec-driven development workflow.

### Core Components

- **Skills**:
  - `spec-architect` - Complete workflow guidance for systematic feature development

- **Commands**:
  - `/build` - Build new features (loads spec-architect skill, executes BUILD workflow)
  - `/iterate` - Continue existing specifications (loads spec-architect skill, executes ITERATE workflow)

- **Agents**:
  - `spec-developer` - Implements code following specifications
  - `spec-reviewer` - Reviews for patterns, type safety, test quality, architectural consistency
  - `spec-tester` - Verifies implementations against specification requirements

## Key Commands

### `/build <feature description>`

Builds a new feature using the complete spec-driven workflow:
1. Exploration and discovery
2. Specification creation
3. Technical design
4. Implementation coordination
5. Quality assurance

**When to use**: Starting a brand new feature that needs systematic planning and implementation.

### `/iterate <specs/directory>`

Continues work on an existing specification:
1. Loads existing spec files
2. Assesses current state
3. Jumps to appropriate workflow phase

**When to use**: Continuing incomplete work, adding features to existing spec, or refining technical approach.

## The Spec-Architect Skill

The spec-architect skill is the heart of this plugin. When loaded (automatically by `/build` and `/iterate` commands), it provides:

- **Complete workflow guidance** for all phases of development
- **Agent communication protocols** for coordinating specialized agents
- **Quality standards** and verification gates
- **Specification templates** and patterns
- **Best practices** for systematic development

### Skill References

The skill includes comprehensive reference documentation:

- **SPEC_PATTERNS.md** - Directory structure and naming conventions
- **COMMUNICATION_PROTOCOL.md** - Agent briefing and handover standards
- **SPEC_TEMPLATE.md** - Feature specification template
- **TECH_SPEC_TEMPLATE.md** - Technical specification template
- **ways-of-working.md** - Multi-agent architecture details
- **writing-specs.md** - Principles for effective specifications

These are loaded as needed during workflows.

## Specification Structure

All specifications follow a directory-based pattern:

```
specs/<id>-<feature>/
├── feature.md      # WHAT (FR-X, NFR-X requirements)
├── notes.md        # Technical discoveries (optional)
└── tech.md         # HOW (COMPONENT-N tasks with checkboxes)
```

## Workflow Overview

### BUILD Workflow (New Features)

```
Exploration → Specification → Technical Design → Implementation → QA
```

The architect:
- Uses Explore agent to find existing patterns
- Uses researcher agent for best practices
- Creates comprehensive specifications
- Coordinates spec-developer for implementation
- Ensures spec-reviewer checks every task
- Verifies with spec-tester
- Tracks progress in tech.md checkboxes

### ITERATE Workflow (Existing Specs)

```
Load & Assess → Jump to Appropriate Phase
```

The architect:
- Loads existing spec files
- Reviews completed tasks (checkboxes in tech.md)
- Continues implementation OR expands specification OR refines design

## Agent Coordination

### Core Principle

**The architect orchestrates; specialized agents execute.**

- ❌ Don't write code directly
- ✅ Delegate to spec-developer
- ✅ Always code review before QA
- ✅ Always use agent resumption when sending agents back for fixes
- ✅ Update tech.md checkboxes as tasks complete

### Agent Resumption

**CRITICAL**: The spec-architect skill requires checking for existing agents BEFORE spawning new ones, and using `resume` for all follow-up work. See the skill for the complete protocol.

## Implementation Pattern

**ONE task at a time**:

```
Select Task → Implement → Code Review → Fix → QA Test → Fix → Architect Review → Mark Complete
```

**Never batch tasks**. The mandatory sequence ensures quality at every step.

## Important Notes

- The spec-architect skill contains all workflow guidance - the `/build` and `/iterate` commands simply load it and direct you to the appropriate workflow
- Always follow the COMMUNICATION_PROTOCOL when delegating to agents
- Always use agent resumption to maintain context and reduce costs
- The tech.md file is your progress tracker - keep checkboxes updated
- Code review comes BEFORE QA testing (catches patterns, types, test issues)
- Never skip code review or QA verification

## Common Workflows

### Starting a New Feature

```bash
/build Add user authentication with OAuth2 support
```

You'll be guided through exploration, specification, design, and implementation.

### Continuing Existing Work

```bash
/iterate specs/001-user-authentication/
```

You'll load the spec, assess state, and continue where you left off.

### Expanding an Existing Feature

```bash
/iterate specs/001-user-authentication/
```

Then add new requirements to feature.md and update tech.md accordingly.

## Best Practices

### Do's

- ✅ Follow the skill's workflow guidance systematically
- ✅ Use Explore agent to find existing patterns before creating new ones
- ✅ Create comprehensive specifications before implementation
- ✅ Break technical design into testable tasks
- ✅ Implement ONE task at a time
- ✅ Code review before QA testing
- ✅ Use agent resumption for all rework
- ✅ Update tech.md checkboxes immediately

### Don'ts

- ❌ Skip exploration phase (you'll duplicate existing patterns)
- ❌ Implement without clear specifications
- ❌ Batch multiple tasks together
- ❌ Skip code review to save time
- ❌ Skip QA verification to save time
- ❌ Create new agents for rework (use resumption)
- ❌ Let the architect write code directly

## Success Indicators

- Specifications created before implementation starts
- All tasks pass code review before QA testing
- tech.md checkboxes accurately reflect progress
- No duplicate patterns introduced
- Type safety maximized throughout
- Test quality maintained or improved
- Agent resumption used consistently

---

**Remember**: The spec-architect skill contains the complete workflow. Trust the skill's guidance and coordinate your team of specialized agents to deliver high-quality, well-specified features.
