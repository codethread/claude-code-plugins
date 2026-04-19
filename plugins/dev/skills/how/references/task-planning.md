# Task Planning

## Sizing Rules

A task is too big if:

- It touches more than 3-4 files
- It has more than 5 acceptance criteria
- It requires understanding the output of a previous task that hasn't been built yet
- You can't describe what "done" looks like in 2-3 sentences

### Right-Sized Examples

- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

### Too Big

- "Build the entire dashboard"
- "Add authentication"
- "Refactor the API layer"

### Splitting Heuristic

If a task feels too big, ask: "Could an agent complete this in one context window without needing to reference its own earlier output?" If not, split at the natural seam — usually the boundary between data model, logic, and UI.

## Ordering Convention

Dependencies first:

1. Schema / data model changes
2. Backend / business logic
3. UI components
4. Integration / aggregation
5. Polish / edge cases

If task B reads from a table that task A creates, A comes first. If two tasks are independent, keep the lower-risk one first — a failure there is cheaper to debug with less code in play.
