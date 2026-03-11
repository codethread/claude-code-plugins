# BDFL Architecture Reference

The canonical technology choices and project structure for all projects managed under BDFL.

## Runtime & Package Management

- **Runtime**: Node.js (LTS)
- **Package manager**: pnpm
- **Version pinning**: Volta (pin node + pnpm versions in `package.json`)
- **Build tool**: Vite
- **Test runner**: Vitest
  - **Exception**: Expo React Native projects use `jest` with `jest-expo`

## Language

- **TypeScript** with extremely strict configuration:
  - `strict: true`
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - `verbatimModuleSyntax: true`

## Core Library

- **Effect.ts** and its ecosystem (`@effect/*`) as the primary library for:
  - Error handling, concurrency, dependency injection, schema validation, HTTP, configuration, etc.
- Only reach for alternatives when Effect does not provide the capability

## Components (as needed)

| Domain   | Technology                              |
|----------|-----------------------------------------|
| Web      | React                                   |
| Mobile   | React Native via Expo                   |
| Server   | `@effect/platform` built-in HTTP server |

## Containerisation

- Provide a `Dockerfile` with:
  - Appropriate ingress (exposed ports)
  - File sharing / volume mounts for source code
  - Suitable for Claude Code to develop inside the container
- Provide `./dev.sh` to invoke the container via **Podman**

## Project Tooling

### TypeScript Go (fast type-checking)

- Install `@typescript/native-preview`
- Add `typecheck` script in `package.json` running `tsgo --noEmit`

### Linting: ESLint + typescript-eslint

- Strict TypeScript settings and recommended rule presets
- Include recommended plugins based on the project's components (e.g. `eslint-plugin-react`, `eslint-plugin-react-hooks` for web)
- Create an `eslint-rules/` directory at the project root for bespoke custom rules
- Flat config format (`eslint.config.ts`)

### Formatting: oxfmt

- Use `oxfmt` as the sole formatter (no Prettier)

### package.json scripts

All tooling must be runnable via `pnpm`:

```jsonc
{
  "scripts": {
    "typecheck": "tsgo --noEmit",
    "lint": "eslint --fix .",
    "format": "oxfmt --write .",
    "test": "vitest run",
    "verify": "pnpm typecheck && pnpm lint && pnpm test && pnpm format"
  }
}
```

- `verify` runs all checks, with formatting **always last**

### Claude Code Hooks

Add `.claude/hooks/hooks.json` with:

- **Format on file change**: `PostToolUse` hook matching `Edit|Write` that runs `oxfmt --write` on the changed file
- **Verify on stop**: `Stop` and `SubagentStop` hooks that run `pnpm verify`
