import { useEffect, useState } from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';
import { useOrgStore } from '../state/useOrgStore';
import { ColumnMapping, OrgNode } from '../lib/types';

const requiredFields = [
  { key: 'employeeId' as keyof ColumnMapping, label: 'Employee ID', required: true },
  { key: 'fullName' as keyof ColumnMapping, label: 'Full Name', required: true },
  { key: 'title' as keyof ColumnMapping, label: 'Title', required: true },
  { key: 'department' as keyof ColumnMapping, label: 'Department', required: true },
  { key: 'managerId' as keyof ColumnMapping, label: 'Manager ID', required: true },
  { key: 'email' as keyof ColumnMapping, label: 'Email', required: false },
  { key: 'location' as keyof ColumnMapping, label: 'Location', required: false },
  { key: 'photoUrl' as keyof ColumnMapping, label: 'Photo URL', required: false }
];

export function ColumnMapper() {
  const { parsedData, columnMapping, setColumnMapping, setStep, setEmployees } = useOrgStore();
  const [localMapping, setLocalMapping] = useState<Partial<ColumnMapping>>(columnMapping);

  useEffect(() => {
    if (parsedData && Object.keys(localMapping).length === 0) {
      autoDetect();
    }
  }, [parsedData]);

  const autoDetect = () => {
    if (!parsedData) return;

    const detected: Partial<ColumnMapping> = {};
    const headers = parsedData.headers.map(h => h.toLowerCase());

    const patterns: Record<keyof ColumnMapping, string[]> = {
      employeeId: ['employee id', 'employeeid', 'emp id', 'empid', 'id', 'employee_id'],
      fullName: ['full name', 'fullname', 'name', 'employee name', 'full_name', 'employee_name'],
      title: ['title', 'job title', 'position', 'role', 'job_title'],
      department: ['department', 'dept', 'division', 'team'],
      managerId: ['manager id', 'managerid', 'mgr id', 'mgrid', 'manager', 'reports to', 'manager_id', 'mgr_id'],
      email: ['email', 'e-mail', 'email address', 'mail'],
      location: ['location', 'office', 'city', 'site'],
      photoUrl: ['photo', 'photo url', 'image', 'picture', 'avatar', 'photo_url']
    };

    for (const [field, fieldPatterns] of Object.entries(patterns)) {
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (fieldPatterns.some(pattern => header.includes(pattern))) {
          detected[field as keyof ColumnMapping] = parsedData.headers[i];
          break;
        }
      }
    }

    setLocalMapping(detected);
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    setLocalMapping(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!parsedData) return;

    const isValid = requiredFields
      .filter(f => f.required)
      .every(f => localMapping[f.key]);

    if (!isValid) {
      alert('Please map all required fields');
      return;
    }

    setColumnMapping(localMapping);

    const employees: OrgNode[] = parsedData.rows.map((row, index) => {
      const getValue = (key: keyof ColumnMapping) => {
        const column = localMapping[key];
        if (!column) return '';
        const value = row[column];
        return value ? String(value).trim() : '';
      };

      return {
        id: getValue('employeeId') || `MISSING_${index}`,
        name: getValue('fullName'),
        title: getValue('title'),
        department: getValue('department'),
        managerId: getValue('managerId') || null,
        email: getValue('email'),
        location: getValue('location'),
        photoUrl: getValue('photoUrl')
      };
    });

    setEmployees(employees);
    setStep('validate');
  };

  if (!parsedData) return null;

  const previewRows = parsedData.rows.slice(0, 5);
  const isValid = requiredFields.filter(f => f.required).every(f => localMapping[f.key]);

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Map Your Columns</h2>
            <p className="text-gray-600 mt-1">Match your file columns to the required fields</p>
          </div>

          <button
            onClick={autoDetect}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Wand2 size={18} />
            Auto-detect
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-gray-50">
            <div className="font-semibold text-gray-700">Required Field</div>
            <div className="font-semibold text-gray-700">Your Column</div>
            <div className="font-semibold text-gray-700">Sample Value</div>
          </div>

          {requiredFields.map((field) => {
            const selectedColumn = localMapping[field.key];
            const sampleValue = selectedColumn ? parsedData.rows[0]?.[selectedColumn] : '';

            return (
              <div key={field.key} className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100 items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{field.label}</span>
                  {field.required && <span className="text-red-500 text-sm">*</span>}
                </div>

                <select
                  value={selectedColumn || ''}
                  onChange={(e) => handleMappingChange(field.key, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select column...</option>
                  {parsedData.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>

                <div className="text-sm text-gray-600 truncate">
                  {sampleValue || <span className="text-gray-400">No value</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto mb-6">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Data Preview (First 5 Rows)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {parsedData.headers.map(header => (
                    <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    {parsedData.headers.map(header => (
                      <td key={header} className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {String(row[header] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => useOrgStore.getState().reset()}
            className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
          >
            Start Over
          </button>

          <button
            onClick={handleNext}
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue to Validation
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
