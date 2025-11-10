# Doc Writer Plugin - Maintainer Documentation

This document is for developers maintaining or modifying the `doc-writer` plugin. For end-user documentation, see [README.md](./README.md).

## Plugin Architecture

The `doc-writer` plugin provides Claude Code with comprehensive documentation writing knowledge through a skill-based approach. The plugin synthesizes research from exemplary documentation projects and authoritative style guides into actionable patterns.

### Design Principles

1. **Test base knowledge first:** Document only what Claude doesn't naturally do
2. **Actionable verification:** Concrete steps (researcher agent, Context7 MCP) not abstract warnings
3. **Focus on unique patterns:** Opinionated, counter-intuitive, or project-specific
4. **Ruthless simplification:** Apply docs-reviewer agent to eliminate unnecessary content
5. **Research-based:** All guidance grounded in analysis of excellent documentation

## Directory Structure

```
plugins/doc-writer/
├── README.md                           # End-user documentation
├── CLAUDE.md                          # This file - maintainer documentation
├── hooks/                             # Auto-detection hooks
│   ├── README.md                      # Hook documentation
│   ├── hooks.json                     # Hook configuration
│   ├── package.json                   # Hook dependencies
│   └── doc-writer-suggest.ts          # PostToolUse hook for .md files
├── agents/
│   └── docs-reviewer.md               # Documentation review agent
└── skills/
    └── writing-documentation/
        ├── SKILL.md                   # Main skill file loaded by Claude
        └── references/
            ├── exemplary-projects.md  # Analysis of 8 well-documented projects
            ├── best-practices.md      # Synthesis of style guides
            └── llm-pitfalls.md        # LLM-specific issues and countermeasures
```

### Component Responsibilities

#### `hooks/doc-writer-suggest.ts`
**Purpose:** Auto-detection hook that suggests doc-writer skill when markdown files are modified

**Contains:**
- PostToolUse event handler
- File extension detection (.md files)
- Tool name filtering (Write, Edit, MultiEdit)
- Contextual suggestion for skill and agent

**Design note:** Provides gentle, contextual suggestions rather than mandatory enforcement. Triggers after file modifications to suggest quality improvements.

**Hook behavior:**
- Monitors Write, Edit, and MultiEdit tool usage
- Detects `.md` file modifications (case-insensitive)
- Provides contextual suggestions to Claude via `hookSpecificOutput.additionalContext`
- Suggests `doc-writer:writing-documentation` skill for writing
- Suggests `doc-writer:docs-reviewer` agent for review
- Non-intrusive - Claude receives context but doesn't announce it unless relevant or asked

#### `agents/docs-reviewer.md`
**Purpose:** Specialized agent for ruthlessly simplifying documentation

**Contains:**
- Philosophy of ruthless simplicity
- Review process and criteria
- Special scrutiny for Claude Code docs
- Examples of simplification
- Review checklist

**Design note:** Particularly brutal for CLAUDE.md, SKILL.md, commands, and agents to keep them focused.

#### `SKILL.md`
**Purpose:** Main operational context loaded into Claude's session

**Contains:**
- Claude Code documentation workflow (test base knowledge first)
- API verification using researcher agent and Context7 MCP
- Security verification patterns
- Production-ready code example requirements
- docs-reviewer agent usage
- LLM self-checklist

**Design note:** This file is focused (~170 lines) on unique patterns Claude doesn't naturally follow. It references research files for detailed guidance.

#### `references/exemplary-projects.md`
**Purpose:** Document analysis of projects known for excellent documentation

**Contains:**
- Framework documentation analysis (React, Rust, Django, Vue)
- Developer tools analysis (Stripe, Twilio, Slack, Vercel)
- Universal success patterns identified across projects
- Common anti-patterns to avoid
- Specific examples with URLs

**Design note:** Organized by project type for easy reference and updates.

#### `references/best-practices.md`
**Purpose:** Synthesis of authoritative style guides and frameworks

**Contains:**
- Diátaxis framework details
- Google Developer Documentation Style Guide patterns
- Write the Docs community practices
- Microsoft Writing Style Guide principles
- Cross-source consensus patterns
- Documentation maturity model

**Design note:** Structured by topic (voice/tone, organization, code examples, etc.) for quick lookup.

## How the Plugin Works

### Skill Loading Flow

1. User executes: `/skill writing-documentation`
2. Claude loads `skills/writing-documentation/SKILL.md` into context
3. Skill provides operational instructions for writing documentation
4. Reference files are available but not loaded (reduces token usage)
5. Claude applies patterns when user requests documentation

