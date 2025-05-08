import { Node, Edge, Connection } from '@xyflow/react';

export type { Node, Edge, Connection };

// Define a type for the diagram data returned from the API
export interface DiagramData {
  nodes: Node[];
  edges: Edge[];
  original_plantuml: string;
}

// Define a type for the node state
export type NodeState = Node[];

// Define a type for the edge state
export type EdgeState = Edge[]; 