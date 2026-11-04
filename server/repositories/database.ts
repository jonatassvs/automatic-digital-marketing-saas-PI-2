import "server-only";
import { MongoClient, type Db } from "mongodb";
import type { Settings } from "../config";

export async function createIndexes(db: Db) {
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("pages").createIndex({ "seo.slug": 1 }, { unique: true }),
    db.collection("pages").createIndex({ owner_id: 1, updatedAt: -1 }),
    db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("events").createIndex({ pageId: 1, timestamp: -1 }),
    db.collection("events").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("rate_limits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}
const globalDatabase = globalThis as typeof globalThis & { landingDatabase?: Promise<Db> };
export function getDatabase(config: Settings): Promise<Db> {
  if (!globalDatabase.landingDatabase) {
    const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, socketTimeoutMS: 10000, appName: "landing-builder", maxPoolSize: 10 });
    globalDatabase.landingDatabase = (async () => {
      try { await client.connect(); const db = client.db(config.database); await createIndexes(db); return db; }
      catch (error) { globalDatabase.landingDatabase = undefined; await client.close(); throw error; }
    })();
  }
  return globalDatabase.landingDatabase;
}
