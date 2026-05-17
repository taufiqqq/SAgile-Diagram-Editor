import { DiagramUseCaseSpecification } from '../../shared/models/DiagramUseCaseSpecification';

export class DiagramUseCaseSpecificationService {
  static API_BASE = '/api/diagram-usecase-specifications';

  static async createSpecification(data: Omit<DiagramUseCaseSpecification, 'id' | 'created_at' | 'updated_at'>): Promise<DiagramUseCaseSpecification> {
    const response = await fetch(`${this.API_BASE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create specification');
    }

    const result = await response.json();
    return result.data;
  }

  static async getSpecificationById(id: string): Promise<DiagramUseCaseSpecification> {
    const response = await fetch(`${this.API_BASE}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to get specification');
    }

    const result = await response.json();
    return result.data;
  }

  static async getSpecificationsByUseCaseId(usecaseId: string): Promise<DiagramUseCaseSpecification[]> {
    const response = await fetch(`${this.API_BASE}/usecase/${usecaseId}`);

    if (!response.ok) {
      throw new Error('Failed to get specifications');
    }

    const result = await response.json();
    return result.data;
  }

  static async updateSpecification(id: string, data: Partial<Omit<DiagramUseCaseSpecification, 'id' | 'created_at' | 'updated_at'>>): Promise<DiagramUseCaseSpecification> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update specification');
    }

    const result = await response.json();
    return result.data;
  }

  static async deleteSpecification(id: string): Promise<void> {
    const response = await fetch(`${this.API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete specification');
    }
  }
} 