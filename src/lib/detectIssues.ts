import { OrgNode, ValidationIssue, ValidationResult } from './types';

export function detectIssues(nodes: OrgNode[]): ValidationResult {
  const issues: ValidationIssue[] = [];
  const stats = {
    totalEmployees: nodes.length,
    rootCount: 0,
    unmatchedManagers: 0,
    duplicates: 0
  };

  // Check for duplicates
  const idMap = new Map<string, number>();
  const duplicateIds = new Set<string>();

  nodes.forEach(node => {
    const count = idMap.get(node.id) || 0;
    idMap.set(node.id, count + 1);
    if (count > 0) {
      duplicateIds.add(node.id);
    }
  });

  if (duplicateIds.size > 0) {
    stats.duplicates = duplicateIds.size;
    issues.push({
      type: 'error',
      category: 'duplicate',
      message: `Found ${duplicateIds.size} duplicate Employee ID(s)`,
      affectedIds: Array.from(duplicateIds)
    });
  }

  // Check for missing required fields
  const missingFields: string[] = [];
  nodes.forEach(node => {
    if (!node.id) missingFields.push('Employee ID');
    if (!node.name) missingFields.push('Full Name');
    if (!node.title) missingFields.push('Title');
    if (!node.department) missingFields.push('Department');
  });

  if (missingFields.length > 0) {
    issues.push({
      type: 'error',
      category: 'missing',
      message: `Some rows have missing required fields: ${[...new Set(missingFields)].join(', ')}`
    });
  }

  // Check for unmatched managers
  const employeeIds = new Set(nodes.map(n => n.id));
  const unmatchedManagers = new Set<string>();

  nodes.forEach(node => {
    if (node.managerId && !employeeIds.has(node.managerId)) {
      unmatchedManagers.add(node.managerId);
    }
  });

  stats.unmatchedManagers = unmatchedManagers.size;
  if (unmatchedManagers.size > 0) {
    issues.push({
      type: 'warning',
      category: 'unmatched',
      message: `${unmatchedManagers.size} Manager ID(s) don't match any Employee ID`,
      affectedIds: Array.from(unmatchedManagers)
    });
  }

  // Check for cycles
  const cycles = detectCycles(nodes);
  if (cycles.length > 0) {
    issues.push({
      type: 'error',
      category: 'cycle',
      message: `Detected ${cycles.length} cycle(s) in reporting structure`,
      affectedIds: cycles.flat()
    });
  }

  // Count roots
  const roots = nodes.filter(n => !n.managerId || !employeeIds.has(n.managerId));
  stats.rootCount = roots.length;

  if (roots.length > 1) {
    issues.push({
      type: 'warning',
      category: 'multipleRoots',
      message: `Found ${roots.length} top-level employees (multiple roots)`,
      affectedIds: roots.map(r => r.id)
    });
  }

  const valid = !issues.some(i => i.type === 'error');

  return {
    valid,
    issues,
    stats
  };
}

function detectCycles(nodes: OrgNode[]): string[][] {
  const cycles: string[][] = [];
  const idToNode = new Map(nodes.map(n => [n.id, n]));
  const colors = new Map<string, 'white' | 'gray' | 'black'>();

  nodes.forEach(n => colors.set(n.id, 'white'));

  function dfs(nodeId: string, path: string[]): void {
    colors.set(nodeId, 'gray');
    path.push(nodeId);

    const node = idToNode.get(nodeId);
    if (node?.managerId) {
      const managerColor = colors.get(node.managerId);

      if (managerColor === 'gray') {
        const cycleStartIndex = path.indexOf(node.managerId);
        cycles.push(path.slice(cycleStartIndex));
      } else if (managerColor === 'white') {
        dfs(node.managerId, [...path]);
      }
    }

    colors.set(nodeId, 'black');
  }

  nodes.forEach(node => {
    if (colors.get(node.id) === 'white') {
      dfs(node.id, []);
    }
  });

  return cycles;
}
