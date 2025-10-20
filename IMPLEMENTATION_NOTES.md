# Implementation Notes

## Key Features Implemented

### 1. File Upload & Parsing

**Location**: `src/components/FileDropZone.tsx`, `src/lib/parseCSV.ts`, `src/lib/parseXLSX.ts`

- Drag-and-drop interface with visual feedback
- Support for CSV, XLS, and XLSX files
- Sample data loader for quick testing
- Error handling for invalid files and formats
- Uses Papa Parse for CSV and SheetJS (xlsx) for Excel files

### 2. Column Mapping

**Location**: `src/components/ColumnMapper.tsx`

- Auto-detection of column mappings based on common header patterns
- Manual override capability with dropdown selectors
- Real-time preview of first 5 rows
- Visual indicators for required vs optional fields
- Sample value display for each mapped column

### 3. Data Validation

**Location**: `src/lib/detectIssues.ts`, `src/components/ValidationPanel.tsx`

Comprehensive validation checks:
- **Missing Employee IDs**: Ensures all employees have unique identifiers
- **Duplicate Employee IDs**: Detects and reports duplicates
- **Unmatched Manager IDs**: Identifies manager IDs that don't correspond to any employee
- **Cycle Detection**: Uses DFS with color-marking to detect circular reporting structures
- **Multiple Roots**: Warns when multiple top-level employees exist

Validation statistics dashboard showing:
- Total employee count
- Number of root nodes
- Unmatched manager count
- Duplicate count

### 4. Hierarchy Building

**Location**: `src/lib/buildHierarchy.ts`

- Converts flat data into tree/forest structure
- Handles multiple roots gracefully
- Sorts children alphabetically by name
- Recursive tree construction with proper parent-child relationships

### 5. Interactive Visualization

**Location**: `src/components/OrgChartView.tsx`

Powered by d3-org-chart with features:
- **Zoom & Pan**: Navigate large org charts easily
- **Expand/Collapse**: Individual node expansion built into d3-org-chart
- **Expand All / Collapse All**: Toolbar buttons to expand or collapse entire hierarchy at once
- **Search**: Real-time filtering by name, title, or department with visual highlights
- **Department Filter**: Toggle visibility by department
- **Node Design**: Custom styled nodes showing department, name, title, and optional location

Node styling:
- 280px x 120px cards (normal mode) or 180px x 80px (compact mode)
- **Dynamic height calculation**: Automatically expands based on text length
  - Calculates lines needed based on ~35 chars/line (normal) or ~25 chars/line (compact)
  - Adds 20px per additional line for name, title, and department
  - Includes extra space for location when present
  - Uses `min-height` instead of fixed height for proper expansion
- Department label at top (small, uppercase, color-coded)
- Name prominently displayed (16px normal / 10px compact, bold)
- Title below name (13px normal / 9px compact)
- Optional location with pin icon (hidden in compact mode)
- Text wrapping with `word-wrap: break-word` and `overflow-wrap: break-word`
- Search highlighting with blue border and glow effect
- Background and text colors customizable per department

### 6. Export & Print

**Location**: `src/lib/exportSvgPng.ts`, `src/components/ChartToolbar.tsx`

- **PNG Export**: Custom canvas-based export for complete chart capture
  - Automatically expands entire chart before export to capture all nodes
  - Uses SVG getBBox() to determine full chart dimensions
  - Captures entire rendered chart, not just visible viewport
  - 2x scale for high-quality output with 40px padding
  - 500ms delay ensures chart is fully rendered before capture
- **SVG Export**: Direct SVG serialization with full viewBox calculation
  - Automatically expands entire chart before export to capture all nodes
  - Clones SVG and sets viewBox to capture entire chart area
  - Uses getBBox() to include all elements regardless of viewport
  - 40px padding around chart for clean export
  - 500ms delay ensures chart is fully rendered before capture
- **Print**: CSS print styles optimized for landscape printing with page-break hints
  - Automatically expands entire chart before printing
  - Enhanced line visibility (black, 2px width) for print output
  - 500ms delay ensures chart is fully rendered before print dialog

### 7. State Management

**Location**: `src/state/useOrgStore.ts`

