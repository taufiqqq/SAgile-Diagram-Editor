import { Node, Edge, MarkerType } from '@xyflow/react';
import { ShapeNode as BaseShapeNode } from './NodeTypes.types';

export type ShapeNode = BaseShapeNode;

export interface ParsedEdge extends Edge {
  type: string;
  data: {
    type: 'association' | 'include' | 'exclude';
  };
  sourceHandle?: string;
  targetHandle?: string;
  style?: {
    strokeDasharray?: string;
  };
  markerEnd?: {
    type: MarkerType;
    width: number;
    height: number;
    color: string;
  };
  label?: string;
  labelStyle?: {
    fill: string;
    fontFamily: string;
  };
}

export interface NodeMap {
  [key: string]: string;
} 