import "server-only";
export function settings(env: Record<string, string | undefined> = process.env) {
  const integer = (key: string, fallback: number, max: number) => {
    const value = Number(env[key] ?? fallback);
    if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`Invalid ${key}`);
    return value;
  };
  const uri = env.MONGODB_URI ?? "";
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) throw new Error("Configure MONGODB_URI in .env.local");
  const database = env.MONGODB_DATABASE ?? "landing_builder_shared";
  if (!database || /[/\\. "$*<>:|?]/.test(database)) throw new Error("Invalid database name");
  const origins = (env.CORS_ORIGINS ?? "http://localhost:3000").split(",").map(value => value.trim()).filter(Boolean);
  for (const origin of origins) {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || !["http:", "https:"].includes(parsed.protocol) || origin.includes("*") || (env.NODE_ENV === "production" && parsed.protocol !== "https:")) throw new Error("Invalid CORS origin");
  }
  const clientIpHeader = env.TRUSTED_CLIENT_IP_HEADER?.toLowerCase();
  if (clientIpHeader && !/^[a-z0-9-]+$/.test(clientIpHeader)) throw new Error("Invalid trusted IP header");
  const geminiApiKey = env.GEMINI_API_KEY?.trim() || "";
  const geminiModel = env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  return {
    uri,
    database,
    origins,
    clientIpHeader,
    geminiApiKey,
    geminiModel,
    sessionHours: integer("SESSION_TTL_HOURS", 12, 168),
    retentionDays: integer("EVENT_RETENTION_DAYS", 90, 365),
  };
}
export type Settings = ReturnType<typeof settings>;