### Hook-Based Auto-Detection

The plugin includes a `PostToolUse` hook that automatically suggests the skill when relevant:

1. User asks Claude to create/edit markdown files
2. Claude uses Write, Edit, or MultiEdit tools
3. Hook detects `.md` file modifications
4. Hook injects suggestion into context
5. Claude sees suggestion and can proactively apply doc-writer skill

**Benefits:**
- Users don't need to remember to invoke the skill
- Contextual suggestions provided to Claude automatically
- Non-intrusive - Claude receives context but doesn't announce unless relevant
- Helps maintain documentation quality across sessions

**How it works in practice:**
- Hook fires after Write/Edit/MultiEdit on `.md` files
- Adds suggestion context that Claude can see and consider
- Claude may proactively use the suggestion or not depending on relevance
- To verify it's working, ask Claude: "What PostToolUse hook context did you receive?"

### Knowledge Organization

**Three-tier structure:**

```
SKILL.md (Active Context)
    ↓ references
    ├── exemplary-projects.md (Research evidence)
    └── best-practices.md (Authoritative guidelines)
```

**Why this structure:**
- Skill file is comprehensive enough to use standalone
- Reference files provide evidence and deeper context
- Maintainers can update references without changing skill logic
- Token-efficient: only skill loaded, references available if needed

## Common Maintenance Tasks

### Updating Research

**When to update:**
- New exemplary project emerges (e.g., Next.js improves docs significantly)
- Existing project changes documentation approach
- New style guide published or updated
- User feedback identifies gaps

**How to update:**

1. Add new research to appropriate reference file:
   ```bash
   # Edit the reference file
   code plugins/doc-writer/skills/writing-documentation/references/exemplary-projects.md

   # Add new project analysis following existing pattern
   ```

2. Update `SKILL.md` if new patterns emerge:
   ```bash
   # Edit the skill file
   code plugins/doc-writer/skills/writing-documentation/SKILL.md

   # Add new pattern to relevant section
   ```

3. Test the changes:
   ```bash
   # Reload the skill in a Claude session
   /skill writing-documentation

   # Ask Claude to apply the new pattern
   ```

### Adding New Documentation Types

The Diátaxis framework covers four main types (tutorial, how-to, reference, explanation). If you need to add a new type:

1. **Identify the need:** Is it truly distinct from the four types?
2. **Research examples:** Find excellent examples of this new type
3. **Define characteristics:** What makes it unique?
4. **Create template:** Add structure template to `SKILL.md`
5. **Update decision guide:** Help users choose when to use it

**Example: Adding "Troubleshooting Guide" as distinct type:**

```markdown
### 5. Troubleshooting Guide (Problem-solving oriented)
**Purpose:** Help users diagnose and fix specific problems
**Characteristics:**
- Symptom-based organization
- Decision trees or flowcharts
- Common problems → solutions mapping
...
```

### Maintaining Hooks

The plugin includes a `PostToolUse` hook for auto-detection. To maintain or modify:

**Testing the hook:**

```bash
cd plugins/doc-writer/hooks

# Test with markdown file (should output hookSpecificOutput JSON)
cat <<'EOF' | bun doc-writer-suggest.ts
{
  "session_id": "test",
  "transcript_path": "/tmp/test",
  "cwd": "/tmp",
  "permission_mode": "auto",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {"file_path": "/tmp/test.md", "content": "# Test"},
  "tool_response": {"filePath": "/tmp/test.md", "success": true}
}
EOF

# Test with non-markdown file (should produce no output)
cat <<'EOF' | bun doc-writer-suggest.ts
{
  "session_id": "test",
  "transcript_path": "/tmp/test",
  "cwd": "/tmp",
  "permission_mode": "auto",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {"file_path": "/tmp/test.ts", "content": "const x = 1;"},
  "tool_response": {"filePath": "/tmp/test.ts", "success": true}
}
EOF

# Test in Claude Code (verify hook actually fires)
claude --print --model haiku "Create /tmp/hook-test.md with '# Test'. After completing, tell me what PostToolUse hook context you received."
```

**Updating hook behavior:**

1. Edit `hooks/doc-writer-suggest.ts`
2. Modify detection logic or suggestion text
3. Test with sample inputs
4. Verify hook exits with code 0
5. Update `hooks/README.md` if behavior changes

