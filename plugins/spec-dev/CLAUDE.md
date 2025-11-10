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
├── agents/             # spec-developer.md, spec-reviewer.md, spec-tester.md
├── hooks/              # Session tracking and auto-resumption
│   ├── hooks.json      # Hook registration (PreToolUse, PreCompact, SessionStart)
│   └── *.sh            # Hook handler scripts
├── skills/spec-architect/
│   ├── SKILL.md        # Routing and coordination
│   └── references/     # PLAN_WORKFLOW, BUILD_WORKFLOW, ITERATE_WORKFLOW
│                       # SPEC_TEMPLATE, TECH_SPEC_TEMPLATE, PROJECT_TEMPLATE
│                       # SPEC_PATTERNS, COMMUNICATION_PROTOCOL, writing-specs
└── scripts/            # get-next-spec-id.sh, get-latest-spec.sh
```

## Component Responsibilities

**Commands**: Provide context (script outputs, arguments), load skill, direct to workflow. Keep under 50 lines.

**Skills**: Load PLAN_WORKFLOW (create specs), BUILD_WORKFLOW (implement), or ITERATE_WORKFLOW (route). Load references progressively.

**Project Configuration** (optional): `specs/PROJECT.md` contains project-specific instructions for all agents. Created from `references/PROJECT_TEMPLATE.md`.

**Agents**:
- `spec-*` agents follow COMMUNICATION_PROTOCOL (structured briefings, agent resumption, vimgrep references)
- Supporting agents (Explore, researcher) use flexible delegation
- Repository-specific agents encouraged for domain expertise
- Keep descriptions under 50 words

**Scripts**: Idempotent, stable output, used in command Context sections.

**Hooks**: Session tracking and automatic resumption system:
- **PreToolUse** (skill-pretooluse-handler.sh): Initializes session tracking when spec-architect skill loads
- **PreCompact** (precompact-handler.sh): Increments compaction counter in session file
- **SessionStart** (sessionstart-handler.sh): Auto-resumes spec-dev sessions by loading spec-architect skill with ITERATE workflow

**Session files**: `~/.local/cache/personal-configs-plugins/spec-dev/<normalized-cwd>/<session-id>.json`
- Contains status, compaction count, cwd, timestamp
- Created when spec-architect skill loads
- Enables automatic workflow resumption

**Debugging hooks:**

Find sessions:
```bash
cwd=$(pwd | sed 's|^/||' | sed 's|/|-|g')
ls -la ~/.local/cache/personal-configs-plugins/spec-dev/$cwd/
```

View session file:
```bash
session_id="your-session-id"
cwd=$(pwd | sed 's|^/||' | sed 's|/|-|g')
cat ~/.local/cache/personal-configs-plugins/spec-dev/$cwd/$session_id.json
```

Test hooks:
```bash
# PreToolUse
echo '{"tool_name":"Skill","tool_input":{"skill":"spec-architect"},"session_id":"test-123","cwd":"'$(pwd)'"}' | \
  ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/hooks/skill-pretooluse-handler.sh

# PreCompact
echo '{"session_id":"test-123","cwd":"'$(pwd)'"}' | \
  ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/hooks/precompact-handler.sh

# SessionStart
echo '{"session_id":"test-123","cwd":"'$(pwd)'","source":"startup"}' | \
  ~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/spec-dev/hooks/sessionstart-handler.sh
```

## Key Design Decisions

**Workflow Separation**: Three workflows avoid loading planning context during iteration. PLAN creates specs, BUILD implements, ITERATE routes.

**Testing Setup**: Spec template includes exact commands to start systems, environment setup, test data, access points, cleanup. Validated before implementation.

**Protocol Scope**: COMMUNICATION_PROTOCOL applies to `spec-*` agents only. Flexible delegation for others encourages using domain-specific agents.

**Spec Review Gate**: After technical design, spec-reviewer validates completeness, contradictions, dependencies, self-containment, testability, and testing setup.

**Session Resumption**: Hooks enable automatic workflow continuation:
- When spec-architect skill loads, session tracking initializes
- On compaction, counter increments
- On session resume/restart, you're automatically put back into spec-dev mode with ITERATE workflow
- This ensures seamless work continuation without manually re-invoking /iterate

## Maintenance Tasks

**Update workflows**: Edit `references/{PLAN,BUILD,ITERATE}_WORKFLOW.md`

**Update templates**: Edit `references/*_TEMPLATE.md` (SPEC_TEMPLATE, TECH_SPEC_TEMPLATE, PROJECT_TEMPLATE)

**Change agent behavior**: Edit `agents/spec-*.md` system prompt

**Add quality gates**: Update workflow file, update spec-reviewer briefing if needed, document in COMMUNICATION_PROTOCOL if affects all agents

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
