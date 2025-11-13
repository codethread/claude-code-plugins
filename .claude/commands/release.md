---
description: Prepare plugins for release with version bumps, changelog updates, and safety checks
argument-hint: [additional notes]
allowed-tools: Bash(git:*)
---

# Release

Validates and prepares plugin releases by checking for accidental commits, ensuring proper versioning, maintaining changelogs, and creating git tags.

## Context

- Last 5 commits: !`git log -5 --oneline`
- Current changes: !`git status --short`
- Changed files: !`git diff --name-only HEAD`
- Plugin tags: !`git tag -l '*-v*' --format='%(refname:short) -> %(objectname:short) %(subject)' | sort`
- additional guidance (optional): $ARGUMENTS

## Instructions

First run `bun run verify` - DO NOT PROCEED if this fails and offer to fix the issues first

### 1. Safety Checks for Accidental Commits

Check the git status and staged/committed files for:

- `.env` files or other environment configuration
- `node_modules/` or other dependency directories
- Hidden files starting with `.` (like `.logs`, `.cache`, etc.)

If any suspicious files are found:

- Use AskUserQuestion to confirm whether these should be committed
- If not intended, update `.gitignore` with appropriate patterns
- Unstage the files with `git reset <file>`

### 2. Check for WIP Commits to Squash

Examine the last 5 commits for patterns indicating work-in-progress:

- Commit messages like "wip", "WIP", "tmp", "temp", "fix", "update", or very short messages (< 15 chars)
- Multiple small commits in sequence that appear to be part of the same feature
- Commits that together form a logical release unit

If WIP commits are found:

- Use AskUserQuestion to confirm which commits should be squashed together
- Use `git rebase -i HEAD~N` to interactively squash them into a single commit
- Ensure the squashed commit follows conventional format: `type(scope): description`

### 3. Identify Changed Plugins

From the changed files (including any newly squashed commits), determine which plugins under `plugins/` have been modified.

### 4. Process Each Plugin (Parallelizable)

For better performance, spawn multiple Task agents (model: haiku) to process plugins in parallel. Each agent should handle one plugin and perform:

#### a. Version Bump in plugin.json

- Read the plugin's `.claude-plugin/plugin.json`
- Check the current version
- Verify if the version has been bumped appropriately for these changes
- If not bumped, determine appropriate version (patch, minor, or major) based on changes
- Update `plugin.json` with the new version

#### b. Update SKILL.md Version References

- Use Glob to find any `SKILL.md` files in the plugin: `plugins/<plugin>/skills/*/SKILL.md`
- Read each `SKILL.md` file
- Check if version numbers are mentioned (often in the description or header)
- Update any version references to match the new `plugin.json` version

#### c. Create or Update CHANGELOG.md

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
  - Today's date (2025-11-13) as the heading
  - 2-4 concise bullet points describing key changes based on git diff and commit messages

### 5. Commit All Changes

After all plugins are processed:

- Stage all modified/created files including:
  - Updated `plugin.json` files
  - Updated `SKILL.md` files
  - New/updated `CHANGELOG.md` files
  - Any `.gitignore` changes from safety checks
  - All original uncommitted work
- Create a commit using conventional format:
  - Type: `feat`, `fix`, `refactor`, etc. based on the actual changes (NOT `chore`)
  - Scope: plugin name(s)
  - **IMPORTANT**: The commit message should describe the actual feature/changes, NOT the release process
  - Good examples:
    - `feat(spec-dev): add interview documentation and template versioning`
    - `fix(doc-writer): correct markdown formatting in nested lists`
    - `refactor(langs): simplify type inference logic`
  - Bad examples:
    - ❌ `chore(spec-dev): prepare release with version bumps`
    - ❌ `chore(spec-dev): v1.1.0 release`
    - ❌ `chore: update changelogs`
  - The commit body should provide additional context about the changes and their impact

### 6. Create Git Tags

For each plugin that had its version bumped:

- Create an annotated git tag in the format: `<plugin-name>-v<version>`
- Example: `spec-dev-v1.2.3`, `doc-writer-v2.0.0`
- Use `git tag -a <tag-name> -m "Release <plugin-name> v<version>"`
- Run `git tag -l` to confirm tags were created

### 7. Summary

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
