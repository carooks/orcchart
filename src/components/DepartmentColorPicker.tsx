import { useOrgStore } from '../state/useOrgStore';
import { getContrastColor } from '../lib/colorUtils';

export function DepartmentColorPicker() {
  const { employees, departmentColors, setDepartmentColor } = useOrgStore();

  const departments = Array.from(new Set(employees.map(e => e.department))).sort();

  if (departments.length === 0) return null;

  const handleBgColorChange = (dept: string, color: string) => {
    const textColor = getContrastColor(color);
    setDepartmentColor(dept, color, textColor);
  };

  const handleTextColorChange = (dept: string, color: string) => {
    const currentBg = departmentColors[dept]?.bg || '#FFFFFF';
    setDepartmentColor(dept, currentBg, color);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">Department Colors</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {departments.map(dept => {
          const colors = departmentColors[dept] || { bg: '#FFFFFF', text: '#000000' };

          return (
            <div key={dept} className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm text-gray-700 truncate" title={dept}>
                {dept}
              </div>

              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Background</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={colors.bg}
                      onChange={(e) => handleBgColorChange(dept, e.target.value)}
                      className="w-12 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={colors.bg}
                      onChange={(e) => handleBgColorChange(dept, e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Text</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={colors.text}
                      onChange={(e) => handleTextColorChange(dept, e.target.value)}
                      className="w-12 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={colors.text}
                      onChange={(e) => handleTextColorChange(dept, e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div
                className="p-2 rounded text-center text-sm font-medium"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                Preview
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
