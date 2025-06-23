import express from 'express';
import { DiagramController } from '../controller/DiagramController';

const router = express.Router();

// Debug: Log when routes are registered
console.log('Registering diagram routes...');

// Process PlantUML and save diagram data
router.post('/process-plantuml', DiagramController.processPlantUML);
console.log('Registered POST /process-plantuml route');

// Save diagram data
router.post('/save', DiagramController.saveDiagram);

// Get diagram data by project ID
router.get('/:projectId', DiagramController.getDiagram);
console.log('Registered GET /:projectId route');

export default router; 