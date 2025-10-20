import { Upload, FileSpreadsheet } from 'lucide-react';
import { useCallback, useState } from 'react';
import { parseCSV } from '../lib/parseCSV';
import { parseXLSX } from '../lib/parseXLSX';
import { useOrgStore } from '../state/useOrgStore';

export function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setParsedData, setStep } = useOrgStore();

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setIsLoading(true);

    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      let data;

      if (extension === 'csv') {
        data = await parseCSV(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        data = await parseXLSX(file);
      } else {
        throw new Error('Unsupported file type. Please upload CSV, XLS, or XLSX files.');
      }

      setParsedData(data);
      setStep('map');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [setParsedData, setStep]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleLoadSample = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/sample-org.csv');
      const blob = await response.blob();
      const file = new File([blob], 'sample-org.csv', { type: 'text/csv' });
      await handleFile(file);
    } catch (err) {
      setError('Failed to load sample data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <FileSpreadsheet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Org Chart Data</h2>
          <p className="text-gray-600">
            Upload a CSV or Excel file containing your organization's structure
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            border-3 border-dashed rounded-xl p-12 text-center transition-all duration-200
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400 hover:bg-blue-50'}
          `}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />

          <p className="text-lg font-medium text-gray-700 mb-2">
            {isLoading ? 'Processing...' : 'Drop your file here, or click to browse'}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Supports CSV, XLS, and XLSX files
          </p>

          <input
            type="file"
            id="file-upload"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileInput}
            disabled={isLoading}
            className="hidden"
          />

          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose File
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleLoadSample}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium underline disabled:opacity-50"
          >
            Or try with sample data
          </button>
        </div>
      </div>
    </div>
  );
}
