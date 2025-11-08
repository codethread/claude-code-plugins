# Path Test Plugin - Maintainer Guide

## Purpose

This plugin exists to systematically test and document how Claude Code resolves file paths when referenced from plugin commands. The official documentation doesn't clearly specify path resolution behavior, making this experimental plugin necessary for plugin developers.

## Architecture

### Directory Structure

```
path-test/
├── commands/           # Test command definitions
│   ├── test-relative-from-command.md
│   ├── test-plugin-root-relative.md
│   ├── test-marketplace-full-path.md
│   ├── test-just-filename.md
│   ├── test-commands-subdir.md
│   ├── test-absolute-from-project.md
│   └── test-bash-cat.md
├── reference.txt       # Target file all commands try to read
├── README.md          # User guide
└── CLAUDE.md          # This file (maintainer guide)
```

### Test Strategies

Each command in `commands/` tests a different path resolution approach:

1. **Relative from command file** (`../reference.txt`)
   - Assumes paths are relative to the command file's location
   - Would make sense if commands execute from their own directory

2. **Plugin root relative** (`./reference.txt`)
   - Assumes CWD is set to the plugin root directory
   - Common pattern in many plugin systems

3. **Full marketplace path** (`~/.claude/plugins/marketplaces/personal-configs-plugins/plugins/path-test/reference.txt`)
   - Uses the complete installed plugin path
   - Pattern observed in spec-dev plugin (see `plugins/spec-dev/commands/build.md:13`)
   - Verbose but potentially most reliable

4. **Just filename** (`reference.txt`)
   - No path prefix at all
   - Tests if CWD is already in the right directory

5. **Commands subdirectory** (`commands/../reference.txt`)
   - Assumes execution from commands/ subdirectory
   - Tests if commands run from their containing folder

6. **Absolute from project** (full absolute path)
   - Uses absolute path based on current working directory
   - Only works for local development, not installed plugins

7. **Bash command with marketplace path**
   - Uses bash `cat` command with full marketplace path
   - Tests if bash tools have different path resolution than Read tool

## Adding New Tests

To add a new path resolution test:

1. Create a new command file in `commands/`
2. Follow the naming pattern: `test-<strategy-name>.md`
3. Use this template:

```markdown
---
description: Test path resolution using <strategy description>
---

# Test: <Strategy Name>

<Explanation of what this test attempts>

## Instructions

1. Read the reference file located at: `<path-to-test>`
2. Display the contents to confirm the path resolved correctly
3. Report success or failure with the path strategy used
```

## Documenting Results

After running tests, results should be documented in one of these locations:

1. Add findings to this CLAUDE.md under a "Test Results" section
2. Update the root marketplace CLAUDE.md with path resolution guidelines
3. Create a separate findings document if results are extensive

## Path Resolution Findings

**To be filled in after testing:**

- Which strategies worked?
- Which strategies failed?
- Are results consistent across different contexts (local dev vs installed)?
- Recommendations for plugin developers

## Notes

- This plugin is a testing/development tool, not meant for end-user workflows
- Keep it in the marketplace for reference when developing other plugins
- The reference.txt file content is intentionally simple and identifiable
