import "server-only";
import type { Db } from "mongodb";
import type { PageRecord } from "../models/entities";
export class PageRepository {
  private collection;
  constructor(db: Db) { this.collection = db.collection<PageRecord>("pages"); }
  async create(document: PageRecord) { await this.collection.insertOne(document); }
  owned(id: string, owner: string) { return this.collection.findOne({ _id: id, owner_id: owner }); }
  list(owner: string, offset: number, limit: number) { return this.collection.find({ owner_id: owner }).sort({ updatedAt: -1, _id: 1 }).skip(offset).limit(limit).toArray(); }
  update(id: string, owner: string, fields: Partial<PageRecord>) { return this.collection.findOneAndUpdate({ _id: id, owner_id: owner }, { $set: fields }, { returnDocument: "after" }); }
  async delete(id: string, owner: string) { return (await this.collection.deleteOne({ _id: id, owner_id: owner })).deletedCount === 1; }
  published(slug: string) { return this.collection.findOne({ "seo.slug": slug, status: "published" }); }
  publishedById(id: string) { return this.collection.findOne({ _id: id, status: "published" }); }
}
