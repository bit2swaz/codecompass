import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const vscodeRouter = createTRPCRouter({
  // Called by the VS Code extension to check the status of a deviceId
  pollDevice: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      const device = await db.vscodeDevice.findUnique({
        where: { deviceId: input.deviceId },
      });

      if (!device) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Device not found.",
        });
      }

      if (device.authToken) {
        // Once the token is ready, delete the device record for security
        await db.vscodeDevice.delete({ where: { deviceId: input.deviceId } });
        return { status: "SUCCESS", token: device.authToken };
      }

      return { status: "PENDING" };
    }),

  // Called by the web app when a logged-in user approves a device
  approveDevice: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Find the user's GitHub access token
      const account = await db.account.findFirst({
        where: { userId, provider: "github" },
      });

      if (!account?.access_token) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account not linked or access token is missing.",
        });
      }

      // Create or update the device record with the user's token
      await db.vscodeDevice.upsert({
        where: { deviceId: input.deviceId },
        update: { userId, authToken: account.access_token },
        create: {
          deviceId: input.deviceId,
          userId,
          authToken: account.access_token,
        },
      });

      return { success: true };
    }),
});
