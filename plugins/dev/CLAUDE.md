# dev plugin

## Architecture

Three skills implementing a phase-based development workflow. Each phase produces an artifact consumed by the next:

```
/dev-what  →  prd.md  →  /dev-how  →  tasks.yml  →  /dev-build  →  commits
```

Skills-only plugin (wave 1) — no hooks, no orchestrator script. The user drives phase transitions manually and loops `/dev-build` themselves.

## Design Principles

- **Automate don't prompt**: if behaviour can be enforced by script or hook, it must not be delegated to prompt. Wave 1 temporarily puts some things in prompts (quality checks, code-review invocation) that will graduate to hooks in wave 2.
- **The plan is the product**: agents can't course-correct mid-build. The plan must be solid or you go back to What/How.
- **Fresh context per task**: each `/dev-build` invocation is a clean context window. Memory persists via `tasks.yml`, `progress.md`, and git history.
- **Progressive disclosure**: SKILL.md files are indexes into `references/` — detailed schemas and protocols live there.

## Artifacts

All artifacts are transient (gitignored). Git commits are the permanent record.

| File | Phase | Purpose |
|---|---|---|
| `prd.md` | What | Product requirements document |
| `research.md` | What (optional) | Research findings |
| `tasks.yml` | How | Task decomposition with status tracking |
| `progress.md` | Build | Append-only learnings log |

## Future Waves

- **Wave 2**: Quality gate stop hook, `DEVFLOW_STAGE` env var, stage-aware write guard (PreToolUse hook)
- **Wave 3**: `cc-devflow build` loop runner (replaces user's manual while loop), stats.json, structured logging
