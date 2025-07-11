import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import diagramRoutes from "./routes/diagramRoutes";
import diagramComponentsRoutes from "./routes/diagramComponentsRoutes";
import path from "path";
import { fileURLToPath } from "url";
import diagramUseCaseSpecificationRoutes from "./routes/diagramUseCaseSpecificationRoutes";
import geminiRoutes from "./routes/geminiRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Request Body:", req.body);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../../public")));

// Routes
app.use("/api/diagrams", diagramRoutes);
app.use("/api/diagram-components", diagramComponentsRoutes);
app.use(
  "/api/diagram-usecase-specifications",
  diagramUseCaseSpecificationRoutes
);

app.use("/api/gemini", geminiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Define the absolute path to the frontend build
const clientBuildPath = path.join(process.cwd(), "dist/client");

// Serve static files (React app build)
app.use(express.static(clientBuildPath));

// Serve index.html for all non-API routes (SPA fallback)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Available routes:");
  console.log("- GET /health");
  console.log("- POST /api/diagrams/process-plantuml");
  console.log("- GET /api/diagrams/:projectId");
  console.log("- POST /api/diagram-components/get-or-create");
  console.log("- GET /api/diagram-components/:id");
  console.log("- PATCH /api/diagram-components/:id");
  console.log("- DELETE /api/diagram-components/:id");
  console.log("- GET /api/diagrams/*");
  console.log("- GET /api/diagram-components/*");
});

export default app;
