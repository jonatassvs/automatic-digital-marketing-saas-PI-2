import type { IntegrationService } from "../services/integration.service";
import { data, readJson, type ControllerContext } from "./http";
export class IntegrationController {
  constructor(private service: IntegrationService) {}
  get = async ({ params, owner }: ControllerContext) => data(await this.service.get(params.pageId, owner));
  update = async ({ params, owner, request }: ControllerContext) => data(await this.service.update(params.pageId, owner, await readJson(request)));
  published = async ({ params }: ControllerContext) => data(await this.service.published(params.slug));
}
