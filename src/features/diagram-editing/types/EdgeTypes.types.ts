import { Edge } from '@xyflow/react';
import CustomEdge from '../components/CustomEdge';

export type EdgeType = 'association' | 'include' | 'exclude';

export interface EdgeData {
  type: EdgeType;
  [key: string]: unknown;
}

export type CustomEdgeType = Edge<EdgeData>;

export const edgeTypes = {
  default: CustomEdge,
  straight: CustomEdge,
  custom: CustomEdge
};

export type EdgeTypeName = keyof typeof edgeTypes; 