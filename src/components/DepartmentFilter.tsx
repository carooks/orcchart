import { useOrgStore } from '../state/useOrgStore';

export function DepartmentFilter() {
  const { employees, selectedDepartments, setSelectedDepartments } = useOrgStore();

  const departments = Array.from(new Set(employees.map(e => e.department))).sort();

  const toggleDepartment = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  const clearAll = () => setSelectedDepartments([]);
  const selectAll = () => setSelectedDepartments(departments);

  if (departments.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Filter by Department</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={selectAll}
            className="text-blue-600 hover:text-blue-700"
          >
            All
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={clearAll}
            className="text-blue-600 hover:text-blue-700"
          >
            None
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {departments.map(dept => (
          <label
            key={dept}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedDepartments.length === 0 || selectedDepartments.includes(dept)}
              onChange={() => toggleDepartment(dept)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{dept}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
