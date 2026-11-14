import "server-only";
import type { Db } from "mongodb";
import { settings, type Settings } from "./config";
import { getDatabase } from "./repositories/database";
import { PageRepository } from "./repositories/page.repository";
import { UserRepository } from "./repositories/user.repository";
import { EventRepository } from "./repositories/event.repository";
import { RateLimitRepository } from "./repositories/rate-limit.repository";
import { PageService } from "./services/page.service";
import { AuthService } from "./services/auth.service";
import { AnalyticsService } from "./services/analytics.service";
import { IntegrationService } from "./services/integration.service";
import { SeoService } from "./services/seo.service";
import { GeminiService } from "./services/gemini.service";
import { AuthController } from "./controllers/auth.controller";
import { PageController } from "./controllers/page.controller";
import { AnalyticsController } from "./controllers/analytics.controller";
import { IntegrationController } from "./controllers/integration.controller";
import { SeoController } from "./controllers/seo.controller";
import { data } from "./controllers/http";
export function createApplication(db: Db, config: Settings, geminiService?: GeminiService) {
  const auth = new AuthService(new UserRepository(db), config.sessionHours);
  const pages = new PageService(new PageRepository(db));
  const gemini = geminiService ?? new GeminiService(config.geminiApiKey, config.geminiModel);
  return { config, auth, gemini, rateLimits: new RateLimitRepository(db), controllers: {
    auth: new AuthController(auth),
    pages: new PageController(pages, new SeoService(), gemini),
    seo: new SeoController(gemini),
    analytics: new AnalyticsController(new AnalyticsService(new EventRepository(db), pages, config.retentionDays)),
    integrations: new IntegrationController(new IntegrationService(pages)),
    health: async () => { await db.command({ ping: 1 }); return data({ status: "ok" }); },
  } };
}
export type Application = ReturnType<typeof createApplication>;
export async function getApplication() { const config = settings(); return createApplication(await getDatabase(config), config); }
