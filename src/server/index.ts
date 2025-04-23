import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import diagramRoutes from '../routes/diagramRoutes';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request Body:', req.body);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../public')));

// Routes
app.use('/api/diagrams', diagramRoutes);

// Serve the external test page
app.get('/external-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/external-test.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /health');
  console.log('- GET /external-test');
  console.log('- POST /api/diagrams/process-plantuml');
  console.log('- GET /api/diagrams/:projectId/:sprintId');
});

export default app; 