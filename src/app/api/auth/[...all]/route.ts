import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

async function handle(req: NextRequest, method: "GET" | "POST") {
  // Ensure the underlying MongoDB connection is established so operations
  // do not race with connection handshake or fail with topology closed errors
  try {
    await getDb();
  } catch (dbErr) {
    console.error("[FixMate Auth Route] Database connection error during auth handling:", (dbErr as Error).message);
  }

  const { GET, POST } = toNextJsHandler(getAuth());
  return method === "POST" ? POST(req) : GET(req);
}

export async function POST(req: NextRequest) {
  return handle(req, "POST");
}

export async function GET(req: NextRequest) {
  return handle(req, "GET");
}
