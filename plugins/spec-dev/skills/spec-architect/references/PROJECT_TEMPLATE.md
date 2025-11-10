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
