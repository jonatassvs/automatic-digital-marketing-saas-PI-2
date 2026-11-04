import "server-only";
import { MongoServerError, type Db } from "mongodb";
export class RateLimitRepository {
  private collection;
  constructor(db: Db) { this.collection = db.collection<{ _id: string; count: number; expiresAt: Date }>("rate_limits"); }
  async increment(key: string, expiresAt: Date) {
    try {
      const result = await this.collection.findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, returnDocument: "after" });
      return result!.count;
    } catch (error) {
      if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
      return (await this.collection.findOneAndUpdate({ _id: key }, { $inc: { count: 1 } }, { returnDocument: "after" }))!.count;
    }
  }
}
