import { parseEdges } from "../../utils/edgeParser";
import { parseNodes } from "../../utils/nodeParser";
import { ParsedDiagram } from "../../types";

export const parsePlantUML = async (plantUML: string): Promise<ParsedDiagram> => {
  try {
    // Parse nodes and get node map
    const { nodes, nodeMap } = parseNodes(plantUML);

    // Parse edges
    const edges = parseEdges(plantUML, nodes, nodeMap);
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error in parsePlantUML:', error);
    throw new Error('Failed to parse PlantUML diagram');
  }
}; 