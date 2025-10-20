import { OrgNode } from './types';

export function buildHierarchy(nodes: OrgNode[]): OrgNode[] {
  const nodeMap = new Map<string, OrgNode>();
  const roots: OrgNode[] = [];

  // Clone nodes to avoid mutation
  const clonedNodes = nodes.map(node => ({ ...node, children: [] }));

  // Build map
  clonedNodes.forEach(node => {
    nodeMap.set(node.id, node);
  });

  // Build tree
  clonedNodes.forEach(node => {
    if (!node.managerId || !nodeMap.has(node.managerId)) {
      // This is a root node
      roots.push(node);
    } else {
      // Add to parent's children
      const manager = nodeMap.get(node.managerId);
      if (manager) {
        if (!manager.children) {
          manager.children = [];
        }
        manager.children.push(node);
      }
    }
  });

  // Sort children by name
  function sortChildren(node: OrgNode) {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(sortChildren);
    }
  }

  roots.forEach(sortChildren);
  roots.sort((a, b) => a.name.localeCompare(b.name));

  return roots;
}
