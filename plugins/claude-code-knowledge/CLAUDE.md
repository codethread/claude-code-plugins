# Claude Code Knowledge Skill - Development Guide

This skill provides Claude with access to official Claude Code documentation and comprehensive skill creation guidance with helper scripts.

## Architecture

### Multi-Strategy Trigger Architecture

This plugin uses **four complementary mechanisms** to ensure Claude has documentation access:

1. **Model-Invoked Skill** - Claude decides based on SKILL.md description field
2. **PreToolUse Hook** - Transparently syncs documentation when skill loads (auto-sync)
3. **UserPromptSubmit Hook** - Proactively injects context before Claude processes prompts
4. **skill-rules.json** - Pattern-based skill suggestion system

Each mechanism serves different use cases:
- **Model-invoked**: For explicit Claude Code questions when Claude recognizes the topic
- **PreToolUse hook**: Automatic, transparent documentation sync when skill is loaded (lazy loading)
- **UserPromptSubmit hook**: Catches edge cases, adds redundancy, improves accuracy with contextual suggestions
- **skill-rules**: Framework-level prompt pattern matching with keywords and regex

This redundancy ensures Claude rarely misses opportunities to use official documentation, and documentation stays current without manual intervention.

### Data Storage

Documentation and dependencies:
- Documentation is stored within the skill directory (`skills/claude-code-knowledge/docs/`)
- Requires Bun runtime for scripts and hooks
- Works offline once documentation is cached
- Hook dependencies in `hooks/package.json`, script dependencies in `skills/claude-code-knowledge/scripts/package.json`

### Key Components

