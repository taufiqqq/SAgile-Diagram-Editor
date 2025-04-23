import { ShapeNode, NodeMap, ParsedEdge } from '../types';
import { MarkerType } from "@xyflow/react";
import { calculateClosestHandles } from './handleCalculator';

export function parseEdges(
  umlString: string,
  nodes: ShapeNode[],
  nodeMap: NodeMap,
  isLeftToRight: boolean
): ParsedEdge[] {
  const edges: ParsedEdge[] = [];

  // Parse normal relationships (left to right)
  const leftToRightRegex = /"([^"]+)"\s+-->\s+"([^"]+)"/g;
  for (const match of umlString.matchAll(leftToRightRegex)) {
    const [, source, target] = match;
    const sourceId = nodeMap[source];
    const targetId = nodeMap[target];

    if (sourceId && targetId) {
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        const { sourceHandle, targetHandle } = calculateClosestHandles(sourceNode, targetNode);
        
        edges.push({
          id: `e${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: "custom",
          data: { type: "association" },
          sourceHandle,
          targetHandle,
        });
      }
    }
  }

  // Parse normal relationships (right to left)
  const rightToLeftRegex = /"([^"]+)"\s+<--\s+"([^"]+)"/g;
  for (const match of umlString.matchAll(rightToLeftRegex)) {
    const [, target, source] = match;
    const sourceId = nodeMap[source];
    const targetId = nodeMap[target];

    if (sourceId && targetId) {
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        const { sourceHandle, targetHandle } = calculateClosestHandles(sourceNode, targetNode);
        
        edges.push({
          id: `e${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: "custom",
          data: { type: "association" },
          sourceHandle,
          targetHandle,
        });
      }
    }
  }

  // Parse include relationships
  const includeRelationRegex = /"([^"]+)"\s+\.>\s+"([^"]+)"\s*:\s*include/g;
  for (const match of umlString.matchAll(includeRelationRegex)) {
    const [, source, target] = match;
    const sourceId = nodeMap[source];
    const targetId = nodeMap[target];

    if (sourceId && targetId) {
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        // For include relationships, always use right and left handles
        const sourceHandle = 'right';
        const targetHandle = 'left';
        
        edges.push({
          id: `e${sourceId}-${targetId}-include`,
          source: sourceId,
          target: targetId,
          type: "custom",
          data: { type: "include" },
          sourceHandle,
          targetHandle,
          style: { strokeDasharray: "5 5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#b1b1b7",
          },
          label: "«include»",
          labelStyle: { fill: "#000", fontFamily: "monospace" },
        });
      }
    }
  }

  return edges;
} 