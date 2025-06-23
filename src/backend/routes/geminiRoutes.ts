// src/backend/routes/geminiRoutes.ts
import express from "express";
import { GeminiController } from "../controller/GeminiController";

const router = express.Router();

router.post("/generate", GeminiController.generate);

export default router;
