---
description: Smoke test Claude Code hooks in the current project
argument-hint: [hook filter]
---

# Claude Smoke — Hook Smoke Testing

Introspect this project's Claude Code hook configuration, generate targeted smoke tests per hook, execute them, report results, and clean up all artifacts.

**Reference methodology**: `skills/introspection/references/smoke-examples.md` (templates) and `skills/introspection/references/headless-test-harness.md` (lifecycle hook subprocess pattern).

## Variables

### Inputs

- `FILTER`: `$ARGUMENTS` — optional. Narrows scope to hooks whose event type or command matches this string (e.g. `PostToolUse`, `formatter`, `stop`). If no hooks match, list available hooks and stop.

### Commands

- `HEADLESS_CLAUDE_CMD`: `claude -p --model claude-haiku-4-5-20251001`

### Skills

- `INTROSPECTION_SKILL`: `claude-code-knowledge:introspection`

## Phase 1 — DISCOVER

Read all hook configuration sources:

1. Read `.claude/settings.json` — parse the `hooks` object, enumerate every event type and its array of hook entries (each with optional `matcher` and `hooks` array of handler objects)
2. Read `.claude/settings.local.json` if it exists — merge any additional hooks using the same structure
3. Scan `.claude/agents/*.md` — parse each file's YAML frontmatter for a `hooks:` field. These hooks are agent-scoped and only fire while that agent is active
4. Plugin `hooks/hooks.json` files are excluded — test project hooks only

For each discovered hook, record:
- Event type (`PostToolUse`, `PreToolUse`, `Stop`, `SessionStart`, `SubagentStart`, `SubagentStop`, `UserPromptSubmit`)
- Matcher pattern (if present)
- Command or script
- Source file (settings.json, settings.local.json, or agent file name)

If no hooks are found in any source, report "No hooks configured in this project" and stop.

## Phase 2 — CLASSIFY

For each hook, classify into one of three categories:

| Category | Event types | Test approach |
|---|---|---|
| **live-testable** | `PostToolUse`, `PreToolUse` | Use tools directly in this session |
| **headless-required** | `Stop`, `SessionStart`, `UserPromptSubmit` | Spawn `$HEADLESS_CLAUDE_CMD` subprocess (see `skills/introspection/references/headless-test-harness.md`) |
| **manual** | `SubagentStart`, `SubagentStop`, agent-scoped hooks | Surface as manual suggestions |

Agent-scoped hooks (from agent frontmatter) are always classified as **manual** — they require the specific agent to be active, which is not safely automatable.

## Phase 3 — FILTER

If `FILTER` is non-empty:
- Keep only hooks whose event type, matcher, command, or source file contains `FILTER` (case-insensitive)
- If no hooks remain after filtering, print the full list of discovered hooks and their event types, then stop

## Phase 4 — GENERATE

For each hook to test, select the appropriate test strategy:

1. Check `skills/introspection/references/smoke-examples.md` for a template that matches the hook's event type and command pattern:
   - Hook command contains `prettier`, `biome format`, `gofmt`, `black` → `formatter` template
   - Hook command contains `eslint`, `biome check`, `ruff`, `golangci-lint` → `linter-clean` + `linter-violation` templates
   - Hook event is `Stop` and command contains `tsc`, `pyright`, `mypy`, `go build` → `type-checker-stop` template
   - Hook event is `PreToolUse` with exit-2 blocking logic → `pre-tool-blocker` template

2. If no template matches, read the hook script or command to understand what it does, then reason autonomously about a minimal test that produces an observable effect.

3. If the hook's behaviour is ambiguous after reading the script, ask the user what the hook should do before proceeding.

Keep a test plan list: each entry has a hook identifier, test name, and the steps to execute.

## Phase 5 — EXECUTE

Run each test in the plan. Track all files created or modified.

**Live tests** (PostToolUse, PreToolUse):
- Follow the template steps exactly — setup, action, verify
- For formatter tests: edit a real source file with bad formatting, re-read to check it was reformatted
- For linter tests: run both linter-clean (trivial edit, verify silence) and linter-violation (temp file with violation, verify error surfaced). Place temp files in linter-scanned directories — check linter config for include/exclude before choosing a path; do not use dot-directories
- For PreToolUse blocker tests: attempt the intercepted action, verify block or modification

**Headless tests** (Stop, SessionStart, UserPromptSubmit):
- Follow the subprocess pattern from `skills/introspection/references/headless-test-harness.md`
- Use `$HEADLESS_CLAUDE_CMD` to minimise cost
- For typechecker Stop hooks: write a temp file with a deliberate type error in a typechecker-scanned directory (check tsconfig.json or equivalent for include paths), prompt the subprocess to read the file then stop, verify the Stop hook reported the type error

Record the outcome of each test: PASS, FAIL, or ERROR (unexpected exception or unrecoverable state).

## Phase 6 — REPORT

Output a summary table and detail sections:

```
## Smoke Test Results

| Hook | Trigger | Test | Result |
|---|---|---|---|
| <command> | <event>:<matcher> | <test-name> | PASS/FAIL/ERROR |
```

If any tests failed or errored:

```
### Failures

#### <hook-id> — <test-name>
Expected: <what should have happened>
Actual: <what was observed>
```

If any hooks were classified as manual:

```
### Manual Tests (not auto-testable)

- **<hook-id> (<event type>)**: <suggested test procedure the user could follow>
```

If FILTER was provided but some tests were skipped, note this clearly.

## Phase 7 — CLEANUP

After all tests complete (regardless of pass/fail), restore everything:

1. For every source file that was modified during testing: restore the original contents using a Write or Edit call
2. For every temp file created during testing: delete it
3. If a temp file cannot be deleted, report the path and note that manual cleanup is needed

Cleanup is non-optional. If a test fails mid-execution, still clean up what was set up so far before reporting.

After cleanup, confirm: "All test artifacts cleaned up." If anything remains, list the paths.
