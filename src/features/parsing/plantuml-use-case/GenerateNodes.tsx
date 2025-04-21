// GenerateNodes.ts
import { parseEdges } from "./utils/edgeParser";
import { parseNodes } from "./utils/nodeParser";
import { ParsedDiagram } from "./types";

// Empty PlantUML input string
const plantUML = `
left to right direction
`;

// Function to parse PlantUML string
function parsePlantUML(umlString: string): ParsedDiagram {
  // Extract direction
  const directionMatch = umlString.match(/left to right direction/);
  const isLeftToRight = !!directionMatch;

  // Parse nodes and get node map
  const { nodes, nodeMap } = parseNodes(umlString, isLeftToRight);

  // Parse edges
  const edges = parseEdges(umlString, nodes, nodeMap, isLeftToRight);

  return { nodes, edges };
}

// Using the parser to generate ReactFlow compatible structure
const { nodes: initialNodes, edges: initialEdges } = parsePlantUML(plantUML);

export { initialNodes, initialEdges, parsePlantUML };
