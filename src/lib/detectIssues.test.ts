import { describe, it, expect } from 'vitest';
import { detectIssues } from './detectIssues';
import { OrgNode } from './types';

describe('detectIssues', () => {
  it('should pass validation for valid data', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E002', name: 'Jamie Lee', title: 'VP', department: 'Engineering', managerId: 'E001' }
    ];

    const result = detectIssues(nodes);

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.stats.totalEmployees).toBe(2);
    expect(result.stats.rootCount).toBe(1);
  });

  it('should detect duplicate employee IDs', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E001', name: 'Jamie Lee', title: 'VP', department: 'Engineering', managerId: null }
    ];

    const result = detectIssues(nodes);

    expect(result.valid).toBe(false);
    expect(result.stats.duplicates).toBe(1);
    expect(result.issues.some(i => i.category === 'duplicate')).toBe(true);
  });

  it('should detect unmatched manager IDs', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E002', name: 'Jamie Lee', title: 'VP', department: 'Engineering', managerId: 'E999' }
    ];

    const result = detectIssues(nodes);

    expect(result.stats.unmatchedManagers).toBe(1);
    expect(result.issues.some(i => i.category === 'unmatched')).toBe(true);
  });

  it('should detect cycles in reporting structure', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex', title: 'CEO', department: 'Executive', managerId: 'E002' },
      { id: 'E002', name: 'Jamie', title: 'VP', department: 'Engineering', managerId: 'E001' }
    ];

    const result = detectIssues(nodes);

    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.category === 'cycle')).toBe(true);
  });

  it('should warn about multiple roots', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E002', name: 'Jamie Lee', title: 'CEO', department: 'Sales', managerId: null }
    ];

    const result = detectIssues(nodes);

    expect(result.stats.rootCount).toBe(2);
    expect(result.issues.some(i => i.category === 'multipleRoots')).toBe(true);
  });
});
