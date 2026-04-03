# Langs Specification

**Status:** Implemented
**Last Updated:** 2026-04-03

## 1. Overview

### Purpose

Language-specific expertise plugin delivering opinionated coding patterns for React and TypeScript via persistent session skills, plus a PostToolUse hook that surfaces related test files when source code is read. Each language gets its own skill — loaded independently, updated independently — keeping token usage proportional to what the user actually needs.

### Goals

- Provide prescriptive (not advisory) language patterns as persistent session context
- Auto-detect TypeScript source file reads and suggest co-located test files
- Separate skill content (operational, concise) from reference material (comprehensive, on-demand)
- Support independent skill loading — users pay tokens only for languages they activate

### Non-Goals

- Auto-loading skills based on file type — skills are explicitly loaded by the user (or suggested by other plugins)
- Running or executing tests — the hook only surfaces test file paths, it does not run them
- Language detection or project analysis — no inference about which languages a project uses
- Cross-language patterns — each skill is self-contained with no inter-skill dependencies
- Linting, formatting, or automated code fixes — skills are advisory context, not tooling

## 2. Architecture

### Component Map

```
plugins/langs/
├── .claude-plugin/plugin.json          # Plugin manifest (name, description, keywords)
├── hooks/
│   ├── hooks.json                      # Hook registration (Setup + PostToolUse)
│   ├── package.json                    # Hook dependencies (SDK types only)
│   └── test-file-suggest.ts            # Test file detection hook
└── skills/
    ├── lang-react/
    │   └── SKILL.md                    # React patterns (~136 lines)
    └── lang-typescript/
        ├── SKILL.md                    # TypeScript patterns (~229 lines)
        └── references/
            └── best-practices-2025.md  # Comprehensive TS reference (~2062 lines)
```

### Two-Tier Knowledge Architecture

```
SKILL.md (Active Context — loaded into session)
    ↓ cites on demand
    └── references/best-practices-2025.md  (Deep-dive — read when needed)
```

React has no reference tier — the skill is self-contained. TypeScript uses a two-tier split: SKILL.md covers 80/20 patterns (~229 lines); the reference provides exhaustive coverage of advanced types, configuration, and modern features (~2062 lines) but is never auto-loaded.

### Data Flow: Test File Hook

1. User calls Read tool on any file
2. PostToolUse hook fires (matcher: `Read`)
3. Hook reads `PostToolUseHookInput` from stdin
4. Filters: only `.ts`/`.tsx` files, excludes test files themselves (`.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`)
5. Searches same directory for four test file patterns: `{name}.test.ts`, `{name}.test.tsx`, `{name}.spec.ts`, `{name}.spec.tsx`
6. If found: outputs `SyncHookJSONOutput` with `additionalContext` containing XML suggestion
7. If not found or not applicable: exits 0 silently (no output)

### Hook Output Format

```xml
<plugin-langs-suggestion>
Source file: {filePath}

Related test file(s):
  → {testPath1}
  → {testPath2}
</plugin-langs-suggestion>
```

## 3. Interfaces

### User-Facing Entry Points

| Entry Point | Type | Invocation |
|---|---|---|
| `lang-react` | Skill | `/skill lang-react` |
| `lang-typescript` | Skill | `/skill lang-typescript` |
| Test file suggestion | Hook | Fires automatically on Read of `.ts`/`.tsx` files |

### Plugin Registration

Marketplace entry (`.claude-plugin/marketplace.json`):
```json
{
  "name": "langs",
  "version": "1.0.1",
  "source": "./plugins/langs",
  "category": "development-tools"
}
```

### Setup Hook

`hooks.json` registers a Setup hook (`matcher: "init"`) that runs `bun install` in the hooks directory (30-second timeout for PostToolUse, 120-second timeout for Setup).

### Dependencies

| Package | Location | Purpose |
|---|---|---|
| `@anthropic-ai/claude-agent-sdk` | `hooks/package.json` (dev) | `PostToolUseHookInput` and `SyncHookJSONOutput` types |
| `@types/bun` | `hooks/package.json` (dev) | Bun runtime type definitions |

No runtime dependencies. No shared library dependency (unlike doc-writer, this plugin does not use session cache).

## 4. Skill Content Summary

### lang-react

Core philosophy: components are declarative UI consuming external state. Logic lives in stores, not components.

| State Type | Solution |
|---|---|
| Remote (REST) | TanStack Query |
| Remote (GraphQL) | Apollo Client |
| Application state | Zustand |
| Complex machines | XState |
| Local UI state | `useState` (rare, last resort) |

Component pattern: external hooks → early returns → JSX. Testing strategy: unit-test stores/machines with Vitest, E2E critical flows with Playwright, never test components directly.

Additional patterns: prop ordering (simple → complex), inline props for type inference, pattern matching via ts-pattern, profile-first performance, consolidated styled-components.

### lang-typescript

Core workflow: type decision tree → state modeling → validation → configuration → code organization.

Key stances: `interface` for object shapes, `type` for unions/primitives; `unknown` over `any`; discriminated unions for state machines; branded types for domain safety; avoid barrel files for internal code; always validate external data at runtime (Zod/type guards).

Configuration baseline: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `moduleResolution: "bundler"`.

Reference material (`best-practices-2025.md`) covers: advanced type patterns, conditional/mapped types, generics, utility types, type narrowing, modern TS 5.x features, Zod, template literal types, satisfies operator.

## 5. Design Decisions

- **Separate skills per language**: Users load only what they need — a React-only project doesn't pay for TypeScript context. Skills can be updated independently without affecting each other. Alternative considered: single combined skill (rejected — too many tokens for partial relevance).
- **Opinionated over comprehensive**: Skills give clear recommendations ("use Zustand", "avoid barrel files") rather than surveying options. This matches the plugin's role as expert guidance, not documentation.
- **Reference tier for TypeScript only**: React patterns fit in ~136 lines. TypeScript's type system depth requires a separate ~2062-line reference for advanced topics. Keeping this separate preserves token efficiency while enabling depth.
- **No session cache in hook**: Unlike doc-writer's once-per-session suggestion, the test file hook fires on every Read of a source file. This is appropriate because test file suggestions are small, contextual, and non-repetitive (different source file = different suggestion).
- **Same-directory test search only**: The hook searches for test files co-located with the source file. It does not search `__tests__/` directories or other conventional test locations. This is a deliberate simplicity choice — co-located tests are the target convention.
- **Silent exit for non-matches**: The hook exits 0 with no output for non-TypeScript files, test files, or files without co-located tests. This keeps context clean.

## 6. Open Questions

- **Additional language skills**: The plugin is designed for extension (one skill per language) but currently only covers React and TypeScript. No mechanism signals which languages a project uses — skill loading is fully manual.
- **Test directory conventions**: The hook only finds co-located test files. Projects using `__tests__/` directories or other structures won't get suggestions. Expanding search patterns would add complexity and latency.
- **Reference staleness**: `best-practices-2025.md` cites 2024-2025 sources. No mechanism flags when content becomes outdated as TypeScript evolves.
