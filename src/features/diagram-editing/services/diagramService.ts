import { Node, Edge } from '@xyflow/react';

interface DiagramData {
  nodes: Node[];
  edges: Edge[];
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
    
    if (!response.ok) {
      if (response.status === 404) {
        // Diagram not found
        return null;
      }
      throw new Error(`Failed to fetch diagram: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch diagram');
    }
    
    // @ts-ignore - Ignoring type errors for now
    return {
      nodes: data.data.nodes || [],
      edges: data.data.edges || [],
      original_plantuml: data.data.original_plantuml || ''
    };
  } catch (error) {
    console.error('Error fetching diagram data:', error);
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
    const response = await fetch('/api/diagrams/process', {
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