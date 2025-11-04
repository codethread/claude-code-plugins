# Code Snippet Management

Save, retrieve, and insert code snippets with template variable support.

## What to do

When the user invokes `/snippet`, help them manage code snippets:

1. **Save new snippets**:
   - Ask for snippet name
   - Ask for language/category
   - Capture the code
   - Identify template variables (`${varName}` syntax)
   - Save to `~/.claude/snippets/<category>/<name>.json`

2. **List snippets**:
   - Show all available snippets grouped by category
   - Allow filtering by language, tags, or search term

3. **Insert snippets**:
   - Find snippet by name or interactive search
   - Prompt for template variable values
   - Substitute variables in template
   - Insert the code

4. **Edit/Delete snippets**:
   - Open snippet in editor or delete after confirmation

## Template Variables

Variables use `${varName}` syntax:
- `${name}` - Simple substitution
- `${name:default}` - With default value

## Examples

```
User: /snippet save
You: I'll help you save a code snippet. What would you like to name it?
User: react-hook
You: What language/category?
User: typescript
You: Please provide the code:
[User pastes code]
You: I detected template variables: hookName, initialValue
Add a description?
User: Custom React hook template
You: Snippet saved! Use /snippet insert react-hook to use it.

User: /snippet insert react-hook
You: What value for hookName?
User: useCounter
What value for initialValue?
User: 0
[Inserts the code with substitutions]
Done!
```

## Storage

Snippets stored in `~/.claude/snippets/<category>/<name>.json`
