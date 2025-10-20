import * as XLSX from 'xlsx';
import { ParsedData } from './types';

export function parseXLSX(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          reject(new Error('No sheets found in workbook'));
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonData.length === 0) {
          reject(new Error('Sheet is empty'));
          return;
        }

        const headers = Object.keys(jsonData[0] as object).map(h => h.trim());

        resolve({
          headers,
          rows: jsonData as any[]
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}
