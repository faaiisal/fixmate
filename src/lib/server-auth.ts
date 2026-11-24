import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "./auth";
import { getDb } from "./db";

export type AppRole = "customer" | "technician" | "admin";

export function normalizeRole(role: unknown): AppRole {
  return role === "technician" || role === "admin" ? role : "customer";
}

/**
 * Verify the BetterAuth session on the server.
 *
 * This reads the signed session cookie from the request headers and asks
 * BetterAuth to validate it. Cookie presence alone is never treated as proof
 * of authentication. React cache() deduplicates the lookup across nested
 * server layouts during a single render.
 */
export const getServerSession = cache(async () => {
  // Read request headers outside the catch so Next.js can detect dynamic
  // rendering (DYNAMIC_SERVER_USAGE) instead of treating it as an auth failure.
  const requestHeaders = await headers();

  try {
    try {
      await getDb();
    } catch (connErr) {
      console.warn("[server-auth] MongoDB not ready for session verification:", (connErr as Error).message);
      return null;
    }
    return await getAuth().api.getSession({ headers: requestHeaders });
  } catch (error) {
    console.error("[server-auth] Failed to verify BetterAuth session", error);
    return null;
  }
});

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session;
}

/**
 * Server-side role gate for dashboard segments. The backend remains the final
 * authorization boundary for every API call; this gate prevents unauthorized
 * dashboard HTML from being rendered in the first place.
 */
export async function requireServerRole(role: AppRole) {
  const session = await requireServerSession();
  const actualRole = normalizeRole((session.user as { role?: unknown }).role);

  if (actualRole !== role) {
    redirect(`/dashboard/${actualRole}`);
  }

  return session;
}
