import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:32768:8:1$${salt}$${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password: string, hash: string) {
  // Preserve Werkzeug's existing scrypt format so migrated accounts keep working.
  const parts = hash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt:32768:8:1" || !/^[a-zA-Z0-9]{1,64}$/.test(parts[1]) || !/^[a-f0-9]{128}$/i.test(parts[2])) return false;
  return timingSafeEqual(await derive(password, parts[1]), Buffer.from(parts[2], "hex"));
}
