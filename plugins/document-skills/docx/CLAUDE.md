# DOCX Skill

Word document editing with tracked changes support.

## Use When

- Creating new Word documents
- Editing existing documents with tracked changes
- Working with comments and formatting
- Processing legal, academic, or business documents
- Extracting document content

## Key Workflows

### Creating New Documents
1. Use docx-js library (JavaScript/TypeScript)
2. Define document structure and sections
3. Add content with appropriate formatting
4. Apply styles and themes
5. Save final document

### Editing Existing Documents
1. Use Document library (Python) for OOXML manipulation
2. Load existing document
3. Locate content to modify
4. Make changes while preserving structure
5. Save modified document

### Redlining (Tracked Changes)
1. Load document with Document library
2. Parse existing content and structure
3. Apply tracked changes for modifications:
   - Deletions marked as deleted runs
   - Insertions marked as new runs
   - Formatting changes tracked appropriately
4. Batch changes efficiently
5. Save document with tracked changes
6. Review in Word to verify changes

## Common Operations

### Content Modification
- Add, remove, or modify paragraphs
- Update text with formatting
- Insert tables and images
- Manage headers and footers

### Formatting
- Apply character and paragraph styles
- Set fonts, colors, and sizes
- Control spacing and alignment
- Use built-in styles consistently

### Tracked Changes
- Mark deletions (preserve original text)
- Mark insertions (add new content)
- Track formatting changes
- Add comments and annotations
- Set author and timestamp

### Structure
- Manage sections and page breaks
- Control page layout and margins
- Add table of contents
- Handle footnotes and endnotes

## Best Practices

- **Preserve structure** - Maintain document organization when editing
- **Use styles** - Apply built-in styles rather than direct formatting
- **Batch tracked changes** - Group related changes for efficiency
- **Test in Word** - Always review tracked changes in Microsoft Word
- **Handle encoding** - Be aware of character encoding issues
- **Validate OOXML** - Ensure XML structure remains valid after edits

## Library Selection

- **docx-js** - For creating new documents (JavaScript/TypeScript)
- **python-docx** - For basic document creation and reading (Python)
- **Document library** - For advanced editing and tracked changes (Python)
- **OOXML manipulation** - For complex requirements requiring direct XML access

## Tracked Changes Details

When implementing redlining:
1. **Mark deletions** - Don't remove text, mark it as deleted
2. **Mark insertions** - Add new runs with insertion tracking
3. **Preserve formatting** - Track formatting changes separately
4. **Set metadata** - Include author, date, and change ID
5. **Batch efficiently** - Process changes in logical groups
6. **Verify output** - Open in Word to confirm changes appear correctly
