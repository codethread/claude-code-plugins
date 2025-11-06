# PDF Skill

PDF manipulation and form filling capabilities.

## Use When

- Extracting text and tables from PDFs
- Creating new PDFs with reportlab
- Merging, splitting, or rotating PDF documents
- Filling out PDF forms
- Processing scanned PDFs with OCR

## Key Tools

- **pypdf** - PDF manipulation (merge, split, rotate)
- **pdfplumber** - Text and table extraction
- **reportlab** - PDF creation from scratch
- **pytesseract** - OCR for scanned PDFs

## Common Workflows

### Extracting Content
1. Use pdfplumber to extract text and tables
2. Parse and structure the extracted data
3. Handle multi-column layouts and complex formatting

### Creating PDFs
1. Design layout using reportlab
2. Add text, images, and graphics
3. Apply formatting and styles
4. Generate final PDF output

### Form Filling
1. Load existing PDF with form fields
2. Identify field names and types
3. Populate fields with data
4. Save filled PDF

### PDF Manipulation
1. Load PDFs with pypdf
2. Perform operations (merge, split, rotate)
3. Preserve metadata and bookmarks
4. Save modified PDF

## Best Practices

- Test extraction on sample pages before processing entire documents
- Handle encoding issues gracefully
- Preserve document structure when manipulating PDFs
- Use appropriate tools for each task (don't use reportlab for extraction)
- Consider file size when creating new PDFs
