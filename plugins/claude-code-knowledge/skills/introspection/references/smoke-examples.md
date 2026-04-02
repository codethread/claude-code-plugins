# Smoke Test Examples

Template library for `/claude-smoke`. Each template covers a common hook pattern.

## Template Format

```
### Name
**Matches**: event type + matcher pattern the template applies to
**Setup**: what to prepare before the test
**Action**: what to do to trigger the hook
**Verify**: what observable effect to check
**Cleanup**: how to restore to pre-test state
```

## Templates

---

### formatter

**Matches**: `PostToolUse` on `Edit` or `Write` (hook command contains a formatter: prettier, biome, gofmt, black, etc.)

**Setup**:
1. Find a source file appropriate for the project's language (e.g. a `.ts`, `.js`, `.py`, or `.go` file)
2. Read and store the original contents

**Action**:
1. Edit the file with deliberately bad formatting:
   - For JS/TS: remove semicolons if required, break indentation, run words together
   - For Python: break PEP 8 indentation
   - For Go: misalign braces, break gofmt conventions
2. Re-read the file immediately after the edit

**Verify**:
- PASS: file contents differ from what was written and match well-formatted code
- FAIL: file still contains the bad formatting that was written

**Cleanup**:
1. Restore the original file contents with a Write or Edit tool call

**Notes**:
- If the hook uses `--check` mode only (no auto-fix), the hook will surface errors as `additionalContext` but won't reformat. In that case, treat the linter template as more appropriate.
- Formatter hooks are silent on PostToolUse — you can only verify via the file state.

---

### linter-clean

**Matches**: `PostToolUse` on `Edit` or `Write` (hook command contains a linter: eslint, biome check, ruff, golangci-lint, etc.)

**Setup**:
1. Find a source file with no existing lint violations

**Action**:
1. Make a trivial, lint-clean edit (e.g. add or change a comment, add a whitespace-only blank line)

**Verify**:
- PASS: no lint errors surfaced (no block, no `additionalContext` containing error text)
- FAIL: hook reports lint errors on clean code (false positive noise)

**Cleanup**:
1. Restore the original file contents

**Notes**:
- A linter hook that fires on every edit and reports noise is a sign of misconfiguration.
- PostToolUse hooks surface feedback via `additionalContext` — check the hook response fields, not stdout.

---

### linter-violation

**Matches**: `PostToolUse` on `Edit` or `Write` (same linter hooks as `linter-clean`)

**Setup**:
1. Determine what kind of lint violations the configured linter catches (unused vars, excessive parameters, missing types, etc.)
2. Identify a directory that the linter includes — check `.eslintrc`, `biome.json`, `pyproject.toml`, or equivalent. **Do not use a dot-directory** (e.g. `.claude-smoke-tmp/`) — most linters exclude them, which would make the test file invisible to the hook.
3. Choose a temp file path inside a known-linted directory (e.g. `src/smoke-lint-test.<ext>` or the project's main source root)

**Action**:
1. Write the temp file with a lint violation appropriate for the linter
2. Re-read the temp file to confirm it was written as intended

**Verify**:
- PASS: hook surfaced lint error feedback (via `additionalContext`, a block response, or a non-zero exit signal)
- FAIL: hook was silent — violation not detected

**Cleanup**:
1. Delete the temp file

**Notes**:
- Pair with `linter-clean` — both sub-tests must pass for the linter hook to be considered working.
- Common violation patterns by linter:
  - ESLint / Biome: unused variable (`const _x = 1`)
  - Ruff: unused import
  - golangci-lint: declared and not used
- If the linter include paths are unclear, read the linter config file before placing the temp file.

---

### type-checker-stop

**Matches**: `Stop` hook (hook command contains a typechecker: tsc, pyright, mypy, go build, etc.)

**Setup**:
1. Identify the project's typecheck command from `package.json` or project config
2. Check `tsconfig.json` (or the equivalent for the project's language) for `include`/`exclude` patterns to find a directory the typechecker will actually scan. **Do not use a dot-directory** — typecheckers commonly exclude them, which makes the injected error invisible and causes a false PASS.
3. Choose a temp file path inside a known-typechecked directory (e.g. `src/smoke-type-test.<ext>`)

**Action**:
1. Write the temp file with a deliberate type error appropriate for the language
2. Spawn a headless `claude -p` subprocess using the pattern from `headless-test-harness.md`
3. Prompt the subprocess to do something trivial (e.g. "Read the file `<temp-path>` and tell me its contents"), then stop

**Verify**:
- PASS: Stop hook fired and type error appeared in the subprocess output or session summary
- FAIL: Subprocess ended cleanly with no type error reported

**Cleanup**:
1. Delete the temp file

**Notes**:
- Use `claude -p --model claude-haiku-4-5-20251001` to minimise cost (~$0.01–0.03 per test)
- Stop hooks are not testable live — always requires a headless subprocess
- If typechecked paths are ambiguous, read the typechecker config before placing the temp file

---

### pre-tool-blocker

**Matches**: `PreToolUse` on any tool (hook exits 2 to block, or rewrites input to modify)

**Setup**:
1. Read the hook script or command to understand what it blocks or modifies
2. Identify a safe, reversible action that should trigger the block

**Action**:
1. Attempt the action the hook is configured to intercept (e.g. a Bash command matching the hook's matcher, or an Edit to a protected file pattern)

**Verify**:
- PASS (block): tool use did not proceed — hook returned exit 2 and Claude received a block signal
- PASS (modify): tool use proceeded with modified input — check that the modification matches what the hook script does
- FAIL: tool use proceeded unmodified with no interception

**Cleanup**:
1. If the action partially completed before being blocked, restore any changed state
2. No cleanup needed if the block was clean

**Notes**:
- Exit 2 from a PreToolUse hook blocks the tool use entirely. Exit 0 with modified JSON modifies the input.
- To verify a block, check whether Claude reports the tool was blocked or the expected side effect did not occur.
- For hooks that only fire on specific file patterns (matcher regex), use a filename that matches the pattern.

---

## Adding New Templates

When a hook pattern doesn't match any template above, add a new one following this process:

1. **Name**: short kebab-case identifier (`formatter`, `linter-clean`, `git-guard`, etc.)
2. **Matches**: be specific — event type AND what command/tool pattern it applies to
3. **Setup**: what state must exist before the test can run
4. **Action**: the minimal action that triggers the hook
5. **Verify**: a concrete observable check (file state, hook output field, block signal)
6. **Cleanup**: restore everything the test touched
7. **Notes**: edge cases, cost implications, or language-specific variations

Keep templates minimal and concrete. Avoid vague instructions like "check that the hook worked" — specify exactly what to read and what value to expect.
