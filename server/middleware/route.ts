import "server-only";
import { isIP } from "node:net";
import { MongoError } from "mongodb";
import { ApiError } from "../errors";
import { digest } from "../services/auth.service";
import { getApplication, type Application } from "../application";
import type { ControllerContext } from "../controllers/http";

type Action = (app: Application, context: ControllerContext) => Promise<Response>;
type RouteContext = { params: Promise<Record<string, string>> };
export function route(action: Action, publicAccess = false, provider: () => Promise<Application> = getApplication) {
  return async (request: Request, context: RouteContext) => {
    let application: Application | undefined;
    let response: Response;
    const origin = request.headers.get("origin");
    let allowedOrigin = false;
    try {
      application = await provider();
      const requestUrl = new URL(request.url);
      const path = requestUrl.pathname;
      const publicCors = path.startsWith("/api/public/") || path === "/api/events";
      allowedOrigin = Boolean(
        origin && (publicCors || origin === requestUrl.origin || application.config.origins.includes(origin))
      );
      if (origin && !allowedOrigin) throw new ApiError("Origem nao permitida.", 403, "origin_denied");
      if (request.method === "OPTIONS") response = new Response(null, { status: 200 });
      else {
        const bucket = path.includes("/seo/generate")
          ? "ai"
          : path.startsWith("/api/auth/") && request.method === "POST"
          ? "auth"
          : path === "/api/events"
          ? "events"
          : "api";
        const maximum = { auth: 10, events: 120, api: 300, ai: 10 }[bucket];
        // Only use a header when deployment guarantees its proxy overwrites it.
        const candidate = application.config.clientIpHeader ? request.headers.get(application.config.clientIpHeader) : null;
        const identity = candidate && isIP(candidate) ? candidate : "shared";
        const window = Math.floor(Date.now() / 60000);
        const count = await application.rateLimits.increment(`${bucket}:${digest(identity)}:${window}`, new Date((window + 2) * 60000));
        if (count > maximum) throw new ApiError("Muitas requisicoes. Tente novamente em um minuto.", 429, "rate_limited");
        let token = "", owner = "";
        if (!publicAccess) {
          const authorization = request.headers.get("authorization") ?? "";
          if (!/^Bearer [A-Za-z0-9_-]{43}$/.test(authorization)) throw new ApiError("Autenticacao necessaria.", 401, "unauthorized");
          token = authorization.slice(7); owner = (await application.auth.authenticate(token)).id;
        }
        response = await action(application, { request, params: await context.params, owner, token });
      }
    } catch (error) {
      const failure = error instanceof ApiError ? error : new ApiError("Servico temporariamente indisponivel.", error instanceof MongoError || !application ? 503 : 500, "internal_error");
      // Never log connection strings, raw request bodies, tokens, or driver messages.
      if (!(error instanceof ApiError)) console.error("API request failed", { type: error instanceof Error ? error.name : "UnknownError" });
      response = Response.json({ error: { code: failure.code, message: failure.message } }, { status: failure.status });
    }
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("Vary", "Origin");
    if (process.env.NODE_ENV === "production") response.headers.set("Strict-Transport-Security", "max-age=31536000");
    if (response.status === 429) response.headers.set("Retry-After", "60");
    if (allowedOrigin && origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    }
    return response;
  };
}
