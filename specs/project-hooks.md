# Project Hooks Specification

**Status:** Implemented
**Last Updated:** 2026-04-02

## 1. Overview

### Purpose

Project-level hook infrastructure that automates workspace lifecycle tasks (dependency installation, builds, verification) and enforces documentation hygiene at session boundaries. All hooks route through a Nix wrapper for NixOS compatibility, ensuring tooling availability regardless of host environment.

### Goals

- Automate workspace setup so `claude --init` produces a ready-to-use environment
- Gate session exit on documentation currency (stop hook)
- Ensure lint and typecheck pass before session ends
- Work transparently on both NixOS and non-NixOS hosts via the Nix wrapper
- Track new files for git intent-to-add on Write tool use
- Redirect npm commands to bun via PreToolUse interception

### Non-Goals

- Plugin-specific hook logic — plugins own their own hooks in `plugins/*/hooks/`
- Cross-session state — hooks are session-scoped (via session-cache library)
- Build orchestration beyond `bun install && bun run build` — Makefile and package.json scripts own the build graph
- Hook execution ordering guarantees between project and plugin hooks

## 2. Architecture

### Hook Registration

All project hooks are registered in `.claude/settings.json` under the `hooks` key (not in a separate `hooks.json`). Claude Code merges these with plugin-level hooks at runtime.

### Hook Inventory

| Event | Matcher | Command | Timeout | Status |
|---|---|---|---|---|
| Setup | `init` | `with-nix.sh bash -c 'cd $CLAUDE_PROJECT_DIR && bun install && bun run build'` | 120s | Active |
| Setup | `maintenance` | `with-nix.sh bash -c 'cd $CLAUDE_PROJECT_DIR && bun install && bun run build && bun run verify'` | 120s | Active |
| Stop | — | `with-nix.sh bun $CLAUDE_PROJECT_DIR/.claude/hooks/stop-doc-check.ts` | 60s | Disabled (`TEMP_DISABLED`) |
| Stop | — | `with-nix.sh bash -c 'cd $CLAUDE_PROJECT_DIR && bun run verify'` | 60s | Active |
| PostToolUse | `Write` | `jq -r '.tool_input.file_path' \| xargs git add -N 2>/dev/null \|\| true` | — | Active |
| PreToolUse | `Bash` | `cc-hook--npm-redirect` | — | Active |
| SessionStart | — | `cc-hook--context-injector session-start` | — | Active |
| SessionEnd | — | `cc-hook--context-injector session-end` | — | Active |

### Nix Wrapper (`with-nix.sh`)

All Setup and Stop hooks route through `.claude/hooks/with-nix.sh`:

1. Read `CLAUDE_PROJECT_DIR` (default: `.`)
2. If `flake.nix` exists at that path AND `nix` is on PATH → `exec nix develop "$DIR" --command "$@"`
3. Otherwise → `exec "$@"` (passthrough)

Uses `exec` to replace the shell process rather than spawning a child.

### Stop Doc-Check (`stop-doc-check.ts`)

TypeScript hook (Bun runtime) that blocks session stop until documentation is reviewed. Currently disabled via `TEMP_DISABLED = true`.

**Flow when enabled:**

1. Parse `StopHookInput` from stdin
2. Exit if `TEMP_DISABLED` is true (current state)
3. Exit if `stop_hook_active` (user already saw the block once)
4. Exit if `shouldTriggerBasedOnTime` returns false (3-minute cooldown)
5. Run `git status --short` to get modified files; exit on failure or empty list
6. For each modified file, walk directory tree upward from file to project root, collecting every `README.md` and `CLAUDE.md` found via `existsSync`
7. Deduplicate into a `Set<string>` of relative paths
8. Exit if no doc files found
9. Build `<project-stop-doc-check-suggestion>` XML block listing modified files and doc files
10. Output `{ decision: "block", reason: <xml> }` as JSON
11. Call `markTriggered` with file/doc counts as metadata

### External Hook Commands

Three hooks reference external CLI commands (not in this repo):

- **`cc-hook--npm-redirect`**: PreToolUse hook on Bash tool. Redirects npm invocations to bun.
- **`cc-hook--context-injector`**: SessionStart/End hook. Injects project context at session boundaries.
- **`cc-statusline`**: Status line command (not a hook, but registered in settings).

