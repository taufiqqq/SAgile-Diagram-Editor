import { ParsedDiagram } from '../types';
import { parseNodes } from '../utils/nodeParser';
import { parseEdges } from '../utils/edgeParser';

export function parsePlantUML(umlString: string): ParsedDiagram {
  const directionMatch = umlString.match(/left to right direction/);
  const isLeftToRight = !!directionMatch;

  const { nodes, nodeMap } = parseNodes(umlString);
  const edges = parseEdges(umlString, nodes, nodeMap);

  return { nodes, edges };
} 