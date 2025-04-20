import { parseEdges } from "../../utils/edgeParser";
import { parseNodes } from "../../utils/nodeParser";
import { ParsedDiagram } from "../../types";

export const parsePlantUML = async (plantUML: string): Promise<ParsedDiagram & { message: string }> => {
  try {
    // Extract direction
    const directionMatch = plantUML.match(/left to right direction/);
    const isLeftToRight = !!directionMatch;

    // Parse nodes and get node map
    const { nodes, nodeMap } = parseNodes(plantUML, isLeftToRight);

    // Parse edges
    const edges = parseEdges(plantUML, nodes, nodeMap, isLeftToRight);
    
    return {
      nodes,
      edges,
      message: 'Successfully parsed PlantUML'
    };
  } catch (error) {
    console.error('Error in parsePlantUML:', error);
    throw new Error('Failed to parse PlantUML diagram');
  }
}; 