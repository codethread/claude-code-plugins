# BDFL

Opinionated project architecture bootstrapping and incremental migration.

## What

- `/init` — scaffold a new project from scratch with the BDFL stack
- `/migrate` — analyse an existing project and migrate it one step at a time toward the target architecture

## Why

- Consistent architecture across all projects
- Incremental migration avoids big-bang rewrites
- Codifies tooling decisions so you don't re-decide every time

## How

### Install

```
/plugin install bdfl@codethread-plugins
```

### Use

```
/bdfl:init a web dashboard for monitoring CI pipelines, needs server + web components
```

```
/bdfl:migrate
```
