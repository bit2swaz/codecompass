/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GitService } from "../services/git.service";
import { StaticAnalyzerService } from "../services/staticAnalyzer.service";
import { AiService } from "../services/ai.service"; // 1. Import the AI service

export const analysisRouter = createTRPCRouter({
  runAnalysis: protectedProcedure
    .input(z.object({ repoUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      console.log("Starting analysis for user:", ctx.session.user.id);
      console.log("Analyzing repository:", input.repoUrl);

      let repoPath: string | null = null;
      try {
        repoPath = await GitService.cloneRepo(input.repoUrl);
        const rawOpportunities =
          await StaticAnalyzerService.analyzeRepo(repoPath);
        console.log("Raw opportunities found:", rawOpportunities);

        // 2. Process each opportunity with the AI service
        const processedInsights = await Promise.all(
          rawOpportunities.map((opp) => AiService.generateInsight(opp)),
        );
        console.log("Processed insights:", processedInsights);

        return {
          message: "Analysis completed successfully!",
          opportunities: processedInsights, // 3. Return the AI-generated insights
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
