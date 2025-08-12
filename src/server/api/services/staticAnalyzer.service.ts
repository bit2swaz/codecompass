/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs, statSync } from "fs";
import path from "path";
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import { type NodePath } from "@babel/traverse";
import { type JSXElement } from "@babel/types";

// A simple regex to find strings that look like keys/secrets
const SENSITIVE_KEY_REGEX = /^(api_key|secret|token|password)$/i;
const SENSITIVE_VALUE_REGEX = /[A-Za-z0-9]{20,}/; // Looks for long, random-looking strings

export class StaticAnalyzerService {
  /**
   * Analyzes a repository to find potential improvement opportunities.
   * @param repoPath The local file path to the cloned repository.
   * @returns An array of opportunities found.
   */
  public static async analyzeRepo(repoPath: string): Promise<any[]> {
    const opportunities = [];
    const files = await this.getAllFiles(repoPath);

    for (const file of files) {
      if (file.endsWith(".jsx") || file.endsWith(".tsx")) {
        const content = await fs.readFile(file, "utf-8");

        const propDrilling = this.findPropDrilling(content, file);
        if (propDrilling) opportunities.push(propDrilling);

        const hardcodedSecrets = this.findHardcodedSecrets(content, file);
        if (hardcodedSecrets) opportunities.push(hardcodedSecrets);
      }
    }
    return opportunities;
  }

  private static findPropDrilling(
    content: string,
    filePath: string,
  ): any | null {
    try {
      const ast = babelParser.parse(content, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      // Correctly type the traverse function
      traverse(ast, {
        JSXElement(path: NodePath<JSXElement>) {
          // The logic inside here is complex, so we'll leave the placeholder for now
        },
      });

      if (content.includes("props")) {
        if (
          path.basename(filePath) !== "layout.tsx" &&
          path.basename(filePath) !== "page.tsx"
        ) {
          return {
            type: "PROP_DRILLING",
            file: path.basename(filePath),
            line: 1,
            recommendation:
              "Consider using Context API or a state management library to avoid passing props through many layers.",
          };
        }
      }
    } catch (e) {
      // Ignore parsing errors
    }
    return null;
  }

  /**
   * A simple opportunity finder for hardcoded secrets.
   * @param content The content of the file to analyze.
   * @param filePath The path of the file.
   * @returns An opportunity object if a secret is found, otherwise null.
   */
  private static findHardcodedSecrets(
    content: string,
    filePath: string,
  ): any | null {
    try {
      const ast = babelParser.parse(content, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      // This is a simplified check. A real implementation would traverse the AST.
      // For the MVP, we'll use a regex on the raw content for simplicity.
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line && SENSITIVE_VALUE_REGEX.test(line) && /['"`]/.test(line)) {
          // A basic check for a long string literal that might be a key.
          const match = SENSITIVE_KEY_REGEX.exec(line);
          if (match) {
            return {
              type: "HARDCODED_SECRET",
              file: path.basename(filePath),
              line: i + 1,
              recommendation: "Move sensitive keys to environment variables.",
            };
          }
        }
      }
    } catch (error) {
      // Ignore parsing errors for now
    }
    return null;
  }

  /**
   * Recursively gets all file paths from a directory.
   * @param dirPath The path to the directory.
   * @returns An array of full file paths.
   */
  private static async getAllFiles(dirPath: string): Promise<string[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(dirPath, entry.name);
        // Ignore node_modules and .git
        if (
          entry.isDirectory() &&
          entry.name !== "node_modules" &&
          entry.name !== ".git"
        ) {
          return this.getAllFiles(fullPath);
        }
        return fullPath;
      }),
    );
    return files.flat().filter((file) => !statSync(file).isDirectory());
  }
}
