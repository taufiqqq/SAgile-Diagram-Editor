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
  // Parse nodes and get node map
  const { nodes, nodeMap } = parseNodes(umlString);

  // Parse edges
  const edges = parseEdges(umlString, nodes, nodeMap);

  return { nodes, edges };
}

// Using the parser to generate ReactFlow compatible structure
const { nodes: initialNodes, edges: initialEdges } = parsePlantUML(plantUML);

export { initialNodes, initialEdges, parsePlantUML };