**Common modifications:**
- Add support for other file extensions (.mdx, .rst, .adoc)
- Change suggestion text or formatting
- Add more tool types (e.g., Delete for cleanup suggestions)
- Filter by file path patterns (e.g., only trigger for docs/ directory)

**Important notes:**
- Hook provides context via `hookSpecificOutput.additionalContext`
- Does not use `"decision": "block"` - suggestion is informational only
- Claude receives the context but doesn't announce it unless relevant or asked
- To test if working, explicitly ask Claude what context it received

### Improving Templates

Templates in `SKILL.md` provide structure for different documentation types. To improve:

1. **Identify template to improve:**
   - Tutorial template
   - How-to guide template
   - Reference template
   - Explanation template

2. **Analyze real examples:**
   - Find 3-5 excellent examples of this type
   - Identify what makes them work
   - Extract common structural elements

3. **Update template in `SKILL.md`:**
   ```markdown
   **Structure:**
   [Updated structure with new insights]
   ```

4. **Test with real use cases:**
   - Load skill and ask Claude to generate documentation
   - Verify template produces high-quality output

### Adding New Style Guidelines

If a new authoritative style guide emerges (e.g., "Rust Documentation Standards v2"):

1. **Research the guide:**
   - Read the guide thoroughly
   - Identify novel recommendations
   - Compare with existing guidelines

2. **Update `references/best-practices.md`:**
   ```markdown
   ### 5. Rust Documentation Standards
   **Source:** [URL]
   **Authority:** [Why it matters]
   **Key Recommendations:**
   - ...
   ```

3. **Update cross-source patterns:**
   - If new guide confirms existing patterns, note it
   - If new patterns emerge, add to "Universal Standards" section

4. **Update `SKILL.md` if needed:**
   - Only if new patterns should be actively applied
   - Integrate into relevant sections

## Architecture Rationale

### Why Skill-Based Approach?

**Considered alternatives:**
- **Commands:** Too narrow; documentation writing is broad
- **Agents:** Overkill; no complex coordination needed
- **Skills:** ✓ Provides comprehensive context that persists in session

**Decision:** Skill-based because documentation writing benefits from:
- Persistent context throughout session
- Comprehensive guidelines always available
- Flexibility to apply patterns across different doc types
- User control over when expertise is active

### Why Three-Tier Knowledge Structure?

**Skill + References split:**
- **Skill:** Actionable patterns Claude can apply immediately
- **References:** Evidence and deeper context for maintainers and curious users
- **Benefit:** Reduces token usage while maintaining quality

**Why separate exemplary-projects.md and best-practices.md:**
- **Different purposes:** Examples vs. authoritative guidelines
- **Different update cycles:** Projects change; style guides are stable
- **Different audiences:** References serve slightly different needs
- **Maintainability:** Easier to update one or the other independently

### Why Diátaxis Framework?

**Considered alternatives:**
- Custom framework
- No framework (ad-hoc)
- Information Mapping
- DITA

**Decision:** Diátaxis because:
- Widely adopted (Python, Ubuntu, Gatsby, etc.)
- Simple four-type model is easy to understand
- Addresses most documentation needs
- Strong community support
- Well-documented framework itself

## Testing the Plugin

### Manual Testing Checklist

When making significant changes:

- [ ] **Skill loads successfully:**
  ```
  /skill writing-documentation
  ```

- [ ] **Tutorial generation works:**
  ```
  Create a tutorial for building a REST API with Express
  ```

- [ ] **How-to guide generation works:**
  ```
  Write a how-to guide for deploying to Vercel
  ```

- [ ] **Reference documentation works:**
  ```
  Document this API function: [paste code]
  ```

- [ ] **README generation works:**
  ```
  Write a README for a library that validates emails
  ```

- [ ] **Hook triggers on markdown files (manual script test):**
  ```bash
  # In hooks directory
  cat <<'EOF' | bun doc-writer-suggest.ts
  {"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"PostToolUse","tool_name":"Write","tool_input":{"file_path":"/tmp/test.md","content":"# Test"},"tool_response":{"filePath":"/tmp/test.md","success":true}}
  EOF
  # Should output hookSpecificOutput JSON with additionalContext
  ```

