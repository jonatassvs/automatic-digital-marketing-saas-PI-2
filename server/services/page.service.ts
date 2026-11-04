import "server-only";
import { randomUUID } from "node:crypto";
import { MongoServerError } from "mongodb";
import { ApiError, notFound } from "../errors";
import { publicPage, type PageRecord } from "../models/entities";
import { PageValidator } from "../validators/page.validator";
import type { PageRepository } from "../repositories/page.repository";
export class PageService {
  private validator = new PageValidator();
  constructor(private repository: PageRepository) {}
  async owned(id: string, owner: string) { return await this.repository.owned(id, owner) ?? notFound(); }
  async get(id: string, owner: string) { return publicPage(await this.owned(id, owner)); }
  async list(owner: string, offset: number, limit: number) { return (await this.repository.list(owner, offset, limit)).map(publicPage); }
  async create(payload: unknown, owner: string) {
    const fields = this.validator.validate(payload);
    const now = new Date();
    const page = { ...fields, _id: randomUUID(), owner_id: owner, createdAt: now, updatedAt: now };
    await this.persist(() => this.repository.create(page));
    return publicPage(page);
  }
  async update(id: string, payload: unknown, owner: string) { await this.owned(id, owner); return this.save(id, owner, this.validator.validate(payload, id)); }
  async save(id: string, owner: string, fields: Partial<PageRecord>) {
    const page = await this.persist(() => this.repository.update(id, owner, { ...fields, updatedAt: new Date() }));
    return publicPage(page ?? notFound());
  }
  private async persist<T>(operation: () => Promise<T>) {
    try { return await operation(); }
    catch (error) { if (error instanceof MongoServerError && error.code === 11000) throw new ApiError("Esse endereco ja esta em uso.", 409, "slug_unavailable"); throw error; }
  }
  async delete(id: string, owner: string) { if (!await this.repository.delete(id, owner)) notFound(); }
  async publish(id: string, owner: string, status: "published" | "private") { this.validator.validate(await this.get(id, owner), id); return this.save(id, owner, { status }); }
  async duplicate(id: string, owner: string) {
    const page = await this.get(id, owner);
    return this.create({ ...page, name: page.name.slice(0, 140) + " (copia)", status: "draft", seo: { ...page.seo, slug: page.seo.slug.slice(0, 60).replace(/-+$/, "") + "-" + randomUUID().replaceAll("-", ""), canonicalUrl: "", robotsIndex: false } }, owner);
  }
  async updateSeo(id: string, owner: string, payload: unknown) { await this.owned(id, owner); return this.save(id, owner, { seo: this.validator.seo(payload) }); }
  async published(slug: string) { return publicPage(await this.publishedRecord(slug)); }
  async publishedRecord(slug: string) { return await this.repository.published(slug) ?? notFound(); }
  async publishedById(id: string) { return await this.repository.publishedById(id) ?? notFound(); }
}
