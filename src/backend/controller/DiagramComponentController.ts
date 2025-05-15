import { Request, Response } from 'express';
import { DiagramComponentModel, DiagramComponentRow } from '../../shared/models/DiagramComponent';

interface CreateComponentBody {
  node_id: string;
  diagram_id: string;
  name: string;
  description?: string;
  version?: string;
  deletable?: boolean;
  preconditions?: string[];
  postconditions?: string[];
  created_by?: string;
  last_updated_by?: string;
}

interface UpdateComponentBody {
  name?: string;
  description?: string;
  version?: string;
  deletable?: boolean;
  preconditions?: string[];
  postconditions?: string[];
  last_updated_by?: string;
}

export class DiagramComponentController {
  static async getOrCreate(req: Request<{}, {}, CreateComponentBody>, res: Response): Promise<void> {
    try {
      const { node_id, diagram_id, name, description, version, deletable, preconditions, postconditions, created_by, last_updated_by } = req.body;
      
      console.log('getOrCreate - Request body:', {
        node_id,
        diagram_id,
        name,
        description,
        version,
        deletable,
        preconditions,
        postconditions,
        created_by,
        last_updated_by
      });

      // Check if component already exists
      const existingComponent = await DiagramComponentModel.findByNodeAndDiagram(node_id, diagram_id);
      console.log('getOrCreate - Existing component:', existingComponent);

      if (existingComponent) {
        // Update existing component
        const updateData: Partial<Omit<DiagramComponentRow, 'id' | 'created_at' | 'updated_at'>> = {
          name,
          description: description || null,
          version: version || null,
          deletable: deletable ?? true,
          preconditions: preconditions || [],
          postconditions: postconditions || [],
          last_updated_by: last_updated_by || 'system'
        };
        console.log('getOrCreate - Update data:', updateData);
        const updatedComponent = await DiagramComponentModel.update(existingComponent.id, updateData);
        console.log('getOrCreate - Updated component:', updatedComponent);
        res.json({ success: true, data: updatedComponent });
        return;
      }

      // Create new component
      const newComponent = await DiagramComponentModel.create({
        node_id,
        diagram_id,
        name,
        description: description || null,
        version: version || null,
        deletable: deletable ?? true,
        preconditions: preconditions || [],
        postconditions: postconditions || [],
        created_by: created_by || 'system',
        last_updated_by: last_updated_by || 'system'
      });
      console.log('getOrCreate - New component:', newComponent);

      res.json({ success: true, data: newComponent });
    } catch (error) {
      console.error('Error in get-or-create diagram component:', error);
      res.status(500).json({ success: false, error: 'Failed to get or create diagram component' });
    }
  }

  static async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const component = await DiagramComponentModel.findById(req.params.id);
      if (!component) {
        res.status(404).json({ success: false, error: 'Diagram component not found' });
        return;
      }
      res.json({ success: true, data: component });
    } catch (error) {
      console.error('Error getting diagram component:', error);
      res.status(500).json({ success: false, error: 'Failed to get diagram component' });
    }
  }

  static async update(req: Request<{ id: string }, {}, UpdateComponentBody>, res: Response): Promise<void> {
    try {
      const { name, description, version, deletable, preconditions, postconditions, last_updated_by } = req.body;
      const updateData: Partial<Omit<DiagramComponentRow, 'id' | 'created_at' | 'updated_at'>> = {
        name,
        description: description || null,
        version: version || null,
        deletable,
        preconditions,
        postconditions,
        last_updated_by: last_updated_by || 'system'
      };

      const updatedComponent = await DiagramComponentModel.update(req.params.id, updateData);
      if (!updatedComponent) {
        res.status(404).json({ success: false, error: 'Diagram component not found' });
        return;
      }
      res.json({ success: true, data: updatedComponent });
    } catch (error) {
      console.error('Error updating diagram component:', error);
      res.status(500).json({ success: false, error: 'Failed to update diagram component' });
    }
  }

  static async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const success = await DiagramComponentModel.delete(req.params.id);
      if (!success) {
        res.status(404).json({ success: false, error: 'Diagram component not found' });
        return;
      }
      res.json({ success: true, message: 'Diagram component deleted successfully' });
    } catch (error) {
      console.error('Error deleting diagram component:', error);
      res.status(500).json({ success: false, error: 'Failed to delete diagram component' });
    }
  }

  static async getByNodeAndDiagram(req: Request, res: Response): Promise<void> {
    try {
      const { node_id, diagram_id } = req.query;
      
      if (!node_id || !diagram_id) {
        res.status(400).json({ success: false, error: 'node_id and diagram_id are required' });
        return;
      }

      const component = await DiagramComponentModel.findByNodeAndDiagram(node_id as string, diagram_id as string);
      
      if (!component) {
        res.status(404).json({ success: false, error: 'Component not found' });
        return;
      }

      res.json({ success: true, data: component });
    } catch (error) {
      console.error('Error getting diagram component:', error);
      res.status(500).json({ success: false, error: 'Failed to get diagram component' });
    }
  }
} 