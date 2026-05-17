
export class GeminiService {
  static async getGeminiResponse(prompt: string): Promise<any> {
    const key = process.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");

    console.log("Prompt is : " + prompt);

    // 1. Updated model string from gemini-2.0-flash to gemini-2.5-flash
    // 2. Removed '?key=${key}' query parameter from the URL path
    const response = await fetch(
      `https://googleapis.com`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": key // 3. Added security header for authentication
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    // Always check for response status errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();

    console.log("Gemini API Response:", data);

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Gemini API Error");
    }

    return data;
  }
}
