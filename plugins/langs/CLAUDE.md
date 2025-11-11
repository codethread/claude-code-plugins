# Langs Plugin - Maintainer Documentation

This document is for developers maintaining or modifying the `langs` plugin. For end-user documentation, see [README.md](./README.md).

## Plugin Architecture

The `langs` plugin provides language-specific coding expertise through a collection of skills. Each skill focuses on a specific programming language or framework, providing best practices, patterns, and expert guidance.

### Design Principles

1. **Language-specific expertise:** Each skill focuses on one language/framework
2. **Practical patterns:** Emphasize real-world, actionable patterns over theory
3. **Opinionated guidance:** Provide clear recommendations, not just options
4. **Reference integration:** Include detailed references for comprehensive guidance

## Directory Structure

```
plugins/langs/
├── README.md                    # End-user documentation
├── CLAUDE.md                   # This file - maintainer documentation
├── hooks/                      # Auto-detection hooks
│   ├── hooks.json             # Hook configuration
│   ├── package.json           # Dependencies
│   └── test-file-suggest.ts   # PostToolUse hook
└── skills/
    ├── lang-react/
    │   └── SKILL.md            # React expert skill
    └── lang-typescript/
        ├── SKILL.md            # TypeScript expert skill
        └── references/
            └── best-practices-2025.md  # Comprehensive TS guide
```

### Component Responsibilities

#### `hooks/test-file-suggest.ts`

PostToolUse hook - suggests test files when `.ts`/`.tsx` source files are read.

**Behavior:**
- Triggers after Read tool on `.ts`/`.tsx` (excluding test files)
- Searches for `.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`
- Injects context via `hookSpecificOutput.additionalContext`

**Test:**
```bash
cd plugins/langs/hooks
touch /tmp/example.ts /tmp/example.test.ts
cat <<'EOF' | bun test-file-suggest.ts
{"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"PostToolUse","tool_name":"Read","tool_input":{"file_path":"/tmp/example.ts"},"tool_response":"file content"}
EOF
# Should output hookSpecificOutput JSON. Remove .test.ts to verify no output.
```

**Troubleshoot:**
- Verify plugin installed: `/plugin list`
- Check dependencies: `cd hooks && bun install`
- Ask Claude: "What PostToolUse hook context did you receive?"

#### `skills/lang-react/SKILL.md`
**Purpose:** React development expertise focusing on external state management

**Contains:**
- Core philosophy (components consume state, no internal logic)
- State management stack (Zustand, XState, TanStack Query)
- Component pattern (external hooks → early returns → JSX)
- Testing approach (stores/machines with Vitest, not components)
- Unique patterns (prop ordering, inline props, pattern matching)
- Performance guidelines (profile first)
- Styled-components patterns (consolidate with CSS selectors)

**Design note:** Opinionated approach that diverges from common React patterns. Emphasizes testability through store-based architecture.

#### `skills/lang-typescript/SKILL.md`
**Purpose:** TypeScript development expertise with focus on type safety

**Contains:**
- Type decision tree (interface vs type, unknown vs any, branded types)
- State modeling with discriminated unions
- Runtime validation workflow (type guards, Zod)
- Strict tsconfig.json configuration
- Code organization rules (barrel files, path aliases)
- Error handling patterns
- Utility types reference
- Quality checklist

**Design note:** Bridges compile-time type safety with runtime validation. Emphasizes practical patterns over complex type gymnastics.

#### `skills/lang-typescript/references/best-practices-2025.md`
**Purpose:** Comprehensive TypeScript reference with advanced patterns

**Contains:**
- Advanced type patterns (conditional types, mapped types, branded types)
- Complete tsconfig.json options with rationale
- Modern features (decorators, const type parameters)
- Common anti-patterns and solutions
- Performance considerations

**Design note:** Referenced from SKILL.md for deep dives. Not loaded automatically to save tokens.

## How the Plugin Works

### Skill Loading Flow

1. User executes: `/skill lang-react` or `/skill lang-typescript`
2. Claude loads the appropriate `SKILL.md` into context
3. Skill provides operational patterns for writing code
4. Reference files available but not automatically loaded
5. Claude applies patterns when user writes/refactors code

### Auto-Loading via CLAUDE.md

The root `CLAUDE.md` instructs Claude to:
- **ALWAYS** load `lang-*` skills when working in appropriate files
- Load `lang-react` when writing/updating/reviewing React code
- Load `lang-typescript` when writing TypeScript code

This ensures skills are proactively loaded without user prompting.

### Hook-Based Test File Detection

PostToolUse hook suggests test files when `.ts`/`.tsx` source files are read. Non-intrusive context injection.

## Common Maintenance Tasks

### Adding a New Language Skill

To add a new language (e.g., `lang-python`):

1. **Create skill directory:**
   ```bash
   mkdir -p plugins/langs/skills/lang-python
   ```

2. **Create SKILL.md:**
   ```bash
   cat > plugins/langs/skills/lang-python/SKILL.md << 'EOF'
   ---
   name: python
   description: [Brief description]
   ---

   # Python Expert

   [Skill content following existing patterns]
   EOF
   ```

3. **Update README.md:**
   - Add skill to "Available Skills" section
   - Include usage example
   - Update keywords in frontmatter if present

4. **Update root CLAUDE.md (optional):**
   - Add auto-load instruction for `.py` files
   - Example: "ALWAYS use `lang-python` Skill when writing Python code"

5. **Update marketplace.json keywords (optional):**
   - Add "python" to keywords array

### Updating Skill Content

When updating an existing skill:

1. **Identify the pattern to add/change:**
   - New framework version with breaking changes
   - Better pattern discovered through usage
   - Anti-pattern identified

