import { ApiError, requireValid } from "../errors";
export const data = (value: unknown, status = 200) => Response.json({ data: value }, { status });
export const empty = (status = 204) => new Response(null, { status });
export function queryInteger(request: Request, name: string, fallback: number, min: number, max: number) {
  const raw = new URL(request.url).searchParams.get(name);
  requireValid(raw === null || /^\d+$/.test(raw), "Parametro de consulta invalido.");
  const value = raw === null ? fallback : Number(raw);
  requireValid(Number.isSafeInteger(value) && value >= min && value <= max, "Parametro fora do intervalo.");
  return value;
}
export async function readJson(request: Request, maximum = 512 * 1024): Promise<unknown> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) throw new ApiError("Use application/json.", 415, "unsupported_media_type");
  if (Number(request.headers.get("content-length")) > maximum) throw new ApiError("Corpo muito grande.", 413, "payload_too_large");
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = []; let length = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        length += value.byteLength;
        if (length > maximum) { await reader.cancel(); throw new ApiError("Corpo muito grande.", 413, "payload_too_large"); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
  catch { throw new ApiError("JSON invalido.", 400, "invalid_json"); }
}
export type ControllerContext = { request: Request; params: Record<string, string>; owner: string; token: string };
