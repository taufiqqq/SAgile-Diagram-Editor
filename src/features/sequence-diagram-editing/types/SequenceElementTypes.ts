import { Node, Edge } from '@xyflow/react';

// Sequence Element Types (following MVC pattern from spec)
export type SequenceElementType = 'actor' | 'boundary' | 'control' | 'entity';
export type SequenceMessageType = 'synchronous' | 'asynchronous' | 'return' | 'create' | 'destroy';

// Node data structure for sequence diagram elements (actors, boundary, control, entity)
export interface SequenceNodeData extends Record<string, unknown> {
  label: string;
  stereotype: string; // e.g., "<<actor>>", "<<boundary>>", "<<control>>", "<<entity>>"
  hasLifeline: boolean;
  lifelineLength?: number;
  elementType: SequenceElementType;
}

// Edge data structure for sequence diagram connections
export interface SequenceEdgeData extends Record<string, unknown> {
  message: string;
  parameters?: string;
  messageType: SequenceMessageType;
  sequenceNumber?: number;
}

// ReactFlow Node type for sequence diagram elements
export type SequenceNode = Node<SequenceNodeData>;

// ReactFlow Edge type for sequence diagram connections
export type SequenceEdge = Edge<SequenceEdgeData>;

// Connection validation result
export interface ConnectionValidationResult {
  valid: boolean;
  reason?: string;
}

// Sequence diagram state
export interface SequenceDiagramState {
  nodes: SequenceNode[];
  edges: SequenceEdge[];
  selectedElements: string[];
}

// Element creation data
export interface CreateSequenceElementData {
  type: SequenceElementType;
  label: string;
  position: { x: number; y: number };
  hasLifeline?: boolean;
}

// Message creation data
export interface CreateSequenceMessageData {
  sourceId: string;
  targetId: string;
  message: string;
  parameters?: string;
  messageType?: SequenceMessageType;
}
