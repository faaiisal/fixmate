import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Phase 6: Protect dashboard routes
 * - Logged-out user redirected to /sign-in
 * - Role-based redirects handled in dashboard layout (client) for precise role check via useSession
 * - This middleware checks session cookie existence as proxy for logged-in state
 *   Real session verification happens via BetterAuth DB lookup in layout and backend requireAuth
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

export async function middleware(req: NextRequest) {
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

  // Session exists — allow request, role-based redirect will be handled in dashboard layout
  // using useSession() which has role, and will redirect to own dashboard if mismatch
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
