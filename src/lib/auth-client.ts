import { createAuthClient } from "better-auth/react";

// Single client instance - uses same origin by default in production
// For client-side, window.location.origin is the safest fallback (not localhost hardcoded)
// NEXT_PUBLIC_APP_URL is set at build time from Vercel env vars
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined),
});

// Export typed helpers from same instance
export const { signIn, signUp, signOut, useSession } = authClient;
