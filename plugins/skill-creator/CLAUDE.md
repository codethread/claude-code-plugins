# Skill Creator Plugin - Maintainer Documentation

This document is for **plugin maintainers and developers** working on the skill-creator plugin itself. For end-user documentation, see `README.md`.

## Plugin Architecture

This plugin follows a **skill-only architecture** - there are no slash commands or specialized agents. Users load the skill directly via `/skill-creator` to get comprehensive guidance on creating effective skills.

### Design Principle

**Single comprehensive skill provides all guidance for skill creation**

```
/skill-creator (skill loaded directly)
  ├─ Provides: Complete 6-phase creation process
  ├─ Contains: All skill creation knowledge
  └─ References: Helper scripts for initialization and packaging
```

## Directory Structure

```
plugins/skill-creator/
├── README.md                           # User-facing documentation
├── CLAUDE.md                           # This file - maintainer documentation
├── LICENSE.txt                         # MIT license
│
└── skills/                             # Core skill
    └── skill-creator/
        ├── SKILL.md                    # Main skill file with all guidance
        └── scripts/                    # Helper utilities
            ├── init_skill.py          # Initialize new skill structure
            ├── package_skill.py       # Validate and package skills
            └── quick_validate.py      # Validation without packaging
```

## Component Responsibilities

### Skill (skills/skill-creator/SKILL.md)

**Purpose**: Comprehensive guidance for creating effective skills

**Structure**:
- About Skills - What they are, what they provide, anatomy
- Progressive Disclosure Design Principle - Three-level loading system
- Skill Creation Process - Six-phase methodology
- Each phase with detailed instructions

**Content Organization**:
1. **Conceptual Foundation** (lines 1-86)
   - What skills provide
   - Anatomy of a skill
   - SKILL.md requirements
   - Bundled resources (scripts, references, assets)
   - Progressive disclosure principle

2. **Creation Process** (lines 88-210)
   - Step 1: Understanding with concrete examples
   - Step 2: Planning reusable contents
   - Step 3: Initializing the skill
   - Step 4: Editing the skill
   - Step 5: Packaging the skill
   - Step 6: Iterating based on usage

**Guidelines**:
- Keep comprehensive - this is the single source of truth
- Use imperative/infinitive form (not second person)
- Provide concrete examples for each concept
- Reference helper scripts in appropriate steps

### Scripts (skills/skill-creator/scripts/)

**Purpose**: Automation tools for skill development workflow

#### init_skill.py

**Function**: Creates new skill directory with proper template structure

