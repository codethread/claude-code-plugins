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
├── commands/           # build.md, iterate.md
├── agents/             # spec-developer.md, spec-reviewer.md, spec-tester.md
├── skills/spec-architect/
│   ├── SKILL.md        # Routing and coordination
│   └── references/     # PLAN_WORKFLOW, BUILD_WORKFLOW, ITERATE_WORKFLOW
│                       # SPEC_TEMPLATE, TECH_SPEC_TEMPLATE, SPEC_PATTERNS
│                       # COMMUNICATION_PROTOCOL, writing-specs
└── scripts/            # get-next-spec-id.sh, get-latest-spec.sh
```

## Component Responsibilities

**Commands**: Provide context (script outputs, arguments), load skill, direct to workflow. Keep under 50 lines.

**Skills**: Load PLAN_WORKFLOW (create specs), BUILD_WORKFLOW (implement), or ITERATE_WORKFLOW (route). Load references progressively.

**Agents**:
- `spec-*` agents follow COMMUNICATION_PROTOCOL (structured briefings, agent resumption, vimgrep references)
- Supporting agents (Explore, researcher) use flexible delegation
- Repository-specific agents encouraged for domain expertise
- Keep descriptions under 50 words

**Scripts**: Idempotent, stable output, used in command Context sections.

## Key Design Decisions

**Workflow Separation**: Three workflows avoid loading planning context during iteration. PLAN creates specs, BUILD implements, ITERATE routes.

**Testing Setup**: Spec template includes exact commands to start systems, environment setup, test data, access points, cleanup. Validated before implementation.

**Protocol Scope**: COMMUNICATION_PROTOCOL applies to `spec-*` agents only. Flexible delegation for others encourages using domain-specific agents.

**Spec Review Gate**: After technical design, spec-reviewer validates completeness, contradictions, dependencies, self-containment, testability, and testing setup.

## Maintenance Tasks

**Update workflows**: Edit `references/{PLAN,BUILD,ITERATE}_WORKFLOW.md`

**Update templates**: Edit `references/*_TEMPLATE.md`

**Change agent behavior**: Edit `agents/spec-*.md` system prompt

**Add quality gates**: Update workflow file, update spec-reviewer briefing if needed, document in COMMUNICATION_PROTOCOL if affects all agents

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

## Common Pitfalls

- Commands are thin wrappers only
- Each concept lives in one place
- Always check for existing agents before spawning
- Testing Setup is required in spec template
