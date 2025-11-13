# Language-Specific Patterns

OPINIONATED coding patterns for React and TypeScript with automatic test file detection.

## What

**Skills**: `lang-react`, `lang-typescript`

**Hook**: Suggests test files for `.ts`/`.tsx` files

## Why

**React**:
- Components consume external state, no internal logic
- Test stores/machines, not components
- Inline actions unless repeated

**TypeScript**:
- Type safety + runtime validation
- Discriminated unions for state
- Strict configuration
- No `any` types

## How

### Install

```bash
/plugin install langs@codethread-plugins
```

### Use

```bash
/skill lang-react      # Load before writing React code
/skill lang-typescript # Load before writing TypeScript code
```

**Ask Claude for details:**
```
What's the React philosophy?
Show me TypeScript patterns
What's in the best-practices reference?
```
