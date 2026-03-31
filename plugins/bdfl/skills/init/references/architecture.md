# BDFL Architecture Reference

The canonical specification for a BDFL-certified project. This document describes the **target state** — what a compliant project looks like when fully migrated.

## Runtime & Package Management

- **Runtime**: Node.js (LTS)
- **Package manager**: pnpm
- **Version pinning**: Volta (pin node + pnpm versions in `package.json`)

## Language

- **TypeScript** with the strictest configuration:
  - `strict: true`
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - `verbatimModuleSyntax: true`

## Core Library

- **Effect.ts** and its ecosystem (`@effect/*`) as the primary library for:
  - Error handling, concurrency, dependency injection, schema validation, HTTP, configuration
- Only reach for alternatives when Effect does not provide the capability

## Components (as needed)

| Domain | Technology |
|--------|-----------|
| Web | React |
| Mobile | React Native via Expo |
| Server | `@effect/platform` built-in HTTP server |

## Build & Test

- **Build tool**: Vite
- **Test runner**: Vitest
  - **Exception**: Expo React Native projects use `jest` with `jest-expo`

## Project Tooling

- **Type-checking**: `@typescript/native-preview` (`tsgo --noEmit`)
- **Linting**: ESLint + typescript-eslint (flat config `eslint.config.ts`)
  - Strict TypeScript settings and recommended rule presets
  - Component-specific plugins (e.g. `eslint-plugin-react`, `eslint-plugin-react-hooks`)
  - `eslint-rules/` directory at project root for bespoke custom rules
- **Formatting**: oxfmt (no Prettier)

### Standard Scripts

```jsonc
{
  "scripts": {
    "typecheck": "tsgo --noEmit",
    "lint": "eslint --fix .",
    "format": "oxfmt --write .",
    "test": "vitest run",
    "build": "vite build",
    "verify": "pnpm typecheck && pnpm lint && pnpm test && pnpm format"
  }
}
```

`verify` runs all checks, with formatting **always last**.

## Containerisation

- `Dockerfile` with appropriate ingress, volume mounts for source code, suitable for development inside the container
- `./dev.sh` to invoke the container via **Podman**

## NixOS

- `flake.nix` providing a dev shell with all required binaries
- All scripts and hooks work inside the nix dev shell

## Claude Code Hooks

### Refined (per-file)

- **PostToolUse** on `Edit|Write`: run `oxfmt --write` on the changed file
- **PostToolUse** on `Edit|Write`: run `eslint --fix` on the changed file

### Verification (per-stop)

- **Stop** and **SubagentStop**: run `pnpm verify`

### Git

- **Pre-commit**: run `pnpm verify`

## Monorepo (if applicable)

- pnpm workspaces
- Root `package.json` with workspace configuration
- Shared `tsconfig.base.json` with project references
- Root `verify` script that runs verification across all workspaces
