# Claude Code Knowledge Skill - Development Guide

This skill provides Claude with access to official Claude Code documentation and comprehensive skill creation guidance with helper scripts.

## Architecture

### Multi-Strategy Trigger Architecture

This plugin uses **three complementary mechanisms** to ensure Claude has documentation access:

1. **Model-Invoked Skill** - Claude decides based on SKILL.md description field
2. **UserPromptSubmit Hook** - Proactively injects context before Claude processes prompts
3. **skill-rules.json** - Pattern-based skill suggestion system

Each mechanism serves different use cases:
- **Model-invoked**: For explicit Claude Code questions when Claude recognizes the topic
- **Hook**: Catches edge cases, adds redundancy, improves accuracy with contextual suggestions
- **skill-rules**: Framework-level prompt pattern matching with keywords and regex

This redundancy ensures Claude rarely misses opportunities to use official documentation.

### Data Storage

Documentation and dependencies:
- Documentation is stored within the skill directory (`skills/claude-code-knowledge/docs/`)
- Requires Bun runtime for scripts and hooks
- Works offline once documentation is cached
- Hook dependencies in `hooks/package.json`, script dependencies in `skills/claude-code-knowledge/scripts/package.json`

### Key Components

1. **SKILL.md** - Instructions for Claude on when and how to use the skill
2. **reference.md** - Index of all available documentation
3. **hooks/** - Hook subsystem for proactive context injection
   - **claude-code-prompt.ts** - UserPromptSubmit hook that detects Claude Code questions
   - **hooks.json** - Hook registration and configuration
   - **package.json** - Hook dependencies
   - **README.md** - Comprehensive hook documentation
4. **skill-rules.json** - Pattern-based triggers for skill suggestion (keywords and regex)
5. **scripts/** - Helper scripts for maintenance and skill creation
   - **sync_docs.ts**, **fetch_docs.ts**, **list_topics.ts** - Documentation maintenance (Bun TypeScript)
   - **skill-creator/** - Helper scripts for creating and packaging skills (Bun TypeScript)
6. **docs/** - Local cache of all documentation including skill-creation-guide.md

## Development Workflow

### Testing the Skill

To test if the skill works:

1. **Ask Claude a Claude Code question**:
   ```
   "How do I create a hook in Claude Code?"
   "How do I create a skill?"
   ```

2. **Claude should**:
   - Automatically invoke the skill
   - Read the relevant documentation from `docs/hooks.md` or `docs/skill-creation-guide.md`
   - Provide an accurate answer with citations

3. **Check if skill was used**:
   - Look for file reads from the skill's docs/ directory
   - Check if Claude mentions specific documentation files
   - For skill creation, verify Claude uses the helper scripts in `scripts/skill-creator/`

### Updating Documentation

To fetch latest documentation:

```bash
cd skills/claude-code-knowledge
bun scripts/sync_docs.ts
```

This will:
- Check if updates are available
- Fetch new documentation if needed
- Update the manifest

### Manual Documentation Fetch

To force a fresh fetch:

```bash
cd skills/claude-code-knowledge
bun scripts/fetch_docs.ts
```

**Note**: The fetch script currently copies from the existing `~/.claude-code-docs` installation as the official docs have moved to `code.claude.com`. This needs to be updated to fetch from the new location.

## File Structure

```
claude-code-knowledge/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata for marketplace
│
├── hooks/                       # Hook subsystem for proactive context injection
│   ├── claude-code-prompt.ts   # UserPromptSubmit hook (Bun TypeScript)
│   ├── hooks.json              # Hook configuration and registration
│   ├── package.json            # Hook dependencies
│   └── README.md               # Hook documentation and testing guide
│
├── skills/                      # Skills directory
│   ├── skill-rules.json        # Pattern-based skill suggestion (keywords, regex)
│   └── claude-code-knowledge/  # The actual skill
│       │
│       ├── SKILL.md            # ⭐ CRITICAL: Skill instructions
│       │                       # - Description triggers when Claude uses it
│       │                       # - Instructions tell Claude how to use it
│       │                       # - allowed-tools restricts what it can do
│       │
│       ├── reference.md        # Index of all documentation topics
│       │
│       ├── scripts/            # Maintenance and helper scripts
│       │   ├── fetch_docs.ts   # Fetch docs from source (Bun TypeScript)
│       │   ├── sync_docs.ts    # Check and sync updates (Bun TypeScript)
│       │   ├── list_topics.ts  # List available topics (Bun TypeScript)
│       │   ├── package.json    # Dependencies for scripts
│       │   └── skill-creator/  # Skill creation helper scripts
│       │       ├── init_skill.ts      # Initialize new skill structure (Bun TypeScript)
│       │       ├── package_skill.ts   # Validate and package skills (Bun TypeScript)
│       │       └── quick_validate.ts  # Validation without packaging (Bun TypeScript)
│       │
│       └── docs/               # Documentation cache
│           ├── docs_manifest.json      # Metadata and hashes
│           ├── skill-creation-guide.md # Comprehensive skill creation guide
│           └── *.md                    # 45+ documentation files
│
├── README.md                    # User-facing documentation
└── CLAUDE.md                    # This file - development guide
```

## Important Files

### SKILL.md

The most critical file. Contains:

1. **Frontmatter** (YAML):
   - `name`: Skill identifier
   - `description`: When Claude should use the skill (CRITICAL!)
   - `allowed-tools`: What tools the skill can use

2. **Instructions**:
   - How to check for updates
   - How to read documentation
   - How to search documentation
   - Common workflows

**Editing the description**:
- Make it specific about when to use the skill
- Include key trigger words (hooks, MCP, skills, etc.)
- Emphasize using docs over guessing

### hooks/claude-code-prompt.ts

UserPromptSubmit hook that proactively suggests the skill when Claude Code topics are detected.

**How it works**:
- Analyzes user prompts before Claude processes them
- Detects Claude Code-related questions using pattern matching
- Injects contextual suggestion to load the skill
- Improves accuracy by catching edge cases the model might miss

**Detection patterns**:
- Exact keywords: "claude code", "hooks", "mcp", "skills"
- Question patterns: "how do/can/does claude..."
- Feature patterns: "create a hook", "configure settings"

See `hooks/README.md` for complete documentation, testing procedures, and debugging.

### skill-rules.json

Framework-level skill suggestion system that defines prompt triggers:
- Keywords array for exact matches
- intentPatterns regex for flexible matching
- Priority and enforcement settings

Works alongside the hook and model-invoked mechanisms for comprehensive coverage.

### docs_manifest.json

Tracks all documentation:
- File hashes for change detection
- Original URLs
- Last updated timestamps
- Fetch metadata

## Skill Behavior

### How Claude Uses the Skill

The plugin uses three trigger mechanisms working together:

**Model-Invoked Path**:
1. User asks: "How do I create a hook?" or "How do I create a skill?"
2. Claude sees the question matches SKILL.md description
3. Claude reads SKILL.md for instructions
4. Claude optionally syncs docs: `bun scripts/sync_docs.ts`
5. Claude reads relevant documentation
6. For skill creation, Claude may use helper scripts from `scripts/skill-creator/`
7. Claude provides answer with citation

**Hook Path**:
1. User submits prompt with Claude Code keywords
2. UserPromptSubmit hook (claude-code-prompt.ts) detects the question
3. Hook injects contextual suggestion to load the skill
4. Claude sees the suggestion and follows the model-invoked path above

**skill-rules.json Path**:
1. User prompt matches keywords or intentPatterns in skill-rules.json
2. Framework suggests the skill based on pattern configuration
3. Claude follows the model-invoked path above

### Tool Restrictions

The skill uses `allowed-tools: Read, Grep, Glob, Bash` to:
- Read documentation files
- Search across documentation
- Run helper scripts
- List available topics

This ensures the skill is read-only and can't modify anything.

## Maintenance

### Updating the Skill Description

If Claude isn't using the skill when expected:

1. Edit `skills/claude-code-knowledge/SKILL.md`
2. Update the `description` field in frontmatter
3. Add more trigger keywords
4. Make it more specific about when to use

### Updating Hook Detection Patterns

If the hook isn't triggering on relevant questions:

1. Edit `hooks/claude-code-prompt.ts`
2. Update the detection patterns in the script
3. Test with hook debugging commands (see `hooks/README.md`)
4. Verify hook triggers correctly without false positives

### Updating skill-rules.json

If the skill-rules system isn't suggesting the skill:

1. Edit `skills/skill-rules.json`
2. Add new keywords or update intentPatterns regex
3. Adjust priority or enforcement settings if needed
4. Test that patterns match intended prompts

### Adding New Documentation

If new Claude Code docs are released:

1. Update `scripts/fetch_docs.py` to include new topics
2. Run the fetch script
3. Verify new files appear in `docs/`
4. Update `reference.md` if needed

### Updating Skill Creation Scripts

The skill creation helper scripts are in `scripts/skill-creator/`:

- **init_skill.ts** - Creates new skill template structure (Bun TypeScript)
- **package_skill.ts** - Validates and packages skills into .zip (Bun TypeScript)
- **quick_validate.ts** - Fast validation during development (Bun TypeScript)

To update these scripts:
1. Modify the appropriate script
2. Test with real skill creation workflows
3. Update `docs/skill-creation-guide.md` if behavior changes
4. Ensure backward compatibility with existing skills

### Debugging

If the skill isn't working:

1. **Check if docs exist**:
   ```bash
   ls skills/claude-code-knowledge/docs/*.md | wc -l
   # Should show 45
   ```

2. **Test list script**:
   ```bash
   bun skills/claude-code-knowledge/scripts/list_topics.ts
   ```

3. **Check a doc file**:
   ```bash
   cat skills/claude-code-knowledge/docs/hooks.md | head -20
   ```

4. **Ask Claude directly**:
   ```
   "What skills do you have available?"
   "Can you list the claude-code-knowledge skill?"
   ```

## Future Improvements

### Fetch Script Update Needed

The `fetch_docs.py` script currently uses patterns for the old docs location. It needs to be updated to:

1. Fetch from `code.claude.com` instead of `docs.claude.com/en/docs/claude-code/`
2. Handle the new URL structure
3. Update sitemap discovery logic

### Potential Enhancements

- **Auto-sync on skill load**: Check for updates when skill is first used
- **Offline mode**: Better handling when network is unavailable
- **Diff viewing**: Show what changed between doc versions
- **Topic suggestions**: Suggest related topics when reading docs

## Testing Checklist

Before considering the skill complete:

- [ ] Documentation files exist (45 files)
- [ ] Manifest is valid JSON
- [ ] list_topics.ts works
- [ ] sync_docs.ts works
- [ ] Claude can read individual docs
- [ ] Claude can search across docs
- [ ] Hook triggers on Claude Code questions (test via hook debugging)
- [ ] Hook context appears in transcript correctly
- [ ] skill-rules.json is valid JSON
- [ ] Claude uses skill automatically for Claude Code questions (any of 3 paths)
- [ ] Skill provides accurate answers with citations
- [ ] Hook dependencies installed: `cd hooks && bun install`
- [ ] Script dependencies installed: `cd skills/claude-code-knowledge/scripts && bun install`

## Known Issues

1. **Fetch script**: Currently copies from existing installation rather than fetching from source
2. **URL changes**: Official docs moved to code.claude.com, fetch script not updated yet
3. **No auto-sync**: Skill doesn't automatically check for updates, user must run sync script

## Migration to Bun

All scripts have been migrated from Python and Bash to Bun TypeScript:

- **Benefits**: Faster execution, better type safety, single runtime
- **Requirements**: Bun must be installed (`curl -fsSL https://bun.sh/install | bash`)
- **Dependencies**: Managed via `scripts/package.json` (fast-xml-parser for XML parsing)
- **Compatibility**: All scripts maintain the same CLI interface and functionality

## Version History

- **1.0.0** (2025-11-06): Initial release
  - Converted from original claude-code-docs repository
  - Self-contained skill architecture
  - 45 documentation topics
  - Local caching with manifest
  - Read-only with allowed-tools restriction
