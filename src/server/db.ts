import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getDbUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.POSTGRES_PRISMA_URL;
  }
  return env.POSTGRES_PRISMA_URL;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDbUrl(),
      },
    },
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
