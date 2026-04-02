# Dev Enhancements Specification

**Status:** Draft
**Last Updated:** 2026-04-02

## 1. Overview

### Purpose

Planned enhancements to the dev workflow plugin that graduate prompt-based behaviours into automated enforcement and reduce manual user orchestration.

### Goals

- Enforce phase discipline via hooks rather than relying on prompt instructions
- Automate the build loop so users don't need a manual `while true` wrapper
- Provide structured telemetry for build sessions

### Non-Goals

- Changing the core phase model (What/How/Build) — that's stable
- Multi-repo or team coordination features

## 2. Wave 2 — Quality Gates and Stage Enforcement

### Quality gate stop hook

A PostToolUse hook that runs quality checks (typecheck, lint, tests) automatically after implementation, removing the need for the build skill prompt to instruct this.

### `DEVFLOW_STAGE` env var

Environment variable set by each skill invocation (`what`, `how`, `build`) so hooks and scripts can determine which phase is active.

### Stage-aware write guard (PreToolUse hook)

A PreToolUse hook that restricts file writes based on the current stage — e.g. preventing implementation file edits during the What phase, or `.dev/prd.md` edits during Build.

## 3. Wave 3 — Build Loop Runner

### `cc-devflow build` loop runner

Replaces the user's manual `while true; do claude --print "dev/build"; done` with an automated runner that handles:
- Looping `dev/build` until all tasks are done or a fatal/blocked status is hit
- Aggregating results across iterations

### stats.json

Structured telemetry for build sessions — task durations, retry counts, quality check results.

### Structured logging

Machine-readable build logs alongside the human-readable `progress.md`.
