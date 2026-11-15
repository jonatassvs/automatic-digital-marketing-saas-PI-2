import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { MongoServerError } from "mongodb";
import { ApiError } from "../errors";
import { hashPassword, verifyPassword } from "../auth/password";
import { publicUser } from "../models/entities";
import { validateAuth } from "../validators/auth.validator";
import type { UserRepository } from "../repositories/user.repository";
import type { RateLimitRepository } from "../repositories/rate-limit.repository";

export const digest = (token: string) => createHash("sha256").update(token).digest("hex");

// Short-lived cache allowing the same verified reCAPTCHA token to complete the immediate auto-login right after registration.
const verifiedCaptchaPasses = new Map<string, number>();

export class AuthService {
  constructor(
    private repository: UserRepository,
    private ttlHours: number,
    private recaptchaSecretKey = "",
    private rateLimits?: RateLimitRepository
  ) {}

  private async enforceAccountRateLimit(email: string, action: "login" | "register"): Promise<void> {
    if (!this.rateLimits) {
      return;
    }
    const window = Math.floor(Date.now() / 60000);
    const maxAttempts = action === "register" ? 5 : 8;
    const count = await this.rateLimits.increment(
      `auth_${action}_email:${digest(email)}:${window}`,
      new Date((window + 2) * 60000)
    );
    if (count > maxAttempts) {
      throw new ApiError(
        "Muitas tentativas para esta conta. Aguarde um minuto e tente novamente.",
        429,
        "account_rate_limited"
      );
    }
  }

  async verifyRecaptcha(token: string, email: string): Promise<void> {
    const passKey = `${digest(email)}:${token ? digest(token) : "empty"}`;
    const now = Date.now();

    for (const [key, expiresAt] of verifiedCaptchaPasses.entries()) {
      if (expiresAt <= now) {
        verifiedCaptchaPasses.delete(key);
      }
    }

    if (token && verifiedCaptchaPasses.has(passKey)) {
      verifiedCaptchaPasses.delete(passKey);
      return;
    }

    if (!this.recaptchaSecretKey) {
      if (token) {
        verifiedCaptchaPasses.set(passKey, now + 30000);
      }
      return;
    }

    if (!token) {
      throw new ApiError("Confirme o reCAPTCHA para continuar.", 422, "captcha_required");
    }

    const body = new URLSearchParams({
      secret: this.recaptchaSecretKey,
      response: token
    });

    let verified = false;
    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        const result = (await response.json()) as { success?: boolean; score?: number };
        verified = Boolean(result.success) && (result.score === undefined || result.score >= 0.5);
      }
    } catch {
      throw new ApiError(
        "Nao foi possivel validar o reCAPTCHA no momento. Tente novamente.",
        503,
        "captcha_unavailable"
      );
    }

    if (!verified) {
      throw new ApiError("Verificacao reCAPTCHA invalida ou expirada.", 422, "captcha_failed");
    }

    verifiedCaptchaPasses.set(passKey, now + 30000);
  }

  async register(payload: unknown) {
    const fields = validateAuth(payload, true);
    await this.enforceAccountRateLimit(fields.email, "register");
    await this.verifyRecaptcha(fields.recaptchaToken, fields.email);

    const user = {
      _id: randomUUID(),
      name: fields.name,
      email: fields.email,
      password_hash: await hashPassword(fields.password),
      createdAt: new Date()
    };
    try {
      await this.repository.create(user);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ApiError("Nao foi possivel cadastrar esse email.", 409, "email_unavailable");
      }
      throw error;
    }
    return publicUser(user);
  }

  async login(payload: unknown) {
    const fields = validateAuth(payload);
    await this.enforceAccountRateLimit(fields.email, "login");
    await this.verifyRecaptcha(fields.recaptchaToken, fields.email);

    const user = await this.repository.byEmail(fields.email);
    const valid = await verifyPassword(
      fields.password,
      user?.password_hash ?? `scrypt:32768:8:1$dummylogin$${"0".repeat(128)}`
    );
    if (!user || !valid) {
      throw new ApiError("Email ou senha incorretos.", 401, "invalid_credentials");
    }
    const accessToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + this.ttlHours * 3600000);
    await this.repository.createSession({ _id: digest(accessToken), user_id: user._id, expiresAt });
    return {
      accessToken,
      tokenType: "Bearer",
      expiresAt: expiresAt.toISOString(),
      user: publicUser(user)
    };
  }

  async authenticate(token: string) {
    const session = await this.repository.session(digest(token));
    const user = session ? await this.repository.byId(session.user_id) : null;
    if (!user) throw new ApiError("Sessao invalida ou expirada.", 401, "unauthorized");
    return publicUser(user);
  }

  logout(token: string) {
    return this.repository.deleteSession(digest(token));
  }
}
