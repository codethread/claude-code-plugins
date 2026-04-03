# systems.yml Schema

```yaml
version: 1
generated: "2026-04-02"
scope: "."

systems:
  - id: "001"
    domain: "plugin-marketplace"
    aliases:
      - "marketplace"
      - ".claude-plugin"
    target: "plugin marketplace"
    spec: "specs/plugin-marketplace.md"
    status: "pending"
    action: "create"
    code:
      - ".claude-plugin/marketplace.json"
      - "plugins/*/.claude-plugin/plugin.json"
    rationale: "Marketplace catalog and plugin manifest conventions"
    notes: ""

  - id: "002"
    domain: "project-hooks"
    aliases:
      - ".claude/hooks"
      - "hooks"
    target: ".claude/hooks"
    spec: "specs/project-hooks.md"
    status: "pending"
    action: "create"
    code:
      - ".claude/settings.json"
      - ".claude/hooks/"
    rationale: "Project hook runtime, nix wrapper, and stop-doc-check flow"
    notes: ""

covered:
  - domain: "dev-workflow"
    spec: "specs/dev-workflow.md"
    code:
      - "plugins/dev/"
    rationale: "Workflow phases and reverse-spec flow already documented"
```

## Field Reference

| Field | Required | Description |
|---|---|---|
| `version` | yes | Schema version |
| `generated` | yes | Date the backlog was last regenerated |
| `scope` | yes | Survey root or subtree used to produce the backlog |
| `systems` | yes | Actionable reverse backlog items |
| `systems[].id` | yes | Unique zero-padded ID |
| `systems[].domain` | yes | Stable domain name for the eventual spec |
| `systems[].aliases` | no | Alternate names or paths that should resolve to this item |
| `systems[].target` | yes | Input `/dev:reverse` should consume |
| `systems[].spec` | yes | Expected spec file path |
| `systems[].status` | yes | `pending`, `in_progress`, `done`, `blocked`, `split`, `skipped` |
| `systems[].action` | yes | `create` or `update` |
| `systems[].code` | yes | Code paths or globs that define the domain |
| `systems[].rationale` | yes | Why this domain deserves a spec |
| `systems[].notes` | no | Freeform notes populated during reverse work |
| `covered` | no | Existing specs already covering scoped systems |
| `covered[].domain` | yes | Existing domain name |
| `covered[].spec` | yes | Existing spec path |
| `covered[].code` | yes | Code locations mapped by that spec |
| `covered[].rationale` | yes | Why the domain is considered covered |

## Status Values

- `pending` — queued but not started
- `in_progress` — currently being reversed
- `done` — spec created or refreshed and aligned
- `blocked` — cannot proceed until an external issue is resolved
- `split` — original domain was too broad; replace with narrower items
- `skipped` — intentionally not being reversed after review

## Action Values

- `create` — no spec exists yet; `/dev:reverse` should create one
- `update` — spec exists but needs to be refreshed against code reality

## Queue Rules

- `systems:` contains only actionable backlog items
- `covered:` is informational and should not be looped over
- IDs should remain stable once humans start referencing them
- `target` should be something `/dev:reverse` can consume without reinterpretation
- If a system is split, keep the old item with `status: split` and add new items with fresh IDs
