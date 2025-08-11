/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GitService } from "../services/git.service";
import { StaticAnalyzerService } from "../services/staticAnalyzer.service";
import { AiService } from "../services/ai.service";
import { db } from "~/server/db";

export const analysisRouter = createTRPCRouter({
  runAnalysis: protectedProcedure
    .input(z.object({ repoUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const analysisRecord = await db.analysis.create({
        data: {
          repoUrl: input.repoUrl,
          status: "PENDING",
          userId: ctx.session.user.id,
        },
      });

      let repoPath: string | null = null;
      try {
        repoPath = await GitService.cloneRepo(input.repoUrl);
        const rawOpportunities =
          await StaticAnalyzerService.analyzeRepo(repoPath);

        const processedInsights = await Promise.all(
          rawOpportunities.map((opp) => AiService.generateInsight(opp)),
        );

        const finalResult = await db.analysis.update({
          where: { id: analysisRecord.id },
          data: {
            status: "COMPLETED",
            results: processedInsights,
          },
        });

        return {
          message: "Analysis completed successfully!",
          analysisId: finalResult.id,
          opportunities: processedInsights,
        };
      } catch (error) {
        await db.analysis.update({
          where: { id: analysisRecord.id },
          data: { status: "FAILED" },
        });

        console.error("Analysis failed:", error);
        throw new Error("Analysis failed.", { cause: error });
      } finally {
        if (repoPath) {
          await GitService.cleanup(repoPath);
        }
      }
    }),
});
