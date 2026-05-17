import { Node, Connection } from '@xyflow/react';
import { SequenceElementType } from '../../../../shared/models/SequenceDiagramElement';
import { SequenceNodeData } from '../../types/SequenceElementTypes';

/**
 * Connection validation rules for MVC three-tiered architecture:
 *
 * Presentation Layer (Boundary):
 * - Can receive from: Actor, Control
 * - Can send to: Actor, Control
 *
 * Business Layer (Control):
 * - Can receive from: Actor, Boundary, Entity
 * - Can send to: Boundary, Entity
 *
 * Data Layer (Entity):
 * - Can receive from: Control
 * - Can send to: Control
 *
 * Actor (External):
 * - Can receive from: Boundary
 * - Can send to: Boundary, Control
 */

interface ConnectionRule {
  allowedTargets: SequenceElementType[];
  description: string;
}

const CONNECTION_RULES: Record<SequenceElementType, ConnectionRule> = {
  actor: {
    allowedTargets: ['boundary', 'control'],
    description: 'Actors can send messages to Boundary (Views) or Control (Controllers)'
  },
  boundary: {
    allowedTargets: ['actor', 'control'],
    description: 'Boundaries (Views) can send messages to Actors or Control (Controllers)'
  },
  control: {
    allowedTargets: ['boundary', 'entity'],
    description: 'Control (Controllers) can send messages to Boundaries (Views) or Entities (Models)'
  },
  entity: {
    allowedTargets: ['control'],
    description: 'Entities (Models) can only send messages to Control (Controllers)'
  }
};

/**
 * Validates if a connection between two nodes is allowed based on MVC architecture rules
 * @param connection The proposed connection
 * @param nodes All nodes in the diagram
 * @returns true if connection is valid, false otherwise
 */
export const isValidSequenceConnection = (
  connection: Connection,
  nodes: Node<SequenceNodeData>[]
): boolean => {
  const { source, target } = connection;

  if (!source || !target) {
    return false;
  }

  // Prevent self-connections
  if (source === target) {
    return false;
  }

  // Find source and target nodes
  const sourceNode = nodes.find(node => node.id === source);
  const targetNode = nodes.find(node => node.id === target);

  if (!sourceNode || !targetNode) {
    return false;
  }

  // Get element types from node data
  const sourceType = sourceNode.data.elementType;
  const targetType = targetNode.data.elementType;

  if (!sourceType || !targetType) {
    return false;
  }

  // Check if connection is allowed based on rules
  const rule = CONNECTION_RULES[sourceType];
  return rule.allowedTargets.includes(targetType);
};

/**
 * Gets the validation error message for an invalid connection
 * @param sourceType The source element type
 * @param targetType The target element type
 * @returns Error message explaining why the connection is invalid
 */
export const getConnectionValidationError = (
  sourceType: SequenceElementType,
  targetType: SequenceElementType
): string => {
  const rule = CONNECTION_RULES[sourceType];

  if (rule.allowedTargets.includes(targetType)) {
    return '';
  }

  const allowedTargetsStr = rule.allowedTargets
    .map(type => {
      switch (type) {
        case 'actor': return 'Actor';
        case 'boundary': return 'Boundary (View)';
        case 'control': return 'Control (Controller)';
        case 'entity': return 'Entity (Model)';
      }
    })
    .join(' or ');

  const sourceLabel = getElementTypeLabel(sourceType);
  const targetLabel = getElementTypeLabel(targetType);

  return `Invalid connection: ${sourceLabel} cannot send messages to ${targetLabel}. ${rule.description}`;
};

/**
 * Gets a human-readable label for an element type
 */
export const getElementTypeLabel = (type: SequenceElementType): string => {
  switch (type) {
    case 'actor':
      return 'Actor';
    case 'boundary':
      return 'Boundary (View - Presentation Layer)';
    case 'control':
      return 'Control (Controller - Business Layer)';
    case 'entity':
      return 'Entity (Model - Data Layer)';
  }
};

/**
 * Gets all valid target types for a given source type
 */
export const getValidTargetTypes = (sourceType: SequenceElementType): SequenceElementType[] => {
  return CONNECTION_RULES[sourceType].allowedTargets;
};

/**
 * Checks if a specific connection type is valid
 * @param sourceType Source element type
 * @param targetType Target element type
 * @returns true if connection is valid
 */
export const isValidConnectionType = (
  sourceType: SequenceElementType,
  targetType: SequenceElementType
): boolean => {
  const rule = CONNECTION_RULES[sourceType];
  return rule.allowedTargets.includes(targetType);
};

/**
 * Gets a detailed description of connection rules for a given element type
 */
export const getConnectionRulesDescription = (type: SequenceElementType): string => {
  const rule = CONNECTION_RULES[type];
  const canSendTo = rule.allowedTargets
    .map(t => getElementTypeLabel(t))
    .join(', ');

  // Find what can send to this type
  const canReceiveFrom = (Object.keys(CONNECTION_RULES) as SequenceElementType[])
    .filter(sourceType => CONNECTION_RULES[sourceType].allowedTargets.includes(type))
    .map(t => getElementTypeLabel(t))
    .join(', ');

  return `${getElementTypeLabel(type)}:\n` +
         `Can send to: ${canSendTo || 'None'}\n` +
         `Can receive from: ${canReceiveFrom || 'None'}`;
};
