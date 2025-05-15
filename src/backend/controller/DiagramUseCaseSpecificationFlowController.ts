import { Request, Response } from 'express';
import { DiagramUseCaseSpecificationFlowModel } from '../../shared/models/DiagramUseCaseSpecificationFlow';

export class DiagramUseCaseSpecificationFlowController {
  static async createSpecification(req: Request, res: Response) {
    try {
      const specification = await DiagramUseCaseSpecificationFlowModel.create(req.body);
      res.status(201).json(specification);
    } catch (error) {
      console.error('Error creating specification:', error);
      res.status(500).json({ error: 'Failed to create specification' });
    }
  }

  static async getSpecificationsByUseCase(req: Request, res: Response) {
    try {
      const { usecaseId } = req.params;
      const specifications = await DiagramUseCaseSpecificationFlowModel.findByUseCaseId(usecaseId);
      res.json(specifications);
    } catch (error) {
      console.error('Error getting specifications:', error);
      res.status(500).json({ error: 'Failed to get specifications' });
    }
  }

  static async updateSpecification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const specification = await DiagramUseCaseSpecificationFlowModel.update(id, req.body);
      if (!specification) {
        return res.status(404).json({ error: 'Specification not found' });
      }
      res.json(specification);
    } catch (error) {
      console.error('Error updating specification:', error);
      res.status(500).json({ error: 'Failed to update specification' });
    }
  }

  static async deleteSpecification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await DiagramUseCaseSpecificationFlowModel.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting specification:', error);
      res.status(500).json({ error: 'Failed to delete specification' });
    }
  }
} 