These are user-installed binaries, not part of this codebase.

### PostToolUse Write Hook

Inline shell pipeline (no script file):
```
jq -r '.tool_input.file_path' | xargs git add -N 2>/dev/null || true
```
Stages new files as intent-to-add so `git status` and `git diff` see them immediately after creation.

## 3. Data Model

### Hook Input (Stop)

```typescript
interface StopHookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: "auto" | "ask";
  hook_event_name: "Stop";
  stop_hook_active?: boolean; // true on second stop attempt
}
```

### Hook Output

```typescript
interface SyncHookJSONOutput {
  decision?: "block" | "allow";
  reason?: string;
  hookSpecificOutput?: {
    hookEventName?: string;
    additionalContext?: string;
    [key: string]: unknown;
  };
}
```

Stop hooks use `decision: "block"` with a `reason`. PostToolUse hooks (in plugins) use `hookSpecificOutput.additionalContext` for non-blocking context injection.

### Session Cache Keys

Stop-doc-check uses the session-cache library with:
- Plugin name: `"stop-doc-check"`
- Cache key tuple: `(pluginName, cwd, sessionId)`
- Metadata stored: `{ modified_files_count: number, doc_files_count: number }`

## 4. Interfaces

### XML Output Convention

Project hooks use `<project-HOOKNAME-suggestion>` tags (e.g., `<project-stop-doc-check-suggestion>`). This follows the naming convention documented in the root CLAUDE.md — plugin hooks use `<plugin-PLUGINNAME-suggestion>` instead.

### Workspace Integration

```
.claude/hooks/package.json
├── name: "claude-project-hooks"
├── type: "module"
├── dependencies: @claude-plugins/lib (workspace:*)
└── devDependencies: @anthropic-ai/claude-agent-sdk, @types/bun
```

Part of the bun workspace. TypeScript compiled via project references (`tsconfig.json` references `../../lib`).

### Build Chain

```
bun run build (root)
  └── tsc --build
        ├── lib/tsconfig.json          → lib/dist/*.d.ts
        └── .claude/hooks/tsconfig.json → .claude/hooks/dist/
```

Hooks are compiled as part of the workspace build but executed directly by Bun (which resolves `.ts` natively).

## 5. Design Decisions

- **Nix wrapper over direct commands**: All hooks go through `with-nix.sh` so the same settings.json works on NixOS (where `bun`/`biome` are only available inside `nix develop`) and non-NixOS hosts. The wrapper is a no-op when Nix isn't present.
- **Stop hook as blocking gate**: `decision: "block"` forces Claude to acknowledge documentation responsibilities before ending a session. This is intentionally heavier than the non-blocking `additionalContext` pattern used by plugin hooks.
- **TEMP_DISABLED flag**: Stop-doc-check is disabled inline rather than removed from settings.json. This preserves the hook registration and code for when behavior is refined, avoiding the need to re-integrate later.
- **`git add -N` on Write**: Intent-to-add ensures newly created files appear in `git status --short` output, which the stop-doc-check hook relies on for its modified-file scan.
- **3-minute cooldown**: Prevents the stop hook from blocking every stop attempt in rapid succession. Uses the shared session-cache library's time-gating mechanism.
- **External commands not vendored**: `cc-hook--npm-redirect`, `cc-hook--context-injector`, and `cc-statusline` are user-environment binaries. This keeps the repo focused on plugin/project concerns and avoids coupling to the user's broader CLI setup.

## 6. Open Questions

- **Stop-doc-check refinement**: The hook is disabled pending behavioral improvements. The current implementation can be noisy — it lists all doc files in the ancestor chain of any modified file, which may surface irrelevant docs. Filtering to only "likely stale" docs would reduce noise.
- **External command documentation**: The three external commands (`cc-hook--npm-redirect`, `cc-hook--context-injector`, `cc-statusline`) have no documentation in this repo. Their contracts are implicit.
- **Hook execution order**: The two Stop hooks (doc-check then verify) appear sequentially in settings.json, but whether Claude Code guarantees this ordering is not documented.
