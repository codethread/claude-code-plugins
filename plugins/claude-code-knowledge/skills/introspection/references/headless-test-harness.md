# Headless Claude Code Test Harness

Invoke `claude -p` (headless mode) from a subprocess to test any Claude Code behaviour — hooks, instructions, tool usage patterns, CLAUDE.md rules.

The key challenge is **environment isolation**: Claude Code detects nesting and refuses to run inside itself.

## Environment Setup

Claude Code sets `CLAUDECODE=1` in its shell environment. A nested instance sees this and exits. Strip it from the subprocess env:

```typescript
function cleanEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v === undefined) continue;
    if (k === "CLAUDECODE") continue;
    env[k] = v;
  }
  return env;
}
```

Stripping just `CLAUDECODE` is sufficient in practice. If you hit issues, build a minimal env from scratch (`PATH`, `HOME`, `SHELL`, etc.) rather than inheriting.

## CLI Flags

```bash
claude -p \
  --model haiku \
  --verbose \
  --output-format stream-json \
  --dangerously-skip-permissions \
  --max-turns 5 \
  "your prompt here"
```

| Flag | Purpose |
|------|---------|
| `-p` / `--print` | Headless mode — no interactive UI, outputs to stdout, exits when done |
| `--model haiku` | Use a cheap model. Accepts aliases (`haiku`, `sonnet`, `opus`) or full IDs |
| `--verbose` | **Required** when using `stream-json` output format |
| `--output-format stream-json` | Newline-delimited JSON events on stdout — every message, tool call, hook event, and final result |
| `--output-format json` | Alternative: single JSON blob with just the final result (no intermediate events) |
| `--dangerously-skip-permissions` | Auto-approves all tool use — necessary for unattended execution |
| `--max-turns N` | Caps agentic loops. Haiku needs ~3-4 turns for read+edit tasks. Set tight to control cost |

Other useful flags: `--max-budget-usd`, `--no-session-persistence`, `--bare` (skips auto-discovery for faster startup).

## Output Structure (stream-json)

Each line of stdout is a JSON object. Key event types:

### `system:init`

Emitted once at start. Contains `cwd`, available tools, model, permission mode, MCP servers.

### `system:hook_started` / `system:hook_response`

Hook lifecycle events. Fields include:

- `hook_name` — e.g. `"SessionStart:startup"`
- `hook_event` — the hook type: `"SessionStart"`, `"Stop"`, `"PostToolUse"`, etc.
- `exit_code`, `stdout`, `stderr` — hook execution results
- `outcome` — `"success"` or failure info

**Important caveat**: Only `SessionStart` and `Stop` hooks emit stream events. `PostToolUse` hooks run silently — they execute, but no events appear in the stream. Verify PostToolUse hooks by checking their side effects (e.g., did the file get formatted after an edit?).

### `assistant`

Model responses. Tool calls are nested inside `message.content` as blocks with `type: "tool_use"`:

```json
{
  "type": "assistant",
  "message": {
    "content": [
      { "type": "tool_use", "name": "Edit", "input": { "..." : "..." } },
      { "type": "text", "text": "..." }
    ]
  }
}
```

### `user`

Tool results come back as `user` events with `tool_result` content blocks. Error responses have `is_error: true`.

### `result`

Final event. `subtype` tells you how it ended:

- `"success"` — model finished naturally
- `"error_max_turns"` — hit the turn limit

Also contains `total_cost_usd`, `num_turns`, `duration_ms`, and per-model token breakdowns.

## Verification Strategies

### Hooks

- **SessionStart/Stop hooks**: Check stream for `hook_response` events with the expected `hook_name` and `exit_code: 0`
- **PostToolUse hooks**: No stream events. Write deliberately unformatted code, have Claude edit it, then read the file back and check if formatting was applied

### Instructions / CLAUDE.md Rules

Prompt Claude to do something the rule should influence, then inspect the tool calls and assistant responses in the stream to verify compliance.

### Tool Behaviour

Check `assistant` events for expected tool calls (`type: "tool_use"` blocks) and the `user` events for successful tool results.

## Cost

Haiku runs at roughly **$0.01-0.03 per headless invocation** with 3-5 turns. Budget accordingly for test suites.

## Spawning (Bun)

```typescript
const proc = Bun.spawn(args, {
  cwd: projectDir,
  env: cleanEnv(),
  stdout: "pipe",
  stderr: "pipe",
});

const [stdout, stderr] = await Promise.all([
  new Response(proc.stdout).text(),
  new Response(proc.stderr).text(),
]);
const exitCode = await proc.exited;

const events = stdout
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
```

Works the same with Node's `child_process.spawn` or any language that can spawn a subprocess with env control.
