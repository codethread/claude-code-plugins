# Spec-Driven Development Plugin

Systematic feature development with specifications, automated code review, and QA verification.

## Installation

```bash
/plugin install spec-dev@personal-configs-plugins
```

## What This Does

Creates specifications → validates → implements task-by-task with code review and QA → verifies against requirements.

## Commands

### `/build <feature description>`

```bash
/build Add OAuth2 authentication with GitHub provider
```

Explores codebase → creates `specs/001-oauth-auth/feature.md` → you review → creates `tech.md` → validates → implements with review and QA.

### `/iterate [spec-directory]`

```bash
/iterate                         # Continue most recent spec
/iterate specs/001-oauth-auth/   # Work on specific spec
```

Routes to PLAN workflow (update specs) or BUILD workflow (continue implementation).

## What Gets Created

```
specs/
└── 001-oauth-authentication/
    ├── feature.md    # Requirements (FR-1, FR-2, NFR-1...)
    ├── tech.md       # Implementation tasks with checkboxes
    └── notes.md      # Technical research (optional)
```

**feature.md**: Functional (FR-X) and non-functional requirements (NFR-X), interface definitions, success metrics, testing setup (exact commands, environment, test data).

**tech.md**: Numbered tasks linking to FR/NFR, testability markers, progress checkboxes.

## Quality Standards

Specifications validated before implementation. Code reviewed for patterns, types, tests. QA verifies against requirements.

## Example Workflow

```bash
/build Add user profile editing with avatar upload
```

1. Specification created in `specs/002-user-profile/feature.md`
2. You review and approve
3. Technical design created in `tech.md`
4. Specification validated
5. Implementation begins task-by-task:
   ```
   ✓ PROFILE-1: Create profile model (code review → QA → passed)
   ✓ PROFILE-2: Add avatar upload endpoint (code review → QA → passed)
   → PROFILE-3: Build profile UI component (in progress)
   ```

Continue later:

```bash
/iterate
```

Add new feature to existing spec:

```bash
/iterate specs/002-user-profile/
# Prompt: "Add password change to user profile"
```

## Session Resumption

Spec-dev sessions **automatically resume** after:
- Session restart
- Session resumption
- Compaction events

When resuming, the plugin:
- Automatically loads the `spec-architect` skill
- Follows the ITERATE workflow
- Shows how many compactions have occurred
- Displays the most recent specification

This ensures you can seamlessly continue work without manually re-invoking `/iterate`.
