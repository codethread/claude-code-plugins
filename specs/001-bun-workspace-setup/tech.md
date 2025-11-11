# Bun Workspace Setup - Implementation Guide

User Sign off: [REQUIRED - DO NOT BUILD WITHOUT THIS]

## Implementation Context

### What We're Building

Converting the Claude Code plugin marketplace from scattered package.json files to a unified Bun workspace with centralized dependency management and quality tooling (FR-1 through FR-6 from feature.md).

### Why This Approach

**Bun workspaces** provide zero-config monorepo support with excellent TypeScript handling. The repository already uses Bun as its runtime, making this a natural fit. Benefits:
- Native TypeScript support (no build step required)
- Fast installs and workspace resolution
- Simple workspace glob patterns
- Works seamlessly with existing shebang patterns (`#!/usr/bin/env bun`)

**Biome for tooling** because it's fast (Rust-based), zero-config, and consolidates linting + formatting in one tool.

## Discovery Findings

### Similar Implementations

**Pattern: ES Module Package Configuration**
- Implementation: `plugins/claude-code-knowledge/hooks/package.json:5:5`
- All existing package.json files use `"type": "module"`
- Must preserve this in root package.json for ESM support

**Pattern: Bun Script Execution**
- Implementation: `plugins/claude-code-knowledge/hooks/package.json:6:8`
- Scripts use `bun <file>.ts` pattern for direct TypeScript execution
- Example: `"test": "bun claude-code-prompt.ts"`
- Continue this pattern in root scripts

**Pattern: TypeScript Import Statements**
- Implementation: `plugins/claude-code-knowledge/hooks/sync-docs-on-skill-load.ts:17:22`
- Uses standard Node.js ESM imports: `import { existsSync } from 'fs'`
- Uses external deps: `import { XMLParser } from 'fast-xml-parser'`
- No special Bun APIs required (portable code)

### Key Integration Points

**Hook Scripts That Need Dependencies**:
- `plugins/claude-code-knowledge/hooks/sync-docs-on-skill-load.ts:20:20`
  - Imports: `XMLParser` from `fast-xml-parser`
  - Purpose: Parses sitemap XML from docs.anthropic.com
  - Critical: Must resolve after workspace setup

- `plugins/claude-code-knowledge/skills/claude-code-knowledge/scripts/*.ts`
  - Some scripts also use `fast-xml-parser`
  - Purpose: Documentation management utilities

**Hook Scripts With No External Dependencies**:
- `plugins/doc-writer/hooks/doc-writer-suggest.ts`
- `plugins/langs/hooks/test-file-suggest.ts`
- `plugins/claude-code-knowledge/hooks/claude-code-prompt.ts`
- These use only Node.js built-ins (fs, path, os, crypto)

### Constraints & Gotchas

- **ES Modules Only**: All code uses `type: "module"`, don't break this
- **Bun Shebang Lines**: Scripts have `#!/usr/bin/env bun`, workspace must not interfere
- **Hook Execution Model**: Hooks read JSON from stdin and write JSON to stdout - workspace must not affect this
- **No Build Step**: Scripts execute directly with Bun, must not introduce compilation requirements
- **Plugin Isolation**: Each plugin should remain independently distributable (marketplace model)

## Technology Decisions

### Workspace Pattern

**Options Considered:**
- **Option A: Glob Pattern Workspaces**
  - Pattern: `"workspaces": ["plugins/*/hooks", "plugins/*/skills/*/scripts"]`
  - Pros: Declarative, automatic discovery of new plugins, no maintenance
  - Cons: Creates workspace for every matching directory (even empty ones)

- **Option B: Explicit Path Workspaces**
  - Pattern: `"workspaces": ["plugins/claude-code-knowledge/hooks", ...]`
  - Pros: Explicit control, only configured directories
  - Cons: Must update for every new plugin

