import "server-only";
import type { PageService } from "./page.service";
import { object, text } from "../validators/common";
import { requireValid } from "../errors";
import type { Integrations } from "../models/entities";
export class IntegrationService {
  constructor(private pages: PageService) {}
  async get(id: string, owner: string) { return (await this.pages.owned(id, owner)).integrations ?? { gtm: null }; }
  async published(slug: string) { return (await this.pages.publishedRecord(slug)).integrations ?? { gtm: null }; }
  async update(id: string, owner: string, payload: unknown) {
    await this.pages.owned(id, owner);
    const data = object(payload, ["gtm"], ["gtm"]);
    let integrations: Integrations = { gtm: null };
    if (data.gtm !== null) {
      const gtm = object(data.gtm, ["containerId"], ["containerId"]);
      const containerId = text(gtm.containerId, 24);
      requireValid(/^GTM-[A-Z0-9]{4,20}$/.test(containerId), "ID do GTM invalido.");
      integrations = { gtm: { containerId } };
    }
    await this.pages.save(id, owner, { integrations }); return integrations;
  }
}
