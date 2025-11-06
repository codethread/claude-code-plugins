# XLSX Skill

Excel spreadsheet operations with formula-first approach.

## Use When

- Creating spreadsheets with formulas and formatting
- Reading and analyzing spreadsheet data
- Modifying existing spreadsheets while preserving formulas
- Data analysis and visualization
- Recalculating formulas with LibreOffice

## Key Features

- **Formula-first approach** - Avoid hardcoding calculated values
- **Financial modeling standards** - Color coding, number formatting
- **Formula error detection** - Prevent and fix formula errors
- **Support for openpyxl and pandas** - Choose the right tool

## Common Workflows

### Creating Spreadsheets
1. Design structure and layout
2. Add formulas (never hardcode calculated values)
3. Apply formatting and styles
4. Add data validation and protection
5. Test formulas and calculations

### Reading Data
1. Load spreadsheet with openpyxl or pandas
2. Identify data structure and ranges
3. Extract values and formulas
4. Parse and structure the data

### Modifying Existing Spreadsheets
1. Load with openpyxl (preserves formulas)
2. Locate cells to modify
3. Update values or formulas
4. Preserve existing formatting
5. Save modified spreadsheet

### Formula Recalculation
1. Modify spreadsheet with openpyxl
2. Use LibreOffice to recalculate formulas
3. Verify calculations are correct

## Best Practices

- **ALWAYS use formulas** - Never hardcode calculated values
- **Color coding** - Blue for inputs, black for formulas
- **Number formatting** - Apply appropriate formats for dates, currency, percentages
- **Error handling** - Use IFERROR() and similar functions
- **Named ranges** - Use for important cells and ranges
- **Data validation** - Prevent invalid inputs
- **Test calculations** - Verify formulas produce expected results

## Library Selection

- **openpyxl** - When you need to preserve formulas and formatting
- **pandas** - For data analysis and manipulation
- **LibreOffice** - For formula recalculation
