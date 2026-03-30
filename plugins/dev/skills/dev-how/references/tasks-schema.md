# tasks.yml Schema

```yaml
project: "project-name"
prd: "prd.md"
description: "Brief feature description"

requirements:
  - name: "Database running"
    check: "pg_isready -h localhost"
  - name: "Environment configured"
    check: "test -f .env"

tasks:
  - id: "001"
    title: "Add priority column to tasks table"
    description: |
      Add a priority enum column to the tasks table.
      Valid values: high, medium, low. Default: medium.
    status: "pending"
    files:
      create:
        - "src/db/migrations/003-add-priority.sql"
      modify:
        - "src/db/schema.ts"
    acceptance:
      - "Migration runs without error"
      - "Schema types updated"
      - "Typecheck passes"
    notes: ""

  - id: "002"
    title: "Add priority to task creation API"
    description: |
      Accept optional priority field in create-task endpoint.
      Validate against enum values. Default to medium.
    status: "pending"
    files:
      modify:
        - "src/api/tasks.ts"
        - "src/api/tasks.test.ts"
    acceptance:
      - "POST /tasks accepts priority field"
      - "Invalid priority values rejected with 400"
      - "Missing priority defaults to medium"
      - "Tests pass"
      - "Typecheck passes"
    notes: ""

qa:
  agent:
    - "All tests pass"
    - "Typecheck clean"
    - "Lint clean"
  human:
    - "Priority badge looks correct in UI"
    - "Priority filter works intuitively"
```

## Field Reference

| Field | Required | Description |
|---|---|---|
| `project` | yes | Project name |
| `prd` | yes | Path to the PRD file |
| `description` | yes | One-line feature summary |
| `requirements` | no | Pre-conditions with check commands |
| `tasks` | yes | Ordered list of implementation tasks |
| `tasks[].id` | yes | Unique task ID (zero-padded number) |
| `tasks[].title` | yes | Brief task title |
| `tasks[].description` | yes | What to implement |
| `tasks[].status` | yes | `pending`, `in_progress`, `done`, `blocked`, `fatal` |
| `tasks[].files.create` | no | Files this task creates |
| `tasks[].files.modify` | no | Files this task modifies |
| `tasks[].acceptance` | yes | Verifiable acceptance criteria |
| `tasks[].notes` | no | Populated during build with learnings |
| `qa.agent` | yes | Agent-verifiable end-to-end checks |
| `qa.human` | yes | Human-verifiable checks |

## Status Values

- `pending` — not started
- `in_progress` — currently being worked on
- `done` — completed and committed
- `blocked` — environmental issue, user must fix (e.g. port in use, missing binary)
- `fatal` — plan is wrong, go back to `/dev-what` or `/dev-how`
