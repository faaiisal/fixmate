import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optimistic dashboard guard only.
 * - Logged-out users without a session cookie are redirected to /sign-in early.
 * - Cookie presence is NOT proof of authentication. The real session is verified
 *   server-side by src/lib/server-auth.ts (BetterAuth auth.api.getSession) in the
 *   dashboard layouts, followed by per-role layout gates.
 * - The backend API remains the final authorization boundary for all data.
 */

const DASHBOARD_PATHS = ["/dashboard"];

function hasSessionCookie(req: NextRequest): boolean {
  const cookies = req.cookies;
  const possibleKeys = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "__Host-better-auth.session_token",
    "better-auth.session-token",
    "__Secure-better-auth.session-token",
  ];
  for (const key of possibleKeys) {
    if (cookies.get(key)?.value) return true;
  }
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.startsWith(p));

  if (!isDashboard) {
    return NextResponse.next();
  }

  // Check session cookie
  const hasSession = hasSessionCookie(req);

  if (!hasSession) {
    // No session cookie — redirect to sign-in with callback URL
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callback", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // A cookie exists, so continue. The dashboard server layouts verify the real
  // session and role before rendering any protected content.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
