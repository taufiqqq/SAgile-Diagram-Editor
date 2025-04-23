import { ShapeNode, NodeMap, ParsedEdge } from '../types';
import { MarkerType } from "@xyflow/react";

export function parseNodes(umlString: string): {
  nodes: ShapeNode[];
  nodeMap: NodeMap;
} {
  const nodes: ShapeNode[] = [];
  const nodeMap: NodeMap = {};
  const processedUsecases = new Set<string>();
  const includeRelations = new Set<string>();
  const actorPositions = new Map<string, "left" | "right">();

  // First, find all include relationships to identify included use cases
  const findIncludeRegex = /"([^"]+)"\s+\.>\s+"([^"]+)"\s*:\s*include/g;
  for (const match of umlString.matchAll(findIncludeRegex)) {
    const [, , target] = match;
    includeRelations.add(target);
  }

  // Find all relationships to determine actor positions
  const leftToRightRegex = /"([^"]+)"\s*-->\s*"([^"]+)"/g;
  const rightToLeftRegex = /"([^"]+)"\s*<--\s*"([^"]+)"/g;

  // Process all relationships to determine actor positions
  for (const match of umlString.matchAll(leftToRightRegex)) {
    const [, source] = match;
    if (!actorPositions.has(source)) {
      actorPositions.set(source, "left");
    }
  }

  for (const match of umlString.matchAll(rightToLeftRegex)) {
    const [, , source] = match;
    if (!actorPositions.has(source)) {
      actorPositions.set(source, "right");
    }
  }

  // Extract actors
  const actorRegex = /actor\s+"?([^"]+)"?/g;
  let actorIdCounter = 1;
  let currentY = 0;
  let baseX = 100;

  for (const match of umlString.matchAll(actorRegex)) {
    const [, name] = match;
    const id = `actor_${actorIdCounter++}`;
    nodeMap[name] = id;

    // Determine position based on first relationship appearance
    const position = actorPositions.get(name) || "left";
    const x = position === "right" ? baseX + 500 : -100;

    nodes.push({
      id,
      position: { x, y: currentY },
      type: "shape",
      data: { type: "actor", label: name },
    });

    currentY += 120;
  }

  // Extract use cases within rectangles (packages)
  const rectangleRegex = /rectangle\s+(\w+)\s*{([^}]*)}/g;
  const usecaseRegex = /usecase\s+"([^"]+)"/g;
  let usecaseIdCounter = 1;
  let packageIdCounter = 1;
  currentY = 0;

  for (const rectangleMatch of umlString.matchAll(rectangleRegex)) {
    const [, packageName, rectangleContent] = rectangleMatch;
    
    // Store the starting Y position for this package
    const packageStartY = currentY;
    let usecaseCount = 0;
    
    // Process use cases within this package first
    for (const usecaseMatch of rectangleContent.matchAll(usecaseRegex)) {
      const [, name] = usecaseMatch;

      if (processedUsecases.has(name)) continue;

      const id = `usecase_${usecaseIdCounter++}`;
      nodeMap[name] = id;
      processedUsecases.add(name);

      // Position use cases
      nodes.push({
        id,
        position: { x: baseX + 150, y: currentY + 50 + (usecaseCount * 120) },
        type: "shape",
        data: { type: "usecase", label: name },
      });

      usecaseCount++;
    }
    
    // Calculate the final Y position after all use cases
    const packageEndY = currentY + 50 + (usecaseCount * 120) + 50;
    
    // Create the package node with height based on content
    const packageId = `package_${packageIdCounter++}`;
    nodeMap[packageName] = packageId;
    
    const packageNode: ShapeNode = {
      id: packageId,
      position: { x: baseX + 100, y: packageStartY },
      type: "shape",
      data: { 
        type: "package", 
        label: packageName,
        width: 300,
        height: packageEndY - packageStartY + 10
      },
      style: { zIndex: -1 },
      height: packageEndY - packageStartY + 100,
    };
    
    nodes.push(packageNode);
    
    // Update currentY for next package
    currentY = packageEndY + 10;
  }

  // Extract standalone use cases
  const standaloneUsecaseRegex = /usecase\s+"([^"]+)"/g;
  for (const match of umlString.matchAll(standaloneUsecaseRegex)) {
    const [, name] = match;

    if (processedUsecases.has(name)) continue;

    const id = `usecase_${usecaseIdCounter++}`;
    nodeMap[name] = id;
    processedUsecases.add(name);

    // All use cases at the same x level
    const x = baseX;

    nodes.push({
      id,
      position: { x, y: currentY },
      type: "shape",
      data: { type: "usecase", label: name },
    });

    currentY += 120;
  }

  return { nodes, nodeMap };
}

function calculateClosestHandles(sourceNode: ShapeNode, targetNode: ShapeNode) {
  const sourceX = sourceNode.position.x;
  const targetX = targetNode.position.x;
  
  // If target is to the right of source
  if (targetX > sourceX) {
    return {
      sourceHandle: 'right',
      targetHandle: 'left'
    };
  }
  // If target is to the left of source
  else {
    return {
      sourceHandle: 'left',
      targetHandle: 'right'
    };
  }
}

export function parseEdges(
  umlString: string,
  nodes: ShapeNode[],
  nodeMap: NodeMap,
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