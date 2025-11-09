import { Node } from '@xyflow/react';
import UseCaseShapeNode from '../components/UseCaseShapeNode';
import PackageNode from '../components/PackageNode';

export type DiagramElementType = string;

// Define the data structure for diagram elements
export interface DiagramElementData {
  type: DiagramElementType;
  label: string;
  color?: string;
  [key: string]: unknown;
}

export type DiagramElementNode = Node<DiagramElementData>;

// Type of diagram element, which are use case shapes and packages
export const diagramElementTypes = {
  usecaseshape: UseCaseShapeNode,
  package: PackageNode
};

export type DiagramElement = keyof typeof diagramElementTypes;