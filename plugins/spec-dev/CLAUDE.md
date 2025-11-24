# Spec-Dev Plugin - Maintainer Documentation

## Architecture

Commands provide context → Skills provide intelligence → Agents execute tasks

```
/build → spec-architect skill → PLAN + BUILD workflows
/iterate → spec-architect skill → routes to PLAN or BUILD
```

## Directory Structure

```
plugins/spec-dev/
├── .claude-plugin/     # plugin.json metadata
├── commands/           # build.md, iterate.md
├── agents/             # spec-developer.md, code-reviewer.md, spec-signoff.md, spec-tester.md
├── hooks/              # Session tracking and auto-resumption
│   ├── hooks.json      # Hook registration (PreToolUse, PreCompact, SessionStart)
│   └── *.sh            # Hook handler scripts
├── skills/spec-architect/
│   ├── SKILL.md        # Routing and coordination
│   └── references/     # PLAN_WORKFLOW, BUILD_WORKFLOW, ITERATE_WORKFLOW
│                       # SPEC_TEMPLATE, TECH_SPEC_TEMPLATE, PROJECT_TEMPLATE
│                       # COMMUNICATION_PROTOCOL, writing-specs
└── scripts/            # get-next-spec-id.sh, get-latest-spec.sh
```

## Component Responsibilities

**Commands**: Provide context (script outputs, arguments), load skill, direct to workflow. Keep under 50 lines.

**Skills**: Load PLAN_WORKFLOW (create specs), BUILD_WORKFLOW (implement), or ITERATE_WORKFLOW (route). Load references progressively.

**Project Configuration** (optional): `specs/PROJECT.md` contains project-specific instructions for all agents. Created from `references/PROJECT_TEMPLATE.md`.

**Agents**:

- `spec-*` agents receive structured briefings per COMMUNICATION_PROTOCOL (enforced by architect, not documented in agent prompts)
- Agent prompts focus on behavior and workflow, not input format (reduces confusion and token usage)
- Supporting agents (Explore, researcher) use flexible delegation
- Repository-specific agents encouraged for domain expertise
- Keep descriptions under 50 words

**Scripts**: Idempotent, stable output, used in command Context sections.

**Hooks**: Session tracking and automatic resumption system:

- **PreToolUse** (skill-pretooluse-handler.sh): Initializes session tracking when spec-architect skill loads
- **PreCompact** (precompact-handler.sh): Increments compaction counter in session file
- **SessionStart** (sessionstart-handler.sh): Auto-resumes spec-dev sessions by loading spec-architect skill with ITERATE workflow

**Session files**: `~/.local/cache/codethread-plugins/spec-dev/<normalized-cwd>/<session-id>.json`

- Contains status, compaction count, cwd, timestamp
- Created when spec-architect skill loads
- Enables automatic workflow resumption

**Debugging hooks:**

Find sessions:

```bash
cwd=$(pwd | sed 's|^/||' | sed 's|/|-|g')
ls -la ~/.local/cache/codethread-plugins/spec-dev/$cwd/
```

View session file:

```bash
session_id="your-session-id"
cwd=$(pwd | sed 's|^/||' | sed 's|/|-|g')
cat ~/.local/cache/codethread-plugins/spec-dev/$cwd/$session_id.json
```

Test hooks:

```bash
# PreToolUse
echo '{"tool_name":"Skill","tool_input":{"skill":"spec-architect"},"session_id":"test-123","cwd":"'$(pwd)'"}' | \
  $CT_PLUGINS_DIR/spec-dev/hooks/skill-pretooluse-handler.sh

# PreCompact
echo '{"session_id":"test-123","cwd":"'$(pwd)'"}' | \
  $CT_PLUGINS_DIR/spec-dev/hooks/precompact-handler.sh

# SessionStart
echo '{"session_id":"test-123","cwd":"'$(pwd)'","source":"startup"}' | \
  $CT_PLUGINS_DIR/spec-dev/hooks/sessionstart-handler.sh
```

## PROJECT.md Versioning System

PROJECT_TEMPLATE.md includes version metadata to track template evolution and user customizations:

**Version Fields**:

- `template_version`: Version of PROJECT_TEMPLATE.md used to generate the user's PROJECT.md
- `owner_version`: User's customization version (incremented when they modify their PROJECT.md)

**How It Works**:

1. When user creates PROJECT.md from template, both versions start equal
2. User customizes PROJECT.md and increments `owner_version`
3. When we release new PROJECT_TEMPLATE.md, we increment its version and document changes in Template Version History
4. Architect compares versions on workflow start and offers to show new features if template is newer
5. User decides which changes to adopt and updates `template_version` when caught up

