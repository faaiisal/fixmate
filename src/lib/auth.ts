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

  // Base URL: Use VERCEL_URL in production, fallback to envs, then localhost for dev
  // VERCEL_URL is auto-set by Vercel to your deployment URL (without https)
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  // Secret: required in production
  secret: process.env.BETTER_AUTH_SECRET,

  // Trusted origins: Include localhost for dev, vercel.app for production, and live frontend URLs
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "https://fixmate-psi.vercel.app",
    "https://*.vercel.app",
    "https://fixmate-server-snowy.vercel.app",
    "https://fixmate-server.vercel.app",
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

  // Social Providers - only include if env vars are set to avoid 500 on missing credentials
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          },
        }
      : {}),
  },

  // User: extend with FixMate role field
  // BetterAuth will store role in user collection
  // SECURITY FIX Phase 1: Keep input:true to allow customer|technician but enforce server-side via databaseHooks below
  // Admin role never allowed from public sign-up — sanitized in databaseHooks
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true, // Allowed for customer|technician, sanitized server-side to block admin
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  // SECURITY: Database hooks to enforce role assignment — prevents public admin registration
  // Even if client sends role=admin via crafted request, it will be forced to customer
  // Existing admin accounts remain intact (hook only on create, not update)
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const PERMITTED_PUBLIC_ROLES = ["customer", "technician"];
          const rawRole = (user as any).role;
          const normalizedRole =
            typeof rawRole === "string" ? rawRole.trim().toLowerCase() : "";

          // Block admin role from public sign-up — force to customer
          if (normalizedRole === "admin") {
            console.warn(
              `[SECURITY] Blocked public admin registration attempt for ${(user as any).email} — forcing to customer`
            );
            return {
              data: {
                ...user,
                role: "customer",
              },
            };
          }

          // Allow only customer and technician for public sign-up
          if (PERMITTED_PUBLIC_ROLES.includes(normalizedRole)) {
            return {
              data: {
                ...user,
                role: normalizedRole,
              },
            };
          }

          // Invalid or missing role — default to customer
          return {
            data: {
              ...user,
              role: "customer",
            },
          };
        },
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
