# Bun Workspace Setup for Claude Code Plugin Marketplace

<!-- This is a **living document**, it can and should be updated as implementation reveals insights requiring spec updates. These should be validated with the architect and user  -->

User Sign off: [REQUIRED - DO NOT BUILD WITHOUT THIS]

## Context and Problem Statement

Currently, the Claude Code plugin marketplace repository has multiple package.json files scattered across different plugin directories (4 separate package.json files in hooks and scripts directories). Each plugin area manages its own dependencies independently, requiring separate `bun install` commands in multiple locations. This creates several issues:

- **Fragmented dependency management**: Same dependencies (e.g., fast-xml-parser) are duplicated with different versions (4.3.2 vs 4.3.4)
- **Complex setup**: Users must navigate to multiple directories and run install commands separately
- **No standardized tooling**: No unified linting, formatting, or type-checking across the TypeScript codebase
- **Maintenance overhead**: Updating shared dependencies requires changes in multiple locations

## Value Statement

Converting to a Bun workspace will:

- **Simplify installation**: Single `bun install` command at the root installs all dependencies for all plugins
- **Deduplicate dependencies**: Shared dependencies (fast-xml-parser) managed in one place with consistent versions
- **Enable quality tooling**: Centralized Biome for linting/formatting and TypeScript for type-checking across all scripts
- **Improve maintainability**: Standardized scripts for quality checks before publishing updates
- **Better documentation**: Clear, simple installation instructions in README

## Stakeholders

- **Users**: Developers installing this marketplace who want simple setup instructions
- **Maintainers**: Repository maintainers who need consistent tooling for quality assurance
- **Plugin Authors**: Contributors adding new plugins who benefit from standardized patterns

## Technical Architecture

```
claude-plugins/                    # Root workspace
├── package.json                   # Root package.json with workspaces config
├── tsconfig.json                  # Shared TypeScript configuration
├── biome.json                     # Biome linter/formatter config
├── bun.lockb                      # Single lock file for all dependencies
└── plugins/
    ├── claude-code-knowledge/
    │   ├── hooks/
    │   │   └── *.ts               # Scripts use root dependencies
    │   └── skills/*/scripts/
    │       └── *.ts               # Scripts use root dependencies
    ├── doc-writer/
    │   └── hooks/
    │       └── *.ts               # Scripts use root dependencies
    └── langs/
        └── hooks/
            └── *.ts               # Scripts use root dependencies
```

**Key Architectural Decisions:**

1. **Bun Workspaces**: Use Bun's built-in workspace feature to manage multiple packages
2. **Centralized Dependencies**: All runtime dependencies in root package.json
3. **Unified Dev Tooling**: Biome for linting/formatting, TypeScript for type checking
4. **No Build Step**: Continue leveraging Bun's native TypeScript execution
5. **Preserve Plugin Structure**: No changes to plugin directory structure or hook files

## Functional Requirements

### FR-1: Bun Workspace Configuration

The repository SHALL be configured as a Bun workspace with all plugin TypeScript scripts as workspace members.

**Acceptance Criteria:**
- Root package.json has `workspaces` field configured
- All existing TypeScript scripts remain in their current locations
- Single `bun install` at root installs all dependencies
- Dependencies are deduplicated (fast-xml-parser appears only once)

### FR-2: Consolidated Dependencies

All runtime dependencies SHALL be managed in the root package.json.

**Acceptance Criteria:**
- fast-xml-parser dependency exists in root package.json at latest stable version
- Individual plugin package.json files are removed or minimized
- All TypeScript scripts can successfully import their required dependencies
- No duplicate node_modules directories in plugin subdirectories

### FR-3: Unified TypeScript Configuration

A single TypeScript configuration SHALL provide type checking for all TypeScript files.

**Acceptance Criteria:**
- tsconfig.json exists at repository root
- Configuration supports ES modules (`"module": "ESNext"` or similar)
- Configuration targets Node.js/Bun runtime
- Type checking script in root package.json runs successfully
- All TypeScript files pass type checking without errors

### FR-4: Biome Integration

Biome SHALL be configured for consistent linting and formatting across all TypeScript files.

**Acceptance Criteria:**
- biome.json configuration file exists at root
- Configuration enforces consistent code style
- Lint script in root package.json runs successfully with zero errors
- Format script in root package.json is available
- All TypeScript files pass linting without errors
- Configuration follows Biome best practices for TypeScript/Node.js projects

### FR-5: Quality Assurance Scripts

Root package.json SHALL provide scripts for quality assurance checks.

**Acceptance Criteria:**
- `bun run check` script runs all quality checks (lint + typecheck) and passes without errors
- `bun run format` script available for checking formatting
- `bun run lint` script lints all TypeScript files and passes without errors
- `bun run typecheck` script validates TypeScript types and passes without errors
- All scripts execute successfully (exit code 0)
- Scripts use appropriate file glob patterns to target only relevant files

### FR-6: Updated Documentation

README.md SHALL be updated with simplified installation instructions.

**Acceptance Criteria:**
- Installation section includes `bun install` instruction
- Instructions note that users should run `bun install` after marketplace installation
- Documentation is clear and concise
- Example workflow shows the simplified setup process
- Mentions quality scripts available for contributors

## Non-Functional Requirements

### NFR-1: Zero Breaking Changes

The workspace migration SHALL NOT break existing plugin functionality.

**Acceptance Criteria:**
- All existing TypeScript hook scripts execute successfully after migration
- Hook scripts can resolve their dependencies (fs, path, fast-xml-parser, etc.)
- No changes required to plugin manifests or Claude Code configuration
- Existing plugin behavior is preserved exactly

