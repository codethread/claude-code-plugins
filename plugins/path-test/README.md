# Path Test Plugin

A testing plugin to discover how Claude Code resolves file paths when referenced from plugin commands.

## Purpose

The Claude Code documentation doesn't clearly specify how file paths are resolved when referenced from within plugin commands. This plugin provides a systematic way to test different path resolution strategies to determine which patterns work reliably.

## Installation

```bash
# From the marketplace root directory
/plugin install path-test@personal-configs-plugins
```

## Usage

This plugin provides several test commands, each attempting to read the same reference file using different path strategies:

### Available Test Commands

- `/test-relative-from-command` - Tests `../reference.txt` (relative from commands/ directory)
- `/test-plugin-root-relative` - Tests `./reference.txt` (relative to plugin root)
- `/test-marketplace-full-path` - Tests full `~/.claude/plugins/marketplaces/...` path
- `/test-just-filename` - Tests just `reference.txt` (no path prefix)
- `/test-commands-subdir` - Tests `commands/../reference.txt`
- `/test-absolute-from-project` - Tests absolute path from project working directory
- `/test-bash-cat` - Uses bash command with marketplace path (like spec-dev plugin)

### Running Tests

Simply execute each command in a Claude Code session:

```bash
/test-relative-from-command
/test-plugin-root-relative
/test-marketplace-full-path
# ... etc
```

Each command will report whether it successfully read the reference file and what path strategy it used.

## Expected Behavior

When a test succeeds, you should see output similar to:

```
This is the path-test plugin reference file.

If you can read this, the path resolution worked correctly!

Plugin: path-test
File: reference.txt
Purpose: Testing file path resolution from plugin commands
```

## Results Documentation

After running all tests, document which path strategies work reliably. This information can then be used to update plugin development guidelines.

## Files

- `commands/` - Test command definitions
- `reference.txt` - The file all commands attempt to read
- `README.md` - This file (user guide)
- `CLAUDE.md` - Plugin architecture and maintenance guide
