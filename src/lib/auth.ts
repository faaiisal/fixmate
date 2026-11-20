import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getDbSync } from "./db";

/**
 * FixMate BetterAuth Configuration
 * Clean Architecture: Server-only, never import in client components directly
 * 
 * Location: src/lib/auth.ts (NOT in validations/)
 * - validations/ is for Zod schemas only (auth.schema.ts, booking.schema.ts, service.schema.ts)
 * - lib/auth.ts is for BetterAuth server config
 * 
 * Supports:
 * - Email & Password (with auto sign-in disabled if you require verification)
 * - Google OAuth
 * - GitHub OAuth
 */

const { db, client } = getDbSync();

export const auth = betterAuth({
  appName: "FixMate",

  // Base URL: fallback to BETTER_AUTH_URL env
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Secret: required in production
  secret: process.env.BETTER_AUTH_SECRET,

  // Trusted origins: baseURL is trusted by default, add frontend URL
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ].filter(Boolean) as string[],

  // Database: MongoDB adapter with transactions (pass client for replica set/Atlas)
  database: mongodbAdapter(db, {
    client, // Pass client to enable transactions for replica set/Atlas. For standalone, remove client option per docs.
  }),

  // Email & Password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set true if you want to enforce verification
    minPasswordLength: 8,
    autoSignIn: true, // Auto sign in after sign-up
  },

  // Social Providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Optional: additional scopes if needed
      // scope: ["email", "profile"],
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // User: extend with FixMate role field
  // BetterAuth will store role in user collection
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true, // Allow passing role during sign-up
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  // Session: 7 days default, 1 day update age
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 mins cache
    },
  },

  // Advanced: enable joins for MongoDB performance (requires better-auth >=1.4.0)
  advanced: {
    database: {
      generateId: false, // Let MongoDB generate ObjectId
      // Enable joins for faster session/user lookups
      // joins: true, // Uncomment if you have replica set and want 2-3x performance
    },
  },
});

// Export types for client usage
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