### NFR-2: Performance

Dependency installation and quality checks SHALL complete in reasonable time.

**Acceptance Criteria:**
- `bun install` completes in under 10 seconds
- `bun run check` (lint + typecheck) completes in under 30 seconds
- No performance degradation in hook script execution

### NFR-3: Maintainability

Configuration SHALL be clear and follow Bun/Biome/TypeScript best practices.

**Acceptance Criteria:**
- Configuration files include comments explaining key settings
- Follows official Bun workspace patterns
- Biome configuration aligns with recommended TypeScript settings
- TypeScript config appropriate for ESM + Bun runtime

## External Dependencies

### Validated Dependencies

**Bun Runtime:**
- Version: Latest stable (already in use)
- Purpose: Runtime, package manager, workspace orchestrator
- Status: ✅ Already used throughout the codebase

**fast-xml-parser:**
- Current versions: 4.3.2 and 4.3.4 (duplicate)
- Purpose: XML parsing for documentation sync
- Migration: Consolidate to single latest stable version

**Biome (New):**
- Purpose: Linting and formatting
- Rationale: Fast, zero-config alternative to ESLint + Prettier, written in Rust
- Status: ⚠️ New dependency to add

**TypeScript (New Dev Dependency):**
- Purpose: Type checking (no compilation, Bun handles that)
- Status: ⚠️ New dev dependency to add

## Interface Definitions

### Root package.json Structure

```json
{
  "name": "claude-code-plugins",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "workspaces": ["plugins/*/hooks", "plugins/*/skills/*/scripts"],
  "scripts": {
    "check": "...",
    "lint": "...",
    "format": "...",
    "typecheck": "..."
  },
  "dependencies": {
    "fast-xml-parser": "^4.x.x"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.x.x",
    "typescript": "^5.x.x"
  }
}
```

### TypeScript Import Patterns (Unchanged)

```typescript
// Node.js built-ins (continue to work)
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";

// External dependencies (resolved from root node_modules)
import { XMLParser } from "fast-xml-parser";
```

## Testing Setup

### System Startup

This is a repository-level migration, not a runtime application. Testing involves verifying scripts and tooling.

```bash
# Navigate to repository root
cd /Users/codethread/dev/learn/claude-plugins

# Install dependencies (test FR-1, FR-2)
bun install

# Run quality checks (test FR-5)
bun run check
bun run lint
bun run format
bun run typecheck
```

### Environment Requirements

- **Bun installed**: `bun --version` should work
- **Git repository**: Existing repository structure
- **Existing TypeScript files**: 10 TypeScript files across plugins

### Test Data Setup

No test data required - working with existing codebase.

### Access Points

- **Repository root**: `/Users/codethread/dev/learn/claude-plugins`
- **TypeScript files**: Distributed across `plugins/*/hooks/*.ts` and `plugins/*/skills/*/scripts/*.ts`
- **Configuration files**: Root-level `package.json`, `tsconfig.json`, `biome.json`

### Cleanup / Shutdown

No cleanup required. This is a one-time migration with file system changes.

### Testing Tools Available

- **Manual script execution**: Run TypeScript files with `bun <file>.ts`
- **Read tool**: Verify file contents after changes
- **Bash tool**: Run quality scripts and verify output
- **Git diff**: Compare before/after changes

## Acceptance Criteria

### Overall Success Criteria

1. ✅ Single `bun install` at root installs all dependencies
2. ✅ All existing TypeScript hook scripts execute without errors
3. ✅ `bun run check` passes on entire codebase
4. ✅ README.md updated with simplified installation instructions
5. ✅ No duplicate dependencies or node_modules directories
6. ✅ All configuration files valid and commented

### Verification Steps

```bash
# 1. Verify installation
cd /Users/codethread/dev/learn/claude-plugins
bun install
ls -la plugins/*/hooks/node_modules  # Should not exist
ls -la node_modules/fast-xml-parser  # Should exist

# 2. Verify hook scripts still work
bun plugins/claude-code-knowledge/hooks/sync-docs-on-skill-load.ts < test-input.json
bun plugins/doc-writer/hooks/doc-writer-suggest.ts < test-input.json

# 3. Verify quality tooling
bun run typecheck  # Should pass
bun run lint       # Should pass
bun run format     # Should complete successfully
bun run check      # Should pass all checks

# 4. Verify no regressions
# All hooks should function identically to before migration
```

## Implementation Notes

### Migration Strategy

This is a **backward-compatible migration** - no public APIs are affected. The migration involves:

1. **File system changes**: Add root configs, remove duplicate package.json files
2. **Dependency consolidation**: Move dependencies to root package.json
3. **Tooling addition**: Add Biome and TypeScript configs
4. **Documentation update**: Simplify README installation section

### Key Constraints

- **Preserve hook functionality**: Hooks are critical to plugin operation
- **ES modules**: All code uses `type: "module"`, configs must respect this
- **Bun runtime**: Leverage Bun's native TypeScript support, no compilation needed
- **No structural changes**: Plugin directory structure remains unchanged

### Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Hook scripts fail to resolve dependencies | Test each hook script after migration |
| Workspace glob patterns miss some scripts | Verify node_modules accessible from all script locations |
| Biome config too strict for existing code | Start with lenient config, tighten gradually |
| TypeScript config incompatible with Bun | Use Bun-recommended TypeScript settings |

## Technical Debt Tracking

None introduced - this migration reduces technical debt by consolidating dependencies and adding quality tooling.
