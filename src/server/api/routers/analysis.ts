import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const analysisRouter = createTRPCRouter({
  runAnalysis: protectedProcedure
    .input(z.object({ repoUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      // We will add our core logic here in the next steps.
      console.log("Starting analysis for user:", ctx.session.user.id);
      console.log("Analyzing repository:", input.repoUrl);

      // For now, just return a success message.
      return {
        message: "Analysis started successfully!",
        repo: input.repoUrl,
      };
    }),
});
