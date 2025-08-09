import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth"; // Import the new router

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter, // Register the router under the 'auth' namespace
});

export type AppRouter = typeof appRouter;
