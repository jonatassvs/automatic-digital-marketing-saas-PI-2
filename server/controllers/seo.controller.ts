import type { GeminiService } from "../services/gemini.service";
import type { SeoGenerateInput } from "@/types/page";
import { data, readJson, type ControllerContext as Context } from "./http";

export class SeoController {
  constructor(private gemini: GeminiService) {}

  generate = async ({ request }: Context) => {
    const body = (await readJson(request)) as SeoGenerateInput;
    return data(await this.gemini.generateSeo(body));
  };
}
