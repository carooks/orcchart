import { Image, FileImage, Printer, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

interface ChartToolbarProps {
  onExportPNG: () => void;
  onExportSVG: () => void;
  onPrint: () => void;
  onReset: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function ChartToolbar({ onExportPNG, onExportSVG, onPrint, onReset, onExpandAll, onCollapseAll }: ChartToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'png' | 'svg') => {
    setIsExporting(true);
    try {
      if (type === 'png') {
        await onExportPNG();
      } else {
        await onExportSVG();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onExpandAll}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        <Maximize2 size={16} />
        Expand All
      </button>

      <button
        onClick={onCollapseAll}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
      >
        <Minimize2 size={16} />
        Collapse All
      </button>

      <div className="w-px h-8 bg-gray-300"></div>

      <button
        onClick={() => handleExport('png')}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
      >
        <Image size={16} />
        Export PNG
      </button>

      <button
        onClick={() => handleExport('svg')}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
      >
        <FileImage size={16} />
        Export SVG
      </button>

      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
      >
        <Printer size={16} />
        Print
      </button>

      <div className="w-px h-8 bg-gray-300"></div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        <RotateCcw size={16} />
        Start Over
      </button>
    </div>
  );
}
