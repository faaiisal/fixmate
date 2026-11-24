import { MongoClient, Db } from "mongodb";

/**
 * FixMate MongoDB Connection Manager
 *
 * Designed for Next.js Serverless (Vercel) & Better Auth:
 * - Safely reuses MongoClient across warm serverless function invocations via globalThis
 * - Dynamically supports both MONGODB_URI and BETTER_AUTH_DB_URL env vars
 * - Detects closed or destroyed topologies without falsely terminating connecting/idle clients
 * - Never calls client.close() during request lifecycles (prevents MongoTopologyClosedError)
 * - Automatically purges rejected promises so connection failures can retry immediately
 * - Emits structured diagnostics without leaking credentials or secrets
 */

export interface FixMateMongoCache {
  client?: MongoClient;
  db?: Db;
  connectPromise?: Promise<{ client: MongoClient; db: Db }>;
  uri?: string;
  dbName?: string;
}

declare global {
  var _fixmateMongo: FixMateMongoCache | undefined;
}

export function getMongoCache(): FixMateMongoCache {
  if (!globalThis._fixmateMongo) {
    globalThis._fixmateMongo = {};
  }
  return globalThis._fixmateMongo;
}

/**
 * Resolve MongoDB URI supporting both MONGODB_URI and BETTER_AUTH_DB_URL
 */
export function getMongoUri(): string | undefined {
  const uri = process.env.MONGODB_URI || process.env.BETTER_AUTH_DB_URL;
  return uri ? uri.trim() : undefined;
}

/**
 * Resolve target database name:
 * 1. MONGODB_DB env var
 * 2. DB_NAME env var
 * 3. Database name parsed from URI path (/fixmatedb)
 * 4. Fallback to "fixmatedb"
 */
export function getDatabaseName(): string {
  if (process.env.MONGODB_DB && process.env.MONGODB_DB.trim()) {
    return process.env.MONGODB_DB.trim();
  }
  if (process.env.DB_NAME && process.env.DB_NAME.trim()) {
    return process.env.DB_NAME.trim();
  }

  const uri = getMongoUri();
  if (uri) {
    try {
      const stripped = uri.replace(/^mongodb(\+srv)?:\/\//, "");
      const slashIndex = stripped.indexOf("/");
      if (slashIndex !== -1) {
        const pathPart = stripped.slice(slashIndex + 1).split("?")[0].trim();
        if (pathPart) {
          return pathPart;
        }
      }
    } catch {
      // fallback
    }
  }

  return "fixmatedb";
}

/**
 * Check whether a MongoClient instance is still usable.
 * A client is considered usable unless it has explicitly been closed or destroyed.
 *
 * IMPORTANT: We do NOT check topology.isConnected() because in the MongoDB driver:
 * 1. An uncompleted lazy connection has state 'connecting', which is valid and usable.
 * 2. An idle pool between serverless invocations may be awaiting server selection.
 * Treating !isConnected() as dead and closing the client was the exact cause of
 * MongoTopologyClosedError during concurrent index creation and session lookups.
 */
interface TopologyLike {
  topology?: {
    isDestroyed?: () => boolean;
    isClosed?: () => boolean;
    s?: {
      state?: string;
    };
  };
}

export function isClientUsable(client: MongoClient | null | undefined): boolean {
  if (!client) return false;
  try {
    const topology = (client as unknown as TopologyLike).topology;
    // Topology not yet created = valid uninitialized client waiting to connect
    if (!topology) return true;

    if (typeof topology.isDestroyed === "function" && topology.isDestroyed()) {
      return false;
    }
    if (typeof topology.isClosed === "function" && topology.isClosed()) {
      return false;
    }
    const state = topology.s?.state;
    if (state === "closed" || state === "closing") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Create a new MongoClient instance with tuned serverless timeout settings
 */
function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 0,
    retryWrites: true,
    retryReads: true,
  });
}

/**
 * Asynchronous MongoDB connection helper.
 * Reuses existing healthy client or in-flight connection promise.
 * Cleans up immediately on rejection so future calls can retry cleanly.
 */
