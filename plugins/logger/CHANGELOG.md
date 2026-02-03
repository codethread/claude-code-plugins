# Changelog

All notable changes to the logger plugin will be documented in this file.

## [1.0.2] - 2026-02-03

### Fixed
- Corrected hooks.json structure to use proper nested hooks arrays
- Added support for optional matcher field in hook configurations
- Updated CLAUDE.md with correct hook structure examples

## [1.0.1] - 2026-02-03

### Fixed
- Fixed hooks.json structure to include required top-level `hooks` key
- Updated CLAUDE.md documentation to reflect correct hooks.json format

## [1.0.0] - Initial Release

### Added
- Session-based logging with JSONL format
- Hook registrations for 11 Claude Code events
- Symlink management for current and previous sessions
- Compiled TypeScript executable for performance
