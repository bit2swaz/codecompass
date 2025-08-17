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

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
