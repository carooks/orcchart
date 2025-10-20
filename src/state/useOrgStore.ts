import { create } from 'zustand';
import { AppStep, ColumnMapping, OrgNode, ParsedData, ValidationResult } from '../lib/types';

interface OrgStore {
  step: AppStep;
  parsedData: ParsedData | null;
  columnMapping: Partial<ColumnMapping>;
  employees: OrgNode[];
  hierarchy: OrgNode[];
  validation: ValidationResult | null;
  searchTerm: string;
  selectedDepartments: string[];
  compactMode: boolean;
  departmentColors: Record<string, { bg: string; text: string }>;

  setStep: (step: AppStep) => void;
  setParsedData: (data: ParsedData | null) => void;
  setColumnMapping: (mapping: Partial<ColumnMapping>) => void;
  setEmployees: (employees: OrgNode[]) => void;
  setHierarchy: (hierarchy: OrgNode[]) => void;
  setValidation: (validation: ValidationResult | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedDepartments: (departments: string[]) => void;
  setCompactMode: (compact: boolean) => void;
  setDepartmentColor: (department: string, bg: string, text: string) => void;
  reset: () => void;
}

const initialState = {
  step: 'upload' as AppStep,
  parsedData: null,
  columnMapping: {},
  employees: [],
  hierarchy: [],
  validation: null,
  searchTerm: '',
  selectedDepartments: [],
  compactMode: false,
  departmentColors: {}
};

export const useOrgStore = create<OrgStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setParsedData: (parsedData) => set({ parsedData }),
  setColumnMapping: (columnMapping) => set({ columnMapping }),
  setEmployees: (employees) => set({ employees }),
  setHierarchy: (hierarchy) => set({ hierarchy }),
  setValidation: (validation) => set({ validation }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedDepartments: (selectedDepartments) => set({ selectedDepartments }),
  setCompactMode: (compactMode) => set({ compactMode }),
  setDepartmentColor: (department, bg, text) => set((state) => ({
    departmentColors: {
      ...state.departmentColors,
      [department]: { bg, text }
    }
  })),
  reset: () => set(initialState)
}));
