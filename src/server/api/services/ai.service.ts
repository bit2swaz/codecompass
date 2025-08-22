/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { env } from "~/env";

export class AiService {
  private static instance: GoogleGenerativeAI;

  private static getInstance(): GoogleGenerativeAI {
    if (!this.instance) {
      this.instance = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
    return this.instance;
  }

  public static async generateInsightsForFile(
    content: string,
    filePath: string,
    language: string,
  ): Promise<object[]> {
    const genAI = this.getInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = this.createPrompt(content, filePath, language);

    if (!prompt) return [];

    const generationConfig = {
      temperature: 0.2,
      responseMimeType: "application/json",
    };
    
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      let parsedJson: { opportunities: any[] } | null = null;

      try {
        parsedJson = JSON.parse(responseText) as { opportunities: any[] };
      } catch (e) {
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            parsedJson = JSON.parse(jsonMatch[1].trim()) as { opportunities: any[] };
          } catch (e) {
            console.error(`AI did not return valid JSON for ${filePath} even after regex extraction:`, responseText);
            return [];
          }
        } else {
          console.error(`AI did not return valid JSON for ${filePath}:`, responseText);
          return [];
        }
      }
      
      if (parsedJson && parsedJson.opportunities && Array.isArray(parsedJson.opportunities)) {
        return parsedJson.opportunities.map(opp => ({ ...opp, type: opp.title?.replace(/\s/g, '_').toUpperCase() }));
      }

      return [];
    } catch (error) {
      console.error(`AI analysis failed for ${filePath}:`, error);
      return [];
    }
  }

  private static createPrompt(content: string, filePath: string, language: string): string | null {
    const baseInstruction = `
      You are CodeCompass, an expert code reviewer. Your task is to analyze the following code snippet and identify potential areas for improvement based on a specific list of rules.

      Respond ONLY with a valid JSON object. The JSON object must have a single key: "opportunities". The value should be an array of objects. Each object in the array represents a single opportunity you've found and must have the following FIVE keys: "title", "problem", "solution", "file", and "line".

      - "title": A short, clear title for the issue.
      - "problem": A simple, one-paragraph explanation of the problem and its impact. Use an encouraging tone and an analogy.
      - "solution": A brief, step-by-step explanation of how to fix this. Each step must be separated by a newline character (\\n).
      - "file": The exact file path provided ("${filePath}").
      - "line": The exact line number where the issue occurs. Be precise.

      **IMPORTANT RULE: Only report an opportunity if you are highly confident it exists in the provided code. If the code does not contain any of the specified issues, you MUST return an empty array: {"opportunities": []}. Do not suggest improvements for issues that are not present.**
    `;

    let languageSpecificInstruction = "";

    switch (language) {
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
        languageSpecificInstruction = `
          You are an expert JavaScript/TypeScript developer. Analyze ONLY for these specific issues:
          1. Hardcoded Secrets: Look for variables named like 'key', 'secret', 'token' with long, hardcoded string values.
          2. Prop Drilling: In React components, look for components that receive props and pass them down to another component without using them.
          3. Missing Async/Await Error Handling: Find 'async' functions that contain 'await' calls but are not wrapped in a 'try...catch' block.
        `;
        break;
      
      case "py":
        languageSpecificInstruction = `
          You are an expert Python developer. Analyze ONLY for these specific issues:
          1. Mutable Default Arguments: Find function definitions that use lists or dictionaries as default arguments.
          2. Missing 'if __name__ == "__main__":' guard for executable code.
        `;
        break;
      
      default:
        return null;
    }

    return `
      ${baseInstruction}
      ${languageSpecificInstruction}

      Here is the code from the file "${filePath}":
      \`\`\`${language}
      ${content}
      \`\`\`
    `;
  }
}
