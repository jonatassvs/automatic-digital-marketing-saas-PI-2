import "server-only";
import type { PageComponent } from "@/types/page";
import type { EventRecord } from "../models/entities";
import type { EventRepository } from "../repositories/event.repository";
import type { PageService } from "./page.service";
import { object, text } from "../validators/common";
import { requireValid } from "../errors";
export class AnalyticsService {
  constructor(private repository: EventRepository, private pages: PageService, readonly retentionDays: number) {}
  async ingest(payload: unknown) {
    const data = object(payload, ["type", "pageId", "componentId", "visitorId"], ["type", "pageId"]);
    const type = text(data.type, 30), pageId = text(data.pageId, 100, 1);
    requireValid(["page_view", "button_click", "form_submit"].includes(type), "Tipo de evento invalido.");
    const page = await this.pages.publishedById(pageId);
    const timestamp = new Date();
    const event: EventRecord = { type, pageId, timestamp, expiresAt: new Date(timestamp.getTime() + this.retentionDays * 86400000) };
    if (Object.hasOwn(data, "visitorId")) {
      event.visitorId = text(data.visitorId, 64, 16);
      requireValid(/^[a-zA-Z0-9_-]+$/.test(event.visitorId), "Identificador anonimo invalido.");
    }
    if (type === "page_view") requireValid(!Object.hasOwn(data, "componentId"), "Visualizacao nao recebe componentId.");
    else {
      const componentId = text(data.componentId, 100, 1);
      const find = (nodes: PageComponent[]): PageComponent | undefined => {
        for (const node of nodes) { if (node.id === componentId) return node; const child = find(node.children ?? []); if (child) return child; }
      };
      requireValid(find(page.components)?.component === (type === "button_click" ? "Button" : "Form"), "Componente incompativel com evento.");
      event.componentId = componentId;
    }
    await this.repository.create(event);
  }
  async summary(id: string, owner: string, days: number) { await this.pages.owned(id, owner); return { days, ...await this.repository.summary(id, new Date(Date.now() - days * 86400000)) }; }
}
