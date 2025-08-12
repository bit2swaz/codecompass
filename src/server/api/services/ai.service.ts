import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { env } from "~/env";

// 1. Update the Opportunity type to include our new type
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

    // ... same generationConfig and safetySettings ...
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
    return JSON.parse(jsonString) as object;
  }

  // 2. Update the createPrompt method to handle different types
  private static createPrompt(opportunity: Opportunity): string {
    const baseInstruction = `
      You are CodeCompass, an expert code reviewer providing helpful feedback to a junior developer.
      An automated scan found the following issue:
      - Issue Type: ${opportunity.type}
      - File: ${opportunity.file}

      Your task is to respond ONLY with a valid JSON object with three keys: "title", "problem", and "solution".
      Keep the tone encouraging and use an analogy for the "problem" section.
    `;

    switch (opportunity.type) {
      case "HARDCODED_SECRET":
        return `
          ${baseInstruction}
          
          For the "title", use "Hardcoded Secret Detected".
          For the "problem", explain the security risk of storing secrets directly in code. The analogy is leaving your house key under the doormat.
          For the "solution", explain how to use a '.env' file with 'process.env.VARIABLE_NAME'.
        `;

      case "PROP_DRILLING":
        return `
          ${baseInstruction}

          For the "title", use "Potential Prop Drilling Detected".
          For the "problem", explain that passing props through many intermediate components can make code hard to maintain. The analogy is like playing a game of telephone where the message can get confusing.
          For the "solution", briefly recommend using React's Context API or a state management library like Zustand to provide data directly to the components that need it.
        `;

      default:
        // This will help us catch any unhandled opportunity types
        throw new Error("Unhandled opportunity type for AI prompt generation.");
    }
  }
}
