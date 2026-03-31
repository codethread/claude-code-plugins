# BDFL

Opinionated project architecture bootstrapping and incremental migration.

## What

- `/bdfl:init` — scaffold a new project from scratch at full BDFL standard
- `/bdfl:migrate` — analyse an existing project, track progress through ordered milestones toward BDFL certification

## Why

- Consistent architecture across all projects
- Ordered milestones avoid big-bang rewrites — one phase at a time
- Codifies tooling and architecture decisions so you don't re-decide every time
- Tracks migration progress in `.bdfl.yaml` so you can pick up where you left off

## How

### Install

```
/plugin install bdfl@codethread-plugins
```

### Use

Bootstrap a new project:

```
/bdfl:init a web dashboard for monitoring CI pipelines, needs server + web components
```

Migrate an existing project (run repeatedly, one phase at a time):

```
/bdfl:migrate
```
