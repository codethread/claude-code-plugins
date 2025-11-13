# Project Configuration

## General Instructions

**Example:**
- This is a developer tool - breaking changes are acceptable as users always use the latest version
- Code should prioritize clarity over clever optimizations
- All error messages should be actionable and include next steps
- Dependencies should be kept minimal

## Architect Instructions

**Example:**
- Focus on incremental delivery - each spec should be independently deployable
- Breaking changes to PUBLIC APIs require explicit migration strategy documentation
- Internal APIs can be refactored freely without migration guides
- Prefer composition over inheritance when designing component relationships

## Developer Agent Instructions

**Example:**
- Always run tests after completing work: `yarn test <files-changed>`
- Use the project's logger (don't use console.log directly): `import { logger } from '@/lib/logger'`
- Follow the project's error handling pattern (see `src/lib/errors.ts`)
- New API endpoints must include OpenAPI documentation comments

## Reviewer Agent Instructions

**Example:**
- Check for proper error handling - all async operations must have error boundaries
- Verify type safety - no `any` types without explicit justification comments
- Ensure test coverage for edge cases, not just happy paths
- Look for security issues: SQL injection, XSS, CSRF vulnerabilities

## Tester Agent Instructions

**Example:**
- Test with realistic data volumes (at least 1000 items for list operations)
- Verify mobile responsive design on viewport widths: 320px, 768px, 1024px
- Test error scenarios explicitly (network failures, invalid inputs, timeouts)
- Check browser console for errors during testing

---

## Version Metadata

**DO NOT EDIT THIS SECTION - It is used for template version tracking**

- **template_version**: 1.0.0
- **owner_version**: 1.0.0

### Version Field Descriptions

- **template_version**: The version of PROJECT_TEMPLATE.md that was used to generate this file. Updated only when you regenerate from a newer template or manually adopt changes from a newer template.
- **owner_version**: Your customization version. Increment this when you make significant changes to your PROJECT.md (e.g., 1.0.0 → 1.1.0 for additions, 2.0.0 for major restructuring). This helps track your project's configuration evolution separately from template updates.

### How Versioning Works

When you create a new PROJECT.md from this template:
1. Both `template_version` and `owner_version` start at the same value (the current template version)
2. When you customize PROJECT.md for your project, increment `owner_version`
3. When a new PROJECT_TEMPLATE.md is released, the architect can compare versions and offer to show you what's new
4. You can then decide which new features to adopt and update `template_version` accordingly

### Template Version History

**1.0.0** (2025-01-13)
- Initial versioned template
- Sections: General Instructions, Architect Instructions, Developer Agent Instructions, Reviewer Agent Instructions, Tester Agent Instructions
- Establishes version tracking system for template evolution