**Usage**:
```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

**Creates**:
- Skill directory at specified path
- SKILL.md with proper frontmatter and TODOs
- Example directories: `scripts/`, `references/`, `assets/`
- Example files demonstrating structure

**Key Features**:
- Generates valid YAML frontmatter
- Creates TODO placeholders for customization
- Includes example files that can be removed
- Validates skill name format

#### package_skill.py

**Function**: Validates and packages skill into distributable .zip

**Usage**:
```bash
scripts/package_skill.py <path/to/skill-folder> [output-directory]
```

**Process**:
1. Validates skill structure automatically
2. Checks YAML frontmatter format
3. Verifies required fields
4. Validates naming conventions
5. Creates .zip file if validation passes

**Validation Checks**:
- YAML frontmatter exists and is valid
- Required fields present (name, description)
- Directory structure conventions
- File organization
- Description quality and completeness

**Output**: `<skill-name>.zip` ready for distribution

#### quick_validate.py

**Function**: Validates skill without creating package

**Usage**:
```bash
scripts/quick_validate.py <path/to/skill-folder>
```

**Purpose**: Fast validation during iterative development

## Key Design Decisions

### 1. No Commands or Agents

**Why**: Skill creation is a single, cohesive workflow best served by one comprehensive skill

- ✅ All guidance in one place
- ✅ Users load skill directly with `/skill-creator`
- ✅ No need to navigate multiple commands
- ✅ Simpler plugin architecture
- ❌ Skill is long (but well-organized with sections)

**Alternative considered**: Multiple commands like `/create-skill`, `/package-skill`
**Rejected because**: Fragmented workflow, harder to maintain consistency

### 2. Scripts as Bundled Resources

**Why**: Scripts are tools used during skill creation, not loaded into context

- ✅ Scripts can be executed without reading
- ✅ Token efficient
- ✅ Deterministic operations (validation, packaging)
- ✅ Easy to update independently

**Implementation**: SKILL.md references scripts in Step 3 and Step 5

### 3. Comprehensive Single Skill

**Why**: Skill creation requires understanding the full context

The skill includes:
- Conceptual foundation (what skills are)
- Progressive disclosure principle
- Complete 6-phase process
- Best practices and examples

**Benefits**:
- No need to jump between files
- Progressive disclosure works at skill level
- All context available when needed

### 4. Example-Driven Documentation

**Why**: Concrete examples make abstract concepts clear

Each concept includes examples:
- PDF skill for scripts
- Financial skill for references
- Frontend webapp for assets
- BigQuery skill for domain knowledge

## Common Maintenance Tasks

### Updating Skill Creation Process

**File**: `skills/skill-creator/SKILL.md`

1. Locate the phase/step to update (Step 1-6)
2. Modify instructions while preserving structure
3. Update any examples if process changes
4. Test by creating a skill using new guidance
5. Update README.md if user-facing changes

### Updating Helper Scripts

**Files**: `skills/skill-creator/scripts/*.py`

1. Edit script implementation
2. Update usage instructions in SKILL.md if syntax changes
3. Test script with various inputs
4. Consider backward compatibility
5. Update error messages for clarity

**Testing scripts**:
```bash
# Test init_skill.py
scripts/init_skill.py test-skill --path /tmp/test

# Test validation
scripts/quick_validate.py /tmp/test/test-skill

# Test packaging
scripts/package_skill.py /tmp/test/test-skill /tmp
```

### Adding New Validation Checks

**File**: `scripts/package_skill.py` and `scripts/quick_validate.py`

1. Add validation logic to both scripts
2. Add helpful error messages
3. Document new requirement in SKILL.md
4. Test with skills that should pass/fail
5. Update README.md troubleshooting if needed

### Updating Skill Anatomy Documentation

**File**: `skills/skill-creator/SKILL.md` (lines 25-76)

1. Edit "Anatomy of a Skill" section
2. Update directory structure diagram
3. Update descriptions of SKILL.md, scripts, references, assets
4. Add/update examples
5. Ensure consistency with actual conventions

### Refining Progressive Disclosure Documentation

**File**: `skills/skill-creator/SKILL.md` (lines 77-86)

1. Edit "Progressive Disclosure Design Principle"
2. Update if loading behavior changes
3. Ensure word count estimates are accurate
4. Test that explanation is clear
5. Update examples if needed

## Testing Changes

### Manual Testing Workflow

1. **Test skill loading**
   ```bash
   /skill-creator
   ```
   - Verify skill loads without errors
   - Check frontmatter is valid
   - Confirm all sections present

2. **Test skill creation workflow**
   ```
   Create a test skill for rotating images
   ```
   - Follow the 6-phase process
   - Verify init_skill.py gets called correctly
   - Check generated structure
   - Validate and package the result

3. **Test helper scripts directly**
   ```bash
   # Initialize test skill
   skills/skill-creator/scripts/init_skill.py test-image-rotate --path /tmp

   # Validate
   skills/skill-creator/scripts/quick_validate.py /tmp/test-image-rotate

   # Package
   skills/skill-creator/scripts/package_skill.py /tmp/test-image-rotate /tmp
   ```

4. **Test with real use cases**
   - Create skills for different domains
   - Verify examples in SKILL.md are accurate
   - Check scripts handle edge cases
   - Validate packaging works end-to-end

### Validation Checklist

Before committing changes:

- [ ] SKILL.md has valid frontmatter
- [ ] All six phases are complete and clear
- [ ] Examples are accurate and helpful
- [ ] Script usage instructions match actual syntax
- [ ] Scripts handle errors gracefully
- [ ] Validation checks are comprehensive
- [ ] README.md reflects current functionality
- [ ] No duplication between README and SKILL.md
- [ ] Tested creating a skill end-to-end

## Architecture Rationale

### Why Single Skill Instead of Commands?

**Original options considered**:
1. Multiple commands (`/create-skill`, `/validate-skill`, `/package-skill`)
2. Single command with arguments (`/skill-creator [action]`)
3. Direct skill loading (`/skill-creator`)

**Chose option 3 because**:
- Skill creation is one coherent workflow
- No need for different entry points
- All context available when loaded
- Simpler user experience
- Easier to maintain single source of truth

### Why No Specialized Agents?

Skill creation doesn't require:
- Multiple perspectives (like developer vs reviewer)
- Long-running parallel work
- Specialized tool access
- Distinct execution phases

One main session can handle the entire workflow with helper scripts.

### Why Scripts Not Inline in Skill?

Scripts are:
- **Deterministic** - Validation rules, file creation
- **Reusable** - Used across many skill creations
- **Maintained separately** - Can update without changing skill
- **Executable without context** - Don't need to load into window

Better as bundled resources than inline code.

## Common Pitfalls

### ❌ Don't: Duplicate Between README and SKILL.md

**README.md**: How to use the skill-creator plugin (user-facing)
**SKILL.md**: How to create skills (Claude-facing guidance)

These are different audiences and purposes.

### ❌ Don't: Make Examples Too Abstract

Bad: "A skill for data processing might include..."
Good: "When building a `pdf-editor` skill to handle queries like 'Help me rotate this PDF'..."

Concrete examples with specific details are more helpful.

### ❌ Don't: Forget to Update Scripts in SKILL.md

When changing script syntax:
1. Update the script
2. Update usage examples in SKILL.md
3. Update README.md if user-visible
4. Test that examples work

### ❌ Don't: Skip Validation Testing

When adding validation checks:
- Test with skills that should pass
- Test with skills that should fail
- Verify error messages are helpful
- Check that validation doesn't block valid skills

## Evolution Guidelines

### When to Update the Skill

Update SKILL.md when:
- Skill creation best practices evolve
- New skill patterns emerge
- User feedback reveals confusion
- Helper scripts change significantly
- Progressive disclosure behavior changes

Document all significant changes in this file.

### When to Add New Scripts

Consider adding scripts when:
- Repetitive automation opportunity emerges
- Validation needs become more complex
- New skill packaging formats needed
- Common skill operations identified

Don't add scripts for:
- One-off operations
- Things Claude can do in-context
- Overly specific use cases

### When to Refactor

Consider refactoring when:
- SKILL.md becomes hard to navigate (>300 lines)
- Scripts share significant duplicate code
- Validation logic becomes complex
- User confusion indicates structural issues

Approach:
1. Consider splitting into references
2. Extract common script utilities
3. Simplify validation rules
4. Improve documentation structure

## Troubleshooting

### Skill Won't Load

Check:
1. YAML frontmatter valid?
2. Name and description present?
3. File named SKILL.md exactly?
4. Located in `skills/skill-creator/`?

### Scripts Failing

Check:
1. Execute permissions set? (`chmod +x`)
2. Python available in environment?
3. Path to script correct?
4. Error messages helpful?

### Validation Failing Unexpectedly

Check:
1. What specific validation failed?
2. Is validation check too strict?
3. Error message clear about what to fix?
4. Valid skills being rejected?

### Packaging Creates Invalid Zip

Check:
1. Directory structure correct?
2. SKILL.md in root of skill folder?
3. All referenced files present?
4. No absolute paths in skill?

---

**Remember**: This plugin's architecture prioritizes simplicity - one comprehensive skill with helper scripts. The skill provides all guidance; scripts handle automation; no commands or agents needed.
