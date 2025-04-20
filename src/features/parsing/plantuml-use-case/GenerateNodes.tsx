// GenerateNodes.ts
import { ShapeNode } from "../../diagram-editing/types/NodeTypes.types";
import { MarkerType } from "@xyflow/react";
import { EdgeType } from "../../diagram-editing/types/EdgeTypes.types";

// Sample PlantUML input string
const plantUML = `
left to right direction

actor "Project Manager"

rectangle sprintDebug {
	usecase "Drink"
	usecase "Buat Something"
	usecase "Tak haus"
	usecase "Eat"
}

"Project Manager" --> "Eat"
"Project Manager" --> "Tak haus"
"Tak haus" .> "Drink" : include
"Project Manager" --> "Buat Something"
`;

// Function to parse PlantUML string
function parsePlantUML(umlString: string) {
  const nodes: ShapeNode[] = [];
  const edges: any[] = [];
  const nodeMap = new Map<string, string>(); // Maps node names to IDs
  const processedUsecases = new Set<string>(); // Track which use cases have been processed
  const includeRelations = new Set<string>(); // Track which use cases are included by others

  // First, find all include relationships to identify included use cases
  const findIncludeRegex = /"([^"]+)"\s+\.>\s+"([^"]+)"\s*:\s*include/g;
  for (const match of umlString.matchAll(findIncludeRegex)) {
    const [, , target] = match;
    includeRelations.add(target);
  }

  // Extract direction
  const directionMatch = umlString.match(/left to right direction/);
  const isLeftToRight = !!directionMatch;

  // Extract actors - match format: actor "Name"
  const actorRegex = /actor\s+"([^"]+)"/g;
  let actorIdCounter = 1;
  let currentY = 0;

  for (const match of umlString.matchAll(actorRegex)) {
    const [, name] = match;
    const id = `actor_${actorIdCounter++}`;
    nodeMap.set(name, id);

    nodes.push({
      id,
      position: { x: isLeftToRight ? -100 : 0, y: currentY },
      type: "shape",
      data: { type: "actor", label: name },
    });
  }

  // Extract use cases within rectangles
  const rectangleRegex = /rectangle\s+(\w+)\s*{([^}]*)}/g;
  const usecaseRegex = /usecase\s+"([^"]+)"/g;
  let usecaseIdCounter = 1;
  let baseX = isLeftToRight ? 200 : 0;

  for (const rectangleMatch of umlString.matchAll(rectangleRegex)) {
    const [, rectangleName, rectangleContent] = rectangleMatch;

    // Process use cases within this rectangle
    for (const usecaseMatch of rectangleContent.matchAll(usecaseRegex)) {
      const [, name] = usecaseMatch;

      // Skip if this use case has already been processed
      if (processedUsecases.has(name)) continue;

      const id = `usecase_${usecaseIdCounter++}`;
      nodeMap.set(name, id);
      processedUsecases.add(name);

      // If this use case is included by another, position it to the right
      const x = includeRelations.has(name) ? baseX + 300 : baseX;

      nodes.push({
        id,
        position: { x, y: currentY },
        type: "shape",
        data: { type: "usecase", label: name },
      });

      // Only increment Y for non-included use cases
      if (!includeRelations.has(name)) {
        currentY += 120;
      }
    }
  }

  // Extract standalone use cases (not in rectangles)
  const standaloneUsecaseRegex = /usecase\s+"([^"]+)"/g;
  for (const match of umlString.matchAll(standaloneUsecaseRegex)) {
    const [, name] = match;

    // Skip if this use case has already been processed
    if (processedUsecases.has(name)) continue;

    const id = `usecase_${usecaseIdCounter++}`;
    nodeMap.set(name, id);
    processedUsecases.add(name);

    // If this use case is included by another, position it to the right
    const x = includeRelations.has(name) ? baseX + 300 : baseX;

    nodes.push({
      id,
      position: { x, y: currentY },
      type: "shape",
      data: { type: "usecase", label: name },
    });

    // Only increment Y for non-included use cases
    if (!includeRelations.has(name)) {
      currentY += 120;
    }
  }

  // Extract normal relationships - match format: "Source" --> "Target"
  const normalRelationRegex = /"([^"]+)"\s+-->\s+"([^"]+)"/g;

  for (const match of umlString.matchAll(normalRelationRegex)) {
    const [, source, target] = match;
    const sourceId = nodeMap.get(source);
    const targetId = nodeMap.get(target);

    if (sourceId && targetId) {
      edges.push({
        id: `e${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: "custom",
        data: { type: "association" as EdgeType },
        sourceHandle: isLeftToRight ? "right" : "bottom",
        targetHandle: isLeftToRight ? "left" : "top",
      });
    }
  }

  // Extract include relationships - match format: "Source" .> "Target" : include
  const includeRelationRegex = /"([^"]+)"\s+\.>\s+"([^"]+)"\s*:\s*include/g;

  for (const match of umlString.matchAll(includeRelationRegex)) {
    const [, source, target] = match;
    const sourceId = nodeMap.get(source);
    const targetId = nodeMap.get(target);

    if (sourceId && targetId) {
      edges.push({
        id: `e${sourceId}-${targetId}-include`,
        source: sourceId,
        target: targetId,
        type: "custom",
        data: { type: "include" as EdgeType },
        sourceHandle: "right",
        targetHandle: "left",
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

  console.log("Parsed nodes:", nodes);
  console.log("Parsed edges:", edges);
  return { nodes, edges };
}

// Using the parser to generate ReactFlow compatible structure
const { nodes: initialNodes, edges: initialEdges } = parsePlantUML(plantUML);

export { initialNodes, initialEdges, parsePlantUML };
