# Claude Code Plugin Marketplace

A local plugin marketplace for PersonalConfigs with two example plugins.

## Quick Start

### 1. Add the Marketplace

In Claude Code, run:
```
/plugin marketplace add ./
```

This registers the local marketplace from this repository.

### 2. Install Plugins

```
/plugin install git-flow-helper@personal-configs-plugins
/plugin install code-snippets@personal-configs-plugins
```

### 3. Use the Plugins

After installation, restart Claude Code and use:

**Git Flow Helper:**
- `/branch` - Branch management
- `/conventional-commit` - Conventional commits
- Use the `git-flow-specialist` agent for expert help

**Code Snippets:**
- `/snippet` - Full snippet management
- `/snip` - Quick snippet access
- Use the `snippet-organizer` agent to organize your library
- Activate the `snippet-manager` skill for snippet-aware coding

## Available Plugins

### git-flow-helper

Enhanced git workflow commands and agents for branch management, commit conventions, and PR workflows.

**Provides:**
- Commands: `/branch`, `/conventional-commit`
- Agents: `git-flow-specialist`

### code-snippets

Save, organize, and quickly insert code snippets with template variables.

**Provides:**
- Commands: `/snippet`, `/snip`
- Agents: `snippet-organizer`
- Skills: `snippet-manager`

## Managing Plugins

```bash
# List marketplaces
/plugin marketplace list

# List installed plugins
/plugin list

# Uninstall a plugin
/plugin uninstall git-flow-helper

# Remove marketplace
/plugin marketplace remove personal-configs-plugins
```

## Directory Structure

```
.claude-plugin/
├── marketplace.json          # Marketplace catalog
└── plugins/
    ├── git-flow-helper/
    │   ├── plugin.json
    │   ├── commands/
    │   │   ├── branch.md
    │   │   └── conventional-commit.md
    │   └── agents/
    │       └── git-flow-specialist.md
    └── code-snippets/
        ├── plugin.json
        ├── commands/
        │   ├── snippet.md
        │   └── snip.md
        ├── agents/
        │   └── snippet-organizer.md
        └── skills/
            └── snippet-manager.md
```

## Creating Your Own Plugin

1. **Create plugin directory:**
   ```bash
   mkdir -p .claude-plugin/plugins/my-plugin/commands
   ```

2. **Create `plugin.json`:**
   ```json
   {
     "name": "my-plugin",
     "description": "What it does",
     "version": "1.0.0",
     "author": "Your Name",
     "keywords": ["tag1", "tag2"]
   }
   ```

3. **Add command** (`commands/my-command.md`):
   ```markdown
   # My Command

   What this command does and how to use it.
   ```

4. **Register in `marketplace.json`:**
   ```json
   {
     "plugins": [
       {
         "name": "my-plugin",
         "description": "What it does",
         "version": "1.0.0",
         "source": "./plugins/my-plugin"
       }
     ]
   }
   ```

5. **Install:**
   ```
   /plugin install my-plugin@personal-configs-plugins
   ```

## Reference

- [Official Plugin Marketplace Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