2. **Update SKILL.md:**
   ```bash
   # Edit the skill
   code plugins/langs/skills/lang-react/SKILL.md
   ```

3. **Test the change:**
   ```bash
   # Load skill in Claude session
   /skill lang-react

   # Test the new pattern
   "Implement a feature using [new pattern]"
   ```

4. **Update README.md if user-facing:**
   - Only if the change affects how users interact with the skill
   - Keep examples current

### Managing References

**When to add references:**
- Skill content exceeds ~200 lines
- Advanced patterns need detailed explanation
- Multiple related patterns form a cohesive guide

**How to add references:**

1. **Create references directory:**
   ```bash
   mkdir -p plugins/langs/skills/lang-[name]/references
   ```

2. **Create reference file:**
   ```bash
   code plugins/langs/skills/lang-[name]/references/advanced-patterns.md
   ```

3. **Link from SKILL.md:**
   ```markdown
   ## Advanced Patterns

   For detailed information on [topic], see `references/advanced-patterns.md`.
   ```

4. **Keep SKILL.md focused:**
   - Main skill should be scannable (~100-200 lines)
   - References contain deep dives

### Maintaining Hooks

**Test and modify:**
1. Edit `hooks/test-file-suggest.ts`
2. Test (see Component Responsibilities section for test commands)
3. Reload plugin

## Architecture Rationale

### Why Separate Skills Per Language?

**Considered alternatives:**
- **Single skill for all languages:** Too large, token-inefficient
- **Commands per language:** Too narrow, less persistent context
- **Agents per language:** Overkill, no complex coordination needed

**Decision:** Separate skills because:
- Users load only what they need (token-efficient)
- Each language has distinct patterns and best practices
- Skills can be updated independently
- Clear scope and boundaries

### Why Opinionated Patterns?

**Philosophy:**
- Provide clear recommendations, not just options
- Save decision time for developers
- Based on real-world experience and testing
- Document the "why" behind opinions

**Example:**
- ❌ "You can use useState or Zustand for state management"
- ✅ "Use Zustand for application state. useState is a last resort for local UI state only."

**Rationale:** Developers seek expert guidance, not a survey of options. Opinionated skills provide actionable direction.

### Why Include References?

**Benefits:**
- Keep main skill focused and scannable
- Provide depth for advanced users
- Reduce token usage (references loaded on demand)
- Easier to update deep content without disrupting main skill

**Trade-off:** Users must know to look for references. Mitigated by clear signposting in SKILL.md.

## Testing the Plugin

### Manual Testing Checklist

When making changes:

- [ ] **Skills load successfully:**
  ```
  /skill lang-react
  /skill lang-typescript
  ```

- [ ] **React patterns work:**
  ```
  /skill lang-react
  Create a form component with validation
  ```
  - Should use external state (Zustand/TanStack Query)
  - Should have external hooks at top
  - Should inline event handlers

- [ ] **TypeScript patterns work:**
  ```
  /skill lang-typescript
  Validate this API response [paste data]
  ```
  - Should use runtime validation (Zod)
  - Should use discriminated unions for states
  - Should avoid `any`

- [ ] **Auto-loading works (if configured in root CLAUDE.md):**
  - Edit a `.tsx` file
  - Claude should proactively load `lang-react` skill
  - Edit a `.ts` file
  - Claude should load `lang-typescript` skill

### Validation Against Real Code

Periodically test skills against real projects:

1. **Take a real component/module**
2. **Ask Claude to refactor using skill**
3. **Verify patterns applied:**
   - React: External state, no internal logic, testable stores
   - TypeScript: Runtime validation, discriminated unions, strict types

## Common Pitfalls to Avoid

### For Maintainers

**Don't:**
- ❌ Make skills too generic (use specific, actionable patterns)
- ❌ Include every possible pattern (focus on most valuable 20%)
- ❌ Let skills grow beyond ~200 lines (use references for depth)
- ❌ Document obvious patterns Claude already knows

**Do:**
- ✅ Focus on opinionated, unique patterns
- ✅ Include anti-patterns (what to avoid)
- ✅ Keep skills scannable with clear sections
- ✅ Test patterns with real code

### For Skill Content

**Don't:**
- ❌ Prescribe patterns without explaining "why"
- ❌ Use abstract advice ("write clean code")
- ❌ Include patterns that conflict with each other
- ❌ Assume one-size-fits-all solutions

**Do:**
- ✅ Explain rationale for recommendations
- ✅ Provide concrete, copy-pasteable examples
- ✅ Acknowledge trade-offs explicitly
- ✅ Show decision frameworks (when X vs Y)

## Version History

Track significant changes:

1. **Update version in marketplace.json:**
   ```json
   {
     "name": "langs",
     "version": "1.1.0",
     ...
   }
   ```

2. **Document in git commit:**
   ```
   langs: Add Python skill

   - Created lang-python skill for Python development
   - Added type hinting and dataclass patterns
   - Updated README with Python examples
   ```

## Related Documentation

- **Repository root CLAUDE.md:** Overall plugin architecture
- **doc-writer plugin:** For documenting these skills
- **spec-dev plugin:** For implementing features using these skills

## Future Enhancement Ideas

Potential skills to add:

1. **lang-python:** Python best practices with type hints, dataclasses, async patterns
2. **lang-rust:** Rust ownership patterns, error handling, trait usage
3. **lang-go:** Go idioms, error handling, concurrency patterns
4. **lang-sql:** SQL query patterns, indexing, optimization
5. **lang-css:** Modern CSS patterns, Tailwind conventions, design systems

**Note:** Add new skills based on user demand and maintainer expertise.
