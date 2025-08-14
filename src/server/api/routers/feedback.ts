/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const feedbackRouter = createTRPCRouter({
  sendFeedback: protectedProcedure
    .input(
      z.object({
        analysisId: z.string(),
        wasHelpful: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.feedback.create({
        data: {
          analysisId: input.analysisId,
          wasHelpful: input.wasHelpful,
        },
      });
      return { success: true };
    }),
});
