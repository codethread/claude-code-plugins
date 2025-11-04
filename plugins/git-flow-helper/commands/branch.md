# Git Branch Management Command

Create, switch, and manage git branches with smart naming conventions and workflow support.

## What to do

When the user invokes this command with `/branch`, help them with git branch operations:

1. **Creating new branches**:
   - Ask for the branch type (feature/bugfix/hotfix/release)
   - Suggest conventional naming: `<type>/<ticket-id>-<description>`
   - Example: `feature/PROJ-123-add-login-flow`
   - Create the branch and switch to it
   - Optionally push to remote with tracking

2. **Switching branches**:
   - If no argument provided, show interactive list of branches
   - If partial name provided, fuzzy match and switch
   - Show status of the branch after switching

3. **Branch cleanup**:
   - List merged branches that can be deleted
   - Offer to delete them after confirmation
   - Clean up remote tracking branches

4. **Branch information**:
   - Show current branch status
   - Display commits ahead/behind remote
   - Show recent branches worked on

## Examples

```
User: /branch
You: I'll help you manage git branches. What would you like to do?
1. Create a new branch
2. Switch to existing branch
3. Clean up merged branches
4. Show branch information

User: /branch feature user-auth
You: I'll create a feature branch for user authentication.
[Creates feature/user-auth branch]
Branch created and switched. Would you like to push to remote?
```

## Usage patterns

- `/branch` - Interactive branch management menu
- `/branch <name>` - Switch to or create branch with name
- `/branch -c <name>` - Create new branch
- `/branch -d` - Delete merged branches
- `/branch -i` - Show branch information
