import "server-only";
export function settings(env: Record<string, string | undefined> = process.env) {
  const clean = (raw: string | undefined) => (raw ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
  const integer = (key: string, fallback: number, max: number) => {
    const raw = clean(env[key]);
    const value = Number(raw ? raw : fallback);
    if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`Invalid ${key}`);
    return value;
  };
  const uri = clean(env.MONGODB_URI);
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) throw new Error("Configure MONGODB_URI in .env.local");
  const database = clean(env.MONGODB_DATABASE) || "landing_builder_shared";
  if (!database || /[/\\. "$*<>:|?]/.test(database)) throw new Error("Invalid database name");
  const rawOrigins = (clean(env.CORS_ORIGINS) || "http://localhost:3000")
    .split(",")
    .map(value => clean(value))
    .filter(Boolean);
  const origins: string[] = [];
  for (const origin of rawOrigins) {
    if (origin.includes("*")) throw new Error("Invalid CORS origin");
    const normalized = origin.replace(/\/+$/, "");
    const parsed = new URL(normalized);
    const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (
      parsed.origin !== normalized ||
      !["http:", "https:"].includes(parsed.protocol) ||
      (env.NODE_ENV === "production" && parsed.protocol !== "https:" && !isLocalhost)
    ) {
      throw new Error("Invalid CORS origin");
    }
    origins.push(parsed.origin);
  }
  for (const vercelHost of [clean(env.VERCEL_URL), clean(env.VERCEL_PROJECT_PRODUCTION_URL)]) {
    if (vercelHost) {
      try {
        const parsed = new URL(vercelHost.startsWith("http") ? vercelHost : `https://${vercelHost}`);
        if (!origins.includes(parsed.origin)) origins.push(parsed.origin);
      } catch {
        // Ignore malformed auto-injected host
      }
    }
  }
  const clientIpHeader = clean(env.TRUSTED_CLIENT_IP_HEADER).toLowerCase() || undefined;
  if (clientIpHeader && !/^[a-z0-9-]+$/.test(clientIpHeader)) throw new Error("Invalid trusted IP header");
  const geminiApiKey = clean(env.GEMINI_API_KEY);
  const geminiModel = clean(env.GEMINI_MODEL) || "gemini-3.5-flash";
  const recaptchaSecretKey = clean(env.RECAPTCHA_SECRET_KEY);
  const recaptchaSiteKey = clean(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  return {
    uri,
    database,
    origins,
    clientIpHeader,
    geminiApiKey,
    geminiModel,
    recaptchaSecretKey,
    recaptchaSiteKey,
    sessionHours: integer("SESSION_TTL_HOURS", 12, 168),
    retentionDays: integer("EVENT_RETENTION_DAYS", 90, 365),
  };
}
export type Settings = ReturnType<typeof settings>;
