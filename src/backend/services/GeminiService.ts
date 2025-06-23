
export class GeminiService {
  static async getGeminiResponse(prompt: string): Promise<any> {
    const key = process.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");

    console.log("Prompt is : " + prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini API Response:", data);

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Gemini API Error");
    }

    return data;
  }
}
