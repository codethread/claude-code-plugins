---
name: migrate
description: Incrementally migrate an existing project toward the BDFL architecture
allowed-tools: Bash, Write, Edit, Read, Glob, Grep, EnterPlanMode
---

# BDFL Migrate

Analyse an existing project and propose the next incremental migration step toward the BDFL architecture.

## Architecture

Load and follow the full architecture specification:

- [Architecture Reference](./references/architecture.md)

## Instructions

1. Read the architecture reference above in full
2. Analyse the current project to build an inventory:
   - Package manager (npm, yarn, bun, pnpm?)
   - Runtime and version pinning approach
   - TypeScript configuration and strictness level
   - Formatter (Prettier, Biome, none?)
   - Linter (Biome, ESLint, TSLint, none?)
   - Test runner (Jest, Vitest, Mocha?)
   - Build tool (Webpack, Vite, esbuild, tsc?)
   - Key libraries and frameworks in use
   - Containerisation setup (Docker, Podman, none?)
   - Claude Code hooks (present? what do they do?)
3. Compare the inventory against the architecture reference and produce a **gap list** — everything that differs from the target architecture, ordered from easiest to hardest migration:
   - Easiest: tool swaps with drop-in replacements (e.g. Prettier → oxfmt)
   - Medium: config changes (e.g. loosening/tightening tsconfig)
   - Hardest: library migrations (e.g. introducing Effect.ts)
4. Present the gap list to the user as a concise summary
5. Select the **single easiest migration** from the gap list and enter plan mode with a concrete migration plan:
   - What changes
   - What files are affected
   - What commands to run
   - How to verify the migration succeeded
6. After the user approves the plan, execute it
7. Run the project's verify/test command to confirm nothing is broken
8. Inform the user they can re-run `/bdfl:migrate` to tackle the next gap
