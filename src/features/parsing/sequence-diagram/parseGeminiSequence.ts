import { Node, Edge } from '@xyflow/react';
import { SequenceNodeData } from '../../sequence-diagram-editing/types/SequenceElementTypes';
import { SequenceElementType } from '../../../shared/models/SequenceDiagramElement';
import { SequenceMessageType } from '../../../shared/models/SequenceDiagramMessage';

interface ParsedActor {
  name: string;
  type: SequenceElementType;
}

interface ParsedMessage {
  source: string;
  target: string;
  message: string;
  type: SequenceMessageType;
}

/**
 * Parses Gemini-generated sequence diagram text into ReactFlow nodes and edges
 *
 * Expected format:
 * Primary Actor: ActorName<<actor>>
 * Secondary Actor: ViewName<<boundary>>, ControllerName<<controller>>, ModelName<<entity>>
 *
 * Main Flow:
 *   Actor -> View: message()
 *   View -> Controller: anotherMessage()
 *   Controller -> Model: saveData()
 */
export function parseGeminiSequenceDiagram(geminiText: string): {
  nodes: Node<SequenceNodeData>[];
  edges: Edge[];
} {
  const lines = geminiText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  const actors = new Map<string, ParsedActor>();
  const messages: ParsedMessage[] = [];

  let inMainFlow = false;
  let inAlternateFlow = false;

  for (const line of lines) {
    // Parse actors
    if (line.startsWith('Primary Actor:') || line.startsWith('Secondary Actor:')) {
      const actorsPart = line.split(':')[1]?.trim();
      if (!actorsPart) continue;

      // Split by comma and parse each actor
      const actorEntries = actorsPart.split(',').map(s => s.trim());

      for (const entry of actorEntries) {
        const match = entry.match(/^(.+?)<<(actor|boundary|controller|control|entity)>>$/i);
        if (match) {
          const name = match[1].trim();
          let type = match[2].toLowerCase() as SequenceElementType;

          // Normalize controller to control
          if (type === 'controller' as any) {
            type = 'control';
          }

          actors.set(name, { name, type });
        }
      }
      continue;
    }

    // Detect flow sections
    if (line.match(/^(Main|Primary)\s+Flow:/i)) {
      inMainFlow = true;
      inAlternateFlow = false;
      continue;
    }

    if (line.match(/^(Alternate|Alternative|Exception)\s+Flow:/i)) {
      inAlternateFlow = true;
      inMainFlow = false;
      continue;
    }

    // Skip conditional statements and end markers
    if (line.match(/^(if|else|end|endif)/i)) {
      continue;
    }

    // Parse messages: Source -> Target: message()
    // Also handle Source->Target: message() (no spaces)
    const messageMatch = line.match(/^(.+?)\s*->\s*(.+?)\s*:\s*(.+)$/);
    if (messageMatch && (inMainFlow || inAlternateFlow)) {
      const source = messageMatch[1].trim();
      const target = messageMatch[2].trim();
      const message = messageMatch[3].trim();

      // Ensure both source and target are known actors
      if (!actors.has(source)) {
        // Try to infer type from name
        const inferredType = inferTypeFromName(source);
        actors.set(source, { name: source, type: inferredType });
      }

      if (!actors.has(target)) {
        const inferredType = inferTypeFromName(target);
        actors.set(target, { name: target, type: inferredType });
      }

      // Determine message type based on context
      let messageType: SequenceMessageType = 'synchronous';

      // Check for return messages (common patterns)
      if (message.toLowerCase().includes('return') ||
          message.toLowerCase().includes('response') ||
          message.toLowerCase().includes('pass') ||
          message.toLowerCase().includes('send')) {
        messageType = 'return';
      }

      // Check for create messages
      if (message.toLowerCase().includes('create')) {
        messageType = 'create';
      }

      messages.push({
        source,
        target,
        message,
        type: messageType
      });
    }
  }

  // Generate nodes
  const nodes: Node<SequenceNodeData>[] = [];
  const actorArray = Array.from(actors.values());

  // Calculate positions - arrange horizontally with spacing
  const horizontalSpacing = 200;
  const startX = 100;
  const startY = 100;

  actorArray.forEach((actor, index) => {
    nodes.push({
      id: actor.name,
      type: 'sequenceElement',
      position: {
        x: startX + (index * horizontalSpacing),
        y: startY
      },
      data: {
        label: actor.name,
        elementType: actor.type,
        stereotype: `<<${actor.type}>>`,
        hasLifeline: true,
        lifelineLength: 400 + (messages.length * 30), // Adjust lifeline based on message count
      }
    });
  });

  // Generate edges
  const edges: Edge[] = messages.map((msg, index) => ({
    id: `msg-${index}`,
    source: msg.source,
    target: msg.target,
    type: 'sequenceMessage', // Use unified sequence message edge component
    label: msg.message,
    data: {
      message_type: msg.type,
      message_text: msg.message,
      parameters: '',
      sequence_number: index + 1,
      yPosition: 200 + (index * 50), // Initial Y position (will be recalculated by layout hook)
    },
    animated: false,
  }));

  return { nodes, edges };
}

/**
 * Infers element type from naming conventions
 */
function inferTypeFromName(name: string): SequenceElementType {
  const lowerName = name.toLowerCase();

  // Check for common naming patterns
  if (lowerName.includes('view') || lowerName.includes('page') || lowerName.includes('ui')) {
    return 'boundary';
  }

  if (lowerName.includes('controller') || lowerName.includes('handler') || lowerName.includes('service')) {
    return 'control';
  }

  if (lowerName.includes('model') || lowerName.includes('repository') || lowerName.includes('data')) {
    return 'entity';
  }

  if (lowerName.includes('user') || lowerName.includes('actor') || lowerName.includes('manager')) {
    return 'actor';
  }

  // Default to control if uncertain
  return 'control';
}

/**
 * Validates the generated nodes and edges against MVC rules
 */
export function validateSequenceDiagram(
  nodes: Node<SequenceNodeData>[],
  edges: Edge[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if we have any nodes
  if (nodes.length === 0) {
    errors.push('No sequence elements found in the diagram');
  }

  // Validate each edge follows MVC rules
  edges.forEach((edge, index) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      errors.push(`Message ${index + 1}: Source or target not found`);
      return;
    }

    // Note: We're not enforcing strict validation here since Gemini might generate
    // diagrams that don't perfectly follow MVC rules. We'll let the user edit them.
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
