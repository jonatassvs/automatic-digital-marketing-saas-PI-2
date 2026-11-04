import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { MongoServerError } from "mongodb";
import { ApiError } from "../errors";
import { hashPassword, verifyPassword } from "../auth/password";
import { publicUser } from "../models/entities";
import { validateAuth } from "../validators/auth.validator";
import type { UserRepository } from "../repositories/user.repository";
export const digest = (token: string) => createHash("sha256").update(token).digest("hex");
export class AuthService {
  constructor(private repository: UserRepository, private ttlHours: number) {}
  async register(payload: unknown) {
    const fields = validateAuth(payload, true);
    const user = { _id: randomUUID(), name: fields.name, email: fields.email, password_hash: await hashPassword(fields.password), createdAt: new Date() };
    try { await this.repository.create(user); }
    catch (error) { if (error instanceof MongoServerError && error.code === 11000) throw new ApiError("Nao foi possivel cadastrar esse email.", 409, "email_unavailable"); throw error; }
    return publicUser(user);
  }
  async login(payload: unknown) {
    const fields = validateAuth(payload);
    const user = await this.repository.byEmail(fields.email);
    const valid = await verifyPassword(fields.password, user?.password_hash ?? `scrypt:32768:8:1$dummylogin$${"0".repeat(128)}`);
    if (!user || !valid) throw new ApiError("Email ou senha incorretos.", 401, "invalid_credentials");
    const accessToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + this.ttlHours * 3600000);
    await this.repository.createSession({ _id: digest(accessToken), user_id: user._id, expiresAt });
    return { accessToken, tokenType: "Bearer", expiresAt: expiresAt.toISOString(), user: publicUser(user) };
  }
  async authenticate(token: string) {
    const session = await this.repository.session(digest(token));
    const user = session ? await this.repository.byId(session.user_id) : null;
    if (!user) throw new ApiError("Sessao invalida ou expirada.", 401, "unauthorized");
    return publicUser(user);
  }
  logout(token: string) { return this.repository.deleteSession(digest(token)); }
}
