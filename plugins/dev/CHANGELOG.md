# Changelog

## v1.5.0 - 2026-04-02

- Added `dev/systems` skill: surveys a repo or subtree and writes a reverse-spec backlog to `specs/systems.yml`
- Added `references/systems-schema.md`: queue format for planned reverse-spec work
- `dev:reverse` now supports dual-mode execution: queued backlog items from `specs/systems.yml` and existing freeform string/path targets
- `dev:reverse` now updates backlog item status for queued reverse work (`in_progress`, `done`, `blocked`, `split`)

## v1.4.1 - 2026-04-02

- `dev:reverse`: simplified Wide Survey to a single Explore agent (Wave 1) rather than multiple parallel agents — cleaner orchestration, output drives Wave 2

## 2026-04-02 (2)

- `dev:reverse`: parallel wide survey before deep dive — all docs/structure loaded concurrently upfront
- `dev:reverse`: parallel deep dives per component/subsystem after survey
- `dev:reverse`: new consolidation step — deletes internal docs absorbed into the spec (CLAUDE.md, arch sections of README)

## 2026-04-02

- Added `dev/specs` skill: writes persistent domain specs from code reality, decoupled from dev flow
- Added `specs/` convention: domain-organized persistent knowledge (vs `.dev/` transient scratchpad)
- Modified `dev/what`: reads existing `specs/` before planning to build on architectural knowledge
- Refactored `dev/done` into a coordinator: delegates review to `spec-reviewer`, checkout/worktree operations to `worktree-manager`
- Added `spec-reviewer` agent: compares specs vs code (+ PRD if present), supports post-build and reverse modes
- Added `worktree-manager` agent: assesses checkout safety, prepares isolation, and handles feature cleanup + squash merge
- Added `/dev:reverse` command: reverse-engineers domain specs from existing code
- Added `references/spec-schema.md`: spec template and `specs/README.md` index format

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
