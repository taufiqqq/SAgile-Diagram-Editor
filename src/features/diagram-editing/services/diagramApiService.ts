import { Node, Edge } from '@xyflow/react';
import { parseNodes } from '../../parsing/plantuml-use-case/utils/nodeParser';
import { parseEdges } from '../../parsing/plantuml-use-case/utils/edgeParser';
import { ShapeNode, ParsedEdge } from '../types';

interface DiagramData {
  nodes: ShapeNode[];
  edges: ParsedEdge[];
  original_plantuml: string;
}

/**
 * Fetches diagram data from the backend based on project and sprint IDs
 * @param projectId The project ID
 * @param sprintId The sprint ID
 * @returns The diagram data
 */
export async function fetchDiagramData(projectId: string, sprintId: string): Promise<DiagramData | null> {
  try {
    const response = await fetch(`/api/diagrams/${projectId}/${sprintId}`);
    console.log('Fetching diagram data:', { projectId, sprintId });
    if (!response.ok) {
      if (response.status === 404) {
        // Diagram not found
        return null;
      }
      throw new Error(`Failed to fetch diagram: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched diagram data:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch diagram');
    }
    
    // Parse the PlantUML string to get nodes and edges
    const { nodes, edges, original_plantuml } = data.data;

    console.log('Parsed nodes and edges:', { nodes, edges });
    
    return {
      nodes,
      edges,
      original_plantuml: data.data.original_plantuml
    };
  } catch (error) {
    console.error('Error fetching diagram data:', error);
    throw error;
  }
}

/**
 * Saves diagram data to the backend
 * @param projectId The project ID
 * @param sprintId The sprint ID
 * @param nodes The nodes to save
 * @param edges The edges to save
 * @returns The response from the server
 */
export async function saveDiagramData(
  projectId: string,
  sprintId: string,
  nodes: ShapeNode[],
  edges: ParsedEdge[],
  isEditing: boolean = false
): Promise<any> {
  try {
    if (nodes.length === 0 && edges.length === 0 && !isEditing) {
      console.warn('Skipping save: Diagram is empty.');
      return;
    }

    console.log('Saving diagram data:', { projectId, sprintId, nodes, edges });

    const response = await fetch('/api/diagrams/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        sprint_id: sprintId,
        nodes,
        edges,
        isCreating: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save diagram: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Save response:', data);

    if (!data.success) {
      throw new Error(data.message || 'Failed to save diagram');
    }
    return data;
  } catch (error) {
    console.error('Error saving diagram data:', error);
    throw error;
  }
}

/**
 * Sends PlantUML data to the backend for processing
 * @param projectId The project ID
 * @param sprintId The sprint ID
 * @param plantuml The PlantUML string
 * @returns The response from the server
 */
export async function processPlantUML(projectId: string, sprintId: string, plantuml: string): Promise<any> {
  try {
    const response = await fetch('/api/diagrams/process-plantuml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project_id: projectId,
        sprint_id: sprintId,
        plantuml
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process PlantUML: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to process PlantUML');
    }
    
    return data;
  } catch (error) {
    console.error('Error processing PlantUML:', error);
    throw error;
  }
} 