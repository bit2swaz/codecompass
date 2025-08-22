/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
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
            parsedJson = JSON.parse(jsonMatch[1].trim()) as {
              opportunities: any[];
            };
          } catch (parseError) {
            console.error(
              `AI did not return valid JSON for ${filePath} even after regex extraction:`,
              responseText,
            );
            return [];
          }
        } else {
          console.error(
            `AI did not return valid JSON for ${filePath}:`,
            responseText,
          );
          return [];
        }
      }

      if (
        parsedJson &&
        parsedJson.opportunities &&
        Array.isArray(parsedJson.opportunities)
      ) {
        return parsedJson.opportunities.map((opp) => ({
          ...opp,
          type: opp.title?.replace(/\s/g, "_").toUpperCase(),
        }));
      }

      return [];
    } catch (error) {
      console.error(`AI analysis failed for ${filePath}:`, error);
      return [];
    }
  }

  private static createPrompt(
    content: string,
    filePath: string,
    language: string,
  ): string | null {
    const languageMap: { [key: string]: string } = {
      ts: "TypeScript",
      tsx: "TypeScript/React",
      js: "JavaScript",
      jsx: "JavaScript/React",
      py: "Python",
      go: "Go",
      rs: "Rust",
      java: "Java",
      cs: "C#",
      cpp: "C++",
      c: "C",
      h: "C/C++ Header",
      rb: "Ruby",
      php: "PHP",
      swift: "Swift",
      kt: "Kotlin",
    };

    const fullLanguageName = languageMap[language] ?? language.toUpperCase();

    return `
      You are CodeCompass, a world-class software architect and principal engineer with 20 years of experience. Your task is to perform a holistic code review on the following file.

      You are an expert in ${fullLanguageName}.

      Your analysis should be deep and insightful. Focus on identifying opportunities for improvement in these key areas:
      1.  **Readability & Maintainability:** Is the code clean, well-structured, and easy to understand?
      2.  **Performance:** Are there inefficient patterns or potential bottlenecks?
      3.  **Security:** Are there any common security vulnerabilities?
      4.  **Best Practices:** Does the code adhere to modern best practices and idiomatic conventions for ${fullLanguageName}?

      **IMPORTANT RULES:**
      - Only report issues that are **actually present** in the code. Do not hallucinate.
      - Be very precise with the line numbers.
      - Your tone should be that of a helpful, expert mentor.

      **OUTPUT FORMAT:**
      Respond ONLY with a valid JSON object with a single key: "opportunities". The value should be an array of objects.
      Each object must have FIVE keys: "title", "problem", "solution", "file", and "line".
      If you find no opportunities, you MUST return an empty array: {"opportunities": []}.

      Here is the code from the file "${filePath}":
      \`\`\`${language}
      ${content}
      \`\`\`
    `;
  }
}
