import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "fs/promises";
import path from "path";

const SOURCE_CODE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".cs",
  ".cpp",
  ".c",
  ".h",
  ".rb",
  ".php",
  ".swift",
  ".kt",
  ".m",
  ".html",
  ".css",
  ".scss",
  ".vue",
  ".svelte",
]);

const IGNORE_LIST = new Set([
  "node_modules",
  ".git",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "next.config.js",
  "tailwind.config.js",
  "postcss.config.js",
  "prettier.config.js",
  "vite.config.ts",
  "webpack.config.js",
  "babel.config.js",
]);

export class GitService {
  /**
   * Clones a repository, using an access token only if provided.
   * @param repoUrl The URL of the repository to clone.
   * @param accessToken The user's GitHub OAuth access token (optional).
   * @returns The file path to the cloned repository.
   */
  public static async cloneRepo(
    repoUrl: string,
    accessToken?: string | null,
  ): Promise<string> {
    const tempDir = await fs.mkdtemp(path.join("/tmp", "codecompass-"));
    console.log(`Cloning ${repoUrl} into ${tempDir}`);

    try {
      await git.clone({
        fs: { promises: fs },
        http,
        dir: tempDir,
        url: repoUrl,
        singleBranch: true,
        depth: 1,
        headers: {
          ...(accessToken ? { Authorization: `token ${accessToken}` } : {}),
        },
      });
      console.log("Clone successful.");
      return tempDir;
    } catch (error) {
      console.error("Failed to clone repository:", error);
      await this.cleanup(tempDir);
      throw new Error(
        "Could not clone the repository. Please ensure the URL is correct and the repository is public, or that you have granted access to private repositories.",
      );
    }
  }
  /**
   * Gets all relevant source code file paths from a directory.
   * @param dirPath The path to the directory.
   * @returns An array of full file paths.
   */
  public static async getSourceCodeFiles(dirPath: string): Promise<string[]> {
    const allFiles: string[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (IGNORE_LIST.has(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        allFiles.push(...(await this.getSourceCodeFiles(fullPath)));
      } else if (
        SOURCE_CODE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
      ) {
        allFiles.push(fullPath);
      }
    }
    return allFiles;
  }

  /**
   * Deletes the temporary directory.
   * @param directoryPath The path of the directory to delete.
   */
  public static async cleanup(directoryPath: string): Promise<void> {
    console.log(`Cleaning up directory: ${directoryPath}`);
    // Use fs.rm from the promises API
    await fs.rm(directoryPath, { recursive: true, force: true });
  }
}
