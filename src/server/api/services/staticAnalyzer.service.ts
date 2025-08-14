/* eslint-disable @typescript-eslint/prefer-regexp-exec */
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

const SENSITIVE_KEY_REGEX = /^(api_key|secret|token|password)$/i;
const SENSITIVE_VALUE_REGEX = /[A-Za-z0-9]{20,}/;

export class StaticAnalyzerService {
  public static async analyzeRepo(repoPath: string): Promise<any[]> {
    const opportunities: any[] = [];
    const files = await this.getAllFiles(repoPath);

    for (const file of files) {
      // Get the relative path to show the user (e.g., "src/components/Button.tsx")
      const relativePath = path.relative(repoPath, file);

      if (relativePath.endsWith(".jsx") || relativePath.endsWith(".tsx")) {
        const content = await fs.readFile(file, "utf-8");

        const propDrilling = this.findPropDrilling(content, relativePath);
        if (propDrilling) opportunities.push(propDrilling);

        const hardcodedSecrets = this.findHardcodedSecrets(
          content,
          relativePath,
        );
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
      traverse(ast, {
        JSXElement(path: NodePath<JSXElement>) {
          /* Placeholder for future, more complex logic */
        },
      });

      if (content.includes("props")) {
        if (
          path.basename(filePath) !== "layout.tsx" &&
          path.basename(filePath) !== "page.tsx"
        ) {
          return {
            type: "PROP_DRILLING",
            file: filePath, // Use the full relative path
            line: 1,
            recommendation:
              "Consider using Context API or a state management library.",
          };
        }
      }
    } catch (e) {
      /* Ignore parsing errors */
    }
    return null;
  }

  private static findHardcodedSecrets(
    content: string,
    filePath: string,
  ): any | null {
    try {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line && SENSITIVE_VALUE_REGEX.test(line) && /['"`]/.test(line)) {
          const match = line.match(SENSITIVE_KEY_REGEX);
          if (match) {
            return {
              type: "HARDCODED_SECRET",
              file: filePath, // Use the full relative path
              line: i + 1,
              recommendation: "Move sensitive keys to environment variables.",
            };
          }
        }
      }
    } catch (error) {
      /* Ignore parsing errors */
    }
    return null;
  }

  private static async getAllFiles(dirPath: string): Promise<string[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(dirPath, entry.name);
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
