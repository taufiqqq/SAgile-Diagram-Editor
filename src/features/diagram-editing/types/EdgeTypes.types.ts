import { Edge } from '@xyflow/react';
import GeneralizationEdge from '../utils/edges-react-flow/GeneralizationEdge';
import AssociationEdge from '../utils/edges-react-flow/AssociationEdge';
import IncludeEdge from '../utils/edges-react-flow/IncludeEdge';
import ExcludeEdge from '../utils/edges-react-flow/ExcludeEdge';
import CompositionEdge from '../utils/edges-react-flow/CompositionEdge';
import AggregationEdge from '../utils/edges-react-flow/AggregationEdge';

export type EdgeType = string;

export interface EdgeData {
  type: EdgeType;
  [key: string]: unknown;
}

export const edgeTypes = {
  default: AssociationEdge,
  straight: AssociationEdge,
  composition: CompositionEdge,
  association: AssociationEdge,
  aggregation: AggregationEdge,
  include: IncludeEdge,
  exclude: ExcludeEdge,
  generalization: GeneralizationEdge
};

export type EdgeTypeName = keyof typeof edgeTypes; 