import { Edge } from '@xyflow/react';
import GeneralizationEdge from '../utils/edges-react-flow/GeneralizationEdge';
import AssociationEdge from '../utils/edges-react-flow/AssociationEdge';
import IncludeEdge from '../utils/edges-react-flow/IncludeEdge';
import ExcludeEdge from '../utils/edges-react-flow/ExcludeEdge';

export type EdgeType = 'association' | 'include' | 'exclude' | 'generalization';

export interface EdgeData {
  type: EdgeType;
  [key: string]: unknown;
}

export const edgeTypes = {
  default: AssociationEdge,
  straight: AssociationEdge,
  // custom: AssociationEdge,
  association: AssociationEdge,
  include: IncludeEdge,
  exclude: ExcludeEdge,
  generalization: GeneralizationEdge
};

export type EdgeTypeName = keyof typeof edgeTypes; 