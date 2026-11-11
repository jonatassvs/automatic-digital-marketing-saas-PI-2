import { requireValid } from "../errors";
import { object, text } from "./common";
export function validateAuth(value: unknown, register = false) {
  const keys = register ? ["email", "password", "name"] : ["email", "password"];
  const data = object(value, keys, keys);
  const email = text(data.email, 254, 3).trim().toLowerCase();
  requireValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Email invalido.");
  const password = data.password;
  requireValid(typeof password === "string" && password.length >= 12 && password.length <= 128, "A senha deve ter de 12 a 128 caracteres.");
  const name = register ? text(data.name, 100, 1).trim() : "";
  if (register) requireValid(name, "Informe seu nome.");
  return { email, password, name };
}
