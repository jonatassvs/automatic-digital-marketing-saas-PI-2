import type { PageService } from "../services/page.service";
import type { SeoService } from "../services/seo.service";
import type { GeminiService } from "../services/gemini.service";
import type { SeoGenerateInput } from "@/types/page";
import { data, empty, queryInteger, readJson, type ControllerContext as Context } from "./http";

export class PageController {
  constructor(
    private service: PageService,
    private seo: SeoService,
    private gemini?: GeminiService
  ) {}
  list = async ({ request, owner }: Context) => data(await this.service.list(owner, queryInteger(request, "offset", 0, 0, 10000), queryInteger(request, "limit", 20, 1, 100)));
  create = async ({ request, owner }: Context) => data(await this.service.create(await readJson(request), owner), 201);
  get = async ({ params, owner }: Context) => data(await this.service.get(params.pageId, owner));
  update = async ({ params, request, owner }: Context) => data(await this.service.update(params.pageId, await readJson(request), owner));
  delete = async ({ params, owner }: Context) => { await this.service.delete(params.pageId, owner); return empty(); };
  publish = async ({ params, owner }: Context) => data(await this.service.publish(params.pageId, owner, "published"));
  unpublish = async ({ params, owner }: Context) => data(await this.service.publish(params.pageId, owner, "private"));
  duplicate = async ({ params, owner }: Context) => data(await this.service.duplicate(params.pageId, owner), 201);
  updateSeo = async ({ params, request, owner }: Context) => data(await this.service.updateSeo(params.pageId, owner, await readJson(request)));
  analyzeSeo = async ({ params, owner }: Context) => data(this.seo.analyze(await this.service.get(params.pageId, owner)));
  generateSeo = async ({ params, request, owner }: Context) => {
    const page = await this.service.get(params.pageId, owner);
    const body = (await readJson(request).catch(() => ({}))) as Omit<SeoGenerateInput, "businessName" | "pageContent">;
    if (!this.gemini) {
      throw new Error("Gemini service unavailable");
    }
    return data(await this.gemini.generateForPage(page, body));
  };
  published = async ({ params }: Context) => data(await this.service.published(params.slug));
}
