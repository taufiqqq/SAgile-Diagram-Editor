import { Node, Edge } from '@xyflow/react';
import { SequenceNodeData } from '../../sequence-diagram-editing/types/SequenceElementTypes';
import { parseGeminiSequenceDiagram, validateSequenceDiagram } from './parseGeminiSequence';

/**
 * Saves sequence diagram to the backend and returns the diagram ID
 */
export async function saveSequenceDiagram(
  projectId: string,
  nodes: Node<SequenceNodeData>[],
  edges: Edge[],
  geminiText: string
): Promise<{ success: boolean; diagramId?: string; message?: string }> {
  try {
    const response = await fetch('/api/diagrams/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        diagram_type: 'sequence',
        nodes,
        edges,
        original_plantuml: geminiText, // Store the Gemini text as "original"
        isCreating: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save sequence diagram: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to save sequence diagram');
    }

    return {
      success: true,
      diagramId: data.data?.id || projectId,
    };
  } catch (error) {
    console.error('Error saving sequence diagram:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Converts Gemini text to editable sequence diagram
 * Parses, validates, saves, and returns navigation URL
 */
export async function convertGeminiToEditableSequence(
  projectId: string,
  geminiText: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. Parse Gemini text into nodes and edges
    const { nodes, edges } = parseGeminiSequenceDiagram(geminiText);

    // 2. Validate the diagram
    const validation = validateSequenceDiagram(nodes, edges);

    if (!validation.isValid) {
      console.warn('Diagram validation warnings:', validation.errors);
      // Continue anyway - let user edit to fix issues
    }

    // 3. Save to backend
    const saveResult = await saveSequenceDiagram(
      projectId,
      nodes,
      edges,
      geminiText
    );

    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.message || 'Failed to save diagram'
      };
    }

    // 4. Return the URL to navigate to the sequence editor
    const editorUrl = `/sequence/${projectId}`;

    return {
      success: true,
      url: editorUrl
    };
  } catch (error) {
    console.error('Error converting Gemini to editable sequence:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Opens the sequence diagram editor with parsed data
 * This is a convenience function for direct navigation
 */
export function openSequenceEditor(
  projectId: string,
  nodes: Node<SequenceNodeData>[],
  edges: Edge[]
): string {
  // Encode the diagram data in URL for immediate loading
  const diagramData = {
    nodes,
    edges
  };

  const encodedData = encodeURIComponent(JSON.stringify(diagramData));
  return `/sequence/${projectId}?data=${encodedData}`;
}
