import { simpleGit, type SimpleGitOptions } from "simple-git";
import fs from "fs/promises";
import path from "path";

export class GitService {
  /**
   * Clones a public repository to a temporary local directory.
   * @param repoUrl The URL of the repository to clone.
   * @returns The file path to the cloned repository.
   */
  public static async cloneRepo(repoUrl: string): Promise<string> {
    // Create a unique temporary directory for this clone
    const tempDir = await fs.mkdtemp(path.join("/tmp", "codecompass-"));
    console.log(`Cloning ${repoUrl} into ${tempDir}`);

    const options: Partial<SimpleGitOptions> = {
      baseDir: tempDir,
      binary: "git",
      maxConcurrentProcesses: 6,
    };

    try {
      const git = simpleGit(options);
      // Perform a shallow clone (--depth 1) to save time and space
      await git.clone(repoUrl, ".", ["--depth", "1"]);
      console.log("Clone successful.");
      return tempDir;
    } catch (error) {
      console.error("Failed to clone repository:", error);
      // Cleanup the failed attempt
      await this.cleanup(tempDir);
      throw new Error("Could not clone the repository.");
    }
  }

  /**
   * Deletes the temporary directory.
   * @param directoryPath The path of the directory to delete.
   */
  public static async cleanup(directoryPath: string): Promise<void> {
    console.log(`Cleaning up directory: ${directoryPath}`);
    await fs.rm(directoryPath, { recursive: true, force: true });
  }
}
