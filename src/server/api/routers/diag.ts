import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const diagRouter = createTRPCRouter({
  testDbConnection: publicProcedure.query(async ({ ctx }) => {
    try {
      const userCount = await ctx.db.user.count();
      return {
        status: "success",
        message: `Successfully connected to the database. Found ${userCount} users.`,
      };
    } catch (error) {
      console.error("DIAGNOSTIC TEST FAILED:", error);
      throw new Error("Failed to connect to the database.");
    }
  }),
});
