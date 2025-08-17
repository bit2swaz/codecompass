import { createTRPCRouter, createCallerFactory } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { analysisRouter } from "./routers/analysis";
import { feedbackRouter } from "./routers/feedback";
import { diagRouter } from "./routers/diag";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  analysis: analysisRouter,
  feedback: feedbackRouter,
  diag: diagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 * ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
