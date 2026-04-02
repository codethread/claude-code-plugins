# Plugin Marketplace Specification

**Status:** Implemented
**Last Updated:** 2026-04-02

## 1. Overview

### Purpose

Registration, versioning, and discovery layer for a local Claude Code plugin ecosystem. A static JSON catalog (`marketplace.json`) declares all available plugins with their versions and source paths. Individual plugin manifests (`plugin.json`) carry metadata that travels with each plugin. Together they enable Claude Code's CLI to discover, install, and load plugins from a single marketplace repository.

### Goals

- Single source of truth for plugin versions (marketplace.json, not individual manifests)
- Self-describing plugins via lightweight manifests (name, description, keywords)
- Predictable directory conventions so Claude Code auto-discovers hooks, commands, agents, and skills
- Support multiple marketplace coexistence on one machine via unique marketplace names

### Non-Goals

- Runtime plugin loading or dependency resolution — Claude Code handles that externally
- Cross-marketplace version coordination — each marketplace is independent
- Plugin dependency graphs — plugins are standalone; shared code lives in `lib/`
- Remote registry or network-based discovery — this is a local git-based marketplace

## 2. Architecture

### Two-Layer Manifest Model

```
.claude-plugin/marketplace.json          ← catalog (versions, sources, categories)
plugins/<name>/.claude-plugin/plugin.json ← manifest (metadata only, no version)
```

**Marketplace catalog** is the control plane: it lists every plugin with its version, relative source path, and category. This is what Claude Code reads to enumerate available plugins.

**Plugin manifests** are the data plane: they carry identity metadata (name, description, author, keywords) that travels with the plugin. They deliberately omit `version` to avoid silent overrides.

### Directory Convention

Each plugin follows a predictable structure that Claude Code auto-discovers:

```
plugins/<name>/
├── .claude-plugin/
│   └── plugin.json          # Manifest (required)
├── commands/                 # Slash commands (.md files)
├── agents/                   # Agent definitions (.md files)
├── skills/<skill>/SKILL.md   # Skill definitions
├── hooks/
│   ├── hooks.json            # Hook config (auto-loaded by Claude Code)
│   └── *.ts                  # Hook scripts
├── README.md                 # User guide (What/Why/How)
├── CHANGELOG.md              # Version history (managed by /release)
├── package.json              # Workspace config (if TypeScript present)
└── tsconfig.json             # TypeScript config (if TypeScript present)
```

### Build-Time Integration

`lib/session-cache.ts` imports `marketplace.json` at build time to derive the cache namespace:

```typescript
import marketplace from '../.claude-plugin/marketplace.json' with { type: 'json' };
const CACHE_BASE = join(homedir(), '.local/cache', marketplace.name);
```

This ties cache isolation to marketplace identity — if multiple marketplaces coexist, their caches never collide.

### Workspace Configuration

The repo uses bun workspaces. Each plugin with TypeScript has:
- A `package.json` with `@claude-plugins/<name>` package name
- A `tsconfig.json` extending `tsconfig.base.json` with `composite: true`
- A reference in root `tsconfig.json` for project-reference builds

## 3. Data Model

### marketplace.json Schema

```typescript
interface Marketplace {
  name: string;                    // Unique marketplace identifier (e.g. "codethread-plugins")
  owner: {
    name: string;
    email: string;
  };
  metadata: {
    description: string;
  };
  plugins: PluginEntry[];
}

interface PluginEntry {
  name: string;                    // Plugin name, matches directory and plugin.json name
  version: string;                 // Semver — single source of truth for plugin version
  source: string;                  // Relative path to plugin directory (e.g. "./plugins/dev")
  category: "development-tools" | "development-workflow";
}
```

### plugin.json Schema

```typescript
interface PluginManifest {
  name: string;                    // Must match marketplace entry name
  description: string;             // Human-readable description
  author: {
    name: string;
  };
  keywords: string[];              // Discovery tags
  hooks?: string;                  // ONLY for additional hook files beyond standard location
}
```

**Invariant:** `plugin.json` must never contain a `version` field. For relative-path plugins, `plugin.json` version silently overrides `marketplace.json`, breaking the single-source-of-truth guarantee.

**Invariant:** `plugin.json` must not reference `./hooks/hooks.json` or `hooks/hooks.json` in its `hooks` field. Claude Code auto-loads hooks from the standard location; referencing it causes duplicate registration.

### Current Plugin Inventory

| Plugin | Version | Category |
|---|---|---|
| doc-writer | 1.0.1 | development-tools |
| claude-code-knowledge | 1.5.0 | development-tools |
| langs | 1.0.1 | development-tools |
| bdfl | 1.1.1 | development-workflow |
| karen | 1.0.0 | development-workflow |
| dev | 1.5.0 | development-workflow |

## 4. Interfaces

### External CLI (Claude Code built-in)

```bash
/plugin marketplace add <git-url>       # Register marketplace location
/plugin install <plugin>@<marketplace>  # Install a plugin
/plugin list                            # Enumerate installed plugins
```

### Release Command (`/release`)

The `/release` slash command manages the version lifecycle:

1. Detects changed plugins from git diff
2. Bumps `version` in `marketplace.json` (patch/minor/major)
3. Creates/updates `plugins/<name>/CHANGELOG.md` with dated entries
4. Commits with conventional format: `type(plugin1,plugin2): description`
5. Creates annotated git tags: `<plugin-name>-v<version>`
6. Does NOT push — user reviews with `git show` first

### Plugin Suggestions (Hook Convention)

Plugins with hooks emit suggestions via XML tags in `additionalContext`:

- **Plugin hooks:** `<plugin-PLUGINNAME-suggestion>` (e.g. `<plugin-langs-suggestion>`)
- **Project hooks:** `<project-HOOKNAME-suggestion>` (e.g. `<project-stop-doc-check-suggestion>`)

Users control attention via CLAUDE.md rules (e.g. `Follow all <plugin-*-suggestion> tags`).

### Environment Variable

```bash
CT_PLUGINS_DIR=~/.claude/plugins/marketplaces/codethread-plugins/plugins
```

Required for plugin scripts that reference other plugin directories at runtime.

## 5. Design Decisions

- **Version in catalog, not manifest**: Prevents silent override behavior where `plugin.json` version would take precedence over `marketplace.json` for relative-path plugins. Centralizing versions also makes `/release` simpler — one file to update.
- **Relative source paths**: `source` in marketplace.json uses `./plugins/<name>` rather than absolute paths. The marketplace repo is portable and works from any checkout location.
- **Category taxonomy**: Only two categories (`development-tools`, `development-workflow`) — intentionally coarse. Adding categories is easy; removing them requires migration.
- **No hooks field by default**: Claude Code auto-discovers `hooks/hooks.json` from the standard plugin location. The `hooks` manifest field exists only for non-standard additional hook files, preventing duplicate registration errors.
- **Marketplace name as namespace**: The `name` field in marketplace.json serves double duty — it's both a human identifier and a filesystem namespace for session caches. Changing it would orphan existing caches.
- **Git tags for versioning**: Each release creates `<plugin-name>-v<version>` tags, enabling per-plugin version history in a monorepo where all plugins share a single git history.

## 6. Open Questions

- **Plugin removal workflow**: No defined process for removing a plugin from the marketplace. Deleting the directory and entry works, but installed copies on user machines would remain.
- **Category expansion**: Current two-category taxonomy may need expansion as the marketplace grows. No migration mechanism exists for re-categorizing plugins.
- **Version conflict detection**: Nothing prevents a `/release` from creating a version that already exists as a git tag. The tag command would fail, but earlier steps (marketplace.json update, changelog) would already be committed.
