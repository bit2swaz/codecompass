/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { env } from "~/env";

// A basic type for the opportunities our Static Analyzer finds
type Opportunity = {
  type: "HARDCODED_SECRET";
  file: string;
  line: number;
  recommendation: string;
};

export class AiService {
  private static instance: GoogleGenerativeAI;

  /**
   * Initializes and returns a singleton instance of the GoogleGenerativeAI client.
   */
  private static getInstance(): GoogleGenerativeAI {
    if (!this.instance) {
      this.instance = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
    return this.instance;
  }

  /**
   * Generates a detailed, user-friendly insight based on a found opportunity.
   * @param opportunity The raw opportunity data from the Static Analyzer.
   * @returns A structured insight object.
   */
  public static async generateInsight(
    opportunity: Opportunity,
  ): Promise<object> {
    const genAI = this.getInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = this.createPrompt(opportunity);

    const generationConfig = {
      temperature: 0.3,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      // ... other safety settings ...
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();
    // Clean up the response and parse it as JSON
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString) as object;
  }

  /**
   * Creates a detailed prompt for the Gemini API.
   * @param opportunity The raw opportunity data.
   * @returns A string prompt.
   */
  private static createPrompt(opportunity: Opportunity): string {
    // This is where the magic happens. A well-crafted prompt is key.
    return `
      You are CodeCompass, an expert code reviewer providing helpful feedback to a junior developer.
      An automated scan found the following issue:
      - Issue Type: ${opportunity.type}
      - File: ${opportunity.file}
      - Line: ${opportunity.line}

      Your task is to respond with a JSON object with three keys: "title", "problem", and "solution".

      1.  "title": A short, clear title for this issue. (e.g., "Hardcoded Secret Detected")
      2.  "problem": A simple, one-paragraph explanation of what the problem is and why it's a security risk. Use an analogy if possible. Keep the tone encouraging.
      3.  "solution": A brief, step-by-step explanation of how to fix this using environment variables (.env file).

      Example response format:
      \`\`\`json
      {
        "title": "Hardcoded Secret Detected",
        "problem": "It looks like a sensitive key or secret might be written directly into your code. Think of this like leaving your house key under the doormat – anyone who finds it can get in. Storing secrets in your code makes them vulnerable if your code is ever shared or becomes public.",
        "solution": "The best practice is to use environment variables. 1. Create a file named '.env' in your project's root directory. 2. Add your secret to this file like this: 'API_KEY=your_secret_value_here'. 3. Make sure '.env' is listed in your '.gitignore' file. 4. Access the key in your code using 'process.env.API_KEY'."
      }
      \`\`\`
    `;
  }
}