Zustand store managing:
- Current application step (upload → map → validate → visualize)
- Parsed data from file
- Column mappings
- Employee array (flat)
- Hierarchy (tree structure)
- Validation results
- Search term
- Selected departments for filtering
- Compact mode toggle state
- Department color mappings (background and text colors)

### 8. UI/UX Design

**Design System**:
- Poppins font family for modern, clean look
- Tailwind CSS for utility-first styling
- Soft shadows and rounded corners (12px border-radius)
- Blue accent color (#3b82f6) for primary actions
- Emerald for success states, amber for warnings, red for errors
- Subtle hover states and transitions (200ms)
- Responsive design with desktop-first approach

**Progress Indicator**:
- 4-step visual progress bar
- Clear indication of current, completed, and upcoming steps
- Color-coded: gray (pending), blue (current), emerald (completed)

## Code Organization

### Component Architecture

- **Single Responsibility**: Each component has a clear, focused purpose
- **Composition**: Small, reusable components composed into larger features
- **Props vs State**: Clear separation between local state and global store
- **Type Safety**: Full TypeScript coverage with strict types

### Library Functions

All core logic separated into pure functions:
- `parseCSV` and `parseXLSX`: File parsing
- `detectIssues`: Validation logic
- `buildHierarchy`: Tree construction
- `exportSvgPng`: Export utilities

Benefits:
- Easy to test (see test files)
- Reusable across components
- No side effects
- Clear input/output contracts

## Testing

**Location**: `src/lib/*.test.ts`

Unit tests for critical functions:
- `detectIssues.test.ts`: Validates all error detection scenarios
- `buildHierarchy.test.ts`: Tests tree construction and edge cases

Test coverage includes:
- Valid data scenarios
- Duplicate detection
- Unmatched manager IDs
- Cycle detection
- Multiple roots
- Sorting behavior

Run tests with: `npm run test:run`

## Performance Considerations

1. **Debounced Search**: Search updates filtered hierarchy efficiently
2. **Memoization**: `useMemo` for filtered hierarchy prevents unnecessary recalculations
3. **Lazy Rendering**: d3-org-chart handles virtualization internally
4. **Component Updates**: Zustand ensures only subscribed components re-render

## Accessibility

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Focus Management**: Clear focus indicators on all focusable elements
3. **ARIA Labels**: Semantic HTML with proper labels
4. **Color Contrast**: WCAG AA compliance throughout
5. **Error Messages**: Clear, descriptive error messages for all failure states

## Browser Compatibility

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **Large Datasets**: Charts with 500+ employees may have performance issues
2. **Print Layout**: Very wide org charts may require manual adjustment
3. **Mobile Support**: Optimized for desktop; mobile experience is functional but not ideal
4. **Excel Compatibility**: Some older Excel formats (.xls from Excel 2003) may have parsing issues

## Future Enhancements

Potential improvements:
1. **Photo Support**: Display employee photos in nodes
2. **Custom Themes**: User-selectable color schemes
3. **Advanced Filters**: Filter by title, location, or custom fields
4. **Edit Mode**: In-app editing of org chart data
5. **Save/Load**: Persist org charts to database
6. **Collaboration**: Real-time multi-user editing
7. **Analytics**: Span of control, depth metrics, team size statistics
8. **PDF Export**: Direct PDF generation with multi-page support

## Development Notes

### Adding New Fields

To add a new field to the org chart:

1. Update `ColumnMapping` interface in `src/lib/types.ts`
2. Add field to `requiredFields` array in `src/components/ColumnMapper.tsx`
3. Update `OrgNode` interface in `src/lib/types.ts`
4. Modify node rendering in `src/components/OrgChartView.tsx`

### Customizing Node Appearance

Node styles are in the `nodeContent` function in `OrgChartView.tsx`. Modify the inline styles to change:
- Card dimensions (currently 280x120px)
- Colors and borders
- Font sizes
- Layout and spacing

### Changing Validation Rules

Edit `src/lib/detectIssues.ts` to add or modify validation checks. Each validation issue should:
- Have a clear type ('error' or 'warning')
- Include a descriptive category
- Provide a user-friendly message
- List affected IDs when applicable

## Credits

Built with:
- React 18 & TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- d3-org-chart (visualization)
- Papa Parse (CSV parsing)
- SheetJS (Excel parsing)
- html-to-image (PNG export)
- Vitest (testing)
