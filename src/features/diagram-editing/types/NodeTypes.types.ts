import { Node } from '@xyflow/react';
import ShapeNode from '../components/ShapeNode';

export type ShapeType = 'actor' | 'usecase';

export interface ShapeNodeData {
  type: ShapeType;
  label: string;
  color?: string;
  [key: string]: unknown;
}

export type ShapeNodeType = Node<ShapeNodeData>;

export const nodeTypes = {
  shape: ShapeNode
};

export type NodeType = keyof typeof nodeTypes;