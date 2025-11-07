# Document Processing Skills

Collection of Claude Code skills for creating, editing, and analyzing professional documents in common formats.

## When to Use

- **PDF** - Extract text/tables, create PDFs, merge/split, fill forms
- **XLSX** - Create spreadsheets with formulas, analyze data
- **PPTX** - Create and edit presentations
- **DOCX** - Edit Word documents with tracked changes

## Installation

Install skills individually:

```bash
/plugin install pdf@personal-configs-plugins
/plugin install xlsx@personal-configs-plugins
/plugin install pptx@personal-configs-plugins
/plugin install docx@personal-configs-plugins
```

## Available Skills

### PDF - PDF Manipulation and Form Filling

```bash
/pdf
```

Use when you need to:
- Extract text and tables from PDFs
- Create new PDFs programmatically
- Merge, split, or rotate documents
- Fill PDF forms
- Process scanned PDFs with OCR

### XLSX - Excel Spreadsheet Operations

```bash
/xlsx
```

Use when you need to:
- Create spreadsheets with formulas and formatting
- Analyze spreadsheet data
- Modify existing sheets preserving formulas
- Perform data analysis and visualization
- Recalculate formulas with LibreOffice

### PPTX - PowerPoint Presentation Creation

```bash
/pptx
```

Use when you need to:
- Create presentations from scratch or templates
- Modify existing presentation content
- Work with slide layouts and design
- Add comments or speaker notes
- Process presentations programmatically

### DOCX - Word Document Editing with Tracked Changes

```bash
/docx
```

Use when you need to:
- Create new Word documents
- Edit documents with tracked changes
- Work with comments and formatting
- Process legal, academic, or business documents
- Preserve document structure and styles

## Quick Examples

### PDF
```
/pdf
"Extract all tables from quarterly-report.pdf"
```

### XLSX
```
/xlsx
"Create a financial model with monthly projections and formulas"
```

### PPTX
```
/pptx
"Create a 10-slide pitch deck with our brand template"
```

### DOCX
```
/docx
"Review contract.docx and add tracked changes for payment terms"
```

## Choosing the Right Tool

- **Structured data and calculations** → XLSX
- **Presentations and slide decks** → PPTX
- **Text documents with formatting** → DOCX
- **Print-ready or form documents** → PDF

## Common Workflows

### Data Analysis Pipeline
1. Extract data from PDFs → `/pdf`
2. Analyze in spreadsheet → `/xlsx`
3. Create presentation → `/pptx`
4. Generate summary → `/docx`

### Document Creation
1. Draft structure → `/docx`
2. Add financial models → `/xlsx`
3. Create presentation → `/pptx`
4. Export to PDF → `/pdf`

## Related

- See individual `{format}/CLAUDE.md` files for maintainer documentation
- See `CLAUDE.md` for plugin architecture overview
