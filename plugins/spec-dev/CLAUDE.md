# Spec-Dev Plugin - Maintainer Documentation

This document is for **plugin maintainers and developers** working on the spec-dev plugin itself. For end-user documentation, see `README.md`.

## Plugin Architecture

This plugin follows a **skill-centric architecture** where all workflow logic and context lives in the skill, and commands are thin wrappers that load the skill and direct to specific workflows.

### Design Principle

**Commands provide context → Skills provide intelligence → Agents execute specialized tasks**

```
/build (command)
  ├─ Provides: Next spec ID from script
  ├─ Loads: spec-architect skill
  └─ Directs: To BUILD workflow

spec-architect (skill)
  ├─ Contains: All workflow logic, templates, references
  ├─ Coordinates: Multi-agent implementation
  └─ Enforces: Quality gates and standards

spec-developer (agent)
  └─ Executes: Code implementation tasks
```

## Directory Structure

```
plugins/spec-dev/
├── README.md                    # User-facing documentation
├── CLAUDE.md                    # This file - maintainer documentation
│
├── commands/                    # Slash commands (thin wrappers)
│   ├── build.md                # /build - New feature workflow
│   └── iterate.md              # /iterate - Continue existing work
│
├── agents/                      # Specialized sub-agents
│   ├── spec-developer.md       # Code implementation
│   ├── spec-reviewer.md        # Code review for quality
│   └── spec-tester.md          # QA verification against specs
│
├── skills/                      # Core workflow intelligence
│   └── spec-architect/
│       ├── SKILL.md            # Main skill file with all workflows
│       └── references/         # Supporting documentation
│           ├── SPEC_TEMPLATE.md
│           ├── TECH_SPEC_TEMPLATE.md
│           ├── SPEC_PATTERNS.md
│           ├── COMMUNICATION_PROTOCOL.md
│           ├── ways-of-working.md
│           └── writing-specs.md
│
└── scripts/                     # Helper utilities
    ├── get-next-spec-id.sh     # Calculate next spec number
    └── get-latest-spec.sh      # Find most recent spec
```

## Component Responsibilities

### Commands (commands/)

**Purpose**: Provide minimal context and delegate to skills

**Structure**:
```markdown
---
description: Brief description for command palette
argument-hint: [what arguments it expects]
allowed-tools: Bash(bash:*)  # For script execution
---

## Context
- Script output: !`bash path/to/script.sh`

## Arguments
- `VARIABLE_NAME`: $ARGUMENTS

## Instructions
1. Load the skill
2. Direct to specific workflow
3. Pass context variables
```

**Guidelines**:
- Keep commands under 50 lines
- Only provide context (script outputs, arguments)
- Load the skill and direct to workflow
- Don't duplicate workflow logic from skill

**Adding a New Command**:
1. Create `commands/my-command.md`
2. Follow the structure above
3. Update README.md to document it
4. Register in `.claude-plugin/marketplace.json` if needed

### Skills (skills/)

**Purpose**: Contains all workflow intelligence, templates, and coordination logic

**Structure**:
```markdown
---
name: skill-name
description: When and why to use this skill
---

# Skill Name

## Overview
[Role and purpose]

## Available Agents
[List specialized agents with descriptions]

## Workflows
[Detailed workflow phases and steps]

## References
[List references/ files that can be loaded as needed]
```

**Guidelines**:
- All workflow logic lives here
- Comprehensive and self-contained
- References should be loaded as needed (not inline)
- Update proactively when workflows change

**Modifying the Skill**:
1. Edit `skills/spec-architect/SKILL.md` for workflow changes
2. Edit `references/*.md` for supporting documentation
3. Keep templates in `references/` for easy updates
4. Test by loading skill with `/spec-architect` command

### Agents (agents/)

**Purpose**: Specialized sub-agents for focused execution tasks

**Structure**:
```markdown
---
name: agent-name
description: Concise 1-2 sentence description of what agent does
tools: [List of tools agent can use]
model: sonnet|haiku|opus
color: color-name
---

[Detailed system prompt and instructions]
```

**Agent Naming Convention**: Use `spec-*` prefix
- `spec-developer` - Implementation
- `spec-reviewer` - Code review
- `spec-tester` - QA verification

**Guidelines for Descriptions**:
- Keep descriptions under 50 words
- Focus on WHAT and WHEN, not HOW
- Main agent (architect) decides when to use them
- Examples and detailed instructions in agent body

**Adding a New Agent**:
1. Create `agents/spec-newagent.md`
2. Follow naming convention (`spec-*`)
3. Add concise description to frontmatter
4. Update `SKILL.md` to reference new agent
5. Document in README.md if user-facing

### Scripts (scripts/)

**Purpose**: Helper utilities for context gathering

**Guidelines**:
- Should be idempotent
- Output must be stable and parsable
- Used via command Context sections
- Test with various project states

**Current Scripts**:
- `get-next-spec-id.sh` - Finds next available spec ID
- `get-latest-spec.sh` - Finds most recent spec directory

**Adding a New Script**:
1. Create executable script in `scripts/`
2. Make it idempotent and error-tolerant
3. Reference from command Context section
4. Document expected output format

## Key Design Decisions

### 1. Skill-Centric Architecture

**Why**: Commands are thin wrappers so all intelligence lives in one place

- ✅ Single source of truth for workflows
- ✅ Easy to update and maintain
- ✅ Commands stay simple and stable
- ❌ Skill becomes large (but references help)

### 2. Agent Resumption is Mandatory

**Why**: Cost efficiency and context preservation

The skill enforces checking for existing agents before spawning new ones:
```
1. Get session ID
2. Run cc-logs--extract-agents <session-id>
3. Resume existing agent if appropriate
4. Otherwise spawn new agent
```

