import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GitService } from "../services/git.service";

export const analysisRouter = createTRPCRouter({
  runAnalysis: protectedProcedure
    .input(z.object({ repoUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      console.log("Starting analysis for user:", ctx.session.user.id);
      console.log("Analyzing repository:", input.repoUrl);

      let repoPath: string | null = null;
      try {
        // 2. Clone the repo
        repoPath = await GitService.cloneRepo(input.repoUrl);

        // --- Static Analysis and AI logic will go here ---

        return {
          message: "Analysis completed successfully!",
          repo: input.repoUrl,
        };
      } catch (error) {
        console.error("Analysis failed:", error);
        // Ensure we re-throw the error so the client knows it failed
        throw new Error("Analysis failed.", { cause: error });
      } finally {
        // 3. Always clean up the repo afterwards
        if (repoPath) {
          await GitService.cleanup(repoPath);
        }
      }
    }),
});
