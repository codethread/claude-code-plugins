# Document Processing Skills

A collection of Claude Code skills for working with common document formats.

## Overview

This plugin collection provides specialized capabilities for creating, editing, and analyzing professional documents. Each document format has its own dedicated skill with specialized tooling and best practices.

## Available Skills

### PDF - PDF Manipulation and Form Filling
Extract text and tables, create new PDFs, merge/split documents, and fill forms.

**Installation:**
```
/plugin install pdf@personal-configs-plugins
```

**Use when you need to:**
- Extract text and tables from PDFs
- Create new PDFs programmatically
- Merge, split, or rotate PDF documents
- Fill out PDF forms
- Process scanned PDFs with OCR

**Example:**
```
/pdf
Claude: I can help with PDF operations. What would you like to do?
User: Extract all tables from quarterly-report.pdf
```

### XLSX - Excel Spreadsheet Operations
Create and analyze spreadsheets with formulas, formatting, and data analysis.

**Installation:**
```
/plugin install xlsx@personal-configs-plugins
```

**Use when you need to:**
- Create spreadsheets with formulas and formatting
- Analyze spreadsheet data
- Modify existing spreadsheets while preserving formulas
- Perform data analysis and create visualizations
- Recalculate formulas with LibreOffice

**Example:**
```
/xlsx
Claude: I can help with spreadsheet operations. What would you like to do?
User: Create a financial model with monthly projections and formulas
```

### PPTX - PowerPoint Presentation Creation
Create and edit presentations with layouts, design, and content management.

**Installation:**
```
/plugin install pptx@personal-configs-plugins
```

**Use when you need to:**
- Create new presentations from scratch or templates
- Modify existing presentation content
- Work with slide layouts and design
- Add comments or speaker notes
- Process presentation files programmatically

**Example:**
```
/pptx
Claude: I can help with presentation operations. What would you like to do?
User: Create a 10-slide pitch deck with our brand template
```

### DOCX - Word Document Editing with Tracked Changes
Create and edit Word documents with professional formatting and change tracking.

**Installation:**
```
/plugin install docx@personal-configs-plugins
```

**Use when you need to:**
- Create new Word documents
- Edit existing documents with tracked changes
- Work with comments and formatting
- Process legal, academic, or business documents
- Preserve document structure and styles

**Example:**
```
/docx
Claude: I can help with document operations. What would you like to do?
User: Review contract.docx and add tracked changes for the payment terms section
```

## Choosing the Right Tool

- **Structured data and calculations** → Use XLSX
- **Presentations and slide decks** → Use PPTX
- **Text documents with formatting** → Use DOCX
- **Print-ready or form documents** → Use PDF

## Common Workflows

### Data Analysis Pipeline
1. Extract data from PDF reports using `/pdf`
2. Analyze and model data using `/xlsx`
3. Create presentation of findings using `/pptx`
4. Generate summary document using `/docx`

### Document Creation
1. Draft content structure in `/docx`
2. Add financial models in `/xlsx`
3. Create presentation in `/pptx`
4. Export final deliverable to PDF using `/pdf`

### Form Processing
1. Extract data from filled PDF forms using `/pdf`
2. Analyze responses in spreadsheet using `/xlsx`
3. Generate summary reports in `/docx`

## Best Practices

All document skills emphasize:

- **Preserve existing structure** - When editing, maintain original formatting and layout
- **Use appropriate tools** - Each format has specialized libraries for best results
- **Follow format conventions** - Respect document-specific best practices
- **Test output** - Always verify generated documents work as expected
- **Handle errors gracefully** - Documents can be complex; robust error handling is essential

## Troubleshooting

### Installation Issues
If plugin installation fails:
1. Verify you're using the correct marketplace: `personal-configs-plugins`
2. Check plugin availability: `/plugin list`
3. Try reinstalling: `/plugin uninstall <name>` then `/plugin install <name>@personal-configs-plugins`

### Document Processing Errors
- **PDF text extraction fails** - Document may be scanned; try OCR approach
- **Excel formulas not calculating** - Use LibreOffice recalculation workflow
- **PPTX layout issues** - Check template compatibility and OOXML structure
- **DOCX formatting lost** - Ensure using correct library (python-docx for tracked changes)

### Performance Issues
- **Large files** - Process in chunks or extract specific pages/sheets
- **Complex documents** - Simplify operations or break into smaller tasks
- **Memory constraints** - Close and reopen files between operations

## Learn More

Each skill has detailed documentation in its respective directory:
- `/Users/codethread/dev/learn/claude-plugins/plugins/document-skills/pdf/CLAUDE.md`
- `/Users/codethread/dev/learn/claude-plugins/plugins/document-skills/xlsx/CLAUDE.md`
- `/Users/codethread/dev/learn/claude-plugins/plugins/document-skills/pptx/CLAUDE.md`
- `/Users/codethread/dev/learn/claude-plugins/plugins/document-skills/docx/CLAUDE.md`
