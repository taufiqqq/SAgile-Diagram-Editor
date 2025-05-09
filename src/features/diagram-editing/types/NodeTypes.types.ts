import { Node } from '@xyflow/react';
import ShapeNode from '../components/ShapeNode';
import PackageNode from '../components/PackageNode';

// this is to differentiate specific type of node, and what pop up should be shown
export type ShapeType = string;

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