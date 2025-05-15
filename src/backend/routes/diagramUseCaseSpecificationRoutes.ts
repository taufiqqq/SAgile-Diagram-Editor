import express, { RequestHandler } from 'express';
import { DiagramUseCaseSpecificationController } from '../controller/DiagramUseCaseSpecificationController';

const router = express.Router();

// Create a new specification
router.post('/', DiagramUseCaseSpecificationController.create as RequestHandler);

// Get a specification by ID
router.get('/:id', DiagramUseCaseSpecificationController.getById as RequestHandler);

// Get all specifications for a use case
router.get('/usecase/:usecaseId', DiagramUseCaseSpecificationController.getByUseCaseId as RequestHandler);

// Update a specification
router.patch('/:id', DiagramUseCaseSpecificationController.update as RequestHandler);

// Delete a specification
router.delete('/:id', DiagramUseCaseSpecificationController.delete as RequestHandler);

export default router; 