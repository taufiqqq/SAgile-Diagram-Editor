import { Node } from '@xyflow/react';
import ShapeNode from '../components/ShapeNode';
import PackageNode from '../components/PackageNode';

export type ShapeType = 'actor' | 'usecase' | 'package';

export interface ShapeNodeData {
  type: ShapeType;
  label: string;
  color?: string;
  [key: string]: unknown;
}

export type ShapeNode = Node<ShapeNodeData>;

export const nodeTypes = {
  shape: ShapeNode,
  package: PackageNode
};

export type NodeType = keyof typeof nodeTypes;