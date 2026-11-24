import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

interface GlobalMongo {
  client?: MongoClient;
  db?: Db;
  promise?: Promise<{ client: MongoClient; db: Db }>;
}

// Extend NodeJS global
declare global {
  var _mongo: GlobalMongo | undefined;
}

const globalForMongo = global as typeof global & { _mongo?: GlobalMongo };

if (!globalForMongo._mongo) {
  globalForMongo._mongo = {};
}

/**
 * Singleton MongoDB connection for FixMate
 * Uses transactions when replica set / Atlas is used
 */
export async function getDb(): Promise<{ client: MongoClient; db: Db }> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI env. Add it to .env.local. Format: mongodb://localhost:27017/fixmatedb or Atlas URI");
  }

  if (globalForMongo._mongo?.db && globalForMongo._mongo?.client) {
    return { client: globalForMongo._mongo.client, db: globalForMongo._mongo.db };
  }

  if (globalForMongo._mongo?.promise) {
    return globalForMongo._mongo.promise;
  }

  const client = new MongoClient(uri as string, {
    // FixMate: lower timeout for faster fail under contention
    timeoutMS: 10000,
  });

  const promise = client.connect().then(async (connectedClient) => {
    // Use db from URI if not provided, fallback to fixmatedb
    const dbName = process.env.MONGODB_DB || "fixmatedb";
    const db = connectedClient.db(dbName);
    // Ensure indexes are created lazily by adapter, no manual here
    return { client: connectedClient, db };
  });

  // Don't cache a rejected connection attempt — let the next request retry
  // with a fresh attempt instead of reusing the same failure forever.
  promise.catch(() => {
    if (globalForMongo._mongo?.promise === promise) {
      globalForMongo._mongo.promise = undefined;
    }
  });

  globalForMongo._mongo!.promise = promise;

  const result = await promise;
  globalForMongo._mongo!.client = result.client;
  globalForMongo._mongo!.db = result.db;

  return result;
}

/**
 * Check whether a cached MongoClient is still usable.
 * After an Atlas pause/outage the driver topology ends up closed/destroyed;
 * reusing it throws MongoTopologyClosedError on every operation until the
 * process restarts. Detect that state so a fresh client is created instead.
 */
interface TopologyLike {
  topology?: {
    isConnected?: () => boolean;
  };
}

export function isClientUsable(client: MongoClient | null | undefined): boolean {
  if (!client) return false;
  try {
    // `topology` is driver-internal (not in public types) but present at
    // runtime; access it structurally so a closed topology is detectable.
    const topology = (client as unknown as TopologyLike).topology;
    // No topology yet = never attempted a connection — allow lazy connect.
    if (!topology) return true;
    if (typeof topology.isConnected === "function") return topology.isConnected();
    return true;
  } catch {
    return false;
  }
}

// Synchronous helper for BetterAuth which expects Db instance at init
// It will create client lazily if needed - for Next.js, better to use async wrapper in route but adapter needs Db
let cachedDb: Db | null = null;
let cachedClient: MongoClient | null = null;

export function getDbSync(): { db: Db; client: MongoClient } {
  if (cachedDb && cachedClient && isClientUsable(cachedClient)) {
    return { db: cachedDb, client: cachedClient };
  }

  // Drop a dead client so a fresh one is created below. Without this, one
  // failed connection attempt poisons every later request with
  // MongoTopologyClosedError until redeploy (seen in Vercel runtime logs).
  if (cachedClient) {
    cachedClient.close().catch(() => undefined);
    cachedDb = null;
    cachedClient = null;
  }

  if (!uri) {
    // During build, return dummy to avoid throwing - auth route will fail at runtime if no env, which is expected
    // Create a client with dummy uri that won't connect until used
    // For build, we need to not throw, so we create a client with localhost fallback
    const fallbackUri = (process.env.BETTER_AUTH_DB_URL as string)
    const client = new MongoClient(fallbackUri);
    const db = client.db("fixmatedb");
    return { db, client };
  }

  // Note: This creates a client without await - BetterAuth adapter handles connection
  // For production, prefer getDb() async in API routes. This sync version is for config initialization.
  const client = new MongoClient(uri);
  const dbName = process.env.MONGODB_DB || "fixmatedb";
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { db, client };
}