- [ ] **Hook doesn't trigger on non-markdown files:**
  ```bash
  # In hooks directory
  cat <<'EOF' | bun doc-writer-suggest.ts
  {"session_id":"test","transcript_path":"/tmp","cwd":"/tmp","permission_mode":"auto","hook_event_name":"PostToolUse","tool_name":"Write","tool_input":{"file_path":"/tmp/test.ts","content":"const x = 1;"},"tool_response":{"filePath":"/tmp/test.ts","success":true}}
  EOF
  # Should produce no output (exits silently)
  ```

- [ ] **Hook works in Claude Code:**
  ```bash
  claude --print --model haiku "Create /tmp/test.md with '# Test'. After completing, tell me what PostToolUse hook context you received."
  # Claude should report receiving doc-writer suggestion
  ```

- [ ] **Style guidelines applied:**
  - Active voice used
  - Present tense used
  - Code examples include expected output
  - Prerequisites stated

- [ ] **Quality patterns present:**
  - Examples before explanations
  - Progressive complexity
  - Error documentation included

### Validation Against Research

Periodically validate skill output against exemplary projects:

1. **Generate documentation with skill**
2. **Compare to React/Stripe/Django docs**
3. **Check for pattern alignment:**
   - Structure matches best practices
   - Examples are high quality
   - Tone is appropriate
   - Navigation is clear

### User Feedback Integration

**When receiving feedback:**

1. **Categorize the issue:**
   - Missing pattern (add to skill)
   - Incorrect pattern (fix in skill)
   - Outdated research (update references)
   - Documentation clarity (improve CLAUDE.md or README.md)

2. **Trace to source:**
   - Which section of SKILL.md is involved?
   - Is research in references accurate?
   - Is template structure the issue?

3. **Make targeted fix:**
   - Update specific section
   - Test the change
   - Document in git commit

## Common Pitfalls to Avoid

### For Maintainers

**Don't:**
- ❌ Add content Claude already knows naturally
- ❌ Use abstract warnings ("don't hallucinate") instead of actionable steps
- ❌ Make SKILL.md too long (currently ~170 lines; avoid bloat)
- ❌ Duplicate content between skill and references
- ❌ Skip testing base knowledge before adding patterns

**Do:**
- ✅ Test with `claude --print --model haiku` before documenting (cost-effective)
- ✅ Document only unique/opinionated patterns
- ✅ Make verification actionable (researcher agent, Context7 MCP)
- ✅ Apply docs-reviewer agent to all updates
- ✅ Keep skill focused on behavior-changing patterns

### For Skill Content

**Don't:**
- ❌ Prescribe overly rigid rules (context matters)
- ❌ Include examples without context
- ❌ Assume one-size-fits-all approaches
- ❌ Neglect accessibility guidelines

**Do:**
- ✅ Provide decision frameworks (when to use X vs. Y)
- ✅ Include anti-patterns (what to avoid)
- ✅ Show progressive complexity
- ✅ Offer templates that adapt to context

## Version History and Changelog

When making significant changes:

1. **Update version in `marketplace.json`:**
   ```json
   {
     "name": "doc-writer",
     "version": "1.1.0",  // Increment appropriately
     ...
   }
   ```

2. **Document changes in git commit:**
   ```
   doc-writer: Add support for troubleshooting guides

   - Added troubleshooting guide template to SKILL.md
   - Updated decision guide to include troubleshooting
   - Added examples from Vercel and Stripe docs
   ```

3. **Consider updating README.md:**
   - If new features are user-facing
   - Keep examples current

## Related Documentation

- **Repository root CLAUDE.md:** Overall plugin architecture and standards
- **skill-creator plugin:** For creating new skills (this plugin is an example)
- **spec-dev plugin:** Related workflow for specification writing

## Questions and Support

For questions about maintaining this plugin:
1. Review this CLAUDE.md thoroughly
2. Check the repository root CLAUDE.md for general plugin patterns
3. Examine the skill-creator plugin for skill development guidance
4. Review git history for context on past changes

## Future Enhancement Ideas

Potential improvements for future versions:

1. **Interactive examples generator:**
   - Command to generate CodeSandbox/StackBlitz links
   - Automate "try it" sections

2. **Documentation audit command:**
   - Analyze existing docs against patterns
   - Generate improvement suggestions

3. **Template library expansion:**
   - Additional templates for specific doc types
   - Framework-specific templates (React, Vue, etc.)

4. **Multi-language support:**
   - Patterns for non-English documentation
   - Localization best practices

5. **Accessibility checker:**
   - Validate alt text, contrast, heading hierarchy
   - Automated accessibility scoring

**Note:** Implement these only if user demand emerges and research supports their value.
