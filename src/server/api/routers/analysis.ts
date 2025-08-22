import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GitService } from "../services/git.service";
import { AiService } from "../services/ai.service";
import { db } from "~/server/db";
import fs from "fs/promises";
import path from "path";

export const analysisRouter = createTRPCRouter({
  runAnalysis: protectedProcedure
    .input(
      z.object({
        repoUrl: z.string().url(),
        isPrivate: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      let accessToken: string | null | undefined = null;

      // Only fetch the access token if the repo is private
      if (input.isPrivate) {
        const account = await db.account.findFirst({
          where: { userId, provider: "github" },
        });
        accessToken = account?.access_token;
        if (!accessToken) {
          throw new Error(
            "Cannot analyze private repository without a valid GitHub token.",
          );
        }
      }

      const analysisRecord = await db.analysis.create({
        data: {
          repoUrl: input.repoUrl,
          status: "PENDING",
          userId: userId,
        },
      });

      let repoPath: string | null = null;
      try {
        // Pass the token (or null) to the clone service
        repoPath = await GitService.cloneRepo(input.repoUrl, accessToken);

        const sourceFiles = await GitService.getSourceCodeFiles(repoPath);
        const analysisPromises = sourceFiles.map(async (filePath) => {
          const content = await fs.readFile(filePath, "utf-8");
          const relativePath = path.relative(repoPath!, filePath);
          const language = path.extname(filePath).slice(1);
          return AiService.generateInsightsForFile(
            content,
            relativePath,
            language,
          );
        });
        const insightsNestedArray = await Promise.all(analysisPromises);
        const processedInsights = insightsNestedArray.flat();
        await db.analysis.update({
          where: { id: analysisRecord.id },
          data: { status: "COMPLETED", results: processedInsights },
        });
        return { analysisId: analysisRecord.id };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message.toLowerCase() : "";

        if (
          errorMessage.includes("authentication failed") ||
          errorMessage.includes("repository not found")
        ) {
          await db.analysis.update({
            where: { id: analysisRecord.id },
            data: {
              status: "COMPLETED",
              results: {
                error: "PRIVATE_REPO",
                message:
                  "Could not access the repository. Please ensure it is public.",
              },
            },
          });
          return {
            message: "Analysis handled private repository.",
            analysisId: analysisRecord.id,
            opportunities: [],
          };
        }

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

  getAnalysisById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await db.analysis.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      if (!analysis) throw new Error("Analysis not found");
      return analysis;
    }),

  getAllAnalyses: protectedProcedure.query(async ({ ctx }) => {
    return await db.analysis.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  deleteAnalysis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const analysis = await db.analysis.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!analysis) {
        throw new Error(
          "Analysis not found or you do not have permission to delete it.",
        );
      }

      return await db.analysis.delete({
        where: { id: input.id },
      });
    }),

  updateAnalysis: protectedProcedure
    .input(z.object({ id: z.string(), displayName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const analysis = await db.analysis.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!analysis) {
        throw new Error(
          "Analysis not found or you do not have permission to update it.",
        );
      }

      return await db.analysis.update({
        where: { id: input.id },
        data: { displayName: input.displayName },
      });
    }),

  deleteManyAnalyses: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const analyses = await db.analysis.findMany({
        where: {
          id: { in: input.ids },
          userId: ctx.session.user.id,
        },
      });

      if (analyses.length !== input.ids.length) {
        throw new Error(
          "One or more analyses were not found or you do not have permission to delete them.",
        );
      }

      return await db.analysis.deleteMany({
        where: {
          id: { in: input.ids },
          userId: ctx.session.user.id,
        },
      });
    }),
});