1. **SKILL.md** - Instructions for Claude on when and how to use the skill
2. **reference.md** - Index of all available documentation
3. **hooks/** - Hook subsystem for both auto-sync and proactive context injection
   - **hooks.json** - Hook registration (both PreToolUse and UserPromptSubmit)
   - **sync-docs-on-skill-load.ts** - PreToolUse hook that transparently syncs docs when skill loads
   - **claude-code-prompt.ts** - UserPromptSubmit hook that detects Claude Code questions
   - **package.json** - Hook dependencies
4. **skill-rules.json** - Pattern-based triggers for skill suggestion (keywords and regex)
5. **scripts/** - Helper scripts for skill creation and browsing
   - **list_topics.ts** - List available documentation topics (Bun TypeScript)
   - **skill-creator/** - Helper scripts for creating and packaging skills (Bun TypeScript)
6. **docs/** - Local cache of all documentation including skill-creation-guide.md
   - Documentation is fetched and managed by the PreToolUse hook
   - No manual maintenance scripts needed

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

### Documentation Management

Documentation is **fully automated** - no manual commands needed!

The PreToolUse hook (`hooks/sync-docs-on-skill-load.ts`) handles everything:
- Checks if docs are >3 hours old
- Fetches from docs.anthropic.com automatically
- Updates manifest with hashes and metadata
- Runs transparently when skill loads

**Manual operations** (rarely needed):
- View topics: `bun skills/claude-code-knowledge/scripts/list_topics.ts`
- Force immediate sync: Load the skill, which triggers the hook

## File Structure

```
claude-code-knowledge/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata for marketplace
│
├── hooks/                       # Hook subsystem for auto-sync and context injection
│   ├── hooks.json              # Hook registration (PreToolUse + UserPromptSubmit)
│   ├── sync-docs-on-skill-load.ts  # PreToolUse hook for transparent doc sync (Bun TypeScript)
│   ├── claude-code-prompt.ts   # UserPromptSubmit hook (Bun TypeScript)
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
│       ├── scripts/            # Helper scripts for browsing and skill creation
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

### hooks/sync-docs-on-skill-load.ts

PreToolUse hook that transparently syncs documentation when the skill loads. **All documentation fetching logic is contained in this single file.**

**How it works**:
- Runs on `PreToolUse` event before the Skill tool executes
- Reads JSON input from stdin to identify tool name and skill parameter
- Matches on skill name "claude-code-knowledge" (with or without namespace)
- Checks if documentation sync is needed (>3 hours old or missing)
- If needed, fetches directly from docs.anthropic.com:
  - Discovers sitemap and base URL
  - Fetches all Claude Code documentation pages as markdown
  - Validates content (ensures it's markdown, not HTML)
  - Fetches CHANGELOG.md from GitHub
  - Updates manifest with hashes and metadata
- Uses smart caching (3-hour threshold) to avoid redundant fetches
- Includes retry logic with exponential backoff
- Always exits with code 0 (non-blocking, silent) even if sync fails
- Completely transparent to users and Claude

**Implementation details**:
- **Hook trigger**: `PreToolUse` with matcher `"Skill"`
- **Configuration**: Registered in `hooks/hooks.json` alongside UserPromptSubmit hook
- **Language**: Bun TypeScript (self-contained, no external scripts)
- **Timeout**: 30 seconds (handles first-time fetch which takes ~30 seconds)
- **Path resolution**: Uses `${CLAUDE_PLUGIN_ROOT}` environment variable
- **Dependencies**: `bun` runtime + `fast-xml-parser` (for sitemap parsing)

**Behavior**:
- **First time**: Downloads 45 documentation files (~30 seconds)
- **Subsequent loads**: Instant (~1-2 seconds) if docs updated <3 hours ago
- **On failure**: Silent, doesn't block skill loading
- **Offline**: Skips sync, uses cached docs

**Testing the hook**:

Test the TypeScript hook manually:
```bash
cd plugins/claude-code-knowledge/hooks

# Test with Skill tool call for claude-code-knowledge
cat <<'EOF' | bun sync-docs-on-skill-load.ts
{"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{"skill":"claude-code-knowledge"}}
EOF

# Test with different skill (should exit silently)
cat <<'EOF' | bun sync-docs-on-skill-load.ts
{"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{"skill":"other-skill"}}
EOF
```

Test in Claude Code:
```bash
# Load the skill and observe timing
claude --print "Please load the claude-code-knowledge skill and tell me about hooks"
```

**Troubleshooting**:
- Hook only runs when claude-code-knowledge skill is loaded
- Verify plugin is installed: `/plugin list`
- Check `bun` is available: `which bun`
- Enable debug mode: `claude --debug`
- Check hook configuration: `cat hooks/hooks.json`

### hooks/claude-code-prompt.ts

UserPromptSubmit hook that proactively suggests the skill when Claude Code topics are detected.

**How it works**:
- Runs on `UserPromptSubmit` event before Claude processes prompts
- Analyzes user prompts for Claude Code-related keywords
- Detects Claude Code-related questions using pattern matching
- **Only suggests once per session** using session cache tracking
- Session cache stored at `~/.local/cache/personal-configs-plugins/claude-code-knowledge/<normalized-cwd>/<session-id>.json`
- Injects contextual suggestion to load the skill via stdout
- Improves accuracy by catching edge cases the model might miss

**Detection patterns**:
- Exact keywords: "claude code", "hooks", "mcp", "skills"
- Standalone "claude" patterns: "how do/can/does claude..." (but NOT with model names)
- Feature patterns: "create a hook", "configure settings", "slash command"

**Testing the hook**:

Manual script test:
```bash
cd plugins/claude-code-knowledge/hooks

# Test with Claude Code question (should output context)
cat <<'EOF' | bun claude-code-prompt.ts
{"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"UserPromptSubmit","prompt":"How do I create a hook?"}
EOF

# Test with non-Claude question (should produce no output)
cat <<'EOF' | bun claude-code-prompt.ts
{"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"UserPromptSubmit","prompt":"What's the weather?"}
EOF
```

Test in Claude Code:
```bash
claude --print --model haiku "How do I create a hook? After answering, tell me if you received UserPromptSubmit hook context."
```

**Testing session tracking:**

```bash
cd plugins/claude-code-knowledge/hooks

# First invocation - should output suggestion
cat <<'EOF' | bun claude-code-prompt.ts
{"session_id":"test-session","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"UserPromptSubmit","prompt":"How do I create a hook?"}
EOF

# Second invocation (same session) - should produce no output
cat <<'EOF' | bun claude-code-prompt.ts
{"session_id":"test-session","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"UserPromptSubmit","prompt":"What are hooks?"}
EOF
```

**Troubleshooting**:
- Hook only triggers on Claude Code-related prompts
- Verify plugin is installed: `/plugin list`
- Check hook dependencies: `cd hooks && bun install`
- Enable debug mode: `claude --debug`
- Context is injected to Claude automatically, doesn't interrupt user flow
- Session cache prevents repeated suggestions within same session

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

The plugin uses four mechanisms working together:

**Model-Invoked Path**:
1. User asks: "How do I create a hook?" or "How do I create a skill?"
2. Claude sees the question matches SKILL.md description
3. Claude invokes the skill using Skill tool
4. **PreToolUse hook automatically syncs docs** (transparent, happens before step 5)
5. Claude reads SKILL.md for instructions
6. Claude reads relevant documentation from local cache
7. For skill creation, Claude may use helper scripts from `scripts/skill-creator/`
8. Claude provides answer with citation

**PreToolUse Hook Path** (Auto-Sync):
1. Claude invokes Skill tool with "claude-code-knowledge"
2. PreToolUse hook (sync-docs-on-load.sh) intercepts the tool call
3. Hook silently runs `bun scripts/sync_docs.ts` in background
4. Documentation is updated if >3 hours old (or fetched if missing)
5. Hook exits silently, Skill tool continues normally
6. **Completely transparent** - neither user nor Claude aware of sync

**UserPromptSubmit Hook Path** (Context Injection):
1. User submits prompt with Claude Code keywords
2. UserPromptSubmit hook (claude-code-prompt.ts) detects the question
3. Hook injects contextual suggestion to load the skill
4. Claude sees the suggestion and follows the model-invoked path above

**skill-rules.json Path** (Pattern Matching):
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

Documentation is automatically discovered from the sitemap! When new Claude Code docs are released:

1. **Nothing to do** - The hook automatically discovers new pages via sitemap
2. **Fallback list**: If sitemap fails, update the fallback list in `hooks/sync-docs-on-skill-load.ts` (function `getFallbackPages()`)
3. **Verify**: Load the skill to trigger sync, then run `bun scripts/list_topics.ts` to see new topics
4. **Update reference.md**: If needed, regenerate the topic index (currently manual)

### Updating Skill Creation Scripts

The skill creation helper scripts are in `skills/claude-code-knowledge/scripts/skill-creator/`:

- **init_skill.ts** - Creates new skill template structure (Bun TypeScript)
- **package_skill.ts** - Validates and packages skills into .zip (Bun TypeScript)
- **quick_validate.ts** - Fast validation during development (Bun TypeScript)

To update these scripts:
1. Modify the appropriate script
2. Test with real skill creation workflows
3. Update `docs/skill-creation-guide.md` if behavior changes
4. Ensure backward compatibility with existing skills

**Note**: Documentation fetching/syncing is handled by the hook, not by scripts in this directory.

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

None currently! The hook automatically:
- Discovers docs from sitemap (docs.anthropic.com or docs.claude.com)
- Fetches markdown directly from source
- Handles URL changes transparently

## Migration to Bun

All scripts have been migrated from Python and Bash to Bun TypeScript:

- **Benefits**: Faster execution, better type safety, single runtime
- **Requirements**: Bun must be installed (`curl -fsSL https://bun.sh/install | bash`)
- **Dependencies**: Managed via `scripts/package.json` (fast-xml-parser for XML parsing)
- **Compatibility**: All scripts maintain the same CLI interface and functionality

## Version History

- **2.3.0** (2025-11-11): Self-Contained Hook Architecture
  - Merged all fetch/sync logic into single hook file
  - Hook now fetches directly from docs.anthropic.com (no external scripts)
  - Removed fetch_docs.ts and sync_docs.ts from scripts directory
  - Skill directory only contains browsing tools (list_topics.ts) and skill-creator helpers
  - Hook dependencies moved to hooks/package.json (fast-xml-parser)
  - Cleaner separation: hooks handle fetching, skill handles reading

- **2.2.0** (2025-11-11): Transparent Auto-Sync with PreToolUse Hook
  - Added PreToolUse hook for automatic documentation syncing
  - Hook transparently syncs docs when skill loads (lazy loading)
  - Simplified SKILL.md by removing manual sync instructions
  - Plugin-bundled hook configuration in hooks/hooks.json
  - Silent failures - never blocks skill loading
  - Smart caching with 3-hour threshold

- **1.0.0** (2025-11-06): Initial release
  - Converted from original claude-code-docs repository
  - Self-contained skill architecture
  - 45 documentation topics
  - Local caching with manifest
  - Read-only with allowed-tools restriction