**Selected: Option A (Glob Pattern)**
- Rationale: Aligns with marketplace model where plugins can be added dynamically
- Documentation: [Bun Workspaces](https://bun.sh/docs/install/workspaces)
- Simpler for users adding new plugins to the marketplace

### Linting & Formatting Tool

**Options Considered:**
- **Option A: ESLint + Prettier**
  - Pros: Industry standard, extensive plugins
  - Cons: Two tools, slower, complex configuration

- **Option B: Biome**
  - Pros: Single tool, fast (Rust), minimal config, good TypeScript support
  - Cons: Newer tool, smaller ecosystem

**Selected: Option B (Biome)**
- Rationale: Speed and simplicity align with Bun philosophy, excellent TypeScript support
- Documentation: [Biome Configuration](https://biomejs.dev/reference/configuration/)
- Zero-config approach reduces maintenance burden

### Dependency Consolidation

**Decision: Root-Level Dependencies**

All production dependencies move to root `package.json`. Individual plugin package.json files can be removed entirely since Bun workspaces provide dependency resolution to all workspace members.

**Rationale:**
- Single source of truth for versions
- Deduplication by default
- Simpler dependency updates
- Node.js/Bun module resolution automatically walks up to find node_modules

## File Map

### Files to Create

- `package.json:1:1` - Root workspace configuration with dependencies and scripts
- `tsconfig.json:1:1` - TypeScript configuration for type checking
- `biome.json:1:1` - Biome linter/formatter configuration
- `.gitignore:1:1` (update) - Add `node_modules/` at root if not present

### Files to Remove

- `plugins/claude-code-knowledge/hooks/package.json:1:12` - Dependencies move to root
- `plugins/claude-code-knowledge/skills/claude-code-knowledge/scripts/package.json:1:9` - Dependencies move to root
- `plugins/doc-writer/hooks/package.json:1:11` - Can be removed (no dependencies)
- `plugins/langs/hooks/package.json:1:11` - Can be removed (no dependencies)
- Associated `node_modules/` directories in plugin subdirectories
- Associated `bun.lockb` files in plugin subdirectories

### Files to Reference

- `plugins/claude-code-knowledge/hooks/package.json` - Example of current package.json structure
- `plugins/claude-code-knowledge/hooks/sync-docs-on-skill-load.ts:1:50` - TypeScript import patterns to verify

## Component Architecture

### Component: Root Workspace Configuration

**Responsibility**: Define workspace structure, consolidated dependencies, and quality scripts

**Interfaces With:**
- Uses: Bun workspace resolution (built-in)
- Provides: Shared dependencies to all workspace members via node_modules hoisting

**Key Constraints:**
- Must use `"type": "module"` for ESM support (NFR-1)
- Workspaces pattern must match existing directory structure
- No breaking changes to hook script execution

**Testing Approach:**
- Manual: Run `bun install` and verify single node_modules at root
- Manual: Execute sample hook script to verify dependency resolution
- Integration: Run each hook script with test input

### Component: TypeScript Configuration

**Responsibility**: Enable type checking across all TypeScript files without requiring compilation

**Interfaces With:**
- Uses: TypeScript compiler API (tsc) for type checking only
- Provides: Type safety validation via `bun run typecheck` script

**Key Constraints:**
- Must target ESNext/ESNext modules (Bun runtime) (NFR-3)
- No emit (no compilation) - Bun handles execution
- Include all TypeScript files in plugins directory

**Testing Approach:**
- Run `bun run typecheck` on current codebase
- Verify all existing TypeScript files type check successfully
- No new type errors introduced

### Component: Biome Configuration

**Responsibility**: Establish linting and formatting infrastructure and ensure code quality

**Interfaces With:**
- Uses: Biome CLI for linting and formatting
- Provides: Code quality checks via `bun run lint` and `bun run format` scripts

**Key Constraints:**
- Must support TypeScript syntax (NFR-3)
- Configuration enforces code standards and all code must pass (NFR-3)
- Performance: Should complete checks in <30 seconds (NFR-2)

**Testing Approach:**
- Run `bun run lint` on current codebase - should pass with 0 errors
- Run `bun run format` - should complete successfully
- All TypeScript files meet quality standards

## Implementation Tasks

### Component: Root Workspace

Location: `/Users/codethread/dev/learn/claude-plugins`

- [x] **WORKSPACE-1**: Create root package.json with workspace configuration (delivers FR-1, FR-2) [TESTABLE]
  - Create: `package.json:1:1`
  - Include fields: `name`, `version`, `private: true`, `type: "module"`, `workspaces`, `scripts`, `dependencies`, `devDependencies`
  - Workspace globs: `["plugins/*/hooks", "plugins/*/skills/*/scripts"]`
  - Dependencies: `fast-xml-parser` at latest stable version
  - DevDependencies: `@biomejs/biome`, `typescript`
  - Scripts: `check`, `lint`, `format`, `typecheck`
  - Test: Run `bun install` and verify node_modules created at root

- [x] **WORKSPACE-2**: Remove individual plugin package.json files (delivers FR-2) [TESTABLE]
  - Remove: `plugins/claude-code-knowledge/hooks/package.json`
  - Remove: `plugins/claude-code-knowledge/skills/claude-code-knowledge/scripts/package.json`
  - Remove: `plugins/doc-writer/hooks/package.json`
  - Remove: `plugins/langs/hooks/package.json`
  - Remove associated node_modules and bun.lockb in subdirectories
  - Test: Verify no package.json files remain in plugin subdirectories except root

- [x] **WORKSPACE-3**: Verify hook scripts resolve dependencies (delivers NFR-1) [TESTABLE]
  - Test: Execute `plugins/claude-code-knowledge/hooks/sync-docs-on-skill-load.ts` with sample input
  - Verify XMLParser import resolves from root node_modules
  - Test other hook scripts to ensure no regressions
  - Test: All existing hook scripts execute without errors

### Component: TypeScript Configuration

Location: `/Users/codethread/dev/learn/claude-plugins`

- [x] **TS-1**: Create tsconfig.json for type checking (delivers FR-3) [TESTABLE]
  - Create: `tsconfig.json:1:1`
  - Settings: `module: "ESNext"`, `target: "ESNext"`, `moduleResolution: "bundler"`
  - Settings: `noEmit: true` (no compilation)
  - Include: `plugins/**/*.ts`
  - Lib: `["ESNext"]`
  - Test: Run `bun tsc --noEmit` and verify it completes

- [x] **TS-2**: Add typecheck script to package.json (delivers FR-3) [TESTABLE]
  - Modify: `package.json` scripts section
  - Add: `"typecheck": "tsc --noEmit"`
  - Test: Run `bun run typecheck` and verify no type errors on existing code

### Component: Biome Configuration [TEST AFTER COMPONENT]

Location: `/Users/codethread/dev/learn/claude-plugins`

- [x] **BIOME-1**: Create biome.json configuration (delivers FR-4)
  - Create: `biome.json:1:1`
  - Configure formatter with indent style, line width
  - Configure linter with recommended rules
  - Include: `plugins/**/*.ts`

- [x] **BIOME-2**: Add quality scripts to package.json (delivers FR-4, FR-5)
  - Modify: `package.json` scripts section
  - Add: `"lint": "biome check ."`
  - Add: `"format": "biome format ."`
  - Add: `"check": "bun run typecheck && bun run lint"`
  - Fix any lint issues reported to ensure all scripts pass

Note: Test BIOME-1 and BIOME-2 together after both are implemented. All quality scripts should pass with 0 errors. Initial lint issues (4 total) were resolved: replaced forEach with for...of, replaced `any` types with proper types (`unknown` with type guards, defined `SitemapUrlEntry` interface).

### Component: Documentation Update

Location: `/Users/codethread/dev/learn/claude-plugins`

- [x] **DOCS-1**: Update README.md installation instructions (delivers FR-6) [TESTABLE]
  - Modify: `README.md:22:41` (Installation section)
  - Update to include `bun install` step after marketplace installation
  - Add note about quality scripts for contributors
  - Test: Review updated README for clarity and completeness

## Testing Guidance

### Testing Setup

See feature.md "Testing Setup" section for detailed system startup, environment requirements, test data, access points, and cleanup procedures.

**Quick reference:**
```bash
# From repository root
bun install              # Install all dependencies
bun run check            # Run all quality checks
bun run lint             # Lint TypeScript files
bun run format           # Format TypeScript files
bun run typecheck        # Type check TypeScript files

# Test individual hook script
cd plugins/claude-code-knowledge/hooks
bun sync-docs-on-skill-load.ts < sample-input.json
```

### Testing Patterns to Follow

**Integration testing:**
- Pattern: Execute hook scripts with sample JSON input
- Focus: Verify imports resolve and scripts execute without errors
- Tools: `bun <script>.ts`, bash stdin redirection

**Quality checks:**
- Pattern: Run quality scripts on entire codebase
- Focus: Ensure all TypeScript files pass linting, formatting, and type checking
- Tools: `bun run check`, `bun run lint`, `bun run format`, `bun run typecheck`

### Testing Tools Available

- **Bun CLI**: Direct TypeScript execution (`bun <file>.ts`)
- **TypeScript Compiler**: Type checking only (`tsc --noEmit`)
- **Biome CLI**: Linting and formatting (`biome check`, `biome format`)
- **Bash**: Shell commands for testing hook scripts with stdin/stdout

## Implementation Notes

### Discovered During Planning

**Node Module Resolution**:
- Bun and Node.js walk up directory tree to find node_modules
- Workspace members automatically resolve dependencies from root node_modules
- No special configuration needed for imports to work across workspace

**Bun Workspace Behavior**:
- Bun automatically detects `workspaces` field in package.json
- All workspace members share root node_modules
- Lock file (bun.lockb) created at root manages all dependencies
- Individual workspace members don't need their own package.json if they have no unique dependencies

**TypeScript Execution**:
- Bun executes TypeScript directly without compilation
- TypeScript configuration only needed for type checking (IDE + CI)
- `tsc --noEmit` validates types without generating JavaScript

**Fast-XML-Parser Versions**:
- Currently: 4.3.2 (hooks) and 4.3.4 (scripts)
- Consolidate to: Latest stable (likely 4.5.x or 4.6.x as of 2025)
- Check npm for latest: `npm view fast-xml-parser version`

### Migration Strategy

This is an **internal refactoring** with no public API changes.

**Migration steps:**
1. Create root configurations (package.json, tsconfig.json, biome.json)
2. Run `bun install` to establish workspace
3. Verify hook scripts still execute
4. Remove old package.json files
5. Run quality checks to validate
6. Update documentation

**Rollback plan**: If issues arise, git revert returns to scattered package.json model.

### Performance Considerations

**NFR-2 Targets:**
- `bun install`: <10 seconds (typically 2-5 seconds with Bun's speed)
- `bun run check`: <30 seconds (Biome is fast, TypeScript check takes most time)

**Validation:**
- Time each command during implementation
- If typecheck >30s, consider narrowing include patterns in tsconfig.json

### Security Considerations

- No security changes - same dependencies, same code execution model
- Lock file (bun.lockb) ensures reproducible installs
- Biome may catch potential security issues (e.g., unused variables, suspicious patterns)

## References

### External Documentation

- **Bun Workspaces**: https://bun.sh/docs/install/workspaces
- **Biome Configuration**: https://biomejs.dev/reference/configuration/
- **TypeScript Configuration**: https://www.typescriptlang.org/tsconfig
- **fast-xml-parser**: https://github.com/NaturalIntelligence/fast-xml-parser

### Related Specifications

None - this is the first specification in this repository.

## Technical Debt Considerations

This migration reduces technical debt:

**Reduced Debt:**
- Eliminates duplicate dependencies
- Adds quality tooling that was missing
- Simplifies maintenance with unified configuration
- All code now passes linting and type checking standards

**Issues Fixed:**
- 4 Biome lint issues resolved during implementation:
  - Replaced `forEach` with `for...of` loop (noForEach)
  - Replaced `any` types with proper types (noExplicitAny):
    - Used `unknown` with type guards for safer dynamic typing
    - Defined `SitemapUrlEntry` interface for XML sitemap structure

## Dependencies and Prerequisites

**Required:**
- Bun runtime (already installed and in use)
- Git repository (already initialized)
- Existing TypeScript files (10 files confirmed)

**New Dependencies to Add:**
- `@biomejs/biome` (dev dependency)
- `typescript` (dev dependency)

**Existing Dependencies to Consolidate:**
- `fast-xml-parser` (currently scattered, will centralize)

## Regressions or Missed Requirements

None found

<!-- Section for documenting missed requirements discovered during implementation and their resolution, with the intention being to prevent future mistakes -->
