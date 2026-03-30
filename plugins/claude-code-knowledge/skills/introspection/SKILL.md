---
description: |
  Test and verify Claude Code behaviour — hooks, instructions, CLAUDE.md rules,
  tool usage patterns — using a headless subprocess harness.
  Use when building integration tests, verifying hook execution,
  or validating Claude Code configuration end-to-end.
disable-model-invocation: true
---

# Introspection

Test Claude Code behaviour by spawning headless `claude -p` subprocesses and inspecting the results.

## When to Use

- Verifying hooks fire and produce expected side effects
- Confirming CLAUDE.md rules influence model behaviour
- Testing skill triggering and tool-call patterns
- Running a lightweight integration suite against Claude Code configuration

## Reference Map

Open the reference that matches the task:

- `references/headless-test-harness.md` for environment setup, CLI flags, output parsing, and verification strategies

## Key Rules

- **Always strip `CLAUDECODE` from the subprocess env** — nested Claude Code refuses to run otherwise
- **Use `--model haiku`** to keep cost low (~$0.01-0.03 per invocation)
- **Set `--max-turns` tight** — haiku needs ~3-4 turns for read+edit tasks
- **PostToolUse hooks are silent in the stream** — verify them by checking side effects, not stream events
- `--verbose` is required when using `--output-format stream-json`
