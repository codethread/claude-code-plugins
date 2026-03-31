---
name: init
description: Bootstrap a new project with the BDFL architecture
allowed-tools: Bash, Write, Edit, Read, Glob, Grep
---

# BDFL Init

Scaffold a new project from scratch that meets the full BDFL architecture from day one.

## Arguments

- `PROJECT_OUTLINE`: $ARGUMENTS — a brief description of the project, its purpose, and which components are needed (web, mobile, server, or a combination)

## Architecture

Load and read the full architecture specification before proceeding:

- [Architecture Reference](./references/architecture.md)

## Instructions

1. Read the architecture reference above in full
2. Parse `PROJECT_OUTLINE` to determine:
   - Project name
   - Which components are required (web, mobile, server)
   - Any additional context about the project's purpose
3. Create the project directory and initialise with `pnpm init`
4. Pin Node.js and pnpm versions using Volta config in `package.json`
5. Install and configure TypeScript with the strict settings from the architecture
6. Install and configure Effect.ts (`effect`, plus relevant `@effect/*` packages based on components)
7. Set up required components per the architecture:
   - **Web**: React + Vite
   - **Mobile**: Expo + React Native (use `jest` + `jest-expo` instead of Vitest)
   - **Server**: `@effect/platform` HTTP server
8. Install and configure project tooling per the architecture:
   - `@typescript/native-preview` for fast type-checking
   - ESLint with `typescript-eslint` (strict + recommended plugins for chosen components) and an `eslint-rules/` directory
   - `oxfmt` for formatting
   - Add all standard scripts to `package.json` including the `verify` command
9. Set up the build tool (Vite) and test runner (Vitest, or jest-expo for Expo projects)
10. Create the `Dockerfile` and `dev.sh` for Podman-based development
11. Set up Claude Code hooks:
    - PostToolUse on `Edit|Write`: format + lint the changed file
    - Stop and SubagentStop: run `pnpm verify`
    - Pre-commit git hook: run `pnpm verify`
12. Run `pnpm install` and `pnpm verify` to confirm everything works
13. Summarise what was created and any next steps
