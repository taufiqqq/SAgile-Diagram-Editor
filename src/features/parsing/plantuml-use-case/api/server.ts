import express from 'express';
import cors from 'cors';
import plantUMLRoutes from './routes/plantUMLRoutes';

const app = express();
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

// Error handling
app.use((err: Error, _: any, res: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 