// GenerateNodes.ts
import { ShapeNode } from "../../diagram-editing/types/NodeTypes.types";
import { MarkerType } from "@xyflow/react";
import { EdgeType } from "../../diagram-editing/types/EdgeTypes.types";
import { parseNodes } from './nodeParser';
import { parseEdges } from './edgeParser';

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

// Function to calculate closest handles between two nodes
function calculateClosestHandles(sourceNode: ShapeNode, targetNode: ShapeNode) {
  const sourcePos = sourceNode.position;
  const targetPos = targetNode.position;
  
  // Define handle positions relative to node center
  const sourceHandles = {
    left: { x: sourcePos.x - 10, y: sourcePos.y },
    right: { x: sourcePos.x + 10, y: sourcePos.y },
    top: { x: sourcePos.x, y: sourcePos.y - 10 },
    bottom: { x: sourcePos.x, y: sourcePos.y + 10 }
  };
  
  const targetHandles = {
    left: { x: targetPos.x - 10, y: targetPos.y },
    right: { x: targetPos.x + 10, y: targetPos.y },
    top: { x: targetPos.x, y: targetPos.y - 10 },
    bottom: { x: targetPos.x, y: targetPos.y + 10 }
  };
  
  let minDistance = Infinity;
  let bestSourceHandle: string = 'right';
  let bestTargetHandle: string = 'left';
  
  // Calculate distances between all handle combinations
  for (const [sourceHandle, sourcePoint] of Object.entries(sourceHandles)) {
    for (const [targetHandle, targetPoint] of Object.entries(targetHandles)) {
      const distance = Math.sqrt(
        Math.pow(sourcePoint.x - targetPoint.x, 2) + 
        Math.pow(sourcePoint.y - targetPoint.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        bestSourceHandle = sourceHandle;
        bestTargetHandle = targetHandle;
      }
    }
  }
  
  return { sourceHandle: bestSourceHandle, targetHandle: bestTargetHandle };
}

// Function to parse PlantUML string
function parsePlantUML(umlString: string) {
  // Extract direction
  const directionMatch = umlString.match(/left to right direction/);
  const isLeftToRight = !!directionMatch;

  // Parse nodes and get node map
  const { nodes, nodeMap } = parseNodes(umlString, isLeftToRight);

  // Parse edges
  const edges = parseEdges(umlString, nodes, nodeMap, isLeftToRight);

  console.log("Parsed nodes:", nodes);
  console.log("Parsed edges:", edges);
  return { nodes, edges };
}

// Using the parser to generate ReactFlow compatible structure
const { nodes: initialNodes, edges: initialEdges } = parsePlantUML(plantUML);

export { initialNodes, initialEdges, parsePlantUML };
