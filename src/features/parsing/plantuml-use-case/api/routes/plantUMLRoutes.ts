import { Router, Request, Response } from 'express';
import { parsePlantUML } from '../services/plantUMLService';

const router = Router();

interface PlantUMLRequest {
  plantUML: string;
}

type RequestHandler = (req: Request, res: Response) => Promise<void>;

const parseHandler: RequestHandler = async (req, res) => {
  try {
    const { plantUML } = req.body as PlantUMLRequest;
    if (!plantUML) {
      res.status(400).json({ error: 'PlantUML string is required' });
      return;
    }

    const result = await parsePlantUML(plantUML);
    res.json(result);
  } catch (error) {
    console.error('Error parsing PlantUML:', error);
    res.status(500).json({ error: 'Failed to parse PlantUML' });
  }
};

router.post('/parse', parseHandler);

export default router; 