import { Node, Edge, MarkerType } from '@xyflow/react';

export interface ShapeNode extends Node {
  type: 'shape';
  data: {
    type: 'actor' | 'usecase' | 'package';
    label: string;
    width?: number;
    height?: number;
  };
  style?: {
    zIndex?: number;
  };
  height?: number;
}

export interface ParsedEdge extends Edge {
  type: 'custom';
  data: {
    type: 'association' | 'include';
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