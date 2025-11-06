# Spec-Driven Development Plugin

A Claude Code plugin for systematic, specification-driven software development. Build features from clear requirements through verified implementation with automated quality gates.

## What It Does

This plugin guides Claude Code through a structured workflow to build software features:

1. **Explore** your codebase to understand existing patterns
2. **Create specifications** with clear acceptance criteria
3. **Design** implementation approach with testable tasks
4. **Build** the feature with automated code review
5. **Verify** against specifications before completion

## Installation

```bash
# Add the marketplace (if not already added)
/plugin marketplace add <path-to-this-repo>

# Install the plugin
/plugin install spec-dev@personal-configs-plugins
```

## Quick Start

### Building a New Feature

Start with a description of what you want to build:

```bash
/build Add user authentication with OAuth2 support
```

Claude will:
- Ask clarifying questions about your requirements
- Explore your codebase for existing patterns
- Create a specification document for your approval
- Break down the implementation into tasks
- Build and verify each task systematically
- Generate specifications in `specs/001-user-authentication/`

### Continuing Existing Work

Pick up where you left off or expand an existing feature:

```bash
/iterate specs/001-user-authentication/
```

Claude will:
- Load your existing specification
- Check what's been completed
- Continue implementation or expand the feature

You can also just use:
```bash
/iterate
```
Without arguments, it continues work on the most recent specification.

## What Gets Created

The plugin creates specifications in a standard directory structure:

```
specs/
└── 001-feature-name/
    ├── feature.md    # Requirements and acceptance criteria
    ├── tech.md       # Implementation tasks with checkboxes
    └── notes.md      # Technical research findings (optional)
```

### Example

```
specs/001-user-authentication/
├── feature.md      # "Users must authenticate via OAuth2..."
├── tech.md         # "☑ AUTH-1: Setup OAuth client..."
└── notes.md        # "Researched Auth0 vs custom implementation..."
```

## Commands Reference

### `/build <feature description>`

**Use when:** Starting a brand new feature

**Example:**
```bash
/build Create a REST API for managing blog posts with CRUD operations
```

**What happens:**
1. Claude explores your codebase
2. Creates specification (you review and approve)
3. Creates technical design
4. Implements with code review and QA
5. Marks tasks complete as they pass verification

### `/iterate [spec-directory]`

**Use when:** Continuing or expanding existing work

**Examples:**
```bash
/iterate specs/001-blog-api/
/iterate 001
/iterate blog-api
/iterate              # Uses most recent spec
```

**What happens:**
1. Loads existing specifications
2. Assesses current state
3. Continues implementation or adds new features

## Project Setup

Create a `specs/` directory in your project root:

```bash
mkdir specs
```

That's it! The plugin handles everything else.

## Workflow Overview

### BUILD Workflow (New Features)
```
Your request → Exploration → Specification → Design → Implementation → Verification
```

### ITERATE Workflow (Existing Features)
```
Spec directory → Load & assess → Continue appropriate phase
```

## Quality Standards

The plugin enforces quality gates automatically:

- ✅ All code is reviewed for patterns and type safety
- ✅ Implementation matches specification requirements
- ✅ Tests maintain or improve coverage
- ✅ No duplicate code patterns introduced
- ✅ Type safety maximized (discriminated unions over optional fields)

## Examples

### Building a Feature

```bash
/build Add a user dashboard with activity metrics and CSV export
```

Claude creates:
- `specs/002-user-dashboard/feature.md` - Requirements like "FR-1: Display last 30 days of activity"
- `specs/002-user-dashboard/tech.md` - Tasks like "☐ DASH-1: Create metrics aggregation function"
- Implements each task with automated review and testing

### Expanding a Feature

```bash
/iterate specs/002-user-dashboard/
```

Tell Claude: "Add PDF export in addition to CSV"

Claude:
- Updates `feature.md` with new requirement
- Adds tasks to `tech.md`
- Implements the addition

## Success Metrics

Track your development effectiveness:

- **First-Time Pass Rate**: How often implementations pass QA initially
- **Specification Coverage**: Percentage of features with complete specs
- **Time to Implementation**: From idea to verified code
- **Technical Debt**: Items tracked and resolved

## Tips for Best Results

1. **Be specific** in your feature descriptions
2. **Review specifications** before implementation starts
3. **Let it complete** one task before interrupting
4. **Check the spec files** to understand what's being built
5. **Use `/iterate`** to resume work across sessions

## Troubleshooting

**Q: Where are my specifications?**
A: Check the `specs/` directory in your project root.

**Q: How do I know what's complete?**
A: Look at `tech.md` - tasks with `[x]` are done, `[ ]` are pending.

**Q: Can I edit specifications manually?**
A: Yes! Specs are living documents. Edit them and use `/iterate` to continue.

**Q: How do I start over?**
A: Just create a new spec with `/build` or edit existing specs and `/iterate`.

## Advanced Usage

Load the spec-architect skill directly for fine-grained control:

```bash
/spec-architect
```

Then manually guide Claude through specific workflow phases.

## Learn More

- **Spec Templates**: See `skills/spec-architect/references/SPEC_TEMPLATE.md`
- **Plugin Development**: See `CLAUDE.md` for maintainer documentation
- **Workflow Details**: Load the `spec-architect` skill to see complete workflow guidance

---

**Philosophy**: Write specifications before code. Review before testing. Verify against requirements. Build quality in from the start.
