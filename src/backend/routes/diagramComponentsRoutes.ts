import * as express from 'express';
import { DiagramComponentController } from '../controller/DiagramComponentController';

const router = express.Router();

// Get or create a diagram component
router.post('/get-or-create', DiagramComponentController.getOrCreate);

// Get a component by node_id and diagram_id
router.get('/by-node-and-diagram', DiagramComponentController.getByNodeAndDiagram);

// Get a diagram component by ID
router.get('/:id', DiagramComponentController.getById);

// Update a diagram component
router.patch('/:id', DiagramComponentController.update);

// Delete a diagram component
router.delete('/:id', DiagramComponentController.delete);

export default router; 