import { DiagramComponent } from '../models/DiagramComponent';

export interface ComponentUpdateData {
  name?: string;
  description?: string | null;
  version?: string | null;
  deletable?: boolean;
}

export class DiagramComponentService {
  static API_BASE = '/api/diagram-components';

  /**
   * Get or create a diagram component for a node
   * @param nodeId The node ID
   * @param diagramId The diagram ID
   * @param data The component data to create or update
   * @returns The diagram component
   */
  static async getOrCreateComponent(
    nodeId: string,
    diagramId: string,
    data: Partial<DiagramComponent>
  ): Promise<DiagramComponent> {
    const response = await fetch(`${this.API_BASE}/get-or-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node_id: nodeId,
        diagram_id: diagramId,
        ...data
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get or create diagram component');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get a diagram component by node and diagram ID
   * @param nodeId The node ID
   * @param diagramId The diagram ID
   * @returns The component or null if not found
   */
  static async getComponent(id: string): Promise<DiagramComponent | null> {
    const response = await fetch(`${this.API_BASE}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to get diagram component');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Update a diagram component
   * @param id The component ID
   * @param data The component data to update
   * @returns The updated component
   */
  static async updateComponent(
    id: string,
    data: Partial<DiagramComponent>
  ): Promise<DiagramComponent> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update diagram component');
    }

    const result = await response.json();
    return result.data;
  }

  static async deleteComponent(id: string): Promise<void> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete component');
    }
  }
} 