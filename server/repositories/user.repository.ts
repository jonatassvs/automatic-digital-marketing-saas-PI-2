import "server-only";
import type { Db } from "mongodb";
import type { UserRecord, SessionRecord } from "../models/entities";
export class UserRepository {
  private users; private sessions;
  constructor(db: Db) { this.users = db.collection<UserRecord>("users"); this.sessions = db.collection<SessionRecord>("sessions"); }
  async create(user: UserRecord) { await this.users.insertOne(user); }
  byEmail(email: string) { return this.users.findOne({ email }); }
  byId(id: string) { return this.users.findOne({ _id: id }); }
  async createSession(session: SessionRecord) { await this.sessions.insertOne(session); }
  session(digest: string) { return this.sessions.findOne({ _id: digest, expiresAt: { $gt: new Date() } }); }
  async deleteSession(digest: string) { await this.sessions.deleteOne({ _id: digest }); }
}
