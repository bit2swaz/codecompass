import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GitService } from "../services/git.service";
import { StaticAnalyzerService } from "../services/staticAnalyzer.service";

export const analysisRouter = createTRPCRouter({
  runAnalysis: protectedProcedure
    .input(z.object({ repoUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      console.log("Starting analysis for user:", ctx.session.user.id);
      console.log("Analyzing repository:", input.repoUrl);

      let repoPath: string | null = null;
      try {
        repoPath = await GitService.cloneRepo(input.repoUrl);

        // 2. Run the static analysis
        const opportunities = await StaticAnalyzerService.analyzeRepo(repoPath);
        console.log("Opportunities found:", opportunities);

        // --- AI logic will go here next ---

        return {
          message: "Analysis completed successfully!",
          opportunities: opportunities, // 3. Return the results
        };
      } catch (error) {
        console.error("Analysis failed:", error);
        throw new Error("Analysis failed.", { cause: error });
      } finally {
        if (repoPath) {
          await GitService.cleanup(repoPath);
        }
      }
    }),
});
