# Spec-Driven Development

Systematic feature development: specifications → validation → implementation → review → QA.

## What

Multi-agent workflow that creates specifications, validates them, implements task-by-task with code review and QA testing.

## Why

- Clear requirements before coding
- Validates specs before implementation
- Code review on every task
- QA testing against requirements
- Automatic session resumption

## How

### Install

```bash
/plugin install spec-dev@personal-configs-plugins
```

### Use

**Start a feature:**
```bash
/build Add OAuth2 authentication with GitHub provider
```

**Continue work:**
```bash
/iterate                         # Resume latest spec
/iterate specs/001-oauth-auth/   # Work on specific spec
```

### What Gets Created

```
specs/
├── PROJECT.md       # Project-wide agent instructions (optional)
└── 001-feature-name/
    ├── feature.md   # Requirements (FR-1, NFR-1)
    ├── tech.md      # Implementation tasks
    └── notes.md     # Research notes (optional)
```

**Ask Claude for details:**
```
What does PROJECT.md do?
Show me an example workflow
How does session resumption work?
```
