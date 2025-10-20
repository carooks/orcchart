import { useEffect, useRef, useMemo } from 'react';
import { OrgChart } from 'd3-org-chart';
import { useOrgStore } from '../state/useOrgStore';
import { ChartToolbar } from './ChartToolbar';
import { SearchBar } from './SearchBar';
import { DepartmentFilter } from './DepartmentFilter';
import { DepartmentColorPicker } from './DepartmentColorPicker';
import { exportPNG, exportSVG } from '../lib/exportSvgPng';
import { OrgNode } from '../lib/types';
import { generateDepartmentColors } from '../lib/colorUtils';

export function OrgChartView() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const {
    hierarchy,
    searchTerm,
    selectedDepartments,
    compactMode,
    departmentColors,
    employees,
    setDepartmentColor,
    reset
  } = useOrgStore();

  const filteredHierarchy = useMemo(() => {
    if (selectedDepartments.length === 0 && !searchTerm) {
      return hierarchy;
    }

    const filterNode = (node: OrgNode): OrgNode | null => {
      const matchesDept = selectedDepartments.length === 0 || selectedDepartments.includes(node.department);
      const matchesSearch = !searchTerm ||
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.department.toLowerCase().includes(searchTerm.toLowerCase());

      const filteredChildren = node.children
        ?.map(child => filterNode(child))
        .filter(child => child !== null) as OrgNode[] || [];

      if (matchesDept && matchesSearch) {
        return { ...node, children: filteredChildren };
      }

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }

      return null;
    };

    return hierarchy.map(root => filterNode(root)).filter(node => node !== null) as OrgNode[];
  }, [hierarchy, selectedDepartments, searchTerm]);

  useEffect(() => {
    if (employees.length > 0 && Object.keys(departmentColors).length === 0) {
      const departments = Array.from(new Set(employees.map(e => e.department)));
      const colors = generateDepartmentColors(departments);
      Object.entries(colors).forEach(([dept, color]) => {
        setDepartmentColor(dept, color.bg, color.text);
      });
    }
  }, [employees, departmentColors, setDepartmentColor]);

  useEffect(() => {
    if (!chartRef.current || filteredHierarchy.length === 0) return;

    const nodeWidth = compactMode ? 180 : 280;
    const baseHeight = compactMode ? 80 : 120;
    const childrenMargin = compactMode ? 30 : 60;
    const compactMargin = compactMode ? 20 : 40;

    const calculateNodeHeight = (d: any) => {
      const name = d.data?.name || d.name || '';
      const title = d.data?.title || d.title || '';
      const dept = d.data?.department || d.department || '';
      const location = d.data?.location || d.location || '';

      const charsPerLine = compactMode ? 25 : 35;
      const nameLines = Math.ceil(name.length / charsPerLine);
      const titleLines = Math.ceil(title.length / charsPerLine);
      const deptLines = Math.ceil(dept.length / charsPerLine);

      const lineHeight = compactMode ? 12 : 20;
      const padding = compactMode ? 16 : 32;
      const extraHeight = ((nameLines - 1) + (titleLines - 1) + (deptLines - 1)) * lineHeight;

      const locationHeight = !compactMode && location ? 20 : 0;

      return Math.max(baseHeight, baseHeight + extraHeight + locationHeight);
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current
        .nodeWidth(() => nodeWidth)
        .nodeHeight(calculateNodeHeight)
        .childrenMargin(() => childrenMargin)
        .compactMarginBetween(() => compactMargin)
        .compactMarginPair(() => compactMargin)
        .neighbourMargin(() => compactMargin)
        .siblingsMargin(() => compactMargin)
        .data(flattenHierarchy(filteredHierarchy))
        .render();
      return;
    }

    const chart = new OrgChart();
    chartInstanceRef.current = chart;

    chart
      .container(chartRef.current)
      .data(flattenHierarchy(filteredHierarchy))
      .nodeWidth(() => nodeWidth)
      .nodeHeight(calculateNodeHeight)
      .childrenMargin(() => childrenMargin)
      .compactMarginBetween(() => compactMargin)
      .compactMarginPair(() => compactMargin)
      .neighbourMargin(() => compactMargin)
      .siblingsMargin(() => compactMargin)
      .nodeContent((d: any) => {
        const isHighlighted = searchTerm && (
          d.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.data.department.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const deptColors = departmentColors[d.data.department] || { bg: '#FFFFFF', text: '#000000' };
        const fontSize = compactMode ? 10 : 16;
        const titleSize = compactMode ? 9 : 13;
        const padding = compactMode ? 8 : 16;
        const width = compactMode ? 180 : 280;
        const height = calculateNodeHeight(d);

        return `
          <div style="
            width: ${width}px;
            min-height: ${height}px;
            background: ${deptColors.bg};
            border: 2px solid ${isHighlighted ? '#3b82f6' : '#94a3b8'};
            border-radius: ${compactMode ? 8 : 12}px;
            padding: ${padding}px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-family: 'Poppins', sans-serif;
            ${isHighlighted ? 'box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);' : ''}
            box-sizing: border-box;
          ">
            <div style="
              font-size: ${compactMode ? 8 : 11}px;
              color: ${deptColors.text};
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: ${compactMode ? 4 : 8}px;
              opacity: 0.8;
              word-wrap: break-word;
              overflow-wrap: break-word;
            ">
              ${d.data.department}
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
              <div style="
                font-size: ${fontSize}px;
                font-weight: 600;
                color: ${deptColors.text};
                margin-bottom: ${compactMode ? 2 : 4}px;
                line-height: 1.3;
                word-wrap: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
              ">
                ${d.data.name}
              </div>

              <div style="
                font-size: ${titleSize}px;
                color: ${deptColors.text};
                line-height: 1.4;
                opacity: 0.9;
                word-wrap: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
              ">
                ${d.data.title}
              </div>
            </div>

            ${!compactMode && d.data.location ? `
              <div style="
                font-size: 11px;
                color: ${deptColors.text};
                margin-top: 8px;
                opacity: 0.7;
                word-wrap: break-word;
                overflow-wrap: break-word;
              ">
                📍 ${d.data.location}
              </div>
            ` : ''}
          </div>
        `;
      })
      .render();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current = null;
      }
    };
  }, [filteredHierarchy, searchTerm, compactMode, departmentColors]);

  const handleExpandAll = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.expandAll();
    }
  };

  const handleCollapseAll = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.collapseAll();
    }
  };

  const handleExportPNG = async () => {
    if (chartRef.current && chartInstanceRef.current) {
      chartInstanceRef.current.expandAll();
      await new Promise(resolve => setTimeout(resolve, 500));
      await exportPNG(chartRef.current);
    }
  };

  const handleExportSVG = async () => {
    if (chartRef.current && chartInstanceRef.current) {
      chartInstanceRef.current.expandAll();
      await new Promise(resolve => setTimeout(resolve, 500));
      await exportSVG(chartRef.current);
    }
  };

  const handlePrint = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.expandAll();
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      window.print();
    }
  };

  if (hierarchy.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">No data to display</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Organization Chart</h2>
            <ChartToolbar
              onExportPNG={handleExportPNG}
              onExportSVG={handleExportSVG}
              onPrint={handlePrint}
              onReset={reset}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
            />
          </div>
          <SearchBar />
        </div>

        <div
          ref={chartRef}
          className="flex-1 overflow-auto bg-gray-50 svg-chart-container"
          style={{ minHeight: '600px' }}
        />
      </div>

      <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Tools & Filters</h3>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => useOrgStore.getState().setCompactMode(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <div className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                Compact Mode
              </div>
              <div className="text-xs text-gray-500">
                Smaller nodes for printing
              </div>
            </div>
          </label>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <DepartmentFilter />
        </div>

        <DepartmentColorPicker />
      </div>
    </div>
  );
}

function flattenHierarchy(nodes: OrgNode[]): any[] {
  const result: any[] = [];

  function traverse(node: OrgNode, parentId: string | null = null) {
    result.push({
      id: node.id,
      parentId: parentId,
      name: node.name,
      title: node.title,
      department: node.department,
      email: node.email,
      location: node.location,
      photoUrl: node.photoUrl
    });

    if (node.children) {
      node.children.forEach(child => traverse(child, node.id));
    }
  }

  nodes.forEach(root => traverse(root));
  return result;
}