export async function getDb(): Promise<{ client: MongoClient; db: Db }> {
  const uri = getMongoUri();
  const dbName = getDatabaseName();
  const cache = getMongoCache();

  if (!uri) {
    throw new Error(
      "Missing MongoDB connection URI. Set MONGODB_URI or BETTER_AUTH_DB_URL in environment variables."
    );
  }

  // Reuse existing usable client and database if uri and dbName match
  if (
    cache.client &&
    cache.db &&
    cache.uri === uri &&
    cache.dbName === dbName &&
    isClientUsable(cache.client)
  ) {
    return { client: cache.client, db: cache.db };
  }

  // Reuse pending connection promise if one is already in flight for this URI
  if (cache.connectPromise && cache.uri === uri) {
    return cache.connectPromise;
  }

  // If cached client was closed or destroyed, log and drop references
  if (cache.client && !isClientUsable(cache.client)) {
    console.warn("[FixMate Mongo] Cached MongoDB client is closed/destroyed; creating a fresh client.");
    cache.client = undefined;
    cache.db = undefined;
    cache.connectPromise = undefined;
  }

  // Log connection starting (safe: no credentials or secrets logged)
  console.log(`[FixMate Mongo] MongoDB connection starting (db: ${dbName})`);

  const client = createMongoClient(uri);
  const database = client.db(dbName);
  cache.uri = uri;
  cache.dbName = dbName;

  const promise = client
    .connect()
    .then((connectedClient) => {
      console.log(`[FixMate Mongo] MongoDB connection successful (db: ${dbName})`);
      cache.client = connectedClient;
      cache.db = database;
      return { client: connectedClient, db: database };
    })
    .catch((error: Error) => {
      console.error("[FixMate Mongo] MongoDB connection failed:", error.message);
      // Clean up cached state on failure to never reuse a permanently rejected promise
      if (cache.client === client) {
        cache.client = undefined;
        cache.db = undefined;
      }
      cache.connectPromise = undefined;
      throw error;
    });

  cache.connectPromise = promise;
  return promise;
}

/**
 * Synchronous helper for Better Auth initialization.
 * Better Auth mongoAdapter requires synchronous Db and MongoClient handles at setup.
 *
 * - Returns cached instance if available and usable.
 * - Otherwise creates a singleton client, saves it in global cache, and initiates background connect.
 * - During build time without env vars, returns a dummy instance to permit static compilation.
 */
export function getDbSync(): { db: Db; client: MongoClient } {
  const uri = getMongoUri();
  const dbName = getDatabaseName();
  const cache = getMongoCache();

  // Return cached client and db if already initialized and usable with matching config
  if (
    cache.client &&
    cache.db &&
    cache.uri === uri &&
    cache.dbName === dbName &&
    isClientUsable(cache.client)
  ) {
    return { db: cache.db, client: cache.client };
  }

  // If existing client died, reset instance without throwing
  if (cache.client && !isClientUsable(cache.client)) {
    console.warn("[FixMate Mongo] Cached client is closed/destroyed in getDbSync; creating new instance.");
    cache.client = undefined;
    cache.db = undefined;
    cache.connectPromise = undefined;
  }

  // Build time fallback when no URI is configured (avoids crashing Next.js static build)
  if (!uri) {
    console.warn("[FixMate Mongo] No MongoDB URI configured. Using build fallback client.");
    const dummyClient = new MongoClient("mongodb://localhost:27017/fixmatedb");
    const dummyDb = dummyClient.db(dbName);
    return { db: dummyDb, client: dummyClient };
  }

  console.log(`[FixMate Mongo] Initializing reusable MongoClient instance (db: ${dbName})`);

  const client = createMongoClient(uri);
  const db = client.db(dbName);

  // Store immediately in cache so all requests reuse the exact same client and Db handles
  cache.client = client;
  cache.db = db;
  cache.uri = uri;
  cache.dbName = dbName;

  // Initiate background connection and handle rejection gracefully
  cache.connectPromise = client
    .connect()
    .then((connectedClient) => {
      console.log(`[FixMate Mongo] MongoDB connection successful (db: ${dbName})`);
      return { client: connectedClient, db };
    })
    .catch((err: Error) => {
      console.error("[FixMate Mongo] MongoDB background connection failed:", err.message);
      if (cache.client === client) {
        cache.client = undefined;
        cache.db = undefined;
      }
      cache.connectPromise = undefined;
      // Background warmup failed; caller/async operations will retry via getDb()
      return undefined as any;
    });

  return { db, client };
}
