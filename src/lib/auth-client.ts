import { createAuthClient } from "better-auth/react";

// Single client instance - uses same domain by default, or BETTER_AUTH_URL env
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export typed helpers from same instance
export const { signIn, signUp, signOut, useSession } = authClient;