**Maintenance**:

- Update PROJECT_TEMPLATE.md version when adding new sections or significant changes
- Document all changes in Template Version History section
- Users maintain their own `owner_version` to track customizations

This enables graceful template evolution without breaking existing PROJECT.md files.

## Key Design Decisions

**Workflow Separation**: Three workflows avoid loading planning context during iteration. PLAN creates specs, BUILD implements, ITERATE routes.

**MAP vs BLUEPRINT Philosophy**: tech.md provides GUIDANCE (map) not IMPLEMENTATION (blueprint). Architect documents discoveries, patterns, integration points, and constraints; developer makes informed implementation decisions. Quality check: if developer could copy-paste from tech.md to implement, it's over-specified.

**Interview Documentation**: PLAN workflow creates `interview.md` in spec directory capturing user's original prompt verbatim and all Q&A exchanges. This serves as source of truth for what user requested. Spec-signoff validates feature.md fulfills the original brief and identifies implicit assumptions.

**Testing Setup**: Spec template includes exact commands to start systems, environment setup, test data, access points, cleanup. Validated before implementation.

**Protocol Scope**: COMMUNICATION_PROTOCOL applies to core spec-dev agents (spec-developer, code-reviewer, spec-signoff, spec-tester), enforced by architect in workflows. Agent prompts don't document the protocol format - they simply state they'll receive structured instructions and should follow them. This reduces token usage (~1200-1500 tokens) and confusion (agents don't understand "architect" terminology from their perspective). Flexible delegation for other agents encourages using domain-specific agents.

**Task ID Convention**: Tech specs use component-prefixed task IDs (e.g., AUTH-1, COMP-1, API-1) where the prefix reflects the component name. This provides clear organization and traceability from requirements (FR-X, NFR-X) through implementation tasks.

**Spec Review Gate**: After technical design, spec-signoff validates user intent (via interview.md), completeness, guidance vs over-specification, discovery capture, contradictions, dependencies, self-containment, testability, and testing setup. Identifies implicit assumptions and gaps between user's request and specifications. During BUILD phase, code-reviewer validates patterns, types, and test quality for each task implementation.

**Session Resumption**: Hooks enable automatic workflow continuation:

- When spec-architect skill loads, session tracking initializes
- On compaction, counter increments
- On session resume/restart, you're automatically put back into spec-dev mode with ITERATE workflow
- This ensures seamless work continuation without manually re-invoking /iterate

## Maintenance Tasks

**Update workflows**: Edit `references/{PLAN,BUILD,ITERATE}_WORKFLOW.md`

**Update templates**: Edit `references/*_TEMPLATE.md` (SPEC_TEMPLATE, TECH_SPEC_TEMPLATE, PROJECT_TEMPLATE). Note: TECH_SPEC_TEMPLATE.md follows MAP approach (guidance) not BLUEPRINT approach (implementation details)

**Version PROJECT_TEMPLATE.md changes**: When updating PROJECT_TEMPLATE.md:

1. Increment the version number in the "Version Metadata" section
2. Add entry to "Template Version History" describing the changes
3. Update workflows if version checking logic needs changes
4. This enables architect to offer users updates when newer templates are available

**Change agent behavior**: Edit `agents/*.md` system prompt. Note: spec-signoff reviews specs in PLAN, code-reviewer reviews code in BUILD

**Add quality gates**: Update workflow file, update agent briefings if needed, document in COMMUNICATION_PROTOCOL if affects all agents

**Update hooks**: Edit `hooks/*.sh` and test with hook debugging commands (see `hooks/README.md`)

**Modify session behavior**: Edit `hooks/sessionstart-handler.sh` for auto-resume logic

**Change session tracking**: Edit `hooks/skill-pretooluse-handler.sh` for initialization

## Testing

```bash
/build Test feature
/iterate
cc-logs--extract-agents <session-id>
```

**Checklist**:

- [ ] Enforce limits (commands <50 lines, agent descriptions <50 words)
- [ ] No duplication between files
- [ ] Workflows reference correctly
- [ ] Scripts handle edge cases
- [ ] Agent resumption works
- [ ] Hook handlers execute successfully (use hook debugging commands from hooks/README.md)
- [ ] Session tracking creates files in expected location
- [ ] Auto-resumption loads skill correctly after compaction

## Common Pitfalls

- Commands are thin wrappers only
- Each concept lives in one place
- Always check for existing agents before spawning
- Testing Setup is required in spec template
