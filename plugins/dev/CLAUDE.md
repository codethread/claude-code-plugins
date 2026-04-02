# dev plugin

Architecture, data model, design decisions, and component details are documented in [`specs/dev-workflow.md`](../../specs/dev-workflow.md).

## Maintainer Notes

- Skills-only plugin (wave 1) — no hooks, no orchestrator script
- SKILL.md files use progressive disclosure: concise top-level, detailed schemas in `references/` subdirectories
- Every phase must leave the git tree clean

## Future Waves

- **Wave 2**: Quality gate stop hook, `DEVFLOW_STAGE` env var, stage-aware write guard (PreToolUse hook)
- **Wave 3**: `cc-devflow build` loop runner (replaces user's manual while loop), stats.json, structured logging
