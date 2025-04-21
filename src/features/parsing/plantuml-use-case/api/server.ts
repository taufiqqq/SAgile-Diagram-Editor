import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import plantUMLRoutes from './routes/plantUMLRoutes';
import { parsePlantUML } from './services/plantUMLService';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plantuml', plantUMLRoutes);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');
  
  ws.on('message', async (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());
      const { plantUML } = data;
      
      if (!plantUML) {
        ws.send(JSON.stringify({ error: 'PlantUML string is required' }));
        return;
      }

      const result = await parsePlantUML(plantUML);
      ws.send(JSON.stringify(result));
    } catch (error) {
      console.error('Error parsing PlantUML:', error);
      ws.send(JSON.stringify({ error: 'Failed to parse PlantUML' }));
    }
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 