import { useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Users, ArrowRight } from 'lucide-react';
import { useOrgStore } from '../state/useOrgStore';
import { detectIssues } from '../lib/detectIssues';
import { buildHierarchy } from '../lib/buildHierarchy';

export function ValidationPanel() {
  const { employees, validation, setValidation, setHierarchy, setStep } = useOrgStore();

  useEffect(() => {
    if (employees.length > 0) {
      const result = detectIssues(employees);
      setValidation(result);
    }
  }, [employees, setValidation]);

  const handleContinue = () => {
    const hierarchy = buildHierarchy(employees);
    setHierarchy(hierarchy);
    setStep('visualize');
  };

  if (!validation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating data...</p>
        </div>
      </div>
    );
  }

  const hasErrors = validation.issues.some(i => i.type === 'error');
  const hasWarnings = validation.issues.some(i => i.type === 'warning');

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Validation</h2>
          <p className="text-gray-600">Review the analysis of your organization data</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-blue-600" size={24} />
              <span className="text-gray-600 text-sm">Total Employees</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{validation.stats.totalEmployees}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-emerald-600" size={24} />
              <span className="text-gray-600 text-sm">Root Nodes</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{validation.stats.rootCount}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-amber-600" size={24} />
              <span className="text-gray-600 text-sm">Unmatched</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{validation.stats.unmatchedManagers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-red-600" size={24} />
              <span className="text-gray-600 text-sm">Duplicates</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{validation.stats.duplicates}</p>
          </div>
        </div>

        {validation.issues.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-1">All Checks Passed</h3>
                <p className="text-emerald-700">Your data is valid and ready to visualize.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {validation.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`
                  rounded-xl p-6 border
                  ${issue.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}
                `}
              >
                <div className="flex items-start gap-4">
                  {issue.type === 'error' ? (
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                  ) : (
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${issue.type === 'error' ? 'text-red-900' : 'text-amber-900'}`}>
                      {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} Issue
                    </h3>
                    <p className={issue.type === 'error' ? 'text-red-700' : 'text-amber-700'}>
                      {issue.message}
                    </p>
                    {issue.affectedIds && issue.affectedIds.length > 0 && (
                      <div className="mt-3">
                        <p className={`text-sm font-medium mb-2 ${issue.type === 'error' ? 'text-red-800' : 'text-amber-800'}`}>
                          Affected IDs:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {issue.affectedIds.slice(0, 10).map(id => (
                            <span
                              key={id}
                              className={`
                                px-2 py-1 rounded text-xs font-mono
                                ${issue.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}
                              `}
                            >
                              {id}
                            </span>
                          ))}
                          {issue.affectedIds.length > 10 && (
                            <span className="text-xs text-gray-600">
                              +{issue.affectedIds.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep('map')}
            className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
          >
            Back to Mapping
          </button>

          <button
            onClick={handleContinue}
            disabled={hasErrors}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {hasErrors ? 'Fix Errors to Continue' : hasWarnings ? 'Continue Anyway' : 'Continue to Visualization'}
            {!hasErrors && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
