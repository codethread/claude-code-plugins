# Spec-Driven Development Plugin

Systematic, specification-driven feature development with multi-agent implementation and automated quality gates.

## When to Use

Use this plugin when:
- Building new features from clear requirements
- Need structured workflow from spec to verified implementation
- Want automated code review and QA
- Building complex features that need task breakdown
- Continuing work on existing specifications

## Installation

```bash
/plugin install spec-dev@personal-configs-plugins
```

## What You Get

### Commands

**`/build <feature description>`**

Builds new features through complete workflow:
1. Explores codebase for patterns
2. Creates specification (you review and approve)
3. Creates technical design with tasks
4. Implements with automated review
5. Verifies against specifications

**`/iterate [spec-directory]`**

Continues or expands existing work:
- Loads existing specs from `specs/` directory
- Assesses current state
- Continues implementation or adds features
- Use without arguments to continue most recent spec

### Agents

- **spec-architect** - Coordinates workflow and quality gates
- **spec-developer** - Implements code with automated review
- **spec-reviewer** - Code quality verification
- **spec-tester** - QA verification against requirements

### What Gets Created

Specifications in standard structure:

```
specs/
└── 001-feature-name/
    ├── feature.md    # Requirements and acceptance criteria
    ├── tech.md       # Implementation tasks with checkboxes
    └── notes.md      # Technical research (optional)
```

## Quick Example

```bash
/build Add user authentication with OAuth2 support
```

Claude will:
1. Explore your codebase
2. Create spec in `specs/001-user-authentication/`
3. Break down into tasks in `tech.md`
4. Implement with automated review
5. Mark tasks complete as they pass verification

Continue work:
```bash
/iterate specs/001-user-authentication/
# or just: /iterate
```

## Quality Standards

Automated quality gates enforce:
- Code review for patterns and type safety
- Implementation matches specifications
- Tests maintain or improve coverage
- No duplicate code patterns
- Type safety maximized

## Related

See `CLAUDE.md` for maintainer documentation and plugin architecture.
