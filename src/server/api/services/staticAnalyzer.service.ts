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
import {
  type JSXElement,
  type VariableDeclarator,
  type FunctionDeclaration,
  type ArrowFunctionExpression,
} from "@babel/types";

const SENSITIVE_VARIABLE_NAME_REGEX = /key|secret|token|password/i;
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

      const visitor = {
        // **FIX:** Use the specific NodePath type for FunctionDeclaration
        FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
          if (
            path.node.params.some(
              (p: any) => p.name === "props" || p.type === "ObjectPattern",
            )
          ) {
            hasProps = true;
            path.traverse({
              JSXAttribute(innerPath) {
                if (innerPath.get("value").isJSXExpressionContainer()) {
                  const expr = innerPath.get("value.expression");
                  if (
                    expr.isMemberExpression() &&
                    (expr.get("object") as any).node.name === "props"
                  ) {
                    passesProps = true;
                  }
                  if (expr.isIdentifier()) {
                    const binding = path.scope.getBinding(expr.node.name);
                    if (binding?.path.isObjectPattern()) {
                      passesProps = true;
                    }
                  }
                }
              },
            });
          }
        },
        // **FIX:** Use the specific NodePath type for ArrowFunctionExpression
        ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
          if (
            path.node.params.some(
              (p: any) => p.name === "props" || p.type === "ObjectPattern",
            )
          ) {
            hasProps = true;
            path.traverse({
              JSXAttribute(innerPath) {
                if (innerPath.get("value").isJSXExpressionContainer()) {
                  const expr = innerPath.get("value.expression");
                  if (
                    expr.isMemberExpression() &&
                    (expr.get("object") as any).node.name === "props"
                  ) {
                    passesProps = true;
                  }
                  if (expr.isIdentifier()) {
                    const binding = path.scope.getBinding(expr.node.name);
                    if (binding?.path.isObjectPattern()) {
                      passesProps = true;
                    }
                  }
                }
              },
            });
          }
        },
      };

      traverse(ast, visitor);

      if (hasProps && passesProps) {
        return {
          type: "PROP_DRILLING",
          file: filePath,
          line: 1, // AST line numbers are complex, so we use a placeholder for now
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

      traverse(ast, {
        VariableDeclarator(path: NodePath<VariableDeclarator>) {
          const varName = (path.get("id") as any).node.name;
          const varValueNode = path.get("init").node;

          if (SENSITIVE_VARIABLE_NAME_REGEX.test(varName)) {
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
              path.stop();
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
