import "server-only";
import type { Db } from "mongodb";
import type { EventRecord } from "../models/entities";
export class EventRepository {
  private events;
  constructor(db: Db) { this.events = db.collection<EventRecord>("events"); }
  async create(event: EventRecord) { await this.events.insertOne(event); }
  async summary(pageId: string, since: Date) {
    const match = { pageId, timestamp: { $gte: since } };
    const [rows, unique] = await Promise.all([
      this.events.aggregate<{ _id: string; count: number }>([{ $match: match }, { $group: { _id: "$type", count: { $sum: 1 } } }]).toArray(),
      this.events.aggregate<{ count: number }>([{ $match: { ...match, type: "page_view", visitorId: { $type: "string" } } }, { $group: { _id: "$visitorId" } }, { $count: "count" }]).toArray(),
    ]);
    const counts = Object.fromEntries(rows.map(row => [row._id, row.count]));
    const pageViews = counts.page_view ?? 0, formSubmissions = counts.form_submit ?? 0;
    return { pageViews, uniqueVisitors: unique[0]?.count ?? 0, buttonClicks: counts.button_click ?? 0, formSubmissions, formSubmissionsPerView: pageViews ? Math.round(formSubmissions / pageViews * 10000) / 10000 : 0 };
  }
}
