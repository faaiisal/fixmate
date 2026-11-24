import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

async function handle(req: NextRequest, method: "GET" | "POST") {
  // Resolve the auth instance per request so a dead MongoDB topology is
  // replaced (self-healing) instead of serving a poisoned singleton forever.
  const { GET, POST } = toNextJsHandler(getAuth());
  return method === "POST" ? POST(req) : GET(req);
}

export async function POST(req: NextRequest) {
  return handle(req, "POST");
}

export async function GET(req: NextRequest) {
  return handle(req, "GET");
}
