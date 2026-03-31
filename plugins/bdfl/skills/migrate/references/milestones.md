# BDFL Migration Milestones

Ordered phases for migrating an existing project to the BDFL architecture. Each phase has concrete done criteria. Phases must be completed in order — later phases depend on earlier ones being stable.

The BDFL plugin defines **what** to achieve and **in what order**. It does not prescribe how the work is broken down or executed — that is up to the user and their preferred workflow.

## Phase Order

### 0. `nix` (optional)

Set up NixOS development environment.

**Done when:**
- `flake.nix` exists and provides a dev shell with all required binaries
- All project commands work inside the nix dev shell

**Notes:**
- Optional at this stage — can be deferred to `nixReadiness` as a final step
- If skipped now, it becomes required as the final phase before BDFL certification

---

### 1. `specs`

Establish a behavioural safety net before changing anything.

**Done when:**
- System-level documentation exists (what the project does, its boundaries)
- Module-level documentation exists for all non-trivial modules
- Integration tests exist at system boundaries (HTTP endpoints, CLI commands, file I/O, external APIs)
- Module-level tests exist for non-trivial modules (best-effort where missing)
- All tests pass using the project's **incumbent** tooling (not the BDFL target tooling)

**Notes:**
- This phase uses whatever test runner and tools the project already has
- The goal is a safety net, not perfection — enough coverage to catch regressions during migration
- If the project has zero tests, focus on black-box integration tests at the outermost boundary first

---

### 2. `formatter`

Install and apply the BDFL formatter across the entire codebase.

**Done when:**
- Target formatter (oxfmt) is installed and configured
- Every file in the project passes the formatter with zero changes
- Bulk format change is committed
- `.git-blame-ignore-revs` includes the bulk format commit hash

**Notes:**
- The bulk format commit must be paired with a `.git-blame-ignore-revs` entry in the same commit (or immediately after)
- This is typically a single large commit — that's fine

---

### 3. `linter`

Install and apply the BDFL linter across the entire codebase.

**Done when:**
- Target linter (ESLint + typescript-eslint, flat config) is installed and configured
- Component-specific plugins installed (react, react-hooks, etc. as applicable)
- `eslint-rules/` directory exists at project root
- Zero lint violations across all files
- Bulk fix committed with `.git-blame-ignore-revs` if the diff is large

**Notes:**
- If existing linter violations are numerous, fix them all — BDFL requires zero violations
- Some fixes may change behaviour; rely on the specs from phase 1 to catch regressions

---

### 4. `typeChecker`

Apply the strictest TypeScript configuration.

**Done when:**
- `@typescript/native-preview` (tsgo) is installed
- TypeScript configuration matches the BDFL strict settings (all flags from architecture.md)
- `tsgo --noEmit` passes with zero errors across all modules
- `typecheck` script added to `package.json`

**Notes:**
- This is often the hardest tooling phase — strict TypeScript on a loose codebase surfaces many issues
- Rely on specs from phase 1 to verify fixes don't change behaviour

---

### 5. `build`

Establish the BDFL build and test pipeline.

**Done when:**
- Target build tool (Vite) is configured and produces a clean build
- Target test runner is installed and configured (Vitest, or `jest` + `jest-expo` for Expo projects)
- All specs from phase 1 have been migrated to the target test runner and pass
- `build`, `test`, and `verify` scripts in `package.json` match the BDFL standard scripts
- `pnpm verify` passes cleanly

**Notes:**
- The test runner swap is part of this phase — migrate test files from incumbent runner to the target runner
- `verify` script order: typecheck → lint → test → format (format always last)

---

### 6. `catchAllHooks`

Set up blunt verification hooks that run everything on every check.

**Done when:**
- **Stop** and **SubagentStop** Claude Code hooks run `pnpm verify`
- **Pre-commit** git hook runs `pnpm verify`
- Both hooks pass cleanly on the current codebase

**Notes:**
- These hooks are intentionally coarse — they verify the entire project on every stop/commit
- Performance is not the concern here; correctness is
- Later phases may temporarily require disabling hooks during structural changes (e.g. monorepo restructure) — that's expected and should be done explicitly as part of the plan

---

### 7. `monorepo`

Structure the project as a BDFL-compliant monorepo (if applicable).

**Done when:**
- pnpm workspaces configured in root `package.json`
- Shared `tsconfig.base.json` with project references
- Each workspace has its own `package.json` and `tsconfig.json`
- Root `verify` script runs verification across all workspaces
- All hooks still work (update paths if needed)
- `pnpm verify` passes from the root

**Notes:**
- Skip this phase if the project is a single package (mark as `skipped`)
- Structural changes may temporarily break hooks — disable and re-enable as part of the plan
- After restructuring, verify that catch-all hooks from phase 6 still work with the new layout

---

### 8. `architecture`

Migrate core business logic to BDFL target libraries.

**Done when:**
- Core business logic uses Effect.ts for error handling, concurrency, DI, schema validation
- Server uses `@effect/platform` HTTP server (if applicable)
- No legacy framework remnants in core paths (e.g. Express middleware, manual Promise chains)
- All specs from phase 1 still pass
- `pnpm verify` passes cleanly

**Notes:**
- This is the most substantial phase and often cannot be done piecemeal within a single module
- Integration tests at system boundaries are critical — they verify the rewrite hasn't changed external behaviour
- Common pattern: rewrite one module/endpoint/boundary at a time, verify tests pass, commit, move to the next

---

### 9. `refinedHooks`

Replace catch-all hooks with targeted per-file and per-module hooks.

**Done when:**
- **PostToolUse** on `Edit|Write`: runs formatter on the changed file
- **PostToolUse** on `Edit|Write`: runs linter on the changed file
- **Stop** and **SubagentStop**: runs `pnpm verify`
- **Pre-commit**: runs full `pnpm verify`
- All hooks pass cleanly

**Notes:**
- This replaces the blunt catch-all hooks from phase 6 by adding per-file PostToolUse hooks for immediate feedback
- Stop and pre-commit hooks remain full `pnpm verify` — correctness over speed
- The refinement is in the addition of fast per-edit feedback, not in reducing stop-level verification

---

### 10. `containerisation`

Set up container-based development environment.

**Done when:**
- `Dockerfile` exists with appropriate ingress, volume mounts for source code
- `./dev.sh` exists and invokes the container via Podman
- Development workflow functions inside the container

**Notes:**
- Can be worked on at any point during migration — it doesn't block or depend on other phases
- Must be present for BDFL certification

---

### N-1. `nixReadiness` (if not done at phase 0)

Ensure the project is fully NixOS-ready.

**Done when:**
- `flake.nix` exists and provides a dev shell with all required binaries
- All project commands work inside the nix dev shell
- All hooks work inside the nix dev shell

**Notes:**
- Required for BDFL certification if not completed at phase 0
- This is the final gate before a project can be considered fully BDFL-compliant

---

## `.bdfl.yaml`

The migrate skill generates and maintains a `.bdfl.yaml` file in the project root to track progress:

```yaml
phases:
  nix: skipped
  specs: done
  formatter: done
  linter: done
  typeChecker: in-progress
  build: pending
  catchAllHooks: pending
  monorepo: pending
  architecture: pending
  refinedHooks: pending
  containerisation: pending
  nixReadiness: pending
```

**Statuses:** `pending` | `in-progress` | `done` | `skipped`

This file is a state ledger, not a config file. It records where the project is on the migration journey. The BDFL plugin defines the target and the order — `.bdfl.yaml` just tracks progress.
