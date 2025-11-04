# Conventional Commit Command

Create git commits following the Conventional Commits specification.

## What to do

When the user invokes `/conventional-commit`, guide them through creating a properly formatted conventional commit:

1. **Analyze staged changes**:
   - Run `git diff --staged` to see what's being committed
   - Identify the nature of changes (feature, fix, docs, style, refactor, test, chore)

2. **Interactive commit creation**:
   - Ask for commit type: feat|fix|docs|style|refactor|test|chore|perf|ci|build
   - Ask for scope (optional): component, file, or module affected
   - Ask for description: short summary in present tense
   - Ask if breaking change (add ! if yes)
   - Ask for body (optional): detailed explanation
   - Ask for footer (optional): references like "Closes #123"

3. **Format the commit**:
   ```
   <type>[optional scope]: <description>

   [optional body]

   [optional footer]
   ```

4. **Preview and confirm**:
   - Show the formatted commit message
   - Confirm with user before committing
   - Execute `git commit` with the message

## Conventional Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style/formatting (no logic change)
- `refactor`: Code restructuring (no feature change)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

## Examples

```
User: /conventional-commit
You: I'll help you create a conventional commit. I see you have staged changes.
[Shows git diff summary]

What type of change is this?
1. feat - New feature
2. fix - Bug fix
3. docs - Documentation
...

User: 1
You: What scope does this affect? (e.g., auth, ui, api) [optional]
User: auth
You: Describe the change in present tense:
User: add JWT token refresh mechanism
You: Is this a breaking change? (y/n)
User: n
You: Add detailed body? (y/n)
User: n
You: Add footer (e.g., "Closes #123")? (y/n)
User: y
User: Closes #456

Preview:
feat(auth): add JWT token refresh mechanism

Closes #456

Commit this message? (y/n)
```

## Reference

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- Breaking changes: Add `!` after type/scope, e.g., `feat!: remove API v1`