**Implementation**: See SKILL.md lines 41-57

### 3. Progressive Disclosure

**Why**: Load only what's needed, when it's needed

- Skill loaded by commands
- References loaded by skill as needed
- Agents spawned only when required

### 4. Living Documentation

**Why**: Specs evolve during implementation

All spec files (`feature.md`, `tech.md`, `notes.md`) are updated as implementation reveals insights.

## Common Maintenance Tasks

### Updating Workflows

**File**: `skills/spec-architect/SKILL.md`

1. Locate the workflow phase to update
2. Modify steps and instructions
3. Update references to agent names if needed
4. Test by running `/build` or `/iterate`

### Updating Templates

**Files**: `skills/spec-architect/references/*_TEMPLATE.md`

1. Edit template file
2. Update any references in SKILL.md if structure changes
3. Existing specs are unaffected (templates are just starting points)

### Changing Agent Behavior

**Files**: `agents/spec-*.md`

1. Edit agent system prompt (below frontmatter)
2. Keep description in frontmatter concise
3. Don't change agent name (referenced throughout)
4. Test by spawning agent through skill

### Adding Quality Gates

**File**: `skills/spec-architect/SKILL.md`

1. Add to "Phase 5: Quality Gates" section
2. Update implementation workflow to enforce
3. Document in agent instructions if needed

### Updating File Patterns

**Files**:
- `skills/spec-architect/references/SPEC_PATTERNS.md` - Pattern documentation
- `scripts/get-next-spec-id.sh` - Pattern implementation

1. Update pattern documentation first
2. Update script to match new pattern
3. Update any parsing logic in skill
4. Consider migration path for existing specs

## Testing Changes

### Manual Testing Workflow

1. **Start fresh session**
   ```bash
   # Get session ID from: "Initialized agent context session: <id>"
   ```

2. **Test BUILD workflow**
   ```bash
   /build Test feature for workflow validation
   ```
   - Verify exploration phase
   - Check spec creation
   - Validate task breakdown
   - Test agent coordination

3. **Test ITERATE workflow**
   ```bash
   /iterate specs/001-test-feature/
   ```
   - Verify spec loading
   - Check state assessment
   - Test continuation logic

4. **Test agent resumption**
   ```bash
   cc-logs--extract-agents <session-id>
   ```
   - Verify agents are listed
   - Check agent can be resumed
   - Validate context preservation

### Validation Checklist

Before committing changes:

- [ ] Commands still under 50 lines
- [ ] Agent descriptions under 50 words
- [ ] Skill workflows are complete and clear
- [ ] No duplication between files
- [ ] Scripts work with empty/populated spec directories
- [ ] References load correctly when needed
- [ ] Agent resumption protocol intact
- [ ] User-facing README updated if needed

## Architecture Rationale

### Why Three Agent Types?

- **spec-developer**: Specialized for implementation (asks questions, presents options)
- **spec-reviewer**: Focused on quality (patterns, types, tests)
- **spec-tester**: Verifies against requirements (objective pass/fail)

Three agents provide clear separation of concerns without over-complication.

### Why Skill Instead of Multiple Commands?

Original design had `/prime-spec`, `/prime-tech`, `/prime-build`. Problems:
- Duplication of workflow logic across commands
- Hard to maintain consistency
- User confusion about when to use which

Current design: Two commands (`/build`, `/iterate`) load one skill with all workflow intelligence.

### Why Scripts in Commands Not Skill?

Commands provide context through script execution:
- Next spec ID calculated when command runs
- Context is current and accurate
- Skill receives clean input
- Scripts can be updated independently

## Common Pitfalls

### ❌ Don't: Add Workflow Logic to Commands

Commands should only:
- Execute scripts for context
- Load the skill
- Direct to workflow

All workflow intelligence goes in the skill.

### ❌ Don't: Duplicate Content

Each piece of information should live in exactly one place:
- Workflow phases → SKILL.md
- Templates → references/ directory
- User docs → README.md
- Maintainer docs → CLAUDE.md

### ❌ Don't: Make Agents Too Verbose

Agent descriptions are for the architect to decide when to use them. Keep under 50 words. Details go in the agent body.

### ❌ Don't: Skip Agent Resumption

Always check for existing agents before spawning new ones. This is enforced in the skill.

## Evolution Guidelines

### When to Add a New Agent

Consider adding an agent when:
- Clear specialized responsibility emerges
- Distinct from existing agents
- Used repeatedly across workflows
- Has specific tool requirements

Don't add agents for:
- One-off tasks
- Minor variations of existing agents
- Tasks the architect should do

### When to Add a New Command

Consider adding a command when:
- New entry point to workflow needed
- Different context required than existing commands
- User-facing feature addition

Don't add commands for:
- Internal workflow variations
- Minor workflow tweaks
- Things that can be handled by `/iterate`

### When to Update the Skill

Update skill when:
- Workflow phases change
- Quality gates added/modified
- Agent coordination changes
- New best practices emerge

Document all changes in this file.

## Troubleshooting

### Command Not Loading Skill

Check:
1. Skill tool call syntax correct?
2. Skill name matches exactly?
3. Skill file has valid frontmatter?

### Agent Not Being Used

Check:
1. Agent listed in skill's "Available Agents"?
2. Description clear about when to use?
3. Agent file name matches references?

### Scripts Failing

Check:
1. Script has execute permissions?
2. Path in command Context correct?
3. Script handles missing directories?
4. Output format parseable?

---

**Remember**: This plugin architecture prioritizes maintainability through clear separation of concerns. Commands provide context, skills provide intelligence, agents execute tasks.
