# Changelog

## 2026-03-31 (2)

- Added `dev/done` command: verifies all tasks done, squash merges feature branch into trunk, cleans up worktree and branch

## 2026-03-31

- Artifacts now stored in `.dev/` directory and committed to feature branch
- Each phase enforces clean git tree — must commit before completing
- Each `dev/build` invocation gets fresh context window via isolated execution
- Black-box dependencies now require learning tests for verification

## 2026-03-30

- Renamed skills from `dev-what`/`dev-how`/`dev-build` to `what`/`how`/`build` — they now surface as `dev/what`, `dev/how`, `dev/build` via the plugin namespace
- Updated all cross-references in SKILL.md files, reference docs, README.md, and CLAUDE.md to use new names
