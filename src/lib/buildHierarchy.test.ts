import { describe, it, expect } from 'vitest';
import { buildHierarchy } from './buildHierarchy';
import { OrgNode } from './types';

describe('buildHierarchy', () => {
  it('should build a simple hierarchy', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E002', name: 'Jamie Lee', title: 'VP', department: 'Engineering', managerId: 'E001' },
      { id: 'E003', name: 'Sam Patel', title: 'Manager', department: 'Engineering', managerId: 'E002' }
    ];

    const result = buildHierarchy(nodes);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('E001');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children![0].id).toBe('E002');
    expect(result[0].children![0].children).toHaveLength(1);
    expect(result[0].children![0].children![0].id).toBe('E003');
  });

  it('should handle multiple roots', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E002', name: 'Jamie Lee', title: 'CEO', department: 'Sales', managerId: null }
    ];

    const result = buildHierarchy(nodes);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('Alex Morgan' < 'Jamie Lee' ? 'E001' : 'E002');
  });

  it('should sort children by name', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: null },
      { id: 'E002', name: 'Zoe', title: 'VP', department: 'Engineering', managerId: 'E001' },
      { id: 'E003', name: 'Alice', title: 'VP', department: 'Sales', managerId: 'E001' }
    ];

    const result = buildHierarchy(nodes);

    expect(result[0].children![0].name).toBe('Alice');
    expect(result[0].children![1].name).toBe('Zoe');
  });

  it('should handle unmatched manager IDs as roots', () => {
    const nodes: OrgNode[] = [
      { id: 'E001', name: 'Alex Morgan', title: 'CEO', department: 'Executive', managerId: 'E999' },
      { id: 'E002', name: 'Jamie Lee', title: 'VP', department: 'Engineering', managerId: 'E001' }
    ];

    const result = buildHierarchy(nodes);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('E001');
  });
});
