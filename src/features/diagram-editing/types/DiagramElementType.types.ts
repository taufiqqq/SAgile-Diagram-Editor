import { Node } from '@xyflow/react';
import UseCaseShapeNode from '../components/ShapeNode';
import PackageNode from '../components/PackageNode';

export type DiagramElementType = string;

export interface DiagramElementdata {
  type: DiagramElementType;
  label: string;
  color?: string;
  [key: string]: unknown;
}

export type DiagramElementNode = Node<DiagramElementdata>;

export const diagramElementTypes = {
  usecaseshape: UseCaseShapeNode,
  package: PackageNode
};

export type DiagramElement = keyof typeof diagramElementTypes;