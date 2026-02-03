# Claude Code Session Logger Plugin

Logs all Claude Code session events to structured JSONL files for analysis, debugging, and session replay.

## Features

- Captures all Claude Code hook events (SessionStart, SessionEnd, PreToolUse, PostToolUse, etc.)
- Creates session-specific log files: `cc-session-<timestamp>-<session-id>.jsonl`
- Maintains symlinks for easy access: `cc-session-current.jsonl` and `cc-session-last.jsonl`
- Non-blocking: never interrupts Claude Code operation
- Structured JSONL format for easy parsing and analysis

## Installation

### From Marketplace

```bash
/plugin install logger@codethread-plugins
```

After installation, build the executable for your platform:

```bash
cd ~/.claude/plugins/marketplaces/codethread-plugins/plugins/logger
bun run build
```

### From Source

1. Clone the plugin repository
2. Build the executable:
   ```bash
   cd plugins/logger
   bun run build
   ```

3. Install to Claude Code:
   ```bash
   # For user scope (recommended)
   claude plugin install . --scope user

   # For project scope (shared via git)
   claude plugin install . --scope project
   ```

## Usage

Once installed, the plugin automatically logs all session events to `.logs/` in your project directory.

### Log File Structure

```
.logs/
├── cc-session-2026-02-02-14-30-00-abc123.jsonl  # Session-specific log
├── cc-session-current.jsonl -> cc-session-2026-02-02-14-30-00-abc123.jsonl
└── cc-session-last.jsonl -> cc-session-2026-02-01-10-15-00-xyz789.jsonl
```

### Log Entry Format

Each line in the JSONL file is a JSON object with:

```json
{
  "timestamp": "2026-02-02T14:30:00.123Z",
  "unix_timestamp": 1738504200123,
  "event": "SessionStart",
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "transcript_path": "/path/to/transcript",
  "source": "startup",
  "raw_data": { ... }
}
```

## Development

### Build Commands

```bash
bun run build           # Build executable (quiet)
bun run build:verbose   # Build with verbose output
bun run typecheck       # Type check with TypeScript
```

The executable is platform-specific and must be built on the target platform (macOS arm64/x64, Linux x64).

### Testing the Logger

Test the logger manually:

```bash
# Simple SessionStart event
echo '{"hook_event_name":"SessionStart","session_id":"test123","cwd":"'$(pwd)'","transcript_path":"test.txt","source":"startup"}' | ./bin/session-logger

# Check the logs
cat .logs/cc-session-current.jsonl

# Test UserPromptSubmit event
echo '{"hook_event_name":"UserPromptSubmit","session_id":"test123","cwd":"'$(pwd)'","transcript_path":"test.txt","prompt":"hello"}' | ./bin/session-logger

# Verify second event appended
cat .logs/cc-session-current.jsonl | wc -l  # Should show 2 lines
```

### Project Structure

```
logger/
├── .claude-plugin/
│   └── plugin.json      # Plugin metadata
├── bin/
│   └── session-logger   # Compiled executable (gitignored)
├── src/
│   ├── session-logger.ts   # Main implementation
│   └── claude-hooks.ts     # Type definitions
├── hooks/
│   └── hooks.json       # Hook configuration
├── scripts/
│   └── build.ts         # Build script
├── CLAUDE.md            # Maintainer documentation
└── README.md            # This file
```

## Compatibility

- Requires Bun runtime for building
- Tested on macOS (arm64, x64) and Linux (x64)
- Claude Code version >= 1.0.0

## License

MIT
