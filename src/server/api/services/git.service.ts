import git from "isomorphic-git";
import http from "isomorphic-git/http/node"; // This is the corrected import path
import fs from "fs/promises";
import path from "path";

export class GitService {
  /**
   * Clones a public repository to a temporary local directory using a pure JS Git implementation.
   * @param repoUrl The URL of the repository to clone.
   * @returns The file path to the cloned repository.
   */
  public static async cloneRepo(repoUrl: string): Promise<string> {
    // Create a unique temporary directory for this clone
    const tempDir = await fs.mkdtemp(path.join("/tmp", "codecompass-"));
    console.log(`Cloning ${repoUrl} into ${tempDir}`);

    try {
      await git.clone({
        fs: { promises: fs },
        http,
        dir: tempDir,
        url: repoUrl,
        singleBranch: true, // Equivalent to --depth 1 for speed
        depth: 1,
      });
      console.log("Clone successful.");
      return tempDir;
    } catch (error) {
      console.error("Failed to clone repository:", error);
      // Cleanup the failed attempt
      await this.cleanup(tempDir);
      // Throw a consistent error message
      throw new Error(
        "Could not clone the repository. Please ensure the URL is correct and the repository is public.",
      );
    }
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
