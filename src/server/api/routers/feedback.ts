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
    .mutation(async ({ ctx, input }) => {
      await db.feedback.create({
        data: {
          analysisId: input.analysisId,
          wasHelpful: input.wasHelpful,
          userId: ctx.session.user.id,
        },
      });
      return { success: true };
    }),
});
