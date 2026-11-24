import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import type { Db, MongoClient } from "mongodb";
import { getDbSync } from "./db";
import { sendEmail } from "./email";

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

/**
 * Build a BetterAuth instance against the given MongoDB handles.
 * Constructed lazily via getAuth() (not at module scope) so a dead client
 * topology is replaced instead of cached for the lifetime of the process.
 */
function createAuthInstance(db: Db, client: MongoClient) {
  return betterAuth({
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
    resetPasswordTokenExpiresIn: 3600, // 1 hour expiration for reset token (BetterAuth default 3600 seconds)

    sendResetPassword: async ({ user, url, token }, request) => {
      // Use FixMate branding, include BetterAuth-generated reset URL, explain why sent
      // Never expose token separately from secure reset URL, never include existing password
      // Never log passwords, reset tokens, or reset URLs
      await sendEmail({
        to: user.email,
        subject: "Reset your FixMate password",
        text: `You requested to reset your FixMate password.

Click the following link to reset your password: ${url}

This link will expire in 1 hour.

If you did not request a password reset, you can safely ignore this email.

FixMate Team
Precision Appliance & Device Repair Platform`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F26A36;">FixMate - Password Reset</h2>
            <p>You requested to reset your FixMate password.</p>
            <p><a href="${url}" style="background: #F26A36; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a></p>
            <p>Or copy and paste this link: ${url}</p>
            <p><small>This link will expire in 1 hour. If you did not request a reset, you can safely ignore this email.</small></p>
            <p><small>FixMate Team - Precision Appliance & Device Repair Platform</small></p>
          </div>
        `,
      });
    },

    onPasswordReset: async ({ user }, request) => {
      // Optional post-reset logic — preserve existing functionality
      // Never log passwords, reset tokens, or reset URLs
      console.log(`[FixMate] Password reset successful for user ${user.email}`);
    },
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
}

export type AuthInstance = ReturnType<typeof createAuthInstance>;

let cachedAuth: AuthInstance | null = null;
let cachedAuthClient: MongoClient | null = null;

/**
 * Get the BetterAuth instance, rebuilding it when the underlying MongoDB
 * client died (Atlas pause/outage). getDbSync() already drops closed
 * topologies; the instance is rebuilt only when the client identity changed,
 * so the steady-state path reuses a single instance exactly as before.
 * Without this, one failed connection poisons auth with
 * MongoTopologyClosedError until the deployment restarts.
 */
export function getAuth(): AuthInstance {
  const { db, client } = getDbSync();
  if (!cachedAuth || cachedAuthClient !== client) {
    cachedAuth = createAuthInstance(db, client);
    cachedAuthClient = client;
  }
  return cachedAuth;
}

// Export types for client usage
export type Session = AuthInstance["$Infer"]["Session"];
export type User = AuthInstance["$Infer"]["Session"]["user"];
