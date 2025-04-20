import { ShapeNode as BaseShapeNode } from "../../diagram-editing/types/NodeTypes.types";
import { EdgeType } from "../../diagram-editing/types/EdgeTypes.types";

export type ShapeNode = BaseShapeNode;

export interface HandlePosition {
  x: number;
  y: number;
}

export interface HandlePositions {
  left: HandlePosition;
  right: HandlePosition;
  top: HandlePosition;
  bottom: HandlePosition;
}

export interface ClosestHandles {
  sourceHandle: string;
  targetHandle: string;
}

export interface ParsedDiagram {
  nodes: ShapeNode[];
  edges: any[];
}

export interface NodeMap {
  [key: string]: string;
}

export interface ParsedEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: { type: EdgeType };
  sourceHandle: string;
  targetHandle: string;
  style?: { strokeDasharray: string };
  markerEnd?: any;
  label?: string;
  labelStyle?: any;
} 