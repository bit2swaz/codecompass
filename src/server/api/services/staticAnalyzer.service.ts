/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs, statSync } from "fs";
import path from "path";
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import { type NodePath } from "@babel/traverse";
import { type VariableDeclarator } from "@babel/types";

// More forgiving regex to find variable names that look like secrets
const SENSITIVE_VARIABLE_NAME_REGEX = /key|secret|token|password/i;
// A regex to find strings that are long and have a mix of characters, typical of API keys
const SENSITIVE_VALUE_REGEX =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{20,}/;

export class StaticAnalyzerService {
  public static async analyzeRepo(repoPath: string): Promise<any[]> {
    const opportunities: any[] = [];
    const files = await this.getAllFiles(repoPath);

    for (const file of files) {
      const relativePath = path.relative(repoPath, file);

      if (
        relativePath.endsWith(".js") ||
        relativePath.endsWith(".jsx") ||
        relativePath.endsWith(".ts") ||
        relativePath.endsWith(".tsx")
      ) {
        const content = await fs.readFile(file, "utf-8");

        const hardcodedSecrets = this.findHardcodedSecrets(
          content,
          relativePath,
        );
        if (hardcodedSecrets) opportunities.push(hardcodedSecrets);

        // Only check for prop drilling in component files
        if (relativePath.endsWith(".jsx") || relativePath.endsWith(".tsx")) {
          const propDrilling = this.findPropDrilling(content, relativePath);
          if (propDrilling) opportunities.push(propDrilling);
        }
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
      let hasProps = false;
      let passesProps = false;

      traverse(ast, {
        // Check if the component receives props in its function signature
        FunctionDeclaration(path) {
          if (path.node.params.some((p) => (p as any).name === "props"))
            hasProps = true;
        },
        ArrowFunctionExpression(path) {
          if (path.node.params.some((p) => (p as any).name === "props"))
            hasProps = true;
        },
        // Check if it passes a property from `props` down to a child component
        JSXAttribute(path) {
          if (path.get("value").isJSXExpressionContainer()) {
            const expression = path.get("value.expression");
            if (
              expression.isMemberExpression() &&
              (expression.get("object") as any).node.name === "props"
            ) {
              passesProps = true;
            }
          }
        },
      });

      // If a component both receives props and passes them down, it's a candidate
      if (hasProps && passesProps) {
        return {
          type: "PROP_DRILLING",
          file: filePath,
          line: 1, // AST line numbers are complex, so we use a placeholder for the MVP
          recommendation:
            "Consider using Context API or a state management library.",
        };
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
      const ast = babelParser.parse(content, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
      let foundSecret: any = null;

      // Traverse the AST to find variable declarations
      traverse(ast, {
        VariableDeclarator(path: NodePath<VariableDeclarator>) {
          const varName = (path.get("id") as any).node.name;
          const varValueNode = path.get("init").node;

          // Check if the variable name looks sensitive
          if (SENSITIVE_VARIABLE_NAME_REGEX.test(varName)) {
            // Check if the value is a string literal that looks like a secret
            if (
              varValueNode &&
              varValueNode.type === "StringLiteral" &&
              SENSITIVE_VALUE_REGEX.test(varValueNode.value)
            ) {
              foundSecret = {
                type: "HARDCODED_SECRET",
                file: filePath,
                line: path.node.loc?.start.line ?? 1,
                recommendation: "Move sensitive keys to environment variables.",
              };
              path.stop(); // Stop traversing once we find one
            }
          }
        },
      });

      return foundSecret;
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
