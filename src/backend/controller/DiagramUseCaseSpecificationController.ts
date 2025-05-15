import { Request, Response } from 'express';
import { DiagramUseCaseSpecificationModel } from '../../shared/models/DiagramUseCaseSpecification';

export class DiagramUseCaseSpecificationController {
  static async create(req: Request, res: Response) {
    try {
      const specification = await DiagramUseCaseSpecificationModel.create(req.body);
      res.json({ success: true, data: specification });
    } catch (error) {
      console.error('Error creating specification:', error);
      res.status(500).json({ success: false, error: 'Failed to create specification' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const specification = await DiagramUseCaseSpecificationModel.findById(req.params.id);
      if (!specification) {
        return res.status(404).json({ success: false, error: 'Specification not found' });
      }
      res.json({ success: true, data: specification });
    } catch (error) {
      console.error('Error getting specification:', error);
      res.status(500).json({ success: false, error: 'Failed to get specification' });
    }
  }

  static async getByUseCaseId(req: Request, res: Response) {
    try {
      const specifications = await DiagramUseCaseSpecificationModel.findByUseCaseId(req.params.usecaseId);
      console.log("specifications", specifications);
      res.json({ success: true, data: specifications });
    } catch (error) {
      console.error('Error getting specifications:', error);
      res.status(500).json({ success: false, error: 'Failed to get specifications' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const specification = await DiagramUseCaseSpecificationModel.update(req.params.id, req.body);
      if (!specification) {
        return res.status(404).json({ success: false, error: 'Specification not found' });
      }
      res.json({ success: true, data: specification });
    } catch (error) {
      console.error('Error updating specification:', error);
      res.status(500).json({ success: false, error: 'Failed to update specification' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await DiagramUseCaseSpecificationModel.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Specification not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting specification:', error);
      res.status(500).json({ success: false, error: 'Failed to delete specification' });
    }
  }
} 