export interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId?: string | null;
  email?: string;
  location?: string;
  photoUrl?: string;
  children?: OrgNode[];
}

export interface RawEmployee {
  [key: string]: string | number | null | undefined;
}

export interface ColumnMapping {
  employeeId: string;
  fullName: string;
  title: string;
  department: string;
  managerId: string;
  email?: string;
  location?: string;
  photoUrl?: string;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  category: 'missing' | 'duplicate' | 'unmatched' | 'cycle' | 'multipleRoots';
  message: string;
  affectedIds?: string[];
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  stats: {
    totalEmployees: number;
    rootCount: number;
    unmatchedManagers: number;
    duplicates: number;
  };
}

export interface ParsedData {
  headers: string[];
  rows: RawEmployee[];
}

export type AppStep = 'upload' | 'map' | 'validate' | 'visualize';
