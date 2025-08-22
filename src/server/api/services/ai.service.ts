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
          } catch (parseError) {
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
    const languageMap: { [key: string]: string } = {
        ts: "TypeScript",
        tsx: "TypeScript/React",
        js: "JavaScript",
        jsx: "JavaScript/React",
        py: "Python",
        go: "Go",
        rs: "Rust",
        java: "Java",
    };

    const fullLanguageName = languageMap[language];
    if (!fullLanguageName) return null; // Skip unsupported languages

    return `
      You are CodeCompass, a world-class software architect and staff engineer with 20 years of experience. Your task is to perform a holistic code review on the following file.

      Your analysis should be deep and insightful. Focus on identifying opportunities for improvement in these key areas:
      1.  **Readability & Maintainability:** Is the code clean, well-structured, and easy to understand? Are there overly complex functions or magic numbers?
      2.  **Performance:** Are there inefficient loops, unnecessary computations, or patterns that could lead to performance bottlenecks?
      3.  **Security:** Are there any common security vulnerabilities, such as hardcoded secrets or unsafe operations?
      4.  **Best Practices:** Does the code adhere to modern best practices and idiomatic conventions for ${fullLanguageName}?

      **IMPORTANT RULES:**
      - Only report issues that are **actually present** in the code. Do not hallucinate or suggest improvements for problems that don't exist.
      - Be very precise with the line numbers.
      - Your tone should be that of a helpful, expert mentor.

      **OUTPUT FORMAT:**
      Respond ONLY with a valid JSON object. The JSON object must have a single key: "opportunities". The value should be an array of objects.
      Each object in the array represents a single opportunity you've found and must have the following FIVE keys: "title", "problem", "solution", "file", and "line".
      
      - "title": A short, clear title for the issue (e.g., "Hardcoded Secret Detected", "Inefficient Loop for Data Transformation").
      - "problem": A simple, one-paragraph explanation of the problem and its impact. Use an analogy if possible.
      - "solution": A brief, step-by-step explanation of how to fix this. Each step must be separated by a newline character (\\n).
      - "file": The exact file path provided ("${filePath}").
      - "line": The precise line number where the issue begins.

      If you find no opportunities for improvement, you MUST return an empty array: {"opportunities": []}.

      Here is the code from the file "${filePath}":
      \`\`\`${language}
      ${content}
      \`\`\`
    `;
  }
}
