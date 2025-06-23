// src/backend/controller/GeminiController.ts
import { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService";

export class GeminiController {
  static async generate(req: Request, res: Response): Promise<void> {
    try {
      const { geminiPrompt } = req.body;

      if (!geminiPrompt) {
        res.status(400).json({ error: "Missing geminiPrompt" });
        return;
      }
      

      const data = await GeminiService.getGeminiResponse(geminiPrompt);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("GeminiController Error:", error);
      res.status(500).json({
        success: false,
        error: error?.message || "Internal Server Error",
      });
    }
  }
}
