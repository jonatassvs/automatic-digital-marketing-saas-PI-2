import { ApiError, requireValid } from "../errors";

export function object(value: unknown, allowed: string[], required: string[] = []): Record<string, unknown> {
  requireValid(value !== null && typeof value === "object" && !Array.isArray(value), "Esperado objeto JSON.");
  const result = value as Record<string, unknown>;
  requireValid(Object.keys(result).every(key => allowed.includes(key)), "Campos nao permitidos.");
  requireValid(required.every(key => Object.hasOwn(result, key)), "Campos obrigatorios ausentes.");
  return result;
}
export function text(value: unknown, max = 10000, min = 0): string {
  requireValid(typeof value === "string" && value.length >= min && value.length <= max, "Texto invalido.");
  requireValid(!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value) && !/<\s*\/?\s*[a-z!]|\bon[a-z]+\s*=/i.test(value), "HTML e atributos executaveis nao permitidos.");
  return value;
}
export function number(value: unknown, min: number, max: number, integer = false): number {
  requireValid(typeof value === "number" && Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value)), "Numero invalido.");
  return value;
}
export function boolean(value: unknown): boolean { requireValid(typeof value === "boolean", "Booleano invalido."); return value; }
export function url(value: unknown, absolute = false, image = false): string {
  const result = text(value, 2048);
  if (!result) return result;
  requireValid(!/[\s\x00-\x1f\x7f\\]/.test(result) && !result.startsWith("//"), "URL invalida.");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(result)?.[1].toLowerCase();
  requireValid(!scheme || (absolute || image ? ["http", "https"] : ["http", "https", "mailto", "tel"]).includes(scheme), "Protocolo nao permitido.");
  if (absolute || scheme === "http" || scheme === "https") {
    requireValid(/^https?:\/\//i.test(result), "Use URL HTTP ou HTTPS completa.");
    let parsed: URL;
    try { parsed = new URL(result); } catch { throw new ApiError("URL invalida."); }
    requireValid(parsed.hostname && !parsed.username && !parsed.password, "URL invalida.");
  }
  return result;
}
