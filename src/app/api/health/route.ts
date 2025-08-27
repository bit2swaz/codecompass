import { db } from "~/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // A very simple query to see if the database is reachable.
    const userCount = await db.user.count();
    return NextResponse.json({
      status: "ok",
      message: `Successfully connected to DB. Found ${userCount} users.`,
    });
  } catch (error) {
    console.error("DATABASE HEALTH CHECK FAILED:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to the database.",
        // We'll include the error message for debugging
        errorDetails: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
