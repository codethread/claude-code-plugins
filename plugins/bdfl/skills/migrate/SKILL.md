---
name: migrate
description: Incrementally migrate an existing project toward the BDFL architecture
allowed-tools: Bash, Write, Edit, Read, Glob, Grep
---

# BDFL Migrate

Analyse an existing project's progress toward the BDFL architecture, identify the next milestone, and report the gap.

## Variables

### Inputs

- `PROJECT_ROOT`: current working directory (project root under analysis)

## References

Load and read both of these in full before proceeding:

- [Architecture Reference](./references/architecture.md) — the target state
- [Migration Milestones](./references/milestones.md) — ordered phases with done criteria

## Instructions

1. Read both references above in full
2. Check for `.bdfl.yaml` in `$PROJECT_ROOT`
   - **If missing**: this is a first run — proceed to step 3
   - **If present**: read it, find the first phase that is not `done` or `skipped`, proceed to step 4
3. **First run — generate `.bdfl.yaml`**: Analyse the project and determine which early phases are already satisfied. Walk phases **in order** — check each phase's done criteria from milestones.md against the current project state. Mark phases as `done` only while all preceding phases are also `done` or `skipped`. Once you hit the first phase that isn't satisfied, mark it and all remaining phases as `pending` (even if a later phase might appear to be met — it hasn't been verified in the context of a stable migration). Mark phases as `skipped` only when they genuinely do not apply (e.g. `monorepo` for a single-package project). Write `.bdfl.yaml` and proceed to step 4.
4. **Identify the current phase**: Walk the phases in order. The current phase is the first one with status `pending` or `in-progress`.
   - If all phases are `done` or `skipped`: congratulate the user — the project is BDFL-certified. Stop here.
5. **Analyse the gap**: Compare the project's current state against the current phase's done criteria. Be specific about what exists and what's missing.
6. **Report**: Present a concise summary:
   - Current phase name and what it achieves
   - The done criteria for this phase
   - What the project already has (if anything)
   - What's missing — the concrete gap
   - If the phase status was `pending`, update `.bdfl.yaml` to `in-progress`
7. **On re-run after implementation**: If the current phase is `in-progress`, verify each done criterion. If all are met, update `.bdfl.yaml` to `done` and report the next phase (go to step 4). If not all met, report what's still missing.

## Rules

- Never execute migration work — only analyse and report
- Never propose how to break down or implement the work
- Always update `.bdfl.yaml` to reflect current state
- Phases must be completed in order — do not skip ahead (except marking a phase as `skipped` when it genuinely does not apply)
- When checking done criteria, be concrete — run commands, check files, verify configuration
