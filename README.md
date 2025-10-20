# Org Chart Uploader & Visualizer

A production-ready web application that transforms CSV or Excel files into interactive, hierarchical organization charts.

## Features

- **Multiple File Format Support**: Upload CSV, XLS, or XLSX files
- **Smart Column Mapping**: Auto-detect column mappings with manual override options
- **Data Validation**: Comprehensive validation for duplicates, missing fields, unmatched managers, and circular reporting structures
- **Interactive Visualization**: Zoom, pan, expand/collapse nodes, expand all/collapse all buttons, search, and filter capabilities
- **Department Color Coding**: Automatic pastel color assignment with customizable colors and text for each department
- **Compact Mode**: Smaller node sizes (180x80px vs 280x120px) optimized for printing and large org charts
- **Export Options**: Download as PNG or SVG with full chart expansion, plus print-friendly view with enhanced connection lines
- **Modern UI**: Clean, accessible design with Poppins font and responsive layouts

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

## Usage

### 1. Upload Data

- Drag and drop a CSV or Excel file, or click to browse
- Alternatively, click "Or try with sample data" to load a demo dataset

### 2. Map Columns

- Match your file's columns to the required fields:
  - Employee ID (required)
  - Full Name (required)
  - Title (required)
  - Department (required)
  - Manager ID (required)
  - Email (optional)
  - Location (optional)
  - Photo URL (optional)
- Use the "Auto-detect" button for automatic mapping based on common column names

### 3. Validate

- Review validation results and statistics:
  - Total employees
  - Root nodes (top-level employees)
  - Unmatched manager IDs
  - Duplicate employee IDs
- Address any errors before proceeding (warnings can be bypassed)

### 4. Visualize & Export

- View the interactive org chart with color-coded departments
- Enable **Compact Mode** for smaller nodes optimized for printing
- Use **Expand All** to expand the entire org chart hierarchy
- Use **Collapse All** to collapse all nodes back to root level
- Use search to find specific employees by name, title, or department
- Filter by department to focus on specific teams
- **Customize Department Colors**: Change background and text colors for each department
  - Randomly assigned light pastel colors by default
  - Color picker for background color
  - Automatic contrast-based text color suggestion
  - Manual text color override available
- Export the chart as PNG or SVG (automatically expands the full chart before export)
- Print the chart with optimized layout (automatically expands before printing)
- Enhanced connection lines (darker, thicker for better visibility in print)

## Sample Data

The repository includes sample data in `public/sample-org.csv` demonstrating the expected format:

```csv
Employee ID,Full Name,Title,Department,Manager ID,Email,Location
E001,Alex Morgan,CEO,Executive,,alex@acme.com,Cleveland
E002,Jamie Lee,VP of Engineering,Engineering,E001,jamie@acme.com,Cleveland
...
```

## Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **File Parsing**: Papa Parse (CSV), SheetJS (Excel)
- **Visualization**: d3-org-chart
- **Export**: html-to-image

### Project Structure

```
/src
  /components       # React components
  /lib             # Utility functions and parsers
  /state           # Zustand store
  App.tsx          # Main application
  main.tsx         # Entry point
/public
  sample-org.csv   # Sample data file
```

### Key Components

- **FileDropZone**: Handles file upload and parsing
- **ColumnMapper**: Maps file columns to app fields
- **ValidationPanel**: Displays validation results
- **OrgChartView**: Renders the interactive org chart
- **ProgressSteps**: Shows current step in the workflow

### Core Libraries

- **detectIssues.ts**: Validates data for errors and warnings
- **buildHierarchy.ts**: Constructs tree structure from flat data
- **parseCSV.ts**: Parses CSV files using Papa Parse
- **parseXLSX.ts**: Parses Excel files using SheetJS
- **exportSvgPng.ts**: Handles chart export functionality

## Data Requirements

### Required Fields

All rows must include:
- Unique Employee ID
- Full Name
- Title
- Department
- Manager ID (can be empty for top-level employees)

### Data Validation

The app validates for:
- **Missing Employee IDs**: All employees must have unique IDs
- **Duplicate Employee IDs**: Each ID must be unique
- **Unmatched Manager IDs**: Manager IDs must reference valid Employee IDs
- **Circular Reporting**: Prevents cycles in the reporting structure
- **Multiple Roots**: Allows but warns about multiple top-level employees

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- WCAG AA color contrast compliance
- Focus indicators on all focusable elements

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
