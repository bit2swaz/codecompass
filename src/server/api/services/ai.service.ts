import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { env } from "~/env";

type Opportunity = {
  type: "HARDCODED_SECRET" | "PROP_DRILLING";
  file: string;
  line: number;
  recommendation: string;
};

export class AiService {
  private static instance: GoogleGenerativeAI;

  private static getInstance(): GoogleGenerativeAI {
    if (!this.instance) {
      this.instance = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
    return this.instance;
  }

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
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const parsedJson = JSON.parse(jsonString) as object;

    return { ...parsedJson, type: opportunity.type };
  }

  private static createPrompt(opportunity: Opportunity): string {
    const baseInstruction = `
      You are CodeCompass, an expert code reviewer providing helpful feedback to a junior developer.
      An automated scan found the following issue:
      - Issue Type: ${opportunity.type}
      - File: ${opportunity.file}
      - Line Number: ${opportunity.line}

      Your task is to respond ONLY with a valid JSON object with FIVE keys: "title", "problem", "solution", "file", and "line".

      1.  "title": A short, clear title for this issue.
      2.  "problem": A simple, one-paragraph explanation of the problem and its impact. Use an encouraging tone and an analogy.
      3.  "solution": A brief, step-by-step explanation of how to fix this. **Each numbered step in the solution must be separated by a newline character (\\n).**
      4.  "file": The exact file path provided above ("${opportunity.file}").
      5.  "line": The exact line number provided above (${opportunity.line}).
    `;

    switch (opportunity.type) {
      case "HARDCODED_SECRET":
        return `
          ${baseInstruction}
          
          For the "title", use "Hardcoded Secret Detected".
          For the "problem", explain the security risk of storing secrets in code using a "key under the doormat" analogy.
          For the "solution", explain how to use a '.env' file in numbered steps.
        `;

      case "PROP_DRILLING":
        return `
          ${baseInstruction}

          For the "title", use "Potential Prop Drilling Detected".
          For the "problem", explain that passing props through many components makes code hard to maintain, using a "game of telephone" analogy.
          For the "solution", recommend using React's Context API or a state management library like Zustand in numbered steps.
        `;

      default:
        throw new Error("Unhandled opportunity type for AI prompt generation.");
    }
  }
}
