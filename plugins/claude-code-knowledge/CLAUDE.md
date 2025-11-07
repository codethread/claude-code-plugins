# Claude Code Knowledge Skill - Development Guide

This skill provides Claude with access to official Claude Code documentation and comprehensive skill creation guidance with helper scripts.

## Architecture

### Self-Contained Design

This skill is entirely self-contained:
- Documentation is stored within the skill directory
- No external dependencies except for initial fetch
- Works offline once documentation is cached
- No hooks or external configuration needed

### Model-Invoked Behavior

This is a **model-invoked skill**, meaning:
- Claude automatically decides when to use it
- User doesn't need to explicitly invoke it
- Triggered by questions about Claude Code
- Description field controls when Claude uses it

### Key Components

1. **SKILL.md** - Instructions for Claude on when and how to use the skill
2. **reference.md** - Index of all available documentation
3. **scripts/** - Helper scripts for maintenance and skill creation
   - **sync_docs.sh**, **fetch_docs.py**, **list_topics.sh** - Documentation maintenance
   - **skill-creator/** - Helper scripts for creating and packaging skills
4. **docs/** - Local cache of all documentation including skill-creation-guide.md

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
bash scripts/sync_docs.sh
```

This will:
- Check if updates are available
- Fetch new documentation if needed
- Update the manifest

### Manual Documentation Fetch

To force a fresh fetch:

```bash
cd skills/claude-code-knowledge
python3 scripts/fetch_docs.py
```

**Note**: The fetch script currently copies from the existing `~/.claude-code-docs` installation as the official docs have moved to `code.claude.com`. This needs to be updated to fetch from the new location.

## File Structure

```
claude-code-knowledge/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata for marketplace
│
├── skills/                      # Skills directory
│   └── claude-code-knowledge/   # The actual skill
│       │
│       ├── SKILL.md             # ⭐ CRITICAL: Skill instructions
│       │                        # - Description triggers when Claude uses it
│       │                        # - Instructions tell Claude how to use it
│       │                        # - allowed-tools restricts what it can do
│       │
│       ├── reference.md         # Index of all documentation topics
│       │
│       ├── scripts/             # Maintenance and helper scripts
│       │   ├── fetch_docs.py    # Fetch docs from source
│       │   ├── sync_docs.sh     # Check and sync updates
│       │   ├── list_topics.sh   # List available topics
│       │   ├── requirements.txt # Python dependencies
│       │   └── skill-creator/   # Skill creation helper scripts
│       │       ├── init_skill.py      # Initialize new skill structure
│       │       ├── package_skill.py   # Validate and package skills
│       │       └── quick_validate.py  # Validation without packaging
│       │
│       └── docs/                # Documentation cache
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

### docs_manifest.json

Tracks all documentation:
- File hashes for change detection
- Original URLs
- Last updated timestamps
- Fetch metadata

## Skill Behavior

### How Claude Uses the Skill

1. User asks: "How do I create a hook?" or "How do I create a skill?"
2. Claude sees the question matches skill description
3. Claude reads SKILL.md for instructions
4. Claude runs: `bash scripts/sync_docs.sh` (optional)
5. Claude reads: `cat docs/hooks.md` or `cat docs/skill-creation-guide.md`
6. For skill creation, Claude may use helper scripts from `scripts/skill-creator/`
7. Claude provides answer with citation

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

### Adding New Documentation

If new Claude Code docs are released:

1. Update `scripts/fetch_docs.py` to include new topics
2. Run the fetch script
3. Verify new files appear in `docs/`
4. Update `reference.md` if needed

### Updating Skill Creation Scripts

The skill creation helper scripts are in `scripts/skill-creator/`:

- **init_skill.py** - Creates new skill template structure
- **package_skill.py** - Validates and packages skills into .zip
- **quick_validate.py** - Fast validation during development

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
   bash skills/claude-code-knowledge/scripts/list_topics.sh
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
- [ ] list_topics.sh works
- [ ] sync_docs.sh works
- [ ] Claude can read individual docs
- [ ] Claude can search across docs
- [ ] Claude uses skill automatically for Claude Code questions
- [ ] Skill provides accurate answers with citations

## Known Issues

1. **Fetch script**: Currently copies from existing installation rather than fetching from source
2. **URL changes**: Official docs moved to code.claude.com, fetch script not updated yet
3. **No auto-sync**: Skill doesn't automatically check for updates, user must run sync script

## Version History

- **1.0.0** (2025-11-06): Initial release
  - Converted from original claude-code-docs repository
  - Self-contained skill architecture
  - 45 documentation topics
  - Local caching with manifest
  - Read-only with allowed-tools restriction
