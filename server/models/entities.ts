import type { LandingPageDocument } from "@/types/page";
export type Integrations = { gtm: { containerId: string } | null };
export type PageRecord = Omit<LandingPageDocument, "id"> & { _id: string; owner_id: string; createdAt: Date; updatedAt: Date; integrations?: Integrations };
export type UserRecord = { _id: string; name: string; email: string; password_hash: string; createdAt: Date };
export type SessionRecord = { _id: string; user_id: string; expiresAt: Date };
export type EventRecord = { type: string; pageId: string; componentId?: string; visitorId?: string; timestamp: Date; expiresAt: Date };
export function publicUser(user: UserRecord) { return { id: user._id, name: user.name, email: user.email }; }
export function publicPage(page: PageRecord): LandingPageDocument {
  return { id: page._id, name: page.name, status: page.status, seo: page.seo, components: page.components, ...(page.design ? { design: page.design } : {}) };
}
