# Langs Plugin

OPINIONATED Language-specific coding skills

## Installation

```bash
/plugin install langs@personal-configs-plugins
```

## Available Skills

### lang-react

```bash
/skill lang-react
```

**Core philosophy:**

- Components consume external state, contain no logic
- No useState/useReducer/useEffect for complex logic
- Inline actions unless repeated 2+ times
- Test stores/machines (unit tests), not components (E2E only)

### lang-typescript

```bash
/skill lang-typescript
```

Write clean, type-safe TypeScript code using modern patterns, strict configuration, and best practices.

**Provides:**

- Type decision tree (interface vs type, unknown vs any, branded types)
- State modeling with discriminated unions
- Runtime validation workflow (type guards, schema validation with Zod)
- Strict tsconfig.json configuration checklist
- Code organization rules (barrel files, path aliases)
- Error handling patterns
- Readonly patterns and utility types

**Includes reference:**

- `references/best-practices-2025.md` - Comprehensive TypeScript best practices guide with advanced patterns, complete tsconfig options, modern features, and common anti-patterns

**Quality checklist:**

- External data validated (not just typed)
- No `any` types (or explicitly justified)
- State machines use discriminated unions
- Utility types used where applicable
- Readonly applied to prevent mutations
- Exhaustiveness checks with `never`
