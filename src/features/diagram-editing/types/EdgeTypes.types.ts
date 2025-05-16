import { Edge } from '@xyflow/react';
import CustomEdge from '../components/CustomEdge';
import GeneralizationEdge from '../components/GeneralizationEdge';

export type EdgeType = 'association' | 'include' | 'exclude' | 'generalization';

export interface EdgeData {
  type: EdgeType;
  [key: string]: unknown;
}

export type CustomEdgeType = Edge<EdgeData>;

export const edgeTypes = {
  default: CustomEdge,
  straight: CustomEdge,
  custom: CustomEdge,
  generalization: GeneralizationEdge
};

export type EdgeTypeName = keyof typeof edgeTypes; 