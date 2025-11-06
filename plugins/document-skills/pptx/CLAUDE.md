# PPTX Skill

PowerPoint presentation creation and modification.

## Use When

- Creating new presentations from scratch or templates
- Modifying existing presentation content
- Working with slide layouts and design
- Adding comments or speaker notes
- Extracting presentation content

## Key Workflows

### New Presentation Without Template
1. Create HTML content with structure and styling
2. Use html2pptx to convert to PowerPoint
3. Apply design system and branding
4. Review and refine formatting

### New Presentation With Template
1. Load existing template
2. Duplicate and rearrange slides
3. Replace text using JSON mapping
4. Preserve template design and formatting
5. Save final presentation

### Editing Existing Presentations
1. Unpack OOXML (presentation is a ZIP archive)
2. Edit XML files directly
3. Validate XML structure
4. Repack into PPTX format
5. Test the modified presentation

## Common Operations

### Slide Management
- Add, remove, or reorder slides
- Duplicate slides with content
- Apply slide layouts
- Manage slide masters

### Content Modification
- Update text in placeholders
- Replace images
- Modify tables and charts
- Add speaker notes and comments

### Design and Formatting
- Apply themes and templates
- Set fonts and colors
- Position and size elements
- Apply animations (use sparingly)

## Best Practices

- **Template-first approach** - Start with templates when possible
- **Preserve design** - Maintain consistent branding and styling
- **Test output** - Always open and review generated presentations
- **OOXML for complex edits** - Direct XML editing for advanced modifications
- **Validate changes** - Ensure XML structure remains valid
- **Keep it simple** - Avoid overly complex layouts and animations

## Tools and Libraries

- **python-pptx** - Primary library for PPTX creation and modification
- **html2pptx** - Convert HTML to PowerPoint
- **OOXML manipulation** - Direct XML editing for advanced use cases
