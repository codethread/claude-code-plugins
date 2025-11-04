# Snippet Manager Skill

Activate snippet management capabilities for quick code insertion.

## Skill Overview

This skill enables you to work with code snippets throughout any coding session:
- Save code as snippets on the fly
- Insert snippets during code generation
- Use snippet templates for repetitive patterns
- Reference snippet library for examples

## When to Use

Load this skill when:
- User mentions working with snippets
- Task involves repetitive code patterns
- User wants to save/reuse code blocks
- Building boilerplate code

## Capabilities

### Quick Save
During any coding task:
```
User: That error handler is good. Save it as a snippet?
You: I'll save this as a snippet.
[Saves to ~/.claude/snippets/nodejs/error-handler.json]
Saved! Use /snippet insert error-handler later.
```

### Quick Insert
Reference and insert existing snippets:
```
User: Add the standard Express middleware
You: I'll use the express-middleware-setup snippet.
[Inserts snippet with substitutions]
```

### Template Awareness
Suggest using snippets for common patterns:
```
User: Create a React component
You: You have a react-component snippet. Use that template or create from scratch?
```

## Variable Substitution

When inserting snippets:
1. Identify all `${varName}` patterns
2. Check for defaults: `${varName:defaultValue}`
3. Prompt user for values
4. Substitute and format

## Best Practices

1. **Save strategically**: Not every code block needs to be a snippet
2. **Good naming**: Use descriptive, searchable names
3. **Templates**: Identify variable parts
4. **Documentation**: Add clear descriptions
5. **Organization**: Keep categories clean

## Storage

- Snippets directory: `~/.claude/snippets/`
- Index file: `~/.claude/snippets/index.json`
