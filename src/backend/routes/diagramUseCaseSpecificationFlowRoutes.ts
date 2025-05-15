import express from 'express';
import { DiagramUseCaseSpecificationController } from '../controller/DiagramUseCaseSpecificationController';

const router = express.Router();

// Create a new specification flow
router.post('/', DiagramUseCaseSpecificationController.create.bind(DiagramUseCaseSpecificationController));

// Get all specification flows for a use case
router.get('/usecase/:usecaseId', DiagramUseCaseSpecificationController.getByUseCaseId.bind(DiagramUseCaseSpecificationController));

// Update a specification flow
router.patch('/:id', DiagramUseCaseSpecificationController.update.bind(DiagramUseCaseSpecificationController));

// Delete a specification flow
router.delete('/:id', DiagramUseCaseSpecificationController.delete.bind(DiagramUseCaseSpecificationController));

export default router; 