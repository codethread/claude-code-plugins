---
description: Prepare plugins for release with version bumps, changelog updates, and safety checks
argument-hint: [additional notes]
allowed-tools: Bash(bash:*)
---

# Release

Validates and prepares plugin releases by checking for accidental commits, ensuring proper versioning, maintaining changelogs, and creating git tags.

## Context

- Last 5 commits: !`git log -5 --oneline`
- Current changes: !`git status --short`
- Changed files: !`git diff --name-only HEAD`
- Plugin tags: !`bash .claude/scripts/tags.sh`
- additional guidance (optional): $ARGUMENTS

## Instructions

First run `bash .claude/hooks/with-nix.sh bun run verify` - DO NOT PROCEED if this fails and offer to fix the issues first

### 1. Safety Checks for Accidental Commits

Check the git status and staged/committed files for:

- `.env` files or other environment configuration
- `node_modules/` or other dependency directories
- Hidden files starting with `.` (like `.logs`, `.cache`, etc.)

If any suspicious files are found:

- Use AskUserQuestion to confirm whether these should be committed
- If not intended, update `.gitignore` with appropriate patterns
- Unstage the files with `git reset <file>`

### 2. Check for open work to commit

Commit it (use `ct/commit` skill if desired)

### 3. Identify Changed Plugins

From the changed files (including any newly squashed commits), determine which plugins under `plugins/` have been modified.

### 4. Version Bump All Changed Plugins

For each changed plugin, update its `version` field in `.claude-plugin/marketplace.json`:

- Find the plugin's entry in the `plugins` array
- Check the current `version` field
- Determine appropriate bump (patch, minor, or major) based on changes
- Update the version

### 5. Process Each Plugin's CHANGELOG (Parallelizable)

For better performance, spawn multiple Task agents (model: haiku) to process plugins in parallel. Each agent should handle one plugin and perform:

#### Create or Update CHANGELOG.md

- Check if `plugins/<plugin>/CHANGELOG.md` exists
- If it doesn't exist, create it with this structure:

  ```markdown
  # Changelog

  ## YYYY-MM-DD

  - Concise description of change
  - Another change
  ```

- If it exists, add a new dated entry at the top (below the header)
- Populate the entry with:
  - Today's date as the heading
  - 2-4 concise bullet points describing key changes based on git diff and commit messages

### 6. Commit All Changes

After all plugins are processed:

- Stage all modified/created files including:
  - Updated `.claude-plugin/marketplace.json` (plugin versions)
  - New/updated `CHANGELOG.md` files
  - Any `.gitignore` changes from safety checks
  - All original uncommitted work
- Create a commit using conventional format:
  - Type: `feat`, `fix`, `refactor`, etc. based on the actual changes (NOT `chore`)
  - Scope: plugin name(s)
  - **IMPORTANT**: The commit message should describe the actual feature/changes, NOT the release process
  - Good examples:
    - `feat(langs): add Python skill with type hinting patterns`
    - `fix(karen): correct verdict logic for edge cases`
    - `refactor(langs): simplify type inference logic`
  - Bad examples:
    - BAD: `chore(langs): prepare release with version bumps`
    - BAD: `chore(langs): v1.1.0 release`
    - BAD: `chore: update changelogs`
  - The commit body should provide additional context about the changes and their impact

### 7. Create Git Tags

For each plugin that had its version bumped:

- Create an annotated git tag in the format: `<plugin-name>-v<version>`
- Example: `langs-v1.1.0`, `karen-v2.0.0`
- Use `git tag -a <tag-name> -m "Release <plugin-name> v<version>"`
- Run `git tag -l` to confirm tags were created

### 8. Summary

Display a summary showing:

- Final commit message
- List of tags created
- Reminder that changes can be reviewed with `git show` and pushed with `git push && git push --tags`

## Notes

- This command prepares the release but does NOT push commits or tags, please prompt the user with the appropriate command to push with tags
- The user should review everything before pushing
- All changes (original work + version/changelog updates) go into a single commit
- Multiple plugin releases in one commit is acceptable
- Use haiku agents for parallel processing of plugins to improve performance
