import { ApiError, requireValid } from "../errors";
import { object, text } from "./common";

const BOT_USER_AGENT_PATTERN =
  /\b(curl|wget|python-requests|python-urllib|aiohttp|httpx|go-http-client|scrapy|sqlmap|nikto|masscan|zgrab|nmap|headlesschrome|phantomjs|selenium|webdriver)\b/i;

export function verifyBotHeaders(request: Request): void {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (userAgent && BOT_USER_AGENT_PATTERN.test(userAgent)) {
    throw new ApiError("Acesso automatizado de bot bloqueado.", 403, "bot_detected");
  }
}

export function validateAuth(value: unknown, register = false) {
  const allowedKeys = register
    ? ["email", "password", "name", "recaptchaToken", "website"]
    : ["email", "password", "recaptchaToken", "website"];
  const requiredKeys = register ? ["email", "password", "name"] : ["email", "password"];
  const data = object(value, allowedKeys, requiredKeys);

  // Honeypot check: real users never see or fill the hidden "website" field; bots auto-fill it.
  if (Object.hasOwn(data, "website") && data.website !== undefined && data.website !== "") {
    throw new ApiError("Atividade automatizada bloqueada.", 422, "bot_detected");
  }

  const email = text(data.email, 254, 3).trim().toLowerCase();
  requireValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Email invalido.");

  const password = data.password;
  requireValid(
    typeof password === "string" && password.length >= 12 && password.length <= 128,
    "A senha deve ter de 12 a 128 caracteres."
  );

  const name = register ? text(data.name, 100, 1).trim() : "";
  if (register) requireValid(name, "Informe seu nome.");

  let recaptchaToken = "";
  if (Object.hasOwn(data, "recaptchaToken") && data.recaptchaToken !== undefined) {
    if (typeof data.recaptchaToken !== "string") {
      throw new ApiError("Token reCAPTCHA invalido.", 422, "captcha_invalid");
    }
    recaptchaToken = data.recaptchaToken.trim();
    if (
      recaptchaToken.length < 20 ||
      recaptchaToken.length > 4096 ||
      !/^[A-Za-z0-9._-]+$/.test(recaptchaToken)
    ) {
      throw new ApiError("Token reCAPTCHA invalido ou expirado.", 422, "captcha_invalid");
    }
  }

  return { email, password, name, recaptchaToken };
}
