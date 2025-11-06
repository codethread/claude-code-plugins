# Skill Creator Plugin

Guides the creation of effective skills that extend Claude's capabilities.

## Use When

- Creating new skills for specialized domains or workflows
- Updating existing skills with new capabilities
- Designing reusable knowledge packages for Claude

## Key Concepts

- **SKILL.md** - Required file with YAML frontmatter and markdown instructions
- **Bundled resources** - Optional scripts, references, and assets
- **Progressive disclosure** - Three-level loading system (metadata → SKILL.md → resources)

## Workflow

1. **Understand the skill** with concrete examples
2. **Plan reusable skill contents** (scripts, references, assets)
3. **Initialize skill structure** using `init_skill.py`
4. **Edit SKILL.md and bundled resources**
5. **Package skill** using `package_skill.py`
6. **Iterate based on real usage**

## Skill Structure

A well-designed skill includes:

- Clear YAML frontmatter with name, description, and tags
- Focused instructions for a specific domain or task
- Bundled scripts or tools that extend functionality
- Reference materials and examples
- Progressive loading to manage context efficiently

## Best Practices

- Start with concrete examples to understand the domain
- Keep skills focused on a single domain or workflow
- Use bundled resources for code that would clutter the prompt
- Test skills in real scenarios to validate effectiveness
- Iterate and refine based on actual usage patterns
