import type { AnalyticsService } from "../services/analytics.service";
import { data, empty, queryInteger, readJson, type ControllerContext } from "./http";
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}
  ingest = async ({ request }: ControllerContext) => { await this.service.ingest(await readJson(request, 2048)); return empty(202); };
  summary = async ({ request, params, owner }: ControllerContext) => data(await this.service.summary(params.pageId, owner, queryInteger(request, "days", Math.min(30, this.service.retentionDays), 1, this.service.retentionDays)));
}
