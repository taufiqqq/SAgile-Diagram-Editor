import { Request, Response } from 'express';
import { DiagramComponentModel, DiagramComponentRow } from '../../shared/models/DiagramComponent';

interface CreateComponentBody {
  node_id: string;
  diagram_id: string;
  name: string;
  description?: string;
  version?: string;
  deletable?: boolean;
}

interface UpdateComponentBody {
  name?: string;
  description?: string;
  version?: string;
  deletable?: boolean;
}

export class DiagramComponentController {
  static async getOrCreate(req: Request<{}, {}, CreateComponentBody>, res: Response): Promise<void> {
    try {
      const { node_id, diagram_id, name, description, version, deletable } = req.body;

      // Check if component already exists
      const existingComponent = await DiagramComponentModel.findByNodeAndDiagram(node_id, diagram_id);

      if (existingComponent) {
        // Update existing component
        const updateData: Partial<Omit<DiagramComponentRow, 'id' | 'created_at' | 'updated_at'>> = {
          name,
          description: description || null,
          version: version || null,
          deletable: deletable ?? true
        };
        const updatedComponent = await DiagramComponentModel.update(existingComponent.id, updateData);
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
        deletable: deletable ?? true
      });

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
      const { name, description, version, deletable } = req.body;
      const updateData: Partial<Omit<DiagramComponentRow, 'id' | 'created_at' | 'updated_at'>> = {
        name,
        description: description || null,
        version: version || null,
        deletable
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
} 